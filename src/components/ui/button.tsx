import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

export interface ButtonProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

function Button({ className = '', variant = 'default', size = 'default', asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const buttonClass = ['mapping-button', `mapping-button--${variant}`, `mapping-button--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return <Comp data-slot="button" className={buttonClass} {...props} />;
}

export { Button };
