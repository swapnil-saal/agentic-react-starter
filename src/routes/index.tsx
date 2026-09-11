import { Badge, Button, Card, Grid, Stack, Text } from '@usefragments/ui'
import { Link, createFileRoute } from '@tanstack/react-router'

import { env } from '@/lib/env'

const FEATURES = [
  {
    title: 'Fragments UI',
    body: '70 accessible components on Base UI primitives, themed from a single brand seed.',
  },
  {
    title: 'Typed routing',
    body: 'TanStack Router generates the route tree, so a bad link is a type error.',
  },
  {
    title: 'Code intelligence',
    body: 'CodeGraph indexes the repo so the agent traces callers instead of grepping.',
  },
  {
    title: 'Minimal by default',
    body: 'Ponytail pushes the agent to reuse what exists before writing anything new.',
  },
]

function Home() {
  return (
    <Stack direction="column" gap="lg">
      <Stack direction="column" gap="sm">
        <Badge tone="accent">Boilerplate</Badge>
        <Text as="h1" scale="2xl" weight="bold">
          {env.VITE_APP_NAME}
        </Text>
        <Text color="secondary">
          A Vite + React + TypeScript starter wired for agentic development.
        </Text>
      </Stack>

      <Grid columns={2} gap="md">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <Card.Header>
              <Card.Title>{feature.title}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Text color="secondary">{feature.body}</Text>
            </Card.Body>
          </Card>
        ))}
      </Grid>

      <Stack direction="row" gap="sm">
        <Link to="/components">
          <Button variant="solid" tone="accent">
            Browse components
          </Button>
        </Link>
        <Link to="/form-demo">
          <Button variant="outline">Form demo</Button>
        </Link>
      </Stack>
    </Stack>
  )
}

export const Route = createFileRoute('/')({ component: Home })
