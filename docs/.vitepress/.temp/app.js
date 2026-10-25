import { a as channelOf, c as sealOf, d as hueOf, i as translateOf, l as uuidFromParts, o as compileOf, r as LOCALES, s as reflectionOf, t as handle, u as accentOfUuid } from "./mcp.lIIQx7GU.js";
import { C as isShell, D as ClientOnly, E as treatAsHtml, S as isRelativeBase, T as normalize, a as useRouter, b as isExternal, c as pathToFile, d as dataSymbol, f as initData, g as createTitle, h as EXTERNAL_URL_RE, i as useRoute, l as runtimeBase, m as useData$1, n as RouterSymbol, o as useIcon, p as siteDataRef, r as createRouter, s as onContentUpdated, t as Content, u as withBase, v as inBrowser, w as mergeHead, x as isObject, y as isActive } from "./Content.D7LwX9PA.js";
import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.DjkACiAr.js";
import { Fragment, computed, createBlock, createCommentVNode, createSSRApp, createTextVNode, createVNode, defineAsyncComponent, defineComponent, h, inject, mergeProps, nextTick, onBeforeUnmount, onMounted, onScopeDispose, onUnmounted, onUpdated, openBlock, provide, reactive, readonly, ref, renderList, renderSlot, resolveComponent, resolveDynamicComponent, shallowReadonly, shallowRef, toDisplayString, toValue, unref, useId, useSSRContext, useSlots, useTemplateRef, watch, watchEffect, watchPostEffect, withCtx, withModifiers } from "vue";
import { onKeyStroke, useEventListener, useMediaQuery, useNavigatorLanguage, useWindowScroll, whenever } from "@vueuse/core";
import { renderToString, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderSlot, ssrRenderStyle, ssrRenderVNode } from "vue/server-renderer";
// node_modules/vitepress/dist/client/app/composables/codeGroups.js
function useCodeGroups() {
	if (inBrowser) window.addEventListener("click", (e) => {
		const el = e.target;
		if (el.matches(".vp-code-group input")) {
			const group = el.parentElement?.parentElement;
			if (!group) return;
			const i = Array.from(group.querySelectorAll("input")).indexOf(el);
			if (i < 0) return;
			const blocks = group.querySelector(".blocks");
			if (!blocks) return;
			const current = Array.from(blocks.children).find((child) => child.classList.contains("active"));
			if (!current) return;
			const next = blocks.children[i];
			if (!next || current === next) return;
			current.classList.remove("active");
			activate(next);
			(group?.querySelector(`label[for="${el.id}"]`))?.scrollIntoView({ block: "nearest" });
		}
	});
}
function activate(el) {
	el.classList.add("active");
	window.dispatchEvent(new CustomEvent("vitepress:codeGroupTabActivate", { detail: el }));
}
// node_modules/vitepress/dist/client/app/composables/copyCode.js
var ignoredNodes = [".vp-copy-ignore", ".diff.remove"].join(", ");
function useCopyCode() {
	if (inBrowser) {
		const timeoutIdMap = /* @__PURE__ */ new WeakMap();
		window.addEventListener("click", (e) => {
			const el = e.target;
			if (el.matches("div[class*=\"language-\"] > button.copy")) {
				const parent = el.parentElement;
				const sibling = el.nextElementSibling?.nextElementSibling;
				if (!parent || !sibling) return;
				const clone = sibling.cloneNode(true);
				clone.querySelectorAll(ignoredNodes).forEach((node) => node.remove());
				clone.innerHTML = clone.innerHTML.replace(/\n+/g, "\n");
				let text = clone.textContent || "";
				const lang = /language-(\w+)/.exec(parent.className)?.[1] || "";
				if (isShell(lang)) text = text.replace(/^ *(\$|>) /gm, "").trim();
				copyToClipboard(text).then(() => {
					el.classList.add("copied");
					clearTimeout(timeoutIdMap.get(el));
					const timeoutId = window.setTimeout(() => {
						el.classList.remove("copied");
						el.blur();
						timeoutIdMap.delete(el);
					}, 2e3);
					timeoutIdMap.set(el, timeoutId);
				});
			}
		});
	}
}
async function copyToClipboard(text) {
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		const element = document.createElement("textarea");
		const previouslyFocusedElement = document.activeElement;
		element.value = text;
		element.setAttribute("readonly", "");
		element.style.contain = "strict";
		element.style.position = "absolute";
		element.style.left = "-9999px";
		element.style.fontSize = "12pt";
		const selection = document.getSelection();
		const originalRange = selection ? selection.rangeCount > 0 && selection.getRangeAt(0) : null;
		document.body.appendChild(element);
		element.select();
		element.selectionStart = 0;
		element.selectionEnd = text.length;
		document.execCommand("copy");
		document.body.removeChild(element);
		if (originalRange) {
			selection.removeAllRanges();
			selection.addRange(originalRange);
		}
		if (previouslyFocusedElement) previouslyFocusedElement.focus();
	}
}
// node_modules/vitepress/dist/client/app/composables/head.js
function useUpdateHead(route, siteDataByRouteRef) {
	let isFirstUpdate = true;
	let managedHeadElements = [];
	const updateHeadTags = (newTags) => {
		if (isFirstUpdate) {
			isFirstUpdate = false;
			newTags.forEach((tag) => {
				const headEl = createHeadElement(tag);
				for (const el of document.head.children) if (el.isEqualNode(headEl)) {
					managedHeadElements.push(el);
					return;
				}
			});
			return;
		}
		const newElements = newTags.map(createHeadElement);
		managedHeadElements.forEach((oldEl, oldIndex) => {
			const matchedIndex = newElements.findIndex((newEl) => newEl?.isEqualNode(oldEl ?? null));
			if (matchedIndex !== -1) delete newElements[matchedIndex];
			else {
				oldEl?.remove();
				delete managedHeadElements[oldIndex];
			}
		});
		newElements.forEach((el) => el && document.head.appendChild(el));
		managedHeadElements = [...managedHeadElements, ...newElements].filter(Boolean);
	};
	watchEffect(() => {
		const pageData = route.data;
		const siteData = siteDataByRouteRef.value;
		const pageDescription = pageData && pageData.description;
		const frontmatterHead = pageData && pageData.frontmatter.head || [];
		const title = createTitle(siteData, pageData);
		if (title !== document.title) document.title = title;
		const description = pageDescription || siteData.description;
		let metaDescriptionElement = document.querySelector(`meta[name=description]`);
		if (metaDescriptionElement) {
			if (metaDescriptionElement.getAttribute("content") !== description) metaDescriptionElement.setAttribute("content", description);
		} else createHeadElement(["meta", {
			name: "description",
			content: description
		}]);
		updateHeadTags(mergeHead(siteData.head, filterOutHeadDescription(frontmatterHead)));
	});
}
function createHeadElement([tag, attrs, innerHTML]) {
	const el = document.createElement(tag);
	for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
	if (innerHTML) el.innerHTML = innerHTML;
	if (tag === "script" && attrs.async == null) el.async = false;
	return el;
}
function isMetaDescription(headConfig) {
	return headConfig[0] === "meta" && headConfig[1] && headConfig[1].name === "description";
}
function filterOutHeadDescription(head) {
	return head.filter((h) => !isMetaDescription(h));
}
// node_modules/vitepress/dist/client/app/composables/preFetch.js
var hasFetched = /* @__PURE__ */ new Set();
var createLink = () => document.createElement("link");
var viaDOM = (url) => {
	const link = createLink();
	link.rel = `prefetch`;
	if (EXTERNAL_URL_RE.test(url)) link.crossOrigin = "";
	link.href = url;
	document.head.appendChild(link);
};
var viaXHR = (url) => {
	const req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.withCredentials = !EXTERNAL_URL_RE.test(url);
	req.send();
};
var link;
var doFetch = inBrowser && (link = createLink()) && link.relList && link.relList.supports && link.relList.supports("prefetch") ? viaDOM : viaXHR;
function usePrefetch() {
	if (!inBrowser) return;
	if (!window.IntersectionObserver) return;
	let conn;
	if ((conn = navigator.connection) && (conn.saveData || /2g/.test(conn.effectiveType))) return;
	const rIC = window.requestIdleCallback || setTimeout;
	let observer = null;
	const observeLinks = () => {
		if (observer) observer.disconnect();
		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const link = entry.target;
					observer.unobserve(link);
					const { pathname } = link;
					if (!hasFetched.has(pathname)) {
						hasFetched.add(pathname);
						const pageChunkPath = pathToFile(pathname);
						if (pageChunkPath) doFetch(pageChunkPath);
					}
				}
			});
		});
		rIC(() => {
			document.querySelectorAll("#app a").forEach((link) => {
				const { hostname, pathname } = new URL(link.href instanceof SVGAnimatedString ? link.href.animVal : link.href, link.baseURI);
				const extMatch = pathname.match(/\.\w+$/);
				if (extMatch && extMatch[0] !== ".html") return;
				if (link.target !== "_blank" && hostname === location.hostname) {
					if (pathname !== location.pathname) observer.observe(link);
					else hasFetched.add(pathname);
				}
			});
		});
	};
	onMounted(observeLinks);
	const route = useRoute();
	watch(() => route.path, observeLinks);
	onUnmounted(() => {
		observer && observer.disconnect();
	});
}
// node_modules/vitepress/dist/client/theme-default/composables/data.js
var useData = useData$1;
// node_modules/vitepress/dist/client/theme-default/support/utils.js
function throttleAndDebounce(fn, delay) {
	let timeoutId;
	let called = false;
	return () => {
		if (timeoutId) clearTimeout(timeoutId);
		if (!called) {
			fn();
			(called = true) && window.setTimeout(() => called = false, delay);
		} else timeoutId = window.setTimeout(fn, delay);
	};
}
function ensureStartingSlash(path) {
	return path.startsWith("/") ? path : `/${path}`;
}
function isLinkExternal(href, target, external) {
	if (external !== void 0) return external;
	return !!href && isExternal(href) || target === "_blank";
}
function normalizeLink$1(url) {
	const { pathname, search, hash, protocol } = new URL(url, "http://a.com");
	if (isExternal(url) || url.startsWith("#") || !protocol.startsWith("http") || !treatAsHtml(pathname)) return url;
	const { site } = useData();
	let normalizedPath = pathname.endsWith("/") || pathname.endsWith(".html") ? url : url.replace(/(?:(^\.+)\/)?.*$/, `$1${pathname.replace(/(\.md)?$/, site.value.cleanUrls ? "" : ".html")}${search}${hash}`);
	if (isRelativeBase(site.value.base) && !site.value.cleanUrls) {
		const pathPart = normalizedPath.replace(/[?#].*$/, "");
		if (pathPart.endsWith("/")) normalizedPath = pathPart + "index.html" + normalizedPath.slice(pathPart.length);
	}
	return withBase(normalizedPath);
}
function uniqBy(array, keyFn) {
	const seen = /* @__PURE__ */ new Set();
	return array.filter((item) => {
		const k = keyFn(item);
		return seen.has(k) ? false : seen.add(k);
	});
}
// node_modules/vitepress/dist/client/theme-default/support/sidebar.js
/**
* Get the `Sidebar` from sidebar option. This method will ensure to get correct
* sidebar config from `MultiSideBarConfig` with various path combinations such
* as matching `guide/` and `/guide/`. If no matching config was found, it will
* return empty array.
*/
function getSidebar(_sidebar, path) {
	if (Array.isArray(_sidebar)) return addBase(_sidebar);
	if (_sidebar == null) return [];
	path = ensureStartingSlash(path);
	const dir = Object.keys(_sidebar).sort((a, b) => {
		return b.split("/").length - a.split("/").length;
	}).find((dir) => {
		return path.startsWith(ensureStartingSlash(dir));
	});
	const sidebar = dir ? _sidebar[dir] ?? [] : [];
	return Array.isArray(sidebar) ? addBase(sidebar) : addBase(sidebar.items, sidebar.base);
}
/**
* Get or generate sidebar group from the given sidebar items.
*/
function getSidebarGroups(sidebar) {
	const groups = [];
	let lastGroupIndex = 0;
	for (const item of sidebar) {
		if (item.items) {
			lastGroupIndex = groups.push(item);
			continue;
		}
		let group = groups[lastGroupIndex];
		if (!group) {
			group = { items: [] };
			groups.push(group);
		}
		group.items?.push(item);
	}
	return groups;
}
function getFlatSideBarLinks(sidebar) {
	const links = [];
	function recursivelyExtractLinks(items) {
		for (const item of items) {
			if (item.text && item.link) links.push({
				text: item.text,
				link: item.link,
				docFooterText: item.docFooterText,
				rel: item.rel,
				target: item.target
			});
			if (item.items) recursivelyExtractLinks(item.items);
		}
	}
	recursivelyExtractLinks(sidebar);
	return links;
}
/**
* Check if the given sidebar item contains any active link.
*/
function hasActiveLink(path, hash, items, skipHashCheck = false) {
	if (Array.isArray(items)) return items.some((item) => hasActiveLink(path, hash, item, skipHashCheck));
	if (items.link && isActive(path, hash, items.link, false, skipHashCheck)) return true;
	if (items.items) return hasActiveLink(path, hash, items.items, skipHashCheck);
	return false;
}
function addBase(items, _base) {
	return [...items].map((_item) => {
		const item = { ..._item };
		const base = item.base || _base;
		if (base && item.link && !isExternal(item.link)) item.link = base + item.link.replace(/^\//, base.endsWith("/") ? "" : "/");
		if (item.items) item.items = addBase(item.items, base);
		return item;
	});
}
// node_modules/vitepress/dist/client/theme-default/composables/outline.js
var ignoreRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/;
var resolvedHeaders = [];
function resolveTitle(theme) {
	return typeof theme.outline === "object" && !Array.isArray(theme.outline) && theme.outline.label || "On this page";
}
function getHeaders(range) {
	return resolveHeaders([...document.querySelectorAll(".VPDoc h1, .VPDoc h2, .VPDoc h3, .VPDoc h4, .VPDoc h5, .VPDoc h6")].filter((el) => el.id && el.hasChildNodes()).map((el) => {
		const level = Number(el.tagName[1]);
		return {
			element: el,
			title: serializeHeader(el),
			link: "#" + el.id,
			level
		};
	}), range);
}
function serializeHeader(h) {
	let ret = "";
	for (const node of h.childNodes) if (node.nodeType === 1) {
		if (ignoreRE.test(node.className)) continue;
		ret += node.textContent;
	} else if (node.nodeType === 3) ret += node.textContent;
	return ret.trim();
}
function resolveHeaders(headers, range) {
	if (range === false) return [];
	const levelsRange = (typeof range === "object" && !Array.isArray(range) ? range.level : range) || 2;
	const [high, low] = typeof levelsRange === "number" ? [levelsRange, levelsRange] : levelsRange === "deep" ? [2, 6] : levelsRange;
	return buildTree(headers, high, low);
}
function useActiveAnchor(container, marker) {
	const isAsideVisible = useMediaQuery("(min-width: 80rem)");
	const onScroll = throttleAndDebounce(setActiveLink, 100);
	let prevActiveLink = null;
	let ignoreScrollOnce = false;
	onMounted(() => {
		requestAnimationFrame(setActiveLink);
		window.addEventListener("scroll", onScroll);
		container.value?.addEventListener("click", onClick);
	});
	onUpdated(() => {
		activateLink(location.hash);
	});
	onUnmounted(() => {
		window.removeEventListener("scroll", onScroll);
	});
	function onClick(e) {
		if (!isAsideVisible.value) return;
		const hash = e.target instanceof Element ? e.target.closest("a")?.hash : null;
		if (hash) {
			ignoreScrollOnce = true;
			activateLink(hash);
		}
	}
	function setActiveLink() {
		if (!isAsideVisible.value) return;
		if (ignoreScrollOnce) {
			ignoreScrollOnce = false;
			return;
		}
		const scrollY = window.scrollY;
		const innerHeight = window.innerHeight;
		const offsetHeight = document.body.offsetHeight;
		const isBottom = scrollY + innerHeight - offsetHeight >= 0;
		const headers = resolvedHeaders.map(({ element, link }) => ({
			link,
			top: getAbsoluteTop(element),
			scrollMarginTop: Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0
		})).filter(({ top }) => !Number.isNaN(top)).sort((a, b) => a.top - b.top);
		if (!headers.length) {
			activateLink(null);
			return;
		}
		if (scrollY < 1) {
			activateLink(null);
			return;
		}
		if (isBottom) {
			activateLink(headers.at(-1)?.link ?? null);
			return;
		}
		let activeLink = null;
		for (const { link, top, scrollMarginTop } of headers) {
			if (top > scrollY + scrollMarginTop + 4) break;
			activeLink = link;
		}
		activateLink(activeLink);
	}
	function activateLink(hash) {
		const activeLink = hash != null ? container.value?.querySelector(`a[href$="${decodeURIComponent(hash)}"]`) ?? null : null;
		if (activeLink === prevActiveLink) return;
		prevActiveLink?.classList.remove("active");
		prevActiveLink = activeLink;
		if (activeLink) {
			activeLink.classList.add("active");
			if (marker.value) {
				marker.value.style.top = activeLink.offsetTop + (activeLink.offsetParent?.offsetTop ?? 0) + (activeLink.offsetHeight - marker.value.offsetHeight) / 2 + "px";
				marker.value.style.opacity = "1";
			}
			activeLink.scrollIntoView({
				block: "nearest",
				behavior: "smooth"
			});
		} else if (marker.value) {
			marker.value.style.top = "";
			marker.value.style.opacity = "0";
		}
	}
}
function getAbsoluteTop(element) {
	let offsetTop = 0;
	while (element !== document.body) {
		if (element === null) return NaN;
		offsetTop += element.offsetTop;
		element = element.offsetParent;
	}
	return offsetTop;
}
function buildTree(data, min, max) {
	resolvedHeaders.length = 0;
	const result = [];
	const stack = [];
	data.forEach((item) => {
		const node = {
			...item,
			children: []
		};
		let parent = stack[stack.length - 1];
		while (parent && parent.level >= node.level) {
			stack.pop();
			parent = stack[stack.length - 1];
		}
		if (node.element.classList.contains("ignore-header") || parent && "shouldIgnore" in parent) {
			stack.push({
				level: node.level,
				shouldIgnore: true
			});
			return;
		}
		if (node.level > max || node.level < min) return;
		resolvedHeaders.push({
			element: node.element,
			link: node.link
		});
		if (parent) parent.children.push(node);
		else result.push(node);
		stack.push(node);
	});
	return result;
}
// node_modules/vitepress/dist/client/theme-default/composables/sidebar.js
var isOpen = ref(false);
/**
* a11y: cache the element that opened the Sidebar (the menu button) then
* focus that button again when Menu is closed with Escape key.
*/
function useCloseSidebarOnEscape(close) {
	let triggerElement;
	watchEffect(() => {
		triggerElement = isOpen.value ? document.activeElement : void 0;
	});
	onMounted(() => {
		window.addEventListener("keyup", onEscape);
	});
	onUnmounted(() => {
		window.removeEventListener("keyup", onEscape);
	});
	function onEscape(e) {
		if (e.key === "Escape" && isOpen.value) {
			close();
			triggerElement?.focus();
		}
	}
}
function useSidebarControl() {
	function open() {
		isOpen.value = true;
	}
	function close() {
		isOpen.value = false;
	}
	function toggle() {
		isOpen.value ? close() : open();
	}
	return {
		isOpen,
		open,
		close,
		toggle
	};
}
function useSidebarItemControl(item) {
	const route = useRoute();
	const collapsed = ref(false);
	const collapsible = computed(() => {
		return item.value.collapsed != null;
	});
	const isLink = computed(() => {
		return !!item.value.link;
	});
	const isActiveLink = ref(false);
	const hasActiveLink$1 = ref(false);
	function updateActiveLink(skipHashCheck = false) {
		if (item.value.link) isActiveLink.value = isActive(route.data.relativePath, route.hash, item.value.link, false, skipHashCheck);
		else isActiveLink.value = false;
		if (isActiveLink.value) {
			hasActiveLink$1.value = true;
			nextTick(() => collapsed.value = false);
			return;
		}
		if (!item.value.items) {
			hasActiveLink$1.value = false;
			return;
		}
		hasActiveLink$1.value = hasActiveLink(route.data.relativePath, route.hash, item.value.items, skipHashCheck);
		if (hasActiveLink$1.value) nextTick(() => collapsed.value = false);
	}
	updateActiveLink(true);
	watch([item, route], () => updateActiveLink());
	onMounted(() => updateActiveLink());
	const isCurrentLink = computed(() => {
		return item.value.link ? isActive(route.data.relativePath, route.hash, item.value.link) : false;
	});
	const hasChildren = computed(() => {
		return !!(item.value.items && item.value.items.length);
	});
	watchEffect(() => {
		collapsed.value = !!(collapsible.value && item.value.collapsed);
	});
	function toggle() {
		if (collapsible.value) collapsed.value = !collapsed.value;
	}
	return {
		collapsed,
		collapsible,
		isLink,
		isActiveLink,
		isCurrentLink,
		hasActiveLink: hasActiveLink$1,
		hasChildren,
		toggle
	};
}
// node_modules/vitepress/dist/client/theme-default/composables/layout.js
var headers = shallowRef([]);
var sidebar = shallowRef([]);
var isDesktop = useMediaQuery("(min-width: 60rem)");
function useLayout() {
	const { frontmatter, theme } = useData();
	const isHome = computed(() => {
		return !!(frontmatter.value.isHome ?? frontmatter.value.layout === "home");
	});
	const hasSidebar = computed(() => {
		return frontmatter.value.sidebar !== false && sidebar.value.length > 0 && !isHome.value;
	});
	const isSidebarEnabled = computed(() => hasSidebar.value && isDesktop.value);
	const sidebarGroups = computed(() => {
		return hasSidebar.value ? getSidebarGroups(sidebar.value) : [];
	});
	const hasAside = computed(() => {
		if (isHome.value) return false;
		if (frontmatter.value.aside != null) return !!frontmatter.value.aside;
		return theme.value.aside !== false;
	});
	const leftAside = computed(() => {
		if (!hasAside.value) return false;
		return frontmatter.value.aside == null ? theme.value.aside === "left" : frontmatter.value.aside === "left";
	});
	const hasLocalNav = computed(() => {
		return headers.value.length > 0;
	});
	return {
		isHome,
		sidebar: shallowReadonly(sidebar),
		sidebarGroups,
		hasSidebar,
		isSidebarEnabled,
		hasAside,
		leftAside,
		headers: shallowReadonly(headers),
		hasLocalNav
	};
}
function registerWatchers({ closeSidebar }) {
	const { theme, page, frontmatter } = useData();
	watch(() => [page.value.relativePath, theme.value.sidebar], ([relativePath, sidebarConfig]) => {
		const newSidebar = sidebarConfig ? getSidebar(sidebarConfig, relativePath) : [];
		if (JSON.stringify(newSidebar) !== JSON.stringify(sidebar.value)) sidebar.value = newSidebar;
	}, {
		immediate: true,
		deep: true,
		flush: "sync"
	});
	onContentUpdated(() => {
		headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline);
	});
	const route = useRoute();
	watch(() => route.path, closeSidebar);
	watch(isDesktop, closeSidebar);
	useCloseSidebarOnEscape(closeSidebar);
}
var layoutInfoInjectionKey = Symbol("layout-info");
// node_modules/vitepress/dist/client/theme-default/components/VPBadge.vue
var _sfc_main$62 = {
	__name: "VPBadge",
	__ssrInlineRender: true,
	props: {
		text: {
			type: String,
			required: false
		},
		type: {
			type: String,
			required: false,
			default: "tip"
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<span${ssrRenderAttrs(mergeProps({ class: ["VPBadge", __props.type] }, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, () => {
				_push(`${ssrInterpolate(__props.text)}`);
			}, _push, _parent);
			_push(`</span>`);
		};
	}
};
var _sfc_setup$73 = _sfc_main$62.setup;
_sfc_main$62.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPBadge.vue");
	return _sfc_setup$73 ? _sfc_setup$73(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/components/VPBackdrop.vue
var _sfc_main$61 = {
	__name: "VPBackdrop",
	__ssrInlineRender: true,
	props: { show: {
		type: Boolean,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.show) _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPBackdrop" }, _attrs))} data-v-ea199def></div>`);
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$72 = _sfc_main$61.setup;
_sfc_main$61.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPBackdrop.vue");
	return _sfc_setup$72 ? _sfc_setup$72(props, ctx) : void 0;
};
var VPBackdrop_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$61, [["__scopeId", "data-v-ea199def"]]);
// node_modules/vitepress/dist/client/theme-default/composables/langs.js
function useLangs({ linkToCorrespondingPage = false } = {}) {
	const data = useData();
	const route = useRoute();
	const { site, localeIndex } = data;
	const currentLang = computed(() => ({
		label: site.value.locales[localeIndex.value]?.label,
		link: site.value.locales[localeIndex.value]?.link || (localeIndex.value === "root" ? "/" : `/${localeIndex.value}/`)
	}));
	return {
		currentLang,
		localeLinks: computed(() => Object.entries(site.value.locales).flatMap(([key, value]) => currentLang.value.label === value.label ? [] : {
			text: value.label,
			link: resolveLocaleLink(data, route, {
				targetLocale: key,
				targetLocaleLink: value.link || (key === "root" ? "/" : `/${key}/`),
				currentLocaleLink: currentLang.value.link,
				linkToCorrespondingPage
			}),
			lang: value.lang,
			dir: value.dir
		}))
	};
}
/**
* Resolves the link used for switching from the current page to
* `targetLocale`. Without `linkToCorrespondingPage`, this is simply the home
* of the target locale. With it, the current page's path is rewritten into
* the target locale (honoring `cleanUrls`) — unless
* `themeConfig.i18nRouting` is `false` (the locale home is used instead) or
* a function (which then fully controls the resolution).
*
* The current query and hash are carried over, except when a custom
* `i18nRouting` function is used.
*/
function resolveLocaleLink(data, route, { targetLocale, targetLocaleLink, currentLocaleLink, linkToCorrespondingPage }) {
	const { site, theme } = data;
	const i18nRouting = theme.value.i18nRouting;
	if (linkToCorrespondingPage && typeof i18nRouting === "function") return i18nRouting(data, route, targetLocale);
	return normalizeLink(targetLocaleLink, i18nRouting !== false && linkToCorrespondingPage, route.data.relativePath.slice(currentLocaleLink.length - 1), !site.value.cleanUrls) + route.query + route.hash;
}
function normalizeLink(localeLink, appendPagePath, pagePath, addHtmlExt) {
	return appendPagePath ? localeLink.replace(/\/$/, "") + ensureStartingSlash(pagePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, addHtmlExt ? ".html" : "")) : localeLink;
}
// node_modules/vitepress/dist/client/theme-default/NotFound.vue
var _sfc_main$60 = {
	__name: "NotFound",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme } = useData();
		const { currentLang } = useLangs();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "NotFound" }, _attrs))} data-v-189da333><p class="code" data-v-189da333>${ssrInterpolate(unref(theme).notFound?.code ?? "404")}</p><h1 class="title" data-v-189da333>${ssrInterpolate(unref(theme).notFound?.title ?? "PAGE NOT FOUND")}</h1><div class="divider" data-v-189da333></div><blockquote class="quote" data-v-189da333>${ssrInterpolate(unref(theme).notFound?.quote ?? "But if you don't change your direction, and if you keep looking, you may end up where you are heading.")}</blockquote><div class="action" data-v-189da333><a class="link"${ssrRenderAttr("href", unref(withBase)(unref(theme).notFound?.link ?? unref(currentLang).link))}${ssrRenderAttr("aria-label", unref(theme).notFound?.linkLabel ?? "go to home")} data-v-189da333>${ssrInterpolate(unref(theme).notFound?.linkText ?? "Take me home")}</a></div></div>`);
		};
	}
};
var _sfc_setup$71 = _sfc_main$60.setup;
_sfc_main$60.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/NotFound.vue");
	return _sfc_setup$71 ? _sfc_setup$71(props, ctx) : void 0;
};
var NotFound_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$60, [["__scopeId", "data-v-189da333"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPDocAsideCarbonAds.vue
var _sfc_main$59 = {
	__name: "VPDocAsideCarbonAds",
	__ssrInlineRender: true,
	props: { carbonAds: {
		type: Object,
		required: true
	} },
	setup(__props) {
		const VPCarbonAds = () => null;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAsideCarbonAds" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(VPCarbonAds), { "carbon-ads": __props.carbonAds }, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$70 = _sfc_main$59.setup;
_sfc_main$59.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocAsideCarbonAds.vue");
	return _sfc_setup$70 ? _sfc_setup$70(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/components/VPDocOutlineItem.vue
var _sfc_main$58 = {
	__name: "VPDocOutlineItem",
	__ssrInlineRender: true,
	props: {
		headers: {
			type: Array,
			required: true
		},
		root: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_VPDocOutlineItem = resolveComponent("VPDocOutlineItem", true);
			_push(`<ul${ssrRenderAttrs(mergeProps({ class: ["VPDocOutlineItem", __props.root ? "root" : "nested"] }, _attrs))} data-v-a7228af7><!--[-->`);
			ssrRenderList(__props.headers, ({ children, link, title }) => {
				_push(`<li data-v-a7228af7><a class="outline-link"${ssrRenderAttr("href", link)}${ssrRenderAttr("title", title)} data-v-a7228af7>${ssrInterpolate(title)}</a>`);
				if (children?.length) _push(ssrRenderComponent(_component_VPDocOutlineItem, { headers: children }, null, _parent));
				else _push(`<!---->`);
				_push(`</li>`);
			});
			_push(`<!--]--></ul>`);
		};
	}
};
var _sfc_setup$69 = _sfc_main$58.setup;
_sfc_main$58.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocOutlineItem.vue");
	return _sfc_setup$69 ? _sfc_setup$69(props, ctx) : void 0;
};
var VPDocOutlineItem_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$58, [["__scopeId", "data-v-a7228af7"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue
var _sfc_main$57 = {
	__name: "VPDocAsideOutline",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme } = useData();
		const container = useTemplateRef("container");
		const marker = useTemplateRef("marker");
		const { headers, hasLocalNav } = useLayout();
		useActiveAnchor(container, marker);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<nav${ssrRenderAttrs(mergeProps({
				"aria-labelledby": "doc-outline-aria-label",
				class: ["VPDocAsideOutline", { "has-outline": unref(hasLocalNav) }],
				ref_key: "container",
				ref: container
			}, _attrs))} data-v-230a2956><div class="content" data-v-230a2956><div class="outline-marker" data-v-230a2956></div><div aria-level="2" class="outline-title" id="doc-outline-aria-label" role="heading" data-v-230a2956>${ssrInterpolate(unref(resolveTitle)(unref(theme)))}</div>`);
			_push(ssrRenderComponent(VPDocOutlineItem_default, {
				headers: unref(headers),
				root: true
			}, null, _parent));
			_push(`</div></nav>`);
		};
	}
};
var _sfc_setup$68 = _sfc_main$57.setup;
_sfc_main$57.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue");
	return _sfc_setup$68 ? _sfc_setup$68(props, ctx) : void 0;
};
var VPDocAsideOutline_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$57, [["__scopeId", "data-v-230a2956"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPDocAside.vue
var _sfc_main$56 = {
	__name: "VPDocAside",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme } = useData();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAside" }, _attrs))} data-v-117643ad>`);
			ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push, _parent);
			ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push, _parent);
			_push(ssrRenderComponent(VPDocAsideOutline_default, null, null, _parent));
			ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push, _parent);
			_push(`<div class="spacer" data-v-117643ad></div>`);
			ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push, _parent);
			if (unref(theme).carbonAds) _push(ssrRenderComponent(_sfc_main$59, { "carbon-ads": unref(theme).carbonAds }, null, _parent));
			else _push(`<!---->`);
			ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push, _parent);
			ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push, _parent);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$67 = _sfc_main$56.setup;
