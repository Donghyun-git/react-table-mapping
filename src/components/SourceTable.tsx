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

    return (
      <div
        key={id || key}
        className="flex border-b border-b-[var(--color-border-default)] relative h-[50px] items-center hover:bg-[var(--color-bg-mapping-primary-hover)]/20"
      >
        {Object.entries(rest ?? {}).map(([fieldKey, params]) => {
          if (params) {
            return <EditableCell key={`${id}-${fieldKey}`} fieldId={id} fieldKey={fieldKey} params={params} />;
          }
          return null;
        })}
        <div
          id={`connector-${id}`}
          className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--color-icon-primary)] border-2 border-[var(--color-bg-mapping-primary)] z-[9999] cursor-pointer shadow-[var(--shadow-sm)] transition-all duration-200 hover:scale-110 hover:bg-[var(--color-icon-info)]"
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
    <div className="source-table min-w-[300px] max-w-[600px] bg-[var(--color-bg-mapping-primary)] rounded-lg shadow-[var(--shadow-sm)] z-10 mr-12">
      <div className="flex bg-[var(--color-bg-mapping-secondary)] border-b border-b-[var(--color-border-default)] rounded-t-lg">
        {sourceColumns.map((column) => (
          <span key={column.key} className="p-3 font-medium flex-1 text-center text-[var(--color-text-default)]">
            {column.title}
          </span>
        ))}
      </div>
      <div className="min-h-[300px]">
        {sourceFieldState.map((field) => (
          <SourceRow key={field.id || field.key} field={field} handleDragStart={handleDragStart} />
        ))}
      </div>
    </div>
  );
};

export default SourceTable;
