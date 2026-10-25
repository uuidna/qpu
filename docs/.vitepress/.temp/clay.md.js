import { t as handle } from "./mcp.lIIQx7GU.js";
import { unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs } from "vue/server-renderer";
// docs/clay.md
var __pageData = JSON.parse("{\"title\":\"Clay register\",\"description\":\"\",\"frontmatter\":{\"title\":\"Clay register\",\"order\":44},\"headers\":[],\"relativePath\":\"clay.md\",\"filePath\":\"clay.md\",\"lastUpdated\":1792928836000}");
var _sfc_main = /*@__PURE__*/ Object.assign({ name: "clay.md" }, {
	__ssrInlineRender: true,
	setup(__props) {
		const reply = handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/call",
			params: {
				name: "clay",
				arguments: {}
			}
		});
		const clay = "result" in reply ? reply.result.structuredContent : null;
		const widget = "result" in reply ? reply.result._meta?.widget ?? "" : "";
		if (!clay || clay.holding !== clay.total) throw new Error(`clay register: ${clay?.holding} of ${clay?.total} hold`);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="the-clay-register-recomputed" tabindex="-1">The Clay register, recomputed <a class="header-anchor" href="#the-clay-register-recomputed" aria-label="Permalink to “The Clay register, recomputed”">​</a></h1><p><code>Qpu/Clay.lean</code> states 54 relations between the unit&#39;s constants and the Lean kernel accepted each by <code>rfl</code>. This page calls the <code>clay</code> tool, which recomputes every relation in exact integer arithmetic from the same definitions, ported one for one, and reports the bit width each needs. A small machine with software multi-byte arithmetic, the Pravets 8M of the author&#39;s register, can redo these sums and compare content addresses; the kernel check happened once, and this is what it accepted. Nothing here proves an open problem: the relations are identities between the unit&#39;s own constants, and the page says so.</p>`);
			if (unref(clay)) _push(`<p>${ssrInterpolate(unref(clay).holding)} of ${ssrInterpolate(unref(clay).total)} relations hold; the widest value needs ${ssrInterpolate(unref(clay).maxBits)} bits.</p>`);
			else _push(`<!---->`);
			_push(`<div>${unref(widget) ?? ""}</div></div>`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("clay.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { __pageData, _sfc_main as default };
