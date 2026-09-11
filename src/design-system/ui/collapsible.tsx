import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible'
import * as React from 'react'

import { cn } from '../cn'
import { collapsePanel } from './_motion'

export const Collapsible = BaseCollapsible.Root
export const CollapsibleTrigger = BaseCollapsible.Trigger

export function CollapsiblePanel({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      className={cn(collapsePanel('--collapsible-panel-height'), className)}
      {...props}
    />
  )
}
