/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useSourceFields, useTargetFields } from '../contexts';

import { debounce } from 'es-toolkit';

interface EditableCellProps {
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
        attributes?: React.InputHTMLAttributes<HTMLInputElement>;
        onChange?: (value: string) => void;
      }
    | {
        type: 'select';
        defaultValue?: string;
        value?: string;
        columnKey: string;
        attributes?: React.SelectHTMLAttributes<HTMLSelectElement>;
        options: {
          label: string;
          value: string;
          disabled?: boolean;
        }[];
        onChange?: (value: string) => void;
      };
  cellStyle: React.CSSProperties;
}

const EditableCell = memo(({ fieldId, fieldKey, params, cellStyle }: EditableCellProps) => {
  const [localValue, setLocalValue] = useState(() => {
    if (params.type === 'input' || params.type === 'select') {
      return params.defaultValue || params.value || '';
    }
    return params.value || '';
  });
  const { updateSourceFieldValue } = useSourceFields();
  const { updateTargetFieldValue } = useTargetFields();

  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
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
    if (params.type === 'input' || params.type === 'select') {
      if (params.value !== localValue && document.activeElement !== inputRef.current) {
        setLocalValue(params.defaultValue || params.value || '');
      }
    } else {
      if (params.value !== localValue && document.activeElement !== inputRef.current) {
        setLocalValue(params.value || '');
      }
    }
  }, [params.value]);

  const debouncedUpdate = useCallback(
    debounce((value: string) => {
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

  // 변경 핸들러
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      debouncedUpdate(newValue);
    },
    [debouncedUpdate, fieldId, fieldKey],
  );

  if (params.type === 'input') {
    return (
      <div className="cell custom-cell" style={cellStyle}>
        <input
          value={localValue}
          {...params.attributes}
          ref={inputRef as React.RefObject<HTMLInputElement>}
          onChange={(e) => {
            handleChange(e);
          }}
          style={{
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        />
      </div>
    );
  }

  if (params.type === 'select') {
    return (
      <div className="cell custom-cell" style={cellStyle}>
        <select
          value={localValue}
          {...params.attributes}
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          onChange={handleChange}
          style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
        >
          {params.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="cell custom-cell" style={cellStyle}>
      {params.value}
    </div>
  );
});

export default EditableCell;
