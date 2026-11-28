<script setup lang="ts">
// Post-Quantum Payload CMS v3 Studio:
// exercises every Lean-configured Payload UI possibility (47/47) over the harmonized QPU SDK,
// live NIST FIPS 203/204/205 + X-Wing cryptography, 122-qubit UUID registers, and Lean 4 theorem entanglements.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { data } from './index.data'
import { rpc } from '../mcp'

type StudioView = 'dashboard' | 'collections' | 'pqc' | 'entanglement' | 'builder' | 'possibilities'
type EditTab = 'fields' | 'preview' | 'versions' | 'api'
type FieldTab = 'overview' | 'proof' | 'mcp'
type ThemeMode = 'a432-harmonic' | 'obsidian-pqc' | 'paper-iso'
type LocaleCode = 'en' | 'bg' | 'de' | 'fr' | 'ja'
type BreakpointKey = 'mobile' | 'tablet' | 'desktop' | 'quantum'
type CollectionKey = keyof typeof data.collections

interface DrawerItem {
  title: string
  subtitle: string
  collection: string
  id: string
  doc: Record<string, unknown>
}

interface ToastItem {
  id: number
  title: string
  detail: string
  kind: 'ok' | 'info' | 'warn'
}

interface VersionSnapshot {
  version: number
  status: 'draft' | 'published'
  savedAt: string
  title: string
  statement: string
  hash: string
}

interface BuilderBlock {
  uid: string
  slug: string
  label: string
  standard: string
  heading: string
  caption: string
  algorithm: string
  theorem: string
  collapsed: boolean
}

const I18N: Record<LocaleCode, Record<string, string>> = {
  en: { studio: 'Post-Quantum Payload Studio', dashboard: 'Dashboard', collections: 'Collections', pqc: 'PQC Crypto Lab', entanglement: 'Entanglement Graph', builder: 'Blocks & Live Preview', possibilities: 'Payload UI Matrix', search: 'Search documents, theorems, tools…', preview: 'Live Preview', publish: 'Publish Sealed', draft: 'Save Draft' },
  bg: { studio: 'Постквантово Payload Студио', dashboard: 'Табло', collections: 'Колекции', pqc: 'PQC Крипто Лаб', entanglement: 'Граф на сплитания', builder: 'Блокове и преглед', possibilities: 'Payload UI Матрица', search: 'Търсене на документи, теореми, инструменти…', preview: 'Преглед на живо', publish: 'Публикувай', draft: 'Запази чернова' },
  de: { studio: 'Post-Quanten Payload Studio', dashboard: 'Übersicht', collections: 'Sammlungen', pqc: 'PQC-Krypto-Labor', entanglement: 'Verschränkungsgraph', builder: 'Blöcke & Live-Vorschau', possibilities: 'Payload UI Matrix', search: 'Dokumente, Theoreme, Tools suchen…', preview: 'Live-Vorschau', publish: 'Veröffentlichen', draft: 'Entwurf speichern' },
  fr: { studio: 'Studio Payload Post-Quantique', dashboard: 'Tableau de bord', collections: 'Collections', pqc: 'Labo Crypto PQC', entanglement: 'Graphe d’intrication', builder: 'Blocs & Aperçu', possibilities: 'Matrice UI Payload', search: 'Rechercher documents, théorèmes, outils…', preview: 'Aperçu en direct', publish: 'Publier scellé', draft: 'Brouillon' },
  ja: { studio: 'ポスト量子 Payload スタジオ', dashboard: 'ダッシュボード', collections: 'コレクション', pqc: 'PQC 暗号ラボ', entanglement: 'もつれグラフ', builder: 'ブロック＆プレビュー', possibilities: 'Payload UI 一覧', search: 'ドキュメント・定理・ツールを検索…', preview: 'ライブプレビュー', publish: '公開（封印済）', draft: '下書き保存' },
}

const manifest = data.manifest
const activeView = ref<StudioView>('dashboard')
const navCollapsed = ref(false)
const themeMode = ref<ThemeMode>('a432-harmonic')
const tenant = ref(manifest.admin.tenants[0]?.host ?? 'qpu.uuidna.com')
const locale = ref<LocaleCode>('en')
const splitPreview = ref(false)
const breakpoint = ref<BreakpointKey>('desktop')

// Collection list + query builder + bulk actions state
const activeCollection = ref<CollectionKey>('products')
const listMode = ref<'table' | 'cards'>('table')
const searchText = ref('')
const whereField = ref('theorem')
const whereOp = ref<'contains' | 'equals' | 'not_equals'>('contains')
const whereValue = ref('')
const visibleCols = ref<Record<string, boolean>>({})
const showColMenu = ref(false)
const selectedIds = ref<string[]>([])
const livePages = ref<Partial<Record<CollectionKey, { page: number; totalPages: number; totalDocs: number; docs: Record<string, unknown>[] }>>>({})
const loadingPage = ref(false)

// Document Editor state
const editingDoc = ref<Record<string, unknown> | null>(null)
const editTab = ref<EditTab>('fields')
const fieldTab = ref<FieldTab>('overview')
const draftTitle = ref('')
const draftStatement = ref('')
const draftStatus = ref<'draft' | 'published'>('published')
const autosavedAt = ref('')
const collapsibleOpen = ref(true)
const versions = ref<VersionSnapshot[]>([])
const apiTab = ref<'rest' | 'gemini' | 'discovery' | 'sdk'>('rest')
const liveToolOutput = ref<Record<string, unknown> | null>(null)
const liveToolBusy = ref(false)

// Post-Quantum Cryptography Lab state
const selectedKem = ref<string>('X-Wing')
const selectedDsa = ref<string>('ML-DSA-65')
const pqcMessage = ref('ISO/IEC 4879:2024 · @uuidna/qpu · 122-qubit sealed message')
const pqcBusy = ref(false)
const kemResult = ref<Record<string, unknown>>(data.initialPqc.kem as unknown as Record<string, unknown>)
const dsaResult = ref<Record<string, unknown>>(data.initialPqc.dsa as unknown as Record<string, unknown>)
const enhanceResult = ref<Record<string, unknown> | null>(null)
const circuitResult = ref<Record<string, unknown> | null>(null)
const gqaiQubits = ref(8)
const gqaiDistance = ref(7)
const gqaiDepth = ref(24)
const gqaiBenchmark = ref('fusion-invsqrt')
const gqaiResult = ref<Record<string, unknown>>(data.gqai.challenges[0]?.baseline as unknown as Record<string, unknown>)
const seoAuditResult = ref<Record<string, unknown> | null>(null)
const mcpPingMs = ref<number | null>(null)

const runSeoMcpAudit = async (target = 'products') => {
  try {
    const res = await rpc('tools/call', { name: 'imagine', arguments: { catalog: { seo: { target, tool: `seo_${target}_audit` } } } })
    seoAuditResult.value = res
    pushToast('SEO MCP', `${target} audit`, 'ok')
  } catch {
    seoAuditResult.value = data.seoToolboxes as unknown as Record<string, unknown>
    pushToast('SEO Seed', `${target} seed`, 'info')
  }
}

// Theorem Entanglement Graph + ListDrawer state
const focusTheorem = ref(data.entangledCatalog[0]?.theorem ?? 'Advantage.advantage_unbounded')
const secondTheorem = ref(data.entangledCatalog[1]?.theorem ?? 'Advantage.two_pow_le_space')
const entanglementLive = ref<Record<string, unknown> | null>(null)
const listDrawerOpen = ref(false)
const listDrawerFilter = ref('')

// Blocks Page Builder state
const pageHeading = ref('Post-Quantum Verified Surface')
const richTextDraft = ref('Every 128-bit UUID folds into a 122-qubit content-addressed register verified by Lean 4 with zero sorry and sealed with NIST FIPS 203/204/205.')
const blocks = ref<BuilderBlock[]>([
  { uid: 'b-1', slug: 'register-telemetry', label: '122-Qubit Register', standard: 'ISO/IEC 4879:2024', heading: '122-Qubit UUID Register', caption: '5-segment balance · Grover floor 2^128 SHA-256', algorithm: 'X-Wing', theorem: 'textbook_capacity_conserved', collapsed: false },
  { uid: 'b-2', slug: 'pqc-workbench', label: 'PQC Lab', standard: 'FIPS 203/204/205', heading: 'Hybrid Post-Quantum Seal', caption: 'ML-KEM-768 + X25519 key agreement & ML-DSA-65 signatures', algorithm: 'ML-DSA-65', theorem: 'textbook_tamper_detected', collapsed: false },
  { uid: 'b-3', slug: 'theorem-entangler', label: 'Theorem Entangler', standard: 'Lean 4', heading: 'Kernel Proof Entanglements', caption: 'Direct & transitive Lean proof dependencies exposed as MCP tools', algorithm: 'ML-KEM-1024', theorem: 'Advantage.advantage_unbounded', collapsed: false },
])

// Possibilities matrix filter
const possibilityCat = ref<string>('all')

// Overlays: Stacked DocumentDrawer, CommandPalette (Cmd+K), Account Drawer, Toasts
const drawerStack = ref<DrawerItem[]>([])
const cmdOpen = ref(false)
const cmdQuery = ref('')
const accountOpen = ref(false)
const toasts = ref<ToastItem[]>([])
let toastSeq = 1

const t = (key: string) => I18N[locale.value][key] ?? I18N.en[key] ?? key

const shortHex = (v: unknown, n = 28) => {
  const s = String(v ?? '')
  return s.length > n ? `${s.slice(0, n)}… (${s.length / 2} B)` : s
}

const digestText = (input: string) => {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

// a toast stands five beats of the period that times the studio
const TOAST_MS = 5 * Number.parseFloat(data.period)
const pushToast = (title: string, detail: string, kind: ToastItem['kind'] = 'ok') => {
  const id = toastSeq++
  toasts.value = [{ id, title, detail, kind }, ...toasts.value.slice(0, 3)]
  setTimeout(() => { toasts.value = toasts.value.filter((x) => x.id !== id) }, TOAST_MS)
}

const copyText = async (label: string, text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    pushToast('Copied', `${label} copied to clipboard`, 'info')
  } catch {
    pushToast('Copy ready', `${label} (${text.length} chars)`, 'info')
  }
}

const currentSpec = computed(() => manifest.collections.find((c) => c.slug === activeCollection.value) ?? manifest.collections[0]!)

const currentPageData = computed(() => {
  const live = livePages.value[activeCollection.value]
  if (live) return live
  const seed = data.collections[activeCollection.value]
  return { page: seed.page, totalPages: seed.totalPages, totalDocs: seed.totalDocs, docs: seed.docs as unknown as Record<string, unknown>[] }
})

const activeColumns = computed(() => {
  const base = ['id', ...currentSpec.value.defaultColumns]
  return base.filter((c) => visibleCols.value[c] !== false)
})

const filteredDocs = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  const wv = whereValue.value.trim().toLowerCase()
  return currentPageData.value.docs.filter((doc) => {
    if (q && !JSON.stringify(doc).toLowerCase().includes(q)) return false
    if (wv) {
      const val = String(doc[whereField.value] ?? '').toLowerCase()
      if (whereOp.value === 'contains' && !val.includes(wv)) return false
      if (whereOp.value === 'equals' && val !== wv) return false
      if (whereOp.value === 'not_equals' && val === wv) return false
    }
    return true
  })
})

const resetColumns = () => {
  const next: Record<string, boolean> = { id: true }
  for (const c of currentSpec.value.defaultColumns) next[c] = true
  visibleCols.value = next
  whereField.value = currentSpec.value.listSearchableFields[0] ?? 'id'
  selectedIds.value = []
}

watch(activeCollection, () => {
  resetColumns()
  editingDoc.value = null
})

