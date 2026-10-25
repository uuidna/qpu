import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/a9401987-1f0d-63e6-92d3-603bf9d0b368.md
var __pageData = JSON.parse("{\"title\":\"a9401987 · 11501331462133\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"a9401987-1f0d-63e6-92d3-603bf9d0b368\",\"prev\":{\"text\":\"family a9401987\",\"link\":\"/h/a9401987\"},\"next\":{\"text\":\"next: the program rotated a9401987\",\"link\":\"/u/a9401987-f0d3-4e62-8d31-603bf9d0b368\"}},\"headers\":[],\"params\":{\"uuid\":\"a9401987-1f0d-63e6-92d3-603bf9d0b368\"},\"relativePath\":\"u/a9401987-1f0d-63e6-92d3-603bf9d0b368.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/a9401987-1f0d-63e6-92d3-603bf9d0b368.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/a9401987-1f0d-63e6-92d3-603bf9d0b368.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var a9401987_1f0d_63e6_92d3_603bf9d0b368_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, a9401987_1f0d_63e6_92d3_603bf9d0b368_default as default };
