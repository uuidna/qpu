import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/34ef4c03-bee3-3cea-b2f7-2970fe3a447e.md
var __pageData = JSON.parse("{\"title\":\"34ef4c03 · 11141431214102157\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"34ef4c03-bee3-3cea-b2f7-2970fe3a447e\",\"prev\":{\"text\":\"family 34ef4c03\",\"link\":\"/h/34ef4c03\"},\"next\":{\"text\":\"next: the program rotated 34ef4c03\",\"link\":\"/u/34ef4c03-ee3c-3ea2-8f7b-2970fe3a447e\"}},\"headers\":[],\"params\":{\"uuid\":\"34ef4c03-bee3-3cea-b2f7-2970fe3a447e\"},\"relativePath\":\"u/34ef4c03-bee3-3cea-b2f7-2970fe3a447e.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/34ef4c03-bee3-3cea-b2f7-2970fe3a447e.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/34ef4c03-bee3-3cea-b2f7-2970fe3a447e.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _34ef4c03_bee3_3cea_b2f7_2970fe3a447e_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _34ef4c03_bee3_3cea_b2f7_2970fe3a447e_default as default };
