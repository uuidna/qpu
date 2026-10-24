/**
 * THE SCRIPTS' TYPES, WRITTEN AS SHAPES AND ADDRESSED BY UUID.
 *
 * Each type is a shape here. scripts/gen-types.ts turns every shape into a TypeScript interface in types.gen.ts, and
 * gives it the content UUID of its canonical shape (contentUuidOf). So a type is named by what it says, not by the
 * file it is written in: change one field and its UUID changes, which is how a reader knows two scripts mean the same
 * thing by the same name. Nothing here is computed by a formula; the address is a content hash.
 *
 * Grammar: a field name ending in `?` is optional. A type is a primitive (string, number, boolean, unknown), another
 * name in this file, or either followed by `[]` for an array. `Dict` is Record<string, string>.
 */
export const TYPES: Record<string, Record<string, string>> = {
  Lead: { source: 'string', what: 'string', owes: 'string' },
  Source: { source: 'string', reached: 'boolean', why: 'string', settled: 'number', open: 'Lead[]' },
  Flaw: { id: 'string', 'severity?': 'string', 'state?': 'string', 'owes?': 'string' },
  Run: { workflow: 'string', status: 'string', 'conclusion?': 'string', 'sha?': 'string', 'id?': 'number', 'step?': 'string' },
  Door: { name: 'string', ok: 'boolean', 'holds?': 'boolean', 'denied?': 'unknown', 'monitor?': 'unknown', 'why?': 'string', 'shown?': 'Shown' },
  Shown: { 'holds?': 'boolean', 'denied?': 'unknown', 'monitor?': 'unknown', 'kind?': 'string', 'school?': 'School' },
  School: {
    'holds?': 'boolean',
    'subjects?': 'number',
    'domains?': 'number',
    'combinations?': 'number',
    'evidenced?': 'number',
    'undecided?': 'number',
    'seating?': 'Seating',
    'reading?': 'Reading[]',
  },
  Seating: { seated: 'Pair[]', crowded: 'Pair[]', 'rays?': 'number' },
  Pair: { subject: 'string', domain: 'string' },
  Reading: { 'swap?': 'string' },
  Manifest: { name: 'string', version: 'string', 'dependencies?': 'Dict', 'devDependencies?': 'Dict' },
  Registry: { 'dist-tags?': 'Dict', 'versions?': 'Map' },
  Tool: { name: 'string' },
  RpcResult: { 'structuredContent?': 'Shown', 'tools?': 'Tool[]', 'holds?': 'boolean', 'denied?': 'unknown', 'monitor?': 'unknown', 'kind?': 'string', 'school?': 'School' },
  Rpc: { 'result?': 'RpcResult' },
  Hit: { 'metadata?': 'Meta' },
  Meta: { 'version?': 'string' },
  Hits: { 'hits?': 'Hit[]' },
  Zenodo: { 'hits?': 'Hits' },
  Mount: { app: 'string', url: 'string' },
  WellKnown: { 'mounts?': 'Mount[]', 'peers?': 'Mount[]' },
  Monitor: { 'missing?': 'number', 'keys?': 'number' },
  Storage: { 'holds?': 'boolean', 'monitor?': 'Monitor' },
  Step: { 'name?': 'string', 'conclusion?': 'string' },
  Job: { 'steps?': 'Step[]' },
  Jobs: { 'jobs?': 'Job[]' },
  GhRun: { workflowName: 'string', status: 'string', 'conclusion?': 'string', headSha: 'string', databaseId: 'number' },
  Deposit: { 'flaws?': 'Flaw[]', 'from?': 'string' },
  Fetched: { ok: 'boolean', status: 'number', 'body?': 'unknown', 'error?': 'string' },
}
