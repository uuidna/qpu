/**
 * Ecommerce products / services / variations as MCP-formulated enums.
 *
 * Each option is a door + args (+ hex when mintable). Variations = formula params the
 * tree names. Price is a CrossFormula relation (priceRelationOf) — not priceInUSD.
 * Connector `{ ecommerce: true }` serves this reading. Connect bill is measured on tools/list.
 */
import '../../families/ecommerce/index.js'
import '../../families/access/index.js'
import '../../families/crypt/index.js'
import { CLAY_SEALS, ClaySeals } from '../../families/clay/index.js'
import { CombinatoricsFormulas } from '../../families/combinatorics/index.js'
import { CryptFormulas } from '../../families/crypt/index.js'
import { CloudFormulas } from '../../families/cloud/index.js'
import { LawFormulas } from '../../families/law/index.js'
import { MonitoringFormulas } from '../../families/monitoring/index.js'
import { RuleFormulas } from '../../families/rule/index.js'
import { packageVersion } from '../../quantum/processing/unit/version.js'
import {
  mintOf,
  qpuCybersecurityToolsOf,
  qpuFacesOf,
  qpuHarnessesOf,
  qpuHexFamiliesOf,
  qpuHexUuidOf,
  qpuHostsOf,
  qpuLatticeNamesOf,
  qpuMcpToolsListOf,
  qpuTenantZoneOf,
  unit,
} from '../../quantum/processing/unit/index.js'
import { CLOUDFLARE_PLUGINS } from '../../deployment/payload-cloudflare.js'
import { modeAccessOf } from './access-mode.js'
import { usageBillOf } from './billing.js'
import { clayPrizeOf, openMathScaleOf } from './clay.js'
import { nativeAdapterEnumOf } from './native-adapters.js'
import { catalogPriceRelationOf, type PriceRelation } from './price-relation.js'
import type { QpuPlugin } from './surface.js'
import { qpuPublicOf } from '../../quantum/processing/unit/zeropage.js'

export const FUSED_SALE_DOORS = [
  'hex', 'data', 'discover', 'crypt', 'np', 'upgrade', 'video', 'domains',
  'connector', 'permaculture', 'hologram', 'papers', 'api',
] as const

export const ECOMMERCE_FORMULAS = [
  'cart', 'discount', 'shipping', 'margin', 'aov', 'conversion', 'refund', 'inventory',
] as const

/** Param names per ecommerce formula (tree src). Variations = these slots. */
export const ECOMMERCE_PARAMS = {
  cart: ['items', 'price'],
  discount: ['price', 'pct'],
  shipping: ['weight', 'rate'],
  margin: ['price', 'cost'],
  aov: ['revenue', 'orders'],
  conversion: ['orders', 'visits'],
  refund: ['price', 'pct'],
  inventory: ['stock', 'sold'],
} as const satisfies Record<(typeof ECOMMERCE_FORMULAS)[number], readonly string[]>

export const NEED_FIELDS = ['organisation', 'use', 'tenant'] as const

/** What an enum improves when used as a product/variation select. */
export type EnumImproves = 'security' | 'combinatorics' | 'scale' | 'need' | 'seal' | 'serve' | 'access'

/**
 * Unix/Linux mode bits — product access is chmod-style, not an entitlement graph.
 * r=4 w=2 x=1; ugo classes; digit 0..7 = --- .. rwx. Maps onto access.* hex formulas.
 */
export const UNIX_MODE_BITS = { r: 4, w: 2, x: 1 } as const
export const UNIX_UGO = ['u', 'g', 'o'] as const
export const UNIX_MODE_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7] as const
export const UNIX_MODE_LABELS = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'] as const
/** Hexbit handles 0..15 — access.root / access.rank (UID 0 is root). */
export const UNIX_HANDLES = 16 as const

/** One select/enum option = an MCP call address (not a bare string). */
export type McpEnumOption = {
  /** Payload variantOptions.value */
  value: string
  label: string
  door: string
  args: Record<string, unknown>
  /** family.formula when hex-backed */
  address: string | null
  hex: string | null
  /** Formula param slots (tree names); values unset in the enum */
  params: readonly string[]
  /** Price is court-tried on the offer via catalogPriceRelationOf — not a USD field. */
  price: 'relation'
}

export type FormulatedEnum = {
  /** Payload variantTypes.name / select field name */
  name: string
  label: string
  collection: 'variantTypes' | 'products' | 'tenants' | 'usage'
  source: string
  improves?: readonly EnumImproves[]
  options: readonly McpEnumOption[]
}

/** Access formulas for crypto-backed SKU / tenant isolation (param names from tree). */
export const ACCESS_PARAMS = {
  read: ['status', 'role'],
  write: ['role', 'user', 'owner'],
  role: ['have', 'need'],
  tenant: ['req', 'doc', 'role'],
  screen: ['flags'],
  token: ['bits'],
  root: ['h'],
  rank: ['h'],
  grant: ['actor', 'target'],
  sudo: ['from', 'to'],
} as const

/** Combinatorics formulas — lattice/batch variations as params. */
export const COMBINATORICS_PARAMS = {
  binomial: ['n'],
  combinations: ['n', 'k'],
  permutations: ['n', 'k'],
  multichoose: ['n', 'k'],
  factorial: ['n'],
  catalan: ['n'],
  derangement: ['n'],
  stars: ['n', 'k'],
} as const

/** Crypt formulas — post-quantum / forgery readings for secure SKUs. */
export const CRYPT_PARAMS = {
  knownAnswers: [] as const,
  curveQuantumBits: ['curveBits'],
  curveClassicalBits: ['curveBits'],
  symmetricQuantumBits: ['keyBits'],
  tagForgery: ['bytes'],
  nonceCollision: ['messages'],
} as const

