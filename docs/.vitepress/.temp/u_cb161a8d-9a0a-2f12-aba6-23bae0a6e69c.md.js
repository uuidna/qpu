import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/cb161a8d-9a0a-2f12-aba6-23bae0a6e69c.md
var __pageData = JSON.parse("{\"title\":\"cb161a8d · 910010151211106\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"cb161a8d-9a0a-2f12-aba6-23bae0a6e69c\",\"prev\":{\"text\":\"family cb161a8d\",\"link\":\"/h/cb161a8d\"},\"next\":{\"text\":\"next: the program rotated cb161a8d\",\"link\":\"/u/cb161a8d-a0af-412b-8a69-23bae0a6e69c\"}},\"headers\":[],\"params\":{\"uuid\":\"cb161a8d-9a0a-2f12-aba6-23bae0a6e69c\"},\"relativePath\":\"u/cb161a8d-9a0a-2f12-aba6-23bae0a6e69c.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/cb161a8d-9a0a-2f12-aba6-23bae0a6e69c.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/cb161a8d-9a0a-2f12-aba6-23bae0a6e69c.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var cb161a8d_9a0a_2f12_aba6_23bae0a6e69c_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, cb161a8d_9a0a_2f12_aba6_23bae0a6e69c_default as default };
