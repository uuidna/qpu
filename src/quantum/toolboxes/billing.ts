// The billing toolbox: Stripe per tenant, pure. A checkout is a plan (the request the Worker sends to Stripe with the tenant's
// key, never the handler); a webhook is verified here by its Stripe-Signature (HMAC-SHA256 over timestamp.payload with the
// tenant's webhook secret, tolerance on the timestamp) and read into one idempotent docket entry per event (granted,
// renewed, revoked, disputed, failed), content-addressed by the event id; the licence state of a subject is read from its
// entries at any tenant, since a licence names the domains it is valid on and the entries mirror. Every scenario between
// tenants is an entry and a rule, never a special case: the same licence at another domain, a refund after a grant, a
// dispute, a renewal, a replayed event, a wrong tenant's signature.
import { toolOf, checksOf, type Toolbox } from '../toolbox.js'
import { hmacSha256, utf8, hex, sameHex, sha256 } from '../hmac.js'
import { uuidOf } from '../blocks.js'
import { LICENSE } from '../license.js'
import { flowWidget } from '../widgets.js'
import { differencesOf, remediesOf, GENERATOR_REMEDIES } from '../audit.js'

export type Checkout = { tenant: string; host: string; subject: string; domains: string[]; mode: 'payment' | 'subscription'; price?: string; amount?: number; currency: string; successUrl: string; cancelUrl: string; customerEmail?: string }
export type Plan = { method: 'POST'; url: string; headers: Record<string, string>; form: Record<string, string>; secret: string }
export type LicenceEntry = { id: string; kind: 'licence'; from: string; body: { event: string; type: string; state: 'granted' | 'renewed' | 'changed' | 'revoked' | 'disputed' | 'failed' | 'noted'; subject: string; tenant: string; domains: string[]; product: string | null; variant: string | null; quantity: number | null; customer: string | null; amount: number | null; currency: string | null; at: number; licence: string; terms: string }; links: string[] }

/** The QPU as a product with its variants: what is sold, by what unit, on what interval; a tenant may price each variant in its own
 * currency. The a432 harmonic default stays free under attribution; the author's licence terms ride on every product. */
export type Variant = { product: string; variant: string; unit: 'domain' | 'tenant' | 'seat' | 'thousand-calls' | 'million-readings' | 'thousand-copies' | 'platform' | 'none'; interval: 'month' | 'year' | 'once' | 'metered'; amounts: Record<string, number>; domains: '*' | 'named'; description: string }
export const CATALOGUE: readonly Variant[] = [
  { product: 'qpu-a432', variant: 'harmonic-default', unit: 'none', interval: 'once', amounts: { eur: 0, usd: 0, bgn: 0 }, domains: '*', description: 'the a432 harmonic default: free under attribution, every result carrying the licence' },
  { product: 'qpu-domain', variant: 'yearly', unit: 'domain', interval: 'year', amounts: { eur: 43200, usd: 47500, bgn: 84500 }, domains: 'named', description: 'commercial use of the QPU framework on one named domain, for a year' },
  { product: 'qpu-domain', variant: 'monthly', unit: 'domain', interval: 'month', amounts: { eur: 4320, usd: 4750, bgn: 8450 }, domains: 'named', description: 'the same, by the month' },
  { product: 'qpu-tenant', variant: 'yearly', unit: 'tenant', interval: 'year', amounts: { eur: 216000, usd: 237600, bgn: 422400 }, domains: '*', description: 'commercial use on every domain of one tenant, for a year' },
  { product: 'qpu-seat', variant: 'monthly', unit: 'seat', interval: 'month', amounts: { eur: 2700, usd: 2970, bgn: 5280 }, domains: '*', description: 'one seat of the full platform (every toolbox, every host), by the month' },
  { product: 'qpu-metered', variant: 'per-thousand-calls', unit: 'thousand-calls', interval: 'metered', amounts: { eur: 108, usd: 119, bgn: 211 }, domains: '*', description: 'tools/call metered from the docket\'s receipts, per thousand calls, billed monthly' },
  { product: 'qpu-iot', variant: 'per-million-readings', unit: 'million-readings', interval: 'metered', amounts: { eur: 1080, usd: 1190, bgn: 2110 }, domains: '*', description: 'IoT readings as docket entries (kind reading), per million, billed monthly: a reading is one row written, its coil the write; the margin against the provider\'s price the verifier reads' },
  { product: 'qpu-delivered', variant: 'per-thousand-copies', unit: 'thousand-copies', interval: 'metered', amounts: { eur: 540, usd: 595, bgn: 1056 }, domains: 'named', description: 'production quantum computing delivered: the copies the gate proved on the tenant\'s hosts, per thousand, the measure a subscription is billed by' },
  { product: 'qpu-enterprise', variant: 'platform', unit: 'platform', interval: 'year', amounts: { eur: 1080000, usd: 1188000, bgn: 2112000 }, domains: '*', description: 'the full featured platform for one organisation: every toolbox, every host, the RAID, the court, with the author\'s support' },
]
/** The Stripe product and price objects a tenant's catalogue needs, as the forms Stripe takes; the tenant's key sends them. */
export const catalogueOf = (tenant: string, currencies: readonly string[] = ['eur']): { products: { form: Record<string, string> }[]; prices: { form: Record<string, string> }[]; secret: string } => {
  const products = [...new Set(CATALOGUE.map((v) => v.product))].map((product) => ({ form: { name: `QPU ${product.replace(/^qpu-/, '')}`, 'metadata[product]': product, 'metadata[tenant]': tenant, 'metadata[licence]': LICENSE.address, description: CATALOGUE.find((v) => v.product === product)!.description } }))
  const prices = CATALOGUE.flatMap((v) => currencies.filter((c) => c in v.amounts).map((currency) => ({ form: { product_data: `QPU ${v.product.replace(/^qpu-/, '')}`, currency, unit_amount: String(v.amounts[currency]), 'metadata[product]': v.product, 'metadata[variant]': v.variant, 'metadata[unit]': v.unit, 'metadata[tenant]': tenant, 'metadata[domains]': v.domains, ...(v.interval === 'month' || v.interval === 'year' ? { 'recurring[interval]': v.interval } : v.interval === 'metered' ? { 'recurring[interval]': 'month', 'recurring[usage_type]': 'metered' } : {}) } })))
  return { products, prices, secret: SECRET_OF(tenant) }
}
/** Metered usage from the docket: the receipts of a subject in a period, as the usage record Stripe takes (per thousand calls). */
export const usageOf = (entries: readonly { kind?: string; from?: string; body?: { subject?: string; calls?: number }; date?: string }[], subject: string, from: number, to: number): { calls: number; thousands: number; form: Record<string, string> } => {
  const calls = entries.filter((e) => e.kind === 'usage' && e.body?.subject === subject && e.date && Date.parse(e.date) / 1000 >= from && Date.parse(e.date) / 1000 < to).reduce((n, e) => n + (e.body?.calls ?? 0), 0)
  const thousands = Math.ceil(calls / 1000)
  return { calls, thousands, form: { quantity: String(thousands), timestamp: String(to), action: 'set' } }
}
/** The author's compensation: the net of every balance transaction (Stripe's own fee figures, never assumed) by product and variant. */
export const settlementOf = (transactions: readonly { id: string; net: number; fee: number; amount: number; currency: string; product?: string; variant?: string; tenant?: string }[]): { gross: Record<string, number>; fees: Record<string, number>; net: Record<string, number>; byProduct: Record<string, number>; byTenant: Record<string, number>; transactions: number; entry: { id: string; kind: 'settlement'; body: unknown } } => {
  const sum = (k: 'amount' | 'fee' | 'net') => transactions.reduce<Record<string, number>>((acc, t) => ({ ...acc, [t.currency]: (acc[t.currency] ?? 0) + t[k] }), {})
  const by = (k: 'product' | 'tenant') => transactions.reduce<Record<string, number>>((acc, t) => ({ ...acc, [`${t[k] ?? 'unknown'}:${t.currency}`]: (acc[`${t[k] ?? 'unknown'}:${t.currency}`] ?? 0) + t.net }), {})
  const body = { gross: sum('amount'), fees: sum('fee'), net: sum('net'), byProduct: by('product'), byTenant: by('tenant'), transactions: transactions.map((t) => t.id).sort(), author: LICENSE.author, licence: LICENSE.address }
  return { ...body, transactions: transactions.length, entry: { id: uuidOf(`settlement${JSON.stringify(body)}`), kind: 'settlement', body } }
}
const SECRET_OF = (tenant: string) => `STRIPE_SECRET_KEY_${tenant.toUpperCase()}`

/** The checkout session request, as Stripe's API takes it (form-encoded), with the licence in the metadata so the webhook carries it back. */
export const planOf = (c: Checkout): Plan => {
  const form: Record<string, string> = {
    mode: c.mode, success_url: c.successUrl, cancel_url: c.cancelUrl,
    'metadata[tenant]': c.tenant, 'metadata[host]': c.host, 'metadata[subject]': c.subject, 'metadata[domains]': c.domains.join(','), 'metadata[licence]': LICENSE.address,
    ...(c.customerEmail ? { customer_email: c.customerEmail } : {}),
    ...(c.price ? { 'line_items[0][price]': c.price } : { 'line_items[0][price_data][currency]': c.currency, 'line_items[0][price_data][unit_amount]': String(c.amount ?? 0), 'line_items[0][price_data][product_data][name]': `Commercial licence of the QPU framework for ${c.subject} on ${c.domains.join(', ')}`, ...(c.mode === 'subscription' ? { 'line_items[0][price_data][recurring][interval]': 'year' } : {}) }),
    'line_items[0][quantity]': '1',
  }
  return { method: 'POST', url: 'https://api.stripe.com/v1/checkout/sessions', headers: { 'content-type': 'application/x-www-form-urlencoded', 'idempotency-key': uuidOf(`checkout${JSON.stringify(c)}`) }, form, secret: SECRET_OF(c.tenant) }
}

/** Stripe's signature scheme: `t=<timestamp>,v1=<hmac>`; the signed payload is `<timestamp>.<body>`; the tenant's secret signs. */
export const signatureOf = (secret: string, timestamp: number, payload: string): string => `t=${timestamp},v1=${hex(hmacSha256(utf8(secret), utf8(`${timestamp}.${payload}`)))}`
export const verifySignature = (secret: string, header: string, payload: string, now: number, toleranceSeconds = 300): { valid: boolean; why: string; timestamp: number | null } => {
  const parts = Object.fromEntries(header.split(',').map((p) => p.trim().split('=') as [string, string]))
  const t = Number(parts.t); const v1 = parts.v1
  if (!Number.isFinite(t) || !v1) return { valid: false, why: 'the header carries no t and v1', timestamp: null }
  if (Math.abs(now - t) > toleranceSeconds) return { valid: false, why: `timestamp ${t} is outside ${toleranceSeconds} s of now ${now}: a replay or a clock`, timestamp: t }
  const expected = hex(hmacSha256(utf8(secret), utf8(`${t}.${payload}`)))
  return sameHex(expected, v1) ? { valid: true, why: 'the tenant\'s secret signs this payload at this time', timestamp: t } : { valid: false, why: 'the signature is not this tenant\'s: another tenant\'s secret, or a forged body', timestamp: t }
}

/** Every Stripe event this surface understands, read into the state it means for the licence. */
const STATE_OF: Record<string, LicenceEntry['body']['state']> = { 'checkout.session.completed': 'granted', 'customer.subscription.created': 'granted', 'invoice.paid': 'renewed', 'customer.subscription.updated': 'changed', 'charge.refunded': 'revoked', 'customer.subscription.deleted': 'revoked', 'charge.dispute.created': 'disputed', 'charge.dispute.closed': 'renewed', 'invoice.payment_failed': 'failed', 'checkout.session.expired': 'noted', 'payment_intent.succeeded': 'noted' }
/** One idempotent entry per event: the same event again gives the same address, and the docket says duplicate. */
export const entryOf = (tenant: string, event: { id: string; type: string; created?: number; data?: { object?: Record<string, unknown> } }, earlier: readonly LicenceEntry[] = []): LicenceEntry => {
  const previous = earlier.filter((p) => p && p.body) // a row without its body cannot be read; it is skipped, never guessed
  const o = (event.data?.object ?? {}) as Record<string, unknown>
  const meta = (o.metadata ?? {}) as Record<string, string>
  const subject = meta.subject ?? String(o.subscription ?? o.payment_intent ?? o.customer ?? 'unknown')
  const domains = meta.domains ? meta.domains.split(',') : previous.find((p) => p.body.subject === subject)?.body.domains ?? [tenant]
  const state = STATE_OF[event.type] ?? 'noted'
  const grants = previous.filter((p) => p.body.subject === subject && (p.body.state === 'granted' || p.body.state === 'renewed')).map((p) => p.id)
  const item = ((o.items as { data?: Record<string, unknown>[] } | undefined)?.data?.[0] ?? (o.lines as { data?: Record<string, unknown>[] } | undefined)?.data?.[0]) as Record<string, unknown> | undefined
  const price = (item?.price ?? o.price) as { metadata?: Record<string, string> } | undefined
  const pm = price?.metadata ?? {}
  const lastKnown = previous.filter((p) => p.body.subject === subject).at(-1)?.body
  const body: LicenceEntry['body'] = { event: event.id, type: event.type, state, subject, tenant, domains, product: meta.product ?? pm.product ?? lastKnown?.product ?? null, variant: meta.variant ?? pm.variant ?? lastKnown?.variant ?? null, quantity: typeof item?.quantity === 'number' ? item.quantity : typeof o.quantity === 'number' ? o.quantity : null, customer: typeof o.customer === 'string' ? o.customer : typeof o.customer_email === 'string' ? o.customer_email : null, amount: typeof o.amount_total === 'number' ? o.amount_total : typeof o.amount === 'number' ? o.amount : typeof o.amount_paid === 'number' ? o.amount_paid : null, currency: typeof o.currency === 'string' ? o.currency : null, at: event.created ?? 0, licence: LICENSE.address, terms: LICENSE.terms }
  return { id: uuidOf(`stripe-event${event.id}`), kind: 'licence', from: `stripe:${tenant}`, body, links: state === 'revoked' || state === 'disputed' || state === 'renewed' || state === 'changed' ? grants : [] }
}
/** The licence state of a subject at a domain, from its entries in order: the last word wins; a domain outside the licence is unlicensed. */
export const stateOf = (entries: readonly LicenceEntry[], subject: string, domain: string, now: number): { state: 'licensed' | 'unlicensed' | 'disputed'; why: string; since: number | null; entries: number; product?: string | null; variant?: string | null; quantity?: number | null } => {
  const mine = entries.filter((e) => e && e.body && e.body.subject === subject).sort((a, b) => a.body.at - b.body.at)
  if (!mine.length) return { state: 'unlicensed', why: `no licence entry names ${subject}; the a432 harmonic default stays free under attribution, commercial use requires a licence`, since: null, entries: 0 }
  const last = mine.at(-1)!
  if (!last.body.domains.includes(domain) && !last.body.domains.includes('*')) return { state: 'unlicensed', why: `the licence of ${subject} names ${last.body.domains.join(', ')}, not ${domain}: a licence is per domain unless it names *`, since: null, entries: mine.length }
  if (last.body.state === 'disputed') return { state: 'disputed', why: `a dispute is open on ${subject} since ${last.body.at}; the licence is held until it closes`, since: last.body.at, entries: mine.length }
  if (last.body.state === 'revoked' || last.body.state === 'failed') return { state: 'unlicensed', why: `${last.body.type} at ${last.body.at}: the licence of ${subject} ended`, since: null, entries: mine.length }
  const granted = mine.find((e) => e.body.state === 'granted')
  return { state: 'licensed', product: last.body.product, variant: last.body.variant, quantity: last.body.quantity, why: `${last.body.type} at ${last.body.at}${now > last.body.at + 366 * 86400 && last.body.type !== 'checkout.session.completed' ? ' (more than a year since the last renewal: check the subscription)' : ''}`, since: granted?.body.at ?? last.body.at, entries: mine.length }
}

