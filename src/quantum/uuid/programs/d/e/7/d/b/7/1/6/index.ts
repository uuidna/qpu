// A toolbox individualises one idea completely: its toolset (the tools, each with a schema, a run and a widget), and its
// skillset (what a client must know to use it, the directions it tests itself in, the examples that are its documentation
// and its tests, and the selftest that crosses it with the others). It is agnostic of the host: it never imports the
// handler; the host hands it a context (the handler, the examples, the leads) at call time, so any MCP server can mount it.
import { PROSE } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import type { Example } from '../../../../../../../../9/d/4/f/e/4/4/2/index.ts'
import type { Lead } from '../../../../../../../../7/b/0/4/c/3/6/8/index.ts'
import type { Rpc, Check } from '../../../../../../../../5/b/3/0/7/9/e/2/index.ts'
import { flowWidget } from '../../../../../../../../3/2/b/b/2/3/c/c/index.ts'
import { HARMONICS, hue } from '../../../../../../../../7/2/1/a/a/e/7/d/index.ts'

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
export const listTools = (ctx: Pick<Context, 'handle'>): ListedTool[] => (ctx.handle(listEnvelope({ full: true })) as { result: { tools: ListedTool[] } }).result.tools
/** An argument given as an object. */
export const isObj = (x: unknown): x is Record<string, any> => !!x && typeof x === 'object'
/** A selftest's checks folded into one place: each toolbox names its checks, and done() returns them with whether every one passed. */
/** A check that records how long it took since the one before: where a run's time goes. */
export const timedCheck = (checks: { id: string; passed: boolean; evidence: string; ms?: number }[], clock: () => number) => { let tick = clock(); return (id: string, passed: boolean, evidence: string): void => { const now = clock(); checks.push({ id, passed, evidence, ms: now - tick }); tick = now } }
/** The text a client fetched for a URL, or the empty text where it fetched none. */
export const answerText = (answers: Readonly<Record<string, unknown>>) => (url: string): string => { const a = answers[url]; return typeof a === 'string' ? a : '' }
/** The entries of a value read as a record. */
export const entriesOf = (value: unknown): [string, unknown][] => Object.entries(value as Record<string, unknown>)
/** How many checks passed and failed, by the theorem each rests on. */
export type TheoremTally = Record<string, { passed: number; failed: number }>
/** A tool called by its name with its arguments, as a library call answers it. */
export type Call = (name: string, args: unknown) => { result?: { structuredContent?: any }; error?: { message: string } }
/** An op that is neither plan nor read is refused by name. */
export const assertRead = (op: unknown): void => { if (op !== 'read') throw new Error(`op ${op} is not plan or read`) }
/** The tools/call envelope, written in this one place: a tool by its name with its arguments. */
export const callEnvelope = (name: string, args: unknown, id: number | string = 1) => ({ jsonrpc: '2.0' as const, id, method: 'tools/call' as const, params: { name, arguments: args } })
/** The tools/list envelope, written in this one place. */
export const listEnvelope = (params?: Record<string, unknown>, id: number | string = 1) => ({ jsonrpc: '2.0' as const, id, method: 'tools/list' as const, ...(params ? { params } : {}) })
/** A signal that ends a request after its time: the one place a timeout is made. */
export const within = (ms: number): AbortSignal => AbortSignal.timeout(ms)
/** The head of a file, where a tool that wrote it says so: its first eight lines, as the entropy audit reads a head. */
export const headOf = (text: string): string => text.split('\n').slice(0, 8).join('\n')
/** A call that names nothing but selftest. */
export const onlySelftest = (args: Readonly<Record<string, unknown>>): boolean => Object.keys(args).every((k) => k === 'selftest')
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
  says: PROSE.quantumProcessingToolbox_says1,
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
