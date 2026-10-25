import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/f86af7ee-201c-374c-a3a2-3abb5f3a7114.md
var __pageData = JSON.parse("{\"title\":\"f86af7ee · 2011274123102\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"f86af7ee-201c-374c-a3a2-3abb5f3a7114\",\"prev\":{\"text\":\"family f86af7ee\",\"link\":\"/h/f86af7ee\"},\"next\":{\"text\":\"next: the program rotated f86af7ee\",\"link\":\"/u/f86af7ee-01c7-24c3-8a22-3abb5f3a7114\"}},\"headers\":[],\"params\":{\"uuid\":\"f86af7ee-201c-374c-a3a2-3abb5f3a7114\"},\"relativePath\":\"u/f86af7ee-201c-374c-a3a2-3abb5f3a7114.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/f86af7ee-201c-374c-a3a2-3abb5f3a7114.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/f86af7ee-201c-374c-a3a2-3abb5f3a7114.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var f86af7ee_201c_374c_a3a2_3abb5f3a7114_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, f86af7ee_201c_374c_a3a2_3abb5f3a7114_default as default };
