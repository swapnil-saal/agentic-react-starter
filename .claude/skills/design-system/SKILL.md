---
name: design-system
description: How to build and extend the UI in this repo — the owned component library on Base UI, the three-layer token system, and how to add or restyle a component. Use before writing any JSX or CSS.
---

# The design system

This repo has **no third-party component library**. Every component is source
in `src/design-system/`, built on [Base UI](https://base-ui.com) headless
primitives. You own all of it — read it, change it, delete it.

That is the whole point: a component library you consume can only be pushed on
from the outside. This one is meant to be edited.

## Where things live

```
src/design-system/
  tokens.css      layer 1 — primitive scales (neutral-500, space-4, radius-lg)
  theme.css       layer 2 — semantic meaning (--ds-bg, --ds-accent, --ds-fg)
  cn.ts           class merger
  theme-provider.tsx
  ui/*.tsx        the components
  index.ts        public surface — import from '@/design-system'
src/styles/index.css
                  layer 3 — exposes semantic tokens as Tailwind utilities
```

Always import from the barrel, never from `ui/*` directly:

```tsx
import { Button, Card, Stack } from '@/design-system'
```

## The three token layers

Each layer may only reference the one above it. Keeping that discipline is what
lets you retheme without touching a single component.

1. **Primitives** (`tokens.css`) — raw values, no meaning. `--neutral-800` is a
   colour, not a purpose. Nothing outside `theme.css` may reference these.
2. **Semantics** (`theme.css`) — what a colour is _for_. `--ds-surface`,
   `--ds-fg-muted`, `--ds-danger-subtle`. This is the layer you retheme.
3. **Utilities** (`styles/index.css`) — the `@theme inline` block turns the
   semantic tokens into Tailwind classes: `bg-surface`, `text-fg-muted`,
   `border-border`.

So `bg-accent` on a `<div>` and `<Button>`'s solid variant resolve to the _same_
variable. They cannot drift.

**Never hardcode a colour, size, radius or shadow.** No hex codes, no
`rgb()`, no magic pixel values, and no raw Tailwind palette classes like
`bg-slate-800` or `text-red-500` — those bypass the token system entirely and
will not respond to a retheme.

### Retheming

Change the semantic values in `theme.css`. To change the palette itself, edit
the scales in `tokens.css`. Neither requires touching a component.

Every value is a CSS `light-dark(light, dark)` pair, and `color-scheme` is set
for all three states, so one declaration covers light mode, dark mode and
"follow the OS". Keep the light value first. Do not add
`@media (prefers-color-scheme)` blocks — that is what `light-dark()` is for.

## Adding a component

1. **Check Base UI first.** It ships the behaviourally hard parts — focus
   management, keyboard nav, positioning, ARIA wiring. If it has a primitive,
   build on it rather than reimplementing. Available: accordion, alert-dialog,
   autocomplete, avatar, checkbox, collapsible, combobox, context-menu, dialog,
   drawer, field, fieldset, form, input, menu, menubar, meter, navigation-menu,
   number-field, otp-field, popover, preview-card, progress, radio-group,
   scroll-area, select, separator, slider, switch, tabs, toast, toggle,
   toggle-group, toolbar, tooltip.
   **Not** in Base UI: date picker, colour picker, rich text, charts, tables.
2. **Read the real API** before writing — `node_modules/@base-ui/react/<name>/`.
   Parts are namespaced (`Select.Root`, `Select.Trigger`). Do not guess prop
   names; several differ from what you would expect (the toggle group's
   multi-select prop is `multiple`, not `toggleMultiple`).
3. Create `src/design-system/ui/<name>.tsx`, copying the shape of a neighbour.
4. Export it from `src/design-system/index.ts`.
5. Add it to the showcase in `src/routes/components.tsx`.

### The component pattern

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../cn'

const thingVariants = cva(
  // base: everything shared by all variants
  ['inline-flex items-center rounded-md focus-ring', 'disabled:opacity-50'],
  {
    variants: {
      tone: {
        neutral: 'bg-surface text-fg',
        accent: 'bg-accent text-on-accent',
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

Rules this encodes, all of which matter:

- **`className` goes last in `cn()`.** That is what lets a caller override a
  default — `cn` uses `tailwind-merge`, so later utilities beat earlier ones.
  Plain string concatenation would leave both classes and let source order
  decide.
- **Spread `...props`** so every native attribute, `aria-*`, and `ref` works.
- **Variants over booleans.** `tone="danger"` scales; `isDanger` does not.
- Use the shared `focus-ring` utility rather than inventing a focus style.
- Interactive controls use the `h-control-*` heights so a button, input and
  select line up on a row without fudging.
- Floating surfaces (menu, select, combobox, autocomplete) share
  `ui/_popup.ts`. Use it — duplicating those classes is how they drift apart.

## Base UI specifics

- **Triggers use `render`, not `asChild`:**
  `<DialogTrigger render={<Button>Open</Button>} />`
- **State is exposed as data attributes**, styled with Tailwind variants:
  `data-[checked]`, `data-[highlighted]`, `data-[disabled]`,
  `data-[panel-open]`, `data-[starting-style]`, `data-[ending-style]`.
  The last two drive enter/exit transitions.
- To style a child based on a parent's state, put `group` on the parent and use
  `group-data-[…]` on the child. Forgetting `group` fails silently.

## Forms

Our `Input` and `Textarea` keep the **native, event-first `onChange`**. That is
deliberate: a value-first callback breaks `register()` from React Hook Form and
every other uncontrolled form library. Do not change it.

```tsx
<Input {...register('email')} aria-invalid={Boolean(errors.email)} />
```

Wrap fields in `<Field>` / `<FieldLabel>` — Base UI wires up `id` and
`aria-describedby`, which is easy to get subtly wrong by hand and which screen
readers depend on. See `src/routes/form-demo.tsx` for the full pattern.

## Verify

`pnpm check` for types, lint and unit tests. `pnpm e2e` for anything visual —
it includes a test asserting that a Tailwind utility and a component variant
resolve to the identical colour, which is the guard on the token bridge.
