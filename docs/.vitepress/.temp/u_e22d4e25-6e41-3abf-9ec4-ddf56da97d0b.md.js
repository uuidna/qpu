import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/u/e22d4e25-6e41-3abf-9ec4-ddf56da97d0b.md
var __pageData = JSON.parse("{\"title\":\"e22d4e25 · 6144110111514124\",\"description\":\"\",\"frontmatter\":{\"title\":\"UUID\",\"uuid\":\"e22d4e25-6e41-3abf-9ec4-ddf56da97d0b\",\"prev\":{\"text\":\"family e22d4e25\",\"link\":\"/h/e22d4e25\"},\"next\":{\"text\":\"next: the program rotated e22d4e25\",\"link\":\"/u/e22d4e25-e41a-6bfe-8c46-ddf56da97d0b\"}},\"headers\":[],\"params\":{\"uuid\":\"e22d4e25-6e41-3abf-9ec4-ddf56da97d0b\"},\"relativePath\":\"u/e22d4e25-6e41-3abf-9ec4-ddf56da97d0b.md\",\"filePath\":\"u/[uuid].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "u/e22d4e25-6e41-3abf-9ec4-ddf56da97d0b.md" };
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("u/e22d4e25-6e41-3abf-9ec4-ddf56da97d0b.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var e22d4e25_6e41_3abf_9ec4_ddf56da97d0b_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, e22d4e25_6e41_3abf_9ec4_ddf56da97d0b_default as default };
