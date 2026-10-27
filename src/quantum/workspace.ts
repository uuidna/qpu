// Google Workspace in Payload, in the shapes the Discovery documents define: a form ↔ a Forms Form, Lexical ↔ a Docs Document, a document
// ↔ a Drive File (calls in the Drive MCP's shapes), each checked against its schema, the coverage as exact pairs. No Sites API is listed,
// so a Sites page is covered as what it is made of. Pure: discover fetches the documents; the Drive MCP answers behind a QPU door.
import { GOOGLE_DOCUMENTS, DRIVE_FILE_URL } from './discovery.ts'
import { WORKSPACE_MCP } from './institutions.ts'

type J = Record<string, any>
const keep = (o: J, drop: string[] = []) => Object.fromEntries(Object.entries(o).filter(([k, v]) => v !== undefined && !drop.includes(k)))
/** blockType → [item kind, question kind, choice type or paragraph]; a block's other fields are its kind's own */
const FORM_KINDS: Record<string, [string, string?, (string | boolean)?]> = { text: ['questionItem', 'textQuestion', false], textarea: ['questionItem', 'textQuestion', true], radio: ['questionItem', 'choiceQuestion', 'RADIO'], checkboxes: ['questionItem', 'choiceQuestion', 'CHECKBOX'], select: ['questionItem', 'choiceQuestion', 'DROP_DOWN'], date: ['questionItem', 'dateQuestion'], time: ['questionItem', 'timeQuestion'], scale: ['questionItem', 'scaleQuestion'], rating: ['questionItem', 'ratingQuestion'], fileUpload: ['questionItem', 'fileUploadQuestion'], grid: ['questionGroupItem', 'rowQuestion'], message: ['textItem'], image: ['imageItem'], video: ['videoItem'], pageBreak: ['pageBreakItem'] }
const NATIVE = ['text', 'textarea', 'radio', 'select', 'date', 'message'], OWN = ['id', 'blockName', 'blockType', 'name', 'label', 'required', 'width', 'defaultValue', 'placeholder', 'options', 'message']
const mirrorName = ([item, q]: [string, string?, unknown?]) => (item === 'questionItem' ? q! : item).replace(/^./, (c) => c.toUpperCase())
const eq = (a: J, b: J) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort())
const lexical = (children: J[]) => ({ root: { type: 'root', version: 1, children } })
const text = (t: string, format = 0) => ({ type: 'text', version: 1, text: t, format })
const plain = (d?: J): string => (d?.root?.children ?? []).flatMap((p: J) => (p.children ?? []).map((t: J) => t.text ?? '')).join('\n')
const toItem = (b: J): J => {
  const [item, q, d] = FORM_KINDS[b.blockType] ?? FORM_KINDS.text!, rest = keep(b, OWN)
  const own = q === 'choiceQuestion' ? { type: d, options: (b.options ?? []).map((o: J) => ({ value: o.label ?? o.value })), ...rest } : q === 'textQuestion' ? { paragraph: d, ...rest } : rest
  return { title: b.label ?? plain(b.message), ...(item === 'questionItem' ? { questionItem: { question: { questionId: b.name, required: !!b.required, [q!]: own } } } : { itemId: b.name, [item]: own }) }
}
const toBlock = (it: J): J => {
  const q = it.questionItem?.question ?? {}, kind = Object.keys(it).find((k) => /Item$/.test(k))!, qk = Object.keys(q).find((k) => /Question$/.test(k)), own = (qk ? q[qk] : it[kind]) ?? {}
  const type = Object.entries(FORM_KINDS).find(([, [i, k, d]]) => i === kind && (!qk || (k === qk && (d === undefined || d === (qk === 'textQuestion' ? !!own.paragraph : own.type)))))?.[0] ?? 'text'
  return { blockType: type, name: q.questionId ?? it.itemId, ...(type === 'message' ? { message: lexical([{ type: 'paragraph', version: 1, children: [text(it.title ?? '')] }]) } : { label: it.title }), ...(qk ? { required: !!q.required } : {}), ...(own.options ? { options: own.options.map((o: J) => ({ label: o.value, value: o.value })) } : {}), ...keep(own, qk ? ['type', 'paragraph', 'options'] : []) }
}
/** A value against a Discovery schema: fields it does not define, wrong types, values outside an enum */
const findViolations = (schemas: J, ref: string, v: unknown): string[] => {
  const walk = (s: J, x: any, p: string): string[] => {
    if (s.$ref) return walk(schemas[s.$ref] ?? {}, x, p)
    if (x == null) return []
    if (s.type === 'object' || s.properties) return typeof x !== 'object' || Array.isArray(x) ? [`${p}: an object`] : Object.entries(x).flatMap(([k, y]) => (s.properties?.[k] ?? s.additionalProperties ? walk(s.properties?.[k] ?? s.additionalProperties, y, `${p}.${k}`) : [`${p}.${k}: not in the schema`]))
    if (s.type === 'array') return Array.isArray(x) ? x.flatMap((y, i) => walk(s.items ?? {}, y, `${p}[${i}]`)) : [`${p}: an array`]
    const t = ({ string: 'string', integer: 'number', number: 'number', boolean: 'boolean' } as J)[s.type]
    return t && typeof x !== t ? [`${p}: a ${s.type}`] : s.enum && !s.enum.includes(x) ? [`${p}: one of ${s.enum.join(', ')}`] : []
  }
  return walk({ $ref: ref }, v, ref)
}
const toField = (mirrors: string) => ([name, p]: [string, J]) => ({ name, type: p.type === 'boolean' ? 'checkbox' : /integer|number/.test(p.type) ? 'number' : p.enum ? 'select' : p.type === 'string' ? 'text' : 'json', ...(p.enum ? { options: p.enum } : {}), admin: { description: p.description ?? `${mirrors}.${name}` } })
/** The form builder's field blocks from the Forms schema, each naming the type it mirrors, and the Lexical block embedding a Drive file */
const buildBlocks = (schemas: J = {}, drive: J = {}) => ({ driveFile: { slug: 'driveFile', interfaceName: 'DriveFileBlock', custom: { mirrors: 'File' }, fields: [{ name: 'fileId', type: 'text', required: true, admin: { description: 'File.id' } }, ...['name', 'mimeType', 'webViewLink', 'modifiedTime', 'md5Checksum'].map((n) => toField('File')([n, drive.File?.properties?.[n] ?? { type: 'string' }]))] }, formFields: Object.fromEntries(Object.entries(FORM_KINDS).map(([slug, k]) => { const mirrors = mirrorName(k), field = toField(mirrors)
  if (NATIVE.includes(slug)) return [slug, { custom: { mirrors } }]
  return [slug, { slug, custom: { mirrors }, fields: [{ name: 'name', type: 'text', required: true }, { name: 'label', type: 'text' }, ...(k[0] === 'questionItem' ? [{ name: 'required', type: 'checkbox' }] : []), ...(k[1] === 'choiceQuestion' ? [{ name: 'options', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'value', type: 'text' }] }] : []), ...Object.entries((schemas[mirrors]?.properties ?? {}) as J).filter(([n]) => ![...OWN, 'type', 'paragraph'].includes(n)).map(field)] }] })) })
