// The generated full-stack overlay (configure { kind: 'fullstack' }) is written into a fresh payloadcms/website clone and built by
// `next build`. A relative import between two generated files must resolve, or the deploy fails at compile time (as the FullLogo → Qpu/Branding
// re-export did with one `../` too many). This guard resolves every relative import that points at a generated QPU block/graphic file and fails
// if it does not land on another generated file — catching a broken overlay path before it reaches the deploy.
import test from 'node:test'
import assert from 'node:assert/strict'
import { dirname, join, normalize } from 'node:path'
import { handle } from './mcp.ts'

const files = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'configure', arguments: { kind: 'fullstack' } } }) as { result: { structuredContent: { config: { files: Record<string, string> } } } }).result.structuredContent.config.files
const keys = new Set(Object.keys(files))
// a relative import resolves when the generated map holds the file it names, under any of the module extensions Next resolves
const resolves = (from: string, spec: string): boolean => { const base = normalize(join(dirname(from), spec)); return ['.ts', '.tsx', '.js', '/index.ts', '/index.tsx', ''].some((ext) => keys.has(base + ext)) }

test('every generated overlay file that re-exports or imports a QPU block/graphic by a relative path resolves to another generated file', () => {
  const broken: string[] = []
  for (const [path, text] of Object.entries(files)) {
    if (!/\.tsx?$/.test(path)) continue
    for (const m of String(text).matchAll(/(?:from|import)\s+'(\.[^']*\/(?:components\/blocks\/Qpu|graphics\/FullLogo)[^']*)'/g)) if (!resolves(path, m[1]!)) broken.push(`${path} → ${m[1]}`)
  }
  assert.deepEqual(broken, [], `broken relative overlay import(s): ${broken.join('; ')}`)
})

test('the FullLogo re-export points at the generated Qpu/Branding component', () => {
  const full = Object.entries(files).find(([k]) => /graphics\/FullLogo\/index\.tsx$/.test(k))
  assert.ok(full, 'the full-logo graphic is generated')
  const spec = full![1].match(/from '([^']*Branding[^']*)'/)?.[1]
  assert.ok(spec, 'FullLogo re-exports from the Branding component')
  assert.ok(resolves(full![0], spec!), `FullLogo import ${spec} does not resolve to a generated file`)
})
