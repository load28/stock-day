import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@stock-day/lib/utils';
import { Slot } from '@radix-ui/react-slot';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-foreground',
      h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-foreground',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight text-foreground',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight text-foreground',
      h5: 'scroll-m-20 text-lg font-semibold tracking-tight text-foreground',
      p: 'leading-7 text-base [&:not(:first-child)]:mt-6 text-muted-foreground'
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }
  },
  defaultVariants: {
    variant: 'p',
    weight: 'normal',
    align: 'left'
  }
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement>,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean;
}

const Typo = React.forwardRef<HTMLHeadingElement | HTMLParagraphElement, TypographyProps>(
  ({ className, variant, weight, align, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : variant || 'p';
    return React.createElement(Comp, {
      className: cn(typographyVariants({ variant, weight, align, className })),
      ref,
      ...props
    });
  }
);
Typo.displayName = 'Typography';

export { Typo, typographyVariants };
