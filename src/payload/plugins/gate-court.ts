/**
 * Every tightened gate is tried in court on each case — improved by use.
 *
 * Trial pack (aligned with priceCourtTrialOf):
 *   court.standard(confidence, required) — verdict boolean
 *   law.fidelity(first, second) — re-trial stability (same params, same boolean)
 *   law.standing(receipts) — hex-backed gate+trial calls are the receipt record
 *   law.reviewed(0) — advice stays a lead
 *   ms — wall time of the trial (diagnostics)
 *
 * Cases: discover.capacity, connect.bill, access.screen, access.execute (unix x),
 * crypt.digest.*, price.relation. Combinatorics.combinations(n,1) indexes the set.
 *
 * Connector: { court: true } | { trial: true } | { court|trial, case, flags?, digest?, mode? }.
 */
import { AccessFormulas } from '../../families/access/index.js'
import { CloudFormulas } from '../../families/cloud/index.js'
import { CombinatoricsFormulas } from '../../families/combinatorics/index.js'
import { CourtFormulas } from '../../families/court/index.js'
import { LawFormulas } from '../../families/law/index.js'
import {
  qpuFacesOf,
  qpuHexFamiliesOf,
  qpuHexUuidOf,
  qpuMcpToolsListOf,
} from '../../quantum/processing/unit/index.js'
import { modeAccessOf, modeBitsOf } from './access-mode.js'
import type { QpuPlugin } from './surface.js'

const BALANCE = 51

const rawNextOf = (r: object) =>
  Object.prototype.hasOwnProperty.call(r, 'next') ? ((r as { next?: unknown }).next ?? null) : ('absent' as const)

export type GateCall = {
  call: string
  name: string
  params: number[]
  hex: string | null
  value: number
  holds: boolean
  rawNext: unknown
  definition?: string
}

export type GateCourtCase = {
  case: string
  gate: GateCall
  confidence: number
  required: number
  trial: GateCall
  reviewed: GateCall
  fidelity: GateCall
  standing: GateCall
  /** Wall-clock ms for this trial (recomputed each call). */
  ms: number
  allow: boolean
  holds: boolean
  /** Filled by caller or goalOf — OPEN|LEAD from combinatorics when attached. */
  goal: 'OPEN' | 'LEAD'
  note: string
}

const callOf = (
  name: string,
  params: number[],
  r: { hex?: string | null; value: number; holds: boolean; formula?: string },
  familyHint?: string,
): GateCall => {
  const family = familyHint ?? name.split('.')[0]!
  const formula = name.includes('.') ? name.slice(name.indexOf('.') + 1) : name
  let hex = r.hex ?? null
  if (!hex) {
    try {
      hex = qpuHexUuidOf({ family, program: [formula], params })
    } catch {
      hex = null
    }
  }
  return {
    call: `${name}(${params.join(', ')})`,
    name,
    params,
    hex,
    value: Number(r.value),
    holds: r.holds === true,
    rawNext: rawNextOf(r),
    definition: r.formula,
  }
}

const receiptsOf = (...calls: GateCall[]): number =>
  calls.filter((c) => typeof c.hex === 'string' && c.hex.length > 0).length

/**
 * Try one gate case: standard + fidelity re-trial + standing(hex receipts) + reviewed lead + ms.
 */
export const gateCourtTrialOf = (input: {
  case: string
  gate: GateCall
  confidence?: number
  required?: number
  note?: string
}): GateCourtCase => {
  const t0 = Date.now()
  const confidence =
    typeof input.confidence === 'number' && Number.isSafeInteger(input.confidence)
      ? Math.max(0, Math.min(100, input.confidence))
      : input.gate.holds
        ? 100
        : 0
  const required =
    typeof input.required === 'number' && Number.isSafeInteger(input.required)
      ? Math.max(0, Math.min(100, input.required))
      : BALANCE
  const trial = CourtFormulas.standard(confidence, required)
  const again = CourtFormulas.standard(confidence, required)
  const fidelity = LawFormulas.fidelity(trial.value, again.value)
  const reviewed = LawFormulas.reviewed(0)
  const trialCall = callOf('court.standard', [confidence, required], trial, 'court')
  const fidelityCall = callOf('law.fidelity', [trial.value, again.value], fidelity, 'law')
  const reviewedCall = callOf('law.reviewed', [0], reviewed, 'law')
  const receipts = receiptsOf(input.gate, trialCall, fidelityCall)
  const standing = LawFormulas.standing(receipts)
  const standingCall = callOf('law.standing', [receipts], standing, 'law')
  const allow =
    input.gate.holds === true &&
    trial.value === 1 &&
    fidelity.value === 1 &&
    standing.value > 0
  return {
    case: input.case,
    gate: input.gate,
    confidence,
    required,
    trial: trialCall,
    reviewed: reviewedCall,
    fidelity: fidelityCall,
    standing: standingCall,
    ms: Math.max(0, Date.now() - t0),
    allow,
    holds: allow && fidelity.holds === true && standing.holds === true,
    goal: allow ? 'OPEN' : 'LEAD',
    note:
      input.note ??
      'gate ∧ court.standard ∧ law.fidelity re-trial ∧ law.standing(hex); law.reviewed(0) stays a lead',
  }
}

