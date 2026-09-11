import { Field as BaseField } from '@base-ui/react/field'
import * as React from 'react'

import { cn } from '../cn'

/**
 * Label / control / description / error, wired together with the right `id`
 * and `aria-describedby` by Base UI. Always prefer this over a hand-rolled
 * <label> — getting the association right by hand is easy to get subtly wrong,
 * and screen readers depend on it.
 */
export function Field({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Root>) {
  return (
    <BaseField.Root
      className={cn('flex flex-col gap-1.5', className)}
      {...props}
    />
  )
}

export function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Label>) {
  return (
    <BaseField.Label
      className={cn('text-sm font-medium text-fg', className)}
      {...props}
    />
  )
}

export function FieldDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Description>) {
  return (
    <BaseField.Description
      className={cn('text-sm text-fg-muted', className)}
      {...props}
    />
  )
}

export function FieldError({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Error>) {
  return (
    <BaseField.Error
      className={cn('text-sm text-danger-fg', className)}
      {...props}
    />
  )
}

export const FieldControl = BaseField.Control
