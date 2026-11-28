// Alpine on Quantum OS. The upstream is Alpine Linux.
// Expressions are linted by ESLint's universal Linter before they run. Nothing is fetched.
import { browserEslint, lintExpression } from '../../../../../../../../2/2/3/5/f/b/e/d/index.ts'

const os = {
  name: 'qpu browser quantum os',
  upstream: 'https://alpinelinux.org',
  packages: 'https://dl-cdn.alpinelinux.org/alpine',
  device: 'client' as const,
  binary: 'apk' as const,
  eslint: browserEslint,
  lint: lintExpression,
}

export default os
