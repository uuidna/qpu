// Every quantum standard against every other, as website pages seeds.
// One equivalence check supplies the rows. Each unordered pair is one pages document.
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { verifyIsoQuantumEquivalence } from '../../../../../../../../0/1/7/0/5/2/4/8/index.ts'
import { pageSeed } from '../../../../../../../../3/9/4/0/5/6/c/e/index.ts'
import { uuid } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import { quantumStandardLeads } from '../../../../../../../../d/f/0/d/9/1/3/b/index.ts'

type Row = { id: string; name: string; holds: boolean }

const rows = (eq: ReturnType<typeof verifyIsoQuantumEquivalence>): Row[] => {
  const rows: Row[] = []
  const seen = new Set<string>()
  const add = (id: string, name: string, holds: boolean) => {
    const key = id.trim()
    if (!key || seen.has(key)) return
    seen.add(key)
    rows.push({ id: key, name: name.trim() || key, holds })
  }
  add('ISO/IEC 4879:2024', PROSE.quantumProcessingStandardsE2e_s1, eq.bijective)
  for (const p of eq.noLessPostulates) add(p.id, p.isoClause, p.holds)
  for (const g of eq.noMoreGuards) add(g.id, g.isoClause, g.holds)
  for (const l of eq.isoBlockchainLayers) add(l.standard, `${l.standard}. ${l.title}`, l.holds)
  for (const v of eq.vocabulary) add(v.clause, `${v.clause} ${v.name}`, v.holds)
  for (const name of eq.companionStandards) add(name, name, eq.bijective)
  return rows
}

/** Pairwise comparison of the quantum standards. Each pair is a pages seed. */
export const standardsSeeds = () => {
  const eq = verifyIsoQuantumEquivalence()
  const listed = rows(eq)
  const slugs = new Set<string>()
  const docs: ReturnType<typeof pageSeed>[] = []
  let agree = 0
  for (let i = 0; i < listed.length; i++) {
    for (let j = i + 1; j < listed.length; j++) {
      const a = listed[i]!
      const b = listed[j]!
      const same = a.holds === b.holds
      if (same) agree += 1
      const title = `${a.id} against ${b.id}`
      const text = [`${a.name}. Holds: ${a.holds}.`, `${b.name}. Holds: ${b.holds}.`, same ? 'The two standards agree.' : 'The two standards disagree.'].join('\n')
      let page = pageSeed(title, text, uuid(`standards\n${a.id}\n${b.id}`))
      if (slugs.has(page.slug)) {
        const slug = `${page.slug}-${page.id.slice(0, 8)}`
        page = { ...page, slug, breadcrumbs: [{ doc: page.id, url: `/${slug}`, label: page.title }] }
      }
      slugs.add(page.slug)
      docs.push(page)
    }
  }
  const pairs = (listed.length * (listed.length - 1)) / 2
  const leads = quantumStandardLeads()
  const leadDocs = leads.map((l) => pageSeed(l.title, l.statement, uuid(`lead\n${l.id}`)))
  return {
    phase: 'seed' as const,
    via: 'e2e' as const,
    collection: 'pages' as const,
    schema: 'pages' as const,
    slot: 'content' as const,
    standard: eq.standard,
    bijective: eq.bijective,
    standards: listed.length,
    pairs,
    agree,
    disagree: pairs - agree,
    count: docs.length,
    docs,
    leads: leads.map((l, i) => ({ id: l.id, status: l.status, tool: l.tool, statement: l.statement, slug: leadDocs[i]!.slug, url: `/${leadDocs[i]!.slug}` })),
    leadDocs,
    says: proseFill(PROSE.quantumProcessingStandardsE2e_says2, leads.length, docs.length),
  }
}
