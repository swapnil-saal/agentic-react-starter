import * as React from 'react'

import { cn } from '../cn'

/** Loading placeholder. Match the shape of the real content so the layout does
 *  not jump when data arrives. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-surface-hover', className)}
      {...props}
    />
  )
}
