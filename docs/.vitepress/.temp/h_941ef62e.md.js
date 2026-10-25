import { l as uuidFromParts, t as handle } from "./mcp.lIIQx7GU.js";
import { m as useData } from "./Content.D7LwX9PA.js";
import { t as data } from "./receipts.data.Ddj_0AYS.js";
import { unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderList } from "vue/server-renderer";
// docs/h/941ef62e.md
var __pageData = JSON.parse("{\"title\":\"Handle\",\"description\":\"\",\"frontmatter\":{\"title\":\"Handle\"},\"headers\":[],\"params\":{\"handle\":\"941ef62e\"},\"relativePath\":\"h/941ef62e.md\",\"filePath\":\"h/[handle].md\",\"lastUpdated\":1792931988000}");
var _sfc_main = /*@__PURE__*/ Object.assign({ name: "h/941ef62e.md" }, {
	__ssrInlineRender: true,
	setup(__props) {
		const { params } = useData();
		const tools = handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/list"
		}).result.tools.filter((t) => ![
			"audit",
			"match",
			"verify"
		].includes(t.name));
		const doors = [...Array(16).keys()].map((n) => ({
			nibble: n.toString(16),
			tool: tools[n % tools.length].name,
			uuid: uuidFromParts(params.value.handle, Array(10).fill(n), "000000000000")
		}));
		const family = data.filter((r) => r.id.startsWith(params.value.handle));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="params-handle" tabindex="-1"><code>${ssrInterpolate(_ctx.$params.handle)}</code> <a class="header-anchor" href="#params-handle" aria-label="Permalink to “{{ \$params.handle }}”">​</a></h1><p>The family of a handle: every UUID of this site that begins with it, and the sixteen doors a first program nibble opens. A commit&#39;s short hash is a handle too: its imprint carries it. Where the tree has no entry for a door yet, the walk page below the handle compiles it live.</p><h2 id="receipts-of-this-family" tabindex="-1">Receipts of this family <a class="header-anchor" href="#receipts-of-this-family" aria-label="Permalink to “Receipts of this family”">​</a></h2><ul><!--[-->`);
			ssrRenderList(unref(family), (r) => {
				_push(`<li><a${ssrRenderAttr("href", `/u/${r.id}`)}><code>${ssrInterpolate(r.id)}</code></a> · ${ssrInterpolate(r.date)} · ${ssrInterpolate(r.steps)}</li>`);
			});
			_push(`<!--]-->`);
			if (!unref(family).length) _push(`<li>none in the stream</li>`);
			else _push(`<!---->`);
			_push(`</ul><h2 id="doors" tabindex="-1">Doors <a class="header-anchor" href="#doors" aria-label="Permalink to “Doors”">​</a></h2><table><thead><tr><th>nibble</th><th>tool</th><th>walk</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(unref(doors), (d) => {
				_push(`<tr><td>${ssrInterpolate(d.nibble)}</td><td>${ssrInterpolate(d.tool)}</td><td><a${ssrRenderAttr("href", `/u/${d.uuid}`)}><code>${ssrInterpolate(d.uuid)}</code></a></td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("h/941ef62e.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { __pageData, _sfc_main as default };
