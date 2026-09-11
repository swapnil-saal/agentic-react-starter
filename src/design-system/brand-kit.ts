/**
 * Design-basics helpers for the brand playground.
 *
 * These encode conventions rather than inventing them: colour harmonies from
 * classic colour theory, the musical modular scale used for type, and the WCAG
 * contrast thresholds. The playground uses them so a brand is configured from
 * named design decisions instead of arbitrary numbers.
 */
import type { BrandKnobs } from './presets'

/* ── Colour harmony ──────────────────────────────────────────────────────────
   The relationship between the brand hue and the hue tinting the greys.
   Keeping the neutrals related to the brand is what makes a palette read as
   designed rather than assembled. */

export type Harmony =
  'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'custom'

export const HARMONIES: {
  value: Harmony
  label: string
  hint: string
  offset: number | null
}[] = [
  {
    value: 'monochromatic',
    label: 'Monochromatic',
    hint: 'Greys share the brand hue. Calmest and hardest to get wrong.',
    offset: 0,
  },
  {
    value: 'analogous',
    label: 'Analogous',
    hint: 'Greys sit 30° away. Warmer and subtler than monochromatic.',
    offset: 30,
  },
  {
    value: 'complementary',
    label: 'Complementary',
    hint: 'Greys oppose the brand at 180°, so the accent pops hardest.',
    offset: 180,
  },
  {
    value: 'triadic',
    label: 'Triadic',
    hint: 'Greys sit 120° away. Balanced, with visible tension.',
    offset: 120,
  },
  {
    value: 'custom',
    label: 'Custom',
    hint: 'Set the neutral hue by hand.',
    offset: null,
  },
]

export function neutralHueFor(brandHue: number, harmony: Harmony): number {
  const entry = HARMONIES.find((h) => h.value === harmony)
  if (!entry || entry.offset === null) return brandHue
  return (brandHue + entry.offset) % 360
}

/* ── Type scale ──────────────────────────────────────────────────────────────
   The modular scale is borrowed from musical intervals. A bigger ratio means
   more contrast between body copy and headings — dramatic for marketing,
   cramped for dense tools. */

export const TYPE_RATIOS: { value: string; label: string; hint: string }[] = [
  { value: '1.067', label: 'Minor second', hint: 'Very tight — dense data UI' },
  { value: '1.125', label: 'Major second', hint: 'Restrained' },
  { value: '1.15', label: 'Minor third (flat)', hint: 'Compact product UI' },
  { value: '1.2', label: 'Minor third', hint: 'Balanced — a safe default' },
  { value: '1.25', label: 'Major third', hint: 'Confident' },
  { value: '1.333', label: 'Perfect fourth', hint: 'Editorial' },
  { value: '1.414', label: 'Augmented fourth', hint: 'Dramatic' },
  { value: '1.5', label: 'Perfect fifth', hint: 'Poster-like' },
  { value: '1.618', label: 'Golden ratio', hint: 'Maximum drama' },
]

/* ── Easing ──────────────────────────────────────────────────────────────────  */

export const EASINGS: { value: string; label: string; hint: string }[] = [
  {
    value: 'cubic-bezier(0.16, 1, 0.3, 1)',
    label: 'Confident',
    hint: 'Fast out, settles gently. The safest default.',
  },
  {
    value: 'cubic-bezier(0.4, 0, 0.2, 1)',
    label: 'Neutral',
    hint: 'Even acceleration. Unobtrusive.',
  },
  {
    value: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    label: 'Playful',
    hint: 'Overshoots slightly. Consumer products.',
  },
  {
    value: 'linear',
    label: 'Mechanical',
    hint: 'No easing. Reads as machinery, not interface.',
  },
]

/* ── Contrast ────────────────────────────────────────────────────────────────
   WCAG 2.2 relative luminance. Colours are rasterised through a canvas so any
   colour space — including the OKLCH the ramps are generated in — resolves to
   real sRGB before measuring. Parsing the string directly is the trap: a
   computed `oklch(...)` value read as `rgb(...)` produces plausible-looking
   nonsense. */

let ctx: CanvasRenderingContext2D | null = null

function toRgb(color: string): [number, number, number] {
  if (!ctx) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    ctx = canvas.getContext('2d', { willReadFrequently: true })
  }
  if (!ctx) return [0, 0, 0]
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const d = ctx.getImageData(0, 0, 1, 1).data
  return [d[0], d[1], d[2]]
}

function luminance(color: string) {
  const [r, g, b] = toRgb(color).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export type ContrastLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail'

/** WCAG 2.2: 7 AAA, 4.5 AA for body text, 3 for large text and UI boundaries. */
export function gradeText(ratio: number): ContrastLevel {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA Large'
  return 'Fail'
}

/** Read a resolved custom property off the document root. */
export function tokenValue(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
}

/* ── CSS generation ──────────────────────────────────────────────────────────  */

const SECTIONS: { title: string; keys: (keyof BrandKnobs)[] }[] = [
  {
    title: 'COLOUR — ramps are generated in OKLCH from a hue + chroma',
    keys: [
      '--brand-hue',
      '--brand-chroma',
      '--neutral-hue',
      '--neutral-chroma',
      '--status-chroma',
    ],
  },
  { title: 'SHAPE', keys: ['--brand-radius', '--brand-border-width'] },
  {
    title: 'TYPOGRAPHY',
    keys: [
      '--brand-font',
      '--brand-font-heading',
      '--brand-text-base',
      '--brand-type-ratio',
      '--brand-heading-weight',
      '--brand-heading-tracking',
    ],
  },
  {
    title: 'DENSITY — scales control heights and the whole spacing scale',
    keys: ['--brand-density'],
  },
  { title: 'ELEVATION', keys: ['--brand-shadow-strength'] },
  {
    title: 'MOTION — 0 disables every transition',
    keys: ['--brand-motion', '--brand-ease'],
  },
]

/**
 * Produce a complete, ready-to-save `brand.css`.
 *
 * Emitted with the section structure and the status hues the file needs to
 * stand on its own, so the output can replace `src/design-system/brand.css`
 * wholesale rather than being merged by hand.
 */
export function generateBrandCss(knobs: BrandKnobs, name = 'Custom') {
  const lines: string[] = [
    '/* ═══════════════════════════════════════════════════════════════════════',
    `   BRAND — ${name}`,
    '',
    '   Generated from the /brand playground. This is the only file a project',
    '   needs to edit: every token scale, component and utility derives from',
    '   the values below.',
    '   ═══════════════════════════════════════════════════════════════════════ */',
    '',
    ':root {',
  ]

  for (const section of SECTIONS) {
    lines.push(`  /* ── ${section.title} ── */`)
    for (const key of section.keys) {
      lines.push(`  ${key}: ${knobs[key]};`)
    }
    if (section.title.startsWith('COLOUR')) {
      lines.push('')
      lines.push('  /* Status hues stay recognisable across every brand. */')
      lines.push('  --danger-hue: 27;')
      lines.push('  --success-hue: 155;')
      lines.push('  --warning-hue: 75;')
      lines.push('  --info-hue: 230;')
    }
    lines.push('')
  }

  lines.push('  /* Monospace is independent of the brand face. */')
  lines.push(
    '  --brand-font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;',
  )
  lines.push('}')
  lines.push('')
  return lines.join('\n')
}
