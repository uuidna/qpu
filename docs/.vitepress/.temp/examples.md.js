import { n as EXAMPLES, t as handle } from "./mcp.lIIQx7GU.js";
import { unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
// docs/examples.md
var __pageData = JSON.parse("{\"title\":\"Examples\",\"description\":\"\",\"frontmatter\":{\"title\":\"Examples\",\"order\":45},\"headers\":[],\"relativePath\":\"examples.md\",\"filePath\":\"examples.md\",\"lastUpdated\":1792928836000}");
var _sfc_main = /*@__PURE__*/ Object.assign({ name: "examples.md" }, {
	__ssrInlineRender: true,
	setup(__props) {
		const rows = EXAMPLES.map((e) => {
			const reply = handle({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/call",
				params: {
					name: e.tool,
					arguments: e.arguments
				}
			});
			const ok = "result" in reply;
			const structured = ok ? reply.result.structuredContent : null;
			const why = ok ? e.expect(structured) : reply.error.message;
			if (why !== null) throw new Error(`example ${e.id} failed: ${why}`);
			return {
				...e,
				ok: why === null,
				why,
				widget: ok ? reply.result._meta?.widget ?? "" : "",
				json: JSON.stringify(structured, null, 2)
			};
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="examples-run-live" tabindex="-1">Examples, run live <a class="header-anchor" href="#examples-run-live" aria-label="Permalink to “Examples, run live”">​</a></h1><p>Every example below is one entry of <code>src/quantum/examples.ts</code>. This page calls <code>handle</code> for each at render time, the test suite replays the same list, and the <code>audit</code> tool replays it again on request. If an expectation fails, the site build fails: the page cannot show a result the tool does not return.</p><!--[-->`);
			ssrRenderList(unref(rows), (r) => {
				_push(`<div><h3 id="r-tool-·-r-id" tabindex="-1">${ssrInterpolate(r.tool)} · ${ssrInterpolate(r.id)} <a class="header-anchor" href="#r-tool-·-r-id" aria-label="Permalink to “{{ r.tool }} · {{ r.id }}”">​</a></h3><p>${ssrInterpolate(r.shows)}</p><div class="language-json line-numbers-mode"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
					"--shiki-light": "#24292e",
					"--shiki-dark": "#e1e4e8",
					"--shiki-light-bg": "#fff",
					"--shiki-dark-bg": "#24292e"
				})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
					"--shiki-light": "#24292E",
					"--shiki-dark": "#E1E4E8"
				})}">${ssrInterpolate(JSON.stringify({
					name: r.tool,
					arguments: r.arguments
				}))}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div>`);
				if (r.ok) _push(`<p>✓ as expected</p>`);
				else _push(`<p>✗ ${ssrInterpolate(r.why)}</p>`);
				_push(`<div>${r.widget ?? ""}</div><details><summary>structured result</summary><pre style="${ssrRenderStyle({ "white-space": "pre-wrap" })}">${ssrInterpolate(r.json)}</pre></details></div>`);
			});
			_push(`<!--]--></div>`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("examples.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { __pageData, _sfc_main as default };
