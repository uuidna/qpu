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

import { archiveLeadsOf, copyLeadsOf, doorLeadsOf, hostLeadsOf, packageLeadsOf, repoLeadsOf, settledOf, teachingLeadsOf, teachingNoteOf } from './leads.mjs'

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

test('a one-way pair is a reading, not a lead — a queue that cannot empty is not a queue', () => {
  const school = {
    holds: true,
    undecided: 31,
    reading: [
      { subject: 'music', domain: 'wave physics', swap: 'entangled' },
      { subject: 'history', domain: 'radiocarbon dating', swap: 'application', owes: 'practice to theory' },
    ],
    subjects: 2,
    domains: 2,
    combinations: 4,
    evidenced: 2,
    seating: { rays: 7, seated: [{ subject: 'music', domain: 'wave physics' }], crowded: [] },
  }
  /* HISTORY WILL NOT BE TEACHING RADIOCARBON DATING. That verdict is correct and final; filing it as an open
   * item makes a list nobody can finish, which is how a leads stream stops being read. */
  assert.deepEqual(teachingLeadsOf({ origin: 'o', school }), [])
  const note = teachingNoteOf({ school })
  assert.match(note, /1 entangled, 1 one-way/, 'it is counted instead, where a count belongs')
  /* AND THE SHAPE TRAVELS WITH THE COUNT. Widening the vocabulary took the grid from 81 cells to 342, so a
   * corpus that got richer reported 282 undecided where it had reported 31 — the same evidence, a bigger
   * emptiness. The share that teach both ways is the only figure here that does not move when a name is
   * added, so it is the one a reader should see beside the hole. */
  assert.match(note, /50% both ways/, 'the share is reported, because the undecided count measures the vocabulary')
  assert.match(note, /this corpus does not decide/, 'and the hole is named as what THIS corpus does not settle')
  assert.equal(/nobody has looked/.test(note), false, 'never as a claim that the question is unstudied, which is a survey nobody ran')

  // A READING THAT DOES NOT HOLD IS a lead: the instrument disagrees with itself.
  const broken = teachingLeadsOf({ origin: 'o', school: { ...school, holds: false } })
  assert.equal(broken.length, 1)
  assert.match(broken[0].what, /does not hold/)

  // and a reading that never arrived is the lead, rather than an empty list read as "nothing wrong"
  assert.match(teachingLeadsOf({ origin: 'o', school: undefined })[0].what, /served no school reading/)
  assert.match(teachingNoteOf({ school: undefined }), /carried no school reading/)
})

test('a name holding two seats, and a ray left empty, are the faults worth reporting', () => {
  const sound = { holds: true, undecided: 0, reading: [], seating: { rays: 7, seated: [{ subject: 'a', domain: 'x' }, { subject: 'b', domain: 'y' }], crowded: [] } }
  assert.deepEqual(teachingLeadsOf({ origin: 'o', school: sound }), [])

  // ONE SEAT PER NAME is what fourteen faces means; two seats for one name is a list wearing a seating's name.
  const twice = teachingLeadsOf({ origin: 'o', school: { ...sound, seating: { ...sound.seating, seated: [{ subject: 'a', domain: 'x' }, { subject: 'a', domain: 'y' }] } } })
  assert.equal(twice.length, 1)
  assert.match(twice[0].what, /a name holds two seats/)

  /* THE FAULT GREEDY HAD. A pair turned away with BOTH of its seats free, while rays stand empty, means the
   * seating chose badly rather than ran out of room — and nothing noticed until the corpus was crossed. */
  const badly = teachingLeadsOf({ origin: 'o', school: { ...sound, seating: { ...sound.seating, crowded: [{ subject: 'c', domain: 'z', why: 'no larger matching holds it' }] } } })
  assert.equal(badly.length, 1)
  assert.match(badly[0].what, /turned away with both seats free while 5 ray\(s\) stand empty/)

  // AND THE ABSENCE: turned away because its partner is seated is not a fault, it is the matching working.
  const fine = teachingLeadsOf({ origin: 'o', school: { ...sound, seating: { ...sound.seating, crowded: [{ subject: 'a', domain: 'z', why: 'a is seated with x' }] } } })
  assert.deepEqual(fine, [], 'a pair whose name is already seated has not been mistreated')
  // nor is a full lattice with pairs left over
  const full = { holds: true, undecided: 0, reading: [], seating: { rays: 2, seated: [{ subject: 'a', domain: 'x' }, { subject: 'b', domain: 'y' }], crowded: [{ subject: 'c', domain: 'z', why: 'all 2 rays are taken' }] } }
  assert.deepEqual(teachingLeadsOf({ origin: 'o', school: full }), [], 'a full lattice owes nothing to the pairs it cannot hold')
})