/** Cloud formulas — scale and related measures. */
export const CLOUD_PARAMS = {
  scale: ['load', 'perNode'],
  cost: ['hours', 'rate'],
  uptime: ['up', 'total'],
  latency: ['total', 'requests'],
  throughput: ['requests', 'seconds'],
  storage: ['objects', 'size'],
  egress: ['bytes', 'rate'],
  sla: ['uptime', 'target'],
} as const

export type FormulatedTenant = {
  slug: string
  name: string
  domain: string
  client: string | null
  collection: 'tenants'
  source: string
}

export type FormulatedModel = {
  face: number
  llm: string
  hostHarness: string
  call: string
  schema: string
  result: string
  source: 'qpuHostsOf'
}

const hexOf = (family: string, formula: string, zeros: number[]): string | null => {
  try {
    return qpuHexUuidOf({ family, program: [formula], params: zeros })
  } catch {
    return null
  }
}

const mcp = (
  value: string,
  label: string,
  door: string,
  args: Record<string, unknown>,
  extra: { address?: string | null; hex?: string | null; params?: readonly string[] } = {},
): McpEnumOption => ({
  value,
  label,
  door,
  args,
  address: extra.address ?? null,
  hex: extra.hex ?? null,
  params: extra.params ?? [],
  price: 'relation',
})

/**
 * Sold tenants for ecommerce seed/enums (slim).
 * Full MCP tenant registry with models/needs lives in tenants.ts formulatedTenantsOf.
 */
export const ecommerceSoldTenantsOf = () => {
  const zone = qpuTenantZoneOf()
  const sold: FormulatedTenant[] = [
    {
      slug: zone.own,
      name: unit.host,
      domain: unit.host,
      client: null,
      collection: 'tenants',
      source: 'seed ROOT_TENANT · unit.host',
    },
    {
      slug: 'perma',
      name: 'perma',
      domain: `perma.${zone.zone}`,
      client: 'perma.family',
      collection: 'tenants',
      source: 'permaTenantOf / leads perma.family',
    },
  ]
  return { zone, sold, reserved: zone.reserved }
}

/** @deprecated use ecommerceSoldTenantsOf — sibling tenants.ts owns formulatedTenantsOf */
export const formulatedTenantsOf = ecommerceSoldTenantsOf

const familyEnum = (
  name: string,
  label: string,
  family: string,
  formulas: readonly string[],
  paramMap: Record<string, readonly string[]>,
  improves: readonly EnumImproves[],
  source: string,
): FormulatedEnum => {
  const reg = qpuHexFamiliesOf().get(family) ?? []
  return {
    name,
    label,
    collection: 'variantTypes',
    source,
    improves,
    options: formulas.map((formula) => {
      const arity = reg.find((f) => f.name === formula)?.arity ?? (paramMap[formula]?.length ?? 0)
      const zeros = Array.from({ length: arity }, () => 0)
      const params = [...(paramMap[formula] ?? Array.from({ length: arity }, (_, i) => `p${i}`))]
      return mcp(formula, `${family}.${formula}`, 'hex', {
        family,
        program: [formula],
        params: zeros,
      }, {
        address: `${family}.${formula}`,
        hex: hexOf(family, formula, zeros),
        params,
      })
    }),
  }
}

/** LLM seats (qpuHostsOf) — specific models MCP serves per face. */
export const formulatedModelsOf = (): FormulatedModel[] => {
  const hosts = qpuHostsOf()
  return hosts.nodes.map((node, face) => ({
    face,
    llm: node.llm,
    hostHarness: hosts.harnesses[face]!.name,
    call: node.call,
    schema: node.schema,
    result: node.result,
    source: 'qpuHostsOf' as const,
  }))
}

/**
 * Enums used by product / service / variation / tenant selects —
 * every option is MCP-formulated (door / hex / params).
 */
