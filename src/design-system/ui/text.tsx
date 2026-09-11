import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../cn'

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    tone: {
      default: 'text-fg',
      muted: 'text-fg-muted',
      subtle: 'text-fg-subtle',
      accent: 'text-accent',
      danger: 'text-danger-fg',
      success: 'text-success-fg',
      warning: 'text-warning-fg',
    },
    mono: { true: 'font-mono' },
    truncate: { true: 'truncate' },
  },
  defaultVariants: { size: 'base', weight: 'normal', tone: 'default' },
})

type TextElement = 'p' | 'span' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'h4'

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: TextElement
}

/** Typography. Headings get `as` plus an explicit size — the two are separate
 *  so document structure never has to be bent to get the right visual weight. */
export function Text({
  as: Tag = 'span',
  className,
  size,
  weight,
  tone,
  mono,
  truncate,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(
        textVariants({ size, weight, tone, mono, truncate }),
        className,
      )}
      {...props}
    />
  )
}
