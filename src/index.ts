import './lib/tailwind.css';

export { default as TableMapping } from './components/TableMapping';

export { TableMappingProvider, useSourceFields, useTargetFields, useMappings } from './contexts/TableMappingContext';

export * from './types/table-mapping';
