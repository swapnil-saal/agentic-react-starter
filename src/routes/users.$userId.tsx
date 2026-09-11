import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
  Stack,
  Text,
} from '@/design-system'
import { userQuery } from '@/features/users/api'

function UserDetail() {
  // `Route.useParams()` is typed from the filename — a typo here is a build error.
  const { userId } = Route.useParams()
  const { data } = useQuery(userQuery(userId))

  return (
    <Stack gap={6}>
      <Link to="/users" className="w-fit">
        <Button variant="ghost" size="sm">
          <ArrowLeft />
          Back to users
        </Button>
      </Link>

      {!data ? (
        <Skeleton className="h-48 w-full max-w-md" />
      ) : (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{data.name}</CardTitle>
            <Text tone="muted">{data.email}</Text>
          </CardHeader>
          <CardBody>
            <Stack gap={3}>
              <Separator />
              <Stack direction="row" justify="between">
                <Text tone="muted">Role</Text>
                <Text weight="medium">{data.role}</Text>
              </Stack>
              <Stack direction="row" justify="between" align="center">
                <Text tone="muted">Status</Text>
                <Badge tone={data.active ? 'success' : 'neutral'} dot>
                  {data.active ? 'Active' : 'Inactive'}
                </Badge>
              </Stack>
            </Stack>
          </CardBody>
        </Card>
      )}
    </Stack>
  )
}

export const Route = createFileRoute('/users/$userId')({
  component: UserDetail,
  // Resolved before the component renders, so the detail view never flashes
  // empty when arriving from the list (the data is usually already cached).
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(userQuery(params.userId)),
})
