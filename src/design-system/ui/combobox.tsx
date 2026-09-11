import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '../cn'
import { popupItem, popupSurface } from './_popup'

/** Filterable single/multi select. For free-text with suggestions where any
 *  value is allowed, use Autocomplete instead. */
export const Combobox = BaseCombobox.Root
export const ComboboxValue = BaseCombobox.Value
export const ComboboxGroup = BaseCombobox.Group

export function ComboboxInput({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Input>) {
  return (
    <div className="relative">
      <BaseCombobox.Input
        className={cn(
          'flex h-control-md w-full rounded-md border border-border bg-surface px-3 pr-9',
          'text-base text-fg placeholder:text-fg-subtle',
          'focus-ring hover:border-border-strong',
          className,
        )}
        {...props}
      />
      <BaseCombobox.Trigger
        aria-label="Toggle options"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-fg-muted focus-ring hover:text-fg"
      >
        <ChevronsUpDown className="size-4" />
      </BaseCombobox.Trigger>
    </div>
  )
}

export function ComboboxContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Popup>) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner sideOffset={6}>
        <BaseCombobox.Popup className={cn(popupSurface, className)} {...props}>
          <BaseCombobox.Empty className="px-2.5 py-6 text-center text-base text-fg-muted">
            No results found.
          </BaseCombobox.Empty>
          <BaseCombobox.List>{children}</BaseCombobox.List>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  )
}

export function ComboboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Item>) {
  return (
    <BaseCombobox.Item className={cn(popupItem, 'pl-8', className)} {...props}>
      <BaseCombobox.ItemIndicator className="absolute left-2.5">
        <Check className="size-3.5" />
      </BaseCombobox.ItemIndicator>
      {children}
    </BaseCombobox.Item>
  )
}
