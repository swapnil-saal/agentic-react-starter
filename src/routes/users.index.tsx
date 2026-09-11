import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Inbox } from 'lucide-react'

import {
  Alert,
  Badge,
  Button,
  EmptyState,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  useToast,
} from '@/design-system'
import { useToggleUserActive, usersQuery } from '@/features/users/api'

/**
 * The canonical server-state screen: every state a real list has, handled.
 *
 * Toggling "Grace Hopper" is rejected by the API on purpose, so the
 * optimistic update visibly rolls back rather than the failure being
 * something you have to take on trust.
 */
function UsersList() {
  const { data, isPending, isError, error, refetch } = useQuery(usersQuery())
  const toggle = useToggleUserActive()
  const toast = useToast()

  if (isPending) {
    return (
      <Stack gap={6}>
        <Text as="h1" size="3xl" weight="bold">
          Users
        </Text>
        <Stack gap={2}>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </Stack>
      </Stack>
    )
  }

  if (isError) {
    return (
      <Stack gap={6}>
        <Text as="h1" size="3xl" weight="bold">
          Users
        </Text>
        <Alert tone="danger" title="Could not load users">
          <Stack gap={3} align="start">
            <Text tone="muted">{error.message}</Text>
            <Button size="sm" variant="outline" onClick={() => void refetch()}>
              Try again
            </Button>
          </Stack>
        </Alert>
      </Stack>
    )
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<Inbox />}
        title="No users yet"
        description="Invite someone and they will appear here."
        action={<Button size="sm">Invite</Button>}
      />
    )
  }

  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Text as="h1" size="3xl" weight="bold">
          Users
        </Text>
        <Text tone="muted">
          TanStack Query against a mock API. Toggling Grace Hopper is rejected
          by the server, so the optimistic update rolls back.
        </Text>
      </Stack>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link
                  to="/users/$userId"
                  params={{ userId: user.id }}
                  className="text-accent hover:underline"
                >
                  {user.name}
                </Link>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge tone={user.active ? 'success' : 'neutral'} dot>
                  {user.active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <Switch
                  checked={user.active}
                  aria-label={`Toggle ${user.name}`}
                  onCheckedChange={(active) =>
                    toggle.mutate(
                      { id: user.id, active },
                      {
                        onError: (err) =>
                          toast.add({
                            title: 'Change reverted',
                            description: err.message,
                          }),
                      },
                    )
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  )
}

export const Route = createFileRoute('/users/')({ component: UsersList })
