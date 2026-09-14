/**
 * Shared accessibility types.
 *
 * Some controls convey their whole meaning through a value — a progress bar, a
 * slider — and render no text of their own. Without a label a screen reader
 * announces "62%" with no indication of 62% of what, and axe flags it. There is
 * no sensible default to fall back on, so the type makes the caller supply one
 * and the mistake becomes a compile error rather than an audit finding.
 */
export type Labelled =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-labelledby': string; 'aria-label'?: never }
