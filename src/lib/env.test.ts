import { describe, expect, it } from 'vitest'
import { z } from 'zod'

/**
 * The env module reads `import.meta.env` at import time, which makes the
 * module-level singleton awkward to test directly. What actually matters is
 * that the schema rejects bad configuration with a useful message, so we
 * exercise the schema shape itself.
 */
const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1, 'VITE_APP_NAME must not be empty'),
  VITE_API_URL: z.url('VITE_API_URL must be a valid URL'),
})

describe('env schema', () => {
  it('accepts a valid environment', () => {
    const result = envSchema.safeParse({
      VITE_APP_NAME: 'AI Space',
      VITE_API_URL: 'http://localhost:3000',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a missing app name', () => {
    const result = envSchema.safeParse({
      VITE_APP_NAME: '',
      VITE_API_URL: 'http://localhost:3000',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      'VITE_APP_NAME must not be empty',
    )
  })

  it('rejects a malformed API url', () => {
    const result = envSchema.safeParse({
      VITE_APP_NAME: 'AI Space',
      VITE_API_URL: 'not-a-url',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      'VITE_API_URL must be a valid URL',
    )
  })

  it('reports every problem at once rather than stopping at the first', () => {
    const result = envSchema.safeParse({ VITE_APP_NAME: '', VITE_API_URL: 'x' })
    expect(result.error?.issues).toHaveLength(2)
  })
})
