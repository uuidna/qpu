import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
// docs/chat.md
var __pageData = JSON.parse("{\"title\":\"Chat\",\"description\":\"\",\"frontmatter\":{\"title\":\"Chat\",\"order\":11},\"headers\":[],\"relativePath\":\"chat.md\",\"filePath\":\"chat.md\",\"lastUpdated\":1792956021000}");
var _sfc_main = { name: "chat.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_Chat = resolveComponent("Chat", true);
	_push(`<div${ssrRenderAttrs(_attrs)}><h1 id="chat-the-mcp-itself" tabindex="-1">Chat: the MCP itself <a class="header-anchor" href="#chat-the-mcp-itself" aria-label="Permalink to “Chat: the MCP itself”">​</a></h1><p>A statement typed here is a <code>tools/call</code> to the handler running in this page — the MCP is the chat. The answer is a block at its content address; the same call is named to the host by the block&#39;s content hash, and a <code>304</code> is the teleport: the host holds the same block, nothing is sent, the analog is verified digitally here in full. Every exchange is signalled to every open tab of the web OS; the log stays on this device. Offline, the handler answers alone and says so.</p>`);
	_push(ssrRenderComponent(_component_Chat, null, null, _parent));
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("chat.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var chat_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export { __pageData, chat_default as default };
