import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/feeea864-9e31-7e99-92f8-72c09a15331d.md
var __pageData = JSON.parse("{\"title\":\"feeea864 · 9143114992158\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"feeea864-9e31-7e99-92f8-72c09a15331d\",\"prev\":{\"text\":\"family feeea864\",\"link\":\"/h/feeea864\"},\"next\":{\"text\":\"next: the program rotated feeea864\",\"link\":\"/u/feeea864-e31e-1992-8f89-72c09a15331d\"}},\"headers\":[],\"params\":{\"uuid\":\"feeea864-9e31-7e99-92f8-72c09a15331d\"},\"relativePath\":\"u/feeea864-9e31-7e99-92f8-72c09a15331d.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/feeea864-9e31-7e99-92f8-72c09a15331d.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/feeea864-9e31-7e99-92f8-72c09a15331d.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var feeea864_9e31_7e99_92f8_72c09a15331d_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, feeea864_9e31_7e99_92f8_72c09a15331d_default as default };
