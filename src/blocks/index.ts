import type { Block } from 'payload'
import { Archive } from './Archive/index.js'
import { Banner } from './Banner/index.js'
import { CallToAction } from './CallToAction/index.js'
import { Code } from './Code/index.js'
import { Content } from './Content/index.js'
import { CrossDomain } from './CrossDomain/index.js'
import { Family } from './Family/index.js'
import { FormBlock } from './FormBlock/index.js'
import { HexProgram } from './HexProgram/index.js'
import { MediaBlock } from './MediaBlock/index.js'
import { Section } from './Section/index.js'

/** The blocks the pages and posts build from. The presentation set follows payloadcms/website as upstream (Archive,
 *  Banner, CallToAction, Code, Content, FormBlock, MediaBlock); the combinatoric set is QPU's own — HexProgram (a
 *  family × program × params combination, the query itself), Family (a family's 15 formulas and its cross-domain
 *  experts, C(15, k) combinations), CrossDomain (the family → domain graph). One folder per block, admin.group 'QPU';
 *  payload.config filters this set into the lexical BlocksFeature (richText-bearing ones excluded) and the Pages/Posts
 *  `blocks` field reads it. Every combinatoric block renders by addressing a hex-program UUID — no bespoke query. */
export const blocks: Block[] = [Archive, Banner, CallToAction, Code, Content, CrossDomain, Family, FormBlock, HexProgram, MediaBlock, Section]
/** The minimal combinatorial basis: a page built from `Section` alone spans the presentational layouts by variant ×
 *  tone × columns, so fewer block types cover more compositions — Banner/CallToAction/Content are its special cases. */
export const minimal: Block[] = [Section, MediaBlock, Archive, FormBlock, HexProgram, Family, CrossDomain]
