import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/fc65051b-1c95-6a80-baa2-0b4d296a62a3.md
var __pageData = JSON.parse("{\"title\":\"fc65051b · 11295108010102\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"fc65051b-1c95-6a80-baa2-0b4d296a62a3\",\"prev\":{\"text\":\"family fc65051b\",\"link\":\"/h/fc65051b\"},\"next\":{\"text\":\"next: the program rotated fc65051b\",\"link\":\"/u/fc65051b-c95a-580a-8a21-0b4d296a62a3\"}},\"headers\":[],\"params\":{\"uuid\":\"fc65051b-1c95-6a80-baa2-0b4d296a62a3\"},\"relativePath\":\"u/fc65051b-1c95-6a80-baa2-0b4d296a62a3.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/fc65051b-1c95-6a80-baa2-0b4d296a62a3.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/fc65051b-1c95-6a80-baa2-0b4d296a62a3.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var fc65051b_1c95_6a80_baa2_0b4d296a62a3_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, fc65051b_1c95_6a80_baa2_0b4d296a62a3_default as default };
