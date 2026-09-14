import { Slider as BaseSlider } from '@base-ui/react/slider'
import * as React from 'react'

import { cn } from '../cn'
import type { Labelled } from './_a11y'

/**
 * A slider's thumb is a native range input, and it is that input a screen
 * reader announces — so the label has to reach it, not just the wrapper.
 * Base UI exposes `getAriaLabel` on the thumb for exactly this.
 *
 * The type requires a label, because a slider renders no text of its own.
 */
export type SliderProps = Omit<
  React.ComponentProps<typeof BaseSlider.Root>,
  'aria-label' | 'aria-labelledby'
> &
  Labelled

export function Slider({ className, ...props }: SliderProps) {
  const label = 'aria-label' in props ? props['aria-label'] : undefined
  const labelledBy =
    'aria-labelledby' in props ? props['aria-labelledby'] : undefined

  return (
    <BaseSlider.Root className={cn('w-full', className)} {...props}>
      <BaseSlider.Control className="flex w-full touch-none items-center py-2">
        <BaseSlider.Track className="h-1.5 w-full rounded-full bg-surface-active">
          <BaseSlider.Indicator className="h-full rounded-full bg-accent" />
          <BaseSlider.Thumb
            aria-labelledby={labelledBy}
            getAriaLabel={label ? () => label : undefined}
            className="size-4 rounded-full border-2 border-accent bg-surface shadow-sm focus-ring"
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}
