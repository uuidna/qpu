import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const read = (file: string) => (existsSync(file) ? readFileSync(file, 'utf8') : null)
const write = (file: string, text: string) => { mkdirSync(path.dirname(file), { recursive: true }); writeFileSync(file, text) }
const rename = (from: string, to: string) => { mkdirSync(path.dirname(to), { recursive: true }); renameSync(from, to) }
const list = (dir: string) => (existsSync(dir) ? readdirSync(dir, { recursive: true }).map(String) : [])
const exists = (file: string) => existsSync(file)

const node = { pkg: 'node' as const, read, write, rename, list, exists }
export default node
