import { createFileRoute } from '@tanstack/react-router'
import { Check, Copy, Download, RotateCcw } from 'lucide-react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@/design-system'
import {
  EASINGS,
  HARMONIES,
  TYPE_RATIOS,
  generateBrandCss,
  gradeText,
  neutralHueFor,
  tokenContrast,
  tokenValue,
  type Harmony,
} from '@/design-system/brand-kit'
import {
  DEFAULT_PRESET,
  PRESETS,
  applyKnobs,
  resetKnobs,
  type BrandKnobs,
} from '@/design-system/presets'

/**
 * Brand settings.
 *
 * Writes the same custom properties `brand.css` sets at build time, straight
 * onto the document root — so the preview is the real component library under
 * the real tokens, not a mock. Export produces a complete brand.css.
 */

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

/** Live WCAG audit of the pairings a brand can realistically break. */
function ContrastAudit({ signal }: { signal: string }) {
  const [rows, setRows] = React.useState<
    { label: string; ratio: number | null; need: number }[]
  >([])

  React.useEffect(() => {
    // Deferred a frame so the knobs applied by the parent effect have been
    // committed before anything is measured.
    const id = requestAnimationFrame(() => {
      const borderless = parseFloat(tokenValue('--border-width')) === 0

      const pairs: { label: string; fg: string; bg: string; need: number }[] = [
        {
          label: 'Primary button text',
          fg: '--ds-on-accent',
          bg: '--ds-accent',
          need: 4.5,
        },
        {
          label: 'Accent text on page',
          fg: '--ds-accent',
          bg: '--ds-bg',
          need: 4.5,
        },
        { label: 'Body text', fg: '--ds-fg-muted', bg: '--ds-bg', need: 4.5 },
        { label: 'Heading text', fg: '--ds-fg', bg: '--ds-bg', need: 4.5 },
        // A field's boundary can come from its border OR its fill. Only hold
        // the fill to 3:1 when the brand is borderless and fill is all there
        // is — otherwise every bordered brand fails a check it passes.
        ...(borderless
          ? [
              {
                label: 'Field fill vs page (borderless)',
                fg: '--ds-field',
                bg: '--ds-bg',
                need: 3,
              },
            ]
          : []),
        {
          label: 'Danger text',
          fg: '--ds-danger-fg',
          bg: '--ds-danger-subtle',
          need: 4.5,
        },
      ]

      setRows(
        pairs.map((p) => ({
          label: p.label,
          ratio: tokenContrast(p.fg, p.bg),
          need: p.need,
        })),
      )
    })
    return () => cancelAnimationFrame(id)
  }, [signal])

  // A pairing that could not be measured is not a failure — saying so is more
  // honest than reporting a confident 1.00.
  const failing = rows.filter(
    (r) => r.ratio !== null && r.ratio < r.need,
  ).length
  const unmeasured = rows.filter((r) => r.ratio === null).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrast audit</CardTitle>
        <Text size="sm" tone="muted">
          WCAG 2.2 — 4.5:1 for text, 3:1 for a UI boundary. Measured live from
          the rendered tokens.
        </Text>
      </CardHeader>
      <CardBody>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pairing</TableHead>
              <TableHead>Ratio</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              const pass = r.ratio !== null && r.ratio >= r.need
              const grade =
                r.ratio === null
                  ? 'No reading'
                  : r.need === 3
                    ? pass
                      ? 'Pass'
                      : 'Fail'
                    : gradeText(r.ratio)
              return (
                <TableRow key={r.label}>
                  <TableCell>{r.label}</TableCell>
                  <TableCell>
                    <Text mono size="sm">
                      {r.ratio === null ? '—' : r.ratio.toFixed(2)}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        r.ratio === null
                          ? 'neutral'
                          : pass
                            ? 'success'
                            : 'danger'
                      }
                      dot
                    >
                      {grade}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {failing > 0 && (
          <Alert tone="warning" title="Not shippable yet" className="mt-4">
            {failing} pairing{failing > 1 ? 's' : ''} below the threshold.
            Darkening the accent or raising text contrast usually fixes it.
          </Alert>
        )}
        {unmeasured > 0 && (
          <Alert
            tone="info"
            title="Some pairings could not be read"
            className="mt-4"
          >
            {unmeasured} token{unmeasured > 1 ? 's' : ''} did not resolve to a
            colour this browser can measure. This is a reporting limitation, not
            a contrast failure.
          </Alert>
        )}
      </CardBody>
    </Card>
  )
}

