import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/a34d361e-31c6-7a52-abcd-e1a04aa9fa9c.md
var __pageData = JSON.parse("{\"title\":\"a34d361e · 311261052111213\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"a34d361e-31c6-7a52-abcd-e1a04aa9fa9c\",\"prev\":{\"text\":\"previous receipt 71f7796a\",\"link\":\"/u/71f7796a-2c41-16ed-bd93-93714532822b\"},\"next\":{\"text\":\"next: the program rotated a34d361e\",\"link\":\"/u/a34d361e-1c6a-752b-8cd3-e1a04aa9fa9c\"}},\"headers\":[],\"params\":{\"uuid\":\"a34d361e-31c6-7a52-abcd-e1a04aa9fa9c\"},\"relativePath\":\"u/a34d361e-31c6-7a52-abcd-e1a04aa9fa9c.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/a34d361e-31c6-7a52-abcd-e1a04aa9fa9c.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/a34d361e-31c6-7a52-abcd-e1a04aa9fa9c.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var a34d361e_31c6_7a52_abcd_e1a04aa9fa9c_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, a34d361e_31c6_7a52_abcd_e1a04aa9fa9c_default as default };
