import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
// docs/index.md
var __pageData = JSON.parse("{\"title\":\"qpu\",\"description\":\"\",\"frontmatter\":{\"title\":\"qpu\",\"order\":0,\"nav\":false},\"headers\":[],\"relativePath\":\"index.md\",\"filePath\":\"index.md\",\"lastUpdated\":1792846774000}");
var _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="qpu" tabindex="-1">qpu <a class="header-anchor" href="#qpu" aria-label="Permalink to “qpu”">​</a></h1><p>The Google Quantum AI layer: the Willow processor as its spec sheet states it, Cirq gates and circuits, Quantum Echoes with the benchmark Google states, and one MCP surface that compiles them on request.</p><ul><li><a href="/processor">Processor</a>: the Willow spec sheet, figure by figure.</li><li><a href="/cirq">Cirq</a>: the gates, circuits and simulator this repository implements.</li><li><a href="/echo">Quantum Echoes</a>: the protocol and the stated benchmark.</li><li><a href="/mcp">MCP tools</a>: the tools, with their input schemas.</li><li><a href="/playground">Playground</a>: call a tool in the browser.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var docs_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, docs_default as default };
