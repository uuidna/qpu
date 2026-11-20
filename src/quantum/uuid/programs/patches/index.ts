// Every pnpm patch of an upstream package as one UUID program: the patch text is read as data, parsed hunk by hunk, addressed by the UUID of
// its content and sealed, then judged against the one rule the fork keeps toward upstream — a patch stands only for security or robustness
// (speed), and anything else is a lead naming the documented mechanism that replaces it. A robustness patch carries the title and body of the
// change to offer upstream; nothing is posted from here. The rows are the surface the admin reads beside the doors and the coverage.
import { PROSE, proseFill } from '../../../processing/prose-index.ts'
import { seal, uuid } from '../../index.ts'

export type PatchKind = 'security' | 'robustness' | 'compatibility' | 'feature'
export type PatchHunk = { file: string; header: string; added: number; removed: number }
export type PatchRule = { package: string; kind: PatchKind; why: string; upstream: { repository: string; title: string; body: string } | null; remedy: string | null }
/** The judgement of each patched package, read 2026-11-08 from the three patch files; a package not named here is judged a feature until it is. */
export const PATCH_RULES: readonly PatchRule[] = [
  { package: 'payload', kind: 'feature', why: PROSE.quantumUuidProgramsPatchesIndex_why1, upstream: { repository: 'payloadcms/payload', title: PROSE.quantumUuidProgramsPatchesIndex_title2, body: PROSE.quantumUuidProgramsPatchesIndex_body3 }, remedy: PROSE.quantumUuidProgramsPatchesIndex_remedy4 },
  { package: '@payloadcms/richtext-lexical', kind: 'compatibility', why: PROSE.quantumUuidProgramsPatchesIndex_why5, upstream: null, remedy: 'import EXPERIMENTAL_TableFeature where the fork names TableFeature, and drop the patch' },
  { package: '@modelcontextprotocol/server', kind: 'robustness', why: PROSE.quantumUuidProgramsPatchesIndex_why6, upstream: { repository: 'modelcontextprotocol/typescript-sdk', title: PROSE.quantumUuidProgramsPatchesIndex_title7, body: PROSE.quantumUuidProgramsPatchesIndex_body8 }, remedy: null },
]
export type PatchRow = { file: string; package: string; version: string; hunks: PatchHunk[]; files: string[]; added: number; removed: number; kind: PatchKind; why: string; upstream: PatchRule['upstream']; remedy: string | null; declared: boolean; address: string; sealed: boolean; allowed: boolean }
const nameOf = (file: string) => { const base = file.replace(/^.*\//, '').replace(/\.patch$/, ''); const at = base.lastIndexOf('@'); const pkg = (at > 0 ? base.slice(0, at) : base).replace('__', '/'); return { package: pkg, version: at > 0 ? base.slice(at + 1) : '' } }
/** A unified diff read into its hunks: the file each touches, the header, the lines added and removed. */
export const parsePatch = (text: string): PatchHunk[] => {
  const hunks: PatchHunk[] = []; let file = ''
  for (const line of text.split('\n')) {
    if (line.startsWith('+++ ')) file = line.slice(4).replace(/^b\//, '')
    else if (line.startsWith('@@')) hunks.push({ file, header: line, added: 0, removed: 0 })
    else if (hunks.length && line.startsWith('+') && !line.startsWith('+++')) hunks[hunks.length - 1]!.added++
    else if (hunks.length && line.startsWith('-') && !line.startsWith('---')) hunks[hunks.length - 1]!.removed++
  }
  return hunks
}
/** The patches judged: { files: { 'patches/<name>.patch': text }, declared: package.json's patchedDependencies }. Each row is addressed by the UUID of its text and sealed; a row stands (allowed) when its kind is security or robustness, else it is a lead with the documented mechanism. */
export const patchesProgram = (files: Readonly<Record<string, string>>, declared: Readonly<Record<string, string>> = {}) => {
  const rows: PatchRow[] = Object.entries(files).sort(([a], [b]) => (a < b ? -1 : 1)).map(([file, text]) => {
    const { package: pkg, version } = nameOf(file), hunks = parsePatch(text), rule = PATCH_RULES.find((r) => r.package === pkg)
    const kind: PatchKind = rule?.kind ?? 'feature', address = uuid(`patch\n${pkg}@${version}\n${text}`)
    return { file, package: pkg, version, hunks, files: [...new Set(hunks.map((h) => h.file))], added: hunks.reduce((n, h) => n + h.added, 0), removed: hunks.reduce((n, h) => n + h.removed, 0), kind, why: rule?.why ?? PROSE.quantumUuidProgramsPatchesIndex_s9, upstream: rule?.upstream ?? null, remedy: rule?.remedy ?? PROSE.quantumUuidProgramsPatchesIndex_s10, declared: Object.keys(declared).some((k) => k === `${pkg}@${version}`) && Object.values(declared).some((v) => v.endsWith(file.replace(/^.*patches\//, 'patches/'))), address, sealed: seal(address).valid, allowed: kind === 'security' || kind === 'robustness' }
  })
  const undeclared = Object.keys(declared).filter((k) => !rows.some((r) => `${r.package}@${r.version}` === k))
  const leads = rows.filter((r) => !r.allowed).map((r) => ({ id: `patch-${r.package.replace(/[^a-z0-9]+/gi, '-').replace(/^-/, '')}-${r.kind}`, statement: proseFill(PROSE.quantumUuidProgramsPatchesIndex_statement11, r.package, r.version, r.kind, r.remedy), status: 'open' as const, tool: 'apis' as const, address: r.address }))
  const offers = rows.filter((r) => r.upstream).map((r) => ({ package: r.package, address: r.address, ...r.upstream! }))
  return { phase: 'patches' as const, rows, total: rows.length, byKind: Object.fromEntries((['security', 'robustness', 'compatibility', 'feature'] as const).map((k) => [k, rows.filter((r) => r.kind === k).length])), allowed: rows.filter((r) => r.allowed).length, leads, offers, undeclared, holds: rows.every((r) => r.sealed && r.address.length === 36 && r.declared) && undeclared.length === 0, theorem: 'textbook_uuid_is_36' as const }
}
