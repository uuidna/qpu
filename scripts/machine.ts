// The one runner of a planned machine action, shared by the stdio transport and the Payload MCP plugin's machine tool: the argument vector
// the plan returns, spawned with no shell, its output read line by line as it arrives — each line handed to the caller at once, so a client
// that sent a progress token sees the run as it happens — and the whole kept for the record the repository tool judges. For next, a finished
// step (a line opening with ✓, ✗ or ·) is the unit of progress; for any other action, a line is.
import { spawn } from 'node:child_process'

export type MachineProgress = { progress: number; total?: number; message: string }
const STEP = /^\s*[✓✗·]\s/

/** Runs the plan's command, calling onProgress for every finished step of next or every output line of anything else, and resolves to the whole run. */
export const runMachine = (plan: { action: string; command: { cmd: string; args: readonly string[] }; input?: string | null }, cwd: string, onProgress: (p: MachineProgress) => void = () => {}) =>
  new Promise<{ status: number | null; stdout: string; stderr: string; ms: number }>((resolve) => {
    const t0 = Date.now()
    const child = spawn(plan.command.cmd, [...plan.command.args], { cwd, shell: false })
    let stdout = '', stderr = '', progress = 0
    const lineOf = (stream: 'stdout' | 'stderr') => { let rest = ''; return (chunk: Buffer) => {
      const text = rest + chunk.toString('utf8'); const lines = text.split('\n'); rest = lines.pop() ?? ''
      if (stream === 'stdout') stdout += chunk.toString('utf8'); else stderr += chunk.toString('utf8')
      for (const line of lines) if (line.trim() && (plan.action !== 'next' || STEP.test(line))) onProgress({ progress: ++progress, message: line })
    } }
    child.stdout.on('data', lineOf('stdout'))
    child.stderr.on('data', lineOf('stderr'))
    child.on('error', (e) => { stderr += String(e); resolve({ status: null, stdout, stderr, ms: Date.now() - t0 }) })
    child.on('close', (code) => resolve({ status: code, stdout, stderr, ms: Date.now() - t0 }))
    child.stdin.end(plan.input ?? '')
  })
