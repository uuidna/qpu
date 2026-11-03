// The mount through Claude's MCP connector, as a pass of the gate: a Messages request carries the registration extend answers
// (the server and its toolset under one name) and asks Claude to call one door of this catalogue; the hash it reports is
// compared with the block computed here. Runs only when the tenant's key is in the environment (ANTHROPIC_API_KEY, or
// ANTHROPIC_API_KEY_<TENANT>); without it, the pass says what it needs and the lead stands. The official SDK, never raw HTTP.
import Anthropic from '@anthropic-ai/sdk'
import { existsSync } from 'node:fs'
import { toolCallerOf } from '../src/quantum/processing/mcp.ts'

type ClaudeMount = { phase: 'needs-key' | 'mounted' | 'differs' | 'refused' | 'failed'; model?: string; sha256Here?: string; sha256ByClaude?: string | null; stopReason?: string; servedBy?: string; usage?: { input: number; output: number }; note: string }

export const mountThroughClaude = async (origin = 'https://qpu.uuidna.com'): Promise<ClaudeMount> => {
  // the key from the environment or .dev.vars (the file the Worker's secrets live in, ignored by git); its value is never printed or carried
  if (existsSync('.dev.vars')) process.loadEnvFile('.dev.vars')
  const key = process.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY_UUIDNA ?? process.env.ANTHROPIC_API_KEY_PSG
  const reg = toolCallerOf('extend')({ direction: 'out', host: `${origin}/mcp` }).outward.claude as { model: string; betas: string[]; mcp_servers: { type: 'url'; url: string; name: string }[]; tools: { type: 'mcp_toolset'; mcp_server_name: string }[] }
  const here = toolCallerOf('seal')({ text: 'qpu' }).sha256 as string
  if (!key) return { phase: 'needs-key', sha256Here: here, note: `no ANTHROPIC_API_KEY in the environment or .dev.vars: the registration stands (${reg.mcp_servers[0]!.url} as ${reg.mcp_servers[0]!.name}); the mount is the tenant's act with its key` }
  const client = new Anthropic({ apiKey: key })
  try {
    // fallbacks: "default" is on: a refusal by the safety classifiers re-runs the same request on a fallback model inside the call
    // streaming by default: the message is gathered from the stream, so a long turn never hits a request timeout
    const stream = client.beta.messages.stream({
      model: reg.model,
      max_tokens: 1024,
      betas: [...reg.betas, 'server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      mcp_servers: reg.mcp_servers.map((s) => ({ type: 'url' as const, url: s.url, name: s.name })),
      tools: reg.tools.map((t) => ({ type: 'mcp_toolset' as const, mcp_server_name: t.mcp_server_name })),
      messages: [{ role: 'user', content: 'Call the qpu tool named seal with the argument text set to the string qpu, and reply with only the sha256 value it returns, nothing else.' }],
    })
    const response = await stream.finalMessage()
    const text = response.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text').map((b) => b.text).join(' ')
    const reported = /[0-9a-f]{64}/.exec(text)?.[0] ?? null
    const usage = { input: response.usage.input_tokens, output: response.usage.output_tokens }
    if (response.stop_reason === 'refusal') return { phase: 'refused', model: response.model, sha256Here: here, sha256ByClaude: reported, stopReason: response.stop_reason, usage, note: `declined by the safety classifiers (${response.stop_details?.category ?? 'no category'})` }
    const called = response.content.some((b) => b.type === 'mcp_tool_use' || b.type === 'mcp_tool_result')
    return { phase: reported === here ? 'mounted' : 'differs', model: response.model, servedBy: response.model, sha256Here: here, sha256ByClaude: reported, stopReason: response.stop_reason ?? undefined, usage, note: reported === here ? `Claude mounted ${reg.mcp_servers[0]!.name} through the connector${called ? ', called the seal door' : ''} and reported the hash computed here` : `the hash Claude reported (${reported ?? 'none'}) is not the one computed here: a lead` }
  } catch (e) {
    const err = e as Error & { status?: number }
    return { phase: 'failed', sha256Here: here, note: `${err.constructor?.name ?? 'Error'}${err.status ? ` ${err.status}` : ''}: ${err.message}` }
  }
}
