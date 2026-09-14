import { useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Inbox } from 'lucide-react'

import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  EmptyState,
  Skeleton,
  Stack,
  Text,
} from '@/design-system'
import type { Post } from '@/mocks/handlers'
import { postsFeedQuery } from '@/features/posts/api'

/** Status colour by kind, so the change type reads before the words do. */
const TONE: Record<Post['kind'], 'success' | 'info' | 'neutral'> = {
  added: 'success',
  fixed: 'info',
  changed: 'neutral',
}

const formatDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format

/**
 * EXAMPLE — not part of the starter proper.
 *
 * A worked example of cursor-paged data with `useInfiniteQuery`. Removed by
 * `pnpm reset`.
 */

/**
 * The canonical paged-list screen.
 *
 * `data.pages` is an array of responses, not of rows — flatten it to render.
 * Keeping the pages intact is what lets Query add a page without re-fetching
 * or re-rendering the ones already on screen.
 *
 * `isFetchingNextPage` is deliberately distinct from `isPending`: the first is
 * "more is coming", the second is "nothing is here yet". Conflating them
 * replaces the whole list with skeletons every time someone loads more.
 */
function Feed() {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(postsFeedQuery())

  if (isPending) {
    return (
      <Stack gap={6}>
        <Text as="h1" size="3xl" weight="bold">
          Feed
        </Text>
        <Stack gap={2}>
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </Stack>
      </Stack>
    )
  }

  if (isError) {
    return (
      <Stack gap={6}>
        <Text as="h1" size="3xl" weight="bold">
          Feed
        </Text>
        <Alert tone="danger" title="Could not load the feed">
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

  const posts = data.pages.flatMap((page) => page.items)
  const total = data.pages[0]?.total ?? 0

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<Inbox />}
        title="Nothing published yet"
        description="New release notes will show up here."
      />
    )
  }

  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Text as="h1" size="3xl" weight="bold">
          Feed
        </Text>
        <Text tone="muted">
          This project's own release notes, cursor-paged with useInfiniteQuery —
          showing {posts.length} of {total}.
        </Text>
      </Stack>

      <Stack gap={3}>
        {posts.map((post) => (
          <Card key={post.id}>
            <CardBody>
              <Stack gap={2}>
                <Stack direction="row" gap={2} align="center">
                  <Badge tone={TONE[post.kind]}>{post.kind}</Badge>
                  <Text tone="subtle" size="sm">
                    <time dateTime={post.date}>
                      {formatDate(new Date(post.date))}
                    </time>
                  </Text>
                </Stack>
                {/* A real heading: the page is a list of entries, and this is
                    how a screen reader jumps between them. */}
                <Text as="h2" weight="semibold">
                  {post.title}
                </Text>
                <Text tone="muted" size="sm">
                  {post.body}
                </Text>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>

      <Stack align="center">
        {hasNextPage ? (
          <Button
            variant="outline"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {isFetchingNextPage ? 'Loading…' : 'Load more'}
          </Button>
        ) : (
          <Text tone="muted" size="sm">
            That is everything.
          </Text>
        )}
      </Stack>
    </Stack>
  )
}

export const Route = createFileRoute('/feed')({ component: Feed })
