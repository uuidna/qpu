import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/4581b009-b511-413d-998a-b089eedb735f.md
var __pageData = JSON.parse("{\"title\":\"4581b009 · 1151113139810\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"4581b009-b511-413d-998a-b089eedb735f\",\"prev\":{\"text\":\"previous receipt 33363571\",\"link\":\"/u/33363571-d7bc-4aac-b145-28e5bf0183fc\"},\"next\":{\"text\":\"next: the program rotated 4581b009\",\"link\":\"/u/4581b009-5111-43d9-88ab-b089eedb735f\"}},\"headers\":[],\"params\":{\"uuid\":\"4581b009-b511-413d-998a-b089eedb735f\"},\"relativePath\":\"u/4581b009-b511-413d-998a-b089eedb735f.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/4581b009-b511-413d-998a-b089eedb735f.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/4581b009-b511-413d-998a-b089eedb735f.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _4581b009_b511_413d_998a_b089eedb735f_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _4581b009_b511_413d_998a_b089eedb735f_default as default };
