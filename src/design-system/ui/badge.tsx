import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../cn'

const badgeVariants = cva(
  // `w-fit` matters: as a child of a flex column the badge would otherwise
  // stretch to the full width. In a row its width is content-based anyway, and
  // align-self is left alone so vertical centring still works.
  'inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      tone: {
        neutral: 'border-border bg-surface-hover text-fg-muted',
        accent: 'border-accent-border bg-accent-subtle text-accent',
        success: 'border-success-border bg-success-subtle text-success-fg',
        warning: 'border-warning-border bg-warning-subtle text-warning-fg',
        danger: 'border-danger-border bg-danger-subtle text-danger-fg',
        info: 'border-info-border bg-info-subtle text-info-fg',
      },
      solid: { true: 'border-transparent' },
    },
    compoundVariants: [
      { tone: 'accent', solid: true, class: 'bg-accent text-on-accent' },
      { tone: 'success', solid: true, class: 'bg-success text-on-success' },
      { tone: 'warning', solid: true, class: 'bg-warning text-on-warning' },
      { tone: 'danger', solid: true, class: 'bg-danger text-on-danger' },
      { tone: 'info', solid: true, class: 'bg-info text-on-info' },
    ],
    defaultVariants: { tone: 'neutral' },
  },
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Small leading dot. Pairs meaning with shape, not colour alone. */
  dot?: boolean
}

export function Badge({
  className,
  tone,
  solid,
  dot,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, solid }), className)} {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  )
}
