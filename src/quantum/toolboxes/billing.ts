// The billing toolbox: Stripe per tenant, pure. A checkout is a plan (the request the Worker sends to Stripe with the tenant's
// key, never the handler); a webhook is verified here by its Stripe-Signature (HMAC-SHA256 over timestamp.payload with the
// tenant's webhook secret, tolerance on the timestamp) and read into one idempotent docket entry per event (granted,
// renewed, revoked, disputed, failed), content-addressed by the event id; the licence state of a subject is read from its
// entries at any tenant, since a licence names the domains it is valid on and the entries mirror. Every scenario between
// tenants is an entry and a rule, never a special case: the same licence at another domain, a refund after a grant, a
// dispute, a renewal, a replayed event, a wrong tenant's signature.
import { toolOf, type Toolbox } from '../toolbox.js'
import { hmacSha256, utf8, hex, sameHex } from '../hmac.js'
import { uuidOf } from '../blocks.js'
import { LICENSE } from '../license.js'
import { flowWidget } from '../widgets.js'

export type Checkout = { tenant: string; host: string; subject: string; domains: string[]; mode: 'payment' | 'subscription'; price?: string; amount?: number; currency: string; successUrl: string; cancelUrl: string; customerEmail?: string }
export type Plan = { method: 'POST'; url: string; headers: Record<string, string>; form: Record<string, string>; secret: string }
export type LicenceEntry = { id: string; kind: 'licence'; from: string; body: { event: string; type: string; state: 'granted' | 'renewed' | 'changed' | 'revoked' | 'disputed' | 'failed' | 'noted'; subject: string; tenant: string; domains: string[]; product: string | null; variant: string | null; quantity: number | null; customer: string | null; amount: number | null; currency: string | null; at: number; licence: string; terms: string }; links: string[] }

/** The QPU as a product with its variants: what is sold, by what unit, on what interval; a tenant may price each variant in its own
 * currency. The a432 harmonic default stays free under attribution; the author's licence terms ride on every product. */