const stripe = toolOf('billing', {
  name: 'stripe',
  description: 'Stripe per tenant, pure, the QPU as a product with its variants. catalogue: every product and variant (domain, tenant, seat, metered, enterprise; month, year, metered; eur, usd, bgn) as the forms Stripe takes, per tenant. usage: metered calls from docket entries as a usage record. settle: the author\'s compensation from Stripe\'s own net figures, by product and tenant, as a settlement entry. plan: a checkout session request for a commercial licence (subject, domains, mode, price or amount) that the Worker sends with the tenant\'s secret key. webhook: the Stripe-Signature verified with the tenant\'s webhook secret (HMAC-SHA256, timestamp tolerance), the event read into one idempotent licence entry (granted, renewed, revoked, disputed, failed, noted) linked to what it changes. state: the licence state of a subject at a domain from its entries, at any tenant. The handler holds no key; the Worker executes plans and the docket keeps the entries.',
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: ['plan', 'webhook', 'state', 'catalogue', 'usage', 'settle', 'usecases', 'fusion', 'ledger'] }, currency: { type: 'string', enum: ['eur', 'usd', 'bgn'], description: 'op ledger: the currency the coils are priced and settled in' }, calls: { type: 'array', items: { type: 'object' }, description: 'op ledger: the calls to book, { tool, tenant } each: a coin free, a coil at the metered price' }, settled: { type: 'array', items: { type: 'object' }, description: 'op ledger: what Stripe settled, { tenant, amount, fee, net, currency } in cents' }, tools: { type: 'array', items: { type: 'string' }, description: 'op fusion: the tools whose side of the fusion to answer (coin: pure algebra, free; coil: crosses to classical, licensed)' }, currencies: { type: 'array', items: { type: 'string' } }, from: { type: 'integer' }, to: { type: 'integer' }, transactions: { type: 'array', items: { type: 'object' }, description: 'settle: Stripe balance transactions {id, amount, fee, net, currency, product?, variant?, tenant?}' }, tenant: { type: 'string' }, host: { type: 'string' }, checkout: { type: 'object', description: 'plan: { subject, domains, mode, price | amount, currency, successUrl, cancelUrl, customerEmail? }' }, payload: { type: 'string', description: 'webhook: the raw body' }, signature: { type: 'string', description: 'webhook: the Stripe-Signature header' }, secret: { type: 'string', description: 'webhook: the tenant\'s webhook secret (the Worker passes it; a client never has it)' }, now: { type: 'integer', description: 'webhook/state: unix seconds; default the current time' }, entries: { type: 'array', items: { type: 'object' }, description: 'webhook/state: the subject\'s licence entries as read from the docket' }, subject: { type: 'string' }, domain: { type: 'string' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...BILLING.skill.selftest(ctx) }
    const op = String(args.op ?? 'state'); const tenant = String(args.tenant ?? 'local'); const now = typeof args.now === 'number' ? args.now : Math.floor(Date.now() / 1000)
    const entries = (Array.isArray(args.entries) ? args.entries : []) as LicenceEntry[]
    if (op === 'plan') {
      const c = (args.checkout ?? {}) as Partial<Checkout>
      if (!c.subject || !c.successUrl || !c.cancelUrl) throw new Error('plan needs checkout.subject, successUrl and cancelUrl')
      const plan = planOf({ tenant, host: String(args.host ?? tenant), subject: c.subject, domains: c.domains?.length ? c.domains : [String(args.host ?? tenant)], mode: c.mode ?? 'payment', price: c.price, amount: c.amount, currency: c.currency ?? 'eur', successUrl: c.successUrl, cancelUrl: c.cancelUrl, customerEmail: c.customerEmail })
      return { op, tenant, secret: plan.secret, url: plan.url, fields: Object.keys(plan.form).length, plan, procedure: `the Worker sends this form to ${plan.url} with Authorization: Bearer <${plan.secret}> and answers with the session url; the webhook of this tenant then writes the licence entry` }
    }
    if (op === 'webhook') {
      if (typeof args.payload !== 'string' || typeof args.signature !== 'string' || typeof args.secret !== 'string') throw new Error('webhook needs payload, signature and secret')
      const v = verifySignature(args.secret, args.signature, args.payload, now)
      if (!v.valid) return { op, tenant, valid: false, why: v.why, timestamp: v.timestamp, entry: null, lead: { id: `stripe-webhook-refused-${tenant}`, statement: `a webhook at tenant ${tenant} was refused: ${v.why}`, status: 'open', reason: 'a refused webhook is a lead: a replay, a wrong tenant\'s secret, or a forged body; nothing was written' } }
      let event: { id: string; type: string; created?: number; data?: { object?: Record<string, unknown> } }
      try { event = JSON.parse(args.payload) } catch { return { op, tenant, valid: true, why: 'signed, but the body is not JSON', entry: null } }
      const entry = entryOf(tenant, event, entries)
      const duplicate = entries.some((e) => e.id === entry.id)
      return { op, tenant, valid: true, why: v.why, event: event.id, type: event.type, state: entry.body.state, duplicate, entry, procedure: duplicate ? 'the same event again: the docket answers duplicate, nothing changes' : `POST this entry to the ${tenant} docket as its stripe writer; it mirrors to the other tenants, where state reads it by the domains it names` }
    }
    if (op === 'state') {
      if (typeof args.subject !== 'string') throw new Error('state needs subject')
      const st = stateOf(entries, args.subject, String(args.domain ?? args.host ?? tenant), now)
      return { op, tenant, subject: args.subject, domain: String(args.domain ?? args.host ?? tenant), ...st }
    }
    if (op === 'usecases') return stripeUseCasesOf(Array.isArray(args.paths) ? args.paths.map(String) : [])
    if (op === 'ledger') return { op: 'ledger' as const, ...ledgerOf(Array.isArray(args.calls) ? (args.calls as { tool: string; tenant: string }[]) : [], Array.isArray(args.settled) ? (args.settled as { tenant?: string; amount: number; fee: number; net: number; currency: string }[]) : [], (['eur', 'usd', 'bgn'] as const).find((c) => c === args.currency) ?? 'eur') } as never
    if (op === 'fusion') { const tools = Array.isArray(args.tools) ? args.tools.map(String) : []; const rows = tools.map((t) => fusionOf(t)); return { op: 'fusion', tools: rows, coins: rows.filter((r) => r.side === 'coin').length, coils: rows.filter((r) => r.side === 'coil').length, algebra: ALGEBRA_TOOLS, enforced: 'every tools/call result carries _meta.fusion; the Worker answers 402 with the court\'s case to a request declaring commercial use (x-qpu-use: commercial) of a coil, or a commercial write into the docket, without a licence at the tenant', theorems: ['textbook_free_or_coil', 'textbook_double_torus'] } }
    if (op === 'catalogue') { const c = catalogueOf(tenant, Array.isArray(args.currencies) ? args.currencies.map(String) : ['eur', 'usd', 'bgn']); return { op, tenant, margins: marginsOf(args.costs && typeof args.costs === 'object' ? args.costs as Record<string, number> : {}), products: c.products.length, prices: c.prices.length, variants: CATALOGUE.length, secret: c.secret, catalogue: CATALOGUE, forms: c, procedure: `the Worker creates the products and prices at Stripe with <${c.secret}> once per tenant; the price ids come back in the webhooks' metadata` } }
    if (op === 'usage') { if (typeof args.subject !== 'string') throw new Error('usage needs subject'); const u = usageOf((Array.isArray(args.entries) ? args.entries : []) as Parameters<typeof usageOf>[0], args.subject, Number(args.from ?? 0), Number(args.to ?? now)); return { op, tenant, subject: args.subject, ...u, procedure: 'the Worker posts the form to /v1/subscription_items/<item>/usage_records with the tenant key; the receipt is an entry' } }
    if (op === 'settle') { const st = settlementOf((Array.isArray(args.transactions) ? args.transactions : []) as Parameters<typeof settlementOf>[0]); return { op, tenant, ...st, procedure: 'balance transactions are read from Stripe with the tenant key (net and fee are Stripe\'s figures); the settlement entry is written to the docket as the author\'s compensation ledger' } }
    throw new Error(`op ${op} is not one of plan, webhook, state, catalogue, usage, settle`)
  },
  widget: flowWidget,
})

const SECRET = 'whsec_test_secret_of_tenant_psg'
const EVENT = (id: string, type: string, created: number, object: Record<string, unknown>) => JSON.stringify({ id, type, created, data: { object } })
const COMPLETED = EVENT('evt_1', 'checkout.session.completed', 1_700_000_000, { customer: 'cus_1', amount_total: 43200, currency: 'eur', metadata: { tenant: 'psg', subject: 'acme', domains: 'qpu.psg.bg,qpu.uuidna.com' } })

/** The rate sources, every free currency API found (2026-10-26): the ECB's daily reference rates (the euro's own), Frankfurter (ECB-based JSON, v1), the
 * Bulgarian National Bank's reference rates (foreign currency per euro since Bulgaria adopted the euro on 2026-01-01), open.er-api (daily, free tier),
 * and fawazahmed0's currency-api on jsDelivr (daily, 200+ currencies incl. crypto). All EUR-based, all daily: real time is the day for reference rates;
 * an intraday rate is a paid provider's door, a lead. Fetched by the currency step and by the wave as references; parsed here, pure. */
