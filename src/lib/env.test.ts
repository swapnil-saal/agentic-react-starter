import { describe, expect, it } from 'vitest'

import { envSchema } from './env'

/**
 * These exercise the real schema imported from `env.ts`, not a copy of it.
 * A duplicated schema here would keep passing while the real one drifted,
 * which is the one failure mode this file exists to prevent.
 *
 * Importing the module also runs its boot-time parse against the current
 * `.env`, so a broken local environment surfaces here too.
 */
describe('env schema', () => {
  it('accepts a valid environment', () => {
    const result = envSchema.safeParse({
      VITE_API_URL: 'http://localhost:3000',
      VITE_ENABLE_MOCKS: 'true',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a malformed API url', () => {
    const result = envSchema.safeParse({ VITE_API_URL: 'not-a-url' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      'VITE_API_URL must be a valid URL',
    )
  })

  it('rejects a missing API url', () => {
    const result = envSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('defaults VITE_ENABLE_MOCKS to true when absent', () => {
    const result = envSchema.safeParse({
      VITE_API_URL: 'http://localhost:3000',
    })
    expect(result.success).toBe(true)
    expect(result.data?.VITE_ENABLE_MOCKS).toBe(true)
  })

  it('coerces VITE_ENABLE_MOCKS from string to boolean', () => {
    const result = envSchema.safeParse({
      VITE_API_URL: 'http://localhost:3000',
      VITE_ENABLE_MOCKS: 'false',
    })
    expect(result.data?.VITE_ENABLE_MOCKS).toBe(false)
  })

  it('rejects a VITE_ENABLE_MOCKS value that is not true or false', () => {
    const result = envSchema.safeParse({
      VITE_API_URL: 'http://localhost:3000',
      VITE_ENABLE_MOCKS: 'yes',
    })
    expect(result.success).toBe(false)
  })

  it('reports every problem at once rather than stopping at the first', () => {
    const result = envSchema.safeParse({
      VITE_API_URL: 'not-a-url',
      VITE_ENABLE_MOCKS: 'yes',
    })
    expect(result.error?.issues).toHaveLength(2)
  })
})
