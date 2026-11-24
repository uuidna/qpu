// Build-time data (a VitePress data loader): every possibility the installed VitePress offers, read from the package
// itself, and how this site uses each, read from the site's own config and theme. Nothing is listed by hand: the config
// and theme options are the properties of VitePress's own types, the functions and components are what its entry
// points export, the slots are the ones its default theme's components declare, and the use is what config.ts sets and
// what the theme's files import and fill.
import { readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { defineLoader } from 'vitepress'
import config from '../config.ts'

export type Possibility = { kind: string; name: string; used: boolean; how: string }
export type Possibilities = { vitepress: string; rows: Possibility[] }
declare const data: Possibilities
export { data }

const here = dirname(fileURLToPath(import.meta.url)), site = dirname(here)
const pkg = dirname(createRequire(import.meta.url).resolve('vitepress/package.json'))
/** How a value is configured, said by its own shape. */
const how = (value: unknown): string => typeof value === 'function' ? 'function' : Array.isArray(value) ? `${value.length} entries` : value !== null && typeof value === 'object' ? Object.keys(value).join(', ') : String(value)

export default defineLoader({
  watch: ['../config.ts', './*.vue', './*.ts'],
  load(): Possibilities {
    // the types and exports, asked of the TypeScript checker over one probe module that imports VitePress's entry points
    const probe = join(here, 'possibilities.probe.ts')
    const source = "import type { UserConfig, DefaultTheme } from 'vitepress'\nimport * as node from 'vitepress'\nimport * as client from 'vitepress/client'\nimport * as theme from 'vitepress/theme'\nexport type Config = UserConfig<DefaultTheme.Config>; export type ThemeConfig = DefaultTheme.Config; export { node, client, theme }\n"
    const host = ts.createCompilerHost({}), read = host.readFile.bind(host), exists = host.fileExists.bind(host)
    host.readFile = (f) => (f === probe ? source : read(f)); host.fileExists = (f) => f === probe || exists(f)
    const program = ts.createProgram([probe], { module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, skipLibCheck: true, noEmit: true, types: [] }, host)
    const checker = program.getTypeChecker(), exported = Object.fromEntries(checker.getExportsOfModule(checker.getSymbolAtLocation(program.getSourceFile(probe)!)!).map((s) => [s.name, s]))
    const properties = (name: string) => checker.getPropertiesOfType(checker.getDeclaredTypeOfSymbol(exported[name]!)).map((p) => p.name)
    const values = (name: string) => checker.getExportsOfModule(checker.getAliasedSymbol(exported[name]!)).filter((s) => (s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s).flags & ts.SymbolFlags.Value).map((s) => s.name)
    const theme = join(pkg, 'dist/client/theme-default')
    const slots = [...new Set((readdirSync(theme, { recursive: true }) as string[]).filter((f) => f.endsWith('.vue')).flatMap((f) => [...readFileSync(join(theme, f), 'utf8').matchAll(/<slot name="([^"]+)"/g)].map((m) => m[1]!)))]

    // the use: what the config sets, and what the site's own files import from VitePress and fill of its slots
    const files = [join(site, 'config.ts'), ...readdirSync(here).filter((f) => /\.(vue|ts)$/.test(f)).map((f) => join(here, f))].map((f) => ({ name: f.slice(site.length + 1), text: readFileSync(f, 'utf8') }))
    // a file uses a name when it imports it from the entry point, or, for a component VitePress registers itself, when its template opens the tag
    const importers = (entry: RegExp, name: string) => files.filter((f) => [...f.text.matchAll(/import\s+(?:type\s+)?([^;]*?)\s+from\s+'([^']+)'/g)].some((m) => entry.test(m[2]!) && new RegExp(`\\b${name}\\b`).test(m[1]!)) || (f.name.endsWith('.vue') && new RegExp(`<${name}[\\s/>]`).test(f.text))).map((f) => f.name)
    const members = (name: string) => files.filter((f) => new RegExp(`\\b${name}\\b`).test(f.text) && /from\s+'vitepress\/theme'/.test(f.text)).map((f) => f.name)
    const fillers = (slot: string) => files.filter((f) => new RegExp(`<template\\s+(?:#|v-slot:)${slot}[\\s>]`).test(f.text)).map((f) => f.name)
    const set = config as Record<string, unknown>, themed = (set.themeConfig ?? {}) as Record<string, unknown>
    const option = (kind: string, from: Record<string, unknown>) => (name: string): Possibility => ({ kind, name, used: from[name] !== undefined, how: from[name] !== undefined ? how(from[name]) : '' })
    const named = (kind: string, where: (name: string) => string[]) => (name: string): Possibility => { const by = where(name); return { kind, name, used: by.length > 0, how: by.join(', ') } }
    const rows = [
      ...properties('Config').map(option('config', set)),
      ...properties('ThemeConfig').map(option('themeConfig', themed)),
      ...values('node').map(named('vitepress', (name) => importers(/^vitepress$/, name))),
      ...values('client').map(named('vitepress/client', (name) => importers(/^vitepress(\/client)?$/, name))),
      ...values('theme').map(named('vitepress/theme', (name) => (name === 'default' ? importers(/^vitepress\/theme$/, 'DefaultTheme') : members(name)))),
      ...slots.map(named('slot', fillers)),
    ].sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name))
    return { vitepress: JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8')).version, rows }
  },
})
