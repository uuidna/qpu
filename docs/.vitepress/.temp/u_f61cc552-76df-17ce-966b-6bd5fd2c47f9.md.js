import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/f61cc552-76df-17ce-966b-6bd5fd2c47f9.md
var __pageData = JSON.parse("{\"title\":\"f61cc552 · 761315712146611\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"f61cc552-76df-17ce-966b-6bd5fd2c47f9\",\"prev\":{\"text\":\"family f61cc552\",\"link\":\"/h/f61cc552\"},\"next\":{\"text\":\"next: the program rotated f61cc552\",\"link\":\"/u/f61cc552-6df7-7ce6-86b7-6bd5fd2c47f9\"}},\"headers\":[],\"params\":{\"uuid\":\"f61cc552-76df-17ce-966b-6bd5fd2c47f9\"},\"relativePath\":\"u/f61cc552-76df-17ce-966b-6bd5fd2c47f9.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/f61cc552-76df-17ce-966b-6bd5fd2c47f9.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/f61cc552-76df-17ce-966b-6bd5fd2c47f9.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var f61cc552_76df_17ce_966b_6bd5fd2c47f9_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, f61cc552_76df_17ce_966b_6bd5fd2c47f9_default as default };
