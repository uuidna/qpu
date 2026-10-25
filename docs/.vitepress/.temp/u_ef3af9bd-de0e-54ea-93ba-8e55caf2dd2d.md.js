import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/ef3af9bd-de0e-54ea-93ba-8e55caf2dd2d.md
var __pageData = JSON.parse("{\"title\":\"ef3af9bd · 13140144141031110\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"ef3af9bd-de0e-54ea-93ba-8e55caf2dd2d\",\"prev\":{\"text\":\"previous receipt ab7e49cd\",\"link\":\"/u/ab7e49cd-c7dc-7f9d-9ef7-1762091f07dd\"},\"next\":{\"text\":\"next: the program rotated ef3af9bd\",\"link\":\"/u/ef3af9bd-e0e4-4ea3-8bad-8e55caf2dd2d\"}},\"headers\":[],\"params\":{\"uuid\":\"ef3af9bd-de0e-54ea-93ba-8e55caf2dd2d\"},\"relativePath\":\"u/ef3af9bd-de0e-54ea-93ba-8e55caf2dd2d.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/ef3af9bd-de0e-54ea-93ba-8e55caf2dd2d.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/ef3af9bd-de0e-54ea-93ba-8e55caf2dd2d.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ef3af9bd_de0e_54ea_93ba_8e55caf2dd2d_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, ef3af9bd_de0e_54ea_93ba_8e55caf2dd2d_default as default };
