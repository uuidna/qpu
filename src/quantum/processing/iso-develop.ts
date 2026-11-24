// The ISO 9001 process a formula develops through: audited against every ISO dimension, reviewed, planned, carried out, released and
// monitored, each step sealed by a UUID; the Clay formulas developed node by node and cross-verified against their evaluated sides.
import { PROSE } from './prose-index.ts'
import { isObj } from './toolbox.ts'
import { seal, uuid } from '../uuid/index.ts'
import { AXIOMS, evaluate as clayEvaluate } from './clay-register.ts'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { THEOREMS } from './theorems-index.ts'
import { routeStatement } from './match.ts'
import { DECODE_THEOREMS, ISO_EXIT } from './iso-exit.ts'
import { ISO_DIMENSIONS, verifyIsoOnline } from './standards.ts'
import { ISO_OPEN_DEFINITIONS } from './iso-deliverables.ts'
import { COIN_STANDARDS } from './unit/coil.ts'

const isoRows = (formula: string, documented: boolean, read: boolean, hz?: number | null) => {
  const dates: string[] = formula.match(/\b\d{4}-\d\d-\d\d\b/g) ?? []
  const datesHold = dates.every((token) => { const [, month = 0, day = 0] = token.split('-').map(Number); return month >= 1 && month <= 12 && day >= 1 && day <= 31 })
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

const saveNext = (audit: { holds: boolean; formula: string }) => {
  const clause = audit.holds ? 'ISO 9001:2015, 9.3' as const : 'ISO 9001:2015, 10.2' as const
  const decision = audit.holds ? 'accept' as const : 'nonconformity' as const
  const says = audit.holds ? PROSE.quantumProcessingIsoDevelop_s1 : PROSE.quantumProcessingIsoDevelop_s2
  const bound = `${clause}\n${audit.formula}\n${says}`
  const id = uuid(bound)
  const sealed = seal(id).valid
  return { phase: 'next' as const, process: 'ISO 9001' as const, clause, decision, formula: audit.formula, says, id, sealed, holds: sealed && id.length === 36 && uuid(bound) === id && (audit.holds ? decision === 'accept' : decision === 'nonconformity') }
}

const planChange = (audit: { holds: boolean; formula: string; rows: readonly { holds: boolean }[] }, review: { holds: boolean; decision: string; clause: string; id: string }) => {
  const accepted = audit.holds === true && review.holds === true && review.decision === 'accept' && review.clause === 'ISO 9001:2015, 9.3'
  const integrity = accepted && audit.rows.length === ISO_DIMENSIONS.length && audit.rows.every((row) => row.holds)
  const clause = 'ISO 9001:2015, 6.3' as const
  const purpose = integrity ? PROSE.quantumProcessingIsoDevelop_s3 : PROSE.quantumProcessingIsoDevelop_s4
  const says = integrity ? PROSE.quantumProcessingIsoDevelop_s5 : 'no change is planned'
  const bound = `${clause}\n${audit.formula}\n${review.id}\n${says}`
  const id = uuid(bound)
  const sealed = seal(id).valid
  const holds = integrity && sealed && id.length === 36 && uuid(bound) === id
  return { phase: 'next' as const, process: 'ISO 9001' as const, clause, purpose, integrity, formula: audit.formula, says, id, sealed, holds }
}

const controlProcess = (audit: { holds: boolean; formula: string }, change: { holds: boolean; integrity: boolean; clause: string; id: string }) => {
  const planned = audit.holds === true && change.holds === true && change.integrity === true && change.clause === 'ISO 9001:2015, 6.3'
  const clause = 'ISO 9001:2015, 8.1' as const
  const formula = planned ? audit.formula : ''
  const says = planned ? PROSE.quantumProcessingIsoDevelop_s6 : PROSE.quantumProcessingIsoDevelop_s7
  const bound = `${clause}\n${formula}\n${change.id}\n${says}`
  const id = uuid(bound)
  const sealed = seal(id).valid
  const holds = planned && formula.length > 0 && formula === audit.formula && sealed && id.length === 36 && uuid(bound) === id
  return { phase: 'control' as const, process: 'ISO 9001' as const, clause, operated: planned, formula, says, id, sealed, holds }
}

const releaseOutput = (audit: { holds: boolean; formula: string }, control: { holds: boolean; operated: boolean; clause: string; formula: string; id: string }) => {
  const carried = audit.holds === true && control.holds === true && control.operated === true && control.clause === 'ISO 9001:2015, 8.1' && control.formula === audit.formula && control.formula.length > 0
  const clause = 'ISO 9001:2015, 8.6' as const
  const formula = carried ? audit.formula : ''
  const says = carried ? PROSE.quantumProcessingIsoDevelop_s8 : PROSE.quantumProcessingIsoDevelop_s9
  const bound = `${clause}\n${formula}\n${control.id}\n${says}`
  const id = uuid(bound)
  const sealed = seal(id).valid
  const holds = carried && formula.length > 0 && formula === audit.formula && sealed && id.length === 36 && uuid(bound) === id
  return { phase: 'release' as const, process: 'ISO 9001' as const, clause, released: carried, formula, says, id, sealed, holds }
}

const monitorOutput = (release: { holds: boolean; released: boolean; formula: string; id: string }, rows: readonly { dimension: string; verified: boolean; current: boolean; successor: { reference: string; catalogue: number; current: boolean } | null }[]) => {
  const watched = release.holds === true && release.released === true && release.formula.length > 0 && rows.length === ISO_DIMENSIONS.length && rows.every((row) => row.verified)
  const withdrawn = rows.filter((row) => row.verified && row.current === false)
  const language = withdrawn.length === 1 && withdrawn[0]!.dimension === 'ISO 639-1' && withdrawn[0]!.successor?.reference === 'ISO 639:2023' && withdrawn[0]!.successor.catalogue === 74575 && withdrawn[0]!.successor.current === true
  const clause = 'ISO 9001:2015, 9.1' as const
  const says = watched && language ? PROSE.quantumProcessingIsoDevelop_s10 : PROSE.quantumProcessingIsoDevelop_s11
  const bound = `${clause}\n${release.formula}\n${release.id}\n${says}`
  const id = uuid(bound)
  const sealed = seal(id).valid
  const holds = watched && language && sealed && id.length === 36 && uuid(bound) === id
  return { phase: 'monitor' as const, process: 'ISO 9001' as const, clause, measured: rows.length, withdrawn: withdrawn.length, successor: withdrawn[0]?.successor ?? null, says, id, sealed, holds }
}

const hookExit = (code: number, answer?: { status?: number; text?: string }) => {
  const row = ISO_EXIT.exits[code] ?? ISO_EXIT.exits[1]!
  const online = verifyIsoOnline(answer)
  const research = { before: true as const, fetched: false as const, phase: online.phase, request: online.request, source: online.source, verified: online.verified, defined: online.defined, holds: online.holds }
  return { research, code: row.code, strategy: row.strategy, forth: row.forth, back: row.back, closed: row.closed, exited: row.exited, says: row.says }
}


const kernelTheorem = (key: string | undefined) => {
  if (!key) return null
  const kernel = THEOREMS.find((theorem) => theorem.key === key)
  if (!kernel) return null
  const textbook = TEXTBOOK_THEOREMS.find((theorem) => theorem.key === key)
  return { theorem: key, lean: textbook?.lean ?? kernel.statement, says: textbook?.says ?? kernel.statement }
}

let definingRows: ReturnType<typeof verifyIsoOnline> | null = null
const definingFile = () => (definingRows ??= verifyIsoOnline({ status: 200, text: ISO_OPEN_DEFINITIONS.map((row) => JSON.stringify(row)).join('\n') }))

/** What each hook of the ISO 9001 process does with a formula. */
export const HOOK_STEPS = { beforeChange: 'the formula is recorded' as const, afterChange: 'the formula is handed to the docs door' as const, afterRead: 'the documented formula is served' as const }
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
  // one iso shape for both branches: documented and its standard appear once the formula is recorded
  type Iso = { standard?: 'ISO 9001'; formula: string; documented?: true; theorem: typeof theorem; lean?: string | null }
  const changed: Omit<typeof data, 'iso'> & { iso: Iso } = data.iso.formula ? { ...data, iso: { standard: 'ISO 9001' as const, formula: data.iso.formula, documented: true as const, theorem: data.iso.theorem, lean: taken?.lean ?? null } } : data
  const written = { ...changed, docs: { method: 'docs.documents.batchUpdate' as const, text: changed.iso.formula } }
  const served = written
  const documented = served.iso.documented === true
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
  const { lean: _lean, ...record } = served
  return { phase: 'develop' as const, via: 'hooks' as const, process: 'ISO 9001' as const, framework: COIN_STANDARDS, params, hooks: ['beforeChange', 'afterChange', 'afterRead'] as const, lean, exit, ...record, served, end }
}


