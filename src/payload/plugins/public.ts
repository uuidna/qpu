import '../../mcp/families.js'
import { blocks } from '../../blocks/index.js'
import { CLOUDFLARE_PLUGINS } from '../../deployment/payload-cloudflare.js'
import { CloudFormulas } from '../../families/cloud/index.js'
import { CombinatoricsFormulas } from '../../families/combinatorics/index.js'
import { LawFormulas } from '../../families/law/index.js'
import { PublishingFormulas } from '../../families/publishing/index.js'
import { RuleFormulas } from '../../families/rule/index.js'
import { WaveFormulas } from '../../families/wave/index.js'
import { customOf } from '../../fields/blockFields.js'
import { qpuFacesOf, qpuHexFamiliesOf, qpuNetworkToolsOf, qpuStepsOf, unit } from '../../quantum/processing/unit/index.js'
import { qpuMachinesHolds, qpuMachinesOf } from '../../quantum/processing/unit/zeropage.js'
import { openMathScaleOf } from './clay.js'
import { usageBillOf } from './billing.js'

/** The plugin axis length the combination key already multiplies. Not a variant count. */
export const pluginAxisLengthOf = () => CLOUDFLARE_PLUGINS.length

/** Layout blocks the seed has not already placed on home, search, or the license page. */
export const unpagedLayoutBlocksOf = () =>
  blocks.filter((b) => b.admin?.group === 'Layout' && !(customOf(b).needs?.length) && !['search', 'products', 'hero'].includes(b.slug))

const readingOf = (formula: string, row: { hex?: string; value: number; holds: boolean }, params: readonly number[]) => ({
  formula,
  params: [...params],
  hex: row.hex ?? null,
  value: row.value,
  holds: row.holds,
})

/**
 * A sale on a uuidna.com host pays the author's royalty. publishing.royalty(sales, rate) = ⌊sales · rate / 100⌋.
 * The rate integer is unset, so the call passes null and the formula returns 0 with holds false. No price is invented.
 * Licence stays CC-BY-NC-ND-4.0. priceInUSDEnabled stays false on the product.
 */
export const saleRoyaltyOf = (host = unit.host) => {
  const onUuidna = host === 'uuidna.com' || host.endsWith('.uuidna.com')
  const sales = null
  const rate = null
  if (!onUuidna) {
    return {
      name: 'publishing.royalty' as const,
      host,
      called: false as const,
      params: { sales, rate },
      missing: 'rate' as const,
      value: null,
      holds: false as const,
      uuid: null,
    }
  }
  const row = PublishingFormulas.royalty(sales as unknown as number, rate as unknown as number)
  return {
    name: 'publishing.royalty' as const,
    formula: row.formula,
    host,
    called: true as const,
    params: { sales, rate },
    missing: 'rate' as const,
    value: Number.isFinite(row.value) ? row.value : null,
    holds: row.holds === true,
    uuid: row.hex ?? null,
  }
}

/** What the main license and law.reviewed(0) already permit a public user to do. confirmed stays 0. */
export const licenseManageOf = () => {
  const reviewed = LawFormulas.reviewed(0)
  const lawful = LawFormulas.lawful(0)
  return {
    kind: 'license' as const,
    spdx: 'CC-BY-NC-ND-4.0' as const,
    file: 'LICENSE' as const,
    deed: 'https://creativecommons.org/licenses/by-nc-nd/4.0/' as const,
    share: 'unchanged' as const,
    commercial: '/license' as const,
    reviewed: { ...readingOf('law.reviewed', reviewed, [0]), lead: true as const, note: 'not advice' as const },
    lawful: readingOf('law.lawful', lawful, [0]),
    citation: openMathScaleOf().citation,
    bill: usageBillOf(),
    royalty: saleRoyaltyOf(),
  }
}

/**
 * No registered formula is a product-variant. The absence is the lead.
 * combinatorics.binomial of the plugin axis is the fused count. A variant factor is not applied.
 * The wave size is the lattice face count.
 */
export const variantLeadOf = async () => {
  await import('@uuidna/qpu/mcp/families.js')
  const axis = pluginAxisLengthOf()
  const binomial = CombinatoricsFormulas.binomial(axis)
  const faces = qpuFacesOf().faces
  const registered = [...qpuHexFamiliesOf()].flatMap(([family, fs]) => fs.map((f) => ({ family, name: f.name, arity: f.arity })))
  const product = registered.filter((f) => f.name === 'product')
  const variant = registered.filter((f) => f.name.toLowerCase().includes('variant'))
  const paired = registered.filter((f) => f.name.toLowerCase().includes('product') && f.name.toLowerCase().includes('variant'))
  return {
    kind: 'product-variant-lead' as const,
    lead: paired.length === 0,
    hex: null as null,
    value: null as null,
    holds: false as const,
    absent: 'src/families/ecommerce/index.ts has no variant formula. No family is named product. No registered formula name contains both product and variant. src/payload-types.ts names variants and variantOptions and no hex is registered for them.',
    product,
    variant,
    combinatorics: {
      ...readingOf('combinatorics.binomial', binomial, [axis]),
      faces,
      variantFactor: null as null,
    },
  }
}

