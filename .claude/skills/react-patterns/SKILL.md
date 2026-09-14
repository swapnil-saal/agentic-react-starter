---
name: react-patterns
description: React 19 and TypeScript conventions for this repo — state, effects, data fetching, composition, performance, and testing. Use when writing or refactoring any React component, hook, or test.
---

# React patterns

React 19 + TypeScript. Conventions below are what this repo does; follow them
rather than generic React habits.

## State: pick the right home

Most bugs come from putting state in the wrong place. In order of preference:

1. **Derive it.** If a value can be computed from props or existing state,
   compute it during render. Do not mirror it into `useState`.
2. **URL** — filters, tabs, pagination, selected id. Use TanStack Router's
   typed `search` params so the view is shareable and survives reload.
3. **Server state** → TanStack Query. Anything fetched from an API is _not_
   local state; don't copy query results into `useState`.
4. **Local `useState`** — genuinely ephemeral UI state (an open dropdown, a
   draft input).
5. **Context** — only for values that are truly app-wide and change rarely
   (theme, current user). Context is not a state manager; a change re-renders
   every consumer.

```tsx
// Wrong — derived state that can drift out of sync
const [fullName, setFullName] = useState('')
useEffect(() => setFullName(`${first} ${last}`), [first, last])

// Right
const fullName = `${first} ${last}`
```

## Effects are a last resort

`useEffect` is for synchronising with something **outside** React: a
subscription, a timer, an imperative browser API. It is not for reacting to
prop changes.

Do not use an effect to:

- compute derived values → compute during render
- fetch data → use TanStack Query
- respond to a user action → put the logic in the event handler
- reset state when a prop changes → pass a `key` to remount instead

Every effect needs correct dependencies and, where it subscribes or starts
anything, a cleanup function. `react-hooks/exhaustive-deps` runs in lint —
fix the dependency, don't silence the warning.

## Data fetching

TanStack Query owns all server state. `src/lib/query-client.ts` holds the
shared defaults (60s `staleTime`, no refetch on window focus).

- Query keys are arrays, ordered general → specific: `['users', userId]`.
- Define queries with `queryOptions()` so a route loader and a component cannot
  disagree about the key or the fetcher.
- Mutations invalidate the keys they affect; don't hand-patch the cache unless
  you need an optimistic update.
- Prefer Suspense or the `isPending`/`isError` flags over manual loading
  booleans.

**Copy `src/features/users/api.ts`** — it is the reference implementation for
typed queries and an optimistic mutation. The optimistic shape is three phases
and all three matter: snapshot in `onMutate`, restore in `onError`, invalidate
in `onSettled`. Without the snapshot there is nothing to roll back to when the
server rejects the change.

`src/routes/users.index.tsx` shows every state a real list has — pending,
error with retry, empty, and loaded. A screen that only handles the happy path
is not finished.

The mock API in `src/mocks/` backs all of this, so the patterns are runnable
with no backend. It deliberately rejects one record so the rollback path is
demonstrable rather than theoretical.

## Components

- Function components only. No classes, except an error boundary.
- Keep components focused. When a component handles both data orchestration
  and detailed presentation, split it.
- **Composition over configuration.** Accept `children` rather than growing a
  `renderFooter` / `showHeader` / `variant` prop matrix.
- Props interfaces are named `<Component>Props` and exported when reusable.
- Never use `React.FC`; type props directly:

```tsx
interface UserCardProps {
  user: User
  onSelect?: (id: string) => void
}

export function UserCard({ user, onSelect }: UserCardProps) { … }
```

- Lists need a stable, identity-based `key`. Never use the array index for a
  list that can reorder, filter, or receive insertions.

## Performance — measure before optimising

React 19 is fast. Premature memoisation adds code and bugs for no gain.

- Do **not** reach for `useMemo`, `useCallback`, or `memo` by default.
- Add them only for a measured problem: an expensive computation, or a stable
  reference a dependency array genuinely needs.
- The cheapest fix is usually structural — move state down, or lift expensive
  children into `children` so they don't re-render with the parent.

## TypeScript

- No `any`. Use `unknown` and narrow. Lint will flag it.
- Let inference work; annotate exported function signatures and props, not
  every local.
- Derive types from a single source of truth rather than restating them —
  `z.infer<typeof schema>` for anything validated by Zod (see
  `src/routes/form-demo.tsx`).
- Prefer a union of literals over an enum.
- Import types with `import type { … }` (`verbatimModuleSyntax` is on).

## Imports

`@/` is aliased to `src/`. Use it for cross-directory imports; keep relative
paths for siblings. Grouped and ordered: external → `@/` → relative.

UI comes from the barrel: `import { Button } from '@/design-system'` — not
from `@/design-system/ui/button`.

## Errors

- Wrap route subtrees in an error boundary; don't let one failed component
  blank the page.
- Show a recoverable message with a next step. Never render a raw exception.
- Validate anything crossing a boundary (API response, URL param, env) with
  Zod at the edge, so the rest of the code works with trusted types.

## Testing

Vitest + React Testing Library, files next to the source as `*.test.ts(x)`.

**The `testing` skill is the source of truth** — it has the four archetypes to
copy, the MSW handler rules and the e2e guidance. Read it before writing a
test. The two rules worth repeating here because they shape how you write
components in the first place:

- Query by **accessible role and name** — `getByRole('button', { name: … })`.
  A component that is hard to query this way is usually a component that is
  hard for a screen reader to use.
- Test behaviour, not implementation. Never assert on state variables or reach
  into internals.

## Verify your work

```bash
pnpm check    # typecheck + lint + design tokens + unit tests   (~6s)
pnpm e2e      # Playwright against a production build           (~5s)
```

Both are cheap. Run `pnpm check` on any change and `pnpm e2e` as well for
anything visual or routed — there is no reason to guess.
