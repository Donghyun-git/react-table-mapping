import { TableMappingProvider } from '@/contexts';
import type { TableMappingProps } from '@/types/table-mapping';

import TableMapping from './TableMapping';

const TableMappingContainer = ({ sources, targets, mappings, ...props }: TableMappingProps) => {
  return (
    <TableMappingProvider sources={sources} targets={targets} mappings={mappings}>
      <TableMapping {...props} />
    </TableMappingProvider>
  );
};

export default TableMappingContainer;
