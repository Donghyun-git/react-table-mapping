/* eslint-disable react-hooks/exhaustive-deps */
import { debounce } from 'es-toolkit';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSourceFields, useTargetFields } from '@/contexts';

export interface EditableCellProps {
  fieldId: string;
  fieldKey: string;
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

const EditableCell = memo(({ fieldId, fieldKey, params }: EditableCellProps) => {
  const [localValue, setLocalValue] = useState(() => {
    if (typeof params === 'string') return params;

    if (params.type === 'input' || params.type === 'select') {
      return params.defaultValue || params.value || '';
    }
    return params.value || '';
  });
  const { updateSourceFieldValue } = useSourceFields();
  const { updateTargetFieldValue } = useTargetFields();

  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    if (typeof params === 'string') return;

    if (params.type === 'select') {
      setLocalValue(inputRef.current?.value || '');

      if (fieldId.includes('source') && !params.value) {
        updateSourceFieldValue(fieldId, params.columnKey, inputRef.current?.value || '');
      }

      if (fieldId.includes('target') && !params.value) {
        updateTargetFieldValue(fieldId, params.columnKey, inputRef.current?.value || '');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof params === 'string') return;

    if (params.type === 'input' || params.type === 'select') {
      if (params.value !== localValue && document.activeElement !== inputRef.current) {
        setLocalValue(params.defaultValue || params.value || '');
      }
    } else {
      if (params.value !== localValue && document.activeElement !== inputRef.current) {
        setLocalValue(params.value || '');
      }
    }
  }, [params]);

  const debouncedUpdate = useCallback(
    debounce((value: string) => {
      if (typeof params === 'string') return;

      if (params.type === 'input' || params.type === 'select') {
        if (params.columnKey) {
          if (fieldId.includes('source')) {
            updateSourceFieldValue(fieldId, params.columnKey, value);
          }
          if (fieldId.includes('target')) {
            updateTargetFieldValue(fieldId, params.columnKey, value);
          }
        }
      }
    }, 300),
    [fieldId, params, updateSourceFieldValue],
  );

  /**
   * handle change event target value
   * - field type is `input` or `select`
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      setLocalValue(newValue);
      debouncedUpdate(newValue);

      if (typeof params === 'string') return;

      if (params.type === 'input') {
        params.onChange?.(newValue);
      }
    },
    [debouncedUpdate, fieldId, fieldKey],
  );

  const handleSelectChange = useCallback(
    (value: string) => {
      setLocalValue(value);
      debouncedUpdate(value);

      if (typeof params === 'string') return;

      if (params.type === 'select') {
        params.onChange?.(value);
      }
    },
    [debouncedUpdate, fieldId, fieldKey],
  );

  if (typeof params === 'string') {
    return <div className="p-3 flex-1 custom-cell-text text-sm text-[var(--color-text-default)]">{params}</div>;
  }

  if (params.type === 'input') {
    return (
      <div className="p-3 flex-1 custom-cell-input text-sm text-[var(--color-text-default)]">
        <Input
          value={localValue}
          {...params.attributes}
          ref={inputRef as React.RefObject<HTMLInputElement>}
          onChange={handleInputChange}
        />
      </div>
    );
  }

  if (params.type === 'select') {
    return (
      <div className="p-3 flex-1 custom-cell-select text-sm text-[var(--color-text-default)]">
        <Select value={localValue} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {params.options.map((option) => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return <div className="p-3 flex-1 custom-cell-text text-sm text-[var(--color-text-default)]">{params.value}</div>;
});

export default EditableCell;
