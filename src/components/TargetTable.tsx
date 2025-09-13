import { memo, useEffect } from 'react';

import EditableCell from '@/components/EditableCell';
import { useTargetFields } from '@/contexts';
import type { FieldItem, FieldItemInput, HeaderColumnProps } from '@/types/table-mapping';
import { generateTargetFields } from '@/utils';

interface TargetTableProps {
  targetTableRef: React.RefObject<HTMLDivElement | null>;
  targets: FieldItemInput[];
  targetColumns: Array<Omit<HeaderColumnProps, 'type'>>;
}

const TargetRow = memo(({ field }: { field: FieldItem }) => {
  const { id, key, ...rest } = field;

  const entries = Object.entries(rest ?? {}).filter(([, params]) => params);
  const columnCount = entries.length;

  const gridTemplateColumns = `repeat(${columnCount}, 1fr) auto`;

  return (
    <div key={id || key} className="target-table-row" style={{ gridTemplateColumns }}>
      {Object.entries(rest ?? {}).map(([fieldKey, params]) => {
        if (params) {
          return <EditableCell key={`${id}-${fieldKey}`} fieldId={id} fieldKey={fieldKey} params={params} />;
        }

        return null;
      })}

      <div id={`connector-${id}`} className="target-connector connector" />
    </div>
  );
});

const TargetTable = ({ targetTableRef, targets, targetColumns }: TargetTableProps) => {
  const { targetFields, updateTargetFields } = useTargetFields();

  useEffect(() => {
    const initialFields = generateTargetFields({ targets });

    updateTargetFields(initialFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={targetTableRef} className="target-table">
      <div className="target-table-header">
        {targetColumns.map((column) => (
          <span key={column.key} className="target-table-header-cell">
            {column.title}
          </span>
        ))}
      </div>
      <div className="target-table-body">
        {targetFields.map((field) => (
          <TargetRow key={field.id || field.key} field={field} />
        ))}
      </div>
    </div>
  );
};

export default TargetTable;
