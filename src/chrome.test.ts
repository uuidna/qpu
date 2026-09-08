import { test } from 'node:test'
import assert from 'node:assert/strict'
import { VE_FACES } from './hologram.js'
import { qpuChromeOf, qpuNavOf, qpuSearchHolds, qpuSearchOf, qpuSidebarMapOf, qpuSidebarOf, qpuSitesOf, qpuViteDoorsOf } from './chrome.js'

test('nav is computed from the hologram, not typed', () => {
  const nav = qpuNavOf()
  const faces = nav.find((g) => g.text.endsWith('faces'))
  assert.ok(faces)
  assert.equal(faces!.items.length, VE_FACES)
  assert.equal(faces!.items[0]!.link, '/face/0')
})

test('sidebar upon request: a face lists referer, door, and angles', () => {
  const side = qpuSidebarOf('/face/7')
  assert.ok(side[0]!.items.some((i) => i.text.includes('referer')))
  assert.ok(side[0]!.items.some((i) => i.text.includes('hue')))
  assert.equal(side[1]!.items.length, VE_FACES)
  const home = qpuSidebarOf('/')
  assert.ok(home.length >= 1)
  assert.ok(home[0]!.items.some((i) => i.link === '/seat'))
})

test('search hits planes, faces, standing, and hologram', () => {
  const debit = qpuSearchOf('debit')
  assert.ok(debit.hits.some((h) => h.text.includes('debit')))
  const face = qpuSearchOf('face 7')
  assert.ok(face.hits.some((h) => h.link.includes('/face/7')))
  const holo = qpuSearchOf('hologram')
  assert.ok(holo.hits.some((h) => h.link === '/hologram'))
  assert.equal(qpuSearchHolds(), true)
  assert.ok(qpuSitesOf().every((s) => s.host === 'qpu.uuidna.com'))
  assert.ok(Object.keys(qpuSidebarMapOf()).includes('/hologram'))
  assert.ok(Object.keys(qpuSidebarMapOf()).includes('/gateways'))
  const doors = qpuViteDoorsOf()
  assert.ok(doors.some((d) => d.link === '/gateways'))
  assert.ok(doors.some((d) => d.link === '/face/0'))
  assert.ok(doors.every((d) => d.link.startsWith('/')))
  assert.ok(qpuChromeOf('/hologram', 'seat').nav.length > 0)
})
