// References between documents, so a tree of pages that run each other never cycles: every reference a document makes to another (a lexical
// link to an internal path, a relationship node, a qpu block whose arguments name a document by id, uuid or slug, a Markdown link to a path)
// read into one graph; its cycles found by Tarjan's strongly connected components, iteratively so no depth overflows the stack; the dangling
// references named. Whatever collides is fused, never refused: every strongly connected component is one node of the condensation, its members
// in address order, and the condensation is always acyclic, so it always has an order. Pure: the client hands the documents over.
import { uuidOf } from './blocks.ts'
export type RefDoc = { id: string; slug?: string; doc?: unknown; markdown?: string }
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
/** The internal targets a path names: /slug or /<uuid>, its query and fragment dropped; an absolute URL is not internal. */
const internalTargetOf = (url: string): string | null => { const u = url.trim(); if (!u.startsWith('/') || u.startsWith('//')) return null; const p = u.split(/[?#]/)[0]!.replace(/\/+$/, '').split('/').filter(Boolean).pop(); return p ? decodeURIComponent(p) : null }
/** Every reference one document makes, as the names it gives (slugs, ids, uuids). */
export const referencesOf = (d: RefDoc): string[] => {
  const out: string[] = []
  const walk = (n: unknown) => { const stack = [n]; while (stack.length) { const x = stack.pop(); if (!x || typeof x !== 'object') continue; const o = x as { type?: string; url?: string; fields?: { url?: string; blockType?: string; arguments?: Record<string, unknown>; doc?: unknown }; value?: unknown; relationTo?: string; children?: unknown[] }
    const url = o.fields?.url ?? o.url
    if ((o.type === 'link' || o.type === 'autolink') && typeof url === 'string') { const t = internalTargetOf(url); if (t) out.push(t) }
    if (o.type === 'relationship') { const v = o.value as { id?: unknown } | string | undefined; const id = typeof v === 'string' ? v : v?.id; if (typeof id === 'string') out.push(id) }
    if (o.type === 'block' && o.fields?.blockType === 'qpu' && o.fields.arguments) for (const k of ['id', 'uuid', 'slug'] as const) { const v = o.fields.arguments[k]; if (typeof v === 'string' && v) out.push(v) }
    for (const c of o.children ?? []) stack.push(c) } }
  if (d.doc) walk((d.doc as { root?: unknown }).root ?? d.doc)
  if (typeof d.markdown === 'string') for (const m of d.markdown.matchAll(/\]\((\/[^)\s]*)\)/g)) { const t = internalTargetOf(m[1]!); if (t) out.push(t) }
  return out
}
/** The graph, its cycles and its order. */
export const referenceGraphOf = (docs: readonly RefDoc[]) => {
  const byName = new Map<string, string>(); for (const d of docs) { byName.set(d.id, d.id); if (d.slug) byName.set(d.slug, d.id) }
  const edges: { from: string; to: string }[] = [], dangling: { from: string; name: string }[] = []
  for (const d of docs) for (const name of referencesOf(d)) { const to = byName.get(name) ?? (UUID.test(name) ? byName.get(name.toLowerCase()) : undefined); if (to) edges.push({ from: d.id, to }); else dangling.push({ from: d.id, name }) }
  const ids = docs.map((d) => d.id), next = new Map<string, string[]>(ids.map((i) => [i, []])); for (const e of edges) next.get(e.from)!.push(e.to)
  // Tarjan, iterative: index, lowlink, a stack, and an explicit call stack of (node, next child position)
  let index = 0; const idx = new Map<string, number>(), low = new Map<string, number>(), on = new Set<string>(), st: string[] = [], sccs: string[][] = []
  for (const s of ids) { if (idx.has(s)) continue; const call: [string, number][] = [[s, 0]]; idx.set(s, index); low.set(s, index); index++; st.push(s); on.add(s)
    while (call.length) { const top = call[call.length - 1]!; const [v, i] = top; const ws = next.get(v)!
      if (i < ws.length) { top[1] = i + 1; const w = ws[i]!; if (!idx.has(w)) { idx.set(w, index); low.set(w, index); index++; st.push(w); on.add(w); call.push([w, 0]) } else if (on.has(w)) low.set(v, Math.min(low.get(v)!, idx.get(w)!)) }
      else { call.pop(); if (call.length) { const u = call[call.length - 1]![0]; low.set(u, Math.min(low.get(u)!, low.get(v)!)) } if (low.get(v) === idx.get(v)) { const c: string[] = []; let w: string; do { w = st.pop()!; on.delete(w); c.push(w) } while (w !== v); sccs.push(c.reverse()) } } } }
  const cycles = sccs.filter((c) => c.length > 1 || edges.some((e) => e.from === c[0] && e.to === c[0]))
  // the condensation: each component fused into one node, its members in address order; Tarjan emits components in reverse topological order,
  // so reversed, a node comes before every node it references — the condensation never has a cycle, so this order always exists
  const byAddress = (a: string, b: string) => (uuidOf(a) < uuidOf(b) ? -1 : uuidOf(a) > uuidOf(b) ? 1 : 0)
  const fused = sccs.map((c) => { const members = [...c].sort(byAddress); return { id: members.length > 1 ? uuidOf(JSON.stringify(members)) : members[0]!, members, fused: members.length > 1 || edges.some((e) => e.from === members[0] && e.to === members[0]) } })
  const nodeOf = new Map<string, string>(); for (const f of fused) for (const m of f.members) nodeOf.set(m, f.id)
  const condensedEdges = [...new Set(edges.map((e) => [nodeOf.get(e.from)!, nodeOf.get(e.to)!]).filter(([a, b]) => a !== b).map((p) => p.join('→')))].map((p) => { const [from, to] = p.split('→') as [string, string]; return { from, to } })
  const condensation = { nodes: fused, edges: condensedEdges, order: [...fused].reverse().map((f) => f.id), acyclic: true as const }
  return { nodes: ids.length, edges, cycles, dangling, acyclic: cycles.length === 0, order: cycles.length ? null : condensation.order, condensation, says: `${ids.length} document(s), ${edges.length} reference(s): ${cycles.length ? `${cycles.length} cycle(s) fused into one node each (${cycles.map((c) => c.join(' ↔ ')).join('; ')})` : 'no cycle'}; the condensation of ${fused.length} node(s) is acyclic and ordered${dangling.length ? `; ${dangling.length} dangling reference(s) noted` : ''}`, theorem: 'textbook_references_acyclic' }
}
