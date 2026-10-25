import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/dd20e8d3-9827-7aa3-9b58-977417bff2f8.md
var __pageData = JSON.parse("{\"title\":\"dd20e8d3 · 9827101031158\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"dd20e8d3-9827-7aa3-9b58-977417bff2f8\",\"prev\":{\"text\":\"previous receipt b8a2dd6d\",\"link\":\"/u/b8a2dd6d-bb17-62dc-9864-736d444c4675\"},\"next\":{\"text\":\"next: the program rotated dd20e8d3\",\"link\":\"/u/dd20e8d3-827a-5a3b-8589-977417bff2f8\"}},\"headers\":[],\"params\":{\"uuid\":\"dd20e8d3-9827-7aa3-9b58-977417bff2f8\"},\"relativePath\":\"u/dd20e8d3-9827-7aa3-9b58-977417bff2f8.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/dd20e8d3-9827-7aa3-9b58-977417bff2f8.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/dd20e8d3-9827-7aa3-9b58-977417bff2f8.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dd20e8d3_9827_7aa3_9b58_977417bff2f8_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, dd20e8d3_9827_7aa3_9b58_977417bff2f8_default as default };
