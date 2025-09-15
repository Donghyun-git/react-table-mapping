import { v4 as uuidv4 } from 'uuid';

import type { FieldItem, TableMappingProps } from '@/types/table-mapping';

const generateTargetFields = ({ targets }: Pick<TableMappingProps, 'targets'>): FieldItem[] => {
  return (targets?.map((target) => ({
    ...target,
    id: target.id ? target.id : `${uuidv4()}`,
    key: target.key ? target.key : `${uuidv4()}`,
  })) ?? []) as FieldItem[];
};

export default generateTargetFields;
