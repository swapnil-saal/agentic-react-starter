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
- ~30 owned components on Base UI primitives, styled with Tailwind v4 + CVA
- A three-layer token system: primitives → semantics → utilities
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

## Theming

Three layers, each referencing only the one above it:

| Layer          | File                           | Holds                                     |
| -------------- | ------------------------------ | ----------------------------------------- |
| 1 — primitives | `src/design-system/tokens.css` | raw scales: `--neutral-800`, `--space-4`  |
| 2 — semantics  | `src/design-system/theme.css`  | meaning: `--ds-surface`, `--ds-accent`    |
| 3 — utilities  | `src/styles/index.css`         | Tailwind classes: `bg-surface`, `text-fg` |

**All colour lives in layer 2.** Change it and every component and utility
follows, in light and dark, without touching a component. To change the palette
itself, edit the scales in layer 1.

Each value is a CSS `light-dark(light, dark)` pair, so one declaration covers
light mode, dark mode and "follow the OS" — no media queries, no duplication.

Never hardcode a colour or spacing value, and avoid raw Tailwind palette
classes like `bg-slate-800` — they bypass the tokens and won't retheme.

## Adding a component

Check Base UI for a primitive first, then follow the pattern in any existing
`src/design-system/ui/*.tsx`. The `design-system` skill documents the whole
recipe, including the Base UI specifics that are easy to get wrong.

Not covered by Base UI, if you need them: date picker, colour picker, rich
text editor, charts, data tables.

## Commands

| Command                         | Does                                  |
| ------------------------------- | ------------------------------------- |
| `pnpm dev`                      | Dev server                            |
| `pnpm build`                    | Typecheck + production build          |
| `pnpm check`                    | Typecheck + lint + unit tests         |
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
  routeTree.gen.ts   generated — never edit
  styles/index.css   semantic tokens → Tailwind utilities
  lib/               validated env, query client
e2e/                 Playwright specs
scripts/             doctor
.claude/skills/      project skills for the agent
CLAUDE.md            project guide the agent reads first
```

See [CLAUDE.md](./CLAUDE.md) for the conventions this project follows.
