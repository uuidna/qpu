// Alpine on Quantum OS. The upstream is Alpine Linux.
// Expressions are linted by ESLint's universal Linter before they run. Nothing is fetched.

// ESLint where it is installed; where it is not, no linter, and no expression runs
const linter = await import('../eslint.ts').catch(() => null)

const os = {
  name: 'qpu browser quantum os',
  upstream: 'https://alpinelinux.org',
  packages: 'https://dl-cdn.alpinelinux.org/alpine',
  device: 'client' as const,
  binary: 'apk' as const,
  eslint: linter?.browserEslint ?? null,
  lint: linter?.lintExpression ?? null,
}

export default os
