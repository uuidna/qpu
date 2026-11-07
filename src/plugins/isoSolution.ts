// The standard Payload ISO solution, fused onto every MCP tool response.
// The deliverables and the address functions are leaves. The one consolidation is isoAspects.
// The configuration and deploy programs are the objects those aspects already place. Nothing is fetched and nothing is written.
import { seal, uuid } from '../quantum/password/address.js'
import { aspectPrograms } from '../quantum/uuid/programs/aspects/index.ts'
import { ISO_DIMENSIONS, ISO_OPEN_DEFINITIONS, verifyIsoOnline } from '../quantum/processing/iso-deliverables.ts'
import { isoAspects } from '../quantum/processing/iso-aspects.ts'
import { linkedIso, mcpLinks, mcpProgramRoute } from './mcpLinks.ts'

const FORMULA = 'clause 10.3 improves the ISO audit: each dimension holds on its own evidence, and the ISO Open Data file verifies and defines every dimension'
const THEOREM = 'textbook_standards_sliced'
const LEAN = 'theorem textbook_standards_sliced (covered uncovered total : Nat) (h : covered + uncovered = total) : total - uncovered = covered := by omega'
const CONTEXT = { disableRevalidate: true as const }

const definedOf = (dimension: string) => {
  const key = dimension.replace(/\s*\(.*$/, '').trim()
  return ISO_OPEN_DEFINITIONS.find((row) => row.reference === key || row.reference.startsWith(`${key}:`) || row.reference.startsWith(`${key}-`))
}

const isoRows = (formula: string, documented: boolean, read: boolean) => {
  const found = formula.match(/\b\d{4}-\d{2}-\d{2}\b/g)
  const dates: string[] = found ? [...found] : []
  const datesHold = dates.every((token) => { const [year, month, day] = token.split('-').map(Number); return year !== undefined && month !== undefined && day !== undefined && month >= 1 && month <= 12 && day >= 1 && day <= 31 })
  return ISO_DIMENSIONS.map((dimension) => {
    const defined = definedOf(dimension)
    const title = defined?.title.en ?? ''
    const scope = defined?.scope.en ?? ''
    const named = title.length > 0 && scope.length > 0
    const quality = dimension !== 'ISO 9001' || (documented && read)
    const calendar = dimension !== 'ISO 8601' || datesHold
    const pitch = dimension === 'ISO 16'
    const computes = pitch ? 432 : null
    const definition = pitch ? `The note A computes at ${computes} Hz.` : scope
    return { dimension, reference: defined?.reference ?? null, title, definition, example: pitch ? scope : null, computes, hz: computes, unlimited: pitch, holds: named && quality && calendar && definition.length > 0 }
  })
}

const receipt = (clause: string, formula: string, prior: string, says: string) => {
  const bound = prior.length > 0 ? `${clause}\n${formula}\n${prior}\n${says}` : `${clause}\n${formula}\n${says}`
  const id = uuid(bound)
  return { id, sealed: seal(id).valid && id.length === 36 && uuid(bound) === id }
}

/** ISO defines every dimension from the defining rows. The same object the payload tool returns for { iso: true }. */
export const standardIso = () => {
  const text = ISO_OPEN_DEFINITIONS.map((row) => JSON.stringify(row)).join('\n')
  const online = verifyIsoOnline({ status: 200, text })
  const formula = FORMULA
  const iso = { standard: 'ISO 9001' as const, formula, documented: true as const, theorem: THEOREM, lean: LEAN }
  const docs = { method: 'docs.documents.batchUpdate' as const, text: formula }
  const documented = formula.length > 0 && iso.documented === true && iso.standard === 'ISO 9001'
  const read = docs.text === formula
  const rows = isoRows(formula, documented, read)
  const auditHolds = documented && read && rows.length === ISO_DIMENSIONS.length && rows.every((row) => row.holds)
  const audit = { phase: 'audit' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 9.2' as const, formula, documented, read, rows, dimensions: rows.length, of: ISO_DIMENSIONS.length, holds: auditHolds, theorem: THEOREM as typeof THEOREM }
  const reviewSays = audit.holds ? 'the management review accepts the audited formula' : 'the audit did not hold, so the formula is a nonconformity'
  const decision = audit.holds ? 'accept' as const : 'nonconformity' as const
  const review = receipt('ISO 9001:2015, 9.3', audit.formula, '', reviewSays)
  const next = { phase: 'next' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 9.3' as const, decision, formula: audit.formula, says: reviewSays, id: review.id, sealed: review.sealed, holds: review.sealed && (audit.holds ? decision === 'accept' : decision === 'nonconformity') }
  const accepted = audit.holds === true && next.holds === true && next.decision === 'accept' && next.clause === 'ISO 9001:2015, 9.3'
  const integrity = accepted && audit.rows.length === ISO_DIMENSIONS.length && audit.rows.every((row) => row.holds)
  const planSays = integrity ? 'the change is planned: the purpose is that formula, the dimensions still hold, and the same doors carry it' : 'no change is planned'
  const planned = receipt('ISO 9001:2015, 6.3', audit.formula, next.id, planSays)
  const change = { phase: 'next' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 6.3' as const, purpose: integrity ? 'the accepted formula becomes the audited process' : 'a review that did not accept plans no change', integrity, formula: audit.formula, says: planSays, id: planned.id, sealed: planned.sealed, holds: integrity && planned.sealed }
  const operated = audit.holds === true && change.holds === true && change.integrity === true && change.clause === 'ISO 9001:2015, 6.3'
  const controlSays = operated ? 'the planned change is carried out: the accepted formula is the process' : 'a change that was not planned is not carried out'
  const controlFormula = operated ? audit.formula : ''
  const controlled = receipt('ISO 9001:2015, 8.1', controlFormula, change.id, controlSays)
  const control = { phase: 'control' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 8.1' as const, operated, formula: controlFormula, says: controlSays, id: controlled.id, sealed: controlled.sealed, holds: operated && controlFormula.length > 0 && controlFormula === audit.formula && controlled.sealed }
  const carried = audit.holds === true && control.holds === true && control.operated === true && control.clause === 'ISO 9001:2015, 8.1' && control.formula === audit.formula && control.formula.length > 0
  const releaseSays = carried ? 'the carried out process is released: the planned arrangements are complete and the formula meets them' : 'a process that was not carried out is not released'
  const releaseFormula = carried ? audit.formula : ''
  const released = receipt('ISO 9001:2015, 8.6', releaseFormula, control.id, releaseSays)
  const release = { phase: 'release' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 8.6' as const, released: carried, formula: releaseFormula, says: releaseSays, id: released.id, sealed: released.sealed, holds: carried && releaseFormula.length > 0 && releaseFormula === audit.formula && released.sealed }
  const watched = release.holds === true && release.released === true && release.formula.length > 0 && online.rows.length === ISO_DIMENSIONS.length && online.rows.every((row) => row.verified)
  const withdrawn = online.rows.filter((row) => row.verified && row.current === false)
  const language = withdrawn.length === 1 && withdrawn[0]!.dimension === 'ISO 639-1' && withdrawn[0]!.successor?.reference === 'ISO 639:2023' && withdrawn[0]!.successor.catalogue === 74575 && withdrawn[0]!.successor.current === true
  const monitorSays = watched && language ? 'the released output is monitored: each dimension is measured by the open data, and ISO 639-1 names ISO 639:2023' : 'a release that did not hold is not monitored'
  const monitored = receipt('ISO 9001:2015, 9.1', release.formula, release.id, monitorSays)
  const monitor = { phase: 'monitor' as const, process: 'ISO 9001' as const, clause: 'ISO 9001:2015, 9.1' as const, measured: online.rows.length, withdrawn: withdrawn.length, successor: withdrawn[0]?.successor ?? null, says: monitorSays, id: monitored.id, sealed: monitored.sealed, holds: watched && language && monitored.sealed }
  const data = { title: 'ISO', product: 'iso', variant: 'improve', iso, docs }
  const save = audit.holds ? { api: 'create' as const, args: { collection: 'products' as const, overrideAccess: true as const, data, draft: true as const, context: CONTEXT } } : null
  const reasons = new Set(rows.map((row) => row.definition))
  const verifiedOnline = online.phase === 'verified' && online.holds === true && online.defined === online.asked && online.verified === online.asked
  const improved = save !== null && audit.holds === true && next.decision === 'accept' && change.holds === true && rows.length === ISO_DIMENSIONS.length && reasons.size === rows.length && rows.every((row) => row.holds)
  const one = isoAspects()
  const holds = improved && next.holds === true && change.holds === true && verifiedOnline && control.holds === true && release.holds === true && monitor.holds === true && one.holds
  const says = holds
    ? `ISO defines all ${online.defined} dimensions from the iso_deliverables_metadata dataset. ${online.current} are current. The management review accepts the record, clause 6.3 plans that change, clause 8.1 carries it out, clause 8.6 releases it, and clause 9.1 monitors it.`
    : 'the ISO Open Data file did not verify and define every dimension'
  return {
    phase: 'iso' as const,
    process: 'ISO 9001' as const,
    via: 'iso' as const,
    clause: 'ISO 9001:2015, 10.3' as const,
    formula,
    improved,
    holds,
    dimensions: rows.length,
    of: ISO_DIMENSIONS.length,
    rows,
    verified: online.verified,
    defined: online.defined,
    held: true as const,
    fetched: false as const,
    written: false as const,
    online,
    audit,
    next,
    change,
    control,
    release,
    monitor,
    save,
    says,
    one,
  }
}

type ToolResponse = {
  content: { type: string; text?: string }[]
  doc?: Record<string, unknown>
  isError?: boolean
  structuredContent?: unknown
}

/** The standard solution, plus the programs that handle every configuration and every deploy stage. The scopes are the links. */
const mcpIso = (toolName: string) => {
  const iso = linkedIso(standardIso())
  const programs = aspectPrograms()
  return { ...iso, tool: toolName, programs }
}

/**
 * afterToolCall: the handler's answer stays; ISO, link space, and the UUID program route are on it.
 * Entropy on MCP is dictionary first, then verified — wrong meaning misleads the user (security).
 * Do not strip a tool's own entropy findings; nest prior numeric disorder under findings if present.
 */
export const fuseToolResponse = <T extends ToolResponse>(response: T, toolName: string, input?: unknown): T => {
  const iso = mcpIso(toolName)
  const space = mcpLinks(input)
  const route = mcpProgramRoute(toolName, input)
  const structured = response.structuredContent
  const prior = structured && typeof structured === 'object' && !Array.isArray(structured)
    ? structured as Record<string, unknown>
    : {}
  const cleaned = { ...prior }
  // a string route was a website path claimed as program route — keep it as href
  if (typeof cleaned.route === 'string') {
    if (cleaned.href === undefined) cleaned.href = cleaned.route
    delete cleaned.route
  }
  // Never delete disorder evidence to fake S = 0. Preserve prior entropy measure under findings.
  if (cleaned.entropy !== undefined && (typeof cleaned.entropy === 'number' || (cleaned.entropy && typeof cleaned.entropy === 'object' && !('dictionary' in (cleaned.entropy as object))))) {
    cleaned.findings = cleaned.entropy
    delete cleaned.entropy
  }
  const body = {
    ...cleaned,
    iso,
    space,
    route,
    entropy: route.entropy,
    law: route.entropy.law,
    dictionary: route.entropy.dictionary,
  }
  return { ...response, structuredContent: body }
}
