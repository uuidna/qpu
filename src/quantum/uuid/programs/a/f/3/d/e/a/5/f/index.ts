// The licence, carried by architecture: every result, block, receipt and page names it, so generated content attributes
// its author wherever it travels. CC-BY-NC-ND-4.0: attribute the author, no derivatives, commercial use by licence.
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { TABLES } from '../../../../../../../../1/2/a/4/3/2/a/8/index.ts'

export const LICENSE = TABLES.LICENSE

/** The evidence of precedence and prior art, by DOI: the author's records, each read by the datacite and doi.org verifiers of the wave; no cap on how many
 *  are cited, and the compete and prior-art doors cite them all. What a record states is the record's; the tools judge the rules. */
export const PRECEDENCE = TABLES.PRECEDENCE as unknown as readonly { doi: string; title: string; year: number; states: string }[]

/** The MCP `instructions` every client receives at initialize. */
export const INSTRUCTIONS = proseFill(PROSE.quantumProcessingUnitLicense_s1, LICENSE.author, LICENSE.spdx, LICENSE.url, LICENSE.terms)

/** The attribution line rendered at the foot of every widget. */
export const attributionHtml = (): string =>
  `<p data-license="${LICENSE.spdx}" style="font-size: var(--font-size-footnote, 11px); color: var(--text-secondary); margin: var(--gap-sm, 6px) 0 0;">© <a href="${LICENSE.orcid}" style="color: inherit;">${LICENSE.author}</a> · <a href="${LICENSE.url}" style="color: inherit;">${LICENSE.spdx}</a> · commercial use by licence (${LICENSE.contact})</p>`
