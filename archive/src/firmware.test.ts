import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { QPU_HOST } from './hologram.js'
import { qpuFirmwareOf, QPU_PAYLOAD_API } from './config.js'
import { QPU_WORKER } from './blueprint.js'
import { handleQpuFetch } from './edge.js'
import { qpuRoutesOf, qpuSeoAuditOf } from './seo.js'

const ROOT = join(import.meta.dirname, '..')
const wrangler = readFileSync(join(ROOT, 'wrangler.toml'), 'utf8')
const layout = readFileSync(join(ROOT, 'docs/.vitepress/theme/Layout.vue'), 'utf8')
const theme = readFileSync(join(ROOT, 'docs/.vitepress/theme/index.ts'), 'utf8')
const autoload = readFileSync(join(ROOT, 'docs/.vitepress/theme/autoload.ts'), 'utf8')
const config = readFileSync(join(ROOT, 'docs/.vitepress/config.ts'), 'utf8')
const css = readFileSync(join(ROOT, 'docs/.vitepress/theme/style.css'), 'utf8')
const loader = readFileSync(join(ROOT, 'docs/.vitepress/hologram.data.ts'), 'utf8')
const edge = readFileSync(join(ROOT, 'src/edge.ts'), 'utf8')

test('wrangler ASSETS bind the VitePress hologram', () => {
  const fw = qpuFirmwareOf()
  assert.equal(fw.name, 'vitepress')
  assert.equal(fw.host, QPU_HOST)
  assert.equal(QPU_HOST, 'qpu.uuidna.com')
  assert.equal(QPU_WORKER, 'uuidna-qpu')
  assert.match(wrangler, /^name = "uuidna-qpu"/m)
  assert.match(wrangler, /run_worker_first = \[/)
  assert.match(wrangler, /"!\/assets\/\*"/)
  assert.match(wrangler, /binding = "ASSETS"/)
  assert.match(wrangler, /QPU_HOST = "qpu\.uuidna\.com"/)
})

test('VitePress theme paints hologram firmware; VP tokens bind QPU planes', () => {
  assert.match(layout, /serviceWorker/)
  assert.match(layout, /\/sw\.js/)
  assert.match(config, /manifest\.webmanifest/)
  assert.match(css, /--vp-c-brand-1:\s*hsl\(calc\(var\(--qpu-fold\)/)
  assert.match(loader, /defineLoader/)
  assert.match(loader, /qpuHologramOf/)
  assert.match(loader, /qpuDirectionOf/)
  assert.match(loader, /payload\.find/)
  assert.match(loader, /QPU_PAYLOAD_API/)
  assert.doesNotMatch(loader, /graphql/i)
  assert.doesNotMatch(loader, /\/api\/graphql/)
  assert.equal(QPU_PAYLOAD_API.graphql, false)
  assert.equal(QPU_PAYLOAD_API.local, 'crud')
  assert.equal(QPU_PAYLOAD_API.vitepress, 'loader')
  assert.equal(QPU_PAYLOAD_API.find, 'payload.find')
})

test('theme views autoload by basename; docs read the JSON door', () => {
  assert.match(autoload, /import\.meta\.glob/)
  assert.match(autoload, /pageViewOf/)
  assert.match(autoload, /pagePropsOf/)
  assert.match(autoload, /chromeOf/)
  assert.match(layout, /pageViewOf/)
  assert.match(layout, /pageProps/)
  assert.match(layout, /chromeOf/)
  assert.match(config, /frontmatter\.reading/)
  assert.match(config, /loadHologramOf/)
  assert.doesNotMatch(config, /handleQpuFetch/)
  assert.match(config, /page\.title = seo\.title/)
  assert.doesNotMatch(theme, /app\.component\(['"]/)
  assert.doesNotMatch(theme, /from ['"]\.\/.+\.vue['"]/)
  assert.doesNotMatch(layout, /from ['"]\.\/.+\.vue['"]/)
  assert.doesNotMatch(layout, /<(Movie|Search|Sidebar|Seat|Donate|Lattice)\b/)
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = join(dir, e.name)
      if (e.isDirectory()) {
        if (e.name === 'dist' || e.name === 'cache' || e.name === '.temp') return []
        return walk(p)
      }
      return /\.(md|vue|ts|css)$/.test(e.name) ? [p] : []
    })
  for (const file of walk(join(ROOT, 'docs'))) {
    const text = readFileSync(file, 'utf8')
    assert.doesNotMatch(text, /<Qpu[A-Z]/, file)
    assert.doesNotMatch(text, /Qpu[A-Z]\w*\.vue/, file)
    if (file.endsWith('.md') || file.endsWith('.vue') || file.endsWith('.paths.ts')) {
      assert.doesNotMatch(text, /from ['"][^'"]*\/src\//, file)
    }
  }
})

test('VitePress nav and sidebar are the QPU chrome API, not hand-typed paths', () => {
  assert.match(config, /loadHologramOf/)
  assert.doesNotMatch(config, /handleQpuFetch/)
  assert.match(loader, /qpuNavOf/)
  assert.match(loader, /qpuSidebarMapOf/)
  assert.match(loader, /qpuViteDoorsOf/)
  assert.match(loader, /qpuGatewaysOf/)
  assert.match(loader, /payload\.find/)
  const sidebar = readFileSync(join(ROOT, 'docs/.vitepress/theme/Sidebar.vue'), 'utf8')
  const search = readFileSync(join(ROOT, 'docs/.vitepress/theme/Search.vue'), 'utf8')
  const lattice = readFileSync(join(ROOT, 'docs/.vitepress/theme/Lattice.vue'), 'utf8')
  assert.match(sidebar, /useData/)
  assert.match(sidebar, /theme\.value\.sidebar/)
  assert.match(sidebar, /withBase/)
  assert.match(search, /hologram\.data/)
  assert.match(search, /withBase/)
  assert.match(search, /hrefOf/)
  assert.match(lattice, /hologram\.data/)
  assert.match(lattice, /withBase\(`\/face\/\$\{/)
})

test('edge fuses HTML to ASSETS and JSON when Accept is not html', async () => {
  assert.match(edge, /Same doors, two readings: Accept text\/html → site; otherwise JSON/)
  const env = {
    ASSETS: {
      fetch: async () => new Response('<html data-firmware="vitepress">hologram</html>', {
        headers: { 'content-type': 'text/html' },
      }),
    },
  }
  const html = await handleQpuFetch(new Request(`https://${QPU_HOST}/`, { headers: { accept: 'text/html' } }), env)
  assert.equal(html.status, 200)
  assert.match(await html.text(), /data-firmware="vitepress"/)
  const json = await handleQpuFetch(new Request(`https://${QPU_HOST}/`))
  assert.match(json.headers.get('content-type') ?? '', /json/)
  const body = await json.json() as { host: string; machine: { seat: { seat: string } } }
  assert.equal(body.host, QPU_HOST)
  assert.equal(body.machine.seat.seat, 'empty')
})

test('SEO audit stays clean beside the VitePress hologram', () => {
  const audit = qpuSeoAuditOf()
  assert.equal(audit.ok, true, JSON.stringify(audit.gaps))
  const paths = new Set(qpuRoutesOf().map((r) => r.path))
  assert.ok(paths.has('/hologram'))
  assert.ok(paths.has('/gateways'))
  assert.ok(paths.has('/pwa'))
})
