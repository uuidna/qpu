import { t as data } from "./receipts.data.Ddj_0AYS.js";
import { unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderList } from "vue/server-renderer";
// docs/stream.md
var __pageData = JSON.parse("{\"title\":\"Stream\",\"description\":\"\",\"frontmatter\":{\"title\":\"Stream\",\"order\":55},\"headers\":[],\"relativePath\":\"stream.md\",\"filePath\":\"stream.md\",\"lastUpdated\":1792931988000}");
var _sfc_main = /*@__PURE__*/ Object.assign({ name: "stream.md" }, {
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="the-receipt-stream" tabindex="-1">The receipt stream <a class="header-anchor" href="#the-receipt-stream" aria-label="Permalink to “The receipt stream”">​</a></h1><p>Every run of <code>npm run next</code> appends a receipt; each names the one before it (<code>prev</code>), so the stream is a chain a single UUID verifies against its neighbours. Read at build time from <code>public/receipts.ndjson</code>; each receipt has its page.</p><table><thead><tr><th>Receipt</th><th>Date</th><th>Head</th><th>Steps</th><th>Prev</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(unref(data), (r) => {
				_push(`<tr><td><a${ssrRenderAttr("href", `/u/${r.id}`)}><code>${ssrInterpolate(r.id.slice(0, 8))}</code></a></td><td>${ssrInterpolate(r.date)}</td><td><a${ssrRenderAttr("href", `/h/${r.head.slice(0, 8)}`)}><code>${ssrInterpolate(r.head)}</code></a></td><td>${ssrInterpolate(r.steps)}</td><td>`);
				if (r.prev) _push(`<a${ssrRenderAttr("href", `/u/${r.prev}`)}><code>${ssrInterpolate(r.prev.slice(0, 8))}</code></a>`);
				else _push(`<span>—</span>`);
				_push(`</td></tr>`);
			});
			_push(`<!--]-->`);
			if (!unref(data).length) _push(`<tr><td colspan="5">no receipts yet: run <code>npm run next</code></td></tr>`);
			else _push(`<!---->`);
			_push(`</tbody></table></div>`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("stream.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { __pageData, _sfc_main as default };
