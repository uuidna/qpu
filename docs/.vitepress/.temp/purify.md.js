import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
// docs/purify.md
var __pageData = JSON.parse("{\"title\":\"Purify\",\"description\":\"\",\"frontmatter\":{\"title\":\"Purify\",\"order\":51},\"headers\":[],\"relativePath\":\"purify.md\",\"filePath\":\"purify.md\",\"lastUpdated\":0}");
var _sfc_main = { name: "purify.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="purification-leads" tabindex="-1">Purification leads <a class="header-anchor" href="#purification-leads" aria-label="Permalink to “Purification leads”">​</a></h1><p>What the codebase found unproven when it collided itself with its tests, tools, examples, pages and proofs. Each is an open lead: harden it with a proof of use, or soften it by removal.</p><table tabindex="0"><thead><tr><th>Lead</th><th>Statement</th><th>Reason</th></tr></thead></table></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("purify.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var purify_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, purify_default as default };
