import React, { useState, useEffect, memo } from 'react';
import { useSourceFields } from '../contexts';
import { generateSourceFields } from '../utils';
import EditableCell from './EditableCell';

interface SourceTableProps {
  sources: FieldItemInput[];
  sourceColumns: Array<Omit<HeaderColumnProps, 'type'>>;
  sourceTableStyle: React.CSSProperties;
  tableHeaderStyle: React.CSSProperties;
  tableCellStyle: React.CSSProperties;
  connectorStyle: React.CSSProperties;
  handleDragStart: (e: React.MouseEvent, sourceId: string) => void;
}

/**
 * row component - memoization
 */
const SourceRow = memo(
  ({
    field,
    tableCellStyle,
    connectorStyle,
    handleDragStart,
  }: {
    field: FieldItem;
    tableCellStyle: React.CSSProperties;
    connectorStyle: React.CSSProperties;
    handleDragStart: (e: React.MouseEvent, sourceId: string) => void;
  }) => {
    const { id, key, ...rest } = field;

    return (
      <div key={id || key} className="table-row">
        {Object.entries(rest ?? {}).map(([fieldKey, params], index) => {
          if (params) {
            return (
              <EditableCell
                key={`${id}-${fieldKey}`}
                fieldId={id}
                fieldKey={fieldKey}
                params={params}
                cellStyle={{
                  ...tableCellStyle,
                  paddingRight: index === Object.entries(rest ?? {}).length - 1 ? '24px' : '12px',
                }}
              />
            );
          }
          return null;
        })}

        <div
          id={`connector-${id}`}
          className="connector source-connector"
          style={connectorStyle}
          onMouseDown={(e) => handleDragStart(e, id)}
        />
      </div>
    );
  },
);

/**
 * main source table component
 */
const SourceTable = ({
  sources,
  sourceColumns,
  sourceTableStyle,
  tableHeaderStyle,
  tableCellStyle,
  connectorStyle,
  handleDragStart,
}: SourceTableProps) => {
  const [sourceFieldState, setSourceFieldState] = useState<FieldItem[]>([]);
  const { updateSourceFields } = useSourceFields();

  /**
   * initial data setup
   */
  useEffect(() => {
    const initialFields = generateSourceFields({ sources });
    updateSourceFields(initialFields);
    setSourceFieldState(initialFields);
  }, [sources, updateSourceFields]);

  return (
    <div className="table source-table" style={sourceTableStyle}>
      <div className="table-header" style={tableHeaderStyle}>
        {sourceColumns.map((column) => (
          <div key={column.key} className="header-cell">
            {column.title}
          </div>
        ))}
      </div>
      <div className="table-body">
        {sourceFieldState.map((field) => (
          <SourceRow
            key={field.id || field.key}
            field={field}
            tableCellStyle={tableCellStyle}
            connectorStyle={connectorStyle}
            handleDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default SourceTable;
