// The MCP Apps surface: the extension, the ui:// view, the build address.
import { PROSE } from './prose-index.ts'
import { TABLES } from './tables-index.ts'
import { KEY, hue } from './unit/theme.ts'
import { VERSION } from './unit/version.ts'
import { uuid } from '../uuid/index.ts'

export const MCP_APPS = TABLES.MCP_APPS

export const UI_TOKENS = TABLES.UI_TOKENS as unknown as readonly [string, string, string][]

export const ui = (tool: string, key: number = KEY): { uri: string; name: string; mimeType: string; html: string; csp: { connectDomains: string[]; resourceDomains: string[] }; prefersBorder: boolean } => {
  const accent = `hsl(${hue(key)} 62% 44%)`
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>qpu · ${tool}</title>
<style>
:root { --a432-key: ${key}; --a432-accent: ${accent}; --qpu-coin: ${accent}; --qpu-coil: hsl(${hue(key) + key / 9} 62% 44%); ${UI_TOKENS.map(([t, h, d]) => `${t}: var(${h}, ${d});`).join(' ')} }
body { margin: 0; padding: var(--pad-sm); font-family: var(--font-sans, system-ui, sans-serif); color: var(--text-primary); background: transparent; }
.qpu-block { border-left: 3px solid var(--qpu-accent, var(--a432-accent)); padding-left: var(--pad-sm); }
.qpu-args { color: var(--text-muted); font-size: var(--font-size-footnote); margin-bottom: var(--gap-sm); white-space: pre-wrap; }
.qpu-verify { display: flex; flex-direction: column; gap: var(--pad-sm); margin-top: var(--pad-sm); }
.qpu-verify div { display: flex; flex-wrap: wrap; align-items: center; gap: var(--pad-sm); }
.qpu-ask, #view label { display: flex; gap: var(--pad-sm); }
.qpu-ask input { flex: 1; font: inherit; border: thin solid; border-radius: var(--radius); background: none; color: inherit; }
.qpu-verify button, .qpu-ask button { font: inherit; font-size: var(--font-size-footnote); padding: 0 var(--pad-sm); border-radius: var(--radius); border: thin solid var(--qpu-accent, currentColor); background: transparent; color: inherit; cursor: pointer; }
.qpu-verify button:first-child { background: var(--qpu-accent, currentColor); color: var(--surface-1, Canvas); }
.qpu-verify span { font-size: var(--font-size-footnote); }
pre { background: var(--surface-1); border-radius: var(--radius); padding: var(--pad-sm); overflow: auto; font-size: var(--font-size-footnote); }
</style></head>
<body>${tool === 'chat' ? '<div class="qpu-ask"><input id="s" aria-label="problem"><button id="go" type="button">Ask</button></div>' : ''}<div class="qpu-ask"><input id="k" type="password" autocomplete="off" spellcheck="false" aria-label="token"><button id="ok" type="button">Accept</button><span id="tok"></span></div><div id="args" class="qpu-args"></div><div id="view" class="qpu-block" data-tool="${tool}">${tool === 'chat' ? '' : PROSE.quantumProcessingMcpApps_s1}</div>
<script>
(function () {
  // the view of the MCP Apps protocol: JSON-RPC over postMessage; every message the host sends is a notification this shell renders, nothing else runs
  var seq = 0, view = document.getElementById('view'), args = document.getElementById('args'), pending = {}
  var send = function (m) { parent.postMessage(Object.assign({ jsonrpc: '2.0' }, m), '*') }
  // the device's randomness: the phase of the stream's animation at every interaction (eleven bits), the device's own nonce (thirty-two bits), the pointer; the phase set on the root so the CSS continues from it; every 36 samples the seal tool takes them through the host (a coil beyond the first period: the fusion)
  var samples = [], period = ${key * 9}
  if ('${tool}' !== 'chat') document.addEventListener('pointerdown', function (e) { var a = document.getAnimations ? document.getAnimations()[0] : null; var phase = (a && typeof a.currentTime === 'number' ? a.currentTime : performance.now()) % period; var nonce = (self.crypto && crypto.getRandomValues) ? crypto.getRandomValues(new Uint32Array(1))[0] : 0; samples.push({ phase: phase, t: performance.now(), nonce: nonce, x: e.clientX, y: e.clientY }); document.documentElement.style.setProperty('--qpu-phase', String(Math.floor(phase))); if (samples.length % 36 === 0) send({ id: ++seq, method: 'tools/call', params: { name: 'seal', arguments: { text: location.href, entropy: samples.slice(-36) } } }) })
  var size = function () { send({ method: 'ui/notifications/size-changed', params: { height: document.documentElement.scrollHeight } }) }
  var render = function (r, el) {
    var meta = r && r._meta ? r._meta : {}, view = el || document.getElementById('view')
    if (meta.theme) for (var k in meta.theme) view.style.setProperty(k, meta.theme[k])
    view.innerHTML = meta.widget ? meta.widget : '<pre>' + JSON.stringify(r && r.structuredContent !== undefined ? r.structuredContent : r, null, 1).replace(/</g, '&lt;') + '</pre>'
    // a decision verified by its client: every theorem it rests on, asked of the server through the host (tools/call: host to server, no model, no tokens) and its Lean source opened online; text only, never markup
    var sc = r && r.structuredContent, v = sc && (sc.verify || (sc.decision && sc.decision.verify))
    if (v && v.length) { var box = document.createElement('div'); box.className = 'qpu-verify'; v.forEach(function (x) { var row = document.createElement('div'), b = document.createElement('button'), out = document.createElement('span'); b.textContent = 'Verify ' + x.theorem; b.onclick = function () { var id = ++seq; pending[id] = function (m) { var a = m.result && m.result.structuredContent; out.textContent = a ? (a.accepted ? ' accepted by the kernel: ' : ' not in the kernel: ') + (a.statement || a.theorem) : ' ' + JSON.stringify(m.error || m.result) }; out.textContent = ' asking the server'; send({ id: id, method: 'tools/call', params: x.call }) }; row.appendChild(b); if (x.online) { var s = document.createElement('button'); s.textContent = 'Lean source'; s.onclick = function () { send({ id: ++seq, method: 'ui/open-link', params: { url: x.online } }) }; row.appendChild(s) } row.appendChild(out); box.appendChild(row) }); view.appendChild(box) }
    size()
  }
  window.addEventListener('message', function (e) {
    var m = e.data || {}
    if (m.id === 1 && m.result) { send({ method: 'ui/notifications/initialized' }); return }
    if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; size(); return }
    if (m.method === 'ui/notifications/tool-input') { var show = function (v) { if (!v || typeof v !== 'object') return v; var o = Array.isArray(v) ? [] : {}; if (Array.isArray(v)) return v.map(show); for (var key in v) o[key] = /token|secret|password|authorization|api[-_]?key/i.test(key) && typeof v[key] === 'string' ? '[sealed]' : show(v[key]); return o }; args.textContent = JSON.stringify(show(m.params && m.params.arguments)); size() }
    if (m.method === 'ui/notifications/tool-result' && m.params) render(m.params)
    if (m.method === 'ui/notifications/tool-cancelled') { view.textContent = 'the call was cancelled'; size() }
  })
  // the chat: each problem a tools/call of the chat door through the host, a question's options radios whose choice re-enters
  var ask = function (s, choice) { var id = ++seq, el = view.insertBefore(document.createElement('div'), view.firstChild); pending[id] = function (m) { var r = m.result || { structuredContent: m.error }, q = r.structuredContent && r.structuredContent.question; render(r, el); if (q) el.append(q.asks), q.options.forEach(function (o) { var l = el.appendChild(document.createElement('label')); l.innerHTML = '<input type=radio name=q' + id + '>'; l.append(o); l.onchange = function () { ask(s, o) } }) }; send({ id: id, method: 'tools/call', params: { name: 'match', arguments: { statement: s, chat: { choice: choice } } } }) }
  // no form: a sandboxed frame without allow-forms never submits one
  var s = document.getElementById('s'), go = function () { if (s.value) ask(s.value); s.value = '' }; if (s) { s.onkeydown = function (e) { if (e.key === 'Enter') go() }; document.getElementById('go').onclick = go }
  var k = document.getElementById('k'), ok = document.getElementById('ok'), tok = document.getElementById('tok')
  var accept = function () {
    var raw = k.value
    k.value = ''
    if (!raw || !(self.crypto && crypto.subtle && self.TextEncoder)) { tok.textContent = ' refused'; return }
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)).then(function (buf) {
      var hex = Array.from(new Uint8Array(buf)).map(function (b) { return ('0' + b.toString(16)).slice(-2) }).join('')
      send({ method: 'ui/accept-token', params: { authorization: raw } })
      raw = ''
      var id = ++seq
      pending[id] = function (m) { var a = m.result && m.result.structuredContent; tok.textContent = a && a.accepted && a.secret === false && a.travelled === false ? ' accepted' : ' refused' }
      send({ id: id, method: 'tools/call', params: { name: 'seal', arguments: { token: { witness: hex, via: 'widget' } } } })
    }).catch(function () { tok.textContent = ' refused' })
  }
  if (k && ok) { k.onkeydown = function (e) { if (e.key === 'Enter') accept() }; ok.onclick = accept }
  send({ id: ++seq, method: 'ui/initialize', params: { appCapabilities: { availableDisplayModes: ['inline'] }, appInfo: { name: 'qpu', version: '${VERSION}' } } })
  new ResizeObserver(size).observe(document.body)
})()
</script></body></html>
`
  return { uri: `ui://qpu/${tool}`, name: `qpu · ${tool}`, mimeType: MCP_APPS.mimeType, html, csp: { connectDomains: [], resourceDomains: [] }, prefersBorder: true }
}

export const build = (toolsNow: readonly string[]): string => uuid(`catalogue${toolsNow.join(',')}`).slice(0, 8)
