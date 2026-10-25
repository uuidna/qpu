import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/2d1f215b-9ff3-795b-bde7-a9f9db99aa7f.md
var __pageData = JSON.parse("{\"title\":\"2d1f215b · 915153951113147\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"2d1f215b-9ff3-795b-bde7-a9f9db99aa7f\",\"prev\":{\"text\":\"family 2d1f215b\",\"link\":\"/h/2d1f215b\"},\"next\":{\"text\":\"next: the program rotated 2d1f215b\",\"link\":\"/u/2d1f215b-ff39-35bd-8e79-a9f9db99aa7f\"}},\"headers\":[],\"params\":{\"uuid\":\"2d1f215b-9ff3-795b-bde7-a9f9db99aa7f\"},\"relativePath\":\"u/2d1f215b-9ff3-795b-bde7-a9f9db99aa7f.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/2d1f215b-9ff3-795b-bde7-a9f9db99aa7f.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/2d1f215b-9ff3-795b-bde7-a9f9db99aa7f.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _2d1f215b_9ff3_795b_bde7_a9f9db99aa7f_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _2d1f215b_9ff3_795b_bde7_a9f9db99aa7f_default as default };
