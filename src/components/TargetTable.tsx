import React, { memo, useState } from 'react';

import EditableCell from '@/components/EditableCell';
import { useTargetFields } from '@/contexts';
import type { FieldItem, FieldItemInput, HeaderColumnProps } from '@/types/table-mapping';
import { generateTargetFields } from '@/utils';

interface TargetTableProps {
  targets: FieldItemInput[];
  targetColumns: Array<Omit<HeaderColumnProps, 'type'>>;
}

const TargetRow = memo(({ field }: { field: FieldItem }) => {
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
        className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--color-icon-primary)] border-2 border-[var(--color-bg-mapping-primary)] z-[9999] cursor-pointer shadow-[var(--shadow-sm)] transition-all duration-200 hover:scale-110 hover:bg-[var(--color-icon-info)]"
      />
    </div>
  );
});

const TargetTable = ({ targets, targetColumns }: TargetTableProps) => {
  const [targetFieldState, setTargetFieldState] = useState<FieldItem[]>([]);
  const { updateTargetFields } = useTargetFields();

  React.useEffect(() => {
    const initialFields = generateTargetFields({ targets });

    updateTargetFields(initialFields);
    setTargetFieldState(initialFields);
  }, [targets, updateTargetFields]);

  return (
    <div className="target-table min-w-[300px] max-w-[600px] bg-[var(--color-bg-mapping-primary)] rounded-lg shadow-[var(--shadow-sm)] z-10 ml-12">
      <div className="flex bg-[var(--color-bg-mapping-secondary)] border-b border-b-[var(--color-border-default)] rounded-t-lg">
        {targetColumns.map((column) => (
          <span key={column.key} className="p-3 font-medium flex-1 text-center text-[var(--color-text-default)]">
            {column.title}
          </span>
        ))}
      </div>
      <div className="min-h-[300px]">
        {targetFieldState.map((field) => (
          <TargetRow key={field.id || field.key} field={field} />
        ))}
      </div>
    </div>
  );
};

export default TargetTable;
