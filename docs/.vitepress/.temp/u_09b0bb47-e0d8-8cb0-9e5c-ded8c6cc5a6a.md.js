import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/09b0bb47-e0d8-8cb0-9e5c-ded8c6cc5a6a.md
var __pageData = JSON.parse("{\"title\":\"09b0bb47 · 1401381211014512\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"09b0bb47-e0d8-8cb0-9e5c-ded8c6cc5a6a\",\"prev\":{\"text\":\"previous receipt 0185d361\",\"link\":\"/u/0185d361-b29a-6e70-8460-6e8faab539d9\"},\"next\":{\"text\":\"next: the program rotated 09b0bb47\",\"link\":\"/u/09b0bb47-0d8c-1b0e-85ce-ded8c6cc5a6a\"}},\"headers\":[],\"params\":{\"uuid\":\"09b0bb47-e0d8-8cb0-9e5c-ded8c6cc5a6a\"},\"relativePath\":\"u/09b0bb47-e0d8-8cb0-9e5c-ded8c6cc5a6a.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/09b0bb47-e0d8-8cb0-9e5c-ded8c6cc5a6a.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/09b0bb47-e0d8-8cb0-9e5c-ded8c6cc5a6a.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _09b0bb47_e0d8_8cb0_9e5c_ded8c6cc5a6a_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _09b0bb47_e0d8_8cb0_9e5c_ded8c6cc5a6a_default as default };