_sfc_main$56.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocAside.vue");
	return _sfc_setup$67 ? _sfc_setup$67(props, ctx) : void 0;
};
var VPDocAside_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$56, [["__scopeId", "data-v-117643ad"]]);
// node_modules/vitepress/dist/client/theme-default/composables/edit-link.js
function useEditLink() {
	const { theme, page } = useData();
	return computed(() => {
		const { text = "Edit this page", pattern = "" } = theme.value.editLink || {};
		let url;
		if (typeof pattern === "function") url = pattern(page.value);
		else url = pattern.replace(/:path/g, page.value.filePath);
		return {
			url,
			text
		};
	});
}
// node_modules/vitepress/dist/client/theme-default/composables/prev-next.js
function usePrevNext() {
	const { theme, page, frontmatter } = useData();
	return computed(() => {
		const candidates = uniqBy(getFlatSideBarLinks(getSidebar(theme.value.sidebar, page.value.relativePath)), (link) => normalize(link.link));
		const index = candidates.findIndex((link) => {
			return isActive(page.value.relativePath, "", link.link, false, true);
		});
		const hidePrev = theme.value.docFooter?.prev === false && !frontmatter.value.prev || frontmatter.value.prev === false;
		const hideNext = theme.value.docFooter?.next === false && !frontmatter.value.next || frontmatter.value.next === false;
		return {
			prev: hidePrev ? void 0 : {
				text: (typeof frontmatter.value.prev === "string" ? frontmatter.value.prev : typeof frontmatter.value.prev === "object" ? frontmatter.value.prev.text : void 0) ?? candidates[index - 1]?.docFooterText ?? candidates[index - 1]?.text,
				link: (typeof frontmatter.value.prev === "object" ? frontmatter.value.prev.link : void 0) ?? candidates[index - 1]?.link,
				target: (typeof frontmatter.value.prev === "object" ? frontmatter.value.prev.target : void 0) ?? candidates[index - 1]?.target,
				rel: (typeof frontmatter.value.prev === "object" ? frontmatter.value.prev.rel : void 0) ?? candidates[index - 1]?.rel
			},
			next: hideNext ? void 0 : {
				text: (typeof frontmatter.value.next === "string" ? frontmatter.value.next : typeof frontmatter.value.next === "object" ? frontmatter.value.next.text : void 0) ?? candidates[index + 1]?.docFooterText ?? candidates[index + 1]?.text,
				link: (typeof frontmatter.value.next === "object" ? frontmatter.value.next.link : void 0) ?? candidates[index + 1]?.link,
				target: (typeof frontmatter.value.next === "object" ? frontmatter.value.next.target : void 0) ?? candidates[index + 1]?.target,
				rel: (typeof frontmatter.value.next === "object" ? frontmatter.value.next.rel : void 0) ?? candidates[index + 1]?.rel
			}
		};
	});
}
// node_modules/vitepress/dist/client/theme-default/components/VPDocFooterLastUpdated.vue
var _sfc_main$55 = {
	__name: "VPDocFooterLastUpdated",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme, page, lang: pageLang } = useData();
		const { language: browserLang } = useNavigatorLanguage();
		const timeRef = useTemplateRef("timeRef");
		const date = computed(() => new Date(page.value.lastUpdated));
		const isoDatetime = computed(() => date.value.toISOString());
		const datetime = shallowRef("");
		onMounted(() => {
			watchEffect(() => {
				const lang = theme.value.lastUpdated?.formatOptions?.forceLocale ? pageLang.value : browserLang.value;
				datetime.value = new Intl.DateTimeFormat(lang, theme.value.lastUpdated?.formatOptions ?? {
					dateStyle: "medium",
					timeStyle: "medium"
				}).format(date.value);
				if (lang && pageLang.value !== lang) timeRef.value?.setAttribute("lang", lang);
				else timeRef.value?.removeAttribute("lang");
			});
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<p${ssrRenderAttrs(mergeProps({ class: "VPLastUpdated" }, _attrs))} data-v-a94c41c2>${ssrInterpolate(unref(theme).lastUpdated?.text || "Last updated")}: <time${ssrRenderAttr("datetime", isoDatetime.value)} data-v-a94c41c2>${ssrInterpolate(datetime.value)}</time></p>`);
		};
	}
};
var _sfc_setup$66 = _sfc_main$55.setup;
_sfc_main$55.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocFooterLastUpdated.vue");
	return _sfc_setup$66 ? _sfc_setup$66(props, ctx) : void 0;
};
var VPDocFooterLastUpdated_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$55, [["__scopeId", "data-v-a94c41c2"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPLink.vue
var _sfc_main$54 = {
	__name: "VPLink",
	__ssrInlineRender: true,
	props: {
		tag: {
			type: String,
			required: false
		},
		href: {
			type: String,
			required: false
		},
		noIcon: {
			type: Boolean,
			required: false
		},
		external: {
			type: Boolean,
			required: false,
			default: void 0
		},
		target: {
			type: String,
			required: false
		},
		rel: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const tag = computed(() => props.tag ?? (props.href ? "a" : "span"));
		const isExternal = computed(() => isLinkExternal(props.href, props.target, props.external));
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tag.value), mergeProps({
				class: ["VPLink", {
					link: __props.href,
					"vp-external-link-icon": isExternal.value,
					"no-icon": __props.noIcon
				}],
				href: __props.href ? unref(normalizeLink$1)(__props.href) : void 0,
				target: __props.target ?? (isExternal.value ? "_blank" : void 0),
				rel: __props.rel ?? (isExternal.value ? "noreferrer" : void 0)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default")];
				}),
				_: 3
			}), _parent);
		};
	}
};
var _sfc_setup$65 = _sfc_main$54.setup;
_sfc_main$54.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPLink.vue");
	return _sfc_setup$65 ? _sfc_setup$65(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/components/VPDocFooter.vue
var _sfc_main$53 = {
	__name: "VPDocFooter",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme, page, frontmatter } = useData();
		const editLink = useEditLink();
		const control = usePrevNext();
		const hasEditLink = computed(() => theme.value.editLink && frontmatter.value.editLink !== false);
		const hasLastUpdated = computed(() => page.value.lastUpdated);
		const showFooter = computed(() => hasEditLink.value || hasLastUpdated.value || control.value.prev || control.value.next);
		return (_ctx, _push, _parent, _attrs) => {
			if (showFooter.value) {
				_push(`<footer${ssrRenderAttrs(mergeProps({ class: "VPDocFooter" }, _attrs))} data-v-b328ff8a>`);
				ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push, _parent);
				if (hasEditLink.value || hasLastUpdated.value) {
					_push(`<div class="edit-info" data-v-b328ff8a>`);
					if (hasEditLink.value) {
						_push(`<div class="edit-link" data-v-b328ff8a>`);
						_push(ssrRenderComponent(_sfc_main$54, {
							class: "edit-link-button",
							href: unref(editLink).url,
							"no-icon": true
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="vpi-square-pen edit-link-icon" data-v-b328ff8a${_scopeId}></span> ${ssrInterpolate(unref(editLink).text)}`);
								else return [createVNode("span", { class: "vpi-square-pen edit-link-icon" }), createTextVNode(" " + toDisplayString(unref(editLink).text), 1)];
							}),
							_: 1
						}, _parent));
						_push(`</div>`);
					} else _push(`<!---->`);
					if (hasLastUpdated.value) {
						_push(`<div class="last-updated" data-v-b328ff8a>`);
						_push(ssrRenderComponent(VPDocFooterLastUpdated_default, null, null, _parent));
						_push(`</div>`);
					} else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				if (unref(control).prev?.link || unref(control).next?.link) {
					_push(`<nav class="prev-next" aria-labelledby="doc-footer-aria-label" data-v-b328ff8a><span class="visually-hidden" id="doc-footer-aria-label" data-v-b328ff8a>Pager</span><div class="pager" data-v-b328ff8a>`);
					if (unref(control).prev?.link) _push(ssrRenderComponent(_sfc_main$54, {
						class: "pager-link prev",
						href: unref(control).prev.link,
						target: unref(control).prev.target,
						rel: unref(control).prev.rel
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<span class="desc" data-v-b328ff8a${_scopeId}>${(unref(theme).docFooter?.prev || "Previous page") ?? ""}</span><span class="title" data-v-b328ff8a${_scopeId}>${unref(control).prev.text ?? ""}</span>`);
							else return [createVNode("span", {
								class: "desc",
								innerHTML: unref(theme).docFooter?.prev || "Previous page"
							}, null, 8, ["innerHTML"]), createVNode("span", {
								class: "title",
								innerHTML: unref(control).prev.text
							}, null, 8, ["innerHTML"])];
						}),
						_: 1
					}, _parent));
					else _push(`<!---->`);
					_push(`</div><div class="pager" data-v-b328ff8a>`);
					if (unref(control).next?.link) _push(ssrRenderComponent(_sfc_main$54, {
						class: "pager-link next",
						href: unref(control).next.link,
						target: unref(control).next.target,
						rel: unref(control).next.rel
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<span class="desc" data-v-b328ff8a${_scopeId}>${(unref(theme).docFooter?.next || "Next page") ?? ""}</span><span class="title" data-v-b328ff8a${_scopeId}>${unref(control).next.text ?? ""}</span>`);
							else return [createVNode("span", {
								class: "desc",
								innerHTML: unref(theme).docFooter?.next || "Next page"
							}, null, 8, ["innerHTML"]), createVNode("span", {
								class: "title",
								innerHTML: unref(control).next.text
							}, null, 8, ["innerHTML"])];
						}),
						_: 1
					}, _parent));
					else _push(`<!---->`);
					_push(`</div></nav>`);
				} else _push(`<!---->`);
				_push(`</footer>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$64 = _sfc_main$53.setup;
_sfc_main$53.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocFooter.vue");
	return _sfc_setup$64 ? _sfc_setup$64(props, ctx) : void 0;
};
var VPDocFooter_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$53, [["__scopeId", "data-v-b328ff8a"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPDoc.vue
var _sfc_main$52 = {
	__name: "VPDoc",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme, site } = useData();
		const route = useRoute();
		const { hasSidebar, hasAside, leftAside } = useLayout();
		const pageName = computed(() => {
			return (isRelativeBase(site.value.base) ? "/" + route.path.slice(runtimeBase().length) : route.path).replace(/[./]+/g, "_").replace(/_html$/, "");
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Content = resolveComponent("Content");
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPDoc", {
				"has-sidebar": unref(hasSidebar),
				"has-aside": unref(hasAside)
			}] }, _attrs))} data-v-e0c79c31>`);
			ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push, _parent);
			_push(`<div class="container" data-v-e0c79c31>`);
			if (unref(hasAside)) {
				_push(`<div class="${ssrRenderClass([{ "left-aside": unref(leftAside) }, "aside"])}" data-v-e0c79c31><div class="aside-curtain" data-v-e0c79c31></div><div class="aside-container" data-v-e0c79c31><div class="aside-content" data-v-e0c79c31>`);
				_push(ssrRenderComponent(VPDocAside_default, null, {
					"aside-top": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-top", {}, void 0, true)];
					}),
					"aside-bottom": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-bottom", {}, void 0, true)];
					}),
					"aside-outline-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-outline-before", {}, void 0, true)];
					}),
					"aside-outline-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-outline-after", {}, void 0, true)];
					}),
					"aside-ads-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-ads-before", {}, void 0, true)];
					}),
					"aside-ads-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-ads-after", {}, void 0, true)];
					}),
					_: 3
				}, _parent));
				_push(`</div></div></div>`);
			} else _push(`<!---->`);
			_push(`<div class="content" data-v-e0c79c31><div class="content-container" data-v-e0c79c31>`);
			ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push, _parent);
			_push(`<main class="main" data-v-e0c79c31>`);
			_push(ssrRenderComponent(_component_Content, { class: ["vp-doc", [pageName.value, unref(theme).externalLinkIcon && "external-link-icon-enabled"]] }, null, _parent));
			_push(`</main>`);
			_push(ssrRenderComponent(VPDocFooter_default, null, {
				"doc-footer-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "doc-footer-before", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			ssrRenderSlot(_ctx.$slots, "doc-after", {}, null, _push, _parent);
			_push(`</div></div></div>`);
			ssrRenderSlot(_ctx.$slots, "doc-bottom", {}, null, _push, _parent);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$63 = _sfc_main$52.setup;
_sfc_main$52.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDoc.vue");
	return _sfc_setup$63 ? _sfc_setup$63(props, ctx) : void 0;
};
var VPDoc_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$52, [["__scopeId", "data-v-e0c79c31"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPHomeContent.vue
var _sfc_main$51 = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPHomeContent vp-doc container" }, _attrs))} data-v-24cfbf57>`);
	ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
	_push(`</div>`);
}
var _sfc_setup$62 = _sfc_main$51.setup;
_sfc_main$51.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPHomeContent.vue");
	return _sfc_setup$62 ? _sfc_setup$62(props, ctx) : void 0;
};
var VPHomeContent_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$51, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-24cfbf57"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPImage.vue
var _sfc_main$50 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "VPImage",
	__ssrInlineRender: true,
	props: {
		image: {
			type: [String, Object],
			required: true
		},
		alt: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_VPImage = resolveComponent("VPImage", true);
			if (__props.image) {
				_push(`<!--[-->`);
				if (typeof __props.image === "string" || "src" in __props.image) _push(`<img${ssrRenderAttrs(mergeProps({ class: "VPImage" }, typeof __props.image === "string" ? _ctx.$attrs : {
					...__props.image,
					..._ctx.$attrs
				}, {
					src: unref(withBase)(typeof __props.image === "string" ? __props.image : __props.image.src),
					alt: __props.alt ?? (typeof __props.image === "string" ? "" : __props.image.alt || "")
				}))} data-v-453cd2d1>`);
				else {
					_push(`<!--[-->`);
					_push(ssrRenderComponent(_component_VPImage, mergeProps({
						class: "dark",
						image: __props.image.dark,
						alt: __props.image.alt
					}, _ctx.$attrs), null, _parent));
					_push(ssrRenderComponent(_component_VPImage, mergeProps({
						class: "light",
						image: __props.image.light,
						alt: __props.image.alt
					}, _ctx.$attrs), null, _parent));
					_push(`<!--]-->`);
				}
				_push(`<!--]-->`);
			} else _push(`<!---->`);
		};
	}
});
var _sfc_setup$61 = _sfc_main$50.setup;
_sfc_main$50.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPImage.vue");
	return _sfc_setup$61 ? _sfc_setup$61(props, ctx) : void 0;
};
var VPImage_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$50, [["__scopeId", "data-v-453cd2d1"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPFeature.vue
var _sfc_main$49 = {
	__name: "VPFeature",
	__ssrInlineRender: true,
	props: {
		icon: {
			type: [String, Object],
			required: false
		},
		title: {
			type: String,
			required: true
		},
		details: {
			type: String,
			required: false
		},
		link: {
			type: String,
			required: false
		},
		linkText: {
			type: String,
			required: false
		},
		rel: {
			type: String,
			required: false
		},
		target: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$54, mergeProps({
				class: "VPFeature",
				href: __props.link,
				rel: __props.rel,
				target: __props.target,
				"no-icon": true,
				tag: __props.link ? "a" : "div"
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<article class="box" data-v-f20d54ef${_scopeId}>`);
						if (typeof __props.icon === "object" && __props.icon.wrap) {
							_push(`<div class="icon" data-v-f20d54ef${_scopeId}>`);
							_push(ssrRenderComponent(VPImage_default, {
								image: __props.icon,
								alt: __props.icon.alt,
								height: __props.icon.height || 48,
								width: __props.icon.width || 48
							}, null, _parent, _scopeId));
							_push(`</div>`);
						} else if (typeof __props.icon === "object") _push(ssrRenderComponent(VPImage_default, {
							image: __props.icon,
							alt: __props.icon.alt,
							height: __props.icon.height || 48,
							width: __props.icon.width || 48
						}, null, _parent, _scopeId));
						else if (__props.icon) _push(`<div class="icon" data-v-f20d54ef${_scopeId}>${__props.icon ?? ""}</div>`);
						else _push(`<!---->`);
						_push(`<h2 class="title" data-v-f20d54ef${_scopeId}>${__props.title ?? ""}</h2>`);
						if (Array.isArray(__props.details)) {
							_push(`<ul class="details" data-v-f20d54ef${_scopeId}><!--[-->`);
							ssrRenderList(__props.details, (item) => {
								_push(`<li data-v-f20d54ef${_scopeId}>${item ?? ""}</li>`);
							});
							_push(`<!--]--></ul>`);
						} else if (__props.details) _push(`<p class="details" data-v-f20d54ef${_scopeId}>${__props.details ?? ""}</p>`);
						else _push(`<!---->`);
						if (__props.linkText) _push(`<div class="link-text" data-v-f20d54ef${_scopeId}><p class="link-text-value" data-v-f20d54ef${_scopeId}>${ssrInterpolate(__props.linkText)} <span class="vpi-arrow-right link-text-icon" data-v-f20d54ef${_scopeId}></span></p></div>`);
						else _push(`<!---->`);
						_push(`</article>`);
					} else return [createVNode("article", { class: "box" }, [
						typeof __props.icon === "object" && __props.icon.wrap ? (openBlock(), createBlock("div", {
							key: 0,
							class: "icon"
						}, [createVNode(VPImage_default, {
							image: __props.icon,
							alt: __props.icon.alt,
							height: __props.icon.height || 48,
							width: __props.icon.width || 48
						}, null, 8, [
							"image",
							"alt",
							"height",
							"width"
						])])) : typeof __props.icon === "object" ? (openBlock(), createBlock(VPImage_default, {
							key: 1,
							image: __props.icon,
							alt: __props.icon.alt,
							height: __props.icon.height || 48,
							width: __props.icon.width || 48
						}, null, 8, [
							"image",
							"alt",
							"height",
							"width"
						])) : __props.icon ? (openBlock(), createBlock("div", {
							key: 2,
							class: "icon",
							innerHTML: __props.icon
						}, null, 8, ["innerHTML"])) : createCommentVNode("", true),
						createVNode("h2", {
							class: "title",
							innerHTML: __props.title
						}, null, 8, ["innerHTML"]),
						Array.isArray(__props.details) ? (openBlock(), createBlock("ul", {
							key: 3,
							class: "details"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(__props.details, (item) => {
							return openBlock(), createBlock("li", {
								key: item,
								innerHTML: item
							}, null, 8, ["innerHTML"]);
						}), 128))])) : __props.details ? (openBlock(), createBlock("p", {
							key: 4,
							class: "details",
							innerHTML: __props.details
						}, null, 8, ["innerHTML"])) : createCommentVNode("", true),
						__props.linkText ? (openBlock(), createBlock("div", {
							key: 5,
							class: "link-text"
						}, [createVNode("p", { class: "link-text-value" }, [createTextVNode(toDisplayString(__props.linkText) + " ", 1), createVNode("span", { class: "vpi-arrow-right link-text-icon" })])])) : createCommentVNode("", true)
					])];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$60 = _sfc_main$49.setup;
_sfc_main$49.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPFeature.vue");
	return _sfc_setup$60 ? _sfc_setup$60(props, ctx) : void 0;
};
var VPFeature_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$49, [["__scopeId", "data-v-f20d54ef"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPFeatures.vue
var _sfc_main$48 = {
	__name: "VPFeatures",
	__ssrInlineRender: true,
	props: { features: {
		type: Array,
		required: true
	} },
	setup(__props) {
		const props = __props;
		const grid = computed(() => {
			const length = props.features.length;
			if (!length) return;
			else if (length === 2) return "grid-2";
			else if (length === 3) return "grid-3";
			else if (length % 3 === 0) return "grid-6";
			else if (length > 3) return "grid-4";
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.features) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPFeatures" }, _attrs))} data-v-aff0b625><div class="container" data-v-aff0b625><ul class="items" data-v-aff0b625><!--[-->`);
				ssrRenderList(__props.features, (feature) => {
					_push(`<li class="${ssrRenderClass([[grid.value], "item"])}" data-v-aff0b625>`);
					_push(ssrRenderComponent(VPFeature_default, {
						icon: feature.icon,
						title: feature.title,
						details: feature.details,
						link: feature.link,
						"link-text": feature.linkText,
						rel: feature.rel,
						target: feature.target
					}, null, _parent));
					_push(`</li>`);
				});
				_push(`<!--]--></ul></div></div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$59 = _sfc_main$48.setup;
_sfc_main$48.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPFeatures.vue");
	return _sfc_setup$59 ? _sfc_setup$59(props, ctx) : void 0;
};
var VPFeatures_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$48, [["__scopeId", "data-v-aff0b625"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPHomeFeatures.vue
var _sfc_main$47 = {
	__name: "VPHomeFeatures",
	__ssrInlineRender: true,
	setup(__props) {
		const { frontmatter: fm } = useData();
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(fm).features) _push(ssrRenderComponent(VPFeatures_default, mergeProps({
				class: "VPHomeFeatures",
				features: unref(fm).features
			}, _attrs), null, _parent));
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$58 = _sfc_main$47.setup;
_sfc_main$47.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPHomeFeatures.vue");
	return _sfc_setup$58 ? _sfc_setup$58(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/components/VPButton.vue
var _sfc_main$46 = {
	__name: "VPButton",
	__ssrInlineRender: true,
	props: {
		tag: {
			type: String,
			required: false
		},
		size: {
			type: String,
			required: false,
			default: "medium"
		},
		theme: {
			type: String,
			required: false,
			default: "brand"
		},
		text: {
			type: String,
			required: false
		},
		href: {
			type: String,
			required: false
		},
		target: {
			type: String,
			required: false
		},
		rel: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const isExternal = computed(() => props.href && EXTERNAL_URL_RE.test(props.href));
		const component = computed(() => {
			return props.tag || (props.href ? "a" : "button");
		});
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(component.value), mergeProps({
				class: ["VPButton no-icon", [__props.size, __props.theme]],
				href: __props.href ? unref(normalizeLink$1)(__props.href) : void 0,
				target: props.target ?? (isExternal.value ? "_blank" : void 0),
				rel: props.rel ?? (isExternal.value ? "noreferrer" : void 0)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, () => {
						_push(`${ssrInterpolate(__props.text)}`);
					}, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(__props.text), 1)], true)];
				}),
				_: 3
			}), _parent);
		};
	}
};
var _sfc_setup$57 = _sfc_main$46.setup;
_sfc_main$46.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPButton.vue");
	return _sfc_setup$57 ? _sfc_setup$57(props, ctx) : void 0;
};
var VPButton_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$46, [["__scopeId", "data-v-6356dfe3"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPHero.vue
var _sfc_main$45 = {
	__name: "VPHero",
	__ssrInlineRender: true,
	props: {
		name: {
			type: String,
			required: false
		},
		text: {
			type: String,
			required: false
		},
		tagline: {
			type: String,
			required: false
		},
		image: {
			type: [String, Object],
			required: false
		},
		actions: {
			type: Array,
			required: false
		}
	},
	setup(__props) {
		const { heroImageSlotExists } = inject(layoutInfoInjectionKey, { heroImageSlotExists: computed(() => false) });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPHero", { "has-image": __props.image || unref(heroImageSlotExists) }] }, _attrs))} data-v-32cafb29><div class="container" data-v-32cafb29><div class="main" data-v-32cafb29>`);
			ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent);
			ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, () => {
				_push(`<h1 class="heading" data-v-32cafb29>`);
				if (__props.name) _push(`<span class="name clip" data-v-32cafb29>${__props.name ?? ""}</span>`);
				else _push(`<!---->`);
				if (__props.text) _push(`<span class="text" data-v-32cafb29>${__props.text ?? ""}</span>`);
				else _push(`<!---->`);
				_push(`</h1>`);
				if (__props.tagline) _push(`<p class="tagline" data-v-32cafb29>${__props.tagline ?? ""}</p>`);
				else _push(`<!---->`);
			}, _push, _parent);
			ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent);
			if (__props.actions) {
				_push(`<div class="actions" data-v-32cafb29>`);
				ssrRenderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, null, _push, _parent);
				_push(`<!--[-->`);
				ssrRenderList(__props.actions, (action) => {
					_push(`<div class="action" data-v-32cafb29>`);
					_push(ssrRenderComponent(VPButton_default, {
						tag: "a",
						size: "medium",
						theme: action.theme,
						text: action.text,
						href: action.link,
						target: action.target,
						rel: action.rel
					}, null, _parent));
					_push(`</div>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push, _parent);
			_push(`</div>`);
			if (__props.image || unref(heroImageSlotExists)) {
				_push(`<div class="image" data-v-32cafb29><div class="image-container" data-v-32cafb29><div class="image-bg" data-v-32cafb29></div>`);
				ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, () => {
					if (__props.image) _push(ssrRenderComponent(VPImage_default, {
						class: "image-src",
						image: __props.image
					}, null, _parent));
					else _push(`<!---->`);
				}, _push, _parent);
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$56 = _sfc_main$45.setup;
_sfc_main$45.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPHero.vue");
	return _sfc_setup$56 ? _sfc_setup$56(props, ctx) : void 0;
};
var VPHero_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$45, [["__scopeId", "data-v-32cafb29"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPHomeHero.vue
var _sfc_main$44 = {
	__name: "VPHomeHero",
	__ssrInlineRender: true,
	setup(__props) {
		const { frontmatter: fm } = useData();
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(fm).hero) _push(ssrRenderComponent(VPHero_default, mergeProps({
				class: "VPHomeHero",
				name: unref(fm).hero.name,
				text: unref(fm).hero.text,
				tagline: unref(fm).hero.tagline,
				image: unref(fm).hero.image,
				actions: unref(fm).hero.actions
			}, _attrs), {
				"home-hero-info-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info-before")];
				}),
				"home-hero-info": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info")];
				}),
				"home-hero-info-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info-after")];
				}),
				"home-hero-actions-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-actions-after")];
				}),
				"home-hero-actions-before-actions": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-actions-before-actions")];
				}),
				"home-hero-image": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-image")];
				}),
				_: 3
			}, _parent));
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$55 = _sfc_main$44.setup;
_sfc_main$44.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPHomeHero.vue");
	return _sfc_setup$55 ? _sfc_setup$55(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/components/VPHome.vue
var _sfc_main$43 = {
	__name: "VPHome",
	__ssrInlineRender: true,
	setup(__props) {
		const { frontmatter, theme } = useData();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Content = resolveComponent("Content");
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPHome", { "external-link-icon-enabled": unref(theme).externalLinkIcon }] }, _attrs))} data-v-c6199a69>`);
			ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push, _parent);
			_push(ssrRenderComponent(_sfc_main$44, null, {
				"home-hero-info-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info-before", {}, void 0, true)];
				}),
				"home-hero-info": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info", {}, void 0, true)];
				}),
				"home-hero-info-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info-after", {}, void 0, true)];
				}),
				"home-hero-actions-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-actions-after", {}, void 0, true)];
				}),
				"home-hero-actions-before-actions": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, void 0, true)];
				}),
				"home-hero-image": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-image", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			ssrRenderSlot(_ctx.$slots, "home-hero-after", {}, null, _push, _parent);
			ssrRenderSlot(_ctx.$slots, "home-features-before", {}, null, _push, _parent);
			_push(ssrRenderComponent(_sfc_main$47, null, null, _parent));
			ssrRenderSlot(_ctx.$slots, "home-features-after", {}, null, _push, _parent);
			if (unref(frontmatter).markdownStyles !== false) _push(ssrRenderComponent(VPHomeContent_default, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_Content, null, null, _parent, _scopeId));
					else return [createVNode(_component_Content)];
				}),
				_: 1
			}, _parent));
			else _push(ssrRenderComponent(_component_Content, null, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$54 = _sfc_main$43.setup;
_sfc_main$43.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPHome.vue");
	return _sfc_setup$54 ? _sfc_setup$54(props, ctx) : void 0;
};
var VPHome_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$43, [["__scopeId", "data-v-c6199a69"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPPage.vue
var _sfc_main$42 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
	const _component_Content = resolveComponent("Content");
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPPage" }, _attrs))}>`);
	ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push, _parent);
	_push(ssrRenderComponent(_component_Content, null, null, _parent));
	ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push, _parent);
	_push(`</div>`);
}
var _sfc_setup$53 = _sfc_main$42.setup;
_sfc_main$42.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPPage.vue");
	return _sfc_setup$53 ? _sfc_setup$53(props, ctx) : void 0;
};
var VPPage_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$42, [["ssrRender", _sfc_ssrRender$2]]);
// node_modules/vitepress/dist/client/theme-default/components/VPContent.vue
var _sfc_main$41 = {
	__name: "VPContent",
	__ssrInlineRender: true,
	setup(__props) {
		const { page, frontmatter } = useData();
		const { isHome, hasSidebar } = useLayout();
		function isRegistered(component) {
			return typeof resolveDynamicComponent(component) !== "string";
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: ["VPContent", {
					"has-sidebar": unref(hasSidebar),
					"is-home": unref(isHome)
				}],
				id: "VPContent"
			}, _attrs))} data-v-b934d83e>`);
			if (unref(page).isNotFound) ssrRenderSlot(_ctx.$slots, "not-found", {}, () => {
				_push(ssrRenderComponent(NotFound_default, null, null, _parent));
			}, _push, _parent);
			else if (unref(frontmatter).layout === "page" && !isRegistered("page")) _push(ssrRenderComponent(VPPage_default, null, {
				"page-top": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "page-top", {}, void 0, true)];
				}),
				"page-bottom": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "page-bottom", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			else if (unref(frontmatter).layout === "home" && !isRegistered("home")) _push(ssrRenderComponent(VPHome_default, null, {
				"home-hero-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-before", {}, void 0, true)];
				}),
				"home-hero-info-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info-before", {}, void 0, true)];
				}),
				"home-hero-info": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info", {}, void 0, true)];
				}),
				"home-hero-info-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-info-after", {}, void 0, true)];
				}),
				"home-hero-actions-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-actions-after", {}, void 0, true)];
				}),
				"home-hero-actions-before-actions": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, void 0, true)];
				}),
				"home-hero-image": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-image", {}, void 0, true)];
				}),
				"home-hero-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-hero-after", {}, void 0, true)];
				}),
				"home-features-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-features-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-features-before", {}, void 0, true)];
				}),
				"home-features-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "home-features-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "home-features-after", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			else if ((!unref(frontmatter).layout || unref(frontmatter).layout === "doc") && !isRegistered("doc")) _push(ssrRenderComponent(VPDoc_default, null, {
				"doc-top": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "doc-top", {}, void 0, true)];
				}),
				"doc-bottom": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "doc-bottom", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "doc-bottom", {}, void 0, true)];
				}),
				"doc-footer-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "doc-footer-before", {}, void 0, true)];
				}),
				"doc-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "doc-before", {}, void 0, true)];
				}),
				"doc-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "doc-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "doc-after", {}, void 0, true)];
				}),
				"aside-top": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "aside-top", {}, void 0, true)];
				}),
				"aside-outline-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "aside-outline-before", {}, void 0, true)];
				}),
				"aside-outline-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "aside-outline-after", {}, void 0, true)];
				}),
				"aside-ads-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "aside-ads-before", {}, void 0, true)];
				}),
				"aside-ads-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "aside-ads-after", {}, void 0, true)];
				}),
				"aside-bottom": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "aside-bottom", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			else ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(frontmatter).layout || "doc"), null, null), _parent);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$52 = _sfc_main$41.setup;
_sfc_main$41.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPContent.vue");
	return _sfc_setup$52 ? _sfc_setup$52(props, ctx) : void 0;
};
var VPContent_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$41, [["__scopeId", "data-v-b934d83e"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPFooter.vue
var _sfc_main$40 = {
	__name: "VPFooter",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme, frontmatter } = useData();
		const { hasSidebar } = useLayout();
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(theme).footer && unref(frontmatter).footer !== false) {
				_push(`<footer${ssrRenderAttrs(mergeProps({ class: ["VPFooter", { "has-sidebar": unref(hasSidebar) }] }, _attrs))} data-v-0fe63196><div class="container" data-v-0fe63196>`);
				if (unref(theme).footer.message) _push(`<p class="message" data-v-0fe63196>${unref(theme).footer.message ?? ""}</p>`);
				else _push(`<!---->`);
				if (unref(theme).footer.copyright) _push(`<p class="copyright" data-v-0fe63196>${unref(theme).footer.copyright ?? ""}</p>`);
				else _push(`<!---->`);
				_push(`</div></footer>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$51 = _sfc_main$40.setup;
