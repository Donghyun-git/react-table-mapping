import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type {
  FieldItem,
  FieldItemInput,
  Mapping,
  NotifyAction,
  TableMappingStateWithAction,
} from '@/types/table-mapping';

interface UseTableMappingProps {
  sources: FieldItemInput[];
  targets: FieldItemInput[];
  mappings: Mapping[];

  onStateChange: (stateWithAction: TableMappingStateWithAction) => void;
}

const useTableMapping = ({
  sources: sourcesFromProps,
  targets: targetsFromProps,
  mappings: mappingsFromProps,
  onStateChange,
}: UseTableMappingProps) => {
  const [redrawCount, setRedrawCount] = useState<number>(0);

  const sourceFields = sourcesFromProps as FieldItem[];
  const targetFields = targetsFromProps as FieldItem[];
  const mappings = mappingsFromProps;

  const notifyChange = (
    newSources: FieldItem[],
    newTargets: FieldItem[],
    newMappings: Mapping[],
    action: NotifyAction,
  ) => {
    onStateChange({
      sources: newSources,
      targets: newTargets,
      mappings: newMappings,
      action,
    });
  };

  /**
   * you can redraw the table.
   */
  const redraw = () => {
    setRedrawCount((prev) => prev + 1);
  };

  /**
   * you can append source field.
   * @param source
   */
  const appendSource = (source: FieldItem) => {
    const newSource = {
      ...source,
      id: source.id ? source.id : `source-${uuidv4()}`,
    } as FieldItem;

    const newSources = [...sourceFields, newSource];

    notifyChange(newSources, targetFields, mappings, {
      type: 'APPEND_SOURCE',
      payload: { source: newSource },
    });
  };

  /**
   * you can append target field.
   * @param target
   */
  const appendTarget = (target: FieldItem) => {
    const newTarget = {
      ...target,
      id: target.id ? target.id : `target-${uuidv4()}`,
    } as FieldItem;

    const newTargets = [...targetFields, newTarget];
    notifyChange(sourceFields, newTargets, mappings, {
      type: 'APPEND_TARGET',
      payload: { target: newTarget },
    });
  };

  /**
   * you can remove source field.
   * @param sourceId
   */
  const removeSource = (sourceId: string) => {
    const newSources = sourceFields.filter((field) => field.id !== sourceId);
    const newMappings = mappings.filter((mapping) => mapping.source !== sourceId);
    const removedMappings = mappings.filter((mapping) => mapping.source === sourceId);

    notifyChange(newSources, targetFields, newMappings, {
      type: 'REMOVE_SOURCE',
      payload: { sourceId, removedMappings },
    });
  };

  /**
   * you can remove target field.
   * @param targetId
   */
  const removeTarget = (targetId: string) => {
    const newTargets = targetFields.filter((field) => field.id !== targetId);
    const newMappings = mappings.filter((mapping) => mapping.target !== targetId);
    const removedMappings = mappings.filter((mapping) => mapping.target === targetId);

    notifyChange(sourceFields, newTargets, newMappings, {
      type: 'REMOVE_TARGET',
      payload: { targetId, removedMappings },
    });
  };

  /**
   * you can add a new mapping between source and target
   * @param sourceId
   * @param targetId
   */
  const addMapping = (sourceId: string, targetId: string) => {
    const existingMapping = mappings.find((mapping) => mapping.source === sourceId && mapping.target === targetId);

    if (existingMapping) return;

    const newMapping = {
      id: `mapping-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
    };

    const newMappings = [...mappings, newMapping];
    notifyChange(sourceFields, targetFields, newMappings, {
      type: 'ADD_MAPPING',
      payload: { sourceId, targetId, mapping: newMapping },
    });
  };

  /**
   * you can remove a specific mapping by id
   * @param mappingId
   */
  const removeMapping = (mappingId: string) => {
    const removedMapping = mappings.find((mapping) => mapping.id === mappingId);
    const newMappings = mappings.filter((mapping) => mapping.id !== mappingId);

    notifyChange(sourceFields, targetFields, newMappings, {
      type: 'REMOVE_MAPPING',
      payload: { mappingId, removedMapping },
    });
  };

  /**
   * you can clear all mappings.
   */
  const clearMappings = () => {
    const clearedMappings = [...mappings];
    notifyChange(sourceFields, targetFields, [], {
      type: 'CLEAR_MAPPINGS',
      payload: { clearedMappings },
    });
  };

  /**
   * you can update all source fields at once
   * @param newSourceFields
   */
  const updateSourceFields = (newSourceFields: FieldItem[]) => {
    notifyChange(newSourceFields, targetFields, mappings, {
      type: 'UPDATE_SOURCE_FIELDS',
      payload: { previousSources: sourceFields, newSources: newSourceFields },
    });
  };

  /**
   * you can update all target fields at once
   * @param newTargetFields
   */
  const updateTargetFields = (newTargetFields: FieldItem[]) => {
    notifyChange(sourceFields, newTargetFields, mappings, {
      type: 'UPDATE_TARGET_FIELDS',
      payload: { previousTargets: targetFields, newTargets: newTargetFields },
    });
  };

  /**
   * you can update source field value
   */
  const updateSourceFieldValue = (sourceId: string, fieldKey: string, newValue: string) => {
    const newSources = sourceFields.map((field) =>
      field.id === sourceId &&
      typeof field[fieldKey] !== 'string' &&
      (field[fieldKey]?.type === 'string' || field[fieldKey]?.type === 'input' || field[fieldKey]?.type === 'select')
        ? {
            ...field,
            [fieldKey]: {
              ...field[fieldKey],
              value: newValue,
            },
          }
        : field,
    );

    notifyChange(newSources, targetFields, mappings, {
      type: 'UPDATE_SOURCE_FIELD_VALUE',
      payload: { sourceId, fieldKey, newValue },
    });
  };

  /**
   * you can update target field value
   */
  const updateTargetFieldValue = (targetId: string, fieldKey: string, newValue: string) => {
    const newTargets = targetFields.map((field) =>
      field.id === targetId &&
      typeof field[fieldKey] !== 'string' &&
      (field[fieldKey]?.type === 'string' || field[fieldKey]?.type === 'input' || field[fieldKey]?.type === 'select')
        ? {
            ...field,
            [fieldKey]: {
              ...field[fieldKey],
              value: newValue,
            },
          }
        : field,
    );

    notifyChange(sourceFields, newTargets, mappings, {
      type: 'UPDATE_TARGET_FIELD_VALUE',
      payload: { targetId, fieldKey, newValue },
    });
  };

  /**
   * you can same name mapping.
   */
  const sameNameMapping = (name: string) => {
    const sameNameMappings: Mapping[] = [];

    sourceFields.forEach((source) => {
      targetFields.forEach((target) => {
        if (typeof source[name] === 'string' || typeof target[name] === 'string') {
          return;
        }

        if (source[name]?.columnKey && target[name]?.columnKey) {
          if (source[name]?.value === target[name]?.value) {
            sameNameMappings.push({
              id: `mapping-${source.id}-${target.id}`,
              source: source.id,
              target: target.id,
            });
          }
        } else {
          throw new Error('columnKey is required');
        }
      });
    });

    notifyChange(sourceFields, targetFields, sameNameMappings, {
      type: 'SAME_NAME_MAPPING',
      payload: { name, previousMappings: mappings, newMappings: sameNameMappings },
    });
  };

  /**
   * you can mapping same line.
   */
  const sameLineMapping = () => {
    const minLength = Math.min(sourceFields.length, targetFields.length);
    const sameLineMappings: Mapping[] = [];

    for (let i = 0; i < minLength; i++) {
      sameLineMappings.push({
        id: `mapping-${sourceFields[i].id}-${targetFields[i].id}`,
        source: sourceFields[i].id,
        target: targetFields[i].id,
      });
    }

    notifyChange(sourceFields, targetFields, sameLineMappings, {
      type: 'SAME_LINE_MAPPING',
      payload: { previousMappings: mappings, newMappings: sameLineMappings },
    });
  };

  /**
   * set mappings.
   */
  const updateMappings = (newMappings: Mapping[]) => {
    notifyChange(sourceFields, targetFields, newMappings, {
      type: 'UPDATE_MAPPINGS',
      payload: { previousMappings: mappings, newMappings },
    });
  };

  return {
    sourceFields,
    targetFields,
    mappings,
    redrawCount,
    redraw,
    getSourceFields: () => sourceFields,
    getTargetFields: () => targetFields,
    getMappings: () => mappings,
    appendSource,
    removeSource,
    updateSourceFields,
    updateSourceFieldValue,
    appendTarget,
    removeTarget,
    updateTargetFields,
    updateTargetFieldValue,
    addMapping,
    removeMapping,
    clearMappings,
    updateMappings,
    sameLineMapping,
    sameNameMapping,
  };
};

export default useTableMapping;
