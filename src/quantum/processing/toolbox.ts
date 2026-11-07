// A toolbox individualises one idea completely: its toolset (the tools, each with a schema, a run and a widget), and its
// skillset (what a client must know to use it, the directions it tests itself in, the examples that are its documentation
// and its tests, and the selftest that crosses it with the others). It is agnostic of the host: it never imports the
// handler; the host hands it a context (the handler, the examples, the leads) at call time, so any MCP server can mount it.
import type { Example } from './examples.ts'
import type { Lead } from './leads.ts'
import type { Rpc, Check } from './audit.ts'
import { flowWidget } from './widgets.ts'
import { HARMONICS, hue } from './unit/theme.ts'

export type Context = { handle: (m: Rpc) => any; examples: readonly Example[]; leads: readonly Lead[]; /** a tool's structured content, undefined on an error */ call: (name: string, args?: Record<string, unknown>) => any; /** a toolbox's cross-test by its name, when the handler holds it */ selftest?: (toolbox: string, ctx: Context) => { passed: boolean } | undefined }
type ToolResult = { structured: unknown; widget: string }
export type Tool = { name: string; toolbox: string; description: string; inputSchema: object; call: (args: Record<string, unknown>, ctx: Context) => ToolResult | Promise<ToolResult> }
type Skill = {
  /** what a client must know to use the toolset: the order of calls, what it fetches between them, what it writes */
  instructions: string
  /** the directions the toolbox tests itself in */
  directions: readonly string[]
  /** the cross-test: the toolbox on fixtures, feeding and fed by the others; the audit replays it, a client runs it first */
  selftest: (ctx: Context) => { passed: boolean; checks: Check[] }
}
/** The Lean the toolbox keeps: each theorem its own examples name, the proof the kernel or the textbook states, joined as one text. */
type ToolboxLean = { theorems: readonly { theorem: string; proof: string; kernel: boolean }[]; proof: string }
export type Toolbox = { name: string; idea: string; tools: Tool[]; examples: Example[]; skill: Skill; lean?: ToolboxLean }

/** The full tools/list as the handler serves it, read whole: every tool of every toolbox with its schema and its _meta (the short list served by
 *  default is a view of this one). The one reader the toolboxes fold onto. */
type ListedTool = { name: string; description: string; inputSchema: { properties?: Record<string, unknown> }; annotations?: { readOnlyHint?: boolean; idempotentHint?: boolean }; _meta?: { toolbox?: string; skill?: { instructions: string; directions: number }; ui?: { resourceUri?: string } } }
export const listTools = (ctx: Pick<Context, 'handle'>): ListedTool[] => (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: { full: true } }) as { result: { tools: ListedTool[] } }).result.tools
/** An argument given as an object. */
export const isObj = (x: unknown): x is Record<string, any> => !!x && typeof x === 'object'
/** A selftest's checks folded into one place: each toolbox names its checks, and done() returns them with whether every one passed. */
export const createChecks = () => { const checks: Check[] = []; return { check: (id: string, passed: boolean, evidence: string) => { checks.push({ id, passed, evidence }) }, done: () => ({ passed: checks.every((c) => c.passed), checks }) } }
/** The A432 series, each frequency reflected onto the hue circle. 432 reflects to 72. The rest sit on their own degrees. */
const a432Harmonics = () => HARMONICS.map((hz) => ({ hz, hue: hue(hz) }))
/** The harmonic this tool holds when no param is passed. The series is halved from 432, and the tool name picks one step. The step across the series is its reflection. */
export const a432Specific = (tool: string) => {
  const harmonics = a432Harmonics()
  let n = 0
  for (let i = 0; i < tool.length; i++) n += tool.charCodeAt(i)
  const at = n % harmonics.length
  const row = harmonics[at]!
  const mirror = harmonics[harmonics.length - 1 - at]!
  return { base: 432 as const, harmonics, specific: { tool, hz: row.hz, hue: row.hue, reflected: mirror.hz, reflectedHue: mirror.hue } }
}
/** No params were given. The computation is unlimited at 432 Hz. A textbook example such as 440 Hz is a param, and this call did not pass one. A superposition that uses the tool does not pass one either. The quantum toolbox reflects the A432 harmonics on that answer. */
export const unlimited = () => ({
  phase: 'unlimited' as const, params: false as const, dependent: false as const, hz: 432 as const, example: null, bounded: false as const, unlimited: true as const,
  says: 'no params: the computation is unlimited at 432 Hz. A textbook example such as 440 Hz is a param this call did not pass. A superposition that uses this tool does not pass one either.',
})
export const defineTool = <T>(toolbox: string, spec: { name: string; description: string; inputSchema: object; run: (args: Record<string, unknown>, ctx: Context) => T; widget: (data: T) => string }): Tool => ({
  name: spec.name, toolbox, description: spec.description, inputSchema: spec.inputSchema,
  // a selftest is the toolbox's cross-test, answered here for each of its tools, never by the tool
  call: (args, ctx) => {
    const t = args.selftest ? ctx.selftest?.(toolbox, ctx) : undefined
    const produced = (t ? { selftest: true, ...t } : spec.run(args, ctx)) as T | Promise<T>
    const pack = (data: T) => {
      const row = data !== null && typeof data === 'object' ? data as { phase?: unknown; unlimited?: unknown } : null
      const quantum = toolbox === 'google' && row !== null && (row.phase === 'unlimited' || row.unlimited === true)
      const tone = quantum ? a432Specific(spec.name) : null
      const structured = (tone ? { ...row, harmonics: tone.harmonics, specific: tone.specific } : data) as T
      const open = row?.phase === 'unlimited'
      return { structured, widget: open ? flowWidget(structured as Record<string, unknown>) : spec.widget(data) }
    }
    if (produced !== null && typeof produced === 'object' && typeof (produced as { then?: unknown }).then === 'function') return Promise.resolve(produced as Promise<T>).then(pack)
    return pack(produced as T)
  },
})
