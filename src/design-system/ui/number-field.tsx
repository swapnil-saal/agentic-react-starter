import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import { Minus, Plus } from 'lucide-react'
import * as React from 'react'

import { cn } from '../cn'
import { pressable, transitionColors } from './_motion'

const stepper = [
  'flex h-control-md w-9 items-center justify-center text-fg-muted',
  'focus-ring',
  transitionColors,
  pressable,
  'hover:bg-surface-hover hover:text-fg',
  'disabled:pointer-events-none disabled:opacity-50',
]

export function NumberField({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Root>) {
  return (
    <BaseNumberField.Root className={cn('inline-flex', className)} {...props}>
      <BaseNumberField.Group className="flex overflow-hidden rounded-md field-edge border-border bg-field focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
        <BaseNumberField.Decrement
          className={cn(stepper, 'border-r border-border')}
        >
          <Minus className="size-4" />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input className="h-control-md w-16 bg-transparent text-center text-base text-fg outline-none tabular-nums" />
        <BaseNumberField.Increment
          className={cn(stepper, 'border-l border-border')}
        >
          <Plus className="size-4" />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  )
}