function BrandPlayground() {
  const [preset, setPreset] = React.useState(DEFAULT_PRESET)
  const [knobs, setKnobs] = React.useState<BrandKnobs>(
    PRESETS[DEFAULT_PRESET].knobs,
  )
  const [harmony, setHarmony] = React.useState<Harmony>('custom')
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    applyKnobs(knobs)
  }, [knobs])

  // Leaving must not leave the rest of the app restyled.
  React.useEffect(() => resetKnobs, [])

  const set = (key: keyof BrandKnobs, value: string) =>
    setKnobs((prev) => ({ ...prev, [key]: value }))

  const num = (key: keyof BrandKnobs) => parseFloat(knobs[key]) || 0

  // Changing the brand hue keeps the chosen harmony by moving the neutral with it.
  const setHue = (hue: number) =>
    setKnobs((prev) => ({
      ...prev,
      '--brand-hue': String(hue),
      ...(harmony === 'custom'
        ? {}
        : { '--neutral-hue': String(neutralHueFor(hue, harmony)) }),
    }))

  const applyHarmony = (next: Harmony) => {
    setHarmony(next)
    if (next !== 'custom') {
      set('--neutral-hue', String(neutralHueFor(num('--brand-hue'), next)))
    }
  }

  const loadPreset = (name: string) => {
    setPreset(name)
    setKnobs(PRESETS[name].knobs)
    setHarmony('custom')
  }

  const css = generateBrandCss(knobs, PRESETS[preset]?.label ?? 'Custom')

  const copy = async () => {
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    const blob = new Blob([css], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'brand.css'
    a.click()
    URL.revokeObjectURL(url)
  }

  const signal = JSON.stringify(knobs)

  return (
    <Stack gap={8}>
      <Stack gap={2}>
        <Text as="h1" size="3xl" weight="bold">
          Brand
        </Text>
        <Text tone="muted" className="max-w-2xl">
          Settings for the whole app. Everything here writes the custom
          properties in{' '}
          <code className="font-mono text-sm">design-system/brand.css</code> —
          the preview below is the real component library, not a mock. Export
          when it looks right.
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

      <div className="grid gap-6 lg:grid-cols-[21rem_1fr]">
        <Stack gap={6}>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Stack gap={4}>
                  <Text size="xs" weight="semibold" tone="subtle">
                    COLOUR
                  </Text>
                  <Knob
                    label="Brand hue"
                    hint="20 red · 60 amber · 112 lime · 155 green · 230 blue · 270 violet"
                    value={num('--brand-hue')}
                    min={0}
                    max={360}
                    step={1}
                    suffix="°"
                    onChange={setHue}
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

                  <Field>
                    <FieldLabel>Neutral harmony</FieldLabel>
                    <Select
                      value={harmony}
                      onValueChange={(v) => applyHarmony(v as Harmony)}
                      items={Object.fromEntries(
                        HARMONIES.map((h) => [h.value, h.label]),
                      )}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HARMONIES.map((h) => (
                          <SelectItem key={h.value} value={h.value}>
                            {h.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Text size="xs" tone="subtle">
                      {HARMONIES.find((h) => h.value === harmony)?.hint}
                    </Text>
                  </Field>

                  <Knob
                    label="Neutral hue"
                    value={num('--neutral-hue')}
                    min={0}
                    max={360}
                    step={1}
                    suffix="°"
                    onChange={(n) => {
                      setHarmony('custom')
                      set('--neutral-hue', String(n))
                    }}
                  />
                  <Knob
                    label="Neutral tint"
                    hint="How strongly that hue bleeds into the greys"
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
                    hint="0 is borderless — separation then comes from fill and shadow"
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
                  <Field>
                    <FieldLabel>Type scale</FieldLabel>
                    <Select
                      value={knobs['--brand-type-ratio']}
                      onValueChange={(v) =>
                        set('--brand-type-ratio', String(v))
                      }
                      items={Object.fromEntries(
                        TYPE_RATIOS.map((r) => [
                          r.value,
                          `${r.label} · ${r.value}`,
                        ]),
                      )}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_RATIOS.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label} · {r.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Text size="xs" tone="subtle">
                      {TYPE_RATIOS.find(
                        (r) => r.value === knobs['--brand-type-ratio'],
                      )?.hint ?? 'Custom ratio'}
                    </Text>
                  </Field>
                  <Knob
                    label="Density"
                    hint="Scales control heights and every spacing utility"
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
                      items={Object.fromEntries(
                        EASINGS.map((e) => [e.value, e.label]),
                      )}
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
                    <Text size="xs" tone="subtle">
                      {EASINGS.find((e) => e.value === knobs['--brand-ease'])
                        ?.hint ?? 'Custom curve'}
                    </Text>
                  </Field>
                </Stack>

                <Separator />

                <Stack gap={2}>
                  <Button onClick={download} block>
                    <Download />
                    Download brand.css
                  </Button>
                  <Button onClick={copy} variant="outline" block>
                    {copied ? <Check /> : <Copy />}
                    {copied ? 'Copied' : 'Copy CSS'}
                  </Button>
                  <Text size="xs" tone="subtle">
                    Save over{' '}
                    <code className="font-mono">design-system/brand.css</code>.
                  </Text>
                </Stack>
              </Stack>
            </CardBody>
          </Card>
        </Stack>

        <Stack gap={6}>
          <ContrastAudit signal={signal} />

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

                <Progress aria-label="Preview progress" value={62} />

                <Alert tone="info" title="Alert">
                  Status hues stay fixed so meaning survives any brand.
                </Alert>
              </Stack>
            </CardBody>
          </Card>

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
