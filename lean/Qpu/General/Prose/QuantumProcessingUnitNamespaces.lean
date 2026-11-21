/-! # Qpu.General.Prose.QuantumProcessingUnitNamespaces
The prose of `src/quantum/processing/unit/namespaces.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingUnitNamespaces_says1 : String := "no namespace named: the credential acts in every tenant it holds"
def quantumProcessingUnitNamespaces_says2 : String := "⟦0⟧ is not a namespace: lower-case letters, digits and dashes, starting with a letter"
def quantumProcessingUnitNamespaces_says3 : String := "the credential holds no row of ⟦0⟧: a namespace narrows, it never widens"
def quantumProcessingUnitNamespaces_says4 : String := "narrowed to ⟦0⟧: one tenant row⟦1⟧; every other tenant's records are out of reach"
def quantumProcessingUnitNamespaces_s5 : String := ", the all-tenants role dropped for this request"
def quantumProcessingUnitNamespaces_s6 : String := "a sandbox needs a name or an app address"
def quantumProcessingUnitNamespaces_says7 : String := "an MCP key bound to a user whose tenants row holds this tenant: the credential is the sandbox"
def quantumProcessingUnitNamespaces_writes8 : String := "every create names its tenant (tenant: <the tenant id>): the plugin fills it from the admin selector, not for an MCP request; a tenant other than the namespace is refused"
def quantumProcessingUnitNamespaces_measured9 : String := "on the local app through the Payload MCP (2026-10-26): a write in sandbox-a naming tenant a created, naming tenant b refused; read in sandbox-a 1, in sandbox-b 0; an unknown namespace 401"
def quantumProcessingUnitNamespaces_shared10 : String := "every collection the multi-tenant plugin does not scope is read as before; a namespace writes only into its own tenant"
def quantumProcessingUnitNamespaces_s11 : String := "a super admin creates the tenant (tenants are created by the admin role alone)"
def quantumProcessingUnitNamespaces_s12 : String := "the admin binds an MCP key to the app's user with a tenants row of this tenant"
def quantumProcessingUnitNamespaces_says13 : String := "⟦0⟧ as the namespace ⟦1⟧: its own tenant without a domain, ⟦2⟧ scoped collection(s) sandboxed, the header ⟦3⟧: ⟦4⟧ on every request"

end Prose
