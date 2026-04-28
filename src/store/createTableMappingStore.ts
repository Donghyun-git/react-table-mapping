import type { FieldItem, Mapping, NotifyAction } from '@/types/table-mapping';

type Side = 'source' | 'target';
type FieldTopic = `field:${'source' | 'target'}:${string}:${string}`;
type ListTopic = 'sources:list' | 'targets:list' | 'mappings';
export type StoreTopic = FieldTopic | ListTopic;

export interface StoreSnapshot {
  sources: FieldItem[];
  targets: FieldItem[];
  mappings: Mapping[];
}

type EmitCallback = (action: NotifyAction, snapshot: StoreSnapshot) => void;

export interface TableMappingStore {
  getSnapshot(): StoreSnapshot;
  getFieldValue(side: Side, id: string, columnKey: string): string;
  subscribe(topic: StoreTopic, listener: () => void): () => void;
  applyExternalProps(next: StoreSnapshot): void;
  setFieldValue(side: Side, id: string, columnKey: string, value: string, opts?: { immediate?: boolean }): void;
  appendSource(item: FieldItem): void;
  appendTarget(item: FieldItem): void;
  removeSource(id: string): void;
  removeTarget(id: string): void;
  addMapping(sourceId: string, targetId: string): void;
  removeMapping(mappingId: string): void;
  clearMappings(): void;
  updateMappings(next: Mapping[]): void;
  sameLineMapping(): void;
  sameNameMapping(name: string): void;
  updateSourceFields(next: FieldItem[]): void;
  updateTargetFields(next: FieldItem[]): void;
}

export interface StoreConfig {
  initial: StoreSnapshot;
  emit: EmitCallback;
  valueUpdateDebounceMs?: number;
}

