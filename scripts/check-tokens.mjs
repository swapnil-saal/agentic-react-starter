#!/usr/bin/env node
/**
 * Enforces the design-system rules mechanically.
 *
 * Prose in a skill file tells an agent what to do; this makes it impossible to
 * get wrong quietly. Every rule below corresponds to a way the token system
 * gets bypassed — each one produces UI that looks fine today and then fails to
 * respond when someone changes brand.css.
 *
 *   pnpm check:tokens
 *
 * Part of `pnpm check`, so it runs on every verification.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const ROOT = process.cwd()

/**
 * Files allowed to contain literal colour values.
 *
 * Two kinds qualify: the token layer, which is where literals are supposed to
 * live, and the measurement machinery, whose colour literals are a canvas
 * sentinel and a transparency comparison rather than anything the UI renders.
 */
const EXEMPT = [
  'src/design-system/brand.css',
  'src/design-system/tokens.css',
  'src/design-system/presets',
  'src/design-system/presets.ts',
  'src/design-system/brand-kit.ts',
]

const SCAN_DIRS = ['src']
const SCAN_EXT = new Set(['.ts', '.tsx', '.css'])

/** Tailwind's built-in palette. Using these bypasses our semantic tokens. */
const TW_PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'

const RULES = [
  {
    id: 'hex-colour',
    // A hex literal anywhere outside the token layer.
    re: /#[0-9a-fA-F]{3,8}\b/g,
    message:
      'hardcoded hex colour — use a semantic utility (bg-surface, text-fg) or a --ds-* token',
  },
  {
    id: 'rgb-hsl-literal',
    re: /\b(?:rgba?|hsla?)\(\s*\d/g,
    message:
      'hardcoded colour function — use a semantic token so it responds to the brand',
  },
  {
    id: 'tailwind-palette',
    // e.g. bg-slate-800, text-red-500, border-gray-200, ring-blue-400/50
    re: new RegExp(
      `\\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|divide|shadow|accent|caret)-(?:${TW_PALETTE})-\\d{2,3}\\b`,
      'g',
    ),
    message:
      "Tailwind's built-in palette bypasses the token system — use bg-surface / text-fg-muted / border-border etc.",
  },
  {
    id: 'v3-variable-syntax',
    // duration-[--x] emits invalid CSS in Tailwind v4 and silently does nothing.
    re: /\b[a-z-]+-\[--[a-z-]+\]/g,
    message:
      'Tailwind v3 variable syntax — use parentheses: duration-(--duration-fast), not duration-[--duration-fast]',
  },
  {
    id: 'raw-duration',
    // Any literal duration ignores --brand-motion — both Tailwind's numeric
    // scale (duration-150) and an arbitrary value (duration-[200ms]).
    re: /\bduration-(?:\d+|\[\d+m?s\])\b/g,
    message:
      'literal transition duration ignores --brand-motion — import from ui/_motion instead',
  },
  {
    id: 'arbitrary-px',
    // p-[12px], text-[14px], gap-[3px] … sidestep the density + type scales.
    re: /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|w|h|text|rounded)-\[\d+(?:\.\d+)?px\]/g,
    message:
      'arbitrary pixel value bypasses the spacing/type scale — use a scale step so density still applies',
  },
]

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue
      walk(full, out)
    } else if (SCAN_EXT.has(extname(entry))) {
      out.push(full)
    }
  }
  return out
}

function isExempt(rel) {
  return EXEMPT.some((p) => rel === p || rel.startsWith(`${p}/`))
}

/** Strip comments so a rule cited in prose doesn't trip the rule itself. */
function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/\S/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m) => m.replace(/\S/g, ' '))
}

/**
 * Files to check.
 *
 * With no arguments this walks `src/`, which is what `pnpm check` wants. Given
 * paths, it checks only those — that is what makes it usable from a PostToolUse
 * hook, where the agent should hear about a hex code in the tool result rather
 * than minutes later at the end of a full verification.
 */
function targets() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'))
  if (args.length === 0) {
    return SCAN_DIRS.flatMap((dir) => [...walk(join(ROOT, dir))])
  }
  return args
    .map((a) => (a.startsWith('/') ? a : join(ROOT, a)))
    .filter((f) => SCAN_EXT.has(extname(f)))
    .filter((f) => {
      try {
        return statSync(f).isFile()
      } catch {
        // A path that no longer exists (renamed, deleted) is not a violation.
        return false
      }
    })
}

const findings = []
const scanned = targets()

for (const file of scanned) {
  const rel = relative(ROOT, file)
  if (isExempt(rel)) continue

  const raw = readFileSync(file, 'utf8')
  const source = stripComments(raw)
  const lines = source.split('\n')

  for (const rule of RULES) {
    lines.forEach((line, i) => {
      for (const match of line.matchAll(rule.re)) {
        findings.push({
          file: rel,
          line: i + 1,
          col: (match.index ?? 0) + 1,
          text: match[0],
          rule,
        })
      }
    })
  }
}

const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
}

if (findings.length === 0) {
  // Silent when checking specific files: a hook that prints on every edit
  // trains the agent to ignore it.
  if (process.argv.length <= 2) {
    console.log(`${c.green}✔${c.reset} design tokens: no violations`)
  }
  process.exit(0)
}

console.log(
  `\n${c.red}✖ ${findings.length} design-token violation(s)${c.reset}\n`,
)

const byRule = new Map()
for (const f of findings) {
  if (!byRule.has(f.rule.id)) byRule.set(f.rule.id, [])
  byRule.get(f.rule.id).push(f)
}

for (const [id, items] of byRule) {
  console.log(`${c.yellow}${id}${c.reset} — ${items[0].rule.message}`)
  for (const f of items) {
    console.log(`  ${c.dim}${f.file}:${f.line}:${f.col}${c.reset}  ${f.text}`)
  }
  console.log()
}

console.log(
  `${c.dim}These bypass the token system: the UI will not respond when someone
edits design-system/brand.css. See .claude/skills/design-system/SKILL.md.${c.reset}\n`,
)

process.exit(1)
