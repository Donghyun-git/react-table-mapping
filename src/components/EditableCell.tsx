import React, { memo, useCallback, useSyncExternalStore } from 'react';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTableMappingStore } from '@/store/TableMappingStoreContext';
import type { StoreTopic } from '@/store/createTableMappingStore';
import type { TableMappingRef } from '@/types/table-mapping';

export interface EditableCellProps {
  fieldId: string;
  fieldKey: string;
  disabled?: boolean;
  tableType: 'source' | 'target';
  /** @deprecated Kept for backward compat with SourceTable/TargetTable — not used internally. */
  tableMappingHook?: TableMappingRef;
  params:
    | {
        type: 'string';
        columnKey: string;
        value: string;
      }
    | {
        type: 'input';
        defaultValue?: string;
        value?: string;
        columnKey: string;
        attributes?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;
        onChange?: (value: string) => void;
      }
    | {
        type: 'select';
        defaultValue?: string;
        value?: string;
        columnKey: string;
        attributes?: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'>;
        options: {
          label: string;
          value: string;
          disabled?: boolean;
        }[];
        onChange?: (value: string) => void;
      }
    | string;
}

/**
 * Static display cell
 */
const StaticCell = memo(({ text }: { text: string }) => <div className="custom-cell-text">{text}</div>);

interface DynamicParams {
  type: 'input' | 'select';
  columnKey: string;
  value?: string;
  defaultValue?: string;
  attributes?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;
  options?: { label: string; value: string; disabled?: boolean }[];
  onChange?: (value: string) => void;
}

/**
 * Dynamic (editable) cell
 */
const DynamicCell = memo(
  ({
    fieldId,
    params,
    disabled,
    tableType,
  }: {
    fieldId: string;
    params: DynamicParams;
    disabled?: boolean;
    tableType: 'source' | 'target';
  }) => {
    const store = useTableMappingStore();
    const topic = `field:${tableType}:${fieldId}:${params.columnKey}` as StoreTopic;

    const subscribeField = useCallback((cb: () => void) => store.subscribe(topic, cb), [store, topic]);
    const getFieldSnapshot = useCallback(
      () => store.getFieldValue(tableType, fieldId, params.columnKey),
      [store, tableType, fieldId, params.columnKey],
    );

    const value = useSyncExternalStore(subscribeField, getFieldSnapshot);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        store.setFieldValue(tableType, fieldId, params.columnKey, newValue);
        params.onChange?.(newValue);
      },
      [store, tableType, fieldId, params],
    );

    const handleSelectChange = useCallback(
      (newValue: string) => {
        store.setFieldValue(tableType, fieldId, params.columnKey, newValue);
        params.onChange?.(newValue);
      },
      [store, tableType, fieldId, params],
    );

    if (params.type === 'input') {
      return (
        <div className="custom-cell-input">
          <Input value={value} {...params.attributes} onChange={handleInputChange} disabled={disabled} />
        </div>
      );
    }

    return (
      <div className="custom-cell-select">
        <Select value={value} onValueChange={handleSelectChange}>
          <SelectTrigger disabled={disabled}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {params.options?.map((option) => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);

const EditableCell = memo(({ fieldId, params, disabled = true, tableType }: EditableCellProps) => {
  if (typeof params === 'string') return <StaticCell text={params} />;
  if (params.type === 'string') return <StaticCell text={params.value} />;

  return <DynamicCell fieldId={fieldId} params={params as DynamicParams} disabled={disabled} tableType={tableType} />;
});

export default EditableCell;
