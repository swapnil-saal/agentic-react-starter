import { QueryClient } from '@tanstack/react-query'

/**
 * Shared QueryClient.
 *
 * Defaults are tuned for an app that is mostly read-heavy: data is considered
 * fresh for a minute, and we don't refetch just because the window regained
 * focus, which otherwise causes a visible flash of refetching on every tab
 * switch. Override per-query where a screen genuinely needs livelier data.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
