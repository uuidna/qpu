// Institutions as tenants of the textbook: an education, a nonprofit or a business opens Google Workspace's MCP servers with its own
// OAuth client, and every record those doors answer lands in the RAID as a docket entry created through the Payload MCP (createEntries) —
// no collection added, no provider named in the code that walks it. The editions and their prices are as Google's pages state them
// (read 2026-10-26, sources beside each row); a price Google does not publish is null and says so. The textbook is the education tool:
// every closed equation the kernel accepted becomes a Classroom question whose answer the kernel decided, and an answer is graded by
// recomputing the equation, never by a key typed by hand. Pure: the client (the institution's MCP session) performs every call.
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { uuidOf, compositionsOf, compositionOf, compositionIndexOf, presentationOf } from './unit/blocks.ts'
import { TABLES } from './tables-index.ts'

/** Google Workspace's MCP servers (developers.google.com/workspace/guides/configure-mcp-servers, read 2026-10-26): Developer Preview,
 *  OAuth 2.0 with a web client marked for an AI-powered agent; each lands in the docket, rendered by the collection named beside it. */
export const WORKSPACE_MCP = TABLES.WORKSPACE_MCP as readonly { product: string; host: string; url: string; enable: readonly string[]; scopes: readonly string[]; renders: string }[]
const WORKSPACE_SCOPE_PREFIX = 'https://www.googleapis.com/auth/'
/** A call of the Payload MCP plugin's create tool for a collection: the document's own fields are its arguments (the plugin reads the collection's schema). */
export const createCreateCall = (collection: string, data: Record<string, unknown>) => ({ tool: `create${collection[0]!.toUpperCase()}${collection.slice(1).replace(/-(\w)/g, (_m, c: string) => c.toUpperCase())}`, arguments: data })

/** The editions an institution holds, as Google states them (prices in cents per user per month; null where Google publishes none). */
type Edition = { id: string; family: 'education' | 'nonprofit' | 'workspace'; name: string; cents: number | null; flexibleCents?: number | null; introCents?: number | null; currency: 'USD' | 'EUR'; cap: number | null; needs?: string; adds: string; source: string }
const EDITIONS = TABLES.EDITIONS as readonly Edition[]

// Lean's natural-number arithmetic for a closed expression: + − (truncated) * / (floor) % ^ and parentheses; anything else is not closed
const getNat = (src: string): number | null => {
  const s = src.replace(/\s+/g, ''); let i = 0
  const num = (): number | null => { if (s[i] === '(') { i++; const v = add(); if (s[i] !== ')') return null; i++; return v } const m = /^\d+/.exec(s.slice(i)); if (!m) return null; i += m[0].length; return Number(m[0]) }
  const pow = (): number | null => { const b = num(); if (b === null) return null; if (s[i] === '^') { i++; const e = pow(); return e === null ? null : b ** e } return b }
  const mul = (): number | null => { let v = pow(); while (v !== null && (s[i] === '*' || s[i] === '/' || s[i] === '%')) { const op = s[i++]; const r = pow(); if (r === null) return null; v = op === '*' ? v * r : r === 0 ? 0 : op === '/' ? Math.floor(v / r) : v % r } return v }
  const add = (): number | null => { let v = mul(); while (v !== null && (s[i] === '+' || s[i] === '-')) { const op = s[i++]; const r = mul(); if (r === null) return null; v = op === '+' ? v + r : Math.max(0, v - r) } return v }
  const v = add(); return v !== null && i === s.length && Number.isSafeInteger(v) ? v : null
}
/** The textbook's closed equations: a theorem `name : <closed expression> = <n> := by decide` is a question whose answer the kernel decided. */
const listQuestions = () => TEXTBOOK_THEOREMS.flatMap((t) => { const m = /^theorem\s+(\S+)\s*:\s*(.+?)\s*=\s*(\d+)\s*:=\s*by decide$/.exec(t.lean); if (!m) return []; const v = getNat(m[2]!); return v === null ? [] : [{ theorem: t.key, ask: `${m[2]} = ?`, answer: Number(m[3]), recomputed: v, says: t.says }] })

type InstitutionRequest = { /** the tenant (its id) every page and entry is assigned to: tenant-scoped collections refuse a record without one */ tenant?: string; sets?: boolean; set?: { index?: number | string; family?: string; doors?: Record<string, string> }; edition?: string; users?: number; theorems?: string[]; course?: string; answers?: { theorem: string; answer: number | string }[] }
/** An institution's whole plan: its edition and bill under the cap, the Workspace doors it opens and how each lands, the textbook's
 *  questions as Classroom coursework, every record as a docket entry through the Payload MCP, answers graded by recomputation, and the
 *  acts that are the institution's own. */
