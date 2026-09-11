import * as React from 'react'

import { cn } from '../cn'

/**
 * Plain native input. Deliberately keeps the DOM `onChange` (event-first)
 * rather than a value-first callback, so `register()` from React Hook Form and
 * any other uncontrolled form library work by spreading props directly.
 */
export const inputClasses = [
  'flex h-control-md w-full rounded-md border border-border bg-surface px-3',
  'text-base text-fg placeholder:text-fg-subtle',
  'transition-colors duration-[--duration-fast]',
  'focus-ring hover:border-border-strong',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-danger aria-invalid:focus-visible:outline-danger',
]

export function Input({
  className,
  type = 'text',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input type={type} className={cn(inputClasses, className)} {...props} />
  )
}