test('a door that needs a third party to hold is not self-sufficient, and says which failure it is', () => {
  const sound = [{ name: 'qpu_prove', ok: true, holds: true }]
  assert.deepEqual(doorLeadsOf({ origin: 'o', doors: sound }), [], 'a door that answers and holds owes nothing')

  // THE QUIET FAILURE: it holds every day the network is good. That is what this repository paid for twice.
  const proxy = doorLeadsOf({ origin: 'o', doors: [...sound, { name: 'qpu_cite', ok: true, holds: false }] })
  assert.equal(proxy.length, 1)
  assert.match(proxy[0].what, /answers but does not hold when asked plainly/)
  assert.match(proxy[0].owes, /a proxy, not a unit/)

  /* A TIMEOUT IS THE NETWORK. Sweeping forty doors sequentially will outrun a deadline now and then, and
   * storage_raid was filed as unanswered on a run where it answers in 1.3s every time it is asked alone. */
  assert.deepEqual(doorLeadsOf({ origin: 'o', doors: [{ name: 'storage_raid', ok: false, why: 'TimeoutError: The operation was aborted due to timeout' }] }), [])
  assert.deepEqual(doorLeadsOf({ origin: 'o', doors: [{ name: 'x', ok: false, why: 'fetch failed' }] }), [])

  // AN OUTAGE IS NOT A DEFECT, and the two are not merged: one is a door served wrongly, the other not served.
  const down = doorLeadsOf({ origin: 'o', doors: [{ name: 'qpu_lean', ok: false, why: '503' }] })
  assert.equal(down.length, 1)
  assert.match(down[0].what, /did not answer \(503\)/)
  assert.equal(/does not hold/.test(down[0].what), false)

  /* A DOOR THAT REFUSES ON PURPOSE IS WORKING, NOT BROKEN. storage_put without a key and storage_maintain
   * without authorisation both answer `denied`, and filing those as open items is filing correct behaviour —
   * the fault already removed from the teaching queue and from the deploy gate. */
  const refused = doorLeadsOf({ origin: 'o', doors: [...sound, { name: 'storage_put', ok: true, holds: false, denied: 'key' }] })
  assert.deepEqual(refused, [], 'a door that names its refusal meant it')
  // AND THE ABSENCE: not holding with no reason given is still a lead, or the check would excuse everything
  assert.equal(doorLeadsOf({ origin: 'o', doors: [{ name: 'quiet', ok: true, holds: false }] }).length, 1)

  /* A STORE READING IS THE STORE'S STATE, not the door's soundness, and hostLeadsOf already carries it. */
  const store = doorLeadsOf({ origin: 'o', doors: [{ name: 'storage_monitor', ok: true, holds: false, monitor: { missing: 1 } }] })
  assert.deepEqual(store, [], 'the un-mirrored key is one fault and is filed once')

  // and no doors at all is a lead, not a clean sheet
  assert.match(doorLeadsOf({ origin: 'o', doors: [] })[0].what, /listed no sealed doors/)
})