export const planInstitution = (r: InstitutionRequest) => {
  const e = EDITIONS.find((x) => x.id === r.edition)
  if (!e) return { editions: EDITIONS.map((x) => ({ id: x.id, family: x.family, name: x.name, perUserMonth: x.cents === null ? null : x.cents / 100, currency: x.currency, cap: x.cap, source: x.source })), families: [...new Set(EDITIONS.map((x) => x.family))], doors: WORKSPACE_MCP.length, says: 'name an edition: every edition Google states for education, nonprofits and Workspace, priced per user per month where Google publishes a price', theorem: 'textbook_institution_bill' }
  const users = Math.max(1, Math.floor(r.users ?? 1))
  const within = e.cap === null || users <= e.cap
  const bill = e.cents === null ? null : { perMonth: (users * e.cents) / 100, perYear: (users * e.cents * 12) / 100, atCap: e.cap === null ? null : (e.cap * e.cents) / 100, currency: e.currency, flexiblePerMonth: e.flexibleCents ? (users * e.flexibleCents) / 100 : null, introductoryPerMonth: e.introCents ? (Math.min(users, 20) * e.introCents + Math.max(0, users - 20) * e.cents) / 100 : null }
  const all = listQuestions(); const chosen = r.theorems?.length ? all.filter((q) => r.theorems!.includes(q.theorem)) : all
  const course = r.course ?? '{courseId}'
  const coursework = chosen.map((q) => { const body = { title: q.theorem.replace(/^textbook_/, '').replace(/_/g, ' '), description: `${q.says}\n\n${q.ask}`, workType: 'SHORT_ANSWER_QUESTION', state: 'DRAFT', maxPoints: 1 }; return { theorem: q.theorem, ask: q.ask, rest: { method: 'POST', url: `https://classroom.googleapis.com/v1/courses/${course}/courseWork`, body }, entry: createCreateCall('entries', { kind: 'document', from: 'classroom', body: { kind: 'coursework', theorem: q.theorem, ask: q.ask, course } }) } })
  const graded = (r.answers ?? []).map((a) => { const q = all.find((x) => x.theorem === a.theorem); const given = Number(a.answer); return { theorem: a.theorem, given: a.answer, correct: q ? given === q.answer && q.answer === q.recomputed : null, by: q ? 'recomputed from the kernel-accepted equation' : 'no closed equation of that name' } })
  const doors = WORKSPACE_MCP.map((d) => ({ product: d.product, url: d.url, enable: d.enable, scopes: d.scopes.map((s) => WORKSPACE_SCOPE_PREFIX + s), renders: d.renders, lands: createCreateCall('entries', { kind: 'document', from: d.product.toLowerCase(), body: '<the record the door answered>' }) }))
  const acts = [
    ...(e.needs ? [`${e.needs} (${e.source})`] : []),
    'join the Google Workspace Developer Preview Program: every Workspace MCP server is in Developer Preview',
    'create a Web application OAuth client marked for an AI-powered agent, with the MCP client\'s redirect URI; access_type=offline for a refresh token',
    'enable each MCP service and its base API in the Google Cloud project, and allow them under Security > API Controls in the Admin console',
    'publish the coursework drafts in Classroom: a teacher\'s act',
  ]
  const content = JSON.stringify({ edition: e.id, users, coursework: coursework.map((c) => c.theorem) })
  return { id: uuidOf(content), edition: { id: e.id, family: e.family, name: e.name, needs: e.needs ?? null, adds: e.adds, source: e.source }, users, within, cap: e.cap, bill, doors, coursework, questions: all.length, graded, tenant: { settings: { institution: { edition: e.id, users } } }, acts, payloadMcp: 'every door\'s records and every coursework land through the Payload MCP plugin as createEntries calls (the docket, the RAID); the plugin serves this door as the textbook tool', says: `${e.name} for ${users} user(s): ${within ? 'within' : 'beyond'} the cap${e.cap === null ? ' (none)' : ` of ${e.cap}`}; ${bill ? `${bill.perMonth} ${bill.currency} a month` : 'no published price'}; ${doors.length} Workspace doors; ${coursework.length} textbook question(s) as Classroom coursework`, theorems: ['textbook_institution_bill', 'textbook_integrations_are_thirty_five'] }
}

