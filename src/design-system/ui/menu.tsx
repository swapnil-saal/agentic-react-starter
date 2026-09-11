import { Menu as BaseMenu } from '@base-ui/react/menu'
import { Check } from 'lucide-react'
import * as React from 'react'

import { cn } from '../cn'
import { popupItem, popupSurface } from './_popup'

export const Menu = BaseMenu.Root
export const MenuTrigger = BaseMenu.Trigger
export const MenuGroup = BaseMenu.Group

export function MenuContent({
  className,
  children,
  sideOffset = 6,
  align = 'start',
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup> & {
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
}) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner sideOffset={sideOffset} align={align}>
        <BaseMenu.Popup className={cn(popupSurface, className)} {...props}>
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

export function MenuItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Item>) {
  return <BaseMenu.Item className={cn(popupItem, className)} {...props} />
}

export function MenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.CheckboxItem>) {
  return (
    <BaseMenu.CheckboxItem
      className={cn(popupItem, 'pl-8', className)}
      {...props}
    >
      <BaseMenu.CheckboxItemIndicator className="absolute left-2.5">
        <Check className="size-3.5" />
      </BaseMenu.CheckboxItemIndicator>
      {children}
    </BaseMenu.CheckboxItem>
  )
}

export function MenuGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.GroupLabel>) {
  return (
    <BaseMenu.GroupLabel
      className={cn(
        'px-2.5 py-1.5 text-xs font-medium text-fg-subtle',
        className,
      )}
      {...props}
    />
  )
}

export function MenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
  )
}
