import TableMapping from './TableMapping';

function App() {
  //더미데이터만들기
  const sourceColumns = [
    { title: '이름', key: 'name' },
    { title: '타입', key: 'type' },
    { title: '설명', key: 'description' },
    { title: '작업', key: 'action' },
  ];

  const targetColumns = [
    { title: '타겟이름', key: 'name' },
    { title: '타입', key: 'type' },
  ];

  const sourceFields = [
    {
      name: '원본 필드 1',
      type: 'source',
      description: '원본 필드 1 설명',
      action: '원본 필드 1 작업',
    },
    {
      name: '원본 필드 2',
      type: 'source',
      description: '원본 필드 2 설명',
      action: '원본 필드 2 작업',
    },
    {
      name: '원본 필드 3',
      type: 'source',
      description: '원본 필드 3 설명',
      action: '원본 필드 3 작업',
    },
  ];

  const targetFields = [
    { name: '원본 필드 1', type: '타겟1' },
    { name: '타겟 필드 2', type: '타겟2' },
  ];

  return (
    <TableMapping
      lineType="bezier"
      sourceColumns={sourceColumns}
      targetColumns={targetColumns}
      sources={sourceFields}
      targets={targetFields}
      onMappingChange={(mappings) => console.log(mappings)}
    />
  );
}

export default App;
