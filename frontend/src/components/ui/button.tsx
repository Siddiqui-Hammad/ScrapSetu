import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 hover:shadow-glow-emerald',
        primary: 'bg-forest-900 text-white shadow-sm hover:bg-forest-950',
        secondary: 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100',
        outline: 'border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 shadow-xs',
        ghost: 'hover:bg-stone-100 text-stone-700',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        gold: 'bg-amber-400 text-stone-950 hover:bg-amber-300 font-bold shadow-sm ring-1 ring-amber-500/20',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-2xl px-6 text-base font-bold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
