import { createFileRoute } from '@tanstack/react-router'
import { Check, Copy, RotateCcw } from 'lucide-react'
import * as React from 'react'

import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  FieldLabel,
  Input,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  Stack,
  Switch,
  Text,
} from '@/design-system'
import {
  DEFAULT_PRESET,
  PRESETS,
  applyKnobs,
  resetKnobs,
  toCss,
  type BrandKnobs,
} from '@/design-system/presets'

/**
 * Live brand playground.
 *
 * Everything on this page is driven by the same custom properties that
 * `brand.css` sets at build time — this just writes them onto the document
 * root instead, so you can see the whole UI respond before committing values.
 *
 * The preview panel is the real component library, not a mock. If it looks
 * right here, it looks right everywhere.
 */

/** One labelled numeric control bound to a brand knob. */
function Knob({
  label,
  hint,
  value,
  min,
  max,
  step,
  suffix = '',
  onChange,
}: {
  label: string
  hint?: string
  value: number
  min: number
  max: number
  step: number
  suffix?: string
  onChange: (n: number) => void
}) {
  return (
    <Stack gap={1}>
      <div className="flex items-baseline justify-between gap-2">
        <Text size="sm" weight="medium">
          {label}
        </Text>
        <Text size="sm" tone="subtle" mono>
          {value}
          {suffix}
        </Text>
      </div>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
        aria-label={label}
      />
      {hint && (
        <Text size="xs" tone="subtle">
          {hint}
        </Text>
      )}
    </Stack>
  )
}

const EASINGS = [
  { value: 'cubic-bezier(0.16, 1, 0.3, 1)', label: 'Confident (ease-out)' },
  { value: 'cubic-bezier(0.4, 0, 0.2, 1)', label: 'Neutral' },
  { value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'Playful (overshoot)' },
  { value: 'linear', label: 'Mechanical' },
]

