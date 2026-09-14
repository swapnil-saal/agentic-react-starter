import { infiniteQueryOptions } from '@tanstack/react-query'

import type { Post } from '@/mocks/handlers'
import { api } from '@/lib/api'

/**
 * EXAMPLE — not part of the starter proper.
 *
 * The reference for cursor-paged data. Removed by `pnpm reset`.
 */
export interface PostsPage {
  items: Post[]
  nextCursor: number | null
  total: number
}

/**
 * A cursor-paged feed.
 *
 * `infiniteQueryOptions` is the infinite-query twin of `queryOptions` — it
 * keeps key, fetcher and paging rules together and typed.
 *
 * `getNextPageParam` returning `undefined` (not `null`) is what sets
 * `hasNextPage` to false, so map the server's terminal value across explicitly
 * rather than passing it through and wondering why the button never disables.
 */
export const postsFeedQuery = () =>
  infiniteQueryOptions({
    queryKey: ['posts', 'feed'] as const,
    queryFn: ({ pageParam }) => api<PostsPage>(`/posts?cursor=${pageParam}`),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
