import { Drawer as BaseDrawer } from '@base-ui/react/drawer'
import * as React from 'react'

import { cn } from '../cn'

export const Drawer = BaseDrawer.Root
export const DrawerTrigger = BaseDrawer.Trigger
export const DrawerClose = BaseDrawer.Close

export function DrawerContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof BaseDrawer.Popup> & {
  side?: 'left' | 'right' | 'bottom'
}) {
  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop
        className={cn(
          'fixed inset-0 z-50 bg-overlay transition-opacity duration-(--duration-base)',
          'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
        )}
      />
      <BaseDrawer.Popup
        className={cn(
          'fixed z-50 border-border bg-surface shadow-lg',
          'transition-transform duration-(--duration-base) ease-(--ease-out)',
          side === 'right' &&
            'inset-y-0 right-0 w-80 max-w-[90vw] border-l data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full',
          side === 'left' &&
            'inset-y-0 left-0 w-80 max-w-[90vw] border-r data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full',
          side === 'bottom' &&
            'inset-x-0 bottom-0 max-h-[85vh] rounded-t-xl border-t data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full',
          className,
        )}
        {...props}
      >
        {children}
      </BaseDrawer.Popup>
    </BaseDrawer.Portal>
  )
}

export function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseDrawer.Title>) {
  return (
    <BaseDrawer.Title
      className={cn('text-lg font-semibold text-fg', className)}
      {...props}
    />
  )
}
