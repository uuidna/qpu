import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/d92bb01d-d5d5-7636-9c27-391e84acc22f.md
var __pageData = JSON.parse("{\"title\":\"d92bb01d · 1351356361227\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"d92bb01d-d5d5-7636-9c27-391e84acc22f\",\"prev\":{\"text\":\"family d92bb01d\",\"link\":\"/h/d92bb01d\"},\"next\":{\"text\":\"next: the program rotated d92bb01d\",\"link\":\"/u/d92bb01d-5d56-236c-827d-391e84acc22f\"}},\"headers\":[],\"params\":{\"uuid\":\"d92bb01d-d5d5-7636-9c27-391e84acc22f\"},\"relativePath\":\"u/d92bb01d-d5d5-7636-9c27-391e84acc22f.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/d92bb01d-d5d5-7636-9c27-391e84acc22f.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/d92bb01d-d5d5-7636-9c27-391e84acc22f.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var d92bb01d_d5d5_7636_9c27_391e84acc22f_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, d92bb01d_d5d5_7636_9c27_391e84acc22f_default as default };
