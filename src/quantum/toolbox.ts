// A toolbox individualises one idea completely: its toolset (the tools, each with a schema, a run and a widget), and its
// skillset (what a client must know to use it, the directions it tests itself in, the examples that are its documentation
// and its tests, and the selftest that crosses it with the others). It is agnostic of the host: it never imports the
// handler; the host hands it a context (the handler, the examples, the leads) at call time, so any MCP server can mount it.
import type { Example } from './examples.js'
import type { Lead } from './leads.js'
import type { Rpc, Check } from './audit.js'

export type Context = { handle: (m: Rpc) => any; examples: readonly Example[]; leads: readonly Lead[] }
export type Tool = { name: string; toolbox: string; description: string; inputSchema: object; call: (args: Record<string, unknown>, ctx: Context) => { structured: unknown; widget: string } }
export type Skill = {
  /** what a client must know to use the toolset: the order of calls, what it fetches between them, what it writes */
  instructions: string
  /** the directions the toolbox tests itself in */
  directions: readonly string[]
  /** the cross-test: the toolbox on fixtures, feeding and fed by the others; the audit replays it, a client runs it first */
  selftest: (ctx: Context) => { passed: boolean; checks: Check[] }
}
export type Toolbox = { name: string; idea: string; tools: Tool[]; examples: Example[]; skill: Skill }

/** A selftest's checks folded into one place: each toolbox names its checks, and done() returns them with whether every one passed. */
export const checksOf = () => { const checks: Check[] = []; return { check: (id: string, passed: boolean, evidence: string) => { checks.push({ id, passed, evidence }) }, done: () => ({ passed: checks.every((c) => c.passed), checks }) } }
export const toolOf = <T>(toolbox: string, spec: { name: string; description: string; inputSchema: object; run: (args: Record<string, unknown>, ctx: Context) => T; widget: (data: T) => string }): Tool => ({
  name: spec.name, toolbox, description: spec.description, inputSchema: spec.inputSchema,
  call: (args, ctx) => { const data = spec.run(args, ctx); return { structured: data, widget: spec.widget(data) } },
})
