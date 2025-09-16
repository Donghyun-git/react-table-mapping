import TableMapping from '@/components/TableMapping';
import { TableMappingProvider } from '@/contexts';
import type { FieldItemInput } from '@/types/table-mapping';

function App() {
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
      id: '0',
      key: '0',
    },
    {
      name: {
        type: 'string',
        columnKey: 'name',
        value: 'COL1',
      },
      id: '1',
      key: '1',
    },
    {
      name: {
        type: 'string',
        columnKey: 'name',
        value: 'COL2',
      },
      id: '2',
      key: '2',
    },
    {
      name: {
        type: 'string',
        columnKey: 'name',
        value: 'COL3',
      },
      id: '3',
      key: '3',
    },
    {
      name: {
        type: 'string',
        columnKey: 'name',
        value: 'COL4',
      },
      id: '4',
      key: '4',
    },
  ] satisfies FieldItemInput[];

  const targetFields = [
    {
      id: '0',
      key: '0',
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
      id: '1',
      key: '1',
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
      id: '2',
      key: '2',
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
      id: 'mapping-4-2',
      source: '4',
      target: '2',
    },
  ];

  return (
    <TableMappingProvider>
      <div
        style={{
          height: '400px',
        }}
      >
        <TableMapping
          lineType="bezier"
          sources={sourceFields}
          targets={targetFields}
          sourceColumns={sourceColumns}
          targetColumns={targetColumns}
          initialMappings={initialMappings}
          onMappingChange={(mappings) => {
            console.info('mappings', mappings);
          }}
        />
      </div>
    </TableMappingProvider>
  );
}

export default App;
