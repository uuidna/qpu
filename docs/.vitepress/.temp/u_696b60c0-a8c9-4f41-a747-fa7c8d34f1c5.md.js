import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/696b60c0-a8c9-4f41-a747-fa7c8d34f1c5.md
var __pageData = JSON.parse("{\"title\":\"696b60c0 · 1081291541747\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"696b60c0-a8c9-4f41-a747-fa7c8d34f1c5\",\"prev\":{\"text\":\"family 696b60c0\",\"link\":\"/h/696b60c0\"},\"next\":{\"text\":\"next: the program rotated 696b60c0\",\"link\":\"/u/696b60c0-8c9f-3417-847a-fa7c8d34f1c5\"}},\"headers\":[],\"params\":{\"uuid\":\"696b60c0-a8c9-4f41-a747-fa7c8d34f1c5\"},\"relativePath\":\"u/696b60c0-a8c9-4f41-a747-fa7c8d34f1c5.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/696b60c0-a8c9-4f41-a747-fa7c8d34f1c5.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/696b60c0-a8c9-4f41-a747-fa7c8d34f1c5.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _696b60c0_a8c9_4f41_a747_fa7c8d34f1c5_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _696b60c0_a8c9_4f41_a747_fa7c8d34f1c5_default as default };
