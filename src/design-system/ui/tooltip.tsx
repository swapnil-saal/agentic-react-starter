import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import * as React from 'react'

import { cn } from '../cn'
import { popSurface } from './_motion'

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
            ...popSurface,
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
