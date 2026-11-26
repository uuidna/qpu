import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// the names the Payload MCP tool (payload.qpu.mcp.ts, a consumer of @uuidna/qpu) imports from the machine subpaths: a name dropped by a purge throws
// only when the tool is called, so the package's own exports map is read here and every name the tool imports is resolved through it
const CONSUMED: Record<string, Record<string, 'function' | 'object' | 'string'>> = {
  './machine-run': { runMachine: 'function' },
  './machine': { LONG_ACTIONS: 'object', MACHINE_ACTIONS: 'object', MACHINE_RUNNER: 'string' },
}

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every name the Payload MCP tool imports from @uuidna/qpu/machine and @uuidna/qpu/machine-run resolves through the package's exports map to an export of that kind, runMachine a function of machine-run. */
test("every name the Payload MCP tool imports from @uuidna/qpu/machine and @uuidna/qpu/machine-run resolves through the package's exports map to an export of that kind, runMachine a function of machine-run", async () => {
  const pkgUrl = new URL('../package.json', import.meta.url)
  const pkg = JSON.parse(readFileSync(fileURLToPath(pkgUrl), 'utf8')) as { name: string; exports: Record<string, string> }
  assert.equal(pkg.name, '@uuidna/qpu')
  for (const [sub, names] of Object.entries(CONSUMED)) {
    const target = pkg.exports[sub]
    assert.ok(typeof target === 'string', `${pkg.name} exports ${sub}`)
    const mod = (await import(new URL(target, pkgUrl).href)) as Record<string, unknown>
    for (const [name, kind] of Object.entries(names)) assert.equal(typeof mod[name], kind, `${pkg.name}${sub.slice(1)} exports ${name} as a ${kind}`)
  }
  const machine = (await import(new URL(pkg.exports['./machine']!, pkgUrl).href)) as { LONG_ACTIONS: readonly string[]; MACHINE_ACTIONS: readonly unknown[] }
  assert.ok(Array.isArray(machine.LONG_ACTIONS) && machine.LONG_ACTIONS.length > 0, 'LONG_ACTIONS names the queued actions')
  assert.ok(Array.isArray(machine.MACHINE_ACTIONS) && machine.MACHINE_ACTIONS.length > 0, 'MACHINE_ACTIONS is the allow-list')
})
