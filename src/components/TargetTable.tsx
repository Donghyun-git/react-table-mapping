import { MinusIcon } from 'lucide-react';
import { memo, useEffect } from 'react';

import EditableCell from '@/components/EditableCell';
import { useMappings, useTargetFields } from '@/contexts';
import type { FieldItem, FieldItemInput, HeaderColumnProps } from '@/types/table-mapping';
import { generateTargetFields } from '@/utils';

import { Button } from './ui/button';
import NoData from './ui/nodata';

interface TargetTableProps {
  targetTableRef: React.RefObject<HTMLDivElement | null>;
  targets: FieldItemInput[];
  targetColumns: Array<Omit<HeaderColumnProps, 'type'>>;
  disabled: boolean;
  noDataComponent?: React.ReactNode;
  afterTargetFieldRemove?: (removedTargetId: string) => void;
}

const TargetRow = memo(({ field, disabled }: { field: FieldItem; disabled?: boolean }) => {
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
            />
          );
        }

        return null;
      })}

      <div
        id={`connector-target-${id}`}
        className="target-connector connector"
        style={{ cursor: disabled ? 'not-allowed' : 'pointer', pointerEvents: disabled ? 'none' : 'auto' }}
      />
    </div>
  );
});

const TargetTable = (props: TargetTableProps) => {
  const { targetTableRef, targets, targetColumns, disabled, noDataComponent, afterTargetFieldRemove } = props;

  const { targetFields, removeTargetField, updateTargetFields } = useTargetFields();
  const { mappings, removeMapping, redraw } = useMappings();

  const handleTargetFieldRemove = (targetId: string) => {
    const relatedMappings = mappings.filter((mapping) => mapping.target === targetId);

    relatedMappings.forEach((mapping) => {
      removeMapping(mapping.id);
    });

    removeTargetField(targetId);

    afterTargetFieldRemove?.(targetId);

    setTimeout(() => {
      redraw();
    }, 50);
  };

  useEffect(() => {
    const initialFields = generateTargetFields({ targets });

    updateTargetFields(initialFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <TargetRow field={field} disabled={disabled} />
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
