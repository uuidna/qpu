import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
// docs/echo.md
var __pageData = JSON.parse("{\"title\":\"Quantum Echoes\",\"description\":\"\",\"frontmatter\":{\"title\":\"Quantum Echoes\",\"order\":30},\"headers\":[],\"relativePath\":\"echo.md\",\"filePath\":\"echo.md\",\"lastUpdated\":1792846774000}");
var _sfc_main = { name: "echo.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="quantum-echoes" tabindex="-1">Quantum Echoes <a class="header-anchor" href="#quantum-echoes" aria-label="Permalink to “Quantum Echoes”">​</a></h1><p>Quantum Echoes runs the operations forward, perturbs one qubit, runs them back, and measures. Without a perturbation the echo returns to the start with certainty. A perturbation that reaches the measured qubits disturbs it: the out-of-time-order correlator the protocol measures. The code is <code>src/quantum/echo.ts</code>.</p><p>Google&#39;s blog states the result: the protocol ran on the 105-qubit array of Willow and was 13,000× faster than the fastest supercomputers, on molecules of 15 and 28 atoms.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("echo.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var echo_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, echo_default as default };
