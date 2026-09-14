import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import * as React from 'react'
import { describe, expect, it } from 'vitest'

import { env } from '@/lib/env'
import { server } from '@/mocks/server'

import { useToggleUserActive, usersQuery } from './api'

/**
 * EXAMPLE — not part of the starter proper. Removed by `pnpm reset`.
 *
 * Worked example for the fourth archetype: the data layer, tested against the
 * same MSW handlers the running app uses.
 *
 * The pattern to copy: a fresh QueryClient per test with retries off, and
 * `server.use()` to force the one condition a test is about. Retries on would
 * make an error test wait for backoff before failing; a shared client would let
 * one test's cache satisfy the next test's query.
 */
const base = env.VITE_API_URL.replace(/\/$/, '')

function wrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe('usersQuery', () => {
  it('fetches the user list from the mock API', async () => {
    const { result } = renderHook(() => useQuery(usersQuery()), {
      wrapper: wrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.map((u) => u.name)).toContain('Ada Lovelace')
  })

  it('surfaces the server message when the request fails', async () => {
    server.use(
      http.get(`${base}/users`, () =>
        HttpResponse.json({ message: 'Upstream is down' }, { status: 503 }),
      ),
    )

    const { result } = renderHook(() => useQuery(usersQuery()), {
      wrapper: wrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Upstream is down')
  })

  it('falls back to a status message when the body has none', async () => {
    server.use(
      http.get(`${base}/users`, () => new HttpResponse(null, { status: 500 })),
    )

    const { result } = renderHook(() => useQuery(usersQuery()), {
      wrapper: wrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Request failed (500)')
  })
})

describe('useToggleUserActive', () => {
  it('applies the change optimistically and keeps it when the server agrees', async () => {
    const Wrapper = wrapper()
    const { result } = renderHook(
      () => ({
        list: useQuery(usersQuery()),
        toggle: useToggleUserActive(),
      }),
      { wrapper: Wrapper },
    )

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))

    // The mock API holds state for the whole run, so assert the flip rather
    // than an absolute value — otherwise this passes only in file order.
    const before = result.current.list.data?.find((u) => u.id === '1')?.active
    const next = !before

    result.current.toggle.mutate({ id: '1', active: next })

    // Optimistic: the cache flips before the request resolves.
    await waitFor(() =>
      expect(result.current.list.data?.find((u) => u.id === '1')?.active).toBe(
        next,
      ),
    )

    await waitFor(() => expect(result.current.toggle.isSuccess).toBe(true))
    expect(result.current.list.data?.find((u) => u.id === '1')?.active).toBe(
      next,
    )
  })

  it('rolls back to the previous value when the server rejects it', async () => {
    const Wrapper = wrapper()
    const { result } = renderHook(
      () => ({
        list: useQuery(usersQuery()),
        toggle: useToggleUserActive(),
      }),
      { wrapper: Wrapper },
    )

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true))
    // User 3 is the record the mock API always rejects, so the rollback path
    // is exercised for real rather than with a stubbed failure.
    const before = result.current.list.data?.find((u) => u.id === '3')?.active

    result.current.toggle.mutate({ id: '3', active: !before })

    await waitFor(() => expect(result.current.toggle.isError).toBe(true))
    expect(result.current.toggle.error?.message).toBe(
      'This record is locked by another process.',
    )

    await waitFor(() =>
      expect(result.current.list.data?.find((u) => u.id === '3')?.active).toBe(
        before,
      ),
    )
  })
})
