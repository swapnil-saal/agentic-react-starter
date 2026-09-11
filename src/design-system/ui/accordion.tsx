import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '../cn'
import { collapsePanel, transitionColors, transitionTransform } from './_motion'

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
          transitionColors,
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-fg-muted',
            transitionTransform,
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
        'text-base text-fg-muted',
        collapsePanel('--accordion-panel-height'),
        className,
      )}
      {...props}
    >
      <div className="pb-4">{children}</div>
    </BaseAccordion.Panel>
  )
}
