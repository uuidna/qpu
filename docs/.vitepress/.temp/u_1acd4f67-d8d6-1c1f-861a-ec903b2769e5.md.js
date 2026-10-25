import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/1acd4f67-d8d6-1c1f-861a-ec903b2769e5.md
var __pageData = JSON.parse("{\"title\":\"1acd4f67 · 138136121156110\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"1acd4f67-d8d6-1c1f-861a-ec903b2769e5\",\"prev\":{\"text\":\"previous receipt 8359b223\",\"link\":\"/u/8359b223-d02e-44d1-9851-f22c3e68bf90\"},\"next\":{\"text\":\"next: the program rotated 1acd4f67\",\"link\":\"/u/1acd4f67-8d6c-61f6-81ad-ec903b2769e5\"}},\"headers\":[],\"params\":{\"uuid\":\"1acd4f67-d8d6-1c1f-861a-ec903b2769e5\"},\"relativePath\":\"u/1acd4f67-d8d6-1c1f-861a-ec903b2769e5.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/1acd4f67-d8d6-1c1f-861a-ec903b2769e5.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/1acd4f67-d8d6-1c1f-861a-ec903b2769e5.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _1acd4f67_d8d6_1c1f_861a_ec903b2769e5_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _1acd4f67_d8d6_1c1f_861a_ec903b2769e5_default as default };
