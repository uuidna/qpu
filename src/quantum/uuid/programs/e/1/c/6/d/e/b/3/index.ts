// The line each theorem is declared on, read from its module's Lean text: the first declaration of its last name, or, for a field of a
// structure the kernel counts as a theorem, that field's line inside the structure its namespace names. Pure: the texts come in, and a
// theorem not found stops the caller instead of linking a wrong line.

/** The Lean file of a module, relative to the repository root. */
export const leanPath = (module: string) => `lean/${module.replace(/\./g, '/')}.lean`
const escapeRe = (s: string) => s.replace(/[.*+?^{}()|[\]\\]/g, (c) => `\\${c}`)
/** The 1-based line of each theorem in the texts given by path; every theorem not found is named in the error. */
export const proofLines = (theorems: readonly { key: string; module: string }[], files: Readonly<Record<string, string>>) => {
  const missing: string[] = [], lines = new Map<string, number>(), split = new Map<string, string[]>()
  for (const { key, module } of theorems) {
    const path = leanPath(module)
    if (!split.has(path)) split.set(path, (files[path] ?? '').split('\n'))
    const text = split.get(path)!, parts = key.split('.'), name = escapeRe(parts.at(-1)!), parent = parts.length > 1 ? escapeRe(parts.at(-2)!) : null
    const decl = new RegExp(`^\\s*(?:@\\[[^\\]]*\\]\\s*)*(?:private\\s+|protected\\s+|nonrec\\s+)*(?:theorem|lemma)\\s+(?:[\\w.]+\\.)?${name}(?=[\\s:({\\[]|$)`)
    let at = text.findIndex((l) => decl.test(l))
    if (at < 0 && parent) {
      const owner = text.findIndex((l) => new RegExp(`^\\s*(?:structure|class)\\s+${parent}\\b`).test(l)), field = new RegExp(`^\\s+${name}\\s*:`)
      if (owner >= 0) { const k = text.slice(owner + 1).findIndex((l) => field.test(l)); if (k >= 0) at = owner + 1 + k }
    }
    if (at < 0) missing.push(`${key} in ${path}`)
    else lines.set(key, at + 1)
  }
  if (missing.length) throw new Error(`no declaration of ${missing.length} theorem(s): ${missing.join('; ')}`)
  return lines
}
