---
name: add-route
description: How to add or change a page/route in this repo using TanStack Router's file-based routing. Use when creating a new screen, nesting routes, adding route params, or wiring navigation links.
---

# Adding a route

Routing is **file-based** via `@tanstack/router-plugin`, configured in
`vite.config.ts`. Files in `src/routes/` generate `src/routeTree.gen.ts`.

## Never edit routeTree.gen.ts

It is generated. The plugin rewrites it whenever `pnpm dev` or `pnpm build`
runs. It is excluded from linting and Prettier. Edits are lost silently.

## File naming → URL

| File                              | URL                                               |
| --------------------------------- | ------------------------------------------------- |
| `src/routes/index.tsx`            | `/`                                               |
| `src/routes/about.tsx`            | `/about`                                          |
| `src/routes/users.index.tsx`      | `/users`                                          |
| `src/routes/users.$userId.tsx`    | `/users/:userId`                                  |
| `src/routes/settings.profile.tsx` | `/settings/profile`                               |
| `src/routes/_auth.tsx`            | pathless layout (wraps children, adds no segment) |
| `src/routes/__root.tsx`           | the app shell — wraps everything                  |

## The shape of a route file

Every route file exports a `Route` created with `createFileRoute`, whose path
string must match the filename. Get it wrong and the generator will correct
it on the next run.

```tsx
import { createFileRoute } from '@tanstack/react-router'

function Settings() {
  return <div>…</div>
}

export const Route = createFileRoute('/settings')({ component: Settings })
```

Exporting `Route` alongside the component is the router's contract, which is
why `react-refresh/only-export-components` is switched off for
`src/routes/**` in `eslint.config.js`.

## Params and search

Both are fully typed — that is the point of this router.

```tsx
// src/routes/users.$userId.tsx
export const Route = createFileRoute('/users/$userId')({
  component: User,
})

function User() {
  const { userId } = Route.useParams() // typed as string
  const { tab } = Route.useSearch() // typed by validateSearch
}
```

Validate search params with Zod so bad URLs fail predictably:

```tsx
export const Route = createFileRoute('/users')({
  validateSearch: z.object({
    page: z.coerce.number().default(1),
    q: z.string().optional(),
  }),
  component: Users,
})
```

Prefer search params over `useState` for filters, tabs and pagination — the
view becomes shareable and survives reload.

## Linking

Always use `<Link>`, never a bare `<a href>` for internal navigation — you
lose client-side routing and prefetching.

```tsx
<Link to="/users/$userId" params={{ userId: user.id }}>
  Profile
</Link>
```

A typo in `to`, or a missing param, is a **type error** at build time. If TS
complains about a `to` value, the route doesn't exist — create the file first
and let the tree regenerate.

## Data loading

For server data, use TanStack Query inside the component (see the
`react-patterns` skill). Use the router's `loader` only when the data must be
resolved before the route renders.

## Adding a page to the nav

`src/routes/__root.tsx` holds the `NAV` array that drives the sidebar. Add an
entry there; active state is derived from the router's current pathname, so
nothing else needs updating.

## Checklist

1. Create the file in `src/routes/`, named for the URL you want.
2. Export `Route` via `createFileRoute` with the matching path.
3. Run `pnpm dev` (or `pnpm build`) once so the tree regenerates.
4. Add it to `NAV` in `__root.tsx` if it should appear in the sidebar.
5. `pnpm check` — a broken link or param shows up as a type error.
