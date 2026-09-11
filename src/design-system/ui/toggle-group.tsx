import { Toggle } from '@base-ui/react/toggle'
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group'
import * as React from 'react'

import { cn } from '../cn'

export function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseToggleGroup>) {
  return (
    <BaseToggleGroup
      className={cn(
        'inline-flex gap-1 rounded-md border border-border bg-bg-subtle p-1',
        className,
      )}
      {...props}
    />
  )
}

export function ToggleItem({
  className,
  ...props
}: React.ComponentProps<typeof Toggle>) {
  return (
    <Toggle
      className={cn(
        'inline-flex h-7 items-center justify-center gap-2 rounded px-2.5',
        'text-sm font-medium text-fg-muted focus-ring',
        'transition-colors duration-[--duration-fast]',
        'hover:text-fg data-[pressed]:bg-surface data-[pressed]:text-fg data-[pressed]:shadow-sm',
        '[&_svg]:size-4',
        className,
      )}
      {...props}
    />
  )
}