_sfc_main$40.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPFooter.vue");
	return _sfc_setup$51 ? _sfc_setup$51(props, ctx) : void 0;
};
var VPFooter_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$40, [["__scopeId", "data-v-0fe63196"]]);
// node_modules/vitepress/dist/client/theme-default/composables/scroll-lock.js
var isIOS = inBrowser && (/iP(?:ad|hone|od)/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
var scrollKeys = /* @__PURE__ */ new Set([
	" ",
	"PageUp",
	"PageDown",
	"Home",
	"End",
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
var listenerOptions = {
	capture: true,
	passive: false
};
function isScrollable(target) {
	let el = target instanceof Element ? target : null;
	while (el && el !== document.body) {
		const { overflowX, overflowY } = getComputedStyle(el);
		if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight || (overflowX === "auto" || overflowX === "scroll") && el.scrollWidth > el.clientWidth) return true;
		el = el.parentElement;
	}
	return false;
}
function blockScroll(e) {
	if ("touches" in e && e.touches.length > 1) return;
	if (!isScrollable(e.target)) e.preventDefault();
}
function blockScrollKeys(e) {
	if (e.metaKey || e.ctrlKey || e.altKey || !scrollKeys.has(e.key)) return;
	const el = e.target;
	if (el instanceof HTMLElement && (el.isContentEditable || el.matches("input, textarea, select"))) return;
	blockScroll(e);
}
var overflowLockCount = 0;
var eventLockCount = 0;
var initialOverflow;
var initialGutter;
function lockOverflow() {
	if (++overflowLockCount > 1) return;
	const html = document.documentElement;
	if (!getComputedStyle(html).scrollbarGutter.includes("stable")) {
		initialGutter = html.style.scrollbarGutter;
		html.style.scrollbarGutter = "stable";
	}
	initialOverflow = document.body.style.overflow;
	document.body.style.overflow = "hidden";
	if (isIOS) document.addEventListener("touchmove", blockScroll, listenerOptions);
}
function unlockOverflow() {
	if (--overflowLockCount > 0) return;
	if (isIOS) document.removeEventListener("touchmove", blockScroll, listenerOptions);
	document.body.style.overflow = initialOverflow ?? "";
	if (initialGutter !== void 0) document.documentElement.style.scrollbarGutter = initialGutter;
	initialOverflow = initialGutter = void 0;
}
function lockEvents() {
	if (++eventLockCount > 1) return;
	document.addEventListener("wheel", blockScroll, listenerOptions);
	document.addEventListener("touchmove", blockScroll, listenerOptions);
	document.addEventListener("keydown", blockScrollKeys, listenerOptions);
}
function unlockEvents() {
	if (--eventLockCount > 0) return;
	document.removeEventListener("wheel", blockScroll, listenerOptions);
	document.removeEventListener("touchmove", blockScroll, listenerOptions);
	document.removeEventListener("keydown", blockScrollKeys, listenerOptions);
}
/**
* Locks page scrolling behind an overlay.
*
* Prefer `scrollbar-gutter: stable` + `overflow: hidden` so layout width
* stays stable when the scrollbar is hidden. If unsupported, fall back to
* blocking scroll events while still allowing events inside scrollable
* elements.
*/
function useBodyScrollLock() {
	const isLocked = shallowRef(false);
	let useEvents = false;
	function lock() {
		if (isLocked.value) return;
		useEvents = window.innerWidth > document.documentElement.clientWidth && !CSS.supports("scrollbar-gutter", "stable");
		useEvents ? lockEvents() : lockOverflow();
		isLocked.value = true;
	}
	function unlock() {
		if (!isLocked.value) return;
		useEvents ? unlockEvents() : unlockOverflow();
		isLocked.value = false;
	}
	onScopeDispose(unlock);
	return computed({
		get: () => isLocked.value,
		set: (value) => value ? lock() : unlock()
	});
}
// node_modules/vitepress/dist/client/theme-default/components/VPLocalNavOutlineDropdown.vue
var _sfc_main$39 = {
	__name: "VPLocalNavOutlineDropdown",
	__ssrInlineRender: true,
	props: {
		headers: {
			type: Array,
			required: true
		},
		navHeight: {
			type: Number,
			required: true
		}
	},
	setup(__props) {
		const { theme } = useData();
		const open = ref(false);
		const vh = ref(0);
		const main = useTemplateRef("main");
		useTemplateRef("items");
		const itemsId = useId();
		const isLocked = useBodyScrollLock();
		function closeOnClickOutside(e) {
			if (!main.value?.contains(e.target)) open.value = false;
		}
		watch(open, (value) => {
			isLocked.value = value;
			if (value) {
				document.addEventListener("click", closeOnClickOutside);
				return;
			}
			document.removeEventListener("click", closeOnClickOutside);
		});
		onKeyStroke("Escape", () => {
			open.value = false;
		});
		onContentUpdated(() => {
			open.value = false;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				ref_key: "main",
				ref: main,
				class: "VPLocalNavOutlineDropdown",
				style: { "--vp-vh": vh.value + "px" },
				"data-allow-mismatch": "style"
			}, _attrs))} data-v-b9336427>`);
			if (__props.headers.length > 0) _push(`<button type="button"${ssrRenderAttr("aria-expanded", open.value)}${ssrRenderAttr("aria-controls", unref(itemsId))} class="${ssrRenderClass({ open: open.value })}" data-v-b9336427><span class="menu-text" data-v-b9336427>${ssrInterpolate(unref(resolveTitle)(unref(theme)))}</span><span class="vpi-chevron-right icon" aria-hidden="true" data-v-b9336427></span></button>`);
			else _push(`<button type="button" data-v-b9336427>${ssrInterpolate(unref(theme).returnToTopLabel || "Return to top")}</button>`);
			if (open.value) {
				_push(`<div${ssrRenderAttr("id", unref(itemsId))} class="items" data-v-b9336427><div class="header" data-v-b9336427><a class="top-link" href="#" data-v-b9336427>${ssrInterpolate(unref(theme).returnToTopLabel || "Return to top")}</a></div><div class="outline" data-v-b9336427>`);
				_push(ssrRenderComponent(VPDocOutlineItem_default, { headers: __props.headers }, null, _parent));
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$50 = _sfc_main$39.setup;
_sfc_main$39.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPLocalNavOutlineDropdown.vue");
	return _sfc_setup$50 ? _sfc_setup$50(props, ctx) : void 0;
};
var VPLocalNavOutlineDropdown_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$39, [["__scopeId", "data-v-b9336427"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPLocalNav.vue
var _sfc_main$38 = {
	__name: "VPLocalNav",
	__ssrInlineRender: true,
	props: { open: {
		type: Boolean,
		required: true
	} },
	emits: ["open-menu"],
	setup(__props) {
		const { theme } = useData();
		const { isHome, hasSidebar, headers, hasLocalNav } = useLayout();
		const { y } = useWindowScroll();
		const navHeight = ref(0);
		onMounted(() => {
			const probe = document.createElement("div");
			probe.style.cssText = "position: absolute; visibility: hidden; height: var(--vp-nav-height)";
			document.body.appendChild(probe);
			navHeight.value = probe.offsetHeight;
			probe.remove();
		});
		const isScrolled = computed(() => y.value >= navHeight.value);
		return (_ctx, _push, _parent, _attrs) => {
			if (!unref(isHome) && (unref(hasLocalNav) || unref(hasSidebar) || isScrolled.value)) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPLocalNav", {
					"has-sidebar": unref(hasSidebar),
					"empty": !unref(hasLocalNav),
					"fixed": !unref(hasLocalNav) && !unref(hasSidebar)
				}] }, _attrs))} data-v-86f10958><div class="container" data-v-86f10958>`);
				if (unref(hasSidebar)) _push(`<button type="button" class="menu"${ssrRenderAttr("aria-expanded", __props.open)} aria-controls="VPSidebarNav" data-v-86f10958><span class="vpi-align-left menu-icon" aria-hidden="true" data-v-86f10958></span><span class="menu-text" data-v-86f10958>${ssrInterpolate(unref(theme).sidebarMenuLabel || "Menu")}</span></button>`);
				else _push(`<!---->`);
				_push(ssrRenderComponent(VPLocalNavOutlineDropdown_default, {
					headers: unref(headers),
					navHeight: navHeight.value
				}, null, _parent));
				_push(`</div></div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$49 = _sfc_main$38.setup;
_sfc_main$38.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPLocalNav.vue");
	return _sfc_setup$49 ? _sfc_setup$49(props, ctx) : void 0;
};
var VPLocalNav_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$38, [["__scopeId", "data-v-86f10958"]]);
// node_modules/vitepress/dist/client/theme-default/composables/nav.js
var isScreenOpen = ref(false);
var screenTriggerEl = shallowRef(null);
function openScreen() {
	isScreenOpen.value = true;
}
function closeScreen() {
	isScreenOpen.value = false;
}
function toggleScreen() {
	isScreenOpen.value ? closeScreen() : openScreen();
}
var watchersRegistered = false;
function useNav() {
	if (inBrowser && !watchersRegistered) {
		watchersRegistered = true;
		const isTablet = useMediaQuery("(min-width: 48rem)");
		whenever(isTablet, closeScreen);
		const route = useRoute();
		watch(() => route.path, closeScreen);
	}
	return {
		isScreenOpen,
		screenTriggerEl,
		openScreen,
		closeScreen,
		toggleScreen
	};
}
function useAppearanceSwitch() {
	const { site } = useData();
	return computed(() => !!site.value.appearance && site.value.appearance !== "force-dark" && site.value.appearance !== "force-auto");
}
function useNavItemLink(item) {
	const route = useRoute();
	const href = computed(() => {
		const { link } = toValue(item);
		return typeof link === "function" ? link(route.data) : link;
	});
	return {
		href,
		isActiveLink: computed(() => {
			const { activeMatch } = toValue(item);
			return isActive(route.data.relativePath, route.hash, activeMatch || href.value, !!activeMatch);
		}),
		isCurrentLink: computed(() => {
			return isActive(route.data.relativePath, route.hash, href.value);
		})
	};
}
var navInjectionKey = Symbol("nav");
var navScreenInjectionKey = Symbol("nav-screen");
// node_modules/vitepress/dist/client/theme-default/composables/nav-overflow.js
/**
* Priority+ overflow for the navbar (#1271, #2842).
*
* Collapse order under space pressure: social links → appearance switch →
* translations → menu items right-to-left. Collapsed units move into the
* `⋯` flyout (VPNavBarExtra) instead of being clipped, so nothing ever
* becomes unreachable.
*
* Collapsed units stay mounted but hidden (visibility: hidden + absolute,
* which also removes them from the a11y tree and tab order), so their
* natural widths remain measurable and observed — re-expanding never works
* from stale data.
*/
var navClusterUnits = [
	"translations",
	"appearance",
	"socialLinks"
];
var allVisible = {
	visibleItemCount: Infinity,
	translations: true,
	appearance: true,
	socialLinks: true
};
function computeNavFit(input) {
	const { itemWidths, available, extraWidth } = input;
	const itemsTotal = itemWidths.reduce((sum, w) => sum + w, 0);
	if (itemsTotal + ((input.translations ?? 0) + (input.appearance ?? 0) + (input.socialLinks ?? 0)) <= available) return allVisible;
	const budget = available - extraWidth;
	if (itemsTotal > budget) {
		let used = 0;
		let visibleItemCount = 0;
		for (const width of itemWidths) {
			if (used + width > budget) break;
			used += width;
			visibleItemCount++;
		}
		return {
			visibleItemCount,
			translations: input.translations == null,
			appearance: input.appearance == null,
			socialLinks: input.socialLinks == null
		};
	}
	const result = { ...allVisible };
	let used = itemsTotal;
	let dropRest = false;
	for (const unit of navClusterUnits) {
		const width = input[unit];
		if (width == null) continue;
		if (dropRest || used + width > budget) {
			dropRest = true;
			result[unit] = false;
		} else used += width;
	}
	return result;
}
/** headroom against sub-pixel rounding and the inter-unit dividers */
var SLACK = 24;
/** used until the real `⋯` button has been measured once */
var EXTRA_WIDTH_ESTIMATE = 48;
var navOverflowKey = Symbol("nav-overflow");
function useNavOverflow() {
	return inject(navOverflowKey, null);
}
function provideNavOverflow(options) {
	const state = reactive({ ...allVisible });
	const itemEls = /* @__PURE__ */ new Map();
	const clusterEls = /* @__PURE__ */ new Map();
	let containerEl = null;
	let menuEl = null;
	let extraEl = null;
	let extraWidth = EXTRA_WIDTH_ESTIMATE;
	let observer = null;
	const observed = /* @__PURE__ */ new Set();
	let scheduled = false;
	function observe(el) {
		if (!inBrowser || !(el instanceof Element) || observed.has(el)) return;
		observed.add(el);
		(observer ??= new ResizeObserver(schedule)).observe(el);
	}
	function schedule() {
		if (!inBrowser || scheduled) return;
		scheduled = true;
		requestAnimationFrame(() => {
			scheduled = false;
			recompute();
		});
	}
	const controller = {
		state,
		hasCollapsed: () => state.visibleItemCount !== Infinity || !state.translations || !state.appearance || !state.socialLinks,
		setContainerEl(el) {
			containerEl = el;
			observe(el);
			schedule();
		},
		setMenuEl(el) {
			menuEl = el;
			observe(el);
			schedule();
		},
		setExtraEl(el) {
			extraEl = el;
			observe(el);
			schedule();
		},
		setItemEl(index, el) {
			el ? itemEls.set(index, el) : itemEls.delete(index);
			observe(el);
			schedule();
		},
		setClusterEl(unit, el) {
			el ? clusterEls.set(unit, el) : clusterEls.delete(unit);
			observe(el);
			schedule();
		}
	};
	provide(navOverflowKey, controller);
	if (!inBrowser) return controller;
	const isEngineActive = useMediaQuery("(min-width: 48rem)");
	function measureUnit(el) {
		return Math.max(el.offsetWidth, el.scrollWidth);
	}
	function recompute() {
		if (!isEngineActive.value) return applyResult(allVisible);
		if (!containerEl) return;
		if (extraEl && extraEl.offsetWidth > 0) extraWidth = extraEl.offsetWidth;
		let fixed = 0;
		for (const child of Array.from(containerEl.children)) {
			if (!(child instanceof HTMLElement)) continue;
			if (child === menuEl || child === extraEl) continue;
			let isCluster = false;
			for (const el of clusterEls.values()) if (el === child) {
				isCluster = true;
				break;
			}
			if (isCluster) continue;
			fixed += child.offsetWidth;
		}
		const itemWidths = [];
		for (let i = 0; i < itemEls.size; i++) {
			const el = itemEls.get(i);
			if (!el) return;
			itemWidths.push(measureUnit(el));
		}
		const clusterWidth = (unit) => {
			const el = clusterEls.get(unit);
			return el ? measureUnit(el) : null;
		};
		applyResult(computeNavFit({
			itemWidths,
			translations: clusterWidth("translations"),
			appearance: clusterWidth("appearance"),
			socialLinks: clusterWidth("socialLinks"),
			available: containerEl.clientWidth - fixed - SLACK,
			extraWidth
		}));
	}
	function applyResult(result) {
		if (state.visibleItemCount !== result.visibleItemCount) state.visibleItemCount = result.visibleItemCount;
		for (const unit of navClusterUnits) if (state[unit] !== result[unit]) state[unit] = result[unit];
	}
	watch(isEngineActive, schedule);
	watch(() => toValue(options.itemsKey), schedule);
	if (document.fonts?.ready) document.fonts.ready.then(schedule).catch(() => {});
	onScopeDispose(() => {
		observer?.disconnect();
		observer = null;
		observed.clear();
	});
	return controller;
}
// node_modules/vitepress/dist/client/theme-default/components/VPSwitch.vue
var _sfc_main$37 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
	_push(`<button${ssrRenderAttrs(mergeProps({
		class: "VPSwitch",
		type: "button",
		role: "switch"
	}, _attrs))} data-v-127358ab><span class="check" data-v-127358ab>`);
	if (_ctx.$slots.default) {
		_push(`<span class="icon" data-v-127358ab>`);
		ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
		_push(`</span>`);
	} else _push(`<!---->`);
	_push(`</span></button>`);
}
var _sfc_setup$48 = _sfc_main$37.setup;
_sfc_main$37.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSwitch.vue");
	return _sfc_setup$48 ? _sfc_setup$48(props, ctx) : void 0;
};
var VPSwitch_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$37, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-127358ab"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPSwitchAppearance.vue
var _sfc_main$36 = {
	__name: "VPSwitchAppearance",
	__ssrInlineRender: true,
	setup(__props) {
		const { isDark, theme } = useData();
		const toggleAppearance = inject("toggle-appearance", () => {
			isDark.value = !isDark.value;
		});
		const switchTitle = ref("");
		watchPostEffect(() => {
			switchTitle.value = isDark.value ? theme.value.lightModeSwitchTitle || "Switch to light theme" : theme.value.darkModeSwitchTitle || "Switch to dark theme";
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(VPSwitch_default, mergeProps({
				title: switchTitle.value,
				class: "VPSwitchAppearance",
				"aria-label": unref(theme).darkModeSwitchLabel || "Appearance",
				"aria-checked": unref(isDark),
				onClick: unref(toggleAppearance)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="vpi-sun sun" aria-hidden="true" data-v-2e76c223${_scopeId}></span><span class="vpi-moon moon" aria-hidden="true" data-v-2e76c223${_scopeId}></span>`);
					else return [createVNode("span", {
						class: "vpi-sun sun",
						"aria-hidden": "true"
					}), createVNode("span", {
						class: "vpi-moon moon",
						"aria-hidden": "true"
					})];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$47 = _sfc_main$36.setup;
_sfc_main$36.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSwitchAppearance.vue");
	return _sfc_setup$47 ? _sfc_setup$47(props, ctx) : void 0;
};
var VPSwitchAppearance_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$36, [["__scopeId", "data-v-2e76c223"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavAppearance.vue
var _sfc_main$35 = {
	__name: "VPNavAppearance",
	__ssrInlineRender: true,
	props: {
		row: {
			type: Boolean,
			required: false
		},
		screen: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { theme } = useData();
		const show = useAppearanceSwitch();
		const overflow = props.row ? null : useNavOverflow();
		const isCollapsed = computed(() => !!overflow && !overflow.state.appearance);
		const labelId = useId();
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(show)) {
				_push(`<div${ssrRenderAttrs(mergeProps({
					class: ["VPNavAppearance", [__props.row ? __props.screen ? "VPNavScreenAppearance" : "menu-appearance" : "VPNavBarAppearance", { collapsed: isCollapsed.value }]],
					ref: (el) => unref(overflow)?.setClusterEl("appearance", el)
				}, _attrs))} data-v-b1d5eb1e>`);
				if (__props.row) _push(`<p${ssrRenderAttr("id", unref(labelId))} class="text" data-v-b1d5eb1e>${ssrInterpolate(unref(theme).darkModeSwitchLabel || "Appearance")}</p>`);
				else _push(`<!---->`);
				_push(ssrRenderComponent(VPSwitchAppearance_default, { "aria-labelledby": __props.row ? unref(labelId) : void 0 }, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$46 = _sfc_main$35.setup;
_sfc_main$35.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavAppearance.vue");
	return _sfc_setup$46 ? _sfc_setup$46(props, ctx) : void 0;
};
var VPNavAppearance_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$35, [["__scopeId", "data-v-b1d5eb1e"]]);
// node_modules/vitepress/dist/client/theme-default/composables/flyout.js
var focusedElement = ref();
var active = false;
var listeners = 0;
function useFlyout(options) {
	const focus = ref(false);
	if (inBrowser) {
		!active && activateFocusTracking();
		listeners++;
		const unwatch = watch(focusedElement, (el) => {
			if (el === options.el.value || options.el.value?.contains(el)) {
				focus.value = true;
				options.onFocus?.();
			} else {
				focus.value = false;
				options.onBlur?.();
			}
		});
		onUnmounted(() => {
			unwatch();
			listeners--;
			if (!listeners) deactivateFocusTracking();
		});
	}
	return readonly(focus);
}
function activateFocusTracking() {
	document.addEventListener("focusin", handleFocusIn);
	active = true;
	focusedElement.value = document.activeElement;
}
function deactivateFocusTracking() {
	document.removeEventListener("focusin", handleFocusIn);
	active = false;
}
function handleFocusIn() {
	focusedElement.value = document.activeElement;
}
// node_modules/vitepress/dist/client/theme-default/components/VPMenuLink.vue
var _sfc_main$34 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "VPMenuLink",
	__ssrInlineRender: true,
	props: {
		item: {
			type: null,
			required: true
		},
		rel: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { href, isActiveLink, isCurrentLink } = useNavItemLink(() => props.item);
		const screen = inject(navScreenInjectionKey, false);
		const nav = inject(navInjectionKey, null);
		function onClick() {
			if (screen) nav?.closeScreen();
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<li${ssrRenderAttrs(mergeProps({ class: "VPMenuLink" }, _attrs))} data-v-d7165732>`);
			_push(ssrRenderComponent(_sfc_main$54, mergeProps(_ctx.$attrs, {
				class: {
					active: unref(isActiveLink),
					VPNavScreenMenuGroupLink: unref(screen)
				},
				"aria-current": unref(isCurrentLink) ? "page" : void 0,
				href: unref(href),
				target: __props.item.target,
				rel: props.rel ?? __props.item.rel,
				"no-icon": __props.item.noIcon,
				onClick
			}), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span data-v-d7165732${_scopeId}>${__props.item.text ?? ""}</span>`);
					else return [createVNode("span", { innerHTML: __props.item.text }, null, 8, ["innerHTML"])];
				}),
				_: 1
			}, _parent));
			_push(`</li>`);
		};
	}
});
var _sfc_setup$45 = _sfc_main$34.setup;
_sfc_main$34.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPMenuLink.vue");
	return _sfc_setup$45 ? _sfc_setup$45(props, ctx) : void 0;
};
var VPMenuLink_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$34, [["__scopeId", "data-v-d7165732"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPMenuGroup.vue
var _sfc_main$33 = {
	__name: "VPMenuGroup",
	__ssrInlineRender: true,
	props: {
		text: {
			type: String,
			required: false
		},
		items: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const screen = inject(navScreenInjectionKey, false);
		const hasSubGroups = computed(() => props.items.some((item) => !("link" in item) && !("component" in item)));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_VPMenuGroup = resolveComponent("VPMenuGroup", true);
			_push(`<li${ssrRenderAttrs(mergeProps({ class: ["VPMenuGroup", { VPNavScreenMenuGroupSection: unref(screen) }] }, _attrs))} data-v-8a73a473>`);
			if (__props.text) _push(`<p class="title" data-v-8a73a473>${ssrInterpolate(__props.text)}</p>`);
			else _push(`<!---->`);
			_push(`<ul class="${ssrRenderClass({ "sub-groups": hasSubGroups.value })}" data-v-8a73a473><!--[-->`);
			ssrRenderList(__props.items, (item) => {
				_push(`<!--[-->`);
				if ("link" in item) _push(ssrRenderComponent(VPMenuLink_default, { item }, null, _parent));
				else if ("component" in item) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, {
					"screen-menu": unref(screen) || void 0,
					menu: !unref(screen) || void 0
				}), null), _parent);
				else _push(ssrRenderComponent(_component_VPMenuGroup, {
					text: item.text,
					items: item.items
				}, null, _parent));
				_push(`<!--]-->`);
			});
			_push(`<!--]--></ul></li>`);
		};
	}
};
var _sfc_setup$44 = _sfc_main$33.setup;
_sfc_main$33.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPMenuGroup.vue");
	return _sfc_setup$44 ? _sfc_setup$44(props, ctx) : void 0;
};
var VPMenuGroup_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$33, [["__scopeId", "data-v-8a73a473"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPMenu.vue
var _sfc_main$32 = {
	__name: "VPMenu",
	__ssrInlineRender: true,
	props: { items: {
		type: Array,
		required: false
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPMenu" }, _attrs))} data-v-a835e0c5>`);
			if (__props.items) {
				_push(`<ul class="items" data-v-a835e0c5><!--[-->`);
				ssrRenderList(__props.items, (item) => {
					_push(`<!--[-->`);
					if ("link" in item) _push(ssrRenderComponent(VPMenuLink_default, { item }, null, _parent));
					else if ("component" in item) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, { menu: "" }), null), _parent);
					else _push(ssrRenderComponent(VPMenuGroup_default, {
						text: item.text,
						items: item.items
					}, null, _parent));
					_push(`<!--]-->`);
				});
				_push(`<!--]--></ul>`);
			} else _push(`<!---->`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$43 = _sfc_main$32.setup;
_sfc_main$32.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPMenu.vue");
	return _sfc_setup$43 ? _sfc_setup$43(props, ctx) : void 0;
};
var VPMenu_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$32, [["__scopeId", "data-v-a835e0c5"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPFlyout.vue
var _sfc_main$31 = {
	__name: "VPFlyout",
	__ssrInlineRender: true,
	props: {
		icon: {
			type: String,
			required: false
		},
		button: {
			type: String,
			required: false
		},
		label: {
			type: String,
			required: false
		},
		items: {
			type: Array,
			required: false
		}
	},
	setup(__props) {
		const open = ref(false);
		const el = useTemplateRef("el");
		useTemplateRef("buttonEl");
		useTemplateRef("menuEl");
		const menuId = useId();
		useFlyout({
			el,
			onBlur: close
		});
		const route = useRoute();
		watch(() => route.path, close);
		function close() {
			open.value = false;
		}
		onKeyStroke("Escape", () => {
			if (!open.value) return;
			const restoreFocus = el.value?.contains(document.activeElement);
			close();
			if (restoreFocus) el.value?.querySelector("button")?.focus();
		});
		useEventListener("pointerdown", (e) => {
			if (open.value && el.value && !el.value.contains(e.target)) close();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "VPFlyout",
				ref_key: "el",
				ref: el
			}, _attrs))} data-v-92ecaa7c><button type="button" class="button"${ssrRenderAttr("aria-expanded", open.value)}${ssrRenderAttr("aria-controls", unref(menuId))}${ssrRenderAttr("aria-label", __props.label)} data-v-92ecaa7c>`);
			if (__props.button || __props.icon) {
				_push(`<span class="text" data-v-92ecaa7c>`);
				if (__props.icon) _push(`<span class="${ssrRenderClass([__props.icon, "option-icon"])}" aria-hidden="true" data-v-92ecaa7c></span>`);
				else _push(`<!---->`);
				if (__props.button) _push(`<span data-v-92ecaa7c>${__props.button ?? ""}</span>`);
				else _push(`<!---->`);
				_push(`<span class="vpi-chevron-down text-icon" aria-hidden="true" data-v-92ecaa7c></span></span>`);
			} else _push(`<span class="vpi-more-horizontal icon" aria-hidden="true" data-v-92ecaa7c></span>`);
			_push(`</button><div class="menu"${ssrRenderAttr("id", unref(menuId))} data-v-92ecaa7c>`);
			_push(ssrRenderComponent(VPMenu_default, { items: __props.items }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$42 = _sfc_main$31.setup;
_sfc_main$31.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPFlyout.vue");
	return _sfc_setup$42 ? _sfc_setup$42(props, ctx) : void 0;
};
var VPFlyout_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$31, [["__scopeId", "data-v-92ecaa7c"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavTranslations.vue
var _sfc_main$30 = {
	__name: "VPNavTranslations",
	__ssrInlineRender: true,
	props: {
		screen: {
			type: Boolean,
			required: false
		},
		menu: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { theme } = useData();
		const { localeLinks, currentLang } = useLangs({ linkToCorrespondingPage: true });
		const show = computed(() => !!(localeLinks.value.length && currentLang.value.label));
		const overflow = props.screen || props.menu ? null : useNavOverflow();
		const isCollapsed = computed(() => !!overflow && !overflow.state.translations);
		const isOpen = ref(false);
		const listId = useId();
		const localeProps = (locale) => ({
			lang: locale.lang,
			hreflang: locale.lang,
			rel: "alternate",
			dir: locale.dir,
			"data-allow-mismatch": "attribute"
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.screen && show.value) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPNavTranslations VPNavScreenTranslations", { open: isOpen.value }] }, _attrs))} data-v-ef80053b><button type="button" class="title"${ssrRenderAttr("aria-expanded", isOpen.value)}${ssrRenderAttr("aria-controls", unref(listId))} data-v-ef80053b><span class="vpi-languages icon lang" aria-hidden="true" data-v-ef80053b></span> ${ssrInterpolate(unref(currentLang).label)} <span class="vpi-chevron-down icon chevron" aria-hidden="true" data-v-ef80053b></span></button><ul${ssrRenderAttr("id", unref(listId))} class="list" style="${ssrRenderStyle(isOpen.value ? null : { display: "none" })}" data-v-ef80053b><!--[-->`);
				ssrRenderList(unref(localeLinks), (locale) => {
					_push(`<li class="item" data-v-ef80053b>`);
					_push(ssrRenderComponent(_sfc_main$54, mergeProps({
						class: "link",
						href: locale.link,
						external: false
					}, { ref_for: true }, localeProps(locale)), {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(locale.text)}`);
							else return [createTextVNode(toDisplayString(locale.text), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</li>`);
				});
				_push(`<!--]--></ul></div>`);
			} else if (__props.menu && show.value) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavTranslations group translations" }, _attrs))} data-v-ef80053b><p class="title" data-v-ef80053b>${ssrInterpolate(unref(currentLang).label)}</p><ul data-v-ef80053b><!--[-->`);
				ssrRenderList(unref(localeLinks), (locale) => {
					_push(ssrRenderComponent(VPMenuLink_default, mergeProps({
						item: locale,
						external: false
					}, { ref_for: true }, localeProps(locale)), null, _parent));
				});
				_push(`<!--]--></ul></div>`);
			} else if (!__props.menu && show.value) _push(ssrRenderComponent(VPFlyout_default, mergeProps({
				class: ["VPNavTranslations VPNavBarTranslations", { collapsed: isCollapsed.value }],
				icon: "vpi-languages",
				label: unref(theme).langMenuLabel || "Change language",
				ref: (inst) => unref(overflow)?.setClusterEl("translations", inst?.$el ?? null)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<p class="title" data-v-ef80053b${_scopeId}>${ssrInterpolate(unref(currentLang).label)}</p><ul class="items" data-v-ef80053b${_scopeId}><!--[-->`);
						ssrRenderList(unref(localeLinks), (locale) => {
							_push(ssrRenderComponent(VPMenuLink_default, mergeProps({
								item: locale,
								external: false
							}, { ref_for: true }, localeProps(locale)), null, _parent, _scopeId));
						});
						_push(`<!--]--></ul>`);
					} else return [createVNode("p", { class: "title" }, toDisplayString(unref(currentLang).label), 1), createVNode("ul", { class: "items" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(localeLinks), (locale) => {
						return openBlock(), createBlock(VPMenuLink_default, mergeProps({
							key: locale.link,
							item: locale,
							external: false
						}, { ref_for: true }, localeProps(locale)), null, 16, ["item"]);
					}), 128))])];
				}),
				_: 1
			}, _parent));
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$41 = _sfc_main$30.setup;
_sfc_main$30.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavTranslations.vue");
	return _sfc_setup$41 ? _sfc_setup$41(props, ctx) : void 0;
};
var VPNavTranslations_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$30, [["__scopeId", "data-v-ef80053b"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPIcon.vue
var _sfc_main$29 = {
	__name: "VPIcon",
	__ssrInlineRender: true,
	props: { icon: {
		type: [String, Object],
		required: true
	} },
	setup(__props) {
		const props = __props;
		const el = useTemplateRef("el");
		const iconClass = useIcon(() => props.icon, el);
		return (_ctx, _push, _parent, _attrs) => {
			if (typeof __props.icon === "object") _push(`<span${ssrRenderAttrs(mergeProps({ class: "VPIcon" }, _attrs))} data-v-ac9da605>${__props.icon.svg ?? ""}</span>`);
			else _push(`<span${ssrRenderAttrs(mergeProps({
				ref_key: "el",
				ref: el,
				class: unref(iconClass)
			}, _attrs))} data-v-ac9da605></span>`);
		};
	}
};
var _sfc_setup$40 = _sfc_main$29.setup;
_sfc_main$29.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPIcon.vue");
	return _sfc_setup$40 ? _sfc_setup$40(props, ctx) : void 0;
};
var VPIcon_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$29, [["__scopeId", "data-v-ac9da605"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPSocialLink.vue
var _sfc_main$28 = {
	__name: "VPSocialLink",
	__ssrInlineRender: true,
	props: {
		icon: {
			type: [String, Object],
			required: true
		},
		link: {
			type: String,
			required: true
		},
		ariaLabel: {
			type: String,
			required: false
		},
		target: {
			type: String,
			required: false
		},
		me: {
			type: Boolean,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const qualifiedIcon = computed(() => typeof props.icon === "string" && !props.icon.includes(":") ? `simple-icons:${props.icon}` : props.icon);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<a${ssrRenderAttrs(mergeProps({
				class: "VPSocialLink no-icon",
				href: __props.link,
				"aria-label": __props.ariaLabel ?? (typeof __props.icon === "string" ? __props.icon : ""),
				target: __props.target ?? (unref(isExternal)(__props.link) ? "_blank" : void 0),
				rel: __props.me ? "me noopener" : "noopener"
			}, _attrs))} data-v-75f3ae3a>`);
			_push(ssrRenderComponent(VPIcon_default, { icon: qualifiedIcon.value }, null, _parent));
			_push(`</a>`);
		};
	}
};
var _sfc_setup$39 = _sfc_main$28.setup;
_sfc_main$28.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSocialLink.vue");
	return _sfc_setup$39 ? _sfc_setup$39(props, ctx) : void 0;
};
var VPSocialLink_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$28, [["__scopeId", "data-v-75f3ae3a"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPSocialLinks.vue
var _sfc_main$27 = {
	__name: "VPSocialLinks",
	__ssrInlineRender: true,
	props: {
		links: {
			type: Array,
			required: true
		},
		me: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<ul${ssrRenderAttrs(mergeProps({ class: "VPSocialLinks" }, _attrs))} data-v-bf5b9ad4><!--[-->`);
			ssrRenderList(__props.links, ({ link, icon, ariaLabel, target }) => {
				_push(`<li data-v-bf5b9ad4>`);
				_push(ssrRenderComponent(VPSocialLink_default, {
					icon,
					link,
					ariaLabel,
					target,
					me: __props.me
				}, null, _parent));
				_push(`</li>`);
			});
			_push(`<!--]--></ul>`);
		};
	}
};
var _sfc_setup$38 = _sfc_main$27.setup;
_sfc_main$27.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSocialLinks.vue");
	return _sfc_setup$38 ? _sfc_setup$38(props, ctx) : void 0;
};
var VPSocialLinks_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$27, [["__scopeId", "data-v-bf5b9ad4"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavBarExtra.vue
var _sfc_main$26 = {
	__name: "VPNavBarExtra",
	__ssrInlineRender: true,
	setup(__props) {
		const { theme } = useData();
		const { localeLinks, currentLang } = useLangs({ linkToCorrespondingPage: true });
		const hasAppearanceSwitch = useAppearanceSwitch();
		const overflow = useNavOverflow();
		const overflowItems = computed(() => {
			const count = overflow?.state.visibleItemCount ?? Infinity;
			if (count === Infinity || !theme.value.nav) return [];
			return theme.value.nav.slice(count);
		});
		const showTranslations = computed(() => !!(localeLinks.value.length && currentLang.value.label) && !(overflow?.state.translations ?? true));
		const showAppearance = computed(() => hasAppearanceSwitch.value && !(overflow?.state.appearance ?? true));
		const showSocialLinks = computed(() => !!theme.value.socialLinks && !(overflow?.state.socialLinks ?? true));
		const hasContent = computed(() => overflowItems.value.length > 0 || showTranslations.value || showAppearance.value || showSocialLinks.value);
		return (_ctx, _push, _parent, _attrs) => {
			if (hasContent.value) _push(ssrRenderComponent(VPFlyout_default, mergeProps({
				class: "VPNavBarExtra",
				label: unref(theme).extraMenuLabel || "More options",
				ref: (inst) => unref(overflow)?.setExtraEl(inst?.$el ?? null)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (overflowItems.value.length) {
							_push(`<ul class="group overflow-items" data-v-c193803d${_scopeId}><!--[-->`);
							ssrRenderList(overflowItems.value, (item) => {
								_push(`<!--[-->`);
								if ("link" in item) _push(ssrRenderComponent(VPMenuLink_default, { item }, null, _parent, _scopeId));
								else if ("component" in item) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, { menu: "" }), null), _parent, _scopeId);
								else _push(ssrRenderComponent(VPMenuGroup_default, {
									text: item.text,
									items: item.items
								}, null, _parent, _scopeId));
								_push(`<!--]-->`);
							});
							_push(`<!--]--></ul>`);
						} else _push(`<!---->`);
						if (showTranslations.value) _push(ssrRenderComponent(VPNavTranslations_default, { menu: "" }, null, _parent, _scopeId));
						else _push(`<!---->`);
						if (showAppearance.value) {
							_push(`<div class="group" data-v-c193803d${_scopeId}>`);
							_push(ssrRenderComponent(VPNavAppearance_default, { row: "" }, null, _parent, _scopeId));
							_push(`</div>`);
						} else _push(`<!---->`);
						if (showSocialLinks.value) {
							_push(`<div class="group" data-v-c193803d${_scopeId}><div class="item social-links" data-v-c193803d${_scopeId}>`);
							_push(ssrRenderComponent(VPSocialLinks_default, {
								class: "social-links-list",
								links: unref(theme).socialLinks
							}, null, _parent, _scopeId));
							_push(`</div></div>`);
						} else _push(`<!---->`);
					} else return [
						overflowItems.value.length ? (openBlock(), createBlock("ul", {
							key: 0,
							class: "group overflow-items"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(overflowItems.value, (item) => {
							return openBlock(), createBlock(Fragment, { key: JSON.stringify(item) }, ["link" in item ? (openBlock(), createBlock(VPMenuLink_default, {
								key: 0,
								item
							}, null, 8, ["item"])) : "component" in item ? (openBlock(), createBlock(resolveDynamicComponent(item.component), mergeProps({
								key: 1,
								ref_for: true
							}, item.props, { menu: "" }), null, 16)) : (openBlock(), createBlock(VPMenuGroup_default, {
								key: 2,
								text: item.text,
								items: item.items
							}, null, 8, ["text", "items"]))], 64);
						}), 128))])) : createCommentVNode("", true),
						showTranslations.value ? (openBlock(), createBlock(VPNavTranslations_default, {
							key: 1,
							menu: ""
						})) : createCommentVNode("", true),
						showAppearance.value ? (openBlock(), createBlock("div", {
							key: 2,
							class: "group"
						}, [createVNode(VPNavAppearance_default, { row: "" })])) : createCommentVNode("", true),
						showSocialLinks.value ? (openBlock(), createBlock("div", {
							key: 3,
							class: "group"
						}, [createVNode("div", { class: "item social-links" }, [createVNode(VPSocialLinks_default, {
							class: "social-links-list",
							links: unref(theme).socialLinks
						}, null, 8, ["links"])])])) : createCommentVNode("", true)
					];
				}),
				_: 1
			}, _parent));
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$37 = _sfc_main$26.setup;
_sfc_main$26.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarExtra.vue");
	return _sfc_setup$37 ? _sfc_setup$37(props, ctx) : void 0;
};
var VPNavBarExtra_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$26, [["__scopeId", "data-v-c193803d"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavBarHamburger.vue
var _sfc_main$25 = {
	__name: "VPNavBarHamburger",
	__ssrInlineRender: true,
	props: { active: {
		type: Boolean,
		required: true
	} },
	emits: ["click"],
	setup(__props) {
		const { theme } = useData();
		const el = useTemplateRef("el");
		const { screenTriggerEl } = useNav();
		watchEffect(() => {
			screenTriggerEl.value = el.value;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<button${ssrRenderAttrs(mergeProps({
				ref_key: "el",
				ref: el,
				type: "button",
				class: ["VPNavBarHamburger", { active: __props.active }],
				"aria-label": unref(theme).mobileMenuLabel || "Menu",
				"aria-expanded": __props.active
			}, _attrs))} data-v-f895b5e0><span class="container" aria-hidden="true" data-v-f895b5e0><span class="top" data-v-f895b5e0></span><span class="middle" data-v-f895b5e0></span><span class="bottom" data-v-f895b5e0></span></span></button>`);
		};
	}
};
var _sfc_setup$36 = _sfc_main$25.setup;
_sfc_main$25.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarHamburger.vue");
	return _sfc_setup$36 ? _sfc_setup$36(props, ctx) : void 0;
};
var VPNavBarHamburger_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$25, [["__scopeId", "data-v-f895b5e0"]]);
// node_modules/vitepress/dist/client/theme-default/support/docsearch.js
/**
* Resolves the effective mode based on config and available features.
*
* - 'auto': infer hybrid vs sidePanel-only from provided config
* - 'sidePanel': force sidePanel-only even if keyword search is configured
* - 'hybrid': force hybrid (error if keyword search is not configured)
* - 'modal': force modal even if sidePanel is configured
*/
function resolveMode(options) {
	const mode = options.mode ?? "auto";
	const hasKeyword = hasKeywordSearch(options);
	const askAi = options.askAi;
	const hasSidePanelConfig = Boolean(askAi && typeof askAi === "object" && askAi.sidePanel);
	switch (mode) {
		case "sidePanel": return {
			mode,
			showKeywordSearch: false,
			useSidePanel: true
		};
		case "hybrid":
			if (!hasKeyword) console.error("[vitepress] mode: \"hybrid\" requires keyword search credentials (appId, apiKey, indexName).");
			return {
				mode,
				showKeywordSearch: hasKeyword,
				useSidePanel: true
			};
		case "modal": return {
			mode,
			showKeywordSearch: hasKeyword,
			useSidePanel: false
		};
		default: return {
			mode: "auto",
			showKeywordSearch: hasKeyword,
			useSidePanel: hasSidePanelConfig
		};
	}
}
function hasKeywordSearch(options) {
	return Boolean(options.appId && options.apiKey && options.indexName);
}
/**
* Removes existing `lang:` filters and appends `lang:${lang}`.
* Handles both flat arrays and nested arrays (for OR conditions).
*/
function mergeLangFacetFilters(rawFacetFilters, lang) {
	return [...(Array.isArray(rawFacetFilters) ? rawFacetFilters : rawFacetFilters ? [rawFacetFilters] : []).map((filter) => {
		if (Array.isArray(filter)) return filter.filter((f) => typeof f === "string" && !f.startsWith("lang:"));
		return filter;
	}).filter((filter) => {
		if (typeof filter === "string") return !filter.startsWith("lang:");
		return Array.isArray(filter) && filter.length > 0;
	}), `lang:${lang}`];
}
/**
* Builds Ask AI configuration from various input formats.
*/
function buildAskAiConfig(askAiProp, options, lang) {
	const isAskAiString = typeof askAiProp === "string";
	const askAiSearchParameters = !isAskAiString && askAiProp.searchParameters ? { ...askAiProp.searchParameters } : void 0;
	const isAgentStudio = !isAskAiString && askAiProp.agentStudio === true;
	const askAiFacetFilters = mergeLangFacetFilters(askAiSearchParameters?.facetFilters ?? options.searchParameters?.facetFilters, lang);
	const mergedAskAiSearchParameters = isAgentStudio ? askAiSearchParameters : {
		...askAiSearchParameters,
		facetFilters: askAiFacetFilters.length ? askAiFacetFilters : void 0
	};
	const result = {
		...isAskAiString ? {} : askAiProp,
		indexName: isAskAiString ? options.indexName : askAiProp.indexName,
		apiKey: isAskAiString ? options.apiKey : askAiProp.apiKey,
		appId: isAskAiString ? options.appId : askAiProp.appId,
		assistantId: isAskAiString ? askAiProp : askAiProp.assistantId
	};
	if (mergedAskAiSearchParameters && Object.values(mergedAskAiSearchParameters).some((v) => v != null)) result.searchParameters = mergedAskAiSearchParameters;
	return result;
}
/**
* Resolves Algolia search options for the given language,
* merging in locale-specific overrides and language facet filters.
*/
function resolveOptionsForLanguage(options, localeIndex, lang) {
	options = deepMerge(options, options.locales?.[localeIndex] || {});
	const facetFilters = mergeLangFacetFilters(options.searchParameters?.facetFilters, lang);
	const askAi = options.askAi ? buildAskAiConfig(options.askAi, options, lang) : void 0;
	return {
		...options,
		searchParameters: {
			...options.searchParameters,
			facetFilters
		},
		askAi
	};
}
function deepMerge(target, source) {
	const result = { ...target };
	for (const key in source) {
		const value = source[key];
		if (value === void 0) continue;
		if (key === "searchParameters") {
			result[key] = value;
			continue;
		}
		if (isObject(value) && isObject(result[key])) result[key] = deepMerge(result[key], value);
		else result[key] = value;
	}
	delete result.locales;
	return result;
}
// node_modules/vitepress/dist/client/theme-default/support/reactivity.js
function smartComputed(getter, comparator = (newValue, oldValue) => JSON.stringify(newValue) === JSON.stringify(oldValue)) {
	return computed((oldValue) => {
		const newValue = getter();
		return oldValue === void 0 || !comparator(newValue, oldValue) ? newValue : oldValue;
	});
}
// node_modules/vitepress/dist/client/theme-default/components/VPNavBarAskAiButton.vue
var _sfc_main$24 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	_push(`<button${ssrRenderAttrs(mergeProps({
		type: "button",
		class: "VPNavBarAskAiButton"
	}, _attrs))} data-v-6679af46><span class="vpi-sparkles" aria-hidden="true" data-v-6679af46></span></button>`);
}
var _sfc_setup$35 = _sfc_main$24.setup;
_sfc_main$24.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarAskAiButton.vue");
	return _sfc_setup$35 ? _sfc_setup$35(props, ctx) : void 0;
};
var VPNavBarAskAiButton_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$24, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-6679af46"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearchButton.vue
var _sfc_main$23 = {
	__name: "VPNavBarSearchButton",
	__ssrInlineRender: true,
	props: { text: {
		type: String,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<button${ssrRenderAttrs(mergeProps({
				type: "button",
				class: "VPNavBarSearchButton"
			}, _attrs))} data-v-573637dc><span class="vpi-search" aria-hidden="true" data-v-573637dc></span><span class="text" data-v-573637dc>${ssrInterpolate(__props.text)}</span><span class="keys" aria-hidden="true" data-v-573637dc><kbd class="key-mod" data-v-573637dc></kbd><kbd class="key-k" data-v-573637dc></kbd></span></button>`);
		};
	}
};
var _sfc_setup$34 = _sfc_main$23.setup;
_sfc_main$23.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearchButton.vue");
	return _sfc_setup$34 ? _sfc_setup$34(props, ctx) : void 0;
};
var VPNavBarSearchButton_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$23, [["__scopeId", "data-v-573637dc"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearch.vue
var _sfc_main$22 = {
	__name: "VPNavBarSearch",
	__ssrInlineRender: true,
	setup(__props) {
		const VPLocalSearchBox = defineAsyncComponent(() => import("./VPLocalSearchBox.CWuxS2xz.js"));
		const VPAlgoliaSearchBox = () => null;
		const { theme, localeIndex, lang } = useData();
		const provider = "local";
		const algoliaOptions = smartComputed(() => {
			return resolveOptionsForLanguage(theme.value.search?.options || {}, localeIndex.value, lang.value);
		});
		const resolvedMode = computed(() => resolveMode(algoliaOptions.value));
		const askAiSidePanelConfig = computed(() => {
			if (!resolvedMode.value.useSidePanel) return null;
			const askAi = algoliaOptions.value.askAi;
			if (!askAi || typeof askAi === "string") return null;
			if (!askAi.sidePanel) return null;
			return askAi.sidePanel === true ? {} : askAi.sidePanel;
		});
		const askAiShortcutEnabled = computed(() => {
			return askAiSidePanelConfig.value?.keyboardShortcuts?.["Ctrl/Cmd+I"] !== false;
		});
		const openRequest = ref(null);
		let openNonce = 0;
		const loaded = ref(false);
		const actuallyLoaded = ref(false);
		onMounted(() => {});
		function loadAndOpen(target) {
			if (!loaded.value) loaded.value = true;
			openRequest.value = {
				target,
				nonce: ++openNonce
			};
		}
		const showSearch = ref(false);
		onKeyStroke("k", (event) => {
			if (event.ctrlKey || event.metaKey) {
				event.preventDefault();
				showSearch.value = true;
			}
		});
		onKeyStroke("/", (event) => {
			if (!isEditingContent(event)) {
				event.preventDefault();
				showSearch.value = true;
			}
		});
		function isEditingContent(event) {
			const element = event.target;
			const tagName = element.tagName;
			return element.isContentEditable || tagName === "INPUT" || tagName === "SELECT" || tagName === "TEXTAREA";
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavBarSearch" }, _attrs))} data-v-b09c5db8>`);
			if (unref(provider) === "algolia") {
				_push(`<!--[-->`);
				if (resolvedMode.value.showKeywordSearch) _push(ssrRenderComponent(VPNavBarSearchButton_default, {
					text: unref(algoliaOptions).translations?.button?.buttonText || "Search",
					"aria-label": unref(algoliaOptions).translations?.button?.buttonAriaLabel || "Search",
					"aria-keyshortcuts": "/ control+k meta+k",
					onClick: ($event) => loadAndOpen("search")
				}, null, _parent));
				else _push(`<!---->`);
				if (askAiSidePanelConfig.value) _push(ssrRenderComponent(VPNavBarAskAiButton_default, {
					"aria-label": askAiSidePanelConfig.value.button?.translations?.buttonAriaLabel || "Ask AI",
					"aria-keyshortcuts": askAiShortcutEnabled.value ? "control+i meta+i" : void 0,
					onClick: ($event) => actuallyLoaded.value ? loadAndOpen("toggleAskAi") : loadAndOpen("askAi")
				}, null, _parent));
				else _push(`<!---->`);
				if (loaded.value) _push(ssrRenderComponent(unref(VPAlgoliaSearchBox), {
					"algolia-options": unref(algoliaOptions),
					"open-request": openRequest.value,
					onVnodeBeforeMount: ($event) => actuallyLoaded.value = true
				}, null, _parent));
				else _push(`<!---->`);
				_push(`<!--]-->`);
			} else if (unref(provider) === "local") {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(VPNavBarSearchButton_default, {
					text: unref(algoliaOptions).translations?.button?.buttonText || "Search",
					"aria-label": unref(algoliaOptions).translations?.button?.buttonAriaLabel || "Search",
					"aria-keyshortcuts": "/ control+k meta+k",
					onClick: ($event) => showSearch.value = true
				}, null, _parent));
				if (showSearch.value) _push(ssrRenderComponent(unref(VPLocalSearchBox), { onClose: ($event) => showSearch.value = false }, null, _parent));
				else _push(`<!---->`);
				_push(`<!--]-->`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$33 = _sfc_main$22.setup;
_sfc_main$22.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearch.vue");
	return _sfc_setup$33 ? _sfc_setup$33(props, ctx) : void 0;
};
var VPNavBarSearch_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$22, [["__scopeId", "data-v-b09c5db8"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavBarTitle.vue
var _sfc_main$21 = {
	__name: "VPNavBarTitle",
	__ssrInlineRender: true,
	setup(__props) {
		const { site, theme } = useData();
		const { hasSidebar } = useLayout();
		const { currentLang } = useLangs();
		const link = computed(() => typeof theme.value.logoLink === "string" ? theme.value.logoLink : theme.value.logoLink?.link);
		const rel = computed(() => typeof theme.value.logoLink === "string" ? void 0 : theme.value.logoLink?.rel);
		const target = computed(() => typeof theme.value.logoLink === "string" ? void 0 : theme.value.logoLink?.target);
		const textTitle = computed(() => {
			if (theme.value.siteTitle === false) return void 0;
			return (theme.value.siteTitle ?? site.value.title).replace(/<[^>]+>/g, "").trim() || void 0;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPNavBarTitle", { "has-sidebar": unref(hasSidebar) }] }, _attrs))} data-v-3cb61e0b><a class="title"${ssrRenderAttr("href", link.value ?? unref(normalizeLink$1)(unref(currentLang).link))}${ssrRenderAttr("rel", rel.value)}${ssrRenderAttr("target", target.value)}${ssrRenderAttr("title", textTitle.value)} data-v-3cb61e0b>`);
			ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push, _parent);
			if (unref(theme).logo) _push(ssrRenderComponent(VPImage_default, {
				class: "logo",
				image: unref(theme).logo
			}, null, _parent));
			else _push(`<!---->`);
			if (unref(theme).siteTitle) _push(`<span data-v-3cb61e0b>${unref(theme).siteTitle ?? ""}</span>`);
			else if (unref(theme).siteTitle === void 0) _push(`<span data-v-3cb61e0b>${ssrInterpolate(unref(site).title)}</span>`);
			else _push(`<!---->`);
			ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push, _parent);
			_push(`</a></div>`);
		};
	}
};
var _sfc_setup$32 = _sfc_main$21.setup;
_sfc_main$21.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarTitle.vue");
	return _sfc_setup$32 ? _sfc_setup$32(props, ctx) : void 0;
};
var VPNavBarTitle_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$21, [["__scopeId", "data-v-3cb61e0b"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavMenuGroup.vue
var _sfc_main$20 = {
	__name: "VPNavMenuGroup",
	__ssrInlineRender: true,
	props: {
		item: {
			type: Object,
			required: true
		},
		screen: {
			type: Boolean,
			required: false
		},
		menu: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const route = useRoute();
		const isActiveGroup = computed(() => {
			if (props.item.activeMatch) return isActive(route.data.relativePath, route.hash, props.item.activeMatch, true);
			return isChildActive(props.item);
		});
		function isChildActive(navItem) {
			if ("component" in navItem) return false;
			if ("link" in navItem) {
				const href = typeof navItem.link === "function" ? navItem.link(route.data) : navItem.link;
				return isActive(route.data.relativePath, route.hash, navItem.activeMatch || href, !!navItem.activeMatch);
			}
			return navItem.items.some(isChildActive);
		}
		const isOpen = ref(false);
		const groupId = useId();
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.menu) _push(ssrRenderComponent(VPMenuGroup_default, mergeProps({
				class: "VPNavMenuGroup",
				text: __props.item.text,
				items: __props.item.items
			}, _attrs), null, _parent));
			else if (!__props.screen) _push(ssrRenderComponent(VPFlyout_default, mergeProps({
				class: {
					VPNavMenuGroup: true,
					VPNavBarMenuGroup: true,
					active: isActiveGroup.value
				},
				button: __props.item.text,
				items: __props.item.items
			}, _attrs), null, _parent));
			else {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPNavMenuGroup VPNavScreenMenuGroup", {
					open: isOpen.value,
					active: isActiveGroup.value
				}] }, _attrs))} data-v-feb345c7><button type="button" class="button"${ssrRenderAttr("aria-expanded", isOpen.value)}${ssrRenderAttr("aria-controls", unref(groupId))} data-v-feb345c7><span class="button-text" data-v-feb345c7>${__props.item.text ?? ""}</span><span class="vpi-plus button-icon" aria-hidden="true" data-v-feb345c7></span></button><ul${ssrRenderAttr("id", unref(groupId))} class="items" style="${ssrRenderStyle(isOpen.value ? null : { display: "none" })}" data-v-feb345c7><!--[-->`);
				ssrRenderList(__props.item.items, (child) => {
					_push(`<!--[-->`);
					if ("link" in child) _push(ssrRenderComponent(VPMenuLink_default, { item: child }, null, _parent));
					else if ("component" in child) {
						_push(`<li data-v-feb345c7>`);
						ssrRenderVNode(_push, createVNode(resolveDynamicComponent(child.component), mergeProps({ ref_for: true }, child.props, { "screen-menu": "" }), null), _parent);
						_push(`</li>`);
					} else _push(ssrRenderComponent(VPMenuGroup_default, {
						text: child.text,
						items: child.items
					}, null, _parent));
					_push(`<!--]-->`);
				});
				_push(`<!--]--></ul></div>`);
			}
		};
	}
};
var _sfc_setup$31 = _sfc_main$20.setup;
_sfc_main$20.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavMenuGroup.vue");
	return _sfc_setup$31 ? _sfc_setup$31(props, ctx) : void 0;
};
var VPNavMenuGroup_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$20, [["__scopeId", "data-v-feb345c7"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavMenuLink.vue
var _sfc_main$19 = {
	__name: "VPNavMenuLink",
	__ssrInlineRender: true,
	props: {
		item: {
			type: Object,
			required: true
		},
		screen: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { href, isActiveLink, isCurrentLink } = useNavItemLink(() => props.item);
		const nav = inject(navInjectionKey, null);
		function onClick() {
			if (props.screen) nav?.closeScreen();
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$54, mergeProps({
				class: ["VPNavMenuLink", {
					VPNavBarMenuLink: !__props.screen,
					VPNavScreenMenuLink: __props.screen,
					active: unref(isActiveLink)
				}],
				"aria-current": unref(isCurrentLink) ? "page" : void 0,
				href: unref(href),
				target: __props.item.target,
				rel: __props.item.rel,
				"no-icon": __props.item.noIcon,
				onClick
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span data-v-60fe87c8${_scopeId}>${__props.item.text ?? ""}</span>`);
					else return [createVNode("span", { innerHTML: __props.item.text }, null, 8, ["innerHTML"])];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$30 = _sfc_main$19.setup;
