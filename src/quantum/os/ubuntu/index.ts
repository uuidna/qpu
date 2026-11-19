// Ubuntu on Quantum OS. The page is a Payload find. Nothing is fetched.

import { manageApi } from '../../payload/index.ts'

const source = manageApi({ collection: 'pages', action: 'find', where: { slug: { equals: 'ubuntu' } } })

const os = {
  upstream: 'https://ubuntu.com',
  source,
}

export default os
