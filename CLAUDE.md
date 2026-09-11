# AI Space — project guide

Vite + React 19 + TypeScript front-end, set up so an agent can navigate it
structurally, look up real APIs instead of guessing, and verify its own work.

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
| UI           | **`@usefragments/ui`** (Fragments, 70 components on Base UI)            |
| Styling      | Fragments tokens + Tailwind v4 bridged to them (no Preflight)           |
| Routing      | TanStack Router — file-based, fully typed                               |
| Server state | TanStack Query                                                          |
| Forms        | React Hook Form + Zod                                                   |
| Tests        | Vitest + Testing Library · Playwright                                   |
| Quality      | ESLint 10 (typescript-eslint, react-hooks, jsx-a11y) · Prettier · Husky |

There is exactly **one** component library. Do not add shadcn, Radix, MUI, or
any other. Fragments covers AI chat surfaces too (`Prompt`, `Message`,
`ConversationList`, `ThinkingIndicator`).

## Layout

```
src/
  routes/          file-based routes; __root.tsx is the app shell
  routeTree.gen.ts GENERATED — never edit
  styles/index.css Fragments + Tailwind token bridge
  styles/theme.css THE palette — all colour lives here
  lib/             env.ts (validated), query-client.ts
  components/      shared components
  test/setup.ts
e2e/               Playwright specs
scripts/           doctor.mjs, gen-catalog.mjs
.claude/skills/    project skills (see below)
```

## Skills — read these before working

| Skill            | Use when                                               |
| ---------------- | ------------------------------------------------------ |
| `fragments-ui`   | Any UI work. Component lookup and the token rule.      |
| `ui-design`      | Designing or reviewing how a screen looks and behaves. |
| `react-patterns` | Writing any component, hook, or test.                  |
| `add-route`      | Adding a page or wiring navigation.                    |

`.claude/skills/fragments-ui/components.md` is a generated catalogue of all 70
components with their real props, types and defaults. **Read it instead of
guessing prop names** — Fragments' API is specific (`<Text scale>` not `size`;
`Input.onChange` gives a `string`, not an event). Regenerate after upgrading
with `pnpm gen:catalog`.

## Hard rules

1. **No hardcoded design values.** No hex codes, no magic pixels. Use Fragments
   props or the bridged Tailwind utilities. All colour lives in one file:
   `src/styles/theme.css`.
2. **Never edit `src/routeTree.gen.ts`.**
3. **Don't touch the style imports** in `src/styles/index.css` without reading
   the comments there. Tailwind Preflight is excluded on purpose, and
   Fragments' component CSS only exists in the prebuilt stylesheet.
4. **Bind forms with `<Controller>`**, not `register()` — Fragments inputs are
   value-first.
5. **Validate at the edges** with Zod (env, API responses, search params).

## Tools available to you

**CodeGraph** (MCP, `.mcp.json`) — the repo is indexed as a queryable graph.
Use `codegraph_explore` to trace callers, callees and blast radius before
changing shared code, rather than grepping. It auto-syncs as files change.
CLI: `codegraph query <symbol>`, `codegraph explore <question>`,
`codegraph status`.

**Ponytail** (plugin, installed at project scope) — biases toward writing less
code: reuse what exists, use the platform, prefer one line over ten. Safety,
validation and accessibility are explicitly never traded away.
`/ponytail lite|full|ultra|off` · `/ponytail-review` (over-engineering in a
diff) · `/ponytail-audit` (whole repo) · `/ponytail-debt`.

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
pnpm gen:catalog   # regenerate the Fragments component catalogue
```

## Environment

`.env` is validated by `src/lib/env.ts` at boot; a missing or malformed value
fails immediately with a readable message rather than surfacing as `undefined`
later. Add a variable in **both** the Zod schema and `.env.example`.
