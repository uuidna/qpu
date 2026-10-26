import test from 'node:test'
import assert from 'node:assert/strict'
import { handle } from './mcp.js'

// a word that names an object's built-in (constructor, prototype, __proto__, toString…) must be read as a word, never as the built-in:
// "constructors" crashed the match and the chat door (a plain-object lookup returned Object's constructor function: measured)
test('built-in property names in a statement are words, never built-ins: the match, the chat door and the translator answer', () => {
  const s = 'constructor prototype __proto__ toString valueOf hasOwnProperty isPrototypeOf constructors'
  for (const [name, args] of [['match', { statement: s }], ['match', { statement: s, chat: {} }], ['match', { statement: s, locale: 'bg' }], ['translate', { text: s, from: 'en', to: 'bg' }], ['translate', { text: s, from: 'bg', to: 'en' }]] as const) {
    const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) as { error?: { message: string } }
    assert.equal(r.error, undefined, `${name} ${JSON.stringify(args)}: ${r.error?.message}`)
  }
  assert.equal(({} as Record<string, unknown>).polluted, undefined)
})

test("the textbook's Cirq sentence, which names constructors, is answered by the chat door", () => {
  const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'match', arguments: { statement: "this tree's Cirq is twenty-nine exports, seven classes, three qubit constructors", chat: { run: false } } } }) as { result?: { structuredContent?: { routed?: string[] } }; error?: { message: string } }
  assert.equal(r.error, undefined, r.error?.message ?? "")
})
