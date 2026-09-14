import { HttpResponse, delay, http } from 'msw'

import { env } from '@/lib/env'

/**
 * A stand-in API so the data layer is demonstrable without a backend.
 *
 * Replace these with your real endpoints — the components, queries and
 * mutations that consume them do not change.
 */
export interface Post {
  id: string
  date: string
  kind: 'added' | 'changed' | 'fixed'
  title: string
  body: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'Engineer' | 'Designer' | 'Researcher'
  active: boolean
}

const seed: User[] = [
  {
    id: '1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    role: 'Engineer',
    active: true,
  },
  {
    id: '2',
    name: 'Alan Turing',
    email: 'alan@example.com',
    role: 'Researcher',
    active: true,
  },
  {
    id: '3',
    name: 'Grace Hopper',
    email: 'grace@example.com',
    role: 'Engineer',
    active: false,
  },
  {
    id: '4',
    name: 'Muriel Cooper',
    email: 'muriel@example.com',
    role: 'Designer',
    active: true,
  },
]

// Module-level so mutations persist across navigations within a session.
let users = [...seed]

/**
 * This project's own release notes — real entries, not `Array.from` filler.
 *
 * A paged list is only a useful example if the rows differ from each other:
 * identical rows hide wrapping bugs, make it impossible to see that page two
 * actually loaded, and teach whoever copies this that placeholder content is
 * acceptable. Twenty-three entries is three pages at the current size.
 */
const posts: Post[] = [
  {
    id: '23',
    date: '2026-09-14',
    kind: 'changed',
    title: 'Sage is the default brand',
    body: 'Built from a four-colour palette. In OKLCH the sage lands almost exactly on the accent-500 stop, so the source swatch is a real member of the generated ramp rather than something the ramp approximates.',
  },
  {
    id: '22',
    date: '2026-09-14',
    kind: 'fixed',
    title: 'Three contrast failures the token layer was hiding',
    body: 'Solid status fills wrote white text on a stop too light to carry it — the same failure --ds-accent had already been fixed for, never applied to danger, success, warning and info.',
  },
  {
    id: '21',
    date: '2026-09-14',
    kind: 'added',
    title: 'An axe scan over every route, in both themes',
    body: 'The jsx-a11y lint rules cannot see contrast, because contrast only exists once tokens resolve in a browser. This closes that half, and found the three failures above on its first run.',
  },
  {
    id: '20',
    date: '2026-09-14',
    kind: 'added',
    title: 'Labels are required on controls that render no text',
    body: 'Progress and Slider now take their accessible name through a type that will not compile without one, which turns an audit finding into a build error.',
  },
  {
    id: '19',
    date: '2026-09-13',
    kind: 'added',
    title: 'Design tokens are checked on every edit',
    body: 'A PostToolUse hook runs the token checker against the single file an agent just wrote. A hardcoded hex now comes back in about thirty milliseconds instead of at the end of the task.',
  },
  {
    id: '18',
    date: '2026-09-13',
    kind: 'added',
    title: 'Cursor paging and server-side field errors',
    body: 'The two patterns every real app needs next and nobody had a local example of. This feed is the first; the contact form maps a 422 back onto the field that caused it.',
  },
  {
    id: '17',
    date: '2026-09-13',
    kind: 'added',
    title: 'A testing skill, and four archetypes to copy',
    body: 'A component with variants, a portalled Base UI wrapper, a form field with Zod, and a query with optimistic rollback. Meant to be copied rather than reinvented each time.',
  },
  {
    id: '16',
    date: '2026-09-13',
    kind: 'changed',
    title: 'One fetch wrapper instead of three',
    body: 'Base URL, headers and error shape are decided once in lib/api.ts. Three near-identical helpers is how "something went wrong" reaches the screen.',
  },
  {
    id: '15',
    date: '2026-09-12',
    kind: 'fixed',
    title: 'The environment test was testing a copy of the schema',
    body: 'It re-declared its own Zod object, omitted one variable entirely, and would have stayed green through any drift in the real one.',
  },
  {
    id: '14',
    date: '2026-09-12',
    kind: 'added',
    title: 'The mock API now serves Vitest as well as the browser',
    body: 'One set of handlers, two consumers, so a unit test and the running screen cannot disagree about what the API returns.',
  },
  {
    id: '13',
    date: '2026-09-11',
    kind: 'fixed',
    title: 'Pin packageManager so CI can install pnpm',
    body: 'Corepack needs the version declared in package.json; without it the install step picked whatever pnpm the runner happened to have.',
  },
  {
    id: '12',
    date: '2026-09-11',
    kind: 'changed',
    title: 'Open-source ready',
    body: 'Licence, contributing guide, code of conduct, issue templates and a security policy.',
  },
  {
    id: '11',
    date: '2026-09-10',
    kind: 'fixed',
    title: 'Hover flicker on the sidebar links',
    body: 'A transition on a property that reflowed its own trigger, so the pointer left the element it had just entered.',
  },
  {
    id: '10',
    date: '2026-09-10',
    kind: 'added',
    title: 'pnpm reset turns the starter into a blank app',
    body: 'Strips the example screens and leaves the infrastructure. It refuses to run on a dirty tree, so git checkout is always an undo.',
  },
  {
    id: '9',
    date: '2026-09-09',
    kind: 'fixed',
    title: 'The contrast audit reported every pairing as a failure',
    body: 'It compared resolved colours against a token string rather than against the colour that token resolved to.',
  },
  {
    id: '8',
    date: '2026-09-09',
    kind: 'fixed',
    title: 'Mobile navigation and route resilience',
    body: 'A drawer for small screens, plus error and not-found routes so a bad URL renders something rather than a blank page.',
  },
  {
    id: '7',
    date: '2026-09-08',
    kind: 'added',
    title: 'A settings page with a live contrast audit',
    body: 'It measures the resolved tokens rather than the source values, which is the only way to catch a pairing a brand can actually break.',
  },
  {
    id: '6',
    date: '2026-09-08',
    kind: 'added',
    title: 'Design-system rules enforced mechanically',
    body: 'Six ways a component quietly stops responding to the brand, each one now a build failure with a file, a line and the token to reach for instead.',
  },
  {
    id: '5',
    date: '2026-09-07',
    kind: 'added',
    title: 'A brand layer: one file defines the whole look',
    body: 'Nineteen knobs drive every colour, radius, duration and control height. Everything below them is derived and should never hold a literal.',
  },
  {
    id: '4',
    date: '2026-09-07',
    kind: 'added',
    title: 'A shared motion vocabulary',
    body: 'Every transition composes from one module, so a single knob can slow or disable animation across the entire app.',
  },
  {
    id: '3',
    date: '2026-09-06',
    kind: 'changed',
    title: 'An owned design system on Base UI',
    body: 'The primitives supply focus management, keyboard navigation and ARIA wiring. The styling and the API are ours, so there is nothing to fight.',
  },
  {
    id: '2',
    date: '2026-09-05',
    kind: 'added',
    title: 'The repo indexed as a queryable graph',
    body: 'CodeGraph over MCP, so an agent traces callers and blast radius before changing shared code instead of grepping for it.',
  },
  {
    id: '1',
    date: '2026-09-03',
    kind: 'added',
    title: 'Vite, React and TypeScript wired for agentic development',
    body: 'The first commit worth naming: a typed router, a validated environment, and a verification command that runs in seconds.',
  },
]

