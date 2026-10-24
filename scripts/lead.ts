#!/usr/bin/env node
/**
 * EVERY PROMPT IS A LEAD. A prompt is recorded verbatim as an open lead, and a lead stays open until the court verifies it.
 * Nothing is a fact until it is verified in court.
 *
 *   npm run lead -- "<prompt text>"        record one prompt
 *   npm run lead -- --harvest              record every prompt in the transcripts of this project
 *
 * Prompts are private conversation text, so they go to scripts/leads.prompts.json, which is git-ignored, and never to the
 * tracked leads file. Each prompt's name is the content hash of its text, so a prompt is recorded once.
 */
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const store = join(import.meta.dirname, 'leads.prompts.json')
type Prompt = { name: string; session: string; state: 'open'; lead: string }

const nameOf = (text: string) => `prompt-${createHash('sha256').update(text).digest('hex').slice(0, 12)}`
const load = (): { leads: Prompt[] } => (existsSync(store) ? JSON.parse(readFileSync(store, 'utf8')) : { leads: [] })
const save = (data: { leads: Prompt[] }) => writeFileSync(store, JSON.stringify(data, null, 1) + '\n')
const add = (data: { leads: Prompt[] }, text: string, session: string): boolean => {
  const name = nameOf(text)
  if (data.leads.some((l) => l.name === name)) return false
  data.leads.push({ name, session, state: 'open', lead: text })
  return true
}

/** The genuine prompts of one transcript: user messages that are text, not tool results or system notices. */
const promptsOf = (path: string): string[] => {
  const out: string[] = []
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!line.trim()) continue
    let row: { type?: string; message?: { content?: unknown } }
    try { row = JSON.parse(line) } catch { continue }
    if (row.type !== 'user') continue
    const c = row.message?.content
    const text = typeof c === 'string' ? c : Array.isArray(c) ? c.map((x: { type?: string; text?: string }) => (x?.type === 'text' ? x.text ?? '' : '')).join(' ') : ''
    const t = text.trim()
    if (t && !t.startsWith('<') && !t.includes('task-notification')) out.push(t)
  }
  return out
}

const args = process.argv.slice(2)
if (args[0] === '--harvest') {
  const dir = join(homedir(), '.claude', 'projects', '-Users-ceci-github-uuidna-qpu')
  const data = load()
  let added = 0, seen = 0
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.jsonl'))) {
    for (const text of promptsOf(join(dir, file))) {
      seen++
      if (add(data, text, file.replace(/\.jsonl$/, ''))) added++
    }
  }
  save(data)
  console.log(`harvested ${seen} prompts, recorded ${added} new, ${data.leads.length} open leads in ${store}`)
} else {
  const text = args.join(' ').trim()
  if (!text) {
    console.error('usage: npm run lead -- "<prompt text>"  |  npm run lead -- --harvest')
    process.exit(2)
  }
  const data = load()
  const name = nameOf(text)
  if (!add(data, text, 'manual')) {
    console.log(`already recorded: ${name}`)
  } else {
    save(data)
    console.log(`recorded open lead: ${name}`)
  }
}