/** Previous page is the request referer. Next page is the lattice step. The counts are the plugin axis, the face slice, and waves of that slice. */
export const navigationOf = async () => {
  const axis = pluginAxisLengthOf()
  const faces = qpuFacesOf().faces
  const binomial = CombinatoricsFormulas.binomial(axis)
  const slice = RuleFormulas.slice()
  const cap = RuleFormulas.cap()
  const waves = WaveFormulas.waves(faces)
  const agents = WaveFormulas.agents(faces)
  const saved = WaveFormulas.saved(faces)
  const steps = qpuStepsOf()
  return {
    page: '/' as const,
    previous: { field: null as null, file: 'src/collections/Pages.ts' as const },
    next: {
      path: steps.next.door.path,
      node: steps.next.node,
      face: steps.next.face,
      tool: steps.next.door.tool,
      holds: steps.holds === true,
    },
    binomial: readingOf('combinatorics.binomial', binomial, [axis]),
    slice: readingOf('rule.slice', slice, []),
    cap: readingOf('rule.cap', cap, []),
    waves: readingOf('wave.waves', waves, [faces]),
    agents: readingOf('wave.agents', agents, [faces]),
    saved: readingOf('wave.saved', saved, [faces]),
    pieces: [
      { piece: 'breadcrumb' as const, file: 'src/components/ui/breadcrumb.tsx', renders: 'src/components/Public/index.tsx' },
      { piece: 'doc-breadcrumb' as const, file: 'src/components/Doc/index.tsx', renders: 'src/components/Doc/index.tsx', referer: null as null, next: null as null },
      { piece: 'program-breadcrumb' as const, file: 'src/components/Program/index.tsx', renders: 'src/components/Program/index.tsx', referer: null as null, next: null as null },
      { piece: 'header' as const, file: 'src/components/Header/index.tsx', referer: null as null, next: null as null },
      { piece: 'footer' as const, file: 'src/components/Footer/index.tsx', referer: null as null, next: null as null },
      { piece: 'pager' as const, file: 'src/families/pagination/index.ts', referer: null as null, next: null as null },
      { piece: 'vitepress' as const, file: 'src/deployment/payload-cloudflare.ts', referer: null as null, next: null as null },
      { piece: 'shared-config' as const, file: 'src/mcp/families.ts', referer: null as null, next: null as null },
    ],
  }
}

/**
 * The network the tree already has: net_* doors, the machine list, the unit host.
 * qpuNetworkMcpOf has no slot for a machine row. That absence is the lead.
 * Scale is cloud.scale, and only when perNode > 0. The call is the one cloud/test.ts already makes.
 */
export const networkMachineOf = () => {
  const machines = qpuMachinesOf()
  const row = machines.rows[0]
  const load = 100
  const perNode = 30
  const scale = perNode > 0 ? CloudFormulas.scale(load, perNode) : undefined
  const here = row?.name === 'Pravets 8M' && row.when === 'here'
  return {
    kind: 'network-machine' as const,
    file: 'src/quantum/processing/unit/index.ts' as const,
    catalog: 'qpuNetworkMcpOf' as const,
    host: unit.host,
    doors: qpuNetworkToolsOf().map((tool) => tool.name),
    machineList: 'src/quantum/processing/unit/zeropage.ts' as const,
    lead: true as const,
    absent: 'src/quantum/processing/unit/index.ts qpuNetworkMcpOf has hop, when, lanes, routes, channels, and holds. qpuComputerOf network has kind, href, hop, and holds. Neither has a slot for a machine row. The net_* doors stay on that catalog. The machine list stays in src/quantum/processing/unit/zeropage.ts. unit.host stays the unit host. No second network is added.',
    index: 0 as const,
    pravets: here && row
      ? {
          name: row.name,
          when: row.when,
          wordBits: row.wordBits,
          spec: row.spec,
          oneRegisterFidelity: row.oneRegisterFidelity,
          ...(row.note ? { note: row.note } : {}),
          lead: row.lead,
          registerNext: row.registerNext,
        }
      : null,
    machinesHold: qpuMachinesHolds(machines),
    scale: scale
      ? { ...readingOf('cloud.scale', scale, [load, perNode]), condition: 'perNode > 0' as const }
      : null,
  }
}

