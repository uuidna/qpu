import { defineLoader } from 'vitepress'
import { getPayload } from 'payload'
import config from '@payload-config'

declare const data: Record<string, any>
export { data }

export default defineLoader({
  async load() {
    const payload = await getPayload({ config })
    const result = await payload.find({ collection: 'docs' })
    return {
      docs: result.docs,
      timestamp: new Date().toISOString(),
    }
  },
  watch: ['../src/payload/seeds/**'],
})
