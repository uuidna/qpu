import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
// docs/software.md
var __pageData = JSON.parse("{\"title\":\"Software\",\"description\":\"\",\"frontmatter\":{\"title\":\"Software\",\"order\":25},\"headers\":[],\"relativePath\":\"software.md\",\"filePath\":\"software.md\",\"lastUpdated\":1792847068000}");
var _sfc_main = { name: "software.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="software" tabindex="-1">Software <a class="header-anchor" href="#software" aria-label="Permalink to “Software”">​</a></h1><p>Google Quantum AI&#39;s open-source tools, as its software page describes them. Cirq is implemented in this repository; the others are separate projects, listed here as the page states them.</p><ul><li><strong>Cirq</strong>: an open-source quantum framework for building and experimenting with NISQ algorithms on near-term processors. See <a href="/cirq">Cirq</a>.</li><li><strong>qsim</strong>: a fast quantum circuit simulator that integrates with Cirq and runs quantum simulations on high-performance classical hardware.</li><li><strong>Qualtran</strong>: a set of abstractions for representing quantum programs, and a library of quantum algorithms for quantum algorithms research.</li><li><strong>OpenFermion</strong>: an open-source library for translating chemistry and materials science problems into quantum circuits that run on existing platforms.</li><li><strong>TensorFlow Quantum</strong>: a quantum machine learning library for rapidly prototyping hybrid quantum-classical machine learning models within TensorFlow.</li></ul><p>The page states no version numbers, benchmarks or licence terms for these projects.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("software.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var software_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, software_default as default };
