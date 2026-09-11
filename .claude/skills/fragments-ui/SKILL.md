---
name: fragments-ui
description: How to build UI in this repo using the Fragments design system (@usefragments/ui). Use whenever adding, editing, or styling any component, screen, form, or layout — and before writing any JSX or CSS.
---

# Building UI with Fragments

This repo has exactly one component library: **`@usefragments/ui`** (70
components on Base UI primitives). There is no shadcn, no Radix, no MUI. Do not
add another component library, and do not hand-roll a component that already
exists.

## Before you write a component — look it up, do not guess

Fragments' prop names are specific and do **not** follow the conventions you
may expect. Guessing produces code that fails typecheck, or worse, silently
does nothing. Three real examples from this codebase:

| Guess                                    | Reality                                                                                                  |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `<Text size="lg">`                       | **`scale`**, not `size`                                                                                  |
| `<Text role="alert">`                    | `role` is a _typography_ role (`title-lg`, `caption`…), not ARIA. It is mutually exclusive with `scale`. |
| `<Input onChange={e => e.target.value}>` | `onChange` is **value-first**: `(value: string) => void`. The DOM event is omitted entirely.             |

So, in order:

1. **Read `components.md`** (next to this file) — the generated catalogue of
   all 70 components, their categories, and every prop with its type, default
   and allowed values.
2. For exact detail, read the contract:
   `node_modules/@usefragments/ui/src/components/<Name>/<Name>.contract.json`
3. If a component has no contract (Button, Card, DataTable, Dialog, Select,
   ThemeToggle), read its typings, which carry rich JSDoc:
   `node_modules/@usefragments/ui/dist/components/<Name>/index.d.ts`

Regenerate the catalogue after upgrading the package: `pnpm gen:catalog`.

## The token rule

**Never hardcode a colour, font size, radius, or spacing value.** No hex codes,
no `rgb()`, no magic pixel values.

Every visual value comes from one of two places, which resolve to the _same_
underlying tokens:

- **Component props** — `<Button tone="accent">`, `<Text color="secondary">`
- **Tailwind utilities** — `bg-accent`, `text-fg-muted`, `border-border`,
  `p-4`, `rounded-md`

`src/styles/index.css` bridges Tailwind's theme to Fragments' `--fui-*` custom
properties, so `bg-accent` and `tone="accent"` are guaranteed to be the same
colour, in light and dark mode alike.

All colour lives in **`src/styles/theme.css`** — one file, one `:root` block.
To retheme the app, change the values there. Never override a component's
colour at the call site.

Every value uses CSS `light-dark(light, dark)`. Fragments already sets
`color-scheme` for system, `[data-theme=dark]` and `[data-theme=light]`, so a
single declaration covers all three states. Keep the light value first.

**Fragments only ships one neutral ramp.** Its Sass seed API accepts exactly
one value for `$fui-neutral` ("paper", a warm cream/charcoal) and errors on
anything else. This project therefore themes by overriding the `--fui-*`
custom properties directly in `theme.css` rather than through Sass — that is
deliberate, and it is what makes a cool palette possible at all.

**Watch for tokens that carry hardcoded values.** `--fui-body-bg`,
`--fui-main-bg`, `--fui-app-main-bg`, `--fui-app-sidebar-bg` and
`--fui-code-bg` are not derived from `--fui-bg-*`; they hold literal colours
in the base stylesheet. Miss them and the page and sidebar stay warm while
everything else turns cool. They are all overridden in `theme.css` — if you
add a new surface and it looks out of place, check for a token like these.

**Status colours are retuned.** Setting `--fui-seed-danger` / `-success` /
`-warning` / `-info` is enough: the tinted backgrounds, text and border stops
are derived from those seeds with `color-mix`. Do not hand-set the derived
stops.

By default Fragments points `--fui-button-primary-base` at
`--fui-bg-inverse`, rendering the primary button as a flat black or white
block. To use an accent-filled primary button instead, override
`--fui-button-primary-base` once in `src/styles/theme.css`, not per component.
(This project already does exactly that, so the primary button carries the
teal accent rather than a flat inverse block.)

If you genuinely need a token that isn't bridged yet, add the mapping to the
`@theme inline` block in `src/styles/index.css` — do not inline a raw value.

## Composition

Use Fragments layout primitives rather than bare `div`s with Tailwind flexbox:

```tsx
<Stack direction="column" gap="lg">   // not <div className="flex flex-col gap-8">
<Grid columns={2} gap="md">           // not <div className="grid grid-cols-2">
```

Tailwind utilities are for the gaps Fragments doesn't cover — one-off padding,
positioning, widths. Reach for a Fragments prop first.

Many components are compound. Use the sub-components rather than inventing
props:

```tsx
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Supporting copy</Card.Description>
  </Card.Header>
  <Card.Body>…</Card.Body>
  <Card.Footer>…</Card.Footer>
</Card>
```

Same shape for `AppShell` (`.Header` `.Sidebar` `.Main` `.Aside`), `Sidebar`,
`Header`, `Alert`, `Field`, `EmptyState`.

## Forms

Fragments inputs are value-first, so React Hook Form's `register()` spread is
incompatible. **Always bind with `<Controller>`.** See
`src/routes/form-demo.tsx` for the canonical pattern — copy it rather than
reinventing it.

Use the built-in `error` and `helperText` props for validation state rather
than rendering your own error text beneath the field.

## Subpath imports need an optional peer

Most components import from the package root. These do not, and each needs a
peer dependency installed first (they are declared **optional**, so the project
installs clean without them):

| Import                         | Install first                                                    |
| ------------------------------ | ---------------------------------------------------------------- |
| `@usefragments/ui/chart`       | `recharts`                                                       |
| `@usefragments/ui/data-table`  | `@tanstack/react-table`, `@tanstack/react-virtual`               |
| `@usefragments/ui/editor`      | `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link` |
| `@usefragments/ui/datepicker`  | `react-day-picker`, `date-fns`                                   |
| `@usefragments/ui/colorpicker` | `react-colorful`                                                 |
| `@usefragments/ui/markdown`    | `react-markdown`, `remark-gfm`                                   |
| `@usefragments/ui/codeblock`   | `shiki`                                                          |

## AI interfaces

Fragments ships AI chat components natively — `Prompt`, `Message`,
`ConversationList`, `ThinkingIndicator`. Use these rather than adding an
AI-specific component library.

## Do not break the stylesheet

`src/styles/index.css` deliberately does **not** import Tailwind's Preflight,
and imports Fragments' prebuilt stylesheet. Both matter:

- Preflight is a global element reset that would strip Fragments' styling off
  every button, input and heading.
- Fragments' component CSS exists **only** in that prebuilt stylesheet; the JS
  modules export class-name maps and import no CSS of their own.

If components suddenly render unstyled, that import is why. The e2e test
`Fragments components are actually styled` guards this.
