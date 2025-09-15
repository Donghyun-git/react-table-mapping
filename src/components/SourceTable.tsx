import { MinusIcon } from 'lucide-react';
import { memo, useEffect } from 'react';

import EditableCell from '@/components/EditableCell';
import { Button } from '@/components/ui/button';
import { useMappings, useSourceFields } from '@/contexts';
import type { FieldItem, FieldItemInput, HeaderColumnProps } from '@/types/table-mapping';
import { generateSourceFields } from '@/utils';

import NoData from './ui/nodata';

interface SourceTableProps {
  sourceTableRef: React.RefObject<HTMLDivElement | null>;
  sources: FieldItemInput[];
  sourceColumns: Array<Omit<HeaderColumnProps, 'type'>>;
  disabled?: boolean;
  noDataComponent?: React.ReactNode;
  afterSourceFieldRemove?: (removedSourceId: string) => void;
  handleDragStart: (e: React.MouseEvent, sourceId: string) => void;
}

/**
 * source row component
 */
const SourceRow = memo(
  ({
    field,
    handleDragStart,
    disabled,
  }: {
    field: FieldItem;
    handleDragStart: (e: React.MouseEvent, sourceId: string) => void;
    disabled?: boolean;
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
              />
            );
          }
          return null;
        })}
        <div
          id={`connector-source-${id}`}
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
  const { sourceTableRef, sources, sourceColumns, disabled, noDataComponent, afterSourceFieldRemove, handleDragStart } =
    props;

  const { sourceFields, removeSourceField, updateSourceFields } = useSourceFields();
  const { mappings, removeMapping, redraw } = useMappings();

  const handleSourceFieldRemove = (sourceId: string) => {
    const relatedMappings = mappings.filter((mapping) => mapping.source === sourceId);

    relatedMappings.forEach((mapping) => {
      removeMapping(mapping.id);
    });

    removeSourceField(sourceId);

    afterSourceFieldRemove?.(sourceId);

    setTimeout(() => {
      redraw();
    }, 50);
  };

  /**
   * initial data setup
   */
  useEffect(() => {
    const initialFields = generateSourceFields({ sources });

    updateSourceFields(initialFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

            <SourceRow field={field} handleDragStart={handleDragStart} disabled={disabled} />
          </div>
        ))}
        {sourceFields.length <= 0 ? noDataComponent ? noDataComponent : <NoData /> : null}
      </div>
    </div>
  );
};

export default SourceTable;
