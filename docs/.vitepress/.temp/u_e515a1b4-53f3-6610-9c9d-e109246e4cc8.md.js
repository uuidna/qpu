import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/e515a1b4-53f3-6610-9c9d-e109246e4cc8.md
var __pageData = JSON.parse("{\"title\":\"e515a1b4 · 5315361012913\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"e515a1b4-53f3-6610-9c9d-e109246e4cc8\",\"prev\":{\"text\":\"family e515a1b4\",\"link\":\"/h/e515a1b4\"},\"next\":{\"text\":\"next: the program rotated e515a1b4\",\"link\":\"/u/e515a1b4-3f36-810c-89d5-e109246e4cc8\"}},\"headers\":[],\"params\":{\"uuid\":\"e515a1b4-53f3-6610-9c9d-e109246e4cc8\"},\"relativePath\":\"u/e515a1b4-53f3-6610-9c9d-e109246e4cc8.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/e515a1b4-53f3-6610-9c9d-e109246e4cc8.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/e515a1b4-53f3-6610-9c9d-e109246e4cc8.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var e515a1b4_53f3_6610_9c9d_e109246e4cc8_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, e515a1b4_53f3_6610_9c9d_e109246e4cc8_default as default };
