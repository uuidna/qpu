/-! # Qpu.General.Prose.QuantumUuidProgramsPatchesIndex
The prose of `src/quantum/uuid/programs/patches/index.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumUuidProgramsPatchesIndex_why1 : String := "the local auth strategy is rewritten to hash with the QPU digest (600000 PBKDF2-SHA256 iterations with a pure fallback where the host caps the count, then an HKDF seal under PAYLOAD_SECRET) and to verify such hashes; the pure fallback is robustness, the secret seal and the storage-adapter shim in config/build.js are features"
def quantumUuidProgramsPatchesIndex_title2 : String := "auth: fall back to a pure PBKDF2-SHA256 when the host rejects the configured iteration count"
def quantumUuidProgramsPatchesIndex_body3 : String := "workerd caps a single crypto.pbkdf2 call at 100000 iterations and throws past it. generatePasswordSaltHash maps that error to an InvalidConfiguration asking for auth.passwordHashIterations = 100000, which lowers the budget for every host. This change keeps the configured count and runs the same PBKDF2-SHA256 in pure JavaScript when the host rejects it, so a Worker and a server derive the same hash. Verification follows the same path. No change to stored hashes or prefixes."
def quantumUuidProgramsPatchesIndex_remedy4 : String := "keep the secret seal out of core: a beforeChange hook on the users collection (Payload docs, Hooks › Collection hooks) that hashes and seals before the local strategy sees the password, and an auth strategy (Authentication › Custom strategies) that verifies QPU hashes; storage adapters go to config.storage, not plugins"
def quantumUuidProgramsPatchesIndex_why5 : String := "the 4.0.0-beta.7 package exports TableFeature only as EXPERIMENTAL_TableFeature; the patch adds the plain name beside it"
def quantumUuidProgramsPatchesIndex_why6 : String := "the package exports no workerd condition, so its Node shims load on Cloudflare Workers and fail; the patch adds the workerd export conditions pointing at the shims the package already ships"
def quantumUuidProgramsPatchesIndex_title7 : String := "server: export the workerd shims under a workerd condition"
def quantumUuidProgramsPatchesIndex_body8 : String := "The package ships dist/shimsWorkerd.* but its exports map names no \"workerd\" condition, so a Cloudflare Worker resolves the Node shims and fails at load. This adds the workerd condition for the ESM and CJS entries, pointing at the shims already built. No runtime change on Node."
def quantumUuidProgramsPatchesIndex_s9 : String := "no rule names this package: judged a feature until one does"
def quantumUuidProgramsPatchesIndex_s10 : String := "name the package in PATCH_RULES with its kind, or drop the patch"
def quantumUuidProgramsPatchesIndex_statement11 : String := "⟦0⟧@⟦1⟧ is patched for a ⟦2⟧, which the rule toward upstream does not allow: ⟦3⟧"

end Prose
