import { MinusIcon } from 'lucide-react';
import { memo } from 'react';

import EditableCell from '@/components/EditableCell';
import { Button } from '@/components/ui/button';
import type { FieldItem, HeaderColumnProps, TableMappingRef } from '@/types/table-mapping';

import NoData from './ui/nodata';

interface SourceTableProps {
  sourceTableRef: React.RefObject<HTMLDivElement | null>;
  sourceColumns: Array<Omit<HeaderColumnProps, 'type'>>;
  disabled?: boolean;
  noDataComponent?: React.ReactNode;
  onBeforeSourceFieldRemove?: (sourceId: string) => void | boolean;
  onAfterSourceFieldRemove?: (removedSourceId: string) => void;
  handleDragStart: (e: React.MouseEvent, sourceId: string) => void;
  tableMappingHook: TableMappingRef;
}

/**
 * source row component
 */
const SourceRow = memo(
  ({
    field,
    handleDragStart,
    disabled,
    tableMappingHook,
  }: {
    field: FieldItem;
    handleDragStart: (e: React.MouseEvent, sourceId: string) => void;
    disabled?: boolean;
    tableMappingHook: TableMappingRef;
  }) => {
    const { id, key, ...rest } = field;

    const entries = Object.entries(rest ?? {}).filter(([, params]) => params);
    const columnCount = entries.length;

    const gridTemplateColumns = `repeat(${columnCount}, 1fr) auto`;

    return (
      <div key={id || key} className="source-table-row" style={{ gridTemplateColumns, flex: 1 }}>
        {Object.entries(rest ?? {}).map(([fieldKey, params]) => {
          if (params) {
            return (
              <EditableCell
                key={`${id}-${fieldKey}`}
                fieldId={id}
                fieldKey={fieldKey}
                params={params}
                disabled={disabled}
                tableType="source"
                tableMappingHook={tableMappingHook}
              />
            );
          }
          return null;
        })}
        <div
          id={`connector-source-${id}`}
          data-testid={`connector-source-${id}`}
          className="source-connector connector"
          style={{ cursor: disabled ? 'not-allowed' : 'pointer', pointerEvents: disabled ? 'none' : 'auto' }}
          onMouseDown={(e) => !disabled && handleDragStart(e, id)}
        />
      </div>
    );
  },
);

/**
 * main source table component
 */
const SourceTable = (props: SourceTableProps) => {
  const {
    sourceTableRef,
    sourceColumns,
    disabled,
    noDataComponent,
    onBeforeSourceFieldRemove,
    onAfterSourceFieldRemove,
    handleDragStart,
    tableMappingHook,
  } = props;

  const { sourceFields, removeSource } = tableMappingHook;

  const handleSourceFieldRemove = (sourceId: string) => {
    const shouldRemove = onBeforeSourceFieldRemove?.(sourceId);

    if (shouldRemove === false) return;

    removeSource(sourceId);

    onAfterSourceFieldRemove?.(sourceId);
  };

  return (
    <div ref={sourceTableRef} className="source-table">
      <div className="source-table-header">
        <div className="source-table-header-container">
          {!disabled && sourceFields.length > 0 ? <div style={{ width: '24px', height: '24px' }} /> : null}
          {sourceColumns.map((column) => (
            <div className="source-table-header-cell" key={column.key}>
              {column.title}
            </div>
          ))}
        </div>
      </div>
      <div className="source-table-body">
        {sourceFields.map((field) => (
          <div key={field.id || field.key} className="source-table-row-container">
            {!disabled ? (
              <Button
                className="mapping-button"
                variant="outline"
                size="icon"
                onClick={() => handleSourceFieldRemove(field.id)}
              >
                <MinusIcon width={12} height={12} />
              </Button>
            ) : null}

            <SourceRow
              field={field}
              handleDragStart={handleDragStart}
              disabled={disabled}
              tableMappingHook={tableMappingHook}
            />
          </div>
        ))}
        {sourceFields.length <= 0 ? noDataComponent ? noDataComponent : <NoData /> : null}
      </div>
    </div>
  );
};

export default SourceTable;
