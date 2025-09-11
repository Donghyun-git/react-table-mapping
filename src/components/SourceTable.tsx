import React, { memo, useEffect, useState } from 'react';

import EditableCell from '@/components/EditableCell';
import { useSourceFields } from '@/contexts';
import type { FieldItem, FieldItemInput, HeaderColumnProps } from '@/types/table-mapping';
import { generateSourceFields } from '@/utils';

interface SourceTableProps {
  sources: FieldItemInput[];
  sourceColumns: Array<Omit<HeaderColumnProps, 'type'>>;
  handleDragStart: (e: React.MouseEvent, sourceId: string) => void;
}

/**
 * source row component
 */
const SourceRow = memo(
  ({
    field,
    handleDragStart,
  }: {
    field: FieldItem;
    handleDragStart: (e: React.MouseEvent, sourceId: string) => void;
  }) => {
    const { id, key, ...rest } = field;

    const entries = Object.entries(rest ?? {}).filter(([, params]) => params);
    const columnCount = entries.length;

    const gridTemplateColumns = `repeat(${columnCount}, 1fr) auto`;

    return (
      <div key={id || key} className="source-table-row" style={{ gridTemplateColumns }}>
        {Object.entries(rest ?? {}).map(([fieldKey, params]) => {
          if (params) {
            return <EditableCell key={`${id}-${fieldKey}`} fieldId={id} fieldKey={fieldKey} params={params} />;
          }
          return null;
        })}
        <div
          id={`connector-${id}`}
          className="source-connector connector"
          onMouseDown={(e) => handleDragStart(e, id)}
        />
      </div>
    );
  },
);

/**
 * main source table component
 */
const SourceTable = ({ sources, sourceColumns, handleDragStart }: SourceTableProps) => {
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
    <div className="source-table">
      <div className="source-table-header">
        {sourceColumns.map((column) => (
          <span key={column.key}>{column.title}</span>
        ))}
      </div>
      <div className="source-table-body">
        {sourceFieldState.map((field) => (
          <SourceRow key={field.id || field.key} field={field} handleDragStart={handleDragStart} />
        ))}
      </div>
    </div>
  );
};

export default SourceTable;
