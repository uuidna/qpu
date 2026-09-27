/**
 * THE GATHERER, PROVED ABLE TO NOTICE.
 *
 * leads.mjs exists so nobody has to be asked what is still open. That only works if its detectors FIRE — a
 * gatherer whose checks never trigger is a gatherer that always says fine, which is the most expensive kind of
 * green there is. It went a whole commit untested, which is precisely the shape it was written to hunt.
 *
 * Each detector is driven twice: once with the condition it claims to catch, and once with the condition absent.
 * A detector that only passes the first half is a detector that always fires; one that only passes the second is
 * furniture. Both halves, or it proves nothing.
 *
 *   node --test scripts/leads.test.mjs
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { archiveLeadsOf, copyLeadsOf, doorLeadsOf, hostLeadsOf, packageLeadsOf, repoLeadsOf, settledOf, teachingLeadsOf } from './leads.mjs'

test('a package the registry never served is a lead, and one it serves is not', () => {
  const never = packageLeadsOf({ name: '@uuidna/school', version: '0.1.0', status: 404 })
  assert.equal(never.length, 1)
  assert.match(never[0].what, /not published/)
  assert.match(never[0].owes, /first publish/)

  const behind = packageLeadsOf({ name: '@uuidna/uuidna', version: '0.3.1', status: 200, served: ['0.3.0'], latest: '0.3.0' })
  assert.equal(behind.length, 1)
  assert.match(behind[0].owes, /publish 0\.3\.1/)

  // the absent condition: the registry serves exactly what the tree holds
  assert.deepEqual(packageLeadsOf({ name: '@uuidna/qpu', version: '0.1.3', status: 200, served: ['0.1.2', '0.1.3'], latest: '0.1.3' }), [])
})

test('a checkout owes for each fault independently, and a clean one owes nothing', () => {
  const clean = { folder: 'qpu', dirty: '', remote: 'https://github.com/uuidna/qpu.git', ahead: '0' }
  assert.deepEqual(repoLeadsOf(clean), [], 'a clean checkout with a remote and nothing ahead owes nothing')

  // THE FAULT THAT BLOCKED THE RELEASE STREAM. release-cut refuses a dirty tree and says so; the feed recorded
  // only "FAIL cut v0.3.1" and not why, so a person had to look it up. The count is named so nobody has to.
  const dirty = repoLeadsOf({ ...clean, dirty: 'M a\nM b\nM c' })
  assert.equal(dirty.length, 1)
  assert.match(dirty[0].what, /3 uncommitted file\(s\)/)
  assert.match(dirty[0].what, /release-cut refuses/)

  const noRemote = repoLeadsOf({ ...clean, remote: null })
  assert.equal(noRemote.length, 1)
  assert.match(noRemote[0].what, /no git remote/)

  const ahead = repoLeadsOf({ ...clean, ahead: '11' })
  assert.equal(ahead.length, 1)
  assert.match(ahead[0].what, /11 commit\(s\) not pushed/)

  // INDEPENDENT, so a tree in all three states owes all three — the bug a single early return would introduce.
  assert.equal(repoLeadsOf({ folder: 'x', dirty: 'M a', remote: null, ahead: '4' }).length, 3)

  // absent entirely: not a checkout at all
  assert.match(repoLeadsOf({ ...clean, dirty: null })[0].what, /not a git checkout/)
})

test('an unarchived version is a lead, and an archived one is not', () => {
  assert.equal(archiveLeadsOf({ version: '0.1.3', held: ['0.1.2'] }).length, 1)
  assert.match(archiveLeadsOf({ version: '0.1.3', held: ['0.1.2'] })[0].owes, /Zenodo mints the DOI/)
  assert.deepEqual(archiveLeadsOf({ version: '0.1.3', held: ['0.1.2', '0.1.3'] }), [])
  // an empty archive is not silence — it is a lead
  assert.equal(archiveLeadsOf({ version: '0.1.3', held: [] }).length, 1)
})

test('a host whose own monitor says it is unwell is a lead, and names the count', () => {
  const unwell = hostLeadsOf({ origin: 'https://qpu.uuidna.com', holds: false, monitor: { missing: 1, keys: 240 } })
  assert.equal(unwell.length, 1)
  assert.match(unwell[0].what, /1 link\(s\) missing shares of 240/)
  assert.deepEqual(hostLeadsOf({ origin: 'https://qpu.uuidna.com', holds: true, monitor: {} }), [])
})

test('unreached blocks — the third state is not silence', () => {
  const answered = [{ source: 'a', reached: true, open: [] }]
  assert.equal(settledOf(answered), true)

  // A SOURCE THAT WOULD NOT ANSWER HAS TOLD US NOTHING, and nothing is not "fine". Zenodo refuses this host
  // routinely; a gatherer that counted a refusal as a pass would report a release ready on the strength of a
  // question it never got to ask.
  assert.equal(settledOf([{ source: 'a', reached: false, open: [] }]), false)
  assert.equal(settledOf([...answered, { source: 'b', reached: true, open: [{ what: 'x' }] }]), false)
  // and an empty run is not settled either — nothing asked is not nothing wrong
  assert.equal(settledOf([]), false)
})

test('a file: copy that has drifted from its source is a lead, in both ways it drifts', () => {
  const same = { consumer: 'payload', name: '@uuidna/qpu', sourceVersion: '0.1.3', copyVersion: '0.1.3', sourceFiles: ['a.js'], copyFiles: ['a.js'] }
  assert.deepEqual(copyLeadsOf(same), [], 'a copy that matches its source owes nothing')

  // THE FIRST FACE: the version moved and the copy did not. This is how `mintOf is not a function` happened —
  // the site called an export qpu had just added, against a snapshot that predated it.
  const behind = copyLeadsOf({ ...same, copyVersion: '0.1.2' })
  assert.equal(behind.length, 1)
  assert.match(behind[0].what, /copy of @uuidna\/qpu at 0\.1\.2 while the source is 0\.1\.3/)
  assert.match(behind[0].owes, /pnpm copies a file: dependency rather than linking it/)

  // THE SECOND FACE, AND THE MEANER ONE: the version matches and the FILES do not. That is
  // ERR_MODULE_NOT_FOUND on dist/build-graph.js — a symptom that names a missing module rather than a stale copy,
  // which is why it cost an hour to trace.
  const gappy = copyLeadsOf({ ...same, sourceFiles: ['a.js', 'build-graph.js'], copyFiles: ['a.js'] })
  assert.equal(gappy.length, 1)
  assert.match(gappy[0].what, /same version but missing 1 shipped file/)
  assert.match(gappy[0].what, /build-graph\.js/)

  // and not installed at all
  assert.match(copyLeadsOf({ ...same, copyVersion: null })[0].what, /is not installed/)
})

test('a pair that teaches in one direction is a lead that names the direction it owes', () => {
  const entangled = { subject: 'music', domain: 'wave physics', swap: 'entangled' }
  const applied = { subject: 'sports', domain: 'statistics', swap: 'application', owes: 'practice to theory' }

  // AN ENTANGLED PAIR OWES NOTHING. If it did, the detector would be reporting the corpus rather than its gaps.
  assert.deepEqual(teachingLeadsOf({ origin: 'o', school: { reading: [entangled], undecided: 0, seating: { crowded: [] } } }), [])

  const open = teachingLeadsOf({ origin: 'o', school: { reading: [entangled, applied], undecided: 0, seating: { crowded: [] } } })
  assert.equal(open.length, 1)
  assert.match(open[0].what, /statistics serves sports/)
  // THE OWED DIRECTION TRAVELS WITH IT. "not entangled" is a verdict; "owes practice to theory" is work.
  assert.match(open[0].owes, /practice to theory/)
  assert.match(open[0].owes, /sports\/statistics/)
})

test('the undecided are one counted lead, and the unseated are a different question entirely', () => {
  const quiet = { reading: [], undecided: 0, seating: { crowded: [] } }
  assert.deepEqual(teachingLeadsOf({ origin: 'o', school: quiet }), [])

  /* FIFTY-NINE GAPS ARE ONE LEAD WITH A COUNT, not fifty-nine leads. A queue nobody can finish is a queue
   * nobody reads, and the honest ask is "cite the crossings that have real instances", not "fill the grid". */
  const gaps = teachingLeadsOf({ origin: 'o', school: { ...quiet, undecided: 59 } })
  assert.equal(gaps.length, 1)
  assert.match(gaps[0].what, /59 subject\/domain combination\(s\)/)
  assert.match(gaps[0].owes, /no entry at all for the crossings that do not/, 'the lead must not ask for citations that do not exist')

  // AND AN UNSEATED PAIR IS NOT A MISSING CITATION — its evidence is already in; the lattice is out of room.
  const crowded = teachingLeadsOf({ origin: 'o', school: { ...quiet, seating: { crowded: [{ subject: 'sports', domain: 'mechanics', why: 'sports is seated with biomechanics' }] } } })
  assert.equal(crowded.length, 1)
  assert.match(crowded[0].what, /entangled and unseated/)
  assert.match(crowded[0].owes, /not more evidence, which is already in/)

  // a reading that never arrived is itself the lead, rather than an empty list read as "nothing wrong"
  assert.match(teachingLeadsOf({ origin: 'o', school: undefined })[0].what, /served no school reading/)
})

