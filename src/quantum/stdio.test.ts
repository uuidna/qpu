import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

test('the stdio transport streams a machine run: progress notifications arrive before the full record answers', () => {
  const call = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'machine', arguments: { action: 'status' }, _meta: { progressToken: 'p1' } } })
  const out = spawnSync('node', ['--import', 'tsx', 'scripts/stdio.ts'], { input: call + '\n', encoding: 'utf8', timeout: 120000 })
  const lines = out.stdout.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l) as { id?: number; method?: string; params?: { progressToken?: string; progress?: number; message?: string }; result?: { structuredContent?: { record?: { ok?: boolean } } } })
  const progress = lines.filter((l) => l.method === 'notifications/progress')
  const resultAt = lines.findIndex((l) => l.id === 1)
  assert.ok(progress.length >= 1, 'at least the branch line of git status is streamed')
  assert.ok(progress.every((p) => p.params?.progressToken === 'p1'), 'every notification carries the caller\'s token')
  assert.deepEqual(progress.map((p) => p.params?.progress), progress.map((_, i) => i + 1), 'progress counts up one line at a time')
  assert.equal(resultAt, lines.length - 1, 'the full record answers last, after every notification')
  assert.equal(lines[resultAt]!.result?.structuredContent?.record?.ok, true)
})

test('without a progress token the machine run answers with the record alone', () => {
  const call = JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'machine', arguments: { action: 'versions' } } })
  const out = spawnSync('node', ['--import', 'tsx', 'scripts/stdio.ts'], { input: call + '\n', encoding: 'utf8', timeout: 120000 })
  const lines = out.stdout.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l) as { id?: number; method?: string })
  assert.equal(lines.filter((l) => l.method === 'notifications/progress').length, 0)
  assert.equal(lines.length, 1)
  assert.equal(lines[0]!.id, 2)
})

test('an action outside the allow-list is refused with the court\'s case, nothing run', () => {
  const call = JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'machine', arguments: { action: 'rm' }, _meta: { progressToken: 'p3' } } })
  const out = spawnSync('node', ['--import', 'tsx', 'scripts/stdio.ts'], { input: call + '\n', encoding: 'utf8', timeout: 120000 })
  const lines = out.stdout.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l) as { method?: string; result?: { structuredContent?: { allowed?: boolean; court?: unknown } } })
  assert.equal(lines.filter((l) => l.method === 'notifications/progress').length, 0)
  assert.equal(lines[0]!.result?.structuredContent?.allowed, false)
  assert.ok(lines[0]!.result?.structuredContent?.court)
})
