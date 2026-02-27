import { cn } from '@/lib/utils';
import * as React from 'react';

type InputProps = React.ComponentProps<'input'> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className='relative w-full'>
        {leftIcon && (
          <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          type={type}
          data-slot='input'
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
            'dark:bg-input/30 border-input h-12 w-full min-w-0 rounded-sm border bg-transparent',
            'px-3 py-2 text-base outline-none transition-[color,box-shadow]',
            'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[0px] focus-within:border-2',
            'aria-invalid:ring-destructive/50 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