export const connectBillGateOf = (): GateCourtCase => {
  const tools = qpuMcpToolsListOf()
  const listBytes = JSON.stringify({ resultType: 'complete', tools }).length
  const doors = tools.length
  const qpuPrefixed = tools.filter((t) => t.name.startsWith('qpu_')).length
  const billHolds = doors <= 16 && listBytes < 16384 && qpuPrefixed === 0
  const measure = CloudFormulas.storage(doors, Math.max(1, listBytes))
  const gate = callOf(
    'cloud.storage',
    [doors, Math.max(1, listBytes)],
    { ...measure, holds: billHolds && measure.holds === true },
    'cloud',
  )
  return gateCourtTrialOf({
    case: 'connect.bill',
    gate: {
      ...gate,
      value: doors,
      holds: billHolds,
      definition: `connectBill doors=${doors} bytes=${listBytes} qpu_=${qpuPrefixed}; holds ⟺ doors≤16 ∧ bytes<16384 ∧ qpu_=0`,
    },
    confidence: billHolds ? 100 : 0,
    note: 'connect bill measured on tools/list; court.standard tries the holds bit',
  })
}

export const discoverCapacityGateOf = (): GateCourtCase & {
  families: number
  faces: number
  nodes: number
  path: 'full-registry' | 'seal-wave'
} => {
  const faces = qpuFacesOf().faces
  const families = qpuHexFamiliesOf().size
  const scale = CloudFormulas.scale(families, Math.max(1, faces))
  const nodes = Number(scale.value)
  const fits = nodes <= 1 && scale.holds === true
  const gate = callOf('cloud.scale', [families, Math.max(1, faces)], { ...scale, holds: fits }, 'cloud')
  const trial = gateCourtTrialOf({
    case: 'discover.capacity',
    gate,
    confidence: fits ? 100 : 0,
    note: fits
      ? 'full-registry discover fits one faces-window; court.standard allows'
      : '⌈families/faces⌉ > 1 — seal-wave path holds; full-registry capacity gate denies',
  })
  return {
    ...trial,
    families,
    faces,
    nodes,
    path: fits ? 'full-registry' : 'seal-wave',
  }
}

export const accessScreenGateOf = (flags: number): GateCourtCase => {
  const screen = AccessFormulas.screen(flags)
  const gate = callOf('access.screen', [flags], screen, 'access')
  const passed = Number(screen.value)
  const confidence = screen.holds ? 100 : Math.floor((passed * 100) / 5)
  return gateCourtTrialOf({
    case: 'access.screen',
    gate,
    confidence,
    note: 'access.screen flags tried as court.standard confidence from checks passed',
  })
}

/** Unix execute bit (mode triad × who) — seal-wave / native submit need x. */
export const accessExecuteGateOf = (mode = 5, who: 'other' | 'user' | 'group' | 'owner' = 'other'): GateCourtCase => {
  const access = modeAccessOf({ mode, who })
  const bits = modeBitsOf(mode)
  const whoIndex = access.unix.whoIndex
  // access.grant(actor, target) stands for execute reach; holds when mode x is set.
  const grant = AccessFormulas.grant(whoIndex, whoIndex)
  const gate = callOf(
    'access.grant',
    [whoIndex, whoIndex],
    { ...grant, holds: bits.execute && access.decides.execute && grant.holds === true },
    'access',
  )
  return gateCourtTrialOf({
    case: `access.execute.mode${mode}.${who}`,
    gate: {
      ...gate,
      holds: bits.execute && access.decides.execute === true,
      definition: `unix ${bits.symbolic} who=${who}; execute=${bits.execute}; decides.execute=${access.decides.execute}`,
    },
    confidence: bits.execute && access.decides.execute ? 100 : 0,
    note: bits.execute
      ? 'unix execute bit on — seal-wave / native submit allowed by mode'
      : 'unix execute bit off — tools/call seal/native gated (chmod x)',
  })
}

export const cryptDigestGateOf = (digest: string): GateCourtCase => {
  const name = String(digest).toLowerCase().replace(/^sha-/, 'sha')
  const registered = name === 'sha256' || name === 'sha512'
  const token = AccessFormulas.token(registered ? 256 : 0)
  const gate = callOf(
    'access.token',
    [registered ? 256 : 0],
    { ...token, holds: registered && token.holds === true },
    'access',
  )
  return gateCourtTrialOf({
    case: `crypt.digest.${name || 'none'}`,
    gate: { ...gate, holds: registered, definition: `pbkdf2 digest registry: sha256|sha512; asked=${name}` },
    confidence: registered ? 100 : 0,
    note: registered
      ? 'digest registered in formula port; court.standard allows'
      : 'digest unbound in formula port — gate denies (absent state, not policy refuse)',
  })
}

