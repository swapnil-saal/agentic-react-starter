import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import * as React from 'react'

import { cn } from '../cn'

export const Tabs = BaseTabs.Root

export function TabsList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      className={cn('relative flex gap-1 border-b border-border', className)}
      {...props}
    >
      {children}
      {/* Base UI positions this for us; it slides between the active tabs. */}
      <BaseTabs.Indicator
        className={cn(
          'absolute bottom-0 left-0 h-0.5 bg-accent',
          'w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)]',
          'transition-all duration-[--duration-base] ease-[--ease-out]',
        )}
      />
    </BaseTabs.List>
  )
}

export function TabsTab({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      className={cn(
        'px-3 py-2 text-base font-medium text-fg-muted',
        'transition-colors duration-[--duration-fast] focus-ring',
        'hover:text-fg data-[selected]:text-fg',
        className,
      )}
      {...props}
    />
  )
}

export function TabsPanel({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel className={cn('pt-4 focus-ring', className)} {...props} />
  )
}
