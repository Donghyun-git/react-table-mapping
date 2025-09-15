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
        type: 'input',
        columnKey: 'name',
        value: 'table2field',
      },
      id: '0',
      key: '0',
    },
    {
      name: {
        type: 'input',
        columnKey: 'name',
        value: 'table2field',
      },
      id: '1',
      key: '1',
    },
  ] satisfies FieldItemInput[];

  const targetFields = [
    {
      name: {
        type: 'input',
        columnKey: 'name',
        value: 'table2field',
      },
      data: {
        type: 'input',
        columnKey: 'data',
        value: 'table2field',
      },
      func: {
        type: 'select',
        columnKey: 'func',
        defaultValue: 'NONE',
        options: [
          {
            label: 'NONE',
            value: 'NONE',
          },
          {
            label: 'CONCAT',
            value: 'CONCAT',
          },
          {
            label: 'SUM',
            value: 'SUM',
          },
        ],
      },
      id: '0',
      key: '0',
    },
  ] satisfies FieldItemInput[];

  const initialMappings = [
    {
      id: 'mapping-0-0',
      source: '0',
      target: '0',
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
            id: `${currentSourceFields.length + 1}`,
            key: `${currentSourceFields.length + 1}`,
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
            id: `${currentTargetFields.length + 1}`,
            key: `${currentTargetFields.length + 1}`,
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
        afterSourceFieldRemove={(id) => {
          alert(`${id} removed`);
        }}
        afterTargetFieldRemove={(id) => {
          alert(`${id} removed`);
        }}
      />
    </div>
  );
}

export default App;
