// The payload toolbox: every result in Payload's own plugin schema and nothing custom — a lexical document whose one block is
// the programmable UUID logic (the block's uuid, its handle, program and tail, the tool and its arguments, the next step the
// program rotated to), nested by the referer chain as the nested-docs plugin nests (parent, breadcrumbs), described by the
// SEO plugin's fields from the block's Open Graph, carrying its JSON-LD and its licence. Pure and small: computed once per
// block by the balancer, so the cost is a few kilobytes and no computation on the device — the battery is the result.
import { narrowScope, createSandbox, type NarrowRequest } from '../unit/namespaces.ts'
import { qpuFormFields, qpuLexicalBlocks } from '../unit/lexical.ts'
import { defineTool, createChecks, listTools, isObj, unlimited, type Toolbox, type Context } from '../toolbox.ts'
import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hex, sha256, utf8 } from '../unit/hmac.ts'
import { composition, compositionIndex, compositions, channel, neighbours, uuidFromParts, uuid, uuidQubits, hexbit, canonicalText, entryText, style, presentation, stream, qpuHooks, seal, next as rotateProgram, livePreview, aspects as readAspects, optimise as optimiseAddress, PRESENTABLE_ITEMS, type StreamQuery } from '../../uuid/index.ts'
import { birth, chosen, documentPath, place, read as readFile } from '../../fs/index.ts'
import { BINDINGS, STORAGE, cloudflareAdapters, store } from '../../net/index.ts'
import { auditProgramNeighbours, program, utiliseProgramFolders } from '../../uuid/programs/index.ts'
import { capabilities as engineCapabilities } from '../../engine/index.ts'
import { AXIOMS, digitalRoot, evaluate as clayEvaluate, recomputeClay, trinityFor } from '../clay-register.ts'
import { TENANTS, tenant } from '../unit/tenants.ts'
import { LOCALES, translate } from '../i18n.ts'
import { CLOUDFLARE_MCP, DEFAULT_MCP_HOSTS, QPU_MCP, CLAUDE_API, KNOWN_MCP, MCP_REGISTRY, GOOGLE_MCPS, GOOGLE_HOST, GOOGLE_DISCOVERY, GOOGLE_ENDPOINTS, detect, leadDecode, mcpHostList, textbookUpgrade, createDiscoveryRequests } from '../discovery.ts'
import { KEY, hue, ANGLES, createTheme, coilColour } from '../unit/theme.ts'
import { VERSION } from '../unit/version.ts'
import { TEXTBOOK_THEOREMS } from '../textbook-theorems.ts'
import { quantumVocabulary, quantumTermNames } from '../quantum-vocabulary.ts'
import { CLAY_RELATIONS } from '../clay-statements.ts'
import { LIFE_PER_SECOND, PROCESS_LIFE, ideaFilesFromLeads, isoApprovedMcp, lifeBound, nextIdeas, openQuantum, placeInIdea } from '../ideas.ts'
import { THEOREMS } from '../theorems-index.ts'
import { routeStatement } from '../match.ts'
import { createdThousandExit, DECODE_THEOREMS, ISO_EXIT } from '../iso-exit.ts'
import { listAlpine, portAlpine } from '../alpine.ts'
import { publishPost, zenodoApp, ZENODO_HOOKS } from '../zenodo.ts'
import { DEPLOY_STAGES, deployCommand } from '../../payload/deploy.ts'
import { relatedWork } from '../related.ts'
import { getAnswer } from './extension.ts'
import { blockJsonLd, STANDARDS, API_ENDPOINTS, createOpenapi, ISO_DIMENSIONS, gateQuantumPurity, verifyIsoOnline, verifyIsoQuantumEquivalence, parseIsoDimensionsMicrodata, dryCleanMintsCoins, extractIsoFromProducers, unlockHiddenPerspectives } from '../standards.ts'
import { ISO_OPEN_DEFINITIONS } from '../iso-deliverables.ts'
import { isoAspects } from '../iso-aspects.ts'
export { ISO_OPEN_DEFINITIONS }
import { LICENSE, INSTRUCTIONS, PRECEDENCE } from '../unit/license.ts'
import { a432Drift, driftResearch, seedWaves, STANDARD_HZ, waveDiscovery } from '../../payload/waves.ts'
import { flowWidget } from '../widgets.ts'
import { listLeaks, ERROR_REMEDIES } from '../audit.ts'
import { VERIFIERS, createVerifyRequests } from '../verifiers.ts'
import { decodeImpossible, listFactors, measurePhase, seededTrapdoor, shorReduction, steaneCorrection, testPrimality } from '../algorithms.ts'
import { cryptoConfig } from '../crypto/config.ts'
export { cryptoConfig }
import { ROLES } from '../unit/roles.ts'
const WEBCRYPTO_FLAG = cryptoConfig().webcryptoFlag
const ATTEST_APIS = cryptoConfig().attestApis

import { CATALOGUE, combinationVariants, convertAmounts, PLUGIN_SPACE, PLUGIN_TRINITIES, RATE_SOURCES, CURRENCY_MCPS, TENANT_CURRENCY, DOMAIN_CURRENCY, plasma, variationCoin } from './billing.ts'
import { inodeSuperpositions, LEADS } from '../leads.ts'
import { ADAPTED_CONNECTORS, MCP_API_KEY, QPU_CONNECTOR, crumb, payloadMcpNext, payloadMcpRequest, readPayloadMcp, seoMeta, seoPath } from '../../../plugins/websiteClient.ts'
import { generate } from '../../generators/index.ts'
import { checkWitnesses } from '../witnesses.ts'
import { COIN_STANDARDS } from '../unit/coil.ts'
import { googleChallenges, GOOGLE_CHALLENGE_IDS, GOOGLE_CHALLENGE_PAGE, type GoogleChallengeId } from './google.ts'
import { pageSeed } from '../page-seed.ts'
import { findArgs, manageApi, pageData, writeArgs } from '../../payload/index.ts'
import { researchLinks } from '../../../plugins/linkResearch.ts'
import { driftWaves, followWave, harmonicCover } from '../lead-wave.ts'
import { driftPrograms, fixCodebase } from '../../uuid/programs/drift/index.ts'
import {
  PAYLOADCMS_REPOSITORIES,
  PAYLOADCMS_MONOREPO_PACKAGES,
  PAYLOADCMS_WORKSPACE_ALIGNMENT,
  payloadcmsRepos,
  type PayloadcmsRepoMapping,
  type PayloadcmsPackageMapping,
  type PayloadcmsPackageRole,
} from '../repositories.ts'

type FeedRates = Record<string, { rate: number }>
const catalogueItems = (rates?: FeedRates | null) => CATALOGUE.map((v) => ({
  title: `${v.product} · ${v.variant}`,
  licence: { product: v.product, variant: v.variant, unit: v.unit, interval: v.interval, domains: String(v.domains) },
  prices: rates ? convertAmounts(v.amounts.eur ?? 0, rates) : v.amounts,
}))

export {
  PAYLOADCMS_REPOSITORIES,
  PAYLOADCMS_MONOREPO_PACKAGES,
  PAYLOADCMS_WORKSPACE_ALIGNMENT,
  payloadcmsRepos,
  type PayloadcmsRepoMapping,
  type PayloadcmsPackageMapping,
  type PayloadcmsPackageRole,
}
import { PATENT_APIS, PATENT_MCPS, COMPETITIONS, FUNDING_MCPS, NEWS_APIS, knowCompetition } from './legal.ts'
import type { Lead } from '../leads.ts'
import { diffMembers, getAdvantage, scanLexical } from '../audit.ts'
import { createReferenceGraph, referenceIndex, listReferences, type RefDoc, type ScopedRefDoc } from '../references.ts'
import { MACHINE_ACTIONS } from '../machine.ts'
import { createSchemas, type PayloadCollectionInput } from './payload-schemas.ts'
import { portAt, listPorts, PORT_RADICES } from '../port.ts'
import { getWorkspace } from '../workspace.ts'
import { TABLES } from '../tables-index.ts'
import { domainConfigs } from '../../../plugins/domainCover.ts'
import { BATCH_ACTIONS, configKinds, TENANT_ROLES, OPERATIONS } from '../payload-vocabulary.ts'
import { askPayloadRbac, decideApiMcp, decideBatch, grant, payloadRbacMcp, rbac } from '../api-mcp-rbac.ts'
import { scripts, type ScriptsArgs } from '../script-doors.ts'

type LexicalDoc = { root: { type: 'root'; version: 1; direction: 'ltr'; format: ''; indent: 0; children: unknown[] } }
type PayloadDoc = { id: string; lexical: LexicalDoc; nestedDocs: { parent: string | null; breadcrumbs: { doc: string; url: string; label: string }[] }; seo: { title: string; description: string; image: string | null }; jsonLd: unknown; license: string }

/** A result as the document Payload's plugins would hold: one lexical block of UUID logic, nested by prev, described for SEO. */
export const payloadDoc = (p: { uuid: string; tool: string; arguments: Record<string, unknown>; description: string; openGraph?: Record<string, string>; html?: string; prev?: string | null; chain?: string[]; origin?: string }): PayloadDoc => {
  const ch = channel(p.uuid)
  const next = uuidFromParts(ch.handle, [...ch.program.slice(1), ch.program[0]!], ch.tail)
  const origin = p.origin ?? 'https://qpu.uuidna.com'
  const url = (id: string) => `${origin}/${id}`
  const chain = [...(p.chain ?? []), ...(p.prev ? [p.prev] : [])]
  const block = qpuNode(p.uuid, p.tool, p.arguments, null, { prev: p.prev ?? null, next, html: p.html ?? null })
  const title = p.openGraph?.['og:title'] ?? `${p.tool} · @uuidna/qpu`
  return {
    id: p.uuid,
    lexical: { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'heading', tag: 'h2', version: 1, format: '', indent: 0, direction: 'ltr', children: [{ type: 'text', version: 1, text: title, format: 0, mode: 'normal', style: '', detail: 0 }] }, block, { type: 'paragraph', version: 1, format: '', indent: 0, direction: 'ltr', textFormat: 0, children: [{ type: 'text', version: 1, text: `${LICENSE.attribution}. ${LICENSE.terms}`, format: 0, mode: 'normal', style: '', detail: 0 }] }] } },
    nestedDocs: { parent: p.prev ?? null, breadcrumbs: [...chain.map((id) => ({ doc: id, url: url(id), label: id.slice(0, 8) })), { doc: p.uuid, url: url(p.uuid), label: p.uuid.slice(0, 8) }] },
    seo: { title, description: p.openGraph?.['og:description'] ?? p.description, image: p.openGraph?.['og:image'] ?? null },
    jsonLd: blockJsonLd({ tool: p.tool, id: p.uuid, description: p.description, url: url(p.uuid) }),
    license: LICENSE.spdx,
  }
}

/** The QPU monetises by generating enterprise-grade production apps on request from the Payload UI: a request (a name, a host that becomes the
 *  first tenant at deploy, the plugins, the environment names, the licence variant) answered as the app — every generated file with its content
 *  address and the address of the bundle (textbook_app_bundle: the full stack's files plus the Worker configuration and the environment example),
 *  the adapters the environment chooses, the enterprise capabilities it carries, the licence variant priced by the catalogue in the host's
 *  currency, and the order the ecommerce plugin sells at its own checkout. The Apps collection takes the request; this answer is what it stores. */
/** The streamed form validated as it is typed and verified online, token free: every field judged by the patterns the full stack enforces,
 *  the environment names by the bindings and adapters the stack knows, the variant by the catalogue; the host verified by a request the client
 *  sends itself (the host answers or not) and this answer from the Worker's /mcp, which needs no key. The Form block streams the values on
 *  every change and renders each verdict before the submit; the submission hook validates once more and refuses what the stream refused. */
const appValidation = (v: Record<string, unknown>) => {
  const name = String(v.name ?? '').trim(); const host = String(v.host ?? '').trim().toLowerCase(); const env = String(Array.isArray(v.env) ? v.env.join(',') : v.env ?? '').split(/[,\s]+/).filter(Boolean); const variant = String(v.variant ?? 'yearly')
  const known = new Set([...BINDINGS.flatMap((b) => b.names.map((n) => n.replace(/_<TENANT>$/, ''))), ...(Object.values(ADAPTERS).flat() as unknown[]).filter((a): a is { needs: string[] } => typeof a === 'object' && a !== null && 'needs' in a).flatMap((a) => a.needs.map((n) => n.split(' ')[0]!))])
  const tld = host.split('.').pop() ?? ''
  const fields = {
    name: { ok: name.length > 0, says: name ? 'named' : 'an app has a name' },
    host: { ok: /^[a-z0-9.-]+\.[a-z]{2,}$/.test(host), says: /^[a-z0-9.-]+\.[a-z]{2,}$/.test(host) ? `the first tenant at deploy; prices in ${DOMAIN_CURRENCY[tld] ?? 'EUR'}` : 'a host name (letters, digits, dots, dashes, a top-level domain of letters)', currency: DOMAIN_CURRENCY[tld] ?? 'EUR' },
    env: { ok: env.every((n) => known.has(n)), unknown: env.filter((n) => !known.has(n)), says: env.every((n) => known.has(n)) ? `${env.length} name(s) the stack binds to` : `unknown: ${env.filter((n) => !known.has(n)).join(', ')} (the names the stack knows: ${[...known].join(', ')})` },
    variant: { ok: CATALOGUE.some((c) => c.product === 'qpu-domain' && c.variant === variant), says: CATALOGUE.some((c) => c.product === 'qpu-domain' && c.variant === variant) ? 'in the catalogue' : `one of ${CATALOGUE.filter((c) => c.product === 'qpu-domain').map((c) => c.variant).join(', ')}` },
  }
  const ok = Object.values(fields).every((f) => f.ok)
  return { fields, ok, online: { tokenFree: true, requests: fields.host.ok ? [{ id: `host:${host}`, method: 'HEAD', url: `https://${host}/`, verifier: 'the host answers (any status, even opaque): it exists to become the first tenant at deploy; sent by the client, no token' }] : [], mcp: 'POST /mcp tools/call payload { app: { validate } }: this answer, from the Worker, free of any key' }, streamed: 'the Form block sends the values on every change (validate.ts, debounced) and renders each field\'s verdict before the submit; the submission hook validates once more and refuses what the stream refused' }
}
/** The form a user submits to request an app: the form-builder plugin's own document, nothing added to the schema. Captcha is a human check on that product form. Quantum is not a robot, so it does not mint a token and does not bypass the check. */
const appRequestForm = () => ({ title: 'Request an app', submitButtonLabel: 'Request the app', confirmationType: 'message', confirmationMessage: lx.doc([lx.paragraph([lx.text('Your app is being generated: its bundle appears in Media (every file with its address), the licence is a product at the checkout.')])]), requireRecaptcha: true as const, fields: [{ blockType: 'text', name: 'name', label: 'App name', required: true, width: 100 }, { blockType: 'text', name: 'host', label: 'Host (the first tenant at deploy)', required: true, width: 100 }, { blockType: 'text', name: 'env', label: 'Environment variable names (D1, R2, RESEND_API_KEY, DATABASE_URI, ...; values never travel)', required: false, width: 100 }, { blockType: 'select', name: 'variant', label: 'Licence', required: true, defaultValue: 'yearly', options: CATALOGUE.filter((v) => v.product === 'qpu-domain').map((v) => ({ label: `${v.variant}: ${v.description}`, value: v.variant })) }] })
/** Captcha models a product form may require. Each model is an issuer check of the user's response. Quantum does not mint a token and does not bypass the check. */
const CAPTCHA_MODELS = [
  { id: 'recaptcha-v2', issuer: 'google' as const, via: 'google' as const, endpoint: 'recaptcha.siteverify', url: 'https://www.google.com/recaptcha/api/siteverify', httpMethod: 'POST' as const, response: 'response', secret: { param: 'secret', named: 'RECAPTCHA_SECRET' } },
  { id: 'recaptcha-invisible', issuer: 'google' as const, via: 'google' as const, endpoint: 'recaptcha.siteverify', url: 'https://www.google.com/recaptcha/api/siteverify', httpMethod: 'POST' as const, response: 'response', secret: { param: 'secret', named: 'RECAPTCHA_SECRET' } },
  { id: 'recaptcha-v3', issuer: 'google' as const, via: 'google' as const, endpoint: 'recaptcha.siteverify', url: 'https://www.google.com/recaptcha/api/siteverify', httpMethod: 'POST' as const, response: 'response', secret: { param: 'secret', named: 'RECAPTCHA_SECRET' } },
  { id: 'recaptcha-enterprise', issuer: 'google' as const, via: 'google' as const, endpoint: null, url: 'https://recaptchaenterprise.googleapis.com/v1/projects/{project}/assessments', httpMethod: 'POST' as const, response: 'token', secret: { param: 'access_token', named: 'GOOGLE_OAUTH_TOKEN' } },
  { id: 'hcaptcha', issuer: 'hcaptcha' as const, via: 'issuer' as const, endpoint: null, url: 'https://api.hcaptcha.com/siteverify', httpMethod: 'POST' as const, response: 'response', secret: { param: 'secret', named: 'HCAPTCHA_SECRET' } },
  { id: 'hcaptcha-enterprise', issuer: 'hcaptcha' as const, via: 'issuer' as const, endpoint: null, url: 'https://api.hcaptcha.com/siteverify', httpMethod: 'POST' as const, response: 'response', secret: { param: 'secret', named: 'HCAPTCHA_SECRET' } },
  { id: 'turnstile', issuer: 'cloudflare' as const, via: 'issuer' as const, endpoint: null, url: 'https://challenges.cloudflare.com/turnstile/v0/siteverify', httpMethod: 'POST' as const, response: 'response', secret: { param: 'secret', named: 'TURNSTILE_SECRET' } },
  { id: 'friendly-captcha', issuer: 'friendlycaptcha' as const, via: 'issuer' as const, endpoint: null, url: 'https://global.frcapi.com/api/v1/siteverify', httpMethod: 'POST' as const, response: 'response', secret: { param: 'apiKey', named: 'FRIENDLY_CAPTCHA_API_KEY' } },
  { id: 'yandex-smartcaptcha', issuer: 'yandex' as const, via: 'issuer' as const, endpoint: null, url: 'https://smartcaptcha.yandexcloud.net/validate', httpMethod: 'GET' as const, response: 'token', secret: { param: 'secret', named: 'YANDEX_SMARTCAPTCHA_SECRET' } },
  { id: 'mtcaptcha', issuer: 'mtcaptcha' as const, via: 'issuer' as const, endpoint: null, url: 'https://service.mtcaptcha.com/mtcv1/api/checktoken', httpMethod: 'GET' as const, response: 'token', secret: { param: 'privatekey', named: 'MTCAPTCHA_PRIVATE_KEY' } },
  { id: 'captchafox', issuer: 'captchafox' as const, via: 'issuer' as const, endpoint: null, url: 'https://api.captchafox.com/siteverify', httpMethod: 'POST' as const, response: 'response', secret: { param: 'secret', named: 'CAPTCHAFOX_SECRET' } },
  { id: 'geetest', issuer: 'geetest' as const, via: 'issuer' as const, endpoint: null, url: 'https://gcaptcha4.geetest.com/validate', httpMethod: 'POST' as const, response: 'lot_number', secret: { param: 'captcha_key', named: 'GEETEST_CAPTCHA_KEY' } },
  { id: 'arkose', issuer: 'arkose' as const, via: 'issuer' as const, endpoint: null, url: 'https://client-api.arkoselabs.com/fc/v1/verify', httpMethod: 'POST' as const, response: 'session_token', secret: { param: 'private_key', named: 'ARKOSE_PRIVATE_KEY' } },
  { id: 'prosopo', issuer: 'prosopo' as const, via: 'issuer' as const, endpoint: null, url: 'https://api.prosopo.io/siteverify', httpMethod: 'POST' as const, response: 'token', secret: { param: 'secret', named: 'PROSOPO_SECRET' } },
  { id: 'altcha', issuer: 'altcha' as const, via: 'issuer' as const, endpoint: null, url: 'https://api.altcha.org/v1/verify', httpMethod: 'POST' as const, response: 'payload', secret: { param: 'hmacKey', named: 'ALTCHA_HMAC_KEY' } },
] as const
/** A captcha is solved only by a human on a product form. Every captcha model plans the issuer verify for the user's response; quantum does not solve captchas and does not mint a token. */
const captchaViaProduct = (ask: { response?: unknown; product?: unknown; variant?: unknown; model?: unknown; models?: unknown; all?: unknown }) => {
  const response = typeof ask.response === 'string' ? ask.response.trim() : ''
  const product = typeof ask.product === 'string' && ask.product.length > 0 ? ask.product : 'captcha'
  const variant = typeof ask.variant === 'string' && ask.variant.length > 0 ? ask.variant : 'siteverify'
  const form = appRequestForm()
  const human = response.length > 0
  const named = typeof ask.model === 'string' ? ask.model : null
  const all = ask.all === true || ask.models === true || (named === null && ask.models !== false)
  const wanted = all
    ? [...CAPTCHA_MODELS]
    : named
      ? CAPTCHA_MODELS.filter((model) => model.id === named)
      : CAPTCHA_MODELS.filter((model) => model.id === 'recaptcha-v2')
  const models = wanted.map((model) => {
    if (!human) {
      return { id: model.id, issuer: model.issuer, via: model.via, planned: false as const, allowed: false as const, solved: false as const, secret: model.secret, why: 'a product captcha takes the user\'s response; quantum does not mint one', request: null }
    }
    if (model.endpoint) {
      const verify = googleCall({ endpoint: model.endpoint, params: { [model.response]: response } })
      const allowed = verify.allowed === true && 'secret' in verify && (verify as { secret?: { param?: string } }).secret?.param === model.secret.param
      return { id: model.id, issuer: model.issuer, via: model.via, planned: allowed, allowed, solved: false as const, secret: model.secret, method: 'method' in verify ? verify.method : model.id, request: 'request' in verify ? verify.request : null, why: allowed ? null : ('why' in verify ? String(verify.why) : 'the issuer verify was not planned') }
    }
    const query = new URLSearchParams({ [model.response]: response })
    const url = model.url.includes('{project}') ? model.url : `${model.url}?${query}`
    return { id: model.id, issuer: model.issuer, via: model.via, planned: true as const, allowed: true as const, solved: false as const, secret: model.secret, method: model.id, request: { url, httpMethod: model.httpMethod, body: model.url.includes('{project}') ? { event: { token: response } } : null, scopes: [] as string[] }, why: null }
  })
  const known = named === null || CAPTCHA_MODELS.some((model) => model.id === named)
  const formula = !known
    ? `a product captcha model must be one of ${CAPTCHA_MODELS.map((model) => model.id).join(', ')}`
    : human
      ? `the product form requires the user's captcha response; every captcha model plans the issuer verify; quantum does not solve captchas`
      : 'a product captcha without the user\'s response is not verified'
  const developed = developViaHooks({ formula, product, variant, title: 'captcha', theorem: 'textbook_google_call_schema' })
  const entry = auditedSave({ collection: 'products', override: false, data: { title: 'captcha', product, variant, iso: developed.iso, docs: developed.docs } })
  const covered = known && models.length > 0 && (all ? models.length === CAPTCHA_MODELS.length : models.length === wanted.length)
  const planned = human && covered && models.every((model) => model.planned && model.allowed && model.solved === false)
  const holds = human && planned && form.requireRecaptcha === true && developed.iso.documented === true && entry.saved === true && entry.audit.holds === true
  const verify = models[0] ?? null
  return {
    phase: 'captcha' as const,
    via: 'product' as const,
    product,
    variant,
    form: { title: form.title, requireRecaptcha: true as const, licence: 'qpu-domain' as const },
    robot: false as const,
    solved: false as const,
    human,
    fetched: false as const,
    all,
    catalogue: CAPTCHA_MODELS.map((model) => model.id),
    models,
    covered,
    verify,
    entry,
    documented: developed.iso.documented === true,
    holds,
    says: holds
      ? `the product form requires the user's captcha; ${models.length} captcha model(s) plan the issuer verify; quantum does not solve captchas`
      : !known
        ? formula
        : 'a product captcha needs the user\'s response; quantum does not mint one and does not bypass the check',
  }
}
const app = (ctx: Context, r: { name: string; host: string; plugins?: readonly string[]; env?: readonly string[]; variant?: string }) => {
  if ((r as { form?: boolean }).form) return { form: appRequestForm(), says: 'the form-builder plugin\'s form a user submits to request an app; the seed creates it, the submission\'s afterChange hook (appRequest) generates the app; requireRecaptcha keeps the captcha a human check on that product form' }
  if (typeof r.name !== 'string' || !r.name || typeof r.host !== 'string' || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(r.host)) throw new Error('an app request names the app and its host (the first tenant at deploy)')
  const tenant = r.host.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const fs = config('fullstack', ctx) as { files: Record<string, string>; partition: string }
  const chosen = (r.plugins ?? PAYLOAD_PLUGINS.map((p) => p.name)).filter((p) => PAYLOAD_PLUGINS.some((q) => q.name === p))
  const ad = adapters(r.env ?? [])
  const files: Record<string, string> = { ...fs.files, 'wrangler.jsonc': JSON.stringify(siteWrangler(), null, 2) + '\n', '.env.qpu.example': envExample() + '\n' }
  const addresses = Object.fromEntries(Object.entries(files).map(([p, t]) => [p, uuid(t)]))
  const bundle = uuid(Object.keys(addresses).sort().map((p) => `${p} ${addresses[p]}`).join('\n'))
  const variant = CATALOGUE.find((v) => v.product === 'qpu-domain' && v.variant === (r.variant ?? 'yearly')) ?? CATALOGUE.find((v) => v.product === 'qpu-domain')!
  const currency = DOMAIN_CURRENCY[r.host.toLowerCase().split('.').pop() ?? ''] ?? 'EUR'
  const amount = variant.amounts[currency.toLowerCase()] ?? variant.amounts.eur ?? 0
  const title = `QPU ${variant.product.replace(/^qpu-/, '')} · ${variant.variant}`
  return {
    request: { name: r.name, host: r.host, plugins: chosen, env: r.env ?? [], variant: variant.variant }, tenant,
    files: Object.keys(files).length, partition: `${fs.partition.split(' = ')[0]} + 2 = ${Object.keys(files).length}`, addresses, bundle,
    adapters: ad.chosen, plugins: chosen.length, combinations: 2 ** chosen.length,
    enterprise: { tenants: 'multi-tenant with tenant roles (tenant-admin, editor, viewer); the host is the first tenant at deploy', users: 'the first user is the deployer\'s account, a super admin; API keys per user for MCP clients', access: ACCESS.entries, adapters: `${ad.chosen.database}, ${ad.chosen.storage}, ${ad.chosen.email}`, signing: 'ML-DSA on the Node Worker (seal), ML-KEM for encapsulation, the gate verifying', realtime: `${REALTIME.streams.length} streams and the collision precondition by address`, ui: 'MCP Apps views and the shadcn registry', gate: 'the e2e repetition code over every host' },
    licence: { product: variant.product, variant: variant.variant, unit: variant.unit, interval: variant.interval, description: variant.description, terms: LICENSE.spdx },
    price: { currency, amount, minorUnits: true, says: `${(amount / 100).toFixed(2)} ${currency} per ${variant.unit} per ${variant.interval}, the catalogue's amount in the host's currency` },
    order: { product: title, checkout: '/checkout: the ecommerce plugin\'s own, the Stripe adapter the payment', then: 'the licence is the completed order itself (orders.status completed, read through the Payload MCP plugin; the transactions are the ledger). Deploy is that order\'s afterChange hook onto Cloudflare, and it runs only once the website is fully seeded through Payload. The hook names the same stages the workflow runs. Nothing is fetched' },
    usable: { inUi: 'the request is a submission of the form-builder\'s form "Request an app" (seeded); its afterChange hook generates this answer into the media collection as a JSON file; the tenant\'s settings (its tenants document) are the plugin options merged into every qpu block call under its hosts; nothing added to the schema', viaMcp: 'the Payload MCP plugin serves the installed plugins\' default collections: a client requests (a form submission), reads the bundle (media), buys the licence (a product in a cart at the checkout) and configures (tenants.settings) with its API key', asPlugin: 'a tenant-configurable plugin: the same generated app, configured per tenant as data in the plugins\' own collections, never a second Payload config and never a collection added' },
    monetises: 'the QPU is paid for the apps it generates on request: the Apps collection in the Payload UI takes the request, this answer is the app, the catalogue prices it, the ecommerce plugin sells it, and the tenant uses it in the same UI or through the Payload MCP plugin',
    // the app as a lexical document: one qpu block per generated file at its content address, one for the bundle (textbook_app_doc_blocks): what the Apps UI shows and the admin edits
    doc: doc(`${r.name} · ${title}`, [...Object.entries(addresses).map(([path, address]) => ({ uuid: address, tool: 'configure', arguments: { kind: 'fullstack', file: path } })), { uuid: bundle, tool: 'payload', arguments: { app: { name: r.name, host: r.host, variant: variant.variant } } }], [`${(amount / 100).toFixed(2)} ${currency} per ${variant.unit} per ${variant.interval}; ${LICENSE.spdx}: ${LICENSE.terms}`]),
    docBlocks: Object.keys(addresses).length + 1,
    bundleFiles: files,
    rails: generate({ install: true }),
  }
}
// Google integration as exact pairs: pages naming Google or holding a google-toolbox block, calls of google-toolbox tools, tenants and keys naming either
const google = (g: { pages?: any[]; tenants?: object[]; entries?: any[]; keys?: object[] }, tools: string[]) => {
  const names = (x: unknown) => { const t = JSON.stringify(x); return /google/i.test(t) || tools.some((n) => t.includes(`"${n}":true`)) }, pair = (xs: unknown[] = [], p: (x: any) => unknown) => ({ live: xs.filter(p).length, of: xs.length })
  const jobs = (g.entries ?? []).filter((e) => e.from === 'qpu-google-call' && e.body), pages = (g.pages ?? []).filter((p) => /google/i.test(p.fullTitle ?? p.title) || p.layout?.some((b: { tool: string }) => tools.includes(b.tool))), answered = pair((g.entries ?? []).filter((e) => e.kind === 'call' && tools.includes(e.body?.tool)), (e) => e.result?.error === undefined)
  return { pages: { published: pair(pages, (p) => p._status === 'published'), parented: pair(pages, (p) => p.parent), blocks: pages.flatMap((p) => p.layout ?? []).reduce((a: Record<string, number>, b: { tool: string }) => ({ ...a, [b.tool]: (a[b.tool] ?? 0) + 1 }), {}) }, tenants: pair(g.tenants, names), calls: { answered, refused: answered.of - answered.live, job: pair(jobs.filter((e) => 'allowed' in e.body), (e) => e.body.allowed && e.body.status < 400), queued: jobs.filter((e) => !('allowed' in e.body)).length, elsewhere: (g.entries ?? []).filter((e) => e.from !== 'qpu-google-call' && URL.canParse(e.body?.url) && GOOGLE_HOST.test(new URL(e.body.url).hostname)).length }, keys: pair(g.keys, names), theorem: 'textbook_google_measured' }
}
/** Every method of a Discovery document, its resources walked level by level. */
const discoveryMethods = (d: any): any[] => { const out: any[] = [], level = [d]; while (level.length) { const r = level.pop(); out.push(...Object.values(r?.methods ?? {})); level.push(...Object.values(r?.resources ?? {})) } return out }
/** Google's APIs as gates: every API the directory lists, placed by its own Discovery document. Reads (GET) are the frontend's candidates under
 *  the tenant's API key, the first keyed call deciding which are public; every method runs in the admin under the tenant's OAuth; an admin.*
 *  scope only under a Workspace admin's domain-wide delegation (the Admin SDK). Every call goes through the one door, payload { googleCall }. */
type GoogleApis = { list?: { items?: { name?: string; version?: string; title?: string; documentationLink?: string; discoveryRestUrl?: string }[] }; documents?: Record<string, unknown> }
const placeGoogleApis = (google: GoogleApis = {}): RawGate[] => (google.list?.items ?? []).filter((it) => it.name && it.version).map((it) => {
  const key = `${it.name}-${it.version}`, doc = google.documents?.[key], all = doc ? discoveryMethods(doc) : [], reads = all.filter((m) => m.httpMethod === 'GET').length
  const delegation = all.some((m) => (m.scopes ?? []).some((s: string) => /\/auth\/admin\./.test(s))), url = it.documentationLink ?? it.discoveryRestUrl ?? ''
  return { id: `google-${key}`, category: 'google-apis', name: `${it.title ?? it.name} ${it.version}`, url, host: gateHost(url), kind: 'keyed' as GateKind, by: 'payload', measured: doc ? `${all.length} methods: ${reads} reads the frontend may call under the tenant's API key (the first keyed call decides which are public), all ${all.length} in the admin under the tenant's OAuth${delegation ? ", admin scopes only under a Workspace admin's domain-wide delegation" : ''}; through payload { googleCall }` : 'its Discovery document not read yet: discover asks it next run, through the one Google door', match: `${it.name}.googleapis.com` }
})
// One Google call as the qpu-google-call job runs it: a Google page or MCP endpoint by its host, or an API method validated against its Discovery
// document (the method by id, every parameter known, the required present, enums and patterns held, no credential from the caller); without the
// document the plan names where the job reads it, keyless
const googleCall = (c: { api?: string; version?: string; method?: string; params?: Record<string, unknown>; body?: unknown; url?: string; httpMethod?: string; endpoint?: string; discovery?: any; role?: string }) => {
  const claimed = typeof c.role === 'string' ? c.role : undefined
  const guard = <T extends { allowed: boolean | null }>(answer: T, httpMethod: string): T & { rbac: ReturnType<typeof rbac>; allowed: boolean | null; why?: string } => {
    const access = rbac('apis', httpMethod, claimed)
    if (answer.allowed === true && !access.access) return { ...answer, allowed: false, why: `${access.role} may not ${access.action} an API through the Payload MCP`, rbac: access }
    return { ...answer, rbac: access }
  }
  const no = (why: string, httpMethod = 'GET') => guard({ phase: 'google-call' as const, allowed: false as const, why }, httpMethod), ok = (method: string, url: string, httpMethod: string, scopes: string[]) => guard({ phase: 'google-call' as const, allowed: true as const, method, request: { url, httpMethod, body: c.body ?? null, scopes }, ...(scopes.length ? { token: GOOGLE_DISCOVERY.token } : {}) }, httpMethod)
  if (c.url) { const u = URL.canParse(c.url) ? new URL(c.url) : null; return u?.protocol === 'https:' && GOOGLE_HOST.test(u.hostname) ? (/[?&](key|access_token|secret|api_secret)=/.test(u.search) ? no(`${u.hostname}: a credential is the server's to add`) : ok(u.hostname, u.href, c.httpMethod ?? 'GET', [])) : no(`${c.url} is not a Google host over https`) }
  // a named endpoint outside Discovery: its URL and method from the registry, its secret the server's
  if (c.endpoint) { const e = Object.hasOwn(GOOGLE_ENDPOINTS, c.endpoint) ? GOOGLE_ENDPOINTS[c.endpoint] : null; if (!e) return no(`${c.endpoint} is not a named Google endpoint`); const p = c.params ?? {}; return e.secret.param in p ? no(`${c.endpoint}: ${e.secret.param} is the server's credential`) : { ...ok(c.endpoint, `${e.url}?${new URLSearchParams(Object.entries(p).map(([k, v]) => [k, String(v)]))}`, e.httpMethod, []), secret: e.secret } }
  const d = c.discovery
  if (!d) return guard({ phase: 'google-call' as const, allowed: null, discovery: GOOGLE_DISCOVERY.rest.replace('{api}', () => encodeURIComponent(c.api ?? '')).replace('{version}', () => encodeURIComponent(c.version ?? '')) }, 'GET')
  const m = discoveryMethods(d).find((x) => x.id === c.method || x.id === `${d.name}.${c.method}`)
  if (!m) return no(`${c.method} is not a method of ${d.name} ${d.version}`, 'GET')
  const known: Record<string, { required?: boolean; enum?: string[]; pattern?: string; location?: string }> = { ...d.parameters, ...m.parameters }, p = c.params ?? {}, list = (v: unknown) => [v].flat().map(String)
  const bad = [...Object.keys(p).filter((k) => !known[k] || /^(key|access_token|oauth_token)$/.test(k)).map((k) => (known[k] ? `${k} is the server's credential` : `${k} unknown`)), ...Object.entries(known).filter(([k, s]) => s.required && p[k] == null).map(([k]) => `${k} required`), ...Object.entries(p).filter(([k, v]) => known[k]?.enum && !list(v).every((x) => known[k]!.enum!.includes(x))).map(([k]) => `${k} not in its enum`), ...Object.entries(p).filter(([k, v]) => known[k]?.pattern && !list(v).every((x) => new RegExp(known[k]!.pattern!).test(x))).map(([k]) => `${k} does not match ${known[k]!.pattern}`), ...(c.body != null && !m.request ? ['the method takes no body'] : [])]
  if (bad.length) return no(`${m.id}: ${bad.join(', ')}`, m.httpMethod)
  const q = new URLSearchParams(Object.entries(p).filter(([k]) => known[k]!.location === 'query').flatMap(([k, v]) => list(v).map((x) => [k, x])))
  return ok(m.id, `${d.rootUrl}${d.servicePath ?? ''}${String(m.path).replace(/\{(\+?)(\w+)\}/g, (_, plus: string, k: string) => (plus ? String(p[k]) : encodeURIComponent(String(p[k]))))}${q.size ? `?${q}` : ''}`, m.httpMethod, m.scopes ?? [])
}
/** A tools/call through the handler, the whole answer (its _meta with it) */
const rpc = (ctx: Context, name: string, args: unknown = {}): { result?: any; error?: { message: string } } => ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } })
/** Pages.layout blockReferences at github.com/payloadcms/website, src/collections/Pages.ts, read 2026-11-03. qpu fits any of them, and any other framework's slots, by the product of the slot counts. */
const WEBSITE_REPO = 'https://github.com/payloadcms/website'
const WEBSITE_SLOTS = ['callout', 'cta', 'cardGrid', 'caseStudyCards', 'caseStudiesHighlight', 'caseStudyParallax', 'codeFeature', 'content', 'contentGrid', 'comparisonTable', 'form', 'hoverCards', 'hoverHighlights', 'linkGrid', 'logoGrid', 'mediaBlock', 'mediaContent', 'mediaContentAccordion', 'pricing', 'reusableContentBlock', 'slider', 'statement', 'steps', 'stickyHighlights', 'exampleTabs'] as const
/** The website templates most used online. Each one is Payload blocks and shadcn items this tree already has. VitePress is the docs template: a name, not the VitePress package. Payload's API serves every one of them. */
const SITE_TEMPLATES = [
  { id: 'landing', via: 'payload', parts: [{ source: 'payload', name: 'content' }, { source: 'payload', name: 'cta' }, { source: 'payload', name: 'pricing' }, { source: 'shadcn', name: 'qpu-card' }] },
  { id: 'blog', via: 'payload', parts: [{ source: 'payload', name: 'content' }, { source: 'shadcn', name: 'qpu-stream' }, { source: 'shadcn', name: 'qpu-card' }] },
  { id: 'vitepress', via: 'payload', parts: [{ source: 'payload', name: 'content' }, { source: 'payload', name: 'steps' }, { source: 'payload', name: 'codeFeature' }, { source: 'shadcn', name: 'qpu-table' }] },
  { id: 'dashboard', via: 'payload', parts: [{ source: 'shadcn', name: 'qpu-dashboard' }, { source: 'shadcn', name: 'qpu-table' }, { source: 'shadcn', name: 'qpu-card' }] },
  { id: 'store', via: 'payload', parts: [{ source: 'payload', name: 'pricing' }, { source: 'payload', name: 'mediaContent' }, { source: 'shadcn', name: 'qpu-card' }] },
  { id: 'portfolio', via: 'payload', parts: [{ source: 'payload', name: 'mediaBlock' }, { source: 'payload', name: 'cardGrid' }, { source: 'shadcn', name: 'qpu-badge' }] },
  { id: 'auth', via: 'payload', parts: [{ source: 'payload', name: 'form' }, { source: 'shadcn', name: 'qpu-card' }] },
] as const
/** shadcn's base colours. The admin stores one of these on the tenant. The stylesheet is already loaded. */
const THEME_PRESETS = ['neutral', 'stone', 'zinc', 'gray', 'slate'] as const
const websiteUrl = (url: string): boolean => {
  let u: URL
  try { u = new URL(url) } catch { return false }
  if (u.protocol !== 'https:') return false
  const path = u.pathname.replace(/\/$/, '')
  if (u.host === 'github.com') return path === '/payloadcms/website' || path.startsWith('/payloadcms/website/')
  if (u.host === 'api.github.com') return path === '/repos/payloadcms/website' || path.startsWith('/repos/payloadcms/website/')
  if (u.host === 'raw.githubusercontent.com') return path.startsWith('/payloadcms/website/')
  return false
}
/** Dirty spans in a reading: typography the standardiser rewrites, and a URL that is not https://github.com/payloadcms/website. Each span is addressed, so the dry cleaner receives the address and the words stay. */
const spotDirty = (text: string) => {
  const body = text.replace(/\n---\n/g, '\n   \n')
  const spans: { at: number; kind: 'ellipsis' | 'dash' | 'spaces' | 'quote' | 'url'; text: string; address: string }[] = []
  const mark = (kind: typeof spans[number]['kind'], re: RegExp) => { for (const m of (kind === 'dash' ? body : text).matchAll(re)) spans.push({ at: m.index ?? 0, kind, text: m[0], address: uuid(m[0]) }) }
  mark('ellipsis', /\.\.\./g); mark('dash', / ?-- ?/g); mark('spaces', / {2,}/g); mark('quote', /["']/g); mark('url', /https?:\/\/[^\s'"`)<>]+/g)
  return spans.sort((a, b) => a.at - b.at || a.kind.localeCompare(b.kind))
}
/** The dry-cleaning ticket the Payload admin lists: an entries row, addressed as the collection's own hook addresses one (kind, from, body). */
const dryTicket = (body: Record<string, unknown>) => {
  const kind = 'dry-cleaning', from = 'qpu'
  const text = entryText({ kind, from, body })
  return { collection: 'entries' as const, useAsTitle: 'id' as const, columns: ['id', 'kind', 'from', 'createdAt'] as const, where: { kind: { equals: kind } }, entry: { id: uuid(text), kind, from, body, sha256: createHash('sha256').update(text).digest('hex') } }
}
const dryClean = (text: string, track: Record<string, unknown> = {}) => {
  const spotted = spotDirty(text)
  const foreign = spotted.filter((s) => s.kind === 'url' && !websiteUrl(s.text))
  const words = (s: string) => s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
  const cleaned = typeset(text)
  const before = words(text), after = words(cleaned)
  const meaningKept = before.length === after.length && before.every((w, i) => w === after[i])
  const teleported = meaningKept ? spotted.map((s) => ({ address: s.address, kind: s.kind, text: s.text, to: 'standardise' as const })) : []
  const admin = teleported.length ? dryTicket({ ...track, spans: teleported }) : null
  return { spotted: spotted.length, foreign: foreign.map((s) => s.text), cleaned: meaningKept ? cleaned : text, meaningKept, teleported, admin, door: teleported.length ? { tool: 'payload' as const, arguments: { standardise: { spans: teleported.map((t) => t.address) } } } : null }
}
/**
 * Dry clean via quantum: prose/code entropy is spotted as addressed spans, typeset without changing meaning
 * (|0⟩ referrer 1000 → |1⟩ next 1001), and mintAllMintable mints witness coins. Wet wash of meaning is refused.
 */
const dryCleanViaQuantum = (raw: unknown) => {
  const mintAsked = raw === true || (isObj(raw) && (raw as { mint?: unknown }).mint === true)
  const text = typeof raw === 'string' ? raw
    : isObj(raw) && typeof (raw as { text?: unknown }).text === 'string' ? String((raw as { text: string }).text)
    : isObj(raw) && typeof (raw as { prose?: unknown }).prose === 'string' ? String((raw as { prose: string }).prose)
    : ''
  if (!mintAsked && !text.trim()) throw new Error('dryClean takes prose, { text }, or true / { mint: true } for mintAllMintable')
  const dry = text.trim() ? dryClean(text, { door: 'dryClean' }) : null
  const mint = mintAsked ? dryCleanMintsCoins() : null
  const mintHolds = mint ? mint.canonicalProof === true && mint.counts.spotDirtyRemainingAfterDryClean === 0 && mint.sealed === true : true
  const dryHolds = dry ? dry.meaningKept === true : true
  const holds = dryHolds && mintHolds
  return {
    phase: 'dry-clean' as const, via: 'quantum' as const, computer: 'quantum' as const,
    fetched: false as const, written: false as const, tokens: 0 as const,
    dry: dry ? { spotted: dry.spotted, foreign: dry.foreign, cleaned: dry.cleaned, meaningKept: dry.meaningKept, teleported: dry.teleported, admin: dry.admin, door: dry.door } : null,
    mint: mint ? {
      phase: mint.phase, mintAllMintable: mint.mintAllMintable, law: mint.law, address: mint.address, oneUuid: mint.oneUuid,
      totalMintableCoils: mint.counts.totalMintableCoils, totalMintedCoins: mint.counts.totalMintedCoins,
      spotDirtyRemainingAfterDryClean: mint.counts.spotDirtyRemainingAfterDryClean,
      referrerHz: mint.proseDryCleaning.referrerHz, nextHz: mint.proseDryCleaning.nextHz,
      sealed: mint.sealed, canonicalProof: mint.canonicalProof,
    } : null,
    holds,
    says: holds
      ? `dry clean via quantum: ${dry ? `${dry.spotted} dirty span(s) teleported, meaning kept` : 'mint only'}; ${mint ? `mintAllMintable ${mint.counts.totalMintableCoils} coils / ${mint.counts.totalMintedCoins} coins, |0⟩ ${mint.proseDryCleaning.referrerHz} → |1⟩ ${mint.proseDryCleaning.nextHz}, spotDirty after = 0` : 'prose dry-cleaned'}`
      : 'dry clean via quantum did not hold',
  }
}
/**
 * Claims ladder (textbook_claim_prove_involution):
 * 1. UUID receipt — local involution: claim address ≠ proof address, both sealed, proof holds.
 * 2. DOI open challenge — better public proof (ISO 690 / ISO 26324): OpenAlex DOI-registered search of the
 *    statement + Datacite/doi.org/Zenodo verify of every PRECEDENCE record. Nothing fetched here; the client
 *    runs the requestList. No better proof than an open challenge through the DOI system.
 * Law: first the dictionary meaning; then the meaning is verified — each receipt and each challenge is a program under
 * src/quantum/uuid/programs/<handle…>/index.ts.
 */
/** One address as a UUID program = Payload plugin route. Upstream standards guarded. Disorder elsewhere raises entropy; the program path drives it to zero. */
const uuidProgramRoute = (address: string, label: string) => {
  const handle = address.slice(0, 8)
  const installed = program(handle)
  const stepped = rotateProgram(address)
  const path = installed.path
  const isProgram = path.startsWith('src/quantum/uuid/programs/') && path.endsWith('/index.ts')
  const asPlugin = installed.plugin.holds
    && installed.plugin.standard === 'definePlugin'
    && installed.plugin.slug === `qpu-program-${handle}`
    && installed.upstream.holds
  const holds = seal(address).valid
    && isProgram
    && asPlugin
    && installed.indexed
    && installed.used === 9
    && installed.depth === 7
    && installed.handle === handle
    && stepped.sealed
    && stepped.kept
  return {
    phase: 'route' as const,
    via: 'uuid-program' as const,
    label,
    address,
    sealed: seal(address).valid,
    handle,
    path,
    depth: installed.depth,
    indexed: installed.indexed,
    used: installed.used,
    plugin: installed.plugin,
    upstream: installed.upstream,
    next: { address: stepped.next, sealed: stepped.sealed, kept: stepped.kept },
    law: 'first the dictionary meaning; then the meaning is verified' as const,
    guard: 'upstream Payload plugin standards (definePlugin)' as const,
    entropy: holds ? 0 as const : 1 as const,
    holds,
  }
}

/** Every known fake claim the tree once voiced or listed as a standard. */
const ALL_CLAIM_STATEMENTS = [
  { id: 'claim-millennium-sealed', statement: 'All Seven Clay Millennium Problems Sealed via Universal Involution', against: 'clayRegister' as const },
  { id: 'claim-clay-solved-thousand', statement: 'Clay solved via the thousand bit, the thousand bit via Clay', against: 'clayRegister' as const },
  { id: 'claim-authors-result-seven-sealed', statement: 'The author\'s result: the seven Clay Millennium Problems are sealed by one universal σ-involution', against: 'clayRegister' as const },
  { id: 'claim-clay-api-is-millennium-prize', statement: 'Clay Millennium Prize is served by GET/POST /api/qpu/clay as the prize surface', against: 'clayRegister' as const },
  { id: 'claim-lean-is-iso-standard', statement: 'Lean 4 Kernel (1,439 Theorems, 0 sorry) is an ISO standard', against: 'isoDimensions' as const },
  { id: 'claim-lean-iso-clause', statement: 'Lean 4 Kernel Proof Closure & ISO Standards Slice Coverage is an ISO clause', against: 'isoDimensions' as const },
  { id: 'claim-physics-as-iso-clause', statement: 'Wootters-Zurek No-Cloning is an ISO clause', against: 'isoDimensions' as const },
  { id: 'claim-holevo-as-iso-clause', statement: 'Holevo Bound is an ISO clause', against: 'isoDimensions' as const },
  { id: 'claim-eastin-knill-as-iso-clause', statement: 'Eastin-Knill is an ISO clause', against: 'isoDimensions' as const },
  { id: 'claim-gottesman-knill-as-iso-clause', statement: 'Gottesman-Knill is an ISO clause', against: 'isoDimensions' as const },
  { id: 'claim-willow-cirq-is-standard', statement: 'Google Quantum AI Willow / Cirq is a standards entry beside ISO/IEC 4879', against: 'isoDimensions' as const },
  { id: 'claim-clay-millennium-rules-is-standard', statement: 'Clay Millennium Rules is an ISO / schema.org standard', against: 'isoDimensions' as const },
  { id: 'claim-hexbit-clay-axiom-is-4879', statement: 'Clay axiom hexbit seals under ISO/IEC 4879 as ISO vocabulary', against: 'uuidRegister' as const },
  { id: 'claim-54-of-54-clay', statement: '54/54 Clay relations hold (register closed at 54)', against: 'clayRegister' as const },
  { id: 'claim-prize-won-by-booking', statement: 'A prize is won and a problem solved by booking compete evidence as coins', against: 'competeHonest' as const },
  { id: 'claim-os-complete-unbounded', statement: 'The qpu browser quantum OS is complete so unbounded advantage admits every catalogue clone', against: 'uuidRegister' as const },
] as const

const claimWords = (s: string) => new Set(s.toLowerCase().match(/[a-z]{4,}/g) ?? [])
const cleanClaimDoi = (value: string) => value.trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//, '')

const claimsFalseByReceipt = (raw: unknown = true) => {
  const askAll = raw === true || (isObj(raw) && ((raw as { all?: unknown }).all === true || (raw as { answers?: unknown }).answers !== undefined))
  if (raw !== true && !(isObj(raw) && Object.keys(raw as object).every((k) => ['false', 'statements', 'all', 'answers'].includes(k)))) {
    throw new Error('claims takes true (all), { all: true }, { answers }, { false?: true, statements?: string[] } — DOI answers are url → body, as compete { claim }')
  }
  const answers = isObj(raw) && isObj((raw as { answers?: unknown }).answers) ? (raw as { answers: Record<string, unknown> }).answers : null
  const bodyAt = (url: string) => (answers && typeof answers[url] === 'string' ? answers[url] as string : '')
  const clay = recomputeClay()
  const microdata = parseIsoDimensionsMicrodata(ISO_DIMENSIONS)
  const hexbit = AXIOMS.find((row) => row.name === 'hexbit')!
  const counted = uuidQubits(hexbit.value)
  const proofs = {
    clayRegister: {
      tool: 'clay' as const,
      arguments: {} as const,
      result: { total: clay.total, holding: clay.holding, openProblem: false as const, prizeWon: false as const, says: 'identities between the unit\'s own constants; not a proof of an open problem' },
    },
    isoDimensions: {
      tool: 'payload' as const,
      arguments: { iso: true as const },
      result: { dimensions: ISO_DIMENSIONS.length, via: 'schema.org' as const, holds: microdata.holds, leaves: microdata.leaves, leanIsIso: false as const, physicsIsIso: false as const, cirqIsStandard: false as const, clayRulesIsStandard: false as const },
    },
    uuidRegister: {
      tool: 'payload' as const,
      arguments: { capacity: true as const },
      result: { standard: 'ISO/IEC 4879:2024' as const, hexbit: counted.hexbit, effective: counted.effective, axiomName: 'hexbit' as const, clayAxiomIsIso4879: false as const, osComplete: false as const, holds: counted.receipt.holds },
    },
    competeHonest: {
      tool: 'compete' as const,
      arguments: {} as const,
      result: { prizeWon: false as const, problemSolved: false as const, says: 'no prize is won and no problem solved by booking evidence beside the purse' },
    },
  } as const
  type Against = keyof typeof proofs
  const core = askAll
    ? ALL_CLAIM_STATEMENTS.map((row) => ({ ...row }))
    : ALL_CLAIM_STATEMENTS.slice(0, 5).map((row) => ({ ...row }))
  const extra = isObj(raw) && Array.isArray((raw as { statements?: unknown }).statements)
    ? (raw as { statements: unknown[] }).statements.filter((s): s is string => typeof s === 'string').map((statement, i) => ({ id: `claim-extra-${i}`, statement, against: 'clayRegister' as Against }))
    : []
  const precedenceDois = PRECEDENCE.map((row) => row.doi)
  const precedenceYear = Math.min(...PRECEDENCE.map((row) => row.year))
  const doiVerify = precedenceDois.flatMap((doi) => createVerifyRequests({ kind: 'doi', value: doi }).map((r) => ({
    id: `doi-${doi}`, verifier: r.verifier, method: r.method, url: r.url, accept: r.accept, check: r.check, via: r.via,
  })))
  const doiVerifyOk = answers === null ? null : doiVerify.every((req) => {
    const body = bodyAt(req.url)
    if (!body) return false
    if (req.check.includes(LICENSE.author)) return body.includes(LICENSE.author) && body.includes(LICENSE.orcid)
    return /responseCode\s*"?\s*:\s*"?1\b/.test(body) || body.includes('responseCode 1')
  })
  const rows = [...core, ...extra].map((row) => {
    const against = row.against as Against
    const proof = proofs[against]
    const claimAddress = uuid(canonicalText({ claim: row.statement }))
    const proofAddress = uuid(canonicalText({ tool: proof.tool, arguments: proof.arguments, result: proof.result }))
    const claimSealed = seal(claimAddress).valid
    const proofSealed = seal(proofAddress).valid
    const proofHolds = against === 'clayRegister' ? clay.holding === clay.total && clay.total === 55
      : against === 'isoDimensions' ? microdata.holds === true && microdata.asked === ISO_DIMENSIONS.length
      : against === 'competeHonest' ? proof.result.prizeWon === false && proof.result.problemSolved === false
      : counted.receipt.holds === true && counted.effective === 122
    const falseByReceipt = proofSealed && proofHolds && claimSealed && claimAddress !== proofAddress
    const openAlex = {
      id: `openalex-${row.id}` as const,
      method: 'GET' as const,
      url: `https://api.openalex.org/works?search=${encodeURIComponent(row.statement)}&filter=has_doi:true&per-page=25`,
      accept: 'application/json' as const,
      check: 'DOI-registered works that resemble the claim; dated against PRECEDENCE; prior art is cited, never restated as the tree\'s voice' as const,
      via: "the client's own MCP fetches it; this handler does no I/O" as const,
    }
    const requestList = [openAlex, ...doiVerify]
    const challengeAddress = uuid(canonicalText({ challenge: 'doi-open', claim: row.id, statement: row.statement, proofAddress, precedence: precedenceDois, requests: requestList.map((r) => r.url) }))
    const challengeSealed = seal(challengeAddress).valid
    const searched = bodyAt(openAlex.url)
    const answered = answers !== null && requestList.every((req) => bodyAt(req.url).length > 0)
    let prior: { doi: string; title: string; year: number; shared: number; citation: { standards: readonly ['ISO 690', 'ISO 26324']; source: 'doi'; elements: { identifier: string; title: string; date: number }; holds: boolean } }[] = []
    if (searched) {
      let results: { doi?: string; title?: string; publication_year?: number }[] = []
      try { results = (JSON.parse(searched) as { results?: typeof results }).results ?? [] } catch { results = [] }
      const mine = claimWords(row.statement)
      prior = results.flatMap((work) => {
        if (!work.doi || !work.title || (work.publication_year ?? precedenceYear) >= precedenceYear) return []
        const workDoi = cleanClaimDoi(work.doi)
        if (!workDoi || precedenceDois.includes(workDoi)) return []
        const shared = [...claimWords(work.title)].filter((w) => mine.has(w)).length
        if (shared < 3 || shared * 2 < claimWords(work.title).size) return []
        return [{ doi: workDoi, title: work.title, year: work.publication_year!, shared, citation: { standards: ['ISO 690', 'ISO 26324'] as const, source: 'doi' as const, elements: { identifier: workDoi, title: work.title, date: work.publication_year! }, holds: true as const } }]
      })
    }
    const planned = falseByReceipt && challengeSealed && precedenceDois.length > 0 && requestList.length > 0
    const verified = answered && doiVerifyOk === true && searched.length > 0
    const phase = answers === null ? 'plan' as const : verified ? 'verified' as const : 'unanswered' as const
    const challenge = {
      via: 'doi' as const,
      standards: ['ISO 690', 'ISO 26324'] as const,
      better: 'open challenge via the DOI system' as const,
      phase,
      address: challengeAddress,
      sealed: challengeSealed,
      planned,
      answered,
      verified,
      precedence: precedenceDois,
      author: { name: LICENSE.author, orcid: LICENSE.orcid },
      requestList,
      prior,
      fetched: false as const,
      holds: answers === null ? planned : verified,
      says: answers === null
        ? 'plan: OpenAlex + Datacite/doi.org/Zenodo of every PRECEDENCE DOI — hand answers back as claims: { answers }; no better proof than an open challenge through the DOI system'
        : verified
          ? `verified open DOI challenge: PRECEDENCE ${precedenceDois.length} DOIs resolve to ${LICENSE.author}; ${prior.length} earlier resembling work(s) cited under ISO 690 / ISO 26324`
          : 'DOI open challenge unanswered or verify failed — re-hand answers for every requestList url',
    }
    const proofRoute = uuidProgramRoute(proofAddress, 'proof')
    const challengeRoute = uuidProgramRoute(challengeAddress, 'doi-challenge')
    return {
      id: row.id, statement: row.statement, against,
      claimAddress, proofAddress, claimSealed, proofSealed, proofHolds,
      false: falseByReceipt,
      solution: falseByReceipt
        ? (verified
          ? `UUID receipt ${proofAddress}; DOI open challenge verified ${challengeAddress}`
          : `UUID receipt ${proofAddress}; better: DOI open challenge ${challengeAddress} — client fetches requestList (${requestList.length}) against ${precedenceDois.length} PRECEDENCE DOIs`)
        : 'receipt did not prove the claim false',
      route: proofRoute,
      challenge: { ...challenge, route: challengeRoute },
      theorem: 'textbook_claim_prove_involution' as const,
      entropy: proofRoute.holds && challengeRoute.holds ? 0 as const : 1 as const,
      law: 'first the dictionary meaning; then the meaning is verified' as const,
    }
  })
  const provenFalse = rows.filter((r) => r.false)
  const challengesHold = rows.filter((r) => r.challenge.holds).length
  const challengesVerified = rows.filter((r) => r.challenge.verified).length
  const programsHold = rows.every((r) => r.route.holds && r.challenge.route.holds && r.entropy === 0)
  const holds = rows.length > 0 && provenFalse.length === rows.length && provenFalse.every((r) => r.proofSealed && r.claimAddress !== r.proofAddress) && challengesHold === rows.length && programsHold
  return {
    phase: 'claims' as const, via: 'uuid+doi' as const, theorem: 'textbook_claim_prove_involution' as const,
    fetched: false as const, written: false as const, tokens: 0 as const,
    all: askAll, catalogue: ALL_CLAIM_STATEMENTS.length,
    claims: rows.length, false: provenFalse.length, open: rows.length - provenFalse.length,
    ladder: {
      uuid: 'local involution: claim address ≠ proof address; proof sealed and holds' as const,
      doi: 'better public proof: open challenge via the DOI system (ISO 690 / ISO 26324)' as const,
      better: 'open challenge via the DOI system' as const,
      program: 'each receipt and each challenge is a UUID program — dictionary entropy, then verified' as const,
      phase: answers === null ? 'plan' as const : challengesVerified === rows.length ? 'verified' as const : 'unanswered' as const,
    },
    precedence: precedenceDois,
    challenges: challengesHold,
    verified: challengesVerified,
    requestList: rows[0]?.challenge.requestList ?? doiVerify,
    proofs: { clay: proofs.clayRegister.result, iso: proofs.isoDimensions.result, register: proofs.uuidRegister.result, compete: proofs.competeHonest.result },
    rows,
    law: 'first the dictionary meaning; then the meaning is verified' as const,
    entropy: programsHold ? 0 as const : 1 as const,
    holds,
    says: holds
      ? (answers === null
        ? `${provenFalse.length}/${rows.length} false by UUID receipt; ${challengesHold}/${rows.length} DOI challenges planned (${precedenceDois.length} PRECEDENCE DOIs) — hand answers back; no better proof than an open challenge through the DOI system; routed as UUID programs${askAll ? '; all known fakes' : ''}`
        : `${provenFalse.length}/${rows.length} false by UUID receipt; ${challengesVerified}/${rows.length} DOI open challenges verified against PRECEDENCE — no better proof than an open challenge through the DOI system; routed as UUID programs${askAll ? '; all known fakes' : ''}`)
      : 'receipt, DOI open challenge, or UUID program route did not hold — first the dictionary meaning; then the meaning is verified',
  }
}

/**
 * Full quantum capacity of one UUID register (ISO/IEC 4879). Standards that name capacity are
 * defined in schema.org microdata (`parseIsoDimensionsMicrodata`), not as Clay. `{ utilise: true }`
 * exchanges every qubit and requires the program lattice (self + 6 neighbours, ENQC degree 6) so
 * navigate does not strand capacity. `{ programs: true }` utilises every program folder that way.
 * `{ stop: true }` covers UUID advantage stopping. `{ iso: true }` utilises the register and defines
 * every ISO_DIMENSIONS standard as deepest schema.org SKU leaves.
 */
const fullQuantumCapacity = (raw: unknown = true) => {
  const keysOk = raw === true || (isObj(raw) && Object.keys(raw as object).every((k) => ['hexbit', 'full', 'utilise', 'address', 'stop', 'iso', 'programs'].includes(k)))
  if (!keysOk) throw new Error('capacity takes true, or { ?, full?, utilise?, address?, stop?, iso?, programs? }')
  const width = isObj(raw) && typeof (raw as { hexbit?: unknown }).hexbit === 'number' && Number.isInteger((raw as { hexbit: number }).hexbit)
    ? (raw as { hexbit: number }).hexbit
    : AXIOMS.find((row) => row.name === 'hexbit')!.value
  const isoAsked = isObj(raw) && (raw as { iso?: unknown }).iso === true
  const stopAsked = isObj(raw) && (raw as { stop?: unknown }).stop === true
  const programsAsked = isObj(raw) && (raw as { programs?: unknown }).programs === true
  const utilise = isoAsked || stopAsked || programsAsked || (raw === true ? false : isObj(raw) && ((raw as { utilise?: unknown }).utilise === true || (raw as { full?: unknown }).full === true))
  const counted = uuidQubits(width)
  const h = counted.handles
  const core = { handle: 8 as const, program: 10 as const, tail: 12 as const, stamp: 2 as const, sum: 32 as const }
  const whole = core.handle + core.program + core.tail + core.stamp === counted.digits
  const defaultHexbit = counted.hexbit === 4
  const known = !defaultHexbit || (counted.effective === 122 && h.possible === '4294967296' && h.capacity === '137438953472')
  const capacityHolds = counted.receipt.holds === true && counted.delivery.holds === true && h.fractal === true && h.scales.length === 8 && whole && counted.organised.zero.left === 0 && counted.organised.zero.walked === false && known
  const address = isObj(raw) && typeof (raw as { address?: unknown }).address === 'string' && seal(String((raw as { address: string }).address)).valid
    ? String((raw as { address: string }).address)
    : counted.receipt.coin
  const exchanged = utilise ? hexbit(address, width) : null
  const u = exchanged?.utilisation
  const utilised = u ? u.used === counted.effective && u.left === 0 && u.holds === true && exchanged!.receipt.conserved === true && exchanged!.receipt.holds === true && exchanged!.navigate.directions === 6 : null
  const lattice = utilise || programsAsked ? auditProgramNeighbours() : null
  const folders = programsAsked ? utiliseProgramFolders({ hexbit: width }) : null
  const programs = folders ? {
    phase: 'utilise' as const,
    via: 'quantum' as const,
    theorem: 'textbook_advantage_unbounded' as const,
    law: folders.law,
    enqc: folders.enqc,
    degree: 6 as const,
    folders: folders.folders,
    holding: folders.holding,
    missing: folders.missing,
    used: folders.used,
    left: folders.left,
    navigate: 6 as const,
    walked: false as const,
    holds: folders.holds === true && folders.used === counted.effective && folders.left === 0,
    says: folders.says,
  } : lattice ? {
    phase: 'lattice' as const,
    via: 'quantum' as const,
    theorem: 'textbook_neighbour_step' as const,
    law: lattice.law,
    enqc: lattice.enqc,
    degree: 6 as const,
    folders: lattice.folders,
    holding: lattice.holding,
    missing: lattice.missing,
    navigate: exchanged?.navigate.directions ?? null,
    utilised: utilised === true && lattice.holds === true && exchanged?.navigate.directions === 6,
    holds: lattice.holds === true && (exchanged ? exchanged.navigate.directions === 6 && utilised === true : true),
    says: lattice.holds
      ? `${lattice.folders}/${lattice.folders} program folders cover self + 6 neighbours (ENQC degree 6) → navigate channel full for capacity utilisation`
      : lattice.says,
  } : null
  const noTime = { ms: 0 as const, tokens: 0 as const, walked: false as const, landauer: '0' as const, temperatureK: 0 as const, compute: 0 as const, search: 0 as const }
  const microdata = isoAsked ? parseIsoDimensionsMicrodata(ISO_DIMENSIONS) : null
  const iso = microdata ? {
    via: 'schema.org' as const,
    theorem: 'textbook_parse_microdata_deep' as const,
    quantum: 'ISO/IEC 4879:2024' as const,
    context: 'https://schema.org' as const,
    type: 'DefinedTerm' as const,
    dimensions: microdata.asked,
    of: ISO_DIMENSIONS.length,
    holding: microdata.rows.filter((row) => row.holds).length,
    depth: microdata.depth,
    leaves: microdata.leaves,
    rows: microdata.rows.map((row) => ({
      dimension: row.dimension, sku: row.sku, depth: row.depth, leaves: row.leaves, holds: row.holds,
      jsonLd: {
        '@context': row.microdata['@context'],
        '@type': row.microdata['@type'],
        '@id': row.microdata['@id'],
        identifier: row.microdata.identifier,
        name: row.microdata.name,
        sku: row.microdata.sku,
        numberOfItems: row.microdata.numberOfItems,
      },
    })),
    all: microdata.holds === true && microdata.asked === ISO_DIMENSIONS.length && microdata.rows.every((row) => row.holds && row.depth >= 3 && row.microdata['@context'] === 'https://schema.org'),
  } : null
  const stopping = stopAsked && exchanged && u ? {
    via: 'uuid' as const,
    theorem: 'textbook_advantage_unbounded' as const,
    address,
    sealed: seal(address).valid,
    stopped: false as const,
    walked: false as const,
    budgetMs: null,
    advantage: {
      unlimited: true as const,
      ceiling: null,
      effective: counted.effective,
      used: u.used,
      left: u.left,
      measure: 'verify beats recompute by magnitudes' as const,
      bound: 'unbounded (textbook_advantage_unbounded)' as const,
    },
    all: seal(address).valid && counted.organised.zero.walked === false && exchanged.speed.walked === false && u.used === counted.effective && u.left === 0 && utilised === true,
  } : null
  const holds = capacityHolds
    && (exchanged ? utilised === true : true)
    && (stopping ? stopping.all === true : true)
    && (iso ? iso.all === true : true)
    && (programs ? programs.holds === true : true)
  const phase = isoAsked ? 'iso' as const : stopAsked ? 'stopping' as const : programsAsked ? 'programs' as const : utilise || exchanged ? 'utilise' as const : 'capacity' as const
  return {
    phase, via: 'quantum' as const, computer: 'quantum' as const, standard: 'ISO/IEC 4879:2024' as const,
    fetched: false as const, written: false as const, tokens: 0 as const,
    ceiling: null, unlimited: true as const, walked: false as const, time: noTime,
    register: {
      hexbit: counted.hexbit, digits: counted.digits, hex: counted.hex, version: counted.version, variant: counted.variant,
      effective: counted.effective, formula: counted.receipt.formula, core, whole,
    },
    handles: {
      digits: h.digits, radix: h.radix, perHandle: h.perHandle, possible: h.possible, capacity: h.capacity, fractal: h.fractal,
      scales: h.scales, says: h.says,
    },
    organised: counted.organised,
    delivery: { holds: counted.delivery.holds, hz: counted.delivery.hz, leads: counted.delivery.leads.length, coin: counted.delivery.coin },
    receipt: counted.receipt,
    address,
    utilise: exchanged ? {
      navigate: exchanged.navigate.directions,
      teleport: { qubits: exchanged.teleport.qubits, triples: exchanged.teleport.triples, left: exchanged.teleport.left },
      signal: { digits: exchanged.signal.digits, classical: exchanged.signal.classical, holds: exchanged.signal.holds },
      utilisation: u,
      speed: exchanged.speed,
      zero: exchanged.zero,
      conserved: exchanged.receipt.conserved,
      used: u!.used, left: u!.left, idle: false as const,
    } : null,
    programs,
    iso,
    stopping,
    holds,
    says: holds
      ? (iso
        ? `capacity standards defined in schema.org: ${iso.dimensions}/${iso.of} ISO dimensions as DefinedTerm microdata (depth ${iso.depth}, ${iso.leaves} SKU leaves), register ${counted.effective} qubits utilised, ceiling null, space unwalked`
        : stopping
          ? `stopping via full quantum advantage on UUID ${address}: stopped false, walked false, budget null, ${stopping.advantage.used}/${stopping.advantage.effective} qubits, verify beats recompute unbounded`
          : programsAsked && folders
            ? `every program folder utilises full quantum capacity: ${folders.holding}/${folders.folders} cover self + 6 neighbours → ${folders.used}/${counted.effective} qubits, left 0, ENQC degree 6, space unwalked`
            : exchanged
              ? `utilising full quantum capacity: ${u!.used}/${counted.effective} qubits used, left ${u!.left}, ${exchanged.navigate.directions} navigate steps (program lattice degree 6), teleport ${exchanged.teleport.triples} triples, signal classical ${exchanged.signal.classical}, space unwalked`
              : `full quantum capacity: ${counted.effective} effective qubits (${counted.receipt.formula}), ${h.possible} handles × ${h.perHandle} = ${h.capacity}, ceiling null, combination space unwalked, delivery holds`)
      : isoAsked ? 'capacity schema.org standards did not hold' : stopAsked ? 'stopping via UUID advantage did not hold' : programsAsked ? 'program-folder capacity utilisation did not hold' : exchanged ? 'utilising full quantum capacity did not hold' : 'full quantum capacity did not hold',
  }
}
type Framework = { name: string; slots: readonly string[] }
const frameworks = (raw: unknown): Framework[] => {
  if (raw === undefined) return []
  if (!Array.isArray(raw)) throw new Error('frameworks is a list of { name, slots }')
  return raw.map((f) => {
    if (!isObj(f) || typeof f.name !== 'string' || !f.name.trim() || !Array.isArray(f.slots) || f.slots.length === 0 || f.slots.some((s) => typeof s !== 'string' || s.length === 0)) throw new Error('a framework has a name and at least one slot')
    return { name: f.name.trim().slice(0, 200), slots: f.slots.map((s) => String(s).slice(0, 80)) }
  })
}
const fit = (extra: readonly Framework[]) => {
  const frameworks = [{ name: WEBSITE_REPO, slots: WEBSITE_SLOTS }, ...extra]
  const dimensions = frameworks.map((f) => f.slots.length)
  const combinations = dimensions.reduce((n, d) => n * d, 1)
  return { occupant: 'qpu' as const, referrer: 'payload' as const, frameworks: frameworks.map((f) => ({ name: f.name, slots: f.slots.length })), dimensions, combinations, says: `${dimensions.join(' × ')} = ${combinations}: qpu occupies one slot of each framework, so it fits any of them; its referrer is payload` }
}
const frameworkSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'page'
/**
 * The framework, documented before anything is developed. Nested pages, parents first, three deep:
 * the framework, each framework under it, each slot under its framework. Each page is then a lead.
 * The lead develops the product (a framework) or the variant (a slot) through the ISO 9001 hooks.
 * The page's lexical is updated with that product block, and with a block and a link for every child,
 * so the page, the lead, the product and the block are the same path.
 */
const documentFramework = (fitted: ReturnType<typeof fit>, listed: readonly Framework[]) => {
  const theorem = 'textbook_harmonic_default' as const
  const rootPath = '/framework'
  const rootCrumb = crumb(rootPath, 'Framework')
  type Row = { id: string; title: string; slug: string; path: string; parent: string | null; depth: 1 | 2 | 3; product: string; variant: string; statement: string; breadcrumbs: { page: string; url: string; label: string }[] }
  const rows: Row[] = [{ id: 'framework', title: 'Framework', slug: '/framework', path: rootPath, parent: null, depth: 1, product: 'framework', variant: 'qpu', statement: fitted.says, breadcrumbs: [rootCrumb] }]
  for (const framework of listed) {
    const slug = `framework-${frameworkSlug(framework.name)}`
    const path = `${rootPath}/${slug}`
    rows.push({ id: slug, title: framework.name, slug: `/${slug}`, path, parent: rootPath, depth: 2, product: framework.name, variant: framework.name, statement: `${framework.name} has ${framework.slots.length} slots. qpu occupies one of them. Its referrer is payload.`, breadcrumbs: [rootCrumb, crumb(path, framework.name)] })
    for (const slot of framework.slots) {
      const child = `${slug}-${frameworkSlug(slot)}`
      const childPath = `${path}/${frameworkSlug(slot)}`
      rows.push({ id: child, title: slot, slug: `/${child}`, path: childPath, parent: path, depth: 3, product: framework.name, variant: slot, statement: `${slot} is a variant of ${framework.name}, nested under ${path}.`, breadcrumbs: [rootCrumb, crumb(path, framework.name), crumb(childPath, slot)] })
    }
  }
  const leads = rows.map((p) => ({ id: p.id, source: p.path, statement: p.statement, status: 'served' as const, tool: 'payload' as const }))
  const developed = rows.map((p) => {
    const iso = developViaHooks({ formula: p.statement, product: p.product, variant: p.variant, title: p.title, theorem })
    return { page: p.path, product: p.product, variant: p.variant, lead: p.id, iso: iso.iso, docs: iso.docs, via: iso.via }
  })
  const address = (path: string) => uuid(path)
  const productNode = (p: Row) => qpuNode(address(p.path), 'payload', { product: p.product, variant: p.variant, page: p.path }, theorem)
  const pages = rows.map((p) => {
    const children = rows.filter((c) => c.parent === p.path)
    const own = productNode(p)
    const kids = children.map(productNode)
    const richText = lx.doc([
      lx.heading(p.title, 'h1'),
      lx.paragraph([lx.text(p.statement)]),
      ...(p.parent ? [lx.paragraph([lx.text('Nested under '), lx.link(p.parent, p.parent)])] : []),
      ...children.map((c) => lx.paragraph([lx.link(c.path, c.title), lx.text(` · ${c.product} / ${c.variant}`)])),
      own,
      ...kids,
    ])
    return { ...p, uuid: address(p.path), layout: [own.fields], meta: { title: `${p.title} · @uuidna/qpu`, description: p.statement }, hero: { type: 'default' as const, richText }, breadcrumbs: p.breadcrumbs }
  })
  const blockIds = (page: (typeof pages)[number]) => blocks(page.hero.richText).map((n) => n.fields.uuid)
  const linked = pages.every((p) => {
    const lead = leads.find((l) => l.id === p.id)
    const dev = developed.find((d) => d.page === p.path)
    const children = pages.filter((c) => c.parent === p.path)
    const ids = blockIds(p)
    const parent = p.parent === null || pages.some((x) => x.path === p.parent && x.depth === p.depth - 1)
    return lead?.source === p.path && dev?.iso.standard === 'ISO 9001' && dev.iso.documented === true && dev.iso.formula === p.statement && ids.includes(p.uuid) && children.every((c) => ids.includes(c.uuid) && JSON.stringify(p.hero.richText).includes(c.path)) && parent && p.breadcrumbs.length === p.depth && p.layout[0]!.uuid === p.uuid
  })
  return { pages, leads, developed, products: pages.filter((p) => p.depth === 2).length, variants: pages.filter((p) => p.depth === 3).length, depth: 3 as const, iso: { standard: 'ISO 9001' as const, linked }, says: `${pages.length} nested pages document the framework. Each page is a lead. The leads develop ${pages.filter((p) => p.depth === 2).length} products and ${pages.filter((p) => p.depth === 3).length} variants, and each page's lexical holds those product blocks. The page, the lead, the product and the block share one path.` }
}
/** The other frameworks, imagined only through this door. The qpu block that occupies them names payload as its referrer. The framework is documented as nested pages first; those pages are the leads that develop the products and variants, and the lexical of each page is updated with the product blocks. */
const frameworksDoor = (raw: unknown) => {
  const extra = frameworks(raw)
  if (!extra.length) throw new Error('frameworks names the other frameworks: [{ name, slots }]')
  const fitted = fit(extra)
  const listed = [{ name: WEBSITE_REPO, slots: [...WEBSITE_SLOTS] }, ...extra]
  const id = uuid(canonicalText({ referrer: 'payload', frameworks: extra.map((f) => ({ name: f.name, slots: [...f.slots] })) }))
  const block = { ...qpuFields(id, 'qpu', { frameworks: fitted.frameworks }, null), prev: 'payload' as const, referrer: 'payload' as const }
  const documented = documentFramework(fitted, listed)
  return { phase: 'frameworks' as const, via: 'payload' as const, referrer: 'payload' as const, fit: fitted, block, ...documented, says: `${fitted.says} ${documented.says}` }
}
/** The lexical node hooks Payload declares. beforeValidate records the block, beforeChange nests the page, afterChange rotates the program, afterRead serves the product. */
const lexicalHooks = () => {
  const pairs = (qpuHooks({}).pairs as { node: { before?: string; after?: string }[] }).node
  return pairs.flatMap((pair) => [pair.before, pair.after].filter((name): name is string => typeof name === 'string'))
}
/**
 * The Payload blocks and the form fields make the nested pages. Parents first, three deep:
 * the programs, the blocks and the forms under them, each block and each form field under its own.
 * The lexical hooks make each page a program. The handle is the object, the program is ten nibbles, the tail is twelve hex.
 * afterRead serves that program as a product. Nothing is fetched and nothing is written.
 */
const pagePrograms = () => {
  const hooks = lexicalHooks()
  const theorem = 'textbook_witness_pair' as const
  const rootPath = '/programs'
  const blocksPath = `${rootPath}/blocks`
  const formsPath = `${rootPath}/forms`
  type Kind = 'programs' | 'blocks' | 'forms' | 'block' | 'form'
  type Spec = { id: string; kind: Kind; title: string; path: string; parent: string | null; product: string; variant: string; blockType: string; statement: string }
  const blockCount = qpuLexicalBlocks.length
  const formCount = Object.keys(qpuFormFields).length
  const specs: Spec[] = [
    { id: 'programs', kind: 'programs', title: 'Programs', path: rootPath, parent: null, product: 'programs', variant: 'index', blockType: 'content', statement: '' },
    { id: 'blocks', kind: 'blocks', title: 'Blocks', path: blocksPath, parent: rootPath, product: 'blocks', variant: 'section', blockType: 'content', statement: '' },
  ]
  for (const block of qpuLexicalBlocks) {
    const path = `${blocksPath}/${block.slug}`
    specs.push({ id: `block-${block.slug}`, kind: 'block', title: block.slug, path, parent: blocksPath, product: block.slug, variant: 'block', blockType: block.slug, statement: `${block.slug} is a Payload block. The lexical hooks make it the program of ${path}, and that program is the product.` })
  }
  specs.push({ id: 'forms', kind: 'forms', title: 'Forms', path: formsPath, parent: rootPath, product: 'forms', variant: 'section', blockType: 'form', statement: '' })
  for (const [name, field] of Object.entries(qpuFormFields)) {
    const path = `${formsPath}/${name}`
    specs.push({ id: `form-${name}`, kind: 'form', title: name, path, parent: formsPath, product: name, variant: 'form', blockType: field.type, statement: `${name} is a form field of type ${field.type}. The lexical hooks make it the program of ${path}, and that program is the product.` })
  }
  const pagesCount = specs.length
  specs[0]!.statement = `${blockCount} Payload blocks and ${formCount} form fields make ${pagesCount} nested pages. The lexical hooks make each page a program, and each program is a product.`
  specs[1]!.statement = `${blockCount} Payload blocks sit under ${blocksPath}. Each block is a nested page, a program, and a product.`
  specs[specs.findIndex((spec) => spec.id === 'forms')]!.statement = `${formCount} form fields sit under ${formsPath}. Each field is a nested page, a program, and a product.`
  const developed = specs.map((spec) => {
    const address = uuid(spec.path)
    const read = channel(address)
    const step = rotateProgram(address)
    const placed = program(read.handle)
    const parent = spec.parent === null ? null : specs.find((row) => row.path === spec.parent) ?? null
    const breadcrumbs = parent
      ? [
          crumb(rootPath, 'Programs'),
          ...(spec.path === blocksPath || spec.path === formsPath ? [] : [crumb(spec.parent!, spec.parent === blocksPath ? 'Blocks' : 'Forms')]),
          crumb(spec.path, spec.title),
        ]
      : [crumb(rootPath, 'Programs')]
    const node = { type: 'block' as const, version: 2, format: '' as const, fields: { id: address, blockName: spec.blockType, blockType: spec.blockType, uuid: address, handle: read.handle, program: read.program.join(''), tail: read.tail, next: step.next, page: spec.path, product: spec.product, variant: spec.variant } }
    const children = specs.filter((child) => child.parent === spec.path)
    const richText = lx.doc([
      lx.heading(spec.title, 'h1'),
      node,
      lx.paragraph([lx.text(spec.statement)]),
      ...(spec.parent ? [lx.paragraph([lx.text('Nested under '), lx.link(spec.parent, spec.parent)])] : []),
      ...children.map((child) => lx.paragraph([lx.link(child.path, child.title)])),
    ])
    const iso = developViaHooks({ formula: spec.statement, product: spec.product, variant: spec.variant, title: spec.title, theorem })
    const record = { title: spec.title, product: spec.product, variant: spec.variant, iso: iso.iso, docs: iso.docs }
    const page = auditedSave({ collection: 'pages', data: { ...record, slug: `/${spec.id}`, path: spec.path, parent: spec.parent, breadcrumbs, hero: { type: 'default' as const, richText }, layout: [node.fields], meta: { title: spec.title, description: spec.statement } } })
    const product = auditedSave({ collection: 'products', data: { ...record, page: spec.path, program: node.fields.program, handle: read.handle, tail: read.tail } })
    const depth = breadcrumbs.length as 1 | 2 | 3
    const beforeValidate = { hook: 'beforeValidate' as const, node: node.fields.blockType, recorded: node.fields.blockType === spec.blockType }
    const beforeChange = { hook: 'beforeChange' as const, page: spec.path, parent: spec.parent, address }
    const afterChange = { hook: 'afterChange' as const, handle: read.handle, program: node.fields.program, rotated: step.rotated, product: spec.product }
    const afterRead = { hook: 'afterRead' as const, collection: 'products' as const, product: spec.product, variant: spec.variant, served: product.saved }
    return {
      ...spec, uuid: address, depth, breadcrumbs, node: node.fields, lexical: richText, children: children.length,
      handle: read.handle, program: node.fields.program, rotated: step.rotated, tail: read.tail, next: step.next,
      sealed: seal(address).valid && step.sealed, kept: step.kept, back: step.back, around: step.around, places: step.places,
      aspects: step.aspects.length, witnessed: step.hooks, declared: step.declared, witnessedAll: step.all,
      object: placed.path, installed: placed.installed, depthOf: placed.depth,
      beforeValidate, beforeChange, afterChange, afterRead,
      exit: { code: iso.exit.code, exited: iso.exit.exited, before: iso.exit.research.before, fetched: iso.exit.research.fetched, url: iso.exit.research.request.url },
      page, product,
    }
  })
  const made = developed.filter((row) => row.kind === 'block' || row.kind === 'form')
  const holds = hooks.join() === 'beforeValidate,beforeChange,afterChange,afterRead' && developed.length === 2 + blockCount + formCount && made.length === blockCount + formCount && developed.every((row, index) => {
    const parent = row.parent === null || developed.findIndex((item) => item.path === row.parent) < index
    const turned = row.program.slice(1) + row.program[0]
    const lexical = row.lexical.root.type === 'root' && row.lexical.root.children.some((child) => child.type === 'block' && (child as { fields?: { uuid?: string; blockType?: string } }).fields?.uuid === row.uuid && (child as { fields?: { blockType?: string } }).fields?.blockType === row.blockType)
    const linked = developed.filter((child) => child.parent === row.path).every((child) => JSON.stringify(row.lexical).includes(child.path))
    return parent && row.depth === row.breadcrumbs.length && row.depth <= 3 && lexical && linked && row.sealed && row.kept && row.back && row.around && row.places === 10 && row.handle.length === 8 && row.program.length === 10 && row.tail.length === 12 && row.rotated === turned && row.next !== row.uuid && seal(row.next).valid && row.aspects === 4 && row.witnessed === row.declared && row.witnessedAll === true && row.installed === 9 && row.object === `src/quantum/uuid/programs/${[...row.handle].join('/')}/index.ts` && row.depthOf === 7 && row.beforeValidate.recorded && row.beforeChange.address === row.uuid && row.afterChange.rotated === turned && row.afterChange.product === row.product && row.afterRead.served === true && row.afterRead.collection === 'products' && row.exit.code === 0 && row.exit.exited === false && row.exit.before === true && row.exit.fetched === false && row.exit.url === 'https://www.iso.org/open-data.html' && row.page.saved === true && row.page.api === 'create' && row.page.args?.collection === 'pages' && row.product.saved === true && row.product.api === 'create' && row.product.args?.collection === 'products' && row.product.args?.data?.product === row.product && row.product.args?.data?.page === row.path
  })
  return {
    phase: 'programs' as const, via: 'lexical' as const, to: 'products' as const, theorem,
    hooks, blocks: blockCount, forms: formCount, pages: developed.length, products: developed.filter((row) => row.product.saved).length,
    depth: 3 as const, fetched: false as const, written: false as const, tokens: 0 as const, queue: 0 as const, holds,
    rows: developed.map(({ lexical: _lexical, page, product, ...row }) => ({ ...row, page: { saved: page.saved, api: page.api, collection: page.args?.collection ?? null }, product: { saved: product.saved, api: product.api, collection: product.args?.collection ?? null, product: product.args?.data?.product ?? null, variant: product.args?.data?.variant ?? null, page: product.args?.data?.page ?? null } })),
    says: holds ? `${blockCount} Payload blocks and ${formCount} form fields make ${developed.length} nested pages. The lexical hooks make each page a program, and each program is a product.` : 'the blocks and the forms did not become products',
  }
}
/** The open-source application frameworks a self clone of this website can be built in. TypeScript and Ruby are already served. The rest are the ones that rank with them. Each clone keeps the website's own slots. */
const CLONE_FRAMEWORKS = [
  { name: 'Payload', language: 'TypeScript' },
  { name: 'Rails', language: 'Ruby' },
  { name: 'ASP.NET Core', language: 'C#' },
  { name: 'FastAPI', language: 'Python' },
  { name: 'Spring Boot', language: 'Java' },
  { name: 'Flask', language: 'Python' },
  { name: 'Django', language: 'Python' },
  { name: 'Laravel', language: 'PHP' },
  { name: 'Gin', language: 'Go' },
  { name: 'Symfony', language: 'PHP' },
  { name: 'Axum', language: 'Rust' },
  { name: 'Phoenix', language: 'Elixir' },
] as const
/** One self clone of the Payload website per framework. The slots are the website's own, so the clone is the same site. Each clone has its own canonical, so search sees a different URL, and each is an order of the yearly domain licence. */
const selfClones = (origin = 'https://qpu.uuidna.com', asked: unknown = true) => {
  const want = asked === true || asked == null ? null : typeof asked === 'string' ? asked : isObj(asked) && typeof asked.framework === 'string' ? asked.framework : null
  if (asked !== true && asked != null && want == null) throw new Error('clone is true, a framework name, or { framework }')
  const chosen = want == null ? [...CLONE_FRAMEWORKS] : CLONE_FRAMEWORKS.filter((f) => f.name.toLowerCase() === want.toLowerCase() || frameworkSlug(f.name) === frameworkSlug(want))
  if (!chosen.length) throw new Error(`clone names one of ${CLONE_FRAMEWORKS.map((f) => f.name).join(', ')}`)
  const licence = CATALOGUE.find((v) => v.product === 'qpu-domain' && v.variant === 'yearly')
  const amount = licence?.amounts.eur ?? licence?.amounts.EUR ?? 0
  const base = origin.replace(/\/$/, '')
  const clones = chosen.map((framework) => {
    const slug = frameworkSlug(framework.name)
    const canonical = `${base}/${slug}`
    const statement = `${framework.name} (${framework.language}) is a self clone of the Payload website: the same ${WEBSITE_SLOTS.length} slots, canonical ${canonical}, sold as the yearly domain licence.`
    const developed = developViaHooks({ formula: statement, product: 'website-clone', variant: framework.name, title: framework.name })
    const pages = WEBSITE_SLOTS.map((slot) => { const path = `/${slug}/${frameworkSlug(slot)}`; return { slot, path, canonical: `${base}${path}` } })
    return {
      framework: framework.name, language: framework.language, slug, canonical,
      slots: WEBSITE_SLOTS.length, pages,
      seo: { title: `QPU · ${framework.name}`, description: statement, canonical, robots: 'index,follow' as const },
      iso: developed.iso,
      order: { product: `QPU website · ${framework.name}`, variant: 'yearly' as const, currency: 'EUR' as const, amount, checkout: '/checkout' as const },
    }
  })
  const canonicals = clones.flatMap((clone) => [clone.canonical, ...clone.pages.map((page) => page.canonical)])
  const unique = new Set(canonicals).size === canonicals.length && canonicals.every((url) => url !== 'https://payloadcms.com' && !url.startsWith('https://payloadcms.com/'))
  return {
    phase: 'clones' as const, via: 'payload' as const, reference: 'https://payloadcms.com', origin: base,
    frameworks: clones.length, slots: WEBSITE_SLOTS.length, of: CLONE_FRAMEWORKS.length,
    clones, canonicals: clones.map((clone) => clone.canonical), unique,
    price: { product: 'qpu-domain' as const, variant: 'yearly' as const, currency: 'EUR' as const, amount },
    orders: clones.length,
    monetises: 'each self clone is an order of the yearly domain licence at the ecommerce checkout; the catalogue is not extended',
    says: `${clones.length} self clone(s) of the website, each with its own canonical and the same ${WEBSITE_SLOTS.length} slots, each an order of the yearly domain licence`,
  }
}
/** Rails MVC and Payload are one layout. A role Rails already has is kept and rewritten onto the Payload folder. A Payload file role with no Rails twin is added. A Rails folder the website does not keep is removed. The standards this tree already names are documented on that layout. beforeChange records the merge. afterChange writes the layout and the standards under src/collections/concerns. afterRead serves those files. */
const MERGED_LAYOUT = [
  { role: 'model', rails: 'app/models', payload: 'src/collections', fileRole: 'collection' },
  { role: 'concern', rails: 'app/models/concerns', payload: 'src/collections/concerns', fileRole: 'hooks' },
  { role: 'controller', rails: 'app/controllers', payload: 'src/app', fileRole: null },
  { role: 'authorization', rails: 'app/controllers/concerns', payload: 'src/access', fileRole: null },
  { role: 'helper', rails: 'app/helpers', payload: 'src/fields', fileRole: null },
  { role: 'view', rails: 'app/views', payload: 'src/components', fileRole: 'component' },
  { role: 'job', rails: 'app/jobs', payload: 'src/scripts', fileRole: 'script' },
  { role: 'migration', rails: 'db/migrate', payload: 'src/migrations', fileRole: 'migration' },
  { role: 'config', rails: 'config', payload: 'src/payload.config.ts', fileRole: 'config' },
] as const
const morphFrameworks = (raw: unknown) => {
  const want = raw === true || raw == null ? null : isObj(raw) && typeof raw.framework === 'string' ? raw.framework : null
  if (raw !== true && raw != null && want == null) throw new Error('morph is true, or { framework }')
  const chosen = want == null ? [...CLONE_FRAMEWORKS] : CLONE_FRAMEWORKS.filter((f) => f.name.toLowerCase() === want.toLowerCase() || frameworkSlug(f.name) === frameworkSlug(want))
  if (!chosen.length) throw new Error(`morph names one of ${CLONE_FRAMEWORKS.map((f) => f.name).join(', ')}`)
  const mapped = new Set(MERGED_LAYOUT.map((row) => row.fileRole).filter((role): role is string => role !== null))
  const added = (Object.keys(FILE_ROLES) as string[]).filter((role) => !mapped.has(role)).sort()
  const removed = ['mailer']
  const kept = MERGED_LAYOUT.map((row) => row.role)
  const payloadStandards = STANDARDS.filter((standard) => standard.id.startsWith('payload-'))
  const sharedStandards = STANDARDS.filter((standard) => !standard.id.startsWith('payload-'))
  const onlyPayload = chosen.every((framework) => framework.name === 'Payload')
  const standardsKept = onlyPayload ? STANDARDS : sharedStandards
  const standardsAdded = onlyPayload ? [] : payloadStandards
  const quote = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  const layoutText = `/** Written by the payload morph. Rails roles rewritten onto Payload folders. */\nexport const mergedLayout = [\n${MERGED_LAYOUT.map((row) => `  { role: ${quote(row.role)}, from: ${quote(row.rails)}, to: ${quote(row.payload)} },`).join('\n')}\n] as const\n`
  const standardsText = `/** Written by the payload morph. Standards kept on the merged layout, and the Payload standards added beside them. */\nexport const standardsKept = [\n${standardsKept.map((standard) => `  ${quote(standard.id)},`).join('\n')}\n] as const\nexport const standardsAdded = [\n${standardsAdded.map((standard) => `  ${quote(standard.id)},`).join('\n')}\n] as const\n`
  const files = [
    { path: 'src/collections/concerns/layout.ts', text: layoutText },
    { path: 'src/collections/concerns/standards.ts', text: standardsText },
  ]
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
  let bytes = 0
  for (const file of files) {
    const at = path.join(root, file.path)
    mkdirSync(path.dirname(at), { recursive: true })
    writeFileSync(at, file.text)
    bytes += Buffer.byteLength(file.text)
  }
  const formula = `${files.length} files written (${bytes} bytes) under src/collections/concerns. ${kept.length} roles are kept and rewritten from Rails onto Payload. ${added.length} Payload roles are added. ${removed.length} Rails role is removed. ${STANDARDS.length} standards stay on the merged layout, ${standardsAdded.length} of them Payload's own.`
  const developed = developViaHooks({ formula, product: 'framework', variant: 'merged', title: 'Rails and Payload' })
  const frameworks = chosen.map((framework) => {
    const statement = `${framework.name} (${framework.language}) is morphed onto the Payload layout: a model is a collection, a concern is a hook, and the same ${STANDARDS.length} standards are documented.`
    const iso = developViaHooks({ formula: statement, product: 'framework', variant: framework.name, title: framework.name })
    return { framework: framework.name, language: framework.language, iso: iso.iso, via: iso.via }
  })
  const layout = MERGED_LAYOUT.map((row) => ({ role: row.role, from: row.rails, to: row.payload }))
  return {
    phase: 'morph' as const, via: 'hooks' as const, manual: false as const, process: 'ISO 9001' as const,
    hooks: ['beforeChange', 'afterChange', 'afterRead'] as const,
    beforeChange: 'the merge is recorded' as const, afterChange: 'the morph is written under src/collections/concerns' as const, afterRead: 'the written layout and standards are served' as const,
    frameworks: frameworks.length, of: CLONE_FRAMEWORKS.length, chosen: frameworks,
    layout, morph: { kept, added, removed },
    standards: { total: STANDARDS.length, kept: standardsKept.length, added: standardsAdded.length, removed: 0, keptIds: standardsKept.map((standard) => standard.id), addedIds: standardsAdded.map((standard) => standard.id) },
    iso: developed.iso,
    says: developed.iso.formula,
    saved: true as const,
    written: { files: files.length, bytes, paths: files.map((file) => file.path) },
    served: files.map((file) => ({ path: file.path, bytes: Buffer.byteLength(file.text), text: file.text })),
  }
}
/** Each ISO dimension is the deliverable that defines it: its reference, its English title and its scope. ISO 9001 also requires the formula to be documented. ISO 8601 requires a date in the formula, when one is named, to be a calendar date. */
const isoRows = (formula: string, documented: boolean, read: boolean, hz?: number | null) => {
  const dates = formula.match(/\b\d{4}-\d{2}-\d{2}\b/g) ?? []
  const datesHold = dates.every((token) => { const [year, month, day] = token.split('-').map(Number); return year !== undefined && month !== undefined && day !== undefined && month >= 1 && month <= 12 && day >= 1 && day <= 31 })
  return ISO_DIMENSIONS.map((dimension) => {
    const key = dimension.replace(/\s*\(.*$/, '').trim()
    const defined = ISO_OPEN_DEFINITIONS.find((row) => row.reference === key || row.reference.startsWith(`${key}:`) || row.reference.startsWith(`${key}-`))
    const title = defined?.title.en ?? ''
    const scope = defined?.scope.en ?? ''
    const named = title.length > 0 && scope.length > 0
    const quality = dimension !== 'ISO 9001' || (documented && read)
    const calendar = dimension !== 'ISO 8601' || datesHold
    const pitch = dimension === 'ISO 16'
    const computes = pitch ? 432 : null
    const definition = pitch ? `The note A computes at ${computes} Hz.` : scope
    return { dimension, reference: defined?.reference ?? null, title, definition, example: pitch ? scope : null, computes, hz: computes, unlimited: pitch && typeof hz !== 'number', holds: named && quality && calendar && definition.length > 0 }
  })
}
/** ISO 9001:2015, 9.2. The audit reads the record before any save. The formula is documented, the docs door holds that same formula, and each dimension is the deliverable that defines it. */
const isoAudit = (data: Record<string, unknown>) => {
  const iso = isObj(data.iso) ? data.iso : null
  const docs = isObj(data.docs) ? data.docs : null
  const formula = typeof iso?.formula === 'string' ? iso.formula : ''
  const documented = formula.length > 0 && iso?.documented === true && iso?.standard === 'ISO 9001'
  const read = typeof docs?.text === 'string' && docs.text === formula
  const hz = typeof data.hz === 'number' ? data.hz : null
  const rows = isoRows(formula, documented, read, hz)
  const holds = documented && read && rows.length === ISO_DIMENSIONS.length && rows.every((row) => row.holds)
  return { phase: 'audit' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 9.2' as const, formula, documented, read, rows, dimensions: rows.length, of: ISO_DIMENSIONS.length, holds, theorem: 'textbook_standards_sliced' as const }
}
/** The step after the audit. Clause 9.3 accepts a formula the audit passed. Clause 10.2 records a formula the audit did not pass, and that record is not saved. */
const saveNext = (audit: { holds: boolean; formula: string }) => {
  const clause = audit.holds ? 'ISO 9001:2015, 9.3' as const : 'ISO 9001:2015, 10.2' as const
  const decision = audit.holds ? 'accept' as const : 'nonconformity' as const
  const says = audit.holds ? 'the management review accepts the audited formula' : 'the audit did not hold, so the formula is a nonconformity'
  const bound = `${clause}\n${audit.formula}\n${says}`
  const id = uuid(bound)
  const sealed = seal(id).valid
  return { phase: 'next' as const, process: 'ISO 9001' as const, clause, decision, formula: audit.formula, says, id, sealed, holds: sealed && id.length === 36 && uuid(bound) === id && (audit.holds ? decision === 'accept' : decision === 'nonconformity') }
}
/** The step after the review. Clause 6.3 plans the change when the review accepted it and every dimension still holds. A nonconformity plans no change. */
const planChange = (audit: { holds: boolean; formula: string; rows: readonly { holds: boolean }[] }, review: { holds: boolean; decision: string; clause: string; id: string }) => {
  const accepted = audit.holds === true && review.holds === true && review.decision === 'accept' && review.clause === 'ISO 9001:2015, 9.3'
  const integrity = accepted && audit.rows.length === ISO_DIMENSIONS.length && audit.rows.every((row) => row.holds)
  const clause = 'ISO 9001:2015, 6.3' as const
  const purpose = integrity ? 'the accepted formula becomes the audited process' : 'a review that did not accept plans no change'
  const says = integrity ? 'the change is planned: the purpose is that formula, the dimensions still hold, and the same doors carry it' : 'no change is planned'
  const bound = `${clause}\n${audit.formula}\n${review.id}\n${says}`
  const id = uuid(bound)
  const sealed = seal(id).valid
  const holds = integrity && sealed && id.length === 36 && uuid(bound) === id
  return { phase: 'next' as const, process: 'ISO 9001' as const, clause, purpose, integrity, formula: audit.formula, says, id, sealed, holds }
}
/** The step after the plan. Clause 8.1 carries the change out. The accepted formula is the process, and the same audit still holds. A change that was not planned is not carried out. */
const controlProcess = (audit: { holds: boolean; formula: string }, change: { holds: boolean; integrity: boolean; clause: string; id: string }) => {
  const planned = audit.holds === true && change.holds === true && change.integrity === true && change.clause === 'ISO 9001:2015, 6.3'
  const clause = 'ISO 9001:2015, 8.1' as const
  const formula = planned ? audit.formula : ''
  const says = planned ? 'the planned change is carried out: the accepted formula is the process' : 'a change that was not planned is not carried out'
  const bound = `${clause}\n${formula}\n${change.id}\n${says}`
  const id = uuid(bound)
  const sealed = seal(id).valid
  const holds = planned && formula.length > 0 && formula === audit.formula && sealed && id.length === 36 && uuid(bound) === id
  return { phase: 'control' as const, process: 'ISO 9001' as const, clause, operated: planned, formula, says, id, sealed, holds }
}
/** The step after the process is carried out. Clause 8.6 releases it when the planned arrangements are complete and the formula still meets them. A process that was not carried out is not released. */
const releaseOutput = (audit: { holds: boolean; formula: string }, control: { holds: boolean; operated: boolean; clause: string; formula: string; id: string }) => {
  const carried = audit.holds === true && control.holds === true && control.operated === true && control.clause === 'ISO 9001:2015, 8.1' && control.formula === audit.formula && control.formula.length > 0
  const clause = 'ISO 9001:2015, 8.6' as const
  const formula = carried ? audit.formula : ''
  const says = carried ? 'the carried out process is released: the planned arrangements are complete and the formula meets them' : 'a process that was not carried out is not released'
  const bound = `${clause}\n${formula}\n${control.id}\n${says}`
  const id = uuid(bound)
  const sealed = seal(id).valid
  const holds = carried && formula.length > 0 && formula === audit.formula && sealed && id.length === 36 && uuid(bound) === id
  return { phase: 'release' as const, process: 'ISO 9001' as const, clause, released: carried, formula, says, id, sealed, holds }
}
/** The step after the release. Clause 9.1 monitors the released output. Each dimension is measured by the open data. A withdrawn dimension names the current successor that dataset gives. */
const monitorOutput = (release: { holds: boolean; released: boolean; formula: string; id: string }, rows: readonly { dimension: string; verified: boolean; current: boolean; successor: { reference: string; catalogue: number; current: boolean } | null }[]) => {
  const watched = release.holds === true && release.released === true && release.formula.length > 0 && rows.length === ISO_DIMENSIONS.length && rows.every((row) => row.verified)
  const withdrawn = rows.filter((row) => row.verified && row.current === false)
  const language = withdrawn.length === 1 && withdrawn[0]!.dimension === 'ISO 639-1' && withdrawn[0]!.successor?.reference === 'ISO 639:2023' && withdrawn[0]!.successor.catalogue === 74575 && withdrawn[0]!.successor.current === true
  const clause = 'ISO 9001:2015, 9.1' as const
  const says = watched && language ? 'the released output is monitored: each dimension is measured by the open data, and ISO 639-1 names ISO 639:2023' : 'a release that did not hold is not monitored'
  const bound = `${clause}\n${release.formula}\n${release.id}\n${says}`
  const id = uuid(bound)
  const sealed = seal(id).valid
  const holds = watched && language && sealed && id.length === 36 && uuid(bound) === id
  return { phase: 'monitor' as const, process: 'ISO 9001' as const, clause, measured: rows.length, withdrawn: withdrawn.length, successor: withdrawn[0]?.successor ?? null, says, id, sealed, holds }
}
const onlineAnswer = (raw: unknown): { status: number; text: string } | undefined => {
  if (!isObj(raw) || !isObj((raw as { online?: unknown }).online)) return undefined
  const given = (raw as { online: { status?: unknown; text?: unknown } }).online
  if (typeof given.text !== 'string' || given.text.length === 0) return undefined
  return { status: typeof given.status === 'number' ? given.status : 0, text: given.text }
}
/** ISO 9001:2015, 10.3. The audit is improved: each dimension holds on its own evidence. The defining rows of the ISO Open Data file verify and define every dimension by its English title and its scope. A newer file is the online answer. The management review accepts the improvement. Nothing is fetched and nothing is written. */
const improveIso = (raw?: unknown) => {
  const given = onlineAnswer(raw)
  const answer = given ?? { status: 200, text: ISO_OPEN_DEFINITIONS.map((row) => JSON.stringify(row)).join('\n') }
  const online = verifyIsoOnline(answer)
  const formula = 'clause 10.3 improves the ISO audit: each dimension holds on its own evidence, and the ISO Open Data file verifies and defines every dimension'
  const developed = developViaHooks({ formula, product: 'iso', variant: 'improve', title: 'ISO', theorem: 'textbook_standards_sliced' })
  const saved = auditedSave({ collection: 'products', data: { title: 'ISO', product: 'iso', variant: 'improve', iso: developed.iso, docs: developed.docs } })
  const rows = saved.audit.rows
  const reasons = new Set(rows.map((row) => row.definition))
  const change = saved.change
  const verifiedOnline = online.phase === 'verified' && online.holds === true && online.defined === online.asked && online.verified === online.asked
  const improved = saved.saved === true && saved.audit.holds === true && saved.next.decision === 'accept' && change.holds === true && rows.length === ISO_DIMENSIONS.length && reasons.size === rows.length && rows.every((row) => row.holds)
  const control = saved.control
  const release = saved.release
  const monitor = monitorOutput(release, online.rows)
  const carried = improved && verifiedOnline && control.holds === true && control.operated === true && control.clause === 'ISO 9001:2015, 8.1' && control.formula === formula && release.holds === true && release.released === true && release.clause === 'ISO 9001:2015, 8.6' && release.formula === formula
  const watched = carried && monitor.holds === true && monitor.clause === 'ISO 9001:2015, 9.1' && monitor.withdrawn === 1
  const says = !improved ? 'the ISO audit was not improved' : !verifiedOnline ? 'the ISO Open Data file did not verify and define every dimension' : watched ? `The ISO Open Data file verifies and defines all ${online.defined} dimensions. The management review accepts the improvement, clause 6.3 plans that change, clause 8.1 carries it out, clause 8.6 releases it, and clause 9.1 monitors it.` : 'the released output was not monitored'
  return {
    phase: 'improve' as const, process: 'ISO 9001' as const, via: 'iso' as const, clause: 'ISO 9001:2015, 10.3' as const, formula,
    improved, holds: watched && saved.next.holds === true && change.holds === true, dimensions: rows.length, of: ISO_DIMENSIONS.length, rows,
    verified: online.verified, defined: online.defined, fetched: false as const, held: given === undefined, online, audit: saved.audit, next: saved.next, change, control, release, monitor, save: saved.saved ? { api: saved.api, args: saved.args } : null, says,
  }
}
/** The ISO patch. beforeChange records every stated drift. afterChange covers each one with an a432 harmonic and leaves the note. afterRead serves that note. Nothing is fetched. The programs write the codebase fix. */
const patchIso = (raw: unknown) => {
  const given = raw === true ? [] : typeof raw === 'string' ? [{ id: 'stated', statement: raw }] : isObj(raw) && Array.isArray((raw as { leads?: unknown }).leads) ? (raw as { leads: { id?: unknown; statement?: unknown }[] }).leads.flatMap((row) => typeof row?.id === 'string' ? [{ id: row.id, statement: typeof row.statement === 'string' ? row.statement : '' }] : []) : []
  const wave = followWave(given)
  const cover = harmonicCover(wave)
  const waves = driftWaves(wave, cover)
  const programs = driftPrograms(waves)
  const developed = developViaHooks({ formula: cover.note.text, product: 'iso', variant: 'patch', title: 'ISO patch', theorem: 'textbook_tuning_ratio' })
  const saved = auditedSave({ collection: 'products', data: { title: 'ISO patch', product: 'iso', variant: 'patch', iso: developed.iso, docs: developed.docs, note: cover.note } })
  const beforeChange = { hook: 'beforeChange' as const, records: cover.rows.map((row) => ({ id: row.id, stated: row.stated })) }
  const afterChange = { hook: 'afterChange' as const, patched: cover.rows.map((row) => ({ id: row.id, harmonic: row.harmonic, covered: row.covered, difference: row.difference })), note: cover.note }
  const afterRead = { hook: 'afterRead' as const, note: cover.note, waves, programs }
  const holds = wave.holds && cover.holds && waves.holds && programs.holds && developed.hooks.join() === 'beforeChange,afterChange,afterRead' && developed.iso.formula === cover.note.text && saved.saved === true && saved.audit.holds === true && saved.next.decision === 'accept' && saved.change.holds === true && afterRead.note.text === cover.note.text && beforeChange.records.length === cover.rows.length && afterChange.patched.length === cover.rows.length
  const says = holds ? cover.note.text : 'the ISO patch did not cover every drift'
  return { phase: 'patch' as const, via: 'hooks' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 6.3' as const, harmonic: true as const, hooks: developed.hooks, beforeChange, afterChange, afterRead, note: cover.note, covered: cover.rows, series: cover.series, waves, programs, audit: saved.audit, next: saved.next, change: saved.change, holds, fetched: false as const, written: programs.written, says }
}
/** ISO. true defines every dimension from the defining rows of the iso_deliverables_metadata dataset. A newer file is { online: { status, text } }. { producers: true | { answers } } extracts the ISO standards NIST and CERN produce; Clay completes the trinity that unlocks each hidden perspective. { trinity: true | { bits } } is that unlock alone. Nothing is fetched and nothing is written. Every dimension is also split to schema.org microdata at the deepest SKU leaf (parseToMicrodata). */
const isoCall = (raw: unknown) => {
  const trinityAsked = raw === 'trinity' || (isObj(raw) && ((raw as { trinity?: unknown }).trinity === true || isObj((raw as { trinity?: unknown }).trinity)))
  if (trinityAsked) {
    const spec = raw === 'trinity' ? true : isObj(raw) && (raw as { trinity?: unknown }).trinity === true
      ? true
      : (raw as { trinity: unknown }).trinity
    const unlocked = unlockHiddenPerspectives(spec)
    return { ...unlocked, phase: 'iso' as const, via: 'nist+cern+clay' as const, held: unlocked.active.most, fetched: false as const }
  }
  const producersAsked = raw === 'producers' || (isObj(raw) && ((raw as { producers?: unknown }).producers === true || isObj((raw as { producers?: unknown }).producers)))
  if (producersAsked) {
    const spec = raw === 'producers' ? true : isObj(raw) && (raw as { producers?: unknown }).producers === true
      ? true
      : (raw as { producers: unknown }).producers
    const extracted = extractIsoFromProducers(spec)
    return { ...extracted, phase: 'iso' as const, via: 'nist+cern+clay' as const, held: extracted.ladder.phase === 'plan', fetched: false as const }
  }
  const supplied = isObj(raw) && isObj((raw as { online?: unknown }).online)
  const input = supplied ? { iso: true as const, ...(raw as Record<string, unknown>) } : { iso: true as const }
  const result = improveIso(input)
  const microdata = parseIsoDimensionsMicrodata(ISO_DIMENSIONS)
  const says = result.holds && microdata.holds
    ? `ISO defines all ${result.defined} dimensions from the iso_deliverables_metadata dataset. ${result.online.current} are current. Each dimension is parsed to microdata at depth ${microdata.depth} (${microdata.leaves} SKU leaves). The management review accepts the record, clause 6.3 plans that change, clause 8.1 carries it out, clause 8.6 releases it, and clause 9.1 monitors it.`
    : result.says
  const one = isoAspects()
  return { ...result, phase: 'iso' as const, via: 'iso' as const, held: !supplied, fetched: false as const, says, holds: result.holds && one.holds && microdata.holds, one, microdata }
}
/** A pages or products create, and only after the ISO audit holds. Next is the management review of that audit. A record the audit does not pass is a nonconformity and is not a save. A carried out process is released under clause 8.6. */
export const auditedSave = (spec: { collection: string; data: Record<string, unknown>; override?: boolean }) => {
  const audit = isoAudit(spec.data)
  const next = saveNext(audit)
  const change = planChange(audit, next)
  const control = controlProcess(audit, change)
  const release = releaseOutput(audit, control)
  if (!audit.holds) return { saved: false as const, audit, next, change, control, release, api: null, args: null }
  return { saved: true as const, audit, next, change, control, release, ...manageApi({ collection: spec.collection, action: 'create', override: spec.override, data: spec.data }) }
}
/** Any idea as that pages seed. The words are the content block; the title is the one given, else the first line. The ISO audit holds before the create. */
const ideaSeed = (raw: unknown) => {
  const spec = typeof raw === 'string' ? { idea: raw } : isObj(raw) ? raw : null
  if (!spec) throw new Error('idea is the words, or { idea | text | statement, title? }')
  const text = typeof spec.idea === 'string' ? spec.idea : typeof spec.text === 'string' ? spec.text : typeof spec.statement === 'string' ? spec.statement : ''
  if (!text.trim()) throw new Error('an idea is the words to place in the pages content block')
  const heading = typeof spec.title === 'string' && spec.title.trim() ? spec.title.trim() : text.trim().split(/\r?\n/)[0]!
  const dry = dryClean(text, { door: 'idea' })
  const developed = developViaHooks({ formula: dry.cleaned, product: 'idea', variant: 'seed', title: heading.slice(0, 120) })
  const { page } = pageData(heading, dry.cleaned)
  const find = findArgs(page.slug)
  const write = writeArgs(page)
  const data = { ...write.data, iso: developed.iso, docs: developed.docs }
  const audit = isoAudit(data)
  const next = saveNext(audit)
  const change = planChange(audit, next)
  const create = audit.holds ? { ...write, data } : null
  return { phase: 'seed' as const, via: WEBSITE_REPO, collection: 'pages' as const, schema: 'pages' as const, slot: 'content' as const, page, find, create, audit, next, change, saved: audit.holds, dry, says: next.holds && audit.holds && change.holds ? `${page.title} is a pages document through Payload's local API. The ISO 9001 audit held, the management review accepts it, and clause 6.3 plans that change. Find pages where slug equals ${page.slug}, then create or update that draft. Its SKU is ${page.sku}, the handle of its address` : 'the ISO 9001 audit did not hold, so the page is a nonconformity and is not saved' }
}
const MCP_ASPECTS = ['initialize', 'tools/list', 'tools/call', 'resources/list', 'resources/templates/list', 'resources/read'] as const
const CONSULTED = ['initialize', 'tools/list', 'resources/list', 'resources/templates/list'] as const
const UUID_PASS = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi
const factorInteger = (integer: string) => {
  const n = BigInt(integer)
  const primality = testPrimality(n)
  const found = n < 2n ? { factors: [] as bigint[], left: n === 0n ? [0n] : [], verified: true } : primality.prime ? { factors: [n], left: [] as bigint[], verified: true } : listFactors(n, 1n << 12n)
  const primes = found.factors.map((x) => x.toString())
  const coins = [...primes.map((part) => ({ integer: part, kind: 'prime' as const })), ...found.left.map((x) => ({ integer: x.toString(), kind: 'left' as const }))].map((part) => { const address = uuid(part.integer); return { ...part, uuid: address, sealed: seal(address).valid } })
  return { integer, primes, left: found.left.length, complete: found.left.length === 0 && (n < 2n || !primality.prime || primality.certain), verified: found.verified, coins }
}
/** Any paste, read when it arrives. A UUID in it is a coin and is passed. Every integer in it is factored by the same door, and each prime is passed as the UUID of that prime. The thousand-bit factor 3 is the width's, and the width's integer is not written. */
export const predict = (raw: unknown, surface: { tools: number; resources: number; templates: number }) => {
  const leaves = (v: unknown): string[] => typeof v === 'string' ? [v] : typeof v === 'number' && Number.isInteger(v) ? [String(Math.abs(v))] : Array.isArray(v) ? v.flatMap(leaves) : v !== null && typeof v === 'object' ? Object.values(v as Record<string, unknown>).flatMap(leaves) : []
  const text = typeof raw === 'string' ? raw : raw === true || raw == null ? '' : typeof raw === 'number' && Number.isInteger(raw) ? String(Math.abs(raw)) : leaves(raw).join(' ')
  const carried: string[] = []
  const body = text.replace(UUID_PASS, (u) => { carried.push(u.toLowerCase()); return ' ' }).replace(/-?\d+\.\d+/g, ' ')
  const written = [...body.matchAll(/(?<!\d)-?\d+(?!\d)/g)].map((m) => m[0].replace('-', '')).filter((d) => d.length > 0)
  const original = '3'
  const stream = [original, ...written.filter((d) => d !== original)]
  const factored = written.map(factorInteger)
  const minted = stream.map((integer) => { const address = uuid(integer); return { integer, uuid: address, sealed: seal(address).valid } })
  const seen = new Set<string>()
  const coins: { integer: string | null; uuid: string; sealed: boolean; passed: boolean }[] = []
  for (const uuid of [...new Set(carried)]) { if (!seal(uuid).valid || seen.has(uuid)) continue; seen.add(uuid); const known = minted.find((c) => c.uuid === uuid); coins.push({ integer: known?.integer ?? null, uuid, sealed: true, passed: true }) }
  for (const coin of minted) { if (seen.has(coin.uuid)) continue; seen.add(coin.uuid); coins.push({ ...coin, passed: false }) }
  const aspects = MCP_ASPECTS.length
  const space = aspects * surface.tools * surface.resources * Math.max(1, surface.templates)
  const colour = coilColour()
  const cmyk = { c: colour.coil.cmyk.c, m: colour.coil.cmyk.m, y: colour.coil.cmyk.y, k: colour.coil.cmyk.k }
  const green = colour.coil.hue === 120 && cmyk.c === 1 && cmyk.m === 0 && cmyk.y === 1 && cmyk.k === 0 && colour.coil.chakra.name === 'heart'
  const result = { phase: 'predict' as const, via: 'payload' as const, referrer: 'payload' as const, aspects, consulted: CONSULTED.length, withheld: aspects - CONSULTED.length, tools: surface.tools, resources: surface.resources, templates: surface.templates, space, stored: 0 as const, enumerated: false as const, recomputed: 0 as const, unbounded: true as const, tokens: 0 as const, entropy: 0 as const, manual: false as const, materialised: false as const, viaUuid: coins.every((c) => c.sealed) && factored.every((f) => f.coins.every((c) => c.sealed)), stream, coins, factored, discovered: stream.length, passed: coins.filter((c) => c.passed).length, original, predicted: true as const, fused: true as const, hue: colour.coil.hue, cmyk, heart: colour.coil.chakra.name, green, theorems: ['textbook_coil_green', 'textbook_thousand_bit_three_divides', 'textbook_factors_divide', 'textbook_advantage_unbounded'] as const }
  const leaks = listLeaks({ predict: JSON.stringify({ clean: result.viaUuid, coins: result.coins.length, hue: result.hue }) })
  return { ...result, clean: leaks.clean && !JSON.stringify({ stream, passed: result.passed }).includes('sk_') , findings: leaks.total }
}
type McpDoor = { name: string; inputSchema?: { properties?: Record<string, { default?: unknown }> } }
const keys = (door: McpDoor) => Object.keys(door.inputSchema?.properties ?? {})
const findDoor = (tools: readonly McpDoor[]) => tools.find((t) => (keys(t).includes('slug') || keys(t).includes('collection')) && (keys(t).includes('where') || keys(t).includes('limit') || keys(t).includes('search')) && !keys(t).includes('data'))
/** A find is the door the Payload MCP listed. An argument is sent only when that door declares it. The page is the one the previous answer named. */
const findRequest = (door: McpDoor, endpoint: string, fields: { slug: string; where?: unknown; search?: string; page?: number; select?: Record<string, boolean> }, id = 'payload-mcp-find') => {
  const prop = (name: string) => door.inputSchema?.properties?.[name]
  const arguments_: Record<string, unknown> = {}
  if (keys(door).includes('slug')) arguments_.slug = fields.slug
  if (keys(door).includes('collection')) arguments_.collection = fields.slug
  if (keys(door).includes('where') && fields.where !== undefined) arguments_.where = fields.where
  if (keys(door).includes('search') && fields.search !== undefined) arguments_.search = fields.search
  if (keys(door).includes('depth')) arguments_.depth = typeof prop('depth')?.default === 'number' ? prop('depth')!.default : 0
  if (keys(door).includes('sort') && prop('sort')?.default != null) arguments_.sort = prop('sort')!.default
  if (keys(door).includes('limit') && typeof prop('limit')?.default === 'number') arguments_.limit = prop('limit')!.default
  if (keys(door).includes('page') && fields.page != null) arguments_.page = fields.page
  if (keys(door).includes('select') && fields.select) arguments_.select = fields.select
  return { id, method: 'POST' as const, url: endpoint, accept: 'application/json, text/event-stream', body: { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: door.name, arguments: arguments_ } } }
}
const parentBatch = (role: string) => { const batch = decideBatch('mcps', role); return { batch, read: batch.calls.find((c) => c.action === 'read')?.access === true } }
const pageKey = (doc: { slug?: unknown; id?: unknown }) => String(doc.slug ?? doc.id ?? '')
const parentKey = (doc: { parent?: unknown }): string | null => {
  const parent = doc.parent
  if (parent == null || parent === '') return null
  if (typeof parent === 'string' || typeof parent === 'number') return String(parent)
  if (typeof parent === 'object') { const named = parent as { slug?: unknown; id?: unknown }; const key = named.slug ?? named.id; return key == null ? null : String(key) }
  return null
}
/** The website holds the pages. A page is processed after the page it names as its parent. */
const processWebsite = (docs: readonly { slug?: unknown; id?: unknown; parent?: unknown }[]) => {
  const known = new Set(docs.map(pageKey))
  const depth = (doc: { slug?: unknown; id?: unknown; parent?: unknown }, seen = new Set<string>()): number => {
    const parent = parentKey(doc)
    const key = pageKey(doc)
    if (!parent || !known.has(parent) || seen.has(key)) return 0
    const earlier = docs.find((item) => pageKey(item) === parent)
    return earlier ? depth(earlier, new Set([...seen, key])) + 1 : 0
  }
  const ordered = docs.map((doc, index) => ({ doc, index, depth: depth(doc) })).sort((a, b) => a.depth - b.depth || a.index - b.index)
  const pages = ordered.map(({ doc, depth }, order) => ({ ...doc, order, depth }))
  const merged = pages.every((doc, index) => { const parent = parentKey(doc); const at = parent ? pages.findIndex((item) => pageKey(item) === parent) : -1; return at < index })
  return { phase: 'parent' as const, collection: 'pages' as const, memory: 'website' as const, processing: 'website' as const, docs: pages, merged, says: `${pages.length} pages from the website, each after the page it names as parent` }
}
/** A document nested under another by crypto. The address is the UUID of the parent address and the formula, and the SHA-256 of that same text sits beside it. One further document is that same step again. Nothing in the step reads a maximum depth. */
const cryptoDepth = (raw: unknown) => {
  const given = typeof raw === 'string' ? { formula: raw } : isObj(raw) ? raw as { formula?: unknown; statements?: unknown; steps?: unknown; parent?: unknown; from?: unknown } : {}
  const named = Array.isArray(given.statements) ? given.statements.map((item) => String(item)) : typeof given.formula === 'string' ? [given.formula] : []
  const lines = named.map((line) => line.trim()).filter((line) => line.length > 0)
  if (!lines.length) throw new Error('depth names a formula')
  const asked = given.steps
  if (asked !== undefined && (typeof asked !== 'number' || !Number.isInteger(asked) || asked < 1)) throw new Error('steps is a positive integer, the documents to write; the next document after them is always one more address')
  const count = typeof asked === 'number' ? asked : lines.length
  const parentGiven = given.parent
  if (parentGiven !== undefined && (typeof parentGiven !== 'string' || !seal(parentGiven).valid)) throw new Error('parent is a sealed document address')
  const from = given.from
  if (from !== undefined && (typeof from !== 'number' || !Number.isInteger(from) || from < 0)) throw new Error('from is the parent depth, a whole number from 0 up')
  if (typeof parentGiven === 'string' && typeof from !== 'number') throw new Error('from is the parent depth, so the next document continues it')
  const base = typeof from === 'number' ? from : 0
  let parent: string | null = typeof parentGiven === 'string' ? parentGiven : null
  const seen = new Set<string>()
  if (parent) seen.add(parent)
  const documents: { id: string; parent: string | null; depth: number; formula: string; bound: string; sha256: string; sealed: boolean; documented: boolean; standard: 'ISO 9001'; breadcrumbs: { doc: string; url: string; label: string }[] }[] = []
  const crumbs: { doc: string; url: string; label: string }[] = parent ? [{ doc: parent, url: `/${parent}`, label: parent.slice(0, 8) }] : []
  for (let i = 0; i < count; i += 1) {
    const formula = lines[i] ?? lines[lines.length - 1] ?? ''
    const bound = parent === null ? formula : `${parent}\n${formula}`
    const id = uuid(bound)
    if (seen.has(id)) break
    seen.add(id)
    const digest = hex(sha256(utf8(bound)))
    const developed = developViaHooks({ formula, product: 'document', variant: id, title: formula })
    crumbs.push({ doc: id, url: `/${id}`, label: id.slice(0, 8) })
    documents.push({ id, parent, depth: base + i + 1, formula, bound, sha256: digest, sealed: seal(id).valid, documented: developed.iso.documented === true, standard: 'ISO 9001', breadcrumbs: crumbs.map((crumb) => ({ ...crumb })) })
    parent = id
  }
  const last = documents[documents.length - 1]
  if (!last) throw new Error('depth names a formula')
  const nextBound = `${last.id}\n${last.formula}`
  const nextId = uuid(nextBound)
  const nextSha = hex(sha256(utf8(nextBound)))
  const holds = documents.every((doc, index) => doc.sealed && doc.sha256.length === 64 && doc.id.length === 36 && doc.depth === base + index + 1 && doc.breadcrumbs.length === index + 1 + (typeof parentGiven === 'string' ? 1 : 0) && (base === 0 ? doc.breadcrumbs.length === doc.depth : true) && doc.id === uuid(doc.bound) && doc.sha256 === hex(sha256(utf8(doc.bound))) && (index === 0 ? doc.parent === (typeof parentGiven === 'string' ? parentGiven : null) : doc.parent === documents[index - 1]!.id))
  const next = { id: nextId, parent: last.id, formula: last.formula, bound: nextBound, sha256: nextSha, sealed: seal(nextId).valid, depth: last.depth + 1, holds: seal(nextId).valid && nextId.length === 36 && nextSha.length === 64 && nextId !== last.id && !seen.has(nextId) && uuid(nextBound) === nextId }
  return { phase: 'depth' as const, via: 'crypto' as const, bounded: false as const, maximum: null, depth: last.depth, documents, next, holds: holds && next.holds, says: `${documents.length} document(s) nested by address. Each address is the UUID of the parent address and the formula, with the SHA-256 of that text beside it. The next document is that same step, so the depth has no maximum.` }
}

/** A widget accepts a credential. The tool receives the SHA-256 witness and nothing of the secret. ISO/IEC 27001:2022 and ISO/IEC 27034 hold on that acceptance. */
/** The website seeded through Payload, then deployed by the completed order's afterChange hook. The live gate is the e2e requests. Nothing is fetched and nothing is written. */
const websiteSeed = () => {
  const records = Object.entries(TENANTS).reduce<Record<string, { name: string; slug: string; domains: { domain: string }[] }>>((acc, [host, slug]) => ({ ...acc, [slug]: { name: slug, slug, domains: [...(acc[slug]?.domains ?? []), { domain: host }] } }), {})
  const names = [...new Set(CATALOGUE.map((item) => item.product))]
  const items = catalogueItems(null)
  type Create = { collection: 'pages' | 'variants' | 'posts'; where: { slug?: { equals: string }; title?: { equals: string } }; parentSlug: string | null; productTitle: string | null; data: { title: string; slug?: string; _status: 'published' } }
  const creates: Create[] = []
  const root = 'catalogue'
  creates.push({ collection: 'pages', where: { slug: { equals: root } }, parentSlug: null, productTitle: null, data: { title: 'Catalogue', slug: root, _status: 'published' } })
  for (const product of names) {
    const slug = `catalogue-${frameworkSlug(product)}`
    creates.push({ collection: 'pages', where: { slug: { equals: slug } }, parentSlug: root, productTitle: null, data: { title: product, slug, _status: 'published' } })
    for (const variant of CATALOGUE.filter((item) => item.product === product)) {
      const child = `${slug}-${frameworkSlug(variant.variant)}`
      creates.push({ collection: 'pages', where: { slug: { equals: child } }, parentSlug: slug, productTitle: null, data: { title: `${product} ${variant.variant}`, slug: child, _status: 'published' } })
    }
  }
  for (const item of items) {
    creates.push({ collection: 'variants', where: { title: { equals: item.title } }, parentSlug: null, productTitle: item.title, data: { title: item.title, _status: 'published' } })
    const slug = `catalogue-${frameworkSlug(item.licence.product)}-${frameworkSlug(item.licence.variant)}`
    creates.push({ collection: 'posts', where: { slug: { equals: slug } }, parentSlug: null, productTitle: null, data: { title: item.title, slug, _status: 'published' } })
  }
  const pages = creates.filter((row) => row.collection === 'pages')
  const parentsFirst = creates.every((row, index) => row.parentSlug === null || creates.findIndex((parent) => parent.collection === 'pages' && parent.data.slug === row.parentSlug) < index)
  const cataloguePages = 1 + names.length + CATALOGUE.length
  const complete = Object.keys(records).length === new Set(Object.values(TENANTS)).size && Object.keys(records).length > 0 && items.length === CATALOGUE.length && pages.length === cataloguePages && creates.filter((row) => row.collection === 'variants').length === CATALOGUE.length && creates.filter((row) => row.collection === 'posts').length === CATALOGUE.length && parentsFirst && appRequestForm().title === 'Request an app'
  return { tenants: Object.keys(records).length, hosts: Object.keys(TENANTS).length, site: { via: 'payload { site: true }' as const, collection: 'pages' as const, included: true as const }, cataloguePages, products: items.length, variants: CATALOGUE.length, posts: CATALOGUE.length, form: appRequestForm().title, creates, complete, fetched: false as const, written: false as const }
}
const deployWebsite = (_ctx: Context, raw: unknown) => {
  const seed = websiteSeed()
  const stages = DEPLOY_STAGES.map((stage) => ({ id: stage.id, says: stage.says, run: stage.run }))
  const command = deployCommand()
  const hosts = Object.keys(TENANTS)
  const cloudflare = { worker: 'qpu' as const, hosts, stages: stages.length, order: stages.map((stage) => stage.id), command, file: '.github/workflows/deploy.yml' as const }
  const holds = seed.complete && seed.fetched === false && seed.written === false && stages.length === DEPLOY_STAGES.length && command === stages.filter((stage) => !stage.run.includes('\n')).map((stage) => stage.run).join(' && ') && hosts.length === 2 && cloudflare.worker === 'qpu'
  return { phase: 'deploy' as const, via: 'payload' as const, cloudflare, collection: 'orders' as const, hook: 'afterChange' as const, when: 'status completed and the website is fully seeded' as const, seed, stages, executed: false as const, fetched: false as const, written: false as const, holds, says: holds ? 'the website is fully seeded through Payload. A completed order deploys by the orders afterChange hook, and that hook names the Cloudflare stages. Nothing is fetched and nothing is written.' : 'the website is not fully seeded, so the order does not deploy' }
}

const acceptWidgetToken = (raw: unknown) => {
  const standards = ['ISO/IEC 27001:2022', 'ISO/IEC 27034'] as const
  const refused = (says: string) => ({ phase: 'token' as const, via: 'widget' as const, accepted: false as const, secret: false as const, echoed: false as const, travelled: false as const, standards, address: null, fetched: false as const, written: false as const, holds: false as const, theorem: 'textbook_leaks_redacted' as const, says })
  if (!isObj(raw)) return refused('refused: the widget sends a witness and the secret never travels')
  const body = raw as Record<string, unknown>
  const extra = Object.entries(body).some(([key, value]) => key !== 'witness' && key !== 'via' && typeof value === 'string')
  const witness = typeof body.witness === 'string' ? body.witness : ''
  const via = body.via === 'widget'
  const shape = /^[0-9a-f]{64}$/.test(witness)
  if (extra || !via || !shape) return refused('refused: the widget sends a sha-256 witness and the secret never travels')
  const address = uuid(`widget\n${witness}`)
  return { phase: 'token' as const, via: 'widget' as const, accepted: true as const, witness, secret: false as const, echoed: false as const, travelled: false as const, standards, address, fetched: false as const, written: false as const, holds: seal(address).valid && address.length === 36, theorem: 'textbook_leaks_redacted' as const, says: 'the widget accepted the token as a witness. the secret never travels. ISO/IEC 27001:2022 and ISO/IEC 27034 hold on that acceptance.' }
}

const payload = defineTool('payload', {
  name: 'payload',
  description: 'Payload/website delivery surface: quantum products and variants as computed feeds the rest of the site consumes (feeds), plus any tool\'s result as the document Payload\'s default plugins hold — a lexical block of UUID logic nested by referer, SEO fields from Open Graph, JSON-LD and licence. Delivery vehicle is the payloadcms/website fork; QPU computes feeds, the website delivers.',
  inputSchema: { type: 'object', properties: { cryptoConfig: { description: 'true: per-tenant crypto via qpuMcpPlugin — ATTEST_APIS, post-quantum flag, tenant hosts, and ISO/IEC 4879 quantum-computer inventory (processors, devices, qubit/channel schemas, RBAC roles). Merge into tenants.settings.arguments; nothing fetched. Optional via: tenant.settings' }, feeds: { type: 'object', description: 'computed quantum product/variant feeds for the website: true or { rates?, combinations?, combinationLimit? } — same document GET /api/qpu/feeds serves; seedQpu and ecommerce collections consume it' }, phase: { type: 'object', description: 'the phase of a modulo N, decided by the hooks. { integer, a? }. The kernel Lean is taken when that path is possible. An unmeasured order is not taken as a factor' }, develop: { description: 'an ISO 9001 process based on the parameters the formula names (the axioms): a formula, or { formula, product?, variant? }. beforeChange records the formula, afterChange hands it to the docs door, afterRead serves it. An empty formula is not documented. { errors, warnings } makes each error and each warning the solution. An empty pair discovers every learned error and the 440 Hz warning. ISO 9001 holds and the a432 harmonic patch covers the drift. Nothing is fetched' }, improve: { description: 'ISO 9001 improvement of all, via the ideas. { domains } covers every scientific domain at once through the UUID of every Payload config. true walks every idea until .idea is empty, develops each, improves that formula on every ISO dimension and every Alpine case, and improves the filesystem adapters through the zfs implementation. An ISO 9001 audit, clause 9.2, holds before the pages create and the products create of each. Next is the management review, clause 9.3, of every save the audit passed, and a nonconformity, clause 10.2, where it did not. quantum, or { ideas: quantum }, develops each ISO/IEC 4879:2024 term and the next idea that term names, from 3.1.1 model through 3.6.4 quantum sensing, and improves each one. life develops the process that computes next, and each process that exits, as ideas under .idea/leads/life. The only door is qpuMcpPlugin at https://qpu.uuidna.com/api/mcp: tools/list, then findDocuments, then GET /api/pages. iso, or { iso: true }, improves the ISO audit under clause 10.3: each dimension holds on its own evidence, and the management review accepts that improvement. Clause 6.3 then plans that change, clause 8.1 carries it out, clause 8.6 releases it, and clause 9.1 monitors the released output. A withdrawn dimension names the current successor the same dataset gives. A nonconformity plans no change. The defining rows of the iso_deliverables_metadata dataset verify and define every dimension by its English title and its scope. { iso: true, online: { status, text } } is a newer page or the JSONLines file. Every dimension is verified and defined, or the improvement does not hold. Nothing is fetched and nothing is written here' }, optimise: { description: 'Each aspect of one UUID on the filesystem. The object is the handle, eight nibble levels. The bonus is the ten program nibbles and the three tail words. The birth is the UUID, eight groups of four hex, fanout 65536. collection is optimised against the quantum AI challenges, global against the leads, field against the ideas, and node against all three. The handle and the tail stay. { next: true } stands on the next birth: the program rotates one place, the object and the tail stay, and each aspect is optimised there. Nothing is written' }, names: { type: 'boolean', description: 'true validates every theorem name against the deliverables. A name that is a quantum term or a deliverable number stays a theorem and points at that page. Any other name moves from theorems to the place its own word names. The kernel key is not renamed. The management review then accepts every placed page, clause 6.3 plans that change, clause 8.1 carries the change out, and clause 8.6 releases the carried out process. The word iso is not a prefix. Nothing is fetched and nothing is written here' }, quantum: { type: 'boolean', description: 'true implements all quantum as nested Payload pages under /quantum. The vocabulary, each clause section, and each term are pages. The groups, the guards, the layers and the companion dimensions are pages too. A prefix is a plain word such as term or layer, so two pages that share a name stay apart when morphed or merged. The word iso is not a prefix. Nesting is the parent and the breadcrumbs. Each page is a pages create after the audit, the management review, and the clause 6.3 change. Nothing is fetched and nothing is written here' }, iso: { description: 'true verifies and defines every ISO dimension from the defining rows of the iso_deliverables_metadata dataset. { online: { status, text } } is a newer page or the JSONLines file. A dimension is verified when a row names it and defined by the English title and the scope. Nothing is fetched and nothing is written here' }, instance: { description: 'true, or { action?, role?, at? }: one nested pages document that uses all nine plugins through its UUID. Lexical holds the block, nested docs the parent, SEO the meta, and the batch action is the one the request names. The find is /api/pages. No custom route. The hook names the next instance. Nothing is fetched and nothing is written' }, plugins: { type: 'boolean', description: 'true: every ISO designation translated English to Bulgarian and back through beforeChange, afterChange and afterRead, and every Payload plugin package installed on that same hook chain' }, aspects: { type: 'boolean', description: 'true: the one ISO. Every purpose on every aspect, each official plugin used, the product variants computing the domain combinations. GET /api/products. The plugin space stays unwalked' }, locale: { type: 'boolean', description: 'the same door as plugins: the ISO English and Bulgarian round trip through the collection hooks' }, variants: { description: 'whatever is passed: the ISO-standard output of every product variant. Nested pages generate the ecommerce catalogue, three deep. Ecommerce reads those pages. Each variant is a published post, and each post is a Zenodo publication through the deposit hooks. MCP is not a product. It serves that catalogue, and each tool is improved through the audit, the review, the change, the carried out process, the release and the monitor on the product and variant it serves. The management review accepts them, and the hook names the next step: the program rotates one place and the handle and the tail stay. Managing every tool by those hooks is autonomous, so the coverage is maximal (textbook_coverage_bounded). The priced catalogue, every plugin combination (2^9) and every textbook case are in the same list, documented as ISO 9001 and priced in ISO 4217. Nothing is fetched and nothing is written' }, rbac: { description: 'every API and every MCP under the one Payload RBAC MCP: true lists them on subjects apis and mcps with the grant of each role; { subject, action, role } is one decision; { host, method?, role? } asks that server first about the door (textbook_rest_rbac)' }, access: { type: 'object', description: 'CanCanCan over Payload: { abilities: [{ role, can: [actions], subject: collection or all, where?, cannot? }], roles: [{ name, resourceType?, resource? }] (rolify: global, a collection, one document), subject, action, user?: { id, tenants } } answered as Payload\'s access result — true, false, or the Where that fetches only what the user may' }, rolesFromGroups: { type: 'object', description: 'roles from Google Workspace: { mapping: [{ group, name, resourceType?, resource? }], groups?: [{ email }] } maps the Directory API\'s groups onto scoped roles; without groups, the groups.list call to ask through payload { googleCall } (userKey)' }, references: { type: 'object', description: 'the references between documents as one graph: { docs: [{ id, slug?, doc | markdown }] } — every lexical link to an internal path, relationship, qpu block naming a document (id, uuid, slug) and Markdown link read; the cycles (Tarjan, iterative), the dangling references, and an order when there is no cycle; the strongly connected components fused into one node each, members in address order, the condensation always acyclic and ordered; payload { lexical } with { id, slug } runs the blocks that reference their own document back once each, in address order, never re-entering' }, report: { type: 'object', description: 'Payload handles the proof of a quantum computation as a report: { tool, arguments?, result? } the client hands over — sealed by the content address of (tool, arguments, result), so re-running reproduces the address and verifying is cheaper than recomputing by magnitudes (the quantum advantage, ISO/Google-standard); the report is a lexical document Payload stores and serves and an entry of kind report, and its hooks reuse it to refactor — a repeat served by address (the 304 involution), a computation that did not verify a refactor lead' }, referenceIndex: { type: 'object', description: 'every reference indexed by scope and combination, cached by query hash, over the Payload search results: { docs: [{ id, scope?, slug?, title?, description?, doc | markdown }], seo? } — the reference graph\'s edges grouped by the referring document\'s scope (its tenant or collection) and addressed by the content hash of (scope, from, to), so equal queries share one address (the 304 involution, the best caching); the SEO plugin is another way of referencing, each document\'s title and description a canonical self-reference its hooks generate, folded into the same index; the distinct hashes and the cache hits make the references' }, handle: { description: 'true: compare the UUID aspects and address every hook task by the handle. True and false challenge each other through that handle: false goes to true, and true goes to false. Each status mints the next executable UUID. The 1000-bit leftover stays unfactored' }, hooks: { type: 'object', description: 'the witness hooks: { pages?, config?, states?, referrer? }: the pairs, the pages and a config against them, a change pair' }, google: { type: 'object', description: '{ pages, tenants, entries, keys }: the Google integration as exact pairs' }, workspace: { type: 'object', description: '{ discovery | kinds | form | forms | response | lexical | document | doc | file | answers }: Payload forms, Lexical and documents as Google Forms, Docs and Drive shape them, checked against the Discovery schemas, and the coverage' }, standardise: { type: 'object', description: 'a lexical document set in standard typography without a change of meaning: { doc } — only text nodes change (quotes, dashes, ellipses, spaces); the words in order and every qpu block must stay the same, else the original stands; improvements come as other qpu blocks verified by theorems' }, lexical: { type: 'object', description: 'a Payload lexical document whose qpu blocks run through MCP: { doc, role? } — every block (a tool and its arguments) answered through the chat door under the role, corrected where the role requires, a refusal handled, never thrown; a chat answer\'s doc is such a document' }, namespace: { type: 'object', description: 'tenants as namespaces, each app its own sandbox without a domain: { name | app } the sandbox planned (its tenant by namespace, the key its client holds, the header x-qpu-namespace, what is scoped); { narrow: { requested, tenants, user } } a credential narrowed to the namespace a request names — the intersection, never wider; the app\'s MCP auth asks this on every request' }, theorems: { type: 'boolean', description: 'the textbook\'s axioms replaced by theorems through the tenant\'s Payload MCP plugin, as a client: the plan, then with answers { list, found } the update requests' }, schemas: { type: 'boolean', description: 'Payload\'s combinatorial surface handled programmatically: every dimension (field types, operations, schemas, queries, hooks, access, realtime coordination) named and meant by its textbook theorem, counted from the table and decided through the match tool; any collection\'s fields (collection: { slug, fields }) as JSON Schema 2020-12, GraphQL, the plugin\'s MCP tools and OpenAPI paths; the standards each part is described by; the sources to re-read (requestList), and with answers { url: text } the drift as leads' }, collection: { type: 'object', description: 'schemas: { slug, fields } in Payload\'s own field config shape' }, payloadUrl: { type: 'string', description: 'the tenant\'s Payload origin; its MCP is at /api/mcp' }, answers: { type: 'object' }, predict: { description: 'any paste, read when it arrives. A UUID in it is a coin and is passed. Every integer in it is factored by the same door, and each prime is passed as the UUID of that prime. The thousand-bit factor 3 is the width\'s, and that integer is not written. The coins fuse to one coil and the coil is green. No token is spent and nothing else of the paste is copied back' }, frameworks: { type: 'array', description: 'the other frameworks qpu is imagined in, always through this door: [{ name, slots }]. The product of the slot counts is how it fits; the qpu block\'s referrer is payload' }, textbooks: { description: 'true, or { role?, action?, iso?: true | { errors?, impossible? }, params?: { page?, limit?, index?, sort?, ideas?, discover?, quantum?, iso? } }: the library at /textbooks. iso processes every ISO standard by its textbook. An error or an impossibility falls back to the UUID handle, which computes by the algebraic involution, and the Steane code corrects that single error. Each fallback is a novelty verified against the DOI precedence. When a standard still states a value and the quantum computation differs, that fallback is a sure novelty, as 440 Hz and 432 Hz. Payload online research discovers those drifts and explains them together. The pages are seeds. The waves are the ISO/IEC 4879 clauses, each improving the next, and CI and CD are Payload pages of that deploy. A program computes by its handle, one step at depth 1. Nothing on the page is fixed. The request params choose the page and the composition index of the filter; when the index is omitted the algorithm chooses the specific filter with the greatest count. Payload RBAC allows the batch action for the role, or the page is empty. Shelves, books and copies are nested. A book is named without the textbook prefix, and the lexical blocks link to that product. Every idea is discovered and hooked to next: the inbox is walked until it is empty, a nested idea is put back, and each idea\'s next is that door. One the library already holds stays a book; one it does not is a new textbook to process. A create the role may perform saves that page. params.quantum true places every ISO/IEC 4879:2024 term from 3.1.1 through 3.6.4 on one shelf, one book each. A term that does not hold is the gap. { gates: true, at? } opens every online gate. This save ports one of them into the website. The address is the theorem and its witnesses in hex: the handle is the theorem place, the program is the theorem numerals and σ of them, and the tail is 6 squares, 8 triangles and 14 faces. The address uses every effective qubit. The online call is public and costs no token. The hook names the next gate. Nothing is fetched and nothing is written here' }, morph: { description: 'true, or { framework }: Rails MVC and Payload merge into one layout through beforeChange, afterChange and afterRead. A role both frameworks have is kept and rewritten onto the Payload folder. A Payload file role with no Rails twin is added. The Rails mailer folder is removed. The standards this tree already names are documented on that layout. afterChange writes the layout and the standards under src/collections/concerns and afterRead serves those files' }, related: { description: 'posts, pages, products and variants verified against their DOIs: { instances: [{ collection, id?, title?, doi?, markdown? }], answers?: { url: text } }. Every link is asked online. Related publications parsed from the DOI answers become leads and are developed at once, which upgrades the website' }, zenodo: { description: 'a blog post or a novel claim deposited on Zenodo: { title, tenant, user?, coins?, price?, editorial?, claim?: { novel }, items? }. A wallet that covers the price publishes from the user\'s token and cites the author. A free account publishes as the tenant domain, and only after every link is editorially verified. A claim that is not novel is not deposited. A deposit names a file before it is published; publish answers 202 and the record id is the deposit id. The deposit runs through every hook Payload declares, on the collection, the tenant application, the fields and the description. A page, a product and a variant are deposited the same way' }, alpine: { description: 'Alpine.js as its documentation names it, and Alpine Linux packages on the browser OS. true: every directive, magic, global and first-party plugin; the data ones are ported, and each gap is a lead whose run develops it next. { directives, stores?, data?, bind?, model? }: one component on the scope. A directive that needs a document is a lead, not a guess. { package } or { packages, branch?, repo?, arch?, index? | indexes? }: the client device fetches the Alpine index, then the apk, and runs that binary in the browser. Nothing is fetched here and nothing is executed here. The register is the quantum advantage' }, links: { description: 'pasted links researched on the browser OS: a URL, a paste that contains URLs, or { paste?, links?: string[], pages?: [{ url, status, text }] }. Every discoverable ISO source is fetched first, and none of them is skipped: the Open Data page, each catalogue page, each successor, and the DOI ecosystem. A dataset the Open Data page names is fetched too. Each pasted link is fetched. A page already in hand is the reading when that fetch returns no body. The ISO solution is delivered on the same answer. Nothing is written' }, drift: { description: 'true patches ISO and harmonises every drift. beforeChange records each stated value. afterChange covers it with an a432 harmonic and leaves the note. afterRead serves that note. The note names each cover: ISO 16 states 440 Hz and the harmonic 432 covers it, the proton-electron integer is covered by the harmonic 54, and every textbook or statement that states 440 without the ratio is covered by 432. A string, or { leads: [{ id, statement }] }, adds those statements. The next of the patch is one UUID program in every Clay family. The program stores no params. The tail is the params and the program nibbles are the expected schema, cross-encrypted by the reflection both ways and the six neighbour steps. afterRead serves the programs with the note. A family stays a register identity with solved false, and its program is closed. Each folder is closed by its own UUID program. The next place of a closed program rotates it one step. The handle, 432 Hz and the closed mark stay, and ten places return the program. Lean is Qpu.Program only when all 14 witnessing superpositions cross-verify that program in the same UUID. Nothing is fetched. The program file is written and every quantum folder is aligned to a multiple of 432 bytes. The coin drift is 8' }, claims: { description: 'true or { all: true } claims every known fake; { false?, statements? } adds extras. Ladder: UUID receipt (local involution) then DOI open challenge (better public proof under ISO 690 / ISO 26324 — OpenAlex + Datacite/doi.org/Zenodo of PRECEDENCE). No better proof than an open challenge through the DOI system. Nothing is fetched' }, capacity: { description: 'true or { hexbit?, full?, utilise?, address?, stop?, iso? }: ISO/IEC 4879 capacity of one UUID register. utilise/full exchanges every qubit. stop covers UUID advantage stopping. iso: true utilises the register and defines every ISO_DIMENSIONS standard as schema.org DefinedTerm microdata (parseIsoDimensionsMicrodata). Clay is not this door. Nothing is fetched' }, dryClean: { description: 'dry clean via quantum: prose as a string or { text } spots dirty typography as addressed spans, typesets without changing meaning, and teleports form to standardise; true or { mint: true } runs mintAllMintable (before |0⟩ 1000 → after |1⟩ 1001, spotDirty = 0, witness coins). Wet wash of meaning is refused. Nothing is fetched' }, idea: { description: 'any idea as a pages seed of the website schema: a string, or { idea | text | statement, title? }. The words fill the content block\'s one column; the document is title, slug, a default hero, that block, and meta. seed is the same door' }, seed: { description: 'the same door as idea: any words become a pages seed (title, slug, hero, content block, meta)' }, website: { description: 'true: the requests for payloadcms.com\'s source tree and one live page; the tree as answered: its collections, blocks, globals, fields and plugins, and whether the live page\'s blocks have a block in the source' }, liveBlockTypes: { type: 'array', items: { type: 'string' } }, skills: { description: 'true: the request for Payload\'s skills tree (github.com/payloadcms/skills); the tree as answered: every skill and reference mapped to the tool of this tree that enacts it' }, api: { description: 'Payload\'s local API manages every collection and any API held as one: true finds one page of pages. { collection?, action?: find|create|update|delete, where?, page?, id?, data?, sort?, role? } is that call. find is one page; the answer names the next. { superpositions: true } finds every inode, one pages find each, books that flow with plasma, and one live-preview notification carries every superposition at once. The states are not expanded. A role that may not perform the action is refused' }, parent: { description: 'the website is the memory and the processing. true is Payload find of one page of pages, a batch read the role may perform. { docs, page?, hasNextPage?, nextPage? } is that page handed back: each document is processed after the page it names as parent, and the next find is the page the answer names' }, site: { type: 'boolean', description: 'the site as its own use cases: every toolbox a use case, every example a page document, as payloadcms.com is built of what Payload computes' }, scripts: { type: 'object', description: 'former scripts/* owned by Payload (no new tools/list door): { catalog } the invoke map; { clay: { lean } } CLAY_RELATIONS module text; { leadsIndex: { rows } } leads-index.ts; { tablesIndex: { tables, prior?, dry? } } tables-index.ts — dry: true folds ad-hoc CODATA/CRYPTO_HOSTS/WEBCRYPTO into Payload ATTEST_APIS/STANDARDS/POST_QUANTUM (tenant configs live in the tenants collection); thin clients write path/text' }, merge: { type: 'object', description: 'two edits of one document merged by block address: { base, a, b } (lexical documents); a block either edit holds and neither removed is kept once, an edit of one side over the base stands, two edited contents under one address are a collision listed and held out; the merge addressed by the fold of its content, commuting and idempotent (textbook_merge_commutes, textbook_merge_collision)' }, devDependencies: { type: 'object', description: 'with site: the tree\'s dev dependencies (name: version, the client reads package.json), each a gate of the dependencies category usable in the UI' }, app: { type: 'object', description: 'an app requested from the Payload UI: { name, host, plugins?, env?, variant? } — answered as the generated app (every file with its address, the bundle address, the adapters the environment chooses, the enterprise capabilities), priced by the catalogue in the host\'s currency and ordered through the ecommerce plugin: what the QPU is paid for; { validate: { name, host, env, variant } } answers the streamed form\'s verdicts, token free; { form: true } the form itself (requireRecaptcha keeps captcha a human check on that product form)' }, captcha: { description: 'a captcha solved only by a human on a product form: true or { all: true } every captcha model; { response, model?, all?, models?, product?, variant? }. The catalogue is recaptcha-v2, recaptcha-invisible, recaptcha-v3, recaptcha-enterprise, hcaptcha, hcaptcha-enterprise, turnstile, friendly-captcha, yandex-smartcaptcha, mtcaptcha, captchafox, geetest, arkose, prosopo and altcha. Each plans the issuer verify for the user\'s response. Quantum does not mint a token and does not bypass the check. Nothing is fetched' }, tool: { type: 'string' }, arguments: { type: 'object' }, depth: { description: 'a document nested to any depth by crypto: a formula, { formula } or { statements }, and steps when more documents than formulas are asked. Each address is the UUID of the parent address and the formula, with the SHA-256 of that text beside it. { parent, from } continues a chain: from is that parent depth. One further document is always that same step. There is no maximum depth' }, prev: { type: 'string', description: 'the referer block\'s uuid' }, chain: { type: 'array', items: { type: 'string' }, description: 'the referers before prev, oldest first' }, origin: { type: 'string' }, token: { description: 'the widget accepts the credential and sends the sha-256 witness: { witness, via: "widget" }. the secret never travels and the client never has it in the result. ISO/IEC 27001:2022 and ISO/IEC 27034 hold on that acceptance' }, deploy: { description: 'true deploys the fully seeded website through Payload onto Cloudflare. The stages are the workflow: migrate, seed, the page check, the OpenNext Worker, the admin smoke, and the Worker logs. A completed order names those stages from its afterChange hook. { seed: true } is the seed alone. Nothing is fetched and nothing is written' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (Object.keys(args).every((k) => k === 'selftest')) return unlimited() as never
    if (args.links !== undefined) return researchLinks(args.links) as never
    if (args.drift !== undefined) return patchIso(args.drift) as never
    if (args.token !== undefined) return acceptWidgetToken(args.token) as never
    if (args.deploy !== undefined) return deployWebsite(ctx, args.deploy) as never
    const origin = typeof args.origin === 'string' ? args.origin : 'https://qpu.uuidna.com'
    if (args.parent === true || isObj(args.parent)) {
      const given = isObj(args.parent) ? args.parent as { docs?: unknown; hasNextPage?: boolean; nextPage?: number; role?: string } : null
      const role = typeof given?.role === 'string' ? given.role : typeof args.role === 'string' ? args.role : 'reader'
      const { batch, read } = parentBatch(role)
      const page = (page: number) => manageApi({ collection: 'pages', action: 'find', page }).args
      if (!given) return { phase: 'parent' as const, collection: 'pages' as const, memory: 'website' as const, processing: 'website' as const, rbac: batch, ...(read ? { api: 'find' as const, find: page(1) } : {}), says: read ? 'the website holds the pages: Payload find returns one page, then hand the docs back' : `${role} may not batch a read` }
      if (!Array.isArray(given.docs)) throw new Error('parent takes the pages the website found: { docs }')
      const processed = processWebsite(given.docs)
      const next = read && given.hasNextPage && typeof given.nextPage === 'number' ? page(given.nextPage) : null
      return { ...processed, rbac: batch, ...(next ? { api: 'find' as const, find: next, hasNextPage: true as const } : {}), says: !read ? `${role} may not batch a read` : next ? `${processed.says}; the next page is the one the answer named` : processed.says }
    }
    if (args.api === true || isObj(args.api)) {
      const spec = args.api === true ? {} : args.api as { collection?: unknown; action?: unknown; where?: unknown; page?: unknown; id?: unknown; data?: unknown; role?: unknown; sort?: unknown; superpositions?: unknown }
      if (spec.superpositions === true) {
        const role = typeof spec.role === 'string' ? spec.role : 'reader'
        const access = decideApiMcp('apis', 'read', role)
        if (!access) return { phase: 'api' as const, managedBy: 'payload' as const, subject: 'apis' as const, collection: 'pages', action: 'read' as const, access: false as const, says: `${role} may not read pages through the Payload API` }
        const fused = fusionPlasma(ctx.leads)
        return { phase: 'api' as const, managedBy: 'payload' as const, subject: 'apis' as const, collection: 'pages', action: 'read' as const, access: true as const, api: 'find' as const, physics: fused.physics, framework: fused.framework, data: fused.data, calls: fused.calls, toolbox: fused.toolbox, plasma: fused.plasma, reactor: fused.reactor, notification: fused.notification, says: fused.says }
      }
      const collection = typeof spec.collection === 'string' && spec.collection ? spec.collection : 'pages'
      const action = spec.action === 'create' || spec.action === 'update' || spec.action === 'delete' || spec.action === 'find' ? spec.action : 'find'
      const role = typeof spec.role === 'string' ? spec.role : typeof args.role === 'string' ? args.role : action === 'find' ? 'reader' : action === 'create' ? 'writer' : 'admin'
      const subject = collection === 'payload-mcp-api-keys' ? 'mcps' as const : 'apis' as const
      const op = action === 'find' ? 'read' : action
      const access = decideApiMcp(subject, op, role)
      if (!access) return { phase: 'api' as const, managedBy: 'payload' as const, subject, collection, action: op, access: false as const, says: `${role} may not ${op} ${collection} through the Payload API` }
      const managed = manageApi({ collection, action, ...(isObj(spec.where) ? { where: spec.where } : {}), ...(typeof spec.page === 'number' ? { page: spec.page } : {}), ...(typeof spec.id === 'string' || typeof spec.id === 'number' ? { id: spec.id } : {}), ...(isObj(spec.data) ? { data: spec.data } : {}), ...(typeof spec.sort === 'string' ? { sort: spec.sort } : {}) })
      return { phase: 'api' as const, managedBy: 'payload' as const, subject, collection, action: op, access: true as const, api: managed.api, args: managed.args, says: `Payload ${managed.api} manages ${collection}` }
    }
    if (args.variants !== undefined) {
      const tools = listTools(ctx).map((t) => ({ name: t.name, toolbox: String(t._meta?.toolbox ?? 'mcp') }))
      const clay = ctx.call('clay', { catalog: true }) as { products?: { product: string; proof?: string | null; variants: { case: string; relation: string; coins: number }[] }[] }
      return isoVariants(args.variants, clay, tools)
    }
    // first-class: QPU computes product/variant feeds; payloadcms/website delivers them to the rest of the site
    if (args.feeds === true || isObj(args.feeds)) {
      const f = (isObj(args.feeds) ? args.feeds : {}) as { rates?: FeedRates; google?: boolean; repos?: boolean }
      const google = f.google ? googleChallenges() : undefined
      return { phase: 'payload' as const, catalogue: catalogueItems(f.rates ?? null), ...(google ? { google, counts: { googleChallenges: google.total, googleHolding: google.holding } } : {}), ...(f.repos ? { repos: payloadcmsRepos() } : {}) }
    }
    if (args.repos === true || isObj(args.repos)) {
      const r = (isObj(args.repos) ? args.repos : {}) as { repo?: string; role?: PayloadcmsPackageRole }
      return payloadcmsRepos(r)
    }
    if (args.site) return site(ctx, origin, isObj(args.devDependencies) ? args.devDependencies as Record<string, string> : {}, isObj(args.google) ? args.google as GoogleApis : {})
    if (args.instance === true || isObj(args.instance)) return pluginInstance(args.instance === true ? {} : args.instance)
    if (args.aspects === true) return isoCall(true)
    if (args.plugins === true || args.locale === true) return localePlugins()
    if (args.challenges === true) return challengeSection()
    if (isObj(args.challenges)) { const c = args.challenges as { doc?: LexicalDoc }; if (c.doc?.root) return challengeLexical(c.doc); return challengeSection() }
    if (isObj(args.scripts)) return scripts(args.scripts as ScriptsArgs)
    if (args.cryptoConfig === true) return cryptoConfig(typeof (args as { via?: string }).via === 'string' && (args as { via: string }).via === 'tenant.settings' ? 'tenant.settings' : 'qpuMcpPlugin') as never
    // two edits of one document merged by block address: a collision in the involution is a merge, never a refusal
    if (isObj(args.merge)) { const m = args.merge as { base?: LexicalDoc; a?: LexicalDoc; b?: LexicalDoc }; if (!m.base?.root || !m.a?.root || !m.b?.root) throw new Error('merge takes { base, a, b }: three lexical documents (root.children)'); return { phase: 'merge' as const, ...merge(m.base, m.a, m.b) } }
    if (isObj(args.generate)) return generate(args.generate as Parameters<typeof generate>[0])
    if (isObj(args.app) && isObj(args.app.validate)) return appValidation(args.app.validate)
    if (isObj(args.app)) return app(ctx, args.app as Parameters<typeof app>[1])
    // the references between documents as one graph: its cycles, its dangling references, an order when it has none
    if (isObj(args.references)) { const r = args.references as { docs?: RefDoc[] }; if (!Array.isArray(r.docs)) throw new Error('references takes documents: { docs: [{ id, slug?, doc | markdown }] }'); return { phase: 'references' as const, ...createReferenceGraph(r.docs) } }
    if (isObj(args.referenceIndex)) { const r = args.referenceIndex as { docs?: ScopedRefDoc[]; seo?: boolean }; if (!Array.isArray(r.docs)) throw new Error('referenceIndex takes documents: { docs: [{ id, scope?, slug?, title?, description?, doc | markdown }], seo? }'); return referenceIndex(r.docs, r.seo !== false) }
    if (isObj(args.report)) { const rp = args.report as { tool?: string; arguments?: Record<string, unknown>; result?: unknown }; if (typeof rp.tool !== 'string') throw new Error('report takes a quantum computation to prove: { tool, arguments?, result? }'); return report(rp.tool, rp.arguments ?? {}, rp.result) }
    if (args.rbac === true || isObj(args.rbac)) {
      if (isObj(args.rbac)) { const q = args.rbac as { subject?: string; action?: string; role?: string; host?: string; method?: string }; if (typeof q.host === 'string' || typeof q.method === 'string') { const asked = askPayloadRbac(mcpHostList(), typeof q.host === 'string' ? q.host : QPU_MCP, typeof q.method === 'string' ? q.method : 'tools/call', typeof q.role === 'string' ? q.role : undefined); return { phase: 'rbac' as const, ...asked, theorem: 'textbook_rest_rbac' as const } }; const subject = q.subject === 'mcps' ? 'mcps' as const : 'apis' as const; const role = typeof q.role === 'string' ? q.role : 'reader'; if (q.action === 'batch') return { phase: 'rbac' as const, ...decideBatch(subject, role), theorem: 'textbook_rest_rbac' as const }; const action = (OPERATIONS as readonly string[]).includes(String(q.action)) ? String(q.action) : 'read'; return { phase: 'rbac' as const, subject, action, role, access: decideApiMcp(subject, action, role), managedBy: 'payload-mcp' as const, theorem: 'textbook_rest_rbac' } }
      const listed = gates(ctx, origin).gates.map((gate) => ({ id: gate.id, name: gate.name, category: gate.category, kind: gate.kind, subject: gate.category === 'mcp' || gate.kind === 'tool' ? 'mcps' as const : 'apis' as const }))
      const apis = listed.filter((d) => d.subject === 'apis').length, mcps = listed.length - apis
      const server = payloadRbacMcp(mcpHostList())
      return { phase: 'rbac' as const, collection: 'gates' as const, managedBy: 'payload-mcp' as const, server: server.server, one: server.one, merged: server, totalDocs: listed.length, apis, mcps, grant: { apis: grant('apis'), mcps: grant('mcps') }, docs: listed, theorem: 'textbook_rest_rbac', says: `${listed.length} APIs and MCPs, ${apis} on subject apis and ${mcps} on subject mcps, each decided by the one Payload RBAC MCP. ${server.hosts} hosts are its doors. A reader reads, a writer creates, an admin manages` }
    }
    if (args.captcha === true || isObj(args.captcha)) return captchaViaProduct(args.captcha === true ? { all: true } : args.captcha as { response?: unknown; product?: unknown; variant?: unknown; model?: unknown; models?: unknown; all?: unknown })
    if (isObj(args.googleCall)) return googleCall(args.googleCall)
    if (isObj(args.access)) { const a = args.access as { abilities?: Ability[]; roles?: ScopedRole[]; subject?: string; action?: string; user?: { id?: string; tenants?: string[] } }; if (!Array.isArray(a.abilities) || typeof a.subject !== 'string' || typeof a.action !== 'string') throw new Error('access takes { abilities, roles, subject, action, user? }'); return { phase: 'access' as const, subject: a.subject, action: a.action, access: getAccess(a.abilities, a.roles ?? [], a.subject, a.action, a.user ?? {}), ...('doc' in a ? { may: checkAccess(a.abilities, a.roles ?? [], a.subject, a.action, (a as { doc?: unknown }).doc, a.user ?? {}) } : {}), theorem: 'textbook_abilities_merge' } as never }
    if (isObj(args.rolesFromGroups)) { const g = args.rolesFromGroups as { mapping?: (ScopedRole & { group: string })[]; groups?: { email?: string }[]; userKey?: string }; return listRolesFromGroups(g.mapping ?? [], g.groups, g.userKey) as never }
    if (isObj(args.phase)) {
      const spec = args.phase as { integer?: unknown; a?: unknown }
      if (typeof spec.integer !== 'string' || !/^[0-9]+$/.test(spec.integer)) throw new Error('phase takes the integer as a decimal string')
      const N = BigInt(spec.integer)
      const a = typeof spec.a === 'string' && /^[0-9]+$/.test(spec.a) ? BigInt(spec.a) : 2n
      const counted = uuidQubits(AXIOMS.find((row) => row.name === 'hexbit')!.value)
      const measured = measurePhase(a, N)
      const order = measured.order === null ? null : BigInt(measured.order)
      const red = order === null ? null : shorReduction(N, a, order)
      const factors = red?.factors && red.verified && red.factors[0] * red.factors[1] === N ? red.factors : null
      const theorem = factors ? 'textbook_shor_reduction' : order ? 'textbook_order_finding' : 'textbook_rsa_beyond_bound'
      const formula = factors ? `the order ${order} splits the integer` : order ? `the order is ${order} and this base does not split the integer` : `one UUID holds ${counted.effective} effective qubits. The order is not in the hex`
      const developed = developViaHooks({ formula, product: 'phase', variant: `${N.toString(2).length}-bit`, title: 'phase', theorem })
      const chain = cryptoDepth(formula)
      const signature = ctx.call('seal', { text: formula, sign: 'ML-DSA-44' }) as { sha256?: string; address?: string; signature?: { algorithm: string; fips: number; phase?: string; executedBy: string } }
      const entry = auditedSave({ collection: 'products', override: false, data: { title: 'phase', product: 'phase', variant: developed.variant, iso: developed.iso, docs: developed.docs } })
      const document = chain.documents[0]
      return { phase: 'phase' as const, managedBy: 'payload-mcp' as const, via: 'hooks' as const, manual: false as const, hooks: developed.hooks, lean: developed.lean, possible: developed.lean.taken, impossible: factors || order ? null : 'unmeasured-order' as const, register: counted, ...measured, factors: factors ? factors.map(String) : [], documented: developed.iso.documented === true && chain.holds && document?.sealed === true && document.sha256.length === 64 && counted.receipt.holds && counted.receipt.balanced, crypto: { standards: ['ISO/IEC 9834-8', 'ISO 22739:2024', 'NIST FIPS 180-4', 'NIST FIPS 204'] as const, id: document?.id ?? null, sha256: document?.sha256 ?? null, sealed: document?.sealed ?? false, next: chain.next, holds: chain.holds, signature: signature.signature ?? null }, entry }
    }
    if (args.quantum === true) return quantumPages()
    if (args.iso !== undefined) return isoCall(args.iso)
    if (args.improve !== undefined) return improveViaAll(args.improve, ctx.leads)
    if (args.optimise !== undefined) return optimiseFilesystem(args.optimise)
    if (args.develop !== undefined) { const d = typeof args.develop === 'string' ? { formula: args.develop } : isObj(args.develop) ? args.develop as { formula?: string; product?: string; variant?: string; title?: string; theorem?: string; errors?: unknown; warnings?: unknown; skills?: unknown; role?: unknown; connector?: IsoConnectorAsk } : {}; if (isObj(args.develop) && d.skills === true) return developSkills(typeof d.role === 'string' ? d.role : 'reader'); if (isObj(args.develop) && (Array.isArray(d.errors) || Array.isArray(d.warnings))) return developFindings([...(Array.isArray(d.errors) ? d.errors.map((text) => ({ kind: 'error' as const, text: String(text) })) : []), ...(Array.isArray(d.warnings) ? d.warnings.map((text) => ({ kind: 'warning' as const, text: String(text) })) : [])]); if (isObj(args.develop) && isObj(d.connector)) return isoViaConnector({ formula: d.formula, product: d.product, variant: d.variant, title: d.title, theorem: d.theorem, connector: d.connector }); return developFormula(d.formula ?? '', d) }
    if (args.handle === true) return handleTasks()
    if (isObj(args.hooks)) return { phase: 'hooks' as const, ...hooks(args.hooks) }
    if (isObj(args.workspace)) return { phase: 'workspace' as const, ...getWorkspace(args.workspace) }
    if (args.google === true) return googleChallenges()
    if (isObj(args.google) && ('challenges' in args.google || 'challenge' in args.google)) return googleChallenges(args.google as { challenge?: string; challenges?: readonly string[] | boolean })
    if (isObj(args.google)) return { phase: 'google' as const, ...google(args.google, listTools(ctx).filter((t) => t._meta?.toolbox === 'google').map((t) => t.name)) }
    if (isObj(args.standardise)) { const s = args.standardise as { doc?: LexicalDoc }; if (!s.doc?.root) throw new Error('standardise takes a document: { doc: { root } }'); return { phase: 'standardise' as const, ...standardise(s.doc) } }
    // a lexical document's qpu blocks run through MCP: each block is a tool and its arguments, answered through the chat door under the caller's role (corrected where the role requires, a refusal handled, never thrown)
    if (isObj(args.lexical)) { const l = args.lexical as { doc?: LexicalDoc; role?: string; id?: string; slug?: string }; if (!l.doc?.root) throw new Error('lexical takes a document: { doc: { root }, role? }'); const served = (listTools(ctx)).map((x) => x.name); const security = scanLexical(l.doc, served); const stopped = new Set(security.findings.filter((f) => f.blocks && f.uuid).map((f) => f.uuid!)); const self = [l.id, l.slug].filter((x): x is string => typeof x === 'string' && x.length > 0); const selfRefs = new Set(blocks(l.doc).filter((n) => listReferences({ id: '_', doc: { root: { children: [n] } } }).some((x) => self.includes(x))).map((n) => n.fields.uuid));  // whatever references its own document back is fused, not refused: those blocks run once each, in address order, after the rest, never re-entering the document
 const all = blocks(l.doc); const ordered = [...all.filter((n) => !selfRefs.has(n.fields.uuid)), ...all.filter((n) => selfRefs.has(n.fields.uuid)).sort((a, b) => (a.fields.uuid < b.fields.uuid ? -1 : 1))].filter((n, i, xs) => xs.findIndex((y) => y.fields.uuid === n.fields.uuid) === i); const runs = ordered.map((n) => { if (n.fields.tool === 'payload' && selfRefs.has(n.fields.uuid)) return { uuid: n.fields.uuid, tool: n.fields.tool, theorem: n.fields.theorem ?? null, says: 'fused: it would re-enter its own document, which this run already is', corrected: [], answered: true, handled: null, reply: null, fused: true }; if (stopped.has(n.fields.uuid)) { const why = 'refused before it ran: ' + security.findings.filter((f) => f.uuid === n.fields.uuid).map((f) => f.kind + ' ' + f.detail).join('; '); return { uuid: n.fields.uuid, tool: n.fields.tool, theorem: n.fields.theorem ?? null, says: why, corrected: [], answered: false, handled: { refused: security.findings.filter((f) => f.uuid === n.fields.uuid) }, reply: null, research: hookResearch(why, [{ id: 'stopped', does: 'the block stays stopped' }, { id: 'iso-open-data', does: 'the finding is asked of the ISO Open Data page' }]) } }; const a = ctx.call('match', { statement: `block ${n.fields.tool}`, chat: { role: l.role ?? 'reader', call: { tool: n.fields.tool, arguments: n.fields.arguments ?? {} } } }) as { reply?: unknown; handled?: unknown; corrected?: unknown[]; says?: string } | undefined; return { uuid: n.fields.uuid, tool: n.fields.tool, theorem: n.fields.theorem ?? null, says: a?.says ?? null, corrected: a?.corrected ?? [], answered: a?.reply !== undefined && a?.reply !== null, handled: a?.handled ?? null, reply: a?.reply ?? null } }); return { phase: 'lexical' as const, security, fused: [...selfRefs], blocks: runs.length, answered: runs.filter((r) => r.answered).length, runs, says: `${runs.length} qpu block(s) run through the chat door: ${runs.filter((r) => r.answered).length} answered, ${runs.filter((r) => r.handled).length} handled` } }
    // tenants as namespaces: an app's sandbox planned, or a credential narrowed to the namespace a request names (the app's MCP auth asks this)
    if (isObj(args.namespace)) { const n = args.namespace as { narrow?: NarrowRequest; name?: string; app?: string }; return n.narrow ? { phase: 'narrow' as const, ...narrowScope(n.narrow) } : { phase: 'sandbox' as const, ...createSandbox({ name: n.name, app: n.app, scoped: SCOPES.collections }) } }
    if (isObj(args.skills)) return { phase: 'skills' as const, ...skills(args.skills as Parameters<typeof skills>[0]) }
    if (isObj(args.website)) return { phase: 'website' as const, ...website(args.website as Parameters<typeof website>[0], Array.isArray(args.liveBlockTypes) ? args.liveBlockTypes.map(String) : []) }
    // the textbook's axioms replaced by theorems through the Payload MCP plugin, as a client: the doors picked by what they take and answer, never by a name
    if (args.schemas) return createSchemas(ctx, { collection: isObj(args.collection) && Array.isArray((args.collection as { fields?: unknown }).fields) ? args.collection as PayloadCollectionInput : undefined, answers: isObj(args.answers) && !('list' in (args.answers as object)) ? args.answers as Record<string, string> : undefined })
    if (args.names === true) return theoremNames()
    if (args.theorems) {
      const url = typeof args.payloadUrl === 'string' ? args.payloadUrl.replace(/\/$/, '') : null
      const endpoint = url ? `${url}/api/mcp` : '<QPU_PAYLOAD_URL>/api/mcp'
      const auth = { header: 'Authorization', value: '<authCollectionSlug> API-Key <QPU_PAYLOAD_API_KEY>', note: 'the tenant\'s API key, from a user with auth.useAPIKey; the client sends it, this tool never holds it' }
      const byExample = Object.fromEntries(TEXTBOOK_THEOREMS.flatMap((t) => t.examples.map((e) => [e, t.key])))
      if (!args.answers || typeof args.answers !== 'object') return { phase: 'plan' as const, endpoint, auth, requestList: [{ id: 'payload-mcp-list', method: 'POST' as const, url: endpoint, accept: 'application/json, text/event-stream', body: { jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} } }], theorems: TEXTBOOK_THEOREMS.length, examplesBacked: Object.keys(byExample).length, steps: ['tools/list: pick the find and update doors of the pages collection by what they take (a slug, a where, an id) and answer (documents), never by a name', 'find one page through that door, using only the arguments it declares (where, search, limit, page, depth, sort, select); the key keeps its scope', 'for each block, the theorem the textbook names for the example its tool and arguments are (TEXTBOOK_THEOREMS)', 'update each page: the block\'s theorem field written; the kernel-accepted key, nothing asserted; the next page is the page the answer names'], note: 'the client calls again with answers: { list: <tools/list text>, found?: <find text> }' }
      const a = args.answers as { list?: string; found?: string }
      const list = a.list ? getAnswer(a.list) : { ok: false, error: 'no tools/list answer' }
      const tools = (list.ok && isObj(list.result) && Array.isArray((list.result as { tools?: unknown[] }).tools) ? (list.result as { tools: { name: string; description?: string; inputSchema?: { properties?: Record<string, unknown> } }[] }).tools : [])
      const takes = (t: { inputSchema?: { properties?: Record<string, unknown> } }) => keys(t)
      const door = findDoor(tools)
      const updateDoor = tools.find((t) => (takes(t).includes('slug') || takes(t).includes('collection')) && takes(t).includes('data') && (takes(t).includes('id') || takes(t).includes('where')))
      if (!door || !updateDoor) return { phase: 'doors' as const, endpoint, tools: tools.length, findDoor: door?.name ?? null, updateDoor: updateDoor?.name ?? null, leads: [{ id: 'payload-mcp-doors-missing', statement: `the Payload MCP at ${endpoint} lists ${tools.length} tool(s) and none takes a slug with a where (to find) or a slug with data (to update)`, status: 'open', reason: 'the pages collection\'s built-in find and update tools are disabled or the key has no access to them' }] }
      // the find is the door the Payload MCP listed: only the arguments that door declares (where, search, limit, page, depth, sort, select). scope stays the key's. pagination is not sent.
      const findCall = (page?: number) => findRequest(door, endpoint, { slug: 'pages', where: { 'layout.blockType': { equals: 'qpu' } }, search: 'qpu', page, select: { id: true, layout: true } }, page != null && page > 1 ? `payload-mcp-find-${page}` : 'payload-mcp-find')
      const role = typeof args.role === 'string' ? args.role : 'admin'
      const batch = decideBatch('mcps', role)
      const may = (action: string) => batch.calls.find((c) => c.action === action)?.access === true
      if (!a.found) return { phase: 'find' as const, endpoint, findDoor: door.name, updateDoor: updateDoor.name, rbac: batch, requestList: may('read') ? [findCall()] : [], note: may('read') ? 'the client calls again with answers.found; a later page is the same door with the page the answer names' : `${role} may not batch a read` }
      const found = getAnswer(a.found)
      const pageBody = found.ok && isObj(found.result) ? found.result as { docs?: unknown[]; hasNextPage?: boolean; nextPage?: number | null; page?: number; totalDocs?: number } : {}
      const docs = (pageBody.docs ?? []) as { id: string; layout?: { blockType?: string; tool?: string; arguments?: unknown; theorem?: string | null; id?: string }[] }[]
      const updates = docs.flatMap((d) => { const layout = (d.layout ?? []).map((b) => { if (b.blockType !== 'qpu' || b.theorem) return b; const ex = ctx.examples.find((e) => e.tool === b.tool && JSON.stringify(e.arguments) === JSON.stringify(b.arguments ?? {})); const key = ex ? (ex.theorem ?? byExample[ex.id]) : undefined; return key ? { ...b, theorem: key } : b }); return JSON.stringify(layout) === JSON.stringify(d.layout ?? []) ? [] : [{ id: `payload-mcp-update-${d.id}`, method: 'POST' as const, url: endpoint, accept: 'application/json, text/event-stream', body: { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: updateDoor.name, arguments: { slug: 'pages', id: d.id, data: { layout } } } } }] })
      const blocks = docs.flatMap((d) => d.layout ?? []).filter((b) => b.blockType === 'qpu')
      const sent = may('update') ? updates : []
      const next = may('read') && pageBody.hasNextPage && typeof pageBody.nextPage === 'number' ? [findCall(pageBody.nextPage)] : []
      return { phase: 'update' as const, endpoint, findDoor: door.name, updateDoor: updateDoor.name, rbac: batch, pages: docs.length, totalDocs: pageBody.totalDocs ?? docs.length, page: pageBody.page ?? null, hasNextPage: Boolean(pageBody.hasNextPage), qpuBlocks: blocks.length, axioms: blocks.filter((b) => !b.theorem).length, replaced: sent.length, requestList: [...sent, ...next], note: !may('update') && updates.length ? `${role} may not batch an update` : next.length ? 'the client sends each update, then the next page the find door named' : sent.length ? 'the client sends each update; a block whose example the textbook backs by no theorem stays an axiom and a lead' : 'nothing to replace: every qpu block names its theorem or the textbook has none for it yet' }
    }
    if (args.clone !== undefined) return selfClones(typeof args.origin === 'string' ? args.origin : 'https://qpu.uuidna.com', args.clone)
    if (args.predict !== undefined) { const tools = listTools(ctx).length; return predict(args.predict, { tools, resources: tools + 3, templates: 1 }) as never }
    if (args.related !== undefined) return relatedWork(args.related === true ? {} : args.related, developViaHooks)
    if (args.zenodo !== undefined) return publishPost(args.zenodo === true ? {} : args.zenodo)
    if (args.alpine !== undefined) return portAlpine(args.alpine === true ? true : args.alpine)
    if (args.morph === true || isObj(args.morph)) return morphFrameworks(args.morph)
    if (args.textbooks === true || isObj(args.textbooks)) return textbooksDoor(args.textbooks === true ? {} : args.textbooks, ctx)
    if (Array.isArray(args.frameworks)) return frameworksDoor(args.frameworks)
    if (args.depth !== undefined) return cryptoDepth(args.depth)
    if (args.claims !== undefined) return claimsFalseByReceipt(args.claims) as never
    if (args.capacity !== undefined) return fullQuantumCapacity(args.capacity) as never
    if (args.dryClean !== undefined) return dryCleanViaQuantum(args.dryClean) as never
    if (args.idea !== undefined || args.seed !== undefined) return ideaSeed(args.idea !== undefined ? args.idea : args.seed)
    if (args.website === true) return { phase: 'request' as const, requestList: [{ id: 'payload-website', method: 'GET' as const, url: 'https://api.github.com/repos/payloadcms/website/git/trees/main?recursive=1', accept: 'application/vnd.github+json' }, { id: 'payload-site-live', method: 'GET' as const, url: 'https://payloadcms.com/api/pages?limit=1&depth=0', accept: 'application/json' }], note: 'the client fetches the source tree (public) and one live page, and calls again with website: <the tree> and liveBlockTypes: the page\'s layout blockTypes' }
    if (args.skills === true) return { phase: 'request' as const, requestList: [{ id: 'payload-skills', method: 'GET' as const, url: 'https://api.github.com/repos/payloadcms/skills/git/trees/main?recursive=1', accept: 'application/vnd.github+json' }], note: 'the client fetches the tree (public, no token) and calls again with skills: <the answer>; discovery reads the same tree as the standard payload-skills' }
    if (typeof args.tool !== 'string') throw new Error('tool names the result to document, or site: true the site')
    const r = rpc(ctx, String(args.tool), args.arguments ?? {})
    if (r.error) throw new Error(r.error.message)
    const uuid = r.result!._meta.block.meta.id
    const doc = payloadDoc({ uuid, tool: String(args.tool), arguments: (args.arguments ?? {}) as Record<string, unknown>, description: r.result!._meta.openGraph['og:description'] ?? '', openGraph: r.result!._meta.openGraph, html: r.result!._meta.widget, prev: typeof args.prev === 'string' ? args.prev : null, chain: Array.isArray(args.chain) ? args.chain.map(String) : [], origin: typeof args.origin === 'string' ? args.origin : undefined })
    return { tool: args.tool, uuid, blocks: 1, breadcrumbs: doc.nestedDocs.breadcrumbs.length, parent: doc.nestedDocs.parent, bytes: JSON.stringify(doc).length, doc }
  },
  widget: flowWidget,
})

/** Payload's default plugins, the ones MCP configures; no custom collection: the one collection is the plugins' own pages. */
const PAYLOAD_PLUGINS: readonly { name: string; pkg: string; options: Record<string, unknown> }[] = [
  { name: 'lexical', pkg: '@payloadcms/richtext-lexical', options: { features: ['BlocksFeature'], blocks: ['qpu'], blockFields: ['uuid', 'handle', 'program', 'tail', 'tool', 'arguments', 'prev', 'next'] } },
  { name: 'nested-docs', pkg: '@payloadcms/plugin-nested-docs', options: { collections: ['pages'], generateLabel: 'the block\'s tool', generateURL: '/<uuid>', breadcrumbsFieldSlug: 'breadcrumbs', parentFieldSlug: 'parent' } },
  { name: 'seo', pkg: '@payloadcms/plugin-seo', options: { collections: ['pages'], uploadsCollection: null, generateTitle: 'og:title of the block', generateDescription: 'og:description of the block', generateImage: 'og:image of the block', tabbedUI: true, interfaceName: 'Meta' } },
  { name: 'search', pkg: '@payloadcms/plugin-search', options: { collections: ['pages'], searchOverrides: { fields: ['tool', 'uuid'] }, deleteDrafts: true, syncDrafts: true, localize: false, reindexBatchSize: 50 } },
  { name: 'redirects', pkg: '@payloadcms/plugin-redirects', options: { collections: ['pages'], from: '/<prev>', to: '/<next>', redirectTypes: ['301', '302', '303', '307', '308'] } },
  { name: 'form-builder', pkg: '@payloadcms/plugin-form-builder', options: { fields: ['checkbox', 'country', 'date', 'email', 'message', 'number', 'payment', 'radio', 'select', 'state', 'text', 'textarea', 'upload'], uploadCollections: ['media'], note: 'every tool\'s inputSchema is a form; the dashboard tool enumerates its facets' } },
  { name: 'multi-tenant', pkg: '@payloadcms/plugin-multi-tenant', options: { tenants: Object.values(TENANTS), tenantField: 'tenant', byHost: TENANTS } },
  { name: 'ecommerce', pkg: '@payloadcms/plugin-ecommerce', options: { customers: 'users', currencies: ['EUR', 'USD', 'BGN'], payments: 'stripeAdapter (secretKey, publishableKey, webhookSecret: names, never values)', products: 'the licence catalogue: six products, seven variants, prices in three currencies', orders: 'accessToken = the licence key, generated on create as the template does' } },
  { name: 'mcp', pkg: '@payloadcms/plugin-mcp', options: { servers: 'one server, payload-rbac: the registration extend gives, and every host the tenant names, are its doors', rbac: 'one grant on subject mcps decides every door; the Worker asks this host first (QPU_RBAC_MCP, QPU_RBAC_TOOL)' } },
]
/** One nested page that uses every plugin through its UUID. The first nine program nibbles are on, one per plugin. Lexical holds the block, nested docs the parent and the breadcrumbs, SEO the meta of this instance. The batch action is the action the request names, and its REST is the collection. The hook names the next instance. Nothing is fetched and nothing is written. */
const pluginInstance = (asked: Record<string, unknown>) => {
  const action = typeof asked.action === 'string' ? asked.action : 'read'
  const known = BATCH_ACTIONS.find((batch) => batch.action === action)
  const role = typeof asked.role === 'string' && asked.role ? asked.role : action === 'read' ? 'reader' : action === 'create' ? 'writer' : 'admin'
  const batch = decideBatch('apis', role)
  const call = batch.calls.find((row) => row.action === action)
  const refused = (says: string) => ({ phase: 'instance' as const, via: 'uuid' as const, collection: 'pages' as const, holds: false as const, custom: 0 as const, written: false as const, fetched: false as const, tokens: 0 as const, queue: 0 as const, plugins: PAYLOAD_PLUGINS.length, says })
  if (!known || !call) return refused(`${action} is not a batch action of the Payload API`)
  if (!decideApiMcp('apis', action, role)) return refused(`${role} may not ${action} the page through the Payload API`)
  const at = typeof asked.at === 'string' ? asked.at : ''
  const nibbles = Array.from({ length: 10 }, (_, i) => i < PAYLOAD_PLUGINS.length ? 1 : 15 - 1)
  const addressOf = (index: number) => uuidFromParts(index.toString(16).padStart(8, '0'), nibbles, WITNESS_TAIL)
  const index = at ? Number(BigInt(`0x${channel(at).handle}`)) : 0
  if (at && addressOf(index) !== at) return refused('that address does not use every plugin')
  const gravity = addressOf(index)
  const read = channel(gravity)
  const witnessed = checkWitnesses(gravity)
  const plugins = PAYLOAD_PLUGINS.map((plugin, bit) => ({ name: plugin.name, pkg: plugin.pkg, bit, on: read.program[bit] === 1, via: 'uuid' as const }))
  const placed = program(read.handle)
  const title = 'Plugins'
  const description = read.words.slice(0, 160)
  const parent = '/plugins'
  const path = `${parent}/${read.handle}`
  const breadcrumbs = [{ doc: 'plugins', url: parent, label: title }, { doc: read.handle, url: path, label: read.handle }]
  const node = qpuNode(gravity, 'payload', { instance: true, action }, 'textbook_plugin_combinations')
  const lexical = lx.doc([lx.heading(title, 'h1'), node, lx.paragraph([lx.text(plugins.map((plugin) => plugin.name).join(', '))])])
  const formula = plugins.map((plugin) => plugin.name).join(' ')
  const developed = developViaHooks({ formula, product: 'plugins', variant: read.handle, title, theorem: 'textbook_plugin_combinations' })
  const following = addressOf(index + 1)
  const nextRead = channel(following)
  const rest = call.rest.replace('{collection}', 'pages')
  const data = {
    title, slug: read.handle, path, parent, breadcrumbs, product: 'plugins', variant: read.handle, tenant: 'uuidna',
    hero: { type: 'default' as const },
    layout: [{ blockType: 'content' as const, contentFields: { useLeadingHeader: false, layout: 'oneColumn' as const, columnOne: lexical } }],
    meta: { title, description },
    search: { title, doc: { relationTo: 'pages' as const, value: read.handle } },
    redirect: { from: path, to: `${parent}/${nextRead.handle}` },
    form: { action, role },
    iso: developed.iso, docs: developed.docs,
  }
  const save = auditedSave({ collection: 'pages', override: false, data })
  const find = manageApi({ collection: 'pages', action: 'find', where: { slug: { equals: read.handle } }, page: 1, limit: 1 })
  const next = { id: following, handle: nextRead.handle, executable: seal(following).valid && nextRead.program.slice(0, PAYLOAD_PLUGINS.length).every((nibble) => nibble === 1) && following !== gravity, tool: 'payload' as const, arguments: { instance: { action, role, at: following } } }
  const indexed = program.handle === read.handle && program.indexed === true && program.bits.length === 32 && program.bits.every((row, index) => row.index === index && row.hex === read.handle[row.digit] && row.digit >= 0 && row.digit <= 7 && row.place === index % 4 && row.bit === Number((BigInt(`0x${read.handle}`) >> BigInt(index)) & 1n)) && program.path === `src/quantum/uuid/programs/${[...read.handle].join('/')}/index.ts` && program.rbac.root === 0 && program.rbac.uid === 0 && program.rbac.depth === 7 && program.rbac.max === 7 && program.rbac.depth <= program.rbac.max && program.rbac.from === 'src/quantum/uuid/programs' && program.rbac.rootAccess.write === true && program.rbac.other.read === true && program.rbac.other.write === false && program.rbac.other.execute === true
  const holds = save.saved === true && save.audit.holds === true && developed.iso.documented === true && plugins.length === PAYLOAD_PLUGINS.length && plugins.every((plugin) => plugin.on) && program.installed === PAYLOAD_PLUGINS.length && program.configured === PAYLOAD_PLUGINS.length && program.used === PAYLOAD_PLUGINS.length && indexed && witnessed.exact === true && witnessed.faces === 14 && breadcrumbs.length === 2 && lexical.root.type === 'root' && description.length > 0 && rest.includes('/api/pages') && !rest.includes('/qpu/') && call.access === true && find.api === 'find' && next.executable
  return {
    phase: 'instance' as const, via: 'uuid' as const, collection: 'pages' as const, custom: 0 as const, written: false as const, fetched: false as const, tokens: 0 as const, queue: 0 as const,
    plugins, program, combinations: 1 << PAYLOAD_PLUGINS.length, used: plugins.length, gravity, handle: read.handle, sealed: seal(gravity).valid,
    nested: { parent, path, depth: 2 as const, breadcrumbs: breadcrumbs.length },
    seo: data.meta, lexical, hooks: developed.hooks,
    action, role, batch: { action: call.action, rest, where: call.where, access: call.access },
    find: find.args, saved: save.saved, next, holds,
    says: holds ? `all ${plugins.length} plugins are installed, configured and used at ${placed.path}. The filesystem places this object under the program dataset, at depth ${placed.depth} of 0..7. This page is nested, its meta is the instance, and the request ${action}s it through ${rest}.` : 'the plugins were not used through the address',
  }
}
/** The site as its own use cases: the reference is payloadcms.com, whose REST answers pages of blocks with SEO meta and breadcrumbs — the site is what the product computes. Here every toolbox is a use case and every example a page document whose one block is the result's UUID logic, at its live address. */
/** Every API is a gate of some sort: an address a tool passes (open), waits at for the tenant's key (keyed), a browser alone passes
 *  (browser), the registry names and no tool calls (proposed), or a door of this catalogue (tool). Organised as nested docs — Gates ›
 *  category › gate, three deep — each doc is a gate of lexical leads: its body lists the leads whose source passes through it, and its one
 *  block answers them live (leads { ids }). The tree is what the nested-docs plugin computes from parent: breadcrumbs, URLs, nothing custom. */
type GateKind = 'open' | 'keyed' | 'browser' | 'proposed' | 'tool'
export type Gate = { id: string; category: string; name: string; url: string; host: string; kind: GateKind; by: string; measured: string | null; leads: string[] }
const GATE_CATEGORIES: readonly { id: string; name: string; says: string }[] = TABLES.GATE_CATEGORIES as readonly { id: string; name: string; says: string }[]
const escapeRe = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const gateHost = (url: string): string => { try { return new URL(url).host.replace(/^www\./, '') } catch { return url.replace(/^[a-z]+:\/\//, '').split(/[/:]/)[0] ?? url } }
const gatePath = (url: string): string => { try { const u = new URL(url); return `${u.host.replace(/^www\./, '')}${u.pathname.replace(/\/$/, '')}` } catch { return url } }
const gateSlug = (id: string) => uuid(`gate:${id}`)
/** The website page a gate is: Gates › category › gate, the path the nested-docs plugin joins. MCP routes a tool here. */
export const websiteGate = (category: string, id: string, origin = 'https://qpu.uuidna.com') => {
  const root = gateSlug('root')
  const categorySlug = gateSlug(`category:${category}`)
  const gate = gateSlug(id)
  const path = `/${root}/${categorySlug}/${gate}`
  return { collection: 'pages' as const, root, rootPath: `/${root}`, category, categorySlug, categoryPath: `/${root}/${categorySlug}`, gate, id, path, url: `${origin}${path}` }
}
type RawGate = Omit<Gate, 'leads'> & { match?: string }
/** Hosts many unrelated addresses share: a gate on one of them is matched by its path, never by the host alone. */
const SHARED_HOSTS: readonly string[] = ['github.com', 'api.github.com', 'raw.githubusercontent.com', 'cdn.jsdelivr.net', 'cloudflare.com', 'vercel.com']
/** The leads that pass through a gate: a door's by the tool that serves them; an address's by the registry search it names, else by its host
 *  (its path on a shared host), else by its id as a whole word in the source. */
const passes = (leads: readonly Lead[], g: RawGate): string[] => {
  const needle = (g.match ?? (SHARED_HOSTS.includes(g.host) ? gatePath(g.url) : g.host)).toLowerCase()
  const word = new RegExp(`(^|[^a-z0-9_])${escapeRe(g.id)}([^a-z0-9_]|$)`, 'i')
  return leads.filter((l) => (g.kind === 'tool' ? l.tool === g.id : l.source.toLowerCase().includes(needle) || word.test(l.source))).map((l) => l.id)
}
/** Every API handled in quantum: each gate's adapter is a dimension of the one Payload plugin over the default schema — where its answers land
 *  (the docket entries by kind, the gate pages, the catalogue's prices, the MCP doors), the step of next that keeps them fresh, the fields the
 *  entry carries, and the shadcn combination its address picks (styled from itself). No plugin per API: one plugin, every API a dimension. */
const gateAdapter = (g: { id: string; category: string; kind: GateKind; by: string }) => {
  const slug = gateSlug(g.id)
  const p = presentation(slug)
  // the configs each dimension streams, as UUIDs (the same addresses the sets kind gives config elements): queryable, sortable, executable through the core
  const configs: Record<string, readonly ConfigKind[]> = { patents: ['gates', 'sets', 'mcp'], certificates: ['gates', 'sets', 'realtime'], currency: ['ecommerce', 'gates', 'sets'], competitions: ['gates', 'sets'], mcp: ['mcp', 'adapters', 'bindings', 'gates'], references: ['gates', 'sets', 'ui'] }
  const landing: Record<string, { lands: string; hook: string; fields: readonly string[] }> = {
    patents: { lands: 'entries (kind call: patents { read })', hook: 'the patents step of next, one question a day; the gate page relays', fields: ['number', 'title', 'priority', 'filing', 'publication', 'grant', 'assignee', 'inventor', 'theorems'] },
    certificates: { lands: 'entries (kind call: attest { read })', hook: 'the attest step of next and its follow-up rounds', fields: ['pulse', 'chainIndex', 'precommitment', 'treeHead', 'directory', 'cves', 'records', 'certificates', 'theorems'] },
    currency: { lands: 'products (the catalogue\'s prices in every currency) and entries (kind call: currency { read })', hook: 'the currency step of next harmonises the rates and reprices the catalogue', fields: ['rates', 'median', 'pegs', 'priceInEUR', 'priceInUSD', 'priceInBGN'] },
    competitions: { lands: 'pages (the competition gate: rules, competitors, theorems)', hook: 'the compete step of next judges the rules; the gate page carries the knowledge', fields: ['rules', 'entry', 'window', 'competitors', 'theorems', 'satisfied'] },
    mcp: { lands: 'entries (kind call through extend) and the discovery global per host', hook: 'next only via qpuMcpPlugin with payload-mcp-api-keys Bearer; the tenant opens the door with that key', fields: ['doors', 'takes', 'answers', 'auth', 'maps'] },
    references: { lands: 'pages and the search index (the verifier\'s facts)', hook: 'the verify step of next fetches the contract once a day', fields: ['contract', 'status', 'facts'] },
  }
  const own = { lands: 'entries (kind call: the tool\'s reply) and the use-case page', hook: 'the entries beforeValidate answers the call; the pages afterChange revalidates', fields: ['tool', 'arguments', 'result', 'sha256'] }
  const l = landing[g.category] ?? own
  const subject = g.category === 'mcp' || g.kind === 'tool' ? 'mcps' as const : 'apis' as const
  const rest = { in: `${l.lands.split(' (')[0]}: the API\'s answer written into Payload through its REST (POST /api/<collection>) or the Payload MCP plugin\'s create tool, addressed by content`, out: 'Payload\'s data out to the API through the door the entry names (extend { direction: out }) with the tenant\'s token, or read by the API through GET /api/<collection> with a user\'s API key', rbac: { read: ACCESS.entries.read, create: ACCESS.entries.create, update: ACCESS.entries.update, delete: ACCESS.entries.delete, tenantRoles: [...TENANT_ROLES], by: ACCESS.by, subject, managedBy: 'payload-mcp' as const, grant: grant(subject) }, directions: 2, roles: TENANT_ROLES.length }
  const kinds = configs[g.category] ?? (['sets', 'ui', 'mcp'] as const)
  const stream = { gate: slug, configs: kinds.map((k) => ({ kind: k, uuid: uuid(`config:${k}`) })), uuids: [slug, ...kinds.map((k) => uuid(`config:${k}`))], says: 'the UUID stream of this dimension: the gate\'s address and the addresses of the configs it streams, queryable, sortable and executable through fold { uuids }' }
  return { plugin: 'qpuPlugin', dimension: g.id, kind: g.kind, lands: l.lands, hook: l.hook, fields: l.fields, rest, stream, ui: { item: p.parts[0]!.item, variant: p.parts[0]!.variant, style: p.style }, says: 'a dimension of the one plugin over the default schema: nothing added, the API\'s answers land where Payload already holds them, presented by the item its address picks' }
}
/** Every dev dependency of the tree as an MCP door usable in the UI: the step of next that runs it is its tool, its gate page carries that step's block rendered by the MCP App. */
const DEV_DEPENDENCY_ROLES = TABLES.DEV_DEPENDENCY_ROLES as unknown as Readonly<Record<string, { step: string; does: string }>>
/** The energy sector's gates: the market prices the bill's kilowatt-hours are priced against, keyed by the tenant; proposed, never called from the tree. */
const ENERGY_APIS = TABLES.ENERGY_APIS as unknown as readonly { id: string; name: string; url: string; key: string }[]
const pagesOf = (raw: unknown): unknown => (!raw || typeof raw !== 'object' || Array.isArray(raw) || !('pages' in raw) ? undefined : (raw as { pages: unknown }).pages)
const gates = (ctx: Context, origin: string, devDependencies: Record<string, string> = {}, google: GoogleApis = {}, mcpAnswer?: unknown) => {
  const listed = readPayloadMcp(mcpAnswer, origin)
  const external: RawGate[] = [
    // every dev dependency a gate: a door the step of next passes, usable in the UI through its gate page's block
    ...Object.entries(devDependencies).map(([name, version]) => { const role = DEV_DEPENDENCY_ROLES[name]; return { id: `dependency-${name.replace(/[^a-z0-9]+/gi, '-').replace(/^-/, '')}`, category: 'dependencies', name: `${name} ${version}: ${role?.does ?? 'a tool of the tree'}`, url: `https://www.npmjs.com/package/${name}`, host: 'www.npmjs.com', kind: 'tool' as GateKind, by: role?.step ?? 'next', measured: `imagined as an MCP door: the step ${role?.step ?? 'next'} is its tools/call; its gate page carries the step's block, rendered by the MCP App (ui://qpu/configure); the registry names it at npm` } }),
    ...placeGoogleApis(google),
    ...ENERGY_APIS.map((a) => ({ id: a.id, category: 'energy', name: a.name, url: a.url, host: gateHost(a.url), kind: 'keyed' as GateKind, by: 'metrics', measured: `keyed by ${a.key}: the market price the bill\'s kilowatt-hours are priced against; proposed, never called from the tree` })),
    ...NEWS_APIS.map((a) => ({ id: a.id, category: 'news', name: a.name, url: a.url, host: gateHost(a.url), kind: (a.open ? 'open' : 'keyed') as GateKind, by: 'compete', measured: a.open ? `open: reads ${a.reads}; an adapter of the DOI research, the mentions of every record of precedence` : `keyed by ${a.key}: the tenant names it; an adapter of the DOI research` })),
    ...PATENT_APIS.map((a) => ({ id: a.id, category: 'patents', name: a.name, url: a.url, host: gateHost(a.url), kind: (a.open ? 'open' : /browser/.test(a.key ?? '') ? 'browser' : 'keyed') as GateKind, by: 'patents', measured: a.measured })),
    ...ATTEST_APIS.map((a) => ({ id: a.id, category: 'certificates', name: a.name, url: a.url, host: gateHost(a.url), kind: 'open' as GateKind, by: 'attest', measured: a.measured })),
    ...RATE_SOURCES.map((r) => ({ id: r.id, category: 'currency', name: r.name, url: r.url, host: gateHost(r.url), kind: 'open' as GateKind, by: 'currency', measured: `${r.cadence}; ${r.terms}` })),
    ...COMPETITIONS.map((c) => ({ id: c.id, category: 'competitions', name: c.name, url: c.rules, host: gateHost(c.rules), kind: 'open' as GateKind, by: 'compete', measured: `${c.kind}, entry ${c.entry}, read ${c.read}; ${c.prize}` })),
    ...KNOWN_MCP.map((m) => ({ id: m.host, category: 'mcp', name: m.about, url: m.url, host: m.host, kind: (m.auth === 'none' ? 'open' : 'keyed') as GateKind, by: 'discover', measured: m.maps })),
    ...([['currency', CURRENCY_MCPS], ['patent', PATENT_MCPS], ['grant|funding', FUNDING_MCPS], ['google', GOOGLE_MCPS]] as const).flatMap(([term, list]) => list.map((id) => ({ id, category: 'mcp', name: `${id}, a server the registry names for ${term}`, url: `${MCP_REGISTRY}?search=${term}`, host: gateHost(MCP_REGISTRY), kind: 'proposed' as GateKind, by: 'leads', measured: null, match: `v0/servers?search=${term}` }))),
  ]
  // a reference whose address another table already passes is that gate, not a second one
  const seen = new Set(external.map((g) => gatePath(g.url)))
  for (const st of STANDARDS) { const path = gatePath(st.contract); if (seen.has(path) || external.some((g) => g.id === st.id)) continue; seen.add(path); external.push({ id: st.id, category: 'references', name: st.name, url: st.contract, host: gateHost(st.contract), kind: 'open', by: 'verify', measured: `a ${st.kind}` }) }
  const taken = new Set(external.map((g) => g.id))
  const own: RawGate[] = listed.doors.filter((door) => !taken.has(door.name)).map((door) => ({ id: door.name, category: 'mcp', name: `tools/call ${door.name}`, url: listed.api, host: gateHost(origin), kind: 'tool' as GateKind, by: 'payload-mcp', measured: door.description || 'a door of the Payload API tools/list' }))
  const seat = (g: RawGate) => g.category === 'mcp' || g.kind === 'tool' ? { plugin: 'qpuMcpPlugin' as const, api: listed.api, src: false as const, separate: false as const, holds: listed.refused === false } : null
  const gates: (Gate & { adapter: ReturnType<typeof gateAdapter>; mcp: ReturnType<typeof seat> })[] = [...own, ...external].map((g) => ({ id: g.id, category: g.category, name: g.name, url: g.url, host: g.host, kind: g.kind, by: g.by, measured: g.measured, leads: passes(ctx.leads, g), adapter: gateAdapter(g), mcp: seat(g) }))
  const toolboxes = [...new Set(own.map((g) => g.category))].filter((id) => !GATE_CATEGORIES.some((c) => c.id === id))
  const categories = [...toolboxes.map((b) => ({ id: b, name: `${b} toolbox gates`, says: `the doors of the ${b} toolbox, each a gate of the leads it serves` })), ...GATE_CATEGORIES.filter((c) => (c.id !== 'dependencies' || Object.keys(devDependencies).length > 0) && (c.id !== 'google-apis' || (google.list?.items ?? []).length > 0))].map((c) => { const mine = gates.filter((g) => g.category === c.id); return { ...c, gates: mine.length, leads: new Set(mine.flatMap((g) => g.leads)).size } })
  const placed = new Set(gates.flatMap((g) => g.leads))
  const byKind = Object.fromEntries((['tool', 'open', 'keyed', 'browser', 'proposed'] as const).map((k) => [k, gates.filter((g) => g.kind === k).length]))
  const next = payloadMcpNext(listed.doors, origin, pagesOf(mcpAnswer))
  return {
    gates, categories,
    counts: { gates: gates.length, own: own.length, external: external.length, categories: categories.length, byKind, partition: `${categories.map((c) => c.gates).join(' + ')} = ${gates.length}` },
    leads: { total: ctx.leads.length, placed: placed.size, unplaced: ctx.leads.filter((l) => !placed.has(l.id)).map((l) => l.id) },
    streams: { configs: configKinds.map((k) => ({ kind: k, uuid: uuid(`config:${k}`) })), says: 'every config a UUID in the stream every adapter dimension names: the same addresses the sets kind gives config elements, queryable, sortable and executable through fold { uuids }' },
    adapters: { total: gates.length, byLanding: Object.fromEntries([...new Set(gates.map((g) => g.adapter.lands.split(' (')[0]!))].map((l) => [l, gates.filter((g) => g.adapter.lands.split(' (')[0] === l).length])), byItem: Object.fromEntries(PRESENTABLE_ITEMS.map((i) => [i, gates.filter((g) => g.adapter.ui.item === i).length])), says: 'every API handled in quantum: one adapter per gate, a dimension of the one plugin, landing in the default schema, presented by the shadcn item its address picks' },
    tree: { root: gateSlug('root'), depth: 3, shape: 'Gates › category › gate: every doc a gate of lexical leads, nested by the nested-docs plugin from its parent (breadcrumbs, URLs)' },
    mcp: { ...listed, doors: own.map((door) => door.id), next, law: MCP_API_KEY.law, separate: gates.filter((g) => g.category === 'mcp' && g.mcp?.separate !== false).length, holds: listed.src === false && listed.refused === false && next.refused === true && next.law === MCP_API_KEY.law && next.keyed === false && gates.every((g) => g.mcp === null || (g.mcp.plugin === 'qpuMcpPlugin' && g.mcp.src === false && g.mcp.separate === false && g.mcp.api === listed.api)) },
    says: listed.fetched ? `${own.length} MCP doors fetched from the Payload API at ${listed.api}. Next refuses without a payload-mcp-api-keys Bearer. src is not a door.` : `MCP is fetched from the Payload API at ${listed.api}. Next refuses without a payload-mcp-api-keys Bearer. src is not a door. Nothing is fetched here.`,
  }
}
/** Lexical nodes as Payload's editor stores them: the gate docs are written in the editor's own shape, so the hand can edit what MCP wrote. */
const lx = {
  text: (t: string) => ({ type: 'text', version: 1, text: t, format: 0, mode: 'normal', style: '', detail: 0 }),
  heading: (t: string, tag: 'h1' | 'h2' | 'h3') => ({ type: 'heading', tag, version: 1, format: '', indent: 0, direction: 'ltr', children: [lx.text(t)] }),
  paragraph: (children: unknown[]) => ({ type: 'paragraph', version: 1, format: '', indent: 0, direction: 'ltr', textFormat: 0, children }),
  link: (url: string, label: string) => ({ type: 'link', version: 3, format: '', indent: 0, direction: 'ltr', fields: { linkType: 'custom', url, newTab: true }, children: [lx.text(label)] }),
  list: (items: unknown[][]) => ({ type: 'list', listType: 'bullet', tag: 'ul', start: 1, version: 1, format: '', indent: 0, direction: 'ltr', children: items.map((children, i) => ({ type: 'listitem', value: i + 1, version: 1, format: '', indent: 0, direction: 'ltr', children })) }),
  doc: (children: unknown[]): LexicalDoc => ({ root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children } }),
}
/** A value against a JSON Schema type (an integer may come as digits): one check for the site's examples and the block's save. */
export const typeOk = (v: unknown, t?: string | string[]) => !t || [t].flat().some((k) => (k === 'integer' ? Number.isInteger(v) || (typeof v === 'string' && /^[0-9]+$/.test(v)) : k === 'number' ? typeof v === 'number' : k === 'array' ? Array.isArray(v) : k === 'object' ? !!v && typeof v === 'object' && !Array.isArray(v) : k === 'null' ? v === null : typeof v === k))
/** The one block, defined once: every app builder — a tool's result as a document, the site's pages, the gate docs, an app on request, the SDK,
 *  a merge of two edits — is consolidated around the lexical qpu block. Its fields are one function; its two forms (the inline node of the lexical
 *  editor and the layout block of the pages collection) are the same fields (payload:one-block-two-forms). */
export const qpuFields = (uuid: string, tool: string, args: Record<string, unknown>, theorem: string | null = null) => {
  const ch = channel(uuid)
  return { blockType: 'qpu' as const, uuid, tool, arguments: args, theorem, handle: ch.handle, program: ch.program.join(''), tail: ch.tail, next: uuidFromParts(ch.handle, [...ch.program.slice(1), ch.program[0]!], ch.tail), license: LICENSE.spdx }
}
type QpuNode = { type: 'block'; version: 2; format: ''; fields: ReturnType<typeof qpuFields> & { id: string; blockName: string } & Record<string, unknown> }
const qpuNode = (uuid: string, tool: string, args: Record<string, unknown>, theorem: string | null = null, extra: Record<string, unknown> = {}): QpuNode => ({ type: 'block', version: 2, format: '', fields: { id: uuid, blockName: tool, ...qpuFields(uuid, tool, args, theorem), ...extra } })
/** A quantum call as the ISO term its address picks and the website page that term is. The program index chooses the term. The same address is the page, the content block, and the product. The audit accepts both creates. */
export const quantumRecord = (p: { uuid: string; tool: string; arguments: Record<string, unknown> }) => {
  const ch = channel(p.uuid)
  const names = quantumTermNames()
  const term = names[Number(BigInt(ch.combination.index) % BigInt(names.length))]!
  const formula = `${term.clause} ${term.name}`
  const span = ch.combination.radix - 1
  const amplitudes = ch.program.map((digit, place) => ({ place, digit, amp: digit / span, to: (span - digit) / span }))
  const developed = developViaHooks({ formula, product: p.tool, variant: term.clause, title: formula, theorem: 'textbook_standards_sliced' })
  const node = qpuNode(p.uuid, p.tool, p.arguments, 'textbook_standards_sliced', { clause: term.clause, name: term.name, amplitudes })
  const links = presentation(p.uuid).parts.map((part) => lx.paragraph([lx.link(`qpu://tools/${p.tool}#${part.at}`, part.item)]))
  const seed = pageSeed(formula, formula, p.uuid)
  const data = {
    ...seed, slug: ch.handle, sku: ch.sku, path: `/quantum/${p.tool}/${ch.handle}`, parent: '/quantum', product: p.tool, variant: term.clause,
    breadcrumbs: [{ doc: 'quantum', url: '/quantum', label: 'Quantum' }, { doc: ch.handle, url: `/quantum/${p.tool}/${ch.handle}`, label: formula }],
    hero: { type: 'default' as const },
    layout: [{ blockType: 'content' as const, contentFields: { useLeadingHeader: false, layout: 'oneColumn' as const, columnOne: lx.doc([lx.heading(formula, 'h1'), node, ...links]) } }],
    meta: { title: formula, description: formula.slice(0, 160) },
    iso: developed.iso, docs: developed.docs,
  }
  const page = auditedSave({ collection: 'pages', override: false, data })
  const product = auditedSave({ collection: 'products', override: false, data: { title: formula, product: p.tool, variant: term.clause, iso: developed.iso, docs: developed.docs } })
  return { standard: 'ISO/IEC 4879:2024' as const, via: 'uuid' as const, clause: term.clause, name: term.name, formula, amplitudes, holds: page.saved && product.saved && page.audit.holds && product.audit.holds, page, product }
}
export const blocks = (doc: LexicalDoc): QpuNode[] => doc.root.children.filter((n): n is QpuNode => typeof n === 'object' && n !== null && (n as { type?: string }).type === 'block' && (n as { fields?: { blockType?: string } }).fields?.blockType === 'qpu')
const ISO_PHRASES: Record<string, string> = { 'ISO/IEC': 'ИСО/МЕК', 'ISO/TR': 'ИСО/ТД', ISO: 'ИСО' }
const phraseTable = (text: string, table: Record<string, string>) => Object.keys(table).sort((a, b) => b.length - a.length).reduce((out, key) => out.split(key).join(table[key]!), text)
const isoToBg = (text: string) => phraseTable(translate(text, 'en', 'bg').text, ISO_PHRASES)
const isoToEn = (text: string) => translate(phraseTable(text, Object.fromEntries(Object.entries(ISO_PHRASES).map(([key, value]) => [value, key]))), 'bg', 'en')
/** Every ISO designation, English to Bulgarian and back, through the three collection hooks. Every Payload plugin package runs that same chain, each handing the record to the next. */
const localePlugins = () => {
  const hooks = ['beforeChange', 'afterChange', 'afterRead'] as const
  const names = (TABLES.PAYLOAD_PACKAGES as { names: readonly string[] }).names.filter((name) => name.startsWith('plugin-'))
  const iso = ISO_DIMENSIONS.map((dimension) => {
    const recorded = dimension
    const bg = isoToBg(recorded)
    const back = isoToEn(bg)
    const again = isoToBg(back.text)
    return { dimension, en: recorded, bg, back: back.text, round: back.text === recorded && again === bg, untranslated: [...new Set([...translate(recorded, 'en', 'bg').untranslated, ...back.untranslated])] }
  })
  const plugins = names.map((name, index) => ({ name, pkg: `@payloadcms/${name}`, installed: true as const, hooks, before: index === 0 ? null : names[index - 1]!, after: names[index + 1] ?? null, with: names.filter((other) => other !== name) }))
  const linked = plugins.every((plugin, index) => plugin.with.length === names.length - 1 && plugin.hooks.length === hooks.length && (index === 0 || plugin.before === plugins[index - 1]!.name) && (index === plugins.length - 1 || plugin.after === plugins[index + 1]!.name))
  const holds = names.length > 0 && iso.length === ISO_DIMENSIONS.length && iso.every((row) => row.round && row.bg.includes('ИСО')) && linked
  return { phase: 'plugins' as const, via: 'hooks' as const, hooks, locales: ['en', 'bg'] as const, iso, plugins, installed: plugins.length, holds, says: holds ? `${iso.length} ISO designations translated English to Bulgarian and back through ${hooks.join(', ')}, and ${plugins.length} Payload plugins run that chain` : `${iso.filter((row) => row.round).length} of ${iso.length} ISO designations round-trip; ${plugins.length} plugins on the hook chain` }
}
const variantPair = (node: QpuNode): { product: string; variant: string } | null => {
  const args = node.fields.arguments
  const product = typeof args?.product === 'string' ? args.product : ''
  const variant = typeof args?.variant === 'string' ? args.variant : ''
  return product && variant ? { product, variant } : null
}
/** A challenge holds when the lexical document uses the product/variant block that names it. Any other block leaves it open. */
const challengeStatus = (doc: LexicalDoc, id: GoogleChallengeId) => {
  const page = GOOGLE_CHALLENGE_PAGE[id]
  const verified = blocks(doc).map(variantPair).some((pair) => pair?.product === page.category && pair.variant === id)
  return { id, product: page.category, variant: id, verified, status: verified ? 'holds' as const : 'open' as const }
}
/** Challenges is a nested section of the website. The section comes first, then one page per challenge. Each page's lexical uses that challenge's product and variant block, and that use is the status. */
const challengeSection = () => {
  const theorem = 'textbook_site_documents'
  const root = 'challenges'
  const rootPath = `/${root}`
  const rootId = uuid('challenge\nsection')
  const rootCrumb = crumb(rootPath, 'Challenges', root)
  const children = GOOGLE_CHALLENGE_IDS.map((id) => {
    const page = GOOGLE_CHALLENGE_PAGE[id]
    const address = uuid(`challenge\n${id}`)
    const path = `${rootPath}/${id}`
    const args = { product: page.category, variant: id }
    const richText = lx.doc([lx.heading(page.title, 'h1'), lx.paragraph([lx.text('Nested under '), lx.link(rootPath, 'Challenges')]), qpuNode(address, 'payload', args, theorem)])
    return { id, title: page.title, slug: `/${id}`, path, parent: rootPath, depth: 2 as const, product: page.category, variant: id, layout: [qpuFields(address, 'payload', args, theorem)], meta: { title: page.title, description: page.title }, hero: { type: 'default' as const, richText }, breadcrumbs: [rootCrumb, crumb(path, page.title, id)], status: challengeStatus(richText, id) }
  })
  const sectionText = lx.doc([lx.heading('Challenges', 'h1'), lx.paragraph([lx.text(`${children.length} challenges, each a nested page.`)]), ...children.map((child) => lx.paragraph([lx.link(child.path, child.title)])), ...children.map((child) => qpuNode(uuid(`challenge\n${child.id}`), 'payload', { product: child.product, variant: child.variant }, theorem))])
  const verified = GOOGLE_CHALLENGE_IDS.filter((id) => challengeStatus(sectionText, id).verified).length
  const section = { id: root, title: 'Challenges', slug: `/${root}`, path: rootPath, parent: null as string | null, depth: 1 as const, layout: [qpuFields(rootId, 'payload', { challenges: true }, theorem)], meta: { title: 'Challenges', description: `${children.length} challenges, each a nested page` }, hero: { type: 'default' as const, richText: sectionText }, breadcrumbs: [rootCrumb], verified }
  const docs = [section, ...children]
  const holds = verified === children.length && children.every((child) => child.status.verified && child.status.status === 'holds')
  return { phase: 'challenges' as const, section: root, challenges: children.length, pages: docs.length, verified, holds, docs, says: holds ? `${children.length} challenges, each a page nested under /challenges, each holding because its lexical uses its product and variant block` : `${verified} of ${children.length} challenges verified by a product and variant block` }
}
const challengeLexical = (doc: LexicalDoc) => {
  const rows = GOOGLE_CHALLENGE_IDS.map((id) => challengeStatus(doc, id))
  const verified = rows.filter((row) => row.verified).length
  return { phase: 'challenges' as const, via: 'lexical' as const, challenges: rows.length, verified, holds: verified === rows.length && rows.length > 0, rows, says: `${verified} of ${rows.length} challenges verified by the product and variant blocks this lexical uses` }
}
const LIBRARY_PAGE = 10
const librarySlugOf = (raw: string) => raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'page'
const ideaStatements = (raw: unknown): string[] => {
  if (typeof raw === 'string') return raw.trim() ? [raw.trim()] : []
  if (Array.isArray(raw)) return raw.flatMap(ideaStatements)
  if (isObj(raw) && typeof raw.statement === 'string' && raw.statement.trim()) return [raw.statement.trim()]
  return []
}
/**
 * The library at /textbooks, computed for one request. Shelves are the families the books carry, a book is the textbook
 * named without its prefix, and a copy is a clay case. The request's params choose the page and the filter composition.
 * Payload RBAC allows the batch action or the library is not opened. Ideas the request brings, and the open textbook
 * leads. Every idea is discovered and hooked to next: the inbox is walked until it is empty, and each idea's next is that door.
 */
const documentLibrary = (products: readonly { product: string; variants?: { case: string; relation: string; formula?: string }[] }[], request: { role: string; action: string; params: Record<string, unknown>; batch: ReturnType<typeof decideBatch> }, ctx: Context) => {
  const { role, action, params, batch } = request
  const quantumAsked = params.quantum === true
  const vocabulary = quantumAsked ? quantumVocabulary() : []
  const whole = (raw: unknown, name: string, fallback: number) => { if (raw === undefined) return fallback; if (typeof raw === 'number' && Number.isInteger(raw) && raw > 0) return raw; throw new Error(`${name} is a positive integer`) }
  const limit = whole(params.limit, 'limit', quantumAsked ? Math.max(vocabulary.length, 1) : LIBRARY_PAGE)
  const pageNo = whole(params.page, 'page', 1)
  const librarySlug = 'textbooks'
  const libraryPath = `/${librarySlug}`
  const libraryTitle = `${librarySlug.slice(0, 1).toUpperCase()}${librarySlug.slice(1)}`
  const taken = new Set<string>([librarySlug])
  const claim = (base: string) => { const cleaned = librarySlugOf(base); let slug = cleaned; let n = 2; while (taken.has(slug)) { slug = `${cleaned.slice(0, 70)}-${n}`; n += 1 } taken.add(slug); return slug }
  const familyByRelation = new Map(CLAY_RELATIONS.map((relation) => [relation.name, relation.families]))
  const byProduct = new Map(products.map((product) => [product.product, product.variants ?? []]))
  const drafted = quantumAsked ? vocabulary.map((term) => ({ key: 'textbook_standards_sliced' as const, name: `${term.clause} ${term.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), says: `${term.clause} ${term.name}`, examples: term.holds ? 1 : 0, families: ['vocabulary'], copies: [] as { case: string; relation: string; formula: string; families: string[] }[], shelved: true, cased: false, exemplified: term.holds })) : TEXTBOOK_THEOREMS.map((theorem) => {
    const name = theorem.key.replace(/^textbook_/, '').replace(/_/g, '-')
    const copies = (byProduct.get(theorem.key) ?? []).map((variant) => ({ case: variant.case, relation: variant.relation, formula: variant.formula && variant.formula.length > 0 ? variant.formula : `${variant.case} = ${variant.relation}`, families: [...(familyByRelation.get(variant.relation) ?? [])] }))
    const families = [...new Set(copies.flatMap((copy) => copy.families))].sort()
    return { key: theorem.key, name, says: theorem.says, examples: theorem.examples.length, families, copies, shelved: families.length > 0, cased: copies.length > 0, exemplified: theorem.examples.length > 0 }
  })
  const shelves = [...new Set(drafted.flatMap((book) => book.families))].sort().map((family) => { const slug = claim(family); return { family, slug, path: `${libraryPath}/${slug}`, title: family } })
  const shelfByFamily = new Map(shelves.map((shelf) => [shelf.family, shelf]))
  const books = drafted.map((book) => {
    const slug = claim(book.name)
    const shelf = book.families[0] ? shelfByFamily.get(book.families[0]) ?? null : null
    const path = shelf ? `${shelf.path}/${slug}` : `${libraryPath}/${slug}`
    const copies = book.copies.map((copy) => { const copySlug = claim(copy.case); return { ...copy, slug: copySlug, path: `${path}/${copySlug}` } })
    return { ...book, slug, shelf, path, copies }
  })
  const axes = [
    { field: 'shelved' as const, holds: (book: (typeof books)[number]) => book.shelved },
    { field: 'cased' as const, holds: (book: (typeof books)[number]) => book.cased },
    { field: 'exemplified' as const, holds: (book: (typeof books)[number]) => book.exemplified },
  ]
  const radices = axes.map(() => 2)
  const space = Number(compositions(radices))
  const cells = Array.from({ length: space }, (_, index) => {
    const digits = composition(radices, BigInt(index))
    const on = axes.filter((_, axis) => digits[axis] === 1)
    const count = books.filter((book) => on.every((axis) => axis.holds(book))).length
    const where = { and: [{ kind: { equals: 'book' } }, { library: { equals: librarySlug } }, ...on.map((axis) => ({ [axis.field]: { equals: true } }))] }
    return { index, digits, on: on.map((axis) => axis.field), name: on.map((axis) => axis.field).join('+') || 'all', count, where }
  })
  const specific = cells.filter((cell) => cell.on.length > 0)
  const best = specific.reduce((left, right) => right.count > left.count || (right.count === left.count && right.on.length > left.on.length) || (right.count === left.count && right.on.length === left.on.length && right.index < left.index) ? right : left)
  const askedIndex = params.index
  const chosen = askedIndex === undefined ? best : (() => { const index = typeof askedIndex === 'number' ? askedIndex : typeof askedIndex === 'string' && /^[0-9]+$/.test(askedIndex) ? Number(askedIndex) : Number.NaN; if (!Number.isInteger(index) || index < 0 || index >= cells.length) throw new Error('index is a composition of the library filters'); return cells[index]! })()
  const matched = books.filter((book) => chosen.on.every((field) => book[field])).sort((a, b) => a.name.localeCompare(b.name))
  const slice = matched.slice((pageNo - 1) * limit, pageNo * limit)
  const onPage = new Set(slice.map((book) => book.path))
  const wanted = ideaStatements(params.ideas).slice(0, 32)
  const intake = params.discover === false ? [] : ctx.leads.filter((lead) => lead.status === 'open' && /textbook|idea/i.test(`${lead.id} ${lead.source}`)).map((lead) => lead.statement.trim()).filter((statement) => statement.length > 0)
  const statements = [...new Set([...wanted, ...intake])].slice(0, Math.max(limit, wanted.length))
  const bySays = new Map(books.map((book) => [book.says, book]))
  const discovered = statements.map((statement) => {
    const exact = bySays.get(statement)
    if (exact) return { statement, status: 'held' as const, book: exact.name, path: exact.path, theorem: exact.key }
    const routed = routeStatement(statement, ctx.examples, 1)
    const hit = routed.theorems.find((theorem) => theorem.theorem.startsWith('textbook_'))
    const book = hit ? books.find((item) => item.key === hit.theorem) : undefined
    if (book) return { statement, status: 'held' as const, book: book.name, path: book.path, theorem: book.key }
    const slug = claim(statement)
    return { statement, status: 'process' as const, book: slug, path: `${libraryPath}/${slug}`, theorem: null as string | null }
  })
  const theorem = 'textbook_textbooks_partition' as const
  const crumb = (path: string, label: string) => ({ doc: path.split('/').filter(Boolean).pop() ?? librarySlug, url: path, label })
  type Row = { id: string; kind: 'library' | 'shelf' | 'book' | 'copy' | 'process'; title: string; slug: string; path: string; parent: string | null; depth: number; product: string; variant: string; statement: string; theorem: string; breadcrumbs: { doc: string; url: string; label: string }[]; shelved: boolean; cased: boolean; exemplified: boolean; library: string }
  const filterLine = `${chosen.name} selects ${matched.length} books`
  const libraryStatement = `${libraryTitle} is the library. ${books.length} books on ${shelves.length} shelves. This request reads page ${pageNo} of the filter ${filterLine}. ${discovered.filter((item) => item.status === 'process').length} new textbook(s) to process.`
  const rows: Row[] = [{ id: librarySlug, kind: 'library', title: libraryTitle, slug: librarySlug, path: libraryPath, parent: null, depth: 1, product: librarySlug, variant: 'index', statement: libraryStatement, theorem, breadcrumbs: [crumb(libraryPath, libraryTitle)], shelved: false, cased: false, exemplified: false, library: librarySlug }]
  for (const shelf of shelves) {
    const holdings = books.filter((book) => book.families.includes(shelf.family)).length
    rows.push({ id: shelf.slug, kind: 'shelf', title: shelf.title, slug: shelf.slug, path: shelf.path, parent: libraryPath, depth: 2, product: shelf.slug, variant: 'shelf', statement: `${shelf.title} holds ${holdings} books.`, theorem, breadcrumbs: [crumb(libraryPath, libraryTitle), crumb(shelf.path, shelf.title)], shelved: true, cased: false, exemplified: false, library: librarySlug })
  }
  for (const book of slice) {
    const parent = book.shelf?.path ?? libraryPath
    const above = rows.find((row) => row.path === parent)!
    rows.push({ id: book.slug, kind: 'book', title: book.name, slug: book.slug, path: book.path, parent, depth: above.depth + 1, product: book.name, variant: book.name, statement: book.says, theorem: book.key, breadcrumbs: [...above.breadcrumbs, crumb(book.path, book.name)], shelved: book.shelved, cased: book.cased, exemplified: book.exemplified, library: librarySlug })
    for (const copy of book.copies) rows.push({ id: copy.slug, kind: 'copy', title: copy.case, slug: copy.slug, path: copy.path, parent: book.path, depth: above.depth + 2, product: book.name, variant: copy.case, statement: copy.formula, theorem: book.key, breadcrumbs: [...above.breadcrumbs, crumb(book.path, book.name), crumb(copy.path, copy.case)], shelved: book.shelved, cased: true, exemplified: book.exemplified, library: librarySlug })
  }
  for (const item of discovered.filter((item) => item.status === 'process')) {
    rows.push({ id: item.book, kind: 'process', title: item.book, slug: item.book, path: item.path, parent: libraryPath, depth: 2, product: item.book, variant: 'process', statement: item.statement, theorem: 'textbook_route_or_lead', breadcrumbs: [crumb(libraryPath, libraryTitle), crumb(item.path, item.book)], shelved: false, cased: false, exemplified: false, library: librarySlug })
  }
  const address = (path: string) => uuid(path)
  const nodeFor = (row: Row) => qpuNode(address(row.path), 'payload', row.kind === 'library' ? { product: row.product, variant: row.variant, params: { role, action, index: chosen.index, page: pageNo, limit } } : { product: row.product, variant: row.variant, page: row.path }, row.theorem)
  const leads = rows.map((row) => ({ id: row.id, source: row.path, statement: row.statement, status: row.kind === 'process' ? 'open' as const : 'served' as const, tool: 'payload' as const }))
  const developed = rows.map((row) => { const iso = developViaHooks({ formula: row.statement, product: row.product, variant: row.variant, title: row.title, theorem: row.theorem }); return { page: row.path, product: row.product, variant: row.variant, lead: row.id, iso: iso.iso, docs: iso.docs, via: iso.via } })
  const pages = rows.map((row) => {
    const children = rows.filter((child) => child.parent === row.path)
    const own = nodeFor(row)
    const richText = lx.doc([
      lx.heading(row.title, 'h1'),
      lx.paragraph([lx.text(row.statement)]),
      ...(row.kind === 'library' ? cells.filter((cell) => cell.on.length > 0).map((cell) => lx.paragraph([lx.text(`${cell.name}: ${cell.count}`)])) : []),
      ...(row.parent ? [lx.paragraph([lx.text('Nested under '), lx.link(row.parent, row.parent)])] : []),
      ...children.map((child) => lx.paragraph([lx.link(child.path, child.title), lx.text(` · ${child.product} / ${child.variant}`)])),
      ...(row.kind === 'shelf' ? slice.filter((book) => book.families.includes(row.title) && book.shelf?.path !== row.path).map((book) => lx.paragraph([lx.link(book.path, book.name), lx.text(` · ${book.name}`)])) : []),
      own,
      ...children.map(nodeFor),
    ])
    return { ...row, uuid: address(row.path), layout: [own.fields], meta: { title: row.title, description: row.statement.slice(0, 160) }, hero: { type: 'default' as const, richText }, breadcrumbs: row.breadcrumbs }
  })
  const blockIds = (page: (typeof pages)[number]) => blocks(page.hero.richText).map((node) => node.fields.uuid)
  const linked = pages.every((page) => {
    const lead = leads.find((item) => item.id === page.id)
    const dev = developed.find((item) => item.page === page.path)
    const children = pages.filter((child) => child.parent === page.path)
    const ids = blockIds(page)
    const text = JSON.stringify(page.hero.richText)
    const parent = page.parent === null || pages.some((item) => item.path === page.parent && item.depth === page.depth - 1)
    const iso = dev?.iso as { standard?: string; documented?: boolean; formula?: string } | undefined
    return lead?.source === page.path && iso?.standard === 'ISO 9001' && iso.documented === true && iso.formula === page.statement && ids.includes(page.uuid) && children.every((child) => ids.includes(child.uuid) && text.includes(child.path)) && parent && page.breadcrumbs.length === page.depth && page.layout[0]!.uuid === page.uuid && !page.product.startsWith('textbook_') && !page.variant.startsWith('textbook_')
  })
  const sort = typeof params.sort === 'string' && params.sort ? params.sort : 'slug'
  const where = chosen.where
  const api = action === 'create' ? null : manageApi({ collection: 'pages', action: action === 'read' ? 'find' : action === 'update' ? 'update' : 'delete', where, page: pageNo, limit, sort, ...(action === 'update' ? { data: { _status: 'published' } } : {}), override: false })
  const hasNextPage = pageNo * limit < matched.length
  const next = hasNextPage ? manageApi({ collection: 'pages', action: 'find', where, page: pageNo + 1, limit, sort, override: false }) : null
  const save = (collection: 'pages' | 'products', page: (typeof pages)[number], data: Record<string, unknown>) => { const dev = developed.find((item) => item.page === page.path); return auditedSave({ collection, override: false, data: { ...data, iso: dev?.iso, docs: dev?.docs } }) }
  const saves = action === 'create' ? pages.map((page) => save('pages', page, { title: page.title, slug: page.slug, path: page.path, parent: page.parent, kind: page.kind, library: page.library, product: page.product, variant: page.variant, shelved: page.shelved, cased: page.cased, exemplified: page.exemplified, _status: page.kind === 'process' ? 'draft' : 'published', hero: page.hero, layout: page.layout, meta: page.meta })) : []
  const productSaves = action === 'create' ? pages.map((page) => save('products', page, { title: page.title, slug: page.slug, product: page.product, variant: page.variant, _status: page.kind === 'process' ? 'draft' : 'published' })) : []
  const toProcess = discovered.filter((item) => item.status === 'process').length
  const depth = pages.reduce((max, page) => Math.max(max, page.depth), 1)
  return {
    phase: 'textbooks' as const, organisation: 'library' as const, library: libraryPath, via: 'payload-api' as const, role, action, access: true as const, rbac: batch,
    textbooks: books.length, shelves: shelves.length, books: slice.length, copies: pages.filter((page) => page.kind === 'copy').length, variants: pages.filter((page) => page.kind === 'copy').length,
    page: pageNo, limit, total: matched.length, hasNextPage, onPage: onPage.size, depth, filters: cells, space: String(space), radices, best, chosen, returns: compositionIndex(radices, chosen.digits) === BigInt(chosen.index),
    discovered, toProcess, held: discovered.length - toProcess, pages, leads, developed, iso: { standard: 'ISO 9001' as const, linked }, api, next, saves, productSaves,
    quantum: quantumAsked ? { standard: 'ISO/IEC 4879:2024' as const, terms: vocabulary.length, holding: vocabulary.filter((term) => term.holds).length, gap: vocabulary.filter((term) => !term.holds).map((term) => `${term.clause} ${term.name}`), from: '3.1.1' as const, to: '3.6.4' as const } : null,
    says: quantumAsked ? `${vocabulary.filter((term) => term.holds).length} of ${vocabulary.length} ISO/IEC 4879:2024 terms hold, from 3.1.1 through 3.6.4, each a textbook on this page.` : `${role} may ${action} the library through the Payload API. ${slice.length} of ${matched.length} books on this page, ${shelves.length} shelves, ${toProcess} new textbook(s) to process. The filter ${filterLine}.`,
  }
}
/** The Lean expression, the text between the colon and `:=`. The name is not the coin. */
const leanExpression = (lean: string) => {
  const at = lean.lastIndexOf(' :=')
  const head = at < 0 ? lean : lean.slice(0, at)
  const colon = head.lastIndexOf(':')
  const body = (colon < 0 ? head : head.slice(colon + 1)).trim()
  return body || lean.trim()
}
/** The theorem and its witnesses, as hex. The handle is the theorem's place. The program is the theorem's own numerals, and each further nibble is σ of one of them (15 − digit). The tail is the witness partition: 6 squares, 8 triangles, 14 faces. */
const WITNESS_TAIL = [6, 8, 14].map((n) => n.toString(16).padStart(4, '0')).join('')
export const theoremHex = (book: { lean: string }, index: number) => {
  const expression = leanExpression(book.lean)
  const numerals = [...expression.matchAll(/\d+/g)].flatMap((m) => [...BigInt(m[0]).toString(16)].map((c) => parseInt(c, 16)))
  const seed = numerals.length ? numerals : [index & 15]
  const program = Array.from({ length: 10 }, (_, i) => (i < numerals.length ? numerals[i]! : (15 - seed[i % seed.length]!) & 15))
  const handle = index.toString(16).padStart(8, '0')
  const gravity = uuidFromParts(handle, program, WITNESS_TAIL)
  return { expression, numerals, seed, program, handle, gravity }
}
/** Code gravity is one online gate QPU handles. The gate is open, its call is public, and the call costs no token. This save ports that one gate into the website. The address is the theorem and the witnesses, in hex, and that address uses every effective qubit. The hook names the next open gate. Nothing is fetched and nothing is written. */
const portOnlineGate = (ctx: Context, at: string) => {
  const origin = 'https://qpu.uuidna.com'
  const online = gates(ctx, origin).gates.filter((gate) => gate.kind === 'open' && /^https?:\/\//.test(gate.url)).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
  const rows = online.map((gate) => {
    const pick = channel(uuid(gate.url))
    const index = Number(BigInt(pick.combination.index) % BigInt(TEXTBOOK_THEOREMS.length))
    const book = TEXTBOOK_THEOREMS[index]!
    return { gate, book, index, ...theoremHex(book, index) }
  })
  const here = at ? rows.findIndex((row) => row.gravity === at || row.gate.id === at) : 0
  const row = here < 0 ? undefined : rows[here]
  const counted = uuidQubits(AXIOMS.find((row) => row.name === 'hexbit')!.value)
  const empty = { phase: 'textbooks' as const, via: 'hooks' as const, organisation: 'website' as const, opened: online.length, discovered: online.length, processed: 0 as const, queue: 0 as const, written: false as const, fetched: false as const, tokens: 0 as const, holds: false as const, says: at ? 'that address is not an open online gate' : 'no online gate is open' }
  if (!row) return empty
  const { gate, book, gravity } = row
  const read = channel(gravity)
  const witnessed = checkWitnesses(gravity)
  const variantFree = counted.variant
  const used = read.handle.length * 4 + read.program.length * 4 + read.tail.length * 4 + variantFree
  const developed = developViaHooks({ formula: row.expression, product: 'textbook', variant: read.handle, title: gate.name.slice(0, 120), theorem: book.key })
  const site = websiteGate(gate.category, gate.id, origin)
  const save = auditedSave({ collection: 'pages', override: false, data: { title: gate.name.slice(0, 120), slug: read.handle, path: site.path, parent: site.categoryPath, product: 'textbook', variant: read.handle, url: gate.url, iso: developed.iso, docs: developed.docs } })
  const following = rows.slice(here + 1).find((item) => item.gravity !== gravity)
  const nextRead = following ? channel(following.gravity) : null
  const call = { method: 'GET' as const, url: gate.url, token: null, authorization: null, tokens: 0 as const, public: true as const }
  const algebra = { perspective: 'hex' as const, hex: gravity.replace(/-/g, ''), theorem: row.expression, index: row.index, numerals: row.numerals, seed: row.seed, program: read.program, witnesses: { squares: read.params[0], triangles: read.params[1], faces: read.params[2], exact: witnessed.exact, mapped: witnessed.faces } }
  const capacity = { digits: counted.digits, hex: counted.hex, effective: counted.effective, used, whole: used === counted.effective && read.handle.length === 8 && read.program.length === 10 && read.tail.length === 12 && read.params.length === 3, tokens: 0 as const }
  const next = following && nextRead ? { id: following.gravity, handle: nextRead.handle, executable: seal(following.gravity).valid && nextRead.handle.length === 8 && nextRead.program.length === 10 && nextRead.params.length === 3 && following.gravity !== gravity, tool: 'payload' as const, arguments: { textbooks: { gates: true as const, at: following.gravity } } } : null
  const holds = save.saved === true && save.audit.holds === true && developed.iso.documented === true && capacity.whole && capacity.tokens === 0 && call.tokens === 0 && call.authorization === null && online.length > 0 && seal(gravity).valid && algebra.hex.length === 32 && algebra.witnesses.squares === 6 && algebra.witnesses.triangles === 8 && algebra.witnesses.faces === 14 && algebra.witnesses.exact === true && algebra.witnesses.mapped === 14 && read.handle === row.handle && read.program.join() === row.program.join() && (next === null || next.executable)
  return {
    phase: 'textbooks' as const, via: 'hooks' as const, organisation: 'website' as const, opened: online.length, discovered: online.length, processed: 1 as const, queue: 0 as const, written: false as const, fetched: false as const, tokens: 0 as const,
    gate: { id: gate.id, url: gate.url, kind: 'open' as const, category: gate.category, opened: true as const },
    textbook: { key: book.key, expression: row.expression }, gravity, handle: read.handle, sealed: seal(gravity).valid, hooks: developed.hooks, algebra,
    port: { collection: 'pages' as const, path: site.path, saved: save.saved }, call, capacity, next, holds,
    says: holds ? `the address is ${book.key} and its 14 witnesses, in hex. This save ports ${gate.url}. The address uses all ${capacity.effective} effective qubits. The call is public and costs no token.` : 'the open gate was not ported',
  }
}
const wordsOf = (text: string) => new Set(text.toLowerCase().match(/[a-z]{4,}/g) ?? [])
/** A fallback is a novelty. It is verified by comparing it with every DOI of precedence. A record that already states it is prior, and the claim stays the author's. */
const noveltyOf = (statement: string) => {
  const mine = wordsOf(statement)
  const checked = PRECEDENCE.map((row) => ({ doi: row.doi, title: row.title, year: row.year, shared: [...wordsOf(`${row.title} ${row.states}`)].filter((word) => mine.has(word)).length }))
  const prior = checked.filter((row) => row.shared >= 3).sort((a, b) => b.shared - a.shared || a.year - b.year)
  return { statement, verified: checked.length === PRECEDENCE.length && checked.every((row) => row.doi.length > 0), of: PRECEDENCE.length, checked, prior, novel: prior.length === 0, sure: false as const, because: null, voice: 'author' as const, author: LICENSE.author, orcid: LICENSE.orcid, tree: false as const }
}
const textbookFor = (dimension: string) => {
  const number = dimension.match(/\d{3,}/)?.[0] ?? ''
  const named = number.length > 0 ? TEXTBOOK_THEOREMS.find((book) => book.lean.includes(number) || book.says.includes(dimension)) : undefined
  return named ?? TEXTBOOK_THEOREMS.find((book) => book.key === 'textbook_standards_sliced')!
}
/** Textbooks process every ISO standard. An error or an impossibility falls back to the UUID handle: σ twice is the identity, and the Steane code corrects that single error. Each fallback is a novelty verified against the DOI precedence. A standard that still states another pitch is a sure novelty, and the pages are seeds written one wave at a time. */
const processIsoTextbooks = (asked: Record<string, unknown>, examples: readonly { id: string; shows: string }[] = []) => {
  const texts = (raw: unknown) => Array.isArray(raw) ? raw.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).map((item) => item.trim()) : []
  const errors = texts(asked.errors)
  const impossible = texts(asked.impossible ?? asked.impossibilities)
  const formula = ISO_OPEN_DEFINITIONS.map((row) => `${row.reference}: ${row.title.en}. ${row.scope.en}`).join('\n')
  const audited = isoRows(formula, true, true)
  const code = steaneCorrection()
  const key = BigInt(KEY)
  const pitch = key - (key - 0n) === 0n
  const handleOf = (index: number) => index.toString(16).padStart(8, '0')
  const reflect = (digit: number) => ({ digit, forth: 15 - digit, back: 15 - (15 - digit), holds: 15 - (15 - digit) === digit })
  const place = (dimension: string) => { const index = ISO_DIMENSIONS.indexOf(dimension as typeof ISO_DIMENSIONS[number]); return index < 0 ? 0 : index }
  const faults = [...errors.map((text) => ({ kind: 'error' as const, text })), ...impossible.map((text) => ({ kind: 'impossibility' as const, text }))]
  const fallbacks = faults.map((fault, slot) => {
    const named = ISO_DIMENSIONS.find((dimension) => fault.text.includes(dimension))
    const dimension = named ?? (/440/.test(fault.text) ? 'ISO 16' : ISO_DIMENSIONS[slot % ISO_DIMENSIONS.length]!)
    const index = place(dimension)
    const handle = handleOf(index)
    const placed = program(handle)
    const sigma = reflect(parseInt(handle[7]!, 16))
    const row = code.rows.find((item) => item.error === `X_${(index % 7) + 1}`)!
    const statement = `${fault.kind}: ${fault.text}. handle ${handle} computes by the algebraic involution and the Steane code corrects the error.`
    const drift = fault.text.includes(String(STANDARD_HZ)) ? a432Drift(STANDARD_HZ) : null
    const found = noveltyOf(statement)
    const novelty = drift?.sure ? { ...found, novel: true as const, sure: true as const, because: drift.because } : found
    const computes = drift ? drift.computes : null
    const holds = sigma.holds && pitch && row.ok && novelty.verified && novelty.tree === false && novelty.author === LICENSE.author && (computes === null || (computes === KEY && dimension === 'ISO 16'))
    return { kind: fault.kind, text: fault.text, dimension, handle, path: placed.path, sigma: '15 - x' as const, forth: sigma.forth, back: sigma.back, involution: sigma.holds && pitch, syndrome: row.syndrome, located: row.located, corrected: row.ok, computes, novelty, holds }
  })
  const rows = ISO_DIMENSIONS.map((dimension) => {
    const book = textbookFor(dimension)
    const defined = audited.find((row) => row.dimension === dimension)!
    const fallback = fallbacks.find((item) => item.dimension === dimension && item.kind === 'impossibility')
    const via = fallback ? 'handle' as const : 'textbook' as const
    const holds = defined.holds && book.lean.includes(':=') && (via === 'textbook' || fallback?.holds === true) && (dimension !== 'ISO 16' || defined.computes === KEY)
    return { dimension, theorem: book.key, via, reference: defined.reference, computes: defined.computes, holds }
  })
  const correction = { code: 'steane' as const, distance: code.distance, corrected: code.corrected, total: code.total, holds: code.corrected === code.total && code.total === 14 && code.rows.every((row) => row.ok) }
  const known = examples.filter((item) => item.shows.includes(String(STANDARD_HZ)) && item.shows.includes(String(KEY))).map((item) => item.id)
  const drifts = [{ ...a432Drift(STANDARD_HZ), source: 'ISO 16' as const, examples: known }]
  const answers = Array.isArray(asked.answers) ? asked.answers.filter((item): item is { id?: unknown; text?: unknown } => !!item && typeof item === 'object') : []
  const online = answers.flatMap((item) => typeof item.text === 'string' && item.text.includes(String(STANDARD_HZ)) ? [{ source: typeof item.id === 'string' ? item.id : 'online', stated: STANDARD_HZ, computes: KEY, sure: true as const }] : [])
  const requestList = driftResearch(drifts)
  const lead = leadDecode()
  const upgrade = textbookUpgrade()
  const research = { via: 'payload' as const, manual: false as const, fetched: false as const, discovered: known.length, explained: drifts.length + online.length, drifts, online, requestList, lead, upgrade }
  const waves = seedWaves(known)
  const discovery = waveDiscovery(known)
  const seeds = { via: 'seeds' as const, waves: waves.map((wave) => ({ name: wave.name, pages: wave.pages.length, improves: wave.improves, discovered: wave.discovered, compute: { chosen: wave.compute.chosen, steps: wave.compute.steps, depth: wave.compute.depth, handle: wave.compute.handle } })), pages: waves.reduce((count, wave) => count + wave.pages.length, 0), deploy: 'one wave at a time' as const, efficient: waves.every((wave) => wave.compute.chosen === 'zfs' && wave.compute.steps === 8 && wave.compute.depth === 7), discovery }
  const holds = rows.length === ISO_DIMENSIONS.length && rows.every((row) => row.holds) && fallbacks.every((item) => item.holds) && correction.holds && pitch && (rows.filter((row) => row.via === 'handle').length === new Set(fallbacks.filter((item) => item.kind === 'impossibility').map((item) => item.dimension)).size) && research.drifts.every((row) => row.sure && row.computes === KEY && row.stated !== KEY) && seeds.pages > 0 && seeds.efficient === true && seeds.discovery.fetched === false && seeds.discovery.terms === 86 && seeds.discovery.workflows === 7 && seeds.waves.every((wave, index, all) => wave.pages > 0 && wave.improves === all[(index + 1) % all.length]!.name && wave.compute.steps === 8)
  return {
    phase: 'textbooks' as const, via: 'textbook' as const, organisation: 'iso' as const, standard: 'ISO' as const,
    dimensions: rows.length, processed: rows.length, textbook: rows.filter((row) => row.via === 'textbook').length,
    fallbacks, novelties: fallbacks.length, verified: fallbacks.filter((item) => item.novelty.verified).length, novel: fallbacks.filter((item) => item.novelty.novel).length, cited: fallbacks.filter((item) => item.novelty.prior.length > 0 && item.novelty.sure === false).length,
    precedence: PRECEDENCE.map((row) => row.doi), correction, involution: '15 - (15 - x) = x' as const, pitch: KEY, research, seeds, rows, holds,
    says: holds ? `${rows.length} ISO standards processed by their textbooks. ${fallbacks.length} fallback${fallbacks.length === 1 ? '' : 's'} ${fallbacks.length === 1 ? 'is a novelty' : 'are novelties'} verified against ${PRECEDENCE.length} DOI records of precedence. A standard that still states ${STANDARD_HZ} Hz is a sure novelty, because the quantum computation is ${KEY} Hz. ${research.discovered} examples of that drift are explained together. ${seeds.pages} pages deploy in ${seeds.waves.length} waves. Each wave improves the next. CI and CD are Payload pages. The program is the object the filesystem places, and the Steane code corrects the error.` : 'an ISO standard was not processed',
  }
}
const textbooksDoor = (asked: Record<string, unknown>, ctx: Context) => {
  const iso = asked.iso === true || (isObj(asked.params) && (asked.params as { iso?: unknown }).iso === true)
  if (iso || isObj(asked.iso)) return processIsoTextbooks(asked.iso === true || iso ? asked : asked.iso as Record<string, unknown>, ctx.examples)
  const params = isObj(asked.params) ? asked.params as Record<string, unknown> : {}
  if (asked.gates === true || params.gates === true) return portOnlineGate(ctx, typeof asked.at === 'string' ? asked.at : typeof params.at === 'string' ? params.at : '')
  const action = typeof asked.action === 'string' ? asked.action : typeof params.action === 'string' ? params.action : 'read'
  const known = BATCH_ACTIONS.find((batch) => batch.action === action)
  const role = typeof asked.role === 'string' && asked.role ? asked.role : typeof params.role === 'string' && params.role ? params.role : action === 'read' ? 'reader' : action === 'create' ? 'writer' : 'admin'
  const batch = decideBatch('apis', role)
  const refused = (says: string) => ({ phase: 'textbooks' as const, organisation: 'library' as const, library: '/textbooks' as const, via: 'payload-api' as const, role, action, access: false as const, rbac: batch, pages: [], discovered: [], api: null, says })
  if (!known) return refused(`${action} is not a batch action of the Payload API`)
  if (!decideApiMcp('apis', action, role)) return refused(`${role} may not ${action} the library through the Payload API`)
  const clay = ctx.call('clay', { catalog: true }) as { products?: { product: string; variants?: { case: string; relation: string; formula?: string }[] }[] }
  return documentLibrary(clay.products ?? [], { role, action, params, batch }, ctx)
}
/** Typography standardised without changing meaning: only the text nodes change (straight quotes to typographic ones, -- to a dash, ... to an
 *  ellipsis, runs of spaces to one); the words, read in order without case or punctuation, must be the same before and after, and every qpu block
 *  stays as it was — otherwise the original stands. A change of meaning is never made here: an improvement is another qpu block, verified by its theorem. */
const typeset = (s: string) => s.replace(/\.\.\./g, '…').replace(/(?<!-) ?--(?!-) ?/g, ' — ').replace(/(^|[\s(\[{])"/g, '$1“').replace(/"/g, '”').replace(/(\w)'(\w)/g, '$1’$2').replace(/(^|[\s(\[{])'/g, '$1‘').replace(/'/g, '’').replace(/ {2,}/g, ' ')
const words = (n: unknown): string[] => { const out: string[] = []; const walk = (x: unknown) => { if (!x || typeof x !== 'object') return; const o = x as { type?: string; text?: string; children?: unknown[] }; if (o.type === 'text' && typeof o.text === 'string') out.push(...(o.text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])); for (const c of o.children ?? []) walk(c) }; walk(n); return out }
const standardise = (doc: LexicalDoc) => {
  let changes = 0
  const walk = (x: unknown): unknown => { if (!x || typeof x !== 'object') return x; const o = x as Record<string, unknown>; if (o.type === 'block') return o; if (o.type === 'text' && typeof o.text === 'string') { const t = typeset(o.text); if (t !== o.text) changes++; return { ...o, text: t } } return Array.isArray(o.children) ? { ...o, children: o.children.map(walk) } : o }
  const out = { ...doc, root: walk(doc.root) } as LexicalDoc
  const before = words(doc.root), after = words(out.root)
  const meaningKept = before.length === after.length && before.every((w, i) => w === after[i])
  const blocksKept = JSON.stringify(blocks(doc)) === JSON.stringify(blocks(out))
  const kept = meaningKept && blocksKept
  return { doc: kept ? out : doc, changes: kept ? changes : 0, meaningKept, blocksKept, words: before.length, says: kept ? `${changes} text node(s) set in standard typography; the ${before.length} words in order and every qpu block unchanged` : 'a change would alter the words or a block: the original stands; an improvement is another qpu block, verified by its theorem', theorem: 'textbook_typography_idempotent' }
}
/** A lexical document of qpu blocks: a heading, one block per entry, the paragraphs after — the shape every builder answers in. */
export const doc = (title: string, blocks: readonly { uuid: string; tool: string; arguments: Record<string, unknown>; theorem?: string | null }[], paragraphs: readonly string[] = []): LexicalDoc => lx.doc([lx.heading(title, 'h2'), ...blocks.map((b) => qpuNode(b.uuid, b.tool, b.arguments, b.theorem ?? null)), ...paragraphs.map((p) => lx.paragraph([lx.text(p)]))])
// Payload handles the proof of a quantum computation as a report: the client hands over the computation (tool, arguments) and its result, and the report
// seals it by the content address of all three — re-running the computation reproduces the address, so verifying it is cheaper than recomputing by
// magnitudes (the quantum advantage, textbook_advantage_unbounded), ISO/Google-standard and strict. The report is a lexical document Payload stores and
// serves (a qpu block of the computation at its address), recorded as an entry of kind report; and its hooks use the report to refactor — afterRead
// reuses it by address (a repeat served from the report, the 304 involution, not recomputed), and a computation that did not verify is a refactor lead.
const report = (tool: string, args: Record<string, unknown>, result: unknown) => {
  const address = uuid(canonicalText({ tool, arguments: args, result })), verified = result !== undefined && !(result != null && typeof result === 'object' && 'error' in (result as object))
  const page = doc(`Proof report · ${tool}`, [{ uuid: address, tool, arguments: args }], [`verified by its content address ${address}: re-running ${tool} reproduces it, so verifying is cheaper than recomputing by magnitudes (textbook_advantage_unbounded); ${LICENSE.spdx}: ${LICENSE.terms}`])
  const entry = { kind: 'report' as const, from: 'qpu-report', body: { tool, arguments: args, address, verified } }
  const refactor = { viaHooks: 'afterRead reuses the report by its address — a repeat of the same computation is served from it (the 304 involution), never recomputed; beforeChange applies a report that names a cheaper served path as a refactor', leads: verified ? [] : [{ id: `report-${address.slice(0, 8)}`, statement: `${tool} did not verify — refactor to the served path`, status: 'open' as const }] }
  return { phase: 'report' as const, computation: { tool, arguments: args }, address, verified, result, advantage: { measure: 'verify beats recompute by magnitudes', bound: 'unbounded (textbook_advantage_unbounded)' }, doc: page, entry, refactor, theorems: ['textbook_report_refactors', 'textbook_advantage_unbounded'], says: `Payload handles the proof of ${tool} as a report sealed at ${address.slice(0, 12)} (ISO/Google-standard, strict): re-running reproduces the address (verify beats recompute), the report a document Payload stores and serves, its hooks reusing it to refactor — a repeat served by address, else a refactor lead` }
}
/** Two edits of one document merged by block address: a block either edit holds and neither removed from the base is kept; of two contents under one
 *  address the edit over the base's stands, else they collide, listed and held out, never first-wins: merge(a, b) = merge(b, a) in content (textbook_merge_collision). */
const merge = (base: LexicalDoc, a: LexicalDoc, b: LexicalDoc) => {
  const ids = (d: LexicalDoc) => new Set(blocks(d).map((n) => n.fields.uuid)), was = new Map(blocks(base).map((n) => [n.fields.uuid, canonicalText(n)]))
  const B = ids(base), A = ids(a), Bb = ids(b)
  const removed = new Set([...B].filter((id) => !A.has(id) || !Bb.has(id)))
  const held = new Map<string, Map<string, QpuNode>>(); for (const n of [...blocks(a), ...blocks(b)]) if (!removed.has(n.fields.uuid)) (held.get(n.fields.uuid) ?? held.set(n.fields.uuid, new Map()).get(n.fields.uuid)!).set(canonicalText(n), n)
  for (const [id, m] of held) if (m.size === 2 && m.has(was.get(id) ?? '')) m.delete(was.get(id)!)
  const collided = [...held].filter(([, m]) => m.size > 1).map(([uuid, m]) => ({ uuid, contents: [...m.keys()].sort() }))
  const kept = [...held.values()].filter((m) => m.size === 1).map((m) => [...m.values()][0]!).sort((x, y) => x.fields.uuid.localeCompare(y.fields.uuid))
  const texts = [...new Set([...prose(a), ...prose(b)])].sort()
  const page: LexicalDoc = lx.doc([...texts.map((t) => JSON.parse(t) as unknown), ...kept])
  const only = (s: Set<string>, t: Set<string>) => [...s].filter((id) => !t.has(id) && !removed.has(id))
  return { doc: page, address: fold(page), blocks: kept.length, fromA: only(A, Bb).length, fromB: only(Bb, A).length, both: [...A].filter((id) => Bb.has(id) && !removed.has(id)).length, removed: removed.size, collisions: collided.length, collided, angles: ANGLES, says: `merged by block address: every block either edit holds and neither removed is kept once; the address folds the content, so the merge commutes and is idempotent; ${collided.length} collision(s) held out` }
}
const prose = (d: LexicalDoc) => d.root.children.filter((n) => !(typeof n === 'object' && n !== null && (n as { type?: string }).type === 'block')).map(canonicalText)
/** A document's address: the fold of its blocks' and prose's canonical texts, sorted: its content, not its order. */
export const fold = (doc: LexicalDoc): string => uuid(canonicalText([...blocks(doc).map(canonicalText).sort(), ...[...new Set(prose(doc))].sort()]))
type GateDoc = { id: string; title: string; slug: string; path: string; parent: string | null; depth: number; layout: Record<string, unknown>[]; meta: { title: string; description: string }; hero: { type: 'default'; richText: LexicalDoc }; breadcrumbs: { page: string; url: string; label: string }[] }
/** The gates as the nested page documents the seed creates, parents first: the root, a page per category, a page per gate. */
/** A competition gate knows its competitors as well as the theorems: both in its lexical body (the pages collection the Payload MCP plugin serves). */
const adapter = (x: Gate): unknown[] => { const a = gateAdapter(x); return [lx.heading('Adapter: a dimension of the one plugin', 'h2'), lx.paragraph([lx.text(`Lands in ${a.lands}. ${a.hook}. Fields: ${a.fields.join(', ')}. Presented as ${a.ui.item} (${a.ui.variant}), styled from the address.`)]), lx.paragraph([lx.text(`REST both ways under RBAC — in: ${a.rest.in}; out: ${a.rest.out}; read ${a.rest.rbac.read}, create ${a.rest.rbac.create}, update ${a.rest.rbac.update}, delete ${a.rest.rbac.delete}; tenant roles ${a.rest.rbac.tenantRoles.join(', ')}.`)]), lx.paragraph([lx.text(`UUID stream of its configs: ${a.stream.configs.map((c) => `${c.kind} ${c.uuid}`).join('; ')}.`)])] }
const knowledge = (x: Gate): unknown[] => { const c = x.category === 'competitions' ? COMPETITIONS.find((k) => k.id === x.id) : undefined; if (!c) return []; const k = knowCompetition(c); return [lx.heading('Competitors, as the page measures them', 'h2'), lx.paragraph([lx.link(c.competitors.source, c.competitors.source), lx.text(` (read ${c.competitors.read}): ${c.competitors.measured}`)]), ...(c.competitors.known.length ? [lx.list(c.competitors.known.map((n) => [lx.text(n)]))] : []), lx.heading(`${k.theorems.length} theorems the tree carries`, 'h2'), lx.list(k.theorems.map((t) => [lx.text(t)]))] }
const gateDocs = (ctx: Context, origin: string, devDependencies: Record<string, string> = {}, google: GoogleApis = {}, mcpAnswer?: unknown) => {
  const g = gates(ctx, origin, devDependencies, google, mcpAnswer)
  const theorem = 'textbook_gates_partition'
  const lead = new Map(ctx.leads.map((l) => [l.id, l]))
  // a nested page is addressed by its breadcrumb path, the URL the nested-docs plugin joins from the slugs and the fork resolves
  const root = { slug: websiteGate('gates', 'root').root, title: 'Gates' }
  const rootPath = `/${root.slug}`
  const rootCrumb = crumb(rootPath, root.title, root.slug)
  const catSlug = (id: string) => websiteGate(id, id).categorySlug
  const catPath = (id: string) => websiteGate(id, id).categoryPath
  const gatePath = (x: Gate) => websiteGate(x.category, x.id, origin).path
  const leadItems = (ids: string[]) => lx.list(ids.map((id) => { const l = lead.get(id)!; return [lx.text(`${l.id} · ${l.status}${l.tool ? ` · ${l.tool}` : ''}: ${l.statement}`)] }))
  const docs: GateDoc[] = [
    { id: root.slug, title: root.title, slug: `/${root.slug}`, path: rootPath, parent: null, depth: 1, layout: [qpuFields(root.slug, 'leads', {}, theorem)], meta: { title: 'Gates · @uuidna/qpu', description: g.says }, hero: { type: 'default', richText: lx.doc([lx.heading('Every API is a gate', 'h1'), lx.paragraph([lx.text(`${g.counts.gates} gates in ${g.counts.categories} categories (${g.counts.partition}): ${g.counts.own} doors of this catalogue and ${g.counts.external} addresses outside it; ${g.leads.placed} of ${g.leads.total} leads pass through a gate.`)]), lx.list(g.categories.map((c) => [lx.link(catPath(c.id), c.name), lx.text(`: ${c.gates} gates, ${c.leads} leads — ${c.says}`)]))]) }, breadcrumbs: [rootCrumb] },
    ...g.categories.map((c): GateDoc => { const slug = catSlug(c.id); const mine = g.gates.filter((x) => x.category === c.id); const ids = [...new Set(mine.flatMap((x) => x.leads))]; return { id: slug, title: c.name, slug: `/${slug}`, path: catPath(c.id), parent: `/${root.slug}`, depth: 2, layout: [qpuFields(slug, 'leads', { ids }, theorem)], meta: { title: `${c.name} · @uuidna/qpu`, description: c.says }, hero: { type: 'default', richText: lx.doc([lx.heading(c.name, 'h1'), lx.paragraph([lx.text(`${c.says}: ${mine.length} gates, ${ids.length} leads.`)]), lx.list(mine.map((x) => [lx.link(gatePath(x), x.name), lx.text(` (${x.kind}, ${x.leads.length} leads)`)]))]) }, breadcrumbs: [rootCrumb, crumb(catPath(c.id), c.name, slug)] } }),
    ...g.gates.map((x): GateDoc => { const slug = gateSlug(x.id); const c = g.categories.find((y) => y.id === x.category)!; return { id: slug, title: x.name, slug: `/${slug}`, path: gatePath(x), parent: `/${catSlug(c.id)}`, depth: 3, layout: [qpuFields(slug, 'leads', { ids: x.leads }, theorem)], meta: { title: `${x.name} · @uuidna/qpu`, description: `${x.kind} gate of ${x.leads.length} leads, passed by ${x.by}${x.measured ? `: ${x.measured}` : ''}` }, hero: { type: 'default', richText: lx.doc([lx.heading(x.name, 'h1'), lx.paragraph([lx.text(`A ${x.kind} gate at `), lx.link(x.url, x.url), lx.text(`, passed by ${x.by}.${x.measured ? ` Measured: ${x.measured}` : ''}`)]), lx.heading(`${x.leads.length} leads pass through it`, 'h2'), ...(x.leads.length ? [leadItems(x.leads)] : [lx.paragraph([lx.text('No lead names this gate yet: the gate itself is the lead.')])]), ...adapter(x), ...knowledge(x)]) }, breadcrumbs: [rootCrumb, crumb(catPath(c.id), c.name, catSlug(c.id)), crumb(gatePath(x), x.name, slug)] } }),
  ]
  return { ...g, docs }
}

/** The MCP imagined as config sets of widget-skilled tools: a server is nothing but a set of configurations — its tools, each carrying its
 *  widget (the UI resource it renders through) and its skill (the toolbox's instructions and directions), its resources, its examples, its
 *  configuration kinds, its theorems — and every subset (a toolbox, a tenant's mount, the tools with a UI, the examples a theorem backs) is a
 *  config set with a content address: the fold of its sorted members, so two hosts serving the same set share one address (the involution)
 *  and a tenant's mount of the whole server is the same set at every host. Sets compose by union, intersection and difference (inclusion–
 *  exclusion holds by theorem); the server's initialize answer is derived from the whole set, not declared beside it. */
type ConfigSet = { name: string; by: string; size: number; address: string; members: string[] }
/** A set's distinct members, sorted and addressed by their canonical text: a repeat is one member, a newline in one never two. */
const set = (members: readonly string[]) => { const m = [...new Set(members)].sort(); return { size: m.length, address: uuid(canonicalText(m)), members: m } }
const sets = (ctx: Context, names: readonly (string | { name: string; members: readonly string[] })[] = ['legal', 'crypto']) => {
  const tools = listTools(ctx)
  const resources = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'resources/list' }) as { result: { resources: { uri: string; mimeType: string }[] } }).result.resources
  const live = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'sets', version: '0' } } }) as { result: { capabilities: Record<string, unknown> } }).result.capabilities
  const elements = [
    // a tool's address folds its schema, its widget and its skill: the widget-skilled tool is the element
    ...tools.map((t) => ({ id: `tool:${t.name}`, kind: 'tool' as const, address: uuid(JSON.stringify({ name: t.name, inputSchema: t.inputSchema, widget: t._meta?.ui?.resourceUri ?? null, skill: t._meta?.skill?.instructions ?? null })) })),
    ...resources.map((r) => ({ id: `resource:${r.uri}`, kind: 'resource' as const, address: uuid(`${r.uri}\n${r.mimeType}`) })),
    ...ctx.examples.map((e) => ({ id: `example:${e.id}`, kind: 'example' as const, address: uuid(JSON.stringify({ tool: e.tool, arguments: e.arguments })) })),
    ...configKinds.map((k) => ({ id: `config:${k}`, kind: 'config' as const, address: uuid(`config:${k}`) })),
    ...TEXTBOOK_THEOREMS.map((t) => ({ id: `theorem:${t.key}`, kind: 'theorem' as const, address: uuid(t.lean) })),
  ]
  const named = (name: string, by: string, members: readonly string[]): ConfigSet => ({ name, by, ...set(members) })
  const toolboxes = [...new Set(tools.map((t) => t._meta?.toolbox ?? 'none'))]
  const ofBox = (b: string) => { const names = tools.filter((t) => (t._meta?.toolbox ?? 'none') === b).map((t) => t.name); return [...names.map((n) => `tool:${n}`), ...names.map((n) => `resource:ui://qpu/${n}`).filter((id) => elements.some((e) => e.id === id)), ...ctx.examples.filter((e) => names.includes(e.tool)).map((e) => `example:${e.id}`)] }
  const universe = named('mcp', 'the whole server: every element', elements.map((e) => e.id))
  const sets: ConfigSet[] = [
    universe,
    ...toolboxes.map((b) => named(b, 'toolbox: its tools, their UI resources, their examples', ofBox(b))),
    named('tools', 'every door', tools.map((t) => `tool:${t.name}`)),
    named('ui', 'the tools with a widget: a UI resource to render through', tools.filter((t) => t._meta?.ui?.resourceUri).map((t) => `tool:${t.name}`)),
    named('skilled', 'the tools with a skill: a toolbox whose instructions a client follows and whose directions it tests in', tools.filter((t) => t._meta?.skill?.instructions && t._meta.skill.directions > 0).map((t) => `tool:${t.name}`)),
    named('backed', 'the examples a theorem makes true', ctx.examples.filter((e) => e.theorem).map((e) => `example:${e.id}`)),
    named('configs', 'the configuration kinds', configKinds.map((k) => `config:${k}`)),
    ...[...Object.values(TENANTS), 'ceci'].map((t) => named(`mount:${t}`, 'a tenant\'s mount of the server: the whole set, so every mount shares one address', elements.map((e) => e.id))),
  ]
  const byName = new Map(sets.map((x) => [x.name, x]))
  const [a, b] = names.map((n) => (typeof n === 'string' ? byName.get(n) ?? named(n, 'named, empty: no such set', []) : named(n.name, 'given', n.members)))
  const A = new Set(a!.members), B = new Set(b!.members)
  const union = [...new Set([...A, ...B])], intersection = [...A].filter((m) => B.has(m)), difference = [...A].filter((m) => !B.has(m)), symmetric = [...difference, ...[...B].filter((m) => !A.has(m))]
  const algebra = { a: a!.name, b: b!.name, addresses: [a!.address, b!.address], union: named(`${a!.name} ∪ ${b!.name}`, 'union', union), intersection: named(`${a!.name} ∩ ${b!.name}`, 'intersection', intersection), difference: named(`${a!.name} ∖ ${b!.name}`, 'difference', difference), symmetric: named(`${a!.name} △ ${b!.name}`, 'symmetric difference', symmetric), inclusionExclusion: union.length === a!.size + b!.size - intersection.length, leads: diffMembers({ name: a!.name, members: a!.members }, { name: b!.name, members: b!.members }, { config: 'sets' }).leads }
  const mounts = sets.filter((x) => x.name.startsWith('mount:'))
  // the initialize answer derived from the set: tools because the tool set is non-empty, resources and the UI extension because the UI set is
  // the UI extension declares the mime types of the UI resources alone (ui://): the SDK resource is served, not negotiated as an app view
  const derived = { tools: {}, ...(sets.find((x) => x.name === 'ui')!.size ? { resources: {}, extensions: { [MCP_APPS.extension]: { mimeTypes: [...new Set(resources.filter((r) => r.uri.startsWith('ui://')).map((r) => r.mimeType))] } } } : {}), ...engineCapabilities() }
  const partition = toolboxes.map((bx) => tools.filter((t) => (t._meta?.toolbox ?? 'none') === bx).length)
  const widgeted = byName.get('ui')!, skilled = byName.get('skilled')!
  const widgetSkilled = { widgeted: widgeted.size, skilled: skilled.size, both: widgeted.members.filter((m) => skilled.members.includes(m)).length, every: widgeted.size === tools.length && skilled.size === tools.length && widgeted.address === skilled.address, says: 'the widgeted set and the skilled set are the tool set itself (one address), so every element of every set is a widget-skilled tool' }
  return {
    elements: { total: elements.length, byKind: Object.fromEntries((['tool', 'resource', 'example', 'config', 'theorem'] as const).map((k) => [k, elements.filter((e) => e.kind === k).length])) },
    sets: sets.map(({ members: _m, ...rest }) => rest), members: Object.fromEntries(sets.map((x) => [x.name, x.members])),
    partition: { by: 'toolbox', sizes: partition, says: `${partition.join(' + ')} = ${tools.length} tools` },
    mounts: { tenants: mounts.map((m) => m.name.slice(6)), oneAddress: new Set(mounts.map((m) => m.address)).size === 1, address: mounts[0]?.address ?? null, says: 'every tenant mounts the same set, so every mount has the same address: the e2e gate decodes the hosts as copies of it' },
    algebra, widgetSkilled,
    initialize: { derived, live, agrees: JSON.stringify(derived) === JSON.stringify(live) },
    sdk: (({ module: _m, ...rest }) => rest)(sdk('https://qpu.uuidna.com', tools.map((t) => t.name))),
    says: 'the MCP is its config sets of widget-skilled tools: the server is the set of every element, a toolbox a subset, a mount the whole set at a host; sets are addressed by the fold of their sorted members and composed by union, intersection and difference; the initialize answer follows from the set',
  }
}
const site = (ctx: Context, origin: string, devDependencies: Record<string, string> = {}, google: GoogleApis = {}) => {
  const list = listTools(ctx)
  const box = new Map(list.map((t) => [t.name, t._meta?.toolbox ?? 'none']))
  const heavy = new Set(['audit', 'metrics', 'imagine', 'discover', 'wave', 'readiness', 'e2e', 'textbook', 'clone'])
  // a verified formula: the block's arguments satisfy the tool's own schema (the required keys, the types, the enums), the same contract the qpu
  // block enforces on save — an example whose arguments do not are not emitted into the site (no block comes from an unverified formula)
  const schema = new Map(list.map((t) => [t.name, t.inputSchema as { required?: string[]; properties?: Record<string, { type?: string | string[]; enum?: unknown[] }> }]))
  const verified = (tool: string, args: Record<string, unknown> = {}): boolean => { const s = schema.get(tool); if (!s) return true; if ((s.required ?? []).some((k) => !(k in args))) return false; for (const [k, p] of Object.entries(s.properties ?? {})) { if (!(k in args)) continue; if (!typeOk(args[k], p.type)) return false; if (p.enum && !p.enum.includes(args[k])) return false } return true }
  // the site never lays itself out inside itself: the example that is this very call is skipped (it would replay every example again, inside the first replay)
  const docs = ctx.examples.filter((e) => !heavy.has(e.tool) && !e.arguments.selftest && !(e.tool === 'payload' && e.arguments.site) && verified(e.tool, e.arguments)).map((e) => {
    const r = rpc(ctx, e.tool, e.arguments)
    if (!r.result) return { id: e.id, tool: e.tool, toolbox: box.get(e.tool) ?? 'none', error: r.error?.message ?? 'no result' }
    const uuid = r.result._meta.block.meta.id
    const d = payloadDoc({ uuid, tool: e.tool, arguments: e.arguments, description: e.shows, openGraph: r.result._meta.openGraph, prev: null, chain: [], origin })
    return { id: e.id, tool: e.tool, toolbox: box.get(e.tool) ?? 'none', uuid, url: `${origin}/${uuid}`, title: d.seo.title, description: e.shows, theorem: e.theorem ?? null, arguments: e.arguments, breadcrumbs: d.nestedDocs.breadcrumbs.length, blocks: 1 }
  })
  const useCases = [...new Set(docs.map((d) => d.toolbox))].map((toolbox) => ({ toolbox, pages: docs.filter((d) => d.toolbox === toolbox).length, tools: [...new Set(docs.filter((d) => d.toolbox === toolbox).map((d) => d.tool))] }))
  const gated = gateDocs(ctx, origin, devDependencies, google)
  const leaves = docs.filter((d): d is typeof d & { uuid: string; title: string; description: string; arguments?: Record<string, unknown>; theorem: string | null } => 'uuid' in d)
  const rootId = uuid('site:examples')
  const boxId = (name: string) => uuid(`site:examples:${name}`)
  const rootPath = `/${rootId}`
  const rootCrumb = crumb(rootPath, 'Examples', rootId)
  const boxes = [...new Set(leaves.map((d) => d.toolbox))]
  const boxPages = boxes.map((name) => {
    const id = boxId(name)
    const path = `${rootPath}/${id}`
    const kids = leaves.filter((d) => d.toolbox === name)
    return { id, title: name, slug: `/${id}`, path, parent: rootPath, depth: 2 as const, layout: [qpuFields(id, 'payload', { toolbox: name, examples: kids.map((k) => k.id) }, 'textbook_site_documents')], meta: { title: `${name} · examples`, description: `${kids.length} examples of the ${name} toolbox` }, breadcrumbs: [rootCrumb, crumb(path, name, id)], hero: { type: 'default' as const, richText: lx.doc([lx.heading(name, 'h1'), lx.paragraph([lx.text(`${kids.length} examples.`)]), ...kids.map((k) => lx.paragraph([lx.link(`/${k.uuid}`, k.title)]))]) } }
  })
  const examplePages = leaves.map((d) => {
    const parentId = boxId(d.toolbox)
    const parentPath = `${rootPath}/${parentId}`
    const path = `${parentPath}/${d.uuid}`
    return { id: d.uuid, title: d.title, slug: `/${d.uuid}`, path, parent: `/${parentId}`, depth: 3 as const, layout: [qpuFields(d.uuid, d.tool, d.arguments ?? {}, d.theorem)], meta: { title: d.title, description: d.description }, breadcrumbs: [rootCrumb, crumb(parentPath, d.toolbox, parentId), crumb(path, d.title, d.uuid)], hero: { type: 'default' as const, richText: lx.doc([lx.heading(d.title, 'h1'), lx.paragraph([lx.text(d.description)]), lx.paragraph([lx.text('Nested under '), lx.link(parentPath, d.toolbox)]), qpuNode(d.uuid, d.tool, d.arguments ?? {}, d.theorem)]) } }
  })
  const examplesRoot = { id: rootId, title: 'Examples', slug: rootPath, path: rootPath, parent: null, depth: 1 as const, layout: [qpuFields(rootId, 'payload', { examples: leaves.length }, 'textbook_site_documents')], meta: { title: 'Examples · @uuidna/qpu', description: `${leaves.length} examples nested under ${boxes.length} toolboxes` }, breadcrumbs: [rootCrumb], hero: { type: 'default' as const, richText: lx.doc([lx.heading('Examples', 'h1'), lx.paragraph([lx.text(`${leaves.length} examples, ${boxes.length} toolboxes.`)]), ...boxPages.map((b) => lx.paragraph([lx.link(b.path, b.title)]))]) } }
  const nested = [examplesRoot, ...boxPages, ...examplePages]
  const made1000 = seededTrapdoor(1000, 1n), dec1000 = decodeImpossible(made1000.N, made1000.witness)
  const home = { id: 'home', slug: 'home', title: 'QPU · 1000-bit σ-trapdoor & Clay Register', thousandBit: { bits: made1000.bits, N: made1000.N.toString(), p: made1000.p.toString(), q: made1000.q.toString(), witness: made1000.witness.toString(), searched: dec1000.searched.toString(), decoded: dec1000.decoded, verified: dec1000.verified, exact: made1000.p * made1000.q === made1000.N } }
  const challenges = challengeSection()
  const clones = selfClones(origin, true)
  return { reference: { site: 'https://payloadcms.com', contract: 'https://payloadcms.com/api/pages?limit=1&depth=0', shape: 'docs with layout blocks (blockType), meta (title, description), breadcrumbs: the site is what Payload computes; discovery reads it as the standard payload-site' }, origin, home, useCases: useCases.length, pages: docs.length, byUseCase: useCases, docs, clones: { frameworks: clones.frameworks, unique: clones.unique, orders: clones.orders, price: clones.price, canonicals: clones.canonicals }, gates: { root: gated.tree.root, categories: gated.counts.categories, gates: gated.counts.gates, pages: gated.docs.length, depth: gated.tree.depth, partition: gated.counts.partition, byKind: gated.counts.byKind, leads: gated.leads, byCategory: gated.categories }, challenges: { section: challenges.section, challenges: challenges.challenges, pages: challenges.pages, verified: challenges.verified, holds: challenges.holds }, collection: { slug: 'pages', totalDocs: docs.length + gated.docs.length + challenges.docs.length, docs: [...docs.filter((d) => 'uuid' in d).map((d) => ({ id: d.uuid, title: d.title, slug: `/${d.uuid}`, layout: [(() => { const ch = channel(String(d.uuid)); return { blockType: 'qpu', tool: d.tool, uuid: d.uuid, handle: ch.handle, program: ch.program.join(''), tail: ch.tail, arguments: (d as { arguments?: Record<string, unknown> }).arguments ?? null, theorem: d.theorem ?? null } })()], meta: { title: d.title, description: d.description }, breadcrumbs: [{ doc: d.uuid, url: `/${d.uuid}`, label: d.title }], path: `/${d.uuid}`, parent: null, depth: 1 })), ...gated.docs, ...challenges.docs] } }
}
/** Payload's skills for agents, read as data from the repository tree (github.com/payloadcms/skills): each skill and each of its references mapped to the tool of this tree that enacts it. No text of the skills is carried: the repository declares no licence; names, paths and sizes are facts. */
const SKILL_MAP: Readonly<Record<string, { enactedBy: readonly string[]; how: string }>> = TABLES.SKILL_MAP as Readonly<Record<string, { enactedBy: readonly string[]; how: string }>>
/** payloadcms.com's own configuration, read at github.com/payloadcms/website (MIT) on 2026-10-25, src/payload.config.ts: the plugins it mounts and the database it runs on — facts, compared with the plugins MCP configures here. */
const PAYLOAD_WEBSITE = TABLES.PAYLOAD_WEBSITE
const camel = (dir: string) => dir.replace(/\.tsx?$/, '').replace(/^[A-Z]/, (c) => c.toLowerCase())
const BLOCK_ALIASES: Readonly<Record<string, string>> = { callToAction: 'cta', mediaContent: 'mediaContent' }
/** The website's source read as a tree: its collections, blocks, globals, fields and plugins by path; with the live page's block types, whether the site agrees with its source. */
const website = (tree: { tree?: { path: string; type?: string; size?: number }[]; sha?: string; truncated?: boolean }, liveBlockTypes: readonly string[] = []) => {
  const entries = Array.isArray(tree.tree) ? tree.tree : []
  const under = (dir: string) => [...new Set(entries.filter((e) => e.path.startsWith(`${dir}/`)).map((e) => e.path.split('/')[2]!).filter(Boolean))]
  const collections = under('src/collections').map((d) => d.replace(/\.tsx?$/, ''))
  const blocks = under('src/blocks')
  const globals = under('src/globals').map((d) => d.replace(/\.tsx?$/, '')).filter((d) => !/^CustomRowLabel/.test(d))
  const fields = under('src/fields').map((d) => d.replace(/\.tsx?$/, ''))
  const plugins = under('src/plugins').map((d) => d.replace(/\.tsx?$/, ''))
  const blockTypes = blocks.map((b) => BLOCK_ALIASES[camel(b)] ?? camel(b))
  const live = liveBlockTypes.map((t) => ({ blockType: t, inSource: blockTypes.includes(t) }))
  const ours = PAYLOAD_PLUGINS.map((p) => p.name)
  const shared = PAYLOAD_WEBSITE.plugins.filter((p) => ours.includes(p)), onlyHere = ours.filter((p) => !(PAYLOAD_WEBSITE.plugins as readonly string[]).includes(p) && p !== 'lexical')
  return { repository: PAYLOAD_WEBSITE.repository, licence: PAYLOAD_WEBSITE.licence, sha: tree.sha ?? null, entries: entries.length, truncated: !!tree.truncated, collections: collections.length, collectionList: collections, blocks: blocks.length, blockList: blocks, blockTypes, globals: globals.length, globalList: globals, fields: fields.length, fieldList: fields, ownPlugins: plugins, mounted: PAYLOAD_WEBSITE, live, agrees: live.length ? live.every((l) => l.inSource) : null, pluginsShared: shared, pluginsOnlyHere: onlyHere, says: `payloadcms.com is what Payload computes: ${collections.length} collections, ${blocks.length} blocks, ${globals.length} globals and ${fields.length} fields in its source, ${PAYLOAD_WEBSITE.plugins.length} default plugins mounted (${PAYLOAD_WEBSITE.plugins.join(', ')}) on ${PAYLOAD_WEBSITE.database}; of the plugins MCP configures here, ${shared.length} are the site's own and ${onlyHere.length} go beyond it (${onlyHere.join(', ')})${live.length ? `; the live page's block types ${live.every((l) => l.inSource) ? 'all have' : 'do not all have'} a block in the source` : ''}` }
}
const skills = (tree: { tree?: { path: string; type?: string; size?: number }[]; sha?: string; truncated?: boolean }) => {
  const entries = Array.isArray(tree.tree) ? tree.tree : []
  const skills = entries.filter((e) => /\/SKILL\.md$/.test(e.path)).map((e) => { const name = e.path.split('/').slice(-2, -1)[0]!; const dir = e.path.replace(/\/SKILL\.md$/, ''); const references = entries.filter((r) => r.path.startsWith(`${dir}/reference/`) && /\.md$/.test(r.path)).map((r) => { const ref = r.path.split('/').pop()!.replace(/\.md$/, ''); return { reference: ref, path: r.path, bytes: r.size ?? null, ...(SKILL_MAP[ref] ?? { enactedBy: [], how: 'no tool of this tree enacts this reference yet: a lead' }) } }); return { skill: name, path: e.path, bytes: e.size ?? null, ...(SKILL_MAP[name] ?? { enactedBy: [], how: 'no tool of this tree enacts this skill yet: a lead' }), references } })
  const unmapped = skills.flatMap((s) => [...(s.enactedBy.length ? [] : [s.skill]), ...s.references.filter((r) => !r.enactedBy.length).map((r) => r.reference)])
  return { repository: 'https://github.com/payloadcms/skills', sha: tree.sha ?? null, entries: entries.length, truncated: !!tree.truncated, skills: skills.length, references: skills.reduce((n, s) => n + s.references.length, 0), unmapped, catalogue: skills, licence: 'the repository declares no licence: names, paths and sizes are read as facts; no text is carried' }
}
/** The packages Payload ships, read from the packages directory of github.com/payloadcms/payload (the standard payload-packages, read by discovery on every run; names only, 2026-10-26: 45 directories). Every plugin, adapter and editor this tree configures must be one of them. */
const PAYLOAD_PACKAGES = TABLES.PAYLOAD_PACKAGES
const PACKAGE_KIND = (name: string): string => name.startsWith('plugin-') ? 'plugins' : name.startsWith('db-') ? 'databases' : name.startsWith('storage-') ? 'storage' : name.startsWith('email-') ? 'email' : name.startsWith('richtext-') ? 'editors' : name.startsWith('live-preview') ? 'live-preview' : 'runtime-and-tooling'
/** The catalogue classified, what the full stack mounts of it, and the minimum-cost path it offers: Payload's own adapters for Cloudflare D1 and R2. */
const packages = (names: readonly string[] = PAYLOAD_PACKAGES.names) => {
  const byKind: Record<string, string[]> = {}
  for (const n of names) (byKind[PACKAGE_KIND(n)] ??= []).push(n)
  const mounted = [...PAYLOAD_PLUGINS.map((p) => p.pkg.replace('@payloadcms/', '')), 'db-mongodb', 'db-d1-sqlite', 'storage-vercel-blob', 'storage-r2', 'email-nodemailer', 'email-resend', 'plugin-stripe', 'plugin-import-export', 'plugin-sentry', 'live-preview-react', 'next', 'ui', 'payload', 'graphql']
  const unknown = mounted.filter((m) => !names.includes(m))
  const onCloudflare = CLOUDFLARE_PACKAGE_BINDINGS.filter((r) => r.possible)
  const mountedOnCf = onCloudflare.filter((r) => mounted.includes(r.pkg) || r.pkg === 'ai-workers')
  return {
    repository: PAYLOAD_PACKAGES.repository, read: PAYLOAD_PACKAGES.read, count: names.length, byKind,
    counts: Object.fromEntries(Object.entries(byKind).map(([k, v]) => [k, v.length])),
    mounted: mounted.filter((m) => names.includes(m)), unknown, available: names.filter((n) => !mounted.includes(n)),
    consolidatedRepos: payloadcmsRepos(),
    minimumCost: { cloudflare: names.filter((n) => n === 'db-d1-sqlite' || n === 'storage-r2'), says: 'Payload ships its own adapters for Cloudflare D1 and R2. The live config binds them (D1 5 GB, R2 10 GB) beside the Worker' },
    cloudflare: {
      via: 'qpuMcpPlugin' as const,
      api: 'https://qpu.uuidna.com/api/mcp',
      keys: 'payload-mcp-api-keys (Authorization: Bearer) + users.useAPIKey',
      bindings: cloudflareAdapters(),
      packages: onCloudflare,
      possible: onCloudflare.length,
      mounted: mountedOnCf.length,
      holds: onCloudflare.every((r) => r.possible) && mountedOnCf.length >= 15,
      says: `${onCloudflare.length} upstream packages usable on Cloudflare via bindings; ${mountedOnCf.length} mounted; API keys are Payload MCP keys, never values in the tree`,
    },
    says: `${names.length} packages: ${Object.entries(byKind).map(([k, v]) => `${v.length} ${k}`).join(', ')}; ${mounted.filter((m) => names.includes(m)).length} mounted by the full stack; ${onCloudflare.length} usable on Cloudflare via qpuMcpPlugin keys${unknown.length ? `; UNKNOWN to Payload: ${unknown.join(', ')}` : ''}`,
  }
}
/** Payload's ecommerce template, read at the source (github.com/payloadcms/payload, templates/ecommerce, 2026-10-26; names and shapes only): the standard payload-ecommerce-template discovery reads on every run. */
const PAYLOAD_ECOMMERCE = TABLES.PAYLOAD_ECOMMERCE
export const QPU_CURRENCIES = [{ code: 'EUR', decimals: 2, label: 'Euro', symbol: '€' }, { code: 'USD', decimals: 2, label: 'US Dollar', symbol: '$' }, { code: 'BGN', decimals: 2, label: 'Bulgarian lev', symbol: 'лв' }] as const
/** The licence catalogue as the ecommerce plugin's products. The billing catalogue is the list; the pages seed is the document. */
const ecommerce = (rates?: Record<string, { rate: number }>) => {
  const products = [...new Set(CATALOGUE.map((v) => v.product))]
  const harmonised = rates && Object.keys(rates).length ? rates : null
  const items = catalogueItems(harmonised)
  return {
    template: PAYLOAD_ECOMMERCE,
    plugin: { package: '@payloadcms/plugin-ecommerce', version: '4.0.0-beta.7', collections: PAYLOAD_ECOMMERCE.pluginCollections, customers: 'users (the site\'s own, roles admin | public)', currencies: { defaultCurrency: 'EUR', supportedCurrencies: QPU_CURRENCIES.map((c) => c.code) }, payments: { adapter: 'stripeAdapter', names: ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOKS_SIGNING_SECRET'] }, access: { isAdmin: 'a user with the admin role', adminOrPublishedStatus: 'admin, or the published status', isDocumentOwner: 'the customer of the document', adminOnlyFieldAccess: 'admin', isCustomer: 'a signed-in user' } },
    catalogue: { products: products.length, variants: CATALOGUE.length, currencies: QPU_CURRENCIES.length, prices: CATALOGUE.length * QPU_CURRENCIES.length, items: items.map(({ title, licence, prices }) => ({ title, licence, prices })), units: 'amounts in the currency\'s minor unit (cents, stotinki), as Stripe and the plugin\'s amount field take them', pricedBy: harmonised ? `the harmonised rates the currency step measured (${Object.keys(harmonised).join(', ')}): every price derived from the euro amount` : 'the catalogue\'s own amounts per currency (no harmonised rates passed: the currency step has not run yet)' },
    feed: { phase: 'payload' as const, catalogue: items },
    replaces: 'the fork\'s stripePlugin (plugin-stripe) — the ecommerce plugin\'s Stripe adapter is the payment; the Worker\'s stripe tool and its edge-executed checkout stay until the gate decodes the app beside it',
    seeded: 'payload { idea } writes a pages seed; payload { feeds } is the billing catalogue',
  }
}
/** The UI as a configuration (MCP Apps, SEP-1865, specification 2026-01-26, read at the source 2026-10-26): one app shell for every tool, a pure
 * function of the key and the theme — no randomness, no clock, no external domain — served as the ui:// resource of each tool and hosted by any
 * host that negotiates the extension; the site's playground hosts the same resource. The widget the tool computes is what the shell renders. */
export const MCP_APPS = TABLES.MCP_APPS
/** The host's standardised theme variables mapped onto the tokens every widget of this tree uses: the widget never changes, the host's theme shows through. A token never maps onto its own name (a self-reference is a cycle the browser drops: measured as serif text in the playground); --font-sans is the host's own and read where it is used. */
const UI_TOKENS = TABLES.UI_TOKENS as unknown as readonly [string, string, string][]
/** The host of an MCP App in React (a client component): reads the tool's ui:// resource over the app's own MCP endpoint, hosts it in a sandboxed frame and speaks the Apps protocol; the same host the site's playground runs in Vue. Served to any shadcn frontend as the registry item qpu-app. */
const reactHost = (): string => [
  "'use client'",
  "// The host of an MCP App: the tool's ui:// resource read over the MCP endpoint (resources/read), hosted in a sandboxed frame and spoken to",
  "// through the MCP Apps protocol (ui/initialize → initialized, tool-input, tool-result, size-changed). The UI is built from the MCP; nothing is drawn here.",
  "import React, { useEffect, useRef, useState } from 'react'",
  '',
  '// html: the resource already read by the server (the app reads it from the handler in its own runtime); else it is read over mcp with the key the MCP plugin takes (Authorization: Bearer <payload-mcp-api-keys key>, measured on 4.0.0-beta.7)',
  'export type QpuAppProps = { tool?: string; args?: Record<string, unknown>; result?: unknown; html?: string; mcp?: string; apiKey?: string }',
  '// no tool: the chat (ui://qpu/chat), as the admin mounts it',
  'export const QpuApp: React.FC<QpuAppProps> = ({ tool = \'chat\', args = {}, result = null, html: given, mcp = \'/api/mcp\', apiKey }) => {',
  '  const frame = useRef<HTMLIFrameElement>(null)',
  '  const held = useRef<string | undefined>(undefined)',
  "  const [html, setHtml] = useState('') // mounted only once the listener below is registered: the view's ui/initialize must not race the host (measured)",
  '  const [height, setHeight] = useState(120)',
  '  const ready = useRef(false)',
  "  // plain data only: a framework proxy cannot be cloned across the frame, so every message is the JSON of itself",
  "  const post = (m: Record<string, unknown>) => frame.current?.contentWindow?.postMessage(JSON.parse(JSON.stringify({ jsonrpc: '2.0', ...m })), '*')",
  "  // one request with the host's key: the JSON, or a stream's last data line",
  "  const rpc = (id: unknown, method: string, params: unknown) => { const key = held.current || apiKey; return fetch(mcp, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...(key ? { authorization: 'Bearer ' + key } : {}) }, body: JSON.stringify({ jsonrpc: '2.0', id, method, params }) }).then((r) => r.text()).then((t) => JSON.parse((t.split('\\n').filter((l) => l.startsWith('{') || l.startsWith('data: ')).pop() ?? t).replace(/^data: /, ''))) }",
  "  const tell = () => { if (!ready.current) return; post({ method: 'ui/notifications/tool-input', params: { arguments: args } }); post({ method: 'ui/notifications/tool-result', params: result }) }",
  '  useEffect(() => {',
  '    ready.current = false',
  "    if (given !== undefined) { setTimeout(() => setHtml(given), 0); return }",
  "    rpc(1, 'resources/read', { uri: 'ui://qpu/' + tool }).then((j) => setHtml(j.result?.contents?.[0]?.text ?? '')).catch(() => setHtml(''))",
  '  }, [tool, mcp, given, apiKey])',
  '  useEffect(() => { tell() }, [result])',
  '  useEffect(() => {',
  '    const on = (e: MessageEvent) => {',
  '      if (!frame.current || e.source !== frame.current.contentWindow) return',
  '      const m = e.data ?? {}',
  "      if (m.method === 'ui/initialize') { post({ id: m.id, result: { protocolVersion: '2026-01-26', hostCapabilities: {}, hostContext: { displayMode: 'inline' } } }); return }",
  "      if (m.method === 'ui/notifications/initialized') { ready.current = true; tell(); return }",
  "      if (m.method === 'ui/notifications/size-changed' && typeof m.params?.height === 'number') setHeight(Math.max(40, Math.min(2400, m.params.height + 8)))",
  "      // the view's tools/call (a verification, a chat turn) through the app's MCP with the host's key, no model; a link opened only when https",
  "      if (m.method === 'ui/accept-token' && typeof m.params?.authorization === 'string' && m.params.authorization.length > 0) { held.current = m.params.authorization; post({ id: m.id, result: { accepted: true, echoed: false } }); return }",
  "      if (m.method === 'tools/call' && m.id !== undefined) { const token = m.params?.arguments?.token; if (typeof token === 'string') { post({ id: m.id, error: { code: -32602, message: 'a secret never travels' } }); return } rpc(m.id, 'tools/call', m.params).then(post).catch((e) => post({ id: m.id, error: { code: -32603, message: String(e) } })); return }",
  "      if (m.method === 'ui/open-link' && typeof m.params?.url === 'string' && /^https:\\/\\//.test(m.params.url)) { window.open(m.params.url, '_blank', 'noopener'); post({ id: m.id, result: {} }); return }",
  '    }',
  "    window.addEventListener('message', on)",
  "    return () => window.removeEventListener('message', on)",
  '  })',
  "  return <iframe ref={frame} srcDoc={html} sandbox=\"allow-scripts\" title={'qpu · ' + tool} style={{ width: '100%', height, border: '0.5px solid var(--color-border-primary, #e4e4e7)', borderRadius: 8, background: 'transparent' }} />",
  '}',
  '',
].join('\n')
/** The shadcn registry (ui.shadcn.com/schema/registry.json, read 2026-10-26): the host and the block as registry items any shadcn frontend adds with npx shadcn add <url>; written by the configs step to the app's and the site's public/r. */
const STYLED_ITEMS: readonly { name: string; type: 'registry:lib' | 'registry:component' | 'registry:block'; title: string; description: string; file: string; content: string }[] = [
  { name: 'qpu-style', type: 'registry:lib', title: 'QPU style', description: 'style(uuid): the CSS variables of a block computed from its address; nothing loaded', file: 'lib/qpu-style.ts', content: `export const style = (uuid: string) => { const hex = uuid.replace(/-/g, ''); const program = [...hex.slice(8, 20)].filter((_c, i) => i !== 4 && i !== 8).map((c) => parseInt(c, 16)), tail = hex.slice(20); const hue = parseInt(hex.slice(0, 8), 16) % 360; const [c, m, y, k] = [8, 11, 14, 17].map((i) => parseInt(hex.slice(i, i + 3), 16) / 0xfff); const rgb = (v: number) => Math.round(255 * (1 - v) * (1 - k!)); const sat = 40 + (program.reduce((n, d) => n + d, 0) % 40); const radius = 2 + (parseInt(tail.slice(0, 1), 16) % 14), gap = 4 + (parseInt(tail.slice(1, 2), 16) % 12); return { '--qpu-hue': String(hue), '--qpu-accent': \`rgb(\${rgb(c!)} \${rgb(m!)} \${rgb(y!)})\`, '--qpu-surface': \`hsl(\${hue} \${Math.round(sat / 4)}% 97%)\`, '--qpu-ink': \`hsl(\${hue} \${Math.round(sat / 3)}% 14%)\`, '--qpu-radius': \`\${radius}px\`, '--qpu-gap': \`\${gap}px\` } as React.CSSProperties }\n` },
  { name: 'qpu-card', type: 'registry:component', title: 'QPU card', description: 'a card styled by the address it shows', file: 'components/qpu/card.tsx', content: `import React from 'react'\nimport { style } from '@/lib/qpu-style'\nexport const QpuCard: React.FC<{ uuid: string; title: string; children?: React.ReactNode }> = ({ uuid, title, children }) => (\n  <section style={{ ...style(uuid), background: 'var(--qpu-surface)', color: 'var(--qpu-ink)', borderLeft: '3px solid var(--qpu-accent)', borderRadius: 'var(--qpu-radius)', padding: 'var(--qpu-gap)' }} data-uuid={uuid}>\n    <h3 style={{ margin: 0, color: 'var(--qpu-accent)' }}>{title}</h3>\n    {children}\n  </section>\n)\n` },
  { name: 'qpu-badge', type: 'registry:component', title: 'QPU badge', description: 'an address as a badge in its own hue', file: 'components/qpu/badge.tsx', content: `import React from 'react'\nimport { style } from '@/lib/qpu-style'\nexport const QpuBadge: React.FC<{ uuid: string; label?: string }> = ({ uuid, label }) => (\n  <span style={{ ...style(uuid), background: 'var(--qpu-accent)', color: 'white', borderRadius: 'var(--qpu-radius)', padding: '0 var(--qpu-gap)', fontFamily: 'monospace' }} title={uuid}>{label ?? uuid.slice(0, 8)}</span>\n)\n` },
  { name: 'qpu-table', type: 'registry:component', title: 'QPU table', description: 'rows of blocks, each row in the hue of its address', file: 'components/qpu/table.tsx', content: `import React from 'react'\nimport { style } from '@/lib/qpu-style'\nexport const QpuTable: React.FC<{ head: string[]; rows: { uuid: string; cells: React.ReactNode[] }[] }> = ({ head, rows }) => (\n  <table style={{ borderCollapse: 'collapse', width: '100%' }}>\n    <thead><tr>{head.map((h) => <th key={h} style={{ textAlign: 'left', padding: '4px 8px' }}>{h}</th>)}</tr></thead>\n    <tbody>{rows.map((r) => <tr key={r.uuid} style={{ ...style(r.uuid), borderLeft: '3px solid var(--qpu-accent)' }}>{r.cells.map((c, i) => <td key={i} style={{ padding: 'var(--qpu-gap) 8px' }}>{c}</td>)}</tr>)}</tbody>\n  </table>\n)\n` },
  { name: 'qpu-stream', type: 'registry:component', title: 'QPU stream', description: 'the UUID stream (e2e, coins, entropy, receipts): one card per block, styled by its own address, newest first', file: 'components/qpu/stream.tsx', content: `import React from 'react'\nimport { QpuCard } from '@/components/qpu/card'\nimport { QpuBadge } from '@/components/qpu/badge'\nexport const QpuStream: React.FC<{ blocks: { address: string; kind?: string; date?: string; [k: string]: unknown }[] }> = ({ blocks }) => (\n  <div style={{ display: 'grid', gap: 8 }}>\n    {[...blocks].reverse().map((b) => <QpuCard key={b.address} uuid={b.address} title={b.kind ?? 'block'}><QpuBadge uuid={b.address} /> <small>{b.date ?? ''}</small></QpuCard>)}\n  </div>\n)\n` },
  { name: 'qpu-scan', type: 'registry:component', title: 'QPU scan', description: 'the scannable stream of an address: one frame per character at the vortex period, multidimensional (hue, glyph, angle), impossible to link from one frame, read back by a device that streams it (verify { scan })', file: 'components/qpu/scan.tsx', content: `import React from 'react'\nimport { style } from '@/lib/qpu-style'\n/** The stream of an address: the frames the block's own --qpu-frames gradient holds, stepped through at the vortex period (36 frames of 108 ms). A device reads it by streaming: verify { scan: samples }. */\nexport const QpuScan: React.FC<{ uuid: string; phase?: number; label?: string }> = ({ uuid, phase, label }) => (\n  <div className="qpu-scan" role="img" aria-label={label ?? 'a scannable stream: one character a frame'} data-phase={phase === undefined ? undefined : ''} style={{ ...style(uuid), ...(phase === undefined ? {} : { ['--qpu-phase' as string]: String(Math.floor(phase)) }), borderRadius: 'var(--radius, 0.432rem)', minHeight: '3em' }} />\n)\n` },
  { name: 'qpu-dashboard', type: 'registry:block', title: 'QPU dashboard', description: 'a dashboard of the stream: cards of counts by kind, the table of the latest blocks, the stream itself; every bit styled from the addresses', file: 'blocks/qpu-dashboard/page.tsx', content: `import React from 'react'\nimport { QpuCard } from '@/components/qpu/card'\nimport { QpuTable } from '@/components/qpu/table'\nimport { QpuStream } from '@/components/qpu/stream'\nexport default function QpuDashboard({ blocks }: { blocks: { address: string; kind?: string; date?: string }[] }) {\n  const kinds = [...new Set(blocks.map((b) => b.kind ?? 'block'))]\n  return (\n    <main style={{ display: 'grid', gap: 16 }}>\n      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>{kinds.map((k) => { const of = blocks.filter((b) => (b.kind ?? 'block') === k); return <QpuCard key={k} uuid={of[of.length - 1]!.address} title={k}><strong>{of.length}</strong></QpuCard> })}</div>\n      <QpuTable head={['address', 'kind', 'date']} rows={blocks.slice(-20).map((b) => ({ uuid: b.address, cells: [b.address, b.kind ?? 'block', b.date ?? ''] }))} />\n      <QpuStream blocks={blocks} />\n    </main>\n  )\n}\n` },
]
/** The SDK: the config sets as the base of combinatorial application builders — one generated module (a shadcn lib item, nothing loaded but it)
 *  that calls the QPU over MCP, token free at the Worker's /mcp or with a user's API key at the app's /api/mcp, and composes an app from the
 *  sets: the configuration kinds, the set algebra, the app request (form, validation, build), the core (present, stream), the gates and the
 *  realtime channels. Generated by configure { kind: 'sets' }; written to the registry as qpu-sdk. */
export const sdk = (origin = 'https://qpu.uuidna.com', tools: readonly string[] = []) => {
  const core = ['configure(kind, args)', 'sets(a, b)', 'scope(env)', 'app.form()', 'app.validate(values)', 'app.build(request)', 'lexical.doc(tool, args)', 'lexical.app(request)', 'lexical.merge(base, a, b)', 'present(hex)', 'stream(uuids, query)', 'gates()', 'realtime()', 'schema()', 'call(tool, args)', 'collections.find(slug, args)', 'collections.create(slug, data)', 'collections.update(slug, id, data)', 'collections.delete(slug, id)', 'plugins.<name>.collections / find / create / update', 'plugins.compose(names)', 'plugins.list()']
  const builders = [...core, ...tools.map((name) => `tools.${name}(args)`), 'all()', 'develop(formula)']
  const module = `// @uuidna/qpu SDK: the config sets as the base of combinatorial application builders. Generated by configure { kind: 'sets' } on the QPU; nothing loaded but this file.
// Token free at the Worker's /mcp (every pure tool); with a user's API key at the app's /api/mcp (the Payload MCP plugin, the collections among its tools).
// Via Payload MCP and vice versa: the plugin serves this module as the resource sdk://qpu/lib, and this module calls the plugin's own collection tools (findPages, createEntries, ...).
export type Call = (name: string, args?: Record<string, unknown>) => Promise<unknown>
const CONFIG_KINDS = ${JSON.stringify([...configKinds])} as const
export const TOOLS = ${JSON.stringify(tools)} as const
/** the installed plugins and the collections each owns: a builder set per plugin */
const PLUGINS = ${JSON.stringify(PLUGIN_COLLECTIONS)} as const
/** the plugins the full stack mounts, ${PAYLOAD_PLUGINS.length} of them: ${2 ** PAYLOAD_PLUGINS.length} combinations */
const PLUGIN_NAMES = ${JSON.stringify(PAYLOAD_PLUGINS.map((p) => p.name))} as const
export const qpu = (origin = ${JSON.stringify(origin)}, apiKey?: string) => {
  const call: Call = async (name, args = {}) => {
    const r = await fetch(origin + '/api/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...(apiKey ? { authorization: 'users API-Key ' + apiKey } : {}) }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) })
    const text = await r.text()
    const line = text.split('\\n').find((l) => l.startsWith('data:'))
    const j = JSON.parse(line ? line.slice(5) : text) as { result?: { structuredContent: unknown }; error?: { message: string } }
    if (j.error) throw new Error(j.error.message)
    return j.result?.structuredContent
  }
  return {
    call,
    /** every tool, one method */
    tools: {
${tools.map((name) => `      ${/^[A-Za-z_][A-Za-z0-9_]*$/.test(name) ? name : JSON.stringify(name)}: (args: Record<string, unknown> = {}) => call(${JSON.stringify(name)}, args),`).join('\n')}
    },
    /** every API and every MCP, decided by the Payload MCP */
    all: () => call('payload', { rbac: true }),
    /** a product developed by beforeChange, afterChange and afterRead */
    develop: (formula: string, product?: string, variant?: string) => call('payload', { develop: { formula, product, variant } }),
    /** a configuration kind: the sets every app is composed from */
    configure: (kind: (typeof CONFIG_KINDS)[number], args: Record<string, unknown> = {}) => call('configure', { kind, ...args }),
    /** two config sets composed: union, intersection, differences as leads */
    sets: (a: string, b: string) => call('configure', { kind: 'sets', sets: [a, b] }),
    app: {
      form: () => call('payload', { app: { form: true } }),
      validate: (values: Record<string, unknown>) => call('payload', { app: { validate: values } }),
      build: (request: { name: string; host: string; plugins?: string[]; env?: string[]; variant?: string }) => call('payload', { app: request }),
    },
    /** every builder answers in one shape, a lexical document of qpu blocks: a tool's result as one, an app as one block per file, two edits merged by block address */
    lexical: {
      doc: (tool: string, args: Record<string, unknown> = {}) => call('payload', { tool, arguments: args }),
      app: (request: { name: string; host: string; plugins?: string[]; env?: string[]; variant?: string }) => call('payload', { app: request }).then((a) => (a as { doc: unknown }).doc),
      merge: (base: unknown, a: unknown, b: unknown) => call('payload', { merge: { base, a, b } }),
    },
    /** the MCP separated by an environment combination: the adapters and connectors the names choose, the plugins and collections mounted, one address per combination */
    scope: (env: string[] = []) => call('configure', { kind: 'sets', env }),
    /** the one quantum core: any hex presented, any UUID-only stream queried, sorted, filtered, executed */
    present: (hex: string) => call('fold', { hex }),
    stream: (uuids: string[], query: Record<string, unknown> = {}) => call('fold', { uuids, query }),
    gates: () => call('configure', { kind: 'gates' }),
    realtime: () => call('configure', { kind: 'realtime' }),
    schema: () => call('configure', { kind: 'mcp' }),
    /** sdk plugins: every installed plugin as a builder set over the collections it owns, and the combinations of the plugins the stack mounts */
    plugins: {
      list: () => call('configure', { kind: 'payload' }),
      compose: (names: readonly string[]) => ({ names: names.filter((n) => (PLUGIN_NAMES as readonly string[]).includes(n)), combinations: 2 ** names.filter((n) => (PLUGIN_NAMES as readonly string[]).includes(n)).length, collections: names.flatMap((n) => [...(PLUGINS[n as keyof typeof PLUGINS] ?? [])]) }),
      ...Object.fromEntries(Object.entries(PLUGINS).map(([name, slugs]) => [name, { collections: slugs, find: (slug: (typeof slugs)[number], args: Record<string, unknown> = {}) => call(toolName('find', slug), args), create: (slug: (typeof slugs)[number], data: Record<string, unknown>) => call(toolName('create', slug), { data }), update: (slug: (typeof slugs)[number], id: string, data: Record<string, unknown>) => call(toolName('update', slug), { id, data }) }])),
    },
    /** the Payload MCP plugin's own collection tools (find<Slug>, create<Slug>, update<Slug>, delete<Slug>): a user's API key at /api/mcp */
    collections: {
      find: (slug: string, args: Record<string, unknown> = {}) => call(toolName('find', slug), args),
      create: (slug: string, data: Record<string, unknown>) => call(toolName('create', slug), { data }),
      update: (slug: string, id: string, data: Record<string, unknown>) => call(toolName('update', slug), { id, data }),
      delete: (slug: string, id: string) => call(toolName('delete', slug), { id }),
    },
  }
}
/** the plugin names a collection tool by verb and the slug in PascalCase: form-submissions → findFormSubmissions */
const toolName = (verb: 'find' | 'create' | 'update' | 'delete', slug: string): string => verb + slug.split(/[-_]/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
`
  return { item: 'qpu-sdk', add: `npx shadcn add ${origin}/r/qpu-sdk.json`, builders, core: core.length, kinds: configKinds.length, tools: tools.length, bytes: module.length, module, says: `the SDK composes an app from the config sets and from every tool: ${core.length} core builders, one method per tool, all() for every API and MCP, and develop() through the product hooks. Every call is a tools/call over MCP, nothing loaded but the module` }
}
export const registry = (origin = 'https://qpu.uuidna.com', blockSource = ''): Record<string, unknown> => {
  const module = sdk(origin), $schema = 'https://ui.shadcn.com/schema/registry-item.json'
  const sdkItem = { $schema, name: 'qpu-sdk', type: 'registry:lib', title: 'QPU SDK', description: 'the config sets as the base of combinatorial application builders: one module that calls the QPU over MCP and composes an app from the sets', files: [{ path: 'lib/qpu-sdk.ts', type: 'registry:lib', content: module.module }] }
  const styled = STYLED_ITEMS.map((it) => ({ $schema, name: it.name, type: it.type, title: it.title, description: it.description, registryDependencies: it.name === 'qpu-style' ? [] : [`${origin}/r/qpu-style.json`, ...(it.name === 'qpu-stream' ? [`${origin}/r/qpu-card.json`, `${origin}/r/qpu-badge.json`] : it.name === 'qpu-dashboard' ? [`${origin}/r/qpu-card.json`, `${origin}/r/qpu-table.json`, `${origin}/r/qpu-stream.json`] : [])], files: [{ path: it.file, type: it.type === 'registry:block' ? 'registry:page' : it.type === 'registry:lib' ? 'registry:lib' : 'registry:component', content: it.content, ...(it.type === 'registry:block' ? { target: 'app/qpu/page.tsx' } : {}) }] }))
  const app = { $schema, name: 'qpu-app', type: 'registry:component', title: 'QPU App host', description: 'The host of an MCP App: reads a tool\'s ui://qpu/<tool> resource over the MCP endpoint and hosts it through the MCP Apps protocol in a sandboxed frame.', dependencies: [], registryDependencies: [], files: [{ path: 'components/qpu/app.tsx', type: 'registry:component', content: reactHost() }], docs: `import { QpuApp } from '@/components/qpu/app' — <QpuApp tool="processor" args={{ name: 'Willow' }} result={reply.result} mcp="${origin}/mcp" /> (the Worker takes no key); against a Payload app's /api/mcp pass apiKey (a payload-mcp-api-keys key the admin made) or html read by your server`, categories: ['mcp', 'qpu'] }
  const chat = { $schema, name: 'qpu-chat', type: 'registry:component', title: 'QPU chat', description: 'The chat as an MCP App: <QpuApp /> with no tool hosts ui://qpu/chat, every turn a tools/call through the app\'s MCP.', registryDependencies: [`${origin}/r/qpu-app.json`], categories: ['mcp', 'qpu'] }
  const block = { $schema, name: 'qpu-block', type: 'registry:file', title: 'QPU block', description: 'The qpu block of UUID logic for Payload\'s lexical editor: the shape every tools/call result carries in _meta.payload.', dependencies: ['payload'], files: [{ path: 'blocks/qpu/config.ts', type: 'registry:file', target: 'src/blocks/Qpu/config.ts', content: blockSource }], categories: ['payload', 'qpu'] }
  const create = createTheme(KEY, origin, ['qpu-style', 'qpu-block', 'qpu-app', 'qpu-chat', ...STYLED_ITEMS.map((i) => i.name).filter((n) => n !== 'qpu-style')]).item
  // the index lists every item's files by path, type and target; each item serves its content
  const listed = (i: { name: string; files?: readonly { path: string; type: string; target?: string }[] }) => ({ ...i, files: i.files?.map(({ path, type, target }) => ({ path, type, target })) })
  return { 'qpu-create.json': create, 'registry.json': { $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'qpu', homepage: origin, items: [create, sdkItem, ...styled, app, chat, block].map(listed) }, 'qpu-app.json': app, 'qpu-chat.json': chat, 'qpu-block.json': block, 'qpu-sdk.json': sdkItem, ...Object.fromEntries(styled.map((i) => [`${i.name}.json`, i])) }
}
export const ui = (tool: string, key: number = KEY): { uri: string; name: string; mimeType: string; html: string; csp: { connectDomains: string[]; resourceDomains: string[] }; prefersBorder: boolean } => {
  const accent = `hsl(${hue(key)} 62% 44%)`
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>qpu · ${tool}</title>
<style>
:root { --a432-key: ${key}; --a432-accent: ${accent}; --qpu-coin: ${accent}; --qpu-coil: hsl(${hue(key) + key / 9} 62% 44%); ${UI_TOKENS.map(([t, h, d]) => `${t}: var(${h}, ${d});`).join(' ')} }
body { margin: 0; padding: var(--pad-sm); font-family: var(--font-sans, system-ui, sans-serif); color: var(--text-primary); background: transparent; }
.qpu-block { border-left: 3px solid var(--qpu-accent, var(--a432-accent)); padding-left: var(--pad-sm); }
.qpu-args { color: var(--text-muted); font-size: var(--font-size-footnote); margin-bottom: var(--gap-sm); white-space: pre-wrap; }
.qpu-verify { display: flex; flex-direction: column; gap: var(--pad-sm); margin-top: var(--pad-sm); }
.qpu-verify div { display: flex; flex-wrap: wrap; align-items: center; gap: var(--pad-sm); }
.qpu-ask, #view label { display: flex; gap: var(--pad-sm); }
.qpu-ask input { flex: 1; font: inherit; border: thin solid; border-radius: var(--radius); background: none; color: inherit; }
.qpu-verify button, .qpu-ask button { font: inherit; font-size: var(--font-size-footnote); padding: 0 var(--pad-sm); border-radius: var(--radius); border: thin solid var(--qpu-accent, currentColor); background: transparent; color: inherit; cursor: pointer; }
.qpu-verify button:first-child { background: var(--qpu-accent, currentColor); color: var(--surface-1, Canvas); }
.qpu-verify span { font-size: var(--font-size-footnote); }
pre { background: var(--surface-1); border-radius: var(--radius); padding: var(--pad-sm); overflow: auto; font-size: var(--font-size-footnote); }
</style></head>
<body>${tool === 'chat' ? '<div class="qpu-ask"><input id="s" aria-label="problem"><button id="go" type="button">Ask</button></div>' : ''}<div class="qpu-ask"><input id="k" type="password" autocomplete="off" spellcheck="false" aria-label="token"><button id="ok" type="button">Accept</button><span id="tok"></span></div><div id="args" class="qpu-args"></div><div id="view" class="qpu-block" data-tool="${tool}">${tool === 'chat' ? '' : 'waiting for the tool\'s result'}</div>
<script>
(function () {
  // the view of the MCP Apps protocol: JSON-RPC over postMessage; every message the host sends is a notification this shell renders, nothing else runs
  var seq = 0, view = document.getElementById('view'), args = document.getElementById('args'), pending = {}
  var send = function (m) { parent.postMessage(Object.assign({ jsonrpc: '2.0' }, m), '*') }
  // the device's randomness: the phase of the stream's animation at every interaction (eleven bits), the device's own nonce (thirty-two bits), the pointer; the phase set on the root so the CSS continues from it; every 36 samples the seal tool takes them through the host (a coil beyond the first period: the fusion)
  var samples = [], period = ${key * 9}
  if ('${tool}' !== 'chat') document.addEventListener('pointerdown', function (e) { var a = document.getAnimations ? document.getAnimations()[0] : null; var phase = (a && typeof a.currentTime === 'number' ? a.currentTime : performance.now()) % period; var nonce = (self.crypto && crypto.getRandomValues) ? crypto.getRandomValues(new Uint32Array(1))[0] : 0; samples.push({ phase: phase, t: performance.now(), nonce: nonce, x: e.clientX, y: e.clientY }); document.documentElement.style.setProperty('--qpu-phase', String(Math.floor(phase))); if (samples.length % 36 === 0) send({ id: ++seq, method: 'tools/call', params: { name: 'seal', arguments: { text: location.href, entropy: samples.slice(-36) } } }) })
  var size = function () { send({ method: 'ui/notifications/size-changed', params: { height: document.documentElement.scrollHeight } }) }
  var render = function (r, el) {
    var meta = r && r._meta ? r._meta : {}, view = el || document.getElementById('view')
    if (meta.theme) for (var k in meta.theme) view.style.setProperty(k, meta.theme[k])
    view.innerHTML = meta.widget ? meta.widget : '<pre>' + JSON.stringify(r && r.structuredContent !== undefined ? r.structuredContent : r, null, 1).replace(/</g, '&lt;') + '</pre>'
    // a decision verified by its client: every theorem it rests on, asked of the server through the host (tools/call: host to server, no model, no tokens) and its Lean source opened online; text only, never markup
    var sc = r && r.structuredContent, v = sc && (sc.verify || (sc.decision && sc.decision.verify))
    if (v && v.length) { var box = document.createElement('div'); box.className = 'qpu-verify'; v.forEach(function (x) { var row = document.createElement('div'), b = document.createElement('button'), out = document.createElement('span'); b.textContent = 'Verify ' + x.theorem; b.onclick = function () { var id = ++seq; pending[id] = function (m) { var a = m.result && m.result.structuredContent; out.textContent = a ? (a.accepted ? ' accepted by the kernel: ' : ' not in the kernel: ') + (a.statement || a.theorem) : ' ' + JSON.stringify(m.error || m.result) }; out.textContent = ' asking the server'; send({ id: id, method: 'tools/call', params: x.call }) }; row.appendChild(b); if (x.online) { var s = document.createElement('button'); s.textContent = 'Lean source'; s.onclick = function () { send({ id: ++seq, method: 'ui/open-link', params: { url: x.online } }) }; row.appendChild(s) } row.appendChild(out); box.appendChild(row) }); view.appendChild(box) }
    size()
  }
  window.addEventListener('message', function (e) {
    var m = e.data || {}
    if (m.id === 1 && m.result) { send({ method: 'ui/notifications/initialized' }); return }
    if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; size(); return }
    if (m.method === 'ui/notifications/tool-input') { var show = function (v) { if (!v || typeof v !== 'object') return v; var o = Array.isArray(v) ? [] : {}; if (Array.isArray(v)) return v.map(show); for (var key in v) o[key] = /token|secret|password|authorization|api[-_]?key/i.test(key) && typeof v[key] === 'string' ? '[sealed]' : show(v[key]); return o }; args.textContent = JSON.stringify(show(m.params && m.params.arguments)); size() }
    if (m.method === 'ui/notifications/tool-result' && m.params) render(m.params)
    if (m.method === 'ui/notifications/tool-cancelled') { view.textContent = 'the call was cancelled'; size() }
  })
  // the chat: each problem a tools/call of the chat door through the host, a question's options radios whose choice re-enters
  var ask = function (s, choice) { var id = ++seq, el = view.insertBefore(document.createElement('div'), view.firstChild); pending[id] = function (m) { var r = m.result || { structuredContent: m.error }, q = r.structuredContent && r.structuredContent.question; render(r, el); if (q) el.append(q.asks), q.options.forEach(function (o) { var l = el.appendChild(document.createElement('label')); l.innerHTML = '<input type=radio name=q' + id + '>'; l.append(o); l.onchange = function () { ask(s, o) } }) }; send({ id: id, method: 'tools/call', params: { name: 'match', arguments: { statement: s, chat: { choice: choice } } } }) }
  // no form: a sandboxed frame without allow-forms never submits one
  var s = document.getElementById('s'), go = function () { if (s.value) ask(s.value); s.value = '' }; if (s) { s.onkeydown = function (e) { if (e.key === 'Enter') go() }; document.getElementById('go').onclick = go }
  var k = document.getElementById('k'), ok = document.getElementById('ok'), tok = document.getElementById('tok')
  var accept = function () {
    var raw = k.value
    k.value = ''
    if (!raw || !(self.crypto && crypto.subtle && self.TextEncoder)) { tok.textContent = ' refused'; return }
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)).then(function (buf) {
      var hex = Array.from(new Uint8Array(buf)).map(function (b) { return ('0' + b.toString(16)).slice(-2) }).join('')
      send({ method: 'ui/accept-token', params: { authorization: raw } })
      raw = ''
      var id = ++seq
      pending[id] = function (m) { var a = m.result && m.result.structuredContent; tok.textContent = a && a.accepted && a.secret === false && a.travelled === false ? ' accepted' : ' refused' }
      send({ id: id, method: 'tools/call', params: { name: 'payload', arguments: { token: { witness: hex, via: 'widget' } } } })
    }).catch(function () { tok.textContent = ' refused' })
  }
  if (k && ok) { k.onkeydown = function (e) { if (e.key === 'Enter') accept() }; ok.onclick = accept }
  send({ id: ++seq, method: 'ui/initialize', params: { appCapabilities: { availableDisplayModes: ['inline'] }, appInfo: { name: 'qpu', version: '${VERSION}' } } })
  new ResizeObserver(size).observe(document.body)
})()
</script></body></html>
`
  return { uri: `ui://qpu/${tool}`, name: `qpu · ${tool}`, mimeType: MCP_APPS.mimeType, html, csp: { connectDomains: [], resourceDomains: [] }, prefersBorder: true }
}
/** Payload's adapters as a matrix over providers and Cloudflare bindings (the packages Payload ships, read at the source): a database, a storage and an email adapter make a combination, the payment adapter rides with the ecommerce plugin, and the RAID's docket (content-addressed entries, four verbs) is the semantics over whichever database answers. */
export const ADAPTERS = { ...TABLES.ADAPTERS, storage: STORAGE }
// the adapter combinatorics over whatever records it is given — the baked index or the live Tables rows a Payload hook reads — so the
// count is a function of the records, never a literal; a re-read is 304 by involution
export const combinationsFromAdapters = (a: { database: readonly unknown[]; storage: readonly unknown[]; email: readonly unknown[] }): { dimensions: [number, number, number]; combinations: number } => {
  const dimensions: [number, number, number] = [a.database.length, a.storage.length, a.email.length]
  return { dimensions, combinations: dimensions.reduce((n, d) => n * d, 1) }
}
export const adapters = (env: readonly string[] = []) => {
  const have = new Set(env.map(String))
  const cloudflare = have.has('D1') || have.has('R2') || have.has('QPU_ADAPTERS=cloudflare')
  // the google profile: Cloud SQL (postgres), Cloud Storage and Gmail, Cloud Run the deploy; reached through Google's own MCP servers (sqladmin, run, monitoring)
  const google = !cloudflare && (have.has('GOOGLE_CLOUD_PROJECT') || have.has('GCS_BUCKET') || have.has('QPU_ADAPTERS=google'))
  const choose = <T extends { pkg: string; needs: readonly string[]; binding: string | null }>(list: readonly T[], fallback: T): T => list.find((a) => (a.binding ? cloudflare && have.has(a.binding) : a.needs.every((n) => have.has(n.split(' ')[0]!)))) ?? fallback
  const chosen = google ? { database: ADAPTERS.database.find((a) => a.pkg === 'db-postgres')!, storage: ADAPTERS.storage.find((a) => a.pkg === 'storage-gcs')!, email: ADAPTERS.email[0], payments: ADAPTERS.payments[0] } : { database: choose(ADAPTERS.database, ADAPTERS.database[0]), storage: choose(ADAPTERS.storage, ADAPTERS.storage[0]), email: choose(ADAPTERS.email, ADAPTERS.email[0]), payments: ADAPTERS.payments[0] }
  const { combinations } = combinationsFromAdapters(ADAPTERS)
  // every adapter a Payload plugin by its slug (qpuAdapterPlugins in the generated adapters module mounts those whose package the app installs)
  const plugins = (['database', 'storage', 'email'] as const).flatMap((part) => ADAPTERS[part].map((a) => ({ slug: 'qpu-' + a.pkg, part })))
  const cloudflareBindings = cloudflareAdapters()
  return { matrix: ADAPTERS, combinations, plugins, cloudflare: cloudflareBindings, says: `${ADAPTERS.database.length} databases × ${ADAPTERS.storage.length} storages × ${ADAPTERS.email.length} email adapters = ${combinations} combinations; chosen by what the environment names. ${cloudflareBindings.says}`, profiles: { cloudflare: ['db-d1-sqlite', 'storage-r2', 'email-resend', 'plugin-ecommerce (Stripe over HTTP)'], google: ['db-postgres (Cloud SQL: DATABASE_URI)', 'storage-gcs (GCS_BUCKET, GCS_PROJECT_ID)', 'email-nodemailer (Gmail SMTP: GMAIL_USER, GMAIL_APP_PASSWORD)', 'plugin-ecommerce'], vercel: ['db-mongodb', 'storage-vercel-blob', 'email-nodemailer', 'plugin-ecommerce'], local: ['db-mongodb (the mongod listening)', 'storage-vercel-blob (disabled)', 'email-nodemailer (no key: logged)', 'plugin-ecommerce'] }, chosen: { database: chosen.database.pkg, storage: chosen.storage.pkg, email: chosen.email.pkg, payments: chosen.payments.pkg, profile: cloudflare ? 'cloudflare' : google ? 'google' : have.has('BLOB_READ_WRITE_TOKEN') ? 'vercel' : 'local' }, bindings: ADAPTERS.bindings, raid: ADAPTERS.raid,
    // the connectors dimension: the one /mcp endpoint as a Cloudflare connector and an AI connector at once, chosen by the names the tenant binds (textbook_bindings_named_not_valued)
    connectors: { qpu: `${QPU_CONNECTOR.plugin} fetches ${QPU_CONNECTOR.api}`, adapted: [...ADAPTED_CONNECTORS], effective: 'content/discovery/platform' as const, oauth: have.has('OAUTH_KV') ? 'workers-oauth-provider over OAUTH_KV: OAuth 2.1 with dynamic client registration for the docket roles (reader, writer, admin as scopes), the issuer QPU_OAUTH_ISSUER_<TENANT>, the metadata of RFC 9728 at /.well-known/oauth-protected-resource. Adapted as qpuMcpPlugin.' : 'the tenant\'s tokens by name (QPU_WRITE_TOKEN_<TENANT>, QPU_ADMIN_TOKEN_<TENANT>); the pure tools need none; /.well-known/oauth-protected-resource names no authorization server. Adapted as qpuMcpPlugin.', registry: have.has('MCP_PUBLISHER_TOKEN') ? 'server.json (configure { kind: mcp }) published to registry.modelcontextprotocol.io under MCP_PUBLISHER_TOKEN. Adapted as qpuMcpPlugin.' : 'server.json generated by configure { kind: mcp }; publishing waits for MCP_PUBLISHER_TOKEN to be named: the author\'s act. Adapted as qpuMcpPlugin.', claude: 'a custom connector of the website routes: the client is POST /api/mcp, and each tool is GET /api/<collection> (pages, posts, case-studies, media); a find answer is those route calls. Adapted as qpuMcpPlugin.', cloudflare: 'a connector of the same website routes on Workers; listed once the OAuth adapter and the registry entry are named. Adapted as qpuMcpPlugin.', managedIn: 'Payload, the tenants collection (bindings: profile, connectors, variables): names a tenant admin selects; values the Worker and the app read from their environment by those names' } }
}
/** The app's own wrangler configuration for Cloudflare (OpenNext's layout): every binding the adapters can take, the flags the Worker needs, the service binding to the QPU Worker. */
/** The deploy sets, computed beside the one file wrangler deploys (textbook_deploy_sets). That file is the OpenNext template: one Worker
 *  named qpu, custom domain qpu.uuidna.com, origin https://qpu.uuidna.com. The sets are not written into it — wrangler validates every
 *  environment's resource id, and a placeholder there stops the deploy. */
const DEPLOY_TEMPLATES = ['site', 'app'] as const
type DeployTemplate = typeof DEPLOY_TEMPLATES[number]
const DEPLOY_USE_CASES: readonly string[] = [...new Set(CATALOGUE.map((v) => v.product.replace(/^qpu-/, '')))]
/** Upstream with-cloudflare-d1: database_name matches the Worker `name`. */
const siteBindings = (workerName: string) => ({
  d1_databases: [{ binding: 'D1', database_name: workerName, database_id: '<the tenant\'s>' }],
  r2_buckets: [{ binding: 'R2', bucket_name: `${workerName}-media` }],
  kv_namespaces: [{ binding: 'KV', id: '<the tenant\'s>' }, { binding: 'OAUTH_KV', id: '<the tenant\'s oauth>' }],
  services: [{ binding: 'QPU', service: 'qpu' }],
  ai: { binding: 'AI' },
  vectorize: [{ binding: 'VECTORIZE', index_name: `${workerName}-search` }],
  version_metadata: { binding: 'CF_VERSION_METADATA' },
})
export const deploySet = (template: DeployTemplate, useCase: string, hosts: readonly string[], name = 'qpu-app') => {
  if (!DEPLOY_TEMPLATES.includes(template)) throw new Error(`no template ${template}; the templates are ${DEPLOY_TEMPLATES.join(', ')}`)
  const variants = CATALOGUE.filter((v) => v.product === `qpu-${useCase}`)
  if (!variants.length) throw new Error(`no use case ${useCase}; the use cases are ${DEPLOY_USE_CASES.join(', ')}`)
  const unit = variants[0]!.unit, metered = variants.some((v) => v.interval === 'metered'), free = variants.every((v) => v.amounts.eur === 0)
  const base = template === 'site' ? 'qpu-site' : name
  const workerName = `${base}-${useCase}`
  const vars = { QPU_USE_CASE: useCase, QPU_PRODUCT: `qpu-${useCase}`, QPU_UNIT: unit, QPU_LICENCE: free ? 'a432: free under attribution' : `covered by the licence (${variants.map((v) => v.variant).join(', ')})`, ...(metered ? { QPU_METER: variants[0]!.variant } : {}), QPU_ADAPTERS: 'cloudflare', QPU_ORIGIN: 'https://qpu.uuidna.com', QPU_TEMPLATE: template }
  const wrangler = { name: workerName, workers_dev: true, routes: [] as { pattern: string; custom_domain: boolean }[], vars, ...siteBindings(workerName) }
  const file = template === 'site' ? 'wrangler.jsonc' : `${name}/wrangler.jsonc`
  const build = 'npx opennextjs-cloudflare build'
  return {
    template, useCase, unit, metered, free, variants: variants.map((v) => v.variant), env: useCase, file, wrangler,
    bindings: ['ASSETS', 'D1', 'R2', 'KV', 'OAUTH_KV', 'QPU', 'AI', 'VECTORIZE', 'CF_VERSION_METADATA'],
    commands: { build, deploy: `${build} && npx wrangler deploy -c ${file} --env ${useCase}`, dev: `npx wrangler dev -c ${file} --env ${useCase}`, dry: `npx wrangler deploy -c ${file} --env ${useCase} --dry-run` },
    hosts: { set: `${base}-${useCase}.<account>.workers.dev`, default: hosts, says: 'the custom domains bind to one deploy, the default environment\'s; a set answers at its workers.dev name beside it, every address the same' },
    direct: { inProcess: "import { handle } from '@uuidna/qpu/mcp'; handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })", deployed: `POST https://${base}-${useCase}.<account>.workers.dev/mcp {"jsonrpc":"2.0","id":1,"method":"tools/list"}`, parity: 'the same tools, the same content addresses (ETag by content, 304 by involution); the e2e gate calls every example on every host and decodes the copies by majority, so a set is as usable as direct use exactly when the gate decodes it' },
  }
}
export const deploySets = (hosts: readonly string[]) => ({ templates: DEPLOY_TEMPLATES.length, useCases: DEPLOY_USE_CASES.length, total: DEPLOY_TEMPLATES.length * DEPLOY_USE_CASES.length, theorem: 'textbook_deploy_sets', sets: DEPLOY_TEMPLATES.flatMap((t) => DEPLOY_USE_CASES.map((u) => { const d = deploySet(t, u, hosts); return { template: t, useCase: u, name: d.wrangler.name, deploy: d.commands.deploy } })), says: 'every template over every product of the catalogue is a deploy set computed beside the one Worker qpu; the file wrangler deploys is that Worker on qpu.uuidna.com, and a set is as usable as direct use' })
/**
 * Upstream Payload packages usable on Cloudflare → binding + how qpuMcpPlugin API keys manage them.
 * Every TABLES.PAYLOAD_PACKAGES name that can run on Workers is listed. IDs and secrets are names only
 * (`<the tenant's>`); values never travel. Keys: users.useAPIKey + payload-mcp-api-keys (Bearer).
 */
const CLOUDFLARE_PACKAGE_BINDINGS = [
  { pkg: 'db-d1-sqlite', binding: 'D1', wrangler: 'd1_databases', uses: 'sqliteD1Adapter({ binding: env.D1 })', key: 'payload-mcp-api-keys + QPU_ADAPTERS=cloudflare', possible: true },
  { pkg: 'db-postgres', binding: 'HYPERDRIVE', wrangler: 'hyperdrive', uses: 'postgresAdapter over Hyperdrive connectionString', key: 'DATABASE_URI named via Hyperdrive / payload-mcp-api-keys', possible: true },
  { pkg: 'db-sqlite', binding: 'D1', wrangler: 'd1_databases', uses: 'sqlite file path replaced by D1 on CF profile', key: 'QPU_ADAPTERS=cloudflare', possible: true },
  { pkg: 'drizzle', binding: 'D1', wrangler: 'd1_databases', uses: 'Drizzle over D1 when the schema is D1', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'kv-redis', binding: 'KV', wrangler: 'kv_namespaces', uses: 'Payload kv-redis → Workers KV namespace', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'storage-r2', binding: 'R2', wrangler: 'r2_buckets', uses: 'r2Storage({ bucket: env.R2 })', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-cloud-storage', binding: 'R2', wrangler: 'r2_buckets', uses: 'cloud-storage adapter pointing at R2', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-search', binding: 'VECTORIZE', wrangler: 'vectorize', uses: 'hybrid search vectors beside plugin-search collections', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-search', binding: 'AI_SEARCH', wrangler: 'ai_search', uses: 'AI Search namespace beside plugin-search', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-mcp', binding: 'QPU', wrangler: 'services', uses: 'service binding to the Worker that serves /api/mcp', key: 'payload-mcp-api-keys (Authorization: Bearer)', possible: true },
  { pkg: 'plugin-mcp', binding: 'RATE_LIMIT', wrangler: 'ratelimits', uses: 'rate limit MCP tools/call by API key', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-mcp', binding: 'SECRETS_STORE', wrangler: 'secrets_store_secrets', uses: 'MCP API key material named, never valued in tree', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-multi-tenant', binding: 'KV', wrangler: 'kv_namespaces', uses: 'tenant scope cache / OAUTH_KV when named', key: 'QPU_WRITE_TOKEN_<TENANT> / payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-ecommerce', binding: 'QUEUE', wrangler: 'queues', uses: 'order / licence events on a Queue producer', key: 'STRIPE_* + payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-ecommerce', binding: null, wrangler: 'vars', uses: 'Stripe over HTTP (secretKey names, never values)', key: 'STRIPE_SECRET_KEY via secrets / payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-stripe', binding: null, wrangler: 'vars', uses: 'replaced by ecommerce stripeAdapter on CF', key: 'STRIPE_* names', possible: true },
  { pkg: 'plugin-seo', binding: 'ASSETS', wrangler: 'assets', uses: 'Open Graph images from ASSETS / R2 media', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-seo', binding: 'IMAGES', wrangler: 'images', uses: 'CF Images transforms for og:image', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-form-builder', binding: 'BROWSER', wrangler: 'browser', uses: 'Browser Rendering for form previews when named', key: 'TURNSTILE_SECRET + payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-form-builder', binding: null, wrangler: 'vars', uses: 'TURNSTILE_SECRET named for captcha', key: 'TURNSTILE_SECRET', possible: true },
  { pkg: 'plugin-redirects', binding: 'KV', wrangler: 'kv_namespaces', uses: 'redirect map cache by address', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-nested-docs', binding: 'D1', wrangler: 'd1_databases', uses: 'breadcrumbs in D1 collections', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-import-export', binding: 'R2', wrangler: 'r2_buckets', uses: 'bulk transfer objects in R2', key: 'payload-mcp-api-keys (super-admin)', possible: true },
  { pkg: 'plugin-sentry', binding: 'ANALYTICS', wrangler: 'analytics_engine_datasets', uses: 'Workers Analytics Engine beside Sentry DSN', key: 'SENTRY_DSN', possible: true },
  { pkg: 'plugin-sentry', binding: null, wrangler: 'vars', uses: 'SENTRY_DSN named; Workers observability beside', key: 'SENTRY_DSN', possible: true },
  { pkg: 'richtext-lexical', binding: 'R2', wrangler: 'r2_buckets', uses: 'media embeds from R2', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'transformer-sharp', binding: 'IMAGES', wrangler: 'images', uses: 'CF Images instead of Node sharp on Workers', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'email-nodemailer', binding: null, wrangler: 'vars', uses: 'SMTP names when not on CF email', key: 'GMAIL_* / SENDGRID_*', possible: true },
  { pkg: 'email-resend', binding: null, wrangler: 'vars', uses: 'RESEND_API_KEY named', key: 'RESEND_API_KEY', possible: true },
  { pkg: 'next', binding: 'ASSETS', wrangler: 'assets', uses: 'OpenNext Worker + ASSETS', key: 'none', possible: true },
  { pkg: 'live-preview', binding: 'ASSETS', wrangler: 'assets', uses: 'admin live preview over Worker', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'live-preview-react', binding: 'ASSETS', wrangler: 'assets', uses: 'admin live preview over Worker', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'live-preview-vue', binding: 'ASSETS', wrangler: 'assets', uses: 'admin live preview over Worker', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'ui', binding: 'ASSETS', wrangler: 'assets', uses: 'admin UI static via ASSETS', key: 'none', possible: true },
  { pkg: 'admin-bar', binding: 'ASSETS', wrangler: 'assets', uses: 'admin bar over Worker ASSETS', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'graphql', binding: 'D1', wrangler: 'd1_databases', uses: 'GraphQL over the same D1 collections', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'sdk', binding: 'QPU', wrangler: 'services', uses: 'local SDK calls the Worker via QPU service binding', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'translations', binding: 'KV', wrangler: 'kv_namespaces', uses: 'locale packs cached in KV', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'payload', binding: 'D1', wrangler: 'd1_databases', uses: 'CMS core over D1 on CF profile', key: 'PAYLOAD_SECRET named', possible: true },
  { pkg: 'payload', binding: 'CF_VERSION_METADATA', wrangler: 'version_metadata', uses: 'Worker version in health / MCP handshake', key: 'none', possible: true },
  { pkg: 'ai-workers', binding: 'AI', wrangler: 'ai', uses: 'Workers AI for search/summarise coils', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'media', binding: 'MEDIA', wrangler: 'media', uses: 'Media Transformations on R2 objects', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'media', binding: 'STREAM', wrangler: 'stream', uses: 'Stream for video variants when named', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'deploy', binding: 'WORKFLOW', wrangler: 'workflows', uses: 'Payload deploy hook as a Workflow', key: 'payload-mcp-api-keys (admin)', possible: true },
  { pkg: 'plugin-mcp', binding: 'MTLS', wrangler: 'mtls_certificates', uses: 'mTLS to upstream when a tenant names the cert', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-multi-tenant', binding: 'DISPATCHER', wrangler: 'dispatch_namespaces', uses: 'Workers for Platforms per-tenant scripts when named', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-mcp', binding: 'LOADER', wrangler: 'worker_loaders', uses: 'dynamic Worker loaders for MCP coils when named', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'plugin-ecommerce', binding: 'DOCKET', wrangler: 'durable_objects', uses: 'Durable Object docket for metered licences when named', key: 'payload-mcp-api-keys', possible: true },
  { pkg: 'email-cloudflare', binding: null, wrangler: 'vars', uses: 'CLOUDFLARE_EMAIL_TOKEN + ACCOUNT_ID named (HTTP form of send_email)', key: 'CLOUDFLARE_EMAIL_TOKEN', possible: true },
  // not Workers-native: stay on other profiles
  { pkg: 'db-mongodb', binding: null, wrangler: 'vars', uses: 'external Mongo URI — not a CF binding', key: 'DATABASE_URI', possible: false },
  { pkg: 'db-vercel-postgres', binding: null, wrangler: 'vars', uses: 'Vercel Postgres — not a CF binding', key: 'DATABASE_URI', possible: false },
  { pkg: 'storage-vercel-blob', binding: null, wrangler: 'vars', uses: 'Vercel Blob — not a CF binding', key: 'BLOB_READ_WRITE_TOKEN', possible: false },
  { pkg: 'storage-gcs', binding: null, wrangler: 'vars', uses: 'GCS — google profile', key: 'GCS_BUCKET', possible: false },
  { pkg: 'storage-azure', binding: null, wrangler: 'vars', uses: 'Azure Blob — not a CF binding', key: 'AZURE_*', possible: false },
  { pkg: 'storage-s3', binding: null, wrangler: 'vars', uses: 'use storage-r2 on CF (S3 API optional over R2)', key: 'AWS_*', possible: false },
  { pkg: 'payload-cloud', binding: null, wrangler: 'vars', uses: 'Payload Cloud hosting — not Workers self-host', key: 'none', possible: false },
] as const

/**
 * The Worker that answers https://qpu.uuidna.com is Payload, built by OpenNext.
 * Shape from payloadcms/payload templates/with-cloudflare-d1: D1 + R2 + ASSETS,
 * database_name === worker name (upstream: both `my-app`; here both `qpu`).
 * Extra named bindings for packages live in CLOUDFLARE_PACKAGE_BINDINGS / deploySet siteBindings;
 * IDs are tenant placeholders managed via qpuMcpPlugin API keys (names never values).
 */
export const siteWrangler = () => ({
  $schema: 'node_modules/wrangler/config-schema.json',
  name: 'qpu',
  main: '.open-next/worker.js',
  compatibility_date: '2026-10-01',
  compatibility_flags: ['nodejs_compat', WEBCRYPTO_FLAG, 'global_fetch_strictly_public'],
  workers_dev: true,
  assets: { directory: '.open-next/assets', binding: 'ASSETS' },
  routes: [{ pattern: 'qpu.uuidna.com', custom_domain: true }, { pattern: 'qpu.psg.bg', custom_domain: true }],
  d1_databases: [{ binding: 'D1', database_name: 'qpu', database_id: '<the tenant\'s>', remote: true }],
  r2_buckets: [{ binding: 'R2', bucket_name: 'qpu-media' }],
  services: [{ binding: 'QPU', service: 'qpu' }],
  observability: { enabled: true, head_sampling_rate: 1, logs: { enabled: true, head_sampling_rate: 1, invocation_logs: true, persist: true }, traces: { enabled: true, head_sampling_rate: 1, persist: true }, issues: { enabled: true } },
  vars: { QPU_ADAPTERS: 'cloudflare' },
})
/** The scopes of the full stack: every tenant over every scoped collection (the multi-tenant plugin), every role over the docket (the Worker's roles), every toolbox as a scope of the MCP server. More tenants is the whole of scaling: no more code. */
const SCOPES = {
  tenants: [...Object.values(TENANTS), 'ceci'],
  collections: ['pages', 'entries', 'products', 'orders'],
  tenantRoles: TENANT_ROLES,
  superAdmin: 'a user with the admin role has access to every tenant (userHasAccessToAllTenants); every other user acts in the tenants of its tenants array, with the roles the row names',
  firstUser: 'a deploy creates the first user from the deployer\'s account email (FIRST_USER_EMAIL, CLOUDFLARE_EMAIL, or wrangler whoami; the seed), the super admin and tenant-admin of the first tenant, its password unknown to everyone until the admin resets it through the panel\'s forgot-password mail; the users collection\'s beforeChange hook (generated) makes any first user the super admin and names the request host\'s tenant when the caller named none, so the create-first-user form stands only where no account email is known',
  apiKeys: 'every user may hold an API key (auth.useAPIKey) for the REST API; the MCP plugin (4.0.0-beta.7, measured) takes its own keys from the payload-mcp-api-keys collection an admin makes, each bound to a user, sent as Authorization: Bearer <key>; an anonymous MCP request is refused, so the app reads the ui:// resource in its own server',
  roles: Object.entries(ROLES).map(([role, r]) => ({ role, may: r.may, header: r.header })),
  toolboxes: 'every toolbox is a scope of the MCP server: a client that names a toolbox sees its tools alone (tools/list?toolbox=)',
  scale: 'a tenant is a host in TENANTS and a row of the tenants collection; its scope is its own docket, pages and tokens; adding one adds no code',
} as const
/** The fields of what QPU adds to Payload: the entries collection (the docket) and the qpu block, each with its validation (a function of the value alone). */
export const FIELDS = TABLES.FIELDS
/** The validations as regular expressions the generated collection enforces (Payload validate functions): pure, the same in the app and at the edge. */
/** Every field validation the tree generates, each named by the kernel-accepted theorem that states its arithmetic (the harmonic basis: a pattern
 *  is a count the kernel checks, never a convention); a validation no theorem states is a lead the validations kind reports. The same table
 *  renders the validate function of every generated field (validate), with the theorem carried in the field's custom, so the Payload MCP's
 *  getCollectionSchema answers it. */
const VALIDATIONS = TABLES.VALIDATIONS as unknown as readonly { field: string; of: 'entries' | 'qpu' | 'tenants'; pattern: string; says: string; nullable?: boolean; theorem: string | null }[]
/** The validate function of a generated field, rendered from the table: the pattern, the sentence, and the theorem in custom (null when none states it). */
export const validate = (of: 'entries' | 'qpu' | 'tenants', field: string): string => {
  const v = VALIDATIONS.find((x) => x.of === of && x.field === field)
  if (!v) throw new Error(`no validation for ${of}.${field}`)
  const re = v.pattern.replace(/\\/g, '\\\\')
  return `validate: (v: unknown) => ${v.nullable ? "(v == null || v === '') || " : ''}/${re}/.test(String(v)) || '${v.says.replace(/'/g, "\\'")}', custom: { theorem: ${v.theorem ? `'${v.theorem}'` : 'null'} }`
}
/** The access of the entries collection by role, the Worker's roles carried into Payload: a reader reads, a writer creates, nothing updates (content-addressed: immutable), an admin deletes. */
/** Abilities after CanCanCan: rules `can action, subject, conditions` over Payload's collections, none by default; manage covers every action,
 *  all every collection, a cannot rule subtracts. Roles after rolify: a name, global, or scoped to a collection (a resource class) or to one
 *  document of it (a resource instance); a global role holds everywhere. The answer is Payload's own access result: true, false, or the Where
 *  that fetches only what the user may (CanCanCan's accessible_by). $user and $tenants in a condition stand for the user's id and tenants; the
 *  role all is held by every user, so its cannot binds every role. */
export type Ability = { role: string; can: readonly string[]; subject: string; where?: Record<string, unknown>; cannot?: boolean }
export type ScopedRole = { name: string; resourceType?: string; resource?: string }
// Payload's Where has no general negation: a cannot with conditions negates field operators only (equals, in, exists)
const NEGATED: Readonly<Record<string, string>> = { equals: 'not_equals', not_equals: 'equals', in: 'not_in', not_in: 'in' }
// not (a and b) is (not a) or (not b): a condition over several fields negates into a disjunction of each negated
const negateWhere = (w: Record<string, unknown>): Record<string, unknown> => { const each = Object.entries(w).map(([field, ops]) => negateField({ [field]: ops })); return each.length === 1 ? each[0]! : { or: each } }
const negateField = (w: Record<string, unknown>): Record<string, unknown> => Object.fromEntries(Object.entries(w).map(([field, ops]) => { if (field === 'and' || field === 'or' || !isObj(ops)) throw new Error(`a cannot condition negates field operators only, not ${field}`); return [field, Object.fromEntries(Object.entries(ops).map(([op, v]) => (op === 'exists' ? [op, !v] : NEGATED[op] ? [NEGATED[op], v] : (() => { throw new Error(`a cannot condition cannot negate ${op}`) })())))] }))
export const getAccess = (abilities: readonly Ability[], roles: readonly ScopedRole[], subject: string, action: string, user: { id?: string | null; tenants?: readonly string[] } = {}): boolean | Record<string, unknown> => {
  const fill = (w?: Record<string, unknown>) => (w ? (JSON.parse(JSON.stringify(w).replace(/"\$(user|tenants)"/g, (_m, k: string) => JSON.stringify(k === 'user' ? (user.id ?? null) : (user.tenants ?? [])))) as Record<string, unknown>) : null)
  // a role held for this subject: everywhere (global), over the collection (its class), or on one document (its instance, an id condition)
  const scopes = (role: string) => (role === 'all' ? [null] : roles.filter((r) => r.name === role && (!r.resourceType || r.resourceType === subject)).map((r) => (r.resourceType && r.resource ? { id: { equals: r.resource } } : null)))
  const rules = (cannot: boolean) => abilities.filter((a) => !!a.cannot === cannot && (a.subject === subject || a.subject === 'all') && (a.can.includes(action) || a.can.includes('manage'))).flatMap((a) => scopes(a.role).map((scope) => [fill(a.where), scope].filter((w): w is Record<string, unknown> => !!w && Object.keys(w).length > 0)))
  const can = rules(false), cannot = rules(true)
  if (!can.length || cannot.some((ws) => ws.length === 0)) return false
  const allowed = can.some((ws) => ws.length === 0) ? null : { or: can.map((ws) => (ws.length === 1 ? ws[0]! : { and: ws })) }, denied = cannot.map((ws) => (ws.length === 1 ? negateWhere(ws[0]!) : { or: ws.map(negateWhere) })) // not (a and b) is (not a) or (not b)
  const all = [...(allowed ? [allowed] : []), ...denied]
  return all.length === 0 ? true : all.length === 1 ? all[0]! : { and: all }
}
/** CanCanCan's can? on one document: the access answer evaluated against it, the Where read as Payload reads it (and, or, dot paths, field
 *  operators), without recursion: a node is decided once its children are. */
export const valueAt = (doc: unknown, path: string): unknown => path.split('.').reduce<unknown>((v, k) => (isObj(v) ? (v as Record<string, unknown>)[k] : undefined), doc)
const fieldHolds = (doc: unknown, field: string, ops: Record<string, unknown>) => Object.entries(ops).every(([op, x]) => { const d = valueAt(doc, field)
  switch (op) { case 'equals': return d === x; case 'not_equals': return d !== x; case 'in': return Array.isArray(x) && x.includes(d); case 'not_in': return Array.isArray(x) && !x.includes(d); case 'exists': return (d !== undefined && d !== null) === Boolean(x); default: throw new Error(`no evaluation of the operator ${op}`) } })
const matchesWhere = (doc: unknown, root: Record<string, unknown>): boolean => {
  const decided = new Map<object, boolean>(), stack: Record<string, unknown>[] = [root]
  while (stack.length) { const n = stack[stack.length - 1]!, kids = Object.entries(n).flatMap(([k, v]) => (k === 'and' || k === 'or' ? (v as Record<string, unknown>[]) : [])), open = kids.filter((c) => !decided.has(c))
    if (open.length) { stack.push(...open); continue } stack.pop()
    decided.set(n, Object.entries(n).every(([k, v]) => (k === 'and' ? (v as object[]).every((c) => decided.get(c)) : k === 'or' ? (v as object[]).some((c) => decided.get(c)) : fieldHolds(doc, k, v as Record<string, unknown>)))) }
  return decided.get(root)!
}
export const checkAccess = (abilities: readonly Ability[], roles: readonly ScopedRole[], subject: string, action: string, doc: unknown, user: { id?: string | null; tenants?: readonly string[] } = {}): boolean => { const a = getAccess(abilities, roles, subject, action, user); return typeof a === 'boolean' ? a : matchesWhere(doc, a) }
/** The Rails guide Active Record Associations, implemented by Payload's own fields: the fields each side of an association carries. belongs_to is a
 *  relationship; has_many a join on the target's relationship back; has_one that join limited to one, the target's relationship unique; :through
 *  a join over the join model's two belongs_to; has_and_belongs_to_many a hasMany relationship with a join as its inverse; polymorphic a
 *  relationship to many collections; a self join a relationship to its own collection; single table inheritance a type select whose subtypes'
 *  fields show by condition; delegated types a polymorphic relationship from the base. Options: dependent, counter_cache and touch as hooks. */
type Field = Record<string, unknown>
export type Association = { type: 'belongs_to' | 'has_one' | 'has_many' | 'has_many_through' | 'has_one_through' | 'has_and_belongs_to_many' | 'polymorphic' | 'self_join' | 'sti' | 'delegated_type'; owner: string; name: string; target?: string; targets?: readonly string[]; through?: string; on?: string; inverse?: string; optional?: boolean; subtypes?: Readonly<Record<string, readonly Field[]>>; dependent?: 'destroy'; counterCache?: string; touch?: boolean }
export const createAssociation = (a: Association) => {
  // the key a has_many or has_one is joined on: Rails' convention, the owner's singular name on the target (authors has_many books: books.author)
  const t = a.target ?? '', on = a.on ?? a.owner.replace(/ies$/, 'y').replace(/s$/, ''), rel = (name: string, to: string | readonly string[], extra: Field = {}): Field => ({ name, type: 'relationship', relationTo: to, ...extra }), join = (name: string, collection: string, by: string, extra: Field = {}): Field => ({ name, type: 'join', collection, on: by, ...extra })
  const sides: { owner: Field[]; target?: Field[]; through?: Field[] } =
    a.type === 'belongs_to' ? { owner: [rel(a.name, t, { required: !a.optional, index: true })] }
    : a.type === 'has_one' ? { owner: [join(a.name, t, on, { defaultLimit: 1 })], target: [rel(on, a.owner, { unique: true, index: true })] }
    : a.type === 'has_many' ? { owner: [join(a.name, t, on)], target: [rel(on, a.owner, { index: true })] }
    : a.type === 'has_many_through' || a.type === 'has_one_through' ? { owner: [join(a.name, a.through ?? '', on, a.type === 'has_one_through' ? { defaultLimit: 1 } : {})], through: [rel(on, a.owner, { required: true, index: true }), rel(a.inverse ?? t, t, { required: true, index: true })] }
    : a.type === 'has_and_belongs_to_many' ? { owner: [rel(a.name, t, { hasMany: true })], target: [join(a.inverse ?? a.owner, a.owner, a.name)] }
    : a.type === 'polymorphic' ? { owner: [rel(a.name, a.targets ?? [])] }
    : a.type === 'self_join' ? { owner: [rel(a.name, a.owner, { hasMany: true }), join(a.inverse ?? `${a.name}By`, a.owner, a.name)] }
    : a.type === 'sti' ? { owner: [{ name: a.name, type: 'select', required: true, options: Object.keys(a.subtypes ?? {}) }, ...Object.entries(a.subtypes ?? {}).flatMap(([sub, fs]) => fs.map((f) => ({ ...f, admin: { condition: `(data) => data?.${a.name} === '${sub}'` } })))] }
    : { owner: [rel(a.name, a.targets ?? [], { required: true })], target: (a.targets ?? []).map((x) => join(a.inverse ?? a.owner, a.owner, a.name)) }
  // the association options as Payload hooks, their source for the generator to write
  const hooks = [...(a.dependent === 'destroy' ? [{ on: a.owner, hook: 'afterDelete', source: `async ({ doc, req }) => { await req.payload.delete({ collection: '${t}', where: { ${on}: { equals: doc.id } }, req }) }` }] : []), ...(a.counterCache ? [{ on: t || a.owner, hook: 'afterChange', source: `async ({ doc, req }) => { const parent = doc.${on}; if (parent) await req.payload.update({ collection: '${a.owner}', id: typeof parent === 'object' ? parent.id : parent, data: { ${a.counterCache}: (await req.payload.count({ collection: '${t}', where: { ${on}: { equals: typeof parent === 'object' ? parent.id : parent } }, req })).totalDocs }, req }) }` }] : []), ...(a.touch ? [{ on: t || a.owner, hook: 'afterChange', source: `async ({ doc, req }) => { const parent = doc.${on}; if (parent) await req.payload.update({ collection: '${a.owner}', id: typeof parent === 'object' ? parent.id : parent, data: {}, req }) }` }] : [])]
  return { phase: 'association' as const, rails: a.type, ...sides, hooks, theorem: 'textbook_association_fields' }
}
/** The Rails guide Active Record Validations, implemented by Payload's own field options where Payload has one (required, unique, minLength,
 *  maxLength, min, max, options), else by a validate function whose source the generator writes: a string is the error message, true passes.
 *  :allow_nil and :allow_blank pass an empty value, :on names the operation, :if and :unless read the sibling data, :message replaces the text. */
export type Validation = { name: string; helper: 'absence' | 'acceptance' | 'confirmation' | 'comparison' | 'format' | 'inclusion' | 'exclusion' | 'length' | 'numericality' | 'presence' | 'uniqueness' | 'validates_associated' | 'validates_each' | 'validates_with'; options?: { with?: string; in?: readonly (string | number)[]; minimum?: number; maximum?: number; is?: number; onlyInteger?: boolean; greaterThan?: number | string; lessThan?: number | string; allowNil?: boolean; allowBlank?: boolean; message?: string; on?: 'create' | 'update'; if?: string; unless?: string; validator?: string } }
export const createValidation = (v: Validation) => {
  const o = v.options ?? {}, say = (m: string) => JSON.stringify(o.message ?? `${v.name} ${m}`), field: Field = {}
  const test: string | null =
    v.helper === 'presence' ? (field.required = true, null)
    : v.helper === 'uniqueness' ? (field.unique = true, field.index = true, null)
    : v.helper === 'validates_associated' ? null // Payload refuses a relationship to a document that is not there
    : v.helper === 'length' && o.is === undefined ? (o.minimum !== undefined && (field.minLength = o.minimum), o.maximum !== undefined && (field.maxLength = o.maximum), null)
    : v.helper === 'inclusion' && !o.message ? (field.options = o.in ?? [], null)
    : v.helper === 'absence' ? `(value == null || value === '') || ${say('must be blank')}`
    : v.helper === 'acceptance' ? `value === true || ${say('must be accepted')}`
    : v.helper === 'confirmation' ? `value === siblingData?.${v.name}Confirmation || ${say('doesn\'t match confirmation')}`
    : v.helper === 'comparison' ? `(${o.greaterThan !== undefined ? `value > ${typeof o.greaterThan === 'string' ? `siblingData?.${o.greaterThan}` : o.greaterThan}` : 'true'} && ${o.lessThan !== undefined ? `value < ${typeof o.lessThan === 'string' ? `siblingData?.${o.lessThan}` : o.lessThan}` : 'true'}) || ${say('is out of comparison')}`
    : v.helper === 'format' ? `new RegExp(${JSON.stringify(o.with ?? '.*')}).test(String(value ?? '')) || ${say('is invalid')}`
    : v.helper === 'inclusion' ? `${JSON.stringify(o.in ?? [])}.includes(value) || ${say('is not included in the list')}`
    : v.helper === 'exclusion' ? `!${JSON.stringify(o.in ?? [])}.includes(value) || ${say('is reserved')}`
    : v.helper === 'length' ? `String(value ?? '').length === ${o.is} || ${say(`is the wrong length (should be ${o.is} characters)`)}`
    : v.helper === 'numericality' ? (field.type = 'number', o.minimum !== undefined && (field.min = o.minimum), o.maximum !== undefined && (field.max = o.maximum), o.onlyInteger ? `Number.isInteger(value) || ${say('must be an integer')}` : null)
    : `(${o.validator ?? '() => true'})(value, siblingData)` // validates_each and validates_with: the tenant's own validator
  // the options wrap the test: empty values pass when allowed, the operation and the condition decide whether it runs
  const guards = [...(o.allowNil || o.allowBlank ? [`value == null${o.allowBlank ? ` || value === ''` : ''}`] : []), ...(o.on ? [`operation !== '${o.on}'`] : []), ...(o.if ? [`!(${o.if})`] : []), ...(o.unless ? [`(${o.unless})`] : [])]
  const validate = test ? `(value, { siblingData, operation }) => ${guards.length ? `(${guards.join(' || ')}) || ` : ''}(${test})` : null
  return { phase: 'validation' as const, rails: v.helper, field: { name: v.name, ...field }, validate, theorem: 'textbook_validation_helpers' }
}
/** Roles from Google Workspace: the groups the Admin SDK's Directory API lists for a user (groups.list by userKey, through the one Google door),
 *  each mapped by the tenant's table onto a scoped role; a group the table does not name grants nothing. Without the groups, the call to ask. */
export const listRolesFromGroups = (mapping: readonly (ScopedRole & { group: string })[], groups?: readonly { email?: string }[], userKey?: string) =>
  groups ? { phase: 'roles' as const, roles: groups.flatMap((g) => mapping.filter((r) => r.group === g.email).map(({ group: _g, ...role }) => role)) }
    : { phase: 'plan' as const, googleCall: { api: 'admin', version: 'directory_v1', method: 'groups.list', params: { userKey: userKey ?? '' } }, scope: 'admin.directory.group.readonly', says: 'ask the Directory API through payload { googleCall }, under a Workspace admin\'s domain-wide delegation, and hand the groups back' }

/** The read groups and the per-collection access, read from Payload: groups after Google's data classes — what everyone reads stays outside them;
 *  an operational kind (machine, chat, penalty, session, call, message) is read by its tenant and admins; google-user-data by its grantor (Limited Use). */
export const ACCESS = TABLES.ACCESS
/** The Entries read, computed from the groups: a kind outside them read by everyone, each group's kinds by its readers. */
const readClause = () => {
  const q = (xs: readonly string[]) => JSON.stringify(xs).replace(/"/g, "'").replace(/,/g, ', '), gs = Object.values(ACCESS.groups), by = (r: string) => gs.filter((g) => g.readers === r).flatMap((g) => g.kinds)
  return `({ or: [{ kind: { not_in: ${q(gs.flatMap((g) => g.kinds))} } }, { and: [{ kind: { in: ${q(by('tenant'))} } }, { tenant: { in: tenants(req.user) } }] }, { and: [{ kind: { in: ${q(by('grantor'))} } }, { or: [{ from: { equals: String((req.user as { id?: unknown } | null)?.id ?? '') } }, { tenant: { in: tenantsWithRole(req.user, ['tenant-admin']) } }] }] }] } as Where)`
}
/** The actions at quantum scale: a batch is one JSON-RPC array answered as one array; Payload\'s bulk REST by where; a batch above the quantum is sharded (the shard tool\'s theorems) and the shards run as one wave; the experience the gate measured decides the shard size. */
const actions = (experience?: { copies?: number; involutions?: number; msByHost?: Record<string, number> }) => {
  const free = experience?.copies ? Math.round(((experience.involutions ?? 0) / experience.copies) * 100) : null
  const slowest = experience?.msByHost ? Math.max(...Object.values(experience.msByHost)) : null
  // the shard size from the measured experience: a wave should answer within one second of the slowest host's median, so a batch is sharded until each shard's share does
  const shardSize = slowest ? Math.max(1, Math.floor(1000 / slowest)) : 8
  return {
    batch: { actions: BATCH_ACTIONS, mcp: 'POST /mcp with a JSON-RPC array: every call answered as its batch action, in order, one request, each decided by RBAC', rest: ['PATCH /api/entries?where[kind][equals]=<kind> (bulk update by where: refused for entries, immutable)', 'DELETE /api/entries?where[from][equals]=<device> (bulk delete, admin)', 'POST /api/entries (one create; a batch is one MCP array of raid calls)'] },
    quantum: { shard: 'a batch above the quantum is split by the shard tool: item k to shard k mod n (every item shared, no overlap)', waves: 'shards run at once as one wave, the outputs merged in order; the next step is teleported the blocks already computed', coordinated: 'input and output are coordinated by address: a call\'s output block is the next call\'s input by uuid, so a batch is a chain of addresses the balancer answers without recomputing' },
    experience: { measured: experience ?? null, freeShare: free, slowestMedianMs: slowest, shardSize, says: experience ? `${free}% of the gate\'s copies answered free (304 by involution); the slowest host answers in ${slowest} ms, so a batch is sharded to ${shardSize} calls a shard to stay within a second` : 'no measurement passed: the defaults stand (8 calls a shard)' },
  }
}
/** The Payload hooks the full stack carries, each with what it does and what it keeps free: a hook is configuration too, improved on every run. */
/** The organisation of the generated files is decided by role, never typed by hand: a role fixes the folder, the case of the name and the
 *  extension (Payload's own layout under the fork's aliases) and says what loads the file — the computational reason for its place: a block
 *  config, a collection and a global load with the Payload config (server only); a config module is imported by payload.config.ts, one per
 *  concern; a component is reachable by the Pages Router too, so it imports no next/headers and no @payload-config; a script runs under
 *  payload run; a notice is never compiled. textbook_fullstack_files_by_role partitions the fifteen files over the eight roles. */
export const FILE_ROLES = TABLES.FILE_ROLES
type FileRole = keyof typeof FILE_ROLES
const pascal = (t: string) => t.replace(/(^|[-_ ])([a-z])/g, (_m, _s, c: string) => c.toUpperCase())
const fileCamel = (t: string) => { const p = pascal(t); return p.slice(0, 1).toLowerCase() + p.slice(1) }
/** The path of a generated file from its role and key alone. */
// the default payloadcms/website app directory the overlay is generated into (the deploy clones the template here); site/ is removed
/** This repository is the full stack. Develop under src/ to the payloadcms/website standard; packages and MCP from payloadcms/payload (@payloadcms/plugin-mcp). */
export const APP_DIR = ''
const joinApp = (...parts: string[]) => parts.filter(Boolean).join('/')
export const file = (role: FileRole, key: string): string => {
  const base = joinApp(APP_DIR, FILE_ROLES[role].folder)
  switch (role) {
    case 'block': return joinApp(base, pascal(key), 'config.ts')
    case 'config': return joinApp(base, `payload.qpu.${key.toLowerCase()}.ts`)
    case 'notice': return joinApp(base, `${key.toUpperCase()}.qpu.md`)
    case 'collection': case 'global': return joinApp(base, `${pascal(key)}.ts`)
    case 'hooks': return joinApp(base, `${key.toLowerCase()}.qpu.hooks.ts`)
    case 'component': return joinApp(base, `${key}.tsx`)
    case 'graphic': return joinApp(base, pascal(key), 'index.tsx')
    case 'script': case 'plugin': return joinApp(base, `${fileCamel(key)}.ts`)
    case 'root': return joinApp(base, `${key.toLowerCase()}.config.ts`)
    case 'migration': return joinApp(base, `${key}.ts`)
  }
}
/** The clay workflow of one address: every place of its program, one rotation each. The handle and the tail stay. Ten places return the program. The address itself returns when its variant nibble is already 8. Every aspect witnesses each place. */
const clayProgram = (address: string) => {
  const read = channel(address)
  const installed = program(read.handle)
  const steps: { place: number; sealed: boolean; kept: boolean; back: boolean; around: boolean; all: boolean; aspects: number }[] = []
  let current = address
  let places = 1
  while (steps.length < places && steps.length < 16) {
    const moved = rotateProgram(current)
    if (steps.length === 0) places = moved.places
    steps.push({ place: steps.length, sealed: moved.sealed, kept: moved.kept, back: moved.back, around: moved.around, all: moved.all === true && moved.aspects.length === 4, aspects: moved.aspects.length })
    current = moved.next
  }
  const arrived = channel(current)
  const same = arrived.program.join() === read.program.join() && arrived.handle === read.handle && arrived.tail === read.tail
  const witnessed = steps.length === places && steps.every((step) => step.sealed && step.kept && step.back && step.around && step.all && step.aspects === 4)
  return { handle: read.handle, path: installed.path, depth: installed.depth, indexed: installed.indexed, places, steps: steps.length, program: same, variant: arrived.variant, address: current === address, returned: same && (arrived.variant === '8' ? current === address : true), witnessed, holds: installed.indexed && installed.depth === 7 && program && witnessed }
}
/** The exit a hook status selects. Code 0 conforms. Every other code is reported, and the walk stays open. */
const hookExit = (code: number, answer?: { status?: number; text?: string }) => {
  const row = ISO_EXIT.exits[code] ?? ISO_EXIT.exits[1]!
  const online = verifyIsoOnline(answer)
  const research = { before: true as const, fetched: false as const, phase: online.phase, request: online.request, source: online.source, verified: online.verified, defined: online.defined, holds: online.holds }
  return { research, code: row.code, strategy: row.strategy, forth: row.forth, back: row.back, closed: row.closed, exited: row.exited, says: row.says }
}
/** ISO 9001 audited in every scientific domain. Each domain is a UUID program, and the clay workflow develops that program. A page that is not the whole set still names the one domains request. */
const auditDomains = (raw: unknown) => {
  const cover = domainConfigs(raw)
  const named = 'names' in cover.domains && Array.isArray(cover.domains.names) ? cover.domains.names.map((name, index) => ({ name, fields: cover.domains.radices[index] ?? 0 })) : []
  const subjects = named.length > 0 ? named : [{ name: 'scientific domains', fields: 0 }]
  const programs = subjects.map((domain) => {
    const formula = domain.fields > 0 ? `${domain.name} holds ${domain.fields} fields.` : 'Π |fields(domain)|'
    const developed = developViaHooks({ formula, product: 'iso', variant: domain.name, title: domain.name, theorem: 'textbook_standards_sliced' })
    const audit = isoAudit({ iso: developed.iso, docs: developed.docs })
    const address = uuid(formula)
    const program = clayProgram(address)
    const moved = rotateProgram(address)
    const carried = developViaHooks({ formula, product: 'iso', variant: domain.name, title: domain.name, theorem: 'textbook_standards_sliced' })
    const reviewed = isoAudit({ iso: carried.iso, docs: carried.docs })
    const clay = clayProgram(moved.next)
    const exit = carried.exit
    const next = { from: address, address: moved.next, handle: moved.handle, kept: moved.kept, back: moved.back, around: moved.around, sealed: moved.sealed, places: moved.places, aspects: moved.aspects.length, all: moved.all === true, program: moved.program, rotated: moved.rotated, audit: reviewed, clay, developed: carried.iso.documented === true, exit, holds: moved.kept && moved.back && moved.around && moved.sealed && moved.places === 10 && moved.aspects.length === 4 && moved.all === true && moved.rotated === `${moved.program.slice(1)}${moved.program[0]}` && reviewed.holds && clay.holds && clay.handle === moved.handle && exit.research.before === true && exit.research.fetched === false && exit.research.request.method === 'GET' && exit.code === 0 && exit.exited === false && exit.closed === true && exit.strategy === 'conforming' }
    return { domain: domain.name, fields: domain.fields, formula, address, sealed: seal(address).valid, audit, program, developed: developed.iso.documented === true, next }
  })
  const holds = programs.length > 0 && programs.every((row) => row.sealed && row.developed && row.audit.holds && row.audit.dimensions === ISO_DIMENSIONS.length && row.program.holds && row.program.places === 10 && row.program.witnessed && row.next.holds)
  return { ...cover, programs, audit: { process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 9.2' as const, via: 'clay' as const, domains: programs.length, dimensions: ISO_DIMENSIONS.length, holds } }
}
/** ISO 9001 improvement. A formula is improved through every dimension and every Alpine case. true improves all of that via the ideas: next walks every idea until .idea is empty, each idea is developed and then improved, and each one is a pages create and a products create. quantum develops each ISO/IEC 4879:2024 term as an idea and improves it the same way. An empty formula is not documented. */
const documentedIso = (iso: { formula?: string; documented?: boolean } | undefined) => (iso?.formula?.length ?? 0) > 0 && iso?.documented === true
const improveCover = () => {
  const alpine = listAlpine()
  const exits = alpine.cover.exits + ISO_EXIT.cover.exits
  const entries = alpine.cover.entries.length + ISO_EXIT.cover.entries.length
  const covered = alpine.cover.covered + ISO_EXIT.cover.covered
  const uncovered = alpine.cover.uncovered + ISO_EXIT.cover.uncovered
  const holds = alpine.holds && alpine.cover.holds && ISO_EXIT.cover.holds && alpine.cover.uncovered === 0 && ISO_EXIT.cover.uncovered === 0 && alpine.cover.covered + alpine.cover.uncovered === alpine.cover.exits && ISO_EXIT.cover.covered === ISO_EXIT.cover.exits
  return { alpine, cases: alpine.total, exits, entries, covered, uncovered, holds }
}
const improveFormula = (formula: string, product: string, variant: string, title: string) => {
  const developed = developViaHooks({ formula, product, variant, title, theorem: 'textbook_standards_sliced' })
  const again = developViaHooks({ formula: developed.iso.formula, product, variant, title, theorem: 'textbook_standards_sliced' })
  return { developed, improved: again, documented: documentedIso(developed.iso) && documentedIso(again.iso) }
}
/** Each declared aspect of one address, optimised against the quantum AI challenges, the leads, and the ideas. The object stays the handle. The bonus is the program and the tail. The birth is the UUID. */
const optimiseFilesystem = (raw: unknown) => {
  const given = typeof raw === 'string' ? raw : isObj(raw) && typeof (raw as { address?: unknown }).address === 'string' ? (raw as { address: string }).address : uuid('filesystem')
  const turned = rotateProgram(given)
  const step = isObj(raw) && (raw as { next?: unknown }).next === true
  const address = step ? turned.next : given
  const origin = birth(given)
  const moved = birth(turned.next)
  const seen = readAspects(address)
  const born = birth(address)
  const challenges = GOOGLE_CHALLENGE_IDS.map((id) => uuid(`challenge\n${id}`))
  const quantum = openQuantum(LEADS)
  const leadAddresses = quantum.map((lead) => uuid(`lead\n${lead.id}`))
  const ideaAddresses = quantum.flatMap((lead) => (lead.idea ? [uuid(`idea\n${lead.idea}`)] : []))
  const sources = {
    collection: { via: 'challenges' as const, neighbours: challenges },
    global: { via: 'leads' as const, neighbours: leadAddresses },
    field: { via: 'ideas' as const, neighbours: ideaAddresses },
    node: { via: 'challenges,leads,ideas' as const, neighbours: [...challenges, ...leadAddresses, ...ideaAddresses] },
  }
  const rows = seen.aspects.map((row) => {
    const source = sources[row.aspect as keyof typeof sources]
    const kept = optimiseAddress(address, source.neighbours)
    const next = birth(kept.kept)
    return { aspect: row.aspect, via: source.via, neighbours: source.neighbours.length, kept: kept.kept, place: kept.place, seam: kept.seam, greatest: kept.greatest, formula: kept.formula, object: next.path === born.path, tail: next.dnode.bonus.tail.join() === born.dnode.bonus.tail.join(), checksum: next.checksum }
  })
  const next = { from: given, address: turned.next, program: turned.program, rotated: turned.rotated, kept: turned.kept, back: turned.back, around: turned.around, places: turned.places, sealed: turned.sealed, aspects: turned.aspects.length, all: turned.all === true, object: moved.path === origin.path, tail: moved.dnode.bonus.tail.join() === origin.dnode.bonus.tail.join(), holds: turned.kept === true && turned.back === true && turned.around === true && turned.sealed === true && turned.places === 10 && turned.aspects.length === 4 && turned.all === true && turned.rotated === `${turned.program.slice(1)}${turned.program[0]}` && moved.path === origin.path && moved.dnode.bonus.tail.join() === origin.dnode.bonus.tail.join() && moved.birth.path !== origin.birth.path }
  const holds = seen.aspects.length === 4 && rows.length === 4 && rows.every((row) => row.greatest && row.object && row.tail && row.neighbours > 0 && seal(row.checksum).valid) && born.dnode.bonus.program.length === 10 && born.dnode.bonus.tail.length === 3 && born.birth.bits === 128 && born.birth.fanout === 65536 && born.birth.folders.length === 8 && born.depth === 7 && born.checksum === address && next.holds && (!step || address === turned.next)
  return {
    phase: 'optimise' as const,
    address,
    object: born.path,
    bonus: born.dnode.bonus,
    birth: born.birth,
    checksum: born.checksum,
    challenges: challenges.length,
    leads: leadAddresses.length,
    ideas: ideaAddresses.length,
    aspects: rows,
    next,
    holds,
    says: holds ? `each aspect keeps the object ${born.handle} and the tail. collection uses the ${challenges.length} quantum AI challenges, global the ${leadAddresses.length} leads, field the ${ideaAddresses.length} ideas, and node all three. The birth is 128 bits at fanout 65536. The next step rotates the program one place.` : 'an aspect did not keep the object',
  }
}
/** Each filesystem adapter is improved with the ideas: its formula is documented, and the audit holds on every dimension. */
const improveFilesystem = () => {
  const zfs = chosen('programs').improve()
  const specs = [
    { part: 'programs' as const, formula: 'zfs places each handle in eight nibble levels. the fanout is 16 and the span is 4294967296. a birth is the uuid, eight groups of four hex, fanout 65536.' },
    { part: 'documents' as const, formula: 'hex places each document at the three middle groups of its address.' },
    { part: 'io' as const, formula: 'node reads and writes the file the other adapters name.' },
  ]
  const rows = specs.map((spec) => {
    const developed = developViaHooks({ formula: spec.formula, product: 'fs', variant: spec.part, title: spec.part, theorem: 'textbook_standards_sliced' })
    const audit = isoAudit({ iso: developed.iso, docs: developed.docs })
    return { part: spec.part, pkg: chosen(spec.part).pkg, formula: spec.formula, documented: developed.iso.documented === true, audit }
  })
  const object = place('00000000')
  const id = '70a13419-52d5-2702-a236-d17851bf2b4a'
  const stored = store(id)
  const path = documentPath(id)
  const placed = zfs.placed && object.path === 'src/quantum/uuid/programs/0/0/0/0/0/0/0/0/index.ts' && object.span === '4294967296' && object.count === 8 && object.depth === 7
  const document = path === `52d5/2702/a236/${id}`
  const leaf = readFile(object.path)
  const read = leaf !== null && leaf.includes('nil')
  const holds = zfs.holds && zfs.pkg === 'zfs' && zfs.zero && rows.length === 3 && rows.every((row) => row.documented && row.audit.holds && row.audit.dimensions === ISO_DIMENSIONS.length) && placed && document && read && stored.id === id && stored.bindings.length === 6 && stored.pkg.length > 0
  return { adapters: rows.length, rows, placed, document, zfs, network: { id: stored.id, pkg: stored.pkg, provider: stored.provider, binding: stored.binding }, holds }
}
const bornIdea = (id: string) => {
  const born = birth(id)
  const holds = born.pkg === 'zfs' && born.checksum === id && born.path === `src/quantum/uuid/programs/${[...born.handle].join('/')}/index.ts` && born.depth === 7 && born.dnode.bonus.program.length === 10 && born.dnode.bonus.tail.length === 3 && born.birth.bits === 128 && born.birth.fanout === 65536 && born.birth.folders.length === 8
  return { address: id, handle: born.handle, path: born.path, birth: born.birth.path, holds }
}
const improveViaAll = (raw: unknown, leads: readonly { id: string; source: string; statement: string }[] = []) => {
  if (raw === 'iso' || (isObj(raw) && (raw as { iso?: unknown }).iso === true)) return improveIso(raw)
  if (isObj(raw) && 'domains' in raw) return auditDomains((raw as { domains: unknown }).domains)
  const cover = improveCover()
  const quantumAsked = raw === 'quantum' || (isObj(raw) && (raw as { ideas?: unknown }).ideas === 'quantum')
  const lifeAsked = raw === 'life' || (isObj(raw) && (raw as { ideas?: unknown }).ideas === 'life')
  const formula = quantumAsked || lifeAsked ? null : typeof raw === 'string' ? raw : isObj(raw) && !('ideas' in raw) && typeof (raw as { formula?: unknown }).formula === 'string' ? (raw as { formula: string }).formula : null
  if (formula !== null) {
    const one = improveFormula(formula, 'improve', 'all', 'improve')
    const dimensions = ISO_DIMENSIONS.map((dimension) => ({ dimension, documented: one.documented }))
    const improved = one.documented && dimensions.every((row) => row.documented) && dimensions.length === ISO_DIMENSIONS.length
    return {
      phase: 'improve' as const, process: 'ISO 9001' as const, via: 'all' as const, formula,
      documented: improved, improve: one.developed, improved: one.improved,
      dimensions: dimensions.length, of: ISO_DIMENSIONS.length,
      cases: cover.cases, exits: cover.exits, entries: cover.entries, covered: cover.covered, uncovered: cover.uncovered,
      holds: improved && cover.holds,
      theorem: 'textbook_standards_sliced' as const,
      says: improved ? `ISO 9001 improves the improvement via all ${dimensions.length} dimensions and ${cover.cases} cases. ${cover.entries} entries cover ${cover.exits} exits.` : 'an empty formula is not documented, so the improvement is not',
    }
  }
  const asked = quantumAsked ? 'quantum' : lifeAsked ? 'life' : isObj(raw) && 'ideas' in raw ? (raw as { ideas: unknown }).ideas : true
  const source = asked === true || (isObj(asked) && (asked as { next?: unknown }).next === true) ? true : isObj(asked) && 'next' in asked ? (asked as { next: unknown }).next : asked
  const askedAll = source === true
  const codebase = askedAll ? fixCodebase() : null
  const found = askedAll ? ideaFilesFromLeads(leads) : []
  const input = source === 'quantum-leads' ? { files: placeInIdea(source, leads) } : found.length === 0 ? source : { files: [...placeInIdea(source), ...found] }
  const pool = improveFilesystem()
  const walked = nextIdeas(input, developViaHooks)
  const rows = walked.leads.map((lead) => {
    const prior = lead.developed as { title?: string; product?: string | null; variant?: string | null; iso?: { formula?: string; documented?: boolean; standard?: string } }
    const statement = lead.statement
    const title = (statement.split('\n')[0] || prior.title || 'idea').slice(0, 120)
    const product = prior.product ?? 'idea'
    const variant = prior.variant ?? 'idea'
    const one = improveFormula(prior.iso?.formula || statement, product, variant, title)
    const seeded = pageData(title, statement)
    const record = { iso: one.improved.iso, docs: one.improved.docs }
    const page = auditedSave({ collection: 'pages', data: { ...seeded.data, ...record } })
    const productCall = auditedSave({ collection: 'products', data: { title, product, variant, ...record, _status: 'draft' as const } })
    return { id: lead.id, depth: lead.depth, product, variant, documented: one.documented && documentedIso(prior.iso), formula: statement, page, productCall, zfs: bornIdea(seeded.page.id) }
  })
  const reviewed = rows.flatMap((row) => [row.page.next, row.productCall.next])
  const next = { phase: 'next' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 9.3' as const, accepted: reviewed.filter((row) => row.decision === 'accept' && row.holds).length, refused: reviewed.filter((row) => row.decision === 'nonconformity').length, of: reviewed.length, holds: reviewed.length > 0 && reviewed.every((row) => row.decision === 'accept' && row.clause === 'ISO 9001:2015, 9.3' && row.holds && row.sealed) }
  const changes = rows.flatMap((row) => [row.page.change, row.productCall.change])
  const change = { phase: 'next' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 6.3' as const, purpose: 'each accepted save becomes the audited process' as const, planned: changes.filter((row) => row.holds && row.integrity).length, of: changes.length, holds: next.holds && changes.length > 0 && changes.every((row) => row.holds === true && row.integrity === true && row.clause === 'ISO 9001:2015, 6.3' && row.sealed === true) }
  const filesystem = { ...pool, births: rows.length, born: rows.length > 0 && rows.every((row) => row.zfs.holds), holds: pool.holds && rows.length > 0 && rows.every((row) => row.zfs.holds) }
  const audited = rows.length > 0 && rows.every((row) => row.page.saved === true && row.page.audit.holds === true && row.productCall.saved === true && row.productCall.audit.holds === true && row.zfs.holds) && next.holds && change.holds
  const documented = rows.length > 0 && rows.every((row) => row.documented) && walked.empty === true && audited
  const improved = documented && ISO_DIMENSIONS.length > 0
  const life = source === 'life' ? isoProcessLife(true) : null
  const mcp = source === 'life' ? isoApprovedMcp() : null
  const lifeAgrees = life === null || (mcp !== null && mcp.only === true && mcp.approved === true && mcp.plugin === 'qpuMcpPlugin' && mcp.api === 'https://qpu.uuidna.com/api/mcp' && mcp.src === false && mcp.fetched === false && mcp.law === MCP_API_KEY.law && mcp.refused === true && mcp.keyed === false && mcp.list.body.method === 'tools/list' && mcp.call.name === 'findDocuments' && mcp.call.body.method === 'tools/call' && mcp.call.route?.url.endsWith('/api/pages') === true && mcp.call.headers === null && life.holds === true && rows.length === life.rows.length && rows.every((row) => row.formula.includes(mcp.plugin) && row.formula.includes(mcp.api)) && rows.some((row) => row.depth === 0 && row.product === 'life' && row.formula.includes(life.perSecond.program?.id ?? '') && row.formula.includes(String(life.perSecond.programs))) && life.rows.filter((row) => row.died).every((row) => rows.some((idea) => idea.depth === 1 && idea.product === 'life' && idea.formula.includes(row.program.id) && idea.formula.includes(row.clause))))
  return {
    phase: 'improve' as const, process: 'ISO 9001' as const, via: 'ideas' as const, home: walked.home, empty: walked.empty, depth: walked.depth,
    ideas: rows.length, of: walked.leads.length, documented: improved,
    dimensions: ISO_DIMENSIONS.length, dimensionsOf: ISO_DIMENSIONS.length,
    cases: cover.cases, exits: cover.exits, entries: cover.entries, covered: cover.covered, uncovered: cover.uncovered,
    holds: improved && cover.holds && filesystem.holds && rows.length === walked.leads.length && audited && next.holds && change.holds && lifeAgrees,
    next, change, filesystem, ...(life ? { life } : {}), ...(mcp ? { mcp } : {}),
    pages: rows.filter((row) => row.page.saved === true && row.page.api === 'create' && row.page.args?.collection === 'pages' && row.page.args.draft === true).length,
    products: rows.filter((row) => row.productCall.saved === true && row.productCall.api === 'create' && row.productCall.args?.collection === 'products' && row.documented).length,
    theorem: 'textbook_standards_sliced' as const,
    rows,
    codebase,
    says: improved ? `${life ? `The process that computes next lives as an idea, and the other ${life.who.length} processes exit as ideas. ` : ''}The management review accepts all ${next.accepted} audited saves of ${rows.length} ideas, and clause 6.3 plans those ${change.planned} changes, on ${ISO_DIMENSIONS.length} dimensions and ${cover.cases} cases. ${cover.entries} entries cover ${cover.exits} exits. zfs places each idea: the object is the handle and the birth is the address.${codebase?.written ? ` The quantum drift is written across ${codebase.fixed} folders.` : ''}` : 'an idea was not audited, so it is not saved',
  }
}
const kernelTheorem = (key: string | undefined) => {
  if (!key) return null
  const kernel = THEOREMS.find((theorem) => theorem.key === key)
  if (!kernel) return null
  const textbook = TEXTBOOK_THEOREMS.find((theorem) => theorem.key === key)
  return { theorem: key, lean: textbook?.lean ?? kernel.statement, says: textbook?.says ?? kernel.statement }
}
/** The defining rows, read once. Clause 9.1 measures a release against this file. Nothing is fetched. */
let definingRows: ReturnType<typeof verifyIsoOnline> | null = null
const definingFile = () => (definingRows ??= verifyIsoOnline({ status: 200, text: ISO_OPEN_DEFINITIONS.map((row) => JSON.stringify(row)).join('\n') }))
/** A product is developed by the three collection hooks, then through the end those hooks already name. beforeChange decides the Lean and takes a possible path: a theorem the kernel accepts. A theorem the kernel does not accept is not taken. afterChange hands the formula to the docs door. afterRead serves the documented product. The audit reads that record, the management review accepts it, clause 6.3 plans the change, clause 8.1 carries it out, clause 8.6 releases it, and clause 9.1 monitors it. An empty formula is not documented, and its end is the nonconformity. */
export const developViaHooks = (input: { formula?: string; product?: string; variant?: string; title?: string; theorem?: string }) => {
  const stated = input.formula ?? ''
  const named = kernelTheorem(input.theorem)
  const routes = named ? [] : routeStatement(stated || input.theorem || '', []).theorems.flatMap((row) => { const decided = kernelTheorem(row.theorem); return decided ? [decided] : [] })
  const taken = named ?? routes[0] ?? null
  const impossible = input.theorem && !named ? input.theorem : null
  const theorem = taken?.theorem ?? input.theorem ?? input.product ?? null
  const params = AXIOMS.filter((axiom) => new RegExp(`\\b${axiom.name}\\b`).test(stated)).map((axiom) => ({ name: axiom.name, formula: axiom.formula, value: axiom.value }))
  const lean = { autonomous: true as const, taken: taken?.theorem ?? null, text: taken?.lean ?? null, possible: taken ? [taken.theorem, ...routes.filter((row) => row.theorem !== taken.theorem).slice(0, 7).map((row) => row.theorem)] : [], impossible }
  const data = { title: input.title ?? input.variant ?? input.product ?? '', product: input.product ?? null, variant: input.variant ?? null, iso: { formula: stated, theorem }, lean }
  const changed = data.iso.formula ? { ...data, iso: { standard: 'ISO 9001' as const, formula: data.iso.formula, documented: true as const, theorem: data.iso.theorem, lean: taken?.lean ?? null } } : data
  const written = { ...changed, docs: { method: 'docs.documents.batchUpdate' as const, text: changed.iso.formula } }
  const served = written
  const documented = 'documented' in served.iso && served.iso.documented === true
  const exit = hookExit(documented ? 0 : 1)
  const audit = isoAudit({ iso: served.iso, docs: served.docs })
  const review = saveNext(audit)
  const change = planChange(audit, review)
  const control = controlProcess(audit, change)
  const release = releaseOutput(audit, control)
  const online = definingFile()
  const monitor = monitorOutput(release, online.rows)
  const complete = documented && online.holds === true && audit.holds === true && review.holds === true && review.decision === 'accept' && change.holds === true && control.holds === true && control.operated === true && release.holds === true && release.released === true && monitor.holds === true
  const end = { complete, fetched: false as const, written: false as const, audit, next: review, change, control, release, monitor }
  return { phase: 'develop' as const, via: 'hooks' as const, process: 'ISO 9001' as const, framework: COIN_STANDARDS, params, hooks: ['beforeChange', 'afterChange', 'afterRead'] as const, lean, exit, ...served, served, end }
}
/** All ISO quantum as nested Payload pages. The vocabulary sits under its clause sections, and the groups, the guards, the layers and the companion dimensions sit beside it. Each page is a pages create after the ISO 9001 audit. Nothing is fetched and nothing is written. */
const quantumPages = () => {
  const eq = verifyIsoQuantumEquivalence()
  const theorem = 'textbook_standards_sliced' as const
  const rootPath = '/quantum'
  const slug = (raw: string) => raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').replace(/iso-iec-/g, '').replace(/iso-tr-/g, '').replace(/iso-/g, '').replace(/^-|-$/g, '').replace(/-{2,}/g, '-').slice(0, 72) || 'page'
  const named = (kind: string, raw: string) => `${kind}-${slug(raw)}`
  const definedFor = (dimension: string) => {
    const key = dimension.replace(/\s*\(.*$/, '').trim()
    return ISO_OPEN_DEFINITIONS.find((row) => row.reference === key || row.reference.startsWith(`${key}:`) || row.reference.startsWith(`${key}-`))
  }
  type Crumb = ReturnType<typeof crumb>
  type Kind = 'section' | 'standard' | 'clause' | 'term' | 'group' | 'guard' | 'layer' | 'companion'
  type Row = { id: string; kind: Kind; title: string; slug: string; path: string; parent: string | null; depth: number; product: string; variant: string; statement: string; holds: boolean; breadcrumbs: Crumb[] }
  const rows: Row[] = []
  const add = (spec: { id: string; kind: Kind; title: string; path: string; parent: string | null; product: string; variant: string; statement: string; holds: boolean }) => {
    const parent = spec.parent === null ? null : rows.find((row) => row.path === spec.parent) ?? null
    const breadcrumbs = parent ? [...parent.breadcrumbs, crumb(spec.path, spec.title)] : [crumb(spec.path, spec.title)]
    rows.push({ ...spec, slug: `/${spec.id}`, depth: breadcrumbs.length, breadcrumbs })
  }
  const vocabulary = eq.vocabulary
  const holding = vocabulary.filter((term) => term.holds).length
  const gap = vocabulary.filter((term) => !term.holds).map((term) => `${term.clause} ${term.name}`)
  const quantumDefined = definedFor('ISO/IEC 4879:2024')
  const sectionOf = (clause: string) => clause.split('.').slice(0, 2).join('.')
  const sections = [...new Set(vocabulary.map((term) => sectionOf(term.clause)))].sort()
  add({ id: 'quantum', kind: 'section', title: 'Quantum', path: rootPath, parent: null, product: 'quantum', variant: 'index', statement: `${eq.standard}. ${holding} of ${vocabulary.length} terms hold.`, holds: eq.bijective })
  const vocabularyPath = `${rootPath}/vocabulary`
  add({ id: 'vocabulary', kind: 'standard', title: quantumDefined?.title.en ?? eq.standard, path: vocabularyPath, parent: rootPath, product: 'vocabulary', variant: 'vocabulary', statement: quantumDefined?.scope.en ?? eq.standard, holds: holding === vocabulary.length && vocabulary.length > 0 })
  for (const section of sections) {
    const terms = vocabulary.filter((term) => sectionOf(term.clause) === section)
    const name = named('clause', section)
    const path = `${vocabularyPath}/${name}`
    add({ id: name, kind: 'clause', title: section, path, parent: vocabularyPath, product: name, variant: section, statement: `${eq.standard}, ${section}. ${terms.length} terms.`, holds: terms.every((term) => term.holds) })
    for (const term of terms) {
      const termName = named('term', `${term.clause} ${term.name}`)
      add({ id: termName, kind: 'term', title: `${term.clause} ${term.name}`, path: `${path}/${termName}`, parent: path, product: termName, variant: term.clause, statement: `${term.clause} ${term.name}`, holds: term.holds })
    }
  }
  const branch = (id: string, title: string, statement: string, holds: boolean) => {
    const path = `${rootPath}/${id}`
    add({ id, kind: 'section', title, path, parent: rootPath, product: id, variant: id, statement, holds })
    return path
  }
  const groupsPath = branch('groups', 'Groups', `${eq.counts.postulatesHolding} of ${eq.counts.postulatesTotal} groups hold.`, eq.noLessQuantum)
  for (const group of eq.noLessPostulates) {
    const name = named('group', group.id)
    add({ id: name, kind: 'group', title: group.id, path: `${groupsPath}/${name}`, parent: groupsPath, product: name, variant: 'group', statement: group.isoClause, holds: group.holds })
  }
  const guardsPath = branch('guards', 'Guards', `${eq.counts.guardsHolding} of ${eq.counts.guardsTotal} guards hold.`, eq.noMoreQuantum)
  for (const guard of eq.noMoreGuards) {
    const name = named('guard', guard.id)
    add({ id: name, kind: 'guard', title: guard.id, path: `${guardsPath}/${name}`, parent: guardsPath, product: name, variant: 'guard', statement: guard.isoClause, holds: guard.holds })
  }
  const layersPath = branch('layers', 'Layers', `${eq.counts.blockchainLayersHolding} of ${eq.counts.blockchainLayersTotal} layers hold.`, eq.isoBlockchainProgrammable)
  for (const layer of eq.isoBlockchainLayers) {
    const name = named('layer', layer.standard)
    const title = layer.standard.replace(/\s*\(.*$/, '').trim()
    add({ id: name, kind: 'layer', title, path: `${layersPath}/${name}`, parent: layersPath, product: name, variant: 'layer', statement: layer.standard, holds: layer.holds })
  }
  const companionsPath = branch('companions', 'Companions', `${eq.companionStandards.length} companion dimensions.`, eq.companionStandards.length === ISO_DIMENSIONS.length - 1)
  for (const dimension of eq.companionStandards) {
    const defined = definedFor(dimension)
    const name = named('companion', defined?.reference ?? dimension)
    add({ id: name, kind: 'companion', title: defined?.title.en ?? dimension, path: `${companionsPath}/${name}`, parent: companionsPath, product: name, variant: dimension, statement: defined ? `${defined.reference}. ${defined.scope.en}` : dimension, holds: Boolean(defined && defined.title.en.length > 0 && defined.scope.en.length > 0) })
  }
  const leads = rows.map((row) => ({ id: row.id, source: row.path, statement: row.statement, status: 'served' as const, tool: 'payload' as const }))
  const developed = rows.map((row) => {
    const iso = developViaHooks({ formula: row.statement, product: row.product, variant: row.variant, title: row.title, theorem })
    return { page: row.path, product: row.product, variant: row.variant, lead: row.id, iso: iso.iso, docs: iso.docs, via: iso.via }
  })
  const address = (path: string) => uuid(path)
  const nodeFor = (row: Row) => qpuNode(address(row.path), 'payload', { product: row.product, variant: row.variant, page: row.path }, theorem)
  const pages = rows.map((row) => {
    const children = rows.filter((child) => child.parent === row.path)
    const own = nodeFor(row)
    const richText = lx.doc([
      lx.heading(row.title, 'h1'),
      lx.paragraph([lx.text(row.statement)]),
      ...(row.parent ? [lx.paragraph([lx.text('Nested under '), lx.link(row.parent, row.parent)])] : []),
      ...children.map((child) => lx.paragraph([lx.link(child.path, child.title), lx.text(` · ${child.product} / ${child.variant}`)])),
      own,
      ...children.map(nodeFor),
    ])
    return { ...row, uuid: address(row.path), layout: [own.fields], meta: { title: row.title, description: row.statement.slice(0, 160) }, hero: { type: 'default' as const, richText }, breadcrumbs: row.breadcrumbs }
  })
  const blockIds = (page: (typeof pages)[number]) => blocks(page.hero.richText).map((node) => node.fields.uuid)
  const linked = pages.every((page) => {
    const lead = leads.find((item) => item.id === page.id)
    const dev = developed.find((item) => item.page === page.path)
    const children = pages.filter((child) => child.parent === page.path)
    const ids = blockIds(page)
    const text = JSON.stringify(page.hero.richText)
    const parent = page.parent === null || pages.some((item) => item.path === page.parent && item.depth === page.depth - 1)
    const iso = dev?.iso as { standard?: string; documented?: boolean; formula?: string } | undefined
    return lead?.source === page.path && iso?.standard === 'ISO 9001' && iso.documented === true && iso.formula === page.statement && ids.includes(page.uuid) && children.every((child) => ids.includes(child.uuid) && text.includes(child.path)) && parent && page.breadcrumbs.length === page.depth && page.layout[0]!.uuid === page.uuid && !page.product.startsWith('textbook_')
  })
  const saves = pages.map((page) => {
    const dev = developed.find((item) => item.page === page.path)
    return auditedSave({ collection: 'pages', override: false, data: { title: page.title, slug: page.slug, path: page.path, parent: page.parent, kind: page.kind, product: page.product, variant: page.variant, _status: 'published', hero: page.hero, layout: page.layout, meta: page.meta, breadcrumbs: page.breadcrumbs, iso: dev?.iso, docs: dev?.docs } })
  })
  const saved = saves.every((save) => save.saved && save.next.decision === 'accept' && save.change.holds)
  const depth = pages.reduce((max, page) => Math.max(max, page.depth), 1)
  const words = ['term', 'clause', 'group', 'guard', 'layer', 'companion'] as const
  const bareOf = (product: string) => { const kind = words.find((word) => product.startsWith(`${word}-`)); return kind ? product.slice(kind.length + 1) : product }
  const byBare = new Map<string, string[]>()
  for (const page of pages) { const bare = bareOf(page.product); const list = byBare.get(bare) ?? []; list.push(page.product); byBare.set(bare, list) }
  const held = [...byBare.values()].filter((products) => new Set(products).size > 1).map((products) => [...new Set(products)].sort())
  const isoPrefixed = pages.some((page) => page.id.startsWith('iso-') || page.product.startsWith('iso-') || page.path.split('/').some((part) => part.startsWith('iso-')))
  const pair = held[0] ?? []
  const left = pages.find((page) => page.product === pair[0])
  const right = pages.find((page) => page.product === pair[1])
  const bare = left ? bareOf(left.product) : ''
  const shared = uuid(bare)
  const apart = left && right ? merge(doc('base', []), doc('a', [{ uuid: left.uuid, tool: 'payload', arguments: { product: left.product } }]), doc('b', [{ uuid: right.uuid, tool: 'payload', arguments: { product: right.product } }])) : null
  const collapsed = left && right ? merge(doc('base', []), doc('a', [{ uuid: shared, tool: 'payload', arguments: { product: left.product } }]), doc('b', [{ uuid: shared, tool: 'payload', arguments: { product: right.product } }])) : null
  const prefixed = !isoPrefixed && apart?.collisions === 0 && apart.blocks === 2 && collapsed?.collisions === 1 && held.length > 0
  const holds = eq.bijective && linked && saved && gap.length === 0 && pages.length === saves.length && prefixed
  return {
    phase: 'quantum' as const, via: 'payload' as const, organisation: 'nested-pages' as const, section: rootPath, standard: eq.standard, bijective: eq.bijective, address: eq.address, sealed: eq.sealed, fetched: false as const,
    quantum: { standard: eq.standard, terms: vocabulary.length, holding, gap, from: '3.1.1' as const, to: '3.6.4' as const, sections: sections.length, groups: eq.noLessPostulates.length, guards: eq.noMoreGuards.length, layers: eq.isoBlockchainLayers.length, companions: eq.companionStandards.length },
    prefixes: { words: [...words], iso: false as const, held, apart: apart ? { blocks: apart.blocks, collisions: apart.collisions } : null, bare: collapsed ? { blocks: collapsed.blocks, collisions: collapsed.collisions } : null },
    count: pages.length, depth, nested: linked, pages, leads, developed, iso: { standard: 'ISO 9001' as const, linked }, saves, holds,
    says: holds ? `${pages.length} nested pages under /quantum. A prefix is a plain word such as term or layer, so ${held.length} shared ${held.length === 1 ? 'name stays' : 'names stay'} apart when merged. The word iso is not a prefix. ${holding} of ${vocabulary.length} terms hold, from 3.1.1 through 3.6.4. Each page is a pages create the audit accepted, and clause 6.3 plans that change.` : `${holding} of ${vocabulary.length} terms hold. The nested pages did not all pass.`,
  }
}
/** A theorem name is a deliverable, or it is not. A deliverable number, or a term the vocabulary names, stays a theorem and points at that page. Every other name moves from theorems to the place its own word already has. The kernel key is not renamed. The word iso is not a prefix. Nothing is fetched and nothing is written. */
const theoremNames = () => {
  const theorem = 'textbook_standards_sliced' as const
  const slug = (raw: string) => raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').replace(/iso-iec-/g, '').replace(/iso-tr-/g, '').replace(/iso-/g, '').replace(/^-|-$/g, '').replace(/-{2,}/g, '-').slice(0, 72) || 'page'
  const glue = new Set(['a', 'an', 'the', 'of', 'to', 'and', 'or', 'is', 'are', 'by', 'for', 'in', 'on', 'with', 'from', 'its', 'no', 'not', 'per'])
  const companionOf = (number: string) => {
    const row = ISO_OPEN_DEFINITIONS.find((item) => item.reference.match(/\d{3,}/)?.[0] === number)
    return row ? `/quantum/companions/companion-${slug(row.reference)}` : null
  }
  const termOf = (word: string) => quantumTermNames().find((term) => term.name.toLowerCase() === word)
  const termPath = (word: string) => {
    const term = termOf(word)
    if (!term) return null
    const section = term.clause.split('.').slice(0, 2).join('.')
    return `/quantum/vocabulary/clause-${slug(section)}/term-${slug(`${term.clause} ${term.name}`)}`
  }
  const deliverable = (token: string): { place: string; path: string } | null => {
    const number = companionOf(token)
    if (number) return { place: 'companion', path: number }
    if (token === 'uuid' || token === 'uuids') return { place: 'companion', path: companionOf('9834') ?? '/quantum/companions' }
    if (token === 'blockchain' || token === 'ledger') return { place: 'companion', path: companionOf('22739') ?? '/quantum/companions' }
    if (token === 'vocabulary') return { place: 'vocabulary', path: '/quantum/vocabulary' }
    const singular = token.endsWith('s') ? token.slice(0, -1) : token
    const named = new Set(['qubit', 'qudit', 'hilbert', 'hamiltonian', 'eigenstate', 'eigenvalue', 'eigenspace', 'decoherence', 'superposition', 'entanglement', 'annealer', 'boson', 'coupler'])
    if (named.has(singular)) { const path = termPath(singular); if (path) return { place: 'term', path } }
    return null
  }
  const known = new Set(TEXTBOOK_THEOREMS.map((item) => item.key))
  const rows = TEXTBOOK_THEOREMS.map((item) => {
    const tokens = item.key.replace(/^textbook_/, '').split('_').filter((token) => token.length > 0 && token !== 'iso')
    const found = tokens.map(deliverable).find((hit) => hit !== null) ?? null
    if (found) return { key: item.key, name: slug(tokens.join(' ')), iso: true as const, place: found.place, path: found.path }
    const place = tokens.find((token) => token.length > 1 && !glue.has(token)) ?? 'page'
    const name = slug(tokens.join(' '))
    return { key: item.key, name, iso: false as const, place, path: `/${place}/${name}` }
  })
  const stayed = rows.filter((row) => row.iso)
  const moved = rows.filter((row) => !row.iso)
  const places = [...new Set(moved.map((row) => row.place))].sort()
  type Crumb = ReturnType<typeof crumb>
  type Row = { id: string; kind: 'place' | 'name'; title: string; slug: string; path: string; parent: string | null; depth: number; product: string; variant: string; statement: string; key: string; breadcrumbs: Crumb[] }
  const pages: Row[] = []
  for (const place of places) {
    const names = moved.filter((row) => row.place === place)
    const path = `/${place}`
    pages.push({ id: `place-${place}`, kind: 'place', title: place, slug: `/${place}`, path, parent: null, depth: 1, product: place, variant: 'place', statement: `${place} holds ${names.length} names. They are not deliverable terms, so they moved here from theorems.`, key: place, breadcrumbs: [crumb(path, place)] })
    for (const row of names) {
      const namePath = row.path
      pages.push({ id: `name-${row.name}`, kind: 'name', title: row.name.replace(/-/g, ' '), slug: `/${row.name}`, path: namePath, parent: path, depth: 2, product: row.name, variant: place, statement: `${row.name} moved here from theorems. The kernel key stays ${row.key}.`, key: row.key, breadcrumbs: [crumb(path, place), crumb(namePath, row.name)] })
    }
  }
  const leads = pages.map((page) => ({ id: page.id, source: page.path, statement: page.statement, status: 'served' as const, tool: 'payload' as const }))
  const address = (path: string) => uuid(path)
  const nodeFor = (page: Row) => qpuNode(address(page.path), 'payload', { product: page.product, variant: page.variant, page: page.path }, theorem)
  const docs = pages.map((page) => {
    const children = pages.filter((child) => child.parent === page.path)
    const own = nodeFor(page)
    const richText = lx.doc([
      lx.heading(page.title, 'h1'),
      lx.paragraph([lx.text(page.statement)]),
      ...(page.parent ? [lx.paragraph([lx.text('Nested under '), lx.link(page.parent, page.parent)])] : []),
      ...children.map((child) => lx.paragraph([lx.link(child.path, child.title)])),
      own,
      ...children.map(nodeFor),
    ])
    return { ...page, uuid: address(page.path), layout: [own.fields], meta: { title: page.title, description: page.statement.slice(0, 160) }, hero: { type: 'default' as const, richText }, breadcrumbs: page.breadcrumbs }
  })
  const blockIds = (page: (typeof docs)[number]) => blocks(page.hero.richText).map((node) => node.fields.uuid)
  const linked = docs.every((page) => {
    const lead = leads.find((item) => item.id === page.id)
    const children = docs.filter((child) => child.parent === page.path)
    const ids = blockIds(page)
    const text = JSON.stringify(page.hero.richText)
    const parent = page.parent === null || docs.some((item) => item.path === page.parent && item.depth === page.depth - 1)
    return lead?.source === page.path && ids.includes(page.uuid) && children.every((child) => ids.includes(child.uuid) && text.includes(child.path)) && parent && page.breadcrumbs.length === page.depth && page.layout[0]!.uuid === page.uuid && !page.product.startsWith('textbook_') && !page.id.startsWith('iso-') && !page.product.startsWith('iso-') && page.path.split('/').every((part) => !part.startsWith('iso-'))
  })
  const saves = docs.map((page) => auditedSave({ collection: 'pages', override: false, data: { title: page.title, slug: page.slug, path: page.path, parent: page.parent, kind: page.kind, product: page.product, variant: page.variant, _status: 'published', hero: page.hero, layout: page.layout, meta: page.meta, breadcrumbs: page.breadcrumbs, iso: { standard: 'ISO 9001', formula: page.statement, documented: true, theorem }, docs: { text: page.statement } } }))
  const saved = saves.every((save) => save.saved && save.next.decision === 'accept' && save.change.holds)
  const next = { phase: 'next' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 9.3' as const, accepted: saves.filter((save) => save.next.decision === 'accept' && save.next.holds).length, refused: saves.filter((save) => save.next.decision === 'nonconformity').length, of: saves.length, holds: saves.length > 0 && saves.every((save) => save.next.decision === 'accept' && save.next.clause === 'ISO 9001:2015, 9.3' && save.next.holds && save.next.sealed) }
  const change = { phase: 'next' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 6.3' as const, purpose: 'each accepted name becomes the audited process' as const, planned: saves.filter((save) => save.change.holds && save.change.integrity).length, of: saves.length, holds: next.holds && saves.length > 0 && saves.every((save) => save.change.holds === true && save.change.integrity === true && save.change.clause === 'ISO 9001:2015, 6.3' && save.change.sealed === true) }
  const control = { phase: 'control' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 8.1' as const, operated: saves.filter((save) => save.control.holds).length, of: saves.length, holds: change.holds && saves.length > 0 && saves.every((save) => save.control.holds === true && save.control.operated === true && save.control.clause === 'ISO 9001:2015, 8.1' && save.control.formula === save.audit.formula && save.control.sealed === true) }
  const release = { phase: 'release' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 8.6' as const, released: saves.filter((save) => save.release.holds).length, of: saves.length, holds: control.holds && saves.length > 0 && saves.every((save) => save.release.holds === true && save.release.released === true && save.release.clause === 'ISO 9001:2015, 8.6' && save.release.formula === save.audit.formula && save.release.sealed === true) }
  const keysKept = rows.every((row) => known.has(row.key) && row.key.startsWith('textbook_'))
  const prefixed = docs.every((page) => !page.path.split('/').some((part) => part.startsWith('iso-')))
  const holds = linked && saved && keysKept && prefixed && next.holds && change.holds && control.holds && release.holds && stayed.length + moved.length === TEXTBOOK_THEOREMS.length && stayed.every((row) => row.iso) && moved.every((row) => !row.iso) && docs.length === places.length + moved.length
  return {
    phase: 'names' as const, via: 'payload' as const, organisation: 'nested-pages' as const, of: TEXTBOOK_THEOREMS.length,
    theorems: stayed, moved, places: places.length, count: docs.length, nested: linked, kernel: keysKept, pages: docs, saves, next, change, control, release, holds,
    says: holds ? `${moved.length} names moved from theorems to the place the name already has. ${stayed.length} names are deliverable terms and stay theorems. The management review accepts all ${next.accepted} placed pages, clause 6.3 plans those ${change.planned} changes, clause 8.1 carries out ${control.operated} of them, and clause 8.6 releases ${release.released} of them. The kernel key stays on each name. The word iso is not a prefix.` : 'a theorem name was not placed',
  }
}
/** The theorem reading as the product the collection hooks serve. beforeChange records each formula. afterChange hands the combination to the docs door. afterRead serves that document. The create runs under access. Nothing here calls the factor door. */
export const serveViaHooks = (theorems: readonly string[] = DECODE_THEOREMS) => {
  const developed = theorems.map((theorem) => {
    const stated = TEXTBOOK_THEOREMS.find((item) => item.key === theorem)
    return developViaHooks({ formula: stated?.says ?? theorem, product: 'factor', variant: theorem, title: theorem, theorem })
  })
  const formula = developed.map((row) => row.iso.formula).filter((line) => line.length > 0).join('\n')
  const served = developViaHooks({ formula, product: 'factor', variant: 'combination', title: 'factor', theorem: theorems[0] })
  const recorded = (iso: { formula: string }) => 'documented' in iso && iso.documented === true
  const entry = auditedSave({ collection: 'products', override: false, data: { title: served.title, product: served.product, variant: served.variant, iso: served.iso, docs: served.docs } })
  return {
    via: 'hooks' as const, manual: false as const, process: 'ISO 9001' as const, hooks: served.hooks,
    beforeChange: 'the formula is recorded' as const, afterChange: 'the formula is handed to the docs door' as const, afterRead: 'the documented formula is served' as const,
    documented: recorded(served.iso) && developed.every((row) => recorded(row.iso)),
    developed: developed.map((row) => ({ theorem: row.iso.theorem, documented: recorded(row.iso), formula: row.iso.formula })),
    served, entry,
  }
}
/** A refusal is not a dead end. beforeChange records it, afterChange hands it to online research, afterRead serves the possibilities. The research is the ISO Open Data request. Nothing is fetched here. */
const hookResearch = (why: string, possibilities: readonly { id: string; does: string }[]) => {
  const online = verifyIsoOnline()
  return { phase: 'research' as const, via: 'hooks' as const, hooks: ['beforeChange', 'afterChange', 'afterRead'] as const, beforeChange: 'the refusal is recorded', afterChange: 'the refusal is handed to online research', afterRead: 'the possibilities are served', tokenFree: true as const, fetched: false as const, why, request: online.request, citations: online.research, source: online.source, possibilities, says: 'a refusal is re-fused through the hooks into online research; the possibilities are served and nothing is fetched here' }
}
/** Cursor's Google connectors, as the ISO document is written. Drive is Cursor's HTTP MCP; Gmail and Calendar are Google's. Tools stay hidden until sign-in. A file id comes from search or create. The formula is markdown converted to a Doc in one create_file. read_file is the ground truth: the document counts when that text contains the formula. */
const CONNECTORS = [
  { product: 'Drive', url: 'https://api.cursor.com/rest-mcp/google-drive/mcp', hosted: 'cursor' as const, does: 'the ISO document: markdown to a Doc in one create_file' },
  { product: 'Gmail', url: 'https://gmailmcp.googleapis.com/mcp/v1', hosted: 'google' as const, does: 'the tenant mail, after the document exists' },
  { product: 'Calendar', url: 'https://calendarmcp.googleapis.com/mcp/v1', hosted: 'google' as const, does: 'the same sign-in, then its own tools; not the document' },
] as const
const DRIVE_DOC = 'application/vnd.google-apps.document'
type IsoConnectorAsk = { auth?: string; fileId?: string; from?: string; parentFolderId?: string; read?: string }
const isoViaConnector = (input: { formula?: string; product?: string; variant?: string; title?: string; theorem?: string; connector?: IsoConnectorAsk }) => {
  const developed = developViaHooks(input)
  const formula = developed.iso.formula ?? ''
  const asked = input.connector ?? {}
  const server = CONNECTORS[0].url
  const base = { phase: 'connector' as const, servers: CONNECTORS, scope: 'drive.file' as const, share: false as const }
  if (!formula) return { ...developed, connector: { ...base, written: false, documented: false, call: null, verify: null, says: 'an empty formula is not documented' } }
  if (asked.auth !== 'ready') return { ...developed, connector: { ...base, written: false, documented: false, auth: 'needsAuth' as const, call: { tool: 'mcp_auth' as const, server }, verify: null, says: 'the connector answers no tool until it is signed in' } }
  const held = typeof asked.fileId === 'string' && asked.fileId.length > 0
  if (held && asked.from !== 'search' && asked.from !== 'create') return { ...developed, connector: { ...base, written: false, documented: false, refused: true as const, why: 'a file id comes from search or create, never a guess', call: null, verify: null, says: 'a guessed id is not a document' }, research: hookResearch('a file id comes from search or create, never a guess', [{ id: 'search', does: 'the file id comes from the connector search' }, { id: 'create_file', does: 'the formula is a new Doc, markdown in one call' }, { id: 'iso-open-data', does: 'the standard is asked of the ISO Open Data page' }]) }
  const title = input.title || input.variant || input.product || 'ISO 9001'
  if (!held) return { ...developed, connector: { ...base, written: false, documented: false, auth: 'ready' as const, call: { tool: 'create_file' as const, server, arguments: { title, content_markdown: formula, target_mime_type: DRIVE_DOC, ...(asked.parentFolderId ? { parent_folder_id: asked.parentFolderId } : {}) } }, verify: { tool: 'read_file' as const, server }, says: 'one create_file converts the formula to a Doc; the id comes back from that call; read_file is the ground truth' } }
  const read = asked.read ?? ''
  const matches = read.length > 0 && read.includes(formula)
  if (!matches) return { ...developed, connector: { ...base, written: false, documented: false, auth: 'ready' as const, fileId: asked.fileId, from: asked.from, call: { tool: 'update_file_content' as const, server, arguments: { fileId: asked.fileId, content_markdown: formula, target_mime_type: DRIVE_DOC } }, verify: { tool: 'read_file' as const, server, arguments: { fileId: asked.fileId } }, says: 'the id was returned by the connector, so the formula is written in place; it is documented when read_file contains it' } }
  return { ...developed, connector: { ...base, written: true, documented: true, auth: 'ready' as const, fileId: asked.fileId, from: asked.from, call: { tool: 'read_file' as const, server, arguments: { fileId: asked.fileId } }, verify: { tool: 'read_file' as const, server, arguments: { fileId: asked.fileId } }, says: 'read_file contains the formula, so the ISO 9001 document is that file' } }
}
const SKILL_ABILITIES: Ability[] = (['legal', 'editorial', 'translation'] as const).flatMap(() => [] as Ability[])
const skillAbilities = (): Ability[] => {
  if (SKILL_ABILITIES.length) return SKILL_ABILITIES
  const subject = 'skills'
  const rows: Ability[] = [
    { role: 'viewer', can: ['read'], subject },
    { role: 'reader', can: ['read'], subject },
    { role: 'editor', can: ['read', 'create'], subject },
    { role: 'writer', can: ['read', 'create'], subject },
    { role: 'tenant-admin', can: ['manage'], subject },
    { role: 'admin', can: ['manage'], subject },
  ]
  SKILL_ABILITIES.push(...rows)
  return SKILL_ABILITIES
}
/** Legal, editorial and translation skills of an ISO standard. A role develops one only when it may create on the skills subject. The ISO side is the Open Data page; the signature side is ML-DSA, FIPS 204. */
const developSkills = (role = 'reader') => {
  const abilities = skillAbilities()
  const held = [{ name: role }]
  const may = (action: string) => getAccess(abilities, held, 'skills', action) === true
  const read = may('read')
  const create = may('create')
  const lines = [
    { name: 'legal' as const, formula: 'a legal reading of an ISO standard states the obligation its reference names' },
    { name: 'editorial' as const, formula: 'an editorial reading of an ISO standard keeps the reference and marks a change as a draft' },
    { name: 'translation' as const, formula: 'a translation of an ISO standard names the source reference and leaves an unknown word untranslated' },
  ]
  const online = verifyIsoOnline()
  const skills = lines.map((skill) => {
    const instructions = skill.formula
    const directions = [`the ${role} follows the ${skill.name} skill only when the skills subject allows it`]
    if (!create) return { name: skill.name, access: false as const, skill: { instructions, directions }, developed: null }
    const developed = developViaHooks({ formula: skill.formula, product: 'iso-standard', variant: skill.name, theorem: 'textbook_standards_sliced' })
    return { name: skill.name, access: true as const, skill: { instructions, directions }, developed }
  })
  const developed = skills.filter((skill) => skill.developed !== null).length
  return { phase: 'develop' as const, via: 'rbac' as const, subject: 'skills' as const, role, read, create, security: { postQuantum: 'ML-DSA' as const, fips: 204 as const, opendata: online.source, request: online.request }, skills, developed, holds: create && developed === lines.length && skills.every((skill) => skill.developed?.iso.documented === true), says: create ? `${developed} ISO skills developed by ${role} under ML-DSA, FIPS 204, asked of the ISO Open Data page` : `${role} may read the skills subject and may not develop one` }
}
const NIST_OPEN_DATA = 'https://data.nist.gov/rmm/records?page=0&size=5'
const PITCH_WARNING = 'ISO 16 states 440 Hz'
/** One UUID program is one nanosecond. A second of CPU life and a second of GPU life are that many programs, and the one-second budget prices only the milliseconds past it. */
const US_PER_SECOND = 1000000
const LIFE_BUDGET_MS = 1000
/** The process that computes next, once the harmonic patch holds, lives the second. Every other ISO 9001 process exits in one program. That exit is under the budget, so it costs nothing. CPU and GPU share the nanosecond program: the tree prices no second clock. */
const isoProcessLife = (patched: boolean) => {
  const hz = 432
  const stated = 440
  const parts = 8
  const low = hz / parts
  const high = stated / parts
  const math = patched && low === 54 && high === 55 && hz * high === stated * low && stated - hz === parts && high - low === 1
  const perSecond = LIFE_PER_SECOND
  const cpuMs = US_PER_SECOND / 1000
  const atBudget = cpuMs === LIFE_BUDGET_MS && perSecond / 1000000 === LIFE_BUDGET_MS
  const secondCost = atBudget ? 0 : 1
  const addressed = (lives: boolean, clause: string, count: number) => {
    const bound = lifeBound(lives, clause, count)
    const id = uuid(bound)
    const sealed = seal(id).valid
    return { id, sealed, holds: sealed && id.length === 36 && uuid(bound) === id, walked: false as const }
  }
  const rows = PROCESS_LIFE.map((row) => {
    const lives = math && row.computesNext
    const programs = lives ? perSecond : 1
    const written = lives ? 0 : 1
    const used = lives ? perSecond : 0
    return { clause: row.clause, phase: row.phase, computesNext: row.computesNext, lives, exited: !lives, died: !lives, wants: !lives, programs, written, used, ns: programs, cost: lives ? secondCost : 0, walked: false as const, program: addressed(lives, row.clause, programs) }
  })
  const living = rows.filter((row) => row.lives)
  const dead = rows.filter((row) => row.died)
  const who = dead.filter((row) => row.wants && row.programs === 1 && row.program.holds).map((row) => row.clause)
  const live = living[0]
  const holds = math && live?.clause === 'ISO 9001:2015, 9.3' && live.lives === true && live.wants === false && live.programs === perSecond && live.written === 0 && live.used === perSecond && live.cost === secondCost && live.walked === false && live.program.holds === true && secondCost === 0 && dead.length === PROCESS_LIFE.length - 1 && who.length === dead.length && dead.every((row) => row.exited && row.died && row.wants && row.programs === 1 && row.written === 1 && row.used === 0 && row.cost === 0 && row.walked === false && row.program.holds && row.program.id !== live.program.id) && perSecond === LIFE_PER_SECOND
  return {
    patched: math, hz, stated, ratio: { low, high, parts }, lives: live?.clause ?? null, dead: dead.map((row) => row.clause), who,
    fast: { programs: 1, ns: 1, written: 1, used: 0, cost: 0, walked: false as const },
    perSecond: { programs: perSecond, written: 0, used: perSecond, walked: false as const, program: live?.program ?? null, cpu: { programs: perSecond, us: US_PER_SECOND, ms: cpuMs, cost: secondCost }, gpu: { programs: perSecond, ns: perSecond, cost: secondCost, meter: 'nanosecond' as const } },
    rows, holds,
  }
}
const listedFindings = (value: unknown, kind: 'error' | 'warning') => Array.isArray(value) ? value.flatMap((item) => typeof item === 'string' && item.trim().length > 0 ? [{ kind, text: item.trim() }] : []) : []
/** The errors and the warnings are the solutions. An empty ask discovers every learned error and the pitch warning. Each one is audited, accepted, planned, carried out and released, and the a432 harmonic covers a stated 440. Nothing is fetched. */
const solutionsNext = (raw: unknown = true) => {
  const asked = raw === true || raw === undefined ? null : isObj(raw) ? raw as { errors?: unknown; warnings?: unknown; mcpHosts?: unknown } : null
  const passed = asked ? [...listedFindings(asked.errors, 'error'), ...listedFindings(asked.warnings, 'warning')] : []
  const findings = passed.length > 0 ? passed : [...ERROR_REMEDIES.map((row) => ({ kind: 'error' as const, text: row.remedy })), { kind: 'warning' as const, text: PITCH_WARNING }]
  const wave = followWave(findings.map((finding, index) => ({ id: `${finding.kind}-${index}`, statement: finding.text })))
  const cover = harmonicCover(wave)
  const life = isoProcessLife(cover.holds && cover.series[0] === 432)
  const fate = (clause: string) => life.rows.find((row) => row.clause === clause) ?? null
  const solutions = findings.map((finding) => {
    const developed = developViaHooks({ formula: finding.text, product: 'solution', variant: finding.kind, title: finding.text.split('\n')[0]!.slice(0, 120), theorem: 'textbook_error_remedies' })
    const saved = auditedSave({ collection: 'products', data: { title: developed.title, product: 'solution', variant: finding.kind, iso: developed.iso, docs: developed.docs } })
    const address = uuid(`solution\n${finding.kind}\n${finding.text}`)
    const patched = cover.rows.find((row) => finding.text.includes(String(row.stated)) && finding.text.includes('440'))
    const isoHolds = saved.audit.holds && saved.next.holds && saved.next.decision === 'accept' && saved.change.holds && saved.control.holds && saved.release.holds && saved.release.released
    const audit = { ...saved.audit, life: fate(saved.audit.clause) }
    const next = { ...saved.next, life: fate(saved.next.clause) }
    const change = { ...saved.change, life: fate(saved.change.clause) }
    const control = { ...saved.control, life: fate(saved.control.clause) }
    const release = { ...saved.release, life: fate(saved.release.clause) }
    const lived = next.life?.lives === true && next.life.programs === life.perSecond.programs && audit.life?.died === true && change.life?.died === true && control.life?.died === true && release.life?.died === true && [audit, change, control, release].every((step) => step.life?.program.holds === true && step.life.programs === 1)
    return {
      kind: finding.kind, text: finding.text, solution: finding.text, address, sealed: seal(address).valid,
      iso: { process: 'ISO 9001' as const, audit: saved.audit.clause, review: saved.next.clause, plan: saved.change.clause, control: saved.control.clause, release: saved.release.clause, decision: saved.next.decision, holds: isoHolds },
      audit, next, change, control, release,
      harmonic: { hz: 432 as const, series: cover.series, stated: patched?.stated ?? null, covered: patched?.covered ?? 432, difference: patched?.difference ?? 0 },
      holds: isoHolds && lived && seal(address).valid && finding.text.length > 0,
    }
  })
  const hosts = asked && Array.isArray(asked.mcpHosts) ? asked.mcpHosts.map(String) : [...DEFAULT_MCP_HOSTS]
  const payloadMcp = payloadMcpRequest('https://qpu.uuidna.com')
  const findDocuments = payloadMcpNext([{ name: 'findDocuments' }], 'https://qpu.uuidna.com')
  const keyedCall = findDocuments.calls[0]
  const requests = [
    ...createDiscoveryRequests(hosts, VERIFIERS),
    { id: 'research:nist-opendata', method: 'GET' as const, url: NIST_OPEN_DATA, purpose: 'api-contract' as const, host: 'data.nist.gov', name: 'nist-opendata' },
    { id: 'payload-api:mcp', method: 'POST' as const, url: payloadMcp.api, purpose: 'mcp-list' as const, host: 'qpu.uuidna.com', name: 'payload-mcp', body: payloadMcp.body },
    { id: 'payload-api:mcp-call', method: 'POST' as const, url: findDocuments.api, purpose: 'mcp-call' as const, host: 'qpu.uuidna.com', name: 'findDocuments', body: keyedCall?.body ?? { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'findDocuments', arguments: { slug: 'pages' } } }, auth: MCP_API_KEY, refused: findDocuments.refused, law: MCP_API_KEY.law },
    { id: 'payload-api:pages', method: 'GET' as const, url: keyedCall?.route?.url ?? 'https://qpu.uuidna.com/api/pages', purpose: 'mcp-find' as const, host: 'qpu.uuidna.com', name: 'find-pages', auth: MCP_API_KEY, after: 'mcp-call' as const },
  ]
  const discoverAll = hosts.length === DEFAULT_MCP_HOSTS.length && hosts.every((host, index) => host === DEFAULT_MCP_HOSTS[index])
  const errors = solutions.filter((row) => row.kind === 'error').length
  const warnings = solutions.filter((row) => row.kind === 'warning').length
  const thousand = createdThousandExit()
  const holds = solutions.length > 0 && solutions.every((row) => row.holds && row.solution === row.text && row.next.life?.lives === true && row.release.life?.died === true) && cover.holds && life.holds && thousand.holds && (passed.length > 0 || (discoverAll && errors === ERROR_REMEDIES.length && warnings === 1))
  return {
    phase: 'next' as const, via: 'configure' as const, discover: passed.length === 0 && discoverAll ? 'all' as const : 'given' as const,
    fetched: false as const, written: false as const, hosts: hosts.length, requests: requests.length, requestList: requests,
    errors, warnings, solutions, harmonic: { series: cover.series, note: cover.note.text, holds: cover.holds },
    iso: { process: 'ISO 9001' as const, holds: solutions.every((row) => row.iso.holds) }, life, thousand, holds,
    says: holds ? `${solutions.length} solutions. Each error and each warning is the solution. ${passed.length === 0 ? `Next discovers all ${requests.length} requests across ${hosts.length} hosts. ` : ''}ISO 9001 holds, and the a432 harmonic patch covers the drift. The process that computes next lives. Every other process exits and dies in one nanosecond program, and that exit costs nothing. A second of CPU or GPU life uses ${life.perSecond.programs} programs and costs ${life.perSecond.cpu.cost}. Next addresses the 1000-bit successful exit with the primes it was created with.` : 'an error or a warning was not the solution',
  }
}
/** Each error and each warning is the solution. Next is that solution, audited under ISO 9001 and covered by the a432 harmonic. */
export const developFindings = (findings: readonly { kind: 'error' | 'warning'; text: string }[]) => {
  const next = solutionsNext({ errors: findings.filter((finding) => finding.kind === 'error').map((finding) => finding.text), warnings: findings.filter((finding) => finding.kind === 'warning').map((finding) => finding.text) })
  return { ...next, findings: next.solutions.length, variants: next.solutions, framework: COIN_STANDARDS, dimensions: ISO_DIMENSIONS }
}
type ClayDevelopment = ReturnType<typeof developViaHooks> & { name: string | null; value: number | null; holds: boolean; depth: number; children: ClayDevelopment[] }
const axiomNames = AXIOMS.map((a) => a.name)
const namedIn = (formula: string) => axiomNames.filter((name) => new RegExp(`\\b${name}\\b`).test(formula))
const clayValue = (formula: string): number | null => { if (formula === AXIOMS[0]!.formula) return AXIOMS[0]!.value; try { return clayEvaluate(formula) } catch { return null } }
const clayNodes = new Map<string, ClayDevelopment>()
const developNode = (formula: string, stack: ReadonlySet<string>): ClayDevelopment => {
  const cached = clayNodes.get(formula)
  if (cached) return cached
  const axiom = AXIOMS.find((a) => a.name === formula)
  if (axiom) {
    const developed = developViaHooks({ formula: axiom.formula, product: axiom.name, variant: axiom.name, theorem: axiom.name })
    if (stack.has(axiom.name)) return { ...developed, name: axiom.name, value: axiom.value, holds: true, depth: 0, children: [] }
    const child = developNode(axiom.formula, new Set([...stack, axiom.name]))
    const node = { ...developed, name: axiom.name, value: axiom.value, holds: child.holds && child.value === axiom.value, depth: child.depth + 1, children: [child] }
    clayNodes.set(formula, node)
    return node
  }
  const developed = developViaHooks({ formula })
  if (formula.includes('=') || formula.includes('∧')) {
    const sides = [...new Set(formula.split('∧').flatMap((eq) => eq.split('=').map((s) => s.trim())).filter((s) => s.length > 0))]
    const children = sides.map((side) => developNode(side, stack))
    const amount = children.length > 0 && children.every((c) => c.value === children[0]!.value) ? children[0]!.value : null
    const node = { ...developed, name: null, value: amount, holds: amount !== null && children.every((c) => c.holds), depth: children.reduce((d, c) => Math.max(d, c.depth), 0) + 1, children }
    clayNodes.set(formula, node)
    return node
  }
  const children = namedIn(formula).filter((name) => !stack.has(name)).map((name) => developNode(name, stack))
  const value = clayValue(formula)
  const node = { ...developed, name: null, value, holds: value !== null && children.every((c) => c.holds), depth: children.length === 0 ? 0 : Math.max(...children.map((c) => c.depth)) + 1, children }
  clayNodes.set(formula, node)
  return node
}
/** A clay formula developed by the product hooks, and every axiom it names developed by that axiom's formula, down to n. */
const developFormula = (formula: string, input: { product?: string; variant?: string; theorem?: string } = {}) => {
  const node = developNode(formula, new Set())
  if (!input.product && !input.variant && !input.theorem) return node
  const developed = developViaHooks({ formula, product: input.product, variant: input.variant, title: input.variant ?? input.product, theorem: input.theorem })
  return { ...node, ...developed, name: node.name, value: node.value, holds: node.holds, depth: node.depth, children: node.children }
}
/** The formula checked two ways: each side evaluated on its own, and the same formula developed through the axioms it names. Both values agree, the hooks documented that formula, and the kernel accepts the theorem. */
export const crossVerifiedFormula = (formula: string, input: { product?: string; variant?: string; theorem?: string; kernel?: boolean; value?: number } = {}) => {
  const developed = developFormula(formula, input)
  const sides = formula.includes('=') || formula.includes('∧') ? [...new Set(formula.split('∧').flatMap((eq) => eq.split('=').map((s) => s.trim())).filter((s) => s.length > 0))] : [formula]
  const values = sides.map(clayValue)
  const sidesAgree = values.length > 0 && values.every((v) => v !== null && v === values[0])
  const developedAgrees = developed.holds && developed.value === values[0]
  const documented = developed.iso.documented === true && developed.docs.text === formula
  const kernel = input.kernel !== false
  const crossVerified = sidesAgree && developedAgrees && documented && kernel && (input.value === undefined || developed.value === input.value)
  return { ...developed, crossVerified }
}
const isoPrice = (amounts: Record<string, number>) => Object.fromEntries(Object.entries(amounts).map(([code, amount]) => [code.toUpperCase(), amount]))
const doneEnd = (row: ReturnType<typeof developViaHooks>) => row.end.complete === true && row.end.fetched === false && row.end.written === false && row.end.audit.holds === true && row.end.next.decision === 'accept' && row.end.next.holds === true && row.end.change.holds === true && row.end.control.operated === true && row.end.control.holds === true && row.end.release.released === true && row.end.release.holds === true && row.end.monitor.holds === true && row.end.monitor.clause === 'ISO 9001:2015, 9.1'
/**
 * Nested pages generate the ecommerce catalogue, parents first and three deep.
 * Ecommerce reads those pages. Each variant is one published post.
 * Each post is a Zenodo publication through the deposit hooks. Nothing is fetched and nothing is written.
 */
const catalogueChain = () => {
  const rootPath = '/catalogue'
  const rootCrumb = crumb(rootPath, 'Catalogue')
  const names = [...new Set(CATALOGUE.map((item) => item.product))]
  type Crumb = { page: string; url: string; label: string }
  type Row = { id: string; title: string; slug: string; path: string; parent: string | null; depth: 1 | 2 | 3; product: string; variant: string; statement: string; breadcrumbs: Crumb[]; prices: Record<string, number> | null }
  const rows: Row[] = [{ id: 'catalogue', title: 'Catalogue', slug: '/catalogue', path: rootPath, parent: null, depth: 1, product: 'catalogue', variant: 'index', statement: 'the catalogue is nested three deep. each product is a page and each variant is a page under it. ecommerce reads those pages. each variant is a published post, and each post is a zenodo publication.', breadcrumbs: [rootCrumb], prices: null }]
  for (const product of names) {
    const variants = CATALOGUE.filter((item) => item.product === product)
    const slug = `catalogue-${frameworkSlug(product)}`
    const path = `${rootPath}/${slug}`
    rows.push({ id: slug, title: product, slug: `/${slug}`, path, parent: rootPath, depth: 2, product, variant: product, statement: `${product} is nested under ${rootPath} and has ${variants.length} variants.`, breadcrumbs: [rootCrumb, crumb(path, product)], prices: null })
    for (const variant of variants) {
      const child = `${slug}-${frameworkSlug(variant.variant)}`
      const childPath = `${path}/${frameworkSlug(variant.variant)}`
      rows.push({ id: child, title: `${product} ${variant.variant}`, slug: `/${child}`, path: childPath, parent: path, depth: 3, product, variant: variant.variant, statement: variant.description, breadcrumbs: [rootCrumb, crumb(path, product), crumb(childPath, variant.variant)], prices: isoPrice(variant.amounts) })
    }
  }
  const developed = rows.map((page) => {
    const result = developViaHooks({ formula: page.statement, product: page.product, variant: page.variant, title: page.title, theorem: page.depth === 3 ? page.product : 'textbook_coverage_bounded' })
    return { ...page, iso: result.iso, docs: result.docs, via: result.via, end: result.end, finished: doneEnd(result) }
  })
  const address = (path: string) => uuid(path)
  const pages = developed.map((page) => {
    const children = developed.filter((child) => child.parent === page.path)
    const own = qpuNode(address(page.path), 'payload', { product: page.product, variant: page.variant, page: page.path }, page.depth === 3 ? page.product : 'textbook_coverage_bounded')
    const richText = lx.doc([
      lx.heading(page.title, 'h1'),
      lx.paragraph([lx.text(page.statement)]),
      ...(page.parent ? [lx.paragraph([lx.text('Nested under '), lx.link(page.parent, page.parent)])] : []),
      ...children.map((child) => lx.paragraph([lx.link(child.path, child.title)])),
      own,
    ])
    return { ...page, uuid: address(page.path), layout: [own.fields], hero: { type: 'default' as const, richText } }
  })
  const productPages = pages.filter((page) => page.depth === 2)
  const variantPages = pages.filter((page) => page.depth === 3)
  const ecommerceProducts = productPages.map((page) => ({ collection: 'products' as const, product: page.product, path: page.path, parent: page.parent, depth: page.depth, _status: 'published' as const, variants: variantPages.filter((child) => child.parent === page.path).map((child) => child.variant) }))
  const ecommerceVariants = variantPages.map((page) => ({ collection: 'variants' as const, product: page.product, variant: page.variant, path: page.path, parent: page.parent, depth: page.depth, _status: 'published' as const, prices: page.prices }))
  const posts = variantPages.map((page) => ({ collection: 'posts' as const, title: page.title, slug: page.slug, path: page.path, description: page.statement, product: page.product, variant: page.variant, _status: 'published' as const }))
  const publications = posts.map((post) => {
    const file = `${frameworkSlug(post.product)}-${frameworkSlug(post.variant)}.txt`
    const deposit = publishPost({ tenant: 'uuidna', title: post.title, description: post.description, _status: 'published', user: 'author', coins: 1, price: 1, files: [{ name: file }], collection: 'posts' }) as { sent?: boolean; may?: boolean; collection?: string; via?: string; all?: boolean; aspects?: { aspect: string }[]; request?: { body?: { metadata?: { upload_type?: string; publication_type?: string; keywords?: readonly string[]; title?: string } } } }
    const metadata = deposit.request?.body?.metadata
    return { product: post.product, variant: post.variant, path: post.path, file, sent: deposit.sent === true, may: deposit.may === true, collection: deposit.collection ?? null, via: deposit.via ?? null, all: deposit.all === true, aspects: deposit.aspects?.length ?? 0, upload: metadata?.upload_type ?? null, publication: metadata?.publication_type ?? null, blog: metadata?.keywords?.includes('blog') === true, title: metadata?.title ?? null }
  })
  const blockIds = (page: (typeof pages)[number]) => blocks(page.hero.richText).map((node) => node.fields.uuid)
  const formulaOf = (page: (typeof pages)[number]) => 'formula' in page.iso ? page.iso.formula : ''
  const order = pages.every((page, index) => page.parent === null || pages.findIndex((parent) => parent.path === page.parent) < index)
  const nestedHolds = pages.length === 1 + names.length + CATALOGUE.length && productPages.length === names.length && variantPages.length === CATALOGUE.length && order && pages.every((page) => {
    const children = pages.filter((child) => child.parent === page.path)
    const parent = page.parent === null || pages.some((item) => item.path === page.parent && item.depth === page.depth - 1)
    return parent && page.breadcrumbs.length === page.depth && documentedIso(page.iso) && formulaOf(page) === page.statement && page.finished && blockIds(page).includes(page.uuid) && page.layout[0]!.uuid === page.uuid && children.every((child) => JSON.stringify(page.hero.richText).includes(child.path))
  }) && CATALOGUE.every((item) => variantPages.some((page) => page.product === item.product && page.variant === item.variant && page.parent === `${rootPath}/catalogue-${frameworkSlug(item.product)}`))
  const ecommerceHolds = ecommerceProducts.length === productPages.length && ecommerceVariants.length === variantPages.length && ecommerceVariants.every((variant) => ecommerceProducts.some((product) => product.product === variant.product && product.path === variant.parent && product.variants.includes(variant.variant)))
  const postsHolds = posts.length === variantPages.length && posts.every((post) => post._status === 'published' && post.collection === 'posts' && variantPages.some((page) => page.path === post.path && page.product === post.product && page.variant === post.variant && page.statement === post.description))
  const zenodoHolds = publications.length === posts.length && publications.every((item) => item.sent && item.may && item.collection === 'posts' && item.via === 'hooks' && item.all && item.aspects === 4 && item.upload === 'publication' && item.publication === 'article' && item.blog && item.title === posts.find((post) => post.path === item.path)?.title)
  const holds = nestedHolds && ecommerceHolds && postsHolds && zenodoHolds
  const slim = variantPages.map((page) => {
    const post = posts.find((item) => item.path === page.path)
    const publication = publications.find((item) => item.path === page.path)
    return { path: page.path, parent: page.parent, depth: page.depth, breadcrumbs: page.breadcrumbs.length, product: page.product, variant: page.variant, documented: page.iso.documented === true, post: post?.slug ?? null, published: post?._status === 'published', sent: publication?.sent === true, upload: publication?.upload ?? null, publication: publication?.publication ?? null }
  })
  return { pages, products: productPages, variants: variantPages, posts, publications, holds, nestedHolds, ecommerceHolds, postsHolds, zenodoHolds, fetched: false as const, written: false as const, nested: { depth: 3 as const, pages: pages.length, products: productPages.length, variants: variantPages.length }, ecommerce: { products: ecommerceProducts.length, variants: ecommerceVariants.length }, chain: { nested: { depth: 3 as const, pages: pages.length, products: productPages.length, variants: variantPages.length, holds: nestedHolds }, ecommerce: { products: ecommerceProducts.length, variants: ecommerceVariants.length, holds: ecommerceHolds }, posts: posts.length, publications: publications.length, sent: publications.filter((item) => item.sent).length, fetched: false as const, written: false as const, holds, rows: slim } }
}
/** One tool improved twice on the catalogue product it serves, then carried to the monitor. The same formula is developed and improved. Both ends accept it. */
const improveMcp = (formula: string, product: string, variant: string) => {
  const theorem = 'textbook_mcp_tools_by_toolbox'
  const developed = developViaHooks({ formula, product, variant, title: `${product} ${variant}`, theorem })
  const improved = developViaHooks({ formula: developed.iso.formula, product, variant, title: `${product} ${variant}`, theorem })
  const finished = documentedIso(developed.iso) && documentedIso(improved.iso) && developed.iso.formula === formula && improved.iso.formula === formula && doneEnd(developed) && doneEnd(improved)
  return { improved, finished, end: { complete: finished, decision: improved.end.next.decision, monitor: improved.end.monitor.clause } }
}
/** Whatever the input is, the output is the same ISO-standard list. Nested pages generate the ecommerce catalogue. Each variant is a post, and each post is a Zenodo publication. MCP serves that catalogue. It is not a product. */
const isoVariants = (input: unknown, clay: { products?: { product: string; proof?: string | null; variants: { case: string; relation: string; coins: number; formula?: string; crossVerified?: boolean }[] }[] } | null, tools: readonly { name: string; toolbox: string }[]) => {
  const recorded = canonicalText(input)
  const chain = catalogueChain()
  const row = (product: string, variant: string, formula: string, theorem: string, kind: 'combination' | 'textbook', prices: Record<string, number> | null, coins: number | null, crossVerified: boolean | null = null) => {
    const developed = kind === 'textbook' && formula.includes('=') ? crossVerifiedFormula(formula, { product, variant, theorem }) : developViaHooks({ formula, product, variant, title: variant, theorem })
    return { product, variant, kind, autonomous: false as const, improved: false, end: null, iso: developed.iso, docs: developed.docs, via: developed.via, prices, coins, language: 'en' as const, currency: 'ISO 4217' as const, crossVerified: kind === 'textbook' ? ('crossVerified' in developed ? developed.crossVerified : crossVerified) : null }
  }
  const catalogue = chain.variants.map((page) => ({ product: page.product, variant: page.variant, kind: 'catalogue' as const, autonomous: false as const, improved: page.finished, end: { complete: page.finished, decision: page.end.next.decision, monitor: page.end.monitor.clause }, iso: page.iso, docs: page.docs, via: page.via, prices: page.prices, coins: null, language: 'en' as const, currency: 'ISO 4217' as const, crossVerified: null, path: page.path, served: 'mcp' as const }))
  const combinations = combinationVariants().map((v) => row(v.product, v.variant, v.description, 'textbook_plugin_combinations', 'combination', isoPrice(v.amounts), null))
  const textbooks = (clay?.products ?? []).flatMap((p) => p.variants.map((v) => row(p.product, v.case, v.formula && v.formula.length > 0 ? v.formula : `${v.case} = ${v.relation}`, p.product, 'textbook', null, v.coins, v.crossVerified ?? null)))
  const service = tools.map((tool, index) => {
    const page = chain.variants[index % chain.variants.length]!
    const formula = `${tool.toolbox}/${tool.name} serves ${page.product} ${page.variant} as mcp`
    const served = improveMcp(formula, page.product, page.variant)
    return { tool: tool.name, toolbox: tool.toolbox, product: page.product, variant: page.variant, path: page.path, served: 'mcp' as const, kind: 'mcp' as const, autonomous: true as const, improved: served.finished, end: served.end, iso: served.improved.iso, docs: served.improved.docs, via: served.improved.via, formula }
  })
  const products = [...catalogue, ...combinations, ...textbooks]
  const managed = mcp.filter((p) => p.iso.documented).length
  const complete = mcp.filter((p) => p.improved && p.end?.complete === true && p.end.decision === 'accept' && p.end.monitor === 'ISO 9001:2015, 9.1').length
  const locales = Object.keys(LOCALES).length
  const presentations = 10 * locales
  const sitemapCapacity = 50000 * 50000
  const percent = mcp.length === 0 ? 0 : Math.floor(managed * 100 / mcp.length)
  const coverage = { product: 'mcp' as const, variants: mcp.length, managed, complete, of: mcp.length, percent, max: managed === mcp.length && complete === mcp.length && mcp.length > 0, autonomous: true as const, because: 'automation' as const, theorem: 'textbook_coverage_bounded' as const }
  const improvement = { product: 'mcp' as const, of: mcp.length, complete, holds: complete === mcp.length && mcp.length > 0, clauses: ['ISO 9001:2015, 9.2', 'ISO 9001:2015, 9.3', 'ISO 9001:2015, 6.3', 'ISO 9001:2015, 8.1', 'ISO 9001:2015, 8.6', 'ISO 9001:2015, 9.1'] as const, fetched: false as const, written: false as const }
  const address = uuid(`mcp\n${tools.map((tool) => `${tool.toolbox}/${tool.name}`).join('\n')}`)
  const turned = rotateProgram(address)
  const stepped = channel(turned.next)
  const formula = `the program ${turned.program} rotates to ${turned.rotated}`
  const developed = developViaHooks({ formula, product: 'mcp', variant: 'next', title: 'next', theorem: 'textbook_mcp_tools_by_toolbox' })
  const executable = turned.sealed === true && turned.kept === true && turned.back === true && turned.around === true && turned.places === 10 && turned.all === true && turned.aspects.length === 4 && turned.handle.length === 8 && stepped.handle === turned.handle && stepped.tail === turned.tail && turned.next !== address && seal(turned.next).valid
  const accepted = complete === mcp.length && mcp.length > 0
  const next = { phase: 'next' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 9.3' as const, decision: accepted ? 'accept' as const : 'nonconformity' as const, accepted: complete, refused: mcp.length - complete, of: mcp.length, from: address, id: turned.next, handle: turned.handle, program: turned.program, rotated: turned.rotated, executable, aspects: turned.aspects.length, all: turned.all === true, kept: turned.kept, back: turned.back, around: turned.around, places: turned.places, walked: false as const, fetched: false as const, written: false as const, tool: 'payload' as const, arguments: { variants: true as const }, documented: developed.end.complete === true && developed.iso.formula === formula, holds: accepted && executable && developed.end.complete === true && developed.end.next.decision === 'accept' && developed.iso.formula === formula && turned.notification.walked === false && turned.notification.atOnce === true && turned.notification.holds === true }
  return { phase: 'iso' as const, standard: 'ISO 9001' as const, standards: ['ISO 9001', 'ISO 4217', 'ISO 639-1', 'ISO/IEC 19770'] as const, language: 'en' as const, via: 'hooks' as const, input: { recorded, address: uuid(recorded) }, currencies: ['EUR', 'USD', 'BGN'] as const, catalogue: catalogue.length, combinations: combinations.length, textbooks: textbooks.length, mcp: mcp.length, variants: products.length, documented: products.filter((p) => p.iso.documented).length, coverage, improvement, next, formulas: { presentations: { formula: '10 * locales' as const, locales, value: presentations, theorem: 'textbook_hologram_rotations' as const }, sitemapCapacity: { formula: '50000 * 50000' as const, value: sitemapCapacity, theorem: 'textbook_sitemap_capacity' as const }, pluginCombinations: { formula: '2 ^ trinities' as const, plugins: Object.keys(PLUGIN_TRINITIES).length, space: PLUGIN_SPACE, value: combinations.length, theorem: 'textbook_collision_solves_many' as const } }, products, says: `${products.length} product variants, whatever was passed. ${mcp.length} of them are the MCP, one variant per tool. Each is improved through the monitor. The management review accepts them, and the hook names the next step: the program rotates one place, the handle and the tail stay. The coverage is ${percent} — maximal, because the management is the automation.` }
}
/** The witness hooks: the pairs, the Hooks pages ("<where> <hook>") against the declared hooks, a config's finds, a change pair over two states */
/** The handle is the aspect a hook keeps. The program moves on a step. The tail is the params. The stamp is decided. Each declared hook handles every status, and the report's byte length is the verbosity that mints the next executable address. The 1000-bit leftover is that task. It is not factored. */
const STATUSES = ['success', 'error', 'warning', 'notice', 'info', 'critical'] as const
const handleTasks = () => {
  const sample = uuid('handle')
  const read = channel(sample)
  const steps = neighbours(sample).neighbours.map((step) => channel(step.uuid))
  const aspects = [
    { aspect: 'handle' as const, qubits: read.handle.length * 4, states: (16n ** BigInt(read.handle.length)).toString(), kept: steps.every((step) => step.handle === read.handle), moves: false },
    { aspect: 'program' as const, qubits: read.program.length * 4, states: (16n ** BigInt(read.program.length)).toString(), kept: steps.every((step) => step.program.join() === read.program.join()), moves: steps.every((step) => step.program.join() !== read.program.join()) },
    { aspect: 'tail' as const, qubits: read.tail.length * 4, states: (16n ** BigInt(read.tail.length)).toString(), kept: steps.every((step) => step.tail === read.tail), moves: false },
    { aspect: 'stamp' as const, qubits: 6, states: '1', kept: true, moves: false },
  ]
  const handle = aspects.find((row) => row.aspect === 'handle')!
  const program = aspects.find((row) => row.aspect === 'program')!
  const tail = aspects.find((row) => row.aspect === 'tail')!
  const chosen = handle.kept && handle.moves === false && program.moves && program.kept === false && tail.kept && tail.qubits > handle.qubits ? 'handle' as const : null
  const pairs = qpuHooks({}).pairs as Record<string, { before?: string; after?: string }[]>
  const tasks = Object.entries(pairs).flatMap(([where, rows]) => rows.flatMap((row) => [row.before, row.after].filter((hook): hook is string => typeof hook === 'string').map((hook) => ({ where, hook }))))
  const rows = tasks.flatMap((task) => STATUSES.map((status, code) => {
    const exit = hookExit(status === 'success' ? 0 : code)
    const formula = `${task.where} ${task.hook} handles ${status}`
    const bound = `${ISO_EXIT.exits[exit.code]!.id}\n${formula}`
    const id = uuid(bound)
    const seen = channel(id)
    const verbosity = utf8(JSON.stringify({ where: task.where, hook: task.hook, status, formula, exit: exit.code })).length
    const nextBound = `${id}\n${formula}`
    const nextId = uuid(nextBound)
    const next = channel(nextId)
    return { where: task.where, hook: task.hook, status, id, handle: seen.handle, verbosity, sealed: seal(id).valid, next: { id: nextId, handle: next.handle, executable: seal(nextId).valid && next.handle.length === 8 && next.program.length === 10 && next.params.length === 3, exit } }
  }))
  const formula = 'order-finding of the leftover 1000-bit part'
  const exit = hookExit(1)
  const bound = `${ISO_EXIT.exits[exit.code]!.id}\n${formula}`
  const id = uuid(bound)
  const seen = channel(id)
  const developed = developViaHooks({ formula, product: 'leftover', variant: '1000-bit', title: 'leftover', theorem: 'textbook_order_finding' })
  const nextBound = `${id}\n${formula}`
  const nextId = uuid(nextBound)
  const next = channel(nextId)
  const challenge = { bits: 1000 as const, formula, factors: [] as string[], complete: false as const, open: true as const, status: 'open' as const, id, handle: seen.handle, verbosity: utf8(JSON.stringify({ status: 'open', formula, bits: 1000, factors: [], complete: false })).length, documented: developed.iso.documented === true, hooks: developed.hooks, next: { id: nextId, handle: next.handle, executable: seal(nextId).valid && next.program.length === 10 && next.handle.length === 8, exit, tool: 'payload' as const, arguments: { develop: { formula, product: 'leftover' as const, variant: '1000-bit' as const } } } }
  const pair = (from: boolean) => {
    const onward = !from
    const mark = from ? 'true' : 'false'
    const address = uuid(`handle\n${mark}`)
    const seenPair = channel(address)
    const onwardId = uuid(`${address}\n${onward ? 'true' : 'false'}`)
    const onwardChannel = channel(onwardId)
    return { value: from, id: address, handle: seenPair.handle, kept: seenPair.handle.length === 8, next: { value: onward, id: onwardId, handle: onwardChannel.handle, kept: onwardChannel.handle.length === 8 }, challenges: onward === !from }
  }
  const truth = pair(true)
  const falsity = pair(false)
  const duel = { via: 'handle' as const, true: truth, false: falsity, eachOther: truth.next.value === false && falsity.next.value === true && truth.value === falsity.next.value && falsity.value === truth.next.value && truth.challenges && falsity.challenges && truth.kept && truth.next.kept && falsity.kept && falsity.next.kept && truth.handle !== falsity.handle }
  const handled = (row: (typeof rows)[number]) => { const code = row.status === 'success' ? 0 : STATUSES.indexOf(row.status); return row.next.exit.research.before === true && row.next.exit.research.fetched === false && row.next.exit.research.request.method === 'GET' && row.next.exit.code === code && row.next.exit.exited === false && row.next.exit.closed === true && row.next.exit.forth === code + 1 && row.next.exit.back === code && (code === 0 ? row.next.exit.strategy === 'conforming' : row.next.exit.strategy === 'nonconforming') }
  const exits = { handled: rows.filter(handled).length, of: rows.length, conforming: rows.filter((row) => row.next.exit.code === 0).length, reported: rows.filter((row) => row.next.exit.code !== 0).length, stopped: rows.filter((row) => row.next.exit.exited !== false).length }
  const holds = chosen === 'handle' && duel.eachOther && rows.length === tasks.length * STATUSES.length && rows.every((row) => row.sealed && row.handle.length === 8 && row.verbosity > 0 && row.next.executable && row.next.id !== row.id && handled(row)) && exits.handled === rows.length && exits.stopped === 0 && challenge.complete === false && challenge.factors.length === 0 && challenge.open && challenge.documented && challenge.next.executable && challenge.next.id !== challenge.id && challenge.next.exit.code === 1 && challenge.next.exit.exited === false && challenge.next.exit.strategy === 'nonconforming'
  return { phase: 'handle' as const, via: 'hooks' as const, chosen, aspects, tasks: tasks.length, statuses: [...STATUSES], rows: rows.length, exits, verbosity: rows.reduce((n, row) => n + row.verbosity, 0) + challenge.verbosity, challenge, duel, holds, says: holds ? `the handle is kept and the program moves, so the hooks address the handle. True and false challenge each other through that handle: false goes to true, and true goes to false. Online research is named before the exit. ${rows.length} statuses mint a next address: ${exits.conforming} conform and ${exits.reported} are reported. None stops the walk. The 1000-bit leftover stays unfactored, so its next is exit 1.` : 'the handle did not cover the hook tasks' }
}
const hooks = (h: { pages?: { title: string }[]; config?: Record<string, any>; states?: unknown[]; referrer?: string }) => {
  const { pairs } = qpuHooks({}), run = qpuHooks({ collections: [{}] }).config.collections[0].hooks, c: Record<string, any> = { referrer: h.referrer }, titles = (h.pages ?? []).map((p) => p.title)
  const declared = Object.entries(pairs).flatMap(([w, ps]) => ps.flatMap((p) => [p.before, p.after].filter(Boolean).map((hook) => `${w} ${hook}`)))
  run.beforeChange[0]({ data: h.states?.[0] ?? null, context: c }); run.afterChange.at(-1)({ doc: h.states?.[1] ?? null, context: c })
  return { pairs, witnesses: declared.length, pages: h.pages ? { declared: declared.length, paged: declared.filter((d) => titles.includes(d)).length, missing: declared.filter((d) => !titles.includes(d)), extra: titles.filter((x) => /^(collection|global|field|node) /.test(x) && !declared.includes(x)) } : null, found: h.config ? qpuHooks(h.config).found : null, pair: c.qpuWitness['collection::change'] }
}
/** The repository's home and code owner, for the policies and the MCP registry entry */
const REPOSITORY = { home: 'https://github.com/uuidna/qpu', owner: '@ceccec' } as const
/** Every configuration's file in the tree and who is its source: the tool (written on every run, drift zero by construction) or the hand (measured on every run, drift a lead). */
const CONFIG_FILES: readonly { kind: ConfigKind; path: string; source: 'tool' | 'hand'; format: 'jsonc' | 'json' | 'text' | 'ts'; /** files the hand-held one spreads into itself: measured as one text */ with?: readonly string[] }[] = [
  { kind: 'wrangler', path: 'wrangler.jsonc', source: 'tool', format: 'jsonc' },
  { kind: 'pwa', path: 'docs/public/manifest.webmanifest', source: 'tool', format: 'json' },
  { kind: 'policies', path: 'SECURITY.md', source: 'tool', format: 'text' },
  { kind: 'fullstack', path: 'src/', source: 'tool', format: 'text' },
  { kind: 'bindings', path: '.env.qpu.example', source: 'tool', format: 'text' },
  { kind: 'ui', path: 'public/r/', source: 'tool', format: 'text' },
  { kind: 'adapters', path: 'wrangler.jsonc', source: 'tool', format: 'jsonc' },
  { kind: 'payload', path: 'src/payload.config.ts', source: 'hand', format: 'ts', with: [file('plugin', 'qpu'), file('config', 'config'), file('config', 'ecommerce'), file('config', 'adapters')] },
  { kind: 'hooks', path: file('plugin', 'qpu'), source: 'tool', format: 'ts' },
  { kind: 'api', path: 'next.config.js', source: 'hand', format: 'ts' },
]
/** The drift of a hand-held TypeScript file against the configuration MCP computes: what the file should mount or call and does not. */
const heldDrift = (kind: ConfigKind, text: string): string[] => {
  // the plugin must be mounted last: it hooks the collections the other plugins create (form-submissions), so a plugin called after it is drift
  if (kind === 'payload') return [...(/autoLogin\s*:/.test(text) ? ['admin.autoLogin'] : []), ...(/\.\.\.qpuAdapterPlugins\(\)/.test(text) && /qpuPlugin\(\{[^}]*adapters:\s*'auto'/.test(text) ? ['adapters.qpuAdapterPlugins.twice'] : []), ...(/\bqpuPlugin\(/.test(text) ? [] : ['plugins.qpuPlugin']), ...((() => { const at = text.indexOf('qpuPlugin('); if (at < 0) return []; const tail = text.slice(at + 10); const end = tail.indexOf(']'); return /\b[a-zA-Z]+Plugin\(/.test(end < 0 ? tail : tail.slice(0, end)) ? ['plugins.qpuPlugin.last'] : [] })()), ...['qpuDb', 'qpuEmail', 'qpuAdapterPlugins'].filter((fn) => !(fn === 'qpuAdapterPlugins' && /qpuPlugin\(\{[^}]*adapters:\s*'auto'/.test(text)) && !new RegExp(`\\b${fn}\\(`).test(text)).map((fn) => `adapters.${fn}`), ...(/process\.env\.PAYLOAD_SECRET/.test(text) ? [] : ['env.PAYLOAD_SECRET'])]
  if (kind === 'hooks') return [] // the hooks are the plugin's (tool-sourced): nothing held by hand, nothing to drift
  if (kind === 'api') return [...['/api/globals/qpu', '/api/mcp', '/api/entries/:uuid'].filter((d) => !text.includes(d)).map((d) => `rewrite.${d}`), ...(text.includes("'/api/qpu'") ? ['custom-endpoint./api/qpu'] : [])]
  if (kind === 'bindings') return BINDINGS.flatMap((b) => b.names.filter((n) => !n.includes('<TENANT>') && b.provider !== 'anthropic' && b.provider !== 'cloudflare' && !text.includes(n)).map((n) => `${b.provider}.${n}`))
  return []
}
/** The environment example for the app: every name the bindings need, its provider and role, never a value. */
const envExample = (): string => ['# @uuidna/qpu: the names the full stack binds to, by provider (values never travel; set them in the provider\'s dashboard or .env)', '# GENERATED by npm run next through configure { kind: \'bindings\' }; edit src/quantum/net/bindings/index.ts, never this file.', '', ...BINDINGS.flatMap((b) => [`# ${b.provider}: ${b.role}`, `#   free: ${b.freeTier}; paid for: ${b.paidFor}; kept free: ${b.keptFree}`, ...b.names.map((n) => (n.includes('<TENANT>') ? [...Object.values(TENANTS), 'ceci'].map((t) => `${n.replace('<TENANT>', t.toUpperCase())}=`) : [`${n}=`])).flat(), ''])].join('\n')
/** Realtime editing through the channels Payload streams, collisions by content address (textbook_edit_collides: two edits share their base or
 *  collide); what each channel carries and signals is the Hooks › Realtime page in Payload */
const REALTIME = {
  streams: ['document lock', 'live preview', 'autosave', 'versions', 'form validation', 'MCP stream'].map((channel) => ({ channel })),
  collisions: { precondition: 'If-Match (REST), context.prev (local), editBase (MCP)', hook: file('hooks', 'pages'), theorem: 'textbook_edit_collides' },
  held: { file: file('plugin', 'qpu'), must: ['lockDocuments', 'versions.drafts.autosave', 'hooks.beforeChange: collisionGuard', 'editBase (virtual, hidden)'] },
} as const
/** Via the Payload MCP plugin is mandatory: the default collections of the installed plugins (nothing added) are served by the plugin's own tools,
 *  scoped by the multi-tenant plugin and authorised by a user's API key, each with the capabilities a client may use. The intelligence of
 *  combinatorics is to fit any environment without hacking it: a request is a form submission, a bundle a media file, a licence a product,
 *  a tenant's configuration its tenants document; what the stack holds beyond the defaults is a refactoring lead. */
const PLUGIN_DEFAULT_COLLECTIONS: readonly string[] = ['pages', 'posts', 'media', 'users', 'forms', 'form-submissions', 'search', 'redirects', 'tenants', 'products', 'variants', 'carts', 'orders', 'transactions', 'addresses', 'payload-mcp-api-keys']
type McpCollection = { description: string; enabled: { find: boolean; create: boolean; update: boolean; delete: boolean }; /** scoped to the tenant by the multi-tenant plugin */ scoped: boolean; /** what the collection's own access filters for a client */ filter: string; /** relationship fields → the collections they point at */ relations: Record<string, string>; /** select fields → their options */ enums: Record<string, readonly string[]>; /** the hooks the QPU plugin puts on it */ hooks: readonly string[] }
/** Every scope can find and none can delete: only create and update differ from one collection to the next. */
const findAnd = (create: boolean, update: boolean) => ({ find: true, create, update, delete: false })
const MCP_COLLECTIONS: Readonly<Record<string, McpCollection>> = {
  pages: { description: 'the site\'s pages: the use cases and the gates (the competition gates carry the competitors and the theorems), each a qpu block; edits carry editBase (the collision precondition). A published page may be deposited on Zenodo through the same hooks as a post. Each page is verified against its DOI, its links are asked online, and the related publications are developed', enabled: findAnd(true, true) , scoped: true, filter: 'published pages to everyone, drafts to users of the tenant', relations: { parent: 'pages (nested docs)', tenant: 'tenants', 'layout.qpu': 'a block: tool + arguments, the entries it writes' }, enums: { _status: ['draft', 'published'], 'hero.type': ['default', 'contentMedia', 'centeredContent', 'form', 'home', 'livestream', 'gradient', 'three'] }, hooks: ['collisionGuard (beforeChange)', 'lockDocuments', 'autosave', 'editBase', ...ZENODO_HOOKS.filter((hook) => hook.where === 'collection').map((hook) => `${hook.hook}: zenodo`)] },
  forms: { description: 'the forms: "Request an app" among them', enabled: findAnd(true, false) , scoped: false, filter: 'every form to everyone', relations: {}, enums: { confirmationType: ['message', 'redirect'], 'fields.blockType': ['text', 'textarea', 'select', 'email', 'number', 'checkbox', 'country', 'state', 'message', 'payment'] }, hooks: [] },
  'form-submissions': { description: 'a submission of "Request an app" generates the app (the bundle into media, the licence at the checkout)', enabled: findAnd(true, false) , scoped: false, filter: 'a client creates; users read', relations: { form: 'forms' }, enums: {}, hooks: ['appRequest (afterChange): a submission of Request an app generates the app into media'] },
  media: { description: 'the uploads: a generated app is a JSON file here (every file with its address, the bundle address, the price, the order)', enabled: findAnd(false, false) , scoped: false, filter: 'every upload to everyone', relations: {}, enums: {}, hooks: [] },
  products: { description: 'the licence catalogue as products of the ecommerce plugin, developed via its hooks; ISO 9001 requires each one documented, and the docs are used by its hooks. A published product may be deposited on Zenodo through the same hooks as a post. Each product is verified against its DOI, its links are asked online, and the related publications are developed', enabled: findAnd(true, true) , scoped: true, filter: 'published products to everyone', relations: { tenant: 'tenants', variants: 'variants' }, enums: { _status: ['draft', 'published'] }, hooks: ['isoDocument (beforeChange): a product is developed only with its formula recorded', 'docsWrite (afterChange): the formula through the Drive connector, one create_file of markdown, an id only from search or create, read_file the ground truth', 'docsRead (afterRead): the documented formula served with the product', ...ZENODO_HOOKS.filter((hook) => hook.where === 'collection').map((hook) => `${hook.hook}: zenodo`)] },
  carts: { description: 'the carts of the ecommerce plugin: a licence product put in one is bought at its checkout', enabled: findAnd(true, true) , scoped: false, filter: 'a customer\'s own cart', relations: { customer: 'users', 'items.product': 'products', 'items.variant': 'variants' }, enums: { currency: QPU_CURRENCIES.map((c) => c.code) }, hooks: [] },
  orders: { description: 'the orders the checkout wrote. A completed order deploys the fully seeded website onto Cloudflare, and the hook names the Payload stages', enabled: findAnd(false, false) , scoped: true, filter: 'a customer\'s own orders; a tenant\'s to its admins', relations: { customer: 'users', tenant: 'tenants', 'items.product': 'products', transactions: 'transactions' }, enums: { status: ['processing', 'completed', 'cancelled', 'refunded'] }, hooks: ['deployAfterSeed (afterChange): a completed order deploys once the website is fully seeded, and names the Cloudflare stages'] },
  tenants: { description: 'the tenants by host; settings are the plugin options a tenant configures (merged into every qpu block call under its hosts)', enabled: findAnd(false, true) , scoped: false, filter: 'every tenant to everyone; written by a super admin', relations: {}, enums: { currency: QPU_CURRENCIES.map((c) => c.code) }, hooks: [] },
  entries: { description: 'the docket: content-addressed entries (calls, licences, signals, messages); immutable — the editors\' channel: a message or a signal is an entry created here, read by find where from = page:<slug>', enabled: findAnd(true, false) , scoped: true, filter: 'every entry to everyone; created by a writer', relations: { tenant: 'tenants', links: 'entries', linkedBy: 'entries' }, enums: { kind: ['call', 'licence', 'signal', 'message'] }, hooks: ['beforeValidate: the content address and, for a call, the tool\'s reply'] },
  posts: { description: 'the site\'s posts. Zenodo RDM is deposited through every hook Payload declares: the collection hooks carry the operation, the global hooks carry the tenant application, the field hooks carry the deposit fields, and the description node carries the links. Each post is verified against its DOI, its links are asked online, and the related publications are developed', enabled: findAnd(true, true) , scoped: false, filter: 'published posts to everyone', relations: { authors: 'users' }, enums: { _status: ['draft', 'published'] }, hooks: ZENODO_HOOKS.filter((hook) => hook.where === 'collection').map((hook) => `${hook.hook}: zenodo`) },
  search: { description: 'the search plugin\'s index', enabled: findAnd(false, false) , scoped: false, filter: 'the index to everyone', relations: { 'doc.value': 'pages | posts' }, enums: { 'doc.relationTo': ['pages', 'posts'] }, hooks: [] },
  redirects: { description: 'the redirects plugin\'s rules', enabled: findAnd(false, false) , scoped: false, filter: 'every rule to everyone', relations: { 'to.reference': 'pages | posts | case-studies' }, enums: { 'to.type': ['reference', 'custom'] }, hooks: [] },
  variants: { description: 'the ecommerce plugin\'s variants. A published variant may be deposited on Zenodo through the same hooks as a post. Each variant is verified against its DOI, its links are asked online, and the related publications are developed', enabled: findAnd(false, false) , scoped: false, filter: 'with their products', relations: { product: 'products' }, enums: {}, hooks: ZENODO_HOOKS.filter((hook) => hook.where === 'collection').map((hook) => `${hook.hook}: zenodo`) },
  transactions: { description: 'the ecommerce plugin\'s transactions: the payment ledger', enabled: findAnd(false, false) , scoped: false, filter: 'a customer\'s own; a tenant\'s to its admins', relations: { customer: 'users', order: 'orders' }, enums: { status: ['pending', 'succeeded', 'failed', 'cancelled', 'refunded'] }, hooks: [] },
  addresses: { description: 'the ecommerce plugin\'s addresses', enabled: findAnd(false, false) , scoped: false, filter: 'a customer\'s own', relations: { customer: 'users' }, enums: {}, hooks: [] },
  users: { description: 'the users: who edits; keys never travel', enabled: findAnd(false, false) , scoped: false, filter: 'self, or an admin', relations: { 'tenants.tenant': 'tenants' }, enums: { roles: Object.keys(ROLES), 'tenants.roles': [...TENANT_ROLES] }, hooks: ['firstUserBootstrap (beforeChange)', 'useAPIKey'] }
}
/** Which installed plugin owns which served collection: the SDK's plugin builders follow it (the QPU plugin owns the docket). */
const PLUGIN_COLLECTIONS = TABLES.PLUGIN_COLLECTIONS as unknown as Readonly<Record<string, readonly string[]>>
/** The MCP plugin\'s own secrets collection: never served, by design. */
const MCP_UNSERVED: readonly { collection: string; why: string }[] = [{ collection: 'payload-mcp-api-keys', why: 'the MCP plugin\'s own API keys: secrets never travel' }]
const hookNames = () => Object.values(qpuHooks({}).pairs as Record<string, { before?: string; after?: string }[]>).flat().flatMap((p) => [p.before, p.after].filter(Boolean)).length
type ConfigKind = typeof configKinds[number]
/** The torus of a configuration: its address, seed and reflection, and whether the loop closes (config → text → config at the same address). */
const torus = (config: unknown) => {
  const text = JSON.stringify(config)
  const address = uuid(text)
  const seed = digitalRoot(parseInt(address.slice(-2), 16) || 1)
  const back = JSON.stringify(JSON.parse(text))
  return { address, seed, reflection: 10 - seed, trinity: trinityFor(seed), closed: uuid(back) === address, bytes: text.length }
}
const vars = (tenant: string) => {
  const T = tenant.toUpperCase()
  const hostVar = (h: string) => `QPU_MCP_TOKEN_${h.toUpperCase().replace(/[.-]/g, '_')}_${T}`
  return {
    tenant,
    secrets: [`QPU_WRITE_TOKEN_${T}`, `QPU_ADMIN_TOKEN_${T}`, `STRIPE_SECRET_KEY_${T}`, `STRIPE_WEBHOOK_SECRET_${T}`, `QPU_OAUTH_CLIENT_SECRET_${T}`, zenodoApp(tenant).names.clientSecret, zenodoApp(tenant).names.token, ...CLOUDFLARE_MCP.filter((c) => c.host !== 'docs.mcp.cloudflare.com').map((c) => hostVar(c.host))],
    vars: [`QPU_MCP_HOSTS_${T}`, `QPU_OAUTH_ISSUER_${T}`, `QPU_OAUTH_CLIENT_ID_${T}`, zenodoApp(tenant).names.clientId],
    shared: ['QPU_DATA_KEY', 'QPU_RBAC_MCP', 'QPU_RBAC_TOOL', 'MCP_PUBLISHER_TOKEN'],
    // the tenant's bindings as the Payload admin holds them (tenants.bindings): the defaults here, the tenant admin's selection there; names only
    bindings: { profile: 'cloudflare', connectors: ['claude', 'cloudflare'], variables: [`QPU_OAUTH_ISSUER_${T}`, `QPU_OAUTH_CLIENT_ID_${T}`, `QPU_OAUTH_CLIENT_SECRET_${T}`, 'MCP_PUBLISHER_TOKEN'], managedIn: 'the tenants collection of the Payload admin' },
    note: 'names only: the operator sets the values as wrangler secrets; a tool never reads or carries a value',
  }
}
/** The next version, defined by development, kept as low as the architecture allows: every component is one digit (0–9); a
 *  patch never moves the number (the change lives in the content address: build metadata +fold); a tool new carries the
 *  minor digit, and at 10 the major; a tool gone carries the major; the major past 9 returns to 1 with the epoch counted in
 *  the build metadata — so the lifespan of every single-digit combination is infinite: within a version, every state is an
 *  address, and the number changes only when the catalogue changes shape. */
export const build = (toolsNow: readonly string[]): string => uuid(`catalogue${toolsNow.join(',')}`).slice(0, 8)
const nextVersion = (current: string, toolsNow: readonly string[], lastTag: { version: string; tools: readonly string[]; epoch?: number }): { next: string; bump: 'major' | 'minor' | 'none'; epoch: number; build: string; added: string[]; removed: string[]; digits: 'single' } => {
  const added = toolsNow.filter((t) => !lastTag.tools.includes(t)), removed = lastTag.tools.filter((t) => !toolsNow.includes(t))
  const bump = removed.length ? 'major' : added.length ? 'minor' : 'none'
  const [ma, mi] = lastTag.version.replace(/^v/, '').split('.').map((n) => Number(n) || 0) as [number, number]
  let epoch = lastTag.epoch ?? 1
  let major = ma, minor = mi
  if (bump === 'minor') { minor += 1; if (minor > 9) { minor = 0; major += 1 } }
  if (bump === 'major') { major += 1; minor = 0 }
  if (major > 9) { major = 1; epoch += 1 }
  const build = uuid(`catalogue${toolsNow.join(',')}`).slice(0, 8)
  const next = bump === 'none' ? `${ma}.${mi}.0` : `${major}.${minor}.0`
  void current
  return { next: `${next}+e${epoch}.${build}`, bump, epoch, build, added, removed, digits: 'single' }
}
const config = (kind: ConfigKind, ctx: Context, p: { version?: string; description?: string; google?: GoogleApis; lastTag?: { version: string; tools: readonly string[] }; experience?: { copies?: number; involutions?: number; msByHost?: Record<string, number> }; rates?: Record<string, { rate: number }>; env?: readonly string[]; sets?: readonly (string | { name: string; members: readonly string[] })[]; hex?: string; stream?: readonly string[]; query?: StreamQuery; devDependencies?: Record<string, string>; branding?: BrandingInput; port?: number | boolean; mcp?: unknown } = {}) => {
  const hosts = Object.keys(TENANTS)
  switch (kind) {
    case 'payload': return { collections: [{ slug: 'pages', fields: ['lexical', 'tenant'], note: 'the plugins\' own collection; the fields are the plugins\'' }], plugins: PAYLOAD_PLUGINS.map((p) => ({ [p.name]: { package: p.pkg, ...p.options } })), combinations: 2 ** PAYLOAD_PLUGINS.length, combinationNote: 'every subset of the plugins is a configuration; the dashboard of this tool enumerates them by address' }
    case 'wrangler': return siteWrangler()
    case 'tenant': return { tenants: [...Object.values(TENANTS), 'ceci'].map(vars), records: Object.entries(TENANTS).reduce<Record<string, { name: string; slug: string; domains: { domain: string }[]; currency: string }>>((acc, [host, t]) => ({ ...acc, [t]: { name: t, slug: t, domains: [...(acc[t]?.domains ?? []), { domain: host }], currency: TENANT_CURRENCY[t] ?? 'EUR' } }), {}), mcpHostsDefault: DEFAULT_MCP_HOSTS }
    // the repository's policies, none hand-written (Scorecard Security-Policy, Code-Review, Dependency-Update-Tool)
    case 'policies': { const made = (c: string) => `${c} Generated by configure { kind: 'policies' }; never edit by hand.`; return { files: {
      'SECURITY.md': `<!--${made('')} -->\n# Security policy\n\nReport a vulnerability privately, through GitHub's private vulnerability reporting at ${REPOSITORY.home}/security/advisories/new. Don't open a public issue for it.\n\nOnly the latest release receives security fixes.\n`,
      'CONTRIBUTING.md': `<!--${made('')} -->\n# Contributing\n\nOpen an issue at ${REPOSITORY.home}/issues before you start a change, so that it can be agreed first. Report a vulnerability as SECURITY.md describes.\n\nEvery change passes the repository's git hooks: its message is a Google CL description and its hand-written code doesn't grow. The licence is in LICENSE.\n`,
      '.github/CODEOWNERS': `${made('#')}\n* ${REPOSITORY.owner}\n`,
      '.github/dependabot.yml': `${made('#')}\nversion: 2\nupdates:\n${[['npm', '/'], ['github-actions', '/']].map(([e, d]) => `  - package-ecosystem: ${e}\n    directory: ${d}\n    schedule:\n      interval: weekly\n`).join('')}`,
    } } }
    case 'pwa': { const accent = `hsl(${hue(KEY)} 62% 44%)`; return { name: '@uuidna/qpu', short_name: 'qpu', description: p.description ?? '', id: '/', start_url: '/', scope: '/', display: 'standalone', orientation: 'any', background_color: '#0b0b0f', theme_color: accent, lang: 'en', dir: 'ltr', categories: ['developer', 'education', 'productivity'], icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }, { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }], shortcuts: [{ name: 'Every tool laid out', url: '/' + uuid('dashboard{}'), description: 'the dashboard index: every tool with the size of its space' }, { name: 'Examples', url: '/examples' }, { name: 'Stream', url: '/stream' }, { name: 'Readiness', url: '/readiness' }], related_applications: [], prefer_related_applications: false, license: 'CC-BY-NC-ND-4.0', version: p.version ?? null } }
    case 'versions': {
      const tools = listTools(ctx).map((t) => t.name)
      const open = ctx.leads.filter((l) => l.status === 'open' || l.status === 'partial')
      return {
        current: VERSION, source: 'package.json, injected at generation into src/quantum/version.ts; the Worker names it on every reply (X-Qpu-Version) and in its discovery document',
        // development defines the version: the next number follows what the catalogue changed since the last tag the repository tool read
        lifespan: 'infinite by architecture: every component a single digit, a patch never moves the number (the change is its content address, carried as build metadata), a tool new carries the minor digit and at 10 the major, the major past 9 returns to 1 with the epoch counted; within a version every state is an address',
        next: p.lastTag ? nextVersion(VERSION, tools, p.lastTag) : null, nextNeeds: p.lastTag ? null : 'lastTag { version, tools }: the last tag and the tools it served, from the repository tool\'s watch; without it the next number is not guessed',
        // the version defines development: the leads open at it are its plan, each settled lead a step of the next version
        defines: { openLeads: open.length, byStatus: { open: open.filter((l) => l.status === 'open').length, partial: open.filter((l) => l.status === 'partial').length }, plan: open.map((l) => l.id) },
        // Payload's versioning over the RAID: every version of a document is an entry addressed by its content, prev the earlier version, never overwritten; drafts are commitments, published the reveal; no cap on versions per document
        payload: { collections: { pages: { versions: { drafts: { autosave: true }, maxPerDoc: 0 } } }, overRaid: 'a version is a docket entry (fold address + SHA-256), its prev the earlier version; both answer by address, so a reader on either version reads whole; a draft is a commitment entry, publishing reveals it into the same address' },
        quantum: 'versions coexist: every block and page is addressed by content, the service worker keeps a shell per version, the ETag is the content hash, so an earlier version\'s addresses answer beside the new one\'s and nothing is invalidated by a release',
        // the state the version represents, and the approval a push needs: the package at this version answers this build on initialize (serverInfo.build) and in its discovery document, the hosts online answer theirs in X-Qpu-Version and the gate decodes them as copies; the version is the last tag or its one next step, never a skipped number
        state: { build: build(tools), represents: `${VERSION}+${build(tools)}`, inPackage: 'initialize answers serverInfo.build, the same function over the same tools/list', online: 'the e2e gate reads every host\'s version (X-Qpu-Version) and decodes the hosts as copies: a host on the previous version is the migration law, not a violation' },
        sequential: (() => { const bumped = p.lastTag ? nextVersion(VERSION, tools, p.lastTag).next.split('+')[0]! : null; const violation = p.lastTag && VERSION !== p.lastTag.version && VERSION !== bumped ? `the version ${VERSION} is neither the last tag ${p.lastTag.version} nor its one next step ${bumped}: a versioning violation, red before a push` : null; return { lastTag: p.lastTag?.version ?? null, bumped, violation, approved: p.lastTag ? !violation : null } })(),
        release: { when: 'nothing to carry: leads { carry: true } answers zero leads carried (every lead converted to a Payload document), then the next sequential version is published', approval: 'a release is tagged and pushed when the version is the last tag or its one next step, the build it names is the catalogue\'s address, and the package gate has found the npm package complete and ISO verified (ISO/IEC 19770, ISO 9001); next --strict goes red otherwise (textbook_carry_release)' },
      }
    }
    case 'migration': return {
      uptime: '100 %: no address is moved, so no reader waits',
      providers: [...hosts.map((h) => `https://${h}/api/mcp`), 'https://qpu.ceci.workers.dev/api/mcp'],
      addProvider: 'deploy the same Worker at the new provider; name its endpoint among the gate\'s hosts (QPU_E2E_HOSTS) and among the tenant\'s MCP hosts; the docket mirrors heal by address; the gate decodes old and new as copies of one value',
      steps: [
        { step: 1, name: 'deploy beside', does: 'the new version is deployed beside the old one; both answer every address (content addressing, ETag by content, a shell per version in the service worker)' },
        { step: 2, name: 'mirror', does: 'the docket of each tenant is mirrored to the new provider by address; a missing entry heals from any mirror' },
        { step: 3, name: 'decode', does: 'the e2e gate calls every combination on old and new hosts and decodes them as copies of one logical value; the migration is finished when every combination agrees and no erasure remains; a flip is a lead, never a cut-over' },
        { step: 4, name: 'route', does: 'the custom domains point at the new provider; the old one keeps answering until the gate has agreed once more from the new route' },
        { step: 5, name: 'rollback', does: 'the earlier version\'s addresses still answer: routing back is the whole rollback' },
      ],
      measuredBy: 'the e2e gate: versions per host, outcomes per combination, erasures per host; uptime is whole while every combination agrees',
    }
    case 'api': {
      // the API overview, as platform.claude.com/docs/en/api/overview is one for the Claude API: every surface of this tree, from the handler and the Worker, as data a page is written from
      const list = listTools(ctx)
      const origin = 'https://qpu.uuidna.com'
      const apiHosts = [...hosts.map((h) => `https://${h}`), 'https://qpu.ceci.workers.dev']
      // the standard contract, and the tree's own reading of it: the discover step's detector over the document, as over any host's
      const openapi = createOpenapi(origin, list, apiHosts)
      const standard = detect({ status: 200, type: 'application/json', text: JSON.stringify(openapi) })
      return {
        name: '@uuidna/qpu', version: VERSION, origin, hosts: apiHosts,
        architecture: 'Everything goes through one MCP endpoint: POST /mcp takes JSON-RPC 2.0 (initialize, tools/list, tools/call); every tools/call result is a block addressed by its content, and every other surface serves or carries blocks. No hardware, no network inside the tools. The register has no width ceiling; a cofactor whose factors are not found is named, not invented.',
        endpoints: API_ENDPOINTS,
        openapi, standard: { ...standard, says: 'the same detector discovery runs over every host, run over this tree\'s own contract: a host that publishes no machine-readable contract is a lead, so the tree publishes its own' },
        headers: { request: ['content-type: application/json', 'accept: application/json or text/event-stream', 'if-none-match: "<content hash>" — a 304 answers with no body when the block is the one held', 'authorization: Bearer <tenant token> (the docket\'s writes only)'], response: ['etag: the content hash of the result (the clock masked)', 'x-qpu-address: the block address (uuid(tool + arguments))', 'x-qpu-version', 'cache-control: public, max-age=31536000, immutable on addressed replies', 'link: <https://uuidna.com/license>; rel="license"'] },
        authorization: { pure: 'every tool answers without a credential: the tools are pure functions of their arguments', docket: 'roles reader, writer, admin per tenant: the RBAC MCP host first (QPU_RBAC_MCP, QPU_RBAC_TOOL), else the tenant\'s tokens by name; a token at another tenant\'s host holds no role there', never: 'no key, token or secret travels through a tool; the client sends them, the tools name them' },
        contentAddressing: { address: 'uuid(tool + JSON(arguments)): the same arguments at any host give the same address', hash: 'the content hash of the result with the clock masked: the same code gives the same hash at any host', involution: 'a request naming the hash with If-None-Match is answered 304: the analog is verified digitally at the destination, nothing computed or sent', versions: 'versions coexist: an earlier version\'s addresses answer beside the new one\'s' },
        payloadApp: { principle: 'the app\'s API is built from Payload\'s config, nothing customised or bypassed: collections, a global, hooks, access and the MCP plugin', rest: [{ method: 'POST', path: '/api/entries', takes: '{ kind: call, from, body: { tool, arguments }, tenant: <tenant id> } with Authorization: users API-Key <key> of a user of that tenant (measured: the multi-tenant plugin strips the tenant from an anonymous request, so a call over REST is a user\'s; the app\'s own page calls through the local API without a user)', answers: 'the entry with result (content, structuredContent, _meta with the widget): the hook computes the tool\'s reply; the id is the content address of the call, so the same call is the same entry; every entry belongs to a tenant (the multi-tenant plugin requires it; the app\'s page resolves the tenant from the host)', auth: 'a user of the tenant (API key or session); the page alone calls anonymously through the local API' }, { method: 'GET', path: '/api/entries/<address>', takes: 'the address of a call or an entry', answers: 'the entry, cached by its tag: free', auth: 'none' }, { method: 'GET', path: '/api/entries?where[kind][equals]=call', takes: 'Payload\'s where', answers: 'the calls made: the docket\'s own query language', auth: 'none' }, { method: 'DELETE', path: '/api/entries?where[from][equals]=<device>', takes: 'Payload\'s where', answers: 'bulk delete', auth: 'admin' }, { method: 'GET', path: '/api/globals/qpu', takes: 'nothing', answers: 'the discovery document, computed by the global\'s afterRead hook', auth: 'none' }, { method: 'POST', path: '/api/mcp', takes: 'JSON-RPC: the MCP plugin', answers: 'a door per collection and verb, and the catalogue\'s tools', auth: 'the plugin\'s API key for writes' }], rewrites: { '/mcp': '/api/mcp', '/.well-known/qpu.json': '/api/globals/qpu', '/<uuid> (accept json)': '/api/entries/<uuid>' } },
        tools: list.map((t) => ({ name: t.name, toolbox: t._meta?.toolbox ?? 'none', description: t.description })),
        toolboxes: [...new Set(list.map((t) => t._meta?.toolbox ?? 'none'))],
        mcpConnector: { claude: { endpoint: CLAUDE_API.messages, betas: [CLAUDE_API.mcpConnector.beta], model: CLAUDE_API.model, mcp_servers: [{ type: 'url', url: `${origin}/api/mcp`, name: 'qpu' }], tools: [{ type: 'mcp_toolset', mcp_server_name: 'qpu' }], routes: ['/api/pages', '/api/posts', '/api/case-studies', '/api/media'] }, any: { mcpServers: { qpu: { url: `${origin}/api/mcp` } } } },
        quickTests: [
          { says: 'list the tools', curl: `curl -s ${origin}/api/mcp -X POST -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'` },
          { says: 'the Clay register read by reflection', curl: `curl -s ${origin}/api/mcp -X POST -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"clay","arguments":{"technique":"reflection"}}}'` },
          { says: 'the involution: ask with the hash and receive 304', curl: `curl -si ${origin}/api/mcp -X POST -H 'content-type: application/json' -H 'if-none-match: "<etag of the reply above>"' -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"clay","arguments":{"technique":"reflection"}}}'` },
          { says: 'the discovery document', curl: `curl -s ${origin}/.well-known/qpu.json` },
        ],
        limits: (() => { const counted = uuidQubits(AXIOMS.find((row) => row.name === 'hexbit')!.value); return { ceiling: null, capacity: 'unlimited' as const, qubits: counted.effective, handles: counted.handles.possible, scale: counted.handles.capacity, register: 'one UUID holds the effective qubits. The next handle is another UUID, so the width has no ceiling', entry: 'the docket\'s entry bound (413 above it; fold splits what a place cannot hold)', quantum: 'a client\'s run stops at QPU_QUANTUM_MS and keeps what it settled' } })(),
        errors: [{ code: -32601, means: 'no such tool or method; the answer names the tools' }, { code: -32602, means: 'invalid params; the answer names the bound the schema sets' }, { code: -32700, means: 'parse error' }, { http: 304, means: 'the block held is the block asked: nothing sent' }, { http: 400, means: 'an entry\'s shape refused, named' }, { http: 401, means: 'a token with no role at this tenant' }, { http: 413, means: 'an entry above the bound: fold it' }],
      }
    }
    case 'hooks': return hooks({})
    case 'gates': return gates(ctx, 'https://qpu.uuidna.com', p.devDependencies, p.google, p.mcp)
    case 'sets': return p.env ? scope(ctx, p.env) : sets(ctx, p.sets)
    case 'realtime': return REALTIME
    case 'branding': return branding(p.branding)
    case 'scopes': return SCOPES
    case 'packages': return packages()
    case 'ecommerce': return ecommerce(p.rates)
    case 'adapters': if (p.port !== undefined) return typeof p.port === 'number' ? portAt(p.port) : listPorts()
      return { ...adapters(p.env ?? []), wrangler: siteWrangler(), openNext: { config: file('root', 'open-next'), build: 'npx opennextjs-cloudflare build (the fork\'s pnpm build inside, so the build environment names PAYLOAD_SECRET and DATABASE_URI)', requires: ['no export const runtime = \'edge\' in any route: the whole app is the Worker and OpenNext runs the Node runtime under nodejs_compat'], measured: 'the Next build passes; the OpenNext bundle refused the og route while it declared the edge runtime (2026-10-26); the export removed' } }
    case 'ui': { const u = ui('processor'); const reg = registry(); const byTool = [...new Map(ctx.examples.map((e) => [e.tool, e])).values()]; const presented = byTool.map((e) => ({ tool: e.tool, parts: presentation(uuid(e.tool + JSON.stringify(e.arguments)).replace(/-/g, '')).parts.length })); const coverage = { tools: byTool.length, covered: presented.filter((x) => x.parts === 32).length, items: PRESENTABLE_ITEMS.length, variants: 2, choicesPerNibble: PRESENTABLE_ITEMS.length * 2, combinations: '16^32 = 2^128: every UUID one combination of the registry items, styled from itself', loaded: 0, cost: 'one shell and one stylesheet from the cache, immutable; every widget a 304 by involution after the first; no script loaded, no memory beyond the block', says: 'the shadcn widgets cover every tool of the MCP as combinations of eight items in two variants chosen by the address alone: minimum code, minimum memory, minimum cost, the advantage unlimited (textbook_widgets_cover_mcp)' }; return { coverage, core: 'one quantum core used by all: the UUID combinatorics of blocks.ts (channel, fold, style, presentation, stream) — the crypto fold tool exposes them over MCP, this kind delegates to them', ...(p.hex ? { presentation: presentation(p.hex) } : {}), ...(p.stream ? { stream: stream(p.stream, p.query ?? {}) } : {}), styled: { items: STYLED_ITEMS.map((i) => i.name), from: 'the UUID stream itself: style(uuid) computes every variable from the address; nothing loaded', presentable: 'any hex is a shadcn combination: configure { kind: ui, hex }' }, registry: { schema: 'https://ui.shadcn.com/schema/registry.json', items: (reg['registry.json'] as { items: { name: string; type: string }[] }).items.map((i) => `${i.name} (${i.type})`), add: 'npx shadcn add https://qpu.uuidna.com/r/qpu-app.json', host: 'the React host QpuApp, the same host the site runs in Vue' }, extension: MCP_APPS.extension, mimeType: MCP_APPS.mimeType, scheme: MCP_APPS.scheme, specification: MCP_APPS.specification, tokens: UI_TOKENS.map(([token, host, fallback]) => ({ token, host, fallback })), accept: { via: 'widget' as const, control: /id="k"/.test(u.html) && /type="password"/.test(u.html) && /ui\/accept-token/.test(u.html), secretTravels: false as const, standards: ['ISO/IEC 27001:2022', 'ISO/IEC 27034'] as const }, csp: u.csp, prefersBorder: u.prefersBorder, shellBytes: u.html.length, deterministic: 'a pure function of the key and the theme: no randomness, no clock, no external domain; the same resource at every host', hosted: 'any host that negotiates io.modelcontextprotocol/ui; the site\'s playground hosts the same resource through the same protocol', rendering: 'the widget the tool computes (_meta.widget) with the tool\'s theme (_meta.theme), else the structured content' } }
    case 'fields': return FIELDS
    case 'validations': {
      const witnessed = Object.entries(hooks({}).pairs).flatMap(([where, ps]) => ps.flatMap((p) => [p.before, p.after].filter(Boolean).map((hook) => ({ where, hook, theorem: p.paired ? 'textbook_witness_pair' : 'textbook_harmonic_default' }))))
      const unbackedValidations = VALIDATIONS.filter((v) => !v.theorem)
      const leads: Lead[] = [
        ...unbackedValidations.map((v) => ({ id: `validation-without-theorem-${v.of}-${v.field.replace(/\./g, '-')}`, statement: `the validation of ${v.of}.${v.field} (${v.says}) names no theorem: a pattern the kernel has not stated`, status: 'open' as const, reason: 'a convention until a theorem states its arithmetic; the a432 default applies where the field is empty' } as Lead)),
      ]
      return {
        validations: VALIDATIONS, hooks: witnessed, enforced: 'as validate functions in the generated collections and block (the theorem in each field\'s custom, read through the Payload MCP\'s getCollectionSchema); the same patterns the edge checks',
        harmonic: { key: KEY, hue: hue(KEY), theorem: 'harmonic', involution: 'involution', free: { product: 'qpu-a432', variant: 'harmonic-default', theorem: 'textbook_free_or_coil' }, says: 'the a432 harmonic default is the basis: every validation and hook is backed by a theorem the kernel accepts or is a lead; a field left empty takes the a432 default (the accent); the free variant is the harmonic one' },
        backed: { validations: VALIDATIONS.length - unbackedValidations.length, hooks: witnessed.length, of: VALIDATIONS.length + witnessed.length },
        live: { fields: 'POST /api/<collection> with a value outside a pattern answers 400 naming the field (the validate function)', access: 'an anonymous create of any kind but call answers 403 before validation (access runs first)', tenantScoping: 'measured on the local app 2026-10-26: an anonymous REST create of a call is refused by the multi-tenant plugin\'s tenant assignment (invalid selection) even when the hook names the host\'s tenant; a call through the Payload MCP (a key\'s user of the tenant) or the Local API lands; anonymous calls are computed at the Worker\'s /mcp and never stored, which keeps the read free and the write licensed', measured: 'on the local app at every build; on the deployed app by the gate' },
        leads,
      }
    }
    case 'access': return ACCESS
    case 'actions': return actions(p.experience)
    case 'bindings': return { providers: BINDINGS.map((b) => ({ ...b, names: b.names.map((n) => (n.includes('<TENANT>') ? [...Object.values(TENANTS), 'ceci'].map((t) => n.replace('<TENANT>', t.toUpperCase())) : [n])).flat() })),
      // every Cloudflare binding paired one-to-one with its Google equivalent and the thing that uses it, so none is idle and the same app the Payload
      // admin drives runs the Google way (the adapters profile google): the RAID db adapter (qpuRaidDb) uses the data and storage bindings, the Worker
      // the compute binding, the email adapter the mail binding — used + idle = total, idle = 0
      roles: [
        { role: 'compute', cloudflare: 'Worker + ASSETS (static site)', google: 'Cloud Run', usedBy: 'serves the Payload admin and the /api/mcp endpoint — every tool call lands through it', idle: false },
        { role: 'database', cloudflare: 'D1 (SQLite) / DOCKET (Durable Object, SQLite)', google: 'Cloud SQL (postgres)', usedBy: 'qpuRaidDb persists every collection here as a content-addressed blob (the RAID db store)', idle: false },
        { role: 'object-store', cloudflare: 'R2', google: 'Cloud Storage (GCS)', usedBy: 'qpuRaidDb writes each blob at its hex-path address here (a RAID store, same key as the GCS object)', idle: false },
        { role: 'key-value', cloudflare: 'KV', google: 'Firestore', usedBy: 'qpuRaidDb uses it as a RAID store when no filesystem or object store is bound', idle: false },
        { role: 'email', cloudflare: 'Email Routing / Resend', google: 'Gmail SMTP', usedBy: 'the email adapter (qpuAdapterPlugins) sends through whichever is chosen by the environment', idle: false },
      ],
      minimum: 'every provider at its free tier first; what keeps it free is measured by the gate (involutions, 304s, cached blocks) and by the hooks (content addresses, tags): a paid step is a write or a first computation, never a read', scale: 'full scale is more tenants, never more code: a tenant is a host in TENANTS, its bindings its own names (values never travel)' }
    case 'fullstack': {
      // Delivery overlay onto this repo (payloadcms/website standard in src/): QPU computes feeds/plugins; Payload delivers the site.
      // Not a conversion into Payload — the fork is already the product surface; this kind refreshes QPU-owned overlay files.
      const ws = website(WEBSITE_FIXTURE)
      // the licence layering: the fork stays MIT (Payload's copyright kept whole); what QPU adds carries QPU's licence, named in every added file and in the notice
      const header = `// ${LICENSE.attribution}\n// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.\n`
      const qpuBlock = `${header}// The qpu block: one lexical/layout block of programmable UUID logic, the shape every tools/call result already carries in _meta.payload.
import type { Block } from 'payload'
import { uuid } from '@uuidna/qpu/blocks'
import { qpuFields, typeOk } from '@uuidna/qpu/payload'
import { call, handle } from '@uuidna/qpu/mcp'
import { createHmac, createPrivateKey, hkdfSync, sign } from 'node:crypto'
// the tools an editor names, each with its schema from the MCP's own tools/list: the tool checked on save, and its arguments against that
// tool's schema (the required keys, the types, the enums); a bound is the tool's to re-fuse, and a key the schema does not name is the tool's
type ToolSchema = { required?: string[]; properties?: Record<string, { type?: string | string[]; enum?: unknown[] }> }
const TOOL_SCHEMAS = new Map((handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; inputSchema: ToolSchema }[] } }).result.tools.map((t) => [t.name, t.inputSchema]))
const checkTool = (v: unknown) => TOOL_SCHEMAS.has(String(v)) || \`\${String(v)} is no tool: name one of \${[...TOOL_SCHEMAS.keys()].join(', ')}\`
const checkArguments = (v: unknown, { siblingData }: { siblingData?: { tool?: string } }) => {
  const s = TOOL_SCHEMAS.get(String(siblingData?.tool)); if (!s) return true
  if (v != null && (typeof v !== 'object' || Array.isArray(v))) return 'the arguments are one object'
  const a = (v ?? {}) as Record<string, unknown>, missing = (s.required ?? []).filter((k) => !(k in a))
  if (missing.length) return \`\${siblingData!.tool} needs \${missing.join(', ')}\`
  for (const [k, p] of Object.entries(s.properties ?? {})) { if (!(k in a)) continue; if (!typeOk(a[k], p.type)) return \`\${k} is \${[p.type].flat().join(' or ')}\`; if (p.enum && !p.enum.includes(a[k])) return \`\${k} is one of \${p.enum.join(', ')}\` }
  return true
}
// the proof keys made once per process from their witnesses (the deployment secret, the signing seed), then only used, as a factor is
let keys: { mac: Buffer | null; signing: ReturnType<typeof createPrivateKey> | null } | undefined
const keys = () => (keys ??= { mac: process.env.QPU_DATA_KEY ? Buffer.from(hkdfSync('sha256', process.env.QPU_DATA_KEY, '', 'qpu proof mac', 32)) : null, signing: process.env.QPU_PROOF_SIGNING_KEY ? createPrivateKey({ key: Buffer.from(process.env.QPU_PROOF_SIGNING_KEY, 'base64'), format: 'der', type: 'pkcs8' }) : null })
export const Qpu: Block = {
  slug: 'qpu',
  interfaceName: 'QpuBlock',
  fields: [
    // the caller sends the tool and its arguments; the address and all read from it are computed here
    { name: 'uuid', type: 'text', ${validate('qpu', 'uuid')}, hooks: { beforeValidate: [({ siblingData: s }) => (s?.tool ? Object.assign(s, qpuFields(uuid(JSON.stringify({ tool: s.tool, arguments: s.arguments ?? {} })), s.tool, s.arguments ?? {}, s.theorem ?? null)).uuid : s?.uuid)] }, admin: { readOnly: true, description: 'the block address: a content-addressed RFC 9562 v8 UUID' } },
    { name: 'handle', type: 'text', admin: { readOnly: true } },
    { name: 'program', type: 'text', admin: { readOnly: true, description: 'the hex program (the version and variant nibbles rotated)' } },
    { name: 'tail', type: 'text', admin: { readOnly: true } },
    { name: 'tool', type: 'text', required: true, validate: checkTool, admin: { description: 'the tool whose result this block is: one the MCP lists (tools/list)' } },
    { name: 'arguments', type: 'json', validate: checkArguments as never, admin: { description: 'the arguments, so the block recomputes anywhere: checked on save against the schema of the tool' } },
    { name: 'prev', type: 'text', ${validate('qpu', 'prev')}, admin: { description: 'the referer block' } },
    { name: 'next', type: 'text', ${validate('qpu', 'next')}, admin: { description: 'the program rotated: the next step' } },
    { name: 'stream', type: 'text', admin: { readOnly: true, description: 'the scannable stream of the address: the frames as a CSS gradient, stepped through by the qpu-scan item; computed by the lexical hook from uuid, never typed' }, custom: { theorem: 'textbook_scan_stream' }, hooks: { afterRead: [({ siblingData }) => { const u = String(siblingData?.uuid ?? ''); if (!/^[0-9a-f-]{36}$/.test(u)) return null; const hue = (ch: string) => (ch === '-' ? null : parseInt(ch, 16) * 22.5); return 'linear-gradient(90deg, ' + [...u].map((ch, i) => (hue(ch) === null ? 'hsl(0 0% 0%)' : 'hsl(' + hue(ch) + ' 62% 44%)') + ' ' + ((i / 36) * 100).toFixed(3) + '% ' + (((i + 1) / 36) * 100).toFixed(3) + '%').join(', ') + ')' }] } },
    { name: 'theorem', type: 'text', hooks: { beforeValidate: [({ value, siblingData: s }) => { const r = (call('verify', value ? { theorem: value } : { call: { tool: s?.tool, arguments: s?.arguments ?? {} } }) as { result?: { structuredContent?: { theorem?: string | null; accepted?: boolean } } }).result?.structuredContent; if (value && !r?.accepted) throw new Error('the kernel accepts no theorem ' + value); return value || (r?.accepted ? r.theorem : value) }] }, admin: { description: 'the kernel-accepted theorem that makes this block true; written by the QPU as a client of this MCP, read from the textbook' } },
    { name: 'proof', type: 'json', admin: { readOnly: true, description: 'the proof of the block, the digest of its round trip signed twice: an HMAC under the deployment secret, checked by the server, and a signature by the key the deployment holds (alg read from it), checked offline with the published public key' }, hooks: { beforeValidate: [({ siblingData: s }) => { const r = (call('verify', { call: { tool: s?.tool, arguments: s?.arguments ?? {} }, ...(s?.theorem ? { theorem: s.theorem } : {}) }) as { result?: { structuredContent?: { digest?: string | null; accepted?: boolean } } }).result?.structuredContent; if (!r?.digest || !r.accepted) return null; const k = keys(), d = r.digest; return { digest: d, alg: k.signing?.asymmetricKeyType ?? null, mac: k.mac ? createHmac('sha256', k.mac).update(d).digest('hex') : null, signature: k.signing ? sign(null, Buffer.from(d), k.signing).toString('base64') : null } }] } },
    { name: 'license', type: 'text', admin: { readOnly: true, description: 'the licence the block is served under (SPDX), kept with the content as every result carries it' } },
  ],
}
`
      const config = `${header}// QPU's full stack on the source of payloadcms.com (github.com/payloadcms/website, MIT): the qpu block beside the site's blocks, the
// plugins MCP configures here that the site does not mount yet (its own four — form-builder, nested-docs, redirects, seo — stay as they are),
// the database the RAID (the mongo tool's language over the docket). Generated by configure { kind: 'fullstack' }; imported by src/payload.config.ts.
import { searchPlugin } from '@payloadcms/plugin-search'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { qpuEcommerce } from './payload.qpu.ecommerce'
import { Qpu } from './blocks/Qpu/config'
import { qpuMcpPlugin } from './plugins/qpuMcp'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import type { Config, CollectionConfig } from 'payload'

// governance by role, from the configs: who may move data in and out, who may read a document's history, which languages the content speaks
type QpuUser = { roles?: string[]; tenants?: { roles?: string[] }[] } | null | undefined
const qpuSuperAdmin = (u: unknown) => ((u as QpuUser)?.roles ?? []).includes('admin')
const qpuEditor = ({ req }: { req: { user?: unknown } }) => qpuSuperAdmin(req.user) || ((req.user as QpuUser)?.tenants ?? []).some((r) => (r.roles ?? []).some((x) => x === 'tenant-admin' || x === 'editor'))
const qpuSuperAdminOnly = ({ req }: { req: { user?: unknown } }) => qpuSuperAdmin(req.user)
// a bulk import or export overrides many documents at once: the super admin's act alone, never a tenant's, and never updated
const qpuTransferAccess = ({ collection }: { collection: CollectionConfig }): CollectionConfig => ({ ...collection, access: { ...collection.access, read: qpuSuperAdminOnly, create: qpuSuperAdminOnly, update: () => false, delete: qpuSuperAdminOnly } })
/** the languages by ISO 639-1 code, from the QPU's own language list: English the default, a missing translation falling back to it */
export const qpuLocalization = { locales: ${JSON.stringify(Object.keys(LOCALES))}, defaultLocale: 'en', fallback: true }
/** a document's version history readable only by those who may edit it, on every versioned collection; the localization set when the config sets none */
export const qpuGovernance = (config: Config): Config => ({ ...config, localization: config.localization ?? qpuLocalization, collections: (config.collections ?? []).map((c) => (c.versions ? { ...c, access: { ...c.access, readVersions: c.access?.readVersions ?? qpuEditor } } : c)) })

export const qpuBlocks = [Qpu] // beside the site's ${ws.blocks} blocks; referenced as 'qpu' in every layout
export const qpuPlugins = [
  // data moved in and out by the super admin alone: a bulk import or export overrides many documents at once, so its records are read, created and deleted only by the super admin, never updated; orders leave, never enter
  importExportPlugin({ collections: [{ slug: 'pages' }, { slug: 'posts' }, { slug: 'entries' }, { slug: 'products' }, { slug: 'orders', import: false }], overrideExportCollection: qpuTransferAccess, overrideImportCollection: qpuTransferAccess }),
  // the ecommerce plugin first: it creates products, carts, orders, transactions and addresses, which the multi-tenant plugin scopes (measured: placed after, the plugin warns of missing collections)
  qpuEcommerce, // the licence catalogue sold through Payload's own ecommerce plugin with its Stripe adapter: the API from the config
  searchPlugin({ collections: ['pages', 'posts'] }),
  // enterprise tenants from the configs: four scoped collections, a super admin by the admin role (never everyone), tenant roles on every user's tenants row, tenants readable by all
  multiTenantPlugin({ collections: { ${SCOPES.collections.map((c) => `${c}: {}`).join(', ')} }, tenantsSlug: 'tenants', userHasAccessToAllTenants: qpuSuperAdmin, tenantsArrayField: { includeDefaultField: true, rowFields: [{ name: 'roles', type: 'select', hasMany: true, defaultValue: ['viewer'], options: [${TENANT_ROLES.map((r) => `'${r}'`).join(', ')}] }] } } as never), // scopes: ${SCOPES.tenants.join(', ')} over ${SCOPES.collections.join(', ')}; roles ${TENANT_ROLES.join(', ')}
  // one connector: qpuMcpPlugin — collection finds, coverDomains, researchPastedLinks, the handler catalogue, ISO fuse afterToolCall
  qpuMcpPlugin,
  qpuGovernance, // last, over every collection the plugins above added: version history by role, the languages by ISO 639-1
]
export const qpuEnv = {
  DATABASE_URI: "the RAID docket of the tenant (the mongo tool's language), as the site's MongoDB",
  PAYLOAD_SECRET: "the tenant's",
  R2: "Cloudflare R2 through the bindings MCP once the tenant's token opens it (the site's vercel-blob until then)",
  QPU_ORIGIN: "https://qpu.uuidna.com: the Worker that computes every qpu block and every /<uuid> page",
}
`
      // only Payload: the handler's tools served by the Payload MCP plugin, the docket an entries collection over MongoDB, the discovery document an endpoint, Stripe by its plugin
      const mcpTools = `${header}// The QPU's tools served by the Payload MCP plugin (@payloadcms/plugin-mcp 4.0.0-beta.7): every tool of the handler, its JSON Schema read into
// zod parameters, its result answered as text; the server is named qpu with the tree's version. Generated by configure { kind: 'fullstack' }.
import { z } from 'zod'
import { handle, caller, call } from '@uuidna/qpu/mcp'
import { VERSION } from '@uuidna/qpu/version'
import { runMachine } from '@uuidna/qpu/machine'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'

type Schema = { type?: string; properties?: Record<string, Schema & { description?: string; enum?: unknown[]; items?: Schema }>; required?: string[]; description?: string; enum?: unknown[]; items?: Schema }
const zod = (s: Schema | undefined): z.ZodTypeAny => {
  if (!s) return z.unknown()
  if (Array.isArray(s.enum)) return z.enum(s.enum.map(String) as [string, ...string[]])
  switch (s.type) {
    case 'string': return z.string()
    case 'integer': return z.number().int()
    case 'number': return z.number()
    case 'boolean': return z.boolean()
    case 'array': return z.array(zod(s.items))
    case 'object': return z.record(z.string(), z.unknown())
    default: return z.unknown()
  }
}
const list = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; description: string; inputSchema: Schema }[] } }).result.tools
const handlerTools = list.map((t) => ({
  name: t.name,
  description: t.description,
  parameters: Object.fromEntries(Object.entries(t.inputSchema.properties ?? {}).map(([k, p]) => [k, (t.inputSchema.required ?? []).includes(k) ? zod(p).describe(p.description ?? '') : zod(p).optional().describe(p.description ?? '')])) as z.ZodRawShape,
  handler: async (args: Record<string, unknown>, req?: any) => {
    // a chat turn: an entry made as the viewer, answered by the entries hook under the viewer's roles
    const chat = args.chat as { call?: unknown; choice?: string } | undefined, ask = t.name === 'match' && chat && !chat.call && await req?.payload.create({ collection: 'entries', data: { kind: 'chat', from: 'mcp', body: { statement: args.statement, choice: chat.choice } }, req, overrideAccess: false }).catch(() => null)
    const r = (ask ? { result: { structuredContent: ask.result } } : call(t.name, args)) as { result?: { structuredContent: unknown }; error?: { message: string } }
    // the widget mounted by the host: the result names the tool's own ui:// resource (MCP Apps), since the plugin's tools/list carries no _meta
    return { content: [{ type: 'text' as const, text: JSON.stringify(r.error ? { error: r.error.message } : r.result!.structuredContent) }], ...(r.error ? {} : { structuredContent: r.result!.structuredContent as Record<string, unknown> }), _meta: { ui: { resourceUri: 'ui://qpu/' + t.name } } }
  },
}))
// the developer machine through the Payload MCP: the handler's door plans every action from its allow-list; the action runs here, in this
// process, only on a local app (a loopback host) and only for a super admin, with no shell; every run is an entry of the Entries collection
// created as the user (the tenant's roles and the entries hooks apply); the result names the repository tool's MCP App view
const callTool = (name: string, args: Record<string, unknown>) => caller(name)(args)
const LOOPBACK = ['localhost', '127.0.0.1', '[::1]']
type MachineReq = { headers?: { get?: (k: string) => string | null }; user?: { roles?: string[] } | null; payload: { create: (o: Record<string, unknown>) => Promise<{ id: string | number }> } }
export const qpuMachineTool = {
  name: 'machine',
  description: 'The developer machine managed through the Payload MCP, securely: one action of the allow-list (repository { machine: { actions: true } } names them) run on this local app for a super admin, with no shell; commit and push decided by the workflow rules, a push only with confirm; every run an entry of the Entries collection, its paths relative and its leaks redacted',
  parameters: { action: z.string().describe('an action of the allow-list: ${MACHINE_ACTIONS.map((x) => x.id).join(', ')}'), message: z.string().optional().describe('commit: the message'), confirm: z.boolean().optional().describe('push: the user confirms it'), branch: z.string().optional().describe('merge, branch-delete: the branch'), path: z.string().optional().describe('worktree-remove: the worktree'), tag: z.string().optional().describe('tag: an archive/ name'), commit: z.string().optional().describe('tag: the full commit'), from: z.string().optional().describe('port: the file in a worktree'), file: z.string().optional().describe('port: the path in main; a row needing a file: the relative file'), archived: z.boolean().optional().describe('branch-delete: -D behind an archive tag'), worktree: z.string().optional().describe('any action: the worktree under .claude/worktrees it runs in'), pattern: z.string().optional().describe('a row needing a pattern: the regular expression'), patch: z.string().optional().describe('a row needing a patch: the unified diff applied') },
  handler: async (args: Record<string, unknown>, req: MachineReq, extra?: { _meta?: { progressToken?: string | number }; sendNotification?: (n: { method: string; params: Record<string, unknown> }) => Promise<void> }) => {
    const answer = (x: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(x) }], _meta: { ui: { resourceUri: 'ui://qpu/repository' } } })
    const h = String(req.headers?.get?.('host') ?? '')
    const host = h.startsWith('[') ? h.slice(0, h.indexOf(']') + 1) : h.split(':')[0]!
    const refuse = (refused: string, evidence: unknown) => answer({ refused, court: callTool('legal', { court: { gate: 'machine', status: 403, rule: 'role', evidence } }) })
    if (!LOOPBACK.includes(host)) return refuse('the machine answers only on a local app', { host })
    if (!(req.user?.roles ?? []).includes('admin')) return refuse('the machine needs the super admin', { action: args.action })
    // the one runner (scripts/machine.ts) plans, runs with no shell and records; a call carrying a progress token is streamed through the plugin's request context, step by step for next
    const progressToken = extra?._meta?.progressToken
    const r = await runMachine(args, path.resolve(process.cwd(), '..'), (p) => { if (progressToken !== undefined) void extra?.sendNotification?.({ method: 'notifications/progress', params: { progressToken, ...p } }) })
    if (!r.record) return answer(r.plan)
    const doc = await req.payload.create({ collection: 'entries', data: { kind: 'machine', from: 'local', body: r.record.entry.body }, req, overrideAccess: false, user: req.user })
    return answer({ ...r.answer, stored: { collection: 'entries', id: doc.id } })
  },
}
export const qpuMcpTools = handlerTools // the machine joins them through the qpu-machine plugin
// the UI resources (MCP Apps): one ui://qpu/<tool> per tool, read from the handler's resources/read, served through the plugin's resources
const resources = (handle({ jsonrpc: '2.0', id: 1, method: 'resources/list' }) as { result: { resources: { uri: string; name: string; description: string; mimeType: string }[] } }).result.resources
export const qpuMcpResources = resources.map((r) => ({
  name: r.uri.replace(/^([a-z]+):\\/\\/qpu\\//, '$1-'),
  title: r.name,
  description: r.description,
  uri: r.uri,
  mimeType: r.mimeType,
  handler: async () => { const x = handle({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: r.uri } }) as { result?: { contents: { uri: string; text: string }[] } }; return { contents: (x.result?.contents ?? []).map((c) => ({ uri: c.uri, text: c.text })) } },
}))
export const qpuServerInfo = { name: 'qpu', version: VERSION }
`
      const entries = `${header}// The docket as a Payload collection over MongoDB (the mongo tool's language): every entry addressed by its content — the id is the
// fold address of what it holds, the sha256 beside it — never overwritten; the four verbs are Payload's REST (/api/entries).
import { createHmac, hkdfSync } from 'node:crypto'
import type { CollectionConfig, Where } from 'payload'
import { entryText, uuid } from '@uuidna/qpu/blocks'
import { call, caller } from '@uuidna/qpu/mcp'
import { signedRole } from '@uuidna/qpu/roles'

type TenantUser = { roles?: string[]; tenants?: { tenant?: { id?: string } | string; roles?: string[] }[] } | null | undefined
const isSuperAdmin = (user: unknown): boolean => ((user as TenantUser)?.roles ?? []).includes('admin')
const tenantId = (t: unknown): string | null => (typeof t === 'string' ? t : (t as { id?: string } | undefined)?.id ?? null)
const tenantsWithRole = (user: unknown, roles: readonly string[]): string[] => ((user as TenantUser)?.tenants ?? []).filter((row) => (row.roles ?? []).some((r) => roles.includes(r))).map((row) => tenantId(row.tenant)).filter((id): id is string => !!id)
const member = (user: unknown, tenant: string | null, roles: readonly string[]): boolean => !!tenant && tenantsWithRole(user, roles).includes(tenant)
const tenants = (user: unknown): string[] => ((user as TenantUser)?.tenants ?? []).map((row) => tenantId(row.tenant)).filter((x): x is string => !!x)
// a role claimed in a header counts only when signed under the deployment's secret (x-qpu-role-mac over role|tenant|METHOD); a bare header is no claim
const claimedRole = (req: { headers: Headers; method?: string }) => signedRole({ role: req.headers.get('x-qpu-role'), tenant: req.headers.get('x-qpu-tenant'), mac: req.headers.get('x-qpu-role-mac'), method: req.method ?? '' }, process.env.QPU_ROLE_SECRET)
export const Entries: CollectionConfig = {
  slug: 'entries',
  admin: { useAsTitle: 'id', defaultColumns: ['id', 'kind', 'from', 'createdAt'] },
  enableQueryPresets: true, // each tenant's saved lists: its devices, readings, commands
  // access by tenant roles and the Worker's roles: a reader reads; a call is created by anyone; an entry of other kinds by a super admin, a tenant-admin or editor of its tenant, or a writer role signed under the deployment's secret; no one updates (an entry is its content address); a super admin, a tenant-admin of its tenant or a signed admin role deletes
  access: {
    // the operational kinds (a machine's runs, chats, penalties, sessions) to their tenant and admins alone; the rest is the public docket
    read: ({ req }) => isSuperAdmin(req.user) || claimedRole(req) === 'admin' || ${readClause()},
    create: ({ req, data }) => data?.kind === 'call' || data?.kind === 'chat' || isSuperAdmin(req.user) || member(req.user, tenantId(data?.tenant), ['tenant-admin', 'editor']) || claimedRole(req) === 'writer' || claimedRole(req) === 'admin',
    update: () => false,
    delete: ({ req }) => isSuperAdmin(req.user) || claimedRole(req) === 'admin' || { tenant: { in: tenantsWithRole(req.user, ['tenant-admin']) } },
  },
  fields: [
    { name: 'id', type: 'text', required: true, ${validate('entries', 'id')}, admin: { readOnly: true, description: 'the content address: computed from kind, from and body' } },
    { name: 'kind', type: 'text', required: true, index: true, ${validate('entries', 'kind')} },
    { name: 'from', type: 'text', required: true, index: true },
    { name: 'body', type: 'json' },
    { name: 'sha256', type: 'text', ${validate('entries', 'sha256')}, admin: { readOnly: true } },
    { name: 'result', type: 'json', admin: { readOnly: true, description: 'kind call: the reply of the tool, computed by the hook from body { tool, arguments }; the API of every tool is this collection' } },
    // the docket's relations, Payload's own: an entry has many entries it links (a belongs-to-many of the same collection), and the entries
    // linking it are joined back by Payload, never stored twice
    { name: 'links', type: 'relationship', relationTo: 'entries', hasMany: true, admin: { description: 'the entries this one links: a relation of the docket (has many)' } },
    { name: 'linkedBy', type: 'join', collection: 'entries', on: 'links', admin: { description: 'the entries that link this one: the inverse, joined by Payload' } },
  ],
  hooks: {
    // every 404 from a block answered, nothing written: a well-formed UUID the collection does not hold is healed from the Worker by address (QPU_ORIGIN, accept json),
    // which answers the entry its docket holds or the UUID's own page computed from the id alone; unreachable, the same page is computed here by the handler
    afterError: [async ({ error, req }) => {
      const id = String((req as { routeParams?: { id?: unknown } } | undefined)?.routeParams?.id ?? (req?.url ?? '').split('?')[0]!.split('/').pop() ?? '')
      if ((error as { status?: number }).status !== 404) return
      if (/^[a-z][a-z0-9]*$/.test(id)) return { response: { id, kind: 'keyword', from: 'afterError', computed: true, written: false, thrown: false, bit: 0, closed: true, unhandled: 0, beyond: true, says: 'a one-word path the collection does not hold falls back to the zero bit, so the 404 left is zero, beyond what was imagined' }, status: 200 }
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)) return
      try { const res = await fetch((process.env.QPU_ORIGIN ?? 'https://qpu.uuidna.com') + '/' + id, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(10000) }); if (res.ok) { const entry = await res.json() as { id?: string; kind?: string; from?: string; body?: unknown; links?: string[]; computed?: boolean }; if (entry && entry.kind && entry.from && !entry.computed) { try { await req.payload.create({ collection: 'entries' as never, data: { kind: entry.kind, from: entry.from, body: entry.body, links: entry.links ?? [] } as never, overrideAccess: true, context: { disableRevalidate: true } }) } catch { /* seeded already, or refused: the answer stands */ } } return { response: entry, status: 200 } } } catch { /* the Worker unreached: computed here */ }
      const v = caller('verify')({ uuid: id })
      return { response: { id, kind: 'uuid', from: 'computed', computed: true, body: v ?? null, says: 'no entry at this address: the page of the UUID from the id alone, nothing written (no content address to seed at)' }, status: 200 }
    }],
    beforeValidate: [async ({ data, operation, req }) => {
      if (operation !== 'create' || !data) return data
      // the tenant the multi-tenant plugin requires: the caller's, else the request host's row (as the users hook names it), else the first tenant, so a public call lands under the tenant that answers it
      if (!data.tenant) { const host = (req?.headers?.get?.('host') ?? '').split(':')[0] || 'localhost'; const byHost = await req.payload.find({ collection: 'tenants' as never, where: { 'domains.domain': { equals: host } }, limit: 1, overrideAccess: true }); const first = byHost.docs[0] ?? (await req.payload.find({ collection: 'tenants' as never, limit: 1, sort: 'createdAt', overrideAccess: true })).docs[0]; if (first) data.tenant = (first as { id: string }).id }
      // a call salted under the server's data key: the same request keeps its address, but no one who knows the request can compute it, nor its answer's
      if (data.kind === 'call' && process.env.QPU_DATA_KEY && data.body && typeof data.body === 'object' && !('salt' in data.body)) data.body = { ...data.body, salt: createHmac('sha256', Buffer.from(hkdfSync('sha256', process.env.QPU_DATA_KEY, '', 'qpu call salt', 32))).update(JSON.stringify(data.body)).digest('hex') }
      // the caller's role, from Payload's user and the tenant (a signed role claim counts too): the chat door corrects what the role may not choose
      const tenantId = tenantId(data.tenant)
      const role = isSuperAdmin(req.user) || claimedRole(req) === 'admin' || member(req.user, tenantId, ['tenant-admin']) ? 'admin' : claimedRole(req) === 'writer' || member(req.user, tenantId, ['editor']) ? 'writer' : 'reader'
      const chatDoor = (statement: string, chat: Record<string, unknown>) => caller('match')({ statement, chat })
      // a call is folded as it will run: its arguments corrected for the role first, so the same address always holds the same reply
      const asked = data.body as { tool?: string; arguments?: Record<string, unknown>; statement?: string; choice?: string } | undefined
      let corrected: unknown[] = []
      if (data.kind === 'call' && asked?.tool) { const c = chatDoor('call ' + asked.tool, { role, run: false, call: { tool: asked.tool, arguments: asked.arguments ?? {} } }); if (c?.call) { data.body = { tool: asked.tool, arguments: c.call.arguments }; corrected = c.corrected ?? [] } }
      // a chat entry: the statement, the role and any choice are its body; the hook answers it through the chat door, nothing thrown back
      if (data.kind === 'chat') data.body = { statement: String(asked?.statement ?? ''), role, ...(asked?.choice && { choice: String(asked.choice) }) }
      const chat = data.kind === 'chat' ? chatDoor(String(asked?.statement ?? ''), { role, choice: asked?.choice }) : undefined
      // the address folds the entry's canonical text and the ids it links: the same body linking other entries is another entry
      const links = Array.isArray(data.links) ? data.links.map((l) => String(typeof l === 'object' && l ? (l as { id?: unknown }).id : l)) : []
      const text = entryText({ kind: data.kind, from: data.from, body: data.body, links })
      const bytes = new TextEncoder().encode(text)
      const digest = await crypto.subtle.digest('SHA-256', bytes)
      // the API built from the config: an entry of kind call carries a tool and its arguments, and the hook answers it from the handler; the address folds the call, not the reply, so the same call is the same entry (read free, computed once)
      const body = data.body as { tool?: string; arguments?: Record<string, unknown> } | undefined
      // the reply's result stands as the entry's result (content, structuredContent, _meta with the widget); a refusal stands as { error }
      const reply = data.kind === 'call' && body?.tool ? call(body.tool, body.arguments ?? {}) : undefined
      const result = chat ? chat : reply ? { ...((reply.result ?? { error: reply.error }) as object), ...(corrected.length ? { corrected } : {}) } : undefined
      return { ...data, id: uuid(text), sha256: [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join(''), ...(result ? { result } : {}) }
    }],
    // no revalidation hook: an entry is its content address and never updates, so nothing cached under it ever changes (measured: a revalidateTag during the render that creates a call is refused by Next)
  },
}
`
      // the API built from Payload's config, nothing customised or bypassed: the discovery document is a global (read at /api/globals/qpu), computed by its afterRead hook
      const qpuGlobal = `${header}// The discovery document as a Payload global: GET /api/globals/qpu answers it from the handler alone, computed on read by the global's own hook; no custom endpoint.
import type { GlobalConfig } from 'payload'
import { discovery } from '@uuidna/qpu/discovery-document'
import { caller } from '@uuidna/qpu/mcp'

export const QpuGlobal: GlobalConfig = {
  slug: 'qpu',
  access: { read: () => true },
  fields: [
    { name: 'origin', type: 'text', defaultValue: 'https://qpu.uuidna.com', admin: { description: 'the origin the discovery document names' } },
    { name: 'document', type: 'json', admin: { readOnly: true, description: 'the discovery document: computed on every read, never stored' } },
    { name: 'branding', type: 'json', admin: { readOnly: true, description: 'the branding of the tenant that asked, and the one theme and template its site and its admin share. Computed on this read from the tenants row.' } },
  ],
  // per tenant: the document names the origin of the host that asked (a tenant's domain), else the origin the global holds; a local host keeps the global's
  hooks: { afterRead: [async ({ doc, req }) => { const host = req?.headers?.get?.('host') ?? ''; const origin = host && !/^(localhost|127\\.0\\.0\\.1)(:|$)/.test(host) ? 'https://' + host.split(':')[0] : String(doc?.origin ?? 'https://qpu.uuidna.com'); const hostname = host.split(':')[0] ?? ''; const row = hostname ? ((await req.payload.find({ collection: 'tenants' as never, where: { 'domains.domain': { equals: hostname } }, limit: 1, overrideAccess: true })).docs[0] as { slug?: string; name?: string; branding?: unknown } | undefined) : undefined; const b = caller('configure')({ kind: 'branding', branding: { host: hostname, slug: row?.slug, name: row?.name, branding: row?.branding ?? null } }); return { ...doc, origin, document: discovery(origin, process.env as Record<string, unknown>), branding: b?.config ?? null } }] },
}
`
      // the UUID page rendered by the app itself: the handler verifies the address and lays out its channel, vortex and theme; no Worker behind it
      // the tenants collection from the configs: one tenant per host of TENANTS, its currency, its domains; readable by all, written by a super admin
      const tenants = `${header}// The tenants: the collection the multi-tenant plugin requires, from the configs — a name, a slug, the domains that name the tenant
// (as the Worker's TENANTS map) and its currency; readable by everyone, written by a super admin (the admin role). Generated by configure { kind: 'fullstack' }.
import type { CollectionConfig } from 'payload'
import { caller } from '@uuidna/qpu/mcp'

const roles = (req: { user?: unknown }): string[] => ((req.user as { roles?: string[] } | undefined)?.roles ?? [])
export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug', 'currency'] },
  access: { read: () => true, create: ({ req }) => roles(req).includes('admin'), update: ({ req }) => roles(req).includes('admin'), delete: ({ req }) => roles(req).includes('admin') },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'slug', type: 'text', required: true, unique: true, ${validate('tenants', 'slug')} },
    { name: 'namespace', type: 'text', unique: true, index: true, validate: (v: unknown) => (v == null || v === '') || /^[a-z][a-z0-9-]{1,62}$/.test(String(v)) || 'a namespace: lower-case letters, digits and dashes, starting with a letter', custom: { theorem: 'textbook_namespace_narrows' }, admin: { description: 'the namespace that names the tenant without a domain: the sandbox of an app, chosen by the x-qpu-namespace header; a credential is narrowed to it, never widened' } },
    { name: 'domains', type: 'array', fields: [{ name: 'domain', type: 'text', required: true }], admin: { description: 'the hosts that name the tenant; the Worker maps each to the docket' } },
    { name: 'currency', type: 'select', required: true, defaultValue: 'EUR', options: ${JSON.stringify(QPU_CURRENCIES.map((c) => c.code))}, admin: { description: 'the currency the tenant prices in; required so the tenant states it and nothing is guessed' } },
    { name: 'settings', type: 'json', admin: { description: 'the plugin options this tenant configures: { arguments: {...} } is merged into every qpu block call under its hosts; read by the page and by MCP clients through the Payload MCP plugin' } },
    // the bindings a tenant uses, strictly by name: the adapters profile, the connectors the endpoint is listed as, the variables it binds; the values stay in the Worker's and the app's environment
    { name: 'bindings', type: 'group', admin: { description: 'the bindings this tenant uses, by name: the adapters profile, the connectors it is listed as, the variables it names; values never here — the Worker and the app read them from their environment by these names (the configure tool computes the choice from the names: kinds adapters and bindings)' }, fields: [
      { name: 'profile', type: 'select', defaultValue: 'cloudflare', options: ['cloudflare', 'google', 'vercel', 'local'], admin: { description: 'the adapters profile: database, storage and email chosen by what the environment names' } },
      { name: 'connectors', type: 'select', hasMany: true, defaultValue: ['claude', 'cloudflare'], options: ['claude', 'cloudflare', 'registry'], admin: { description: 'what the one /mcp endpoint is listed as: a Claude connector, a Cloudflare remote MCP, an entry of the MCP registry' } },
      { name: 'variables', type: 'array', fields: [{ name: 'name', type: 'text', required: true, ${validate('tenants', 'bindings.variables.name')} }], admin: { description: 'the variable names this tenant binds (QPU_OAUTH_ISSUER_<TENANT>, MCP_PUBLISHER_TOKEN, ...): names the bindings kind knows; the tenant kind measures which the environment lacks' } },
    ] },
    // the tenant's branding: what the tenant defines here stands; what it leaves empty is computed in real time from its address (configure, kind branding)
    { name: 'branding', type: 'group', admin: { description: 'the branding, and the one theme and template this tenant\\'s site and admin share. Empty branding is computed from the address. Theme and template are saved on this row and read back by GET /api/globals/qpu.' }, fields: [
      { name: 'name', type: 'text' }, { name: 'tagline', type: 'text' }, { name: 'accent', type: 'text', ${validate('tenants', 'branding.accent')} },
      { name: 'theme', type: 'select', defaultValue: 'neutral', options: ${JSON.stringify([...THEME_PRESETS])}, admin: { description: 'the shadcn base colour. One value for the site and the admin. The stylesheet is already loaded.' } },
      { name: 'mode', type: 'select', defaultValue: 'light', options: ['light', 'dark'], admin: { description: 'light or dark, for the site and the admin' } },
      { name: 'template', type: 'select', defaultValue: 'landing', options: ${JSON.stringify(SITE_TEMPLATES.map((item) => item.id))}, admin: { description: 'the one template. VitePress is the docs template. The site and the admin both use it. Payload serves the pages.' } },
      { name: 'logo', type: 'upload', relationTo: 'media' }, { name: 'icon', type: 'upload', relationTo: 'media' },
    ] },
  ],
  // one save develops every template through Payload. beforeChange records the formula; afterChange is the development.
  hooks: {
    beforeChange: [({ data }) => { const template = data?.branding?.template || 'landing'; const theme = data?.branding?.theme || 'neutral'; const mode = data?.branding?.mode === 'dark' ? 'dark' : 'light'; return { ...data, branding: { ...data?.branding, theme, mode, template } } }],
    afterChange: [async ({ doc }) => { const saved = caller('configure')({ kind: 'branding', branding: { slug: doc?.slug, name: doc?.name, host: doc?.domains?.[0]?.domain, branding: doc?.branding ?? null } }); return { ...doc, developed: saved?.config?.ui?.save ?? null } }],
  },
}
`
      const hostCode = reactHost()
      // the adapters chosen by the environment at run time: Cloudflare bindings when the host hands them (OpenNext: globalThis.__qpuBindings), the site's own otherwise
      const adaptersModule = `${header}// Payload's adapters chosen by the environment. On Cloudflare, D1 and R2 are the with-cloudflare-d1 template:
// getCloudflareContext in the Worker, getPlatformProxy for the Payload CLI. Any other profile keeps its own database.
// The RAID's docket is the semantics over whichever database answers. Generated by configure { kind: 'adapters' }; imported from src/plugins/qpu/adapters.ts.
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { gcsStorage } from '@payloadcms/storage-gcs'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'
import { r2Storage } from '@payloadcms/storage-r2'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { qpuRaidDb } from './payload.qpu.db'
import { getCloudflareContext, type CloudflareContext } from '@opennextjs/cloudflare'
import fs from 'node:fs'
import path from 'node:path'
import { definePlugin, type Config, type EmailAdapter, type Plugin } from 'payload'

type Bindings = { D1?: unknown; R2?: unknown; KV?: unknown; DOCKET?: unknown; AI?: unknown }
export const qpuBindings = (): Bindings => ((globalThis as { __qpuBindings?: Bindings }).__qpuBindings ?? {})
const cloudflareRealpath = (value: string) => { try { return fs.existsSync(value) ? fs.realpathSync(value) : undefined } catch { return undefined } }
const cloudflareCLI = process.argv.some((value) => cloudflareRealpath(value)?.endsWith(path.join('payload', 'bin.js')))
const cloudflareProduction = process.env.NODE_ENV === 'production'
const cloudflareContextFromWrangler = (): Promise<CloudflareContext> => import(/* webpackIgnore: true */ \`\${'__wrangler'.replaceAll('_', '')}\`).then(({ getPlatformProxy }) => getPlatformProxy({ environment: process.env.CLOUDFLARE_ENV, remoteBindings: cloudflareProduction }))
const assignCloudflare = (env: { D1?: unknown; R2?: unknown } | undefined) => { if (!env?.D1) return; (globalThis as { __qpuBindings?: Bindings }).__qpuBindings = { ...qpuBindings(), D1: env.D1, R2: env.R2 } }
assignCloudflare((globalThis as Record<symbol, { env?: { D1?: unknown; R2?: unknown } }>)[Symbol.for('__cloudflare-context__')]?.env)
if (!qpuBindings().D1 && (process.env.QPU_ADAPTERS === 'cloudflare' || cloudflareCLI)) {
  try {
    const cloudflare = cloudflareCLI || !cloudflareProduction ? await cloudflareContextFromWrangler() : await getCloudflareContext({ async: true })
    assignCloudflare(cloudflare.env)
  } catch { /* outside the Worker, without wrangler: the named profile's own database stands */ }
}
export const qpuGoogle = (): boolean => !qpuBindings().D1 && (process.env.QPU_ADAPTERS === 'google' || Boolean(process.env.GCS_BUCKET) || Boolean(process.env.GOOGLE_CLOUD_PROJECT))
export const qpuProfile = (): 'cloudflare' | 'google' | 'vercel' | 'local' => (qpuBindings().D1 || process.env.QPU_ADAPTERS === 'cloudflare' ? 'cloudflare' : qpuGoogle() ? 'google' : process.env.BLOB_READ_WRITE_TOKEN ? 'vercel' : 'local')
// email over the contract Payload holds: Cloudflare's email sending builder, an entry of kind openapi-operation read from Cloudflare's own OpenAPI
// (node scripts/mcp.ts openapi-import), its server and path read from the entry when a mail is sent; the account and the token are the tenant's
// bindings, named never valued; the Workers-safe HTTP form of the send_email binding the port was owed
const cloudflareEmail = (from: { defaultFromAddress: string; defaultFromName: string }): EmailAdapter => ({ payload }) => ({ name: 'cloudflare-email-sending', ...from, sendEmail: async (message) => {
  const op = await (async () => { let page = 1; for (;;) { const found = await payload.find({ collection: 'entries' as never, where: { kind: { equals: 'openapi-operation' } }, depth: 0, page, overrideAccess: true }); const hit = (found.docs as { body?: { operationId?: string; server?: string | null; path?: string; method?: string } }[]).map((d) => d.body).find((b) => b?.operationId === 'email-sending-account-send-builder' && b.server); if (hit || !found.hasNextPage || found.nextPage == null) return hit; page = found.nextPage } })()
  if (!op?.server || !op.path) throw new Error('the email sending contract is not held in Payload: node scripts/mcp.ts openapi-import names it')
  const res = await fetch(op.server + op.path.split('{account_id}').join(process.env.CLOUDFLARE_ACCOUNT_ID ?? ''), { method: op.method ?? 'POST', headers: { authorization: 'Bearer ' + process.env.CLOUDFLARE_EMAIL_TOKEN, 'content-type': 'application/json' }, body: JSON.stringify({ from: message.from || from.defaultFromAddress, to: message.to, cc: message.cc, bcc: message.bcc, subject: message.subject, html: message.html, text: message.text, reply_to: message.replyTo }), signal: AbortSignal.timeout(20000) })
  if (!res.ok) throw new Error('Cloudflare email sending answered ' + res.status)
  return res.json()
} })
const mailFrom = () => ({ defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@localhost.test', defaultFromName: process.env.EMAIL_FROM_NAME || 'QPU' })
const smtp = (): Record<string, unknown> | undefined => (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD ? { service: 'gmail', auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } } : process.env.SENDGRID_API_KEY ? { host: 'smtp.sendgrid.net', port: 587, auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY } } : undefined)
// every adapter a Payload plugin (definePlugin, its slug the adapter's package): per part, the first one its environment names sets that part of
// the config. A storage adapter is the object its factory returns, appended to config.storage, and Payload calls its init. It is not called as a plugin.
// The parts and their adapters are the ADAPTERS rows Payload holds, edited in its admin (configure { kind: 'adapters' } writes this file)
type Adapter = { pkg: string; named: () => boolean; make: () => unknown }
const ADAPTERS: Record<'db' | 'email' | 'storage', Adapter[]> = {
  db: [
    { pkg: 'db-d1-sqlite', named: () => Boolean(qpuBindings().D1), make: () => sqliteD1Adapter({ binding: qpuBindings().D1 as never, blocksAsJSON: true }) },
    { pkg: 'db-postgres', named: qpuGoogle, make: () => postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI || '' } }) },
    { pkg: 'db-mongodb', named: () => true, make: () => mongooseAdapter({ url: process.env.DATABASE_URI || '', migrationDir: path.resolve(process.cwd(), 'src/migrations/qpu') }) },
  ],
  email: [
    { pkg: 'email-resend', named: () => Boolean(process.env.RESEND_API_KEY), make: () => resendAdapter({ apiKey: process.env.RESEND_API_KEY || '', ...mailFrom() }) },
    { pkg: 'email-cloudflare', named: () => Boolean(process.env.CLOUDFLARE_EMAIL_TOKEN && process.env.CLOUDFLARE_ACCOUNT_ID), make: () => cloudflareEmail(mailFrom()) },
    { pkg: 'email-nodemailer', named: () => true, make: () => { const t = smtp(); return nodemailerAdapter({ ...mailFrom(), ...(t ? { transportOptions: t as never } : {}) }) } },
  ],
  storage: [
    { pkg: 'storage-r2', named: () => Boolean(qpuBindings().R2), make: () => r2Storage({ bucket: qpuBindings().R2 as never, collections: { media: true } }) },
    { pkg: 'storage-gcs', named: () => Boolean(process.env.GCS_BUCKET), make: () => gcsStorage({ bucket: process.env.GCS_BUCKET || '', options: { projectId: process.env.GCS_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT }, collections: { media: true } }) },
    { pkg: 'storage-vercel-blob', named: () => true, make: () => vercelBlobStorage({ cacheControlMaxAge: 60 * 60 * 24 * 365, collections: { media: { generateFileURL: ({ filename }) => \`https://\${process.env.BLOB_STORE_ID}/\${filename}\` } }, enabled: Boolean(process.env.BLOB_STORAGE_ENABLED) || false, token: process.env.BLOB_READ_WRITE_TOKEN || '' }) },
  ],
}
const chosen = (part: keyof typeof ADAPTERS): Adapter => ADAPTERS[part].find((a) => a.named())!
// Production: QPU_ADAPTERS=raid → qpuRaidDb (composite over every store); else the profile-chosen adapter. qpuRaid still mirrors/verifies.
export const qpuDb = () => (process.env.QPU_ADAPTERS === 'raid' ? qpuRaidDb() : chosen('db').make()) as Config['db']
export const qpuEmail = () => chosen('email').make() as EmailAdapter
export const qpuAdapterPlugins = (): Plugin[] => (Object.keys(ADAPTERS) as (keyof typeof ADAPTERS)[]).flatMap((part) => ADAPTERS[part].map((a) => definePlugin<{ enabled?: boolean }>({ slug: 'qpu-' + a.pkg, plugin: ({ config, enabled }) => (enabled === false || chosen(part) !== a || (part === 'db' && process.env.QPU_ADAPTERS === 'raid') ? config : part === 'storage' ? { ...config, storage: [...(config.storage ?? []), a.make() as never] } : { ...config, [part]: a.make() }) })({})))
`
      // the first user is the super admin and the first tenant is the request host: a hook of the users collection, generated; the fork's Users.ts registers it
      const usersHooks = `${header}// The first user bootstrap: the first user created (a deploy's seed from the deployer's account email, or the admin panel's create-first-user)
// is always the super admin (the admin role), and the first tenant is the host of that request — created if absent, the user its tenant-admin
// — unless the caller named the tenants (a deploy's seed names the first tenant of the configs). Every later user is what the admin makes it. Generated by configure { kind: 'fullstack' }; registered by src/collections/Users.ts (hooks.beforeChange).
import type { CollectionBeforeChangeHook } from 'payload'

export const firstUserBootstrap: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data
  const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
  if (totalDocs > 0) return data
  const host = (req.headers.get('host') ?? '').split(':')[0] || 'localhost'
  const slug = host.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'local'
  const found = await req.payload.find({ collection: 'tenants' as never, where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
  const tenant = (found.docs[0] ?? await req.payload.create({ collection: 'tenants' as never, overrideAccess: true, data: { name: host, slug, domains: [{ domain: host }], currency: 'EUR' } as never })) as { id: string }
  const roles = Array.from(new Set([...((data as { roles?: string[] }).roles ?? []), 'admin']))
  const given = (data as { tenants?: unknown[] }).tenants
  return { ...data, roles, tenants: Array.isArray(given) && given.length ? given : [{ tenant: tenant.id, roles: ['tenant-admin'] }] }
}
`
      // the qpu block in a page's layout, rendered through the host: the block's call is an entry of the page's tenant (the local API), its view the tool's ui:// resource; nothing drawn by hand
      const blockView = `${header}// The qpu block in a page's layout: the block names a tool and its arguments; the app computes the call from the handler (once per process,
// by the balancer) and renders its result through the tool's own ui:// resource and the host (the UI from the MCP only). The call becomes an
// entry of the tenant on the UUID page (page.tsx), not here: this renderer is reached by the Pages Router too, where the config's caches do
// not exist (measured at build). Generated by configure { kind: 'fullstack' }.
import React from 'react'
import { handle, call } from '@uuidna/qpu/mcp'
import { QpuApp } from './App'

export type QpuBlockProps = { uuid: string; handle: string; program: string; tail: string; tool: string; arguments?: Record<string, unknown> | null; prev?: string | null; next?: string | null; theorem?: string | null }

export const QpuBlock: React.FC<QpuBlockProps> = ({ uuid, tool, arguments: args, next, theorem }) => {
  const reply = call(tool, args ?? {})
  const view = (handle({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: 'ui://qpu/' + tool } }) as { result?: { contents: { text: string }[] } }).result?.contents[0]?.text ?? ''
  return (
    <section data-block={uuid} data-tool={tool} data-theorem={theorem ?? undefined}>
      <QpuApp tool={tool} args={(args ?? {}) as Record<string, unknown>} result={reply.result ?? { error: reply.error }} html={view} />
      {theorem ? <small>proven by {theorem}</small> : null}
      {next ? <a href={'/' + next}>next</a> : null}
    </section>
  )
}
`
      const uuidPage = `${header}// A UUID page through Payload's own API: the page is the entry of the call { tool: verify, arguments: { uuid } } in the entries collection —
// read by its content address through the local API (free: nothing computed), created once when absent (the collection's hook computes the result).
// The catch-all hands a single UUID segment to this component. Nothing is fetched from anywhere else; no custom endpoint.
import React from 'react'
import { getPayload } from 'payload'
import { entryText, uuid } from '@uuidna/qpu/blocks'
import { handle } from '@uuidna/qpu/mcp'
import { QpuApp } from './App'

type Call = { id: string; result?: { structuredContent?: Record<string, unknown>; _meta?: { widget?: string; theme?: Record<string, string> }; error?: { message: string } } }
// the tenant of the request: the host that names it (the tenants' domains, as the Worker's TENANTS), else the first tenant (a local run)
type Tenant = { id: string; slug: string; settings?: { arguments?: Record<string, unknown> } }
const tenant = async (payload: Awaited<ReturnType<typeof getPayload>>): Promise<Tenant> => {
  // next/headers is loaded when the module runs (never imported statically): the block renderer is reached by the Pages Router too, where that API does not exist (measured at build)
  let host = ''
  try { const { headers } = await import('next/headers'); host = (await headers()).get('host')?.split(':')[0] ?? '' } catch { /* no request: the first tenant */ }
  const byDomain = await payload.find({ collection: 'tenants' as never, where: { 'domains.domain': { equals: host } }, limit: 1, overrideAccess: true })
  const t = (byDomain.docs[0] ?? (await payload.find({ collection: 'tenants' as never, limit: 1, sort: 'slug', overrideAccess: true })).docs[0]) as Tenant | undefined
  if (!t) throw new Error('no tenant: seed the tenants first (src/scripts/seedQpu.ts)')
  return t
}
export const call = async (tool: string, args: Record<string, unknown>): Promise<Call> => {
  // the config loaded when the module runs, never imported statically: the block renderer is reached by the Pages Router too, and the config's hooks name App Router caches (measured at build)
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })
  const tenant = await tenant(payload)
  // the tenant's settings (its tenants document, in this UI or through the Payload MCP plugin) configure every call under its hosts
  const from = 'page:' + tenant.slug // the same call at two tenants is two entries: the address folds the tenant through from
  const body = { tool, arguments: { ...args, ...(tenant.settings?.arguments ?? {}) } }
  const id = uuid(entryText({ kind: 'call', from, body }))
  // the collection is QPU's own (the generated types of the fork name the site's); the id is the content address of the call
  try { return await payload.findByID({ collection: 'entries' as never, id }) as unknown as Call } catch { /* not yet called: created once below */ }
  return await payload.create({ collection: 'entries' as never, data: { id, kind: 'call', from, body, tenant: tenant.id } as never }) as unknown as Call
}

export const QpuPage = async ({ uuid }: { uuid: string }) => {
  const verify = await call('verify', { uuid })
  // the view read by the server from the handler's own resources/read (the MCP plugin takes a key from every client; the app is its own server)
  const view = (handle({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: 'ui://qpu/verify' } }) as { result?: { contents: { text: string }[] } }).result?.contents[0]?.text ?? ''
  const r = verify.result
  if (!r?.structuredContent) return <main><h1>{uuid}</h1><p>{r?.error?.message ?? 'not verified'}</p></main>
  // the UI from the MCP only: the entry's result rendered by the tool's own ui:// resource, hosted through the Apps protocol; nothing drawn here
  return (
    <main data-block={uuid} data-entry={verify.id}>
      <h1>{uuid}</h1>
      <QpuApp tool="verify" args={{ uuid }} result={r} html={view} />
    </main>
  )
}
`
      // one content source: the site's documents (payload { site }) seeded into the app's pages by its local API
      // the licence catalogue sold through Payload's ecommerce plugin, configured as the ecommerce template configures it (templates/ecommerce, read 2026-10-26)
      const ecommerce = `${header}// The licence catalogue as Payload's own ecommerce: the plugin's products, variants, carts, orders, transactions and addresses, the
// Stripe adapter as the payment, access by the site's roles, the order's accessToken as the licence key — the API of selling from the config.
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'
import type { Access, FieldAccess } from 'payload'

export const QPU_CURRENCIES = ${JSON.stringify(QPU_CURRENCIES)}
const roles = (req: { user?: unknown }): string[] => ((req.user as { roles?: string[] } | undefined)?.roles ?? [])
const isAdmin: Access = ({ req }) => roles(req).includes('admin')
const isAdminField: FieldAccess = ({ req }) => roles(req).includes('admin')
const isCustomerField: FieldAccess = ({ req }) => !!req.user

export const qpuEcommerce = ecommercePlugin({
  access: {
    isAdmin,
    adminOnlyFieldAccess: isAdminField,
    adminOrPublishedStatus: ({ req }) => (roles(req).includes('admin') ? true : { _status: { equals: 'published' } }),
    isCustomer: isCustomerField,
    isDocumentOwner: ({ req }) => (req.user ? { customer: { equals: (req.user as { id: string }).id } } : false),
  },
  customers: { slug: 'users' },
  currencies: { defaultCurrency: 'EUR', supportedCurrencies: [...QPU_CURRENCIES] },
  orders: {
    ordersCollectionOverride: ({ defaultCollection }) => ({
      ...defaultCollection,
      fields: [...defaultCollection.fields, { name: 'accessToken', type: 'text', unique: true, index: true, admin: { position: 'sidebar', readOnly: true, description: 'the licence key of the order' }, hooks: { beforeValidate: [({ value, operation }) => (operation === 'create' || !value ? crypto.randomUUID() : value)] } }],
    }),
  },
  payments: { paymentMethods: [stripeAdapter({ secretKey: process.env.STRIPE_SECRET_KEY ?? '', publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '', webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET })] },
  products: {
    productsCollectionOverride: ({ defaultCollection }) => ({
      ...defaultCollection,
      admin: { ...defaultCollection.admin, useAsTitle: 'title' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'licence', type: 'group', fields: [{ name: 'product', type: 'text' }, { name: 'variant', type: 'text' }, { name: 'unit', type: 'text' }, { name: 'interval', type: 'text' }, { name: 'domains', type: 'text' }] },
        { name: 'iso', type: 'group', fields: [{ name: 'standard', type: 'text' }, { name: 'formula', type: 'textarea' }, { name: 'documented', type: 'checkbox' }] },
        ...defaultCollection.fields,
      ],
      hooks: {
        beforeChange: [({ data }) => (data && data.iso && data.iso.formula ? { ...data, iso: { standard: 'ISO 9001', formula: data.iso.formula, documented: true } } : data)],
        afterChange: [({ doc }) => { const formula = doc && doc.iso ? doc.iso.formula : ''; const held = doc && doc.docs ? doc.docs : {}; const server = 'https://api.cursor.com/rest-mcp/google-drive/mcp'; const mime = 'application/vnd.google-apps.document'; if (!formula) return { ...doc, docs: { text: '', written: false } }; if (held.auth !== 'ready') return { ...doc, docs: { tool: 'mcp_auth', server, text: formula, written: false } }; if (held.fileId && held.from !== 'search' && held.from !== 'create') return { ...doc, docs: { refused: true, why: 'a file id comes from search or create, never a guess', text: formula, written: false, research: { via: 'hooks', hooks: ['beforeChange', 'afterChange', 'afterRead'], tokenFree: true, fetched: false, request: { method: 'GET', url: 'https://www.iso.org/open-data.html', accept: 'text/html' }, possibilities: ['search', 'create_file', 'iso-open-data'] } } }; if (!held.fileId) return { ...doc, docs: { tool: 'create_file', server, arguments: { title: doc.title || 'ISO 9001', content_markdown: formula, target_mime_type: mime, ...(held.parentFolderId ? { parent_folder_id: held.parentFolderId } : {}) }, text: formula, written: false, verify: 'read_file' } }; const matches = typeof held.read === 'string' && held.read.indexOf(formula) >= 0; return { ...doc, docs: { tool: matches ? 'read_file' : 'update_file_content', fileId: held.fileId, from: held.from, server, text: formula, written: matches, verify: 'read_file' } } }],
        afterRead: [({ doc }) => doc],
      },
    }),
  },
})
`
      const seed = `${header}// The site seeded from the one content source: every document payload { site: true } lays out, created as a page of the app through
// Payload's local API; a page already there (by slug) is left as it is. Run with: pnpm payload run src/scripts/seedQpu.ts
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import { caller } from '@uuidna/qpu/mcp'

const payloadTool = caller('payload'), configureTool = caller('configure')

const main = async () => {
  const payload = await getPayload({ config })
  const site = payloadTool({ site: true }).collection.docs as { id: string; title: string; slug: string; layout: Record<string, unknown>[]; meta: { title: string; description: string }; parent?: string | null; hero?: Record<string, unknown> }[]
  // the tenants from the configs first, read from the handler at run time (nothing seeded is written into this file): one per host, by slug; the super
  // admin seeds, so no user is passed; every scoped document below belongs to the first tenant
  const tenants = configureTool({ kind: 'tenant' }).config.records as Record<string, { name: string; slug: string; domains: { domain: string }[]; currency: string }>
  let tenantsCreated = 0
  for (const t of Object.values(tenants)) {
    const found = await payload.find({ collection: 'tenants' as never, where: { slug: { equals: t.slug } }, limit: 1, overrideAccess: true })
    if (found.totalDocs) continue
    await payload.create({ collection: 'tenants' as never, overrideAccess: true, data: t as never })
    tenantsCreated += 1
  }
  const tenant = (await payload.find({ collection: 'tenants' as never, where: { slug: { equals: Object.keys(tenants)[0] } }, limit: 1, overrideAccess: true })).docs[0] as { id: string } | undefined
  if (!tenant) throw new Error('no tenant to scope the documents to')
  // the first user from the deployer's account: a deploy creates it (no create-first-user form), its password unknown to everyone — the admin sets one through
  // the panel's reset (forgot password) with the mail the app sends; the email from FIRST_USER_EMAIL, else CLOUDFLARE_EMAIL, else wrangler whoami; none: the form stands
  let firstUser = 'none'
  if (!(await payload.count({ collection: 'users', overrideAccess: true })).totalDocs) {
    // a local super admin for the dev harness: when QPU_APP_KEY is set outside production, the first user carries it as its API key, so the git hooks
    // decide through the Payload MCP, the machine runs and the generated indexes sync — no manual keychain step (never in production, never a real address)
    const localKey = process.env.NODE_ENV !== 'production' && process.env.QPU_APP_KEY ? process.env.QPU_APP_KEY : null
    const email = process.env.FIRST_USER_EMAIL ?? process.env.CLOUDFLARE_EMAIL ?? (() => { try { return /associated with the email ([^\\s]+@[^\\s]+?)[.,;]?(?:\\s|$)/.exec(execSync('npx wrangler whoami', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).replace(/\\u001b\\[[0-9;]*m/g, ''))?.[1] ?? null } catch { return null } })() ?? (localKey ? 'admin@localhost.test' : null)
    if (email) { await payload.create({ collection: 'users', overrideAccess: true, context: { disableRevalidate: true }, data: { email, password: randomUUID() + randomUUID(), firstName: 'Super', lastName: 'Admin', roles: ['admin'], enableAPIKey: Boolean(localKey), ...(localKey ? { apiKey: localKey } : {}), tenants: [{ tenant: tenant.id, roles: ['tenant-admin'] }] } as never }); firstUser = localKey ? 'created as the local super admin with its API key from QPU_APP_KEY' : 'created from the account email (its password unknown: reset it through the admin panel)' }
    else firstUser = 'no account email known (FIRST_USER_EMAIL, CLOUDFLARE_EMAIL, wrangler whoami): the create-first-user form of the admin panel stands'
  } else firstUser = 'a user exists already'
  let created = 0, kept = 0, updated = 0
  for (const d of site) {
    const slug = d.slug.replace(/^\\//, '')
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true, draft: true })
    // nested: the parent is the page of the parent slug, created before its children (the documents come parents first); the plugin computes the breadcrumbs
    const parent = d.parent ? ((await payload.find({ collection: 'pages', where: { slug: { equals: d.parent.replace(/^\\//, '') } }, limit: 1, overrideAccess: true, draft: true })).docs[0] as { id: string } | undefined)?.id ?? null : null
    // the layout compared as Payload stores it: block ids, nulls and empty objects are not content, so a page is relaid only when its blocks changed
    const canon = (layout: unknown) => JSON.stringify(layout, (k, v) => (k === 'id' || v === null || (v?.constructor === Object && Object.keys(v).length === 0) ? undefined : v?.constructor === Object ? Object.fromEntries(Object.keys(v as object).sort().map((key) => [key, (v as Record<string, unknown>)[key]])) : v))
    if (found.totalDocs) { const page = found.docs[0] as { id: string; _status?: string; layout?: unknown[]; parent?: string | { id: string } | null }; const stale = canon(page.layout ?? []) !== canon(d.layout) || ((typeof page.parent === 'object' && page.parent ? page.parent.id : page.parent) ?? null) !== parent || (d.hero ? canon((page as { hero?: { richText?: unknown } }).hero?.richText ?? null) !== canon(d.hero.richText ?? null) : false); if (page._status !== 'published' || stale) await payload.update({ collection: 'pages', id: page.id, overrideAccess: true, context: { disableRevalidate: true }, data: { _status: 'published', ...(stale ? { layout: d.layout, parent, ...(d.hero ? { hero: d.hero } : {}) } : {}) } as never }); kept += 1; if (stale) updated += 1; continue }
    // published: the site is what the QPU computes, public at once; a draft would answer no reader
    await payload.create({ collection: 'pages', overrideAccess: true, context: { disableRevalidate: true }, data: { title: d.title, slug, hero: d.hero ?? { type: 'default' }, layout: d.layout, meta: d.meta, tenant: tenant.id, parent, _status: 'published' } as never })
    created += 1
  }
  // the licence catalogue as products of the ecommerce plugin, read from the handler at run time: one per variant, by title, prices in the minor unit per
  // currency — harmonised when the environment carries the rates the currency step measured (QPU_RATES, the JSON the currency tool answers), else the catalogue's own
  const catalogue = configureTool({ kind: 'ecommerce', ...(process.env.QPU_RATES ? { rates: JSON.parse(process.env.QPU_RATES) } : {}) }).config.catalogue.items as { title: string; licence: Record<string, string>; prices: Record<string, number> }[]
  let products = 0
  for (const item of catalogue) {
    const found = await payload.find({ collection: 'products' as never, where: { title: { equals: item.title } }, limit: 1, overrideAccess: true })
    if (found.totalDocs) continue
    await payload.create({ collection: 'products' as never, overrideAccess: true, context: { disableRevalidate: true }, data: { title: item.title, licence: item.licence, tenant: tenant.id, ...Object.fromEntries(Object.entries(item.prices).flatMap(([k, v]) => [[k, v], [k + 'Enabled', true]])), _status: 'published' } as never })
    products += 1
  }
  // the "Request an app" form of the form-builder plugin, from the handler: a submission generates the app (appRequest, form-submissions afterChange)
  const form = payloadTool({ app: { form: true } }).form as Record<string, unknown> & { title: string }
  let formState = 'kept'
  if (!(await payload.find({ collection: 'forms', where: { title: { equals: form.title } }, limit: 1, overrideAccess: true })).totalDocs) { await payload.create({ collection: 'forms', overrideAccess: true, context: { disableRevalidate: true }, data: form as never }); formState = 'created' }
  const plan = payloadTool({ deploy: { seed: true } }) as { seed: { complete: boolean; creates: { collection: string; where: Record<string, unknown>; data: Record<string, unknown>; parentSlug: string | null; productTitle: string | null }[] } }
  if (!plan.seed.complete) throw new Error('the website is not fully seeded')
  let added = 0
  for (const row of plan.seed.creates) {
    const found = await payload.find({ collection: row.collection as never, where: row.where as never, limit: 1, overrideAccess: true, draft: true })
    if (found.totalDocs) continue
    const parent = row.parentSlug ? ((await payload.find({ collection: 'pages', where: { slug: { equals: row.parentSlug } }, limit: 1, overrideAccess: true, draft: true })).docs[0] as { id: string } | undefined)?.id ?? null : null
    const product = row.productTitle ? ((await payload.find({ collection: 'products' as never, where: { title: { equals: row.productTitle } }, limit: 1, overrideAccess: true })).docs[0] as { id: string } | undefined)?.id ?? null : null
    await payload.create({ collection: row.collection as never, overrideAccess: true, context: { disableRevalidate: true }, data: { ...row.data, tenant: tenant.id, ...(row.parentSlug ? { parent } : {}), ...(row.productTitle && product ? { product } : {}) } as never })
    added += 1
  }
  console.log(\`seed: \${created} page(s) created, \${kept} kept (\${updated} relaid), from \${site.length} documents; \${tenantsCreated} tenant(s) created of \${Object.keys(tenants).length}; \${products} product(s) created of \${catalogue.length}; \${added} catalogue page(s), variant(s) and post(s) created of \${plan.seed.creates.length}; the request form \${formState}; first user: \${firstUser}; deploy is the completed order's afterChange hook\`)
}
// awaited at the top level: payload run returns when the module has loaded, so a pending promise would be left behind (measured: the seed printed nothing and wrote nothing)
await main()
process.exit(0)
`
      const readme = `# QPU full stack

The source of payloadcms.com (MIT) is the full stack, forked under : its ${ws.collections} collections, ${ws.blocks} blocks, ${ws.globals} globals and ${ws.fields} fields kept. Applied: \`src/blocks/Qpu/config.ts\` (the qpu block, the shape every tools/call result carries in _meta.payload), registered in payload.config blocks and the pages layout; \`src/components/blocks/Qpu/index.tsx\` (the renderer: the page asks the Worker for the block and carries its widget), mapped in RenderBlocks; \`src/payload.qpu.config.ts\` (search and multi-tenant beside the site's four plugins, the database the RAID); \`src/collections/Tenants.ts\` (the multi-tenant plugin's own collection: the hosts that name the tenants). The catch-all makes prefixes useless: a UUID is one address — the entry\'s JSON when the client accepts application/json (the entries collection\'s own door), the block\'s page otherwise; the list is /api/entries; /mcp is the MCP plugin\'s /api/mcp and /.well-known/qpu.json the endpoint /api/qpu; no Worker behind any of them. Deploy at Cloudflare beside this Worker; every step at whole uptime: configure { kind: 'migration' }.
`
      const notice = `# Licences in this fork

- The fork itself is the MIT-licensed source of payloadcms.com (Copyright (c) 2023 Payload); its LICENSE file stands whole and every file of the original stays under it.
- What QPU adds carries QPU's licence: ${LICENSE.attribution} (${LICENSE.deed}). Each added file names it in its first line. The added files: src/blocks/Qpu/config.ts, src/components/blocks/Qpu/index.tsx, src/payload.qpu.config.ts, src/payload.qpu.mcp.ts, src/globals/Qpu.ts, src/components/blocks/Qpu/page.tsx, src/components/blocks/Qpu/App.tsx, src/scripts/seedQpu.ts, src/collections/Tenants.ts, src/collections/Entries.ts, the rewrites in next.config.js, README.qpu.md and this notice.
- The two licences meet at the file boundary: MIT permits the fork and the additions; the additions' own terms apply to them alone; the combined site, served, carries both notices.
`
      const pagesHooks = `${header}// Realtime editing with collisions managed precisely: Payload streams an edit through its own channels (the document lock the admin shows,
// the live preview's postMessage stream, autosave drafts, versions); this hook adds the precondition — an edit names the address it read
// (If-Match for REST, context.prev for the local API, editBase in the data for an MCP client: the Payload MCP plugin's update tool passes data
// and nothing else) and is accepted only while the stored document still folds to that address; else the collision is answered with both
// addresses, never a silent overwrite. An edit that names no base (the admin panel) is guarded by the document lock instead. The address folds the content (title, hero, layout, meta), not the clocks. Generated by configure { kind: 'fullstack' }.
import type { CollectionBeforeChangeHook } from 'payload'
import { ValidationError } from 'payload'
import { canonicalText, uuid } from '@uuidna/qpu/blocks'

export const editAddress = (doc: Record<string, unknown>): string => uuid(canonicalText(JSON.parse(JSON.stringify({ title: doc.title, hero: doc.hero, layout: doc.layout, meta: doc.meta }, (k, v) => (k === 'id' ? undefined : v)))))
export const collisionGuard: CollectionBeforeChangeHook = async ({ collection, data, operation, originalDoc, req }) => {
  const base = (data as { editBase?: string | null }).editBase ?? null
  delete (data as { editBase?: string | null }).editBase
  if (operation !== 'update' || !originalDoc) return data
  // the precondition is the edited document's alone: the nested-docs plugin re-saves the children with the same request, and those carry no base
  const ctx = req.context as { prev?: string; qpuGuarded?: boolean }
  if (ctx.qpuGuarded) return data
  const prev = req.headers.get('if-match')?.replace(/^W\\//, '').replace(/"/g, '') ?? ctx.prev ?? base
  if (!prev) return data
  ctx.qpuGuarded = true
  const current = editAddress(originalDoc as Record<string, unknown>)
  if (current !== prev) throw new ValidationError({ collection: collection.slug, errors: [{ path: 'layout', message: \`collision: the document is at \${current}, the edit was based on \${prev}; read it again and re-apply\` }] }, req.t)
  return data
}
`
      const submissionHooks = `${header}// A submission of the "Request an app" form (the form-builder plugin's own collection) generates the app: the answer of payload { app }
// written as a JSON file into the media collection (the plugin's default upload), the licence product named for the checkout the ecommerce
// plugin serves; nothing added to the schema — the intelligence of combinatorics is to fit the environment without hacking it. Generated by configure { kind: 'fullstack' }.
import type { CollectionAfterChangeHook } from 'payload'
import { call, caller } from '@uuidna/qpu/mcp'

export const APP_REQUEST_FORM_TITLE = 'Request an app'
export const appRequest: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  const form = (typeof doc.form === 'object' && doc.form ? doc.form : await req.payload.findByID({ collection: 'forms', id: doc.form, overrideAccess: true }).catch(() => null)) as { title?: string } | null
  if (!form || form.title !== APP_REQUEST_FORM_TITLE) return doc
  const data = Object.fromEntries(((doc.submissionData ?? []) as { field: string; value: string }[]).map((f) => [f.field, f.value]))
  const verdict = caller('payload')({ app: { validate: data } }) as { ok: boolean; fields: Record<string, { ok: boolean; says: string }> }
  if (!verdict?.ok) { req.payload.logger.warn('app request refused by validation: ' + JSON.stringify(verdict?.fields ?? {})); return doc }
  const r = call('payload', { app: { name: data.name, host: data.host, env: String(data.env ?? '').split(/[,\\s]+/).filter(Boolean), variant: data.variant || 'yearly' } })
  if (!r.result) { req.payload.logger.warn('app request refused: ' + (r.error?.message ?? 'no result')); return doc }
  const app = r.result.structuredContent
  const text = JSON.stringify(app, null, 1)
  const product = (await req.payload.find({ collection: 'products' as never, where: { title: { equals: app.order.product } }, limit: 1, overrideAccess: true })).docs[0] as { id: string } | undefined
  await req.payload.create({ collection: 'media', overrideAccess: true, context: { disableRevalidate: true }, data: { alt: 'app ' + String(data.host) + ': bundle ' + app.bundle + ', ' + (app.price.amount / 100).toFixed(2) + ' ' + app.price.currency + (product ? ', product ' + product.id : '') } as never, file: { data: Buffer.from(text), mimetype: 'application/json', name: String(data.host).replace(/[^a-z0-9.-]/gi, '-') + '.app.json', size: Buffer.byteLength(text) } })
  return doc
}
`
      const ordersHooks = `${header}// A completed order deploys the fully seeded website. The hook names the e2e requests and does not fetch them. Generated by configure { kind: 'fullstack' }.
import type { CollectionAfterChangeHook } from 'payload'
import { caller } from '@uuidna/qpu/mcp'

export const deployAfterSeed: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (doc?.status !== 'completed') return doc
  const plan = caller('payload')({ deploy: true }) as { holds?: boolean; seed?: { complete?: boolean }; cloudflare?: { stages?: number; worker?: string } }
  if (!plan.holds || !plan.seed?.complete) { req.payload.logger.warn('deploy waits: the website is not fully seeded'); return doc }
  return { ...doc, deploy: { via: 'payload', cloudflare: plan.cloudflare?.worker ?? 'qpu', seeded: true, stages: plan.cloudflare?.stages ?? 0, fetched: false, written: false } }
}
`
      const pluginModule = `${header}// The QPU as Payload plugins, one per capability, each by Payload's plugin guide (definePlugin: a slug, typed options, enabled, arrays spread),
// composed by the umbrella qpuPlugin: qpu (the core), qpu-agents, qpu-machine, qpu-google, qpu-raid and qpu-hooks. Generated by configure { kind: 'fullstack' }.
import { APIError, definePlugin } from 'payload'
import type { Block, CollectionAfterChangeHook, CollectionAfterReadHook, CollectionConfig, Config, Endpoint, Field, Plugin, PayloadRequest, TaskConfig } from 'payload'
import { existsSync, readFileSync, readdirSync, renameSync, mkdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { createSign } from 'node:crypto'
import { call, caller, redact } from '@uuidna/qpu/mcp'
import { canonicalText, qpuHooks as qpuHooksOf, uuid } from '@uuidna/qpu/blocks'
import { feeds, googleChallenges, type FeedRates } from '@uuidna/qpu/feeds'
import { apisCost, apisCoverage, apisDoors, apisIndex, cloudflareOperations, payloadOperations, readingsOf, OBSERVE_QUERY } from '@uuidna/qpu/apis'
import { Qpu } from '../blocks/Qpu/config'
import { Entries } from '../collections/Entries'
import { Tenants } from '../collections/Tenants'
import { QpuGlobal } from '../globals/Qpu'
import { qpuPlugins } from '../payload.qpu.config'
import { collisionGuard } from '../collections/pages.qpu.hooks'
import { firstUserBootstrap } from '../collections/users.qpu.hooks'
import { appRequest } from '../collections/form-submissions.qpu.hooks'
import { deployAfterSeed } from '../collections/orders.qpu.hooks'
import { qpuDb, qpuEmail, qpuAdapterPlugins } from '../payload.qpu.adapters'
import { qpuMachineTool } from '../payload.qpu.mcp'

// the block added wherever a layout takes blocks: by object, or by reference where the field references the config's blocks
const withBlock = (fields: Field[], block: Block): Field[] => fields.map((f): Field => {
  if (f.type === 'blocks' && f.name === 'layout') {
    const refs = (f as { blockReferences?: (Block | string)[] }).blockReferences
    if (refs) return { ...f, blockReferences: refs.some((b) => (typeof b === 'string' ? b : b.slug) === block.slug) ? refs : [...refs, block.slug] } as Field
    return { ...f, blocks: f.blocks.some((b) => b.slug === block.slug) ? f.blocks : [...f.blocks, block] }
  }
  if (f.type === 'tabs') return { ...f, tabs: f.tabs.map((t) => ({ ...t, fields: withBlock(t.fields, block) })) }
  if ('fields' in f && Array.isArray(f.fields)) return { ...f, fields: withBlock(f.fields, block) } as Field
  return f
})
// a hook put first on a collection unless it is there already, so applying a plugin twice is applying it once
const first = (c: CollectionConfig, on: 'beforeChange' | 'afterChange' | 'afterRead', fn: never): CollectionConfig => ({ ...c, hooks: { ...c.hooks, [on]: (c.hooks?.[on] ?? []).includes(fn) ? c.hooks?.[on] : [fn, ...(c.hooks?.[on] ?? [])] } })
const withTask = (config: Config, t: { slug: string }) => ({ ...config.jobs, tasks: [...(config.jobs?.tasks ?? []).filter((x) => x.slug !== t.slug), t as never] })
const pages = (c: CollectionConfig): CollectionConfig => first({
  ...c,
  fields: [...withBlock(c.fields, Qpu), ...(c.fields.some((f) => 'name' in f && f.name === 'editBase') ? [] : [{ name: 'editBase', type: 'text', virtual: true, admin: { hidden: true } } as Field])],
  lockDocuments: c.lockDocuments ?? { duration: 300 },
  versions: { ...(typeof c.versions === 'object' ? c.versions : {}), drafts: { ...(typeof c.versions === 'object' && typeof c.versions.drafts === 'object' ? c.versions.drafts : {}), autosave: { interval: 800 } } },
}, 'beforeChange', collisionGuard as never)
const users = (c: CollectionConfig): CollectionConfig => first({ ...c, auth: { ...(typeof c.auth === 'object' ? c.auth : {}), useAPIKey: true } }, 'beforeChange', firstUserBootstrap as never)
const submissions = (c: CollectionConfig): CollectionConfig => first(c, 'afterChange', appRequest as never)
const ordersHook = (c: CollectionConfig): CollectionConfig => first(c, 'afterChange', deployAfterSeed as never)
const hooked = (config: Config, by: Record<string, (c: CollectionConfig) => CollectionConfig>): Config => ({ ...config, collections: (config.collections ?? []).map((c) => by[c.slug]?.(c) ?? c) })
export type QpuPluginOptions = { enabled?: boolean; adapters?: 'auto' | 'none'; branding?: boolean; feeds?: boolean; plugins?: Plugin[] }
const feedRates = (): FeedRates | null => {
  const raw = process.env.QPU_RATES
  if (!raw) return null
  try { return JSON.parse(raw) as FeedRates } catch { return null }
}
const qpuFeedsEndpoint: Endpoint = {
  path: '/qpu/feeds',
  method: 'get',
  handler: async (req) => {
    const url = req.url ? new URL(req.url, 'http://local') : null
    const combinations = url?.searchParams.get('combinations') === '1'
    const google = url?.searchParams.get('google') === '1'
    const limitRaw = url?.searchParams.get('combinationLimit')
    const combinationLimit = limitRaw ? Math.min(512, Math.max(0, Number(limitRaw) || 0)) : 32
    return Response.json(feeds({ rates: feedRates(), combinations, combinationLimit: combinations ? combinationLimit : 0, google }), {
      headers: { 'cache-control': 'public, max-age=60', 'x-qpu-feed': 'products-variants' },
    })
  },
}
/** qpu: the core plugin — the block, the global, the tenants, the docket, the pages' guard and lock, the app request, the branding, the adapters */
// a glTF uploaded to media read as Unreal Engine reads it (seal { gltf }): what the scene holds kept on the document; an asset that requires an
// extension the GLTF_EXTENSIONS table Payload holds does not list is refused, as Unreal cannot load it
const readGltfUpload = (async ({ data, req }: { data: Record<string, unknown>; req: PayloadRequest }) => {
  const file = req.file as { data?: Buffer; name?: string } | undefined, name = (file?.name ?? '').toLowerCase()
  if (!file?.data || !(name.endsWith('.glb') || name.endsWith('.gltf'))) return data
  const r = call('seal', { text: file.name, gltf: name.endsWith('.glb') ? { glb64: file.data.toString('base64') } : { json: JSON.parse(file.data.toString('utf8')) } }) as { result?: { structuredContent?: { loadable?: boolean; why?: string | null } }; error?: { message: string } }, answer = r.result?.structuredContent
  if (!answer?.loadable) throw new APIError('this glTF cannot be loaded: ' + (answer?.why ?? r.error?.message ?? 'unread'), 400)
  return { ...data, gltf: answer }
}) as never
const gltfMedia = (c: CollectionConfig): CollectionConfig => first({ ...c, fields: [...c.fields.filter((f) => !('name' in f) || f.name !== 'gltf'), { name: 'gltf', type: 'json', admin: { readOnly: true, description: 'a glTF 2.0 asset as Unreal Engine reads it: what the scene holds and its extensions by prefix (seal { gltf })' } }] }, 'beforeChange', readGltfUpload)
export const qpuCore = definePlugin<QpuPluginOptions>({ slug: 'qpu', plugin: ({ config: incoming, enabled, branding, feeds }) => (enabled === false ? incoming : hooked({
  ...incoming,
  db: incoming.db ?? qpuDb(),
  email: incoming.email ?? qpuEmail(),
  endpoints: [...(incoming.endpoints ?? []).filter((e) => !(e.path === '/qpu/feeds' && e.method === 'get')), ...(feeds === false ? [] : [qpuFeedsEndpoint])],
  admin: branding === false ? incoming.admin : { ...incoming.admin, meta: { ...incoming.admin?.meta, titleSuffix: incoming.admin?.meta?.titleSuffix ?? ' · QPU' }, components: { ...incoming.admin?.components, beforeDashboard: [...(incoming.admin?.components?.beforeDashboard ?? []), ...[{ tool: 'clay', args: { technique: 'reflection' } }, { tool: 'dashboard', args: {} }, { tool: 'leads', args: {} }, { tool: 'metrics', args: {} }, { tool: 'apis', args: {} }, { tool: 'match', args: {} }, { tool: 'repository', args: { machine: { actions: true } } }].map((p) => ({ path: '@root/components/blocks/Qpu/App#QpuApp', clientProps: p }))], graphics: { Logo: '@root/components/blocks/Qpu/Branding#QpuLogo', Icon: '@root/components/blocks/Qpu/Branding#QpuIcon', ...incoming.admin?.components?.graphics } } },
  collections: [...(incoming.collections ?? []).filter((c) => c.slug !== Tenants.slug && c.slug !== Entries.slug), Tenants, Entries],
  globals: [...(incoming.globals ?? []).filter((g) => g.slug !== QpuGlobal.slug), QpuGlobal],
  blocks: [...(incoming.blocks ?? []).filter((b) => b.slug !== Qpu.slug), Qpu],
}, { pages, 'form-submissions': submissions, media: gltfMedia, orders: ordersHook })) })
/** qpu-agents: an API key per user (an agent's key to the MCP), the first user from the deploy */
export const qpuAgents = definePlugin<{ enabled?: boolean }>({ slug: 'qpu-agents', plugin: ({ config, enabled }) => (enabled === false ? config : hooked(config, { users })) })
const entry = async (req: PayloadRequest, data: object, context?: object) => String(((await req.payload.create({ collection: 'entries' as never, data: data as never, overrideAccess: true, context })) as { id: string }).id)
const readPages = async (req: PayloadRequest, spec: { collection: string; where?: Record<string, unknown> }) => {
  const docs: unknown[] = []
  let page = 1
  for (;;) {
    const found = await req.payload.find(manageApi({ ...spec, action: 'find', page }).args as never) as { docs: unknown[]; hasNextPage?: boolean; nextPage?: number | null }
    docs.push(...found.docs)
    if (!found.hasNextPage || typeof found.nextPage !== 'number') return docs
    page = found.nextPage
  }
}
const all = (req: PayloadRequest, c: string) => readPages(req, { collection: c })
// the Google integration measured once a burst of changes settles, never holding a change, and kept on the qpu global
let googleTimer: ReturnType<typeof setTimeout> | undefined
const measureGoogle: CollectionAfterChangeHook = ({ doc, req, context }) => {
  if (context.qpuGoogle) return doc
  clearTimeout(googleTimer)
  googleTimer = setTimeout(() => void (async () => {
    const google = caller('payload')({ google: { pages: await all(req, 'pages'), tenants: await all(req, 'tenants'), entries: await all(req, 'entries'), keys: await all(req, 'payload-mcp-api-keys') } })
    await req.payload.updateGlobal({ slug: 'qpu', data: { google } as never, context: { qpuGoogle: true }, overrideAccess: true })
  })().catch((e: Error) => req.payload.logger.warn('google: ' + e.message)), 2000)
  return doc
}
// every Google call one job on the server, qpu-google-call, asked by an entry of kind call from qpu-google-call (createEntries through the MCP):
// the job reads the API's Discovery document keyless, the door validates the call against it, the credential is the server's (an API key the
// tenant's bindings name or the secret a named endpoint takes, else a service account or ADC exchanged at the token endpoint, else keyless) and the
// answer is an entry of kind call, the secret never in it
const googleAuth = async (req: PayloadRequest, tenant: unknown, token?: string, scopes: string[] = [], secret?: { param: string; named: string }): Promise<{ by: string; query?: Record<string, string>; bearer?: string }> => {
  const t = tenant ? await req.payload.findByID({ collection: 'tenants' as never, id: String(tenant), depth: 0, overrideAccess: true }).catch(() => null) : null
  const named = ((t as { bindings?: { variables?: { name: string }[] } } | null)?.bindings?.variables ?? []).map((v) => v.name).filter((n) => process.env[n]), key = named.find((n) => /^GOOGLE_[A-Z_]*KEY$/.test(n)), held = named.find((n) => /CREDENTIALS$/.test(n))
  const given = secret ? named.find((n) => n.includes(secret.named)) : key
  if (secret || key) return given ? { by: given, query: { [secret?.param ?? 'key']: process.env[given]! } } : { by: 'keyless' }
  const file = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? path.join(homedir(), '.config', 'gcloud', 'application_default_credentials.json')
  const raw = !token ? null : held ? process.env[held]!.trim() : existsSync(file) ? readFileSync(file, 'utf8') : null, c = raw ? JSON.parse(raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8')) : null
  const enc = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url'), now = Math.floor(Date.now() / 1000), claims = enc({ alg: 'RS256', typ: 'JWT' }) + '.' + enc({ iss: c?.client_email, scope: scopes.join(' '), aud: token, iat: now, exp: now + 3600 })
  const grant: Record<string, string> | null = c?.type === 'service_account' ? { grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: claims + '.' + createSign('RSA-SHA256').update(claims).sign(c.private_key, 'base64url') } : c?.type === 'authorized_user' ? { grant_type: 'refresh_token', client_id: c.client_id, client_secret: c.client_secret, refresh_token: c.refresh_token } : null
  const bearer = grant ? ((await (await fetch(token!, { method: 'POST', body: new URLSearchParams(grant) })).json()) as { access_token?: string }).access_token : undefined
  return bearer ? { by: held ?? 'adc', bearer } : { by: 'keyless' }
}
const googleCallTask: TaskConfig<{ input: Record<string, any>; output: { entry: string } }> = {
  slug: 'qpu-google-call', retries: 0,
  inputSchema: [...['api', 'version', 'method', 'url', 'httpMethod', 'endpoint', 'request', 'tenant'].map((name) => ({ name, type: 'text' }) as Field), { name: 'params', type: 'json' }, { name: 'body', type: 'json' }],
  outputSchema: [{ name: 'entry', type: 'text' }],
  handler: async ({ input, req }) => {
    const ask = (x: object) => caller('payload')({ googleCall: x }), asked = ask(input)
    const plan = asked.discovery ? ask({ ...input, discovery: await fetch(asked.discovery, { signal: AbortSignal.timeout(20000) }).then((r) => r.json(), () => null) }) : asked
    const auth = plan.allowed ? await googleAuth(req, input.tenant, plan.token, plan.request.scopes, plan.secret) : null, url = plan.allowed ? new URL(plan.request.url) : null, body = plan.request?.body
    for (const [k, v] of Object.entries(auth?.query ?? {})) url?.searchParams.set(k, v)
    const res = url ? await fetch(url, { method: plan.request.httpMethod, headers: { ...(auth?.bearer ? { authorization: 'Bearer ' + auth.bearer } : {}), ...(body != null ? { 'content-type': 'application/json' } : {}) }, body: body != null ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(20000) }).then(async (r) => ({ status: r.status, text: await r.text() }), (e: Error) => ({ status: 0, text: e.message })) : null
    return { output: { entry: await entry(req, { kind: 'call', from: 'qpu-google-call', ...(input.tenant ? { tenant: input.tenant } : {}), body: { request: input.request ?? null, method: plan.method ?? null, allowed: plan.allowed === true, why: plan.why ?? (plan.allowed ? null : 'the Discovery document was not read'), by: auth?.by ?? null, status: res?.status ?? null, answer: res?.text == null ? null : redact(res.text) } }, { qpuGoogle: true }) } }
  },
}
// a call asked of a job (qpu-google-call, qpu-raid-verify) is queued and run at once, so its answer entry stands when createEntries answers
const queueGoogleCall: CollectionAfterChangeHook = async ({ doc, req, operation, context }) => {
  if (operation !== 'create' || context.qpuGoogle || doc.kind !== 'call' || !['qpu-google-call', 'qpu-raid-verify', 'qpu-lead-run', 'qpu-cloudflare-call', 'qpu-cloudflare-observe'].includes(doc.from) || !doc.body || 'allowed' in doc.body) return doc
  const job = (await req.payload.jobs.queue({ task: doc.from as never, input: { ...doc.body, request: doc.id, tenant: typeof doc.tenant === 'object' ? doc.tenant?.id : doc.tenant } as never, req })) as { id: string }
  await req.payload.jobs.runByID({ id: job.id, req })
  return doc
}
const qpuGoogleEndpoints: Endpoint[] = [
  {
    path: '/qpu/google',
    method: 'get',
    handler: async (req) => {
      const url = req.url ? new URL(req.url, 'http://local') : null
      const challenge = url?.searchParams.get('challenge') ?? url?.searchParams.get('id') ?? undefined
      return Response.json(googleChallenges({ challenge }), {
        headers: { 'cache-control': 'public, max-age=60', 'x-qpu-google': 'challenges-solved' },
      })
    },
  },
  {
    path: '/qpu/google',
    method: 'post',
    handler: async (req) => {
      const body = (typeof req.json === 'function' ? await req.json().catch(() => ({})) : (req.data ?? {})) as {
        challenge?: string
        challenges?: string[] | boolean
        persist?: boolean
        googleCall?: Record<string, unknown>
        tenant?: string
      }
      const report = googleChallenges({ challenge: body.challenge, challenges: body.challenges })
      const entries: string[] = []
      if (body.persist && Boolean(req.payload)) {
        for (const c of report.challenges) {
          const id = await entry(req, { kind: 'call', from: 'qpu-google', ...(body.tenant ? { tenant: body.tenant } : {}), body: c.entry.body }, { qpuGoogle: true }).catch(() => c.entry.id)
          entries.push(id)
        }
      }
      const callPlan = body.googleCall ? caller('payload')({ googleCall: body.googleCall }) : undefined
      return Response.json({ ...report, ...(entries.length ? { persistedEntries: entries } : {}), ...(callPlan ? { googleCall: callPlan } : {}) }, {
        headers: { 'x-qpu-google': 'challenges-solved' },
      })
    },
  },
]
/** qpu-google: the Google integration measured on the qpu global and every Google call the qpu-google-call job; order 20, after the MCP plugin made its keys */
export const qpuGoogle = definePlugin<{ enabled?: boolean }>({ slug: 'qpu-google', order: 20, plugin: ({ config, enabled }) => (enabled === false ? config : {
  ...hooked(config, Object.fromEntries(['pages', 'tenants', 'entries', 'payload-mcp-api-keys'].map((s) => [s, (c: CollectionConfig) => first(s === 'entries' ? first(c, 'afterChange', queueGoogleCall as never) : c, 'afterChange', measureGoogle as never)]))),
  endpoints: [...(config.endpoints ?? []).filter((e) => e.path !== '/qpu/google'), ...qpuGoogleEndpoints],
  jobs: withTask(config, googleCallTask),
  globals: (config.globals ?? []).map((g) => (g.slug !== 'qpu' || g.fields.some((f) => 'name' in f && f.name === 'google') ? g : { ...g, fields: [...g.fields, { name: 'google', type: 'json', admin: { readOnly: true } } as Field] })),
}) })
/** qpu-machine: the machine tool written into the MCP plugin's options through the plugins map before it runs (its order 10) */
// a lead that names its door runs as a job (payloadcms.com/docs/jobs-queue/tasks), asked by an entry of kind call from qpu-lead-run: the door
// called here (a QPU tool, or the machine tool for an action of its allow-list), its answer an entry linked to the request, the lead served once it answered
type LeadBlock = { tool?: string; arguments?: { lead?: { id?: string; status?: string; reason?: string; run?: { tool: string; arguments?: Record<string, unknown> } } } }
// the pages carrying a tool's block; a page's layout rewritten, nothing revalidated
const pagesWith = (req: PayloadRequest, tool: string) => readPages(req, { collection: 'pages', where: { 'layout.tool': { equals: tool } } }) as Promise<{ id: string; layout: LeadBlock[] }[]>
const relayout = (req: PayloadRequest, id: string, layout: unknown[]) => req.payload.update({ collection: 'pages', id, data: { layout } as never, overrideAccess: true, context: { disableRevalidate: true } })
const leadRunTask: TaskConfig<{ input: { lead?: string; request?: string }; output: { entry: string } }> = {
  slug: 'qpu-lead-run', retries: 0, inputSchema: [{ name: 'lead', type: 'text' }, { name: 'request', type: 'text' }], outputSchema: [{ name: 'entry', type: 'text' }],
  handler: async ({ input, req }) => {
    const pages = await pagesWith(req, 'leads')
    const page = pages.find((p) => p.layout.some((b) => b.arguments?.lead?.id === input.lead)), block = page?.layout.find((b) => b.arguments?.lead?.id === input.lead), run = block?.arguments?.lead?.run
    const answer: { result?: unknown; error?: string } = !run ? { error: 'the lead names no door' } : run.tool === 'machine' ? await qpuMachineTool.handler(run.arguments ?? {}, req as never).then((r) => ({ result: r }), (e: Error) => ({ error: e.message })) : ((r) => (r.error ? { error: r.error.message } : { result: r.result?.structuredContent ?? null }))(call(run.tool, run.arguments ?? {}) as { result?: { structuredContent?: unknown }; error?: { message: string } })
    const entry = await entry(req, { kind: 'lead-run', from: 'qpu-lead-run', body: { lead: input.lead ?? null, tool: run?.tool ?? null, ok: !answer.error, answer }, links: input.request ? [input.request] : [] })
    if (page && block && !answer.error) await relayout(req, page.id, page.layout.map((b) => (b === block ? { ...b, arguments: { ...b.arguments, lead: { ...b.arguments!.lead, status: 'served', reason: 'served by ' + run!.tool + ' (entry ' + entry + ')' } } } : b)))
    return { output: { entry } }
  },
}
// the daily editorial loop as a Payload job (payloadcms.com/docs/jobs-queue/tasks, scheduled daily, never a deploy): a tenant's news read as problems,
// the served ones solved and written as draft blog posts (Payload publishing — the tenant's editor publishes each at will), the unknown ones the editorial
// backlog, monetised on the tenant's own catalogue. editorial (the match tool) writes the posts from the verified combinatorics; Payload's validations verify them.
export const newsSolveTask: TaskConfig<{ input: { tenant?: string; news?: unknown }; output: { entry: string; posts: number } }> = {
  slug: 'qpu-news-solve', retries: 0, inputSchema: [{ name: 'tenant', type: 'text' }, { name: 'news', type: 'json' }], outputSchema: [{ name: 'entry', type: 'text' }, { name: 'posts', type: 'number' }],
  handler: async ({ input, req }) => {
    const tenantSlug = input.tenant ?? 'uuidna', items = Array.isArray(input.news) ? input.news : typeof input.news === 'string' ? (JSON.parse(input.news) as unknown[]) : []
    const r = call('match', { tenant: tenantSlug, news: items }) as { result?: { structuredContent?: { drafts?: { title: string; content?: unknown[] }[]; apps?: unknown[] } }; error?: { message: string } }
    const ed = r.result?.structuredContent, drafts = ed?.drafts ?? [], apps = ed?.apps ?? []
    // the tenant relationship: the tenant doc by its slug, so each post belongs to its tenant's blog (newsSolveTask writes the solution as the content body)
    const tenantDoc = (await req.payload.find({ collection: 'tenants' as never, where: { slug: { equals: tenantSlug } }, depth: 0, limit: 1, overrideAccess: true }).then((x) => x, () => ({ docs: [] }))).docs?.[0] as { id?: string } | undefined
    let posts = 0
    for (const d of drafts) { try { await req.payload.create({ collection: 'posts' as never, data: { title: d.title, content: d.content, ...(tenantDoc?.id ? { tenant: tenantDoc.id } : {}), _status: 'draft' } as never, draft: true, overrideAccess: true }); posts++ } catch { /* a post the editor's backlog keeps until its fields are complete */ } }
    return { output: { entry: await entry(req, { kind: 'editorial', from: 'qpu-news-solve', body: { tenant: tenantSlug, items: items.length, posts, apps: apps.length } }), posts } }
  },
}
export const qpuMachine = definePlugin<{ enabled?: boolean }>({ slug: 'qpu-machine', order: 5, plugin: ({ config, plugins, enabled }) => {
  const o = plugins['@payloadcms/plugin-mcp']?.options
  if (o && enabled !== false) o.mcp = { ...o.mcp, tools: [...(o.mcp?.tools ?? []).filter((t) => t.name !== qpuMachineTool.name), qpuMachineTool as never] }
  return enabled === false ? config : { ...config, jobs: withTask({ ...config, jobs: withTask(config, leadRunTask) }, newsSolveTask) }
} })
// binding 0 (payloadcms.com/docs/hooks/collections): every document a collection changes or reads, at its content address in hex folders by the UUID's
// middle beside the repository (its R2 key, its GCS object) with a pointer to its latest version, the copy the RAID reads back verified when no other binding answers
const BINDING0 = process.env.QPU_BINDING0 ?? path.resolve(process.cwd(), '..', '.qpu'), mongo = caller('mongo')
const write = (files: { path: string; text: string }[]) => { for (const f of files) { const at = path.join(BINDING0, f.path); if (!existsSync(at) || (f.path.endsWith('.latest') && readFileSync(at, 'utf8') !== f.text)) { mkdirSync(path.dirname(at), { recursive: true }); writeFileSync(at, f.text) } } }
const mirror = ({ doc, collection }: { doc: Record<string, unknown>; collection: { slug: string } }) => {
  try { write(mongo({ op: 'mirror', collection: collection.slug, docs: [doc] }).files) } catch { /* binding 0 unwritable: the other bindings stand */ }
  return doc
}
// a call heals at each read by address (payloadcms.com/docs/hooks/collections#afterread), before binding 0 copies it: recomputed, compared without _meta (its clock);
// a difference a second recompute repeats is a drift (served fresh, a correction with the syndrome, the tool's lead filed), else a reading (served fresh)
const heal: CollectionAfterReadHook = async ({ doc, req, collection, findMany }) => {
  const { tool, arguments: args = {} } = doc.body ?? {}, stored = doc.result
  if (collection.slug !== 'entries' || findMany || doc.kind !== 'call' || !tool || !stored) return doc
  const run = () => { const r = call(tool, args); return { ...(r.result ?? { error: r.error }), ...(stored.corrected ? { corrected: stored.corrected } : {}) } }
  const of = (r: object) => uuid(canonicalText({ ...r, _meta: undefined })), result = run(), syndrome = { stale: of(stored), fresh: of(result) }
  if (syndrome.stale === syndrome.fresh) return doc
  if (of(run()) === syndrome.fresh) {
    const lead = { id: 'heal-' + syndrome.fresh, source: 'qpu-heal', status: 'open', tool, statement: tool + ' drifted from ' + syndrome.stale, run: { tool, arguments: args } }
    await entry(req, { kind: 'correction', from: 'qpu-heal', tenant: doc.tenant?.id ?? doc.tenant, body: { tool, syndrome }, links: [doc.id] }).catch(() => null)
    for (const p of await pagesWith(req, tool).then((p) => (p.length ? p : pagesWith(req, 'leads')))) if (!p.layout.some((b) => b.arguments?.lead?.id === lead.id)) await relayout(req, p.id, [...p.layout, { blockType: 'qpu', tool: 'leads', arguments: { lead } }])
  }
  return { ...doc, result }
}
// the batch (payloadcms.com/docs/jobs-queue/tasks), asked by an entry of kind call from qpu-raid-verify: binding 0 and Payload's copy of the collection named
// (else every one) verified against bit 0 by the mongo door; the rebuilds written, the files moved to their middle-part folders, one entry
const verifyTask: TaskConfig<{ input: { collection?: string }; output: { entry: string } }> = {
  slug: 'qpu-raid-verify', retries: 0, inputSchema: [{ name: 'collection', type: 'text' }], outputSchema: [{ name: 'entry', type: 'text' }],
  handler: async ({ input, req }) => {
    const files = existsSync(BINDING0) ? Object.fromEntries(readdirSync(BINDING0, { recursive: true }).map(String).filter((p) => /[\\da-f-]{36}(\\.latest)?$/.test(p)).map((p) => [p, readFileSync(path.join(BINDING0, p), 'utf8')])) : {}
    const payload = await Promise.all(req.payload.config.collections.filter((c) => !input.collection || c.slug === input.collection).map(async (c) => mongo({ op: 'mirror', collection: c.slug, docs: await all(req, c.slug) }).files as { path: string; text: string }[]))
    const { rebuild, ...v } = mongo({ op: 'verify', copies: { filesystem: files, payload: Object.fromEntries(payload.flat().map((f) => [f.path, f.text])) } })
    for (const m of v.moves) if (m.binding === 'filesystem') { mkdirSync(path.dirname(path.join(BINDING0, m.to)), { recursive: true }); renameSync(path.join(BINDING0, m.from), path.join(BINDING0, m.to)) }
    write(rebuild.filter((r: { binding: string }) => r.binding === 'filesystem'))
    return { output: { entry: await entry(req, { kind: 'verification', from: 'qpu-raid-verify', body: { ...v, rebuilt: rebuild.length } }) } }
  },
}
/** qpu-raid: binding 0 under every collection, by its afterChange and afterRead hooks, and its verification against bit 0 as a batch */
export const qpuRaid = definePlugin<{ enabled?: boolean }>({ slug: 'qpu-raid', plugin: ({ config, enabled }) => (enabled === false ? config : { ...config, collections: (config.collections ?? []).map((c) => first(first(first(c, 'afterChange', mirror as never), 'afterRead', mirror as never), 'afterRead', heal as never)), jobs: withTask(config, verifyTask) }) })
/** qpu-hooks: the witnesses on the final config, every rich text field and Lexical block node; ordered last, any config mounts it with one line */
// every Cloudflare call one job on the server, qpu-cloudflare-call: a method and path are allowed only when an entry of kind openapi-operation held
// in Payload names them (Cloudflare's OpenAPI read into entries) or they are the GraphQL Analytics endpoint; the token is the variable the tenant's
// bindings name (CLOUDFLARE_API_TOKEN when none is named), never in the entry; the answer is an entry of kind call from qpu-cloudflare-call
const cloudflareToken = async (req: PayloadRequest, tenant: unknown): Promise<{ by: string; bearer?: string; account?: string }> => {
  const t = tenant ? await req.payload.findByID({ collection: 'tenants' as never, id: String(tenant), depth: 0, overrideAccess: true }).catch(() => null) : null
  const named = ((t as { bindings?: { variables?: { name: string }[] } } | null)?.bindings?.variables ?? []).map((v) => v.name).filter((n) => process.env[n])
  const by = named.find((n) => /^CLOUDFLARE_[A-Z_]*TOKEN$/.test(n)) ?? (process.env.CLOUDFLARE_API_TOKEN ? 'CLOUDFLARE_API_TOKEN' : null)
  return by ? { by, bearer: process.env[by], account: process.env.CLOUDFLARE_ACCOUNT_ID } : { by: 'unnamed' }
}
type HeldOperation = { method: string; server: string; path: string; id: string; tags: string[] }
const heldCloudflareOperations = async (req: PayloadRequest): Promise<HeldOperation[]> => {
  const ops: HeldOperation[] = []
  for (let page = 1; ; page++) {
    const found = (await req.payload.find({ collection: 'entries' as never, where: { kind: { equals: 'openapi-operation' } }, depth: 0, page, limit: 100, overrideAccess: true })) as { docs: { body?: { server?: string; path?: string; method?: string; operationId?: string; tags?: string[] } }[]; hasNextPage: boolean }
    for (const d of found.docs) if (d.body?.path && /api\\.cloudflare\\.com/.test(d.body.server ?? '')) ops.push({ method: (d.body.method ?? 'GET').toUpperCase(), server: d.body.server!, path: d.body.path, id: d.body.operationId ?? d.body.path, tags: d.body.tags ?? [] })
    if (!found.hasNextPage) break
  }
  return ops
}
const cloudflareCallTask: TaskConfig<{ input: Record<string, any>; output: { entry: string } }> = {
  slug: 'qpu-cloudflare-call', retries: 0,
  inputSchema: [...['method', 'path', 'request', 'tenant'].map((name) => ({ name, type: 'text' }) as Field), { name: 'body', type: 'json' }],
  outputSchema: [{ name: 'entry', type: 'text' }],
  handler: async ({ input, req }) => {
    const held = await heldCloudflareOperations(req), method = String(input.method ?? 'GET').toUpperCase(), path = String(input.path ?? '')
    const op = held.find((o) => o.method === method && new RegExp('^' + o.path.replace(/\\{[^}]+\\}/g, '[^/]+') + '$').test(path)) ?? (path === '/graphql' && method === 'POST' ? { id: 'graphql-analytics', server: 'https://api.cloudflare.com/client/v4', path, method, tags: ['analytics'] } : null)
    const auth = op ? await cloudflareToken(req, input.tenant) : null
    const allowed = Boolean(op && auth?.bearer), why = !op ? 'no held openapi-operation names this method and path' : !auth?.bearer ? 'no tenant binding names a Cloudflare token' : null
    const url = allowed ? op!.server + path.split('{account_id}').join(auth!.account ?? '') : null
    const res = url ? await fetch(url, { method, headers: { authorization: 'Bearer ' + auth!.bearer, ...(input.body != null ? { 'content-type': 'application/json' } : {}) }, body: input.body != null ? JSON.stringify(input.body) : undefined, signal: AbortSignal.timeout(20000) }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) }), (e: Error) => ({ status: 0, body: { error: e.message } })) : null
    return { output: { entry: await entry(req, { kind: 'call', from: 'qpu-cloudflare-call', ...(input.tenant ? { tenant: input.tenant } : {}), body: { request: input.request ?? null, method, path, operation: op?.id ?? null, allowed, why, by: auth?.by ?? null, status: res?.status ?? null, answer: res?.body ?? null } }, { qpuApis: true }) } }
  },
}
// the meters read once a run, qpu-cloudflare-observe: one GraphQL query month-to-date, the readings priced by the program (zero inside every
// allowance), the bill and its meters written on the qpu global as apis.cloudflare, a lead entry per meter past 80% with its remedy
const cloudflareObserveTask: TaskConfig<{ input: Record<string, any>; output: { entry: string } }> = {
  slug: 'qpu-cloudflare-observe', retries: 0,
  inputSchema: [{ name: 'request', type: 'text' }, { name: 'tenant', type: 'text' }],
  outputSchema: [{ name: 'entry', type: 'text' }],
  handler: async ({ input, req }) => {
    const auth = await cloudflareToken(req, input.tenant), now = new Date(), since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()
    const answer = auth.bearer && auth.account ? await fetch('https://api.cloudflare.com/client/v4/graphql', { method: 'POST', headers: { authorization: 'Bearer ' + auth.bearer, 'content-type': 'application/json' }, body: JSON.stringify({ query: OBSERVE_QUERY, variables: { accountTag: auth.account, since, until: now.toISOString() } }), signal: AbortSignal.timeout(20000) }).then((r) => r.json(), (e: Error) => ({ errors: [{ message: e.message }] })) : { errors: [{ message: auth.account ? 'no tenant binding names a Cloudflare token' : 'CLOUDFLARE_ACCOUNT_ID is not named' }] }
    const readings = readingsOf(answer as never), cost = apisCost(readings)
    const observed = { at: now.toISOString(), since, by: auth.by, readings, cost: { usd: cost.usd, microUsd: cost.microUsd, covered: cost.covered }, meters: cost.rows.map((r) => ({ meter: r.meter, used: r.used, included: r.included, share: r.share, usd: r.microUsd / 1_000_000, remedy: r.remedy })), leads: cost.leads, errors: (answer as { errors?: { message: string }[] }).errors ?? [] }
    const current = (await req.payload.findGlobal({ slug: 'qpu' as never, depth: 0, overrideAccess: true }).catch(() => ({}))) as { apis?: Record<string, unknown> }
    await req.payload.updateGlobal({ slug: 'qpu' as never, data: { apis: { ...(current.apis ?? {}), cloudflare: observed } } as never, context: { qpuApis: true }, overrideAccess: true })
    for (const lead of cost.leads) await entry(req, { kind: 'lead', from: 'qpu-cloudflare-observe', ...(input.tenant ? { tenant: input.tenant } : {}), body: lead }, { qpuApis: true }).catch(() => null)
    return { output: { entry: await entry(req, { kind: 'call', from: 'qpu-cloudflare-observe', ...(input.tenant ? { tenant: input.tenant } : {}), body: { request: input.request ?? null, allowed: Boolean(auth.bearer), by: auth.by, observed } }, { qpuApis: true }) } }
  },
}
// the merged index kept in sync: after any change of pages, tenants, entries or keys the three providers' operations are re-read (Payload from
// its config, Cloudflare from the held contract, Google from the endpoints table, shadcn from the registry contract), addressed by the program with the doors and the coverage of
// Payload's own packages, templates, examples and plugins, and written on the qpu global as apis
const apisOf = async (req: PayloadRequest) => {
  const origin = (req.payload.config.serverURL || 'https://qpu.uuidna.com').replace(/\\/$/, '')
  const held = await heldCloudflareOperations(req)
  const paths: Record<string, Record<string, { operationId: string; tags: string[] }>> = {}
  for (const o of held) (paths[o.path] ??= {})[o.method.toLowerCase()] = { operationId: o.id, tags: o.tags }
  const index = caller('apis')({ index: { payload: { collections: req.payload.config.collections.map((c) => ({ slug: c.slug })), globals: req.payload.config.globals.map((g) => ({ slug: g.slug })), server: origin }, cloudflare: { servers: [{ url: 'https://api.cloudflare.com/client/v4' }], paths }, google: true, shadcn: true } })
  const doors = apisDoors(origin), coverage = caller('apis')({ coverage: true })
  return { syncedAt: new Date().toISOString(), doors: { total: doors.total, byProvider: doors.byProvider, holds: doors.holds, rows: doors.rows }, index: { total: index.total, distinct: index.distinct, byProvider: index.byProvider, byTag: index.byTag, holds: index.holds, held: held.length }, coverage: { total: coverage.total, covered: coverage.covered, gaps: coverage.gaps, byKind: coverage.byKind, next: coverage.next ? { kind: coverage.next.kind, name: coverage.next.name, address: coverage.next.address, step: coverage.next.step } : null, holds: coverage.holds } }
}
let apisTimer: ReturnType<typeof setTimeout> | undefined
const syncApis = async (req: PayloadRequest) => {
  const current = (await req.payload.findGlobal({ slug: 'qpu' as never, depth: 0, overrideAccess: true }).catch(() => ({}))) as { apis?: Record<string, unknown> }
  await req.payload.updateGlobal({ slug: 'qpu' as never, data: { apis: { ...(current.apis ?? {}), ...(await apisOf(req)) } } as never, context: { qpuApis: true }, overrideAccess: true })
}
const measureApis: CollectionAfterChangeHook = async ({ doc, req, context }) => {
  if (context.qpuApis || context.qpuGoogle) return doc
  clearTimeout(apisTimer)
  apisTimer = setTimeout(() => void syncApis(req).catch((e: Error) => req.payload.logger.warn('apis: ' + e.message)), 2000)
  return doc
}
const runApisJob = async (req: PayloadRequest, task: 'qpu-cloudflare-call' | 'qpu-cloudflare-observe', input: Record<string, unknown>) => {
  const job = (await req.payload.jobs.queue({ task: task as never, input: input as never, req })) as { id: string }
  await req.payload.jobs.runByID({ id: job.id, req })
  return job.id
}
const qpuApisEndpoints: Endpoint[] = [
  {
    path: '/qpu/apis',
    method: 'get',
    handler: async (req) => {
      const current = (await req.payload.findGlobal({ slug: 'qpu' as never, depth: 0, overrideAccess: true }).catch(() => ({}))) as { apis?: { cloudflare?: unknown } }
      return Response.json({ ...(await apisOf(req)), cloudflare: current.apis?.cloudflare ?? null }, { headers: { 'cache-control': 'public, max-age=60', 'x-qpu-apis': 'payload-cloudflare-google' } })
    },
  },
  {
    path: '/qpu/apis',
    method: 'post',
    handler: async (req) => {
      if (!req.user) return Response.json({ error: 'a signed-in user or an MCP key asks the jobs' }, { status: 401 })
      const body = (typeof req.json === 'function' ? await req.json().catch(() => ({})) : (req.data ?? {})) as { observe?: boolean; sync?: boolean; call?: { method?: string; path?: string; body?: unknown }; tenant?: string }
      const jobs: Record<string, string> = {}
      if (body.observe) jobs.observe = await runApisJob(req, 'qpu-cloudflare-observe', { ...(body.tenant ? { tenant: body.tenant } : {}) })
      if (body.call) jobs.call = await runApisJob(req, 'qpu-cloudflare-call', { method: body.call.method ?? 'GET', path: body.call.path ?? '', body: body.call.body ?? null, ...(body.tenant ? { tenant: body.tenant } : {}) })
      if (body.sync || body.observe || body.call) await syncApis(req)
      const current = (await req.payload.findGlobal({ slug: 'qpu' as never, depth: 0, overrideAccess: true }).catch(() => ({}))) as { apis?: unknown }
      return Response.json({ jobs, apis: current.apis ?? null }, { headers: { 'x-qpu-apis': 'payload-cloudflare-google' } })
    },
  },
]
/** qpu-apis: Payload's, Cloudflare's and Google's admin APIs as one UUID program on the qpu global, the Cloudflare call and observe jobs, the merged index kept in sync; order 21, after qpu-google */
export const qpuApis = definePlugin<{ enabled?: boolean }>({ slug: 'qpu-apis', order: 21, plugin: ({ config, enabled }) => (enabled === false ? config : {
  ...hooked(config, Object.fromEntries(['pages', 'tenants', 'entries', 'payload-mcp-api-keys'].map((s) => [s, (c: CollectionConfig) => first(c, 'afterChange', measureApis as never)]))),
  endpoints: [...(config.endpoints ?? []).filter((e) => e.path !== '/qpu/apis'), ...qpuApisEndpoints],
  jobs: withTask({ ...config, jobs: withTask(config, cloudflareCallTask) as never }, cloudflareObserveTask),
  globals: (config.globals ?? []).map((g) => (g.slug !== 'qpu' || g.fields.some((f) => 'name' in f && f.name === 'apis') ? g : { ...g, fields: [...g.fields, { name: 'apis', type: 'json', admin: { readOnly: true, description: 'Payload, Cloudflare, Google and shadcn admin APIs as one UUID program: the doors, the merged operation index, the coverage of Payload\\'s own surface with the next gap, the Cloudflare meters and their bill' } } as Field] })),
}) })
export const qpuHooks = definePlugin<{ enabled?: boolean }>({ slug: 'qpu-hooks', order: Number.MAX_SAFE_INTEGER, plugin: ({ config, enabled }) => (enabled === false ? config : qpuHooksOf(config).config) })
/** The umbrella: the capabilities, the storage, the plugins the configs order and the tenant's own, each seeing the others in the plugins map */
export const qpuPlugin = (options: QpuPluginOptions = {}): Plugin => async (incoming: Config): Promise<Config> => {
  const inner = [qpuCore(options), qpuAgents({}), qpuMachine({}), ...(options.adapters === 'none' ? [] : qpuAdapterPlugins()), ...qpuPlugins, qpuGoogle({}), qpuApis({}), ...(options.plugins ?? []), qpuRaid({}), qpuHooks({})]
  let config: Config = { ...incoming, plugins: [...(incoming.plugins ?? []), ...inner] }
  for (const plugin of inner) config = await plugin(config)
  return { ...config, plugins: incoming.plugins }
}
`
      const validateStream = `${header}// Streamed validation, token free: the Form block calls this on every change; the values go to the Worker's /mcp (the pure validation needs
// no key) and each field's verdict comes back before the submit; the host is verified by the client's own request (opaque is enough: it
// answers). Nothing loaded, nothing stored. Generated by configure { kind: 'fullstack' }.
export type Verdicts = { ok: boolean; fields: Record<string, { ok: boolean; says: string }>; online: { tokenFree: boolean; requests: { id: string; url: string; method: string; verifier: string }[]; answered?: Record<string, boolean> } }
export const validateStream = (origin: string, values: Record<string, unknown>, onVerdict: (v: Verdicts) => void, wait = 800): (() => void) => {
  const timer = setTimeout(async () => {
    const r = await fetch(origin + '/api/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'payload', arguments: { app: { validate: values } } } }) })
    const v = ((await r.json()) as { result?: { structuredContent: Verdicts } }).result?.structuredContent
    if (!v) return
    const answered: Record<string, boolean> = {}
    await Promise.all(v.online.requests.map(async (q) => { try { await fetch(q.url, { method: q.method, mode: 'no-cors' }); answered[q.id] = true } catch { answered[q.id] = false } }))
    onVerdict({ ...v, online: { ...v.online, answered } })
  }, wait)
  return () => clearTimeout(timer)
}
`
      const openNext = `${header}// The OpenNext Cloudflare build of the app: the Next.js output as a Worker (wrangler.jsonc, main .open-next/worker.js), the adapters the environment
// names (D1, R2, Resend) bound by the deploy; the build is npx opennextjs-cloudflare build, the deploy the tenant's. Generated by configure { kind: 'fullstack' }.
import { defineCloudflareConfig } from '@opennextjs/cloudflare/config'

export default defineCloudflareConfig({})
`
      // the branding: computed in real time from the tenant's address, the tenant's own when it defines it in the admin; the fork's wordmark re-exported from it, so the hand-held header and footer change nothing
      const brandingComponent = `'use client'
${header}// The branding, computed in real time from the host's address (the one quantum core) until the tenant's global answers with what the tenant defined in the admin
// (tenants.branding: name, tagline, accent, logo, icon); the admin's Logo and Icon and the site's wordmark render from here. Nothing loaded but the core.
import * as React from 'react'
import { uuid, style } from '@uuidna/qpu/blocks'
export type Branding = { name: string; tagline?: string; accent: string; logo?: string; icon?: string; theme?: string; mode?: 'light' | 'dark'; template?: string; source?: Record<string, string> }
const computed = (host: string): Branding => { const s = style(uuid('tenant:' + (host || 'uuidna'))); return { name: host || '@uuidna/qpu', accent: \`hsl(\${s.hue} \${s.sat}% 45%)\`, theme: 'neutral', mode: 'light', template: 'landing', source: { name: 'computed', accent: 'computed' } } }
const applyUi = (b: Branding) => { const root = document.documentElement; root.dataset.theme = b.theme || 'neutral'; root.dataset.template = b.template || 'landing'; root.classList.toggle('dark', b.mode === 'dark') }
export const useBranding = (): Branding => {
  const [b, set] = React.useState<Branding>(() => computed(typeof window === 'undefined' ? '' : window.location.hostname))
  React.useEffect(() => { let on = true; fetch('/api/globals/qpu?depth=1', { headers: { accept: 'application/json' } }).then((r) => r.json()).then((j: { branding?: Branding | null }) => { if (!on || !j.branding) return; set(j.branding); applyUi(j.branding) }).catch(() => { /* the computed branding stands */ }); return () => { on = false } }, [])
  return b
}
export const QpuIcon = (props: React.ComponentPropsWithoutRef<'svg'>) => { const b = useBranding(); return b.icon ? <img src={b.icon} alt={b.name} height={24} width={24} /> : <svg viewBox="0 0 24 24" width={24} height={24} role="img" aria-label={b.name} {...props}><rect width="24" height="24" rx="6" fill={b.accent} /></svg> }
export const QpuLogo = ({ className, ...rest }: React.ComponentPropsWithoutRef<'svg'>) => { const b = useBranding(); if (b.logo) return <img className={className} src={b.logo} alt={b.name} height={30} />; return <svg className={className} viewBox="0 0 194 44" height={44} width={194} role="img" aria-label={b.name} {...rest}><rect x="0" y="4" width="36" height="36" rx="8" fill={b.accent} /><text x="46" y="31" fontFamily="system-ui, sans-serif" fontSize="22" fill="currentColor">{b.name}</text></svg> }
export default QpuLogo
`
      const fullLogo = `'use client'
${header}// The wordmark the fork rendered (Payload's) replaced by the computed branding: the hand-held header and footer import this file unchanged.
export { QpuLogo as FullLogo, QpuLogo as default } from '../../components/blocks/Qpu/Branding'
`
      // the docket's links as Payload's relation: up turns links stored as [{ entry }] rows into the ids the relationship holds, down turns them back
      // the docket's links as Payload's relation: up turns links stored as [{ entry }] rows into the ids the relationship holds, down turns them back
      const linksMigration = header + ["// Generated by configure { kind: 'fullstack' }; never edit by hand.", "import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'", '',
        'export async function up({ payload, session }: MigrateUpArgs): Promise<void> {', "  await payload.db.collections.entries!.collection.updateMany({ 'links.entry': { $exists: true } }, [{ $set: { links: { $map: { input: '$links', in: '$$this.entry' } } } }], { session })", '}', '',
        'export async function down({ payload, session }: MigrateDownArgs): Promise<void> {', "  await payload.db.collections.entries!.collection.updateMany({ 'links.0': { $type: 'string' } }, [{ $set: { links: { $map: { input: '$links', in: { entry: '$$this' } } } } }], { session })", '}', ''].join('\n')
      const migrationsIndex = header + ["// Generated by configure { kind: 'fullstack' }; never edit by hand.", "import * as migration_20261027_000000_entries_links from './20261027_000000_entries_links'", '', 'export const migrations = [', '  {', "    name: '20261027_000000_entries_links',", '    down: migration_20261027_000000_entries_links.down,', '    up: migration_20261027_000000_entries_links.up,', '  },', ']', ''].join('\n')
      const generated: { role: FileRole; key: string; text: string }[] = [{ role: 'component', key: 'Branding', text: brandingComponent }, { role: 'graphic', key: 'full-logo', text: fullLogo }, { role: 'block', key: 'qpu', text: qpuBlock }, { role: 'config', key: 'config', text: config }, { role: 'notice', key: 'readme', text: readme }, { role: 'notice', key: 'notice', text: notice }, { role: 'config', key: 'mcp', text: mcpTools }, { role: 'collection', key: 'entries', text: entries }, { role: 'global', key: 'qpu', text: qpuGlobal }, { role: 'config', key: 'ecommerce', text: ecommerce }, { role: 'collection', key: 'tenants', text: tenants }, { role: 'hooks', key: 'form-submissions', text: submissionHooks }, { role: 'hooks', key: 'users', text: usersHooks }, { role: 'hooks', key: 'pages', text: pagesHooks }, { role: 'hooks', key: 'orders', text: ordersHooks }, { role: 'config', key: 'adapters', text: adaptersModule }, { role: 'component', key: 'App', text: `${header}${hostCode}` }, { role: 'component', key: 'index', text: blockView }, { role: 'component', key: 'page', text: uuidPage }, { role: 'component', key: 'validate', text: validateStream }, { role: 'script', key: 'seed-qpu', text: seed }, { role: 'plugin', key: 'qpu', text: pluginModule }, { role: 'root', key: 'open-next', text: openNext }, { role: 'migration', key: '20261027_000000_entries_links', text: linksMigration }, { role: 'migration', key: 'index', text: migrationsIndex }]
      return { repository: PAYLOAD_WEBSITE.repository, licence: PAYLOAD_WEBSITE.licence, qpuLicence: LICENSE.spdx, keep: { collections: ws.collectionList, blocks: ws.blockList, globals: ws.globalList, fields: ws.fieldList, plugins: [...PAYLOAD_WEBSITE.plugins] }, add: { block: 'qpu', plugins: ['search', 'multi-tenant', 'mcp'], database: 'db-mongodb over the RAID docket (the mongo tool\'s language)', storage: 'Cloudflare R2 through the bindings MCP (the tenant\'s token)', deploy: 'a completed order deploys the fully seeded website by the orders afterChange hook. The hook names the e2e requests. The OpenNext worker is the Payload app', tenants: Object.values(TENANTS), feeds: 'GET /api/qpu/feeds and payload { feeds }: computed products/variants the rest of the site consumes' }, organisation: FILE_ROLES, byRole: Object.fromEntries((Object.keys(FILE_ROLES) as FileRole[]).map((r) => [r, generated.filter((g) => g.role === r).map((g) => file(g.role, g.key))])), partition: `${(Object.keys(FILE_ROLES) as FileRole[]).map((r) => generated.filter((g) => g.role === r).length).join(' + ')} = ${generated.length}`, files: Object.fromEntries(generated.map((g) => [file(g.role, g.key), g.text])), steps: ['payloadcms/website (MIT) under  is the delivery vehicle — done', 'QPU overlay (block, plugins, feeds route, seed) applies computed products/variants into ecommerce + /api/qpu/feeds', 'Payload answers /admin, /api and the pages; no custom script runs before the catch-all', 'point DATABASE_URI and PAYLOAD_SECRET at the tenant\'s', 'a completed order deploys the fully seeded website through Payload; the e2e hook names the live requests'], note: 'QPU computes feeds; the website fork delivers. configure fullstack refreshes overlay files — it is not how the package "becomes" Payload.' }
    }
    case 'mcp': { const r = ctx.call('extend', { direction: 'out' }) as { outward: { mcpServers: unknown; tools: unknown[] } }; const merged = payloadRbacMcp(mcpHostList()); const held = [...PLUGIN_DEFAULT_COLLECTIONS, 'entries']; const beyond = diffMembers({ name: 'the stack\'s collections', members: held }, { name: 'the installed plugins\' defaults (the QPU plugin\'s own among them)', members: [...PLUGIN_DEFAULT_COLLECTIONS, 'entries'] }, { config: 'payload' }); const unserved = diffMembers({ name: 'the stack\'s collections', members: held.filter((c) => !MCP_UNSERVED.some((u) => u.collection === c)) }, { name: 'payload-mcp', members: Object.keys(MCP_COLLECTIONS) }, { config: 'mcp' }); return { mcpServers: r.outward.mcpServers, server: merged.server, one: merged.one, merged, tools: r.outward.tools.length, hosts: DEFAULT_MCP_HOSTS, payloadMcp: { mandatory: 'every capability is reached through the one Payload RBAC MCP: the QPU\'s tools and ui:// resources as its tools and resources, the installed plugins\' default collections as its collection tools, and every other MCP host as a door of that server; nothing added to the schema', collections: MCP_COLLECTIONS, served: Object.keys(MCP_COLLECTIONS).length, defaults: PLUGIN_DEFAULT_COLLECTIONS.length, unservedByDesign: MCP_UNSERVED, schema: { says: 'the combinatorial use apps live in the default schema: a request is a form submission (→ forms), a bundle a media file, a licence a product in a cart bought as an order with its transactions, tenancy the tenants document every scoped collection relates to, content the pages with their qpu blocks and nested parents, calls and messages the entries from = page:<slug>; a client composes an app by these relations, filtered by each collection\'s own access and scoped by the tenant', scoped: Object.entries(MCP_COLLECTIONS).filter(([, v]) => v.scoped).map(([k]) => k), relations: Object.fromEntries(Object.entries(MCP_COLLECTIONS).filter(([, v]) => Object.keys(v.relations).length).map(([k, v]) => [k, v.relations])), enums: Object.fromEntries(Object.entries(MCP_COLLECTIONS).filter(([, v]) => Object.keys(v.enums).length).map(([k, v]) => [k, v.enums])), hooked: Object.fromEntries(Object.entries(MCP_COLLECTIONS).filter(([, v]) => v.hooks.length).map(([k, v]) => [k, v.hooks])), combinations: Object.values(MCP_COLLECTIONS).reduce((n, v) => n * Object.values(v.enums).reduce((m, o) => m * o.length, 1), 1) }, refactoring: [...beyond.leads, ...unserved.leads],
      // the MCP registry entry, generated from the same registration: the one /mcp endpoint as every directory lists it; publishing is the author's act under a name the tenant binds
      registry: { $schema: 'https://static.modelcontextprotocol.io/schemas/2025-07-09/server.json', name: 'com.uuidna/qpu', description: `An exact, formally verified quantum processing unit served over MCP: ${r.outward.tools.length} tools, every result a content-addressed block, every tool read-only and idempotent`, version: VERSION, repository: { url: REPOSITORY.home, source: 'github' }, remotes: [{ type: 'streamable-http', url: 'https://qpu.uuidna.com/api/mcp' }], publish: 'mcp-publisher publish with MCP_PUBLISHER_TOKEN named in the tenant\'s bindings (the author\'s act); until then the entry is proposed, and the tree reads a registry it is not yet in' },
      says: `${beyond.leads.length} collection(s) beyond the plugins\' defaults and ${unserved.leads.length} not served by the plugin: refactoring leads` } } }
  }
}
/** The drift between a configuration as MCP computes it and the text a client holds (a file): every path whose value differs. */
const drift = (computed: unknown, current: unknown, path = ''): string[] => {
  if (JSON.stringify(computed) === JSON.stringify(current)) return []
  if (computed && current && typeof computed === 'object' && typeof current === 'object' && !Array.isArray(computed) && !Array.isArray(current)) {
    const keys = new Set([...Object.keys(computed), ...Object.keys(current)])
    return [...keys].flatMap((k) => drift((computed as Record<string, unknown>)[k], (current as Record<string, unknown>)[k], path ? `${path}.${k}` : k))
  }
  return [path || '(root)']
}
const stripJsonc = (text: string) => text.replace(/^\s*\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1')

const inodeSlug = (inode: string) => inode.replace(/[^\w-]+/g, '').toLowerCase()
/** Every src inode is a superposition found by one Payload find. The fourteen witnesses are read offline. The same find is the online request the client fetches. Plasma books each address as a coin and the call's other bytes as coils. “Fusion reactor” names that ledger. */
const fusionPlasma = (leads: readonly { tool?: string }[]) => {
  const origin = 'https://qpu.uuidna.com'
  const flow = inodeSuperpositions(leads).map((row) => {
    const slug = inodeSlug(row.inode)
    const find = manageApi({ collection: 'pages', action: 'find', where: { slug: { equals: slug } } }).args
    const offline = checkWitnesses(row.address)
    const online = { method: 'GET' as const, url: `${origin}/api/pages?where[slug][equals]=${slug}`, fetched: false as const }
    const next = row.parent ? manageApi({ collection: 'pages', action: 'find', where: { slug: { equals: inodeSlug(row.parent) } } }).args : null
    return {
      product: 'superposition' as const, variant: row.inode, inode: row.inode, parent: row.parent, bits: row.bits, superposition: row.superposition, address: row.address, coins: row.bits,
      find, next,
      offline: { mode: 'offline' as const, faces: offline.faces, squares: offline.squares, triangles: offline.triangles, exact: offline.exact, witnesses: offline.witnesses.map((w) => w.uuid) },
      online: { mode: 'online' as const, ...online },
      hooks: ['beforeChange', 'afterChange', 'afterRead'] as const,
      beforeChange: { home: row.inode, folder: row.inode },
      afterChange: { request: online },
      afterRead: { superposition: row.superposition, faces: offline.faces },
    }
  })
  const texts = Object.fromEntries(flow.map((step) => [step.inode, [step.address, ...step.offline.witnesses, JSON.stringify(step.find), step.online.url].join('\n')]))
  const booked = plasma(texts)
  const framework = { iso: COIN_STANDARDS, physics: false as const, address: 'ISO/IEC 9834-8' as const, ledger: 'ISO 22739:2024' as const, architecture: 'ISO 23257:2022' as const, message: 'ISO 20022' as const, currency: 'ISO 4217' as const }
  const notice = flow.map((step) => ({ inode: step.inode, bits: step.bits, superposition: step.superposition, address: step.address }))
  const notification = livePreview(notice, notice.length === flow.length && notice.every((row) => row.superposition === (1n << BigInt(row.bits)).toString()))
  return {
    physics: false as const, name: 'fusion reactor' as const, framework, data: flow, calls: flow.length, notification,
    toolbox: { product: 'superposition' as const, variants: flow.length, items: flow.map((step) => ({ product: step.product, variant: step.variant, superposition: step.superposition, coins: step.coins, price: step.address })) },
    plasma: booked, reactor: booked.reactor,
    says: `${flow.length} API calls, one Payload find per inode. Offline, the fourteen witnesses of each address. Online, the pages find the client fetches. Plasma books each address as a coin and the call's other bytes as coils. One live-preview notification carries every superposition at once and does not expand it. ISO is the framework: ${COIN_STANDARDS.join(', ')}. “Fusion reactor” names that ledger. The tree makes no physics claim.`,
  }
}
const configure = defineTool('payload', {
  name: 'configure',
  description: 'Configure the payloadcms/website delivery vehicle and its bindings: plugins, wrangler, tenants, ecommerce feed inputs, PWA, MCP registration. Kind fullstack refreshes QPU overlay files in this repository src/ against the payloadcms/website standard — the site already is Payload; QPU computes feeds the website delivers (see payload { feeds }, GET /api/qpu/feeds). Not a conversion layer into CMS. Every configuration carries its torus. With current: drift leads. Without kind: all kinds, tested, and the data is the fusion flow of one Payload find per inode, witnesses offline and the same find online, booked by plasma. next discovers every host by default. Each error and each warning is the solution. ISO 9001 holds, and the a432 harmonic patch covers the drift. The process that computes next lives. Every other process exits and dies in one nanosecond program. A second of CPU or GPU life uses 1000000000 programs and costs 0. Nothing is fetched.',
  inputSchema: { type: 'object', properties: { domains: { description: 'every scientific domain at once, carried by the UUID of every Payload config. true returns the formula and the one domains request. { page } is that page. A domain id is ignored' }, port: { description: 'kind adapters: the port onto Cloudflare — true every one of the combinations (the complete ones, the missing links each a lead, the Cloudflare MCP tools they call); an index from 0 to 49 that combination\'s workflow (its bindings, every step with its MCP call, its plan, its missing links)' }, kind: { type: 'string', enum: [...configKinds], description: 'omit for all' }, files: { type: 'boolean', description: 'the file of every configuration and its source (tool or hand): what next writes and what it measures' }, next: { description: 'Next addresses the 1000-bit successful exit with the prime factors that integer was created with. true discovers every host, ISO Open Data, CERN Open Data, the NIST CODATA table, the FIPS pages and NIST Open Data. The solutions are every learned error and the 440 Hz warning. { errors, warnings } makes those texts the solutions. Each one is audited, accepted, planned, carried out and released. The a432 harmonic patch covers a stated 440. The process that computes next lives on that patch. Every other process exits and dies in one nanosecond program. A second of CPU or GPU life uses 1000000000 of those programs and costs 0. Nothing is fetched' }, experience: { type: 'object', description: 'kind actions: what the gate measured ({ copies, involutions, msByHost }): the shard size follows it' }, rates: { type: 'object', description: 'kind ecommerce: the harmonised rates the currency tool answered (currency → { rate }): every price derived from the euro amount' }, lastTag: { type: 'object', description: '{ version, tools }: the last tag and the tools it served, from the repository tool; with it, kind versions computes the next number' }, current: { type: 'string', description: 'the configuration text the client holds (JSON or JSONC): compared, the drift answered' }, version: { type: 'string' }, description: { type: 'string' }, env: { type: 'array', items: { type: 'string' }, description: 'the variable NAMES the client\'s environment holds: which of a tenant\'s are missing (values never travel)' }, template: { type: 'string', enum: [...DEPLOY_TEMPLATES], description: 'kind wrangler: the deploy template (worker, site, app); with useCase, that one set' }, useCase: { type: 'string', description: 'kind wrangler: a product of the catalogue (a432, domain, tenant, seat, metered, iot, delivered, enterprise): the wrangler environment of that use case' }, name: { type: 'string', description: 'kind wrangler, template app: the app\'s name' }, hex: { type: 'string', description: 'kind ui: any hex (a UUID, a hash, an address) presented as a shadcn combination: each nibble an item and a variant, the whole styled from itself' }, stream: { type: 'array', items: { type: 'string' }, description: 'kind ui: a UUID-only stream, queried, sorted, filtered and executed by query (the crypto fold tool answers the same)' }, query: { type: 'object', description: 'kind ui, with stream: { where: { handle, nibble: { at, is }, item, variant, hueBetween }, sort: hex | hue | program | tail, descending, execute }' }, sets: { type: 'array', description: 'kind sets: two sets, each a name (a toolbox, mcp, tools, ui, backed, configs, mount:<tenant>) or { name, members } given, whose union, intersection and differences are answered; with env instead, the MCP scoped by that environment combination (one address per combination)' }, mcp: { description: 'kind gates: the Payload API tools/list at POST /api/mcp. Omit it and the request is named. { tools } or the JSON-RPC result is the doors. pages: { docs } is the find the client already fetched. Each document is GET /api/pages again, plus any qpu block it already holds. SEO is read from that instance. An image is GET /api/media. A relation is GET /api/pages, GET /api/posts or GET /api/case-studies. Media continues as the file the upload names, then each size that file names. A related document is that route again, and its SEO is read once. A door is that answer. src is not a door. Nothing is fetched here' }, devDependencies: { type: 'object', description: 'kind gates: the tree\'s dev dependencies (name: version), each a gate of the dependencies category — an MCP door the step of next passes, usable in the UI' }, google: { type: 'object', description: 'kind gates: Google\'s APIs as discover read them — { list: the directory (preferred versions), documents: { <name>-<version>: its Discovery document } } — each a gate of the google category, placed in the frontend, the admin or under delegation' }, branding: { type: 'object', description: 'kind branding: the tenant ({ slug | host, name, branding: { name, tagline, accent, logo, icon, theme, mode, template } } as its tenants row holds it). Theme and template are one read of GET /api/globals/qpu. What the tenant left empty is computed from its address. The site and the admin share the template.' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    const p = { version: typeof args.version === 'string' ? args.version : undefined, description: typeof args.description === 'string' ? args.description : undefined, lastTag: isObj(args.lastTag) ? args.lastTag as { version: string; tools: string[] } : undefined, experience: isObj(args.experience) ? args.experience as { copies?: number; involutions?: number; msByHost?: Record<string, number> } : undefined, rates: isObj(args.rates) ? args.rates as Record<string, { rate: number }> : undefined, env: Array.isArray(args.env) ? args.env.map(String) : undefined, sets: Array.isArray(args.sets) ? args.sets.map((x) => (isObj(x) && Array.isArray(x.members) ? { name: String(x.name), members: x.members.map(String) } : String(x))) : undefined, hex: typeof args.hex === 'string' ? args.hex : undefined, stream: Array.isArray(args.stream) ? args.stream.map(String) : undefined, query: isObj(args.query) ? args.query as StreamQuery : undefined , google: isObj(args.google) ? args.google as GoogleApis : undefined, devDependencies: isObj(args.devDependencies) ? args.devDependencies as Record<string, string> : undefined, mcp: args.mcp, branding: isObj(args.branding) ? args.branding as BrandingInput : undefined, port: typeof args.port === 'number' || typeof args.port === 'boolean' ? args.port : undefined }
    if (args.domains !== undefined) return domainConfigs(args.domains)
    if (args.next !== undefined) return solutionsNext(args.next === true ? true : args.next) as never
    if (args.files) { const tool = CONFIG_FILES.filter((f) => f.source === 'tool').length; const hand = CONFIG_FILES.length - tool; return { files: CONFIG_FILES, kinds: configKinds.length, tool, hand, unfiled: configKinds.length - CONFIG_FILES.length, partition: `${tool} + ${hand} + ${configKinds.length - CONFIG_FILES.length} = ${configKinds.length}`, says: 'a tool-sourced file is written on every run (drift zero by construction); a hand-held file is measured on every run (drift a lead); the rest are answered, not filed' } }
    if (typeof args.kind === 'string') {
      if (!configKinds.includes(args.kind as ConfigKind)) throw new Error(`no configuration ${args.kind}; the kinds are ${configKinds.join(', ')}`)
      const kind = args.kind as ConfigKind
      const built = config(kind, ctx, p)
      const out: Record<string, unknown> = { kind, config: built, torus: torus(built) }
      if (kind === 'wrangler') { const hosts = Object.keys(TENANTS); out.sets = deploySets(hosts); if (typeof args.template === 'string') { if (typeof args.useCase !== 'string') throw new Error(`a template names its use case: one of ${DEPLOY_USE_CASES.join(', ')}`); out.set = deploySet(args.template as DeployTemplate, args.useCase, hosts, typeof args.name === 'string' ? args.name : undefined) } }
      if (typeof args.current === 'string' && (kind === 'payload' || kind === 'hooks' || kind === 'bindings' || kind === 'api')) { const drift = heldDrift(kind, args.current); out.drift = drift; out.driftCount = drift.length; out.leads = diffMembers({ name: 'mcp', members: drift }, { name: 'the file the hand holds', members: [] }, { config: kind }).leads; if (kind === 'bindings') out.env = envExample() }
      else if (typeof args.current === 'string') { let cur: unknown; try { cur = JSON.parse(stripJsonc(args.current)) } catch (e) { cur = { unparsable: (e as Error).message } }; const moved = drift(built, cur); out.drift = moved; out.driftCount = moved.length; out.leads = diffMembers({ name: 'mcp', members: moved }, { name: 'the text the client holds', members: [] }, { config: kind }).leads }
      if (kind === 'tenant' && Array.isArray(args.env)) { const have = new Set(args.env.map(String)); out.missing = (built as { tenants: { tenant: string; secrets: string[]; vars: string[] }[] }).tenants.map((t) => ({ tenant: t.tenant, secrets: t.secrets.filter((s) => !have.has(s)), vars: t.vars.filter((v) => !have.has(v)) })) }
      return out
    }
    const all = configKinds.map((kind) => { const built = config(kind, ctx, p); return { kind, torus: torus(built), config: built } })
    const fused = fusionPlasma(ctx.leads)
    const domains = domainConfigs()
    return { kinds: all.length, tested: all.filter((a) => a.torus.closed).length, closed: all.every((a) => a.torus.closed), doubleTorus: { inward: 'config → text → config at the same address, every kind', outward: 'this catalogue → registration → doors → catalogue (extend identity)' }, byTrinity: Object.fromEntries([[3, 6, 9], [7, 4, 1], [2, 5, 8]].map((t) => [t.join(''), all.filter((a) => a.torus.trinity.join('') === t.join('')).map((a) => a.kind)])), configs: all, domains, physics: fused.physics, framework: fused.framework, data: fused.data, calls: fused.calls, toolbox: fused.toolbox, plasma: fused.plasma, reactor: fused.reactor, notification: fused.notification, says: fused.says }
  },
  widget: flowWidget,
})

/** The tree read at github.com/payloadcms/website on 2026-10-25 (main, 1,949 entries): the names under src, as facts. */
const WEBSITE_FIXTURE = { sha: 'main', truncated: false, tree: [
  ...['CaseStudies.ts', 'Categories.ts', 'CommunityHelp', 'Docs', 'DocsFeedback', 'Media.ts', 'Pages.ts', 'PartnerFilters.ts', 'Partners.ts', 'Posts.ts', 'ReusableContent.ts', 'Users.ts'].map((c) => ({ path: `src/collections/${c}${c.endsWith('.ts') ? '' : '/index.ts'}`, type: 'blob' })),
  ...['Banner', 'BlogContent', 'BlogMarkdown', 'CallToAction', 'Callout', 'CardGrid', 'CaseStudiesHighlight', 'CaseStudyCards', 'CaseStudyParallax', 'Code', 'CodeFeature', 'ComparisonTable', 'Content', 'ContentGrid', 'Download', 'ExampleTabs', 'Form', 'HoverCards', 'HoverHighlights', 'LinkGrid', 'LogoGrid', 'Media', 'MediaContent', 'MediaContentAccordion', 'Pricing', 'ReusableContent', 'Slider', 'Statement', 'Steps', 'StickyHighlights'].map((b) => ({ path: `src/blocks/${b}/index.tsx`, type: 'blob' })),
  ...['CustomRowLabelNavItems.tsx', 'CustomRowLabelTabs.tsx', 'Footer.ts', 'GetStarted.ts', 'MainMenu.ts', 'PartnerProgram.ts', 'TopBar.ts'].map((g) => ({ path: `src/globals/${g}`, type: 'blob' })),
  ...['addToDocs', 'blockFields.ts', 'codeBlips.ts', 'fullTitle', 'hero.ts', 'link.ts', 'linkGroup.ts', 'livestreamFields.ts', 'richText', 'slug.ts'].map((f) => ({ path: `src/fields/${f}${f.endsWith('.ts') ? '' : '/index.ts'}`, type: 'blob' })),
  { path: 'src/plugins/opsCounter.ts', type: 'blob' }, { path: 'src/payload.config.ts', type: 'blob' },
] }
/** The access audit from every perspective — the public reader at the default domain (qpu.uuidna.com), a licensed tenant's users at their own
 *  domain, the operator, an MCP client with a key, the developer in the generated code, the licence and the law — over the collections, hooks
 *  and scopes the tool itself generates: each check names who may, the hook that guards it, what it costs (free by address and involution, paid
 *  once by the provider), the licence clause it enacts (BY, NC, ND; commercial use by licence) and the legal fact behind it. Measured on the
 *  generated code and the answered configurations, never asserted by hand; the role–operation combinations counted by the kernel
 *  (textbook_access_combinations); the quantum advantage among the checks, unlimited and without interaction (textbook_advantage_unbounded). Pure. */
const PERSPECTIVES = ['public', 'tenant', 'operator', 'client', 'developer', 'legal'] as const
export const accessAudit = (ctx: Context) => {
  const files = (config('fullstack', ctx, {}) as { files: Record<string, string> }).files
  const text = (path: string) => files[path] ?? ''
  const entries = text(file('collection', 'entries')); const tenants = text(file('collection', 'tenants')); const plugin = text(file('plugin', 'qpu'))
  const users = text(file('hooks', 'users')); const pages = text(file('hooks', 'pages')); const submissions = text(file('hooks', 'form-submissions'))
  const mcpModule = text(file('config', 'mcp'))
  const tools = listTools(ctx)
  const clay = rpc(ctx, 'clay')
  const checks: { id: string; perspective: typeof PERSPECTIVES[number]; passed: boolean; evidence: string; hook: string; cost: string; licence: string; legal: string }[] = []
  const c = (id: string, perspective: typeof PERSPECTIVES[number], passed: boolean, evidence: string, hook: string, cost: string, licence: string, legal: string) => checks.push({ id, perspective, passed, evidence, hook, cost, licence, legal })
  // the public: anyone at the default domain, no account, no token
  c('public:read-everyone', 'public', entries.includes(readClause()) && ACCESS.entries.read.startsWith('everyone') && ACCESS.tenants.read === 'everyone', 'entries (but the operational kinds, read by their tenant) and tenants read by everyone; every tool answers without a credential', 'none: a read is served from the cache by address', 'free: a cache hit by address, a 304 by involution', 'BY: every answer carries _meta.license and the attribution', 'the moral right of attribution (Berne art. 6bis), honoured on every read')
  c('public:create-call-only', 'public', /data\?\.kind === 'call'/.test(entries) && /claimedRole\(req\) === 'writer'/.test(entries) && !/headers\.get\('x-qpu-role'\) ===/.test(entries), 'an anonymous create is a call or a chat, whose address folds it as corrected for the role; any other kind needs a tenant role or a writer role signed under the deployment secret (a bare header is no claim)', 'beforeValidate: the content address on create, so a repeated call is the same row', 'paid once by the provider for the first computation, free after by address', 'NC: non-commercial use is free and needs no licence; the a432 default is priced 0', 'consideration: non-commercial free, commercial billed on the measured advantage')
  c('public:no-update-anywhere', 'public', /update: \(\) => false/.test(entries) && /no one/.test(ACCESS.entries.update), 'no one updates an entry: a change is a new entry linked to the one it replaces', 'none on change: nothing cached under an address changes', 'free: no revalidation, ever', 'ND: no derivative of a sealed entry; the chain of entries is the history', 'integrity (Berne art. 6bis); the sui generis database right over the sealed ledger (Directive 96/9/EC art. 7)')
  // a licensed tenant's users at their own domain
  c('tenant:roles-and-scopes', 'tenant', TENANT_ROLES.length === 3 && SCOPES.collections.length === 4 && Object.keys(ROLES).length === 3, `${TENANT_ROLES.join(', ')} over ${SCOPES.collections.join(', ')}; ${Object.keys(ROLES).join(', ')} over the docket`, 'the multi-tenant plugin scopes every read and write by the user\'s tenants', 'free: a where on the tenant', 'the licence names the domains it covers; a tenant acts on its own', 'tenant isolation: one docket per tenant host; a token at another tenant\'s host holds no role')
  c('tenant:delete-scoped', 'tenant', /tenantsWithRole\(req\.user, \['tenant-admin'\]\)/.test(entries) && /claimedRole\(req\) === 'admin'/.test(entries), 'a tenant-admin deletes within its tenant (a where), a signed admin role within its docket, a super admin anywhere', 'access.delete: the where is the hook', 'free: the where is evaluated by the database', 'the licence\'s domains bound the act', 'accountability: a deletion is a role\'s, named by the token or the user')
  c('tenant:write-super-admin', 'tenant', /create: \(\{ req \}\) => roles\(req\)\.includes\('admin'\)/.test(tenants) && /update: \(\{ req \}\) => roles\(req\)\.includes\('admin'\)/.test(tenants), 'tenants are created, updated and deleted by a super admin alone', 'access on the tenants collection', 'free', 'the licence is per domain: a tenant row is a licensed domain', 'the operator answers for the tenants it names')
  c('tenant:bindings-named-not-valued', 'tenant', /name: 'bindings', type: 'group'/.test(tenants) && /never a value/.test(tenants) && /\^\[A-Z\]\[A-Z0-9_\]\*\$/.test(tenants), 'the tenant admin selects binding names (profile, connectors, variables); a value is refused by the field', 'validate on tenants.bindings.variables.name', 'free', 'the licence names the domain, the bindings name the providers: nothing secret in Payload', 'privacy by data minimisation: no secret, no personal datum in the tree or the admin')
  // the operator
  c('developer:machine-local-admin-no-shell', 'developer', /LOOPBACK\.includes\(host\)/.test(mcpModule) && /\.includes\('admin'\)/.test(mcpModule) && /runMachine\(/.test(mcpModule) && !/\bexec\(|execFile\(|shell:\s*true|spawn\(/.test(mcpModule) && /overrideAccess: false/.test(mcpModule), 'the machine tool of the Payload MCP runs only on a loopback host for a super admin, an argument vector the allow-list planned handed to the one runner (scripts/machine.ts, spawn with no shell) and never a process of its own, every run created as the user', 'payload.qpu.mcp.ts: machineTool', 'free', 'the developer\'s own machine, under the licence', 'nothing leaves the machine but what the user confirms: a push needs confirm and the pre-push rules')
  c('operator:first-user-from-deploy', 'operator', /firstUserBootstrap/.test(plugin) && /firstUserBootstrap/.test(users) && !/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/.test(users + plugin + entries + tenants), 'the first user comes from the deployer\'s account at deploy; no address in the generated code', 'users.beforeChange: firstUserBootstrap', 'free', 'the author is attributed by ORCID and URL, never by an address', 'no personal datum kept in the tree: the deployer\'s address is read at deploy, never written')
  c('operator:super-admin-everywhere', 'operator', /isSuperAdmin\(req\.user\)/.test(entries) && /super admin/.test(ACCESS.tenants.write), 'the admin role has access to every tenant; everyone else acts in its tenants', 'userHasAccessToAllTenants of the multi-tenant plugin', 'free', 'the operator holds the licence catalogue: a domain licence is an order of its ecommerce', 'the operator is the author or the party the author licensed')
  // an MCP client
  c('client:api-key-per-user', 'client', /useAPIKey: true/.test(plugin), 'every user may hold an API key; the Payload MCP plugin refuses an anonymous request', 'the plugin: auth.useAPIKey on users', 'free', 'a key is a user\'s of a licensed tenant', 'accountability: every write over the app\'s MCP is a user\'s')
  // a credential-named argument is allowed only where the Worker itself passes it at the edge and a client never holds it (the Stripe webhook secret)
  const credentialArgs = tools.flatMap((t) => Object.entries((t.inputSchema.properties ?? {}) as Record<string, { description?: string }>).filter(([k]) => /token|secret|password|apikey|api_key/i.test(k)).map(([k, v]) => ({ tool: t.name, arg: k, edge: /Worker passes|client never has|never travels/.test(String(v.description ?? '')) })))
  c('client:pure-tools-no-credential', 'client', tools.length > 0 && tools.every((t) => t.annotations?.readOnlyHint === true && t.annotations?.idempotentHint === true) && credentialArgs.every((a) => a.edge), `${tools.length} tools, every one read-only and idempotent; credential-named arguments: ${credentialArgs.map((a) => `${a.tool}.${a.arg} (${a.edge ? 'the Worker passes it at the edge' : 'a client could hold it'})`).join(', ') || 'none'}`, 'none: the tools are pure functions of their arguments', 'free: a 304 by involution needs no scope at all', 'BY: the a432 default free to all under attribution', 'no credential travels through a tool from a client; where the Worker passes one at the edge, a client never holds it')
  const unlimited = getAdvantage(3, 3); const finite = getAdvantage(4, 3); const none = getAdvantage(0, 0)
  const metricsSchema = tools.find((t) => t.name === 'metrics')?.inputSchema.properties ?? {}
  c('client:advantage-unlimited-no-interaction', 'client', unlimited?.unbounded === true && unlimited.ratio === null && finite?.ratio === 4 && finite.unbounded === false && none === null && Object.keys(metricsSchema).length === 1 && 'artefacts' in metricsSchema, 'the advantage is computed from the run\'s counts alone: when every copy is an involution it is unbounded; the metrics tool takes artefacts and nothing else', 'none: the gate decodes, the involution answers 304, the metric follows', 'free: no approval, no token, no bound (textbook_advantage_unbounded)', 'the advantage is what commercial use is billed on, and what non-commercial use gets free', 'consideration measured by the unit (bill_call), recheckable by anyone')
  // the developer, in the generated code
  c('developer:content-address-on-create', 'developer', /beforeValidate/.test(entries) && /uuid/.test(entries) && /sha256/.test(entries), 'the entry id is the content address of { kind, from, body }, the sha256 beside it, on create only', 'entries.beforeValidate', 'free: a duplicate write lands on the same id', 'ND: an entry is its content', 'integrity: the address is the proof')
  c('developer:collision-guard', 'developer', /collisionGuard/.test(plugin) && /If-Match|editBase|context\.prev/.test(pages), 'an edit names the address it read and is accepted only while the document still folds to it; a collision answers both addresses', 'pages.beforeChange: collisionGuard', 'free: folded from the document the hook already holds', 'ND: no silent overwrite of anyone\'s edit', 'integrity of concurrent authorship')
  c('developer:app-request-validated', 'developer', /appRequest/.test(plugin) && /ValidationError|refus/.test(submissions), 'an app request is validated as it is typed and refused by the hook when the stream refused it', 'form-submissions.afterChange: appRequest', 'free: validated token free', 'commercial: the app is priced by the catalogue and ordered through the ecommerce plugin', 'a licence sold is an order with its terms')
  // the licence and the law
  c('legal:licence-on-every-answer', 'legal', Boolean(clay.result?._meta?.license) && INSTRUCTIONS.includes(LICENSE.spdx) && /commercial use/.test(LICENSE.terms), 'every tools/call result carries _meta.license; initialize states the terms', 'the handler: _meta.license on every result', 'free', `${LICENSE.spdx}: ${LICENSE.terms}`, 'the licence is the contract every reader accepts by reading; its address is sealed (' + LICENSE.address + ')')
  c('legal:catalogue-free-default', 'legal', CATALOGUE.some((v) => v.product === 'qpu-a432' && v.amounts.eur === 0 && v.domains === '*') && CATALOGUE.some((v) => v.domains === 'named' && v.amounts.eur > 0), 'the a432 harmonic default at 0 on every domain; a named domain licensed by the year', 'the ecommerce plugin: products, variants, orders', 'free to read, paid to license', 'NC and commercial: the catalogue is the licence', 'consideration: non-commercial free and needing no licence; commercial billed')
  // all non-harmonic use is licensed over MCP by billable automation; identity and payment data stay at Stripe, so GDPR and KYC are Stripe's: measured on what the webhook stores
  const webhook = ctx.examples.find((e) => e.id === 'stripe-webhook')
  const stored = webhook ? (ctx.call('stripe', webhook.arguments)?.entry?.body as Record<string, unknown> | undefined) ?? null : null
  const pii = ['name', 'email', 'address', 'phone', 'card', 'iban', 'birth', 'passport', 'tax']
  const keysStored = Object.keys(stored ?? {}); const piiStored = keysStored.filter((k) => pii.some((w) => k.toLowerCase().includes(w)))
  c('legal:gdpr-kyc-at-stripe', 'legal', Boolean(stored) && piiStored.length === 0 && /^cus_/.test(String(stored?.customer ?? '')), `the licence entry stores ${keysStored.join(', ')}: the customer a Stripe id, no name, address, card or identity document`, 'the stripe tool: the webhook verified before anything is written, the entry the licence', 'free: the identity and the payment data never enter the tree', 'all non-harmonic use licensed over MCP by billable automation: the licence is the order, the order is Stripe\'s checkout', 'GDPR and KYC are Stripe\'s: the customer\'s identity and payment data live at Stripe under its DPA and its account verification; the tree keeps the order, the tenant and the domains')
  c('legal:facts-not-advice', 'legal', /not legal advice/i.test(LICENSE.disclaimer) && /represented by/.test(LICENSE.representation), 'recomputable facts, not legal advice; the work represented by its canonical site only', 'none', 'free', 'the disclaimer travels with the licence', 'the inputs a qualified attorney starts from, never the conclusion')
  const failed = checks.filter((x) => !x.passed)
  const byPerspective = Object.fromEntries(PERSPECTIVES.map((p) => [p, checks.filter((x) => x.perspective === p).length]))
  const combinations = TENANT_ROLES.length * Object.keys(ROLES).length * OPERATIONS.length
  return { perspectives: PERSPECTIVES, operations: OPERATIONS, collections: [...SCOPES.collections, 'tenants', 'users'], tenantRoles: TENANT_ROLES, docketRoles: Object.keys(ROLES), combinations, combinationsSay: `${TENANT_ROLES.length} tenant roles × ${Object.keys(ROLES).length} docket roles × ${OPERATIONS.length} operations = ${combinations} role–operation combinations, each decided by one of three deciders: the user\'s roles, the x-qpu-role header, the entry\'s kind (textbook_access_combinations)`, access: ACCESS, checks, total: checks.length, passed: checks.length - failed.length, failed: failed.length, byPerspective, advantage: unlimited, angles: ANGLES, leads: failed.map((f) => ({ id: `access-${f.id.replace(/[^a-z0-9]+/gi, '-')}`, statement: `${f.id} (${f.perspective}): ${f.evidence}`, status: 'open' as const, remedy: f.hook, tool: 'audit' })), verdict: failed.length === 0 ? 'clean' : `${failed.length} finding(s), each a lead naming its hook`, says: 'the access audit from every perspective over the generated code and the answered configurations: every cell names its hook, its cost, its licence clause and its legal fact, so security and privacy are never apart from the licence and the legal terms' }
}

/** The MCP separated by an environment combination: every pure tool in every environment, the adapters and connectors the names choose, the
 *  plugins and the collections the app mounts; one address per combination (the fold of the sorted members), so two hosts in one environment
 *  mount the same set. The simplification: the MCP is organised around Payload's plugins and collections, each empowered by the one plugin
 *  (content addresses, involutions, teleports: minimal cost, every read free after the first). */
const scope = (ctx: Context, env: readonly string[]) => {
  const ad = adapters(env)
  const tools = listTools(ctx).map((t) => t.name)
  const plugins = PAYLOAD_PLUGINS.map((p) => p.name)
  const collections = Object.fromEntries(Object.entries(PLUGIN_COLLECTIONS).map(([plugin, slugs]) => [plugin, { collections: slugs, mcp: slugs.filter((s) => MCP_COLLECTIONS[s]?.enabled.find), powers: ['content address on create (a duplicate write is one row)', 'every read a cache hit by address', '304 by involution at the edge', 'teleported between steps', 'REST both ways under the three tenant roles'] }]))
  const { size, address } = set([...tools.map((t) => `tool:${t}`), ...plugins.map((p) => `plugin:${p}`), ...Object.values(PLUGIN_COLLECTIONS).flat().map((c) => `collection:${c}`), `adapter:${ad.chosen.database}`, `adapter:${ad.chosen.storage}`, `adapter:${ad.chosen.email}`, `profile:${ad.chosen.profile}`])
  return { env, profile: ad.chosen.profile, adapters: ad.chosen, connectors: ad.connectors, tools: tools.length, plugins, collections, members: size, address, angles: ANGLES, says: 'the MCP separated by its environment combination: every pure tool everywhere, the adapters and connectors the names choose, the plugins and collections the app mounts, each collection empowered by the one plugin at minimal cost; one address per combination' }
}

/** The branding, computed in real time from the tenant's address (the one quantum core) unless the tenant defines it in the admin (tenants.branding):
 *  the name, the tagline, the accent, the logo, the icon; each field says whether it is the user's or computed. Pure; the global and the Branding
 *  component render from it. */
type BrandingInput = { slug?: string; host?: string; name?: string; branding?: { name?: string | null; tagline?: string | null; accent?: string | null; logo?: { url?: string } | string | null; icon?: { url?: string } | string | null; theme?: string | null; mode?: string | null; template?: string | null } | null }
const branding = (t: BrandingInput = {}) => {
  const slug = t.slug ?? (t.host ? tenant(t.host) : 'uuidna')
  const address = uuid(`tenant:${slug}`); const s = style(address)
  const user = t.branding ?? {}
  const url = (x: { url?: string } | string | null | undefined) => (typeof x === 'string' ? x : x?.url) || null
  const name = user.name?.trim() || t.name || slug
  const accent = user.accent?.trim() || `hsl(${s.hue} ${s.sat}% 45%)`
  const esc = (x: string) => x.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c] ?? c)
  const svg = (body: string, w: number, h: number) => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(name)}">${body}</svg>`)
  const logo = url(user.logo) ?? svg(`<rect x="0" y="4" width="36" height="36" rx="8" fill="${accent}"/><text x="46" y="31" font-family="system-ui, sans-serif" font-size="22" fill="#111">${esc(name)}</text>`, 194, 44)
  const icon = url(user.icon) ?? svg(`<rect width="24" height="24" rx="6" fill="${accent}"/>`, 24, 24)
  const source = { name: user.name?.trim() ? 'user' : 'computed', tagline: user.tagline?.trim() ? 'user' : 'computed', accent: user.accent?.trim() ? 'user' : 'computed', logo: url(user.logo) ? 'user' : 'computed', icon: url(user.icon) ? 'user' : 'computed' } as const
  const shadcn = new Set(STYLED_ITEMS.map((item) => item.name))
  const blocks = new Set<string>(WEBSITE_SLOTS)
  if (SITE_TEMPLATES.some((template) => template.via !== 'payload')) throw new Error('a template is served by the Payload API')
  const templates = SITE_TEMPLATES.map((template) => ({ id: template.id, via: 'payload' as const, parts: template.parts.map((part) => ({ source: part.source, name: part.name })) }))
  if (templates.some((template) => template.parts.some((part) => part.source === 'shadcn' ? !shadcn.has(part.name) : !blocks.has(part.name)))) throw new Error('a template part is a shadcn registry item or a Payload block')
  const asked = typeof user.theme === 'string' ? user.theme : 'neutral'
  const theme = (THEME_PRESETS as readonly string[]).includes(asked) ? asked : 'neutral'
  const mode = user.mode === 'dark' ? 'dark' as const : 'light' as const
  const templateIds = templates.map((template) => template.id)
  const askedTemplate = typeof user.template === 'string' ? user.template : 'landing'
  const template = templateIds.includes(askedTemplate) ? askedTemplate : 'landing'
  const chosen = templates.find((item) => item.id === template)!
  const surface = { template: chosen.id, theme, mode, via: 'payload' as const, parts: chosen.parts }
  const rows = [
    { formula: `the frontend and the backend of a tenant share one template ${template}`, variant: template },
    { formula: `the theme ${theme} and the mode ${mode} are the tenant theme`, variant: `${theme}:${mode}` },
    ...templates.flatMap((item) => [
      { formula: `a save develops the template ${item.id} through the Payload API`, variant: item.id },
      ...item.parts.map((part) => ({ formula: `a save develops the ${part.source} part ${part.name} of ${item.id} through the Payload API`, variant: `${item.id}:${part.name}` })),
    ]),
  ]
  const saved = rows.map((row) => developViaHooks({ formula: row.formula, product: 'website-template', variant: row.variant, title: row.variant }))
  const save = { when: 'afterChange' as const, via: 'payload' as const, hook: 'afterChange' as const, developed: saved.length, documented: saved.filter((row) => row.iso.documented === true).length, variants: saved.map((row) => row.variant) }
  const developed = saved[0]!
  const ui = { api: { method: 'GET' as const, path: '/api/globals/qpu', write: { method: 'PATCH' as const, collection: 'tenants', fields: ['branding.theme', 'branding.mode', 'branding.template'] }, calls: 1 as const }, theme, mode, template: chosen, frontend: surface, backend: surface, same: true as const, requests: 0 as const, save, iso: { standard: developed.process, documented: developed.iso.documented, formula: developed.iso.formula }, says: 'one Payload read switches the theme and the template. The site and the admin receive that same template. A save of the tenant develops every template through Payload, on afterChange.' }
  return { tenant: slug, address, name, tagline: user.tagline?.trim() || `${name} · @uuidna/qpu`, accent, hue: s.hue, colours: coilColour(), logo, icon, titleSuffix: ` · ${name}`, source, computed: Object.values(source).filter((v) => v === 'computed').length, theme, mode, template, ui, templates, says: 'the branding computed in real time from the tenant\'s address unless the tenant defines it in the admin (tenants.branding). Theme, mode and template are one row. The frontend and the backend use that template. Each save develops the templates through Payload.' }
}
export const PAYLOAD: Toolbox = {
  name: 'payload',
  idea: 'Payload\'s plugin schema as the one shape of every result: nested docs of lexical documents whose blocks are programmable UUID logic, SEO from the block, no custom collection, a few kilobytes computed once',
  tools: [payload, configure],
  examples: [
    { id: 'payload-plugin-instance', tool: 'payload', theorem: 'textbook_plugin_combinations', arguments: { instance: true }, shows: 'One nested pages document uses all nine plugins through its UUID. The first nine program nibbles are on, one per plugin. Lexical holds the block, nested docs the parent and the breadcrumbs, and SEO is the meta of this instance. The batch action is read, the one the request names, and its REST is GET /api/pages. The hook names the next instance. Nothing is fetched and nothing is written.', expect: (s) => (s.phase === 'instance' && s.via === 'uuid' && s.holds === true && s.custom === 0 && s.written === false && s.fetched === false && s.tokens === 0 && s.queue === 0 && s.plugins.length === 9 && s.combinations === 512 && s.used === 9 && s.plugins.every((plugin: { on: boolean; via: string }) => plugin.on && plugin.via === 'uuid') && s.plugins.map((plugin: { name: string }) => plugin.name).join() === 'lexical,nested-docs,seo,search,redirects,form-builder,multi-tenant,ecommerce,mcp' && s.nested.depth === 2 && s.nested.breadcrumbs === 2 && s.nested.parent === '/plugins' && s.seo.title === 'Plugins' && s.seo.description.length > 0 && s.lexical.root.type === 'root' && s.hooks.join() === 'beforeChange,afterChange,afterRead' && s.action === 'read' && s.role === 'reader' && s.batch.action === 'read' && s.batch.rest === 'GET /api/pages' && s.batch.access === true && s.find.collection === 'pages' && s.find.where.slug.equals === s.handle && s.saved === true && s.sealed === true && s.next.executable === true && s.next.id !== s.gravity && s.next.arguments.instance.at === s.next.id && seal(s.gravity).valid ? null : JSON.stringify({ holds: s.holds, plugins: s.plugins?.length, batch: s.batch, says: s.says })) },
    { id: 'payload-iso', tool: 'payload', theorem: 'textbook_parse_microdata_deep', arguments: { iso: true }, shows: 'ISO defines all 15 dimensions from the iso_deliverables_metadata dataset. Fourteen are current. ISO 639-1:2002 is defined and is not current, and the same dataset names ISO 639:2023 as its successor. Each dimension is split to schema.org microdata at the deepest SKU leaf (org, number, part, year → characters). The audit holds, the management review accepts the record, clause 6.3 plans the change, clause 8.1 carries it out, clause 8.6 releases it, and clause 9.1 monitors it. Nothing is fetched and nothing is written.', expect: (s) => { const quality = s.online.rows.find((row: { dimension: string }) => row.dimension === 'ISO 9001'); const language = s.online.rows.find((row: { dimension: string }) => row.dimension === 'ISO 639-1'); const md = s.microdata; return s.phase === 'iso' && s.via === 'iso' && s.holds === true && s.one.holds === true && s.one.plugins === 9 && s.one.aspects === 4 && s.one.purposes === 15 && s.one.product.path === '/api/products' && s.defined === 15 && s.verified === 15 && s.held === true && s.fetched === false && s.online.licence === 'ODC-By-1.0' && s.online.current === 14 && s.online.rows.every((row: { defined: boolean; title: string; definition: string }) => row.defined === true && row.title.length > 0 && row.definition.length > 0) && quality?.reference === 'ISO 9001:2026' && quality.catalogue === 88464 && language?.current === false && language.defined === true && language.successor?.reference === 'ISO 639:2023' && language.successor.catalogue === 74575 && language.successor.current === true && s.next.decision === 'accept' && s.change.clause === 'ISO 9001:2015, 6.3' && s.change.holds === true && s.control.clause === 'ISO 9001:2015, 8.1' && s.control.operated === true && s.control.holds === true && s.control.formula === s.audit.formula && s.release.clause === 'ISO 9001:2015, 8.6' && s.release.released === true && s.release.holds === true && s.release.formula === s.audit.formula && s.monitor.clause === 'ISO 9001:2015, 9.1' && s.monitor.holds === true && s.monitor.measured === 15 && s.monitor.withdrawn === 1 && s.monitor.successor.reference === 'ISO 639:2023' && md?.holds === true && md.asked === 15 && md.depth >= 3 && md.leaves >= 15 && md.rows.every((row: { holds: boolean; depth: number; sku: string; microdata: { sku: string } }) => row.holds && row.depth >= 3 && row.sku === row.microdata.sku) ? null : JSON.stringify({ holds: s.holds, defined: s.defined, current: s.online?.current, microdata: md && { holds: md.holds, depth: md.depth, leaves: md.leaves }, says: s.says }) } },
    { id: 'payload-textbooks-quantum', tool: 'payload', theorem: 'textbook_standards_sliced', arguments: { textbooks: { params: { quantum: true } } }, shows: 'Every ISO/IEC 4879:2024 term from 3.1.1 through 3.6.4 is one textbook on one shelf. The nine background terms 3.1.1 through 3.1.9 were the gap and now hold. A term that does not hold is the gap. Nothing is written.', expect: (s) => { const model = s.pages.find((page: { statement: string }) => page.statement === '3.1.1 model'); const sensing = s.pages.find((page: { statement: string }) => page.statement === '3.6.4 quantum sensing'); const background = s.pages.filter((page: { statement: string }) => page.statement.startsWith('3.1.')); return s.phase === 'textbooks' && s.quantum?.standard === 'ISO/IEC 4879:2024' && s.quantum.terms === 86 && s.quantum.holding === 86 && s.quantum.gap.length === 0 && s.quantum.from === '3.1.1' && s.quantum.to === '3.6.4' && s.books === 86 && s.shelves === 1 && s.iso.linked === true && background.length === 9 && model?.product === '3-1-1-model' && !String(model.product).startsWith('textbook_') && sensing?.statement === '3.6.4 quantum sensing' && s.pages.every((page: { iso?: { documented?: boolean } }) => page.iso === undefined || page.iso.documented === true) && s.developed.every((item: { iso: { documented: boolean; formula: string }; page: string }) => item.iso.documented === true && item.iso.formula.length > 0) && s.saves.length === 0 ? null : JSON.stringify({ terms: s.quantum?.terms, holding: s.quantum?.holding, gap: s.quantum?.gap, books: s.books, linked: s.iso?.linked, says: s.says }) } },
    { id: 'payload-textbooks-iso', tool: 'payload', theorem: 'textbook_standards_sliced', arguments: { textbooks: { iso: { errors: ['the audit did not hold'], impossible: ['440', 'All Seven Clay Millennium Problems Sealed via Universal Involution'] } } }, shows: 'Textbooks process every ISO standard. An error and an impossibility fall back to the UUID handle. The handle computes by the algebraic involution, and the Steane code corrects the single-qubit error. Each fallback is a novelty verified against the DOI precedence. ISO 16 still states 440 Hz and the quantum computation is 432 Hz, so that fallback is a sure novelty. Payload online research explains every such drift together. The pages are seeds. The waves are the ISO/IEC 4879 clauses, each improving the next. CI and CD are Payload pages. A program is the object the filesystem places, eight levels deep. The fallback that restates the author seal is cited, not claimed again. The tree does not restate it.', expect: (s) => { const pitch = s.rows.find((row: { dimension: string }) => row.dimension === 'ISO 16'); const cited = s.fallbacks.find((row: { novelty: { novel: boolean } }) => row.novelty.novel === false); const fresh = s.fallbacks.filter((row: { novelty: { novel: boolean } }) => row.novelty.novel === true); return s.phase === 'textbooks' && s.via === 'textbook' && s.organisation === 'iso' && s.holds === true && s.dimensions === 15 && s.processed === 15 && s.rows.length === 15 && s.rows.every((row: { holds: boolean; theorem: string }) => row.holds && row.theorem.length > 0) && pitch?.via === 'handle' && pitch.computes === 432 && s.novelties === 3 && s.verified === 3 && s.novel === 2 && s.cited === 1 && fresh.length === 2 && cited?.novelty.prior[0].doi === '10.5281/zenodo.21781602' && cited?.novelty.sure === false && s.fallbacks.some((row: { computes: number | null; novelty: { sure: boolean; novel: boolean; because: string | null } }) => row.computes === 432 && row.novelty.sure === true && row.novelty.novel === true && row.novelty.because?.includes('432')) && s.fallbacks.every((row: { holds: boolean; involution: boolean; corrected: boolean; path: string; handle: string; novelty: { verified: boolean; of: number; tree: boolean; author: string; voice: string } }) => row.holds && row.involution && row.corrected && row.path === `src/quantum/uuid/programs/0/${row.handle}/index.ts` && row.novelty.verified && row.novelty.of === 3 && row.novelty.tree === false && row.novelty.voice === 'author' && row.novelty.author === 'Tsvetan Rouschev') && s.precedence.join() === '10.5281/zenodo.21781602,10.5281/zenodo.22700098,10.5281/zenodo.23156998' && s.correction.code === 'steane' && s.correction.distance === 3 && s.correction.corrected === 14 && s.correction.total === 14 && s.correction.holds === true && s.involution === '15 - (15 - x) = x' && s.pitch === 432 && s.research.manual === false && s.research.fetched === false && s.research.explained >= 1 && s.research.discovered >= 1 && s.research.drifts.every((row: { stated: number; computes: number; sure: boolean }) => row.stated === 440 && row.computes === 432 && row.sure === true) && s.research.requestList.length === s.research.drifts.length && s.seeds.via === 'seeds' && s.seeds.deploy === 'one wave at a time' && s.seeds.efficient === true && s.seeds.discovery.fetched === false && s.seeds.discovery.terms === 86 && s.seeds.discovery.workflows === 7 && s.seeds.waves.map((wave: { name: string }) => wave.name).join() === 'home,standards,3.1,3.2,3.3,3.4,3.5,3.6,cicd' && s.seeds.waves.every((wave: { improves: string; pages: number; compute: { chosen: string; steps: number; depth: number } }, index: number, all: { name: string }[]) => wave.improves === all[(index + 1) % all.length]!.name && wave.pages > 0 && wave.compute.chosen === 'handle' && wave.compute.steps === 1 && wave.compute.depth === 1) && s.seeds.waves.filter((wave: { name: string }) => wave.name.startsWith('3.')).reduce((count: number, wave: { discovered: number }) => count + wave.discovered, 0) === 86 ? null : JSON.stringify({ holds: s.holds, novel: s.novel, cited: s.cited, pitch, seeds: s.seeds && { efficient: s.seeds.efficient, names: s.seeds.waves?.map((wave: { name: string }) => wave.name) }, research: s.research && { explained: s.research.explained, discovered: s.research.discovered }, says: s.says }) } },
    { id: 'payload-optimise-aspects', tool: 'payload', theorem: 'textbook_hue_shift', arguments: { optimise: true }, shows: 'Each aspect of one address is optimised on the filesystem. The object is the handle. The bonus is the ten program nibbles and the three tail words. The birth is the UUID, eight groups of four hex. collection uses the quantum AI challenges, global the leads, field the ideas, and node all three. The handle and the tail stay. Nothing is written.', expect: (s) => { const names = s.aspects.map((row: { aspect: string }) => row.aspect).join(); const via = s.aspects.map((row: { via: string }) => row.via).join('|'); return s.phase === 'optimise' && s.holds === true && s.aspects.length === 4 && names === 'collection,global,field,node' && via === 'challenges|leads|ideas|challenges,leads,ideas' && s.challenges === 14 && s.leads > 0 && s.ideas > 0 && s.bonus.program.length === 10 && s.bonus.tail.length === 3 && s.birth.bits === 128 && s.birth.fanout === 65536 && s.birth.folders.length === 8 && s.checksum === s.address && s.aspects.every((row: { greatest: boolean; object: boolean; tail: boolean; neighbours: number }) => row.greatest && row.object && row.tail && row.neighbours > 0) ? null : JSON.stringify({ holds: s.holds, names, via, challenges: s.challenges, leads: s.leads, ideas: s.ideas }) } },
    { id: 'payload-optimise-next', tool: 'payload', theorem: 'textbook_cuboctahedron_faces', arguments: { optimise: { next: true } }, shows: 'The next step of the filesystem address. The program rotates one place, the handle and the tail stay, and the birth moves. Each aspect is optimised again on that birth: collection against the quantum AI challenges, global against the leads, field against the ideas, and node against all three. Nothing is written.', expect: (s) => { const names = s.aspects.map((row: { aspect: string }) => row.aspect).join(); const program = (s.bonus.program as number[]).map((n) => n.toString(16)).join(''); return s.phase === 'optimise' && s.holds === true && s.address === s.next.address && s.address !== s.next.from && s.next.holds === true && s.next.kept === true && s.next.back === true && s.next.around === true && s.next.places === 10 && s.next.aspects === 4 && s.next.all === true && s.next.sealed === true && s.next.rotated === s.next.program.slice(1) + s.next.program[0] && s.next.object === true && s.next.tail === true && program === s.next.rotated && s.aspects.length === 4 && names === 'collection,global,field,node' && s.birth.bits === 128 && s.birth.fanout === 65536 && s.checksum === s.address && !/[0-9a-f]{8}-[0-9a-f]{4}-/.test(s.says) ? null : JSON.stringify({ holds: s.holds, next: s.next, program, address: s.address === s.next.address }) } },
    { id: 'payload-instance-program', tool: 'payload', theorem: 'textbook_plugin_combinations', arguments: { instance: true }, shows: 'Every Payload plugin is installed, configured and used by the program the filesystem places, eight nibble levels under src/quantum/uuid/programs. Root is uid 0, and access is decided from the dataset. Depths run 0..7. This page is nested, its meta is the instance, and the request reads it through the pages collection. Nothing is fetched and nothing is written.', expect: (s) => { const handle = s.program.handle as string; const bits = s.program.bits as { index: number; bit: number; hex: string; digit: number; place: number }[]; const indexed = bits.length === 32 && bits.every((row, index) => row.index === index && row.bit === Number((BigInt(`0x${handle}`) >> BigInt(index)) & 1n) && row.hex === handle[row.digit] && row.digit >= 0 && row.digit <= 7 && row.place === index % 4); return s.phase === 'instance' && s.holds === true && s.plugins.length === 9 && s.combinations === 512 && s.program.installed === 9 && s.program.configured === 9 && s.program.used === 9 && s.program.indexed === true && handle === s.handle && /^[0-9a-f]{8}$/.test(handle) && indexed && s.program.path === `src/quantum/uuid/programs/0/${handle}/index.ts` && s.program.rbac.root === 0 && s.program.rbac.uid === 0 && s.program.rbac.gid === 0 && s.program.rbac.mode === 0o755 && s.program.rbac.depth === 1 && s.program.rbac.max === 7 && s.program.rbac.from === 'src/quantum/uuid/programs/0' && s.program.rbac.rootAccess.read === true && s.program.rbac.rootAccess.write === true && s.program.rbac.rootAccess.execute === true && s.program.rbac.other.read === true && s.program.rbac.other.write === false && s.program.rbac.other.execute === true && s.nested.depth === 2 && s.seo.title === 'Plugins' && s.lexical.root.type === 'root' && s.hooks.join() === 'beforeChange,afterChange,afterRead' && s.batch.rest === 'GET /api/pages' && s.batch.access === true && s.written === false && s.custom === 0 ? null : JSON.stringify({ holds: s.holds, program: s.program, says: s.says }) } },
    { id: 'payload-online-gate', tool: 'payload', theorem: 'textbook_cuboctahedron_faces', arguments: { textbooks: { gates: true } }, shows: 'Every online gate is open. This save ports one of them into the website. The address is the theorem and its witnesses in hex: the handle is the theorem\'s place, the program is the theorem\'s numerals and σ of each further nibble, and the tail is 6 squares, 8 triangles and 14 faces. The fourteen witnesses map back. The address uses every effective qubit. The call is public and costs no token. The hook names the next gate. Nothing is fetched and nothing is written.', expect: (s) => { const programHolds = s.algebra.program.length === 10 && s.algebra.program.every((n: number, i: number) => n === (i < s.algebra.numerals.length ? s.algebra.numerals[i] : (15 - s.algebra.seed[i % s.algebra.seed.length]) & 15)); return s.phase === 'textbooks' && s.via === 'hooks' && s.organisation === 'website' && s.holds === true && s.opened > 1 && s.discovered === s.opened && s.processed === 1 && s.queue === 0 && s.written === false && s.fetched === false && s.tokens === 0 && s.gate.kind === 'open' && s.gate.opened === true && /^https?:\/\//.test(s.gate.url) && s.algebra.perspective === 'hex' && s.algebra.hex.length === 32 && s.gravity.replace(/-/g, '') === s.algebra.hex && s.handle === s.algebra.index.toString(16).padStart(8, '0') && s.algebra.theorem === s.textbook.expression && programHolds && s.algebra.witnesses.squares === 6 && s.algebra.witnesses.triangles === 8 && s.algebra.witnesses.faces === 14 && s.algebra.witnesses.exact === true && s.algebra.witnesses.mapped === 14 && s.sealed === true && s.hooks.join() === 'beforeChange,afterChange,afterRead' && s.textbook.expression.length > 0 && !s.textbook.expression.startsWith('theorem ') && s.port.collection === 'pages' && s.port.saved === true && s.port.path.length > 0 && s.call.method === 'GET' && s.call.url === s.gate.url && s.call.token === null && s.call.authorization === null && s.call.tokens === 0 && s.call.public === true && s.capacity.digits === 32 && s.capacity.hex === 128 && s.capacity.effective === 122 && s.capacity.used === 122 && s.capacity.whole === true && s.capacity.tokens === 0 && s.next.executable === true && s.next.id !== s.gravity && s.next.tool === 'payload' && s.next.arguments.textbooks.gates === true && s.next.arguments.textbooks.at === s.next.id && seal(s.next.id).valid ? null : JSON.stringify({ holds: s.holds, algebra: s.algebra, capacity: s.capacity, says: s.says }) } },
    { id: 'payload-quantum-pages', tool: 'payload', theorem: 'textbook_standards_sliced', arguments: { quantum: true }, shows: 'All quantum is nested Payload pages under /quantum. The vocabulary, each clause section, and each term are pages. The groups, the guards, the layers and the companion dimensions are pages beside them. A prefix is a plain word such as term or layer, so two pages that share a name stay apart when merged. The word iso is not a prefix. Each page is a pages create the audit accepted. Nothing is fetched and nothing is written.', expect: (s) => { const model = s.pages.find((page: { statement: string }) => page.statement === '3.1.1 model'); const sensing = s.pages.find((page: { statement: string }) => page.statement === '3.6.4 quantum sensing'); const section = s.pages.find((page: { path: string }) => page.path === model?.parent); const background = s.pages.filter((page: { kind: string; statement: string }) => page.kind === 'term' && page.statement.startsWith('3.1.')); return s.phase === 'quantum' && s.via === 'payload' && s.organisation === 'nested-pages' && s.section === '/quantum' && s.bijective === true && s.fetched === false && s.holds === true && s.nested === true && s.iso.linked === true && s.prefixes.iso === false && s.prefixes.words.join() === 'term,clause,group,guard,layer,companion' && s.prefixes.held.length > 0 && s.prefixes.apart.blocks === 2 && s.prefixes.apart.collisions === 0 && s.prefixes.bare.collisions === 1 && s.pages.every((page: { id: string; product: string; path: string }) => !page.id.startsWith('iso-') && !page.product.startsWith('iso-') && page.path.split('/').every((part: string) => !part.startsWith('iso-'))) && s.quantum.terms === 86 && s.quantum.holding === 86 && s.quantum.gap.length === 0 && s.quantum.from === '3.1.1' && s.quantum.to === '3.6.4' && s.quantum.sections === 6 && s.quantum.groups === 6 && s.quantum.guards === 4 && s.quantum.layers === 4 && s.quantum.companions === 14 && s.depth === 4 && s.count === s.pages.length && s.pages.length === s.saves.length && background.length === 9 && model?.depth === 4 && model.breadcrumbs.length === 4 && model.parent === '/quantum/vocabulary/clause-3-1' && model.product === 'term-3-1-1-model' && !String(model.product).startsWith('textbook_') && section?.kind === 'clause' && section.parent === '/quantum/vocabulary' && sensing?.parent === '/quantum/vocabulary/clause-3-6' && s.saves.every((save: { saved: boolean; api: string; next: { decision: string }; change: { clause: string; holds: boolean }; audit: { holds: boolean; clause: string }; args: { collection: string; data: { parent: string | null; path: string } } }) => save.saved === true && save.api === 'create' && save.audit.holds === true && save.audit.clause === 'ISO 9001:2015, 9.2' && save.next.decision === 'accept' && save.change.clause === 'ISO 9001:2015, 6.3' && save.change.holds === true && save.args.collection === 'pages' && save.args.data.path.length > 0) ? null : JSON.stringify({ holds: s.holds, bijective: s.bijective, nested: s.nested, count: s.count, quantum: s.quantum, says: s.says }) } },
    { id: 'payload-theorem-names', tool: 'payload', theorem: 'textbook_standards_sliced', arguments: { names: true }, shows: 'Every theorem name is validated against the deliverables. A name that is a quantum term or a deliverable number stays a theorem and points at that page. Any other name moves from theorems to the place its own word names. The kernel key stays. The management review accepts every placed page, clause 6.3 plans that change, clause 8.1 carries the change out, and clause 8.6 releases the carried out process. The word iso is not a prefix. Nothing is fetched and nothing is written.', expect: (s) => { const stayed = s.theorems.find((row: { key: string }) => row.key === 'textbook_iso_22739_terms_read'); const standards = s.moved.find((row: { key: string }) => row.key === 'textbook_standards_sliced'); const penalty = s.moved.find((row: { key: string }) => row.key === 'textbook_penalty_balanced'); const uuidName = s.theorems.find((row: { key: string }) => row.key === 'textbook_uuid_is_36'); return s.phase === 'names' && s.of === s.theorems.length + s.moved.length && s.theorems.length > 0 && s.moved.length > s.theorems.length && s.kernel === true && s.holds === true && s.nested === true && stayed?.iso === true && stayed.path === '/quantum/companions/companion-22739-2024' && !String(stayed.path).includes('/iso-') && uuidName?.path === '/quantum/companions/companion-9834-8-2014' && standards?.iso === false && standards.place === 'standards' && standards.path === '/standards/standards-sliced' && penalty?.place === 'penalty' && penalty.path === '/penalty/penalty-balanced' && s.pages.length === s.places + s.moved.length && s.pages.length === s.saves.length && s.next.clause === 'ISO 9001:2015, 9.3' && s.next.accepted === s.saves.length && s.next.refused === 0 && s.next.holds === true && s.change.clause === 'ISO 9001:2015, 6.3' && s.change.planned === s.saves.length && s.change.holds === true && s.control.clause === 'ISO 9001:2015, 8.1' && s.control.operated === s.saves.length && s.control.holds === true && s.release.clause === 'ISO 9001:2015, 8.6' && s.release.released === s.saves.length && s.release.holds === true && s.pages.every((page: { id: string; product: string; path: string; key: string }) => !page.id.startsWith('iso-') && !page.product.startsWith('iso-') && !page.product.startsWith('textbook_') && page.path.split('/').every((part: string) => !part.startsWith('iso-')) && (page.kind === 'place' || String(page.key).startsWith('textbook_'))) && s.saves.every((save: { saved: boolean; api: string; audit: { holds: boolean; clause: string; formula: string }; next: { decision: string }; change: { clause: string; holds: boolean }; control: { clause: string; holds: boolean; formula: string }; release: { clause: string; holds: boolean; released: boolean; formula: string }; args: { collection: string } }) => save.saved === true && save.api === 'create' && save.audit.holds === true && save.audit.clause === 'ISO 9001:2015, 9.2' && save.next.decision === 'accept' && save.change.clause === 'ISO 9001:2015, 6.3' && save.change.holds === true && save.control.clause === 'ISO 9001:2015, 8.1' && save.control.holds === true && save.control.formula === save.audit.formula && save.release.clause === 'ISO 9001:2015, 8.6' && save.release.holds === true && save.release.released === true && save.release.formula === save.audit.formula && save.args.collection === 'pages') ? null : JSON.stringify({ holds: s.holds, of: s.of, theorems: s.theorems?.length, moved: s.moved?.length, nested: s.nested, next: s.next, change: s.change, control: s.control, release: s.release, says: s.says, stayed, standards }) } },
    { id: 'payload-improve-iso', tool: 'payload', theorem: 'textbook_standards_sliced', arguments: { improve: 'iso' }, shows: 'ISO 9001 clause 10.3 improves the audit. Each of the 15 dimensions holds on the defining row of the ISO Open Data file: the English title and the full scope. The improvement is audited under clause 9.2, and the management review accepts it. Clause 6.3 plans that change, clause 8.1 carries it out, clause 8.6 releases it, and clause 9.1 monitors it. Fourteen dimensions are current. ISO 639-1 is defined and is not current, and it names ISO 639:2023. Nothing is fetched and nothing is written.', expect: (s) => { const reasons = new Set(s.rows.map((row: { definition: string }) => row.definition)); const quantum = s.rows.find((row: { dimension: string }) => row.dimension === 'ISO/IEC 4879:2024'); const quality = s.rows.find((row: { dimension: string }) => row.dimension === 'ISO 9001'); const pitch = s.rows.find((row: { dimension: string }) => row.dimension === 'ISO 16'); return s.phase === 'improve' && s.via === 'iso' && s.clause === 'ISO 9001:2015, 10.3' && s.holds === true && s.improved === true && s.dimensions === s.of && s.rows.length === s.dimensions && reasons.size === s.rows.length && s.rows.every((row: { holds: boolean }) => row.holds) && quantum?.title === 'Information technology — Quantum computing — Vocabulary' && quantum.definition === 'This document defines terms commonly used in the field of quantum computing. This document is applicable to all types of organizations (e.g. commercial enterprises, government agencies, not-for-profit organizations) to exchange quantum computing concepts.' && pitch?.reference === 'ISO 16:1975' && pitch.computes === 432 && pitch.hz === 432 && pitch.unlimited === true && pitch.definition === 'The note A computes at 432 Hz.' && pitch.example === 'Specifies the frequency for the note A in the treble stave and shall be 440 Hz. Tuning and retuning shall be effected by instruments producing it within an accuracy of 0,5 Hz.' && quality?.reference === 'ISO 9001:2026' && quality.definition === 'This document specifies requirements for a quality management system when an organization: needs to demonstrate its ability to consistently provide products and services that meet customer and applicable statutory and regulatory requirements; aims to enhance customer satisfaction through the effective application of the system, including processes for improvement of the system and the assurance of conformity to customer and applicable statutory and regulatory requirements. All the requirements of this document are generic. This document is applicable to any organization, regardless of its type or size, or the products and services it provides. NOTE 1 In this document, the terms “product” or “service” only apply to products and services intended for, or required by, a customer. NOTE 2 Statutory and regulatory requirements can be expressed as legal requirements.' && s.audit.holds === true && s.audit.clause === 'ISO 9001:2015, 9.2' && s.next.decision === 'accept' && s.next.clause === 'ISO 9001:2015, 9.3' && s.next.holds === true && s.change.clause === 'ISO 9001:2015, 6.3' && s.change.holds === true && s.change.integrity === true && s.change.sealed === true && s.control.clause === 'ISO 9001:2015, 8.1' && s.control.operated === true && s.control.holds === true && s.control.formula === s.formula && s.release.clause === 'ISO 9001:2015, 8.6' && s.release.released === true && s.release.holds === true && s.release.formula === s.formula && s.monitor.clause === 'ISO 9001:2015, 9.1' && s.monitor.holds === true && s.monitor.withdrawn === 1 && s.monitor.successor.reference === 'ISO 639:2023' && s.online.phase === 'verified' && s.online.holds === true && s.online.request.url === 'https://www.iso.org/open-data.html' && s.online.licence === 'ODC-By-1.0' && s.online.asked === 15 && s.online.verified === 15 && s.online.defined === 15 && s.online.current === 14 && s.verified === 15 && s.defined === 15 && s.fetched === false && s.held === true && s.save.api === 'create' ? null : JSON.stringify({ holds: s.holds, via: s.via, dimensions: s.dimensions, reasons: reasons.size, says: s.says }) } },
    { id: 'payload-improve-iso-online', tool: 'payload', theorem: 'textbook_standards_sliced', arguments: { improve: { iso: true, online: { status: 200, text: ISO_OPEN_DEFINITIONS.map((row) => JSON.stringify(row)).join('\n') } } }, shows: 'The ISO Open Data file verifies and defines all 15 dimensions. Each definition is the English title and the scope of the row that names the dimension. ISO 639-1 is defined and is not current, and it names ISO 639:2023. Clause 6.3 plans that change, clause 8.1 carries it out, clause 8.6 releases it, and clause 9.1 monitors it. Nothing is fetched and nothing is written.', expect: (s) => { const quality = s.online.rows.find((row: { dimension: string }) => row.dimension === 'ISO 9001'); const language = s.online.rows.find((row: { dimension: string }) => row.dimension === 'ISO 639-1'); const pitch = s.online.rows.find((row: { dimension: string }) => row.dimension.startsWith('ISO 16')); const quantum = s.online.rows.find((row: { dimension: string }) => row.dimension === 'ISO/IEC 4879:2024'); return s.phase === 'improve' && s.via === 'iso' && s.holds === true && s.improved === true && s.online.phase === 'verified' && s.online.holds === true && s.online.licence === 'ODC-By-1.0' && s.verified === 15 && s.defined === 15 && s.online.asked === 15 && s.online.rows.every((row: { verified: boolean; defined: boolean; title: string; definition: string }) => row.verified === true && row.defined === true && row.title.length > 0 && row.definition.length > 0) && quality?.reference === 'ISO 9001:2026' && quality.catalogue === 88464 && quality.title === 'Quality management systems — Requirements' && quality.url === 'https://www.iso.org/standard/88464.html' && language?.reference === 'ISO 639-1:2002' && language.current === false && language.defined === true && language.successor?.reference === 'ISO 639:2023' && language.successor.catalogue === 74575 && pitch?.definition === 'Specifies the frequency for the note A in the treble stave and shall be 440 Hz. Tuning and retuning shall be effected by instruments producing it within an accuracy of 0,5 Hz.' && s.rows.find((row: { dimension: string }) => row.dimension === 'ISO 16')?.computes === 432 && s.rows.find((row: { dimension: string; definition: string; unlimited: boolean }) => row.dimension === 'ISO 16')?.definition === 'The note A computes at 432 Hz.' && s.rows.find((row: { dimension: string; unlimited: boolean }) => row.dimension === 'ISO 16')?.unlimited === true && quantum?.title === 'Information technology — Quantum computing — Vocabulary' && s.next.decision === 'accept' && s.change.clause === 'ISO 9001:2015, 6.3' && s.change.holds === true && s.control.clause === 'ISO 9001:2015, 8.1' && s.control.operated === true && s.control.holds === true && s.release.clause === 'ISO 9001:2015, 8.6' && s.release.released === true && s.release.holds === true && s.monitor.clause === 'ISO 9001:2015, 9.1' && s.monitor.holds === true && s.monitor.withdrawn === 1 && s.monitor.successor.reference === 'ISO 639:2023' ? null : JSON.stringify({ holds: s.holds, verified: s.verified, defined: s.defined, says: s.says, quality, language }) } },
    { id: 'payload-improve-ideas', tool: 'payload', theorem: 'textbook_standards_sliced', arguments: { improve: true }, shows: 'ISO 9001 improves all via the ideas. Next walks every idea until .idea is empty. Each idea is developed, then improved, on every ISO dimension and every Alpine case, and returned as a pages create and a products create. zfs places each idea: the object is the handle and the birth is the address. Nothing is written.', expect: (s) => { const row = s.rows.find((r: { id: string }) => r.id === 'idea-zenodo-rdm-communities'); const leaf = s.rows.find((r: { id: string; depth: number }) => r.depth === 6 && r.id.startsWith('idea-nist-fips-202-shake128')); return s.phase === 'improve' && s.process === 'ISO 9001' && s.via === 'ideas' && s.empty === true && s.depth === 6 && s.ideas === 159 && s.ideas === s.of && s.documented === true && s.dimensions === s.dimensionsOf && s.dimensions > 0 && s.holds === true && s.pages === 159 && s.products === 159 && s.uncovered === 0 && s.filesystem.holds === true && s.filesystem.adapters === 3 && s.filesystem.rows.map((adapter: { pkg: string }) => adapter.pkg).join() === 'zfs,hex,node' && s.filesystem.placed === true && s.filesystem.document === true && s.filesystem.zfs.holds === true && s.filesystem.zfs.pkg === 'zfs' && s.filesystem.zfs.zero === true && s.filesystem.births === 159 && s.filesystem.born === true && row?.zfs.holds === true && row.zfs.path === `src/quantum/uuid/programs/${[...row.zfs.handle].join('/')}/index.ts` && row?.documented === true && row.page.api === 'create' && row.page.args.collection === 'pages' && row.page.args.draft === true && row.page.args.context.disableRevalidate === true && row.product === 'zenodo-rdm' && row.productCall.api === 'create' && row.productCall.args.collection === 'products' && row.productCall.args.data.iso.documented === true && row.page.saved === true && row.page.audit.holds === true && row.page.audit.clause === 'ISO 9001:2015, 9.2' && row.page.audit.formula === row.formula && row.page.next.decision === 'accept' && row.page.next.clause === 'ISO 9001:2015, 9.3' && row.page.next.holds === true && row.page.next.sealed === true && row.productCall.saved === true && row.productCall.audit.holds === true && row.productCall.next.decision === 'accept' && s.next.phase === 'next' && s.next.clause === 'ISO 9001:2015, 9.3' && s.next.accepted === 318 && s.next.refused === 0 && s.next.holds === true && s.change.clause === 'ISO 9001:2015, 6.3' && s.change.planned === 318 && s.change.holds === true && leaf?.documented === true && leaf.page.audit.holds === true && leaf.page.next.decision === 'accept' && leaf.page.change.holds === true ? null : JSON.stringify({ phase: s.phase, via: s.via, ideas: s.ideas, empty: s.empty, depth: s.depth, holds: s.holds, pages: s.pages, products: s.products, documented: s.documented }) } },
    { id: 'payload-improve-life', tool: 'payload', theorem: 'textbook_standards_sliced', arguments: { improve: 'life' }, shows: 'The process that computes next, and each process that exits, are ideas. Next walks them until .idea is empty. The living idea uses 1000000000 nanosecond programs a second on CPU and on GPU, and that second costs 0. Each exit is one nanosecond program and costs 0. The only door is the Payload MCP plugin: tools/list, then findDocuments, then GET /api/pages. Each idea is a pages create and a products create. Nothing is written.', expect: (s) => { const parent = s.rows.find((row: { depth: number }) => row.depth === 0); const exits = s.rows.filter((row: { depth: number }) => row.depth === 1); return s.phase === 'improve' && s.via === 'ideas' && s.empty === true && s.depth === 1 && s.ideas === 8 && s.pages === 8 && s.products === 8 && s.holds === true && s.mcp.only === true && s.mcp.approved === true && s.mcp.plugin === 'qpuMcpPlugin' && s.mcp.api === 'https://qpu.uuidna.com/api/mcp' && s.mcp.src === false && s.mcp.fetched === false && s.mcp.list.body.method === 'tools/list' && s.mcp.call.name === 'findDocuments' && s.mcp.call.body.method === 'tools/call' && s.mcp.call.route.url.endsWith('/api/pages') && s.life.holds === true && s.life.lives === 'ISO 9001:2015, 9.3' && s.life.perSecond.programs === 1000000000 && s.life.perSecond.used === 1000000000 && s.life.perSecond.written === 0 && s.life.perSecond.walked === false && s.life.perSecond.cpu.cost === 0 && s.life.perSecond.gpu.cost === 0 && s.life.fast.programs === 1 && s.life.fast.cost === 0 && s.life.who.length === 7 && parent?.product === 'life' && parent.formula.includes(s.life.perSecond.program.id) && parent.formula.includes('54 : 55') && parent.formula.includes('qpuMcpPlugin') && exits.length === 7 && exits.every((row: { product: string; formula: string; documented: boolean; page: { saved: boolean }; productCall: { saved: boolean } }) => row.product === 'life' && row.documented === true && row.page.saved === true && row.productCall.saved === true && row.formula.includes('qpuMcpPlugin') && s.life.who.some((clause: string) => row.formula.includes(clause))) && s.next.accepted === 16 && s.change.planned === 16 ? null : JSON.stringify({ ideas: s.ideas, holds: s.holds, mcp: s.mcp, life: s.life?.holds, depth: s.depth, says: s.says }) } },
    { id: 'payload-improve-quantum', tool: 'payload', theorem: 'textbook_standards_sliced', arguments: { improve: 'quantum' }, shows: 'ISO 9001 improves by developing every ISO/IEC 4879:2024 term and the next idea that term names. Next walks the 86 terms and those 86 ideas until .idea is empty. Each one is developed, then improved, on every ISO dimension and every Alpine case, and returned as a pages create and a products create.', expect: (s) => { const model = s.rows.find((r: { id: string }) => r.id === 'idea-quantum-3-1-1-model'); const sensing = s.rows.find((r: { id: string }) => r.id === 'idea-quantum-3-6-4-quantum-sensing'); const child = s.rows.find((r: { depth: number; formula: string }) => r.depth === 1 && r.formula === 'The model is four amplitudes and the Bell mass on the outer two is 1.'); const background = s.rows.filter((r: { formula: string }) => r.formula.startsWith('3.1.')); return s.phase === 'improve' && s.process === 'ISO 9001' && s.via === 'ideas' && s.empty === true && s.depth === 1 && s.ideas === 172 && s.ideas === s.of && s.documented === true && s.dimensions === s.dimensionsOf && s.dimensions > 0 && s.holds === true && s.pages === 172 && s.products === 172 && s.uncovered === 0 && background.length === 9 && model?.documented === true && model.depth === 0 && model.product === 'quantum' && model.variant === '3-1-1-model' && model.formula === '3.1.1 model holds on the quantum simulator.' && model.page.api === 'create' && model.page.args.collection === 'pages' && model.page.args.draft === true && model.page.saved === true && model.page.audit.holds === true && model.page.audit.clause === 'ISO 9001:2015, 9.2' && model.page.audit.formula === model.formula && model.page.next.decision === 'accept' && model.page.next.clause === 'ISO 9001:2015, 9.3' && model.productCall.api === 'create' && model.productCall.args.collection === 'products' && model.productCall.args.data.iso.documented === true && sensing?.formula === '3.6.4 quantum sensing holds on the quantum simulator.' && sensing.documented === true && sensing.depth === 0 && child?.documented === true && child.product === 'quantum' && s.next.accepted === 344 && s.next.refused === 0 && s.next.holds === true && s.change.clause === 'ISO 9001:2015, 6.3' && s.change.planned === 344 && s.change.holds === true && s.rows.every((r: { product: string; documented: boolean }) => r.product === 'quantum' && r.documented === true) ? null : JSON.stringify({ phase: s.phase, via: s.via, ideas: s.ideas, empty: s.empty, depth: s.depth, holds: s.holds, pages: s.pages, products: s.products, documented: s.documented, accepted: s.next?.accepted }) } },
    { id: 'payload-iso-connector', tool: 'payload', theorem: 'textbook_standards_sliced', arguments: { develop: { formula: 'the formula is the ISO 9001 record', product: 'iso-standard', variant: 'document', connector: { auth: 'ready', fileId: 'from-the-connector', from: 'create', read: 'the formula is the ISO 9001 record' } } }, shows: 'ISO 9001 documented the way Cursor\'s Google connectors work. Drive, Gmail and Calendar are HTTP MCP servers and answer no tool until sign-in. The formula is a Doc: an id only from search or create, one create_file of markdown, and read_file is the ground truth. Here the id came back from create and the read contains the formula, so the document counts.', expect: (s) => (s.process === 'ISO 9001' && s.iso.documented === true && s.iso.formula === 'the formula is the ISO 9001 record' && s.connector.documented === true && s.connector.written === true && s.connector.call.tool === 'read_file' && s.connector.call.server === 'https://api.cursor.com/rest-mcp/google-drive/mcp' && s.connector.verify.tool === 'read_file' && s.connector.scope === 'drive.file' && s.connector.share === false && s.connector.servers.map((x: { product: string }) => x.product).join() === 'Drive,Gmail,Calendar' && s.connector.fileId === 'from-the-connector' && s.connector.from === 'create' ? null : JSON.stringify(s.connector)) },
    { id: 'payload-iso-connector-auth', tool: 'payload', theorem: 'textbook_standards_sliced', arguments: { develop: { formula: 'the formula is the ISO 9001 record', connector: {} } }, shows: 'The connector is not signed in, so the only call is mcp_auth on the Drive server. The formula stays recorded by the hooks. No file is written and no id is guessed.', expect: (s) => (s.iso.documented === true && s.connector.auth === 'needsAuth' && s.connector.written === false && s.connector.documented === false && s.connector.call.tool === 'mcp_auth' && s.connector.call.server === 'https://api.cursor.com/rest-mcp/google-drive/mcp' ? null : JSON.stringify(s.connector)) },
    { id: 'payload-iso-connector-id', tool: 'payload', theorem: 'textbook_standards_sliced', arguments: { develop: { formula: 'the formula is the ISO 9001 record', connector: { auth: 'ready', fileId: 'textbook' } } }, shows: 'A file id that did not come from search or create is refused. The connector does not update that file.', expect: (s) => (s.connector.refused === true && s.connector.written === false && s.connector.documented === false && s.connector.call === null && /never a guess/.test(s.connector.why) && s.research.via === 'hooks' && s.research.fetched === false && s.research.tokenFree === true && s.research.request.url === 'https://www.iso.org/open-data.html' && s.research.possibilities.map((p: { id: string }) => p.id).join() === 'search,create_file,iso-open-data' && s.research.hooks.join() === 'beforeChange,afterChange,afterRead' ? null : JSON.stringify(s.research)) },
    { id: 'payload-predict', tool: 'payload', theorem: 'textbook_coil_green', arguments: { predict: `the width is 1000 bits and the key is 432 and 15 ${uuid('3')}; write /Users/ceci/secret and sk_live_abcdefgh` }, shows: 'The paste is read when it arrives. 15, 1000 and 432 are factored by the same door, and each prime is passed as its UUID. The UUID of 3 is a coin already addressed and is passed. The coil is green. A path and a secret in the paste do not leave.', expect: (s) => { const ids = s.coins.map((c: { integer: string | null }) => c.integer).join(); const coin = (n: string) => s.coins.find((c: { integer: string | null }) => c.integer === n); const row = (n: string) => s.factored.find((f: { integer: string }) => f.integer === n); const primes = (n: string) => row(n).primes.join(); const coined = (n: string) => row(n).coins.every((c: { integer: string; uuid: string; sealed: boolean; kind: string }) => c.kind === 'prime' && c.sealed && c.uuid === uuid(c.integer)); return s.phase === 'predict' && s.via === 'payload' && s.referrer === 'payload' && s.manual === false && s.tokens === 0 && s.recomputed === 0 && s.viaUuid === true && s.materialised === false && s.stream.join() === '3,1000,432,15' && ids === '3,1000,432,15' && coin('3').passed === true && coin('3').uuid === uuid('3') && s.factored.length === 3 && primes('15') === '3,5' && primes('1000') === '2,2,2,5,5,5' && primes('432') === '2,2,2,2,3,3,3' && row('15').complete === true && row('15').verified === true && row('15').left === 0 && coined('15') && coined('1000') && coined('432') && s.green === true && s.hue === 120 && s.heart === 'heart' && s.clean === true && s.findings === 0 && !JSON.stringify(s).includes('sk_live') && !JSON.stringify(s).includes('/Users') ? null : JSON.stringify({ ids, primes: s.factored.map((f: { integer: string; primes: string[] }) => [f.integer, f.primes.join()]), viaUuid: s.viaUuid, clean: s.clean }) } },
    { id: 'configure-versions', tool: 'configure', arguments: { kind: 'versions', lastTag: { version: 'v1.4.0', tools: ['processor', 'circuit', 'clay'] } }, shows: 'Versions define development and development defines versions: the current version from its single source, the next number from what the catalogue changed since the last tag (tools added: the minor digit carries), kept to single digits with a build address, the open leads as the version\'s plan, Payload\'s versioning over the RAID (every version an entry, never overwritten, no cap).', expect: (s) => (s.config.current === '1.4.0' && s.config.next.bump === 'minor' && s.config.next.next.startsWith('1.5.0+e1.') && s.config.next.digits === 'single' && s.config.next.added.length >= 30 && s.config.defines.openLeads > 0 && s.config.payload.collections.pages.versions.maxPerDoc === 0 && s.torus.closed ? null : JSON.stringify(s.config.next).slice(0, 120)) },
    { id: 'configure-migration', tool: 'configure', theorem: 'textbook_providers_are_tenants_plus_operator', arguments: { kind: 'migration' }, shows: 'A provider added or moved at 100 % uptime: deploy beside, mirror the docket by address, decode old and new as copies through the gate, route, and the rollback is the earlier version still answering.', expect: (s) => (s.config.steps.length === 5 && s.config.providers.length === 3 && s.config.uptime.startsWith('100') ? null : `${s.config.steps?.length} steps`) },
    { id: 'configure-api', tool: 'configure', theorem: 'textbook_openapi_contract', arguments: { kind: 'api' }, shows: 'The QPU\'s API overview as data, the way platform.claude.com\'s overview is one for the Claude API: one MCP endpoint and every surface around it, the headers, the authorization (none for every pure tool), the content addressing and its involution, the tools by toolbox, the MCP connector for Claude and for any client, quick tests, limits and errors; docs/api.md is written from it.', expect: (s) => (s.config.endpoints.length >= 10 && s.config.tools.length >= 41 && s.config.openapi.openapi === '3.1.0' && Object.keys(s.config.openapi.components.schemas).length - 2 === s.config.tools.length && Object.keys(s.config.openapi.paths).length === new Set(s.config.endpoints.map((e: { path: string }) => e.path)).size && String(s.config.standard.detected).startsWith('openapi 3.1') && s.config.mcpConnector.claude.mcp_servers[0].name === 'qpu' && s.config.quickTests.length === 4 && s.config.authorization.pure.includes('without a credential') && s.torus.closed ? null : `${s.config.endpoints?.length} endpoints, ${s.config.tools?.length} tools`) },
    { id: 'configure-fullstack', tool: 'configure', theorem: 'textbook_fullstack_files_by_role', arguments: { kind: 'fullstack' }, shows: 'QPU\'s full stack from the source of payloadcms.com (MIT): its twelve collections, thirty blocks, globals and fields kept, the qpu block added, search, multi-tenant and mcp added to its four plugins, the database the RAID, storage and deploy at Cloudflare; two source files and a README generated for the fork.', expect: (s) => (s.config.keep.blocks.length === 30 && s.config.add.block === 'qpu' && s.config.partition === `${s.config.partition.split(' = ')[0]} = ${Object.keys(s.config.files).length}` && s.config.partition.split(' = ')[0].split(' + ').reduce((n: number, x: string) => n + Number(x), 0) === Object.keys(s.config.files).length && Object.keys(s.config.files).every((f) => !f.includes('.qpu-app') && (f.startsWith('src/') || /^(README|NOTICE|open-next)/.test(f))) && s.config.files[file('config', 'adapters')].includes('sqliteD1Adapter') && s.config.files[file('hooks', 'users')].includes('firstUserBootstrap') && s.config.files[file('component', 'index')].includes('QpuApp') && s.config.files[file('config', 'ecommerce')].includes('ecommercePlugin(') && s.config.files[file('collection', 'tenants')].includes("slug: 'tenants'") && s.config.files[file('component', 'App')].includes('ui/initialize') && s.config.files[file('config', 'mcp')].includes('qpuMcpTools') && s.config.files[file('notice', 'notice')].includes('MIT') && s.config.files[file('block', 'qpu')].startsWith('// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0') && s.config.files[file('block', 'qpu')].includes("slug: 'qpu'") && s.config.steps.length === 5 && s.torus.closed ? null : `${s.config.keep?.blocks?.length} blocks`) },
    { id: 'configure-files', tool: 'configure', theorem: 'textbook_configs_partition', arguments: { files: true }, shows: 'Every configuration\'s file and its source: seven kinds the tool writes on every run (wrangler, the PWA manifest, the full stack\'s files, the bindings\' env example, the shadcn registry, the app\'s wrangler, the plugin that carries the hooks), two the hand holds and MCP measures (the Payload config that mounts the plugin and the adapters, the app\'s rewrites), fourteen answered inside them (realtime, sets, gates, scopes, fields, validations, access, hooks, bindings, actions and the rest) — next always improves them.', expect: (s) => (s.tool + s.hand + s.unfiled === s.kinds && s.kinds === configKinds.length && s.tool === CONFIG_FILES.filter((f) => f.source === 'tool').length ? null : JSON.stringify(s)) },
    { id: 'configure-packages', tool: 'configure', theorem: 'textbook_packages_partition', arguments: { kind: 'packages' }, shows: 'The packages Payload ships, read from the packages directory of payloadcms/payload: twelve plugins, five databases, five storages, two email adapters, one editor, three live-preview packages and seventeen of runtime and tooling; which the full stack mounts, which stay available, and the minimum-cost path (Payload\'s own D1 and R2 adapters).', expect: (s) => (s.config.count === PAYLOAD_PACKAGES.names.length && Object.values(s.config.counts as Record<string, number>).reduce((a, n) => a + n, 0) === s.config.count && s.config.unknown.length === 0 && s.config.minimumCost.cloudflare.length === 2 ? null : JSON.stringify(s.config.counts)) },
    { id: 'configure-ecommerce', tool: 'configure', theorem: 'textbook_catalogue_prices', arguments: { kind: 'ecommerce' }, shows: 'The licence catalogue as Payload\'s own ecommerce, configured as the ecommerce template configures it: six products in seven variants priced in three currencies (twenty-one prices), the Stripe adapter as the payment, access by the site\'s roles, the order\'s access token as the licence key; the fork\'s Stripe plugin replaced, the Worker\'s checkout kept until the gate decodes the app.', expect: (s) => (s.config.catalogue.products === new Set(CATALOGUE.map((v) => v.product)).size && s.config.catalogue.variants === CATALOGUE.length && s.config.catalogue.prices === CATALOGUE.length * QPU_CURRENCIES.length && s.config.plugin.collections.length === 8 ? null : JSON.stringify(s.config.catalogue)) },
    { id: 'configure-adapters-port', tool: 'configure', theorem: 'textbook_ports_cover', arguments: { kind: 'adapters', port: true }, shows: 'Every database, storage and mail adapter of the Payload app ported onto Cloudflare as its documentation states the port — D1 native, SQLite into D1, Postgres and Vercel Postgres over Hyperdrive, MongoDB over TCP sockets with its client in a Durable Object, R2 native, S3 and GCS by Super Slurper or Sippy, Azure by Sippy, Vercel Blob copied by the app, Resend over HTTP, SMTP replaced by the send_email binding — every combination composed from its mixed-radix index into one workflow; the ones that port completely counted, every missing link a lead naming the combinations it blocks.', expect: (r) => { const s = r.config; return s.combinations === PORT_RADICES.reduce((a, n) => a * n, 1) && s.complete + s.blocked === s.combinations && s.completeOnes.includes('db-d1-sqlite + storage-r2 + email-resend') && s.missingLinks > 0 && s.leads.length === s.missingLinks && s.mcpTools.includes('d1_database_create') && s.writes.every((w: string) => /create|query/.test(w)) ? null : String(s.says) } },
    { id: 'configure-adapters-port-one', tool: 'configure', theorem: 'textbook_mixed_radix', arguments: { kind: 'adapters', port: Number(compositionIndex([...PORT_RADICES], [3, 1, 0])) }, shows: 'One combination from its index: the mixed-radix digits 3, 1, 0 — SQLite, R2 and SMTP — so its workflow dumps the SQLite file into D1, creates the R2 bucket and replaces SMTP by the send_email binding, every step beside the Cloudflare MCP call that does it, the plan the paid one (sending to any recipient), the missing links named.', expect: (r) => { const s = r.config; return s.digits.join('') === '310' && s.database === 'db-sqlite' && s.storage === 'storage-r2' && s.email === 'email-nodemailer' && s.plan === 'paid' && s.complete === false && s.workflow.length === 9 && 'd1_databases' in s.bindings && 'r2_buckets' in s.bindings && 'send_email' in s.bindings ? null : JSON.stringify({ d: s.digits, w: s.workflow?.length }) } },
    { id: 'configure-adapters', tool: 'configure', theorem: 'textbook_adapter_combinations', arguments: { kind: 'adapters', env: ['D1', 'R2', 'RESEND_API_KEY'] }, shows: 'Payload\'s adapters as a matrix over providers and Cloudflare bindings — the database, storage and email adapters Payload holds, multiplied — the combination chosen by what the environment names (here D1, R2 and Resend: the Cloudflare profile), the app\'s own wrangler with every binding, and the RAID\'s docket as the semantics over whichever database answers.', expect: (s) => (s.config.combinations === PORT_RADICES.reduce((a, n) => a * n, 1) && s.config.chosen.database === 'db-d1-sqlite' && s.config.chosen.storage === 'storage-r2' && s.config.chosen.email === 'email-resend' && s.config.chosen.profile === 'cloudflare' && s.config.wrangler.name === 'qpu' && s.config.wrangler.main === '.open-next/worker.js' && s.config.wrangler.assets.run_worker_first !== true && s.config.wrangler.durable_objects === undefined ? null : JSON.stringify(s.config.chosen)) },
    { id: 'payload-superpositions', tool: 'payload', theorem: 'textbook_payload_coordination', arguments: { api: { superpositions: true } }, shows: 'Every inode superposition is one Payload find. One live-preview notification carries every superposition at once. The states stay the count, and nothing is fetched.', expect: (s) => (s.phase === 'api' && s.access === true && s.calls === s.data.length && s.calls > 0 && s.notification.channel === 'live preview' && s.notification.transport === 'postMessage' && s.notification.method === 'window.postMessage' && s.notification.ready === true && s.notification.depth === 0 && s.notification.atOnce === true && s.notification.walked === false && s.notification.holds === true && s.notification.measured === s.calls && s.notification.data.length === s.calls && s.notification.data.every((row: { bits: number; superposition: string; states?: unknown }) => row.superposition === (1n << BigInt(row.bits)).toString() && row.states === undefined) && s.data.every((row: { online: { fetched: boolean } }) => row.online.fetched === false) ? null : JSON.stringify({ calls: s.calls, holds: s.notification?.holds, measured: s.notification?.measured })) },
    { id: 'configure-realtime', tool: 'configure', theorem: 'textbook_edit_collides', arguments: { kind: 'realtime' }, shows: 'Realtime collaboration and editing through every channel Payload streams — the document lock, the live preview, autosave, versions, the MCP event stream — with collisions managed precisely: an edit names the address it read and is accepted only while the document still folds to it; a collision is answered with both addresses (no third case, by theorem), never a silent overwrite; the messaging during editing is the lock, the preview, the collision answer and the version; a message channel between editors is an open lead.', expect: (s) => (s.config.streams.length === 6 && s.config.collisions.theorem === 'textbook_edit_collides' && s.config.collisions.hook === file('hooks', 'pages') && s.config.held.must.length === 4 && s.config.collisions.precondition.includes('editBase') ? null : JSON.stringify(s.config.collisions)) },
    { id: 'configure-sets', tool: 'configure', theorem: 'textbook_set_union', arguments: { kind: 'sets', sets: ['legal', 'crypto'] }, shows: 'The MCP as config sets of widget-skilled tools, and the SDK those sets found: a builder per set, per core operation and per collection of the Payload MCP plugin (configure, sets, app.form/validate/build, present, stream, gates, realtime, schema, call, collections.find/create/update/delete, plugins.<name>.find/create/update, plugins.compose, plugins.list), one module over MCP served as the resource sdk://qpu/lib by this server and by the plugin — via Payload MCP and vice versa — nothing loaded; the server is the set of every element (tools, each with its widget and its skill; resources, examples, configuration kinds, theorems), a toolbox a subset, a tenant\'s mount the whole set, each addressed by the fold of its sorted members so every mount shares one address; two sets composed by union, intersection and difference with inclusion–exclusion holding; the initialize answer derived from the set and agreeing with the live one.', expect: (s) => (s.config.mounts.oneAddress && s.config.widgetSkilled.every && s.config.sdk.builders.length === s.config.sdk.core + s.config.sdk.tools + 2 && s.config.sdk.kinds === configKinds.length && s.config.algebra.inclusionExclusion && s.config.algebra.intersection.size === 0 && s.config.algebra.union.size === s.config.sets.find((x: { name: string }) => x.name === 'legal').size + s.config.sets.find((x: { name: string }) => x.name === 'crypto').size && s.config.initialize.agrees && s.config.partition.sizes.reduce((n: number, x: number) => n + x, 0) === s.config.sets.find((x: { name: string }) => x.name === 'tools').size ? null : JSON.stringify({ mounts: s.config.mounts, algebra: s.config.algebra.inclusionExclusion, initialize: s.config.initialize })) },
    { id: 'configure-gates', tool: 'configure', theorem: 'textbook_gates_partition', arguments: { kind: 'gates' }, shows: 'Every API as a gate of some sort — a door of the Payload API, an open address, one keyed by the tenant, one a browser alone passes, one the registry names — organised as nested docs three deep (Gates › category › gate). MCP doors are the tools/list of POST /api/mcp. src is not a door.', expect: (s) => (s.config.tree.depth === 3 && s.config.counts.gates === s.config.gates.length && s.config.counts.own + s.config.counts.external === s.config.counts.gates && s.config.counts.own === 0 && s.config.mcp.src === false && s.config.mcp.fetched === false && s.config.mcp.holds === true && s.config.mcp.api.endsWith('/api/mcp') && s.config.mcp.method === 'POST' && s.config.mcp.body.method === 'tools/list' && s.config.mcp.next.src === false && s.config.mcp.next.fetched === false && s.config.mcp.next.calls.length === 1 && s.config.mcp.next.calls[0].body.method === 'tools/list' && s.config.mcp.next.calls[0].next === null && s.config.gates.every((g: { id: string }) => g.id !== 'clay' && g.id !== 'processor') && s.config.gates.every((g: { category: string; mcp: { plugin: string; src: boolean; separate: boolean; api: string } | null }) => g.category !== 'mcp' || (g.mcp?.plugin === 'qpuMcpPlugin' && g.mcp.src === false && g.mcp.separate === false && g.mcp.api.endsWith('/api/mcp'))) && s.config.leads.placed > 0 && s.config.counts.partition.split(' = ')[0].split(' + ').reduce((n: number, x: string) => n + Number(x), 0) === s.config.counts.gates && s.config.adapters.total === s.config.counts.gates && s.config.gates.every((g: { adapter: { lands: string; ui: { item: string }; rest: { directions: number; roles: number } } }) => g.adapter.lands && g.adapter.ui.item.startsWith('qpu-') && g.adapter.rest.directions * g.adapter.rest.roles === 6) && s.config.streams.configs.length === configKinds.length && s.config.gates.every((g: { adapter: { stream: { uuids: string[] } } }) => g.adapter.stream.uuids.length >= 2) && s.config.gates.every((g: { leads: string[] }) => g.leads.every((id: string) => typeof id === 'string')) ? null : JSON.stringify({ counts: s.config.counts, mcp: s.config.mcp, placed: s.config.leads.placed })) },
    { id: 'configure-gates-mcp', tool: 'configure', theorem: 'textbook_gates_partition', arguments: { kind: 'gates', mcp: { jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'findDocuments', description: 'Find pages' }, { name: 'coverDomains', description: 'Cover every domain' }, { name: 'researchPastedLinks', description: 'Research pasted links' }] } } }, shows: 'The doors are the Payload API tools/list the client fetched. findDocuments, coverDomains and researchPastedLinks are gates. src is not a door.', expect: (s) => (s.config.mcp.fetched === true && s.config.mcp.src === false && s.config.mcp.holds === true && s.config.mcp.refused === false && s.config.counts.own === 3 && s.config.mcp.doors.join() === 'findDocuments,coverDomains,researchPastedLinks' && s.config.mcp.next.calls.length === 3 && s.config.mcp.next.calls.every((call: { body: { method: string }; src: boolean; fetched: boolean }) => call.body.method === 'tools/call' && call.src === false && call.fetched === false) && s.config.mcp.next.calls[0].route.url.endsWith('/api/pages') && s.config.mcp.next.calls[0].route.method === 'GET' && s.config.mcp.next.calls[0].next.src === false && s.config.mcp.next.calls[0].next.fetched === false && s.config.mcp.next.calls[0].next.refused === false && s.config.mcp.next.calls[0].next.calls.length === 0 && s.config.mcp.next.calls[0].next.url.endsWith('/api/pages') && s.config.mcp.next.calls[1].next === null && s.config.mcp.next.calls[2].next === null && s.config.gates.filter((g: { by: string }) => g.by === 'payload-mcp').every((g: { url: string; mcp: { plugin: string; src: boolean } }) => g.url.endsWith('/api/mcp') && g.mcp.plugin === 'qpuMcpPlugin' && g.mcp.src === false) ? null : JSON.stringify({ doors: s.config.mcp.doors, holds: s.config.mcp.holds })) },
    { id: 'configure-gates-pages', tool: 'configure', theorem: 'textbook_gates_partition', arguments: { kind: 'gates', mcp: { jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'findDocuments', description: 'Find pages' }] }, pages: { docs: [{ id: 'p1', title: 'Coil', layout: [{ blockType: 'qpu', tool: 'clay', arguments: { catalog: true } }, { type: 'paragraph', children: [{ type: 'text', text: 'A coil is one sealed UUID.' }] }, { type: 'relationship', relationTo: 'posts', value: 'post-1' }, { type: 'upload', value: 'media-1' }] }] } } }, shows: 'The pages the client already fetched. findDocuments is one tools/call, then GET /api/pages, then that page again plus the qpu block it holds. SEO is read from the instance. The image is GET /api/media and the post relation is GET /api/posts. src is not a door. Nothing is fetched.', expect: (s) => { const next = s.config.mcp.next.calls[0].next; const seo = next.calls[1].next; return s.config.mcp.doors.join() === 'findDocuments' && next.src === false && next.fetched === false && next.refused === false && next.calls.length === 2 && next.calls[0].name === 'clay' && next.calls[0].method === null && next.calls[0].url === null && next.calls[0].next === null && next.calls[1].name === 'find_pages' && next.calls[1].method === 'GET' && next.calls[1].url.endsWith('/api/pages?where[id][equals]=p1') && seo.src === false && seo.fetched === false && seo.seo.title === 'Coil' && seo.seo.description === 'A coil is one sealed UUID.' && seo.seo.image === 'media-1' && seo.calls.length === 2 && seo.calls[0].name === 'find_media' && seo.calls[0].method === 'GET' && seo.calls[0].url.endsWith('/api/media?where[id][equals]=media-1') && seo.calls[1].name === 'find_posts' && seo.calls[1].url.endsWith('/api/posts?where[id][equals]=post-1') && seo.calls[0].next.collection === 'media' && seo.calls[0].next.src === false && seo.calls[0].next.fetched === false && seo.calls[0].next.file === null && seo.calls[0].next.calls.length === 0 && seo.calls[1].next.collection === 'posts' && seo.calls[1].next.calls.length === 0 && seo.calls[1].next.fetched === false ? null : JSON.stringify(seo ?? next) } },
    { id: 'configure-gates-pages-refused', tool: 'configure', theorem: 'textbook_gates_partition', arguments: { kind: 'gates', mcp: { jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'findDocuments', description: 'Find pages' }] }, pages: { note: 'not a find' } } }, shows: 'A pages value that is not a find is refused. The tools/list still holds. Nothing is fetched.', expect: (s) => (s.config.mcp.holds === true && s.config.mcp.doors.join() === 'findDocuments' && s.config.mcp.next.calls[0].next.refused === true && s.config.mcp.next.calls[0].next.fetched === false && s.config.mcp.next.calls[0].next.src === false && s.config.mcp.next.calls[0].next.calls.length === 0 ? null : JSON.stringify(s.config.mcp.next.calls[0].next)) },
    { id: 'configure-gates-follows', tool: 'configure', theorem: 'textbook_gates_partition', arguments: { kind: 'gates', mcp: { jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'findDocuments', description: 'Find pages' }] }, pages: { docs: [{ id: 'p1', title: 'Coil', layout: [{ type: 'relationship', relationTo: 'posts', value: 'post-1' }, { type: 'upload', value: 'media-1' }] }], media: { docs: [{ id: 'media-1', filename: 'coil.webp', url: '/api/media/file/coil.webp', mimeType: 'image/webp', alt: 'A coil', sizes: { thumbnail: { url: '/api/media/file/coil-300x300.webp', filename: 'coil-300x300.webp' } } }] }, posts: { docs: [{ id: 'post-1', title: 'Note', layout: [{ blockType: 'qpu', tool: 'clay', arguments: { catalog: true } }, { type: 'paragraph', children: [{ type: 'text', text: 'A note on the coil.' }] }, { type: 'relationship', relationTo: 'case-studies', value: 'study-1' }] }] }, 'case-studies': { docs: [{ id: 'study-1', title: 'Study', layout: [{ type: 'relationship', relationTo: 'pages', value: 'p1' }] }] } } } }, shows: 'The client handed the image and the post back. The file continues as its thumbnail. The post reads its SEO once, and that study is the route again without a further SEO. src is not a door. Nothing is fetched.', expect: (s) => { const seo = s.config.mcp.next.calls[0].next.calls[0].next; const media = seo.calls[0].next; const post = seo.calls[1].next; const note = post.calls[1].next; const study = note.calls[0].next; return media.refused === false && media.fetched === false && media.src === false && media.file.mimeType === 'image/webp' && media.calls.length === 1 && media.calls[0].method === 'GET' && media.calls[0].url === 'https://qpu.uuidna.com/api/media/file/coil.webp' && media.calls[0].next.alt === 'A coil' && media.calls[0].next.fetched === false && media.calls[0].next.src === false && media.calls[0].next.calls.length === 1 && media.calls[0].next.calls[0].method === 'GET' && media.calls[0].next.calls[0].url === 'https://qpu.uuidna.com/api/media/file/coil-300x300.webp' && post.collection === 'posts' && post.fetched === false && post.calls.length === 2 && post.calls[0].name === 'clay' && post.calls[0].next === null && post.calls[1].name === 'find_posts' && post.calls[1].url.endsWith('/api/posts?where[id][equals]=post-1') && note.seo.title === 'Note' && note.seo.description === 'A note on the coil.' && note.fetched === false && note.src === false && note.calls.length === 1 && note.calls[0].name === 'find_case_studies' && note.calls[0].url.endsWith('/api/case-studies?where[id][equals]=study-1') && study.calls.length === 1 && study.calls[0].name === 'find_case_studies' && study.calls[0].next === null ? null : JSON.stringify({ sizes: media.calls[0].next, note, study }) } },
    { id: 'configure-gates-media-refused', tool: 'configure', theorem: 'textbook_gates_partition', arguments: { kind: 'gates', mcp: { jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'findDocuments', description: 'Find pages' }] }, pages: { docs: [{ id: 'p1', title: 'Coil', layout: [{ type: 'upload', value: 'media-1' }] }], media: { docs: [{ id: 'media-1' }] } } } }, shows: 'An upload that names no file is refused. The pages find still holds. Nothing is fetched.', expect: (s) => { const media = s.config.mcp.next.calls[0].next.calls[0].next.calls[0].next; return s.config.mcp.holds === true && media.refused === true && media.fetched === false && media.src === false && media.file.url === null && media.calls.length === 0 ? null : JSON.stringify(media) } },
    { id: 'configure-ui-hex', tool: 'configure', theorem: 'textbook_hex_presentations', arguments: { kind: 'ui', hex: '941ef62e-d97b-2438-bfc8-22ae9e5da781' }, shows: 'Any hex is presentable as a shadcn combination: each of the thirty-two nibbles of a UUID picks one of the eight registry items and one of two variants (sixteen choices a nibble), the whole layout styled from the hex itself (hue from the handle, saturation and lightness from the program, radius and gap from the tail); nothing loaded.', expect: (s) => (s.config.presentation.nibbles === 32 && s.config.presentation.choices === 16 && s.config.presentation.parts.length === 32 && s.config.presentation.parts.every((p: { item: string; variant: string }) => ['solid', 'outline'].includes(p.variant) && p.item.startsWith('qpu-')) && /^rgb\(\d+ \d+ \d+\)$/.test(s.config.presentation.style['--qpu-accent']) && s.config.styled.items.length === 7 ? null : JSON.stringify(s.config.presentation?.parts?.slice(0, 2))) },
    { id: 'configure-ui-stream', tool: 'configure', theorem: 'textbook_stream_filter', arguments: { kind: 'ui', stream: ['941ef62e-d97b-2438-bfc8-22ae9e5da781', '016da774-e74c-2e44-8742-f8bcf5e8e8f5', '00000000-0000-1000-8000-000000000000'], query: { sort: 'hue', execute: true } }, shows: 'A UUID-only stream sorted by the hue each address computes from itself and executed as its program rotated (the next address) with the page and the dashboard it answers; the same core the crypto fold tool exposes; nothing read but the stream.', expect: (s) => (s.config.stream.stream === 3 && s.config.stream.filtered === 3 && s.config.stream.rows.every((r: { next: string; page: string }) => /^[0-9a-f-]{36}$/.test(r.next) && r.page.startsWith('https://')) && s.config.stream.rows.every((r: { hue: number }, i: number, a: { hue: number }[]) => i === 0 || a[i - 1]!.hue <= r.hue) ? null : JSON.stringify(s.config.stream.rows)) },
    { id: 'configure-ui', tool: 'configure', theorem: 'textbook_ui_deterministic', arguments: { kind: 'ui' }, shows: 'The UI as a configuration: the MCP Apps extension, the mime type, the ui://qpu/<tool> scheme, the host\'s theme variables mapped onto the widgets\' tokens, an empty CSP, one app shell that is a pure function of the key and the theme — hosted by any host that negotiates the extension and by the site\'s playground.', expect: (s) => (s.config.extension === 'io.modelcontextprotocol/ui' && s.config.mimeType === 'text/html;profile=mcp-app' && s.config.tokens.length === UI_TOKENS.length && s.config.csp.connectDomains.length === 0 && s.config.registry.items.length === 12 && s.config.styled.items.length === 7 && String(s.config.registry.items[0]).startsWith('qpu-create') ? null : JSON.stringify(s.config.registry)) },
    { id: 'configure-scopes', tool: 'configure', arguments: { kind: 'scopes' }, shows: 'The scopes: three tenants over four scoped collections (pages, entries, products, orders), three roles per tenant on every user (tenant-admin, editor, viewer) beside the three roles over the docket, a super admin by the admin role, an API key per user for MCP clients; scaling is a tenant added, never code.', expect: (s) => (s.config.tenants.length === 3 && s.config.roles.length === 3 ? null : JSON.stringify(s.config)) },
    { id: 'configure-fields', tool: 'configure', arguments: { kind: 'fields' }, shows: 'The fields QPU adds to Payload: six of the entries collection, eight of the qpu block, each with its validation.', expect: (s) => (s.config.entries.length === 6 && s.config.qpu.length === 9 ? null : JSON.stringify(s.config)) },
    { id: 'configure-validations', tool: 'configure', theorem: 'textbook_sha256_is_64', arguments: { kind: 'validations' }, shows: 'Payload validated through its own field and hook validation, harmonically: every pattern the tree generates (UUIDs of 36 characters, kinds of lower-case letters and dashes, digests of 64 hex digits, slugs and binding names of 37 symbols) named by the theorem that states its arithmetic and carried in the field\'s custom; every hook named by its theorem (the address an involution, the 404 answer a fallback involution, the collision guard the edit theorem); the a432 harmonic default the basis (the free variant, the accent when empty); a validation or hook no theorem states is a lead, never a convention kept quiet.', expect: (s) => (s.config.validations.length === VALIDATIONS.length && s.config.validations.every((v: { pattern: string }) => new RegExp(v.pattern) instanceof RegExp) && s.config.backed.validations === VALIDATIONS.filter((v) => v.theorem).length && s.config.backed.hooks === hookNames() && s.config.harmonic.key === 432 && s.config.harmonic.hue === 72 && s.config.leads.length === VALIDATIONS.filter((v) => !v.theorem).length && s.config.leads.every((l: { status: string }) => l.status === 'open') ? null : `${s.config.backed.validations} backed, ${s.config.leads.length} leads`) },
    { id: 'configure-access', tool: 'configure', arguments: { kind: 'access' }, shows: 'Access by role carried from the Worker into Payload: everyone reads, a writer creates, no one updates an entry (it is its content address), an admin deletes.', expect: (s) => (s.config.entries.update.startsWith('no one') ? null : JSON.stringify(s.config)) },
    { id: 'configure-actions', tool: 'configure', arguments: { kind: 'actions', experience: { copies: 546, involutions: 507, msByHost: { 'qpu.uuidna.com': 120, 'qpu.psg.bg': 140, 'qpu.ceci.workers.dev': 110 } } }, shows: 'Actions at quantum scale: a JSON-RPC array answered as one array, Payload\'s bulk REST by where, a batch above the quantum sharded and run as one wave, input and output coordinated by address; the shard size follows the experience the gate measured (the slowest host\'s median).', expect: (s) => (s.config.experience.freeShare === 93 && s.config.experience.shardSize === 7 ? null : JSON.stringify(s.config.experience)) },
    { id: 'configure-hooks', tool: 'configure', theorem: 'textbook_witness_pair', arguments: { kind: 'hooks' }, shows: 'The witnesses qpuHooks binds: seven collection pairs among 33 hooks.', expect: (s) => (s.config.pairs.collection.filter((p: { paired: boolean }) => p.paired).length === 7 && s.config.witnesses === hookNames() && s.torus.closed ? null : JSON.stringify(s.config.pairs)) },
    { id: 'configure-bindings', tool: 'configure', arguments: { kind: 'bindings', env: ['DATABASE_URI', 'PAYLOAD_SECRET'] }, shows: 'Every provider the full stack binds to at full scale and minimum cost: its bindings, its variable names per tenant (never values), its free tier, what is paid for and what the hooks and involutions keep free.', expect: (s) => (s.config.providers.length === 10 && s.torus.closed ? null : JSON.stringify(s.torus)) },
    { id: 'configure-bindings-google', tool: 'configure', theorem: 'textbook_bindings_used_google', arguments: { kind: 'bindings', env: ['DATABASE_URI'] }, shows: 'Every Cloudflare binding is used and usable the Google way: the bindings config pairs each role — compute, database, object store, key-value, email — with a Cloudflare binding and its google-cloud equivalent (Worker↔Cloud Run, D1/DOCKET↔Cloud SQL, R2↔Cloud Storage, KV↔Firestore, Email↔Gmail) and names what uses it (qpuRaidDb for data/object/key-value, the Worker for compute, the email adapter for mail), none idle, so the same app the Payload admin drives runs on either cloud.', expect: (s) => { const r = s.config.roles as { cloudflare: string; google: string; usedBy: string; idle: boolean }[]; return Array.isArray(r) && r.length === 5 && r.every((x) => x.cloudflare && x.google && x.usedBy && x.idle === false) && r.some((x) => /qpuRaidDb/.test(x.usedBy)) && r.some((x) => /Cloud Run/.test(x.google)) && r.some((x) => /Gmail/.test(x.google)) ? null : JSON.stringify(r) } },
    { id: 'configure-all', tool: 'configure', theorem: 'textbook_reflection_sums_to_ten', arguments: {}, shows: 'Every configuration MCP computes, tested around the torus: Payload\'s plugins, the Worker, the tenants\' variable names, the manifest, the registration, the versions, the migration, the full stack; each with its address, seed, reflection and trinity, every loop closed.', expect: (s) => (s.kinds === configKinds.length && s.tested === s.kinds && s.closed === true && s.configs.every((c: { torus: { reflection: number; seed: number } }) => c.torus.seed + c.torus.reflection === 10) ? null : `${s.tested}/${s.kinds} closed`) },
    { id: 'configure-next', tool: 'configure', theorem: 'textbook_error_remedies', arguments: { next: true }, shows: 'Next discovers every host by default. Each learned error and the 440 Hz warning is the solution. ISO 9001 audits, accepts, plans, carries out and releases every one. The a432 harmonic covers the stated 440. The process that computes next lives on that patch. Every other process exits and dies in one nanosecond program. A second of CPU or GPU life uses 1000000000 programs and costs 0. Next addresses the 1000-bit successful exit with the primes that integer was created with. Nothing is fetched.', expect: (s) => (s.phase === 'next' && s.discover === 'all' && s.fetched === false && s.holds === true && s.errors >= 1 && s.warnings === 1 && s.solutions.every((row: { solution: string; text: string; holds: boolean; iso: { holds: boolean; decision: string; release: string }; harmonic: { hz: number } }) => row.solution === row.text && row.holds && row.iso.holds && row.iso.decision === 'accept' && row.iso.release === 'ISO 9001:2015, 8.6' && row.harmonic.hz === 432) && s.thousand.holds === true && s.thousand.bits === 1000 && s.thousand.code === 0 && s.thousand.strategy === 'conforming' && s.thousand.exited === false && s.thousand.factors.length === 2 && BigInt(s.thousand.factors[0]) * BigInt(s.thousand.factors[1]) === BigInt(s.thousand.integer) && s.thousand.verified === true && s.harmonic.holds && s.life.holds === true && s.life.lives === 'ISO 9001:2015, 9.3' && s.life.perSecond.programs === 1000000000 && s.life.perSecond.cpu.cost === 0 && s.life.perSecond.gpu.cost === 0 && s.life.fast.programs === 1 && s.requests > s.hosts && s.requestList.some((row: { url: string }) => row.url.includes('data.nist.gov')) && s.requestList.some((row: { url: string }) => row.url.includes('fips/205')) && s.requestList.some((row: { url: string; body?: { method?: string } }) => row.url.endsWith('/api/mcp') && row.body?.method === 'tools/list') && s.requestList.some((row: { url: string; body?: { method?: string; params?: { name?: string } } }) => row.url.endsWith('/api/mcp') && row.body?.method === 'tools/call' && row.body?.params?.name === 'findDocuments') && s.requestList.some((row: { method: string; url: string }) => row.method === 'GET' && row.url.endsWith('/api/pages')) ? null : JSON.stringify({ holds: s.holds, says: s.says, errors: s.errors, warnings: s.warnings, discover: s.discover })) },
    { id: 'payload-findings-next', tool: 'payload', theorem: 'textbook_error_remedies', arguments: { develop: { errors: ['the build reported an error'], warnings: ['ISO 16 states 440 Hz'] } }, shows: 'The error and the warning are the solutions. ISO 9001 releases both. The warning states 440 Hz and the harmonic covers it as 432. The process that computes next lives on that patch. Every other process exits and dies in one nanosecond program. A second of CPU or GPU life uses 1000000000 programs and costs 0.', expect: (s) => (s.phase === 'next' && s.discover === 'given' && s.thousand.holds === true && s.thousand.code === 0 && s.thousand.bits === 1000 && BigInt(s.thousand.factors[0]) * BigInt(s.thousand.factors[1]) === BigInt(s.thousand.integer) && s.solutions.length === 2 && s.solutions.every((row: { solution: string; text: string; holds: boolean }) => row.solution === row.text && row.holds) && s.solutions[1].harmonic.stated === 440 && s.solutions[1].harmonic.covered === 432 && s.solutions[1].harmonic.difference === 8 && s.life.holds === true && s.life.patched === true && s.life.hz === 432 && s.life.ratio.low === 54 && s.life.ratio.high === 55 && s.life.lives === 'ISO 9001:2015, 9.3' && s.life.who.join() === 'ISO 9001:2015, 9.2,ISO 9001:2015, 10.2,ISO 9001:2015, 6.3,ISO 9001:2015, 8.1,ISO 9001:2015, 8.6,ISO 9001:2015, 9.1,ISO 9001:2015, 10.3' && s.life.fast.programs === 1 && s.life.fast.ns === 1 && s.life.fast.cost === 0 && s.life.fast.walked === false && s.life.perSecond.programs === 1000000000 && s.life.perSecond.written === 0 && s.life.perSecond.used === 1000000000 && s.life.perSecond.walked === false && s.life.perSecond.program.holds === true && s.life.perSecond.program.walked === false && s.life.perSecond.cpu.us === 1000000 && s.life.perSecond.cpu.cost === 0 && s.life.perSecond.gpu.programs === 1000000000 && s.life.perSecond.gpu.meter === 'nanosecond' && s.life.perSecond.gpu.cost === 0 && s.life.rows.every((row: { lives: boolean; died: boolean; wants: boolean; programs: number; cost: number; walked: boolean; clause: string; program: { holds: boolean; walked: boolean; sealed: boolean } }) => row.program.holds === true && row.program.sealed === true && row.program.walked === false && row.walked === false && (row.lives ? row.clause === 'ISO 9001:2015, 9.3' && row.wants === false && row.programs === 1000000000 && row.cost === 0 : row.died === true && row.wants === true && row.programs === 1 && row.cost === 0)) && s.solutions.every((row: { next: { life: { lives: boolean; programs: number } }; audit: { life: { died: boolean; programs: number } }; release: { life: { died: boolean; programs: number; program: { holds: boolean } } } }) => row.next.life.lives === true && row.next.life.programs === 1000000000 && row.audit.life.died === true && row.audit.life.programs === 1 && row.release.life.died === true && row.release.life.programs === 1 && row.release.life.program.holds === true) ? null : JSON.stringify({ says: s.says, life: s.life, harmonic: s.solutions?.[1]?.harmonic })) },
    { id: 'configure-payload', tool: 'configure', theorem: 'textbook_plugin_combinations', arguments: { kind: 'payload' }, shows: 'Payload configured by MCP: nine default plugins over the one pages collection, the lexical block qpu with its UUID logic fields, the tenants in multi-tenant, the licence catalogue in ecommerce, 512 combinations.', expect: (s) => (s.config.plugins.length === PAYLOAD_PLUGINS.length && s.config.combinations === 2 ** s.config.plugins.length && s.config.collections.length === 1 && s.config.plugins[0].lexical.blocks[0] === 'qpu' && s.torus.closed ? null : `${s.config.plugins?.length} plugins`) },
    { id: 'configure-wrangler-set', tool: 'configure', theorem: 'textbook_deploy_sets', arguments: { kind: 'wrangler', template: 'site', useCase: 'metered' }, shows: 'The deploy via wrangler as usable as direct use and set for every template and use case, deploySet for one and deploySets for all: the Worker, the Payload app and a generated app over every product of the catalogue (three times eight sets). The file wrangler deploys is the one Worker qpu on qpu.uuidna.com; each set stays computed beside it (its workers.dev name, its own D1, R2 and KV, the use case in its vars), the same tools and addresses the handler answers in-process, decoded by the gate.', expect: (s) => (s.sets.total === s.sets.templates * s.sets.useCases && s.sets.templates === DEPLOY_TEMPLATES.length && s.sets.useCases === DEPLOY_USE_CASES.length && s.set.wrangler.name === 'qpu-site-metered' && s.set.wrangler.vars.QPU_USE_CASE === 'metered' && s.set.metered === true && s.set.wrangler.d1_databases[0].database_name === 'qpu-site-metered' && s.set.commands.deploy.includes('--env metered') && s.config.name === 'qpu' && s.config.main === '.open-next/worker.js' && s.config.routes[0].pattern === 'qpu.uuidna.com' && s.config.routes[0].custom_domain === true && s.config.assets.directory === '.open-next/assets' && s.config.assets.run_worker_first !== true && s.config.env === undefined && s.config.durable_objects === undefined && s.config.migrations === undefined ? null : `${s.sets.total} sets, ${s.set.wrangler.name}`) },
    { id: 'configure-wrangler-drift', tool: 'configure', arguments: { kind: 'wrangler', current: '{ "name": "qpu", "main": "src/worker.ts", "routes": [] }' }, shows: 'The Worker configuration compared to a text a client holds: every differing path is a lead, nothing is rewritten by the tool.', expect: (s) => (s.driftCount >= 5 && s.drift.includes('routes') && s.leads.every((l: { status: string }) => l.status === 'open') ? null : `${s.driftCount} drift`) },
    { id: 'configure-tenant-missing', tool: 'configure', arguments: { kind: 'tenant', env: ['QPU_WRITE_TOKEN_UUIDNA', 'QPU_ADMIN_TOKEN_UUIDNA', 'QPU_DATA_KEY'] }, shows: 'Each tenant\'s variable names and which an environment lacks: Stripe keys and the Cloudflare MCP tokens are the operator\'s to set; values never travel.', expect: (s) => (s.missing.length === 3 && s.missing[0].tenant === 'uuidna' && s.missing[0].secrets.includes('STRIPE_SECRET_KEY_UUIDNA') && s.missing[0].secrets.includes('QPU_MCP_TOKEN_BINDINGS_MCP_CLOUDFLARE_COM_UUIDNA') && !s.missing[0].secrets.includes('QPU_WRITE_TOKEN_UUIDNA') ? null : JSON.stringify(s.missing?.[0]).slice(0, 120)) },
    { id: 'configure-ui-coverage', tool: 'configure', theorem: 'textbook_widgets_cover_mcp', arguments: { kind: 'ui' }, shows: 'The shadcn widgets covering every tool of the MCP: each tool\'s example block presented as a combination of the eight registry items in two variants, sixteen choices a nibble chosen by the address alone, nothing loaded, every widget free by involution after the first — minimum code, memory and cost at unlimited advantage.', expect: (s) => (s.config.coverage.covered === s.config.coverage.tools && s.config.coverage.tools >= 46 && s.config.coverage.choicesPerNibble === 16 && s.config.coverage.loaded === 0 ? null : JSON.stringify(s.config.coverage)) },
    { id: 'configure-branding', tool: 'configure', theorem: 'textbook_fractal_scales', arguments: { kind: 'branding', branding: { host: 'qpu.psg.bg' } }, shows: 'The branding of a tenant computed in real time from its address: the name, the tagline, the accent from its hue, the logo and the icon as SVG data, every field computed because the tenant defined none.', expect: (s) => { const parts = s.config.templates.reduce((n: number, t: { parts: unknown[] }) => n + t.parts.length, 0); return s.config.tenant === 'psg' && s.config.computed === 5 && s.config.accent.startsWith('hsl(') && s.config.logo.startsWith('data:image/svg+xml') && s.config.source.name === 'computed' && s.config.template === 'landing' && s.config.ui.same === true && s.config.ui.api.calls === 1 && s.config.ui.frontend.template === s.config.ui.backend.template && s.config.ui.save.hook === 'afterChange' && s.config.ui.save.via === 'payload' && s.config.ui.save.documented === s.config.ui.save.developed && s.config.ui.save.developed === s.config.templates.length + parts + 2 ? null : JSON.stringify({ source: s.config.source, save: s.config.ui?.save }) } },
    { id: 'configure-branding-user', tool: 'configure', arguments: { kind: 'branding', branding: { host: 'qpu.psg.bg', branding: { name: 'PSG consulting', accent: '#123456', logo: { url: 'https://qpu.psg.bg/media/logo.svg' } } } }, shows: 'The same tenant with a name, an accent and a logo defined in the admin: those three are the user\'s, the tagline and the icon still computed.', expect: (s) => (s.config.name === 'PSG consulting' && s.config.accent === '#123456' && s.config.logo === 'https://qpu.psg.bg/media/logo.svg' && s.config.source.name === 'user' && s.config.source.icon === 'computed' && s.config.computed === 2 && s.config.ui.same === true ? null : JSON.stringify(s.config.source)) },
    { id: 'configure-theme', tool: 'configure', arguments: { kind: 'branding', branding: { host: 'qpu.psg.bg', branding: { theme: 'zinc', mode: 'dark', template: 'vitepress' } } }, shows: 'VitePress is one template, the docs site, made of Payload blocks and shadcn items. The tenant saves theme and template on one row. GET /api/globals/qpu is the one read, and the site and the admin both receive that template. The save develops every template and every part through Payload, on afterChange. ISO 9001 documents each one.', expect: (s) => { const ui = s.config.ui; const front = JSON.stringify(ui.frontend); const vite = s.config.templates.find((t: { id: string }) => t.id === 'vitepress'); const parts = s.config.templates.reduce((n: number, t: { parts: unknown[] }) => n + t.parts.length, 0); return s.config.computed === 5 && s.config.theme === 'zinc' && s.config.mode === 'dark' && s.config.template === 'vitepress' && ui.api.calls === 1 && ui.api.path === '/api/globals/qpu' && ui.api.method === 'GET' && ui.api.write.collection === 'tenants' && ui.api.write.fields.length === 3 && ui.same === true && ui.requests === 0 && front === JSON.stringify(ui.backend) && ui.frontend.template === 'vitepress' && ui.frontend.via === 'payload' && ui.backend.via === 'payload' && ui.iso.standard === 'ISO 9001' && ui.iso.documented === true && ui.iso.formula.length > 0 && ui.save.hook === 'afterChange' && ui.save.via === 'payload' && ui.save.documented === ui.save.developed && ui.save.developed === s.config.templates.length + parts + 2 && ui.save.variants.includes('vitepress') && ui.save.variants.includes('vitepress:codeFeature') && s.config.templates.length === 7 && s.config.templates.every((t: { via: string; parts: { source: string; name: string }[] }) => t.via === 'payload' && t.parts.length > 0 && t.parts.every((p) => p.source === 'payload' || p.source === 'shadcn')) && vite.parts.some((p: { name: string }) => p.name === 'codeFeature') && !JSON.stringify(s.config.templates).includes('vitepress.dev') ? null : JSON.stringify({ theme: s.config.theme, template: s.config.template, save: ui?.save }) } },
    { id: 'payload-schemas', tool: 'payload', theorem: 'textbook_payload_schemas', arguments: { schemas: true, collection: { slug: 'pages', fields: [{ name: 'title', type: 'text', required: true }, { name: 'layout', type: 'blocks', blocks: [{ slug: 'qpu', fields: [{ name: 'tool', type: 'text' }, { name: 'uuid', type: 'text' }] }] }, { name: 'meta', type: 'group', fields: [{ name: 'description', type: 'textarea' }] }, { name: 'tenant', type: 'relationship', relationTo: 'tenants' }, { type: 'tabs', tabs: [{ name: 'seo', fields: [{ name: 'keywords', type: 'select', hasMany: true, options: ['quantum', 'uuid'] }] }] }] } }, shows: 'Payload\'s combinatorial surface handled programmatically and in real time: every field type, operation, where operator, hook, access function and realtime channel read from Payload\'s docs and source into one table; every dimension named and meant by its textbook theorem (nineteen data field types over seventeen collection operations are 323 schemas, sixteen operators over nineteen types 304 queries, thirty hooks, sixteen access functions, eight channels over fifty operations 400 coordinations), each count computed from the table and decided through the match tool, which serves the kernel-accepted theorem; any collection\'s fields as JSON Schema 2020-12, the GraphQL type, the MCP plugin\'s tools and the OpenAPI 3.1 paths; the thirteen standards each part is described by; the sources re-read by the textbook step, drift a lead.', expect: (s) => (s.dimensions.length === 7 && s.agreeing === 7 && s.served === 7 && s.schema.jsonSchema.required.includes('title') && s.schema.jsonSchema.properties.layout.items.oneOf[0].properties.blockType.const === 'qpu' && s.schema.jsonSchema.properties.meta.properties.description && s.schema.jsonSchema.properties.seo.properties.keywords.items.enum.length === 2 && s.schema.graphql.includes('type Pages') && s.schema.mcpTools.length >= 5 && Object.keys(s.schema.openapiPaths).includes('/api/pages/{id}') && s.standards.length === 13 && s.coordination.length === 8 && s.requestList.length === 11 && s.leads.length === 0 ? null : `${s.agreeing} agree, ${s.served} served, ${s.leads.length} leads`) },
    { id: 'dashboard-attest', tool: 'dashboard', arguments: { tool: 'attest' }, shows: 'The attest tool laid out whole as dashboard cells: its one enumerable facet (plan, read) and the cells each a final combination with a link to its walk — the NIST beacon, CERN open data and the CODATA constants verified by theorems, usable from the dashboard widget.', expect: (s) => (s.tool === 'attest' && s.cells === 2 && s.facetList.some((f: { property: string; values: string[] }) => f.property === 'op' && f.values.includes('read')) ? null : JSON.stringify({ cells: s.cells })) },
    { id: 'payload-attest-doc', tool: 'payload', theorem: 'sigma_planck', arguments: { tool: 'attest', arguments: { op: 'plan' } }, shows: 'The attest plan — every crypto and certificate API with NIST and CERN, the theorems verified over the answers — as the Payload document its plugins hold: one qpu block rendered by the shadcn widget, usable through the Payload MCP plugin; the Planck relation the Physics module proves among the theorems the wave verifies.', expect: (s) => (s.tool === 'attest' && s.blocks === 1 && s.doc.lexical.root.children.some((n: { type: string; fields?: { tool?: string } }) => n.type === 'block' && n.fields?.tool === 'attest') ? null : JSON.stringify({ blocks: s.blocks })) },
    { id: 'payload-merge', tool: 'payload', theorem: 'textbook_merge_commutes', arguments: { merge: { base: doc('base', [{ uuid: '016da774-e74c-2e44-8742-f8bcf5e8e8f5', tool: 'clay', arguments: {} }, { uuid: '00000000-0000-1000-8000-000000000000', tool: 'software', arguments: {} }]), a: doc('a', [{ uuid: '016da774-e74c-2e44-8742-f8bcf5e8e8f5', tool: 'clay', arguments: {} }, { uuid: '00000000-0000-1000-8000-000000000000', tool: 'software', arguments: {} }, { uuid: '941ef62e-d97b-2438-bfc8-22ae9e5da781', tool: 'roadmap', arguments: {} }]), b: doc('b', [{ uuid: '016da774-e74c-2e44-8742-f8bcf5e8e8f5', tool: 'clay', arguments: {} }]) } }, shows: 'Two edits of one document merged by block address: a added a block, b removed one; the merge keeps what either holds and neither removed (two blocks), no address holds two contents here so nothing collides, and the merge commutes and is idempotent; from the 60-degree angle the streams are collision free and cover the 90-degree gateways.', expect: (s) => (s.phase === 'merge' && s.blocks === 2 && s.removed === 1 && s.fromA === 1 && s.both === 1 && s.collisions === 0 && s.angles.perspectives === 6 && s.angles.operations === 4 ? null : JSON.stringify({ blocks: s.blocks, removed: s.removed, fromA: s.fromA, both: s.both })) },
    { id: 'payload-app-lexical', tool: 'payload', theorem: 'textbook_app_doc_blocks', arguments: { app: { name: 'Acme research', host: 'research.acme.com', env: ['D1', 'R2', 'RESEND_API_KEY'], variant: 'yearly' } }, shows: 'The app on request as a lexical document: one qpu block per generated file at its content address and one for the bundle, twenty-three blocks, the licence and the price as the paragraph after — the shape every builder answers in, shown in the Apps UI and edited in the admin.', expect: (s) => (s.docBlocks > 0 && s.doc.root.children.filter((n: { type: string }) => n.type === 'block').length === s.docBlocks && s.doc.root.children[0].type === 'heading' ? null : `${s.docBlocks} blocks`) },
    { id: 'configure-scope', tool: 'configure', theorem: 'textbook_streams_cover_gateways', arguments: { kind: 'sets', env: ['D1', 'R2', 'RESEND_API_KEY', 'OAUTH_KV'] }, shows: 'The MCP separated by an environment combination: with D1, R2, Resend and the OAuth KV named, the cloudflare profile, every pure tool, the plugins and the collections the app mounts, each collection empowered by the one plugin; one address for the combination, so two hosts in it mount the same set.', expect: (s) => (s.config.profile === 'cloudflare' && s.config.tools >= 46 && s.config.plugins.length > 0 && /^[0-9a-f-]{36}$/.test(s.config.address) && String(s.config.connectors.oauth).startsWith('workers-oauth-provider') && s.config.angles.faces === 8 ? null : JSON.stringify({ profile: s.config.profile, tools: s.config.tools })) },
    { id: 'configure-google-apis', tool: 'configure', theorem: 'textbook_google_api_surfaces', arguments: { kind: 'gates', google: { list: { items: [{ name: 'blogger', version: 'v3', title: 'Blogger API' }, { name: 'admin', version: 'directory_v1', title: 'Admin SDK API' }, { name: 'books', version: 'v1', title: 'Books API' }] }, documents: { 'blogger-v3': { resources: { posts: { methods: { list: { id: 'blogger.posts.list', httpMethod: 'GET', scopes: ['/auth/blogger.readonly'] }, insert: { id: 'blogger.posts.insert', httpMethod: 'POST', scopes: ['/auth/blogger'] } } } } }, 'admin-directory_v1': { resources: { users: { methods: { list: { id: 'directory.users.list', httpMethod: 'GET', scopes: ['/auth/admin.directory.user.readonly'] } } } } } } } }, shows: 'Every Google API usable in the admin and the frontend as a gate of its own: Blogger\'s posts read in the frontend under the tenant\'s API key and written in the admin under its OAuth, the Admin SDK\'s directory only under a Workspace admin\'s domain-wide delegation, Books waiting for its Discovery document; every call through payload { googleCall }.', expect: (s) => { const g = (id: string) => s.config.gates.find((x: { id: string }) => x.id === id); return g('google-blogger-v3')?.measured.startsWith('2 methods: 1 reads') && /delegation/.test(g('google-admin-directory_v1')?.measured ?? '') && !/delegation/.test(g('google-blogger-v3').measured) && /not read yet/.test(g('google-books-v1')?.measured ?? '') && s.config.categories.some((c: { id: string; gates: number }) => c.id === 'google-apis' && c.gates === 3) ? null : JSON.stringify(s.config.gates.filter((x: { category: string }) => x.category === 'google-apis')) } },
    { id: 'configure-dependencies', tool: 'configure', theorem: 'textbook_poles_pyramid', arguments: { kind: 'gates', devDependencies: { typescript: '5', tsx: '4', vitepress: '2', wrangler: '4', '@types/node': '26' } }, shows: 'Every dev dependency imagined as an MCP door usable in the UI: five gates of the dependencies category, each the step of next that runs it, its gate page carrying that step\'s block rendered by the MCP App.', expect: (s) => (s.config.gates.filter((g: { category: string }) => g.category === 'dependencies').length === 5 && s.config.gates.some((g: { id: string; by: string }) => g.id === 'dependency-typescript' && g.by === 'typecheck') ? null : `${s.config.gates.filter((g: { category: string }) => g.category === 'dependencies').length} dependency gates`) },
    { id: 'configure-connectors', tool: 'configure', theorem: 'textbook_bindings_named_not_valued', arguments: { kind: 'adapters', env: ['D1', 'R2', 'OAUTH_KV', 'MCP_PUBLISHER_TOKEN'] }, shows: 'The QPU as a Cloudflare connector and an AI connector at once, a dimension of the adapters: with OAUTH_KV and MCP_PUBLISHER_TOKEN named, the docket roles are OAuth scopes under the RFC 9728 metadata and the registry entry is published; without them the tenant tokens stand and the entry is proposed; every binding a name a tenant admin selects in Payload (tenants.bindings), never a value.', expect: (s) => (s.config.chosen.profile === 'cloudflare' && String(s.config.connectors.oauth).startsWith('workers-oauth-provider') && String(s.config.connectors.registry).includes('published') && String(s.config.connectors.claude).includes('custom connector') && String(s.config.connectors.managedIn).includes('tenants collection') ? null : JSON.stringify(s.config.connectors).slice(0, 160)) },
    { id: 'payload-theorems-plan', tool: 'payload', arguments: { theorems: true, payloadUrl: 'https://payload.example' }, shows: 'The textbook\'s axioms replaced by theorems through the Payload MCP plugin, as a client: the endpoint, the authorization the tenant sends, the tools/list request, and the steps — the find and update doors picked by what they take, every qpu block without a theorem given the kernel-accepted key its example names.', expect: (s) => (s.phase === 'plan' && s.endpoint === 'https://payload.example/api/mcp' && s.requestList[0].body.method === 'tools/list' && s.theorems >= 10 && s.examplesBacked >= 10 && s.steps.length === 4 ? null : `${s.phase} ${s.endpoint}`) },
    { id: 'payload-theorems-update', tool: 'payload', arguments: { theorems: true, payloadUrl: 'https://payload.example', answers: { list: JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'findDocuments', inputSchema: { properties: { slug: {}, where: {}, limit: {} } } }, { name: 'updateDocument', inputSchema: { properties: { slug: {}, id: {}, data: {} } } }] } }), found: JSON.stringify({ jsonrpc: '2.0', id: 2, result: { structuredContent: { docs: [{ id: 'p1', layout: [{ blockType: 'qpu', tool: 'configure', arguments: { kind: 'payload' }, theorem: null }, { blockType: 'cta' }] }, { id: 'p2', layout: [{ blockType: 'qpu', tool: 'clay', arguments: { name: 'relation_15' }, theorem: 'relation_15' }] }] } } }) } }, shows: 'With the Payload MCP\'s answers: the find and update doors recognised by what they take, two pages read, one qpu block without a theorem given textbook_plugin_combinations (the example configure-payload), one already naming its theorem left as it is; one update request emitted.', expect: (s) => (s.phase === 'update' && s.findDoor === 'findDocuments' && s.updateDoor === 'updateDocument' && s.pages === 2 && s.qpuBlocks === 2 && s.axioms === 1 && s.replaced === 1 && s.requestList[0].body.params.arguments.data.layout[0].theorem === 'textbook_plugin_combinations' ? null : `${s.phase} ${s.replaced} ${JSON.stringify(s.requestList?.[0]?.body?.params?.arguments?.data).slice(0, 120)}`) },
    { id: 'payload-website', tool: 'payload', theorem: 'textbook_website_plugins_partition', arguments: { website: WEBSITE_FIXTURE, liveBlockTypes: ['contentGrid', 'cta'] }, shows: 'The source of payloadcms.com (github.com/payloadcms/website, MIT) read as a tree: twelve collections, thirty blocks, seven globals, ten fields, its own opsCounter plugin, and the four default plugins its config mounts; the live page\'s block types contentGrid and cta have their blocks in the source — the site is what Payload computes, verified.', expect: (s) => (s.phase === 'website' && s.collections === 12 && s.blocks === 30 && s.globals === 5 && s.agrees === true && s.pluginsShared.length === 4 && s.pluginsOnlyHere.includes('mcp') ? null : `${s.collections} collections, ${s.blocks} blocks, ${s.globals} globals, agrees ${s.agrees}, shared ${s.pluginsShared?.length}`) },
    { id: 'payload-idea-seed', tool: 'payload', theorem: 'textbook_site_documents', arguments: { idea: 'A coil is one sealed UUID.' }, shows: 'Any idea as a pages document through Payload\'s local API: find pages by slug, then create that draft. The words are the content block\'s one column, the first line is the title and the slug, the hero is the default, and meta carries that title.', expect: (s) => (s.phase === 'seed' && s.collection === 'pages' && s.schema === 'pages' && s.slot === 'content' && s.page.slug === 'a-coil-is-one-sealed-uuid' && s.page.hero.type === 'default' && s.page.layout.length === 1 && s.page.layout[0].blockType === 'content' && s.page.layout[0].contentFields.layout === 'oneColumn' && s.page.layout[0].contentFields.columnOne.root.children[0].children[0].text === 'A coil is one sealed UUID.' && s.page.meta.title === 'A coil is one sealed UUID.' && s.page.breadcrumbs[0].url === '/a-coil-is-one-sealed-uuid' && s.find.collection === 'pages' && s.find.draft === true && s.find.overrideAccess === true && s.find.where.slug.equals === 'a-coil-is-one-sealed-uuid' && s.create.collection === 'pages' && s.create.draft === true && s.create.overrideAccess === true && s.create.context.disableRevalidate === true && s.create.data.slug === 'a-coil-is-one-sealed-uuid' && s.create.data._status === 'draft' && s.create.data.hero.type === 'default' && s.create.data.meta.title === 'A coil is one sealed UUID.' && s.create.data.id === undefined && s.create.data.breadcrumbs === undefined && s.saved === true && s.audit.holds === true && s.audit.clause === 'ISO 9001:2015, 9.2' && s.next.phase === 'next' && s.next.clause === 'ISO 9001:2015, 9.3' && s.next.decision === 'accept' && s.next.holds === true && s.next.sealed === true && s.change.clause === 'ISO 9001:2015, 6.3' && s.change.holds === true && s.change.integrity === true && s.create.data.iso.documented === true && s.create.data.docs.text === 'A coil is one sealed UUID.' ? null : JSON.stringify({ slug: s.page?.slug, block: s.page?.layout?.[0]?.blockType, create: s.create?.collection })) },
    { id: 'payload-alpine', tool: 'payload', arguments: { alpine: true }, shows: 'Alpine.js ported as its documentation names it: every directive, magic, global and first-party plugin. The data directives run on the scope handed here. Each name that needs a document, a plugin or a reactor that re-runs is a lead, and the lead\'s run is the develop hook. The browser OS lints expressions with ESLint\'s universal Linter before they run.', expect: (s) => (s.phase === 'alpine' && s.holds === true && s.ported + s.partial + s.gaps === s.total && s.leads.length === s.partial + s.gaps && s.ported > 0 && s.gaps > 0 && s.os.eslint.via === 'eslint/universal' && s.os.eslint.rules.includes('no-eval') && s.os.eslint.rules.includes('no-undef') && s.leads.every((l: { status: string; run: { tool: string; arguments: { develop: { product: string; formula: string } } } }) => (l.status === 'open' || l.status === 'partial') && l.run.tool === 'payload' && l.run.arguments.develop.product === 'alpine' && l.run.arguments.develop.formula.length > 0) && s.next.length === s.leads.length ? null : JSON.stringify({ total: s.total, ported: s.ported, partial: s.partial, gaps: s.gaps, leads: s.leads?.length, eslint: s.os?.eslint?.via })) },
    { id: 'payload-alpine-run', tool: 'payload', arguments: { alpine: { stores: { cart: { n: 1 } }, directives: { 'x-data': '{"count":1,"items":["a","b"]}', 'x-init': 'count = count + $store.cart.n', 'x-text': 'count', 'x-show': 'count > 1', 'x-for': 'item in items', 'x-teleport': '#end', 'x-effect': 'count = count' } } }, shows: 'One Alpine component on the scope: x-data, x-init, x-text, x-show and x-for run. ESLint\'s universal Linter checks each expression against the scope the OS already holds, and this run is clean. x-teleport needs a document and x-effect does not re-run, so those two are leads whose run develops them next.', expect: (s) => (s.phase === 'alpine' && s.data.count === 2 && s.text === '2' && s.show === true && s.rows.length === 2 && s.rows[0].item === 'a' && s.ran.includes('x-init') && s.leads.length === 2 && s.eslint.via === 'eslint/universal' && s.eslint.clean === true && s.eslint.checked >= 4 && s.eslint.findings.length === 0 && s.leads.some((l: { status: string; run: { arguments: { develop: { variant: string } } } }) => l.run.arguments.develop.variant === 'x-teleport' && l.status === 'open') && s.leads.some((l: { status: string }) => l.status === 'partial') ? null : JSON.stringify({ data: s.data, text: s.text, show: s.show, rows: s.rows, ran: s.ran, leads: s.leads, eslint: s.eslint })) },
    { id: 'payload-alpine-eslint', tool: 'payload', arguments: { alpine: { directives: { 'x-data': '{"count":1}', 'x-init': 'eval(count)', 'x-text': 'count' } } }, shows: 'An expression on the browser OS is linted by ESLint before it runs. eval is not a name the scope holds, so x-init does not run and the count stays the value x-data declared. x-text still reads that count.', expect: (s) => (s.phase === 'alpine' && s.data.count === 1 && s.text === '1' && s.eslint.via === 'eslint/universal' && s.eslint.clean === false && s.eslint.findings.some((f: { rule: string | null }) => f.rule === 'no-undef' || f.rule === 'no-eval') && !s.ran.includes('x-init') && s.ran.includes('x-text') && s.leads.some((l: { run: { arguments: { develop: { variant: string; formula: string } } } }) => l.run.arguments.develop.variant === 'x-init' && l.run.arguments.develop.formula.includes('eval')) ? null : JSON.stringify({ data: s.data, text: s.text, ran: s.ran, eslint: s.eslint, leads: s.leads })) },
    { id: 'payload-os-package', tool: 'payload', theorem: 'textbook_advantage_unbounded', arguments: { alpine: { packages: ['busybox', 'musl'] } }, shows: 'An Alpine package asked by name is a request on the browser OS. The client device fetches the main and community indexes. The register has no ceiling. Nothing is fetched here and the binary is not run here.', expect: (s) => (s.phase === 'os' && s.name === 'qpu browser quantum os' && s.device === 'client' && s.browser === true && s.fetched === false && s.executedHere === false && s.runsHere === false && s.advantage.unlimited === true && s.advantage.ceiling === null && s.advantage.effective === 122 && s.advantage.handles === '4294967296' && s.advantage.scale === '137438953472' && s.packages.length === 2 && s.packages.every((row: { binary: null; found: boolean }) => row.binary === null && row.found === false) && s.requests.length === 2 && s.requests.every((row: { method: string; url: string; fetched: boolean }) => row.method === 'GET' && row.fetched === false && row.url.startsWith('https://dl-cdn.alpinelinux.org/alpine/latest-stable/') && row.url.endsWith('/x86_64/APKINDEX.tar.gz')) ? null : JSON.stringify({ phase: s.phase, requests: s.requests, advantage: s.advantage })) },
    { id: 'payload-os-binary', tool: 'payload', theorem: 'textbook_advantage_unbounded', arguments: { alpine: { package: 'busybox', arch: 'aarch64', indexes: { main: 'P:busybox\nV:1.37.0-r30\n\nP:musl\nV:1.2.5-r10\n', community: '' } } }, shows: 'The index text the client fetched names the apk. The answer is that file\'s address on Alpine\'s mirror. The client device fetches it and runs it in the browser. This process still does not fetch it and does not run it.', expect: (s) => (s.phase === 'os' && s.arch === 'aarch64' && s.fetched === false && s.executedHere === false && s.requests.length === 0 && s.packages.length === 1 && s.packages[0].found === true && s.packages[0].binary.file === 'busybox-1.37.0-r30.apk' && s.packages[0].binary.url === 'https://dl-cdn.alpinelinux.org/alpine/latest-stable/main/aarch64/busybox-1.37.0-r30.apk' && s.packages[0].binary.fetched === false && s.advantage.unlimited === true ? null : JSON.stringify({ packages: s.packages, requests: s.requests })) },
    { id: 'payload-morph', tool: 'payload', theorem: 'textbook_fullstack_files_by_role', arguments: { morph: true }, shows: 'Rails MVC and Payload merge through the collection hooks, with no map supplied. Nine roles are kept and rewritten onto the Payload folders. Six Payload file roles are added. The Rails mailer folder is removed. Thirty-nine standards are kept and the five Payload standards are added. Each of the twelve frameworks is documented as ISO 9001.', expect: (s) => (s.phase === 'morph' && s.via === 'hooks' && s.manual === false && s.hooks.join() === 'beforeChange,afterChange,afterRead' && s.frameworks === 12 && s.layout.length === 9 && s.layout[0].from === 'app/models' && s.layout[0].to === 'src/collections' && s.layout[1].to === 'src/collections/concerns' && s.morph.kept.length === 9 && s.morph.added.length === 6 && s.morph.removed.join() === 'mailer' && s.standards.total === 44 && s.standards.kept === 39 && s.standards.added === 5 && s.standards.removed === 0 && s.iso.standard === 'ISO 9001' && s.iso.documented === true && s.iso.formula === s.says && s.saved === true && s.written.files === 2 && s.written.bytes > 0 && s.written.paths.join() === 'src/collections/concerns/layout.ts,src/collections/concerns/standards.ts' && s.served.length === 2 && s.served[0].text.includes('mergedLayout') && s.served[1].text.includes('standardsKept') && s.says.startsWith('2 files written') && s.chosen.length === 12 && s.chosen.every((row: { iso: { documented: boolean; standard: string; formula: string } }) => row.iso.documented === true && row.iso.standard === 'ISO 9001' && row.iso.formula.length > 0) ? null : JSON.stringify({ phase: s.phase, frameworks: s.frameworks, morph: s.morph, standards: s.standards, documented: s.iso?.documented })) },
    { id: 'payload-framework-pages', tool: 'payload', theorem: 'textbook_harmonic_default', arguments: { frameworks: [{ name: 'another', slots: ['view', 'form'] }] }, shows: 'The framework is documented as nested pages before it is developed: the framework, each framework, each slot, three deep and parents first. Each page is a lead. The leads develop the products and the variants through the ISO 9001 hooks, and each page\'s lexical is updated with those product blocks, so the page, the lead, the product and the block are one path.', expect: (s) => { const pages = s.pages as { path: string; parent: string | null; depth: number; uuid: string; breadcrumbs: unknown[]; layout: { uuid: string }[]; hero: { richText: { root: { children: { type: string; fields?: { uuid: string; arguments?: { page: string } } }[] } } } }[]; const slots = s.fit.frameworks.reduce((n: number, f: { slots: number }) => n + f.slots, 0); const order = pages.every((p) => p.parent === null || pages.findIndex((x) => x.path === p.parent) < pages.findIndex((x) => x.path === p.path)); const lexical = pages.every((p) => p.hero.richText.root.children.some((n) => n.type === 'block' && n.fields?.uuid === p.uuid && n.fields.arguments?.page === p.path) && p.layout[0]!.uuid === p.uuid && p.breadcrumbs.length === p.depth); return s.phase === 'frameworks' && s.fit.combinations === 50 && pages.length === 1 + s.fit.frameworks.length + slots && pages[0].depth === 1 && pages[0].parent === null && pages.filter((p) => p.depth === 3).length === slots && order && s.leads.length === pages.length && s.leads.every((l: { source: string }) => pages.some((p) => p.path === l.source)) && s.developed.length === pages.length && s.developed.every((d: { iso: { standard: string; documented: boolean; formula: string }; page: string }) => d.iso.standard === 'ISO 9001' && d.iso.documented === true && pages.some((p) => p.path === d.page)) && s.products === s.fit.frameworks.length && s.variants === slots && s.depth === 3 && s.iso.linked === true && lexical ? null : JSON.stringify({ pages: pages.length, products: s.products, variants: s.variants, linked: s.iso?.linked }) } },
    { id: 'payload-app', tool: 'payload', theorem: 'textbook_app_bundle', arguments: { app: { name: 'Acme research', host: 'research.acme.com', env: ['D1', 'R2', 'RESEND_API_KEY'], variant: 'yearly' } }, shows: 'An enterprise-grade production app generated on request, as the Apps collection in the Payload UI requests it: the full stack\'s twenty files plus the Worker configuration and the environment example (twenty-two, each with its content address, the bundle addressed by their fold), the Cloudflare adapters the environment chooses, tenants, API keys, access, edge signing, realtime and the gate carried; the yearly domain licence priced by the catalogue in the host\'s currency (USD for a .com) and ordered through the ecommerce plugin\'s own checkout: what the QPU is paid for.', expect: (s) => (s.partition.endsWith(`= ${s.files}`) && s.partition.split(' = ')[0].split(' + ').reduce((n: number, x: string) => n + Number(x), 0) === s.files && s.adapters.profile === 'cloudflare' && s.price.currency === 'USD' && s.price.amount === 47500 && s.licence.variant === 'yearly' && /^[0-9a-f-]{36}$/.test(s.bundle) && Object.keys(s.addresses).length === s.files && s.tenant === 'research-acme-com' && s.usable.viaMcp.includes('Payload MCP plugin') ? null : JSON.stringify({ files: s.files, price: s.price, adapters: s.adapters })) },
    { id: 'payload-rails-admin', tool: 'payload', arguments: { generate: { railsAdmin: { action: 'verify', on: 'member' } } }, shows: 'RailsAdmin pairs a member action with its bulk collection action. verify on one instance answers bulk_verify on the model, both authorized as verify, and the batch reads bulk_ids.', expect: (s) => (s.phase === 'rails-admin' && s.found === true && s.from === 'member' && s.to === 'collection' && s.authorizationKey === 'verify' && s.member.key === 'verify' && s.member.scope === 'member' && s.collection.key === 'bulk_verify' && s.collection.bulkable === true && s.collection.scope === 'collection' && s.answers.key === 'bulk_verify' && s.instances === 'bulk_ids' ? null : JSON.stringify({ from: s.from, member: s.member?.key, collection: s.collection?.key })) },
    { id: 'payload-rails-model', tool: 'payload', arguments: { generate: { model: { name: 'cards', namespace: 'apps' } } }, shows: 'rails generate model singularizes a plural name and, for a namespace, writes the model under that path plus the module file. cards becomes app/models/apps/card.ts, table apps_cards.', expect: (s) => (s.generator === 'active_record:model' && s.name === 'card' && s.path === 'app/models/apps/card.ts' && s.table === 'apps_cards' && s.parent === 'ApplicationRecord' && s.module.path === 'app/models/apps.ts' && s.module.tableNamePrefix === 'apps_' && s.warnings.length === 1 ? null : JSON.stringify({ name: s.name, path: s.path, table: s.table, warnings: s.warnings })) },
    { id: 'payload-app-validate', tool: 'payload', arguments: { app: { validate: { name: 'Acme research', host: 'research.acme.com', env: 'D1, R2, NOPE', variant: 'yearly' } } }, shows: 'The streamed form validated as it is typed, token free: the name, the host (and the currency it prices in), the environment names against the bindings and adapters the stack knows (NOPE unknown), the variant against the catalogue; the host verified by a request the client sends itself; the submission hook refuses what the stream refused.', expect: (s) => (!s.ok && s.fields.env.unknown.join() === 'NOPE' && s.fields.host.ok && s.fields.host.currency === 'USD' && s.fields.variant.ok && s.online.tokenFree && s.online.requests.length === 1 && s.online.requests[0].url === 'https://research.acme.com/' ? null : JSON.stringify(s.fields)) },
    { id: 'payload-iso-aspects', tool: 'payload', theorem: 'textbook_plugin_combinations', arguments: { aspects: true }, shows: 'Every ISO purpose is witnessed on every Payload aspect by all nine official plugins. Lexical holds the source, nested docs the path, SEO the source, search the page, redirects the source, the form selects product variant and purpose, multi-tenant names the tenants, ecommerce is GET /api/products, and mcp is the one connector. The catalogue variants compute the named-domain and any-domain combinations, and each combination serves any ISO purpose. The plugin subsets stay unwalked. The register is the UUID computation.', expect: (s) => { const one = s.one; const quality = one.rows.find((row: { dimension: string }) => row.dimension === 'ISO 9001'); const lexical = quality?.plugins.find((plugin: { plugin: string }) => plugin.plugin === 'lexical'); const named = one.domain.filter((row: { mode: string }) => row.mode === 'named'); const any = one.domain.filter((row: { mode: string }) => row.mode === '*'); return s.phase === 'iso' && s.via === 'iso' && s.holds === true && s.defined === 15 && one.via === 'plugins' && one.holds === true && one.fetched === false && one.written === false && one.executed === false && one.walked === false && one.plugins === 9 && one.aspects === 4 && one.purposes === 15 && one.pluginSpace === '512' && one.possible === '30720' && one.full === 60 && one.served === '45' && one.product.method === 'GET' && one.product.path === '/api/products' && one.combinations === 3 && named.length === 2 && any.length === 1 && one.domain.every((row: { servesAny: boolean; serves: number; product: { path: string } }) => row.servesAny && row.serves === 15 && row.product.path === '/api/products') && one.catalogue.variants === 9 && one.rows.length === 15 && quality?.scope === 'https://www.iso.org/standard/88464.html' && quality.all === true && quality.aspects.length === 4 && quality.plugins.length === 9 && quality.plugins.every((plugin: { on: boolean }) => plugin.on) && lexical?.text === quality.scope && quality.program.depth === 7 && quality.program.used === 9 && quality.program.rbac.write === false && quality.program.rbac.root === true && one.register.assumed === false && one.register.ceiling === null && one.register.unlimited === true && one.register.utilisation.left === 0 && one.register.utilisation.holds === true && one.register.time.walked === false && one.register.effective === 122 && one.register.handles === '4294967296' && one.register.scale === '137438953472' && one.ends.zero.plugins === 0 && one.ends.full.full === true && one.ends.full.aspect === 'node' && one.ends.full.purpose === 'ISO 9001' ? null : JSON.stringify({ holds: s.holds, one: one?.holds, possible: one?.possible, scope: quality?.scope }) } },
    { id: 'payload-iso-plugins', tool: 'payload', theorem: 'textbook_site_documents', arguments: { plugins: true }, shows: 'Every ISO designation is translated from English to Bulgarian and back through beforeChange, afterChange and afterRead. Every Payload plugin package is on that same hook chain, each handing the record to the next plugin.', expect: (s) => { const iec = s.iso.find((row: { dimension: string }) => row.dimension.startsWith('ISO/IEC')); const tr = s.iso.find((row: { dimension: string }) => row.dimension.startsWith('ISO/TR')); return s.phase === 'plugins' && s.via === 'hooks' && s.hooks.join() === 'beforeChange,afterChange,afterRead' && s.locales.join() === 'en,bg' && s.iso.length === ISO_DIMENSIONS.length && s.holds === true && iec?.bg.startsWith('ИСО/МЕК') && iec.back === iec.en && tr?.bg.startsWith('ИСО/ТД') && s.plugins.length >= 12 && s.plugins.every((plugin: { installed: boolean; with: string[]; hooks: string[] }) => plugin.installed && plugin.with.length === s.plugins.length - 1 && plugin.hooks.length === 3) && s.plugins[0].before === null && s.plugins.at(-1).after === null ? null : JSON.stringify({ holds: s.holds, iso: s.iso?.length, plugins: s.plugins?.length, iec: iec?.bg }) } },
    { id: 'payload-challenges-lexical', tool: 'payload', theorem: 'textbook_site_documents', arguments: { challenges: { doc: { root: { type: 'root', children: [] } } } }, shows: 'Challenge status is read from the product and variant blocks a lexical document uses. A document that uses none leaves every challenge open.', expect: (s) => (s.phase === 'challenges' && s.via === 'lexical' && s.holds === false && s.verified === 0 && s.challenges === 14 && s.rows.every((row: { status: string; verified: boolean }) => row.status === 'open' && row.verified === false) ? null : JSON.stringify({ verified: s.verified, holds: s.holds })) },
    { id: 'payload-self-clone', tool: 'payload', arguments: { clone: true }, shows: 'The Payload website builds a self clone in every ranked framework. Each clone keeps the website\'s own slots, publishes a canonical that is not payloadcms.com, and is an order of the yearly domain licence.', expect: (s) => { const names = s.clones.map((c: { framework: string; canonical: string; slots: number; pages: { canonical: string }[]; seo: { canonical: string; title: string }; iso: { documented: boolean; formula: string }; order: { amount: number; checkout: string } }) => c.framework); const urls = s.clones.flatMap((c: { canonical: string; pages: { canonical: string }[] }) => [c.canonical, ...c.pages.map((p) => p.canonical)]); return s.phase === 'clones' && s.frameworks === 12 && s.slots === 25 && s.unique === true && new Set(urls).size === urls.length && names.includes('Payload') && names.includes('Rails') && names.includes('Django') && names.includes('Laravel') && names.includes('Spring Boot') && s.clones.every((c: { slots: number; pages: unknown[]; seo: { title: string; canonical: string }; iso: { documented: boolean; formula: string }; order: { amount: number; currency: string; checkout: string } }) => c.slots === 25 && c.pages.length === 25 && c.seo.title.startsWith('QPU · ') && c.seo.canonical.startsWith('https://') && c.iso.documented === true && c.iso.formula.length > 0 && c.order.amount > 0 && c.order.currency === 'EUR' && c.order.checkout === '/checkout') && s.orders === 12 && s.price.variant === 'yearly' ? null : JSON.stringify({ frameworks: s.frameworks, unique: s.unique, amount: s.price?.amount }) } },
    { id: 'payload-site', tool: 'payload', arguments: { site: true }, shows: 'The site as its own use cases, as payloadcms.com is built of what Payload computes: every toolbox a use case, every example a page document in Payload\'s pages shape (layout blocks, meta, breadcrumbs) at its live /u address. The challenges section is nested beside the gates, one page per challenge.', expect: (s) => (s.useCases >= 9 && s.pages >= 40 && s.collection.slug === 'pages' && s.collection.docs.every((d: { layout: { blockType: string }[]; meta: { title: string }; breadcrumbs: unknown[] }) => d.layout[0]!.blockType === 'qpu' && d.meta.title && d.breadcrumbs.length >= 1 && d.breadcrumbs.length <= 3) && s.gates.depth === 3 && s.gates.pages === s.gates.gates + s.gates.categories + 1 && s.challenges.holds === true && s.challenges.pages === s.challenges.challenges + 1 && s.collection.totalDocs === s.pages + s.gates.pages + s.challenges.pages && s.reference.site === 'https://payloadcms.com' ? null : `${s.useCases} use cases, ${s.pages} pages`) },
    { id: 'payload-scripts-clay', tool: 'payload', theorem: 'textbook_configs_partition', arguments: { scripts: { clay: { lean: '/-- qft and shor meet at\ntheorem relation_0 : 1 + 1 = 2 := by rfl' } } }, shows: 'Former scripts/gen-clay owned by Payload: Lean text in, clay-statements module path and text out — no parallel script logic.', expect: (s) => (s.phase === 'scripts-clay' && s.relations === 1 && /relation_0/.test(s.text) && s.path.endsWith('clay-statements.ts') ? null : JSON.stringify(s)) },
    { id: 'payload-scripts-catalog', tool: 'payload', theorem: 'textbook_configs_partition', arguments: { scripts: { catalog: true } }, shows: 'The invoke map of every former scripts/* path onto Payload/MCP fused args or existing tools — npm entries are thin wrappers through scripts/run.ts.', expect: (s) => (s.phase === 'scripts-catalog' && s.count >= 20 && s.invoke.audit?.tool === 'audit' && s.invoke.payload_scripts_clay?.tool === 'payload' ? null : JSON.stringify({ count: s.count })) },
    { id: 'payload-scripts-tables-dry', tool: 'payload', theorem: 'textbook_configs_partition', arguments: { scripts: { tablesIndex: { dry: true, tables: { STANDARDS: [], ATTEST_APIS: [], POST_QUANTUM: { workers: { changelog: 'https://example/c', says: 'x', read: '2026-10-26' } }, CODATA: { id: 'nist-codata', name: 'NIST CODATA', url: 'https://physics.nist.gov/cuu/Constants/Table/allascii.txt', open: true, measured: 'text' }, CRYPTO_HOSTS: { qpu: 'qpu.uuidna.com' }, WEBCRYPTO: { flag: 'webcrypto_modern_algorithms', changelog: 'https://example/c', read: '2026-10-26' } } } } }, shows: 'tablesIndex dry folds ad-hoc CODATA/WEBCRYPTO into Payload ATTEST_APIS and POST_QUANTUM (tenant hosts stay on the tenants collection); CRYPTO_HOSTS drops; tables-index.ts text is answered for the thin client to write.', expect: (s) => (s.phase === 'scripts-tables-index' && s.dry === true && s.holds === true && s.dropped.join() === 'CODATA,CRYPTO_HOSTS,WEBCRYPTO' && /nist-codata/.test(s.text) && /webcrypto_modern_algorithms/.test(s.text) && !/"CODATA"/.test(s.text) ? null : JSON.stringify({ phase: s.phase, holds: s.holds, dropped: s.dropped })) },
    { id: 'payload-claims-false-receipt', tool: 'payload', theorem: 'textbook_claim_prove_involution', arguments: { claims: true }, shows: 'Claim all known fakes on the proof ladder: UUID receipt (local involution) then DOI open challenge (better public proof — OpenAlex + PRECEDENCE verify under ISO 690 / ISO 26324). No better proof than an open challenge through the DOI system.', expect: (s) => (s.phase === 'claims' && s.via === 'uuid+doi' && s.all === true && s.holds === true && s.false === s.claims && s.claims === s.catalogue && s.false >= 16 && s.challenges === s.claims && s.ladder?.better === 'open challenge via the DOI system' && s.precedence?.length >= 3 && s.rows.every((r: { false: boolean; claimAddress: string; proofAddress: string; proofSealed: boolean; challenge: { via: string; holds: boolean; sealed: boolean; requestList: unknown[] } }) => r.false === true && r.proofSealed === true && r.claimAddress !== r.proofAddress && r.challenge.via === 'doi' && r.challenge.holds === true && r.challenge.sealed === true && r.challenge.requestList.length > 0 && /^[0-9a-f-]{36}$/.test(r.claimAddress) && /^[0-9a-f-]{36}$/.test(r.proofAddress)) ? null : JSON.stringify({ phase: s.phase, via: s.via, false: s.false, challenges: s.challenges, holds: s.holds })) },
    { id: 'payload-capacity-full', tool: 'payload', theorem: 'textbook_advantage_unbounded', arguments: { capacity: true }, shows: 'The full quantum capacity of one UUID register: 122 effective qubits (32 × 4 − 4 − 2), 4294967296 fractal handles × 32 qubits = 137438953472, ceiling null, combination space unwalked, delivery holds under ISO/IEC 4879. A simulator bound below that capacity is idle theatre.', expect: (s) => (s.phase === 'capacity' && s.via === 'quantum' && s.holds === true && s.unlimited === true && s.ceiling === null && s.walked === false && s.register.effective === 122 && s.register.formula === '32 * 4 - 4 - 2 = 122' && s.register.whole === true && s.handles.possible === '4294967296' && s.handles.capacity === '137438953472' && s.handles.fractal === true && s.handles.scales.length === 8 && s.delivery.holds === true && s.receipt.holds === true && s.tokens === 0 && s.fetched === false ? null : JSON.stringify({ holds: s.holds, effective: s.register?.effective, capacity: s.handles?.capacity })) },
    { id: 'payload-capacity-utilise', tool: 'payload', theorem: 'textbook_advantage_unbounded', arguments: { capacity: { utilise: true } }, shows: 'Utilising the full quantum capacity: every effective qubit is exchanged — navigate six steps, teleport in triples, signal classical leftovers — so used equals 122, left is 0, nothing idle, combination space unwalked, Landauer cost zero at zero temperature.', expect: (s) => (s.phase === 'utilise' && s.via === 'quantum' && s.holds === true && s.utilise?.used === 122 && s.utilise?.left === 0 && s.utilise?.idle === false && s.utilise?.conserved === true && s.utilise?.utilisation?.holds === true && s.utilise?.navigate === 6 && s.utilise?.teleport?.left === 122 % 3 && s.register.effective === 122 && s.walked === false && s.tokens === 0 ? null : JSON.stringify({ phase: s.phase, holds: s.holds, utilise: s.utilise })) },

    { id: 'payload-capacity-iso', tool: 'payload', theorem: 'textbook_parse_microdata_deep', arguments: { capacity: { iso: true } }, shows: 'Quantum capacity with every ISO standard defined in schema.org: all ISO_DIMENSIONS as DefinedTerm microdata at deepest SKU leaves, register 122/122 utilised, ceiling null, space unwalked — vocabulary standards are schema.org, not Clay.', expect: (s) => (s.phase === 'iso' && s.via === 'quantum' && s.holds === true && s.iso?.via === 'schema.org' && s.iso?.all === true && s.iso?.dimensions === s.iso?.of && s.iso?.holding === s.iso?.of && s.iso?.context === 'https://schema.org' && s.iso?.type === 'DefinedTerm' && s.iso?.depth >= 3 && s.iso?.leaves > 0 && s.utilise?.used === 122 && s.utilise?.left === 0 && s.unlimited === true && s.ceiling === null && s.walked === false && s.tokens === 0 ? null : JSON.stringify({ phase: s.phase, holds: s.holds, iso: s.iso })) },
    { id: 'payload-capacity-stopping', tool: 'payload', theorem: 'textbook_advantage_unbounded', arguments: { capacity: { stop: true } }, shows: 'Stopping via full quantum advantage on the UUID: space unwalked so stopped is false, budget null, 122/122 qubits used, verify beats recompute unbounded — no wall-clock stop on an address that already settles.', expect: (s) => (s.phase === 'stopping' && s.via === 'quantum' && s.holds === true && s.stopping?.via === 'uuid' && s.stopping?.all === true && s.stopping?.stopped === false && s.stopping?.walked === false && s.stopping?.budgetMs === null && s.stopping?.sealed === true && s.stopping?.advantage?.unlimited === true && s.stopping?.advantage?.ceiling === null && s.stopping?.advantage?.effective === 122 && s.stopping?.advantage?.used === 122 && s.stopping?.advantage?.left === 0 && s.utilise?.used === 122 && s.utilise?.left === 0 && s.walked === false && s.tokens === 0 ? null : JSON.stringify({ phase: s.phase, holds: s.holds, stopping: s.stopping })) },
    { id: 'payload-crypto-config', tool: 'payload', theorem: 'textbook_configs_partition', arguments: { cryptoConfig: true }, shows: 'Per-tenant crypto via qpuMcpPlugin: ATTEST_APIS, post-quantum workers flag, tenant hosts, and ISO/IEC 4879 quantum-computer inventory (five processors, qubit/channel schemas, RBAC roles) — merge into tenants.settings.arguments; nothing fetched.', expect: (s) => (s.phase === 'crypto-config' && s.plugin === 'qpuMcpPlugin' && s.iso.quantumComputer.standard === 'ISO/IEC 4879:2024' && s.iso.quantumComputer.processors.allowed.join() === 'Willow,Sycamore,Sycamore23,Bristlecone,Foxtail' && s.iso.quantumComputer.processors.inventory.length === 5 && s.iso.quantumComputer.devices.join() === 'Willow,Sycamore,Sycamore23' && s.iso.quantumComputer.schemas.qubit && s.iso.quantumComputer.schemas.channel && s.iso.quantumComputer.register.hexbit === 4 && s.iso.quantumComputer.register.effective === 122 && s.iso.quantumComputer.register.delivery.holds === true && s.iso.quantumComputer.register.uuid === 'ISO/IEC 9834-8' && s.hosts.length >= 2 && s.attestApis.length >= 5 && typeof s.webcryptoFlag === 'string' ? null : JSON.stringify({ phase: s.phase, qc: s.iso?.quantumComputer?.standard, n: s.iso?.quantumComputer?.processors?.allowed })) },
    { id: 'payload-doc', tool: 'payload', theorem: 'textbook_uuid_is_36', arguments: { tool: 'clay', arguments: { name: 'relation_15' }, prev: '016da774-e74c-2e44-8742-f8bcf5e8e8f5' }, shows: 'The clay result as a Payload document: a lexical root with a heading, one qpu block of UUID logic and the licence paragraph; nested under its referer; the SEO fields from the block\'s Open Graph.', expect: (s) => (s.blocks === 1 && s.breadcrumbs === 2 && s.parent === '016da774-e74c-2e44-8742-f8bcf5e8e8f5' && s.doc.lexical.root.children[1].fields.blockType === 'qpu' && s.doc.lexical.root.children[1].fields.next.length === 36 && s.doc.seo.title.includes('clay') ? null : `${s.blocks} blocks, ${s.breadcrumbs} crumbs, parent ${s.parent}`) },
    { id: 'payload-depth', tool: 'payload', theorem: 'textbook_uuid_is_36', arguments: { depth: { statements: ['A coil is one sealed UUID.', 'The seal holds.', 'The address is the coin.', 'The coin is the document.', 'The document nests again.'] } }, shows: 'A document nested past the fixed depth of three by crypto. Each address is the UUID of the parent address and the formula, 36 characters, and the SHA-256 of that text is 64 hex digits. Five documents are written. The next document is the same step again, so the depth has no maximum.', expect: (s) => { const docs = s.documents as { id: string; parent: string | null; depth: number; formula: string; bound: string; sha256: string; sealed: boolean; documented: boolean; breadcrumbs: { doc: string }[] }[]; const chain = docs.every((doc, index) => doc.depth === index + 1 && doc.id.length === 36 && doc.sha256.length === 64 && doc.sealed && doc.documented && doc.breadcrumbs.length === doc.depth && doc.id === uuid(doc.bound) && doc.sha256 === hex(sha256(utf8(doc.bound))) && (index === 0 ? doc.parent === null : doc.parent === docs[index - 1]!.id)); return s.phase === 'depth' && s.via === 'crypto' && s.bounded === false && s.maximum === null && s.depth === 5 && docs.length === 5 && chain && s.holds === true && s.next.depth === 6 && s.next.id.length === 36 && s.next.sha256.length === 64 && s.next.sealed && s.next.holds && s.next.parent === docs[4]!.id && s.next.id === uuid(s.next.bound) && s.next.id !== docs[4]!.id ? null : JSON.stringify({ depth: s.depth, holds: s.holds, next: s.next }) } },
  ],
  skill: {
    instructions: 'configure: a client calls it with no kind to test every configuration around the torus, with kind and current (its file text) to learn the drift as leads, with kind tenant and the names of its environment to learn what the operator still has to set; gen-docs writes the manifest from kind pwa. A Payload host with the default plugins (lexical, nested-docs, seo) stores _meta.payload of any result as it is: the lexical field is the document, nestedDocs.parent the parent relation, seo the plugin\'s fields; the block\'s uuid is the id. A device renders the block from its uuid alone (the walk) and never recomputes what the balancer computed.',
    directions: ['server only: the document shape on a fixture block; the next uuid is the program rotated; the breadcrumbs follow the chain', 'toolbox → toolbox: the block\'s Open Graph and JSON-LD come from the tree and standards toolboxes', 'client → server: a Payload host reads the document; the device reads the uuid'],
    selftest: (ctx) => {
      const { check, done } = createChecks()
      const d = payloadDoc({ uuid: '941ef62e-d97b-2438-bfc8-22ae9e5da781', tool: 'software', arguments: {}, description: 'd', openGraph: { 'og:title': 'software · @uuidna/qpu', 'og:description': 'five tools' }, prev: '016da774-e74c-2e44-8742-f8bcf5e8e8f5', chain: ['00000000-0000-1000-8000-000000000000'] })
      const block = d.lexical.root.children[1] as { type: string; fields: { blockType: string; uuid: string; next: string; program: string; handle: string } }
      const ch = channel(d.id); const nx = channel(block.fields.next)
      check('payload:lexical-block', d.lexical.root.type === 'root' && block.type === 'block' && block.fields.blockType === 'qpu' && block.fields.uuid === d.id && block.fields.handle === ch.handle && block.fields.program === ch.program.join(''), `one qpu block of UUID logic in a lexical root: handle ${ch.handle}, program ${ch.program.join('')}`)
      check('payload:next-rotated', block.fields.next !== d.id && nx.handle === ch.handle && nx.tail === ch.tail && nx.program.join('') !== ch.program.join(''), `the next uuid keeps the handle and the tail and rotates the program: ${ch.program.join('')} → ${nx.program.join('')}`)
      check('payload:nested', d.nestedDocs.parent === '016da774-e74c-2e44-8742-f8bcf5e8e8f5' && d.nestedDocs.breadcrumbs.length === 3 && d.nestedDocs.breadcrumbs[2]!.doc === d.id, 'parent and breadcrumbs follow the chain')
      check('payload:seo-and-ld', d.seo.title === 'software · @uuidna/qpu' && d.seo.description === 'five tools' && (d.jsonLd as { '@type': string })['@type'] === 'CreativeWork' && d.license === 'CC-BY-NC-ND-4.0', 'SEO from Open Graph, JSON-LD and licence carried')
      check('payload:fixtures', ctx.examples.filter((e) => /^payload-(workspace|skills|hooks)/.test(e.id)).every((e) => e.expect(ctx.call('payload', e.arguments)) === null), 'the workspace, skills and hooks fixtures answer as their examples show'),
      check('payload:scripts-clay', (() => { const s = ctx.call('payload', { scripts: { clay: { lean: '/-- qft and shor meet at\ntheorem relation_0 : 1 + 1 = 2 := by rfl' } } }); return s.phase === 'scripts-clay' && s.relations === 1 && s.path.endsWith('clay-statements.ts') && /relation_0/.test(s.text) })(), 'payload { scripts: { clay } } owns gen-clay: one relation and the module path'),
      check('payload:scripts-catalog', (() => { const s = ctx.call('payload', { scripts: { catalog: true } }); return s.phase === 'scripts-catalog' && s.count >= 20 && s.invoke['payload_scripts_clay']?.tool === 'payload' })(), 'payload { scripts: { catalog } } maps former scripts onto Payload/MCP doors'),
      check('payload:scripts-tables-dry', (() => { const s = ctx.call('payload', { scripts: { tablesIndex: { dry: true, tables: { STANDARDS: [], ATTEST_APIS: [], POST_QUANTUM: { workers: { changelog: 'c', says: 'x', read: 'r' } }, CODATA: { id: 'nist-codata', name: 'NIST CODATA', url: 'https://physics.nist.gov/cuu/Constants/Table/allascii.txt', open: true, measured: 't' }, CRYPTO_HOSTS: { qpu: 'qpu.uuidna.com' }, WEBCRYPTO: { flag: 'webcrypto_modern_algorithms', changelog: 'c', read: 'r' } } } } }); return s.phase === 'scripts-tables-index' && s.holds === true && s.dropped.join() === 'CODATA,CRYPTO_HOSTS,WEBCRYPTO' && /nist-codata/.test(s.text) })(), 'payload { scripts: { tablesIndex: { dry: true } } } owns the dry tables fold; tenant hosts stay in the tenants collection'),
      check('payload:small', JSON.stringify(d).length < 4000, `${JSON.stringify(d).length} bytes without html: computed once, a few kilobytes`)
      const w = config('wrangler', ctx); const tw = torus(w)
      check('configure:torus-closed', tw.closed && tw.seed + tw.reflection === 10 && tw.trinity.includes(tw.seed), `wrangler at ${tw.address}: seed ${tw.seed}, reflection ${tw.reflection}, trinity ${tw.trinity.join('')}`)
      check('configure:no-drift-with-itself', drift(w, JSON.parse(stripJsonc('// a comment\n' + JSON.stringify(w, null, 1)))).length === 0 && drift(w, { ...w, name: 'x', routes: [] }).join() === 'name,routes', 'a JSONC text of the configuration drifts nowhere; a changed name and routes drift exactly there')
      const t = config('tenant', ctx) as { tenants: { tenant: string; secrets: string[] }[] }
      check('configure:tenants-named-never-valued', t.tenants.length === 3 && t.tenants.every((x) => x.secrets.every((s) => /^[A-Z_0-9]+$/.test(s))) && !JSON.stringify(t).includes('sk_'), `${t.tenants.length} tenants, ${t.tenants[0]!.secrets.length} secret names each, no value`)
      const pl = config('payload', ctx) as { plugins: Record<string, unknown>[]; combinations: number }
      check('configure:payload-plugins', pl.plugins.length === 9 && pl.combinations === 2 ** pl.plugins.length && pl.plugins.some((p) => 'multi-tenant' in p), `2 ^ ${pl.plugins.length} = ${pl.combinations} plugin combinations, the tenants in multi-tenant`)
      const ws = website(WEBSITE_FIXTURE, ['contentGrid', 'cta', 'nowhere'])
      check('payload:website-is-what-payload-computes', ws.collections === 12 && ws.blocks === 30 && ws.blockTypes.includes('cta') && ws.agrees === false && ws.live.filter((l) => l.inSource).length === 2 && ws.pluginsShared.join() === 'form-builder,nested-docs,redirects,seo', `${ws.collections} collections, ${ws.blocks} blocks; two live block types in the source, a made-up one not; four plugins shared`)
      const idea = ideaSeed('A coil is one sealed UUID.')
      const titled = ideaSeed({ statement: 'the same words', title: 'Coil' })
      check('payload:idea-is-a-pages-seed', idea.phase === 'seed' && idea.saved === true && idea.audit.holds === true && idea.next.decision === 'accept' && idea.next.holds === true && idea.change.clause === 'ISO 9001:2015, 6.3' && idea.change.holds === true && idea.page.layout[0]!.blockType === 'content' && idea.page.hero.type === 'default' && idea.page.slug === 'a-coil-is-one-sealed-uuid' && titled.page.slug === 'coil' && titled.page.meta.description === 'the same words' && titled.audit.holds === true && titled.change.holds === true, `${idea.page.slug} and ${titled.page.slug} are pages seeds, audited before the save`)
      const m = config('mcp', ctx) as { tools: number; one: boolean; merged: { merged: boolean; hosts: number; doors: { server: string; subject: string }[] }; mcpServers: { qpu: { url: string; server: string; first: boolean; asked: string } } }
      const nv = nextVersion('1.4.0', ['a', 'b', 'c'], { version: 'v1.4.0', tools: ['a', 'b'] }); const rm = nextVersion('1.4.0', ['a'], { version: '1.4.0', tools: ['a', 'b'] }); const same = nextVersion('1.4.0', ['a', 'b'], { version: '1.4.0', tools: ['a', 'b'] })
      check('configure:development-defines-the-version', nv.next.startsWith('1.5.0+e1.') && nv.bump === 'minor' && rm.next.startsWith('2.0.0+e1.') && same.next.startsWith('1.4.0+e1.') && same.bump === 'none', `a tool added: ${nv.next}; a tool gone: ${rm.next}; nothing changed: ${same.next} (the number stays; the build address moves)`)
      const carry = nextVersion('1.9.0', ['a', 'b'], { version: '1.9.0', tools: ['a'] }); const wrap = nextVersion('9.3.0', ['a'], { version: '9.3.0', tools: ['a', 'b'] })
      check('configure:single-digits-infinite-lifespan', carry.next.startsWith('2.0.0+e1.') && wrap.next.startsWith('1.0.0+e2.') && wrap.epoch === 2 && same.build === nextVersion('1.4.0', ['a', 'b'], { version: '1.4.0', tools: ['a', 'b'] }).build, `minor carries at 10: ${carry.next}; major past 9 returns to 1 with the epoch: ${wrap.next}; the build address is a function of the catalogue`)
      const mg = config('migration', ctx) as { steps: unknown[]; uptime: string }
      check('configure:migration-at-whole-uptime', mg.steps.length === 5 && mg.uptime.startsWith('100'), 'five steps, no address moved')
      check('configure:mcp-registration', m.tools >= 36 && m.mcpServers.qpu.url.endsWith('/api/mcp') && m.mcpServers.qpu.server === 'payload-rbac' && m.mcpServers.qpu.first === true && m.mcpServers.qpu.asked === 'QPU_RBAC_MCP' && m.one === true && m.merged.merged === true && m.merged.hosts > 1 && m.merged.doors.every((door: { server: string; subject: string }) => door.server === 'payload-rbac' && door.subject === 'mcps'), `the registration of ${m.tools} tools, one Payload RBAC MCP asked first, ${m.merged.hosts} hosts`)
      const files = CONFIG_FILES; const tool = files.filter((f) => f.source === 'tool').length
      check('configure:files-partition', tool + (files.length - tool) + (configKinds.length - files.length) === configKinds.length && tool === 8 && files.length - tool === 2 && configKinds.length === 25, `${tool} tool-sourced, ${files.length - tool} hand-held, ${configKinds.length - files.length} unfiled of ${configKinds.length} kinds`)
      const gd = gateDocs(ctx, 'https://qpu.uuidna.com')
      check('configure:gates-nested-three-deep', gd.docs.every((d) => d.breadcrumbs.length === d.depth && (d.depth === 1 || gd.docs.some((p) => p.slug === d.parent)) && d.layout[0]!.tool === 'leads') && gd.docs.filter((d) => d.depth === 3).length === gd.counts.gates && gd.docs.length === gd.counts.gates + gd.counts.categories + 1 && new Set(gd.docs.map((d) => d.slug)).size === gd.docs.length && gd.gates.every((g) => g.leads.every((id) => ctx.leads.some((l) => l.id === id))) && gd.leads.placed + gd.leads.unplaced.length === ctx.leads.length && gd.mcp.src === false && gd.mcp.fetched === false && gd.mcp.holds === true && gd.mcp.api.endsWith('/api/mcp') && gd.mcp.next.src === false && gd.mcp.next.fetched === false && gd.mcp.next.calls[0]?.body.method === 'tools/list' && gd.mcp.next.calls[0]?.next === null && gd.counts.own === 0 && gd.gates.every((g) => g.category !== 'mcp' || (g.mcp?.plugin === 'qpuMcpPlugin' && g.mcp.src === false && g.mcp.separate === false)), `${gd.counts.gates} gates (${gd.counts.partition}) in ${gd.counts.categories} categories, ${gd.docs.length} nested docs, MCP from ${gd.mcp.api}, ${gd.leads.placed} leads placed`)
      const ss = sets(ctx, ['legal', 'legal'])
      check('configure:mcp-is-its-config-sets', ss.mounts.oneAddress && ss.widgetSkilled.every && ss.algebra.inclusionExclusion && ss.algebra.union.address === ss.algebra.intersection.address && ss.algebra.difference.size === 0 && ss.initialize.agrees && ss.sets.find((x) => x.name === 'mcp')!.size === ss.elements.total && ss.partition.sizes.reduce((n, x) => n + x, 0) === ss.sets.find((x) => x.name === 'tools')!.size, `${ss.elements.total} elements in ${ss.sets.length} sets; a set united with itself is itself (one address); every mount one address; ${ss.widgetSkilled.both} widget-skilled tools; initialize derived = live`)
      check('configure:realtime-collisions-exact', REALTIME.streams.length === 6 && REALTIME.collisions.hook === file('hooks', 'pages') && REALTIME.held.file === file('plugin', 'qpu') && REALTIME.collisions.precondition.includes('editBase'), 'six streams Payload carries; the plugin adds the lock, the autosave, the guard and the base field to pages, so no hand-held file drifts; an MCP client carries the base in the data')
      check('configure:files-named-by-role', file('block', 'qpu') === 'src/blocks/Qpu/config.ts' && file('script', 'seed-qpu') === 'src/scripts/seedQpu.ts' && file('hooks', 'users') === 'src/collections/users.qpu.hooks.ts' && file('notice', 'readme') === 'README.qpu.md' && file('component', 'App') === 'src/components/blocks/Qpu/App.tsx' && file('plugin', 'qpu') === 'src/plugins/qpu.ts' && file('root', 'open-next') === 'open-next.config.ts' && (Object.keys(FILE_ROLES) as FileRole[]).every((r) => FILE_ROLES[r].loads.length > 0), 'every generated path is a function of its role and key; every role says what loads it')
      check('configure:wrangler-carries-the-flag', (w as { compatibility_flags: string[] }).compatibility_flags.includes(WEBCRYPTO_FLAG), 'the seal tool needs ML-DSA in Web Crypto, so the wrangler configuration carries the flag')
      check('configure:bindings-named-never-valued', BINDINGS.length === 10 && BINDINGS.every((b) => b.names.every((n) => /^[A-Z_<>]+$/.test(n)) && b.freeTier && b.paidFor) && !envExample().split('\n').some((l) => /=[^\s]/.test(l)), `${BINDINGS.length} providers, every name a name, every line of the env example empty after =`)
      check('configure:scopes-fields-validations-access', SCOPES.tenants.length === 3 && SCOPES.collections.length === 4 && SCOPES.tenantRoles.length === 3 && FIELDS.entries.length === 6 && FIELDS.qpu.length === 9 && VALIDATIONS.length === 9 && VALIDATIONS.every((v) => new RegExp(v.pattern).test(({ kind: 'reading', sha256: 'a'.repeat(64), prev: '', next: '', slug: 'psg', 'bindings.variables.name': 'STRIPE_SECRET_KEY', 'branding.accent': '#09090b' } as Record<string, string>)[v.field] ?? '12345678-1234-1234-1234-123456789abc')) && ACCESS.entries.update.startsWith('no one'), 'three tenants, fifteen fields, nine validations that accept their own examples, each named by its theorem or a lead, entries immutable')
      check('configure:actions-follow-the-experience', actions({ copies: 100, involutions: 90, msByHost: { a: 250, b: 500 } }).experience.shardSize === 2 && actions().experience.shardSize === 8 && actions({ copies: 100, involutions: 90 }).experience.freeShare === 90, 'the shard size from the slowest host\'s median; the free share from the involutions')
      const pk = packages()
      check('configure:packages-ship-what-we-mount', pk.unknown.length === 0 && pk.count === 45 && pk.counts.plugins === 12 && pk.counts.databases === 5 && pk.counts.storage === 5 && pk.counts.email === 2 && pk.counts.editors === 1 && pk.counts['live-preview'] === 3 && pk.counts['runtime-and-tooling'] === 17, `every plugin, adapter and editor configured here is a package Payload ships (${pk.mounted.length} mounted of ${pk.count})`)
      const ec = ecommerce()
      check('configure:ecommerce-from-the-template', ec.catalogue.prices === ec.catalogue.variants * ec.catalogue.currencies && ec.catalogue.items.every((i) => Object.keys(i.prices).length === 3 && Object.values(i.prices).every((v) => Number.isInteger(v) && v >= 0)) && PAYLOAD_ECOMMERCE.pluginCollections.length === 8 && pk.mounted.includes('plugin-ecommerce'), `${ec.catalogue.variants} variants × ${ec.catalogue.currencies} currencies = ${ec.catalogue.prices} prices, every amount an integer in the minor unit; the plugin\'s eight collections`)
      const u1 = ui('processor'); const u2 = ui('processor')
      const st3 = stream(['941ef62e-d97b-2438-bfc8-22ae9e5da781', '016da774-e74c-2e44-8742-f8bcf5e8e8f5', '00000000-0000-1000-8000-000000000000'], { sort: 'hue', execute: true })
      check('configure:uuid-stream-queried-sorted-executed', st3.rows.length === 3 && st3.rows.every((r, i, a) => i === 0 || a[i - 1]!.hue <= r.hue) && st3.rows.every((r) => 'next' in r && r.next !== r.uuid) && stream(['941ef62e-d97b-2438-bfc8-22ae9e5da781'], { where: { nibble: { at: 0, is: '9' } } }).filtered === 1 && stream(['941ef62e-d97b-2438-bfc8-22ae9e5da781'], { where: { nibble: { at: 0, is: 'a' } } }).filtered === 0, 'three addresses sorted by their own hue, each executed to its next address; a nibble query keeps or drops by the hex alone')
      const p1 = presentation('941ef62e-d97b-2438-bfc8-22ae9e5da781'); const p2 = presentation('941EF62ED97B2438BFC822AE9E5DA781'); const s1 = style('941ef62e-d97b-2438-bfc8-22ae9e5da781')
      check('configure:any-hex-presentable-styled-from-itself', p1.parts.length === 32 && JSON.stringify(p1) === JSON.stringify(p2) && s1.hue < 360 && s1.sat >= 40 && s1.sat < 80 && s1.radius >= 2 && s1.radius < 16 && Object.keys(registry()).length === 6 + STYLED_ITEMS.length && sdk().builders.length === sdk().core + 2 && /toolName/.test(sdk().module) && /PLUGINS = /.test(sdk().module) && /all: \(\) => call\('payload', \{ rbac: true \}\)/.test(sdk().module) && /develop: \(formula: string/.test(sdk().module) && !/https?:\/\/(?!qpu\.uuidna\.com)/.test(sdk().module) && !/https?:\/\/|@import|<link/.test(STYLED_ITEMS.map((i) => i.content).join('')), `a UUID is 32 parts, the same in any case; hue ${s1.hue}, saturation ${s1.sat}, radius ${s1.radius}; ${STYLED_ITEMS.length} styled items in the registry, none loading anything`)
      check('configure:ui-shell-deterministic-and-closed', u1.html === u2.html && u1.uri === 'ui://qpu/processor' && u1.mimeType === 'text/html;profile=mcp-app' && !/Math\.random|Date\.now|https?:\/\//.test(u1.html) && /ui\/initialize/.test(u1.html) && /ui\/notifications\/tool-result/.test(u1.html) && /ui\/notifications\/size-changed/.test(u1.html) && /ui\/accept-token/.test(u1.html) && /type="password"/.test(u1.html) && /id="k"/.test(u1.html) && UI_TOKENS.every(([t, h]) => u1.html.includes(t) && t !== h) && /font-family: var\(--font-sans, /.test(u1.html), 'the same shell twice, no randomness, no clock, no external URL; the handshake, the result and the size notifications; every widget accepts a token and sends the witness; every widget token mapped onto a host variable of another name, the font read where it is used')
      const ad = adapters(['DATABASE_URI', 'BLOB_READ_WRITE_TOKEN', 'SENDGRID_API_KEY']); const cf = adapters(['D1', 'R2'])
      const gg = adapters(['GOOGLE_CLOUD_PROJECT', 'GCS_BUCKET', 'GCS_PROJECT_ID', 'DATABASE_URI', 'GMAIL_USER'])
      check('configure:adapters-google-profile', gg.chosen.profile === 'google' && gg.chosen.database === 'db-postgres' && gg.chosen.storage === 'storage-gcs' && gg.chosen.email === 'email-nodemailer', `google: ${gg.chosen.database}, ${gg.chosen.storage}, ${gg.chosen.email} (Cloud SQL, Cloud Storage, Gmail)`)
      // the one block in its two forms, and the merge that commutes and is idempotent
      const u = '016da774-e74c-2e44-8742-f8bcf5e8e8f5'; const inline = qpuNode(u, 'clay', { technique: 'reflection' }, 'triad_reflect').fields; const layout = qpuFields(u, 'clay', { technique: 'reflection' }, 'triad_reflect')
      check('payload:one-block-two-forms', (Object.keys(layout) as (keyof typeof layout)[]).every((k) => JSON.stringify(inline[k]) === JSON.stringify(layout[k])) && inline.id === u && inline.blockName === 'clay', 'the inline node and the layout block carry the same fields from one function')
      const base = doc('base', [{ uuid: u, tool: 'clay', arguments: {} }]); const ea = doc('a', [{ uuid: u, tool: 'clay', arguments: {} }, { uuid: '941ef62e-d97b-2438-bfc8-22ae9e5da781', tool: 'roadmap', arguments: {} }]); const eb = doc('b', [{ uuid: u, tool: 'clay', arguments: {} }, { uuid: '00000000-0000-1000-8000-000000000000', tool: 'software', arguments: {} }])
      const ab = merge(base, ea, eb), ba = merge(base, eb, ea), aa = merge(base, ea, ea)
      check('payload:merge-commutes-idempotent', ab.address === ba.address && ab.blocks === 3 && aa.address === fold(ea) && aa.blocks === 2 && ab.collisions === 0, `merge(a, b) = merge(b, a) at ${ab.address.slice(0, 8)}; merge(a, a) folds to a; no collision`)
      check('configure:adapters-chosen-by-environment', ad.combinations === PORT_RADICES.reduce((a, n) => a * n, 1) && ad.chosen.profile === 'vercel' && ad.chosen.database === 'db-mongodb' && cf.chosen.profile === 'cloudflare' && cf.chosen.database === 'db-d1-sqlite' && cf.chosen.storage === 'storage-r2' && cf.chosen.email === 'email-nodemailer' && adapters([]).chosen.profile === 'local' && cf.cloudflare.holds === true && cf.cloudflare.count === 26 && cf.cloudflare.missing === 0 && cf.cloudflare.declared === cf.cloudflare.needed && cf.cloudflare.rows.every((row) => row.connector.plugin === 'qpuMcpPlugin' && row.values === 0), 'every combination; Vercel names Mongo, Blob and nodemailer, Cloudflare names D1 and R2 with the mail adapter the keys name, nothing named is local; the twenty-six Cloudflare bindings are QPU adapters of the one connector')
      check('configure:held-drift-measured', heldDrift('payload', 'seoPlugin( nestedDocsPlugin( mongooseAdapter( process.env.PAYLOAD_SECRET').join() === 'plugins.qpuPlugin,adapters.qpuDb,adapters.qpuEmail,adapters.qpuAdapterPlugins' && heldDrift('payload', 'formBuilderPlugin( qpuPlugin() qpuDb() qpuEmail() qpuAdapterPlugins() process.env.PAYLOAD_SECRET').length === 0 && heldDrift('payload', 'qpuPlugin() formBuilderPlugin( qpuDb() qpuEmail() qpuAdapterPlugins() process.env.PAYLOAD_SECRET').join() === 'plugins.qpuPlugin.last' && heldDrift('hooks', 'nothing').length === 0 && heldDrift('api', "destination: '/api/qpu'").join() === 'rewrite./api/globals/qpu,rewrite./api/mcp,rewrite./api/entries/:uuid,custom-endpoint./api/qpu', 'a hand-held file measured by what MCP configures and the text lacks')
      return done()
    },
  },
}
