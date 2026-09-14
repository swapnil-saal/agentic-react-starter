#!/usr/bin/env node
/**
 * PostToolUse hook: check design tokens on the file that was just edited.
 *
 * `pnpm check` already enforces these rules, but it runs at the end of a task —
 * by which point the agent has often built several more things on top of the
 * violation. Checking the single edited file costs ~30ms and puts the failure
 * in the tool result, where it gets fixed immediately and for free.
 *
 * Wired from .claude/settings.json. Reads the hook payload on stdin; exits 2
 * with the checker's output on stderr when the file violates a rule, which is
 * what feeds the message back to the agent.
 */
import { spawnSync } from 'node:child_process'
import { extname, join } from 'node:path'

const ROOT = process.cwd()
const CHECKABLE = new Set(['.ts', '.tsx', '.css'])

const raw = await new Promise((resolve) => {
  let buf = ''
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', (d) => (buf += d))
  process.stdin.on('end', () => resolve(buf))
})

let payload
try {
  payload = JSON.parse(raw || '{}')
} catch {
  // A payload we cannot parse is not the agent's problem — stay out of the way.
  process.exit(0)
}

const file = payload?.tool_input?.file_path
if (typeof file !== 'string') process.exit(0)

// Only src/ is token-governed; scripts, config and e2e are not.
const rel = file.startsWith(ROOT) ? file.slice(ROOT.length + 1) : file
if (!rel.startsWith('src/') || !CHECKABLE.has(extname(rel))) process.exit(0)

const result = spawnSync(
  process.execPath,
  [join(ROOT, 'scripts', 'check-tokens.mjs'), rel],
  { encoding: 'utf8' },
)

if (result.status === 1) {
  process.stderr.write(
    `Design-token violations in ${rel} — fix before continuing:\n\n` +
      `${result.stdout}`,
  )
  process.exit(2)
}

process.exit(0)
