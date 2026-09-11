# AI Space — project guide

Vite + React 19 + TypeScript front-end with a design system you **own**, set up
so an agent can navigate the repo structurally, extend the UI safely, and verify
its own work.

## Verify with one command

```bash
pnpm check     # typecheck + lint + unit tests — run before calling work done
```

For anything visual, also `pnpm e2e`. If the environment itself looks broken
(missing CLI, stale index), run `pnpm doctor`.

## Stack

| Area         | Choice                                                                  |
| ------------ | ----------------------------------------------------------------------- |
| Build        | Vite 8 · TypeScript 6 · React 19                                        |
| UI           | **Owned components** in `src/design-system/`, on Base UI primitives     |
| Styling      | Three-layer tokens → Tailwind v4 utilities · CVA for variants           |
| Icons        | `lucide-react`                                                          |
| Routing      | TanStack Router — file-based, fully typed                               |
| Server state | TanStack Query                                                          |
| Forms        | React Hook Form + Zod                                                   |
| Tests        | Vitest + Testing Library · Playwright                                   |
| Quality      | ESLint 10 (typescript-eslint, react-hooks, jsx-a11y) · Prettier · Husky |

There is **no third-party component library**. Do not add shadcn, MUI,
Chakra, or similar. If a component is missing, build it on a Base UI primitive
following the `design-system` skill.

## Layout

```
src/
  design-system/   the UI library — you own every line
    tokens.css       layer 1: primitive scales
    theme.css        layer 2: semantic tokens (ALL colour lives here)
    ui/*.tsx         components
    index.ts         import from '@/design-system'
  routes/          file-based routes; __root.tsx is the app shell
  routeTree.gen.ts GENERATED — never edit
  styles/index.css layer 3: semantic tokens → Tailwind utilities
  lib/             env.ts (validated), query-client.ts
e2e/               Playwright specs
scripts/           doctor.mjs
.claude/skills/    project skills (see below)
```

## Skills — read these before working

| Skill            | Use when                                               |
| ---------------- | ------------------------------------------------------ |
| `design-system`  | Any UI work. Tokens, component pattern, Base UI usage. |
| `ui-design`      | Designing or reviewing how a screen looks and behaves. |
| `react-patterns` | Writing any component, hook, or test.                  |
| `add-route`      | Adding a page or wiring navigation.                    |

## Hard rules

1. **No hardcoded design values.** No hex codes, no magic pixels, and no raw
   Tailwind palette classes (`bg-slate-800`, `text-red-500`) — they bypass the
   token system and will not respond to a retheme. Use semantic utilities
   (`bg-surface`, `text-fg-muted`) or component variants.
2. **All colour lives in `src/design-system/theme.css`.** Retheme there; never
   at a call site.
3. **Never edit `src/routeTree.gen.ts`.**
4. **Keep `Input`/`Textarea` event-first.** Their native `onChange` is what
   makes `register()` from React Hook Form work. A value-first callback would
   break every uncontrolled form library.
5. **Import UI from `@/design-system`**, not from `ui/*` directly.
6. **Validate at the edges** with Zod (env, API responses, search params).

## Tools available to you

**CodeGraph** (MCP, `.mcp.json`) — the repo is indexed as a queryable graph.
Use `codegraph_explore` to trace callers, callees and blast radius before
changing shared code — especially useful now that components are owned source
and a change to one can ripple. CLI: `codegraph query <symbol>`,
`codegraph explore <question>`, `codegraph status`.

**Ponytail** (plugin, project scope) — biases toward writing less code: reuse
what exists, use the platform, prefer one line over ten. Safety, validation and
accessibility are explicitly never traded away.
`/ponytail lite|full|ultra|off` · `/ponytail-review` · `/ponytail-audit` ·
`/ponytail-debt`.

## Commands

```bash
pnpm dev           # dev server
pnpm build         # typecheck + production build
pnpm check         # typecheck + lint + tests
pnpm test          # vitest watch
pnpm e2e           # Playwright against a production build
pnpm lint:fix      # autofix
pnpm format        # Prettier
pnpm doctor        # verify + repair the agent toolchain
pnpm doctor:check  # report only (CI); exits non-zero on required failures
```

## Environment

`.env` is validated by `src/lib/env.ts` at boot; a missing or malformed value
fails immediately with a readable message rather than surfacing as `undefined`
later. Add a variable in **both** the Zod schema and `.env.example`.
