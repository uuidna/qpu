// config — one toolchain stamp for every replica. Host, worker name, and site title stay local.
// Worker pins, VitePress hologram, Payload CMS editor. Same table. When never.
import { ADDRESS_BITS, BASE, COINS, HANDLE_BITS, HANDLE_HEXBITS, HEXBIT_BITS, HEXBIT_STATES, MERKABA_VERTICES, QPU_DOORS, QPU_HOST, QPU_POINTS, RAYS, TETRA, TRINITY, VE_FACES, qpuSeatOf } from './hologram.js'

/** Worker toolchain only. A new name is a supply-chain change this constructor must surface. */
export const QPU_DEV_PACKAGES = ['@types/node', 'typescript', 'vitepress', 'wrangler'] as const

export const QPU_CONFIG_PINS = {
  '@types/node': '26.5.0',
  typescript: '7.0.2',
  vitepress: '2.0.0-alpha.20',
  wrangler: '4.130.0',
} as const

/** Payload CMS family. Same exact pin. Worker replicas do not install these. */
export const QPU_PAYLOAD_PIN = '3.88.0'

/**
 * Official Payload plugins. Every plugin occupies one role at QPU_PAYLOAD_PIN.
 * Search is the indexed occupancy of title/slug, not a second ledger. Stripe and Sentry prove billing and log width.
 * Cloud-storage is occupied through R2. One copy per role. When never.
 */
export const QPU_PAYLOAD_PLUGINS = [
  { id: 'r2', package: '@payloadcms/storage-r2', role: 'media', fused: true, copies: 1 as const },
  { id: 'cloud-storage', package: '@payloadcms/plugin-cloud-storage', role: 'storage', fused: true, copies: 1 as const },
  { id: 'nested-docs', package: '@payloadcms/plugin-nested-docs', role: 'tree', fused: true, copies: 1 as const },
  { id: 'seo', package: '@payloadcms/plugin-seo', role: 'meta', fused: true, copies: 1 as const },
  { id: 'redirects', package: '@payloadcms/plugin-redirects', role: 'urls', fused: true, copies: 1 as const },
  { id: 'search', package: '@payloadcms/plugin-search', role: 'index', fused: true, copies: 1 as const },
  { id: 'form-builder', package: '@payloadcms/plugin-form-builder', role: 'forms', fused: true, copies: 1 as const },
  { id: 'multi-tenant', package: '@payloadcms/plugin-multi-tenant', role: 'tenants', fused: true, copies: 1 as const },
  { id: 'stripe', package: '@payloadcms/plugin-stripe', role: 'billing', fused: true, copies: 1 as const },
  { id: 'sentry', package: '@payloadcms/plugin-sentry', role: 'log', fused: true, copies: 1 as const },
  { id: 'mcp', package: '@payloadcms/plugin-mcp', role: 'tools', fused: true, copies: 1 as const },
] as const

/** Website-template access. Writes verify a user. Pages read published or user. Media read is public. */
export const QPU_PAYLOAD_ACCESS = {
  users: { admin: 'user', create: 'user', read: 'user', update: 'user', delete: 'user', unlock: 'user' },
  media: { read: 'anyone', create: 'user', update: 'user', delete: 'user' },
  pages: { read: 'published-or-user', create: 'user', update: 'user', delete: 'user', readVersions: 'user' },
  tenants: { create: 'user', read: 'user', update: 'user', delete: 'user' },
  redirects: { read: 'anyone', create: 'user', update: 'user', delete: 'user' },
  search: { read: 'anyone', create: 'user', update: 'user', delete: 'user' },
  forms: { read: 'anyone', create: 'anyone', update: 'user', delete: 'user' },
  'form-submissions': { read: 'user', create: 'anyone', update: 'user', delete: 'user' },
  publications: { read: 'anyone', create: 'user', update: 'user', delete: 'user' },
  theorems: { read: 'published-or-user', create: 'user', update: 'user', delete: 'user', readVersions: 'user' },
  axioms: { read: 'published-or-user', create: 'user', update: 'user', delete: 'user', readVersions: 'user' },
} as const

