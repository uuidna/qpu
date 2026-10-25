import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/9323b500-e973-5c40-aded-583bed9657c8.md
var __pageData = JSON.parse("{\"title\":\"9323b500 · 149731240131413\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"9323b500-e973-5c40-aded-583bed9657c8\",\"prev\":{\"text\":\"family 9323b500\",\"link\":\"/h/9323b500\"},\"next\":{\"text\":\"next: the program rotated 9323b500\",\"link\":\"/u/9323b500-973c-540d-8ede-583bed9657c8\"}},\"headers\":[],\"params\":{\"uuid\":\"9323b500-e973-5c40-aded-583bed9657c8\"},\"relativePath\":\"u/9323b500-e973-5c40-aded-583bed9657c8.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/9323b500-e973-5c40-aded-583bed9657c8.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/9323b500-e973-5c40-aded-583bed9657c8.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _9323b500_e973_5c40_aded_583bed9657c8_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _9323b500_e973_5c40_aded_583bed9657c8_default as default };
