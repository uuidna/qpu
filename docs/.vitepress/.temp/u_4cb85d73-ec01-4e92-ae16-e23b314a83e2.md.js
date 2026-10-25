import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/4cb85d73-ec01-4e92-ae16-e23b314a83e2.md
var __pageData = JSON.parse("{\"title\":\"4cb85d73 · 14120114921416\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"4cb85d73-ec01-4e92-ae16-e23b314a83e2\",\"prev\":{\"text\":\"family 4cb85d73\",\"link\":\"/h/4cb85d73\"},\"next\":{\"text\":\"next: the program rotated 4cb85d73\",\"link\":\"/u/4cb85d73-c01e-692e-816e-e23b314a83e2\"}},\"headers\":[],\"params\":{\"uuid\":\"4cb85d73-ec01-4e92-ae16-e23b314a83e2\"},\"relativePath\":\"u/4cb85d73-ec01-4e92-ae16-e23b314a83e2.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/4cb85d73-ec01-4e92-ae16-e23b314a83e2.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/4cb85d73-ec01-4e92-ae16-e23b314a83e2.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _4cb85d73_ec01_4e92_ae16_e23b314a83e2_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _4cb85d73_ec01_4e92_ae16_e23b314a83e2_default as default };
