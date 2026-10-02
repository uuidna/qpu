/**
 * The one rule set that seats every exported capability in a wing and names its evidence. Used to write the inline
 * frontmatter (@wing, @kind, @evidence) into the sources, and by the docs generator to read it back.
 */
export const WINGS = [
  ['lattice', 'Lattice & arithmetic', 'The register geometry and the exact integer arithmetic every other wing is built on.'],
  ['quantum', 'Quantum computation', 'Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof.'],
  ['proof', 'Formal proof (Lean)', 'index.lean served theorem by theorem, recomputed and typeset.'],
  ['crypto', 'Cryptography', 'Shor on 91, RSA factoring and the crypt split identity as callable doors.'],
  ['receipts', 'UUIDs & quantum receipts', 'Content-addressed identity and the receipt streams that record every computation.'],
  ['storage', 'Storage & database', 'RAID over Cloudflare KV and R2, content-addressed storage and the MongoDB-semantics document database.'],
  ['agents', 'MCP & agents', 'The MCP server, its tools and man pages, the sandbox, training and competition doors.'],
  ['science', 'Live science data', 'CERN Open Data, research APIs and citations read live with deadlines.'],
  ['fusion', 'API fusion', 'Every API in a registry crossed on field UUIDs into compositions, formulas and a graph state.'],
  ['cms', 'Payload & Cloudflare', 'Payload CMS on Workers in every combination, and the Payload readings the unit serves.'],
  ['presentation', 'Presentation & discovery', 'Stylesheets, schemas, SEO zones, citation and the documents a reader or crawler sees.'],
]
const RULES = [
  [/Fold|Receipt|ContentUuid|ShapeUuid|FieldUuid|Message|SeatHandle|ServedLedger|ServedMemo|^qpuContextOf$/, 'receipts'],
  [/Cube|Handle|Faces|Electronics|Balance|Capacity|Speed|^chooseOf|^tenOf/, 'lattice'],
  [/Encrypt|Cybersecurity/, 'crypto'],
  [/Lean|^quantumModeOf$|CrossReading/, 'proof'],
  [/Raid|PayloadDb|Storage|DocDb|DocStore/, 'storage'],
  [/Cern|Research|Citations|Teaching|ForeignReads|QPU_TEACHING/, 'science'],
  [/Fuse|Compose|Probe|^qpuCrossOf|GraphState|SchemaMethods|Apis/, 'fusion'],
  [/PayloadMcp|PayloadFind|Fusion|Intelligence|Cloudflare|cloudflare|CLOUDFLARE|PayloadTemplates|payloadTemplates/, 'cms'],
  [/Genesis|Pentagram|Access|Hologram|Css|Reflect|Presence|SeoZone|Cite|Schemas|WellKnown|Robots|Zone/, 'presentation'],
  [/Circuit|Computer|Quantum|Reading|Purpose|Evidence|Prove|Integrity|Neuro|Design|Vm|Sequence|Improve|Ideas/, 'quantum'],
  [/Man|Catalog|OutputSchema|Tools|Mcp|MCP|Docs|Efficiency|Sandbox|Forge|Train|Compete|Server|Network|Hosts|Install|Seat|Router|Occupant|PriorArt|Develop|UnknownTool/, 'agents'],
]
const FILE_WING = [
  [/docdb\.ts$|payload-qpu\.ts$/, 'storage'],
  [/lean-eval\.ts$/, 'proof'],
  [/payload-templates\.ts$/, 'cms'],
  [/uuid\.ts$|uuid-bridge\.ts$|uuid-programmable-core\.ts$/, 'receipts'],
  [/cross-domain-(formulas|paths)\.ts$/, 'fusion'],
]
export const wingOf = (name, file) => {
  for (const [re, w] of FILE_WING) if (re.test(file)) return w
  for (const [re, w] of RULES) if (re.test(name)) return w
  return 'agents'
}
export const kindOf = (name, line) =>
  /Holds$/.test(name) ? 'predicate'
  : /^export (type|interface) /.test(line) ? 'type'
  : /^export class /.test(line) ? 'class'
  : /Store$|DocStore/.test(name) ? 'store'
  : /Adapter$/.test(name) ? 'adapter'
  : /^[A-Z_]+$/.test(name) ? 'constant'
  : /Of$/.test(name) ? 'builder'
  : 'function'
export const FILES = [
  'src/quantum/processing/unit/index.ts', 'src/quantum/processing/unit/docdb.ts', 'src/quantum/processing/unit/lean-eval.ts',
  'src/db/payload-qpu.ts', 'src/deployment/payload-templates.ts', 'src/mcp/uuid-programmable-core.ts',
  'src/mcp/cross-domain-formulas.ts', 'src/mcp/cross-domain-paths.ts', 'src/core/uuid.ts', 'src/core/uuid-bridge.ts',
]
