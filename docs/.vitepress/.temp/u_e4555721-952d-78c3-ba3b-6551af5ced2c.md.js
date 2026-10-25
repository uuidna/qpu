import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/e4555721-952d-78c3-ba3b-6551af5ced2c.md
var __pageData = JSON.parse("{\"title\":\"e4555721 · 95213812310311\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"e4555721-952d-78c3-ba3b-6551af5ced2c\",\"prev\":{\"text\":\"family e4555721\",\"link\":\"/h/e4555721\"},\"next\":{\"text\":\"next: the program rotated e4555721\",\"link\":\"/u/e4555721-52d8-1c3a-83b9-6551af5ced2c\"}},\"headers\":[],\"params\":{\"uuid\":\"e4555721-952d-78c3-ba3b-6551af5ced2c\"},\"relativePath\":\"u/e4555721-952d-78c3-ba3b-6551af5ced2c.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/e4555721-952d-78c3-ba3b-6551af5ced2c.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/e4555721-952d-78c3-ba3b-6551af5ced2c.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var e4555721_952d_78c3_ba3b_6551af5ced2c_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, e4555721_952d_78c3_ba3b_6551af5ced2c_default as default };
