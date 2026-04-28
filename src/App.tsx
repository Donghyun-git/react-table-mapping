import { useRef, useState } from 'react';

import TableMapping from '@/components/TableMapping';
import type {
  FieldItemInput,
  LineType,
  Mapping,
  TableMappingRef,
  TableMappingStateWithAction,
} from '@/types/table-mapping';

const btnStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  cursor: 'pointer',
};

const sourceColumns = [{ title: 'Name', key: 'name' }];

const targetColumns = [
  { title: 'Name', key: 'name' },
  { title: 'Data', key: 'data' },
  { title: 'Function', key: 'func' },
];

const initialSourceFields = [
  { name: { type: 'string', columnKey: 'name', value: 'KEY' }, id: '0', key: '0' },
  { name: { type: 'string', columnKey: 'name', value: 'COL1' }, id: '1', key: '1' },
  { name: { type: 'string', columnKey: 'name', value: 'COL2' }, id: '2', key: '2' },
  { name: { type: 'string', columnKey: 'name', value: 'COL3' }, id: '3', key: '3' },
  { name: { type: 'string', columnKey: 'name', value: 'COL4' }, id: '4', key: '4' },
] satisfies FieldItemInput[];

const initialTargetFields = [
  {
    id: '0',
    key: '0',
    name: { type: 'input', columnKey: 'name', value: 'KEY', onChange: (v) => console.log('target name changed:', v) },
    data: { type: 'input', columnKey: 'data', value: '', onChange: (v) => console.log('target data changed:', v) },
    func: {
      type: 'select',
      columnKey: 'func',
      value: 'NONE',
      options: [
        { label: 'NONE', value: 'NONE' },
        { label: 'CONCAT', value: 'CONCAT' },
        { label: 'SUM', value: 'SUM' },
      ],
      onChange: (v) => console.log('target func changed:', v),
    },
  },
  {
    id: '1',
    key: '1',
    name: {
      type: 'input',
      columnKey: 'name',
      value: 'CONCAT_COL',
      onChange: (v) => console.log('target name changed:', v),
    },
    data: {
      type: 'input',
      columnKey: 'data',
      value: 'CONCAT(COL1,COL2)',
      onChange: (v) => console.log('target data changed:', v),
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
      onChange: (v) => console.log('target func changed:', v),
    },
  },
  {
    id: '2',
    key: '2',
    name: {
      type: 'input',
      columnKey: 'name',
      value: 'SUM_COL',
      onChange: (v) => console.log('target name changed:', v),
    },
    data: {
      type: 'input',
      columnKey: 'data',
      value: 'SUM(,)',
      onChange: (v) => console.log('target data changed:', v),
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
      onChange: (v) => console.log('target func changed:', v),
    },
  },
] satisfies FieldItemInput[];

const initialMappings: Mapping[] = [{ id: 'mapping-4-2', source: '4', target: '2' }];

function App() {
  const tableMethodRef = useRef<TableMappingRef | null>(null);

  const [sources, setSources] = useState<FieldItemInput[]>(initialSourceFields);
  const [targets, setTargets] = useState<FieldItemInput[]>(initialTargetFields);
  const [mappings, setMappings] = useState<Mapping[]>(initialMappings);
  const [lineType, setLineType] = useState<LineType>('bezier');
  const [disabled, setDisabled] = useState(false);

  const handleMappingChange = (stateWithAction: TableMappingStateWithAction) => {
    console.info('Action:', stateWithAction.action.type);
    console.info('Payload:', stateWithAction.action.payload);
    console.info('New state:', stateWithAction);
    setSources(stateWithAction.sources);
    setTargets(stateWithAction.targets);
    setMappings(stateWithAction.mappings);
  };

  const handleAddSource = () => {
    const newId = `source-${Date.now()}`;
    tableMethodRef.current?.appendSource({
      name: { type: 'string', columnKey: 'name', value: `NEW_${newId.slice(-3).toUpperCase()}` },
      id: newId,
      key: newId,
    });
  };

  const handleAddTarget = () => {
    const newId = `target-${Date.now()}`;
    tableMethodRef.current?.appendTarget({
      name: {
        type: 'input',
        columnKey: 'name',
        value: `NEW_${newId.slice(-3).toUpperCase()}`,
        onChange: (v) => console.log('New target name changed:', v),
      },
      data: {
        type: 'input',
        columnKey: 'data',
        value: '',
        onChange: (v) => console.log('New target data changed:', v),
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
        onChange: (v) => console.log('New target func changed:', v),
      },
      id: newId,
      key: newId,
    });
  };

  return (
    <div>
      <div
        style={{
          padding: '20px 20px 0',
          marginBottom: '16px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <button
          style={{ ...btnStyle, background: '#f5f5f5' }}
          onClick={() => console.log('ref:', tableMethodRef.current)}
        >
          Console Log Ref
        </button>
        <button
          style={{ ...btnStyle, background: '#f5f5f5' }}
          onClick={() => tableMethodRef.current?.sameLineMapping()}
        >
          Same Line Mapping
        </button>
        <button
          style={{ ...btnStyle, background: '#f5f5f5' }}
          onClick={() => tableMethodRef.current?.sameNameMapping('name')}
        >
          Same Name Mapping
        </button>
        <button style={{ ...btnStyle, background: '#ffe6e6' }} onClick={() => tableMethodRef.current?.clearMappings()}>
          Clear Mappings
        </button>
        <button style={{ ...btnStyle, background: '#e6f3ff' }} onClick={handleAddSource}>
          Add Source
        </button>
        <button style={{ ...btnStyle, background: '#e6ffe6' }} onClick={handleAddTarget}>
          Add Target
        </button>

        <select
          value={lineType}
          onChange={(e) => setLineType(e.target.value as LineType)}
          style={{ ...btnStyle, background: '#fff' }}
        >
          <option value="bezier">Bezier</option>
          <option value="straight">Straight</option>
          <option value="step">Step</option>
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
          Disabled
        </label>
      </div>

      <div style={{ height: '400px', width: '100%', margin: '0 auto' }}>
        <TableMapping
          ref={tableMethodRef}
          sources={sources}
          targets={targets}
          mappings={mappings}
          lineType={lineType}
          disabled={disabled}
          sourceColumns={sourceColumns}
          targetColumns={targetColumns}
          onMappingChange={handleMappingChange}
        />
      </div>
    </div>
  );
}

export default App;
