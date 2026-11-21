/-! # Qpu.General.Prose.QuantumProcessingRepositories
The prose of `src/quantum/processing/repositories.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingRepositories_role1 : String := "This full-stack repo develops in src/ against payloadcms/website (12 collections, 30 blocks, 5 globals, 10 fields). Upstream github.com/payloadcms/website is the layout standard; qpuPlugin / qpuMcpPlugin mount feeds and MCP on /api/qpu/feeds and /api/mcp"
def quantumProcessingRepositories_role2 : String := "Payload CMS monorepo (45 packages under packages/* and official templates under templates/*): every plugin, database adapter, storage adapter, email adapter and lexical feature QPU mounts is a package from this monorepo"
def quantumProcessingRepositories_licence3 : String := "facts-only (names, paths, sizes)"
def quantumProcessingRepositories_role4 : String := "skill(name) MCP tools/call"
def quantumProcessingRepositories_role5 : String := "Develop in src/ to the payloadcms/website standard; configure { kind: \"fullstack\" } refreshes overlay files in this tree, not a second .qpu-app fork"
def quantumProcessingRepositories_upstreamTemplate6 : String := "payloadcms/payload/templates/website (Cloudflare D1 + R2)"
def quantumProcessingRepositories_consumes7 : String := "@uuidna/qpu + @uuidna/uuidna + @uuidna/school"
def quantumProcessingRepositories_role8 : String := "Cloudflare Workers D1+R2 multi-tenant deployment consuming @uuidna/qpu lattice/db/zone primitives alongside official @payloadcms/* plugins (nested-docs, seo, redirects, search, form-builder, mcp, import-export, storage-r2, db-d1-sqlite)"
def quantumProcessingRepositories_says9 : String := "All QPU surfaces consolidated around ⟦0⟧ github.com/payloadcms/* repositories (payloadcms/website, payloadcms/payload, payloadcms/skills): ⟦1⟧ of ⟦2⟧ monorepo packages mounted and mapped to QPU plugins/adapters, ⟦3⟧ agent skill references enacted, sealed at ⟦4⟧"

end Prose
