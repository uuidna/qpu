import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/bfd1f3b4-ac7e-598b-b395-5ed0d13097b6.md
var __pageData = JSON.parse("{\"title\":\"bfd1f3b4 · 10127149811395\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"bfd1f3b4-ac7e-598b-b395-5ed0d13097b6\",\"prev\":{\"text\":\"family bfd1f3b4\",\"link\":\"/h/bfd1f3b4\"},\"next\":{\"text\":\"next: the program rotated bfd1f3b4\",\"link\":\"/u/bfd1f3b4-c7e9-68b3-895a-5ed0d13097b6\"}},\"headers\":[],\"params\":{\"uuid\":\"bfd1f3b4-ac7e-598b-b395-5ed0d13097b6\"},\"relativePath\":\"u/bfd1f3b4-ac7e-598b-b395-5ed0d13097b6.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/bfd1f3b4-ac7e-598b-b395-5ed0d13097b6.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/bfd1f3b4-ac7e-598b-b395-5ed0d13097b6.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var bfd1f3b4_ac7e_598b_b395_5ed0d13097b6_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, bfd1f3b4_ac7e_598b_b395_5ed0d13097b6_default as default };
