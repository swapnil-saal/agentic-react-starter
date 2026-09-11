---
name: design-system
description: How to build and extend the UI in this repo — the brand file, the token layers, the motion vocabulary, and the rules every new component must follow. Use before writing or editing any JSX or CSS.
---

# The design system

This repo has **no third-party component library**. Every component is source
in `src/design-system/`, built on [Base UI](https://base-ui.com) headless
primitives. You own all of it — read it, change it, delete it.

## Decide what you are doing

| I want to…                                                  | Edit                                                               | Never touch     |
| ----------------------------------------------------------- | ------------------------------------------------------------------ | --------------- |
| Change colours, radius, fonts, density, motion              | `design-system/brand.css`                                          | anything else   |
| Adopt a ready-made look                                     | copy a file from `design-system/presets/` over brand.css's `:root` | —               |
| Change what a token _means_ (cards use a different surface) | `design-system/theme.css`                                          | `tokens.css`    |
| Add a new semantic token                                    | `theme.css`, then expose it in `styles/index.css`                  | components      |
| Add or edit a component                                     | `design-system/ui/<name>.tsx`                                      | the token files |
| Build a screen                                              | `src/routes/*`, importing from `@/design-system`                   | `ui/*` directly |

`tokens.css` is **derived output**. Putting a literal value there defeats the
whole system — if you need a new knob, add it to `brand.css` and consume it in
`tokens.css`.

## Layers

```
brand.css          layer 0: ~17 knobs. THE file a project edits.
tokens.css         layer 1: scales computed from the knobs
theme.css          layer 2: semantic meaning (--ds-surface, --ds-accent)
styles/index.css   layer 3: semantic tokens → Tailwind utilities
ui/*.tsx           components, which only ever use layer 3
```

Each layer references only the one above it. That discipline is what lets one
number reshape the whole app.

## The brand file

`brand.css` holds brand hue and chroma, neutral tint, status hues, radius,
border width, fonts, base text size, type ratio, heading weight and tracking,
density, shadow strength, motion speed and easing.

How far some of them reach is not obvious:

- **Colour** is generated in OKLCH from a hue plus a chroma — two numbers
  produce eleven perceptually even stops. Do not hand-pick hex ramps.
- **Density** scales control heights _and_ Tailwind's entire spacing scale,
  because `--spacing` is fed from it. `p-4` changes when density changes.
- **Motion `0`** makes every transition in the app instant.
  `prefers-reduced-motion` overrides any brand value — that is deliberate and
  must not be "fixed".
- **Border width** works because `styles/index.css` redefines Tailwind's border
  utilities from the token; Tailwind hardcodes `1px` and exposes no variable.

Try values live at `/brand`. It runs a WCAG contrast audit against the
resolved tokens and can export a complete `brand.css`. **If the audit shows a
failure, the brand is not shippable** — fix it there rather than overriding a
colour at a call site.

Two constraints the audit exists to catch:

- The accent used for solid fills must be dark enough for its foreground.
  `--ds-accent` deliberately uses `--accent-700` (OKLCH L 0.52), because white
  text on an L 0.60 fill measures 3.6–4.2:1 for every hue — below AA.
- A borderless brand (`--brand-border-width: 0`) leaves a field's fill as its
  only boundary, which cannot reach 3:1 while staying subtle. Set
  `--brand-field-border-width: 1px` to keep inputs bounded while everything
  else stays borderless.

## Adding a component

**Read `src/design-system/ADDING-A-COMPONENT.md`** — the full recipe, with a
template, the Base UI primitive list, and the motion table. Short version:

1. Check `ui/` first — most new things are a composition of what exists.
2. Check Base UI for a primitive, and read its real API before writing.
3. Copy the shape of a neighbouring component: `cva` for variants,
   `cn(..., className)` with `className` last, `...props` spread.
4. Import motion from `./_motion`. Never write a literal duration.
5. Export from `index.ts`, add it to `routes/components.tsx`.
6. `pnpm check`.

## The rules, and why

Every rule below exists because breaking it produces a component that looks
correct today and silently stops responding when the brand changes.

- **No hex codes, no `rgb()`, no Tailwind palette classes** (`bg-slate-800`,
  `text-red-500`). Use semantic utilities: `bg-surface`, `bg-bg-subtle`,
  `text-fg`, `text-fg-muted`, `text-fg-subtle`, `border-border`,
  `border-border-strong`, `bg-accent`, `text-on-accent`, and the status sets
  (`bg-danger-subtle`, `text-danger-fg`, `border-danger-border`, …).
- **No arbitrary pixel values** (`p-[13px]`, `text-[15px]`). Use the scale, or
  density and the type ratio stop reaching your component.
- **No literal durations** (`duration-150`). Import from `ui/_motion`.
- **Interactive controls use `h-control-sm|md|lg`** so they align on a row.
- **Use `focus-ring`**, and never remove a focus outline without replacing it
  with something at least as visible.
- **Tailwind v4 variables use parentheses:** `duration-(--duration-fast)`, not
  `duration-[--duration-fast]`. The bracket form is v3 syntax; in v4 it emits
  invalid CSS that the browser drops, so the style silently does nothing.

These are enforced mechanically by `pnpm check:tokens`, which runs as part of
`pnpm check`. If it flags your code, reach for a token — do not add an
exception.

## Motion

All movement composes from `ui/_motion.ts`, so it stays consistent and so the
brand's motion knobs actually reach everything.

| Need                                 | Use                                 |
| ------------------------------------ | ----------------------------------- |
| hover/focus colour change            | `transitionColors`                  |
| a thumb, chevron or indicator moving | `transitionTransform`               |
| multi-property change                | `transitionAll`                     |
| fade only                            | `transitionOpacity`                 |
| press feedback                       | `pressable`                         |
| floating surface appearing           | `popSurface`                        |
| modal appearing                      | `modalSurface`                      |
| backdrop                             | `scrim`                             |
| tick or dot popping in               | `indicator`                         |
| expanding panel                      | `collapsePanel('--x-panel-height')` |

Base UI drives enter/exit with `data-starting-style` and `data-ending-style`;
the surface helpers already handle both, which is what lets an exit animation
finish before the element unmounts.

## Base UI specifics

- **Triggers use `render`, not `asChild`:**
  `<DialogTrigger render={<Button>Open</Button>} />`
- **State arrives as data attributes:** `data-[checked]`, `data-[highlighted]`,
  `data-[disabled]`, `data-[panel-open]`, `data-[starting-style]`,
  `data-[ending-style]`.
- To style a child from a parent's state, put `group` on the parent and use
  `group-data-[…]` on the child. Forgetting `group` fails silently.
- Base UI's Checkbox, Switch and Radio render **buttons, not inputs**, so
  wrapping them in a bare `<label>` associates nothing. Use `<Field>` +
  `<FieldLabel>`, which wires `id` and `aria-describedby` for you.

## Forms

`Input` and `Textarea` keep the **native, event-first `onChange`**. That is
deliberate: a value-first callback breaks `register()` from React Hook Form and
every other uncontrolled form library. Do not change it.

```tsx
<Input {...register('email')} aria-invalid={Boolean(errors.email)} />
```

See `src/routes/form-demo.tsx` for the full pattern.

## The app's name

Comes from the `name` field in `package.json`, injected at build time (see
`vite.config.ts`) and read via `APP_NAME` from `@/lib/app`. Rename the package
and the sidebar, header and browser title all follow. Never hardcode it.

## Verify

```bash
pnpm check    # types, lint, design tokens, unit tests
pnpm e2e      # anything visual
```

Then check your work against the brand: open `/brand`, set radius to 0, motion
to 0 and density to 1.3. Everything you built should follow all three. If it
does not, something is hardcoded.
