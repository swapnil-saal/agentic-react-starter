/**
 * Start the mock API, if enabled.
 *
 * Gated on an env flag rather than `import.meta.env.DEV` so the production
 * preview build used by the e2e suite can run against mocks too. Point
 * VITE_ENABLE_MOCKS at "false" once you have a real backend.
 */
export async function startMocks() {
  const { env } = await import('@/lib/env')
  if (!env.VITE_ENABLE_MOCKS) return

  const { worker } = await import('./browser')
  await worker.start({
    onUnhandledRequest: 'bypass', // don't warn about Vite's own assets
    quiet: true,
  })
}
