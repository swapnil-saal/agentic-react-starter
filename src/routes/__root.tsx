import {
  Link,
  Outlet,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { Component, LayoutDashboard, Palette, SquarePen } from 'lucide-react'

import {
  AppHeader,
  AppMain,
  AppShell,
  AppSidebar,
  AppSidebarBrand,
  Text,
  ThemeToggle,
  sidebarLinkClasses,
} from '@/design-system'
import { APP_NAME } from '@/lib/app'

const NAV = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/components', label: 'Components', icon: Component },
  { to: '/form-demo', label: 'Form demo', icon: SquarePen },
  { to: '/brand', label: 'Brand', icon: Palette },
] as const

function RootLayout() {
  // Read from the router rather than local state so the active item stays
  // correct on back/forward and on a deep link.
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <AppShell>
      <AppSidebar>
        <AppSidebarBrand>{APP_NAME}</AppSidebarBrand>
        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={sidebarLinkClasses(pathname === to)}
            >
              <Icon />
              {label}
            </Link>
          ))}
        </nav>
      </AppSidebar>

      <AppMain>
        <AppHeader>
          <Text weight="medium">{APP_NAME}</Text>
          <ThemeToggle />
        </AppHeader>
        <div className="mx-auto w-full max-w-5xl p-6 md:p-8">
          <Outlet />
        </div>
      </AppMain>
    </AppShell>
  )
}

export const Route = createRootRoute({ component: RootLayout })
