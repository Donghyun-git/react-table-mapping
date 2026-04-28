import { createContext, useContext } from 'react';

import type { TableMappingStore } from './createTableMappingStore';

const TableMappingStoreContext = createContext<TableMappingStore | null>(null);

export function useTableMappingStore(): TableMappingStore {
  const store = useContext(TableMappingStoreContext);

  if (!store) throw new Error('useTableMappingStore must be used within a TableMapping component');

  return store;
}

export default TableMappingStoreContext;