export const RATE_SOURCES: readonly { id: string; name: string; url: string; format: 'xml-ecb' | 'json-frankfurter' | 'xml-bnb' | 'json-er-api' | 'json-fawazahmed'; cadence: string; terms: string }[] = [
  { id: 'ecb', name: 'European Central Bank, euro foreign exchange reference rates', url: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml', format: 'xml-ecb', cadence: 'daily, around 16:00 CET', terms: 'free, reference only' },
  { id: 'frankfurter', name: 'Frankfurter (ECB rates as JSON)', url: 'https://api.frankfurter.dev/v1/latest?base=EUR', format: 'json-frankfurter', cadence: 'daily (ECB)', terms: 'free, open source' },
  { id: 'bnb', name: 'Bulgarian National Bank, reference rates (foreign currency per 1 euro)', url: 'https://www.bnb.bg/Statistics/StExternalSector/StExchangeRates/StERForeignCurrencies/index.htm?download=xml&search=&lang=EN', format: 'xml-bnb', cadence: 'daily', terms: 'free, reference only' },
  { id: 'er-api', name: 'open.er-api.com (ExchangeRate-API open endpoint)', url: 'https://open.er-api.com/v6/latest/EUR', format: 'json-er-api', cadence: 'daily, 1 500 requests a month free', terms: 'free tier with attribution' },
  { id: 'fawazahmed', name: 'fawazahmed0/currency-api on jsDelivr', url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json', format: 'json-fawazahmed', cadence: 'daily', terms: 'free, CC0' },
]
/** Legal conversion rates: a currency replaced by the euro converts at its fixed rate forever (Bulgaria: 1 EUR = 1.95583 BGN, euro adopted 2026-01-01). */
export const PEGS: Readonly<Record<string, { perEur: number; since: string; says: string }>> = { BGN: { perEur: 1.95583, since: '2026-01-01', says: 'the lev is retired: Bulgaria adopted the euro on 2026-01-01 at the fixed conversion rate of 1.95583 leva per euro; a BGN amount is the EUR amount shown in leva' } }
/** The currency a domain prices in, by its top-level domain; a tenant prices in its own. */
export const DOMAIN_CURRENCY: Readonly<Record<string, string>> = { bg: 'EUR', eu: 'EUR', de: 'EUR', fr: 'EUR', it: 'EUR', es: 'EUR', nl: 'EUR', at: 'EUR', com: 'USD', us: 'USD', uk: 'GBP', ch: 'CHF', jp: 'JPY', dev: 'USD', workers: 'USD' }
/** The usage bill as the ecommerce plugin's own order, strictly the upstream shape: the metered variant of the catalogue times the thousands of calls
 *  (items: product, variant, quantity; the amount in minor units of the currency), the transactions the ledger, the checkout the plugin's own with the
 *  Stripe adapter; the energy line informational at the tariff the tenant names (textbook_billing_complete). Pure. */
/** The pure algebraic formulas, free under attribution (the a432 harmonic default): the core's algebra over a UUID (fold, presentation, stream), the stylesheet
 *  from the key 432, the seal arithmetic a UUID verifies by, the register's integer identities. Every other call is covered by the licence. */
export const ALGEBRA_TOOLS: readonly string[] = ['css', 'fold', 'verify', 'clay']
/** Cloudflare's free tiers as its pricing pages state them (each with its page, to verify there): what the Payload app over OpenNext and the
 *  Worker may use a day without a bill; beyond any of them the Workers Paid plan, whose base is the minimum bill. */
export const CLOUDFLARE_FREE = {
  workersRequestsPerDay: { limit: 100000, page: 'https://developers.cloudflare.com/workers/platform/pricing/' },
  d1RowsReadPerDay: { limit: 5000000, page: 'https://developers.cloudflare.com/d1/platform/pricing/' },
  d1RowsWrittenPerDay: { limit: 100000, page: 'https://developers.cloudflare.com/d1/platform/pricing/' },
  kvReadsPerDay: { limit: 100000, page: 'https://developers.cloudflare.com/kv/platform/pricing/' },
  kvWritesPerDay: { limit: 1000, page: 'https://developers.cloudflare.com/kv/platform/pricing/' },
  r2StorageGbMonth: { limit: 10, page: 'https://developers.cloudflare.com/r2/pricing/' },
  aiNeuronsPerDay: { limit: 10000, page: 'https://developers.cloudflare.com/workers-ai/platform/pricing/' },
  durableObjectRequestsPerDay: { limit: 100000, page: 'https://developers.cloudflare.com/durable-objects/platform/pricing/' },
} as const
export const WORKERS_PAID_BASE_USD_CENTS = 500
export type CloudflareUsage = Partial<Record<keyof typeof CLOUDFLARE_FREE, number>>
/** The minimum bill of existing and computing: zero while every measured use stays within its free tier, else the paid plan's base a month;
 *  against it the cheapest licence of the catalogue a month, so the margin of the quantum framework is the licence less the bill. */
export const cloudflareBillOf = (usage: CloudflareUsage, currency = 'eur') => {
  const over = (Object.keys(CLOUDFLARE_FREE) as (keyof typeof CLOUDFLARE_FREE)[]).filter((k) => typeof usage[k] === 'number' && usage[k]! > CLOUDFLARE_FREE[k].limit)
  const measured = (Object.keys(CLOUDFLARE_FREE) as (keyof typeof CLOUDFLARE_FREE)[]).filter((k) => typeof usage[k] === 'number')
  const monthlyCents = over.length ? WORKERS_PAID_BASE_USD_CENTS : 0
  const paid = CATALOGUE.filter((v) => (v.amounts[currency] ?? 0) > 0 && (v.interval === 'month' || v.interval === 'year'))
  const cheapest = paid.map((v) => ({ product: v.product, variant: v.variant, perMonth: Math.round((v.amounts[currency] ?? 0) / (v.interval === 'year' ? 12 : 1)) })).sort((a, b) => a.perMonth - b.perMonth)[0] ?? null
  return { plan: over.length ? 'workers-paid' : 'free', over, measured: measured.length, of: Object.keys(CLOUDFLARE_FREE).length, monthlyCents, currency: over.length ? 'usd' : currency, cheapestLicence: cheapest, marginPerMonth: cheapest ? cheapest.perMonth - monthlyCents : null, covered: cheapest ? cheapest.perMonth >= monthlyCents : false, pages: [...new Set(Object.values(CLOUDFLARE_FREE).map((x) => x.page))], theorem: 'textbook_bill_covered', says: over.length ? `over the free tier on ${over.join(', ')}: the Workers Paid base, ${monthlyCents / 100} USD a month, against the cheapest licence` : `every measured use (${measured.length} of ${Object.keys(CLOUDFLARE_FREE).length}) within the free tier: a bill of zero, the licence all margin` }
}
/** Licensing by architecture: the quantum core computes on the classical world only through the fusion of coins into coils, and the classical
 *  world reaches the core only the same way back. A call is a coin when it stays pure algebra (free under attribution, the a432 default), a coil
 *  when it crosses to classical data or services (covered by the licence); every result carries which, and the Worker refuses a declared
 *  commercial coil, or a commercial write into the core, without a licence, with the case the court computes. The two directions are the two
 *  loops of the double torus, each crossing one finite step with always a next (textbook_double_torus). */
/** A call is a coin when it stays in the pure algebra: a tool of the algebra, or the textbook asked only for one theorem (a read of what the kernel accepted). */
export const isCoinCall = (tool: string, args?: Record<string, unknown>) => ALGEBRA_TOOLS.includes(tool) || (tool === 'textbook' && !!args && Object.keys(args).length > 0 && Object.keys(args).every((k) => k === 'theorem'))
export const fusionOf = (tool: string, args?: Record<string, unknown>) => { const coin = isCoinCall(tool, args); return { tool, side: (coin ? 'coin' : 'coil') as 'coin' | 'coil', crossing: coin ? 'none: pure algebra stays in the core' : 'quantum → classical: the result reaches data or services', licence: coin ? 'free under attribution (the a432 harmonic default)' : 'covered by the licence: non-commercial use free under its term, commercial use needs a licence of the catalogue', back: 'classical → quantum: a write into the docket is a coil the same way', theorem: 'textbook_free_or_coil' } }
/** Coins and coils in double entry, in thousandths of a cent so nothing rounds: a coin (pure algebra) is booked at zero on both sides, a coil
 *  (a crossing into data or services) debits the tenant's receivable and credits the author's revenue at the metered price, and a Stripe
 *  settlement debits cash and fees and credits the receivable; the journal balances by construction (textbook_double_entry), and a tenant
 *  whose coils exceed what Stripe settled is named with the amount outstanding, never assumed paid. */
/** A penalty, priced in work and sealed: every strict refusal, every open competition gap and every step that ends red, skipped or killed.
 *  Its tokens are the size of what has to be redone (the manual difference, the gap's text, the step's output) at four bytes a token; its coin line
 *  books that count against the one who caused it and to the author, at zero price — it counts work, never money, and debits equal credits
 *  (textbook_double_entry); its snapshot is the evidence, sealed by SHA-256 and addressed. A clearing names the penalty its evidence closed. Pure. */
/** Every gap between the QPU and its prizes is one shape: a kind, a subject, open or cleared, its tokens, its coin line, its sealed snapshot. The
 *  kinds that block a push (manual edits, strict refusals, red steps, prize gaps, dirty code in changed files) and those only listed (waiting over
 *  the one-second bar, dirty prose, Gemini schema compatibility) differ only in this table, never in their path. */
export const GAP_KINDS = { automated: true, refusal: true, step: true, prize: true, 'dirty-code': true, waiting: false, 'dirty-prose': false, 'gemini-compat': false, idle: false, invisible: false } as const
/** A penalty is as visible as the action it prices (textbook_penalty_visibility_harmonic): every kind is printed first in a hook's output except
 *  an invisible action's — a task past the one-second budget with no progress event, receipt or docket entry within that second — which is
 *  recorded silently in the docket and counted on request, never printed. */
export const GAP_PRINTED: Readonly<Record<keyof typeof GAP_KINDS, boolean>> = { automated: true, refusal: true, step: true, prize: true, 'dirty-code': true, waiting: true, 'dirty-prose': true, 'gemini-compat': true, idle: true, invisible: false }
export type GapKind = keyof typeof GAP_KINDS
export const gapKindOf = (rule: string, kind?: string): GapKind => (kind && kind in GAP_KINDS ? (kind as GapKind) : /automated/.test(rule) ? 'automated' : 'refusal')
/** Time and heat, the only two measures of a task: wall nanoseconds (process.hrtime.bigint) and CPU microseconds, user and system, with the peak
 *  RSS (process.resourceUsage of the task's own process, summed over a spawned step's Node processes). Heat is CPU work, what makes the machine
 *  hot: a die's temperature needs privileged sensors, so it is never read and never claimed. Under the one-second budget a task is free
 *  (textbook_penalty_free_under_budget); over it, its price is the milliseconds over the budget plus its CPU milliseconds, and more of either never
 *  lowers it (textbook_penalty_time_heat_monotone). */
export const WAIT_BUDGET_MS = 1000
/** The budget applies once per workflow run, over the sum of all of an actor's tasks in it, so splitting one slow task into pieces under the budget
 *  never dodges the price: the pieces are defragmented into one measure. */
export const runWaitPriceOf = (tasks: readonly Measures[]) => waitPriceOf({ wallNs: String(tasks.reduce((n, t) => n + Math.floor(Number(t.wallNs) / 1e6), 0) * 1e6), cpuUs: tasks.reduce((n, t) => n + Math.max(0, Number(t.cpuUs)), 0) })
export type Measures = { wallNs: number | string; cpuUs: number; rssKb?: number }
export const waitPriceOf = (m: Measures) => {
  // only the overage is priced, so the price has no cliff at the budget: the wall ms beyond it plus the CPU ms beyond it, each rising by at most
  // one per millisecond (textbook_penalty_no_cliff)
  const wallMs = Math.floor(Number(m.wallNs) / 1e6), cpuMs = Math.floor(Math.max(0, Number(m.cpuUs)) / 1000)
  const time = Math.max(0, wallMs - WAIT_BUDGET_MS), heat = Math.max(0, cpuMs - WAIT_BUDGET_MS), free = time === 0 && heat === 0
  return { wallMs, cpuMs, rssKb: m.rssKb ?? null, budgetMs: WAIT_BUDGET_MS, free, time, heat, coins: time + heat }
}
type Move = { cmd: string; args: string[]; needs: 'auto' | 'confirm' }
/** A gap's antimatter: the exact inverse action that removes the obstacle, generated from the gap's own evidence and put in the offender's way — a
 *  machine plan (argument vectors, no shell) or a door call, ready to run. It runs by itself only when every move is reversible and touches
 *  generated or derived files (regenerate, restage, purify, standardise, shard); a move that discards work or uses force (force-remove, branch -D,
 *  dropping uncommitted changes) is planned with needs: 'confirm' and never run without the user. Null when nothing is learned yet: a lead. */
export const antimatterOf = (kind: GapKind, rule: string, evidence: Record<string, unknown> = {}) => {
  const of = (says: string, run: Move[], door: { tool: string; arguments: Record<string, unknown> } | null = null) => { const needs = run.some((m) => m.needs === 'confirm') ? 'confirm' as const : 'auto' as const; return { needs, run, door, says, way: wayOf(evidence), learn: false, address: uuidOf(JSON.stringify({ kind, run, door })) } }
  const auto = (cmd: string, args: string[]): Move => ({ cmd, args, needs: 'auto' })
  const violated = (evidence.violated as string[] | undefined) ?? []
  const sole = evidence.sole as { worktrees?: { path: string; dirty: boolean }[]; branches?: { name: string; merged: boolean }[] } | undefined
  if (kind === 'automated') {
    const drifted = (evidence.drifted as string[] | undefined) ?? ((evidence.files as { path: string }[] | undefined) ?? []).map((f) => f.path)
    const gens = [...new Map((drifted.length ? drifted.map((p) => GENERATOR_REMEDIES.find(([re]) => re.test(p))![1]) : [GENERATOR_REMEDIES.at(-1)![1]]).map((g) => [g.args.join(' '), g])).values()]
    return of(`regenerate ${drifted.length ? drifted.join(', ') : 'the generated files'} by ${gens.map((g) => [g.cmd, ...g.args].join(' ')).join(', ')}, then restage them`, [...gens.map((g) => auto(g.cmd, g.args)), ...(drifted.length ? [auto('git', ['add', '--', ...drifted])] : [])])
  }
  if (kind === 'waiting') {
    const price = waitPriceOf((evidence.measures as Measures | undefined) ?? { wallNs: 0, cpuUs: 0 }), n = Math.max(2, Math.ceil(price.wallMs / WAIT_BUDGET_MS))
    if (typeof evidence.cacheKey === 'string') return of(`skip ${String(evidence.step ?? rule)} by its cache key ${evidence.cacheKey}: unchanged inputs, the kept answer`, [], { tool: 'verify', arguments: { uuid: evidence.cacheKey } })
    return of(`split ${String(evidence.step ?? rule)} into ${n} shards of under a second each (QPU_SHARD=i/${n}, then merge): the shares cover the work exactly once (textbook_shards_cover, textbook_shards_disjoint)`, [], { tool: 'shard', arguments: { list: (evidence.items as unknown[] | undefined) ?? [String(evidence.step ?? rule)], index: 0, count: n } })
  }
  if (kind === 'dirty-code' || kind === 'dirty-prose') return of('purify, then standardise the typography of exactly the dirty spans', [auto('npm', ['run', '-s', 'purify'])], evidence.doc ? { tool: 'payload', arguments: { standardise: { doc: evidence.doc, spans: evidence.spans ?? [] } } } : null)
  if (kind === 'prize' || kind === 'step') {
    const command = evidence.command as { cmd: string; args: string[] } | undefined
    return of(`run the red ${kind === 'prize' ? 'compete rule' : 'step'} ${String(evidence.step ?? evidence.subject ?? rule)} again`, command ? [auto(command.cmd, command.args)] : [], kind === 'prize' ? { tool: 'compete', arguments: { rule: String(evidence.subject ?? rule) } } : null)
  }
  if (violated.includes('sole') && sole) {
    const moves: Move[] = [...(sole.worktrees ?? []).map((w) => (w.dirty ? { cmd: 'git', args: ['worktree', 'remove', '--force', w.path], needs: 'confirm' as const } : auto('git', ['worktree', 'remove', w.path]))), ...(sole.branches ?? []).map((b) => (b.merged ? auto('git', ['branch', '-d', b.name]) : { cmd: 'git', args: ['branch', '-D', b.name], needs: 'confirm' as const }))]
    return of('the cleanup of every other branch and worktree: a clean worktree removed and a merged branch deleted by themselves; a dirty worktree or an unmerged branch only on the user\'s confirmation, since it discards work', moves)
  }
  if (kind === 'invisible') return of(`make ${String(evidence.step ?? evidence.subject ?? rule)} visible: a progress stream (notifications/progress or a line) and a receipt written at its start and at each sub-step, within the first second`, [])
  if (kind === 'idle') {
    const measure = String(evidence.measure ?? 'door'), name = String(evidence.name ?? evidence.subject ?? rule)
    const wire: Record<string, [string, { tool: string; arguments: Record<string, unknown> } | null]> = {
      door: [`add ${name} to the e2e cells and give it an example, so the gate reaches it`, { tool: 'e2e', arguments: {} }],
      theorem: [`wire ${name}: an example naming it and a chat route answering its sentence`, { tool: 'textbook', arguments: { theorem: name } }],
      gate: [`call ${name} once in the next online run, through discovery`, { tool: 'discover', arguments: {} }],
      cores: [`run ${name}'s independent parts at once: split by the shard theorems or put the step in the wave of its peers`, { tool: 'shard', arguments: { list: [name], index: 0, count: Math.max(2, Number(evidence.cores ?? 2)) } }],
      qubits: [`generate examples and e2e cells for ${name} at every qubit count up to the simulator's bound`, null],
      shor: [`generate an example for Shor at each N not yet asked: ${name}`, null],
    }
    const [says, door] = wire[measure] ?? wire.door!
    return { ...of(`${says}; folding it away instead needs the user's confirmation`, [], door), fold: { needs: 'confirm' as const, says: `fold ${name} into its nearest door or theorem, or remove it` } }
  }
  if (kind === 'gemini-compat') return of('narrow each schema to the Gemini subset the compatibility check names: the unsupported keywords dropped, their meaning kept in the description', [], { tool: 'extend', arguments: { gemini: { compat: true } } })
  const row = remediesOf([String(evidence.says ?? rule)]).leads[0]
  if (row?.remedy) return { ...of(row.remedy, []), needs: row.automated ? 'auto' as const : 'confirm' as const }
  if (violated.includes('green')) return of('run next again, offline and fast: the red step regenerated and rechecked', [auto('npm', ['run', '-s', 'next', '--', '--offline', '--fast'])])
  // a refusal no row has learned yet: its antimatter is the lead that teaches the next row, its text the evidence (counted as none until learned)
  return { ...of(`no remedy learned yet for ${rule}: a lead that teaches the next ERROR_REMEDIES row from this refusal's text`, [], { tool: 'audit', arguments: { errors: [String(evidence.says ?? rule)] } }), learn: true }
}
/** The one passable way: every antimatter routes onto the a432 harmonic default, free under attribution. A value the role may not choose is
 *  corrected to the harmonic default its schema gives (harmonicDefaultsOf, narrowed by mayChoose: the crypto door { harmonic }); a call that is a
 *  coil (it crosses into data or services) is answered first by its free side — the kernel's own statement of the theorem it rests on, a coin —
 *  and the coil stays the licence's, never forced (textbook_free_or_coil). The way never dead-ends: every gap kind has antimatter
 *  (textbook_antimatter_total), so from any gap the next step is defined. */
export const wayOf = (evidence: Record<string, unknown> = {}) => {
  const tool = typeof evidence.tool === 'string' ? evidence.tool : null, args = (evidence.arguments as Record<string, unknown> | undefined) ?? undefined
  const fusion = tool ? fusionOf(tool, args) : null
  const free = fusion?.side === 'coil' ? { tool: 'textbook', arguments: { theorem: typeof evidence.theorem === 'string' ? evidence.theorem : 'textbook_free_or_coil' } } : tool ? { tool, arguments: args ?? {} } : null
  const harmonic = evidence.schema ? { tool: 'crypto', arguments: { harmonic: { schema: evidence.schema, ...(typeof evidence.referrer === 'string' ? { referrer: evidence.referrer } : {}) } } } : null
  return { harmonic: 'a432' as const, side: fusion?.side ?? 'coin', free, correct: harmonic, licence: fusion?.licence ?? 'free under attribution (the a432 harmonic default)', theorem: 'textbook_free_or_coil' }
}
/** A penalty is harmonic to its violation: priced in the violation's own unit, the work its antimatter must do to undo it — never a flat fine, never
 *  a price from another dimension. A byte-measured gap (a hand-edited generated file: the drifted bytes; dirty code or prose: the dirty spans;
 *  a refusal: its violated facts' evidence) is its bytes at four a token; a waiting gap is its milliseconds over the budget and its CPU
 *  milliseconds; a red step or prize gap with measures is its own measured milliseconds. So the price is the antimatter's cost
 *  (textbook_penalty_harmonic) and annihilation nets to exactly zero. A rule broken n times in one workflow costs n units, in proportion, never
 *  escalated (textbook_penalty_proportional); how many gaps share a rule is reported as their correlation, never compounded. */
export const harmonicUnitOf = (kind: GapKind, p: { bytes?: number; tokens?: number; measures?: Measures }) => {
  if (kind === 'waiting' && p.measures) { const w = waitPriceOf(p.measures); return { per: w.coins, unit: 'ms over the budget + CPU ms' } }
  if (kind === 'invisible' && p.measures) { const w = waitPriceOf(p.measures); return { per: w.coins, unit: 'ms unseen over the budget + CPU ms' } }
  if ((kind === 'step' || kind === 'prize') && p.measures) { const w = waitPriceOf(p.measures); return { per: w.wallMs + w.cpuMs, unit: 'ms measured + CPU ms' } }
  if (typeof p.tokens === 'number') return { per: Math.max(0, Math.ceil(p.tokens)), unit: 'tokens measured' }
  return { per: Math.ceil(Math.max(0, p.bytes ?? 0) / 4), unit: 'tokens (bytes / 4)' }
}
/** A penalty, or its clearing. Raised, it carries its antimatter and is priced harmonically, in its violation's own unit. Cleared — by its
 *  evidence, or annihilated when its antimatter has run and every rule it violated holds again (held) — the status is restored: open becomes
 *  cleared, nothing blocks, no mark stays on the offender's standing (textbook_penalty_no_punishment, on status and standing, not on coins), and
 *  the reversing line nets the obstacle's harmonic price to zero (textbook_penalty_antimatter_annihilates). The time the gap stood is charged
 *  like a proof-of-stake burn: its milliseconds over the one-second budget plus its CPU milliseconds, debited to the offender and credited to the
 *  burn account, monotone in the time stood, zero when cleared within the budget and never refunded (textbook_penalty_time_burned); the ledger
 *  stays double entry, burn account included (textbook_coins_coils_balanced). A signature with a learned automatic correction is a correction to
 *  apply, never a penalty (textbook_penalty_learned_prevents). */
export const penaltyOf = (p: { rule: string; kind?: string; subject?: string; bytes?: number; tokens?: number; occurrences?: number; committer?: string | null; cleared?: boolean; by?: string | null; measures?: Measures; held?: string[]; stood?: Measures; learned?: readonly string[]; evidence?: Record<string, unknown> }) => {
  const kind = gapKindOf(p.rule, p.kind), blocks = GAP_KINDS[kind]
  const subject = p.subject ?? String((p.evidence as { key?: unknown } | undefined)?.key ?? p.rule)
  const price = p.measures ? waitPriceOf(p.measures) : null
  const occurrences = Math.max(1, Math.floor(p.occurrences ?? 1)), harmonic = harmonicUnitOf(kind, p), tokens = occurrences * harmonic.per
  const committer = (p.committer ?? '').trim() || 'unknown'
  const snapshot = { rule: p.rule, kind, subject, ...(p.evidence ?? {}), ...(price ? { measures: { ...p.measures, wallNs: String(p.measures!.wallNs) }, price } : {}), ...(occurrences > 1 ? { occurrences } : {}), key: String((p.evidence as { key?: unknown } | undefined)?.key ?? `${kind}:${subject}`) }
  const text = JSON.stringify(snapshot)
  const seal = { sha256: hex(sha256(utf8(text))), address: uuidOf(text) }
  const matter = antimatterOf(kind, p.rule, { ...(p.evidence ?? {}), subject, ...(p.measures ? { measures: p.measures } : {}) })
  const antimatter = { ...matter, cost: { amount: tokens, per: harmonic.per, occurrences, unit: harmonic.unit } }
  const violated = ((p.evidence as { violated?: string[] } | undefined)?.violated ?? []).length ? (p.evidence as { violated: string[] }).violated : [kind]
  // the involution of thinking: a signature whose correction was learned from an earlier clearing is corrected before it is decided, never raised
  // — its antimatter applied, no penalty, no coin (textbook_penalty_learned_prevents)
  // learned means a correction that ran by itself and cleared; it is a plan here — the client applies it, re-decides the rule, and records the
  // prevention only when the rule holds again; a correction that needs confirmation, or no remedy learned yet, is never applied this way
  if (!p.cleared && p.learned?.includes(p.rule) && antimatter.needs === 'auto' && !antimatter.learn) return { kind: 'corrected' as const, antimatter, body: { kind, subject, status: 'corrected' as const, blocks: false, rule: p.rule, prevented: true, correction: antimatter, snapshot, seal }, tokens: 0, coin: null, balanced: true, says: `${p.rule}: corrected by its learned antimatter (${antimatter.needs}) ${antimatter.says}; no penalty raised`, theorem: 'textbook_penalty_learned_prevents' }
  const annihilated = !p.cleared && Array.isArray(p.held) && violated.every((v) => p.held!.includes(v))
  if (p.cleared || annihilated) {
    // clearing restores the status — open becomes cleared, nothing blocks, no mark stays on the offender's standing — and the reversing line nets
    // the obstacle's harmonic price (its antimatter's own cost) to zero; the time the gap stood is charged like a proof-of-stake burn: its
    // milliseconds over the budget plus its CPU milliseconds, debited to the offender and credited to the burn account, never refunded
    // (textbook_penalty_no_punishment on status and standing, textbook_penalty_antimatter_annihilates, textbook_penalty_time_burned)
    const stood = p.stood ? waitPriceOf(p.stood) : null, burned = stood?.coins ?? 0
    const reversal = tokens > 0 ? { debit: 'coins:author', credit: `coins:${committer}`, amount: 0, count: tokens } : null
    const burn = burned > 0 ? { debit: `coins:${committer}`, credit: 'burn', amount: 0, count: burned } : null
    return { kind: 'clearing' as const, body: { kind, subject, status: 'cleared' as const, blocks, rule: p.rule, cleared: true, annihilated, by: p.by ?? (annihilated ? `antimatter ${antimatter.address}: ${violated.join(', ')} hold again` : null), antimatter, reversal, coin: burn, burned, history: stood ? { stood } : null, learned: { signature: p.rule, correction: antimatter.says, run: antimatter.run, door: antimatter.door, needs: antimatter.needs }, snapshot, seal }, tokens: burned, coin: burn, reversal, burned, net: reversal ? tokens - reversal.count : 0, standing: { before: 'clear', after: 'clear' }, balanced: (!reversal || lineBalanced(reversal)) && (!burn || lineBalanced(burn)), says: `${p.rule} ${annihilated ? 'annihilated by its antimatter' : `cleared by ${p.by ?? 'its evidence'}`}: the status restored and the offender's standing as before the violation, the penalty's ${tokens} reversed to zero${burned ? `, ${burned} coin(s) burned for the ${stood!.wallMs} ms it stood (never refunded)` : ''}, the correction learned`, theorem: annihilated ? 'textbook_penalty_antimatter_annihilates' : 'textbook_penalty_no_punishment' }
  }
  const coin = { debit: `coins:${committer}`, credit: 'coins:author', amount: 0, count: tokens }
  return { kind: 'penalty' as const, antimatter, printed: GAP_PRINTED[kind], body: { kind, subject, status: 'open' as const, blocks, printed: GAP_PRINTED[kind], rule: p.rule, tokens, coin, antimatter, snapshot, seal }, tokens, coin, price, balanced: lineBalanced(coin), says: `${p.rule}: ${tokens} token(s) of work booked against ${committer} and to the author, at zero price — work, not money; antimatter ${antimatter ? `(${antimatter.needs}) ${antimatter.says}` : 'not learned yet: a lead'}`, harmonic: { ...harmonic, occurrences, price: tokens, theorems: ['textbook_penalty_harmonic', 'textbook_penalty_proportional'] }, theorem: price && kind === 'waiting' ? 'textbook_penalty_time_heat_monotone' : 'textbook_penalty_harmonic' }
}
type Line = { debit: string; credit: string; amount: number; count?: number }
type GapBody = { prevented?: boolean; rule?: string; kind?: string; subject?: string; tenant?: string; blocks?: boolean; cleared?: boolean; tokens?: number; coin?: Line | null; reversal?: Line | null; coil?: Line | null; antimatter?: ReturnType<typeof antimatterOf>; snapshot?: { key?: string; price?: ReturnType<typeof waitPriceOf> } & Record<string, unknown>; seal?: { address?: string } }
/** Unused quantum capacity, each measure in its own unit, used + idle = capacity (textbook_capacity_conserved): doors no example, e2e cell, chat
 *  route or next step reaches (their schema bytes), theorems nothing names (their statement's bytes), gates with no successful call in the last
 *  online run (one call each), idle cores (wall ms × cores − CPU ms, per step), the qubits a quantum call leaves unused below the simulator's
 *  stated bound (bound − used per call) and the Shor N never asked below its bound. The advantage of a served quantum door is the hosted door's
 *  to measure (get_quantum_advantage): unmeasured here, said so. Indexable clusters named but in no shard are reported, never priced. Every idle
 *  item is an idle gap — listed, never blocking — priced harmonically in its measure's unit, with antimatter that wires it (reversible) and a fold
 *  that waits on confirm. The bounds are the simulator's stated constants, never more, never a hardware claim. */
export type RemainingWork = { category: string; count: number; ms: number | null; how: string }[]
export type CapacityInput = { remaining?: RemainingWork; doors?: { name: string; bytes: number; reached: boolean }[]; theorems?: { key: string; bytes: number; used: boolean }[]; gates?: { name: string; called: boolean }[]; cores?: { step: string; wallMs: number; cpuMs: number; cores: number }[]; qubits?: { bound: number; calls: { door: string; used: number }[] }; shor?: { bound: number; asked: number[] }; clusters?: { named: number; sharded: number } }
/** Idle priced by the cost of the remaining work, both in ms: min(idle capacity, remaining work) — nothing left to do costs nothing, idle while work
 *  is queued costs the work it could have run (textbook_idle_priced_by_remaining). The remaining work is read from the tree's own records, each
 *  category in ms from the receipts' measured times, a category with no measured cost counted and said so, never guessed. Its antimatter
 *  schedules the remaining work into the idle capacity, cheapest first, until the capacity is used or the queue is empty, which lowers the price to
 *  what is left beyond the capacity (textbook_idle_scheduled_clears). Pure. */
export const idlePriceOf = (idleMs: number, remaining: RemainingWork) => {
  const measured = remaining.filter((r) => r.ms !== null), remainingMs = measured.reduce((n, r) => n + r.ms!, 0)
  const price = Math.min(Math.max(0, idleMs), remainingMs)
  let left = Math.max(0, idleMs); const scheduled: { category: string; ms: number }[] = []
  for (const r of [...measured].sort((a, b) => a.ms! - b.ms!)) { if (left <= 0) break; const take = Math.min(left, r.ms!); scheduled.push({ category: r.category, ms: take }); left -= take }
  const after = Math.max(0, remainingMs - Math.max(0, idleMs))
  return { idleMs, remainingMs, byCategory: remaining, unmeasured: remaining.filter((r) => r.ms === null).map((r) => r.category), price, scheduled, scheduledMs: scheduled.reduce((n, x) => n + x.ms, 0), priceAfterScheduling: Math.min(Math.max(0, idleMs - (remainingMs - after)), after), remainingAfter: after, theorems: ['textbook_idle_priced_by_remaining', 'textbook_idle_scheduled_clears'], says: `${idleMs} ms of idle capacity against ${remainingMs} ms of measured remaining work: idle priced at ${price} ms; scheduled cheapest first, ${after} ms would remain` }
}
export const capacityOf = (c: CapacityInput) => {
  const measure = (unit: string, rows: { name: string; capacity: number; used: number }[]) => { const capacity = rows.reduce((n, r) => n + r.capacity, 0), used = rows.reduce((n, r) => n + Math.min(r.used, r.capacity), 0), idle = capacity - used; return { unit, capacity, used, idle, percentIdle: capacity ? Math.floor((idle * 100) / capacity) : 0, idleNames: rows.filter((r) => r.used < r.capacity).map((r) => r.name), conserved: used + idle === capacity } }
  const doors = c.doors ? measure('schema bytes', c.doors.map((d) => ({ name: d.name, capacity: d.bytes, used: d.reached ? d.bytes : 0 }))) : null
  const theorems = c.theorems ? measure('statement bytes', c.theorems.map((t) => ({ name: t.key, capacity: t.bytes, used: t.used ? t.bytes : 0 }))) : null
  const gates = c.gates ? measure('calls', c.gates.map((g) => ({ name: g.name, capacity: 1, used: g.called ? 1 : 0 }))) : null
  const cores = c.cores ? measure('core ms', c.cores.map((x) => ({ name: x.step, capacity: x.wallMs * x.cores, used: x.cpuMs }))) : null
  const qubits = c.qubits ? { ...measure('qubits per call', c.qubits.calls.map((q) => ({ name: q.door, capacity: c.qubits!.bound, used: q.used }))), bound: c.qubits.bound, neverPastTwo: [...new Set(c.qubits.calls.map((q) => q.door))].filter((d) => c.qubits!.calls.filter((q) => q.door === d).every((q) => q.used <= 2)) } : null
  // Shor's N: the odd composites up to the bound (what the algorithm factors), each asked or not
  const shorNs = c.shor ? Array.from({ length: c.shor.bound + 1 }, (_, n) => n).filter((n) => n > 3 && n % 2 === 1 && Array.from({ length: n }, (_, d) => d).some((d) => d > 1 && d < n && n % d === 0)) : []
  const shor = c.shor ? { ...measure('N values', shorNs.map((n) => ({ name: `N=${n}`, capacity: 1, used: c.shor!.asked.includes(n) ? 1 : 0 }))), bound: c.shor.bound, never: shorNs.filter((n) => !c.shor!.asked.includes(n)) } : null
  const measures = { doors, theorems, gates, cores, qubits, shor }
  const gaps = Object.entries(measures).flatMap(([m, r]) => (r ? r.idleNames.map((name) => ({ measure: m, name })) : []))
  const per = (m: string, name: string) => { if (m === 'doors') return Math.ceil((c.doors!.find((d) => d.name === name)?.bytes ?? 0) / 4); if (m === 'theorems') return Math.ceil((c.theorems!.find((t) => t.key === name)?.bytes ?? 0) / 4); if (m === 'cores') { const x = c.cores!.find((y) => y.step === name)!; return x.wallMs * x.cores - Math.min(x.cpuMs, x.wallMs * x.cores) } if (m === 'qubits') return c.qubits!.calls.filter((q) => q.door === name).reduce((n, q) => n + Math.max(0, c.qubits!.bound - q.used), 0); return 1 }
  const priced = gaps.map((g) => ({ ...g, kind: 'idle' as const, blocks: false, tokens: per(g.measure, g.name), unit: measures[g.measure as keyof typeof measures]!.unit, antimatter: antimatterOf('idle', 'idle', { measure: g.measure === 'doors' ? 'door' : g.measure === 'theorems' ? 'theorem' : g.measure === 'gates' ? 'gate' : g.measure, name: g.name }) })).sort((a, b) => b.tokens - a.tokens)
  const idleMs = cores ? cores.idle : 0
  return { ...measures, idlePrice: c.remaining ? idlePriceOf(idleMs, c.remaining) : null, advantage: { measured: null, says: 'the measured advantage of each served quantum door is the hosted door\'s (get_quantum_advantage): unmeasured here' }, clusters: c.clusters ? { ...c.clusters, unsharded: Math.max(0, c.clusters.named - c.clusters.sharded), priced: false } : null, gaps: priced, top: priced.slice(0, 10), conserved: Object.values(measures).every((r) => !r || r.conserved), theorem: 'textbook_capacity_conserved', says: `${priced.length} idle item(s) across ${Object.values(measures).filter(Boolean).length} measure(s), each priced in its own unit, listed and never blocking; the bounds are the simulator's stated constants, never a hardware claim` }
}
/** A coin or coil line is balanced when it debits one account and credits another of the same value: never a line to itself, never one side. */
export const lineBalanced = (l: { debit?: string; credit?: string; amount?: number; count?: number } | null | undefined) => !!l && !!l.debit && !!l.credit && l.debit !== l.credit && (l.amount ?? 0) >= 0 && (l.count ?? 0) >= 0
/** Coins against coils, the balance named the fusion reactor — only a name for the ledger's balance, no physics claim. Coins are work booked at
 *  zero price (a penalty's count, its reversal at annihilation); coils are paid use, at their price. Every line books one debit and one credit of
 *  the same value, so per tenant and per run the debits equal the credits and the net is zero (textbook_coins_coils_balanced). */
export const reactorOf = (bodies: readonly GapBody[]) => {
  const tenants = new Map<string, { coins: number; coils: number; debits: number; credits: number }>()
  // each side booked from its own account: a line with no debit account, no credit account or one account on both sides books one side only, and the run is unbalanced
  const book = (tenant: string, l: Line, side: 'coins' | 'coils') => { const v = side === 'coins' ? (l.count ?? 0) : l.amount, t = tenants.get(tenant) ?? { coins: 0, coils: 0, debits: 0, credits: 0 }, ok = !!l.debit && !!l.credit && l.debit !== l.credit; tenants.set(tenant, { coins: t.coins + (side === 'coins' ? v : 0), coils: t.coils + (side === 'coils' ? v : 0), debits: t.debits + (l.debit ? v : 0), credits: t.credits + (ok ? v : 0) }) }
  for (const b of bodies) { const tenant = b.tenant ?? 'qpu'; if (b.coin) book(tenant, b.coin, 'coins'); if (b.reversal) book(tenant, b.reversal, 'coins'); if (b.coil) book(tenant, b.coil, 'coils') }
  const byTenant = [...tenants].map(([tenant, t]) => ({ tenant, ...t, net: t.debits - t.credits }))
  const sum = (k: 'coins' | 'coils' | 'debits' | 'credits') => byTenant.reduce((n, t) => n + t[k], 0)
  const net = sum('debits') - sum('credits')
  const burned = bodies.reduce((n, b) => n + (b.coin?.credit === 'burn' ? (b.coin.count ?? 0) : 0), 0)
  const burnedByTenant = Object.fromEntries([...new Set(bodies.map((b) => b.tenant ?? 'qpu'))].map((t) => [t, bodies.filter((b) => (b.tenant ?? 'qpu') === t && b.coin?.credit === 'burn').reduce((n, b) => n + (b.coin!.count ?? 0), 0)]))
  return { burned, burnedByTenant, coins: sum('coins'), coils: sum('coils'), debits: sum('debits'), credits: sum('credits'), net, byTenant, balanced: net === 0 && byTenant.every((t) => t.net === 0), name: 'fusion reactor', says: `coins ${sum('coins')} and coils ${sum('coils')} booked in double entry, net ${net}: “fusion reactor” names this balance only, the tree makes no physics claim`, theorem: 'textbook_coins_coils_balanced' }
}
/** What the penalties taught, in the docket's order: every cleared gap's signature (its rule) is a learned correction; a gap raised again with a
 *  signature already learned is a recurrence (the target is zero); a body marked prevented is a violation the learned correction annihilated
 *  before it was decided, no penalty raised (textbook_penalty_learned_prevents). */
export const learningOf = (bodies: readonly GapBody[]) => {
  const learned = new Set<string>(); let recurrences = 0, prevented = 0
  for (const b of bodies) { const sig = b.rule ?? ''; if (b.prevented) { prevented++; continue } if (b.cleared) { const l = (b as { learned?: { needs?: string }; antimatter?: { learn?: boolean } }); if (l.learned?.needs === 'auto' && !l.antimatter?.learn) learned.add(sig); continue } if (learned.has(sig)) recurrences++ }
  return { learned: [...learned], remedies: learned.size, prevented, recurrences, target: 0, says: `${learned.size} correction(s) learned from cleared gaps, ${prevented} violation(s) corrected before they were decided, ${recurrences} recurrence(s) after learning (target 0)`, theorem: 'textbook_penalty_learned_prevents' }
}
/** The penalties counted from their entries: each gap keyed by its evidence's key (else its sealed address), a clearing closing the penalty of the
 *  same key; what is open is what was opened and not cleared (textbook_penalty_conserved). First, the antimatter of every open gap (its own, or
 *  generated from its evidence), with how many gaps have one, annihilated by themselves, wait on a confirmation, or have none yet (each a lead);
 *  then the time and heat coins per step, the slowest first. */
export const penaltyCountsOf = (entries: readonly { body?: GapBody }[]) => {
  const keyOf = (b: GapBody) => b.snapshot?.key ?? b.seal?.address ?? ''
  const opened = new Set<string>(), cleared = new Set<string>(), bodyOf = new Map<string, GapBody>()
  const steps = new Map<string, { step: string; runs: number; wallMs: number; cpuMs: number; coins: number }>()
  for (const e of entries) {
    const b = e.body; if (!b || b.prevented) continue // a prevented violation was corrected before it was decided: never a gap
    ;(b.cleared ? cleared : opened).add(keyOf(b)); if (!b.cleared) bodyOf.set(keyOf(b), b)
    const pr = b.snapshot?.price; if (!b.cleared && pr) { const s = String(b.subject ?? keyOf(b)), t = steps.get(s) ?? { step: s, runs: 0, wallMs: 0, cpuMs: 0, coins: 0 }; steps.set(s, { step: s, runs: t.runs + 1, wallMs: t.wallMs + pr.wallMs, cpuMs: t.cpuMs + pr.cpuMs, coins: t.coins + pr.coins }) }
  }
  const kindOf = (k: string) => gapKindOf(bodyOf.get(k)?.rule ?? '', bodyOf.get(k)?.kind)
  const antimatterAt = (k: string) => { const b = bodyOf.get(k); return b?.antimatter !== undefined ? b.antimatter : antimatterOf(kindOf(k), b?.rule ?? '', { ...(b?.snapshot ?? {}) }) }
  const closed = [...cleared].filter((k) => opened.has(k))
  const open = [...opened].filter((k) => !cleared.has(k))
  // lex mitior: a gap blocks only when it blocked when raised and its kind blocks now, so lightening a kind applies at once and making it heavier never reaches back
  const blocking = open.filter((k) => GAP_KINDS[kindOf(k)] && bodyOf.get(k)?.blocks !== false)
  const byKind = open.reduce<Record<string, number>>((a, k) => ({ ...a, [kindOf(k)]: (a[kindOf(k)] ?? 0) + 1 }), {})
  const antimatter = open.map((k) => ({ key: k, kind: kindOf(k), antimatter: antimatterAt(k) }))
  const none = antimatter.filter((a) => !a.antimatter || a.antimatter.learn).map((a) => a.key)
  return {
    antimatter, antimatterCounts: { generated: antimatter.length - none.length, autoAnnihilated: closed.filter((k) => antimatterAt(k)?.needs === 'auto').length, confirm: antimatter.filter((a) => a.antimatter?.needs === 'confirm').length, none: none.length, noneKeys: none },
    opened: opened.size, cleared: closed.length, open: open.length, openKeys: open, blocking: blocking.length, blockingKeys: blocking, byKind,
    learning: learningOf(entries.map((e) => e.body).filter((b): b is GapBody => !!b)),
    correlation: open.reduce<Record<string, number>>((a, k) => { const r = bodyOf.get(k)?.rule ?? ''; return { ...a, [r]: (a[r] ?? 0) + 1 } }, {}),
    timeHeat: [...steps.values()].sort((a, b) => b.coins - a.coins), reactor: reactorOf(entries.map((e) => e.body).filter((b): b is GapBody => !!b)), conserved: closed.length + open.length === opened.size, theorem: 'textbook_penalty_conserved',
  }
}
export const ledgerOf = (calls: readonly { tool: string; tenant: string; arguments?: Record<string, unknown> }[], settled: readonly { tenant?: string; amount: number; fee: number; net: number; currency: string }[] = [], currency: 'eur' | 'usd' | 'bgn' = 'eur') => {
  const metered = CATALOGUE.find((v) => v.product === 'qpu-metered')!
  const price = (metered.amounts as Record<string, number>)[currency] ?? 0 // cents per thousand calls = thousandths of a cent per call
  const lines: { debit: string; credit: string; amount: number; why: string }[] = []
  let coins = 0, coils = 0
  for (const c of calls) { const f = fusionOf(c.tool, c.arguments); if (f.side === 'coin') { coins++; lines.push({ debit: 'usage:free', credit: 'usage:free', amount: 0, why: `${c.tool}: a coin, pure algebra, free under attribution` }) } else { coils++; lines.push({ debit: `receivable:${c.tenant}`, credit: 'revenue:author', amount: price, why: `${c.tool}: a coil at the metered price` }) } }
  for (const s of settled.filter((x) => x.currency === currency)) { const t = s.tenant ?? 'unknown'; lines.push({ debit: 'cash:stripe', credit: `receivable:${t}`, amount: s.net * 1000, why: 'settled by Stripe, net' }); lines.push({ debit: 'fees:stripe', credit: `receivable:${t}`, amount: s.fee * 1000, why: "Stripe's fee" }) }
  const debits = lines.reduce((n, l) => n + l.amount, 0), credits = lines.reduce((n, l) => n + l.amount, 0)
  const balances: Record<string, number> = {}; for (const l of lines) { balances[l.debit] = (balances[l.debit] ?? 0) + l.amount; balances[l.credit] = (balances[l.credit] ?? 0) - l.amount }
  const outstanding = Object.entries(balances).filter(([k, v]) => k.startsWith('receivable:') && v > 0).map(([k, v]) => ({ tenant: k.slice('receivable:'.length), millicents: v }))
  return { currency, unit: 'thousandths of a cent', price, coins, coils, lines, debits, credits, balanced: debits === credits, balances, outstanding, reconciled: outstanding.length === 0, says: `${coins} coin(s) free, ${coils} coil(s) at ${price} thousandths of a cent each; debits ${debits} = credits ${credits}; ${outstanding.length ? `outstanding: ${outstanding.map((o) => `${o.tenant} ${o.millicents}`).join(', ')}` : 'every coil settled by Stripe'}`, theorem: 'textbook_double_entry' }
}
/** Work deduplicated as coins: every witness two UUIDs share is work that exists once, booked at zero price as a coin credited to the author —
 *  a count of free work, never money: money moves only when Stripe settles a coil. Each line books the same amount on both sides (textbook_double_entry). */
export const witnessCoinsOf = (shared: readonly string[]) => {
  const lines = shared.map((uuid) => ({ debit: 'work:deduplicated', credit: 'coins:author', amount: 0, count: 1, why: `witness ${uuid} shared: computed once, not twice` }))
  const debits = lines.reduce((n, l) => n + l.amount, 0), credits = lines.reduce((n, l) => n + l.amount, 0)
  return { lines, coins: lines.length, debits, credits, balanced: debits === credits, says: `${lines.length} coin(s) credited to the author for work that exists once; a coin here counts free work, not money: money moves only when Stripe settles a coil`, theorem: 'textbook_double_entry' }
}
/** Recursive licensing: a chain of parties, each holding its licence from the level above as a docket entry and selling sublicences to the
 *  level below through its own Stripe (the ecommerce plugin's order afterChange at that level writes the licence entry linked to the one
 *  above), so verify walks the chain link by link; n sublicences under one licence are n links (textbook_licence_chain). The author's
 *  side is the coins every response deposits and the catalogue price of the licence; each reseller keeps its margin (marginsOf). */
export const recursiveLicenceOf = (parties: readonly string[]) => {
  const levels = parties.map((party, level) => ({
    level, party,
    holds: level === 0 ? 'the work itself (CC-BY-NC-ND-4.0; the a432 harmonic default free under attribution)' : `the licence entry granted by ${parties[level - 1]} (kind licence, links: [the entry above])`,
    sells: level === parties.length - 1 ? null : `sublicences to ${parties[level + 1]}: an order at this level's Stripe, the licence the completed order itself`,
    stripe: level === parties.length - 1 ? null : { keys: [`STRIPE_SECRET_KEY_${party.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`, `STRIPE_WEBHOOK_SECRET_${party.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`], hook: 'orders afterChange (the ecommerce plugin): status completed → a licence entry in the docket, links: [the licence this level holds], so the chain is one walk of links', gdprKyc: 'Stripe\'s responsibility at every level' },
    keeps: level === 0 ? 'the coins of every response and the catalogue price of each licence' : level === parties.length - 1 ? 'the use' : 'the margin between the price it pays above and the price it sells below (marginsOf)',
  }))
  return { parties: parties.length, links: parties.length - 1, theorem: 'textbook_licence_chain', levels, verify: 'verify { uuid, prev, next } on each licence entry: prev is the licence above, next a sublicence below; a broken link ends the chain there', says: `${parties.length - 1} sublicence(s) under one licence are ${parties.length - 1} links, each a Stripe hook at the reseller's own keys, the author paid at the root` }
}
/** The Stripe resources the MCP's combinations already use, by the stripe tool's ops and the ecommerce plugin's collections: the side of the comparison the tree holds. */
export const MCP_STRIPE_RESOURCES: Readonly<Record<string, readonly string[]>> = { checkout: ['plan', 'webhook'], products: ['catalogue', 'ecommerce: products'], prices: ['catalogue', 'ecommerce: variants'], events: ['webhook'], webhook_endpoints: ['webhook'], customers: ['state', 'ecommerce: customers'], subscriptions: ['state'], invoices: ['usage'], billing: ['usage', 'settle'], balance: ['settle'], payouts: ['settle'], payment_intents: ['ecommerce: transactions'], refunds: ['ecommerce: transactions'] }
/** Every use case of the Stripe API, read from its own contract (the paths of its OpenAPI specification, discovered each run), grouped by resource and
 *  compared automatically to the MCP's combinations: every resource the MCP does not combine is a lead to explore and to config (the difference door,
 *  textbook_difference_leads); nothing enumerated by hand. */
export const stripeUseCasesOf = (paths: readonly string[]) => {
  const resourceOf = (p: string) => p.replace(/^\/v1\//, '').split('/')[0] ?? ''
  const byResource: Record<string, string[]> = {}
  for (const p of paths) { const r = resourceOf(p); if (r) (byResource[r] ??= []).push(p) }
  const resources = Object.keys(byResource).sort()
  const diff = differencesOf({ name: 'stripe-api-use-cases', members: resources }, { name: 'mcp-stripe-combinations', members: Object.keys(MCP_STRIPE_RESOURCES) }, { config: 'ecommerce' })
  const covered = resources.filter((r) => r in MCP_STRIPE_RESOURCES)
  return { op: 'usecases' as const, paths: paths.length, resources: resources.length, byResource: Object.fromEntries(resources.map((r) => [r, byResource[r]!.length])), covered: covered.map((r) => ({ resource: r, by: MCP_STRIPE_RESOURCES[r] })), uncovered: resources.filter((r) => !(r in MCP_STRIPE_RESOURCES)), beyond: Object.keys(MCP_STRIPE_RESOURCES).filter((r) => !resources.includes(r)), difference: diff, leads: diff.leads, says: `${resources.length} Stripe resources read from its contract, ${covered.length} combined by the MCP, ${resources.length - covered.length} not yet: each a lead to explore and to config, automatically; identity and tax among them are Stripe\'s doors a tenant opens, never the tree\'s` }
}
/** The margins of the catalogue at best: every variant's price against the provider's cost per unit when the client passes it (read from the provider's
 *  pricing page by the verifier: Durable Objects rows written for a reading, requests for a call, the gate's copies for delivered computing); without
 *  a cost the margin is a lead, never a number asserted (textbook_margin_makes_price). */
export const marginsOf = (costs: Readonly<Record<string, number>> = {}, currency = 'eur') => Object.fromEntries(CATALOGUE.map((v) => { const price = v.amounts[currency.toLowerCase()] ?? v.amounts.eur ?? 0; const cost = costs[v.product] ?? costs[`${v.product}/${v.variant}`] ?? null; return [`${v.product}/${v.variant}`, { price, unit: v.unit, cost, margin: cost == null ? null : price > 0 ? Number(((price - cost) / price).toFixed(3)) : null, basis: cost == null ? (price === 0 ? 'free: the a432 default, no margin and no cost' : 'the provider\'s cost per unit read from its pricing page by the verifier: a lead until read') : 'margin = (price − cost) / price; the price and the cost in the same minor units per unit' }] }))
export const usageOrderOf = (calls: number, currency = 'eur', energy?: { kWh: number; tariffEurPerKwh: number | null }, split?: { free: number; coils: number; commercial?: boolean; delivered?: number; readings?: number }) => {
  const v = CATALOGUE.find((c) => c.product === 'qpu-metered' && c.variant === 'per-thousand-calls')!
  const a432 = CATALOGUE.find((c) => c.product === 'qpu-a432')!
  // the licence decides automatically: only the pure algebraic formulas are free (the a432 harmonic default under attribution: ALGEBRA_TOOLS); every other call is covered by the licence — a coil billed by the coins under a commercial licence, 0 coins under the non-commercial term — whether or not an involution answered it
  const free = split?.free ?? 0, coils = split?.coils ?? Math.max(0, calls), commercial = split?.commercial === true
  const quantity = Math.ceil(Math.max(0, coils) / 1000)
  const unitAmount = commercial ? (v.amounts[currency.toLowerCase()] ?? v.amounts.eur ?? 0) : 0
  const amount = quantity * unitAmount
  const items = [{ product: a432.product, variant: a432.variant, quantity: free, unitAmount: 0, amount: 0, unit: 'call', interval: a432.interval, basis: 'free: the pure algebraic formulas (css, fold, verify, clay) — the a432 harmonic default under attribution' }, { product: v.product, variant: v.variant, quantity, unitAmount, amount, unit: v.unit, interval: v.interval, basis: commercial ? 'coils: every call beyond the pure algebra, covered by the licence and billed by the coins under the commercial licence' : 'coils: every call beyond the pure algebra, covered by the licence; 0 coins under its non-commercial term, the count kept for the record' }]
  // delivered production quantum computing and IoT readings as metered lines when the run measured them: the copies the gate proved, the readings written
  const delivered = CATALOGUE.find((c) => c.product === 'qpu-delivered')!, iot = CATALOGUE.find((c) => c.product === 'qpu-iot')!
  if (split?.delivered) { const q = Math.ceil(split.delivered / 1000); const u = commercial ? (delivered.amounts[currency.toLowerCase()] ?? delivered.amounts.eur ?? 0) : 0; items.push({ product: delivered.product, variant: delivered.variant, quantity: q, unitAmount: u, amount: q * u, unit: delivered.unit, interval: delivered.interval, basis: 'production quantum computing delivered: the copies the gate proved on the hosts, the subscription\'s measure' }) }
  if (split?.readings) { const q = Math.ceil(split.readings / 1_000_000); const u = commercial ? (iot.amounts[currency.toLowerCase()] ?? iot.amounts.eur ?? 0) : 0; items.push({ product: iot.product, variant: iot.variant, quantity: q, unitAmount: u, amount: q * u, unit: iot.unit, interval: iot.interval, basis: 'IoT readings written as docket entries, per million' }) }
  const total = items.reduce((n, i) => n + i.amount, 0)
  return { collection: 'orders', items, currency: currency.toUpperCase(), amount: total, minorUnits: true, status: 'pending', licence: { perspective: 'CC BY-NC-ND 4.0: non-commercial use free under attribution; commercial use of the QPU framework by licence (the coins)', free, coils, commercial, decides: 'automatically: free is the pure algebra alone (ALGEBRA_TOOLS), coils every other call, involution or not; the commercial flag is the tenant\'s licence order', algebra: ALGEBRA_TOOLS, compliance: { licensing: 'all non-harmonic use is licensed over MCP by billable automation: the licence is a completed order of the ecommerce plugin, the coins its measure', gdpr: 'the customer\'s identity and payment data stay at Stripe (Checkout, the customer object) under Stripe\'s DPA; the tree keeps the order, the tenant and the domains, never a name, an address or a card', kyc: 'Stripe\'s: the account verification and the identity checks are the payment provider\'s; the tree never verifies an identity' } }, energyLine: energy ? { kWh: energy.kWh, tariffEurPerKwh: energy.tariffEurPerKwh, costEur: energy.tariffEurPerKwh != null ? energy.kWh * energy.tariffEurPerKwh : null, says: 'informational: the joules the computations moved at the tariff the tenant names, not a catalogue price' } : null, transactions: 'the ecommerce plugin\'s transactions collection: one per payment, the ledger', checkout: '/checkout: the plugin\'s own, the Stripe adapter the payment', says: `${calls} calls billed as ${quantity} × ${v.product}/${v.variant} at ${unitAmount} ${currency.toUpperCase()} minor units: an order of the ecommerce plugin, nothing custom` }
}
export const TENANT_CURRENCY: Readonly<Record<string, string>> = { uuidna: 'EUR', psg: 'EUR', ceci: 'EUR', local: 'EUR' }
/** The related MCPs the registry names for currency (2026-10-26, remotes marked by the discover step; proposed, never called from here). */
export const CURRENCY_MCPS = ['com.datakoot/fx-currency-exchange-rates', 'com.invokera/currency-rates', 'io.github.FoundryNet/currency-intel-mcp', 'io.github.OlsOls4/currencykit', 'cn.pianam.mcp/exchange-rate-mcp', 'dev.workers.bhazarstudio.datoqa/historical-exchange-rates', 'io.github.hatgit/forex-gpt-mcp', 'io.github.Exchange-RateAPI/mcp-server', 'io.github.cyanheads/exchange-rates-mcp-server'] as const
export type RateTable = { source: string; date: string | null; base: 'EUR'; rates: Record<string, number> }
/** A source's text read into a rate table: XML of the ECB or the BNB, JSON of the others; what cannot be read is said. */
export const ratesOf = (source: string, text: string): RateTable | { source: string; error: string } => {
  const src = RATE_SOURCES.find((r) => r.id === source)
  if (!src) return { source, error: `no rate source ${source}; the sources are ${RATE_SOURCES.map((r) => r.id).join(', ')}` }
  try {
    if (src.format === 'xml-ecb') { const date = /time='(\d{4}-\d{2}-\d{2})'/.exec(text)?.[1] ?? null; const rates: Record<string, number> = {}; for (const m of text.matchAll(/currency='([A-Z]{3})'\s+rate='([\d.]+)'/g)) rates[m[1]!] = Number(m[2]); if (!Object.keys(rates).length) throw new Error('no rates in the ECB XML'); return { source, date, base: 'EUR', rates } }
    if (src.format === 'xml-bnb') { const date = /<CURR_DATE>(\d{2})\.(\d{2})\.(\d{4})<\/CURR_DATE>/.exec(text); const rates: Record<string, number> = {}; for (const m of text.matchAll(/<CODE>([A-Z]{3})<\/CODE>[\s\S]*?<RATE>([\d.]+)<\/RATE>/g)) rates[m[1]!] = Number(m[2]); if (!Object.keys(rates).length) throw new Error('no rates in the BNB XML'); return { source, date: date ? `${date[3]}-${date[2]}-${date[1]}` : null, base: 'EUR', rates } }
    const j = JSON.parse(text) as Record<string, unknown>
    if (src.format === 'json-frankfurter' || src.format === 'json-er-api') return { source, date: String(j.date ?? (j.time_last_update_utc ? new Date(String(j.time_last_update_utc)).toISOString().slice(0, 10) : '')) || null, base: 'EUR', rates: Object.fromEntries(Object.entries((j.rates ?? {}) as Record<string, number>).map(([k, v]) => [k.toUpperCase(), Number(v)])) }
    return { source, date: String(j.date ?? '') || null, base: 'EUR', rates: Object.fromEntries(Object.entries((j.eur ?? {}) as Record<string, number>).filter(([k]) => /^[a-z]{3}$/.test(k)).map(([k, v]) => [k.toUpperCase(), Number(v)])) }
  } catch (e) { return { source, error: (e as Error).message } }
}
const median = (xs: number[]): number => { const s = [...xs].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2 }
/** The harmonised rate per currency: the median of every source that names it (a repetition code: agree within 0.5 %, else the sources that differ are named), pegs fixed by law, each rate with its sources and spread. */
export const harmoniseOf = (tables: readonly RateTable[], symbols: readonly string[]): Record<string, { rate: number; sources: string[]; spread: number; outcome: 'agree' | 'drift' | 'peg' | 'erased'; drifting: string[]; dates: string[] }> => {
  const out: Record<string, { rate: number; sources: string[]; spread: number; outcome: 'agree' | 'drift' | 'peg' | 'erased'; drifting: string[]; dates: string[] }> = {}
  for (const sym of symbols.map((x) => x.toUpperCase())) {
    if (sym === 'EUR') { out[sym] = { rate: 1, sources: ['base'], spread: 0, outcome: 'agree', drifting: [], dates: [] }; continue }
    if (PEGS[sym]) { out[sym] = { rate: PEGS[sym]!.perEur, sources: ['law'], spread: 0, outcome: 'peg', drifting: tables.filter((t) => t.rates[sym] !== undefined && Math.abs(t.rates[sym]! - PEGS[sym]!.perEur) / PEGS[sym]!.perEur > 0.0001).map((t) => t.source), dates: [PEGS[sym]!.since] }; continue }
    const named = tables.filter((t) => typeof t.rates[sym] === 'number' && t.rates[sym]! > 0)
    if (!named.length) { out[sym] = { rate: 0, sources: [], spread: 0, outcome: 'erased', drifting: [], dates: [] }; continue }
    const rate = median(named.map((t) => t.rates[sym]!))
    const spread = Math.max(...named.map((t) => Math.abs(t.rates[sym]! - rate) / rate))
    out[sym] = { rate, sources: named.map((t) => t.source), spread, outcome: spread <= 0.005 ? 'agree' : 'drift', drifting: named.filter((t) => Math.abs(t.rates[sym]! - rate) / rate > 0.005).map((t) => t.source), dates: [...new Set(named.map((t) => t.date).filter(Boolean))] as string[] }
  }
  return out
}
/** Amounts in the base currency's minor unit harmonised into every currency, rounded to the minor unit; the currency of a tenant and of a domain named. */
export const amountsOf = (amount: number, rates: Record<string, { rate: number }>, decimals = 2): Record<string, number> => Object.fromEntries(Object.entries(rates).filter(([, r]) => r.rate > 0).map(([sym, r]) => [sym.toLowerCase(), Math.round(amount * r.rate * 10 ** decimals) / 10 ** decimals]))

const currency = toolOf('billing', {
  name: 'currency',
  description: 'Currency harmonised in real time across every computation, agnostic of the source: plan answers the requests to every free rate API found (ECB, Frankfurter, BNB, open.er-api, currency-api) and names the related MCPs the registry lists; harmonise reads the bodies a client fetched, decodes one rate per currency by the median of the sources (agree within 0.5 %, drift named, pegs fixed by law: BGN 1.95583 since Bulgaria adopted the euro), and converts amounts in the base currency\'s minor unit into every currency, for a tenant (its currency) and a domain (its top-level domain\'s). Pure: nothing fetched here.',
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: ['plan', 'harmonise'] }, answers: { type: 'array', items: { type: 'object', properties: { source: { type: 'string' }, text: { type: 'string' } } }, description: 'the bodies of the sources, fetched by the client' }, symbols: { type: 'array', items: { type: 'string' } }, amounts: { type: 'object', description: 'name → amount in the base currency\'s minor unit (cents)' }, tenant: { type: 'string' }, domain: { type: 'string' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...BILLING.skill.selftest(ctx) }
    const op = String(args.op ?? 'plan')
    if (op === 'plan') return { op, sources: RATE_SOURCES, requests: RATE_SOURCES.map((r) => ({ id: `currency:${r.id}`, source: r.id, method: 'GET' as const, url: r.url, accept: r.format.startsWith('xml') ? '*/*' : 'application/json' })) /* the BNB's gateway refuses an accept of text/xml (measured 2026-10-26): any accept, the XML comes */, pegs: PEGS, relatedMcps: CURRENCY_MCPS, realtime: 'reference rates are daily: the day is the real time of a reference rate; an intraday rate is a paid provider\'s door (a related MCP), the operator\'s act' }
    if (op !== 'harmonise') throw new Error(`op ${op} is not plan or harmonise`)
    const answers = (Array.isArray(args.answers) ? args.answers : []) as { source: string; text: string }[]
    const read = answers.map((a) => ratesOf(String(a.source), String(a.text ?? '')))
    const tables = read.filter((r): r is RateTable => 'rates' in r)
    const errors = read.filter((r): r is { source: string; error: string } => 'error' in r)
    const symbols = (Array.isArray(args.symbols) && args.symbols.length ? args.symbols.map(String) : ['EUR', 'USD', 'BGN', 'GBP', 'CHF'])
    const rates = harmoniseOf(tables, symbols)
    const tenant = String(args.tenant ?? 'local'); const domain = typeof args.domain === 'string' ? args.domain : null
    const tld = domain ? domain.split('.').pop()!.toLowerCase() : null
    const amounts = args.amounts && typeof args.amounts === 'object' ? Object.fromEntries(Object.entries(args.amounts as Record<string, number>).map(([k, v]) => [k, amountsOf(Number(v), rates)])) : {}
    const outcomes = Object.values(rates).reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.outcome]: (acc[r.outcome] ?? 0) + 1 }), {})
    return { op, base: 'EUR', sources: tables.map((t) => ({ source: t.source, date: t.date, currencies: Object.keys(t.rates).length })), errors, rates, outcomes, tenant: { tenant, currency: TENANT_CURRENCY[tenant] ?? 'EUR' }, domain: domain ? { domain, tld, currency: (tld && DOMAIN_CURRENCY[tld]) ?? 'EUR' } : null, amounts, says: `${tables.length} source(s) read${errors.length ? `, ${errors.length} unreadable` : ''}; ${Object.entries(outcomes).map(([k, v]) => `${v} ${k}`).join(', ')} of ${symbols.length} currencies` }
  },
  widget: flowWidget,
})
const ECB_FIXTURE = `<?xml version="1.0" encoding="UTF-8"?><gesmes:Envelope><Cube><Cube time='2026-10-23'><Cube currency='USD' rate='1.1193'/><Cube currency='GBP' rate='0.83728'/><Cube currency='CHF' rate='0.9227'/></Cube></Cube></gesmes:Envelope>`
const ERAPI_FIXTURE = JSON.stringify({ result: 'success', time_last_update_utc: 'Sun, 25 Oct 2026 00:02:31 +0000', base_code: 'EUR', rates: { USD: 1.120288, BGN: 1.95583, GBP: 0.8381, CHF: 0.9231 } })
const FRANKFURTER_FIXTURE = JSON.stringify({ amount: 1, base: 'EUR', date: '2026-10-23', rates: { GBP: 0.83728, USD: 1.1193 } })

