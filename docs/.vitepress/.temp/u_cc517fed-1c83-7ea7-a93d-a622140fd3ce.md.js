import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/cc517fed-1c83-7ea7-a93d-a622140fd3ce.md
var __pageData = JSON.parse("{\"title\":\"cc517fed · 11283141079313\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"cc517fed-1c83-7ea7-a93d-a622140fd3ce\",\"prev\":{\"text\":\"family cc517fed\",\"link\":\"/h/cc517fed\"},\"next\":{\"text\":\"next: the program rotated cc517fed\",\"link\":\"/u/cc517fed-c83e-7a79-83d1-a622140fd3ce\"}},\"headers\":[],\"params\":{\"uuid\":\"cc517fed-1c83-7ea7-a93d-a622140fd3ce\"},\"relativePath\":\"u/cc517fed-1c83-7ea7-a93d-a622140fd3ce.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/cc517fed-1c83-7ea7-a93d-a622140fd3ce.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/cc517fed-1c83-7ea7-a93d-a622140fd3ce.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var cc517fed_1c83_7ea7_a93d_a622140fd3ce_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, cc517fed_1c83_7ea7_a93d_a622140fd3ce_default as default };
