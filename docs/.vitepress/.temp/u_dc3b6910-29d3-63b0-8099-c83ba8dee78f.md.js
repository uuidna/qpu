import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/dc3b6910-29d3-63b0-8099-c83ba8dee78f.md
var __pageData = JSON.parse("{\"title\":\"dc3b6910 · 291333110099\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"dc3b6910-29d3-63b0-8099-c83ba8dee78f\",\"prev\":{\"text\":\"previous receipt 09b0bb47\",\"link\":\"/u/09b0bb47-e0d8-8cb0-9e5c-ded8c6cc5a6a\"},\"next\":{\"text\":\"next: the program rotated dc3b6910\",\"link\":\"/u/dc3b6910-9d33-3b00-8992-c83ba8dee78f\"}},\"headers\":[],\"params\":{\"uuid\":\"dc3b6910-29d3-63b0-8099-c83ba8dee78f\"},\"relativePath\":\"u/dc3b6910-29d3-63b0-8099-c83ba8dee78f.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/dc3b6910-29d3-63b0-8099-c83ba8dee78f.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/dc3b6910-29d3-63b0-8099-c83ba8dee78f.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dc3b6910_29d3_63b0_8099_c83ba8dee78f_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, dc3b6910_29d3_63b0_8099_c83ba8dee78f_default as default };
