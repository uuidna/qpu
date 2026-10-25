import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/b3cda968-f2ac-73bc-8b91-55c2923c43cf.md
var __pageData = JSON.parse("{\"title\":\"b3cda968 · 1521012311121191\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"b3cda968-f2ac-73bc-8b91-55c2923c43cf\",\"prev\":{\"text\":\"family b3cda968\",\"link\":\"/h/b3cda968\"},\"next\":{\"text\":\"next: the program rotated b3cda968\",\"link\":\"/u/b3cda968-2ac3-6bcb-891f-55c2923c43cf\"}},\"headers\":[],\"params\":{\"uuid\":\"b3cda968-f2ac-73bc-8b91-55c2923c43cf\"},\"relativePath\":\"u/b3cda968-f2ac-73bc-8b91-55c2923c43cf.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/b3cda968-f2ac-73bc-8b91-55c2923c43cf.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/b3cda968-f2ac-73bc-8b91-55c2923c43cf.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var b3cda968_f2ac_73bc_8b91_55c2923c43cf_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, b3cda968_f2ac_73bc_8b91_55c2923c43cf_default as default };
