import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/f5154365-aac9-8e8a-9d10-ea89cd96ed66.md
var __pageData = JSON.parse("{\"title\":\"f5154365 · 1010129148101310\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"f5154365-aac9-8e8a-9d10-ea89cd96ed66\",\"prev\":{\"text\":\"family f5154365\",\"link\":\"/h/f5154365\"},\"next\":{\"text\":\"next: the program rotated f5154365\",\"link\":\"/u/f5154365-ac9e-68ad-810a-ea89cd96ed66\"}},\"headers\":[],\"params\":{\"uuid\":\"f5154365-aac9-8e8a-9d10-ea89cd96ed66\"},\"relativePath\":\"u/f5154365-aac9-8e8a-9d10-ea89cd96ed66.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/f5154365-aac9-8e8a-9d10-ea89cd96ed66.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/f5154365-aac9-8e8a-9d10-ea89cd96ed66.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var f5154365_aac9_8e8a_9d10_ea89cd96ed66_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, f5154365_aac9_8e8a_9d10_ea89cd96ed66_default as default };