/** Doors the unit already lists. Descriptions are not copied onto the page. */
export const doorsOf = async () => {
  try {
    const { qpuMcpDoorsOf } = await import('../../quantum/processing/unit/mcp.js')
    const d = qpuMcpDoorsOf()
    return {
      doors: d.doors.map((row) => ({ name: row.name, kind: row.kind })),
      formulas: d.formulas.length,
      holds: d.holds === true,
      absent: null as string | null,
    }
  } catch (e) {
    return {
      doors: [] as { name: string; kind: string }[],
      formulas: 0,
      holds: false,
      absent: `src/quantum/processing/unit/mcp.ts qpuMcpDoorsOf did not answer: ${e instanceof Error ? e.message : String(e)}`,
    }
  }
}

const hrefOf = (slug: string): string => {
  if (slug === 'hero') return '/'
  if (slug === 'products' || slug === 'form') return '/license'
  if (slug === 'receipt') return '/receipts'
  return `/${slug}`
}

/** Every block folder registered in src/blocks and src/components/blocks. */
export const blockReachOf = () =>
  blocks.map((b) => {
    const needs = [...(customOf(b).needs ?? [])]
    const placed = needs.length === 0 || b.slug === 'form' || b.slug === 'program' || b.slug === 'receipt'
    return {
      slug: b.slug,
      group: String(b.admin?.group ?? ''),
      description: customOf(b).description,
      href: hrefOf(b.slug),
      needs,
      placed,
      registered: 'src/blocks/index.ts' as const,
      renders: 'src/components/blocks/index.ts' as const,
    }
  })

/** Form-builder field block types from src/payload-types.ts, and whether CMSForm draws them. */
export const formFieldsOf = () => [
  { blockType: 'checkbox', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
  { blockType: 'country', file: 'src/payload-types.ts', renders: false, absent: 'Country has no options list in this tree' },
  { blockType: 'email', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
  { blockType: 'message', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
  { blockType: 'number', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
  { blockType: 'select', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
  { blockType: 'state', file: 'src/payload-types.ts', renders: false, absent: 'State has no options list in this tree' },
  { blockType: 'text', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
  { blockType: 'textarea', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
] as const

/** Components under src/components that are not blocks. A file no page imports stays a lead. */
export const componentsOf = () => [
  { file: 'src/components/RenderBlocks/index.tsx', renders: 'a page layout', page: true },
  { file: 'src/components/BlockWrapper/index.tsx', renders: 'heading, intro, anchor', page: true },
  { file: 'src/components/CMSForm/index.tsx', renders: 'a form-builder form', page: true },
  { file: 'src/components/CMSLink/index.tsx', renders: 'a link or a row of links', page: true },
  { file: 'src/components/Header/index.tsx', renders: 'the site header', page: true },
  { file: 'src/components/Footer/index.tsx', renders: 'the site footer', page: true },
  { file: 'src/components/ThemeSelector/index.tsx', renders: 'the theme control in the header', page: true },
  { file: 'src/components/Doc/index.tsx', renders: 'a doc', page: true },
  { file: 'src/components/Family/index.tsx', renders: 'a formula family', page: true },
  { file: 'src/components/Program/index.tsx', renders: 'a hex run', page: true },
  { file: 'src/components/Relations/index.tsx', renders: 'discovery relations, identities, seals', page: true },
  { file: 'src/components/LiveTable/index.tsx', renders: 'live source rows', page: true },
  { file: 'src/components/blocks/_generic.tsx', renders: 'the shared block vocabulary', page: true },
  { file: 'src/components/Public/index.tsx', renders: 'license, variant lead, doors, network lead, block reach', page: true },
  { file: 'src/components/ui/badge.tsx', renders: 'a badge', page: true },
  { file: 'src/components/ui/breadcrumb.tsx', renders: 'a breadcrumb', page: true },
  { file: 'src/components/ui/button.tsx', renders: 'a button', page: true },
  { file: 'src/components/ui/card.tsx', renders: 'a card', page: true },
  { file: 'src/components/ui/input.tsx', renders: 'an input', page: true },
  { file: 'src/components/ui/label.tsx', renders: 'a label', page: true },
  { file: 'src/components/ui/separator.tsx', renders: 'a separator', page: false },
  { file: 'src/components/ui/table.tsx', renders: 'a table', page: true },
  { file: 'src/components/ui/tabs.tsx', renders: 'tabs', page: false },
  { file: 'src/components/ui/textarea.tsx', renders: 'a textarea', page: true },
] as const

export const publicSurfaceOf = async () => ({
  kind: 'public-surface' as const,
  page: '/' as const,
  license: licenseManageOf(),
  navigation: await navigationOf(),
  variant: await variantLeadOf(),
  doors: await doorsOf(),
  network: networkMachineOf(),
  blocks: blockReachOf(),
  forms: formFieldsOf(),
  components: componentsOf(),
  document: '/api/qpu/permaculture?full=true' as const,
  schema: '/api/qpu/permaculture?man=true' as const,
})