const PAGE_SIZE = 10

const base = env.VITE_API_URL.replace(/\/$/, '')

export const handlers = [
  http.get(`${base}/users`, async () => {
    await delay(400) // long enough to see pending states
    return HttpResponse.json(users)
  }),

  http.get(`${base}/users/:id`, async ({ params }) => {
    await delay(300)
    const user = users.find((u) => u.id === params.id)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return HttpResponse.json(user)
  }),

  http.patch(`${base}/users/:id`, async ({ params, request }) => {
    await delay(600)
    const patch = (await request.json()) as Partial<User>

    // Deliberately fail for one record, so the optimistic-update rollback
    // path is demonstrable rather than theoretical.
    if (params.id === '3') {
      return HttpResponse.json(
        { message: 'This record is locked by another process.' },
        { status: 409 },
      )
    }

    users = users.map((u) => (u.id === params.id ? { ...u, ...patch } : u))
    return HttpResponse.json(users.find((u) => u.id === params.id))
  }),

  /**
   * Cursor-paged feed. Returns the next cursor, or null on the last page —
   * which is what `getNextPageParam` reads to know when to stop.
   */
  http.get(`${base}/posts`, async ({ request }) => {
    await delay(350)
    const cursor = Number(new URL(request.url).searchParams.get('cursor') ?? 0)
    const items = posts.slice(cursor, cursor + PAGE_SIZE)
    const next = cursor + PAGE_SIZE
    return HttpResponse.json({
      items,
      nextCursor: next < posts.length ? next : null,
      total: posts.length,
    })
  }),

  /**
   * Submitting the contact form.
   *
   * Rejects one address with a 422 and a per-field error map, so the
   * server-validation path — mapping field errors back onto the form — is
   * demonstrable rather than theoretical.
   */
  http.post(`${base}/contact`, async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as { email?: string }

    if (body.email === 'taken@example.com') {
      return HttpResponse.json(
        {
          message: 'Please fix the highlighted fields.',
          errors: { email: 'That email is already registered.' },
        },
        { status: 422 },
      )
    }

    return HttpResponse.json({ ok: true }, { status: 201 })
  }),
]
