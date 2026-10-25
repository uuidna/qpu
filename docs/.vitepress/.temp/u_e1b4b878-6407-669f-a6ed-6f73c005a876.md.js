import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/e1b4b878-6407-669f-a6ed-6f73c005a876.md
var __pageData = JSON.parse("{\"title\":\"e1b4b878 · 6407691561413\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"e1b4b878-6407-669f-a6ed-6f73c005a876\",\"prev\":{\"text\":\"family e1b4b878\",\"link\":\"/h/e1b4b878\"},\"next\":{\"text\":\"next: the program rotated e1b4b878\",\"link\":\"/u/e1b4b878-4076-19f6-8ed6-6f73c005a876\"}},\"headers\":[],\"params\":{\"uuid\":\"e1b4b878-6407-669f-a6ed-6f73c005a876\"},\"relativePath\":\"u/e1b4b878-6407-669f-a6ed-6f73c005a876.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/e1b4b878-6407-669f-a6ed-6f73c005a876.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/e1b4b878-6407-669f-a6ed-6f73c005a876.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var e1b4b878_6407_669f_a6ed_6f73c005a876_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, e1b4b878_6407_669f_a6ed_6f73c005a876_default as default };
