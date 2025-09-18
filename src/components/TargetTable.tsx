import { MinusIcon } from 'lucide-react';
import { memo } from 'react';

import EditableCell from '@/components/EditableCell';
import type { FieldItem, HeaderColumnProps, TableMappingRef } from '@/types/table-mapping';

import { Button } from './ui/button';
import NoData from './ui/nodata';

interface TargetTableProps {
  targetTableRef: React.RefObject<HTMLDivElement | null>;
  targetColumns: Array<Omit<HeaderColumnProps, 'type'>>;
  disabled: boolean;
  noDataComponent?: React.ReactNode;
  onBeforeTargetFieldRemove?: (targetId: string) => void | boolean;
  onAfterTargetFieldRemove?: (removedTargetId: string) => void;
  tableMappingHook: TableMappingRef;
}

const TargetRow = memo(
  ({
    field,
    disabled,
    tableMappingHook,
  }: {
    field: FieldItem;
    disabled?: boolean;
    tableMappingHook: TableMappingRef;
  }) => {
    const { id, key, ...rest } = field;

    const entries = Object.entries(rest ?? {}).filter(([, params]) => params);
    const columnCount = entries.length;

    const gridTemplateColumns = `repeat(${columnCount}, 1fr) auto`;

    return (
      <div key={id || key} className="target-table-row" style={{ gridTemplateColumns }}>
        {Object.entries(rest ?? {}).map(([fieldKey, params]) => {
          if (params) {
            return (
              <EditableCell
                key={`${id}-${fieldKey}`}
                fieldId={id}
                fieldKey={fieldKey}
                params={params}
                disabled={disabled}
                tableType="target"
                tableMappingHook={tableMappingHook}
              />
            );
          }

          return null;
        })}

        <div
          id={`connector-target-${id}`}
          data-testid={`connector-target-${id}`}
          className="target-connector connector"
          style={{ cursor: disabled ? 'not-allowed' : 'pointer', pointerEvents: disabled ? 'none' : 'auto' }}
        />
      </div>
    );
  },
);

const TargetTable = (props: TargetTableProps) => {
  const {
    targetTableRef,
    targetColumns,
    disabled,
    noDataComponent,
    onBeforeTargetFieldRemove,
    onAfterTargetFieldRemove,
    tableMappingHook,
  } = props;

  const { targetFields, removeTarget } = tableMappingHook;

  const handleTargetFieldRemove = (targetId: string) => {
    const shouldRemove = onBeforeTargetFieldRemove?.(targetId);

    if (shouldRemove === false) return;

    removeTarget(targetId);

    onAfterTargetFieldRemove?.(targetId);
  };

  return (
    <div ref={targetTableRef} className="target-table">
      <div className="target-table-header">
        <div className="target-table-header-container">
          {targetColumns.map((column) => (
            <div className="target-table-header-cell" key={column.key}>
              {column.title}
            </div>
          ))}
          {!disabled && targetFields.length > 0 ? <div style={{ width: '24px', height: '24px' }} /> : null}
        </div>
      </div>
      <div className="target-table-body">
        {targetFields.map((field) => (
          <div key={field.id || field.key} className="target-table-row-container">
            <TargetRow field={field} disabled={disabled} tableMappingHook={tableMappingHook} />
            {!disabled ? (
              <Button
                className="mapping-button"
                variant="outline"
                size="icon"
                onClick={() => handleTargetFieldRemove(field.id)}
              >
                <MinusIcon width={12} height={12} />
              </Button>
            ) : null}
          </div>
        ))}
        {targetFields.length <= 0 ? noDataComponent ? noDataComponent : <NoData /> : null}
      </div>
    </div>
  );
};

export default TargetTable;
