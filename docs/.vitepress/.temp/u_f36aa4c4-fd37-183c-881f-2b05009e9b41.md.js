import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/f36aa4c4-fd37-183c-881f-2b05009e9b41.md
var __pageData = JSON.parse("{\"title\":\"f36aa4c4 · 15133783128115\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"f36aa4c4-fd37-183c-881f-2b05009e9b41\",\"prev\":{\"text\":\"family f36aa4c4\",\"link\":\"/h/f36aa4c4\"},\"next\":{\"text\":\"next: the program rotated f36aa4c4\",\"link\":\"/u/f36aa4c4-d378-43c8-81ff-2b05009e9b41\"}},\"headers\":[],\"params\":{\"uuid\":\"f36aa4c4-fd37-183c-881f-2b05009e9b41\"},\"relativePath\":\"u/f36aa4c4-fd37-183c-881f-2b05009e9b41.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/f36aa4c4-fd37-183c-881f-2b05009e9b41.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/f36aa4c4-fd37-183c-881f-2b05009e9b41.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var f36aa4c4_fd37_183c_881f_2b05009e9b41_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, f36aa4c4_fd37_183c_881f_2b05009e9b41_default as default };
