#!/usr/bin/env node
/**
 * Turn this starter into *your* app.
 *
 * Removes the example screens and the marketing home page, leaving the parts
 * that are actually infrastructure: the design system, the component showcase
 * (your living style guide) and the brand settings page.
 *
 *   pnpm reset            do it
 *   pnpm reset --dry-run  show what would change and touch nothing
 *
 * Everything it does is a file change in git, so `git checkout .` undoes it.
 * It refuses to run on a dirty tree unless you pass --force, so there is
 * always something to go back to.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const DRY = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')

const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

/** Files and folders that exist only to demonstrate the starter. */
const EXAMPLES = [
  'src/routes/users.index.tsx',
  'src/routes/users.$userId.tsx',
  'src/routes/form-demo.tsx',
  'src/features/users',
  'e2e/examples.spec.ts',
]

const BLANK_HOME = `import { createFileRoute } from '@tanstack/react-router'

import { Stack, Text } from '@/design-system'
import { APP_NAME } from '@/lib/app'

function Home() {
  return (
    <Stack gap={3}>
      <Text as="h1" size="3xl" weight="bold">
        {APP_NAME}
      </Text>
      <Text tone="muted">Start building here.</Text>
    </Stack>
  )
}

export const Route = createFileRoute('/')({ component: Home })
`

const EMPTY_HANDLERS = `import type { RequestHandler } from 'msw'

/**
 * Mock API handlers.
 *
 * Add \`http.get(...)\` entries here to develop against a fake backend, or set
 * VITE_ENABLE_MOCKS="false" once you have a real one. With no handlers every
 * request passes straight through to the network.
 */
export const handlers: RequestHandler[] = []
`

const actions = []

function willRemove(path) {
  if (existsSync(join(ROOT, path))) actions.push({ kind: 'remove', path })
}

function willWrite(path, contents, note) {
  actions.push({ kind: 'write', path, contents, note })
}

// ── Work out the plan ───────────────────────────────────────────────────────
for (const path of EXAMPLES) willRemove(path)

willWrite('src/routes/index.tsx', BLANK_HOME, 'blank home')
willWrite('src/mocks/handlers.ts', EMPTY_HANDLERS, 'no handlers')

// Trim the nav down to what survives.
const rootPath = 'src/routes/__root.tsx'
const rootSrc = readFileSync(join(ROOT, rootPath), 'utf8')
const trimmedNav = rootSrc
  .replace(/\n\s*\{ to: '\/users'[^\n]*\n/, '\n')
  .replace(/\n\s*\{ to: '\/form-demo'[^\n]*\n/, '\n')
  .replace(/,?\s*SquarePen,?\n/, '\n')
  .replace(/,?\s*Users,?\n/, '\n')
if (trimmedNav !== rootSrc) {
  willWrite(rootPath, trimmedNav, 'nav trimmed')
}

// ── Guard rails ─────────────────────────────────────────────────────────────
const alreadyReset = !EXAMPLES.some((p) => existsSync(join(ROOT, p)))
if (alreadyReset) {
  console.log(
    `${c.green}✔${c.reset} Already reset — no example screens left to remove.\n`,
  )
  process.exit(0)
}

if (!DRY && !FORCE) {
  let dirty = ''
  try {
    dirty = execFileSync('git', ['status', '--porcelain'], {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim()
  } catch {
    // Not a git repo — nothing to protect, carry on.
  }
  if (dirty) {
    console.log(
      `\n${c.red}✖ Uncommitted changes${c.reset}\n\n` +
        `  This rewrites and deletes files. Commit first so you can undo it,\n` +
        `  or re-run with ${c.cyan}--force${c.reset} if you are sure.\n\n` +
        `  ${c.dim}Preview it safely: pnpm reset --dry-run${c.reset}\n`,
    )
    process.exit(1)
  }
}

// ── Apply ───────────────────────────────────────────────────────────────────
console.log(
  `\n${DRY ? `${c.yellow}Dry run${c.reset} — nothing will change` : 'Resetting to a blank app'}\n`,
)

for (const action of actions) {
  const full = join(ROOT, action.path)
  if (action.kind === 'remove') {
    if (!DRY) rmSync(full, { recursive: true, force: true })
    console.log(`  ${c.red}remove${c.reset}  ${action.path}`)
  } else {
    if (!DRY) writeFileSync(full, action.contents)
    console.log(
      `  ${c.cyan}rewrite${c.reset} ${action.path}  ${c.dim}${action.note}${c.reset}`,
    )
  }
}

console.log(
  `\n  ${c.green}kept${c.reset}    src/design-system/   the component library and tokens\n` +
    `          /components          your living style guide\n` +
    `          /brand               brand settings + contrast audit\n` +
    `          src/mocks/           wiring intact, handlers emptied\n`,
)

if (DRY) {
  console.log(`${c.dim}Run without --dry-run to apply.${c.reset}\n`)
} else {
  console.log(
    `${c.green}Done.${c.reset} Next:\n` +
      `  ${c.dim}1.${c.reset} Rename the project in package.json — the app name follows it\n` +
      `  ${c.dim}2.${c.reset} Set your brand at /brand, export, save over design-system/brand.css\n` +
      `  ${c.dim}3.${c.reset} pnpm check && pnpm e2e\n\n` +
      `${c.dim}Undo: git checkout .${c.reset}\n`,
  )
}