_sfc_main$19.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavMenuLink.vue");
	return _sfc_setup$30 ? _sfc_setup$30(props, ctx) : void 0;
};
var VPNavMenuLink_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$19, [["__scopeId", "data-v-60fe87c8"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavMenu.vue
var _sfc_main$18 = {
	__name: "VPNavMenu",
	__ssrInlineRender: true,
	props: { screen: {
		type: Boolean,
		required: false
	} },
	setup(__props) {
		const props = __props;
		const { theme } = useData();
		const overflow = props.screen ? null : useNavOverflow();
		function isVisible(index) {
			return !overflow || index < overflow.state.visibleItemCount;
		}
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(theme).nav) {
				_push(`<nav${ssrRenderAttrs(mergeProps({
					"aria-label": unref(theme).navMenuLabel || "Main Navigation",
					class: ["VPNavMenu", __props.screen ? "VPNavScreenMenu" : "VPNavBarMenu"],
					ref: (el) => unref(overflow)?.setMenuEl(el)
				}, _attrs))} data-v-0474edcd><ul class="list" data-v-0474edcd><!--[-->`);
				ssrRenderList(unref(theme).nav, (item, index) => {
					_push(`<li class="${ssrRenderClass({ collapsed: !isVisible(index) })}" data-v-0474edcd>`);
					if ("link" in item) _push(ssrRenderComponent(VPNavMenuLink_default, {
						item,
						screen: __props.screen
					}, null, _parent));
					else if ("component" in item) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, { "screen-menu": __props.screen || void 0 }), null), _parent);
					else _push(ssrRenderComponent(VPNavMenuGroup_default, {
						item,
						screen: __props.screen
					}, null, _parent));
					_push(`</li>`);
				});
				_push(`<!--]--></ul></nav>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$29 = _sfc_main$18.setup;
_sfc_main$18.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavMenu.vue");
	return _sfc_setup$29 ? _sfc_setup$29(props, ctx) : void 0;
};
var VPNavMenu_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$18, [["__scopeId", "data-v-0474edcd"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavSocialLinks.vue
var _sfc_main$17 = {
	__name: "VPNavSocialLinks",
	__ssrInlineRender: true,
	props: { screen: {
		type: Boolean,
		required: false
	} },
	setup(__props) {
		const props = __props;
		const { theme } = useData();
		const overflow = props.screen ? null : useNavOverflow();
		const isCollapsed = computed(() => !!overflow && !overflow.state.socialLinks);
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(theme).socialLinks) _push(ssrRenderComponent(VPSocialLinks_default, mergeProps({
				class: ["VPNavSocialLinks", [__props.screen ? "VPNavScreenSocialLinks" : "VPNavBarSocialLinks", { collapsed: isCollapsed.value }]],
				links: unref(theme).socialLinks,
				ref: (inst) => unref(overflow)?.setClusterEl("socialLinks", inst?.$el ?? null)
			}, _attrs), null, _parent));
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$28 = _sfc_main$17.setup;
_sfc_main$17.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavSocialLinks.vue");
	return _sfc_setup$28 ? _sfc_setup$28(props, ctx) : void 0;
};
var VPNavSocialLinks_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$17, [["__scopeId", "data-v-b82bf4eb"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavBar.vue
var _sfc_main$16 = {
	__name: "VPNavBar",
	__ssrInlineRender: true,
	props: { isScreenOpen: {
		type: Boolean,
		required: true
	} },
	emits: ["toggle-screen"],
	setup(__props) {
		const { theme } = useData();
		const { isHome, hasSidebar, hasLocalNav } = useLayout();
		const { y } = useWindowScroll();
		const isTop = computed(() => y.value <= 0);
		provideNavOverflow({ itemsKey: () => JSON.stringify(theme.value.nav ?? null) });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPNavBar", {
				"has-sidebar": unref(hasSidebar),
				"has-local-nav": !unref(isHome) && unref(hasLocalNav),
				"home": unref(isHome),
				"top": isTop.value,
				"screen-open": __props.isScreenOpen
			}] }, _attrs))} data-v-dac69e74><div class="wrapper" data-v-dac69e74><div class="container" data-v-dac69e74><div class="title" data-v-dac69e74>`);
			_push(ssrRenderComponent(VPNavBarTitle_default, null, {
				"nav-bar-title-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "nav-bar-title-before", {}, void 0, true)];
				}),
				"nav-bar-title-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "nav-bar-title-after", {}, void 0, true)];
				}),
				_: 3
			}, _parent));
			_push(`</div><div class="content" data-v-dac69e74><div class="content-body" data-v-dac69e74>`);
			ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push, _parent);
			_push(ssrRenderComponent(VPNavBarSearch_default, { class: "search" }, null, _parent));
			_push(ssrRenderComponent(VPNavMenu_default, { class: "menu" }, null, _parent));
			_push(ssrRenderComponent(VPNavTranslations_default, { class: "translations" }, null, _parent));
			_push(ssrRenderComponent(VPNavAppearance_default, { class: "appearance" }, null, _parent));
			_push(ssrRenderComponent(VPNavSocialLinks_default, { class: "social-links" }, null, _parent));
			_push(ssrRenderComponent(VPNavBarExtra_default, { class: "extra" }, null, _parent));
			ssrRenderSlot(_ctx.$slots, "nav-bar-content-after", {}, null, _push, _parent);
			_push(ssrRenderComponent(VPNavBarHamburger_default, {
				class: "hamburger",
				active: __props.isScreenOpen,
				onClick: ($event) => _ctx.$emit("toggle-screen")
			}, null, _parent));
			_push(`</div></div></div></div><div class="divider" data-v-dac69e74><div class="divider-line" data-v-dac69e74></div></div></div>`);
		};
	}
};
var _sfc_setup$27 = _sfc_main$16.setup;
_sfc_main$16.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBar.vue");
	return _sfc_setup$27 ? _sfc_setup$27(props, ctx) : void 0;
};
var VPNavBar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$16, [["__scopeId", "data-v-dac69e74"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNavScreen.vue
var _sfc_main$15 = {
	__name: "VPNavScreen",
	__ssrInlineRender: true,
	props: { open: {
		type: Boolean,
		required: true
	} },
	setup(__props) {
		const props = __props;
		useBodyScrollLock();
		provide(navScreenInjectionKey, true);
		const { closeScreen, screenTriggerEl } = useNav();
		onKeyStroke("Escape", () => {
			if (!props.open) return;
			closeScreen();
			screenTriggerEl.value?.focus();
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.open) {
				_push(`<div${ssrRenderAttrs(mergeProps({
					class: "VPNavScreen",
					id: "VPNavScreen"
				}, _attrs))} data-v-be8a6ff8><div class="container" data-v-be8a6ff8>`);
				ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push, _parent);
				_push(ssrRenderComponent(VPNavMenu_default, {
					screen: "",
					class: "menu"
				}, null, _parent));
				_push(ssrRenderComponent(VPNavTranslations_default, {
					screen: "",
					class: "translations"
				}, null, _parent));
				_push(ssrRenderComponent(VPNavAppearance_default, {
					row: "",
					screen: "",
					class: "appearance"
				}, null, _parent));
				_push(ssrRenderComponent(VPNavSocialLinks_default, {
					screen: "",
					class: "social-links"
				}, null, _parent));
				ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push, _parent);
				_push(`</div></div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$26 = _sfc_main$15.setup;
_sfc_main$15.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavScreen.vue");
	return _sfc_setup$26 ? _sfc_setup$26(props, ctx) : void 0;
};
var VPNavScreen_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$15, [["__scopeId", "data-v-be8a6ff8"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPNav.vue
var _sfc_main$14 = {
	__name: "VPNav",
	__ssrInlineRender: true,
	setup(__props) {
		const { isScreenOpen, closeScreen, toggleScreen } = useNav();
		const { frontmatter } = useData();
		const hasNavbar = computed(() => {
			return frontmatter.value.navbar !== false;
		});
		provide(navInjectionKey, { closeScreen });
		watchEffect(() => {
			if (inBrowser) document.documentElement.classList.toggle("hide-nav", !hasNavbar.value);
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (hasNavbar.value) {
				_push(`<header${ssrRenderAttrs(mergeProps({ class: "VPNav" }, _attrs))} data-v-f733e610>`);
				_push(ssrRenderComponent(VPNavBar_default, {
					"is-screen-open": unref(isScreenOpen),
					onToggleScreen: unref(toggleScreen)
				}, {
					"nav-bar-title-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-title-before", {}, void 0, true)];
					}),
					"nav-bar-title-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-title-after", {}, void 0, true)];
					}),
					"nav-bar-content-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-content-before", {}, void 0, true)];
					}),
					"nav-bar-content-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-content-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-content-after", {}, void 0, true)];
					}),
					_: 3
				}, _parent));
				_push(ssrRenderComponent(VPNavScreen_default, { open: unref(isScreenOpen) }, {
					"nav-screen-content-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-screen-content-before", {}, void 0, true)];
					}),
					"nav-screen-content-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-screen-content-after", {}, void 0, true)];
					}),
					_: 3
				}, _parent));
				_push(`</header>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$25 = _sfc_main$14.setup;
_sfc_main$14.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNav.vue");
	return _sfc_setup$25 ? _sfc_setup$25(props, ctx) : void 0;
};
var VPNav_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$14, [["__scopeId", "data-v-f733e610"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPSidebarItem.vue
var _sfc_main$13 = {
	__name: "VPSidebarItem",
	__ssrInlineRender: true,
	props: {
		item: {
			type: Object,
			required: true
		},
		depth: {
			type: Number,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const { collapsed, collapsible, isLink, isActiveLink, isCurrentLink, hasActiveLink, hasChildren, toggle } = useSidebarItemControl(computed(() => props.item));
		const linkTag = computed(() => isLink.value ? "a" : "div");
		const textTag = computed(() => hasChildren.value && props.depth < 5 ? `h${props.depth + 2}` : "p");
		const sectionTag = computed(() => props.item.text && textTag.value !== "p" ? "section" : "div");
		function onItemClick() {
			!props.item.link && toggle();
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_VPSidebarItem = resolveComponent("VPSidebarItem", true);
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(sectionTag.value), mergeProps({ class: ["VPSidebarItem", [`level-${__props.depth}`, {
				collapsible: unref(collapsible),
				collapsed: unref(collapsed),
				"is-link": unref(isLink),
				"is-active": unref(isActiveLink),
				"has-active": unref(hasActiveLink)
			}]] }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (__props.item.text) {
							_push(`<div class="item" data-v-d6fbf2e2${_scopeId}><div class="indicator" data-v-d6fbf2e2${_scopeId}></div>`);
							if (__props.item.link) _push(ssrRenderComponent(_sfc_main$54, {
								tag: linkTag.value,
								class: "link",
								"aria-current": unref(isCurrentLink) ? "page" : void 0,
								href: __props.item.link,
								rel: __props.item.rel,
								target: __props.item.target
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(textTag.value), { class: "text" }, null), _parent, _scopeId);
									else return [(openBlock(), createBlock(resolveDynamicComponent(textTag.value), {
										class: "text",
										innerHTML: __props.item.text
									}, null, 8, ["innerHTML"]))];
								}),
								_: 1
							}, _parent, _scopeId));
							else ssrRenderVNode(_push, createVNode(resolveDynamicComponent(textTag.value), { class: "text" }, null), _parent, _scopeId);
							if (__props.item.collapsed != null && __props.item.items && __props.item.items.length) _push(`<button type="button" class="caret" aria-label="toggle section"${ssrRenderAttr("aria-expanded", !unref(collapsed))} data-v-d6fbf2e2${_scopeId}><span class="vpi-chevron-right caret-icon" data-v-d6fbf2e2${_scopeId}></span></button>`);
							else _push(`<!---->`);
							_push(`</div>`);
						} else _push(`<!---->`);
						if (__props.item.items && __props.item.items.length) {
							_push(`<ul class="items" data-v-d6fbf2e2${_scopeId}>`);
							if (__props.depth < 5) {
								_push(`<li data-v-d6fbf2e2${_scopeId}><!--[-->`);
								ssrRenderList(__props.item.items, (i) => {
									_push(ssrRenderComponent(_component_VPSidebarItem, {
										key: i.text,
										item: i,
										depth: __props.depth + 1
									}, null, _parent, _scopeId));
								});
								_push(`<!--]--></li>`);
							} else _push(`<!---->`);
							_push(`</ul>`);
						} else _push(`<!---->`);
					} else return [__props.item.text ? (openBlock(), createBlock("div", {
						key: 0,
						class: "item",
						onClick: onItemClick
					}, [
						createVNode("div", { class: "indicator" }),
						__props.item.link ? (openBlock(), createBlock(_sfc_main$54, {
							key: 0,
							tag: linkTag.value,
							class: "link",
							"aria-current": unref(isCurrentLink) ? "page" : void 0,
							href: __props.item.link,
							rel: __props.item.rel,
							target: __props.item.target
						}, {
							default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(textTag.value), {
								class: "text",
								innerHTML: __props.item.text
							}, null, 8, ["innerHTML"]))]),
							_: 1
						}, 8, [
							"tag",
							"aria-current",
							"href",
							"rel",
							"target"
						])) : (openBlock(), createBlock(resolveDynamicComponent(textTag.value), {
							key: 1,
							class: "text",
							innerHTML: __props.item.text
						}, null, 8, ["innerHTML"])),
						__props.item.collapsed != null && __props.item.items && __props.item.items.length ? (openBlock(), createBlock("button", {
							key: 2,
							type: "button",
							class: "caret",
							"aria-label": "toggle section",
							"aria-expanded": !unref(collapsed),
							onClick: withModifiers(unref(toggle), ["stop"])
						}, [createVNode("span", { class: "vpi-chevron-right caret-icon" })], 8, ["aria-expanded", "onClick"])) : createCommentVNode("", true)
					])) : createCommentVNode("", true), __props.item.items && __props.item.items.length ? (openBlock(), createBlock("ul", {
						key: 1,
						class: "items"
					}, [__props.depth < 5 ? (openBlock(), createBlock("li", { key: 0 }, [(openBlock(true), createBlock(Fragment, null, renderList(__props.item.items, (i) => {
						return openBlock(), createBlock(_component_VPSidebarItem, {
							key: i.text,
							item: i,
							depth: __props.depth + 1
						}, null, 8, ["item", "depth"]);
					}), 128))])) : createCommentVNode("", true)])) : createCommentVNode("", true)];
				}),
				_: 1
			}), _parent);
		};
	}
};
var _sfc_setup$24 = _sfc_main$13.setup;
_sfc_main$13.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSidebarItem.vue");
	return _sfc_setup$24 ? _sfc_setup$24(props, ctx) : void 0;
};
var VPSidebarItem_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$13, [["__scopeId", "data-v-d6fbf2e2"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPSidebarGroup.vue
var _sfc_main$12 = {
	__name: "VPSidebarGroup",
	__ssrInlineRender: true,
	props: { items: {
		type: Array,
		required: true
	} },
	setup(__props) {
		const disableTransition = ref(true);
		let timer = null;
		onMounted(() => {
			timer = setTimeout(() => {
				timer = null;
				disableTransition.value = false;
			}, 300);
		});
		onBeforeUnmount(() => {
			if (timer != null) {
				clearTimeout(timer);
				timer = null;
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			ssrRenderList(__props.items, (item) => {
				_push(`<div class="${ssrRenderClass([{ "no-transition": disableTransition.value }, "group"])}" data-v-70d1d59e>`);
				_push(ssrRenderComponent(VPSidebarItem_default, {
					item,
					depth: 0
				}, null, _parent));
				_push(`</div>`);
			});
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$23 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSidebarGroup.vue");
	return _sfc_setup$23 ? _sfc_setup$23(props, ctx) : void 0;
};
var VPSidebarGroup_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$12, [["__scopeId", "data-v-70d1d59e"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPSidebar.vue
var _sfc_main$11 = {
	__name: "VPSidebar",
	__ssrInlineRender: true,
	props: { open: {
		type: Boolean,
		required: true
	} },
	setup(__props) {
		const { sidebarGroups, hasSidebar } = useLayout();
		const props = __props;
		const navEl = useTemplateRef("navEl");
		const isLocked = useBodyScrollLock();
		watch([() => props.open, navEl], () => {
			if (props.open) {
				isLocked.value = true;
				navEl.value?.focus();
			} else isLocked.value = false;
		}, {
			immediate: true,
			flush: "post"
		});
		const key = ref(0);
		watch(sidebarGroups, () => {
			key.value += 1;
		}, { deep: true });
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(hasSidebar)) {
				_push(`<aside${ssrRenderAttrs(mergeProps({
					class: ["VPSidebar", { open: __props.open }],
					ref_key: "navEl",
					ref: navEl
				}, _attrs))} data-v-e6e41a9f><div class="curtain" data-v-e6e41a9f></div><nav class="nav" id="VPSidebarNav" aria-labelledby="sidebar-aria-label" tabindex="-1" data-v-e6e41a9f><span class="visually-hidden" id="sidebar-aria-label" data-v-e6e41a9f> Sidebar Navigation </span>`);
				ssrRenderSlot(_ctx.$slots, "sidebar-nav-before", {}, null, _push, _parent);
				_push(ssrRenderComponent(VPSidebarGroup_default, {
					items: unref(sidebarGroups),
					key: key.value
				}, null, _parent));
				ssrRenderSlot(_ctx.$slots, "sidebar-nav-after", {}, null, _push, _parent);
				_push(`</nav></aside>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$22 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSidebar.vue");
	return _sfc_setup$22 ? _sfc_setup$22(props, ctx) : void 0;
};
var VPSidebar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$11, [["__scopeId", "data-v-e6e41a9f"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPSkipLink.vue
var _sfc_main$10 = {
	__name: "VPSkipLink",
	__ssrInlineRender: true,
	props: { inert: {
		type: Boolean,
		required: false
	} },
	setup(__props) {
		const { theme } = useData();
		const route = useRoute();
		const backToTop = useTemplateRef("backToTop");
		watch(() => route.path, () => backToTop.value?.focus());
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><span tabindex="-1" data-v-426d5ecb></span><a href="#VPContent" class="VPSkipLink visually-hidden"${ssrIncludeBooleanAttr(__props.inert) ? " inert" : ""} data-v-426d5ecb>${ssrInterpolate(unref(theme).skipToContentLabel || "Skip to content")}</a><!--]-->`);
		};
	}
};
var _sfc_setup$21 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSkipLink.vue");
	return _sfc_setup$21 ? _sfc_setup$21(props, ctx) : void 0;
};
var VPSkipLink_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$10, [["__scopeId", "data-v-426d5ecb"]]);
// node_modules/vitepress/dist/client/theme-default/Layout.vue
var _sfc_main$9 = {
	__name: "Layout",
	__ssrInlineRender: true,
	setup(__props) {
		const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebarControl();
		const { isScreenOpen } = useNav();
		registerWatchers({ closeSidebar });
		const { frontmatter, theme } = useData();
		const slots = useSlots();
		const heroImageSlotExists = computed(() => !!slots["home-hero-image"]);
		provide(layoutInfoInjectionKey, { heroImageSlotExists });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Content = resolveComponent("Content");
			if (unref(frontmatter).layout !== false) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: ["Layout", [unref(frontmatter).pageClass, unref(theme).gradedContainers && "vp-graded-containers"]] }, _attrs))} data-v-7aa807ef>`);
				ssrRenderSlot(_ctx.$slots, "layout-top", {}, null, _push, _parent);
				_push(ssrRenderComponent(VPSkipLink_default, { inert: unref(isScreenOpen) }, null, _parent));
				_push(ssrRenderComponent(VPBackdrop_default, {
					class: "backdrop",
					show: unref(isSidebarOpen),
					onClick: unref(closeSidebar)
				}, null, _parent));
				_push(ssrRenderComponent(VPNav_default, null, {
					"nav-bar-title-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-title-before", {}, void 0, true)];
					}),
					"nav-bar-title-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-title-after", {}, void 0, true)];
					}),
					"nav-bar-content-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-content-before", {}, void 0, true)];
					}),
					"nav-bar-content-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-bar-content-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-bar-content-after", {}, void 0, true)];
					}),
					"nav-screen-content-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-screen-content-before", {}, void 0, true)];
					}),
					"nav-screen-content-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "nav-screen-content-after", {}, void 0, true)];
					}),
					_: 3
				}, _parent));
				_push(ssrRenderComponent(VPLocalNav_default, {
					open: unref(isSidebarOpen),
					onOpenMenu: unref(openSidebar),
					inert: unref(isScreenOpen)
				}, null, _parent));
				_push(ssrRenderComponent(VPSidebar_default, {
					open: unref(isSidebarOpen),
					inert: unref(isScreenOpen)
				}, {
					"sidebar-nav-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "sidebar-nav-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "sidebar-nav-before", {}, void 0, true)];
					}),
					"sidebar-nav-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "sidebar-nav-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "sidebar-nav-after", {}, void 0, true)];
					}),
					_: 3
				}, _parent));
				_push(ssrRenderComponent(VPContent_default, { inert: unref(isScreenOpen) }, {
					"page-top": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "page-top", {}, void 0, true)];
					}),
					"page-bottom": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "page-bottom", {}, void 0, true)];
					}),
					"not-found": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "not-found", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "not-found", {}, void 0, true)];
					}),
					"home-hero-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-before", {}, void 0, true)];
					}),
					"home-hero-info-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-info-before", {}, void 0, true)];
					}),
					"home-hero-info": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-info", {}, void 0, true)];
					}),
					"home-hero-info-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-info-after", {}, void 0, true)];
					}),
					"home-hero-actions-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-actions-after", {}, void 0, true)];
					}),
					"home-hero-actions-before-actions": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-actions-before-actions", {}, void 0, true)];
					}),
					"home-hero-image": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-image", {}, void 0, true)];
					}),
					"home-hero-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-hero-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-hero-after", {}, void 0, true)];
					}),
					"home-features-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-features-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-features-before", {}, void 0, true)];
					}),
					"home-features-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "home-features-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "home-features-after", {}, void 0, true)];
					}),
					"doc-footer-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "doc-footer-before", {}, void 0, true)];
					}),
					"doc-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "doc-before", {}, void 0, true)];
					}),
					"doc-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "doc-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "doc-after", {}, void 0, true)];
					}),
					"doc-top": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "doc-top", {}, void 0, true)];
					}),
					"doc-bottom": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "doc-bottom", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "doc-bottom", {}, void 0, true)];
					}),
					"aside-top": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-top", {}, void 0, true)];
					}),
					"aside-bottom": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-bottom", {}, void 0, true)];
					}),
					"aside-outline-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-outline-before", {}, void 0, true)];
					}),
					"aside-outline-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-outline-after", {}, void 0, true)];
					}),
					"aside-ads-before": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-ads-before", {}, void 0, true)];
					}),
					"aside-ads-after": withCtx((_, _push, _parent, _scopeId) => {
						if (_push) ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push, _parent, _scopeId);
						else return [renderSlot(_ctx.$slots, "aside-ads-after", {}, void 0, true)];
					}),
					_: 3
				}, _parent));
				_push(ssrRenderComponent(VPFooter_default, { inert: unref(isScreenOpen) }, null, _parent));
				ssrRenderSlot(_ctx.$slots, "layout-bottom", {}, null, _push, _parent);
				_push(`</div>`);
			} else _push(ssrRenderComponent(_component_Content, _attrs, null, _parent));
		};
	}
};
var _sfc_setup$20 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/Layout.vue");
	return _sfc_setup$20 ? _sfc_setup$20(props, ctx) : void 0;
};
var Layout_default$1 = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$9, [["__scopeId", "data-v-7aa807ef"]]);
// node_modules/vitepress/dist/client/theme-default/composables/sponsor-grid.js
/**
* Defines grid configuration for each sponsor size in tuple.
*
* [Screen width (rem), Column size]
*
* It sets grid size on matching screen size. For example, `[48, 5]` will
* set 5 columns when the screen is at least 48rem wide.
*
* Column will set only when item size is bigger than the column size. For
* example, even we define 5 columns, if we only have 1 sponsor yet, we would
* like to show it in 1 column to make it stand out.
*/
var GridSettings = {
	xmini: [[0, 2]],
	mini: [],
	small: [
		[57.5, 6],
		[48, 5],
		[40, 4],
		[30, 3],
		[0, 2]
	],
	medium: [
		[60, 5],
		[52, 4],
		[40, 3],
		[30, 2]
	],
	big: [[52, 3], [40, 2]]
};
function useSponsorsGrid({ el, size = "medium" }) {
	const onResize = throttleAndDebounce(manage, 100);
	onMounted(() => {
		manage();
		window.addEventListener("resize", onResize);
	});
	onUnmounted(() => {
		window.removeEventListener("resize", onResize);
	});
	function manage() {
		if (el.value) adjustSlots(el.value, size);
	}
}
function adjustSlots(el, size) {
	const tsize = el.children.length;
	const asize = el.querySelectorAll(".vp-sponsor-grid-item:not(.empty)").length;
	manageSlots(el, setGrid(el, size, asize), tsize, asize);
}
function setGrid(el, size, items) {
	const settings = GridSettings[size];
	let grid = 1;
	settings.some(([breakpoint, value]) => {
		if (window.matchMedia(`(min-width: ${breakpoint}rem)`).matches) {
			grid = items < value ? items : value;
			return true;
		}
	});
	setGridData(el, grid);
	return grid;
}
function setGridData(el, value) {
	el.dataset.vpGrid = String(value);
}
function manageSlots(el, grid, tsize, asize) {
	const diff = tsize - asize;
	const rem = asize % grid;
	neutralizeSlots(el, (rem === 0 ? rem : grid - rem) - diff);
}
function neutralizeSlots(el, count) {
	if (count === 0) return;
	count > 0 ? addSlots(el, count) : removeSlots(el, count * -1);
}
function addSlots(el, count) {
	for (let i = 0; i < count; i++) {
		const slot = document.createElement("div");
		slot.classList.add("vp-sponsor-grid-item", "empty");
		el.append(slot);
	}
}
function removeSlots(el, count) {
	for (let i = 0; i < count; i++) el.removeChild(el.lastElementChild);
}
// node_modules/vitepress/dist/client/theme-default/components/VPSponsorsGrid.vue
var _sfc_main$8 = {
	__name: "VPSponsorsGrid",
	__ssrInlineRender: true,
	props: {
		size: {
			type: String,
			required: false,
			default: "medium"
		},
		data: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const el = useTemplateRef("el");
		useSponsorsGrid({
			el,
			size: props.size
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<ul${ssrRenderAttrs(mergeProps({
				class: ["VPSponsorsGrid vp-sponsor-grid", [__props.size]],
				ref_key: "el",
				ref: el
			}, _attrs))}><!--[-->`);
			ssrRenderList(__props.data, (sponsor) => {
				_push(`<li class="vp-sponsor-grid-item"><a class="vp-sponsor-grid-link"${ssrRenderAttr("href", sponsor.url)} target="_blank" rel="sponsored noopener"><article class="vp-sponsor-grid-box"><img class="vp-sponsor-grid-image"${ssrRenderAttr("src", sponsor.img)}${ssrRenderAttr("alt", sponsor.name)}></article></a></li>`);
			});
			_push(`<!--]--></ul>`);
		};
	}
};
var _sfc_setup$19 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSponsorsGrid.vue");
	return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/components/VPSponsors.vue