/** Payload collection hooks. beforeChange stamps; afterChange verifies. afterRead stays empty (runs on every read). */
export const QPU_PAYLOAD_HOOKS = {
  users: ['beforeChange', 'afterChange'],
  media: ['beforeChange', 'afterChange'],
  pages: ['beforeChange', 'afterChange'],
  publications: ['beforeChange', 'afterChange'],
  theorems: ['beforeChange', 'afterChange'],
  axioms: ['beforeChange', 'afterChange'],
} as const

/**
 * Reference collections. Nested-docs parent/breadcrumbs plus Lexical nesting
 * are the finite schema; payload.find depth walks 2ⁿ named doors at once.
 */
export const QPU_PAYLOAD_COLLECTIONS = [
  { slug: 'pages', nested: true, lexical: true, references: ['media', 'pages'] },
  { slug: 'publications', nested: true, lexical: true, references: ['theorems', 'media'] },
  { slug: 'theorems', nested: true, lexical: true, references: ['axioms', 'publications', 'theorems'] },
  { slug: 'axioms', nested: true, lexical: true, references: ['theorems'] },
] as const

/** Full Lexical power. Nested nodes, not a second editor. GraphQL stays off. Typography and embed occupy the stamp. */
export const QPU_PAYLOAD_LEXICAL = {
  package: '@payloadcms/richtext-lexical' as const,
  nesting: true as const,
  features: [
    'paragraph',
    'heading',
    'typography',
    'align',
    'indent',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'subscript',
    'superscript',
    'inlineCode',
    'textState',
    'quote',
    'list',
    'checklist',
    'link',
    'relationship',
    'upload',
    'blocks',
    'table',
    'horizontalRule',
    'embed',
    'inlineToolbar',
    'toolbar',
  ] as const,
  skipped: [] as const,
} as const

/** Nested-docs: finite parent + breadcrumbs; infinite finites via recursive find. */
export const QPU_PAYLOAD_NESTING = {
  plugin: 'nested-docs' as const,
  collections: ['pages', 'publications', 'theorems', 'axioms'] as const,
  parent: 'parent' as const,
  breadcrumbs: 'breadcrumbs' as const,
  hooks: ['populateBreadcrumbsBeforeChange', 'resaveChildren'] as const,
} as const

/** Teleport: every hologram dimension, recursive, at the VitePress loader. Fetches 0. Morph and lexical occupy the same find. */
export const QPU_PAYLOAD_TELEPORT = {
  kind: 'teleport' as const,
  to: 'loader' as const,
  find: 'payload.find' as const,
  depth: true as const,
  recursive: true as const,
  at: 'once' as const,
  fetches: 0 as const,
  crawl: false as const,
  morph: true as const,
  lexical: true as const,
  nesting: true as const,
  vectors: VE_FACES,
  dimensions: {
    foundation: 0,
    trinity: TRINITY,
    planes: BASE,
    doors: QPU_DOORS,
    rays: RAYS,
    pentagram: QPU_POINTS.length,
    tetra: TETRA,
    merkaba: MERKABA_VERTICES,
    hexbit: HEXBIT_BITS,
    hex: HEXBIT_STATES,
    octet: HANDLE_HEXBITS,
    handle: HANDLE_BITS,
    faces: VE_FACES,
    coins: COINS,
    combos: QPU_DOORS * RAYS,
    address: ADDRESS_BITS,
  },
} as const

/**
 * VitePress talks to Payload through CRUD, not GraphQL.
 * defineLoader occupies payload.find in-process (QPU, where Payload is installed).
 * Named HTTPS hops GET /api/{collection}?depth= — REST CRUD, uploads included.
 * GraphQL is a second schema, POST-only, no uploads; not a plugin on this stamp.
 */
export const QPU_PAYLOAD_API = {
  vitepress: 'loader' as const,
  local: 'crud' as const,
  http: 'rest' as const,
  graphql: false as const,
  find: 'payload.find' as const,
  depth: true as const,
} as const

export const QPU_PAYLOAD_PACKAGES = [
  'payload',
  '@payloadcms/db-d1-sqlite',
  '@payloadcms/next',
  '@payloadcms/richtext-lexical',
  '@payloadcms/ui',
  ...QPU_PAYLOAD_PLUGINS.map((p) => p.package),
] as const