const FORMAT: [number, string][] = [[1, 'bold'], [2, 'italic'], [4, 'strikethrough'], [8, 'underline']]
const textRuns = (n: J): J[] => (n.children ?? []).flatMap((c: J) => (c.type === 'link' ? c.children ?? [] : [c]).filter((t: J) => t.type === 'text').map((t: J) => ({ textRun: { content: t.text, textStyle: { ...Object.fromEntries(FORMAT.filter(([b]) => t.format & b).map(([, k]) => [k, true])), ...(c.type === 'link' ? { link: { url: c.fields?.url } } : {}) } } })))
/** Lexical as a Docs Document: named styles, bullets, tables, rules, inline images, a Drive block as its rich link */
const readDoc = (doc: J) => {
  const lists: J = {}, inlineObjects: J = {}, lost: string[] = [], para = (elements: J[], namedStyleType = 'NORMAL_TEXT', bullet?: J) => ({ paragraph: { elements, paragraphStyle: { namedStyleType }, ...(bullet ? { bullet } : {}) } })
  const of = (n: J): J[] => {
    if (n.type === 'heading') return [para(textRuns(n), `HEADING_${n.tag.replace('h', '')}`)]
    if (n.type === 'paragraph') return [para(textRuns(n))]
    if (n.type === 'list') { const listId = `list.${Object.keys(lists).length}`; lists[listId] = { listProperties: { nestingLevels: [n.listType === 'number' ? { glyphType: 'DECIMAL' } : { glyphSymbol: '●' }] } }; return (n.children ?? []).map((li: J) => para(textRuns(li), 'NORMAL_TEXT', { listId, nestingLevel: 0 })) }
    if (n.type === 'table') return [{ table: { rows: n.children.length, columns: n.children[0]?.children.length ?? 0, tableRows: n.children.map((r: J) => ({ tableCells: r.children.map((c: J) => ({ content: (c.children ?? []).flatMap(of) })) })) } }]
    if (n.type === 'horizontalrule') return [para([{ horizontalRule: {} }])]
    if (n.type === 'upload') { const id = String(n.value?.id ?? n.value); inlineObjects[id] = { objectId: id, inlineObjectProperties: { embeddedObject: { title: n.value?.filename ?? id, imageProperties: { contentUri: n.value?.url ?? '' } } } }; return [para([{ inlineObjectElement: { inlineObjectId: id } }])] }
    if (n.fields?.blockType === 'driveFile') return [para([{ richLink: { richLinkProperties: { uri: n.fields.webViewLink ?? `${DRIVE_FILE_URL}${n.fields.fileId}/view`, title: n.fields.name, mimeType: n.fields.mimeType } } }])]
    lost.push(n.fields?.blockType ?? n.type); return []
  }
  return { document: { body: { content: [{ sectionBreak: { sectionStyle: { sectionType: 'CONTINUOUS' } } }, ...(doc.root?.children ?? []).flatMap(of)] }, lists, inlineObjects }, lost }
}
/** A Docs Document as Lexical: docsOf's inverse; what Lexical has no node for is named as lost */
const toLexical = (d: J) => {
  const lost: string[] = [], textOf = (e: J): J[] => { const s = e.textRun?.textStyle ?? {}, t = text(String(e.textRun?.content ?? '').replace(/\n$/, ''), FORMAT.reduce((f, [b, k]) => f | (s[k] ? b : 0), 0)); return !e.textRun || !t.text ? [] : [s.link?.url ? { type: 'link', version: 3, fields: { url: s.link.url, linkType: 'custom' }, children: [t] } : t] }
  const walk = (content: J[]): J[] => content.reduce<J[]>((out, s: J, i: number) => {
    const p = s.paragraph, e = p?.elements ?? [], last = out[out.length - 1], style = /^HEADING_(\d)$/.exec(p?.paragraphStyle?.namedStyleType ?? '')
    if (s.table) out.push({ type: 'table', version: 1, children: s.table.tableRows.map((r: J) => ({ type: 'tablerow', version: 1, children: r.tableCells.map((c: J) => ({ type: 'tablecell', version: 1, headerState: 0, children: walk(c.content ?? []) })) })) })
    else if (p?.bullet) { const item = { type: 'listitem', version: 1, value: 1, children: e.flatMap(textOf) }; if (last?.type === 'list' && last.listId === p.bullet.listId) { item.value = last.children.length + 1; last.children.push(item) } else { const listType = /DECIMAL|ALPHA|ROMAN/.test(d.lists?.[p.bullet.listId]?.listProperties?.nestingLevels?.[0]?.glyphType ?? '') ? 'number' : 'bullet'; out.push({ type: 'list', version: 1, listType, tag: listType === 'number' ? 'ol' : 'ul', start: 1, listId: p.bullet.listId, children: [item] }) } }
    else if (e[0]?.horizontalRule) out.push({ type: 'horizontalrule', version: 1 })
    else if (e[0]?.inlineObjectElement) out.push({ type: 'upload', version: 3, relationTo: 'media', value: e[0].inlineObjectElement.inlineObjectId })
    else if (e[0]?.richLink) { const r = e[0].richLink.richLinkProperties ?? {}; out.push({ type: 'block', version: 2, fields: { blockType: 'driveFile', fileId: /\/d\/([\w-]+)/.exec(r.uri ?? '')?.[1], name: r.title, mimeType: r.mimeType, webViewLink: r.uri } }) }
    else if (p) out.push({ type: style ? 'heading' : 'paragraph', version: 1, ...(style ? { tag: `h${style[1]}` } : {}), children: e.flatMap(textOf) })
    else if (!(s.sectionBreak && i === 0)) lost.push(Object.keys(s).find((k) => !/Index$/.test(k)) ?? 'unknown')
    for (const k of e.flatMap((x: J) => Object.keys(x)).filter((k: string) => !/Index$|^(textRun|horizontalRule|inlineObjectElement|richLink)$/.test(k))) lost.push(k)
    return out
  }, [])
  const strip = (ns: J[]): J[] => ns.map(({ listId: _, ...n }) => (n.children ? { ...n, children: strip(n.children) } : n))
  return { doc: lexical(strip(walk(d.body?.content ?? []))), lost }
}
/** What a round trip keeps of a Lexical node */
const shapeNodes = (ns: J[] = []): J[] => ns.map((n) => ({ type: n.type, ...(n.tag ? { tag: n.tag } : {}), ...(n.listType ? { listType: n.listType } : {}), ...(n.text !== undefined ? { text: n.text, format: n.format ?? 0 } : {}), ...(n.fields?.url ? { url: n.fields.url } : {}), ...(n.fields?.fileId ? { fileId: n.fields.fileId } : {}), ...(n.children ? { children: shapeNodes(n.children) } : {}) }))
/** [File field, document field]; parents, size, appProperties (address, id) and permissions (published) beside */
const DRIVE: [string, string][] = [['id', 'fileId'], ['name', 'filename'], ['mimeType', 'mimeType'], ['description', 'alt'], ['createdTime', 'createdAt'], ['modifiedTime', 'updatedAt'], ['md5Checksum', 'md5'], ['webViewLink', 'url']]
const toDriveFile = (d: J): J => ({ ...Object.fromEntries(DRIVE.flatMap(([f, k]) => (d[k] == null ? [] : [[f, d[k]]]))), name: d.filename ?? d.title, mimeType: d.mimeType ?? 'application/vnd.google-apps.document', ...(d.parent ? { parents: [String(d.parent.id ?? d.parent)] } : {}), ...(d.filesize != null ? { size: String(d.filesize) } : {}), appProperties: keep({ qpu: d.uuid, payload: d.id == null ? undefined : String(d.id) }), permissions: d._status === 'published' ? [{ type: 'anyone', role: 'reader' }] : [] })
const toDriveDoc = (f: J): J => ({ ...Object.fromEntries(DRIVE.flatMap(([k, d]) => (f[k] == null ? [] : [[d, f[k]]]))), ...(f.parents?.[0] ? { parent: f.parents[0] } : {}), ...(f.size ? { filesize: Number(f.size) } : {}), ...(f.appProperties?.qpu ? { uuid: f.appProperties.qpu } : {}), ...(f.appProperties?.payload ? { id: f.appProperties.payload } : {}), _status: (f.permissions ?? []).some((p: J) => p.type === 'anyone') ? 'published' : 'draft' })
/** The Drive MCP's calls for a File, in its tools' shapes, run behind a QPU door with the tenant's token */
const buildDriveCalls = (f: J) => [{ name: 'create_file', arguments: keep({ title: f.name, contentMimeType: f.mimeType, parentId: f.parents?.[0] }) }, ...(f.id ? [{ name: 'get_file_metadata', arguments: { fileId: f.id, excludeContentSnippets: true } }, { name: 'read_file_content', arguments: { fileId: f.id } }, { name: 'search_files', arguments: { query: `parentId = '${f.id}'`, excludeContentSnippets: true } }] : [])]
const HELD: J = { forms: Object.values(FORM_KINDS).flat().filter((k) => typeof k === 'string' && /(Item|Question)$/.test(k)), docs: ['paragraph', 'table', 'textRun', 'horizontalRule', 'inlineObjectElement', 'richLink'], drive: [...DRIVE.map(([f]) => f), 'parents', 'size', 'appProperties', 'permissions'] }
/** The kinds the Discovery documents define, and any Sites API listed */
const listKinds = (d: J) => ({ forms: ['Item', 'Question'].flatMap((t) => Object.keys(d.forms?.schemas?.[t]?.properties ?? {}).filter((k) => k.endsWith(t))), docs: ['StructuralElement', 'ParagraphElement'].flatMap((t) => Object.keys(d.docs?.schemas?.[t]?.properties ?? {}).filter((k) => !/Index$/.test(k))), drive: Object.keys(d.drive?.schemas?.File?.properties ?? {}), sites: d.list ? (d.list.items ?? []).filter((i: J) => i.name === 'sites').map((i: J) => i.id) : null })
const measureWorkspaceCoverage = (k: J) => {
  const apis = Object.fromEntries(['forms', 'docs', 'drive'].map((a) => { const of = [...new Set<string>(k[a] ?? [])], held = of.filter((x) => HELD[a].includes(x)); return [a, { live: held.length, of: of.length, held, missing: of.filter((x) => !held.includes(x)) }] }))
  const leads = [...Object.entries(apis).flatMap(([a, c]) => c.missing.map((m: string) => ({ id: `workspace-${a}-${m}`, statement: `${m} of the ${a} API has no Payload counterpart yet`, evidence: (GOOGLE_DOCUMENTS as J)[a], status: 'open' }))), ...(!k.sites || k.sites.length ? [] : [{ id: 'probe-workspace-sites-api', statement: 'Google Discovery lists no Sites API: a Sites page is covered as the forms, documents and files it is made of', evidence: GOOGLE_DOCUMENTS.list, status: 'open' }])]
  return { ...apis, sites: { listed: k.sites ?? null }, leads }
}
/** The workspace door: each of discovery, kinds, form, forms, response, lexical, document, doc, file, answers given, answered both ways */
export const readWorkspace = (w: J) => {
  const s = (a: string) => w.discovery?.[a]?.schemas, check = (a: string, ref: string, v: unknown) => (s(a) ? findViolations(s(a), ref, v) : null), kinds = w.discovery ? listKinds(w.discovery) : w.kinds
  const form = w.form ? { forms: { info: { title: w.form.title, documentTitle: w.form.title }, items: (w.form.fields ?? []).map(toItem) } } : w.forms ? { forms: w.forms } : null
  const back = form && { title: form.forms.info?.title, fields: (form.forms.items ?? []).map(toBlock) }, docs = w.lexical ? readDoc(w.lexical) : w.document ? { document: w.document, lost: [] } : null, lex = docs && toLexical(docs.document), file = w.file ?? (w.doc ? toDriveFile(w.doc) : null)
  const requests = form && { create: { info: form.forms.info }, batchUpdate: { requests: form.forms.items.map((item: J, index: number) => ({ createItem: { item: JSON.parse(JSON.stringify(item, (k, v) => (/^(itemId|questionId)$/.test(k) ? undefined : v))), location: { index } } })) } }
  const files = (w.answers ?? []).flatMap((a: J) => a.result?.files ?? (a.result?.id ? [a.result] : []))
  return { ...(kinds ? { coverage: measureWorkspaceCoverage(kinds) } : {}), ...(w.discovery ? buildBlocks(s('forms'), s('drive')) : {}),
    ...(form ? { form: back, forms: form.forms, requests, same: JSON.stringify(form.forms.items) === JSON.stringify(back!.fields.map(toItem)), violations: [...(check('forms', 'Form', form.forms) ?? []), ...(check('forms', 'BatchUpdateFormRequest', requests!.batchUpdate) ?? [])] } : {}),
    ...(w.response ? { submission: { form: w.response.formId, submissionData: (Object.values(w.response.answers ?? {}) as J[]).map((a: J) => ({ field: a.questionId, value: (a.textAnswers?.answers ?? []).map((x: J) => x.value).join(', ') })) } } : {}),
    ...(docs && lex ? { document: docs.document, lexical: lex.doc, lost: [...docs.lost, ...lex.lost], same: JSON.stringify(shapeNodes((w.lexical ?? lex.doc).root.children)) === JSON.stringify(shapeNodes((w.lexical ? lex.doc : toLexical(readDoc(lex.doc).document).doc).root.children)), violations: check('docs', 'Document', docs.document) } : {}),
    ...(file ? { file, doc: toDriveDoc(file), same: w.doc ? eq(keep(w.doc), toDriveDoc(file)) : eq(file, toDriveFile(toDriveDoc(file))), calls: buildDriveCalls(file), door: WORKSPACE_MCP.find((m) => m.product === 'Drive')!.url, agrees: w.doc && w.file ? { md5: w.doc.md5 === w.file.md5Checksum, address: w.doc.uuid === w.file.appProperties?.qpu } : null, violations: check('drive', 'File', file) } : {}),
    ...(w.answers ? { files, docs: files.map(toDriveDoc), violations: files.flatMap((f: J) => check('drive', 'File', f) ?? []) } : {}), theorem: 'textbook_workspace_round_trip' }
}
