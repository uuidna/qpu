// The licence, carried by architecture: every result, block, receipt and page names it, so generated content attributes
// its author wherever it travels. CC-BY-NC-ND-4.0: attribute the author, no derivatives, commercial use by licence.

export const LICENSE = {
  spdx: 'CC-BY-NC-ND-4.0',
  url: 'https://uuidna.com/license',
  deed: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  /** the unit's content address of the licence and its imprint, from the uuidna MCP get_rights door */
  address: '9ffcda04-5adc-872e-9358-6b831bbd0c0d',
  imprint: '459a7ef3-7a8b-8d8e-893a-099292addcd5',
  canonical: 'https://uuidna.com',
  copyright: '© 2025 Tsvetan Rouschev (https://orcid.org/0009-0000-7312-9778)',
  representation: 'uuidna is represented by https://uuidna.com only; no handle or profile elsewhere speaks for the work unless licensed in writing by the author.',
  disclaimer: 'Recomputable facts, not legal advice: the inputs a qualified attorney starts from, never the conclusion.',
  author: 'Tsvetan Rouschev',
  orcid: 'https://orcid.org/0009-0000-7312-9778',
  contact: 'https://qpu.uuidna.com (the author, through the site; no address is kept in the tree: the deployer\'s is read from the Cloudflare account at build and deploy)',
  work: '@uuidna/qpu',
  attribution: 'Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)',
  terms: 'Attribute the author; do not distribute a derivative; commercial use of the QPU framework, over UUID or by any other means, requires a licence from the author (https://qpu.uuidna.com). The a432 harmonic default is offered for free benefit under attribution. Every block carries its address and its SHA-256: a copy that no longer matches them is adapted material, which the NoDerivatives term does not let anyone share.',
} as const

/** The MCP `instructions` every client receives at initialize. */
export const INSTRUCTIONS = `Content served by this server is © ${LICENSE.author} under ${LICENSE.spdx} (${LICENSE.url}). ${LICENSE.terms} Every result carries _meta.license; keep it with the content.`

/** The attribution line rendered at the foot of every widget. */
export const attributionHtml = (): string =>
  `<p data-license="${LICENSE.spdx}" style="font-size: var(--font-size-footnote, 11px); color: var(--text-secondary); margin: var(--gap-sm, 6px) 0 0;">© <a href="${LICENSE.orcid}" style="color: inherit;">${LICENSE.author}</a> · <a href="${LICENSE.url}" style="color: inherit;">${LICENSE.spdx}</a> · commercial use by licence (${LICENSE.contact})</p>`
