import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/d6a8e4ee-0be6-1434-8471-b23c98b7787c.md
var __pageData = JSON.parse("{\"title\":\"d6a8e4ee · 011146434471\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"d6a8e4ee-0be6-1434-8471-b23c98b7787c\",\"prev\":{\"text\":\"family d6a8e4ee\",\"link\":\"/h/d6a8e4ee\"},\"next\":{\"text\":\"next: the program rotated d6a8e4ee\",\"link\":\"/u/d6a8e4ee-be64-3344-8710-b23c98b7787c\"}},\"headers\":[],\"params\":{\"uuid\":\"d6a8e4ee-0be6-1434-8471-b23c98b7787c\"},\"relativePath\":\"u/d6a8e4ee-0be6-1434-8471-b23c98b7787c.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/d6a8e4ee-0be6-1434-8471-b23c98b7787c.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/d6a8e4ee-0be6-1434-8471-b23c98b7787c.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var d6a8e4ee_0be6_1434_8471_b23c98b7787c_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, d6a8e4ee_0be6_1434_8471_b23c98b7787c_default as default };