export type Variant = { product: string; variant: string; unit: 'domain' | 'tenant' | 'seat' | 'thousand-calls' | 'platform' | 'none'; interval: 'month' | 'year' | 'once' | 'metered'; amounts: Record<string, number>; domains: '*' | 'named'; description: string }
export const CATALOGUE: readonly Variant[] = [
  { product: 'qpu-a432', variant: 'harmonic-default', unit: 'none', interval: 'once', amounts: { eur: 0, usd: 0, bgn: 0 }, domains: '*', description: 'the a432 harmonic default: free under attribution, every result carrying the licence' },
  { product: 'qpu-domain', variant: 'yearly', unit: 'domain', interval: 'year', amounts: { eur: 43200, usd: 47500, bgn: 84500 }, domains: 'named', description: 'commercial use of the QPU framework on one named domain, for a year' },
  { product: 'qpu-domain', variant: 'monthly', unit: 'domain', interval: 'month', amounts: { eur: 4320, usd: 4750, bgn: 8450 }, domains: 'named', description: 'the same, by the month' },
  { product: 'qpu-tenant', variant: 'yearly', unit: 'tenant', interval: 'year', amounts: { eur: 216000, usd: 237600, bgn: 422400 }, domains: '*', description: 'commercial use on every domain of one tenant, for a year' },
  { product: 'qpu-seat', variant: 'monthly', unit: 'seat', interval: 'month', amounts: { eur: 2700, usd: 2970, bgn: 5280 }, domains: '*', description: 'one seat of the full platform (every toolbox, every host), by the month' },
  { product: 'qpu-metered', variant: 'per-thousand-calls', unit: 'thousand-calls', interval: 'metered', amounts: { eur: 108, usd: 119, bgn: 211 }, domains: '*', description: 'tools/call metered from the docket\'s receipts, per thousand calls, billed monthly' },
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
const WEBHOOK_OF = (tenant: string) => `STRIPE_WEBHOOK_SECRET_${tenant.toUpperCase()}`

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
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: ['plan', 'webhook', 'state', 'catalogue', 'usage', 'settle'] }, currencies: { type: 'array', items: { type: 'string' } }, from: { type: 'integer' }, to: { type: 'integer' }, transactions: { type: 'array', items: { type: 'object' }, description: 'settle: Stripe balance transactions {id, amount, fee, net, currency, product?, variant?, tenant?}' }, tenant: { type: 'string' }, host: { type: 'string' }, checkout: { type: 'object', description: 'plan: { subject, domains, mode, price | amount, currency, successUrl, cancelUrl, customerEmail? }' }, payload: { type: 'string', description: 'webhook: the raw body' }, signature: { type: 'string', description: 'webhook: the Stripe-Signature header' }, secret: { type: 'string', description: 'webhook: the tenant\'s webhook secret (the Worker passes it; a client never has it)' }, now: { type: 'integer', description: 'webhook/state: unix seconds; default the current time' }, entries: { type: 'array', items: { type: 'object' }, description: 'webhook/state: the subject\'s licence entries as read from the docket' }, subject: { type: 'string' }, domain: { type: 'string' }, selftest: { type: 'boolean' } } },
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
    if (op === 'catalogue') { const c = catalogueOf(tenant, Array.isArray(args.currencies) ? args.currencies.map(String) : ['eur', 'usd', 'bgn']); return { op, tenant, products: c.products.length, prices: c.prices.length, variants: CATALOGUE.length, secret: c.secret, catalogue: CATALOGUE, forms: c, procedure: `the Worker creates the products and prices at Stripe with <${c.secret}> once per tenant; the price ids come back in the webhooks' metadata` } }
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
export const usageOrderOf = (calls: number, currency = 'eur', energy?: { kWh: number; tariffEurPerKwh: number | null }) => {
  const v = CATALOGUE.find((c) => c.product === 'qpu-metered' && c.variant === 'per-thousand-calls')!
  const quantity = Math.ceil(Math.max(0, calls) / 1000)
  const unitAmount = v.amounts[currency.toLowerCase()] ?? v.amounts.eur ?? 0
  const amount = quantity * unitAmount
  return { collection: 'orders', items: [{ product: v.product, variant: v.variant, quantity, unitAmount, amount, unit: v.unit, interval: v.interval }], currency: currency.toUpperCase(), amount, minorUnits: true, status: 'pending', energyLine: energy ? { kWh: energy.kWh, tariffEurPerKwh: energy.tariffEurPerKwh, costEur: energy.tariffEurPerKwh != null ? energy.kWh * energy.tariffEurPerKwh : null, says: 'informational: the joules the computations moved at the tariff the tenant names, not a catalogue price' } : null, transactions: 'the ecommerce plugin\'s transactions collection: one per payment, the ledger', checkout: '/checkout: the plugin\'s own, the Stripe adapter the payment', says: `${calls} calls billed as ${quantity} × ${v.product}/${v.variant} at ${unitAmount} ${currency.toUpperCase()} minor units: an order of the ecommerce plugin, nothing custom` }
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
    { id: 'stripe-plan', tool: 'stripe', arguments: { op: 'plan', tenant: 'psg', host: 'qpu.psg.bg', checkout: { subject: 'acme', domains: ['qpu.psg.bg', 'qpu.uuidna.com'], mode: 'subscription', amount: 43200, currency: 'eur', successUrl: 'https://qpu.psg.bg/licence?ok', cancelUrl: 'https://qpu.psg.bg/licence?cancel' } }, shows: 'A checkout plan for a yearly commercial licence of acme on two domains, bought at tenant psg: the form Stripe takes, the metadata the webhook brings back, the tenant secret the Worker alone holds.', expect: (s) => (s.secret === 'STRIPE_SECRET_KEY_PSG' && s.plan.form['metadata[domains]'] === 'qpu.psg.bg,qpu.uuidna.com' && s.plan.form['line_items[0][price_data][recurring][interval]'] === 'year' ? null : JSON.stringify(s.plan?.form).slice(0, 160)) },
    { id: 'stripe-catalogue', tool: 'stripe', theorem: 'textbook_prices_are_variants_times_currencies', arguments: { op: 'catalogue', tenant: 'uuidna', currencies: ['eur', 'usd'] }, shows: 'The QPU as a product line for tenant uuidna: seven variants over five products, each a Stripe price form in two currencies, the a432 default at zero.', expect: (s) => (s.variants === 7 && s.products === 6 && s.prices === 14 && s.catalogue[0].amounts.eur === 0 ? null : `${s.products} products, ${s.prices} prices, ${s.variants} variants`) },
    { id: 'stripe-webhook', tool: 'stripe', arguments: { op: 'webhook', tenant: 'psg', payload: COMPLETED, signature: signatureOf(SECRET, 1_700_000_000, COMPLETED), secret: SECRET, now: 1_700_000_100 }, shows: 'A checkout completed at tenant psg, its signature verified with psg\'s webhook secret, read into one licence entry granting acme on both domains.', expect: (s) => (s.valid === true && s.state === 'granted' && s.duplicate === false && s.entry.body.domains.length === 2 ? null : `${s.valid} ${s.why} ${s.state}`) },
  ],
  skill: {
    instructions: 'Per tenant the author sets two wrangler secrets, STRIPE_SECRET_KEY_<TENANT> and STRIPE_WEBHOOK_SECRET_<TENANT>, and registers https://<host>/docket/stripe as the webhook endpoint at Stripe. A client calls stripe plan and the Worker executes the plan with the tenant key, answering the session url. Stripe posts events to the tenant\'s endpoint; the Worker calls stripe webhook with the raw body, the Stripe-Signature header and the tenant secret, writes the entry it gets to the tenant docket (mirrors carry it to the others), and answers 200 on a duplicate. Any host answers stripe state for a subject at its domain from the entries it holds.',
    directions: ['server only: SHA-256 and HMAC vectors, the signature round trip, every event type to its state, every scenario between tenants', 'client → server: the Worker hands the raw body, the header and the secret; the handler never holds a key', 'toolbox → toolbox: entries are addressed with the tree\'s uuidOf, kept in the raid docket, verified by the tree toolbox\'s verify'],
    selftest: () => {
      const checks: { id: string; passed: boolean; evidence: string }[] = []
      const check = (id: string, passed: boolean, evidence: string) => checks.push({ id, passed, evidence })
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
      check('billing:catalogue', cat.prices.length === 14 && cat.prices.every((p) => p.form['metadata[tenant]'] === 'psg') && cat.prices.some((p) => p.form['recurring[usage_type]'] === 'metered') && CATALOGUE.every((v) => Object.values(v.amounts).every((a) => Number.isInteger(a) && a >= 0)), 'per-tenant catalogue, metered variant, integer minor units')
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
      return { passed: checks.every((c) => c.passed), checks }
    },
  },
}
