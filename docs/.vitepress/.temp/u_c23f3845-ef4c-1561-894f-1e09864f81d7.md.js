import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/c23f3845-ef4c-1561-894f-1e09864f81d7.md
var __pageData = JSON.parse("{\"title\":\"c23f3845 · 14154125619415\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"c23f3845-ef4c-1561-894f-1e09864f81d7\",\"prev\":{\"text\":\"family c23f3845\",\"link\":\"/h/c23f3845\"},\"next\":{\"text\":\"next: the program rotated c23f3845\",\"link\":\"/u/c23f3845-f4c5-2619-84fe-1e09864f81d7\"}},\"headers\":[],\"params\":{\"uuid\":\"c23f3845-ef4c-1561-894f-1e09864f81d7\"},\"relativePath\":\"u/c23f3845-ef4c-1561-894f-1e09864f81d7.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/c23f3845-ef4c-1561-894f-1e09864f81d7.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/c23f3845-ef4c-1561-894f-1e09864f81d7.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var c23f3845_ef4c_1561_894f_1e09864f81d7_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, c23f3845_ef4c_1561_894f_1e09864f81d7_default as default };
