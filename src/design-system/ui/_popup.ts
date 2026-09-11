/**
 * Shared chrome for every floating list surface — menu, select, combobox,
 * autocomplete, context menu.
 *
 * Kept in one place deliberately: these surfaces must look identical, and
 * duplicating the classes is how they silently drift apart.
 */
export const popupSurface = [
  'z-50 min-w-[var(--anchor-width)] overflow-hidden rounded-lg',
  'border border-border bg-raised p-1 shadow-lg',
  'transition-all duration-(--duration-fast) ease-(--ease-out)',
  'data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
  'data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
]

export const popupItem = [
  'relative flex cursor-default select-none items-center gap-2',
  'rounded-md px-2.5 py-1.5 text-base text-fg outline-none',
  'data-[highlighted]:bg-surface-hover',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
]
