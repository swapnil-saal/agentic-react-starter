import { Avatar as BaseAvatar } from '@base-ui/react/avatar'
import * as React from 'react'

import { cn } from '../cn'

export function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Root>) {
  return (
    <BaseAvatar.Root
      className={cn(
        'inline-flex size-9 shrink-0 select-none items-center justify-center',
        'overflow-hidden rounded-full bg-surface-hover align-middle',
        className,
      )}
      {...props}
    />
  )
}

export function AvatarImage(
  props: React.ComponentProps<typeof BaseAvatar.Image>,
) {
  return <BaseAvatar.Image className="size-full object-cover" {...props} />
}

export function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Fallback>) {
  return (
    <BaseAvatar.Fallback
      className={cn('text-sm font-medium text-fg-muted', className)}
      {...props}
    />
  )
}
