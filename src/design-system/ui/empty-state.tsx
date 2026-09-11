import * as React from 'react'

import { cn } from '../cn'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  /** The action that fills the emptiness. An empty state without one is a
   *  dead end. */
  action?: React.ReactNode
}

export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg',
        'border border-dashed border-border px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      {icon && <div className="text-fg-subtle [&_svg]:size-8">{icon}</div>}
      <div className="flex flex-col gap-1">
        <p className="text-md font-medium text-fg">{title}</p>
        {description && (
          <p className="max-w-sm text-base text-fg-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
