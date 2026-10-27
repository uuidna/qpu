// The licence, carried by architecture: every result, block, receipt and page names it, so generated content attributes
// its author wherever it travels. CC-BY-NC-ND-4.0: attribute the author, no derivatives, commercial use by licence.
import { TABLES } from './tables-index.ts'

export const LICENSE = TABLES.LICENSE

/** The evidence of precedence and prior art, by DOI: the author's records, each read by the datacite and doi.org verifiers of the wave; no cap on how many
 *  are cited, and the compete and prior-art doors cite them all. What a record states is the record's; the tools judge the rules. */
export const PRECEDENCE: readonly { doi: string; title: string; year: number; states: string }[] = [
  { doi: '10.5281/zenodo.21781602', title: 'All Seven Clay Millennium Problems Sealed via Universal σ-Involution', year: 2026, states: 'the author\'s record on the seven problems: the σ-involution and its bridge theorems' },
  { doi: '10.5281/zenodo.22700098', title: '@uuidna/qpu, all versions', year: 2026, states: 'the concept record of this software: every version a child DOI' },
  { doi: '10.5281/zenodo.23156998', title: '@uuidna/qpu v1.4.0', year: 2026, states: 'this version of the software: the exact, formally verified quantum processing unit served over MCP' },
]

/** The MCP `instructions` every client receives at initialize. */
export const INSTRUCTIONS = `Content served by this server is © ${LICENSE.author} under ${LICENSE.spdx} (${LICENSE.url}). ${LICENSE.terms} Every result carries _meta.license; keep it with the content.`

/** The attribution line rendered at the foot of every widget. */
export const attributionHtml = (): string =>
  `<p data-license="${LICENSE.spdx}" style="font-size: var(--font-size-footnote, 11px); color: var(--text-secondary); margin: var(--gap-sm, 6px) 0 0;">© <a href="${LICENSE.orcid}" style="color: inherit;">${LICENSE.author}</a> · <a href="${LICENSE.url}" style="color: inherit;">${LICENSE.spdx}</a> · commercial use by licence (${LICENSE.contact})</p>`
