import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/ddc23a70-6b45-2977-8d1a-0bb90c75f365.md
var __pageData = JSON.parse("{\"title\":\"ddc23a70 · 6114597713110\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"ddc23a70-6b45-2977-8d1a-0bb90c75f365\",\"prev\":{\"text\":\"previous receipt 92b19da5\",\"link\":\"/u/92b19da5-3934-5987-af90-4daeb2732c65\"},\"next\":{\"text\":\"next: the program rotated ddc23a70\",\"link\":\"/u/ddc23a70-b459-677d-81a6-0bb90c75f365\"}},\"headers\":[],\"params\":{\"uuid\":\"ddc23a70-6b45-2977-8d1a-0bb90c75f365\"},\"relativePath\":\"u/ddc23a70-6b45-2977-8d1a-0bb90c75f365.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/ddc23a70-6b45-2977-8d1a-0bb90c75f365.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/ddc23a70-6b45-2977-8d1a-0bb90c75f365.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ddc23a70_6b45_2977_8d1a_0bb90c75f365_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, ddc23a70_6b45_2977_8d1a_0bb90c75f365_default as default };