var _sfc_main$7 = {
	__name: "VPSponsors",
	__ssrInlineRender: true,
	props: {
		mode: {
			type: String,
			required: false,
			default: "normal"
		},
		tier: {
			type: String,
			required: false
		},
		size: {
			type: String,
			required: false
		},
		data: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const sponsors = computed(() => {
			if (props.data.some((s) => {
				return "items" in s;
			})) return props.data;
			return [{
				tier: props.tier,
				size: props.size,
				items: props.data
			}];
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPSponsors vp-sponsor", [__props.mode]] }, _attrs))}><!--[-->`);
			ssrRenderList(sponsors.value, (sponsor, index) => {
				_push(`<section class="vp-sponsor-section">`);
				if (sponsor.tier) _push(`<h3 class="vp-sponsor-tier">${ssrInterpolate(sponsor.tier)}</h3>`);
				else _push(`<!---->`);
				_push(ssrRenderComponent(_sfc_main$8, {
					size: sponsor.size,
					data: sponsor.items
				}, null, _parent));
				_push(`</section>`);
			});
			_push(`<!--]--></div>`);
		};
	}
};
var _sfc_setup$18 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSponsors.vue");
	return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/components/VPDocAsideSponsors.vue
var _sfc_main$6 = {
	__name: "VPDocAsideSponsors",
	__ssrInlineRender: true,
	props: {
		tier: {
			type: String,
			required: false
		},
		size: {
			type: String,
			required: false
		},
		data: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAsideSponsors" }, _attrs))}>`);
			_push(ssrRenderComponent(_sfc_main$7, {
				mode: "aside",
				tier: __props.tier,
				size: __props.size,
				data: __props.data
			}, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$17 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocAsideSponsors.vue");
	return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/components/VPHomeSponsors.vue
var _sfc_main$5 = {
	__name: "VPHomeSponsors",
	__ssrInlineRender: true,
	props: {
		message: {
			type: String,
			required: false
		},
		actionText: {
			type: String,
			required: false,
			default: "Become a sponsor"
		},
		actionLink: {
			type: String,
			required: false
		},
		data: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "VPHomeSponsors" }, _attrs))} data-v-47445eb6><div class="container" data-v-47445eb6><div class="header" data-v-47445eb6><div class="love" data-v-47445eb6><span class="vpi-heart icon" data-v-47445eb6></span></div>`);
			if (__props.message) _push(`<h2 class="message" data-v-47445eb6>${ssrInterpolate(__props.message)}</h2>`);
			else _push(`<!---->`);
			_push(`</div><div class="sponsors" data-v-47445eb6>`);
			_push(ssrRenderComponent(_sfc_main$7, { data: __props.data }, null, _parent));
			_push(`</div>`);
			if (__props.actionLink) {
				_push(`<div class="action" data-v-47445eb6>`);
				_push(ssrRenderComponent(VPButton_default, {
					theme: "sponsor",
					text: __props.actionText,
					href: __props.actionLink
				}, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></section>`);
		};
	}
};
var _sfc_setup$16 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPHomeSponsors.vue");
	return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/components/VPTeamMembersItem.vue
