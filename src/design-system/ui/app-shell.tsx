import * as React from 'react'

import { cn } from '../cn'

/**
 * Sidebar + header + content layout.
 *
 * Plain CSS grid rather than a configurable component: layout chrome is the
 * thing an app is most likely to want to change, so it stays simple and
 * readable instead of hiding behind props.
 */
export function AppShell({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'grid h-full grid-cols-1 md:grid-cols-[var(--spacing-sidebar)_1fr]',
        className,
      )}
      {...props}
    />
  )
}

export function AppSidebar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside
      className={cn(
        'hidden flex-col gap-1 border-r border-border bg-bg-subtle p-3 md:flex',
        className,
      )}
      {...props}
    />
  )
}

export function AppSidebarBrand({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mb-2 flex h-header items-center px-2 text-md font-semibold text-fg',
        className,
      )}
      {...props}
    />
  )
}

export interface SidebarLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
}

/** Styling only — pass your router's Link via `asChild`-style composition by
 *  rendering this inside it, or spread its className onto a router Link. */
export const sidebarLinkClasses = (active?: boolean) =>
  cn(
    'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-base no-underline',
    'transition-colors duration-[--duration-fast] focus-ring',
    active
      ? 'bg-surface font-medium text-fg shadow-sm'
      : 'text-fg-muted hover:bg-surface-hover hover:text-fg',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  )

export function AppMain({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="flex min-w-0 flex-col">
      <main className={cn('flex-1 overflow-y-auto', className)} {...props} />
    </div>
  )
}

export function AppHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex h-header shrink-0 items-center justify-between gap-4',
        'border-b border-border bg-bg/80 px-6 backdrop-blur',
        className,
      )}
      {...props}
    />
  )
}
