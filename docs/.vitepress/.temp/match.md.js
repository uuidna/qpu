import { t as handle } from "./mcp.lIIQx7GU.js";
import { ref, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
// docs/match.md
var __pageData = JSON.parse("{\"title\":\"Match\",\"description\":\"\",\"frontmatter\":{\"title\":\"Match\",\"order\":47},\"headers\":[],\"relativePath\":\"match.md\",\"filePath\":\"match.md\",\"lastUpdated\":1792928836000}");
var _sfc_main = /*@__PURE__*/ Object.assign({ name: "match.md" }, {
	__ssrInlineRender: true,
	setup(__props) {
		const match = (statement) => handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/call",
			params: {
				name: "match",
				arguments: { statement }
			}
		});
		const fixed = [
			["How many qubits does Willow have?", "served"],
			["Factor RSA-2048 with Shor", "impossible"],
			["list the careers jobs page", "impossible"],
			["teleport a cat to the moon", "unknown"]
		].map(([statement, expected]) => {
			const reply = match(statement);
			const m = "result" in reply ? reply.result.structuredContent : null;
			if (m?.verdict !== expected) throw new Error(`match of "${statement}" is ${m?.verdict}, expected ${expected}`);
			return {
				statement,
				expected,
				m,
				widget: "result" in reply ? reply.result._meta?.widget ?? "" : ""
			};
		});
		const statement = ref("Show the Sycamore couplers");
		const out = ref("");
		const widget = ref("");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="any-statement-matched-or-proved-impossible" tabindex="-1">Any statement, matched or proved impossible <a class="header-anchor" href="#any-statement-matched-or-proved-impossible" aria-label="Permalink to “Any statement, matched or proved impossible”">​</a></h1><p>Type a statement. The <code>match</code> tool searches everything the surface can do, calls what serves it, or proves from the surface itself why it cannot: a schema bound the statement exceeds, a lead whose reason says why, or the handler&#39;s own refusal. A statement nothing serves comes back as a new lead to develop. The fixed statements below are evaluated at build time; a verdict that changes fails the build.</p><p><label>Statement <input${ssrRenderAttr("value", statement.value)} style="${ssrRenderStyle({ "width": "100%" })}"></label><button>Match</button></p><div>${widget.value ?? ""}</div><pre style="${ssrRenderStyle({ "white-space": "pre-wrap" })}">${ssrInterpolate(out.value)}</pre><h2 id="fixed-statements" tabindex="-1">Fixed statements <a class="header-anchor" href="#fixed-statements" aria-label="Permalink to “Fixed statements”">​</a></h2><!--[-->`);
			ssrRenderList(unref(fixed), (f) => {
				_push(`<div><h3 id="f-statement-→-f-m-verdict" tabindex="-1">“${ssrInterpolate(f.statement)}” → ${ssrInterpolate(f.m?.verdict)} <a class="header-anchor" href="#f-statement-→-f-m-verdict" aria-label="Permalink to ““{{ f.statement }}” → {{ f.m?.verdict }}”">​</a></h3><div>${f.widget ?? ""}</div></div>`);
			});
			_push(`<!--]--></div>`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("match.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { __pageData, _sfc_main as default };
