import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/db97d14b-9dbf-4c07-9e8f-586495e641bf.md
var __pageData = JSON.parse("{\"title\":\"db97d14b · 9131115120714815\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"db97d14b-9dbf-4c07-9e8f-586495e641bf\",\"prev\":{\"text\":\"family db97d14b\",\"link\":\"/h/db97d14b\"},\"next\":{\"text\":\"next: the program rotated db97d14b\",\"link\":\"/u/db97d14b-dbfc-107e-88f9-586495e641bf\"}},\"headers\":[],\"params\":{\"uuid\":\"db97d14b-9dbf-4c07-9e8f-586495e641bf\"},\"relativePath\":\"u/db97d14b-9dbf-4c07-9e8f-586495e641bf.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/db97d14b-9dbf-4c07-9e8f-586495e641bf.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/db97d14b-9dbf-4c07-9e8f-586495e641bf.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var db97d14b_9dbf_4c07_9e8f_586495e641bf_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, db97d14b_9dbf_4c07_9e8f_586495e641bf_default as default };
