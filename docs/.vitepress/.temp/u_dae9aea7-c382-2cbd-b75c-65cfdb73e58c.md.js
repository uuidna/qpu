import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/dae9aea7-c382-2cbd-b75c-65cfdb73e58c.md
var __pageData = JSON.parse("{\"title\":\"dae9aea7 · 123821211137512\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"dae9aea7-c382-2cbd-b75c-65cfdb73e58c\",\"prev\":{\"text\":\"family dae9aea7\",\"link\":\"/h/dae9aea7\"},\"next\":{\"text\":\"next: the program rotated dae9aea7\",\"link\":\"/u/dae9aea7-382c-4bd7-85cc-65cfdb73e58c\"}},\"headers\":[],\"params\":{\"uuid\":\"dae9aea7-c382-2cbd-b75c-65cfdb73e58c\"},\"relativePath\":\"u/dae9aea7-c382-2cbd-b75c-65cfdb73e58c.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/dae9aea7-c382-2cbd-b75c-65cfdb73e58c.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/dae9aea7-c382-2cbd-b75c-65cfdb73e58c.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dae9aea7_c382_2cbd_b75c_65cfdb73e58c_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, dae9aea7_c382_2cbd_b75c_65cfdb73e58c_default as default };
