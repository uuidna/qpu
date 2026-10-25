import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/e834675a-0c43-7801-bd16-85a8b82fa72e.md
var __pageData = JSON.parse("{\"title\":\"e834675a · 012438011316\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"e834675a-0c43-7801-bd16-85a8b82fa72e\",\"prev\":{\"text\":\"family e834675a\",\"link\":\"/h/e834675a\"},\"next\":{\"text\":\"next: the program rotated e834675a\",\"link\":\"/u/e834675a-c438-101d-8160-85a8b82fa72e\"}},\"headers\":[],\"params\":{\"uuid\":\"e834675a-0c43-7801-bd16-85a8b82fa72e\"},\"relativePath\":\"u/e834675a-0c43-7801-bd16-85a8b82fa72e.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/e834675a-0c43-7801-bd16-85a8b82fa72e.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/e834675a-0c43-7801-bd16-85a8b82fa72e.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var e834675a_0c43_7801_bd16_85a8b82fa72e_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, e834675a_0c43_7801_bd16_85a8b82fa72e_default as default };