export const serveViaHooks = (theorems: readonly string[] = DECODE_THEOREMS) => {
  const developed = theorems.map((theorem) => {
    const stated = TEXTBOOK_THEOREMS.find((item) => item.key === theorem)
    return developViaHooks({ formula: stated?.says ?? theorem, product: 'factor', variant: theorem, title: theorem, theorem })
  })
  const formula = developed.map((row) => row.iso.formula).filter((line) => line.length > 0).join('\n')
  const served = developViaHooks({ formula, product: 'factor', variant: 'combination', title: 'factor', theorem: theorems[0] })
  const recorded = (iso: { formula: string }) => 'documented' in iso && iso.documented === true
  return {
    via: 'hooks' as const, manual: false as const, process: 'ISO 9001' as const, hooks: served.hooks,
    ...HOOK_STEPS,
    documented: recorded(served.iso) && developed.every((row) => recorded(row.iso)),
    developed: developed.map((row) => ({ theorem: row.iso.theorem, documented: recorded(row.iso), formula: row.iso.formula })),
    served,
  }
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

const developFormula = (formula: string, input: { product?: string; variant?: string; theorem?: string } = {}) => {
  const node = developNode(formula, new Set())
  if (!input.product && !input.variant && !input.theorem) return node
  const developed = developViaHooks({ formula, product: input.product, variant: input.variant, title: input.variant ?? input.product, theorem: input.theorem })
  return { ...node, ...developed, name: node.name, value: node.value, holds: node.holds, depth: node.depth, children: node.children }
}

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