export const formulatedEnumsOf = (): FormulatedEnum[] => {
  const tenants = formulatedTenantsOf()
  const models = formulatedModelsOf()
  const tools = qpuMcpToolsListOf()
  const harnesses = qpuHarnessesOf()
  const lattice = qpuLatticeNamesOf()
  const faces = qpuFacesOf()
  const ecommerceFamily = qpuHexFamiliesOf().get('ecommerce') ?? []

  const tenantEnum: FormulatedEnum = {
    name: 'tenant',
    label: 'Tenant',
    collection: 'tenants',
    source: 'formulatedTenantsOf · connector { tenant }',
    options: tenants.sold.map((t) =>
      mcp(t.slug, t.domain, 'connector', { tenant: t.slug }, {
        address: `tenant.${t.slug}`,
        params: [],
      }),
    ),
  }

  const llmEnum: FormulatedEnum = {
    name: 'llm',
    label: 'Host LLM seat',
    collection: 'variantTypes',
    source: 'qpuHostsOf().llms · connector { model }',
    options: models.map((m) =>
      mcp(m.llm, `${m.llm}@${m.hostHarness}`, 'connector', { model: m.llm, llm: m.llm }, {
        address: `host.llm.${m.llm}`,
        params: ['face'],
      }),
    ),
  }

  const hostHarnessEnum: FormulatedEnum = {
    name: 'hostHarness',
    label: 'Host harness',
    collection: 'variantTypes',
    source: 'qpuHostsOf().harnesses',
    options: models.map((m) =>
      mcp(m.hostHarness, m.hostHarness, 'connector', { model: m.hostHarness }, {
        address: `host.harness.${m.hostHarness}`,
        params: ['face'],
      }),
    ),
  }

  const sealedDoorEnum: FormulatedEnum = {
    name: 'door',
    label: 'Sealed MCP door',
    collection: 'variantTypes',
    source: 'qpuMcpToolsListOf · tools/call <door>',
    options: tools.map((t) =>
      mcp(t.name, t.name, t.name, {}, { address: `door.${t.name}`, params: [] }),
    ),
  }

  const fusedDoorEnum: FormulatedEnum = {
    name: 'fusedDoor',
    label: 'Fused MCP door',
    collection: 'variantTypes',
    source: 'qpuMcpFuseOf · tools/call <fused>',
    options: FUSED_SALE_DOORS.map((d) =>
      mcp(d, d, d, d === 'connector' ? { ecommerce: true } : {}, {
        address: `fused.${d}`,
        params: [],
      }),
    ),
  }

  const connectorHarnessEnum: FormulatedEnum = {
    name: 'harness',
    label: 'Connector harness',
    collection: 'variantTypes',
    source: 'qpuHarnessesOf().rows',
    options: harnesses.rows.map((r) =>
      mcp(r.harness, r.harness, 'connector', { harness: r.harness }, {
        address: `harness.${r.kind}`,
        params: [],
      }),
    ),
  }

  const harnessKindEnum: FormulatedEnum = {
    name: 'harnessKind',
    label: 'Harness kind',
    collection: 'variantTypes',
    source: 'qpuHarnessesOf().rows.kind',
    options: [...new Set(harnesses.rows.map((r) => r.kind))].map((k) =>
      mcp(k, k, 'connector', { kind: k }, { address: `harness.kind.${k}`, params: [] }),
    ),
  }

  const ecommerceEnum: FormulatedEnum = {
    name: 'ecommerceFormula',
    label: 'Ecommerce formula',
    collection: 'variantTypes',
    source: 'src/families/ecommerce · tools/call hex',
    options: ECOMMERCE_FORMULAS.map((name) => {
      const arity = ecommerceFamily.find((f) => f.name === name)?.arity ?? ECOMMERCE_PARAMS[name].length
      const zeros = Array.from({ length: arity }, () => 0)
      const params = [...ECOMMERCE_PARAMS[name]]
      return mcp(name, `ecommerce.${name}`, 'hex', {
        family: 'ecommerce',
        program: [name],
        params: zeros,
      }, {
        address: `ecommerce.${name}`,
        hex: hexOf('ecommerce', name, zeros),
        params,
      })
    }),
  }

  const arityEnum: FormulatedEnum = {
    name: 'arity',
    label: 'Formula arity',
    collection: 'variantTypes',
    source: 'qpuHexFamiliesOf().arity',
    options: [...new Set([...qpuHexFamiliesOf()].flatMap(([, fs]) => fs.map((f) => f.arity)))]
      .sort((a, b) => a - b)
      .map((a) =>
        mcp(String(a), `arity ${a}`, 'hex', { arity: a }, {
          address: `hex.arity.${a}`,
          params: Array.from({ length: a }, (_, i) => `p${i}`),
        }),
      ),
  }

  const latticeEnum: FormulatedEnum = {
    name: 'lattice',
    label: 'Lattice name',
    collection: 'variantTypes',
    source: 'qpuLatticeNamesOf',
    options: Object.keys(lattice).map((k) =>
      mcp(k, k, 'connector', { point: true, lattice: k }, {
        address: `lattice.${k}`,
        params: [],
      }),
    ),
  }

  const saleNeedEnum: FormulatedEnum = {
    name: 'saleNeed',
    label: 'Sale need field',
    collection: 'products',
    source: 'products.organisation / products.use / usage.tenant',
    options: NEED_FIELDS.map((field) =>
      mcp(field, field, 'connector', { ecommerce: true, need: field }, {
        address: field === 'tenant' ? 'usage.tenant' : `products.${field}`,
        params: [],
      }),
    ),
  }

  const pluginEnum: FormulatedEnum = {
    name: 'plugin',
    label: 'Cloudflare plugin axis',
    collection: 'variantTypes',
    source: 'CLOUDFLARE_PLUGINS',
    options: CLOUDFLARE_PLUGINS.map((p) =>
      mcp(p, p, 'connector', { ecommerce: true, plugin: p }, {
        address: `plugin.${p}`,
        params: [],
      }),
    ),
  }

  // Combinatorics: width/from/passes are 2ⁿ or faces-multiples — not arbitrary select ints.
  const L = qpuLatticeNamesOf()
  const bin4 = CombinatoricsFormulas.binomial(4) // 16 = tools/list size
  const bin3 = CombinatoricsFormulas.binomial(3) // 8 = harnesses / sealed half / chmod triad
  const bin2 = CombinatoricsFormulas.binomial(2) // 4
  const bin1 = CombinatoricsFormulas.binomial(1) // 2 = coins
  const face = faces.faces
  const coinsN = L.coins
  const combFace2 = CombinatoricsFormulas.combinations(face, 2)

  const waveEnum: FormulatedEnum = {
    name: 'waveSweep',
    label: 'Wave sweep (combinatorial)',
    collection: 'variantTypes',
    source: 'wave.sweep · combinatorics.binomial / faces multiples · connector { from, width, passes }',
    options: [
      mcp(`from:0`, 'from = 0 (seed)', 'connector', { from: 0 }, {
        address: 'wave.sweep.from', hex: hexOf('combinatorics', 'binomial', [0]), params: ['from'],
      }),
      mcp(`from:${face}`, `from = faces (${face})`, 'connector', { from: face }, {
        address: 'rule.slice', hex: RuleFormulas.slice().hex ?? null, params: ['from'],
      }),
      mcp(`width:${face}`, `width = faces (${face})`, 'connector', { from: 0, width: face }, {
        address: 'rule.slice', hex: RuleFormulas.slice().hex ?? null, params: ['width'],
      }),
      mcp(`width:${face * coinsN}`, `width = faces·coins (${face * coinsN})`, 'connector', { from: 0, width: face * coinsN }, {
        address: 'combinatorics.binomial', hex: bin1.hex ?? null, params: ['width'],
      }),
      mcp(`width:${bin3.value}`, `width = 2³ = mintOf(n) (${bin3.value})`, 'connector', { from: 0, width: Number(bin3.value) }, {
        address: 'combinatorics.binomial', hex: bin3.hex ?? null, params: ['width'],
      }),
      mcp(`width:${bin4.value}`, `width = 2⁴ = tools/list (${bin4.value})`, 'connector', { from: 0, width: Number(bin4.value) }, {
        address: 'combinatorics.binomial', hex: bin4.hex ?? null, params: ['width'],
      }),
      mcp(`passes:1`, 'passes = seed', 'connector', { from: 0, passes: 1 }, {
        address: 'combinatorics.binomial', hex: bin1.hex ?? null, params: ['passes'],
      }),
      mcp(`passes:${coinsN}`, `passes = coins (${coinsN})`, 'connector', { from: 0, passes: coinsN }, {
        address: 'combinatorics.binomial', hex: bin1.hex ?? null, params: ['passes'],
      }),
      mcp(`C(faces,2)`, `C(${face},2)=${combFace2.value}`, 'hex', {
        family: 'combinatorics', program: ['combinations'], params: [face, 2],
      }, {
        address: 'combinatorics.combinations', hex: combFace2.hex ?? null, params: ['n', 'k'],
      }),
    ],
  }

  const combinatoricsEnum: FormulatedEnum = {
    name: 'combinatorics',
    label: 'Combinatorics power-set / C(n,k)',
    collection: 'variantTypes',
    source: 'combinatorics.binomial · combinations · connector { enums: true }',
    options: [bin1, bin2, bin3, bin4].map((r, k) => {
      const exp = k + 1
      return mcp(`2^${exp}`, `binomial(${exp})=${r.value}`, 'hex', {
        family: 'combinatorics', program: ['binomial'], params: [exp],
      }, {
        address: 'combinatorics.binomial',
        hex: r.hex ?? null,
        params: ['n'],
      })
    }),
  }

  // Security: crypto morph doors + crypt family — choosing a value is a verified hex/holds path.
  const cryptoTools = qpuCybersecurityToolsOf()
  const known = CryptFormulas.knownAnswers()
  const grover256 = CryptFormulas.symmetricQuantumBits(256)
  const grover128 = CryptFormulas.symmetricQuantumBits(128)
  const curve256c = CryptFormulas.curveClassicalBits(256)
  const curve256q = CryptFormulas.curveQuantumBits(256)
  const poly = CryptFormulas.tagForgery(16)
  const nonce = CryptFormulas.nonceCollision(2 ** 20)
  const aeadTag = CryptFormulas.aeadTagBits()
  const hashCollision = CryptFormulas.hashCollisionBits(256)

  const cryptoMorphEnum: FormulatedEnum = {
    name: 'cryptoMorph',
    label: 'Cybersecurity morph door',
    collection: 'variantTypes',
    source: 'qpuCybersecurityToolsOf · tools/call crypto_* (morph, on tools/list)',
    options: cryptoTools.map((t) =>
      mcp(t.name, t.name, t.name, {}, {
        address: `cyber.${t.name}`,
        params: t.name === 'crypto_catalog' || t.name === 'crypto_verify' ? [] : ['n', 'a'],
      }),
    ),
  }

  const cryptAlgoEnum: FormulatedEnum = {
    name: 'cryptAlgo',
    label: 'Crypt formula (verified holds path)',
    collection: 'variantTypes',
    source: 'crypt.* · tools/call hex / fused crypt — enum pick = formula params that hold',
    options: [
      mcp('knownAnswers', 'RFC vectors (sha256/512, md5, x25519, ed25519)', 'hex', {
        family: 'crypt', program: ['knownAnswers'], params: [],
      }, { address: 'crypt.knownAnswers', hex: known.hex ?? null, params: [] }),
      mcp('AES-256→128', 'symmetricQuantumBits(256)=128 Grover', 'hex', {
        family: 'crypt', program: ['symmetricQuantumBits'], params: [256],
      }, { address: 'crypt.symmetricQuantumBits', hex: grover256.hex ?? null, params: ['keyBits'] }),
      mcp('AES-128→64', 'symmetricQuantumBits(128)=64 Grover', 'hex', {
        family: 'crypt', program: ['symmetricQuantumBits'], params: [128],
      }, { address: 'crypt.symmetricQuantumBits', hex: grover128.hex ?? null, params: ['keyBits'] }),
      mcp('curve-256-classical', 'curveClassicalBits(256)=128 Pollard rho', 'hex', {
        family: 'crypt', program: ['curveClassicalBits'], params: [256],
      }, { address: 'crypt.curveClassicalBits', hex: curve256c.hex ?? null, params: ['curveBits'] }),
      mcp('curve-256-quantum', 'curveQuantumBits(256)=0 Shor', 'hex', {
        family: 'crypt', program: ['curveQuantumBits'], params: [256],
      }, { address: 'crypt.curveQuantumBits', hex: curve256q.hex ?? null, params: ['curveBits'] }),
      mcp('poly1305-16', 'tagForgery(16) RFC 8439 bound', 'hex', {
        family: 'crypt', program: ['tagForgery'], params: [16],
      }, { address: 'crypt.tagForgery', hex: poly.hex ?? null, params: ['bytes'] }),
      mcp('nonce-2^20', 'nonceCollision(2^20) birthday on 96-bit nonces', 'hex', {
        family: 'crypt', program: ['nonceCollision'], params: [2 ** 20],
      }, { address: 'crypt.nonceCollision', hex: nonce.hex ?? null, params: ['messages'] }),
      mcp('aead-tag-128', 'aeadTagBits()=128 ChaCha20-Poly1305', 'hex', {
        family: 'crypt', program: ['aeadTagBits'], params: [],
      }, { address: 'crypt.aeadTagBits', hex: aeadTag.hex ?? null, params: [] }),
      mcp('sha256-collision', 'hashCollisionBits(256)=128 birthday', 'hex', {
        family: 'crypt', program: ['hashCollisionBits'], params: [256],
      }, { address: 'crypt.hashCollisionBits', hex: hashCollision.hex ?? null, params: ['hashBits'] }),
    ],
  }

  // Clay seal index 0…5 — enum value = formula param i; evidence via claySealWaveOf / connector { pass: i } (never fullDiscover).
  const claySealEnum: FormulatedEnum = {
    name: 'claySeal',
    label: 'Clay seal index',
    collection: 'variantTypes',
    source: 'CLAY_SEALS[i] · claySealWaveOf(i) · connector { seal: true } / { pass: i } — never fullDiscover',
    options: CLAY_SEALS.map((seal, i) => {
      const zeros = seal === 'riemann' ? [1, 2] : seal === 'bsd' ? [2] : seal === 'hodge' ? [2] : []
      const run = seal === 'riemann' ? ClaySeals.riemann(1, 2)
        : seal === 'bsd' ? ClaySeals.bsd(2)
        : seal === 'hodge' ? ClaySeals.hodge(2)
        : seal === 'yangMills' ? ClaySeals.yangMills()
        : null
      return mcp(String(i), `${i}:${seal}`, 'hex', {
        family: 'clay', program: [seal], params: zeros,
      }, {
        address: `clay.${seal}`,
        hex: run?.hex ?? hexOf('clay', seal, zeros),
        params: ['i', ...zeros.map((_, j) => `p${j}`)],
      })
    }),
  }

  const latticeScaleEnum: FormulatedEnum = {
    name: 'latticeScale',
    label: 'Lattice coins/rays/faces',
    collection: 'variantTypes',
    source: 'qpuFacesOf / rule.slice · connector { point: true }',
    options: [
      mcp(`coins:${coinsN}`, `coins=${coinsN}`, 'connector', { point: true }, {
        address: 'lattice.coins', params: [],
      }),
      mcp(`rays:${faces.rays}`, `rays=${faces.rays}`, 'connector', { point: true }, {
        address: 'lattice.rays', params: [],
      }),
      mcp(`faces:${face}`, `faces=${face}=rule.slice`, 'hex', {
        family: 'rule', program: ['slice'], params: [],
      }, { address: 'rule.slice', hex: RuleFormulas.slice().hex ?? null, params: [] }),
      mcp(`mintOf:${mintOf(L.n)}`, `mintOf(n)=${mintOf(L.n)} harnesses/sealed`, 'connector', { enums: true }, {
        address: 'lattice.mintOf', params: [],
      }),
    ],
  }

  const cloudScaleEnum: FormulatedEnum = {
    name: 'cloudScale',
    label: 'cloud.scale params',
    collection: 'variantTypes',
    source: 'cloud.scale(100,30) · connector { point: true } — only when perNode>0',
    options: (() => {
      const scale = CloudFormulas.scale(100, 30)
      return [
        mcp('100,30', 'cloud.scale(100,30)', 'hex', {
          family: 'cloud', program: ['scale'], params: [100, 30],
        }, { address: 'cloud.scale', hex: scale.hex ?? null, params: ['nodes', 'days'] }),
      ]
    })(),
  }

  const lawEnum: FormulatedEnum = {
    name: 'law',
    label: 'Law / attraction',
    collection: 'variantTypes',
    source: 'law.lawful / law.reviewed · connector { point: true }',
    options: [
      mcp('lawful', 'law.lawful(0)', 'hex', {
        family: 'law', program: ['lawful'], params: [0],
      }, { address: 'law.lawful', hex: LawFormulas.lawful(0).hex ?? null, params: ['confirmed'] }),
      mcp('reviewed', 'law.reviewed(0)', 'hex', {
        family: 'law', program: ['reviewed'], params: [0],
      }, { address: 'law.reviewed', hex: LawFormulas.reviewed(0).hex ?? null, params: ['confirmed'] }),
    ],
  }

  const diagEnum: FormulatedEnum = {
    name: 'diagnostics',
    label: 'Diagnostics coverage',
    collection: 'variantTypes',
    source: 'monitoring.coverage · connector { exam: true }',
    options: [
      mcp('exam', 'bidirectional path exam', 'connector', { exam: true }, {
        address: 'exam', params: [],
      }),
      mcp('coverage', 'monitoring.coverage(healthy,hops)', 'hex', {
        family: 'monitoring', program: ['coverage'], params: [1, 1],
      }, {
        address: 'monitoring.coverage',
        hex: MonitoringFormulas.coverage(1, 1).hex ?? null,
        params: ['monitored', 'total'],
      }),
    ],
  }

  /**
   * Access = Unix/Linux mode enum (rwx / ugo / digit / handle), formulated as access.* hex.
   * Not an entitlement graph: pick a mode bit or chmod digit → MCP address.
   */
  const accessRwxEnum: FormulatedEnum = {
    name: 'accessRwx',
    label: 'Mode bit r|w|x',
    collection: 'variantTypes',
    source: 'Unix rwx · access.read / write / grant — chmod bit, not a role graph',
    improves: ['access', 'security'],
    options: [
      mcp('r', `r=${UNIX_MODE_BITS.r}`, 'hex', {
        family: 'access', program: ['read'], params: [2, 0],
      }, {
        address: 'access.read',
        hex: hexOf('access', 'read', [2, 0]),
        params: ['status', 'role'],
      }),
      mcp('w', `w=${UNIX_MODE_BITS.w}`, 'hex', {
        family: 'access', program: ['write'], params: [2, 1, 1],
      }, {
        address: 'access.write',
        hex: hexOf('access', 'write', [2, 1, 1]),
        params: ['role', 'user', 'owner'],
      }),
      mcp('x', `x=${UNIX_MODE_BITS.x}`, 'hex', {
        family: 'access', program: ['grant'], params: [0, 15],
      }, {
        address: 'access.grant',
        hex: hexOf('access', 'grant', [0, 15]),
        params: ['actor', 'target'],
      }),
    ],
  }

  const accessUgoEnum: FormulatedEnum = {
    name: 'accessUgo',
    label: 'Mode class u|g|o',
    collection: 'variantTypes',
    source: 'Unix ugo · who the mode digit applies to; pairs with accessModeDigit',
    improves: ['access', 'security'],
    options: UNIX_UGO.map((cls, i) =>
      mcp(cls, cls, 'hex', {
        family: 'access', program: ['role'], params: [i, i],
      }, {
        address: 'access.role',
        hex: hexOf('access', 'role', [i, i]),
        params: ['have', 'need'],
      }),
    ),
  }

  const accessModeDigitEnum: FormulatedEnum = {
    name: 'accessModeDigit',
    label: 'chmod digit 0..7',
    collection: 'variantTypes',
    source: 'Unix mode digit (r=4|w=2|x=1) · access.screen(flags) carries the bit mask',
    improves: ['access', 'security'],
    options: UNIX_MODE_DIGITS.map((d) =>
      mcp(String(d), `${d}=${UNIX_MODE_LABELS[d]}`, 'hex', {
        family: 'access', program: ['screen'], params: [d],
      }, {
        address: 'access.screen',
        hex: hexOf('access', 'screen', [d]),
        params: ['flags'],
      }),
    ),
  }

  const accessHandleEnum: FormulatedEnum = {
    name: 'accessHandle',
    label: 'Hexbit handle 0..f (UID-style)',
    collection: 'variantTypes',
    source: 'access.root / access.rank — lower bit = greater access; 0 is root as UID 0',
    improves: ['access', 'security'],
    options: Array.from({ length: UNIX_HANDLES }, (_, h) =>
      mcp(h.toString(16), h === 0 ? '0=root' : `rank(${h})`, 'hex', {
        family: 'access', program: [h === 0 ? 'root' : 'rank'], params: [h],
      }, {
        address: h === 0 ? 'access.root' : 'access.rank',
        hex: hexOf('access', h === 0 ? 'root' : 'rank', [h]),
        params: ['h'],
      }),
    ),
  }

  const accessModeEnum: FormulatedEnum = {
    name: 'accessMode',
    label: 'Product mode (ugo×digit)',
    collection: 'variantTypes',
    source: 'chmod u/g/o + digit → access.sudo / grant; ecommerce SKU access without entitlement graphs',
    improves: ['access', 'security'],
    options: [
      // Common modes as formulated triples: (u_digit<<6)|(g_digit<<3)|o_digit — value is the octal string
      mcp('0755', 'u=rwx g=r-x o=r-x', 'hex', {
        family: 'access', program: ['grant'], params: [0, 5],
      }, { address: 'access.grant', hex: hexOf('access', 'grant', [0, 5]), params: ['actor', 'target'] }),
      mcp('0644', 'u=rw- g=r-- o=r--', 'hex', {
        family: 'access', program: ['read'], params: [2, 0],
      }, { address: 'access.read', hex: hexOf('access', 'read', [2, 0]), params: ['status', 'role'] }),
      mcp('0600', 'u=rw- g=--- o=---', 'hex', {
        family: 'access', program: ['write'], params: [1, 1, 1],
      }, { address: 'access.write', hex: hexOf('access', 'write', [1, 1, 1]), params: ['role', 'user', 'owner'] }),
      mcp('0700', 'u=rwx g=--- o=---', 'hex', {
        family: 'access', program: ['root'], params: [0],
      }, { address: 'access.root', hex: hexOf('access', 'root', [0]), params: ['h'] }),
      mcp('0000', '---------', 'hex', {
        family: 'access', program: ['screen'], params: [0],
      }, { address: 'access.screen', hex: hexOf('access', 'screen', [0]), params: ['flags'] }),
    ],
  }

  const nativeEnum = nativeAdapterEnumOf()
  const nativeAdapterEnum: FormulatedEnum = {
    name: nativeEnum.name,
    label: nativeEnum.label,
    collection: nativeEnum.collection,
    source: nativeEnum.source,
    improves: [...nativeEnum.improves],
    options: nativeEnum.options.map((opt) =>
      mcp(opt.value, opt.label, opt.door, opt.args, {
        address: opt.address,
        hex: opt.hex,
        params: opt.params,
      }),
    ),
  }

  return [
    tenantEnum,
    llmEnum,
    hostHarnessEnum,
    sealedDoorEnum,
    fusedDoorEnum,
    connectorHarnessEnum,
    harnessKindEnum,
    ecommerceEnum,
    arityEnum,
    latticeEnum,
    saleNeedEnum,
    pluginEnum,
    waveEnum,
    combinatoricsEnum,
    cryptoMorphEnum,
    cryptAlgoEnum,
    claySealEnum,
    latticeScaleEnum,
    cloudScaleEnum,
    lawEnum,
    diagEnum,
    accessRwxEnum,
    accessUgoEnum,
    accessModeDigitEnum,
    accessHandleEnum,
    accessModeEnum,
    nativeAdapterEnum,
  ]
}

