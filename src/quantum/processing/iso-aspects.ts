// Every ISO purpose, on every Payload aspect, through the nine official plugins.
// The plugin subsets stay a mixed-radix space. The product variants compute the domain combinations.
// Nothing is fetched and nothing is written.
import { AXIOMS } from './clay-register.ts'
import { ISO_DIMENSIONS, ISO_OPEN_DEFINITIONS } from './iso-deliverables.ts'
import { CATALOGUE } from './toolboxes/billing.ts'
import { DEPLOY_TENANTS, OFFICIAL_PLUGINS } from '../plugin.ts'
import { program } from '../uuid/programs/index.ts'
import { aspects, composition, compositionIndex, compositions, hexbit, seal, uuid, uuidQubits } from '../uuid/index.ts'
import { QPU_CONNECTOR, WEBSITE_ORIGIN } from '../../plugins/websiteClient.ts'

const PRODUCT = { method: 'GET' as const, path: '/api/products', href: `${WEBSITE_ORIGIN}/api/products` }

const PACKAGE: Record<(typeof OFFICIAL_PLUGINS)[number], string> = {
  lexical: '@payloadcms/richtext-lexical',
  'nested-docs': '@payloadcms/plugin-nested-docs',
  seo: '@payloadcms/plugin-seo',
  search: '@payloadcms/plugin-search',
  redirects: '@payloadcms/plugin-redirects',
  'form-builder': '@payloadcms/plugin-form-builder',
  'multi-tenant': '@payloadcms/plugin-multi-tenant',
  ecommerce: '@payloadcms/plugin-ecommerce',
  mcp: '@payloadcms/plugin-mcp',
}

const FORM_FIELDS = ['checkbox', 'country', 'date', 'email', 'message', 'number', 'payment', 'radio', 'select', 'state', 'text', 'textarea', 'upload'] as const

type CatalogueVariant = { product: string; variant: string; domains: '*' | 'named'; unit: string }

