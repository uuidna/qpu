import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/b2816938-41d4-52f9-a93f-88330e013145.md
var __pageData = JSON.parse("{\"title\":\"b2816938 · 4113421599315\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"b2816938-41d4-52f9-a93f-88330e013145\",\"prev\":{\"text\":\"family b2816938\",\"link\":\"/h/b2816938\"},\"next\":{\"text\":\"next: the program rotated b2816938\",\"link\":\"/u/b2816938-1d42-7f99-83f4-88330e013145\"}},\"headers\":[],\"params\":{\"uuid\":\"b2816938-41d4-52f9-a93f-88330e013145\"},\"relativePath\":\"u/b2816938-41d4-52f9-a93f-88330e013145.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/b2816938-41d4-52f9-a93f-88330e013145.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/b2816938-41d4-52f9-a93f-88330e013145.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var b2816938_41d4_52f9_a93f_88330e013145_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, b2816938_41d4_52f9_a93f_88330e013145_default as default };