/**
 * Formulated product table: each row is an MCP/hex address, not catalog prose.
 * Variations = enum options (door/hex/params). price = catalogPriceRelationOf(slug).
 */
export const formulatedCatalogOf = () => {
  const tools = qpuMcpToolsListOf()
  const listBytes = JSON.stringify({ resultType: 'complete' as const, tools }).length
  const tenants = formulatedTenantsOf()
  const models = formulatedModelsOf()
  const enums = formulatedEnumsOf()
  const bill = usageBillOf()
  const prize = clayPrizeOf()
  const open = openMathScaleOf()
  const face = qpuPublicOf()
  const faces = qpuFacesOf()
  const ecommerce = enums.find((e) => e.name === 'ecommerceFormula')!

  const products = [
    {
      kind: 'product' as const,
      slug: 'commercial-license',
      address: 'license.CC-BY-NC-ND-4.0',
      door: 'connector',
      args: { ecommerce: true, need: 'organisation' },
      enums: ['tenant', 'saleNeed', 'llm', 'accessMode', 'accessRwx', 'accessUgo'] as const,
      price: catalogPriceRelationOf('commercial-license'),
    },
    {
      kind: 'product' as const,
      slug: 'package-qpu',
      address: `@uuidna/qpu@${packageVersion}`,
      door: 'connector',
      args: { ecommerce: true },
      enums: ['tenant', 'accessMode'] as const,
      price: catalogPriceRelationOf('package-qpu'),
    },
    {
      kind: 'product' as const,
      slug: 'hex-programs',
      address: 'hex',
      door: 'hex',
      args: { family: '<family>', program: ['<formula>'], params: [] },
      enums: ['arity', 'tenant', 'llm', 'accessHandle'] as const,
      price: catalogPriceRelationOf('hex-programs'),
    },
  ]

  const services = [
    {
      kind: 'service' as const,
      slug: 'mcp-tenant-serve',
      address: 'connector.tenant',
      door: 'connector',
      args: { tenants: true },
      enums: ['tenant', 'llm', 'hostHarness', 'door', 'fusedDoor', 'saleNeed', 'accessMode', 'accessHandle'] as const,
      price: catalogPriceRelationOf('mcp-tenant-serve'),
    },
    {
      kind: 'service' as const,
      slug: 'mcp-connector',
      address: 'connector',
      door: 'connector',
      args: {},
      enums: ['tenant', 'harness', 'harnessKind', 'llm'] as const,
      price: catalogPriceRelationOf('mcp-connector'),
    },
    {
      kind: 'service' as const,
      slug: 'sealed-doors',
      address: 'tools/list',
      door: '<door>',
      args: {},
      enums: ['door', 'tenant'] as const,
      price: catalogPriceRelationOf('sealed-doors'),
    },
    {
      kind: 'service' as const,
      slug: 'fused-doors',
      address: 'fused',
      door: '<fused>',
      args: {},
      enums: ['fusedDoor', 'tenant'] as const,
      price: catalogPriceRelationOf('fused-doors'),
    },
    {
      kind: 'service' as const,
      slug: 'wave-sweep',
      address: 'wave.sweep',
      door: 'connector',
      args: { from: 0, width: faces.faces * 2, passes: 1 },
      enums: ['waveSweep', 'lattice', 'tenant'] as const,
      price: catalogPriceRelationOf('wave-sweep'),
    },
    {
      kind: 'service' as const,
      slug: 'native-compute',
      address: 'connector.adapters',
      door: 'connector',
      args: { adapters: true },
      enums: ['nativeAdapter', 'accessMode', 'accessRwx', 'claySeal', 'tenant', 'llm'] as const,
      price: catalogPriceRelationOf('native-compute'),
    },
    {
      kind: 'service' as const,
      slug: 'usage-meter',
      address: 'usageBillOf',
      door: 'connector',
      args: { ecommerce: true, need: 'tenant' },
      enums: ['tenant', 'saleNeed'] as const,
      price: catalogPriceRelationOf('usage-meter'),
    },
    {
      kind: 'service' as const,
      slug: 'permaculture-tenant',
      address: 'tenant.perma',
      door: 'connector',
      args: { tenant: 'perma' },
      enums: ['llm', 'saleNeed', 'fusedDoor'] as const,
      price: catalogPriceRelationOf('permaculture-tenant'),
    },
    {
      kind: 'service' as const,
      slug: 'ecommerce-measures',
      address: 'ecommerce.*',
      door: 'hex',
      args: { family: 'ecommerce', program: ['<formula>'], params: [] },
      enums: ['ecommerceFormula', 'tenant'] as const,
      price: catalogPriceRelationOf('ecommerce-measures'),
    },
    {
      kind: 'service' as const,
      slug: 'storage-writes',
      address: 'auth.bearer',
      door: 'connector',
      args: { ecommerce: true },
      enums: ['tenant', 'saleNeed', 'accessMode', 'accessRwx', 'accessHandle'] as const,
      price: catalogPriceRelationOf('storage-writes'),
    },
    {
      kind: 'service' as const,
      slug: 'cloud-scale',
      address: 'cloud.scale',
      door: 'connector',
      args: { point: true },
      enums: ['tenant'] as const,
      price: catalogPriceRelationOf('cloud-scale'),
    },
    {
      kind: 'service' as const,
      slug: 'papers',
      address: 'papers',
      door: 'papers',
      args: {},
      enums: ['tenant', 'llm'] as const,
      price: catalogPriceRelationOf('papers'),
    },
  ]

  const offers = [...products, ...services]

  /** Flat formulated table: offer × enum option (MCP address). */
  const table = offers.flatMap((offer) =>
    offer.enums.flatMap((enumName) => {
      const en = enums.find((e) => e.name === enumName)
      if (!en) return []
      return en.options.map((opt) => ({
        slug: offer.slug,
        kind: offer.kind,
        offerAddress: offer.address,
        offerDoor: offer.door,
        offerArgs: offer.args,
        enum: enumName,
        value: opt.value,
        label: opt.label,
        door: opt.door,
        args: opt.args,
        address: opt.address,
        hex: opt.hex,
        params: opt.params,
        price: offer.price,
      }))
    }),
  )

  const connectBill = {
    doors: tools.length,
    bytes: listBytes,
    under16384: listBytes < 16384,
    qpuPrefixed: tools.filter((t) => t.name.startsWith('qpu_')).length,
    holds: tools.length <= 16 && listBytes < 16384 && tools.every((t) => !t.name.startsWith('qpu_')),
  }

  return {
    kind: 'formulated-catalog' as const,
    call: 'tools/call connector { ecommerce: true }' as const,
    endpoint: '/api/qpu/ecommerce' as const,
    thesis: 'Access is Unix mode enum (rwx/ugo/digit/handle) via access.* hex — not an entitlement graph' as const,
    enums,
    products,
    services,
    offers,
    table,
    tenants,
    models,
    access: {
      style: 'unix' as const,
      bits: UNIX_MODE_BITS,
      ugo: [...UNIX_UGO],
      digits: [...UNIX_MODE_DIGITS],
      labels: [...UNIX_MODE_LABELS],
      handles: UNIX_HANDLES,
      enums: ['accessRwx', 'accessUgo', 'accessModeDigit', 'accessHandle', 'accessMode'] as const,
      formulas: {
        r: 'access.read(status, role)',
        w: 'access.write(role, user, owner)',
        x: 'access.grant(actor, target)',
        ugo: 'access.role(have, need)',
        digit: 'access.screen(flags)',
        handle: 'access.root(h) | access.rank(h)',
        mode: 'chmod octal → grant/read/write/root/screen',
      },
      note: 'SKU access = mode pick; no entitlement graphs; price = priceRelationOf' as const,
    },
    ecommerce: {
      formulas: ecommerce.options.map((o) => ({
        address: o.address,
        hex: o.hex,
        door: o.door,
        args: o.args,
        params: o.params,
        price: 'relation' as const,
      })),
    },
    payload: {
      collections: {
        products: 'products' as const,
        variants: 'variants' as const,
        variantTypes: 'variantTypes' as const,
        variantOptions: 'variantOptions' as const,
        tenants: 'tenants' as const,
        usage: 'usage' as const,
      },
      enumMap: {
        variantTypes: enums.map((e) => e.name),
        variantOptions: 'McpEnumOption.value ← door/hex/params' as const,
        access: 'accessMode / accessRwx / accessUgo / accessModeDigit / accessHandle' as const,
        note: 'seed/admin fills variantOptions from formulatedEnumsOf(); no static option arrays' as const,
      },
    },
    connectBill,
    bill: {
      units: bill.units,
      charged: bill.charged,
      billed: bill.billed,
      margin: bill.margin,
      tenantField: 'usage.tenant' as const,
    },
    leads: {
      organisation: null,
      use: null,
      usageTenant: null,
      royaltyRate: null,
      marginRate: null,
    },
    public: {
      prize: face.prize,
      citationHolds: prize.citation.holds,
      awardRecorded: open.award.recorded,
    },
    connector: {
      ecommerce: 'tools/call connector { ecommerce: true }' as const,
      tenant: 'tools/call connector { tenant }' as const,
      tenants: 'tools/call connector { tenants: true }' as const,
    },
    seedTenants: tenants.sold.map((t) => ({ name: t.name, domain: t.domain })),
    seedProducts: offers.map((o) => ({
      title: o.address,
      slug: o.slug,
      description: `MCP ${o.door} ${JSON.stringify(o.args)} · enums ${o.enums.join(',')}`,
      licence: 'CC-BY-NC-ND-4.0' as const,
      price: o.price,
      enableVariants: o.enums.length > 0,
      organisation: null as null,
      use: null as null,
      _status: 'published' as const,
    })),
    holds:
      enums.every((e) => e.options.every((o) => o.door.length > 0 && o.price === 'relation')) &&
      offers.every((o) => o.price.holds === true && o.price.court.holds === true) &&
      connectBill.holds === true &&
      bill.margin === null,
    goal: 'OPEN' as const,
  }
}

