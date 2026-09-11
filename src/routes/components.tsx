import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Progress,
  Separator,
  Skeleton,
  Stack,
  Switch,
  Text,
} from '@usefragments/ui'
import { createFileRoute } from '@tanstack/react-router'

/**
 * A visual smoke test for the design system.
 *
 * If anything here renders unstyled, the Fragments stylesheet is not being
 * loaded (see the notes in src/styles/index.css) — that is the failure this
 * page exists to make obvious.
 */

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Stack direction="column" gap="sm">
      <Text as="h2" scale="lg" weight="semibold">
        {title}
      </Text>
      {children}
      <Separator />
    </Stack>
  )
}

function Components() {
  return (
    <Stack direction="column" gap="lg">
      <Text as="h1" scale="2xl" weight="bold">
        Components
      </Text>

      <Section title="Buttons">
        <Stack direction="row" gap="sm" wrap>
          <Button variant="solid" tone="accent">
            Solid
          </Button>
          <Button variant="soft">Soft</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="solid" tone="danger">
            Danger
          </Button>
          <Button variant="solid" disabled>
            Disabled
          </Button>
        </Stack>
      </Section>

      <Section title="Badges">
        <Stack direction="row" gap="sm" wrap>
          <Badge>Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="info" dot>
            With dot
          </Badge>
        </Stack>
      </Section>

      <Section title="Form controls">
        <Stack direction="column" gap="sm">
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Invalid" error placeholder="Something went wrong" />
          <Checkbox label="Send me updates" />
          <Switch label="Enable notifications" />
        </Stack>
      </Section>

      <Section title="Feedback">
        <Stack direction="column" gap="sm">
          <Alert tone="info">
            <Alert.Title>Heads up</Alert.Title>
            <Alert.Content>
              Tailwind utilities and Fragments components share one palette.
            </Alert.Content>
          </Alert>
          <Progress value={60} />
          <Skeleton />
        </Stack>
      </Section>

      <Section title="Token bridge">
        {/* Deliberately styled with Tailwind utilities, not Fragments props.
            These must match the Fragments components above — that is the
            proof the @theme bridge in src/styles/index.css is working. */}
        <div className="flex gap-4">
          <div className="rounded-md bg-accent p-4 text-bg">
            Tailwind <code>bg-accent</code>
          </div>
          <div className="rounded-md border border-border bg-bg-subtle p-4">
            Tailwind <code>bg-bg-subtle</code>
          </div>
        </div>
      </Section>

      <Card>
        <Card.Header>
          <Card.Title>Card</Card.Title>
          <Card.Description>Grouping related content.</Card.Description>
        </Card.Header>
        <Card.Body>
          <Text color="secondary">
            Every colour on this page derives from one seed in
            <code> src/styles/index.css</code>.
          </Text>
        </Card.Body>
      </Card>
    </Stack>
  )
}

export const Route = createFileRoute('/components')({ component: Components })
