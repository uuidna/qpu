// A published blog post may be deposited on Zenodo (zenodo-rdm). The tenant is the
// OAuth application (oauth2server_client). A user of that application is an
// oauth2server_token whose client_id is the application's. A paid wallet deposits
// with that personal token. A free account deposits with the application's token.
// Names only, never values. The handler does not fetch.

import { qpuHooks } from '../uuid/index.ts'
import { LICENSE } from './unit/license.ts'
import { TENANTS } from './unit/tenants.ts'

const API = 'https://zenodo.org/api/deposit/depositions'
const SOURCE = 'https://github.com/zenodo/zenodo-rdm'

/** Stable Zenodo DOI lineage for this tree (ISO 26324): concept is the parent; each release is a version DOI under it.
 *  Manual deposits that cite a version DOI as isIdenticalTo, or treat a version as the concept, are the gap. */
const ZENODO_DOI = {
  clayConcept: '10.5281/zenodo.21781602',
  unitConcept: '10.5281/zenodo.22700098',
  /** A published version under the unit concept; not the latest and not the concept. */
  unitVersion: '10.5281/zenodo.23156998',
} as const

const DOI_RE = /^10\.\d{4,9}\/\S+$/
const ZENODO_VERSION_DOI_RE = /^10\.5281\/zenodo\.(\d+)$/

type RelatedIn = { identifier: string; relation: string; resource_type?: string; scheme?: string }
type RelatedOut = { identifier: string; relation_type: { id: string }; scheme?: 'doi' | 'url'; resource_type?: { id: string } }

/** DataCite / Zenodo RDM relationType ids stay camelCase (isVersionOf); only the known typo is repaired. */
const relationId = (relation: string) => (relation === 'isOrignialFormOf' ? 'isOriginalFormOf' : relation)

