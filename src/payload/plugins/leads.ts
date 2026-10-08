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
    where: 'permaculture',
    why: 'The registered family is perma, three faces. The word permaculture is not that name. horticulture is not used in its place.',
  },
  {
    where: 'perma-registry',
    why: 'src/families/perma/index.ts registers the three faces. src/mcp/families.ts and package.json sideEffects do not yet name that module. Suites are using dist, so the generators were not run.',
  },
  {
    where: 'perma.family',
    why: 'A tenant label under the zone is one word with no dot. perma.family is the client. The slug is perma. The Payload tenants collection is emitted only in combinations that include the multi-tenant plugin.',
  },
  {
    where: 'gate.leads',
    why: 'gate.leads is the lead walk. src/families/gate/test.ts calls push(0), not leads, so leads is not called. The gateway is the lead list already recorded.',
  },
  {
    where: 'cmi-rules-8',
    why: '§8(a): CMI may determine that no Prize be awarded, that a Prize be awarded to one person, or that a Prize be divided. No award is recorded. The prize is not a usage charge.',
  },
]