function BrandPlayground() {
  const [preset, setPreset] = React.useState(DEFAULT_PRESET)
  const [knobs, setKnobs] = React.useState<BrandKnobs>(
    PRESETS[DEFAULT_PRESET].knobs,
  )
  const [copied, setCopied] = React.useState(false)

  // Apply on every change. Writing straight to the root element is what makes
  // this a genuine preview rather than a simulation.
  React.useEffect(() => {
    applyKnobs(knobs)
  }, [knobs])

  // Leaving the page must not leave the rest of the app restyled.
  React.useEffect(() => resetKnobs, [])

  const set = (key: keyof BrandKnobs, value: string) =>
    setKnobs((prev) => ({ ...prev, [key]: value }))

  const num = (key: keyof BrandKnobs) => parseFloat(knobs[key]) || 0

  const loadPreset = (name: string) => {
    setPreset(name)
    setKnobs(PRESETS[name].knobs)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(toCss(knobs))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Stack gap={8}>
      <Stack gap={2}>
        <Text as="h1" size="3xl" weight="bold">
          Brand
        </Text>
        <Text tone="muted" className="max-w-2xl">
          Every value below lives in{' '}
          <code className="font-mono text-sm">design-system/brand.css</code>.
          Change one and the whole app follows — the preview on the right is the
          real component library, not a mock.
        </Text>
      </Stack>

      <Stack direction="row" gap={2} wrap align="center">
        {Object.entries(PRESETS).map(([key, { label }]) => (
          <Button
            key={key}
            size="sm"
            variant={preset === key ? 'solid' : 'outline'}
            onClick={() => loadPreset(key)}
          >
            {label}
          </Button>
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => loadPreset(DEFAULT_PRESET)}
        >
          <RotateCcw />
          Reset
        </Button>
      </Stack>

      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        {/* ── Controls ──────────────────────────────────────────────────── */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Knobs</CardTitle>
          </CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Stack gap={4}>
                <Text size="xs" weight="semibold" tone="subtle">
                  COLOUR
                </Text>
                <Knob
                  label="Brand hue"
                  hint="20 red · 140 green · 175 teal · 230 blue · 270 violet"
                  value={num('--brand-hue')}
                  min={0}
                  max={360}
                  step={1}
                  suffix="°"
                  onChange={(n) => set('--brand-hue', String(n))}
                />
                <Knob
                  label="Brand chroma"
                  hint="0 grey · 0.13 vivid · 0.25 neon"
                  value={num('--brand-chroma')}
                  min={0}
                  max={0.3}
                  step={0.005}
                  onChange={(n) => set('--brand-chroma', String(n))}
                />
                <Knob
                  label="Neutral tint"
                  hint="How much brand hue bleeds into the greys"
                  value={num('--neutral-chroma')}
                  min={0}
                  max={0.03}
                  step={0.001}
                  onChange={(n) => set('--neutral-chroma', String(n))}
                />
              </Stack>

              <Separator />

              <Stack gap={4}>
                <Text size="xs" weight="semibold" tone="subtle">
                  SHAPE
                </Text>
                <Knob
                  label="Radius"
                  hint="0 sharp · 0.5 default · 1.5 pillowy"
                  value={num('--brand-radius')}
                  min={0}
                  max={1.5}
                  step={0.0625}
                  suffix="rem"
                  onChange={(n) => set('--brand-radius', `${n}rem`)}
                />
                <Knob
                  label="Border width"
                  value={num('--brand-border-width')}
                  min={0}
                  max={4}
                  step={1}
                  suffix="px"
                  onChange={(n) => set('--brand-border-width', `${n}px`)}
                />
                <Knob
                  label="Shadow strength"
                  hint="0 flat · 1 default · 2 floating"
                  value={num('--brand-shadow-strength')}
                  min={0}
                  max={2.5}
                  step={0.1}
                  onChange={(n) => set('--brand-shadow-strength', String(n))}
                />
              </Stack>

              <Separator />

              <Stack gap={4}>
                <Text size="xs" weight="semibold" tone="subtle">
                  TYPE &amp; DENSITY
                </Text>
                <Knob
                  label="Base text size"
                  value={num('--brand-text-base')}
                  min={0.75}
                  max={1.125}
                  step={0.0625}
                  suffix="rem"
                  onChange={(n) => set('--brand-text-base', `${n}rem`)}
                />
                <Knob
                  label="Type scale ratio"
                  hint="1.125 restrained · 1.333 dramatic"
                  value={num('--brand-type-ratio')}
                  min={1.05}
                  max={1.5}
                  step={0.005}
                  onChange={(n) => set('--brand-type-ratio', String(n))}
                />
                <Knob
                  label="Density"
                  hint="Scales control heights and all spacing together"
                  value={num('--brand-density')}
                  min={0.8}
                  max={1.3}
                  step={0.05}
                  onChange={(n) => set('--brand-density', String(n))}
                />
              </Stack>

              <Separator />

              <Stack gap={4}>
                <Text size="xs" weight="semibold" tone="subtle">
                  MOTION
                </Text>
                <Knob
                  label="Motion"
                  hint="0 disables every transition app-wide"
                  value={num('--brand-motion')}
                  min={0}
                  max={2}
                  step={0.1}
                  suffix="×"
                  onChange={(n) => set('--brand-motion', String(n))}
                />
                <Field>
                  <FieldLabel>Easing</FieldLabel>
                  <Select
                    value={knobs['--brand-ease']}
                    onValueChange={(v) => set('--brand-ease', String(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EASINGS.map((e) => (
                        <SelectItem key={e.value} value={e.value}>
                          {e.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </Stack>

              <Separator />

              <Button onClick={copy} variant="outline" block>
                {copied ? <Check /> : <Copy />}
                {copied ? 'Copied' : 'Copy as CSS'}
              </Button>
              <Text size="xs" tone="subtle">
                Paste into <code className="font-mono">brand.css</code> to make
                it permanent.
              </Text>
            </Stack>
          </CardBody>
        </Card>

        {/* ── Live preview ──────────────────────────────────────────────── */}
        <Stack gap={6}>
          <Card>
            <CardHeader>
              <CardTitle>Live preview</CardTitle>
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Stack direction="row" gap={2} wrap align="center">
                  <Button>Primary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="subtle">Subtle</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </Stack>

                <Stack direction="row" gap={2} wrap>
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input placeholder="you@example.com" />
                  </Field>
                  <Field>
                    <FieldLabel>Invalid</FieldLabel>
                    <Input aria-invalid placeholder="Check this field" />
                  </Field>
                </div>

                <Stack direction="row" gap={6} wrap align="center">
                  <Field className="flex-row items-center gap-2">
                    <Checkbox defaultChecked />
                    <FieldLabel>Checkbox</FieldLabel>
                  </Field>
                  <Field className="flex-row items-center gap-2">
                    <Switch defaultChecked />
                    <FieldLabel>Switch</FieldLabel>
                  </Field>
                </Stack>

                <Progress value={62} />

                <Alert tone="info" title="Alert">
                  Status colours keep their own hues so meaning survives any
                  brand.
                </Alert>
              </Stack>
            </CardBody>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            {(['accent', 'success', 'danger'] as const).map((tone) => (
              <Card key={tone}>
                <CardBody className="pt-5">
                  <Stack gap={2}>
                    <div
                      className="h-12 rounded-md"
                      style={{ background: `var(--ds-${tone})` }}
                    />
                    <Text size="xs" tone="subtle" mono>
                      --ds-{tone}
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card>
            <CardBody className="pt-5">
              <Stack gap={2}>
                <Text as="h2" size="2xl" weight="bold">
                  Type scale
                </Text>
                <Text size="lg">Large — section heading</Text>
                <Text size="md">Medium — card title</Text>
                <Text tone="muted">
                  Base — body copy, the size most of the app is set in.
                </Text>
                <Text size="sm" tone="muted">
                  Small — helper text and metadata.
                </Text>
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </div>
    </Stack>
  )
}

export const Route = createFileRoute('/brand')({ component: BrandPlayground })
