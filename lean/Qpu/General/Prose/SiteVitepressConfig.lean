/-! # Qpu.General.Prose.SiteVitepressConfig
The prose of `site/.vitepress/config.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def siteVitepressConfig_webApi : String := "Model Context Protocol server over Streamable HTTP; every call is free on ⟦0⟧"
def siteVitepressConfig_card : String := "ISO/IEC 4879 quantum vocabulary, Lean-proved, as MCP tools; every call is free on ⟦0⟧"
def siteVitepressConfig_endpoint : String := "Model Context Protocol, Streamable HTTP transport (POST JSON-RPC), protocol versions ⟦0⟧. Every method, tools/call included, is free on ⟦1⟧: no payment is asked."
def siteVitepressConfig_citeAuthor : String := "⟦0⟧, ORCID ⟦1⟧"
def siteVitepressConfig_citeWork : String := "DOI ⟦0⟧, every version"
def siteVitepressConfig_citeRecord : String := "DOI ⟦0⟧, cited as the author's own record"

def siteVitepressConfig_possibilities : String := "VitePress possibilities"
def siteVitepressConfig_possibilitiesSays : String := "Every possibility the installed VitePress offers and how this site uses each, computed at build from the package's own types, exports and components and from this site's config and theme."
end Prose
