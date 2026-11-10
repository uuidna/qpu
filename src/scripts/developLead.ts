import { getPayload } from 'payload'

import config from '@payload-config'

/** Develop one lead into a product with variants and the post that publishes it, through the Local API with access and
 *  hooks running: `LEAD_PATH=legacy/src/payload.qpu.mcp.ts pnpm payload run src/scripts/developLead.ts`. The products and posts
 *  afterChange hooks mark the lead page developed. Acts as LEGACY_ADMIN_EMAIL (the user queueLegacyLeads resolves). */
const leadPath = process.env.LEAD_PATH || 'legacy/src/payload.qpu.mcp.ts'
const email = process.env.LEGACY_ADMIN_EMAIL || 'legacy-leads@qpu.localhost'
const payload = await getPayload({ config })

const admin = (await payload.find({ collection: 'users', limit: 1, overrideAccess: true, where: { email: { equals: email } } })).docs[0]
if (!admin?.roles?.includes('admin')) throw new Error(`${email} is not an admin here: run queueLegacyLeads first or name one`)
const user = { ...admin, collection: 'users' as const }

const lead = (await payload.find({ collection: 'pages', draft: true, limit: 1, user, where: { 'lead.path': { equals: leadPath } } })).docs[0]
if (!lead) throw new Error(`no lead page for ${leadPath}: queue it with LEGACY_PATHS=${leadPath}`)
const tenant = typeof lead.tenant === 'object' ? lead.tenant?.id : lead.tenant

const text = (t: string) => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'paragraph' as const,
        children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: t, version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

// the GHZ state on n qubits as a circuit program: H on the first, then a CNOT chain. On 2 qubits it is the Bell pair.
const line = (x: number) => ({ kind: 'line', x })
const ghz = (n: number) => ({
  operations: [{ gate: 'H', qubits: [line(0)] }, ...Array.from({ length: n - 1 }, (_, i) => ({ gate: 'CNOT', qubits: [line(i), line(i + 1)] }))],
})
// the variants: qubit count (Bell on 2, GHZ on 3) and shots (the exact state vector, or 8 measured samples)
const qubits = await payload.create({ collection: 'variantTypes', data: { label: 'Qubits', name: 'qubits' }, user })
const shots = await payload.create({ collection: 'variantTypes', data: { label: 'Shots', name: 'shots' }, user })
const option = (variantType: number, value: string, label: string) =>
  payload.create({ collection: 'variantOptions', data: { label, value, variantType }, user })
const widths = await Promise.all(['2', '3'].map((v) => option(qubits.id, v, `${v} qubits`)))
const samples = await Promise.all([option(shots.id, 'exact', 'exact state vector'), option(shots.id, '8', '8 shots')])
const program = (n: number, shot: string) => {
  const qs = Array.from({ length: n }, (_, i) => line(i))
  return shot === 'exact' ? ghz(n) : { ...ghz(n), measure: { key: 'm', qubits: qs }, repetitions: Number(shot) }
}
const product = await payload.create({
  collection: 'products',
  data: {
    title: 'GHZ state, exactly simulated',
    slug: 'ghz-state-exactly-simulated',
    quantum: { program: ghz(2) },
    description: text(`The GHZ state prepared by a circuit and computed by a classical exact simulator of quantum circuits: qpu's circuit tool at /api/mcp. Each variant is the program at one qubit count and one number of shots; an order of it runs the program and carries the outcome and its receipt. Developed from ${leadPath}.`),
    enableVariants: true,
    variantTypes: [qubits.id, shots.id],
    developedFrom: lead.id,
    tenant,
    _status: 'published',
  },
  draft: false,
  user,
})
for (const width of widths)
  for (const sample of samples)
    await payload.create({
      collection: 'variants',
      data: {
        product: product.id,
        options: [width.id, sample.id],
        title: `${product.title}, ${width.label}, ${sample.label}`,
        quantum: { program: program(Number(width.value), sample.value) },
        _status: 'published',
      },
      user,
    })
const post = await payload.create({
  collection: 'posts',
  context: { disableRevalidate: true },
  data: {
    title: `${product.title}: developed from ${leadPath}`,
    slug: `${product.slug}-developed`,
    content: text(`${product.title} is now a product, with variants for 2 and 3 qubits, exact or sampled. It was developed from the lead ${leadPath}, which entered this installation through the uuidna trial door.`),
    developedFrom: lead.id,
    _status: 'published',
  },
  draft: false,
  user,
})
const after = await payload.findByID({ id: lead.id, collection: 'pages', depth: 0, draft: true, user })
payload.logger.info({ msg: 'lead developed', lead: leadPath, product: product.id, post: post.id, developedAs: after.lead?.developedAs })
process.exit(0)
