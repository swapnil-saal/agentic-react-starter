import { Progress as BaseProgress } from '@base-ui/react/progress'
import * as React from 'react'

import { cn } from '../cn'
import { transitionAll } from './_motion'

export function Progress({
  className,
  ...props
}: React.ComponentProps<typeof BaseProgress.Root>) {
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
