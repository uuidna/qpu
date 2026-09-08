import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HANDLE_HEXBITS, TRINITY, qpuSeatOf } from './hologram.js'
import {
  QPU_BOOT_ARCHES, QPU_BOOT_PARTS, qpuBootHolds, qpuBootOf, qpuBootUrlOf, qpuImageCheckOf,
  qpuImagesOf, qpuKernelCodeOf, qpuKernelPatchOf, qpuKernelSplitOf, qpuPatchParseOf, qpuPatchTextOf,
} from './boot.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'

test('boot matrix is eight ISAs times trinity parts; URLs are https; chip empty', () => {
  assert.equal(QPU_BOOT_ARCHES.length, HANDLE_HEXBITS)
  assert.equal(QPU_BOOT_PARTS.length, TRINITY)
  assert.equal(qpuImagesOf().length, HANDLE_HEXBITS * TRINITY)
  assert.equal(qpuBootHolds(), true)
  assert.equal(qpuBootOf().holds, true)
  assert.equal(qpuBootOf().chip.seat, qpuSeatOf().seat)
  assert.equal(new URL(qpuBootUrlOf('x86_64', '3.22.0')).protocol, 'https:')
  const split = qpuKernelSplitOf(qpuKernelCodeOf(6, 12, 8))
  assert.deepEqual(split, { major: 6, minor: 12, patch: 8 })
})

test('unified diff parse refuses binary and path escape; text apply is one file', () => {
  const diff = `--- a/foo.c\n+++ b/foo.c\n@@ -1,2 +1,2 @@\n int x;\n-int y;\n+int z;\n`
  const parsed = qpuPatchParseOf(diff)
  assert.equal(parsed.ok, true)
  assert.equal(parsed.files[0]!.plus, 1)
  const applied = qpuPatchTextOf('int x;\nint y;\n', diff)
  assert.equal(applied.ok, true)
  assert.equal(applied.text, 'int x;\nint z;\n')
  assert.equal(qpuPatchParseOf('GIT binary patch\n').ok, false)
  assert.equal(qpuPatchParseOf('--- a/../etc/passwd\n+++ b/../etc/passwd\n').ok, false)
  const recipe = qpuKernelPatchOf({
    alpine: 'x86_64',
    from: { major: 6, minor: 12, patch: 8 },
    to: { major: 6, minor: 12, patch: 9 },
    diff,
  })
  assert.equal(recipe.ok, true)
  if (recipe.ok) {
    assert.equal(recipe.live, false)
    assert.equal(recipe.chip.seat, 'empty')
    assert.equal(recipe.forward, true)
  }
  assert.equal(qpuImageCheckOf('a'.repeat(64), 'a'.repeat(64)).ok, true)
  assert.equal(qpuImageCheckOf('nope', 'nope').ok, false)
})

test('GET /boot and MCP qpu_boot; harvest uses the given fetch', async () => {
  const res = await handleQpuFetch(new Request('https://qpu.uuidna.com/boot'))
  assert.equal(res.status, 200)
  const body = await res.json() as { alpine: number; holds: boolean; images: number }
  assert.equal(body.alpine, 8)
  assert.equal(body.holds, true)
  assert.equal(body.images, 24)
  const mcp = await qpuMcpCall('qpu_boot', {}) as { holds: boolean }
  assert.equal(mcp.holds, true)
  const yaml = `
-
  flavor: alpine-netboot
  version: 3.22.0
  sha256: ${'ab'.repeat(32)}
`
  const harvest = await qpuMcpCall('qpu_boot_harvest', {}, undefined) as { requested: number }
  assert.equal(typeof harvest.requested, 'number')
  const { qpuBootHarvestOf } = await import('./boot.js')
  const mocked = await qpuBootHarvestOf(async () => new Response(yaml))
  assert.equal(mocked.requested, 8)
  assert.equal(mocked.ported, 8)
  assert.equal(mocked.holds, true)
  assert.equal(mocked.pins[0]!.sha256.length, 64)
})
