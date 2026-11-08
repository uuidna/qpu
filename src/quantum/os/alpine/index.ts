// Alpine on Quantum OS. The page is a Payload find. The upstream is Alpine Linux.
// Expressions are linted by ESLint's universal Linter before they run. Nothing is fetched.

import { manageApi } from '../../payload/index.ts'
import { browserEslint } from '../eslint.ts'

const source = manageApi({ collection: 'pages', action: 'find', where: { slug: { equals: 'alpine' } } })

const os = {
  name: 'qpu browser quantum os',
  upstream: 'https://alpinelinux.org',
  packages: 'https://dl-cdn.alpinelinux.org/alpine',
  device: 'client' as const,
  binary: 'apk' as const,
  source,
  eslint: browserEslint,
}

export default os