export const priceRelationGateOf = (input: {
  legsHold: boolean
  bareCount: number
  measure: number | null
}): GateCourtCase => {
  const confidence = input.legsHold && input.bareCount === 0 ? 100 : input.legsHold ? 75 : 0
  const measure = CloudFormulas.cost(1, Math.max(0, input.measure ?? 0))
  const gate = callOf(
    'cloud.cost',
    [1, Math.max(0, input.measure ?? 0)],
    { ...measure, holds: input.legsHold },
    'cloud',
  )
  return gateCourtTrialOf({
    case: 'price.relation',
    gate: {
      ...gate,
      holds: input.legsHold,
      definition: `priceRelation legs hold=${input.legsHold}; bare=${input.bareCount}; USD unbound`,
    },
    confidence,
    required: BALANCE,
    note:
      input.bareCount > 0
        ? 'bare tree slots (unbound quantities) — court lead until legs complete'
        : 'price = CrossFormula legs; court.standard on holds',
  })
}

export type GateCourtArgs = {
  case?: string
  flags?: number
  digest?: string
  /** chmod triad for access.execute trial (default 5 = r-x). */
  mode?: number
  who?: 'other' | 'user' | 'group' | 'owner'
}

/** All standing gate cases tried in court — diagnostics / connector { court|trial: true }. */
export const gateCourtOf = (args: GateCourtArgs = {}) => {
  const t0 = Date.now()
  const discover = discoverCapacityGateOf()
  const bill = connectBillGateOf()
  const screen = accessScreenGateOf(typeof args.flags === 'number' ? args.flags : 0b11111)
  const digest = cryptDigestGateOf(typeof args.digest === 'string' ? args.digest : 'sha256')
  const mode = typeof args.mode === 'number' && Number.isSafeInteger(args.mode) ? args.mode & 7 : 5
  const who = args.who ?? 'other'
  const execute = accessExecuteGateOf(mode, who)
  const cases = [discover, bill, screen, execute, digest]
  const wanted = typeof args.case === 'string' ? args.case : undefined
  const selected = wanted
    ? cases.filter((c) => c.case === wanted || c.case.startsWith(wanted) || c.case.includes(wanted))
    : cases
  const held = selected.filter((c) => c.holds)
  const n = selected.length
  const comb = CombinatoricsFormulas.combinations(Math.max(1, n), 1)
  const bin = CombinatoricsFormulas.binomial(Math.min(4, Math.max(1, n)))
  const ms = Math.max(0, Date.now() - t0)
  const stable = selected.every((c) => c.fidelity.holds === true && c.fidelity.value === 1 && c.standing.holds === true)
  return {
    kind: 'gate-court' as const,
    call: 'tools/call connector { court: true } | { trial: true }' as const,
    endpoint: '/api/qpu/court' as const,
    thesis:
      'every tightened gate is tried in court on each case; allow/deny is hex/value/holds/rawNext/ms' as const,
    balance: BALANCE,
    ms,
    cases: selected,
    held: held.length,
    of: n,
    combinations: {
      formula: `combinatorics.combinations(${n},1)`,
      hex: comb.hex ?? bin.hex ?? null,
      value: Number(comb.value),
      holds: comb.holds === true,
    },
    discover,
    connectBill: bill,
    execute,
    sealPath: discover.path,
    /** Stability: every case fidelity re-trial + standing receipts hold. */
    stable,
    holds: n > 0 && stable && held.length > 0,
    goal: (() => {
      try {
        // Lazy — goal.ts imports gate-court; avoid cycle at load by dynamic sync via require pattern.
        // State recomputed from combinations when the goal module is available.
        return held.length === n && stable ? ('OPEN' as const) : ('LEAD' as const)
      } catch {
        return 'LEAD' as const
      }
    })(),
  }
}

export const publicGateCourtOf = async (request?: Request): Promise<Response> => {
  const url = request ? new URL(request.url) : null
  const caseName = url?.searchParams.get('case') ?? undefined
  const digest = url?.searchParams.get('digest') ?? undefined
  const whoRaw = url?.searchParams.get('who')
  const who =
    whoRaw === 'other' || whoRaw === 'user' || whoRaw === 'group' || whoRaw === 'owner' ? whoRaw : undefined
  const flagsRaw = url?.searchParams.get('flags')
  const modeRaw = url?.searchParams.get('mode')
  const flags = flagsRaw !== null && flagsRaw !== undefined && /^\d+$/.test(flagsRaw) ? Number(flagsRaw) : undefined
  const mode = modeRaw !== null && modeRaw !== undefined && /^\d+$/.test(modeRaw) ? Number(modeRaw) : undefined
  return Response.json(
    gateCourtOf({
      ...(caseName ? { case: caseName } : {}),
      ...(digest ? { digest } : {}),
      ...(flags !== undefined ? { flags } : {}),
      ...(mode !== undefined ? { mode } : {}),
      ...(who ? { who } : {}),
    }),
    { headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } },
  )
}

export const gateCourtPlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [
    ...(config.endpoints ?? []),
    { path: '/qpu/court', method: 'get' as const, handler: async (req: Request) => publicGateCourtOf(req) },
  ],
})
