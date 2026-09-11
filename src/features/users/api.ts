import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import type { User } from '@/mocks/handlers'
import { env } from '@/lib/env'

const base = env.VITE_API_URL.replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    // Surface the server's message so the UI can say what actually failed
    // rather than "something went wrong".
    const body = (await res.json().catch(() => null)) as {
      message?: string
    } | null
    throw new Error(body?.message ?? `Request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

/**
 * Query keys are arrays ordered general → specific, so invalidating
 * `['users']` also invalidates every individual user underneath it.
 *
 * `queryOptions` keeps the key and fetcher together and typed, so a route
 * loader and a component cannot disagree about either.
 */
export const usersQuery = () =>
  queryOptions({
    queryKey: ['users'] as const,
    queryFn: () => request<User[]>('/users'),
  })

export const userQuery = (id: string) =>
  queryOptions({
    queryKey: ['users', id] as const,
    queryFn: () => request<User>(`/users/${id}`),
  })

/**
 * Toggle a user's active flag, applied optimistically.
 *
 * The three-phase shape — snapshot in `onMutate`, restore in `onError`,
 * invalidate in `onSettled` — is the pattern to copy. Without the snapshot
 * there is nothing to roll back to when the server rejects the change.
 */
export function useToggleUserActive() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      request<User>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active }),
      }),

    onMutate: async ({ id, active }) => {
      // Stop in-flight refetches from clobbering the optimistic value.
      await qc.cancelQueries({ queryKey: ['users'] })
      const previous = qc.getQueryData<User[]>(['users'])

      qc.setQueryData<User[]>(['users'], (old) =>
        old?.map((u) => (u.id === id ? { ...u, active } : u)),
      )

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) qc.setQueryData(['users'], context.previous)
    },

    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
