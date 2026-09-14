---
name: testing
description: How to test in this repo — the verification loop, the four unit-test archetypes, MSW mock handlers, and Playwright e2e. Use when writing or fixing any test, adding a mock endpoint, or deciding whether a change is adequately covered.
---

# Testing

This repo's differentiator is that an agent can check its own work. The loop is
about ten seconds end to end, so there is no reason to guess.

```bash
pnpm check    # typecheck + lint + design tokens + unit tests   (~6s)
pnpm e2e      # Playwright against a production build           (~5s)
```

Run `pnpm check` after any change. Run `pnpm e2e` as well for anything visual,
routed, or involving real navigation. A `PostToolUse` hook already checks design
tokens on every file you edit under `src/`, so token failures arrive before you
even run the suite.

## Which kind of test

| Change                                 | Test                                   |
| -------------------------------------- | -------------------------------------- |
| A design-system component's behaviour  | unit, next to the component            |
| A query, mutation or cache rule        | unit, next to the feature module       |
| A form's validation and submission     | unit                                   |
| Navigation, routing, or a whole screen | e2e                                    |
| Anything about how it _looks_          | e2e (tokens resolve only in a browser) |

jsdom has no layout engine and no real CSS cascade. Never assert on colours,
sizes or positions in a unit test — that is what the e2e specs in `e2e/` are
for, and why they run against a production build.

## The four unit archetypes

Copy the one closest to what you are testing. All four exist and pass.

| Archetype                       | Copy from                              |
| ------------------------------- | -------------------------------------- |
| A component with CVA variants   | `src/design-system/ui/button.test.tsx` |
| A Base UI wrapper with a portal | `src/design-system/ui/dialog.test.tsx` |
| A form field with RHF + Zod     | `src/design-system/ui/field.test.tsx`  |
| A query/mutation against MSW    | `src/features/users/api.test.tsx`      |

## The rules

- **Query by accessible role and name** — `getByRole('button', { name: … })`.
  Not class names, not test ids. This asserts the thing is reachable the way a
  user and a screen reader reach it, and it survives restyling, which matters
  when the whole design system is meant to be edited.
- **Test behaviour, not implementation.** Never assert on state variables or
  reach into a component's internals.
- **`userEvent` over `fireEvent`** — it models real interaction, including
  focus and keyboard.
- **Cover the states that break**: empty, error, disabled, boundary values.
- **Anything Base UI gives you for free, assert once.** Focus moving into a
  dialog, Escape closing it, a label being associated. Those are exactly the
  behaviours a careless refactor removes without any visible symptom.

### Base UI is asynchronous

Enter and exit transitions are real, so state that looks synchronous is not.
Use `findBy*`, or `waitFor` for a non-query assertion:

```tsx
// Focus lands only once the enter transition settles.
await waitFor(() =>
  expect(dialog).toContainElement(document.activeElement as HTMLElement),
)
```

Asserting immediately after opening catches the trigger, not the dialog.

## The mock API

`src/mocks/handlers.ts` is one set of handlers, served two ways: to the running
app through a service worker (`browser.ts`) and to Vitest through request
interception (`server.ts`). A test and the real app therefore cannot disagree
about what the API returns.

**Adding an endpoint** — add a handler to the array in `handlers.ts`:

```ts
http.get(`${base}/things`, async () => {
  await delay(300) // long enough to see pending states in the browser
  return HttpResponse.json(things)
})
```

`base` comes from validated env, so never hardcode a URL.

**Forcing one condition in a test** — override with `server.use()`. The setup
file resets handlers after every test, so an override cannot leak:

```ts
server.use(
  http.get(`${base}/users`, () =>
    HttpResponse.json({ message: 'Upstream is down' }, { status: 503 }),
  ),
)
```

**Unhandled requests fail loudly.** `onUnhandledRequest: 'error'` is set in
`src/test/setup.ts` on purpose — a request with no handler is nearly always a
typo'd URL, and failing beats hanging until timeout with no explanation.

**Mock state persists for the whole run.** The handlers hold module-level
arrays so mutations survive navigation in the browser. In tests that means one
test can see another's write, so assert a _change_ rather than an absolute
value:

```ts
const before = data.find((u) => u.id === '1')?.active
toggle.mutate({ id: '1', active: !before })
```

## Testing queries and mutations

Give every test a fresh `QueryClient` with retries off. Retries on make an
error test wait through backoff before failing; a shared client lets one test's
cache satisfy the next test's query. See `src/features/users/api.test.tsx`.

```tsx
const client = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
})
```

## End-to-end

Specs live in `e2e/`, run against a production build (`pnpm build && pnpm
preview`) — the same artifact that ships.

- `e2e/app.spec.ts` covers the app shell, the token system and the brand knobs.
  It is **not** example code: it stays after `pnpm reset`.
- `e2e/examples.spec.ts` covers the example routes and is deleted by
  `pnpm reset`, along with the screens it tests.

If you add an example screen, test it in `examples.spec.ts` and add the file to
`EXAMPLES` in `scripts/reset.mjs`. If you add real app behaviour, test it in
`app.spec.ts`.

The most valuable e2e assertions here are the ones that catch a silently broken
token layer — a component that still renders but has stopped responding to the
brand. Read the existing "components are actually styled" and "one knob
restyles the whole app" tests before writing a new one.

## Accessibility

`pnpm e2e` runs an axe scan over every main route (`e2e/a11y.spec.ts`). It
catches the runtime problems the `jsx-a11y` lint rules cannot see: contrast,
ARIA that is wrong only in context, and landmark structure. A new route should
be added to the list in that spec.

### The stale preview server

`playwright.config.ts` sets `reuseExistingServer: !process.env.CI`, so locally
Playwright will attach to a preview server that is already running **and skip
the rebuild**. If you change a component or a token and the e2e results do not
move, that is why — you are testing the previous build. Kill it and re-run:

```bash
lsof -ti:4173 | xargs kill -9
```

CI always builds fresh, so this only ever bites locally.

## When a test fails

1. Read the assertion, not just the summary — Testing Library prints the
   accessible tree it searched, which usually names the problem.
2. `pnpm test:run <path>` to run one file.
3. `pnpm exec playwright test --debug` to step through an e2e failure, or open
   `playwright-report/` after a CI run.
4. If a test is flaky rather than wrong, suspect mock state that persists
   between tests, or a missing `await`.

Never delete or skip a failing test to get the suite green. If it is genuinely
obsolete, say so explicitly rather than quietly removing it.
