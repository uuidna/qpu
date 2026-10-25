import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/f1d3f11b-4430-3a34-a7bb-5abc4a2fcb94.md
var __pageData = JSON.parse("{\"title\":\"f1d3f11b · 4430103471111\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"f1d3f11b-4430-3a34-a7bb-5abc4a2fcb94\",\"prev\":{\"text\":\"family f1d3f11b\",\"link\":\"/h/f1d3f11b\"},\"next\":{\"text\":\"next: the program rotated f1d3f11b\",\"link\":\"/u/f1d3f11b-430a-5347-8bb4-5abc4a2fcb94\"}},\"headers\":[],\"params\":{\"uuid\":\"f1d3f11b-4430-3a34-a7bb-5abc4a2fcb94\"},\"relativePath\":\"u/f1d3f11b-4430-3a34-a7bb-5abc4a2fcb94.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/f1d3f11b-4430-3a34-a7bb-5abc4a2fcb94.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/f1d3f11b-4430-3a34-a7bb-5abc4a2fcb94.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var f1d3f11b_4430_3a34_a7bb_5abc4a2fcb94_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, f1d3f11b_4430_3a34_a7bb_5abc4a2fcb94_default as default };
