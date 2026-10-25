import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/d5b8ad62-1b74-4e71-a9ab-ece77e65754c.md
var __pageData = JSON.parse("{\"title\":\"d5b8ad62 · 11174147191011\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"d5b8ad62-1b74-4e71-a9ab-ece77e65754c\",\"prev\":{\"text\":\"family d5b8ad62\",\"link\":\"/h/d5b8ad62\"},\"next\":{\"text\":\"next: the program rotated d5b8ad62\",\"link\":\"/u/d5b8ad62-b74e-3719-8ab1-ece77e65754c\"}},\"headers\":[],\"params\":{\"uuid\":\"d5b8ad62-1b74-4e71-a9ab-ece77e65754c\"},\"relativePath\":\"u/d5b8ad62-1b74-4e71-a9ab-ece77e65754c.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/d5b8ad62-1b74-4e71-a9ab-ece77e65754c.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/d5b8ad62-1b74-4e71-a9ab-ece77e65754c.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var d5b8ad62_1b74_4e71_a9ab_ece77e65754c_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, d5b8ad62_1b74_4e71_a9ab_ece77e65754c_default as default };
