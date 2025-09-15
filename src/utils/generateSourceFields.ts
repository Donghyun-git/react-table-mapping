import { v4 as uuidv4 } from 'uuid';

import type { FieldItem, TableMappingProps } from '@/types/table-mapping';

const generateSourceFields = ({ sources }: Pick<TableMappingProps, 'sources'>): FieldItem[] => {
  return (sources?.map((source) => ({
    ...source,
    id: source.id ? source.id : `${uuidv4()}`,
    key: source.key ? source.key : `${uuidv4()}`,
  })) ?? []) as FieldItem[];
};

export default generateSourceFields;
