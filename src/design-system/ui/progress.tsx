import { Progress as BaseProgress } from '@base-ui/react/progress'
import * as React from 'react'

import { cn } from '../cn'
import type { Labelled } from './_a11y'
import { transitionAll } from './_motion'

/**
 * A progress bar renders no text, so it needs a label to mean anything to a
 * screen reader — see `_a11y.ts`. The type requires one.
 */
export type ProgressProps = Omit<
  React.ComponentProps<typeof BaseProgress.Root>,
  'aria-label' | 'aria-labelledby'
> &
  Labelled

export function Progress({ className, ...props }: ProgressProps) {
  return (
    <BaseProgress.Root className={cn('w-full', className)} {...props}>
      <BaseProgress.Track className="h-1.5 w-full overflow-hidden rounded-full bg-surface-active">
        <BaseProgress.Indicator
          className={cn('h-full rounded-full bg-accent', transitionAll)}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}
