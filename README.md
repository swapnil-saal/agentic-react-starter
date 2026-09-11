# AI Space

A Vite + React 19 + TypeScript boilerplate wired for Claude-powered agentic
development.

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm doctor        # installs/verifies the agent toolchain
pnpm dev
```

Open http://localhost:5173.

## What's in it

**Application**

- Vite 8, React 19, TypeScript 6
- [Fragments UI](https://www.usefragments.com) — 70 accessible components on
  Base UI primitives, MIT licensed
- Tailwind CSS v4, bridged to Fragments' design tokens so utilities and
  components share one palette
- TanStack Router (file-based, fully typed) + TanStack Query
- React Hook Form + Zod, including boot-time environment validation
- Vitest + Testing Library + Playwright
- ESLint 10, Prettier, Husky, lint-staged

**Agent layer**

- [CodeGraph](https://colbymchenry.github.io/codegraph) — the repo is indexed
  as a queryable graph and exposed over MCP, so the agent traces callers and
  impact instead of grepping
- [Ponytail](https://github.com/DietrichGebert/ponytail) — a Claude Code plugin
  that biases toward writing minimal, necessary code
- Four project skills in `.claude/skills/`: Fragments usage, UI design
  standards, React patterns, and the routing workflow
- A generated catalogue of all 70 components with their real props, so the
  agent looks APIs up rather than guessing

Everything is free and works offline. No account, no paid tier, no API key.

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
| `pnpm gen:catalog`              | Regenerate the component catalogue    |

## Theming

All colour lives in exactly one file — **`src/styles/theme.css`**. The current
theme is _Deep Sea_: cool green-tinted neutrals with a teal accent. Change the
values there and every component and bridged Tailwind utility follows, in both
light and dark mode.

Each value is a CSS `light-dark(light, dark)` pair, so one declaration covers
light mode, dark mode, and "follow the OS" — no media queries, no duplication.

Never hardcode a colour or spacing value; use Fragments props
(`<Button tone="accent">`) or bridged utilities (`bg-accent`, `p-4`).

## `pnpm doctor`

`pnpm install` restores dependencies, but not the global CodeGraph binary, the
Claude plugin registry, the code index, or Playwright's browsers — so a fresh
clone has a working app and a hollow agent layer, silently. `pnpm doctor`
detects that and repairs what it safely can. It is idempotent, never writes
secrets, and only fails on genuinely required problems.

## Project structure

```
src/
  routes/            file-based routes; __root.tsx is the app shell
  routeTree.gen.ts   generated — never edit
  styles/index.css   Fragments + Tailwind token bridge
  styles/theme.css   the palette — all colour lives here
  lib/               validated env, query client
  components/
e2e/                 Playwright specs
scripts/             doctor + catalogue generator
.claude/skills/      project skills for the agent
CLAUDE.md            project guide the agent reads first
```

See [CLAUDE.md](./CLAUDE.md) for the conventions this project follows.
