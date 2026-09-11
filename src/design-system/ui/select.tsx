import { Select as BaseSelect } from '@base-ui/react/select'
import { Check, ChevronDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '../cn'
import { popupItem, popupSurface } from './_popup'

export const Select = BaseSelect.Root
export const SelectValue = BaseSelect.Value

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger>) {
  return (
    <BaseSelect.Trigger
      className={cn(
        'flex h-control-md w-full items-center justify-between gap-2 rounded-md',
        'border border-border bg-surface px-3 text-base text-fg',
        'transition-colors duration-[--duration-fast] focus-ring hover:border-border-strong',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon>
        <ChevronDown className="size-4 shrink-0 text-fg-muted" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
}

export function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup>) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner sideOffset={6} alignItemWithTrigger={false}>
        <BaseSelect.Popup className={cn(popupSurface, className)} {...props}>
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item className={cn(popupItem, 'pl-8', className)} {...props}>
      <BaseSelect.ItemIndicator className="absolute left-2.5">
        <Check className="size-3.5" />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  )
}