var _sfc_main$4 = {
	__name: "VPTeamMembersItem",
	__ssrInlineRender: true,
	props: {
		size: {
			type: String,
			required: false,
			default: "medium"
		},
		member: {
			type: Object,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<article${ssrRenderAttrs(mergeProps({ class: ["VPTeamMembersItem", [__props.size]] }, _attrs))} data-v-f4922697><div class="profile" data-v-f4922697><figure class="avatar" data-v-f4922697><img class="avatar-img"${ssrRenderAttr("src", __props.member.avatar)}${ssrRenderAttr("alt", __props.member.name)} data-v-f4922697></figure><div class="data" data-v-f4922697><h1 class="name" data-v-f4922697>${ssrInterpolate(__props.member.name)}</h1>`);
			if (__props.member.title || __props.member.org) {
				_push(`<p class="affiliation" data-v-f4922697>`);
				if (__props.member.title) _push(`<span class="title" data-v-f4922697>${ssrInterpolate(__props.member.title)}</span>`);
				else _push(`<!---->`);
				if (__props.member.title && __props.member.org) _push(`<span class="at" data-v-f4922697> @ </span>`);
				else _push(`<!---->`);
				if (__props.member.org) _push(ssrRenderComponent(_sfc_main$54, {
					class: ["org", { link: __props.member.orgLink }],
					href: __props.member.orgLink,
					"no-icon": ""
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(__props.member.org)}`);
						else return [createTextVNode(toDisplayString(__props.member.org), 1)];
					}),
					_: 1
				}, _parent));
				else _push(`<!---->`);
				_push(`</p>`);
			} else _push(`<!---->`);
			if (__props.member.desc) _push(`<p class="desc" data-v-f4922697>${__props.member.desc ?? ""}</p>`);
			else _push(`<!---->`);
			if (__props.member.links) {
				_push(`<div class="links" data-v-f4922697>`);
				_push(ssrRenderComponent(VPSocialLinks_default, {
					links: __props.member.links,
					me: false
				}, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></div>`);
			if (__props.member.sponsor) {
				_push(`<div class="sp" data-v-f4922697>`);
				_push(ssrRenderComponent(_sfc_main$54, {
					class: "sp-link",
					href: __props.member.sponsor,
					"no-icon": ""
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<span class="vpi-heart sp-icon" data-v-f4922697${_scopeId}></span> ${ssrInterpolate(__props.member.actionText || "Sponsor")}`);
						else return [createVNode("span", { class: "vpi-heart sp-icon" }), createTextVNode(" " + toDisplayString(__props.member.actionText || "Sponsor"), 1)];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</article>`);
		};
	}
};
var _sfc_setup$15 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPTeamMembersItem.vue");
	return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
var VPTeamMembersItem_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$4, [["__scopeId", "data-v-f4922697"]]);
// node_modules/vitepress/dist/client/theme-default/components/VPTeamMembers.vue
var _sfc_main$3 = {
	__name: "VPTeamMembers",
	__ssrInlineRender: true,
	props: {
		size: {
			type: String,
			required: false,
			default: "medium"
		},
		members: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["VPTeamMembers", [__props.size, `count-${__props.members.length}`]] }, _attrs))} data-v-b156f99d><ul class="container" data-v-b156f99d><!--[-->`);
			ssrRenderList(__props.members, (member) => {
				_push(`<li class="item" data-v-b156f99d>`);
				_push(ssrRenderComponent(VPTeamMembersItem_default, {
					size: __props.size,
					member
				}, null, _parent));
				_push(`</li>`);
			});
			_push(`<!--]--></ul></div>`);
		};
	}
};
var _sfc_setup$14 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPTeamMembers.vue");
	return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/components/VPTeamPage.vue
