import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { Check, Minus } from 'lucide-react'
import * as React from 'react'

import { cn } from '../cn'

export function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof BaseCheckbox.Root>) {
  return (
    <BaseCheckbox.Root
      className={cn(
        'flex size-4.5 shrink-0 items-center justify-center rounded-sm border border-border-strong',
        'bg-surface transition-colors duration-(--duration-fast) focus-ring',
        'data-[checked]:border-accent data-[checked]:bg-accent data-[checked]:text-on-accent',
        'data-[indeterminate]:border-accent data-[indeterminate]:bg-accent data-[indeterminate]:text-on-accent',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="flex data-[unchecked]:hidden">
        {props.indeterminate ? (
          <Minus className="size-3" strokeWidth={3} />
        ) : (
          <Check className="size-3" strokeWidth={3} />
        )}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
}
