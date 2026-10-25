import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/5ec59325-f245-1512-9efd-abb80be6469c.md
var __pageData = JSON.parse("{\"title\":\"5ec59325 · 15245512141513\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"5ec59325-f245-1512-9efd-abb80be6469c\",\"prev\":{\"text\":\"previous receipt 1acd4f67\",\"link\":\"/u/1acd4f67-d8d6-1c1f-861a-ec903b2769e5\"},\"next\":{\"text\":\"next: the program rotated 5ec59325\",\"link\":\"/u/5ec59325-2455-812e-8fdf-abb80be6469c\"}},\"headers\":[],\"params\":{\"uuid\":\"5ec59325-f245-1512-9efd-abb80be6469c\"},\"relativePath\":\"u/5ec59325-f245-1512-9efd-abb80be6469c.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/5ec59325-f245-1512-9efd-abb80be6469c.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/5ec59325-f245-1512-9efd-abb80be6469c.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _5ec59325_f245_1512_9efd_abb80be6469c_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _5ec59325_f245_1512_9efd_abb80be6469c_default as default };
