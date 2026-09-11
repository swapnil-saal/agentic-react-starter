---
name: ui-design
description: Visual and interaction design standards for this app — hierarchy, spacing, colour, states, accessibility, and motion. Use when designing or reviewing any screen, layout, or component's appearance.
---

# UI design standards

Craft judgement for this app. `fragments-ui` covers _which_ component and
_which_ token; this covers whether the result is actually good.

## Hierarchy first

Every screen must answer, at a glance: what is this, what matters most, what
can I do here. Establish that with size, weight and spacing — in that order —
before reaching for colour.

- One `h1` per screen. Don't skip heading levels.
- One primary action per view: exactly one `<Button variant="solid">`.
  Everything else is `soft`, `outline` or `ghost`. Two competing primaries
  means neither reads as primary.
- Group related things with proximity, not with borders. Reach for whitespace
  before a divider, and a divider before a box.

## Spacing

Use the scale, never arbitrary values. Spacing carries meaning: elements that
belong together sit closer than elements that don't.

- Within a component: `gap="xs"` / `gap="sm"`
- Between related blocks: `gap="md"`
- Between sections: `gap="lg"`
- Be consistent — the same relationship gets the same gap everywhere.
- Vertical rhythm beats horizontal cleverness; prefer a single column that
  reads top-to-bottom over a dense grid.

## Colour

- Colour is the _last_ tool for hierarchy, never the first, and never the only
  one — around 1 in 12 men has some colour-vision deficiency.
- Reserve the accent for interactive things and the single primary action. An
  accent used decoratively stops signalling anything.
- Semantic tones mean what they say: `danger` for destructive and errors,
  `warning` for reversible risk, `success` for confirmation, `info` for
  neutral context. Never pick a tone because you liked the colour.
- Body text uses `color="secondary"`; reserve `primary` for headings and
  emphasis. Never use `tertiary`/`muted` for anything the user must read.

## Contrast and accessibility

Non-negotiable, and cheap to get right:

- Body text ≥ 4.5:1 contrast; large text and UI boundaries ≥ 3:1.
- Every interactive element is reachable and operable by keyboard, in a
  sensible tab order, with a **visible** focus ring. Never remove the focus
  outline without replacing it with something clearer.
- Icon-only controls always carry an `aria-label`.
- Never encode meaning in colour alone — pair it with an icon, a label, or
  text.
- Respect `prefers-reduced-motion`.
- Touch targets ≥ 44×44px.

Lint catches a slice of this via `jsx-a11y`. Passing lint is the floor, not
the goal.

## Design every state

An interface is not finished when the happy path renders. For each view, handle:

1. **Empty** — first run, or a filter matching nothing. Say what this is and
   give the action that fills it. Use `EmptyState`. Never show a bare blank.
2. **Loading** — `Skeleton` matching the real content's shape for initial
   loads; a spinner only for short indeterminate waits. Never collapse layout
   height while loading; it causes content to jump.
3. **Error** — say what failed, in plain language, and offer the next step.
   Never surface a raw exception or a bare "Something went wrong".
4. **Partial** — some data present, some missing.
5. **Success** — confirm that an action worked; don't leave the user guessing.
6. **Disabled** — explain _why_ via tooltip or helper text. A disabled control
   with no explanation is a dead end.

## Motion

- Fast and subtle: 150–200ms for most transitions, ease-out.
- Animate `transform` and `opacity`. Avoid animating layout properties.
- Motion should explain a change (where something came from, what became what),
  never decorate. If it doesn't aid comprehension, cut it.

## Responsive

- Design the narrow layout first; it forces real prioritisation.
- Let content reflow and stack rather than shrinking text.
- No horizontal page scroll at any width. Wide tables and diagrams get their
  own scroll container.

## Avoid these tells

Patterns that make an interface look machine-generated:

- Emoji as UI icons — use the `Icon` component (Phosphor).
- Gratuitous gradients, heavy drop shadows, and glow effects.
- Every card carrying an icon, a badge, and a chevron whether or not they mean
  anything.
- Filler copy like "Welcome to your dashboard!" or "Manage your items here" —
  say something specific or say nothing.
- Uniform `gap` everywhere, which flattens hierarchy into a grey mush.
- Centre-aligned body text, or paragraphs wider than ~75 characters.
- Decorative icons next to every heading.

## Self-review before you finish

- Does the screen read correctly in **both** light and dark mode?
- Can I complete the main task using only the keyboard?
- Is the primary action unmistakable?
- What does this look like with no data, with one item, and with 500 items?
- What does it look like at 375px wide?
- Did I introduce a raw colour or pixel value? (If so, tokenise it.)
