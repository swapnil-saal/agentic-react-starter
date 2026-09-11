import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible'
import * as React from 'react'

import { cn } from '../cn'

export const Collapsible = BaseCollapsible.Root
export const CollapsibleTrigger = BaseCollapsible.Trigger

export function CollapsiblePanel({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      className={cn(
        'overflow-hidden',
        'h-[var(--collapsible-panel-height)] transition-[height] duration-[--duration-base] ease-[--ease-out]',
        'data-[starting-style]:h-0 data-[ending-style]:h-0',
        className,
      )}
      {...props}
    />
  )
}
