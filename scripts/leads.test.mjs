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

import { archiveLeadsOf, hostLeadsOf, packageLeadsOf, repoLeadsOf, settledOf } from './leads.mjs'

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
