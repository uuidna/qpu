import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/90d974c2-2a8a-2f89-9841-cbc1ab4c4ea9.md
var __pageData = JSON.parse("{\"title\":\"90d974c2 · 2108101589841\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"90d974c2-2a8a-2f89-9841-cbc1ab4c4ea9\",\"prev\":{\"text\":\"family 90d974c2\",\"link\":\"/h/90d974c2\"},\"next\":{\"text\":\"next: the program rotated 90d974c2\",\"link\":\"/u/90d974c2-a8af-6898-8412-cbc1ab4c4ea9\"}},\"headers\":[],\"params\":{\"uuid\":\"90d974c2-2a8a-2f89-9841-cbc1ab4c4ea9\"},\"relativePath\":\"u/90d974c2-2a8a-2f89-9841-cbc1ab4c4ea9.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/90d974c2-2a8a-2f89-9841-cbc1ab4c4ea9.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/90d974c2-2a8a-2f89-9841-cbc1ab4c4ea9.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _90d974c2_2a8a_2f89_9841_cbc1ab4c4ea9_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _90d974c2_2a8a_2f89_9841_cbc1ab4c4ea9_default as default };
