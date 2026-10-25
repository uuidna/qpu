import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/9b6a3fa1-f339-8c59-9d0d-a7d74c0457b4.md
var __pageData = JSON.parse("{\"title\":\"9b6a3fa1 · 15339125913013\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"9b6a3fa1-f339-8c59-9d0d-a7d74c0457b4\",\"prev\":{\"text\":\"family 9b6a3fa1\",\"link\":\"/h/9b6a3fa1\"},\"next\":{\"text\":\"next: the program rotated 9b6a3fa1\",\"link\":\"/u/9b6a3fa1-339c-759d-80df-a7d74c0457b4\"}},\"headers\":[],\"params\":{\"uuid\":\"9b6a3fa1-f339-8c59-9d0d-a7d74c0457b4\"},\"relativePath\":\"u/9b6a3fa1-f339-8c59-9d0d-a7d74c0457b4.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/9b6a3fa1-f339-8c59-9d0d-a7d74c0457b4.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/9b6a3fa1-f339-8c59-9d0d-a7d74c0457b4.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _9b6a3fa1_f339_8c59_9d0d_a7d74c0457b4_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _9b6a3fa1_f339_8c59_9d0d_a7d74c0457b4_default as default };
