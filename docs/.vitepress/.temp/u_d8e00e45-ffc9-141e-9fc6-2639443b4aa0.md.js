import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/d8e00e45-ffc9-141e-9fc6-2639443b4aa0.md
var __pageData = JSON.parse("{\"title\":\"d8e00e45 · 1515129411415126\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"d8e00e45-ffc9-141e-9fc6-2639443b4aa0\",\"prev\":{\"text\":\"family d8e00e45\",\"link\":\"/h/d8e00e45\"},\"next\":{\"text\":\"next: the program rotated d8e00e45\",\"link\":\"/u/d8e00e45-fc94-31ef-8c6f-2639443b4aa0\"}},\"headers\":[],\"params\":{\"uuid\":\"d8e00e45-ffc9-141e-9fc6-2639443b4aa0\"},\"relativePath\":\"u/d8e00e45-ffc9-141e-9fc6-2639443b4aa0.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/d8e00e45-ffc9-141e-9fc6-2639443b4aa0.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/d8e00e45-ffc9-141e-9fc6-2639443b4aa0.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var d8e00e45_ffc9_141e_9fc6_2639443b4aa0_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, d8e00e45_ffc9_141e_9fc6_2639443b4aa0_default as default };
