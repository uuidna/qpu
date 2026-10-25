import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/c8879dfb-8842-3835-8522-8f580d629f97.md
var __pageData = JSON.parse("{\"title\":\"c8879dfb · 8842835522\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"c8879dfb-8842-3835-8522-8f580d629f97\",\"prev\":{\"text\":\"previous receipt ec2e9292\",\"link\":\"/u/ec2e9292-95e0-3479-a9ac-18ba1a9c211d\"},\"next\":{\"text\":\"next: the program rotated c8879dfb\",\"link\":\"/u/c8879dfb-8428-7355-8228-8f580d629f97\"}},\"headers\":[],\"params\":{\"uuid\":\"c8879dfb-8842-3835-8522-8f580d629f97\"},\"relativePath\":\"u/c8879dfb-8842-3835-8522-8f580d629f97.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/c8879dfb-8842-3835-8522-8f580d629f97.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/c8879dfb-8842-3835-8522-8f580d629f97.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var c8879dfb_8842_3835_8522_8f580d629f97_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, c8879dfb_8842_3835_8522_8f580d629f97_default as default };
