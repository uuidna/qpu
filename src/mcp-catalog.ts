// mcp-catalog — ONE tool list. Stdio and HTTP subtract nothing: every tool is Workers-safe.
import { donateUrl, qpuChipOf, qpuExperienceOf, qpuFacesOf, qpuFastenOf, qpuGatewaysOf, qpuHologramOf, qpuMachineOf, qpuMerkabaOf, qpuSeatOf, qpuSuperpositionsOf, qpuTokensOf, qpuWidthOf } from './hologram.js'
import { qpuChromeOf, qpuNavOf, qpuSearchOf, qpuSidebarOf } from './chrome.js'
import { qpuCompareHolds, qpuCompareOf, qpuSpeedOf } from './metrics.js'
import { qpuDiscoveryOf } from './discovery.js'
import { STANDING, standingByFileOf, qpuStandingFilesOf, qpuStandingOf } from './standing.js'
import { QPU_EVENT_LISTEN, qpuEventOf, qpuEventsHolds, qpuEventsOf } from './events.js'
import { QPU_BOOT_ARCHES, qpuBootHarvestOf, qpuBootOf } from './boot.js'
import { qpuPqcOf } from './pqc.js'
import { qpuQuantumOf } from './quantum.js'
import { qpuLicenceOf } from './licence.js'
import { qpuMessengerOf } from './messenger.js'
import { qpuChatInputOf, qpuChatOf } from './chat.js'
import { qpuTrainOf } from './train.js'
import { qpuConfigOf } from './config.js'
import {
  qpuRobotsTxtOf, qpuRoutesOf, qpuSeoAuditOf, qpuSeoOf, qpuSitemapOf, qpuSitemapXmlOf,
} from './seo.js'
import { QPU_HOST } from './hologram.js'
import { qpuBindingsOf, qpuDrive, qpuProvidersOf, qpuRecognizeOf, qpuSolidsOf } from './bindings/index.js'
import type { QpuEnv } from './bindings/env.js'

export interface McpTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  run: (args: Record<string, unknown>, env?: QpuEnv) => unknown | Promise<unknown>
}

const str = (v: unknown, d = ''): string => (v == null ? d : String(v))
const num = (v: unknown): number | undefined => {
  if (v == null || v === '') return undefined
  const n = Number(v)
  return n === n ? n : undefined
}

