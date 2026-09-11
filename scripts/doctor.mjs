#!/usr/bin/env node
/**
 * Verifies — and where safe, repairs — the parts of this project's toolchain
 * that live OUTSIDE package.json.
 *
 * `pnpm install` restores dependencies. It cannot restore the global codegraph
 * binary, the machine-local Claude plugin registry, the code index, or
 * Playwright's browsers. A fresh clone therefore has a working app but a
 * hollow agent layer, with nothing to tell you. This script is that signal,
 * and the repair path.
 *
 *   pnpm doctor         detect, then fix what can be fixed safely
 *   pnpm doctor:check   report only, never mutate; non-zero if a REQUIRED
 *                       item is missing (use this in CI)
 *
 * Design rules:
 *   - Idempotent. Running twice in a row must be a clean no-op.
 *   - Tiered. Only REQUIRED failures affect the exit code, so a missing
 *     optional CLI can never break someone's build.
 *   - Never writes secrets. Missing env vars are reported, never invented.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CHECK_ONLY = process.argv.includes('--check')
const ROOT = process.cwd()

const REQUIRED = 'required'
const RECOMMENDED = 'recommended'
const OPTIONAL = 'optional'

const results = []

const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

/** Run a command, returning stdout or null if it fails / is missing. */
function run(cmd, args, { cwd = ROOT } = {}) {
  try {
    return execFileSync(cmd, args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return null
  }
}

function has(cmd) {
  return run('which', [cmd]) !== null
}

function json(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/**
 * @param name     short label
 * @param tier     REQUIRED | RECOMMENDED | OPTIONAL
 * @param detect   () => true | string   true = healthy, string = why not
 * @param fix      null | { describe, run: () => void }
 */
function check(name, tier, detect, fix = null) {
  let state = detect()

  if (state === true) {
    results.push({ name, tier, status: 'ok' })
    return
  }

  if (!fix) {
    results.push({ name, tier, status: 'fail', detail: state })
    return
  }

  if (CHECK_ONLY) {
    results.push({
      name,
      tier,
      status: 'fail',
      detail: state,
      hint: fix.describe,
    })
    return
  }

  process.stdout.write(`${c.dim}  fixing ${name} — ${fix.describe}${c.reset}\n`)
  try {
    fix.run()
  } catch (err) {
    results.push({
      name,
      tier,
      status: 'fail',
      detail: `${state} (repair failed: ${err.message.split('\n')[0]})`,
      hint: fix.describe,
    })
    return
  }

  // Re-verify rather than trusting the fix reported success.
  state = detect()
  results.push(
    state === true
      ? { name, tier, status: 'fixed' }
      : { name, tier, status: 'fail', detail: state, hint: fix.describe },
  )
}

// ── 1. toolchain ────────────────────────────────────────────────────────────
check('node >= 22', REQUIRED, () => {
  const major = Number(process.versions.node.split('.')[0])
  return major >= 22 ? true : `found node ${process.versions.node}`
})

check('pnpm available', REQUIRED, () =>
  has('pnpm') ? true : 'pnpm not on PATH — see https://pnpm.io/installation',
)

// ── 2-4. codegraph ──────────────────────────────────────────────────────────
check(
  'codegraph CLI',
  RECOMMENDED,
  () => (has('codegraph') ? true : 'not installed'),
  {
    describe: 'npm i -g @colbymchenry/codegraph',
    run: () =>
      execFileSync('npm', ['i', '-g', '@colbymchenry/codegraph'], {
        stdio: 'ignore',
      }),
  },
)

check(
  'codegraph index',
  RECOMMENDED,
  () => {
    if (!has('codegraph')) return 'skipped — codegraph CLI missing'
    if (!existsSync(join(ROOT, '.codegraph'))) return 'repo not indexed'
    return run('codegraph', ['status']) !== null ? true : 'index unreadable'
  },
  {
    describe: 'codegraph init',
    run: () => execFileSync('codegraph', ['init'], { stdio: 'ignore' }),
  },
)

check(
  'codegraph MCP entry',
  RECOMMENDED,
  () => {
    const file = join(ROOT, '.mcp.json')
    if (!existsSync(file)) return '.mcp.json missing'
    const cfg = json(readFileSync(file, 'utf8'))
    return cfg?.mcpServers?.codegraph
      ? true
      : 'codegraph not declared in .mcp.json'
  },
  {
    describe: 'write the codegraph server into .mcp.json',
    run: () => {
      const file = join(ROOT, '.mcp.json')
      const cfg = existsSync(file)
        ? (json(readFileSync(file, 'utf8')) ?? {})
        : {}
      cfg.mcpServers = cfg.mcpServers ?? {}
      cfg.mcpServers.codegraph = {
        type: 'stdio',
        command: 'codegraph',
        args: ['serve', '--mcp'],
      }
      writeFileSync(file, `${JSON.stringify(cfg, null, 2)}\n`)
    },
  },
)

// ── 5-7. claude code plugins ────────────────────────────────────────────────
const HAS_CLAUDE = has('claude')

check('claude CLI', OPTIONAL, () =>
  HAS_CLAUDE ? true : 'not on PATH — plugin checks skipped (fine in CI)',
)

check(
  'ponytail marketplace',
  RECOMMENDED,
  () => {
    if (!HAS_CLAUDE) return 'skipped — claude CLI missing'
    const list = json(
      run('claude', ['plugin', 'marketplace', 'list', '--json']),
    )
    return Array.isArray(list) && list.some((m) => m.name === 'ponytail')
      ? true
      : 'marketplace not registered'
  },
  {
    describe: 'claude plugin marketplace add DietrichGebert/ponytail',
    run: () =>
      execFileSync(
        'claude',
        ['plugin', 'marketplace', 'add', 'DietrichGebert/ponytail'],
        { stdio: 'ignore' },
      ),
  },
)

function ponytailEntry() {
  const list = json(run('claude', ['plugin', 'list', '--json']))
  return Array.isArray(list)
    ? list.find((p) => p.id === 'ponytail@ponytail')
    : null
}

check(
  'ponytail plugin',
  RECOMMENDED,
  () => {
    if (!HAS_CLAUDE) return 'skipped — claude CLI missing'
    const entry = ponytailEntry()
    if (!entry) return 'not installed'
    if (!entry.enabled) return 'installed but disabled'
    return true
  },
  {
    // Installing and enabling are different operations: `install` is a no-op
    // on a plugin that is already present but switched off, so branch on the
    // state we actually found.
    describe:
      'claude plugin install (if absent) or enable (if disabled) ponytail@ponytail',
    run: () => {
      if (!ponytailEntry()) {
        execFileSync(
          'claude',
          [
            'plugin',
            'install',
            'ponytail@ponytail',
            '--scope',
            'project',
            '-y',
          ],
          { stdio: 'ignore' },
        )
        return
      }

      // Present but disabled. A local-scope disable overrides the project
      // setting, so clear it at the same scope it was set.
      execFileSync(
        'claude',
        ['plugin', 'enable', 'ponytail@ponytail', '--scope', 'local'],
        { stdio: 'ignore' },
      )
    },
  },
)

// The plugin is activated for a checkout by .claude/settings.json, not by
// where it happened to be installed — that declaration is what makes the setup
// survive a clone, a move, or a new teammate. Verify it is actually committed.
check('ponytail declared in repo', RECOMMENDED, () => {
  const file = join(ROOT, '.claude/settings.json')
  if (!existsSync(file)) return '.claude/settings.json missing'
  const cfg = json(readFileSync(file, 'utf8'))
  if (!cfg?.extraKnownMarketplaces?.ponytail) {
    return 'marketplace not declared in .claude/settings.json'
  }
  return cfg?.enabledPlugins?.['ponytail@ponytail']
    ? true
    : 'not listed under enabledPlugins in .claude/settings.json'
})

// The design system is owned source, so nothing reinstalls it. A missing
// barrel or token file means the UI silently loses its styling.
check('design system intact', REQUIRED, () => {
  const required = [
    'src/design-system/index.ts',
    'src/design-system/tokens.css',
    'src/design-system/theme.css',
  ]
  const missing = required.filter((f) => !existsSync(join(ROOT, f)))
  return missing.length === 0 ? true : `missing: ${missing.join(', ')}`
})

// ── 8. playwright browsers ──────────────────────────────────────────────────
check(
  'playwright browsers',
  RECOMMENDED,
  () => {
    if (!existsSync(join(ROOT, 'node_modules/@playwright/test'))) {
      return 'skipped — @playwright/test not installed'
    }
    // `install --dry-run` lists what is missing; it never downloads anything.
    const out = run('pnpm', ['exec', 'playwright', 'install', '--dry-run'])
    if (out === null) return 'could not query playwright'
    // A browser already present reports an existing install directory.
    return /chromium/i.test(out) && !/is not installed/i.test(out)
      ? true
      : 'chromium not installed'
  },
  {
    describe: 'pnpm exec playwright install chromium',
    run: () =>
      execFileSync('pnpm', ['exec', 'playwright', 'install', 'chromium'], {
        stdio: 'ignore',
      }),
  },
)

// ── 9. env ─────────────────────────────────────────────────────────────────
check('.env complete', REQUIRED, () => {
  const examplePath = join(ROOT, '.env.example')
  if (!existsSync(examplePath)) return true

  const keysIn = (text) =>
    text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => l.split('=')[0].trim())
      .filter(Boolean)

  const wanted = keysIn(readFileSync(examplePath, 'utf8'))
  const envPath = join(ROOT, '.env')

  if (!existsSync(envPath)) {
    return `.env missing — copy .env.example and fill in: ${wanted.join(', ')}`
  }

  const have = new Set(keysIn(readFileSync(envPath, 'utf8')))
  const missing = wanted.filter((k) => !have.has(k))

  return missing.length === 0
    ? true
    : `missing in .env: ${missing.join(', ')} (add them by hand — secrets are never written for you)`
})

// ── report ──────────────────────────────────────────────────────────────────
const ICON = {
  ok: `${c.green}✔${c.reset}`,
  fixed: `${c.cyan}✔${c.reset}`,
  fail: `${c.red}✖${c.reset}`,
  warn: `${c.yellow}⚠${c.reset}`,
}

console.log(
  `\n${c.dim}${CHECK_ONLY ? 'Checking' : 'Checking and repairing'} the out-of-band toolchain…${c.reset}\n`,
)

const width = Math.max(...results.map((r) => r.name.length))

let hardFailures = 0
let softFailures = 0

for (const r of results) {
  const failed = r.status === 'fail'
  const hard = failed && r.tier === REQUIRED
  if (hard) hardFailures++
  else if (failed) softFailures++

  const icon = failed ? (hard ? ICON.fail : ICON.warn) : ICON[r.status]
  const label = r.name.padEnd(width)
  const note =
    r.status === 'fixed'
      ? `${c.cyan}repaired${c.reset}`
      : failed
        ? `${c.dim}${r.detail}${c.reset}`
        : ''

  console.log(`  ${icon} ${label}  ${note}`)
  if (failed && r.hint) {
    console.log(`    ${c.dim}→ ${r.hint}${c.reset}`)
  }
}

const fixed = results.filter((r) => r.status === 'fixed').length
console.log()

if (hardFailures === 0 && softFailures === 0) {
  console.log(
    `${c.green}All checks passed${c.reset}${fixed ? ` ${c.dim}(${fixed} repaired)${c.reset}` : ''}\n`,
  )
} else {
  const parts = []
  if (hardFailures) parts.push(`${hardFailures} required`)
  if (softFailures) parts.push(`${softFailures} optional`)
  console.log(
    `${hardFailures ? c.red : c.yellow}${parts.join(', ')} check(s) need attention${c.reset}` +
      `${fixed ? ` ${c.dim}(${fixed} repaired)${c.reset}` : ''}\n`,
  )
  if (CHECK_ONLY && softFailures) {
    console.log(`${c.dim}Run \`pnpm doctor\` to repair.${c.reset}\n`)
  }
}

// Only REQUIRED failures fail the command.
process.exit(hardFailures > 0 ? 1 : 0)
