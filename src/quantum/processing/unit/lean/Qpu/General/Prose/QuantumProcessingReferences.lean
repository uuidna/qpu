/-! # Qpu.General.Prose.QuantumProcessingReferences
The prose of `src/quantum/processing/references.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingReferences_says1 : String := "⟦0⟧ document(s), ⟦1⟧ reference(s): ⟦2⟧; the condensation of ⟦3⟧ node(s) is acyclic and ordered⟦4⟧⟦5⟧"
def quantumProcessingReferences_s2 : String := "⟦0⟧ cycle(s) fused into one node each (⟦1⟧)"
def quantumProcessingReferences_s3 : String := "; ⟦0⟧ name(s) claimed by two documents, resolved to none"
def quantumProcessingReferences_rbac4 : String := "per tenant: the scope is the tenant, read under its rolify role, so a cache entry serves only its own tenant"
def quantumProcessingReferences_how5 : String := "a query served from its content address is a 304 with no recompute and no AI binding call — Cloudflare cost minimised"
def quantumProcessingReferences_says6 : String := "⟦0⟧ reference(s) across ⟦1⟧ tenant scope(s) (⟦2⟧ links, ⟦3⟧ SEO auto-references via hooks, ⟦4⟧ AI binding call(s)), indexed by scope and combination and cached by query hash: ⟦5⟧ distinct address(es), ⟦6⟧ served from an existing address (the 304 involution, ⟦7⟧ a saved AI binding call) — Cloudflare cost minimised, each tenant's cache read under its rolify role"

end Prose
