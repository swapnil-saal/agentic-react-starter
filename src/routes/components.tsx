import { createFileRoute } from '@tanstack/react-router'
import { Inbox } from 'lucide-react'
import * as React from 'react'

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Alert,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  EmptyState,
  Field,
  FieldLabel,
  Input,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  NumberField,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Slider,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useToast,
} from '@/design-system'

/**
 * A visual smoke test for the design system. Every component appears here, so
 * a regression in the token layer is visible rather than silent.
 */
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Stack gap={3}>
      <Text as="h2" size="lg" weight="semibold">
        {title}
      </Text>
      {children}
      <Separator className="mt-2" />
    </Stack>
  )
}

function Components() {
  const toast = useToast()

  return (
    <Stack gap={8}>
      <Text as="h1" size="3xl" weight="bold">
        Components
      </Text>

      <Section title="Buttons">
        <Stack direction="row" gap={2} wrap align="center">
          <Button>Solid</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </Stack>
      </Section>

      <Section title="Badges">
        <Stack direction="row" gap={2} wrap>
          <Badge>Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success" dot>
            Success
          </Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="info" solid>
            Solid
          </Badge>
        </Stack>
      </Section>

      <Section title="Form controls">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" placeholder="you@example.com" />
          </Field>
          <Field>
            <FieldLabel>Invalid</FieldLabel>
            <Input aria-invalid placeholder="Something went wrong" />
          </Field>
          <Field>
            <FieldLabel>Message</FieldLabel>
            <Textarea placeholder="Tell us more" />
          </Field>
          <Stack gap={3}>
            <Field>
              <FieldLabel>Framework</FieldLabel>
              <Select defaultValue="react">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Quantity</FieldLabel>
              <NumberField defaultValue={3} min={0} />
            </Field>
          </Stack>
        </div>

        {/* Field wires label-to-control for us. Base UI's Checkbox, Switch and
            Radio render buttons rather than native inputs, so wrapping them in
            a bare <label> would look right but associate nothing. */}
        <Stack direction="row" gap={6} wrap align="center" className="mt-2">
          <Field className="flex-row items-center gap-2">
            <Checkbox defaultChecked />
            <FieldLabel>Send me updates</FieldLabel>
          </Field>
          <Field className="flex-row items-center gap-2">
            <Switch defaultChecked />
            <FieldLabel>Notifications</FieldLabel>
          </Field>
          <RadioGroup defaultValue="a" className="flex-row gap-4">
            <Field className="flex-row items-center gap-2">
              <RadioItem value="a" />
              <FieldLabel>Option A</FieldLabel>
            </Field>
            <Field className="flex-row items-center gap-2">
              <RadioItem value="b" />
              <FieldLabel>Option B</FieldLabel>
            </Field>
          </RadioGroup>
        </Stack>

        <Slider defaultValue={40} className="mt-2 max-w-sm" />
      </Section>

      <Section title="Overlays">
        <Stack direction="row" gap={2} wrap>
          <Dialog>
            <DialogTrigger render={<Button variant="outline">Dialog</Button>} />
            <DialogContent>
              <DialogTitle>Publish changes</DialogTitle>
              <DialogDescription>
                This makes your changes visible to everyone on the team.
              </DialogDescription>
              <DialogFooter>
                <Button variant="ghost">Cancel</Button>
                <Button>Publish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Popover</Button>}
            />
            <PopoverContent>
              <Text tone="muted">Anchored content that stays in context.</Text>
            </PopoverContent>
          </Popover>

          <Menu>
            <MenuTrigger render={<Button variant="outline">Menu</Button>} />
            <MenuContent>
              <MenuItem>Duplicate</MenuItem>
              <MenuItem>Rename</MenuItem>
              <MenuItem>Archive</MenuItem>
            </MenuContent>
          </Menu>

          <Tooltip>
            <TooltipTrigger
              render={<Button variant="outline">Tooltip</Button>}
            />
            <TooltipContent>Explains an unlabelled control</TooltipContent>
          </Tooltip>

          <Button
            variant="outline"
            onClick={() =>
              toast.add({
                title: 'Saved',
                description: 'Your changes have been stored.',
              })
            }
          >
            Toast
          </Button>
        </Stack>
      </Section>

      <Section title="Feedback">
        <Stack gap={3}>
          <Alert tone="info" title="Heads up">
            Utilities and components read from the same semantic tokens.
          </Alert>
          <Alert tone="danger" title="Something failed">
            Say what broke, in plain language, and offer the next step.
          </Alert>
          <Progress value={62} />
          <Stack direction="row" gap={3} align="center">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </Stack>
        </Stack>
      </Section>

      <Section title="Navigation">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTab value="overview">Overview</TabsTab>
            <TabsTab value="activity">Activity</TabsTab>
            <TabsTab value="settings">Settings</TabsTab>
          </TabsList>
          <TabsPanel value="overview">
            <Text tone="muted">The indicator slides between tabs.</Text>
          </TabsPanel>
          <TabsPanel value="activity">
            <Text tone="muted">Second panel.</Text>
          </TabsPanel>
          <TabsPanel value="settings">
            <Text tone="muted">Third panel.</Text>
          </TabsPanel>
        </Tabs>

        <Accordion className="mt-4">
          <AccordionItem value="one">
            <AccordionTrigger>What is owned source?</AccordionTrigger>
            <AccordionPanel>
              Every component lives in this repo. Change any of them directly.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>How do I retheme?</AccordionTrigger>
            <AccordionPanel>
              Edit design-system/theme.css. No component needs to change.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Data">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Ada Lovelace</TableCell>
              <TableCell>Engineer</TableCell>
              <TableCell>
                <Badge tone="success" dot>
                  Active
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Alan Turing</TableCell>
              <TableCell>Researcher</TableCell>
              <TableCell>
                <Badge tone="warning">Pending</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>

      <Section title="Empty state">
        <EmptyState
          icon={<Inbox />}
          title="No messages yet"
          description="When someone writes to you, their message will appear here."
          action={<Button size="sm">Compose</Button>}
        />
      </Section>

      <Section title="Token bridge">
        {/* Styled with raw Tailwind utilities, not component props. These must
            match the components above — that is the proof the @theme bridge in
            styles/index.css is wired to the same semantic tokens. */}
        <div className="flex flex-wrap gap-3">
          <div className="rounded-md bg-accent px-4 py-3 text-on-accent">
            bg-accent
          </div>
          <div className="rounded-md border border-border bg-surface px-4 py-3 text-fg">
            bg-surface
          </div>
          <div className="rounded-md bg-bg-subtle px-4 py-3 text-fg-muted">
            bg-bg-subtle
          </div>
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        </div>
      </Section>

      <Card>
        <CardHeader>
          <CardTitle>One source of colour</CardTitle>
        </CardHeader>
        <CardBody>
          <Text tone="muted">
            Every colour here resolves from{' '}
            <code className="font-mono text-sm">design-system/theme.css</code>.
          </Text>
        </CardBody>
      </Card>
    </Stack>
  )
}

export const Route = createFileRoute('/components')({ component: Components })
