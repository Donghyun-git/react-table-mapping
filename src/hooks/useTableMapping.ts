import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useTableMapping = () => {
  const [sourceFields, setSourceFields] = useState<FieldItem[]>([]);
  const [targetFields, setTargetFields] = useState<FieldItem[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>([]);

  console.log(sourceFields, 'sourceFields');
  console.log(targetFields, 'targetFields');

  /**
   * you can get current source fields.
   */
  const getSourceFields = useCallback(() => sourceFields, [sourceFields]);

  /**
   * you can get current target fields.
   */
  const getTargetFields = useCallback(() => targetFields, [targetFields]);

  /**
   * you can get current mappings.
   */
  const getMappings = useCallback(() => mappings, [mappings]);

  /**
   * you can append source field.
   * @param source
   */
  const appendSource = useCallback((source: FieldItem) => {
    setSourceFields((prev) => [...prev, { ...source, id: source.id ? source.id : `source-${uuidv4()}` } as FieldItem]);
  }, []);

  /**
   * you can append target field.
   * @param target
   */
  const appendTarget = useCallback((target: FieldItem) => {
    setTargetFields((prev) => [...prev, { ...target, id: target.id ? target.id : `target-${uuidv4()}` } as FieldItem]);
  }, []);

  /**
   * you can remove source field.
   * @param id
   */
  const removeSource = useCallback((sourceId: string) => {
    setMappings((prev) => prev.filter((mapping) => mapping.source !== sourceId));
    setSourceFields((prev) => prev.filter((field) => field.id !== sourceId));
  }, []);

  /**
   * you can remove target field.
   * @param targetId
   */
  const removeTarget = useCallback((targetId: string) => {
    setMappings((prev) => prev.filter((mapping) => mapping.target !== targetId));
    setTargetFields((prev) => prev.filter((field) => field.id !== targetId));
  }, []);

  /**
   * you can same name mapping.
   *
   * @example
   * ```
   * const { sameNameMapping } = useTableMapping();
   *
   * const handleSameNameMapping = () => {
   *   sameNameMapping();
   * }
   * ```
   */
  const sameNameMapping = useCallback(
    (name: string) => {
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

      setMappings(sameNameMappings);
    },
    [sourceFields, targetFields],
  );

  /**
   * you can mapping same line.
   */
  const sameLineMapping = useCallback(() => {
    const minLength = Math.min(sourceFields.length, targetFields.length);
    const sameLineMappings: Mapping[] = [];

    for (let i = 0; i < minLength; i++) {
      sameLineMappings.push({
        id: `mapping-${sourceFields[i].id}-${targetFields[i].id}`,
        source: sourceFields[i].id,
        target: targetFields[i].id,
      });
    }

    setMappings(sameLineMappings);
  }, [sourceFields, targetFields]);

  /**
   * set mappings.
   */
  const updateMappings = useCallback((mappings: Mapping[]) => {
    setMappings(mappings);
  }, []);

  /**
   * you can clear all mappings.
   *
   * @example
   * ```
   * const { clearMappings } = useTableMapping();
   *
   * const handleMappingClear = () => {
   *   clearMappings();
   * }
   * ```
   */
  const clearMappings = useCallback(() => {
    setMappings([]);
  }, []);

  /**
   * you can add a new mapping between source and target
   * @param sourceId
   * @param targetId
   */
  const addMapping = useCallback((sourceId: string, targetId: string) => {
    // 이미 존재하는 매핑인지 확인
    setMappings((prev) => {
      if (prev.some((mapping) => mapping.source === sourceId && mapping.target === targetId)) {
        return prev; // 이미 존재하면 변경하지 않음
      }
      return [
        ...prev,
        {
          id: `mapping-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
        },
      ];
    });
  }, []);

  /**
   * you can remove a specific mapping by id
   * @param mappingId
   */
  const removeMapping = useCallback((mappingId: string) => {
    setMappings((prev) => prev.filter((mapping) => mapping.id !== mappingId));
  }, []);

  /**
   * you can update all source fields at once
   * @param newSourceFields
   */
  const updateSourceFields = useCallback((newSourceFields: FieldItem[]) => {
    setSourceFields(newSourceFields);
  }, []);

  /**
   * you can update all target fields at once
   * @param newTargetFields
   */
  const updateTargetFields = useCallback((newTargetFields: FieldItem[]) => {
    setTargetFields(newTargetFields);
    // 타겟 필드가 변경되면 관련 매핑도 정리
  }, []);

  const updateSourceFieldValue = useCallback((sourceId: string, fieldKey: string, newValue: string) => {
    setSourceFields((prev) =>
      prev.map((field) =>
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
      ),
    );
  }, []);

  const updateTargetFieldValue = useCallback((targetId: string, fieldKey: string, newValue: string) => {
    setTargetFields((prev) =>
      prev.map((field) =>
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
      ),
    );
  }, []);

  return {
    /**
     * you can get current source fields.
     */
    getSourceFields,

    /**
     * you can get current target fields.
     */
    getTargetFields,

    /**
     * you can get current mappings.
     */
    getMappings,

    /**
     * you can append source field.
     */
    appendSource,

    /**
     * you can append target field.
     */
    appendTarget,

    /**
     * you can remove source field.
     */
    removeSource,

    /**
     * you can remove target field.
     */
    removeTarget,

    /**
     * you can clear all mappings.
     *
     * @example
     * ```
     * const { clearMappings } = useTableMapping();
     *
     * const handleMappingClear = () => {
     *   clearMappings();
     * }
     * ```
     */
    clearMappings,

    /**
     * you can update mappings.
     */
    updateMappings,

    /**
     * you can same name mapping.
     *
     * @example
     * ```
     * const { sameNameMapping } = useTableMapping();
     *
     * const handleSameNameMapping = () => {
     *   sameNameMapping();
     * }
     * ```
     */
    sameNameMapping,

    /**
     * you can mapping same line.
     */
    sameLineMapping,

    /**
     * you can add a new mapping between source and target
     * @param sourceId
     * @param targetId
     */
    addMapping,

    /**
     * you can remove a specific mapping by id
     * @param mappingId
     */
    removeMapping,

    /**
     * you can update all source fields at once
     * @param newSourceFields
     */
    updateSourceFields,

    /**
     * you can update all target fields at once
     * @param newTargetFields
     */
    updateTargetFields,

    /**
     * you can update source field value
     * - when you use `input` or `select` type, you can update value.
     * @param sourceId
     * @param fieldKey
     * @param newValue
     */
    updateSourceFieldValue,

    /**
     * you can update target field value
     * - when you use `input` or `select` type, you can update value.
     * @param targetId
     * @param fieldKey
     * @param newValue
     */
    updateTargetFieldValue,
  };
};
export default useTableMapping;
