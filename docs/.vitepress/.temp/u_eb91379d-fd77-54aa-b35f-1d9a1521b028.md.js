import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/eb91379d-fd77-54aa-b35f-1d9a1521b028.md
var __pageData = JSON.parse("{\"title\":\"eb91379d · 151377410103515\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"eb91379d-fd77-54aa-b35f-1d9a1521b028\",\"prev\":{\"text\":\"family eb91379d\",\"link\":\"/h/eb91379d\"},\"next\":{\"text\":\"next: the program rotated eb91379d\",\"link\":\"/u/eb91379d-d774-1aa3-85ff-1d9a1521b028\"}},\"headers\":[],\"params\":{\"uuid\":\"eb91379d-fd77-54aa-b35f-1d9a1521b028\"},\"relativePath\":\"u/eb91379d-fd77-54aa-b35f-1d9a1521b028.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/eb91379d-fd77-54aa-b35f-1d9a1521b028.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/eb91379d-fd77-54aa-b35f-1d9a1521b028.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var eb91379d_fd77_54aa_b35f_1d9a1521b028_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, eb91379d_fd77_54aa_b35f_1d9a1521b028_default as default };
