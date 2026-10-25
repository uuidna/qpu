import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/c250bb96-78dd-282b-ba95-6c4416302778.md
var __pageData = JSON.parse("{\"title\":\"c250bb96 · 78131382111095\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"c250bb96-78dd-282b-ba95-6c4416302778\",\"prev\":{\"text\":\"previous receipt 4581b009\",\"link\":\"/u/4581b009-b511-413d-998a-b089eedb735f\"},\"next\":{\"text\":\"next: the program rotated c250bb96\",\"link\":\"/u/c250bb96-8dd8-32ba-8957-6c4416302778\"}},\"headers\":[],\"params\":{\"uuid\":\"c250bb96-78dd-282b-ba95-6c4416302778\"},\"relativePath\":\"u/c250bb96-78dd-282b-ba95-6c4416302778.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/c250bb96-78dd-282b-ba95-6c4416302778.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/c250bb96-78dd-282b-ba95-6c4416302778.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var c250bb96_78dd_282b_ba95_6c4416302778_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, c250bb96_78dd_282b_ba95_6c4416302778_default as default };
