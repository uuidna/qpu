// What counts as prose in a TypeScript source, and where it is. Prose is written in Lean (Qpu/General/Prose) and read
// here by name from prose-index.ts, so a sentence typed in TypeScript is a finding. A sentence is a string or template
// whose own text holds at least five words of three letters or more and is not code a generator writes out. Strings the language needs as literals stay:
// import paths, types, property names, tagged templates, `as const` literals and switch cases.
import ts from 'typescript'

/** Text that is code, not a sentence: shell, Lean, TypeScript, YAML or markup written out by a generator. */
const CODE = /^\w+\/[\w.+-]+(, \w+\/[\w.+-]+)*$|\$\(|\$\{|&&|\|\||=>|:=|;\s*$|^\s*[{[<#]|^(https?:|theorem |import |export |pnpm |npm |npx |node |lake |git |curl |cross-env |name: |- |SELECT |INSERT |DELETE |CREATE )|\n\s*(-|run:|uses:|with:|theorem |def |import |export )/
export const isProse = (text: string) => (text.match(/[A-Za-z]{3,}/g) ?? []).length >= 5 && text.includes(' ') && !CODE.test(text)

/** The text a literal states itself: a template's computed values are holes `⟦n⟧`. Undefined when an escape has no value. */
export const ownText = (node: ts.Node): string | undefined => {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isTemplateExpression(node)) return node.head.text + node.templateSpans.map((span, i) => `⟦${i}⟧${span.literal.text}`).join('')
  return undefined
}

const keptAsLiteral = (node: ts.Node): boolean => {
  const parent = node.parent
  if (!parent) return true
  if (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent) || ts.isExternalModuleReference(parent)) return true
  if (ts.isCallExpression(parent) && parent.expression.kind === ts.SyntaxKind.ImportKeyword) return true
  if (ts.isTaggedTemplateExpression(parent) && parent.template === node) return true
  if ((ts.isAsExpression(parent) || ts.isTypeAssertionExpression(parent)) && ts.isConstTypeReference(parent.type)) return true
  if (ts.isCaseClause(parent) || ts.isEnumMember(parent)) return true
  if (ts.isElementAccessExpression(parent) && parent.argumentExpression === node) return true
  if ((ts.isPropertyAssignment(parent) || ts.isPropertySignature(parent) || ts.isMethodDeclaration(parent) || ts.isPropertyDeclaration(parent) || ts.isGetAccessor(parent) || ts.isSetAccessor(parent)) && parent.name === node) return true
  for (let up: ts.Node | undefined = parent; up; up = up.parent) if (ts.isTypeNode(up)) return true
  return false
}

/** The prose literal at this node, or undefined. */
export const proseAt = (node: ts.Node): string | undefined => {
  const text = ownText(node)
  return text !== undefined && isProse(text) && !keptAsLiteral(node) ? text : undefined
}

/** The TypeScript sources that may hold prose: the quantum tree and the scripts, without tests and rendered indexes. */
export const inScope = (file: string) => /^(src\/quantum|scripts)\/.*\.ts$/.test(file) && !/(-index\.ts|_test\.ts|\.test\.ts|clay-statements\.ts|\.d\.ts)$/.test(file)

export const parse = (file: string, text: string) => ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

/** Every prose literal of a source, outermost first: a sentence inside a template's computed value is found too. */
export const findProse = (source: ts.SourceFile): { node: ts.Node; text: string; line: number }[] => {
  const found: { node: ts.Node; text: string; line: number }[] = []
  const visit = (node: ts.Node) => {
    const text = proseAt(node)
    if (text !== undefined) found.push({ node, text, line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1 })
    node.forEachChild(visit)
  }
  visit(source)
  return found
}
