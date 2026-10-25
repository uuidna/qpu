import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/36105ef6-31bc-5d51-8b73-105065cc1b1f.md
var __pageData = JSON.parse("{\"title\":\"36105ef6 · 31111213511173\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"36105ef6-31bc-5d51-8b73-105065cc1b1f\",\"prev\":{\"text\":\"family 36105ef6\",\"link\":\"/h/36105ef6\"},\"next\":{\"text\":\"next: the program rotated 36105ef6\",\"link\":\"/u/36105ef6-1bcd-351b-8733-105065cc1b1f\"}},\"headers\":[],\"params\":{\"uuid\":\"36105ef6-31bc-5d51-8b73-105065cc1b1f\"},\"relativePath\":\"u/36105ef6-31bc-5d51-8b73-105065cc1b1f.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/36105ef6-31bc-5d51-8b73-105065cc1b1f.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/36105ef6-31bc-5d51-8b73-105065cc1b1f.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _36105ef6_31bc_5d51_8b73_105065cc1b1f_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _36105ef6_31bc_5d51_8b73_105065cc1b1f_default as default };
