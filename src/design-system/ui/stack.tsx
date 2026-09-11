import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../cn'

const stackVariants = cva('flex', {
  variants: {
    direction: { row: 'flex-row', column: 'flex-col' },
    gap: {
      0: 'gap-0',
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8',
      12: 'gap-12',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
    wrap: { true: 'flex-wrap' },
  },
  defaultVariants: { direction: 'column', gap: 4 },
})

export interface StackProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'dir'>,
    VariantProps<typeof stackVariants> {}

/** Layout primitive. Prefer this over hand-written flex utilities so spacing
 *  stays on the scale and intent reads from the markup. */
export function Stack({
  className,
  direction,
  gap,
  align,
  justify,
  wrap,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        stackVariants({ direction, gap, align, justify, wrap }),
        className,
      )}
      {...props}
    />
  )
}
