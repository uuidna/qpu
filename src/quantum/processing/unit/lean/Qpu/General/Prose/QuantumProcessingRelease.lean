/-! # Qpu.General.Prose.QuantumProcessingRelease
The prose of `src/quantum/processing/release.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingRelease_says1 : String := "the post was not published by this change, so no release is posted"
def quantumProcessingRelease_says2 : String := "no release token is configured, so the post is published and no release is posted"
def quantumProcessingRelease_says3 : String := "release ⟦0⟧ is posted for the published post; Zenodo archives it as a new version under the concept DOI ⟦1⟧"
def quantumProcessingRelease_says4 : String := "the release was refused with status ⟦0⟧, so the DOI is not refreshed; the post stays published"
def quantumProcessingRelease_says5 : String := "Published with the post ⟦0⟧. Zenodo archives this release as a new version under the concept DOI ⟦1⟧."

end Prose