export const QPU_NODE = '>=22'
export const QPU_WORKER_ENTRY = 'worker.js'
export const QPU_COMPATIBILITY_DATE = '2026-08-01'
export const QPU_ASSETS = 'docs/.vitepress/dist'
export const QPU_ASSETS_BINDING = 'ASSETS'
/** Named door for this stamp. Occupancy 404s /config and satellites here. */
export const QPU_CONFIG_HOST = 'qpu.uuidna.com'

export const QPU_TSCONFIG = {
  target: 'ES2022',
  module: 'NodeNext',
  moduleResolution: 'NodeNext',
  strict: true,
  noEmitOnError: true,
  types: ['node'],
} as const

export const QPU_FRAMEWORKS = [
  { id: 'node', package: '@types/node', role: 'test' },
  { id: 'typescript', package: 'typescript', role: 'types' },
  { id: 'vitepress', package: 'vitepress', role: 'hologram' },
  { id: 'wrangler', package: 'wrangler', role: 'worker' },
  { id: 'payload', package: 'payload', role: 'cms' },
] as const

/** VitePress hologram and Payload CMS share this stamp. Both stay invisible. */
export const QPU_EDITORS = [
  { id: 'vitepress', package: 'vitepress', role: 'hologram', visible: false as const, pin: QPU_CONFIG_PINS.vitepress },
  { id: 'payload', package: 'payload', role: 'cms', visible: false as const, pin: QPU_PAYLOAD_PIN },
] as const

/** Shared worker configs. Hologram and CMS occupy this table; they do not each mint a tsconfig, Node engine, or wrangler. */
export const QPU_SHARED = {
  node: QPU_NODE,
  typescript: QPU_TSCONFIG,
  worker: QPU_WORKER_ENTRY,
  assets: QPU_ASSETS,
  binding: QPU_ASSETS_BINDING,
  compatibilityDate: QPU_COMPATIBILITY_DATE,
  editors: QPU_EDITORS,
} as const

const ORIGIN = `https://${QPU_CONFIG_HOST}`

export const qpuFirmwareOf = () => ({
  name: 'vitepress' as const,
  role: 'hologram' as const,
  visible: false as const,
  assets: QPU_ASSETS,
  host: QPU_HOST,
})

export const qpuFirmwareHolds = (fw = qpuFirmwareOf()): boolean =>
  fw.name === 'vitepress' &&
  fw.role === 'hologram' &&
  fw.visible === false &&
  fw.assets === QPU_ASSETS &&
  fw.host === QPU_HOST

export const qpuPayloadOf = () => {
  const plugins = QPU_PAYLOAD_PLUGINS.map((p) => ({ ...p }))
  return {
    name: 'payload' as const,
    role: 'cms' as const,
    visible: false as const,
    pin: QPU_PAYLOAD_PIN,
    packages: [...QPU_PAYLOAD_PACKAGES],
    plugins,
    fused: plugins.map((p) => p.id),
    skipped: [] as const,
    order: plugins.map((p) => p.id),
    access: QPU_PAYLOAD_ACCESS,
    hooks: QPU_PAYLOAD_HOOKS,
    collections: QPU_PAYLOAD_COLLECTIONS.map((row) => ({ ...row, references: [...row.references] })),
    lexical: { ...QPU_PAYLOAD_LEXICAL, features: [...QPU_PAYLOAD_LEXICAL.features] },
    nesting: { ...QPU_PAYLOAD_NESTING, collections: [...QPU_PAYLOAD_NESTING.collections], hooks: [...QPU_PAYLOAD_NESTING.hooks] },
    teleport: { ...QPU_PAYLOAD_TELEPORT },
    api: { ...QPU_PAYLOAD_API },
  }
}

