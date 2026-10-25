import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/9927dea3-ee39-8a90-83ad-2e1c1baec25b.md
var __pageData = JSON.parse("{\"title\":\"9927dea3 · 141439109031013\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"9927dea3-ee39-8a90-83ad-2e1c1baec25b\",\"prev\":{\"text\":\"family 9927dea3\",\"link\":\"/h/9927dea3\"},\"next\":{\"text\":\"next: the program rotated 9927dea3\",\"link\":\"/u/9927dea3-e39a-3903-8ade-2e1c1baec25b\"}},\"headers\":[],\"params\":{\"uuid\":\"9927dea3-ee39-8a90-83ad-2e1c1baec25b\"},\"relativePath\":\"u/9927dea3-ee39-8a90-83ad-2e1c1baec25b.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/9927dea3-ee39-8a90-83ad-2e1c1baec25b.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/9927dea3-ee39-8a90-83ad-2e1c1baec25b.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _9927dea3_ee39_8a90_83ad_2e1c1baec25b_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _9927dea3_ee39_8a90_83ad_2e1c1baec25b_default as default };
