// Debian on Quantum OS. The page is a Payload find. Nothing is fetched.

import { manageApi } from '../../payload/index.ts'

const source = manageApi({ collection: 'pages', action: 'find', where: { slug: { equals: 'debian' } } })

const os = {
  upstream: 'https://www.debian.org',
  source,
}

export default os
