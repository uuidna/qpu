import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/dfe03e5e-06d5-35b0-aaec-e43c23686a6a.md
var __pageData = JSON.parse("{\"title\":\"dfe03e5e · 061355110101412\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"dfe03e5e-06d5-35b0-aaec-e43c23686a6a\",\"prev\":{\"text\":\"previous receipt 7ce3ebb3\",\"link\":\"/u/7ce3ebb3-32fc-3246-8bcd-58ab2fdecfa6\"},\"next\":{\"text\":\"next: the program rotated dfe03e5e\",\"link\":\"/u/dfe03e5e-6d55-3b0a-8ec0-e43c23686a6a\"}},\"headers\":[],\"params\":{\"uuid\":\"dfe03e5e-06d5-35b0-aaec-e43c23686a6a\"},\"relativePath\":\"u/dfe03e5e-06d5-35b0-aaec-e43c23686a6a.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/dfe03e5e-06d5-35b0-aaec-e43c23686a6a.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/dfe03e5e-06d5-35b0-aaec-e43c23686a6a.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dfe03e5e_06d5_35b0_aaec_e43c23686a6a_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, dfe03e5e_06d5_35b0_aaec_e43c23686a6a_default as default };
