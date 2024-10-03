import { cn } from '@libs/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Loader } from 'lucide-react';
import React from 'react';

const spinnerVariants = cva(
  'absolute bg-white/60 w-full h-full top-0 bottom-0 left-0 right-0 flex-col items-center justify-center',
  {
    variants: {
      show: {
        true: 'flex',
        false: 'hidden',
      },
    },
    defaultVariants: {
      show: true,
    },
  },
);

const loaderVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      small: 'size-6',
      medium: 'size-8',
      large: 'size-12',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

interface SpinnerContentProps extends VariantProps<typeof spinnerVariants>, VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Spinner({ size, show = true, children, className }: SpinnerContentProps) {
  return (
    <>
      {children}
      <div className={spinnerVariants({ show })}>
        {show ? <Loader className={cn(loaderVariants({ size }), className)} /> : null}
      </div>
    </>
  );
}
