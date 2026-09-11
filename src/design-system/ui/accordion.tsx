import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '../cn'

export const Accordion = BaseAccordion.Root

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Item>) {
  return (
    <BaseAccordion.Item
      className={cn('border-b border-border', className)}
      {...props}
    />
  )
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Header>
      <BaseAccordion.Trigger
        className={cn(
          // `group` so the chevron below can react to this trigger's
          // data-panel-open state.
          'group flex w-full items-center justify-between gap-4 py-4',
          'text-base font-medium text-fg focus-ring hover:text-accent',
          'transition-colors duration-(--duration-fast)',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-fg-muted',
            'transition-transform duration-(--duration-base) ease-(--ease-out)',
            'group-data-[panel-open]:rotate-180',
          )}
        />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  )
}

export function AccordionPanel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Panel>) {
  return (
    <BaseAccordion.Panel
      className={cn(
        'overflow-hidden text-base text-fg-muted',
        'h-[var(--accordion-panel-height)] transition-[height] duration-(--duration-base) ease-(--ease-out)',
        'data-[starting-style]:h-0 data-[ending-style]:h-0',
        className,
      )}
      {...props}
    >
      <div className="pb-4">{children}</div>
    </BaseAccordion.Panel>
  )
}
