import type { Meta, StoryObj } from '@storybook/react-vite';

import TableMapping from '@/components/TableMapping';
import { TableMappingProvider } from '@/contexts';
import '@/lib/system.css';

import '../.storybook/storybook.css';

const meta = {
  title: 'ReactTableMapping',
  component: TableMapping,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],

  argTypes: {
    /**
     * type Select is not working in storybook
     */
    lineType: {
      control: {
        type: 'text',
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
    (Story) => (
      <TableMappingProvider
        sources={[
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
        ]}
        targets={[
          {
            id: 'target-0',
            key: 'target-0',
            name: {
              type: 'input',
              columnKey: 'name',
              value: 'KEY',
              onChange: (value: string) => console.log('target name changed:', value),
            },
            data: {
              type: 'input',
              columnKey: 'data',
              value: '',
              onChange: (value: string) => console.log('target data changed:', value),
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
              onChange: (value: string) => console.log('target func changed:', value),
            },
          },
          {
            id: 'target-1',
            key: 'target-1',
            name: {
              type: 'input',
              columnKey: 'name',
              value: 'CONCAT_COL',
              onChange: (value: string) => console.log('target name changed:', value),
            },
            data: {
              type: 'input',
              columnKey: 'data',
              value: 'CONCAT(COL1,COL2)',
              onChange: (value: string) => console.log('target data changed:', value),
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
              onChange: (value: string) => console.log('target func changed:', value),
            },
          },
          {
            id: 'target-2',
            key: 'target-2',
            name: {
              type: 'input',
              columnKey: 'name',
              value: 'SUM_COL',
              onChange: (value: string) => console.log('target name changed:', value),
            },
            data: {
              type: 'input',
              columnKey: 'data',
              value: 'SUM(,)',
              onChange: (value: string) => console.log('target data changed:', value),
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
              onChange: (value: string) => console.log('target func changed:', value),
            },
          },
        ]}
        mappings={[
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
        ]}
      >
        <Story />
      </TableMappingProvider>
    ),
  ],
} satisfies Meta<typeof TableMapping>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo_BezierLines: Story = {
  args: {
    targetColumns: [
      { title: 'Name', key: 'name' },
      { title: 'Data', key: 'data' },
      { title: 'Function', key: 'func' },
    ],
    sourceColumns: [{ title: 'Name', key: 'name' }],
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