export const qpuPayloadHolds = (p = qpuPayloadOf()): boolean =>
  p.name === 'payload' &&
  p.role === 'cms' &&
  p.visible === false &&
  p.pin === QPU_PAYLOAD_PIN &&
  p.packages.length === QPU_PAYLOAD_PACKAGES.length &&
  p.packages.every((n, i) => n === QPU_PAYLOAD_PACKAGES[i]) &&
  p.plugins.length === QPU_PAYLOAD_PLUGINS.length &&
  p.plugins.every((row) => row.fused === true && row.copies === 1 && !row.package.includes('*')) &&
  p.fused.length === QPU_PAYLOAD_PLUGINS.length &&
  p.skipped.length === 0 &&
  p.fused.includes('search') &&
  p.fused.includes('stripe') &&
  p.fused.includes('sentry') &&
  p.order[p.order.length - 1] === 'mcp' &&
  p.access.pages.read === 'published-or-user' &&
  p.access.media.read === 'anyone' &&
  p.hooks.users.includes('afterChange') &&
  p.hooks.media.includes('afterChange') &&
  p.hooks.pages.includes('beforeChange') &&
  p.hooks.publications.includes('afterChange') &&
  p.hooks.theorems.includes('afterChange') &&
  p.hooks.axioms.includes('afterChange') &&
  p.collections.length === QPU_PAYLOAD_COLLECTIONS.length &&
  p.collections.every((row) => row.nested === true && row.lexical === true && row.references.length > 0) &&
  p.lexical.package === '@payloadcms/richtext-lexical' &&
  p.lexical.nesting === true &&
  p.lexical.skipped.length === 0 &&
  p.lexical.features.length === QPU_PAYLOAD_LEXICAL.features.length &&
  p.lexical.features.includes('relationship') &&
  p.lexical.features.includes('blocks') &&
  p.lexical.features.includes('typography') &&
  p.lexical.features.includes('embed') &&
  p.nesting.plugin === 'nested-docs' &&
  p.nesting.collections.includes('theorems') &&
  p.fused.includes('nested-docs') &&
  p.teleport.to === 'loader' &&
  p.teleport.find === 'payload.find' &&
  p.teleport.recursive === true &&
  p.teleport.vectors === VE_FACES &&
  p.teleport.at === 'once' &&
  p.teleport.fetches === 0 &&
  p.teleport.crawl === false &&
  p.teleport.morph === true &&
  p.teleport.lexical === true &&
  p.teleport.nesting === true &&
  p.teleport.dimensions.faces === VE_FACES &&
  p.teleport.dimensions.combos === QPU_DOORS * RAYS &&
  p.teleport.dimensions.trinity === TRINITY &&
  p.teleport.dimensions.hex === HEXBIT_STATES &&
  p.api.vitepress === 'loader' &&
  p.api.local === 'crud' &&
  p.api.http === 'rest' &&
  p.api.graphql === false &&
  p.api.find === 'payload.find' &&
  p.api.depth === true &&
  !p.packages.some((n) => n.includes('graphql')) &&
  !p.plugins.some((row) => row.package.includes('graphql'))

