import type { RichTextField } from 'payload'

const richText = (overrides: Partial<RichTextField> = {}): RichTextField => ({ name: 'richText', type: 'richText', required: true, ...overrides }) as RichTextField

export default richText