var _sfc_main$2 = {};
var _sfc_setup$13 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPTeamPage.vue");
	return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/components/VPTeamPageSection.vue
var _sfc_main$1 = {};
var _sfc_setup$12 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPTeamPageSection.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/components/VPTeamPageTitle.vue
var _sfc_main = {};
var _sfc_setup$11 = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPTeamPageTitle.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
// node_modules/vitepress/dist/client/theme-default/without-fonts.js
var theme = {
	Layout: Layout_default$1,
	enhanceApp: ({ app }) => {
		app.component("Badge", _sfc_main$62);
	}
};
// docs/.vitepress/theme/components/AuraBar.vue?vue&type=script&setup=true&lang.ts
var AuraBar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AuraBar",
	__ssrInlineRender: true,
	props: { uuid: {} },
	setup(__props) {
		const props = __props;
		const accent = computed(() => props.uuid ? accentOfUuid(props.uuid) : `hsl(${hueOf(432)} 62% 44%)`);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				style: {
					height: "3px",
					background: accent.value
				},
				title: __props.uuid ? `aura of ${__props.uuid}` : `the key ${unref(432)}`
			}, _attrs))}></div>`);
		};
	}
});
// docs/.vitepress/theme/components/AuraBar.vue
var _sfc_setup$10 = AuraBar_vue_vue_type_script_setup_true_lang_default.setup;
AuraBar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/AuraBar.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
var AuraBar_default = AuraBar_vue_vue_type_script_setup_true_lang_default;
// docs/.vitepress/theme/components/Channel.vue?vue&type=script&setup=true&lang.ts
var Channel_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Channel",
	__ssrInlineRender: true,
	props: { uuid: {} },
	setup(__props) {
		const props = __props;
		const ch = computed(() => channelOf(props.uuid));
		const seal = computed(() => sealOf(props.uuid));
		const mirror = computed(() => reflectionOf(props.uuid));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<details${ssrRenderAttrs(mergeProps({ class: "channel" }, _attrs))}><summary>channel <code>${ssrInterpolate(ch.value.handle)}</code> · program <code>${ssrInterpolate(ch.value.program.join(""))}</code> · tail <code>${ssrInterpolate(ch.value.tail)}</code> · seal ${ssrInterpolate(seal.value.valid ? "✓" : "✗")}</summary><table><tbody><tr><td>one 48-bit</td><td>${ssrInterpolate(ch.value.message.one48)}</td></tr><tr><td>three 16-bit</td><td>${ssrInterpolate(ch.value.message.three16.join(" · "))}</td></tr><tr><td>text</td><td>${ssrInterpolate(ch.value.message.text6 ?? "—")}</td></tr><tr><td>timestamp</td><td>${ssrInterpolate(ch.value.message.timestamp ?? "—")}</td></tr><tr><td>referrer handle · flags</td><td><a${ssrRenderAttr("href", `/h/${ch.value.message.referrer.handle}`)}>${ssrInterpolate(ch.value.message.referrer.handle)}</a> · ${ssrInterpolate(ch.value.message.referrer.flags)}</td></tr><tr><td>colour</td><td><span style="${ssrRenderStyle({
				display: "inline-block",
				width: "1em",
				height: "1em",
				background: ch.value.message.colour.rgb,
				verticalAlign: "middle"
			})}"></span> ${ssrInterpolate(ch.value.message.colour.rgb)}</td></tr><tr><td>vortex (ℤ/9)</td><td>seed ${ssrInterpolate(ch.value.message.vortex.seed)} · reflection ${ssrInterpolate(ch.value.message.vortex.reflection)} · ${ssrInterpolate(ch.value.message.vortex.polarity)}</td></tr><tr><td>mirror (σ)</td><td><a${ssrRenderAttr("href", `/u/${mirror.value.mirror}`)}><code>${ssrInterpolate(mirror.value.mirror)}</code></a></td></tr></tbody></table></details>`);
		};
	}
});
// docs/.vitepress/theme/components/Channel.vue
var _sfc_setup$9 = Channel_vue_vue_type_script_setup_true_lang_default.setup;
Channel_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/Channel.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var Channel_default = Channel_vue_vue_type_script_setup_true_lang_default;
// docs/.vitepress/theme/components/Verify.vue?vue&type=script&setup=true&lang.ts
var Verify_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Verify",
	__ssrInlineRender: true,
	props: {
		uuid: {},
		compact: { type: Boolean }
	},
	setup(__props) {
		const input = ref(__props.uuid ?? "");
		const content = ref("");
		const reply = computed(() => input.value ? handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/call",
			params: {
				name: "verify",
				arguments: {
					uuid: input.value,
					...content.value ? { content: content.value } : {}
				}
			}
		}) : null);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "verify" }, _attrs))}>`);
			if (!__props.compact) _push(`<!--[--><label>UUID <input${ssrRenderAttr("value", input.value)} style="${ssrRenderStyle({
				"width": "100%",
				"font-family": "monospace"
			})}"></label><label>content (optional) <input${ssrRenderAttr("value", content.value)} style="${ssrRenderStyle({ "width": "100%" })}"></label><!--]-->`);
			else _push(`<!---->`);
			if (reply.value?.result) _push(`<p${ssrRenderAttr("title", reply.value.result.structuredContent.checks.map((c) => `${c.check}: ${c.evidence}`).join("\n"))}> verify: ${ssrInterpolate(reply.value.result.structuredContent.valid ? "✓" : "✗")} (${ssrInterpolate(reply.value.result.structuredContent.decided)} decided) </p>`);
			else _push(`<!---->`);
			if (reply.value?.result && !__props.compact) _push(`<div>${reply.value.result._meta.widget ?? ""}</div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
// docs/.vitepress/theme/components/Verify.vue
var _sfc_setup$8 = Verify_vue_vue_type_script_setup_true_lang_default.setup;
Verify_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/Verify.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var Verify_default = Verify_vue_vue_type_script_setup_true_lang_default;
// docs/.vitepress/theme/components/Compile.vue?vue&type=script&setup=true&lang.ts
var Compile_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Compile",
	__ssrInlineRender: true,
	props: {
		uuid: {},
		prev: {}
	},
	setup(__props) {
		const props = __props;
		const ch = computed(() => channelOf(props.uuid));
		const tools = computed(() => handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/list"
		}).result.tools);
		const compiled = computed(() => compileOf(ch.value.program, tools.value, ch.value.message));
		const result = computed(() => compiled.value.next ? handle({
			jsonrpc: "2.0",
			id: 2,
			method: "tools/call",
			params: {
				name: compiled.value.next.tool,
				arguments: compiled.value.next.arguments,
				_meta: props.prev ? { prev: props.prev } : void 0
			}
		}) : null);
		const next = computed(() => `/u/${uuidFromParts(ch.value.handle, [...ch.value.program.slice(1), ch.value.program[0]], ch.value.tail)}`);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(_attrs)}><h2>Program</h2><table><thead><tr><th>#</th><th>nibble</th><th>tool</th><th>arguments</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(compiled.value.steps, (s, i) => {
				_push(`<tr><td>${ssrInterpolate(i)}</td><td>${ssrInterpolate(s.nibble.toString(16))}</td><td>${ssrInterpolate(s.tool)}</td><td><code>${ssrInterpolate(JSON.stringify(s.arguments))}</code></td></tr>`);
			});
			_push(`<!--]--></tbody></table><h2>Next, executed</h2>`);
			if (result.value?.result) _push(`<div>${result.value.result._meta.widget ?? ""}</div>`);
			else if (result.value?.error) _push(`<p class="danger">${ssrInterpolate(result.value.error.message)}</p>`);
			else _push(`<!---->`);
			_push(`<nav style="${ssrRenderStyle({
				"display": "flex",
				"justify-content": "space-between",
				"margin": "24px 0"
			})}"><span>`);
			if (__props.prev) _push(`<a${ssrRenderAttr("href", __props.prev)}>← previous</a>`);
			else _push(`<!---->`);
			_push(`</span><span><a${ssrRenderAttr("href", next.value)}>next (the program rotated) →</a></span></nav></section>`);
		};
	}
});
// docs/.vitepress/theme/components/Compile.vue
var _sfc_setup$7 = Compile_vue_vue_type_script_setup_true_lang_default.setup;
Compile_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/Compile.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var Compile_default = Compile_vue_vue_type_script_setup_true_lang_default;
// docs/.vitepress/theme/components/Speak.vue?vue&type=script&setup=true&lang.ts
var Speak_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Speak",
	__ssrInlineRender: true,
	props: {
		text: {},
		locale: {}
	},
	setup(__props) {
		const props = __props;
		const voices = ref([]);
		const speaking = ref(false);
		const supported = typeof window !== "undefined" && "speechSynthesis" in window;
		onMounted(() => {
			if (!supported) return;
			const load = () => {
				voices.value = window.speechSynthesis.getVoices().filter((v) => !props.locale || v.lang.toLowerCase().startsWith(props.locale.toLowerCase())).map((v) => v.name);
			};
			load();
			window.speechSynthesis.onvoiceschanged = load;
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(supported)) {
				_push(`<span${ssrRenderAttrs(mergeProps({ style: {
					"display": "inline-flex",
					"gap": "6px",
					"align-items": "center"
				} }, _attrs))}><button${ssrIncludeBooleanAttr(speaking.value) ? " disabled" : ""}${ssrRenderAttr("title", voices.value.length ? `voices for ${__props.locale ?? "the page"}: ${voices.value.join(", ")}` : `no voice on this device for ${__props.locale ?? "the page"}: a lead of the device, not of the text`)} style="${ssrRenderStyle({
					"font-size": "12px",
					"padding": "2px 8px",
					"border": "1px solid var(--vp-c-divider)",
					"border-radius": "6px",
					"background": "var(--vp-c-bg)"
				})}">${ssrInterpolate(speaking.value ? "…" : "🔊")} ${ssrInterpolate(__props.locale ?? "en")}</button>`);
				if (!voices.value.length) _push(`<small style="${ssrRenderStyle({ "color": "var(--vp-c-text-2)" })}">no voice for ${ssrInterpolate(__props.locale ?? "en")} on this device</small>`);
				else _push(`<!---->`);
				_push(`</span>`);
			} else _push(`<!---->`);
		};
	}
});
// docs/.vitepress/theme/components/Speak.vue
var _sfc_setup$6 = Speak_vue_vue_type_script_setup_true_lang_default.setup;
Speak_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/Speak.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var Speak_default = Speak_vue_vue_type_script_setup_true_lang_default;
// docs/.vitepress/theme/components/CatchAll.vue?vue&type=script&setup=true&lang.ts
var CatchAll_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "CatchAll",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		const decision = computed(() => {
			const segments = route.path.split("/").filter(Boolean).map(decodeURIComponent);
			const notes = [];
			let locale = "en";
			if (segments[0] && LOCALES[segments[0]] && segments[0] !== "en") {
				locale = segments.shift();
				if (!LOCALES[locale].filled) notes.push(`translate later: ${LOCALES[locale].name} has no vocabulary table yet, a lead`);
			}
			const [a, b, c] = segments;
			if (a && /^[0-9a-f]{8}$/.test(a) && b && /^[0-9a-f]{10}$/.test(b)) return {
				kind: "walk",
				uuid: uuidFromParts(a, [...b].map((x) => parseInt(x, 16)), c && /^[0-9a-f]{12}$/.test(c) ? c : "000000000000"),
				notes,
				locale
			};
			const statement = segments.join(" ").replace(/[-_]+/g, " ");
			const m = handle({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/call",
				params: {
					name: "match",
					arguments: { statement }
				}
			});
			return {
				kind: "decided",
				statement,
				verdict: m.result?.structuredContent.verdict ?? "undecided",
				widget: m.result?._meta.widget ?? "",
				notes,
				locale
			};
		});
		const t = (text) => translateOf(text, "en", decision.value.locale).text;
		const prev = typeof document !== "undefined" && document.referrer ? document.referrer : void 0;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "vp-doc",
				style: { "padding": "32px 24px 96px" }
			}, _attrs))}>`);
			if (decision.value.notes.length) _push(`<p style="${ssrRenderStyle({ "color": "var(--vp-c-text-2)" })}">${ssrInterpolate(decision.value.notes.join(" · "))}</p>`);
			else _push(`<!---->`);
			if (decision.value.kind === "walk") {
				_push(`<!--[--><h1>${ssrInterpolate(t("the walk"))}</h1>`);
				_push(ssrRenderComponent(Channel_default, { uuid: decision.value.uuid }, null, _parent));
				_push(ssrRenderComponent(Compile_default, {
					uuid: decision.value.uuid,
					prev: unref(prev)
				}, null, _parent));
				_push(`<!--]-->`);
			} else {
				_push(`<!--[--><h1>${ssrInterpolate(decision.value.statement)}</h1><p>${ssrInterpolate(t("Caught: this path is not a walk. Decided by the match tool"))}: <strong>${ssrInterpolate(t(decision.value.verdict))}</strong> `);
				_push(ssrRenderComponent(Speak_default, {
					text: `${decision.value.statement}. ${t("Caught: this path is not a walk. Decided by the match tool")}: ${t(decision.value.verdict)}`,
					locale: decision.value.locale
				}, null, _parent));
				_push(`</p><div>${decision.value.widget ?? ""}</div><!--]-->`);
			}
			_push(`</div>`);
		};
	}
});
// docs/.vitepress/theme/components/CatchAll.vue
var _sfc_setup$5 = CatchAll_vue_vue_type_script_setup_true_lang_default.setup;
CatchAll_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/CatchAll.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var CatchAll_default = CatchAll_vue_vue_type_script_setup_true_lang_default;
// docs/.vitepress/theme/components/HandleSearch.vue?vue&type=script&setup=true&lang.ts
var HandleSearch_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "HandleSearch",
	__ssrInlineRender: true,
	setup(__props) {
		useRouter();
		const handle = ref("");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<form${ssrRenderAttrs(mergeProps({ style: {
				"display": "flex",
				"gap": "6px",
				"align-items": "center",
				"margin-left": "12px"
			} }, _attrs))}><input${ssrRenderAttr("value", handle.value)} placeholder="handle, uuid or statement" style="${ssrRenderStyle({
				"font-family": "monospace",
				"width": "18ch",
				"padding": "2px 6px",
				"border": "1px solid var(--vp-c-divider)",
				"border-radius": "6px",
				"background": "var(--vp-c-bg)"
			})}"></form>`);
		};
	}
});
// docs/.vitepress/theme/components/HandleSearch.vue
var _sfc_setup$4 = HandleSearch_vue_vue_type_script_setup_true_lang_default.setup;
HandleSearch_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/HandleSearch.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var HandleSearch_default = HandleSearch_vue_vue_type_script_setup_true_lang_default;
// docs/.vitepress/theme/components/Mode.vue?vue&type=script&setup=true&lang.ts
var Mode_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Mode",
	__ssrInlineRender: true,
	setup(__props) {
		const mode = ref("auto");
		const controlled = ref(false);
		const cached = ref(null);
		const askSw = (q) => new Promise((res) => {
			const sw = navigator.serviceWorker?.controller;
			if (!sw) return res({});
			const ch = new MessageChannel();
			ch.port1.onmessage = (e) => res(e.data);
			sw.postMessage(q, [ch.port2]);
			setTimeout(() => res({}), 1500);
		});
		const count = async () => {
			try {
				const c = await caches.open("qpu-pages");
				cached.value = (await c.keys()).length;
			} catch {
				cached.value = null;
			}
		};
		onMounted(async () => {
			try {
				const m = localStorage.getItem("qpu-mode");
				if (m) mode.value = m;
			} catch {}
			if ("serviceWorker" in navigator) {
				const sync = async () => {
					const reg = await navigator.serviceWorker.ready.catch(() => null);
					controlled.value = !!navigator.serviceWorker.controller && !!reg;
					if (controlled.value) {
						const held = await askSw({ ask: "mode" });
						if (held.mode && [
							"auto",
							"online",
							"offline"
						].includes(held.mode)) {
							mode.value = held.mode;
							try {
								localStorage.setItem("qpu-mode", held.mode);
							} catch {}
						} else navigator.serviceWorker.controller.postMessage({ mode: mode.value });
					}
					await count();
				};
				navigator.serviceWorker.addEventListener("controllerchange", () => {
					sync();
				});
				await sync();
				setTimeout(() => {
					sync();
				}, 2e3);
			}
			await count();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<span${ssrRenderAttrs(mergeProps({
				"data-mode": "",
				style: {
					"display": "inline-flex",
					"gap": "4px",
					"align-items": "center",
					"margin-left": "8px",
					"font-size": "12px"
				}
			}, _attrs))}><!--[-->`);
			ssrRenderList([
				"auto",
				"online",
				"offline"
			], (m) => {
				_push(`<button${ssrRenderAttr("aria-pressed", mode.value === m)} style="${ssrRenderStyle({
					padding: "2px 8px",
					border: "1px solid var(--vp-c-divider)",
					borderRadius: "6px",
					background: mode.value === m ? "var(--a432-accent)" : "var(--vp-c-bg)",
					color: mode.value === m ? "#fff" : "inherit"
				})}">${ssrInterpolate(m)}</button>`);
			});
			_push(`<!--]-->`);
			if (mode.value === "offline") _push(`<a href="/?mode=auto" title="leave offline mode without a script" style="${ssrRenderStyle({
				"font-size": "11px",
				"color": "var(--vp-c-text-2)"
			})}">leave</a>`);
			else _push(`<!---->`);
			_push(`<small${ssrRenderAttr("title", controlled.value ? "the service worker controls this page" : "no service worker yet: reload once")} style="${ssrRenderStyle({ "color": "var(--vp-c-text-2)" })}">${ssrInterpolate(controlled.value ? "sw" : "no sw")}${ssrInterpolate(cached.value !== null ? ` · ${cached.value} cached` : "")}</small></span>`);
		};
	}
});
// docs/.vitepress/theme/components/Mode.vue
var _sfc_setup$3 = Mode_vue_vue_type_script_setup_true_lang_default.setup;
Mode_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/Mode.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var Mode_default = Mode_vue_vue_type_script_setup_true_lang_default;
// docs/.vitepress/theme/Layout.vue?vue&type=script&setup=true&lang.ts
var Layout_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Layout",
	__ssrInlineRender: true,
	setup(__props) {
		const { Layout } = theme;
		const route = useRoute();
		const { frontmatter } = useData$1();
		const uuid = computed(() => (route.path.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i) ?? [])[0] ?? frontmatter.value.uuid);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Layout), _attrs, {
				"layout-top": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(AuraBar_default, { uuid: uuid.value }, null, _parent, _scopeId));
					else return [createVNode(AuraBar_default, { uuid: uuid.value }, null, 8, ["uuid"])];
				}),
				"nav-bar-content-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(HandleSearch_default, null, null, _parent, _scopeId));
						_push(ssrRenderComponent(Mode_default, null, null, _parent, _scopeId));
					} else return [createVNode(HandleSearch_default), createVNode(Mode_default)];
				}),
				"doc-footer-before": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (uuid.value) _push(ssrRenderComponent(Channel_default, { uuid: uuid.value }, null, _parent, _scopeId));
						else _push(`<!---->`);
					} else return [uuid.value ? (openBlock(), createBlock(Channel_default, {
						key: 0,
						uuid: uuid.value
					}, null, 8, ["uuid"])) : createCommentVNode("", true)];
				}),
				"aside-outline-after": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (uuid.value) _push(ssrRenderComponent(Verify_default, {
							uuid: uuid.value,
							compact: ""
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
					} else return [uuid.value ? (openBlock(), createBlock(Verify_default, {
						key: 0,
						uuid: uuid.value,
						compact: ""
					}, null, 8, ["uuid"])) : createCommentVNode("", true)];
				}),
				"not-found": withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(CatchAll_default, null, null, _parent, _scopeId));
					else return [createVNode(CatchAll_default)];
				}),
				_: 1
			}, _parent));
		};
	}
});
// docs/.vitepress/theme/Layout.vue
var _sfc_setup$2 = Layout_vue_vue_type_script_setup_true_lang_default.setup;
Layout_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/Layout.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var Layout_default = Layout_vue_vue_type_script_setup_true_lang_default;
// docs/.vitepress/theme/components/Block.vue?vue&type=script&setup=true&lang.ts
var Block_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Block",
	__ssrInlineRender: true,
	props: {
		tool: {},
		args: {}
	},
	setup(__props) {
		const props = __props;
		const reply = computed(() => handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/call",
			params: {
				name: props.tool,
				arguments: typeof props.args === "string" ? JSON.parse(props.args) : props.args ?? {}
			}
		}));
		return (_ctx, _push, _parent, _attrs) => {
			if (reply.value.result) _push(`<div${ssrRenderAttrs(mergeProps({ "data-block": reply.value.result._meta.block.meta.id }, _attrs))}>${reply.value.result._meta.widget ?? ""}</div>`);
			else _push(`<p${ssrRenderAttrs(mergeProps({ class: "danger" }, _attrs))}>${ssrInterpolate(reply.value.error?.message)}</p>`);
		};
	}
});
// docs/.vitepress/theme/components/Block.vue
var _sfc_setup$1 = Block_vue_vue_type_script_setup_true_lang_default.setup;
Block_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/Block.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var Block_default = Block_vue_vue_type_script_setup_true_lang_default;
// docs/.vitepress/theme/components/Chat.vue?vue&type=script&setup=true&lang.ts
var Chat_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Chat",
	__ssrInlineRender: true,
	setup(__props) {
		const statement = ref("");
		const turns = ref([]);
		const busy = ref(false);
		const channel = typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel("qpu-chat") : null;
		const keep = () => {
			try {
				localStorage.setItem("qpu-chat", JSON.stringify(turns.value.slice(0, 50)));
			} catch {}
		};
		onMounted(() => {
			try {
				const kept = localStorage.getItem("qpu-chat");
				if (kept) turns.value = JSON.parse(kept);
			} catch {}
			if (channel) channel.onmessage = (e) => {
				turns.value.unshift({
					...e.data,
					from: "signal"
				});
				keep();
			};
		});
		const word = (t) => ({
			proven: "teleported: the host holds this block (304 to its hash)",
			differs: "the host answers another block: a lead",
			offline: "offline: answered here alone",
			asking: "asking the host…",
			refused: "the host refused"
		})[t];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "qpu-chat",
				style: {
					"display": "grid",
					"gap": "12px"
				}
			}, _attrs))}><form style="${ssrRenderStyle({
				"display": "flex",
				"gap": "8px"
			})}"><input${ssrRenderAttr("value", statement.value)} placeholder="a statement: factor 15 with Shor · the register read by reflection · how many qubits has Willow" style="${ssrRenderStyle({
				"flex": "1",
				"padding": "6px 10px",
				"border": "1px solid var(--vp-c-divider)",
				"border-radius": "8px",
				"background": "var(--vp-c-bg)"
			})}"><button type="submit"${ssrIncludeBooleanAttr(busy.value) ? " disabled" : ""} style="${ssrRenderStyle({
				"padding": "6px 14px",
				"border-radius": "8px",
				"border": "1px solid var(--vp-c-divider)",
				"background": "var(--a432-accent)",
				"color": "#fff"
			})}">ask</button></form><p style="${ssrRenderStyle({
				"color": "var(--vp-c-text-2)",
				"font-size": "13px"
			})}">The handler runs in this page: every statement is a tools/call answered here, then named to the host by its content hash — a 304 is the teleport, proven. Other tabs of the web OS receive the signal.</p><!--[-->`);
			ssrRenderList(turns.value, (t) => {
				_push(`<article style="${ssrRenderStyle({
					"border": "1px solid var(--vp-c-divider)",
					"border-radius": "10px",
					"padding": "10px 12px"
				})}"><header style="${ssrRenderStyle({
					"display": "flex",
					"flex-wrap": "wrap",
					"gap": "8px",
					"align-items": "baseline",
					"font-size": "13px"
				})}"><strong>${ssrInterpolate(t.statement)}</strong><span>${ssrInterpolate(t.verdict)}${ssrInterpolate(t.tool ? ` by ${t.tool}` : "")}</span>`);
				if (t.address) _push(`<code style="${ssrRenderStyle({ "font-size": "11px" })}">${ssrInterpolate(t.address)}</code>`);
				else _push(`<!---->`);
				_push(`<em${ssrRenderAttr("title", t.hash)}>${ssrInterpolate(word(t.teleport))}</em><small style="${ssrRenderStyle({ "color": "var(--vp-c-text-2)" })}">${ssrInterpolate(t.ms)} ms · ${ssrInterpolate(t.from === "signal" ? "signalled from another tab" : "here")}</small></header>`);
				if (t.widget) _push(`<div style="${ssrRenderStyle({ "margin-top": "8px" })}">${t.widget ?? ""}</div>`);
				else _push(`<!---->`);
				_push(`</article>`);
			});
			_push(`<!--]--></div>`);
		};
	}
});
// docs/.vitepress/theme/components/Chat.vue
var _sfc_setup = Chat_vue_vue_type_script_setup_true_lang_default.setup;
Chat_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(".vitepress/theme/components/Chat.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Chat_default = Chat_vue_vue_type_script_setup_true_lang_default;
// docs/.vitepress/theme/index.ts
var theme_default = {
	extends: theme,
	Layout: Layout_default,
	enhanceApp({ app }) {
		if (typeof window !== "undefined" && "serviceWorker" in navigator) window.addEventListener("load", () => {
			navigator.serviceWorker.register("/sw.js").catch(() => {});
		});
		app.component("Block", Block_default);
		app.component("Channel", Channel_default);
		app.component("Verify", Verify_default);
		app.component("Compile", Compile_default);
		app.component("AuraBar", AuraBar_default);
		app.component("CatchAll", CatchAll_default);
		app.component("HandleSearch", HandleSearch_default);
		app.component("Speak", Speak_default);
		app.component("Mode", Mode_default);
		app.component("Chat", Chat_default);
	}
};
// node_modules/vitepress/dist/client/app/index.js
function resolveThemeExtends(theme) {
	if (theme.extends) {
		const base = resolveThemeExtends(theme.extends);
		return {
			...base,
			...theme,
			async enhanceApp(ctx) {
				await base.enhanceApp?.(ctx);
				await theme.enhanceApp?.(ctx);
			},
			setup() {
				base.setup?.();
				theme.setup?.();
			}
		};
	}
	return theme;
}
var Theme = resolveThemeExtends(theme_default);
var VitePressApp = defineComponent({
	name: "VitePressApp",
	setup() {
		const { site, lang, dir } = useData$1();
		onMounted(() => {
			watchEffect(() => {
				document.documentElement.lang = lang.value;
				document.documentElement.dir = dir.value;
			});
		});
		if (site.value.router.prefetchLinks) usePrefetch();
		useCopyCode();
		useCodeGroups();
		if (Theme.setup) Theme.setup();
		return () => h(Theme.Layout);
	}
});
async function createApp$2() {
	globalThis.__VITEPRESS__ = true;
	const router = newRouter();
	const app = newApp();
	app.provide(RouterSymbol, router);
	const data = initData(router.route);
	app.provide(dataSymbol, data);
	app.component("Content", Content);
	app.component("ClientOnly", ClientOnly);
	Object.defineProperties(app.config.globalProperties, {
		$frontmatter: { get() {
			return data.frontmatter.value;
		} },
		$params: { get() {
			return data.page.value.params;
		} }
	});
	app.config.throwUnhandledErrorInProduction = true;
	if (Theme.enhanceApp) await Theme.enhanceApp({
		app,
		router,
		siteData: siteDataRef
	});
	return {
		app,
		router,
		data
	};
}
function newApp() {
	return createSSRApp(VitePressApp);
}
function newRouter() {
	let isInitialPageLoad = inBrowser;
	return createRouter((path) => {
		let pageFilePath = pathToFile(path);
		let pageModule = null;
		if (pageFilePath) {
			if (isInitialPageLoad) pageFilePath = pageFilePath.replace(/\.js$/, ".lean.js");
			pageModule = import(
				/*@vite-ignore*/
				pageFilePath
);
		}
		if (inBrowser) isInitialPageLoad = false;
		return pageModule;
	}, Theme.NotFound);
}
if (inBrowser) createApp$2().then(({ app, router, data }) => {
	router.go(location.href, { initialLoad: true }).then(() => {
		useUpdateHead(router.route, data.site);
		app.mount("#app");
	});
});
// node_modules/vitepress/dist/client/app/ssr.js
async function render(path) {
	const { app, router } = await createApp$2();
	await router.go(path);
	const ctx = {
		content: "",
		vpIcons: /* @__PURE__ */ new Set()
	};
	ctx.content = await renderToString(app, ctx);
	return ctx;
}
export { useData as n, render, useBodyScrollLock as t };
