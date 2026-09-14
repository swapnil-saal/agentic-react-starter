import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import type { User } from '@/mocks/handlers'
import { api } from '@/lib/api'

/**
 * EXAMPLE — not part of the starter proper.
 *
 * Example feature module — the reference for typed queries and optimistic
 * mutations. Removed by `pnpm reset`; copy the shape into your own features.
 */

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
    queryFn: () => api<User[]>('/users'),
  })

export const userQuery = (id: string) =>
  queryOptions({
    queryKey: ['users', id] as const,
    queryFn: () => api<User>(`/users/${id}`),
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
      api<User>(`/users/${id}`, {
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
