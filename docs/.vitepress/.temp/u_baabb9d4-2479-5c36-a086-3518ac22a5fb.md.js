import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/baabb9d4-2479-5c36-a086-3518ac22a5fb.md
var __pageData = JSON.parse("{\"title\":\"baabb9d4 · 24791236086\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"baabb9d4-2479-5c36-a086-3518ac22a5fb\",\"prev\":{\"text\":\"family baabb9d4\",\"link\":\"/h/baabb9d4\"},\"next\":{\"text\":\"next: the program rotated baabb9d4\",\"link\":\"/u/baabb9d4-479c-7360-8862-3518ac22a5fb\"}},\"headers\":[],\"params\":{\"uuid\":\"baabb9d4-2479-5c36-a086-3518ac22a5fb\"},\"relativePath\":\"u/baabb9d4-2479-5c36-a086-3518ac22a5fb.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/baabb9d4-2479-5c36-a086-3518ac22a5fb.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/baabb9d4-2479-5c36-a086-3518ac22a5fb.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var baabb9d4_2479_5c36_a086_3518ac22a5fb_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, baabb9d4_2479_5c36_a086_3518ac22a5fb_default as default };
