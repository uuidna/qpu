// Alpine on Quantum OS. The page is a Payload find. The upstream is Alpine Linux.
// Expressions are linted by ESLint's universal Linter before they run. Nothing is fetched.

import { manageApi } from '../../payload/index.ts'

// ESLint where it is installed; where it is not, no linter, and no expression runs
const linter = await import('../eslint.ts').catch(() => null)

const source = manageApi({ collection: 'pages', action: 'find', where: { slug: { equals: 'alpine' } } })

const os = {
  name: 'qpu browser quantum os',
  upstream: 'https://alpinelinux.org',
  packages: 'https://dl-cdn.alpinelinux.org/alpine',
  device: 'client' as const,
  binary: 'apk' as const,
  source,
  eslint: linter?.browserEslint ?? null,
  lint: linter?.lintExpression ?? null,
}

export default os
