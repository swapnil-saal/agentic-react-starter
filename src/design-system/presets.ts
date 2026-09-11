/**
 * The brand knobs, as data.
 *
 * This mirrors `brand.css` so the /brand playground can drive the same
 * variables at runtime. The CSS file remains the source of truth for what the
 * app actually ships — this is for previewing before you commit to values.
 */

export interface BrandKnobs {
  '--brand-hue': string
  '--brand-chroma': string
  '--neutral-hue': string
  '--neutral-chroma': string
  '--status-chroma': string
  '--brand-radius': string
  '--brand-border-width': string
  '--brand-font': string
  '--brand-font-heading': string
  '--brand-text-base': string
  '--brand-type-ratio': string
  '--brand-heading-weight': string
  '--brand-heading-tracking': string
  '--brand-density': string
  '--brand-shadow-strength': string
  '--brand-motion': string
  '--brand-ease': string
}

const SANS = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace"

export const PRESETS: Record<string, { label: string; knobs: BrandKnobs }> = {
  'deep-sea': {
    label: 'Deep Sea',
    knobs: {
      '--brand-hue': '175',
      '--brand-chroma': '0.13',
      '--neutral-hue': '175',
      '--neutral-chroma': '0.008',
      '--status-chroma': '0.14',
      '--brand-radius': '0.5rem',
      '--brand-border-width': '1px',
      '--brand-font': SANS,
      '--brand-font-heading': SANS,
      '--brand-text-base': '0.875rem',
      '--brand-type-ratio': '1.2',
      '--brand-heading-weight': '600',
      '--brand-heading-tracking': '-0.02em',
      '--brand-density': '1',
      '--brand-shadow-strength': '1',
      '--brand-motion': '1',
      '--brand-ease': 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
  brutalist: {
    label: 'Brutalist',
    knobs: {
      '--brand-hue': '55',
      '--brand-chroma': '0.19',
      '--neutral-hue': '0',
      '--neutral-chroma': '0',
      '--status-chroma': '0.18',
      '--brand-radius': '0',
      '--brand-border-width': '2px',
      '--brand-font': "'Helvetica Neue', Arial, sans-serif",
      '--brand-font-heading': "'Helvetica Neue', Arial, sans-serif",
      '--brand-text-base': '0.875rem',
      '--brand-type-ratio': '1.333',
      '--brand-heading-weight': '800',
      '--brand-heading-tracking': '-0.04em',
      '--brand-density': '1',
      '--brand-shadow-strength': '0',
      '--brand-motion': '0',
      '--brand-ease': 'linear',
    },
  },
  soft: {
    label: 'Soft',
    knobs: {
      '--brand-hue': '300',
      '--brand-chroma': '0.14',
      '--neutral-hue': '300',
      '--neutral-chroma': '0.012',
      '--status-chroma': '0.12',
      '--brand-radius': '1rem',
      '--brand-border-width': '1px',
      '--brand-font': "ui-rounded, 'SF Pro Rounded', system-ui, sans-serif",
      '--brand-font-heading':
        "ui-rounded, 'SF Pro Rounded', system-ui, sans-serif",
      '--brand-text-base': '0.9375rem',
      '--brand-type-ratio': '1.25',
      '--brand-heading-weight': '700',
      '--brand-heading-tracking': '-0.015em',
      '--brand-density': '1.15',
      '--brand-shadow-strength': '1.6',
      '--brand-motion': '1.3',
      '--brand-ease': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
  technical: {
    label: 'Technical',
    knobs: {
      '--brand-hue': '245',
      '--brand-chroma': '0.15',
      '--neutral-hue': '250',
      '--neutral-chroma': '0.01',
      '--status-chroma': '0.15',
      '--brand-radius': '0.25rem',
      '--brand-border-width': '1px',
      '--brand-font': `'Inter', ${SANS}`,
      '--brand-font-heading': `'Inter', ${SANS}`,
      '--brand-text-base': '0.8125rem',
      '--brand-type-ratio': '1.15',
      '--brand-heading-weight': '600',
      '--brand-heading-tracking': '-0.01em',
      '--brand-density': '0.9',
      '--brand-shadow-strength': '0.5',
      '--brand-motion': '0.7',
      '--brand-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  mono: {
    label: 'Mono',
    knobs: {
      '--brand-hue': '0',
      '--brand-chroma': '0',
      '--neutral-hue': '0',
      '--neutral-chroma': '0',
      '--status-chroma': '0.13',
      '--brand-radius': '0.125rem',
      '--brand-border-width': '1px',
      '--brand-font': MONO,
      '--brand-font-heading': MONO,
      '--brand-text-base': '0.8125rem',
      '--brand-type-ratio': '1.2',
      '--brand-heading-weight': '700',
      '--brand-heading-tracking': '-0.01em',
      '--brand-density': '0.95',
      '--brand-shadow-strength': '0',
      '--brand-motion': '0.6',
      '--brand-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
}

export const DEFAULT_PRESET = 'deep-sea'

/** Write knobs onto the document root as inline custom properties. */
export function applyKnobs(knobs: Partial<BrandKnobs>) {
  const root = document.documentElement
  for (const [key, value] of Object.entries(knobs)) {
    if (value !== undefined) root.style.setProperty(key, value)
  }
}

/** Drop every inline override, falling back to whatever brand.css ships. */
export function resetKnobs() {
  const root = document.documentElement
  for (const key of Object.keys(PRESETS[DEFAULT_PRESET].knobs)) {
    root.style.removeProperty(key)
  }
}

/** Render the current knob set as a `:root` block, ready to paste into
 *  brand.css or save as a new preset. */
export function toCss(knobs: BrandKnobs) {
  const lines = Object.entries(knobs).map(([k, v]) => `  ${k}: ${v};`)
  return `:root {\n${lines.join('\n')}\n}`
}
