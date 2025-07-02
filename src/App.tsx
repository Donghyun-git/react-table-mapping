import TableMapping from './TableMapping';
import { TableMappingProvider } from './contexts';

function App() {
  const sourceColumns = [
    { title: '이름', key: 'name' },
    { title: '타입', key: 'type' },
    { title: '설명', key: 'description' },
    { title: '작업', key: 'action' },
  ];

  const targetColumns = [
    { title: '이름', key: 'name' },
    { title: '타입', key: 'type' },
  ];

  const sourceFields = [
    {
      name: {
        type: 'select',
        columnKey: 'name',
        attributes: {
          style: {
            backgroundColor: 'white',
            color: 'black',
          },
        },
        options: [
          {
            label: '원본 필드 1',
            value: '원본 필드 1',
          },
          {
            label: '원본 필드 2',
            value: '원본 필드 2',
          },
          {
            label: '원본 필드 3',
            value: '원본 필드 3',
          },
        ],
      },
      type: {
        type: 'input',
        columnKey: 'type',
        defaultValue: 'source',
        onChange: (value) => {
          console.log('input component value', value);
        },
      },
      description: {
        type: 'string',
        columnKey: 'description',
        value: '원본 필드 1 설명',
      },
      action: {
        type: 'string',
        columnKey: 'action',
        value: '원본 필드 1 작업',
      },
    },
    {
      name: {
        type: 'string',
        columnKey: 'name',
        value: '원본 필드 2',
      },
      type: {
        type: 'string',
        columnKey: 'type',
        value: 'source',
      },
      description: {
        type: 'string',
        columnKey: 'description',
        value: '원본 필드 2 설명',
      },
      action: {
        type: 'string',
        columnKey: 'action',
        value: '원본 필드 2 작업',
      },
    },
    {
      name: {
        type: 'string',
        columnKey: 'name',
        value: '원본 필드 3',
      },
      type: {
        type: 'string',
        columnKey: 'type',
        value: 'source',
      },
      description: {
        type: 'string',
        columnKey: 'description',
        value: '원본 필드 3 설명',
      },
      action: {
        type: 'string',
        columnKey: 'action',
        value: '원본 필드 3 작업',
      },
    },
  ] satisfies FieldItemInput[];

  const targetFields = [
    {
      name: {
        type: 'select',
        columnKey: 'name',
        attributes: {
          style: {
            backgroundColor: 'white',
            color: 'black',
          },
        },
        options: [
          {
            label: '원본 필드 1',
            value: '원본 필드 1',
          },
          {
            label: '원본 필드 2',
            value: '원본 필드 2',
          },
          {
            label: '원본 필드 3',
            value: '원본 필드 3',
          },
        ],
        onChange: (value) => {
          console.log('select component value', value);
        },
      },
      type: {
        type: 'string',
        columnKey: 'type',
        value: 'target',
      },
    },
    {
      name: {
        type: 'string',
        columnKey: 'name',
        value: '원본 필드 1',
      },
      type: {
        type: 'string',
        columnKey: 'type',
        value: 'target',
      },
    },
  ] satisfies FieldItemInput[];

  return (
    <TableMappingProvider>
      <TableMapping
        lineType="bezier"
        sourceColumns={sourceColumns}
        targetColumns={targetColumns}
        sources={sourceFields}
        targets={targetFields}
        onMappingChange={(mappings) => {
          console.log('currentMappings => ', mappings);
        }}
      />
    </TableMappingProvider>
  );
}

export default App;
