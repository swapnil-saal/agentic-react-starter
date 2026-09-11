import { Popover as BasePopover } from '@base-ui/react/popover'
import * as React from 'react'

import { cn } from '../cn'

export const Popover = BasePopover.Root
export const PopoverTrigger = BasePopover.Trigger
export const PopoverClose = BasePopover.Close

export function PopoverContent({
  className,
  children,
  sideOffset = 8,
  align = 'center',
  side = 'bottom',
  ...props
}: React.ComponentProps<typeof BasePopover.Popup> & {
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
}) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner sideOffset={sideOffset} align={align} side={side}>
        <BasePopover.Popup
          className={cn(
            'z-50 min-w-48 rounded-lg border border-border bg-raised p-4 shadow-lg',
            'transition-all duration-[--duration-fast] ease-[--ease-out]',
            'data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
            'data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
            className,
          )}
          {...props}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}
