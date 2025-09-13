/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';

import useTableMapping from '@/hooks/useTableMapping';

type TableMappingContextType = ReturnType<typeof useTableMapping>;

const TableMappingContext = createContext<TableMappingContextType | null>(null);

export const TableMappingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tableMapping = useTableMapping();

  return <TableMappingContext.Provider value={tableMapping}>{children}</TableMappingContext.Provider>;
};

const useTableMappingSelector = <T extends unknown>(selector: (context: TableMappingContextType) => T): T => {
  const context = useContext(TableMappingContext);

  if (!context) {
    throw new Error('useTableMappingSelector must be used within a TableMappingProvider');
  }

  return selector(context);
};

export const useSourceFields = () =>
  useTableMappingSelector((ctx) => ({
    /**
     * you can get current source fields.
     */
    sourceFields: ctx.getSourceFields(),

    /**
     * remove source field item
     */
    removeSourceField: ctx.removeSource,

    /**
     * you can append source field item.
     */
    appendSourceField: ctx.appendSource,

    /**
     * you can update all source fields at once
     * @param newSourceFields
     */
    updateSourceFields: ctx.updateSourceFields,

    /**
     * you can update source field value
     * - when you use `input` or `select` type, you can update value.
     * @param sourceId
     * @param fieldKey
     * @param newValue
     */
    updateSourceFieldValue: ctx.updateSourceFieldValue,
  }));

export const useTargetFields = () =>
  useTableMappingSelector((ctx) => ({
    /**
     * you can get current target fields.
     */
    targetFields: ctx.getTargetFields(),

    /**
     * remove target field item
     */
    removeTargetField: ctx.removeTarget,

    /**
     * you can append target field item.
     */
    appendTargetField: ctx.appendTarget,

    /**
     * you can update all target fields at once
     * @param newTargetFields
     */
    updateTargetFields: ctx.updateTargetFields,

    /**
     * you can update target field value
     * - when you use `input` or `select` type, you can update value.
     * @param targetId
     * @param fieldKey
     * @param newValue
     */
    updateTargetFieldValue: ctx.updateTargetFieldValue,
  }));

export const useMappings = () =>
  useTableMappingSelector((ctx) => ({
    /**
     * you can get current mappings.
     */
    mappings: ctx.getMappings(),

    /**
     * you can add a new mapping between source and target
     * @param sourceId
     * @param targetId
     */
    addMapping: ctx.addMapping,

    /**
     * you can remove a specific mapping by id
     * @param mappingId
     */
    removeMapping: ctx.removeMapping,

    /**
     * you can clear all mappings.
     *
     * @example
     * ```
     * const { clearMappings } = useMappings();
     *
     * const handleMappingClear = () => {
     *   clearMappings();
     * }
     * ```
     */
    clearMappings: ctx.clearMappings,

    /**
     * you can update mappings.
     */
    updateMappings: ctx.updateMappings,

    /**
     * you can mapping same line.
     */
    sameLineMapping: ctx.sameLineMapping,

    /**
     * you can same name mapping.
     *
     * @example
     * ```
     * const { sameNameMapping } = useMappings();
     *
     * const handleSameNameMapping = () => {
     *   sameNameMapping();
     * }
     * ```
     */
    sameNameMapping: ctx.sameNameMapping,
  }));
