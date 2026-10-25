import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/bg/index.md
var __pageData = JSON.parse("{\"title\":\"Български\",\"description\":\"\",\"frontmatter\":{\"title\":\"Български\"},\"headers\":[],\"relativePath\":\"bg/index.md\",\"filePath\":\"bg/index.md\",\"lastUpdated\":1792931988000}");
var _sfc_main = { name: "bg/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_CatchAll = resolveComponent("CatchAll");
	_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="български" tabindex="-1">Български <a class="header-anchor" href="#български" aria-label="Permalink to “Български”">​</a></h1><p>Преводът тук е по речник: етикетите, статусите и присъдите на повърхността се превеждат без мрежа и без модел, в двете посоки. Страниците на този сайт на български са следа („превод по-късно“): отворете всяка страница с префикс <code>/bg/</code> и уловителят решава какво може да преведе и какво остава следа.</p>`);
	_push(ssrRenderComponent(_component_CatchAll, null, null, _parent));
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bg/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var bg_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, bg_default as default };
