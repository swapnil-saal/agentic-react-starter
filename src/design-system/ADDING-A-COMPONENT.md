# Adding a component

The recipe. Follow it and the new component behaves like every other one —
it retheres with `brand.css`, respects motion settings, and passes `pnpm check`.

## 0. Does it need to exist?

Check `ui/` first. Most "new" components are a composition of existing ones
with different props. A one-off arrangement belongs in the route that uses it,
not in the design system.

## 1. Check Base UI for a primitive

`node_modules/@base-ui/react/` — if a primitive exists, build on it. It gives
you focus management, keyboard navigation, positioning and ARIA wiring, which
is the part that is genuinely hard to get right.

Available: accordion · alert-dialog · autocomplete · avatar · checkbox ·
checkbox-group · collapsible · combobox · context-menu · dialog · drawer ·
field · fieldset · form · input · menu · menubar · meter · navigation-menu ·
number-field · otp-field · popover · preview-card · progress · radio-group ·
scroll-area · select · separator · slider · switch · tabs · toast · toggle ·
toggle-group · toolbar · tooltip

Not available, build yourself or add a dependency: date picker, colour picker,
rich text, charts, data tables.

**Read the real API before writing** — parts are namespaced (`Select.Root`,
`Select.Trigger`) and prop names are not always what you would guess. The
toggle group's multi-select prop is `multiple`, not `toggleMultiple`.

## 2. Write the file

`src/design-system/ui/<name>.tsx`, following this shape:

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../cn'
import { transitionColors } from './_motion'

const thingVariants = cva(
  // Base — everything shared by all variants.
  ['inline-flex items-center rounded-md focus-ring', transitionColors],
  {
    variants: {
      tone: {
        neutral: 'bg-surface text-fg',
        accent: 'bg-accent text-on-accent hover:bg-accent-hover',
      },
      size: { sm: 'h-control-sm px-3 text-sm', md: 'h-control-md px-4' },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
)

export interface ThingProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof thingVariants> {}

export function Thing({ className, tone, size, ...props }: ThingProps) {
  return (
    <div className={cn(thingVariants({ tone, size }), className)} {...props} />
  )
}
```

## 3. The rules

Each of these exists because breaking it produces a component that looks fine
today and stops responding when someone edits `brand.css`.

**Colour** — only semantic utilities: `bg-surface`, `bg-bg-subtle`,
`text-fg`, `text-fg-muted`, `text-fg-subtle`, `border-border`,
`border-border-strong`, `bg-accent`, `text-on-accent`, and the status sets
(`bg-danger-subtle`, `text-danger-fg`, `border-danger-border`, …).

Never a hex code, never `rgb()`, never a Tailwind palette class like
`bg-slate-800`.

**Size** — `h-control-sm|md|lg` for anything interactive, so it lines up with
buttons and inputs on a row. Spacing from the scale (`p-4`, `gap-2`), never
`p-[13px]`. Type from `text-xs…text-3xl`, never `text-[15px]`.

**Radius** — `rounded-sm|md|lg|xl`. These derive from `--brand-radius`, so a
sharp brand flattens your component automatically.

**Motion** — import from `./_motion`. Never write `transition-colors
duration-150` by hand: a literal duration ignores `--brand-motion`, so your
component keeps animating in a brand that asked for no animation.

| Need                                 | Use                                 |
| ------------------------------------ | ----------------------------------- |
| hover/focus colour change            | `transitionColors`                  |
| a thumb, chevron or indicator moving | `transitionTransform`               |
| press feedback                       | `pressable`                         |
| a floating surface appearing         | `popSurface`                        |
| a modal appearing                    | `modalSurface`                      |
| a backdrop                           | `scrim`                             |
| a tick or dot popping in             | `indicator`                         |
| an expanding panel                   | `collapsePanel('--x-panel-height')` |

**Focus** — use the `focus-ring` utility. Never remove a focus outline without
replacing it with something at least as visible.

**Composition** — `className` goes last in `cn()` so callers can override
defaults; spread `...props` so native attributes, `aria-*` and `ref` work;
prefer variants (`tone="danger"`) over booleans (`isDanger`).

**Accessibility** — Base UI handles ARIA inside its primitives, but you still
own the outside: icon-only controls need `aria-label`, and anything conveying
state needs more than colour (see the `dot` prop on Badge, or the icons in
Alert).

## 4. Export and show it

1. Add to `src/design-system/index.ts`.
2. Add a case to `src/routes/components.tsx` so the showcase stays complete —
   that page is how a visual regression becomes visible.

## 5. Verify

```bash
pnpm check    # types, lint, design tokens, unit tests
pnpm e2e      # for anything visual
```

`pnpm check:tokens` is the mechanical version of the rules above. If it flags
your component, the fix is always to reach for a token — never to add an
exception.

Then sanity-check it against the brand: open `/brand`, set radius to 0, motion
to 0 and density to 1.3. Your component should follow all three. If it does
not, something is hardcoded.
