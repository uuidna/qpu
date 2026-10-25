import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/d4979ac6-be35-14f9-af93-83fd61bae91d.md
var __pageData = JSON.parse("{\"title\":\"d4979ac6 · 11143541591593\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"d4979ac6-be35-14f9-af93-83fd61bae91d\",\"prev\":{\"text\":\"previous receipt 69226ab8\",\"link\":\"/u/69226ab8-d59e-8ca8-a9ea-7d5e68b1ca48\"},\"next\":{\"text\":\"next: the program rotated d4979ac6\",\"link\":\"/u/d4979ac6-e354-3f9f-893b-83fd61bae91d\"}},\"headers\":[],\"params\":{\"uuid\":\"d4979ac6-be35-14f9-af93-83fd61bae91d\"},\"relativePath\":\"u/d4979ac6-be35-14f9-af93-83fd61bae91d.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/d4979ac6-be35-14f9-af93-83fd61bae91d.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/d4979ac6-be35-14f9-af93-83fd61bae91d.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var d4979ac6_be35_14f9_af93_83fd61bae91d_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, d4979ac6_be35_14f9_af93_83fd61bae91d_default as default };
