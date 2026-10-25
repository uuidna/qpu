import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/b5955168-f509-1b86-8ae5-d715c9bcad20.md
var __pageData = JSON.parse("{\"title\":\"b5955168 · 15509118610145\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"b5955168-f509-1b86-8ae5-d715c9bcad20\",\"prev\":{\"text\":\"previous receipt 7e3c8f83\",\"link\":\"/u/7e3c8f83-3f74-80b5-ab91-e599220594b3\"},\"next\":{\"text\":\"next: the program rotated b5955168\",\"link\":\"/u/b5955168-509b-286a-8e5f-d715c9bcad20\"}},\"headers\":[],\"params\":{\"uuid\":\"b5955168-f509-1b86-8ae5-d715c9bcad20\"},\"relativePath\":\"u/b5955168-f509-1b86-8ae5-d715c9bcad20.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/b5955168-f509-1b86-8ae5-d715c9bcad20.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/b5955168-f509-1b86-8ae5-d715c9bcad20.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var b5955168_f509_1b86_8ae5_d715c9bcad20_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, b5955168_f509_1b86_8ae5_d715c9bcad20_default as default };
