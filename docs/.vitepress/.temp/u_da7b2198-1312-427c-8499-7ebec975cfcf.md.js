import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/da7b2198-1312-427c-8499-7ebec975cfcf.md
var __pageData = JSON.parse("{\"title\":\"da7b2198 · 13122712499\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"da7b2198-1312-427c-8499-7ebec975cfcf\",\"prev\":{\"text\":\"family da7b2198\",\"link\":\"/h/da7b2198\"},\"next\":{\"text\":\"next: the program rotated da7b2198\",\"link\":\"/u/da7b2198-3122-57c4-8991-7ebec975cfcf\"}},\"headers\":[],\"params\":{\"uuid\":\"da7b2198-1312-427c-8499-7ebec975cfcf\"},\"relativePath\":\"u/da7b2198-1312-427c-8499-7ebec975cfcf.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/da7b2198-1312-427c-8499-7ebec975cfcf.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/da7b2198-1312-427c-8499-7ebec975cfcf.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var da7b2198_1312_427c_8499_7ebec975cfcf_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, da7b2198_1312_427c_8499_7ebec975cfcf_default as default };
