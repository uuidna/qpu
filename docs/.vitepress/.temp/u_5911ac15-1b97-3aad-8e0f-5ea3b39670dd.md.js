import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/5911ac15-1b97-3aad-8e0f-5ea3b39670dd.md
var __pageData = JSON.parse("{\"title\":\"5911ac15 · 1119710101314015\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"5911ac15-1b97-3aad-8e0f-5ea3b39670dd\",\"prev\":{\"text\":\"previous receipt aa8425c8\",\"link\":\"/u/aa8425c8-b949-57fc-83e7-9fdbc8367842\"},\"next\":{\"text\":\"next: the program rotated 5911ac15\",\"link\":\"/u/5911ac15-b97a-3ade-80f1-5ea3b39670dd\"}},\"headers\":[],\"params\":{\"uuid\":\"5911ac15-1b97-3aad-8e0f-5ea3b39670dd\"},\"relativePath\":\"u/5911ac15-1b97-3aad-8e0f-5ea3b39670dd.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/5911ac15-1b97-3aad-8e0f-5ea3b39670dd.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/5911ac15-1b97-3aad-8e0f-5ea3b39670dd.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _5911ac15_1b97_3aad_8e0f_5ea3b39670dd_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _5911ac15_1b97_3aad_8e0f_5ea3b39670dd_default as default };
