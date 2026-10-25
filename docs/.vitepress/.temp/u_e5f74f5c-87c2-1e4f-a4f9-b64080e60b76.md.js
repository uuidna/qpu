import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/e5f74f5c-87c2-1e4f-a4f9-b64080e60b76.md
var __pageData = JSON.parse("{\"title\":\"e5f74f5c · 87122144154159\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"e5f74f5c-87c2-1e4f-a4f9-b64080e60b76\",\"prev\":{\"text\":\"family e5f74f5c\",\"link\":\"/h/e5f74f5c\"},\"next\":{\"text\":\"next: the program rotated e5f74f5c\",\"link\":\"/u/e5f74f5c-7c2e-44f4-8f98-b64080e60b76\"}},\"headers\":[],\"params\":{\"uuid\":\"e5f74f5c-87c2-1e4f-a4f9-b64080e60b76\"},\"relativePath\":\"u/e5f74f5c-87c2-1e4f-a4f9-b64080e60b76.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/e5f74f5c-87c2-1e4f-a4f9-b64080e60b76.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/e5f74f5c-87c2-1e4f-a4f9-b64080e60b76.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var e5f74f5c_87c2_1e4f_a4f9_b64080e60b76_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, e5f74f5c_87c2_1e4f_a4f9_b64080e60b76_default as default };
