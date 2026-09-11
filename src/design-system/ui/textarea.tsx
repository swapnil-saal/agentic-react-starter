import * as React from 'react'

import { cn } from '../cn'
import { transitionColors } from './_motion'

export function Textarea({
  className,
  rows = 4,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'flex w-full rounded-md border border-border bg-surface px-3 py-2',
        'text-base text-fg placeholder:text-fg-subtle',
        transitionColors,
        'focus-ring hover:border-border-strong',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-danger',
        className,
      )}
      {...props}
    />
  )
}
