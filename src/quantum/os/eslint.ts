// ESLint on the browser OS. `eslint/universal` is the Linter build that runs without a filesystem.
// The rules are ESLint's recommended set, plus the rules that refuse eval-shaped input.
// A name is a global only when the OS already holds it, or it is a magic this OS implements.
// The expression does not choose the rules, and it does not declare a global.

import js from '@eslint/js'
import { Linter } from 'eslint/universal'

const linter = new Linter({ configType: 'flat' })

const kept = {
  'no-alert': 'error',
  'no-caller': 'error',
  'no-eval': 'error',
  'no-extend-native': 'error',
  'no-global-assign': 'error',
  'no-implied-eval': 'error',
  'no-iterator': 'error',
  'no-new-func': 'error',
  'no-new-wrappers': 'error',
  'no-obj-calls': 'error',
  'no-proto': 'error',
  'no-script-url': 'error',
  'no-undef': 'error',
} as const

const rules: Linter.RulesRecord = { ...js.configs.recommended.rules, ...kept }

const on = (value: Linter.RuleEntry): boolean => {
  const severity = Array.isArray(value) ? value[0] : value
  return severity !== 0 && severity !== 'off'
}

/** Magics the OS implements. They stay readonly, even when the scope reuses the name. */
const MAGICS = ['$data', '$dispatch', '$el', '$focus', '$id', '$nextTick', '$persist', '$refs', '$root', '$store', '$watch', 'Alpine'] as const

export const browserEslint = {
  via: 'eslint/universal' as const,
  version: linter.version,
  recommended: '@eslint/js' as const,
  rules: Object.keys(rules).filter((name) => on(rules[name]!)),
}

export type EslintFinding = { rule: string | null; message: string; line: number; column: number; fatal: boolean }

/** Lint one expression before the OS runs it. `names` are the scope the OS already holds. */
export const lintExpression = (code: string, names: readonly string[]) => {
  const globals: Record<string, 'readonly' | 'writable'> = {}
  for (const name of names) {
    if (/^[A-Za-z_$][\w$]*$/.test(name) && !(MAGICS as readonly string[]).includes(name)) globals[name] = 'writable'
  }
  for (const name of MAGICS) globals[name] = 'readonly'
  const messages = linter.verify(code, [{ languageOptions: { ecmaVersion: 'latest', sourceType: 'script', globals }, rules }])
  const findings: EslintFinding[] = []
  for (const message of messages) {
    if (message.severity !== 2 && message.fatal !== true) continue
    findings.push({ rule: message.ruleId, message: message.message, line: message.line, column: message.column, fatal: message.fatal === true })
  }
  return { via: browserEslint.via, version: linter.version, clean: findings.length === 0, findings }
}
