// \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
/** The harmonic series of the key downward by halving, each read as a hue in degrees. */
var HARMONICS = [
	432,
	216,
	108,
	54,
	27
];
var hueOf = (hz) => hz % 360;
/** The UUID's middle part (time_mid, time_hi_and_version, clock_seq) as four CMYK channels from three hex digits each. */
var cmykOfUuid = (uuid) => {
	const middle = uuid.replace(/-/g, "").slice(8, 20);
	const ch = (i) => parseInt(middle.slice(i * 3, i * 3 + 3), 16) / 4095;
	return {
		c: ch(0),
		m: ch(1),
		y: ch(2),
		k: ch(3)
	};
};
var rgbOfCmyk = ({ c, m, y, k }) => [
	Math.round(255 * (1 - c) * (1 - k)),
	Math.round(255 * (1 - m) * (1 - k)),
	Math.round(255 * (1 - y) * (1 - k))
];
var accentOfUuid = (uuid) => {
	const [r, g, b] = rgbOfCmyk(cmykOfUuid(uuid));
	return `rgb(${r} ${g} ${b})`;
};
/** The whole visual state of a block as custom properties computed from its UUID alone: the accent from the middle part as
* CMYK, the tail as a colour and an angle, the 9-vortex seed, its σ_10 reflection and its trinity as a period and a class. Computed once at the source; the stylesheet does the
* rest with no script, so a device renders at the cost of CSS and nothing else. */
var varsOf$1 = (uuid) => {
	const hex = uuid.replace(/-/g, "");
	const { c, m, y, k } = cmykOfUuid(uuid);
	const [r, g, b] = rgbOfCmyk({
		c,
		m,
		y,
		k
	});
	const tail = hex.slice(20);
	const one48 = parseInt(tail, 16);
	const seed = one48 === 0 ? 0 : 1 + (one48 - 1) % 9;
	const tr = parseInt(tail.slice(0, 2), 16), tg = parseInt(tail.slice(2, 4), 16), tb = parseInt(tail.slice(4, 6), 16);
	const hue = Math.round(parseInt(hex.slice(0, 8), 16) % 360);
	const reflectedHue = (360 - hue) % 360;
	const drift = Math.abs(2 * hue - 360);
	const dust = [];
	{
		let n = drift;
		for (let p = 2; p * p <= n; p += 1) while (n % p === 0) {
			dust.push(p);
			n /= p;
		}
		if (n > 1) dust.push(n);
	}
	const driftAngle = 2 * Math.PI * drift / 360;
	return {
		"--qpu-reflected-hue": String(reflectedHue),
		"--qpu-drift": String(drift),
		"--qpu-dust": dust.length ? dust.join(" ") : "0",
		"--qpu-drift-angle": driftAngle.toFixed(6),
		"--qpu-hue": String(hue),
		"--qpu-c": c.toFixed(3),
		"--qpu-m": m.toFixed(3),
		"--qpu-y": y.toFixed(3),
		"--qpu-k": k.toFixed(3),
		"--qpu-accent": `rgb(${r} ${g} ${b})`,
		"--qpu-tail": `rgb(${tr} ${tg} ${tb})`,
		"--qpu-angle": String(one48 % 360),
		"--qpu-vortex": String(seed),
		"--qpu-reflection": String(10 - seed),
		"--qpu-trinity": seed === 0 ? "0" : seed % 3 === 0 ? "3" : [
			7,
			4,
			1
		].includes(seed) ? "7" : "2",
		"--qpu-period": `${(seed || 9) * 432}ms`,
		"--block-accent": `rgb(${r} ${g} ${b})`
	};
};
var styleOf = (uuid) => Object.entries(varsOf$1(uuid)).map(([k, v]) => `${k}: ${v}`).join("; ");
/** The stylesheet from the key: custom properties the widgets may use beside the host's own tokens, and the rules that draw
* every block from its own custom properties — no script, motion only where the device allows it, off-screen blocks at no
* cost (content-visibility), dark and light from the device's preference. */
var cssOf = (key = 432) => {
	return [
		`:root {`,
		`  --a432-key: ${key};`,
		`  --a432-hue: ${hueOf(key)};`,
		...HARMONICS.map((h, i) => `  --a432-${i + 1}: hsl(${hueOf(h)} 62% ${44 + i * 8}%);`),
		`  --a432-accent: hsl(${hueOf(key)} 62% 44%);`,
		`}`,
		`/* every block draws itself from the custom properties its UUID set on its root; nothing here needs a script */`,
		`.qpu-block { border-left: 3px solid var(--qpu-accent, var(--a432-accent)); padding-left: var(--pad-sm, 8px); content-visibility: auto; contain-intrinsic-size: auto 240px; background: linear-gradient(90deg, color-mix(in oklab, var(--qpu-accent, var(--a432-accent)) 6%, transparent), transparent 60%); }`,
		`.qpu-block::before { content: ''; display: block; height: 3px; margin-bottom: var(--gap-sm, 6px); background: conic-gradient(from calc(var(--qpu-angle, 0) * 1deg) at 50% 120%, var(--qpu-accent, var(--a432-accent)), var(--qpu-tail, var(--a432-2)), var(--qpu-accent, var(--a432-accent))); }`,
		`.qpu-block [data-status] { border-left: 2px solid var(--qpu-status, var(--a432-3)); padding-left: 4px; }`,
		`.qpu-block [data-status="served"] { --qpu-status: var(--a432-1); } .qpu-block [data-status="partial"] { --qpu-status: var(--a432-2); } .qpu-block [data-status="open"] { --qpu-status: var(--a432-3); } .qpu-block [data-status="blocked"], .qpu-block [data-status="out_of_scope"] { --qpu-status: var(--a432-5); }`,
		`@media (prefers-reduced-motion: no-preference) { .qpu-block::before { animation: qpu-vortex var(--qpu-period, ${key * 9}ms) linear infinite; } @keyframes qpu-vortex { to { filter: hue-rotate(360deg); } } }`,
		`@media (prefers-color-scheme: dark) { .qpu-block { background: linear-gradient(90deg, color-mix(in oklab, var(--qpu-accent, var(--a432-accent)) 12%, transparent), transparent 60%); } }`,
		`@media print { .qpu-block::before { animation: none; } }`
	].join("\n") + "\n";
};
/** A block's wrapper: its accent as a custom property, drawn as the left rule. */
var wrapOf = (uuid, html) => `<div data-block="${uuid}" class="qpu-block" data-vortex="${varsOf$1(uuid)["--qpu-vortex"]}" style="${styleOf(uuid)}; border-left: 3px solid var(--qpu-accent); padding-left: var(--pad-sm, 8px);">${html}</div>`;
// src/quantum/license.ts
var LICENSE = {
	spdx: "CC-BY-NC-ND-4.0",
	url: "https://uuidna.com/license",
	deed: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
	/** the unit's content address of the licence and its imprint, from the uuidna MCP get_rights door */
	address: "9ffcda04-5adc-872e-9358-6b831bbd0c0d",
	imprint: "459a7ef3-7a8b-8d8e-893a-099292addcd5",
	canonical: "https://uuidna.com",
	copyright: "© 2025 Tsvetan Rouschev (ceccec@psg.bg)",
	representation: "uuidna is represented by https://uuidna.com only; no handle or profile elsewhere speaks for the work unless licensed in writing by the author.",
	disclaimer: "Recomputable facts, not legal advice: the inputs a qualified attorney starts from, never the conclusion.",
	author: "Tsvetan Rouschev",
	orcid: "https://orcid.org/0009-0000-7312-9778",
	contact: "ceccec@psg.bg",
	work: "@uuidna/qpu",
	attribution: "Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)",
	terms: "Attribute the author; do not distribute a derivative; commercial use of the QPU framework, over UUID or by any other means, requires a licence from the author (ceccec@psg.bg). The a432 harmonic default is offered for free benefit under attribution."
};
/** The MCP `instructions` every client receives at initialize. */
var INSTRUCTIONS = `Content served by this server is © ${LICENSE.author} under ${LICENSE.spdx} (${LICENSE.url}). ${LICENSE.terms} Every result carries _meta.license; keep it with the content.`;
/** The attribution line rendered at the foot of every widget. */
var attributionHtml = () => `<p data-license="${LICENSE.spdx}" style="font-size: var(--font-size-footnote, 11px); color: var(--text-secondary); margin: var(--gap-sm, 6px) 0 0;">© <a href="${LICENSE.orcid}" style="color: inherit;">${LICENSE.author}</a> · <a href="${LICENSE.url}" style="color: inherit;">${LICENSE.spdx}</a> · commercial use by licence (${LICENSE.contact})</p>`;
// src/quantum/blocks.ts
/** FNV-1a 64 fold of a string to 16 lowercase hex digits, the fold the unit builds every receipt and address on. */
var foldOf = (text) => {
	let h = 14695981039346656037n;
	for (let i = 0; i < text.length; i++) {
		h ^= BigInt(text.charCodeAt(i));
		h = h * 1099511628211n & 18446744073709551615n;
	}
	return h.toString(16).padStart(16, "0");
};
var bigPowMod = (base, exp, modulus) => {
	if (modulus <= 1n) return 0n;
	let x = 1n % modulus, b = (base % modulus + modulus) % modulus, e = exp;
	while (e > 0n) {
		if (e % 2n === 1n) x = x * b % modulus;
		b = b * b % modulus;
		e /= 2n;
	}
	return x;
};
/** The unit's content UUID, ported one for one from uuidna's shapeUuidOf: two folds, of the text and of the text marked,
*  laid out 12+1+3 | variant | 3+12 as 8-4-4-4-12, the variant nibble from the low fold (8..b), and the version nibble
*  DECIDED by the content: 1 + (rest^rays mod C(faces, coins)) mod mintOf(n) = 1 + (rest^7 mod 91) mod 8, so a tampered
*  middle wears a version its content does not. The same text gives the same UUID here and at uuidna.com. */
/** 32 hex digits stamped and grouped 8-4-4-4-12: the version nibble (position 12) is DECIDED by the other 31. */
var stampOf = (digits) => {
	const rest = `${digits.slice(0, 12)}${digits.slice(13)}`;
	const version = (1 + Number(bigPowMod(BigInt(`0x${rest}`), 7n, 91n) % 8n)).toString(16);
	return `${digits.slice(0, 8)}-${digits.slice(8, 12)}-${version}${digits.slice(13, 16)}-${digits.slice(16, 20)}-${digits.slice(20, 32)}`;
};
var uuidOf = (text) => {
	const high = foldOf(text);
	const low = foldOf(`${text}\u0000shape`);
	const variant = (parseInt(low.slice(0, 1), 16) % 4 + 8).toString(16);
	return stampOf(`${high.slice(0, 12)}${high.slice(15, 16)}${high.slice(12, 15)}${variant}${low.slice(1, 4)}${low.slice(4, 16)}`);
};
/** A UUID reassembled from its parts: handle (8 hex), ten program nibbles, tail (12 hex); the variant nibble is 8 and the version is
*  decided by the stamp, so the result is a valid, sealed address whose channel reads back the same handle, program and tail. */
var uuidFromParts = (handle, program, tail) => {
	if (!/^[0-9a-f]{8}$/.test(handle) || program.length !== 10 || program.some((n) => !Number.isInteger(n) || n < 0 || n > 15) || !/^[0-9a-f]{12}$/.test(tail)) throw new Error("a handle is 8 hex, a program ten nibbles 0..15, a tail 12 hex");
	const p = program.map((n) => n.toString(16));
	return stampOf(`${handle}${`${p.slice(0, 4).join("")}0${p.slice(4, 7).join("")}8${p.slice(7, 10).join("")}`}${tail}`);
};
var compileOf = (program, tools, message) => {
	const usable = tools.filter((t) => ![
		"audit",
		"match",
		"verify"
	].includes(t.name));
	const steps = program.map((nibble, i) => {
		const tool = usable[nibble % usable.length];
		const args = {};
		let k = 0;
		for (const [name, spec] of Object.entries(tool.inputSchema.properties ?? {})) {
			const required = tool.inputSchema.required?.includes(name);
			if (spec.enum && (required || nibble % 2 === 1)) args[name] = spec.enum[(nibble + i) % spec.enum.length];
			else if ((spec.type === "integer" || spec.type === "number") && (required || typeof spec.default !== "undefined")) {
				const raw = message.three16[k++ % 3];
				if (spec.type === "number" && typeof spec.maximum !== "number") args[name] = Math.round(raw / 65536 * 1e4) / 1e4;
				else {
					const lo = spec.minimum ?? 0;
					args[name] = lo + raw % ((spec.maximum ?? Math.max(lo, raw)) - lo + 1);
				}
			}
		}
		return {
			nibble,
			tool: tool.name,
			arguments: args
		};
	});
	return {
		steps,
		next: steps[0]
	};
};
/** The cheap check without the content: the version nibble the other 31 nibbles decide, read back. A tampered middle wears a
*  version its content does not; one modular power tells. Shape and variant are checked too. */
var sealOf = (uuid) => {
	const shape = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(uuid);
	if (!shape) return {
		valid: false,
		shape,
		variant: false,
		version: {
			found: "",
			expected: "",
			agree: false
		}
	};
	const digits = uuid.replace(/-/g, "");
	const found = digits[12];
	const rest = `${digits.slice(0, 12)}${digits.slice(13)}`;
	const expected = (1 + Number(bigPowMod(BigInt(`0x${rest}`), 7n, 91n) % 8n)).toString(16);
	const variant = /^[89ab]$/.test(digits[16]);
	return {
		valid: variant && found === expected,
		shape,
		variant,
		version: {
			found,
			expected,
			agree: found === expected
		}
	};
};
/** Content, neighbours, seal: what one UUID can be checked against, each check independent and each cheap. */
var verifyOf = (uuid, content, prev, next, self) => {
	const seal = sealOf(uuid);
	const checks = [
		{
			check: "seal",
			passed: seal.valid,
			evidence: seal.shape ? `version ${seal.version.found} vs decided ${seal.version.expected}; variant ${seal.variant ? "in 8..b" : "out of range"}` : "not an RFC 9562 shape"
		},
		{
			check: "content",
			passed: content === void 0 ? null : uuidOf(content) === uuid,
			evidence: content === void 0 ? "no content given" : `uuidOf(content) = ${uuidOf(content)}`
		},
		{
			check: "prev",
			passed: prev === void 0 || self === void 0 ? null : self.prev === prev.id,
			evidence: prev === void 0 || self === void 0 ? "no predecessor given" : `self.prev ${self.prev ?? "none"} vs prev.id ${prev.id}`
		},
		{
			check: "next",
			passed: next === void 0 ? null : next.prev === uuid,
			evidence: next === void 0 ? "no successor given" : `next.prev ${next.prev ?? "none"} vs ${uuid}`
		}
	];
	const decided = checks.filter((c) => c.passed !== null);
	return {
		uuid,
		channel: channelOf$2(uuid),
		reflection: reflectionOf(uuid),
		valid: decided.every((c) => c.passed),
		checks,
		decided: decided.length,
		cost: "one modular power for the seal, one fold for the content, two string equalities for the neighbours",
		bound: "the fold is tamper-evident and separates content; it is not collision-resistant against an adversary who searches for one. The docket and the receipts carry a SHA-256 beside it for that case."
	};
};
/** The tail read every way at once — the program's step decides which reading it means. */
var tailReadingsOf = (tail) => {
	const one48 = parseInt(tail, 16);
	const bytes = [...Array(6).keys()].map((i) => parseInt(tail.slice(i * 2, i * 2 + 2), 16));
	const text6 = bytes.every((b) => b >= 32 && b < 127) ? String.fromCharCode(...bytes) : null;
	const date = new Date(one48);
	const timestamp = one48 >= Date.UTC(1970, 0, 2) && one48 <= Date.UTC(2100, 0, 1) ? date.toISOString() : null;
	const two24 = [parseInt(tail.slice(0, 6), 16), parseInt(tail.slice(6), 16)];
	return {
		one48,
		two24,
		three16: [
			parseInt(tail.slice(0, 4), 16),
			parseInt(tail.slice(4, 8), 16),
			parseInt(tail.slice(8), 16)
		],
		text6,
		timestamp,
		referrer: {
			handle: tail.slice(0, 8),
			flags: parseInt(tail.slice(8), 16)
		},
		colour: {
			rgb: `#${tail.slice(0, 6)}`,
			key: parseInt(tail.slice(6), 16) / 16777215
		},
		coordinate: {
			lat: Math.round((two24[0] / 16777215 * 180 - 90) * 1e6) / 1e6,
			lon: Math.round((two24[1] / 16777215 * 360 - 180) * 1e6) / 1e6
		},
		vortex: (() => {
			const seed = one48 === 0 ? 0 : 1 + (one48 - 1) % 9;
			const trinity = seed === 0 ? [] : seed % 3 === 0 ? [
				3,
				6,
				9
			] : [
				7,
				4,
				1
			].includes(seed) ? [
				7,
				4,
				1
			] : [
				2,
				5,
				8
			];
			const reflected = trinity.map((x) => 10 - x);
			return {
				seed,
				reflection: seed === 0 ? 0 : 10 - seed,
				fixed: seed === 5,
				polarity: seed === 0 ? "zero" : seed < 5 ? "minus" : seed > 5 ? "plus" : "fixed",
				trinity,
				reflected,
				tuned: trinity[0] === 3,
				key: 432
			};
		})()
	};
};
/** The channel a UUID is: handle (8 hex, the family), the hex PROGRAM (the twelve middle nibbles; the version and variant nibbles
*  are kept, the other ten are one formula index each), and the MESSAGE in the tail (12 hex = 48 bits: one 48-bit natural, two
*  24-bit, or three 16-bit). Read from the id alone, so a page's head is computable without any lookup. */
var channelOf$2 = (uuid) => {
	const hex = uuid.replace(/-/g, "");
	const handle = hex.slice(0, 8);
	const middle = hex.slice(8, 20);
	const tail = hex.slice(20, 32);
	const program = [...middle].map((c, i) => ({
		nibble: c,
		kept: i === 4 || i === 8,
		value: parseInt(c, 16)
	})).filter((n) => !n.kept).map((n) => n.value);
	return {
		uuid,
		handle,
		middle,
		tail,
		program,
		version: middle[4],
		variant: middle[8],
		message: tailReadingsOf(tail),
		door: `qpu://${handle}`,
		words: `${handle} · program ${program.join("")} · tail ${tail}`
	};
};
/** The reflection of an address: σ applied to every part at once — each program nibble to 15 − n, the tail to its 48-bit complement
*  (so every reading mirrors), the handle to its complement family — stamped into a valid address. Reflecting twice returns the
*  parts (Qpu.Sigma: σ_d(σ_d(x)) = x); the version nibble is decided afresh each time, so only the parts round-trip, by design. */
var reflectionOf = (uuid) => {
	const ch = channelOf$2(uuid);
	const handle = [...ch.handle].map((c) => (15 - parseInt(c, 16)).toString(16)).join("");
	const program = ch.program.map((n) => 15 - n);
	const tail = [...ch.tail].map((c) => (15 - parseInt(c, 16)).toString(16)).join("");
	return {
		of: uuid,
		mirror: uuidFromParts(handle, program, tail),
		handle,
		program,
		tail,
		readings: tailReadingsOf(tail),
		fixed: ch.program.filter((n) => n === 15 - n).length,
		note: "σ_15 on nibbles has no fixed point; the pair is two states held at once"
	};
};
var describe = (structured) => {
	const text = JSON.stringify(structured) ?? "";
	return text.length <= 200 ? text : text.slice(0, 197) + "…";
};
var escapeOf = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
var blockOf = (tool, args, structured, html, description) => {
	const query = Object.keys(args).length ? "?" + new URLSearchParams(Object.entries(args).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)])).toString() : "";
	const id = uuidOf(`${tool}${JSON.stringify(args)}`);
	const wrapped = wrapOf(id, `<div role="heading" aria-level="2" style="font-size: var(--font-size-footnote); color: var(--text-muted); margin-bottom: var(--gap-sm, 6px);">${tool} · ${escapeOf(description)}</div>` + html + attributionHtml());
	return {
		id,
		html: wrapped,
		theme: {
			key: 432,
			hue: hueOf(432),
			cmyk: cmykOfUuid(id),
			accent: accentOfUuid(id)
		},
		openGraph: {
			"og:title": `${tool} · @uuidna/qpu`,
			"og:description": describe(structured),
			"og:type": "website",
			"og:url": `qpu://tools/${tool}${query}`,
			"og:site_name": "@uuidna/qpu",
			"article:author": LICENSE.author,
			license: `${LICENSE.spdx} ${LICENSE.url}`
		},
		shadcn: {
			$schema: "https://ui.shadcn.com/schema/registry-item.json",
			name: `qpu-${tool}-${id.slice(0, 8)}`,
			type: "registry:block",
			title: `${tool} · @uuidna/qpu`,
			description,
			registryDependencies: [
				"card",
				"table",
				"badge"
			],
			author: `${LICENSE.author} <${LICENSE.contact}> (${LICENSE.orcid})`,
			license: LICENSE.spdx,
			files: [{
				path: `blocks/qpu-${tool}-${id.slice(0, 8)}.html`,
				type: "registry:block",
				content: wrapped
			}],
			meta: {
				tool,
				arguments: args,
				id
			}
		}
	};
};
// src/quantum/cirq.ts
var cirq_exports = /* @__PURE__ */ __exportAll({
	CNOT: () => CNOT,
	CZ: () => CZ,
	Circuit: () => Circuit,
	DensityMatrixSimulator: () => DensityMatrixSimulator,
	Device: () => Device,
	GridQubit: () => GridQubit,
	H: () => H,
	LineQubit: () => LineQubit,
	Moment: () => Moment,
	NamedQubit: () => NamedQubit,
	QuantumVirtualMachine: () => QuantumVirtualMachine,
	Result: () => Result,
	SWAP: () => SWAP,
	Simulator: () => Simulator,
	TOFFOLI: () => TOFFOLI,
	X: () => X,
	Y: () => Y,
	Z: () => Z,
	ZZ: () => ZZ,
	adjointOf: () => adjointOf,
	applied: () => applied,
	expectationOf: () => expectationOf,
	exponentialOf: () => exponentialOf,
	keyOf: () => keyOf,
	measure: () => measure,
	noisy: () => noisy,
	pauliProduct: () => pauliProduct,
	powerOf: () => powerOf,
	randomOf: () => randomOf
});
/** The qubit's key: a stable text form, used for ordering and equality. */
var keyOf = (q) => q.kind === "line" ? `line:${q.x}` : q.kind === "grid" ? `grid:${q.row},${q.col}` : `named:${q.name}`;
var LineQubit = {
	of: (x) => ({
		kind: "line",
		x
	}),
	range: (n) => Array.from({ length: n }, (_, x) => ({
		kind: "line",
		x
	}))
};
var GridQubit = {
	of: (row, col) => ({
		kind: "grid",
		row,
		col
	}),
	square: (n) => Array.from({ length: n * n }, (_, i) => ({
		kind: "grid",
		row: Math.floor(i / n),
		col: i % n
	}))
};
var NamedQubit = { of: (name) => ({
	kind: "named",
	name
}) };
var s2 = Math.SQRT1_2;
var c = (re, im = 0) => [re, im];
var X = {
	name: "X",
	arity: 1,
	matrix: [
		c(0),
		c(1),
		c(1),
		c(0)
	]
};
var Y = {
	name: "Y",
	arity: 1,
	matrix: [
		c(0),
		c(0, -1),
		c(0, 1),
		c(0)
	]
};
var Z = {
	name: "Z",
	arity: 1,
	matrix: [
		c(1),
		c(0),
		c(0),
		c(-1)
	]
};
var H = {
	name: "H",
	arity: 1,
	matrix: [
		c(s2),
		c(s2),
		c(s2),
		c(-s2)
	]
};
var CZ = {
	name: "CZ",
	arity: 2,
	matrix: [
		c(1),
		c(0),
		c(0),
		c(0),
		c(0),
		c(1),
		c(0),
		c(0),
		c(0),
		c(0),
		c(1),
		c(0),
		c(0),
		c(0),
		c(0),
		c(-1)
	]
};
var CNOT = {
	name: "CNOT",
	arity: 2,
	matrix: [
		c(1),
		c(0),
		c(0),
		c(0),
		c(0),
		c(1),
		c(0),
		c(0),
		c(0),
		c(0),
		c(0),
		c(1),
		c(0),
		c(0),
		c(1),
		c(0)
	]
};
var SWAP = {
	name: "SWAP",
	arity: 2,
	matrix: [
		c(1),
		c(0),
		c(0),
		c(0),
		c(0),
		c(0),
		c(1),
		c(0),
		c(0),
		c(1),
		c(0),
		c(0),
		c(0),
		c(0),
		c(0),
		c(1)
	]
};
/** Cirq's ZZ: Z on each of two qubits. Its eigenvalues are ±1, so ZZ**t is powerOf(ZZ, t), the gate QAOA's cost layer uses. */
var ZZ = {
	name: "ZZ",
	arity: 2,
	matrix: [
		c(1),
		c(0),
		c(0),
		c(0),
		c(0),
		c(-1),
		c(0),
		c(0),
		c(0),
		c(0),
		c(-1),
		c(0),
		c(0),
		c(0),
		c(0),
		c(1)
	]
};
/** Cirq's TOFFOLI (CCX): flips the third qubit when the first two are both 1. Identity except rows 6 and 7 swapped. */
var TOFFOLI = {
	name: "TOFFOLI",
	arity: 3,
	matrix: Array.from({ length: 64 }, (_, k) => {
		const r = Math.floor(k / 8), col = k % 8;
		return c(r === col && r < 6 || r === 6 && col === 7 || r === 7 && col === 6 ? 1 : 0);
	})
};
/** Refuses a gate that is not an involution (G·G ≠ I): the powers and exponentials here are exact for involutions only. */
var assertInvolution = (gate, what) => {
	const dim = 1 << gate.arity;
	const at = (m, r, s) => m[r * dim + s];
	for (let r = 0; r < dim; r++) for (let s = 0; s < dim; s++) {
		let sr = 0, si = 0;
		for (let k = 0; k < dim; k++) {
			const [ar, ai] = at(gate.matrix, r, k), [br, bi] = at(gate.matrix, k, s);
			sr += ar * br - ai * bi;
			si += ar * bi + ai * br;
		}
		if (Math.abs(sr - (r === s ? 1 : 0)) > 1e-12 || Math.abs(si) > 1e-12) throw new Error(`${gate.name} is not an involution, so its ${what} is not defined here`);
	}
};
/** Cirq's gate power, G**t: the +1 eigenspace keeps its phase and the −1 eigenspace takes e^{iπt}, so X**0.5 is the square
*  root of NOT, as Cirq documents. Exact for the involutions here (G·G = I); any other gate is refused, not approximated. */
var powerOf = (gate, t) => {
	assertInvolution(gate, "power");
	const dim = 1 << gate.arity;
	const at = (m, r, s) => m[r * dim + s];
	const [cr, ci] = [Math.cos(Math.PI * t), Math.sin(Math.PI * t)];
	const matrix = [];
	for (let r = 0; r < dim; r++) for (let s = 0; s < dim; s++) {
		const [gr, gi] = at(gate.matrix, r, s);
		const id = r === s ? 1 : 0;
		const pr = (id + gr) / 2, pi = gi / 2;
		const mr = (id - gr) / 2, mi = -gi / 2;
		matrix.push([pr + cr * mr - ci * mi, pi + cr * mi + ci * mr]);
	}
	return {
		name: `${gate.name}**${t}`,
		arity: gate.arity,
		matrix
	};
};
/** The exponential exp(−iθG) of an involution G, without a global phase: cos θ·I − i sin θ·G. This is the rotation a
*  variational ansatz applies, exp(−iθ Y⊗X) for H₂; Cirq writes it as G**(2θ/π) up to the phase e^{iθ}, which an expectation
*  value cannot see. Any gate that is not an involution is refused. */
var exponentialOf = (gate, theta) => {
	assertInvolution(gate, "exponential");
	const dim = 1 << gate.arity;
	const [cs, sn] = [Math.cos(theta), Math.sin(theta)];
	const matrix = [];
	for (let r = 0; r < dim; r++) for (let s = 0; s < dim; s++) {
		const [gr, gi] = gate.matrix[r * dim + s];
		const id = r === s ? 1 : 0;
		matrix.push([cs * id + sn * gi, -sn * gr]);
	}
	return {
		name: `exp(−i·${theta}·${gate.name})`,
		arity: gate.arity,
		matrix
	};
};
/** The tensor product of single-qubit Paulis, P₁⊗P₂⊗…, as one gate on as many qubits: the first Pauli acts on the first qubit
*  given. Every Pauli string squares to the identity, so it is an involution: powerOf and exponentialOf apply to it. */
var pauliProduct = (paulis) => {
	const single = {
		X,
		Y,
		Z,
		I: {
			name: "I",
			arity: 1,
			matrix: [
				c(1),
				c(0),
				c(0),
				c(1)
			]
		}
	};
	const factors = paulis.map((p) => single[p]);
	let matrix = [c(1)];
	let dim = 1;
	for (const f of factors) {
		const next = [];
		for (let r = 0; r < dim * 2; r++) for (let s = 0; s < dim * 2; s++) {
			const [ar, ai] = matrix[Math.floor(r / 2) * dim + Math.floor(s / 2)];
			const [br, bi] = f.matrix[r % 2 * 2 + s % 2];
			next.push([ar * br - ai * bi, ar * bi + ai * br]);
		}
		matrix = next;
		dim *= 2;
	}
	return {
		name: paulis.join("⊗"),
		arity: paulis.length,
		matrix
	};
};
/** The adjoint of a gate, G†: the conjugate transpose of its unitary. It is the inverse of any gate, so an echo can run
*  its backward half with the true inverse of each operation rather than the operation itself. */
var adjointOf = (gate) => {
	const dim = 1 << gate.arity;
	const matrix = [];
	for (let r = 0; r < dim; r++) for (let s = 0; s < dim; s++) {
		const [re, im] = gate.matrix[s * dim + r];
		matrix.push([re, -im]);
	}
	return {
		name: `${gate.name}†`,
		arity: gate.arity,
		matrix
	};
};
/** Cirq's operation form: a gate applied to qubits. gate(...qubits) returns the operation. */
var applied = (gate, ...qubits) => {
	if (qubits.length !== gate.arity) throw new Error(`${gate.name} acts on ${gate.arity} qubit(s), not ${qubits.length}`);
	return {
		kind: "gate",
		gate,
		qubits
	};
};
/** cirq.measure(*qubits, key=...): tags the measured qubits' results with the key. */
var measure = (qubits, key) => ({
	kind: "measure",
	key,
	qubits
});
/** A channel placed in the circuit, as Cirq's cirq.bit_flip(p).on(q) is: the noise acts on each qubit named, where the
*  operation sits, and nowhere else. The density-matrix simulator applies it exactly; the state-vector simulator refuses it. */
var noisy = (channel, ...qubits) => ({
	kind: "channel",
	channel,
	qubits
});
var touches = (op, qubits) => op.qubits.some((q) => qubits.has(keyOf(q)));
/** Cirq's Moment: operations in the same time slice, on disjoint qubits. */
var Moment = class {
	operations;
	constructor(operations = []) {
		this.operations = operations;
		const seen = /* @__PURE__ */ new Set();
		for (const op of operations) for (const q of op.qubits) {
			if (seen.has(keyOf(q))) throw new Error(`a moment acts on one qubit twice: ${keyOf(q)}`);
			seen.add(keyOf(q));
		}
	}
};
var flattenOps = (op) => Symbol.iterator in Object(op) && !("kind" in op) ? [...op].flatMap(flattenOps) : [op];
/** Cirq's Circuit: a list of moments. Appended operations are placed by an InsertStrategy, EARLIEST by default. */
var Circuit = class {
	moments = [];
	constructor(operations = []) {
		for (const item of operations) item instanceof Moment ? this.moments.push(item) : this.append(item);
	}
	append(op, strategy = "EARLIEST") {
		flattenOps(op).forEach((single, i) => {
			const placed = strategy === "NEW_THEN_INLINE" ? i === 0 ? "NEW" : "INLINE" : strategy;
			this.place(single, placed);
		});
		return this;
	}
	place(single, strategy) {
		const mine = new Set(single.qubits.map(keyOf));
		if (strategy === "NEW") {
			this.moments.push(new Moment([single]));
			return;
		}
		if (strategy === "INLINE") {
			const last = this.moments.length - 1;
			if (last >= 0 && !this.moments[last].operations.some((o) => touches(o, mine))) this.moments[last] = new Moment([...this.moments[last].operations, single]);
			else this.moments.push(new Moment([single]));
			return;
		}
		let last = -1;
		this.moments.forEach((m, i) => {
			if (m.operations.some((o) => touches(o, mine))) last = i;
		});
		const at = last + 1;
		if (at === this.moments.length) this.moments.push(new Moment([single]));
		else this.moments[at] = new Moment([...this.moments[at].operations, single]);
	}
	/** The qubits the circuit acts on, in key order: the basis order of the simulator. */
	get qubits() {
		const byKey = /* @__PURE__ */ new Map();
		for (const m of this.moments) for (const op of m.operations) for (const q of op.qubits) byKey.set(keyOf(q), q);
		return [...byKey.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([, q]) => q);
	}
	get operations() {
		return this.moments.flatMap((m) => m.operations);
	}
};
/** Cirq's Device: the qubits a processor has and the two-qubit operations it accepts. An operation fits when its qubits are
*  the device's, and a two-qubit gate acts on a coupler, a pair the hardware connects. */
var Device = class {
	keys;
	couplerKeys;
	qubitList;
	edgeList;
	constructor(qubits, couplers) {
		this.qubitList = [...qubits];
		this.edgeList = couplers.map(([a, b]) => [a, b]);
		this.keys = new Set(qubits.map(keyOf));
		this.couplerKeys = new Set(couplers.map(([a, b]) => pairKey(a, b)));
	}
	/** Cirq's qubit_set: the qubits the device has. */
	get qubitSet() {
		return [...this.qubitList];
	}
	/** Cirq's nx_graph edges: the couplers, each a pair of qubits the hardware connects. */
	get edges() {
		return this.edgeList.map(([a, b]) => [a, b]);
	}
	validateOperation(op) {
		for (const q of op.qubits) if (!this.keys.has(keyOf(q))) throw new Error(`${keyOf(q)} is not a qubit of this device`);
		if (op.kind === "gate" && op.qubits.length === 2 && !this.couplerKeys.has(pairKey(op.qubits[0], op.qubits[1]))) throw new Error(`${op.gate.name} acts on ${keyOf(op.qubits[0])} and ${keyOf(op.qubits[1])}, which the device does not couple`);
	}
	/** Cirq's validate_moment: every operation of the moment fits the device. */
	validateMoment(moment) {
		for (const op of moment.operations) this.validateOperation(op);
	}
	/** Cirq's validate_circuit, by default: every moment is validated. */
	validateCircuit(circuit) {
		for (const moment of circuit.moments) this.validateMoment(moment);
	}
};
var pairKey = (a, b) => [keyOf(a), keyOf(b)].sort().join("|");
/** The result of run(): the sampled bitstrings per measurement key. */
var Result = class {
	records;
	constructor(records) {
		this.records = records;
	}
	/** The bitstrings of one key, one per repetition. */
	measurements(key) {
		return this.records.get(key) ?? [];
	}
	/** Cirq's histogram(key): how many repetitions gave each bitstring. */
	histogram(key) {
		const counts = /* @__PURE__ */ new Map();
		for (const bits of this.measurements(key)) {
			const value = parseInt(bits || "0", 2);
			counts.set(value, (counts.get(value) ?? 0) + 1);
		}
		return counts;
	}
};
var MAX_QUBITS = 20;
/** Applies a gate to the qubits at the given indices of the state. Index bit k is the k-th qubit in the basis order. */
var applyGate = (state, gate, indices) => {
	Math.log2(state.re.length);
	const dim = 1 << gate.arity;
	const mask = indices.reduce((m, i) => m | 1 << i, 0);
	for (let base = 0; base < state.re.length; base++) {
		if (base & mask) continue;
		const idx = new Array(dim);
		for (let s = 0; s < dim; s++) {
			let k = base;
			for (let b = 0; b < gate.arity; b++) if (s & 1 << gate.arity - 1 - b) k |= 1 << indices[b];
			idx[s] = k;
		}
		const re = idx.map((k) => state.re[k]);
		const im = idx.map((k) => state.im[k]);
		for (let r = 0; r < dim; r++) {
			let nr = 0, ni = 0;
			for (let s = 0; s < dim; s++) {
				const [mr, mi] = gate.matrix[r * dim + s];
				nr += mr * re[s] - mi * im[s];
				ni += mr * im[s] + mi * re[s];
			}
			state.re[idx[r]] = nr;
			state.im[idx[r]] = ni;
		}
	}
};
/** The probability of each bit value of one qubit, and the collapse of the state to a measured value. */
var measureQubit = (state, index, random) => {
	let p1 = 0;
	for (let k = 0; k < state.re.length; k++) if (k & 1 << index) p1 += state.re[k] ** 2 + state.im[k] ** 2;
	const bit = random() < p1 ? 1 : 0;
	const norm = Math.sqrt(bit ? p1 : 1 - p1) || 1;
	for (let k = 0; k < state.re.length; k++) {
		const kept = (k & 1 << index ? 1 : 0) === bit;
		state.re[k] = kept ? state.re[k] / norm : 0;
		state.im[k] = kept ? state.im[k] / norm : 0;
	}
	return bit;
};
/** A random source seeded by text (mulberry32 over a 32-bit fold of the text): the same seed draws the same samples on
*  every host, so a sampled result is a function of its arguments and the gate's copies agree. */
var randomOf = (seed) => {
	let a = 2654435769;
	for (let i = 0; i < seed.length; i += 1) a = Math.imul(a ^ seed.charCodeAt(i), 2246822507) >>> 0;
	return () => {
		a = a + 1831565813 >>> 0;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
};
/** Cirq's Simulator: simulate() returns the final state, run() samples measurement results. */
var Simulator = class {
	random;
	constructor(random = Math.random) {
		this.random = random;
	}
	initial(circuit) {
		const order = circuit.qubits;
		if (order.length > MAX_QUBITS) throw new Error(`the simulator handles up to ${MAX_QUBITS} qubits, the circuit has ${order.length}`);
		const dim = 1 << order.length;
		const re = new Float64Array(dim);
		const im = new Float64Array(dim);
		re[0] = 1;
		const pos = new Map(order.map((q, i) => [keyOf(q), i]));
		return {
			state: {
				re,
				im
			},
			order,
			indexOf: (q) => pos.get(keyOf(q))
		};
	}
	/** The final wave function: a list of amplitudes, one per basis state, with the qubit order of circuit.qubits. */
	simulate(circuit) {
		const { state, order, indexOf } = this.initial(circuit);
		for (const op of circuit.operations) {
			if (op.kind === "channel") throw new Error(`a ${op.channel.name} channel runs on the density matrix, not on a state vector`);
			if (op.kind === "gate") applyGate(state, op.gate, op.qubits.map(indexOf));
		}
		return {
			amplitudes: Array.from(state.re, (r, k) => [r, state.im[k]]),
			qubits: order
		};
	}
	/** Sampled results: the circuit is run once per repetition, with each measurement collapsing the state. */
	run(circuit, repetitions) {
		if (!circuit.operations.some((op) => op.kind === "measure")) throw new Error("run needs at least one measurement");
		const records = /* @__PURE__ */ new Map();
		for (let rep = 0; rep < repetitions; rep++) {
			const { state, indexOf } = this.initial(circuit);
			const bits = /* @__PURE__ */ new Map();
			for (const op of circuit.operations) {
				if (op.kind === "channel") throw new Error(`a ${op.channel.name} channel runs on the density matrix, not on a state vector`);
				if (op.kind === "gate") applyGate(state, op.gate, op.qubits.map(indexOf));
				else bits.set(op.key, op.qubits.map((q) => measureQubit(state, indexOf(q), this.random)));
			}
			for (const [key, values] of bits) {
				const list = records.get(key) ?? [];
				list.push(values.join(""));
				records.set(key, list);
			}
		}
		return new Result(records);
	}
};
var MAX_DENSITY_QUBITS = 8;
/** The unitary a gate acts as on n qubits: column c is the state the gate makes of basis state |c>. */
var unitaryOf = (gate, indices, n) => {
	const dim = 1 << n;
	const u = {
		re: new Float64Array(dim * dim),
		im: new Float64Array(dim * dim)
	};
	for (let c = 0; c < dim; c++) {
		const column = {
			re: new Float64Array(dim),
			im: new Float64Array(dim)
		};
		column.re[c] = 1;
		applyGate(column, gate, indices);
		for (let r = 0; r < dim; r++) {
			u.re[r * dim + c] = column.re[r];
			u.im[r * dim + c] = column.im[r];
		}
	}
	return u;
};
var multiply = (a, b, dim) => {
	const out = {
		re: new Float64Array(dim * dim),
		im: new Float64Array(dim * dim)
	};
	for (let r = 0; r < dim; r++) for (let k = 0; k < dim; k++) {
		const ar = a.re[r * dim + k], ai = a.im[r * dim + k];
		if (ar === 0 && ai === 0) continue;
		for (let c = 0; c < dim; c++) {
			out.re[r * dim + c] += ar * b.re[k * dim + c] - ai * b.im[k * dim + c];
			out.im[r * dim + c] += ar * b.im[k * dim + c] + ai * b.re[k * dim + c];
		}
	}
	return out;
};
/** The adjoint of a matrix: the conjugate transpose. */
var dagger$1 = (m, dim) => {
	const out = {
		re: new Float64Array(dim * dim),
		im: new Float64Array(dim * dim)
	};
	for (let r = 0; r < dim; r++) for (let c = 0; c < dim; c++) {
		out.re[r * dim + c] = m.re[c * dim + r];
		out.im[r * dim + c] = -m.im[c * dim + r];
	}
	return out;
};
/** U ρ U†: a unitary acting on a density matrix. */
var conjugate = (u, rho, dim) => multiply(multiply(u, rho, dim), dagger$1(u, dim), dim);
var ONE = {
	name: "I",
	arity: 1,
	matrix: [
		c(1),
		c(0),
		c(0),
		c(1)
	]
};
var operator = (matrix) => ({
	name: "K",
	arity: 1,
	matrix
});
/** A Pauli (or identity) scaled by the square root of a weight, so that its square carries the weight. */
var weighted$1 = (gate, weight) => ({
	name: gate.name,
	arity: 1,
	matrix: gate.matrix.map(([r, i]) => [r * Math.sqrt(weight), i * Math.sqrt(weight)])
});
var probability = (p, name) => {
	if (p < 0 || p > 1) throw new Error(`the ${name} probability ${p} is between 0 and 1`);
};
/** Cirq's channels as Kraus operators: E(ρ) = Σ K ρ K†. The definitions are Cirq's own. */
var krausOf = (channel) => {
	switch (channel.name) {
		case "bit_flip":
			probability(channel.p, "bit-flip");
			return [weighted$1(ONE, 1 - channel.p), weighted$1(X, channel.p)];
		case "phase_flip":
			probability(channel.p, "phase-flip");
			return [weighted$1(ONE, 1 - channel.p), weighted$1(Z, channel.p)];
		case "depolarize":
			probability(channel.p, "depolarizing");
			return [
				weighted$1(ONE, 1 - channel.p),
				weighted$1(X, channel.p / 3),
				weighted$1(Y, channel.p / 3),
				weighted$1(Z, channel.p / 3)
			];
		case "asymmetric_depolarize": {
			const { p_x: px, p_y: py, p_z: pz } = channel;
			probability(px, "x"), probability(py, "y"), probability(pz, "z");
			if (px + py + pz > 1) throw new Error("the asymmetric depolarizing probabilities sum to more than 1");
			return [
				weighted$1(ONE, 1 - px - py - pz),
				weighted$1(X, px),
				weighted$1(Y, py),
				weighted$1(Z, pz)
			];
		}
		case "amplitude_damp":
			probability(channel.gamma, "damping");
			return [operator([
				c(1),
				c(0),
				c(0),
				c(Math.sqrt(1 - channel.gamma))
			]), operator([
				c(0),
				c(Math.sqrt(channel.gamma)),
				c(0),
				c(0)
			])];
		case "phase_damp":
			probability(channel.gamma, "damping");
			return [operator([
				c(1),
				c(0),
				c(0),
				c(Math.sqrt(1 - channel.gamma))
			]), operator([
				c(0),
				c(0),
				c(0),
				c(Math.sqrt(channel.gamma))
			])];
		case "generalized_amplitude_damp": {
			const { p, gamma } = channel;
			probability(p, "generalized amplitude"), probability(gamma, "damping");
			return [
				operator([
					c(Math.sqrt(p)),
					c(0),
					c(0),
					c(Math.sqrt(p * (1 - gamma)))
				]),
				operator([
					c(0),
					c(Math.sqrt(p * gamma)),
					c(0),
					c(0)
				]),
				operator([
					c(Math.sqrt((1 - p) * (1 - gamma))),
					c(0),
					c(0),
					c(Math.sqrt(1 - p))
				]),
				operator([
					c(0),
					c(0),
					c(Math.sqrt((1 - p) * gamma)),
					c(0)
				])
			];
		}
		case "reset": return [operator([
			c(1),
			c(0),
			c(0),
			c(0)
		]), operator([
			c(0),
			c(1),
			c(0),
			c(0)
		])];
	}
};
/** A channel acting on one qubit of the density matrix: the sum of its Kraus operators conjugating ρ. */
var channelOn = (rho, index, channel, n) => {
	const dim = 1 << n;
	const out = {
		re: new Float64Array(dim * dim),
		im: new Float64Array(dim * dim)
	};
	for (const kraus of krausOf(channel)) {
		const term = conjugate(unitaryOf(kraus, [index], n), rho, dim);
		for (let k = 0; k < dim * dim; k++) {
			out.re[k] += term.re[k];
			out.im[k] += term.im[k];
		}
	}
	return out;
};
/** Cirq's DensityMatrixSimulator: the state as a density matrix, so a noisy channel acts exactly rather than by sampling.
*  A gate acts as U ρ U†; with a depolarizing probability p, each gate is followed by the depolarizing channel on each of
*  its qubits. A channel placed in the circuit (noisy) acts where it sits, on its qubits only, and draws no gate noise.
*  A pure state has purity 1; noise lowers it. Exact for up to 8 qubits. */
var DensityMatrixSimulator = class {
	simulate(circuit, channels = []) {
		if (typeof channels === "function") [1, 2].forEach((arity) => channels(arity).forEach(krausOf));
		else channels.forEach(krausOf);
		const order = circuit.qubits;
		if (order.length > MAX_DENSITY_QUBITS) throw new Error(`the density-matrix simulator handles up to ${MAX_DENSITY_QUBITS} qubits, the circuit has ${order.length}`);
		const n = order.length;
		const dim = 1 << n;
		const pos = new Map(order.map((q, i) => [keyOf(q), i]));
		let rho = {
			re: new Float64Array(dim * dim),
			im: new Float64Array(dim * dim)
		};
		rho.re[0] = 1;
		for (const op of circuit.operations) {
			if (op.kind === "channel") {
				krausOf(op.channel);
				for (const q of op.qubits) rho = channelOn(rho, pos.get(keyOf(q)), op.channel, n);
				continue;
			}
			if (op.kind !== "gate") continue;
			const indices = op.qubits.map((q) => pos.get(keyOf(q)));
			rho = conjugate(unitaryOf(op.gate, indices, n), rho, dim);
			const noise = typeof channels === "function" ? channels(op.gate.arity) : channels;
			for (const i of indices) for (const channel of noise) rho = channelOn(rho, i, channel, n);
		}
		const probabilities = Array.from({ length: dim }, (_, k) => rho.re[k * dim + k]);
		const trace = probabilities.reduce((sum, p) => sum + p, 0);
		let purity = 0;
		for (let k = 0; k < dim * dim; k++) purity += rho.re[k] ** 2 + rho.im[k] ** 2;
		return {
			qubits: order,
			density: rho,
			probabilities,
			trace,
			purity
		};
	}
};
/** Cirq's simulate_expectation_values for a Pauli string: Tr(ρ O), where O is the tensor product of the Paulis named by
*  qubit, and the identity on every other qubit. For a Hermitian observable the trace is real. */
var expectationOf = (result, observable) => {
	const n = result.qubits.length;
	const dim = 1 << n;
	const index = new Map(result.qubits.map((q, i) => [keyOf(q), i]));
	const paulis = {
		X,
		Y,
		Z
	};
	let op = {
		re: new Float64Array(dim * dim),
		im: new Float64Array(dim * dim)
	};
	for (let k = 0; k < dim; k++) op.re[k * dim + k] = 1;
	for (const [key, pauli] of Object.entries(observable)) {
		const i = index.get(key);
		if (i === void 0) throw new Error(`${key} is not a qubit of this result`);
		op = multiply(op, unitaryOf(paulis[pauli], [i], n), dim);
	}
	let trace = 0;
	for (let r = 0; r < dim; r++) for (let k = 0; k < dim; k++) trace += result.density.re[r * dim + k] * op.re[k * dim + r] - result.density.im[r * dim + k] * op.im[k * dim + r];
	return trace;
};
/** The Quantum Virtual Machine, as the Cirq page describes it: simulated hardware that mimics a device's constraints and
*  its noise. A circuit runs only if it fits the device, and it runs with the depolarizing noise the machine is given. */
var QuantumVirtualMachine = class {
	device;
	channels;
	simulator = new DensityMatrixSimulator();
	constructor(device, channels) {
		this.device = device;
		this.channels = channels;
	}
	simulate(circuit) {
		this.device.validateCircuit(circuit);
		return this.simulator.simulate(circuit, this.channels);
	}
};
// src/quantum/toolbox.ts
var toolOf = (toolbox, spec) => ({
	name: spec.name,
	toolbox,
	description: spec.description,
	inputSchema: spec.inputSchema,
	call: (args, ctx) => {
		const data = spec.run(args, ctx);
		return {
			structured: data,
			widget: spec.widget(data)
		};
	}
});
// src/quantum/standards.ts
var STANDARDS = [
	{
		id: "payload-site",
		name: "payloadcms.com, built with Payload (REST pages)",
		contract: "https://payloadcms.com/api/pages?limit=1&depth=0",
		kind: "reference"
	},
	{
		id: "schema-org",
		name: "schema.org vocabulary (JSON-LD)",
		contract: "https://schema.org/version/latest/schemaorg-current-https.jsonld",
		kind: "vocabulary"
	},
	{
		id: "cldr-languages",
		name: "Unicode CLDR language names (ISO 639)",
		contract: "https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main/en/languages.json",
		kind: "codes"
	},
	{
		id: "cldr-currencies",
		name: "Unicode CLDR currency names (ISO 4217)",
		contract: "https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-numbers-full/main/en/currencies.json",
		kind: "codes"
	},
	{
		id: "cldr-territories",
		name: "Unicode CLDR territory names (ISO 3166-1)",
		contract: "https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main/en/territories.json",
		kind: "codes"
	}
];
var AUTHOR = {
	"@type": "Person",
	name: LICENSE.author,
	"@id": LICENSE.orcid,
	identifier: LICENSE.orcid
};
var APPLICATION = {
	"@type": "SoftwareApplication",
	name: "@uuidna/qpu",
	applicationCategory: "DeveloperApplication",
	license: LICENSE.url,
	author: AUTHOR
};
/** The JSON-LD of a block: one tool's result as a CreativeWork of the application, identified by its content address. */
var blockJsonLdOf = (p) => ({
	"@context": "https://schema.org",
	"@type": "CreativeWork",
	"@id": p.url ?? `urn:uuid:${p.id}`,
	identifier: p.id,
	name: `${p.tool} · @uuidna/qpu`,
	description: p.description,
	isPartOf: APPLICATION,
	author: AUTHOR,
	license: LICENSE.url,
	inLanguage: p.locale ?? "en",
	dateModified: p.date ?? (/* @__PURE__ */ new Date()).toISOString(),
	keywords: [
		p.tool,
		p.toolbox ?? "qpu",
		"MCP",
		"quantum"
	].join(", "),
	isAccessibleForFree: true
});
/** The JSON-LD of a page of the documentation: a WebPage of the application; a UUID page carries its identifier. */
var pageJsonLdOf = (p) => ({
	"@context": "https://schema.org",
	"@type": "WebPage",
	"@id": p.url,
	url: p.url,
	name: p.title,
	description: p.description,
	...p.uuid ? { identifier: p.uuid } : {},
	isPartOf: {
		"@type": "WebSite",
		name: "@uuidna/qpu",
		url: "https://qpu.uuidna.com",
		license: LICENSE.url
	},
	about: APPLICATION,
	author: AUTHOR,
	license: LICENSE.url,
	inLanguage: p.locale ?? "en",
	dateModified: p.date ?? (/* @__PURE__ */ new Date()).toISOString()
});
/** The JSON-LD of a product variant of the catalogue: an Offer in an ISO 4217 currency. */
var offerJsonLdOf = (v) => ({
	"@context": "https://schema.org",
	"@type": "Offer",
	name: `${v.product} ${v.variant}`,
	description: v.description,
	price: (v.amount / 100).toFixed(2),
	priceCurrency: v.currency.toUpperCase(),
	itemOffered: {
		...APPLICATION,
		name: `QPU ${v.product.replace(/^qpu-/, "")}`
	},
	seller: AUTHOR,
	availability: "https://schema.org/InStock",
	...v.interval === "month" || v.interval === "year" ? { priceSpecification: {
		"@type": "UnitPriceSpecification",
		price: (v.amount / 100).toFixed(2),
		priceCurrency: v.currency.toUpperCase(),
		unitText: v.unit,
		billingIncrement: 1,
		billingDuration: 1,
		unitCode: v.interval === "month" ? "MON" : "ANN"
	} } : {}
});
/** The CLDR lists read into code sets: ISO 639 languages, ISO 4217 currencies, ISO 3166-1 territories. */
var codesOf = (cldr) => {
	const main = (doc) => {
		const m = doc?.main;
		return m ? Object.values(m)[0] : void 0;
	};
	return {
		languages: new Set(Object.keys(main(cldr.languages)?.localeDisplayNames?.languages ?? {})),
		currencies: new Set(Object.keys(main(cldr.currencies)?.numbers?.currencies ?? {})),
		territories: new Set(Object.keys(main(cldr.territories)?.localeDisplayNames?.territories ?? {}))
	};
};
/** The tree's codes against the standard: every locale an ISO 639 code, every currency an ISO 4217 code, every tenant country an ISO 3166-1 code. */
var validateOf = (codes, mine) => {
	const measured = codes.languages.size > 0 && codes.currencies.size > 0;
	const split = (list, set, norm) => ({
		valid: list.filter((c) => set.has(norm(c))),
		unknown: set.size ? list.filter((c) => !set.has(norm(c))) : []
	});
	const l = split(mine.locales, codes.languages, (s) => s.toLowerCase());
	const c = split(mine.currencies, codes.currencies, (s) => s.toUpperCase());
	const t = split(mine.territories ?? [], codes.territories, (s) => s.toUpperCase());
	return {
		languagesValid: l.valid,
		languagesUnknown: l.unknown,
		currenciesValid: c.valid,
		currenciesUnknown: c.unknown,
		territoriesValid: t.valid,
		territoriesUnknown: t.unknown,
		measured
	};
};
/** Which standard document a text is: the schema.org JSON-LD vocabulary, or a CLDR list. */
var detectStandard = (text) => {
	try {
		const j = JSON.parse(text);
		if (Array.isArray(j.docs) && j.docs[0] && typeof j.docs[0].createdAt === "string") {
			const d = j.docs[0];
			return {
				detected: "payload rest",
				note: `${j.totalDocs ?? j.docs.length} docs; blocks ${(d.layout ?? []).map((b) => b.blockType).join(", ") || "none"}; ${d.meta ? "seo meta" : "no meta"}; ${Array.isArray(d.breadcrumbs) ? `${d.breadcrumbs.length} breadcrumb(s)` : "no breadcrumbs"}: the site is the product's own output`
			};
		}
	} catch {}
	try {
		const j = JSON.parse(text);
		if (Array.isArray(j["@graph"]) && j["@context"]) return {
			detected: "json-ld vocabulary",
			note: `${j["@graph"].length} terms (${text.length.toLocaleString("en-US")} chars)`
		};
		const main = j.main;
		if (main) {
			const first = Object.values(main)[0];
			return {
				detected: "cldr json",
				note: `${first?.localeDisplayNames ? "locale display names" : first?.numbers ? "numbers" : "unknown"} (${text.length.toLocaleString("en-US")} chars)`
			};
		}
	} catch {}
	return null;
};
// src/quantum/discovery.ts
/** Cloudflare's MCP servers: the documentation server answers in the open; the rest answer 401 until a tenant brings its OAuth token. */
var CLOUDFLARE_MCP = [
	{
		host: "docs.mcp.cloudflare.com",
		url: "https://docs.mcp.cloudflare.com/mcp",
		about: "the Cloudflare documentation, searchable"
	},
	{
		host: "bindings.mcp.cloudflare.com",
		url: "https://bindings.mcp.cloudflare.com/mcp",
		about: "Workers bindings: KV, R2, D1, Durable Objects of the account"
	},
	{
		host: "observability.mcp.cloudflare.com",
		url: "https://observability.mcp.cloudflare.com/mcp",
		about: "Workers logs and analytics of the account"
	},
	{
		host: "radar.mcp.cloudflare.com",
		url: "https://radar.mcp.cloudflare.com/mcp",
		about: "Cloudflare Radar: internet traffic and trends"
	},
	{
		host: "browser.mcp.cloudflare.com",
		url: "https://browser.mcp.cloudflare.com/mcp",
		about: "browser rendering: fetch and screenshot pages"
	},
	{
		host: "ai-gateway.mcp.cloudflare.com",
		url: "https://ai-gateway.mcp.cloudflare.com/mcp",
		about: "AI Gateway logs and prompts"
	},
	{
		host: "dns-analytics.mcp.cloudflare.com",
		url: "https://dns-analytics.mcp.cloudflare.com/mcp",
		about: "DNS analytics of the account's zones"
	},
	{
		host: "autorag.mcp.cloudflare.com",
		url: "https://autorag.mcp.cloudflare.com/mcp",
		about: "AutoRAG: the account's indexed documents"
	}
];
/** The hosts discovered when a tenant names none: the unit, this tree and Cloudflare's eight servers. */
var DEFAULT_MCP_HOSTS = [
	"https://uuidna.com/mcp",
	"https://qpu.uuidna.com/mcp",
	...CLOUDFLARE_MCP.map((c) => c.url)
];
/** The JSON of an MCP answer, whether the host answered JSON or an event stream (the data line that is JSON). */
var dataOf = (text) => /^(event|data):/m.test(text) ? text.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim()).find((l) => l.startsWith("{")) ?? text : text;
/** What a client can fill from a theorem, a statement or a value, and what an answer may carry. */
var TAKES = [
	"statement",
	"claim",
	"input",
	"deposits",
	"proof",
	"key",
	"theorems",
	"message",
	"q",
	"query",
	"text",
	"value",
	"sources",
	"subject",
	"token",
	"tenant"
];
var ANSWERS$1 = [
	"verdict",
	"receipt",
	"deposited",
	"sealed",
	"signed",
	"verified",
	"proofRoot",
	"ready",
	"address",
	"role"
];
var rpcBody = (method, params) => ({
	jsonrpc: "2.0",
	id: 1,
	method,
	params
});
var idOf = (purpose, host, name) => `${purpose}:${host}${name ? `:${name}` : ""}`;
/** The first wave: every host's contract address. */
var discoveryRequestsOf = (mcpHosts, verifiers, auth = {}) => {
	const out = [];
	for (const url of mcpHosts) {
		const host = new URL(url).host;
		const headers = auth[host] ? { authorization: `Bearer ${auth[host]}` } : void 0;
		out.push({
			id: idOf("mcp-list", host),
			method: "POST",
			url,
			body: rpcBody("tools/list"),
			purpose: "mcp-list",
			host,
			headers
		});
		out.push({
			id: idOf("catalogue", host),
			method: "POST",
			url,
			body: rpcBody("tools/call", {
				name: "list_tools",
				arguments: {}
			}),
			purpose: "catalogue",
			host,
			headers
		});
		out.push({
			id: idOf("well-known", host),
			method: "GET",
			url: `https://${host}/.well-known/qpu.json`,
			purpose: "well-known",
			host
		});
	}
	for (const v of verifiers) if (v.contract) out.push({
		id: idOf("api-contract", new URL(v.contract).host, v.id),
		method: "GET",
		url: v.contract,
		purpose: "api-contract",
		host: new URL(v.contract).host,
		name: v.id
	});
	for (const st of STANDARDS) out.push({
		id: idOf("api-contract", new URL(st.contract).host, st.id),
		method: "GET",
		url: st.contract,
		purpose: "api-contract",
		host: new URL(st.contract).host,
		name: st.id
	});
	return out;
};
/** A JSON-RPC answer read: the result, or the error text. */
var resultOf = (a) => {
	if (a.status !== 200) return { error: a.status === 0 ? a.text.slice(0, 120) : a.status === 401 ? "HTTP 401: auth required" : `HTTP ${a.status}` };
	try {
		const j = JSON.parse(dataOf(a.text));
		if (j.error) return { error: j.error.message };
		if (j.result?.isError) return { error: j.result.content?.[0]?.text ?? "refused" };
		if (j.result?.tools) return { result: j.result };
		if (j.result?.structuredContent !== void 0) return { result: j.result.structuredContent };
		if (j.result?.content?.[0]) try {
			return { result: JSON.parse(j.result.content[0].text) };
		} catch {
			return { result: j.result.content[0].text };
		}
		return { result: j.result };
	} catch {
		return { error: `not JSON: ${a.text.slice(0, 80)}` };
	}
};
/** A door's capability from its contract: the properties it takes (of the ones a client can fill) and the keys it answers. */
var doorOf = (t, contract) => {
	const props = Object.keys(t.inputSchema?.properties ?? {});
	const outKeys = Object.keys(t.outputSchema?.properties ?? {});
	const fromText = (/Returns \{([^}]*)\}/.exec(t.description ?? "")?.[1] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
	const answers = [.../* @__PURE__ */ new Set([...outKeys, ...fromText])].filter((k) => ANSWERS$1.includes(k));
	return {
		name: t.name,
		description: (t.description ?? "").slice(0, 200),
		takes: props.filter((p) => TAKES.includes(p)),
		required: t.inputSchema?.required ?? [],
		answers,
		readOnly: t.annotations?.readOnlyHint ?? null,
		contract
	};
};
/** The second wave: the contract of every catalogue door that answers a verdict and is not in tools/list, not yet read. */
var followUpsOf = (answers) => {
	const done = new Set(answers.map((a) => a.id));
	const out = [];
	for (const a of answers.filter((x) => x.purpose === "catalogue")) {
		const r = resultOf(a);
		if (!r.result) continue;
		const names = Array.isArray(r.result) ? r.result : r.result.tools ?? [];
		const listed = new Set((resultOf(answers.find((x) => x.id === idOf("mcp-list", a.host)) ?? a).result?.tools ?? []).map((t) => t.name));
		for (const t of names) {
			if (listed.has(t.name) || !doorOf({
				name: t.name,
				description: t.description
			}, "catalogue").answers.length) continue;
			const id = idOf("contract", a.host, t.name);
			if (!done.has(id)) out.push({
				id,
				method: "POST",
				url: a.url,
				body: rpcBody("tools/call", {
					name: "list_tools",
					arguments: { name: t.name }
				}),
				purpose: "contract",
				host: a.host,
				name: t.name
			});
		}
	}
	return out;
};
/** Which document a host answered with: an OpenAPI or Swagger file (and its paths), a JSON index, an OAI identify, a page, nothing. */
var detect = (r) => {
	if (r.status === 0) return {
		detected: "unreachable",
		note: r.text.slice(0, 120)
	};
	if (r.status >= 400) return {
		detected: `HTTP ${r.status}`,
		note: "no contract at this address"
	};
	const t = r.text.trim();
	const standard = detectStandard(t);
	if (standard) return standard;
	try {
		const j = JSON.parse(t);
		if (j.openapi || j.swagger) {
			const paths = Object.keys(j.paths ?? {});
			return {
				detected: `openapi ${j.openapi ?? j.swagger}`,
				note: `${paths.length} paths, ${t.length.toLocaleString("en-US")} chars`,
				paths
			};
		}
		const schema = j.data?.__schema ?? j.__schema;
		if (schema) return {
			detected: "graphql schema",
			note: `${schema.types?.length ?? 0} types (${t.length.toLocaleString("en-US")} chars)`
		};
		if (j.links || j.hits || j.tools) return {
			detected: "json index",
			note: `${Object.keys(j).slice(0, 6).join(", ")} (${t.length.toLocaleString("en-US")} chars)`
		};
		return {
			detected: "json",
			note: Object.keys(j).slice(0, 6).join(", ")
		};
	} catch {}
	if (/^openapi:\s*\d/m.test(t) || /^swagger:/m.test(t)) {
		const paths = (t.match(/^\s{2}(\/[^:\s]+):/gm) ?? []).map((l) => l.trim().replace(/:$/, ""));
		return {
			detected: "openapi (yaml)",
			note: `${paths.length} paths, ${t.length.toLocaleString("en-US")} chars`,
			paths
		};
	}
	if (/<OAI-PMH|<Identify>/.test(t)) return {
		detected: "oai-pmh identify",
		note: /<repositoryName>([^<]*)/.exec(t)?.[1] ?? "identify"
	};
	if (/<html/i.test(t)) return {
		detected: "html page",
		note: /<title>([^<]*)/i.exec(t)?.[1]?.trim().slice(0, 80) ?? "a page: documentation for humans, no machine contract"
	};
	return {
		detected: r.type.split(";")[0] || "unknown",
		note: `${t.length.toLocaleString("en-US")} chars`
	};
};
/** Everything that came back, read into hosts, doors, capabilities and leads. */
var discoveryOf = (answers, verifiers) => {
	const hosts = [];
	const mcpHosts = [...new Set(answers.filter((a) => a.purpose === "mcp-list").map((a) => a.host))];
	for (const host of mcpHosts) {
		const list = answers.find((a) => a.id === idOf("mcp-list", host));
		const r = resultOf(list);
		const wk = answers.find((a) => a.id === idOf("well-known", host));
		if (!r.result) {
			hosts.push({
				host,
				kind: "mcp",
				contract: list.url,
				status: list.status,
				detected: list.status === 401 ? "auth required" : "unreachable",
				note: list.status === 401 ? `${CLOUDFLARE_MCP.find((c) => c.host === host)?.about ?? "an MCP host"}: answers 401 until the tenant brings its OAuth token` : r.error ?? "no answer",
				doors: []
			});
			if (wk) hosts.push({
				host,
				kind: "well-known",
				contract: wk.url,
				status: wk.status,
				...detect(wk)
			});
			continue;
		}
		const doors = r.result.tools.map((t) => doorOf(t, "tools/list"));
		let note = `${doors.length} tools in tools/list`;
		const cat = answers.find((a) => a.id === idOf("catalogue", host));
		const cr = cat ? resultOf(cat) : { error: "not asked" };
		if (cr.result) {
			const names = Array.isArray(cr.result) ? cr.result : cr.result.tools ?? [];
			const listed = new Set(doors.map((d) => d.name));
			let read = 0;
			for (const t of names) {
				if (listed.has(t.name)) continue;
				const contract = answers.find((a) => a.id === idOf("contract", host, t.name));
				const c = contract ? resultOf(contract) : null;
				if (c?.result && typeof c.result === "object") {
					doors.push(doorOf({
						...c.result,
						name: t.name,
						description: t.description
					}, "catalogue"));
					read += 1;
				} else doors.push({
					...doorOf({
						name: t.name,
						description: t.description
					}, "catalogue"),
					description: `${t.description.slice(0, 200)}${c?.error ? ` (contract unread: ${c.error.slice(0, 60)})` : ""}`
				});
			}
			note += `; ${names.length} in the catalogue door, ${read} contracts read`;
		} else note += `; catalogue door: ${cr.error}`;
		hosts.push({
			host,
			kind: "mcp",
			contract: list.url,
			status: 200,
			detected: "mcp tools/list",
			note,
			doors
		});
		if (wk) hosts.push({
			host,
			kind: "well-known",
			contract: wk.url,
			status: wk.status,
			...detect(wk)
		});
	}
	for (const st of STANDARDS) {
		const a = answers.find((x) => x.purpose === "api-contract" && x.name === st.id);
		hosts.push(a ? {
			host: a.host,
			kind: "api",
			contract: st.contract,
			status: a.status,
			...detect(a)
		} : {
			host: new URL(st.contract).host,
			kind: "api",
			contract: st.contract,
			status: 0,
			detected: "not asked",
			note: `${st.name}: the client did not fetch this standard`
		});
	}
	for (const v of verifiers) {
		if (!v.contract) {
			hosts.push({
				host: new URL(v.docs).host,
				kind: "api",
				contract: v.docs,
				status: 0,
				detected: "no machine contract named",
				note: `${v.id}: the registry names documentation for humans only; a lead`
			});
			continue;
		}
		const a = answers.find((x) => x.purpose === "api-contract" && x.name === v.id);
		hosts.push(a ? {
			host: a.host,
			kind: "api",
			contract: v.contract,
			status: a.status,
			...detect(a)
		} : {
			host: new URL(v.contract).host,
			kind: "api",
			contract: v.contract,
			status: 0,
			detected: "not asked",
			note: "the client did not fetch this contract"
		});
	}
	const doors = hosts.flatMap((h) => (h.doors ?? []).map((d) => ({
		host: h.host,
		url: h.contract,
		...d
	})));
	const takesAny = (d, ks) => d.takes.some((t) => ks.includes(t));
	return {
		hosts,
		doors,
		capabilities: {
			statementVerdict: doors.filter((d) => takesAny(d, [
				"statement",
				"claim",
				"input",
				"deposits"
			]) && d.answers.some((a) => [
				"verdict",
				"deposited",
				"sealed",
				"verified",
				"proofRoot"
			].includes(a)) && d.required.every((r) => TAKES.includes(r))).map((d) => d.name),
			signing: doors.filter((d) => d.answers.includes("signed")).map((d) => d.name),
			readiness: doors.filter((d) => d.answers.includes("ready")).map((d) => d.name),
			addressing: doors.filter((d) => d.takes.includes("value") && d.answers.includes("address")).map((d) => d.name),
			rbac: doors.filter((d) => d.takes.includes("token") && d.answers.includes("role")).map((d) => d.name),
			metaphysics: doors.filter((d) => /vortex|pentagram|fibonacci|triad|torus|involution|units|digital_root|living_field|gravity|spin|coprime|crt|diamond|sequence/.test(d.name)).map((d) => d.name)
		},
		leads: [...hosts.filter((h) => h.kind === "mcp" && h.detected === "auth required").map((h) => ({
			id: `mcp-auth-${h.host}`,
			source: h.contract,
			statement: `${h.host} answers 401 without a token: ${h.note}`,
			status: "open",
			reason: "tenant configurable: the operator sets QPU_MCP_TOKEN_<HOST> for the tenant and discovery reads the host's doors on the next run; nothing is assumed about them"
		})), ...hosts.filter((h) => h.kind === "api" && !/^openapi|json index|oai-pmh|json-ld|cldr|graphql/.test(h.detected)).map((h) => ({
			id: `contract-${h.host}`,
			source: h.contract,
			statement: `${h.host} publishes no machine-readable contract at the address the registry names (${h.detected})`,
			status: "open",
			reason: "the client is built from documentation read by a person; an OpenAPI or index document would let it be built from the host"
		}))]
	};
};
/** The discovery page, from the discovery alone. */
var discoveryPageOf = (d, date) => [
	"---",
	"title: Discovery",
	"order: 46",
	"---",
	"",
	"# Discovery before use",
	"",
	`Every host this tree talks to, asked for its contract on ${date} by \`npm run next\` through the \`discover\` tool: MCP hosts for tools/list and their catalogue door, API hosts for the OpenAPI, index or identify document the verifiers registry names, both domains for \`/.well-known/qpu.json\`. The client tools choose their doors from this table by capability, never from a name in code.`,
	"",
	"| Host | Kind | Contract | Status | Detected | Note |",
	"|---|---|---|---:|---|---|",
	...d.hosts.map((h) => `| ${h.host} | ${h.kind} | ${h.contract} | ${h.status || "—"} | ${h.detected} | ${h.note.replace(/\|/g, "\\|")} |`),
	"",
	"## Capabilities found",
	"",
	`Statement → verdict: ${d.capabilities.statementVerdict.join(", ") || "none"}. Signing: ${d.capabilities.signing.join(", ") || "none"}. Readiness: ${d.capabilities.readiness.join(", ") || "none"}. Addressing: ${d.capabilities.addressing.join(", ") || "none"}. RBAC (a token in, a role out): ${d.capabilities.rbac.join(", ") || "none: roles come from the tenant secrets until a Payload MCP host is named"}. Metaphysics (the arithmetic mod 9 every tail carries): ${d.capabilities.metaphysics.join(", ") || "none"}.`,
	"",
	"## Doors",
	"",
	`${d.doors.length} doors across ${d.hosts.filter((h) => h.kind === "mcp").length} MCP host(s).`,
	"",
	"| Host | Door | Takes | Required | Answers | Read-only | From |",
	"|---|---|---|---|---|---|---|",
	...d.doors.map((x) => `| ${x.host} | ${x.name} | ${x.takes.join(", ") || "—"} | ${x.required.join(", ") || "—"} | ${x.answers.join(", ") || "—"} | ${x.readOnly === null ? "?" : x.readOnly} | ${x.contract} |`),
	"",
	"## Leads",
	"",
	...d.leads.length ? d.leads.map((l) => `- \`${l.id}\`: ${l.statement}`) : ["none: every API host published a contract"],
	""
].join("\n");
// src/quantum/verifiers.ts
var VIA = "the client's own MCP fetches it; this handler does no I/O";
var VERIFIERS = [
	{
		id: "oeis",
		name: "The On-Line Encyclopedia of Integer Sequences",
		kind: "api",
		free: true,
		docs: "https://oeis.org/wiki/JSON_Format,_Compressed_Files",
		verifies: [
			"integer",
			"factors",
			"sequence"
		],
		requestOf: (f) => ({
			url: `https://oeis.org/search?fmt=json&q=${encodeURIComponent(f.kind === "sequence" ? `id:${f.value}` : f.value)}`,
			accept: "application/json",
			check: f.kind === "sequence" ? `the sequence ${f.value} exists and its name agrees with the lead: ${f.detail?.title ?? ""}` : f.kind === "factors" ? `the integer ${f.value} appears in the results; A027746 (prime factorisation rows) lists ${f.detail?.factors ?? "its factors"}` : `the integer ${f.value} appears in at least one sequence`
		})
	},
	{
		id: "github",
		name: "GitHub REST API, quantumlib organization",
		kind: "api",
		free: true,
		docs: "https://docs.github.com/en/rest/repos/repos",
		contract: "https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json",
		verifies: ["repository"],
		requestOf: (f) => ({
			url: `https://api.github.com/repos/quantumlib/${encodeURIComponent(f.value)}`,
			accept: "application/vnd.github+json",
			check: `description and language equal the repositories tool's entry for ${f.value}${f.detail?.language ? ` (${f.detail.language})` : ""}`
		})
	},
	{
		id: "source-page",
		name: "The statement's own source page",
		kind: "page",
		free: true,
		docs: "https://quantumai.google",
		verifies: ["page"],
		requestOf: (f) => ({
			url: f.value.startsWith("http") ? f.value : `https://${f.value}`,
			accept: "text/html",
			check: f.detail?.statement ? `the page states: ${f.detail.statement}` : "the page is reachable and states what the lead says"
		})
	},
	{
		id: "arxiv",
		name: "arXiv API",
		kind: "api",
		free: true,
		docs: "https://info.arxiv.org/help/api/index.html",
		contract: "https://export.arxiv.org/oai2?verb=Identify",
		verifies: ["preprint"],
		requestOf: (f) => ({
			url: `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(f.value)}`,
			accept: "application/atom+xml",
			check: `the entry's title and abstract match the statements tool's echoes_preprint topic`
		})
	},
	{
		id: "datacite",
		name: "DataCite REST API",
		kind: "api",
		free: true,
		docs: "https://support.datacite.org/docs/api",
		contract: "https://api.datacite.org/",
		verifies: ["doi"],
		requestOf: (f) => ({
			url: `https://api.datacite.org/dois/${encodeURIComponent(f.value)}`,
			accept: "application/vnd.api+json",
			check: `the DOI resolves; creators name Rouschev, Tsvetan with ORCID 0009-0000-7312-9778`
		})
	},
	{
		id: "zenodo",
		name: "Zenodo REST API",
		kind: "api",
		free: true,
		docs: "https://developers.zenodo.org",
		contract: "https://zenodo.org/api/",
		verifies: ["doi"],
		only: (f) => /^10\.5281\//.test(f.value),
		requestOf: (f) => ({
			url: `https://zenodo.org/api/records/${encodeURIComponent(f.value.replace(/^10\.5281\/zenodo\./, ""))}`,
			accept: "application/json",
			check: `metadata.creators[0].name is Rouschev, Tsvetan and metadata.title matches`
		})
	},
	{
		id: "doi-org",
		name: "The DOI resolver",
		kind: "api",
		free: true,
		docs: "https://www.doi.org/the-identifier/resources/factsheets/doi-resolution-documentation",
		verifies: ["doi"],
		requestOf: (f) => ({
			url: `https://doi.org/api/handles/${encodeURIComponent(f.value)}`,
			accept: "application/json",
			check: "the handle resolves to a URL (responseCode 1)"
		})
	},
	{
		id: "crossref",
		name: "Crossref REST API",
		kind: "api",
		free: true,
		docs: "https://api.crossref.org/swagger-ui/index.html",
		contract: "https://api.crossref.org/swagger-docs",
		verifies: ["doi"],
		only: (f) => !/^10\.(5281|7483)\//.test(f.value),
		requestOf: (f) => ({
			url: `https://api.crossref.org/works/${encodeURIComponent(f.value)}`,
			accept: "application/json",
			check: "the DOI is registered at Crossref"
		})
	},
	{
		id: "cern-opendata",
		name: "CERN Open Data portal API",
		kind: "api",
		free: true,
		docs: "https://opendata.cern.ch/docs/cod-api",
		contract: "https://opendata.cern.ch/api/records/?size=1",
		verifies: ["doi", "dataset"],
		only: (f) => f.kind === "dataset" || /^10\.7483\//.test(f.value),
		requestOf: (f) => ({
			url: f.kind === "dataset" ? `https://opendata.cern.ch/api/records/${encodeURIComponent(f.value)}` : `https://opendata.cern.ch/api/records/?q=doi:%22${encodeURIComponent(f.value)}%22`,
			accept: "application/json",
			check: "the record exists and its title matches the reference"
		})
	},
	{
		id: "nist-codata",
		name: "NIST CODATA fundamental physical constants",
		kind: "api",
		free: true,
		docs: "https://physics.nist.gov/cuu/Constants/",
		verifies: ["constant"],
		requestOf: (f) => ({
			url: `https://physics.nist.gov/cgi-bin/cuu/Value?${encodeURIComponent(f.value)}`,
			accept: "text/html",
			check: `the CODATA value of ${f.value} agrees with Qpu.Physics to the precision the Lean file states`
		})
	},
	{
		id: "cloudflare-docs",
		name: "Cloudflare documentation over MCP (docs.mcp.cloudflare.com)",
		kind: "mcp",
		free: true,
		docs: "https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/",
		contract: "https://docs.mcp.cloudflare.com/mcp",
		verifies: ["page"],
		only: (f) => /developers\.cloudflare\.com/.test(f.value),
		requestOf: (f) => ({
			url: "https://docs.mcp.cloudflare.com/mcp",
			method: "POST",
			body: {
				jsonrpc: "2.0",
				id: 1,
				method: "tools/call",
				params: {
					name: "search_cloudflare_documentation",
					arguments: { query: new URL(f.value).pathname.split("/").filter(Boolean).join(" ").replace(/-/g, " ").slice(0, 200) || "cloudflare" }
				}
			},
			accept: "application/json, text/event-stream",
			check: `the documentation search answers results for ${new URL(f.value).pathname}`
		})
	},
	{
		id: "wikipedia",
		name: "Wikipedia REST summary",
		kind: "api",
		free: true,
		docs: "https://en.wikipedia.org/api/rest_v1/",
		contract: "https://en.wikipedia.org/api/rest_v1/?spec",
		verifies: [
			"integer",
			"repository",
			"preprint",
			"sequence"
		],
		requestOf: (f) => ({
			url: `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(String(f.detail?.title ?? f.value))}`,
			accept: "application/json",
			check: "the summary agrees with the lead's statement"
		})
	}
];
/** Every request every verifier can make for a fact: cross-verification across all adaptors that can see it. */
var verifyRequestsOf = (fact) => VERIFIERS.filter((v) => v.verifies.includes(fact.kind) && (v.only?.(fact) ?? true)).map((v) => ({
	verifier: v.id,
	via: VIA,
	...v.requestOf(fact),
	method: v.requestOf(fact).method ?? "GET"
}));
/** The facts a lead carries, read from its source and statement. */
var factsOf = (lead) => {
	const facts = [];
	const src = lead.source;
	for (const m of src.matchAll(/\b(A\d{6})\b/g)) facts.push({
		kind: "sequence",
		value: m[1],
		detail: { title: /wiki\/([A-Za-z_()]+)/.exec(src)?.[1] ?? "Digital_root" },
		lead: lead.id
	});
	if (/arxiv\s*(\d{4}\.\d{4,5})/i.test(src)) facts.push({
		kind: "preprint",
		value: /arxiv\s*(\d{4}\.\d{4,5})/i.exec(src)[1],
		lead: lead.id
	});
	else if (/10\.\d{4,9}\/\S+/.test(src)) facts.push({
		kind: "doi",
		value: /10\.\d{4,9}\/\S+/.exec(src)[0],
		lead: lead.id
	});
	else if (/^repo-/.test(lead.id)) facts.push({
		kind: "repository",
		value: lead.id.replace(/^repo-/, ""),
		lead: lead.id
	});
	else if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(src) || src.startsWith("http")) facts.push({
		kind: "page",
		value: src.split(/[,;]/)[0].trim().split(/\s/)[0],
		detail: { statement: lead.statement },
		lead: lead.id
	});
	for (const n of lead.statement.match(/\b\d{2,}\b/g) ?? []) facts.push({
		kind: "integer",
		value: n,
		lead: lead.id
	});
	return facts;
};
/** Facts the tree itself carries beyond its leads: the physics constants Qpu.Physics names, and the DOIs its metadata cites. */
var TREE_FACTS = [
	{
		kind: "constant",
		value: "h",
		detail: { lean: "Qpu.Physics.planck" }
	},
	{
		kind: "constant",
		value: "k",
		detail: { lean: "Qpu.Physics.boltzmann" }
	},
	{
		kind: "doi",
		value: "10.5281/zenodo.21781602",
		detail: { what: "the author's Clay paper, cited by README and .zenodo.json" }
	},
	{
		kind: "doi",
		value: "10.5281/zenodo.23156998",
		detail: { what: "this software, release v1.0.1" }
	},
	{
		kind: "doi",
		value: "10.5281/zenodo.22700098",
		detail: { what: "this software, all versions" }
	},
	{
		kind: "doi",
		value: "10.7483/OPENDATA.CMS.53FG.V2S9",
		detail: { what: "CERN open data cited by .zenodo.json" }
	},
	{
		kind: "doi",
		value: "10.7483/OPENDATA.CMS.RG9B.XJMD",
		detail: { what: "CERN open data cited by .zenodo.json" }
	},
	{
		kind: "doi",
		value: "10.7483/OPENDATA.CMS.I8HN.DF32",
		detail: { what: "CERN open data cited by .zenodo.json" }
	},
	{
		kind: "doi",
		value: "10.7483/OPENDATA.CMS.0LRL.BXG5",
		detail: { what: "CERN open data cited by .zenodo.json" }
	}
];
// src/quantum/wave.ts
/** Every request, once per URL, with every lead it serves. */
var waveRequestsOf = (leads, treeFacts = TREE_FACTS) => {
	const requests = /* @__PURE__ */ new Map();
	const add = (id, f) => {
		for (const r of verifyRequestsOf(f)) {
			const key = r.method === "POST" ? `${r.url}#${JSON.stringify(r.body)}` : r.url;
			const cur = requests.get(key) ?? {
				verifier: r.verifier,
				url: r.url,
				check: r.check,
				leads: [],
				...r.method === "POST" ? {
					method: r.method,
					body: r.body,
					accept: r.accept
				} : {}
			};
			if (!cur.leads.includes(id)) cur.leads.push(id);
			requests.set(key, cur);
		}
	};
	for (const lead of leads) for (const f of factsOf(lead)) add(lead.id, f);
	for (const f of treeFacts) add(`tree:${f.kind}:${f.value}`, f);
	return [...requests.values()];
};
/** What came back, in one line, by verifier. */
var noteOf = (verifier, text) => {
	const title = () => {
		const m = /<title>([^<]*)<\/title>/i.exec(text);
		return m ? `title="${m[1].trim().slice(0, 100)}"` : `${text.length} chars`;
	};
	try {
		if (verifier === "oeis") {
			const j = JSON.parse(text);
			return `${Array.isArray(j) ? j.length : j.results?.length ?? j.count ?? 0} sequence results`;
		}
		if (verifier === "github") {
			const j = JSON.parse(text);
			return `description="${(j.description ?? "").slice(0, 80)}" language=${j.language}`;
		}
		if (verifier === "zenodo" || verifier === "datacite") {
			const j = JSON.parse(text);
			return JSON.stringify(j.metadata?.creators?.[0] ?? j.data?.attributes?.creators?.[0] ?? {}).slice(0, 120);
		}
		if (verifier === "wikipedia") return `extract="${(JSON.parse(text).extract ?? "").slice(0, 100)}"`;
		if (verifier === "cloudflare-docs") {
			const j = JSON.parse(dataOf(text));
			const body = j.result?.content?.[0]?.text ?? JSON.stringify(j.error ?? j.result ?? "").slice(0, 100);
			return `${(body.match(/<url>|"url"|https:\/\/developers\.cloudflare\.com/g) ?? []).length} result(s): ${body.replace(/\s+/g, " ").slice(0, 100)}`;
		}
	} catch {}
	if (verifier === "arxiv") {
		const t = /<title>([^<]+)<\/title>/g;
		t.exec(text);
		const m = t.exec(text);
		return m ? `entry="${m[1].trim().slice(0, 100)}"` : "no entry";
	}
	return title();
};
/** Is a request's path in the OpenAPI contract its host published? unknown where none was discovered. */
var contractedOf = (url, contracts) => {
	const u = new URL(url);
	const templates = contracts[u.host];
	if (!templates) return "unknown";
	const matches = (template) => new RegExp("^" + template.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\{[^}]+\\\}/g, "[^/]+") + "/?$").test(u.pathname);
	return templates.some(matches) ? "yes" : "no";
};
/** Results read: the note from the body, the contract check, and the summary by verifier. */
var waveOf = (results, contracts = {}) => {
	const read = results.map((r) => ({
		...r,
		text: void 0,
		note: r.note ?? (r.text !== void 0 ? noteOf(r.verifier, r.text) : `${r.status || "no answer"}`),
		contracted: r.contracted ?? contractedOf(r.url, contracts)
	}));
	read.sort((a, b) => a.verifier.localeCompare(b.verifier) || a.url.localeCompare(b.url));
	const summary = {};
	for (const r of read) {
		const s = summary[r.verifier] ?? (summary[r.verifier] = {
			requests: 0,
			ok: 0,
			contracted: 0,
			uncontracted: 0
		});
		s.requests += 1;
		if (r.ok) s.ok += 1;
		if (r.contracted === "yes") s.contracted += 1;
		if (r.contracted === "no") s.uncontracted += 1;
	}
	return {
		results: read,
		summary,
		reachable: read.filter((r) => r.ok).length
	};
};
/** The verification page. */
var wavePageOf = (w, leads, date, contractsKnown) => [
	"---",
	"title: Verification",
	"order: 48",
	"---",
	"",
	"# Cross-verification on live public sources",
	"",
	`Generated by \`npm run next\` on ${date} through the \`wave\` tool. Every verify request the surface emits for its ${leads} leads was fetched once by this`,
	"repository acting as the client MCP; the handler itself did no I/O. A failed or missing row is a lead, not a ruling.",
	"",
	"| Verifier | Requests | Reachable | In the host's contract | Outside it |",
	"|---|---:|---:|---:|---:|",
	...Object.entries(w.summary).map(([v, s]) => `| ${v} | ${s.requests} | ${s.ok} | ${contractsKnown ? s.contracted : "no contract discovered"} | ${contractsKnown ? s.uncontracted : "—"} |`),
	"",
	"| Verifier | Status | What came back | Contract | Check | Leads |",
	"|---|---:|---|---|---|---|",
	...w.results.map((r) => `| ${r.verifier} | ${r.status || "none"} | ${(r.note ?? "").replace(/\|/g, "\\|")} | ${r.contracted} | ${r.check.replace(/\|/g, "\\|")} | ${r.leads.join(", ")} |`),
	""
].join("\n");
// src/quantum/sitemap.ts
var SITEMAP_FETCHED = "2026-10-25";
var SITEMAP_CHILD_CHARACTERS = 1120891;
/** Every page of the child sitemap: its path and the date of its lastmod. */
var SITEMAP_PAGES = [
	["", "2026-10-20"],
	["?hl=es-419", "2026-05-12"],
	["?hl=tr", "2026-05-12"],
	["apsglobalphysics", "2026-10-20"],
	["apsglobalphysics2026", "2026-10-20"],
	["cirq", "2026-10-20"],
	["cirq/build", "2026-10-07"],
	["cirq/build/circuits", "2026-08-04"],
	["cirq/build/classical_control", "2026-10-10"],
	["cirq/build/custom_gates", "2026-08-15"],
	["cirq/build/ecosystem", "2026-09-11"],
	["cirq/build/gates", "2026-07-30"],
	["cirq/build/interop", "2026-07-30"],
	["cirq/build/operators", "2026-07-30"],
	["cirq/build/pauli_observables", "2026-10-07"],
	["cirq/build/protocols", "2026-07-30"],
	["cirq/build/qubits", "2026-07-30"],
	["cirq/build/qudits", "2026-07-30"],
	["cirq/citation", "2026-09-11"],
	["cirq/dev/development", "2026-09-22"],
	["cirq/dev/gates", "2026-09-22"],
	["cirq/dev/modules", "2026-02-18"],
	["cirq/dev/nomenclature", "2026-07-22"],
	["cirq/dev/notebooks", "2026-09-22"],
	["cirq/dev/plotting", "2026-09-22"],
	["cirq/dev/release", "2026-09-26"],
	["cirq/dev/rfc_process", "2026-07-22"],
	["cirq/dev/serialization", "2025-07-24"],
	["cirq/dev/style", "2026-03-05"],
	["cirq/dev/support", "2025-07-24"],
	["cirq/dev/triage", "2026-09-11"],
	["cirq/dev/versions", "2026-09-11"],
	["cirq/experiments", "2026-10-10"],
	["cirq/experiments/Readout-Analysis", "2025-07-24"],
	["cirq/experiments/Readout-Data-Collection", "2025-07-24"],
	["cirq/experiments/benchmarks/rabi_oscillations", "2026-03-06"],
	["cirq/experiments/best-practices", "2025-07-24"],
	["cirq/experiments/data-collection-idioms", "2025-07-24"],
	["cirq/experiments/fermi_hubbard", "2025-07-24"],
	["cirq/experiments/fermi_hubbard/experiment_example", "2026-03-06"],
	["cirq/experiments/fermi_hubbard/publication_results", "2026-05-01"],
	["cirq/experiments/fourier_checking", "2026-10-07"],
	["cirq/experiments/ftbbl", "2026-02-18"],
	["cirq/experiments/guide/best_practices", "2025-07-24"],
	["cirq/experiments/guide/data_analysis", "2026-03-06"],
	["cirq/experiments/guide/data_collection", "2026-03-06"],
	["cirq/experiments/guide/data_collection_idioms", "2025-07-24"],
	["cirq/experiments/hfvqe", "2025-07-24"],
	["cirq/experiments/hfvqe/molecular_data", "2026-03-06"],
	["cirq/experiments/hfvqe/quickstart", "2026-10-10"],
	["cirq/experiments/hidden_linear_function", "2026-07-30"],
	["cirq/experiments/kpz", "2025-07-24"],
	["cirq/experiments/kpz/kpz", "2026-03-06"],
	["cirq/experiments/lattice_gauge/lattice_gauge", "2026-02-18"],
	["cirq/experiments/otoc", "2025-07-24"],
	["cirq/experiments/otoc/otoc_example", "2026-05-29"],
	["cirq/experiments/qaoa", "2025-07-24"],
	["cirq/experiments/qaoa/binary_paintshop", "2026-04-09"],
	["cirq/experiments/qaoa/example_problems", "2026-03-06"],
	["cirq/experiments/qaoa/hardware_grid_circuits", "2026-03-06"],
	["cirq/experiments/qaoa/landscape_analysis", "2026-03-06"],
	["cirq/experiments/qaoa/optimization_analysis", "2026-03-06"],
	["cirq/experiments/qaoa/precomputed_analysis", "2026-03-06"],
	["cirq/experiments/qaoa/qaoa_ising", "2026-03-06"],
	["cirq/experiments/qaoa/qaoa_maxcut", "2026-03-06"],
	["cirq/experiments/qaoa/routing_with_tket", "2026-04-16"],
	["cirq/experiments/qaoa/tasks", "2026-05-29"],
	["cirq/experiments/qcqmc", "2025-07-24"],
	["cirq/experiments/qcqmc/experimental_wavefunctions", "2026-10-10"],
	["cirq/experiments/qcqmc/full_workflow", "2026-10-10"],
	["cirq/experiments/qcqmc/high_level", "2025-07-24"],
	["cirq/experiments/qec_memory/surface_code_lambda", "2026-10-08"],
	["cirq/experiments/quantum_walks", "2026-10-07"],
	["cirq/experiments/random_circuit_sampling/rcs_experiment_demonstration", "2026-09-29"],
	["cirq/experiments/research", "2025-07-24"],
	["cirq/experiments/shor", "2026-10-10"],
	["cirq/experiments/textbook_algorithms", "2026-07-30"],
	["cirq/experiments/time_crystals/time_crystal_circuit_generation", "2025-07-24"],
	["cirq/experiments/toric_code", "2025-07-24"],
	["cirq/experiments/toric_code/toric_code_ground_state", "2026-03-06"],
	["cirq/experiments/unitary/quantum_chess", "2025-07-24"],
	["cirq/experiments/unitary/quantum_chess/concepts", "2026-10-10"],
	["cirq/experiments/unitary/quantum_chess/quantum_chess_client", "2026-02-18"],
	["cirq/experiments/unitary/quantum_chess/quantum_chess_rest_api", "2026-02-18"],
	["cirq/experiments/unitary/unitary/game_design", "2025-07-24"],
	["cirq/experiments/unitary/unitary/getting_started", "2026-09-19"],
	["cirq/experiments/unitary/unitary/overview", "2025-07-24"],
	["cirq/experiments/unitary/unitary/physics_terms", "2025-07-24"],
	["cirq/experiments/unitary/unitary/tic_tac_toe", "2026-02-18"],
	["cirq/experiments/variational_algorithm", "2026-07-30"],
	["cirq/gatezoo", "2026-09-26"],
	["cirq/google/access", "2026-07-22"],
	["cirq/google/best_practices", "2026-10-07"],
	["cirq/google/calibration", "2026-10-07"],
	["cirq/google/concepts", "2026-09-22"],
	["cirq/google/devices", "2026-10-09"],
	["cirq/google/engine", "2026-09-22"],
	["cirq/google/internal_gates", "2026-07-30"],
	["cirq/google/qubit-placement", "2026-10-07"],
	["cirq/google/specification", "2026-08-06"],
	["cirq/hardware", "2026-10-07"],
	["cirq/hardware/aqt/access", "2026-07-22"],
	["cirq/hardware/aqt/getting_started", "2026-07-30"],
	["cirq/hardware/azure-quantum/access", "2025-07-24"],
	["cirq/hardware/azure-quantum/getting_started_honeywell", "2026-07-30"],
	["cirq/hardware/azure-quantum/getting_started_ionq", "2026-07-30"],
	["cirq/hardware/devices", "2026-07-30"],
	["cirq/hardware/ionq/access", "2026-07-22"],
	["cirq/hardware/ionq/calibrations", "2026-03-13"],
	["cirq/hardware/ionq/circuits", "2026-03-13"],
	["cirq/hardware/ionq/getting_started", "2026-09-22"],
	["cirq/hardware/ionq/jobs", "2026-09-22"],
	["cirq/hardware/ionq/service", "2026-09-18"],
	["cirq/hardware/pasqal/access", "2026-09-11"],
	["cirq/hardware/pasqal/devices", "2025-07-24"],
	["cirq/hardware/pasqal/getting_started", "2026-10-07"],
	["cirq/hardware/pasqal/sampler", "2026-07-22"],
	["cirq/hardware/qubit_picking", "2026-09-22"],
	["cirq/named_topologies", "2026-07-30"],
	["cirq/noise", "2026-10-07"],
	["cirq/noise/heatmaps", "2026-07-30"],
	["cirq/noise/qcvv/coherent_vs_incoherent_xeb", "2026-10-10"],
	["cirq/noise/qcvv/isolated_xeb", "2026-10-10"],
	["cirq/noise/qcvv/parallel_xeb", "2026-10-10"],
	["cirq/noise/qcvv/xeb_theory", "2026-10-10"],
	["cirq/noise/representing_noise", "2026-09-22"],
	["cirq/simulate", "2026-10-07"],
	["cirq/simulate/noisy_simulation", "2026-08-04"],
	["cirq/simulate/params", "2026-10-07"],
	["cirq/simulate/quantum_virtual_machine", "2026-07-30"],
	["cirq/simulate/qvm_basic_example", "2026-09-22"],
	["cirq/simulate/qvm_builder_code", "2026-07-30"],
	["cirq/simulate/qvm_stabilizer_example", "2026-10-07"],
	["cirq/simulate/simulation", "2026-08-04"],
	["cirq/simulate/state_histograms", "2026-07-30"],
	["cirq/simulate/virtual_engine_interface", "2026-10-09"],
	["cirq/start/basics", "2026-07-30"],
	["cirq/start/best_practices", "2025-07-24"],
	["cirq/start/install", "2025-07-24"],
	["cirq/start/intro", "2026-10-10"],
	["cirq/start/start", "2026-07-30"],
	["cirq/transform", "2026-10-07"],
	["cirq/transform/custom_transformers", "2026-10-10"],
	["cirq/transform/routing_transformer", "2026-10-07"],
	["cirq/transform/transformers", "2026-10-10"],
	["cirq/tutorials/google/colab", "2026-09-22"],
	["cirq/tutorials/google/echoes", "2026-07-30"],
	["cirq/tutorials/google/identifying_hardware_changes", "2026-10-07"],
	["cirq/tutorials/google/spin_echoes", "2026-10-07"],
	["cirq/tutorials/google/start", "2026-10-07"],
	["cirq/tutorials/google/visualizing_calibration_metrics", "2026-09-22"],
	["education/thequbitgame", "2022-04-14"],
	["google998ff0ca06ab4390", "2021-05-14"],
	["hardware/datasheet/weber", "2021-05-14"],
	["hardware/datasheet/weber.pdf", "2023-02-08"],
	["lab", "2026-10-20"],
	["learn/lab", "2022-06-23"],
	["learn/map", "2022-06-23"],
	["openfermion", "2026-05-02"],
	["openfermion/fqe", "2025-07-24"],
	["openfermion/fqe/guide/introduction", "2026-07-03"],
	["openfermion/fqe/tutorials/diagonal_coulomb_evolution", "2026-06-02"],
	["openfermion/fqe/tutorials/fermi_hubbard", "2026-03-06"],
	["openfermion/fqe/tutorials/fqe_vs_openfermion_quadratic_hamiltonians", "2026-03-13"],
	["openfermion/fqe/tutorials/hamiltonian_time_evolution_and_expectation_estimation", "2026-10-10"],
	["openfermion/install", "2026-10-13"],
	["openfermion/overview", "2025-07-24"],
	["openfermion/projects", "2025-07-24"],
	["openfermion/tutorials/binary_code_transforms", "2026-07-17"],
	["openfermion/tutorials/bosonic_operators", "2026-07-17"],
	["openfermion/tutorials/circuits_1_basis_change", "2026-07-02"],
	["openfermion/tutorials/circuits_2_diagonal_coulomb_trotter", "2026-03-13"],
	["openfermion/tutorials/circuits_3_arbitrary_basis_trotter", "2026-03-13"],
	["openfermion/tutorials/intro_to_openfermion", "2026-10-10"],
	["openfermion/tutorials/intro_workshop_exercises", "2026-03-06"],
	["openfermion/tutorials/jordan_wigner_and_bravyi_kitaev_transforms", "2026-07-17"],
	["qecmilestone", "2025-07-24"],
	["qsim", "2026-05-15"],
	["qsim/bazel", "2026-10-22"],
	["qsim/choose_hw", "2026-10-21"],
	["qsim/cirq_interface", "2026-10-21"],
	["qsim/docker", "2026-02-18"],
	["qsim/input_format", "2026-10-21"],
	["qsim/install_qsimcirq", "2026-10-21"],
	["qsim/mps", "2026-09-04"],
	["qsim/overview", "2026-09-04"],
	["qsim/qsimcirq_tutorial", "2026-02-18"],
	["qsim/release", "2025-07-24"],
	["qsim/testing", "2026-02-18"],
	["qsim/tutorials/amd_gpu", "2026-02-18"],
	["qsim/tutorials/gcp_before_you_begin", "2026-10-21"],
	["qsim/tutorials/gcp_cpu", "2026-10-21"],
	["qsim/tutorials/gcp_gpu", "2026-10-21"],
	["qsim/tutorials/multinode", "2026-10-21"],
	["qsim/tutorials/noisy_qsimcirq", "2026-03-06"],
	["qsim/tutorials/q32d14", "2026-03-06"],
	["qsim/tutorials/qsimcirq", "2026-10-12"],
	["qsim/tutorials/qsimcirq_gcp", "2026-10-21"],
	["qsim/type_reference", "2026-03-06"],
	["qsim/usage", "2026-10-07"],
	["qualtran", "2026-10-20"],
	["quantumcomputer", "2026-10-20"],
	["reference/cc/qsim", "2025-07-24"],
	["reference/cc/qsim/class/qsim/basic-gate-fuser", "2026-02-18"],
	["reference/cc/qsim/class/qsim/circuit-qsim-parser", "2026-02-18"],
	["reference/cc/qsim/class/qsim/fuser", "2026-02-18"],
	["reference/cc/qsim/class/qsim/simulator-a-v-x", "2026-02-18"],
	["reference/cc/qsim/class/qsim/simulator-basic", "2026-02-18"],
	["reference/cc/qsim/class/qsim/simulator-s-s-e", "2026-02-18"],
	["reference/cc/qsim/class/qsim/state-space", "2026-02-18"],
	["reference/cc/qsim/class/qsim/state-space-a-v-x", "2026-02-18"],
	["reference/cc/qsim/class/qsim/state-space-basic", "2026-02-18"],
	["reference/cc/qsim/class/qsim/state-space-s-s-e", "2026-02-18"],
	["reference/cc/qsim/class/qsim/unitary/unitary-calculator-basic", "2026-02-18"],
	["reference/cc/qsim/class/qsim/unitary/unitary-space", "2026-02-18"],
	["reference/cc/qsim/namespace/qsim", "2026-02-18"],
	["reference/cc/qsim/namespace/qsim/cirq", "2026-02-18"],
	["reference/cc/qsim/namespace/qsim/detail", "2026-02-18"],
	["reference/cc/qsim/namespace/qsim/gate", "2025-07-24"],
	["reference/cc/qsim/namespace/qsim/unitary", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/basic-gate-fuser/parameter", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/circuit", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/c-c-x", "2026-04-04"],
	["reference/cc/qsim/struct/qsim/cirq/c-c-x-pow-gate", "2026-03-18"],
	["reference/cc/qsim/struct/qsim/cirq/c-c-z", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/c-c-z-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/c-swap-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/c-x", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/c-x-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/c-z", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/c-z-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/f-sim-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/givens", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/h", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/h-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/i", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/i-s-w-a-p", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/i-swap-pow-gate", "2026-09-17"],
	["reference/cc/qsim/struct/qsim/cirq/i1", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/i2", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/matrix-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/matrix-gate1", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/matrix-gate2", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/phased-i-swap-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/phased-x-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/phased-x-z-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/riswap", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/rx", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/ry", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/rz", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/s", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/s-w-a-p", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/swap-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/t", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/three-qubit-diagonal-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/two-qubit-diagonal-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/x", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/x-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/x-x", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/x-x-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/y", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/y-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/y-y", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/y-y-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/z", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/z-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/cirq/z-z", "2026-03-27"],
	["reference/cc/qsim/struct/qsim/cirq/z-z-pow-gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-c-not", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-c-p", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-c-z", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-f-s", "2026-08-04"],
	["reference/cc/qsim/struct/qsim/gate-fused", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-h-z2", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-hd", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-i-s", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-id1", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-id2", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-r-x", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-r-x-y", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-r-y", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-r-z", "2026-07-19"],
	["reference/cc/qsim/struct/qsim/gate-s", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-swap", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-t", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-x", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-x2", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-y", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-y2", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate-z", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/gate/measurement", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/hybrid-simulator", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/hybrid-simulator/hybrid-data", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/hybrid-simulator/parameter", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/i-o", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/i-o-file", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/parallel-for-t", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/q-sim-h-runner", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/q-sim-runner", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/q-sim-runner/parameter", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/sequential-for", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/state-space/measurement-result", "2026-02-18"],
	["reference/cc/qsim/struct/qsim/unitary/unitary-space-basic", "2026-02-18"],
	["reference/python/cirq", "2026-10-24"],
	["reference/python/cirq/ABCMetaImplementAnyOneOf", "2026-10-08"],
	["reference/python/cirq/AbstractCircuit", "2026-10-08"],
	["reference/python/cirq/AbstractInitialMapper", "2026-10-08"],
	["reference/python/cirq/Alignment", "2026-07-01"],
	["reference/python/cirq/AmplitudeDampingChannel", "2026-07-01"],
	["reference/python/cirq/AnyIntegerPowerGateFamily", "2026-07-01"],
	["reference/python/cirq/AnyUnitaryGateFamily", "2026-07-01"],
	["reference/python/cirq/ApplyChannelArgs", "2026-07-01"],
	["reference/python/cirq/ApplyMixtureArgs", "2026-07-01"],
	["reference/python/cirq/ApplyUnitaryArgs", "2026-07-01"],
	["reference/python/cirq/ArithmeticGate", "2026-07-01"],
	["reference/python/cirq/AsymmetricDepolarizingChannel", "2026-10-08"],
	["reference/python/cirq/AxisAngleDecomposition", "2026-10-08"],
	["reference/python/cirq/BaseDensePauliString", "2026-10-08"],
	["reference/python/cirq/BitFlipChannel", "2026-07-01"],
	["reference/python/cirq/BitMaskKeyCondition", "2026-07-01"],
	["reference/python/cirq/BooleanHamiltonianGate", "2026-10-08"],
	["reference/python/cirq/CCNOT", "2025-07-24"],
	["reference/python/cirq/CCNotPowGate", "2026-07-01"],
	["reference/python/cirq/CCY", "2026-07-03"],
	["reference/python/cirq/CCYPowGate", "2026-07-03"],
	["reference/python/cirq/CCZ", "2025-07-24"],
	["reference/python/cirq/CCZPowGate", "2026-07-01"],
	["reference/python/cirq/CNOT", "2026-07-01"],
	["reference/python/cirq/CNotPowGate", "2026-07-01"],
	["reference/python/cirq/CSWAP", "2025-07-24"],
	["reference/python/cirq/CSwapGate", "2026-07-01"],
	["reference/python/cirq/CXSWAP", "2025-07-24"],
	["reference/python/cirq/CY", "2026-07-03"],
	["reference/python/cirq/CYPowGate", "2026-07-03"],
	["reference/python/cirq/CZ", "2025-07-24"],
	["reference/python/cirq/CZPowGate", "2026-07-01"],
	["reference/python/cirq/CZSWAP", "2025-07-24"],
	["reference/python/cirq/CZTargetGateset", "2026-07-01"],
	["reference/python/cirq/Circuit", "2026-10-08"],
	["reference/python/cirq/CircuitDiagramInfo", "2026-07-01"],
	["reference/python/cirq/CircuitDiagramInfoArgs", "2026-10-08"],
	["reference/python/cirq/CircuitFunction", "2026-10-08"],
	["reference/python/cirq/CircuitOperation", "2026-07-01"],
	["reference/python/cirq/CircuitSampleJob", "2026-07-01"],
	["reference/python/cirq/ClassicalDataDictionaryStore", "2026-07-01"],
	["reference/python/cirq/ClassicalDataStore", "2026-07-01"],
	["reference/python/cirq/ClassicalDataStoreReader", "2026-07-01"],
	["reference/python/cirq/ClassicalStateSimulator", "2026-10-08"],
	["reference/python/cirq/ClassicallyControlledOperation", "2026-07-01"],
	["reference/python/cirq/CliffordGate", "2026-07-01"],
	["reference/python/cirq/CliffordSimulator", "2026-10-08"],
	["reference/python/cirq/CliffordSimulatorStepResult", "2026-07-01"],
	["reference/python/cirq/CliffordState", "2026-07-01"],
	["reference/python/cirq/CliffordTableau", "2026-07-01"],
	["reference/python/cirq/CliffordTableauSimulationState", "2026-10-08"],
	["reference/python/cirq/CliffordTrialResult", "2026-07-01"],
	["reference/python/cirq/Collector", "2026-07-01"],
	["reference/python/cirq/CompilationTargetGateset", "2026-07-01"],
	["reference/python/cirq/Concat", "2026-07-01"],
	["reference/python/cirq/Condition", "2026-07-01"],
	["reference/python/cirq/ConstantQubitNoiseModel", "2026-07-01"],
	["reference/python/cirq/ControlledGate", "2026-07-01"],
	["reference/python/cirq/ControlledOperation", "2026-07-01"],
	["reference/python/cirq/DURATION_LIKE", "2025-07-24"],
	["reference/python/cirq/DecompositionContext", "2026-07-01"],
	["reference/python/cirq/DensePauliString", "2026-10-08"],
	["reference/python/cirq/DensityMatrixSimulationState", "2026-10-08"],
	["reference/python/cirq/DensityMatrixSimulator", "2026-10-08"],
	["reference/python/cirq/DensityMatrixStepResult", "2026-07-01"],
	["reference/python/cirq/DensityMatrixTrialResult", "2026-07-01"],
	["reference/python/cirq/DepolarizingChannel", "2026-10-08"],
	["reference/python/cirq/Device", "2026-10-08"],
	["reference/python/cirq/DeviceMetadata", "2026-07-22"],
	["reference/python/cirq/DiagonalGate", "2026-07-01"],
	["reference/python/cirq/Duration", "2026-07-01"],
	["reference/python/cirq/EigenGate", "2026-10-08"],
	["reference/python/cirq/ExpressionMap", "2026-10-08"],
	["reference/python/cirq/FSimGate", "2026-07-01"],
	["reference/python/cirq/FrozenCircuit", "2026-10-08"],
	["reference/python/cirq/Gate", "2026-07-13"],
	["reference/python/cirq/GateFamily", "2026-10-16"],
	["reference/python/cirq/GateOperation", "2026-07-01"],
	["reference/python/cirq/Gateset", "2026-07-01"],
	["reference/python/cirq/GeneralizedAmplitudeDampingChannel", "2026-07-01"],
	["reference/python/cirq/GlobalPhaseGate", "2026-07-01"],
	["reference/python/cirq/GreedyQubitManager", "2026-07-01"],
	["reference/python/cirq/GridDeviceMetadata", "2026-10-08"],
	["reference/python/cirq/GridQid", "2026-10-08"],
	["reference/python/cirq/GridQubit", "2026-07-13"],
	["reference/python/cirq/H", "2025-07-24"],
	["reference/python/cirq/HPowGate", "2026-07-01"],
	["reference/python/cirq/HardCodedInitialMapper", "2026-07-01"],
	["reference/python/cirq/HasJSONNamespace", "2026-07-01"],
	["reference/python/cirq/Heatmap", "2026-07-01"],
	["reference/python/cirq/I", "2025-07-24"],
	["reference/python/cirq/ISWAP", "2025-07-24"],
	["reference/python/cirq/ISWAP_INV", "2025-07-24"],
	["reference/python/cirq/ISwapPowGate", "2026-07-01"],
	["reference/python/cirq/IdentityGate", "2026-07-01"],
	["reference/python/cirq/If", "2026-10-08"],
	["reference/python/cirq/InsertStrategy", "2026-07-01"],
	["reference/python/cirq/InterchangeableQubitsGate", "2026-07-01"],
	["reference/python/cirq/JsonResolver", "2026-07-01"],
	["reference/python/cirq/KET_IMAG", "2025-07-24"],
	["reference/python/cirq/KET_MINUS", "2025-07-24"],
	["reference/python/cirq/KET_MINUS_IMAG", "2025-07-24"],
	["reference/python/cirq/KET_ONE", "2025-07-24"],
	["reference/python/cirq/KET_PLUS", "2025-07-24"],
	["reference/python/cirq/KET_ZERO", "2025-07-24"],
	["reference/python/cirq/KakDecomposition", "2026-07-01"],
	["reference/python/cirq/KeyCondition", "2026-07-01"],
	["reference/python/cirq/KrausChannel", "2026-07-01"],
	["reference/python/cirq/LabelEntity", "2025-07-24"],
	["reference/python/cirq/LineInitialMapper", "2026-07-01"],
	["reference/python/cirq/LineQid", "2026-07-01"],
	["reference/python/cirq/LineQubit", "2026-07-01"],
	["reference/python/cirq/LineTopology", "2026-07-01"],
	["reference/python/cirq/LinearCombinationOfGates", "2026-10-08"],
	["reference/python/cirq/LinearCombinationOfOperations", "2026-10-16"],
	["reference/python/cirq/LinearDict", "2026-10-08"],
	["reference/python/cirq/Linspace", "2026-07-01"],
	["reference/python/cirq/ListSweep", "2026-07-01"],
	["reference/python/cirq/M", "2026-07-01"],
	["reference/python/cirq/MSGate", "2026-10-08"],
	["reference/python/cirq/MappingManager", "2026-07-01"],
	["reference/python/cirq/MatrixGate", "2026-10-08"],
	["reference/python/cirq/MeasurementGate", "2026-07-01"],
	["reference/python/cirq/MeasurementKey", "2026-07-01"],
	["reference/python/cirq/MeasurementType", "2026-07-01"],
	["reference/python/cirq/MixedUnitaryChannel", "2026-07-01"],
	["reference/python/cirq/Moment", "2026-07-01"],
	["reference/python/cirq/MutableDensePauliString", "2026-10-08"],
	["reference/python/cirq/MutablePauliString", "2026-10-08"],
	["reference/python/cirq/NOISE_MODEL_LIKE", "2025-07-24"],
	["reference/python/cirq/NamedQid", "2026-07-01"],
	["reference/python/cirq/NamedQubit", "2026-07-01"],
	["reference/python/cirq/NamedTopology", "2026-10-08"],
	["reference/python/cirq/NoiseModel", "2026-07-13"],
	["reference/python/cirq/NoiseModelFromNoiseProperties", "2026-07-01"],
	["reference/python/cirq/NoiseProperties", "2026-07-01"],
	["reference/python/cirq/OpIdentifier", "2026-07-01"],
	["reference/python/cirq/Operation", "2026-07-01"],
	["reference/python/cirq/PAULI_GATE_LIKE", "2025-07-24"],
	["reference/python/cirq/PAULI_STRING_LIKE", "2026-07-01"],
	["reference/python/cirq/ParallelGate", "2026-07-01"],
	["reference/python/cirq/ParallelGateFamily", "2026-10-08"],
	["reference/python/cirq/ParamDictType", "2025-07-24"],
	["reference/python/cirq/ParamMappingType", "2026-07-01"],
	["reference/python/cirq/ParamResolver", "2026-10-08"],
	["reference/python/cirq/ParamResolverOrSimilarType", "2025-07-24"],
	["reference/python/cirq/Pauli", "2026-07-01"],
	["reference/python/cirq/PauliInteractionGate", "2026-07-01"],
	["reference/python/cirq/PauliMeasurementGate", "2026-10-08"],
	["reference/python/cirq/PauliString", "2026-10-08"],
	["reference/python/cirq/PauliStringGateOperation", "2026-07-01"],
	["reference/python/cirq/PauliStringPhasor", "2026-10-08"],
	["reference/python/cirq/PauliStringPhasorGate", "2026-07-01"],
	["reference/python/cirq/PauliSum", "2026-07-07"],
	["reference/python/cirq/PauliSumCollector", "2026-07-01"],
	["reference/python/cirq/PauliSumExponential", "2026-07-01"],
	["reference/python/cirq/PauliSumLike", "2025-07-24"],
	["reference/python/cirq/PeriodicValue", "2026-07-01"],
	["reference/python/cirq/PhaseDampingChannel", "2026-07-01"],
	["reference/python/cirq/PhaseFlipChannel", "2026-07-01"],
	["reference/python/cirq/PhaseGradientGate", "2026-10-08"],
	["reference/python/cirq/PhasedFSimGate", "2026-07-13"],
	["reference/python/cirq/PhasedISwapPowGate", "2026-07-01"],
	["reference/python/cirq/PhasedXPowGate", "2026-07-01"],
	["reference/python/cirq/PhasedXZGate", "2026-07-01"],
	["reference/python/cirq/PointOptimizationSummary", "2026-07-01"],
	["reference/python/cirq/PointOptimizer", "2026-07-01"],
	["reference/python/cirq/Points", "2026-07-01"],
	["reference/python/cirq/Product", "2026-07-01"],
	["reference/python/cirq/ProductOfSums", "2026-07-01"],
	["reference/python/cirq/ProductState", "2026-10-08"],
	["reference/python/cirq/ProjectorString", "2026-07-01"],
	["reference/python/cirq/ProjectorSum", "2026-07-01"],
	["reference/python/cirq/QUANTUM_STATE_LIKE", "2025-07-24"],
	["reference/python/cirq/QasmArgs", "2026-07-01"],
	["reference/python/cirq/QasmOutput", "2026-07-01"],
	["reference/python/cirq/Qid", "2026-07-01"],
	["reference/python/cirq/QuantumFourierTransformGate", "2026-07-01"],
	["reference/python/cirq/QuantumState", "2026-07-01"],
	["reference/python/cirq/QuantumStateRepresentation", "2026-07-01"],
	["reference/python/cirq/QubitManager", "2026-07-01"],
	["reference/python/cirq/QubitOrder", "2026-10-08"],
	["reference/python/cirq/QubitPermutationGate", "2026-07-01"],
	["reference/python/cirq/R", "2026-07-01"],
	["reference/python/cirq/RandomGateChannel", "2026-10-12"],
	["reference/python/cirq/ResetChannel", "2026-07-01"],
	["reference/python/cirq/Result", "2026-10-08"],
	["reference/python/cirq/ResultDict", "2026-10-12"],
	["reference/python/cirq/RouteCQC", "2026-07-01"],
	["reference/python/cirq/RoutingSwapTag", "2026-07-01"],
	["reference/python/cirq/Rx", "2026-07-01"],
	["reference/python/cirq/Ry", "2026-07-01"],
	["reference/python/cirq/Rz", "2026-07-01"],
	["reference/python/cirq/S", "2025-07-24"],
	["reference/python/cirq/SQRT_ISWAP", "2025-07-24"],
	["reference/python/cirq/SQRT_ISWAP_INV", "2025-07-24"],
	["reference/python/cirq/STATE_VECTOR_LIKE", "2025-07-24"],
	["reference/python/cirq/SWAP", "2025-07-24"],
	["reference/python/cirq/Sampler", "2026-10-08"],
	["reference/python/cirq/SerializableByKey", "2026-10-08"],
	["reference/python/cirq/SetVariable", "2026-10-08"],
	["reference/python/cirq/SimpleQubitManager", "2026-07-11"],
	["reference/python/cirq/SimulatesAmplitudes", "2026-10-08"],
	["reference/python/cirq/SimulatesExpectationValues", "2026-10-08"],
	["reference/python/cirq/SimulatesFinalState", "2026-10-08"],
	["reference/python/cirq/SimulatesIntermediateState", "2026-10-08"],
	["reference/python/cirq/SimulatesIntermediateStateVector", "2026-10-08"],
	["reference/python/cirq/SimulatesSamples", "2026-10-08"],
	["reference/python/cirq/SimulationProductState", "2026-10-08"],
	["reference/python/cirq/SimulationState", "2026-10-08"],
	["reference/python/cirq/SimulationStateBase", "2026-10-08"],
	["reference/python/cirq/SimulationTrialResult", "2026-07-01"],
	["reference/python/cirq/SimulationTrialResultBase", "2026-07-01"],
	["reference/python/cirq/Simulator", "2026-10-08"],
	["reference/python/cirq/SimulatorBase", "2026-10-08"],
	["reference/python/cirq/SingleQubitCliffordGate", "2026-10-08"],
	["reference/python/cirq/SingleQubitPauliStringGateOperation", "2026-10-08"],
	["reference/python/cirq/SparseSimulatorStep", "2026-10-08"],
	["reference/python/cirq/SqrtIswapTargetGateset", "2026-07-01"],
	["reference/python/cirq/StabilizerChFormSimulationState", "2026-10-08"],
	["reference/python/cirq/StabilizerSampler", "2026-10-08"],
	["reference/python/cirq/StabilizerSimulationState", "2026-10-08"],
	["reference/python/cirq/StabilizerState", "2026-07-11"],
	["reference/python/cirq/StabilizerStateChForm", "2026-10-08"],
	["reference/python/cirq/StatePreparationChannel", "2026-10-10"],
	["reference/python/cirq/StateVectorMixin", "2026-10-08"],
	["reference/python/cirq/StateVectorSimulationState", "2026-10-08"],
	["reference/python/cirq/StateVectorStepResult", "2026-07-01"],
	["reference/python/cirq/StateVectorTrialResult", "2026-10-08"],
	["reference/python/cirq/StepResult", "2026-07-01"],
	["reference/python/cirq/StepResultBase", "2026-07-01"],
	["reference/python/cirq/SumOfProducts", "2026-07-01"],
	["reference/python/cirq/SuperconductingQubitsNoiseProperties", "2026-07-11"],
	["reference/python/cirq/SupportsActOn", "2026-07-01"],
	["reference/python/cirq/SupportsActOnQubits", "2026-07-01"],
	["reference/python/cirq/SupportsApplyChannel", "2026-07-01"],
	["reference/python/cirq/SupportsApplyMixture", "2026-07-01"],
	["reference/python/cirq/SupportsApproximateEquality", "2026-07-01"],
	["reference/python/cirq/SupportsCircuitDiagramInfo", "2026-07-01"],
	["reference/python/cirq/SupportsCommutes", "2026-07-01"],
	["reference/python/cirq/SupportsConsistentApplyUnitary", "2026-07-01"],
	["reference/python/cirq/SupportsControlKey", "2026-07-01"],
	["reference/python/cirq/SupportsDecompose", "2026-07-01"],
	["reference/python/cirq/SupportsDecomposeWithQubits", "2026-07-01"],
	["reference/python/cirq/SupportsEqualUpToGlobalPhase", "2026-07-01"],
	["reference/python/cirq/SupportsExplicitHasUnitary", "2026-07-01"],
	["reference/python/cirq/SupportsExplicitNumQubits", "2026-07-01"],
	["reference/python/cirq/SupportsExplicitQidShape", "2026-07-01"],
	["reference/python/cirq/SupportsJSON", "2026-10-08"],
	["reference/python/cirq/SupportsKraus", "2026-10-08"],
	["reference/python/cirq/SupportsMeasurementKey", "2026-10-08"],
	["reference/python/cirq/SupportsMixture", "2026-10-08"],
	["reference/python/cirq/SupportsParameterization", "2026-07-01"],
	["reference/python/cirq/SupportsPauliExpansion", "2026-07-01"],
	["reference/python/cirq/SupportsPhase", "2026-07-01"],
	["reference/python/cirq/SupportsQasm", "2026-07-01"],
	["reference/python/cirq/SupportsQasmWithArgs", "2026-07-01"],
	["reference/python/cirq/SupportsQasmWithArgsAndQubits", "2026-07-01"],
	["reference/python/cirq/SupportsTraceDistanceBound", "2026-07-01"],
	["reference/python/cirq/SupportsUnitary", "2026-07-01"],
	["reference/python/cirq/SwapPowGate", "2026-07-01"],
	["reference/python/cirq/Sweep", "2026-07-01"],
	["reference/python/cirq/Sweepable", "2025-07-24"],
	["reference/python/cirq/SympyCondition", "2026-10-08"],
	["reference/python/cirq/T", "2025-07-24"],
	["reference/python/cirq/TRANSFORMER", "2026-07-01"],
	["reference/python/cirq/TaggedOperation", "2026-07-01"],
	["reference/python/cirq/TensoredConfusionMatrices", "2026-10-08"],
	["reference/python/cirq/TextDiagramDrawer", "2026-07-01"],
	["reference/python/cirq/ThreeQubitDiagonalGate", "2026-07-01"],
	["reference/python/cirq/TiltedSquareLattice", "2026-07-01"],
	["reference/python/cirq/Timestamp", "2026-07-01"],
	["reference/python/cirq/TransformerContext", "2026-07-01"],
	["reference/python/cirq/TransformerLogger", "2026-07-01"],
	["reference/python/cirq/TwoQubitCompilationTargetGateset", "2026-10-14"],
	["reference/python/cirq/TwoQubitDiagonalGate", "2026-07-01"],
	["reference/python/cirq/TwoQubitGateTabulation", "2026-07-01"],
	["reference/python/cirq/TwoQubitGateTabulationResult", "2026-07-01"],
	["reference/python/cirq/TwoQubitInteractionHeatmap", "2026-07-01"],
	["reference/python/cirq/TwoQubitNumericalCompilationResult", "2026-10-20"],
	["reference/python/cirq/TwoQubitNumericalCompiler", "2026-10-20"],
	["reference/python/cirq/UniformSuperpositionGate", "2026-10-08"],
	["reference/python/cirq/VariableGridQid", "2026-10-08"],
	["reference/python/cirq/VariableLineQid", "2026-10-08"],
	["reference/python/cirq/VariableQid", "2026-10-08"],
	["reference/python/cirq/VirtualTag", "2026-07-01"],
	["reference/python/cirq/WaitGate", "2026-10-07"],
	["reference/python/cirq/While", "2026-10-21"],
	["reference/python/cirq/X", "2025-07-24"],
	["reference/python/cirq/XPowGate", "2026-07-01"],
	["reference/python/cirq/XX", "2025-07-24"],
	["reference/python/cirq/XXPowGate", "2026-07-01"],
	["reference/python/cirq/Y", "2025-07-24"],
	["reference/python/cirq/YPowGate", "2026-07-01"],
	["reference/python/cirq/YY", "2025-07-24"],
	["reference/python/cirq/YYPowGate", "2026-07-01"],
	["reference/python/cirq/Z", "2025-07-24"],
	["reference/python/cirq/ZPowGate", "2026-07-01"],
	["reference/python/cirq/ZZ", "2025-07-24"],
	["reference/python/cirq/ZZPowGate", "2026-07-01"],
	["reference/python/cirq/ZerosSampler", "2026-10-08"],
	["reference/python/cirq/Zip", "2026-07-05"],
	["reference/python/cirq/ZipLongest", "2026-07-01"],
	["reference/python/cirq/act_on", "2026-07-01"],
	["reference/python/cirq/add_dynamical_decoupling", "2026-07-01"],
	["reference/python/cirq/align_left", "2026-07-01"],
	["reference/python/cirq/align_right", "2026-07-01"],
	["reference/python/cirq/all_near_zero", "2026-07-01"],
	["reference/python/cirq/all_near_zero_mod", "2026-07-01"],
	["reference/python/cirq/all_symbols", "2026-10-20"],
	["reference/python/cirq/allclose_up_to_global_phase", "2026-07-01"],
	["reference/python/cirq/alternative", "2026-07-01"],
	["reference/python/cirq/amplitude_damp", "2026-07-13"],
	["reference/python/cirq/apply_channel", "2026-07-01"],
	["reference/python/cirq/apply_matrix_to_slices", "2026-10-08"],
	["reference/python/cirq/apply_mixture", "2026-10-08"],
	["reference/python/cirq/apply_unitaries", "2026-07-01"],
	["reference/python/cirq/apply_unitary", "2026-10-08"],
	["reference/python/cirq/approx_eq", "2026-07-01"],
	["reference/python/cirq/asymmetric_depolarize", "2026-10-08"],
	["reference/python/cirq/axis_angle", "2026-07-01"],
	["reference/python/cirq/bidiagonalize_real_matrix_pair_with_symmetric_products", "2026-07-01"],
	["reference/python/cirq/bidiagonalize_unitary_with_special_orthogonals", "2026-07-01"],
	["reference/python/cirq/big_endian_bits_to_int", "2026-07-01"],
	["reference/python/cirq/big_endian_digits_to_int", "2026-07-01"],
	["reference/python/cirq/big_endian_int_to_bits", "2026-10-05"],
	["reference/python/cirq/big_endian_int_to_digits", "2026-07-01"],
	["reference/python/cirq/bit_flip", "2026-07-01"],
	["reference/python/cirq/bloch_vector_from_state_vector", "2026-10-08"],
	["reference/python/cirq/block_diag", "2026-07-01"],
	["reference/python/cirq/canonicalize_half_turns", "2026-07-01"],
	["reference/python/cirq/choi_to_kraus", "2026-10-08"],
	["reference/python/cirq/choi_to_superoperator", "2026-10-08"],
	["reference/python/cirq/chosen_angle_to_canonical_half_turns", "2026-07-01"],
	["reference/python/cirq/chosen_angle_to_half_turns", "2026-09-26"],
	["reference/python/cirq/circuit_diagram_info", "2026-10-08"],
	["reference/python/cirq/cirq_type_from_json", "2026-08-23"],
	["reference/python/cirq/commutes", "2026-07-05"],
	["reference/python/cirq/compute_cphase_exponents_for_fsim_decomposition", "2026-07-01"],
	["reference/python/cirq/contrib", "2026-10-08"],
	["reference/python/cirq/contrib/CircuitDag", "2026-07-01"],
	["reference/python/cirq/contrib/Unique", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/AcquaintanceOperation", "2026-07-07"],
	["reference/python/cirq/contrib/acquaintance/AcquaintanceOpportunityGate", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/BipartiteGraphType", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/BipartiteSwapNetworkGate", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/CircularShiftGate", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/DECOMPOSE_PERMUTATION_GATES", "2025-07-24"],
	["reference/python/cirq/contrib/acquaintance/EXPAND_PERMUTATION_GATES", "2025-07-24"],
	["reference/python/cirq/contrib/acquaintance/GreedyExecutionStrategy", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/LinearPermutationGate", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/PermutationGate", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/ShiftSwapNetworkGate", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/StrategyExecutorTransformer", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/SwapNetworkGate", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/SwapPermutationGate", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/acquaint", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/bipartite", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/complete_acquaintance_strategy", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/cubic_acquaintance_strategy", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/devices", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/devices/AcquaintanceDevice", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/display_mapping", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/executor", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/executor/ExecutionStrategy", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/executor/LogicalGates", "2025-07-24"],
	["reference/python/cirq/contrib/acquaintance/executor/LogicalMapping", "2025-07-24"],
	["reference/python/cirq/contrib/acquaintance/expose_acquaintance_gates", "2025-07-24"],
	["reference/python/cirq/contrib/acquaintance/gates", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/gates/Layers", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/gates/acquaint_and_shift", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/gates/acquaint_insides", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/gates/new_layers", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/gates/operations_to_part_lens", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/get_acquaintance_size", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/get_logical_acquaintance_opportunities", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/get_logical_operations", "2026-10-08"],
	["reference/python/cirq/contrib/acquaintance/inspection_utils", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/inspection_utils/LogicalAnnotator", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/inspection_utils/get_acquaintance_dag", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/is_topologically_sorted", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/mutation_utils", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/mutation_utils/ExposeAcquaintanceGates", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/optimizers", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/permutation", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/permutation/DecomposePermutationGates", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/permutation/MappingDisplayGate", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/quartic_paired_acquaintance_strategy", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/random_topological_sort", "2026-10-08"],
	["reference/python/cirq/contrib/acquaintance/rectify_acquaintance_strategy", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/remove_redundant_acquaintance_opportunities", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/replace_acquaintance_with_swap_network", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/return_to_initial_mapping", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/shift", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/shift_swap_network", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/strategies", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/strategies/complete", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/strategies/cubic", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/strategies/cubic/skip_and_wrap_around", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/strategies/quartic_paired", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/strategies/quartic_paired/qubit_pairs_to_qubit_order", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/testing", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/testing/assert_permutation_decomposition_equivalence", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/topological_sort", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/update_mapping", "2026-07-01"],
	["reference/python/cirq/contrib/acquaintance/uses_consistent_swap_gate", "2026-07-01"],
	["reference/python/cirq/contrib/circuit_to_latex_using_qcircuit", "2026-07-01"],
	["reference/python/cirq/contrib/circuitdag", "2026-07-01"],
	["reference/python/cirq/contrib/circuitdag/circuit_dag", "2026-07-01"],
	["reference/python/cirq/contrib/graph_device", "2026-10-08"],
	["reference/python/cirq/contrib/graph_device/FixedDurationUndirectedGraphDeviceEdge", "2026-07-01"],
	["reference/python/cirq/contrib/graph_device/UndirectedGraphDevice", "2026-07-01"],
	["reference/python/cirq/contrib/graph_device/UndirectedHypergraph", "2026-07-01"],
	["reference/python/cirq/contrib/graph_device/graph_device", "2026-07-01"],
	["reference/python/cirq/contrib/graph_device/graph_device/UndirectedGraphDeviceEdge", "2026-07-01"],
	["reference/python/cirq/contrib/graph_device/graph_device/raise_crosstalk_error", "2026-07-01"],
	["reference/python/cirq/contrib/graph_device/hypergraph", "2026-07-01"],
	["reference/python/cirq/contrib/graph_device/hypergraph/AdjacencyList", "2025-07-24"],
	["reference/python/cirq/contrib/graph_device/is_crosstalk_graph", "2026-07-01"],
	["reference/python/cirq/contrib/graph_device/is_undirected_device_graph", "2026-07-01"],
	["reference/python/cirq/contrib/graph_device/uniform_graph_device", "2026-10-08"],
	["reference/python/cirq/contrib/graph_device/uniform_undirected_graph_device", "2026-07-01"],
	["reference/python/cirq/contrib/graph_device/uniform_undirected_linear_device", "2026-10-08"],
	["reference/python/cirq/contrib/json", "2026-07-01"],
	["reference/python/cirq/contrib/json/contrib_class_resolver", "2026-07-01"],
	["reference/python/cirq/contrib/qcircuit", "2026-10-08"],
	["reference/python/cirq/contrib/qcircuit/escape_text_for_latex", "2026-07-01"],
	["reference/python/cirq/contrib/qcircuit/get_multigate_parameters", "2026-07-01"],
	["reference/python/cirq/contrib/qcircuit/get_qcircuit_diagram_info", "2026-07-01"],
	["reference/python/cirq/contrib/qcircuit/qcircuit_diagram", "2026-07-01"],
	["reference/python/cirq/contrib/qcircuit/qcircuit_diagram/qcircuit_qubit_namer", "2026-07-01"],
	["reference/python/cirq/contrib/qcircuit/qcircuit_diagram_info", "2026-07-01"],
	["reference/python/cirq/contrib/qcircuit/qcircuit_diagram_info/convert_text_diagram_info_to_qcircuit_diagram_info", "2026-07-01"],
	["reference/python/cirq/contrib/qcircuit/qcircuit_diagram_info/fallback_qcircuit_diagram_info", "2026-07-01"],
	["reference/python/cirq/contrib/qcircuit/qcircuit_diagram_info/hardcoded_qcircuit_diagram_info", "2026-07-01"],
	["reference/python/cirq/contrib/qcircuit/qcircuit_diagram_info/multigate_qcircuit_diagram_info", "2026-07-01"],
	["reference/python/cirq/contrib/quirk", "2026-10-08"],
	["reference/python/cirq/contrib/quirk/circuit_to_quirk_url", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/export_to_quirk", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/linearize_circuit", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/linearize_circuit/QubitMapper", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/linearize_circuit/linearize_circuit_qubits", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/QuirkOp", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/angle_to_exponent_key", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/ccx_to_quirk_op", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/ccz_to_quirk_op", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/cnot_to_quirk_op", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/controlled_unwrap", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/cswap_to_quirk_op", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/cz_to_quirk_op", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/h_to_quirk_op", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/known_quirk_op_for_operation", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/same_half_turns", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/single_qubit_matrix_gate", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/swap_to_quirk_op", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/x_to_quirk_op", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/xyz_to_quirk_op", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/y_to_quirk_op", "2026-07-01"],
	["reference/python/cirq/contrib/quirk/quirk_gate/z_to_quirk_op", "2026-07-01"],
	["reference/python/cirq/control_keys", "2026-07-01"],
	["reference/python/cirq/cphase", "2026-07-01"],
	["reference/python/cirq/create_transformer_with_kwargs", "2026-07-01"],
	["reference/python/cirq/dataclass_json_dict", "2026-07-01"],
	["reference/python/cirq/decompose", "2026-07-05"],
	["reference/python/cirq/decompose_clifford_tableau_to_operations", "2026-07-01"],
	["reference/python/cirq/decompose_cphase_into_two_fsim", "2026-07-01"],
	["reference/python/cirq/decompose_multi_controlled_rotation", "2026-07-01"],
	["reference/python/cirq/decompose_multi_controlled_x", "2026-10-08"],
	["reference/python/cirq/decompose_once", "2026-07-01"],
	["reference/python/cirq/decompose_once_with_qubits", "2026-07-01"],
	["reference/python/cirq/decompose_two_qubit_interaction_into_four_fsim_gates", "2026-10-08"],
	["reference/python/cirq/deconstruct_single_qubit_matrix_into_angles", "2026-07-01"],
	["reference/python/cirq/defer_measurements", "2026-07-01"],
	["reference/python/cirq/definitely_commutes", "2026-07-01"],
	["reference/python/cirq/density_matrix", "2026-07-01"],
	["reference/python/cirq/density_matrix_from_state_vector", "2026-10-08"],
	["reference/python/cirq/density_matrix_kronecker_product", "2026-07-01"],
	["reference/python/cirq/dephase_measurements", "2026-07-01"],
	["reference/python/cirq/depolarize", "2026-10-08"],
	["reference/python/cirq/diagonalize_real_symmetric_and_sorted_diagonal_matrices", "2026-07-01"],
	["reference/python/cirq/diagonalize_real_symmetric_matrix", "2026-07-01"],
	["reference/python/cirq/dict_to_product_sweep", "2026-07-01"],
	["reference/python/cirq/dict_to_zip_sweep", "2026-07-01"],
	["reference/python/cirq/dirac_notation", "2026-07-01"],
	["reference/python/cirq/dot", "2026-07-01"],
	["reference/python/cirq/draw_gridlike", "2026-10-08"],
	["reference/python/cirq/draw_placements", "2026-07-01"],
	["reference/python/cirq/drop_diagonal_before_measurement", "2026-07-03"],
	["reference/python/cirq/drop_empty_moments", "2026-07-01"],
	["reference/python/cirq/drop_negligible_operations", "2026-07-01"],
	["reference/python/cirq/drop_terminal_measurements", "2026-07-01"],
	["reference/python/cirq/eject_phased_paulis", "2026-07-01"],
	["reference/python/cirq/eject_z", "2026-07-01"],
	["reference/python/cirq/entanglement_fidelity", "2026-10-08"],
	["reference/python/cirq/equal_up_to_global_phase", "2026-07-01"],
	["reference/python/cirq/estimate_parallel_single_qubit_readout_errors", "2026-10-08"],
	["reference/python/cirq/estimate_single_qubit_readout_errors", "2026-10-08"],
	["reference/python/cirq/expand_composite", "2026-07-01"],
	["reference/python/cirq/expand_matrix_in_orthogonal_basis", "2026-07-01"],
	["reference/python/cirq/eye_tensor", "2026-07-01"],
	["reference/python/cirq/fidelity", "2026-07-01"],
	["reference/python/cirq/final_density_matrix", "2026-10-25"],
	["reference/python/cirq/final_state_vector", "2026-07-01"],
	["reference/python/cirq/flatten", "2026-07-01"],
	["reference/python/cirq/flatten_op_tree", "2026-07-01"],
	["reference/python/cirq/flatten_to_ops", "2026-07-01"],
	["reference/python/cirq/flatten_to_ops_or_moments", "2026-07-01"],
	["reference/python/cirq/flatten_with_params", "2026-07-01"],
	["reference/python/cirq/flatten_with_sweep", "2026-07-01"],
	["reference/python/cirq/freeze_op_tree", "2026-07-01"],
	["reference/python/cirq/generalized_amplitude_damp", "2026-10-08"],
	["reference/python/cirq/get_placements", "2026-07-01"],
	["reference/python/cirq/get_state_histogram", "2026-07-01"],
	["reference/python/cirq/givens", "2026-07-01"],
	["reference/python/cirq/global_phase_operation", "2026-07-01"],
	["reference/python/cirq/has_kraus", "2026-07-01"],
	["reference/python/cirq/has_mixture", "2026-07-01"],
	["reference/python/cirq/has_stabilizer_effect", "2026-07-01"],
	["reference/python/cirq/has_unitary", "2026-10-08"],
	["reference/python/cirq/hilbert_schmidt_inner_product", "2026-07-01"],
	["reference/python/cirq/hog_score_xeb_fidelity_from_probabilities", "2026-07-01"],
	["reference/python/cirq/identity_each", "2026-07-01"],
	["reference/python/cirq/index_tags", "2026-07-01"],
	["reference/python/cirq/integrated_histogram", "2026-10-08"],
	["reference/python/cirq/inverse", "2026-10-08"],
	["reference/python/cirq/is_cptp", "2026-07-01"],
	["reference/python/cirq/is_diagonal", "2026-07-01"],
	["reference/python/cirq/is_hermitian", "2026-07-01"],
	["reference/python/cirq/is_measurement", "2026-07-13"],
	["reference/python/cirq/is_native_neutral_atom_gate", "2026-07-01"],
	["reference/python/cirq/is_native_neutral_atom_op", "2026-07-01"],
	["reference/python/cirq/is_negligible_turn", "2026-07-01"],
	["reference/python/cirq/is_normal", "2026-07-01"],
	["reference/python/cirq/is_orthogonal", "2026-07-01"],
	["reference/python/cirq/is_parameterized", "2026-07-01"],
	["reference/python/cirq/is_special_orthogonal", "2026-07-01"],
	["reference/python/cirq/is_special_unitary", "2026-07-01"],
	["reference/python/cirq/is_unitary", "2026-07-01"],
	["reference/python/cirq/is_valid_placement", "2026-07-03"],
	["reference/python/cirq/json_cirq_type", "2026-07-01"],
	["reference/python/cirq/json_namespace", "2026-07-01"],
	["reference/python/cirq/kak_canonicalize_vector", "2026-07-01"],
	["reference/python/cirq/kak_decomposition", "2026-07-01"],
	["reference/python/cirq/kak_vector", "2026-10-08"],
	["reference/python/cirq/kraus", "2026-10-08"],
	["reference/python/cirq/kraus_to_choi", "2026-10-08"],
	["reference/python/cirq/kraus_to_superoperator", "2026-10-08"],
	["reference/python/cirq/kron", "2026-10-08"],
	["reference/python/cirq/kron_bases", "2026-07-01"],
	["reference/python/cirq/kron_factor_4x4_to_2x2s", "2026-10-08"],
	["reference/python/cirq/kron_with_controls", "2026-10-08"],
	["reference/python/cirq/linear_xeb_fidelity", "2026-07-01"],
	["reference/python/cirq/linear_xeb_fidelity_from_probabilities", "2026-07-01"],
	["reference/python/cirq/list_of_dicts_to_zip", "2026-07-03"],
	["reference/python/cirq/log_xeb_fidelity", "2026-07-01"],
	["reference/python/cirq/log_xeb_fidelity_from_probabilities", "2026-07-01"],
	["reference/python/cirq/map_clean_and_borrowable_qubits", "2026-07-01"],
	["reference/python/cirq/map_eigenvalues", "2026-07-01"],
	["reference/python/cirq/map_moments", "2026-07-01"],
	["reference/python/cirq/map_operations", "2026-10-08"],
	["reference/python/cirq/map_operations_and_unroll", "2026-10-08"],
	["reference/python/cirq/match_global_phase", "2026-07-01"],
	["reference/python/cirq/matrix_commutes", "2026-07-01"],
	["reference/python/cirq/matrix_from_basis_coefficients", "2026-07-01"],
	["reference/python/cirq/measure_confusion_matrix", "2026-07-01"],
	["reference/python/cirq/measure_density_matrix", "2026-07-01"],
	["reference/python/cirq/measure_each", "2026-07-01"],
	["reference/python/cirq/measure_paulistring_terms", "2026-07-01"],
	["reference/python/cirq/measure_single_paulistring", "2026-10-08"],
	["reference/python/cirq/measure_state_vector", "2026-07-01"],
	["reference/python/cirq/measurement_key_name", "2026-07-01"],
	["reference/python/cirq/measurement_key_names", "2026-07-01"],
	["reference/python/cirq/measurement_key_obj", "2026-07-01"],
	["reference/python/cirq/measurement_key_objs", "2026-07-01"],
	["reference/python/cirq/measurement_keys_touched", "2026-07-01"],
	["reference/python/cirq/merge_k_qubit_unitaries", "2026-07-01"],
	["reference/python/cirq/merge_k_qubit_unitaries_to_circuit_op", "2026-07-01"],
	["reference/python/cirq/merge_moments", "2026-07-01"],
	["reference/python/cirq/merge_moments_batch", "2026-10-08"],
	["reference/python/cirq/merge_operations", "2026-07-01"],
	["reference/python/cirq/merge_operations_to_circuit_op", "2026-07-01"],
	["reference/python/cirq/merge_single_qubit_gates_to_phased_x_and_z", "2026-07-01"],
	["reference/python/cirq/merge_single_qubit_gates_to_phxz", "2026-07-05"],
	["reference/python/cirq/merge_single_qubit_gates_to_phxz_symbolized", "2026-07-01"],
	["reference/python/cirq/merge_single_qubit_moments_to_phxz", "2026-07-01"],
	["reference/python/cirq/mixture", "2026-10-20"],
	["reference/python/cirq/ms", "2026-07-01"],
	["reference/python/cirq/mul", "2026-10-08"],
	["reference/python/cirq/num_cnots_required", "2026-07-01"],
	["reference/python/cirq/num_qubits", "2026-07-05"],
	["reference/python/cirq/obj_to_dict_helper", "2026-07-01"],
	["reference/python/cirq/one_hot", "2026-07-01"],
	["reference/python/cirq/operation_to_choi", "2026-10-08"],
	["reference/python/cirq/operation_to_superoperator", "2026-07-01"],
	["reference/python/cirq/optimize_for_target_gateset", "2026-07-01"],
	["reference/python/cirq/parallel_gate_op", "2026-07-01"],
	["reference/python/cirq/parameter_names", "2026-07-01"],
	["reference/python/cirq/parameter_symbols", "2026-07-01"],
	["reference/python/cirq/parameterized_2q_op_to_sqrt_iswap_operations", "2026-07-01"],
	["reference/python/cirq/partial_trace", "2026-07-01"],
	["reference/python/cirq/partial_trace_of_state_vector_as_mixture", "2026-07-01"],
	["reference/python/cirq/pauli_expansion", "2026-07-01"],
	["reference/python/cirq/phase_by", "2026-10-08"],
	["reference/python/cirq/phase_damp", "2026-07-01"],
	["reference/python/cirq/phase_flip", "2026-07-01"],
	["reference/python/cirq/plot_density_matrix", "2026-07-01"],
	["reference/python/cirq/plot_state_histogram", "2026-07-01"],
	["reference/python/cirq/pow", "2026-10-08"],
	["reference/python/cirq/pow_pauli_combination", "2026-07-01"],
	["reference/python/cirq/prepare_two_qubit_state_using_cz", "2026-07-01"],
	["reference/python/cirq/prepare_two_qubit_state_using_iswap", "2026-07-01"],
	["reference/python/cirq/prepare_two_qubit_state_using_sqrt_iswap", "2026-07-01"],
	["reference/python/cirq/q", "2026-07-01"],
	["reference/python/cirq/qasm", "2026-07-01"],
	["reference/python/cirq/qft", "2026-07-01"],
	["reference/python/cirq/qid_shape", "2026-07-01"],
	["reference/python/cirq/quantum_shannon_decomposition", "2026-10-08"],
	["reference/python/cirq/quantum_state", "2026-07-01"],
	["reference/python/cirq/quirk_json_to_circuit", "2026-07-01"],
	["reference/python/cirq/quirk_url_to_circuit", "2026-07-01"],
	["reference/python/cirq/read_json", "2026-07-01"],
	["reference/python/cirq/read_json_gzip", "2026-07-01"],
	["reference/python/cirq/reflection_matrix_pow", "2026-07-01"],
	["reference/python/cirq/remove_tags", "2026-07-01"],
	["reference/python/cirq/reset_each", "2026-07-01"],
	["reference/python/cirq/resolve_parameters", "2026-07-01"],
	["reference/python/cirq/resolve_parameters_once", "2026-07-01"],
	["reference/python/cirq/riswap", "2026-07-01"],
	["reference/python/cirq/routed_circuit_with_mapping", "2026-07-01"],
	["reference/python/cirq/rx", "2026-07-01"],
	["reference/python/cirq/ry", "2026-07-01"],
	["reference/python/cirq/rz", "2026-07-01"],
	["reference/python/cirq/sample", "2026-07-01"],
	["reference/python/cirq/sample_density_matrix", "2026-07-01"],
	["reference/python/cirq/sample_state_vector", "2026-07-01"],
	["reference/python/cirq/sample_sweep", "2026-07-01"],
	["reference/python/cirq/scatter_plot_normalized_kak_interaction_coefficients", "2026-07-01"],
	["reference/python/cirq/single_qubit_matrix_to_gates", "2026-07-01"],
	["reference/python/cirq/single_qubit_matrix_to_pauli_rotations", "2026-07-01"],
	["reference/python/cirq/single_qubit_matrix_to_phased_x_z", "2026-07-01"],
	["reference/python/cirq/single_qubit_matrix_to_phxz", "2026-07-01"],
	["reference/python/cirq/single_qubit_op_to_framed_phase_form", "2026-07-01"],
	["reference/python/cirq/slice_for_qubits_equal_to", "2026-08-15"],
	["reference/python/cirq/so4_to_magic_su2s", "2026-07-01"],
	["reference/python/cirq/state_vector_kronecker_product", "2026-07-01"],
	["reference/python/cirq/state_vector_to_probabilities", "2026-10-08"],
	["reference/python/cirq/stratified_circuit", "2026-07-01"],
	["reference/python/cirq/sub_state_vector", "2026-10-08"],
	["reference/python/cirq/superoperator_to_choi", "2026-10-08"],
	["reference/python/cirq/superoperator_to_kraus", "2026-10-08"],
	["reference/python/cirq/symbol", "2026-10-08"],
	["reference/python/cirq/symbolize_single_qubit_gates_by_indexed_tags", "2026-08-15"],
	["reference/python/cirq/synchronize_terminal_measurements", "2026-07-01"],
	["reference/python/cirq/targeted_conjugate_about", "2026-07-01"],
	["reference/python/cirq/targeted_left_multiply", "2026-07-01"],
	["reference/python/cirq/testing", "2026-10-08"],
	["reference/python/cirq/testing/DoesNotSupportSerializationGate", "2026-07-01"],
	["reference/python/cirq/testing/EqualsTester", "2026-07-01"],
	["reference/python/cirq/testing/FakePrinter", "2026-07-01"],
	["reference/python/cirq/testing/NoIdentifierQubit", "2026-07-01"],
	["reference/python/cirq/testing/OrderTester", "2026-07-01"],
	["reference/python/cirq/testing/PhaseUsingCleanAncilla", "2026-07-01"],
	["reference/python/cirq/testing/PhaseUsingDirtyAncilla", "2026-07-01"],
	["reference/python/cirq/testing/RoutingTestingDevice", "2026-07-01"],
	["reference/python/cirq/testing/SingleQubitGate", "2026-07-01"],
	["reference/python/cirq/testing/ThreeQubitGate", "2026-07-01"],
	["reference/python/cirq/testing/TwoQubitGate", "2026-07-01"],
	["reference/python/cirq/testing/ValidatingTestDevice", "2026-07-01"],
	["reference/python/cirq/testing/assert_all_implemented_act_on_effects_match_unitary", "2026-10-08"],
	["reference/python/cirq/testing/assert_allclose_up_to_global_phase", "2026-07-01"],
	["reference/python/cirq/testing/assert_circuits_have_same_unitary_given_final_permutation", "2026-07-01"],
	["reference/python/cirq/testing/assert_circuits_with_terminal_measurements_are_equivalent", "2026-07-01"],
	["reference/python/cirq/testing/assert_commutes_magic_method_consistent_with_unitaries", "2026-07-01"],
	["reference/python/cirq/testing/assert_consistent_channel", "2026-07-01"],
	["reference/python/cirq/testing/assert_consistent_mixture", "2026-07-01"],
	["reference/python/cirq/testing/assert_consistent_resolve_parameters", "2026-07-01"],
	["reference/python/cirq/testing/assert_controlled_and_controlled_by_identical", "2026-07-01"],
	["reference/python/cirq/testing/assert_controlled_unitary_consistent", "2026-07-01"],
	["reference/python/cirq/testing/assert_decompose_ends_at_default_gateset", "2026-07-01"],
	["reference/python/cirq/testing/assert_decompose_is_consistent_with_unitary", "2026-07-01"],
	["reference/python/cirq/testing/assert_deprecated", "2026-07-01"],
	["reference/python/cirq/testing/assert_eigengate_implements_consistent_protocols", "2026-10-08"],
	["reference/python/cirq/testing/assert_equivalent_computational_basis_map", "2026-07-01"],
	["reference/python/cirq/testing/assert_equivalent_op_tree", "2026-07-01"],
	["reference/python/cirq/testing/assert_equivalent_repr", "2026-07-01"],
	["reference/python/cirq/testing/assert_has_consistent_apply_channel", "2026-10-08"],
	["reference/python/cirq/testing/assert_has_consistent_apply_unitary", "2026-10-08"],
	["reference/python/cirq/testing/assert_has_consistent_apply_unitary_for_various_exponents", "2026-10-08"],
	["reference/python/cirq/testing/assert_has_consistent_qid_shape", "2026-07-01"],
	["reference/python/cirq/testing/assert_has_consistent_trace_distance_bound", "2026-07-01"],
	["reference/python/cirq/testing/assert_has_diagram", "2026-07-01"],
	["reference/python/cirq/testing/assert_implements_consistent_protocols", "2026-10-08"],
	["reference/python/cirq/testing/assert_json_roundtrip_works", "2026-07-01"],
	["reference/python/cirq/testing/assert_logs", "2026-07-01"],
	["reference/python/cirq/testing/assert_pauli_expansion_is_consistent_with_unitary", "2026-07-01"],
	["reference/python/cirq/testing/assert_phase_by_is_consistent_with_unitary", "2026-07-01"],
	["reference/python/cirq/testing/assert_qasm_is_consistent_with_unitary", "2026-07-01"],
	["reference/python/cirq/testing/assert_repr_pretty", "2026-07-03"],
	["reference/python/cirq/testing/assert_repr_pretty_contains", "2026-07-01"],
	["reference/python/cirq/testing/assert_same_circuits", "2026-07-01"],
	["reference/python/cirq/testing/assert_specifies_has_unitary_if_unitary", "2026-07-01"],
	["reference/python/cirq/testing/assert_unitary_is_consistent", "2026-07-01"],
	["reference/python/cirq/testing/circuit_compare", "2026-10-08"],
	["reference/python/cirq/testing/consistent_act_on", "2026-07-01"],
	["reference/python/cirq/testing/consistent_act_on/state_vector_has_stabilizer", "2026-07-01"],
	["reference/python/cirq/testing/consistent_channels", "2026-07-01"],
	["reference/python/cirq/testing/consistent_controlled_gate_op", "2026-07-01"],
	["reference/python/cirq/testing/consistent_decomposition", "2026-07-01"],
	["reference/python/cirq/testing/consistent_pauli_expansion", "2026-07-01"],
	["reference/python/cirq/testing/consistent_phase_by", "2026-07-01"],
	["reference/python/cirq/testing/consistent_protocols", "2026-10-08"],
	["reference/python/cirq/testing/consistent_protocols/assert_eigen_shifts_is_consistent_with_eigen_components", "2026-07-01"],
	["reference/python/cirq/testing/consistent_qasm", "2026-07-01"],
	["reference/python/cirq/testing/consistent_qasm/assert_qiskit_parsed_qasm_consistent_with_unitary", "2026-07-01"],
	["reference/python/cirq/testing/consistent_resolve_parameters", "2026-07-01"],
	["reference/python/cirq/testing/consistent_specified_has_unitary", "2026-07-01"],
	["reference/python/cirq/testing/consistent_unitary", "2026-07-01"],
	["reference/python/cirq/testing/construct_grid_device", "2026-07-01"],
	["reference/python/cirq/testing/construct_ring_device", "2026-07-01"],
	["reference/python/cirq/testing/deprecation", "2026-07-01"],
	["reference/python/cirq/testing/devices", "2026-07-01"],
	["reference/python/cirq/testing/equals_tester", "2026-07-01"],
	["reference/python/cirq/testing/equivalent_basis_map", "2026-07-01"],
	["reference/python/cirq/testing/equivalent_repr_eval", "2026-07-01"],
	["reference/python/cirq/testing/gate_features", "2026-07-01"],
	["reference/python/cirq/testing/highlight_text_differences", "2026-07-01"],
	["reference/python/cirq/testing/json", "2026-07-01"],
	["reference/python/cirq/testing/json/ModuleJsonTestSpec", "2026-07-01"],
	["reference/python/cirq/testing/json/spec_for", "2026-07-01"],
	["reference/python/cirq/testing/lin_alg_utils", "2026-07-01"],
	["reference/python/cirq/testing/logs", "2026-10-08"],
	["reference/python/cirq/testing/no_identifier_qubit", "2026-07-01"],
	["reference/python/cirq/testing/nonoptimal_toffoli_circuit", "2026-07-01"],
	["reference/python/cirq/testing/op_tree", "2026-07-01"],
	["reference/python/cirq/testing/order_tester", "2026-07-01"],
	["reference/python/cirq/testing/pytest_utils", "2026-07-01"],
	["reference/python/cirq/testing/random_circuit", "2026-07-01"],
	["reference/python/cirq/testing/random_density_matrix", "2026-07-01"],
	["reference/python/cirq/testing/random_orthogonal", "2026-07-01"],
	["reference/python/cirq/testing/random_special_orthogonal", "2026-07-01"],
	["reference/python/cirq/testing/random_special_unitary", "2026-07-01"],
	["reference/python/cirq/testing/random_superposition", "2026-07-01"],
	["reference/python/cirq/testing/random_two_qubit_circuit_with_czs", "2026-07-01"],
	["reference/python/cirq/testing/random_unitary", "2026-07-01"],
	["reference/python/cirq/testing/repr_pretty_tester", "2026-07-01"],
	["reference/python/cirq/testing/retry_once_after_timeout", "2026-07-01"],
	["reference/python/cirq/testing/retry_once_with_later_random_values", "2026-07-01"],
	["reference/python/cirq/testing/routing_devices", "2026-07-01"],
	["reference/python/cirq/testing/sample_circuits", "2026-07-01"],
	["reference/python/cirq/testing/sample_gates", "2026-07-01"],
	["reference/python/cirq/three_qubit_matrix_to_operations", "2026-07-01"],
	["reference/python/cirq/to_json", "2026-07-01"],
	["reference/python/cirq/to_json_gzip", "2026-07-01"],
	["reference/python/cirq/to_resolvers", "2026-07-01"],
	["reference/python/cirq/to_special", "2026-07-01"],
	["reference/python/cirq/to_sweep", "2026-07-01"],
	["reference/python/cirq/to_sweeps", "2026-07-01"],
	["reference/python/cirq/to_valid_density_matrix", "2026-07-01"],
	["reference/python/cirq/to_valid_state_vector", "2026-07-01"],
	["reference/python/cirq/toggle_tags", "2026-07-01"],
	["reference/python/cirq/trace_distance_bound", "2026-07-01"],
	["reference/python/cirq/trace_distance_from_angle_list", "2026-07-01"],
	["reference/python/cirq/transform_op_tree", "2026-07-01"],
	["reference/python/cirq/transformer", "2026-07-01"],
	["reference/python/cirq/two_qubit_gate_numerical_compilation", "2026-10-20"],
	["reference/python/cirq/two_qubit_gate_product_tabulation", "2026-07-01"],
	["reference/python/cirq/two_qubit_matrix_to_cz_isometry", "2026-07-01"],
	["reference/python/cirq/two_qubit_matrix_to_cz_operations", "2026-07-01"],
	["reference/python/cirq/two_qubit_matrix_to_diagonal_and_cz_operations", "2026-07-05"],
	["reference/python/cirq/two_qubit_matrix_to_ion_operations", "2026-07-01"],
	["reference/python/cirq/two_qubit_matrix_to_sqrt_iswap_operations", "2026-07-01"],
	["reference/python/cirq/unitary", "2026-07-01"],
	["reference/python/cirq/unitary_eig", "2026-07-01"],
	["reference/python/cirq/unroll_circuit_op", "2026-07-05"],
	["reference/python/cirq/unroll_circuit_op_greedy_earliest", "2026-07-01"],
	["reference/python/cirq/unroll_circuit_op_greedy_frontier", "2026-07-01"],
	["reference/python/cirq/validate_density_matrix", "2026-07-17"],
	["reference/python/cirq/validate_indices", "2026-07-01"],
	["reference/python/cirq/validate_mixture", "2026-07-01"],
	["reference/python/cirq/validate_normalized_state_vector", "2026-07-01"],
	["reference/python/cirq/validate_probability", "2026-07-01"],
	["reference/python/cirq/validate_qid_shape", "2026-07-01"],
	["reference/python/cirq/value_equality", "2026-10-08"],
	["reference/python/cirq/von_neumann_entropy", "2026-07-01"],
	["reference/python/cirq/wait", "2026-07-01"],
	["reference/python/cirq/with_debug", "2026-07-01"],
	["reference/python/cirq/with_key_path", "2026-07-01"],
	["reference/python/cirq/with_key_path_prefix", "2026-07-01"],
	["reference/python/cirq/with_measurement_key_mapping", "2026-07-01"],
	["reference/python/cirq/with_rescoped_keys", "2026-07-01"],
	["reference/python/cirq/xeb_fidelity", "2026-07-01"],
	["reference/python/cirq_aqt", "2026-07-01"],
	["reference/python/cirq_aqt/all_symbols", "2025-07-24"],
	["reference/python/cirq_aqt/aqt_device", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_device/AQTDevice", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_device/AQTNoiseModel", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_device/AQTSimulator", "2026-10-08"],
	["reference/python/cirq_aqt/aqt_device/OperationString", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_device/get_aqt_device", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_device/get_default_noise_dict", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_device/get_op_string", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_device_metadata", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_device_metadata/AQTDeviceMetadata", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_sampler", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_sampler/AQTSampler", "2026-10-08"],
	["reference/python/cirq_aqt/aqt_sampler/AQTSamplerLocalSimulator", "2026-10-08"],
	["reference/python/cirq_aqt/aqt_sampler/GateR", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_sampler/GateRXX", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_sampler/GateRZ", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_sampler/Measure", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_sampler/Resource", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_sampler/SingleQubitGate", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_sampler/Workspace", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_target_gateset", "2026-07-01"],
	["reference/python/cirq_aqt/aqt_target_gateset/AQTTargetGateset", "2026-07-01"],
	["reference/python/cirq_google", "2026-10-24"],
	["reference/python/cirq_google/all_symbols", "2026-10-08"],
	["reference/python/cirq_google/api", "2026-10-08"],
	["reference/python/cirq_google/api/v2", "2026-10-08"],
	["reference/python/cirq_google/api/v2/MeasureInfo", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/ArgDefinition", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/ArgumentRange", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/DeviceSpecification", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/DeviceSpecification/QubitAttributesEntry", "2026-07-03"],
	["reference/python/cirq_google/api/v2/device_pb2/GateDefinition", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSet", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/AnalogDetuneCouplerOnly", "2026-07-03"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/AnalogDetuneQubit", "2026-07-03"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/CZ", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/CZPowGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/CouplerPulse", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/FSimViaModel", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/InternalGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/Measurement", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/PhasedXZ", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/PhysicalZPow", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/Reset", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/SqrtISwap", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/SqrtISwapInv", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/Sycamore", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/TwoPulseFSim", "2026-07-03"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/VirtualZPow", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/Wait", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/GateSpecification/WaitGateWithUnit", "2026-07-03"],
	["reference/python/cirq_google/api/v2/device_pb2/QubitAttributeValue", "2026-07-03"],
	["reference/python/cirq_google/api/v2/device_pb2/QubitAttributes", "2026-07-03"],
	["reference/python/cirq_google/api/v2/device_pb2/QubitAttributes/AttributesEntry", "2026-07-03"],
	["reference/python/cirq_google/api/v2/device_pb2/Target", "2026-07-01"],
	["reference/python/cirq_google/api/v2/device_pb2/TargetSet", "2026-07-01"],
	["reference/python/cirq_google/api/v2/find_measurements", "2026-07-01"],
	["reference/python/cirq_google/api/v2/grid_qubit_from_proto_id", "2026-07-01"],
	["reference/python/cirq_google/api/v2/line_qubit_from_proto_id", "2026-07-01"],
	["reference/python/cirq_google/api/v2/metrics_pb2", "2026-07-01"],
	["reference/python/cirq_google/api/v2/metrics_pb2/Metric", "2026-07-01"],
	["reference/python/cirq_google/api/v2/metrics_pb2/MetricsSnapshot", "2026-07-01"],
	["reference/python/cirq_google/api/v2/metrics_pb2/Value", "2026-07-01"],
	["reference/python/cirq_google/api/v2/named_qubit_from_proto_id", "2026-07-01"],
	["reference/python/cirq_google/api/v2/ndarrays", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/TUIntMsg", "2026-07-01"],
	["reference/python/cirq_google/api/v2/ndarrays/from_bitarray", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/from_complex128_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/from_complex64_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/from_float16_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/from_float32_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/from_float64_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/from_int16_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/from_int32_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/from_int64_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/from_int8_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/from_uint8_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/to_bitarray", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/to_complex128_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/to_complex64_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/to_float16_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/to_float32_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/to_float64_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/to_int16_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/to_int32_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/to_int64_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/to_int8_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays/to_uint8_array", "2026-10-08"],
	["reference/python/cirq_google/api/v2/ndarrays_pb2", "2026-07-01"],
	["reference/python/cirq_google/api/v2/ndarrays_pb2/BitArray", "2026-07-01"],
	["reference/python/cirq_google/api/v2/ndarrays_pb2/Complex128Array", "2026-07-01"],
	["reference/python/cirq_google/api/v2/ndarrays_pb2/Complex64Array", "2026-07-01"],
	["reference/python/cirq_google/api/v2/ndarrays_pb2/Float16Array", "2026-07-01"],
	["reference/python/cirq_google/api/v2/ndarrays_pb2/Float32Array", "2026-07-01"],
	["reference/python/cirq_google/api/v2/ndarrays_pb2/Float64Array", "2026-07-01"],
	["reference/python/cirq_google/api/v2/ndarrays_pb2/Int16Array", "2026-07-01"],
	["reference/python/cirq_google/api/v2/ndarrays_pb2/Int32Array", "2026-07-01"],
	["reference/python/cirq_google/api/v2/ndarrays_pb2/Int64Array", "2026-07-01"],
	["reference/python/cirq_google/api/v2/ndarrays_pb2/Int8Array", "2026-07-01"],
	["reference/python/cirq_google/api/v2/pack_bits", "2026-10-08"],
	["reference/python/cirq_google/api/v2/program", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/AnalogDetuneCouplerOnly", "2026-07-03"],
	["reference/python/cirq_google/api/v2/program_pb2/AnalogDetuneQubit", "2026-07-03"],
	["reference/python/cirq_google/api/v2/program_pb2/Arg", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/ArgFunction", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/ArgMapping", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/ArgMapping/ArgEntry", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/ArgValue", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/CZPowGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/CalibrationTag", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/Circuit", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/CircuitOperation", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/ClassicalStateTag", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/CliffordTableau", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/Complex", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/CompressDurationTag", "2026-07-03"],
	["reference/python/cirq_google/api/v2/program_pb2/Constant", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/CouplerPulseGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/CustomArg", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/DepolarizingChannel", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/DynamicalDecouplingTag", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/FSimGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/FSimViaModelTag", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/FloatArg", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/FunctionInterpolation", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/Gate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/HPowGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/ISwapLikeGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/ISwapPowGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/IdentityGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/InternalGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/InternalGate/CustomArgsEntry", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/InternalGate/GateArgsEntry", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/InternalTag", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/InternalTag/CustomArgsEntry", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/InternalTag/TagArgsEntry", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/KeyedCircuit", "2026-07-03"],
	["reference/python/cirq_google/api/v2/program_pb2/KeyedCircuit/ArgsEntry", "2026-07-03"],
	["reference/python/cirq_google/api/v2/program_pb2/Language", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/MeasurementGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/MeasurementKey", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/MeasurementKeyMapping", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/MeasurementKeyMapping/MeasurementKeyEntry", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/Moment", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/NDArray", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/NoSyncTag", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/NoiseChannel", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/Operation", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/PhaseMatchTag", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/PhasedXPowGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/PhasedXZGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/PhysicalZTag", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/Program", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/Qubit", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/QubitMapping", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/QubitMapping/QubitEntry", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/RandomGateChannel", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/RepeatedBoolean", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/RepeatedDouble", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/RepeatedInt64", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/RepeatedString", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/RepetitionSpecification", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/RepetitionSpecification/RepetitionIds", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/ResetGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/ResetGate/ArgumentsEntry", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/SingleQubitCliffordGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/Tag", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/Tuple", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/TwoPulseFSimTag", "2026-07-03"],
	["reference/python/cirq_google/api/v2/program_pb2/WaitGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/WaitGateWithUnit", "2026-07-03"],
	["reference/python/cirq_google/api/v2/program_pb2/XPowGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/YPowGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/program_pb2/ZPowGate", "2026-07-01"],
	["reference/python/cirq_google/api/v2/qubit_from_proto_id", "2026-07-01"],
	["reference/python/cirq_google/api/v2/qubit_to_proto_id", "2026-07-01"],
	["reference/python/cirq_google/api/v2/result_pb2", "2026-07-01"],
	["reference/python/cirq_google/api/v2/result_pb2/MeasurementResult", "2026-07-01"],
	["reference/python/cirq_google/api/v2/result_pb2/ParameterDict", "2026-07-01"],
	["reference/python/cirq_google/api/v2/result_pb2/ParameterDict/ArgsEntry", "2026-07-03"],
	["reference/python/cirq_google/api/v2/result_pb2/ParameterDict/AssignmentsEntry", "2026-07-01"],
	["reference/python/cirq_google/api/v2/result_pb2/ParameterizedResult", "2026-07-01"],
	["reference/python/cirq_google/api/v2/result_pb2/QuantumCircuitCalibration", "2026-07-03"],
	["reference/python/cirq_google/api/v2/result_pb2/QubitMeasurementResult", "2026-07-01"],
	["reference/python/cirq_google/api/v2/result_pb2/Result", "2026-07-01"],
	["reference/python/cirq_google/api/v2/result_pb2/SweepResult", "2026-07-01"],
	["reference/python/cirq_google/api/v2/results", "2026-10-08"],
	["reference/python/cirq_google/api/v2/results_from_proto", "2026-07-01"],
	["reference/python/cirq_google/api/v2/results_to_proto", "2026-10-08"],
	["reference/python/cirq_google/api/v2/run_context_pb2", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/ConstValue", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/DeviceParameter", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/DeviceParametersDiff", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/DeviceParametersDiff/GenericValue", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/DeviceParametersDiff/Param", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/DeviceParametersDiff/ResourceGroup", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/FiniteRandomVariable", "2026-07-03"],
	["reference/python/cirq_google/api/v2/run_context_pb2/FiniteRandomVariable/DistributionEntry", "2026-07-03"],
	["reference/python/cirq_google/api/v2/run_context_pb2/Linspace", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/Metadata", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/ParameterSweep", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/Points", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/RunContext", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/SingleSweep", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/Sweep", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_pb2/SweepFunction", "2026-07-01"],
	["reference/python/cirq_google/api/v2/run_context_to_proto", "2026-10-08"],
	["reference/python/cirq_google/api/v2/sweep_from_proto", "2026-10-08"],
	["reference/python/cirq_google/api/v2/sweep_to_proto", "2026-10-08"],
	["reference/python/cirq_google/api/v2/sweeps", "2026-10-08"],
	["reference/python/cirq_google/api/v2/sweeps/metadata_from_proto", "2026-07-01"],
	["reference/python/cirq_google/api/v2/sweeps/metadata_to_proto", "2026-07-01"],
	["reference/python/cirq_google/api/v2/sweeps/sweepable_to_proto", "2026-07-03"],
	["reference/python/cirq_google/api/v2/unpack_bits", "2026-10-08"],
	["reference/python/cirq_google/cloud", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum", "2026-10-08"],
	["reference/python/cirq_google/cloud/quantum/CancelQuantumJobRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/CancelQuantumReservationRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/CompileQecProgramRequest", "2026-10-09"],
	["reference/python/cirq_google/cloud/quantum/CompileQecProgramResponse", "2026-10-09"],
	["reference/python/cirq_google/cloud/quantum/CreateQuantumJobRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/CreateQuantumProgramAndJobRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/CreateQuantumProgramRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/CreateQuantumReservationRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/DeleteQuantumJobRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/DeleteQuantumProgramRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/DeleteQuantumReservationRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/DeviceConfigKey", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/DeviceConfigSelector", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ExecutionStatus", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ExecutionStatus/Failure", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ExecutionStatus/Failure/Code", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ExecutionStatus/State", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ExecutionStatus/Timing", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/GcsLocation", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/GetQuantumCalibrationRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/GetQuantumJobRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/GetQuantumProcessorConfigRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/GetQuantumProcessorRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/GetQuantumProgramRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/GetQuantumReservationRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/GetQuantumResultRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/InlineData", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumCalibrationsRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumCalibrationsRequest/QuantumCalibrationView", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumCalibrationsResponse", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumJobEventsRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumJobEventsResponse", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumJobsRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumJobsResponse", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumProcessorAutomationRunHistoryRequest", "2026-10-09"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumProcessorAutomationRunHistoryResponse", "2026-10-09"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumProcessorConfigsRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumProcessorConfigsResponse", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumProcessorsRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumProcessorsResponse", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumProgramsRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumProgramsResponse", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumReservationBudgetsRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumReservationBudgetsResponse", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumReservationGrantsRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumReservationGrantsResponse", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumReservationsRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumReservationsResponse", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumTimeSlotsRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ListQuantumTimeSlotsResponse", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/OutputConfig", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QecRecipe", "2026-10-09"],
	["reference/python/cirq_google/cloud/quantum/QuantumCalibration", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumEngineServiceAsyncClient", "2026-10-08"],
	["reference/python/cirq_google/cloud/quantum/QuantumEngineServiceClient", "2026-10-08"],
	["reference/python/cirq_google/cloud/quantum/QuantumJob", "2026-10-08"],
	["reference/python/cirq_google/cloud/quantum/QuantumJob/CalibrateCircuitAction", "2026-10-09"],
	["reference/python/cirq_google/cloud/quantum/QuantumJob/ExecuteCircuitAction", "2026-10-09"],
	["reference/python/cirq_google/cloud/quantum/QuantumJob/LabelsEntry", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumJobEvent", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumProcessor", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumProcessor/ActivityStats", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumProcessor/Health", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumProcessorAutomationRunHistory", "2026-10-09"],
	["reference/python/cirq_google/cloud/quantum/QuantumProcessorConfig", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumProgram", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumProgram/LabelsEntry", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumReservation", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumReservationBudget", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumReservationGrant", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumReservationGrant/Budget", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumResult", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumRunStreamRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumRunStreamResponse", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumTimeSlot", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumTimeSlot/MaintenanceConfig", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumTimeSlot/ReservationConfig", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/QuantumTimeSlot/TimeSlotType", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/ReallocateQuantumReservationGrantRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/SchedulingConfig", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/SchedulingConfig/ProcessorSelector", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/StreamError", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/StreamError/Code", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/UpdateQuantumJobRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/UpdateQuantumProgramRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum/UpdateQuantumReservationRequest", "2026-07-01"],
	["reference/python/cirq_google/cloud/quantum_v1alpha1", "2026-10-08"],
	["reference/python/cirq_google/devices", "2026-07-01"],
	["reference/python/cirq_google/devices/GoogleNoiseProperties", "2026-10-08"],
	["reference/python/cirq_google/devices/GridDevice", "2026-07-01"],
	["reference/python/cirq_google/devices/NoiseModelFromGoogleNoiseProperties", "2026-07-01"],
	["reference/python/cirq_google/devices/google_noise_properties", "2026-07-01"],
	["reference/python/cirq_google/devices/grid_device", "2026-07-01"],
	["reference/python/cirq_google/devices/known_devices", "2026-07-01"],
	["reference/python/cirq_google/devices/known_devices/populate_qubit_pairs_in_device_proto", "2026-07-01"],
	["reference/python/cirq_google/devices/known_devices/populate_qubits_in_device_proto", "2026-07-01"],
	["reference/python/cirq_google/engine", "2026-07-01"],
	["reference/python/cirq_google/engine/AbstractEngine", "2026-07-01"],
	["reference/python/cirq_google/engine/AbstractJob", "2026-10-08"],
	["reference/python/cirq_google/engine/AbstractLocalEngine", "2026-07-01"],
	["reference/python/cirq_google/engine/AbstractLocalJob", "2026-10-08"],
	["reference/python/cirq_google/engine/AbstractLocalProcessor", "2026-10-08"],
	["reference/python/cirq_google/engine/AbstractLocalProgram", "2026-10-08"],
	["reference/python/cirq_google/engine/AbstractProcessor", "2026-10-08"],
	["reference/python/cirq_google/engine/AbstractProgram", "2026-10-08"],
	["reference/python/cirq_google/engine/Calibration", "2026-10-08"],
	["reference/python/cirq_google/engine/CalibrationLayer", "2026-07-01"],
	["reference/python/cirq_google/engine/Engine", "2026-10-08"],
	["reference/python/cirq_google/engine/EngineException", "2026-07-01"],
	["reference/python/cirq_google/engine/EngineJob", "2026-10-08"],
	["reference/python/cirq_google/engine/EngineProcessor", "2026-10-08"],
	["reference/python/cirq_google/engine/EngineProgram", "2026-10-08"],
	["reference/python/cirq_google/engine/EngineResult", "2026-10-08"],
	["reference/python/cirq_google/engine/ProcessorConfig", "2026-10-08"],
	["reference/python/cirq_google/engine/ProcessorSampler", "2026-10-08"],
	["reference/python/cirq_google/engine/ProtoVersion", "2026-07-01"],
	["reference/python/cirq_google/engine/Run", "2026-07-01"],
	["reference/python/cirq_google/engine/SimulatedLocalEngine", "2026-07-01"],
	["reference/python/cirq_google/engine/SimulatedLocalJob", "2026-10-08"],
	["reference/python/cirq_google/engine/SimulatedLocalProcessor", "2026-10-08"],
	["reference/python/cirq_google/engine/SimulatedLocalProgram", "2026-10-08"],
	["reference/python/cirq_google/engine/Snapshot", "2026-07-01"],
	["reference/python/cirq_google/engine/ValidatingSampler", "2026-10-08"],
	["reference/python/cirq_google/engine/abstract_engine", "2026-07-01"],
	["reference/python/cirq_google/engine/abstract_job", "2026-07-01"],
	["reference/python/cirq_google/engine/abstract_local_engine", "2026-07-01"],
	["reference/python/cirq_google/engine/abstract_local_job", "2026-07-01"],
	["reference/python/cirq_google/engine/abstract_local_processor", "2026-07-01"],
	["reference/python/cirq_google/engine/abstract_local_program", "2026-07-01"],
	["reference/python/cirq_google/engine/abstract_processor", "2026-10-08"],
	["reference/python/cirq_google/engine/abstract_program", "2026-07-01"],
	["reference/python/cirq_google/engine/asyncio_executor", "2026-07-01"],
	["reference/python/cirq_google/engine/asyncio_executor/AsyncioExecutor", "2026-10-08"],
	["reference/python/cirq_google/engine/calibration", "2026-07-01"],
	["reference/python/cirq_google/engine/calibration/ALL_METRICS", "2025-07-24"],
	["reference/python/cirq_google/engine/calibration/METRIC_DICT", "2025-07-24"],
	["reference/python/cirq_google/engine/calibration/METRIC_KEY", "2025-07-24"],
	["reference/python/cirq_google/engine/calibration/METRIC_VALUE", "2025-07-24"],
	["reference/python/cirq_google/engine/calibration_layer", "2026-07-01"],
	["reference/python/cirq_google/engine/calibration_to_noise_properties", "2026-07-01"],
	["reference/python/cirq_google/engine/create_default_noisy_quantum_virtual_machine", "2026-07-01"],
	["reference/python/cirq_google/engine/create_device_from_processor_id", "2026-07-01"],
	["reference/python/cirq_google/engine/create_noiseless_virtual_engine_from_device", "2026-07-01"],
	["reference/python/cirq_google/engine/create_noiseless_virtual_engine_from_latest_templates", "2026-07-01"],
	["reference/python/cirq_google/engine/create_noiseless_virtual_engine_from_proto", "2026-07-01"],
	["reference/python/cirq_google/engine/create_noiseless_virtual_engine_from_templates", "2026-07-01"],
	["reference/python/cirq_google/engine/engine", "2026-07-01"],
	["reference/python/cirq_google/engine/engine/EngineContext", "2026-07-01"],
	["reference/python/cirq_google/engine/engine_client", "2026-07-01"],
	["reference/python/cirq_google/engine/engine_client/EngineClient", "2026-10-08"],
	["reference/python/cirq_google/engine/engine_job", "2026-07-01"],
	["reference/python/cirq_google/engine/engine_processor", "2026-07-01"],
	["reference/python/cirq_google/engine/engine_program", "2026-07-01"],
	["reference/python/cirq_google/engine/engine_result", "2026-07-01"],
	["reference/python/cirq_google/engine/engine_validator", "2026-07-01"],
	["reference/python/cirq_google/engine/engine_validator/PROGRAM_VALIDATOR_TYPE", "2026-07-01"],
	["reference/python/cirq_google/engine/engine_validator/create_engine_validator", "2026-07-01"],
	["reference/python/cirq_google/engine/engine_validator/create_program_validator", "2026-07-01"],
	["reference/python/cirq_google/engine/engine_validator/validate_for_engine", "2026-07-01"],
	["reference/python/cirq_google/engine/engine_validator/validate_program", "2026-07-01"],
	["reference/python/cirq_google/engine/estimate_run_batch_time", "2026-07-01"],
	["reference/python/cirq_google/engine/estimate_run_sweep_time", "2026-07-01"],
	["reference/python/cirq_google/engine/estimate_run_time", "2026-07-01"],
	["reference/python/cirq_google/engine/get_engine", "2026-07-01"],
	["reference/python/cirq_google/engine/get_engine_calibration", "2026-07-01"],
	["reference/python/cirq_google/engine/get_engine_device", "2026-07-01"],
	["reference/python/cirq_google/engine/get_engine_sampler", "2026-07-01"],
	["reference/python/cirq_google/engine/list_virtual_processors", "2026-07-01"],
	["reference/python/cirq_google/engine/load_device_noise_properties", "2026-07-01"],
	["reference/python/cirq_google/engine/load_median_device_calibration", "2026-07-01"],
	["reference/python/cirq_google/engine/load_sample_device_zphase", "2026-07-01"],
	["reference/python/cirq_google/engine/local_simulation_type", "2026-07-01"],
	["reference/python/cirq_google/engine/local_simulation_type/LocalSimulationType", "2026-07-01"],
	["reference/python/cirq_google/engine/noise_properties_from_calibration", "2026-07-01"],
	["reference/python/cirq_google/engine/processor_config", "2026-07-03"],
	["reference/python/cirq_google/engine/processor_config/validate_device_config_revision", "2026-07-03"],
	["reference/python/cirq_google/engine/processor_sampler", "2026-07-01"],
	["reference/python/cirq_google/engine/runtime_estimator", "2026-07-01"],
	["reference/python/cirq_google/engine/simulated_local_engine", "2026-07-01"],
	["reference/python/cirq_google/engine/simulated_local_job", "2026-07-01"],
	["reference/python/cirq_google/engine/simulated_local_processor", "2026-07-01"],
	["reference/python/cirq_google/engine/simulated_local_program", "2026-07-01"],
	["reference/python/cirq_google/engine/stream_manager", "2026-07-01"],
	["reference/python/cirq_google/engine/stream_manager/ResponseDemux", "2026-07-01"],
	["reference/python/cirq_google/engine/stream_manager/StreamError", "2026-07-01"],
	["reference/python/cirq_google/engine/stream_manager/StreamManager", "2026-07-01"],
	["reference/python/cirq_google/engine/util", "2026-07-01"],
	["reference/python/cirq_google/engine/util/ZPhaseDataType", "2025-07-24"],
	["reference/python/cirq_google/engine/util/pack_any", "2026-07-01"],
	["reference/python/cirq_google/engine/util/unpack_any", "2026-07-01"],
	["reference/python/cirq_google/engine/validating_sampler", "2026-07-01"],
	["reference/python/cirq_google/engine/validating_sampler/VALIDATOR_TYPE", "2026-07-01"],
	["reference/python/cirq_google/engine/virtual_engine_factory", "2026-07-01"],
	["reference/python/cirq_google/engine/virtual_engine_factory/create_device_spec_from_processor_id", "2026-07-01"],
	["reference/python/cirq_google/engine/virtual_engine_factory/create_noiseless_virtual_processor_from_proto", "2026-07-01"],
	["reference/python/cirq_google/engine/virtual_engine_factory/create_noiseless_virtual_processor_from_template", "2026-07-01"],
	["reference/python/cirq_google/engine/virtual_engine_factory/extract_gate_times_ns_from_device", "2026-07-01"],
	["reference/python/cirq_google/experimental", "2026-07-01"],
	["reference/python/cirq_google/experimental/CouplerPulse", "2026-07-01"],
	["reference/python/cirq_google/experimental/PerQubitDepolarizingWithDampedReadoutNoiseModel", "2026-07-01"],
	["reference/python/cirq_google/experimental/noise_models", "2026-07-01"],
	["reference/python/cirq_google/experimental/noise_models/noise_models", "2026-07-01"],
	["reference/python/cirq_google/experimental/noise_models/noise_models/exp", "2025-07-24"],
	["reference/python/cirq_google/experimental/ops", "2026-07-01"],
	["reference/python/cirq_google/experimental/ops/coupler_pulse", "2026-07-01"],
	["reference/python/cirq_google/experimental/simple_noise_from_calibration_metrics", "2026-07-01"],
	["reference/python/cirq_google/json_resolver_cache", "2026-07-01"],
	["reference/python/cirq_google/line", "2026-07-01"],
	["reference/python/cirq_google/line/AnnealSequenceSearchStrategy", "2026-07-01"],
	["reference/python/cirq_google/line/GreedySequenceSearchStrategy", "2026-07-01"],
	["reference/python/cirq_google/line/LinePlacementStrategy", "2026-07-01"],
	["reference/python/cirq_google/line/line_on_device", "2026-07-01"],
	["reference/python/cirq_google/line/placement", "2026-07-01"],
	["reference/python/cirq_google/line/placement/GridQubitLineTuple", "2026-07-01"],
	["reference/python/cirq_google/line/placement/anneal", "2026-07-01"],
	["reference/python/cirq_google/line/placement/anneal/AnnealSequenceSearch", "2026-07-01"],
	["reference/python/cirq_google/line/placement/anneal/EDGE", "2025-07-24"],
	["reference/python/cirq_google/line/placement/anneal/LineSequence", "2025-07-24"],
	["reference/python/cirq_google/line/placement/anneal/index_2d", "2026-07-01"],
	["reference/python/cirq_google/line/placement/anneal_minimize", "2026-07-01"],
	["reference/python/cirq_google/line/placement/chip", "2026-07-01"],
	["reference/python/cirq_google/line/placement/chip/above", "2026-07-01"],
	["reference/python/cirq_google/line/placement/chip/below", "2026-07-01"],
	["reference/python/cirq_google/line/placement/chip/chip_as_adjacency_list", "2026-07-01"],
	["reference/python/cirq_google/line/placement/chip/left_of", "2026-07-01"],
	["reference/python/cirq_google/line/placement/chip/right_of", "2026-07-01"],
	["reference/python/cirq_google/line/placement/greedy", "2026-07-01"],
	["reference/python/cirq_google/line/placement/greedy/GreedySequenceSearch", "2026-10-08"],
	["reference/python/cirq_google/line/placement/line", "2026-07-01"],
	["reference/python/cirq_google/line/placement/optimization", "2026-07-01"],
	["reference/python/cirq_google/line/placement/place_strategy", "2026-07-01"],
	["reference/python/cirq_google/line/placement/sequence", "2026-07-01"],
	["reference/python/cirq_google/line/placement/sequence/NotFoundError", "2026-07-01"],
	["reference/python/cirq_google/ops", "2026-10-08"],
	["reference/python/cirq_google/ops/AnalogDetuneCouplerOnly", "2026-10-08"],
	["reference/python/cirq_google/ops/AnalogDetuneQubit", "2026-10-08"],
	["reference/python/cirq_google/ops/CalibrationTag", "2026-07-01"],
	["reference/python/cirq_google/ops/CompressDurationTag", "2026-07-01"],
	["reference/python/cirq_google/ops/Coupler", "2026-07-01"],
	["reference/python/cirq_google/ops/DynamicalDecouplingTag", "2026-07-01"],
	["reference/python/cirq_google/ops/FSimGateFamily", "2026-10-08"],
	["reference/python/cirq_google/ops/FSimViaModelTag", "2026-07-01"],
	["reference/python/cirq_google/ops/InternalGate", "2026-07-01"],
	["reference/python/cirq_google/ops/InternalTag", "2026-07-01"],
	["reference/python/cirq_google/ops/LZSResetViaResonator", "2026-10-08"],
	["reference/python/cirq_google/ops/LeakageISWAP", "2026-07-01"],
	["reference/python/cirq_google/ops/MultiStepMultiLevelReset", "2026-10-09"],
	["reference/python/cirq_google/ops/MultilevelResetViaResonator", "2026-10-08"],
	["reference/python/cirq_google/ops/NoSyncTag", "2026-10-09"],
	["reference/python/cirq_google/ops/PhysicalZTag", "2026-10-08"],
	["reference/python/cirq_google/ops/SYC", "2025-07-24"],
	["reference/python/cirq_google/ops/SycamoreGate", "2026-07-01"],
	["reference/python/cirq_google/ops/TwoPulseFSimTag", "2026-07-01"],
	["reference/python/cirq_google/ops/WILLOW", "2025-07-24"],
	["reference/python/cirq_google/ops/WaitGateWithUnit", "2026-07-01"],
	["reference/python/cirq_google/ops/WillowGate", "2026-07-01"],
	["reference/python/cirq_google/ops/analog_detune_gates", "2026-07-01"],
	["reference/python/cirq_google/ops/calibration_tag", "2026-07-01"],
	["reference/python/cirq_google/ops/compress_duration_tag", "2026-07-03"],
	["reference/python/cirq_google/ops/coupler", "2026-07-01"],
	["reference/python/cirq_google/ops/dynamical_decoupling_tag", "2026-07-01"],
	["reference/python/cirq_google/ops/fsim_gate_family", "2026-07-01"],
	["reference/python/cirq_google/ops/fsim_via_model_tag", "2026-07-01"],
	["reference/python/cirq_google/ops/internal_gate", "2026-07-01"],
	["reference/python/cirq_google/ops/internal_gate/function_points_to_proto", "2026-07-01"],
	["reference/python/cirq_google/ops/internal_tag", "2026-07-01"],
	["reference/python/cirq_google/ops/leakage_iswap", "2026-07-03"],
	["reference/python/cirq_google/ops/lzs_reset", "2026-07-03"],
	["reference/python/cirq_google/ops/msmlr_reset", "2026-10-08"],
	["reference/python/cirq_google/ops/multi_level_reset", "2026-07-03"],
	["reference/python/cirq_google/ops/no_sync_tag", "2026-10-08"],
	["reference/python/cirq_google/ops/physical_z_tag", "2026-07-01"],
	["reference/python/cirq_google/ops/sycamore_gate", "2026-07-01"],
	["reference/python/cirq_google/ops/two_pulse_fsim_tag", "2026-07-03"],
	["reference/python/cirq_google/ops/wait_gate", "2026-07-03"],
	["reference/python/cirq_google/ops/willow_gate", "2026-07-01"],
	["reference/python/cirq_google/serialization", "2026-10-08"],
	["reference/python/cirq_google/serialization/CircuitOpDeserializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/CircuitOpSerializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/CircuitSerializer", "2026-10-18"],
	["reference/python/cirq_google/serialization/Serializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/arg_from_proto", "2026-10-08"],
	["reference/python/cirq_google/serialization/arg_func_langs", "2026-10-08"],
	["reference/python/cirq_google/serialization/arg_func_langs/arg_to_proto", "2026-07-01"],
	["reference/python/cirq_google/serialization/arg_func_langs/clifford_tableau_arg_to_proto", "2026-07-01"],
	["reference/python/cirq_google/serialization/arg_func_langs/clifford_tableau_from_proto", "2026-07-01"],
	["reference/python/cirq_google/serialization/arg_func_langs/condition_from_proto", "2026-07-01"],
	["reference/python/cirq_google/serialization/arg_func_langs/condition_to_proto", "2026-07-01"],
	["reference/python/cirq_google/serialization/arg_func_langs/dict_from_arg_mapping_proto", "2026-10-08"],
	["reference/python/cirq_google/serialization/arg_func_langs/dict_to_arg_mapping_proto", "2026-07-03"],
	["reference/python/cirq_google/serialization/arg_func_langs/float_arg_from_proto", "2026-10-12"],
	["reference/python/cirq_google/serialization/arg_func_langs/float_arg_to_proto", "2026-07-01"],
	["reference/python/cirq_google/serialization/arg_func_langs/internal_gate_arg_to_proto", "2026-07-01"],
	["reference/python/cirq_google/serialization/arg_func_langs/internal_gate_from_proto", "2026-07-01"],
	["reference/python/cirq_google/serialization/circuit_serializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/op_deserializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/op_deserializer/OpDeserializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/op_serializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/op_serializer/OpSerializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/serializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/stimcirq_deserializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/stimcirq_deserializer/StimCirqDeserializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/stimcirq_serializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/stimcirq_serializer/StimCirqSerializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/tag_deserializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/tag_deserializer/TagDeserializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/tag_serializer", "2026-07-01"],
	["reference/python/cirq_google/serialization/tag_serializer/TagSerializer", "2026-07-01"],
	["reference/python/cirq_google/study", "2026-07-01"],
	["reference/python/cirq_google/study/DeviceParameter", "2026-07-01"],
	["reference/python/cirq_google/study/FiniteRandomVariable", "2026-07-01"],
	["reference/python/cirq_google/study/Metadata", "2026-07-01"],
	["reference/python/cirq_google/study/device_parameter", "2026-07-01"],
	["reference/python/cirq_google/study/device_parameter/SupportsDeviceParameter", "2026-07-01"],
	["reference/python/cirq_google/study/finite_random_variable", "2026-07-03"],
	["reference/python/cirq_google/study/symbol_util", "2026-07-01"],
	["reference/python/cirq_google/study/symbol_util/dict_param_name", "2026-07-01"],
	["reference/python/cirq_google/study/symbol_util/direct_symbol_replacement", "2026-07-01"],
	["reference/python/cirq_google/study/symbol_util/is_parameterized_dict", "2026-07-01"],
	["reference/python/cirq_google/transformers", "2026-07-01"],
	["reference/python/cirq_google/transformers/GoogleCZTargetGateset", "2026-07-01"],
	["reference/python/cirq_google/transformers/SYCGaugeTransformer", "2025-07-24"],
	["reference/python/cirq_google/transformers/SycamoreTargetGateset", "2026-07-01"],
	["reference/python/cirq_google/transformers/analytical_decompositions", "2026-07-01"],
	["reference/python/cirq_google/transformers/analytical_decompositions/two_qubit_to_sycamore", "2026-07-01"],
	["reference/python/cirq_google/transformers/known_2q_op_to_sycamore_operations", "2026-07-01"],
	["reference/python/cirq_google/transformers/sycamore_gauge", "2026-07-01"],
	["reference/python/cirq_google/transformers/sycamore_gauge/SYCGaugeSelector", "2025-07-24"],
	["reference/python/cirq_google/transformers/target_gatesets", "2026-07-01"],
	["reference/python/cirq_google/transformers/target_gatesets/google_cz_gateset", "2026-07-01"],
	["reference/python/cirq_google/transformers/target_gatesets/sycamore_gateset", "2026-07-01"],
	["reference/python/cirq_google/transformers/target_gatesets/sycamore_gateset/merge_swap_rzz_and_2q_unitaries", "2026-07-01"],
	["reference/python/cirq_google/transformers/two_qubit_matrix_to_sycamore_operations", "2026-07-01"],
	["reference/python/cirq_google/workflow", "2026-07-01"],
	["reference/python/cirq_google/workflow/BitstringsMeasurement", "2026-07-01"],
	["reference/python/cirq_google/workflow/CouldNotPlaceError", "2026-07-01"],
	["reference/python/cirq_google/workflow/EngineProcessorRecord", "2026-07-01"],
	["reference/python/cirq_google/workflow/ExecutableGroupResult", "2026-07-01"],
	["reference/python/cirq_google/workflow/ExecutableGroupResultFilesystemRecord", "2026-07-01"],
	["reference/python/cirq_google/workflow/ExecutableResult", "2026-07-01"],
	["reference/python/cirq_google/workflow/ExecutableSpec", "2026-07-01"],
	["reference/python/cirq_google/workflow/HardcodedQubitPlacer", "2026-07-01"],
	["reference/python/cirq_google/workflow/KeyValueExecutableSpec", "2026-07-01"],
	["reference/python/cirq_google/workflow/NaiveQubitPlacer", "2026-07-01"],
	["reference/python/cirq_google/workflow/ProcessorRecord", "2026-07-01"],
	["reference/python/cirq_google/workflow/QuantumExecutable", "2026-07-01"],
	["reference/python/cirq_google/workflow/QuantumExecutableGroup", "2026-07-01"],
	["reference/python/cirq_google/workflow/QuantumRuntimeConfiguration", "2026-07-01"],
	["reference/python/cirq_google/workflow/QubitPlacer", "2026-07-01"],
	["reference/python/cirq_google/workflow/RandomDevicePlacer", "2026-07-01"],
	["reference/python/cirq_google/workflow/RuntimeInfo", "2026-07-01"],
	["reference/python/cirq_google/workflow/SharedRuntimeInfo", "2026-07-01"],
	["reference/python/cirq_google/workflow/SimulatedProcessorRecord", "2026-07-01"],
	["reference/python/cirq_google/workflow/SimulatedProcessorWithLocalDeviceRecord", "2026-07-01"],
	["reference/python/cirq_google/workflow/execute", "2026-10-25"],
	["reference/python/cirq_google/workflow/io", "2026-07-01"],
	["reference/python/cirq_google/workflow/processor_record", "2026-07-01"],
	["reference/python/cirq_google/workflow/progress", "2026-07-01"],
	["reference/python/cirq_google/workflow/quantum_executable", "2026-07-01"],
	["reference/python/cirq_google/workflow/quantum_executable/TParamPair", "2025-07-24"],
	["reference/python/cirq_google/workflow/quantum_runtime", "2026-07-01"],
	["reference/python/cirq_google/workflow/qubit_placement", "2026-07-01"],
	["reference/python/cirq_google/workflow/qubit_placement/default_topo_node_to_qubit", "2026-07-01"],
	["reference/python/cirq_ionq", "2026-10-24"],
	["reference/python/cirq_ionq/all_symbols", "2025-07-24"],
	["reference/python/cirq_ionq/calibration", "2026-07-01"],
	["reference/python/cirq_ionq/calibration/Calibration", "2026-10-08"],
	["reference/python/cirq_ionq/ionq_client", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_devices", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_devices/IonQAPIDevice", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_exceptions", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_exceptions/IonQException", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_exceptions/IonQNotFoundException", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_exceptions/IonQSerializerMixedGatesetsException", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_exceptions/IonQUnsuccessfulJobException", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_exceptions/NotSupportedPauliexpParameters", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_gateset", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_gateset/IonQTargetGateset", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_gateset/decompose_all_to_all_connect_ccz_gate", "2026-10-08"],
	["reference/python/cirq_ionq/ionq_native_gates", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_native_gates/GPI", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_native_gates/GPI2", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_native_gates/GPI2Gate", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_native_gates/GPIGate", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_native_gates/MS", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_native_gates/MSGate", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_native_gates/ZZ", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_native_gates/ZZGate", "2026-10-08"],
	["reference/python/cirq_ionq/ionq_native_target_gateset", "2026-07-01"],
	["reference/python/cirq_ionq/ionq_native_target_gateset/AriaNativeGateset", "2026-10-08"],
	["reference/python/cirq_ionq/ionq_native_target_gateset/ForteNativeGateset", "2026-10-08"],
	["reference/python/cirq_ionq/ionq_native_target_gateset/IonqNativeGatesetBase", "2026-10-14"],
	["reference/python/cirq_ionq/job", "2026-07-01"],
	["reference/python/cirq_ionq/job/Job", "2026-10-08"],
	["reference/python/cirq_ionq/json_resolver_cache", "2026-07-01"],
	["reference/python/cirq_ionq/results", "2026-07-01"],
	["reference/python/cirq_ionq/results/QPUResult", "2026-07-01"],
	["reference/python/cirq_ionq/results/SimulatorResult", "2026-07-01"],
	["reference/python/cirq_ionq/sampler", "2026-07-01"],
	["reference/python/cirq_ionq/sampler/Sampler", "2026-10-08"],
	["reference/python/cirq_ionq/serializer", "2026-10-08"],
	["reference/python/cirq_ionq/serializer/SerializedProgram", "2026-07-01"],
	["reference/python/cirq_ionq/serializer/Serializer", "2026-10-08"],
	["reference/python/cirq_ionq/service", "2026-07-01"],
	["reference/python/cirq_ionq/service/Service", "2026-10-08"],
	["reference/python/cirq_pasqal", "2026-07-01"],
	["reference/python/cirq_pasqal/all_symbols", "2026-07-01"],
	["reference/python/cirq_pasqal/json_resolver_cache", "2026-07-01"],
	["reference/python/cirq_pasqal/pasqal_device", "2026-07-01"],
	["reference/python/cirq_pasqal/pasqal_device/PasqalDevice", "2026-07-01"],
	["reference/python/cirq_pasqal/pasqal_device/PasqalVirtualDevice", "2026-07-01"],
	["reference/python/cirq_pasqal/pasqal_gateset", "2026-07-01"],
	["reference/python/cirq_pasqal/pasqal_gateset/PasqalGateset", "2026-07-01"],
	["reference/python/cirq_pasqal/pasqal_gateset/split_multi_op_moments", "2026-07-03"],
	["reference/python/cirq_pasqal/pasqal_noise_model", "2026-07-01"],
	["reference/python/cirq_pasqal/pasqal_noise_model/PasqalNoiseModel", "2026-07-01"],
	["reference/python/cirq_pasqal/pasqal_qubits", "2026-07-01"],
	["reference/python/cirq_pasqal/pasqal_qubits/ThreeDQubit", "2026-07-01"],
	["reference/python/cirq_pasqal/pasqal_qubits/TwoDQubit", "2026-07-01"],
	["reference/python/cirq_pasqal/pasqal_qubits/sqrt", "2026-03-07"],
	["reference/python/cirq_pasqal/pasqal_sampler", "2026-07-01"],
	["reference/python/cirq_pasqal/pasqal_sampler/PasqalSampler", "2026-10-08"],
	["reference/python/cirq_web", "2026-10-24"],
	["reference/python/cirq_web/all_symbols", "2026-10-08"],
	["reference/python/cirq_web/bloch_sphere", "2026-10-08"],
	["reference/python/cirq_web/bloch_sphere/BlochSphere", "2026-10-08"],
	["reference/python/cirq_web/bloch_sphere/bloch_sphere", "2026-10-08"],
	["reference/python/cirq_web/circuits", "2026-10-08"],
	["reference/python/cirq_web/circuits/Circuit3D", "2026-10-08"],
	["reference/python/cirq_web/circuits/Operation3DSymbol", "2026-10-08"],
	["reference/python/cirq_web/circuits/circuit", "2026-10-08"],
	["reference/python/cirq_web/circuits/symbols", "2026-10-08"],
	["reference/python/cirq_web/circuits/symbols/DefaultResolver", "2026-10-08"],
	["reference/python/cirq_web/circuits/symbols/SymbolInfo", "2026-10-08"],
	["reference/python/cirq_web/circuits/symbols/SymbolResolver", "2026-07-01"],
	["reference/python/cirq_web/circuits/symbols/resolve_operation", "2026-10-08"],
	["reference/python/cirq_web/deprecation", "2026-10-08"],
	["reference/python/cirq_web/deprecation/assert_deprecated_cirq_web_warning", "2026-10-08"],
	["reference/python/cirq_web/deprecation/deprecated_cirq_web_class", "2026-10-08"],
	["reference/python/cirq_web/deprecation/deprecated_cirq_web_function", "2026-10-08"],
	["reference/python/cirq_web/widget", "2026-10-08"],
	["reference/python/cirq_web/widget/Env", "2026-10-08"],
	["reference/python/cirq_web/widget/Widget", "2026-10-08"],
	["reference/python/fqe", "2025-07-24"],
	["reference/python/fqe/NumberOperator", "2025-07-24"],
	["reference/python/fqe/S2Operator", "2025-07-24"],
	["reference/python/fqe/SzOperator", "2025-07-24"],
	["reference/python/fqe/TimeReversalOp", "2025-07-24"],
	["reference/python/fqe/Wavefunction", "2025-07-24"],
	["reference/python/fqe/all_symbols", "2025-07-24"],
	["reference/python/fqe/apply", "2025-07-24"],
	["reference/python/fqe/apply_generated_unitary", "2025-07-24"],
	["reference/python/fqe/bitstring", "2025-07-24"],
	["reference/python/fqe/bitstring/check_conserved_bits", "2025-07-24"],
	["reference/python/fqe/bitstring/count_bits", "2025-07-24"],
	["reference/python/fqe/bitstring/count_bits_above", "2025-07-24"],
	["reference/python/fqe/bitstring/count_bits_below", "2025-07-24"],
	["reference/python/fqe/bitstring/count_bits_between", "2025-07-24"],
	["reference/python/fqe/bitstring/gbit_index", "2025-07-24"],
	["reference/python/fqe/bitstring/get_bit", "2025-07-24"],
	["reference/python/fqe/bitstring/integer_index", "2025-07-24"],
	["reference/python/fqe/bitstring/lexicographic_bitstring_generator", "2025-07-24"],
	["reference/python/fqe/bitstring/reverse_integer_index", "2026-06-23"],
	["reference/python/fqe/bitstring/set_bit", "2025-07-24"],
	["reference/python/fqe/bitstring/show_bits", "2025-07-24"],
	["reference/python/fqe/bitstring/unset_bit", "2025-07-24"],
	["reference/python/fqe/cirq_utils", "2025-07-24"],
	["reference/python/fqe/cirq_utils/X", "2025-07-24"],
	["reference/python/fqe/cirq_utils/Y", "2025-07-24"],
	["reference/python/fqe/cirq_utils/Z", "2025-07-24"],
	["reference/python/fqe/cirq_utils/qubit_op_to_gate", "2025-07-24"],
	["reference/python/fqe/cirq_utils/qubit_ops_to_circuit", "2025-07-24"],
	["reference/python/fqe/cirq_utils/qubit_projection", "2025-07-24"],
	["reference/python/fqe/cirq_utils/qubit_wavefunction_from_vacuum", "2025-07-24"],
	["reference/python/fqe/diagonal_coulomb", "2025-07-24"],
	["reference/python/fqe/diagonal_coulomb/DiagonalCoulomb", "2025-07-24"],
	["reference/python/fqe/diagonal_hamiltonian", "2025-07-24"],
	["reference/python/fqe/diagonal_hamiltonian/Diagonal", "2025-07-24"],
	["reference/python/fqe/dot", "2025-07-24"],
	["reference/python/fqe/expectationValue", "2025-07-24"],
	["reference/python/fqe/fci_graph", "2025-07-24"],
	["reference/python/fqe/fci_graph/FciGraph", "2025-07-24"],
	["reference/python/fqe/fci_graph/Spinmap", "2025-07-24"],
	["reference/python/fqe/fci_graph/binom", "2025-07-24"],
	["reference/python/fqe/fci_graph_set", "2025-07-24"],
	["reference/python/fqe/fci_graph_set/FciGraphSet", "2025-09-20"],
	["reference/python/fqe/fqe_data", "2025-07-24"],
	["reference/python/fqe/fqe_data/FqeData", "2025-07-24"],
	["reference/python/fqe/fqe_data_set", "2025-07-24"],
	["reference/python/fqe/fqe_data_set/FqeDataSet", "2025-07-24"],
	["reference/python/fqe/fqe_decorators", "2025-07-24"],
	["reference/python/fqe/fqe_decorators/build_hamiltonian", "2025-07-24"],
	["reference/python/fqe/fqe_decorators/check_diagonal_coulomb", "2025-07-24"],
	["reference/python/fqe/fqe_decorators/fermionops_tomatrix", "2025-07-24"],
	["reference/python/fqe/fqe_decorators/process_rank2_matrix", "2025-07-24"],
	["reference/python/fqe/fqe_decorators/split_openfermion_tensor", "2025-07-24"],
	["reference/python/fqe/fqe_decorators/transform_to_spin_broken", "2025-07-24"],
	["reference/python/fqe/fqe_decorators/wrap_apply", "2025-07-24"],
	["reference/python/fqe/fqe_decorators/wrap_apply_generated_unitary", "2025-07-24"],
	["reference/python/fqe/fqe_decorators/wrap_rdm", "2025-07-24"],
	["reference/python/fqe/fqe_decorators/wrap_time_evolve", "2025-07-24"],
	["reference/python/fqe/fqe_ops", "2025-07-24"],
	["reference/python/fqe/fqe_ops/fqe_operator", "2025-07-24"],
	["reference/python/fqe/fqe_ops/fqe_operator/FqeOperator", "2025-07-24"],
	["reference/python/fqe/fqe_ops/fqe_ops", "2025-07-24"],
	["reference/python/fqe/fqe_ops/fqe_ops_utils", "2025-07-24"],
	["reference/python/fqe/fqe_ops/fqe_ops_utils/switch_broken_symmetry", "2025-12-04"],
	["reference/python/fqe/fqe_ops/fqe_ops_utils/validate_rdm_string", "2025-07-24"],
	["reference/python/fqe/from_cirq", "2025-07-24"],
	["reference/python/fqe/general_hamiltonian", "2025-07-24"],
	["reference/python/fqe/general_hamiltonian/General", "2025-07-24"],
	["reference/python/fqe/get_diagonal_hamiltonian", "2025-07-24"],
	["reference/python/fqe/get_diagonalcoulomb_hamiltonian", "2025-07-24"],
	["reference/python/fqe/get_general_hamiltonian", "2025-07-24"],
	["reference/python/fqe/get_gso_hamiltonian", "2025-07-24"],
	["reference/python/fqe/get_hamiltonian_from_openfermion", "2025-07-24"],
	["reference/python/fqe/get_number_conserving_wavefunction", "2025-07-24"],
	["reference/python/fqe/get_number_operator", "2025-07-24"],
	["reference/python/fqe/get_restricted_hamiltonian", "2025-07-24"],
	["reference/python/fqe/get_s2_operator", "2025-07-24"],
	["reference/python/fqe/get_sparse_hamiltonian", "2025-07-24"],
	["reference/python/fqe/get_spin_conserving_wavefunction", "2025-07-24"],
	["reference/python/fqe/get_sso_hamiltonian", "2025-07-24"],
	["reference/python/fqe/get_sz_operator", "2025-07-24"],
	["reference/python/fqe/get_time_reversal_operator", "2025-07-24"],
	["reference/python/fqe/get_wavefunction", "2025-07-24"],
	["reference/python/fqe/get_wavefunction_multiple", "2025-07-24"],
	["reference/python/fqe/gso_hamiltonian", "2025-07-24"],
	["reference/python/fqe/gso_hamiltonian/GSOHamiltonian", "2025-07-24"],
	["reference/python/fqe/hamiltonians", "2025-07-24"],
	["reference/python/fqe/hamiltonians/hamiltonian", "2025-07-24"],
	["reference/python/fqe/hamiltonians/hamiltonian/Hamiltonian", "2025-07-24"],
	["reference/python/fqe/hamiltonians/hamiltonian_utils", "2025-07-24"],
	["reference/python/fqe/hamiltonians/hamiltonian_utils/Newop", "2025-07-24"],
	["reference/python/fqe/hamiltonians/hamiltonian_utils/antisymm_four_body", "2025-07-24"],
	["reference/python/fqe/hamiltonians/hamiltonian_utils/antisymm_three_body", "2025-07-24"],
	["reference/python/fqe/hamiltonians/hamiltonian_utils/antisymm_two_body", "2025-07-24"],
	["reference/python/fqe/hamiltonians/hamiltonian_utils/gather_nbody_spin_sectors", "2025-07-24"],
	["reference/python/fqe/hamiltonians/hamiltonian_utils/nbody_matrix", "2025-07-24"],
	["reference/python/fqe/openfermion_utils", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/ascending_index_order", "2026-02-26"],
	["reference/python/fqe/openfermion_utils/bit_to_fermion_creation", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/convert_qubit_wfn_to_fqe_syntax", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/determinant_to_ops", "2026-04-08"],
	["reference/python/fqe/openfermion_utils/fci_fermion_operator_representation", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/fci_qubit_representation", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/fermion_operator_to_bitstring", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/fermion_opstring_to_bitstring", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/fqe_to_fermion_operator", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/integrals_to_fqe_restricted", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/ladder_op", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/largest_operator_index", "2025-12-04"],
	["reference/python/fqe/openfermion_utils/molecular_data_to_restricted_fqe_op", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/mutate_config", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/split_openfermion_tensor", "2025-07-24"],
	["reference/python/fqe/openfermion_utils/update_operator_coeff", "2025-07-24"],
	["reference/python/fqe/restricted_hamiltonian", "2025-07-24"],
	["reference/python/fqe/restricted_hamiltonian/RestrictedHamiltonian", "2026-02-27"],
	["reference/python/fqe/sparse_hamiltonian", "2025-07-24"],
	["reference/python/fqe/sparse_hamiltonian/SparseHamiltonian", "2026-10-10"],
	["reference/python/fqe/sso_hamiltonian", "2025-07-24"],
	["reference/python/fqe/sso_hamiltonian/SSOHamiltonian", "2026-02-15"],
	["reference/python/fqe/time_evolve", "2025-07-24"],
	["reference/python/fqe/to_cirq", "2025-07-24"],
	["reference/python/fqe/to_cirq_ncr", "2025-07-24"],
	["reference/python/fqe/transform", "2025-07-24"],
	["reference/python/fqe/transform/cirq_to_fqe_single", "2026-01-20"],
	["reference/python/fqe/transform/from_cirq", "2025-07-24"],
	["reference/python/fqe/util", "2025-07-24"],
	["reference/python/fqe/util/alpha_beta_electrons", "2025-07-24"],
	["reference/python/fqe/util/bubblesort", "2025-07-24"],
	["reference/python/fqe/util/configuration_key_intersection", "2025-07-24"],
	["reference/python/fqe/util/configuration_key_union", "2025-07-24"],
	["reference/python/fqe/util/dot", "2025-07-24"],
	["reference/python/fqe/util/init_bitstring_groundstate", "2025-07-24"],
	["reference/python/fqe/util/init_qubit_vacuum", "2025-07-24"],
	["reference/python/fqe/util/invert_bitstring_with_mask", "2025-07-24"],
	["reference/python/fqe/util/ltlt_index_generator", "2025-07-24"],
	["reference/python/fqe/util/map_broken_symmetry", "2025-07-24"],
	["reference/python/fqe/util/paritysort_int", "2025-07-24"],
	["reference/python/fqe/util/paritysort_list", "2025-07-24"],
	["reference/python/fqe/util/qubit_config_sector", "2025-07-24"],
	["reference/python/fqe/util/qubit_particle_number_index", "2025-07-24"],
	["reference/python/fqe/util/qubit_particle_number_index_spin", "2026-06-14"],
	["reference/python/fqe/util/qubit_particle_number_sector", "2026-06-14"],
	["reference/python/fqe/util/rand_wfn", "2025-07-24"],
	["reference/python/fqe/util/reverse_bubble_list", "2025-07-24"],
	["reference/python/fqe/util/sort_configuration_keys", "2025-07-24"],
	["reference/python/fqe/util/validate_config", "2025-07-24"],
	["reference/python/fqe/util/validate_tuple", "2025-07-24"],
	["reference/python/fqe/util/vdot", "2025-07-24"],
	["reference/python/fqe/util/zero_transform", "2025-07-24"],
	["reference/python/fqe/vdot", "2025-07-24"],
	["reference/python/fqe/wavefunction", "2025-07-24"],
	["reference/python/fqe/wavefunction/Wavefunction", "2025-07-24"],
	["reference/python/fqe/wavefunction/jv", "2025-07-24"],
	["reference/python/fqe/wick", "2025-07-24"],
	["reference/python/fqe/wick/Mapping", "2025-07-24"],
	["reference/python/fqe/wick/wick", "2025-07-24"],
	["reference/python/fqe/wick/wickfill", "2025-07-24"],
	["reference/python/openfermion", "2026-07-17"],
	["reference/python/openfermion/all_symbols", "2026-07-14"],
	["reference/python/openfermion/chem", "2026-07-17"],
	["reference/python/openfermion/chem/MolecularData", "2026-07-17"],
	["reference/python/openfermion/chem/angstroms_to_bohr", "2026-07-17"],
	["reference/python/openfermion/chem/antisymtei", "2026-07-17"],
	["reference/python/openfermion/chem/bohr_to_angstroms", "2026-07-17"],
	["reference/python/openfermion/chem/chemical_series", "2026-07-17"],
	["reference/python/openfermion/chem/chemical_series/MolecularLatticeError", "2026-07-17"],
	["reference/python/openfermion/chem/geometry_from_file", "2026-07-17"],
	["reference/python/openfermion/chem/geometry_from_pubchem", "2026-07-17"],
	["reference/python/openfermion/chem/j_mat", "2026-07-17"],
	["reference/python/openfermion/chem/k_mat", "2026-07-17"],
	["reference/python/openfermion/chem/load_molecular_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/chem/make_atom", "2026-07-17"],
	["reference/python/openfermion/chem/make_atomic_lattice", "2026-07-17"],
	["reference/python/openfermion/chem/make_atomic_ring", "2026-07-17"],
	["reference/python/openfermion/chem/make_reduced_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/chem/molecular_data", "2026-07-17"],
	["reference/python/openfermion/chem/molecular_data/MissingCalculationError", "2026-07-17"],
	["reference/python/openfermion/chem/molecular_data/MoleculeNameError", "2026-07-17"],
	["reference/python/openfermion/chem/molecular_data/spinorb_from_spatial", "2026-07-17"],
	["reference/python/openfermion/chem/name_molecule", "2026-07-17"],
	["reference/python/openfermion/chem/pubchem", "2026-07-17"],
	["reference/python/openfermion/chem/reduced_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/circuits", "2026-07-17"],
	["reference/python/openfermion/circuits/AsymmetricSplitOperatorTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/CRxxyy", "2026-07-17"],
	["reference/python/openfermion/circuits/CRyxxy", "2026-07-17"],
	["reference/python/openfermion/circuits/ControlledAsymmetricSplitOperatorTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/ControlledSymmetricSplitOperatorTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/CubicFermionicSimulationGate", "2026-07-17"],
	["reference/python/openfermion/circuits/DoubleExcitation", "2025-07-24"],
	["reference/python/openfermion/circuits/DoubleExcitationGate", "2026-07-17"],
	["reference/python/openfermion/circuits/FSWAP", "2025-07-24"],
	["reference/python/openfermion/circuits/FSwapPowGate", "2026-07-17"],
	["reference/python/openfermion/circuits/InteractionOperatorFermionicGate", "2026-07-17"],
	["reference/python/openfermion/circuits/LinearSwapNetworkTrotterAlgorithm", "2026-07-17"],
	["reference/python/openfermion/circuits/LowRankTrotterAlgorithm", "2026-07-17"],
	["reference/python/openfermion/circuits/ParityPreservingFermionicGate", "2026-07-17"],
	["reference/python/openfermion/circuits/QuadraticFermionicSimulationGate", "2026-07-17"],
	["reference/python/openfermion/circuits/QuarticFermionicSimulationGate", "2026-07-17"],
	["reference/python/openfermion/circuits/Rxxyy", "2026-07-17"],
	["reference/python/openfermion/circuits/Ryxxy", "2026-07-17"],
	["reference/python/openfermion/circuits/Rzz", "2026-07-17"],
	["reference/python/openfermion/circuits/SplitOperatorTrotterAlgorithm", "2026-07-17"],
	["reference/python/openfermion/circuits/SplitOperatorTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/SymmetricSplitOperatorTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/TrotterAlgorithm", "2026-07-17"],
	["reference/python/openfermion/circuits/TrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/bit_mask_of_modes_acted_on_by_fermionic_terms", "2026-07-17"],
	["reference/python/openfermion/circuits/bogoliubov_transform", "2026-07-17"],
	["reference/python/openfermion/circuits/diagonal_coulomb_potential_and_kinetic_terms_as_arrays", "2026-07-17"],
	["reference/python/openfermion/circuits/error_bound", "2026-07-17"],
	["reference/python/openfermion/circuits/error_operator", "2026-07-17"],
	["reference/python/openfermion/circuits/fermionic_simulation_gates_from_interaction_operator", "2026-07-17"],
	["reference/python/openfermion/circuits/fermionic_swap_trotter_error_operator_diagonal_two_body", "2026-07-17"],
	["reference/python/openfermion/circuits/ffft", "2026-07-17"],
	["reference/python/openfermion/circuits/gates", "2026-07-17"],
	["reference/python/openfermion/circuits/gates/common_gates", "2026-07-17"],
	["reference/python/openfermion/circuits/gates/fermionic_simulation", "2026-07-17"],
	["reference/python/openfermion/circuits/gates/four_qubit_gates", "2026-07-17"],
	["reference/python/openfermion/circuits/gates/three_qubit_gates", "2026-07-17"],
	["reference/python/openfermion/circuits/gaussian_state_preparation_circuit", "2026-07-17"],
	["reference/python/openfermion/circuits/get_chemist_two_body_coefficients", "2026-07-17"],
	["reference/python/openfermion/circuits/jw_get_gaussian_state", "2026-07-17"],
	["reference/python/openfermion/circuits/jw_slater_determinant", "2026-07-17"],
	["reference/python/openfermion/circuits/lambda_norm", "2026-07-17"],
	["reference/python/openfermion/circuits/lcu_util", "2026-07-17"],
	["reference/python/openfermion/circuits/low_depth_second_order_trotter_error_bound", "2026-07-17"],
	["reference/python/openfermion/circuits/low_depth_second_order_trotter_error_operator", "2026-07-17"],
	["reference/python/openfermion/circuits/low_rank", "2026-07-17"],
	["reference/python/openfermion/circuits/low_rank_two_body_decomposition", "2026-07-17"],
	["reference/python/openfermion/circuits/optimal_givens_decomposition", "2026-07-17"],
	["reference/python/openfermion/circuits/pauli_exp_to_qasm", "2026-07-17"],
	["reference/python/openfermion/circuits/prepare_gaussian_state", "2026-07-17"],
	["reference/python/openfermion/circuits/prepare_one_body_squared_evolution", "2026-07-17"],
	["reference/python/openfermion/circuits/prepare_slater_determinant", "2026-07-17"],
	["reference/python/openfermion/circuits/preprocess_lcu_coefficients_for_reversible_sampling", "2026-07-17"],
	["reference/python/openfermion/circuits/primitives", "2026-07-17"],
	["reference/python/openfermion/circuits/primitives/state_preparation", "2026-07-17"],
	["reference/python/openfermion/circuits/rot11", "2026-07-17"],
	["reference/python/openfermion/circuits/rot111", "2026-07-17"],
	["reference/python/openfermion/circuits/simulate_trotter", "2026-07-17"],
	["reference/python/openfermion/circuits/simulation_ordered_grouped_hubbard_terms_with_info", "2026-07-17"],
	["reference/python/openfermion/circuits/simulation_ordered_grouped_low_depth_terms_with_info", "2026-07-17"],
	["reference/python/openfermion/circuits/slater_determinant_preparation_circuit", "2026-07-17"],
	["reference/python/openfermion/circuits/slater_determinants", "2026-07-17"],
	["reference/python/openfermion/circuits/split_operator_trotter_error_operator_diagonal_two_body", "2026-07-17"],
	["reference/python/openfermion/circuits/stagger_with_info", "2026-07-17"],
	["reference/python/openfermion/circuits/state_swap_eigen_component", "2026-07-17"],
	["reference/python/openfermion/circuits/sum_of_interaction_operator_gate_generators", "2026-07-17"],
	["reference/python/openfermion/circuits/swap_network", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/algorithms", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/algorithms/linear_swap_network", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/algorithms/linear_swap_network/AsymmetricLinearSwapNetworkTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/algorithms/linear_swap_network/ControlledAsymmetricLinearSwapNetworkTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/algorithms/linear_swap_network/ControlledSymmetricLinearSwapNetworkTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/algorithms/linear_swap_network/LinearSwapNetworkTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/algorithms/linear_swap_network/SymmetricLinearSwapNetworkTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/algorithms/low_rank", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/algorithms/low_rank/AsymmetricLowRankTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/algorithms/low_rank/ControlledAsymmetricLowRankTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/algorithms/low_rank/LowRankTrotterStep", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/algorithms/split_operator", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/diagonal_coulomb_trotter_error", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/hubbard_trotter_error", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/low_depth_trotter_error", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/low_depth_trotter_error/ordered_low_depth_terms_no_info", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/trotter_algorithm", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/trotter_algorithm/Hamiltonian", "2025-07-24"],
	["reference/python/openfermion/circuits/trotter/trotter_error", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/trotter_error/ceil", "2025-07-24"],
	["reference/python/openfermion/circuits/trotter/trotter_error/commutator", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/trotter_error/sqrt", "2025-07-24"],
	["reference/python/openfermion/circuits/trotter/trotter_error/trivially_commutes", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter/trotter_error/trivially_double_commutes", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter_exp_to_qgates", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter_operator_grouping", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter_steps_required", "2026-07-17"],
	["reference/python/openfermion/circuits/trotter_steps_required_propagator", "2026-07-17"],
	["reference/python/openfermion/circuits/trotterize_exp_qubop_to_qasm", "2026-07-17"],
	["reference/python/openfermion/circuits/uccsd_convert_amplitude_format", "2026-07-17"],
	["reference/python/openfermion/circuits/uccsd_generator", "2026-07-17"],
	["reference/python/openfermion/circuits/uccsd_singlet_generator", "2026-07-17"],
	["reference/python/openfermion/circuits/uccsd_singlet_get_packed_amplitudes", "2026-07-17"],
	["reference/python/openfermion/circuits/uccsd_singlet_paramsize", "2026-07-17"],
	["reference/python/openfermion/circuits/unitary_cc", "2026-07-17"],
	["reference/python/openfermion/circuits/vpe_circuits", "2026-07-17"],
	["reference/python/openfermion/circuits/vpe_circuits_single_timestep", "2026-08-15"],
	["reference/python/openfermion/circuits/vpe_single_circuit", "2026-07-17"],
	["reference/python/openfermion/config", "2026-07-17"],
	["reference/python/openfermion/config/get_available_cpu_count", "2026-07-17"],
	["reference/python/openfermion/config/set_threading_limits", "2026-07-17"],
	["reference/python/openfermion/contextuality", "2026-07-17"],
	["reference/python/openfermion/contextuality/is_contextual", "2026-07-17"],
	["reference/python/openfermion/contrib", "2026-07-17"],
	["reference/python/openfermion/contrib/representability", "2026-07-17"],
	["reference/python/openfermion/fixed_trace_positive_projection", "2026-07-17"],
	["reference/python/openfermion/functionals", "2026-07-17"],
	["reference/python/openfermion/functionals/get_one_norm", "2026-07-17"],
	["reference/python/openfermion/functionals/get_one_norm_int", "2026-07-17"],
	["reference/python/openfermion/functionals/get_one_norm_int_woconst", "2026-07-17"],
	["reference/python/openfermion/functionals/get_one_norm_mol", "2026-07-17"],
	["reference/python/openfermion/functionals/get_one_norm_mol_woconst", "2026-07-17"],
	["reference/python/openfermion/hamiltonians", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/FermiHubbardModel", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/HartreeFockFunctional", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/RichardsonGaudin", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/bose_hubbard", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/dual_basis_external_potential", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/dual_basis_jellium_model", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/dual_basis_kinetic", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/dual_basis_potential", "2026-08-15"],
	["reference/python/openfermion/hamiltonians/fermi_hubbard", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/general_hubbard", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/general_hubbard/InteractionParameter", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/general_hubbard/PotentialParameter", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/general_hubbard/TunnelingParameter", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/general_hubbard/number_operator", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/generate_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/get_matrix_of_eigs", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/hartree_fock", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/hartree_fock/InputError", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/hartree_fock_state_jellium", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/hubbard", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/hypercube_grid_with_given_wigner_seitz_radius_and_filling", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/interaction_operator", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/jellium", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/jellium/coulomb_potential_momentum", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/jellium_hf_state", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/jellium_model", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/jordan_wigner_dual_basis_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/jordan_wigner_dual_basis_jellium", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/lowest_single_particle_energy_states", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/majorana_operator", "2026-08-15"],
	["reference/python/openfermion/hamiltonians/mean_field_dwave", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/number_difference_operator", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/number_operator", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/plane_wave_external_potential", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/plane_wave_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/plane_wave_kinetic", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/plane_wave_potential", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/rhf_func_generator", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/rhf_minimization", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/rhf_params_to_matrix", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/richardson_gaudin", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/s_minus_operator", "2026-08-15"],
	["reference/python/openfermion/hamiltonians/s_plus_operator", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/s_squared_operator", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/special_operators", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/sx_operator", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/sy_operator", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/sz_operator", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/tunneling_operator", "2026-07-17"],
	["reference/python/openfermion/hamiltonians/wigner_seitz_length_scale", "2026-07-17"],
	["reference/python/openfermion/heaviside", "2025-07-24"],
	["reference/python/openfermion/higham_polynomial", "2026-07-17"],
	["reference/python/openfermion/higham_root", "2026-07-17"],
	["reference/python/openfermion/linalg", "2026-07-17"],
	["reference/python/openfermion/linalg/Davidson", "2026-07-17"],
	["reference/python/openfermion/linalg/DavidsonError", "2026-07-17"],
	["reference/python/openfermion/linalg/DavidsonOptions", "2026-07-17"],
	["reference/python/openfermion/linalg/LinearQubitOperator", "2026-07-17"],
	["reference/python/openfermion/linalg/LinearQubitOperatorOptions", "2026-07-17"],
	["reference/python/openfermion/linalg/ParallelLinearQubitOperator", "2026-07-17"],
	["reference/python/openfermion/linalg/QubitDavidson", "2026-07-17"],
	["reference/python/openfermion/linalg/SparseDavidson", "2026-07-17"],
	["reference/python/openfermion/linalg/append_random_vectors", "2026-07-17"],
	["reference/python/openfermion/linalg/boson_ladder_sparse", "2026-07-17"],
	["reference/python/openfermion/linalg/boson_operator_sparse", "2026-07-17"],
	["reference/python/openfermion/linalg/davidson", "2026-07-17"],
	["reference/python/openfermion/linalg/double_givens_rotate", "2026-07-17"],
	["reference/python/openfermion/linalg/eigenspectrum", "2026-07-17"],
	["reference/python/openfermion/linalg/erpa", "2026-07-17"],
	["reference/python/openfermion/linalg/erpa/einsum", "2026-09-19"],
	["reference/python/openfermion/linalg/erpa_eom_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/linalg/expectation", "2026-07-17"],
	["reference/python/openfermion/linalg/expectation_computational_basis_state", "2026-07-17"],
	["reference/python/openfermion/linalg/expectation_db_operator_with_pw_basis_state", "2026-07-17"],
	["reference/python/openfermion/linalg/expectation_one_body_db_operator_computational_basis_state", "2026-07-17"],
	["reference/python/openfermion/linalg/expectation_three_body_db_operator_computational_basis_state", "2026-07-17"],
	["reference/python/openfermion/linalg/expectation_two_body_db_operator_computational_basis_state", "2026-07-17"],
	["reference/python/openfermion/linalg/fermionic_gaussian_decomposition", "2026-07-17"],
	["reference/python/openfermion/linalg/fit_known_frequencies", "2026-07-17"],
	["reference/python/openfermion/linalg/generate_linear_qubit_operator", "2026-07-17"],
	["reference/python/openfermion/linalg/generate_parity_permutations", "2026-07-17"],
	["reference/python/openfermion/linalg/generate_random_vectors", "2026-07-17"],
	["reference/python/openfermion/linalg/get_density_matrix", "2026-07-17"],
	["reference/python/openfermion/linalg/get_gap", "2026-07-17"],
	["reference/python/openfermion/linalg/get_ground_state", "2026-07-17"],
	["reference/python/openfermion/linalg/get_linear_qubit_operator_diagonal", "2026-07-17"],
	["reference/python/openfermion/linalg/get_number_preserving_sparse_operator", "2026-07-17"],
	["reference/python/openfermion/linalg/get_sparse_operator", "2026-07-17"],
	["reference/python/openfermion/linalg/givens_decomposition", "2026-07-17"],
	["reference/python/openfermion/linalg/givens_decomposition_square", "2026-07-17"],
	["reference/python/openfermion/linalg/givens_matrix_elements", "2026-07-17"],
	["reference/python/openfermion/linalg/givens_rotate", "2026-07-17"],
	["reference/python/openfermion/linalg/givens_rotations", "2026-07-17"],
	["reference/python/openfermion/linalg/inner_product", "2026-07-17"],
	["reference/python/openfermion/linalg/jordan_wigner_ladder_sparse", "2026-07-17"],
	["reference/python/openfermion/linalg/jordan_wigner_sparse", "2026-07-17"],
	["reference/python/openfermion/linalg/jw_configuration_state", "2026-07-17"],
	["reference/python/openfermion/linalg/jw_get_ground_state_at_particle_number", "2026-07-17"],
	["reference/python/openfermion/linalg/jw_hartree_fock_state", "2026-07-17"],
	["reference/python/openfermion/linalg/jw_number_indices", "2026-07-17"],
	["reference/python/openfermion/linalg/jw_number_restrict_operator", "2026-07-17"],
	["reference/python/openfermion/linalg/jw_number_restrict_state", "2026-07-17"],
	["reference/python/openfermion/linalg/jw_sparse_givens_rotation", "2026-07-17"],
	["reference/python/openfermion/linalg/jw_sparse_particle_hole_transformation_last_mode", "2026-07-17"],
	["reference/python/openfermion/linalg/jw_sz_indices", "2026-07-17"],
	["reference/python/openfermion/linalg/jw_sz_restrict_operator", "2026-07-17"],
	["reference/python/openfermion/linalg/jw_sz_restrict_state", "2026-07-17"],
	["reference/python/openfermion/linalg/kronecker_operators", "2026-07-17"],
	["reference/python/openfermion/linalg/linear_qubit_operator", "2026-07-17"],
	["reference/python/openfermion/linalg/linear_qubit_operator/apply_operator", "2026-07-17"],
	["reference/python/openfermion/linalg/orthonormalize", "2026-07-17"],
	["reference/python/openfermion/linalg/prony", "2026-07-17"],
	["reference/python/openfermion/linalg/qubit_operator_sparse", "2026-07-17"],
	["reference/python/openfermion/linalg/rdm_reconstruction", "2026-07-17"],
	["reference/python/openfermion/linalg/single_quad_op_sparse", "2026-07-17"],
	["reference/python/openfermion/linalg/singlet_erpa", "2026-09-10"],
	["reference/python/openfermion/linalg/sparse_eigenspectrum", "2026-07-17"],
	["reference/python/openfermion/linalg/sparse_tools", "2026-07-17"],
	["reference/python/openfermion/linalg/sparse_tools/reduce", "2025-07-24"],
	["reference/python/openfermion/linalg/swap_columns", "2026-07-17"],
	["reference/python/openfermion/linalg/swap_rows", "2026-07-17"],
	["reference/python/openfermion/linalg/valdemoro_reconstruction", "2026-07-17"],
	["reference/python/openfermion/linalg/variance", "2026-07-17"],
	["reference/python/openfermion/linalg/wave_fitting", "2026-07-17"],
	["reference/python/openfermion/linalg/wedge", "2026-07-17"],
	["reference/python/openfermion/linalg/wedge_product", "2026-07-17"],
	["reference/python/openfermion/linalg/wedge_product/factorial", "2025-07-24"],
	["reference/python/openfermion/linalg/wrapped_kronecker", "2026-07-17"],
	["reference/python/openfermion/map_to_matrix", "2026-07-17"],
	["reference/python/openfermion/map_to_tensor", "2026-07-17"],
	["reference/python/openfermion/measurements", "2026-07-17"],
	["reference/python/openfermion/measurements/PhaseFitEstimator", "2026-07-17"],
	["reference/python/openfermion/measurements/apply_constraints", "2026-07-17"],
	["reference/python/openfermion/measurements/binary_partition_iterator", "2026-07-17"],
	["reference/python/openfermion/measurements/constraint_matrix", "2026-07-17"],
	["reference/python/openfermion/measurements/equality_constraint_projection", "2026-07-17"],
	["reference/python/openfermion/measurements/fermion_partitioning", "2026-07-17"],
	["reference/python/openfermion/measurements/fermion_partitioning/Pairing", "2026-07-14"],
	["reference/python/openfermion/measurements/get_interaction_rdm", "2026-07-17"],
	["reference/python/openfermion/measurements/get_phase_function", "2026-07-17"],
	["reference/python/openfermion/measurements/group_into_tensor_product_basis_sets", "2026-07-17"],
	["reference/python/openfermion/measurements/linearize_term", "2026-07-17"],
	["reference/python/openfermion/measurements/one_body_fermion_constraints", "2026-07-17"],
	["reference/python/openfermion/measurements/operator_to_vector", "2026-07-17"],
	["reference/python/openfermion/measurements/pair_between", "2026-07-17"],
	["reference/python/openfermion/measurements/pair_within", "2026-07-17"],
	["reference/python/openfermion/measurements/pair_within_simultaneously", "2026-07-17"],
	["reference/python/openfermion/measurements/pair_within_simultaneously_binned", "2026-07-17"],
	["reference/python/openfermion/measurements/pair_within_simultaneously_symmetric", "2026-07-17"],
	["reference/python/openfermion/measurements/partition_iterator", "2026-07-17"],
	["reference/python/openfermion/measurements/pauli_string_iterator", "2026-07-17"],
	["reference/python/openfermion/measurements/qubit_partitioning", "2026-07-17"],
	["reference/python/openfermion/measurements/rdm_equality_constraints", "2026-07-17"],
	["reference/python/openfermion/measurements/two_body_fermion_constraints", "2026-07-17"],
	["reference/python/openfermion/measurements/unlinearize_term", "2026-07-17"],
	["reference/python/openfermion/measurements/vector_to_operator", "2026-07-17"],
	["reference/python/openfermion/measurements/vpe_estimators", "2026-07-17"],
	["reference/python/openfermion/ops", "2026-07-17"],
	["reference/python/openfermion/ops/BinaryCode", "2026-07-17"],
	["reference/python/openfermion/ops/BinaryCodeError", "2026-07-17"],
	["reference/python/openfermion/ops/BinaryPolynomial", "2026-07-17"],
	["reference/python/openfermion/ops/BinaryPolynomialError", "2026-07-17"],
	["reference/python/openfermion/ops/BosonOperator", "2026-07-17"],
	["reference/python/openfermion/ops/DOCIHamiltonian", "2026-07-17"],
	["reference/python/openfermion/ops/DiagonalCoulombHamiltonian", "2026-07-17"],
	["reference/python/openfermion/ops/FermionOperator", "2026-07-17"],
	["reference/python/openfermion/ops/InteractionOperator", "2026-07-17"],
	["reference/python/openfermion/ops/InteractionOperatorError", "2026-07-17"],
	["reference/python/openfermion/ops/InteractionRDM", "2026-07-17"],
	["reference/python/openfermion/ops/InteractionRDMError", "2026-07-17"],
	["reference/python/openfermion/ops/IsingOperator", "2026-07-17"],
	["reference/python/openfermion/ops/MajoranaOperator", "2026-07-17"],
	["reference/python/openfermion/ops/PolynomialTensor", "2026-07-17"],
	["reference/python/openfermion/ops/PolynomialTensorError", "2026-07-17"],
	["reference/python/openfermion/ops/QuadOperator", "2026-07-17"],
	["reference/python/openfermion/ops/QuadraticHamiltonian", "2026-07-17"],
	["reference/python/openfermion/ops/QuadraticHamiltonianError", "2026-07-17"],
	["reference/python/openfermion/ops/QubitOperator", "2026-07-17"],
	["reference/python/openfermion/ops/SymbolicOperator", "2026-07-17"],
	["reference/python/openfermion/ops/antisymmetric_canonical_form", "2026-07-17"],
	["reference/python/openfermion/ops/double_decoding", "2026-07-17"],
	["reference/python/openfermion/ops/general_basis_change", "2026-07-17"],
	["reference/python/openfermion/ops/operators", "2026-07-17"],
	["reference/python/openfermion/ops/operators/binary_code", "2026-07-17"],
	["reference/python/openfermion/ops/operators/binary_polynomial", "2026-07-17"],
	["reference/python/openfermion/ops/operators/binary_sum_rule", "2026-07-17"],
	["reference/python/openfermion/ops/operators/boson_operator", "2026-07-17"],
	["reference/python/openfermion/ops/operators/fermion_operator", "2026-07-17"],
	["reference/python/openfermion/ops/operators/ising_operator", "2026-07-17"],
	["reference/python/openfermion/ops/operators/majorana_operator", "2026-07-17"],
	["reference/python/openfermion/ops/operators/quad_operator", "2026-07-17"],
	["reference/python/openfermion/ops/operators/qubit_operator", "2026-07-17"],
	["reference/python/openfermion/ops/operators/symbolic_operator", "2026-07-17"],
	["reference/python/openfermion/ops/representations", "2026-07-17"],
	["reference/python/openfermion/ops/representations/diagonal_coulomb_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/ops/representations/doci_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/ops/representations/doci_hamiltonian/get_doci_from_integrals", "2026-07-17"],
	["reference/python/openfermion/ops/representations/doci_hamiltonian/get_projected_integrals_from_doci", "2026-07-17"],
	["reference/python/openfermion/ops/representations/doci_hamiltonian/get_tensors_from_doci", "2026-07-17"],
	["reference/python/openfermion/ops/representations/get_active_space_integrals", "2026-07-17"],
	["reference/python/openfermion/ops/representations/get_tensors_from_integrals", "2026-07-17"],
	["reference/python/openfermion/ops/representations/interaction_operator", "2026-07-17"],
	["reference/python/openfermion/ops/representations/interaction_rdm", "2026-07-17"],
	["reference/python/openfermion/ops/representations/polynomial_tensor", "2026-07-17"],
	["reference/python/openfermion/ops/representations/quadratic_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/ops/shift_decoder", "2026-07-17"],
	["reference/python/openfermion/testing", "2026-07-17"],
	["reference/python/openfermion/testing/EqualsTester", "2026-07-17"],
	["reference/python/openfermion/testing/assert_equivalent_repr", "2026-07-17"],
	["reference/python/openfermion/testing/assert_implements_consistent_protocols", "2026-07-17"],
	["reference/python/openfermion/testing/circuit_validation", "2026-07-17"],
	["reference/python/openfermion/testing/haar_random_vector", "2026-07-17"],
	["reference/python/openfermion/testing/module_importable", "2026-07-17"],
	["reference/python/openfermion/testing/random", "2026-07-17"],
	["reference/python/openfermion/testing/random_antisymmetric_matrix", "2026-07-17"],
	["reference/python/openfermion/testing/random_diagonal_coulomb_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/testing/random_hermitian_matrix", "2026-07-17"],
	["reference/python/openfermion/testing/random_interaction_operator", "2026-07-17"],
	["reference/python/openfermion/testing/random_interaction_operator_term", "2026-07-17"],
	["reference/python/openfermion/testing/random_quadratic_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/testing/random_qubit_operator", "2026-07-17"],
	["reference/python/openfermion/testing/random_unitary_matrix", "2026-07-17"],
	["reference/python/openfermion/testing/retry_once_with_later_random_values", "2026-07-17"],
	["reference/python/openfermion/testing/testing_utils", "2026-07-17"],
	["reference/python/openfermion/testing/validate_trotterized_evolution", "2026-07-17"],
	["reference/python/openfermion/testing/wrapped", "2026-07-17"],
	["reference/python/openfermion/transforms", "2026-07-17"],
	["reference/python/openfermion/transforms/FenwickNode", "2026-07-17"],
	["reference/python/openfermion/transforms/FenwickTree", "2026-07-17"],
	["reference/python/openfermion/transforms/StabilizerError", "2026-07-17"],
	["reference/python/openfermion/transforms/binary_code_transform", "2026-07-17"],
	["reference/python/openfermion/transforms/bravyi_kitaev", "2026-07-17"],
	["reference/python/openfermion/transforms/bravyi_kitaev_code", "2026-07-17"],
	["reference/python/openfermion/transforms/bravyi_kitaev_fast", "2026-07-17"],
	["reference/python/openfermion/transforms/bravyi_kitaev_fast_edge_matrix", "2026-07-17"],
	["reference/python/openfermion/transforms/bravyi_kitaev_fast_interaction_op", "2026-07-17"],
	["reference/python/openfermion/transforms/bravyi_kitaev_tree", "2026-07-17"],
	["reference/python/openfermion/transforms/check_commuting_stabilizers", "2026-07-17"],
	["reference/python/openfermion/transforms/check_no_sympy", "2026-07-17"],
	["reference/python/openfermion/transforms/check_stabilizer_linearity", "2026-07-17"],
	["reference/python/openfermion/transforms/checksum_code", "2026-07-17"],
	["reference/python/openfermion/transforms/chemist_ordered", "2026-07-17"],
	["reference/python/openfermion/transforms/commutator_ordered_diagonal_coulomb_with_two_body_operator", "2026-07-17"],
	["reference/python/openfermion/transforms/fix_single_term", "2026-07-17"],
	["reference/python/openfermion/transforms/fourier_transform", "2026-07-17"],
	["reference/python/openfermion/transforms/freeze_orbitals", "2026-07-17"],
	["reference/python/openfermion/transforms/get_boson_operator", "2026-07-17"],
	["reference/python/openfermion/transforms/get_diagonal_coulomb_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/transforms/get_fermion_operator", "2026-07-17"],
	["reference/python/openfermion/transforms/get_interaction_operator", "2026-07-17"],
	["reference/python/openfermion/transforms/get_majorana_operator", "2026-07-17"],
	["reference/python/openfermion/transforms/get_molecular_data", "2026-07-17"],
	["reference/python/openfermion/transforms/get_quad_operator", "2026-07-17"],
	["reference/python/openfermion/transforms/get_quadratic_hamiltonian", "2026-07-17"],
	["reference/python/openfermion/transforms/interleaved_code", "2026-07-17"],
	["reference/python/openfermion/transforms/inverse_fourier_transform", "2026-07-17"],
	["reference/python/openfermion/transforms/jordan_wigner", "2026-07-17"],
	["reference/python/openfermion/transforms/jordan_wigner_code", "2026-07-17"],
	["reference/python/openfermion/transforms/jordan_wigner_one_body", "2026-07-17"],
	["reference/python/openfermion/transforms/jordan_wigner_two_body", "2026-07-17"],
	["reference/python/openfermion/transforms/linearize_decoder", "2026-07-17"],
	["reference/python/openfermion/transforms/mccoy", "2026-07-17"],
	["reference/python/openfermion/transforms/normal_ordered", "2026-07-17"],
	["reference/python/openfermion/transforms/normal_ordered_ladder_term", "2026-07-17"],
	["reference/python/openfermion/transforms/normal_ordered_quad_term", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/binary_codes", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/bksf", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/commutator_diagonal_coulomb_operator", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/conversions", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/dissolve", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/edge_operator_aij", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/edge_operator_b", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/edit_hamiltonian_for_spin", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/extractor", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/fenwick_tree", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/generate_fermions", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/inline_product", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/inline_sum", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/make_parity_list", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/number_operator", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/qubitoperator_to_paulisum", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/remove_symmetry_qubits", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/remove_symmetry_qubits/remove_indices", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/term_reordering", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/vacuum_operator", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/verstraete_cirac", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/verstraete_cirac/auxiliary_graph_2d_square", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/verstraete_cirac/coordinates_to_snake_index", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/verstraete_cirac/expand_aux_index", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/verstraete_cirac/expand_sys_index", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/verstraete_cirac/lexicographic_index_to_snake_index", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/verstraete_cirac/row_indices_snake", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/verstraete_cirac/snake_index_to_coordinates", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/verstraete_cirac/stabilizer", "2026-07-17"],
	["reference/python/openfermion/transforms/opconversions/verstraete_cirac/stabilizer_local_2d_square", "2026-07-17"],
	["reference/python/openfermion/transforms/parity_code", "2026-07-17"],
	["reference/python/openfermion/transforms/project_onto_sector", "2026-07-17"],
	["reference/python/openfermion/transforms/projection_error", "2026-07-17"],
	["reference/python/openfermion/transforms/prune_unused_indices", "2026-07-17"],
	["reference/python/openfermion/transforms/qubit_operator_to_pauli_sum", "2026-07-17"],
	["reference/python/openfermion/transforms/reduce_number_of_terms", "2026-07-17"],
	["reference/python/openfermion/transforms/reorder", "2026-07-17"],
	["reference/python/openfermion/transforms/repconversions", "2026-07-17"],
	["reference/python/openfermion/transforms/repconversions/conversions", "2026-07-17"],
	["reference/python/openfermion/transforms/repconversions/fourier_transforms", "2026-07-17"],
	["reference/python/openfermion/transforms/repconversions/operator_tapering", "2026-07-17"],
	["reference/python/openfermion/transforms/repconversions/qubit_operator_transforms", "2026-07-17"],
	["reference/python/openfermion/transforms/repconversions/qubit_tapering_from_stabilizer", "2026-07-17"],
	["reference/python/openfermion/transforms/repconversions/weyl_ordering", "2026-07-17"],
	["reference/python/openfermion/transforms/repconversions/weyl_ordering/binom", "2026-03-07"],
	["reference/python/openfermion/transforms/reverse_jordan_wigner", "2026-07-17"],
	["reference/python/openfermion/transforms/rotate_qubit_by_pauli", "2026-07-17"],
	["reference/python/openfermion/transforms/symmetric_ordering", "2026-07-17"],
	["reference/python/openfermion/transforms/symmetry_conserving_bravyi_kitaev", "2026-07-17"],
	["reference/python/openfermion/transforms/taper_off_qubits", "2026-07-17"],
	["reference/python/openfermion/transforms/verstraete_cirac_2d_square", "2026-07-17"],
	["reference/python/openfermion/transforms/vertical_edges_snake", "2026-07-17"],
	["reference/python/openfermion/transforms/weight_one_binary_addressing_code", "2026-07-17"],
	["reference/python/openfermion/transforms/weight_one_segment_code", "2026-07-17"],
	["reference/python/openfermion/transforms/weight_two_segment_code", "2026-07-17"],
	["reference/python/openfermion/transforms/weyl_polynomial_quantization", "2026-07-17"],
	["reference/python/openfermion/utils", "2026-07-17"],
	["reference/python/openfermion/utils/Grid", "2026-07-17"],
	["reference/python/openfermion/utils/HubbardLattice", "2026-07-17"],
	["reference/python/openfermion/utils/HubbardSquareLattice", "2026-07-17"],
	["reference/python/openfermion/utils/OperatorSpecificationError", "2026-07-17"],
	["reference/python/openfermion/utils/OperatorUtilsError", "2026-07-17"],
	["reference/python/openfermion/utils/Spin", "2026-07-17"],
	["reference/python/openfermion/utils/SpinPairs", "2026-07-17"],
	["reference/python/openfermion/utils/amplitude_damping_channel", "2026-07-17"],
	["reference/python/openfermion/utils/anticommutator", "2026-07-17"],
	["reference/python/openfermion/utils/bch_expand", "2026-07-17"],
	["reference/python/openfermion/utils/bch_expansion", "2026-07-17"],
	["reference/python/openfermion/utils/channel_state", "2026-07-17"],
	["reference/python/openfermion/utils/channel_state/array", "2026-03-07"],
	["reference/python/openfermion/utils/channel_state/dot", "2026-03-07"],
	["reference/python/openfermion/utils/channel_state/kron", "2026-03-07"],
	["reference/python/openfermion/utils/channel_state/log2", "2026-03-07"],
	["reference/python/openfermion/utils/channel_state/sqrt", "2026-03-07"],
	["reference/python/openfermion/utils/commutator", "2026-07-17"],
	["reference/python/openfermion/utils/commutators", "2026-07-17"],
	["reference/python/openfermion/utils/count_qubits", "2026-07-17"],
	["reference/python/openfermion/utils/dephasing_channel", "2026-07-17"],
	["reference/python/openfermion/utils/depolarizing_channel", "2026-07-17"],
	["reference/python/openfermion/utils/double_commutator", "2026-07-17"],
	["reference/python/openfermion/utils/down_index", "2026-07-17"],
	["reference/python/openfermion/utils/get_file_path", "2026-07-17"],
	["reference/python/openfermion/utils/grid", "2026-07-17"],
	["reference/python/openfermion/utils/grid/OrbitalSpecificationError", "2026-07-17"],
	["reference/python/openfermion/utils/hermitian_conjugated", "2026-07-17"],
	["reference/python/openfermion/utils/indexing", "2026-07-17"],
	["reference/python/openfermion/utils/is_hermitian", "2026-07-17"],
	["reference/python/openfermion/utils/is_identity", "2026-07-17"],
	["reference/python/openfermion/utils/kronecker_delta", "2026-07-17"],
	["reference/python/openfermion/utils/lattice", "2026-07-17"],
	["reference/python/openfermion/utils/load_operator", "2026-07-17"],
	["reference/python/openfermion/utils/map_one_hole_dm_to_one_pdm", "2026-07-17"],
	["reference/python/openfermion/utils/map_one_pdm_to_one_hole_dm", "2026-07-17"],
	["reference/python/openfermion/utils/map_particle_hole_dm_to_one_pdm", "2026-07-17"],
	["reference/python/openfermion/utils/map_particle_hole_dm_to_two_pdm", "2026-07-17"],
	["reference/python/openfermion/utils/map_two_hole_dm_to_one_hole_dm", "2026-07-17"],
	["reference/python/openfermion/utils/map_two_hole_dm_to_two_pdm", "2026-07-17"],
	["reference/python/openfermion/utils/map_two_pdm_to_one_pdm", "2026-07-17"],
	["reference/python/openfermion/utils/map_two_pdm_to_particle_hole_dm", "2026-07-17"],
	["reference/python/openfermion/utils/map_two_pdm_to_two_hole_dm", "2026-07-17"],
	["reference/python/openfermion/utils/operator_utils", "2026-07-17"],
	["reference/python/openfermion/utils/rdm_mapping_functions", "2026-07-17"],
	["reference/python/openfermion/utils/save_operator", "2026-07-17"],
	["reference/python/openfermion/utils/trivially_commutes_dual_basis", "2026-07-17"],
	["reference/python/openfermion/utils/trivially_double_commutes_dual_basis", "2026-07-17"],
	["reference/python/openfermion/utils/trivially_double_commutes_dual_basis_using_term_info", "2026-07-17"],
	["reference/python/openfermion/utils/up_index", "2026-07-17"],
	["reference/python/openfermion/utils/up_then_down", "2026-07-17"],
	["reference/python/qsimcirq", "2026-08-27"],
	["reference/python/qsimcirq/QSimCircuit", "2026-08-27"],
	["reference/python/qsimcirq/QSimOptions", "2026-08-27"],
	["reference/python/qsimcirq/QSimSimulator", "2026-09-10"],
	["reference/python/qsimcirq/QSimhSimulator", "2026-09-04"],
	["reference/python/qsimcirq/add_op_to_circuit", "2026-08-27"],
	["reference/python/qsimcirq/add_op_to_opstring", "2026-08-27"],
	["reference/python/qsimcirq/all_symbols", "2025-07-24"],
	["reference/python/qsimcirq/qsim", "2025-07-24"],
	["reference/python/qsimcirq/qsim/Circuit", "2025-07-24"],
	["reference/python/qsimcirq/qsim/GateKind", "2025-07-24"],
	["reference/python/qsimcirq/qsim/NoisyCircuit", "2025-07-24"],
	["reference/python/qsimcirq/qsim/OpString", "2025-07-24"],
	["reference/python/qsimcirq/qsim/add_channel", "2025-07-24"],
	["reference/python/qsimcirq/qsim/add_diagonal_gate", "2025-07-24"],
	["reference/python/qsimcirq/qsim/add_diagonal_gate_channel", "2025-07-24"],
	["reference/python/qsimcirq/qsim/add_gate", "2025-07-24"],
	["reference/python/qsimcirq/qsim/add_gate_channel", "2025-07-24"],
	["reference/python/qsimcirq/qsim/add_gate_to_opstring", "2025-07-24"],
	["reference/python/qsimcirq/qsim/add_matrix_gate", "2025-07-24"],
	["reference/python/qsimcirq/qsim/add_matrix_gate_channel", "2025-07-24"],
	["reference/python/qsimcirq/qsim/add_matrix_gate_to_opstring", "2025-07-24"],
	["reference/python/qsimcirq/qsim/control_last_gate", "2025-07-24"],
	["reference/python/qsimcirq/qsim/control_last_gate_channel", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qsim_sample", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qsim_sample_final", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qsim_simulate", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qsim_simulate_expectation_values", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qsim_simulate_fullstate", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qsim_simulate_moment_expectation_values", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qsimh_simulate", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qtrajectory_sample", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qtrajectory_sample_final", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qtrajectory_simulate", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qtrajectory_simulate_expectation_values", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qtrajectory_simulate_fullstate", "2025-07-24"],
	["reference/python/qsimcirq/qsim/qtrajectory_simulate_moment_expectation_values", "2025-07-24"],
	["reference/python/qsimcirq/qsim_decide", "2025-07-24"],
	["reference/python/qsimcirq/qsim_decide/detect_custatevec", "2025-07-24"],
	["reference/python/qsimcirq/qsim_decide/detect_gpu", "2025-07-24"],
	["reference/python/qsimcirq/qsim_decide/detect_instructions", "2025-07-24"],
	["research", "2026-10-20"],
	["resources", "2026-10-20"],
	["roadmap", "2026-10-20"],
	["robots.txt", "2021-05-14"],
	["site-assets/downloads/qai-student-opportunities.pdf", "2026-03-13"],
	["site-assets/downloads/what-is-quantum-computing.pdf", "2025-04-04"],
	["site-assets/downloads/willow-spec-sheet.pdf", "2024-12-09"],
	["software", "2026-10-20"],
	["whatisqc", "2026-10-20"],
	["willowearlyaccess", "2026-10-20"]
];
// src/quantum/clay-statements.ts
var CLAY_RELATIONS = [
	{
		"name": "relation_8",
		"statement": "vertices = hybridSpeed ∧ vertices = mintOf n"
	},
	{
		"name": "relation_15",
		"statement": "magicBlock = glProd hexbit seed ∧ magicBlock = qftDepth vertices"
	},
	{
		"name": "relation_16",
		"statement": "mintOf hexbit = powMod coins rays plane ∧ mintOf hexbit = powMod coins hexbit bits"
	},
	{
		"name": "relation_32",
		"statement": "bits = chimera coins ∧ bits = qaoaZz vertices hexbit"
	},
	{
		"name": "relation_128",
		"statement": "mintOf rays = chimera hexbit ∧ mintOf rays = isingFusion vertices"
	},
	{
		"name": "relation_28",
		"statement": "plane = chooseOf vertices coins ∧ plane = choose vertices coins"
	},
	{
		"name": "relation_256",
		"statement": "mintOf vertices = groverSize hexbit ∧ mintOf vertices = qaoaZz vertices bits"
	},
	{
		"name": "relation_10",
		"statement": "triangular hexbit = qftGates hexbit"
	},
	{
		"name": "relation_14",
		"statement": "faces = coil ∧ faces = qaoaParams rays"
	},
	{
		"name": "relation_21",
		"statement": "chooseOf rays coins = fibFusion vertices ∧ chooseOf rays coins = powMod rays coins plane"
	},
	{
		"name": "relation_25",
		"statement": "powMod n hexbit plane = powMod n faces bits ∧ powMod n hexbit plane = powMod n plane plane"
	},
	{
		"name": "relation_64",
		"statement": "isingFusion rays = groverSize n ∧ isingFusion rays = qaoaParams bits"
	},
	{
		"name": "relation_16384",
		"statement": "mintOf faces = groverSize rays ∧ mintOf faces = qftStates faces"
	},
	{
		"name": "relation_13",
		"statement": "fibFusion rays = powMod n n faces ∧ fibFusion rays = half n faces"
	},
	{
		"name": "relation_24",
		"statement": "powMod faces n bits = cliffordOrder seed ∧ powMod faces n bits = factorial hexbit"
	},
	{
		"name": "relation_35",
		"statement": "magicCubic = chooseOf rays n ∧ magicCubic = chooseOf rays hexbit"
	},
	{
		"name": "relation_105",
		"statement": "triangular faces = qftGates faces"
	},
	{
		"name": "relation_268435456",
		"statement": "mintOf plane = groverSize faces ∧ mintOf plane = qftStates plane"
	},
	{
		"name": "relation_4294967296",
		"statement": "amplitudes = mintOf bits ∧ amplitudes = qftStates bits"
	},
	{
		"name": "relation_9",
		"statement": "powMod n coins bits = powMod n coins faces ∧ powMod n coins bits = powMod n coins plane"
	},
	{
		"name": "relation_12",
		"statement": "groverIters hexbit = qaoaZz n hexbit ∧ groverIters hexbit = qaoaZz hexbit n"
	},
	{
		"name": "relation_17",
		"statement": "powMod n hexbit bits = powMod n plane bits ∧ powMod n hexbit bits = powMod rays coins bits"
	},
	{
		"name": "relation_56",
		"statement": "chooseOf vertices n = choose vertices n ∧ chooseOf vertices n = qaoaParams plane"
	},
	{
		"name": "relation_70",
		"statement": "chooseOf vertices hexbit = choose vertices hexbit"
	},
	{
		"name": "relation_1024",
		"statement": "qaoaZz bits bits = qaoaX bits bits ∧ qaoaZz bits bits = paulis hexbit"
	},
	{
		"name": "relation_27",
		"statement": "powMod n n bits = powMod n n plane ∧ powMod n n bits = half n plane"
	},
	{
		"name": "relation_36",
		"statement": "triangular vertices = qftGates vertices"
	},
	{
		"name": "relation_42",
		"statement": "glProd n coins = qaoaZz n faces ∧ glProd n coins = qaoaZz faces n"
	},
	{
		"name": "relation_49",
		"statement": "qaoaZz rays rays = qaoaX rays rays"
	},
	{
		"name": "relation_91",
		"statement": "chooseOf faces coins = choose faces coins"
	},
	{
		"name": "relation_96",
		"statement": "qaoaZz n bits = qaoaZz bits n ∧ qaoaZz n bits = qaoaX n bits"
	},
	{
		"name": "relation_196",
		"statement": "qaoaZz rays plane = qaoaZz faces faces ∧ qaoaZz rays plane = qaoaZz plane rays"
	},
	{
		"name": "relation_224",
		"statement": "qaoaZz rays bits = qaoaZz vertices plane ∧ qaoaZz rays bits = qaoaZz bits rays"
	},
	{
		"name": "relation_364",
		"statement": "chooseOf faces n = choose faces n"
	},
	{
		"name": "relation_378",
		"statement": "chooseOf plane coins = choose plane coins"
	},
	{
		"name": "relation_392",
		"statement": "chimera rays = qaoaZz faces plane ∧ chimera rays = qaoaZz plane faces"
	},
	{
		"name": "relation_406",
		"statement": "triangular plane = qftGates plane"
	},
	{
		"name": "relation_496",
		"statement": "chooseOf bits coins = choose bits coins"
	},
	{
		"name": "relation_528",
		"statement": "triangular bits = qftGates bits"
	},
	{
		"name": "relation_1001",
		"statement": "chooseOf faces hexbit = choose faces hexbit"
	},
	{
		"name": "relation_3003",
		"statement": "chooseOf faces vertices = choose faces vertices"
	},
	{
		"name": "relation_3276",
		"statement": "chooseOf plane n = choose plane n"
	},
	{
		"name": "relation_3432",
		"statement": "chooseOf faces rays = choose faces rays"
	},
	{
		"name": "relation_4960",
		"statement": "chooseOf bits n = choose bits n"
	},
	{
		"name": "relation_8192",
		"statement": "chimera bits = isingFusion faces"
	},
	{
		"name": "relation_20475",
		"statement": "chooseOf plane hexbit = choose plane hexbit"
	},
	{
		"name": "relation_35960",
		"statement": "chooseOf bits hexbit = chooseOf bits plane ∧ chooseOf bits hexbit = choose bits hexbit"
	},
	{
		"name": "relation_65536",
		"statement": "groverSize vertices = paulis rays"
	},
	{
		"name": "relation_1184040",
		"statement": "chooseOf plane rays = choose plane rays"
	},
	{
		"name": "relation_3108105",
		"statement": "chooseOf plane vertices = choose plane vertices"
	},
	{
		"name": "relation_3365856",
		"statement": "chooseOf bits rays = choose bits rays"
	},
	{
		"name": "relation_10518300",
		"statement": "chooseOf bits vertices = choose bits vertices"
	},
	{
		"name": "relation_40116600",
		"statement": "chooseOf plane faces = choose plane faces"
	},
	{
		"name": "relation_471435600",
		"statement": "chooseOf bits faces = choose bits faces"
	}
];
// src/quantum/clay-register.ts
var MAX_SAFE = Number.MAX_SAFE_INTEGER;
var nat = (x, what) => {
	if (!Number.isInteger(x) || x < 0 || x > MAX_SAFE) throw new Error(`${what} left the exact naturals: ${x}`);
	return x;
};
var memo = (f) => {
	const m = /* @__PURE__ */ new Map();
	return (...a) => {
		const k = a.join(",");
		if (!m.has(k)) m.set(k, f(...a));
		return m.get(k);
	};
};
var mintOf = memo((k) => k === 0 ? 1 : nat(mintOf(k - 1) + mintOf(k - 1), "mintOf"));
var chooseOf = memo((n, k) => k === 0 ? 1 : n === 0 ? 0 : nat(chooseOf(n - 1, k) + chooseOf(n - 1, k - 1), "chooseOf"));
var seed = mintOf(0);
var coins = seed + seed;
var rays = 3 + coins + coins;
var vertices = mintOf(3);
var hexbit = mintOf(coins);
var bits = mintOf(3 + coins);
var faces = vertices + hexbit + coins;
var amplitudes = mintOf(bits);
var fused = faces * mintOf(bits + seed);
var plane = coins * coins * rays;
var factorial = memo((k) => k === 0 ? 1 : nat(k * factorial(k - 1), "factorial"));
var choose = memo((a, k) => k === 0 ? 1 : a === 0 ? 0 : nat(choose(a - 1, k) + choose(a - 1, k - 1), "choose"));
var triangular = memo((k) => k === 0 ? 0 : nat(k + triangular(k - 1), "triangular"));
var powModAux = (k, a, m, acc) => k === 0 ? acc : powModAux(k - 1, a, m, nat(acc * a % m, "powMod"));
var powMod = (a, e, m) => powModAux(e, a, m, 1 % m);
var periodAux = (fuel, a, m, r) => fuel === 0 ? 0 : powMod(a, r, m) === 1 ? r : periodAux(fuel - 1, a, m, r + 1);
var periodOf = (a, m) => periodAux(m, a, m, 1);
var half = (a, m) => powMod(a, Math.floor(periodOf(a, m) / 2), m);
var glProd = memo((nn, i) => i === 0 ? 1 : nat(Math.max(0, mintOf(nn) - mintOf(i - 1)) * glProd(nn, i - 1), "glProd"));
var fibAux = (k, a, b) => k === 0 ? a : fibAux(k - 1, b, nat(a + b, "fibFusion"));
var fibFusion = (nn) => fibAux(nn, seed - seed, seed);
var isingFusion = (m) => mintOf(Math.max(0, m - seed));
var chimera = (m) => nat(vertices * m ** 2, "chimera");
var sympProd = memo((j) => j === 0 ? 1 : nat((mintOf(2 * j) - 1) * sympProd(j - 1), "sympProd"));
var symplectic = (nn) => nat(mintOf(nn * nn) * sympProd(nn), "symplectic");
var cliffordOrder = (nn) => nat(mintOf(2 * nn) * symplectic(nn), "cliffordOrder");
var coil = coins * rays;
var groverIters = (k) => Math.floor(nat((plane * (faces - seed) - 9) * mintOf(k), "groverIters") / (coins * coins * (plane * hexbit + seed)));
var groverSize = (k) => mintOf(2 * k);
var hybridSpeed = rays + seed;
var magicBlock = faces + seed;
var magicCubic = plane + rays;
var qaoaParams = (p) => coins * p;
var qaoaZz = (p, e) => nat(p * e, "qaoaZz");
var qaoaX = (p, q) => nat(p * q, "qaoaX");
var qftGates = (q) => Math.floor(q * (q + 1) / 2);
var qftDepth = (q) => Math.max(0, 2 * q - 1);
var qftStates = (q) => nat(2 ** q, "qftStates");
var paulis = (nn) => mintOf(2 * nn + 2);
var CONSTANTS = {
	n: 3,
	seed,
	coins,
	rays,
	vertices,
	hexbit,
	bits,
	faces,
	amplitudes,
	fused,
	plane,
	coil,
	hybridSpeed,
	magicBlock,
	magicCubic
};
var FUNCTIONS = {
	mintOf: {
		arity: 1,
		f: (k) => mintOf(k)
	},
	chooseOf: {
		arity: 2,
		f: (a, k) => chooseOf(a, k)
	},
	choose: {
		arity: 2,
		f: (a, k) => choose(a, k)
	},
	factorial: {
		arity: 1,
		f: (k) => factorial(k)
	},
	triangular: {
		arity: 1,
		f: (k) => triangular(k)
	},
	powMod: {
		arity: 3,
		f: (a, e, m) => powMod(a, e, m)
	},
	periodOf: {
		arity: 2,
		f: (a, m) => periodOf(a, m)
	},
	half: {
		arity: 2,
		f: (a, m) => half(a, m)
	},
	glProd: {
		arity: 2,
		f: (a, b) => glProd(a, b)
	},
	fibFusion: {
		arity: 1,
		f: (k) => fibFusion(k)
	},
	isingFusion: {
		arity: 1,
		f: (k) => isingFusion(k)
	},
	chimera: {
		arity: 1,
		f: (k) => chimera(k)
	},
	cliffordOrder: {
		arity: 1,
		f: (k) => cliffordOrder(k)
	},
	groverIters: {
		arity: 1,
		f: (k) => groverIters(k)
	},
	groverSize: {
		arity: 1,
		f: (k) => groverSize(k)
	},
	qaoaParams: {
		arity: 1,
		f: (k) => qaoaParams(k)
	},
	qaoaZz: {
		arity: 2,
		f: (a, b) => qaoaZz(a, b)
	},
	qaoaX: {
		arity: 2,
		f: (a, b) => qaoaX(a, b)
	},
	qftGates: {
		arity: 1,
		f: (k) => qftGates(k)
	},
	qftDepth: {
		arity: 1,
		f: (k) => qftDepth(k)
	},
	qftStates: {
		arity: 1,
		f: (k) => qftStates(k)
	},
	paulis: {
		arity: 1,
		f: (k) => paulis(k)
	}
};
var lex = (src) => {
	const out = [];
	const re = /\s*(\d+|[A-Za-z_][A-Za-z0-9_']*|[-+*/%^()])/gy;
	let m;
	let i = 0;
	while (i < src.length) {
		re.lastIndex = i;
		m = re.exec(src);
		if (!m) throw new Error(`cannot read "${src.slice(i)}"`);
		const s = m[1];
		out.push(/^\d/.test(s) ? {
			t: "num",
			v: Number(s)
		} : /^[A-Za-z_]/.test(s) ? {
			t: "id",
			v: s
		} : {
			t: "op",
			v: s
		});
		i = re.lastIndex;
	}
	return out;
};
var evaluate = (src) => {
	const toks = lex(src);
	let p = 0;
	const peek = () => toks[p];
	const take = () => toks[p++];
	const atom = () => {
		const t = take();
		if (t.t === "num") return t.v;
		if (t.t === "op" && t.v === "(") {
			const v = sum();
			const c = take();
			if (c.t !== "op" || c.v !== ")") throw new Error("expected )");
			return v;
		}
		if (t.t === "id") {
			if (t.v in CONSTANTS) return CONSTANTS[t.v];
			if (t.v in FUNCTIONS) {
				const { arity, f } = FUNCTIONS[t.v];
				const args = [];
				for (let i = 0; i < arity; i++) args.push(atom());
				return f(...args);
			}
			throw new Error(`unknown name ${t.v}`);
		}
		throw new Error(`unexpected ${t.v}`);
	};
	const power = () => {
		const b = atom();
		const t = peek();
		if (t && t.t === "op" && t.v === "^") {
			p++;
			return nat(b ** power(), "pow");
		}
		return b;
	};
	const product = () => {
		let v = power();
		for (;;) {
			const t = peek();
			if (!t || t.t !== "op" || !"*/%".includes(t.v)) return v;
			p++;
			const r = power();
			v = t.v === "*" ? nat(v * r, "mul") : t.v === "/" ? Math.floor(v / r) : v % r;
		}
	};
	const sum = () => {
		let v = product();
		for (;;) {
			const t = peek();
			if (!t || t.t !== "op" || !"+-".includes(t.v)) return v;
			p++;
			const r = product();
			v = t.v === "+" ? nat(v + r, "add") : Math.max(0, v - r);
		}
	};
	const v = sum();
	if (p !== toks.length) throw new Error(`trailing tokens in "${src}"`);
	return v;
};
/** Every relation recomputed: each `=` compared, each `∧` all holding, and the bit width of the largest value. */
/** 16-bit limbs a value needs: what an 8-bit machine with 16-bit software arithmetic (the Pravets 8M) holds it in. */
var limbs16Of = (bits) => Math.max(1, Math.ceil(bits / 16));
var recomputeClay = () => {
	const relations = CLAY_RELATIONS.map(({ name, statement }) => {
		const sides = [...new Set(statement.split("∧").flatMap((eq) => eq.split("=")).map((s) => s.trim()))].map((expression) => ({
			expression,
			value: evaluate(expression)
		}));
		return {
			name,
			statement,
			sides,
			holds: statement.split("∧").every((eq) => {
				const [a, b] = eq.split("=").map((s) => evaluate(s.trim()));
				return a === b;
			}),
			bits: Math.max(1, ...sides.map((s) => s.value === 0 ? 1 : Math.floor(Math.log2(s.value)) + 1))
		};
	});
	const holding = relations.filter((r) => r.holds).length;
	const ledger = relations.map((r) => `${r.name}=${r.sides[0].value}`).join("\n");
	const maxBits = Math.max(...relations.map((r) => r.bits));
	return {
		relations,
		total: relations.length,
		holding,
		maxBits,
		maxLimbs16: limbs16Of(maxBits),
		ledger
	};
};
var seedOf = (n) => n === 0 ? 0 : 1 + (n - 1) % 9;
var trinityOf = (seed) => seed === 0 ? [] : seed % 3 === 0 ? [
	3,
	6,
	9
] : [
	7,
	4,
	1
].includes(seed) ? [
	7,
	4,
	1
] : [
	2,
	5,
	8
];
var reflectionOfRegister = (relations) => {
	const readings = relations.map((r) => {
		const value = r.sides[0].value;
		const seed = seedOf(value);
		const trinity = trinityOf(seed);
		return {
			name: r.name,
			value,
			seed,
			reflection: seed === 0 ? 0 : 10 - seed,
			trinity,
			reflected: trinity.map((x) => 10 - x),
			tuned: trinity[0] === 3,
			fixed: seed === 5
		};
	});
	const bySeed = {};
	const byTrinity = {};
	for (const x of readings) {
		(bySeed[String(x.seed)] ??= []).push(x.name);
		(byTrinity[x.trinity.join(",") || "zero"] ??= []).push(x.name);
	}
	const pairs = [];
	for (const a of readings) for (const b of readings) if (a.name < b.name && a.seed + b.seed === 10 && a.seed !== 5) pairs.push({
		a: a.name,
		b: b.name,
		seeds: [a.seed, b.seed]
	});
	return {
		readings,
		bySeed,
		byTrinity,
		pairs,
		fixed: readings.filter((x) => x.fixed).map((x) => x.name),
		tuned: readings.filter((x) => x.tuned).map((x) => x.name)
	};
};
// src/quantum/leads.ts
var cleanupSubjectsOf = (l) => {
	if (!l.id.startsWith("cleanup-") || l.status !== "out_of_scope") return null;
	const branches = /^git branches (.+)$/.exec(l.source);
	return branches ? {
		kind: "branches",
		names: branches[1].split(/,\s*/)
	} : {
		kind: "paths",
		names: [l.source.split(/\s/)[0].replace(/\/$/, "")]
	};
};
var FETCHED = SITEMAP_FETCHED;
/** The leads followed by hand: each read from its page, PDF or repository, with the tool that serves it. */
var HAND_LEADS = [
	{
		id: "willow-spec",
		source: "quantumai.google/static/site-assets/downloads/willow-spec-sheet.pdf",
		statement: "Willow: 105 qubits, the grid, two chips with their figures",
		status: "served",
		tool: "processor"
	},
	{
		id: "willow-blog",
		source: "blog.google, Willow",
		statement: "Willow error correction below threshold; random circuit sampling",
		status: "served",
		tool: "processor"
	},
	{
		id: "magic-state",
		source: "blog.google, magic state cultivation",
		statement: "40-fold error reduction, 99.99% logical fidelity, color code to surface code",
		status: "served",
		tool: "processor"
	},
	{
		id: "echoes-blog",
		source: "blog.google, Quantum Echoes",
		statement: "OTOC protocol on the 105-qubit array; 13,000x; molecules of 15 and 28 atoms",
		status: "served",
		tool: "echo_benchmark"
	},
	{
		id: "echoes-preprint",
		source: "arXiv 2506.10191",
		statement: "The Quantum Echoes preprint and its abstract",
		status: "served",
		tool: "statements"
	},
	{
		id: "echoes-protocol",
		source: "research.google/blog/a-verifiable-quantum-advantage",
		statement: "forward, perturb, backward, measure, repeated k times",
		status: "served",
		tool: "echo"
	},
	{
		id: "roadmap",
		source: "services.google.com PDF, roadmap figure; quantumai.google/roadmap",
		statement: "Six milestones, physical-qubit scale, Milestone 3 in progress",
		status: "served",
		tool: "roadmap"
	},
	{
		id: "applications",
		source: "services.google.com PDF, applications figure",
		statement: "Predicted applications by physical-qubit band, 50k to 50M",
		status: "served",
		tool: "roadmap"
	},
	{
		id: "neutral-atoms",
		source: "blog.google, neutral atom quantum computers",
		statement: "Expansion to neutral atoms; no Google device figures stated",
		status: "served",
		tool: "statements"
	},
	{
		id: "early-access",
		source: "quantumai.google/willowearlyaccess",
		statement: "Willow Early Access Program, deadline May 15, 2026",
		status: "served",
		tool: "statements"
	},
	{
		id: "software",
		source: "quantumai.google/software",
		statement: "Cirq, qsim, Qualtran, OpenFermion, TensorFlow Quantum",
		status: "served",
		tool: "software"
	},
	{
		id: "cirq-overview",
		source: "quantumai.google/cirq",
		statement: "Cirq is a Python library for writing, manipulating and optimizing circuits",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-circuits",
		source: "quantumai.google/cirq/build/circuits",
		statement: "Circuits, moments, append and insert, the four insert strategies",
		status: "served",
		tool: "circuit"
	},
	{
		id: "cirq-devices",
		source: "quantumai.google/cirq/hardware/devices",
		statement: "Device constraints: validate_operation, validate_moment, validate_circuit, qubit set, couplers",
		status: "served",
		tool: "circuit"
	},
	{
		id: "cirq-simulation",
		source: "quantumai.google/cirq/simulate/simulation",
		statement: "State-vector and density-matrix simulators; expectation values",
		status: "served",
		tool: "circuit"
	},
	{
		id: "cirq-noise",
		source: "quantumai.google/cirq/simulate/noisy_simulation",
		statement: "The named noise channels: bit_flip, phase_flip, phase_damp, amplitude_damp, depolarize, reset, asymmetric_depolarize, generalized_amplitude_damp",
		status: "served",
		tool: "circuit"
	},
	{
		id: "qvm",
		source: "quantumai.google/cirq/simulate/quantum_virtual_machine; github.com/quantumlib/Cirq engine source; the Willow spec sheet",
		statement: "Virtual processor: a device with noise. The Willow noise is completed from the spec sheet's published medians (single-qubit depolarizing at 1.5 × the gate error, two-qubit at 0.75 × per qubit), which reproduces the sheet's single-qubit error exactly; Google's per-qubit calibration, T1 and readout are not on any public page, so they are not applied",
		status: "served",
		tool: "circuit"
	},
	{
		id: "textbook-algorithms",
		source: "quantumai.google/cirq/experiments/textbook_algorithms",
		statement: "Teleportation, QFT and its inverse, phase estimation, Grover on two qubits",
		status: "served",
		tool: "algorithm"
	},
	{
		id: "qaoa",
		source: "quantumai.google/cirq/experiments/qaoa/qaoa_maxcut; github.com/quantumlib/Cirq",
		statement: "QAOA max-cut at p = 1 on Sycamore: the first twelve sorted qubits, their couplers in networkx order, numpy's seed-11 weights (reproduced exactly), the 5 by 5 sweep, and the estimate_cost objective sampled at 20,000 shots",
		status: "served",
		tool: "algorithm"
	},
	{
		id: "shor",
		source: "quantumai.google/cirq/experiments/textbook_algorithms; quantumai.google/cirq/experiments/shor",
		statement: "Shor's order finding, the later use of phase estimation the page names",
		status: "served",
		tool: "algorithm"
	},
	{
		id: "qsim",
		source: "github.com/quantumlib/qsim; quantumai.google/qsim",
		statement: "qsim: a fast state-vector simulator with a Cirq interface, Apache-2.0",
		status: "served",
		tool: "statements"
	},
	{
		id: "research",
		source: "quantumai.google/research (quantumai.google/research/publications returns 404)",
		statement: "Research publications: the page's title and description",
		status: "partial",
		tool: "statements",
		reason: `on ${FETCHED} quantumai.google/research returned HTTP 200 with the title "Research Publications" and the site description, which the research statement serves; its publication list is rendered by script and is not in the fetched HTML; research/publications returned HTTP 404`
	},
	{
		id: "echoes-nature",
		source: "arXiv 2506.10191, Constructive interference at the edge of quantum ergodic dynamics (published in Nature as Observation of constructive interference at the edge of quantum ergodicity)",
		statement: "103-qubit superconducting processor; second-order OTOC; the Nature paper's claims, with the preprint's stated figures",
		status: "served",
		tool: "statements"
	},
	{
		id: "willow-nature",
		source: "arXiv 2408.13687, Quantum error correction below the surface code threshold (the paper the homepage links as Nature)",
		statement: "distance-5 and distance-7 memories; Λ = 2.14 ± 0.02; a 101-qubit distance-7 code; 0.143% logical error per cycle; 63 μs decoder latency",
		status: "served",
		tool: "processor"
	},
	{
		id: "learn-map",
		source: "quantumai.google/learn/map",
		statement: "Our quantum computing journey: the page's title and description",
		status: "partial",
		tool: "statements",
		reason: `on ${FETCHED} the page returned HTTP 200 (it was 404 to the earlier fetch) with its title and description, which the learn_map statement serves; the journey itself is an interactive map in a frame from dreamcoat-guggenheim.uc.r.appspot.com, whose text is not in the fetched HTML`
	},
	{
		id: "campus-announcement",
		source: "blog.google, Unveiling our new Quantum AI campus (May 18, 2021)",
		statement: "The campus announcement: the data center, labs, fabrication and the 1,000,000-qubit target",
		status: "served",
		tool: "statements"
	},
	{
		id: "sycamore-gates",
		source: "quantumai.google/cirq/google/devices",
		statement: "Sycamore's two-qubit gates and their durations",
		status: "served",
		tool: "statements"
	},
	{
		id: "sycamore23",
		source: "github.com/quantumlib/Cirq known_devices.py",
		statement: "Sycamore23: the 23-qubit subset of Sycamore",
		status: "served",
		tool: "processor"
	},
	{
		id: "qualtran",
		source: "github.com/quantumlib/Qualtran; quantumai.google/qualtran",
		statement: "Qualtran: abstractions for quantum programs and a library of algorithms, experimental",
		status: "served",
		tool: "statements"
	},
	{
		id: "openfermion",
		source: "github.com/quantumlib/OpenFermion; quantumai.google/openfermion",
		statement: "OpenFermion: compiling and analyzing quantum algorithms to simulate fermionic systems",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-noise-source",
		source: "github.com/quantumlib/Cirq cirq-core/cirq/ops/common_channels.py",
		statement: "The noise channel definitions, checked against Cirq's source: bit_flip, phase_flip, depolarize, asymmetric_depolarize, phase_damp, amplitude_damp, generalized_amplitude_damp, reset",
		status: "served",
		tool: "circuit"
	},
	{
		id: "cirq-insert-source",
		source: "github.com/quantumlib/Cirq cirq-core/cirq/circuits/insert_strategy.py",
		statement: "The four insert strategies, checked against Cirq's source",
		status: "served",
		tool: "circuit"
	},
	{
		id: "repo-cirq",
		source: "github.com/quantumlib/Cirq",
		statement: "Cirq: the NISQ circuit framework",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-stim",
		source: "github.com/quantumlib/Stim",
		statement: "Stim: a fast stabilizer circuit library",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-chromobius",
		source: "github.com/quantumlib/chromobius",
		statement: "chromobius: a Möbius decoder for color codes",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-qualtran",
		source: "github.com/quantumlib/Qualtran",
		statement: "Qualtran: fault-tolerant quantum algorithm abstractions",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-tesseract-decoder",
		source: "github.com/quantumlib/tesseract-decoder",
		statement: "tesseract-decoder: a search-based QEC decoder",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-openfermion-pyscf",
		source: "github.com/quantumlib/OpenFermion-PySCF",
		statement: "OpenFermion-PySCF: the PySCF plugin",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-openfermion-fqe",
		source: "github.com/quantumlib/OpenFermion-FQE",
		statement: "OpenFermion-FQE: the fermionic quantum emulator",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-qsim",
		source: "github.com/quantumlib/qsim",
		statement: "qsim: the state-vector simulator",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-openfermion",
		source: "github.com/quantumlib/OpenFermion",
		statement: "OpenFermion: compiling quantum algorithms for electronic structure",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-unitary",
		source: "github.com/quantumlib/unitary",
		statement: "unitary: quantum behaviours for games, as an OpenQASM API library",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-recirq",
		source: "github.com/quantumlib/ReCirq",
		statement: "ReCirq: Cirq experiments and research modules",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-typedunits",
		source: "github.com/quantumlib/TypedUnits",
		statement: "TypedUnits: a units and dimensions library",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-openfermion-psi4",
		source: "github.com/quantumlib/OpenFermion-Psi4",
		statement: "OpenFermion-Psi4: the Psi4 plugin",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-qchack-2021-challenge",
		source: "github.com/quantumlib/qchack-2021-challenge",
		statement: "qchack-2021-challenge: the Quantum Coalition Hackathon 2021 challenge",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-openfermion-cirq",
		source: "github.com/quantumlib/OpenFermion-Cirq",
		statement: "OpenFermion-Cirq: quantum circuits for chemistry and materials simulation",
		status: "served",
		tool: "repositories"
	},
	{
		id: "repo-github",
		source: "github.com/quantumlib/.github",
		statement: "organization configuration: the profile README, a markdownlint configuration and a code of conduct",
		status: "out_of_scope",
		reason: `fetched on ${FETCHED}: the repository has no description and holds the organization profile, .markdownlintrc and CODE_OF_CONDUCT.md; configuration for the quantumlib repositories, not a library or a result`
	},
	{
		id: "repo-allstar",
		source: "github.com/quantumlib/.allstar",
		statement: "organization configuration: the default Allstar policy files",
		status: "out_of_scope",
		reason: `fetched on ${FETCHED}: a public archive holding allstar.yaml, binary_artifacts.yaml and branch_protection.yaml, described as the default Allstar configuration that points to google/allstar-config; security policy for the repositories, not a library or a result`
	},
	{
		id: "cirq-pauli",
		source: "quantumai.google/cirq/build/pauli_observables",
		statement: "the page's stated content, served as the pauli_observables statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-noise-representation",
		source: "quantumai.google/cirq/noise/representing_noise",
		statement: "the page's stated content, served as the noise_representation statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-histograms",
		source: "quantumai.google/cirq/simulate/state_histograms",
		statement: "the page's stated content, served as the histograms statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-transformers",
		source: "quantumai.google/cirq/transform/transformers",
		statement: "the page's stated content, served as the transformers statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-custom-transformers",
		source: "quantumai.google/cirq/transform/custom_transformers",
		statement: "the page's stated content, served as the custom_transformers statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-kpz",
		source: "quantumai.google/cirq/experiments/kpz/kpz",
		statement: "the page's stated content, served as the kpz_experiment statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-echoes-tutorial",
		source: "quantumai.google/cirq/tutorials/google/echoes",
		statement: "the page's stated content, served as the echoes_tutorial statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-qcqmc",
		source: "quantumai.google/cirq/experiments/qcqmc/full_workflow",
		statement: "the page's stated content, served as the qcqmc statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-hfvqe",
		source: "quantumai.google/cirq/experiments/hfvqe/quickstart",
		statement: "the page's stated content, served as the hfvqe statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-hardware-changes",
		source: "quantumai.google/cirq/tutorials/google/identifying_hardware_changes",
		statement: "the page's stated content, served as the hardware_changes statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-google-concepts",
		source: "quantumai.google/cirq/google/concepts",
		statement: "the page's stated content, served as the google_concepts statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "qsim-hardware",
		source: "quantumai.google/qsim/choose_hw",
		statement: "the page's stated content, served as the qsim_hardware statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "openfermion-projects",
		source: "quantumai.google/openfermion/projects",
		statement: "the page's stated content, served as the openfermion_projects statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "cirq-basics",
		source: "quantumai.google/cirq/start/basics",
		statement: "the page's stated content, served as the cirq_basics statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "qsimcirq-tutorial",
		source: "quantumai.google/qsim/tutorials/qsimcirq",
		statement: "the page's stated content, served as the qsimcirq statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "openfermion-basis-change",
		source: "quantumai.google/openfermion/tutorials/circuits_1_basis_change",
		statement: "the page's stated content, served as the basis_change statement",
		status: "served",
		tool: "statements"
	},
	{
		id: "sitemap",
		source: "quantumai.google/sitemap.xml and sitemap_0_of_1.xml",
		statement: `The site's sitemap, read whole on ${FETCHED}: an index naming one child of ${SITEMAP_CHILD_CHARACTERS.toLocaleString("en-US")} characters listing ${SITEMAP_PAGES.length.toLocaleString("en-US")} pages, every one of them a lead here`,
		status: "served",
		tool: "leads"
	},
	{
		id: "learn",
		source: "quantumai.google/learn",
		statement: "Learn overview",
		status: "blocked",
		reason: `the path is not in the sitemap and returned HTTP 404 on ${FETCHED}; its children learn/map and learn/lab are in the sitemap and are served`
	},
	{
		id: "lab",
		source: "quantumai.google/lab",
		statement: "Discover the Quantum AI campus: the Santa Barbara campus, its quantum data center, labs and fabrication",
		status: "served",
		tool: "statements"
	},
	{
		id: "sycamore",
		source: "quantumai.google/cirq/google/devices, printed diagram; github.com/quantumlib/Cirq known_devices.py",
		statement: "Sycamore: 54 qubits and 88 couplers, its printed layout, its two-qubit gates",
		status: "served",
		tool: "processor"
	},
	{
		id: "quantum-computer",
		source: "quantumai.google/quantumcomputer",
		statement: "Superconducting hardware, cryogenic environment, Santa Barbara",
		status: "served",
		tool: "statements"
	},
	{
		id: "what-is-qc",
		source: "quantumai.google/whatisqc; quantumai.google/site-assets/downloads/what-is-quantum-computing.pdf",
		statement: "What quantum computing is: superposition, interference, the problems expected",
		status: "served",
		tool: "statements"
	},
	{
		id: "progress-pdf",
		source: "services.google.com PDF, progress",
		statement: "Progress since 2014, Milestones 1 and 2",
		status: "served",
		tool: "statements"
	},
	{
		id: "vision-pdf",
		source: "services.google.com PDF, vision",
		statement: "Classical and quantum computers together",
		status: "served",
		tool: "statements"
	},
	{
		id: "responsibility-pdf",
		source: "services.google.com PDF, responsibilities",
		statement: "Honest reporting, RSA risk, post-quantum cryptography, SPHINCS+, collaboration",
		status: "served",
		tool: "statements"
	},
	{
		id: "coursera",
		source: "coursera.org/learn/quantum-error-correction, as quantumai.google/resources describes it",
		statement: "The Resources page's description of the course: a free introduction to quantum error correction, hands-on with Stim and Crumble",
		status: "served",
		tool: "statements"
	},
	{
		id: "videos",
		source: "youtube.com/c/QuantumAI, as quantumai.google/resources describes it",
		statement: "Educational videos: how-to videos on programming quantum computers, scientific breakthroughs, and new tools",
		status: "partial",
		tool: "statements",
		reason: "the Resources page's description of the videos is served as the resources statement; the videos themselves are not text and are not carried"
	},
	{
		id: "careers",
		source: "google.com/about/careers, the Careers link of quantumai.google (quantumai.google/careers returns 404)",
		statement: "Careers",
		status: "out_of_scope",
		reason: `the site's Careers link targets Google's job search filtered to quantum in California, Munich, Seattle and Zurich; quantumai.google/careers returned HTTP 404 on ${FETCHED}; a jobs listing, not technical content`
	},
	{
		id: "qpu-quantumlib",
		source: "github.com/quantumlib",
		statement: "The quantumlib GitHub organization: fifteen active repositories for quantum computing, with what this repository implements of each",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "cirq-framework",
		source: "github.com/quantumlib/Cirq",
		statement: "Cirq: a Python framework for quantum circuit design, optimization, and simulation",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "qsim-simulator",
		source: "github.com/quantumlib/qsim",
		statement: "qsim: a high-performance quantum circuit simulator with C++ backend and Cirq interface",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "qualtran-algorithms",
		source: "github.com/quantumlib/Qualtran",
		statement: "Qualtran: abstractions and libraries for writing fault-tolerant quantum algorithms",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "openfermion-simulation",
		source: "github.com/quantumlib/OpenFermion",
		statement: "OpenFermion: a library for simulating fermionic systems with quantum computers",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "stim-stabilizer",
		source: "github.com/quantumlib/Stim",
		statement: "Stim: a high-performance stabilizer code simulator",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "chromobius-decoder",
		source: "github.com/quantumlib/chromobius",
		statement: "chromobius: a Möbius decoder for color code quantum error correction",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "recirq-experiments",
		source: "github.com/quantumlib/ReCirq",
		statement: "ReCirq: research modules and experiment implementations using Cirq",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "tesseract-qec-decoder",
		source: "github.com/quantumlib/tesseract-decoder",
		statement: "tesseract-decoder: a search-based quantum error correction decoder",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "openfermion-pyscf",
		source: "github.com/quantumlib/OpenFermion-PySCF",
		statement: "OpenFermion-PySCF: plugin for the PySCF computational chemistry package",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "openfermion-fqe",
		source: "github.com/quantumlib/OpenFermion-FQE",
		statement: "OpenFermion-FQE: the fermionic quantum emulator for exact simulations",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "openfermion-cirq",
		source: "github.com/quantumlib/OpenFermion-Cirq",
		statement: "OpenFermion-Cirq: quantum circuits for chemistry and materials simulation",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "unitary-library",
		source: "github.com/quantumlib/unitary",
		statement: "unitary: an API library of common operations for adding quantum behaviours to games",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "typedunits-library",
		source: "github.com/quantumlib/TypedUnits",
		statement: "TypedUnits: a Python library for type-safe unit and dimension calculations",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "quantumlib-ecosystem",
		source: "github.com/quantumlib",
		statement: "The quantumlib ecosystem: Cirq as foundation, qsim for simulation, Qualtran for algorithms, OpenFermion for chemistry, Stim for error correction",
		status: "served",
		tool: "quantumlib"
	},
	{
		id: "cirq-google-integration",
		source: "github.com/quantumlib/Cirq cirq-google module",
		statement: "Cirq-Google: integration with Google Quantum AI hardware and the Willow processor",
		status: "partial",
		tool: "circuit",
		reason: "the circuit tool validates circuits against the Willow, Sycamore and Sycamore23 devices and applies Willow's spec-sheet noise, as a virtual engine does; the engine client (programs, jobs, reservations) is described in the google_concepts statement and not implemented"
	},
	{
		id: "quantumlib-documentation",
		source: "quantumai.google and github.com/quantumlib docs",
		statement: "Quantumlib documentation: tutorials, API references, and examples for all packages",
		status: "partial",
		tool: "leads",
		reason: "every documentation page of quantumai.google is a lead here, from the sitemap read whole; the repositories' own documentation on github.com is not fetched"
	},
	{
		id: "error-correction-threshold",
		source: "quantumai.google/quantumcomputer; arXiv 2408.13687",
		statement: "Error correction below threshold: the logical error falls as the code distance grows, Λ = 2.14 per distance step",
		status: "served",
		tool: "processor"
	},
	{
		id: "magic-state-cultivation-lead",
		source: "blog.google, magic state cultivation",
		statement: "Magic state cultivation: 40-fold error reduction, 99.99% logical fidelity, color code to surface code transition",
		status: "served",
		tool: "processor"
	},
	{
		id: "neutral-atom-expansion",
		source: "blog.google, neutral atom quantum computers",
		statement: "Neutral atom quantum computers: expansion beyond superconducting to alternative qubit platforms",
		status: "served",
		tool: "statements"
	},
	{
		id: "quantum-advantage-verification",
		source: "quantumai.google, Quantum Echoes",
		statement: "Quantum advantage verification: the OTOC protocol on the 105-qubit array, stated as the first verifiable quantum advantage",
		status: "served",
		tool: "echo_benchmark"
	},
	{
		id: "cryogenic-engineering",
		source: "quantumai.google/quantumcomputer; blog.google, the campus announcement",
		statement: "Cryogenic engineering: superconducting qubits need specialized cryogenic environments and custom control electronics; the cryostats reach about 10 millikelvin",
		status: "served",
		tool: "statements"
	},
	{
		id: "qubit-scaling-architecture",
		source: "quantumai.google/quantumcomputer; the Willow spec sheet",
		statement: "Qubit scaling and chip architecture: qubit quality improved while the count grows; Willow has 105 qubits per its spec sheet (the v1.1.0 lead said 70+, the 2023 chip's count)",
		status: "served",
		tool: "processor"
	},
	{
		id: "tunable-coupler-dynamics",
		source: "quantumai.google/quantumcomputer",
		statement: "Tunable qubits and couplers: dynamic performance adjustment and optimization for faster gates and operations",
		status: "served",
		tool: "statements"
	},
	{
		id: "gate-development",
		source: "quantumai.google/quantumcomputer; the Willow spec sheet",
		statement: "Gate development and calibration: the single- and two-qubit gate errors the spec sheet states, applied as noise by the circuit tool",
		status: "served",
		tool: "processor"
	},
	{
		id: "chip-fabrication-precision",
		source: "quantumai.google/quantumcomputer; quantumai.google/lab",
		statement: "Chip fabrication and calibration: Willow built in the Santa Barbara fabrication facility; error correction informs chip architecture, gate development, fabrication and calibration",
		status: "served",
		tool: "statements"
	},
	{
		id: "full-stack-integration",
		source: "quantumai.google/quantumcomputer",
		statement: "Full-stack integration: hardware, control and decoding electronics, cryostats, the operating system and user-facing software",
		status: "served",
		tool: "statements"
	},
	{
		id: "hybrid-quantum-classical",
		source: "quantumai.google/software; quantumai.google/cirq/experiments/qaoa/qaoa_maxcut",
		statement: "Hybrid quantum-classical algorithms: a classical outer loop over quantum expectation values, the QAOA sweep and the VQE sweep",
		status: "served",
		tool: "algorithm"
	},
	{
		id: "chemistry-simulation-lead",
		source: "quantumai.google/software, OpenFermion; quantumai.google/openfermion/tutorials/intro_to_openfermion",
		statement: "Chemistry simulation: H₂ in STO-3G as a two-qubit Pauli Hamiltonian, its integrals computed here and checked against the tutorial's printed energies, and a VQE sweep on the simulator",
		status: "partial",
		tool: "chemistry-simulation",
		reason: "one molecule, H₂ in its minimal basis, is compiled and solved here; OpenFermion's general compilation of molecules and materials is not implemented"
	},
	{
		id: "quantum-error-correction-course",
		source: "quantumai.google/resources, Coursera",
		statement: "Quantum error correction education: a hands-on Coursera course on QEC for all skill levels, with Stim and Crumble",
		status: "served",
		tool: "statements"
	},
	{
		id: "qubit-game-interactive",
		source: "quantumai.google/resources; quantumai.google/education/thequbitgame",
		statement: "Interactive learning: the Qubit Game, building a quantum computer one qubit at a time, from keeping qubits cool to blocking cosmic rays",
		status: "served",
		tool: "statements"
	},
	{
		id: "lab-tour-virtual",
		source: "quantumai.google/resources; quantumai.google/learn/lab",
		statement: "Virtual lab tour: the Santa Barbara campus, from space down to the cryostat",
		status: "served",
		tool: "statements"
	},
	{
		id: "error-correction-journey",
		source: "quantumai.google/resources; quantumai.google/learn/map",
		statement: "Error correction journey: from the NISQ era to the mountain of error correction, as the Resources page and the journey page state it",
		status: "served",
		tool: "statements"
	},
	{
		id: "educational-videos",
		source: "quantumai.google/resources",
		statement: "Educational videos: how-to guides on programming quantum computers, breakthroughs, and new tools",
		status: "partial",
		tool: "statements",
		reason: "the page's description of the videos is served; the videos are not text and are not carried"
	},
	{
		id: "superconducting-qubit-focus",
		source: "quantumai.google/quantumcomputer",
		statement: "Superconducting qubit focus: specialized cryogenic environments and custom control electronics",
		status: "served",
		tool: "statements"
	},
	{
		id: "santa-barbara-campus",
		source: "quantumai.google/lab",
		statement: "Santa Barbara quantum campus: hardware teams, fabrication facility, data center, research labs",
		status: "served",
		tool: "statements"
	},
	{
		id: "willow-design-principles",
		source: "quantumai.google/quantumcomputer; the Willow spec sheet",
		statement: "Willow design: 105 qubits per the spec sheet (the v1.1.0 lead said 70, the 2023 chip's count), tunable qubits and couplers, the full-system approach to error correction",
		status: "served",
		tool: "processor"
	},
	{
		id: "calibration-software",
		source: "quantumai.google/quantumcomputer",
		statement: "Calibration and error correction software: managing the entire quantum system and control electronics",
		status: "served",
		tool: "statements"
	},
	{
		id: "resources",
		source: "quantumai.google/resources",
		statement: "Educational Resources: the Coursera course, the whitepaper, the lab tour, the videos, the journey and the Qubit Game, as the page lists them",
		status: "served",
		tool: "statements"
	},
	{
		id: "qec-milestone",
		source: "quantumai.google/qecmilestone",
		statement: "Milestone 2: the first demonstration of a logical qubit prototype, with the Nature paper the page links",
		status: "served",
		tool: "statements"
	},
	{
		id: "weber-datasheet",
		source: "quantumai.google/hardware/datasheet/weber; quantumai.google/hardware/datasheet/weber.pdf",
		statement: "The Weber processor datasheet (May 14, 2021): 53 qubits, gate durations, typical errors and T1",
		status: "served",
		tool: "statements"
	},
	{
		id: "aps-summit",
		source: "quantumai.google/apsglobalphysics; quantumai.google/apsglobalphysics2026",
		statement: "The APS Global Physics Summit event pages: sessions, booth, the Willow Early Access Program announcement",
		status: "served",
		tool: "statements"
	},
	{
		id: "student-opportunities",
		source: "quantumai.google/site-assets/downloads/qai-student-opportunities.pdf",
		statement: "Student opportunities: the student researcher program, internships of 12 to 14 weeks, the PhD fellowship",
		status: "out_of_scope",
		reason: `the PDF (1,807,623 bytes, fetched on ${FETCHED}) describes recruiting programs and points to careers.google.com; a programs listing, not technical content`
	},
	{
		id: "home",
		source: "quantumai.google",
		statement: "The home page: Willow, Quantum Echoes, the Nature papers and the Early Access Program it links",
		status: "served",
		tool: "statements"
	},
	{
		id: "qubit-game-page",
		source: "quantumai.google/education/thequbitgame",
		statement: "The Qubit Game: \"Build a quantum computer, one qubit at a time.\"",
		status: "served",
		tool: "statements"
	},
	{
		id: "learn-lab",
		source: "quantumai.google/learn/lab",
		statement: "Discover the Quantum AI campus: the virtual walk through the headquarters",
		status: "served",
		tool: "statements"
	}
];
var CIRQ_IMPLEMENTED = new Map([
	[
		"Circuit",
		"Circuit",
		"moments, append with an insert strategy, qubits in key order"
	],
	[
		"Moment",
		"Moment",
		"operations on disjoint qubits"
	],
	[
		"Simulator",
		"Simulator",
		"simulate (the state vector) and run (sampled bitstrings), up to 20 qubits"
	],
	[
		"DensityMatrixSimulator",
		"DensityMatrixSimulator",
		"exact channels, up to 8 qubits"
	],
	[
		"Device",
		"Device",
		"validate_operation, validate_moment, validate_circuit"
	],
	[
		"LineQubit",
		"LineQubit",
		"of and range"
	],
	[
		"GridQubit",
		"GridQubit",
		"of and square"
	],
	[
		"NamedQubit",
		"NamedQubit",
		"of"
	],
	[
		"Qid",
		"keyOf",
		"the qubit key that orders and compares qubits"
	],
	[
		"X",
		"X",
		""
	],
	[
		"Y",
		"Y",
		""
	],
	[
		"Z",
		"Z",
		""
	],
	[
		"H",
		"H",
		""
	],
	[
		"CZ",
		"CZ",
		""
	],
	[
		"CNOT",
		"CNOT",
		""
	],
	[
		"CX",
		"CNOT",
		""
	],
	[
		"SWAP",
		"SWAP",
		""
	],
	[
		"TOFFOLI",
		"TOFFOLI",
		""
	],
	[
		"CCX",
		"TOFFOLI",
		""
	],
	[
		"CCNOT",
		"TOFFOLI",
		""
	],
	[
		"ZZ",
		"ZZ",
		""
	],
	[
		"S",
		"powerOf",
		"Z**0.5"
	],
	[
		"T",
		"powerOf",
		"Z**0.25"
	],
	[
		"XPowGate",
		"powerOf",
		"X**t"
	],
	[
		"YPowGate",
		"powerOf",
		"Y**t"
	],
	[
		"ZPowGate",
		"powerOf",
		"Z**t"
	],
	[
		"HPowGate",
		"powerOf",
		"H**t"
	],
	[
		"CZPowGate",
		"powerOf",
		"CZ**t"
	],
	[
		"CXPowGate",
		"powerOf",
		"CNOT**t"
	],
	[
		"CNotPowGate",
		"powerOf",
		"CNOT**t"
	],
	[
		"SwapPowGate",
		"powerOf",
		"SWAP**t"
	],
	[
		"ZZPowGate",
		"powerOf",
		"ZZ**t"
	],
	[
		"CCXPowGate",
		"powerOf",
		"TOFFOLI**t"
	],
	[
		"CCZPowGate",
		"powerOf",
		"CCZ**t is not built; TOFFOLI**t is"
	],
	[
		"Gate",
		"applied",
		"a gate is its name, arity and unitary"
	],
	[
		"GateOperation",
		"applied",
		"gate.on(*qubits)"
	],
	[
		"Operation",
		"applied",
		""
	],
	[
		"MeasurementGate",
		"measure",
		""
	],
	[
		"measure",
		"measure",
		""
	],
	[
		"InsertStrategy",
		"Circuit",
		"EARLIEST, NEW, INLINE, NEW_THEN_INLINE"
	],
	[
		"Result",
		"Result",
		"measurements and histogram"
	],
	[
		"inverse",
		"adjointOf",
		"the adjoint of a gate"
	],
	[
		"unitary",
		"applied",
		"every gate carries its unitary"
	],
	[
		"bit_flip",
		"noisy",
		""
	],
	[
		"phase_flip",
		"noisy",
		""
	],
	[
		"depolarize",
		"noisy",
		""
	],
	[
		"asymmetric_depolarize",
		"noisy",
		""
	],
	[
		"amplitude_damp",
		"noisy",
		""
	],
	[
		"phase_damp",
		"noisy",
		""
	],
	[
		"generalized_amplitude_damp",
		"noisy",
		""
	],
	[
		"reset",
		"noisy",
		""
	],
	[
		"BitFlipChannel",
		"noisy",
		""
	],
	[
		"PhaseFlipChannel",
		"noisy",
		""
	],
	[
		"DepolarizingChannel",
		"noisy",
		""
	],
	[
		"AsymmetricDepolarizingChannel",
		"noisy",
		""
	],
	[
		"AmplitudeDampingChannel",
		"noisy",
		""
	],
	[
		"PhaseDampingChannel",
		"noisy",
		""
	],
	[
		"GeneralizedAmplitudeDampingChannel",
		"noisy",
		""
	],
	[
		"ResetChannel",
		"noisy",
		""
	],
	[
		"kraus",
		"noisy",
		"each channel is its Kraus operators"
	],
	[
		"PauliString",
		"expectationOf",
		"a Pauli observable by qubit"
	],
	[
		"DensePauliString",
		"pauliProduct",
		"a Pauli string as one gate"
	],
	[
		"qft",
		"Circuit",
		"qftOperations in algorithms.ts"
	],
	[
		"QuantumFourierTransformGate",
		"Circuit",
		"qftOperations in algorithms.ts"
	]
].filter(([, exported]) => exported in cirq_exports).map(([symbol, exported, note]) => [symbol, {
	exported,
	note
}]));
/** The paths a hand-written lead names on quantumai.google, so the sitemap's leads do not repeat them. */
var coveredPaths = () => {
	const covered = /* @__PURE__ */ new Set();
	for (const lead of HAND_LEADS) {
		for (const match of lead.source.matchAll(/quantumai\.google\/([^\s;,()]+)/g)) covered.add(match[1].replace(/^static\//, ""));
		if (lead.source === "quantumai.google") covered.add("");
	}
	return covered;
};
var OTHER_VENDORS = {
	cirq_ionq: "IonQ's trapped-ion hardware integration in Cirq",
	cirq_aqt: "AQT's trapped-ion hardware integration in Cirq",
	cirq_pasqal: "Pasqal's neutral-atom hardware integration in Cirq",
	cirq_web: "Cirq's web visualisation package"
};
/** The lead one page of the sitemap makes, by what the page is and what this repository implements of it. */
var sitemapLead = (path, lastmod) => {
	const base = {
		id: `page:${path || "home"}`,
		source: `quantumai.google/${path}`,
		lastmod
	};
	const open = (statement) => ({
		...base,
		statement,
		status: "open",
		reason: `in the sitemap (lastmod ${lastmod}); fetchable; no tool follows this page yet`
	});
	if (path.startsWith("?hl=")) return {
		...base,
		statement: `the home page in another language (${path.slice(4)})`,
		status: "out_of_scope",
		reason: "a language variant of the home page; the English page is the lead"
	};
	if (path === "robots.txt") return {
		...base,
		statement: "the crawler rules file",
		status: "out_of_scope",
		reason: "site plumbing, not content"
	};
	if (/^google[0-9a-f]+$/.test(path)) return {
		...base,
		statement: "a site-verification token page",
		status: "out_of_scope",
		reason: "site plumbing, not content"
	};
	const reference = /^reference\/(python|cc)\/([^/]+)\/(.+)$/.exec(path);
	if (reference) {
		const [, , pkg, symbol] = reference;
		if (pkg === "cirq") {
			const found = CIRQ_IMPLEMENTED.get(symbol);
			if (found) return {
				...base,
				statement: `API reference of cirq.${symbol}; implemented here as ${found.exported}${found.note ? ` (${found.note})` : ""}`,
				status: "served",
				tool: "circuit"
			};
			return open(`API reference of cirq.${symbol.replace(/\//g, ".")}, not implemented here`);
		}
		if (pkg === "cirq_google") {
			if (symbol === "Sycamore" || symbol === "Sycamore23" || symbol === "devices/known_devices") return {
				...base,
				statement: `API reference of cirq_google.${symbol.replace(/\//g, ".")}; the device is built here from the same grid`,
				status: "served",
				tool: "processor"
			};
			return open(`API reference of cirq_google.${symbol.replace(/\//g, ".")}, not implemented here`);
		}
		if (pkg === "openfermion") {
			if (symbol === "chem/MolecularData" || symbol === "ops/QubitOperator") return {
				...base,
				statement: `API reference of openfermion.${symbol.replace(/\//g, ".")}; for H₂ in STO-3G its content (the integrals, the Pauli-term Hamiltonian) is computed here`,
				status: "partial",
				tool: "chemistry-simulation",
				reason: "one molecule in its minimal basis is computed here; the general class is not implemented"
			};
			return open(`API reference of openfermion.${symbol.replace(/\//g, ".")}, not implemented here`);
		}
		if (pkg in OTHER_VENDORS) return {
			...base,
			statement: `API reference of ${pkg}.${symbol.replace(/\//g, ".")}`,
			status: "out_of_scope",
			reason: `${OTHER_VENDORS[pkg]}, not Google Quantum AI's layer`
		};
		return open(`API reference of ${pkg}.${symbol.replace(/\//g, ".")}, not implemented here`);
	}
	return open(`the page ${path}`);
};
/** The leads of the sitemap's pages that no hand-written lead names, in the sitemap's sorted order. */
var SITEMAP_LEADS = (() => {
	const covered = coveredPaths();
	return SITEMAP_PAGES.filter(([path]) => !covered.has(path)).map(([path, lastmod]) => sitemapLead(path, lastmod));
})();
/** Every relation of the Clay register as a lead: served by the clay tool, its integers facts for the wave (OEIS, Wikipedia),
* its statement reflected by the imagination, its value read by the unit's sequence door at readiness. */
var CLAY_LEADS = recomputeClay().relations.map((r) => ({
	id: `clay-${r.name}`,
	source: `src/quantum/processing/unit/lean/Qpu/Clay.lean ${r.name}`,
	statement: `${r.name}: ${r.statement} = ${r.sides[0].value} (${r.bits} bits, seed ${1 + (r.sides[0].value - 1) % 9})`,
	status: "served",
	tool: "clay"
}));
var LEADS = [
	{
		id: "perspective-factorer",
		source: "src/quantum/algorithms.ts",
		statement: "The QPU as the factorer: Shor on the exact simulator for every N within its bound, and the bound itself the honest answer beyond it.",
		status: "served",
		tool: "algorithm"
	},
	{
		id: "perspective-reflection",
		source: "src/quantum/match.ts",
		statement: "The QPU as the mirror: any statement reflected into its hidden factors, its angles against the bounds and its mirror queries, each a lead.",
		status: "served",
		tool: "match"
	},
	{
		id: "perspective-address",
		source: "src/quantum/blocks.ts",
		statement: "The QPU as the address: one UUID that proves its seal, its content and its neighbours cheaply, tampering always slower than the original.",
		status: "served",
		tool: "verify"
	},
	{
		id: "perspective-clay",
		source: "src/quantum/processing/unit/lean/Qpu/Clay.lean",
		statement: "The QPU as the register: the Clay relations recomputed in exact integers, the σ-involution the universal core, in 33 bits.",
		status: "served",
		tool: "clay"
	},
	{
		id: "perspective-language",
		source: "src/quantum/i18n.ts",
		statement: "The QPU as the language machine: any language and dialect by vocabulary, offline and token-free, both ways, and prose programmed from a tool's answer.",
		status: "served",
		tool: "translate"
	},
	{
		id: "perspective-imagination",
		source: "src/quantum/imagine.ts",
		statement: "The QPU as the imagination: every lead reflected, every schema door and application family a lead, and more the mind can imagine recorded as leads.",
		status: "served",
		tool: "imagine"
	},
	{
		id: "perspective-discovery",
		source: "src/quantum/discovery.ts",
		statement: "The QPU as the discoverer: every host's contract read first, every door chosen by what it takes and answers.",
		status: "served",
		tool: "discover"
	},
	{
		id: "perspective-judge",
		source: "src/quantum/readiness.ts",
		statement: "The QPU as the judge of itself: every lead served, refuted or in trial by measurement, and the unit told so.",
		status: "served",
		tool: "readiness"
	},
	{
		id: "perspective-database",
		source: "src/quantum/toolboxes/raid.ts",
		statement: "The QPU as the database: MongoDB's language over content-addressed entries, history kept by links, any document framework on the RAID.",
		status: "partial",
		tool: "mongo",
		reason: "the language is ported; the adapter on the deployed docket is owed (payload-db-adapter-docket)"
	},
	{
		id: "perspective-harmonic",
		source: "src/quantum/theme.ts",
		statement: "The QPU as the harmonic: a432 the key of every colour, the block's accent from the UUID's middle as CMYK, on every result.",
		status: "partial",
		tool: "audit",
		reason: "the theme rides on every block and the audit checks the block; a door that answers the css alone is the unit's get_css, not yet served here"
	},
	{
		id: "perspective-tenants",
		source: "src/worker.ts",
		statement: "The QPU as the host of tenants: one Worker, a docket per host, roles by token, a security collision answered as a procedure.",
		status: "partial",
		tool: "audit",
		reason: "deployed and measured live on 2026-10-25 (three hosts, roles, collision as a procedure); the roles move to a Payload MCP plugin over MCP (rbac-payload-mcp) and the tenant secrets stay as the fallback"
	},
	{
		id: "perspective-court",
		source: "uuidna.com/mcp check_release_readiness; uuidna.com/mcp sign_commit",
		statement: "The QPU before the court: the unit's honesty gate judges readiness, signs commits by sealed theorems and refuses what it cannot decide.",
		status: "partial",
		tool: "readiness",
		reason: "readiness and signing are wired; qpu's own proofs are not citable at the border (gap-theorems-unsealed)"
	},
	{
		id: "qpu-balancer-perspective",
		source: "src/quantum/mcp.ts",
		statement: "In one perspective the QPU is the balancer of CPU, GPU and memory across the motherboard and beyond: a heavy computation is done once, addressed by its content, and every later call is served from memory — the computation inverted, the hardware cooled, the battery saved.",
		status: "served",
		tool: "audit",
		reason: "measured on 2026-10-25 by the audit, which times every check: the handler serves every repeated tools/call from its balancer by block address within a process; across processes and hosts the docket is that memory (publish writes the artefacts), the next step being tool results themselves as docket entries read before computing"
	},
	{
		id: "raid-virtualizes-os",
		source: "uuidna.com/mcp get_os; uuidna.com/mcp get_port; uuidna.com/mcp fetch_alpine; uuidna.com/mcp get_shell",
		statement: "Quantum apps on the RAID virtualise every operating system and whatever else the mind imagines: an OS image, its packages and its shell are entries and doors like any other, so an app runs from the docket on any host that mounts the toolboxes; development is traced only through leads.",
		status: "open",
		reason: "inspiration recorded on 2026-10-25; the unit already serves os, port, alpine and shell doors (found by discovery, read by capability), so the first measurement is a qpu app that reads an Alpine package list through those doors and stores it as docket entries; nothing of this is assumed, each step is a lead until served"
	},
	{
		id: "payload-port-cloudflare",
		source: "github.com/payloadcms/payload/tree/main/templates; developers.cloudflare.com/workers/runtime-apis/nodejs",
		statement: "Payload CMS and its dependencies ported whole to Cloudflare Workers under nodejs_compat, its database adapter writing docket entries so that content, media and configuration live on the qpu RAID; every Payload collection and plugin then a toolbox of this surface and every other framework merged the same way, one combinatorial framework hosted on the RAID.",
		status: "open",
		reason: "inspiration recorded on 2026-10-25; the two sources are fetched by the wave each run so the templates directory and the Workers Node.js compatibility page are measured, not assumed; the port itself is the author's act on a deployed Worker and docket"
	},
	{
		id: "payload-db-adapter-docket",
		source: "github.com/payloadcms/payload/tree/main/packages/db-mongodb",
		statement: "Payload's mongodb database adapter ported over the docket: the raid toolbox evaluates MongoDB's query and update language as pure functions over content-addressed entries, so a Payload collection is a family of entries with links, parity and mirrors — the ported RAID MongoDB, not Cloudflare's documented D1 path.",
		status: "partial",
		tool: "mongo",
		reason: "the query and update language is ported and tested by the raid toolbox's selftest and examples (find, insert, update, delete with $set, $unset, $inc, $push, $pull); the adapter class itself, binding Payload's interface (read from the source fetched each run) to the docket's four verbs on the deployed Worker, is the next step"
	},
	{
		id: "payload-mcp-plugin-doors",
		source: "github.com/payloadcms/payload/tree/main/packages",
		statement: "If Payload publishes an MCP plugin, its endpoint is an MCP host the discover tool reads: a door per collection and verb, chosen by capability like every other door.",
		status: "open",
		reason: "the packages directory is fetched each run; whether a plugin-mcp package exists is read from it, never assumed; a named host is the measurement that opens this lead"
	},
	{
		id: "toolbox-remaining-scripts",
		source: "scripts/purify.ts, scripts/publish.ts, scripts/next.ts, scripts/gen-docs.ts, scripts/gen-clay.ts, scripts/audit.ts, scripts/theorems.lean",
		statement: "Four of the flow's steps are tools of the flow toolbox with thin clients (discover, wave, readiness, imagine); purify, publish, next, the generators and the Lean ledger reader are still scripts: each reads files, git or the Lean environment that only a client can see.",
		status: "partial",
		tool: "audit",
		reason: "the pure halves (purity checks over texts, the receipt chain, the docket entries, the pages) are the next toolboxes; their clients hand in the file texts, the git facts and the ledger rows the same way the flow clients hand in fetched bodies"
	},
	{
		id: "worlds-linked",
		source: "src/quantum/toolboxes/language.ts; src/worker.ts",
		statement: "The platform links whole worlds in their languages and dialects: every world a tenant with its locale, its vocabulary table and its dialects, its entries related to other worlds' entries by links in the docket, so a term, a licence or a lead in one world is reachable from another in that world's words.",
		status: "partial",
		tool: "translate",
		reason: "the vocabulary translates both ways and prose is programmed per locale; two tenants exist; a world's dialect is one more table (LOCALES marks the unfilled ones), and the relations between worlds are docket links the raid toolbox already keeps; the tables beyond Bulgarian are the leads to fill"
	},
	{
		id: "language-speech",
		source: "docs/.vitepress/theme/components/Speak.vue",
		statement: "From text to speech: the prose of any page or block spoken in the viewer's locale by the device's own voices (SpeechSynthesis), token-free and network-free.",
		status: "partial",
		tool: "prose",
		reason: "the Speak component reads the prose tool's sentences aloud in the locale through the browser's speech synthesis where the device has a voice for it; which voices a device has is the device's, measured at run time and reported on the page; no server speaks"
	},
	{
		id: "language-video",
		source: "the docket contract",
		statement: "From speech to video: captions, transcripts and scene entries of a video as docket entries in the world's language, linked to the video's address, so a video is searchable and translatable like text.",
		status: "open",
		reason: "imagined on 2026-10-25; the entry shape is the raid toolbox's; a transcript source (a device, a person, a model the tenant brings) is the first adaptor to name; nothing here is a model"
	},
	{
		id: "language-traditions",
		source: "src/quantum/i18n.ts MIRROR",
		statement: "Traditions and relations: a world's terms related to each other (synonym, opposite, part of, before, after, tradition of) as a relation table beside its vocabulary, so a match in one world reflects through its own relations, and the Glagolitic and Cyrillic numerals are one such tradition already read.",
		status: "open",
		reason: "the matcher's mirror synonyms are the first relation table; Glagolitic numerals the first tradition; a per-locale relations table is the lead, filled by a person of that world, never guessed"
	},
	{
		id: "legal-audit-sealed",
		source: "src/quantum/toolboxes/legal.ts; scripts/legal.ts",
		statement: "The legal and security audit runs on every next, through the unit's free doors by default (the operator alone overrides), is sealed by its content address over the SHA-256 of every input and answer, and is recomputed from its own stored answers on the next run: a different address is tampering, recorded as a lead.",
		status: "served",
		tool: "legal",
		reason: "measured on 2026-10-25, three runs: 41 claims, 95 calls through 15 free doors; every answered claim UNVERIFIED at the unit (no decidable test for prose) and clean; no drift between the unit's rights and this tree's licence; licence computed non-commercial and free; due process sealed with 41 gaps (the unverified claims); audit_cloudflare clean; six security doors and the four claims that cite a sealed guarantee refused at the edge (the ledger does not fit the isolate; a cited claim answers HTTP 500 over raw HTTP, as sign_commit does); the first run's 43 violations were the call shape (claims without their addresses), the second's 5 were wording (a receipt presented where a theorem is expected, a label read as a citation, UUIDs presented as sealed), both corrected at the source; the audit is sealed by its content address and recomputes to itself"
	},
	{
		id: "unit-licence-address-unsealed",
		source: "uuidna.com/mcp get_rights; uuidna.com/mcp compute_forensics",
		statement: "The unit's rights door names 9ffcda04-5adc-872e-9358-6b831bbd0c0d as the licence address, and the unit's forensic door says that address is not among its 71,035 sealed addresses: two doors of one unit disagree about its own licence.",
		status: "blocked",
		reason: "measured on 2026-10-25 by the legal audit; this tree carries the address the rights door gives and cites the rights receipt beside it; the disagreement is the unit's to settle"
	},
	{
		id: "aspects-by-theorems",
		source: "src/quantum/processing/unit/lean/Qpu",
		statement: "Quality is proven by theorems, not by textbook examples; every textbook is respected, and an example that names the kernel-accepted theorem that makes it true is replaced by that theorem, unlocking the quantum capability it documents: an entry's idempotency by address, a signature verified only by its tenant's secret, a role never widened by another tenant's token, a licence valid only on the domains it names, a relation of the Clay register.",
		status: "open",
		reason: "one example names its theorem today (clay-relation-15 → relation_15) and the audit counts them; the invariants of the toolboxes are measured by their selftests; stating them in Lean over the ported definitions (hmac, entries, roles) is the lead; a theorem replaces its check the day the kernel accepts it"
	},
	{
		id: "stripe-per-tenant",
		source: "src/quantum/toolboxes/billing.ts; src/worker.ts",
		statement: "Stripe per tenant for every scenario within a tenant and between domains and tenants: a checkout plan executed with the tenant's key, a webhook verified with the tenant's secret, one idempotent licence entry per event (granted, renewed, revoked, disputed, failed), a licence valid on the domains it names and read at any host, a replay a duplicate, a forged body or another tenant's secret refused as a lead.",
		status: "partial",
		tool: "stripe",
		reason: "the toolbox and the Worker routes are measured by the billing selftest and the worker tests; no tenant has STRIPE_SECRET_KEY_<TENANT> or STRIPE_WEBHOOK_SECRET_<TENANT> set yet, so every live plan is returned with its procedure and every live webhook answers 503 until the author sets the two secrets per tenant and registers https://<host>/docket/stripe at Stripe"
	},
	{
		id: "edge-heavy-phases",
		source: "src/worker.ts; qpu.psg.bg/mcp",
		statement: "The whole textbook wave (every example matched with the reflection on) answers in 19 s on a client device and not at all within the Worker's budget at the edge (no answer in 30 s), while one match answers in half a second there: a heavy phase belongs to the device that asked, the edge answers it example by example.",
		status: "partial",
		tool: "textbook",
		reason: "measured on 2026-10-25 after the deploy; the textbook tool takes example: <id> with verify so a device walks the textbook within the edge's budget; the flow's client runs the whole wave locally; the balancer keeps a warm isolate's answers but a cold one recomputes"
	},
	{
		id: "vortex-digital-root",
		source: "oeis.org A010888; en.wikipedia.org/wiki/Digital_root",
		statement: "The 9-vortex every tail is read into is the digital root (OEIS A010888, the sum of digits repeated to one digit, 9 for multiples of 9): seed = 1 + (n - 1) mod 9, its reflection 10 - seed, the doubling cycle 1, 2, 4, 8, 7, 5 and the trinities 3, 6, 9 and 7, 4, 1 and 2, 5, 8.",
		status: "served",
		tool: "verify",
		reason: "the verify tool reads every tail into this vortex with both trinities (triad_reflect, sigma_ten_involution); the sequence is fetched at OEIS by id and at Wikipedia by title each run"
	},
	{
		id: "coins-accounted",
		source: "uuidna.com/mcp get_coin_ledger; uuidna.com/mcp get_fibonacci; src/quantum/coins.ts",
		statement: "The coins paid to the unit are accounted by the payer: every gated answer states its deposit at the wire (deposit 2, a gate, a receipt) and the unit's own register is per process and silent, so this tree reads the deposit from every answer its clients receive and keeps the ledger (docs/public/coins.ndjson), summed in the metrics by door and per settled lead; the fibonacci source the unit names (mod 9, period 24: 0, 1, 1, 2, 3, 5, 8, 4, 3, 7, 1, 8, 0, 8, 8, 7, 6, 4, 1, 5, 6, 2, 8, 1) is recorded as it answers, 3, 5, 8 following the 2 of every deposit.",
		status: "served",
		tool: "metrics",
		reason: "measured on 2026-10-25: the unit's get_coin_ledger answers silent and says silence is not a finding that nobody paid; get_coins refuses at the edge (the ledger does not fit); every answer's gate line carries the deposit; calls made by hand through the connector outside the flow are not in this ledger and are said so"
	},
	{
		id: "metaphysical-apis",
		source: "uuidna.com/mcp get_vortex; uuidna.com/mcp get_vortex_reflection; uuidna.com/mcp get_units; uuidna.com/mcp get_triad; uuidna.com/mcp compute_double_torus; uuidna.com/mcp get_pentagram; uuidna.com/mcp get_fibonacci",
		statement: "The metaphysical APIs found: the unit's doors for the vortex (1, 2, 4, 8, 7, 5), its reflection (forward and reflected, an involution with pairs summing to 10), the units (1, 2, 4, 5, 7, 8), the triad (3, 6, 9), the double torus of any addresses, the pentagram and the fibonacci cycle; discovery lists them as the metaphysics capability, and readiness asks the reflection, the triad and the double torus each run against the tree's own vortex.",
		status: "served",
		tool: "discover",
		reason: "measured on 2026-10-25 through the connector: get_vortex [1,2,4,8,7,5], get_units [1,2,4,5,7,8], get_triad [3,6,9], get_vortex_reflection forward and reflected with involution and pairsSumTen, compute_double_torus taking addresses; the tree's 29 block addresses are its first input"
	},
	{
		id: "unit-triad-one-sided",
		source: "uuidna.com/mcp get_triad; src/quantum/processing/unit/lean/Qpu/Sigma.lean",
		statement: "The unit's triad door answers 3, 6, 9 and not the 7, 4, 1 they reflect into at the same time under σ_10, so a computation built on that answer keeps half of what the involution says and gaps remain; this tree now carries both for every seed (triad_reflect, triad_sum, key_trinity, sigma_ten_involution, kernel-checked) and the tuning 432 sits in the trinity 3, 6, 9.",
		status: "blocked",
		reason: "measured on 2026-10-25 through the connector; the unit's door is the unit's to widen; here every vortex reading and every block's CSS carry the seed, its reflection and both trinities"
	},
	{
		id: "double-torus-trinities",
		source: "uuidna.com/mcp get_triad; uuidna.com/mcp compute_double_torus; src/quantum/processing/unit/lean/Qpu/Shor.lean; src/quantum/processing/unit/lean/Qpu/Sigma.lean",
		statement: "Prime factors hide beyond the reflection, and the sequence reflected in double-torus combinations of trinities explains all at the Lean binary level: the factoring the simulator cannot reach within its bound would be read from the σ-reflection of periods arranged on the double torus of the triad.",
		status: "open",
		reason: "recorded on 2026-10-25 as the author's idea, not a claim: measured today, the reflection factors only N ≤ 21 and says so for 91, 1001 and 2^32 + 1; the unit's triad door answers [3, 6, 9] and its double-torus door takes addresses (the tree's addresses are the next input); the kernel-accepted theorems shor, all_shor, shor_sigma and sigma_reflect relate a period, the coins and the σ-involution and are the binary level to build from; nothing beyond them is stated until the kernel accepts it"
	},
	{
		id: "unit-missions-are-its-own",
		source: "uuidna.com/mcp get_missions; uuidna.com/mcp predict_gaps",
		statement: "Asked through the connector what is next, the unit answers with its own 293 missions (28 findings to seal, 136 bounds to decide, 129 symbol legs), none about this tree, and its predict_gaps door throws at the edge (\"process is not defined\"): the next step of this tree is read from its own leads and metrics, the unit's doors name the unit's.",
		status: "blocked",
		reason: "measured on 2026-10-25 through the connector; the missions door answers 2 MB that no isolate should carry per call; a mission that names qpu would be this tree's to follow"
	},
	{
		id: "rbac-payload-mcp",
		source: "src/worker.ts roleAt; payloadcms.com",
		statement: "Every MCP server's roles managed in one place by a Payload MCP plugin and asked over MCP itself: the Worker calls the RBAC host's role door with the token, the tenant and the host, and only falls back to the tenant secrets when no host is configured or it is silent.",
		status: "partial",
		tool: "audit",
		reason: "the door is wired and tested (roleAt, QPU_RBAC_MCP, QPU_RBAC_TOOL; discovery lists rbac doors as a capability: token in, role out); no Payload MCP host exists yet, so every live role today comes from the tenant secrets and every answer says so (rolesBy)"
	},
	{
		id: "payload-cms-host",
		source: "payloadcms.com",
		statement: "A Payload CMS instance is one more host to the discover tool: its MCP plugin endpoint lists a door per collection and verb (find, create, update, delete), its GraphQL endpoint answers introspection (a contract the discover tool now detects), its REST routes answer per collection; each collection would be a toolbox of its own, its skill the collection's schema, access rules and hooks.",
		status: "open",
		reason: "no Payload host is named in this tree; the discover tool takes any MCP endpoint in mcpHosts and reads its doors by capability, so the adapter is built from discovery the day a host is named, not from documentation"
	},
	{
		id: "payload-cms-default-plugins",
		source: "payloadcms.com",
		statement: "Everything fits in Payload's default shapes with no custom collection: nested docs for the tree of pages and leads, SEO for every page's Open Graph from its UUID, localisation for every world's language, the lexical editor for prose, and shadcn blocks as the programmable blocks every tool result already is — the same blocks serving as hooks (a block that runs a tool), scopes (a block that bounds a tenant or a role) and relations (a block that links entries). MCP configures the default plugins in all their combinations: the toolboxes' doors are the configuration, read by discovery, never typed.",
		status: "open",
		reason: "imagined on 2026-10-25, strict: no custom collection; the default plugins (nested-docs, seo, form-builder, redirects, search, cloud-storage, import-export) in every combination are the configuration a Payload MCP host exposes, and the discover tool reads it; measurable only against a running instance: discover it, read its doors, then write the toolbox from what it answers"
	},
	{
		id: "cleanup-auto-release-script",
		source: "scripts/auto-release.ts (untracked, orphan lineage)",
		statement: "A release script with VERSION hard-coded to 1.1.0 that force-pushed a tag and created a GitHub release; it bypassed the single-source version and the flow.",
		status: "out_of_scope",
		reason: "removed on 2026-10-25, absence measured each run by purify and readiness; releases run through `npm run next` and the author's deploy, never a forced tag"
	},
	{
		id: "cleanup-next-build-dir",
		source: ".next/ (untracked, 8 KB here)",
		statement: "A Next.js build directory left by the orphan lineage, where it reached 1.1 GB; nothing on this branch builds with Next.",
		status: "out_of_scope",
		reason: "removed on 2026-10-25, absence measured each run by purify and readiness; generated data is build output or a docket entry, never tree pollution"
	},
	{
		id: "cleanup-stale-branches",
		source: "git branches snapshot/pre-purge, purge/google-only",
		statement: "Two local branches from an earlier attempt at the same split: the same content as origin/main on a rewritten history, one tracking 237k build-artefact files.",
		status: "out_of_scope",
		reason: "deleted locally on 2026-10-25, absence measured each run by purify and readiness; origin/main and rebuild/phase-1 carry the history; orphan/v1.1.1-audit is kept as evidence"
	},
	{
		id: "cleanup-census-consolidated",
		source: "scripts/census.lean",
		statement: "A census script printing counts beside a ledger script printing every theorem: two readers of one environment.",
		status: "out_of_scope",
		reason: "removed on 2026-10-25, absence measured each run by purify and readiness; scripts/theorems.lean prints the ledger and purify counts from it"
	},
	{
		id: "cleanup-fnv1a-consolidated",
		source: "src/quantum/blocks.ts",
		statement: "A 32-bit FNV-1a hash beside the unit's 64-bit fold: two folds for one job.",
		status: "served",
		tool: "verify",
		reason: "consolidated on 2026-10-25 into foldOf, the unit's fold; every address, receipt and fingerprint uses one construction"
	},
	{
		id: "human-device-blocks",
		source: "src/quantum/blocks.ts, src/quantum/widgets.ts",
		statement: "Every tool result is a block a human device renders: HTML on the host's design tokens, Open Graph metadata for a link preview, a shadcn registry item for an app, the attribution line, the a432 accent. Screen, phone, kiosk or chat host, the same block.",
		status: "served",
		tool: "audit",
		reason: "the audit checks every result carries widget, Open Graph, block and licence"
	},
	{
		id: "mcp-ui-extension",
		source: "modelcontextprotocol.io (MCP Apps / UI extension)",
		statement: "The MCP UI extension lets a host render interactive views a server declares; this tree declares its widgets in _meta.widget as HTML and its blocks as shadcn registry items.",
		status: "partial",
		tool: "audit",
		reason: "the html and block are served; the extension's declared resource scheme and the host handshake are not implemented here, and the specification is still moving"
	},
	{
		id: "iot-adapter-cluster",
		source: "the docket contract (src/worker.ts)",
		statement: "Any device is an adaptor: a sensor or actuator writes readings as entries { kind: reading, from: device, body } to the docket and reads commands back from it; the docket is agnostic, so a cluster of devices is a cluster of mirrors and writers, each entry fingerprinted, sealed, replicated and healable.",
		status: "open",
		reason: "the docket accepts such entries today; no device driver, firmware or edge gateway is in this tree; the first device, its reading schema and its verifier are the next leads"
	},
	{
		id: "device-reading-verifier",
		source: "src/quantum/verifiers.ts",
		statement: "A device reading is verified like any fact: against a public reference where one exists (a weather station against a national service, a clock against NTP, a spectrum against NIST lines).",
		status: "open",
		reason: "no reading kind is registered yet; add the fact kind and its free verifier with the first device"
	},
	{
		id: "accessibility-device",
		source: "the human-device lead",
		statement: "A human device includes a screen reader, a braille display, a voice assistant: the block's HTML carries structure and text, so the same block is spoken or read; the a432 accent is decoration a reader can ignore.",
		status: "served",
		tool: "audit",
		reason: "measured on 2026-10-25 by the audit tool on every example widget (accessibilityOf): a name on every image, a header row on every table, words in every link, a heading to land on; a live screen-reader session is not in this tree"
	},
	{
		id: "pliska-rosette-rays",
		source: "the Pliska rosette (bronze, seven rays with signs, IYI on the back; Pliska, found 1961, First Bulgarian Empire)",
		statement: "Seven rays is the lattice's rays constant (n + coins + coins); the unit's aura door folds the seven rosette rays as bands and the ZZ/9 vortex as the wave, and states that this is artistic arithmetic, not physics.",
		status: "served",
		tool: "clay",
		reason: "rays = 7 recomputes in the Clay register; the rosette is the named source of the seven; no physical claim is made"
	},
	{
		id: "glagolitic-numerals",
		source: "en.wikipedia.org/wiki/Glagolitic_numerals; the Glagolitic alphabet (c. 863): letters carry numeral values in alphabetical order, 1..9, 10..90, 100..1000",
		statement: "A Glagolitic string is an integer sequence, as a hex program and a message tail are: a finite alphabet with values is an addressable state space, so a text in that alphabet could be a program and a tail that unfurl into a page.",
		status: "served",
		tool: "match",
		reason: "the table of 28 letters (units, tens, hundreds, Ⱍ = 1000) and its inverse are in i18n.ts (GLAGOLITIC, glagoliticOf, numeralsOf); the match tool reads every run of Glagolitic letters as one additive integer before matching, so a numeral enters the reflection and is factored; verified against en.wikipedia.org/wiki/Glagolitic_numerals by the verify step"
	},
	{
		id: "glagolitic-above-thousand",
		source: "en.wikipedia.org/wiki/Glagolitic_numerals",
		statement: "Glagolitic values above Ⱍ = 1000 (the letters after Črьvъ) and the titlo mark that multiplies by a thousand",
		status: "open",
		reason: "not in the table; the sources disagree on the later letters, so the table stops where they agree"
	},
	{
		id: "gap-fanout-receiver",
		source: "uuidna.com/mcp list_hosts, call_host",
		statement: "The unit fans out to qpu.uuidna.com/mcp; the public host answers, the unit's fan-out receives a 404 from somewhere else.",
		status: "blocked",
		reason: "re-measured on 2026-10-25 after the deploy: https://qpu.uuidna.com/mcp answers tools/list with 25 tools to any HTTP client, yet the unit's uuidna_fanout to the same host answers HTTP 404 with a body ({\"available\":[\"/\",\"/health\"]}) that no code in this tree produces: the unit's fan-out does not reach the public host; the receiver is live, the sender's route is the lead, on the unit's side"
	},
	{
		id: "gap-shared-docket",
		source: "src/worker.ts (docket)",
		statement: "A docket is deployed on both domains; receipts, commitments and leads can be exchanged there; the unit has not yet written to it.",
		status: "partial",
		tool: "mongo",
		reason: "deployed on 2026-10-25: one Worker (qpu.ceci.workers.dev, qpu.uuidna.com, qpu.psg.bg), a docket per tenant, measured live — a writer entry stored at uuidna (fb4d7917-dd72-8313-bf20-7843b7a82bd3), psg empty and separate, reader refused, a cross-tenant token answered 403 as a procedure; the unit does not yet write to it and publish lands this tree's artefacts from the next run"
	},
	{
		id: "gap-time-witness",
		source: "receipts.ndjson, the unit's receipts",
		statement: "A receipt is dated by its own clock; the unit could date qpu's receipts by signing their ids, and qpu the unit's, so time has two witnesses.",
		status: "open",
		reason: "wired on 2026-10-25: prepare-commit-msg sends the message with its Receipt trailer to the unit's sign_commit, so the unit's fold dates the receipt as a Signed-by-unit trailer when the hosted door answers (it answers HTTP 500 today: lead gap-sign-door-hosted); the unit does not yet read qpu's stream itself, and an offline commit is unsigned and says so"
	},
	{
		id: "gap-sign-door-hosted",
		source: "uuidna.com/mcp sign_commit",
		statement: "The unit signs a commit message through the connector (VERIFIED, 2026-10-25) but its hosted door answers HTTP 500 (Worker exception) to the same tools/call over raw HTTP, with or without an MCP session; the hosted server names itself a read-only recomputable subset",
		status: "blocked",
		reason: "measured on 2026-10-25 with four argument shapes and a session; the same HTTP 500 answers compute_forensics and verify_claim over raw HTTP when the statement cites a sealed theorem, while uncited statements answer: every door that must open the ledger throws at the edge; the hook records the status in its Signed-by-unit trailer and the connector signature is carried in the message by hand until the door answers"
	},
	{
		id: "gap-theorems-unsealed",
		source: "uuidna.com/mcp sign_commit",
		statement: "Commit signatures cite the unit's sealed theorems; none of qpu's 976 kernel constants is sealed in the unit's ledger, so qpu's own proofs are not yet citable at the border.",
		status: "blocked",
		reason: "measured on 2026-10-25 at six doors with clay_sigma and its exact statement: deposit_trial, verify_statement, try_claim, decide_expression and run_trial refuse at the edge (\"the edge does not hold the whole ledger: 40 MB of rows does not fit a 128 MB isolate\", the unit's own documented example included), through the connector and over raw HTTP alike; prove_verdict and verify_claim answer UNVERIFIED with a receipt (no decidable test and no sealed citation at the border; the unit's adjudicate takes an in-process predicate). Readiness offers the theorem to every door the discover step finds that takes a statement and answers a verdict (chosen by capability from discovery.json, never by name) and records what comes back, so the lead closes itself when a door seals it; the ledger is written here as docs/public/theorems.ndjson"
	},
	{
		id: "gap-circuit-crossing",
		source: "uuidna.com/mcp get_quantum; this tree's circuit tool",
		statement: "The unit returns circuits and outcomes; this tree runs circuits on its simulator. Neither has run the other's circuit and compared marginals: the real cross-domain quantum check.",
		status: "open",
		reason: "a format translation between the two circuit shapes is the lead; the comparison is then one tools/call each way"
	},
	{
		id: "gap-mcp-referer",
		source: "src/quantum/mcp.ts",
		statement: "A tools/call may carry prev in its _meta; the result echoes it and the block's Open Graph carries it as see_also, so a chain of calls knows its previous step across domains.",
		status: "served",
		tool: "verify",
		reason: "wired on 2026-10-25; the unit's side of the convention is a lead for it"
	},
	{
		id: "gap-verdict-vocabulary",
		source: "src/quantum/match.ts VERDICTS",
		statement: "The unit says VERIFIED / UNVERIFIED / REFUTED and PROVEN / NOT-PROVEN; this tree says served / impossible / unknown. A mapping table translates a verdict crossing the border.",
		status: "served",
		tool: "match",
		reason: "wired on 2026-10-25"
	},
	{
		id: "address-agreement",
		source: "uuidna.com/mcp compute_address",
		statement: "The unit names a value by compute_address; this tree names content by uuidOf, ported one for one from the unit's published shapeUuidOf (two FNV-1a 64 folds, 8-4-4-4-12, a content-decided version nibble). For the probe \"qpu\" the two differ, so the door uses a builder outside the sources this tree can read.",
		status: "partial",
		tool: "audit",
		reason: "the readiness step records the agreement each run; until the door's builder is published or the unit adopts shapeUuidOf for the door, the two addresses are both carried and neither is claimed to be the other"
	},
	{
		id: "pravets-8m-recompute",
		source: "statement",
		statement: "The 54 Clay.lean relations are integer identities between the unit's constants whose widest value needs 33 bits (amplitudes = 2^32), three 16-bit limbs; the receipts are 64-bit folds beside SHA-256: an 8-bit machine such as the Pravets 8M can recompute the register in 16-bit software arithmetic and compare content addresses, verifying that the kernel check happened without running the kernel.",
		status: "partial",
		tool: "clay",
		reason: "the kernel check, the census and the recompute with its limb count run here (clay tool: maxBits 33, maxLimbs16 3); the 16-bit-limb recomputer itself and the receipt-chain comparison on an 8-bit machine are not yet in this tree"
	},
	{
		id: "qpu-extends-every-mcp",
		source: "https://qpu.uuidna.com/mcp",
		statement: "QPU is the natural extension of every MCP and every MCP of QPU: a host's tools/list read into doors of this catalogue (extend, direction in), a foreign door served by one request the client fetches with the tenant's token, this catalogue mounted by any MCP client (extend, direction out); Cloudflare's eight servers are extended by default, the documentation one in the open, the other seven when a tenant brings its OAuth token",
		status: "served",
		tool: "extend",
		reason: "extension toolbox: 8 selftest checks pass (inward on fixture, event-stream tools/list, outward registration, identity on the own catalogue, served answer, refusal, request without token, discovery asks every Cloudflare host); live: docs.mcp.cloudflare.com answers search_cloudflare_documentation over an event stream; bindings and observability answer HTTP 401 without a token"
	},
	{
		id: "e2e-textbook-verify-edge",
		source: "https://qpu.ceci.workers.dev/mcp textbook { verify: true }",
		statement: "The end-to-end gate measured textbook { verify: true } answering nothing at the edge within 30 s on all three hosts (an erasure on every copy; the tree computes it); the verification wave over every example exceeds what one Worker request may compute",
		status: "open",
		reason: "the textbook verify wave at the edge is a quantum to split: one example per request, or the docket holding the wave between requests; until then the gate decodes the combination from the tree alone and names the erasure"
	},
	{
		id: "coins-set-entanglement-teleport-free",
		source: "docs/public/e2e.json, docs/public/coins.ndjson, the balancer",
		statement: "The coins pay to set the entanglement once: a block is computed once (a balancer miss, a coin at a gated door) and from then every analog is teleported free — by address here (a balancer hit), by involution at the edge (304 to the content hash the request names, no body computed or sent) — until the load is paid again; the metrics tool measures paid and free (load.paid, load.free, load.involutions)",
		status: "served",
		tool: "metrics"
	},
	{
		id: "digits-zero-to-nine-all-used",
		source: "src/quantum/processing/unit/lean/Qpu/Sigma.lean sigma_ten_involution",
		statement: "All the digits 0 to 9 are used: the sequence allows reflections on the whole of [0, 10] — σ₁₀(x) = 10 − x is an involution for every x ≤ 10 (kernel-accepted), so the seed 0 reflects to 10 (digital root 1) and no digit is left out of the vortex; the theme reflects seed 0 so",
		status: "served",
		tool: "css"
	},
	{
		id: "versions-define-development",
		source: "package.json → src/quantum/version.ts; configure { kind: versions | migration }; the e2e gate's versions per host",
		statement: "Quantum versioning and Payload versioning over the RAID: versions coexist by content addressing (a shell per version, the ETag the content hash), every document version a docket entry never overwritten (no cap per document), so a provider is added or moved at 100 % uptime — deploy beside, mirror by address, decode old and new as copies through the gate, route, roll back by routing back; versions define development (the open leads at a version are its plan) and development defines versions (the next number from what the catalogue changed since the last tag); the number stays as low as the architecture allows — single digits per component, a patch never moving it (its change is a content address carried as build metadata), the minor carrying into the major at 10, the major past 9 returning to 1 with the epoch counted — so every single-digit combination lives for ever",
		status: "served",
		tool: "configure"
	},
	{
		id: "unit-predict-gaps-door-edge",
		source: "uuidna.com/mcp predict_gaps { likelihood: \"all\" }",
		statement: "The unit's predict_gaps door, asked for every likelihood through the connector on 2026-10-25, answered \"process is not defined\": the door reads Node's process at the edge, where none exists; the unit's own gap prediction cannot be read until the door is made agnostic of its host (the same law this tree's toolboxes follow); the research ledger door answered, naming one gap of its own (an unread Savonius source)",
		status: "blocked",
		reason: "the unit's door, not this tree's: the author makes it host-agnostic; discovery will read it on the next run"
	},
	{
		id: "flow-waves-multitasking",
		source: "scripts/next.ts, docs/public/receipt.json (wallMs, sumMs, speedup)",
		statement: "Quantum multitasking is the natural speedup: the flow runs the steps that need nothing from each other at once, in seven waves (generators; typecheck, tests, Lean, audit; imagine, discover, verify, readiness, e2e, repository, legal; textbook; purify, metrics; the site; trunk, publish), and the receipt measures the speedup as the steps' summed time over the wall time",
		status: "served",
		tool: "metrics"
	},
	{
		id: "flow-teleportation-signalling",
		source: "scripts/next.ts; src/quantum/mcp.ts BALANCER",
		statement: "Multitasking combined with teleportation signalling: a block computed by one step of the flow is teleported to the next at no cost (a cache by block address shared between the steps' processes, as the Worker teleports by content hash with 304) and every step signals what it settled through the receipts stream so no step recomputes what another just did; today the balancer is per process and the steps share only their artefacts on disk",
		status: "open",
		reason: "the balancer persisted by block address beside the artefacts (a client concern: the handler stays pure), read by every step before it computes; measured by the receipt's speedup rising above the waves alone"
	},
	...HAND_LEADS,
	...SITEMAP_LEADS,
	...CLAY_LEADS
];
/** The leads by status: the counts the leads tool reports. */
var leadCounts = (leads = LEADS) => {
	const counts = {
		served: 0,
		partial: 0,
		blocked: 0,
		out_of_scope: 0,
		open: 0
	};
	for (const l of leads) counts[l.status] += 1;
	return counts;
};
// src/quantum/readiness.ts
var SITE_SUFFIX = /\s*\|\s*(Cirq|Google Quantum AI|OpenFermion|TensorFlow Quantum|Qualtran|Stim)\s*/gi;
var decodeTitle = (t) => t.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, "\"").replace(SITE_SUFFIX, " ").replace(/\s+/g, " ").trim();
/** The page each lead's source answered with, from the wave's source-page results. */
var pagesOf = (results) => {
	const pages = /* @__PURE__ */ new Map();
	for (const r of results) if (r.verifier === "source-page") {
		for (const id of r.leads) if (!pages.has(id)) {
			const t = /title="([^"]*)"/.exec(r.note ?? "")?.[1];
			pages.set(id, {
				status: r.status,
				title: t ? decodeTitle(t) : null,
				url: r.url
			});
		}
	}
	return pages;
};
/** One lead judged. `present` names the cleanup subjects the client measured as still present; `match` is the surface's matcher. */
var judgeOf = (l, pages, present, match, measured) => {
	const j = (cls, by) => ({
		lead: l.id,
		source: l.source,
		status: l.status,
		class: cls,
		by
	});
	if (l.status === "served") return j("served", `tool ${l.tool}`);
	const subjects = cleanupSubjectsOf(l);
	if (subjects) {
		const here = subjects.names.filter((n) => present.has(n));
		return here.length ? j("trial", `${here.join(", ")} is present again`) : j("refuted", `measured absent: ${subjects.names.join(", ")}`);
	}
	const page = pages.get(l.id);
	if (page && (page.status === 404 || page.status === 410)) return j("refuted", `HTTP ${page.status} at ${page.url}${measured ? ` on ${measured.slice(0, 10)}` : ""}`);
	if (l.status === "partial") return j("trial", `partial: ${l.tool} serves part; owes: ${l.reason ?? "unstated"}`);
	if (page?.title) {
		const m = match(page.title);
		if (m.verdict === "served") return j("served", `the match tool serves the page's title "${page.title}" by ${m.tool}`);
		const coverage = /covers (\d+)%/.exec(m.evidence[0] ?? "")?.[1];
		return j("refuted", `measured not served: the surface covers ${coverage ?? 0}% of the page's title "${page.title}" (HTTP ${page.status})${l.status === "out_of_scope" ? `; declared out of scope: ${l.reason}` : ""}`);
	}
	if (l.status === "out_of_scope") return j("refuted", `declared out of scope: ${l.reason ?? "no reason recorded"}`);
	return j("trial", l.reason ?? l.status);
};
var hostOf$1 = (source) => (/^(?:https?:\/\/)?([a-z0-9.-]+\.[a-z]{2,})/i.exec(source) ?? [])[1] ?? (/^[\w./-]+\.(ts|md|lean|json|ndjson)\b/.test(source) ? source.split("/")[0] : "qpu");
/** The sources as the unit's readiness door takes them: settled counts and open groups, nothing dropped. */
var sourcesOf = (judged, leads) => {
	const byHost = /* @__PURE__ */ new Map();
	for (const x of judged) {
		const host = hostOf$1(x.source);
		const s = byHost.get(host) ?? {
			source: host,
			settled: 0,
			open: []
		};
		if (x.class === "trial") s.open.push({
			what: `${x.lead}: ${leads.find((l) => l.id === x.lead)?.statement ?? ""}`,
			owes: x.by
		});
		else s.settled += 1;
		byHost.set(host, s);
	}
	return [...byHost.values()].map((s) => {
		const groups = /* @__PURE__ */ new Map();
		for (const o of s.open) {
			const g = groups.get(o.owes) ?? {
				n: 0,
				example: o.what
			};
			g.n += 1;
			groups.set(o.owes, g);
		}
		return {
			source: s.source,
			reached: true,
			settled: s.settled,
			why: s.open.length ? `${s.open.length} open of ${s.open.length + s.settled}` : "all settled",
			open: [...groups.entries()].map(([owes, g]) => ({
				source: s.source,
				what: `${g.n} lead(s), e.g. ${g.example}`,
				owes
			}))
		};
	});
};
/** The border plan: every discovered door that takes a statement and answers a verdict, with arguments filled from the theorem. */
var borderPlanOf = (discovery, probe) => {
	const calls = [];
	const unfillable = [];
	const statement = probe.statement ?? probe.key;
	for (const d of (discovery?.doors ?? []).filter((x) => discovery.capabilities.statementVerdict.includes(x.name) && x.readOnly !== false)) {
		const args = {};
		let ok = true;
		for (const p of /* @__PURE__ */ new Set([...d.required, ...d.takes])) if ([
			"statement",
			"claim",
			"input",
			"text",
			"q",
			"query",
			"message"
		].includes(p)) args[p] = `${probe.key}: ${statement}`;
		else if (p === "proof" || p === "key") args[p] = probe.key;
		else if (p === "deposits") args[p] = [{
			party: "qpu",
			proof: probe.key
		}, {
			party: "qpu",
			proof: statement
		}];
		else if (p === "theorems") args[p] = [probe.key];
		else if (d.required.includes(p)) ok = false;
		if (ok) calls.push({
			door: d.name,
			host: d.host,
			arguments: args
		});
		else unfillable.push({
			door: d.name,
			host: d.host,
			args: [],
			verdict: null,
			receipt: null,
			sealed: false,
			note: `requires ${d.required.join(", ")}: not fillable from a theorem`,
			refusal: null
		});
	}
	return {
		calls,
		unfillable
	};
};
/** The border read: every answer or refusal, and whether any door sealed or verified the theorem. */
var borderOf = (answers) => answers.map((x) => {
	if (x.refusal !== void 0) return {
		door: x.door,
		host: x.host,
		args: Object.keys(x.arguments ?? {}),
		verdict: null,
		receipt: null,
		sealed: false,
		note: null,
		refusal: x.refusal.slice(0, 300)
	};
	const a = x.answer ?? {};
	const verdict = typeof a.verdict === "string" ? a.verdict : typeof a.verdict?.verdict === "string" ? a.verdict.verdict : null;
	const sealed = a.deposited === true || a.sealed === true || a.verified === true || /^(VERIFIED|PROVEN)$/.test(verdict ?? "");
	return {
		door: x.door,
		host: x.host,
		args: Object.keys(x.arguments ?? {}),
		verdict,
		receipt: typeof a.receipt === "string" ? a.receipt : null,
		sealed,
		note: typeof a.note === "string" ? a.note : null,
		refusal: null
	};
});
/** The tree's own vortex: the doubling cycle and the trinities, each with its σ_10 reflection, as every tail is read. */
var TREE_VORTEX = {
	forward: [
		1,
		2,
		4,
		8,
		7,
		5,
		3,
		6,
		9
	],
	reflected: [
		9,
		8,
		6,
		2,
		3,
		5,
		7,
		4,
		1
	],
	trinities: [
		[
			3,
			6,
			9
		],
		[
			7,
			4,
			1
		],
		[
			2,
			5,
			8
		]
	],
	fixed: [5]
};
/** The unit's vortex doors read against the tree's: agreement is measured, a one-sided triad is named. */
var vortexOf = (unit) => {
	const r = unit.reflection;
	const sameSet = (a, b) => !!a && a.length === b.length && [...a].sort().join() === [...b].sort().join();
	const agree = !!r && sameSet(r.forward, TREE_VORTEX.forward) && sameSet(r.reflected, TREE_VORTEX.reflected) && r.involution === true && r.pairsSumTen === true && (r.reflected ?? []).every((x, i) => x + (r.forward ?? [])[i] === 10);
	const triadOneSided = Array.isArray(unit.triad) && unit.triad.join() === "3,6,9";
	return {
		agree,
		why: !r ? "the unit's reflection door was not reached" : agree ? "the unit's forward and reflected vortex are the tree's, an involution with pairs summing to 10" : `the unit\'s vortex differs: forward ${r.forward?.join(",")}, reflected ${r.reflected?.join(",")}`,
		triadOneSided,
		forward: r?.forward ?? null,
		reflected: r?.reflected ?? null,
		doubleTorusRoot: unit.doubleTorus?.root ?? null,
		dims: unit.doubleTorus?.dims?.length ?? 0
	};
};
/** The readiness page, from the judgement, the border and the unit's answers. */
var readinessPageOf = (p) => {
	const { answers: a } = p;
	return [
		"---",
		"title: Readiness",
		"order: 53",
		"---",
		"",
		"# The unit judges the tree",
		"",
		`Asked of the uuidna MCP at ${p.unit} by \`npm run next\` on ${p.date} through the \`readiness\` tool. The verdicts are the unit's; this tree only carries them.`,
		"",
		`## Release readiness: **${a.readiness.ready ? "ready" : "not ready"}**`,
		"",
		`${a.readiness.why}`,
		"",
		`Settled ${a.readiness.settled}; sources asked ${a.readiness.asked}, answered ${a.readiness.answered}; receipt \`${a.readiness.receipt}\`.`,
		"",
		"## Every lead judged by measurement",
		"",
		`Served ${p.classes.served}, refuted ${p.classes.refuted}, in trial ${p.classes.trial} of ${p.judged.length}. Served: a tool of this surface serves it, or the match tool serves the page's fetched title. Refuted: measured not served — the page is gone, a cleanup's subject stays absent, the surface covers too little of the page's own title to claim it, or the lead is declared out of scope. Trial: still owed. Page measurements from the verify step of ${p.measured?.slice(0, 10) ?? "no run yet"}.`,
		"",
		"| Lead in trial | Status | Owes |",
		"|---|---|---|",
		...p.judged.filter((x) => x.class === "trial").map((x) => `| ${x.lead} | ${x.status} | ${x.by.replace(/\|/g, "\\|")} |`),
		"",
		"<details><summary>The refuted, by measurement</summary>",
		"",
		"| Lead | Status | By |",
		"|---|---|---|",
		...p.judged.filter((x) => x.class === "refuted").map((x) => `| ${x.lead} | ${x.status} | ${x.by.replace(/\|/g, "\\|")} |`),
		"",
		"</details>",
		"",
		"| Source | Settled | Open |",
		"|---|---:|---:|",
		...p.sources.map((s) => `| ${s.source} | ${s.settled} | ${s.open.reduce((n, o) => n + Number(/^(\d+) lead/.exec(o.what)?.[1] ?? 1), 0)} |`),
		"",
		"## Auras",
		"",
		"The A432-tuned colour the unit folds from each example block's content address (hue steps by 432/12 = 36°; artistic, not physics, in the unit's own words).",
		"",
		"| Block | Example | Hue | HSL | CMYK |",
		"|---|---|---:|---|---|",
		...Object.entries(a.auras).map(([id, x]) => `| ${id} | ${x.example} | ${x.hue ?? "—"} | ${x.hsl ?? x.error ?? ""} | ${x.cmyk ? x.cmyk.join(", ") : ""} |`),
		"",
		"## Address agreement",
		"",
		`Probe \`${a.address.probe}\`: here ${a.address.here}, unit ${a.address.unit ?? "no answer"} — ${a.address.agree ? "agree" : "disagree"}. ${a.address.note}`,
		"",
		"## The border",
		"",
		`\`${p.probe.key}\` (${p.probe.statement ?? "statement not in the ledger yet"}) offered to every door discovery found that takes a statement and answers a verdict (${p.border.length} door(s), discovered ${p.discovered?.slice(0, 10) ?? "never"}). ${p.sealedBy.length ? `Sealed or verified by: ${p.sealedBy.join(", ")}.` : "No door sealed or verified it: qpu's proofs are not citable at the border; lead gap-theorems-unsealed stays blocked on the unit's doors."}`,
		"",
		"| Door | Asked with | Verdict | Receipt | Note or refusal |",
		"|---|---|---|---|---|",
		...p.border.map((b) => `| ${b.door} | ${b.args.join(", ") || "—"} | ${b.verdict ?? "—"} | ${b.receipt ?? "—"} | ${(b.note ?? b.refusal ?? "").replace(/\|/g, "\\|").slice(0, 200)} |`),
		"",
		"## The vortex, cross-checked with the unit",
		"",
		(() => {
			const v = vortexOf(a.vortex ?? {});
			return `${v.why}. ${v.triadOneSided ? "The unit's triad door answers 3, 6, 9 alone; this tree carries 7, 4, 1 beside it (triad_reflect)." : ""} ${v.doubleTorusRoot ? `The tree\'s ${v.dims} block addresses folded on the unit\'s double torus: root \`${v.doubleTorusRoot}\`.` : "The double torus was not reached."}`;
		})(),
		"",
		"## Rights",
		"",
		a.rights.drift.length ? `Drift between the unit's rights and this tree's licence module: ${a.rights.drift.join("; ")}` : `This tree's licence module matches the unit's rights (address ${a.rights.licenseAddress}, imprint ${a.rights.imprint}, receipt ${a.rights.receipt}).`,
		""
	].join("\n");
};
// src/quantum/i18n.ts
var LOCALES = {
	en: {
		name: "English",
		native: "English",
		filled: true
	},
	bg: {
		name: "Bulgarian",
		native: "Български",
		filled: true
	},
	de: {
		name: "German",
		native: "Deutsch",
		filled: false
	},
	fr: {
		name: "French",
		native: "Français",
		filled: false
	},
	es: {
		name: "Spanish",
		native: "Español",
		filled: false
	},
	it: {
		name: "Italian",
		native: "Italiano",
		filled: false
	},
	ru: {
		name: "Russian",
		native: "Русский",
		filled: false
	},
	zh: {
		name: "Chinese",
		native: "中文",
		filled: false
	},
	ja: {
		name: "Japanese",
		native: "日本語",
		filled: false
	},
	pt: {
		name: "Portuguese",
		native: "Português",
		filled: false
	},
	nl: {
		name: "Dutch",
		native: "Nederlands",
		filled: false
	}
};
var TABLES = { bg: {
	factor: "разложи",
	with: "с",
	qubits: "кубита",
	"how many": "колко",
	have: "има",
	numeral: "числител",
	numerals: "числители",
	tool: "инструмент",
	tools: "инструменти",
	example: "пример",
	examples: "примери",
	lead: "следа",
	leads: "следи",
	verifier: "проверител",
	verifiers: "проверители",
	block: "блок",
	receipt: "разписка",
	receipts: "разписки",
	previous: "предишен",
	next: "следващ",
	program: "програма",
	handle: "дръжка",
	tail: "опашка",
	seal: "печат",
	valid: "валиден",
	invalid: "невалиден",
	served: "обслужена",
	partial: "частична",
	blocked: "блокирана",
	open: "отворена",
	"out of scope": "извън обхват",
	impossible: "невъзможно",
	unknown: "неизвестно",
	verdict: "присъда",
	evidence: "доказателство",
	docket: "досие",
	entry: "запис",
	entries: "записи",
	mirror: "огледало",
	mirrors: "огледала",
	fragment: "фрагмент",
	fragments: "фрагменти",
	parity: "паритет",
	licence: "лиценз",
	license: "лиценз",
	author: "автор",
	family: "семейство",
	door: "врата",
	doors: "врати",
	address: "адрес",
	content: "съдържание",
	chain: "верига",
	step: "стъпка",
	steps: "стъпки",
	statement: "твърдение",
	reason: "причина",
	"translate later": "превод по-късно",
	decided: "решено",
	walk: "обход",
	page: "страница",
	arguments: "аргументи",
	nibble: "полубайт",
	message: "съобщение",
	executed: "изпълнено",
	loading: "зареждане",
	none: "няма",
	version: "версия",
	variant: "вариант",
	hue: "нюанс",
	here: "тук",
	chooses: "избира",
	the: "",
	of: "на",
	"commercial use by licence": "търговска употреба по лиценз",
	"caught": "уловено",
	"this path is not a walk": "този път не е обход",
	"by the match tool": "от инструмента за съвпадение"
} };
var inverted = (t) => Object.fromEntries(Object.entries(t).filter(([, v]) => v).map(([k, v]) => [v, k]));
/** Translate text between two locales by vocabulary, longest phrase first, case-aware; report every word no table knows. */
var translateOf = (text, from, to) => {
	if (from === to) return {
		text,
		untranslated: [],
		via: "identity"
	};
	const table = from === "en" ? TABLES[to] : to === "en" ? TABLES[from] ? inverted(TABLES[from]) : void 0 : void 0;
	if (!table) return {
		text,
		untranslated: [...new Set(text.toLowerCase().match(/[\p{L}]+/gu) ?? [])],
		via: `no table for ${from}→${to}: a lead; served as is`
	};
	const phrases = Object.keys(table).sort((a, b) => b.length - a.length);
	let out = text;
	const hit = /* @__PURE__ */ new Set();
	for (const ph of phrases) {
		const re = new RegExp(`(?<![\\p{L}])${ph.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}])`, "giu");
		out = out.replace(re, (m) => {
			hit.add(ph);
			const v = table[ph];
			return m[0] === m[0].toUpperCase() && v ? v[0].toUpperCase() + v.slice(1) : v;
		});
	}
	const known = new Set(Object.keys(table).flatMap((k) => k.split(" ")).concat(Object.values(table).flatMap((v) => v.split(" "))));
	const untranslated = [...new Set((out.match(/[\p{L}]+/gu) ?? []).map((w) => w.toLowerCase()))].filter((w) => !known.has(w) && !/^[0-9a-f]{8,}$/.test(w));
	return {
		text: out.replace(/\s{2,}/g, " ").trim(),
		untranslated,
		via: `vocabulary ${from}→${to}, ${hit.size} phrase(s)`
	};
};
/** The Glagolitic numerals, additive like the Cyrillic system: each letter carries the value of its alphabetic place, units,
* tens and hundreds, then Ⱍ for 1000 (en.wikipedia.org/wiki/Glagolitic_numerals). Values above 1000 are not in this table:
* a lead, never guessed. */
var GLAGOLITIC = {
	"Ⰰ": 1,
	"Ⰱ": 2,
	"Ⰲ": 3,
	"Ⰳ": 4,
	"Ⰴ": 5,
	"Ⰵ": 6,
	"Ⰶ": 7,
	"Ⰷ": 8,
	"Ⰸ": 9,
	"Ⰺ": 10,
	"Ⰻ": 20,
	"Ⰼ": 30,
	"Ⰽ": 40,
	"Ⰾ": 50,
	"Ⰿ": 60,
	"Ⱀ": 70,
	"Ⱁ": 80,
	"Ⱂ": 90,
	"Ⱃ": 100,
	"Ⱄ": 200,
	"Ⱅ": 300,
	"Ⱆ": 400,
	"Ⱇ": 500,
	"Ⱈ": 600,
	"Ⱉ": 700,
	"Ⱋ": 800,
	"Ⱌ": 900,
	"Ⱍ": 1e3
};
var GLAGOLITIC_RUN = new RegExp(`[${Object.keys(GLAGOLITIC).map((g) => g + g.toLowerCase()).join("")}]+`, "gu");
/** Every run of Glagolitic letters in a text read as one additive numeral and written as digits; the runs are reported. */
var numeralsOf = (text) => {
	const numerals = [];
	return {
		text: text.replace(GLAGOLITIC_RUN, (glyphs) => {
			const value = [...glyphs].reduce((n, g) => n + GLAGOLITIC[g.toUpperCase()], 0);
			numerals.push({
				glyphs,
				value
			});
			return String(value);
		}),
		numerals
	};
};
// src/quantum/theorems-index.ts
var THEOREMS = [
	{
		"key": "Qpu.CausalInference.ate_bounded",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (s : Qpu.CausalInference.Study),   s.bounded →     s.sumY s.treated * s.control.length ≤         s.sumY s.control * s.treated.length + s.ymax * s.treated.length * s.control.length ∧       s.sumY s.control * s.treated.length ≤         s.sumY s.treated * s.control.length + s.ymax * s.treated.length * s.control.length"
	},
	{
		"key": "Qpu.CausalInference.children_gt",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {g : Qpu.CausalInference.Dag}, g.ordered = true → ∀ {c v : Nat}, c ∈ g.children v → v < c"
	},
	{
		"key": "Qpu.CausalInference.common_support",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (s : Qpu.CausalInference.Study), s.overlap → s.units ≠ [] → s.treated ≠ [] ∧ s.control ≠ []"
	},
	{
		"key": "Qpu.CausalInference.do_consistent",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {m : Qpu.CausalInference.Scm},   m.ordered = true → ∀ (u : Nat → Nat) (x v : Nat), (m.doOp x (m.value u x)).value u v = m.value u v"
	},
	{
		"key": "Qpu.CausalInference.do_ordered",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {m : Qpu.CausalInference.Scm},   m.ordered = true → ∀ (x c : Nat), (m.doOp x c).vars = m.vars ∧ (m.doOp x c).ordered = true"
	},
	{
		"key": "Qpu.CausalInference.do_parents_ne",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (m : Qpu.CausalInference.Scm) {x v : Nat}, v ≠ x → ∀ (c : Nat), (m.doOp x c).parents v = m.parents v"
	},
	{
		"key": "Qpu.CausalInference.do_parents_self",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (m : Qpu.CausalInference.Scm) (x c : Nat), (m.doOp x c).parents x = []"
	},
	{
		"key": "Qpu.CausalInference.do_pre_treatment",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {m : Qpu.CausalInference.Scm},   m.ordered = true → ∀ (u : Nat → Nat) {x v : Nat}, v < x → ∀ (c : Nat), (m.doOp x c).value u v = m.value u v"
	},
	{
		"key": "Qpu.CausalInference.do_valueF_consistent",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {m : Qpu.CausalInference.Scm},   m.ordered = true → ∀ (u : Nat → Nat) (x f v : Nat), v < f → (m.doOp x (m.value u x)).valueF u f v = m.valueF u f v"
	},
	{
		"key": "Qpu.CausalInference.do_valueF_exogenous",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (m : Qpu.CausalInference.Scm) (u : Nat → Nat) {x : Nat},   m.exogenous x → ∀ (c f v : Nat), (m.doOp x c).valueF u f v = m.valueF (fun w => if w = x then c else u w) f v"
	},
	{
		"key": "Qpu.CausalInference.do_valueF_pre",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {m : Qpu.CausalInference.Scm},   m.ordered = true → ∀ (u : Nat → Nat) (x c f v : Nat), v < x → (m.doOp x c).valueF u f v = m.valueF u f v"
	},
	{
		"key": "Qpu.CausalInference.do_value_self",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (m : Qpu.CausalInference.Scm) (u : Nat → Nat) (x c : Nat), (m.doOp x c).value u x = c"
	},
	{
		"key": "Qpu.CausalInference.exogenous_do_eq_see",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (m : Qpu.CausalInference.Scm) (u : Nat → Nat) {x : Nat},   m.exogenous x → ∀ (c v : Nat), (m.doOp x c).value u v = m.value (fun w => if w = x then c else u w) v"
	},
	{
		"key": "Qpu.CausalInference.filter_filter_ne",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {x v : Nat},   v ≠ x →     ∀ (l : List (Nat × Nat)),       List.filter (fun e => e.snd == v) (List.filter (fun e => !e.snd == x) l) = List.filter (fun e => e.snd == v) l"
	},
	{
		"key": "Qpu.CausalInference.filter_filter_not",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {α : Type} (p : α → Bool) (l : List α), List.filter p (List.filter (fun a => !p a) l) = []"
	},
	{
		"key": "Qpu.CausalInference.hte_bounded_average",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (y₁ y₀ : Nat → Nat) (d : Nat) (l : List Nat),   (∀ (u : Nat), u ∈ l → y₁ u ≤ y₀ u + d) → (List.map y₁ l).sum ≤ (List.map y₀ l).sum + d * l.length"
	},
	{
		"key": "Qpu.CausalInference.length_filter_partition",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {α : Type} (p : α → Bool) (l : List α), (List.filter p l).length + (List.filter (fun a => !p a) l).length = l.length"
	},
	{
		"key": "Qpu.CausalInference.mediation_decomposition",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {m : Qpu.CausalInference.Scm},   m.ordered = true →     ∀ (u : Nat → Nat) (x med y : Nat), m.totalEffect u x y = m.directEffect u x med y + m.indirectEffect u x med y"
	},
	{
		"key": "Qpu.CausalInference.mem_children",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {g : Qpu.CausalInference.Dag} {c v : Nat}, c ∈ g.children v ↔ (v, c) ∈ g.edges"
	},
	{
		"key": "Qpu.CausalInference.mem_parents",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {g : Qpu.CausalInference.Dag} {p v : Nat}, p ∈ g.parents v ↔ (p, v) ∈ g.edges"
	},
	{
		"key": "Qpu.CausalInference.mem_stratum",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {s : Qpu.CausalInference.Study} {u k : Nat}, u ∈ s.stratum k ↔ u ∈ s.units ∧ s.cov u = k"
	},
	{
		"key": "Qpu.CausalInference.no_cycle",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {g : Qpu.CausalInference.Dag}, g.ordered = true → ∀ (a : Nat) (l : List Nat), g.path (a :: (l ++ [a])) = false"
	},
	{
		"key": "Qpu.CausalInference.ordered_edge",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {g : Qpu.CausalInference.Dag}, g.ordered = true → ∀ {e : Nat × Nat}, e ∈ g.edges → e.fst < e.snd ∧ e.snd < g.vars"
	},
	{
		"key": "Qpu.CausalInference.overlap_match",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (s : Qpu.CausalInference.Study), s.overlap → ∀ {t : Nat}, t ∈ s.treated → ∃ c, c ∈ s.control ∧ s.cov c = s.cov t"
	},
	{
		"key": "Qpu.CausalInference.parent_not_descendant",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {g : Qpu.CausalInference.Dag},   g.ordered = true → ∀ {p v : Nat}, p ∈ g.parents v → ∀ (l : List Nat), g.path (v :: (l ++ [p])) = false"
	},
	{
		"key": "Qpu.CausalInference.parents_backdoor",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {g : Qpu.CausalInference.Dag},   g.ordered = true →     ∀ (x : Nat),       (∀ (p : List Nat), g.backdoorPath x p → Qpu.CausalInference.blocks (g.parents x) p) ∧         ∀ (w : Nat), w ∈ g.parents x → ∀ (l : List Nat), g.path (x :: (l ++ [w])) = false"
	},
	{
		"key": "Qpu.CausalInference.parents_lt",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {g : Qpu.CausalInference.Dag}, g.ordered = true → ∀ {p v : Nat}, p ∈ g.parents v → p < v"
	},
	{
		"key": "Qpu.CausalInference.parents_lt_vars",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {g : Qpu.CausalInference.Dag}, g.ordered = true → ∀ {p v : Nat}, p ∈ g.parents v → p < g.vars"
	},
	{
		"key": "Qpu.CausalInference.path_lt",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {g : Qpu.CausalInference.Dag},   g.ordered = true → ∀ (a : Nat) (l : List Nat), g.path (a :: l) = true → ∀ (b : Nat), b ∈ l → a < b"
	},
	{
		"key": "Qpu.CausalInference.positivity",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (s : Qpu.CausalInference.Study),   s.overlap →     ∀ {u : Nat},       u ∈ s.units → 0 < (s.treatedIn (s.cov u)).length ∧ (s.treatedIn (s.cov u)).length < (s.stratum (s.cov u)).length"
	},
	{
		"key": "Qpu.CausalInference.rd_no_overlap",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (s : Qpu.CausalInference.Study) {c : Nat}, s.sharpRd c → ∀ (k : Nat), ¬(s.treatedIn k ≠ [] ∧ s.controlIn k ≠ [])"
	},
	{
		"key": "Qpu.CausalInference.rd_not_overlap",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (s : Qpu.CausalInference.Study) {c : Nat}, s.sharpRd c → s.units ≠ [] → ¬s.overlap"
	},
	{
		"key": "Qpu.CausalInference.sum_le_mul_length",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (f : Nat → Nat) (b : Nat) (l : List Nat), (∀ (a : Nat), a ∈ l → f a ≤ b) → (List.map f l).sum ≤ b * l.length"
	},
	{
		"key": "Qpu.CausalInference.treated_control_partition",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (s : Qpu.CausalInference.Study), s.treated.length + s.control.length = s.units.length"
	},
	{
		"key": "Qpu.CausalInference.triangle_confounded",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ (u : Nat → Nat),   Qpu.CausalInference.triangle.value (fun x => 1) 2 = 2 ∧     Qpu.CausalInference.triangle.value (fun x => 0) 2 = 0 ∧       (Qpu.CausalInference.triangle.doOp 1 1).value u 2 = (Qpu.CausalInference.triangle.doOp 1 0).value u 2 + 1"
	},
	{
		"key": "Qpu.CausalInference.triangle_shape",
		"module": "Qpu.Leads.CausalInference",
		"statement": "Qpu.CausalInference.triangle.ordered = true ∧   Qpu.CausalInference.triangle.parents 1 = [0] ∧ Qpu.CausalInference.triangle.exogenous 0"
	},
	{
		"key": "Qpu.CausalInference.valueF_stable",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {m : Qpu.CausalInference.Scm},   m.ordered = true → ∀ (u : Nat → Nat) (f₁ v : Nat), v < f₁ → ∀ (f₂ : Nat), v < f₂ → m.valueF u f₁ v = m.valueF u f₂ v"
	},
	{
		"key": "Qpu.CausalInference.value_eq_valueF",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {m : Qpu.CausalInference.Scm}, m.ordered = true → ∀ (u : Nat → Nat) {f v : Nat}, v < f → m.value u v = m.valueF u f v"
	},
	{
		"key": "Qpu.CausalInference.vars_pos_of_edge",
		"module": "Qpu.Leads.CausalInference",
		"statement": "∀ {g : Qpu.CausalInference.Dag}, g.ordered = true → ∀ {e : Nat × Nat}, e ∈ g.edges → 0 < g.vars"
	},
	{
		"key": "Qpu.Federated.avgV_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (lo hi : Int) (us : List (Qpu.Federated.Vec d)),   0 < us.length →     ∀ (i : Fin d),       (∀ (u : Qpu.Federated.Vec d), u ∈ us → lo ≤ u i ∧ u i ≤ hi) →         lo ≤ Qpu.Federated.avgV us i ∧ Qpu.Federated.avgV us i ≤ hi"
	},
	{
		"key": "Qpu.Federated.avgV_replicate",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (k : Nat), 0 < k → ∀ (u : Qpu.Federated.Vec d), Qpu.Federated.avgV (List.replicate k u) = u"
	},
	{
		"key": "Qpu.Federated.avgZ_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (lo hi : Int) (l : List Int),   0 < l.length → (∀ (x : Int), x ∈ l → lo ≤ x ∧ x ≤ hi) → lo ≤ Qpu.Federated.avgZ l ∧ Qpu.Federated.avgZ l ≤ hi"
	},
	{
		"key": "Qpu.Federated.avgZ_replicate",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (k : Nat), 0 < k → ∀ (x : Int), Qpu.Federated.avgZ (List.replicate k x) = x"
	},
	{
		"key": "Qpu.Federated.byzantine_lattice",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (l : List Int) (lo hi : Int),   l.length = faces →     List.countP (Qpu.Federated.outside lo hi) l ≤ hexbit → lo ≤ Qpu.Federated.median l ∧ Qpu.Federated.median l ≤ hi"
	},
	{
		"key": "Qpu.Federated.byzantine_median",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (l : List Int) (lo hi : Int) (malicious : Nat),   0 < l.length →     List.countP (Qpu.Federated.outside lo hi) l ≤ malicious →       3 * malicious < l.length → lo ≤ Qpu.Federated.median l ∧ Qpu.Federated.median l ≤ hi"
	},
	{
		"key": "Qpu.Federated.byzantine_medianV",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (us : List (Qpu.Federated.Vec d)) (lo hi : Qpu.Federated.Vec d) (malicious : Nat),   0 < us.length →     List.countP (fun u => !Qpu.Federated.inBox lo hi u) us ≤ malicious →       3 * malicious < us.length → ∀ (i : Fin d), lo i ≤ Qpu.Federated.medianV us i ∧ Qpu.Federated.medianV us i ≤ hi i"
	},
	{
		"key": "Qpu.Federated.byzantine_trimmedMean",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (l : List Int) (lo hi : Int) (malicious : Nat),   List.countP (Qpu.Federated.outside lo hi) l ≤ malicious →     3 * malicious < l.length → lo ≤ Qpu.Federated.trimmedMean malicious l ∧ Qpu.Federated.trimmedMean malicious l ≤ hi"
	},
	{
		"key": "Qpu.Federated.clipV_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (c : Nat) (u : Qpu.Federated.Vec d) (i : Fin d),   -↑c ≤ Qpu.Federated.clipV c u i ∧ Qpu.Federated.clipV c u i ≤ ↑c"
	},
	{
		"key": "Qpu.Federated.clipV_idem",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (c : Nat) (u : Qpu.Federated.Vec d),   Qpu.Federated.clipV c (Qpu.Federated.clipV c u) = Qpu.Federated.clipV c u"
	},
	{
		"key": "Qpu.Federated.clipZ_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (c : Nat) (x : Int), -↑c ≤ Qpu.Federated.clipZ c x ∧ Qpu.Federated.clipZ c x ≤ ↑c"
	},
	{
		"key": "Qpu.Federated.clipZ_idem",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (c : Nat) (x : Int), Qpu.Federated.clipZ c (Qpu.Federated.clipZ c x) = Qpu.Federated.clipZ c x"
	},
	{
		"key": "Qpu.Federated.clipZ_ne_iff",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (c : Nat) (x : Int), Qpu.Federated.clipZ c x ≠ x ↔ x < -↑c ∨ ↑c < x"
	},
	{
		"key": "Qpu.Federated.clipZ_of_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (c : Nat) (x : Int), -↑c ≤ x ∧ x ≤ ↑c → Qpu.Federated.clipZ c x = x"
	},
	{
		"key": "Qpu.Federated.clipped_avg_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (c : Nat) (us : List (Qpu.Federated.Vec d)),   0 < us.length →     ∀ (i : Fin d),       -↑c ≤ Qpu.Federated.avgV (List.map (Qpu.Federated.clipV c) us) i ∧         Qpu.Federated.avgV (List.map (Qpu.Federated.clipV c) us) i ≤ ↑c"
	},
	{
		"key": "Qpu.Federated.clipped_sum_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (c : Nat) (us : List (Qpu.Federated.Vec d)) (i : Fin d),   -(↑c * ↑us.length) ≤ Qpu.Federated.sumV (List.map (Qpu.Federated.clipV c) us) i ∧     Qpu.Federated.sumV (List.map (Qpu.Federated.clipV c) us) i ≤ ↑c * ↑us.length"
	},
	{
		"key": "Qpu.Federated.communication_lower_bound",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (rounds clients k : Nat), 0 < k → rounds * clients ≤ Qpu.Federated.totalMessages rounds clients k"
	},
	{
		"key": "Qpu.Federated.countP_gt_le_outside",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (l : List Int) (lo hi : Int), List.countP (fun x => decide (hi < x)) l ≤ List.countP (Qpu.Federated.outside lo hi) l"
	},
	{
		"key": "Qpu.Federated.countP_lt_le_outside",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (l : List Int) (lo hi : Int), List.countP (fun x => decide (x < lo)) l ≤ List.countP (Qpu.Federated.outside lo hi) l"
	},
	{
		"key": "Qpu.Federated.dropout_sum_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (c : Nat) (us active : List (Qpu.Federated.Vec d)),   active.Sublist us →     ∀ (i : Fin d),       -(↑c * ↑us.length) ≤ Qpu.Federated.sumV (List.map (Qpu.Federated.clipV c) active) i ∧         Qpu.Federated.sumV (List.map (Qpu.Federated.clipV c) active) i ≤ ↑c * ↑us.length"
	},
	{
		"key": "Qpu.Federated.halve_le",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (r L : Nat), Qpu.Federated.halve r L ≤ L"
	},
	{
		"key": "Qpu.Federated.halving_converges",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (r L : Nat), L < mintOf r → Qpu.Federated.halve r L = 0"
	},
	{
		"key": "Qpu.Federated.heterogeneity_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (c : Nat) (us : List (Qpu.Federated.Vec d)),   0 < us.length →     ∀ (u : Qpu.Federated.Vec d) (i : Fin d),       -(2 * ↑c) ≤ Qpu.Federated.clipV c u i - Qpu.Federated.avgV (List.map (Qpu.Federated.clipV c) us) i ∧         Qpu.Federated.clipV c u i - Qpu.Federated.avgV (List.map (Qpu.Federated.clipV c) us) i ≤ 2 * ↑c"
	},
	{
		"key": "Qpu.Federated.lattice_instance",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "3 * hexbit < faces"
	},
	{
		"key": "Qpu.Federated.lt_mintOf_self",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (L : Nat), L < mintOf L"
	},
	{
		"key": "Qpu.Federated.median_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (l : List Int) (lo hi : Int) (f : Nat),   0 < l.length →     List.countP (fun x => decide (x < lo)) l ≤ f →       List.countP (fun x => decide (hi < x)) l ≤ f →         2 * f < l.length → lo ≤ Qpu.Federated.median l ∧ Qpu.Federated.median l ≤ hi"
	},
	{
		"key": "Qpu.Federated.median_eq_getElem",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (l : List Int) (hpos : 0 < l.length), Qpu.Federated.median l = (Qpu.Federated.sortZ l)[l.length / 2]"
	},
	{
		"key": "Qpu.Federated.mem_map_clipV_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (c : Nat) (us : List (Qpu.Federated.Vec d)) (i : Fin d) (x : Int),   x ∈ Qpu.Federated.coord i (List.map (Qpu.Federated.clipV c) us) → -↑c ≤ x ∧ x ≤ ↑c"
	},
	{
		"key": "Qpu.Federated.noised_clipped_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (c b : Nat) (us : List (Qpu.Federated.Vec d)) (i : Fin d) (e : Int),   -↑b ≤ e ∧ e ≤ ↑b →     -(↑c * ↑us.length + ↑b) ≤ Qpu.Federated.sumV (List.map (Qpu.Federated.clipV c) us) i + e ∧       Qpu.Federated.sumV (List.map (Qpu.Federated.clipV c) us) i + e ≤ ↑c * ↑us.length + ↑b"
	},
	{
		"key": "Qpu.Federated.noised_privacy",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (a a' : Int) (b : Nat),   -↑b ≤ a - a' ∧ a - a' ≤ ↑b → ∃ e e', (-↑b ≤ e ∧ e ≤ ↑b) ∧ (-↑b ≤ e' ∧ e' ≤ ↑b) ∧ a + e = a' + e'"
	},
	{
		"key": "Qpu.Federated.noised_utility",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (a e : Int) (b : Nat), -↑b ≤ e ∧ e ≤ ↑b → -↑b ≤ a + e - a ∧ a + e - a ≤ ↑b"
	},
	{
		"key": "Qpu.Federated.pairwise_mask_cancels",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (u v m : Qpu.Federated.Vec d),   Qpu.Federated.addV (Qpu.Federated.addV u m) (Qpu.Federated.subV v m) = Qpu.Federated.addV u v"
	},
	{
		"key": "Qpu.Federated.privacy_utility_tradeoff",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (a a' e e' : Int) (b : Nat),   -↑b ≤ e ∧ e ≤ ↑b → -↑b ≤ e' ∧ e' ≤ ↑b → a + e = a' + e' → -(2 * ↑b) ≤ a - a' ∧ a - a' ≤ 2 * ↑b"
	},
	{
		"key": "Qpu.Federated.quantization_error",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (q : Nat),   0 < q →     ∀ (x : Int),       0 ≤ x - Qpu.Federated.dequantize q (Qpu.Federated.quantize q x) ∧         x - Qpu.Federated.dequantize q (Qpu.Federated.quantize q x) < ↑q"
	},
	{
		"key": "Qpu.Federated.quantize_clipped_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (q c : Nat),   0 < q →     ∀ (x : Int),       -↑c / ↑q ≤ Qpu.Federated.quantize q (Qpu.Federated.clipZ c x) ∧         Qpu.Federated.quantize q (Qpu.Federated.clipZ c x) ≤ ↑c / ↑q"
	},
	{
		"key": "Qpu.Federated.rounds_suffice",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (L : Nat), Qpu.Federated.halve L L = 0"
	},
	{
		"key": "Qpu.Federated.secureAggregate_eq",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (cs : List (Qpu.Federated.Vec d × List (Qpu.Federated.Vec d))),   Qpu.Federated.secureAggregate cs = Qpu.Federated.sumV (List.map Prod.fst cs)"
	},
	{
		"key": "Qpu.Federated.shares_consistent",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (s s' m : Qpu.Federated.Vec d) (ms : List (Qpu.Federated.Vec d)),   ∃ m',     (Qpu.Federated.shares s' (m' :: ms)).head? = (Qpu.Federated.shares s (m :: ms)).head? ∧       (Qpu.Federated.shares s' (m' :: ms)).tail.tail = (Qpu.Federated.shares s (m :: ms)).tail.tail"
	},
	{
		"key": "Qpu.Federated.shares_length",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (s : Qpu.Federated.Vec d) (ms : List (Qpu.Federated.Vec d)),   (Qpu.Federated.shares s ms).length = ms.length + 1"
	},
	{
		"key": "Qpu.Federated.shares_tail_independent",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (s s' : Qpu.Federated.Vec d) (ms : List (Qpu.Federated.Vec d)),   (Qpu.Federated.shares s ms).tail = (Qpu.Federated.shares s' ms).tail"
	},
	{
		"key": "Qpu.Federated.shares_traffic",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (k : Nat) (cs : List (Qpu.Federated.Vec d × List (Qpu.Federated.Vec d))),   (∀ (c : Qpu.Federated.Vec d × List (Qpu.Federated.Vec d)), c ∈ cs → c.snd.length + 1 = k) →     (List.flatMap (fun c => Qpu.Federated.shares c.fst c.snd) cs).length = cs.length * k"
	},
	{
		"key": "Qpu.Federated.sortZ_length",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (l : List Int), (Qpu.Federated.sortZ l).length = l.length"
	},
	{
		"key": "Qpu.Federated.sortZ_perm",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (l : List Int), (Qpu.Federated.sortZ l).Perm l"
	},
	{
		"key": "Qpu.Federated.sortZ_sorted",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (l : List Int), List.Pairwise (fun x1 x2 => x1 ≤ x2) (Qpu.Federated.sortZ l)"
	},
	{
		"key": "Qpu.Federated.sorted_lower",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {s : List Int},   List.Pairwise (fun x1 x2 => x1 ≤ x2) s →     ∀ (lo : Int) {k : Nat} (hk : k < s.length), List.countP (fun x => decide (x < lo)) s ≤ k → lo ≤ s[k]"
	},
	{
		"key": "Qpu.Federated.sorted_upper",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {s : List Int},   List.Pairwise (fun x1 x2 => x1 ≤ x2) s →     ∀ (hi : Int) {k : Nat} (hk : k < s.length), List.countP (fun x => decide (hi < x)) s ≤ s.length - 1 - k → s[k] ≤ hi"
	},
	{
		"key": "Qpu.Federated.sumV_append",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (us vs : List (Qpu.Federated.Vec d)),   Qpu.Federated.sumV (us ++ vs) = Qpu.Federated.addV (Qpu.Federated.sumV us) (Qpu.Federated.sumV vs)"
	},
	{
		"key": "Qpu.Federated.sumV_cons",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (u : Qpu.Federated.Vec d) (us : List (Qpu.Federated.Vec d)),   Qpu.Federated.sumV (u :: us) = Qpu.Federated.addV u (Qpu.Federated.sumV us)"
	},
	{
		"key": "Qpu.Federated.sumV_nil",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat}, Qpu.Federated.sumV [] = Qpu.Federated.zeroV"
	},
	{
		"key": "Qpu.Federated.sumV_perm",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} {us vs : List (Qpu.Federated.Vec d)}, us.Perm vs → Qpu.Federated.sumV us = Qpu.Federated.sumV vs"
	},
	{
		"key": "Qpu.Federated.sumV_shares",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {d : Nat} (s : Qpu.Federated.Vec d) (ms : List (Qpu.Federated.Vec d)),   Qpu.Federated.sumV (Qpu.Federated.shares s ms) = s"
	},
	{
		"key": "Qpu.Federated.sumZ_append",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (a b : List Int), Qpu.Federated.sumZ (a ++ b) = Qpu.Federated.sumZ a + Qpu.Federated.sumZ b"
	},
	{
		"key": "Qpu.Federated.sumZ_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (lo hi : Int) (l : List Int),   (∀ (x : Int), x ∈ l → lo ≤ x ∧ x ≤ hi) → lo * ↑l.length ≤ Qpu.Federated.sumZ l ∧ Qpu.Federated.sumZ l ≤ hi * ↑l.length"
	},
	{
		"key": "Qpu.Federated.sumZ_cons",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (x : Int) (xs : List Int), Qpu.Federated.sumZ (x :: xs) = x + Qpu.Federated.sumZ xs"
	},
	{
		"key": "Qpu.Federated.sumZ_nil",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "Qpu.Federated.sumZ [] = 0"
	},
	{
		"key": "Qpu.Federated.sumZ_perm",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ {a b : List Int}, a.Perm b → Qpu.Federated.sumZ a = Qpu.Federated.sumZ b"
	},
	{
		"key": "Qpu.Federated.sumZ_replicate",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (k : Nat) (x : Int), Qpu.Federated.sumZ (List.replicate k x) = x * ↑k"
	},
	{
		"key": "Qpu.Federated.trimmedMean_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (l : List Int) (lo hi : Int) (f : Nat),   List.countP (fun x => decide (x < lo)) l ≤ f →     List.countP (fun x => decide (hi < x)) l ≤ f →       2 * f < l.length → lo ≤ Qpu.Federated.trimmedMean f l ∧ Qpu.Federated.trimmedMean f l ≤ hi"
	},
	{
		"key": "Qpu.Federated.trimmed_length",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (f : Nat) (l : List Int), 2 * f ≤ l.length → (Qpu.Federated.trimmed f l).length = l.length - 2 * f"
	},
	{
		"key": "Qpu.Federated.trimmed_mem_bounded",
		"module": "Qpu.Leads.FederatedLearning",
		"statement": "∀ (l : List Int) (lo hi : Int) (f : Nat),   List.countP (fun x => decide (x < lo)) l ≤ f →     List.countP (fun x => decide (hi < x)) l ≤ f →       2 * f < l.length → ∀ (x : Int), x ∈ Qpu.Federated.trimmed f l → lo ≤ x ∧ x ≤ hi"
	},
	{
		"key": "Qpu.Harmonic.L1_range",
		"module": "Qpu.Leads.HarmonicClosure",
		"statement": "∀ (t : Nat), 1 ≤ Qpu.Harmonic.L1 t ∧ Qpu.Harmonic.L1 t ≤ 60"
	},
	{
		"key": "Qpu.Harmonic.L2_range",
		"module": "Qpu.Leads.HarmonicClosure",
		"statement": "∀ (t : Nat), 1 ≤ Qpu.Harmonic.L2 t ∧ Qpu.Harmonic.L2 t ≤ 30"
	},
	{
		"key": "Qpu.Harmonic.closing_count",
		"module": "Qpu.Leads.HarmonicClosure",
		"statement": "(List.filter (fun t => Qpu.Harmonic.Involute t == 100) (List.range 107)).length = 18"
	},
	{
		"key": "Qpu.Harmonic.closing_set",
		"module": "Qpu.Leads.HarmonicClosure",
		"statement": "List.filter (fun t => Qpu.Harmonic.Involute t == 100) (List.range 107) =   [23, 24, 25, 26, 27, 28, 53, 54, 55, 56, 57, 58, 83, 84, 85, 86, 87, 88]"
	},
	{
		"key": "Qpu.Harmonic.involute_eq_100_iff",
		"module": "Qpu.Leads.HarmonicClosure",
		"statement": "∀ (t : Nat), Qpu.Harmonic.Involute t = 100 ↔ 23 ≤ t % 60 ∧ t % 60 ≤ 28 ∨ 53 ≤ t % 60 ∧ t % 60 ≤ 58"
	},
	{
		"key": "Qpu.Harmonic.involute_values",
		"module": "Qpu.Leads.HarmonicClosure",
		"statement": "∀ (t : Nat), Qpu.Harmonic.Involute t = 100 ∨ Qpu.Harmonic.Involute t = 0"
	},
	{
		"key": "Qpu.ProgramSynthesis.cegis_eliminates",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {e : Qpu.ProgramSynthesis.Expr} {ex : Qpu.ProgramSynthesis.Example} {c : List Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.eval e ex.fst ≠ ex.snd → ¬e ∈ Qpu.ProgramSynthesis.prune ex c"
	},
	{
		"key": "Qpu.ProgramSynthesis.checkLower_complete",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {e : Qpu.ProgramSynthesis.Expr} {bound : Nat},   (∀ (x : Nat), bound ≤ Qpu.ProgramSynthesis.eval e x) → Qpu.ProgramSynthesis.checkLower e bound = true"
	},
	{
		"key": "Qpu.ProgramSynthesis.checkLower_sound",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {e : Qpu.ProgramSynthesis.Expr} {bound : Nat},   Qpu.ProgramSynthesis.checkLower e bound = true → ∀ (x : Nat), bound ≤ Qpu.ProgramSynthesis.eval e x"
	},
	{
		"key": "Qpu.ProgramSynthesis.complete_complete",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {k : Nat} {sk : Qpu.ProgramSynthesis.Sketch} {s : Qpu.ProgramSynthesis.Spec} {w : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.satisfies (Qpu.ProgramSynthesis.fill sk w) s →     Qpu.ProgramSynthesis.size w ≤ k → ∃ e, Qpu.ProgramSynthesis.complete k sk s = some e"
	},
	{
		"key": "Qpu.ProgramSynthesis.complete_hole",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (k : Nat) (s : Qpu.ProgramSynthesis.Spec),   Qpu.ProgramSynthesis.complete k Qpu.ProgramSynthesis.Sketch.hole s = Qpu.ProgramSynthesis.synth k s"
	},
	{
		"key": "Qpu.ProgramSynthesis.complete_sound",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {k : Nat} {sk : Qpu.ProgramSynthesis.Sketch} {s : Qpu.ProgramSynthesis.Spec} {e : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.complete k sk s = some e → Qpu.ProgramSynthesis.satisfies (Qpu.ProgramSynthesis.fill sk e) s"
	},
	{
		"key": "Qpu.ProgramSynthesis.counterexample_of_not_satisfies",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {e : Qpu.ProgramSynthesis.Expr} {s : Qpu.ProgramSynthesis.Spec},   ¬Qpu.ProgramSynthesis.satisfies e s → ∃ ex, ex ∈ s ∧ Qpu.ProgramSynthesis.eval e ex.fst ≠ ex.snd"
	},
	{
		"key": "Qpu.ProgramSynthesis.double_equiv",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "Qpu.ProgramSynthesis.Equiv (Qpu.ProgramSynthesis.Expr.var.add Qpu.ProgramSynthesis.Expr.var)   ((Qpu.ProgramSynthesis.Expr.lit 2).mul Qpu.ProgramSynthesis.Expr.var)"
	},
	{
		"key": "Qpu.ProgramSynthesis.double_propagate",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "Qpu.ProgramSynthesis.propagate Qpu.ProgramSynthesis.doubleSpec (Qpu.ProgramSynthesis.upTo 3) =   [Qpu.ProgramSynthesis.Expr.var.add Qpu.ProgramSynthesis.Expr.var]"
	},
	{
		"key": "Qpu.ProgramSynthesis.double_synth",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "Qpu.ProgramSynthesis.synth 3 Qpu.ProgramSynthesis.doubleSpec =     some (Qpu.ProgramSynthesis.Expr.var.add Qpu.ProgramSynthesis.Expr.var) ∧   Qpu.ProgramSynthesis.size (Qpu.ProgramSynthesis.Expr.var.add Qpu.ProgramSynthesis.Expr.var) ≤     Qpu.ProgramSynthesis.size ((Qpu.ProgramSynthesis.Expr.lit 2).mul Qpu.ProgramSynthesis.Expr.var)"
	},
	{
		"key": "Qpu.ProgramSynthesis.equiv_satisfies_traceOf",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {e₁ e₂ : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.Equiv e₁ e₂ →     ∀ (inputs : List Nat), Qpu.ProgramSynthesis.satisfies e₂ (Qpu.ProgramSynthesis.traceOf e₁ inputs)"
	},
	{
		"key": "Qpu.ProgramSynthesis.eval_affine",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (a b x : Nat), Qpu.ProgramSynthesis.eval (Qpu.ProgramSynthesis.affine a b) x = a * x + b"
	},
	{
		"key": "Qpu.ProgramSynthesis.eval_mono",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr) {x y : Nat}, x ≤ y → Qpu.ProgramSynthesis.eval e x ≤ Qpu.ProgramSynthesis.eval e y"
	},
	{
		"key": "Qpu.ProgramSynthesis.eval_replace",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr) (p : Qpu.ProgramSynthesis.Pos) {old new : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.get? e p = some old →     ∀ {x : Nat},       Qpu.ProgramSynthesis.eval new x = Qpu.ProgramSynthesis.eval old x →         Qpu.ProgramSynthesis.eval (Qpu.ProgramSynthesis.replace e p new) x = Qpu.ProgramSynthesis.eval e x"
	},
	{
		"key": "Qpu.ProgramSynthesis.eval_zero",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr), Qpu.ProgramSynthesis.eval e 0 = Qpu.ProgramSynthesis.lower e"
	},
	{
		"key": "Qpu.ProgramSynthesis.fill_of_holes_zero",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (sk : Qpu.ProgramSynthesis.Sketch),   Qpu.ProgramSynthesis.holes sk = 0 →     ∀ (e e' : Qpu.ProgramSynthesis.Expr), Qpu.ProgramSynthesis.fill sk e = Qpu.ProgramSynthesis.fill sk e'"
	},
	{
		"key": "Qpu.ProgramSynthesis.holds_iff",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr) (ex : Qpu.ProgramSynthesis.Example),   Qpu.ProgramSynthesis.holds e ex = true ↔ Qpu.ProgramSynthesis.eval e ex.fst = ex.snd"
	},
	{
		"key": "Qpu.ProgramSynthesis.inconsistent_spec",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr), ¬Qpu.ProgramSynthesis.satisfies e [(0, 0), (0, 1)]"
	},
	{
		"key": "Qpu.ProgramSynthesis.lower_le_eval",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr) (x : Nat), Qpu.ProgramSynthesis.lower e ≤ Qpu.ProgramSynthesis.eval e x"
	},
	{
		"key": "Qpu.ProgramSynthesis.mem_propagate",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {s : Qpu.ProgramSynthesis.Spec} {c : List Qpu.ProgramSynthesis.Expr} {e : Qpu.ProgramSynthesis.Expr},   e ∈ Qpu.ProgramSynthesis.propagate s c ↔ e ∈ c ∧ Qpu.ProgramSynthesis.satisfies e s"
	},
	{
		"key": "Qpu.ProgramSynthesis.mem_prune",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {ex : Qpu.ProgramSynthesis.Example} {c : List Qpu.ProgramSynthesis.Expr} {e : Qpu.ProgramSynthesis.Expr},   e ∈ Qpu.ProgramSynthesis.prune ex c ↔ e ∈ c ∧ Qpu.ProgramSynthesis.eval e ex.fst = ex.snd"
	},
	{
		"key": "Qpu.ProgramSynthesis.mem_upTo_of_size_le",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {k : Nat} (e : Qpu.ProgramSynthesis.Expr), Qpu.ProgramSynthesis.size e ≤ k → e ∈ Qpu.ProgramSynthesis.upTo k"
	},
	{
		"key": "Qpu.ProgramSynthesis.programs_unbounded",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (k : Nat), ∃ e, k < Qpu.ProgramSynthesis.size e"
	},
	{
		"key": "Qpu.ProgramSynthesis.propagate_append_subset",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {s t : Qpu.ProgramSynthesis.Spec} {c : List Qpu.ProgramSynthesis.Expr} {e : Qpu.ProgramSynthesis.Expr},   e ∈ Qpu.ProgramSynthesis.propagate (s ++ t) c → e ∈ Qpu.ProgramSynthesis.propagate s c"
	},
	{
		"key": "Qpu.ProgramSynthesis.propagate_length_le",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (s : Qpu.ProgramSynthesis.Spec) (c : List Qpu.ProgramSynthesis.Expr),   (Qpu.ProgramSynthesis.propagate s c).length ≤ c.length"
	},
	{
		"key": "Qpu.ProgramSynthesis.propagate_nil_iff",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (k : Nat) (s : Qpu.ProgramSynthesis.Spec),   Qpu.ProgramSynthesis.propagate s (Qpu.ProgramSynthesis.upTo k) = [] ↔ Qpu.ProgramSynthesis.synth k s = none"
	},
	{
		"key": "Qpu.ProgramSynthesis.prune_keeps",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {ex : Qpu.ProgramSynthesis.Example} {s : Qpu.ProgramSynthesis.Spec} {c : List Qpu.ProgramSynthesis.Expr}   {e : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.satisfies e s → ex ∈ s → e ∈ c → e ∈ Qpu.ProgramSynthesis.prune ex c"
	},
	{
		"key": "Qpu.ProgramSynthesis.prune_length_le",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (ex : Qpu.ProgramSynthesis.Example) (c : List Qpu.ProgramSynthesis.Expr),   (Qpu.ProgramSynthesis.prune ex c).length ≤ c.length"
	},
	{
		"key": "Qpu.ProgramSynthesis.repair_preserves",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {e : Qpu.ProgramSynthesis.Expr} {p : Qpu.ProgramSynthesis.Pos} {old new : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.get? e p = some old →     ∀ {ex : Qpu.ProgramSynthesis.Example},       Qpu.ProgramSynthesis.eval e ex.fst = ex.snd →         Qpu.ProgramSynthesis.eval new ex.fst = Qpu.ProgramSynthesis.eval old ex.fst →           Qpu.ProgramSynthesis.eval (Qpu.ProgramSynthesis.replace e p new) ex.fst = ex.snd"
	},
	{
		"key": "Qpu.ProgramSynthesis.repair_preserves_spec",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {e : Qpu.ProgramSynthesis.Expr} {p : Qpu.ProgramSynthesis.Pos} {old new : Qpu.ProgramSynthesis.Expr}   {s : Qpu.ProgramSynthesis.Spec},   Qpu.ProgramSynthesis.get? e p = some old →     Qpu.ProgramSynthesis.satisfies e s →       (∀ (ex : Qpu.ProgramSynthesis.Example),           ex ∈ s → Qpu.ProgramSynthesis.eval new ex.fst = Qpu.ProgramSynthesis.eval old ex.fst) →         Qpu.ProgramSynthesis.satisfies (Qpu.ProgramSynthesis.replace e p new) s"
	},
	{
		"key": "Qpu.ProgramSynthesis.repair_root",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr) (ex : Qpu.ProgramSynthesis.Example),   Qpu.ProgramSynthesis.eval       (Qpu.ProgramSynthesis.replace e Qpu.ProgramSynthesis.Pos.here (Qpu.ProgramSynthesis.Expr.lit ex.snd)) ex.fst =     ex.snd"
	},
	{
		"key": "Qpu.ProgramSynthesis.satisfiable_iff",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (k : Nat) (s : Qpu.ProgramSynthesis.Spec),   Qpu.ProgramSynthesis.satisfiable k s = true ↔     ∃ e, Qpu.ProgramSynthesis.size e ≤ k ∧ Qpu.ProgramSynthesis.satisfies e s"
	},
	{
		"key": "Qpu.ProgramSynthesis.satisfiable_monotone",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {e : Qpu.ProgramSynthesis.Expr} {s : Qpu.ProgramSynthesis.Spec},   Qpu.ProgramSynthesis.satisfies e s → ∀ {x y x' y' : Nat}, (x, y) ∈ s → (x', y') ∈ s → x ≤ x' → y ≤ y'"
	},
	{
		"key": "Qpu.ProgramSynthesis.satisfiesB_iff",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr) (s : Qpu.ProgramSynthesis.Spec),   Qpu.ProgramSynthesis.satisfiesB e s = true ↔ Qpu.ProgramSynthesis.satisfies e s"
	},
	{
		"key": "Qpu.ProgramSynthesis.satisfies_append",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {e : Qpu.ProgramSynthesis.Expr} (s t : Qpu.ProgramSynthesis.Spec),   Qpu.ProgramSynthesis.satisfies e (s ++ t) ↔ Qpu.ProgramSynthesis.satisfies e s ∧ Qpu.ProgramSynthesis.satisfies e t"
	},
	{
		"key": "Qpu.ProgramSynthesis.satisfies_of_equiv",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {e₁ e₂ : Qpu.ProgramSynthesis.Expr} {s : Qpu.ProgramSynthesis.Spec},   Qpu.ProgramSynthesis.Equiv e₁ e₂ → (Qpu.ProgramSynthesis.satisfies e₁ s ↔ Qpu.ProgramSynthesis.satisfies e₂ s)"
	},
	{
		"key": "Qpu.ProgramSynthesis.satisfies_traceOf",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr) (inputs : List Nat),   Qpu.ProgramSynthesis.satisfies e (Qpu.ProgramSynthesis.traceOf e inputs)"
	},
	{
		"key": "Qpu.ProgramSynthesis.singleton_satisfiable",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (ex : Qpu.ProgramSynthesis.Example), Qpu.ProgramSynthesis.satisfies (Qpu.ProgramSynthesis.Expr.lit ex.snd) [ex]"
	},
	{
		"key": "Qpu.ProgramSynthesis.size_affine",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (a b : Nat), Qpu.ProgramSynthesis.size (Qpu.ProgramSynthesis.affine a b) = a + b + 5"
	},
	{
		"key": "Qpu.ProgramSynthesis.size_compose",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (a b : Qpu.ProgramSynthesis.Expr),   Qpu.ProgramSynthesis.size (a.add b) = Qpu.ProgramSynthesis.size a + Qpu.ProgramSynthesis.size b + 1 ∧     Qpu.ProgramSynthesis.size (a.mul b) = Qpu.ProgramSynthesis.size a + Qpu.ProgramSynthesis.size b + 1"
	},
	{
		"key": "Qpu.ProgramSynthesis.size_fill",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (sk : Qpu.ProgramSynthesis.Sketch) (e : Qpu.ProgramSynthesis.Expr),   Qpu.ProgramSynthesis.size (Qpu.ProgramSynthesis.fill sk e) =     Qpu.ProgramSynthesis.skeleton sk + Qpu.ProgramSynthesis.holes sk * Qpu.ProgramSynthesis.size e"
	},
	{
		"key": "Qpu.ProgramSynthesis.size_le_of_mem_upTo",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {k : Nat} {e : Qpu.ProgramSynthesis.Expr}, e ∈ Qpu.ProgramSynthesis.upTo k → Qpu.ProgramSynthesis.size e ≤ k"
	},
	{
		"key": "Qpu.ProgramSynthesis.size_of_mem_layer",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {k : Nat} {prev : List Qpu.ProgramSynthesis.Expr} {e : Qpu.ProgramSynthesis.Expr},   e ∈ Qpu.ProgramSynthesis.layer k prev → Qpu.ProgramSynthesis.size e = k + 1"
	},
	{
		"key": "Qpu.ProgramSynthesis.size_pos",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr), 0 < Qpu.ProgramSynthesis.size e"
	},
	{
		"key": "Qpu.ProgramSynthesis.size_replace",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr) (p : Qpu.ProgramSynthesis.Pos) {old new : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.get? e p = some old →     Qpu.ProgramSynthesis.size (Qpu.ProgramSynthesis.replace e p new) + Qpu.ProgramSynthesis.size old =       Qpu.ProgramSynthesis.size e + Qpu.ProgramSynthesis.size new"
	},
	{
		"key": "Qpu.ProgramSynthesis.sketch_completion_size",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (sk : Qpu.ProgramSynthesis.Sketch),   Qpu.ProgramSynthesis.size (Qpu.ProgramSynthesis.fill sk Qpu.ProgramSynthesis.Expr.var) =     Qpu.ProgramSynthesis.skeleton sk + Qpu.ProgramSynthesis.holes sk"
	},
	{
		"key": "Qpu.ProgramSynthesis.succ_synth",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "Qpu.ProgramSynthesis.synth 4 Qpu.ProgramSynthesis.succSpec =     some (Qpu.ProgramSynthesis.Expr.var.add (Qpu.ProgramSynthesis.Expr.lit 1)) ∧   Qpu.ProgramSynthesis.synth 3 Qpu.ProgramSynthesis.succSpec = none"
	},
	{
		"key": "Qpu.ProgramSynthesis.synth_complete",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {k : Nat} {s : Qpu.ProgramSynthesis.Spec} {w : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.satisfies w s → Qpu.ProgramSynthesis.size w ≤ k → ∃ e, Qpu.ProgramSynthesis.synth k s = some e"
	},
	{
		"key": "Qpu.ProgramSynthesis.synth_mem_propagate",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {k : Nat} {s : Qpu.ProgramSynthesis.Spec} {e : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.synth k s = some e → e ∈ Qpu.ProgramSynthesis.propagate s (Qpu.ProgramSynthesis.upTo k)"
	},
	{
		"key": "Qpu.ProgramSynthesis.synth_minimal",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {s : Qpu.ProgramSynthesis.Spec} {k : Nat} {e : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.synth k s = some e →     ∀ (w : Qpu.ProgramSynthesis.Expr),       Qpu.ProgramSynthesis.satisfies w s → Qpu.ProgramSynthesis.size e ≤ Qpu.ProgramSynthesis.size w"
	},
	{
		"key": "Qpu.ProgramSynthesis.synth_size",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {k : Nat} {s : Qpu.ProgramSynthesis.Spec} {e : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.synth k s = some e → Qpu.ProgramSynthesis.size e ≤ k"
	},
	{
		"key": "Qpu.ProgramSynthesis.synth_sound",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {k : Nat} {s : Qpu.ProgramSynthesis.Spec} {e : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.synth k s = some e → Qpu.ProgramSynthesis.satisfies e s"
	},
	{
		"key": "Qpu.ProgramSynthesis.synth_traceOf",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr) (inputs : List Nat),   ∃ e',     Qpu.ProgramSynthesis.synth (Qpu.ProgramSynthesis.size e) (Qpu.ProgramSynthesis.traceOf e inputs) = some e' ∧       Qpu.ProgramSynthesis.size e' ≤ Qpu.ProgramSynthesis.size e"
	},
	{
		"key": "Qpu.ProgramSynthesis.synth_typed",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ {k : Nat} {s : Qpu.ProgramSynthesis.Spec} {e : Qpu.ProgramSynthesis.Expr},   Qpu.ProgramSynthesis.synth k s = some e →     Qpu.ProgramSynthesis.satisfies e s ∧       Qpu.ProgramSynthesis.size e ≤ k ∧         ∀ (x y : Nat), x ≤ y → Qpu.ProgramSynthesis.eval e x ≤ Qpu.ProgramSynthesis.eval e y"
	},
	{
		"key": "Qpu.ProgramSynthesis.testing_incomplete",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "Qpu.ProgramSynthesis.satisfies (Qpu.ProgramSynthesis.Expr.var.mul Qpu.ProgramSynthesis.Expr.var) [(0, 0), (2, 4)] ∧   Qpu.ProgramSynthesis.satisfies (Qpu.ProgramSynthesis.Expr.var.add Qpu.ProgramSynthesis.Expr.var) [(0, 0), (2, 4)] ∧     ¬Qpu.ProgramSynthesis.Equiv (Qpu.ProgramSynthesis.Expr.var.mul Qpu.ProgramSynthesis.Expr.var)         (Qpu.ProgramSynthesis.Expr.var.add Qpu.ProgramSynthesis.Expr.var)"
	},
	{
		"key": "Qpu.ProgramSynthesis.unsatisfiable_spec",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "∀ (e : Qpu.ProgramSynthesis.Expr), ¬Qpu.ProgramSynthesis.satisfies e [(0, 1), (1, 0)]"
	},
	{
		"key": "Qpu.ProgramSynthesis.upTo_counts",
		"module": "Qpu.Leads.ProgramSynthesis",
		"statement": "(Qpu.ProgramSynthesis.upTo 1).length = 2 ∧   (Qpu.ProgramSynthesis.upTo 2).length = 3 ∧     (Qpu.ProgramSynthesis.upTo 3).length = 12 ∧ (Qpu.ProgramSynthesis.upTo 4).length = 21"
	},
	{
		"key": "Qpu.Xai.Attention.sums",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ {total : Nat} (self : Qpu.Xai.Attention total), self.weights.sum = total"
	},
	{
		"key": "Qpu.Xai.ablation_complete",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (f : List Int → Int) (x b : List Int), x.length = b.length → (Qpu.Xai.ablation f x b).sum = f x - f b"
	},
	{
		"key": "Qpu.Xai.attention_rollout_normalised",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ {T : Nat} (A : Qpu.Xai.Attention T) (B : List (Qpu.Xai.Attention T)),   A.weights.length ≤ B.length → (Qpu.Xai.rollout A.weights (List.map Qpu.Xai.Attention.weights B)).sum = T * T"
	},
	{
		"key": "Qpu.Xai.attention_weight_le_total",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ {T : Nat} (A : Qpu.Xai.Attention T) (w : Nat), w ∈ A.weights → w ≤ T"
	},
	{
		"key": "Qpu.Xai.attr_complete",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (x b : List Int), x.length = b.length → (Qpu.Xai.attr m.weights x b).sum = m.eval x - m.eval b"
	},
	{
		"key": "Qpu.Xai.attr_sum",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (w x b : List Int), x.length = b.length → (Qpu.Xai.attr w x b).sum = Qpu.Xai.dot w x - Qpu.Xai.dot w b"
	},
	{
		"key": "Qpu.Xai.cam_total",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (w : List Nat) (maps : List (List Nat)) (T : Nat),   (∀ (f : List Nat), f ∈ maps → f.sum = T) → w.length ≤ maps.length → (Qpu.Xai.rollout w maps).sum = w.sum * T"
	},
	{
		"key": "Qpu.Xai.counterfactual_exists",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (x : List Int) (i : Nat),   i < x.length → m.weights.getD i 0 ≠ 0 → ∃ y, Qpu.Xai.hamming x y ≤ 1 ∧ m.eval y ≠ m.eval x"
	},
	{
		"key": "Qpu.Xai.dot_mono",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (w x y : List Int), (∀ (a : Int), a ∈ w → 0 ≤ a) → Qpu.Xai.Le x y → Qpu.Xai.dot w x ≤ Qpu.Xai.dot w y"
	},
	{
		"key": "Qpu.Xai.dot_set_sub_set",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (w l : List Int) (i : Nat) (u v : Int),   i < l.length → Qpu.Xai.dot w (l.set i v) - Qpu.Xai.dot w (l.set i u) = w.getD i 0 * (v - u)"
	},
	{
		"key": "Qpu.Xai.dot_sub_set",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (w l : List Int) (i : Nat) (v : Int),   i < l.length → Qpu.Xai.dot w l - Qpu.Xai.dot w (l.set i v) = w.getD i 0 * (l.getD i 0 - v)"
	},
	{
		"key": "Qpu.Xai.eval_mono",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (x y : List Int), (∀ (a : Int), a ∈ m.weights → 0 ≤ a) → Qpu.Xai.Le x y → m.eval x ≤ m.eval y"
	},
	{
		"key": "Qpu.Xai.eval_set_sub_set",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (l : List Int) (i : Nat) (u v : Int),   i < l.length → m.eval (l.set i v) - m.eval (l.set i u) = m.weights.getD i 0 * (v - u)"
	},
	{
		"key": "Qpu.Xai.eval_sub_set",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (l : List Int) (i : Nat) (v : Int),   i < l.length → m.eval l - m.eval (l.set i v) = m.weights.getD i 0 * (l.getD i 0 - v)"
	},
	{
		"key": "Qpu.Xai.fidelity_le",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (f g : List Int → Int) (data : List (List Int)), Qpu.Xai.fidelity f g data ≤ data.length"
	},
	{
		"key": "Qpu.Xai.fidelity_self",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (f : List Int → Int) (data : List (List Int)), Qpu.Xai.fidelity f f data = data.length"
	},
	{
		"key": "Qpu.Xai.getD_map_natAbs",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (l : List Int) (i : Nat), (List.map Int.natAbs l).getD i 0 = (l.getD i 0).natAbs"
	},
	{
		"key": "Qpu.Xai.getD_set_ne",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ {α : Type} (l : List α) (i j : Nat) (v d : α), i ≠ j → (l.set i v).getD j d = l.getD j d"
	},
	{
		"key": "Qpu.Xai.hamming_le_length",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (x y : List Int), Qpu.Xai.hamming x y ≤ x.length"
	},
	{
		"key": "Qpu.Xai.hamming_self",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (x : List Int), Qpu.Xai.hamming x x = 0"
	},
	{
		"key": "Qpu.Xai.hamming_set_le_one",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (x : List Int) (i : Nat) (v : Int), Qpu.Xai.hamming x (x.set i v) ≤ 1"
	},
	{
		"key": "Qpu.Xai.importance_le_total",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (a : List Int) (k : Nat), k ∈ Qpu.Xai.importance a → k ≤ (Qpu.Xai.importance a).sum"
	},
	{
		"key": "Qpu.Xai.influence_loo",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (y : List Int) (j : Nat), j < y.length → m.eval y - m.eval (y.set j 0) = Qpu.Xai.influence m y j"
	},
	{
		"key": "Qpu.Xai.influence_stability",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (y : List Int) (j k : Nat) (v : Int),   k ≠ j → Qpu.Xai.influence m (y.set k v) j = Qpu.Xai.influence m y j"
	},
	{
		"key": "Qpu.Xai.integrated_gradients_linear",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (steps : Nat), 0 < steps → ∀ (a : Int), (Qpu.Xai.igRiemann steps a).sum / ↑steps = a"
	},
	{
		"key": "Qpu.Xai.interaction_zero",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (x : List Int) (i j : Nat) (a b : Int),   j < x.length → i ≠ j → m.eval ((x.set i a).set j b) - m.eval (x.set i a) - (m.eval (x.set j b) - m.eval x) = 0"
	},
	{
		"key": "Qpu.Xai.lattice_attention_bounded",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (w : Nat), w ∈ (Qpu.Xai.uniform n hexbit).weights → w ≤ n * hexbit"
	},
	{
		"key": "Qpu.Xai.lrp_conservation",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (R : List Nat) (Ss : List (List (List Nat))), Qpu.Xai.Chain R Ss → (Qpu.Xai.propagateAll R Ss).sum = R.sum"
	},
	{
		"key": "Qpu.Xai.mem_le_sum",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (l : List Nat) (a : Nat), a ∈ l → a ≤ l.sum"
	},
	{
		"key": "Qpu.Xai.natAbs_sum_le",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (l : List Int), l.sum.natAbs ≤ (List.map Int.natAbs l).sum"
	},
	{
		"key": "Qpu.Xai.output_change_le_total_importance",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (f : List Int → Int) (x b : List Int),   x.length = b.length → (f x - f b).natAbs ≤ (Qpu.Xai.importance (Qpu.Xai.ablation f x b)).sum"
	},
	{
		"key": "Qpu.Xai.pd_slope",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (x : List Int) (i : Nat) (v : Int),   i < x.length → Qpu.Xai.pd m x i (v + 1) - Qpu.Xai.pd m x i v = m.weights.getD i 0"
	},
	{
		"key": "Qpu.Xai.propagate_sum",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (splits : List (List Nat)), (Qpu.Xai.propagate splits).sum = (List.map List.sum splits).sum"
	},
	{
		"key": "Qpu.Xai.saliency_zero_iff",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (i : Nat), (Qpu.Xai.saliency m).getD i 0 = 0 ↔ m.weights.getD i 0 = 0"
	},
	{
		"key": "Qpu.Xai.saliency_zero_insensitive",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (x : List Int) (i : Nat) (v : Int),   i < x.length → (Qpu.Xai.saliency m).getD i 0 = 0 → m.eval (x.set i v) = m.eval x"
	},
	{
		"key": "Qpu.Xai.sensitivity_eq_weight",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (x : List Int) (i : Nat) (δ : Int),   i < x.length → m.eval (x.set i (x.getD i 0 + δ)) - m.eval x = m.weights.getD i 0 * δ"
	},
	{
		"key": "Qpu.Xai.sensitivity_noise_invariant",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (x x' : List Int) (i : Nat) (δ : Int),   i < x.length →     i < x'.length → m.eval (x'.set i (x'.getD i 0 + δ)) - m.eval x' = m.eval (x.set i (x.getD i 0 + δ)) - m.eval x"
	},
	{
		"key": "Qpu.Xai.sensitivity_ratio",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (m : Qpu.Xai.Linear) (x : List Int) (i : Nat) (δ : Int),   i < x.length → δ ≠ 0 → (m.eval (x.set i (x.getD i 0 + δ)) - m.eval x) / δ = m.weights.getD i 0"
	},
	{
		"key": "Qpu.Xai.shap_marginal_constant",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (w : List Int) (S : List Bool) (x b : List Int) (i : Nat),   i < S.length →     S.length = x.length →       x.length = b.length →         Qpu.Xai.dot w (Qpu.Xai.mask (S.set i true) x b) - Qpu.Xai.dot w (Qpu.Xai.mask (S.set i false) x b) =           w.getD i 0 * (x.getD i 0 - b.getD i 0)"
	},
	{
		"key": "Qpu.Xai.sum_foldl_vadd",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (L : List (List Nat)) (acc : List Nat), (List.foldl Qpu.Xai.vadd acc L).sum = acc.sum + (List.map List.sum L).sum"
	},
	{
		"key": "Qpu.Xai.sum_replicate_int",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (n : Nat) (a : Int), (List.replicate n a).sum = ↑n * a"
	},
	{
		"key": "Qpu.Xai.sum_replicate_nat",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (n k : Nat), (List.replicate n k).sum = n * k"
	},
	{
		"key": "Qpu.Xai.sum_rollout",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (a : List Nat) (B : List (List Nat)) (T : Nat),   (∀ (r : List Nat), r ∈ B → r.sum = T) → a.length ≤ B.length → (Qpu.Xai.rollout a B).sum = a.sum * T"
	},
	{
		"key": "Qpu.Xai.sum_smul",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (k : Nat) (r : List Nat), (Qpu.Xai.smul k r).sum = k * r.sum"
	},
	{
		"key": "Qpu.Xai.sum_vadd",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (u v : List Nat), (Qpu.Xai.vadd u v).sum = u.sum + v.sum"
	},
	{
		"key": "Qpu.Xai.support_sufficient",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (w x b : List Int), x.length = b.length → Qpu.Xai.dot w (Qpu.Xai.maskSupport w x b) = Qpu.Xai.dot w x"
	},
	{
		"key": "Qpu.Xai.telescope",
		"module": "Qpu.Leads.ExplainableAI",
		"statement": "∀ (g : Nat → Int) (n : Nat), (List.map (fun k => g k - g (k + 1)) (List.range n)).sum = g 0 - g n"
	},
	{
		"key": "Qpu.ZeroShot.agree_comm",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a b : Qpu.ZeroShot.Attr), Qpu.ZeroShot.agree a b = Qpu.ZeroShot.agree b a"
	},
	{
		"key": "Qpu.ZeroShot.agree_eq_length_iff",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a b : Qpu.ZeroShot.Attr), List.length a = List.length b → (Qpu.ZeroShot.agree a b = List.length a ↔ a = b)"
	},
	{
		"key": "Qpu.ZeroShot.agree_le_length_left",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a b : Qpu.ZeroShot.Attr), Qpu.ZeroShot.agree a b ≤ List.length a"
	},
	{
		"key": "Qpu.ZeroShot.agree_le_length_right",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a b : Qpu.ZeroShot.Attr), Qpu.ZeroShot.agree a b ≤ List.length b"
	},
	{
		"key": "Qpu.ZeroShot.agree_lt_of_ne",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a b : Qpu.ZeroShot.Attr), List.length a = List.length b → a ≠ b → Qpu.ZeroShot.agree a b < List.length a"
	},
	{
		"key": "Qpu.ZeroShot.agree_nil_right",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a : Qpu.ZeroShot.Attr), Qpu.ZeroShot.agree a [] = 0"
	},
	{
		"key": "Qpu.ZeroShot.agree_self",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a : Qpu.ZeroShot.Attr), Qpu.ZeroShot.agree a a = List.length a"
	},
	{
		"key": "Qpu.ZeroShot.agree_triangle",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a b c : Qpu.ZeroShot.Attr),   List.length a = List.length b →     List.length b = List.length c →       Qpu.ZeroShot.agree a b + Qpu.ZeroShot.agree b c ≤ List.length a + Qpu.ZeroShot.agree a c"
	},
	{
		"key": "Qpu.ZeroShot.allClasses_distinct",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (d : Nat), Qpu.ZeroShot.Distinct (Qpu.ZeroShot.allClasses d)"
	},
	{
		"key": "Qpu.ZeroShot.allClasses_length",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (d : Nat), (Qpu.ZeroShot.allClasses d).length = mintOf d"
	},
	{
		"key": "Qpu.ZeroShot.allClasses_uniform",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (d : Nat), Qpu.ZeroShot.Uniform d (Qpu.ZeroShot.allClasses d)"
	},
	{
		"key": "Qpu.ZeroShot.allVecs_complete",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (v : Qpu.ZeroShot.Attr), v ∈ Qpu.ZeroShot.allVecs (List.length v)"
	},
	{
		"key": "Qpu.ZeroShot.allVecs_length",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (d : Nat), (Qpu.ZeroShot.allVecs d).length = mintOf d"
	},
	{
		"key": "Qpu.ZeroShot.allVecs_nodup",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (d : Nat), (Qpu.ZeroShot.allVecs d).Nodup"
	},
	{
		"key": "Qpu.ZeroShot.allVecs_uniform",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (d : Nat) (v : Qpu.ZeroShot.Attr), v ∈ Qpu.ZeroShot.allVecs d → List.length v = d"
	},
	{
		"key": "Qpu.ZeroShot.best_attained",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {cs : List Qpu.ZeroShot.Class},   cs ≠ [] → ∃ c, c ∈ cs ∧ Qpu.ZeroShot.score q c = Qpu.ZeroShot.best q cs"
	},
	{
		"key": "Qpu.ZeroShot.best_cons_ge",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) (c : Qpu.ZeroShot.Class) (cs : List Qpu.ZeroShot.Class),   Qpu.ZeroShot.best q cs ≤ Qpu.ZeroShot.best q (c :: cs)"
	},
	{
		"key": "Qpu.ZeroShot.best_ge_score",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {c : Qpu.ZeroShot.Class} {cs : List Qpu.ZeroShot.Class},   c ∈ cs → Qpu.ZeroShot.score q c ≤ Qpu.ZeroShot.best q cs"
	},
	{
		"key": "Qpu.ZeroShot.best_le_length",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) (cs : List Qpu.ZeroShot.Class), Qpu.ZeroShot.best q cs ≤ List.length q"
	},
	{
		"key": "Qpu.ZeroShot.code_inj",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a b : Qpu.ZeroShot.Attr), List.length a = List.length b → Qpu.ZeroShot.code a = Qpu.ZeroShot.code b → a = b"
	},
	{
		"key": "Qpu.ZeroShot.code_lt",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a : Qpu.ZeroShot.Attr), Qpu.ZeroShot.code a < mintOf (List.length a)"
	},
	{
		"key": "Qpu.ZeroShot.dim_insufficient",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ {dim : Nat} {cs : List Qpu.ZeroShot.Class},   Qpu.ZeroShot.Uniform dim cs → mintOf dim < cs.length → ¬Qpu.ZeroShot.Distinct cs"
	},
	{
		"key": "Qpu.ZeroShot.distinct_attr_inj",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ {cs : List Qpu.ZeroShot.Class},   Qpu.ZeroShot.Distinct cs → ∀ {c d : Qpu.ZeroShot.Class}, c ∈ cs → d ∈ cs → c.attr = d.attr → c = d"
	},
	{
		"key": "Qpu.ZeroShot.distinct_le_mintOf",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ {dim : Nat} {cs : List Qpu.ZeroShot.Class},   Qpu.ZeroShot.Uniform dim cs → Qpu.ZeroShot.Distinct cs → cs.length ≤ mintOf dim"
	},
	{
		"key": "Qpu.ZeroShot.dot_comm",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a b : List Nat), Qpu.ZeroShot.dot a b = Qpu.ZeroShot.dot b a"
	},
	{
		"key": "Qpu.ZeroShot.dot_indicator_le_agree",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a b : Qpu.ZeroShot.Attr),   Qpu.ZeroShot.dot (Qpu.ZeroShot.indicator a) (Qpu.ZeroShot.indicator b) ≤ Qpu.ZeroShot.agree a b"
	},
	{
		"key": "Qpu.ZeroShot.exact_match_best",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {c : Qpu.ZeroShot.Class} {cs : List Qpu.ZeroShot.Class},   c ∈ cs → c.attr = q → Qpu.ZeroShot.best q cs = List.length q"
	},
	{
		"key": "Qpu.ZeroShot.exact_match_predicted",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {c : Qpu.ZeroShot.Class} {cs : List Qpu.ZeroShot.Class},   Qpu.ZeroShot.Uniform (List.length q) cs →     Qpu.ZeroShot.Distinct cs → c ∈ cs → c.attr = q → Qpu.ZeroShot.predict q cs = some c"
	},
	{
		"key": "Qpu.ZeroShot.exact_match_predicted_attr",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {c d : Qpu.ZeroShot.Class} {cs : List Qpu.ZeroShot.Class},   Qpu.ZeroShot.Uniform (List.length q) cs → c ∈ cs → c.attr = q → Qpu.ZeroShot.predict q cs = some d → d.attr = q"
	},
	{
		"key": "Qpu.ZeroShot.exact_match_predicted_score",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {c d : Qpu.ZeroShot.Class} {cs : List Qpu.ZeroShot.Class},   c ∈ cs → c.attr = q → Qpu.ZeroShot.predict q cs = some d → Qpu.ZeroShot.score q d = List.length q"
	},
	{
		"key": "Qpu.ZeroShot.indistinguishable",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ {c d : Qpu.ZeroShot.Class},   c.attr = d.attr → ∀ (q : Qpu.ZeroShot.Attr), Qpu.ZeroShot.score q c = Qpu.ZeroShot.score q d"
	},
	{
		"key": "Qpu.ZeroShot.mem_unseen",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (isSeen : Qpu.ZeroShot.Class → Bool) (cs : List Qpu.ZeroShot.Class) (c : Qpu.ZeroShot.Class),   c ∈ (Qpu.ZeroShot.split isSeen cs).snd ↔ c ∈ cs ∧ isSeen c = false"
	},
	{
		"key": "Qpu.ZeroShot.nodup_lt_length_le",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (m : Nat) (l : List Nat), l.Nodup → (∀ (x : Nat), x ∈ l → x < m) → l.length ≤ m"
	},
	{
		"key": "Qpu.ZeroShot.predict_cons_of_ge",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {c : Qpu.ZeroShot.Class} {cs : List Qpu.ZeroShot.Class},   (∀ (d : Qpu.ZeroShot.Class), d ∈ cs → Qpu.ZeroShot.score q d ≤ Qpu.ZeroShot.score q c) →     Qpu.ZeroShot.predict q (c :: cs) = some c"
	},
	{
		"key": "Qpu.ZeroShot.predict_cons_of_gt",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {c : Qpu.ZeroShot.Class} {cs : List Qpu.ZeroShot.Class},   Qpu.ZeroShot.best q cs < Qpu.ZeroShot.score q c → Qpu.ZeroShot.predict q (c :: cs) = some c"
	},
	{
		"key": "Qpu.ZeroShot.predict_exists",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {cs : List Qpu.ZeroShot.Class}, cs ≠ [] → ∃ c, Qpu.ZeroShot.predict q cs = some c"
	},
	{
		"key": "Qpu.ZeroShot.predict_is_argmax",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {cs : List Qpu.ZeroShot.Class} {c : Qpu.ZeroShot.Class},   Qpu.ZeroShot.predict q cs = some c →     ∀ (d : Qpu.ZeroShot.Class), d ∈ cs → Qpu.ZeroShot.score q d ≤ Qpu.ZeroShot.score q c"
	},
	{
		"key": "Qpu.ZeroShot.predict_mem",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {cs : List Qpu.ZeroShot.Class} {c : Qpu.ZeroShot.Class},   Qpu.ZeroShot.predict q cs = some c → c ∈ cs"
	},
	{
		"key": "Qpu.ZeroShot.predict_none_iff",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) (cs : List Qpu.ZeroShot.Class), Qpu.ZeroShot.predict q cs = none ↔ cs = []"
	},
	{
		"key": "Qpu.ZeroShot.predict_score",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {cs : List Qpu.ZeroShot.Class} {c : Qpu.ZeroShot.Class},   Qpu.ZeroShot.predict q cs = some c → Qpu.ZeroShot.score q c = Qpu.ZeroShot.best q cs"
	},
	{
		"key": "Qpu.ZeroShot.predict_unseen_cons_seen",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (isSeen : Qpu.ZeroShot.Class → Bool) (q : Qpu.ZeroShot.Attr) (cs : List Qpu.ZeroShot.Class) {s : Qpu.ZeroShot.Class},   isSeen s = true →     Qpu.ZeroShot.predict q (Qpu.ZeroShot.split isSeen (s :: cs)).snd =       Qpu.ZeroShot.predict q (Qpu.ZeroShot.split isSeen cs).snd"
	},
	{
		"key": "Qpu.ZeroShot.predict_unseen_cons_unseen",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (isSeen : Qpu.ZeroShot.Class → Bool) (q : Qpu.ZeroShot.Attr) (cs : List Qpu.ZeroShot.Class) {u : Qpu.ZeroShot.Class},   isSeen u = false →     Qpu.ZeroShot.best q (Qpu.ZeroShot.split isSeen cs).snd < Qpu.ZeroShot.score q u →       Qpu.ZeroShot.predict q (Qpu.ZeroShot.split isSeen (u :: cs)).snd = some u"
	},
	{
		"key": "Qpu.ZeroShot.score_exact",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {c : Qpu.ZeroShot.Class}, c.attr = q → Qpu.ZeroShot.score q c = List.length q"
	},
	{
		"key": "Qpu.ZeroShot.score_le_length",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) (c : Qpu.ZeroShot.Class), Qpu.ZeroShot.score q c ≤ List.length q"
	},
	{
		"key": "Qpu.ZeroShot.score_of_attr_eq",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (q : Qpu.ZeroShot.Attr) {c d : Qpu.ZeroShot.Class}, c.attr = d.attr → Qpu.ZeroShot.score q c = Qpu.ZeroShot.score q d"
	},
	{
		"key": "Qpu.ZeroShot.semantic_transitivity",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (a b c : Qpu.ZeroShot.Attr) (k : Nat),   List.length a = List.length b →     List.length b = List.length c →       List.length a ≤ Qpu.ZeroShot.agree a b + k →         List.length a ≤ Qpu.ZeroShot.agree b c + k → List.length a ≤ Qpu.ZeroShot.agree a c + 2 * k"
	},
	{
		"key": "Qpu.ZeroShot.separable",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ {c d : Qpu.ZeroShot.Class},   List.length c.attr = List.length d.attr → c.attr ≠ d.attr → Qpu.ZeroShot.score c.attr d < Qpu.ZeroShot.score c.attr c"
	},
	{
		"key": "Qpu.ZeroShot.split_cover",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (isSeen : Qpu.ZeroShot.Class → Bool) {cs : List Qpu.ZeroShot.Class} {c : Qpu.ZeroShot.Class},   c ∈ cs → c ∈ (Qpu.ZeroShot.split isSeen cs).fst ∨ c ∈ (Qpu.ZeroShot.split isSeen cs).snd"
	},
	{
		"key": "Qpu.ZeroShot.split_disjoint",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (isSeen : Qpu.ZeroShot.Class → Bool) (cs : List Qpu.ZeroShot.Class) {c : Qpu.ZeroShot.Class},   c ∈ (Qpu.ZeroShot.split isSeen cs).fst → ¬c ∈ (Qpu.ZeroShot.split isSeen cs).snd"
	},
	{
		"key": "Qpu.ZeroShot.split_length",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (isSeen : Qpu.ZeroShot.Class → Bool) (cs : List Qpu.ZeroShot.Class),   (Qpu.ZeroShot.split isSeen cs).fst.length + (Qpu.ZeroShot.split isSeen cs).snd.length = cs.length"
	},
	{
		"key": "Qpu.ZeroShot.split_unseen_cons_seen",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ (isSeen : Qpu.ZeroShot.Class → Bool) (cs : List Qpu.ZeroShot.Class) {s : Qpu.ZeroShot.Class},   isSeen s = true → (Qpu.ZeroShot.split isSeen (s :: cs)).snd = (Qpu.ZeroShot.split isSeen cs).snd"
	},
	{
		"key": "Qpu.ZeroShot.vertices_bound",
		"module": "Qpu.Leads.ZeroShotLearning",
		"statement": "∀ {cs : List Qpu.ZeroShot.Class}, Qpu.ZeroShot.Uniform n cs → Qpu.ZeroShot.Distinct cs → cs.length ≤ vertices"
	},
	{
		"key": "all_complete",
		"module": "Qpu.Cross",
		"statement": "faces = coins * rays ∧   faces = rays + rays ∧ coil = faces ∧ amplitudes = mintOf bits ∧ fused = faces * mintOf (bits + seed)"
	},
	{
		"key": "all_entangle",
		"module": "Qpu.Circuit",
		"statement": "1 * 1 ≠ 0 * 0"
	},
	{
		"key": "all_noclone",
		"module": "Qpu.Circuit",
		"statement": "coins ≠ mintOf coins"
	},
	{
		"key": "all_product",
		"module": "Qpu.Cross",
		"statement": "faces = coins * rays"
	},
	{
		"key": "all_shor",
		"module": "Qpu.Shor",
		"statement": "periodOf shorBase shorModulus % coins = 0"
	},
	{
		"key": "all_sum",
		"module": "Qpu.Cross",
		"statement": "faces = rays + rays"
	},
	{
		"key": "amplitudes_as_sum",
		"module": "Qpu.Cross",
		"statement": "mintOf (bits + seed) = amplitudes + amplitudes"
	},
	{
		"key": "amplitudes_from_sum",
		"module": "Qpu.Cross",
		"statement": "2 * amplitudes = mintOf (bits + seed)"
	},
	{
		"key": "annealing_all",
		"module": "Qpu.Annealing",
		"statement": "chimera 16 = 2048 ∧ pegasus 16 = 5760"
	},
	{
		"key": "anyon_all",
		"module": "Qpu.Anyon",
		"statement": "fibFusion 5 = 5 ∧ fibFusion 10 = 55 ∧ isingFusion 3 = 4"
	},
	{
		"key": "around",
		"module": "Qpu.Lattice",
		"statement": "faces = coins * rays"
	},
	{
		"key": "bits_both_forms",
		"module": "Qpu.Cross",
		"statement": "bits = vertices * hexbit ∧ bits = mintOf (n + coins)"
	},
	{
		"key": "bits_exponential",
		"module": "Qpu.Cross",
		"statement": "bits = mintOf (n + coins)"
	},
	{
		"key": "bits_multiplicative",
		"module": "Qpu.Cross",
		"statement": "bits = vertices * hexbit"
	},
	{
		"key": "breakthrough",
		"module": "Qpu.Lattice",
		"statement": "faces = rays + rays ∧   coins * rays = faces ∧     bits = vertices * hexbit ∧       fused = faces * mintOf (bits + seed) ∧         mintOf hexbit > seed ∧ mintOf (bits + seed) = amplitudes + amplitudes ∧ coins = seed + seed ∧ hexbit = n + seed"
	},
	{
		"key": "cern",
		"module": "Qpu.Cern",
		"statement": "116 * 17922 + 54 = 2079006 ∧   184 * 12509 + 12 = 2301668 ∧     72 * 26572 + 6 = 1913190 ∧       130 * 21121 + 21 = 2745751 ∧         8 - 7 = 1 ∧           8000 - 7000 = 1000 ∧             7000 / 2 = 3500 ∧               8000 / 2 = 4000 ∧                 4000 - 3500 = 500 ∧                   2019 - 2011 = 8 ∧                     2019 - 2012 = 7 ∧                       2017 - 2011 = 6 ∧ 2301668 + 2745751 = 5047419 ∧ 2079006 + 1913190 + 2301668 + 2745751 = 9039615"
	},
	{
		"key": "choose_five_two",
		"module": "Qpu.Combinatorics",
		"statement": "choose 5 2 = 10"
	},
	{
		"key": "choose_pascal",
		"module": "Qpu.Combinatorics",
		"statement": "∀ (n k : Nat), choose (n + 1) (k + 1) = choose n (k + 1) + choose n k"
	},
	{
		"key": "choose_symm_small",
		"module": "Qpu.Combinatorics",
		"statement": "choose 5 2 = choose 5 3"
	},
	{
		"key": "choose_zero",
		"module": "Qpu.Combinatorics",
		"statement": "∀ (n : Nat), choose n 0 = 1"
	},
	{
		"key": "choose_zero_succ",
		"module": "Qpu.Combinatorics",
		"statement": "∀ (k : Nat), choose 0 (k + 1) = 0"
	},
	{
		"key": "circuit",
		"module": "Qpu.Circuit",
		"statement": "0 ^^^ 1 ^^^ 2 = 3 ∧ 3 ^^^ 1 ^^^ 1 = 3 ∧ mintOf n = vertices"
	},
	{
		"key": "clay",
		"module": "Qpu.Coil",
		"statement": "coins * rays = (seed + (mintOf n - coins)) * coins ∧ (seed + (mintOf n - coins)) * coins = coil"
	},
	{
		"key": "clay_sigma",
		"module": "Qpu.Sigma",
		"statement": "2 - (2 - 1) = 1 ∧ 1 - (1 - 0) = 0 ∧ 1 - (1 - 1) = 1 ∧ 2 * 2 = 4 ∧ 1 + 1 = 2"
	},
	{
		"key": "clay_wings",
		"module": "Qpu.Clay",
		"statement": "(vertices = hybridSpeed ∧ vertices = mintOf n) ∧   (magicBlock = glProd hexbit seed ∧ magicBlock = qftDepth vertices) ∧     (mintOf hexbit = powMod coins rays plane ∧ mintOf hexbit = powMod coins hexbit bits) ∧       (bits = chimera coins ∧ bits = qaoaZz vertices hexbit) ∧         (mintOf rays = chimera hexbit ∧ mintOf rays = isingFusion vertices) ∧           (plane = chooseOf vertices coins ∧ plane = choose vertices coins) ∧             (mintOf vertices = groverSize hexbit ∧ mintOf vertices = qaoaZz vertices bits) ∧               triangular hexbit = qftGates hexbit ∧                 (faces = coil ∧ faces = qaoaParams rays) ∧                   (chooseOf rays coins = fibFusion vertices ∧ chooseOf rays coins = powMod rays coins plane) ∧                     (powMod n hexbit plane = powMod n faces bits ∧ powMod n hexbit plane = powMod n plane plane) ∧                       (isingFusion rays = groverSize n ∧ isingFusion rays = qaoaParams bits) ∧                         (mintOf faces = groverSize rays ∧ mintOf faces = qftStates faces) ∧                           (fibFusion rays = powMod n n faces ∧ fibFusion rays = half n faces) ∧                             (powMod faces n bits = cliffordOrder seed ∧ powMod faces n bits = factorial hexbit) ∧                               (magicCubic = chooseOf rays n ∧ magicCubic = chooseOf rays hexbit) ∧                                 triangular faces = qftGates faces ∧                                   (mintOf plane = groverSize faces ∧ mintOf plane = qftStates plane) ∧                                     (amplitudes = mintOf bits ∧ amplitudes = qftStates bits) ∧                                       (powMod n coins bits = powMod n coins faces ∧                                           powMod n coins bits = powMod n coins plane) ∧                                         (groverIters hexbit = qaoaZz n hexbit ∧ groverIters hexbit = qaoaZz hexbit n) ∧                                           (powMod n hexbit bits = powMod n plane bits ∧                                               powMod n hexbit bits = powMod rays coins bits) ∧                                             (chooseOf vertices n = choose vertices n ∧                                                 chooseOf vertices n = qaoaParams plane) ∧                                               chooseOf vertices hexbit = choose vertices hexbit ∧                                                 (qaoaZz bits bits = qaoaX bits bits ∧                                                     qaoaZz bits bits = paulis hexbit) ∧                                                   (powMod n n bits = powMod n n plane ∧                                                       powMod n n bits = half n plane) ∧                                                     triangular vertices = qftGates vertices ∧                                                       (glProd n coins = qaoaZz n faces ∧                                                           glProd n coins = qaoaZz faces n) ∧                                                         qaoaZz rays rays = qaoaX rays rays ∧                                                           chooseOf faces coins = choose faces coins ∧                                                             (qaoaZz n bits = qaoaZz bits n ∧                                                                 qaoaZz n bits = qaoaX n bits) ∧                                                               (qaoaZz rays plane = qaoaZz faces faces ∧                                                                   qaoaZz rays plane = qaoaZz plane rays) ∧                                                                 (qaoaZz rays bits = qaoaZz vertices plane ∧                                                                     qaoaZz rays bits = qaoaZz bits rays) ∧                                                                   chooseOf faces n = choose faces n ∧                                                                     chooseOf plane coins = choose plane coins ∧                                                                       (chimera rays = qaoaZz faces plane ∧                                                                           chimera rays = qaoaZz plane faces) ∧                                                                         triangular plane = qftGates plane ∧                                                                           chooseOf bits coins = choose bits coins ∧                                                                             triangular bits = qftGates bits ∧                                                                               chooseOf faces hexbit =                                                                                   choose faces hexbit ∧                                                                                 chooseOf faces vertices =                                                                                     choose faces vertices ∧                                                                                   chooseOf plane n = choose plane n ∧                                                                                     chooseOf faces rays =                                                                                         choose faces rays ∧                                                                                       chooseOf bits n = choose bits n ∧                                                                                         chimera bits =                                                                                             isingFusion faces ∧                                                                                           chooseOf plane hexbit =                                                                                               choose plane hexbit ∧                                                                                             (chooseOf bits hexbit =                                                                                                   chooseOf bits plane ∧                                                                                                 chooseOf bits hexbit =                                                                                                   choose bits hexbit) ∧                                                                                               groverSize vertices =                                                                                                   paulis rays ∧                                                                                                 chooseOf plane rays =                                                                                                     choose plane rays ∧                                                                                                   chooseOf plane                                                                                                         vertices =                                                                                                       choose plane                                                                                                         vertices ∧                                                                                                     chooseOf bits rays =                                                                                                         choose bits                                                                                                           rays ∧                                                                                                       chooseOf bits                                                                                                             vertices =                                                                                                           choose bits                                                                                                             vertices ∧                                                                                                         chooseOf plane                                                                                                               faces =                                                                                                             choose plane                                                                                                               faces ∧                                                                                                           chooseOf bits                                                                                                               faces =                                                                                                             choose bits                                                                                                               faces"
	},
	{
		"key": "clifford_all",
		"module": "Qpu.Clifford",
		"statement": "symplectic 1 = 6 ∧ symplectic 2 = 720 ∧ symplectic 3 = 1451520 ∧ cliffordOrder 2 = 11520"
	},
	{
		"key": "cluster",
		"module": "Qpu.Lattice",
		"statement": "faces = rays + rays ∧ coins * rays = faces"
	},
	{
		"key": "coil_efficiency",
		"module": "Qpu.Coil",
		"statement": "coil = faces ∧ faces = rays + rays ∧ coins * rays = faces"
	},
	{
		"key": "coins_bridges_forms",
		"module": "Qpu.Cross",
		"statement": "coins = 2 ∧ ∀ (x : Nat), coins * x = x + x"
	},
	{
		"key": "coins_two",
		"module": "Qpu.Lattice",
		"statement": "coins = 2"
	},
	{
		"key": "computer",
		"module": "Qpu.Circuit",
		"statement": "1 ^^^ 3 = 2 ∧ 6 ^^^ 1 = 7 ∧ mintOf 0 = 1"
	},
	{
		"key": "cooling_stays_positive",
		"module": "Qpu.Physics",
		"statement": "∀ (t a n : Nat), 0 < t → 0 < a → 0 < t * a ^ n"
	},
	{
		"key": "cooling_strictly_decreases",
		"module": "Qpu.Physics",
		"statement": "∀ (t a b n : Nat), 0 < t → 0 < a → a < b → t * a ^ n * a < t * a ^ n * b"
	},
	{
		"key": "crypto",
		"module": "Qpu.Lattice",
		"statement": "fused = faces * mintOf (vertices * hexbit + seed)"
	},
	{
		"key": "cube",
		"module": "Qpu.Lattice",
		"statement": "bits = vertices * hexbit"
	},
	{
		"key": "dense",
		"module": "Qpu.Circuit",
		"statement": "coins * coins = mintOf coins"
	},
	{
		"key": "design",
		"module": "Qpu.Circuit",
		"statement": "0 ^^^ 4 ^^^ 4 = 0 ∧ 3 ^^^ 4 ^^^ 4 = 3"
	},
	{
		"key": "deutsch",
		"module": "Qpu.Circuit",
		"statement": "1 - 1 = 0 ∧ seed ≠ coins"
	},
	{
		"key": "distribute",
		"module": "Qpu.Lattice",
		"statement": "fused = faces * mintOf (bits + seed) ∧ faces = coins * rays"
	},
	{
		"key": "double_is_sum",
		"module": "Qpu.Cross",
		"statement": "∀ (x : Nat), x + x = 2 * x"
	},
	{
		"key": "drift",
		"module": "Qpu.Circuit",
		"statement": "coins = 2 ∧ mintOf n = vertices ∧ 0 ^^^ 1 ^^^ 2 = 3 ∧ 3 ^^^ 1 ^^^ 1 = 3"
	},
	{
		"key": "electronics",
		"module": "Qpu.Coil",
		"statement": "coil = faces"
	},
	{
		"key": "energy",
		"module": "Qpu.Lattice",
		"statement": "mintOf hexbit = mintOf (n + seed)"
	},
	{
		"key": "entangle",
		"module": "Qpu.Circuit",
		"statement": "1 * 1 ≠ 0 * 0"
	},
	{
		"key": "faces_additive",
		"module": "Qpu.Cross",
		"statement": "faces = rays + rays"
	},
	{
		"key": "faces_both_forms",
		"module": "Qpu.Cross",
		"statement": "faces = coins * rays ∧ faces = rays + rays"
	},
	{
		"key": "faces_multiplicative",
		"module": "Qpu.Cross",
		"statement": "faces = coins * rays"
	},
	{
		"key": "factorial_succ",
		"module": "Qpu.Combinatorics",
		"statement": "∀ (n : Nat), factorial (n + 1) = (n + 1) * factorial n"
	},
	{
		"key": "factorial_three",
		"module": "Qpu.Combinatorics",
		"statement": "factorial 3 = 6"
	},
	{
		"key": "factorial_zero",
		"module": "Qpu.Combinatorics",
		"statement": "factorial 0 = 1"
	},
	{
		"key": "fill",
		"module": "Qpu.Lattice",
		"statement": "mintOf n * faces = vertices * (coins * rays)"
	},
	{
		"key": "follow_the_coins",
		"module": "Qpu.Coil",
		"statement": "∀ (app : Nat), app + coins = app + theory + practice"
	},
	{
		"key": "fuse",
		"module": "Qpu.Fuse",
		"statement": "2247 + 282 = 2529 ∧   94598 + 343701 = 438299 ∧     406 + 1565 + 3389 + 6011 + 12801 + 414127 = 438299 ∧       448 ≤ 1264 ∧ 362 ≤ 955 ∧ 301 ≤ 340 ∧ 252 ≤ 284 ∧ 144 ≤ 166 ∧ 2529 + 438299 = 440828"
	},
	{
		"key": "fused_additive_form",
		"module": "Qpu.Cross",
		"statement": "fused + fused = faces * mintOf (bits + coins)"
	},
	{
		"key": "fused_both_directions",
		"module": "Qpu.Cross",
		"statement": "fused = faces * mintOf (bits + seed) ∧ fused + fused = faces * mintOf (bits + coins)"
	},
	{
		"key": "fused_multiplicative_form",
		"module": "Qpu.Cross",
		"statement": "fused = faces * mintOf (bits + seed)"
	},
	{
		"key": "fusion",
		"module": "Qpu.Coil",
		"statement": "fused = faces * mintOf (bits + seed) ∧ faces = rays + rays"
	},
	{
		"key": "fusion_baseline",
		"module": "Qpu.Fusion",
		"statement": "fusionBaselineQ * fusionBaselineC = 2076880"
	},
	{
		"key": "fusion_max_x",
		"module": "Qpu.Fusion",
		"statement": "fusionMaxX = 3133452"
	},
	{
		"key": "fusion_register",
		"module": "Qpu.Fusion",
		"statement": "fusionRegister = 22"
	},
	{
		"key": "fusion_tolerance",
		"module": "Qpu.Fusion",
		"statement": "fusionTolSquared = 2 ^ 128 / 2 ^ 48"
	},
	{
		"key": "galois_all",
		"module": "Qpu.Galois",
		"statement": "gl2 2 = 6 ∧ gl2 3 = 168 ∧ gl2 4 = 20160"
	},
	{
		"key": "gates",
		"module": "Qpu.Circuit",
		"statement": "0 ^^^ 1 ^^^ 2 = 3"
	},
	{
		"key": "ghz",
		"module": "Qpu.Circuit",
		"statement": "mintOf n - seed = 7 ∧ 1 * 1 ≠ 0 * 0"
	},
	{
		"key": "grover_all",
		"module": "Qpu.Grover",
		"statement": "groverIters 2 = 3 ∧ groverIters 5 = 25 ∧ groverSize 5 = 1024"
	},
	{
		"key": "handle",
		"module": "Qpu.Lattice",
		"statement": "amplitudes = mintOf bits ∧ mintOf (bits + seed) = amplitudes + amplitudes"
	},
	{
		"key": "harmonic",
		"module": "Qpu.Lattice",
		"statement": "faces = rays + rays"
	},
	{
		"key": "health",
		"module": "Qpu.Lattice",
		"statement": "mintOf hexbit > seed ∧ fused = faces * mintOf (bits + seed) ∧ faces = rays + rays"
	},
	{
		"key": "hexbit_eq",
		"module": "Qpu.Lattice",
		"statement": "hexbit = n + seed"
	},
	{
		"key": "hexbit_pos",
		"module": "Qpu.Lattice",
		"statement": "0 < hexbit"
	},
	{
		"key": "hybrid",
		"module": "Qpu.Hybrid",
		"statement": "coins + seed = n ∧ rays + seed = mintOf n ∧ coins = seed + seed"
	},
	{
		"key": "hybrid_cost",
		"module": "Qpu.Hybrid",
		"statement": "coins + seed = n"
	},
	{
		"key": "hybrid_speed",
		"module": "Qpu.Hybrid",
		"statement": "rays + seed = mintOf n"
	},
	{
		"key": "infinite",
		"module": "Qpu.Lattice",
		"statement": "∀ (k : Nat), mintOf (k + seed) = mintOf k + mintOf k"
	},
	{
		"key": "integrity",
		"module": "Qpu.Lattice",
		"statement": "fused = faces * mintOf (bits + seed) ∧ bits = vertices * hexbit ∧ faces = coins * rays"
	},
	{
		"key": "interfere",
		"module": "Qpu.Circuit",
		"statement": "1 + 1 = 2 ∧ 1 - 1 = 0"
	},
	{
		"key": "involution",
		"module": "Qpu.Lattice",
		"statement": "∀ (face : Nat), (face + rays + rays) % faces = face % faces"
	},
	{
		"key": "key_trinity",
		"module": "Qpu.Sigma",
		"statement": "4 + 3 + 2 = 9 ∧ 432 % 9 = 0 ∧ 10 - 9 = 1"
	},
	{
		"key": "kickback",
		"module": "Qpu.Circuit",
		"statement": "1 - 1 = 0 ∧ 0 ^^^ 1 ^^^ 2 = 3"
	},
	{
		"key": "kv",
		"module": "Qpu.Lattice",
		"statement": "fused = faces * mintOf (bits + seed) ∧ mintOf (bits + seed) = amplitudes + amplitudes"
	},
	{
		"key": "light",
		"module": "Qpu.Lattice",
		"statement": "seed = mintOf 0"
	},
	{
		"key": "magic_all",
		"module": "Qpu.Magic",
		"statement": "magicBlock = 15 ∧ magicLogical = 1 ∧ magicDistance = 3 ∧ magicCubic = 35"
	},
	{
		"key": "measurement",
		"module": "Qpu.Lattice",
		"statement": "mintOf n = 8"
	},
	{
		"key": "mersenne_127",
		"module": "Qpu.Primes",
		"statement": "mintOf rays - seed = 127"
	},
	{
		"key": "mersenne_3",
		"module": "Qpu.Primes",
		"statement": "mintOf coins - seed = 3"
	},
	{
		"key": "mersenne_31",
		"module": "Qpu.Primes",
		"statement": "bits - seed = 31"
	},
	{
		"key": "mersenne_7",
		"module": "Qpu.Primes",
		"statement": "mintOf n - seed = 7"
	},
	{
		"key": "mint",
		"module": "Qpu.Lattice",
		"statement": "mintOf (n + seed) = mintOf n + mintOf n"
	},
	{
		"key": "mintOf_add",
		"module": "Qpu.Mint",
		"statement": "∀ (a b : Nat), mintOf (a + b) = mintOf a * mintOf b"
	},
	{
		"key": "mintOf_ge_seed",
		"module": "Qpu.Lattice",
		"statement": "∀ (k : Nat), seed ≤ mintOf k"
	},
	{
		"key": "mintOf_lt",
		"module": "Qpu.Lattice",
		"statement": "∀ {a b : Nat}, a < b → mintOf a < mintOf b"
	},
	{
		"key": "mintOf_lt_succ",
		"module": "Qpu.Lattice",
		"statement": "∀ (k : Nat), mintOf k < mintOf (k + 1)"
	},
	{
		"key": "mintOf_pos",
		"module": "Qpu.Lattice",
		"statement": "∀ (k : Nat), 0 < mintOf k"
	},
	{
		"key": "mintOf_succ",
		"module": "Qpu.Mint",
		"statement": "∀ (k : Nat), mintOf (k + 1) = mintOf k + mintOf k"
	},
	{
		"key": "mintOf_zero",
		"module": "Qpu.Mint",
		"statement": "mintOf 0 = 1"
	},
	{
		"key": "monogamy",
		"module": "Qpu.Circuit",
		"statement": "1 * 1 ≠ 0 * 0 ∧ 1 * 0 = 0 * 0"
	},
	{
		"key": "multiply",
		"module": "Qpu.Mint",
		"statement": "∀ (a b : Nat), mintOf (a + b) = mintOf a * mintOf b"
	},
	{
		"key": "n_eq",
		"module": "Qpu.Lattice",
		"statement": "n = 3"
	},
	{
		"key": "neuro",
		"module": "Qpu.Circuit",
		"statement": "faces = coins * rays ∧ mintOf n = 8 ∧ 0 ^^^ 4 ^^^ 4 = 0"
	},
	{
		"key": "next",
		"module": "Qpu.Lattice",
		"statement": "mintOf (bits + seed) = amplitudes + amplitudes"
	},
	{
		"key": "next_coil",
		"module": "Qpu.Coil",
		"statement": "coil * mintOf (bits + coins) = fused + fused"
	},
	{
		"key": "next_cover",
		"module": "Qpu.Lattice",
		"statement": "mintOf (bits + seed) = amplitudes + amplitudes ∧ faces * mintOf (bits + coins) = fused + fused"
	},
	{
		"key": "next_fused",
		"module": "Qpu.Lattice",
		"statement": "faces * mintOf (bits + coins) = fused + fused"
	},
	{
		"key": "noclone",
		"module": "Qpu.Circuit",
		"statement": "coins ≠ mintOf coins"
	},
	{
		"key": "noise",
		"module": "Qpu.Circuit",
		"statement": "3 ^^^ 1 ^^^ 1 = 3"
	},
	{
		"key": "one_plus_six",
		"module": "Qpu.Coil",
		"statement": "seed + (mintOf n - coins) = rays"
	},
	{
		"key": "only",
		"module": "Qpu.Circuit",
		"statement": "1 * 1 ≠ 0 * 0 ∧   1 + 1 = 2 ∧     1 - 1 = 0 ∧       coins ≠ mintOf coins ∧         mintOf n - seed = 7 ∧           2 * 2 * 2 * 2 = 16 ∧ 16 = 16 ∧ 0 ^^^ 1 ^^^ 2 = 3 ∧ seed ≠ coins ∧ coins * coins = mintOf coins ∧ 1 * 0 = 0 * 0"
	},
	{
		"key": "physical",
		"module": "Qpu.Circuit",
		"statement": "n = 3 ∧ mintOf n = vertices ∧ 0 ^^^ 1 ^^^ 2 = 3 ∧ 3 ^^^ 1 ^^^ 1 = 3"
	},
	{
		"key": "pi_all",
		"module": "Qpu.Pi",
		"statement": "mintOf coins - seed = 3 ∧   faces + vertices = 22 ∧     rays = 7 ∧       plane * (faces - seed) - n * n = 355 ∧         plane * hexbit + seed = 113 ∧ (faces - coins) * (plane + coins) = 360 ∧ (faces - coins) * (faces + seed) = 180"
	},
	{
		"key": "pi_archimedes_den",
		"module": "Qpu.Pi",
		"statement": "rays = 7"
	},
	{
		"key": "pi_archimedes_num",
		"module": "Qpu.Pi",
		"statement": "faces + vertices = 22"
	},
	{
		"key": "pi_floor",
		"module": "Qpu.Pi",
		"statement": "mintOf coins - seed = 3"
	},
	{
		"key": "pi_half_turn",
		"module": "Qpu.Pi",
		"statement": "(faces - coins) * (faces + seed) = 180"
	},
	{
		"key": "pi_turn_degrees",
		"module": "Qpu.Pi",
		"statement": "(faces - coins) * (plane + coins) = 360"
	},
	{
		"key": "pi_zu_den",
		"module": "Qpu.Pi",
		"statement": "plane * hexbit + seed = 113"
	},
	{
		"key": "pi_zu_num",
		"module": "Qpu.Pi",
		"statement": "plane * (faces - seed) - n * n = 355"
	},
	{
		"key": "planes",
		"module": "Qpu.Lattice",
		"statement": "plane < mintOf (rays + seed) ∧ coins * rays = faces"
	},
	{
		"key": "prime_three",
		"module": "Qpu.Primes",
		"statement": "n = 3"
	},
	{
		"key": "prime_two",
		"module": "Qpu.Primes",
		"statement": "coins = 2"
	},
	{
		"key": "primes_all",
		"module": "Qpu.Primes",
		"statement": "coins = 2 ∧   n = 3 ∧     mintOf coins - seed = 3 ∧       mintOf n - seed = 7 ∧         bits - seed = 31 ∧           mintOf rays - seed = 127 ∧             rays * (faces - seed) = 91 ∧               rays * (faces - seed) = chooseOf faces coins ∧                 faces - n = 11 ∧                   faces - seed = 13 ∧ faces - seed - (faces - n) = coins ∧ coins * n * (n + coins) * rays = 210"
	},
	{
		"key": "primorial_210",
		"module": "Qpu.Primes",
		"statement": "coins * n * (n + coins) * rays = 210"
	},
	{
		"key": "propulsion",
		"module": "Qpu.Lattice",
		"statement": "mintOf hexbit > seed"
	},
	{
		"key": "qaoa_all",
		"module": "Qpu.Qaoa",
		"statement": "qaoaParams 3 = 6 ∧ qaoaZz 2 5 = 10 ∧ qaoaX 3 4 = 12"
	},
	{
		"key": "qft_all",
		"module": "Qpu.Qft",
		"statement": "qftGates 3 = 6 ∧ qftGates 4 = 10 ∧ qftSwaps 4 = 2 ∧ qftDepth 4 = 7 ∧ qftStates 4 = 16"
	},
	{
		"key": "quantum",
		"module": "Qpu.Lattice",
		"statement": "fused = faces * mintOf (bits + seed)"
	},
	{
		"key": "qubits",
		"module": "Qpu.Lattice",
		"statement": "n = 3 ∧ mintOf n = vertices"
	},
	{
		"key": "raid",
		"module": "Qpu.Lattice",
		"statement": "faces = coins * rays ∧ faces = rays + rays"
	},
	{
		"key": "ramsey22_eq",
		"module": "Qpu.Combinatorics",
		"statement": "∀ (n : Nat), ramsey22 n = n"
	},
	{
		"key": "ramsey_three_three",
		"module": "Qpu.Combinatorics",
		"statement": "triangular 3 = 6"
	},
	{
		"key": "relation_10",
		"module": "Qpu.Clay",
		"statement": "triangular hexbit = qftGates hexbit"
	},
	{
		"key": "relation_1001",
		"module": "Qpu.Clay",
		"statement": "chooseOf faces hexbit = choose faces hexbit"
	},
	{
		"key": "relation_1024",
		"module": "Qpu.Clay",
		"statement": "qaoaZz bits bits = qaoaX bits bits ∧ qaoaZz bits bits = paulis hexbit"
	},
	{
		"key": "relation_105",
		"module": "Qpu.Clay",
		"statement": "triangular faces = qftGates faces"
	},
	{
		"key": "relation_10518300",
		"module": "Qpu.Clay",
		"statement": "chooseOf bits vertices = choose bits vertices"
	},
	{
		"key": "relation_1184040",
		"module": "Qpu.Clay",
		"statement": "chooseOf plane rays = choose plane rays"
	},
	{
		"key": "relation_12",
		"module": "Qpu.Clay",
		"statement": "groverIters hexbit = qaoaZz n hexbit ∧ groverIters hexbit = qaoaZz hexbit n"
	},
	{
		"key": "relation_128",
		"module": "Qpu.Clay",
		"statement": "mintOf rays = chimera hexbit ∧ mintOf rays = isingFusion vertices"
	},
	{
		"key": "relation_13",
		"module": "Qpu.Clay",
		"statement": "fibFusion rays = powMod n n faces ∧ fibFusion rays = half n faces"
	},
	{
		"key": "relation_14",
		"module": "Qpu.Clay",
		"statement": "faces = coil ∧ faces = qaoaParams rays"
	},
	{
		"key": "relation_15",
		"module": "Qpu.Clay",
		"statement": "magicBlock = glProd hexbit seed ∧ magicBlock = qftDepth vertices"
	},
	{
		"key": "relation_16",
		"module": "Qpu.Clay",
		"statement": "mintOf hexbit = powMod coins rays plane ∧ mintOf hexbit = powMod coins hexbit bits"
	},
	{
		"key": "relation_16384",
		"module": "Qpu.Clay",
		"statement": "mintOf faces = groverSize rays ∧ mintOf faces = qftStates faces"
	},
	{
		"key": "relation_17",
		"module": "Qpu.Clay",
		"statement": "powMod n hexbit bits = powMod n plane bits ∧ powMod n hexbit bits = powMod rays coins bits"
	},
	{
		"key": "relation_196",
		"module": "Qpu.Clay",
		"statement": "qaoaZz rays plane = qaoaZz faces faces ∧ qaoaZz rays plane = qaoaZz plane rays"
	},
	{
		"key": "relation_20475",
		"module": "Qpu.Clay",
		"statement": "chooseOf plane hexbit = choose plane hexbit"
	},
	{
		"key": "relation_21",
		"module": "Qpu.Clay",
		"statement": "chooseOf rays coins = fibFusion vertices ∧ chooseOf rays coins = powMod rays coins plane"
	},
	{
		"key": "relation_224",
		"module": "Qpu.Clay",
		"statement": "qaoaZz rays bits = qaoaZz vertices plane ∧ qaoaZz rays bits = qaoaZz bits rays"
	},
	{
		"key": "relation_24",
		"module": "Qpu.Clay",
		"statement": "powMod faces n bits = cliffordOrder seed ∧ powMod faces n bits = factorial hexbit"
	},
	{
		"key": "relation_25",
		"module": "Qpu.Clay",
		"statement": "powMod n hexbit plane = powMod n faces bits ∧ powMod n hexbit plane = powMod n plane plane"
	},
	{
		"key": "relation_256",
		"module": "Qpu.Clay",
		"statement": "mintOf vertices = groverSize hexbit ∧ mintOf vertices = qaoaZz vertices bits"
	},
	{
		"key": "relation_268435456",
		"module": "Qpu.Clay",
		"statement": "mintOf plane = groverSize faces ∧ mintOf plane = qftStates plane"
	},
	{
		"key": "relation_27",
		"module": "Qpu.Clay",
		"statement": "powMod n n bits = powMod n n plane ∧ powMod n n bits = half n plane"
	},
	{
		"key": "relation_28",
		"module": "Qpu.Clay",
		"statement": "plane = chooseOf vertices coins ∧ plane = choose vertices coins"
	},
	{
		"key": "relation_3003",
		"module": "Qpu.Clay",
		"statement": "chooseOf faces vertices = choose faces vertices"
	},
	{
		"key": "relation_3108105",
		"module": "Qpu.Clay",
		"statement": "chooseOf plane vertices = choose plane vertices"
	},
	{
		"key": "relation_32",
		"module": "Qpu.Clay",
		"statement": "bits = chimera coins ∧ bits = qaoaZz vertices hexbit"
	},
	{
		"key": "relation_3276",
		"module": "Qpu.Clay",
		"statement": "chooseOf plane n = choose plane n"
	},
	{
		"key": "relation_3365856",
		"module": "Qpu.Clay",
		"statement": "chooseOf bits rays = choose bits rays"
	},
	{
		"key": "relation_3432",
		"module": "Qpu.Clay",
		"statement": "chooseOf faces rays = choose faces rays"
	},
	{
		"key": "relation_35",
		"module": "Qpu.Clay",
		"statement": "magicCubic = chooseOf rays n ∧ magicCubic = chooseOf rays hexbit"
	},
	{
		"key": "relation_35960",
		"module": "Qpu.Clay",
		"statement": "chooseOf bits hexbit = chooseOf bits plane ∧ chooseOf bits hexbit = choose bits hexbit"
	},
	{
		"key": "relation_36",
		"module": "Qpu.Clay",
		"statement": "triangular vertices = qftGates vertices"
	},
	{
		"key": "relation_364",
		"module": "Qpu.Clay",
		"statement": "chooseOf faces n = choose faces n"
	},
	{
		"key": "relation_378",
		"module": "Qpu.Clay",
		"statement": "chooseOf plane coins = choose plane coins"
	},
	{
		"key": "relation_392",
		"module": "Qpu.Clay",
		"statement": "chimera rays = qaoaZz faces plane ∧ chimera rays = qaoaZz plane faces"
	},
	{
		"key": "relation_40116600",
		"module": "Qpu.Clay",
		"statement": "chooseOf plane faces = choose plane faces"
	},
	{
		"key": "relation_406",
		"module": "Qpu.Clay",
		"statement": "triangular plane = qftGates plane"
	},
	{
		"key": "relation_42",
		"module": "Qpu.Clay",
		"statement": "glProd n coins = qaoaZz n faces ∧ glProd n coins = qaoaZz faces n"
	},
	{
		"key": "relation_4294967296",
		"module": "Qpu.Clay",
		"statement": "amplitudes = mintOf bits ∧ amplitudes = qftStates bits"
	},
	{
		"key": "relation_471435600",
		"module": "Qpu.Clay",
		"statement": "chooseOf bits faces = choose bits faces"
	},
	{
		"key": "relation_49",
		"module": "Qpu.Clay",
		"statement": "qaoaZz rays rays = qaoaX rays rays"
	},
	{
		"key": "relation_496",
		"module": "Qpu.Clay",
		"statement": "chooseOf bits coins = choose bits coins"
	},
	{
		"key": "relation_4960",
		"module": "Qpu.Clay",
		"statement": "chooseOf bits n = choose bits n"
	},
	{
		"key": "relation_528",
		"module": "Qpu.Clay",
		"statement": "triangular bits = qftGates bits"
	},
	{
		"key": "relation_56",
		"module": "Qpu.Clay",
		"statement": "chooseOf vertices n = choose vertices n ∧ chooseOf vertices n = qaoaParams plane"
	},
	{
		"key": "relation_64",
		"module": "Qpu.Clay",
		"statement": "isingFusion rays = groverSize n ∧ isingFusion rays = qaoaParams bits"
	},
	{
		"key": "relation_65536",
		"module": "Qpu.Clay",
		"statement": "groverSize vertices = paulis rays"
	},
	{
		"key": "relation_70",
		"module": "Qpu.Clay",
		"statement": "chooseOf vertices hexbit = choose vertices hexbit"
	},
	{
		"key": "relation_8",
		"module": "Qpu.Clay",
		"statement": "vertices = hybridSpeed ∧ vertices = mintOf n"
	},
	{
		"key": "relation_8192",
		"module": "Qpu.Clay",
		"statement": "chimera bits = isingFusion faces"
	},
	{
		"key": "relation_9",
		"module": "Qpu.Clay",
		"statement": "powMod n coins bits = powMod n coins faces ∧ powMod n coins bits = powMod n coins plane"
	},
	{
		"key": "relation_91",
		"module": "Qpu.Clay",
		"statement": "chooseOf faces coins = choose faces coins"
	},
	{
		"key": "relation_96",
		"module": "Qpu.Clay",
		"statement": "qaoaZz n bits = qaoaZz bits n ∧ qaoaZz n bits = qaoaX n bits"
	},
	{
		"key": "sciences",
		"module": "Qpu.Circuit",
		"statement": "coins = 2 ∧   n = 3 ∧     mintOf n = vertices ∧       faces = coins * rays ∧ bits = vertices * hexbit ∧ fused = faces * mintOf (bits + seed) ∧ 0 ^^^ 1 ^^^ 2 = 3"
	},
	{
		"key": "seed_eq",
		"module": "Qpu.Lattice",
		"statement": "seed = 1"
	},
	{
		"key": "server",
		"module": "Qpu.Circuit",
		"statement": "faces = coins * rays ∧ mintOf n = 8"
	},
	{
		"key": "shor",
		"module": "Qpu.Shor",
		"statement": "periodOf shorBase shorModulus % coins = 0 ∧   half shorBase shorModulus < shorModulus - seed ∧     seed < gcdOf (half shorBase shorModulus - seed) shorModulus ∧       gcdOf (half shorBase shorModulus - seed) shorModulus < shorModulus ∧         gcdOf (half shorBase shorModulus - seed) shorModulus * gcdOf (half shorBase shorModulus + seed) shorModulus =           shorModulus"
	},
	{
		"key": "shor_factored",
		"module": "Qpu.Primes",
		"statement": "rays * (faces - seed) = 91"
	},
	{
		"key": "shor_modulus_binomial",
		"module": "Qpu.Primes",
		"statement": "rays * (faces - seed) = chooseOf faces coins"
	},
	{
		"key": "shor_sigma",
		"module": "Qpu.Sigma",
		"statement": "periodOf shorBase shorModulus = mintOf coins ∧   periodOf shorBase shorModulus - periodOf shorBase shorModulus / coins = periodOf shorBase shorModulus / coins ∧     gcdOf (half shorBase shorModulus - seed) shorModulus = rays ∧       gcdOf (half shorBase shorModulus + seed) shorModulus = faces - seed ∧         gcdOf (half shorBase shorModulus - seed) shorModulus * gcdOf (half shorBase shorModulus + seed) shorModulus =           shorModulus"
	},
	{
		"key": "sigma_choose",
		"module": "Qpu.Sigma",
		"statement": "choose rays coins = choose rays (rays - coins) ∧ rays - (rays - coins) = coins"
	},
	{
		"key": "sigma_grover",
		"module": "Qpu.Sigma",
		"statement": "2 * groverSize seed - groverSize seed = groverSize seed"
	},
	{
		"key": "sigma_hodge",
		"module": "Qpu.Sigma",
		"statement": "∀ (g : Nat), 2 * g = g + g"
	},
	{
		"key": "sigma_lattice",
		"module": "Qpu.Sigma",
		"statement": "2 * faces - faces = faces ∧ faces - (faces - vertices) = vertices"
	},
	{
		"key": "sigma_midpoint",
		"module": "Qpu.Sigma",
		"statement": "∀ (d x : Nat), 2 * x = d → d - x = x"
	},
	{
		"key": "sigma_pauli",
		"module": "Qpu.Sigma",
		"statement": "1 - (1 - seed) = seed ∧ 1 - (1 - (n - n)) = n - n"
	},
	{
		"key": "sigma_planck",
		"module": "Qpu.Sigma",
		"statement": "planck - (planck - boltzmann) = boltzmann ∧   2 * planck - planck = planck ∧     2 * photon - photon = photon ∧ 2 * (planck * planck) - planck * planck = planck * planck"
	},
	{
		"key": "sigma_pvsnp",
		"module": "Qpu.Sigma",
		"statement": "∀ (m : Nat), m ≤ 1 → 1 - (1 - m) = m"
	},
	{
		"key": "sigma_qft",
		"module": "Qpu.Sigma",
		"statement": "2 * qftStates n - qftStates n = qftStates n ∧ qftStates n - (qftStates n - seed) = seed"
	},
	{
		"key": "sigma_reflect",
		"module": "Qpu.Sigma",
		"statement": "∀ (d x : Nat), x ≤ d → d - (d - x) = x"
	},
	{
		"key": "sigma_ten_involution",
		"module": "Qpu.Sigma",
		"statement": "∀ (x : Nat), x ≤ 10 → 10 - (10 - x) = x"
	},
	{
		"key": "singularity",
		"module": "Qpu.Sigma",
		"statement": "periodOf 8 91 - periodOf 8 91 / 2 = periodOf 8 91 / 2 ∧   2 * planck - planck = planck ∧     choose rays coins = choose rays (rays - coins) ∧       2 * qftStates n - qftStates n = qftStates n ∧         2 * groverSize seed - groverSize seed = groverSize seed ∧ 2 * faces - faces = faces"
	},
	{
		"key": "split_coin",
		"module": "Qpu.Lattice",
		"statement": "∀ (k : Nat), mintOf (k + seed) = mintOf k + mintOf k"
	},
	{
		"key": "stabilizer_all",
		"module": "Qpu.Stabilizer",
		"statement": "stabStates 1 = 6 ∧ stabStates 2 = 60 ∧ stabStates 3 = 1080 ∧ paulis 1 = 16"
	},
	{
		"key": "superconductivity",
		"module": "Qpu.Physics",
		"statement": "aluminium > 10 ∧ niobium > aluminium ∧ bcs / 100 = 3 ∧ gap aluminium = 88 ∧ gap aluminium > transmon ∧ gap niobium = 679"
	},
	{
		"key": "surfacecode_all",
		"module": "Qpu.Surfacecode",
		"statement": "surfacePhysical 3 = 13 ∧ surfaceCorrectable 5 = 2 ∧ surfaceLogical = 2"
	},
	{
		"key": "teleport",
		"module": "Qpu.Circuit",
		"statement": "2 * 2 * 2 * 2 = 16 ∧ 16 = 16"
	},
	{
		"key": "temperature",
		"module": "Qpu.Physics",
		"statement": "photon / thermal 10 = 23 ∧   photon / thermal 100 = 2 ∧ photon / thermal 4000 = 0 ∧ 4000 / 100 = 40 ∧ 100 / 10 = 10 ∧ 10 < 35"
	},
	{
		"key": "tetra",
		"module": "Qpu.Lattice",
		"statement": "coins + coins = mintOf coins"
	},
	{
		"key": "triad_reflect",
		"module": "Qpu.Sigma",
		"statement": "(10 - 3 = 7 ∧ 10 - 6 = 4 ∧ 10 - 9 = 1) ∧ (10 - 7 = 3 ∧ 10 - 4 = 6 ∧ 10 - 1 = 9) ∧ 10 - 2 = 8 ∧ 10 - 5 = 5 ∧ 10 - 8 = 2"
	},
	{
		"key": "triad_sum",
		"module": "Qpu.Sigma",
		"statement": "3 + 7 = 10 ∧ 6 + 4 = 10 ∧ 9 + 1 = 10 ∧ 2 + 8 = 10 ∧ 5 + 5 = 10"
	},
	{
		"key": "triangular_four",
		"module": "Qpu.Combinatorics",
		"statement": "triangular 4 = 10"
	},
	{
		"key": "triangular_succ",
		"module": "Qpu.Combinatorics",
		"statement": "∀ (n : Nat), triangular (n + 1) = n + 1 + triangular n"
	},
	{
		"key": "triangular_zero",
		"module": "Qpu.Combinatorics",
		"statement": "triangular 0 = 0"
	},
	{
		"key": "twin_gap",
		"module": "Qpu.Primes",
		"statement": "faces - seed - (faces - n) = coins"
	},
	{
		"key": "twin_lower",
		"module": "Qpu.Primes",
		"statement": "faces - n = 11"
	},
	{
		"key": "twin_upper",
		"module": "Qpu.Primes",
		"statement": "faces - seed = 13"
	},
	{
		"key": "two_coins_make_a_coil",
		"module": "Qpu.Coil",
		"statement": "coil = faces"
	},
	{
		"key": "two_x_seven_coins",
		"module": "Qpu.Coil",
		"statement": "coins * rays = (seed + (mintOf n - coins)) * coins"
	},
	{
		"key": "waves",
		"module": "Qpu.Lattice",
		"statement": "mintOf hexbit > seed"
	}
];
var THEOREM_KEYS = new Set(THEOREMS.map((t) => t.key));
// src/quantum/match.ts
/** The surface's own names: they name where, never what, so they count for nothing in coverage. */
var BRAND = /* @__PURE__ */ new Set([
	"qpu",
	"uuidna",
	"mcp",
	"tool",
	"tools"
]);
var STOP = /* @__PURE__ */ new Set([
	"the",
	"a",
	"an",
	"of",
	"to",
	"in",
	"on",
	"for",
	"and",
	"or",
	"is",
	"are",
	"it",
	"its",
	"with",
	"as",
	"by",
	"at",
	"from",
	"this",
	"that",
	"be",
	"can",
	"do",
	"does",
	"what",
	"how",
	"me",
	"i",
	"you",
	"we",
	"please",
	"show",
	"give",
	"run",
	"use",
	"using",
	"now",
	"today",
	"here",
	"there",
	"then",
	"just",
	"also",
	"very",
	"any",
	"all",
	"some",
	"one",
	"two",
	"not",
	"no",
	"yes",
	"has",
	"have",
	"had",
	"was",
	"were",
	"will",
	"would",
	"should",
	"may",
	"might",
	"into",
	"over",
	"under",
	"than",
	"when",
	"where",
	"which",
	"who",
	"why"
]);
var tokens = (text) => text.toLowerCase().replace(/[^a-z0-9.\s_-]/g, " ").split(/[\s_-]+/).map((t) => t.replace(/^\.+|\.+$/g, "")).filter((t) => t.length > 1 && !STOP.has(t));
var overlap = (a, b) => {
	const set = new Set(b);
	let n = 0;
	for (const t of new Set(a)) if (set.has(t) && !BRAND.has(t)) n += 1;
	return n;
};
/** Rare words rank higher than common ones: a term's weight is 1 / (1 + ln df) over every text the surface can match. */
var weightsOf = (texts) => {
	const df = /* @__PURE__ */ new Map();
	for (const text of texts) for (const t of new Set(tokens(text))) df.set(t, (df.get(t) ?? 0) + 1);
	return (t) => 1 / (1 + Math.log(df.get(t) ?? 1));
};
var weighted = (a, b, w) => {
	const set = new Set(b);
	let n = 0;
	for (const t of new Set(a)) if (set.has(t)) n += w(t);
	return n;
};
/** Words in a statement that name a bounded parameter, and the number that follows or precedes them. */
var BOUND_WORDS = {
	n: "N",
	rsa: "N",
	factor: "N",
	factorise: "N",
	factorize: "N",
	semiprime: "N",
	modulus: "N",
	qubit: "qubits",
	qubits: "qubits",
	bit: "bits",
	bits: "bits",
	node: "nodes",
	nodes: "nodes",
	vertices: "nodes",
	milestone: "milestone",
	shots: "repetitions",
	repetitions: "repetitions",
	samples: "repetitions"
};
var numbersNear = (statement) => {
	const out = [];
	const words = statement.toLowerCase().replace(/[^a-z0-9.\s=-]/g, " ").split(/\s+/).filter(Boolean);
	for (let i = 0; i < words.length; i++) {
		const w = words[i];
		const joined = /^([a-z]+)[-=](\d+(?:\.\d+)?)$/.exec(w) ?? /^(\d+(?:\.\d+)?)[-=]([a-z]+)$/.exec(w);
		if (joined) {
			const [, x, y] = joined;
			const word = /^\d/.test(x) ? y : x;
			const value = Number(/^\d/.test(x) ? x : y);
			const property = BOUND_WORDS[word.replace(/s$/, "")] ?? BOUND_WORDS[word];
			if (property && Number.isFinite(value)) out.push({
				property,
				value,
				phrase: w
			});
			continue;
		}
		const property = BOUND_WORDS[w] ?? BOUND_WORDS[w.replace(/s$/, "")];
		if (!property) continue;
		for (const j of [
			i + 1,
			i - 1,
			i + 2
		]) {
			const v = words[j];
			if (v && /^\d+(\.\d+)?$/.test(v)) {
				out.push({
					property,
					value: Number(v),
					phrase: `${w} ${v}`
				});
				break;
			}
		}
	}
	return out;
};
var MIRROR = {
	factor: [
		"shor",
		"order",
		"period",
		"semiprime"
	],
	factors: [
		"shor",
		"order",
		"period"
	],
	factorize: ["shor"],
	factorise: ["shor"],
	qubit: [
		"qubits",
		"processor",
		"grid"
	],
	qubits: ["qubit", "processor"],
	chip: [
		"processor",
		"willow",
		"sycamore"
	],
	chips: ["processor"],
	error: [
		"noise",
		"channel",
		"correction",
		"repetition"
	],
	errors: ["noise", "channel"],
	noise: ["channel", "error"],
	speed: [
		"speedup",
		"benchmark",
		"echo"
	],
	fast: ["speedup", "benchmark"],
	speedup: ["benchmark", "echo"],
	google: [
		"quantumai",
		"willow",
		"sycamore"
	],
	impossible: [
		"blocked",
		"out_of_scope",
		"bound"
	],
	possible: ["served"],
	mirror: [
		"sigma",
		"reflection",
		"involution"
	],
	reflection: ["sigma", "involution"],
	angle: ["phase", "qft"],
	angles: ["phase", "qft"],
	phase: ["angle", "qft"],
	molecule: [
		"chemistry",
		"hydrogen",
		"h2"
	],
	chemistry: ["hydrogen", "molecule"],
	energy: ["chemistry", "hydrogen"],
	code: [
		"repetition",
		"correction",
		"stim"
	],
	decoder: [
		"chromobius",
		"tesseract",
		"stim"
	],
	paper: [
		"preprint",
		"arxiv",
		"statements"
	]
};
var stem = (t) => t.replace(/(ing|ed|es|s)$/, "");
/** The statement in its mirror forms: stems, the sources' synonyms and complements, and the number-free analog. */
var reflectionsOf = (statement) => {
	const q = tokens(statement);
	const out = /* @__PURE__ */ new Set();
	const stems = q.map(stem).filter((t) => t.length > 1);
	if (stems.join(" ") !== q.join(" ")) out.add(stems.join(" "));
	for (const t of q) for (const m of MIRROR[t] ?? MIRROR[stem(t)] ?? []) out.add([...q.filter((x) => x !== t), m].join(" "));
	const numberFree = q.filter((t) => !/^\d/.test(t));
	if (numberFree.length && numberFree.length !== q.length) out.add(numberFree.join(" "));
	return [...out].filter((r) => r !== q.join(" "));
};
var slug = (text) => tokens(text).slice(0, 6).join("-") || "statement";
/** Tools the matcher lists but never calls: calling itself or the audit from inside a match would recurse without end. */
/** Tools the matcher never calls to serve a statement: the judges and layouts of the tree (audit, verify, metrics, textbook, dashboard, clone, css) and every toolbox that fetches, bills or audits; the textbook it serves from is google, clay, leads, language and raid. A pattern may still open any door by name. */
var META = /* @__PURE__ */ new Set([
	"match",
	"audit",
	"verify",
	"metrics",
	"textbook",
	"dashboard",
	"clone",
	"css",
	"prose",
	"payload"
]);
var META_TOOLBOXES = /* @__PURE__ */ new Set([
	"flow",
	"legal",
	"repository",
	"billing",
	"standards",
	"payload",
	"extension"
]);
/** A matcher with its index built once: tools, examples and leads tokenised and weighted, so every lead can be imagined in one run. */
/** Shor's factoring of a small N on the simulator is deterministic: once per process. */
var SHOR = /* @__PURE__ */ new Map();
var INDEXES = /* @__PURE__ */ new WeakMap();
var indexOf = (handle, allExamples, leads) => {
	const byExamples = INDEXES.get(leads) ?? /* @__PURE__ */ new WeakMap();
	INDEXES.set(leads, byExamples);
	const found = byExamples.get(allExamples);
	if (found) return found;
	const built = innerMatcherOf(handle, allExamples, leads);
	byExamples.set(allExamples, built);
	return built;
};
var PATTERNS = [
	{
		name: "uuid",
		test: /\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i,
		tool: "verify",
		args: (m) => ({ uuid: m[1].toLowerCase() }),
		shows: "a UUID: its seal, channel, vortex and reflection"
	},
	{
		name: "oeis",
		test: /\b(A\d{6})\b/,
		tool: "leads",
		args: () => ({}),
		shows: "an OEIS sequence number: a sequence fact for the wave"
	},
	{
		name: "relation",
		test: /\b(relation_\d+)\b/,
		tool: "clay",
		args: (m) => ({ name: m[1] }),
		shows: "a Clay relation by name: recomputed"
	},
	{
		name: "clay-technique",
		test: /\b(clay|register)\b.*\b(reflect|reflection|vortex|trinit)/i,
		tool: "clay",
		args: () => ({ technique: "reflection" }),
		shows: "the register read by the reflection technique"
	},
	{
		name: "dashboard",
		test: /\b(?:dashboard|lay out|layout|combinations?|all (?:the )?(?:options|values)) (?:of |for )?([a-z_-]+)/i,
		tool: "dashboard",
		args: (m) => ({ tool: m[1].toLowerCase() }),
		shows: "a tool laid out whole"
	},
	{
		name: "clone",
		test: /\bclone (?:the )?([a-z-]+)(?: toolbox)?(?: as ([a-z0-9-]+))?/i,
		tool: "clone",
		args: (m) => ({
			toolbox: m[1].toLowerCase(),
			...m[2] ? { as: m[2].toLowerCase() } : {}
		}),
		shows: "a toolbox cloned whole"
	},
	{
		name: "translate",
		test: /\btranslate\b\s*(?:"([^"]+)"|'([^']+)'|(.+?))\s+(?:to|into)\s+([a-z]{2})\b/i,
		tool: "translate",
		args: (m) => ({
			text: m[1] ?? m[2] ?? m[3] ?? "",
			from: "en",
			to: m[4].toLowerCase()
		}),
		shows: "a text translated by vocabulary"
	},
	{
		name: "css-of",
		test: /\b(?:css|stylesheet|colou?rs?|aura) (?:of |for )?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i,
		tool: "css",
		args: (m) => ({ uuid: m[1].toLowerCase() }),
		shows: "the CSS variables of a UUID"
	},
	{
		name: "metrics",
		test: /\b(metrics|how many (?:tools|examples|theorems|leads)|coins paid)\b/i,
		tool: "metrics",
		args: () => ({}),
		shows: "the tree's metrics now"
	},
	{
		name: "textbook",
		test: /\b(?:reuse|replay) (?:example )?([a-z0-9-]+)/i,
		tool: "textbook",
		args: (m) => ({ reuse: m[1].toLowerCase() }),
		shows: "an example reused by id"
	},
	{
		name: "shor",
		test: /\bfactor(?:ise|ize)?\s+(\d+)\b/i,
		tool: "algorithm",
		args: (m) => ({
			name: "shor",
			N: Number(m[1])
		}),
		shows: "an integer factored by Shor within the bound"
	}
];
/** The pattern a statement carries, if any, and the call it makes; the first pattern that matches wins, in the order above. */
var patternOf = (statement) => {
	for (const p of PATTERNS) {
		const m = statement.match(p.test);
		if (m) return {
			pattern: p,
			call: {
				name: p.tool,
				arguments: p.args(m, statement)
			}
		};
	}
	return null;
};
var matcherOf = (handle, allExamples, leads) => {
	const inner = indexOf(handle, allExamples, leads);
	return (given, locale) => {
		const num = numeralsOf(given);
		const tr = locale && locale !== "en" ? translateOf(num.text, locale, "en") : null;
		const text = tr ? tr.text : num.text;
		const recognised = patternOf(text);
		const m = (() => {
			if (recognised && recognised.call.name !== "leads") {
				const reply = handle({
					jsonrpc: "2.0",
					id: 1,
					method: "tools/call",
					params: {
						name: recognised.call.name,
						arguments: recognised.call.arguments
					}
				});
				const base = inner(text);
				if ("result" in reply) return {
					...base,
					verdict: "served",
					tool: recognised.call.name,
					call: recognised.call,
					result: reply.result.structuredContent,
					evidence: [`pattern ${recognised.pattern.name}: ${recognised.pattern.shows}; ${recognised.call.name} answered`, ...base.evidence],
					pattern: recognised.pattern.name,
					lead: {
						...base.lead,
						status: "served",
						tool: recognised.call.name
					}
				};
				return {
					...base,
					evidence: [`pattern ${recognised.pattern.name}: ${recognised.call.name} refused: ${reply.error.message}`, ...base.evidence],
					pattern: recognised.pattern.name
				};
			}
			const base = inner(text);
			return recognised ? {
				...base,
				pattern: recognised.pattern.name
			} : base;
		})();
		if (!num.numerals.length && !tr) return m;
		return {
			...m,
			read: {
				given,
				numerals: num.numerals,
				locale,
				untranslated: tr?.untranslated ?? [],
				verdictIn: tr ? translateOf(m.verdict, "en", locale).text : void 0
			}
		};
	};
};
var innerMatcherOf = (handle, allExamples, leads) => {
	const list = handle({
		jsonrpc: "2.0",
		id: 1,
		method: "tools/list"
	});
	const tools = ("result" in list ? list.result.tools : []).filter((t) => !META.has(t.name) && !META_TOOLBOXES.has(t._meta?.toolbox ?? ""));
	const callable = new Set(tools.map((t) => t.name));
	const examples = allExamples.filter((e) => callable.has(e.tool));
	const toolText = (t) => `${t.name} ${t.description} ${Object.keys(t.inputSchema.properties ?? {}).join(" ")} ${Object.values(t.inputSchema.properties ?? {}).flatMap((p) => (p.enum ?? []).map(String)).join(" ")}`;
	const leaves = (v) => typeof v === "string" ? [v] : typeof v === "number" ? [String(v)] : Array.isArray(v) ? v.flatMap(leaves) : v && typeof v === "object" ? Object.values(v).flatMap(leaves) : [];
	const exampleText = (e) => `${e.tool} ${e.id} ${e.shows} ${leaves(e.arguments).join(" ")}`;
	const leadText = (l) => `${l.id} ${l.statement} ${l.source} ${l.tool ?? ""} ${l.reason ?? ""}`;
	const w = weightsOf([
		...tools.map(toolText),
		...examples.map(exampleText),
		...leads.map(leadText)
	]);
	const toolTok = tools.map((t) => tokens(toolText(t)));
	const exTok = examples.map((e) => tokens(exampleText(e)));
	const theoremTok = THEOREMS.map((t) => tokens(`${t.key} ${t.key.replace(/_/g, " ")} ${t.statement}`));
	const leadTok = leads.map((l) => tokens(leadText(l)));
	const servedLeads = new Set(leads.filter((l) => l.status === "served").map((l) => l.id));
	const bounds = tools.flatMap((t) => Object.entries(t.inputSchema.properties ?? {}).filter(([, p]) => typeof p.maximum === "number").map(([property, p]) => ({
		property,
		d: p.maximum
	})));
	return (statement) => {
		const q = tokens(statement);
		const evidence = [];
		for (const { property, value, phrase } of numbersNear(statement)) for (const t of tools) {
			const p = t.inputSchema.properties?.[property];
			if (!p || typeof p.maximum !== "number") continue;
			if (value > p.maximum || typeof p.minimum === "number" && value < p.minimum) evidence.push(`${t.name}.${property} is bounded to [${p.minimum ?? "…"}, ${p.maximum}] by its schema; the statement asks for ${phrase}${p.description ? ` (${p.description})` : ""}`);
		}
		const substantiveQ = q.filter((t) => !BRAND.has(t));
		if (substantiveQ.length) {
			let best = null;
			for (const [i, th] of THEOREMS.entries()) {
				const keyWords = th.key.toLowerCase().split(/[_.]+/).filter((k) => k.length > 1);
				if (!(keyWords.length > 0 && keyWords.every((k) => q.includes(k)) && (keyWords.length >= 2 || substantiveQ.length === 1))) continue;
				const hits = overlap(q, theoremTok[i]) + 2;
				if (!best || hits > best.hits || hits === best.hits && th.key.length > best.key.length) best = {
					key: th.key,
					statement: th.statement,
					hits
				};
			}
			if (best) {
				const module = THEOREMS.find((t) => t.key === best.key)?.module;
				const cluster = THEOREMS.map((t, i) => ({
					t,
					i
				})).filter(({ t }) => t.module === module && t.key !== best.key).map(({ t, i }) => ({
					kind: "theorem",
					id: t.key,
					score: overlap(q, theoremTok[i]),
					hits: overlap(q, theoremTok[i]),
					text: t.statement
				})).sort((a, b) => b.score - a.score);
				return {
					statement,
					verdict: "served",
					theorem: best.key,
					evidence: [`proven by the kernel: theorem ${best.key}: ${best.statement}`, `next steps in the textbook: ${cluster.length} theorem(s) of ${module}`],
					candidates: [{
						kind: "theorem",
						id: best.key,
						score: best.hits,
						hits: best.hits,
						text: best.statement
					}],
					cluster,
					verify: [],
					reflection: {
						factors: [],
						angles: [],
						queries: [],
						leads: [],
						found: []
					},
					lead: {
						id: slug(statement),
						source: "statement",
						statement,
						status: "served",
						tool: "clay",
						reason: `theorem ${best.key}`
					}
				};
			}
		}
		const candidates = [];
		for (const [i, t] of tools.entries()) {
			const tt = toolTok[i];
			const hits = overlap(q, tt) + (q.includes(t.name.toLowerCase()) ? 2 : 0);
			if (hits > 0) candidates.push({
				kind: "tool",
				id: t.name,
				score: weighted(q, tt, w) + (q.includes(t.name.toLowerCase()) ? 2 : 0),
				hits,
				text: t.description
			});
		}
		for (const [i, e] of examples.entries()) {
			const et = exTok[i];
			const hits = overlap(q, et);
			if (hits > 0) candidates.push({
				kind: "example",
				id: e.id,
				score: weighted(q, et, w) + .5,
				hits: hits + 1,
				text: e.shows
			});
		}
		for (const [i, l] of leads.entries()) {
			const lt = leadTok[i];
			const hits = overlap(q, lt);
			if (hits > 0) candidates.push({
				kind: "lead",
				id: l.id,
				score: weighted(q, lt, w),
				hits,
				text: `${l.status}${l.tool ? ` by ${l.tool}` : ""}${l.reason ? `: ${l.reason}` : ""}`
			});
		}
		candidates.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
		const top = candidates[0];
		const cluster = candidates.filter((c) => c.kind === "example" || c.kind === "tool" || servedLeads.has(c.id));
		const verify = candidates.filter((c) => c.kind === "lead").map((c) => leads.find((l) => l.id === c.id)).filter((l) => l.source && l.source !== "statement").flatMap((l) => factsOf(l).flatMap(verifyRequestsOf));
		const integers = [...new Set((statement.match(/\b\d+\b/g) ?? []).map(Number).filter((n) => n >= 2))];
		const factors = integers.map((n) => {
			const shor = tools.find((t) => t.name === "algorithm")?.inputSchema.properties?.N;
			if (shor && typeof shor.maximum === "number" && n <= shor.maximum && n >= (shor.minimum ?? 3)) {
				const reply = SHOR.get(n) ?? (() => {
					const r = handle({
						jsonrpc: "2.0",
						id: 1,
						method: "tools/call",
						params: {
							name: "algorithm",
							arguments: {
								name: "shor",
								N: n
							}
						}
					});
					SHOR.set(n, r);
					return r;
				})();
				if ("result" in reply) {
					const rows = reply.result.structuredContent?.summary ?? [];
					return {
						n,
						factors: rows.find((r) => r[0] === "Factors")?.[1],
						order: rows.find((r) => r[0] === "Order of a mod N")?.[1],
						by: "the algorithm tool's Shor circuit on the state-vector simulator"
					};
				}
				return {
					n,
					by: `the algorithm tool refused: ${reply.error.message}`
				};
			}
			return {
				n,
				by: `beyond the simulator's bound N ≤ ${shor?.maximum ?? "?"}: not factored here`
			};
		});
		const angles = integers.flatMap((x) => bounds.filter((b) => x <= b.d).map((b) => ({
			x,
			property: b.property,
			d: b.d,
			sigma: b.d - x,
			angle: 2 * Math.PI * x / b.d
		})));
		const queries = reflectionsOf(statement);
		const found = [];
		for (const r of queries) {
			const rq = tokens(r);
			for (const [i, t] of tools.entries()) {
				const score = overlap(rq, toolTok[i]);
				if (score >= 2 && !candidates.some((c) => c.kind === "tool" && c.id === t.name)) found.push({
					kind: "tool",
					id: t.name,
					score,
					hits: score,
					text: `via "${r}": ${t.description.slice(0, 80)}`
				});
			}
			for (const [i, e] of examples.entries()) {
				const score = overlap(rq, exTok[i]);
				if (score >= 2 && !candidates.some((c) => c.kind === "example" && c.id === e.id)) found.push({
					kind: "example",
					id: e.id,
					score,
					hits: score,
					text: `via "${r}": ${e.shows}`
				});
			}
		}
		found.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
		const reflectionLeads = [
			...factors.filter((f) => f.factors).map((f) => ({
				id: `factors-${f.n}`,
				source: `reflection of: ${statement}`,
				statement: `${f.n} = ${f.factors} (order ${f.order}) by ${f.by}`,
				status: "open",
				tool: "algorithm",
				reason: "a hidden factor found in the reflection; verify it across the integer adaptors"
			})),
			...angles.map((a) => ({
				id: `angle-${a.property}-${a.x}`,
				source: `reflection of: ${statement}`,
				statement: `σ_${a.d}(${a.x}) = ${a.sigma} on ${a.property}; QFT angle ${a.angle.toFixed(6)} rad`,
				status: "open",
				reason: "an angle in the reflection; Qpu.Sigma proves σ_d(σ_d(x)) = x"
			})),
			...found.map((c) => ({
				id: `mirror-${c.id}`,
				source: `reflection of: ${statement}`,
				statement: c.text,
				status: "open",
				tool: c.kind === "tool" ? c.id : examples.find((e) => e.id === c.id)?.tool,
				reason: "found only in the mirror form of the statement"
			}))
		];
		for (const l of reflectionLeads) verify.push(...factsOf(l).flatMap(verifyRequestsOf));
		const reflection = {
			factors,
			angles,
			queries,
			found,
			leads: reflectionLeads
		};
		if (evidence.length > 0) return {
			statement,
			verdict: "impossible",
			evidence,
			candidates,
			cluster,
			verify,
			reflection,
			lead: {
				id: slug(statement),
				source: "statement",
				statement,
				status: "blocked",
				reason: evidence.join("; ")
			}
		};
		if ((!top || top.hits < 2) && found.length > 0) {
			const f = found[0];
			const example = f.kind === "example" ? examples.find((e) => e.id === f.id) : examples.find((e) => e.tool === f.id);
			const tool = f.kind === "example" ? example.tool : f.id;
			const call = {
				name: tool,
				arguments: example?.arguments ?? {}
			};
			const reply = handle({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/call",
				params: call
			});
			if ("result" in reply) return {
				statement,
				verdict: "served",
				evidence: [`found in the reflection: ${f.text}`],
				tool,
				call,
				result: reply.result.structuredContent,
				candidates,
				cluster: [f, ...cluster],
				verify,
				reflection,
				lead: {
					id: slug(statement),
					source: "statement",
					statement,
					status: "served",
					tool
				}
			};
		}
		const substantive = q.filter((t) => !BRAND.has(t));
		const coverage = top ? top.hits / Math.max(1, substantive.length) : 0;
		if (top && top.hits >= 2 && coverage < .5 && found.length === 0) {
			const reason = `the best match covers ${Math.round(coverage * 100)}% of the statement's words (${top.kind} ${top.id}); too little to serve it honestly; proposed as a new lead to develop`;
			return {
				statement,
				verdict: "unknown",
				evidence: [reason],
				candidates,
				cluster,
				verify,
				reflection,
				lead: {
					id: slug(statement),
					source: "statement",
					statement,
					status: "blocked",
					reason
				}
			};
		}
		if (!top || top.hits < 2) {
			const reason = "no tool, example or lead matches the statement, nor its reflections; proposed as a new lead to develop";
			return {
				statement,
				verdict: "unknown",
				evidence: [reason],
				candidates,
				cluster,
				verify,
				reflection,
				lead: {
					id: slug(statement),
					source: "statement",
					statement,
					status: "blocked",
					reason
				}
			};
		}
		if (top.kind === "lead") {
			const lead = leads.find((l) => l.id === top.id);
			if (lead.status === "served" && lead.tool && !callable.has(lead.tool)) return {
				statement,
				verdict: "served",
				evidence: [`lead ${lead.id} is served by ${lead.tool}, a tool the matcher does not call to serve (it fetches, judges or lays out); the lead stands as the answer`],
				tool: lead.tool,
				candidates,
				cluster,
				verify,
				reflection,
				lead: {
					...lead,
					statement
				}
			};
			if (lead.status === "served" && lead.tool) {
				const example = examples.find((e) => e.tool === lead.tool);
				const call = {
					name: lead.tool,
					arguments: example?.arguments ?? {}
				};
				const reply = handle({
					jsonrpc: "2.0",
					id: 1,
					method: "tools/call",
					params: call
				});
				if ("result" in reply) return {
					statement,
					verdict: "served",
					evidence: [`lead ${lead.id} is served by ${lead.tool}; called it`],
					tool: lead.tool,
					call,
					result: reply.result.structuredContent,
					candidates,
					cluster,
					verify,
					reflection,
					lead: {
						...lead,
						statement
					}
				};
				return {
					statement,
					verdict: "impossible",
					evidence: [`lead ${lead.id} names ${lead.tool}, which refused: ${reply.error.message}`],
					tool: lead.tool,
					call,
					candidates,
					cluster,
					verify,
					reflection,
					lead: {
						...lead,
						status: "blocked",
						reason: reply.error.message
					}
				};
			}
			return {
				statement,
				verdict: "impossible",
				evidence: [`lead ${lead.id} is ${lead.status}: ${lead.reason ?? "no reason recorded"}`],
				candidates,
				cluster,
				verify,
				reflection,
				lead: {
					...lead,
					statement
				}
			};
		}
		const example = top.kind === "example" ? examples.find((e) => e.id === top.id) : examples.find((e) => e.tool === top.id);
		const tool = top.kind === "example" ? example.tool : top.id;
		const call = {
			name: tool,
			arguments: example?.arguments ?? {}
		};
		const reply = handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/call",
			params: call
		});
		if ("result" in reply) {
			const why = example ? example.expect(reply.result.structuredContent) : null;
			return {
				statement,
				verdict: "served",
				evidence: [example ? `example ${example.id}: ${why ?? "as documented"}` : `tool ${tool} answered the call`],
				tool,
				call,
				result: reply.result.structuredContent,
				candidates,
				cluster,
				verify,
				reflection,
				lead: {
					id: slug(statement),
					source: "statement",
					statement,
					status: "served",
					tool
				}
			};
		}
		return {
			statement,
			verdict: "impossible",
			evidence: [`tool ${tool} refused: ${reply.error.message}`],
			tool,
			call,
			candidates,
			cluster,
			verify,
			reflection,
			lead: {
				id: slug(statement),
				source: "statement",
				statement,
				status: "blocked",
				reason: reply.error.message
			}
		};
	};
};
var matchOf = (statement, handle, allExamples, leads, locale) => matcherOf(handle, allExamples, leads)(statement, locale);
// src/quantum/imagine.ts
var APPLICATIONS$1 = [
	{
		family: "IoT sensing",
		entry: "{ kind: \"reading\", from: device, body: { quantity, unit, value, at } }",
		verifier: "source-page or nist-codata for the reference value"
	},
	{
		family: "IoT actuation",
		entry: "{ kind: \"command\", from: controller, body: { target, action, at } } and the device's { kind: \"ack\" }",
		verifier: "the ack entry linked to the command"
	},
	{
		family: "lab instruments",
		entry: "{ kind: \"measurement\", from: instrument, body: { observable, value, uncertainty } }",
		verifier: "nist-codata, oeis for integer counts"
	},
	{
		family: "phones and kiosks",
		entry: "the block a human device renders (widget, Open Graph, shadcn item)",
		verifier: "the audit's widget and licence checks"
	},
	{
		family: "assistive devices",
		entry: "the same block, read aloud or in braille from its HTML structure",
		verifier: "an accessibility audit of the widgets"
	},
	{
		family: "energy meters",
		entry: "{ kind: \"reading\", from: meter, body: { kWh, at } }",
		verifier: "the grid operator's public interval data where published"
	},
	{
		family: "vehicles",
		entry: "{ kind: \"reading\", from: vehicle, body: { position, speed, at } }",
		verifier: "a public map or transit feed"
	},
	{
		family: "wearables",
		entry: "{ kind: \"reading\", from: wearable, body: { heartRate, at } } under the wearer's consent",
		verifier: "no public verifier: the wearer is the witness"
	},
	{
		family: "education kits",
		entry: "{ kind: \"result\", from: kit, body: { exercise, answer } } (the Qubit Game is a lead already)",
		verifier: "the surface's own tools recompute the exercise"
	},
	{
		family: "other MCP servers",
		entry: "{ kind: \"reply\", from: host, body: the tools/call result }",
		verifier: "the host's own receipt; the unit's fan-out names the hosts"
	}
];
/** Every lead (or the subset named) imagined. Pure; the matcher is built once. */
var imagineOf = (handle, examples, leads, subset, statements) => {
	const match = matcherOf(handle, examples, leads);
	const chosen = statements ? statements.map((s) => ({
		id: s.id,
		source: "statement",
		statement: s.statement,
		status: "open"
	})) : subset ? leads.filter((l) => subset.includes(l.id)) : leads;
	const verdicts = {
		served: 0,
		impossible: 0,
		unknown: 0
	};
	const rows = [];
	const imagined = /* @__PURE__ */ new Map();
	let verifyTotal = 0;
	for (const l of chosen) {
		const m = match(l.statement);
		verdicts[m.verdict] = (verdicts[m.verdict] ?? 0) + 1;
		verifyTotal += m.verify.length;
		for (const r of m.reflection.leads) if (!imagined.has(r.id)) imagined.set(r.id, {
			...r,
			source: `reflection of lead ${l.id}`
		});
		rows.push({
			lead: l.id,
			status: l.status,
			verdict: m.verdict,
			tool: m.tool,
			cluster: m.cluster.length,
			verify: m.verify.length,
			factors: m.reflection.factors.filter((f) => f.factors).length,
			angles: m.reflection.angles.length,
			queries: m.reflection.queries.length,
			opened: m.reflection.leads.length
		});
	}
	const list = handle({
		jsonrpc: "2.0",
		id: 1,
		method: "tools/list"
	});
	const exercised = new Set(examples.flatMap((e) => Object.entries(e.arguments).map(([k, v]) => `${e.tool}.${k}=${JSON.stringify(v)}`)));
	for (const t of list.result.tools) for (const [prop, spec] of Object.entries(t.inputSchema.properties ?? {})) for (const v of spec.enum ?? []) {
		const key = `${t.name}.${prop}=${JSON.stringify(v)}`;
		if (!exercised.has(key)) {
			const id = `schema-${t.name}-${prop}-${String(v)}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
			if (!imagined.has(id)) imagined.set(id, {
				id,
				source: `tools/list ${t.name}.${prop}`,
				statement: `${t.name} accepts ${prop} = ${JSON.stringify(v)} and no documented example exercises it`,
				status: "open",
				tool: t.name,
				reason: "an untried door of the schema; add the example and its expectation, or remove the value"
			});
		}
	}
	for (const a of APPLICATIONS$1) {
		const id = `application-${a.family}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
		if (!imagined.has(id)) imagined.set(id, {
			id,
			source: "the docket contract",
			statement: `${a.family}: an adaptor that writes ${a.entry}; verified by ${a.verifier}`,
			status: "open",
			reason: "the docket accepts the entry today; the adaptor, its schema and its verifier are the lead"
		});
	}
	const verifierKinds = new Set(VERIFIERS.flatMap((v) => v.verifies));
	for (const kind of [
		"reading",
		"command",
		"ack",
		"measurement",
		"result",
		"reply"
	]) if (!verifierKinds.has(kind)) {
		const id = `fact-kind-${kind}`;
		if (!imagined.has(id)) imagined.set(id, {
			id,
			source: "src/quantum/verifiers.ts",
			statement: `no verifier registers the fact kind "${kind}" that the application leads would write`,
			status: "open",
			reason: "register the kind and its free verifier with the first adaptor"
		});
	}
	return {
		leads: chosen.length,
		verdicts,
		verifyRequests: verifyTotal,
		imaginedLeads: imagined.size,
		rows,
		imagined: [...imagined.values()]
	};
};
var imaginePageOf = (im, date, ms) => [
	"---",
	"title: Imagination",
	"order: 54",
	"---",
	"",
	"# Imagination leads all leads",
	"",
	`Generated by \`npm run next\` on ${date} in ${(ms / 1e3).toFixed(1)} s through the \`imagine\` tool: every one of the ${im.leads} leads matched with the reflection on.`,
	"",
	"| Verdict | Leads |",
	"|---|---:|",
	...Object.entries(im.verdicts).map(([v, n]) => `| ${v} | ${n} |`),
	`| verification requests emitted | ${im.verifyRequests} |`,
	`| leads imagined (new, open) | ${im.imaginedLeads} |`,
	"",
	"## Imagined leads",
	"",
	"| Lead | Statement | From |",
	"|---|---|---|",
	...im.imagined.map((l) => `| ${l.id} | ${l.statement.replace(/\|/g, "\\|").slice(0, 160)} | ${l.source.replace(/\|/g, "\\|")} |`),
	"",
	"## Every lead, imagined",
	"",
	"| Lead | Status | Verdict | Tool | Cluster | Verify | Factors | Angles | Mirrors | Opened |",
	"|---|---|---|---|---:|---:|---:|---:|---:|---:|",
	...im.rows.map((r) => `| ${r.lead} | ${r.status} | ${r.verdict} | ${r.tool ?? "—"} | ${r.cluster} | ${r.verify} | ${r.factors} | ${r.angles} | ${r.queries} | ${r.opened} |`),
	""
].join("\n");
// src/quantum/qec.ts
/** The operations that prepare one qubit in a logical state from |0⟩. Their reverse, adjoint by adjoint, undoes them; every
*  gate here is its own adjoint, so the reverse of the list suffices. */
var prepare = (q, state) => {
	if (state === "0") return [];
	if (state === "1") return [applied(X, q)];
	if (state === "+") return [applied(H, q)];
	return [applied(X, q), applied(H, q)];
};
/** The repetition code cycle: prepare the logical state on the first data qubit, encode it onto three, apply the channel once
*  to each data qubit, extract the syndromes d0⊕d1 and d1⊕d2 onto two ancillas, correct the data qubit the syndrome names with
*  Toffolis (open controls by X conjugation), decode, and undo the preparation, so that the first data qubit is |0⟩ exactly when
*  the logical qubit came through. Data qubits are line 0, 1, 2; the ancillas are line 3 and 4. */
var repetitionCycle = (code, channel, logical = "0") => {
	const [d0, d1, d2, a0, a1] = LineQubit.range(5);
	const data = [
		d0,
		d1,
		d2
	];
	const frame = code === "phase_flip" ? data.map((q) => applied(H, q)) : [];
	const ops = [
		...prepare(d0, logical),
		applied(CNOT, d0, d1),
		applied(CNOT, d0, d2),
		...frame,
		...data.map((q) => noisy(channel, q)),
		...frame,
		applied(CNOT, d0, a0),
		applied(CNOT, d1, a0),
		applied(CNOT, d1, a1),
		applied(CNOT, d2, a1),
		applied(X, a1),
		applied(TOFFOLI, a0, a1, d0),
		applied(X, a1),
		applied(TOFFOLI, a0, a1, d1),
		applied(X, a0),
		applied(TOFFOLI, a0, a1, d2),
		applied(X, a0),
		applied(CNOT, d0, d2),
		applied(CNOT, d0, d1),
		...prepare(d0, logical).reverse()
	];
	return new Circuit().append(ops);
};
/** The same logical qubit with no code: prepared, exposed to the channel once, and the preparation undone. */
var unencodedCycle = (channel, logical = "0") => {
	const q = LineQubit.of(0);
	return new Circuit().append([
		...prepare(q, logical),
		noisy(channel, q),
		...prepare(q, logical).reverse()
	]);
};
/** The probability that the first qubit (line 0) of a simulated circuit is |1⟩: the sum of the basis probabilities whose
*  lowest bit is set, since the basis order puts line 0 at bit 0. */
var errorOf = (circuit) => {
	const { probabilities, qubits } = new DensityMatrixSimulator().simulate(circuit);
	const index = qubits.findIndex((q) => q.kind === "line" && q.x === 0);
	return probabilities.reduce((sum, p, k) => k >> index & 1 ? sum + p : sum, 0);
};
var channelOf$1 = (name, p) => ({
	name,
	p
});
var codePoint = (code, channel, p, logical = "0") => ({
	p,
	physicalError: errorOf(unencodedCycle(channelOf$1(channel, p), logical)),
	logicalError: errorOf(repetitionCycle(code, channelOf$1(channel, p), logical))
});
/** The textbook figure for the code matched to its channel on a logical |0⟩ or |1⟩: 3p² − 2p³, the probability of two or more
*  flips among three, each pair of flips acting as the logical X the code cannot see. On |+⟩ or |−⟩ that logical X does nothing,
*  and for a channel the code is not built for the textbook gives no single formula; in both cases none is claimed. */
var textbookLogicalError = (code, channel, logical, p) => {
	return (code === "bit_flip" && channel === "bit_flip" || code === "phase_flip" && channel === "phase_flip") && (logical === "0" || logical === "1") ? 3 * p * p - 2 * p * p * p : null;
};
/** The break-even probability found from the simulation itself: the p at which the logical error stops being lower than the
*  physical error, located by bisection between the last sweep point where the code helps and the first where it does not.
*  Null when the sweep shows no crossing. */
var breakEvenOf = (code, channel, logical, sweep) => {
	const helps = (pt) => pt.logicalError < pt.physicalError;
	let lo = null;
	let hi = null;
	for (let i = 1; i < sweep.length; i++) if (helps(sweep[i - 1]) && !helps(sweep[i])) {
		lo = sweep[i - 1].p;
		hi = sweep[i].p;
		break;
	}
	if (lo === null || hi === null) return null;
	let [a, b] = [lo, hi];
	for (let step = 0; step < 50; step++) {
		const mid = (a + b) / 2;
		if (helps(codePoint(code, channel, mid, logical))) a = mid;
		else b = mid;
	}
	return (a + b) / 2;
};
// src/quantum/e2e.ts
/** The competition: every code decides from the same copies; the fastest code whose decision is the consensus wins. A tie goes to the stronger code (more copies checked). */
var competitionOf = (local, copies, consensus) => {
	const valid = copies.filter((c) => !c.kind).sort((a, b) => a.ms - b.ms);
	const runs = [];
	{
		const inv = valid.find((c) => c.involution);
		runs.push(inv ? {
			code: "involution",
			logical: inv.value,
			ms: inv.ms,
			correct: null,
			copiesUsed: 1 + valid.indexOf(inv) + 1
		} : {
			code: "involution",
			logical: null,
			ms: 0,
			correct: null,
			copiesUsed: 0
		});
	}
	runs.push(valid.length ? {
		code: "any",
		logical: valid[0].value,
		ms: valid[0].ms,
		correct: null,
		copiesUsed: 1
	} : {
		code: "any",
		logical: null,
		ms: 0,
		correct: null,
		copiesUsed: 0
	});
	{
		const seen = /* @__PURE__ */ new Map([[local, 1]]);
		let decided = null;
		let used = 1;
		for (const c of valid) {
			used += 1;
			const n = (seen.get(c.value) ?? 0) + 1;
			seen.set(c.value, n);
			if (n >= 2) {
				decided = {
					code: "first-two-agree",
					logical: c.value,
					ms: c.ms,
					correct: null,
					copiesUsed: used
				};
				break;
			}
		}
		runs.push(decided ?? {
			code: "first-two-agree",
			logical: null,
			ms: valid.at(-1)?.ms ?? 0,
			correct: null,
			copiesUsed: used
		});
	}
	{
		const agreeing = valid.find((c) => c.value === local);
		runs.push(agreeing ? {
			code: "tree-reference",
			logical: local,
			ms: agreeing.ms,
			correct: null,
			copiesUsed: 1 + valid.indexOf(agreeing) + 1
		} : {
			code: "tree-reference",
			logical: null,
			ms: valid.at(-1)?.ms ?? 0,
			correct: null,
			copiesUsed: 1 + valid.length
		});
	}
	runs.push({
		code: "majority",
		logical: consensus,
		ms: Math.max(0, ...copies.map((c) => c.ms)),
		correct: null,
		copiesUsed: 1 + copies.length
	});
	for (const r of runs) r.correct = consensus === null ? null : r.logical === consensus;
	const strength = {
		any: 0,
		"first-two-agree": 1,
		"tree-reference": 2,
		majority: 3,
		involution: 4
	};
	return {
		codes: runs,
		winner: runs.filter((r) => r.correct).sort((a, b) => a.ms - b.ms || strength[b.code] - strength[a.code])[0]?.code ?? null
	};
};
/** The tools never called through the gate: the flow (they fetch), the audit and the metrics (they replay everything). */
var E2E_SKIP = /* @__PURE__ */ new Set([
	"discover",
	"wave",
	"readiness",
	"imagine",
	"e2e",
	"audit",
	"metrics"
]);
/** The hash of a result with the clock masked: ISO 8601 instants and epoch-shaped integers (seconds or milliseconds since 2020) become one token, so copies computed at different moments agree and only what the arguments determine is compared. */
var hashOf = (v) => uuidOf((JSON.stringify(v) ?? "undefined").replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})/g, "<instant>").replace(/(?<![\d.])1[6-9]\d{8}(\d{3})?(?![\d.])/g, "<epoch>"));
/** The combinations: every example and every dashboard cell, once per host, with the tree's own answer hashed. */
var e2eRequestsOf = (ctx, hosts, only) => {
	const tools = ctx.handle({
		jsonrpc: "2.0",
		id: 1,
		method: "tools/list"
	}).result.tools;
	const boxOf = new Map(tools.map((t) => [t.name, t._meta?.toolbox ?? "none"]));
	const combos = /* @__PURE__ */ new Map();
	const add = (tool, args, from) => {
		if (E2E_SKIP.has(tool) || args.selftest || !boxOf.has(tool) || only && !only.includes(tool)) return;
		const combo = uuidOf(`${tool}${JSON.stringify(args)}`);
		if (!combos.has(combo)) combos.set(combo, {
			tool,
			from,
			arguments: args
		});
	};
	for (const e of ctx.examples) add(e.tool, e.arguments, "example");
	for (const t of tools) if (!E2E_SKIP.has(t.name) && (!only || only.includes(t.name))) {
		const d = ctx.handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/call",
			params: {
				name: "dashboard",
				arguments: { tool: t.name }
			}
		});
		for (const c of d.result?.structuredContent.cellList ?? []) add(t.name, c.arguments, "cell");
	}
	const out = [];
	for (const [combo, c] of combos) {
		const r = ctx.handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/call",
			params: {
				name: c.tool,
				arguments: c.arguments
			}
		});
		const local = r.result ? hashOf(r.result.structuredContent) : hashOf({ error: r.error?.message });
		for (const host of hosts) out.push({
			id: `${combo}@${new URL(host).host}`,
			combo,
			tool: c.tool,
			toolbox: boxOf.get(c.tool),
			from: c.from,
			arguments: c.arguments,
			host: new URL(host).host,
			url: host,
			method: "POST",
			accept: "application/json, text/event-stream",
			headers: { "if-none-match": `"${local}"` },
			body: rpcBody("tools/call", {
				name: c.tool,
				arguments: c.arguments
			}),
			local,
			...r.error ? { localError: r.error.message } : {}
		});
	}
	return out;
};
/** One host's answer read into the hash of what it computed, or the error it answered. */
var valueOf = (a) => {
	if (a.status === 304 && a.local) return a.etag === `"${a.local}"` && (!a.address || !a.combo || a.address === a.combo) ? {
		value: a.local,
		involution: true,
		materialised: true
	} : {
		value: "HTTP 304 unverified: the hash or the address the host echoed is not the one held here",
		kind: "erasure"
	};
	if (a.status !== 200) return {
		value: `HTTP ${a.status}`,
		kind: "erasure"
	};
	try {
		const j = JSON.parse(dataOf(a.text));
		if (j.error) return {
			value: hashOf({ error: j.error.message }),
			kind: "refusal"
		};
		if (j.result?.isError) return {
			value: hashOf({ error: j.result.content?.[0]?.text }),
			kind: "refusal"
		};
		return { value: hashOf(j.result?.structuredContent) };
	} catch {
		return {
			value: "not JSON",
			kind: "erasure"
		};
	}
};
/** The answers decoded, combination by combination: majority over the tree's copy and the hosts' copies. */
var e2eOf = (answers) => {
	const groups = /* @__PURE__ */ new Map();
	for (const a of answers) (groups.get(a.combo) ?? groups.set(a.combo, []).get(a.combo)).push(a);
	const decoded = [];
	for (const [combo, as] of groups) {
		const first = as[0];
		const copies = as.map((a) => {
			const v = valueOf(a);
			return {
				host: a.host,
				...v.kind === "refusal" && v.value === a.local ? { value: v.value } : v,
				ms: a.ms
			};
		});
		const involutions = copies.filter((c) => c.involution).length;
		const materialised = copies.filter((c) => c.materialised || !c.kind && c.value === first.local).length;
		const votes = /* @__PURE__ */ new Map([[first.local, 1]]);
		for (const c of copies) if (!c.kind) votes.set(c.value, (votes.get(c.value) ?? 0) + 1);
		const total = 1 + copies.filter((c) => !c.kind).length;
		const [logical, n] = [...votes.entries()].sort((x, y) => y[1] - x[1])[0];
		const majority = n * 2 > total;
		const flipped = copies.filter((c) => !c.kind && c.value !== logical);
		const erased = copies.filter((c) => c.kind);
		const syndrome = [...flipped, ...erased].map((c) => c.host);
		const errors = [...flipped.map((c) => ({
			kind: "flip",
			host: c.host,
			got: c.value
		})), ...erased.map((c) => ({
			kind: c.kind,
			host: c.host,
			got: c.value
		}))].map((e) => ({
			uuid: uuidOf(`e2e${e.kind}${e.host}${combo}${first.local}${e.got}`),
			...e,
			tool: first.tool,
			combo,
			expected: logical,
			syndrome
		}));
		const outcome = !majority ? "uncorrectable" : flipped.length ? "corrected" : erased.length ? "erased" : "agree";
		const possibilities = [.../* @__PURE__ */ new Set([first.local, ...copies.filter((c) => !c.kind).map((c) => c.value)])].map((value) => ({
			value,
			copies: [...first.local === value ? ["tree"] : [], ...copies.filter((c) => !c.kind && c.value === value).map((c) => c.host)]
		})).sort((a, b) => b.copies.length - a.copies.length);
		const { codes, winner } = competitionOf(first.local, copies, majority ? logical : null);
		decoded.push({
			combo,
			tool: first.tool,
			toolbox: first.toolbox,
			from: first.from,
			local: first.local,
			copies: copies.map((c) => ({
				host: c.host,
				value: c.value,
				ms: c.ms,
				...c.involution ? { involution: true } : {}
			})),
			outcome,
			logical: majority ? logical : "none",
			syndrome,
			errors,
			codes,
			winner,
			possibilities,
			involutions,
			materialised
		});
	}
	const outcomes = {
		agree: 0,
		corrected: 0,
		erased: 0,
		uncorrectable: 0
	};
	for (const d of decoded) outcomes[d.outcome] += 1;
	const errors = decoded.flatMap((d) => d.errors);
	const copies = answers.length;
	const physicalErrorRate = copies ? errors.length / copies : 0;
	const logicalErrorRate = decoded.length ? outcomes.uncorrectable / decoded.length : 0;
	const byHost = {};
	for (const host of new Set(answers.map((a) => a.host))) {
		const mine = answers.filter((a) => a.host === host);
		const ms = mine.map((a) => a.ms).sort((x, y) => x - y);
		byHost[host] = {
			version: mine.find((a) => a.version)?.version ?? null,
			copies: mine.length,
			involutions: mine.filter((a) => a.status === 304).length,
			flips: errors.filter((e) => e.host === host && e.kind === "flip").length,
			erasures: errors.filter((e) => e.host === host && e.kind === "erasure").length,
			refusals: errors.filter((e) => e.host === host && e.kind === "refusal").length,
			msMedian: ms[Math.floor(ms.length / 2)] ?? 0
		};
	}
	const byToolbox = {};
	for (const d of decoded) {
		const b = byToolbox[d.toolbox] ??= {
			agree: 0,
			corrected: 0,
			erased: 0,
			uncorrectable: 0
		};
		b[d.outcome] += 1;
	}
	const leads = [...decoded.filter((d) => d.outcome === "uncorrectable").map((d) => ({
		id: `e2e-uncorrectable-${d.tool}-${d.combo.slice(0, 8)}`,
		statement: `${d.tool} ${JSON.stringify(answers.find((a) => a.combo === d.combo).arguments).slice(0, 80)}: no majority among the tree and ${d.copies.length} host(s) (${d.copies.map((c) => `${c.host}=${c.value.slice(0, 8)}`).join(", ")}; tree=${d.local.slice(0, 8)})`,
		status: "open",
		reason: "the hosts run different code or the result depends on time or state; deploy, or make the result a function of its arguments"
	})), ...Object.entries(byHost).filter(([, h]) => h.flips + h.erasures + h.refusals > 0).map(([host, h]) => ({
		id: `e2e-host-${host}`,
		statement: `${host}: ${h.flips} flip(s), ${h.erasures} erasure(s), ${h.refusals} refusal(s) over ${h.copies} copies; the syndrome names it`,
		status: "open",
		reason: h.erasures === h.copies ? "the host did not answer: not deployed, or the network; an erasure is decoded from the other copies" : "the host answers differently from the majority: deploy the tree there, or the result depends on the host (tenant, time)"
	}))];
	const winners = {};
	for (const d of decoded) if (d.winner) winners[d.winner] = (winners[d.winner] ?? 0) + 1;
	const msMajority = decoded.reduce((n, d) => n + (d.codes.find((c) => c.code === "majority")?.ms ?? 0), 0);
	const msWinners = decoded.reduce((n, d) => n + (d.codes.find((c) => c.code === d.winner)?.ms ?? d.codes.find((c) => c.code === "majority")?.ms ?? 0), 0);
	const involutions = decoded.reduce((n, d) => n + d.involutions, 0);
	const materialised = decoded.reduce((n, d) => n + d.materialised, 0);
	const referers = {};
	for (const a of answers) if (a.status === 304) referers[a.combo] = (referers[a.combo] ?? 0) + 1;
	const versions = [...new Set(Object.values(byHost).map((h) => h.version).filter((v) => !!v))];
	return {
		combos: decoded.length,
		copies,
		involutions,
		materialised,
		referers: Object.keys(referers).length,
		teleportsByReferer: referers,
		bytesSaved: answers.filter((a) => a.status === 304).length,
		versions,
		outcomes,
		competition: {
			winners,
			msMajority,
			msWinners,
			saved: msMajority - msWinners
		},
		physicalErrorRate,
		logicalErrorRate,
		textbookLogical: textbookLogicalError("bit_flip", "bit_flip", "0", physicalErrorRate),
		byHost,
		byToolbox,
		errors,
		decoded,
		leads
	};
};
var e2ePageOf = (r, date, hosts, partial) => [
	"---",
	"title: End to end",
	"order: 56",
	"---",
	"",
	"# End to end: the gate as a repetition code",
	"",
	`Generated by \`npm run next\` on ${date} through the \`e2e\` tool: ${r.combos} combinations (every dashboard cell and every example) called on ${hosts.length} host(s) (${hosts.join(", ")}), ${r.copies} copies decoded by majority with the tree's own answer${partial.remaining ? `; ${partial.remaining} request(s) wait for the next quantum` : ""}.`,
	"",
	"| Outcome | Combinations |",
	"|---|---:|",
	...Object.entries(r.outcomes).map(([k, v]) => `| ${k} | ${v} |`),
	`| copies proven by involution (304: the hash named in the request, no body) | ${r.involutions} |`,
	`| copies materialised here (the full content held and its hash verified at the destination) | ${r.materialised} |`,
	`| referer blocks that collected teleports | ${r.referers} |`,
	`| physical error rate (errors / copies) | ${r.physicalErrorRate.toFixed(4)} |`,
	`| logical error rate (uncorrectable / combinations) | ${r.logicalErrorRate.toFixed(4)} |`,
	`| textbook 3-copy repetition at that p (3p² − 2p³) | ${r.textbookLogical === null ? "—" : r.textbookLogical.toFixed(4)} |`,
	"",
	"## The competition of codes",
	"",
	"Every combination is decided by five codes at once — involution (a host answered 304 to the hash the request named: the content proven equal at the edge, nothing computed or sent), any (the fastest answer, unchecked), first-two-agree (the race ends when two copies agree), tree-reference (the tree's answer once the fastest host confirms it), majority (every copy) — and the fastest code whose decision is the consensus wins; a tie goes to the stronger code. An uncorrectable combination lists its possibilities: every value some copies hold.",
	"",
	"| Winner | Combinations |",
	"|---|---:|",
	...Object.entries(r.competition.winners).map(([k, v]) => `| ${k} | ${v} |`),
	`| ms, majority alone | ${r.competition.msMajority} |`,
	`| ms, the winners | ${r.competition.msWinners} |`,
	`| ms saved | ${r.competition.saved} |`,
	"",
	"| Combination | Tool | Outcome | Winner | Possibilities |",
	"|---|---|---|---|---|",
	...r.decoded.filter((d) => d.outcome !== "agree").map((d) => `| ${d.combo.slice(0, 8)} | ${d.tool} | ${d.outcome} | ${d.winner ?? "—"} | ${d.possibilities.map((p) => `${p.value.slice(0, 8)}: ${p.copies.join(" ")}`).join("; ")} |`),
	"",
	"## By host",
	"",
	`Versions answering: ${r.versions.join(", ") || "none named"}${r.versions.length > 1 ? " — a migration in flight: hosts on different versions are copies of one value, and uptime is whole while every combination still agrees" : ""}.`,
	"",
	"| Host | Version | Copies | Involutions (304) | Flips | Erasures | Refusals | Median ms |",
	"|---|---|---:|---:|---:|---:|---:|---:|",
	...Object.entries(r.byHost).map(([h, x]) => `| ${h} | ${x.version ?? "—"} | ${x.copies} | ${x.involutions} | ${x.flips} | ${x.erasures} | ${x.refusals} | ${x.msMedian} |`),
	"",
	"## By toolbox",
	"",
	"| Toolbox | Agree | Corrected | Erased | Uncorrectable |",
	"|---|---:|---:|---:|---:|",
	...Object.entries(r.byToolbox).map(([b, x]) => `| ${b} | ${x.agree} | ${x.corrected} | ${x.erased} | ${x.uncorrectable} |`),
	"",
	"## Errors, as blocks in the stream",
	"",
	"Each error is a UUID over its kind, host, combination and hashes; the stream `e2e.ndjson` carries these lines and no bodies.",
	"",
	"| UUID | Kind | Host | Tool | Expected | Got | Syndrome |",
	"|---|---|---|---|---|---|---|",
	...r.errors.map((e) => `| ${e.uuid} | ${e.kind} | ${e.host} | ${e.tool} | ${e.expected.slice(0, 8)} | ${e.got.slice(0, 8)} | ${e.syndrome.join(" ")} |`),
	"",
	"## Leads",
	"",
	"| Lead | Statement | Reason |",
	"|---|---|---|",
	...r.leads.map((l) => `| ${l.id} | ${l.statement.replace(/\|/g, "\\|")} | ${l.reason} |`),
	""
].join("\n");
// src/quantum/selftest.ts
var UNIT = "https://unit.test/mcp";
var rpcOk = (result) => JSON.stringify({
	jsonrpc: "2.0",
	id: 1,
	result
});
var call = (structured) => rpcOk({
	content: [{
		type: "text",
		text: JSON.stringify(structured)
	}],
	structuredContent: structured
});
/** The client of the fixture: answers every request the discover tool emits, as the hosts would. */
var answerOf$1 = (r) => {
	const text = (status, type, body) => ({
		...r,
		status,
		type,
		text: body
	});
	if (r.purpose === "mcp-list") return text(200, "application/json", rpcOk({ tools: [{
		name: "list_tools",
		description: "Every tool: {} lists; {name} gives one contract.",
		inputSchema: {
			type: "object",
			properties: { name: { type: "string" } }
		}
	}, {
		name: "get_rights",
		description: "Get rights. Returns {license,receipt}.",
		inputSchema: {
			type: "object",
			properties: {}
		}
	}] }));
	if (r.purpose === "catalogue") return text(200, "application/json", call({ tools: [
		{
			name: "list_tools",
			description: "the catalogue"
		},
		{
			name: "get_rights",
			description: "Get rights. Returns {license,receipt}."
		},
		{
			name: "verify_claim",
			description: "Verify claim. Returns {statement,verdict,receipt,note}."
		},
		{
			name: "get_css",
			description: "Get css. Returns {css}."
		},
		{
			name: "sign_commit",
			description: "Sign commit. Returns {signed,verdict,address}."
		}
	] }));
	if (r.purpose === "contract" && r.name === "verify_claim") return text(200, "application/json", call({
		name: "verify_claim",
		inputSchema: {
			type: "object",
			properties: { statement: { type: "string" } },
			required: ["statement"]
		},
		outputSchema: {
			type: "object",
			properties: {
				statement: {},
				verdict: {},
				receipt: {},
				note: {}
			}
		},
		annotations: { readOnlyHint: true }
	}));
	if (r.purpose === "contract" && r.name === "sign_commit") return text(200, "application/json", call({
		name: "sign_commit",
		inputSchema: {
			type: "object",
			properties: {
				message: { type: "string" },
				theorems: { type: "array" }
			},
			required: ["message", "theorems"]
		},
		outputSchema: {
			type: "object",
			properties: {
				signed: {},
				verdict: {},
				address: {}
			}
		},
		annotations: { readOnlyHint: true }
	}));
	if (r.purpose === "well-known") return text(404, "text/html", "<html><title>404</title></html>");
	if (r.purpose === "api-contract") {
		if (r.host === "raw.githubusercontent.com") return text(200, "application/json", JSON.stringify({
			openapi: "3.1.0",
			paths: {
				"/repos/{owner}/{repo}": {},
				"/orgs/{org}/repos": {}
			}
		}));
		if (r.host === "en.wikipedia.org") return text(200, "application/yaml", "openapi: 3.0.1\npaths:\n  /page/summary/{title}:\n    get: {}\n");
		if (r.host === "export.arxiv.org") return text(200, "text/xml", "<OAI-PMH><Identify><repositoryName>arXiv</repositoryName></Identify></OAI-PMH>");
		if (r.host === "api.crossref.org") return text(200, "text/html", "<html><title>Crossref Swagger UI</title></html>");
		return text(404, "text/html", "<html><title>not found</title></html>");
	}
	return text(0, "", "fetch failed: no fixture");
};
/** The whole suite: every direction, every toolbox feeding the next. */
var flowSelftestOf = (handle, examples, leads) => {
	const checks = [];
	let clock = Date.now();
	const check = (id, passed, evidence) => {
		const now = Date.now();
		checks.push({
			id,
			passed,
			evidence,
			ms: now - clock
		});
		clock = now;
	};
	const safe = (id, f) => {
		try {
			f();
		} catch (e) {
			check(id, false, `threw: ${e.message.slice(0, 160)}`);
		}
	};
	const requests = discoveryRequestsOf([UNIT], VERIFIERS);
	const answers = requests.map(answerOf$1);
	check("discover:requests-answerable", answers.every((a) => a.status !== 0), `${requests.length} requests, every one answered by the client fixture`);
	const followUps = followUpsOf(answers);
	check("discover:follow-ups", followUps.map((f) => f.name).sort().join(",") === "sign_commit,verify_claim", `follow-ups for ${followUps.map((f) => f.name).join(", ") || "none"}: the catalogue doors that answer a verdict and are not in tools/list`);
	const all = [...answers, ...followUps.map(answerOf$1)];
	check("discover:no-third-wave", followUpsOf(all).length === 0, "every follow-up answered, nothing left to ask");
	const discovery = discoveryOf(all, VERIFIERS);
	const unitDoors = discovery.hosts.find((h) => h.host === "unit.test" && h.kind === "mcp")?.doors ?? [];
	check("discover:doors-read", unitDoors.length === 5 && unitDoors.some((d) => d.name === "verify_claim" && d.contract === "catalogue" && d.required.join() === "statement"), `${unitDoors.length} doors: ${unitDoors.map((d) => d.name).join(", ")}`);
	check("discover:capabilities", discovery.capabilities.statementVerdict.join() === "verify_claim" && discovery.capabilities.signing.join() === "sign_commit" && discovery.capabilities.rbac.length === 0 && discovery.capabilities.metaphysics.length === 0, JSON.stringify(discovery.capabilities));
	const gh = discovery.hosts.find((h) => h.host === "raw.githubusercontent.com");
	check("discover:openapi-paths", gh?.detected === "openapi 3.1.0" && gh.paths?.length === 2, `${gh?.detected}: ${gh?.paths?.join(", ")}`);
	check("discover:openapi-yaml", discovery.hosts.find((h) => h.host === "en.wikipedia.org")?.paths?.join() === "/page/summary/{title}", "yaml paths read");
	check("discover:oai-and-html", discovery.hosts.find((h) => h.host === "export.arxiv.org")?.detected === "oai-pmh identify" && discovery.hosts.find((h) => h.host === "api.crossref.org")?.detected === "html page", "identify and html page detected");
	check("discover:leads", discovery.leads.some((l) => l.id === "contract-api.crossref.org") && discovery.leads.some((l) => l.id === "contract-oeis.org"), `${discovery.leads.length} contract leads: the html page and the hosts with no machine contract named`);
	safe("discover:page", () => check("discover:page", discoveryPageOf(discovery, "2026-01-01").includes("| unit.test | mcp |"), "the page renders the hosts table"));
	const two = leads.filter((l) => l.id === "willow-spec" || l.id === "repo-cirq").concat(leads.filter((l) => l.status === "open" && l.source.startsWith("quantumai.google/")).slice(0, 1));
	const wreq = waveRequestsOf(two, []);
	check("wave:requests", wreq.length > 0 && wreq.every((r) => r.verifier && r.url.startsWith("http") && r.check && r.leads.length > 0), `${wreq.length} requests from ${two.length} leads, each with verifier, url, check and leads`);
	const wave = waveOf([
		{
			verifier: "source-page",
			url: "https://quantumai.google/cirq/build",
			check: "the page states: the page cirq/build",
			leads: ["page:cirq/build"],
			status: 200,
			ok: true,
			ms: 1,
			text: "<html><title>Research libraries and tools &nbsp;|&nbsp; Cirq</title></html>"
		},
		{
			verifier: "source-page",
			url: "https://quantumai.google/learn",
			check: "the page states: Learn overview",
			leads: ["learn"],
			status: 404,
			ok: false,
			ms: 1,
			text: "<html><title>404</title></html>"
		},
		{
			verifier: "source-page",
			url: "https://quantumai.google/hardware",
			check: "the page states: Willow",
			leads: ["willow-title"],
			status: 200,
			ok: true,
			ms: 1,
			text: "<html><title>How many qubits does Willow have?</title></html>"
		},
		{
			verifier: "github",
			url: "https://raw.githubusercontent.com/repos/quantumlib/Cirq",
			check: "the repository exists",
			leads: ["repo-cirq"],
			status: 200,
			ok: true,
			ms: 1,
			text: "{\"description\":\"A Python framework\",\"language\":\"Python\"}"
		},
		{
			verifier: "github",
			url: "https://raw.githubusercontent.com/nowhere",
			check: "a path outside the contract",
			leads: ["repo-x"],
			status: 200,
			ok: true,
			ms: 1,
			text: "{}"
		}
	], Object.fromEntries(discovery.hosts.filter((h) => h.paths?.length).map((h) => [h.host, h.paths])));
	check("wave:notes", wave.results.find((r) => r.url.endsWith("/cirq/build"))?.note === "title=\"Research libraries and tools &nbsp;|&nbsp; Cirq\"" && wave.results.find((r) => r.leads.includes("repo-cirq"))?.note === "description=\"A Python framework\" language=Python", "titles and GitHub descriptions read from the bodies");
	check("wave:contracted", wave.results.find((r) => r.leads.includes("repo-cirq"))?.contracted === "yes" && wave.results.find((r) => r.leads.includes("repo-x"))?.contracted === "no" && wave.results.find((r) => r.verifier === "source-page")?.contracted === "unknown", "yes inside the discovered contract, no outside it, unknown where no contract was discovered");
	check("wave:summary", wave.summary["source-page"]?.requests === 3 && wave.summary["source-page"]?.ok === 2 && wave.summary.github?.contracted === 1 && wave.summary.github?.uncontracted === 1, JSON.stringify(wave.summary));
	safe("wave:page", () => check("wave:page", wavePageOf(wave, two.length, "2026-01-01", true).includes("| github | 2 | 2 | 1 | 1 |"), "the page renders the summary row"));
	const match = matcherOf(handle, examples, leads);
	const pages = pagesOf(wave.results);
	const fixture = [
		{
			id: "served-one",
			source: "quantumai.google/x",
			statement: "served",
			status: "served",
			tool: "processor"
		},
		{
			id: "cleanup-gone",
			source: "scripts/gone.ts",
			statement: "removed",
			status: "out_of_scope",
			reason: "removed"
		},
		{
			id: "cleanup-back",
			source: "scripts/back.ts",
			statement: "removed",
			status: "out_of_scope",
			reason: "removed"
		},
		{
			id: "learn",
			source: "quantumai.google/learn",
			statement: "Learn overview",
			status: "blocked",
			reason: "404"
		},
		{
			id: "partial-one",
			source: "quantumai.google/y",
			statement: "part",
			status: "partial",
			tool: "statements",
			reason: "owes the rest"
		},
		{
			id: "willow-title",
			source: "quantumai.google/hardware",
			statement: "the page hardware",
			status: "open",
			reason: "no tool follows"
		},
		{
			id: "page:cirq/build",
			source: "quantumai.google/cirq/build",
			statement: "the page cirq/build",
			status: "open",
			reason: "no tool follows"
		},
		{
			id: "declared",
			source: "quantumai.google/z",
			statement: "other vendor",
			status: "out_of_scope",
			reason: "not this layer"
		},
		{
			id: "owed",
			source: "uuidna.com/mcp",
			statement: "the deploy",
			status: "open",
			reason: "the author's act"
		}
	];
	const judged = fixture.map((l) => judgeOf(l, pages, /* @__PURE__ */ new Set(["scripts/back.ts"]), match, "2026-01-01T00:00:00Z"));
	const cls = Object.fromEntries(judged.map((j) => [j.lead, j.class]));
	check("readiness:judge", cls["served-one"] === "served" && cls["cleanup-gone"] === "refuted" && cls["cleanup-back"] === "trial" && cls.learn === "refuted" && cls["partial-one"] === "trial" && cls["willow-title"] === "served" && cls["page:cirq/build"] === "refuted" && cls.declared === "refuted" && cls.owed === "trial", JSON.stringify(cls));
	check("readiness:judge-evidence", judged.find((j) => j.lead === "page:cirq/build").by.includes("covers") && judged.find((j) => j.lead === "willow-title").by.includes("by processor") && judged.find((j) => j.lead === "learn").by.startsWith("HTTP 404"), judged.filter((j) => [
		"page:cirq/build",
		"willow-title",
		"learn"
	].includes(j.lead)).map((j) => j.by.slice(0, 60)).join(" | "));
	const sources = sourcesOf(judged, fixture);
	const q = sources.find((s) => s.source === "quantumai.google");
	check("readiness:sources", q?.settled === 5 && q.open.length === 1 && sources.find((s) => s.source === "scripts")?.open[0]?.owes === "scripts/back.ts is present again" && sources.find((s) => s.source === "uuidna.com")?.why === "1 open of 1", sources.map((s) => `${s.source} ${s.why}`).join("; "));
	const plan = borderPlanOf(discovery, {
		key: "clay_sigma",
		statement: "1 + 1 = 2"
	});
	check("readiness:border-plan", plan.calls.length === 1 && plan.calls[0].door === "verify_claim" && plan.calls[0].arguments.statement === "clay_sigma: 1 + 1 = 2" && plan.unfillable.length === 0, JSON.stringify(plan.calls));
	const border = borderOf([
		{
			door: "verify_claim",
			host: "unit.test",
			arguments: plan.calls[0].arguments,
			answer: {
				verdict: "VERIFIED",
				receipt: "r-1",
				note: "decided"
			}
		},
		{
			door: "deposit_trial",
			host: "unit.test",
			arguments: {},
			refusal: "the edge does not hold the whole ledger"
		},
		{
			door: "prove_verdict",
			host: "unit.test",
			arguments: {},
			answer: {
				verdict: "UNVERIFIED",
				receipt: "r-2"
			}
		}
	]);
	check("readiness:border-read", border[0].sealed && border[0].receipt === "r-1" && !border[1].sealed && (border[1].refusal ?? "").startsWith("the edge") && !border[2].sealed && border[2].verdict === "UNVERIFIED", border.map((b) => `${b.door}:${b.verdict ?? b.refusal?.slice(0, 20)}:${b.sealed}`).join(" "));
	safe("readiness:page", () => check("readiness:page", readinessPageOf({
		unit: UNIT,
		date: "2026-01-01",
		measured: "2026-01-01",
		discovered: "2026-01-01",
		probe: {
			key: "clay_sigma",
			statement: "1 + 1 = 2"
		},
		judged,
		classes: {
			served: judged.filter((j) => j.class === "served").length,
			refuted: judged.filter((j) => j.class === "refuted").length,
			trial: judged.filter((j) => j.class === "trial").length
		},
		sources,
		border,
		sealedBy: ["verify_claim"],
		answers: {
			readiness: {
				ready: false,
				why: "fixture",
				settled: 7,
				asked: 3,
				answered: 3,
				receipt: "fixture"
			},
			auras: {},
			rights: { drift: [] },
			address: {
				probe: "qpu",
				here: "a",
				unit: "a",
				agree: true,
				note: "fixture"
			}
		}
	}).includes("Sealed or verified by: verify_claim."), "the page renders the border verdict"));
	safe("imagine:subset", () => {
		const im = imagineOf(handle, examples, leads, ["willow-spec", "learn"]);
		check("imagine:subset", im.leads === 2 && im.rows.length === 2 && Object.values(im.verdicts).reduce((a, b) => a + b, 0) === 2 && im.imagined.some((l) => l.id.startsWith("application-")) && imaginePageOf(im, "2026-01-01", 10).includes("| willow-spec |"), `${im.rows.map((r) => `${r.lead}:${r.verdict}`).join(" ")}; ${im.imaginedLeads} imagined`);
	});
	{
		const base = {
			combo: "c1",
			tool: "clay",
			toolbox: "tree",
			from: "example",
			arguments: {},
			url: "",
			method: "POST",
			accept: "",
			headers: {},
			body: null,
			local: "L"
		};
		const ok = JSON.stringify({
			jsonrpc: "2.0",
			id: 1,
			result: { structuredContent: { v: 1 } }
		});
		const L = valueOf({
			status: 200,
			text: ok
		}).value;
		const answers = [
			{
				...base,
				local: L,
				id: "c1@a",
				host: "a",
				status: 200,
				ms: 10,
				text: ok
			},
			{
				...base,
				local: L,
				id: "c1@b",
				host: "b",
				status: 200,
				ms: 20,
				text: "event: message\ndata: " + JSON.stringify({
					jsonrpc: "2.0",
					id: 1,
					result: { structuredContent: { v: 2 } }
				}) + "\n\n"
			},
			{
				...base,
				local: L,
				id: "c1@c",
				host: "c",
				status: 0,
				ms: 5,
				text: "fetch failed"
			},
			{
				...base,
				combo: "c2",
				local: "X",
				id: "c2@a",
				host: "a",
				status: 200,
				ms: 1,
				text: ok
			},
			{
				...base,
				combo: "c2",
				local: "X",
				id: "c2@b",
				host: "b",
				status: 200,
				ms: 1,
				text: JSON.stringify({
					jsonrpc: "2.0",
					id: 1,
					result: { structuredContent: { v: 3 } }
				})
			}
		];
		const r = e2eOf(answers);
		const d1 = r.decoded.find((d) => d.combo === "c1");
		const d2 = r.decoded.find((d) => d.combo === "c2");
		check("e2e:corrected-by-majority", d1.outcome === "corrected" && d1.logical === L && d1.syndrome.join() === "b,c" && d1.errors.map((e) => e.kind).join() === "flip,erasure", `c1: ${d1.outcome}, syndrome ${d1.syndrome.join(" ")}`);
		check("e2e:uncorrectable-without-majority", d2.outcome === "uncorrectable" && d2.logical === "none" && r.logicalErrorRate === .5, `c2: ${d2.outcome}, logical error rate ${r.logicalErrorRate}`);
		check("e2e:errors-are-uuid-blocks", r.errors.length === 4 && r.errors.every((e) => /^[0-9a-f-]{36}$/.test(e.uuid)) && e2eOf(answers).errors[0].uuid === r.errors[0].uuid && !JSON.stringify(r.errors).includes("\"v\":"), `${r.errors.length} error blocks (the two suspects of an uncorrectable combination count), deterministic uuids, no bodies`);
		check("e2e:competition-fastest-correct-code-wins", d1.winner === "tree-reference" && d1.codes.find((c) => c.code === "tree-reference").ms === 10 && d1.codes.find((c) => c.code === "majority").ms === 20 && d1.codes.find((c) => c.code === "any").correct === true && d2.winner === null && d2.possibilities.length === 3 && r.competition.saved === 10, `c1 won by ${d1.winner} at ${d1.codes.find((c) => c.code === d1.winner)?.ms} ms against majority at 20; c2 has ${d2.possibilities.length} possibilities and no winner; ${r.competition.saved} ms saved`);
		const inv = e2eOf([{
			...base,
			combo: "c3",
			local: "Z",
			id: "c3@a",
			host: "a",
			status: 304,
			ms: 3,
			text: "",
			etag: "\"Z\"",
			address: "c3"
		}, {
			...base,
			combo: "c3",
			local: "Z",
			id: "c3@b",
			host: "b",
			status: 304,
			ms: 9,
			text: "",
			etag: "\"Z\"",
			address: "c3"
		}]).decoded[0];
		const unv = e2eOf([{
			...base,
			combo: "c4",
			local: "Z",
			id: "c4@a",
			host: "a",
			status: 304,
			ms: 3,
			text: "",
			etag: "\"Q\"",
			address: "c4"
		}]).decoded[0];
		check("e2e:teleport-materialised-or-erased", inv.materialised === 2 && unv.outcome === "erased" && unv.involutions === 0 && unv.errors[0].kind === "erasure", `two 304s with the held hash materialise; a 304 echoing another hash is an erasure`);
		check("e2e:involution-proves-at-the-edge", inv.outcome === "agree" && inv.involutions === 2 && inv.winner === "involution" && inv.codes.find((c) => c.code === "involution").ms === 3 && inv.logical === "Z", `two 304 copies: ${inv.outcome}, won by ${inv.winner} at 3 ms`);
		check("e2e:rates-against-textbook", r.physicalErrorRate === 4 / 5 && r.textbookLogical !== null && Math.abs(r.textbookLogical - (1.92 - 1.024)) < 1e-12 && r.leads.some((l) => l.id.startsWith("e2e-uncorrectable-")) && r.byHost.c.erasures === 1, `p=${r.physicalErrorRate}, textbook ${r.textbookLogical}, ${r.leads.length} leads`);
	}
	return {
		passed: checks.every((c) => c.passed),
		checks
	};
};
// src/quantum/widgets.ts
var escape = (text) => text.replace(/[&<>"']/g, (c) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[c]);
var cards = (items) => `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--gap-md);">${items.map(([label, value]) => `<div style="background: var(--surface-1); border-radius: var(--radius); padding: var(--pad-md);"><div style="font-size: var(--font-size-footnote); color: var(--text-muted);">${escape(label)}</div><div style="font-size: var(--font-size-title); font-weight: 500; color: var(--text-primary);">${escape(value)}</div></div>`).join("")}</div>`;
var bar = (percent) => `<div style="height: 6px; background: var(--surface-1); border-radius: var(--radius); overflow: hidden;"><div style="width: ${Math.min(100, Math.max(0, percent)).toFixed(2)}%; height: 100%; background: var(--fill-accent);"></div></div>`;
var table = (head, rows) => `<div style="background: var(--surface-2); border: 0.5px solid var(--border); border-radius: 12px; padding: var(--pad-sm) var(--pad-md); overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: var(--font-size-footnote);"><thead><tr>${head.map((h) => `<th style="text-align: left; color: var(--text-secondary); font-weight: 500; padding: var(--gap-xs) var(--gap-sm); border-bottom: 0.5px solid var(--border);">${escape(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((cell) => `<td style="color: var(--text-primary); padding: var(--gap-xs) var(--gap-sm); border-bottom: 0.5px solid var(--border);">${escape(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
var stack = (parts) => `<div style="font-family: var(--font-sans); color: var(--text-primary); display: grid; gap: var(--gap-md);">${parts.join("")}</div>`;
/** The figure as the sheet states it: a mean with its spread, both as percentages with three decimals. */
var percent = ({ mean, spread }) => `${(mean * 100).toFixed(3)}% ± ${(spread * 100).toFixed(3)}%`;
var processorWidget = (p) => {
	if (!("chips" in p)) return stack([cards([["Qubits", String(p.qubits)], ["Couplers", String(p.couplers)]]), table(["Figure", "Value"], [...p.statedQubits === void 0 ? [] : [["Stated qubits", String(p.statedQubits)], ["Stated couplers", String(p.statedCouplers)]], ["Layout", p.layout]])]);
	const one = p.chips.errorCorrection;
	const two = p.chips.randomCircuitSampling;
	return stack([cards([
		["Qubits", String(p.qubits)],
		["Average connectivity", p.statedAverageConnectivity.toFixed(2)],
		["Λ for distances 3, 5, 7", one.errorSuppression.mean.toFixed(2)],
		["Magic state error reduction", `${p.magicStateCultivation.errorReductionFactor}×`]
	]), table([
		"Figure",
		"Chip 1: error correction",
		"Chip 2: random circuit sampling"
	], [
		[
			"Single-qubit gate error",
			percent(one.singleQubitGateError),
			percent(two.singleQubitGateError)
		],
		[
			`Two-qubit gate error (${one.twoQubitGateError.gate} / ${two.twoQubitGateError.gate})`,
			percent(one.twoQubitGateError),
			percent(two.twoQubitGateError)
		],
		[
			"Measurement error",
			percent(one.measurementError),
			percent(two.measurementError)
		],
		[
			"T1",
			`${one.t1Microseconds.mean} µs ± ${one.t1Microseconds.spread} µs`,
			`${two.t1Microseconds.mean} µs ± ${two.t1Microseconds.spread} µs`
		],
		[
			"Rate",
			`${one.errorCorrectionCyclesPerSecond.toLocaleString("en-US")} cycles per second`,
			`${two.circuitRepetitionsPerSecond.toLocaleString("en-US")} repetitions per second`
		]
	])]);
};
var circuitWidget = (d) => {
	if ("probabilities" in d) {
		const width = Math.max(1, Math.round(Math.log2(d.probabilities.length)));
		const rows = d.probabilities.map((p, k) => ({
			k,
			p
		})).filter((r) => r.p > 1e-12);
		return stack([
			cards([
				["Trace", d.trace.toFixed(6)],
				["Purity", d.purity.toFixed(6)],
				["Basis states with weight", String(rows.length)]
			]),
			table(["State", "Probability"], rows.map((r) => [`|${r.k.toString(2).padStart(width, "0")}⟩`, `${(r.p * 100).toFixed(2)}%`])),
			...d.expectations.length ? [table(["Observable", "Expectation"], d.expectations.map((e, i) => [`observable ${i + 1}`, e.toFixed(6)]))] : []
		]);
	}
	if ("amplitudes" in d) {
		const width = Math.max(1, Math.round(Math.log2(d.amplitudes.length)));
		const rows = d.amplitudes.map((a, k) => ({
			k,
			p: a.re * a.re + a.im * a.im
		})).filter((r) => r.p > 1e-12);
		return stack([
			cards([["Qubits", String(width)], ["Basis states with weight", String(rows.length)]]),
			table(["State", "Probability"], rows.map((r) => [`|${r.k.toString(2).padStart(width, "0")}⟩`, `${(r.p * 100).toFixed(2)}%`])),
			...rows.map((r) => bar(r.p * 100))
		]);
	}
	const width = d.bitstrings[0]?.length ?? 1;
	const total = d.bitstrings.length;
	const rows = Object.entries(d.histogram).map(([value, count]) => ({
		bits: Number(value).toString(2).padStart(width, "0"),
		count,
		share: count / total * 100
	}));
	return stack([
		cards([
			["Repetitions", String(total)],
			["Measurement key", d.key],
			["Distinct outcomes", String(rows.length)]
		]),
		table([
			"Bitstring",
			"Count",
			"Share"
		], rows.map((r) => [
			r.bits,
			String(r.count),
			`${r.share.toFixed(1)}%`
		])),
		...rows.map((r) => bar(r.share))
	]);
};
var echoWidget = (d) => stack([cards([["Probability the echo returns", d.probability.toFixed(6)], ["Operations in the echo circuit", String(d.operations)]]), bar(d.probability * 100)]);
var echoBenchmarkWidget = (d) => stack([cards([
	["Processor", d.processor],
	["Qubits in the array", String(d.qubits)],
	["Speedup over the fastest supercomputers", `${d.speedup.toLocaleString("en-US")}×`],
	["Molecules", d.molecules.map((m) => `${m} atoms`).join(", ")]
])]);
var roadmapWidget = (d) => stack([
	table([
		"Milestone",
		"Title",
		"Year",
		"Physical qubits",
		"Status"
	], d.milestones.map((m) => [
		`M${m.number}`,
		m.title,
		m.year ?? "—",
		m.physicalQubits.toLocaleString("en-US"),
		m.status
	])),
	...d.milestones.map((m) => bar(m.physicalQubits / 1e6 * 100)),
	table(["Physical qubits needed", "Predicted applications"], d.applications.map((a) => [a.band, a.applications.join("; ")]))
]);
var algorithmWidget = (d) => stack([cards(d.summary.map((row) => [row[0] ?? "", row[1] ?? ""])), table([...d.header], d.rows.map((r) => [...r]))]);
var softwareWidget = (d) => stack([cards([["Tools", String(d.tools.length)], ["Implemented here", String(d.tools.filter((t) => t.implemented).length)]]), table([
	"Tool",
	"What it is",
	"In this repository"
], d.tools.map((t) => [
	t.name,
	t.description,
	t.implemented ? "yes" : "no"
]))]);
var statementsWidget = (d) => stack([table(["Topic", "Statement"], d.statements.map((s) => [s.topic, s.text]))]);
var leadsWidget = (d) => stack([cards([
	["Leads", String(d.total)],
	["Served", String(d.counts.served ?? 0)],
	["Partial", String(d.counts.partial ?? 0)],
	["Blocked", String(d.counts.blocked ?? 0)],
	["Out of scope", String(d.counts.out_of_scope ?? 0)],
	["Open", String(d.counts.open ?? 0)]
]), table([
	"Lead",
	"Status",
	"Tool",
	"Statement"
], d.leads.map((l) => [
	l.id,
	l.status,
	l.tool ?? "—",
	l.statement
]))]);
var quantumlibWidget = (d) => stack([cards([["Repositories", String(d.total)], ["With an emulation here", String(d.emulated)]]), table([
	"Repository",
	"Language",
	"Implemented here",
	"Tools",
	"Note"
], d.repositories.map((r) => [
	r.name,
	r.language,
	r.implementedHere.join(", ") || "—",
	r.tools.join(", ") || "—",
	r.note
]))]);
var errorCorrectionWidget = (d) => stack([
	cards([
		["Code", d.code],
		["Channel", d.channel],
		["Logical state", `|${d.logical}⟩`],
		["Physical error at p", d.at.physicalError.toFixed(6)],
		["Logical error at p", d.at.logicalError.toFixed(6)],
		["Break-even p (bisected)", d.breakEven === null ? "none in the sweep" : d.breakEven.toFixed(6)]
	]),
	table([
		"p",
		"Physical error",
		"Logical error",
		"Code helps"
	], d.sweep.map((s) => [
		s.p.toFixed(4),
		s.physicalError.toFixed(6),
		s.logicalError.toFixed(6),
		s.logicalError < s.physicalError ? "yes" : "no"
	])),
	...d.sweep.map((s) => bar(s.logicalError * 100))
]);
var chemistryWidget = (d) => stack([
	cards([
		["Bond length (Å)", d.molecule.bondLength.toFixed(4)],
		["Hartree-Fock (Ha)", d.molecule.hartreeFock.toFixed(6)],
		["Full CI (Ha)", d.molecule.fci.toFixed(6)],
		...d.vqe ? [["VQE minimum (Ha)", d.vqe.best.energy.toFixed(6)], ["θ at the minimum", d.vqe.best.theta.toFixed(6)]] : [],
		...d.at ? [[`E(θ = ${d.at.theta})`, d.at.energy.toFixed(6)]] : []
	]),
	table(["Term", "Coefficient (Ha)"], d.terms.map((t) => [t.label, t.coefficient.toFixed(8)])),
	...d.vqe ? [table(["θ", "Energy (Ha)"], d.vqe.grid.map((g) => [g.theta.toFixed(4), g.energy.toFixed(6)]))] : []
]);
var resourcesWidget = (d) => stack([table([
	"Circuit",
	"Qubits",
	"Depth",
	"Operations",
	"Two-qubit gates",
	"T-count",
	"Complete"
], d.circuits.map((c) => [
	c.name,
	String(c.count.qubits),
	String(c.count.depth),
	String(c.count.operations),
	String(c.count.twoQubitGates),
	String(c.count.tCount),
	c.count.complete ? "yes" : "no: rotations or undecomposed gates uncounted"
])), ...d.circuits.map((c) => table([
	`${c.name}: gate`,
	"Count",
	"Class"
], c.count.gates.map((g) => [
	g.name,
	String(g.count),
	g.class
])))]);
var repositoriesWidget = (d) => stack([cards([["Repositories", String(d.total)], ["Shown", String(d.repositories.length)]]), table([
	"Repository",
	"Language",
	"Description"
], d.repositories.map((r) => [
	r.name,
	r.language,
	r.description
]))]);
/** The audit as cards and a table: the counts, then every check with its evidence. */
var auditWidget = (d) => stack([cards([
	["Checks", String(d.total)],
	["Passed", String(d.passed)],
	["Failed", String(d.failed)],
	["Tools", String(d.tools)],
	["Examples", String(d.examples)],
	["Leads", String(d.leads)]
]), table([
	"Check",
	"Result",
	"Evidence"
], d.checks.map((c) => [
	c.id,
	c.passed ? "✓" : "✗",
	c.evidence
]))]);
/** The match as its verdict, its evidence, and the ranked candidates. */
var matchWidget = (d) => stack([
	cards([
		["Statement", d.statement],
		["Verdict", d.verdict],
		["Tool", d.tool ?? "—"],
		["Lead", `${d.lead.id} (${d.lead.status})`]
	]),
	table(["Evidence"], d.evidence.map((e) => [e])),
	table([
		"Served possibility",
		"Kind",
		"Score",
		"Text"
	], d.cluster.map((c) => [
		c.id,
		c.kind,
		String(c.score),
		c.text
	])),
	table([
		"Verify live via",
		"URL",
		"Check"
	], d.verify.map((v) => [
		v.verifier,
		v.url,
		v.check
	])),
	table([
		"Reflection: n",
		"Hidden factors",
		"By"
	], d.reflection.factors.map((f) => [
		String(f.n),
		f.factors ?? "—",
		f.by
	])),
	table([
		"Reflection: x",
		"Bound",
		"σ_d(x)",
		"QFT angle"
	], d.reflection.angles.map((a) => [
		String(a.x),
		`${a.property} ≤ ${a.d}`,
		String(a.sigma),
		a.angle.toFixed(4)
	])),
	table(["Mirror query"], d.reflection.queries.map((q) => [q])),
	table(["Lead to develop", "Statement"], d.reflection.leads.map((l) => [l.id, l.statement])),
	table([
		"Kind",
		"Candidate",
		"Score",
		"Text"
	], d.candidates.map((c) => [
		c.kind,
		c.id,
		String(c.score),
		c.text
	]))
]);
/** The Clay register: the totals, then every relation with its sides, values and width. */
var clayWidget = (d) => stack([cards([
	["Relations", String(d.total)],
	["Holding", String(d.holding)],
	["Widest value", `${d.maxBits} bits`]
]), table([
	"Relation",
	"Holds",
	"Bits",
	"Sides"
], d.relations.map((r) => [
	r.name,
	r.holds ? "✓" : "✗",
	String(r.bits),
	r.sides.map((s) => `${s.expression} = ${s.value}`).join(" · ")
]))]);
/** One UUID's cheap checks, each with its evidence. */
var verifyWidget = (d) => stack([
	cards([
		["UUID", d.uuid],
		["Valid", d.valid ? "✓" : "✗"],
		["Checks decided", String(d.decided)]
	]),
	table([
		"Check",
		"Result",
		"Evidence"
	], d.checks.map((c) => [
		c.check,
		c.passed === null ? "not decided" : c.passed ? "✓" : "✗",
		c.evidence
	])),
	table(["Cost"], [[d.cost]])
]);
/** A flow tool's result: its scalar fields as cards (phase, counts, verdicts), its check table when it is a selftest. */
var flowWidget = (d) => {
	const scalars = Object.entries(d).filter(([, v]) => typeof v === "number" || typeof v === "string" || typeof v === "boolean").map(([k, v]) => [k, String(v)]);
	const checks = Array.isArray(d.checks) ? d.checks : null;
	return stack([cards(scalars), ...checks ? [table([
		"Check",
		"Passed",
		"Evidence"
	], checks.map((c) => [
		c.id,
		c.passed ? "✓" : "✗",
		c.evidence
	]))] : []]);
};
// src/quantum/tenants.ts
var TENANTS = {
	"qpu.uuidna.com": "uuidna",
	"qpu.psg.bg": "psg"
};
// src/quantum/toolboxes/flow.ts
var BLOCK_IDS = /* @__PURE__ */ new WeakMap();
/** The content address of every example's block, computed once per examples registry (a readiness call must not replay the examples). */
var blockIdsOf = (ctx) => {
	const found = BLOCK_IDS.get(ctx.examples);
	if (found) return found;
	const ids = ctx.examples.filter((e) => e.tool !== "audit" && ![
		"readiness",
		"imagine",
		"discover",
		"wave"
	].includes(e.tool)).map((e) => {
		const r = ctx.handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/call",
			params: {
				name: e.tool,
				arguments: e.arguments
			}
		});
		return {
			example: e.id,
			id: r.result?._meta?.block?.meta?.id
		};
	}).filter((x) => x.id);
	BLOCK_IDS.set(ctx.examples, ids);
	return ids;
};
var selftestOr = (args, ctx, f) => args.selftest ? {
	selftest: true,
	...flowSelftestOf(ctx.handle, ctx.examples, ctx.leads)
} : f();
var SELFTEST = { selftest: {
	type: "boolean",
	description: "run the flow toolbox's cross-test instead: every direction, every toolbox feeding the next"
} };
var discover = toolOf("flow", {
	name: "discover",
	description: "Discovery before use. Without answers: every request the client must make for the contracts of the hosts this tree talks to (MCP tools/list and catalogue doors, the verifiers' OpenAPI, index or identify documents, /.well-known/qpu.json). With answers: the follow-ups still to fetch (catalogue doors whose contract is unread) and, once none remain, the discovery: hosts, doors with what they take and answer, capabilities by which clients choose doors, and the leads (hosts with no machine contract). Pure; the client fetches.",
	inputSchema: {
		type: "object",
		properties: {
			mcpHosts: {
				type: "array",
				items: { type: "string" },
				description: "MCP endpoints to ask; default the unit, this tree's own and Cloudflare's eight servers; a tenant names its own"
			},
			auth: {
				type: "object",
				description: "host → bearer token, the tenant's own: forwarded as the authorization header of the requests emitted, never kept"
			},
			answers: {
				type: "array",
				items: { type: "object" },
				description: "the requests answered: each request as emitted plus status, type and text"
			},
			...SELFTEST
		}
	},
	run: (args, ctx) => selftestOr(args, ctx, () => {
		const hosts = Array.isArray(args.mcpHosts) ? args.mcpHosts.map(String) : DEFAULT_MCP_HOSTS;
		if (!Array.isArray(args.answers)) {
			const requests = discoveryRequestsOf(hosts, VERIFIERS, args.auth && typeof args.auth === "object" ? args.auth : {});
			return {
				phase: "requests",
				requests: requests.length,
				requestList: requests
			};
		}
		const answers = args.answers;
		const followUps = followUpsOf(answers);
		if (followUps.length) return {
			phase: "follow-ups",
			requests: followUps.length,
			requestList: followUps
		};
		const discovery = discoveryOf(answers, VERIFIERS);
		return {
			phase: "discovery",
			hosts: discovery.hosts.length,
			doors: discovery.doors.length,
			statementVerdict: discovery.capabilities.statementVerdict.length,
			leads: discovery.leads.length,
			discovery,
			page: discoveryPageOf(discovery, (/* @__PURE__ */ new Date()).toISOString())
		};
	}),
	widget: flowWidget
});
var e2e = toolOf("flow", {
	name: "e2e",
	description: "The end-to-end gate as a repetition code. Without answers: every combination the dashboards lay out and every example of the textbook, as one tools/call request per host (default the tenants' hosts and the operator's), each carrying the hash of the tree's own answer. With answers (each request plus status, ms, text): every combination decoded by majority over the tree and the hosts — agree, corrected (a flipped host, named by the syndrome), erased (a host that did not answer), uncorrectable (no majority) — the physical and logical error rates against the textbook 3-copy code, every error a UUID block for the stream, and the leads. Pure; the client fetches.",
	inputSchema: {
		type: "object",
		properties: {
			hosts: {
				type: "array",
				items: { type: "string" },
				description: "MCP endpoints to call; default https://<tenant host>/mcp for every tenant and the operator's workers.dev"
			},
			tools: {
				type: "array",
				items: { type: "string" },
				description: "only these tools' combinations; default every tool"
			},
			answers: {
				type: "array",
				items: { type: "object" }
			},
			...SELFTEST
		}
	},
	run: (args, ctx) => selftestOr(args, ctx, () => {
		const hosts = Array.isArray(args.hosts) ? args.hosts.map(String) : [...Object.keys(TENANTS).map((h) => `https://${h}/mcp`), "https://qpu.ceci.workers.dev/mcp"];
		if (!Array.isArray(args.answers)) {
			const requests = e2eRequestsOf(ctx, hosts, Array.isArray(args.tools) ? args.tools.map(String) : void 0);
			return {
				phase: "requests",
				hosts,
				combos: new Set(requests.map((r) => r.combo)).size,
				requests: requests.length,
				requestList: requests
			};
		}
		const r = e2eOf(args.answers);
		return {
			phase: "decoded",
			hosts,
			...r,
			page: e2ePageOf(r, (/* @__PURE__ */ new Date()).toISOString(), hosts, { remaining: 0 })
		};
	}),
	widget: flowWidget
});
var FLOW = {
	name: "flow",
	idea: "the run of the tree as tools: discover the hosts, verify the leads, let the unit judge, imagine the next leads; the client only fetches and writes",
	tools: [
		discover,
		toolOf("flow", {
			name: "wave",
			description: "The verification wave. Without results: every request the surface's leads and tree facts need, once per URL with the leads it serves. With results (each request plus status, ok, ms and the body text): what came back read into one-line notes, a check of each request against the OpenAPI contract its host published (from discovery), and a summary by verifier. Pure; the client fetches.",
			inputSchema: {
				type: "object",
				properties: {
					results: {
						type: "array",
						items: { type: "object" }
					},
					contracts: {
						type: "object",
						description: "host → OpenAPI path templates, from the discovery"
					},
					leads: {
						type: "array",
						items: { type: "string" },
						description: "lead ids to restrict the wave to; default all"
					},
					...SELFTEST
				}
			},
			run: (args, ctx) => selftestOr(args, ctx, () => {
				const chosen = Array.isArray(args.leads) ? ctx.leads.filter((l) => args.leads.includes(l.id)) : ctx.leads;
				if (!Array.isArray(args.results)) {
					const requests = waveRequestsOf(chosen);
					return {
						phase: "requests",
						leads: chosen.length,
						requests: requests.length,
						requestList: requests
					};
				}
				const w = waveOf(args.results, args.contracts ?? {});
				return {
					phase: "results",
					leads: chosen.length,
					requests: w.results.length,
					reachable: w.reachable,
					summary: w.summary,
					results: w.results,
					page: wavePageOf(w, chosen.length, (/* @__PURE__ */ new Date()).toISOString(), Object.keys(args.contracts ?? {}).length > 0)
				};
			}),
			widget: flowWidget
		}),
		toolOf("flow", {
			name: "readiness",
			description: "The unit judges the tree. Phase one (verification, discovery, present, ledger): every lead judged by measurement into served, refuted or trial; the sources as the unit's readiness door takes them; the border plan — every discovered door that takes a statement and answers a verdict, with a hand-written theorem filled in; and the unit plan, the calls the client makes. Phase two (plus border answers and unit answers): the border read, and the page. Pure; the client asks the unit.",
			inputSchema: {
				type: "object",
				properties: {
					verification: {
						type: "object",
						description: "the wave tool's results phase"
					},
					discovery: {
						type: "object",
						description: "the discover tool's discovery phase"
					},
					present: {
						type: "array",
						items: { type: "string" },
						description: "cleanup subjects the client measured as present (paths or branches)"
					},
					ledger: {
						type: "array",
						items: { type: "object" },
						description: "theorem rows {key, statement} from the theorem ledger"
					},
					probeKey: {
						type: "string",
						description: "the hand-written theorem offered at the border; default clay_sigma"
					},
					border: {
						type: "array",
						items: { type: "object" },
						description: "phase two: the border calls answered ({door, host, arguments, answer | refusal})"
					},
					unit: {
						type: "object",
						description: "phase two: the unit's answers (readiness, auras, rights, address)"
					},
					...SELFTEST
				}
			},
			run: (args, ctx) => selftestOr(args, ctx, () => {
				const verification = args.verification;
				const discovery = args.discovery ?? null;
				const present = new Set(Array.isArray(args.present) ? args.present.map(String) : []);
				const probeKey = typeof args.probeKey === "string" ? args.probeKey : "clay_sigma";
				const probe = {
					key: probeKey,
					statement: (Array.isArray(args.ledger) ? args.ledger : []).find((r) => r.key === probeKey)?.statement ?? null
				};
				const match = matcherOf(ctx.handle, ctx.examples, ctx.leads);
				const pages = pagesOf(verification?.results ?? []);
				const judged = ctx.leads.map((l) => judgeOf(l, pages, present, match, verification?.date ?? null));
				const classes = {
					served: judged.filter((x) => x.class === "served").length,
					refuted: judged.filter((x) => x.class === "refuted").length,
					trial: judged.filter((x) => x.class === "trial").length
				};
				const sources = sourcesOf(judged, ctx.leads);
				const plan = borderPlanOf(discovery, probe);
				const auraSubjects = blockIdsOf(ctx);
				const unitPlan = [
					{
						name: "check_release_readiness",
						arguments: { sources }
					},
					{
						name: "get_rights",
						arguments: {}
					},
					{
						name: "compute_address",
						arguments: { value: "qpu" }
					},
					{
						name: "get_vortex_reflection",
						arguments: {}
					},
					{
						name: "get_triad",
						arguments: {}
					},
					{
						name: "compute_double_torus",
						arguments: { addresses: auraSubjects.map((a) => a.id) }
					},
					...ctx.handle({
						jsonrpc: "2.0",
						id: 1,
						method: "tools/call",
						params: {
							name: "clay",
							arguments: { technique: "reflection" }
						}
					}).result?.structuredContent.unitPlan ?? [],
					...auraSubjects.map((a) => ({
						name: "compute_aura",
						arguments: { subject: a.id },
						example: a.example
					}))
				];
				const base = {
					probe,
					judged,
					classes,
					sources,
					borderPlan: plan.calls,
					unfillable: plan.unfillable,
					unitPlan,
					leads: ctx.leads.length
				};
				if (!Array.isArray(args.border) || !args.unit) return {
					phase: "plan",
					served: classes.served,
					refuted: classes.refuted,
					trial: classes.trial,
					borderCalls: plan.calls.length,
					unitCalls: unitPlan.length,
					...base
				};
				const border = [...borderOf(args.border), ...plan.unfillable];
				const sealedBy = border.filter((b) => b.sealed).map((b) => b.door);
				const answers = args.unit;
				const date = (/* @__PURE__ */ new Date()).toISOString();
				return {
					phase: "judged",
					served: classes.served,
					refuted: classes.refuted,
					trial: classes.trial,
					ready: answers.readiness.ready,
					sealedBy: sealedBy.length,
					...base,
					border,
					sealedByDoors: sealedBy,
					page: readinessPageOf({
						unit: typeof args.unitUrl === "string" ? args.unitUrl : "https://uuidna.com/mcp",
						date,
						measured: verification?.date ?? null,
						discovered: discovery?.date ?? null,
						probe,
						judged,
						classes,
						sources,
						border,
						sealedBy,
						answers
					})
				};
			}),
			widget: flowWidget
		}),
		toolOf("flow", {
			name: "imagine",
			description: "Imagination leads all leads: every lead (or the subset named) matched with the reflection on — hidden factors, angles, mirror queries, cluster, verification requests — every reflection that finds something a new open lead, every untried enum value of every schema a lead, every application family an adaptor to build. Pure.",
			inputSchema: {
				type: "object",
				properties: {
					leads: {
						type: "array",
						items: { type: "string" },
						description: "lead ids to imagine; default all"
					},
					statements: {
						type: "array",
						items: { type: "object" },
						description: "ad-hoc statements {id, statement} to imagine instead: the rest of the leads from any text"
					},
					...SELFTEST
				}
			},
			run: (args, ctx) => selftestOr(args, ctx, () => {
				const started = Date.now();
				const im = imagineOf(ctx.handle, ctx.examples, ctx.leads, Array.isArray(args.leads) ? args.leads.map(String) : void 0, Array.isArray(args.statements) ? args.statements : void 0);
				return {
					leads: im.leads,
					served: im.verdicts.served ?? 0,
					impossible: im.verdicts.impossible ?? 0,
					unknown: im.verdicts.unknown ?? 0,
					verifyRequests: im.verifyRequests,
					imaginedLeads: im.imaginedLeads,
					ms: Date.now() - started,
					imagination: im,
					page: imaginePageOf(im, (/* @__PURE__ */ new Date()).toISOString(), Date.now() - started)
				};
			}),
			widget: flowWidget
		}),
		e2e
	],
	examples: [
		{
			id: "discover-requests",
			tool: "discover",
			arguments: { mcpHosts: ["https://uuidna.com/mcp"] },
			shows: "Phase one of discovery: the requests a client makes for every contract — the unit's tools/list, its catalogue door, its well-known file, and the verifiers' contract documents.",
			expect: (s) => s.phase === "requests" && s.requests >= 3 + VERIFIERS.filter((v) => v.contract).length ? null : `${s.phase}, ${s.requests} requests`
		},
		{
			id: "wave-requests",
			tool: "wave",
			arguments: { leads: ["willow-spec", "repo-cirq"] },
			shows: "Phase one of the wave: the requests two leads need, once per URL, each naming the leads it serves.",
			expect: (s) => s.phase === "requests" && s.leads === 2 && s.requests > 0 && s.requestList.every((r) => r.leads.length > 0) ? null : `${s.phase}, ${s.requests} requests for ${s.leads} leads`
		},
		{
			id: "readiness-plan",
			tool: "readiness",
			arguments: {},
			shows: "Phase one of readiness without measurements: every lead judged (served by its tool, refuted by declaration, or in trial), the sources for the unit, an empty border plan because nothing was discovered, and the unit plan.",
			expect: (s) => s.phase === "plan" && s.served + s.refuted + s.trial === s.leads && s.borderCalls === 0 && s.unitCalls >= 3 ? null : `${s.phase}: ${s.served}+${s.refuted}+${s.trial} of ${s.leads}, ${s.borderCalls} border calls`
		},
		{
			id: "e2e-requests",
			tool: "e2e",
			arguments: {
				hosts: ["https://qpu.uuidna.com/mcp"],
				tools: [
					"clay",
					"processor",
					"roadmap"
				]
			},
			shows: "Phase one of the end-to-end gate for three tools: every dashboard cell and every example of theirs as a tools/call request to one host, each carrying the hash of the tree's own answer; without tools, every tool's.",
			expect: (s) => s.phase === "requests" && s.combos >= 10 && s.requests === s.combos && s.requestList.every((r) => r.method === "POST" && /^[0-9a-f-]{36}$/.test(r.local)) ? null : `${s.phase} ${s.combos} ${s.requests}`
		},
		{
			id: "imagine-two",
			tool: "imagine",
			arguments: { leads: ["willow-spec", "learn"] },
			shows: "Two leads imagined: one served by the processor tool, one blocked (a 404), plus the leads every schema and application family open.",
			expect: (s) => s.leads === 2 && s.served + s.impossible + s.unknown === 2 && s.imaginedLeads > 0 ? null : `${s.leads} leads, ${s.served}/${s.impossible}/${s.unknown}, ${s.imaginedLeads} imagined`
		}
	],
	skill: {
		instructions: "Use the flow toolbox in phases. discover: call once for the request list, fetch every request as given (POST bodies verbatim), call again with the answers until the phase is \"discovery\"; write discovery.json and the page. wave: call for the request list, fetch each URL once (pace per host), call again with status, ok, ms and the body text, plus the contracts from the discovery; write verification.json and the page. readiness: call with the verification, the discovery, the cleanup subjects you measured present and the theorem ledger; make the border calls and the unit calls it returns, against the MCP hosts; call again with their answers; write readiness.json and the page. imagine: call once; write imagination.json and the page. Before a live run, call any flow tool with selftest and record the result; a failed check is a lead, never a stop.",
		directions: [
			"server only: each tool on fixtures",
			"server → client: every request a tool emits is one the client can answer",
			"client → server: answers read back into data and pages",
			"toolbox → toolbox: discovery feeds wave and readiness, wave feeds readiness, match feeds imagine and the judge"
		],
		selftest: (ctx) => flowSelftestOf(ctx.handle, ctx.examples, ctx.leads)
	}
};
// src/quantum/toolboxes/language.ts
/** Every term the surface emits as a label a reader sees: statuses, verdicts, classes, phases and the headings of its pages. */
var SURFACE_TERMS = [
	"served",
	"partial",
	"blocked",
	"open",
	"out of scope",
	"impossible",
	"unknown",
	"refuted",
	"trial",
	"requests",
	"results",
	"discovery",
	"plan",
	"judged",
	"verdict",
	"receipt",
	"evidence",
	"lead",
	"leads",
	"tool",
	"tools",
	"toolbox",
	"example",
	"examples",
	"seal",
	"valid",
	"invalid",
	"channel",
	"program",
	"handle",
	"tail",
	"previous",
	"next",
	"page",
	"statement",
	"door",
	"doors",
	"address",
	"content",
	"licence",
	"author",
	"ready",
	"not ready",
	"passed",
	"failed",
	"checks",
	"hosts",
	"contract",
	"phase",
	"selftest"
];
var wordsOf = (key) => key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase();
/** The vocabulary measured: for every filled locale, which surface terms have no entry. */
var coverageOf$1 = () => Object.entries(LOCALES).filter(([code]) => code !== "en").map(([code, l]) => {
	const table = TABLES[code];
	const missing = table ? SURFACE_TERMS.filter((t) => !(t in table)) : [...SURFACE_TERMS];
	return {
		locale: code,
		filled: l.filled && !!table,
		terms: table ? Object.keys(table).length : 0,
		missing
	};
});
/** Sentences from a tool's result: its scalar fields as "label value", in the locale's words; the numbers are the tool's. */
var proseOf = (toolbox, tool, structured, locale) => {
	const t = (s) => translateOf(s, "en", locale);
	const sentences = [];
	const untranslated = /* @__PURE__ */ new Set();
	const say = (s) => {
		const r = t(s);
		sentences.push(r.text);
		for (const w of r.untranslated) untranslated.add(w);
	};
	if (toolbox) say(`the ${toolbox.name} toolbox: ${toolbox.idea}.`);
	const fields = structured && typeof structured === "object" ? Object.entries(structured).filter(([, v]) => typeof v === "number" || typeof v === "boolean" || typeof v === "string" && v.length <= 80 && !v.includes("\n")) : [];
	if (fields.length) say(`the ${tool} tool answered: ${fields.map(([k, v]) => `${wordsOf(k)} ${typeof v === "boolean" ? v ? "yes" : "no" : String(v)}`).join(", ")}.`);
	else say(`the ${tool} tool answered with no scalar fields.`);
	if (toolbox) say(`how to use it: ${toolbox.instructions}`);
	return {
		text: sentences.join(" "),
		sentences,
		untranslated: [...untranslated].filter((w) => !/^\d/.test(w))
	};
};
var LANGUAGE = {
	name: "language",
	idea: "any language and dialect, offline and token-free: translation by vocabulary both ways, the vocabulary measured against every term the surface emits, and prose programmed from a tool's result and its toolbox's skill",
	tools: [toolOf("language", {
		name: "translate",
		description: "Translation by vocabulary, offline, both ways: text, from, to. A word no table knows stays as it is and is reported, never guessed; Glagolitic numerals are read as integers. Without text: the vocabulary measured — for every locale, the surface terms with no entry (the leads of the tables).",
		inputSchema: {
			type: "object",
			properties: {
				text: { type: "string" },
				from: {
					type: "string",
					enum: Object.keys(LOCALES)
				},
				to: {
					type: "string",
					enum: Object.keys(LOCALES)
				},
				selftest: { type: "boolean" }
			}
		},
		run: (args, ctx) => {
			if (args.selftest) return {
				selftest: true,
				...LANGUAGE.skill.selftest(ctx)
			};
			if (typeof args.text !== "string") {
				const coverage = coverageOf$1();
				return {
					phase: "coverage",
					terms: SURFACE_TERMS.length,
					locales: coverage.length,
					filled: coverage.filter((c) => c.filled).length,
					missingTotal: coverage.reduce((n, c) => n + c.missing.length, 0),
					coverage
				};
			}
			const from = typeof args.from === "string" ? args.from : "en";
			const to = typeof args.to === "string" ? args.to : "bg";
			const num = numeralsOf(args.text);
			const r = translateOf(num.text, from, to);
			return {
				phase: "translated",
				from,
				to,
				text: r.text,
				via: r.via,
				untranslated: r.untranslated.length,
				untranslatedWords: r.untranslated,
				numerals: num.numerals
			};
		},
		widget: flowWidget
	}), toolOf("language", {
		name: "prose",
		description: "Programmable prose: call a tool with its arguments and render its result as sentences in a locale — the toolbox's idea, the tool's scalar answers, the toolbox's instructions — every word from the vocabulary, every number from the tool, every unknown word reported.",
		inputSchema: {
			type: "object",
			required: ["tool"],
			properties: {
				tool: { type: "string" },
				arguments: { type: "object" },
				locale: {
					type: "string",
					enum: Object.keys(LOCALES)
				},
				selftest: { type: "boolean" }
			}
		},
		run: (args, ctx) => {
			if (args.selftest) return {
				selftest: true,
				...LANGUAGE.skill.selftest(ctx)
			};
			const tool = String(args.tool);
			const locale = typeof args.locale === "string" ? args.locale : "en";
			const r = ctx.handle({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/call",
				params: {
					name: tool,
					arguments: args.arguments ?? {}
				}
			});
			if ("error" in r) throw new Error(r.error.message);
			const boxName = ctx.handle({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/list"
			}).result.tools.find((t) => t.name === tool)?._meta?.toolbox ?? null;
			const init = ctx.handle({
				jsonrpc: "2.0",
				id: 0,
				method: "initialize"
			});
			const line = boxName ? init.result.instructions.split("\n").find((l) => l.startsWith(`${boxName} (`)) : void 0;
			const p = proseOf(boxName && line ? {
				name: boxName,
				idea: line.slice(line.indexOf("): ") + 3, line.indexOf(". ") + 1).replace(/\.$/, ""),
				instructions: line.slice(line.indexOf(". ") + 2)
			} : null, tool, r.result.structuredContent, locale);
			return {
				tool,
				toolbox: boxName ?? "none",
				locale,
				sentences: p.sentences.length,
				untranslated: p.untranslated.length,
				text: p.text,
				untranslatedWords: p.untranslated,
				sentenceList: p.sentences
			};
		},
		widget: flowWidget
	})],
	examples: [
		{
			id: "translate-bg",
			tool: "translate",
			arguments: {
				text: "The lead is served; the verdict is unknown",
				from: "en",
				to: "bg"
			},
			shows: "English to Bulgarian by vocabulary: the labels and verdicts translate; a word with no entry stays and is reported.",
			expect: (s) => s.phase === "translated" && /следата|следа/.test(s.text) && /обслужена/.test(s.text) && /неизвестно/.test(s.text) ? null : `${s.text} (${s.untranslatedWords})`
		},
		{
			id: "translate-coverage",
			tool: "translate",
			arguments: {},
			shows: "The vocabulary measured: for every locale, which surface terms have no entry — the leads of the tables, updated from measurement.",
			expect: (s) => s.phase === "coverage" && s.terms === SURFACE_TERMS.length && s.coverage.find((c) => c.locale === "bg")?.filled === true ? null : `${s.phase}: ${s.terms} terms, ${s.filled} filled`
		},
		{
			id: "prose-clay-bg",
			tool: "prose",
			arguments: {
				tool: "clay",
				arguments: { name: "relation_15" },
				locale: "bg"
			},
			shows: "Programmable prose in Bulgarian from the clay tool's answer and the tree toolbox's skill: the numbers are the tool's, the words the vocabulary's, the rest reported.",
			expect: (s) => s.tool === "clay" && s.toolbox === "tree" && s.locale === "bg" && s.sentences === 3 && /инструмент/.test(s.text) && /15|54/.test(s.text) ? null : `${s.toolbox}/${s.sentences}: ${s.text.slice(0, 120)}`
		}
	],
	skill: {
		instructions: "translate takes text, from and to and answers by vocabulary; call it without text to measure the tables and get the missing terms per locale, which are the leads to fill (from the unit's vocabulary door where discovery finds one, or by a person). prose takes a tool, its arguments and a locale and renders the answer as sentences; feed its untranslated words back as vocabulary leads.",
		directions: [
			"server only: every table reads both ways (en→locale→en returns the term)",
			"toolbox → toolbox: prose renders the tree and flow toolboxes' answers; numerals read by the match toolbox's reader",
			"client → server: the coverage phase hands the client the missing terms to fill"
		],
		selftest: (ctx) => {
			const checks = [];
			const check = (id, passed, evidence) => checks.push({
				id,
				passed,
				evidence
			});
			for (const [code, table] of Object.entries(TABLES)) {
				const synonyms = (term) => Object.keys(table).filter((k) => table[k] === table[term]).map((k) => k.toLowerCase());
				const broken = Object.keys(table).filter((term) => table[term] !== "" && !synonyms(term).includes(translateOf(translateOf(term, "en", code).text, code, "en").text.toLowerCase()));
				check(`language:round-trip:${code}`, broken.length === 0, broken.length ? `${broken.length} term(s) do not return: ${broken.slice(0, 5).join(", ")}` : `${Object.keys(table).length} terms return through ${code}`);
			}
			const cov = coverageOf$1().find((c) => c.locale === "bg");
			check("language:coverage-measured", cov.terms > 0 && Array.isArray(cov.missing), `bg: ${cov.terms} terms, ${cov.missing.length} surface terms missing${cov.missing.length ? ` (${cov.missing.slice(0, 6).join(", ")})` : ""}`);
			const p = proseOf({
				name: "tree",
				idea: "the tree knows itself",
				instructions: "call match"
			}, "clay", {
				total: 54,
				holding: 54,
				maxBits: 33
			}, "bg");
			check("language:prose-bg", p.sentences.length === 3 && p.text.includes("54") && /инструмент/.test(p.text), p.text.slice(0, 160));
			const r = ctx.handle({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/call",
				params: {
					name: "match",
					arguments: {
						statement: "Разложи Ⰺⰴ с Shor",
						locale: "bg"
					}
				}
			});
			check("language:match-in-bg", "result" in r && r.result.structuredContent.read?.verdictIn === "обслужена", "result" in r ? `${r.result.structuredContent.verdict} → ${r.result.structuredContent.read?.verdictIn}` : r.error.message);
			return {
				passed: checks.every((c) => c.passed),
				checks
			};
		}
	}
};
// src/quantum/toolboxes/raid.ts
var pathOf = (doc, path) => path.split(".").reduce((v, k) => v && typeof v === "object" ? v[k] : void 0, doc);
var cmp = (a, b) => typeof a === "number" && typeof b === "number" ? a - b : String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0;
var same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
/** Does a value satisfy a Mongo operator object (or equal a plain value)? */
var satisfies = (value, cond) => {
	if (cond && typeof cond === "object" && !Array.isArray(cond) && Object.keys(cond).every((k) => k.startsWith("$"))) return Object.entries(cond).every(([op, arg]) => {
		switch (op) {
			case "$eq": return same(value, arg) || Array.isArray(value) && value.some((v) => same(v, arg));
			case "$ne": return !same(value, arg);
			case "$gt": return value !== void 0 && cmp(value, arg) > 0;
			case "$gte": return value !== void 0 && cmp(value, arg) >= 0;
			case "$lt": return value !== void 0 && cmp(value, arg) < 0;
			case "$lte": return value !== void 0 && cmp(value, arg) <= 0;
			case "$in": return Array.isArray(arg) && arg.some((a) => same(value, a) || Array.isArray(value) && value.some((v) => same(v, a)));
			case "$nin": return !(Array.isArray(arg) && arg.some((a) => same(value, a)));
			case "$exists": return value !== void 0 === Boolean(arg);
			case "$regex": return typeof value === "string" && new RegExp(String(arg), typeof cond.$options === "string" ? cond.$options : "").test(value);
			case "$options": return true;
			case "$not": return !satisfies(value, arg);
			case "$size": return Array.isArray(value) && value.length === arg;
			default: throw new Error(`operator ${op} is not ported`);
		}
	});
	return same(value, cond) || Array.isArray(value) && value.some((v) => same(v, cond));
};
/** Does a document match a filter? */
var matchesOf = (doc, filter) => Object.entries(filter).every(([k, cond]) => {
	if (k === "$and") return cond.every((f) => matchesOf(doc, f));
	if (k === "$or") return cond.some((f) => matchesOf(doc, f));
	if (k === "$nor") return !cond.some((f) => matchesOf(doc, f));
	return satisfies(pathOf(doc, k), cond);
});
/** find: filter, sort ({field: 1 | -1}), skip; no limit unless asked (no caps). */
var findOf = (docs, filter = {}, sort = {}, skip = 0, limit) => {
	const out = docs.filter((d) => matchesOf(d, filter));
	for (const [k, dir] of Object.entries(sort).reverse()) out.sort((a, b) => dir * cmp(pathOf(a, k), pathOf(b, k)));
	const sliced = out.slice(skip);
	return limit === void 0 ? sliced : sliced.slice(0, limit);
};
/** An update applied: $set, $unset, $inc, $push, $pull, or a whole replacement; the result is a new document, never a mutation. */
var updateOf = (doc, update) => {
	const ops = Object.keys(update).filter((k) => k.startsWith("$"));
	if (!ops.length) return {
		...update,
		_id: doc._id
	};
	const out = JSON.parse(JSON.stringify(doc));
	const setPath = (path, f) => {
		const ks = path.split(".");
		let o = out;
		for (const k of ks.slice(0, -1)) {
			if (!o[k] || typeof o[k] !== "object") o[k] = {};
			o = o[k];
		}
		const last = ks.at(-1);
		const v = f(o[last]);
		if (v === void 0) delete o[last];
		else o[last] = v;
	};
	for (const op of ops) for (const [path, arg] of Object.entries(update[op])) if (op === "$set") setPath(path, () => arg);
	else if (op === "$unset") setPath(path, () => void 0);
	else if (op === "$inc") setPath(path, (p) => (typeof p === "number" ? p : 0) + Number(arg));
	else if (op === "$push") setPath(path, (p) => [...Array.isArray(p) ? p : [], arg]);
	else if (op === "$pull") setPath(path, (p) => Array.isArray(p) ? p.filter((v) => !same(v, arg)) : p);
	else throw new Error(`update operator ${op} is not ported`);
	return out;
};
/** A document as a docket entry: content-addressed by its body, in a collection family, linked to the version it replaces. */
var entryOf$1 = (collection, doc, replaces) => {
	const body = { ...doc };
	const id = uuidOf(`${collection}${JSON.stringify(body)}`);
	return {
		id,
		kind: "document",
		collection,
		body: {
			...body,
			_id: body._id ?? id
		},
		links: replaces ? [replaces] : []
	};
};
var mongo = toolOf("raid", {
	name: "mongo",
	description: "The ported MongoDB over the docket, pure. find: {collection, docs, filter, sort, skip, limit} → the matching documents (Mongo operators, dotted paths, $and/$or/$nor). insert: {collection, docs: [new]} → the entries to write, content-addressed. update: {collection, docs, filter, update} → for each match the new document and the entry that replaces it (linked to the old). delete: {collection, docs, filter} → the ids to delete, if unlinked. The client reads the docket rows and writes what comes back.",
	inputSchema: {
		type: "object",
		properties: {
			op: {
				type: "string",
				enum: [
					"find",
					"insert",
					"update",
					"delete"
				]
			},
			collection: { type: "string" },
			docs: {
				type: "array",
				items: { type: "object" },
				description: "the collection's documents as read from the docket (their bodies)"
			},
			filter: { type: "object" },
			update: { type: "object" },
			sort: { type: "object" },
			skip: { type: "integer" },
			limit: { type: "integer" },
			selftest: { type: "boolean" }
		}
	},
	run: (args, ctx) => {
		if (args.selftest) return {
			selftest: true,
			...RAID.skill.selftest(ctx)
		};
		const op = String(args.op ?? "find");
		const collection = String(args.collection ?? "documents");
		const docs = Array.isArray(args.docs) ? args.docs : [];
		const filter = args.filter ?? {};
		if (op === "find") {
			const found = findOf(docs, filter, args.sort ?? {}, Number(args.skip ?? 0), typeof args.limit === "number" ? args.limit : void 0);
			return {
				op,
				collection,
				scanned: docs.length,
				matched: found.length,
				docs: found
			};
		}
		if (op === "insert") {
			const entries = docs.map((d) => entryOf$1(collection, d));
			return {
				op,
				collection,
				written: entries.length,
				entries
			};
		}
		if (op === "update") {
			const changes = findOf(docs, filter).map((d) => {
				const next = updateOf(d, args.update ?? {});
				return {
					from: String(d._id ?? ""),
					to: entryOf$1(collection, next, typeof d._id === "string" ? d._id : void 0)
				};
			});
			return {
				op,
				collection,
				scanned: docs.length,
				matched: changes.length,
				changes
			};
		}
		if (op === "delete") {
			const ids = findOf(docs, filter).map((d) => String(d._id ?? ""));
			return {
				op,
				collection,
				scanned: docs.length,
				matched: ids.length,
				ids,
				note: "the docket refuses a delete while anything links the entry; a linked document is kept as history"
			};
		}
		throw new Error(`op ${op} is not one of find, insert, update, delete`);
	},
	widget: flowWidget
});
var SAMPLE = [
	{
		_id: "a",
		title: "Willow",
		qubits: 105,
		tags: ["processor", "google"],
		meta: { year: 2024 }
	},
	{
		_id: "b",
		title: "Sycamore",
		qubits: 54,
		tags: ["processor"],
		meta: { year: 2019 }
	},
	{
		_id: "c",
		title: "Quantum Echoes",
		qubits: 65,
		tags: ["experiment"],
		meta: { year: 2025 }
	}
];
var RAID = {
	name: "raid",
	idea: "the docket as a database: MongoDB's query and update language ported as pure functions over content-addressed entries, so any document framework (Payload first) stores on the RAID through its mongodb adapter",
	tools: [mongo],
	examples: [{
		id: "mongo-find",
		tool: "mongo",
		arguments: {
			op: "find",
			collection: "processors",
			docs: SAMPLE,
			filter: {
				qubits: { $gte: 60 },
				tags: "processor"
			},
			sort: { qubits: -1 }
		},
		shows: "A Mongo filter over documents read from the docket: operators, array membership, sort; the match is computed here, the storage is the docket.",
		expect: (s) => s.matched === 1 && s.docs[0]?._id === "a" ? null : `${s.matched} matched: ${s.docs.map((d) => d._id)}`
	}, {
		id: "mongo-update",
		tool: "mongo",
		arguments: {
			op: "update",
			collection: "processors",
			docs: SAMPLE,
			filter: { _id: "b" },
			update: {
				$set: { "meta.year": 2020 },
				$inc: { qubits: 1 },
				$push: { tags: "updated" }
			}
		},
		shows: "An update computed as a new document and a new entry linked to the one it replaces: entries are immutable and content-addressed, so history is kept.",
		expect: (s) => s.matched === 1 && s.changes[0]?.to.body.qubits === 55 && s.changes[0]?.to.body.meta.year === 2020 && s.changes[0]?.to.links[0] === "b" ? null : JSON.stringify(s.changes).slice(0, 160)
	}],
	skill: {
		instructions: "A client that is a database adapter (Payload's mongodb adapter interface) reads a collection's rows from the docket (GET /docket?collection=…, the bodies), calls mongo with the op and the rows, and writes the entries the tool returns (POST /docket, writer role) or deletes the ids (DELETE, admin role; a linked entry is refused and kept). Every query is pure and recomputable; every write is content-addressed and linked to what it replaces.",
		directions: [
			"server only: the query language on a sample collection",
			"toolbox → toolbox: entries are addressed with the tree's uuidOf and verified by the tree toolbox's verify",
			"client → server: the rows come from the docket; the entries go back to it"
		],
		selftest: () => {
			const checks = [];
			const check = (id, passed, evidence) => checks.push({
				id,
				passed,
				evidence
			});
			check("raid:find-ops", findOf(SAMPLE, { $or: [{ qubits: { $lt: 60 } }, { "meta.year": 2025 }] }, { title: 1 }).map((d) => d._id).join() === "c,b" && findOf(SAMPLE, { title: {
				$regex: "^Q",
				$options: "i"
			} }).length === 1 && findOf(SAMPLE, { tags: { $in: ["google"] } })[0]?._id === "a" && findOf(SAMPLE, {
				meta: { $exists: true },
				qubits: { $nin: [54] }
			}).length === 2, "or sorted by title (Quantum Echoes before Sycamore), dotted path, regex, in, nin, exists");
			check("raid:find-skip-limit", findOf(SAMPLE, {}, { qubits: 1 }, 1, 1)[0]?._id === "c" && findOf(SAMPLE, {}, {}, 0).length === 3, "skip and limit only when asked; no cap otherwise");
			const u = updateOf(SAMPLE[1], {
				$set: { "meta.year": 2020 },
				$inc: { qubits: 1 },
				$push: { tags: "x" },
				$unset: { title: "" }
			});
			check("raid:update-ops", u.qubits === 55 && u.meta.year === 2020 && u.tags.includes("x") && !("title" in u) && SAMPLE[1].qubits === 54, "set, inc, push, unset; the source document untouched");
			const e1 = entryOf$1("c", { x: 1 });
			const e2 = entryOf$1("c", { x: 1 });
			const e3 = entryOf$1("c", { x: 2 }, e1.id);
			check("raid:entries-addressed", e1.id === e2.id && e1.id !== e3.id && e3.links[0] === e1.id && e1.body._id === e1.id, "same content, same address; a replacement links what it replaces");
			let threw = false;
			try {
				findOf(SAMPLE, { qubits: { $mod: [2, 0] } });
			} catch {
				threw = true;
			}
			check("raid:unported-refused", threw, "an operator not ported throws, never guesses");
			return {
				passed: checks.every((c) => c.passed),
				checks
			};
		}
	}
};
// src/quantum/hmac.ts
var K = [
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
];
var rotr = (x, n) => x >>> n | x << 32 - n;
var utf8 = (s) => new TextEncoder().encode(s);
var hex = (b) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
var sha256 = (message) => {
	const h = [
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	];
	const l = message.length;
	const padded = new Uint8Array(l + 9 + 63 >> 6 << 6);
	padded.set(message);
	padded[l] = 128;
	const bits = l * 8;
	const dv = new DataView(padded.buffer);
	dv.setUint32(padded.length - 8, Math.floor(bits / 4294967296));
	dv.setUint32(padded.length - 4, bits >>> 0);
	const w = new Array(64);
	for (let off = 0; off < padded.length; off += 64) {
		for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
		for (let i = 16; i < 64; i++) {
			const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ w[i - 15] >>> 3;
			const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ w[i - 2] >>> 10;
			w[i] = w[i - 16] + s0 + w[i - 7] + s1 >>> 0;
		}
		let [a, b, c, d, e, f, g, hh] = h;
		for (let i = 0; i < 64; i++) {
			const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
			const ch = e & f ^ ~e & g;
			const t1 = hh + S1 + ch + K[i] + w[i] >>> 0;
			const t2 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + (a & b ^ a & c ^ b & c) >>> 0;
			hh = g;
			g = f;
			f = e;
			e = d + t1 >>> 0;
			d = c;
			c = b;
			b = a;
			a = t1 + t2 >>> 0;
		}
		h[0] = h[0] + a >>> 0;
		h[1] = h[1] + b >>> 0;
		h[2] = h[2] + c >>> 0;
		h[3] = h[3] + d >>> 0;
		h[4] = h[4] + e >>> 0;
		h[5] = h[5] + f >>> 0;
		h[6] = h[6] + g >>> 0;
		h[7] = h[7] + hh >>> 0;
	}
	const out = /* @__PURE__ */ new Uint8Array(32);
	const ov = new DataView(out.buffer);
	h.forEach((x, i) => ov.setUint32(i * 4, x));
	return out;
};
var hmacSha256 = (key, message) => {
	const k = key.length > 64 ? sha256(key) : key;
	const ipad = /* @__PURE__ */ new Uint8Array(64);
	const opad = /* @__PURE__ */ new Uint8Array(64);
	for (let i = 0; i < 64; i++) {
		ipad[i] = (k[i] ?? 0) ^ 54;
		opad[i] = (k[i] ?? 0) ^ 92;
	}
	const inner = sha256(new Uint8Array([...ipad, ...message]));
	return sha256(new Uint8Array([...opad, ...inner]));
};
/** Equal in constant time, so a signature check leaks nothing by timing. */
var sameHex = (a, b) => {
	if (a.length !== b.length) return false;
	let d = 0;
	for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return d === 0;
};
// src/quantum/toolboxes/billing.ts
var CATALOGUE = [
	{
		product: "qpu-a432",
		variant: "harmonic-default",
		unit: "none",
		interval: "once",
		amounts: {
			eur: 0,
			usd: 0,
			bgn: 0
		},
		domains: "*",
		description: "the a432 harmonic default: free under attribution, every result carrying the licence"
	},
	{
		product: "qpu-domain",
		variant: "yearly",
		unit: "domain",
		interval: "year",
		amounts: {
			eur: 43200,
			usd: 47500,
			bgn: 84500
		},
		domains: "named",
		description: "commercial use of the QPU framework on one named domain, for a year"
	},
	{
		product: "qpu-domain",
		variant: "monthly",
		unit: "domain",
		interval: "month",
		amounts: {
			eur: 4320,
			usd: 4750,
			bgn: 8450
		},
		domains: "named",
		description: "the same, by the month"
	},
	{
		product: "qpu-tenant",
		variant: "yearly",
		unit: "tenant",
		interval: "year",
		amounts: {
			eur: 216e3,
			usd: 237600,
			bgn: 422400
		},
		domains: "*",
		description: "commercial use on every domain of one tenant, for a year"
	},
	{
		product: "qpu-seat",
		variant: "monthly",
		unit: "seat",
		interval: "month",
		amounts: {
			eur: 2700,
			usd: 2970,
			bgn: 5280
		},
		domains: "*",
		description: "one seat of the full platform (every toolbox, every host), by the month"
	},
	{
		product: "qpu-metered",
		variant: "per-thousand-calls",
		unit: "thousand-calls",
		interval: "metered",
		amounts: {
			eur: 108,
			usd: 119,
			bgn: 211
		},
		domains: "*",
		description: "tools/call metered from the docket's receipts, per thousand calls, billed monthly"
	},
	{
		product: "qpu-enterprise",
		variant: "platform",
		unit: "platform",
		interval: "year",
		amounts: {
			eur: 108e4,
			usd: 1188e3,
			bgn: 2112e3
		},
		domains: "*",
		description: "the full featured platform for one organisation: every toolbox, every host, the RAID, the court, with the author's support"
	}
];
/** The Stripe product and price objects a tenant's catalogue needs, as the forms Stripe takes; the tenant's key sends them. */
var catalogueOf = (tenant, currencies = ["eur"]) => {
	return {
		products: [...new Set(CATALOGUE.map((v) => v.product))].map((product) => ({ form: {
			name: `QPU ${product.replace(/^qpu-/, "")}`,
			"metadata[product]": product,
			"metadata[tenant]": tenant,
			"metadata[licence]": LICENSE.address,
			description: CATALOGUE.find((v) => v.product === product).description
		} })),
		prices: CATALOGUE.flatMap((v) => currencies.filter((c) => c in v.amounts).map((currency) => ({ form: {
			product_data: `QPU ${v.product.replace(/^qpu-/, "")}`,
			currency,
			unit_amount: String(v.amounts[currency]),
			"metadata[product]": v.product,
			"metadata[variant]": v.variant,
			"metadata[unit]": v.unit,
			"metadata[tenant]": tenant,
			"metadata[domains]": v.domains,
			...v.interval === "month" || v.interval === "year" ? { "recurring[interval]": v.interval } : v.interval === "metered" ? {
				"recurring[interval]": "month",
				"recurring[usage_type]": "metered"
			} : {}
		} }))),
		secret: SECRET_OF(tenant)
	};
};
/** Metered usage from the docket: the receipts of a subject in a period, as the usage record Stripe takes (per thousand calls). */
var usageOf = (entries, subject, from, to) => {
	const calls = entries.filter((e) => e.kind === "usage" && e.body?.subject === subject && e.date && Date.parse(e.date) / 1e3 >= from && Date.parse(e.date) / 1e3 < to).reduce((n, e) => n + (e.body?.calls ?? 0), 0);
	const thousands = Math.ceil(calls / 1e3);
	return {
		calls,
		thousands,
		form: {
			quantity: String(thousands),
			timestamp: String(to),
			action: "set"
		}
	};
};
/** The author's compensation: the net of every balance transaction (Stripe's own fee figures, never assumed) by product and variant. */
var settlementOf = (transactions) => {
	const sum = (k) => transactions.reduce((acc, t) => ({
		...acc,
		[t.currency]: (acc[t.currency] ?? 0) + t[k]
	}), {});
	const by = (k) => transactions.reduce((acc, t) => ({
		...acc,
		[`${t[k] ?? "unknown"}:${t.currency}`]: (acc[`${t[k] ?? "unknown"}:${t.currency}`] ?? 0) + t.net
	}), {});
	const body = {
		gross: sum("amount"),
		fees: sum("fee"),
		net: sum("net"),
		byProduct: by("product"),
		byTenant: by("tenant"),
		transactions: transactions.map((t) => t.id).sort(),
		author: LICENSE.author,
		licence: LICENSE.address
	};
	return {
		...body,
		transactions: transactions.length,
		entry: {
			id: uuidOf(`settlement${JSON.stringify(body)}`),
			kind: "settlement",
			body
		}
	};
};
var SECRET_OF = (tenant) => `STRIPE_SECRET_KEY_${tenant.toUpperCase()}`;
/** The checkout session request, as Stripe's API takes it (form-encoded), with the licence in the metadata so the webhook carries it back. */
var planOf$1 = (c) => {
	const form = {
		mode: c.mode,
		success_url: c.successUrl,
		cancel_url: c.cancelUrl,
		"metadata[tenant]": c.tenant,
		"metadata[host]": c.host,
		"metadata[subject]": c.subject,
		"metadata[domains]": c.domains.join(","),
		"metadata[licence]": LICENSE.address,
		...c.customerEmail ? { customer_email: c.customerEmail } : {},
		...c.price ? { "line_items[0][price]": c.price } : {
			"line_items[0][price_data][currency]": c.currency,
			"line_items[0][price_data][unit_amount]": String(c.amount ?? 0),
			"line_items[0][price_data][product_data][name]": `Commercial licence of the QPU framework for ${c.subject} on ${c.domains.join(", ")}`,
			...c.mode === "subscription" ? { "line_items[0][price_data][recurring][interval]": "year" } : {}
		},
		"line_items[0][quantity]": "1"
	};
	return {
		method: "POST",
		url: "https://api.stripe.com/v1/checkout/sessions",
		headers: {
			"content-type": "application/x-www-form-urlencoded",
			"idempotency-key": uuidOf(`checkout${JSON.stringify(c)}`)
		},
		form,
		secret: SECRET_OF(c.tenant)
	};
};
/** Stripe's signature scheme: `t=<timestamp>,v1=<hmac>`; the signed payload is `<timestamp>.<body>`; the tenant's secret signs. */
var signatureOf = (secret, timestamp, payload) => `t=${timestamp},v1=${hex(hmacSha256(utf8(secret), utf8(`${timestamp}.${payload}`)))}`;
var verifySignature = (secret, header, payload, now, toleranceSeconds = 300) => {
	const parts = Object.fromEntries(header.split(",").map((p) => p.trim().split("=")));
	const t = Number(parts.t);
	const v1 = parts.v1;
	if (!Number.isFinite(t) || !v1) return {
		valid: false,
		why: "the header carries no t and v1",
		timestamp: null
	};
	if (Math.abs(now - t) > toleranceSeconds) return {
		valid: false,
		why: `timestamp ${t} is outside ${toleranceSeconds} s of now ${now}: a replay or a clock`,
		timestamp: t
	};
	return sameHex(hex(hmacSha256(utf8(secret), utf8(`${t}.${payload}`))), v1) ? {
		valid: true,
		why: "the tenant's secret signs this payload at this time",
		timestamp: t
	} : {
		valid: false,
		why: "the signature is not this tenant's: another tenant's secret, or a forged body",
		timestamp: t
	};
};
/** Every Stripe event this surface understands, read into the state it means for the licence. */
var STATE_OF = {
	"checkout.session.completed": "granted",
	"customer.subscription.created": "granted",
	"invoice.paid": "renewed",
	"customer.subscription.updated": "changed",
	"charge.refunded": "revoked",
	"customer.subscription.deleted": "revoked",
	"charge.dispute.created": "disputed",
	"charge.dispute.closed": "renewed",
	"invoice.payment_failed": "failed",
	"checkout.session.expired": "noted",
	"payment_intent.succeeded": "noted"
};
/** One idempotent entry per event: the same event again gives the same address, and the docket says duplicate. */
var entryOf = (tenant, event, earlier = []) => {
	const previous = earlier.filter((p) => p && p.body);
	const o = event.data?.object ?? {};
	const meta = o.metadata ?? {};
	const subject = meta.subject ?? String(o.subscription ?? o.payment_intent ?? o.customer ?? "unknown");
	const domains = meta.domains ? meta.domains.split(",") : previous.find((p) => p.body.subject === subject)?.body.domains ?? [tenant];
	const state = STATE_OF[event.type] ?? "noted";
	const grants = previous.filter((p) => p.body.subject === subject && (p.body.state === "granted" || p.body.state === "renewed")).map((p) => p.id);
	const item = o.items?.data?.[0] ?? o.lines?.data?.[0];
	const pm = (item?.price ?? o.price)?.metadata ?? {};
	const lastKnown = previous.filter((p) => p.body.subject === subject).at(-1)?.body;
	const body = {
		event: event.id,
		type: event.type,
		state,
		subject,
		tenant,
		domains,
		product: meta.product ?? pm.product ?? lastKnown?.product ?? null,
		variant: meta.variant ?? pm.variant ?? lastKnown?.variant ?? null,
		quantity: typeof item?.quantity === "number" ? item.quantity : typeof o.quantity === "number" ? o.quantity : null,
		customer: typeof o.customer === "string" ? o.customer : typeof o.customer_email === "string" ? o.customer_email : null,
		amount: typeof o.amount_total === "number" ? o.amount_total : typeof o.amount === "number" ? o.amount : typeof o.amount_paid === "number" ? o.amount_paid : null,
		currency: typeof o.currency === "string" ? o.currency : null,
		at: event.created ?? 0,
		licence: LICENSE.address,
		terms: LICENSE.terms
	};
	return {
		id: uuidOf(`stripe-event${event.id}`),
		kind: "licence",
		from: `stripe:${tenant}`,
		body,
		links: state === "revoked" || state === "disputed" || state === "renewed" || state === "changed" ? grants : []
	};
};
/** The licence state of a subject at a domain, from its entries in order: the last word wins; a domain outside the licence is unlicensed. */
var stateOf = (entries, subject, domain, now) => {
	const mine = entries.filter((e) => e && e.body && e.body.subject === subject).sort((a, b) => a.body.at - b.body.at);
	if (!mine.length) return {
		state: "unlicensed",
		why: `no licence entry names ${subject}; the a432 harmonic default stays free under attribution, commercial use requires a licence`,
		since: null,
		entries: 0
	};
	const last = mine.at(-1);
	if (!last.body.domains.includes(domain) && !last.body.domains.includes("*")) return {
		state: "unlicensed",
		why: `the licence of ${subject} names ${last.body.domains.join(", ")}, not ${domain}: a licence is per domain unless it names *`,
		since: null,
		entries: mine.length
	};
	if (last.body.state === "disputed") return {
		state: "disputed",
		why: `a dispute is open on ${subject} since ${last.body.at}; the licence is held until it closes`,
		since: last.body.at,
		entries: mine.length
	};
	if (last.body.state === "revoked" || last.body.state === "failed") return {
		state: "unlicensed",
		why: `${last.body.type} at ${last.body.at}: the licence of ${subject} ended`,
		since: null,
		entries: mine.length
	};
	const granted = mine.find((e) => e.body.state === "granted");
	return {
		state: "licensed",
		product: last.body.product,
		variant: last.body.variant,
		quantity: last.body.quantity,
		why: `${last.body.type} at ${last.body.at}${now > last.body.at + 31622400 && last.body.type !== "checkout.session.completed" ? " (more than a year since the last renewal: check the subscription)" : ""}`,
		since: granted?.body.at ?? last.body.at,
		entries: mine.length
	};
};
var stripe = toolOf("billing", {
	name: "stripe",
	description: "Stripe per tenant, pure, the QPU as a product with its variants. catalogue: every product and variant (domain, tenant, seat, metered, enterprise; month, year, metered; eur, usd, bgn) as the forms Stripe takes, per tenant. usage: metered calls from docket entries as a usage record. settle: the author's compensation from Stripe's own net figures, by product and tenant, as a settlement entry. plan: a checkout session request for a commercial licence (subject, domains, mode, price or amount) that the Worker sends with the tenant's secret key. webhook: the Stripe-Signature verified with the tenant's webhook secret (HMAC-SHA256, timestamp tolerance), the event read into one idempotent licence entry (granted, renewed, revoked, disputed, failed, noted) linked to what it changes. state: the licence state of a subject at a domain from its entries, at any tenant. The handler holds no key; the Worker executes plans and the docket keeps the entries.",
	inputSchema: {
		type: "object",
		properties: {
			op: {
				type: "string",
				enum: [
					"plan",
					"webhook",
					"state",
					"catalogue",
					"usage",
					"settle"
				]
			},
			currencies: {
				type: "array",
				items: { type: "string" }
			},
			from: { type: "integer" },
			to: { type: "integer" },
			transactions: {
				type: "array",
				items: { type: "object" },
				description: "settle: Stripe balance transactions {id, amount, fee, net, currency, product?, variant?, tenant?}"
			},
			tenant: { type: "string" },
			host: { type: "string" },
			checkout: {
				type: "object",
				description: "plan: { subject, domains, mode, price | amount, currency, successUrl, cancelUrl, customerEmail? }"
			},
			payload: {
				type: "string",
				description: "webhook: the raw body"
			},
			signature: {
				type: "string",
				description: "webhook: the Stripe-Signature header"
			},
			secret: {
				type: "string",
				description: "webhook: the tenant's webhook secret (the Worker passes it; a client never has it)"
			},
			now: {
				type: "integer",
				description: "webhook/state: unix seconds; default the current time"
			},
			entries: {
				type: "array",
				items: { type: "object" },
				description: "webhook/state: the subject's licence entries as read from the docket"
			},
			subject: { type: "string" },
			domain: { type: "string" },
			selftest: { type: "boolean" }
		}
	},
	run: (args, ctx) => {
		if (args.selftest) return {
			selftest: true,
			...BILLING.skill.selftest(ctx)
		};
		const op = String(args.op ?? "state");
		const tenant = String(args.tenant ?? "local");
		const now = typeof args.now === "number" ? args.now : Math.floor(Date.now() / 1e3);
		const entries = Array.isArray(args.entries) ? args.entries : [];
		if (op === "plan") {
			const c = args.checkout ?? {};
			if (!c.subject || !c.successUrl || !c.cancelUrl) throw new Error("plan needs checkout.subject, successUrl and cancelUrl");
			const plan = planOf$1({
				tenant,
				host: String(args.host ?? tenant),
				subject: c.subject,
				domains: c.domains?.length ? c.domains : [String(args.host ?? tenant)],
				mode: c.mode ?? "payment",
				price: c.price,
				amount: c.amount,
				currency: c.currency ?? "eur",
				successUrl: c.successUrl,
				cancelUrl: c.cancelUrl,
				customerEmail: c.customerEmail
			});
			return {
				op,
				tenant,
				secret: plan.secret,
				url: plan.url,
				fields: Object.keys(plan.form).length,
				plan,
				procedure: `the Worker sends this form to ${plan.url} with Authorization: Bearer <${plan.secret}> and answers with the session url; the webhook of this tenant then writes the licence entry`
			};
		}
		if (op === "webhook") {
			if (typeof args.payload !== "string" || typeof args.signature !== "string" || typeof args.secret !== "string") throw new Error("webhook needs payload, signature and secret");
			const v = verifySignature(args.secret, args.signature, args.payload, now);
			if (!v.valid) return {
				op,
				tenant,
				valid: false,
				why: v.why,
				timestamp: v.timestamp,
				entry: null,
				lead: {
					id: `stripe-webhook-refused-${tenant}`,
					statement: `a webhook at tenant ${tenant} was refused: ${v.why}`,
					status: "open",
					reason: "a refused webhook is a lead: a replay, a wrong tenant's secret, or a forged body; nothing was written"
				}
			};
			let event;
			try {
				event = JSON.parse(args.payload);
			} catch {
				return {
					op,
					tenant,
					valid: true,
					why: "signed, but the body is not JSON",
					entry: null
				};
			}
			const entry = entryOf(tenant, event, entries);
			const duplicate = entries.some((e) => e.id === entry.id);
			return {
				op,
				tenant,
				valid: true,
				why: v.why,
				event: event.id,
				type: event.type,
				state: entry.body.state,
				duplicate,
				entry,
				procedure: duplicate ? "the same event again: the docket answers duplicate, nothing changes" : `POST this entry to the ${tenant} docket as its stripe writer; it mirrors to the other tenants, where state reads it by the domains it names`
			};
		}
		if (op === "state") {
			if (typeof args.subject !== "string") throw new Error("state needs subject");
			const st = stateOf(entries, args.subject, String(args.domain ?? args.host ?? tenant), now);
			return {
				op,
				tenant,
				subject: args.subject,
				domain: String(args.domain ?? args.host ?? tenant),
				...st
			};
		}
		if (op === "catalogue") {
			const c = catalogueOf(tenant, Array.isArray(args.currencies) ? args.currencies.map(String) : [
				"eur",
				"usd",
				"bgn"
			]);
			return {
				op,
				tenant,
				products: c.products.length,
				prices: c.prices.length,
				variants: CATALOGUE.length,
				secret: c.secret,
				catalogue: CATALOGUE,
				forms: c,
				procedure: `the Worker creates the products and prices at Stripe with <${c.secret}> once per tenant; the price ids come back in the webhooks' metadata`
			};
		}
		if (op === "usage") {
			if (typeof args.subject !== "string") throw new Error("usage needs subject");
			const u = usageOf(Array.isArray(args.entries) ? args.entries : [], args.subject, Number(args.from ?? 0), Number(args.to ?? now));
			return {
				op,
				tenant,
				subject: args.subject,
				...u,
				procedure: "the Worker posts the form to /v1/subscription_items/<item>/usage_records with the tenant key; the receipt is an entry"
			};
		}
		if (op === "settle") return {
			op,
			tenant,
			...settlementOf(Array.isArray(args.transactions) ? args.transactions : []),
			procedure: "balance transactions are read from Stripe with the tenant key (net and fee are Stripe's figures); the settlement entry is written to the docket as the author's compensation ledger"
		};
		throw new Error(`op ${op} is not one of plan, webhook, state, catalogue, usage, settle`);
	},
	widget: flowWidget
});
var SECRET = "whsec_test_secret_of_tenant_psg";
var EVENT = (id, type, created, object) => JSON.stringify({
	id,
	type,
	created,
	data: { object }
});
var COMPLETED = EVENT("evt_1", "checkout.session.completed", 17e8, {
	customer: "cus_1",
	amount_total: 43200,
	currency: "eur",
	metadata: {
		tenant: "psg",
		subject: "acme",
		domains: "qpu.psg.bg,qpu.uuidna.com"
	}
});
var BILLING = {
	name: "billing",
	idea: "Stripe per tenant: a licence bought at one tenant is an entry valid on the domains it names, every event idempotent and linked, every signature verified with the tenant's own secret, every refusal a lead",
	tools: [stripe],
	examples: [
		{
			id: "stripe-plan",
			tool: "stripe",
			arguments: {
				op: "plan",
				tenant: "psg",
				host: "qpu.psg.bg",
				checkout: {
					subject: "acme",
					domains: ["qpu.psg.bg", "qpu.uuidna.com"],
					mode: "subscription",
					amount: 43200,
					currency: "eur",
					successUrl: "https://qpu.psg.bg/licence?ok",
					cancelUrl: "https://qpu.psg.bg/licence?cancel"
				}
			},
			shows: "A checkout plan for a yearly commercial licence of acme on two domains, bought at tenant psg: the form Stripe takes, the metadata the webhook brings back, the tenant secret the Worker alone holds.",
			expect: (s) => s.secret === "STRIPE_SECRET_KEY_PSG" && s.plan.form["metadata[domains]"] === "qpu.psg.bg,qpu.uuidna.com" && s.plan.form["line_items[0][price_data][recurring][interval]"] === "year" ? null : JSON.stringify(s.plan?.form).slice(0, 160)
		},
		{
			id: "stripe-catalogue",
			tool: "stripe",
			arguments: {
				op: "catalogue",
				tenant: "uuidna",
				currencies: ["eur", "usd"]
			},
			shows: "The QPU as a product line for tenant uuidna: seven variants over five products, each a Stripe price form in two currencies, the a432 default at zero.",
			expect: (s) => s.variants === 7 && s.products === 6 && s.prices === 14 && s.catalogue[0].amounts.eur === 0 ? null : `${s.products} products, ${s.prices} prices, ${s.variants} variants`
		},
		{
			id: "stripe-webhook",
			tool: "stripe",
			arguments: {
				op: "webhook",
				tenant: "psg",
				payload: COMPLETED,
				signature: signatureOf(SECRET, 17e8, COMPLETED),
				secret: SECRET,
				now: 1700000100
			},
			shows: "A checkout completed at tenant psg, its signature verified with psg's webhook secret, read into one licence entry granting acme on both domains.",
			expect: (s) => s.valid === true && s.state === "granted" && s.duplicate === false && s.entry.body.domains.length === 2 ? null : `${s.valid} ${s.why} ${s.state}`
		}
	],
	skill: {
		instructions: "Per tenant the author sets two wrangler secrets, STRIPE_SECRET_KEY_<TENANT> and STRIPE_WEBHOOK_SECRET_<TENANT>, and registers https://<host>/docket/stripe as the webhook endpoint at Stripe. A client calls stripe plan and the Worker executes the plan with the tenant key, answering the session url. Stripe posts events to the tenant's endpoint; the Worker calls stripe webhook with the raw body, the Stripe-Signature header and the tenant secret, writes the entry it gets to the tenant docket (mirrors carry it to the others), and answers 200 on a duplicate. Any host answers stripe state for a subject at its domain from the entries it holds.",
		directions: [
			"server only: SHA-256 and HMAC vectors, the signature round trip, every event type to its state, every scenario between tenants",
			"client → server: the Worker hands the raw body, the header and the secret; the handler never holds a key",
			"toolbox → toolbox: entries are addressed with the tree's uuidOf, kept in the raid docket, verified by the tree toolbox's verify"
		],
		selftest: () => {
			const checks = [];
			const check = (id, passed, evidence) => checks.push({
				id,
				passed,
				evidence
			});
			check("billing:sha256-vector", hex(hmacSha256(utf8("key"), utf8("The quick brown fox jumps over the lazy dog"))) === "f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8", "RFC 2104 / Wikipedia HMAC-SHA256 vector");
			const sig = signatureOf(SECRET, 17e8, COMPLETED);
			check("billing:signature-valid", verifySignature(SECRET, sig, COMPLETED, 1700000010).valid, "the tenant's own secret verifies");
			check("billing:signature-other-tenant", !verifySignature("whsec_of_tenant_uuidna", sig, COMPLETED, 1700000010).valid, "another tenant's secret does not: the scenario between tenants");
			check("billing:signature-replay", !verifySignature(SECRET, sig, COMPLETED, 17e8 + 3600).valid && !verifySignature(SECRET, sig, COMPLETED.replace("43200", "1"), 1700000010).valid, "an old timestamp and an altered body are refused");
			const e1 = entryOf("psg", JSON.parse(COMPLETED));
			const e1again = entryOf("psg", JSON.parse(COMPLETED));
			check("billing:idempotent", e1.id === e1again.id && e1.body.state === "granted" && e1.links.length === 0, "the same event gives the same address");
			const renewed = entryOf("psg", JSON.parse(EVENT("evt_2", "invoice.paid", 1731e6, {
				customer: "cus_1",
				amount_paid: 43200,
				currency: "eur",
				metadata: { subject: "acme" }
			})), [e1]);
			const refunded = entryOf("uuidna", JSON.parse(EVENT("evt_3", "charge.refunded", 1732e6, {
				customer: "cus_1",
				amount: 43200,
				currency: "eur",
				metadata: { subject: "acme" }
			})), [e1, renewed]);
			const disputed = entryOf("psg", JSON.parse(EVENT("evt_4", "charge.dispute.created", 17315e5, {
				customer: "cus_1",
				metadata: { subject: "acme" }
			})), [e1, renewed]);
			check("billing:links", renewed.links[0] === e1.id && refunded.links.length === 2 && refunded.body.domains.join() === "qpu.psg.bg,qpu.uuidna.com", "a renewal links the grant, a refund links both, the domains carry over from the grant");
			const now = 1733e6;
			const at = (entries, domain) => stateOf(entries, "acme", domain, now).state;
			check("billing:state-across-domains", at([e1], "qpu.psg.bg") === "licensed" && at([e1], "qpu.uuidna.com") === "licensed" && at([e1], "qpu.ceci.workers.dev") === "unlicensed", "a licence bought at psg is honoured at uuidna and not at a domain it does not name");
			check("billing:state-scenarios", at([e1, renewed], "qpu.psg.bg") === "licensed" && at([
				e1,
				renewed,
				refunded
			], "qpu.uuidna.com") === "unlicensed" && at([
				e1,
				renewed,
				disputed
			], "qpu.psg.bg") === "disputed" && at([], "qpu.psg.bg") === "unlicensed", "renewed stays licensed; a refund at another tenant ends it; a dispute holds it; nothing is nothing");
			const plan = planOf$1({
				tenant: "uuidna",
				host: "qpu.uuidna.com",
				subject: "acme",
				domains: ["*"],
				mode: "payment",
				amount: 43200,
				currency: "eur",
				successUrl: "https://qpu.uuidna.com/ok",
				cancelUrl: "https://qpu.uuidna.com/no"
			});
			const changed = entryOf("psg", JSON.parse(EVENT("evt_5", "customer.subscription.updated", 17316e5, {
				customer: "cus_1",
				items: { data: [{
					quantity: 3,
					price: { metadata: {
						product: "qpu-seat",
						variant: "monthly"
					} }
				}] },
				metadata: { subject: "acme" }
			})), [e1, renewed]);
			check("billing:variants", changed.body.state === "changed" && changed.body.product === "qpu-seat" && changed.body.quantity === 3 && changed.links.length === 2 && stateOf([
				e1,
				renewed,
				changed
			], "acme", "qpu.psg.bg", now).variant === "monthly", "a subscription change keeps the licence and records the new variant and quantity, linked to the grants");
			const cat = catalogueOf("psg", ["eur", "bgn"]);
			check("billing:catalogue", cat.prices.length === 14 && cat.prices.every((p) => p.form["metadata[tenant]"] === "psg") && cat.prices.some((p) => p.form["recurring[usage_type]"] === "metered") && CATALOGUE.every((v) => Object.values(v.amounts).every((a) => Number.isInteger(a) && a >= 0)), "per-tenant catalogue, metered variant, integer minor units");
			const usage = usageOf([
				{
					kind: "usage",
					date: "2026-10-10T00:00:00Z",
					body: {
						subject: "acme",
						calls: 1500
					}
				},
				{
					kind: "usage",
					date: "2026-10-20T00:00:00Z",
					body: {
						subject: "acme",
						calls: 600
					}
				},
				{
					kind: "usage",
					date: "2026-11-02T00:00:00Z",
					body: {
						subject: "acme",
						calls: 999
					}
				}
			], "acme", Date.parse("2026-10-01T00:00:00Z") / 1e3, Date.parse("2026-11-01T00:00:00Z") / 1e3);
			check("billing:usage", usage.calls === 2100 && usage.thousands === 3 && usage.form.quantity === "3", "calls in the period summed from usage entries, rounded up to thousands");
			const settle = settlementOf([
				{
					id: "txn_1",
					amount: 43200,
					fee: 1278,
					net: 41922,
					currency: "eur",
					product: "qpu-domain",
					tenant: "psg"
				},
				{
					id: "txn_2",
					amount: 2700,
					fee: 103,
					net: 2597,
					currency: "eur",
					product: "qpu-seat",
					tenant: "uuidna"
				},
				{
					id: "txn_3",
					amount: 47500,
					fee: 1400,
					net: 46100,
					currency: "usd",
					product: "qpu-domain",
					tenant: "psg"
				}
			]);
			check("billing:settlement", settle.net.eur === 44519 && settle.net.usd === 46100 && settle.byProduct["qpu-domain:eur"] === 41922 && settle.byTenant["uuidna:eur"] === 2597 && settle.entry.id.length === 36 && settlementOf([]).transactions === 0, "net by currency, product and tenant from Stripe's own figures; the ledger content-addressed");
			check("billing:plan", plan.secret === "STRIPE_SECRET_KEY_UUIDNA" && plan.form["metadata[domains]"] === "*" && plan.headers["idempotency-key"].length === 36 && plan.form["line_items[0][price_data][unit_amount]"] === "43200", "the plan names the tenant secret, the domains and an idempotency key");
			return {
				passed: checks.every((c) => c.passed),
				checks
			};
		}
	}
};
// src/quantum/toolboxes/legal.ts
/** The claims the author makes, read from the tree and its metadata; each a sentence a door can judge. */
var claimsOf = (texts, leads, cite) => {
	const backed = ` backed by theorem ${cite?.theorem ?? "legal_only_the_proven_is_admitted"}`;
	const out = [
		{
			id: "licence-spdx",
			source: "src/quantum/license.ts",
			text: `@uuidna/qpu is licensed ${LICENSE.spdx} by ${LICENSE.author}; commercial use requires a licence from the author,${backed}`
		},
		{
			id: "licence-address",
			source: "src/quantum/license.ts",
			text: `the licence record is at ${LICENSE.url}; its address and imprint are the ones the unit's rights door gives, carried by every result as _meta.license,${backed}`
		},
		{
			id: "author-orcid",
			source: "src/quantum/license.ts",
			text: `the author is ${LICENSE.author}, ORCID ${LICENSE.orcid}`
		},
		{
			id: "representation",
			source: "src/quantum/license.ts",
			text: `${LICENSE.representation.replace(/\.$/, "")},${backed}`
		},
		{
			id: "disclaimer",
			source: "src/quantum/license.ts",
			text: `${LICENSE.disclaimer.replace(/\.$/, "")},${backed}`
		}
	];
	const field = (text, re) => text?.match(re)?.[1]?.trim();
	const citationAuthor = field(texts.citation, /family-names:\s*(\S+)/);
	const citationGiven = field(texts.citation, /given-names:\s*(\S+)/);
	const citationLicence = field(texts.citation, /^license:\s*(\S+)/m);
	const citationOrcid = field(texts.citation, /orcid:\s*(\S+)/);
	if (texts.citation) out.push({
		id: "citation-cff",
		source: "CITATION.cff",
		text: `CITATION.cff names ${citationGiven ?? "?"} ${citationAuthor ?? "?"} (${citationOrcid ?? "no ORCID"}) as the author under ${citationLicence ?? "no licence"}`
	});
	if (texts.zenodo) try {
		const z = JSON.parse(texts.zenodo);
		out.push({
			id: "zenodo-json",
			source: ".zenodo.json",
			text: `.zenodo.json names ${z.creators?.map((c) => `${c.name} (${c.orcid ?? "no ORCID"})`).join(", ") ?? "nobody"} as creator of ${z.title ?? "?"} under ${z.license ?? "no licence"}`
		});
	} catch {
		out.push({
			id: "zenodo-json",
			source: ".zenodo.json",
			text: ".zenodo.json is not valid JSON"
		});
	}
	if (texts.package) try {
		const p = JSON.parse(texts.package);
		out.push({
			id: "package-json",
			source: "package.json",
			text: `package.json names ${p.name ?? "?"} ${p.version ?? ""} under ${p.license ?? "no licence"} by ${typeof p.author === "string" ? p.author : p.author?.name ?? "nobody"}`
		});
	} catch {
		out.push({
			id: "package-json",
			source: "package.json",
			text: "package.json is not valid JSON"
		});
	}
	for (const m of (texts.readme ?? "").matchAll(/^\| ([^|]+) \| ([^|]+) \|$/gm)) if (!/^-+$|^Measure$/.test(m[1].trim())) out.push({
		id: `readme-${m[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
		source: "README.md measured table",
		text: `${m[1].trim()}: ${m[2].trim()}`
	});
	for (const l of leads.filter((x) => x.id.startsWith("perspective-"))) out.push({
		id: l.id,
		source: l.source,
		text: l.statement
	});
	return out;
};
/** The tree's own security checks over its source texts: what a reader would ask of a Worker that holds tokens and keys. */
var securityOf = (texts) => {
	const w = texts.worker ?? "";
	const b = texts.billing ?? "";
	const h = texts.hmac ?? "";
	const m = texts.mcp ?? "";
	const all = `${w}\n${b}\n${h}\n${m}\n${texts.readme ?? ""}`;
	const checks = [];
	const check = (id, passed, evidence) => checks.push({
		id,
		passed,
		evidence
	});
	if (!w) {
		check("security:worker-text", false, "no worker source given: nothing measured");
		return checks;
	}
	check("security:no-live-secret-literal", !/\b(sk_live_|whsec_[0-9A-Za-z]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC )?PRIVATE KEY)/.test(all), "no live Stripe key, webhook secret, AWS key or private key literal in the sources");
	check("security:tokens-compared-in-constant-time", /const sameToken[\s\S]*?\^/.test(w) || /sameToken = [\s\S]{0,400}\^/.test(w), "sameToken xors the bytes; no early exit on a mismatch");
	check("security:signature-compared-in-constant-time", /sameHex[\s\S]*?\^/.test(h) && /sameHex\(/.test(b), "the Stripe signature is compared by sameHex, xor over every character");
	check("security:writes-need-a-role", /need && role === 'reader'/.test(w) && /need === 'admin' && role !== 'admin'/.test(w), "POST needs writer, DELETE needs admin; a reader is refused with the procedure");
	check("security:tenant-isolation", /idFromName\(tenant\)/.test(w) && !/idFromName\('qpu'\)/.test(w), "the docket is addressed by tenant, never by a fixed name");
	check("security:webhook-verified-before-write", /verifySignature\(/.test(b) && /if \(!out\.valid\) return json/.test(w), "a webhook is verified before anything is written; a refusal is answered 400 and recorded as a lead");
	check("security:keys-stay-in-the-worker", !/STRIPE_SECRET_KEY|QPU_DATA_KEY|QPU_WRITE_TOKEN/.test(m), "the handler names no secret; the Worker alone reads env");
	check("security:cors-headers", /Access-Control-Allow-Origin/.test(w) && /OPTIONS/.test(w), "cross-origin reads allowed, preflight answered");
	check("security:timeouts-on-outbound", /AbortSignal\.timeout\(/.test(w), "every outbound fetch of the Worker carries a timeout");
	check("security:no-eval", !/\beval\(|new Function\(/.test(all), "no eval, no Function constructor");
	return checks;
};
var DOOR_PURPOSE = {
	get_legal_facts: "legal",
	get_rights: "legal",
	get_laws: "legal",
	compute_license: "licence",
	compute_prior_art: "prior-art",
	get_due_process: "due-process",
	audit_security: "security",
	audit_cloudflare: "security",
	detect_traitors: "security",
	get_conformance: "security",
	get_fingerprint: "security",
	audit_full_anti_fraud: "security",
	get_guard_lessons: "security"
};
/** The calls: every claim to the forensic and verification doors; the legal, licence, prior-art, due-process and security doors once. */
var planOf = (claims, discovery, agents, theoremKeys) => {
	const doors = discovery?.doors ?? [];
	const has = (name) => doors.find((d) => d.name === name);
	const chosen = agents?.length ? [...agents] : [
		...Object.keys(DOOR_PURPOSE),
		"compute_forensics",
		"verify_claim"
	].filter((n) => has(n));
	const absent = chosen.filter((n) => !has(n));
	const calls = [];
	const host = (name) => has(name)?.host ?? "uuidna.com";
	for (const name of chosen) {
		if (!has(name)) continue;
		if (name === "compute_forensics") for (const c of claims) calls.push({
			door: name,
			host: host(name),
			arguments: { statement: c.text },
			purpose: "forensics"
		});
		else if (name === "verify_claim") for (const c of claims) calls.push({
			door: name,
			host: host(name),
			arguments: { statement: c.text },
			purpose: "verify"
		});
		else if (name === "compute_license") calls.push({
			door: name,
			host: host(name),
			arguments: {
				licensee: "@uuidna/qpu (this tree)",
				commercial: false
			},
			purpose: "licence"
		});
		else if (name === "compute_prior_art") calls.push({
			door: name,
			host: host(name),
			arguments: { keys: theoremKeys.slice(0, 50) },
			purpose: "prior-art"
		});
		else if (name === "get_due_process") calls.push({
			door: name,
			host: host(name),
			arguments: { claims: claims.map((c) => c.text) },
			purpose: "due-process"
		});
		else calls.push({
			door: name,
			host: host(name),
			arguments: {},
			purpose: DOOR_PURPOSE[name] ?? "security"
		});
	}
	return {
		calls,
		agents: chosen,
		by: agents?.length ? "operator" : "free-by-default",
		absent
	};
};
/** The answers read: verdicts per claim, drift between the unit's facts and the tree's licence, security findings, due process gaps. */
var auditOf$1 = (claims, answers, security) => {
	const findings = [];
	for (const a of answers.filter((x) => x.purpose === "forensics" || x.purpose === "verify")) {
		const claim = claims.find((c) => c.text === a.arguments.statement)?.id ?? "?";
		if (a.refusal !== void 0) {
			findings.push({
				claim,
				door: a.door,
				verdict: null,
				clean: null,
				violations: 0,
				violationKinds: [],
				note: "",
				receipt: null,
				refusal: a.refusal.slice(0, 200)
			});
			continue;
		}
		const r = a.answer ?? {};
		const kinds = Array.isArray(r.violations) ? r.violations.map((v) => `${v.kind ?? "violation"}: ${(v.detail ?? "").slice(0, 120)}`) : [];
		findings.push({
			claim,
			door: a.door,
			verdict: r.verdict ?? null,
			clean: typeof r.clean === "boolean" ? r.clean : null,
			violations: kinds.length,
			violationKinds: kinds,
			note: (kinds.length ? kinds.join("; ") : r.note ?? r.honest ?? "").slice(0, 240),
			receipt: r.receipt ?? null,
			refusal: null
		});
	}
	const legal = answers.find((a) => a.door === "get_legal_facts")?.answer;
	const rights = answers.find((a) => a.door === "get_rights")?.answer;
	const drift = [];
	if (rights) {
		if (rights.license !== LICENSE.spdx) drift.push(`spdx ${rights.license} vs ${LICENSE.spdx}`);
		if (rights.licenseAddress !== LICENSE.address) drift.push(`licence address ${rights.licenseAddress} vs ${LICENSE.address}`);
		if (rights.imprint !== LICENSE.imprint) drift.push(`imprint ${rights.imprint} vs ${LICENSE.imprint}`);
		if (typeof rights.holder === "string" && !rights.holder.includes(LICENSE.author)) drift.push(`holder ${rights.holder} vs ${LICENSE.author}`);
	}
	const licence = answers.find((a) => a.door === "compute_license")?.answer;
	const priorArt = answers.find((a) => a.door === "compute_prior_art")?.answer;
	const due = answers.find((a) => a.door === "get_due_process")?.answer;
	const securityDoors = answers.filter((a) => a.purpose === "security").map((a) => {
		const r = a.answer ?? {};
		return {
			door: a.door,
			refusal: a.refusal ?? null,
			clean: typeof r.clean === "boolean" ? r.clean : typeof r.allClear === "boolean" ? r.allClear : typeof r.conforms === "boolean" ? r.conforms : typeof r.allHold === "boolean" ? r.allHold : typeof r.fraudDetected === "boolean" ? !r.fraudDetected : null,
			failed: typeof r.failed === "number" ? r.failed : Array.isArray(r.traitors) ? r.traitors.length : Array.isArray(r.offenders) ? r.offenders.length : null,
			receipt: typeof r.receipt === "string" ? r.receipt : null,
			honest: typeof r.honest === "string" ? r.honest.slice(0, 160) : ""
		};
	});
	const verdicts = findings.reduce((acc, f) => ({
		...acc,
		[f.verdict ?? (f.refusal ? "refused" : "none")]: (acc[f.verdict ?? (f.refusal ? "refused" : "none")] ?? 0) + 1
	}), {});
	const violations = findings.reduce((n, f) => n + f.violations, 0);
	return {
		claims: claims.length,
		findings,
		verdicts,
		violations,
		drift,
		legalFacts: legal ?? null,
		rights: rights ? {
			holder: rights.holder,
			license: rights.license,
			licenseAddress: rights.licenseAddress,
			imprint: rights.imprint,
			receipt: rights.receipt
		} : null,
		licence: licence ? {
			scope: licence.scope,
			spdx: licence.spdx,
			free: licence.bill?.free
		} : null,
		priorArt: priorArt ? {
			exhibits: priorArt.exhibits?.length ?? 0,
			missing: priorArt.missing?.length ?? 0,
			author: priorArt.author
		} : null,
		dueProcess: due ? {
			allGuaranteesSealed: due.allGuaranteesSealed,
			gaps: due.gaps?.length ?? 0,
			docket: due.docket?.length ?? 0,
			traitors: due.traitors?.length ?? 0
		} : null,
		securityDoors,
		security: [...security],
		securityPassed: security.filter((c) => c.passed).length,
		securityTotal: security.length,
		refusals: answers.filter((a) => a.refusal !== void 0).length
	};
};
var legalPageOf = (a, plan, date) => [
	"---",
	"title: Legal",
	"order: 56",
	"---",
	"",
	"# The legal and security audit, through MCP",
	"",
	`> ${a.legalFacts?.disclaimer ?? LICENSE.disclaimer}`,
	"",
	`Run by \`npm run next\` on ${date} through the \`legal\` tool: every claim the author makes in this tree sent to the unit's forensic and verification doors, the unit's legal facts and rights beside this tree's licence module, the licence computed for this tree, the prior art of its theorems, due process over the claims, every security door the unit serves, and the tree's own security checks over its sources. Agents: ${plan.agents.join(", ")} (${plan.by}${plan.absent.length ? `; absent: ${plan.absent.join(", ")}` : ""}). ${LICENSE.disclaimer}`,
	"",
	`## Claims: ${a.claims}; verdicts ${Object.entries(a.verdicts).map(([k, v]) => `${k} ${v}`).join(", ")}; violations ${a.violations}; refusals ${a.refusals}`,
	"",
	"| Claim | Door | Verdict | Clean | Violations | Receipt | Note or refusal |",
	"|---|---|---|---|---:|---|---|",
	...a.findings.map((f) => `| ${f.claim} | ${f.door} | ${f.verdict ?? "—"} | ${f.clean === null ? "—" : f.clean} | ${f.violations} | ${f.receipt ?? "—"} | ${(f.note || f.refusal || "").replace(/\|/g, "\\|")} |`),
	"",
	"## Rights and drift",
	"",
	a.rights ? `The unit's rights: holder ${a.rights.holder}, ${a.rights.license}, licence address ${a.rights.licenseAddress}, imprint ${a.rights.imprint}, receipt ${a.rights.receipt}. ${a.drift.length ? `Drift against this tree: ${a.drift.join("; ")}.` : "No drift against this tree's licence module."}` : "The rights door was not reached.",
	"",
	"## Licence, prior art, due process",
	"",
	`Licence computed for this tree: ${a.licence ? `${a.licence.scope}, ${a.licence.spdx}, free ${a.licence.free}` : "not reached"}. Prior art: ${a.priorArt ? `${a.priorArt.exhibits} exhibits, ${a.priorArt.missing} keys missing from the unit's ledger (qpu's own theorems are not sealed there: lead gap-theorems-unsealed), author ${a.priorArt.author}` : "not reached"}. Due process: ${a.dueProcess ? `guarantees sealed ${a.dueProcess.allGuaranteesSealed}, ${a.dueProcess.docket} on the docket, ${a.dueProcess.gaps} gaps, ${a.dueProcess.traitors} traitors` : "not reached"}.`,
	"",
	"## Security doors of the unit",
	"",
	"| Door | Clean | Failed | Receipt | Honest |",
	"|---|---|---:|---|---|",
	...a.securityDoors.map((d) => `| ${d.door} | ${d.refusal ? `refused: ${d.refusal.slice(0, 80)}` : d.clean === null ? "—" : d.clean} | ${d.failed ?? "—"} | ${d.receipt ?? "—"} | ${d.honest.replace(/\|/g, "\\|")} |`),
	"",
	`## This tree's security checks: ${a.securityPassed} of ${a.securityTotal}`,
	"",
	"| Check | Passed | Evidence |",
	"|---|---|---|",
	...a.security.map((c) => `| ${c.id} | ${c.passed ? "✓" : "✗"} | ${c.evidence.replace(/\|/g, "\\|")} |`),
	""
].join("\n");
var legal = toolOf("legal", {
	name: "legal",
	description: "The full legal and security audit with forensic analysis, through MCP. Phase one (texts, discovery, agents?, theoremKeys?): the author's claims gathered from the tree and its metadata, this tree's own security checks over its sources, and the plan of calls to the unit's forensic, verification, legal, licence, prior-art, due-process and security doors — free agents found by discovery by default, the operator's own list when given. Phase two (plus answers): verdicts per claim, drift against this tree's licence, the findings, the page. Recomputable facts, not legal advice.",
	inputSchema: {
		type: "object",
		properties: {
			texts: {
				type: "object",
				description: "{ readme, citation, zenodo, package, worker, billing, hmac, mcp }: the texts of the tree"
			},
			discovery: { type: "object" },
			agents: {
				type: "array",
				items: { type: "string" },
				description: "the operator's override: the doors to use; omit for the free doors discovery found"
			},
			theoremKeys: {
				type: "array",
				items: { type: "string" }
			},
			citeTheorem: {
				type: "string",
				description: "the sealed guarantee of the unit's court cited beside every legal claim; default legal_only_the_proven_is_admitted, a key its due-process door names"
			},
			answers: {
				type: "array",
				items: { type: "object" }
			},
			selftest: { type: "boolean" }
		}
	},
	run: (args, ctx) => {
		if (args.selftest) return {
			selftest: true,
			...LEGAL.skill.selftest(ctx)
		};
		const texts = args.texts ?? {};
		const claims = claimsOf(texts, ctx.leads, { theorem: typeof args.citeTheorem === "string" ? args.citeTheorem : null });
		const security = securityOf(texts);
		const plan = planOf(claims, args.discovery ?? null, Array.isArray(args.agents) ? args.agents.map(String) : null, Array.isArray(args.theoremKeys) ? args.theoremKeys.map(String) : []);
		if (!Array.isArray(args.answers)) return {
			phase: "plan",
			claims: claims.length,
			calls: plan.calls.length,
			agents: plan.agents.length,
			by: plan.by,
			securityPassed: security.filter((c) => c.passed).length,
			securityTotal: security.length,
			claimList: claims,
			plan,
			security
		};
		const audit = auditOf$1(claims, args.answers, security);
		const date = (/* @__PURE__ */ new Date()).toISOString();
		const inputs = {
			texts: Object.fromEntries(Object.entries(texts).filter(([, t]) => typeof t === "string").map(([k, t]) => [k, hex(sha256(utf8(t)))])),
			discovery: args.discovery ? hex(sha256(utf8(JSON.stringify(args.discovery)))) : null,
			theoremKeys: hex(sha256(utf8(JSON.stringify(args.theoremKeys ?? [])))),
			answers: hex(sha256(utf8(JSON.stringify(args.answers))))
		};
		const content = JSON.stringify({
			inputs,
			audit,
			agents: plan.agents,
			by: plan.by
		});
		return {
			phase: "audit",
			id: uuidOf(content),
			sha256: hex(sha256(utf8(content))),
			inputs,
			claims: audit.claims,
			violations: audit.violations,
			refusals: audit.refusals,
			drift: audit.drift.length,
			securityPassed: audit.securityPassed,
			securityTotal: audit.securityTotal,
			by: plan.by,
			audit,
			page: legalPageOf(audit, plan, date)
		};
	},
	widget: flowWidget
});
var FIXTURE_TEXTS = {
	citation: "cff-version: 1.2.0\ntitle: QPU\nauthors:\n  - family-names: Rouschev\n    given-names: Tsvetan\n    orcid: https://orcid.org/0009-0000-7312-9778\nlicense: CC-BY-NC-ND-4.0\n",
	zenodo: "{\"creators\":[{\"name\":\"Rouschev, Tsvetan\",\"orcid\":\"0009-0000-7312-9778\"}],\"license\":\"cc-by-nc-nd-4.0\",\"title\":\"QPU\"}",
	package: "{\"name\":\"@uuidna/qpu\",\"version\":\"1.4.0\",\"license\":\"CC-BY-NC-ND-4.0\",\"author\":{\"name\":\"Tsvetan Rouschev\"}}",
	readme: "| Measure | Value |\n|---|---:|\n| Tests | 152 pass |\n",
	worker: "const sameToken = (a, b) => { let d = 0; for (...) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0 }\nif (need && role === 'reader') return json()\nif (need === 'admin' && role !== 'admin') return json()\nidFromName(tenant)\nif (!out.valid) return json({ refused })\nAccess-Control-Allow-Origin OPTIONS AbortSignal.timeout(5000)",
	billing: "verifySignature(secret) sameHex(expected, v1)",
	hmac: "export const sameHex = (a, b) => { let d = 0; d |= a.charCodeAt(i) ^ b.charCodeAt(i) }",
	mcp: "const BALANCER = new Map()"
};
var LEGAL = {
	name: "legal",
	idea: "the legal and security audit of this MCP through MCP: the author's claims judged by the unit's forensic, legal and security doors, free agents by default, the operator alone overriding, beside the tree's own checks of its sources",
	tools: [legal],
	examples: [{
		id: "legal-audit-offline",
		tool: "legal",
		arguments: {
			texts: FIXTURE_TEXTS,
			answers: []
		},
		shows: "Phase two with no answers (offline): the claims, the tree's security checks, and the audit's own content address over the SHA-256 of every input — change a source and the address changes.",
		expect: (s) => s.phase === "audit" && typeof s.id === "string" && s.id.length === 36 && s.sha256.length === 64 && s.inputs.texts.worker?.length === 64 && s.securityPassed === s.securityTotal ? null : `${s.phase} ${s.id} ${s.securityPassed}/${s.securityTotal}`
	}, {
		id: "legal-plan",
		tool: "legal",
		arguments: {
			texts: FIXTURE_TEXTS,
			discovery: { doors: [
				{
					host: "uuidna.com",
					url: "https://uuidna.com/mcp",
					name: "compute_forensics",
					description: "",
					takes: ["statement"],
					required: ["statement"],
					answers: ["verdict", "receipt"],
					readOnly: true,
					contract: "catalogue"
				},
				{
					host: "uuidna.com",
					url: "https://uuidna.com/mcp",
					name: "get_rights",
					description: "",
					takes: [],
					required: [],
					answers: ["receipt"],
					readOnly: true,
					contract: "tools/list"
				},
				{
					host: "uuidna.com",
					url: "https://uuidna.com/mcp",
					name: "audit_security",
					description: "",
					takes: [],
					required: [],
					answers: ["receipt"],
					readOnly: true,
					contract: "catalogue"
				}
			] }
		},
		shows: "Phase one on fixture texts and a three-door discovery: the claims gathered (licence, author, metadata, measured table, perspectives), the tree's security checks, and the plan — one forensics call per claim, the rights and security doors once, free by default.",
		expect: (s) => s.phase === "plan" && s.claims >= 10 && s.by === "free-by-default" && s.agents === 3 && s.calls === s.claims + 2 && s.securityPassed === s.securityTotal ? null : `${s.phase} ${s.claims} claims ${s.calls} calls ${s.agents} agents ${s.by} security ${s.securityPassed}/${s.securityTotal}`
	}],
	skill: {
		instructions: "The client reads the tree's texts (README, CITATION.cff, .zenodo.json, package.json, src/worker.ts, the billing and hmac modules, mcp.ts), the discovery and the theorem ledger, calls legal for the plan, makes every call against its host, and calls legal again with the answers; it writes legal.json and the page. Agents are the free doors discovery found; the operator overrides with agents: [...] and nothing else does. A refusal is recorded, never retried blindly.",
		directions: [
			"server only: claims from fixture metadata, security checks on fixture sources, the plan, the audit of fixture answers",
			"client → server: the texts come from the tree, the answers from the doors",
			"toolbox → toolbox: the doors come from discovery; the claims include every perspective lead; the licence module is the measure of drift"
		],
		selftest: (ctx) => {
			const checks = [];
			const check = (id, passed, evidence) => checks.push({
				id,
				passed,
				evidence
			});
			const claims = claimsOf(FIXTURE_TEXTS, ctx.leads);
			check("legal:claims", claims.some((c) => c.id === "citation-cff" && c.text.includes("Tsvetan Rouschev")) && claims.some((c) => c.id === "zenodo-json") && claims.some((c) => c.id === "package-json") && claims.some((c) => c.id.startsWith("readme-tests")) && claims.filter((c) => c.id.startsWith("perspective-")).length >= 10, `${claims.length} claims: ${claims.slice(0, 8).map((c) => c.id).join(", ")}…`);
			const sec = securityOf(FIXTURE_TEXTS);
			check("legal:security-checks", sec.length === 10 && sec.every((c) => c.passed), sec.filter((c) => !c.passed).map((c) => c.id).join(", ") || "all pass on the fixture sources");
			check("legal:security-catches", !securityOf({
				...FIXTURE_TEXTS,
				worker: FIXTURE_TEXTS.worker + " const leaked = 'sk_live_abcdefghijklmnop'"
			}).find((c) => c.id === "security:no-live-secret-literal").passed && !securityOf({
				...FIXTURE_TEXTS,
				mcp: "env.QPU_DATA_KEY"
			}).find((c) => c.id === "security:keys-stay-in-the-worker").passed, "a live key literal and a secret in the handler are caught");
			const doors = [
				"compute_forensics",
				"verify_claim",
				"get_rights",
				"get_legal_facts",
				"compute_license",
				"compute_prior_art",
				"get_due_process",
				"audit_security"
			].map((name) => ({
				host: "uuidna.com",
				url: "https://uuidna.com/mcp",
				name,
				description: "",
				takes: [],
				required: [],
				answers: ["verdict"],
				readOnly: true,
				contract: "catalogue"
			}));
			const plan = planOf(claims, { doors }, null, ["clay_sigma"]);
			check("legal:plan-free-by-default", plan.by === "free-by-default" && plan.calls.length === claims.length * 2 + 6 && plan.calls.some((c) => c.door === "get_due_process" && c.arguments.claims.length === claims.length), `${plan.calls.length} calls for ${claims.length} claims through ${plan.agents.length} doors`);
			const override = planOf(claims, { doors }, [
				"audit_security",
				"get_rights",
				"not_a_door"
			], ["clay_sigma"]);
			check("legal:plan-operator-override", override.by === "operator" && override.calls.length === 2 && override.absent.join() === "not_a_door", "the operator's list is used as given; an absent door is named, not guessed");
			const audit = auditOf$1(claims, [...plan.calls.map((c) => c.purpose === "forensics" ? {
				...c,
				answer: {
					verdict: "UNVERIFIED",
					clean: true,
					violations: [],
					receipt: "r",
					note: "no decidable test"
				}
			} : c.purpose === "verify" ? {
				...c,
				answer: {
					verdict: "UNVERIFIED",
					receipt: "r2"
				}
			} : c.door === "get_rights" ? {
				...c,
				answer: {
					holder: `${LICENSE.author} (ceccec@psg.bg)`,
					license: LICENSE.spdx,
					licenseAddress: LICENSE.address,
					imprint: "other-imprint",
					receipt: "r3"
				}
			} : c.door === "audit_security" ? {
				...c,
				answer: {
					checks: 7,
					passed: 7,
					failed: 0,
					receipt: "r4"
				}
			} : c.door === "compute_prior_art" ? {
				...c,
				refusal: "the edge does not hold the whole ledger"
			} : {
				...c,
				answer: { receipt: "r5" }
			})], sec);
			check("legal:audit-read", audit.findings.length === claims.length * 2 && audit.verdicts.UNVERIFIED === claims.length * 2 && audit.violations === 0 && audit.drift.length === 1 && audit.drift[0].startsWith("imprint") && audit.refusals === 1 && audit.securityDoors.find((d) => d.door === "audit_security")?.failed === 0, `${audit.findings.length} findings, drift ${audit.drift.join("; ")}, refusals ${audit.refusals}`);
			check("legal:page", legalPageOf(audit, plan, "2026-01-01").includes("Drift against this tree: imprint"), "the page renders the drift");
			const run = (t) => ctx.handle({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/call",
				params: {
					name: "legal",
					arguments: {
						texts: t,
						answers: []
					}
				}
			}).result.structuredContent;
			const a1 = run(FIXTURE_TEXTS);
			const a2 = run(FIXTURE_TEXTS);
			const a3 = run({
				...FIXTURE_TEXTS,
				readme: FIXTURE_TEXTS.readme + "| Tampered | yes |\n"
			});
			check("legal:tamper-evident", a1.id === a2.id && a1.sha256 === a2.sha256 && a1.id !== a3.id && a1.sha256 !== a3.sha256, "the same inputs give the same address; one changed line changes it");
			return {
				passed: checks.every((c) => c.passed),
				checks
			};
		}
	}
};
// src/quantum/toolboxes/repository.ts
var ownerRepoOf = (remote) => {
	const m = remote ? /github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/.exec(remote) : null;
	return m ? {
		owner: m[1],
		repo: m[2]
	} : null;
};
var watchRequestsOf = (local, contracts = {}) => {
	const or = ownerRepoOf(local.remote);
	const out = [];
	const req = (id, url, purpose) => out.push({
		id,
		url,
		purpose,
		contracted: contractedOf(url, contracts)
	});
	if (or) {
		req("branches", `https://api.github.com/repos/${or.owner}/${or.repo}/branches?per_page=100`, "branches");
		req("tags", `https://api.github.com/repos/${or.owner}/${or.repo}/tags?per_page=100`, "tags");
		req("releases", `https://api.github.com/repos/${or.owner}/${or.repo}/releases?per_page=100`, "releases");
	}
	if (local.conceptDoi) req("zenodo", `https://zenodo.org/api/records?q=conceptdoi:%22${local.conceptDoi}%22&allversions=1&size=25`, "zenodo");
	return out;
};
var parse = (a) => {
	if (!a || a.status !== 200) return null;
	try {
		return JSON.parse(a.text);
	} catch {
		return null;
	}
};
var watchOf = (local, answers) => {
	const or = ownerRepoOf(local.remote);
	const refusals = answers.filter((a) => a.status !== 200).map((a) => `${a.purpose}: HTTP ${a.status || "none"} ${a.text.slice(0, 80)}`);
	const remoteBranches = parse(answers.find((a) => a.purpose === "branches"));
	const remoteTags = parse(answers.find((a) => a.purpose === "tags"));
	const releases = parse(answers.find((a) => a.purpose === "releases"));
	const zen = parse(answers.find((a) => a.purpose === "zenodo"));
	const localBranchNames = local.branches.map((b) => b.name.replace(/^origin\//, ""));
	const rb = remoteBranches?.map((b) => b.name) ?? null;
	const localTagNames = local.tags.map((t) => t.name);
	const rt = remoteTags?.map((t) => t.name) ?? null;
	const mismatch = remoteTags ? local.tags.filter((t) => {
		const r = remoteTags.find((x) => x.name === t.name);
		return r && !r.commit.sha.startsWith(t.commit) && !t.commit.startsWith(r.commit.sha);
	}).map((t) => t.name) : [];
	const versionTag = `v${local.version}`;
	const releaseTags = releases?.filter((r) => !r.draft).map((r) => r.tag_name) ?? null;
	const zenVersions = zen?.hits?.hits?.map((h) => h.metadata?.version ?? "?") ?? null;
	const leads = [];
	const lead = (id, statement, reason) => leads.push({
		id,
		source: local.remote ?? "git",
		statement,
		status: "open",
		reason
	});
	if (rb) for (const b of localBranchNames.filter((n) => !rb.includes(n) && n !== "HEAD")) lead(`branch-only-local-${b.replace(/[^a-z0-9]+/gi, "-")}`, `branch ${b} exists here and not at ${or?.owner}/${or?.repo}`, local.branches.find((x) => x.name === b)?.upstream ? "its upstream is gone: delete it or push it" : "unpushed work, or a local experiment: push it, or record why it stays local");
	if (rb) for (const b of rb.filter((n) => !localBranchNames.includes(n))) lead(`branch-only-remote-${b.replace(/[^a-z0-9]+/gi, "-")}`, `branch ${b} exists at the remote and not here`, "fetch it, or it is another workspace's");
	if (rt) for (const t of localTagNames.filter((n) => !rt.includes(n))) lead(`tag-only-local-${t.replace(/[^a-z0-9]+/gi, "-")}`, `tag ${t} exists here and not at the remote`, "a tag that is not pushed is not a release: push it or delete it");
	if (rt) for (const t of rt.filter((n) => !localTagNames.includes(n))) lead(`tag-only-remote-${t.replace(/[^a-z0-9]+/gi, "-")}`, `tag ${t} exists at the remote and not here`, "fetch tags");
	for (const t of mismatch) lead(`tag-moved-${t.replace(/[^a-z0-9]+/gi, "-")}`, `tag ${t} points at different commits here and at the remote`, "a moved tag is a rewritten release: the two commits are the evidence");
	if (releaseTags) for (const r of releaseTags.filter((t) => rt && !rt.includes(t))) lead(`release-without-tag-${r.replace(/[^a-z0-9]+/gi, "-")}`, `release ${r} has no tag at the remote`, "a release names a tag that is gone");
	if (!localTagNames.includes(versionTag)) lead(`version-without-tag-${versionTag}`, `package.json says ${local.version} and no tag ${versionTag} exists here`, "the version is the single source: tag it when it ships, or it is unreleased work in progress");
	if (releaseTags && !releaseTags.includes(versionTag)) lead(`version-without-release-${versionTag}`, `no GitHub release for ${versionTag}`, "the release is the author's act; the Zenodo webhook archives it");
	if (zenVersions && releaseTags) for (const v of zenVersions.filter((v) => !releaseTags.includes(v) && !releaseTags.includes(`v${v}`))) lead(`zenodo-without-release-${v.replace(/[^a-z0-9]+/gi, "-")}`, `Zenodo holds version ${v} and GitHub has no release for it`, "a Zenodo version without its release: the orphan lineage, or a manual upload");
	if (local.worktrees.length > 1) for (const w of local.worktrees.slice(1)) lead(`workspace-${w.path.split("/").pop()}`, `workspace ${w.path} at ${w.head.slice(0, 8)} on ${w.branch ?? "detached HEAD"}`, "a second workspace holds work the main one does not see; merge or record it");
	return {
		remote: local.remote,
		owner: or?.owner ?? null,
		repo: or?.repo ?? null,
		head: local.head,
		branch: local.branch,
		version: local.version,
		worktrees: local.worktrees.length,
		branches: {
			local: localBranchNames.length,
			remote: rb?.length ?? null,
			onlyLocal: rb ? localBranchNames.filter((n) => !rb.includes(n)) : [],
			onlyRemote: rb ? rb.filter((n) => !localBranchNames.includes(n)) : [],
			agree: rb ? localBranchNames.filter((n) => rb.includes(n)) : []
		},
		tags: {
			local: localTagNames.length,
			remote: rt?.length ?? null,
			onlyLocal: rt ? localTagNames.filter((n) => !rt.includes(n)) : [],
			onlyRemote: rt ? rt.filter((n) => !localTagNames.includes(n)) : [],
			agree: rt ? localTagNames.filter((n) => rt.includes(n) && !mismatch.includes(n)) : [],
			mismatch
		},
		releases: {
			count: releaseTags?.length ?? null,
			latest: releaseTags?.[0] ?? null,
			withoutTag: releaseTags && rt ? releaseTags.filter((t) => !rt.includes(t)) : [],
			versionHasTag: localTagNames.includes(versionTag),
			versionHasRelease: releaseTags ? releaseTags.includes(versionTag) : null
		},
		zenodo: {
			versions: zenVersions?.length ?? null,
			latest: zenVersions?.[0] ?? null,
			withoutRelease: zenVersions && releaseTags ? zenVersions.filter((v) => !releaseTags.includes(v) && !releaseTags.includes(`v${v}`)) : []
		},
		leads,
		refusals
	};
};
var watchPageOf = (w, date) => [
	"---",
	"title: Repository",
	"order: 57",
	"---",
	"",
	"# Workspaces, branches, tags and releases, watched",
	"",
	`Gathered here and verified online on ${date} by \`npm run next\` through the \`repository\` tool: ${w.owner ? `${w.owner}/${w.repo}` : "no GitHub remote"}, HEAD ${w.head.slice(0, 8)} on ${w.branch}, package version ${w.version}, ${w.worktrees} workspace(s).`,
	"",
	"| Kind | Here | Remote | Agree | Only here | Only remote |",
	"|---|---:|---:|---:|---|---|",
	`| branches | ${w.branches.local} | ${w.branches.remote ?? "not reached"} | ${w.branches.agree.length} | ${w.branches.onlyLocal.join(", ") || "—"} | ${w.branches.onlyRemote.join(", ") || "—"} |`,
	`| tags | ${w.tags.local} | ${w.tags.remote ?? "not reached"} | ${w.tags.agree.length} | ${w.tags.onlyLocal.join(", ") || "—"} | ${w.tags.onlyRemote.join(", ") || "—"} |`,
	"",
	`Releases: ${w.releases.count ?? "not reached"}, latest ${w.releases.latest ?? "—"}; version tag ${w.releases.versionHasTag ? "present" : "absent"}, release ${w.releases.versionHasRelease === null ? "unknown" : w.releases.versionHasRelease ? "present" : "absent"}. Zenodo: ${w.zenodo.versions ?? "not reached"} version(s), latest ${w.zenodo.latest ?? "—"}${w.zenodo.withoutRelease.length ? `, without a release: ${w.zenodo.withoutRelease.join(", ")}` : ""}. ${w.tags.mismatch.length ? `Tags moved: ${w.tags.mismatch.join(", ")}.` : ""}`,
	"",
	"## Leads",
	"",
	...w.leads.length ? w.leads.map((l) => `- \`${l.id}\`: ${l.statement} — ${l.reason}`) : ["none: here and the remote agree"],
	"",
	...w.refusals.length ? [
		"## Refused",
		"",
		...w.refusals.map((r) => `- ${r}`),
		""
	] : []
].join("\n");
var repository = toolOf("repository", {
	name: "repository",
	description: "Workspaces, branches, tags and releases watched and verified online, pure. Phase one (local): the requests to GitHub (branches, tags, releases) and Zenodo (every version of the concept DOI), each checked against the contract discovery found. Phase two (plus answers): agreement and leads — a branch or tag only here or only there, a moved tag, a release without its tag, a version without a tag or release, a Zenodo version without a release, a second workspace. The client runs git and fetches; nothing here does.",
	inputSchema: {
		type: "object",
		properties: {
			local: {
				type: "object",
				description: "{ remote, head, branch, version, worktrees, branches, tags, conceptDoi }"
			},
			contracts: { type: "object" },
			answers: {
				type: "array",
				items: { type: "object" }
			},
			selftest: { type: "boolean" }
		}
	},
	run: (args, ctx) => {
		if (args.selftest) return {
			selftest: true,
			...REPOSITORY.skill.selftest(ctx)
		};
		const local = args.local;
		if (!local) throw new Error("repository needs local: the facts the client gathered with git");
		if (!Array.isArray(args.answers)) {
			const requests = watchRequestsOf(local, args.contracts ?? {});
			return {
				phase: "requests",
				requests: requests.length,
				requestList: requests
			};
		}
		const w = watchOf(local, args.answers);
		return {
			phase: "watch",
			branches: w.branches.local,
			tags: w.tags.local,
			releases: w.releases.count ?? -1,
			leads: w.leads.length,
			refusals: w.refusals.length,
			watch: w,
			page: watchPageOf(w, (/* @__PURE__ */ new Date()).toISOString())
		};
	},
	widget: flowWidget
});
var LOCAL = {
	remote: "https://github.com/uuidna/qpu.git",
	head: "abcdef1234567890",
	branch: "rebuild/phase-1",
	version: "1.4.0",
	worktrees: [{
		path: "/w/qpu",
		head: "abcdef12",
		branch: "rebuild/phase-1"
	}, {
		path: "/w/qpu-2",
		head: "1234abcd",
		branch: null
	}],
	branches: [
		{
			name: "main",
			upstream: "origin/main",
			head: "1111"
		},
		{
			name: "rebuild/phase-1",
			upstream: null,
			head: "abcdef12"
		},
		{
			name: "orphan/v1.1.1-audit",
			upstream: null,
			head: "2222"
		}
	],
	tags: [
		{
			name: "v1.3.2",
			commit: "3333"
		},
		{
			name: "v1.4.0",
			commit: "4444"
		},
		{
			name: "waves-complete",
			commit: "5555"
		}
	],
	conceptDoi: "10.5281/zenodo.22700098"
};
var ANSWERS = [
	{
		id: "branches",
		url: "https://api.github.com/repos/uuidna/qpu/branches?per_page=100",
		purpose: "branches",
		contracted: "yes",
		status: 200,
		text: JSON.stringify([{
			name: "main",
			commit: { sha: "1111" }
		}, {
			name: "clean",
			commit: { sha: "9999" }
		}])
	},
	{
		id: "tags",
		url: "https://api.github.com/repos/uuidna/qpu/tags?per_page=100",
		purpose: "tags",
		contracted: "yes",
		status: 200,
		text: JSON.stringify([
			{
				name: "v1.3.2",
				commit: { sha: "3333aaaa" }
			},
			{
				name: "v1.4.0",
				commit: { sha: "ffff" }
			},
			{
				name: "v1.0.1",
				commit: { sha: "0101" }
			}
		])
	},
	{
		id: "releases",
		url: "https://api.github.com/repos/uuidna/qpu/releases?per_page=100",
		purpose: "releases",
		contracted: "yes",
		status: 200,
		text: JSON.stringify([
			{
				tag_name: "v1.3.2",
				name: "v1.3.2",
				draft: false,
				prerelease: false,
				published_at: "2026-10-01"
			},
			{
				tag_name: "v1.0.1",
				name: "v1.0.1",
				draft: false,
				prerelease: false,
				published_at: "2026-09-01"
			},
			{
				tag_name: "v0.9.0",
				name: "v0.9.0",
				draft: false,
				prerelease: false,
				published_at: "2026-08-01"
			}
		])
	},
	{
		id: "zenodo",
		url: "https://zenodo.org/api/records?q=x",
		purpose: "zenodo",
		contracted: "unknown",
		status: 200,
		text: JSON.stringify({ hits: { hits: [{ metadata: { version: "v1.3.2" } }, { metadata: { version: "1.1.1" } }] } })
	}
];
var REPOSITORY = {
	name: "repository",
	idea: "the repository watched: every workspace, branch, tag and release here compared with the remote and the archive online, every disagreement a lead",
	tools: [repository],
	examples: [{
		id: "repository-watch",
		tool: "repository",
		arguments: {
			local: LOCAL,
			answers: ANSWERS
		},
		shows: "Fixture facts against fixture answers: two local branches unpushed, one remote branch not here, a local tag not pushed, a remote tag not fetched, a moved tag, a release whose tag is gone, a version with a tag and no release, a Zenodo version without a release, a second workspace: ten leads.",
		expect: (s) => s.phase === "watch" && s.leads === 10 && s.watch.tags.mismatch.join() === "v1.4.0" && s.watch.releases.withoutTag.join() === "v0.9.0" && s.watch.zenodo.withoutRelease.join() === "1.1.1" ? null : `${s.phase} ${s.leads} leads: ${s.watch?.leads.map((l) => l.id).join(", ")}`
	}],
	skill: {
		instructions: "The client gathers with git: the remote url, HEAD, the branch, package.json's version, worktree list, every branch with its upstream and head, every tag with its commit, and the concept DOI from .zenodo.json's related identifiers; calls repository for the requests; fetches them (GitHub needs no token for public reads); calls again with the answers; writes repository.json and the page; its leads join the next-leads docket. Offline, the local facts alone are written.",
		directions: [
			"server only: fixture facts against fixture answers give every kind of lead once",
			"client → server: git facts in, GitHub and Zenodo bodies in",
			"toolbox → toolbox: requests checked against the contracts discovery found; leads feed readiness"
		],
		selftest: () => {
			const checks = [];
			const check = (id, passed, evidence) => checks.push({
				id,
				passed,
				evidence
			});
			const reqs = watchRequestsOf(LOCAL, { "api.github.com": [
				"/repos/{owner}/{repo}/branches",
				"/repos/{owner}/{repo}/tags",
				"/repos/{owner}/{repo}/releases"
			] });
			check("repository:requests", reqs.length === 4 && reqs.filter((r) => r.contracted === "yes").length === 3 && reqs[3].purpose === "zenodo", `${reqs.length} requests, ${reqs.filter((r) => r.contracted === "yes").length} inside GitHub's contract`);
			check("repository:no-remote", watchRequestsOf({
				...LOCAL,
				remote: null,
				conceptDoi: null
			}).length === 0 && ownerRepoOf("git@github.com:uuidna/qpu.git")?.repo === "qpu", "no remote, no requests; an ssh remote parses");
			const w = watchOf(LOCAL, ANSWERS);
			const ids = w.leads.map((l) => l.id);
			check("repository:leads", ids.includes("branch-only-local-rebuild-phase-1") && ids.includes("branch-only-remote-clean") && ids.includes("tag-only-local-waves-complete") && ids.includes("tag-only-remote-v1-0-1") && ids.includes("tag-moved-v1-4-0") && ids.includes("release-without-tag-v0-9-0") && ids.includes("version-without-release-v1.4.0") && ids.includes("zenodo-without-release-1-1-1") && ids.includes("workspace-qpu-2") && !ids.some((i) => i.startsWith("version-without-tag")), ids.join(", "));
			const offline = watchOf(LOCAL, []);
			check("repository:offline", offline.branches.remote === null && offline.leads.length === 1 && offline.leads[0].id === "workspace-qpu-2" && offline.refusals.length === 0, "without answers only the local facts speak: the second workspace");
			const refused = watchOf(LOCAL, [{
				...ANSWERS[0],
				status: 403,
				text: "rate limited"
			}]);
			check("repository:refusal", refused.refusals.length === 1 && refused.branches.remote === null, "a refused request is recorded, never read as agreement");
			check("repository:page", watchPageOf(w, "2026-01-01").includes("| tags | 3 | 3 | 1 | waves-complete | v1.0.1 |"), "the page renders the tags row");
			return {
				passed: checks.every((c) => c.passed),
				checks
			};
		}
	}
};
// src/quantum/toolboxes/standards.ts
var jsonld = toolOf("standards", {
	name: "jsonld",
	description: "schema.org JSON-LD, pure: for a block (tool, id, description), a page (url, title, description, uuid?) or an offer of the catalogue (product, variant, currency). The author a Person with an ORCID, the licence a URL, dates ISO 8601, languages ISO 639-1, currencies ISO 4217. Every tools/call result already carries its block's JSON-LD in _meta.jsonLd; every documentation page carries its own in its head.",
	inputSchema: {
		type: "object",
		properties: {
			kind: {
				type: "string",
				enum: [
					"block",
					"page",
					"offer",
					"catalogue"
				]
			},
			tool: { type: "string" },
			id: { type: "string" },
			description: { type: "string" },
			url: { type: "string" },
			title: { type: "string" },
			uuid: { type: "string" },
			locale: {
				type: "string",
				enum: Object.keys(LOCALES)
			},
			product: { type: "string" },
			variant: { type: "string" },
			currency: { type: "string" },
			selftest: { type: "boolean" }
		}
	},
	run: (args, ctx) => {
		if (args.selftest) return {
			selftest: true,
			...STANDARDS_BOX.skill.selftest(ctx)
		};
		const kind = String(args.kind ?? "block");
		if (kind === "block") return {
			kind,
			jsonLd: blockJsonLdOf({
				tool: String(args.tool ?? "qpu"),
				id: String(args.id ?? ""),
				description: String(args.description ?? ""),
				url: typeof args.url === "string" ? args.url : void 0,
				locale: typeof args.locale === "string" ? args.locale : void 0
			})
		};
		if (kind === "page") return {
			kind,
			jsonLd: pageJsonLdOf({
				url: String(args.url ?? "https://qpu.uuidna.com/"),
				title: String(args.title ?? "@uuidna/qpu"),
				description: String(args.description ?? ""),
				uuid: typeof args.uuid === "string" ? args.uuid : void 0,
				locale: typeof args.locale === "string" ? args.locale : void 0
			})
		};
		const currency = String(args.currency ?? "eur");
		const offers = CATALOGUE.filter((v) => (kind === "offer" ? v.product === args.product && v.variant === args.variant : true) && currency in v.amounts).map((v) => offerJsonLdOf({
			product: v.product,
			variant: v.variant,
			unit: v.unit,
			interval: v.interval,
			currency,
			amount: v.amounts[currency],
			description: v.description
		}));
		if (kind === "offer" && !offers.length) throw new Error(`no variant ${String(args.product)} ${String(args.variant)} in ${currency}`);
		return {
			kind,
			offers: offers.length,
			jsonLd: kind === "offer" ? offers[0] : {
				"@context": "https://schema.org",
				"@type": "OfferCatalog",
				name: "QPU licences",
				itemListElement: offers
			}
		};
	},
	widget: flowWidget
});
var codes = toolOf("standards", {
	name: "codes",
	description: "The tree's ISO codes validated against the CLDR lists a client fetched (languages ISO 639, currencies ISO 4217, territories ISO 3166-1): every locale of the language toolbox, every currency of the catalogue, the tenants' countries. Without the lists: what would be checked and where the lists are. A code the standard does not know is a lead, never a guess.",
	inputSchema: {
		type: "object",
		properties: {
			cldr: {
				type: "object",
				description: "{ languages, currencies, territories }: the CLDR JSON documents as fetched"
			},
			territories: {
				type: "array",
				items: { type: "string" }
			},
			selftest: { type: "boolean" }
		}
	},
	run: (args, ctx) => {
		if (args.selftest) return {
			selftest: true,
			...STANDARDS_BOX.skill.selftest(ctx)
		};
		const mine = {
			locales: Object.keys(LOCALES),
			currencies: [...new Set(CATALOGUE.flatMap((v) => Object.keys(v.amounts)))],
			territories: Array.isArray(args.territories) ? args.territories.map(String) : ["BG", "US"]
		};
		if (!args.cldr) return {
			phase: "plan",
			locales: mine.locales.length,
			currencies: mine.currencies.length,
			territories: mine.territories.length,
			standards: STANDARDS.filter((s) => s.kind === "codes").map((s) => ({
				id: s.id,
				contract: s.contract
			})),
			mine
		};
		const v = validateOf(codesOf(args.cldr), mine);
		return {
			phase: "validated",
			languagesValidCount: v.languagesValid.length,
			languagesUnknownCount: v.languagesUnknown.length,
			currenciesValidCount: v.currenciesValid.length,
			currenciesUnknownCount: v.currenciesUnknown.length,
			territoriesValidCount: v.territoriesValid.length,
			territoriesUnknownCount: v.territoriesUnknown.length,
			...v,
			leads: [...v.languagesUnknown.map((c) => ({
				id: `code-language-${c}`,
				statement: `locale ${c} is not an ISO 639 code CLDR names`,
				status: "open",
				reason: "rename the locale to its code, or it is a dialect to tag under its language"
			})), ...v.currenciesUnknown.map((c) => ({
				id: `code-currency-${c}`,
				statement: `currency ${c} is not an ISO 4217 code CLDR names`,
				status: "open",
				reason: "the catalogue prices in codes the standard names"
			}))]
		};
	},
	widget: flowWidget
});
var CLDR_FIXTURE = {
	languages: { main: { en: { localeDisplayNames: { languages: {
		en: "English",
		bg: "Bulgarian",
		de: "German",
		fr: "French",
		es: "Spanish",
		it: "Italian",
		ru: "Russian",
		zh: "Chinese",
		ja: "Japanese",
		pt: "Portuguese",
		nl: "Dutch"
	} } } } },
	currencies: { main: { en: { numbers: { currencies: {
		EUR: {},
		USD: {},
		BGN: {}
	} } } } },
	territories: { main: { en: { localeDisplayNames: { territories: {
		BG: "Bulgaria",
		US: "United States"
	} } } } }
};
var STANDARDS_BOX = {
	name: "standards",
	idea: "the standards fused: schema.org on every block, page and offer; ISO 8601, 639-1, 4217 and 3166-1 in every date, language, price and country, validated against the CLDR lists discovery reads as contracts",
	tools: [jsonld, codes],
	examples: [
		{
			id: "jsonld-block",
			tool: "jsonld",
			arguments: {
				kind: "block",
				tool: "clay",
				id: "941ef62e-d97b-2438-bfc8-22ae9e5da781",
				description: "The Clay register recomputed"
			},
			shows: "A block as schema.org JSON-LD: a CreativeWork of the SoftwareApplication, the author a Person with an ORCID, the licence a URL, the date ISO 8601.",
			expect: (s) => s.jsonLd["@type"] === "CreativeWork" && s.jsonLd.author?.["@id"]?.includes("orcid.org") && s.jsonLd.license === "https://uuidna.com/license" && /^\d{4}-\d{2}-\d{2}T/.test(s.jsonLd.dateModified) ? null : JSON.stringify(s.jsonLd).slice(0, 160)
		},
		{
			id: "jsonld-catalogue",
			tool: "jsonld",
			arguments: {
				kind: "catalogue",
				currency: "eur"
			},
			shows: "The whole catalogue as an OfferCatalog of Offers priced in ISO 4217 EUR, each a UnitPriceSpecification by month or year where recurring.",
			expect: (s) => s.offers === 7 && s.jsonLd["@type"] === "OfferCatalog" && s.jsonLd.itemListElement.every((o) => o.priceCurrency === "EUR") ? null : `${s.offers} offers`
		},
		{
			id: "codes-plan",
			tool: "codes",
			arguments: {},
			shows: "What the codes tool would validate and where the CLDR lists are: eleven locales, three currencies, the tenants' countries.",
			expect: (s) => s.phase === "plan" && s.locales === 11 && s.currencies === 3 && s.standards.length === 3 ? null : `${s.phase} ${s.locales} ${s.currencies}`
		}
	],
	skill: {
		instructions: "jsonld needs no fetch. codes: the client fetches the three CLDR documents the plan names (GET, free, no credential) and calls codes with them; a code the standard does not know is a lead. The discover step reads schema.org's vocabulary and the CLDR lists as contracts; every tools/call result carries _meta.jsonLd and every documentation page a JSON-LD script.",
		directions: [
			"server only: JSON-LD shapes on fixtures; CLDR fixtures read into code sets; the tree's codes validated",
			"client → server: the CLDR lists come from Unicode's repository",
			"toolbox → toolbox: offers come from the billing catalogue, locales from the language toolbox, the contracts from discovery"
		],
		selftest: () => {
			const checks = [];
			const check = (id, passed, evidence) => checks.push({
				id,
				passed,
				evidence
			});
			const b = blockJsonLdOf({
				tool: "clay",
				id: "x",
				description: "d",
				date: "2026-01-01T00:00:00.000Z"
			});
			check("standards:block", b["@type"] === "CreativeWork" && b.author["@id"] === "https://orcid.org/0009-0000-7312-9778" && b.dateModified === "2026-01-01T00:00:00.000Z" && b.inLanguage === "en", "CreativeWork with ORCID author, ISO 8601 date, ISO 639-1 language");
			const p = pageJsonLdOf({
				url: "https://qpu.uuidna.com/u/abc",
				title: "t",
				description: "d",
				uuid: "abc",
				locale: "bg"
			});
			check("standards:page", p["@type"] === "WebPage" && p.identifier === "abc" && p.inLanguage === "bg" && p.isPartOf.url === "https://qpu.uuidna.com", "WebPage with identifier and locale");
			const o = offerJsonLdOf({
				product: "qpu-domain",
				variant: "yearly",
				unit: "domain",
				interval: "year",
				currency: "bgn",
				amount: 84500,
				description: "d"
			});
			check("standards:offer", o.priceCurrency === "BGN" && o.price === "845.00" && o.priceSpecification.unitCode === "ANN", "Offer in ISO 4217 with a yearly UnitPriceSpecification");
			const v = validateOf(codesOf(CLDR_FIXTURE), {
				locales: Object.keys(LOCALES),
				currencies: [
					"eur",
					"usd",
					"bgn"
				],
				territories: [
					"BG",
					"US",
					"XX"
				]
			});
			check("standards:codes", v.measured && v.languagesUnknown.length === 0 && v.currenciesUnknown.length === 0 && v.territoriesUnknown.join() === "XX", `locales ${v.languagesValid.length} valid, currencies ${v.currenciesValid.length} valid, territory XX unknown`);
			const none = validateOf(codesOf({}), {
				locales: ["en"],
				currencies: ["eur"]
			});
			check("standards:unmeasured", !none.measured && none.languagesUnknown.length === 0, "without the lists nothing is called unknown");
			check("standards:detect", detectStandard(JSON.stringify({
				"@context": "x",
				"@graph": [1, 2]
			}))?.detected === "json-ld vocabulary" && detectStandard(JSON.stringify(CLDR_FIXTURE.languages))?.detected === "cldr json" && detectStandard("<html>") === null, "the vocabulary and a CLDR list are told apart");
			return {
				passed: checks.every((c) => c.passed),
				checks
			};
		}
	}
};
// src/quantum/toolboxes/extension.ts
var hostOf = (url) => {
	try {
		return new URL(url).host;
	} catch {
		return url;
	}
};
/** The tools of a host's answer: a tools/list result, its envelope, or the raw text the host answered (JSON or event stream). */
var toolsOfAnswer = (answer) => {
	if (Array.isArray(answer)) return answer;
	if (typeof answer === "string") try {
		return toolsOfAnswer(JSON.parse(dataOf(answer)));
	} catch {
		return [];
	}
	if (answer && typeof answer === "object") {
		const o = answer;
		return o.tools ?? o.result?.tools ?? [];
	}
	return [];
};
/** A foreign door read back: the structured content, the text, or the error the host answered. */
var answerOf = (text) => {
	try {
		const j = JSON.parse(dataOf(text));
		if (j.error) return {
			ok: false,
			error: j.error.message
		};
		if (j.result?.isError) return {
			ok: false,
			error: j.result.content?.[0]?.text ?? "refused"
		};
		if (j.result?.structuredContent !== void 0) return {
			ok: true,
			result: j.result.structuredContent
		};
		const t = j.result?.content?.[0]?.text;
		if (t !== void 0) try {
			return {
				ok: true,
				result: JSON.parse(t)
			};
		} catch {
			return {
				ok: true,
				result: t
			};
		}
		return {
			ok: true,
			result: j.result
		};
	} catch (e) {
		const data = dataOf(text);
		return {
			ok: false,
			error: `not JSON (${e.message.slice(0, 60)}; stream ${/^(event|data):/m.test(text)}; data ${JSON.stringify(data.slice(0, 40))}): ${text.slice(0, 80)}`
		};
	}
};
var mine = (ctx) => ctx.handle({
	jsonrpc: "2.0",
	id: 1,
	method: "tools/list"
}).result.tools;
/** Inward: the host's tools as doors of this catalogue, each named host:tool. */
var inwardOf = (host, tools) => tools.map((t) => ({
	...doorOf(t, "tools/list"),
	host: hostOf(host),
	url: host,
	as: `${hostOf(host)}:${t.name}`
}));
/** Outward: this catalogue as the registration any MCP client mounts. */
var outwardOf = (ctx, at) => {
	const tools = mine(ctx);
	return {
		tools,
		mcpServers: { qpu: {
			url: at,
			transport: "http",
			tools: tools.length,
			toolboxes: [...new Set(tools.map((t) => t._meta?.toolbox ?? "none"))]
		} },
		note: "any MCP client that mounts this url receives these tools from tools/list, each result with its block, theme, JSON-LD and Payload document in _meta; the unit and every other host are extended the same way inward"
	};
};
var extend = toolOf("extension", {
	name: "extend",
	description: "QPU as the natural extension of every MCP and every MCP of QPU. Inward (host, tools): the host's tools/list read into doors that join this catalogue as host:tool, with what each takes and answers; without tools, the one request the client makes for them (a tenant's token travels in the request, never here). Outward: this catalogue as the registration any MCP client mounts. call (host, tool, arguments): the request that serves a foreign door; with answer, what it answered, read whether JSON or an event stream. Pure; the client fetches. Cloudflare's eight servers are extended by default, the documentation one in the open.",
	inputSchema: {
		type: "object",
		properties: {
			direction: {
				type: "string",
				enum: [
					"in",
					"out",
					"both"
				],
				description: "default both"
			},
			host: {
				type: "string",
				description: "the MCP endpoint; default this tree's own"
			},
			tools: { description: "the host's tools/list answer: its tools array, its JSON-RPC envelope, or the raw text (JSON or event stream)" },
			call: {
				type: "object",
				properties: {
					tool: { type: "string" },
					arguments: { type: "object" }
				},
				description: "a foreign door to serve: the request is emitted"
			},
			answer: {
				type: "string",
				description: "what the host answered the call: read back"
			},
			selftest: { type: "boolean" }
		}
	},
	run: (args, ctx) => {
		if (args.selftest) return {
			selftest: true,
			...EXTENSION.skill.selftest(ctx)
		};
		const host = typeof args.host === "string" ? args.host : "https://qpu.uuidna.com/mcp";
		const direction = String(args.direction ?? "both");
		if (args.call && typeof args.call === "object") {
			const c = args.call;
			if (!c.tool) throw new Error("call.tool names the foreign door");
			const request = {
				method: "POST",
				url: host,
				accept: "application/json, text/event-stream",
				body: rpcBody("tools/call", {
					name: c.tool,
					arguments: c.arguments ?? {}
				})
			};
			if (typeof args.answer !== "string") return {
				phase: "request",
				host: hostOf(host),
				door: `${hostOf(host)}:${c.tool}`,
				request,
				note: "the client fetches this request with the tenant's token if the host asks for one and calls again with the answer"
			};
			const read = answerOf(args.answer);
			return {
				phase: "served",
				host: hostOf(host),
				door: `${hostOf(host)}:${c.tool}`,
				request,
				ok: read.ok,
				result: read.result,
				error: read.error
			};
		}
		const out = {
			host: hostOf(host),
			direction,
			defaults: DEFAULT_MCP_HOSTS,
			cloudflare: CLOUDFLARE_MCP
		};
		if (direction !== "out") {
			if (args.tools === void 0) return {
				...out,
				phase: "requests",
				requests: 1,
				requestList: [{
					id: `extend:${hostOf(host)}`,
					method: "POST",
					url: host,
					accept: "application/json, text/event-stream",
					body: rpcBody("tools/list")
				}],
				note: "the client fetches the host's tools/list (with the tenant's token where the host asks for one) and calls again with tools"
			};
			const doors = inwardOf(host, toolsOfAnswer(args.tools));
			const own = mine(ctx);
			Object.assign(out, {
				phase: "extended",
				inward: doors.length,
				doors,
				catalogue: own.length + doors.length,
				mineCount: own.length,
				foreignByAnswer: Object.fromEntries([...new Set(doors.flatMap((d) => d.answers))].map((a) => [a, doors.filter((d) => d.answers.includes(a)).map((d) => d.as)]))
			});
		}
		if (direction !== "in") Object.assign(out, { outward: outwardOf(ctx, host) });
		if (!("phase" in out)) out.phase = "registration";
		return out;
	},
	widget: flowWidget
});
var DOCS_FIXTURE = [{
	name: "search_cloudflare_documentation",
	description: "Search the Cloudflare documentation.",
	inputSchema: {
		type: "object",
		properties: { query: {
			type: "string",
			description: "the search query"
		} },
		required: ["query"]
	}
}];
var STREAM_FIXTURE = "event: message\ndata: {\"jsonrpc\":\"2.0\",\"id\":1,\"result\":{\"content\":[{\"type\":\"text\",\"text\":\"<result><url>https://developers.cloudflare.com/workers/</url></result>\"}]}}\n\n";
var EXTENSION = {
	name: "extension",
	idea: "QPU the natural extension of every MCP and every MCP of QPU: a host's tools read into doors of this catalogue by the same reading discovery uses, a foreign door served by one request the client fetches, and this catalogue expressed as the registration any MCP client mounts; tenant configurable through the hosts and tokens a tenant names",
	tools: [extend],
	examples: [
		{
			id: "extend-out",
			tool: "extend",
			arguments: { direction: "out" },
			shows: "This catalogue as the registration any MCP client mounts: every tool as tools/list serves it, grouped by toolbox, at this tree's own endpoint.",
			expect: (s) => s.phase === "registration" && s.outward.tools.length >= 36 && s.outward.mcpServers.qpu.url === "https://qpu.uuidna.com/mcp" && s.outward.mcpServers.qpu.toolboxes.includes("extension") ? null : `${s.phase} ${s.outward?.tools?.length}`
		},
		{
			id: "extend-in-request",
			tool: "extend",
			arguments: {
				direction: "in",
				host: "https://docs.mcp.cloudflare.com/mcp"
			},
			shows: "Without the host's tools: the one tools/list request the client makes of Cloudflare's documentation server (no token needed there).",
			expect: (s) => s.phase === "requests" && s.requestList[0].method === "POST" && s.requestList[0].body.method === "tools/list" && s.cloudflare.length === 8 ? null : s.phase
		},
		{
			id: "extend-in-docs",
			tool: "extend",
			arguments: {
				direction: "in",
				host: "https://docs.mcp.cloudflare.com/mcp",
				tools: DOCS_FIXTURE
			},
			shows: "Cloudflare's documentation server read into this catalogue: one door, docs.mcp.cloudflare.com:search_cloudflare_documentation, taking a query.",
			expect: (s) => s.phase === "extended" && s.inward === 1 && s.doors[0].as === "docs.mcp.cloudflare.com:search_cloudflare_documentation" && s.doors[0].takes.includes("query") && s.catalogue === s.mineCount + 1 ? null : JSON.stringify(s.doors?.[0]).slice(0, 120)
		},
		{
			id: "extend-call-served",
			tool: "extend",
			arguments: {
				host: "https://docs.mcp.cloudflare.com/mcp",
				call: {
					tool: "search_cloudflare_documentation",
					arguments: { query: "workers assets" }
				},
				answer: STREAM_FIXTURE
			},
			shows: "A foreign door served and its event-stream answer read back into the text the host returned.",
			expect: (s) => s.phase === "served" && s.ok && String(s.result).includes("developers.cloudflare.com/workers") && s.request.body.params.name === "search_cloudflare_documentation" ? null : `${s.phase} ${s.ok} ${s.error ?? ""}`
		}
	],
	skill: {
		instructions: "Inward: call extend with a host (direction in); fetch the one request it emits, adding the tenant's bearer token where the host asks for one (QPU_MCP_TOKEN_<HOST>); call again with tools and the host's doors join the catalogue as host:tool. Serve one: extend with call { tool, arguments }; fetch the request; call again with answer. Outward: extend with direction out gives the registration (mcpServers fragment) any MCP client mounts. The discover tool extends the default hosts (the unit, this tree, Cloudflare's eight servers) on every run; a tenant names its own hosts with QPU_MCP_HOSTS[_<TENANT>].",
		directions: [
			"server only: a fixture tools/list read into doors; an event-stream answer read back; the registration from this catalogue",
			"client → server: the client fetches tools/list and tools/call of the foreign host, token in the request, never in the tool",
			"server → client: every answer the host gives is read the same way discovery reads it (JSON or event stream, error, refusal)",
			"toolbox → toolbox: the door reading is discovery's own (doorOf); the matcher never calls a foreign door to serve a statement; QPU extended by itself is the identity"
		],
		selftest: (ctx) => {
			const checks = [];
			const check = (id, passed, evidence) => checks.push({
				id,
				passed,
				evidence
			});
			const run = (args) => ctx.handle({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/call",
				params: {
					name: "extend",
					arguments: args
				}
			}).result.structuredContent;
			const inward = run({
				direction: "in",
				host: "https://docs.mcp.cloudflare.com/mcp",
				tools: DOCS_FIXTURE
			});
			check("extension:inward", inward.phase === "extended" && inward.inward === 1 && inward.doors[0].takes.join() === "query" && inward.doors[0].required.join() === "query", `${inward.inward} door, takes ${inward.doors?.[0]?.takes}`);
			const stream = run({
				direction: "in",
				host: "https://docs.mcp.cloudflare.com/mcp",
				tools: "event: message\ndata: " + JSON.stringify({
					jsonrpc: "2.0",
					id: 1,
					result: { tools: DOCS_FIXTURE }
				}) + "\n\n"
			});
			check("extension:stream-list", stream.inward === 1 && stream.doors[0].as === inward.doors[0].as, "tools/list read from an event stream equals the array");
			const out = run({ direction: "out" });
			const own = mine(ctx);
			check("extension:outward", out.outward.tools.length === own.length && own.every((t) => t.inputSchema), `${out.outward.tools.length} tools in the registration, every one with a schema`);
			const self = run({
				direction: "in",
				host: "https://qpu.uuidna.com/mcp",
				tools: out.outward.tools
			});
			check("extension:identity", self.inward === own.length && self.doors.every((d) => own.some((t) => `qpu.uuidna.com:${t.name}` === d.as)), "QPU extended by its own registration is the identity on the catalogue");
			const served = run({
				host: "https://docs.mcp.cloudflare.com/mcp",
				call: {
					tool: "search_cloudflare_documentation",
					arguments: { query: "q" }
				},
				answer: STREAM_FIXTURE
			});
			check("extension:served", served.ok && String(served.result).includes("developers.cloudflare.com"), "an event-stream answer read back");
			const refused = run({
				host: "https://x/mcp",
				call: { tool: "t" },
				answer: JSON.stringify({
					jsonrpc: "2.0",
					id: 1,
					error: {
						code: -32601,
						message: "unknown tool"
					}
				})
			});
			check("extension:refusal", !refused.ok && refused.error === "unknown tool", "a host's error is the error, not a result");
			const request = run({
				direction: "in",
				host: "https://bindings.mcp.cloudflare.com/mcp"
			});
			check("extension:request-without-token", request.phase === "requests" && !JSON.stringify(request).includes("authorization"), "the tool emits the request; the token is the client's");
			const discover = ctx.handle({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/call",
				params: {
					name: "discover",
					arguments: {}
				}
			}).result.structuredContent;
			check("extension:discover-defaults", CLOUDFLARE_MCP.every((c) => discover.requestList.some((r) => r.host === c.host)), "discovery asks every Cloudflare server by default");
			return {
				passed: checks.every((c) => c.passed),
				checks
			};
		}
	}
};
// src/quantum/version.ts
var VERSION = "1.4.0";
// src/quantum/toolboxes/payload.ts
/** A result as the document Payload's plugins would hold: one lexical block of UUID logic, nested by prev, described for SEO. */
var payloadDocOf = (p) => {
	const ch = channelOf$2(p.uuid);
	const next = uuidFromParts(ch.handle, [...ch.program.slice(1), ch.program[0]], ch.tail);
	const origin = p.origin ?? "https://qpu.uuidna.com";
	const url = (id) => `${origin}/u/${id}`;
	const chain = [...p.chain ?? [], ...p.prev ? [p.prev] : []];
	const block = {
		type: "block",
		version: 2,
		format: "",
		fields: {
			id: p.uuid,
			blockName: p.tool,
			blockType: "qpu",
			uuid: p.uuid,
			handle: ch.handle,
			program: ch.program.join(""),
			tail: ch.tail,
			tool: p.tool,
			arguments: p.arguments,
			prev: p.prev ?? null,
			next,
			html: p.html ?? null,
			license: LICENSE.spdx
		}
	};
	const title = p.openGraph?.["og:title"] ?? `${p.tool} · @uuidna/qpu`;
	return {
		id: p.uuid,
		lexical: { root: {
			type: "root",
			version: 1,
			direction: "ltr",
			format: "",
			indent: 0,
			children: [
				{
					type: "heading",
					tag: "h2",
					version: 1,
					format: "",
					indent: 0,
					direction: "ltr",
					children: [{
						type: "text",
						version: 1,
						text: title,
						format: 0,
						mode: "normal",
						style: "",
						detail: 0
					}]
				},
				block,
				{
					type: "paragraph",
					version: 1,
					format: "",
					indent: 0,
					direction: "ltr",
					textFormat: 0,
					children: [{
						type: "text",
						version: 1,
						text: `${LICENSE.attribution}. ${LICENSE.terms}`,
						format: 0,
						mode: "normal",
						style: "",
						detail: 0
					}]
				}
			]
		} },
		nestedDocs: {
			parent: p.prev ?? null,
			breadcrumbs: [...chain.map((id) => ({
				doc: id,
				url: url(id),
				label: id.slice(0, 8)
			})), {
				doc: p.uuid,
				url: url(p.uuid),
				label: p.uuid.slice(0, 8)
			}]
		},
		seo: {
			title,
			description: p.openGraph?.["og:description"] ?? p.description,
			image: p.openGraph?.["og:image"] ?? null
		},
		jsonLd: blockJsonLdOf({
			tool: p.tool,
			id: p.uuid,
			description: p.description,
			url: url(p.uuid)
		}),
		license: LICENSE.spdx
	};
};
var payload = toolOf("payload", {
	name: "payload",
	description: "Any tool's result as the document Payload's default plugins hold, no custom collection: a lexical document whose one block is the programmable UUID logic (uuid, handle, program, tail, tool, arguments, prev, next), nested by the referer chain as nested-docs nests (parent, breadcrumbs), the SEO plugin's title, description and image from the block's Open Graph, the JSON-LD and the licence. Every tools/call result carries the same in _meta.payload.",
	inputSchema: {
		type: "object",
		properties: {
			site: {
				type: "boolean",
				description: "the site as its own use cases: every toolbox a use case, every example a page document, as payloadcms.com is built of what Payload computes"
			},
			tool: { type: "string" },
			arguments: { type: "object" },
			prev: {
				type: "string",
				description: "the referer block's uuid"
			},
			chain: {
				type: "array",
				items: { type: "string" },
				description: "the referers before prev, oldest first"
			},
			origin: { type: "string" },
			selftest: { type: "boolean" }
		}
	},
	run: (args, ctx) => {
		if (args.selftest) return {
			selftest: true,
			...PAYLOAD.skill.selftest(ctx)
		};
		if (args.site) return siteOf(ctx, typeof args.origin === "string" ? args.origin : "https://qpu.uuidna.com");
		if (typeof args.tool !== "string") throw new Error("tool names the result to document, or site: true the site");
		const r = ctx.handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/call",
			params: {
				name: String(args.tool),
				arguments: args.arguments ?? {}
			}
		});
		if (r.error) throw new Error(r.error.message);
		const uuid = r.result._meta.block.meta.id;
		const doc = payloadDocOf({
			uuid,
			tool: String(args.tool),
			arguments: args.arguments ?? {},
			description: r.result._meta.openGraph["og:description"] ?? "",
			openGraph: r.result._meta.openGraph,
			html: r.result._meta.widget,
			prev: typeof args.prev === "string" ? args.prev : null,
			chain: Array.isArray(args.chain) ? args.chain.map(String) : [],
			origin: typeof args.origin === "string" ? args.origin : void 0
		});
		return {
			tool: args.tool,
			uuid,
			blocks: 1,
			breadcrumbs: doc.nestedDocs.breadcrumbs.length,
			parent: doc.nestedDocs.parent,
			bytes: JSON.stringify(doc).length,
			doc
		};
	},
	widget: flowWidget
});
/** Payload's default plugins, the ones MCP configures; no custom collection: the one collection is the plugins' own pages. */
var PAYLOAD_PLUGINS = [
	{
		name: "lexical",
		pkg: "@payloadcms/richtext-lexical",
		options: {
			features: ["BlocksFeature"],
			blocks: ["qpu"],
			blockFields: [
				"uuid",
				"handle",
				"program",
				"tail",
				"tool",
				"arguments",
				"prev",
				"next"
			]
		}
	},
	{
		name: "nested-docs",
		pkg: "@payloadcms/plugin-nested-docs",
		options: {
			collections: ["pages"],
			generateLabel: "the block's tool",
			generateURL: "/u/<uuid>"
		}
	},
	{
		name: "seo",
		pkg: "@payloadcms/plugin-seo",
		options: {
			collections: ["pages"],
			uploadsCollection: null,
			generateTitle: "og:title of the block",
			generateDescription: "og:description of the block",
			generateImage: "og:image of the block"
		}
	},
	{
		name: "search",
		pkg: "@payloadcms/plugin-search",
		options: {
			collections: ["pages"],
			searchOverrides: { fields: ["tool", "uuid"] }
		}
	},
	{
		name: "redirects",
		pkg: "@payloadcms/plugin-redirects",
		options: {
			collections: ["pages"],
			from: "/u/<prev>",
			to: "/u/<next>"
		}
	},
	{
		name: "form-builder",
		pkg: "@payloadcms/plugin-form-builder",
		options: {
			fields: [
				"text",
				"select",
				"checkbox",
				"number"
			],
			note: "every tool's inputSchema is a form; the dashboard tool enumerates its facets"
		}
	},
	{
		name: "multi-tenant",
		pkg: "@payloadcms/plugin-multi-tenant",
		options: {
			tenants: Object.values(TENANTS),
			tenantField: "tenant",
			byHost: TENANTS
		}
	},
	{
		name: "mcp",
		pkg: "@payloadcms/plugin-mcp",
		options: {
			servers: "the registration extend gives (direction out), plus every host the tenant names",
			rbac: "roles of every MCP server managed over MCP itself; the Worker asks this host first (QPU_RBAC_MCP, QPU_RBAC_TOOL)"
		}
	}
];
/** The site as its own use cases: the reference is payloadcms.com, whose REST answers pages of blocks with SEO meta and breadcrumbs — the site is what the product computes. Here every toolbox is a use case and every example a page document whose one block is the result's UUID logic, at its live address. */
var siteOf = (ctx, origin) => {
	const list = ctx.handle({
		jsonrpc: "2.0",
		id: 1,
		method: "tools/list"
	}).result.tools;
	const boxOf = new Map(list.map((t) => [t.name, t._meta?.toolbox ?? "none"]));
	const heavy = /* @__PURE__ */ new Set([
		"audit",
		"metrics",
		"imagine",
		"discover",
		"wave",
		"readiness",
		"e2e",
		"textbook",
		"clone"
	]);
	const docs = ctx.examples.filter((e) => !heavy.has(e.tool) && !e.arguments.selftest && !(e.tool === "payload" && e.arguments.site)).map((e) => {
		const r = ctx.handle({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/call",
			params: {
				name: e.tool,
				arguments: e.arguments
			}
		});
		if (!r.result) return {
			id: e.id,
			tool: e.tool,
			toolbox: boxOf.get(e.tool) ?? "none",
			error: r.error?.message ?? "no result"
		};
		const uuid = r.result._meta.block.meta.id;
		const d = payloadDocOf({
			uuid,
			tool: e.tool,
			arguments: e.arguments,
			description: e.shows,
			openGraph: r.result._meta.openGraph,
			prev: null,
			chain: [],
			origin
		});
		return {
			id: e.id,
			tool: e.tool,
			toolbox: boxOf.get(e.tool) ?? "none",
			uuid,
			url: `${origin}/u/${uuid}`,
			title: d.seo.title,
			description: e.shows,
			theorem: e.theorem ?? null,
			breadcrumbs: d.nestedDocs.breadcrumbs.length,
			blocks: 1
		};
	});
	const useCases = [...new Set(docs.map((d) => d.toolbox))].map((toolbox) => ({
		toolbox,
		pages: docs.filter((d) => d.toolbox === toolbox).length,
		tools: [...new Set(docs.filter((d) => d.toolbox === toolbox).map((d) => d.tool))]
	}));
	return {
		reference: {
			site: "https://payloadcms.com",
			contract: "https://payloadcms.com/api/pages?limit=1&depth=0",
			shape: "docs with layout blocks (blockType), meta (title, description), breadcrumbs: the site is what Payload computes; discovery reads it as the standard payload-site"
		},
		origin,
		useCases: useCases.length,
		pages: docs.length,
		byUseCase: useCases,
		docs,
		collection: {
			slug: "pages",
			totalDocs: docs.length,
			docs: docs.filter((d) => "uuid" in d).map((d) => ({
				id: d.uuid,
				title: d.title,
				slug: `/u/${d.uuid}`,
				layout: [{
					blockType: "qpu",
					tool: d.tool,
					uuid: d.uuid
				}],
				meta: {
					title: d.title,
					description: d.description
				},
				breadcrumbs: [{
					doc: d.uuid,
					url: `/u/${d.uuid}`,
					label: d.title
				}]
			}))
		}
	};
};
var configKinds = [
	"payload",
	"wrangler",
	"tenant",
	"pwa",
	"mcp",
	"versions",
	"migration"
];
/** The torus of a configuration: its address, seed and reflection, and whether the loop closes (config → text → config at the same address). */
var torusOf = (config) => {
	const text = JSON.stringify(config);
	const address = uuidOf(text);
	const seed = seedOf(parseInt(address.slice(-2), 16) || 1);
	const back = JSON.stringify(JSON.parse(text));
	return {
		address,
		seed,
		reflection: 10 - seed,
		trinity: trinityOf(seed),
		closed: uuidOf(back) === address,
		bytes: text.length
	};
};
var varsOf = (tenant) => {
	const T = tenant.toUpperCase();
	const hostVar = (h) => `QPU_MCP_TOKEN_${h.toUpperCase().replace(/[.-]/g, "_")}_${T}`;
	return {
		tenant,
		secrets: [
			`QPU_WRITE_TOKEN_${T}`,
			`QPU_ADMIN_TOKEN_${T}`,
			`STRIPE_SECRET_KEY_${T}`,
			`STRIPE_WEBHOOK_SECRET_${T}`,
			...CLOUDFLARE_MCP.filter((c) => c.host !== "docs.mcp.cloudflare.com").map((c) => hostVar(c.host))
		],
		vars: [`QPU_MCP_HOSTS_${T}`],
		shared: [
			"QPU_DATA_KEY",
			"QPU_RBAC_MCP",
			"QPU_RBAC_TOOL"
		],
		note: "names only: the operator sets the values as wrangler secrets; a tool never reads or carries a value"
	};
};
/** The next version, defined by development, kept as low as the architecture allows: every component is one digit (0–9); a
*  patch never moves the number (the change lives in the content address: build metadata +fold); a tool new carries the
*  minor digit, and at 10 the major; a tool gone carries the major; the major past 9 returns to 1 with the epoch counted in
*  the build metadata — so the lifespan of every single-digit combination is infinite: within a version, every state is an
*  address, and the number changes only when the catalogue changes shape. */
var nextVersionOf = (current, toolsNow, lastTag) => {
	const added = toolsNow.filter((t) => !lastTag.tools.includes(t)), removed = lastTag.tools.filter((t) => !toolsNow.includes(t));
	const bump = removed.length ? "major" : added.length ? "minor" : "none";
	const [ma, mi] = lastTag.version.replace(/^v/, "").split(".").map((n) => Number(n) || 0);
	let epoch = lastTag.epoch ?? 1;
	let major = ma, minor = mi;
	if (bump === "minor") {
		minor += 1;
		if (minor > 9) {
			minor = 0;
			major += 1;
		}
	}
	if (bump === "major") {
		major += 1;
		minor = 0;
	}
	if (major > 9) {
		major = 1;
		epoch += 1;
	}
	const build = uuidOf(`catalogue${toolsNow.join(",")}`).slice(0, 8);
	return {
		next: `${bump === "none" ? `${ma}.${mi}.0` : `${major}.${minor}.0`}+e${epoch}.${build}`,
		bump,
		epoch,
		build,
		added,
		removed,
		digits: "single"
	};
};
var configOf = (kind, ctx, p = {}) => {
	const hosts = Object.keys(TENANTS);
	switch (kind) {
		case "payload": return {
			collections: [{
				slug: "pages",
				fields: ["lexical", "tenant"],
				note: "the plugins' own collection; the fields are the plugins'"
			}],
			plugins: PAYLOAD_PLUGINS.map((p) => ({ [p.name]: {
				package: p.pkg,
				...p.options
			} })),
			combinations: 2 ** PAYLOAD_PLUGINS.length,
			combinationNote: "every subset of the plugins is a configuration; the dashboard of this tool enumerates them by address"
		};
		case "wrangler": return {
			$schema: "node_modules/wrangler/config-schema.json",
			name: "qpu",
			main: "src/worker.ts",
			compatibility_date: "2026-10-01",
			workers_dev: true,
			assets: {
				directory: "./docs/.vitepress/dist",
				binding: "ASSETS",
				run_worker_first: true,
				not_found_handling: "none"
			},
			routes: hosts.map((h) => ({
				pattern: h,
				custom_domain: true
			})),
			durable_objects: { bindings: [{
				name: "DOCKET",
				class_name: "DocketObject"
			}] },
			migrations: [{
				tag: "v1",
				new_sqlite_classes: ["DocketObject"]
			}],
			observability: { enabled: true }
		};
		case "tenant": return {
			tenants: [...Object.values(TENANTS), "ceci"].map(varsOf),
			mcpHostsDefault: DEFAULT_MCP_HOSTS
		};
		case "pwa": {
			const accent = `hsl(${hueOf(432)} 62% 44%)`;
			return {
				name: "@uuidna/qpu",
				short_name: "qpu",
				description: p.description ?? "",
				id: "/",
				start_url: "/",
				scope: "/",
				display: "standalone",
				orientation: "any",
				background_color: "#0b0b0f",
				theme_color: accent,
				lang: "en",
				dir: "ltr",
				categories: [
					"developer",
					"education",
					"productivity"
				],
				icons: [{
					src: "/icon.svg",
					sizes: "any",
					type: "image/svg+xml",
					purpose: "any"
				}, {
					src: "/icon.svg",
					sizes: "any",
					type: "image/svg+xml",
					purpose: "maskable"
				}],
				shortcuts: [
					{
						name: "Every tool laid out",
						url: "/u/" + uuidOf("dashboard{}"),
						description: "the dashboard index: every tool with the size of its space"
					},
					{
						name: "Examples",
						url: "/examples"
					},
					{
						name: "Stream",
						url: "/stream"
					},
					{
						name: "Readiness",
						url: "/readiness"
					}
				],
				related_applications: [],
				prefer_related_applications: false,
				license: "CC-BY-NC-ND-4.0",
				version: p.version ?? null
			};
		}
		case "versions": {
			const tools = ctx.handle({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/list"
			}).result.tools.map((t) => t.name);
			const open = ctx.leads.filter((l) => l.status === "open" || l.status === "partial");
			return {
				current: VERSION,
				source: "package.json, injected at generation into src/quantum/version.ts; the Worker names it on every reply (X-Qpu-Version) and in its discovery document",
				lifespan: "infinite by architecture: every component a single digit, a patch never moves the number (the change is its content address, carried as build metadata), a tool new carries the minor digit and at 10 the major, the major past 9 returns to 1 with the epoch counted; within a version every state is an address",
				next: p.lastTag ? nextVersionOf(VERSION, tools, p.lastTag) : null,
				nextNeeds: p.lastTag ? null : "lastTag { version, tools }: the last tag and the tools it served, from the repository tool's watch; without it the next number is not guessed",
				defines: {
					openLeads: open.length,
					byStatus: {
						open: open.filter((l) => l.status === "open").length,
						partial: open.filter((l) => l.status === "partial").length
					},
					plan: open.map((l) => l.id)
				},
				payload: {
					collections: { pages: { versions: {
						drafts: { autosave: true },
						maxPerDoc: 0
					} } },
					overRaid: "a version is a docket entry (fold address + SHA-256), its prev the earlier version; both answer by address, so a reader on either version reads whole; a draft is a commitment entry, publishing reveals it into the same address"
				},
				quantum: "versions coexist: every block and page is addressed by content, the service worker keeps a shell per version, the ETag is the content hash, so an earlier version's addresses answer beside the new one's and nothing is invalidated by a release"
			};
		}
		case "migration": return {
			uptime: "100 %: no address is moved, so no reader waits",
			providers: [...hosts.map((h) => `https://${h}/mcp`), "https://qpu.ceci.workers.dev/mcp"],
			addProvider: "deploy the same Worker at the new provider; name its endpoint among the gate's hosts (QPU_E2E_HOSTS) and among the tenant's MCP hosts; the docket mirrors heal by address; the gate decodes old and new as copies of one value",
			steps: [
				{
					step: 1,
					name: "deploy beside",
					does: "the new version is deployed beside the old one; both answer every address (content addressing, ETag by content, a shell per version in the service worker)"
				},
				{
					step: 2,
					name: "mirror",
					does: "the docket of each tenant is mirrored to the new provider by address; a missing entry heals from any mirror"
				},
				{
					step: 3,
					name: "decode",
					does: "the e2e gate calls every combination on old and new hosts and decodes them as copies of one logical value; the migration is finished when every combination agrees and no erasure remains; a flip is a lead, never a cut-over"
				},
				{
					step: 4,
					name: "route",
					does: "the custom domains point at the new provider; the old one keeps answering until the gate has agreed once more from the new route"
				},
				{
					step: 5,
					name: "rollback",
					does: "the earlier version's addresses still answer: routing back is the whole rollback"
				}
			],
			measuredBy: "the e2e gate: versions per host, outcomes per combination, erasures per host; uptime is whole while every combination agrees"
		};
		case "mcp": {
			const r = ctx.handle({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/call",
				params: {
					name: "extend",
					arguments: { direction: "out" }
				}
			});
			return {
				mcpServers: r.result.structuredContent.outward.mcpServers,
				tools: r.result.structuredContent.outward.tools.length,
				hosts: DEFAULT_MCP_HOSTS
			};
		}
	}
};
/** The drift between a configuration as MCP computes it and the text a client holds (a file): every path whose value differs. */
var driftOf = (computed, current, path = "") => {
	if (JSON.stringify(computed) === JSON.stringify(current)) return [];
	if (computed && current && typeof computed === "object" && typeof current === "object" && !Array.isArray(computed) && !Array.isArray(current)) return [.../* @__PURE__ */ new Set([...Object.keys(computed), ...Object.keys(current)])].flatMap((k) => driftOf(computed[k], current[k], path ? `${path}.${k}` : k));
	return [path || "(root)"];
};
var stripJsonc = (text) => text.replace(/^\s*\/\/.*$/gm, "").replace(/,(\s*[}\]])/g, "$1");
var PAYLOAD = {
	name: "payload",
	idea: "Payload's plugin schema as the one shape of every result: nested docs of lexical documents whose blocks are programmable UUID logic, SEO from the block, no custom collection, a few kilobytes computed once",
	tools: [payload, toolOf("payload", {
		name: "configure",
		description: "MCP configures Payload and the rest: Payload's default plugins (lexical with the one qpu block, nested-docs, seo, search, redirects, form-builder, multi-tenant, mcp) in all their combinations with no custom collection; the Worker's wrangler configuration from the tenants; each tenant's variable names (never values); the PWA manifest; the MCP registration. Every configuration carries its torus: address, seed, reflection and trinity, and whether the loop closes (config → text → config at the same address). With current (the text a client holds), the drift: every path that differs, each a lead. Without kind: all of them, tested.",
		inputSchema: {
			type: "object",
			properties: {
				kind: {
					type: "string",
					enum: [...configKinds],
					description: "omit for all"
				},
				lastTag: {
					type: "object",
					description: "{ version, tools }: the last tag and the tools it served, from the repository tool; with it, kind versions computes the next number"
				},
				current: {
					type: "string",
					description: "the configuration text the client holds (JSON or JSONC): compared, the drift answered"
				},
				version: { type: "string" },
				description: { type: "string" },
				env: {
					type: "array",
					items: { type: "string" },
					description: "the variable NAMES the client's environment holds: which of a tenant's are missing (values never travel)"
				},
				selftest: { type: "boolean" }
			}
		},
		run: (args, ctx) => {
			if (args.selftest) return {
				selftest: true,
				...PAYLOAD.skill.selftest(ctx)
			};
			const p = {
				version: typeof args.version === "string" ? args.version : void 0,
				description: typeof args.description === "string" ? args.description : void 0,
				lastTag: args.lastTag && typeof args.lastTag === "object" ? args.lastTag : void 0
			};
			if (typeof args.kind === "string") {
				if (!configKinds.includes(args.kind)) throw new Error(`no configuration ${args.kind}; the kinds are ${configKinds.join(", ")}`);
				const kind = args.kind;
				const config = configOf(kind, ctx, p);
				const out = {
					kind,
					config,
					torus: torusOf(config)
				};
				if (typeof args.current === "string") {
					let cur;
					try {
						cur = JSON.parse(stripJsonc(args.current));
					} catch (e) {
						cur = { unparsable: e.message };
					}
					const drift = driftOf(config, cur);
					out.drift = drift;
					out.driftCount = drift.length;
					out.leads = drift.map((d) => ({
						id: `config-${kind}-${d}`,
						statement: `${kind}: ${d} differs between the configuration MCP computes and the text the client holds`,
						status: "open",
						reason: "the client rewrites its text from the configuration, or the configuration learns what the operator set by hand"
					}));
				}
				if (kind === "tenant" && Array.isArray(args.env)) {
					const have = new Set(args.env.map(String));
					out.missing = config.tenants.map((t) => ({
						tenant: t.tenant,
						secrets: t.secrets.filter((s) => !have.has(s)),
						vars: t.vars.filter((v) => !have.has(v))
					}));
				}
				return out;
			}
			const all = configKinds.map((kind) => {
				const config = configOf(kind, ctx, p);
				return {
					kind,
					torus: torusOf(config),
					config
				};
			});
			return {
				kinds: all.length,
				tested: all.filter((a) => a.torus.closed).length,
				closed: all.every((a) => a.torus.closed),
				doubleTorus: {
					inward: "config → text → config at the same address, every kind",
					outward: "this catalogue → registration → doors → catalogue (extend identity)"
				},
				byTrinity: Object.fromEntries([
					[
						3,
						6,
						9
					],
					[
						7,
						4,
						1
					],
					[
						2,
						5,
						8
					]
				].map((t) => [t.join(""), all.filter((a) => a.torus.trinity.join("") === t.join("")).map((a) => a.kind)])),
				configs: all
			};
		},
		widget: flowWidget
	})],
	examples: [
		{
			id: "configure-versions",
			tool: "configure",
			arguments: {
				kind: "versions",
				lastTag: {
					version: "v1.4.0",
					tools: [
						"processor",
						"circuit",
						"clay"
					]
				}
			},
			shows: "Versions define development and development defines versions: the current version from its single source, the next number from what the catalogue changed since the last tag (tools added: the minor digit carries), kept to single digits with a build address, the open leads as the version's plan, Payload's versioning over the RAID (every version an entry, never overwritten, no cap).",
			expect: (s) => s.config.current === "1.4.0" && s.config.next.bump === "minor" && s.config.next.next.startsWith("1.5.0+e1.") && s.config.next.digits === "single" && s.config.next.added.length >= 30 && s.config.defines.openLeads > 0 && s.config.payload.collections.pages.versions.maxPerDoc === 0 && s.torus.closed ? null : JSON.stringify(s.config.next).slice(0, 120)
		},
		{
			id: "configure-migration",
			tool: "configure",
			arguments: { kind: "migration" },
			shows: "A provider added or moved at 100 % uptime: deploy beside, mirror the docket by address, decode old and new as copies through the gate, route, and the rollback is the earlier version still answering.",
			expect: (s) => s.config.steps.length === 5 && s.config.providers.length === 3 && s.config.uptime.startsWith("100") ? null : `${s.config.steps?.length} steps`
		},
		{
			id: "configure-all",
			tool: "configure",
			arguments: {},
			shows: "Every configuration MCP computes, tested around the torus: Payload's plugins, the Worker, the tenants' variable names, the manifest, the registration, the versions, the migration; each with its address, seed, reflection and trinity, every loop closed.",
			expect: (s) => s.kinds === 7 && s.tested === 7 && s.closed === true && s.configs.every((c) => c.torus.seed + c.torus.reflection === 10) ? null : `${s.tested}/${s.kinds} closed`
		},
		{
			id: "configure-payload",
			tool: "configure",
			arguments: { kind: "payload" },
			shows: "Payload configured by MCP: eight default plugins over the one pages collection, the lexical block qpu with its UUID logic fields, the tenants in multi-tenant, 256 combinations.",
			expect: (s) => s.config.plugins.length === 8 && s.config.combinations === 256 && s.config.collections.length === 1 && s.config.plugins[0].lexical.blocks[0] === "qpu" && s.torus.closed ? null : `${s.config.plugins?.length} plugins`
		},
		{
			id: "configure-wrangler-drift",
			tool: "configure",
			arguments: {
				kind: "wrangler",
				current: "{ \"name\": \"qpu\", \"main\": \"src/worker.ts\", \"routes\": [] }"
			},
			shows: "The Worker configuration compared to a text a client holds: every differing path is a lead, nothing is rewritten by the tool.",
			expect: (s) => s.driftCount >= 5 && s.drift.includes("routes") && s.leads.every((l) => l.status === "open") ? null : `${s.driftCount} drift`
		},
		{
			id: "configure-tenant-missing",
			tool: "configure",
			arguments: {
				kind: "tenant",
				env: [
					"QPU_WRITE_TOKEN_UUIDNA",
					"QPU_ADMIN_TOKEN_UUIDNA",
					"QPU_DATA_KEY"
				]
			},
			shows: "Each tenant's variable names and which an environment lacks: Stripe keys and the Cloudflare MCP tokens are the operator's to set; values never travel.",
			expect: (s) => s.missing.length === 3 && s.missing[0].tenant === "uuidna" && s.missing[0].secrets.includes("STRIPE_SECRET_KEY_UUIDNA") && s.missing[0].secrets.includes("QPU_MCP_TOKEN_BINDINGS_MCP_CLOUDFLARE_COM_UUIDNA") && !s.missing[0].secrets.includes("QPU_WRITE_TOKEN_UUIDNA") ? null : JSON.stringify(s.missing?.[0]).slice(0, 120)
		},
		{
			id: "payload-site",
			tool: "payload",
			arguments: { site: true },
			shows: "The site as its own use cases, as payloadcms.com is built of what Payload computes: every toolbox a use case, every example a page document in Payload's pages shape (layout blocks, meta, breadcrumbs) at its live /u address.",
			expect: (s) => s.useCases >= 9 && s.pages >= 40 && s.collection.slug === "pages" && s.collection.docs.every((d) => d.layout[0].blockType === "qpu" && d.meta.title && d.breadcrumbs.length === 1) && s.reference.site === "https://payloadcms.com" ? null : `${s.useCases} use cases, ${s.pages} pages`
		},
		{
			id: "payload-doc",
			tool: "payload",
			arguments: {
				tool: "clay",
				arguments: { name: "relation_15" },
				prev: "016da774-e74c-2e44-8742-f8bcf5e8e8f5"
			},
			shows: "The clay result as a Payload document: a lexical root with a heading, one qpu block of UUID logic and the licence paragraph; nested under its referer; the SEO fields from the block's Open Graph.",
			expect: (s) => s.blocks === 1 && s.breadcrumbs === 2 && s.parent === "016da774-e74c-2e44-8742-f8bcf5e8e8f5" && s.doc.lexical.root.children[1].fields.blockType === "qpu" && s.doc.lexical.root.children[1].fields.next.length === 36 && s.doc.seo.title.includes("clay") ? null : `${s.blocks} blocks, ${s.breadcrumbs} crumbs, parent ${s.parent}`
		}
	],
	skill: {
		instructions: "configure: a client calls it with no kind to test every configuration around the torus, with kind and current (its file text) to learn the drift as leads, with kind tenant and the names of its environment to learn what the operator still has to set; gen-docs writes the manifest from kind pwa. A Payload host with the default plugins (lexical, nested-docs, seo) stores _meta.payload of any result as it is: the lexical field is the document, nestedDocs.parent the parent relation, seo the plugin's fields; the block's uuid is the id. A device renders the block from its uuid alone (the walk) and never recomputes what the balancer computed.",
		directions: [
			"server only: the document shape on a fixture block; the next uuid is the program rotated; the breadcrumbs follow the chain",
			"toolbox → toolbox: the block's Open Graph and JSON-LD come from the tree and standards toolboxes",
			"client → server: a Payload host reads the document; the device reads the uuid"
		],
		selftest: (ctx) => {
			const checks = [];
			const check = (id, passed, evidence) => checks.push({
				id,
				passed,
				evidence
			});
			const d = payloadDocOf({
				uuid: "941ef62e-d97b-2438-bfc8-22ae9e5da781",
				tool: "software",
				arguments: {},
				description: "d",
				openGraph: {
					"og:title": "software · @uuidna/qpu",
					"og:description": "five tools"
				},
				prev: "016da774-e74c-2e44-8742-f8bcf5e8e8f5",
				chain: ["00000000-0000-1000-8000-000000000000"]
			});
			const block = d.lexical.root.children[1];
			const ch = channelOf$2(d.id);
			const nx = channelOf$2(block.fields.next);
			check("payload:lexical-block", d.lexical.root.type === "root" && block.type === "block" && block.fields.blockType === "qpu" && block.fields.uuid === d.id && block.fields.handle === ch.handle && block.fields.program === ch.program.join(""), `one qpu block of UUID logic in a lexical root: handle ${ch.handle}, program ${ch.program.join("")}`);
			check("payload:next-rotated", block.fields.next !== d.id && nx.handle === ch.handle && nx.tail === ch.tail && nx.program.join("") !== ch.program.join(""), `the next uuid keeps the handle and the tail and rotates the program: ${ch.program.join("")} → ${nx.program.join("")}`);
			check("payload:nested", d.nestedDocs.parent === "016da774-e74c-2e44-8742-f8bcf5e8e8f5" && d.nestedDocs.breadcrumbs.length === 3 && d.nestedDocs.breadcrumbs[2].doc === d.id, "parent and breadcrumbs follow the chain");
			check("payload:seo-and-ld", d.seo.title === "software · @uuidna/qpu" && d.seo.description === "five tools" && d.jsonLd["@type"] === "CreativeWork" && d.license === "CC-BY-NC-ND-4.0", "SEO from Open Graph, JSON-LD and licence carried");
			check("payload:small", JSON.stringify(d).length < 4e3, `${JSON.stringify(d).length} bytes without html: computed once, a few kilobytes`);
			const w = configOf("wrangler", ctx);
			const tw = torusOf(w);
			check("configure:torus-closed", tw.closed && tw.seed + tw.reflection === 10 && tw.trinity.includes(tw.seed), `wrangler at ${tw.address}: seed ${tw.seed}, reflection ${tw.reflection}, trinity ${tw.trinity.join("")}`);
			check("configure:no-drift-with-itself", driftOf(w, JSON.parse(stripJsonc("// a comment\n" + JSON.stringify(w, null, 1)))).length === 0 && driftOf(w, {
				...w,
				name: "x",
				routes: []
			}).join() === "name,routes", "a JSONC text of the configuration drifts nowhere; a changed name and routes drift exactly there");
			const t = configOf("tenant", ctx);
			check("configure:tenants-named-never-valued", t.tenants.length === 3 && t.tenants.every((x) => x.secrets.every((s) => /^[A-Z_0-9]+$/.test(s))) && !JSON.stringify(t).includes("sk_"), `${t.tenants.length} tenants, ${t.tenants[0].secrets.length} secret names each, no value`);
			const pl = configOf("payload", ctx);
			check("configure:payload-plugins", pl.plugins.length === 8 && pl.combinations === 256 && pl.plugins.some((p) => "multi-tenant" in p), "the eight default plugins, 256 combinations, the tenants in multi-tenant");
			const m = configOf("mcp", ctx);
			const nv = nextVersionOf("1.4.0", [
				"a",
				"b",
				"c"
			], {
				version: "v1.4.0",
				tools: ["a", "b"]
			});
			const rm = nextVersionOf("1.4.0", ["a"], {
				version: "1.4.0",
				tools: ["a", "b"]
			});
			const same = nextVersionOf("1.4.0", ["a", "b"], {
				version: "1.4.0",
				tools: ["a", "b"]
			});
			check("configure:development-defines-the-version", nv.next.startsWith("1.5.0+e1.") && nv.bump === "minor" && rm.next.startsWith("2.0.0+e1.") && same.next.startsWith("1.4.0+e1.") && same.bump === "none", `a tool added: ${nv.next}; a tool gone: ${rm.next}; nothing changed: ${same.next} (the number stays; the build address moves)`);
			const carry = nextVersionOf("1.9.0", ["a", "b"], {
				version: "1.9.0",
				tools: ["a"]
			});
			const wrap = nextVersionOf("9.3.0", ["a"], {
				version: "9.3.0",
				tools: ["a", "b"]
			});
			check("configure:single-digits-infinite-lifespan", carry.next.startsWith("2.0.0+e1.") && wrap.next.startsWith("1.0.0+e2.") && wrap.epoch === 2 && same.build === nextVersionOf("1.4.0", ["a", "b"], {
				version: "1.4.0",
				tools: ["a", "b"]
			}).build, `minor carries at 10: ${carry.next}; major past 9 returns to 1 with the epoch: ${wrap.next}; the build address is a function of the catalogue`);
			const mg = configOf("migration", ctx);
			check("configure:migration-at-whole-uptime", mg.steps.length === 5 && mg.uptime.startsWith("100"), "five steps, no address moved");
			check("configure:mcp-registration", m.tools >= 36 && m.mcpServers.qpu.url.endsWith("/mcp"), `the registration of ${m.tools} tools, through the extension toolbox`);
			return {
				passed: checks.every((c) => c.passed),
				checks
			};
		}
	}
};
// src/quantum/examples.ts
var pair = (rows, label) => rows.find((r) => r[0] === label)?.[1];
var EXAMPLES = [
	...FLOW.examples,
	...LANGUAGE.examples,
	...RAID.examples,
	...BILLING.examples,
	...LEGAL.examples,
	...REPOSITORY.examples,
	...STANDARDS_BOX.examples,
	...PAYLOAD.examples,
	...EXTENSION.examples,
	{
		id: "textbook-categories",
		tool: "textbook",
		arguments: {},
		shows: "The textbook as an adapter: every example categorised for reuse by toolbox, tool, theorem and module; the categories are computed, never written.",
		expect: (s) => s.examples >= 49 && s.categories === 4 && s.toolboxCount >= 8 && s.textbook.theorem["relation_15"]?.includes("clay-relation-15") ? null : `${s.examples} examples, ${s.categories} categories, ${s.toolboxCount} toolboxes`
	},
	{
		id: "textbook-reuse",
		tool: "textbook",
		arguments: { reuse: "clay-relation-15" },
		shows: "One example reused by id: replayed, its result returned, as documented.",
		expect: (s) => s.reused === "clay-relation-15" && s.asDocumented === true && s.theorem === "relation_15" ? null : `${s.reused} ${s.asDocumented} ${s.why}`
	},
	{
		id: "vortex-trinity",
		tool: "verify",
		arguments: { uuid: "941ef62e-d97b-2438-bfc8-22ae9e5da781" },
		theorem: "triad_reflect",
		shows: "The 9-vortex of a UUID read whole: the seed, its reflection under σ_10, the trinity it belongs to and the trinity it reflects into at the same time (3, 6, 9 ↔ 7, 4, 1; 2, 5, 8 into itself), and whether it sits in the key's trinity; stated by the kernel as triad_reflect.",
		expect: (s) => {
			const v = s.channel?.message?.vortex;
			return v && v.seed + v.reflection === 10 && v.trinity.length === 3 && v.reflected.every((x, i) => x + v.trinity[i] === 10) && v.trinity.includes(v.seed) && v.reflected.includes(v.reflection) ? null : JSON.stringify(v);
		}
	},
	{
		id: "css-stylesheet",
		tool: "css",
		arguments: { uuid: "941ef62e-d97b-2438-bfc8-22ae9e5da781" },
		shows: "The UI as CSS: the stylesheet from the key 432 with the rules that draw every block from its own custom properties, and the thirteen variables one UUID sets on its block root, its vortex seed and the seed's reflection summing to 10; no script anywhere.",
		expect: (s) => s.key === 432 && s.script === false && s.variables === 17 && s.vars["--qpu-dust"] !== void 0 && Number(s.vars["--qpu-hue"]) + Number(s.vars["--qpu-reflected-hue"]) === 360 && Number(s.vars["--qpu-vortex"]) + Number(s.vars["--qpu-reflection"]) === 10 && s.vars["--qpu-period"].endsWith("ms") && s.stylesheet.includes(".qpu-block") && s.stylesheet.includes("prefers-reduced-motion") ? null : `${s.variables} vars, ${s.bytes} bytes`
	},
	{
		id: "dashboard-processor",
		tool: "dashboard",
		arguments: { tool: "processor" },
		shows: "The processor tool laid out whole: its one facet (three devices) and the three combinations, each a final cell drawn by its own UUID with a link to its walk page, so the click is the decision.",
		expect: (s) => s.tool === "processor" && s.combinations === 3 && s.final === 3 && s.cellList.every((c) => c.url.startsWith("/u/")) && s.html.includes("data-facet=\"name\"") ? null : `${s.combinations} combinations, ${s.final} final`
	},
	{
		id: "dashboard-algorithm-narrowed",
		tool: "dashboard",
		arguments: {
			tool: "algorithm",
			fixed: { name: "shor" }
		},
		shows: "The algorithm tool with its name fixed to shor: the space of every combination counted whole, and the next facet open as cells that narrow it further, until one combination remains and its cell is the walk.",
		expect: (s) => s.tool === "algorithm" && s.fixed === 1 && s.combinations > 1e5 && s.cells > 0 && s.final === 0 ? null : `${s.combinations} combinations, ${s.cells} cells, ${s.final} final`
	},
	{
		id: "dashboard-index",
		tool: "dashboard",
		arguments: {},
		shows: "Every tool with the size of its input space: how many combinations its enumerable facets admit, which properties stay free, and the address of its own dashboard.",
		expect: (s) => s.tools >= 35 && s.index.find((i) => i.tool === "leads")?.combinations === 5 && s.index.find((i) => i.tool === "algorithm")?.combinations > 100 ? null : `${s.tools} tools`
	},
	{
		id: "clone-language",
		tool: "clone",
		arguments: {
			toolbox: "language",
			as: "language-of-another-world"
		},
		theorem: "all_noclone",
		shows: "The language toolbox cloned whole under a new name: its two tools with their schemas, its instructions, directions and examples, its selftest run now; the quantum state is never cloned, its classical description is.",
		expect: (s) => s.toolbox === "language" && s.as === "language-of-another-world" && s.tools === 2 && s.selftestPassed === true && s.doc.theorem === "all_noclone" && s.doc.toolset.every((t) => typeof t.inputSchema === "object") ? null : `${s.tools} tools, selftest ${s.selftestPassed}`
	},
	{
		id: "metrics-live",
		tool: "metrics",
		arguments: {},
		shows: "The tree's metrics computed now: tools, toolboxes, examples and how many a theorem backs, the kernel's counts, leads by status, the audit, the balancer.",
		expect: (s) => s.tools >= 29 && s.theoremsKernel >= 976 && s.theoremsHandWritten > 0 && s.examplesBackedByTheorems >= 1 && (s.auditNested === true || s.auditFailed === 0) ? null : `${s.tools} tools, kernel ${s.theoremsKernel}, backed ${s.examplesBackedByTheorems}, failed ${s.auditFailed}`
	},
	{
		id: "processor-willow",
		tool: "processor",
		arguments: { name: "Willow" },
		shows: "How many qubits Willow has, as its spec sheet states it: 105, with average connectivity 3.47.",
		expect: (s) => s.qubits === 105 && s.statedAverageConnectivity === 3.47 ? null : `qubits ${s.qubits}, connectivity ${s.statedAverageConnectivity}`
	},
	{
		id: "processor-sycamore",
		tool: "processor",
		arguments: { name: "Sycamore" },
		shows: "Sycamore from its printed diagram: 54 qubits and 88 couplers, derived and stated.",
		expect: (s) => s.qubits === 54 && s.couplers === 88 && s.statedCouplers === 88 ? null : `qubits ${s.qubits}, couplers ${s.couplers}`
	},
	{
		id: "circuit-hadamard-amplitudes",
		tool: "circuit",
		arguments: { operations: [{
			gate: "H",
			qubits: [{
				kind: "line",
				x: 0
			}]
		}] },
		shows: "A Hadamard gives two amplitudes of 1/√2.",
		expect: (s) => s.amplitudes?.length === 2 && s.amplitudes.every((a) => Math.abs(a.re - Math.SQRT1_2) < 1e-12) ? null : `amplitudes ${JSON.stringify(s.amplitudes)}`
	},
	{
		id: "circuit-hadamard-sampled",
		tool: "circuit",
		arguments: {
			operations: [{
				gate: "H",
				qubits: [{
					kind: "line",
					x: 0
				}]
			}],
			measure: {
				key: "m",
				qubits: [{
					kind: "line",
					x: 0
				}]
			},
			repetitions: 400
		},
		shows: "The same circuit measured: 400 bitstrings, each 0 or 1, in a histogram.",
		expect: (s) => s.bitstrings?.length === 400 && s.bitstrings.every((b) => b === "0" || b === "1") && typeof s.histogram === "object" ? null : `bitstrings ${s.bitstrings?.length}`
	},
	{
		id: "circuit-bit-flip-noise",
		tool: "circuit",
		arguments: {
			operations: [{
				gate: "X",
				qubits: [{
					kind: "line",
					x: 0
				}]
			}],
			noise: [{
				name: "bit_flip",
				p: .1
			}]
		},
		shows: "An X gate under a bit-flip channel of p = 0.1 on the density matrix: probability 0.1 of reading 0, purity 0.1² + 0.9² = 0.82. Noise does not sample; it returns the mixed state.",
		expect: (s) => Math.abs(s.probabilities?.[0] - .1) < 1e-12 && Math.abs(s.purity - .82) < 1e-12 ? null : `probabilities ${JSON.stringify(s.probabilities)}, purity ${s.purity}`
	},
	{
		id: "echo-returns",
		tool: "echo",
		arguments: {
			forward: [{
				gate: "H",
				qubits: [{
					kind: "line",
					x: 0
				}]
			}],
			perturbation: {
				gate: "Z",
				qubits: [{
					kind: "line",
					x: 0
				}]
			}
		},
		shows: "H forward, Z, H back is X: the echo is destroyed, so the return probability is 0.",
		expect: (s) => s.probability === 0 ? null : `probability ${s.probability}`
	},
	{
		id: "echo-benchmark",
		tool: "echo_benchmark",
		arguments: {},
		shows: "Quantum Echoes as Google states it: Willow, 105 qubits, the 13,000× figure (Google's, not this tree's).",
		expect: (s) => s.processor === "Willow" && s.qubits === 105 && s.speedup === 13e3 ? null : JSON.stringify(s).slice(0, 80)
	},
	{
		id: "roadmap-all",
		tool: "roadmap",
		arguments: {},
		shows: "The six roadmap milestones and the four application bands.",
		expect: (s) => s.milestones?.length === 6 && s.applications?.length === 4 ? null : `milestones ${s.milestones?.length}`
	},
	{
		id: "roadmap-milestone-3",
		tool: "roadmap",
		arguments: { milestone: 3 },
		shows: "One milestone by number.",
		expect: (s) => s.milestones?.length === 1 ? null : `milestones ${s.milestones?.length}`
	},
	{
		id: "algorithm-shor-15",
		tool: "algorithm",
		arguments: {
			name: "shor",
			N: 15,
			a: 7
		},
		shows: "Shor's circuit on the state-vector simulator: order 4 and factors 3 × 5 for N = 15, a = 7.",
		expect: (s) => pair(s.summary, "Factors") === "3 × 5" && pair(s.summary, "Order of a mod N") === "4" ? null : JSON.stringify(s.summary)
	},
	{
		id: "algorithm-qft-3",
		tool: "algorithm",
		arguments: {
			name: "qft",
			qubits: 3,
			input: 5
		},
		shows: "The QFT of |5⟩ on three qubits: eight amplitudes of equal magnitude.",
		expect: (s) => s.rows?.length === 8 ? null : `rows ${s.rows?.length}`
	},
	{
		id: "algorithm-grover",
		tool: "algorithm",
		arguments: { name: "grover" },
		shows: "Grover on two qubits finds the marked |00⟩ with certainty.",
		expect: (s) => s.rows?.length === 1 ? null : `rows ${s.rows?.length}`
	},
	{
		id: "algorithm-teleportation",
		tool: "algorithm",
		arguments: { name: "teleportation" },
		shows: "Teleportation: the received state matches the message on X, Y and Z.",
		expect: (s) => s.rows?.length === 3 ? null : `rows ${s.rows?.length}`
	},
	{
		id: "algorithm-phase-estimation",
		tool: "algorithm",
		arguments: {
			name: "phase_estimation",
			theta: .25,
			bits: 3
		},
		shows: "Phase estimation reads θ = 0.25 exactly in three bits.",
		expect: (s) => s.rows?.length === 1 ? null : `rows ${s.rows?.length}`
	},
	{
		id: "algorithm-qaoa",
		tool: "algorithm",
		arguments: { name: "qaoa" },
		shows: "QAOA on the Cirq page's instance, sampled from the state's probabilities.",
		expect: (s) => Array.isArray(s.rows) && s.rows.length > 0 ? null : "no rows"
	},
	{
		id: "software",
		tool: "software",
		arguments: {},
		shows: "The Software page tools; only Cirq is implemented here.",
		expect: (s) => s.tools?.length === 5 ? null : `tools ${s.tools?.length}`
	},
	{
		id: "statements-cirq",
		tool: "statements",
		arguments: { topic: "cirq" },
		shows: "One statement by topic.",
		expect: (s) => s.statements?.length === 1 ? null : `statements ${s.statements?.length}`
	},
	{
		id: "repositories",
		tool: "repositories",
		arguments: {},
		shows: "The fifteen quantumlib repositories.",
		expect: (s) => s.total === 15 && s.repositories?.length === 15 ? null : `total ${s.total}`
	},
	{
		id: "leads-all",
		tool: "leads",
		arguments: {},
		shows: "Every lead with its status; the counts add up to the total.",
		expect: (s) => {
			const sum = Object.values(s.counts ?? {}).reduce((a, b) => a + Number(b), 0);
			return sum === s.total && s.leads?.length === s.total ? null : `counts ${sum} vs total ${s.total}`;
		}
	},
	{
		id: "qec-bit-flip-0.1",
		tool: "quantum-error-correction",
		arguments: { p: .1 },
		shows: "The three-qubit repetition code on the density matrix at p = 0.1: logical error 3p² − 2p³ = 0.028, below the raw 0.1.",
		expect: (s) => {
			const at = s.at ?? {};
			return Math.abs(at.logicalError - .028) < 1e-9 && at.physicalError === .1 && s.textbook?.maxDeviationOverSweep < 1e-9 ? null : `at ${JSON.stringify(at)}`;
		}
	},
	{
		id: "chemistry-h2",
		tool: "chemistry-simulation",
		arguments: {},
		shows: "H₂ in STO-3G at 0.7414 Å: the Hartree–Fock energy from the simulator is −1.1167 Ha and the variational minimum lies below it near −1.137 Ha.",
		expect: (s) => {
			const hf = s.hartreeFockFromSimulator;
			const best = s.vqe?.best;
			const e = typeof best === "number" ? best : best?.energy;
			return Math.abs(hf + 1.1167) < .002 && typeof e === "number" && e <= hf && Math.abs(e + 1.137) < .005 ? null : `hf ${hf}, best ${JSON.stringify(best)}`;
		}
	},
	{
		id: "ftqc-all",
		tool: "fault-tolerant-design",
		arguments: {},
		shows: "Resource counts read from six circuits this tree builds; one Toffoli costs 7 T gates by the cited decomposition.",
		expect: (s) => s.circuits?.length === 6 && s.costs?.toffoli?.tCount === 7 ? null : `circuits ${s.circuits?.length}, toffoli ${JSON.stringify(s.costs?.toffoli)}`
	},
	{
		id: "quantumlib-cirq",
		tool: "quantumlib",
		arguments: { repository: "Cirq" },
		shows: "What this tree implements of Cirq, as a cross-reference of its exports.",
		expect: (s) => JSON.stringify(s).includes("Cirq") ? null : "no Cirq entry"
	},
	{
		id: "clay-register",
		tool: "clay",
		arguments: {},
		shows: "The 54 Clay relations recomputed in exact integer arithmetic: all hold, the widest value needs 33 bits (amplitudes = 2^32), three 16-bit limbs on an 8-bit machine.",
		expect: (s) => s.total === 54 && s.holding === 54 && s.maxBits === 33 && s.maxLimbs16 === 3 ? null : `${s.holding}/${s.total}, ${s.maxBits} bits, ${s.maxLimbs16} limbs`
	},
	{
		id: "clay-reflection",
		tool: "clay",
		arguments: { technique: "reflection" },
		theorem: "triad_reflect",
		shows: "The register read by the technique: every relation's value as a vortex seed with its σ_10 reflection and both trinities, the relations whose seeds reflect each other paired, the fixed ones (seed 5) and the ones in the key's trinity named, and the plan to ask the unit's sequence door every value.",
		expect: (s) => s.total === 54 && s.pairsCount > 0 && s.readings.every((r) => r.seed + r.reflection === 10) && s.unitPlan.length === 54 ? null : `${s.total} relations, ${s.pairsCount} pairs, ${s.unitPlan?.length} calls`
	},
	{
		id: "clay-relation-15",
		tool: "clay",
		arguments: { name: "relation_15" },
		theorem: "relation_15",
		shows: "One relation: magicBlock = glProd hexbit seed = qftDepth vertices = 15.",
		expect: (s) => s.relations?.[0]?.sides?.every((x) => x.value === 15) ? null : JSON.stringify(s.relations?.[0]?.sides)
	},
	{
		id: "verify-seal-and-content",
		tool: "verify",
		arguments: {
			uuid: "70a13419-52d5-2702-a236-d17851bf2b4a",
			content: "qpu"
		},
		shows: "One UUID checked cheaply: its seal from its own 31 nibbles, and its content by one fold.",
		expect: (s) => s.valid === true && s.decided === 2 ? null : JSON.stringify(s.checks)
	},
	{
		id: "verify-tampered",
		tool: "verify",
		arguments: { uuid: "70a13419-52d5-2702-a236-d17851bf2b4b" },
		shows: "A UUID with one nibble changed: the content-decided version no longer agrees, and no content was needed to see it.",
		expect: (s) => s.valid === false && s.checks[0].passed === false ? null : JSON.stringify(s.checks[0])
	},
	{
		id: "match-willow",
		tool: "match",
		arguments: { statement: "How many qubits does Willow have?" },
		shows: "Any statement, matched: this one is served by the processor tool.",
		expect: (s) => s.verdict === "served" && s.tool === "processor" ? null : `${s.verdict} via ${s.tool}`
	},
	{
		id: "match-glagolitic",
		tool: "match",
		arguments: { statement: "Factor Ⰺⰴ with Shor" },
		shows: "A Glagolitic numeral read as the integer 15 before the match: served by the algorithm tool, factored 3 × 5 in the reflection.",
		expect: (s) => s.verdict === "served" && s.tool === "algorithm" && s.read?.numerals?.[0]?.value === 15 && s.reflection?.factors?.[0]?.factors === "3 × 5" ? null : `${s.verdict} via ${s.tool}; read ${JSON.stringify(s.read)}`
	},
	{
		id: "match-bulgarian",
		tool: "match",
		arguments: {
			statement: "Разложи Ⰺⰴ с Shor",
			locale: "bg"
		},
		shows: "A statement in Bulgarian with a Glagolitic numeral, translated by vocabulary offline, matched, and answered with its verdict in Bulgarian.",
		expect: (s) => s.verdict === "served" && s.tool === "algorithm" && s.read?.verdictIn === "обслужена" && s.read?.locale === "bg" ? null : `${s.verdict} via ${s.tool}; read ${JSON.stringify(s.read)}`
	},
	{
		id: "match-theorem-first",
		tool: "match",
		arguments: { statement: "mersenne 127" },
		theorem: "mersenne_127",
		shows: "Solved first by the QPU textbook: the statement names a kernel-accepted theorem, so it is served by that theorem, proven, before any tool is called.",
		expect: (s) => s.verdict === "served" && s.theorem === "mersenne_127" && s.candidates?.[0]?.kind === "theorem" ? null : `${s.verdict} via ${s.tool ?? s.theorem}`
	},
	{
		id: "match-pattern-uuid",
		tool: "match",
		arguments: { statement: "what is 941ef62e-d97b-2438-bfc8-22ae9e5da781" },
		shows: "Pattern recognition: a UUID in the statement opens the verify door before any token match; the match names the pattern and carries the verification.",
		expect: (s) => s.pattern === "uuid" && s.verdict === "served" && s.tool === "verify" && s.result?.channel?.handle === "941ef62e" ? null : `${s.pattern} ${s.verdict} via ${s.tool}`
	},
	{
		id: "match-pattern-dashboard",
		tool: "match",
		arguments: { statement: "show me the dashboard of algorithm" },
		shows: "Pattern recognition: \"dashboard of <tool>\" lays the tool out whole.",
		expect: (s) => s.pattern === "dashboard" && s.tool === "dashboard" && s.result?.combinations > 1e3 ? null : `${s.pattern} ${s.verdict} via ${s.tool}`
	},
	{
		id: "match-rsa-2048",
		tool: "match",
		arguments: { statement: "Factor RSA-2048 with Shor" },
		shows: "Any statement, proved impossible from the schema: algorithm.N is bounded to 21; the cluster names what is served instead.",
		expect: (s) => s.verdict === "impossible" && s.cluster?.length > 0 ? null : `${s.verdict}, cluster ${s.cluster?.length}`
	},
	{
		id: "audit-self",
		tool: "audit",
		arguments: {},
		shows: "The MCP surface audits itself: every check passes.",
		expect: (s) => s.failed === 0 && s.total > 0 ? null : `${s.failed} of ${s.total} checks failed: ${(s.checks ?? []).filter((c) => !c.passed).map((c) => c.id).join(", ")}`
	}
];
// src/quantum/audit.ts
/** Audit a handler against the example registry and the leads it serves. Pure: no I/O. */
/** What a screen reader or a braille display needs of a widget, measured on its HTML: a name on every image, a header row on every
* table, words in every link, a heading to land on. Each miss is named; an empty list is a pass. */
var accessibilityOf = (html) => {
	const misses = [];
	const unnamed = (html.match(/<img\b[^>]*>/gi) ?? []).filter((t) => !/\balt="[^"]+"/i.test(t)).length;
	if (unnamed) misses.push(`${unnamed} image(s) without alt text`);
	const unheaded = (html.match(/<table\b[\s\S]*?<\/table>/gi) ?? []).filter((t) => !/<th\b/i.test(t)).length;
	if (unheaded) misses.push(`${unheaded} table(s) without a header cell`);
	const wordless = (html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) ?? []).filter((a) => !/\baria-label="[^"]+"/i.test(a) && a.replace(/<[^>]*>/g, "").trim() === "").length;
	if (wordless) misses.push(`${wordless} link(s) without words`);
	if (!/<h[1-6]\b|role="heading"/i.test(html)) misses.push("no heading to land on");
	return misses;
};
var auditOf = (handle, examples, leads, toolboxes = []) => {
	const checks = [];
	let clock = Date.now();
	const check = (id, passed, evidence) => {
		const now = Date.now();
		checks.push({
			id,
			passed,
			evidence,
			ms: now - clock
		});
		clock = now;
	};
	const call = (name, args) => handle({
		jsonrpc: "2.0",
		id: 1,
		method: "tools/call",
		params: {
			name,
			arguments: args
		}
	});
	const init = handle({
		jsonrpc: "2.0",
		id: 0,
		method: "initialize"
	});
	check("initialize", "result" in init && typeof init.result?.serverInfo?.version === "string" && init.result.serverInfo.name === "qpu", JSON.stringify(init.result?.serverInfo ?? init.error));
	check("license:initialize", "result" in init && init.result?.serverInfo?.license === "CC-BY-NC-ND-4.0" && typeof init.result?.instructions === "string" && init.result.instructions.includes("CC-BY-NC-ND-4.0"), "serverInfo.license and instructions carry the licence");
	const list = handle({
		jsonrpc: "2.0",
		id: 1,
		method: "tools/list"
	});
	const tools = "result" in list ? list.result.tools : [];
	check("tools/list", tools.length > 0, `${tools.length} tools`);
	const names = new Set(tools.map((t) => t.name));
	for (const t of tools) {
		const schema = t.inputSchema ?? {};
		const props = Object.keys(schema.properties ?? {});
		const required = schema.required ?? [];
		const missing = required.filter((r) => !props.includes(r));
		check(`schema:${t.name}`, t.description.length > 0 && schema.type === "object" && missing.length === 0, missing.length ? `required ${missing.join(", ")} not in properties` : `${props.length} properties, ${required.length} required`);
		const covered = examples.filter((e) => e.tool === t.name);
		check(`covered:${t.name}`, covered.length > 0, covered.length ? `${covered.length} example(s)` : "no example calls this tool");
	}
	for (const e of examples) {
		check(`example-tool:${e.id}`, names.has(e.tool), names.has(e.tool) ? e.tool : `tool ${e.tool} is not served`);
		if (!names.has(e.tool)) continue;
		if (e.tool === "audit") continue;
		const reply = call(e.tool, e.arguments);
		if ("error" in reply) {
			check(`example:${e.id}`, false, `${reply.error.code} ${reply.error.message}`);
			continue;
		}
		const r = reply.result;
		const shape = Array.isArray(r.content) && r.content[0]?.type === "text" && "structuredContent" in r && typeof r._meta?.widget === "string" && r._meta.widget.length > 0;
		check(`license:${e.id}`, r._meta?.license?.spdx === "CC-BY-NC-ND-4.0" && r._meta.widget.includes("data-license=\"CC-BY-NC-ND-4.0\"") && r._meta?.block?.license === "CC-BY-NC-ND-4.0", r._meta?.license ? "result, widget and block carry the licence" : "no licence on the result");
		const w = r._meta?.widget ?? "";
		check(`css-vars:${e.id}`, w.includes("class=\"qpu-block\"") && w.includes("--qpu-accent:") && w.includes("--qpu-angle:") && w.includes("--qpu-period:") && !/style="[^"]*#[0-9a-f]{3,6}\b/i.test(w), "the block root carries its UUID's custom properties and no hex colour; the stylesheet draws it");
		const a11y = accessibilityOf(w);
		check(`accessibility:${e.id}`, a11y.length === 0, a11y.length ? a11y.join("; ") : "images named, tables headed, links worded, a heading present");
		const why = e.expect(r.structuredContent);
		check(`example:${e.id}`, shape && why === null, why ?? (shape ? e.shows : "result lacks content, structuredContent or a widget"));
	}
	if (toolboxes.length) {
		const named = new Map(toolboxes.flatMap((b) => b.tools.map((t) => [t.name, b.name])));
		for (const t of tools) {
			const meta = t._meta;
			check(`toolbox:${t.name}`, typeof meta?.toolbox === "string" && named.get(t.name) === meta.toolbox, meta?.toolbox ? `in ${meta.toolbox}` : "names no toolbox");
		}
		for (const b of toolboxes) try {
			const r = b.skill.selftest({
				handle,
				examples,
				leads
			});
			for (const c of r.checks) {
				check(`selftest:${b.name}:${c.id}`, c.passed, c.evidence);
				if (c.ms !== void 0) checks.at(-1).ms = c.ms;
			}
			check(`selftest:${b.name}`, r.passed, `${r.checks.filter((c) => c.passed).length} of ${r.checks.length} checks pass`);
		} catch (e) {
			check(`selftest:${b.name}`, false, `threw: ${e.message.slice(0, 160)}`);
		}
	}
	const backed = examples.filter((e) => e.theorem);
	for (const e of backed) check(`theorem-exists:${e.id}`, THEOREM_KEYS.has(e.theorem), THEOREM_KEYS.has(e.theorem) ? `${e.theorem} is kernel-accepted (${THEOREMS.find((t) => t.key === e.theorem)?.statement.slice(0, 80)})` : `${e.theorem} is not among the ${THEOREMS.length} hand-written theorems the kernel accepted: a fabricated citation`);
	check("examples-backed-by-theorems", true, `${backed.length} of ${examples.length} examples name the theorem that makes them true (${backed.map((e) => `${e.id}→${e.theorem}`).join(", ") || "none"}); the rest are the textbook, respected, each a lead for a theorem`);
	const ids = /* @__PURE__ */ new Set();
	const dup = examples.filter((e) => ids.has(e.id) ? true : (ids.add(e.id), false)).map((e) => e.id);
	check("example-ids-unique", dup.length === 0, dup.length ? `duplicates: ${dup.join(", ")}` : `${examples.length} unique ids`);
	const servedWithoutTool = leads.filter((l) => l.status === "served" && !(l.tool && names.has(l.tool)));
	check("leads:served-have-tools", servedWithoutTool.length === 0, servedWithoutTool.length ? servedWithoutTool.map((l) => `${l.id}→${l.tool ?? "none"}`).join(", ") : `${leads.filter((l) => l.status === "served").length} served leads name a served tool`);
	const unexplained = leads.filter((l) => l.status !== "served" && !(l.reason && l.reason.length > 0));
	check("leads:others-have-reasons", unexplained.length === 0, unexplained.length ? unexplained.map((l) => l.id).join(", ") : `${leads.length - leads.filter((l) => l.status === "served").length} non-served leads carry a reason`);
	const unknownTool = call("no-such-tool", {});
	check("error:unknown-tool", "error" in unknownTool && unknownTool.error.code === -32601, JSON.stringify(unknownTool.error ?? unknownTool.result).slice(0, 80));
	const unknownMethod = handle({
		jsonrpc: "2.0",
		id: 2,
		method: "no/such"
	});
	check("error:unknown-method", "error" in unknownMethod && unknownMethod.error.code === -32601, JSON.stringify(unknownMethod.error ?? unknownMethod.result).slice(0, 80));
	const badArgs = call("processor", { name: "Mars" });
	check("error:invalid-params", "error" in badArgs && badArgs.error.code === -32602, JSON.stringify(badArgs.error ?? badArgs.result).slice(0, 80));
	const passed = checks.filter((c) => c.passed).length;
	return {
		slowest: [...checks].sort((a, b) => (b.ms ?? 0) - (a.ms ?? 0)).slice(0, 8).map((c) => `${c.id} ${c.ms} ms`),
		total: checks.length,
		passed,
		failed: checks.length - passed,
		tools: tools.length,
		examples: examples.length,
		leads: leads.length,
		checks
	};
};
/** Willow's sites, row by row: 105 of them. */
var WILLOW_SITES = [
	[
		0,
		6,
		8
	],
	[
		1,
		5,
		8
	],
	[
		2,
		4,
		10
	],
	[
		3,
		3,
		10
	],
	[
		4,
		2,
		12
	],
	[
		5,
		1,
		12
	],
	[
		6,
		0,
		14
	],
	[
		7,
		2,
		13
	],
	[
		8,
		2,
		12
	],
	[
		9,
		4,
		11
	],
	[
		10,
		4,
		10
	],
	[
		11,
		6,
		9
	],
	[
		12,
		6,
		8
	]
].flatMap(([row, from, to]) => Array.from({ length: to - from + 1 }, (_, i) => GridQubit.of(row, from + i)));
/** The couplers: each pair of sites next to each other along a row or along a column of the grid. */
var couplersOf = (sites) => {
	const present = new Set(sites.map(keyOf));
	return sites.flatMap((site) => {
		if (site.kind !== "grid") return [];
		return [GridQubit.of(site.row, site.col + 1), GridQubit.of(site.row + 1, site.col)].filter((n) => present.has(keyOf(n))).map((n) => [site, n]);
	});
};
/** The errors and coherence common to both chips' reset options, as the spec sheet lists them. */
var RESET = ["multi-level reset (|1> and above)", "leakage removal (|2> only)"];
/** Chip 1: the quantum error correction chip. */
var ERROR_CORRECTION_CHIP = {
	singleQubitGateError: {
		mean: 35e-5,
		spread: 29e-5
	},
	twoQubitGateError: {
		gate: CZ.name,
		mean: .0033,
		spread: .0018
	},
	measurementError: {
		mean: .0077,
		spread: .0021,
		scope: "repetitive, measure qubits"
	},
	t1Microseconds: {
		mean: 68,
		spread: 13
	},
	reset: RESET,
	errorCorrectionCyclesPerSecond: 909e3,
	surfaceCodeCycleMicroseconds: 1.1,
	/** Λ for code distances 3, 5 and 7: the error suppression factor, as the sheet states it (Λ3,5,7 = 2.14 ± 0.02) */
	errorSuppression: {
		distances: [
			3,
			5,
			7
		],
		mean: 2.14,
		spread: .02
	}
};
/** Chip 2: the random circuit sampling chip. */
var RANDOM_CIRCUIT_SAMPLING_CHIP = {
	singleQubitGateError: {
		mean: 36e-5,
		spread: 13e-5
	},
	twoQubitGateError: {
		gate: "iSWAP-like",
		mean: .0014,
		spread: 52e-5
	},
	measurementError: {
		mean: .0067,
		spread: .0051,
		scope: "terminal, all qubits"
	},
	t1Microseconds: {
		mean: 98,
		spread: 32
	},
	reset: RESET,
	circuitRepetitionsPerSecond: 63e3,
	application: {
		qubits: 103,
		depth: 40,
		xebFidelity: .001
	},
	comparison: {
		onWillow: "5 minutes",
		onClassicalSupercomputer: "10^25 years"
	}
};
/** Willow: 105 superconducting qubits on the grid above, with the two chips the spec sheet gives. */
var WILLOW = {
	name: "Willow",
	technology: "superconducting",
	qubits: WILLOW_SITES.length,
	sites: WILLOW_SITES,
	couplers: couplersOf(WILLOW_SITES),
	/** the sheet's stated average connectivity, 4-way typical; the grid's couplers give 2E/N, checked in the tests */
	statedAverageConnectivity: 3.47,
	typicalConnectivity: 4,
	/** Magic state cultivation on Willow, as the Google blog states it: a 40-fold reduction in errors against un-cultivated
	*  states, T-states at a logical fidelity of 99.99%, grafted from a distance-3 color code to a distance-5 surface code */
	magicStateCultivation: {
		errorReductionFactor: 40,
		logicalFidelity: .9999,
		colorCodeDistance: 3,
		surfaceCodeDistance: 5
	},
	/** The Willow error-correction preprint, "Quantum error correction below the surface code threshold" (arXiv 2408.13687, the
	*  paper the homepage links as Nature): the distance-7 and distance-5 memories and the figures its abstract states. */
	errorCorrectionPreprint: {
		distances: [5, 7],
		lambda: {
			mean: 2.14,
			spread: .02
		},
		logicalErrorPerCycle: {
			mean: .00143,
			spread: 3e-5
		},
		qubitsInDistance7Code: 101,
		repetitionCodeDistances: 29,
		decoderLatencyMicroseconds: 63,
		decoderLatencyDistance: 5,
		cycleMicroseconds: 1.1,
		beyondBreakEven: {
			mean: 2.4,
			spread: .3
		},
		correlatedErrorCycles: 3e9
	},
	chips: {
		errorCorrection: ERROR_CORRECTION_CHIP,
		randomCircuitSampling: RANDOM_CIRCUIT_SAMPLING_CHIP
	}
};
/** The device a processor is: its sites and its couplers, so a circuit is checked against the hardware it runs on. */
var deviceOf = (processor = WILLOW) => new Device(processor.sites, processor.couplers);
/** The processors this repository describes, by their Google name. */
var PROCESSORS = { Willow: WILLOW };
/** A device grid as Cirq's known_devices source writes it: each character cell is a qubit at its row and column, a dash is none. */
var gridSites = (rows) => rows.flatMap((line, r) => [...line].flatMap((cell, c) => cell === "-" ? [] : [GridQubit.of(r, c)]));
/** Sycamore's printed device diagram, from Google's devices page and Cirq's known_devices source (the same 54 cells): 54 qubits,
*  and the couplers their row and column neighbours give, which the page states as 88. */
var SYCAMORE_SITES = gridSites([
	"-----AB---",
	"----ABCD--",
	"---ABCDEF-",
	"--ABCDEFGH",
	"-ABCDEFGHI",
	"ABCDEFGHI-",
	"-CDEFGHI--",
	"--EFGHI---",
	"---GHI----",
	"----I-----"
]);
/** Sycamore: 54 qubits on the printed diagram, with the couplers its row and column neighbours give. The page states 54 qubits
*  and 88 couplers, both checked in the tests. */
var SYCAMORE = {
	name: "Sycamore",
	qubits: SYCAMORE_SITES.length,
	sites: SYCAMORE_SITES,
	couplers: couplersOf(SYCAMORE_SITES),
	statedQubits: 54,
	statedCouplers: 88,
	layout: "the printed device diagram on the Google devices page, and the grid in Cirq's known_devices source"
};
/** Sycamore23, the 23-qubit subset of Sycamore in Cirq's known_devices source: its grid, and the couplers of its neighbours. */
var SYCAMORE23_SITES = gridSites([
	"----------",
	"----------",
	"----------",
	"--A-------",
	"-ABC------",
	"ABCDE-----",
	"-CDEFG----",
	"--EFGHI---",
	"---GHI----",
	"----I-----"
]);
var SYCAMORE23 = {
	name: "Sycamore23",
	qubits: SYCAMORE23_SITES.length,
	sites: SYCAMORE23_SITES,
	couplers: couplersOf(SYCAMORE23_SITES),
	layout: "the Sycamore23 grid in Cirq's known_devices source"
};
/** The noise of a Willow chip, from its spec sheet's medians: a single-qubit depolarizing channel with p = 1.5 × the single-qubit
*  gate error, which makes the average gate error of an operation on one qubit equal to that figure; and, after each two-qubit
*  gate, a depolarizing channel with p = 0.75 × the two-qubit gate error on each of its qubits, which matches that error to first
*  order. The spec sheet's T1 and readout are not applied: gate durations and per-qubit readout are not on the sheet. */
var willowNoiseOf = (chip) => {
	const figures = WILLOW.chips[chip];
	const single = figures.singleQubitGateError.mean;
	const two = figures.twoQubitGateError.mean;
	return (arity) => arity === 1 ? [{
		name: "depolarize",
		p: 1.5 * single
	}] : [{
		name: "depolarize",
		p: .75 * two
	}];
};
/** Every device this repository can build a circuit against, by its name. */
var DEVICES = {
	Willow: WILLOW,
	Sycamore: SYCAMORE,
	Sycamore23: SYCAMORE23
};
// src/quantum/echo.ts
/** Google's Quantum Echoes result as its blog states it: the OTOC protocol run on the 105-qubit array of Willow, 13,000x
*  faster than the fastest supercomputers, on molecules of 15 and 28 atoms. Figures as stated, none estimated here. */
var QUANTUM_ECHOES = {
	processor: PROCESSORS.Willow.name,
	qubits: PROCESSORS.Willow.qubits,
	speedup: 13e3,
	molecules: [15, 28],
	/** the experiment as Google's research blog states it: the figure's 65 qubits, the text's 103 for forward and backward
	*  evolution (both as stated), about 2 hours on Willow, 3.2 years per data point on Frontier, 10 person-years of classical red-teaming */
	experiment: {
		qubitsUsedInFigure: 65,
		qubitsStatedInText: 103,
		quantumRunHours: 2,
		frontierYearsPerDataPoint: 3.2,
		classicalRedTeamPersonYears: 10,
		classicalAlgorithms: 9,
		nmrDemonstrationBeyondClassical: false
	},
	/** the OTOC protocol as the research blog lists it */
	protocol: [
		"the qubits start in a ground state, one prepared in |ψM>",
		"a forward evolution U, a random circuit of one- and two-qubit operations on a 2D grid, creates a chaotic state",
		"a one-qubit perturbation B is applied between the forward and backward evolutions",
		"the backward evolution U† is applied",
		"a one-qubit probe M is applied to the initially prepared qubit",
		"the steps repeat k times, and another qubit is then measured"
	]
};
/** The echo circuit: forward operations, an optional perturbation, then the adjoint of each forward operation in reverse. */
var echoCircuit = (forward, perturbation) => {
	const circuit = new Circuit();
	for (const op of forward) circuit.append(op);
	if (perturbation) circuit.append(perturbation);
	for (const op of [...forward].reverse()) circuit.append(op.kind === "gate" ? {
		...op,
		gate: adjointOf(op.gate)
	} : op);
	return circuit;
};
/** The probability that every qubit of the echo returns to |0...0>. */
var echoProbability = (forward, perturbation) => {
	const { amplitudes } = new Simulator().simulate(echoCircuit(forward, perturbation));
	const [re, im] = amplitudes[0];
	return re * re + im * im;
};
// src/quantum/roadmap.ts
var ROADMAP = [
	{
		number: 1,
		title: "Beyond classical",
		year: "2019",
		physicalQubits: 54,
		status: "achieved"
	},
	{
		number: 2,
		title: "Logical qubit prototype",
		year: "2023",
		physicalQubits: 100,
		status: "achieved"
	},
	{
		number: 3,
		title: "1 long-lived logical qubit",
		year: "2025+",
		physicalQubits: 1e3,
		status: "in progress"
	},
	{
		number: 4,
		title: "Tileable module (logical gate)",
		year: null,
		physicalQubits: 1e4,
		status: "planned"
	},
	{
		number: 5,
		title: "Engineering scale up",
		year: null,
		physicalQubits: 1e5,
		status: "planned"
	},
	{
		number: 6,
		title: "Error-corrected quantum computer",
		year: null,
		physicalQubits: 1e6,
		status: "planned"
	}
];
/** The applications Google's roadmap figure predicts, by the physical qubits each needs with quantum error correction. */
var APPLICATIONS = [
	{
		band: "50k–100k",
		low: 5e4,
		high: 1e5,
		applications: ["Fundamental physics: quantum gravity, many-body states", "Certified randomness"]
	},
	{
		band: "100k–500k",
		low: 1e5,
		high: 5e5,
		applications: [
			"Quantum magnets",
			"Spectroscopy (NMR, ESR)",
			"Quantum machine learning with \"quantum data\"",
			"Novel phases of matter"
		]
	},
	{
		band: "500k–5M",
		low: 5e5,
		high: 5e6,
		applications: [
			"Molecular modeling: drug targets and anti-targets, homogeneous catalysis, solar cell dye molecules",
			"Topological data analysis",
			"Some differential equations",
			"Quantum machine learning of \"classical data\""
		]
	},
	{
		band: "5M–50M",
		low: 5e6,
		high: 5e7,
		applications: ["Molecular modeling: better modeling of materials for our qubits, battery cathodes, heterogeneous catalysis, fusion reactor design", "Factoring"]
	}
];
// src/quantum/random.ts
/** The MT19937 generator of numpy's legacy RandomState. */
var MersenneTwister = class {
	state = /* @__PURE__ */ new Uint32Array(624);
	index = 624;
	constructor(seed) {
		this.state[0] = seed >>> 0;
		for (let i = 1; i < 624; i++) {
			const prev = this.state[i - 1];
			this.state[i] = Math.imul(1812433253, prev ^ prev >>> 30) + i >>> 0;
		}
	}
	twist() {
		for (let i = 0; i < 624; i++) {
			const y = (this.state[i] & 2147483648 | this.state[(i + 1) % 624] & 2147483647) >>> 0;
			this.state[i] = (this.state[(i + 397) % 624] ^ y >>> 1 ^ (y & 1 ? 2567483615 : 0)) >>> 0;
		}
		this.index = 0;
	}
	/** The next 32-bit output. */
	next() {
		if (this.index >= 624) this.twist();
		let y = this.state[this.index++];
		y ^= y >>> 11;
		y ^= y << 7 & 2636928640;
		y ^= y << 15 & 4022730752;
		y ^= y >>> 18;
		return y >>> 0;
	}
};
/** numpy's randint(low, high) for the range it covers: the masked rejection on the next 32-bit output. */
var randintOf = (rng, low, high) => {
	const range = high - low - 1;
	let mask = range;
	for (const shift of [
		1,
		2,
		4,
		8,
		16
	]) mask |= mask >>> shift;
	for (;;) {
		const value = (rng.next() & mask) >>> 0;
		if (value <= range) return low + value;
	}
};
/** The weights of the QAOA page: np.random.seed(seed), then one np.random.randint(0, 500) / 100 per edge, in edge order. */
var numpyWeights = (count, seed = 11) => {
	const rng = new MersenneTwister(seed);
	return Array.from({ length: count }, () => randintOf(rng, 0, 500) / 100);
};
// src/quantum/algorithms.ts
/** The quantum Fourier transform, as the Cirq page builds it: a Hadamard on each qubit, then a controlled phase CZ**(1/2^k)
*  from each later qubit onto it. The page notes the output comes in reversed bit order unless swaps are added, so the swaps
*  that restore the standard order (qubit i with qubit n−1−i) follow. The result is the discrete Fourier transform. */
var qftOperations = (qubits) => {
	const ops = [];
	const n = qubits.length;
	for (let i = n - 1; i >= 0; i--) {
		ops.push(applied(H, qubits[i]));
		for (let j = i - 1; j >= 0; j--) ops.push(applied(powerOf(CZ, 1 / 2 ** (i - j)), qubits[j], qubits[i]));
	}
	for (let i = 0; i < Math.floor(n / 2); i++) ops.push(applied(SWAP, qubits[i], qubits[n - 1 - i]));
	return ops;
};
/** The inverse of a list of operations: the same operations in reverse order, each replaced by its adjoint. */
var inverseOperations = (ops) => [...ops].reverse().map((op) => op.kind === "gate" ? {
	...op,
	gate: adjointOf(op.gate)
} : op);
/** Phase estimation of U = Z**(2θ) on its eigenstate |1>, with n estimation qubits: Hadamards, controlled U^(2^k), the
*  inverse QFT, then a measurement of the estimation qubits under the key 'm'. The eigenphase is e^(2πiθ). */
var phaseEstimationCircuit = (theta, bits) => {
	const est = LineQubit.range(bits);
	const target = LineQubit.of(bits);
	const ops = [applied(X, target), ...est.map((q) => applied(H, q))];
	for (let k = 0; k < bits; k++) ops.push(applied(powerOf(CZ, 2 * theta * 2 ** k), est[k], target));
	ops.push(...inverseOperations(qftOperations(est)));
	return new Circuit().append(ops).append({
		kind: "measure",
		key: "m",
		qubits: est
	});
};
/** Grover's search on two qubits for the marked state |00>, as the Cirq page builds it: Hadamards, the oracle (an open-control
*  Toffoli onto an ancilla in |−>, which flips the phase of the marked state), and the diffusion. One iteration suffices for
*  two qubits, so the measured data qubits give |00> with certainty. */
var groverCircuit = () => {
	const [a, b, anc] = LineQubit.range(3);
	const ops = [
		applied(H, a),
		applied(H, b),
		applied(X, anc),
		applied(H, anc),
		applied(X, a),
		applied(X, b),
		applied(TOFFOLI, a, b, anc),
		applied(X, a),
		applied(X, b),
		applied(H, a),
		applied(H, b),
		applied(X, a),
		applied(X, b),
		applied(CZ, a, b),
		applied(X, a),
		applied(X, b),
		applied(H, a),
		applied(H, b)
	];
	return new Circuit().append(ops).append({
		kind: "measure",
		key: "result",
		qubits: [a, b]
	});
};
/** Teleportation, deferred-measurement form: the message qubit is prepared by X**0.25 as the page does, Alice and Bob share a
*  Bell pair, Alice entangles the message with her half and rotates the message, and the corrections are controlled by her
*  qubit and the message qubit. Bob's qubit then carries the message state. */
var teleportationCircuit = () => {
	const [msg, alice, bob] = LineQubit.range(3);
	return new Circuit().append([
		applied(powerOf(X, .25), msg),
		applied(H, alice),
		applied(CNOT, alice, bob),
		applied(CNOT, msg, alice),
		applied(H, msg),
		applied(CNOT, alice, bob),
		applied(CZ, msg, bob)
	]);
};
/** The message state teleportation sends, prepared on its own: X**0.25 on |0>. */
var messageCircuit = () => new Circuit().append(applied(powerOf(X, .25), LineQubit.of(0)));
/** The QAOA circuit the Cirq page builds at depth p = 1: a Hadamard on every node, the cost layer ZZ**(alpha·w) on every edge,
*  then the mixer X**beta on every node, then a measurement of every node. */
var qaoaCircuit = (graph, alpha, beta) => {
	const ops = graph.nodes.map((q) => applied(H, q));
	for (const e of graph.edges) ops.push(applied(powerOf(ZZ, alpha * e.weight), e.a, e.b));
	for (const q of graph.nodes) ops.push(applied(powerOf(X, beta), q));
	return new Circuit().append(ops).append({
		kind: "measure",
		key: "cut",
		qubits: graph.nodes
	});
};
/** The expected cut value of the QAOA state: Σ over basis states of the probability times the weight of the edges the
*  state's bits cut, where an edge is cut when its ends differ (the page's cost H_C = ½ Σ w (1 − Z_i Z_j)). */
var qaoaExpectedCut = (graph, alpha, beta) => {
	const circuit = qaoaCircuit(graph, alpha, beta);
	const { amplitudes, qubits } = new Simulator().simulate(circuit);
	const position = (q) => qubits.findIndex((r) => keyOf(r) === keyOf(q));
	let expected = 0;
	amplitudes.forEach(([re, im], k) => {
		const probability = re * re + im * im;
		if (probability === 0) return;
		for (const e of graph.edges) if ((k >> position(e.a) & 1) !== (k >> position(e.b) & 1)) expected += probability * e.weight;
	});
	return expected;
};
/** The page's instance: its device's first twelve qubits in sorted order, the device's couplers among them in networkx's edge
*  order (the lower node first, nodes and neighbours in sorted order), and the weights numpy draws under seed 11 for those edges. */
var pageInstance = (device, count = 12, seed = 11) => {
	const row = (q) => q.kind === "grid" ? q.row : 0;
	const col = (q) => q.kind === "grid" ? q.col : 0;
	const sorted = [...device.sites].sort((a, b) => row(a) - row(b) || col(a) - col(b));
	const nodes = sorted.slice(0, count);
	const index = new Map(sorted.map((q, i) => [keyOf(q), i]));
	const inside = new Set(nodes.map(keyOf));
	const pairs = device.couplers.filter(([a, b]) => inside.has(keyOf(a)) && inside.has(keyOf(b))).map(([a, b]) => index.get(keyOf(a)) < index.get(keyOf(b)) ? [a, b] : [b, a]).sort((x, y) => index.get(keyOf(x[0])) - index.get(keyOf(y[0])) || index.get(keyOf(x[1])) - index.get(keyOf(y[1])));
	const weights = numpyWeights(pairs.length, seed);
	return {
		nodes,
		edges: pairs.map(([a, b], i) => ({
			a,
			b,
			weight: weights[i]
		}))
	};
};
/** The page's estimate_cost, sampled as the page does it: shots bitstrings drawn from the QAOA state's probabilities by a seeded
*  generator, then for each edge the mean of (−1)^u · (−1)^v over the shots, weighted, and negated. Its expectation is
*  −Σ w⟨Z_u Z_v⟩ = 2·cut − W, the value the page maximizes. */
var qaoaEstimate = (graph, alpha, beta, shots = 2e4, seed = 11) => {
	const { amplitudes, qubits } = new Simulator().simulate(qaoaCircuit(graph, alpha, beta));
	const position = (q) => qubits.findIndex((r) => keyOf(r) === keyOf(q));
	const cumulative = [];
	let total = 0;
	for (const [re, im] of amplitudes) {
		total += re * re + im * im;
		cumulative.push(total);
	}
	let state = seed >>> 0;
	const draw = () => {
		state = Math.imul(state, 1664525) + 1013904223 >>> 0;
		return state / 2 ** 32 * total;
	};
	const sums = graph.edges.map(() => 0);
	for (let shot = 0; shot < shots; shot++) {
		const target = draw();
		let lo = 0;
		let hi = cumulative.length - 1;
		while (lo < hi) {
			const mid = lo + hi >> 1;
			if (cumulative[mid] < target) lo = mid + 1;
			else hi = mid;
		}
		graph.edges.forEach((e, i) => {
			const su = 1 - 2 * (lo >> position(e.a) & 1);
			const sv = 1 - 2 * (lo >> position(e.b) & 1);
			sums[i] += su * sv;
		});
	}
	let cost = 0;
	graph.edges.forEach((e, i) => {
		cost += sums[i] / shots * e.weight;
	});
	return -cost;
};
/** The page's sweep: alpha and beta each over gridSize points of [0, 2π) (the page's comment states the half-open interval),
*  scored by qaoaEstimate with the page's 20,000 shots, and the best chosen by argmax (the page's np.argmax). */
var qaoaSweep = (graph, gridSize = 5, shots = 2e4) => {
	const total = graph.edges.reduce((sum, e) => sum + e.weight, 0);
	const grid = Array.from({ length: gridSize }, (_, i) => 2 * Math.PI * i / gridSize);
	let best = {
		alpha: 0,
		beta: 0,
		value: -Infinity,
		expectedCut: 0
	};
	for (const alpha of grid) for (const beta of grid) {
		const value = qaoaEstimate(graph, alpha, beta, shots);
		if (value > best.value) best = {
			alpha,
			beta,
			value,
			expectedCut: (value + total) / 2
		};
	}
	return {
		grid,
		best,
		randomBaseline: total / 2
	};
};
/** A modular exponent by repeated squaring, for the small N of the demonstration. */
var modPow = (base, exponent, modulus) => {
	let result = 1 % modulus;
	let b = base % modulus;
	let e = exponent;
	while (e > 0) {
		if (e & 1) result = result * b % modulus;
		b = b * b % modulus;
		e >>= 1;
	}
	return result;
};
/** The controlled modular multiplication: on control 1 the work register |x> becomes |a·x mod N> (x < N; larger x are fixed),
*  on control 0 it is unchanged. Its matrix index is the control bit above the work bits, the work value in its natural bits. */
var modularGate = (a, N, n) => {
	const dim = 1 << n + 1;
	const matrix = Array.from({ length: dim * dim }, () => [0, 0]);
	const size = 1 << n;
	for (let x = 0; x < size; x++) {
		const image = x < N ? a * x % N : x;
		matrix[x * dim + x] = [1, 0];
		matrix[(size + image) * dim + (size + x)] = [1, 0];
	}
	return {
		name: `U${a}`,
		arity: n + 1,
		matrix
	};
};
/** Shor's order finding for N and a, by phase estimation of U|x> = |a·x mod N>: 2n counting qubits, where n is the bit length of
*  N, each controlling U^(2^k), an inverse QFT, and a measurement of the counting register under 'm'. The work register starts in |1>. */
var shorCircuit = (N, a) => {
	const n = Math.ceil(Math.log2(N + 1));
	const t = 2 * n;
	const counts = LineQubit.range(t);
	const work = LineQubit.range(n).map((_, j) => LineQubit.of(t + j));
	const ops = [applied(X, work[0]), ...counts.map((q) => applied(H, q))];
	for (let k = 0; k < t; k++) ops.push(applied(modularGate(modPow(a, 2 ** k, N), N, n), counts[k], ...[...work].reverse()));
	ops.push(...inverseOperations(qftOperations(counts)));
	return new Circuit().append(ops).append({
		kind: "measure",
		key: "m",
		qubits: counts
	});
};
/** The continued-fraction denominators of x, up to maxDenominator: the candidates for the order's fraction s/r. */
var denominatorsOf = (x, maxDenominator) => {
	const out = [];
	let [prev, last] = [0, 1];
	let v = x - Math.floor(x);
	for (let i = 0; i < 40 && v > 1e-12; i++) {
		v = 1 / v;
		const a = Math.floor(v);
		[prev, last] = [last, a * last + prev];
		if (last > maxDenominator) break;
		out.push(last);
		v -= a;
	}
	return out;
};
var gcd = (x, y) => y === 0 ? Math.abs(x) : gcd(y, x % y);
/** From the measured counting bitstrings, the order r of a mod N and the factors of N the order gives, if any. The string is
*  read least significant bit first, as the inverse QFT leaves it. */
var shorFactors = (N, a, bitstrings) => {
	const t = 2 * Math.ceil(Math.log2(N + 1));
	const estimates = bitstrings.map((b) => [...b].reduce((sum, bit, k) => sum + Number(bit) * 2 ** k, 0) / 2 ** t);
	for (const phi of estimates) for (const r of denominatorsOf(phi, N - 1)) {
		if (r < 2 || modPow(a, r, N) !== 1) continue;
		if (r % 2 === 1) return {
			order: r,
			factors: null,
			estimates
		};
		const half = modPow(a, r / 2, N);
		if (half === N - 1) return {
			order: r,
			factors: null,
			estimates
		};
		const factor = [gcd(half - 1, N), gcd(half + 1, N)].find((f) => f > 1 && f < N);
		if (factor !== void 0) return {
			order: r,
			factors: [Math.min(factor, N / factor), Math.max(factor, N / factor)],
			estimates
		};
	}
	return {
		order: null,
		factors: null,
		estimates
	};
};
// src/quantum/statements.ts
var STATEMENTS = {
	cirq: "Cirq is a Python software library for writing, manipulating, and optimizing quantum circuits.",
	definition: "Quantum computers use quantum physics to access different computational abilities from those of classical computers. A qubit can take the value of a complex combination of 0 and 1; a classical bit stores either 0 or 1.",
	progress: "Google has been working on quantum computing since 2014. In 2019 it demonstrated beyond-classical performance (Milestone 1); in 2023 it demonstrated scaling quantum error correction (Milestone 2).",
	responsibility: "Google aims to be honest and realistic about the progress and limitations of quantum computing. A fault-tolerant quantum computer could break RSA by factoring large primes. NIST has announced post-quantum tools to be standardized, one developed with Google's contributions.",
	vision: "Our vision is that one day, people will use classical computers as well as quantum computers to expand the boundaries of human knowledge and solve some of the world's most complex problems.",
	hardware: "Google Quantum AI's hardware focuses on superconducting qubits, which require specialized cryogenic environments and custom control electronics. It is built in the Santa Barbara facility.",
	early_access: "The Willow Early Access Program selects a cohort of research partners for exclusive access to Willow, which is not yet available to the public. The submission deadline is May 15, 2026.",
	neutral_atoms: "Google is expanding its quantum computing effort to include neutral atom quantum computing, which uses individual atoms as qubits. The page gives no Google device figures for it.",
	sycamore_gates: "Sycamore accepts two two-qubit gates: cirq.ISWAP**0.5 and cirq.ISWAP**-0.5, with a duration of 32 ns; and the Sycamore gate, equivalent to FSimGate(π/2, π/6), with a duration of 12 ns. The page states one-qubit rotations take 25 ns on most Google devices.",
	echoes_preprint: "Constructive interference at the edge of quantum ergodic dynamics (arXiv 2506.10191; published in Nature as \"Observation of constructive interference at the edge of quantum ergodicity\"). A 103-qubit superconducting processor measures second-order out-of-time-order correlators, OTOC(2). OTOC(2) is dominated by constructive interference between Pauli strings that form large loops in configuration space. The abstract states no quantitative speedup.",
	campus: "Google Quantum AI's Santa Barbara campus is the headquarters for its quantum data center, quantum hardware research labs and processor fabrication facility. The lab page states no dates, sizes, staff counts or budgets.",
	campus_announcement: "Announced May 18, 2021: the campus includes the first quantum data center, quantum hardware research laboratories and quantum processor chip fabrication facilities. The target is 1,000,000 physical qubits in a room-sized error-corrected quantum computer, with 1,000 physical qubits per logical qubit, against fewer than 100 qubits in systems of the time. Cryostats reach about 10 millikelvin.",
	qsim: "qsim is a fast C++ and Python state-vector simulator for quantum circuits. It stores the state as a vector of complex amplitudes, uses gate fusion, single precision and vector instructions, and includes a Cirq interface (qsimcirq). It is Apache-2.0 licensed. The repository states no qubit or memory limits.",
	qualtran: "Qualtran is a Python library for expressing and analyzing fault-tolerant quantum algorithms: a set of abstractions for quantum programs, with bloqs as its named abstraction. It is an experimental preview with no backward-compatibility guarantees, and it requires Python 3.12 or later.",
	openfermion: "OpenFermion is an open-source Python package for compiling and analyzing quantum algorithms to simulate fermionic systems, including quantum chemistry. It provides data structures for fermionic and qubit Hamiltonians, with electronic-structure plugins for Psi4, PySCF, DIRAC and Q-Chem, and OpenFermion-FQE as a high-performance emulator of fermionic evolutions.",
	cirq_known_devices: "Cirq's known_devices source defines Sycamore as a grid of 54 qubits and Sycamore23 as its 23-qubit subset. Couplers are not listed; they are computed from the grid's neighbours. Willow's device is loaded from the engine for the processor id willow_pink.",
	pauli_observables: "Cirq's Pauli observables: X, Y, Z and I; PauliString (products, identity factors dropped); PauliSum (weighted sums with +); PauliStringPhasor and PauliSumExponential (exponentials of Pauli terms); measure_single_paulistring (0 if the qubits are in an eigenstate of the observable, 1 if not); PauliSumCollector and measure_observables (means and variances of observables, with readout calibration and symmetrization options).",
	noise_representation: "Cirq represents noise three ways: as channels (bit_flip, amplitude_damp, generalized_amplitude_damp, phase_flip, phase_damp, depolarize, asymmetric_depolarize, with MixedUnitaryChannel and KrausChannel for custom ones); as NoiseModels applied to whole circuits (ConstantQubitNoiseModel, InsertionNoiseModel); and as measurement error on MeasurementGate (invert_mask and confusion_map).",
	histograms: "result.histogram(key, fold_func) counts measurement outcomes, with fold_func mapping each result to a countable value such as the parity of its 1s; cirq.plot_state_histogram plots a result or a histogram with a title, axis labels and tick labels. Counts omit unobserved states.",
	transformers: "Cirq's transformers (cirq.transformers) take a circuit and return one: align_left and align_right, defer_measurements, drop_empty_moments, drop_negligible_operations, eject_phased_paulis, eject_z, expand_composite, merge_k_qubit_unitaries, optimize_for_target_gateset, stratified_circuit, synchronize_terminal_measurements. A TransformerContext holds tags_to_ignore, deep and a logger. Targets are gatesets such as CZTargetGateset and SqrtIswapTargetGateset.",
	custom_transformers: "A Cirq transformer is any callable taking a circuit and an optional keyword context. Write one with @cirq.transformer, which adds step logging and, with add_deep_support=True, recursion into CircuitOperations when deep=True. The primitives map_operations, map_moments, merge_operations and merge_moments keep moment structure. Decomposition covers one-, two- and three-qubit unitaries analytically, and arbitrary two-qubit targets by two_qubit_gate_product_tabulation.",
	kpz_experiment: "The KPZ tutorial simulates a 1D Floquet XXZ chain at the Heisenberg point (θ = 0.4π, φ = 0.8π, μ = 0.5, 1000 initial states) with 2 × cycles qubits; the paper used 46 qubits to cycle 23. At t = 2 the sampled mean is 1.56 ± 0.04 and the variance 2.7 ± 0.1. The paper says the mean and variance agree with KPZ scaling, but the higher moments appear inconsistent with it.",
	echoes_tutorial: "The Loschmidt echo tutorial: apply U, then U†, and measure the probability p(0) of returning to the ground state; an exponential fit gives an error per cycle for each qubit set. U is random PhasedX(0.5) rotations alternating with FSim(π/4, 0) gates in a staggered grid. On the processor weber, four 2×2 plaquette layouts give 4.85%, 7.35%, 5.87% and 6.0% error per cycle; the lowest is chosen.",
	qcqmc: "The QC-QMC H4 example (square geometry at 1.23 spacing, STO-3G, 4 orbitals, 4 electrons): a perfect-pairing+ trial wavefunction, 100 Clifford circuits with 31 samples each, shadow reconstruction, and ipie AFQMC (300 blocks, 50 walkers, seed 7). The stated energies are FCI −1.96951 Ha, optimized ansatz −1.93662 Ha, Hartree-Fock −1.77924 Ha and reconstructed −1.87712 Ha. The page says these are worse than the paper's.",
	hfvqe: "The HFVQE quickstart (ReCirq) runs restricted Hartree-Fock with a basis-rotation ansatz on a six-qubit molecule (make_h6_1_3), with 250,000 shots per circuit. RHF converges to about −2.92406, against a canonical −2.9240605. The purified energy is −2.924055 ± 0.0000063 at fidelity 0.99999.",
	hardware_changes: "Hardware drift can make results differ from the last calibration, so the page measures current error rates. Two experiments on a Google superconducting processor, limited to qubits with row and column below 10: parallel XEB for two-qubit Pauli errors and simultaneous readout for P11 errors, with 2,000 repetitions per circuit and 20 random two-qubit circuits at cycle depths 3, 23, 43, 63 and 83. Pairs (8,4) and (9,4) show high error, and readout error is high near the edges.",
	google_concepts: "Google's quantum engine concepts: a program is a hardware-ready circuit named <project>/programs/<id>; a job is a run of a program on a processor, limited outside reservations to 5 minutes and 1,500,000 shots; a processor such as willow_pink (in Santa Barbara) is online, offline or in maintenance; a result belongs to a job; calibration metrics are recorded periodically; sweeps map parameters to values; reservations are OPEN_SWIM, MAINTENANCE, RESERVATION or UNALLOCATED.",
	qsim_hardware: "qsim hardware guidance: on a laptop with 8 GB of RAM, noiseless runs under 29 qubits and noisy runs under 18, which the page calls not technical limits. Memory is about 8 × 2^N bytes. A 40 GB A100 handles 32 noiseless qubits, and eight 80 GB A100s reach 36. Noiseless runtime grows as 2^N and noisy runtime as 2^N times the iterations. NumPy 1.x caps Python state vectors at 32 qubits, and NumPy 2.x raises the limit.",
	openfermion_projects: "OpenFermion plugins: OpenFermion-Psi4, OpenFermion-PySCF, OpenFermion-Dirac, Forest-OpenFermion (Rigetti), pennylane.qchem (Xanadu), SFOpenBoson (Strawberry Fields), and OpenFermion-ProjectQ, which is no longer actively developed. Projects: a quantum autoencoder that won a Rigetti hackathon, and a CUSP implementation of compressed unsupervised state preparation.",
	cirq_basics: "The Cirq basics tutorial: NamedQubit, LineQubit and GridQubit; a cirq.Device enforces constraints such as two-qubit gates only on adjacent qubits, using cirq_google.Sycamore (a 54-qubit diamond grid) as its example; gates and operations; Circuit.append with an InsertStrategy; Simulator.simulate and run, up to about 20 qubits; Result.histogram; sweeps (Points, Linspace, ListSweep, Zip, Product); unitary and decompose; and merge_single_qubit_gates_to_phxz.",
	qsimcirq: "qsimcirq is the Python interface from qsim to Cirq: QSimSimulator implements Cirq's simulator interfaces, with simulate, run and compute_amplitudes, and options passed as a dict (t for threads, f for the fusion size). A depth-16 random circuit on a 4 by 5 grid runs in 1.8065 s with Cirq's simulate, 0.1092 s with qsim, 0.0775 s with t=8, and 0.1102 s with f=3, as single runs on unstated hardware. qsim and Cirq use different random generators.",
	basis_change: "The OpenFermion basis-change tutorial compiles a circuit for an arbitrary single-particle basis rotation and checks it on exact evolution under a random one-body Hamiltonian at t = 1, on three qubits: the inverse basis rotation, Z rotations by each negative eigenvalue times t, then the basis restored. Its fidelity is about 1.00000009, and the page exports the compiled circuit as OpenQASM 2.0 with the CZ gate set.",
	sitemap: "quantumai.google's sitemap is an index naming one child sitemap, sitemap_0_of_1.xml, of 1,120,891 characters, read whole on 2026-10-25: 2,491 pages, of which 2,279 are reference pages (794 cirq, 560 cirq_google, 521 openfermion, 157 fqe, 102 qsim C++, 42 cirq_ionq, 41 qsimcirq, 24 cirq_aqt, 21 cirq_web, 17 cirq_pasqal), 146 Cirq guide pages, 23 qsim pages, 18 OpenFermion pages, and the site pages. Every page is a lead in the leads tool. The paths learn and research/publications are not in it and return 404; learn/map, learn/lab and research are in it.",
	resources: "The Educational Resources page (quantumai.google/resources) lists: a free Coursera course on quantum error correction, for everyone from curious undergrads to seasoned software engineers, with hands-on experience of Stim and Crumble (coursera.org/learn/quantum-error-correction, and a developers.googleblog.com post); the What is Quantum Computing? whitepaper; a tour of the Google Quantum AI lab, from space down to the campus and into the cryostat; educational videos on programming quantum computers, scientific breakthroughs and new tools (youtube.com/c/QuantumAI); the journey to error correction through the NISQ era (learn/map); and the Qubit Game.",
	qubit_game: "The Qubit Game (quantumai.google/education/thequbitgame): \"Build a quantum computer, one qubit at a time.\" The Resources page adds: earn points by solving the same challenges quantum engineers face, from keeping qubits cool to blocking cosmic rays. The game itself is a browser application, not text.",
	lab_tour: "Discover the Quantum AI campus (quantumai.google/learn/lab): Santa Barbara is home to Google's Quantum AI campus, bringing together its quantum data center, fabrication facility and research; the page offers a virtual walk through the headquarters. The tour is a browser application, not text.",
	learn_map: "Our quantum computing journey (quantumai.google/learn/map): \"A useful, error-corrected quantum computer is within reach for humanity. There's still a lot of work to do, but we think we might be able to accomplish our goal within the decade.\" The page is a frame around an interactive map served from dreamcoat-guggenheim.uc.r.appspot.com; its text is not in the fetched HTML.",
	research: "Research Publications (quantumai.google/research): the page exists (HTTP 200 on 2026-10-25) with the title Research Publications and the site's standard description; its publication list is rendered by script and is not in the fetched HTML. The path research/publications returns 404.",
	qec_milestone: "Our quantum error correction milestone (quantumai.google/qecmilestone, Milestone 2): the first demonstration of a logical qubit prototype, showing that it is possible to reduce errors by increasing the number of qubits in a scheme known as quantum error correction. The page links the Keyword blog, the Google AI blog recap, and the Nature paper \"Suppressing quantum errors by scaling a surface code logical qubit\", and states that Google is currently building one logical qubit that it will scale in the future.",
	weber_datasheet: "The Quantum Computer Datasheet (quantumai.google/hardware/datasheet/weber.pdf, published May 14, 2021): the Weber processor, Sycamore family, 53 qubits in its grid (the family has up to 54, in a square lattice); gates: Phased XZ 25 ns, virtual Z 0 ns, physical Z 20 ns, Sycamore 12 ns, √iSWAP 32 ns, CZ in development; readout 1 μs integration plus 3 μs ringdown; repetition rate 1 to 5 kHz typically, up to 15 kHz; latency 1.6 to 2.8 s. Typical (median) errors, Jan to Mar 2021: single-qubit 0.1% (RB), two-qubit √iSWAP 0.9% isolated and 1.4% parallel (XEB), readout 1.1% for |0⟩ and 5% for |1⟩ isolated, 2% and 7% simultaneous; T1 15 μs typical (11 low, 21 high).",
	full_stack: "The Quantum Computer page (quantumai.google/quantumcomputer): \"Our focus encompasses the seamless integration of hardware and software components, from quantum processors, control and decoding hardware and cryostats to the operating system and user-facing software.\" Google takes a full-system approach: from chip architecture and gate development to fabrication and calibration, error correction informs every step. Its tunable qubits and couplers allow it to dynamically adjust performance and optimize for faster gates and operations. It develops the calibration and error correction software to manage the entire quantum system, and offers Cirq for writing circuits for near-term quantum computers. Willow was built in the Santa Barbara facility.",
	aps_summit: "Google Quantum AI's event pages for the American Physical Society's Global Physics Summit (quantumai.google/apsglobalphysics for 2026, apsglobalphysics2026 for 2025): a conference convening 14,000 physicists and students; Google's sessions and talks, an exhibit booth (#1504 in 2026), an interest form, student programs, and in 2026 the announcement of the Willow Early Access Program."
};
/** The five open-source tools the Software page names, as it describes them. Only Cirq is implemented in this repository. */
var SOFTWARE = [
	{
		name: "Cirq",
		description: "an open-source quantum framework for building and experimenting with NISQ algorithms on near-term processors",
		implemented: true
	},
	{
		name: "qsim",
		description: "a fast quantum circuit simulator that integrates with Cirq and runs quantum simulations on high-performance classical hardware",
		implemented: false
	},
	{
		name: "Qualtran",
		description: "a set of abstractions for representing quantum programs, and a library of quantum algorithms for quantum algorithms research",
		implemented: false
	},
	{
		name: "OpenFermion",
		description: "an open-source library for translating chemistry and materials science problems into quantum circuits that run on existing platforms",
		implemented: false
	},
	{
		name: "TensorFlow Quantum",
		description: "a quantum machine learning library for rapidly prototyping hybrid quantum-classical machine learning models within TensorFlow",
		implemented: false
	}
];
// src/quantum/repositories.ts
var REPOSITORIES = [
	{
		name: "Cirq",
		description: "Python framework for creating, editing, and running Noisy Intermediate-Scale Quantum (NISQ) circuits.",
		language: "Python"
	},
	{
		name: "Stim",
		description: "A fast stabilizer circuit library.",
		language: "C++"
	},
	{
		name: "chromobius",
		description: "Open-source implementation of a Möbius decoder for color codes used in quantum error correction (QEC)",
		language: "Python"
	},
	{
		name: "Qualtran",
		description: "Qᴜᴀʟᴛʀᴀɴ is a Python library for expressing and analyzing Fault Tolerant Quantum algorithms.",
		language: "Python"
	},
	{
		name: "tesseract-decoder",
		description: "Search-based decoder for quantum error correction (QEC) written in C++ and Python.",
		language: "C++"
	},
	{
		name: "OpenFermion-PySCF",
		description: "OpenFermion plugin to interface with the electronic structure package PySCF.",
		language: "Python"
	},
	{
		name: "OpenFermion-FQE",
		description: "The Fermionic Quantum Emulator (FQE) is a fermionic simulation research tool specializing in quantum circuits.",
		language: "Python"
	},
	{
		name: "qsim",
		description: "Fast C++ and Python library for state-vector simulation of quantum circuits.",
		language: "C++"
	},
	{
		name: "OpenFermion",
		description: "Python package for compiling and analyzing quantum algorithms to simulate electronic structures.",
		language: "Python"
	},
	{
		name: "unitary",
		description: "Open-source API library providing common operations for adding quantum behaviors to games.",
		language: "OpenQASM"
	},
	{
		name: "ReCirq",
		description: "Python modules for quantum computing applications and experiments using Cirq. Research using Cirq!",
		language: "Python"
	},
	{
		name: "TypedUnits",
		description: "A fast units and dimensions library with support for static dimensionality checking and protobuffer serialization.",
		language: "Python"
	},
	{
		name: "OpenFermion-Psi4",
		description: "OpenFermion plugin to interface with the electronic structure package Psi4.",
		language: "Python"
	},
	{
		name: "qchack-2021-challenge",
		description: "The <G|oogl|e> challenge for Quantum Coalition Hackathon 2021",
		language: "Python"
	},
	{
		name: "OpenFermion-Cirq",
		description: "Quantum circuits for simulations of quantum chemistry and materials.",
		language: "Python"
	}
];
// src/quantum/chemistry.ts
/** The STO-3G hydrogen 1s function: three primitive Gaussians, exponents and contraction coefficients as Hehre, Stewart and
*  Pople fit them (J. Chem. Phys. 51, 2657 (1969)), with the exponents scaled for hydrogen (ζ = 1.24), as the basis set is
*  distributed. */
var STO3G_H = {
	exponents: [
		3.42525091,
		.62391373,
		.1688554
	],
	coefficients: [
		.15432897,
		.53532814,
		.44463454
	],
	source: "Hehre, Stewart, Pople, J. Chem. Phys. 51, 2657 (1969); STO-3G hydrogen as distributed"
};
/** The Bohr radius OpenFermion's data used, in ångström, recovered from the tutorial's printed nuclear repulsion at 0.7 Å
*  (0.7559674408428572 Ha = 1 / (0.7 Å / a₀)): 0.52917720859 Å, the CODATA 2006 value. */
var BOHR_ANGSTROM = .52917720859;
/** The energies the OpenFermion tutorial prints for H₂ (STO-3G, singlet) at two bond lengths, as stated there. */
var TUTORIAL_ENERGIES = {
	source: "quantumai.google/openfermion/tutorials/intro_to_openfermion, the printed energies of molecular hydrogen",
	bondLengthDefault: .7414,
	points: [{
		bondLength: .7,
		hartreeFock: -1.1173490350703141,
		mp2: -1.1295815518324286,
		fci: -1.1361894542708848,
		nuclearRepulsion: .7559674408428572,
		orbitalEnergies: [-.5954634716745077, .7141652810054977]
	}, {
		bondLength: .8,
		hartreeFock: -1.1108503969854677,
		mp2: -1.125453091983669,
		fci: -1.1341476663578605,
		nuclearRepulsion: .6614715107375,
		orbitalEnergies: [-.5544958797639515, .6126180834930599]
	}]
};
/** The error function: its Taylor series up to 2.5, and the continued fraction of erfc beyond, each to double precision. */
var erf = (x) => {
	const ax = Math.abs(x);
	if (ax <= 2.5) {
		let term = ax;
		let sum = ax;
		for (let n = 1; n < 200; n++) {
			term *= -ax * ax / n;
			const next = term / (2 * n + 1);
			sum += next;
			if (Math.abs(next) < 1e-17 * Math.abs(sum)) break;
		}
		return Math.sign(x) * (2 / Math.sqrt(Math.PI)) * sum;
	}
	let f = ax;
	for (let n = 80; n >= 1; n--) f = ax + n / 2 / f;
	const erfc = Math.exp(-ax * ax) / Math.sqrt(Math.PI) / f;
	return Math.sign(x) * (1 - erfc);
};
/** The Boys function of order zero, F₀(t) = ½√(π/t)·erf(√t), with its series at small t. */
var boys0 = (t) => t < 1e-10 ? 1 - t / 3 : .5 * Math.sqrt(Math.PI / t) * erf(Math.sqrt(t));
var dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
var centre = (alpha, a, beta, b) => {
	const p = alpha + beta;
	return [
		(alpha * a[0] + beta * b[0]) / p,
		(alpha * a[1] + beta * b[1]) / p,
		(alpha * a[2] + beta * b[2]) / p
	];
};
/** The normalization of a primitive s Gaussian exp(−α r²): (2α/π)^{3/4}. */
var norm = (alpha) => (2 * alpha / Math.PI) ** .75;
/** The overlap of two primitives. */
var overlapP = (a, A, b, B) => {
	const p = a + b;
	return norm(a) * norm(b) * (Math.PI / p) ** 1.5 * Math.exp(-a * b / p * dist2(A, B));
};
/** The kinetic energy integral of two primitives. */
var kineticP = (a, A, b, B) => {
	const p = a + b;
	const ab = a * b / p;
	return norm(a) * norm(b) * ab * (3 - 2 * ab * dist2(A, B)) * (Math.PI / p) ** 1.5 * Math.exp(-ab * dist2(A, B));
};
/** The attraction of two primitives to a nucleus of charge Z at C. */
var nuclearP = (a, A, b, B, C, Z) => {
	const p = a + b;
	const P = centre(a, A, b, B);
	return norm(a) * norm(b) * (-2 * Math.PI / p) * Z * Math.exp(-a * b / p * dist2(A, B)) * boys0(p * dist2(P, C));
};
/** The two-electron repulsion (ab|cd) of four primitives, in chemist's notation. */
var repulsionP = (a, A, b, B, c, C, d, D) => {
	const p = a + b;
	const q = c + d;
	const P = centre(a, A, b, B);
	const Q = centre(c, C, d, D);
	return norm(a) * norm(b) * norm(c) * norm(d) * (2 * Math.PI ** 2.5) / (p * q * Math.sqrt(p + q)) * Math.exp(-a * b / p * dist2(A, B) - c * d / q * dist2(C, D)) * boys0(p * q / (p + q) * dist2(P, Q));
};
var contract2 = (x, y, f) => {
	let sum = 0;
	for (const i of x.primitives) for (const j of y.primitives) sum += i.d * j.d * f(i.alpha, x.centre, j.alpha, y.centre);
	return sum;
};
var contract4 = (w, x, y, z) => {
	let sum = 0;
	for (const i of w.primitives) for (const j of x.primitives) for (const k of y.primitives) for (const l of z.primitives) sum += i.d * j.d * k.d * l.d * repulsionP(i.alpha, w.centre, j.alpha, x.centre, k.alpha, y.centre, l.alpha, z.centre);
	return sum;
};
var hydrogen = (bondLength = TUTORIAL_ENERGIES.bondLengthDefault) => {
	if (!(bondLength > 0)) throw new Error("the bond length is a positive distance in ångström");
	const R = bondLength / BOHR_ANGSTROM;
	const A = [
		0,
		0,
		0
	];
	const B = [
		0,
		0,
		R
	];
	const primitives = STO3G_H.exponents.map((alpha, i) => ({
		alpha,
		d: STO3G_H.coefficients[i]
	}));
	const raw = (c) => ({
		centre: c,
		primitives
	});
	const normalized = (c) => {
		const r = raw(c);
		const s = contract2(r, r, overlapP);
		return {
			centre: c,
			primitives: primitives.map((p) => ({
				alpha: p.alpha,
				d: p.d / Math.sqrt(s)
			}))
		};
	};
	const chi = [normalized(A), normalized(B)];
	const S = chi.map((x) => chi.map((y) => contract2(x, y, overlapP)));
	const Hcore = chi.map((x) => chi.map((y) => contract2(x, y, kineticP) + contract2(x, y, (a, Ac, b, Bc) => nuclearP(a, Ac, b, Bc, A, 1) + nuclearP(a, Ac, b, Bc, B, 1))));
	const eri = chi.map((w) => chi.map((x) => chi.map((y) => chi.map((z) => contract4(w, x, y, z)))));
	const sAB = S[0][1];
	const C = [[1 / Math.sqrt(2 * (1 + sAB)), 1 / Math.sqrt(2 * (1 + sAB))], [1 / Math.sqrt(2 * (1 - sAB)), -1 / Math.sqrt(2 * (1 - sAB))]];
	const h1 = (p, q) => {
		let sum = 0;
		for (let m = 0; m < 2; m++) for (let n = 0; n < 2; n++) sum += C[p][m] * C[q][n] * Hcore[m][n];
		return sum;
	};
	const h2 = (p, q, r, s) => {
		let sum = 0;
		for (let m = 0; m < 2; m++) for (let n = 0; n < 2; n++) for (let l = 0; l < 2; l++) for (let k = 0; k < 2; k++) sum += C[p][m] * C[q][n] * C[r][l] * C[s][k] * eri[m][n][l][k];
		return sum;
	};
	const [g, u] = [0, 1];
	const hgg = h1(g, g), huu = h1(u, u);
	const gggg = h2(g, g, g, g), uuuu = h2(u, u, u, u), gguu = h2(g, g, u, u), gugu = h2(g, u, g, u);
	const nuclearRepulsion = 1 / R;
	const epsG = hgg + gggg;
	const epsU = huu + 2 * gguu - gugu;
	const hartreeFock = 2 * hgg + gggg + nuclearRepulsion;
	const mp2 = hartreeFock - gugu * gugu / (2 * (epsU - epsG));
	const e00 = 2 * hgg + gggg;
	const e11 = 2 * huu + uuuu;
	const fci = (e00 + e11) / 2 - Math.sqrt(((e00 - e11) / 2) ** 2 + gugu * gugu) + nuclearRepulsion;
	return {
		bondLength,
		nuclearRepulsion,
		overlapAB: sAB,
		h: {
			gg: hgg,
			uu: huu
		},
		eri: {
			gggg,
			uuuu,
			gguu,
			gugu
		},
		orbitalEnergies: [epsG, epsU],
		hartreeFock,
		mp2,
		fci
	};
};
/** The two-qubit Hamiltonian of H₂ in the two-electron S_z = 0 sector: qubit line:0 says which orbital the spin-up electron
*  occupies (|0⟩ = g, |1⟩ = u) and line:1 the same for spin-down. The 4 × 4 matrix elements follow the Slater-Condon rules for
*  opposite-spin determinants, ⟨ab|H|cd⟩ = h_ac δ_bd + h_bd δ_ac + (ac|bd), and the operator is decomposed in the Pauli basis as
*  c_P = Tr(P·H)/4. The nuclear repulsion is in the identity term. */
var hydrogenHamiltonian = (molecule) => {
	const { h, eri, nuclearRepulsion } = molecule;
	const H = [
		[
			2 * h.gg + eri.gggg + nuclearRepulsion,
			0,
			0,
			eri.gugu
		],
		[
			0,
			h.gg + h.uu + eri.gguu + nuclearRepulsion,
			eri.gugu,
			0
		],
		[
			0,
			eri.gugu,
			h.gg + h.uu + eri.gguu + nuclearRepulsion,
			0
		],
		[
			eri.gugu,
			0,
			0,
			2 * h.uu + eri.uuuu + nuclearRepulsion
		]
	];
	const single = {
		I: [[[1, 0], [0, 0]], [[0, 0], [1, 0]]],
		X: [[[0, 0], [1, 0]], [[1, 0], [0, 0]]],
		Y: [[[0, 0], [0, -1]], [[0, 1], [0, 0]]],
		Z: [[[1, 0], [0, 0]], [[0, 0], [-1, 0]]]
	};
	const terms = [];
	for (const p0 of [
		"I",
		"X",
		"Y",
		"Z"
	]) for (const p1 of [
		"I",
		"X",
		"Y",
		"Z"
	]) {
		let re = 0;
		let im = 0;
		for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
			const [a0, b0] = single[p0][j & 1][i & 1];
			const [a1, b1] = single[p1][j >> 1][i >> 1];
			re += (a0 * a1 - b0 * b1) * H[i][j];
			im += (a0 * b1 + b0 * a1) * H[i][j];
		}
		if (Math.abs(im) > 1e-12) throw new Error("the Hamiltonian is Hermitian, so every Pauli coefficient is real");
		const coefficient = re / 4;
		if (Math.abs(coefficient) < 1e-12) continue;
		const paulis = {};
		if (p0 !== "I") paulis["line:0"] = p0;
		if (p1 !== "I") paulis["line:1"] = p1;
		terms.push({
			coefficient,
			paulis,
			label: `${p0}${p1}` === "II" ? "I" : `${p0 === "I" ? "" : p0 + "0"}${p1 === "I" ? "" : p1 + "1"}`
		});
	}
	return terms;
};
/** The ansatz circuit: the Hartree-Fock state |gg⟩ = |00⟩ rotated by exp(−iθ Y⊗X), which takes it to cos θ|00⟩ + sin θ|11⟩, the
*  double excitation the singlet ground state needs (the single excitations do not mix in by symmetry). */
var ansatzCircuit = (theta) => {
	const [q0, q1] = LineQubit.range(2);
	return new Circuit([applied(exponentialOf(pauliProduct(["Y", "X"]), theta), q0, q1)]);
};
/** The energy of the ansatz at θ: the Pauli terms' expectation values on the simulated density matrix, summed. */
var energyAt = (terms, theta) => {
	const state = new DensityMatrixSimulator().simulate(ansatzCircuit(theta));
	return terms.reduce((sum, t) => sum + t.coefficient * expectationOf(state, t.paulis), 0);
};
/** The VQE sweep: θ over a grid of [−π/2, π/2), each energy from the simulator, then a golden-section search between the
*  neighbours of the best grid point, also by simulated energies, to the tolerance given. */
var vqeSweep = (terms, steps = 180, tolerance = 1e-12) => {
	if (!Number.isInteger(steps) || steps < 4) throw new Error("the sweep needs at least 4 steps");
	let evaluations = 0;
	const at = (theta) => {
		evaluations += 1;
		return energyAt(terms, theta);
	};
	const grid = Array.from({ length: steps }, (_, i) => {
		const theta = -Math.PI / 2 + Math.PI * i / steps;
		return {
			theta,
			energy: at(theta)
		};
	});
	let bestIndex = 0;
	grid.forEach((g, i) => {
		if (g.energy < grid[bestIndex].energy) bestIndex = i;
	});
	const step = Math.PI / steps;
	let lo = grid[bestIndex].theta - step;
	let hi = grid[bestIndex].theta + step;
	const phi = (Math.sqrt(5) - 1) / 2;
	let x1 = hi - phi * (hi - lo);
	let x2 = lo + phi * (hi - lo);
	let f1 = at(x1);
	let f2 = at(x2);
	while (hi - lo > tolerance) if (f1 < f2) {
		hi = x2;
		x2 = x1;
		f2 = f1;
		x1 = hi - phi * (hi - lo);
		f1 = at(x1);
	} else {
		lo = x1;
		x1 = x2;
		f1 = f2;
		x2 = lo + phi * (hi - lo);
		f2 = at(x2);
	}
	const theta = (lo + hi) / 2;
	return {
		grid,
		best: {
			theta,
			energy: at(theta)
		},
		evaluations
	};
};
/** The computed figures against the tutorial's printed ones, at the bond lengths it prints: each a stated value, the value the
*  integrals here give, and their difference. */
var tutorialChecks = () => TUTORIAL_ENERGIES.points.flatMap((point) => {
	const m = hydrogen(point.bondLength);
	return [
		[
			"nuclear repulsion",
			point.nuclearRepulsion,
			m.nuclearRepulsion
		],
		[
			"Hartree-Fock",
			point.hartreeFock,
			m.hartreeFock
		],
		[
			"MP2",
			point.mp2,
			m.mp2
		],
		[
			"FCI",
			point.fci,
			m.fci
		],
		[
			"orbital energy g",
			point.orbitalEnergies[0],
			m.orbitalEnergies[0]
		],
		[
			"orbital energy u",
			point.orbitalEnergies[1],
			m.orbitalEnergies[1]
		]
	].map(([figure, stated, computed]) => ({
		bondLength: point.bondLength,
		figure,
		stated,
		computed,
		difference: computed - stated
	}));
});
// src/quantum/counting.ts
var mul = (a, b, dim) => {
	const out = Array.from({ length: dim * dim }, () => [0, 0]);
	for (let r = 0; r < dim; r++) for (let k = 0; k < dim; k++) {
		const [ar, ai] = a[r * dim + k];
		if (ar === 0 && ai === 0) continue;
		for (let s = 0; s < dim; s++) {
			const [br, bi] = b[k * dim + s];
			const o = out[r * dim + s];
			o[0] += ar * br - ai * bi;
			o[1] += ar * bi + ai * br;
		}
	}
	return out;
};
var dagger = (a, dim) => {
	const out = [];
	for (let r = 0; r < dim; r++) for (let s = 0; s < dim; s++) out.push([a[s * dim + r][0], -a[s * dim + r][1]]);
	return out;
};
/** Every Pauli string on n qubits except the identity, as gates. */
var pauliStrings = (n) => {
	const letters = [
		"I",
		"X",
		"Y",
		"Z"
	];
	const out = [];
	for (let k = 1; k < 4 ** n; k++) {
		const word = [];
		for (let i = 0, rest = k; i < n; i++, rest = Math.floor(rest / 4)) word.push(letters[rest % 4]);
		out.push(pauliProduct(word));
	}
	return out;
};
/** Whether a gate is Clifford: U P U† is a Pauli string up to a phase for every Pauli string P. Each conjugate is expanded in
*  the Pauli basis, Tr(Q·M)/dim, and must have exactly one coefficient of modulus 1. Computed from the unitary. */
var isClifford = (gate) => {
	if (gate.arity > 3) throw new Error(`Cliffordness is computed up to 3 qubits, not ${gate.arity}`);
	const dim = 1 << gate.arity;
	const u = gate.matrix;
	const ud = dagger(u, dim);
	const paulis = pauliStrings(gate.arity);
	for (const p of paulis) {
		const m = mul(mul(u, p.matrix, dim), ud, dim);
		let unit = 0;
		for (const q of paulis) {
			let re = 0;
			let im = 0;
			for (let r = 0; r < dim; r++) for (let s = 0; s < dim; s++) {
				const [qr, qi] = q.matrix[r * dim + s];
				const [mr, mi] = m[s * dim + r];
				re += qr * mr - qi * mi;
				im += qr * mi + qi * mr;
			}
			const modulus = Math.hypot(re, im) / dim;
			if (modulus > 1e-9 && Math.abs(modulus - 1) > 1e-9) return false;
			if (Math.abs(modulus - 1) <= 1e-9) unit += 1;
		}
		if (unit !== 1) return false;
	}
	return true;
};
/** The base and exponent of a power gate from its name, G**t with an optional adjoint mark; null for any other name. */
var powerOfName = (name) => {
	const adjoint = name.endsWith("†");
	const core = adjoint ? name.slice(0, -1) : name;
	const at = core.indexOf("**");
	if (at < 0) return null;
	const t = Number(core.slice(at + 2));
	return Number.isFinite(t) ? {
		base: core.slice(0, at),
		t: adjoint ? -t : t
	} : null;
};
/** t reduced to [0, 2): the power of an involution repeats with period 2. */
var period = (t) => (t % 2 + 2) % 2;
var near = (a, b) => Math.abs(a - b) < 1e-9;
var classify = (gate) => {
	if (gate.arity > 3) return { kind: "undecomposed" };
	if (isClifford(gate)) return { kind: "clifford" };
	if (gate.name === "TOFFOLI") return {
		kind: "toffoli",
		tCount: 7
	};
	const power = powerOfName(gate.name);
	if (power) {
		const t = period(power.t);
		if ((gate.arity === 1 || power.base === "ZZ") && (near(t, .25) || near(t, .75) || near(t, 1.25) || near(t, 1.75))) return {
			kind: "t",
			tCount: 1
		};
		if (power.base === "CZ" && (near(t, .5) || near(t, 1.5))) return {
			kind: "controlled_s",
			tCount: 3
		};
		return {
			kind: "rotation",
			angle: Math.PI * power.t
		};
	}
	const exponential = /^exp\(−i·(-?[0-9.e+-]+)·/.exec(gate.name);
	if (exponential) return {
		kind: "rotation",
		angle: Number(exponential[1])
	};
	return { kind: "undecomposed" };
};
var countResources = (circuit) => {
	const byName = /* @__PURE__ */ new Map();
	let measurements = 0;
	let channels = 0;
	let twoQubitGates = 0;
	let threeOrMoreQubitGates = 0;
	let clifford = 0;
	const tCountBy = {
		t: 0,
		controlled_s: 0,
		toffoli: 0
	};
	for (const op of circuit.operations) {
		if (op.kind === "measure") {
			measurements += 1;
			continue;
		}
		if (op.kind === "channel") {
			channels += 1;
			continue;
		}
		const entry = byName.get(op.gate.name) ?? {
			name: op.gate.name,
			arity: op.gate.arity,
			count: 0,
			class: classify(op.gate)
		};
		entry.count += 1;
		byName.set(op.gate.name, entry);
		if (op.gate.arity === 2) twoQubitGates += 1;
		if (op.gate.arity >= 3) threeOrMoreQubitGates += 1;
		const c = entry.class;
		if (c.kind === "clifford") clifford += 1;
		else if (c.kind === "t") tCountBy.t += 1;
		else if (c.kind === "controlled_s") tCountBy.controlled_s += 3;
		else if (c.kind === "toffoli") tCountBy.toffoli += 7;
	}
	const gates = [...byName.values()];
	const rotations = gates.filter((g) => g.class.kind === "rotation").map((g) => ({
		name: g.name,
		angle: g.class.angle,
		count: g.count
	}));
	const undecomposed = gates.filter((g) => g.class.kind === "undecomposed").map((g) => ({
		name: g.name,
		arity: g.arity,
		count: g.count
	}));
	return {
		qubits: circuit.qubits.length,
		depth: circuit.moments.length,
		operations: circuit.operations.length,
		measurements,
		channels,
		gates: gates.map((g) => ({
			name: g.name,
			arity: g.arity,
			count: g.count,
			class: g.class.kind
		})),
		twoQubitGates,
		threeOrMoreQubitGates,
		clifford,
		tCount: tCountBy.t + tCountBy.controlled_s + tCountBy.toffoli,
		tCountBy,
		rotations,
		undecomposed,
		complete: rotations.length === 0 && undecomposed.length === 0
	};
};
// src/quantum/mcp.ts
/** One tool: its name, what it does, its input schema (JSON Schema 2020-12), and the call that compiles or reads it: the
*  structured result and the widget that shows it. */
/** JSON-RPC's invalid-params code: the arguments of a tool do not describe a circuit or a processor. */
var INVALID_PARAMS = -32602;
var METHOD_NOT_FOUND = -32601;
var ParamError = class extends Error {};
var GATES = {
	X,
	Y,
	Z,
	H,
	CZ,
	CNOT,
	SWAP,
	TOFFOLI
};
var qubitOf = (q) => {
	if (q.kind === "grid") return GridQubit.of(q.row, q.col);
	if (q.kind === "line") return LineQubit.of(q.x);
	if (q.kind === "named") return NamedQubit.of(q.name);
	throw new ParamError(`a qubit is grid, line or named, not ${JSON.stringify(q)}`);
};
var operationOf = (op) => {
	const gate = GATES[op.gate];
	if (!gate) throw new ParamError(`gate ${op.gate} is not one of ${Object.keys(GATES).join(", ")}`);
	return applied(op.exponent === void 0 ? gate : powerOf(gate, op.exponent), ...op.qubits.map(qubitOf));
};
/** The circuit a call describes: its operations placed by the insert strategy, then an optional measurement. */
var circuitOf = (operations, insert, measurement) => {
	const circuit = new Circuit().append(operations.map(operationOf), insert);
	if (measurement) circuit.append(measure(measurement.qubits.map(qubitOf), measurement.key));
	return circuit;
};
/** A noise channel as a call names it: its name and the parameters that name takes. */
var channelOf = (j) => {
	const need = (v, key) => v ?? reject(`${j.name} needs ${key}`);
	switch (j.name) {
		case "bit_flip": return {
			name: "bit_flip",
			p: need(j.p, "p")
		};
		case "phase_flip": return {
			name: "phase_flip",
			p: need(j.p, "p")
		};
		case "depolarize": return {
			name: "depolarize",
			p: need(j.p, "p")
		};
		case "asymmetric_depolarize": return {
			name: "asymmetric_depolarize",
			p_x: need(j.p_x, "p_x"),
			p_y: need(j.p_y, "p_y"),
			p_z: need(j.p_z, "p_z")
		};
		case "amplitude_damp": return {
			name: "amplitude_damp",
			gamma: need(j.gamma, "gamma")
		};
		case "phase_damp": return {
			name: "phase_damp",
			gamma: need(j.gamma, "gamma")
		};
		case "generalized_amplitude_damp": return {
			name: "generalized_amplitude_damp",
			p: need(j.p, "p"),
			gamma: need(j.gamma, "gamma")
		};
		case "reset": return { name: "reset" };
		default: return reject(`channel ${j.name} is not one of the channels Cirq names: bit_flip, phase_flip, depolarize, asymmetric_depolarize, amplitude_damp, phase_damp, generalized_amplitude_damp, reset`);
	}
};
var CHANNEL_SCHEMA = {
	type: "object",
	required: ["name"],
	properties: {
		name: { enum: [
			"bit_flip",
			"phase_flip",
			"depolarize",
			"asymmetric_depolarize",
			"amplitude_damp",
			"phase_damp",
			"generalized_amplitude_damp",
			"reset"
		] },
		p: {
			type: "number",
			minimum: 0,
			maximum: 1
		},
		p_x: {
			type: "number",
			minimum: 0,
			maximum: 1
		},
		p_y: {
			type: "number",
			minimum: 0,
			maximum: 1
		},
		p_z: {
			type: "number",
			minimum: 0,
			maximum: 1
		},
		gamma: {
			type: "number",
			minimum: 0,
			maximum: 1
		}
	}
};
var OBSERVABLE_SCHEMA = {
	type: "object",
	description: "A Pauli string: each qubit key (line:x, grid:row,col or named:name) mapped to X, Y or Z; unlisted qubits take the identity",
	additionalProperties: { enum: [
		"X",
		"Y",
		"Z"
	] }
};
var INSERT_SCHEMA = {
	enum: [
		"EARLIEST",
		"NEW",
		"INLINE",
		"NEW_THEN_INLINE"
	],
	default: "EARLIEST"
};
var complex = ([re, im]) => ({
	re,
	im
});
var gcdOf = (x, y) => y === 0 ? x : gcdOf(y, x % y);
/** A tool from its run and its widget: the widget takes exactly what the run returns, so the two cannot drift apart. */
var TREE = /* @__PURE__ */ new Set([
	"leads",
	"audit",
	"match",
	"clay",
	"verify"
]);
var tool = (spec) => toolOf(TREE.has(spec.name) ? "tree" : "google", {
	...spec,
	run: (args) => spec.run(args)
});
var QUBIT_SCHEMA = { oneOf: [
	{
		type: "object",
		required: [
			"kind",
			"row",
			"col"
		],
		properties: {
			kind: { const: "grid" },
			row: { type: "integer" },
			col: { type: "integer" }
		}
	},
	{
		type: "object",
		required: ["kind", "x"],
		properties: {
			kind: { const: "line" },
			x: { type: "integer" }
		}
	},
	{
		type: "object",
		required: ["kind", "name"],
		properties: {
			kind: { const: "named" },
			name: { type: "string" }
		}
	}
] };
var OPERATION_SCHEMA = {
	type: "object",
	required: ["gate", "qubits"],
	properties: {
		gate: { enum: Object.keys(GATES) },
		qubits: {
			type: "array",
			items: QUBIT_SCHEMA
		},
		exponent: {
			type: "number",
			description: "the power of the gate, as Cirq writes it: 0.5 for X**0.5, the square root of NOT"
		}
	}
};
var MEASURE_SCHEMA = {
	type: "object",
	required: ["key", "qubits"],
	properties: {
		key: { type: "string" },
		qubits: {
			type: "array",
			items: QUBIT_SCHEMA
		}
	}
};
var reject = (what) => {
	throw new ParamError(what);
};
var OWN = [
	tool({
		name: "processor",
		description: "A Google Quantum AI processor as its spec sheet states it: qubits, the grid, the two chips, and the magic-state figures.",
		inputSchema: {
			type: "object",
			required: ["name"],
			properties: { name: { enum: Object.keys(DEVICES) } }
		},
		run: (args) => {
			const deviceName = String(args.name);
			if (deviceName !== "Willow" && deviceName in DEVICES) {
				const device = DEVICES[deviceName];
				return {
					name: device.name,
					qubits: device.qubits,
					couplers: device.couplers.length,
					layout: "layout" in device ? device.layout : "",
					..."statedQubits" in device ? {
						statedQubits: device.statedQubits,
						statedCouplers: device.statedCouplers
					} : {}
				};
			}
			const processor = PROCESSORS[args.name] ?? reject(`processor ${String(args.name)} is not described here`);
			return {
				name: processor.name,
				technology: processor.technology,
				qubits: processor.qubits,
				statedAverageConnectivity: processor.statedAverageConnectivity,
				typicalConnectivity: processor.typicalConnectivity,
				chips: processor.chips,
				magicStateCultivation: processor.magicStateCultivation,
				errorCorrectionPreprint: processor.errorCorrectionPreprint
			};
		},
		widget: processorWidget
	}),
	tool({
		name: "circuit",
		description: "Compile a circuit from its operations, placed by an insert strategy, and simulate it. Without noise or observables: the final amplitudes, or sampled bitstrings and their histogram when there is a measurement. With noise channels (as Cirq names them) or Pauli observables: the density matrix, its basis probabilities, trace, purity and the expectation values. A device validates the circuit first.",
		inputSchema: {
			type: "object",
			required: ["operations"],
			properties: {
				operations: {
					type: "array",
					items: OPERATION_SCHEMA
				},
				insert: INSERT_SCHEMA,
				device: {
					enum: Object.keys(DEVICES),
					description: "validate the circuit against this device first"
				},
				measure: MEASURE_SCHEMA,
				repetitions: {
					type: "integer",
					minimum: 1,
					maximum: 1e4,
					default: 100
				},
				noise: {
					type: "array",
					items: CHANNEL_SCHEMA,
					description: "channels applied after every gate, on each of its qubits"
				},
				observables: {
					type: "array",
					items: OBSERVABLE_SCHEMA
				},
				device_noise: {
					enum: ["willow_error_correction", "willow_random_circuit_sampling"],
					description: "the noise of a Willow chip, from its spec sheet medians, after every gate"
				}
			}
		},
		run: (args) => {
			const operations = args.operations;
			const measurement = args.measure;
			const circuit = circuitOf(operations, args.insert ?? "EARLIEST", measurement);
			if (typeof args.device === "string") deviceOf(DEVICES[args.device] ?? reject(`device ${args.device} is not described here`)).validateCircuit(circuit);
			const channels = (args.noise ?? []).map(channelOf);
			const observables = args.observables ?? [];
			const chip = args.device_noise === "willow_error_correction" ? "errorCorrection" : args.device_noise === "willow_random_circuit_sampling" ? "randomCircuitSampling" : void 0;
			if (channels.length || observables.length || chip !== void 0) {
				if (measurement) reject("noise and observables run on the density matrix, which does not sample; remove measure, or run the measurement without noise");
				const result = new DensityMatrixSimulator().simulate(circuit, chip !== void 0 ? willowNoiseOf(chip) : channels);
				return {
					qubits: result.qubits.map(keyOfQubit),
					probabilities: result.probabilities,
					trace: result.trace,
					purity: result.purity,
					expectations: observables.map((o) => expectationOf(result, o))
				};
			}
			if (!measurement) {
				const { amplitudes, qubits } = new Simulator().simulate(circuit);
				return {
					qubits: qubits.map(keyOfQubit),
					amplitudes: amplitudes.map(complex)
				};
			}
			const repetitions = typeof args.repetitions === "number" ? args.repetitions : 100;
			const result = new Simulator(randomOf(JSON.stringify(args))).run(circuit, repetitions);
			return {
				key: measurement.key,
				bitstrings: result.measurements(measurement.key),
				histogram: Object.fromEntries(result.histogram(measurement.key))
			};
		},
		widget: circuitWidget
	}),
	tool({
		name: "echo",
		description: "Quantum Echoes: run the operations forward, perturb once, run them back, and return the probability that every qubit returns to 0.",
		inputSchema: {
			type: "object",
			required: ["forward"],
			properties: {
				forward: {
					type: "array",
					items: OPERATION_SCHEMA
				},
				perturbation: OPERATION_SCHEMA
			}
		},
		run: (args) => {
			const forward = args.forward.map(operationOf);
			const perturbation = args.perturbation === void 0 ? void 0 : operationOf(args.perturbation);
			return {
				probability: echoProbability(forward, perturbation),
				operations: echoCircuit(forward, perturbation).operations.length
			};
		},
		widget: echoWidget
	}),
	tool({
		name: "echo_benchmark",
		description: "The Quantum Echoes result as Google states it: the processor, its qubits, the speedup, and the molecules.",
		inputSchema: {
			type: "object",
			properties: {}
		},
		run: () => QUANTUM_ECHOES,
		widget: echoBenchmarkWidget
	}),
	tool({
		name: "roadmap",
		description: "The Google Quantum AI roadmap: its six milestones, their physical-qubit scale, and which are achieved or in progress. With a milestone number, only that milestone.",
		inputSchema: {
			type: "object",
			properties: { milestone: {
				type: "integer",
				minimum: 1,
				maximum: 6
			} }
		},
		run: (args) => {
			if (args.milestone === void 0) return {
				milestones: ROADMAP,
				applications: APPLICATIONS
			};
			const found = ROADMAP.filter((m) => m.number === args.milestone);
			return found.length ? {
				milestones: found,
				applications: APPLICATIONS
			} : reject(`milestone ${String(args.milestone)} is not on the roadmap; the milestones are 1 to 6`);
		},
		widget: roadmapWidget
	}),
	tool({
		name: "algorithm",
		description: "The textbook algorithms of the Cirq page: qft and inverse_qft (on 1 to 6 qubits, from input x), phase_estimation (of θ with 1 to 8 bits), grover (two qubits, marked |00>), teleportation (the message state, sent and received), qaoa (depth 1 on the first 2 to 12 sorted qubits of the Sycamore device, the page's instance, with the expected cut), and shor (order finding for N from 3 to 21, the state-vector bound). Each returns its summary and a table.",
		inputSchema: {
			type: "object",
			required: ["name"],
			properties: {
				name: { enum: [
					"qft",
					"inverse_qft",
					"phase_estimation",
					"grover",
					"teleportation",
					"qaoa",
					"shor"
				] },
				N: {
					type: "integer",
					minimum: 3,
					maximum: 21,
					default: 15
				},
				a: {
					type: "integer",
					minimum: 2,
					default: 7
				},
				sweep: {
					type: "boolean",
					default: false,
					description: "qaoa: sweep alpha and beta on the grid of the page and return the best"
				},
				qubits: {
					type: "integer",
					minimum: 1,
					maximum: 6,
					default: 3
				},
				input: {
					type: "integer",
					minimum: 0,
					default: 0
				},
				theta: {
					type: "number",
					default: .234
				},
				bits: {
					type: "integer",
					minimum: 1,
					maximum: 8,
					default: 3
				},
				repetitions: {
					type: "integer",
					minimum: 1,
					maximum: 1e4,
					default: 2e3
				},
				nodes: {
					type: "integer",
					minimum: 2,
					maximum: 12,
					default: 12
				},
				weights: {
					type: "array",
					items: { type: "number" },
					description: "one weight per edge of the QAOA graph; all 1 by default"
				},
				alpha: {
					type: "number",
					default: 0
				},
				beta: {
					type: "number",
					default: 0
				}
			}
		},
		run: (args) => {
			const name = String(args.name);
			if (name === "qft" || name === "inverse_qft") {
				const n = Number(args.qubits ?? 3);
				const x = Number(args.input ?? 0);
				if (!Number.isInteger(n) || n < 1 || n > 6) reject("qubits is an integer from 1 to 6");
				if (!Number.isInteger(x) || x < 0 || x >= 1 << n) reject(`input is an integer from 0 to ${(1 << n) - 1}`);
				const qs = LineQubit.range(n);
				const prep = qs.filter((_, i) => x >> i & 1).map((q) => applied(X, q));
				const transform = name === "qft" ? qftOperations(qs) : inverseOperations(qftOperations(qs));
				const { amplitudes } = new Simulator().simulate(new Circuit().append([...prep, ...transform]));
				return {
					name,
					summary: [
						["Qubits", String(n)],
						["Input |x>", String(x)],
						["Transform", name === "qft" ? "QFT" : "inverse QFT"]
					],
					header: [
						"State",
						"Amplitude",
						"Probability"
					],
					rows: amplitudes.map(([re, im], k) => [
						String(k),
						`${re.toFixed(4)} ${im < 0 ? "−" : "+"} ${Math.abs(im).toFixed(4)}i`,
						`${((re * re + im * im) * 100).toFixed(2)}%`
					])
				};
			}
			if (name === "phase_estimation") {
				const theta = Number(args.theta ?? .234);
				const bits = Number(args.bits ?? 3);
				const repetitions = Number(args.repetitions ?? 2e3);
				if (!Number.isInteger(bits) || bits < 1 || bits > 8) reject("bits is an integer from 1 to 8");
				const run = new Simulator(randomOf(JSON.stringify(args))).run(phaseEstimationCircuit(theta, bits), repetitions);
				const counts = /* @__PURE__ */ new Map();
				for (const b of run.measurements("m")) {
					const estimate = [...b].reduce((sum, bit, k) => sum + Number(bit) * 2 ** k, 0) / 2 ** bits;
					counts.set(estimate, (counts.get(estimate) ?? 0) + 1);
				}
				const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
				return {
					name,
					summary: [
						["Eigenphase θ", String(theta)],
						["Estimation bits", String(bits)],
						["Most frequent estimate", String(ranked[0]?.[0] ?? "—")]
					],
					header: [
						"Estimate",
						"Count",
						"Share"
					],
					rows: ranked.map(([e, c]) => [
						e.toFixed(6),
						String(c),
						`${(c / repetitions * 100).toFixed(1)}%`
					])
				};
			}
			if (name === "grover") {
				const repetitions = Number(args.repetitions ?? 100);
				const run = new Simulator(randomOf(JSON.stringify(args))).run(groverCircuit(), repetitions);
				const counts = /* @__PURE__ */ new Map();
				for (const b of run.measurements("result")) counts.set(b, (counts.get(b) ?? 0) + 1);
				return {
					name,
					summary: [["Marked state", "|00>"], ["Repetitions", String(repetitions)]],
					header: [
						"Measured",
						"Count",
						"Share"
					],
					rows: [...counts.entries()].map(([b, c]) => [
						`|${b}>`,
						String(c),
						`${(c / repetitions * 100).toFixed(1)}%`
					])
				};
			}
			if (name === "teleportation") {
				const sent = new DensityMatrixSimulator().simulate(messageCircuit());
				const received = new DensityMatrixSimulator().simulate(teleportationCircuit());
				return {
					name,
					summary: [["Message", "X**0.25 on |0>"], ["Received on", "Bob"]],
					header: [
						"Pauli",
						"Sent",
						"Received"
					],
					rows: [
						"X",
						"Y",
						"Z"
					].map((p) => [
						p,
						expectationOf(sent, { "line:0": p }).toFixed(6),
						expectationOf(received, { "line:2": p }).toFixed(6)
					])
				};
			}
			if (name === "qaoa") {
				const graph = pageInstance(DEVICES.Sycamore, Number(args.nodes ?? 12));
				const weights = args.weights;
				if (weights !== void 0) {
					if (weights.length !== graph.edges.length) reject(`weights needs one value per edge: ${graph.edges.length} edges`);
					graph.edges.forEach((e, i) => {
						e.weight = weights[i];
					});
				}
				const total = graph.edges.reduce((sum, e) => sum + e.weight, 0);
				if (args.sweep === true) {
					const sweep = qaoaSweep(graph);
					return {
						name,
						summary: [
							["Device", "Sycamore"],
							["Nodes", String(graph.nodes.length)],
							["Edges", String(graph.edges.length)],
							["Best alpha", sweep.best.alpha.toFixed(4)],
							["Best beta", sweep.best.beta.toFixed(4)],
							["Expected cut at best", sweep.best.expectedCut.toFixed(4)],
							["Random baseline", sweep.randomBaseline.toFixed(4)]
						],
						header: ["Edge", "Weight"],
						rows: graph.edges.map((e) => [`${keyOf(e.a)} – ${keyOf(e.b)}`, e.weight.toFixed(2)])
					};
				}
				const expected = qaoaExpectedCut(graph, Number(args.alpha ?? 0), Number(args.beta ?? 0));
				return {
					name,
					summary: [
						["Device", "Sycamore"],
						["Nodes", String(graph.nodes.length)],
						["Edges", String(graph.edges.length)],
						["Expected cut", expected.toFixed(4)],
						["Random baseline", (total / 2).toFixed(4)]
					],
					header: ["Edge", "Weight"],
					rows: graph.edges.map((e) => [`${keyOf(e.a)} – ${keyOf(e.b)}`, e.weight.toFixed(2)])
				};
			}
			if (name === "shor") {
				const N = Number(args.N ?? 15);
				const a = Number(args.a ?? 7);
				const repetitions = Number(args.repetitions ?? 20);
				if (!Number.isInteger(N) || N < 3 || N > 21) reject("N is an integer from 3 to 21 (the state-vector size bound)");
				if (!Number.isInteger(a) || a < 2 || a >= N || gcdOf(a, N) !== 1) reject("a must be an integer from 2 to N−1 with no common factor with N");
				const found = shorFactors(N, a, new Simulator(randomOf(JSON.stringify(args))).run(shorCircuit(N, a), repetitions).measurements("m"));
				const counts = /* @__PURE__ */ new Map();
				for (const e of found.estimates) counts.set(e.toFixed(6), (counts.get(e.toFixed(6)) ?? 0) + 1);
				return {
					name,
					summary: [
						["N", String(N)],
						["a", String(a)],
						["Order of a mod N", found.order === null ? "not found" : String(found.order)],
						["Factors", found.factors ? `${found.factors[0]} × ${found.factors[1]}` : "not found"],
						["Prime dust", (() => {
							const d = [];
							let n = N;
							for (let p = 2; p * p <= n; p += 1) while (n % p === 0) {
								d.push(p);
								n /= p;
							}
							if (n > 1) d.push(n);
							return `${d.join(" × ")} (verified: product = ${d.reduce((x, y) => x * y, 1)})`;
						})()]
					],
					header: [
						"Measured phase",
						"Count",
						"Share"
					],
					rows: [...counts.entries()].sort((x, y) => y[1] - x[1]).map(([phase, c]) => [
						phase,
						String(c),
						`${(c / repetitions * 100).toFixed(1)}%`
					])
				};
			}
			return reject(`algorithm ${name} is not one of qft, inverse_qft, phase_estimation, grover, teleportation, qaoa, shor`);
		},
		widget: algorithmWidget
	}),
	tool({
		name: "software",
		description: "The open-source tools of the Google Quantum AI Software page, as the page describes them. Only Cirq is implemented in this repository.",
		inputSchema: {
			type: "object",
			properties: {}
		},
		run: () => ({ tools: SOFTWARE }),
		widget: softwareWidget
	}),
	tool({
		name: "statements",
		description: "The statements quantumai.google, its PDFs and the quantumlib repositories make, each as the page states it: Cirq, the definition of quantum computing, progress, responsibility, the vision, the hardware and the full stack, the Willow Early Access Program, neutral atoms, the Sycamore gates, the Weber datasheet, the Quantum Echoes preprint, the campus, qsim, Qualtran, OpenFermion, the Cirq guide pages followed, the Resources, Research, journey, lab and Qubit Game pages, the QEC milestone, the APS summit pages and the sitemap. With a topic, only that one.",
		inputSchema: {
			type: "object",
			properties: { topic: { enum: Object.keys(STATEMENTS) } }
		},
		run: (args) => {
			const topic = args.topic;
			if (topic !== void 0 && !(topic in STATEMENTS)) reject(`topic ${String(topic)} is not one of ${Object.keys(STATEMENTS).join(", ")}`);
			return { statements: Object.keys(STATEMENTS).filter((t) => topic === void 0 || t === topic).map((t) => ({
				topic: t,
				text: STATEMENTS[t]
			})) };
		},
		widget: statementsWidget
	}),
	tool({
		name: "repositories",
		description: "The repositories of the quantumlib GitHub organization, as its list states them: name, description and primary language.",
		inputSchema: {
			type: "object",
			properties: { language: {
				type: "string",
				description: "only repositories whose primary language is this"
			} }
		},
		run: (args) => {
			const language = args.language === void 0 ? void 0 : String(args.language);
			return {
				repositories: REPOSITORIES.filter((r) => language === void 0 || r.language === language),
				total: REPOSITORIES.length
			};
		},
		widget: repositoriesWidget
	}),
	tool({
		name: "leads",
		description: "Every lead on quantumai.google (every page of its sitemap, read whole), its PDFs and the quantumlib repositories, with its status (served, partial, blocked, out of scope, or open: in the sitemap and not yet followed), the tool that serves it, and the reason where it is not served. The whole list is returned; nothing is truncated.",
		inputSchema: {
			type: "object",
			properties: { status: { enum: [
				"served",
				"partial",
				"blocked",
				"out_of_scope",
				"open"
			] } }
		},
		run: (args) => {
			const status = args.status;
			if (status !== void 0 && ![
				"served",
				"partial",
				"blocked",
				"out_of_scope",
				"open"
			].includes(status)) reject(`status ${String(status)} is not one of served, partial, blocked, out_of_scope, open`);
			return {
				leads: LEADS.filter((l) => status === void 0 || l.status === status),
				counts: leadCounts(),
				total: LEADS.length
			};
		},
		widget: leadsWidget
	}),
	tool({
		name: "quantumlib",
		description: "The fifteen repositories of the quantumlib GitHub organization, each with what this repository implements of it: the exports of cirq.ts that stand for Cirq's classes, and the parts of qsim, OpenFermion, Qualtran, Stim and ReCirq the other tools emulate, named from the code that runs here. A cross-reference computed at call time, not a catalogue.",
		inputSchema: {
			type: "object",
			properties: { repository: {
				type: "string",
				description: "only the repository with this name"
			} }
		},
		run: (args) => {
			const name = args.repository === void 0 ? void 0 : String(args.repository);
			if (name !== void 0 && !REPOSITORIES.some((r) => r.name === name)) reject(`repository ${name} is not one of ${REPOSITORIES.map((r) => r.name).join(", ")}`);
			const exportsOf = (predicate) => Object.entries(cirq_exports).filter(([k, v]) => predicate(k, v)).map(([k]) => k).sort();
			const gates = exportsOf((_, v) => typeof v === "object" && v !== null && "arity" in v && "matrix" in v);
			const classes = exportsOf((_, v) => typeof v === "function" && /^class\s/.test(Function.prototype.toString.call(v)));
			const functions = exportsOf((_, v) => typeof v === "function" && !/^class\s/.test(Function.prototype.toString.call(v)));
			const objects = exportsOf((k, v) => typeof v === "object" && v !== null && !("arity" in v) && !gates.includes(k));
			const toolNames = TOOLS.map((t) => t.name);
			const has = (...names) => names.filter((n) => toolNames.includes(n));
			const cross = {
				Cirq: {
					implementedHere: [
						...classes,
						...objects,
						...gates,
						...functions
					],
					tools: has("circuit", "algorithm", "echo"),
					note: `the exports of cirq.ts: ${classes.length} classes, ${objects.length} qubit constructors, ${gates.length} gates and ${functions.length} functions, each named after the Cirq class or function it stands for`
				},
				qsim: {
					implementedHere: ["Simulator"],
					tools: has("circuit", "algorithm"),
					note: "the same state-vector computation, in TypeScript, bounded at 20 qubits, without qsim's gate fusion, single precision or vector instructions"
				},
				OpenFermion: {
					implementedHere: ["hydrogen", "hydrogenHamiltonian"],
					tools: has("chemistry-simulation"),
					note: "what MolecularData and jordan_wigner produce for one molecule, H₂ in STO-3G: the integrals and the Pauli-term qubit Hamiltonian, computed here and checked against the OpenFermion tutorial's printed energies"
				},
				Qualtran: {
					implementedHere: ["countResources", "isClifford"],
					tools: has("fault-tolerant-design"),
					note: "resource counts (gates, two-qubit gates, depth, T-count) read from built circuits; no bloqs, no algorithm library"
				},
				Stim: {
					implementedHere: ["repetitionCycle"],
					tools: has("quantum-error-correction"),
					note: "the repetition code cycle is simulated as a density matrix with Toffoli corrections, not as a stabilizer tableau with measured syndromes; Stim's stabilizer simulation is not emulated"
				},
				ReCirq: {
					implementedHere: [
						"pageInstance",
						"qaoaSweep",
						"qaoaEstimate"
					],
					tools: has("algorithm", "statements"),
					note: "the QAOA max-cut experiment of the Cirq page is built here; the KPZ, HFVQE, QC-QMC and OTOC experiments are served as statements of their pages"
				}
			};
			return {
				organization: "quantumlib",
				url: "https://github.com/quantumlib",
				repositories: REPOSITORIES.filter((r) => name === void 0 || r.name === name).map((r) => ({
					...r,
					url: `https://github.com/quantumlib/${r.name}`,
					...cross[r.name] ?? {
						implementedHere: [],
						tools: [],
						note: "nothing of this repository is implemented or emulated here"
					}
				})),
				total: REPOSITORIES.length,
				emulated: REPOSITORIES.filter((r) => r.name in cross).length
			};
		},
		widget: quantumlibWidget
	}),
	tool({
		name: "quantum-error-correction",
		description: "The three-qubit repetition code, simulated on the density matrix: a logical qubit encoded, a channel (bit_flip, phase_flip or depolarize) of probability p acting once on each data qubit, syndromes extracted and corrected by majority, and the logical error read from the simulated state against the raw error of an unencoded qubit, at the p given and over a sweep. The break-even p is bisected from the simulation; the textbook 3p² − 2p³ is reported beside it where it applies. The encoding, syndrome and correction gates are noiseless (the code-capacity model). The quantumlib QEC packages are listed as cited data.",
		inputSchema: {
			type: "object",
			properties: {
				code: {
					enum: ["bit_flip", "phase_flip"],
					default: "bit_flip"
				},
				channel: {
					enum: [
						"bit_flip",
						"phase_flip",
						"depolarize"
					],
					default: "bit_flip"
				},
				p: {
					type: "number",
					minimum: 0,
					maximum: 1,
					default: .1
				},
				logical: {
					enum: [
						"0",
						"1",
						"+",
						"-"
					],
					default: "0",
					description: "the logical state encoded; |+⟩ and |−⟩ are eigenstates of the logical X a matched code can miss, so they show no error from it"
				},
				sweep: {
					type: "array",
					items: {
						type: "number",
						minimum: 0,
						maximum: 1
					},
					description: "the probabilities to sweep; by default 0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6"
				}
			}
		},
		run: (args) => {
			const code = args.code ?? "bit_flip";
			const channel = args.channel ?? "bit_flip";
			const logical = args.logical ?? "0";
			const p = Number(args.p ?? .1);
			if (!["bit_flip", "phase_flip"].includes(code)) reject("code is bit_flip or phase_flip");
			if (![
				"bit_flip",
				"phase_flip",
				"depolarize"
			].includes(channel)) reject("channel is bit_flip, phase_flip or depolarize");
			if (![
				"0",
				"1",
				"+",
				"-"
			].includes(logical)) reject("logical is 0, 1, + or -");
			if (!(p >= 0 && p <= 1)) reject("p is a probability between 0 and 1");
			const grid = args.sweep ?? [
				.01,
				.02,
				.05,
				.1,
				.2,
				.3,
				.4,
				.5,
				.6
			];
			if (!grid.every((q) => typeof q === "number" && q >= 0 && q <= 1)) reject("every sweep value is a probability between 0 and 1");
			const sweep = grid.map((q) => ({
				...codePoint(code, channel, q, logical),
				textbook: textbookLogicalError(code, channel, logical, q)
			}));
			const at = {
				...codePoint(code, channel, p, logical),
				textbook: textbookLogicalError(code, channel, logical, p)
			};
			const breakEven = breakEvenOf(code, channel, logical, sweep);
			const deviations = sweep.filter((s) => s.textbook !== null).map((s) => Math.abs(s.logicalError - s.textbook));
			const circuit = repetitionCycle(code, channelOf$1(channel, p), logical);
			return {
				code,
				channel,
				logical,
				at,
				sweep,
				breakEven,
				helpsAtP: at.logicalError < at.physicalError,
				observed: breakEven === null ? `over the sweep the code ${sweep.every((s) => s.logicalError < s.physicalError) ? "always" : "never"} lowers the error below the unencoded qubit's` : `the code lowers the error below the unencoded qubit's for p below ${breakEven.toFixed(6)}, and raises it above; the crossing is bisected from simulated points`,
				textbook: {
					formula: "3p² − 2p³ for a matched code and channel on a logical |0⟩ or |1⟩",
					source: "Nielsen & Chuang, Quantum Computation and Quantum Information, §10.1.1",
					maxDeviationOverSweep: deviations.length ? Math.max(...deviations) : null
				},
				model: "code-capacity: the channel acts once on each data qubit; encoding, syndrome extraction, Toffoli correction and decoding are noiseless; every error is Tr of the simulated density matrix on the decoded qubit",
				circuit: {
					qubits: circuit.qubits.length,
					moments: circuit.moments.length,
					operations: circuit.operations.length
				},
				packages: REPOSITORIES.filter((r) => [
					"Stim",
					"chromobius",
					"tesseract-decoder"
				].includes(r.name)).map((r) => ({
					...r,
					url: `https://github.com/quantumlib/${r.name}`,
					source: "the quantumlib repository list, as it states them"
				}))
			};
		},
		widget: errorCorrectionWidget
	}),
	tool({
		name: "chemistry-simulation",
		description: "Molecular hydrogen in STO-3G as a variational energy evaluation on the simulator: the integrals are computed here from the published basis constants and checked against the energies the OpenFermion tutorial prints at 0.7 and 0.8 Å; the two-electron Hamiltonian is a two-qubit Pauli-term operator; the ansatz exp(−iθ Y⊗X) on the Hartree-Fock state is swept over θ, every energy an expectation value of the simulated state, and the minimum found is returned with the full-CI energy the same integrals give. A bond length in ångström, or one θ to evaluate.",
		inputSchema: {
			type: "object",
			properties: {
				bond_length: {
					type: "number",
					exclusiveMinimum: 0,
					default: .7414,
					description: "the H–H distance in ångström; 0.7414 is the tutorial's"
				},
				theta: {
					type: "number",
					description: "evaluate the energy at this θ only, instead of sweeping"
				},
				steps: {
					type: "integer",
					minimum: 4,
					default: 180,
					description: "grid points of the sweep over [−π/2, π/2)"
				}
			}
		},
		run: (args) => {
			const bondLength = Number(args.bond_length ?? TUTORIAL_ENERGIES.bondLengthDefault);
			if (!(bondLength > 0)) reject("bond_length is a positive distance in ångström");
			const molecule = hydrogen(bondLength);
			const terms = hydrogenHamiltonian(molecule);
			const theta = args.theta === void 0 ? void 0 : Number(args.theta);
			if (theta !== void 0 && !Number.isFinite(theta)) reject("theta is a number");
			const steps = Number(args.steps ?? 180);
			if (!Number.isInteger(steps) || steps < 4) reject("steps is an integer of at least 4");
			const vqe = theta === void 0 ? vqeSweep(terms, steps) : null;
			const ansatz = ansatzCircuit(theta ?? vqe.best.theta);
			return {
				molecule,
				basis: {
					name: "STO-3G",
					hydrogen: STO3G_H,
					bohrAngstrom: BOHR_ANGSTROM
				},
				mapping: "two qubits: line:0 is the orbital of the spin-up electron (|0⟩ = g, |1⟩ = u), line:1 the spin-down electron's; the Hartree-Fock state is |00⟩; the nuclear repulsion is in the identity term",
				terms,
				ansatz: {
					gate: ansatz.operations[0].kind === "gate" ? ansatz.operations[0].gate.name : "",
					state: "cos θ |00⟩ + sin θ |11⟩"
				},
				hartreeFockFromSimulator: energyAt(terms, 0),
				vqe,
				at: theta === void 0 ? null : {
					theta,
					energy: energyAt(terms, theta)
				},
				checks: {
					source: TUTORIAL_ENERGIES.source,
					points: tutorialChecks(),
					note: "the nuclear repulsion, Hartree-Fock, full-CI and orbital energies agree with the printed figures to about 10⁻¹⁵ Ha; MP2 differs by about 4 × 10⁻⁷ Ha at both lengths, and the page states no convergence settings for its MP2"
				},
				units: "hartree; bond length in ångström"
			};
		},
		widget: chemistryWidget
	}),
	tool({
		name: "fault-tolerant-design",
		description: "Resource counts read from the circuits this repository builds: the QFT on n qubits, Grover, teleportation, Shor for N up to 21, the QAOA instance and the repetition-code cycle. For each: gates by name, two-qubit gates, depth in moments, and the T-count of the gates whose Clifford+T cost is stated (Toffoli 7, T 1, controlled-S 3; Cliffordness computed from each unitary). Rotations and undecomposed gates are listed and left uncounted, and the count says whether it is complete. Qualtran is the cited library for the general case.",
		inputSchema: {
			type: "object",
			properties: {
				circuit: {
					enum: [
						"qft",
						"grover",
						"teleportation",
						"shor",
						"qaoa",
						"qec",
						"all"
					],
					default: "all"
				},
				qubits: {
					type: "integer",
					minimum: 1,
					maximum: 6,
					default: 3,
					description: "qft: the register size"
				},
				N: {
					type: "integer",
					minimum: 3,
					maximum: 21,
					default: 15,
					description: "shor: the modulus"
				},
				a: {
					type: "integer",
					minimum: 2,
					default: 7,
					description: "shor: the base"
				},
				nodes: {
					type: "integer",
					minimum: 2,
					maximum: 12,
					default: 12,
					description: "qaoa: the nodes of the page's instance"
				}
			}
		},
		run: (args) => {
			const which = String(args.circuit ?? "all");
			const n = Number(args.qubits ?? 3);
			const N = Number(args.N ?? 15);
			const a = Number(args.a ?? 7);
			const nodes = Number(args.nodes ?? 12);
			if (!Number.isInteger(n) || n < 1 || n > 6) reject("qubits is an integer from 1 to 6");
			if (!Number.isInteger(N) || N < 3 || N > 21) reject("N is an integer from 3 to 21");
			if (!Number.isInteger(a) || a < 2 || a >= N || gcdOf(a, N) !== 1) reject("a must be an integer from 2 to N−1 with no common factor with N");
			if (!Number.isInteger(nodes) || nodes < 2 || nodes > 12) reject("nodes is an integer from 2 to 12");
			const builders = {
				qft: () => new Circuit().append(qftOperations(LineQubit.range(n))),
				grover: groverCircuit,
				teleportation: teleportationCircuit,
				shor: () => shorCircuit(N, a),
				qaoa: () => qaoaCircuit(pageInstance(DEVICES.Sycamore, nodes), .5, .25),
				qec: () => repetitionCycle("bit_flip", {
					name: "bit_flip",
					p: .1
				}, "0")
			};
			if (which !== "all" && !(which in builders)) reject(`circuit ${which} is not one of ${Object.keys(builders).join(", ")}, all`);
			return {
				circuits: (which === "all" ? Object.keys(builders) : [which]).map((name) => ({
					name: name === "qft" ? `qft on ${n} qubits` : name === "shor" ? `shor N=${N} a=${a}` : name === "qaoa" ? `qaoa on ${nodes} nodes (alpha = 0.5, beta = 0.25)` : name === "qec" ? "repetition code cycle (bit flip, p = 0.1)" : name,
					count: countResources(builders[name]())
				})),
				costs: {
					toffoli: {
						tCount: 7,
						source: "Nielsen & Chuang, Quantum Computation and Quantum Information, figure 4.9; Amy, Maslov, Mosca, Roetteler, IEEE TCAD 32, 818 (2013)"
					},
					t: {
						tCount: 1,
						source: "T = Z**0.25; X**0.25 = H·T·H"
					},
					controlled_s: {
						tCount: 3,
						source: "CS = (T⊗T)·CNOT·(I⊗T†)·CNOT, verified as a matrix product in counting.test.ts"
					},
					clifford: `computed from each unitary: it conjugates every Pauli string to a Pauli string, checked up to 3 qubits`,
					uncounted: "arbitrary-angle rotations (CZ**t at other t, ZZ**t, exp(−iθP)) and gates not decomposed here (Shor's modular multiplications) are listed, not costed; no synthesis figure is invented"
				},
				library: {
					name: "Qualtran",
					description: REPOSITORIES.find((r) => r.name === "Qualtran").description,
					url: "https://github.com/quantumlib/Qualtran",
					note: "the quantumlib library for resource estimation of fault-tolerant algorithms; not implemented here"
				}
			};
		},
		widget: resourcesWidget
	}),
	tool({
		name: "audit",
		description: "The surface audits itself through tools/call: every tool has a schema and an example, every documented example replays as documented, every served lead names a served tool, and the error paths answer as JSON-RPC requires. Each check carries its evidence; a failed check is a lead, not a ruling.",
		inputSchema: {
			type: "object",
			properties: {}
		},
		run: () => {
			const was = auditing;
			auditing = true;
			try {
				return auditOf(handle, EXAMPLES, LEADS, TOOLBOXES);
			} finally {
				auditing = was;
			}
		},
		widget: auditWidget
	}),
	tool({
		name: "match",
		description: "Any statement, matched against everything the surface can do. served: a call answers it and is returned. impossible: the surface proves it cannot, from a schema bound the statement exceeds, a lead whose reason says why, or the handler's own refusal; the cluster then names the served possibilities around it and verify names the live sources the client's MCP can check. unknown: nothing matches, and the statement comes back as a new lead to develop.",
		inputSchema: {
			type: "object",
			required: ["statement"],
			properties: {
				statement: {
					type: "string",
					description: "any prompt or statement; Glagolitic numerals are read as integers"
				},
				locale: {
					type: "string",
					enum: Object.keys(LOCALES),
					description: "the language of the statement, translated to English by vocabulary offline before the match; the verdict is given back in it"
				}
			}
		},
		run: (args) => matchOf(String(args.statement ?? ""), handle, EXAMPLES, LEADS, args.locale === void 0 ? void 0 : String(args.locale)),
		widget: matchWidget
	}),
	tool({
		name: "clay",
		description: "The Clay register recomputed in exact integer arithmetic: the Lean definitions of Qpu/Clay.lean and its imports ported one for one, every relation_N statement parsed and evaluated, each side's value and the bit width it needs reported. What the Lean kernel accepted by rfl, redone with + − × ÷ on naturals only, so a small machine can redo the same sums and compare addresses. Nothing here is a proof of an open problem: the relations are identities between the unit's own constants.",
		inputSchema: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "one relation, e.g. relation_15; omit for all"
				},
				technique: {
					type: "string",
					enum: ["reflection"],
					description: "the register read by the σ-reflection technique: every value's vortex seed, reflection and trinities, the reflecting pairs, the fixed and the tuned; with unit, the unit's sequence answers compared"
				},
				unit: {
					type: "array",
					items: { type: "object" },
					description: "the unit's run_sequence answers per value ({ value, answer | refusal })"
				}
			}
		},
		run: (args) => {
			const all = recomputeClay();
			if (args.technique === "reflection") {
				const reading = reflectionOfRegister(all.relations);
				const compared = (Array.isArray(args.unit) ? args.unit : []).map((u) => {
					const mine = reading.readings.find((r) => r.value === u.value);
					return {
						value: u.value,
						tree: mine ? {
							seed: mine.seed,
							reflection: mine.reflection
						} : null,
						unit: u.answer ? {
							seed: u.answer.seed,
							reflection: u.answer.reflection
						} : null,
						refusal: u.refusal ?? null,
						agree: !!mine && !!u.answer && u.answer.seed === mine.seed && u.answer.reflection === mine.reflection
					};
				});
				const disagreements = compared.filter((c) => c.unit && !c.agree);
				return {
					...all,
					technique: "reflection",
					pairsCount: reading.pairs.length,
					fixedCount: reading.fixed.length,
					tunedCount: reading.tuned.length,
					seeds: Object.keys(reading.bySeed).length,
					unitAsked: compared.length,
					unitAgree: compared.filter((c) => c.agree).length,
					unitDisagree: disagreements.length,
					unitRefused: compared.filter((c) => c.refusal).length,
					...reading,
					compared,
					unitPlan: [...new Set(reading.readings.map((r) => r.value))].map((value) => ({
						name: "run_sequence",
						arguments: { input: value }
					})),
					leads: disagreements.map((d) => ({
						id: `clay-sequence-${d.value}`,
						source: "uuidna.com/mcp run_sequence",
						statement: `the unit reads ${d.value} as seed ${d.unit?.seed} reflection ${d.unit?.reflection}; this tree reads seed ${d.tree?.seed} reflection ${d.tree?.reflection}`,
						status: "open",
						reason: "two readings of one value: the digital root is decidable, so one of the two is wrong and the kernel can say which"
					}))
				};
			}
			if (args.name) {
				const r = all.relations.find((x) => x.name === args.name);
				if (!r) throw new Error(`${String(args.name)} is not one of ${all.relations.map((x) => x.name).join(", ")}`);
				return {
					...all,
					relations: [r]
				};
			}
			return all;
		},
		widget: clayWidget
	}),
	tool({
		name: "verify",
		description: "Cheap verification of one UUID: its seal (the version nibble the other 31 nibbles decide, one modular power, no content needed), its content (one fold), and its neighbours in a chain (the predecessor it names and the successor that names it). Each check is independent; a check without its input is not decided rather than passed.",
		inputSchema: {
			type: "object",
			required: ["uuid"],
			properties: {
				uuid: {
					type: "string",
					description: "the UUID to verify"
				},
				content: {
					type: "string",
					description: "the text the UUID should be the address of"
				},
				prev: {
					type: "object",
					properties: { id: { type: "string" } },
					description: "the predecessor in the chain"
				},
				self: {
					type: "object",
					properties: { prev: { type: "string" } },
					description: "what this entry names as its predecessor"
				},
				next: {
					type: "object",
					properties: {
						id: { type: "string" },
						prev: { type: "string" }
					},
					description: "the successor in the chain"
				}
			}
		},
		run: (args) => verifyOf(String(args.uuid ?? ""), typeof args.content === "string" ? args.content : void 0, args.prev, args.next, args.self),
		widget: verifyWidget
	})
];
/** Results by block address, once per process: the memory of the balancer. */
var BALANCER = /* @__PURE__ */ new Map();
/** Observability: per tool, how often it was asked, how often it computed (a miss), how long the misses took, how many bytes they produced. */
var OBSERVED = /* @__PURE__ */ new Map();
var NESTED = [];
/** What the run's artefacts add to the metrics: textbook APIs autodiscovered and covered, verification on public datasets, the border, the repository watched, the legal audit, the RAID's signalling (docket entries chained to a root), the receipt chain. */
var coverageOf = (a) => {
	const calls = [...OBSERVED.values()].reduce((n, o) => n + o.calls, 0), misses = [...OBSERVED.values()].reduce((n, o) => n + o.misses, 0);
	const load = {
		paid: misses,
		free: calls - misses + (a.e2e?.involutions ?? 0),
		involutions: a.e2e?.involutions ?? 0,
		coins: a.coins?.coins ?? 0,
		a432: {
			key: 432,
			harmonics: Object.keys(varsOf$1(uuidOf("a432"))).length,
			stylesheetBytes: cssOf().length,
			served: "the shell cache, immutable: the harmonic strings of every block (its custom properties from its UUID alone, the reflected harmonic and the drift's prime dust among them) cost the device nothing and the edge nothing"
		},
		note: "paid: computations (balancer misses); free: answers by address (balancer hits) and by involution (304 at the edge); the coins set the entanglement once, the teleports are free until the load is paid again"
	};
	const v = Object.values(a.verification?.summary ?? {});
	const sum = (k) => v.reduce((n, s) => n + (s[k] ?? 0), 0);
	const hosts = a.discovery?.hosts ?? [];
	return {
		load,
		discoveredHosts: hosts.length,
		hostsWithContract: hosts.filter((h) => /^openapi|json index|oai-pmh|graphql|mcp tools/.test(h.detected)).length,
		discoveredDoors: a.discovery?.doors?.length ?? 0,
		capabilities: Object.fromEntries(Object.entries(a.discovery?.capabilities ?? {}).map(([k, v]) => [k, v.length])),
		verificationRequests: sum("requests"),
		verificationReachable: sum("ok"),
		verificationContracted: sum("contracted"),
		verificationOutsideContract: sum("uncontracted"),
		verificationReachableRatio: sum("requests") ? Number((sum("ok") / sum("requests")).toFixed(3)) : null,
		readinessClasses: a.readiness?.classes ?? null,
		ready: a.readiness?.readiness?.ready ?? null,
		borderDoors: a.readiness?.border?.doors?.length ?? 0,
		borderSealedBy: a.readiness?.border?.sealedBy?.length ?? 0,
		repositoryBranchesAgree: a.repository?.branches ? `${a.repository.branches.agree.length}/${a.repository.branches.local}` : null,
		repositoryTagsAgree: a.repository?.tags ? `${a.repository.tags.agree.length}/${a.repository.tags.local}` : null,
		repositoryTagsMoved: a.repository?.tags?.mismatch.length ?? 0,
		repositoryLeads: a.repository?.leads?.length ?? 0,
		legalClaims: a.legal?.claims ?? 0,
		legalVerdicts: a.legal?.verdicts ?? null,
		legalViolations: a.legal?.violations ?? 0,
		legalRefusals: a.legal?.refusals ?? 0,
		legalSecurity: a.legal ? `${a.legal.securityPassed}/${a.legal.securityTotal}` : null,
		legalAudit: a.legal?.id ?? null,
		coinsPaid: a.coins?.coins ?? 0,
		coinCalls: a.coins?.calls ?? 0,
		coinsByDoor: a.coins?.byDoor ?? null,
		coinsUnclean: a.coins?.unclean ?? 0,
		coinsPerSettledLead: a.coins && a.readiness?.classes ? Number((a.coins.coins / Math.max(1, a.readiness.classes.served + a.readiness.classes.refuted)).toFixed(3)) : null,
		docketEntries: a.docket?.entries ?? 0,
		docketRoot: a.docket?.root ?? null,
		docketMirrors: a.docket?.mirrors ?? 0,
		receipts: a.receipts?.count ?? 0,
		lastReceipt: a.receipts?.last ?? null,
		verbosityBytes: a.sizes ?? null,
		verbosityTotalBytes: a.sizes ? Object.values(a.sizes).reduce((n, b) => n + b, 0) : null,
		stepMs: a.receipt?.steps ? Object.fromEntries(a.receipt.steps.filter((s) => s.status !== "skipped").map((s) => [s.name, s.ms])) : null,
		flowMs: a.receipt?.steps?.reduce((n, s) => n + s.ms, 0) ?? null,
		msPerVerificationRequest: sum("requests") && a.receipt?.steps ? Number(((a.receipt.steps.find((s) => s.name === "verify")?.ms ?? 0) / sum("requests")).toFixed(1)) : null,
		requestsPerSettledLead: a.readiness?.classes && sum("requests") ? Number((sum("requests") / Math.max(1, a.readiness.classes.served + a.readiness.classes.refuted)).toFixed(2)) : null,
		msPerSettledLead: a.readiness?.classes && a.receipt?.steps ? Number((a.receipt.steps.reduce((n, s) => n + s.ms, 0) / Math.max(1, a.readiness.classes.served + a.readiness.classes.refuted)).toFixed(1)) : null
	};
};
var auditing = false;
var auditNow = () => {
	if (auditing) return null;
	auditing = true;
	try {
		const a = auditOf(handle, EXAMPLES, LEADS, TOOLBOXES);
		return {
			total: a.total,
			passed: a.passed,
			failed: a.failed
		};
	} finally {
		auditing = false;
	}
};
var metricsOf = (artefacts = {}) => {
	const audit = auditNow();
	const byStatus = {};
	for (const l of LEADS) byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
	const backed = EXAMPLES.filter((e) => e.theorem);
	return {
		tools: TOOLS.length,
		toolboxes: TOOLBOXES.length,
		patterns: PATTERNS.length,
		patternsRecognised: EXAMPLES.filter((e) => e.tool === "match" && typeof e.arguments.statement === "string" && patternOf(e.arguments.statement)).length,
		examples: EXAMPLES.length,
		examplesBackedByTheorems: backed.length,
		examplesBackedRatio: Number((backed.length / EXAMPLES.length).toFixed(3)),
		theoremsKernel: 980,
		theoremsHandWritten: THEOREMS.length,
		lemmasGenerated: 499,
		leads: LEADS.length,
		leadsByStatus: byStatus,
		auditChecks: audit?.total ?? null,
		auditPassed: audit?.passed ?? null,
		auditFailed: audit?.failed ?? null,
		auditNested: audit === null,
		selftests: TOOLBOXES.map((b) => b.name),
		balancer: BALANCER.size,
		license: LICENSE.spdx,
		at: (/* @__PURE__ */ new Date()).toISOString(),
		toolCalls: [...OBSERVED.values()].reduce((n, o) => n + o.calls, 0),
		toolMisses: [...OBSERVED.values()].reduce((n, o) => n + o.misses, 0),
		toolMs: [...OBSERVED.values()].reduce((n, o) => n + o.ms, 0),
		slowestTools: [...OBSERVED.entries()].sort((x, y) => y[1].ms - x[1].ms).slice(0, 6).map(([name, o]) => `${name} ${o.ms} ms / ${o.misses} computed / ${o.calls} asked / ${o.bytes} bytes`),
		msPerComputedCall: (() => {
			const m = [...OBSERVED.values()].reduce((n, o) => n + o.misses, 0);
			return m ? Number(([...OBSERVED.values()].reduce((n, o) => n + o.ms, 0) / m).toFixed(1)) : null;
		})(),
		...coverageOf(artefacts),
		gateCombos: artefacts.e2e?.combos ?? null,
		gateCopies: artefacts.e2e?.copies ?? null,
		gateInvolutions: artefacts.e2e?.involutions ?? null,
		gateOutcomes: artefacts.e2e?.outcomes ?? null,
		gateMsSaved: artefacts.e2e?.competition?.saved ?? null,
		gateWinners: artefacts.e2e?.competition?.winners ?? null
	};
};
var metrics = toolOf("tree", {
	name: "metrics",
	description: "The computable metrics of this tree in real time: tools and toolboxes, examples and how many name the kernel-accepted theorem that makes them true, the kernel's theorem counts from its own index, leads by status, the audit's checks, the balancer's memory. Quality is proven by theorems, not textbook examples; this is the measure of how far that holds.",
	inputSchema: {
		type: "object",
		properties: { artefacts: {
			type: "object",
			description: "the run's artefacts the client read: discovery, verification, readiness, repository, legal, docket, receipts; without them the tree's own counts alone"
		} }
	},
	run: (args) => metricsOf(args.artefacts ?? {}),
	widget: flowWidget
});
/** The textbook as an adapter: every example categorised for reuse — by toolbox, by tool, by the theorem that backs it, by the
* theorem's module — and any example replayed by id (the balancer makes a replay free). Quality is proven by theorems; the
* textbook is where the examples wait, respected, each a lead for its theorem. */
var textbook = toolOf("tree", {
	name: "textbook",
	description: "The QPU textbook as an adapter: every example categorised for reuse — by toolbox, by tool, by the kernel-accepted theorem that backs it, by that theorem's module — and, with reuse: <example id>, that example replayed and its result returned. The categories are computed from the registries, never written by hand.",
	inputSchema: {
		type: "object",
		properties: {
			verify: {
				type: "boolean",
				description: "the wave over the textbook: every example's verification requests on public datasets and APIs, for any client device to fetch"
			},
			example: {
				type: "string",
				description: "with verify: one example only, so a device at the edge walks the textbook within the Worker's budget"
			},
			results: {
				type: "array",
				items: { type: "object" },
				description: "the requests fetched (url, status, ok, contracted), joined back by url and sealed"
			},
			reuse: {
				type: "string",
				description: "an example id to replay"
			},
			category: {
				type: "string",
				enum: [
					"toolbox",
					"tool",
					"theorem",
					"module"
				],
				description: "one category to list; omit for all"
			}
		}
	},
	run: (args) => {
		const boxOf = new Map(TOOLBOXES.flatMap((b) => b.tools.map((t) => [t.name, b.name])));
		const group = (key) => {
			const out = {};
			for (const e of EXAMPLES) {
				const k = key(e);
				if (k !== null) (out[k] ??= []).push(e.id);
			}
			return out;
		};
		const categories = {
			toolbox: group((e) => boxOf.get(e.tool) ?? "none"),
			tool: group((e) => e.tool),
			theorem: group((e) => e.theorem ?? "none yet: a lead for a theorem"),
			module: group((e) => e.theorem ? THEOREMS.find((t) => t.key === e.theorem)?.module ?? "unknown" : null)
		};
		if (typeof args.reuse === "string") {
			const e = EXAMPLES.find((x) => x.id === args.reuse);
			if (!e) throw new Error(`no example ${args.reuse}; the textbook has ${EXAMPLES.map((x) => x.id).join(", ")}`);
			const r = handle({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/call",
				params: {
					name: e.tool,
					arguments: e.arguments
				}
			});
			if (r.error) throw new Error(r.error.message);
			const why = e.expect(r.result.structuredContent);
			return {
				reused: e.id,
				tool: e.tool,
				toolbox: boxOf.get(e.tool) ?? "none",
				theorem: e.theorem ?? null,
				shows: e.shows,
				asDocumented: why === null,
				why,
				result: r.result.structuredContent
			};
		}
		if (args.verify === true || Array.isArray(args.results)) {
			const match = matcherOf(handle, EXAMPLES, LEADS);
			const chosenExamples = typeof args.example === "string" ? EXAMPLES.filter((e) => e.id === args.example) : EXAMPLES;
			if (typeof args.example === "string" && !chosenExamples.length) throw new Error(`no example ${args.example}`);
			const perExample = chosenExamples.map((e) => ({
				id: e.id,
				tool: e.tool,
				theorem: e.theorem ?? null,
				requests: match(e.shows).verify.map((r) => ({
					verifier: r.verifier,
					url: r.url,
					check: r.check
				}))
			}));
			const requests = /* @__PURE__ */ new Map();
			for (const ex of perExample) for (const r of ex.requests) {
				const cur = requests.get(r.url) ?? {
					...r,
					examples: []
				};
				if (!cur.examples.includes(ex.id)) cur.examples.push(ex.id);
				requests.set(r.url, cur);
			}
			if (!Array.isArray(args.results)) return {
				phase: "requests",
				examples: chosenExamples.length,
				withRequests: perExample.filter((x) => x.requests.length).length,
				provenByTheorem: perExample.filter((x) => x.theorem).length,
				requests: requests.size,
				requestList: [...requests.values()],
				compliance: "GET only, free public sources, a named user agent, no credential, a timeout on every request, each request checked against the host's discovered contract; nothing is written anywhere by this wave"
			};
			const results = args.results;
			const byUrl = new Map(results.map((r) => [r.url, r]));
			const verified = perExample.map((ex) => {
				const rs = ex.requests.map((r) => byUrl.get(r.url));
				const reachable = rs.filter((r) => r?.ok).length;
				const unfetched = rs.filter((r) => !r).length;
				return {
					id: ex.id,
					tool: ex.tool,
					theorem: ex.theorem,
					requests: ex.requests.length,
					reachable,
					unreachable: ex.requests.length - reachable - unfetched,
					unfetched,
					contracted: rs.filter((r) => r?.contracted === "yes").length,
					state: ex.theorem ? "proven" : ex.requests.length === 0 ? "no public source named" : unfetched === ex.requests.length ? "unfetched" : reachable === ex.requests.length ? "verified online" : reachable ? "partly reachable" : "unreachable"
				};
			});
			const content = JSON.stringify({
				verified,
				results: results.map((r) => [r.url, r.status])
			});
			const states = verified.reduce((acc, v) => ({
				...acc,
				[v.state]: (acc[v.state] ?? 0) + 1
			}), {});
			return {
				phase: "verified",
				id: uuidOf(content),
				sha256: hex(sha256(utf8(content))),
				examples: chosenExamples.length,
				requests: requests.size,
				fetched: [...requests.keys()].filter((u) => byUrl.has(u)).length,
				...Object.fromEntries(Object.entries(states).map(([k, v]) => [`state:${k}`, v])),
				states,
				verified
			};
		}
		const chosen = typeof args.category === "string" ? { [args.category]: categories[args.category] } : categories;
		return {
			examples: EXAMPLES.length,
			backedByTheorems: EXAMPLES.filter((e) => e.theorem).length,
			categories: Object.keys(chosen).length,
			...Object.fromEntries(Object.entries(chosen).map(([k, v]) => [`${k}Count`, Object.keys(v).length])),
			textbook: chosen
		};
	},
	widget: flowWidget
});
/** The UI as CSS, served: the stylesheet from the key and, for a UUID, the custom properties its block root carries. */
var css = toolOf("tree", {
	name: "css",
	description: "The quantum UI as CSS alone: the stylesheet derived from the key 432 (the harmonics, and the rules that draw every block from its own custom properties with no script, motion only where the device allows it, off-screen blocks at no cost) and, for a uuid, the custom properties its block root carries (hue, CMYK, accent, tail colour and angle, the 9-vortex seed and period). Computed once; a device renders at the cost of CSS.",
	inputSchema: {
		type: "object",
		properties: { uuid: {
			type: "string",
			description: "a UUID whose block variables to compute"
		} }
	},
	run: (args) => {
		const stylesheet = cssOf();
		const vars = typeof args.uuid === "string" ? varsOf$1(args.uuid) : null;
		return {
			key: 432,
			bytes: stylesheet.length,
			rules: (stylesheet.match(/\{/g) ?? []).length,
			variables: vars ? Object.keys(vars).length : 0,
			script: false,
			uuid: typeof args.uuid === "string" ? args.uuid : null,
			vars,
			stylesheet
		};
	},
	widget: flowWidget
});
var facetsOf = (name) => {
	const tool = TOOLS.find((t) => t.name === name);
	if (!tool) return {
		facets: [],
		tool: void 0
	};
	const props = tool.inputSchema.properties ?? {};
	const required = new Set(tool.inputSchema.required ?? []);
	const textbook = (prop) => {
		const vals = [];
		for (const e of EXAMPLES) if (e.tool === name && prop in e.arguments) {
			const v = e.arguments[prop];
			if (!vals.some((x) => JSON.stringify(x) === JSON.stringify(v))) vals.push(v);
		}
		return vals;
	};
	return {
		facets: Object.entries(props).filter(([prop]) => prop !== "selftest").map(([prop, spec]) => {
			const tb = textbook(prop);
			if (Array.isArray(spec.enum)) return {
				property: prop,
				kind: "enum",
				required: required.has(prop),
				values: spec.enum,
				domain: `one of ${spec.enum.length}`,
				space: spec.enum.length
			};
			if (spec.type === "boolean") return {
				property: prop,
				kind: "boolean",
				required: required.has(prop),
				values: [false, true],
				domain: "false or true",
				space: 2
			};
			if ((spec.type === "integer" || spec.type === "number") && typeof spec.minimum === "number" && typeof spec.maximum === "number") {
				const size = spec.type === "integer" ? spec.maximum - spec.minimum + 1 : Infinity;
				const values = spec.type === "integer" && size <= 24 ? Array.from({ length: size }, (_, i) => spec.minimum + i) : [.../* @__PURE__ */ new Set([
					spec.minimum,
					...tb.filter((v) => typeof v === "number"),
					spec.maximum
				])];
				return {
					property: prop,
					kind: "range",
					required: required.has(prop),
					values,
					domain: `${spec.type} in [${spec.minimum}, ${spec.maximum}]${values.length < size ? ` (${values.length} shown: the ends and the textbook's; any value in the range is yours to type)` : ""}`,
					space: size
				};
			}
			if (tb.length) return {
				property: prop,
				kind: "textbook",
				required: required.has(prop),
				values: tb,
				domain: `${tb.length} value(s) the textbook uses`,
				space: tb.length
			};
			return {
				property: prop,
				kind: "free",
				required: required.has(prop),
				values: [],
				domain: `${spec.type ?? "any"}: free, no value enumerable`,
				space: Infinity
			};
		}),
		tool
	};
};
var dashboard = toolOf("tree", {
	name: "dashboard",
	description: "A bounded tool laid out whole, so the user's decision in the UI is final: every value each property admits (an enum, a boolean, an integer range, the ends of a numeric bound, the textbook's values where a string is free), the whole space reachable by fixing one facet at a time (each cell narrows the dashboard until one combination remains, whose cell is its walk page /u/<uuid>), every cell drawn by its own UUID's CSS. Without a tool: every tool with the size of its space.",
	inputSchema: {
		type: "object",
		properties: {
			tool: {
				type: "string",
				description: "the tool to lay out; omit for the index of all"
			},
			fixed: {
				type: "object",
				description: "the facets already decided; the dashboard shows the rest"
			},
			origin: { type: "string" }
		}
	},
	run: (args) => {
		const origin = typeof args.origin === "string" ? args.origin : "";
		if (typeof args.tool !== "string") return {
			tools: TOOLS.length,
			index: TOOLS.map((t) => {
				const { facets } = facetsOf(t.name);
				const enumerable = facets.filter((f) => f.values.length);
				return {
					tool: t.name,
					toolbox: t.toolbox,
					facets: facets.length,
					enumerable: enumerable.length,
					free: facets.filter((f) => f.kind === "free").map((f) => f.property),
					combinations: enumerable.reduce((n, f) => n * f.values.length, 1),
					space: facets.some((f) => f.space === Infinity) ? "unbounded" : facets.reduce((n, f) => n * f.space, 1),
					dashboard: `${origin}/u/${uuidOf(`dashboard${JSON.stringify({ tool: t.name })}`)}`
				};
			})
		};
		const { facets, tool } = facetsOf(args.tool);
		if (!tool) throw new Error(`no tool ${args.tool}`);
		const fixed = args.fixed && typeof args.fixed === "object" ? args.fixed : {};
		const enumerable = facets.filter((f) => f.values.length);
		const open = enumerable.filter((f) => !(f.property in fixed));
		const freeRequired = facets.filter((f) => f.kind === "free" && f.required && !(f.property in fixed)).map((f) => f.property);
		const space = enumerable.reduce((n, f) => n * f.values.length, 1);
		const next = open.filter((f) => f.required).length ? open.filter((f) => f.required) : open.slice(0, 1);
		let combos = [{ ...fixed }];
		for (const f of next) combos = combos.flatMap((c) => f.values.map((v) => ({
			...c,
			[f.property]: v
		})));
		const final = (c) => enumerable.every((f) => f.property in c);
		const cells = combos.map((c) => {
			const leaf = final(c);
			const id = leaf ? uuidOf(`${args.tool}${JSON.stringify(c)}`) : uuidOf(`dashboard${JSON.stringify({
				tool: args.tool,
				fixed: c
			})}`);
			return {
				arguments: c,
				uuid: id,
				url: `${origin}/u/${id}`,
				final: leaf,
				vars: varsOf$1(id)
			};
		});
		const chip = (text, style = "") => `<span style="display:inline-block; padding: 2px 8px; margin: 2px; border-radius: 999px; background: var(--surface-1); font-size: var(--font-size-footnote); ${style}">${text.replace(/[&<>]/g, (ch) => ({
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;"
		})[ch])}</span>`;
		const html = `<div style="display: grid; gap: var(--gap-md);"><div role="heading" aria-level="3">${args.tool}: ${space.toLocaleString("en-US")} combination(s) of ${enumerable.length} facet(s), ${Object.keys(fixed).length} fixed, ${cells.length} cell(s) here${freeRequired.length ? `; ${freeRequired.join(", ")} is yours to type` : ""}</div>` + facets.map((f) => `<div data-facet="${f.property}"><strong>${f.property}</strong> <small>${f.domain}${f.required ? ", required" : ""}${f.property in fixed ? `, fixed to ${JSON.stringify(fixed[f.property])}` : ""}</small><div>${f.values.map((v) => chip(JSON.stringify(v), f.property in fixed && JSON.stringify(fixed[f.property]) === JSON.stringify(v) ? "outline: 2px solid var(--a432-accent);" : "")).join("")}${f.values.length ? "" : chip("free")}</div></div>`).join("") + `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--gap-sm, 6px);">${cells.map((c) => `<a href="${c.url}" data-block="${c.uuid}" style="${Object.entries(c.vars).map(([k, v]) => `${k}: ${v}`).join("; ")}; display: block; border-left: 3px solid var(--qpu-accent); padding: 4px 8px; border-radius: var(--radius); background: var(--surface-1); color: var(--text-primary); text-decoration: none; font-size: var(--font-size-footnote);" title="${c.uuid}">${c.final ? "▶ " : "▸ "}${Object.entries(c.arguments).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(" ").replace(/[&<>"]/g, (ch) => ({
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"\"": "&quot;"
		})[ch]) || "no arguments"}</a>`).join("")}</div></div>`;
		return {
			tool: args.tool,
			facets: facets.length,
			enumerable: enumerable.length,
			fixed: Object.keys(fixed).length,
			combinations: space,
			cells: cells.length,
			final: cells.filter((c) => c.final).length,
			space: facets.some((f) => f.space === Infinity) ? "unbounded" : facets.reduce((n, f) => n * f.space, 1),
			freeRequired,
			facetList: facets,
			cellList: cells.map(({ arguments: a, uuid, url, final: leaf }) => ({
				arguments: a,
				uuid,
				url,
				final: leaf
			})),
			html
		};
	},
	widget: (d) => d.html ?? `<div style="display: grid; gap: var(--gap-sm, 6px);"><div role="heading" aria-level="3">${d.tools} tools, each laid out whole</div>${(d.index ?? []).map((i) => `<a href="${i.dashboard}" style="display: block; padding: 4px 8px; background: var(--surface-1); border-radius: var(--radius); color: var(--text-primary); text-decoration: none;">${i.tool}: ${i.combinations} combination(s), space ${i.space}</a>`).join("")}</div>`
});
/** No-cloning unlocks the cloning of toolsets: the quantum state of a computation cannot be copied (all_noclone, kernel-checked),
* so what is cloned is never the state but its classical description — and a toolbox is exactly that: its toolset (names,
* descriptions, schemas), its skillset (instructions, directions, examples) and its selftest, a document any host mounts or
* any client walks as doors by discovery. */
var clone = toolOf("tree", {
	name: "clone",
	description: "A toolbox cloned whole: its toolset (every tool's name, description and schema), its skillset (idea, instructions, directions, examples with what they show), and its selftest run now, as one document another host mounts or a client follows door by door. The quantum state of a computation is never cloned (all_noclone); its classical description is, and this is it. Without a toolbox: every toolbox's clone address.",
	inputSchema: {
		type: "object",
		properties: {
			toolbox: {
				type: "string",
				description: "the toolbox to clone; omit for the index"
			},
			as: {
				type: "string",
				description: "the name the clone carries at its new host"
			}
		}
	},
	run: (args, ctx) => {
		if (typeof args.toolbox !== "string") return {
			toolboxes: TOOLBOXES.length,
			theorem: "all_noclone",
			index: TOOLBOXES.map((b) => ({
				toolbox: b.name,
				tools: b.tools.length,
				examples: EXAMPLES.filter((e) => b.tools.some((t) => t.name === e.tool)).length,
				clone: `/u/${uuidOf(`clone${JSON.stringify({ toolbox: b.name })}`)}`
			}))
		};
		const box = TOOLBOXES.find((b) => b.name === args.toolbox);
		if (!box) throw new Error(`no toolbox ${args.toolbox}; the toolboxes are ${TOOLBOXES.map((b) => b.name).join(", ")}`);
		const examples = EXAMPLES.filter((e) => box.tools.some((t) => t.name === e.tool)).map((e) => ({
			id: e.id,
			tool: e.tool,
			arguments: e.arguments,
			shows: e.shows,
			theorem: e.theorem ?? null
		}));
		const selftest = box.skill.selftest(ctx);
		const doc = {
			name: typeof args.as === "string" ? args.as : box.name,
			clonedFrom: box.name,
			idea: box.idea,
			toolset: box.tools.map((t) => ({
				name: t.name,
				description: t.description,
				inputSchema: t.inputSchema
			})),
			skillset: {
				instructions: box.skill.instructions,
				directions: box.skill.directions,
				examples
			},
			selftest: {
				passed: selftest.passed,
				checks: selftest.checks.length
			},
			license: LICENSE.spdx,
			author: LICENSE.author,
			theorem: "all_noclone"
		};
		return {
			toolbox: box.name,
			as: doc.name,
			tools: box.tools.length,
			examples: examples.length,
			selftestPassed: selftest.passed,
			bytes: JSON.stringify(doc).length,
			id: uuidOf(`toolbox${JSON.stringify(doc)}`),
			noCloning: "the quantum state of a computation cannot be cloned (all_noclone: coins ≠ mintOf coins, kernel-checked); its classical description can, and this document is that description",
			doc
		};
	},
	widget: flowWidget
});
var TOOLBOXES = [
	{
		name: "google",
		idea: "the Google Quantum AI layer: the Willow processor as its spec sheet states it, Cirq gates and circuits, Quantum Echoes, the roadmap, the software, the statements and the repositories",
		tools: OWN.filter((t) => t.toolbox === "google"),
		examples: [],
		skill: {
			instructions: "Call any tool with the arguments its schema names; every result is a block (widget, Open Graph, shadcn item) under the licence; the examples page is the documentation and the tests.",
			directions: ["server only: every example replays as documented (the audit)"],
			selftest: (ctx) => {
				const checks = ctx.examples.filter((e) => OWN.some((t) => t.name === e.tool && t.toolbox === "google")).map((e) => {
					const r = ctx.handle({
						jsonrpc: "2.0",
						id: 1,
						method: "tools/call",
						params: {
							name: e.tool,
							arguments: e.arguments
						}
					});
					const why = "error" in r ? r.error.message : e.expect(r.result.structuredContent);
					return {
						id: `google:${e.id}`,
						passed: why === null,
						evidence: why ?? e.shows
					};
				});
				return {
					passed: checks.every((c) => c.passed),
					checks
				};
			}
		}
	},
	{
		name: "tree",
		idea: "the tree knows itself: its leads, its self-audit, any statement matched or proved impossible, the Clay register recomputed, any UUID verified cheaply, its metrics in real time",
		tools: [
			...OWN.filter((t) => t.toolbox === "tree"),
			metrics,
			textbook,
			css,
			dashboard,
			clone
		],
		examples: [],
		skill: {
			instructions: "audit replays every example and every toolbox selftest; match decides any statement; verify checks a UUID against its seal, content and neighbours; clay recomputes the register; leads lists what is owed.",
			directions: ["server only: the audit audits the audit", "toolbox → toolbox: match is the judge of readiness and the engine of imagine"],
			selftest: (ctx) => {
				const m = matchOf("How many qubits does Willow have?", ctx.handle, ctx.examples, ctx.leads);
				return {
					passed: m.verdict === "served",
					checks: [{
						id: "tree:match-serves",
						passed: m.verdict === "served",
						evidence: `${m.verdict} via ${m.tool}`
					}]
				};
			}
		}
	},
	FLOW,
	LANGUAGE,
	RAID,
	BILLING,
	LEGAL,
	REPOSITORY,
	STANDARDS_BOX,
	PAYLOAD,
	EXTENSION
];
var TOOLS = TOOLBOXES.flatMap((b) => b.tools);
var CONTEXT = {
	get handle() {
		return handle;
	},
	get examples() {
		return EXAMPLES;
	},
	get leads() {
		return LEADS;
	}
};
var keyOfQubit = (q) => q.kind === "grid" ? `grid:${q.row},${q.col}` : q.kind === "line" ? `line:${q.x}` : `named:${q.name}`;
/** Answer one JSON-RPC message: initialize, tools/list, or tools/call. Anything else is method not found. */
var handle = (message) => {
	const id = message.id ?? null;
	const fail = (code, text) => ({
		jsonrpc: "2.0",
		id,
		error: {
			code,
			message: text
		}
	});
	const params = message.params ?? {};
	try {
		if (message.method === "initialize") return {
			jsonrpc: "2.0",
			id,
			result: {
				protocolVersion: "2025-06-18",
				capabilities: { tools: {} },
				serverInfo: {
					name: "qpu",
					version: "1.4.0",
					license: LICENSE.spdx,
					author: LICENSE.author
				},
				instructions: `${INSTRUCTIONS}\n\nToolboxes: ${TOOLBOXES.map((b) => `${b.name} (${b.tools.map((t) => t.name).join(", ")}): ${b.idea}. ${b.skill.instructions}`).join("\n")}`
			}
		};
		if (message.method === "tools/list") return {
			jsonrpc: "2.0",
			id,
			result: { tools: TOOLS.map(({ name, description, inputSchema, toolbox }) => ({
				name,
				description,
				inputSchema,
				_meta: { toolbox }
			})) }
		};
		if (message.method === "tools/call") {
			const found = TOOLS.find((t) => t.name === params.name);
			if (!found) return fail(METHOD_NOT_FOUND, `no tool ${String(params.name)}; the tools are ${TOOLS.map((t) => t.name).join(", ")}`);
			const args = params.arguments ?? {};
			const address = uuidOf(`${found.name}${JSON.stringify(args)}`);
			const cached = found.name === "metrics" ? void 0 : BALANCER.get(address);
			const started = Date.now();
			NESTED.push(0);
			const { structured, widget } = cached ?? found.call(args, CONTEXT);
			if (!cached) BALANCER.set(address, {
				structured,
				widget
			});
			const children = NESTED.pop() ?? 0;
			const elapsed = Date.now() - started;
			if (NESTED.length) NESTED[NESTED.length - 1] += elapsed;
			const o = OBSERVED.get(found.name) ?? {
				calls: 0,
				misses: 0,
				ms: 0,
				bytes: 0
			};
			o.calls += 1;
			if (!cached) {
				o.misses += 1;
				o.ms += elapsed - children;
				o.bytes += widget.length + JSON.stringify(structured).length;
			}
			OBSERVED.set(found.name, o);
			const block = blockOf(found.name, args, structured, widget, found.description);
			const prev = typeof params._meta?.prev === "string" ? params._meta.prev : void 0;
			return {
				jsonrpc: "2.0",
				id,
				result: {
					content: [{
						type: "text",
						text: JSON.stringify(structured)
					}],
					structuredContent: structured,
					isError: false,
					_meta: {
						jsonLd: blockJsonLdOf({
							tool: found.name,
							id: block.id,
							description: found.description.slice(0, 300),
							toolbox: found.toolbox,
							url: `urn:uuid:${block.id}`
						}),
						payload: found.name === "payload" ? void 0 : payloadDocOf({
							uuid: block.id,
							tool: found.name,
							arguments: args,
							description: found.description.slice(0, 300),
							openGraph: block.openGraph,
							prev: typeof params._meta?.prev === "string" ? params._meta.prev : null
						}),
						widget: block.html,
						openGraph: {
							...block.openGraph,
							...prev ? { "og:see_also": prev } : {}
						},
						block: block.shadcn,
						theme: block.theme,
						license: LICENSE,
						...prev ? { prev } : {}
					}
				}
			};
		}
		return fail(METHOD_NOT_FOUND, `method ${message.method} is not served`);
	} catch (error) {
		return fail(INVALID_PARAMS, error instanceof Error ? error.message : String(error));
	}
};
export { channelOf$2 as a, sealOf as c, hueOf as d, translateOf as i, uuidFromParts as l, EXAMPLES as n, compileOf as o, LOCALES as r, reflectionOf as s, handle as t, accentOfUuid as u };
