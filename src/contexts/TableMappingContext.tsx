/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import useTableMapping from '../hooks/useTableMapping';

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
    sourceFields: ctx.getSourceFields(),
    updateSourceFields: ctx.updateSourceFields,
    updateSourceFieldValue: ctx.updateSourceFieldValue,
  }));

export const useTargetFields = () =>
  useTableMappingSelector((ctx) => ({
    targetFields: ctx.getTargetFields(),
    updateTargetFields: ctx.updateTargetFields,
    updateTargetFieldValue: ctx.updateTargetFieldValue,
  }));

export const useMappings = () =>
  useTableMappingSelector((ctx) => ({
    mappings: ctx.getMappings(),
    addMapping: ctx.addMapping,
    removeMapping: ctx.removeMapping,
    clearMappings: ctx.clearMappings,
    updateMappings: ctx.updateMappings,
    sameNameMapping: (name: string) => ctx.sameNameMapping(name),
    sameLineMapping: ctx.sameLineMapping,
  }));
