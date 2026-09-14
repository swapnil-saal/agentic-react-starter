# Contributing

Thanks for considering it. This project has a narrow thesis, so the most
useful thing you can do first is read [what it is](#what-this-project-is) —
a good change here is one that strengthens the loop rather than widening
the surface.

## What this project is

A React starter whose differentiator is a **closed verification loop for
coding agents**: components you own, design rules enforced mechanically, and
tests an agent can run to check its own work.

It is deliberately **not** a full-stack framework. Proposals that add auth,
an ORM, a server runtime or a second component library are likely to be
declined — not because they are bad, but because they are someone else's
project.

## Getting set up

```bash
pnpm install
cp .env.example .env
pnpm doctor          # installs/verifies the agent toolchain
pnpm dev
```

`pnpm doctor` restores the things `pnpm install` cannot: the global CodeGraph
binary, the Claude plugin, the code index and Playwright's browsers.

## Before you open a pull request

```bash
pnpm check           # types, lint, design tokens, unit tests
pnpm e2e             # anything visual
```

Both run in CI, so a PR that fails them will not merge. Running them locally
first is faster than finding out from the runner.

## The rules that are enforced, not suggested

`pnpm check:tokens` fails the build on the six ways a component quietly stops
responding to the brand:

| Rule                                      | Why                                         |
| ----------------------------------------- | ------------------------------------------- |
| hex codes, `rgb()`/`hsl()` literals       | bypass the semantic tokens                  |
| Tailwind palette classes (`bg-slate-800`) | same, and they never retheme                |
| arbitrary pixel values (`p-[13px]`)       | bypass the density and type scales          |
| literal durations (`duration-150`)        | ignore `--brand-motion`                     |
| `duration-[--x]`                          | Tailwind v3 syntax; emits invalid CSS in v4 |

If the checker flags your change, reach for a token. Do not add an exemption
unless the file is genuinely measurement machinery rather than UI.

## Adding a component

Follow [`src/design-system/ADDING-A-COMPONENT.md`](src/design-system/ADDING-A-COMPONENT.md).
The short version: check whether it already exists, check Base UI for a
primitive, read that primitive's real API rather than guessing at prop names,
copy the shape of a neighbouring component, and import motion from
`ui/_motion.ts`.

Then sanity-check it against the brand: open `/brand`, set radius to 0, motion
to 0 and density to 1.3. Your component should follow all three. If it does
not, something is hardcoded.

`/new-component` runs this whole recipe if you would rather have the agent
do it.

## Contributing a preset

The easiest useful contribution here, and the one most likely to be merged.

A preset is one file: a complete replacement for the `:root` block in
`src/design-system/brand.css`. The components never change — only the numbers.

1. Run `pnpm dev` and open `/brand`.
2. Turn the knobs until you have a look you would actually ship.
3. **Copy `brand.css`** from the panel and save it as
   `src/design-system/presets/<your-name>.css`.
4. Check the **contrast audit** on that same page passes. A preset that fails
   WCAG AA will not be merged — that is the whole point of the audit.
5. Add a row to the table in `src/design-system/presets/README.md` describing
   the feel in one line.
6. Open a PR with a screenshot of `/components` under your preset.

Name it after the feeling, not the colour — `brutalist` and `technical` say
more than `blue-2` does. Wildly different is more interesting than
tastefully adjacent; the point of the preset set is to show how far the same
components can travel.

## Tests

A change to behaviour comes with a test. There are four unit archetypes in the
repo — a component with variants, a portalled Base UI wrapper, a form field,
and a query against the mock API — and the closest one is meant to be copied
rather than reinvented. `.claude/skills/testing/SKILL.md` says which is which
and how the MSW handlers work.

Anything visual or routed also needs an e2e spec, and every route is scanned by
axe in `e2e/a11y.spec.ts`. A new route should be added to the list there.
Accessibility failures are treated as build failures, not as backlog.

## Commit messages

Explain _why_, not just _what_ — the diff already shows what changed. If you
fixed something subtle, say what the symptom was and what actually caused it.
The history here is meant to be readable a year later.

## Reporting a bug

Please include what you expected, what happened, and the smallest way to
reproduce it. For anything visual, a screenshot and your `brand.css` values
are usually enough to identify it immediately.
