import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import * as React from 'react'

import { cn } from '../cn'

/** Mount once near the app root; it coordinates delay across all tooltips so
 *  moving between adjacent targets doesn't re-trigger the open delay. */
export const TooltipProvider = BaseTooltip.Provider
export const Tooltip = BaseTooltip.Root
export const TooltipTrigger = BaseTooltip.Trigger

export function TooltipContent({
  className,
  children,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Popup> & { sideOffset?: number }) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner sideOffset={sideOffset}>
        <BaseTooltip.Popup
          className={cn(
            'z-50 rounded-md bg-fg px-2 py-1 text-xs font-medium text-fg-inverted shadow-md',
            'transition-all duration-(--duration-fast) ease-(--ease-out)',
            'data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
            'data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
            className,
          )}
          {...props}
        >
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}
