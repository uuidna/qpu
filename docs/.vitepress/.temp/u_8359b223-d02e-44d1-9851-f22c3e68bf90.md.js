import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/8359b223-d02e-44d1-9851-f22c3e68bf90.md
var __pageData = JSON.parse("{\"title\":\"8359b223 · 1302144131851\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"8359b223-d02e-44d1-9851-f22c3e68bf90\",\"prev\":{\"text\":\"previous receipt b5955168\",\"link\":\"/u/b5955168-f509-1b86-8ae5-d715c9bcad20\"},\"next\":{\"text\":\"next: the program rotated 8359b223\",\"link\":\"/u/8359b223-02e4-3d18-851d-f22c3e68bf90\"}},\"headers\":[],\"params\":{\"uuid\":\"8359b223-d02e-44d1-9851-f22c3e68bf90\"},\"relativePath\":\"u/8359b223-d02e-44d1-9851-f22c3e68bf90.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/8359b223-d02e-44d1-9851-f22c3e68bf90.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/8359b223-d02e-44d1-9851-f22c3e68bf90.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _8359b223_d02e_44d1_9851_f22c3e68bf90_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _8359b223_d02e_44d1_9851_f22c3e68bf90_default as default };
