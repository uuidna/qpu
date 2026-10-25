import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/71f7796a-2c41-16ed-bd93-93714532822b.md
var __pageData = JSON.parse("{\"title\":\"71f7796a · 21241614131393\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"71f7796a-2c41-16ed-bd93-93714532822b\",\"prev\":{\"text\":\"previous receipt 3916f5ee\",\"link\":\"/u/3916f5ee-9069-5a01-9a4b-001f75673524\"},\"next\":{\"text\":\"next: the program rotated 71f7796a\",\"link\":\"/u/71f7796a-c416-2edd-8932-93714532822b\"}},\"headers\":[],\"params\":{\"uuid\":\"71f7796a-2c41-16ed-bd93-93714532822b\"},\"relativePath\":\"u/71f7796a-2c41-16ed-bd93-93714532822b.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/71f7796a-2c41-16ed-bd93-93714532822b.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/71f7796a-2c41-16ed-bd93-93714532822b.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _71f7796a_2c41_16ed_bd93_93714532822b_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _71f7796a_2c41_16ed_bd93_93714532822b_default as default };
