import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/31606e34-8eb4-212d-b365-74663f91062b.md
var __pageData = JSON.parse("{\"title\":\"31606e34 · 8141141213365\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"31606e34-8eb4-212d-b365-74663f91062b\",\"prev\":{\"text\":\"previous receipt 7405560f\",\"link\":\"/u/7405560f-4650-8a45-ade4-730d722976d8\"},\"next\":{\"text\":\"next: the program rotated 31606e34\",\"link\":\"/u/31606e34-eb41-42d3-8658-74663f91062b\"}},\"headers\":[],\"params\":{\"uuid\":\"31606e34-8eb4-212d-b365-74663f91062b\"},\"relativePath\":\"u/31606e34-8eb4-212d-b365-74663f91062b.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/31606e34-8eb4-212d-b365-74663f91062b.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/31606e34-8eb4-212d-b365-74663f91062b.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _31606e34_8eb4_212d_b365_74663f91062b_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _31606e34_8eb4_212d_b365_74663f91062b_default as default };
