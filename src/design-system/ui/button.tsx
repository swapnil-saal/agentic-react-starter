import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../cn'

export const buttonVariants = cva(
  // Base: layout, typography, focus and disabled behaviour shared by every
  // variant. Anything that differs between variants belongs below, not here.
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-md font-medium select-none',
    'transition-colors duration-[--duration-fast] ease-[--ease-out]',
    'focus-ring',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        solid: 'bg-accent text-on-accent hover:bg-accent-hover',
        outline:
          'border border-border bg-transparent text-fg hover:bg-surface-hover',
        subtle: 'bg-surface-hover text-fg hover:bg-surface-active',
        ghost:
          'bg-transparent text-fg-muted hover:bg-surface-hover hover:text-fg',
        danger: 'bg-danger text-on-danger hover:opacity-90',
        link: 'text-accent underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-control-sm px-3 text-sm',
        md: 'h-control-md px-4 text-base',
        lg: 'h-control-lg px-6 text-md',
        icon: 'h-control-md w-control-md p-0',
      },
      block: { true: 'w-full' },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  },
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  block,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  )
}
