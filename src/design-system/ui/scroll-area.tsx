import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area'
import * as React from 'react'

import { cn } from '../cn'
import { transitionOpacity } from './_motion'

/** Use for any pane that scrolls independently of the page, so the scrollbar
 *  matches the theme instead of the OS default. */
export function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseScrollArea.Root>) {
  return (
    <BaseScrollArea.Root className={cn('relative', className)} {...props}>
      <BaseScrollArea.Viewport className="size-full focus-ring">
        <BaseScrollArea.Content>{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar
        orientation="vertical"
        className={cn(
          'flex w-2 justify-center p-0.5 opacity-0',
          transitionOpacity,
          'data-[hovering]:opacity-100 data-[scrolling]:opacity-100',
        )}
      >
        <BaseScrollArea.Thumb className="w-full rounded-full bg-border-strong" />
      </BaseScrollArea.Scrollbar>
    </BaseScrollArea.Root>
  )
}
