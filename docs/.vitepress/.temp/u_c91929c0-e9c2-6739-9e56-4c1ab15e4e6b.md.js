import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/c91929c0-e9c2-6739-9e56-4c1ab15e4e6b.md
var __pageData = JSON.parse("{\"title\":\"c91929c0 · 1491227391456\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"c91929c0-e9c2-6739-9e56-4c1ab15e4e6b\",\"prev\":{\"text\":\"family c91929c0\",\"link\":\"/h/c91929c0\"},\"next\":{\"text\":\"next: the program rotated c91929c0\",\"link\":\"/u/c91929c0-9c27-539e-856e-4c1ab15e4e6b\"}},\"headers\":[],\"params\":{\"uuid\":\"c91929c0-e9c2-6739-9e56-4c1ab15e4e6b\"},\"relativePath\":\"u/c91929c0-e9c2-6739-9e56-4c1ab15e4e6b.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/c91929c0-e9c2-6739-9e56-4c1ab15e4e6b.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/c91929c0-e9c2-6739-9e56-4c1ab15e4e6b.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var c91929c0_e9c2_6739_9e56_4c1ab15e4e6b_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, c91929c0_e9c2_6739_9e56_4c1ab15e4e6b_default as default };
