import { computed, defineComponent, h, inject, markRaw, nextTick, onMounted, reactive, readonly, ref, shallowRef, toValue, useSSRContext, watch } from "vue";
import { tryOnUnmounted, useDark, usePreferredDark } from "@vueuse/core";
// node_modules/vitepress/dist/client/app/components/ClientOnly.js
var ClientOnly = defineComponent({ setup(_, { slots }) {
	const show = ref(false);
	onMounted(() => {
		show.value = true;
	});
	return () => show.value && slots.default ? slots.default() : null;
} });
// node_modules/vitepress/dist/client/shared.js
var EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i;
var APPEARANCE_KEY = "vitepress-theme-appearance";
var iconNameRE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/**
* Parses a fully qualified `collection:name` icon name, corresponding to
* the `vpi-<collection>-<name>` class. Returns null for anything else,
* keeping malformed input out of generated selectors and class attributes.
*/
function parseIconName(name) {
	const colon = name.indexOf(":");
	if (colon === -1) return null;
	const collection = name.slice(0, colon);
	const icon = name.slice(colon + 1);
	if (!iconNameRE.test(collection) || !iconNameRE.test(icon)) return null;
	return {
		collection,
		icon
	};
}
/**
* Placeholder prepended to SSR-emitted URLs when base is relative, later
* replaced with each page's `../` prefix back to the site root.
*/
var RELATIVE_BASE_SENTINEL = "/__VP_BASE__/";
function isRelativeBase(base) {
	return base === "./";
}
/**
* Join two paths, collapsing slash collisions but keeping the `//` that
* follows a protocol.
*/
function joinPath(base, path) {
	const protocol = /^(?:[a-z]+:)?\/\//i.exec(base)?.[0] ?? "";
	return protocol + `${base.slice(protocol.length)}${path}`.replace(/\/+/g, "/");
}
var UnpackStackView = Symbol("stack-view:unpack");
var HASH_WITHOUT_FRAGMENT_RE = /#.*?(?=:~:|$)/;
var HASH_OR_QUERY_RE = /[?#].*$/;
var INDEX_OR_EXT_RE = /(?:(^|\/)index)?(?:\.(?:md|html))?$/;
var INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
var DRIVE_LETTER_REGEX = /^[a-z]:/i;
var KNOWN_EXTENSIONS = /* @__PURE__ */ new Set();
var shellLangs = [
	"shellscript",
	"shell",
	"bash",
	"sh",
	"zsh"
];
var inBrowser = typeof document !== "undefined";
var notFoundPageData = {
	relativePath: "404.md",
	filePath: "",
	title: "404",
	description: "Not Found",
	headers: [],
	frontmatter: {
		sidebar: false,
		layout: "page"
	},
	lastUpdated: 0,
	isNotFound: true
};
function isActive(currentPath, currentHash, matchPath, asRegex = false, skipHashCheck = false) {
	currentPath = normalize(`/${currentPath}`);
	if (asRegex) return new RegExp(matchPath).test(currentPath);
	if (normalize(matchPath) !== currentPath) return false;
	if (skipHashCheck) return true;
	const hashMatch = matchPath.match(HASH_WITHOUT_FRAGMENT_RE);
	if (hashMatch) return currentHash === hashMatch[0];
	return true;
}
function normalize(path) {
	return decodeURI(path).replace(HASH_OR_QUERY_RE, "").replace(INDEX_OR_EXT_RE, "$1");
}
function isExternal(path) {
	return EXTERNAL_URL_RE.test(path);
}
function getLocaleForPath(siteData, relativePath) {
	return Object.keys(siteData?.locales || {}).find((key) => key !== "root" && !isExternal(key) && isActive(relativePath, "", `^/${key}/`, true)) || "root";
}
/**
* Resolves the site data for a route, layering the matched locale and
* additional configs over the root config.
*/
function resolveSiteDataByRoute(siteData, relativePath, filePath) {
	const localeIndex = getLocaleForPath(siteData, relativePath);
	const { label, link, markdown, ...localeConfig } = siteData.locales[localeIndex] ?? {};
	Object.assign(localeConfig, { localeIndex });
	const additionalConfigs = resolveAdditionalConfig(siteData, filePath || relativePath);
	return stackView({ head: mergeHead(siteData.head ?? [], localeConfig.head ?? [], ...additionalConfigs.map((data) => data.head ?? []).reverse()) }, ...additionalConfigs, localeConfig, siteData);
}
/**
* Create the page title string based on config.
*/
function createTitle(siteData, pageData) {
	const title = pageData.title || siteData.title;
	const template = pageData.titleTemplate ?? siteData.titleTemplate;
	if (typeof template === "string" && template.includes(":title")) return template.replace(/:title/g, title);
	const templateString = createTitleTemplate(siteData.title, template);
	if (title === templateString.slice(3)) return title;
	return `${title}${templateString}`;
}
function createTitleTemplate(siteTitle, template) {
	if (template === false) return "";
	if (template === true || template === void 0) return ` | ${siteTitle}`;
	if (siteTitle === template) return "";
	return ` | ${template}`;
}
function mergeHead(...headArrays) {
	const merged = [];
	const keyMap = /* @__PURE__ */ new Map();
	for (const current of headArrays) for (const tag of current) {
		const key = getHeadKey(tag);
		if (key == null) {
			merged.push(tag);
			continue;
		}
		const existingIndex = keyMap.get(key);
		if (existingIndex != null) merged[existingIndex] = tag;
		else {
			keyMap.set(key, merged.length);
			merged.push(tag);
		}
	}
	return merged;
}
function getHeadKey([type, attrs]) {
	if (attrs.id) return `id=${attrs.id}`;
	if (type !== "meta") return;
	for (const name in attrs) if (name !== "content") return `${name}=${attrs[name]}`;
}
function sanitizeFileName(name) {
	const match = DRIVE_LETTER_REGEX.exec(name);
	const driveLetter = match ? match[0] : "";
	return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "_").replace(/(^|\/)_+(?=[^/]*$)/, "$1");
}
function treatAsHtml(filename) {
	if (KNOWN_EXTENSIONS.size === 0) {
		const extraExts = globalThis.process?.env?.VITE_EXTRA_EXTENSIONS || "";
		("3g2,3gp,aac,ai,apng,au,avif,bin,bmp,cer,class,conf,crl,css,csv,dll,doc,eps,epub,exe,gif,gz,ics,ief,jar,jpe,jpeg,jpg,js,json,jsonld,m4a,man,mid,midi,mjs,mov,mp2,mp3,mp4,mpe,mpeg,mpg,mpp,oga,ogg,ogv,ogx,opus,otf,p10,p7c,p7m,p7s,pdf,png,ps,qt,roff,rtf,rtx,ser,svg,t,tif,tiff,tr,ts,tsv,ttf,txt,vtt,wav,weba,webm,webp,woff,woff2,xhtml,xml,yaml,yml,zip" + (extraExts && typeof extraExts === "string" ? "," + extraExts : "")).split(",").forEach((ext) => KNOWN_EXTENSIONS.add(ext));
	}
	const ext = filename.split(".").pop();
	return ext == null || !KNOWN_EXTENSIONS.has(ext.toLowerCase());
}
function escapeRegExp(str) {
	return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function resolveAdditionalConfig({ additionalConfig }, path) {
	if (additionalConfig === void 0) return [];
	if (typeof additionalConfig === "function") return additionalConfig(path) ?? [];
	const configs = [];
	const segments = path.split("/").slice(0, -1);
	while (segments.length) {
		const key = `/${segments.join("/")}/`;
		configs.push(additionalConfig[key]);
		segments.pop();
	}
	configs.push(additionalConfig["/"]);
	return configs.filter((config) => config !== void 0);
}
/**
* Creates a readonly proxy behaving like a deep merge of the given layers,
* without mutating them. Earlier layers take precedence.
*/
function stackView(..._layers) {
	const layers = _layers.filter((layer) => isObject(layer));
	if (layers.length <= 1) return _layers[0];
	const allKeys = new Set(layers.flatMap((layer) => Reflect.ownKeys(layer)));
	const allKeysArray = [...allKeys];
	return new Proxy({}, {
		get(_, prop) {
			if (prop === UnpackStackView) return layers;
			return stackView(...layers.map((layer) => layer[prop]).filter((v) => v !== void 0));
		},
		set() {
			throw new Error("StackView is read-only and cannot be mutated.");
		},
		has(_, prop) {
			return allKeys.has(prop);
		},
		ownKeys() {
			return allKeysArray;
		},
		getOwnPropertyDescriptor(_, prop) {
			for (const layer of layers) {
				const descriptor = Object.getOwnPropertyDescriptor(layer, prop);
				if (descriptor) return descriptor;
			}
		}
	});
}
stackView.unpack = function(obj) {
	return obj?.[UnpackStackView];
};
function isObject(value) {
	return Object.prototype.toString.call(value) === "[object Object]";
}
function isShell(lang) {
	return shellLangs.includes(lang);
}
// ../../../../../@siteData
var _siteData_default = JSON.parse("{\"lang\":\"en-US\",\"dir\":\"ltr\",\"title\":\"@uuidna/qpu\",\"description\":\"The Google Quantum AI layer: the Willow processor as its spec sheet states it, Cirq gates and circuits, Quantum Echoes with the benchmark Google states, and one MCP surface that compiles them on request.\",\"base\":\"/\",\"head\":[],\"router\":{\"prefetchLinks\":true},\"appearance\":true,\"themeConfig\":{\"search\":{\"provider\":\"local\"},\"outline\":\"deep\",\"docFooter\":{\"prev\":\"previous step\",\"next\":\"next step\"},\"editLink\":{\"pattern\":\"https://github.com/uuidna/qpu/edit/main/docs/:path\",\"text\":\"this page is a lead: edit it\"},\"socialLinks\":[{\"icon\":\"github\",\"link\":\"https://github.com/uuidna/qpu\"}],\"lastUpdated\":{\"text\":\"last receipt\"},\"externalLinkIcon\":true,\"footer\":{\"message\":\"CC-BY-NC-ND-4.0 — attribute the author, no derivatives, commercial use of the QPU framework, over UUID or by any other means, by licence (ceccec@psg.bg); the a432 harmonic default is free to all under attribution.\",\"copyright\":\"© Tsvetan Rouschev · https://orcid.org/0009-0000-7312-9778\"},\"nav\":[{\"text\":\"Processor\",\"link\":\"/processor\"},{\"text\":\"Chat\",\"link\":\"/chat\"},{\"text\":\"Use cases\",\"link\":\"/use-cases\"},{\"text\":\"Roadmap\",\"link\":\"/roadmap\"},{\"text\":\"Cirq\",\"link\":\"/cirq\"},{\"text\":\"Software\",\"link\":\"/software\"},{\"text\":\"Algorithms\",\"link\":\"/algorithms\"},{\"text\":\"Quantum Echoes\",\"link\":\"/echo\"},{\"text\":\"Responsibility\",\"link\":\"/responsibility\"},{\"text\":\"MCP\",\"link\":\"/mcp\"},{\"text\":\"Clay register\",\"link\":\"/clay\"},{\"text\":\"Textbook\",\"link\":\"/textbook\"},{\"text\":\"Examples\",\"link\":\"/examples\"},{\"text\":\"Leads\",\"link\":\"/leads\"},{\"text\":\"Audit\",\"link\":\"/audit\"},{\"text\":\"Discovery\",\"link\":\"/discovery\"},{\"text\":\"Match\",\"link\":\"/match\"},{\"text\":\"Theorems\",\"link\":\"/theorems\"},{\"text\":\"Verification\",\"link\":\"/verification\"},{\"text\":\"Receipts\",\"link\":\"/receipts\"},{\"text\":\"Next leads\",\"link\":\"/next-leads\"},{\"text\":\"Playground\",\"link\":\"/playground\"},{\"text\":\"Purify\",\"link\":\"/purify\"},{\"text\":\"Graph\",\"link\":\"/graph\"},{\"text\":\"Readiness\",\"link\":\"/readiness\"},{\"text\":\"Imagination\",\"link\":\"/imagination\"},{\"text\":\"Stream\",\"link\":\"/stream\"},{\"text\":\"End to end\",\"link\":\"/e2e\"},{\"text\":\"Legal\",\"link\":\"/legal\"},{\"text\":\"Repository\",\"link\":\"/repository\"},{\"text\":\"Metrics\",\"link\":\"/metrics\"}],\"sidebar\":[{\"text\":\"Pages\",\"items\":[{\"text\":\"Processor\",\"link\":\"/processor\"},{\"text\":\"Chat\",\"link\":\"/chat\"},{\"text\":\"Use cases\",\"link\":\"/use-cases\"},{\"text\":\"Roadmap\",\"link\":\"/roadmap\"},{\"text\":\"Cirq\",\"link\":\"/cirq\"},{\"text\":\"Software\",\"link\":\"/software\"},{\"text\":\"Algorithms\",\"link\":\"/algorithms\"},{\"text\":\"Quantum Echoes\",\"link\":\"/echo\"},{\"text\":\"Responsibility\",\"link\":\"/responsibility\"},{\"text\":\"MCP\",\"link\":\"/mcp\"},{\"text\":\"Clay register\",\"link\":\"/clay\"},{\"text\":\"Textbook\",\"link\":\"/textbook\"},{\"text\":\"Examples\",\"link\":\"/examples\"},{\"text\":\"Leads\",\"link\":\"/leads\"},{\"text\":\"Audit\",\"link\":\"/audit\"},{\"text\":\"Discovery\",\"link\":\"/discovery\"},{\"text\":\"Match\",\"link\":\"/match\"},{\"text\":\"Theorems\",\"link\":\"/theorems\"},{\"text\":\"Verification\",\"link\":\"/verification\"},{\"text\":\"Receipts\",\"link\":\"/receipts\"},{\"text\":\"Next leads\",\"link\":\"/next-leads\"},{\"text\":\"Playground\",\"link\":\"/playground\"},{\"text\":\"Purify\",\"link\":\"/purify\"},{\"text\":\"Graph\",\"link\":\"/graph\"},{\"text\":\"Readiness\",\"link\":\"/readiness\"},{\"text\":\"Imagination\",\"link\":\"/imagination\"},{\"text\":\"Stream\",\"link\":\"/stream\"},{\"text\":\"End to end\",\"link\":\"/e2e\"},{\"text\":\"Legal\",\"link\":\"/legal\"},{\"text\":\"Repository\",\"link\":\"/repository\"},{\"text\":\"Metrics\",\"link\":\"/metrics\"}]},{\"text\":\"Toolbox google\",\"items\":[{\"text\":\"processor\",\"link\":\"/mcp#processor\"},{\"text\":\"circuit\",\"link\":\"/mcp#circuit\"},{\"text\":\"echo\",\"link\":\"/mcp#echo\"},{\"text\":\"echo_benchmark\",\"link\":\"/mcp#echo_benchmark\"},{\"text\":\"roadmap\",\"link\":\"/mcp#roadmap\"},{\"text\":\"algorithm\",\"link\":\"/mcp#algorithm\"},{\"text\":\"software\",\"link\":\"/mcp#software\"},{\"text\":\"statements\",\"link\":\"/mcp#statements\"},{\"text\":\"repositories\",\"link\":\"/mcp#repositories\"},{\"text\":\"quantumlib\",\"link\":\"/mcp#quantumlib\"},{\"text\":\"quantum-error-correction\",\"link\":\"/mcp#quantum-error-correction\"},{\"text\":\"chemistry-simulation\",\"link\":\"/mcp#chemistry-simulation\"},{\"text\":\"fault-tolerant-design\",\"link\":\"/mcp#fault-tolerant-design\"}]},{\"text\":\"Toolbox tree\",\"items\":[{\"text\":\"leads\",\"link\":\"/mcp#leads\"},{\"text\":\"audit\",\"link\":\"/mcp#audit\"},{\"text\":\"match\",\"link\":\"/mcp#match\"},{\"text\":\"clay\",\"link\":\"/mcp#clay\"},{\"text\":\"verify\",\"link\":\"/mcp#verify\"},{\"text\":\"metrics\",\"link\":\"/mcp#metrics\"},{\"text\":\"textbook\",\"link\":\"/mcp#textbook\"},{\"text\":\"css\",\"link\":\"/mcp#css\"},{\"text\":\"dashboard\",\"link\":\"/mcp#dashboard\"},{\"text\":\"clone\",\"link\":\"/mcp#clone\"}]},{\"text\":\"Toolbox flow\",\"items\":[{\"text\":\"discover\",\"link\":\"/mcp#discover\"},{\"text\":\"wave\",\"link\":\"/mcp#wave\"},{\"text\":\"readiness\",\"link\":\"/mcp#readiness\"},{\"text\":\"imagine\",\"link\":\"/mcp#imagine\"},{\"text\":\"e2e\",\"link\":\"/mcp#e2e\"}]},{\"text\":\"Toolbox language\",\"items\":[{\"text\":\"translate\",\"link\":\"/mcp#translate\"},{\"text\":\"prose\",\"link\":\"/mcp#prose\"}]},{\"text\":\"Toolbox raid\",\"items\":[{\"text\":\"mongo\",\"link\":\"/mcp#mongo\"}]},{\"text\":\"Toolbox billing\",\"items\":[{\"text\":\"stripe\",\"link\":\"/mcp#stripe\"}]},{\"text\":\"Toolbox legal\",\"items\":[{\"text\":\"legal\",\"link\":\"/mcp#legal\"}]},{\"text\":\"Toolbox repository\",\"items\":[{\"text\":\"repository\",\"link\":\"/mcp#repository\"}]},{\"text\":\"Toolbox standards\",\"items\":[{\"text\":\"jsonld\",\"link\":\"/mcp#jsonld\"},{\"text\":\"codes\",\"link\":\"/mcp#codes\"}]},{\"text\":\"Toolbox payload\",\"items\":[{\"text\":\"payload\",\"link\":\"/mcp#payload\"},{\"text\":\"configure\",\"link\":\"/mcp#configure\"}]},{\"text\":\"Toolbox extension\",\"items\":[{\"text\":\"extend\",\"link\":\"/mcp#extend\"}]}]},\"locales\":{\"root\":{\"label\":\"English\",\"lang\":\"en\"},\"bg\":{\"label\":\"Български\",\"lang\":\"bg\",\"link\":\"/bg/\",\"description\":\"превод по речник; страниците са следи\"}},\"cleanUrls\":true,\"additionalConfig\":{}}");
// node_modules/vitepress/dist/client/app/data.js
var dataSymbol = Symbol();
var siteDataRef = shallowRef(readonly(_siteData_default));
function initData(route) {
	const site = computed(() => resolveSiteDataByRoute(siteDataRef.value, route.data.relativePath, route.data.filePath));
	const appearance = site.value.appearance;
	const isDark = appearance === "force-dark" ? ref(true) : appearance === "force-auto" ? usePreferredDark() : appearance ? useDark({
		storageKey: APPEARANCE_KEY,
		initialValue: () => appearance === "dark" ? "dark" : "auto",
		...typeof appearance === "object" ? appearance : {}
	}) : ref(false);
	return {
		site,
		theme: computed(() => site.value.themeConfig),
		page: computed(() => route.data),
		frontmatter: computed(() => route.data.frontmatter),
		params: computed(() => route.data.params),
		lang: computed(() => site.value.lang),
		dir: computed(() => route.data.frontmatter.dir || site.value.dir),
		localeIndex: computed(() => site.value.localeIndex || "root"),
		title: computed(() => createTitle(site.value, route.data)),
		description: computed(() => route.data.description || site.value.description),
		isDark
	};
}
function useData() {
	const data = inject(dataSymbol);
	if (!data) throw new Error("vitepress data not properly injected in app");
	return data;
}
// node_modules/vitepress/dist/client/app/utils.js
var resolvedBase;
/**
* Runtime base path used by the app.
*
* Usually this is the configured site base.
*
* For a relative base (`'./'`), the mount point is unknown at build time, so:
* - SSR: uses `RELATIVE_BASE_SENTINEL` (for per-page URL relativization)
* - dev browser: uses `'/'` (dev server always mounts at root)
* - prod browser: resolves from the page's `__VP_SITE_ROOT__`
*/
function runtimeBase() {
	if (resolvedBase === void 0) {
		const base = siteDataRef.value.base;
		if (!isRelativeBase(base)) return resolvedBase = base;
		if (!inBrowser) return resolvedBase = RELATIVE_BASE_SENTINEL;
		const root = window.__VP_SITE_ROOT__;
		resolvedBase = root ? decodeURIComponent(new URL(root, location.href).pathname) : "/";
	}
	return resolvedBase;
}
/**
* Prepend base to internal (non-relative) urls
*/
function withBase(path) {
	return EXTERNAL_URL_RE.test(path) || !path.startsWith("/") ? path : joinPath(runtimeBase(), path);
}
/**
* Converts a url path to the corresponding js chunk filename.
*/
function pathToFile(path) {
	let pagePath = path.replace(/\.html$/, "");
	pagePath = decodeURIComponent(pagePath);
	pagePath = pagePath.replace(/\/$/, "/index");
	if (inBrowser) {
		const base = runtimeBase();
		if (pagePath + "/" === base) pagePath = base;
		if (!pagePath.startsWith(base)) return null;
		pagePath = sanitizeFileName(pagePath.slice(base.length).replace(/\//g, "_") || "index") + ".md";
		let pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
		if (!pageHash) {
			pagePath = pagePath.endsWith("_index.md") ? pagePath.slice(0, -9) + ".md" : pagePath.slice(0, -3) + "_index.md";
			pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
		}
		if (!pageHash) return null;
		pagePath = `${base}assets/${pagePath}.${pageHash}.js`;
	} else pagePath = `./${sanitizeFileName(pagePath.slice(1).replace(/\//g, "_"))}.md.js`;
	return pagePath;
}
var contentUpdatedCallbacks = [];
/**
* Register callback that is called every time the markdown content is updated
* in the DOM.
*/
function onContentUpdated(fn) {
	contentUpdatedCallbacks.push(fn);
	tryOnUnmounted(() => {
		contentUpdatedCallbacks = contentUpdatedCallbacks.filter((f) => f !== fn);
	});
}
// node_modules/vitepress/dist/client/app/composables/icon.js
/**
* Resolves an icon name (`collection:name`, e.g. `simple-icons:github`) to
* its `vpi-<collection>-<name>` class. During SSR the name is registered so
* the build emits its CSS rule; in dev the SVG is served on demand and
* applied to `el` inline.
*/
function useIcon(icon, el) {
	const parsed = computed(() => {
		const value = toValue(icon);
		return typeof value === "string" ? parseIconName(value) : null;
	});
	const iconClass = computed(() => parsed.value ? `vpi-${parsed.value.collection}-${parsed.value.icon}` : void 0);
	{
		const ctx = useSSRContext();
		const value = toValue(icon);
		if (typeof value === "string") ctx?.vpIcons.add(value);
	}
	return iconClass;
}
// node_modules/vitepress/dist/client/app/router.js
var RouterSymbol = Symbol();
var fakeHost = "http://a.com";
var getDefaultRoute = () => ({
	path: "/",
	hash: "",
	query: "",
	component: null,
	data: notFoundPageData
});
function createRouter(loadPageModule, fallbackComponent) {
	const route = reactive(getDefaultRoute());
	const router = {
		route,
		async go(href, options) {
			const { hash } = new URL(href, fakeHost);
			const hasTextFragment = inBrowser && document.fragmentDirective && hash.includes(":~:");
			href = normalizeHref(href);
			if (await router.onBeforeRouteChange?.(href) === false) return;
			if (!inBrowser || await changeRoute(href, {
				...options,
				hasTextFragment
			})) await loadPage(href, { initialLoad: !!options?.initialLoad });
			if (hasTextFragment) location.hash = hash;
			syncRouteQueryAndHash();
			await router.onAfterRouteChange?.(href);
		}
	};
	let latestPendingPath = null;
	async function loadPage(href, { scrollPosition = 0, isRetry = false, initialLoad = false } = {}) {
		if (await router.onBeforePageLoad?.(href) === false) return;
		const targetLoc = new URL(href, fakeHost);
		const pendingPath = latestPendingPath = targetLoc.pathname;
		try {
			let page = await loadPageModule(pendingPath);
			if (!page) throw new Error(`Page not found: ${pendingPath}`);
			if (latestPendingPath === pendingPath) {
				latestPendingPath = null;
				const { default: comp, __pageData } = page;
				if (!comp) throw new Error(`Invalid route component: ${comp}`);
				await router.onAfterPageLoad?.(href);
				route.path = inBrowser ? pendingPath : withBase(pendingPath);
				route.component = markRaw(comp);
				route.data = markRaw(__pageData);
				syncRouteQueryAndHash(targetLoc);
				if (inBrowser) nextTick(() => {
					let actualPathname = runtimeBase() + __pageData.relativePath.replace(/(?:(^|\/)index)?\.md$/, "$1");
					if (!siteDataRef.value.cleanUrls && !actualPathname.endsWith("/")) actualPathname += ".html";
					if (actualPathname !== targetLoc.pathname) {
						targetLoc.pathname = actualPathname;
						href = actualPathname + targetLoc.search + targetLoc.hash;
						history.replaceState({}, "", href);
					}
					if (!initialLoad) scrollTo(targetLoc.hash, scrollPosition);
				});
			}
		} catch (err) {
			if (!/fetch|Page not found/.test(err.message) && !/^\/404(\.html|\/)?$/.test(href)) console.error(err);
			if (!isRetry) try {
				const res = await fetch(runtimeBase() + "hashmap.json");
				window.__VP_HASH_MAP__ = await res.json();
				await loadPage(href, {
					scrollPosition,
					isRetry: true,
					initialLoad
				});
				return;
			} catch (e) {}
			if (latestPendingPath === pendingPath) {
				latestPendingPath = null;
				route.path = inBrowser ? pendingPath : withBase(pendingPath);
				route.component = fallbackComponent ? markRaw(fallbackComponent) : null;
				const relativePath = inBrowser ? route.path.replace(/(^|\/)$/, "$1index").replace(/(\.html)?$/, ".md").slice(runtimeBase().length) : "404.md";
				route.data = {
					...notFoundPageData,
					relativePath
				};
				syncRouteQueryAndHash(targetLoc);
			}
		}
	}
	function syncRouteQueryAndHash(loc = inBrowser ? location : {
		search: "",
		hash: ""
	}) {
		route.query = loc.search;
		route.hash = decodeURIComponent(loc.hash);
	}
	if (inBrowser) {
		if (history.state === null) history.replaceState({}, "");
		window.addEventListener("click", (e) => {
			if (e.defaultPrevented || !(e.target instanceof Element) || e.target.closest("button") || e.button !== 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
			const link = e.target.closest("a");
			if (!link || link.closest(".vp-raw") || link.hasAttribute("download") || link.hasAttribute("target")) return;
			const linkHref = link.getAttribute("href") ?? (link instanceof SVGAElement ? link.getAttribute("xlink:href") : null);
			if (linkHref == null) return;
			const { href, origin, pathname } = new URL(linkHref, link.baseURI);
			if (origin === new URL(location.href).origin && treatAsHtml(pathname)) {
				e.preventDefault();
				router.go(href);
			}
		}, { capture: true });
		window.addEventListener("popstate", async (e) => {
			if (e.state === null) return;
			const href = normalizeHref(location.href);
			await loadPage(href, { scrollPosition: e.state.scrollPosition || 0 });
			syncRouteQueryAndHash();
			await router.onAfterRouteChange?.(href);
		});
		window.addEventListener("hashchange", (e) => {
			e.preventDefault();
			syncRouteQueryAndHash();
		});
	}
	return router;
}
function useRouter() {
	const router = inject(RouterSymbol);
	if (!router) throw new Error("useRouter() is called without provider.");
	return router;
}
function useRoute() {
	return useRouter().route;
}
function scrollTo(hash, scrollPosition = 0) {
	if (!hash || scrollPosition) {
		window.scrollTo(0, scrollPosition);
		return;
	}
	let target = null;
	try {
		target = document.getElementById(decodeURIComponent(hash).slice(1));
	} catch (e) {
		console.warn(e);
	}
	if (!target) return;
	const scrollToTarget = () => {
		target.scrollIntoView({ block: "start" });
		target.focus({ preventScroll: true });
		if (document.activeElement === target) return;
		if (target.hasAttribute("tabindex")) return;
		const restoreTabindex = () => {
			target.removeAttribute("tabindex");
			target.removeEventListener("blur", restoreTabindex);
		};
		target.setAttribute("tabindex", "-1");
		target.addEventListener("blur", restoreTabindex);
		target.focus({ preventScroll: true });
		if (document.activeElement !== target) restoreTabindex();
	};
	requestAnimationFrame(scrollToTarget);
}
function normalizeHref(href) {
	const url = new URL(href, fakeHost);
	url.pathname = url.pathname.replace(/(^|\/)index(\.html)?$/, "$1");
	if (siteDataRef.value.cleanUrls) url.pathname = url.pathname.replace(/\.html$/, "");
	else if (!url.pathname.endsWith("/") && !url.pathname.endsWith(".html")) url.pathname += ".html";
	return url.pathname + url.search + url.hash.split(":~:")[0];
}
async function changeRoute(href, { initialLoad = false, replace = false, hasTextFragment = false } = {}) {
	const loc = normalizeHref(location.href);
	const nextUrl = new URL(href, location.origin);
	const currentUrl = new URL(loc, location.origin);
	if (href === loc) {
		if (!initialLoad) {
			if (!hasTextFragment) scrollTo(nextUrl.hash);
			return false;
		}
	} else {
		if (replace) history.replaceState({}, "", href);
		else {
			history.replaceState({ scrollPosition: window.scrollY }, "");
			history.pushState({}, "", href);
		}
		if (nextUrl.pathname === currentUrl.pathname) {
			if (nextUrl.hash !== currentUrl.hash) {
				window.dispatchEvent(new HashChangeEvent("hashchange", {
					oldURL: currentUrl.href,
					newURL: nextUrl.href
				}));
				if (!hasTextFragment) scrollTo(nextUrl.hash);
			}
			return false;
		}
	}
	return true;
}
// node_modules/vitepress/dist/client/app/components/Content.js
var runCbs = () => contentUpdatedCallbacks.forEach((fn) => fn());
var Content = defineComponent({
	name: "VitePressContent",
	props: { as: {
		type: [Object, String],
		default: "div"
	} },
	setup(props) {
		const { frontmatter, site } = useData();
		const route = useRoute();
		watch(frontmatter, runCbs, {
			deep: true,
			flush: "post"
		});
		return () => h(props.as, site.value.contentProps ?? { style: { position: "relative" } }, [route.component ? h(route.component, {
			onVnodeMounted: runCbs,
			onVnodeUpdated: runCbs,
			onVnodeUnmounted: runCbs
		}) : "404 Page Not Found"]);
	}
});
export { isShell as C, ClientOnly as D, treatAsHtml as E, isRelativeBase as S, normalize as T, escapeRegExp as _, useRouter as a, isExternal as b, pathToFile as c, dataSymbol as d, initData as f, createTitle as g, EXTERNAL_URL_RE as h, useRoute as i, runtimeBase as l, useData as m, RouterSymbol as n, useIcon as o, siteDataRef as p, createRouter as r, onContentUpdated as s, Content as t, withBase as u, inBrowser as v, mergeHead as w, isObject as x, isActive as y };
