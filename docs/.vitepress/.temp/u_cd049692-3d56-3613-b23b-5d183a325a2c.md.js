import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/cd049692-3d56-3613-b23b-5d183a325a2c.md
var __pageData = JSON.parse("{\"title\":\"cd049692 · 313566132311\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"cd049692-3d56-3613-b23b-5d183a325a2c\",\"prev\":{\"text\":\"family cd049692\",\"link\":\"/h/cd049692\"},\"next\":{\"text\":\"next: the program rotated cd049692\",\"link\":\"/u/cd049692-d566-4132-83b3-5d183a325a2c\"}},\"headers\":[],\"params\":{\"uuid\":\"cd049692-3d56-3613-b23b-5d183a325a2c\"},\"relativePath\":\"u/cd049692-3d56-3613-b23b-5d183a325a2c.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/cd049692-3d56-3613-b23b-5d183a325a2c.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/cd049692-3d56-3613-b23b-5d183a325a2c.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var cd049692_3d56_3613_b23b_5d183a325a2c_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, cd049692_3d56_3613_b23b_5d183a325a2c_default as default };
