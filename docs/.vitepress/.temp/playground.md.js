import { t as handle } from "./mcp.lIIQx7GU.js";
import { ref, unref, useSSRContext } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttrs, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
// docs/playground.md
var __pageData = JSON.parse("{\"title\":\"Playground\",\"description\":\"\",\"frontmatter\":{\"title\":\"Playground\",\"order\":50},\"headers\":[],\"relativePath\":\"playground.md\",\"filePath\":\"playground.md\",\"lastUpdated\":1792928836000}");
var _sfc_main = /*@__PURE__*/ Object.assign({ name: "playground.md" }, {
	__ssrInlineRender: true,
	setup(__props) {
		const tools = handle({
			jsonrpc: "2.0",
			id: 0,
			method: "tools/list"
		}).result.tools.map((t) => t.name);
		const tool = ref("processor");
		const args = ref("{\"name\": \"Willow\"}");
		const out = ref("");
		const widget = ref("");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="playground" tabindex="-1">Playground <a class="header-anchor" href="#playground" aria-label="Permalink to “Playground”">​</a></h1><p>Call a tool in the browser. The page runs the same <code>handle</code> function the MCP surface serves, with no server in between.</p><p><label>Tool <select><!--[-->`);
			ssrRenderList(unref(tools), (t) => {
				_push(`<option${ssrIncludeBooleanAttr(Array.isArray(tool.value) ? ssrLooseContain(tool.value, null) : ssrLooseEqual(tool.value, null)) ? " selected" : ""}>${ssrInterpolate(t)}</option>`);
			});
			_push(`<!--]--></select></label></p><p><label>Arguments (JSON)<textarea rows="6" style="${ssrRenderStyle({
				"width": "100%",
				"font-family": "monospace"
			})}">${ssrInterpolate(args.value)}</textarea></label></p><p><button>Call</button></p><div>${widget.value ?? ""}</div><pre style="${ssrRenderStyle({ "white-space": "pre-wrap" })}">${ssrInterpolate(out.value)}</pre></div>`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("playground.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { __pageData, _sfc_main as default };
