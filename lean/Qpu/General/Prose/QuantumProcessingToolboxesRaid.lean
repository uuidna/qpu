/-! # Qpu.General.Prose.QuantumProcessingToolboxesRaid
The prose of `src/quantum/processing/toolboxes/raid.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingToolboxesRaid_statement1 : String := "binding ⟦0⟧ degraded (⟦1⟧% verified, ⟦2⟧ missing, ⟦3⟧ differing): rebuild it from a verified copy"
def quantumProcessingToolboxesRaid_says2 : String := "⟦0⟧ disk(s)/binding(s) self-monitored against bit 0: ⟦1⟧; ⟦2⟧ entr(y/ies) on two or more copies, ⟦3⟧ rebuild(s), ⟦4⟧ binding(s) not healthy — the Payload admin lists each disk's SMART attributes and the degraded ones as leads"
def quantumProcessingToolboxesRaid_description3 : String := "The ported MongoDB over the docket, pure. find: {collection, docs, filter, sort, skip, limit} → the matching documents (Mongo operators, dotted paths, $and/$or/$nor). insert: {collection, docs: [new]} → the entries to write, content-addressed. update: {collection, docs, filter, update} → for each match the new document and the entry that replaces it (linked to the old). delete: {collection, docs, filter} → the ids to delete, if unlinked. mirror: {collection, docs} → binding 0's files (hex folders g1/g2/g3/<uuid> by the UUID's middle, the R2 and GCS key, and the collection's pointer); restore: {collection, files} → the documents read back, each verified by its address; verify: {copies: {binding: files}} → every copy against bit 0, the rebuilds and the moves to the middle-part folders. health: {copies} → SMART self-monitoring, each binding a disk with its attributes (verified, reallocated = missing, pending = differing), the RAID healthy/degraded/failed, the degraded disks as rebuild leads for the Payload admin. The client reads the docket rows and writes what comes back."
def quantumProcessingToolboxesRaid_description4 : String := "the Rails guide Active Record Associations as Payload fields: { type: belongs_to | has_one | has_many | has_many_through | has_one_through | has_and_belongs_to_many | polymorphic | self_join | sti | delegated_type, owner, name, target?, targets?, through?, on?, inverse?, optional?, subtypes?, dependent?, counterCache?, touch? } answered with the fields each side carries and the option hooks"
def quantumProcessingToolboxesRaid_description5 : String := "the Rails guide Active Record Validations as Payload field options or a validate function: { name, helper: absence | acceptance | confirmation | comparison | format | inclusion | exclusion | length | numericality | presence | uniqueness | validates_associated | validates_each | validates_with, options? }"
def quantumProcessingToolboxesRaid_description6 : String := "restore: binding 0's files as read, path → text"
def quantumProcessingToolboxesRaid_description7 : String := "verify: each binding's files, binding → path → text"
def quantumProcessingToolboxesRaid_description8 : String := "the collection's documents as read from the docket (their bodies)"
def quantumProcessingToolboxesRaid_note9 : String := "the docket refuses a delete while anything links the entry; a linked document is kept as history"
def quantumProcessingToolboxesRaid_s10 : String := "op ⟦0⟧ is not one of find, insert, update, delete, mirror, restore, verify"
def quantumProcessingToolboxesRaid_idea11 : String := "the docket as a database: MongoDB's query and update language ported as pure functions over content-addressed entries, so any document framework (Payload first) stores on the RAID through its mongodb adapter"
def quantumProcessingToolboxesRaid_shows12 : String := "A Mongo filter over documents read from the docket: operators, array membership, sort; the match is computed here, the storage is the docket."
def quantumProcessingToolboxesRaid_shows13 : String := "An update computed as a new document and a new entry linked to the one it replaces: entries are immutable and content-addressed, so history is kept."
def quantumProcessingToolboxesRaid_instructions14 : String := "A client that is a database adapter (Payload's mongodb adapter interface) reads a collection's rows from the docket (GET /docket?collection=…, the bodies), calls mongo with the op and the rows, and writes the entries the tool returns (POST /docket, writer role) or deletes the ids (DELETE, admin role; a linked entry is refused and kept). Every query is pure and recomputable; every write is content-addressed and linked to what it replaces."
def quantumProcessingToolboxesRaid_s15 : String := "server only: the query language on a sample collection"
def quantumProcessingToolboxesRaid_s16 : String := "toolbox → toolbox: entries are addressed with the tree's uuid and verified by the tree toolbox's verify"
def quantumProcessingToolboxesRaid_s17 : String := "client → server: the rows come from the docket; the entries go back to it"
def quantumProcessingToolboxesRaid_s18 : String := "or sorted by title (Quantum Echoes before Sycamore), dotted path, regex, in, nin, exists"
def quantumProcessingToolboxesRaid_s19 : String := "skip and limit only when asked; no cap otherwise"
def quantumProcessingToolboxesRaid_s20 : String := "set, inc, push, unset; the source document untouched"
def quantumProcessingToolboxesRaid_s21 : String := "same content, same address; a replacement links what it replaces"
def quantumProcessingToolboxesRaid_s22 : String := "an operator not ported throws, never guesses"
def quantumProcessingToolboxesRaid_s23 : String := "SMART: each binding a self-monitored disk — filesystem healthy, r2 missing one (degraded, rebuildable), the RAID degraded with one rebuild lead"
def quantumProcessingToolboxesRaid_s24 : String := "is the wrong length (should be ⟦0⟧ characters)"

end Prose
