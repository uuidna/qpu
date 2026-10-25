import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/14bf1e1c-74d0-3932-9b2b-6c3d7695d4a8.md
var __pageData = JSON.parse("{\"title\":\"14bf1e1c · 7413093211211\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"14bf1e1c-74d0-3932-9b2b-6c3d7695d4a8\",\"prev\":{\"text\":\"family 14bf1e1c\",\"link\":\"/h/14bf1e1c\"},\"next\":{\"text\":\"next: the program rotated 14bf1e1c\",\"link\":\"/u/14bf1e1c-4d09-732b-82b7-6c3d7695d4a8\"}},\"headers\":[],\"params\":{\"uuid\":\"14bf1e1c-74d0-3932-9b2b-6c3d7695d4a8\"},\"relativePath\":\"u/14bf1e1c-74d0-3932-9b2b-6c3d7695d4a8.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/14bf1e1c-74d0-3932-9b2b-6c3d7695d4a8.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/14bf1e1c-74d0-3932-9b2b-6c3d7695d4a8.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _14bf1e1c_74d0_3932_9b2b_6c3d7695d4a8_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _14bf1e1c_74d0_3932_9b2b_6c3d7695d4a8_default as default };
