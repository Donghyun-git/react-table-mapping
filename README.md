# React Table Mapping

A React component library for visually representing and managing field mappings between tables with an intuitive drag-and-drop interface.

## 🚀 Features

- 🎯 **Drag & Drop**: Intuitive mapping creation with visual feedback
- 🎨 **Visual Connection Lines**: Beautiful Bezier curves showing mapping relationships
- 🌙 **Dark Mode**: Automatic light/dark theme switching
- ⚡ **TypeScript**: Full type safety and excellent developer experience
- 🎛️ **Customizable**: Support for various field types such as `string`, `input`, `select`

## 📦 Installation

```bash
npm install react-table-mapping
# or
yarn add react-table-mapping
# or
pnpm add react-table-mapping
```

### Import Styles

```typescript
import 'react-table-mapping/styles';
```

## 🎯 Quick Start

```tsx
import React from 'react';
import TableMapping from 'react-table-mapping';
import { TableMappingProvider } from 'react-table-mapping';

function App() {
  // Define source table columns
  const sourceColumns = [{ title: 'Name', key: 'name' }];

  // Define target table columns
  const targetColumns = [
    { title: 'Name', key: 'name' },
    { title: 'Data', key: 'data' },
    { title: 'Function', key: 'func' },
  ];

  // Source field data
  const sourceFields = [
    {
      name: {
        type: 'input',
        columnKey: 'name',
        value: 'USER_ID',
        onChange: (value) => console.log('Source name changed:', value),
      },
      id: 'source-0',
      key: 'source-0',
    },
  ];

  // Target field data
  const targetFields = [
    {
      name: {
        type: 'input',
        columnKey: 'name',
        value: 'KEY',
        onChange: (value) => console.log('Target name changed:', value),
      },
      data: {
        type: 'input',
        columnKey: 'data',
        value: '',
        onChange: (value) => console.log('Target data changed:', value),
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
        onChange: (value) => console.log('Target func changed:', value),
      },
      id: 'target-0',
      key: 'target-0',
    },
  ];

  // Initial mapping relationships
  const initialMappings = [
    {
      id: 'mapping-source-0-target-0',
      source: 'source-0',
      target: 'target-0',
    },
  ];

  return (
    <TableMappingProvider>
      <TableMapping
        lineType="bezier"
        sourceColumns={sourceColumns}
        targetColumns={targetColumns}
        sources={sourceFields}
        targets={targetFields}
        initialMappings={initialMappings}
      />
    </TableMappingProvider>
  );
}

export default App;
```

## 📚 API Reference

### TableMapping Props

| Prop              | Type                     | Default      | Description                   |
| ----------------- | ------------------------ | ------------ | ----------------------------- |
| `lineType`        | `'straight' \| 'bezier'` | `'straight'` | Type of connection lines      |
| `sourceColumns`   | `HeaderColumnProps[]`    | `[]`         | Source table header columns   |
| `targetColumns`   | `HeaderColumnProps[]`    | `[]`         | Target table header columns   |
| `sources`         | `FieldItemInput[]`       | `[]`         | Source field data             |
| `targets`         | `FieldItemInput[]`       | `[]`         | Target field data             |
| `initialMappings` | `Mapping[]`              | `[]`         | Initial mapping relationships |

### HeaderColumnProps

```typescript
interface HeaderColumnProps {
  title: string;
  key: string;
}
```

### FieldItemInput

```typescript
interface FieldItemInput {
  id?: string;
  key?: string;
  [field: string]:
    | {
        type: 'string';
        columnKey: string;
        value: string;
      }
    | {
        type: 'input';
        columnKey: string;
        value?: string;
        defaultValue?: string;
        attributes?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;
        onChange?: (value: string) => void;
      }
    | {
        type: 'select';
        columnKey: string;
        value?: string;
        defaultValue?: string;
        attributes?: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'>;
        options: {
          label: string;
          value: string;
          disabled?: boolean;
        }[];
        onChange?: (value: string) => void;
      }
    | string;
}
```

