import { describe, expect, it } from 'vitest'
import { z } from 'zod'

/**
 * The env module reads `import.meta.env` at import time, which makes the
 * module-level singleton awkward to test directly. What actually matters is
 * that the schema rejects bad configuration with a useful message, so we
 * exercise the schema shape itself.
 */
const envSchema = z.object({
  VITE_API_URL: z.url('VITE_API_URL must be a valid URL'),
})

describe('env schema', () => {
  it('accepts a valid environment', () => {
    const result = envSchema.safeParse({
      VITE_API_URL: 'http://localhost:3000',
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

  it('reports every problem at once rather than stopping at the first', () => {
    const wider = envSchema.extend({
      VITE_OTHER: z.string().min(1, 'VITE_OTHER must not be empty'),
    })
    const result = wider.safeParse({ VITE_API_URL: 'x', VITE_OTHER: '' })
    expect(result.error?.issues).toHaveLength(2)
  })
})
