import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/3916f5ee-9069-5a01-9a4b-001f75673524.md
var __pageData = JSON.parse("{\"title\":\"3916f5ee · 9069100110411\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"3916f5ee-9069-5a01-9a4b-001f75673524\",\"prev\":{\"text\":\"previous receipt 45167289\",\"link\":\"/u/45167289-059b-3f63-8a9f-7c396c5308d3\"},\"next\":{\"text\":\"next: the program rotated 3916f5ee\",\"link\":\"/u/3916f5ee-069a-501a-84b9-001f75673524\"}},\"headers\":[],\"params\":{\"uuid\":\"3916f5ee-9069-5a01-9a4b-001f75673524\"},\"relativePath\":\"u/3916f5ee-9069-5a01-9a4b-001f75673524.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/3916f5ee-9069-5a01-9a4b-001f75673524.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/3916f5ee-9069-5a01-9a4b-001f75673524.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _3916f5ee_9069_5a01_9a4b_001f75673524_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _3916f5ee_9069_5a01_9a4b_001f75673524_default as default };
