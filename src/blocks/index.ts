import type { Block } from 'payload'
import { Archive } from './Archive/index.js'
import { Banner } from './Banner/index.js'
import { CallToAction } from './CallToAction/index.js'
import { Code } from './Code/index.js'
import { Content } from './Content/index.js'
import { FormBlock } from './FormBlock/index.js'
import { MediaBlock } from './MediaBlock/index.js'

/** The blocks the pages and posts build from, following payloadcms/website as upstream: one folder per block under
 *  src/blocks, each exporting its Block config (admin.group 'QPU'). payload.config filters this set into the lexical
 *  BlocksFeature (dropping the richText-bearing ones to avoid recursion) and the Pages/Posts `blocks` field reads it. */
export const blocks: Block[] = [Archive, Banner, CallToAction, Code, Content, FormBlock, MediaBlock]
