import { setupServer } from 'msw/node'

import { handlers } from './handlers'

/**
 * The mock API for unit tests.
 *
 * `browser.ts` serves the same handlers to the running app via a service
 * worker; this serves them to Vitest via request interception in Node. One set
 * of handlers, so a test and the real app cannot disagree about what the API
 * returns.
 *
 * Override per-test with `server.use(...)` to exercise an error or empty
 * response — see `src/features/users/api.test.tsx` for the pattern.
 */
export const server = setupServer(...handlers)
