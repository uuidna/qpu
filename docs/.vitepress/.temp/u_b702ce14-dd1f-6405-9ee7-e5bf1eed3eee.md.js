import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/b702ce14-dd1f-6405-9ee7-e5bf1eed3eee.md
var __pageData = JSON.parse("{\"title\":\"b702ce14 · 131311540514147\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"b702ce14-dd1f-6405-9ee7-e5bf1eed3eee\",\"prev\":{\"text\":\"family b702ce14\",\"link\":\"/h/b702ce14\"},\"next\":{\"text\":\"next: the program rotated b702ce14\",\"link\":\"/u/b702ce14-d1f4-105e-8e7d-e5bf1eed3eee\"}},\"headers\":[],\"params\":{\"uuid\":\"b702ce14-dd1f-6405-9ee7-e5bf1eed3eee\"},\"relativePath\":\"u/b702ce14-dd1f-6405-9ee7-e5bf1eed3eee.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/b702ce14-dd1f-6405-9ee7-e5bf1eed3eee.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/b702ce14-dd1f-6405-9ee7-e5bf1eed3eee.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var b702ce14_dd1f_6405_9ee7_e5bf1eed3eee_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, b702ce14_dd1f_6405_9ee7_e5bf1eed3eee_default as default };
