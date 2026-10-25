import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
// docs/repository.md
var __pageData = JSON.parse("{\"title\":\"Repository\",\"description\":\"\",\"frontmatter\":{\"title\":\"Repository\",\"order\":57},\"headers\":[],\"relativePath\":\"repository.md\",\"filePath\":\"repository.md\",\"lastUpdated\":0}");
var _sfc_main = { name: "repository.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="workspaces-branches-tags-and-releases-watched" tabindex="-1">Workspaces, branches, tags and releases, watched <a class="header-anchor" href="#workspaces-branches-tags-and-releases-watched" aria-label="Permalink to “Workspaces, branches, tags and releases, watched”">​</a></h1><p>Gathered here and verified online on 2026-10-25T20:16:55.310Z by <code>npm run next</code> through the <code>repository</code> tool: uuidna/qpu, HEAD cb071975 on rebuild/phase-1, package version 1.4.0, 1 workspace(s).</p><table tabindex="0"><thead><tr><th>Kind</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Here</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Remote</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Agree</th><th>Only here</th><th>Only remote</th></tr></thead><tbody><tr><td>branches</td><td style="${ssrRenderStyle({ "text-align": "right" })}">3</td><td style="${ssrRenderStyle({ "text-align": "right" })}">not reached</td><td style="${ssrRenderStyle({ "text-align": "right" })}">0</td><td>—</td><td>—</td></tr><tr><td>tags</td><td style="${ssrRenderStyle({ "text-align": "right" })}">27</td><td style="${ssrRenderStyle({ "text-align": "right" })}">not reached</td><td style="${ssrRenderStyle({ "text-align": "right" })}">0</td><td>—</td><td>—</td></tr></tbody></table><p>Releases: not reached, latest —; version tag present, release unknown. Zenodo: not reached version(s), latest —.</p><h2 id="leads" tabindex="-1">Leads <a class="header-anchor" href="#leads" aria-label="Permalink to “Leads”">​</a></h2><p>none: here and the remote agree</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("repository.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var repository_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, repository_default as default };
