import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/fcf5ec01-de2d-17a3-88db-071a3f3837cb.md
var __pageData = JSON.parse("{\"title\":\"fcf5ec01 · 1314213710381311\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"fcf5ec01-de2d-17a3-88db-071a3f3837cb\",\"prev\":{\"text\":\"family fcf5ec01\",\"link\":\"/h/fcf5ec01\"},\"next\":{\"text\":\"next: the program rotated fcf5ec01\",\"link\":\"/u/fcf5ec01-e2d7-6a38-8dbd-071a3f3837cb\"}},\"headers\":[],\"params\":{\"uuid\":\"fcf5ec01-de2d-17a3-88db-071a3f3837cb\"},\"relativePath\":\"u/fcf5ec01-de2d-17a3-88db-071a3f3837cb.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/fcf5ec01-de2d-17a3-88db-071a3f3837cb.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/fcf5ec01-de2d-17a3-88db-071a3f3837cb.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var fcf5ec01_de2d_17a3_88db_071a3f3837cb_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, fcf5ec01_de2d_17a3_88db_071a3f3837cb_default as default };
