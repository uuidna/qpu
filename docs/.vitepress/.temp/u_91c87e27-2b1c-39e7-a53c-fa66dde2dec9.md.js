import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/91c87e27-2b1c-39e7-a53c-fa66dde2dec9.md
var __pageData = JSON.parse("{\"title\":\"91c87e27 · 21111291475312\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"91c87e27-2b1c-39e7-a53c-fa66dde2dec9\",\"prev\":{\"text\":\"previous receipt 9288fd2d\",\"link\":\"/u/9288fd2d-2a9e-23ee-b4bd-bc590547257b\"},\"next\":{\"text\":\"next: the program rotated 91c87e27\",\"link\":\"/u/91c87e27-b1c9-5e75-83c2-fa66dde2dec9\"}},\"headers\":[],\"params\":{\"uuid\":\"91c87e27-2b1c-39e7-a53c-fa66dde2dec9\"},\"relativePath\":\"u/91c87e27-2b1c-39e7-a53c-fa66dde2dec9.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/91c87e27-2b1c-39e7-a53c-fa66dde2dec9.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/91c87e27-2b1c-39e7-a53c-fa66dde2dec9.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _91c87e27_2b1c_39e7_a53c_fa66dde2dec9_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _91c87e27_2b1c_39e7_a53c_fa66dde2dec9_default as default };
