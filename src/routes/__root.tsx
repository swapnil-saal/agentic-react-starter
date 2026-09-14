import type { QueryClient } from '@tanstack/react-query'
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import {
  Component,
  LayoutDashboard,
  Menu as MenuIcon,
  Palette,
  SquarePen,
  Users,
} from 'lucide-react'
import * as React from 'react'

import {
  AppHeader,
  AppMain,
  AppShell,
  AppSidebar,
  AppSidebarBrand,
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
  EmptyState,
  Stack,
  Text,
  ThemeToggle,
  sidebarLinkClasses,
} from '@/design-system'
import { APP_NAME } from '@/lib/app'

const NAV = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/components', label: 'Components', icon: Component },
  { to: '/form-demo', label: 'Form demo', icon: SquarePen },
  { to: '/brand', label: 'Brand', icon: Palette },
] as const

/** One nav definition, rendered in both the rail and the mobile drawer, so the
 *  two can never drift apart. */
function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className={sidebarLinkClasses(
            to === '/' ? pathname === to : pathname.startsWith(to),
          )}
        >
          <Icon />
          {label}
        </Link>
      ))}
    </nav>
  )
}

function RootLayout() {
  const [open, setOpen] = React.useState(false)

  return (
    <AppShell>
      <AppSidebar>
        <AppSidebarBrand>{APP_NAME}</AppSidebarBrand>
        <Nav />
      </AppSidebar>

      <AppMain>
        <AppHeader>
          <Stack direction="row" gap={2} align="center">
            {/* The rail is hidden below md, so without this the app would have
                no navigation at all on a phone. */}
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open navigation"
                    className="md:hidden"
                  />
                }
              >
                <MenuIcon />
              </DrawerTrigger>
              <DrawerContent side="left" className="p-3">
                <DrawerTitle className="mb-2 px-2.5">{APP_NAME}</DrawerTitle>
                <Nav onNavigate={() => setOpen(false)} />
                <DrawerClose className="sr-only">Close navigation</DrawerClose>
              </DrawerContent>
            </Drawer>
            <Text weight="medium">{APP_NAME}</Text>
          </Stack>
          <ThemeToggle />
        </AppHeader>

        <div className="mx-auto w-full max-w-5xl p-6 md:p-8">
          <Outlet />
        </div>
      </AppMain>
    </AppShell>
  )
}

/** Shown when any route below throws. Without it one bad component blanks
 *  the entire app. */
function RootErrorComponent({ error }: { error: unknown }) {
  // The router types this as `unknown` — anything can be thrown, so narrow
  // rather than assuming an Error and rendering "undefined".
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred.'

  return (
    <div className="grid min-h-dvh place-items-center p-6">
      <EmptyState
        title="Something broke"
        description={message}
        action={
          <Button onClick={() => window.location.assign('/')}>
            Back to safety
          </Button>
        }
      />
    </div>
  )
}

function RootNotFound() {
  return (
    <div className="grid place-items-center py-16">
      <EmptyState
        title="Page not found"
        description="That URL does not match any route in this app."
        action={
          <Link to="/">
            <Button>Go home</Button>
          </Link>
        }
      />
    </div>
  )
}

/** The context every route loader receives. Declaring it here is what makes
 *  `context.queryClient` typed inside a loader. */
export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  errorComponent: RootErrorComponent,
  notFoundComponent: RootNotFound,
})