export type FormulatedCatalog = ReturnType<typeof formulatedCatalogOf>

export const formulatedProductVariantOf = () => {
  const catalog = formulatedCatalogOf()
  return {
    kind: 'product-variant-sale-surface' as const,
    /** Hex named product+variant is still absent — catalog map does not flip that lead. */
    lead: true as const,
    hex: null as null,
    value: catalog.table.length,
    holds: false as const,
    catalogHolds: catalog.holds === true,
    absentHex: {
      registered: false as const,
      note: 'no hex named product+variant; enums are MCP options; sale surface ≠ mint' as const,
    },
    catalog: {
      products: catalog.products.length,
      services: catalog.services.length,
      offers: catalog.offers.length,
      enums: catalog.enums.map((e) => e.name),
      tableRows: catalog.table.length,
      tenants: catalog.tenants.sold.map((t) => t.slug),
      models: catalog.models.map((m) => m.llm),
      call: catalog.call,
    },
    combinatorics: {
      axis: CLOUDFLARE_PLUGINS.length,
      faces: qpuFacesOf().faces,
      variantFactor: catalog.enums.length,
    },
    goal: catalog.goal,
  }
}

export const publicEcommerceOf = (): Response =>
  Response.json(formulatedCatalogOf(), {
    headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' },
  })

export const ecommerceCatalogPlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [
    ...(config.endpoints ?? []),
    { path: '/qpu/ecommerce', method: 'get' as const, handler: () => publicEcommerceOf() },
  ],
})
