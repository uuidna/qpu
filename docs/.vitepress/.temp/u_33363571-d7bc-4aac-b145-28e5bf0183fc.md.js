import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/33363571-d7bc-4aac-b145-28e5bf0183fc.md
var __pageData = JSON.parse("{\"title\":\"33363571 · 1371112101012145\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"33363571-d7bc-4aac-b145-28e5bf0183fc\",\"prev\":{\"text\":\"previous receipt 0a87c244\",\"link\":\"/u/0a87c244-dbdc-74ec-a628-0ffd374328e3\"},\"next\":{\"text\":\"next: the program rotated 33363571\",\"link\":\"/u/33363571-7bca-4ac1-845d-28e5bf0183fc\"}},\"headers\":[],\"params\":{\"uuid\":\"33363571-d7bc-4aac-b145-28e5bf0183fc\"},\"relativePath\":\"u/33363571-d7bc-4aac-b145-28e5bf0183fc.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/33363571-d7bc-4aac-b145-28e5bf0183fc.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/33363571-d7bc-4aac-b145-28e5bf0183fc.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _33363571_d7bc_4aac_b145_28e5bf0183fc_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _33363571_d7bc_4aac_b145_28e5bf0183fc_default as default };
