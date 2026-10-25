import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/dca5b1f6-574e-6978-8b57-8333b3ccf74d.md
var __pageData = JSON.parse("{\"title\":\"dca5b1f6 · 574149781157\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"dca5b1f6-574e-6978-8b57-8333b3ccf74d\",\"prev\":{\"text\":\"family dca5b1f6\",\"link\":\"/h/dca5b1f6\"},\"next\":{\"text\":\"next: the program rotated dca5b1f6\",\"link\":\"/u/dca5b1f6-74e9-478b-8575-8333b3ccf74d\"}},\"headers\":[],\"params\":{\"uuid\":\"dca5b1f6-574e-6978-8b57-8333b3ccf74d\"},\"relativePath\":\"u/dca5b1f6-574e-6978-8b57-8333b3ccf74d.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/dca5b1f6-574e-6978-8b57-8333b3ccf74d.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/dca5b1f6-574e-6978-8b57-8333b3ccf74d.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dca5b1f6_574e_6978_8b57_8333b3ccf74d_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, dca5b1f6_574e_6978_8b57_8333b3ccf74d_default as default };
