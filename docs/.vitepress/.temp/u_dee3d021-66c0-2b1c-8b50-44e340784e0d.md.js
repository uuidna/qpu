import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/dee3d021-66c0-2b1c-8b50-44e340784e0d.md
var __pageData = JSON.parse("{\"title\":\"dee3d021 · 66120111121150\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"dee3d021-66c0-2b1c-8b50-44e340784e0d\",\"prev\":{\"text\":\"family dee3d021\",\"link\":\"/h/dee3d021\"},\"next\":{\"text\":\"next: the program rotated dee3d021\",\"link\":\"/u/dee3d021-6c0b-51cb-8506-44e340784e0d\"}},\"headers\":[],\"params\":{\"uuid\":\"dee3d021-66c0-2b1c-8b50-44e340784e0d\"},\"relativePath\":\"u/dee3d021-66c0-2b1c-8b50-44e340784e0d.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/dee3d021-66c0-2b1c-8b50-44e340784e0d.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/dee3d021-66c0-2b1c-8b50-44e340784e0d.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dee3d021_66c0_2b1c_8b50_44e340784e0d_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, dee3d021_66c0_2b1c_8b50_44e340784e0d_default as default };
