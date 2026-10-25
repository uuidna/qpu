import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/a01d7fb8-b531-6b3a-b8b1-351f89f2f8ef.md
var __pageData = JSON.parse("{\"title\":\"a01d7fb8 · 11531113108111\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"a01d7fb8-b531-6b3a-b8b1-351f89f2f8ef\",\"prev\":{\"text\":\"previous receipt 5ec59325\",\"link\":\"/u/5ec59325-f245-1512-9efd-abb80be6469c\"},\"next\":{\"text\":\"next: the program rotated a01d7fb8\",\"link\":\"/u/a01d7fb8-531b-43a8-8b1b-351f89f2f8ef\"}},\"headers\":[],\"params\":{\"uuid\":\"a01d7fb8-b531-6b3a-b8b1-351f89f2f8ef\"},\"relativePath\":\"u/a01d7fb8-b531-6b3a-b8b1-351f89f2f8ef.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/a01d7fb8-b531-6b3a-b8b1-351f89f2f8ef.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/a01d7fb8-b531-6b3a-b8b1-351f89f2f8ef.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var a01d7fb8_b531_6b3a_b8b1_351f89f2f8ef_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, a01d7fb8_b531_6b3a_b8b1_351f89f2f8ef_default as default };
