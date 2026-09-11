import { AppShell, Header, Sidebar, Text, ThemeToggle } from '@usefragments/ui'
import {
  Link,
  Outlet,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'

import { env } from '@/lib/env'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/components', label: 'Components' },
  { to: '/form-demo', label: 'Form demo' },
] as const

function RootLayout() {
  // Drives the active nav state. Reading it from the router (rather than
  // tracking it in local state) keeps the sidebar correct on back/forward
  // navigation and on a deep link.
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <AppShell layout="sidebar">
      <AppShell.Header>
        <Header>
          <Header.Brand>
            <Text weight="semibold">{env.VITE_APP_NAME}</Text>
          </Header.Brand>
          <Header.Actions>
            <ThemeToggle />
          </Header.Actions>
        </Header>
      </AppShell.Header>

      <AppShell.Sidebar>
        <Sidebar>
          <Sidebar.Nav>
            <Sidebar.Section>
              {NAV.map((item) => (
                // `no-underline` because Fragments' base styles underline bare
                // anchors; the Sidebar.Item inside provides its own affordance.
                <Link key={item.to} to={item.to} className="no-underline">
                  <Sidebar.Item active={pathname === item.to}>
                    {item.label}
                  </Sidebar.Item>
                </Link>
              ))}
            </Sidebar.Section>
          </Sidebar.Nav>
        </Sidebar>
      </AppShell.Sidebar>

      <AppShell.Main>
        <div className="p-8">
          <Outlet />
        </div>
      </AppShell.Main>
    </AppShell>
  )
}

export const Route = createRootRoute({ component: RootLayout })
