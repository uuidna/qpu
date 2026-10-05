/**
 * EVERY FAMILY IS A GATE, AND QPU IS COMPLETE ON BOTH SIDES. Each family requests its own DISCOVERY (its place in the
 * graph) and DEVELOPMENT (its formulas) be complete before a push holds; when a family cannot autonomously handle the task
 * it explains EXACTLY HOW — the precise step — and whether gravity/the generator does it autonomously or a human must. A
 * push holds only when no family is left requesting. And qpu is complete when the families compute BOTH sides: clay on the
 * one (2·7 coins = 1+6 coils = clay) and the double torus on the other (the coil family — the fold/coil duality, genus 2).
 * Read from the registry and the filesystem; the path gate is gravity's own offPathOf, so this agrees with it exactly.
 * Discovered by the scripts/*.test.mjs glob, run by the one gate, so it gates every push.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { offPathOf, entriesOf } from './gravity.mjs'

const DOORS = new Set(['qpu', 'crypto', 'api', 'data', 'gate'])

test('every family is a gate: discovery and development complete, or it explains exactly how, before push', async () => {
  await import('../dist/mcp/families.js')
  const { qpuHexFamiliesOf, qpuHexRegisteredSizeOf, qpuHexFamilyCapOf, qpuHexUuidOf } = await import('../dist/quantum/processing/unit/index.js')
  const cap = qpuHexFamilyCapOf()
  const families = qpuHexFamiliesOf()
  // the path gate, gravity's own: a family whose registering file is off its meaningful path (mcp/door families excepted)
  const offPath = new Set(offPathOf(entriesOf(), DOORS).map((m) => m.family))
  const handles = new Map()
  const requests = []
  const req = (family, what, how, autonomous) => requests.push({ family, what, how, autonomous })

  for (const [fam, formulas] of families) {
    // only the registered file-families gate the push — the Lean families (Qpu.*) and the doors are not developed here
    if (DOORS.has(fam) || fam.startsWith('Qpu.') || qpuHexRegisteredSizeOf(fam) === 0) continue
    const n = qpuHexRegisteredSizeOf(fam)

    // DEVELOPMENT — the family's own formulas
    if (n === 0) req(fam, 'develops no formula', `add a static formula to src/families/${fam}/index.ts and register it, then node scripts/payload-cloudflare.mjs --repo`, false)
    if (!/^[a-z]+$/.test(fam)) req(fam, 'the name is not one lowercase word', `rename the folder and the qpuHexRegisterOf('${fam}') call to one /^[a-z]+$/ word, then --repo (a human picks the word)`, false)
    if (n > cap) req(fam, `${n} formulas exceed the nibble of ${cap}`, `split it: move formulas ${cap + 1}+ into a new one-word family folder (the nibble holds ${cap}), then --repo`, false)

    // DISCOVERY — the family's place in the graph
    if (offPath.has(fam)) req(fam, 'is off its meaningful path', `node scripts/gravity.mjs --fix moves it to src/families/${fam}/index.ts, then --repo`, true)
    if (formulas.length > 0) {
      const handle = qpuHexUuidOf({ family: fam, program: [formulas[0].name], params: [] }).split('-')[0]
      const other = handles.get(handle)
      if (other && other !== fam) req(fam, `its handle ${handle} collides with '${other}'`, `rename '${fam}' to a word whose fold differs from '${other}' — a human picks it; the collision cannot be resolved autonomously`, false)
      else handles.set(handle, fam)
    }
  }

  const auto = requests.filter((r) => r.autonomous)
  const human = requests.filter((r) => !r.autonomous)
  assert.deepEqual(
    requests,
    [],
    `families still requesting before push (${auto.length} autonomously fixable, ${human.length} need a human):\n  ` +
      requests.map((r) => `${r.family}: ${r.what}\n    HOW: ${r.how}${r.autonomous ? '  [autonomous]' : '  [needs a human]'}`).join('\n  '),
  )
})

test('qpu is complete: the families compute both sides — clay and the double torus', async () => {
  const unit = await import('../dist/quantum/processing/unit/index.js')
  await import('../dist/mcp/families.js')
  const { CoilFormulas } = await import('../dist/families/coil/index.js')
  // one side: clay — 2·7 coins = 1+6 coils = clay
  const clay = typeof unit.qpuClayHolds === 'function' ? unit.qpuClayHolds() : unit.qpuClayOf().holds
  assert.equal(clay, true, 'the clay side holds (2·7 coins = 1+6 coils = clay)')
  // the other side: the double torus — the coil family, the fold/coil duality (2·90 = 3·60) and genus two
  assert.equal(CoilFormulas.turn(2, 3).holds, true, 'the double-torus side holds — fold equals coil (180°)')
  assert.equal(CoilFormulas.genus().value, unit.coins, 'the double torus has genus two (coins)')
  // and complete in all human perceptions, delivered via the device hardware (the Payload UI renders these through the
  // device's display and audio): qpu computes sight (colour, optics, hologram), sound (audio, tune), and signal (wave).
  const families = unit.qpuHexFamiliesOf()
  for (const sense of ['color', 'optics', 'holo', 'audio', 'tune', 'signal', 'wave'])
    assert.ok((families.get(sense)?.length ?? 0) > 0, `qpu computes the ${sense} perception, delivered to the human via the device`)
  // both sides computed and all perceptions delivered → qpu is complete
})