test('a door that needs a third party to hold is not self-sufficient, and says which failure it is', () => {
  const sound = [{ name: 'qpu_prove', ok: true, holds: true }]
  assert.deepEqual(doorLeadsOf({ origin: 'o', doors: sound }), [], 'a door that answers and holds owes nothing')

  // THE QUIET FAILURE: it holds every day the network is good. That is what this repository paid for twice.
  const proxy = doorLeadsOf({ origin: 'o', doors: [...sound, { name: 'qpu_cite', ok: true, holds: false }] })
  assert.equal(proxy.length, 1)
  assert.match(proxy[0].what, /answers but does not hold when asked plainly/)
  assert.match(proxy[0].owes, /a proxy, not a unit/)

  // AN OUTAGE IS NOT A DEFECT, and the two are not merged: one is a door served wrongly, the other not served.
  const down = doorLeadsOf({ origin: 'o', doors: [{ name: 'qpu_lean', ok: false, why: '503' }] })
  assert.equal(down.length, 1)
  assert.match(down[0].what, /did not answer \(503\)/)
  assert.equal(/does not hold/.test(down[0].what), false)

  // and no doors at all is a lead, not a clean sheet
  assert.match(doorLeadsOf({ origin: 'o', doors: [] })[0].what, /listed no sealed doors/)
})
