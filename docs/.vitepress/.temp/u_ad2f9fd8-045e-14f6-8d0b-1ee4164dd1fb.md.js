import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/ad2f9fd8-045e-14f6-8d0b-1ee4164dd1fb.md
var __pageData = JSON.parse("{\"title\":\"ad2f9fd8 · 04514415613011\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"ad2f9fd8-045e-14f6-8d0b-1ee4164dd1fb\",\"prev\":{\"text\":\"family ad2f9fd8\",\"link\":\"/h/ad2f9fd8\"},\"next\":{\"text\":\"next: the program rotated ad2f9fd8\",\"link\":\"/u/ad2f9fd8-45e4-1f6d-80b0-1ee4164dd1fb\"}},\"headers\":[],\"params\":{\"uuid\":\"ad2f9fd8-045e-14f6-8d0b-1ee4164dd1fb\"},\"relativePath\":\"u/ad2f9fd8-045e-14f6-8d0b-1ee4164dd1fb.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/ad2f9fd8-045e-14f6-8d0b-1ee4164dd1fb.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/ad2f9fd8-045e-14f6-8d0b-1ee4164dd1fb.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ad2f9fd8_045e_14f6_8d0b_1ee4164dd1fb_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, ad2f9fd8_045e_14f6_8d0b_1ee4164dd1fb_default as default };
