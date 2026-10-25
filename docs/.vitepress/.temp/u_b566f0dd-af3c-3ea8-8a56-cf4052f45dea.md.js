import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/b566f0dd-af3c-3ea8-8a56-cf4052f45dea.md
var __pageData = JSON.parse("{\"title\":\"b566f0dd · 1015312141081056\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"b566f0dd-af3c-3ea8-8a56-cf4052f45dea\",\"prev\":{\"text\":\"family b566f0dd\",\"link\":\"/h/b566f0dd\"},\"next\":{\"text\":\"next: the program rotated b566f0dd\",\"link\":\"/u/b566f0dd-f3ce-7a8a-856a-cf4052f45dea\"}},\"headers\":[],\"params\":{\"uuid\":\"b566f0dd-af3c-3ea8-8a56-cf4052f45dea\"},\"relativePath\":\"u/b566f0dd-af3c-3ea8-8a56-cf4052f45dea.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/b566f0dd-af3c-3ea8-8a56-cf4052f45dea.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/b566f0dd-af3c-3ea8-8a56-cf4052f45dea.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var b566f0dd_af3c_3ea8_8a56_cf4052f45dea_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, b566f0dd_af3c_3ea8_8a56_cf4052f45dea_default as default };
