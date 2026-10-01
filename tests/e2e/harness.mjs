import esbuild from 'esbuild'
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const UNIT = join(ROOT, 'src', 'quantum', 'processing', 'unit')
export const BOOT_SOURCE = join(UNIT, 'boot.ts')
export const STDIO_SOURCE = join(UNIT, 'stdio.ts')

const scratchDirs = new Set()
const children = new Set()

process.once('exit', () => {
  for (const child of children) if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL')
  for (const dir of scratchDirs) rmSync(dir, { recursive: true, force: true })
})

const scratch = () => {
  const dir = mkdtempSync(join(tmpdir(), 'qpu-e2e-'))
  scratchDirs.add(dir)
  return dir
}

const dropScratch = (dir) => {
  rmSync(dir, { recursive: true, force: true })
  scratchDirs.delete(dir)
}

export const bundle = async (entry, outDir, { attempts = 6, wait = 2500 } = {}) => {
  const outfile = join(outDir, entry.split('/').pop().replace(/\.ts$/, '.mjs'))
  let failure
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await esbuild.build({ entryPoints: [entry], outfile, bundle: true, platform: 'node', format: 'esm', target: 'node26', logLevel: 'silent' })
      return outfile
    } catch (error) {
      failure = error
      if (attempt < attempts) await delay(wait)
    }
  }
  throw new Error(`esbuild could not bundle ${entry} after ${attempts} attempts: ${failure?.message ?? failure}`)
}

export const freePort = () =>
  new Promise((resolve, reject) => {
    const probe = createServer()
    probe.unref()
    probe.once('error', reject)
    probe.listen(0, () => {
      const { port } = probe.address()
      probe.close(() => resolve(port))
    })
  })

const lineReader = (stream, onLine) => {
  let pending = ''
  stream.setEncoding('utf8')
  stream.on('data', (chunk) => {
    pending += chunk
    let at
    while ((at = pending.indexOf('\n')) !== -1) {
      onLine(pending.slice(0, at))
      pending = pending.slice(at + 1)
    }
  })
  stream.on('end', () => { if (pending) onLine(pending) })
}

const stopChild = (child, grace = 5000) =>
  new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) return resolve({ code: child.exitCode, signal: child.signalCode })
    const timer = setTimeout(() => child.kill('SIGKILL'), grace)
    child.once('exit', (code, signal) => { clearTimeout(timer); resolve({ code, signal }) })
    child.kill('SIGTERM')
  })

const launch = (script, port, timeout) =>
  new Promise((resolve, reject) => {
    const started = performance.now()
    const child = spawn(process.execPath, [script], { cwd: dirname(script), env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] })
    children.add(child)
    const stdout = []
    const stderr = []
    let proveMs
    let settled = false
    const settle = (fn, value) => { if (!settled) { settled = true; clearTimeout(timer); fn(value) } }
    const timer = setTimeout(() => {
      child.kill('SIGKILL')
      settle(reject, new Error(`boot did not print its serving line within ${timeout} ms\nstdout:\n${stdout.join('\n')}\nstderr:\n${stderr.join('\n')}`))
    }, timeout)
    lineReader(child.stdout, (line) => {
      stdout.push(line)
      if (proveMs === undefined && line.includes('qpu_prove')) proveMs = performance.now() - started
      if (line.includes('serving')) settle(resolve, { child, stdout, stderr, proveMs, bootMs: performance.now() - started, servingLine: line })
    })
    lineReader(child.stderr, (line) => stderr.push(line))
    child.once('error', (error) => settle(reject, error))
    child.once('exit', (code, signal) => {
      children.delete(child)
      const addrInUse = stderr.some((l) => l.includes('EADDRINUSE'))
      settle(reject, Object.assign(new Error(`boot exited (code ${code}, signal ${signal}) before serving\nstdout:\n${stdout.join('\n')}\nstderr:\n${stderr.join('\n')}`), { addrInUse, code, signal, stdout, stderr }))
    })
  })

export const startHttp = async ({ timeout = 120_000, portAttempts = 5 } = {}) => {
  const dir = scratch()
  try {
    const script = await bundle(BOOT_SOURCE, dir)
    let lastError
    for (let attempt = 1; attempt <= portAttempts; attempt++) {
      const port = await freePort()
      let booted
      try {
        booted = await launch(script, port, timeout)
      } catch (error) {
        lastError = error
        if (error.addrInUse) continue
        throw error
      }
      const { child } = booted
      let stopped
      const stop = () => {
        stopped ??= stopChild(child).then((exit) => { dropScratch(dir); return exit })
        return stopped
      }
      const url = `http://127.0.0.1:${port}`
      return { url, mcpUrl: `${url}/mcp`, port, script, pid: child.pid, proveMs: booted.proveMs, bootMs: booted.bootMs, servingLine: booted.servingLine, stdout: booted.stdout, stderr: booted.stderr, child, stop }
    }
    throw lastError
  } catch (error) {
    dropScratch(dir)
    throw error
  }
}

export const startStdio = async () => {
  if (!existsSync(STDIO_SOURCE)) return null
  const dir = scratch()
  try {
    const script = await bundle(STDIO_SOURCE, dir)
    return { command: process.execPath, args: [script], cwd: dir, stderr: 'pipe' }
  } catch (error) {
    dropScratch(dir)
    throw error
  }
}

const endpointOf = (url) => {
  const target = new URL(String(url))
  if (target.pathname === '/' || target.pathname === '') target.pathname = '/mcp'
  return target
}

export const clientInfo = { name: 'qpu-e2e', version: '0.0.0' }

export const httpClient = async (url, info = clientInfo) => {
  const client = new Client(info)
  await client.connect(new StreamableHTTPClientTransport(endpointOf(url)))
  return client
}

export const stdioClient = async (spec, info = clientInfo) => {
  if (!spec) throw new Error('stdioClient needs a spec from startStdio(); stdio.ts is absent')
  const client = new Client(info)
  await client.connect(new StdioClientTransport(spec))
  return client
}

export const rawRpc = async (url, body, { headers = {}, method = 'POST' } = {}) => {
  const response = await fetch(endpointOf(url), {
    method,
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...headers },
    body: method === 'GET' || method === 'HEAD' ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  })
  const text = await response.text()
  let json
  try { json = text ? JSON.parse(text) : undefined } catch { json = undefined }
  return { status: response.status, headers: response.headers, text, json }
}
