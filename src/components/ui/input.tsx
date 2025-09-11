import * as React from 'react';

export interface InputProps extends React.ComponentProps<'input'> {
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

function Input({ className, type, iconEnd, iconStart, ref, ...props }: InputProps) {
  const inputClasses = [
    'mapping-table-input',
    type === 'file' && 'mapping-table-input-file',
    iconStart && 'mapping-table-input-with-start-icon',
    iconEnd && 'mapping-table-input-with-end-icon',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="mapping-table-input-container">
      <input type={type} className={inputClasses} ref={ref} {...props} />
      {iconStart && <div className="mapping-table-input-icon-start">{iconStart}</div>}
      {iconEnd && <div className="mapping-table-input-icon-end">{iconEnd}</div>}
    </div>
  );
}

Input.displayName = 'Input';

export { Input };
