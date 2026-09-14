import { env } from './env'

/**
 * The one place a request to the app's API is made.
 *
 * Every feature module goes through this, so error shape, headers and the base
 * URL are decided once. Three copies of `fetch` with three slightly different
 * error handlers is how "something went wrong" ends up on screen.
 */
export const API_BASE = env.VITE_API_URL.replace(/\/$/, '')

/**
 * A failed request.
 *
 * `status` lets a caller branch on the kind of failure, and `fieldErrors`
 * carries a 422's per-field map so a form can put each message back on the
 * field it belongs to rather than showing one banner for all of them.
 */
export interface ApiError extends Error {
  status: number
  fieldErrors?: Record<string, string>
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  if (!res.ok) {
    // Surface the server's message so the UI can say what actually failed
    // rather than "something went wrong".
    const body = (await res.json().catch(() => null)) as {
      message?: string
      errors?: Record<string, string>
    } | null

    const error = new Error(
      body?.message ?? `Request failed (${res.status})`,
    ) as ApiError
    error.status = res.status
    error.fieldErrors = body?.errors
    throw error
  }

  // 204 has no body to parse.
  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}
