// A toolbox individualises one idea completely: its toolset (the tools, each with a schema, a run and a widget), and its
// skillset (what a client must know to use it, the directions it tests itself in, the examples that are its documentation
// and its tests, and the selftest that crosses it with the others). It is agnostic of the host: it never imports the
// handler; the host hands it a context (the handler, the examples, the leads) at call time, so any MCP server can mount it.
import type { Example } from './examples.ts'
import type { Lead } from './leads.ts'
import type { Rpc, Check } from './audit.ts'

export type Context = { handle: (m: Rpc) => any; examples: readonly Example[]; leads: readonly Lead[]; /** a tool's structured content, undefined on an error */ call: (name: string, args?: Record<string, unknown>) => any }
export type Tool = { name: string; toolbox: string; description: string; inputSchema: object; call: (args: Record<string, unknown>, ctx: Context) => { structured: unknown; widget: string } }
type Skill = {
  /** what a client must know to use the toolset: the order of calls, what it fetches between them, what it writes */
  instructions: string
  /** the directions the toolbox tests itself in */
  directions: readonly string[]
  /** the cross-test: the toolbox on fixtures, feeding and fed by the others; the audit replays it, a client runs it first */
  selftest: (ctx: Context) => { passed: boolean; checks: Check[] }
}
export type Toolbox = { name: string; idea: string; tools: Tool[]; examples: Example[]; skill: Skill }

/** The full tools/list as the handler serves it, read whole: every tool of every toolbox with its schema and its _meta (the short list served by
 *  default is a view of this one). The one reader the toolboxes fold onto. */
type ListedTool = { name: string; description: string; inputSchema: { properties?: Record<string, unknown> }; annotations?: { readOnlyHint?: boolean; idempotentHint?: boolean }; _meta?: { toolbox?: string; skill?: { instructions: string; directions: number }; ui?: { resourceUri?: string } } }
export const listTools = (ctx: Pick<Context, 'handle'>): ListedTool[] => (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: { full: true } }) as { result: { tools: ListedTool[] } }).result.tools
/** An argument given as an object. */
export const isObj = (x: unknown): x is Record<string, any> => !!x && typeof x === 'object'
/** A selftest's checks folded into one place: each toolbox names its checks, and done() returns them with whether every one passed. */
export const createChecks = () => { const checks: Check[] = []; return { check: (id: string, passed: boolean, evidence: string) => { checks.push({ id, passed, evidence }) }, done: () => ({ passed: checks.every((c) => c.passed), checks }) } }
export const defineTool = <T>(toolbox: string, spec: { name: string; description: string; inputSchema: object; run: (args: Record<string, unknown>, ctx: Context) => T; widget: (data: T) => string }): Tool => ({
  name: spec.name, toolbox, description: spec.description, inputSchema: spec.inputSchema,
  call: (args, ctx) => { const data = spec.run(args, ctx); return { structured: data, widget: spec.widget(data) } },
})
