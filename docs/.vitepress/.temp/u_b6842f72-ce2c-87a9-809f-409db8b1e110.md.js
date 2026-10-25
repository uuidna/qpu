import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/b6842f72-ce2c-87a9-809f-409db8b1e110.md
var __pageData = JSON.parse("{\"title\":\"b6842f72 · 121421271090915\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"b6842f72-ce2c-87a9-809f-409db8b1e110\",\"prev\":{\"text\":\"family b6842f72\",\"link\":\"/h/b6842f72\"},\"next\":{\"text\":\"next: the program rotated b6842f72\",\"link\":\"/u/b6842f72-e2c7-1a90-89fc-409db8b1e110\"}},\"headers\":[],\"params\":{\"uuid\":\"b6842f72-ce2c-87a9-809f-409db8b1e110\"},\"relativePath\":\"u/b6842f72-ce2c-87a9-809f-409db8b1e110.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/b6842f72-ce2c-87a9-809f-409db8b1e110.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/b6842f72-ce2c-87a9-809f-409db8b1e110.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var b6842f72_ce2c_87a9_809f_409db8b1e110_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, b6842f72_ce2c_87a9_809f_409db8b1e110_default as default };
