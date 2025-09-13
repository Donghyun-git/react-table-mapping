import TableMapping from '@/components/TableMapping';
import { useMappings, useSourceFields, useTargetFields } from '@/contexts';
import type { FieldItemInput } from '@/types/table-mapping';

function App() {
  const { sourceFields: currentSourceFields, appendSourceField } = useSourceFields();
  const { targetFields: currentTargetFields, appendTargetField } = useTargetFields();

  const { mappings } = useMappings();

  console.log('useMappings hook [ mappings ]  =>', mappings);

  const sourceColumns = [{ title: 'Name', key: 'name' }];

  const targetColumns = [
    { title: 'Name', key: 'name' },
    { title: 'Data', key: 'data' },
    { title: 'Function', key: 'func' },
  ];

  const sourceFields = [
    {
      name: {
        type: 'string',
        columnKey: 'name',
        value: 'KEY',
      },
      id: 'source-0',
      key: 'source-0',
    },
    {
      name: {
        type: 'string',
        columnKey: 'name',
        value: 'COL1',
      },
      id: 'source-1',
      key: 'source-1',
    },
    {
      name: {
        type: 'string',
        columnKey: 'name',
        value: 'COL2',
      },
      id: 'source-2',
      key: 'source-2',
    },
    {
      name: {
        type: 'string',
        columnKey: 'name',
        value: 'COL3',
      },
      id: 'source-3',
      key: 'source-3',
    },
    {
      name: {
        type: 'string',
        columnKey: 'name',
        value: 'COL4',
      },
      id: 'source-4',
      key: 'source-4',
    },
  ] satisfies FieldItemInput[];

  const targetFields = [
    {
      id: 'target-0',
      key: 'target-0',
      name: {
        type: 'input',
        columnKey: 'name',
        value: 'KEY',
        onChange: (value) => console.log('target name changed:', value),
      },
      data: {
        type: 'input',
        columnKey: 'data',
        value: '',
        onChange: (value) => console.log('target data changed:', value),
      },
      func: {
        type: 'select',
        columnKey: 'func',
        value: 'NONE',
        options: [
          { label: 'NONE', value: 'NONE' },
          { label: 'CONCAT', value: 'CONCAT' },
          { label: 'SUM', value: 'SUM' },
        ],
        onChange: (value) => console.log('target func changed:', value),
      },
    },
    {
      id: 'target-1',
      key: 'target-1',
      name: {
        type: 'input',
        columnKey: 'name',
        value: 'CONCAT_COL',
        onChange: (value) => console.log('target name changed:', value),
      },
      data: {
        type: 'input',
        columnKey: 'data',
        value: 'CONCAT(COL1,COL2)',
        onChange: (value) => console.log('target data changed:', value),
      },
      func: {
        type: 'select',
        columnKey: 'func',
        value: 'CONCAT',
        options: [
          { label: 'NONE', value: 'NONE' },
          { label: 'CONCAT', value: 'CONCAT' },
          { label: 'SUM', value: 'SUM' },
        ],
        onChange: (value) => console.log('target func changed:', value),
      },
    },
    {
      id: 'target-2',
      key: 'target-2',
      name: {
        type: 'input',
        columnKey: 'name',
        value: 'SUM_COL',
        onChange: (value) => console.log('target name changed:', value),
      },
      data: {
        type: 'input',
        columnKey: 'data',
        value: 'SUM(,)',
        onChange: (value) => console.log('target data changed:', value),
      },
      func: {
        type: 'select',
        columnKey: 'func',
        value: 'SUM',
        options: [
          { label: 'NONE', value: 'NONE' },
          { label: 'CONCAT', value: 'CONCAT' },
          { label: 'SUM', value: 'SUM' },
        ],
        onChange: (value) => console.log('target func changed:', value),
      },
    },
  ] satisfies FieldItemInput[];

  const initialMappings = [
    {
      id: 'mapping-source-0-target-0',
      source: 'source-0',
      target: 'target-0',
    },
    {
      id: 'mapping-source-1-target-1',
      source: 'source-1',
      target: 'target-1',
    },
    {
      id: 'mapping-source-2-target-1',
      source: 'source-2',
      target: 'target-1',
    },
    {
      id: 'mapping-source-3-target-2',
      source: 'source-3',
      target: 'target-2',
    },
    {
      id: 'mapping-source-4-target-2',
      source: 'source-4',
      target: 'target-2',
    },
  ];

  return (
    <div style={{ height: '100vh' }}>
      <button
        onClick={() => {
          appendSourceField({
            name: {
              type: 'string',
              columnKey: 'name',
              value: `COL${currentSourceFields.length + 1}`,
            },
            id: `source-${currentSourceFields.length + 1}`,
            key: `source-${currentSourceFields.length + 1}`,
          });
        }}
      >
        소스 추가
      </button>
      <button
        onClick={() => {
          appendTargetField({
            name: {
              type: 'string',
              columnKey: 'name',
              value: `COL${currentTargetFields.length + 1}`,
            },
            id: `target-${currentTargetFields.length + 1}`,
            key: `target-${currentTargetFields.length + 1}`,
          });
        }}
      >
        타겟 추가
      </button>
      <TableMapping
        lineType="bezier"
        sources={sourceFields}
        targets={targetFields}
        sourceColumns={sourceColumns}
        targetColumns={targetColumns}
        initialMappings={initialMappings}
      />
    </div>
  );
}

export default App;
