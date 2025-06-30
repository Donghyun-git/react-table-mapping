import { v4 as uuidv4 } from 'uuid';

const generateTargetFields = ({ targets }: Pick<TableMappingProps, 'targets'>): FieldItem[] => {
  return (targets?.map((target) => ({
    ...target,
    id: `target-${uuidv4()}`,
    key: `target-${uuidv4()}`,
  })) ?? []) as FieldItem[];
};

export default generateTargetFields;
