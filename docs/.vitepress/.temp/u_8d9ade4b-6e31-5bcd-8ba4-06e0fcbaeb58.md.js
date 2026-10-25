import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/8d9ade4b-6e31-5bcd-8ba4-06e0fcbaeb58.md
var __pageData = JSON.parse("{\"title\":\"8d9ade4b · 6143111121311104\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"8d9ade4b-6e31-5bcd-8ba4-06e0fcbaeb58\",\"prev\":{\"text\":\"previous receipt 31120089\",\"link\":\"/u/31120089-e715-3395-b84a-75c001aacde4\"},\"next\":{\"text\":\"next: the program rotated 8d9ade4b\",\"link\":\"/u/8d9ade4b-e31b-3cdb-8a46-06e0fcbaeb58\"}},\"headers\":[],\"params\":{\"uuid\":\"8d9ade4b-6e31-5bcd-8ba4-06e0fcbaeb58\"},\"relativePath\":\"u/8d9ade4b-6e31-5bcd-8ba4-06e0fcbaeb58.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/8d9ade4b-6e31-5bcd-8ba4-06e0fcbaeb58.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_Channel = resolveComponent("Channel");
	const _component_Verify = resolveComponent("Verify");
	const _component_Compile = resolveComponent("Compile");
	_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="params-uuid" tabindex="-1"><code>${ssrInterpolate(_ctx.$params.uuid)}</code> <a class="header-anchor" href="#params-uuid" aria-label="Permalink to “{{ \$params.uuid }}”">​</a></h1><p>A page from the id alone: its channel, its seal, its reflection, its program compiled and its next step executed here in the browser by the same <code>handle</code> the MCP serves. The previous step is the page that sent you; the next is the program rotated.</p>`);
	_push(ssrRenderComponent(_component_Channel, { uuid: _ctx.$params.uuid }, null, _parent));
	_push(ssrRenderComponent(_component_Verify, { uuid: _ctx.$params.uuid }, null, _parent));
	_push(ssrRenderComponent(_component_Compile, { uuid: _ctx.$params.uuid }, null, _parent));
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/8d9ade4b-6e31-5bcd-8ba4-06e0fcbaeb58.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _8d9ade4b_6e31_5bcd_8ba4_06e0fcbaeb58_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _8d9ade4b_6e31_5bcd_8ba4_06e0fcbaeb58_default as default };
