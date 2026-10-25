import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/23723586-f666-6aa0-902c-da10b06d5006.md
var __pageData = JSON.parse("{\"title\":\"23723586 · 15666101000212\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"23723586-f666-6aa0-902c-da10b06d5006\",\"prev\":{\"text\":\"family 23723586\",\"link\":\"/h/23723586\"},\"next\":{\"text\":\"next: the program rotated 23723586\",\"link\":\"/u/23723586-666a-7a00-82cf-da10b06d5006\"}},\"headers\":[],\"params\":{\"uuid\":\"23723586-f666-6aa0-902c-da10b06d5006\"},\"relativePath\":\"u/23723586-f666-6aa0-902c-da10b06d5006.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/23723586-f666-6aa0-902c-da10b06d5006.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/23723586-f666-6aa0-902c-da10b06d5006.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _23723586_f666_6aa0_902c_da10b06d5006_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _23723586_f666_6aa0_902c_da10b06d5006_default as default };
