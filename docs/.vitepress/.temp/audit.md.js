import { t as handle } from "./mcp.lIIQx7GU.js";
import { unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs } from "vue/server-renderer";
// docs/audit.md
var __pageData = JSON.parse("{\"title\":\"Audit\",\"description\":\"\",\"frontmatter\":{\"title\":\"Audit\",\"order\":46},\"headers\":[],\"relativePath\":\"audit.md\",\"filePath\":\"audit.md\",\"lastUpdated\":1792928836000}");
var _sfc_main = /*@__PURE__*/ Object.assign({ name: "audit.md" }, {
	__ssrInlineRender: true,
	setup(__props) {
		const reply = handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/call",
			params: {
				name: "audit",
				arguments: {}
			}
		});
		const audit = "result" in reply ? reply.result.structuredContent : null;
		const widget = "result" in reply ? reply.result._meta?.widget ?? "" : "";
		if (!audit || audit.failed > 0) throw new Error(`audit failed: ${JSON.stringify(audit?.checks.filter((c) => !c.passed) ?? reply)}`);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="the-surface-audits-itself" tabindex="-1">The surface audits itself <a class="header-anchor" href="#the-surface-audits-itself" aria-label="Permalink to “The surface audits itself”">​</a></h1><p>This page calls the <code>audit</code> tool, which calls every other tool the way a client would, replays every documented example, and checks the leads registry against <code>tools/list</code>. The table is the tool&#39;s own result. When a check fails here, the site build fails too.</p>`);
			if (unref(audit)) _push(`<p>${ssrInterpolate(unref(audit).passed)} of ${ssrInterpolate(unref(audit).total)} checks pass over ${ssrInterpolate(unref(audit).tools)} tools, ${ssrInterpolate(unref(audit).examples)} examples and ${ssrInterpolate(unref(audit).leads)} leads.</p>`);
			else _push(`<!---->`);
			_push(`<div>${unref(widget) ?? ""}</div></div>`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("audit.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { __pageData, _sfc_main as default };
