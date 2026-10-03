import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuFacesOf, qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { WaveFormulas, waveFamiliesOf } from './index.js'
import '../../mcp/families.js'

/** One call launches a wave of agents and answers one receipt: the calls saved are the agents less the waves, the
 *  unit runs the same programs, and no door or wave is launched by a wave. */
test('wave: one call launches faces agents and answers one receipt; the calls saved are counted', async (t) => {
  const names = waveFamiliesOf()
  assert.ok(names.length >= 3 && !names.includes('wave') && !names.includes('data') && !names.includes('gate'), 'no door and not itself: no wave recurses')
  const faces = qpuFacesOf().faces
  const i = names.indexOf('tesla') >= 0 ? names.indexOf('tesla') : 0
  const w = (await WaveFormulas.wave(i, 0)) as unknown as { value: number; holds: boolean; agents: number; calls: number; saved: number; next: number; receipt: string }
  assert.equal(w.calls, 1)
  assert.equal(w.agents, (qpuHexFamiliesOf().get(names[i]!)?.length ?? 0) * faces, 'every formula of the family at faces inputs')
  assert.equal(w.saved, w.agents - 1, 'the calls saved by one wave')
  assert.equal(w.next, faces)
  assert.ok(w.holds && w.value > 0, 'some agent held')
  assert.match(w.receipt, /^[0-9a-f-]{36}$/, 'one receipt for the wave')
  const s = (await WaveFormulas.sweep(0)) as unknown as { value: number; agents: number; families: string[]; silent: string[] }
  assert.equal(s.agents, Math.min(faces, names.length), 'one agent per family of the slice')
  assert.equal(s.value + s.silent.length, s.families.length)
  const n = 16
  assert.equal(Number(WaveFormulas.saved(n).value), Number(WaveFormulas.agents(n).value) - Number(WaveFormulas.waves(n).value))
  assert.equal(Number(WaveFormulas.waves(faces).value), names.length, 'faces inputs: one wave per family')
  // the massive wave: every family, every program of one or two formulas, inputs 1 … 2, at once — timed
  // the massive wave: every family's address fired at once by the caller; here one family — its every program of one
  // or two formulas × inputs 1 … 4 — timed
  const m = (await WaveFormulas.massive(i)) as unknown as { value: number; agents: number; ms: number; perSecond: number; signals: string[]; calls: number; programs: number }
  assert.equal(m.calls, 1)
  const k = qpuHexFamiliesOf().get(names[i]!)!.length
  assert.equal(m.programs, k + k * k, 'every program of one or two formulas')
  assert.ok(m.agents === m.programs * 4 && m.value > 0 && m.ms > 0 && m.perSecond > 0, `${m.agents} agents in ${m.ms} ms`)
  assert.ok(m.signals.every((u) => /^[0-9a-f-]{36}$/.test(u)), 'every signal is a UUID')
  // a program as a hex combination: 0x21 is the second formula composed with the first
  const c = (await WaveFormulas.combo(i, 0x21, 0)) as unknown as { program: string[]; agents: number; holds: boolean }
  assert.deepEqual(c.program, [qpuHexFamiliesOf().get(names[i]!)![1]!.name, qpuHexFamiliesOf().get(names[i]!)![0]!.name])
  assert.equal(c.agents, faces)
  assert.equal((await WaveFormulas.combo(i, 0xf, 0)).holds, false, 'a digit past the family names no formula')
  // the remote agents: a slice of the AI APIs read for the credential they ask and called free; the reading says which
  const rem = (await WaveFormulas.remote(0)) as unknown as { value: number; matched: number; agents: string[]; calls: number }
  assert.equal(rem.calls, 1)
  assert.ok(rem.matched > 0, 'the registry names AI APIs')
  assert.equal(rem.agents.length, Math.min(rem.value, faces))
  qpuUuidReceiptOf('wave remote', qpuContentUuidOf(rem), { agents: rem.value })
  // the wave at its own address through the unit
  // the token bill: free remote agents are keyless public APIs — no key, no token, no bill; only keyed APIs or model leads bill
  assert.equal(Number(WaveFormulas.bill(14, 0, 0).value), 0, 'a wave of 14 keyless public APIs costs no tokens')
  assert.equal(WaveFormulas.bill(14, 0, 0).holds, true, 'no token bill — holds')
  assert.equal(Number(WaveFormulas.bill(14, 2, 1).value), 3, 'two keyed APIs and one model lead are the only bill')
  assert.equal(WaveFormulas.bill(14, 2, 1).holds, false)
  assert.equal((WaveFormulas.bill(14, 0, 0) as unknown as { free: number }).free, 14, 'all fourteen free')
  // all at once with one command: every family's first formula across the whole lattice, one receipt
  const a = (await WaveFormulas.all()) as unknown as { value: number; families: number; agents: number; calls: number; receipt: string; answered: string[]; silent: string[] }
  assert.equal(a.calls, 1, 'one tools/call for the whole lattice')
  assert.equal(a.families, waveFamiliesOf().length, 'every family, not a slice')
  assert.equal(a.value + a.silent.length, a.families, 'every family either answered or is a lead')
  assert.ok(a.value > 0 && a.answered.length === a.value)
  assert.match(a.receipt, /^[0-9a-f-]{36}$/, 'one receipt for the whole lattice')
  qpuUuidReceiptOf('wave all', qpuContentUuidOf(a), { families: a.families, answered: a.value })
  assert.equal(qpuHexFamiliesOf().get('wave')?.length, 10)
  const uuid = qpuHexUuidOf({ family: 'wave', program: ['waves'], params: [faces] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown; holds?: boolean }
  assert.equal(Number(run.value), Number(WaveFormulas.waves(faces).value))
  qpuUuidReceiptOf('wave waves', qpuContentUuidOf(run), { uuid })
  t.diagnostic(`${names.length} families; wave(${names[i]}, 0): ${w.agents} agents, ${w.value} held, 1 call, ${w.saved} saved; sweep(0): ${s.value}/${s.families.length}; massive(${names[i]}): ${m.agents} agents in ${m.ms} ms (${m.perSecond}/s); remote(0): ${rem.value} keyless AI APIs of ${rem.matched}`)
})
