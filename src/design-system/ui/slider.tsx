import { Slider as BaseSlider } from '@base-ui/react/slider'
import * as React from 'react'

import { cn } from '../cn'

export function Slider({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Root>) {
  return (
    <BaseSlider.Root className={cn('w-full', className)} {...props}>
      <BaseSlider.Control className="flex w-full touch-none items-center py-2">
        <BaseSlider.Track className="h-1.5 w-full rounded-full bg-surface-active">
          <BaseSlider.Indicator className="h-full rounded-full bg-accent" />
          <BaseSlider.Thumb className="size-4 rounded-full border-2 border-accent bg-surface shadow-sm focus-ring" />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}
