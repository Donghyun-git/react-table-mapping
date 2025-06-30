import React, { memo, useState } from 'react';
import { useTargetFields } from '../contexts';
import { generateTargetFields } from '../utils';
import EditableCell from './EditableCell';

interface TargetTableProps {
  targets: FieldItemInput[];
  targetColumns: Array<Omit<HeaderColumnProps, 'type'>>;
  targetTableStyle: React.CSSProperties;
  tableHeaderStyle: React.CSSProperties;
  tableCellStyle: React.CSSProperties;
  connectorStyle: React.CSSProperties;
}

const TargetRow = memo(
  ({
    field,
    tableCellStyle,
    connectorStyle,
  }: {
    field: FieldItem;
    tableCellStyle: React.CSSProperties;
    connectorStyle: React.CSSProperties;
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
                  paddingLeft: index === 0 ? '24px' : '12px',
                }}
              />
            );
          }

          return null;
        })}

        <div id={`connector-${id}`} className="connector target-connector" style={connectorStyle} />
      </div>
    );
  },
);

const TargetTable = ({
  targets,
  targetColumns,
  targetTableStyle,
  tableHeaderStyle,
  tableCellStyle,
  connectorStyle,
}: TargetTableProps) => {
  const [targetFieldState, setTargetFieldState] = useState<FieldItem[]>([]);
  const { updateTargetFields } = useTargetFields();

  React.useEffect(() => {
    const initialFields = generateTargetFields({ targets });
    updateTargetFields(initialFields);
    setTargetFieldState(initialFields);
  }, [targets, updateTargetFields]);

  return (
    <div className="table target-table" style={targetTableStyle}>
      <div className="table-header" style={tableHeaderStyle}>
        {targetColumns.map((column) => (
          <div key={column.key} className="header-cell">
            {column.title}
          </div>
        ))}
      </div>
      <div className="table-body">
        {targetFieldState.map((field) => (
          <TargetRow
            key={field.id || field.key}
            field={field}
            tableCellStyle={tableCellStyle}
            connectorStyle={connectorStyle}
          />
        ))}
      </div>
    </div>
  );
};

export default TargetTable;
