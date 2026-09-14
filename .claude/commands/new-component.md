---
description: Scaffold a new design-system component following the repo's recipe, then verify it.
argument-hint: <component-name> [what it should do]
---

Add a new component to the design system: **$ARGUMENTS**

Follow `src/design-system/ADDING-A-COMPONENT.md` and the `design-system` skill.
Work through these in order and do not skip the first step.

1. **Check it should exist.** Read `src/design-system/index.ts`. If the thing
   asked for is a composition of components that already exist, say so and stop
   — a one-off arrangement belongs in the route that uses it, not here.

2. **Check Base UI for a primitive.** Look in `node_modules/@base-ui/react/`.
   If one exists, build on it — it supplies focus management, keyboard
   navigation, positioning and ARIA wiring. Read its real type definitions
   before writing; the prop names are often not what you would guess.

3. **Copy the shape of a neighbour.** Pick the closest existing file in
   `src/design-system/ui/` and match it: `cva` for variants, `cn(..., className)`
   with `className` last, `...props` spread, motion imported from `./_motion`.
   Never write a literal duration, hex code, Tailwind palette class or
   arbitrary pixel value — `pnpm check:tokens` will reject all four.

4. **Require an accessible name if the component renders no text of its own**
   (the way `progress.tsx` and `slider.tsx` do, via `Labelled` in `./_a11y`).

5. **Export it** from `src/design-system/index.ts` and add a case to
   `src/routes/components.tsx` so the showcase stays complete.

6. **Write a test** next to it. Pick the closest archetype from the `testing`
   skill — a CVA component, a portalled Base UI wrapper, or a form field.

7. **Verify.** Run `pnpm check` and `pnpm e2e`. Both must pass before you
   report done. Then confirm it survives the brand: it must respond to
   `--brand-radius: 0`, `--brand-motion: 0` and `--brand-density: 1.3`. If it
   does not, something is hardcoded.

Report what you built, which Base UI primitive it sits on (or why none), and
the verification output.