const fetchCollectionPage = async (col: CollectionKey, page: number) => {
  loadingPage.value = true
  try {
    const res = await fetch(`/api/${col}?page=${page}&limit=24`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json() as { page: number; totalPages: number; totalDocs: number; docs: Record<string, unknown>[] }
    livePages.value = { ...livePages.value, [col]: json }
    pushToast('Loaded page', `${col} · page ${json.page}/${json.totalPages}`, 'info')
  } catch {
    pushToast('Static seed active', `Showing build-time page for ${col}`, 'warn')
  } finally {
    loadingPage.value = false
  }
}

const openDocumentEditor = async (col: CollectionKey, doc: Record<string, unknown>) => {
  activeCollection.value = col
  activeView.value = 'collections'
  let full = doc
  if (col === 'products') {
    const pre = data.entangledCatalog.find((e) => e.id === doc.id || e.theorem === doc.theorem)
    if (pre) {
      full = { ...doc, ...pre }
    } else {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(String(doc.id))}`)
        if (res.ok) full = await res.json() as Record<string, unknown>
      } catch { /* use seed doc */ }
    }
  }
  editingDoc.value = full
  editTab.value = 'fields'
  fieldTab.value = 'overview'
  draftTitle.value = String(full[currentSpec.value.useAsTitle] ?? full.title ?? full.id)
  draftStatement.value = String(full.statement ?? full.says ?? JSON.stringify(full.arguments ?? {}, null, 2))
  draftStatus.value = full._status === 'draft' ? 'draft' : 'published'
  autosavedAt.value = 'Sealed at build'
  versions.value = [
    { version: 1, status: 'published', savedAt: 'Kernel sealed', title: draftTitle.value, statement: draftStatement.value, hash: digestText(draftTitle.value + draftStatement.value) },
  ]
  liveToolOutput.value = null
}

const saveVersion = (status: 'draft' | 'published') => {
  draftStatus.value = status
  const now = new Date().toLocaleTimeString()
  autosavedAt.value = `${status} · ${now}`
  const snap: VersionSnapshot = {
    version: versions.value.length + 1,
    status,
    savedAt: now,
    title: draftTitle.value,
    statement: draftStatement.value,
    hash: digestText(draftTitle.value + draftStatement.value + status),
  }
  versions.value = [snap, ...versions.value]
  pushToast(status === 'published' ? 'Published sealed snapshot' : 'Draft autosaved', `v${snap.version} · hash ${snap.hash}`, 'ok')
}

const restoreVersion = (snap: VersionSnapshot) => {
  draftTitle.value = snap.title
  draftStatement.value = snap.statement
  draftStatus.value = snap.status
  pushToast('Version restored', `Restored v${snap.version} (${snap.hash})`, 'info')
}

const openDrawer = async (collection: string, id: string, title?: string, preloaded?: Record<string, unknown>) => {
  let doc = preloaded ?? null
  if (!doc && collection === 'products') {
    doc = (data.entangledCatalog.find((e) => e.id === id || e.theorem === id) as unknown as Record<string, unknown>) ?? null
  }
  if (!doc) {
    try {
      const res = await fetch(`/api/${collection}/${encodeURIComponent(id)}`)
      if (res.ok) doc = await res.json() as Record<string, unknown>
    } catch { /* fallback below */ }
  }
  const finalDoc = doc ?? { id, collection, title: title ?? id }
  drawerStack.value = [
    ...drawerStack.value,
    {
      title: title ?? String(finalDoc.theorem ?? finalDoc.title ?? finalDoc.reference ?? finalDoc.name ?? id),
      subtitle: `${collection} · ${String(finalDoc.id ?? id).slice(0, 18)}`,
      collection,
      id: String(finalDoc.id ?? id),
      doc: finalDoc,
    },
  ]
}

const popDrawer = (index?: number) => {
  if (typeof index === 'number') {
    drawerStack.value = drawerStack.value.slice(0, index)
  } else {
    drawerStack.value = drawerStack.value.slice(0, -1)
  }
}

const runComputation = async (tool: string, args: Record<string, unknown>) => {
  liveToolBusy.value = true
  try {
    const r = await rpc('tools/call', { name: tool, arguments: args })
    const out = (r?.result?.structuredContent ?? r) as Record<string, unknown>
    liveToolOutput.value = out
    pushToast(`MCP ${tool}`, 'Executed via /api/mcp connector', 'ok')
    return out
  } catch {
    const fallback = { tool, arguments: args, offlinePreview: true, seal: digestText(tool + JSON.stringify(args)) }
    liveToolOutput.value = fallback
    pushToast('Preview mode', `MCP connector /api/mcp activates on Cloudflare`, 'warn')
    return fallback
  } finally {
    liveToolBusy.value = false
  }
}

// Live PQC actions
const kemAlgorithms = computed(() => manifest.pqc.algorithms.filter((a) => a === 'X-Wing' || a.startsWith('ML-KEM')))
const dsaAlgorithms = computed(() => manifest.pqc.algorithms.filter((a) => a.startsWith('ML-DSA') || a.startsWith('SLH-DSA')))

const runKem = async () => {
  pqcBusy.value = true
  try {
    const out = await runComputation('seal', { kem: { algorithm: selectedKem.value } })
    const res = (out.result ?? out) as Record<string, unknown>
    if (res.algorithm) kemResult.value = res
  } finally {
    pqcBusy.value = false
  }
}

const runDsa = async () => {
  pqcBusy.value = true
  try {
    const out = await runComputation('seal', { slh: { algorithm: selectedDsa.value }, text: pqcMessage.value })
    const res = (out.result ?? out) as Record<string, unknown>
    if (res.algorithm) dsaResult.value = res
  } finally {
    pqcBusy.value = false
  }
}

const runGoogleEnhance = async (api = 'gemini.generateContent', payload?: Record<string, unknown>) => {
  pqcBusy.value = true
  try {
    const res = await fetch('/api/globals/google', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        api,
        payload: payload ?? { tenant: tenant.value, message: pqcMessage.value, algorithm: selectedDsa.value },
        theorem: focusTheorem.value,
        targetTheorem: secondTheorem.value,
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    enhanceResult.value = await res.json() as Record<string, unknown>
    pushToast('Google API Enhanced', `122-qubit receipt ${String(enhanceResult.value.handle ?? '')}`, 'ok')
  } catch {
    const h = digestText(api + pqcMessage.value)
    enhanceResult.value = { phase: 'google-enhanced', api, handle: h, sealed: true, note: 'Deploy Worker for live SHA-256 & entanglement execution' }
    pushToast('Receipt preview', `Handle ${h}`, 'info')
  } finally {
    pqcBusy.value = false
  }
}

const runGqaiVerify = async () => {
  pqcBusy.value = true
  try {
    const res = await fetch('/api/globals/google', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'verify-compilation',
        qubits: gqaiQubits.value,
        distance: gqaiDistance.value,
        rawDepth: gqaiDepth.value,
        benchmark: gqaiBenchmark.value,
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    gqaiResult.value = await res.json() as Record<string, unknown>
    pushToast('GQAI Compilation Checked', `Status: ${String(gqaiResult.value.evidenceStatus)}`, gqaiResult.value.evidenceStatus === 'supported' ? 'ok' : 'warn')
  } catch {
    const minDepth = 2 * gqaiQubits.value - 1
    const phys = 2 * gqaiDistance.value * gqaiDistance.value - 2 * gqaiDistance.value + 1
    const ok = gqaiDistance.value % 2 === 1 && gqaiDepth.value >= minDepth
    gqaiResult.value = { logicalQubits: gqaiQubits.value, codeDistance: gqaiDistance.value, requiredPhysicalQubits: phys, minAllowedDepth: minDepth, rawDepth: gqaiDepth.value, isCompilationValid: ok, evidenceStatus: ok ? 'supported' : 'blocked' }
    pushToast('GQAI Local Check', ok ? 'supported' : 'blocked', ok ? 'ok' : 'warn')
  } finally {
    pqcBusy.value = false
  }
}

const runQuantumCircuit = async () => {
  pqcBusy.value = true
  try {
    const out = await runComputation('echo', { qubits: 3, depth: 2 })
    circuitResult.value = (out.result ?? out) as Record<string, unknown>
  } finally {
    pqcBusy.value = false
  }
}

// Entanglement constellation graph
const focusedEntry = computed(() => data.entangledCatalog.find((e) => e.theorem === focusTheorem.value) ?? data.entangledCatalog[0]!)
const constellationNodes = computed(() => {
  const list = focusedEntry.value?.entanglements ?? []
  const count = Math.max(1, list.length)
  return list.map((e, idx) => {
    const angle = (idx / count) * Math.PI * 2 - Math.PI / 2
    const radius = idx % 2 === 0 ? 124 : 152
    return {
      ...e,
      x: 220 + Math.cos(angle) * radius,
      y: 175 + Math.sin(angle) * radius,
      label: e.targetTheorem.split('.').pop() ?? e.targetTheorem,
    }
  })
})

const runEntanglePair = async (source = focusTheorem.value, target = secondTheorem.value) => {
  try {
    const r = await rpc('tools/call', { name: 'imagine', arguments: { catalog: { interact: { source, target } } } })
    const out = (r?.result?.structuredContent ?? r) as Record<string, unknown>
    entanglementLive.value = out
    pushToast('Theorems entangled', `${source.split('.').pop()} ↔ ${target.split('.').pop()} via /api/mcp`, 'ok')
  } catch {
    const entry = data.entangledCatalog.find((e) => e.theorem === source)
    const hit = entry?.entanglements.find((e) => e.targetTheorem === target)
    entanglementLive.value = {
      source,
      target,
      entangled: Boolean(hit),
      direct: Boolean(hit),
      direction: hit?.direction ?? 'indirect',
      mcpTool: hit?.mcpTool ?? null,
    }
    pushToast('Entanglement checked', hit ? `Direct ${hit.direction} edge` : 'Inspected via static catalog', 'info')
  }
}

// Bulk actions
const toggleSelectAll = () => {
  if (selectedIds.value.length === filteredDocs.value.length) {
    selectedIds.value = []
  } else {
    selectedIds.value = filteredDocs.value.map((d) => String(d.id))
  }
}

const toggleRowSelect = (id: string) => {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((x) => x !== id)
    : [...selectedIds.value, id]
}

const bulkExport = (format: 'json' | 'jsonld') => {
  const rows = filteredDocs.value.filter((d) => selectedIds.value.includes(String(d.id)))
  const payload = format === 'jsonld'
    ? { '@context': 'https://schema.org', '@type': 'ItemList', numberOfItems: rows.length, itemListElement: rows }
    : { collection: activeCollection.value, count: rows.length, docs: rows }
  void copyText(`${rows.length} docs (${format.toUpperCase()})`, JSON.stringify(payload, null, 2))
}

// Blocks Page Builder actions
const addBlock = (slug: string) => {
  const spec = manifest.blocks.find((b) => b.slug === slug) ?? manifest.blocks[0]!
  blocks.value = [
    ...blocks.value,
    {
      uid: `b-${Date.now()}-${blocks.value.length}`,
      slug: spec.slug,
      label: spec.label,
      standard: spec.standard,
      heading: `${spec.label} Block`,
      caption: `Lean-verified ${spec.standard} surface`,
      algorithm: selectedKem.value,
      theorem: focusTheorem.value,
      collapsed: false,
    },
  ]
  pushToast('Block added', spec.label, 'ok')
}

const moveBlock = (index: number, delta: number) => {
  const target = index + delta
  if (target < 0 || target >= blocks.value.length) return
  const next = [...blocks.value]
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item!)
  blocks.value = next
}

const duplicateBlock = (index: number) => {
  const src = blocks.value[index]!
  const copy = { ...src, uid: `b-${Date.now()}-copy`, heading: `${src.heading} (Copy)` }
  const next = [...blocks.value]
  next.splice(index + 1, 0, copy)
  blocks.value = next
  pushToast('Block duplicated', copy.heading, 'info')
}

const removeBlock = (index: number) => {
  blocks.value = blocks.value.filter((_, i) => i !== index)
}

const exportPageSeed = () => {
  const seed = {
    title: pageHeading.value,
    slug: pageHeading.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    tenant: tenant.value,
    locale: locale.value,
    _status: 'published',
    richText: richTextDraft.value,
    layout: blocks.value.map((b) => ({ blockType: b.slug, heading: b.heading, caption: b.caption, standard: b.standard, algorithm: b.algorithm, theorem: b.theorem })),
  }
  void copyText('Payload Page Seed', JSON.stringify(seed, null, 2))
}

// Possibilities matrix & live jump
const possibilityCategories = computed(() => ['all', ...new Set(manifest.possibilities.map((p) => p.category))])
const filteredPossibilities = computed(() => possibilityCat.value === 'all' ? manifest.possibilities : manifest.possibilities.filter((p) => p.category === possibilityCat.value))

const jumpToPossibility = (p: (typeof manifest.possibilities)[number]) => {
  if (p.id === 'CommandPalette') { cmdOpen.value = true; return }
  if (p.id === 'DocumentDrawer') { void openDrawer('products', focusedEntry.value.id, focusedEntry.value.theorem, focusedEntry.value as unknown as Record<string, unknown>); return }
  if (p.id === 'ListDrawer') { activeView.value = 'entanglement'; listDrawerOpen.value = true; return }
  if (p.id === 'Toast') { pushToast('Sealed Toast', `UUID register 122/122 · ${tenant.value}`, 'ok'); return }
  if (p.id === 'views.account') { accountOpen.value = true; return }
  if (p.id === 'views.livePreview' || p.id === 'livePreviewBreakpoints') { activeView.value = 'builder'; splitPreview.value = true; return }
  if (p.id === 'editView' || p.id === 'DocumentHeader' || p.id === 'DocumentTabs' || p.id === 'DocumentSidebar' || p.id === 'versionsDiff' || p.id === 'draftsAutosave' || p.id === 'apiInspector' || p.id === 'tabs' || p.id === 'code' || p.id === 'json' || p.id === 'collapsible' || p.id === 'row' || p.id === 'group' || p.id === 'array') {
    void openDocumentEditor('products', data.collections.products.docs[0] as unknown as Record<string, unknown>)
    if (p.id === 'versionsDiff' || p.id === 'draftsAutosave') editTab.value = 'versions'
    if (p.id === 'apiInspector') editTab.value = 'api'
    return
  }
  activeView.value = p.view
  pushToast(p.id, `Active surface: ${p.surface}`, 'info')
}

// Command Palette items
const cmdItems = computed(() => {
  const q = cmdQuery.value.trim().toLowerCase()
  const base = [
    { group: 'Views', label: 'Dashboard · Quantum OS Pivot', action: () => { activeView.value = 'dashboard' } },
    { group: 'Views', label: 'PQC Crypto Lab · FIPS 203/204/205 & X-Wing', action: () => { activeView.value = 'pqc' } },
    { group: 'Views', label: 'Theorem Entanglement Constellation', action: () => { activeView.value = 'entanglement' } },
    { group: 'Views', label: 'Post-Quantum Blocks & Split Live Preview', action: () => { activeView.value = 'builder' } },
    { group: 'Views', label: 'Payload UI Possibilities Matrix (47/47)', action: () => { activeView.value = 'possibilities' } },
    ...manifest.collections.map((c) => ({
      group: 'Collections',
      label: `${c.slug} (${c.totalDocs} docs · ${c.group})`,
      action: () => { activeCollection.value = c.slug as CollectionKey; activeView.value = 'collections' },
    })),
    ...data.entangledCatalog.map((e) => ({
      group: 'Theorems',
      label: `${e.theorem} (${e.entanglementCount} entanglements)`,
      action: () => { focusTheorem.value = e.theorem; void openDrawer('products', e.id, e.theorem, e as unknown as Record<string, unknown>) },
    })),
    ...manifest.pqc.algorithms.map((alg) => ({
      group: 'PQC',
      label: `Run ${alg}`,
      action: () => {
        activeView.value = 'pqc'
        if (alg === 'X-Wing' || alg.startsWith('ML-KEM')) { selectedKem.value = alg; void runKem() }
        else { selectedDsa.value = alg; void runDsa() }
      },
    })),
  ]
  return q ? base.filter((i) => i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q)) : base
})

const runCmd = (fn: () => void) => {
  cmdOpen.value = false
  cmdQuery.value = ''
  fn()
}

const onKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    cmdOpen.value = !cmdOpen.value
  } else if (e.key === 'Escape') {
    if (cmdOpen.value) cmdOpen.value = false
    else if (listDrawerOpen.value) listDrawerOpen.value = false
    else if (accountOpen.value) accountOpen.value = false
    else if (drawerStack.value.length) popDrawer()
  }
}

const previewWidthStyle = computed(() => {
  if (breakpoint.value === 'mobile') return { maxWidth: '375px' }
  if (breakpoint.value === 'tablet') return { maxWidth: '768px' }
  if (breakpoint.value === 'desktop') return { maxWidth: '1120px' }
  return { maxWidth: '100%' }
})

const registerSegments = [
  { name: 'handle', qubits: 32, pct: 25, role: 'SKU / fractal handle' },
  { name: 'ver', qubits: 4, pct: 3.125, role: 'RFC 9562 v4' },
  { name: 'program', qubits: 40, pct: 31.25, role: 'Kernel opcode space' },
  { name: 'var', qubits: 2, pct: 1.5625, role: 'RFC 9562 variant' },
  { name: 'tail', qubits: 48, pct: 37.5, role: 'Parameter tail' },
]

const openGlobalDrawer = async (slug: string) => {
  const seedMap: Record<string, Record<string, unknown>> = {
    catalog: data.summary as unknown as Record<string, unknown>,
    'payload-ui': manifest as unknown as Record<string, unknown>,
    google: data.google as unknown as Record<string, unknown>,
    'quantum-os': data.pivot as unknown as Record<string, unknown>,
    'seo-mcp': data.seoToolboxes as unknown as Record<string, unknown>,
    'clay-1000bit': data.clay1000 as unknown as Record<string, unknown>,
    rbac: data.rbac as unknown as Record<string, unknown>,
  }
  let live: Record<string, unknown> | undefined
  if (slug !== 'quantum-os' && slug !== 'seo-mcp' && slug !== 'rbac') {
    try {
      const res = await fetch(`/api/globals/${encodeURIComponent(slug)}`)
      if (res.ok) live = await res.json() as Record<string, unknown>
    } catch { /* use build-time seed */ }
  }
  void openDrawer('globals', slug, slug, live ?? seedMap[slug] ?? { slug })
}

onMounted(async () => {
  resetColumns()
  window.addEventListener('keydown', onKeyDown)
  const t0 = performance.now()
  try {
    await rpc('tools/call', { name: 'fold', arguments: { qubits: 4 } })
    mcpPingMs.value = Math.round(performance.now() - t0)
  } catch {
    mcpPingMs.value = null
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div class="pq-studio" :data-theme="themeMode" :style="{ '--qpu-period': data.period }">
    <!-- Payload admin.components.header: Post-Quantum Global Status Banner -->
    <header class="pq-banner" role="banner">
      <div class="pq-banner__left">
        <span class="pq-pulse" aria-hidden="true" />
        <strong>122/122 Qubits</strong>
        <span class="pq-sep">·</span>
        <span>Lean 4 Kernel: <b>0 sorry</b></span>
        <span class="pq-sep">·</span>
        <span>NIST PQC: <b>FIPS 203 / 204 / 205 · X-Wing</b></span>
        <span class="pq-sep">·</span>
        <span>Grover Floor: <b>2<sup>128</sup></b></span>
        <span v-if="mcpPingMs !== null" class="pq-pill pq-pill--ok">MCP {{ mcpPingMs }} ms</span>
        <span v-else class="pq-pill">Edge Ready</span>
      </div>
      <!-- Payload admin.components.actions -->
      <div class="pq-banner__actions">
        <button class="pq-btn pq-btn--ghost" title="Command Palette (⌘K)" @click="cmdOpen = true">
          <span>⌘K</span> Search
        </button>
        <button class="pq-btn pq-btn--ghost" :class="{ 'is-active': splitPreview }" @click="splitPreview = !splitPreview">
          {{ t('preview') }}
        </button>
        <select v-model="themeMode" class="pq-select" aria-label="Theme">
          <option value="a432-harmonic">Harmonic A432</option>
          <option value="obsidian-pqc">Obsidian PQC</option>
          <option value="paper-iso">Paper ISO</option>
        </select>
        <button class="pq-btn pq-btn--accent" @click="accountOpen = true">PQC Identity</button>
      </div>
    </header>

    <div class="pq-shell" :class="{ 'is-collapsed': navCollapsed }">
      <!-- Payload admin.components.Nav + graphics.Logo / graphics.Icon + beforeNavLinks + afterNavLinks -->
      <aside class="pq-nav" aria-label="Payload Studio Navigation">
        <div class="pq-nav__brand">
          <img :src="'/favicon.svg'" alt="QPU Folded Hex Ring" class="pq-logo" />
          <div v-if="!navCollapsed" class="pq-nav__title">
            <span>{{ t('studio') }}</span>
            <small>{{ manifest.standard }} · v{{ manifest.version }}</small>
          </div>
          <button class="pq-icon-btn" :title="navCollapsed ? 'Expand nav' : 'Collapse nav'" @click="navCollapsed = !navCollapsed">
            {{ navCollapsed ? '→' : '←' }}
          </button>
        </div>

        <!-- Payload beforeNavLinks: Multi-Tenant & Localization Switchers -->
        <div v-if="!navCollapsed" class="pq-nav__controls">
          <label class="pq-mini-label">
            Tenant
            <select v-model="tenant" class="pq-select pq-select--full">
              <option v-for="tn in manifest.admin.tenants" :key="tn.host" :value="tn.host">{{ tn.host }}</option>
            </select>
          </label>
          <label class="pq-mini-label">
            Locale
            <select v-model="locale" class="pq-select pq-select--full">
              <option v-for="lc in manifest.admin.locales" :key="lc" :value="lc">{{ lc.toUpperCase() }}</option>
            </select>
          </label>
        </div>

        <nav class="pq-nav__groups">
          <div class="pq-nav__group">
            <div v-if="!navCollapsed" class="pq-nav__group-label">Workspace</div>
            <button class="pq-nav__item" :class="{ 'is-active': activeView === 'dashboard' }" @click="activeView = 'dashboard'">
              <span>◈</span><span v-if="!navCollapsed">{{ t('dashboard') }}</span>
            </button>
            <button class="pq-nav__item" :class="{ 'is-active': activeView === 'pqc' }" @click="activeView = 'pqc'">
              <span>⛨</span><span v-if="!navCollapsed">{{ t('pqc') }}</span>
            </button>
            <button class="pq-nav__item" :class="{ 'is-active': activeView === 'entanglement' }" @click="activeView = 'entanglement'">
              <span>✦</span><span v-if="!navCollapsed">{{ t('entanglement') }}</span>
            </button>
            <button class="pq-nav__item" :class="{ 'is-active': activeView === 'builder' }" @click="activeView = 'builder'">
              <span>◫</span><span v-if="!navCollapsed">{{ t('builder') }}</span>
            </button>
            <button class="pq-nav__item" :class="{ 'is-active': activeView === 'possibilities' }" @click="activeView = 'possibilities'">
              <span>✓</span><span v-if="!navCollapsed">{{ t('possibilities') }}</span>
              <span v-if="!navCollapsed" class="pq-badge pq-badge--ok">{{ manifest.coverage.total }}/{{ manifest.coverage.total }}</span>
            </button>
          </div>

          <div class="pq-nav__group">
            <div v-if="!navCollapsed" class="pq-nav__group-label">{{ t('collections') }} ({{ manifest.collections.length }})</div>
            <button
              v-for="col in manifest.collections"
              :key="col.slug"
              class="pq-nav__item"
              :class="{ 'is-active': activeView === 'collections' && activeCollection === col.slug }"
              @click="activeCollection = col.slug as CollectionKey; activeView = 'collections'"
            >
              <span>▤</span>
              <span v-if="!navCollapsed">{{ col.slug }}</span>
              <span v-if="!navCollapsed" class="pq-badge">{{ col.totalDocs }}</span>
            </button>
          </div>

          <div v-if="!navCollapsed" class="pq-nav__group">
            <div class="pq-nav__group-label">Globals ({{ manifest.globals.length }})</div>
            <button v-for="g in manifest.globals" :key="g" class="pq-nav__item" @click="openGlobalDrawer(g)">
              <span>◎</span><span>{{ g }}</span>
            </button>
          </div>
        </nav>

        <!-- Payload afterNavLinks: Official Payload Plugins Health Rail -->
        <div v-if="!navCollapsed" class="pq-nav__plugins">
          <div class="pq-nav__group-label">Official Plugins ({{ manifest.admin.plugins.length }})</div>
          <div class="pq-chip-wrap">
            <span v-for="pl in manifest.admin.plugins" :key="pl" class="pq-chip">
              {{ pl.replace('@payloadcms/plugin-', '') }}
            </span>
          </div>
        </div>
      </aside>

      <!-- Main Stage + Optional Split Live Preview -->
      <main class="pq-main" :class="{ 'has-split': splitPreview && activeView !== 'builder' }">
        <div class="pq-stage">
          <!-- VIEW 1: DASHBOARD -->
          <section v-if="activeView === 'dashboard'" class="pq-section">
            <!-- beforeDashboard: 122-Qubit UUID Register Telemetry -->
            <div class="pq-card pq-hero-card">
              <div class="pq-card__head">
                <div>
                  <span class="pq-eyebrow">beforeDashboard · 122-Qubit Register Telemetry</span>
                  <h1>{{ t('studio') }}</h1>
                  <p class="pq-muted">
                    One Lean-authored schema serving Payload CMS UI, VitePress static edge assets, Cloudflare Workers, NIST FIPS 203/204/205 post-quantum cryptography, and Google APIs on <b>{{ tenant }}</b>.
                  </p>
                </div>
                <div class="pq-hero-actions">
                  <button class="pq-btn pq-btn--accent" @click="activeView = 'pqc'">Launch PQC Lab</button>
                  <button class="pq-btn" @click="activeView = 'entanglement'">Explore Entanglements</button>
                  <button class="pq-btn" @click="activeView = 'builder'">Open Block Builder</button>
                </div>
              </div>

              <div class="pq-register-bar" aria-label="128-bit to 122-qubit UUID register folding">
                <div
                  v-for="seg in registerSegments"
                  :key="seg.name"
                  class="pq-register-seg"
                  :style="{ width: `${seg.pct}%` }"
                  :title="`${seg.name}: ${seg.qubits} (${seg.role})`"
                >
                  <span>{{ seg.name }}</span>
                  <small>{{ seg.qubits }}</small>
                </div>
              </div>

              <div class="pq-kpi-grid">
                <div class="pq-kpi">
                  <small>Kernel Theorems</small>
                  <strong>{{ data.summary.products.toLocaleString() }}</strong>
                  <span>0 sorry · Lean 4</span>
                </div>
                <div class="pq-kpi">
                  <small>Entanglement Edges</small>
                  <strong>{{ data.summary.entanglements.toLocaleString() }}</strong>
                  <span>{{ data.summary.mcpTools.toLocaleString() }} client MCP tools</span>
                </div>
                <div class="pq-kpi">
                  <small>Post-Quantum Suite</small>
                  <strong>{{ manifest.pqc.algorithms.length }}</strong>
                  <span>X-Wing · ML-KEM · ML-DSA · SLH-DSA</span>
                </div>
                <div class="pq-kpi">
                  <small>Payload UI Coverage</small>
                  <strong>{{ manifest.coverage.percent }}%</strong>
                  <span>{{ manifest.coverage.total }} / {{ manifest.coverage.total }} possibilities</span>
                </div>
              </div>
            </div>

            <!-- Collection Quick Launch Cards -->
            <div class="pq-grid-3">
              <article
                v-for="col in manifest.collections"
                :key="col.slug"
                class="pq-card pq-card--interactive"
                @click="activeCollection = col.slug as CollectionKey; activeView = 'collections'"
              >
                <div class="pq-card__row">
                  <span class="pq-eyebrow">{{ col.group }}</span>
                  <span class="pq-badge">{{ col.totalDocs.toLocaleString() }}</span>
                </div>
                <h3>{{ col.slug }}</h3>
                <p class="pq-muted">Title: <code>{{ col.useAsTitle }}</code> · {{ col.fields.length }} fields · Drafts &amp; Autosave</p>
                <div class="pq-chip-wrap">
                  <span v-for="f in col.fields.slice(0, 4)" :key="f.name" class="pq-chip">{{ f.type }}:{{ f.name }}</span>
                </div>
              </article>
            </div>

            <!-- Quantum OS Fractal Pivot -->
            <div class="pq-card">
              <div class="pq-card__row">
                <div>
                  <span class="pq-eyebrow">Quantum OS Fractal Pivot</span>
                  <h2>7-Scale Post-Quantum Architecture</h2>
                </div>
                <button class="pq-btn" @click="openGlobalDrawer('quantum-os')">Inspect JSON Drawer</button>
              </div>
              <div class="pq-table-wrap">
                <table class="pq-table">
                  <thead>
                    <tr><th>Scale</th><th>Entity</th><th>Verified Count</th><th>Surface</th><th>Endpoint</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in data.pivot.rows" :key="row.scale">
                      <td><code>{{ row.scale }}</code></td>
                      <td><b>{{ row.entity }}</b></td>
                      <td>{{ row.count }}</td>
                      <td><code>{{ row.surface }}</code></td>
                      <td><code>{{ row.endpoint }}</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- afterDashboard: Google APIs & MCP Enhancement Surface -->
            <div class="pq-card">
              <div class="pq-card__row">
                <div>
                  <span class="pq-eyebrow">afterDashboard · Seamless Google APIs Integration</span>
                  <h2>Google APIs &amp; Gemini Function Declarations</h2>
                </div>
                <button class="pq-btn pq-btn--accent" @click="runGoogleEnhance('gemini.generateContent')">
                  Seal Live Google Receipt
                </button>
              </div>
              <div class="pq-grid-3">
                <div v-for="s in data.google.surfaces" :key="s.surface" class="pq-subcard">
                  <div class="pq-card__row">
                    <b>{{ s.surface }}</b>
                    <span class="pq-chip">{{ s.protocol }}</span>
                  </div>
                  <p class="pq-muted">{{ s.improves }}</p>
                  <code>{{ s.qpuEndpoint }}</code>
                </div>
              </div>
              <pre v-if="enhanceResult" class="pq-code">{{ JSON.stringify(enhanceResult, null, 2) }}</pre>
            </div>

            <!-- Google Quantum AI Challenge Implementation Matrix -->
            <div class="pq-card">
              <div class="pq-card__row">
                <div>
                  <span class="pq-eyebrow">Google Quantum AI Challenges · Kaggle kickmix &amp; XPRIZE Stage III</span>
                  <h2>Verifiable Circuit Compilation &amp; Resource Matrix</h2>
                </div>
                <div class="pq-row-gap">
                  <button class="pq-btn" @click="copyText('Google Apps Script', data.appsScript.code)">Copy Apps Script</button>
                  <button class="pq-btn pq-btn--accent" :disabled="pqcBusy" @click="runGqaiVerify">Verify Compilation</button>
                </div>
              </div>
              <div class="pq-grid-2">
                <div v-for="ch in data.gqai.challenges" :key="ch.id" class="pq-subcard">
                  <div class="pq-card__row">
                    <b>{{ ch.title }}</b>
                    <span class="pq-chip">{{ ch.target }}</span>
                  </div>
                  <p class="pq-muted">{{ ch.metric }} · Artefacts: <code>{{ ch.artefacts.join(', ') }}</code></p>
                  <div class="pq-chip-wrap">
                    <span class="pq-pill pq-pill--ok">Bounds: {{ ch.baseline.evidenceStatus }}</span>
                    <span class="pq-pill">Submission: {{ ch.submissionStatus }}</span>
                    <span v-for="w in ch.witnesses" :key="w" class="pq-chip">{{ w }}</span>
                  </div>
                </div>
              </div>
              <div class="pq-filter-bar" style="margin-top: 12px">
                <select v-model="gqaiBenchmark" class="pq-select">
                  <option v-for="ch in data.gqai.challenges" :key="ch.id" :value="ch.id">{{ ch.title }}</option>
                </select>
                <label class="pq-mini-label">Qubits<input v-model.number="gqaiQubits" type="number" min="1" class="pq-input" /></label>
                <label class="pq-mini-label">Distance d<input v-model.number="gqaiDistance" type="number" min="1" step="2" class="pq-input" /></label>
                <label class="pq-mini-label">Raw Depth<input v-model.number="gqaiDepth" type="number" min="1" class="pq-input" /></label>
              </div>
              <pre v-if="gqaiResult" class="pq-code">{{ JSON.stringify(gqaiResult, null, 2) }}</pre>
            </div>

            <!-- SEO MCP Toolboxes · Clay 1000-Bit · Google RBAC -->
            <div class="pq-grid-3">
              <div class="pq-card">
                <div class="pq-card__row">
                  <span class="pq-eyebrow">@payloadcms/plugin-seo</span>
                  <span class="pq-badge">{{ data.seoToolboxes.averageScore }}/100</span>
                </div>
                <h3>SEO MCP Toolboxes</h3>
                <p class="pq-muted">{{ data.seoToolboxes.count }} targets · {{ data.seoToolboxes.totalTools }} tools · {{ data.seoToolboxes.handle }}</p>
                <div class="pq-row-gap">
                  <button class="pq-btn pq-btn--accent" @click="runSeoMcpAudit('products')">Audit Products</button>
                  <button class="pq-btn" @click="openGlobalDrawer('seo-mcp')">JSON</button>
                </div>
              </div>

              <div class="pq-card">
                <div class="pq-card__row">
                  <span class="pq-eyebrow">Clay 1000-Bit</span>
                  <span class="pq-badge">{{ data.clay1000.register.holding }}/38</span>
                </div>
                <h3>2^999 + 1 Limbs</h3>
                <p class="pq-muted">{{ data.clay1000.cyclotomic1000.limbs16 }} limbs · {{ data.clay1000.cyclotomic1000.products }} products · {{ data.clay1000.handle }}</p>
                <div class="pq-row-gap">
                  <button class="pq-btn" @click="openGlobalDrawer('clay-1000bit')">Inspect JSON</button>
                </div>
              </div>

              <div class="pq-card">
                <div class="pq-card__row">
                  <span class="pq-eyebrow">Google RBAC</span>
                  <span class="pq-badge">{{ data.rbac.leadsServed }}/8</span>
                </div>
                <h3>Scoped Policy Engine</h3>
                <p class="pq-muted">{{ data.rbac.subjects }} subjects · {{ data.rbac.abilities }} abilities · ML-DSA-65 · {{ data.rbac.handle }}</p>
                <div class="pq-row-gap">
                  <button class="pq-btn" @click="openGlobalDrawer('rbac')">Inspect JSON</button>
                </div>
              </div>
            </div>

            <pre v-if="seoAuditResult" class="pq-code">{{ JSON.stringify(seoAuditResult, null, 2) }}</pre>
          </section>

          <!-- VIEW 2: COLLECTIONS (LIST VIEW + FULL DOCUMENT EDITOR) -->
          <section v-else-if="activeView === 'collections'" class="pq-section">
            <!-- Document Edit View -->
            <div v-if="editingDoc" class="pq-editor">
              <!-- DocumentHeader -->
              <div class="pq-card pq-doc-header">
                <div class="pq-doc-header__top">
                  <div class="pq-breadcrumbs">
                    <button class="pq-link" @click="editingDoc = null">{{ activeCollection }}</button>
                    <span>/</span>
                    <code>{{ String(editingDoc.id) }}</code>
                  </div>
                  <div class="pq-doc-header__actions">
                    <span class="pq-pill" :class="draftStatus === 'published' ? 'pq-pill--ok' : ''">{{ draftStatus }}</span>
                    <span class="pq-muted">{{ autosavedAt }}</span>
                    <button class="pq-btn" @click="saveVersion('draft')">{{ t('draft') }}</button>
                    <button class="pq-btn pq-btn--accent" @click="saveVersion('published')">{{ t('publish') }}</button>
                    <button class="pq-btn pq-btn--ghost" @click="editingDoc = null">✕</button>
                  </div>
                </div>
                <h2>{{ draftTitle }}</h2>
                <!-- DocumentTabs -->
                <div class="pq-tabs" role="tablist">
                  <button class="pq-tab" :class="{ 'is-active': editTab === 'fields' }" @click="editTab = 'fields'">Edit Fields</button>
                  <button class="pq-tab" :class="{ 'is-active': editTab === 'preview' }" @click="editTab = 'preview'">Live Preview</button>
                  <button class="pq-tab" :class="{ 'is-active': editTab === 'versions' }" @click="editTab = 'versions'">Versions &amp; Diff ({{ versions.length }})</button>
                  <button class="pq-tab" :class="{ 'is-active': editTab === 'api' }" @click="editTab = 'api'">API &amp; Google Adapters</button>
                </div>
              </div>

              <div class="pq-editor-grid">
                <div class="pq-editor-main">
                  <!-- Edit Fields Tab -->
                  <div v-if="editTab === 'fields'" class="pq-card">
                    <!-- Payload `tabs` field -->
                    <div class="pq-subtabs">
                      <button class="pq-subtab" :class="{ 'is-active': fieldTab === 'overview' }" @click="fieldTab = 'overview'">Overview (row / group)</button>
                      <button class="pq-subtab" :class="{ 'is-active': fieldTab === 'proof' }" @click="fieldTab = 'proof'">Formal Proof &amp; Relations (code / join)</button>
                      <button class="pq-subtab" :class="{ 'is-active': fieldTab === 'mcp' }" @click="fieldTab = 'mcp'">Client MCP Tools (array / json)</button>
                    </div>

                    <div v-if="fieldTab === 'overview'" class="pq-form-stack">
                      <!-- Payload `row` field -->
                      <div class="pq-field-row">
                        <label class="pq-field">
                          <span>{{ currentSpec.useAsTitle }} <small>text</small></span>
                          <input v-model="draftTitle" class="pq-input" />
                        </label>
                        <label class="pq-field">
                          <span>Collection <small>select</small></span>
                          <input :value="activeCollection" readonly class="pq-input" />
                        </label>
                      </div>
                      <!-- Payload `richText` field preview -->
                      <label class="pq-field">
                        <span>Statement / Content <small>code / richText</small></span>
                        <textarea v-model="draftStatement" rows="5" class="pq-textarea" />
                      </label>
                      <!-- Payload `collapsible` field -->
                      <div class="pq-collapsible">
                        <button class="pq-collapsible__head" @click="collapsibleOpen = !collapsibleOpen">
                          <span>Collapsible · Cryptographic Receipt &amp; Metadata (group)</span>
                          <span>{{ collapsibleOpen ? '−' : '+' }}</span>
                        </button>
                        <div v-if="collapsibleOpen" class="pq-collapsible__body">
                          <div class="pq-field-row">
                            <div class="pq-kv"><small>Sealed UUID</small><code>{{ String(editingDoc.id) }}</code></div>
                            <div class="pq-kv"><small>Module / Toolbox</small><code>{{ String(editingDoc.module ?? editingDoc.toolbox ?? editingDoc.standard ?? 'qpu') }}</code></div>
                            <div class="pq-kv"><small>VitePress Path</small><code>{{ String(editingDoc.vitepressPath ?? `/catalog/${editingDoc.id}`) }}</code></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-else-if="fieldTab === 'proof'" class="pq-form-stack">
                      <div class="pq-field">
                        <span>Lean 4 Kernel Statement <small>code</small></span>
                        <pre class="pq-code">{{ draftStatement }}</pre>
                      </div>
                      <!-- Payload `relationship` & `join` fields -->
                      <div class="pq-field">
                        <span>Entangled Theorems <small>relationship + join · click to open nested DocumentDrawer</small></span>
                        <div v-if="Array.isArray(editingDoc.entanglements) && editingDoc.entanglements.length" class="pq-chip-wrap">
                          <button
                            v-for="e in (editingDoc.entanglements as any[])"
                            :key="e.variantId"
                            class="pq-rel-chip"
                            @click="openDrawer('products', e.targetProduct, e.targetTheorem)"
                          >
                            <span class="pq-dir" :data-dir="e.direction">{{ e.direction }}</span>
                            <span>{{ e.targetTheorem }}</span>
                          </button>
                        </div>
                        <p v-else class="pq-muted">No direct theorem entanglements on this collection record. Switch to a theorem product or run Entangle.</p>
                      </div>
                    </div>

                    <div v-else class="pq-form-stack">
                      <!-- Payload `array` field of executable MCP client tools -->
                      <div v-if="Array.isArray(editingDoc.mcpTools) && editingDoc.mcpTools.length" class="pq-array-list">
                        <div v-for="(tool, idx) in (editingDoc.mcpTools as any[]).slice(0, 8)" :key="idx" class="pq-array-item">
                          <div>
                            <b>{{ tool.name }}</b>
                            <span class="pq-chip">{{ tool.kind }}</span>
                            <div class="pq-muted">{{ tool.description }}</div>
                          </div>
                          <button
                            class="pq-btn pq-btn--accent"
                            :disabled="liveToolBusy"
                            @click="runComputation(tool.call?.params?.name ?? 'verify', tool.call?.params?.arguments ?? {})"
                          >
                            Execute Live
                          </button>
                        </div>
                      </div>
                      <pre v-if="liveToolOutput" class="pq-code">{{ JSON.stringify(liveToolOutput, null, 2) }}</pre>
                      <pre class="pq-code">{{ JSON.stringify(editingDoc, null, 2) }}</pre>
                    </div>
                  </div>

                  <!-- Live Preview Tab -->
                  <div v-else-if="editTab === 'preview'" class="pq-card">
                    <div class="pq-card__row">
                      <span class="pq-eyebrow">views.livePreview · Synchronized Viewport</span>
                      <div class="pq-bp-bar">
                        <button v-for="bp in manifest.admin.livePreviewBreakpoints" :key="bp.name" class="pq-btn pq-btn--ghost" :class="{ 'is-active': breakpoint === bp.name }" @click="breakpoint = bp.name as BreakpointKey">
                          {{ bp.label }} <small v-if="bp.width">{{ bp.width }}px</small>
                        </button>
                      </div>
                    </div>
                    <div class="pq-preview-frame" :style="previewWidthStyle">
                      <div class="pq-preview-pill">{{ tenant }} · {{ locale.toUpperCase() }} · {{ draftStatus }}</div>
                      <h3>{{ draftTitle }}</h3>
                      <pre class="pq-code">{{ draftStatement }}</pre>
                      <div class="pq-preview-meta">
                        <span>UUID: <code>{{ String(editingDoc.id) }}</code></span>
                        <span>Licence: <code>{{ manifest.licence }}</code></span>
                      </div>
                    </div>
                  </div>

                  <!-- Versions & Cryptographic Diff Tab -->
                  <div v-else-if="editTab === 'versions'" class="pq-card">
                    <span class="pq-eyebrow">versionsDiff · Cryptographic Snapshot History</span>
                    <div class="pq-diff-grid">
                      <div class="pq-subcard">
                        <b>Published Baseline (v1)</b>
                        <pre class="pq-code">{{ versions[versions.length - 1]?.title }}\n\n{{ versions[versions.length - 1]?.statement }}</pre>
                      </div>
                      <div class="pq-subcard">
                        <b>Working Draft (Current)</b>
                        <pre class="pq-code">{{ draftTitle }}\n\n{{ draftStatement }}</pre>
                      </div>
                    </div>
                    <div class="pq-table-wrap">
                      <table class="pq-table">
                        <thead><tr><th>Version</th><th>Status</th><th>Saved</th><th>Digest</th><th>Action</th></tr></thead>
                        <tbody>
                          <tr v-for="v in versions" :key="v.version">
                            <td><code>v{{ v.version }}</code></td>
                            <td><span class="pq-pill">{{ v.status }}</span></td>
                            <td>{{ v.savedAt }}</td>
                            <td><code>{{ v.hash }}</code></td>
                            <td><button class="pq-btn pq-btn--ghost" @click="restoreVersion(v)">Restore</button></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- API Inspector Tab -->
                  <div v-else class="pq-card">
                    <div class="pq-subtabs">
                      <button class="pq-subtab" :class="{ 'is-active': apiTab === 'rest' }" @click="apiTab = 'rest'">Payload REST</button>
                      <button class="pq-subtab" :class="{ 'is-active': apiTab === 'gemini' }" @click="apiTab = 'gemini'">Gemini Tools</button>
                      <button class="pq-subtab" :class="{ 'is-active': apiTab === 'discovery' }" @click="apiTab = 'discovery'">Google Discovery</button>
                      <button class="pq-subtab" :class="{ 'is-active': apiTab === 'sdk' }" @click="apiTab = 'sdk'">SDK Snippet</button>
                    </div>
                    <pre v-if="apiTab === 'rest'" class="pq-code">{{ JSON.stringify(editingDoc, null, 2) }}</pre>
                    <pre v-else-if="apiTab === 'gemini'" class="pq-code">GET https://{{ tenant }}/api/globals/google?view=gemini-tools&amp;product={{ encodeURIComponent(String(editingDoc.theorem ?? editingDoc.id)) }}</pre>
                    <pre v-else-if="apiTab === 'discovery'" class="pq-code">{{ JSON.stringify(data.discovery, null, 2) }}</pre>
                    <pre v-else class="pq-code">import { createQpuSdk } from '@uuidna/qpu'
const qpu = createQpuSdk('https://{{ tenant }}')
const doc = await qpu.findByID({ collection: '{{ activeCollection }}', id: '{{ editingDoc.id }}' })
const ui = await qpu.findGlobal({ slug: 'payload-ui' })
const live = await qpu.mcp('tools/call', { name: 'metrics', arguments: {} })</pre>
                  </div>
                </div>

                <!-- DocumentSidebar (position: 'sidebar' + custom `ui` field) -->
                <aside class="pq-card pq-doc-sidebar">
                  <span class="pq-eyebrow">DocumentSidebar · position: 'sidebar'</span>
                  <div class="pq-kv"><small>122-Qubit UUID</small><code>{{ String(editingDoc.id) }}</code></div>
                  <div class="pq-kv"><small>Handle SKU</small><code>{{ String(editingDoc.id).slice(0, 8) }}</code></div>
                  <label class="pq-field">
                    <span>Status</span>
                    <select v-model="draftStatus" class="pq-select pq-select--full">
                      <option value="published">published</option>
                      <option value="draft">draft</option>
                    </select>
                  </label>
                  <div class="pq-kv"><small>Standard</small><span>{{ manifest.standard }}</span></div>
                  <div class="pq-kv"><small>Licence</small><span>{{ manifest.licence }}</span></div>
                  <!-- Custom `ui` field -->
                  <div class="pq-subcard">
                    <b>Post-Quantum Witness (`ui`)</b>
                    <p class="pq-muted">Sign this document with live FIPS 204 ML-DSA-65 or seal via Google APIs.</p>
                    <div class="pq-stack-sm">
                      <button class="pq-btn pq-btn--accent" @click="pqcMessage = `${activeCollection}:${editingDoc.id}:${draftTitle}`; runDsa()">Sign with ML-DSA-65</button>
                      <button class="pq-btn" @click="runGoogleEnhance('qpu.document', { collection: activeCollection, id: editingDoc.id, title: draftTitle })">Google Enhance Receipt</button>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            <!-- Collection List View -->
            <div v-else class="pq-stack">
              <!-- beforeListTable -->
              <div class="pq-card">
                <div class="pq-card__row">
                  <div>
                    <span class="pq-eyebrow">listView · {{ currentSpec.group }}</span>
                    <h2>{{ activeCollection }} <small class="pq-muted">({{ currentPageData.totalDocs.toLocaleString() }} docs)</small></h2>
                  </div>
                  <div class="pq-row-gap">
                    <button class="pq-btn pq-btn--ghost" :class="{ 'is-active': listMode === 'table' }" @click="listMode = 'table'">Table</button>
                    <button class="pq-btn pq-btn--ghost" :class="{ 'is-active': listMode === 'cards' }" @click="listMode = 'cards'">Cards</button>
                    <button class="pq-btn pq-btn--ghost" @click="showColMenu = !showColMenu">Columns</button>
                  </div>
                </div>

                <!-- Column visibility toggles (defaultColumns) -->
                <div v-if="showColMenu" class="pq-col-menu">
                  <label v-for="col in ['id', ...currentSpec.defaultColumns]" :key="col" class="pq-check">
                    <input type="checkbox" :checked="visibleCols[col] !== false" @change="visibleCols[col] = !visibleCols[col]" />
                    <span>{{ col }}</span>
                  </label>
                </div>

                <!-- listSearchableFields + queryBuilder (where clause) -->
                <div class="pq-filter-bar">
                  <input v-model="searchText" class="pq-input pq-input--grow" :placeholder="t('search')" />
                  <select v-model="whereField" class="pq-select">
                    <option v-for="f in currentSpec.listSearchableFields" :key="f" :value="f">where.{{ f }}</option>
                  </select>
                  <select v-model="whereOp" class="pq-select">
                    <option value="contains">contains</option>
                    <option value="equals">equals</option>
                    <option value="not_equals">not_equals</option>
                  </select>
                  <input v-model="whereValue" class="pq-input" placeholder="filter value…" />
                </div>

                <!-- bulkActions bar -->
                <div v-if="selectedIds.length" class="pq-bulk-bar">
                  <span><b>{{ selectedIds.length }}</b> selected</span>
                  <div class="pq-row-gap">
                    <button class="pq-btn pq-btn--accent" @click="bulkExport('json')">Export JSON</button>
                    <button class="pq-btn" @click="bulkExport('jsonld')">Export JSON-LD</button>
                    <button class="pq-btn pq-btn--ghost" @click="selectedIds = []">Clear</button>
                  </div>
                </div>

                <!-- Table Mode -->
                <div v-if="listMode === 'table'" class="pq-table-wrap">
                  <table class="pq-table">
                    <thead>
                      <tr>
                        <th style="width: 32px"><input type="checkbox" :checked="selectedIds.length === filteredDocs.length && filteredDocs.length > 0" @change="toggleSelectAll" /></th>
                        <th v-for="col in activeColumns" :key="col">{{ col }}</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="doc in filteredDocs" :key="String(doc.id)">
                        <td><input type="checkbox" :checked="selectedIds.includes(String(doc.id))" @change="toggleRowSelect(String(doc.id))" /></td>
                        <td v-for="col in activeColumns" :key="col">
                          <code v-if="col === 'id' || col === 'address'">{{ String(doc[col] ?? '').slice(0, 14) }}…</code>
                          <span v-else>{{ String(doc[col] ?? '—').slice(0, 64) }}</span>
                        </td>
                        <td class="pq-row-gap">
                          <button class="pq-btn pq-btn--ghost" @click="openDocumentEditor(activeCollection, doc)">Edit</button>
                          <button class="pq-btn pq-btn--ghost" @click="openDrawer(activeCollection, String(doc.id), String(doc[currentSpec.useAsTitle] ?? doc.id), doc)">Drawer</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Cards Mode -->
                <div v-else class="pq-grid-3">
                  <article v-for="doc in filteredDocs" :key="String(doc.id)" class="pq-subcard pq-card--interactive" @click="openDocumentEditor(activeCollection, doc)">
                    <div class="pq-card__row">
                      <code>{{ String(doc.id).slice(0, 13) }}…</code>
                      <span class="pq-chip">{{ activeCollection }}</span>
                    </div>
                    <h4>{{ String(doc[currentSpec.useAsTitle] ?? doc.title ?? doc.id) }}</h4>
                    <p class="pq-muted">{{ String(doc.module ?? doc.says ?? doc.tool ?? doc.direction ?? '').slice(0, 90) }}</p>
                  </article>
                </div>

                <!-- afterListTable + pagination -->
                <div class="pq-pagination">
                  <span>Page <b>{{ currentPageData.page }}</b> of <b>{{ currentPageData.totalPages }}</b> · {{ currentPageData.totalDocs.toLocaleString() }} total</span>
                  <div class="pq-row-gap">
                    <button class="pq-btn" :disabled="loadingPage || currentPageData.page <= 1" @click="fetchCollectionPage(activeCollection, currentPageData.page - 1)">← Prev</button>
                    <button class="pq-btn" :disabled="loadingPage || currentPageData.page >= currentPageData.totalPages" @click="fetchCollectionPage(activeCollection, currentPageData.page + 1)">Next →</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- VIEW 3: POST-QUANTUM CRYPTOGRAPHY LIVE WORKBENCH -->
          <section v-else-if="activeView === 'pqc'" class="pq-section">
            <div class="pq-card">
              <span class="pq-eyebrow">NIST FIPS 203 · 204 · 205 · X-Wing Live Workbench</span>
              <h2>Post-Quantum Cryptography &amp; Quantum Simulation</h2>
              <p class="pq-muted">Every round-trip executes real <code>@noble/post-quantum</code> lattice &amp; stateless hash-based primitives through QPU's Cloudflare Worker.</p>

              <div class="pq-grid-2">
                <!-- KEM Panel -->
                <div class="pq-subcard">
                  <div class="pq-card__row">
                    <b>Key Encapsulation (FIPS 203 / Hybrid)</b>
                    <span class="pq-pill pq-pill--ok">{{ kemResult.agrees ? 'Shared Secret Agrees ✓' : 'Ready' }}</span>
                  </div>
                  <div class="pq-field-row">
                    <select v-model="selectedKem" class="pq-select pq-select--full">
                      <option v-for="alg in kemAlgorithms" :key="alg" :value="alg">{{ alg }}</option>
                    </select>
                    <button class="pq-btn pq-btn--accent" :disabled="pqcBusy" @click="runKem">Run KEM Round-Trip</button>
                  </div>
                  <div class="pq-kv"><small>Algorithm</small><code>{{ kemResult.algorithm }} (FIPS {{ kemResult.fips ?? 203 }})</code></div>
                  <div class="pq-kv"><small>Public Key</small><code>{{ shortHex(kemResult.publicKey) }}</code></div>
                  <div class="pq-kv"><small>Ciphertext</small><code>{{ shortHex(kemResult.cipherText) }}</code></div>
                  <div v-if="kemResult.sizes" class="pq-chip-wrap">
                    <span v-for="(val, k) in (kemResult.sizes as Record<string, number>)" :key="k" class="pq-chip">{{ k }}: {{ val }} B</span>
                  </div>
                </div>

                <!-- DSA Panel -->
                <div class="pq-subcard">
                  <div class="pq-card__row">
                    <b>Digital Signatures (FIPS 204 / 205)</b>
                    <span class="pq-pill pq-pill--ok">{{ dsaResult.verified && dsaResult.refusesChanged ? 'Verified & Tamper-Refused ✓' : 'Ready' }}</span>
                  </div>
                  <div class="pq-field-row">
                    <select v-model="selectedDsa" class="pq-select pq-select--full">
                      <option v-for="alg in dsaAlgorithms" :key="alg" :value="alg">{{ alg }}</option>
                    </select>
                    <button class="pq-btn pq-btn--accent" :disabled="pqcBusy" @click="runDsa">Sign &amp; Verify</button>
                  </div>
                  <input v-model="pqcMessage" class="pq-input" placeholder="Message to sign…" />
                  <div class="pq-kv"><small>Algorithm</small><code>{{ dsaResult.algorithm }} (FIPS {{ dsaResult.fips ?? 204 }})</code></div>
                  <div class="pq-kv"><small>Public Key</small><code>{{ shortHex(dsaResult.publicKey) }}</code></div>
                  <div class="pq-kv"><small>Signature</small><code>{{ shortHex(dsaResult.signature) }}</code></div>
                  <div v-if="dsaResult.sizes" class="pq-chip-wrap">
                    <span v-for="(val, k) in (dsaResult.sizes as Record<string, number>)" :key="k" class="pq-chip">{{ k }}: {{ val }} B</span>
                  </div>
                </div>
              </div>

              <div class="pq-row-gap" style="margin-top: 14px">
                <button class="pq-btn" :disabled="pqcBusy" @click="runQuantumCircuit">Run Quantum Echoes Circuit</button>
                <button class="pq-btn" :disabled="pqcBusy" @click="runGoogleEnhance('vertexai.pqc')">Enhance via Google APIs</button>
              </div>
              <pre v-if="circuitResult" class="pq-code">{{ JSON.stringify(circuitResult, null, 2) }}</pre>
              <pre v-if="enhanceResult" class="pq-code">{{ JSON.stringify(enhanceResult, null, 2) }}</pre>
            </div>
          </section>

          <!-- VIEW 4: THEOREM ENTANGLEMENT GRAPH -->
          <section v-else-if="activeView === 'entanglement'" class="pq-section">
            <div class="pq-card">
              <div class="pq-card__row">
                <div>
                  <span class="pq-eyebrow">relationship + join · Lean Kernel Proof Entanglements</span>
                  <h2>Theorem Entanglement Constellation</h2>
                </div>
                <div class="pq-row-gap">
                  <select v-model="focusTheorem" class="pq-select">
                    <option v-for="item in data.entangledCatalog" :key="item.id" :value="item.theorem">{{ item.theorem }}</option>
                  </select>
                  <button class="pq-btn pq-btn--accent" @click="listDrawerOpen = true">Pick Pair (ListDrawer)</button>
                </div>
              </div>

              <div class="pq-grid-2">
                <div class="pq-graph-box">
                  <svg viewBox="0 0 440 350" class="pq-svg" role="img" :aria-label="`Entanglement constellation for ${focusTheorem}`">
                    <circle cx="220" cy="175" r="124" class="pq-orbit" />
                    <circle cx="220" cy="175" r="152" class="pq-orbit pq-orbit--outer" />
                    <g v-for="n in constellationNodes" :key="n.variantId">
                      <line x1="220" y1="175" :x2="n.x" :y2="n.y" :class="['pq-edge', `pq-edge--${n.direction}`]" />
                      <g class="pq-node" @click="openDrawer('products', n.targetProduct, n.targetTheorem)">
                        <circle :cx="n.x" :cy="n.y" r="12" :class="['pq-node-dot', `pq-node-dot--${n.direction}`]" />
                        <text :x="n.x" :y="n.y + 24" text-anchor="middle" class="pq-node-label">{{ n.label.slice(0, 22) }}</text>
                      </g>
                    </g>
                    <g class="pq-node" @click="openDrawer('products', focusedEntry.id, focusedEntry.theorem, focusedEntry as unknown as Record<string, unknown>)">
                      <circle cx="220" cy="175" r="22" class="pq-node-center" />
                      <text x="220" y="179" text-anchor="middle" class="pq-node-center-label">QPU</text>
                    </g>
                  </svg>
                  <div class="pq-legend">
                    <span><i class="pq-dot pq-dot--uses" /> uses (outgoing)</span>
                    <span><i class="pq-dot pq-dot--usedBy" /> usedBy (reverse join)</span>
                  </div>
                </div>

                <div class="pq-stack">
                  <div class="pq-subcard">
                    <b>{{ focusedEntry.theorem }}</b>
                    <div class="pq-muted">{{ focusedEntry.module }} · {{ focusedEntry.entanglementCount }} edges</div>
                    <pre class="pq-code">{{ focusedEntry.statement }}</pre>
                  </div>
                  <div class="pq-subcard">
                    <b>Live Entanglement Interaction</b>
                    <p class="pq-muted">Source: <code>{{ focusTheorem }}</code><br />Target: <code>{{ secondTheorem }}</code></p>
                    <button class="pq-btn pq-btn--accent" @click="runEntanglePair()">Entangle via /api/mcp</button>
                    <pre v-if="entanglementLive" class="pq-code">{{ JSON.stringify(entanglementLive, null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- VIEW 5: BLOCKS PAGE BUILDER & SPLIT LIVE PREVIEW -->
          <section v-else-if="activeView === 'builder'" class="pq-section">
            <div class="pq-builder-grid">
              <div class="pq-card">
                <div class="pq-card__row">
                  <div>
                    <span class="pq-eyebrow">blocks + richText · Modular Post-Quantum Page Builder</span>
                    <h2>Page Blocks ({{ blocks.length }})</h2>
                  </div>
                  <button class="pq-btn pq-btn--accent" @click="exportPageSeed">Export Payload Seed</button>
                </div>

                <div class="pq-form-stack">
                  <label class="pq-field">
                    <span>Page Heading <small>text</small></span>
                    <input v-model="pageHeading" class="pq-input" />
                  </label>
                  <label class="pq-field">
                    <span>Lexical Lead Narrative <small>richText</small></span>
                    <textarea v-model="richTextDraft" rows="3" class="pq-textarea" />
                  </label>
                </div>

                <div class="pq-add-bar">
                  <button v-for="b in manifest.blocks" :key="b.slug" class="pq-chip pq-chip--btn" @click="addBlock(b.slug)">
                    + {{ b.label }}
                  </button>
                </div>

                <div class="pq-stack" style="margin-top: 12px">
                  <div v-for="(blk, idx) in blocks" :key="blk.uid" class="pq-block-item">
                    <div class="pq-block-item__head">
                      <div>
                        <b>{{ idx + 1 }}. {{ blk.label }}</b>
                        <span class="pq-chip">{{ blk.standard }}</span>
                      </div>
                      <div class="pq-row-gap">
                        <button class="pq-icon-btn" title="Move up" @click="moveBlock(idx, -1)">↑</button>
                        <button class="pq-icon-btn" title="Move down" @click="moveBlock(idx, 1)">↓</button>
                        <button class="pq-icon-btn" title="Duplicate" @click="duplicateBlock(idx)">⧉</button>
                        <button class="pq-icon-btn" title="Collapse" @click="blk.collapsed = !blk.collapsed">{{ blk.collapsed ? '+' : '−' }}</button>
                        <button class="pq-icon-btn" title="Remove" @click="removeBlock(idx)">✕</button>
                      </div>
                    </div>
                    <div v-if="!blk.collapsed" class="pq-block-item__body">
                      <div class="pq-field-row">
                        <label class="pq-field">
                          <span>Heading</span>
                          <input v-model="blk.heading" class="pq-input" />
                        </label>
                        <label class="pq-field">
                          <span>PQC Algorithm</span>
                          <select v-model="blk.algorithm" class="pq-select pq-select--full">
                            <option v-for="a in manifest.pqc.algorithms" :key="a" :value="a">{{ a }}</option>
                          </select>
                        </label>
                      </div>
                      <label class="pq-field">
                        <span>Caption</span>
                        <input v-model="blk.caption" class="pq-input" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Synchronized Live Preview Pane -->
              <div class="pq-card">
                <div class="pq-card__row">
                  <span class="pq-eyebrow">views.livePreview · Real-Time Output</span>
                  <div class="pq-bp-bar">
                    <button v-for="bp in manifest.admin.livePreviewBreakpoints" :key="bp.name" class="pq-btn pq-btn--ghost" :class="{ 'is-active': breakpoint === bp.name }" @click="breakpoint = bp.name as BreakpointKey">
                      {{ bp.label }}
                    </button>
                  </div>
                </div>
                <div class="pq-preview-frame" :style="previewWidthStyle">
                  <div class="pq-preview-pill">{{ tenant }} · {{ locale.toUpperCase() }} · Live Preview</div>
                  <h2 style="margin: 8px 0">{{ pageHeading }}</h2>
                  <p class="pq-muted">{{ richTextDraft }}</p>
                  <div class="pq-stack" style="margin-top: 14px">
                    <div v-for="blk in blocks" :key="blk.uid" class="pq-preview-block">
                      <div class="pq-card__row">
                        <b>{{ blk.heading }}</b>
                        <span class="pq-pill pq-pill--ok">{{ blk.algorithm }} · {{ blk.standard }}</span>
                      </div>
                      <p class="pq-muted">{{ blk.caption }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- VIEW 6: PAYLOAD UI POSSIBILITIES MATRIX (47/47 = 100%) -->
          <section v-else class="pq-section">
            <div class="pq-card">
              <div class="pq-card__row">
                <div>
                  <span class="pq-eyebrow">Lean-Generated Audit · Config.payloadUiPossibilities</span>
                  <h2>Payload UI Possibilities ({{ manifest.coverage.used }} / {{ manifest.coverage.total }} · {{ manifest.coverage.percent }}%)</h2>
                </div>
                <div class="pq-chip-wrap">
                  <button
                    v-for="cat in possibilityCategories"
                    :key="cat"
                    class="pq-chip pq-chip--btn"
                    :class="{ 'is-active': possibilityCat === cat }"
                    @click="possibilityCat = cat"
                  >
                    {{ cat }}
                  </button>
                </div>
              </div>

              <div class="pq-table-wrap">
                <table class="pq-table">
                  <thead>
                    <tr><th>Used</th><th>Payload UI Possibility</th><th>Category</th><th>Post-Quantum Surface</th><th>Try Live</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="p in filteredPossibilities" :key="p.id">
                      <td><span class="pq-pill pq-pill--ok">✓</span></td>
                      <td><code>{{ p.id }}</code></td>
                      <td><span class="pq-chip">{{ p.category }}</span></td>
                      <td><code>{{ p.surface }}</code></td>
                      <td><button class="pq-btn pq-btn--ghost" @click="jumpToPossibility(p)">Experience →</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <!-- Global Split Live Preview Drawer when toggled from Top Actions -->
        <aside v-if="splitPreview && activeView !== 'builder'" class="pq-split-preview">
          <div class="pq-card__row">
            <span class="pq-eyebrow">Live Preview · {{ tenant }}</span>
            <button class="pq-icon-btn" @click="splitPreview = false">✕</button>
          </div>
          <div class="pq-bp-bar" style="margin: 8px 0">
            <button v-for="bp in manifest.admin.livePreviewBreakpoints" :key="bp.name" class="pq-btn pq-btn--ghost" :class="{ 'is-active': breakpoint === bp.name }" @click="breakpoint = bp.name as BreakpointKey">
              {{ bp.label }}
            </button>
          </div>
          <div class="pq-preview-frame" :style="previewWidthStyle">
            <div class="pq-preview-pill">{{ activeView }} · {{ locale.toUpperCase() }}</div>
            <h3>{{ editingDoc ? draftTitle : pageHeading }}</h3>
            <p class="pq-muted">{{ editingDoc ? draftStatement : richTextDraft }}</p>
            <div class="pq-kv"><small>KEM</small><code>{{ kemResult.algorithm }} · agrees={{ kemResult.agrees }}</code></div>
            <div class="pq-kv"><small>DSA</small><code>{{ dsaResult.algorithm }} · verified={{ dsaResult.verified }}</code></div>
          </div>
        </aside>
      </main>
    </div>

    <!-- STACKED DOCUMENT DRAWERS (DocumentDrawer) -->
    <div v-if="drawerStack.length" class="pq-backdrop" @click.self="popDrawer(0)">
      <aside
        v-for="(dr, idx) in drawerStack"
        :key="`${dr.id}-${idx}`"
        class="pq-drawer"
        :style="{ width: `min(620px, calc(100vw - ${idx * 28}px))`, zIndex: 60 + idx }"
      >
        <div class="pq-drawer__head">
          <div>
            <span class="pq-eyebrow">DocumentDrawer · Depth {{ idx + 1 }}</span>
            <h3>{{ dr.title }}</h3>
            <small class="pq-muted">{{ dr.subtitle }}</small>
          </div>
          <div class="pq-row-gap">
            <button v-if="dr.collection !== 'globals'" class="pq-btn" @click="openDocumentEditor(dr.collection as CollectionKey, dr.doc); popDrawer(0)">Open Editor</button>
            <button class="pq-btn pq-btn--ghost" @click="popDrawer(idx)">✕</button>
          </div>
        </div>
        <div class="pq-drawer__body">
          <div v-if="Array.isArray(dr.doc.entanglements) && dr.doc.entanglements.length" class="pq-subcard" style="margin-bottom: 12px">
            <b>Nested Relationships (click to stack drawer)</b>
            <div class="pq-chip-wrap" style="margin-top: 8px">
              <button v-for="e in (dr.doc.entanglements as any[])" :key="e.variantId" class="pq-rel-chip" @click="openDrawer('products', e.targetProduct, e.targetTheorem)">
                <span class="pq-dir" :data-dir="e.direction">{{ e.direction }}</span>
                <span>{{ e.targetTheorem }}</span>
              </button>
            </div>
          </div>
          <pre class="pq-code">{{ JSON.stringify(dr.doc, null, 2) }}</pre>
        </div>
      </aside>
    </div>

    <!-- LIST DRAWER (ListDrawer) -->
    <div v-if="listDrawerOpen" class="pq-backdrop" @click.self="listDrawerOpen = false">
      <aside class="pq-drawer" style="width: min(520px, 96vw); z-index: 75">
        <div class="pq-drawer__head">
          <div>
            <span class="pq-eyebrow">ListDrawer · Pick Target Theorem</span>
            <h3>Entangle with {{ focusTheorem }}</h3>
          </div>
          <button class="pq-btn pq-btn--ghost" @click="listDrawerOpen = false">✕</button>
        </div>
        <div class="pq-drawer__body">
          <input v-model="listDrawerFilter" class="pq-input" placeholder="Filter theorems…" style="width: 100%; margin-bottom: 10px" />
          <div class="pq-stack-sm">
            <button
              v-for="item in data.entangledCatalog.filter((e) => !listDrawerFilter || e.theorem.toLowerCase().includes(listDrawerFilter.toLowerCase()))"
              :key="item.id"
              class="pq-list-pick"
              @click="secondTheorem = item.theorem; listDrawerOpen = false; runEntanglePair(focusTheorem, item.theorem)"
            >
              <b>{{ item.theorem }}</b>
              <small>{{ item.module }} · {{ item.entanglementCount }} edges</small>
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- ACCOUNT / PQC IDENTITY DRAWER (views.account) -->
    <div v-if="accountOpen" class="pq-backdrop" @click.self="accountOpen = false">
      <aside class="pq-drawer" style="width: min(460px, 96vw); z-index: 80">
        <div class="pq-drawer__head">
          <div>
            <span class="pq-eyebrow">views.account · Passwordless Post-Quantum Identity</span>
            <h3>Cryptographic Session</h3>
          </div>
          <button class="pq-btn pq-btn--ghost" @click="accountOpen = false">✕</button>
        </div>
        <div class="pq-drawer__body pq-stack">
          <div class="pq-kv"><small>Active Tenant</small><code>{{ tenant }}</code></div>
          <div class="pq-kv"><small>Session KEM</small><code>{{ kemResult.algorithm }} (FIPS 203)</code></div>
          <div class="pq-kv"><small>Identity Signature</small><code>{{ dsaResult.algorithm }} (FIPS 204)</code></div>
          <div class="pq-kv"><small>Public Key Fingerprint</small><code>{{ shortHex(dsaResult.publicKey, 36) }}</code></div>
          <div class="pq-kv"><small>Auth Policy</small><span>Zero secret transmission · 122-qubit UUID receipt</span></div>
          <button class="pq-btn pq-btn--accent" @click="runKem(); runDsa()">Rotate Post-Quantum Keys</button>
        </div>
      </aside>
    </div>

    <!-- COMMAND PALETTE (CommandPalette · ⌘K) -->
    <div v-if="cmdOpen" class="pq-backdrop pq-backdrop--center" @click.self="cmdOpen = false">
      <div class="pq-cmd" role="dialog" aria-label="Command Palette">
        <input v-model="cmdQuery" autofocus class="pq-cmd__input" placeholder="Views, collections, theorems, PQC algorithms…" />
        <div class="pq-cmd__list">
          <button v-for="(item, idx) in cmdItems.slice(0, 14)" :key="idx" class="pq-cmd__item" @click="runCmd(item.action)">
            <span class="pq-chip">{{ item.group }}</span>
            <span>{{ item.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATIONS (Toast) -->
    <div class="pq-toasts" aria-live="polite">
      <div v-for="item in toasts" :key="item.id" class="pq-toast" :data-kind="item.kind">
        <b>{{ item.title }}</b>
        <span>{{ item.detail }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pq-studio {
  /* every transition a beat of the period the licence address gives the site (style(LICENSE.address)), as the mark and the blocks are timed */
  --pq-motion: calc(var(--qpu-period) / 8);
  --pq-bg: #060812;
  --pq-surface: rgba(13, 18, 34, 0.88);
  --pq-surface-2: rgba(20, 27, 50, 0.78);
  --pq-border: rgba(124, 152, 255, 0.22);
  --pq-ink: #eef2ff;
  --pq-muted: #9aa7c7;
  --pq-accent: #5eead4;
  --pq-accent-2: #a78bfa;
  --pq-ok: #34d399;
  --pq-warn: #fbbf24;
  background: radial-gradient(1200px 600px at 15% -10%, rgba(94, 234, 212, 0.14), transparent 60%),
    radial-gradient(900px 520px at 90% 0%, rgba(167, 139, 250, 0.16), transparent 60%),
    var(--pq-bg);
  color: var(--pq-ink);
  min-height: calc(100vh - 64px);
  font-family: var(--vp-font-family-base);
}

.pq-studio[data-theme='obsidian-pqc'] {
  --pq-bg: #090a0d;
  --pq-surface: #11131a;
  --pq-surface-2: #171a24;
  --pq-border: rgba(52, 211, 153, 0.22);
  --pq-accent: #34d399;
  --pq-accent-2: #f59e0b;
}

.pq-studio[data-theme='paper-iso'] {
  --pq-bg: #f4f7fb;
  --pq-surface: #ffffff;
  --pq-surface-2: #f8fafc;
  --pq-border: rgba(15, 23, 42, 0.14);
  --pq-ink: #0f172a;
  --pq-muted: #475569;
  --pq-accent: #2563eb;
  --pq-accent-2: #7c3aed;
  --pq-ok: #059669;
  background: var(--pq-bg);
}

.pq-banner {
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  padding: 10px 18px; border-bottom: 1px solid var(--pq-border); background: var(--pq-surface);
  backdrop-filter: blur(14px); font-size: 12px;
}
.pq-banner__left, .pq-banner__actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.pq-pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--pq-ok); box-shadow: 0 0 12px var(--pq-ok); }
.pq-sep { color: var(--pq-muted); }

.pq-shell { display: grid; grid-template-columns: 264px minmax(0, 1fr); min-height: calc(100vh - 110px); }
.pq-shell.is-collapsed { grid-template-columns: 68px minmax(0, 1fr); }

.pq-nav {
  border-right: 1px solid var(--pq-border); background: var(--pq-surface);
  padding: 14px 12px; display: flex; flex-direction: column; gap: 14px;
}
.pq-nav__brand { display: flex; align-items: center; gap: 10px; }
.pq-logo { width: 32px; height: 32px; flex-shrink: 0; }
.pq-nav__title { flex: 1; min-width: 0; display: flex; flex-direction: column; font-size: 13px; font-weight: 700; line-height: 1.2; }
.pq-nav__title small { font-weight: 400; color: var(--pq-muted); font-size: 11px; }
.pq-nav__controls { display: grid; grid-template-columns: 1fr 78px; gap: 8px; }
.pq-mini-label { display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--pq-muted); }
.pq-nav__groups { display: flex; flex-direction: column; gap: 14px; }
.pq-nav__group { display: flex; flex-direction: column; gap: 3px; }
.pq-nav__group-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--pq-muted); padding: 0 8px 4px; }
.pq-nav__item {
  display: flex; align-items: center; gap: 8px; width: 100%; text-align: left;
  padding: 7px 10px; border-radius: 8px; border: 1px solid transparent; background: transparent;
  color: var(--pq-ink); font-size: 13px; cursor: pointer; transition: var(--pq-motion) ease;
}
.pq-nav__item:hover { background: var(--pq-surface-2); }
.pq-nav__item.is-active { background: var(--pq-surface-2); border-color: var(--pq-accent); color: var(--pq-accent); font-weight: 600; }
.pq-nav__plugins { margin-top: auto; padding-top: 10px; border-top: 1px solid var(--pq-border); }

.pq-main { padding: 20px; min-width: 0; }
.pq-main.has-split { display: grid; grid-template-columns: minmax(0, 1fr) 390px; gap: 16px; }
.pq-stage { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.pq-section, .pq-stack, .pq-editor { display: flex; flex-direction: column; gap: 16px; }
.pq-stack-sm { display: flex; flex-direction: column; gap: 8px; }

.pq-card {
  background: var(--pq-surface); border: 1px solid var(--pq-border); border-radius: 14px;
  padding: 18px; backdrop-filter: blur(12px);
}
.pq-card--interactive { cursor: pointer; transition: transform var(--pq-motion) ease, border-color var(--pq-motion) ease; }
.pq-card--interactive:hover { transform: translateY(-2px); border-color: var(--pq-accent); }
.pq-subcard { background: var(--pq-surface-2); border: 1px solid var(--pq-border); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.pq-card__head, .pq-card__row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.pq-hero-card h1 { font-size: 26px; margin: 4px 0 6px; letter-spacing: -0.02em; }
.pq-eyebrow { display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--pq-accent); font-weight: 600; }
.pq-muted { color: var(--pq-muted); font-size: 13px; margin: 0; }
.pq-hero-actions, .pq-row-gap, .pq-bp-bar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.pq-register-bar { display: flex; gap: 3px; margin: 16px 0; height: 42px; }
.pq-register-seg {
  display: flex; flex-direction: column; justify-content: center; padding: 0 8px; border-radius: 8px;
  background: linear-gradient(135deg, rgba(94, 234, 212, 0.2), rgba(167, 139, 250, 0.22));
  border: 1px solid var(--pq-border); font-size: 11px; overflow: hidden; white-space: nowrap;
}
.pq-register-seg small { color: var(--pq-accent); font-family: var(--vp-font-family-mono); }

.pq-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; }
.pq-kpi { background: var(--pq-surface-2); border: 1px solid var(--pq-border); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 2px; }
.pq-kpi strong { font-size: 24px; font-variant-numeric: tabular-nums; color: var(--pq-accent); }
.pq-kpi small, .pq-kpi span { font-size: 12px; color: var(--pq-muted); }

.pq-grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }
.pq-grid-2, .pq-diff-grid, .pq-builder-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
.pq-editor-grid { display: grid; grid-template-columns: minmax(0, 1fr) 290px; gap: 16px; align-items: start; }

.pq-btn {
  padding: 6px 12px; border-radius: 8px; border: 1px solid var(--pq-border); background: var(--pq-surface-2);
  color: var(--pq-ink); font-size: 12px; font-weight: 500; cursor: pointer; transition: var(--pq-motion) ease;
}
.pq-btn:hover { border-color: var(--pq-accent); }
.pq-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.pq-btn--accent { background: var(--pq-accent); color: #051018; border-color: transparent; font-weight: 700; }
.pq-btn--ghost { background: transparent; }
.pq-btn.is-active { border-color: var(--pq-accent); color: var(--pq-accent); }
.pq-icon-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--pq-border); background: var(--pq-surface-2); color: var(--pq-ink); cursor: pointer; }
.pq-link { background: none; border: 0; color: var(--pq-accent); cursor: pointer; padding: 0; font: inherit; }

.pq-input, .pq-select, .pq-textarea {
  background: var(--pq-surface-2); color: var(--pq-ink); border: 1px solid var(--pq-border);
  border-radius: 8px; padding: 7px 10px; font-size: 13px; font-family: inherit;
}
.pq-input--grow { flex: 1; min-width: 180px; }
.pq-select--full { width: 100%; }
.pq-textarea { width: 100%; font-family: var(--vp-font-family-mono); resize: vertical; }

.pq-badge { margin-left: auto; font-size: 11px; padding: 1px 7px; border-radius: 999px; background: var(--pq-surface-2); border: 1px solid var(--pq-border); font-variant-numeric: tabular-nums; }
.pq-badge--ok, .pq-pill--ok { color: var(--pq-ok); border-color: var(--pq-ok); }
.pq-pill { font-size: 11px; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--pq-border); }
.pq-chip-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
.pq-chip { font-size: 11px; padding: 2px 8px; border-radius: 6px; background: var(--pq-surface-2); border: 1px solid var(--pq-border); color: var(--pq-muted); }
.pq-chip--btn { cursor: pointer; color: var(--pq-ink); }
.pq-chip--btn.is-active, .pq-chip--btn:hover { border-color: var(--pq-accent); color: var(--pq-accent); }

.pq-table-wrap { overflow-x: auto; margin-top: 10px; }
.pq-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.pq-table th, .pq-table td { text-align: left; padding: 9px 10px; border-bottom: 1px solid var(--pq-border); }
.pq-table th { color: var(--pq-muted); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }

.pq-filter-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.pq-col-menu { display: flex; gap: 12px; flex-wrap: wrap; padding: 10px; margin-top: 10px; border-radius: 8px; background: var(--pq-surface-2); }
.pq-check { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.pq-bulk-bar { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; margin-top: 10px; border-radius: 8px; border: 1px solid var(--pq-accent); background: var(--pq-surface-2); font-size: 13px; }
.pq-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; font-size: 12.5px; color: var(--pq-muted); }

.pq-doc-header__top { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.pq-breadcrumbs { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--pq-muted); }
.pq-tabs, .pq-subtabs { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px; border-bottom: 1px solid var(--pq-border); padding-bottom: 8px; }
.pq-tab, .pq-subtab { padding: 6px 12px; border-radius: 7px; border: 1px solid transparent; background: transparent; color: var(--pq-muted); cursor: pointer; font-size: 12.5px; }
.pq-tab.is-active, .pq-subtab.is-active { background: var(--pq-surface-2); border-color: var(--pq-accent); color: var(--pq-accent); font-weight: 600; }

.pq-form-stack { display: flex; flex-direction: column; gap: 14px; margin-top: 12px; }
.pq-field-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
.pq-field { display: flex; flex-direction: column; gap: 5px; font-size: 12px; font-weight: 600; }
.pq-field small { font-weight: 400; color: var(--pq-muted); margin-left: 4px; }
.pq-kv { display: flex; flex-direction: column; gap: 2px; font-size: 12px; }
.pq-kv small { color: var(--pq-muted); font-size: 11px; }
.pq-kv code { word-break: break-all; }
.pq-collapsible { border: 1px solid var(--pq-border); border-radius: 10px; overflow: hidden; }
.pq-collapsible__head { width: 100%; display: flex; justify-content: space-between; padding: 10px 12px; background: var(--pq-surface-2); border: 0; color: var(--pq-ink); cursor: pointer; font-size: 12.5px; font-weight: 600; }
.pq-collapsible__body { padding: 12px; }

.pq-rel-chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; border: 1px solid var(--pq-border); background: var(--pq-surface-2); color: var(--pq-ink); font-size: 12px; cursor: pointer; }
.pq-rel-chip:hover { border-color: var(--pq-accent); }
.pq-dir { font-size: 10px; text-transform: uppercase; padding: 1px 5px; border-radius: 4px; }
.pq-dir[data-dir='uses'] { background: rgba(94, 234, 212, 0.2); color: var(--pq-accent); }
.pq-dir[data-dir='usedBy'] { background: rgba(167, 139, 250, 0.2); color: var(--pq-accent-2); }

.pq-array-list { display: flex; flex-direction: column; gap: 8px; }
.pq-array-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--pq-border); background: var(--pq-surface-2); }

.pq-code {
  margin: 8px 0 0; padding: 12px; border-radius: 10px; background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--pq-border); font-family: var(--vp-font-family-mono); font-size: 11.5px;
  overflow: auto; max-height: 280px; white-space: pre-wrap; word-break: break-word;
}
.pq-studio[data-theme='paper-iso'] .pq-code { background: #f1f5f9; }

.pq-graph-box { background: var(--pq-surface-2); border: 1px solid var(--pq-border); border-radius: 12px; padding: 10px; display: flex; flex-direction: column; align-items: center; }
.pq-svg { width: 100%; max-width: 440px; height: auto; }
.pq-orbit { fill: none; stroke: var(--pq-border); stroke-dasharray: 4 4; }
.pq-edge { stroke-width: 1.5; opacity: 0.7; }
.pq-edge--uses { stroke: var(--pq-accent); }
.pq-edge--usedBy { stroke: var(--pq-accent-2); }
.pq-node { cursor: pointer; }
.pq-node-dot--uses { fill: var(--pq-accent); }
.pq-node-dot--usedBy { fill: var(--pq-accent-2); }
.pq-node-center { fill: var(--pq-accent); stroke: var(--pq-ink); stroke-width: 2; }
.pq-node-center-label { fill: #041016; font-size: 10px; font-weight: 800; }
.pq-node-label { fill: var(--pq-ink); font-size: 9.5px; font-family: var(--vp-font-family-mono); }
.pq-legend { display: flex; gap: 14px; font-size: 12px; color: var(--pq-muted); }
.pq-dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 4px; }
.pq-dot--uses { background: var(--pq-accent); }
.pq-dot--usedBy { background: var(--pq-accent-2); }

.pq-add-bar { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.pq-block-item { border: 1px solid var(--pq-border); border-radius: 10px; background: var(--pq-surface-2); overflow: hidden; }
.pq-block-item__head { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; border-bottom: 1px solid var(--pq-border); }
.pq-block-item__body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }

.pq-preview-frame {
  margin: 12px auto 0; width: 100%; padding: 18px; border-radius: 12px;
  border: 1px dashed var(--pq-accent); background: var(--pq-surface-2); transition: max-width calc(2 * var(--pq-motion)) ease;
}
.pq-preview-pill { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 999px; background: rgba(94, 234, 212, 0.16); color: var(--pq-accent); margin-bottom: 6px; }
.pq-preview-meta { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: var(--pq-muted); margin-top: 10px; }
.pq-preview-block { padding: 12px; border-radius: 10px; border: 1px solid var(--pq-border); background: var(--pq-surface); }
.pq-split-preview { background: var(--pq-surface); border: 1px solid var(--pq-border); border-radius: 14px; padding: 14px; height: fit-content; position: sticky; top: 80px; }

.pq-backdrop { position: fixed; inset: 0; background: rgba(2, 6, 18, 0.64); backdrop-filter: blur(5px); z-index: 55; display: flex; justify-content: flex-end; }
.pq-backdrop--center { align-items: flex-start; justify-content: center; padding-top: 10vh; }
.pq-drawer {
  position: fixed; top: 0; right: 0; bottom: 0; background: var(--pq-bg); border-left: 1px solid var(--pq-accent);
  display: flex; flex-direction: column; box-shadow: -16px 0 40px rgba(0, 0, 0, 0.5);
}
.pq-drawer__head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 16px 18px; border-bottom: 1px solid var(--pq-border); }
.pq-drawer__head h3 { margin: 2px 0; }
.pq-drawer__body { padding: 16px 18px; overflow-y: auto; flex: 1; }
.pq-list-pick { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--pq-border); background: var(--pq-surface-2); color: var(--pq-ink); cursor: pointer; text-align: left; }
.pq-list-pick:hover { border-color: var(--pq-accent); }
.pq-list-pick small { color: var(--pq-muted); }

.pq-cmd { width: min(620px, 94vw); background: var(--pq-bg); border: 1px solid var(--pq-accent); border-radius: 14px; overflow: hidden; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6); }
.pq-cmd__input { width: 100%; padding: 14px 16px; border: 0; border-bottom: 1px solid var(--pq-border); background: var(--pq-surface); color: var(--pq-ink); font-size: 14px; outline: none; }
.pq-cmd__list { max-height: 360px; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 4px; }
.pq-cmd__item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; border: 0; background: transparent; color: var(--pq-ink); cursor: pointer; text-align: left; font-size: 13px; }
.pq-cmd__item:hover { background: var(--pq-surface-2); }

.pq-toasts { position: fixed; bottom: 18px; right: 18px; z-index: 90; display: flex; flex-direction: column; gap: 8px; max-width: 340px; }
.pq-toast { display: flex; flex-direction: column; gap: 2px; padding: 10px 14px; border-radius: 10px; background: var(--pq-surface); border: 1px solid var(--pq-accent); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); font-size: 12.5px; }
.pq-toast[data-kind='ok'] { border-color: var(--pq-ok); }
.pq-toast[data-kind='warn'] { border-color: var(--pq-warn); }
.pq-toast span { color: var(--pq-muted); font-size: 11.5px; }

@media (max-width: 980px) {
  .pq-shell, .pq-main.has-split, .pq-editor-grid { grid-template-columns: 1fr; }
  .pq-nav { border-right: 0; border-bottom: 1px solid var(--pq-border); }
}
</style>
