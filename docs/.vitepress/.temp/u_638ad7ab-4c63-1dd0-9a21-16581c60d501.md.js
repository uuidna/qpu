import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/638ad7ab-4c63-1dd0-9a21-16581c60d501.md
var __pageData = JSON.parse("{\"title\":\"638ad7ab · 41263131301021\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"638ad7ab-4c63-1dd0-9a21-16581c60d501\",\"prev\":{\"text\":\"family 638ad7ab\",\"link\":\"/h/638ad7ab\"},\"next\":{\"text\":\"next: the program rotated 638ad7ab\",\"link\":\"/u/638ad7ab-c63d-5d0a-8214-16581c60d501\"}},\"headers\":[],\"params\":{\"uuid\":\"638ad7ab-4c63-1dd0-9a21-16581c60d501\"},\"relativePath\":\"u/638ad7ab-4c63-1dd0-9a21-16581c60d501.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/638ad7ab-4c63-1dd0-9a21-16581c60d501.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/638ad7ab-4c63-1dd0-9a21-16581c60d501.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _638ad7ab_4c63_1dd0_9a21_16581c60d501_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _638ad7ab_4c63_1dd0_9a21_16581c60d501_default as default };
