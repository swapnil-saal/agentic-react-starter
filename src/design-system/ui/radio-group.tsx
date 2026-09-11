import { Radio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import * as React from 'react'

import { cn } from '../cn'
import { indicator, transitionColors } from './_motion'

export function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseRadioGroup>) {
  return (
    <BaseRadioGroup
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

export function RadioItem({
  className,
  ...props
}: React.ComponentProps<typeof Radio.Root>) {
  return (
    <Radio.Root
      className={cn(
        'flex size-4.5 shrink-0 items-center justify-center rounded-full border border-border-strong',
        'bg-surface focus-ring',
        transitionColors,
        'data-[checked]:border-accent data-[checked]:bg-accent',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <Radio.Indicator
        className={cn(
          'size-1.5 rounded-full bg-on-accent data-[unchecked]:hidden',
          indicator,
        )}
      />
    </Radio.Root>
  )
}
