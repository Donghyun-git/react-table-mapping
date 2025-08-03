import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const rowVariant = cva('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', {
  variants: {
    size: {
      default: 'h-[52px]',
      md: 'h-[72px]',
      lg: 'h-[96px]',
    },
  },
});

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div data-slot="table-container" className="relative h-full w-full overflow-auto rounded-lg border">
      <table data-slot="table" className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        'text-body-basic-medium bg-(--color-bg-mapping-secondary) text-(--color-text-secondary) [&_tr]:border-b',
        className,
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'text-body-basic-regular h-[52px] w-fit border-t bg-(--color-bg-mapping-secondary) p-2 font-medium last:[&>tr]:border-b-0',
        className,
      )}
      {...props}
    />
  );
}

export interface TableRowProps extends React.ComponentProps<'tr'>, VariantProps<typeof rowVariant> {}

function TableRow({ className, size, ...props }: TableRowProps) {
  return <tr data-slot="table-row" className={cn('', cn(rowVariant({ size })), className)} {...props} />;
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-muted-foreground h-10 border-r px-2 text-center align-middle font-medium last:border-r-0 [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn('px-4 py-3 align-middle text-sm [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return <caption data-slot="table-caption" className={cn('text-muted-foreground mt-4', className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
