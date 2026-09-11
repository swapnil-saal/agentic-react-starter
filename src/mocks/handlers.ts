import { HttpResponse, delay, http } from 'msw'

import { env } from '@/lib/env'

/**
 * A stand-in API so the data layer is demonstrable without a backend.
 *
 * Replace these with your real endpoints — the components, queries and
 * mutations that consume them do not change.
 */
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
]
