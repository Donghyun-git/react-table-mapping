import { v4 as uuidv4 } from 'uuid';

const generateSourceFields = ({ sources }: Pick<TableMappingProps, 'sources'>): FieldItem[] => {
  return (sources?.map((source) => ({
    ...source,
    id: `source-${uuidv4()}`,
    key: `source-${uuidv4()}`,
  })) ?? []) as FieldItem[];
};

export default generateSourceFields;
