import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/032d5c11-4d94-3134-886d-49a44c3c5007.md
var __pageData = JSON.parse("{\"title\":\"032d5c11 · 413941348613\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"032d5c11-4d94-3134-886d-49a44c3c5007\",\"prev\":{\"text\":\"previous receipt c250bb96\",\"link\":\"/u/c250bb96-78dd-282b-ba95-6c4416302778\"},\"next\":{\"text\":\"next: the program rotated 032d5c11\",\"link\":\"/u/032d5c11-d941-5348-86d4-49a44c3c5007\"}},\"headers\":[],\"params\":{\"uuid\":\"032d5c11-4d94-3134-886d-49a44c3c5007\"},\"relativePath\":\"u/032d5c11-4d94-3134-886d-49a44c3c5007.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/032d5c11-4d94-3134-886d-49a44c3c5007.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/032d5c11-4d94-3134-886d-49a44c3c5007.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _032d5c11_4d94_3134_886d_49a44c3c5007_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, _032d5c11_4d94_3134_886d_49a44c3c5007_default as default };
