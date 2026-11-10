import { execFileSync } from 'child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import { getPayload } from 'payload'

import config from '@payload-config'
import { PRODUCT_CLAIMS, type ProductClaim, type Shots } from '@/products/claims'
import { THEOREMS } from '@/quantum/processing/theorems-index.ts'
import { VERSION } from '@/quantum/processing/unit/version.ts'
import { handle } from '@uuidna/qpu/mcp'
import { runCircuit } from '@/utilities/qpuCatalogue'

/** Close each product of src/products/claims.ts as ISO/IEC 25051:2014 5.1 describes it: `pnpm payload run
 *  src/scripts/closeProducts.ts`. Its prose is read from the Lean inline docs of the theorems it cites (the theorem's
 *  doc is a function's test prompt, its module's doc the work task); each prompt's test is the theorem, checked by the
 *  kernel (#print axioms), the receipt recomputed here and the outcome checked against the statement. A function no
 *  theorem doc states ships as a known limitation. The product and its variants are written through the Local API as
 *  LEGACY_ADMIN_EMAIL, so hooks and access run, and each variant must store the receipt its description cites. */
const email = process.env.LEGACY_ADMIN_EMAIL || 'legacy-leads@qpu.localhost'
const payload = await getPayload({ config })
const admin = (await payload.find({ collection: 'users', limit: 1, overrideAccess: true, where: { email: { equals: email } } })).docs[0]
if (!admin?.roles?.includes('admin')) throw new Error(`${email} is not an admin here: run queueLegacyLeads first or name one`)
const user = { ...admin, collection: 'users' as const }
const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).trim()

// identification (5.1.3.1): the app's and the catalogue's versions, and the date of the committed tree
const appVersion = (JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }).version
const date = git('log', '-1', '--format=%cs', 'HEAD')
const version = `qpu app ${appVersion}, catalogue ${VERSION}`
const repository = git('remote', 'get-url', 'origin')

// the circuit tool's gate set, read from its schema
const listed = (await handle({ id: 1, jsonrpc: '2.0', method: 'tools/list' })) as {
  result: { tools: { inputSchema: { properties?: { operations?: { items?: { properties?: { gate?: { enum?: string[] } } } } } }; name: string }[] }
}
const gates = listed.result.tools.find((t) => t.name === 'circuit')?.inputSchema.properties?.operations?.items?.properties?.gate?.enum ?? []

