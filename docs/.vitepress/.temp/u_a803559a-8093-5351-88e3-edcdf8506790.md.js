import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/a803559a-8093-5351-88e3-edcdf8506790.md
var __pageData = JSON.parse("{\"title\":\"a803559a · 80933518143\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"a803559a-8093-5351-88e3-edcdf8506790\",\"prev\":{\"text\":\"family a803559a\",\"link\":\"/h/a803559a\"},\"next\":{\"text\":\"next: the program rotated a803559a\",\"link\":\"/u/a803559a-0933-6518-8e38-edcdf8506790\"}},\"headers\":[],\"params\":{\"uuid\":\"a803559a-8093-5351-88e3-edcdf8506790\"},\"relativePath\":\"u/a803559a-8093-5351-88e3-edcdf8506790.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/a803559a-8093-5351-88e3-edcdf8506790.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/a803559a-8093-5351-88e3-edcdf8506790.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var a803559a_8093_5351_88e3_edcdf8506790_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, a803559a_8093_5351_88e3_edcdf8506790_default as default };
