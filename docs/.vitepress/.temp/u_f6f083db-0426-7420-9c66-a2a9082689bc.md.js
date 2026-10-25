import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/f6f083db-0426-7420-9c66-a2a9082689bc.md
var __pageData = JSON.parse("{\"title\":\"f6f083db · 04264201266\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"f6f083db-0426-7420-9c66-a2a9082689bc\",\"prev\":{\"text\":\"family f6f083db\",\"link\":\"/h/f6f083db\"},\"next\":{\"text\":\"next: the program rotated f6f083db\",\"link\":\"/u/f6f083db-4264-720c-8660-a2a9082689bc\"}},\"headers\":[],\"params\":{\"uuid\":\"f6f083db-0426-7420-9c66-a2a9082689bc\"},\"relativePath\":\"u/f6f083db-0426-7420-9c66-a2a9082689bc.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/f6f083db-0426-7420-9c66-a2a9082689bc.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/f6f083db-0426-7420-9c66-a2a9082689bc.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var f6f083db_0426_7420_9c66_a2a9082689bc_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, f6f083db_0426_7420_9c66_a2a9082689bc_default as default };
