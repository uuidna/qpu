import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/ac90951a-c876-4f72-b0c5-c369d6dc5927.md
var __pageData = JSON.parse("{\"title\":\"ac90951a · 1287615720125\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"ac90951a-c876-4f72-b0c5-c369d6dc5927\",\"prev\":{\"text\":\"family ac90951a\",\"link\":\"/h/ac90951a\"},\"next\":{\"text\":\"next: the program rotated ac90951a\",\"link\":\"/u/ac90951a-876f-7720-8c5c-c369d6dc5927\"}},\"headers\":[],\"params\":{\"uuid\":\"ac90951a-c876-4f72-b0c5-c369d6dc5927\"},\"relativePath\":\"u/ac90951a-c876-4f72-b0c5-c369d6dc5927.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/ac90951a-c876-4f72-b0c5-c369d6dc5927.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/ac90951a-c876-4f72-b0c5-c369d6dc5927.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ac90951a_c876_4f72_b0c5_c369d6dc5927_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, ac90951a_c876_4f72_b0c5_c369d6dc5927_default as default };
