/**
 * What cannot live inside a plugin. A lead is not a failure and not a hold: the thing is named, and why it is outside.
 * Nothing here is forced green, and nothing here is given a second non-plugin path that pretends to cover it.
 */

export type PayloadLead = { where: string; why: string }

export const payloadLeadsOf = (): readonly PayloadLead[] => [
  {
    where: 'db',
    why: 'Payload\'s database adapter is the config\'s db field (DatabaseAdapter). It is not a Plugin, so qpu-raid, qpu-d1, d1 and postgres stay on the combination\'s db axis.',
  },
  {
    where: 'storage',
    why: 'Payload 4 takes storage adapters in storage: [], not plugins. r2 and s3 stay on the combination\'s storage axis.',
  },
  {
    where: 'email',
    why: 'Payload\'s email adapter is the config\'s email field (EmailAdapter). Resend stays on the combination\'s email axis.',
  },
  {
    where: 'secret',
    why: 'Payload reads config.secret. It is not a plugin and it is not a value this tree may invent.',
  },
  {
    where: 'industry-margin',
    why: 'No industry margin rate is cited. accounting.margin, costing.margin, ecommerce.margin and financial.margin compute a percentage from two amounts; none of them names a constant rate, and no source the unit already reads cites one. The usage bill keeps a margin place and does not fill it.',
  },
  {
    where: 'bulbank',
    why: 'Bulbank is not the upgrade. The registry snapshot does not name it, there is no approved API, and no host is called.',
  },
  {
    where: 'post-quantum-primitive',
    why: 'The crypt door still runs x25519 and ed25519, and crypt.knownAnswers still checks those RFC vectors. The tree names no replacement algorithm. The upgrade is crypt.curveQuantumBits (security_q = 0 under theorem shor), not a second implementation.',
  },
  {
    where: 'path.quantumSecurityChain',
    why: 'That path hops quantum, qsec, enterprise, med. It is one domain path. It is not the upgrade every domain receives.',
  },
  {
    where: 'uuidna/payload',
    why: 'The private payload repo keeps its own plugin copies. The upgrade path is payload:cf --repo, which rewrites this repo\'s generated config and does not write into that tree.',
  },
  {
    where: 'legal.citation',
    why: 'scripts/receipt.mjs sets citation.holds to false and citation.lead to true on the statement "clay solved in august", with the words "This file is a naming scheme. It solves none of the problems it names." qpuPublicOf().prize is false. That claim is not flipped.',
  },
  {
    where: 'cmi-rules-4a',
    why: 'Clay Mathematics Institute, Rules for the Millennium Prize Problems (26 September 2018) §4(a): CMI may award a Prize if and only if "the Proposed Solution has been published by a Qualifying Outlet." §6(a): a Qualifying Outlet is a refereed mathematics publication of worldwide repute meeting §6(e), or a publication meeting a relaxed set of conditions approved by the Board of Directors following a Scientific Advisory Board recommendation. §6(c): "CMI does not maintain a list of publications that meet the requirements in Section 4(a), and will not certify that any particular publication meets its requirements." The archive this unit cites is Zenodo. That is not recorded here as a Qualifying Outlet.',
  },
  {
    where: 'cmi-rules-4b',
    why: '§4(b): "at least two (2) years have elapsed since publication of the Proposed Solution in a Qualifying Outlet." §7(a)(i)(2): the Proposed Solution "must survive rigorous examination by the global mathematics community for a minimum of two (2) years." No Qualifying Outlet publication date is recorded from which those two years have elapsed.',
  },
  {
    where: 'cmi-rules-4c',
    why: '§4(c): "the Proposed Solution has achieved general acceptance in the global mathematics community, as determined in the sole discretion of CMI." §7(a)(i)(3): "No CMI-affiliated entity will accept invitations, requests or demands to recognize the status of a Proposed Solution." No such determination is recorded.',
  },
  {
    where: 'cmi-rules-4d',
    why: '§4(d): "the Proposed Solution has satisfactorily answered the questions raised by the Problem\'s official description, as determined in the sole discretion of CMI." §5(a): only a complete mathematical solution to a Problem as defined in its official description is eligible, and completeness "shall be determined in the sole discretion of CMI." The clay seals recompute. They are not that determination. src/mcp/clay-automated-solver.ts names solutions and a prize figure; that file is not an award.',
  },
  {
    where: 'cmi-rules-5e',
    why: '§5(e): "CMI will not accept Proposed Solutions submitted directly to CMI and is under no obligation to provide explanation or justification." No solution is submitted.',
  },
  {
    where: 'sound',
    why: 'The registry has no family named sound. The reading is audio.samples, the call src/families/audio/test.ts already makes.',
  },
  {
    where: 'health',
    why: 'The registry has no family named health. The reading is med.gcs, the call src/families/med/test.ts already makes.',
  },
  {
    where: 'crypto-door',
    why: 'The crypto door formulas (crypto_shor and the rest) have no family test that supplies arguments. Those calls are skipped. The crypto reading is crypt.knownAnswers, which src/families/crypt/test.ts runs with no parameters.',
  },
  {
    where: 'clay-video',
    why: 'The tree names no Clay video address. googleapis.com:youtube and youtubeAnalytics have no read without parameters; youtubereporting, vimeo.com and api.video answered 401; the kinesis-video rows have no read without parameters. None of those hosts is called. A lecture is not parsed, and it is not a prize. cinema.frames, cinema.aspect and media.caption remain the video path.',
  },
  {
    where: 'open-math',
    why: 'The clay seals recompute in CLAY_SEALS order. clay.bsd(15) is the author\'s seal arithmetic, recomputed. legal.citation for "clay solved in august" is holds false, lead true, and the file says it solves none of the problems it names. That row is a lead. It is not a proof of the negation. qpuPublicOf().prize is false: a prize is a lead. No Institute award is recorded in this tree. That absence is not a proof the claim is false. Nothing is submitted.',
  },
  {
    where: 'permaculture',
    why: 'The registered family is perma, three faces. The word permaculture is not that name. horticulture is not used in its place.',
  },
  {
    where: 'perma-registry',
    why: 'src/families/perma/index.ts registers the three faces. src/mcp/families.ts and package.json sideEffects do not name that module, so a cold tools/call door perma.coins does not resolve. The permaculture fuse returns the readings in its document. Suites are using dist, so the generators were not run.',
  },
  {
    where: 'perma.family',
    why: 'A tenant label under the zone is one word with no dot. perma.family is the client. The slug is perma. The Payload tenants collection is emitted only in combinations that include the multi-tenant plugin.',
  },
  {
    where: 'secured-connector',
    why: 'googleapis.com:books and nytimes.com:books_api are secured. They are not fused and they are not called. A storage write needs a bearer the public caller is not given. The porting table names stdio and qpuHarnessesOf has no stdio row.',
  },
  {
    where: 'connector-efficiency',
    why: 'No formula counts examined connectors. benchmark.efficiency, usability.efficiency, electrical.efficiency, mechanical.efficiency and transformer.efficiency take two amounts, and none of their tests passes a connector count. No efficiency number is minted. patent.novelty is not called. law.reviewed(0) is unconfirmed, so novelty is not on the usage bill.',
  },
  {
    where: 'audit-temperature',
    why: 'The named temperature is QPU_TEMPERATURE_MILLIKELVIN. No MCP door takes it. tools/call train returns the sealed standards counts. scripts/examine.mjs is the live HTTP examination and was not run.',
  },
  {
    where: 'product-variant',
    why: 'src/families/ecommerce/index.ts has no variant formula. No family is named product. No registered formula name contains both product and variant. src/payload-types.ts names variants and variantOptions and no hex is registered for them. combinatorics.binomial of the plugin axis is unchanged: no variant factor is applied.',
  },
  {
    where: 'form-country',
    why: 'src/payload-types.ts registers a Country form field. The type carries no options list. src/components/CMSForm/index.tsx does not invent one.',
  },
  {
    where: 'form-state',
    why: 'src/payload-types.ts registers a State form field. The type carries no options list. src/components/CMSForm/index.tsx does not invent one.',
  },
  {
    where: 'ui-separator',
    why: 'src/components/ui/separator.tsx is not imported by a page or a block.',
  },
  {
    where: 'ui-tabs',
    why: 'src/components/ui/tabs.tsx is not imported by a page or a block.',
  },
  {
    where: 'locale',
    why: 'src/payload-types.ts sets locale and fallbackLocale to null. locale.locales is not given a count from that file.',
  },
  {
    where: 'payload-jobs',
    why: 'src/payload-types.ts names jobs.tasks. src/blocks has no jobs block. No count of those tasks is passed to a formula.',
  },
  {
    where: 'gate.leads',
    why: 'gate.leads is the lead walk. src/families/gate/test.ts calls push(0), not leads, so leads is not called. The gateway is the lead list already recorded.',
  },
  {
    where: 'page-referer',
    why: 'src/collections/Pages.ts fields are title, slug, description, and layout. Nested-docs adds parent and breadcrumbs. No referer field is on the page.',
  },
  {
    where: 'pager',
    why: 'src/families/pagination/index.ts registers pagerange. No pager component is under src/components.',
  },
  {
    where: 'vitepress-sidebar',
    why: 'src/deployment/payload-cloudflare.ts writes vitepress/.vitepress/config.ts as defineConfig({ title, description, cleanUrls: true }). That config names no sidebar and no next.',
  },
  {
    where: 'shared-config-next',
    why: 'src/mcp/families.ts is the shared config that imports every family index. It names no next.',
  },
  {
    where: 'cmi-rules-8',
    why: '§8(a): CMI may determine that no Prize be awarded, that a Prize be awarded to one person, or that a Prize be divided. No award is recorded. The prize is not a usage charge.',
  },
  {
    where: 'tag',
    why: 'No family is named tag. No registered formula computes the words "proven by clay solutions". cache.tagbits and crypt.tagForgery do not. The badge shows the clay seal reading (hex, value, holds). No tag family is minted. Clay registers 8 formulas. The nibble cap is 15.',
  },
  {
    where: 'badge',
    why: 'No family is named badge. The badge is src/components/ui/badge.tsx. It shows the seal reading.',
  },
  {
    where: 'network-machine',
    why: 'src/quantum/processing/unit/index.ts qpuNetworkMcpOf has hop, when, lanes, routes, channels, and holds. qpuComputerOf network has kind, href, hop, and holds. Neither has a slot for a machine row. The net_* doors stay on that catalog. qpuMachinesOf in src/quantum/processing/unit/zeropage.ts keeps the machine list. unit.host stays the unit host. No second network is added. cloud.scale holds when perNode > 0. scale(100, 0) holds false, value 0.',
  },
]
