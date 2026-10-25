import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/c4e0d882-e648-73e1-8745-ecf91b956890.md
var __pageData = JSON.parse("{\"title\":\"c4e0d882 · 146483141745\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"c4e0d882-e648-73e1-8745-ecf91b956890\",\"prev\":{\"text\":\"family c4e0d882\",\"link\":\"/h/c4e0d882\"},\"next\":{\"text\":\"next: the program rotated c4e0d882\",\"link\":\"/u/c4e0d882-6483-8e17-845e-ecf91b956890\"}},\"headers\":[],\"params\":{\"uuid\":\"c4e0d882-e648-73e1-8745-ecf91b956890\"},\"relativePath\":\"u/c4e0d882-e648-73e1-8745-ecf91b956890.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/c4e0d882-e648-73e1-8745-ecf91b956890.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/c4e0d882-e648-73e1-8745-ecf91b956890.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var c4e0d882_e648_73e1_8745_ecf91b956890_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, c4e0d882_e648_73e1_8745_ecf91b956890_default as default };
