/**
 * Shared motion vocabulary.
 *
 * Every animated component composes from these instead of writing its own
 * transition classes. That is what keeps movement consistent across the app —
 * and it means the brand's motion knobs actually reach everything, because all
 * of these read `--duration-*` and `--ease-out`, which are derived from
 * `--brand-motion` and `--brand-ease` in brand.css.
 *
 * Set `--brand-motion: 0` and every transition below becomes instant.
 * A user with `prefers-reduced-motion` gets that regardless of the brand.
 *
 * IMPORTANT: variables in Tailwind v4 utilities use parentheses —
 * `duration-(--duration-fast)`, never `duration-[--duration-fast]`. The
 * bracket form emits invalid CSS and silently does nothing.
 */

/**
 * Colour/background/border changes: hover, focus, selection.
 *
 * Uses the monotonic --ease-state, never --ease-out. An overshooting brand
 * curve would push the colour past its target and back, which reads as a
 * flicker every time you hover.
 */
export const transitionColors =
  'transition-colors duration-(--duration-fast) ease-(--ease-state)'

/**
 * Colour AND transform together, for controls that tint on hover and depress
 * on click — buttons, toggles, steppers.
 *
 * This exists because `transition-colors` and `transition-transform` are the
 * same Tailwind group: put both on one element and `cn` keeps only the last,
 * silently dropping the other. One combined property list avoids that.
 */
export const transitionControl = [
  'transition-[color,background-color,border-color,box-shadow,transform]',
  'duration-(--duration-fast) ease-(--ease-state)',
].join(' ')

/** Movement and scaling: thumbs, indicators, chevrons. */
export const transitionTransform =
  'transition-transform duration-(--duration-base) ease-(--ease-out)'

/** Anything multi-property, e.g. a surface that fades and scales at once. */
export const transitionAll =
  'transition-all duration-(--duration-base) ease-(--ease-out)'

/** Opacity only. */
export const transitionOpacity =
  'transition-opacity duration-(--duration-base) ease-(--ease-state)'

/**
 * Tactile feedback on press. Deliberately subtle — a button that visibly
 * shrinks reads as a toy. Requires a transition that includes `transform`;
 * pair it with `transitionControl` or `transitionTransform`.
 */
export const pressable = 'active:scale-[0.97]'

/**
 * Enter/exit for floating surfaces: menus, selects, popovers, tooltips,
 * comboboxes. Base UI sets `data-starting-style` on mount and
 * `data-ending-style` on unmount; we animate between those and the resting
 * state, which is what lets an exit animation finish before removal.
 */
export const popSurface = [
  transitionAll,
  'data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
  'data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
]

/** Enter/exit for a centred modal — scales from slightly further out, since a
 *  large surface needs more travel to read as "arriving". */
export const modalSurface = [
  transitionAll,
  'data-[starting-style]:scale-[0.96] data-[starting-style]:opacity-0',
  'data-[ending-style]:scale-[0.96] data-[ending-style]:opacity-0',
]

/** The scrim behind a modal or drawer. Fades only; never moves. */
export const scrim = [
  transitionOpacity,
  'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
]

/** Small indicators that pop in: checkbox ticks, radio dots, menu checks. */
export const indicator = [
  transitionAll,
  'data-[starting-style]:scale-50 data-[starting-style]:opacity-0',
  'data-[ending-style]:scale-50 data-[ending-style]:opacity-0',
]

/** Height animation for accordion and collapsible panels. Base UI publishes
 *  the measured height as a custom property; the caller supplies which one. */
export const collapsePanel = (heightVar: string) => [
  `h-(${heightVar})`,
  'overflow-hidden',
  'transition-[height] duration-(--duration-base) ease-(--ease-out)',
  'data-[starting-style]:h-0 data-[ending-style]:h-0',
]
