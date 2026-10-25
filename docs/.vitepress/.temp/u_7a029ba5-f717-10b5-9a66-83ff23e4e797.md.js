import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/7a029ba5-f717-10b5-9a66-83ff23e4e797.md
var __pageData = JSON.parse("{\"title\":\"7a029ba5 · 1571701151066\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"7a029ba5-f717-10b5-9a66-83ff23e4e797\",\"prev\":{\"text\":\"family 7a029ba5\",\"link\":\"/h/7a029ba5\"},\"next\":{\"text\":\"next: the program rotated 7a029ba5\",\"link\":\"/u/7a029ba5-7170-2b5a-866f-83ff23e4e797\"}},\"headers\":[],\"params\":{\"uuid\":\"7a029ba5-f717-10b5-9a66-83ff23e4e797\"},\"relativePath\":\"u/7a029ba5-f717-10b5-9a66-83ff23e4e797.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/7a029ba5-f717-10b5-9a66-83ff23e4e797.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/7a029ba5-f717-10b5-9a66-83ff23e4e797.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _7a029ba5_f717_10b5_9a66_83ff23e4e797_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _7a029ba5_f717_10b5_9a66_83ff23e4e797_default as default };
