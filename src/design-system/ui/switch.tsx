import { Switch as BaseSwitch } from '@base-ui/react/switch'
import * as React from 'react'

import { cn } from '../cn'

/** Takes effect immediately. For something that needs submitting, use Checkbox. */
export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof BaseSwitch.Root>) {
  return (
    <BaseSwitch.Root
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent',
        'bg-surface-active transition-colors duration-(--duration-base) focus-ring',
        'data-[checked]:bg-accent',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        className={cn(
          'block size-4 rounded-full bg-surface shadow-sm',
          'translate-x-0.5 transition-transform duration-(--duration-base) ease-(--ease-out)',
          'data-[checked]:translate-x-4.5',
        )}
      />
    </BaseSwitch.Root>
  )
}