export const BILLING: Toolbox = {
  name: 'billing',
  idea: 'Stripe per tenant: a licence bought at one tenant is an entry valid on the domains it names, every event idempotent and linked, every signature verified with the tenant\'s own secret, every refusal a lead',
  tools: [stripe, currency],
  examples: [
    { id: 'currency-plan', tool: 'currency', arguments: { op: 'plan' }, shows: 'Every free currency rate API found, as the requests a client sends (ECB, Frankfurter, BNB, open.er-api, currency-api), the pegs fixed by law and the related MCPs the registry names.', expect: (s) => (s.requests.length === 5 && s.pegs.BGN.perEur === 1.95583 && s.relatedMcps.length === 9 ? null : JSON.stringify(s.requests)) },
    { id: 'currency-harmonise', tool: 'currency', theorem: 'textbook_peg_is_fixed', arguments: { op: 'harmonise', answers: [{ source: 'ecb', text: ECB_FIXTURE }, { source: 'er-api', text: ERAPI_FIXTURE }, { source: 'frankfurter', text: FRANKFURTER_FIXTURE }], symbols: ['EUR', 'USD', 'BGN', 'GBP'], amounts: { 'qpu-domain-yearly': 43200 }, tenant: 'psg', domain: 'qpu.psg.bg' }, shows: 'Three sources read into one rate per currency by the median (USD agreeing within 0.5 %, BGN pegged by law), a yearly licence of 432.00 € harmonised into every currency, the tenant psg pricing in euro, the domain .bg in euro since 2026.', expect: (s) => (s.rates.USD.outcome === 'agree' && s.rates.USD.rate === 1.1193 && s.rates.BGN.outcome === 'peg' && s.amounts['qpu-domain-yearly'].bgn === 84491.86 && s.domain.currency === 'EUR' ? null : JSON.stringify(s.rates)) },
    { id: 'stripe-fusion', tool: 'stripe', theorem: 'textbook_double_torus', arguments: { op: 'fusion', tools: ['css', 'fold', 'verify', 'clay', 'processor', 'payload', 'seal', 'currency'] }, shows: 'Licensing by architecture: the quantum core computes on the classical world only through the fusion of coins into coils, and back the same way: the pure algebra stays a coin (free under attribution, the a432 default), every call that reaches classical data or services is a coil covered by the licence; every result carries its side, and the Worker refuses a declared commercial coil without a licence with the case the court computes; the two directions are the two loops of the double torus.', expect: (s) => (s.coins === 4 && s.coils === 4 && s.tools.every((r: { side: string; tool: string }) => (r.side === 'coin') === ['css', 'fold', 'verify', 'clay'].includes(r.tool)) && s.theorems.includes('textbook_double_torus') ? null : JSON.stringify(s.tools.map((r: { tool: string; side: string }) => r.tool + ':' + r.side))) },
    { id: 'stripe-plan', tool: 'stripe', arguments: { op: 'plan', tenant: 'psg', host: 'qpu.psg.bg', checkout: { subject: 'acme', domains: ['qpu.psg.bg', 'qpu.uuidna.com'], mode: 'subscription', amount: 43200, currency: 'eur', successUrl: 'https://qpu.psg.bg/licence?ok', cancelUrl: 'https://qpu.psg.bg/licence?cancel' } }, shows: 'A checkout plan for a yearly commercial licence of acme on two domains, bought at tenant psg: the form Stripe takes, the metadata the webhook brings back, the tenant secret the Worker alone holds.', expect: (s) => (s.secret === 'STRIPE_SECRET_KEY_PSG' && s.plan.form['metadata[domains]'] === 'qpu.psg.bg,qpu.uuidna.com' && s.plan.form['line_items[0][price_data][recurring][interval]'] === 'year' ? null : JSON.stringify(s.plan?.form).slice(0, 160)) },
    { id: 'stripe-margins', tool: 'stripe', theorem: 'textbook_margin_makes_price', arguments: { op: 'catalogue', costs: { 'qpu-iot': 92, 'qpu-metered': 10, 'qpu-delivered': 30 } }, shows: 'The margins of the catalogue at best: IoT readings, metered calls and delivered production quantum computing priced against the provider\'s cost per unit the verifier read (fixture costs here), the margin a computed ratio; every variant without a cost a lead, never a number asserted.', expect: (s) => (s.margins['qpu-iot/per-million-readings'].margin > 0.9 && s.margins['qpu-metered/per-thousand-calls'].margin > 0.9 && s.margins['qpu-delivered/per-thousand-copies'].margin > 0.9 && s.margins['qpu-domain/yearly'].margin === null && s.margins['qpu-a432/harmonic-default'].cost === null ? null : JSON.stringify(s.margins['qpu-iot/per-million-readings'])) },
    { id: 'stripe-usecases', tool: 'stripe', theorem: 'textbook_difference_leads', arguments: { op: 'usecases', paths: ['/v1/customers', '/v1/customers/{customer}', '/v1/checkout/sessions', '/v1/products', '/v1/prices', '/v1/billing/meters', '/v1/identity/verification_sessions', '/v1/tax/calculations', '/v1/terminal/readers'] }, shows: 'Every use case of the Stripe API read from its own contract (fixture paths here; the discovered specification each run), grouped by resource and compared automatically to the MCP\'s combinations: customers, checkout, products, prices and billing combined; identity, tax and terminal not — each a lead to explore and to config, identity the KYC that stays Stripe\'s.', expect: (s) => (s.resources === 8 && s.covered.length === 5 && s.uncovered.length === 3 && s.uncovered.includes('identity') && s.leads.length === s.uncovered.length + s.beyond.length && s.leads.every((l: { config?: string | null }) => l.config === 'ecommerce') ? null : JSON.stringify({ resources: s.resources, covered: s.covered.length, uncovered: s.uncovered, leads: s.leads.length })) },
    { id: 'stripe-catalogue', tool: 'stripe', theorem: 'textbook_prices_are_variants_times_currencies', arguments: { op: 'catalogue', tenant: 'uuidna', currencies: ['eur', 'usd'] }, shows: 'The QPU as a product line for tenant uuidna: seven variants over five products, each a Stripe price form in two currencies, the a432 default at zero.', expect: (s) => (s.variants === 9 && s.products === 8 && s.prices === 18 && s.catalogue[0].amounts.eur === 0 ? null : `${s.products} products, ${s.prices} prices, ${s.variants} variants`) },
    { id: 'stripe-webhook', tool: 'stripe', arguments: { op: 'webhook', tenant: 'psg', payload: COMPLETED, signature: signatureOf(SECRET, 1_700_000_000, COMPLETED), secret: SECRET, now: 1_700_000_100 }, shows: 'A checkout completed at tenant psg, its signature verified with psg\'s webhook secret, read into one licence entry granting acme on both domains.', expect: (s) => (s.valid === true && s.state === 'granted' && s.duplicate === false && s.entry.body.domains.length === 2 ? null : `${s.valid} ${s.why} ${s.state}`) },
  ],
  skill: {
    instructions: 'Per tenant the author sets two wrangler secrets, STRIPE_SECRET_KEY_<TENANT> and STRIPE_WEBHOOK_SECRET_<TENANT>, and registers https://<host>/docket/stripe as the webhook endpoint at Stripe. A client calls stripe plan and the Worker executes the plan with the tenant key, answering the session url. Stripe posts events to the tenant\'s endpoint; the Worker calls stripe webhook with the raw body, the Stripe-Signature header and the tenant secret, writes the entry it gets to the tenant docket (mirrors carry it to the others), and answers 200 on a duplicate. Any host answers stripe state for a subject at its domain from the entries it holds.',
    directions: ['server only: SHA-256 and HMAC vectors, the signature round trip, every event type to its state, every scenario between tenants', 'client → server: the Worker hands the raw body, the header and the secret; the handler never holds a key', 'toolbox → toolbox: entries are addressed with the tree\'s uuidOf, kept in the raid docket, verified by the tree toolbox\'s verify'],
    selftest: () => {
      const { check, done } = checksOf()
      check('billing:sha256-vector', hex(hmacSha256(utf8('key'), utf8('The quick brown fox jumps over the lazy dog'))) === 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8', 'RFC 2104 / Wikipedia HMAC-SHA256 vector')
      const sig = signatureOf(SECRET, 1_700_000_000, COMPLETED)
      check('billing:signature-valid', verifySignature(SECRET, sig, COMPLETED, 1_700_000_010).valid, 'the tenant\'s own secret verifies')
      check('billing:signature-other-tenant', !verifySignature('whsec_of_tenant_uuidna', sig, COMPLETED, 1_700_000_010).valid, 'another tenant\'s secret does not: the scenario between tenants')
      check('billing:signature-replay', !verifySignature(SECRET, sig, COMPLETED, 1_700_000_000 + 3600).valid && !verifySignature(SECRET, sig, COMPLETED.replace('43200', '1'), 1_700_000_010).valid, 'an old timestamp and an altered body are refused')
      const e1 = entryOf('psg', JSON.parse(COMPLETED))
      const e1again = entryOf('psg', JSON.parse(COMPLETED))
      check('billing:idempotent', e1.id === e1again.id && e1.body.state === 'granted' && e1.links.length === 0, 'the same event gives the same address')
      const renewed = entryOf('psg', JSON.parse(EVENT('evt_2', 'invoice.paid', 1_731_000_000, { customer: 'cus_1', amount_paid: 43200, currency: 'eur', metadata: { subject: 'acme' } })), [e1])
      const refunded = entryOf('uuidna', JSON.parse(EVENT('evt_3', 'charge.refunded', 1_732_000_000, { customer: 'cus_1', amount: 43200, currency: 'eur', metadata: { subject: 'acme' } })), [e1, renewed])
      const disputed = entryOf('psg', JSON.parse(EVENT('evt_4', 'charge.dispute.created', 1_731_500_000, { customer: 'cus_1', metadata: { subject: 'acme' } })), [e1, renewed])
      check('billing:links', renewed.links[0] === e1.id && refunded.links.length === 2 && refunded.body.domains.join() === 'qpu.psg.bg,qpu.uuidna.com', 'a renewal links the grant, a refund links both, the domains carry over from the grant')
      const now = 1_733_000_000
      const at = (entries: LicenceEntry[], domain: string) => stateOf(entries, 'acme', domain, now).state
      check('billing:state-across-domains', at([e1], 'qpu.psg.bg') === 'licensed' && at([e1], 'qpu.uuidna.com') === 'licensed' && at([e1], 'qpu.ceci.workers.dev') === 'unlicensed', 'a licence bought at psg is honoured at uuidna and not at a domain it does not name')
      check('billing:state-scenarios', at([e1, renewed], 'qpu.psg.bg') === 'licensed' && at([e1, renewed, refunded], 'qpu.uuidna.com') === 'unlicensed' && at([e1, renewed, disputed], 'qpu.psg.bg') === 'disputed' && at([], 'qpu.psg.bg') === 'unlicensed', 'renewed stays licensed; a refund at another tenant ends it; a dispute holds it; nothing is nothing')
      const plan = planOf({ tenant: 'uuidna', host: 'qpu.uuidna.com', subject: 'acme', domains: ['*'], mode: 'payment', amount: 43200, currency: 'eur', successUrl: 'https://qpu.uuidna.com/ok', cancelUrl: 'https://qpu.uuidna.com/no' })
      const changed = entryOf('psg', JSON.parse(EVENT('evt_5', 'customer.subscription.updated', 1_731_600_000, { customer: 'cus_1', items: { data: [{ quantity: 3, price: { metadata: { product: 'qpu-seat', variant: 'monthly' } } }] }, metadata: { subject: 'acme' } })), [e1, renewed])
      check('billing:variants', changed.body.state === 'changed' && changed.body.product === 'qpu-seat' && changed.body.quantity === 3 && changed.links.length === 2 && stateOf([e1, renewed, changed], 'acme', 'qpu.psg.bg', now).variant === 'monthly', 'a subscription change keeps the licence and records the new variant and quantity, linked to the grants')
      const cat = catalogueOf('psg', ['eur', 'bgn'])
      check('billing:catalogue', cat.prices.length === 18 && cat.prices.every((p) => p.form['metadata[tenant]'] === 'psg') && cat.prices.some((p) => p.form['recurring[usage_type]'] === 'metered') && CATALOGUE.every((v) => Object.values(v.amounts).every((a) => Number.isInteger(a) && a >= 0)), 'per-tenant catalogue, metered variant, integer minor units')
      const usage = usageOf([{ kind: 'usage', date: '2026-10-10T00:00:00Z', body: { subject: 'acme', calls: 1500 } }, { kind: 'usage', date: '2026-10-20T00:00:00Z', body: { subject: 'acme', calls: 600 } }, { kind: 'usage', date: '2026-11-02T00:00:00Z', body: { subject: 'acme', calls: 999 } }], 'acme', Date.parse('2026-10-01T00:00:00Z') / 1000, Date.parse('2026-11-01T00:00:00Z') / 1000)
      check('billing:usage', usage.calls === 2100 && usage.thousands === 3 && usage.form.quantity === '3', 'calls in the period summed from usage entries, rounded up to thousands')
      const settle = settlementOf([{ id: 'txn_1', amount: 43200, fee: 1278, net: 41922, currency: 'eur', product: 'qpu-domain', tenant: 'psg' }, { id: 'txn_2', amount: 2700, fee: 103, net: 2597, currency: 'eur', product: 'qpu-seat', tenant: 'uuidna' }, { id: 'txn_3', amount: 47500, fee: 1400, net: 46100, currency: 'usd', product: 'qpu-domain', tenant: 'psg' }])
      check('billing:settlement', settle.net.eur === 44519 && settle.net.usd === 46100 && settle.byProduct['qpu-domain:eur'] === 41922 && settle.byTenant['uuidna:eur'] === 2597 && settle.entry.id.length === 36 && settlementOf([]).transactions === 0, 'net by currency, product and tenant from Stripe\'s own figures; the ledger content-addressed')
      check('billing:plan', plan.secret === 'STRIPE_SECRET_KEY_UUIDNA' && plan.form['metadata[domains]'] === '*' && plan.headers['idempotency-key']!.length === 36 && plan.form['line_items[0][price_data][unit_amount]'] === '43200', 'the plan names the tenant secret, the domains and an idempotency key')
      const ecb = ratesOf('ecb', ECB_FIXTURE) as RateTable; const er = ratesOf('er-api', ERAPI_FIXTURE) as RateTable; const fr = ratesOf('frankfurter', FRANKFURTER_FIXTURE) as RateTable
      const h = harmoniseOf([ecb, er, fr], ['EUR', 'USD', 'BGN', 'GBP', 'JPY'])
      check('billing:rates-read-from-every-format', ecb.rates.USD === 1.1193 && ecb.date === '2026-10-23' && er.rates.BGN === 1.95583 && fr.rates.GBP === 0.83728 && 'error' in ratesOf('ecb', 'not xml') && 'error' in ratesOf('nowhere', ''), 'the ECB XML, er-api JSON and Frankfurter JSON read; an unreadable body and an unknown source said so')
      check('billing:rates-harmonised-by-median', h.USD!.rate === 1.1193 && h.USD!.outcome === 'agree' && h.USD!.sources.length === 3 && h.BGN!.outcome === 'peg' && h.BGN!.rate === 1.95583 && h.JPY!.outcome === 'erased' && h.EUR!.rate === 1, `USD ${h.USD!.rate} from three sources (spread ${(h.USD!.spread * 100).toFixed(2)} %), BGN pegged, JPY erased (no source)`)
      const drift = harmoniseOf([ecb, { source: 'x', date: null, base: 'EUR', rates: { USD: 1.2 } }], ['USD'])
      check('billing:drift-named', drift.USD!.outcome === 'drift' && drift.USD!.drifting.includes('x'), 'a source 7 % off the median is named as drifting')
      check('billing:amounts-in-every-currency', amountsOf(43200, h).usd === 48353.76 && amountsOf(43200, h).bgn === 84491.86 && amountsOf(43200, h).eur === 43200, '432.00 € is 483.54 $ and 844.92 лв at these rates, to the cent')
      check('billing:tenant-and-domain-currency', TENANT_CURRENCY.psg === 'EUR' && DOMAIN_CURRENCY.bg === 'EUR' && DOMAIN_CURRENCY.com === 'USD', 'psg prices in euro; .bg is euro since 2026; .com is dollar')
      return done()
    },
  },
}
