import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/51128ead-da96-269f-a616-c5954d747cda.md
var __pageData = JSON.parse("{\"title\":\"51128ead · 1310966915616\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"51128ead-da96-269f-a616-c5954d747cda\",\"prev\":{\"text\":\"family 51128ead\",\"link\":\"/h/51128ead\"},\"next\":{\"text\":\"next: the program rotated 51128ead\",\"link\":\"/u/51128ead-a966-79f6-816d-c5954d747cda\"}},\"headers\":[],\"params\":{\"uuid\":\"51128ead-da96-269f-a616-c5954d747cda\"},\"relativePath\":\"u/51128ead-da96-269f-a616-c5954d747cda.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/51128ead-da96-269f-a616-c5954d747cda.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/51128ead-da96-269f-a616-c5954d747cda.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _51128ead_da96_269f_a616_c5954d747cda_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _51128ead_da96_269f_a616_c5954d747cda_default as default };
