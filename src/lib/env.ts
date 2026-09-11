import { z } from 'zod'

/**
 * Validated environment.
 *
 * Vite only exposes variables prefixed with `VITE_` to client code, and it
 * inlines them at build time — so a typo or a missing value silently becomes
 * `undefined` and surfaces much later as a confusing runtime bug. Parsing the
 * whole environment once, here, turns that into an immediate and readable
 * failure at boot.
 *
 * Add a variable: extend the schema below AND document it in `.env.example`.
 */
const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1, 'VITE_APP_NAME must not be empty'),
  VITE_API_URL: z.url('VITE_API_URL must be a valid URL'),
})

export type Env = z.infer<typeof envSchema>

function parseEnv(): Env {
  const result = envSchema.safeParse(import.meta.env)

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')

    throw new Error(
      `Invalid environment configuration:\n${details}\n\n` +
        `Copy .env.example to .env and fill in the missing values.`,
    )
  }

  return result.data
}

export const env = parseEnv()
