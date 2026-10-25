import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/dff7d819-7e91-1c2f-ac0d-546243739f72.md
var __pageData = JSON.parse("{\"title\":\"dff7d819 · 714911221512013\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"dff7d819-7e91-1c2f-ac0d-546243739f72\",\"prev\":{\"text\":\"family dff7d819\",\"link\":\"/h/dff7d819\"},\"next\":{\"text\":\"next: the program rotated dff7d819\",\"link\":\"/u/dff7d819-e91c-22fc-80d7-546243739f72\"}},\"headers\":[],\"params\":{\"uuid\":\"dff7d819-7e91-1c2f-ac0d-546243739f72\"},\"relativePath\":\"u/dff7d819-7e91-1c2f-ac0d-546243739f72.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/dff7d819-7e91-1c2f-ac0d-546243739f72.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/dff7d819-7e91-1c2f-ac0d-546243739f72.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dff7d819_7e91_1c2f_ac0d_546243739f72_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, dff7d819_7e91_1c2f_ac0d_546243739f72_default as default };