// ── Sets of use cases: every institution family by every door off, read or write ─────────────────────────────────────────────────
// A set is a composition in mixed radix: one digit per Workspace door (off, read, or write where the door has a write scope), the family
// before them. Its scopes are least privilege (read scopes for a read, read and write scopes for a write), its role the tenant role it
// needs (a write needs a writer), its records land in the docket through the Payload MCP, and its page is a qpu block the admin edits,
// rendered by the shadcn items its own address picks. Any of the space is addressable by its index; the singles are named.

export const SET_FAMILIES = ['education', 'nonprofit', 'workspace'] as const
type SetFamily = (typeof SET_FAMILIES)[number]
const WHO = TABLES.WHO as unknown as Readonly<Record<SetFamily, { people: string; group: string; outside: string; leader: string }>>
const isRead = (s: string) => /readonly|freebusy|readstate|userinfo/.test(s)
const listModes = (d: (typeof WORKSPACE_MCP)[number]) => (d.scopes.some((s) => !isRead(s)) ? (['off', 'read', 'write'] as const) : (['off', 'read'] as const))
export const SET_RADICES: readonly number[] = [SET_FAMILIES.length, ...WORKSPACE_MCP.map((d) => listModes(d).length)]
const ACTION = TABLES.ACTION as Readonly<Record<string, { read: string; write: string }>>
const fill = (s: string, f: SetFamily) => s.replace(/\{(\w+)\}/g, (_m, k: string) => WHO[f][k as keyof (typeof WHO)[SetFamily]])
export const SET_SPACE = compositionsOf(SET_RADICES)
/** One set: by its index in the space, or by its family and the mode of each door it names. */
export const createFamilySet = (p: { index?: number | string; family?: string; doors?: Record<string, string> }) => {
  let digits: number[]
  if (p.index !== undefined) { const i = BigInt(p.index); if (i < 0n || i >= SET_SPACE) throw new Error(`a set index is below ${SET_SPACE}`); digits = compositionOf(SET_RADICES, i) }
  else {
    const f = SET_FAMILIES.indexOf(p.family as SetFamily); if (f < 0) throw new Error(`a family is one of ${SET_FAMILIES.join(', ')}`)
    digits = [f, ...WORKSPACE_MCP.map((d) => { const m = p.doors?.[d.product] ?? 'off'; const k = (listModes(d) as readonly string[]).indexOf(m); if (k < 0) throw new Error(`${d.product} is ${listModes(d).join(' or ')}`); return k })]
  }
  const family = SET_FAMILIES[digits[0]!]!
  const doors = WORKSPACE_MCP.map((d, i) => ({ d, mode: listModes(d)[digits[i + 1]!]! })).filter((x) => x.mode !== 'off')
  const scopes = [...new Set(doors.flatMap(({ d, mode }) => d.scopes.filter((s) => mode === 'write' || isRead(s))))].map((s) => WORKSPACE_SCOPE_PREFIX + s)
  const role = doors.some((x) => x.mode === 'write') ? 'writer' : 'reader'
  const index = compositionIndexOf(SET_RADICES, digits)
  const id = uuidOf(JSON.stringify({ set: 'workspace', digits }))
  const uses = doors.map(({ d, mode }) => `${d.product}: ${fill(ACTION[d.product]![mode as 'read' | 'write'], family)}`)
  const title = doors.length ? `${family[0]!.toUpperCase()}${family.slice(1)}: ${doors.map(({ d, mode }) => `${d.product} ${mode}`).join(', ')}` : `${family[0]!.toUpperCase()}${family.slice(1)}: no door`
  return { id, index: index.toString(), family, doors: doors.map(({ d, mode }) => ({ product: d.product, mode, url: d.url })), scopes, role, uses, title, editions: EDITIONS.filter((e) => e.family === family).map((e) => e.id), lands: doors.map(({ d }) => createCreateCall('entries', { kind: 'document', from: d.product.toLowerCase(), body: '<the record the door answered>' })), ui: presentationOf(id.replace(/-/g, '')).layout, theorem: 'textbook_workspace_sets' }
}
/** The space and its named singles: every family with one door in one mode. */
export const listFamilySets = () => {
  const singles = SET_FAMILIES.flatMap((family) => WORKSPACE_MCP.flatMap((d) => listModes(d).filter((m) => m !== 'off').map((m) => createFamilySet({ family, doors: { [d.product]: m } }))))
  return { space: SET_SPACE.toString(), radices: SET_RADICES, perFamily: (SET_SPACE / BigInt(SET_FAMILIES.length)).toString(), families: SET_FAMILIES, singles, says: `every family by every door off, read or write: ${SET_SPACE} sets, each addressable by its index; ${singles.length} named singles`, theorem: 'textbook_workspace_sets' }
}
