import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Stack,
  Text,
} from '@/design-system'
import { APP_NAME } from '@/lib/app'

const FEATURES = [
  {
    title: 'Owned components',
    body: 'Every component is source in this repo, built on Base UI primitives. Edit any of them.',
  },
  {
    title: 'Three-layer tokens',
    body: 'Primitives to semantics to utilities. Retheme the app without touching a component.',
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
    <Stack gap={8}>
      <Stack gap={3}>
        <Badge tone="accent">Starter</Badge>
        <Text as="h1" size="3xl" weight="bold">
          {APP_NAME}
        </Text>
        <Text size="md" tone="muted" className="max-w-2xl">
          A Vite + React + TypeScript starter with a design system you own,
          wired for agentic development.
        </Text>
      </Stack>

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardBody>
              <Text tone="muted">{feature.body}</Text>
            </CardBody>
          </Card>
        ))}
      </div>

      <Stack direction="row" gap={3}>
        <Link to="/components">
          <Button>
            Browse components
            <ArrowRight />
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
