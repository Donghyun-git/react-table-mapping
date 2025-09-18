import { useRef, useState } from 'react';

import TableMapping from '@/components/TableMapping';
import type { FieldItemInput, Mapping, TableMappingRef, TableMappingStateWithAction } from '@/types/table-mapping';

function App() {
  const tableMethodRef = useRef<TableMappingRef | null>(null);

  const sourceColumns = [{ title: 'Name', key: 'name' }];

  const targetColumns = [
    { title: 'Name', key: 'name' },
    { title: 'Data', key: 'data' },
    { title: 'Function', key: 'func' },
  ];

  const initialSourceFields = [
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

  const initialTargetFields = [
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

  const initialMappings: Mapping[] = [
    {
      id: 'mapping-4-2',
      source: '4',
      target: '2',
    },
  ];

  const [sources, setSources] = useState<FieldItemInput[]>(initialSourceFields);
  const [targets, setTargets] = useState<FieldItemInput[]>(initialTargetFields);
  const [mappings, setMappings] = useState<Mapping[]>(initialMappings);

  const handleMappingChange = (stateWithAction: TableMappingStateWithAction) => {
    console.info('Action:', stateWithAction.action.type);
    console.info('Payload:', stateWithAction.action.payload);
    console.info('New state:', stateWithAction);

    setSources(stateWithAction.sources);
    setTargets(stateWithAction.targets);
    setMappings(stateWithAction.mappings);
  };

  const handleTestMethods = () => {
    console.log('tableMethodRef.current:', tableMethodRef.current);

    if (tableMethodRef.current) {
      console.log('Available methods:', Object.keys(tableMethodRef.current));
    }
  };

  const handleSameLineMapping = () => {
    tableMethodRef.current?.sameLineMapping();
  };

  const handleSameNameMapping = () => {
    tableMethodRef.current?.sameNameMapping('name');
  };

  const handleClearMappings = () => {
    tableMethodRef.current?.clearMappings();
  };

  return (
    <div style={{ height: '400px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={handleTestMethods}>Console Log Ref</button>
        <button onClick={handleSameLineMapping}>Same Line Mapping</button>
        <button onClick={handleSameNameMapping}>Same Name Mapping</button>
        <button onClick={handleClearMappings}>Clear Mappings</button>
      </div>

      <TableMapping
        ref={tableMethodRef}
        sources={sources}
        targets={targets}
        mappings={mappings}
        lineType="bezier"
        sourceColumns={sourceColumns}
        targetColumns={targetColumns}
        onMappingChange={handleMappingChange}
      />
    </div>
  );
}

export default App;