export function createTableMappingStore({
  initial,
  emit: emitCallback,
  valueUpdateDebounceMs = 300,
}: StoreConfig): TableMappingStore {
  const state = {
    sources: initial.sources,
    targets: initial.targets,
    mappings: initial.mappings,
  };

  const listeners = new Map<StoreTopic, Set<() => void>>();
  const pendingValueTimers = new Map<string, ReturnType<typeof setTimeout>>();

  // Tracks the snapshot we last sent to the consumer — used for echo detection.
  let lastNotifiedSnapshot: StoreSnapshot = {
    sources: initial.sources,
    targets: initial.targets,
    mappings: initial.mappings,
  };

  function notifyTopic(topic: StoreTopic) {
    listeners.get(topic)?.forEach((cb) => cb());
  }

  function notifyAllFieldTopics(side: Side) {
    for (const topic of listeners.keys()) {
      if (topic.startsWith(`field:${side}:`)) {
        notifyTopic(topic as StoreTopic);
      }
    }
  }

  function _snapshot(): StoreSnapshot {
    return { sources: state.sources, targets: state.targets, mappings: state.mappings };
  }

  function _emit(action: NotifyAction) {
    lastNotifiedSnapshot = _snapshot();
    emitCallback(action, lastNotifiedSnapshot);
  }

  function _emitFieldValueAction(side: Side, id: string, columnKey: string) {
    const fields = side === 'source' ? state.sources : state.targets;
    const field = fields.find((f) => f.id === id);

    if (!field) return;

    const param = field[columnKey];
    const currentValue = typeof param === 'string' ? param : (param?.value ?? '');
    const action: NotifyAction =
      side === 'source'
        ? { type: 'UPDATE_SOURCE_FIELD_VALUE', payload: { sourceId: id, fieldKey: columnKey, newValue: currentValue } }
        : { type: 'UPDATE_TARGET_FIELD_VALUE', payload: { targetId: id, fieldKey: columnKey, newValue: currentValue } };
    _emit(action);
  }

  function _cancelTimersForSide(side: Side) {
    for (const key of [...pendingValueTimers.keys()]) {
      if (key.startsWith(`${side}:`)) {
        clearTimeout(pendingValueTimers.get(key)!);
        pendingValueTimers.delete(key);
      }
    }
  }

  function _flushPendingValueEmits() {
    for (const [key, timer] of pendingValueTimers) {
      clearTimeout(timer);
      const parts = key.split(':');
      const side = parts[0] as Side;
      const id = parts[1];
      const columnKey = parts.slice(2).join(':');
      _emitFieldValueAction(side, id, columnKey);
    }
    pendingValueTimers.clear();
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  function getSnapshot(): StoreSnapshot {
    return _snapshot();
  }

  function getFieldValue(side: Side, id: string, columnKey: string) {
    const fields = side === 'source' ? state.sources : state.targets;
    const field = fields.find((f) => f.id === id);

    if (!field) return '';

    const param = field[columnKey];

    if (param === undefined || param === null) return '';
    if (typeof param === 'string') return param;

    if (!(param.type === 'string')) {
      return param.value ?? param.defaultValue ?? '';
    }

    return '';
  }

  function subscribe(topic: StoreTopic, listener: () => void): () => void {
    if (!listeners.has(topic)) listeners.set(topic, new Set());

    listeners.get(topic)!.add(listener);

    return () => {
      listeners.get(topic)?.delete(listener);
    };
  }

  function applyExternalProps(next: StoreSnapshot) {
    const sourcesEcho = next.sources === lastNotifiedSnapshot.sources;
    const targetsEcho = next.targets === lastNotifiedSnapshot.targets;
    const mappingsEcho = next.mappings === lastNotifiedSnapshot.mappings;

    if (sourcesEcho && targetsEcho && mappingsEcho) return;

    if (!sourcesEcho) {
      _cancelTimersForSide('source');
      state.sources = next.sources;
      notifyTopic('sources:list');
      notifyAllFieldTopics('source');
    }

    if (!targetsEcho) {
      _cancelTimersForSide('target');
      state.targets = next.targets;
      notifyTopic('targets:list');
      notifyAllFieldTopics('target');
    }

    if (!mappingsEcho) {
      state.mappings = next.mappings;
      notifyTopic('mappings');
    }
  }

  function setFieldValue(side: Side, id: string, columnKey: string, value: string, opts?: { immediate?: boolean }) {
    const fields = side === 'source' ? state.sources : state.targets;
    const fieldIndex = fields.findIndex((f) => f.id === id);
    if (fieldIndex === -1) return;

    const field = fields[fieldIndex];
    const param = field[columnKey];

    if (!param || typeof param === 'string') return;

    if (!['string', 'input', 'select'].includes(param.type)) return;

    const newField = { ...field, [columnKey]: { ...param, value } };
    const newFields = [...fields];
    newFields[fieldIndex] = newField;

    if (side === 'source') {
      state.sources = newFields;
    } else {
      state.targets = newFields;
    }

    notifyTopic(`field:${side}:${id}:${columnKey}` as StoreTopic);

    const timerKey = `${side}:${id}:${columnKey}`;

    if (opts?.immediate) {
      if (pendingValueTimers.has(timerKey)) {
        clearTimeout(pendingValueTimers.get(timerKey)!);
        pendingValueTimers.delete(timerKey);
      }

      _emitFieldValueAction(side, id, columnKey);
      return;
    }

    if (pendingValueTimers.has(timerKey)) clearTimeout(pendingValueTimers.get(timerKey)!);
    const timer = setTimeout(() => {
      pendingValueTimers.delete(timerKey);
      _emitFieldValueAction(side, id, columnKey);
    }, valueUpdateDebounceMs);

    pendingValueTimers.set(timerKey, timer);
  }

  function appendSource(item: FieldItem) {
    _flushPendingValueEmits();
    state.sources = [...state.sources, item];
    notifyTopic('sources:list');
    _emit({ type: 'APPEND_SOURCE', payload: { source: item } });
  }

  function appendTarget(item: FieldItem) {
    _flushPendingValueEmits();
    state.targets = [...state.targets, item];
    notifyTopic('targets:list');
    _emit({ type: 'APPEND_TARGET', payload: { target: item } });
  }

  function removeSource(id: string) {
    _flushPendingValueEmits();
    const removedMappings = state.mappings.filter((m) => m.source === id);
    state.sources = state.sources.filter((f) => f.id !== id);
    state.mappings = state.mappings.filter((m) => m.source !== id);
    notifyTopic('sources:list');
    notifyTopic('mappings');
    _emit({ type: 'REMOVE_SOURCE', payload: { sourceId: id, removedMappings } });
  }

  function removeTarget(id: string) {
    _flushPendingValueEmits();
    const removedMappings = state.mappings.filter((m) => m.target === id);
    state.targets = state.targets.filter((f) => f.id !== id);
    state.mappings = state.mappings.filter((m) => m.target !== id);
    notifyTopic('targets:list');
    notifyTopic('mappings');
    _emit({ type: 'REMOVE_TARGET', payload: { targetId: id, removedMappings } });
  }

  function addMapping(sourceId: string, targetId: string) {
    _flushPendingValueEmits();
    if (state.mappings.find((m) => m.source === sourceId && m.target === targetId)) return;
    const newMapping: Mapping = { id: `mapping-${sourceId}-${targetId}`, source: sourceId, target: targetId };
    state.mappings = [...state.mappings, newMapping];
    notifyTopic('mappings');
    _emit({ type: 'ADD_MAPPING', payload: { sourceId, targetId, mapping: newMapping } });
  }

  function removeMapping(mappingId: string) {
    _flushPendingValueEmits();
    const removedMapping = state.mappings.find((m) => m.id === mappingId);
    state.mappings = state.mappings.filter((m) => m.id !== mappingId);
    notifyTopic('mappings');
    _emit({ type: 'REMOVE_MAPPING', payload: { mappingId, removedMapping } });
  }

  function clearMappings() {
    _flushPendingValueEmits();
    const clearedMappings = [...state.mappings];
    state.mappings = [];
    notifyTopic('mappings');
    _emit({ type: 'CLEAR_MAPPINGS', payload: { clearedMappings } });
  }

  function updateMappings(next: Mapping[]) {
    _flushPendingValueEmits();
    const previousMappings = [...state.mappings];
    state.mappings = next;
    notifyTopic('mappings');
    _emit({ type: 'UPDATE_MAPPINGS', payload: { previousMappings, newMappings: next } });
  }

  function sameLineMapping() {
    _flushPendingValueEmits();
    const previousMappings = [...state.mappings];
    const minLength = Math.min(state.sources.length, state.targets.length);
    const newMappings: Mapping[] = Array.from({ length: minLength }, (_, i) => ({
      id: `mapping-${state.sources[i].id}-${state.targets[i].id}`,
      source: state.sources[i].id,
      target: state.targets[i].id,
    }));
    state.mappings = newMappings;
    notifyTopic('mappings');
    _emit({ type: 'SAME_LINE_MAPPING', payload: { previousMappings, newMappings } });
  }

  function sameNameMapping(name: string) {
    _flushPendingValueEmits();
    const previousMappings = [...state.mappings];
    const newMappings: Mapping[] = [];
    state.sources.forEach((source) => {
      state.targets.forEach((target) => {
        if (typeof source[name] === 'string' || typeof target[name] === 'string') return;
        if (!source[name]?.columnKey || !target[name]?.columnKey) throw new Error('columnKey is required');
        if (source[name]?.value === target[name]?.value) {
          newMappings.push({ id: `mapping-${source.id}-${target.id}`, source: source.id, target: target.id });
        }
      });
    });
    state.mappings = newMappings;
    notifyTopic('mappings');
    _emit({ type: 'SAME_NAME_MAPPING', payload: { name, previousMappings, newMappings } });
  }

  function updateSourceFields(next: FieldItem[]) {
    _flushPendingValueEmits();
    const previousSources = [...state.sources];
    state.sources = next;
    notifyTopic('sources:list');
    _emit({ type: 'UPDATE_SOURCE_FIELDS', payload: { previousSources, newSources: next } });
  }

  function updateTargetFields(next: FieldItem[]) {
    _flushPendingValueEmits();
    const previousTargets = [...state.targets];
    state.targets = next;
    notifyTopic('targets:list');
    _emit({ type: 'UPDATE_TARGET_FIELDS', payload: { previousTargets, newTargets: next } });
  }

  return {
    getSnapshot,
    getFieldValue,
    subscribe,
    applyExternalProps,
    setFieldValue,
    appendSource,
    appendTarget,
    removeSource,
    removeTarget,
    addMapping,
    removeMapping,
    clearMappings,
    updateMappings,
    sameLineMapping,
    sameNameMapping,
    updateSourceFields,
    updateTargetFields,
  };
}