### Mapping

```typescript
interface Mapping {
  id: string;
  source: string; // Source field ID
  target: string; // Target field ID
}
```

## 🎨 Field Types

### String Field

Display static text in table cells:

```tsx
{
  name: {
    type: 'string',
    columnKey: 'name',
    value: 'Static Text'
  }
}
```

### Input Field

Editable text input with change handling:

```tsx
{
  name: {
    type: 'input',
    columnKey: 'name',
    value: 'Initial Value',
    onChange: (value) => console.log('New value:', value)
  }
}
```

### Select Field

Dropdown selection with options:

```tsx
{
  func: {
    type: 'select',
    columnKey: 'func',
    value: 'CONCAT',
    options: [
      { label: 'None', value: 'NONE' },
      { label: 'Concatenate', value: 'CONCAT' },
      { label: 'Sum', value: 'SUM' }
    ],
    onChange: (value) => console.log('Selected:', value)
  }
}
```

## 🎛️ Context Provider

The `TableMappingProvider` manages the internal state and provides mapping functionality:

```tsx
import { TableMappingProvider, useTableMapping } from 'react-table-mapping';

function CustomComponent() {
  const {
    sourceFields,
    targetFields,
    mappings,
    appendSource,
    appendTarget,
    removeSource,
    removeTarget,
    sameNameMapping,
  } = useTableMapping();

  // Your custom logic here
}

function App() {
  return (
    <TableMappingProvider>
      <CustomComponent />
      <TableMapping {...props} />
    </TableMappingProvider>
  );
}
```

## 🎨 Styling & Theming

The library uses CSS variables for theming and supports both light and dark modes automatically:

```css
/* Custom theme variables */
:root {
  --color-bg-mapping-primary: #ffffff;
  --color-bg-mapping-secondary: #f3f4f9;
  --color-text-default: #151826;
  --color-border-default: #d3d6ea;
}

.dark {
  --color-bg-mapping-primary: #242632;
  --color-bg-mapping-secondary: #151826;
  --color-text-default: #f3f4f9;
  --color-border-default: #545667;
}
```

## 🔧 Advanced Usage

### Dynamic Field Management

```tsx
function DynamicMappingExample() {
  const { appendSource, appendTarget, removeSource } = useTableMapping();

  const addNewSourceField = () => {
    appendSource({
      name: {
        type: 'input',
        columnKey: 'name',
        value: 'New Field',
        onChange: (value) => console.log('Changed:', value),
      },
      id: `source-${Date.now()}`,
      key: `source-${Date.now()}`,
    });
  };

  return (
    <div>
      <button onClick={addNewSourceField}>Add Source Field</button>
      <TableMapping {...props} />
    </div>
  );
}
```

### Custom Field Components

```tsx
const customFields = [
  {
    name: {
      type: 'input',
      columnKey: 'name',
      value: 'Custom Field',
      attributes: {
        placeholder: 'Enter field name...',
        maxLength: 50,
      },
      onChange: (value) => {
        // Custom validation
        if (value.length > 50) return;
        console.log('Valid input:', value);
      },
    },
  },
];
```

## 🛠️ Development

### Setup

```bash
# Clone the repository
$ git clone https://github.com/react-table-mapping/react-table-mapping.git

# Install dependencies
$ npm install
#or
$ yarn

# Start development server
$ npm run dev
# or
$ yarn dev

# Start storybook example
$ npm run storybook
# or
$ yarn storybook
```

## 📋 Requirements

- **Node.js**: >=22.0.0
- **React**: ^18 || ^19
- **TypeScript**: ^5.7.2

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**donghyun-git** - [ax34554@gmail.com](mailto:ax34554@gmail.com)

## 🔗 Links

- [Repository](https://github.com/donghyun-git/react-table-mapping)
- [Issues](https://github.com/donghyun-git/react-table-mapping/issues)
- [NPM Package](https://www.npmjs.com/package/react-table-mapping)

---

Made with ❤️ by [donghyun-git](https://github.com/donghyun-git)
