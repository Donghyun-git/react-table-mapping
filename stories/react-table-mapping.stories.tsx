import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';

import TableMapping from '@/components/TableMapping';
import '@/lib/system.css';
import type { FieldItemInput, Mapping, TableMappingRef, TableMappingStateWithAction } from '@/types/table-mapping';

import '../.storybook/storybook.css';

const meta = {
  title: 'ReactTableMapping',
  component: TableMapping,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],

  argTypes: {
    lineType: {
      control: {
        type: 'select',
        options: ['bezier', 'straight', 'step'],
      },
      defaultValue: 'bezier',
      description: 'Type of connection lines',
    },
    lineColor: {
      control: {
        type: 'color',
      },
      description: 'Color of connection lines',
      defaultValue: '#009bff',
    },
    lineWidth: {
      control: {
        type: 'range',
        min: 1,
        max: 10,
        step: 0.5,
      },
      description: 'Width of connection lines',
      defaultValue: 1.5,
    },
    hoverLineColor: {
      control: {
        type: 'color',
      },
      description: 'Color when hovering over lines',
      defaultValue: '#e3f3ff',
    },
  },
  decorators: [
    (Story, context) => {
      const tableMethodRef = useRef<TableMappingRef | null>(null);

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

      // 테스트 버튼들
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

      const handleAddSource = () => {
        const newId = `source-${Date.now()}`;
        tableMethodRef.current?.appendSource({
          name: {
            type: 'string',
            columnKey: 'name',
            value: `NEW_${newId.slice(-3).toUpperCase()}`,
          },
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
            onChange: (value: string) => console.log('New target name changed:', value),
          },
          data: {
            type: 'input',
            columnKey: 'data',
            value: '',
            onChange: (value: string) => console.log('New target data changed:', value),
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
            onChange: (value: string) => console.log('New target func changed:', value),
          },
          id: newId,
          key: newId,
        });
      };

      return (
        <div style={{ height: '400px' }}>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleTestMethods}
              style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: '#f5f5f5' }}
            >
              Console Log Ref
            </button>
            <button
              onClick={handleSameLineMapping}
              style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: '#f5f5f5' }}
            >
              Same Line Mapping
            </button>
            <button
              onClick={handleSameNameMapping}
              style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: '#f5f5f5' }}
            >
              Same Name Mapping
            </button>
            <button
              onClick={handleClearMappings}
              style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: '#ffe6e6' }}
            >
              Clear Mappings
            </button>
            <button
              onClick={handleAddSource}
              style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: '#e6f3ff' }}
            >
              Add Source
            </button>
            <button
              onClick={handleAddTarget}
              style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: '#e6ffe6' }}
            >
              Add Target
            </button>
          </div>

          <Story
            args={{
              ...context.args,
              ref: tableMethodRef,
              sources,
              targets,
              mappings,
              onMappingChange: handleMappingChange,
            }}
          />
        </div>
      );
    },
  ],
} satisfies Meta<typeof TableMapping>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo_BezierLines: Story = {
  args: {
    sourceColumns: [{ title: 'Name', key: 'name' }],
    targetColumns: [
      { title: 'Name', key: 'name' },
      { title: 'Data', key: 'data' },
      { title: 'Function', key: 'func' },
    ],
    lineType: 'bezier',
    lineColor: '#009bff',
    lineWidth: 2,
    hoverLineColor: '#e3f3ff',
  },
};

export const Demo_StraightLines: Story = {
  args: {
    ...Demo_BezierLines.args,
    lineType: 'straight',
    lineColor: '#e23137',
  },
};

export const Demo_StepLines: Story = {
  args: {
    ...Demo_BezierLines.args,
    lineType: 'step',
    lineColor: '#31b47b',
  },
};

export const Demo_Disabled: Story = {
  args: {
    ...Demo_BezierLines.args,
    disabled: true,
    lineColor: '#cccccc',
  },
};
