/-! # Qpu.General.Prose.ScriptsDoiRecord
The prose of `scripts/doiRecord.ts`, which writes the record Zenodo archives with every release and the release note
from the same build. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def scriptsDoiRecord_achieved : String := "What is achieved"
def scriptsDoiRecord_kernel : String := "⟦0⟧ theorems are checked by the Lean kernel: ⟦1⟧ written by hand and ⟦2⟧ by the compiler. Of those written by hand, ⟦3⟧ rest on no axiom beyond Lean's own propext, Classical.choice and Quot.sound."
def scriptsDoiRecord_families : String := "The theorems written by hand, by family: ⟦0⟧."
def scriptsDoiRecord_catalogue : String := "⟦0⟧ textbook theorems, and a catalogue of ⟦1⟧ products in ⟦2⟧ variants, each product a theorem of the kernel."
def scriptsDoiRecord_served : String := "⟦0⟧ tools are served over MCP, and the audit replays ⟦1⟧ worked examples against them; every answer is a block sealed under its UUID."
def scriptsDoiRecord_novelties : String := "Novelties"
def scriptsDoiRecord_noveltyLead : String := "Each novelty is a theorem the kernel checks and the tree declares new, proposed for Mathlib:"
def scriptsDoiRecord_proposed : String := "⟦0⟧: ⟦1⟧"
def scriptsDoiRecord_unprecedented : String := "Laws no earlier DOI-registered work was found to state"
def scriptsDoiRecord_unprecedentedLead : String := "⟦0⟧ laws of the textbook, each proved by the kernel, for which the search found no earlier DOI-registered work; ⟦1⟧ more are claimed and wait for the kernel."
def scriptsDoiRecord_novelty : String := "⟦0⟧, proved in ⟦1⟧: ⟦2⟧"
def scriptsDoiRecord_open : String := "Claimed and not yet proved"
def scriptsDoiRecord_openClaim : String := "⟦0⟧: ⟦1⟧ Proved so far: ⟦2⟧. What is still missing: ⟦3⟧"
def scriptsDoiRecord_claim : String := "⟦0⟧: ⟦1⟧ What is still missing: ⟦2⟧"
def scriptsDoiRecord_funding : String := "Funding"
def scriptsDoiRecord_donation : String := "Every call to a host that names no x402 wallet is free and asks for a donation at ⟦0⟧."
def scriptsDoiRecord_paid : String := "A host that names a wallet charges ⟦0⟧ USD per call through x402, the cheapest real quantum call on the market."
def scriptsDoiRecord_licence : String := "The work is licensed ⟦0⟧; commercial use needs a licence from the author: ⟦1⟧."
def scriptsDoiRecord_calls : String := "Prizes and funds open now or on a rolling basis, as the compete door last read their rules:"
def scriptsDoiRecord_call : String := "⟦0⟧ (⟦1⟧, entry ⟦2⟧, read ⟦3⟧): ⟦4⟧. Rules: ⟦5⟧"
def scriptsDoiRecord_title : String := "⟦0⟧ v⟦1⟧: ⟦2⟧"
def scriptsDoiRecord_s1 : String := ".zenodo.json differs from what the build writes: run lake run index and commit the result"

end Prose
