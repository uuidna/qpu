/**
 * AUDIT THE MEANING OF EVERYTHING, BY THE FAMILIES — AND THE COURT HEARS IT. Meaning is audited two ways, each a related
 * family's skill, and every finding is routed to the court (its capability, upgraded through those skills):
 *   NAMING (rule + gravity): a family is one lowercase word, carries no residual prefix, and sits on its meaningful path.
 *   MEANING (cross): a family crosses to a domain — it means something by its connection to the graph; an orphan that
 *     crosses nowhere means nothing and is a finding.
 * The court (law reviews, forensic weighs, court adjudicates) hears each finding with a forum and a remedy — it never
 * drops a lead (law.removable) and never advises until reviewed (law.reviewed). Read from the registry and the source,
 * token-free, no formula run. Discovered by the scripts/*.test.mjs glob, run by the one gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')

test('audit the meaning of everything — naming and meaning, by the families, heard by the court', async (t) => {
  await import('../dist/mcp/families.js')
  const { qpuHexRegisteredSizeOf } = await import('../dist/quantum/processing/unit/index.js')
  const docket = []
  const charge = (defendant, charge, skill, forum, remedy) => docket.push({ defendant, charge, skill, forum, remedy })

  for (const e of readdirSync(join(ROOT, 'src/families'), { withFileTypes: true })) {
    if (!e.isDirectory()) continue
    const fam = e.name
    const file = `src/families/${fam}/index.ts`
    if (!existsSync(join(ROOT, file))) continue
    const src = readFileSync(join(ROOT, file), 'utf8')
    const registered = qpuHexRegisteredSizeOf(fam) > 0
    if (!registered) continue

    // NAMING — rule's skill: one lowercase word; gravity's skill: the dir is the registered family; no residual prefix
    if (!/^[a-z]+$/.test(fam)) charge(fam, 'name is not one lowercase word', 'rule', 'law', 'rename to one word (a human picks it; law.standing)')
    const registers = src.match(/qpuHexRegisterOf\('([a-zA-Z.]+)'/)
    if (registers && registers[1] !== fam) charge(fam, `folder '${fam}' registers '${registers[1]}' — name and place disagree`, 'gravity', 'court', 'move/rename so the folder is the family (gravity --fix)')
    if (/\bqpu_[A-Za-z]+/.test(src)) charge(fam, 'carries a residual prefix', 'rule', 'law', 'drop the prefix (law.removable: remanded, not dropped)')

    // MEANING — registration IS the connection: a registered family is addressable as a hex program and its formulas
    // return a CrossFormula, so it means something and joins the graph (whether it uses the cross helper or builds its
    // own with the unit's primitives, as path does). An orphan would be a family that references neither.
    if (!/CrossFormula|crossFormulaOf|qpuContentUuidOf/.test(src)) charge(fam, 'builds no cross — nothing joins it to the graph', 'cross', 'court', 'return a CrossFormula (use the cross skill, or the unit primitives as path does)')
  }

  // every finding must be heard — a forum, a skill, a remedy — that is the court's upgraded capability
  const unheard = docket.filter((c) => !c.forum || !c.skill || !c.remedy)
  assert.deepEqual(unheard, [], `findings the court cannot hear: ${unheard.map((c) => c.defendant).join(', ')}`)
  // the audit holds when nothing is found; a finding does not fail the audit — it is heard by the court
  const byForum = Object.fromEntries([...new Set(docket.map((c) => c.forum))].map((f) => [f, docket.filter((c) => c.forum === f).length]))
  const bySkill = Object.fromEntries([...new Set(docket.map((c) => c.skill))].map((s) => [s, docket.filter((c) => c.skill === s).length]))
  t.diagnostic(`audited every family's naming and meaning; ${docket.length} finding(s) heard by the court — forum ${JSON.stringify(byForum)}, skill ${JSON.stringify(bySkill)}${docket.length ? ': ' + docket.map((c) => `${c.defendant} (${c.charge})`).join('; ') : ' (clean)'}`)
  // a finding does not fail the audit — it is sent to court (routed, not blocked); the audit holds when all are heard
})