const schemeOf = (identifier: string, hinted?: string): 'doi' | 'url' | undefined => {
  if (hinted === 'doi' || hinted === 'url') return hinted
  if (DOI_RE.test(identifier)) return 'doi'
  if (/^https?:\/\//i.test(identifier)) return 'url'
  return undefined
}

/** Related identifiers for a deposit: URLs keep scheme url; DOIs keep scheme doi; isIdenticalTo of any 10.5281/zenodo.* version DOI is dropped
 *  (that was the manual gap: a version cannot be identical to itself or to another version); conceptdoi is linked once as isVersionOf. */
const doiRelated = (given: readonly RelatedIn[], conceptdoi?: string | null): { related: RelatedOut[]; gaps: string[]; conceptdoi: string | null } => {
  const gaps: string[] = []
  const concept = typeof conceptdoi === 'string' && ZENODO_VERSION_DOI_RE.test(conceptdoi) ? conceptdoi : null
  const related: RelatedOut[] = []
  for (const item of given) {
    const identifier = item.identifier?.trim()
    const relation = relationId((item.relation ?? '').trim())
    if (!identifier || !relation) continue
    if (relation === 'isIdenticalTo' && ZENODO_VERSION_DOI_RE.test(identifier)) {
      gaps.push(`isIdenticalTo ${identifier}: a Zenodo version DOI is never identical-to; use isVersionOf → conceptdoi`)
      continue
    }
    if (relation === 'isVersionOf' && concept && identifier !== concept && ZENODO_VERSION_DOI_RE.test(identifier)) {
      gaps.push(`isVersionOf ${identifier}: parent must be the conceptdoi ${concept}, not a version DOI`)
      continue
    }
    const scheme = schemeOf(identifier, item.scheme)
    related.push({
      identifier,
      relation_type: { id: relation },
      ...(scheme ? { scheme } : {}),
      ...(item.resource_type ? { resource_type: { id: item.resource_type } } : {}),
    })
  }
  if (concept && !related.some((r) => r.relation_type.id === 'isVersionOf' && r.identifier === concept)) {
    related.push({ identifier: concept, scheme: 'doi', relation_type: { id: 'isVersionOf' }, resource_type: { id: 'software' } })
  }
  // one (identifier, relation) pair: drop duplicate isSupplementTo when the same URL is already isDocumentedBy (manual zenodo.json gap)
  const seen = new Set<string>()
  const deduped = related.filter((r) => {
    const key = `${r.relation_type.id}\n${r.identifier}`
    if (seen.has(key)) { gaps.push(`duplicate ${r.relation_type.id} ${r.identifier}`); return false }
    seen.add(key)
    return true
  })
  return { related: deduped, gaps, conceptdoi: concept }
}

/** The legacy deposit routes zenodo-rdm still mounts (site/zenodo_rdm/legacy/resources.py). deposit:write uploads. deposit:actions publishes. */
const ZENODO_ROUTES = [
  { method: 'GET' as const, url: API, does: 'search_user_records', scope: 'deposit:write' as const },
  { method: 'POST' as const, url: API, does: 'create', scope: 'deposit:write' as const },
  { method: 'GET' as const, url: `${API}/<pid>`, does: 'read_draft', scope: 'deposit:write' as const },
  { method: 'PUT' as const, url: `${API}/<pid>`, does: 'update_draft', scope: 'deposit:write' as const },
  { method: 'DELETE' as const, url: `${API}/<pid>`, does: 'delete_draft', scope: 'deposit:write' as const },
  { method: 'POST' as const, url: `${API}/<pid>/actions/publish`, does: 'publish', scope: 'deposit:actions' as const },
  { method: 'POST' as const, url: `${API}/<pid>/actions/edit`, does: 'edit', scope: 'deposit:actions' as const },
  { method: 'POST' as const, url: `${API}/<pid>/actions/discard`, does: 'delete_draft', scope: 'deposit:actions' as const },
  { method: 'POST' as const, url: `${API}/<pid>/actions/newversion`, does: 'new_version', scope: 'deposit:actions' as const },
  { method: 'GET' as const, url: `${API}/<pid>/files`, does: 'files', scope: 'deposit:write' as const },
  { method: 'POST' as const, url: `${API}/<pid>/files`, does: 'files', scope: 'deposit:write' as const },
  { method: 'DELETE' as const, url: `${API}/<pid>/files/<file_id>`, does: 'files', scope: 'deposit:write' as const },
  { method: 'GET' as const, url: `${API}/<pid>/formats`, does: 'extra_formats', scope: 'deposit:write' as const },
  { method: 'PUT' as const, url: `${API}/<pid>/formats`, does: 'extra_formats', scope: 'deposit:write' as const },
  { method: 'DELETE' as const, url: `${API}/<pid>/formats`, does: 'extra_formats', scope: 'deposit:write' as const },
  { method: 'GET' as const, url: 'https://zenodo.org/api/records/<pid>/formats', does: 'extra_formats', scope: 'deposit:write' as const },
  { method: 'GET' as const, url: 'https://zenodo.org/api/files/<bucket>', does: 'files', scope: 'deposit:write' as const },
  { method: 'GET' as const, url: 'https://zenodo.org/api/files/<bucket>/<key>', does: 'files', scope: 'deposit:write' as const },
  { method: 'PUT' as const, url: 'https://zenodo.org/api/files/<bucket>/<key>', does: 'files', scope: 'deposit:write' as const },
  { method: 'DELETE' as const, url: 'https://zenodo.org/api/files/<bucket>/<key>', does: 'files', scope: 'deposit:write' as const },
  { method: 'GET' as const, url: 'https://zenodo.org/metrics/<metric_id>', does: 'metrics', scope: 'deposit:write' as const },
  { method: 'GET' as const, url: 'https://zenodo.org/exporter', does: 'exporter', scope: 'deposit:write' as const },
  { method: 'GET' as const, url: 'https://zenodo.org/exporter/<key>', does: 'exporter', scope: 'deposit:write' as const },
] as const

/** Funder DOIs that zenodo-rdm rewrites to a ROR. An unknown funder keeps its DOI. */
const FUNDERS: Record<string, string> = { '10.13039/501100001665': '00rbzpz17', '10.13039/501100002341': '05k73zm37', '10.13039/501100000923': '05mmh0f86', '10.13039/100018231': '03zj4c476', '10.13039/501100000024': '01gavpb45', '10.13039/501100000780': '00k4n6c32', '10.13039/501100000806': '02k4b9v70', '10.13039/501100001871': '00snfqn58', '10.13039/501100002428': '013tf3c58', '10.13039/501100004488': '03n51vw80', '10.13039/501100004564': '01znas443', '10.13039/501100000925': '011kf5r70', '10.13039/100000002': '01cwqze88', '10.13039/501100000038': '01h531d29', '10.13039/100000001': '021nxhr62', '10.13039/501100003246': '04jsz6e67', '10.13039/501100000690': '001aqnf71', '10.13039/100014013': '001aqnf71', '10.13039/501100001602': '0271asj38', '10.13039/501100001711': '00yjd3n13', '10.13039/100001345': '006cvnv84', '10.13039/501100004410': '04w9kkr77', '10.13039/100004440': '029chgv08', '10.13039/501100006364': '03m8vkq32', '10.13039/501100011730': '00x0z1472' }

/** Every hook Payload declares, in the order qpuHooks pairs them. Zenodo RDM is one of these hooks, not a side door. */
export const ZENODO_HOOKS = (['collection', 'global', 'field', 'node'] as const).flatMap((where) => ((qpuHooks({}).pairs[where] ?? []) as { before?: string; after?: string }[]).flatMap((pair) => [pair.before, pair.after].filter((hook): hook is string => typeof hook === 'string').map((hook) => ({ where, hook }))))

type Outcome = { sent?: boolean; why?: string; act?: string; oauth?: { bound?: boolean; token?: { _scopes?: string } }; request?: { method?: string; url?: string; scope?: string } }

const hookRuns = (where: string, hook: string, result: Outcome, op: 'change' | 'read' | 'delete', sent: boolean, single: boolean): boolean => {
  if (!single) return false
  if (where !== 'collection') return hook === 'beforeDuplicate' ? false : hookRuns('collection', hook, result, op, sent, single)
  if (hook === 'afterError') return result.sent === false
  if (hook === 'afterChange') return op === 'change' && sent
  if (hook === 'afterRead') return (op === 'change' && sent) || op === 'read'
  if (hook === 'afterDelete') return op === 'delete' && sent
  if (hook === 'beforeDelete') return op === 'delete'
  if (hook === 'afterLogin') return result.oauth?.bound === true
  if (hook === 'beforeRead' || hook === 'me' || hook === 'afterMe') return op === 'read'
  if (hook === 'beforeOperation') return true
  if (hook === 'beforeValidate' || hook === 'beforeChange') return op === 'change'
  if (hook === 'afterOperation') return sent
  return false
}

const hookDoes = (where: string, hook: string, result: Outcome) => {
  const scope = result.oauth?.token?._scopes ?? 'deposit:write deposit:actions user:email'
  const text: Record<string, string> = {
    beforeOperation: 'the tenant application and the user token are named before the operation',
    beforeRead: 'the user reads their own deposits',
    beforeValidate: 'access, communities, the title and the file names are checked before the write',
    beforeChange: result.why ?? 'a published post with a file may be deposited; a draft is not',
    afterChange: 'the deposit is created, its file is posted, and then it is published',
    afterRead: 'the loaded record is served: family and given name, the ORCID, the licence and the access',
    beforeDelete: 'the owner may delete a draft; a published record is no longer a draft',
    afterDelete: 'a draft the owner may delete is deleted',
    afterOperation: 'the operation answers with the status Zenodo gave',
    afterError: result.why ?? 'a refusal is recorded and not retried',
    beforeLogin: 'the user token is named before it is bound to the application',
    afterLogin: 'the token is bound when its client id is the application',
    beforeLogout: 'the token leaves the operation',
    afterLogout: 'an anonymous caller is refused',
    me: 'the caller is the owner, a user slug',
    afterMe: 'the owner reads their own deposits',
    refresh: 'the refresh token is a name',
    afterRefresh: 'the access token stays a name',
    afterForgotPassword: `user:email is a scope id on ${scope}. No address is written`,
    beforeDuplicate: 'a duplicated post is a draft and is not deposited',
  }
  const line = text[hook] ?? 'the hook is registered'
  return where === 'global' ? `the tenant application: ${line}` : where === 'field' ? `the deposit fields: ${line}` : where === 'node' ? `the description: ${line}` : line
}

/** The deposit, expressed as every hook Payload declares. Nothing is fetched. */
const hookPlan = (result: Outcome) => {
  const sent = result.sent === true
  const single = result.sent === true || result.sent === false
  const act = result.act
  const op = act === 'delete' ? 'delete' as const : act === 'read' || act === 'files' || act === 'read-file' ? 'read' as const : 'change' as const
  return ZENODO_HOOKS.map(({ where, hook }) => {
    const runs = hookRuns(where, hook, result, op, sent, single)
    const request = runs && where === 'collection' && hook === 'afterChange' && sent ? result.request : runs && where === 'collection' && hook === 'beforeRead' ? { method: 'GET' as const, url: API, scope: 'deposit:write' as const } : runs && where === 'collection' && hook === 'afterDelete' ? result.request : undefined
    return { where, hook, runs, does: hookDoes(where, hook, result), ...(request ? { request } : {}) }
  })
}

/** Zenodo splits one comma into family name and given name. */
const citedName = (author: string) => {
  const text = author.trim()
  if (text.includes(',')) return text
  const parts = text.split(/\s+/).filter((part) => part.length > 0)
  const family = parts[parts.length - 1]
  const given = parts.slice(0, -1).join(' ')
  return family && given ? `${family}, ${given}` : text
}

const slugOf = (tenant: string) => /^[a-z][a-z0-9-]{0,62}$/.test(tenant)

/** The tenant's Zenodo application. Names only. */
export const zenodoApp = (tenant: string) => {
  const T = tenant.toUpperCase().replace(/-/g, '_')
  return {
    tenant,
    kind: 'oauth2server_client' as const,
    names: { clientId: `ZENODO_CLIENT_ID_${T}`, clientSecret: `ZENODO_CLIENT_SECRET_${T}`, token: `ZENODO_TOKEN_${T}` },
    scopes: ['deposit:write', 'deposit:actions'] as const,
  }
}

const COLLECTIONS = ['posts', 'pages', 'products', 'variants'] as const

type Post = { title?: unknown; slug?: unknown; description?: unknown; tenant?: unknown; user?: unknown; collection?: unknown; collections?: unknown; _status?: unknown; status?: unknown; coins?: unknown; price?: unknown; editorial?: unknown; claim?: unknown; files?: unknown; act?: unknown; as?: unknown; record?: unknown; saw?: unknown; access_right?: unknown; embargo_date?: unknown; communities?: unknown; doi?: unknown; conceptdoi?: unknown; license?: unknown; upload_type?: unknown; subjects?: unknown; custom?: unknown; grants?: unknown; contributors?: unknown; thesis_supervisors?: unknown; notes?: unknown; method?: unknown; locations?: unknown; dates?: unknown; references?: unknown; language?: unknown; related_identifiers?: unknown; items?: unknown }

/** Draft access from the legacy deposit tests. A published record is no longer a draft: update and delete answer 404. */
const DRAFT_ACCESS = { read: { owner: 200, other: 403, anonymous: 403, superuser: 403 }, update: { owner: 200, other: 403, anonymous: 403, superuser: 200 }, delete: { owner: 204, other: 403, anonymous: 403, superuser: 204 } } as const

const domainOf = (tenant: string) => {
  const host = Object.entries(TENANTS).find(([, slug]) => slug === tenant)?.[0]
  if (!host) return null
  const labels = host.split('.')
  return labels[0] === 'qpu' && labels.length > 2 ? labels.slice(1).join('.') : host
}

const linksIn = (text: string) => [...text.matchAll(/https?:\/\/[^\s<>"')\]]+/g)].map((match) => match[0].replace(/[.,;)]+$/g, ''))

/** The file names a deposit carries. A name is a key, never the bytes. */
const fileNames = (raw: unknown) => Array.isArray(raw) ? [...new Set(raw.flatMap((item) => { const name = item && typeof item === 'object' && typeof (item as { name?: unknown }).name === 'string' ? (item as { name: string }).name.trim() : ''; return name.length > 0 && !/[\\/]/.test(name) && !name.includes('..') ? [name] : [] }))] : []

const whole = (value: unknown) => typeof value === 'number' && Number.isInteger(value) && value >= 0

/** idutils.normalize_orcid: the URL prefix comes off, the four groups stay. */
const normalizeOrcid = (value: unknown) => {
  if (typeof value !== 'string') return null
  const text = value.trim().replace(/^https?:\/\/orcid\.org\//, '')
  return /^(\d{4}-){3}\d{3}[\dX]$/i.test(text) ? text.replace(/x$/i, 'X') : null
}

type LegacyMetadata = { title: string; description: string; upload_type: 'publication' | 'dataset'; publication_type?: 'article'; creators: { name: string; orcid?: string }[]; license?: string; keywords: readonly string[]; access_right?: string; embargo_date?: string; communities?: { identifier: string }[]; doi?: string; related_identifiers?: { identifier: string; relation: string }[] }

const textAt = (given: Post, key: string) => { const value = (given as Record<string, unknown>)[key]; return typeof value === 'string' && value.trim() && !/@/.test(value) ? value.trim() : '' }

/** clear_none: a group with no text is left out. */
const group = (pairs: [string, string][]) => { const out: Record<string, string> = {}; for (const [key, value] of pairs) if (value) out[key] = value; return Object.keys(out).length ? out : null }

const personOf = (raw: unknown) => {
  if (!raw || typeof raw !== 'object') return null
  const name = textAt(raw as Post, 'name')
  if (!name) return null
  const person: { type: 'personal'; family_name: string; given_name?: string; identifiers?: { scheme: 'orcid'; identifier: string }[] } = { type: 'personal', family_name: name }
  if (name.split(',').length === 2) { const [family, given] = name.split(','); person.family_name = family.trim(); person.given_name = given.trim() }
  const orcid = normalizeOrcid((raw as { orcid?: unknown }).orcid)
  if (orcid) person.identifiers = [{ scheme: 'orcid', identifier: orcid }]
  return { person_or_org: person }
}

/** The rest of MetadataSchema: grants, contributors, notes, places, dates, references, language, related identifiers. */
const loadExtras = (given: Post) => {
  const funding = (Array.isArray(given.grants) ? given.grants : []).flatMap((grant) => {
    if (!grant || typeof grant !== 'object' || typeof (grant as { id?: unknown }).id !== 'string') return []
    let id = (grant as { id: string }).id.trim()
    if (!id) return []
    if (!id.includes('::')) id = `10.13039/501100000780::${id}`
    const cut = id.indexOf('::')
    const funderDoi = id.slice(0, cut)
    const award = id.slice(cut + 2)
    if (!funderDoi || !award) return []
    const funder = FUNDERS[funderDoi] ?? funderDoi
    return [{ funder: { id: funder }, award: { id: `${funder}::${award}`, number: award } }]
  })
  const contributors = [...(Array.isArray(given.thesis_supervisors) ? given.thesis_supervisors.map((item) => ({ item, role: 'supervisor' })) : []), ...(Array.isArray(given.contributors) ? given.contributors.map((item) => ({ item, role: textAt(item as Post, 'type').toLowerCase() })) : [])].flatMap(({ item, role }) => { const person = personOf(item); return person ? [{ ...person, ...(role ? { role: { id: role } } : {}) }] : [] })
  const descriptions = [textAt(given, 'notes') ? { description: textAt(given, 'notes'), type: { id: 'notes' as const } } : null, textAt(given, 'method') ? { description: textAt(given, 'method'), type: { id: 'methods' as const } } : null].filter((item) => item !== null)
  if (Array.isArray(given.dates) && given.dates.some((date) => !date || typeof date !== 'object' || (!textAt(date as Post, 'start') && !textAt(date as Post, 'end')))) return { error: 'Invalid date provided.' as const }
  const dates = (Array.isArray(given.dates) ? given.dates : []).flatMap((date) => { const start = textAt(date as Post, 'start'); const end = textAt(date as Post, 'end'); const value = start && end ? (start === end ? start : `${start}/${end}`) : start || end; const type = textAt(date as Post, 'type').toLowerCase(); const description = textAt(date as Post, 'description'); return [{ date: value, type: { id: type }, ...(description ? { description } : {}) }] })
  if (Array.isArray(given.locations) && given.locations.some((place) => !place || typeof place !== 'object' || !textAt(place as Post, 'place'))) return { error: 'a location names its place' as const }
  const locations = (Array.isArray(given.locations) ? given.locations : []).flatMap((place) => { const row = place as { lat?: unknown; lon?: unknown }; const feature: { place: string; geometry?: { type: 'Point'; coordinates: [number, number] }; description?: string } = { place: textAt(place as Post, 'place') }; if (typeof row.lat === 'number' && typeof row.lon === 'number') feature.geometry = { type: 'Point', coordinates: [row.lon, row.lat] }; const description = textAt(place as Post, 'description'); if (description) feature.description = description; return [feature] })
  const references = (Array.isArray(given.references) ? given.references : []).flatMap((item) => typeof item === 'string' && item.trim() && !/@/.test(item) ? [{ reference: item.trim() }] : [])
  const language = typeof given.language === 'string' ? given.language.trim() : ''
  if (language && language.length !== 3) return { error: 'Language must be either ISO-639-1 or 639-2 compatible.' as const }
  const rawRelated = (Array.isArray(given.related_identifiers) ? given.related_identifiers : []).flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const identifier = textAt(item as Post, 'identifier')
    const relation = textAt(item as Post, 'relation')
    if (!identifier || !relation) return []
    const resource = textAt(item as Post, 'resource_type')
    const scheme = textAt(item as Post, 'scheme')
    return [{ identifier, relation, ...(resource ? { resource_type: resource } : {}), ...(scheme ? { scheme } : {}) }]
  })
  // conceptdoi is explicit, or inferred when the caller already named isVersionOf → a 10.5281/zenodo.* parent
  const namedConcept = typeof given.conceptdoi === 'string' && ZENODO_VERSION_DOI_RE.test(given.conceptdoi) ? given.conceptdoi : null
  const fromRelation = rawRelated.find((r) => relationId(r.relation) === 'isVersionOf' && ZENODO_VERSION_DOI_RE.test(r.identifier))?.identifier ?? null
  const lined = doiRelated(rawRelated, namedConcept ?? fromRelation)
  return { funding, contributors, descriptions, locations, dates, references, languages: language ? [{ id: language.toLowerCase() }] : [], related: lined.related, doiGaps: lined.gaps, conceptdoi: lined.conceptdoi }
}

/** LegacySchema.load_access, load_communities and _pids. A missing access right is open. An owned community is what publish later accepts. */
const loadAccess = (given: Post) => {
  const accessRight = typeof given.access_right === 'string' ? given.access_right : 'open'
  const embargo = typeof given.embargo_date === 'string' && given.embargo_date.trim() ? given.embargo_date.trim() : ''
  const access = accessRight === 'open' ? { record: 'public' as const, files: 'public' as const } : accessRight === 'restricted' || accessRight === 'closed' ? { record: 'public' as const, files: 'restricted' as const } : accessRight === 'embargoed' && embargo ? { record: 'public' as const, files: 'restricted' as const, embargo: { active: true as const, until: embargo } } : null
  if (!access) return { error: 'Unknown access type.' as const }
  const listed = given.communities === undefined ? [] : given.communities
  if (!Array.isArray(listed) || listed.some((item) => !item || typeof item !== 'object' || typeof (item as { identifier?: unknown }).identifier !== 'string' || !(item as { identifier: string }).identifier.trim())) return { error: 'Communities must be an array of objects with an \'identifier\' key.' as const }
  const communities = listed.map((item) => ({ identifier: (item as { identifier: string }).identifier.trim(), owner: (item as { owner?: unknown }).owner === true }))
  // A 10.5281/zenodo.* DOI is minted by Zenodo on publish (or by newversion). Reserving one on create was the manual gap:
  // it treated a version DOI as an external/Datacite PID and skipped the concept lineage. Only non-Zenodo DOIs are reserved.
  const doi = typeof given.doi === 'string' && DOI_RE.test(given.doi) ? given.doi : ''
  const pids = doi && !ZENODO_VERSION_DOI_RE.test(doi) ? { doi: { identifier: doi, provider: 'external' as const } } : null
  const upload = given.upload_type === 'dataset' ? 'dataset' as const : 'publication' as const
  const named = given.license === null ? '' : typeof given.license === 'string' && given.license.trim() ? given.license.trim() : LICENSE.spdx.toLowerCase()
  const license = named || (accessRight === 'open' || accessRight === 'embargoed' ? (upload === 'dataset' ? 'CC0-1.0' : 'CC-BY-4.0') : '')
  const journal = group([['title', textAt(given, 'journal_title')], ['volume', textAt(given, 'journal_volume')], ['issue', textAt(given, 'journal_issue')], ['pages', textAt(given, 'journal_pages')]])
  const meeting = group([['title', textAt(given, 'conference_title')], ['acronym', textAt(given, 'conference_acronym')], ['dates', textAt(given, 'conference_dates')], ['place', textAt(given, 'conference_place')], ['url', textAt(given, 'conference_url')], ['session', textAt(given, 'conference_session')], ['session_part', textAt(given, 'conference_session_part')]])
  const imprint = group([['title', textAt(given, 'partof_title')], ['pages', textAt(given, 'partof_pages')], ['isbn', textAt(given, 'imprint_isbn')], ['place', textAt(given, 'imprint_place')]])
  const university = textAt(given, 'thesis_university')
  const subjects = Array.isArray(given.subjects) ? given.subjects.flatMap((item) => { if (!item || typeof item !== 'object') return []; const row = group([['term', textAt(item as Post, 'term')], ['identifier', textAt(item as Post, 'identifier')], ['scheme', textAt(item as Post, 'scheme')]]); return row ? [row] : [] }) : []
  const custom = given.custom && typeof given.custom === 'object' && !Array.isArray(given.custom) ? group(Object.entries(given.custom as Record<string, unknown>).map(([key, value]) => [key, typeof value === 'string' ? textAt({ [key]: value } as Post, key) : ''])) : null
  const fields = { ...(journal ? { 'journal:journal': journal } : {}), ...(meeting ? { 'meeting:meeting': meeting } : {}), ...(imprint ? { 'imprint:imprint': imprint } : {}), ...(university ? { 'thesis:thesis': { university } } : {}), ...(custom ?? {}), ...(subjects.length ? { 'legacy:subjects': subjects } : {}) }
  const extras = loadExtras(given)
  if ('error' in extras) return extras
  return { access, communities, pids, upload, license, fields, ...extras }
}

/** MetadataSchema in site/zenodo_rdm/legacy/deserializers/metadata.py. One comma splits family and given. cc-by-nc-nd-4.0 maps to itself. */
const loadMetadata = (metadata: LegacyMetadata, extra: { access: { record: 'public'; files: 'public' | 'restricted'; embargo?: { active: true; until: string } }; communities: { identifier: string; owner: boolean }[]; pids: { doi: { identifier: string; provider: 'datacite' | 'external'; client?: 'datacite' } } | null; fields: Record<string, unknown>; funding?: unknown[]; contributors?: unknown[]; descriptions?: unknown[]; locations?: { place: string }[]; dates?: unknown[]; references?: unknown[]; languages?: { id: string }[]; related?: unknown[] }) => {
  const creators = metadata.creators.map((creator) => {
    const person: { type: 'personal'; family_name: string; given_name?: string; identifiers?: { scheme: 'orcid'; identifier: string }[] } = { type: 'personal', family_name: creator.name }
    if (creator.name.split(',').length === 2) {
      const [family, given] = creator.name.split(',')
      person.family_name = family.trim()
      person.given_name = given.trim()
    }
    const orcid = normalizeOrcid(creator.orcid)
    if (orcid) person.identifiers = [{ scheme: 'orcid', identifier: orcid }]
    return { person_or_org: person }
  })
  const subtype = metadata.publication_type
  return {
    title: metadata.title,
    description: metadata.description,
    resource_type: { id: subtype ? `${metadata.upload_type}-${subtype}` : metadata.upload_type },
    creators,
    publisher: 'Zenodo',
    files: { enabled: true as const },
    ...(metadata.license ? { rights: [{ id: metadata.license.toLowerCase() }] } : {}),
    subjects: metadata.keywords.map((subject) => ({ subject })),
    access: extra.access,
    ...(extra.funding?.length ? { funding: extra.funding } : {}),
    ...(extra.contributors?.length ? { contributors: extra.contributors } : {}),
    ...(extra.descriptions?.length ? { additional_descriptions: extra.descriptions } : {}),
    ...(extra.locations?.length ? { locations: { features: extra.locations } } : {}),
    ...(extra.dates?.length ? { dates: extra.dates } : {}),
    ...(extra.references?.length ? { references: extra.references } : {}),
    ...(extra.languages?.length ? { languages: extra.languages } : {}),
    // extras.related already ran doiRelated (camelCase relations, url|doi schemes). Legacy metadata.related_identifiers only fill when extras are empty — never force scheme:doi on URLs.
    ...((extra.related?.length
      ? { related_identifiers: extra.related }
      : metadata.related_identifiers?.length
        ? { related_identifiers: doiRelated(metadata.related_identifiers.map((item) => ({ identifier: item.identifier, relation: item.relation }))).related }
        : {})),
    ...((extra.communities.length || Object.keys(extra.fields).length) ? { custom_fields: { ...extra.fields, ...(extra.communities.length ? { 'legacy:communities': extra.communities.map((community) => community.identifier) } : {}) } } : {}),
    ...(extra.pids ? { pids: extra.pids } : {}),
  }
}

const ROR_TO_DOI: Record<string, string> = { ...Object.fromEntries(Object.entries(FUNDERS).map(([doi, ror]) => [ror, doi])), '001aqnf71': '10.13039/100014013' }

/** LegacySchema.dump: the record Zenodo would answer. A file with no id is left out. The recid is the deposit id, not a number we invent. */
const dumpLegacy = (rdm: { title?: string; access?: { files?: string; embargo?: { active?: boolean } }; resource_type?: { id?: string }; funding?: { funder?: { id?: string }; award?: { number?: string } }[]; additional_descriptions?: { description?: string; type?: { id?: string } }[]; references?: { reference: string }[] }, published: boolean, draft = false) => {
  const files = rdm.access?.files
  const accessRight = rdm.access?.embargo?.active ? 'embargoed' : files === 'public' ? 'open' : files === 'restricted' ? 'restricted' : null
  const type = rdm.resource_type?.id ?? ''
  const upload = type.split('-')[0]
  const subtype = type.includes('-') ? type.slice(type.indexOf('-') + 1) : ''
  const grants = (rdm.funding ?? []).flatMap((item) => { const number = item.award?.number; const funder = item.funder?.id; if (!number || !funder) return []; const funderId = ROR_TO_DOI[funder] ?? funder; return [{ id: `${funderId}::${number}` }] })
  const notes = rdm.additional_descriptions?.find((item) => item.type?.id === 'notes')?.description
  const method = rdm.additional_descriptions?.find((item) => item.type?.id === 'methods')?.description
  // prereserve is the mint placeholder until create returns the deposit id; the version DOI is 10.5281/zenodo.<deposit-id>, never a hand-picked version DOI.
  return { submitted: published, state: published ? draft ? 'inprogress' as const : 'done' as const : 'unsubmitted' as const, files: [] as const, metadata: { ...(rdm.title ? { title: rdm.title } : {}), ...(accessRight ? { access_right: accessRight } : {}), ...(upload ? { upload_type: upload } : {}), ...(subtype ? { [`${upload}_type`]: subtype } : {}), ...(grants.length ? { grants } : {}), ...(notes ? { notes } : {}), ...(method ? { method } : {}), ...(rdm.references?.length ? { references: rdm.references.map((item) => item.reference) } : {}), prereserve_doi: { doi: '10.5281/zenodo.<deposit-id>', via: 'hooks' as const, conceptdoi: ZENODO_DOI.unitConcept } } }
}

const SCOPES = 'deposit:write deposit:actions user:email'

/** The tenant application and the token that calls as it. user:email is a scope id. The token is bound only when its client_id is the application's. */
const oauthOf = (app: ReturnType<typeof zenodoApp>, user: string, paid: boolean) => {
  const mark = (value: string) => value.toUpperCase().replace(/-/g, '_')
  const client = { table: 'oauth2server_client' as const, name: app.tenant, client_id: app.names.clientId, client_secret: app.names.clientSecret, is_confidential: true, is_internal: false, _default_scopes: SCOPES }
  const token = { table: 'oauth2server_token' as const, client_id: app.names.clientId, user, token_type: 'bearer' as const, access_token: paid ? `ZENODO_USER_TOKEN_${mark(app.tenant)}_${mark(user)}` : app.names.token, _scopes: SCOPES, is_personal: paid, is_internal: false }
  return { client, token, bound: token.client_id === client.client_id }
}

/** A published post, or a novel claim, may be deposited. A paid wallet publishes it from the user's Zenodo account and cites the author. A free account publishes it as the tenant domain, and only after every link is editorially verified. */
const deposit = (raw: unknown) => {
  const given = (raw && typeof raw === 'object' ? raw : {}) as Post
  if (Array.isArray(given.items)) { const items = given.items.map((item) => publishPost(item)); return { phase: 'zenodo' as const, source: SOURCE, routes: ZENODO_ROUTES, items, says: `${items.filter((item) => item.sent).length} of ${items.length} deposited` } }
  const claim = given.claim && typeof given.claim === 'object' ? given.claim as { novel?: unknown; statement?: unknown; claimed?: { author?: unknown } } : null
  const tenant = typeof given.tenant === 'string' ? given.tenant : ''
  const statement = claim && typeof claim.statement === 'string' ? claim.statement.trim() : ''
  const title = typeof given.title === 'string' && given.title.trim() ? given.title.trim() : statement
  const status = typeof given._status === 'string' ? given._status : typeof given.status === 'string' ? given.status : claim ? 'published' : 'draft'
  const description = typeof given.description === 'string' && given.description.trim() ? given.description.trim() : title
  const app = slugOf(tenant) ? zenodoApp(tenant) : null
  const author = { name: LICENSE.author, orcid: LICENSE.orcid, cited: citedName(LICENSE.author) }
  const user = typeof given.user === 'string' && slugOf(given.user) ? given.user : 'author'
  const price = whole(given.price) ? given.price : 1
  const coins = whole(given.coins) ? given.coins : 0
  const paid = coins >= price
  const collection = typeof given.collection === 'string' && (COLLECTIONS as readonly string[]).includes(given.collection) ? given.collection : 'posts'
  const base = { phase: 'zenodo' as const, collection, may: false, sent: false, tenant: tenant || null, app, author, account: paid ? 'paid' as const : 'free' as const, coins, price, access: DRAFT_ACCESS }
  if (!app) return { ...base, why: 'a post names its tenant', says: 'a post without a tenant is not deposited' }
  const act = given.act === 'read' || given.act === 'update' || given.act === 'delete' || given.act === 'newversion' ? given.act : null
  const fileAct = given.act === 'files' || given.act === 'sort-files' || given.act === 'add-file' || given.act === 'delete-file' || given.act === 'rename-file' || given.act === 'read-file' ? given.act : null
  if (fileAct) {
    const published = given.record === true
    const key = fileNames(given.files)[0] ?? null
    const auth = { header: 'Authorization' as const, scheme: 'Bearer' as const, secret: `ZENODO_USER_TOKEN_${tenant.toUpperCase().replace(/-/g, '_')}_${user.toUpperCase().replace(/-/g, '_')}` }
    const list = `${API}/<pid>/files`
    const status = fileAct === 'files' ? 200 : fileAct === 'sort-files' || fileAct === 'rename-file' ? 405 : fileAct === 'add-file' ? (published ? 404 : 201) : fileAct === 'delete-file' ? (published ? 403 : 204) : published && key ? 200 : 404
    const method = fileAct === 'files' || fileAct === 'read-file' ? 'GET' as const : fileAct === 'add-file' ? 'POST' as const : fileAct === 'delete-file' ? 'DELETE' as const : 'PUT' as const
    const url = fileAct === 'read-file' ? `https://zenodo.org/api/files/<bucket>/${key ?? '<key>'}` : fileAct === 'rename-file' || fileAct === 'delete-file' ? `${list}/<file_id>` : list
    const allowed = status === 200 || status === 201 || status === 204
    const request = allowed ? { method, url, scope: 'deposit:write' as const, status, auth, ...(key ? { body: { name: key } } : {}) } : null
    return { phase: 'zenodo' as const, act: fileAct, may: allowed, sent: allowed, status, tenant, user, record: published, saw: given.saw === true, ...(request ? { request } : {}), says: allowed ? `the owner may ${fileAct}` : `the owner is refused ${fileAct}` }
  }
  if (act === 'newversion') {
    const files = fileNames(given.files)
    const auth = { header: 'Authorization' as const, scheme: 'Bearer' as const, secret: `ZENODO_USER_TOKEN_${tenant.toUpperCase().replace(/-/g, '_')}_${user.toUpperCase().replace(/-/g, '_')}` }
    if (given.record !== true) return { phase: 'zenodo' as const, act, may: false, sent: false, status: 404, versions: false, tenant, user, record: false, says: 'a draft has no new version' }
    const conceptdoi = typeof given.conceptdoi === 'string' && ZENODO_VERSION_DOI_RE.test(given.conceptdoi) ? given.conceptdoi : ZENODO_DOI.unitConcept
    const lined = doiRelated(Array.isArray(given.related_identifiers) ? (given.related_identifiers as RelatedIn[]) : [], conceptdoi)
    return { phase: 'zenodo' as const, act, may: true, sent: true, status: 201, tenant, user, record: true, conceptdoi, doi: null, related_identifiers: lined.related, doiGaps: lined.gaps, request: { method: 'POST' as const, url: `${API}/<pid>/actions/newversion`, scope: 'deposit:actions' as const, status: 201 as const, auth }, draft: { files: files.map((filename) => ({ filename })), links: ['latest_draft', 'self', 'publish', 'files'] }, says: `the published record opens a new draft under conceptdoi ${conceptdoi}; Zenodo mints the next version DOI on publish` }
  }
  if (act) {
    const who = given.as === 'anonymous' ? 'anonymous' as const : given.as === 'superuser' ? 'superuser' as const : typeof given.as === 'string' && slugOf(given.as) && given.as !== user ? 'other' as const : 'owner' as const
    const status = given.record === true && act !== 'read' ? 404 : DRAFT_ACCESS[act][who]
    const allowed = status === 200 || status === 204
    const method = act === 'read' ? 'GET' as const : act === 'update' ? 'PUT' as const : 'DELETE' as const
    const auth = who === 'owner' ? { header: 'Authorization' as const, scheme: 'Bearer' as const, secret: `ZENODO_USER_TOKEN_${tenant.toUpperCase().replace(/-/g, '_')}_${user.toUpperCase().replace(/-/g, '_')}` } : null
    const request = allowed ? { method, url: `${API}/<pid>`, scope: 'deposit:write' as const, status, ...(auth ? { auth } : { who }) } : null
    return { phase: 'zenodo' as const, act, who, status, may: allowed, sent: allowed, tenant, user, record: given.record === true, ...(request ? { request } : {}), says: allowed ? `the ${who} may ${act} the draft` : `the ${who} is refused` }
  }
  const account = { ...base, oauth: oauthOf(app, user, paid) }
  if (claim && claim.novel !== true) return { ...account, why: 'the claim is not novel', says: 'a claim that is not novel is not deposited' }
  if (status !== 'published') return { ...account, why: 'a draft is not sent', says: 'a draft stays on the site until it is published' }
  if (!title) return { ...account, why: 'a post has a title', says: 'a published post without a title is not deposited' }
  const extra = loadAccess(given)
  if ('error' in extra) return { ...account, why: extra.error, says: extra.error }
  const accepted = extra.communities.filter((community) => community.owner).map((community) => ({ id: community.identifier }))
  // Never put a 10.5281/zenodo.* DOI on the wire: Zenodo mints the version DOI; conceptdoi is carried only as isVersionOf in related_identifiers.
  const wire = { ...(typeof given.access_right === 'string' ? { access_right: given.access_right } : {}), ...(extra.access.embargo ? { embargo_date: extra.access.embargo.until } : {}), ...(extra.communities.length ? { communities: extra.communities.map((community) => ({ identifier: community.identifier })) } : {}), ...(extra.pids ? { doi: extra.pids.doi.identifier } : {}) }
  const doiGaps = (extra as { doiGaps?: string[] }).doiGaps ?? []
  const conceptdoi = (extra as { conceptdoi?: string | null }).conceptdoi ?? null
  const links = [...new Set(linksIn(`${title}\n${description}\n${statement}`))]
  const files = fileNames(given.files)
  const editorial = given.editorial && typeof given.editorial === 'object' && !Array.isArray(given.editorial) ? given.editorial as Record<string, unknown> : {}
  const verified = links.filter((url) => editorial[url] === true)
  if (paid) {
    if (files.length === 0) return { ...account, why: 'a deposit carries a file', says: 'the deposit is created, a file is posted, and only then is it published' }
    const auth = { header: 'Authorization' as const, scheme: 'Bearer' as const, secret: account.oauth.token.access_token }
    const metadata = { title, upload_type: extra.upload, ...(extra.upload === 'publication' ? { publication_type: 'article' as const } : {}), description, creators: [{ name: author.cited, orcid: author.orcid }], ...(extra.license ? { license: extra.license } : {}), keywords: ['blog'] as const, ...wire }
    const rdm = loadMetadata(metadata, extra)
    const request = { id: 'zenodo-deposit' as const, method: 'POST' as const, url: API, accept: 'application/json' as const, scope: 'deposit:write' as const, status: 201 as const, auth, body: { metadata, rdm } }
    const uploaded = files.map((name) => ({ id: 'zenodo-file' as const, method: 'POST' as const, url: `${API}/<id>/files`, accept: 'application/json' as const, scope: 'deposit:write' as const, status: 201 as const, auth, body: { name } }))
    const publish = { id: 'zenodo-publish' as const, method: 'POST' as const, url: `${API}/<id>/actions/publish`, accept: 'application/json' as const, scope: 'deposit:actions' as const, status: 202 as const, auth, note: 'the record id is the deposit id. A second publish is not sent', ...(extra.communities.length ? { record: { communities: accepted }, cleared: true as const } : {}) }
    return { ...account, may: true, sent: true, user, files, conceptdoi, doiGaps, related_identifiers: (extra as { related?: RelatedOut[] }).related ?? [], request, flow: [request, ...uploaded, publish], publish, legacy: dumpLegacy(rdm, true), says: `the published post is deposited with ${auth.secret} and cites ${author.name}` }
  }
  const domain = domainOf(tenant)
  if (!domain) return { ...account, links, verified: verified.length, why: 'the tenant names its domain', says: 'a free account is authored by the tenant domain' }
  if (verified.length !== links.length) return { ...account, domain, links, verified: verified.length, why: 'every link is editorially verified', says: 'a free account waits until every link is verified' }
  if (files.length === 0) return { ...account, domain, links, verified: verified.length, why: 'a deposit carries a file', says: 'the deposit is created, a file is posted, and only then is it published' }
  const auth = { header: 'Authorization' as const, scheme: 'Bearer' as const, secret: account.oauth.token.access_token }
  const metadata = { title, upload_type: extra.upload, ...(extra.upload === 'publication' ? { publication_type: 'article' as const } : {}), description, creators: [{ name: domain }], ...(extra.license ? { license: extra.license } : {}), keywords: ['blog'] as const, ...wire }
  const rdm = loadMetadata(metadata, extra)
  const request = { id: 'zenodo-deposit' as const, method: 'POST' as const, url: API, accept: 'application/json' as const, scope: 'deposit:write' as const, status: 201 as const, auth, body: { metadata, rdm } }
  const uploaded = files.map((name) => ({ id: 'zenodo-file' as const, method: 'POST' as const, url: `${API}/<id>/files`, accept: 'application/json' as const, scope: 'deposit:write' as const, status: 201 as const, auth, body: { name } }))
  const publish = { id: 'zenodo-publish' as const, method: 'POST' as const, url: `${API}/<id>/actions/publish`, accept: 'application/json' as const, scope: 'deposit:actions' as const, status: 202 as const, auth, note: 'the record id is the deposit id. A second publish is not sent', ...(extra.communities.length ? { record: { communities: accepted }, cleared: true as const } : {}) }
  return { ...account, may: true, sent: true, domain, links, verified: verified.length, files, conceptdoi, doiGaps, related_identifiers: (extra as { related?: RelatedOut[] }).related ?? [], request, flow: [request, ...uploaded, publish], publish, legacy: dumpLegacy(rdm, true), says: `the free account deposits the post as ${domain}` }
}

const ASPECTS = ['collection', 'global', 'field', 'node'] as const

/** The deposit runs through every hook Payload declares, and through every aspect those hooks belong to. A published page, product or variant is deposited the same way as a post. */
export const publishPost = (raw: unknown) => {
  const given = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw as Post : {}
  if (given.collections === true && !Array.isArray(given.items)) {
    const { collections: _dropped, ...rest } = given
    return publishPost({ ...rest, items: COLLECTIONS.map((collection) => ({ ...rest, collection })) })
  }
  const result = deposit(raw) as Outcome & { request?: Outcome['request']; app?: unknown; links?: unknown }
  const hooks = hookPlan(result)
  const aspects = ASPECTS.map((aspect) => {
    const list = hooks.filter((hook) => hook.where === aspect)
    return { aspect, hooks: list.length, runs: list.filter((hook) => hook.runs).map((hook) => hook.hook), ...(aspect === 'collection' && result.request ? { request: result.request } : {}), ...(aspect === 'global' && result.app ? { app: result.app } : {}), ...(aspect === 'field' ? { fields: ['title', 'creators', 'license', 'files', 'doi', 'access_right'] as const } : {}), ...(aspect === 'node' ? { node: 'description' as const, ...(result.links ? { links: result.links } : {}) } : {}) }
  })
  return { ...result, via: 'hooks' as const, hooks, aspects, declared: hooks.length, all: aspects.length === 4 && aspects.reduce((n, aspect) => n + aspect.hooks, 0) === hooks.length }
}
