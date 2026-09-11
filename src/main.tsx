import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  ThemeProvider,
  ToastProvider,
  Toaster,
  TooltipProvider,
} from '@/design-system'
import { queryClient } from '@/lib/query-client'
import { startMocks } from './mocks/start'
import { routeTree } from './routeTree.gen'
import './styles/index.css'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  // Handed to every loader, so a route can prefetch into the same cache the
  // components read from.
  context: { queryClient },
})

// Gives every `to`, `params` and `search` in the app end-to-end type safety.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found in index.html')

// Await the worker before mounting — otherwise the first query can fire
// before the interceptor is installed and hit the network for real.
await startMocks()

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <ToastProvider>
            <RouterProvider router={router} />
            <Toaster />
          </ToastProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
