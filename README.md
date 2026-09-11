# AI Space

A Vite + React 19 + TypeScript starter with a design system you **own**, wired
for Claude-powered agentic development.

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm doctor        # installs/verifies the agent toolchain
pnpm dev
```

Open http://localhost:5173.

## The idea

Most starters hand you someone else's component library. You can restyle it
from the outside, but you cannot change how it works — and when your design
diverges from its opinions, you end up fighting it.

Here, **every component is source in this repo**. They are built on
[Base UI](https://base-ui.com) headless primitives, which supply the genuinely
hard parts — focus management, keyboard navigation, positioning, ARIA wiring —
while styling and API are yours. Point an agent at `src/design-system/` and ask
it to build your design system on top; there is nothing to fight.

## What's in it

**Application**

- Vite 8, React 19, TypeScript 6
- ~37 owned components on Base UI primitives, styled with Tailwind v4 + CVA
- A shared motion vocabulary, so one knob can slow or disable every animation
- A brand layer: ~17 knobs in one file restyle the entire app
- Light, dark and follow-the-OS themes from a single set of declarations
- TanStack Router (file-based, fully typed) + TanStack Query
- React Hook Form + Zod, including boot-time environment validation
- Vitest + Testing Library + Playwright
- ESLint 10, Prettier, Husky, lint-staged

**Agent layer**

- [CodeGraph](https://colbymchenry.github.io/codegraph) — the repo indexed as a
  queryable graph over MCP, so the agent traces callers and impact rather than
  grepping
- [Ponytail](https://github.com/DietrichGebert/ponytail) — a Claude Code plugin
  that biases toward writing minimal, necessary code
- Four project skills in `.claude/skills/`: the design system, UI design
  standards, React patterns, and the routing workflow

Everything is free and works offline. No account, no paid tier, no API key.

## One file defines the look

`src/design-system/brand.css` is the only file a new project needs to edit.
Around 17 knobs drive the entire UI:

```css
--brand-hue: 175; /* colour ramps generated in OKLCH */
--brand-chroma: 0.13; /* 0 grey · 0.13 vivid · 0.25 neon  */
--brand-radius: 0.5rem; /* 0 sharp → 1.5rem pillowy         */
--brand-border-width: 1px;
--brand-font: …;
--brand-type-ratio: 1.2; /* modular scale for every heading  */
--brand-density: 1; /* control heights AND all spacing  */
--brand-shadow-strength: 1; /* 0 flat → 2 floating              */
--brand-motion: 1; /* 0 disables every transition      */
--brand-ease: cubic-bezier(0.16, 1, 0.3, 1);
```

Change one number and the whole app follows — in light and dark together.
Same components, a different product.

**Presets.** `src/design-system/presets/` ships five complete looks —
`deep-sea`, `brutalist`, `soft`, `technical`, `mono`. Copy one over the
`:root` block in `brand.css` to adopt it.

**Playground.** Run `pnpm dev` and open **`/brand`** to drag the knobs against
the real component library, then copy the result out as CSS.

**Enforced, not just documented.** `pnpm check:tokens` fails the build on hex
codes, Tailwind palette classes, arbitrary pixel values, literal durations and
Tailwind v3 variable syntax — the five ways components quietly stop responding
to the brand. It runs as part of `pnpm check`.

### How it layers

| Layer          | File                       | Holds                                     |
| -------------- | -------------------------- | ----------------------------------------- |
| 0 — brand      | `design-system/brand.css`  | the knobs you edit                        |
| 1 — primitives | `design-system/tokens.css` | scales _derived_ from the knobs           |
| 2 — semantics  | `design-system/theme.css`  | meaning: `--ds-surface`, `--ds-accent`    |
| 3 — utilities  | `styles/index.css`         | Tailwind classes: `bg-surface`, `text-fg` |

Each layer references only the one above. Semantic values are CSS
`light-dark(light, dark)` pairs, so one declaration covers light mode, dark
mode and "follow the OS" — no media queries, no duplication.

Never hardcode a colour or spacing value, and avoid raw Tailwind palette
classes like `bg-slate-800` — they bypass the tokens and won't retheme.

## Adding a component

Follow **`src/design-system/ADDING-A-COMPONENT.md`** — the full recipe, with a
template, the Base UI primitive list, the motion table and the rules. A new
component written to it retheres with `brand.css` and respects motion settings
automatically.

Not covered by Base UI, if you need them: date picker, colour picker, rich
text editor, charts, data tables.

## Commands

| Command                         | Does                                  |
| ------------------------------- | ------------------------------------- |
| `pnpm dev`                      | Dev server                            |
| `pnpm build`                    | Typecheck + production build          |
| `pnpm check`                    | Typecheck + lint + tokens + tests     |
| `pnpm check:tokens`             | Design-system rule enforcement        |
| `pnpm test`                     | Vitest in watch mode                  |
| `pnpm e2e`                      | Playwright against a production build |
| `pnpm lint:fix` / `pnpm format` | Autofix / format                      |
| `pnpm doctor`                   | Verify and repair the agent toolchain |
| `pnpm doctor:check`             | Report only — for CI                  |

## `pnpm doctor`

`pnpm install` restores dependencies, but not the global CodeGraph binary, the
Claude plugin registry, the code index, or Playwright's browsers — so a fresh
clone has a working app and a hollow agent layer, silently. `pnpm doctor`
detects that and repairs what it safely can. It is idempotent, never writes
secrets, and only fails on genuinely required problems.

## Project structure

```
src/
  design-system/     the UI library — you own every line
  routes/            file-based routes; __root.tsx is the app shell
                     /brand is a live playground for the knobs
  routeTree.gen.ts   generated — never edit
  styles/index.css   semantic tokens → Tailwind utilities
  lib/               validated env, query client
e2e/                 Playwright specs
scripts/             doctor
.claude/skills/      project skills for the agent
CLAUDE.md            project guide the agent reads first
```

See [CLAUDE.md](./CLAUDE.md) for the conventions this project follows.
