import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// RTL does not auto-clean between tests when globals are enabled via Vitest
// config rather than its own setup, so unmount explicitly to keep tests
// isolated.
afterEach(() => {
  cleanup()
})
