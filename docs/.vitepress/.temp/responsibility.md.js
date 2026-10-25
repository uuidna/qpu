import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
// docs/responsibility.md
var __pageData = JSON.parse("{\"title\":\"Responsibility\",\"description\":\"\",\"frontmatter\":{\"title\":\"Responsibility\",\"order\":35},\"headers\":[],\"relativePath\":\"responsibility.md\",\"filePath\":\"responsibility.md\",\"lastUpdated\":1792847078000}");
var _sfc_main = { name: "responsibility.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="responsibility" tabindex="-1">Responsibility <a class="header-anchor" href="#responsibility" aria-label="Permalink to “Responsibility”">​</a></h1><p>Google Quantum AI&#39;s statement on its technological and societal responsibilities, as its published PDF states it. The statement is documentation, not code.</p><ul><li>Google aims to be honest and realistic about the progress and limitations of quantum computing, and says many in the industry are exaggerating its current capabilities.</li><li>A fault-tolerant quantum computer could break RSA by factoring large primes, which would compromise the integrity of electronic communication. The statement names this as a reason for collaboration across sectors and geographies.</li><li>Post-quantum cryptography is the security community&#39;s response. NIST has announced a first set of post-quantum tools to be standardized, one of which, SPHINCS+, was developed with Google&#39;s contributions. Google says it is taking its own steps to keep Google Cloud, Android and Chrome secure.</li><li>Google advises and collaborates with academic institutions, including UC Santa Barbara, UC Berkeley, MIT, Harvard, Oxford and the University of Toronto, and has released open-source tools for quantum computing algorithm and simulation software.</li><li>Google&#39;s stated vision is that people will use classical computers as well as quantum computers to expand the boundaries of human knowledge and solve some of the world&#39;s most complex problems.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("responsibility.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var responsibility_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, responsibility_default as default };
