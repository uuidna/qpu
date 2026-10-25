import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/c5215900-71f1-4cfd-ac89-35aab3663a05.md
var __pageData = JSON.parse("{\"title\":\"c5215900 · 711511215131289\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"c5215900-71f1-4cfd-ac89-35aab3663a05\",\"prev\":{\"text\":\"family c5215900\",\"link\":\"/h/c5215900\"},\"next\":{\"text\":\"next: the program rotated c5215900\",\"link\":\"/u/c5215900-1f1c-8fdc-8897-35aab3663a05\"}},\"headers\":[],\"params\":{\"uuid\":\"c5215900-71f1-4cfd-ac89-35aab3663a05\"},\"relativePath\":\"u/c5215900-71f1-4cfd-ac89-35aab3663a05.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/c5215900-71f1-4cfd-ac89-35aab3663a05.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/c5215900-71f1-4cfd-ac89-35aab3663a05.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var c5215900_71f1_4cfd_ac89_35aab3663a05_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, c5215900_71f1_4cfd_ac89_35aab3663a05_default as default };
