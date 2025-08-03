import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

function Input({ className, type, iconEnd, iconStart, ref, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          'ring-offset-background file:bg-accent file:text-foreground flex h-9 w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-mapping-secondary)] px-1.5 py-1 leading-4 file:absolute file:top-0 file:-left-0 file:mr-0 file:h-full file:rounded-l-md file:border-1 file:px-1.5 file:py-1 file:text-xs file:font-medium placeholder:text-[var(--color-text-tertiary)] read-only:cursor-default hover:bg-(--color-bg-mapping-secondary-hover) hover:placeholder:text-[var(--color-text-secondary)] focus:placeholder:text-[var(--color-text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--gray-1000)] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-[var(--color-bg-mapping-secondary-disabled)] disabled:text-[var(--color-text-secondary)] disabled:file:!text-[var(--color-text-secondary)] md:text-sm',
          type === 'file' && '!pl-21.5',
          iconStart && 'pl-7',
          iconEnd && 'pr-7',
          className,
        )}
        ref={ref}
        {...props}
      />
      {iconStart && (
        <div className="absolute top-[50%] left-1.5 h-4 w-4 -translate-y-1/2 text-(--color-icon-tertiary) peer-hover:text-(--color-icon-secondary) peer-focus:text-(--color-icon-default)">
          {iconStart}
        </div>
      )}
      {iconEnd && (
        <div className="absolute top-[50%] right-1.5 h-4 w-4 -translate-y-1/2 text-(--color-icon-tertiary) peer-hover:text-(--color-icon-secondary) peer-focus:text-(--color-icon-default)">
          {iconEnd}
        </div>
      )}
    </div>
  );
}

Input.displayName = 'Input';

export { Input };
