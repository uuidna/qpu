import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/d2aa96d4-e721-7c63-b1d9-dd6a96e576ff.md
var __pageData = JSON.parse("{\"title\":\"d2aa96d4 · 1472112631139\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"d2aa96d4-e721-7c63-b1d9-dd6a96e576ff\",\"prev\":{\"text\":\"family d2aa96d4\",\"link\":\"/h/d2aa96d4\"},\"next\":{\"text\":\"next: the program rotated d2aa96d4\",\"link\":\"/u/d2aa96d4-721c-4631-8d9e-dd6a96e576ff\"}},\"headers\":[],\"params\":{\"uuid\":\"d2aa96d4-e721-7c63-b1d9-dd6a96e576ff\"},\"relativePath\":\"u/d2aa96d4-e721-7c63-b1d9-dd6a96e576ff.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/d2aa96d4-e721-7c63-b1d9-dd6a96e576ff.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/d2aa96d4-e721-7c63-b1d9-dd6a96e576ff.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var d2aa96d4_e721_7c63_b1d9_dd6a96e576ff_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, d2aa96d4_e721_7c63_b1d9_dd6a96e576ff_default as default };