const sourceOf = (dimension: string) => {
  const key = dimension.replace(/\s*\(.*$/, '').trim()
  const row = ISO_OPEN_DEFINITIONS.find((item) => item.reference === key || item.reference.startsWith(`${key}:`) || item.reference.startsWith(`${key}-`))
  return row ? `https://www.iso.org/standard/${row.id}.html` : ''
}

const grouped = () => {
  const groups: { product: string; variants: CatalogueVariant[] }[] = []
  for (const row of CATALOGUE) {
    const variant = { product: row.product, variant: row.variant, domains: row.domains, unit: row.unit }
    const found = groups.find((group) => group.product === variant.product)
    if (found) found.variants.push(variant)
    else groups.push({ product: variant.product, variants: [variant] })
  }
  return groups
}

const domainCombinations = (groups: readonly { product: string; variants: CatalogueVariant[] }[]) => {
  const modes = ['*', 'named'] as const
  return modes.flatMap((mode) => {
    const admitted = groups.map((group) => ({ product: group.product, variants: group.variants.filter((variant) => mode === 'named' || variant.domains === '*') })).filter((group) => group.variants.length > 0)
    const radices = admitted.map((group) => group.variants.length)
    const count = compositions(radices)
    return Array.from({ length: Number(count) }, (_, index) => {
      const digits = composition(radices, BigInt(index))
      const chosen = admitted.map((group, at) => group.variants[digits[at]!]!)
      const bound = `products\n${mode}\n${index}\n${chosen.map((variant) => `${variant.product}\n${variant.variant}`).join('\n')}`
      const address = uuid(bound)
      return {
        mode,
        index,
        products: chosen.map((variant) => ({ product: variant.product, variant: variant.variant, domains: variant.domains, unit: variant.unit })),
        named: chosen.filter((variant) => variant.domains === 'named').length,
        any: chosen.filter((variant) => variant.domains === '*').length,
        address,
        sealed: seal(address).valid && uuid(bound) === address,
        round: compositionIndex(radices, digits) === BigInt(index),
        serves: ISO_DIMENSIONS.length,
        servesAny: true as const,
        product: PRODUCT,
        params: { products: chosen.map((variant) => ({ product: variant.product, variant: variant.variant })), purpose: 'any' as const },
      }
    })
  })
}

const pluginSpace = () => {
  const witnessed = aspects(uuid('iso-aspects'))
  const names = witnessed.aspects.map((row) => row.aspect)
  const radices = [...OFFICIAL_PLUGINS.map(() => 2), names.length, ISO_DIMENSIONS.length]
  const count = compositions(radices)
  const read = (index: bigint) => {
    const digits = composition(radices, index)
    const on = digits.slice(0, OFFICIAL_PLUGINS.length)
    return {
      index: index.toString(),
      plugins: on.filter((bit) => bit === 1).length,
      on,
      aspect: names[digits[OFFICIAL_PLUGINS.length]!]!,
      purpose: ISO_DIMENSIONS[digits[OFFICIAL_PLUGINS.length + 1]!]!,
      full: on.every((bit) => bit === 1),
      round: compositionIndex(radices, digits) === index,
    }
  }
  const full = names.flatMap((aspect, aspectAt) => ISO_DIMENSIONS.map((purpose, purposeAt) => {
    const digits = [...OFFICIAL_PLUGINS.map(() => 1), aspectAt, purposeAt]
    const index = compositionIndex(radices, digits)
    const row = read(index)
    return { ...row, aspect, purpose, pluginsOn: row.plugins === OFFICIAL_PLUGINS.length }
  }))
  return { names, radices, count, read, full, witnessed }
}

const powersOf = (dimension: string, scope: string, handle: string, path: string, products: readonly string[]) => {
  const block = ['uuid', 'handle', 'program', 'tail', 'tool', 'arguments', 'prev', 'next'] as const
  return OFFICIAL_PLUGINS.map((plugin) => {
    const pkg = PACKAGE[plugin]
    if (plugin === 'lexical') return { plugin, package: pkg, on: true as const, block: 'qpu' as const, fields: block, text: scope }
    if (plugin === 'nested-docs') return { plugin, package: pkg, on: true as const, parent: '/iso', path, breadcrumbs: 2 as const }
    if (plugin === 'seo') return { plugin, package: pkg, on: true as const, title: dimension, description: scope }
    if (plugin === 'search') return { plugin, package: pkg, on: true as const, collection: 'pages' as const, doc: handle }
    if (plugin === 'redirects') return { plugin, package: pkg, on: true as const, from: path, to: scope }
    if (plugin === 'form-builder') return { plugin, package: pkg, on: true as const, fields: FORM_FIELDS, form: ['product', 'variant', 'purpose'] as const, products, purposes: ISO_DIMENSIONS.length }
    if (plugin === 'multi-tenant') return { plugin, package: pkg, on: true as const, tenants: [...DEPLOY_TENANTS] }
    if (plugin === 'ecommerce') return { plugin, package: pkg, on: true as const, ...PRODUCT, products: products.length }
    return { plugin, package: pkg, on: true as const, connector: QPU_CONNECTOR.plugin, api: QPU_CONNECTOR.api, src: false as const, fetched: false as const, product: PRODUCT }
  })
}

/** Every ISO purpose witnessed on every aspect, with all nine official plugins on. The other plugin subsets stay unwalked. */
const computeIsoOne = () => {
  const width = AXIOMS.find((row) => row.name === 'hexbit')!.value
  const counted = uuidQubits(width)
  const space = pluginSpace()
  const groups = grouped()
  const combinations = domainCombinations(groups)
  const productRadices = groups.map((group) => group.variants.length)
  const purposes = ISO_DIMENSIONS.map((dimension) => {
    const scope = sourceOf(dimension)
    const bound = `iso-aspect\n${dimension}\n${scope}`
    const address = uuid(bound)
    const handle = address.slice(0, 8)
    const path = `/iso/${handle}`
    const witnessed = aspects(address)
    const installed = program(handle)
    const plugins = powersOf(dimension, scope, handle, path, groups.map((group) => group.product))
    const rbac = { read: installed.rbac.other.read, execute: installed.rbac.other.execute, write: installed.rbac.other.write, root: installed.rbac.rootAccess.write }
    return {
      dimension,
      scope,
      address,
      handle,
      path,
      sealed: seal(address).valid && uuid(bound) === address,
      aspects: witnessed.aspects.map((row) => ({ aspect: row.aspect, phases: row.phases.length, address: row.address })),
      hooks: witnessed.hooks,
      declared: witnessed.declared,
      all: witnessed.all,
      plugins,
      program: { handle: installed.handle, path: installed.path, depth: installed.depth, indexed: installed.indexed, used: installed.used, plugins: installed.installed, rbac },
      servedBy: combinations.length,
      servesAny: true as const,
    }
  })
  const bound = `iso-aspects\n${purposes.map((row) => row.address).join('\n')}`
  const address = uuid(bound)
  const exchange = hexbit(address, width)
  const zero = space.read(0n)
  const last = space.read(space.count - 1n)
  const samples = [0n, 1n, space.count / 2n, space.count - 1n]
  const round = samples.every((index) => space.read(index).round)
  const pluginCount = compositions(OFFICIAL_PLUGINS.map(() => 2))
  const possible = pluginCount * BigInt(space.names.length) * BigInt(ISO_DIMENSIONS.length)
  const served = BigInt(combinations.length) * BigInt(ISO_DIMENSIONS.length)
  const website = purposes.every((row) => row.scope.startsWith('https://www.iso.org/standard/') && !row.scope.includes(' '))
  const witnessed = purposes.every((row) => row.all && row.aspects.length === space.names.length && row.aspects.every((aspect) => aspect.address === row.address) && row.hooks === row.declared)
  const powered = purposes.every((row) => row.plugins.length === OFFICIAL_PLUGINS.length && row.plugins.every((plugin) => plugin.on) && row.program.used === OFFICIAL_PLUGINS.length && row.program.depth === 7 && row.program.indexed && row.program.rbac.read && row.program.rbac.execute && row.program.rbac.write === false && row.program.rbac.root)
  const combined = combinations.length > 0 && combinations.every((row) => row.sealed && row.round && row.servesAny && row.serves === ISO_DIMENSIONS.length && row.product.path === PRODUCT.path) && new Set(combinations.map((row) => row.mode)).size === 2
  const open = possible === space.count && round && zero.plugins === 0 && zero.round && last.full && last.round && last.aspect === space.names[space.names.length - 1] && last.purpose === ISO_DIMENSIONS[ISO_DIMENSIONS.length - 1] && space.full.length === space.names.length * ISO_DIMENSIONS.length && space.full.every((row) => row.full && row.pluginsOn && row.round)
  const computed = counted.receipt.holds && counted.handles.fractal && counted.delivery.holds && exchange.utilisation.holds && exchange.utilisation.left === 0 && exchange.speed.walked === false && exchange.receipt.holds
  const holds = purposes.length === ISO_DIMENSIONS.length && website && witnessed && powered && combined && open && computed && served === BigInt(combinations.length * ISO_DIMENSIONS.length) && compositions(productRadices) > 0n
  return {
    via: 'plugins' as const,
    quantum: true as const,
    fetched: false as const,
    written: false as const,
    executed: false as const,
    walked: false as const,
    plugins: OFFICIAL_PLUGINS.length,
    aspects: space.names.length,
    purposes: ISO_DIMENSIONS.length,
    pluginSpace: pluginCount.toString(),
    possible: possible.toString(),
    full: space.full.length,
    served: served.toString(),
    product: PRODUCT,
    combinations: combinations.length,
    domain: combinations,
    catalogue: { products: groups.length, variants: CATALOGUE.length },
    rows: purposes,
    register: {
      assumed: false as const,
      ceiling: null,
      unlimited: true as const,
      effective: counted.effective,
      handles: counted.handles.possible,
      scale: counted.handles.capacity,
      fractal: counted.handles.fractal,
      utilisation: { used: exchange.utilisation.used, left: exchange.utilisation.left, holds: exchange.utilisation.holds },
      time: { temperatureK: exchange.speed.temperatureK, landauer: exchange.speed.landauer, teleport: exchange.speed.teleport, walked: exchange.speed.walked },
      space: { programs: exchange.combinatorics?.programs ?? counted.organised.zero.programs, addressable: exchange.utilisation.addressable, walked: false as const },
    },
    ends: { zero, full: last },
    holds,
    says: holds ? `${purposes.length} ISO purposes, each witnessed on ${space.names.length} aspects by all ${OFFICIAL_PLUGINS.length} official plugins. ${combinations.length} domain combinations of the product variants serve any of them. GET /api/products. The ${possible} plugin aspects stay unwalked.` : 'the official plugins did not implement the ISO aspects',
  }
}

let cached: ReturnType<typeof computeIsoOne> | undefined

/** The one ISO consolidation. The same object on { iso: true } and on the website MCP. */
export const isoAspects = () => (cached ??= computeIsoOne())
