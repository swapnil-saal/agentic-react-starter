# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-09-11

First release.

### The design system

- ~37 components as owned source in `src/design-system/ui`, built on
  [Base UI](https://base-ui.com) headless primitives and styled with
  Tailwind v4 + CVA. No third-party component library.
- Four token layers — brand knobs → derived scales → semantic meaning →
  Tailwind utilities — each referencing only the one above it.
- A single-file brand layer: ~17 knobs in `brand.css` drive colour, shape,
  typography, density, elevation and motion across the whole app. Colour
  ramps are generated in OKLCH from a hue plus a chroma.
- Five presets: Verdant (default), Deep Sea, Brutalist, Soft, Technical, Mono.
- `/brand` settings page with a live WCAG contrast audit and `brand.css` export.
- One motion vocabulary in `ui/_motion.ts`; `--brand-motion: 0` makes every
  transition in the app instant, and `prefers-reduced-motion` overrides any
  brand value.

### The application

- Vite 8, React 19, TypeScript 6.
- TanStack Router with file-based, fully typed routes, plus route-level error
  and not-found handling.
- TanStack Query with a worked example: typed queries, an optimistic mutation
  with rollback, and an MSW mock API so it runs with no backend.
- React Hook Form + Zod, including boot-time environment validation.
- Responsive app shell with a drawer navigation below the `md` breakpoint.

### For coding agents

- Four project skills plus `CLAUDE.md` and `ADDING-A-COMPONENT.md`.
- `pnpm check:tokens` fails the build on hardcoded colours, Tailwind palette
  classes, arbitrary pixel values, literal durations and Tailwind v3 variable
  syntax.
- CodeGraph indexed over MCP; Ponytail installed at project scope.
- `pnpm doctor` verifies and repairs the toolchain that `pnpm install` cannot.
- `pnpm reset` strips the example screens to leave a blank app.
- 16 end-to-end tests, several of which guard the design system itself rather
  than the application.

[1.0.0]: https://github.com/swapnil-saal/agentic-react-starter/releases/tag/v1.0.0
