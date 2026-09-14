import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'

import { server } from '@/mocks/server'

// RTL does not auto-clean between tests when globals are enabled via Vitest
// config rather than its own setup, so unmount explicitly to keep tests
// isolated.
afterEach(() => {
  cleanup()
})

/**
 * The mock API runs for the whole unit-test suite, so components that fetch
 * can be tested the same way they run.
 *
 * `onUnhandledRequest: 'error'` is deliberate: a request with no handler is
 * almost always a typo'd URL or a missing mock, and failing loudly beats a test
 * that hangs until timeout with no explanation.
 */
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// Per-test overrides via `server.use()` must not leak into the next test.
afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