/** One config for typescript, VitePress hologram, Payload CMS, wrangler, and Node. Replica name/title/host stay out. */
export const qpuConfigOf = () => {
  const href = new URL('/config', `${ORIGIN}/`).href
  const pinNames = Object.keys(QPU_CONFIG_PINS)
  const door = new URL(href)
  const firmware = qpuFirmwareOf()
  const payload = qpuPayloadOf()
  const workerFrameworks = QPU_FRAMEWORKS.filter((f) => f.id !== 'payload')
  const holds =
    workerFrameworks.length === QPU_DEV_PACKAGES.length &&
    workerFrameworks.every((f) => (QPU_DEV_PACKAGES as readonly string[]).includes(f.package)) &&
    pinNames.length === QPU_DEV_PACKAGES.length &&
    QPU_DEV_PACKAGES.every((n) => pinNames.includes(n)) &&
    QPU_FRAMEWORKS.some((f) => f.id === 'vitepress' && f.role === 'hologram') &&
    QPU_FRAMEWORKS.some((f) => f.id === 'payload' && f.role === 'cms') &&
    QPU_EDITORS.length === 2 &&
    QPU_EDITORS[0]?.id === 'vitepress' &&
    QPU_EDITORS[1]?.id === 'payload' &&
    QPU_EDITORS.every((e) => e.visible === false) &&
    QPU_SHARED.editors.length === QPU_EDITORS.length &&
    QPU_SHARED.node === QPU_NODE &&
    QPU_SHARED.typescript === QPU_TSCONFIG &&
    QPU_SHARED.worker === QPU_WORKER_ENTRY &&
    QPU_SHARED.assets === QPU_ASSETS &&
    firmware.visible === false &&
    payload.visible === false &&
    qpuFirmwareHolds(firmware) &&
    qpuPayloadHolds(payload) &&
    payload.skipped.length === 0 &&
    payload.order[payload.order.length - 1] === 'mcp' &&
    QPU_NODE.startsWith('>=') &&
    QPU_WORKER_ENTRY === 'worker.js' &&
    QPU_ASSETS_BINDING === 'ASSETS' &&
    firmware.assets === QPU_ASSETS &&
    QPU_TSCONFIG.strict === true &&
    QPU_TSCONFIG.noEmitOnError === true &&
    qpuSeatOf().seat === 'empty' &&
    door.protocol === 'https:' &&
    door.hostname === QPU_CONFIG_HOST &&
    door.pathname === '/config' &&
    !QPU_CONFIG_HOST.includes('*')
  return {
    kind: 'config' as const,
    holds,
    when: 'never' as const,
    seat: qpuSeatOf().seat,
    href,
    node: QPU_NODE,
    pins: { ...QPU_CONFIG_PINS },
    packages: [...QPU_DEV_PACKAGES],
    frameworks: QPU_FRAMEWORKS.map((f) => ({ ...f })),
    editors: QPU_EDITORS.map((e) => ({ ...e })),
    shared: {
      node: QPU_SHARED.node,
      typescript: { ...QPU_SHARED.typescript },
      worker: QPU_SHARED.worker,
      assets: QPU_SHARED.assets,
      binding: QPU_SHARED.binding,
      compatibilityDate: QPU_SHARED.compatibilityDate,
      editors: QPU_EDITORS.map((e) => e.id),
    },
    fuse: {
      hologram: 'vitepress' as const,
      cms: 'payload' as const,
      editors: QPU_EDITORS.length,
      api: QPU_PAYLOAD_API.local,
    },
    typescript: { ...QPU_TSCONFIG },
    vitepress: { name: firmware.name, role: firmware.role, visible: firmware.visible, assets: firmware.assets, pin: QPU_CONFIG_PINS.vitepress },
    payload: {
      name: payload.name,
      role: payload.role,
      visible: payload.visible,
      pin: payload.pin,
      packages: payload.packages,
      plugins: payload.plugins,
      fused: payload.fused,
      skipped: payload.skipped,
      order: payload.order,
      access: payload.access,
      hooks: payload.hooks,
      collections: payload.collections,
      lexical: payload.lexical,
      nesting: payload.nesting,
      teleport: payload.teleport,
      api: payload.api,
    },
    wrangler: {
      main: QPU_WORKER_ENTRY,
      compatibilityDate: QPU_COMPATIBILITY_DATE,
      assets: QPU_ASSETS,
      binding: QPU_ASSETS_BINDING,
      runWorkerFirst: true as const,
    },
  }
}

export const qpuConfigHolds = (c = qpuConfigOf()): boolean =>
  c.kind === 'config' &&
  c.holds === true &&
  c.when === 'never' &&
  c.seat === 'empty' &&
  c.node === QPU_NODE &&
  c.vitepress.name === 'vitepress' &&
  c.vitepress.role === 'hologram' &&
  c.vitepress.visible === false &&
  c.payload.name === 'payload' &&
  c.payload.role === 'cms' &&
  c.payload.visible === false &&
  c.payload.pin === QPU_PAYLOAD_PIN &&
  c.payload.fused[c.payload.fused.length - 1] === 'mcp' &&
  c.payload.skipped.length === 0 &&
  c.payload.fused.includes('search') &&
  c.editors.length === 2 &&
  c.shared.node === c.node &&
  c.shared.assets === c.wrangler.assets &&
  c.shared.worker === c.wrangler.main &&
  c.fuse.hologram === 'vitepress' &&
  c.fuse.cms === 'payload' &&
  c.fuse.api === 'crud' &&
  c.fuse.editors === c.editors.length &&
  c.payload.api.graphql === false &&
  c.payload.api.local === 'crud' &&
  c.payload.api.http === 'rest' &&
  c.shared.editors[0] === 'vitepress' &&
  c.shared.editors[1] === 'payload' &&
  new URL(c.href).hostname === QPU_CONFIG_HOST &&
  new URL(c.href).pathname === '/config'
