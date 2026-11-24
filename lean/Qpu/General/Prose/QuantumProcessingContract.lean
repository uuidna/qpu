/-! # Qpu.General.Prose.QuantumProcessingContract
The prose of `src/quantum/processing/contract.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingContract_ambiguous : String := "⟦0⟧ takes one alternative per call and this call names ⟦1⟧: ⟦2⟧. They are alternatives, each answered by a call of its own; nothing was computed."
def quantumProcessingContract_stray : String := "⟦0⟧ was called with ⟦1⟧ beside ⟦2⟧, and they do not combine: ⟦1⟧ combines with ⟦3⟧. Nothing was computed."
def quantumProcessingContract_alternatives : String := "The inputs of ⟦0⟧ are alternatives: one call names one of them, with only the inputs listed beside it under x-alternatives. Two alternatives in one call, or an input beside an alternative it does not combine with, are refused with the code ambiguous_arguments and the names of the inputs at fault."
def quantumProcessingContract_output : String := "The keys the ⟦0⟧ worked example(s) of this tool answer with, each with the JSON types seen there. An answer to other arguments may carry further keys. A refusal is { error, code, kind } with isError true, never this shape."
def quantumProcessingContract_outputNone : String := "This tool has no worked example yet, so only the outer shape is stated: an object. A refusal is { error, code, kind } with isError true."
def quantumProcessingContract_internal : String := "The tool failed inside the server: ⟦0⟧. The arguments are not at fault, and asking again with the same arguments fails the same way."
def quantumProcessingContract_limit : String := "limit: the most leads one answer carries, 1 to 500. The answer names next, the offset of the page that follows, or null on the last page."
def quantumProcessingContract_offset : String := "offset: how many matching leads to pass over before the first one answered, 0 unless given. Use the next of the previous answer."
def quantumProcessingContract_tool : String := "tool: only the leads whose door is this tool, by its name in tools/list."
def quantumProcessingContract_summary : String := "summary: true answers the counts alone (by status and by tool, with the total and how many match) and no lead, a few hundred bytes."
def quantumProcessingContract_paged : String := "limit is an integer from 1 to 500 and offset an integer from 0."
def quantumProcessingContract_state : String := "computes from its arguments and writes nothing that outlives the call; an answer may be kept in the memory of the process that computed it"
def quantumProcessingContract_fresh : String := "draws fresh randomness when no seed is given, so two calls with the same arguments differ"
def quantumProcessingContract_clock : String := "reads the clock and the process's own counters, so two calls with the same arguments differ"
def quantumProcessingContract_showsSummary : String := "The leads as counts alone: no lead is listed, and the counts by status and by tool sum to the total."
def quantumProcessingContract_showsPage : String := "The first five open leads and the offset of the page that follows."
def quantumProcessingContract_showsTool : String := "The leads of one door alone, counted: those whose tool is processor."

end Prose
