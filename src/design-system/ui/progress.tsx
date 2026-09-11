import { Progress as BaseProgress } from '@base-ui/react/progress'
import * as React from 'react'

import { cn } from '../cn'

export function Progress({
  className,
  ...props
}: React.ComponentProps<typeof BaseProgress.Root>) {
  return (
    <BaseProgress.Root className={cn('w-full', className)} {...props}>
      <BaseProgress.Track className="h-1.5 w-full overflow-hidden rounded-full bg-surface-active">
        <BaseProgress.Indicator className="h-full rounded-full bg-accent transition-all duration-(--duration-base) ease-(--ease-out)" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}
