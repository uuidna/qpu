import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/d7b77038-1a7d-193e-a79b-360d6eb7b58a.md
var __pageData = JSON.parse("{\"title\":\"d7b77038 · 11071393147911\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"d7b77038-1a7d-193e-a79b-360d6eb7b58a\",\"prev\":{\"text\":\"family d7b77038\",\"link\":\"/h/d7b77038\"},\"next\":{\"text\":\"next: the program rotated d7b77038\",\"link\":\"/u/d7b77038-a7d9-73e7-89b1-360d6eb7b58a\"}},\"headers\":[],\"params\":{\"uuid\":\"d7b77038-1a7d-193e-a79b-360d6eb7b58a\"},\"relativePath\":\"u/d7b77038-1a7d-193e-a79b-360d6eb7b58a.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/d7b77038-1a7d-193e-a79b-360d6eb7b58a.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/d7b77038-1a7d-193e-a79b-360d6eb7b58a.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var d7b77038_1a7d_193e_a79b_360d6eb7b58a_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, d7b77038_1a7d_193e_a79b_360d6eb7b58a_default as default };