// the Lean sources: lakefile's srcDir, a module's file, a theorem's inline doc and its module's doc
const srcDir = readFileSync('lakefile.lean', 'utf8').match(/srcDir := "([^"]+)"/)?.[1] ?? '.'
const leanFile = (module: string) => readFileSync(path.join(srcDir, ...module.split('.')) + '.lean', 'utf8')
const flat = (s: string) => s.replace(/\s+/g, ' ').trim()
const theoremDoc = (module: string, key: string) => {
  const name = key.split('.').pop()!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return leanFile(module).match(new RegExp(`/--((?:(?!-/)[\\s\\S])*?)-/\\s*(?:@\\[[^\\]]*\\]\\s*)?theorem\\s+${name}\\b`))?.[1]
}
const moduleDoc = (module: string) => {
  const doc = leanFile(module).match(/\/-!([\s\S]*?)-\//)?.[1] ?? ''
  const front = doc.match(/---\s*\n([\s\S]*?)\n---/)?.[1] ?? ''
  return { component: front.match(/component:\s*(.+)/)?.[1]?.trim(), body: flat(doc.replace(/^\s*#.*$/m, '').replace(/---\s*\n[\s\S]*?\n---/, '')) }
}
// the kernel's own verdict on each theorem's axioms
const axiomsOf = (keys: { key: string; module: string }[]) => {
  const scratch = path.join(mkdtempSync(path.join(tmpdir(), 'qpu-axioms-')), 'axioms.lean')
  writeFileSync(scratch, [...new Set(keys.map((k) => `import ${k.module}`)), ...keys.map((k) => `#print axioms ${k.key}`)].join('\n') + '\n')
  const out = execFileSync('lake', ['env', 'lean', scratch], { encoding: 'utf8' })
  return Object.fromEntries(keys.map((k) => [k.key, out.split('\n').find((l) => l.startsWith(`'${k.key}'`))?.replace(`'${k.key}' `, '') ?? 'not reported']))
}

// programs
const line = (x: number) => ({ kind: 'line', x })
const ghz = (n: number) => ({
  operations: [{ gate: 'H', qubits: [line(0)] }, ...Array.from({ length: n - 1 }, (_, i) => ({ gate: 'CNOT', qubits: [line(i), line(i + 1)] }))],
})
const FAMILIES: Record<ProductClaim['family'], (n: number) => { operations: unknown[] }> = { ghz }
const programOf = (claim: ProductClaim, n: number, shots: Shots) => {
  const base = FAMILIES[claim.family](n)
  return shots === 'exact' ? base : { ...base, measure: { key: 'm', qubits: Array.from({ length: n }, (_, i) => line(i)) }, repetitions: shots }
}
const shotsLabel = (shots: Shots) => (shots === 'exact' ? 'exact state vector' : `${shots} shots`)

// timings on the build machine
const timed = async (n: number) => {
  const start = performance.now()
  await runCircuit(ghz(n))
  return `${n} qubits ${Math.round(performance.now() - start)} ms`
}
const timings = [await timed(16), await timed(20)]

type Amplitude = { im: number; re: number }
/** the exact outcome checked against the theorems' statement: support exactly {0…0, 1…1} with equal weight */
const holds = (n: number, outcome: Record<string, unknown>) => {
  const top = 2 ** n - 1
  const weight = ((outcome.amplitudes ?? []) as Amplitude[]).map((a) => a.re * a.re + a.im * a.im)
  const support = weight.flatMap((w, i) => (w > 1e-12 ? [i] : []))
  return support.length === 2 && support[0] === 0 && support[1] === top && Math.abs(weight[0]! - weight[top]!) < 1e-12
}

// Lexical, as the description's editor stores it
const text = (t: string, bold = false) => ({ type: 'text', detail: 0, format: bold ? 1 : 0, mode: 'normal', style: '', text: t, version: 1 })
const block = { direction: 'ltr', format: '', indent: 0, version: 1 }
const heading = (t: string) => ({ ...block, type: 'heading', tag: 'h3', children: [text(t)] })
const paragraph = (...parts: ReturnType<typeof text>[]) => ({ ...block, type: 'paragraph', textFormat: 0, textStyle: '', children: parts })
const list = (items: ReturnType<typeof text>[][]) => ({
  ...block,
  type: 'list',
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  children: items.map((parts, i) => ({ ...block, type: 'listitem', value: i + 1, children: parts })),
})
const root = (children: unknown[]) => ({ root: { ...block, type: 'root', children } })

const findOrCreate = async <T extends { id: number }>(collection: 'variantOptions' | 'variantTypes', where: Record<string, unknown>, data: Record<string, unknown>) =>
  ((await payload.find({ collection, depth: 0, limit: 1, user, where: where as never })).docs[0] as unknown as T | undefined) ??
  ((await payload.create({ collection, data: data as never, user })) as unknown as T)

for (const claim of PRODUCT_CLAIMS) {
  // the product's own variant types first, so its existing variants are the ones updated
  const found = (await payload.find({ collection: 'products', depth: 1, draft: true, limit: 1, user, where: { slug: { equals: claim.slug } } })).docs[0]
  const own = (found?.variantTypes ?? []).flatMap((t) => (typeof t === 'object' ? [t] : []))
  const typeOf = async (name: string, label: string) => own.find((t) => t.name === name) ?? (await findOrCreate<{ id: number }>('variantTypes', { name: { equals: name } }, { label, name }))
  const qubitsType = await typeOf('qubits', 'Qubits')
  const shotsType = await typeOf('shots', 'Shots')
  const option = (type: number, value: string, label: string) =>
    findOrCreate<{ id: number }>('variantOptions', { and: [{ variantType: { equals: type } }, { value: { equals: value } }] }, { label, value, variantType: type })

  // the theorems cited, their docs and the kernel's verdict
  const cited = Object.values(claim.theorems).flatMap((key) => THEOREMS.filter((t) => t.key === key))
  const axioms = axiomsOf(cited)
  const modules = [...new Set(cited.map((t) => t.module))].map(moduleDoc)

  // every variant, its evidence computed by the same handler the hook and /api/mcp call
  const runs = []
  for (const n of claim.qubits)
    for (const shots of claim.shots) {
      const program = programOf(claim, n, shots)
      const { outcome, receipt } = await runCircuit(program)
      const theorem = shots === 'exact' ? cited.find((t) => t.key === claim.theorems[n]) : undefined
      runs.push({
        doc: theorem ? theoremDoc(theorem.module, theorem.key) : undefined,
        holds: shots === 'exact' ? holds(n, outcome) : undefined,
        label: `${n} qubits, ${shotsLabel(shots)}`,
        program,
        qubitsOption: await option(qubitsType.id, String(n), `${n} qubits`),
        receipt,
        shotsOption: await option(shotsType.id, String(shots), shotsLabel(shots)),
        theorem,
      })
    }
  const stated = runs.filter((r) => r.theorem && r.doc)
  const unstated = runs.filter((r) => !(r.theorem && r.doc))

  const description = root([
    heading('Identification'),
    list([
      [text('Name: ', true), text(claim.title)],
      [text('Version: ', true), text(version)],
      [text('Date: ', true), text(date)],
      [text('Variants: ', true), text(runs.map((r) => r.label).join('; '))],
      ...modules.flatMap((m) => (m.component ? [[text('Component: ', true), text(m.component)]] : [])),
    ]),
    heading('Work task'),
    ...modules.map((m) => paragraph(text(m.body))),
    heading('Functions and their tests'),
    list(
      stated.map((r) => [
        text(`${r.label}: `, true),
        // a Lean doc is a phrase; it closes as a sentence so the test that follows reads apart
        text(flat(r.doc!).replace(/([^.!?])$/, '$1.')),
        text(' Test: ', true),
        text(
          `${r.theorem!.key} (${r.theorem!.module}), kernel: ${axioms[r.theorem!.key]}; outcome against the statement: ${r.holds ? 'holds' : 'does not hold'}; receipt ${r.receipt}, recomputed at generation and stored by the variant.`,
        ),
      ]),
    ),
    heading('Limits and known limitations'),
    list([
      [text('Gate set: ', true), text(gates.join(', '))],
      [text('Measured at generation: ', true), text(timings.join('; '))],
      ...unstated.map((r) => [
        text(`${r.label}: `, true),
        text(`no Lean theorem doc states it, so it ships unverified (receipt ${r.receipt}).`),
        text(' Closes when ', true),
        text('a Lean fact with a doc states it.'),
      ]),
    ]),
    heading('Support'),
    list([[text('MCP: ', true), text('/api/mcp')], [text('Repository: ', true), text(repository)]]),
    heading('Maintenance'),
    list([[text('Generated by: ', true), text('src/scripts/closeProducts.ts from src/products/claims.ts')]]),
  ])

  const data = {
    title: claim.title,
    slug: claim.slug,
    description: description as never,
    enableVariants: true,
    variantTypes: [qubitsType.id, shotsType.id],
    quantum: { program: runs[0]!.program },
    _status: 'published' as const,
  }
  const product = found
    ? await payload.update({ id: found.id, collection: 'products', data, draft: false, user })
    : await payload.create({ collection: 'products', data, draft: false, user })

  const existing = (await payload.find({ collection: 'variants', depth: 0, limit: 100, user, where: { product: { equals: product.id } } })).docs
  for (const r of runs) {
    const options = [r.qubitsOption.id, r.shotsOption.id]
    const same = existing.find((v) => {
      const ids = (v.options ?? []).map((o) => (typeof o === 'object' ? o.id : o))
      return ids.length === options.length && options.every((id) => ids.includes(id))
    })
    const variantData = { product: product.id, options, quantum: { program: r.program }, _status: 'published' as const }
    const stored = same
      ? await payload.update({ id: same.id, collection: 'variants', data: variantData, user })
      : await payload.create({ collection: 'variants', data: variantData, user })
    if (stored.quantum?.receipt !== r.receipt) throw new Error(`variant ${stored.id} stored receipt ${stored.quantum?.receipt}, the description cites ${r.receipt}`)
  }
  payload.logger.info({ msg: 'product closed', slug: claim.slug, product: product.id, stated: stated.length, unstated: unstated.length, axioms, holds: stated.every((r) => r.holds), date, version })
}
process.exit(0)
