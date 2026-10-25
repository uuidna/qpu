import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/0a84fb85-652b-34af-bdbf-1e64182ad3b1.md
var __pageData = JSON.parse("{\"title\":\"0a84fb85 · 6521141015131115\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"0a84fb85-652b-34af-bdbf-1e64182ad3b1\",\"prev\":{\"text\":\"previous receipt dc3b6910\",\"link\":\"/u/dc3b6910-29d3-63b0-8099-c83ba8dee78f\"},\"next\":{\"text\":\"next: the program rotated 0a84fb85\",\"link\":\"/u/0a84fb85-52b4-6afd-8bf6-1e64182ad3b1\"}},\"headers\":[],\"params\":{\"uuid\":\"0a84fb85-652b-34af-bdbf-1e64182ad3b1\"},\"relativePath\":\"u/0a84fb85-652b-34af-bdbf-1e64182ad3b1.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/0a84fb85-652b-34af-bdbf-1e64182ad3b1.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/0a84fb85-652b-34af-bdbf-1e64182ad3b1.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _0a84fb85_652b_34af_bdbf_1e64182ad3b1_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _0a84fb85_652b_34af_bdbf_1e64182ad3b1_default as default };