const tools: McpTool[] = [
{
    name: 'qpu_seat',
    description: 'Empty QPU seat. Returns {name,seat,admits}.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuSeatOf(),
  },
{
    name: 'qpu_width',
    description: 'BindingPoint pentagram. Returns {points,pentagram,binds}.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuWidthOf(),
  },
{
    name: 'qpu_hologram',
    description: 'Sealed hologram planes. Returns foundation debit credit pentagram fold octet veFaces seal.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuHologramOf(),
  },
{
    name: 'qpu_chip',
    description: 'Novelty chip: two 7-ray rotors, merkaba vertices, CPU/GPU balance. Hardware lane empty.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuChipOf(),
  },
{
    name: 'qpu_merkaba',
    description: 'Two tetrahedra and two counter-rotating 7-ray rosettes fused at 0.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuMerkabaOf(),
  },
{
    name: 'qpu_faces',
    description: 'Fourteen VE faces and through-void opposites. Returns [{face,opposite}].',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuFacesOf(),
  },
{
    name: 'qpu_superpositions',
    description: 'Fourteen VE faces. Each has a referer, door, and perspective angles. Optional {face}.',
    inputSchema: { type: 'object', properties: { face: { type: 'integer' } } },
    run: (a) => {
      const all = qpuSuperpositionsOf()
      const f = num(a.face)
      if (f === undefined) return all
      return all[f] ?? { error: 'no such face', face: f }
    },
  },
{
    name: 'qpu_tokens',
    description: 'Hologram CSS tokens. Returns {--qpu-*}. VitePress --vp-* bind to these.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuTokensOf(),
  },
{
    name: 'qpu_proofs',
    description: 'Constructor census. Returns {concept,work,complete}.',
    inputSchema: { type: 'object', properties: {} },
    run: async () => {
      const { qpuProofsOf } = await import('./proofs.js')
      return qpuProofsOf()
    },
  },
{
    name: 'qpu_speed',
    description: 'Constructor µs vs 2^n climbs. Optional {rounds}. Handle-bit masks, fourteen neighbour gateways, licensed hex including 48 and 128.',
    inputSchema: {
      type: 'object',
      properties: { rounds: { type: 'integer' } },
    },
    run: (a) => ({ speed: qpuSpeedOf(num(a.rounds) ?? qpuFastenOf().rounds) }),
  },
{
    name: 'qpu_metrics',
    description: 'Formula vs peer. Neighbour gateways, handle-bit masks, 2^n amplitudes. Returns {compare,holds}.',
    inputSchema: { type: 'object', properties: {} },
    run: () => ({ compare: qpuCompareOf(), holds: qpuCompareHolds() }),
  },
{
    name: 'qpu_gateways',
    description: 'Fourteen VE-face neighbours are capacity gateways. Every handle bit is a usable mask. When never.',
    inputSchema: { type: 'object', properties: {} },
    run: () => ({ gateways: qpuGatewaysOf(), neighbours: qpuFacesOf().length }),
  },
{
    name: 'qpu_nav',
    description: 'Nav computed upon request from the hologram.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuNavOf(),
  },
{
    name: 'qpu_sidebar',
    description: 'Fourteen VE faces. Each has a referer, door, and perspective angles. Optional {face}.',
    inputSchema: { type: 'object', properties: { path: { type: 'string' } } },
    run: (a) => qpuSidebarOf(str(a.path, '/')),
  },
{
    name: 'qpu_search',
    description: 'Deep-analyze every licensed site in the hologram index for {q}. Optional {site} {kind} filters. Constructors only, never a crawl. Returns {q,hits,analyzed}. GET /engine stays Pixel Streaming.',
    inputSchema: { type: 'object', properties: { q: { type: 'string' }, site: { type: 'string' }, kind: { type: 'string' } }, required: ['q'] },
    run: (a) => qpuSearchOf(str(a.q), { site: str(a.site) || undefined, kind: str(a.kind) || undefined }),
  },
{
    name: 'qpu_chrome',
    description: 'Nav, sidebar, search for {path} and {q}.',
    inputSchema: { type: 'object', properties: { path: { type: 'string' }, q: { type: 'string' } } },
    run: (a) => qpuChromeOf(str(a.path, '/'), str(a.q)),
  },
{
    name: 'qpu_seo',
    description: 'Canonical, OG, JSON-LD, head for {path}. GET /search stays chrome JSON.',
    inputSchema: { type: 'object', properties: { path: { type: 'string' } } },
    run: (a) => qpuSeoOf(str(a.path, '/')),
  },
{
    name: 'qpu_sitemap',
    description: 'Sitemap from constructors. {xml:true} returns XML.',
    inputSchema: { type: 'object', properties: { xml: { type: 'boolean' } } },
    run: (a) => (a.xml ? qpuSitemapXmlOf() : { urls: qpuSitemapOf(), pages: qpuRoutesOf().length }),
  },
{
    name: 'qpu_robots',
    description: 'robots.txt pointing at the constructor sitemap.',
    inputSchema: { type: 'object', properties: {} },
    run: () => ({ text: qpuRobotsTxtOf() }),
  },
{
    name: 'qpu_audit',
    description: 'SEO audit of every route. Returns {ok,pages,gaps}.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuSeoAuditOf(),
  },
{
    name: 'qpu_events',
    description: 'Fourteen UI event kinds occupying VE faces.',
    inputSchema: { type: 'object', properties: {} },
    run: () => ({ kinds: qpuEventsOf(), listen: QPU_EVENT_LISTEN, holds: qpuEventsHolds(), seat: qpuSeatOf() }),
  },
{
    name: 'qpu_event',
    description: 'Map one DOM event {type} onto a VE face. Unknown types refuse.',
    inputSchema: { type: 'object', properties: { type: { type: 'string' } }, required: ['type'] },
    run: (a) => qpuEventOf(str(a.type)),
  },
{
    name: 'qpu_boot',
    description: 'Boot matrix: eight Alpine ISAs times trinity parts. Chip empty.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuBootOf(),
  },
{
    name: 'qpu_boot_harvest',
    description: 'Harvest census. Not allowed unless a fused QPU fetch is passed. live:true is refused — no network outside QPU.',
    inputSchema: { type: 'object', properties: { live: { type: 'boolean' } } },
    run: async (a) => {
      if (a.live === true) {
        return {
          requested: QPU_BOOT_ARCHES.length,
          ported: 0,
          pins: [],
          holds: false,
          live: false,
          fused: false,
        }
      }
      return qpuBootHarvestOf()
    },
  },
{
    name: 'qpu_experience',
    description: 'Inner and outer rotors of the chip. Returns involution, tetrahedra, vortex, glow.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuExperienceOf(),
  },
{
    name: 'qpu_live',
    description: 'Occupancy now. Optional {at} milliseconds. k walks VE faces.',
    inputSchema: { type: 'object', properties: { at: { type: 'number' } } },
    run: async (a) => {
      const { qpuLiveOf } = await import('./live.js')
      const at = num(a.at)
      return qpuLiveOf(at === undefined ? Date.now() : at)
    },
  },
{
    name: 'qpu_og',
    description: 'Hero Open Graph card. Returns {href,width,height,type,alt}. Image is GET /og.svg.',
    inputSchema: { type: 'object', properties: {} },
    run: async () => {
      const { qpuOgOf } = await import('./og.js')
      const { svg: _svg, ...og } = qpuOgOf()
      return og
    },
  },
{
    name: 'qpu_pqc',
    description: 'QPU pqc. All VE faces, eight uuidna.com theorem tiles. Target empty. When never. Sandbox HTTP of named domains. Experiments unlimited.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuPqcOf(),
  },
{
    name: 'qpu_quantum',
    description: 'Live working QPU. Pure and agnostic. Every VE face × every reflection. Target empty. When never.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuQuantumOf(),
  },
{
    name: 'qpu_licence',
    description: 'Offline occupancy certificate. Named uuidna.com host. No wildcards. Verify is a constructor, never a network call. When never.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuLicenceOf(),
  },
{
    name: 'qpu_messenger',
    description: 'Sequence is the uuid messenger. RFC 9562 clock_seq is 14 bits — VE faces. Certificates arrive on the message. When never.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuMessengerOf(),
  },
{
    name: 'qpu_chat',
    description: 'Realtime chat. Every input occupies a VE face. Capture. Named qpu.uuidna.com/chat. Inference bills a uuid account via /bindings. When never.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuChatOf(),
  },
{
    name: 'qpu_input',
    description: 'Map one input {type,id}. Optional {text,account}. No uuid refuses. Handmade account refuses. QPU never runs inference.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string' },
        id: { type: 'string' },
        text: { type: 'string' },
        account: { type: 'string' },
      },
      required: ['type', 'id'],
    },
    run: (a) => qpuChatInputOf({
      type: str(a.type),
      id: str(a.id),
      text: a.text == null ? undefined : str(a.text),
      account: a.account == null ? undefined : str(a.account),
    }),
  },
{
    name: 'qpu_train',
    description: 'Professional training. Fourteen VE-face lessons fused with uuidna public keyless APIs, BindingPoint hardware occupancy, constructor APIs, Cloudflare asset skip, relations, and sealed leads. Named uuidna.com HTTPS only. No keys, no third-party completions, no exchange quotes. Constructors only, never a crawl. When never.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuTrainOf(),
  },
{
    name: 'qpu_config',
    description: 'Shared configs: Node, TypeScript, wrangler. VitePress hologram and Payload CMS fuse on this table. VitePress defineLoader occupies Payload CRUD (payload.find / REST); GraphQL stays off. Replica host and title stay local. When never.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuConfigOf(),
  },
{
    name: 'qpu_standing',
    description: 'uuidna Lean keys this worker cites, split by axiom file. Optional {file} or {role: is|can|may}.',
    inputSchema: {
      type: 'object',
      properties: {
        file: { type: 'string' },
        role: { type: 'string', enum: ['is', 'can', 'may'] },
      },
    },
    run: (a) => {
      const roleRaw = str(a.role)
      const role = roleRaw === 'is' || roleRaw === 'can' || roleRaw === 'may' ? roleRaw : undefined
      const file = str(a.file) || undefined
      if (file || role) return qpuStandingOf({ file, role })
      return { files: qpuStandingFilesOf(), byFile: standingByFileOf(), standing: STANDING }
    },
  },
{
    name: 'qpu_discovery',
    description: 'Worker discovery document. Optional {origin}.',
    inputSchema: { type: 'object', properties: { origin: { type: 'string' } } },
    run: (a) => qpuDiscoveryOf(str(a.origin, `https://${QPU_HOST}`)),
  },
{
    name: 'qpu_donate',
    description: 'Captain-coins URL. Requires {referrer}.',
    inputSchema: { type: 'object', properties: { referrer: { type: 'string' } }, required: ['referrer'] },
    run: (a) => ({ url: donateUrl(str(a.referrer)) }),
  },
{
    name: 'qpu_machine',
    description: 'Seat, width, hologram, fused environment. Chip stays empty; env auto-recognizes.',
    inputSchema: { type: 'object', properties: {} },
    run: (_a, env) => ({ ...qpuMachineOf(), environment: qpuRecognizeOf(env) }),
  },
{
    name: 'qpu_fetch',
    description: 'Execute a worker reading for {path} in-process. Returns {status,body}.',
    inputSchema: { type: 'object', properties: { path: { type: 'string' } } },
    run: async (a, env) => {
      const { handleQpuFetch } = await import('./edge.js')
      const path = str(a.path, '/')
      const res = await handleQpuFetch(new Request(`https://${QPU_HOST}${path.startsWith('/') ? path : `/${path}`}`), env)
      const text = await res.text()
      let body: unknown = text
      try { body = JSON.parse(text) } catch { /* keep text */ }
      return { status: res.status, type: res.headers.get('content-type'), body }
    },
  },
{
    name: 'qpu_providers',
    description: 'src/bindings folders: cloudflare google aws azure ibm oracle hardware arch.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuProvidersOf().map((p) => ({ name: p.name, seat: p.seat, bindings: p.bindings.length })),
  },
{
    name: 'qpu_environment',
    description: 'Sandboxed fused environment. HTTP of named domains only. Experiments unlimited. Chip named QPU never binds.',
    inputSchema: { type: 'object', properties: {} },
    run: (_a, env) => qpuRecognizeOf(env),
  },
{
    name: 'qpu_solids',
    description: 'Platonic solids, cube duals, shared BindingPoint pentagram. Known and unknown APIs merge on CPU GPU RAM CACHE STORAGE. Seat empty; no wildcards.',
    inputSchema: { type: 'object', properties: {} },
    run: () => qpuSolidsOf(),
  },
{
    name: 'qpu_bindings',
    description: 'Binding census. Optional {provider}. Returns driver readings.',
    inputSchema: { type: 'object', properties: { provider: { type: 'string' } } },
    run: (a, env) => qpuBindingsOf(env, str(a.provider) || undefined),
  },
{
    name: 'qpu_drive',
    description: 'Drive a binding: {provider,kind,op,key,value}.',
    inputSchema: {
      type: 'object',
      properties: {
        provider: { type: 'string' },
        kind: { type: 'string' },
        op: { type: 'string' },
        key: { type: 'string' },
        value: {},
      },
      required: ['kind'],
    },
    run: (a, env) => qpuDrive(env, str(a.provider, 'cloudflare'), str(a.kind), str(a.op, 'probe'), a),
  },
{
    name: 'qpu_fractal',
    description: 'Fused fractal: pentagram, hologram, fourteen faces, providers, all serverless. Chip empty.',
    inputSchema: { type: 'object', properties: {} },
    run: async (_a, env) => {
      const { qpuFractalOf } = await import('./fractal.js')
      return qpuFractalOf(env)
    },
  },
{
    name: 'qpu_scale',
    description: 'Serverless scale census: native transports, bound lanes, peers.',
    inputSchema: { type: 'object', properties: {} },
    run: async (_a, env) => {
      const { qpuScaleOf } = await import('./scale.js')
      return qpuScaleOf(env)
    },
  },
{
    name: 'qpu_peers',
    description: 'Sandbox HTTP origins. Licence host plus QPU_FUSE_DOMAINS. Unknown hosts in QPU_PEERS refuse.',
    inputSchema: { type: 'object', properties: {} },
    run: async (_a, env) => {
      const { qpuPeersOf } = await import('./scale.js')
      return { peers: qpuPeersOf(env) }
    },
  },
{
    name: 'qpu_fanout',
    description: 'Call {tool} on every peer over MCP and bound RUN lanes. Refuses nested fanout.',
    inputSchema: {
      type: 'object',
      properties: { tool: { type: 'string' }, arguments: { type: 'object' } },
      required: ['tool'],
    },
    run: async (a, env) => {
      const { qpuFanoutOf } = await import('./scale.js')
      return qpuFanoutOf(env, str(a.tool, 'qpu_seat'), (a.arguments as Record<string, unknown>) ?? {})
    },
  }
]

export const QPU_TOOLS: readonly McpTool[] = tools

export const qpuMcpToolNames = (): string[] => QPU_TOOLS.map((t) => t.name)

export const qpuMcpCall = (
  name: string,
  args: Record<string, unknown> = {},
  env?: QpuEnv,
): unknown | Promise<unknown> => {
  const t = QPU_TOOLS.find((x) => x.name === name)
  if (!t) throw new Error(`unknown tool: ${name}`)
  return t.run(args, env)
}
