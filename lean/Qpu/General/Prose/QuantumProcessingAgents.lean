/-! # Qpu.General.Prose.QuantumProcessingAgents
The prose of `src/quantum/uuid/programs/b/c/5/7/4/c/5/b/index.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingAgents_usage : String := "{ calls: [{ tool, arguments?, address?, tokens?, bytes?, ms? }] }: the report of an agent's own calls, asked of shard, which the agent hands in and the server does not keep. It answers the totals, the calls asked again under one address (each a repeat the address serves with no computation), the ledger of time and space (computed calls debited in ms and bytes, repeats credited), the calls by tool, and the licence's own terms of attribution and commercial use beside them."
def quantumProcessingAgents_usageSays : String := "⟦0⟧ call(s), ⟦1⟧ distinct and ⟦2⟧ asked again: ⟦3⟧ ms and ⟦4⟧ byte(s) were computed, and ⟦5⟧ ms and ⟦6⟧ byte(s) need not have been, since an address already answered them (textbook_coins_coils_balanced)."
def quantumProcessingAgents_usageNeeds : String := "usage takes { calls }, a list of the agent's own calls, each with its tool"
def quantumProcessingAgents_agents : String := "agents: with list, how many agents share it. Every agent is answered at once: its index, its name, its own UUID address and the share of the list whose positions are its index modulo the count, so every item has exactly one agent (textbook_shards_cover, textbook_shards_disjoint). The count is at most the handles of the register at its third scale."
def quantumProcessingAgents_secret : String := "secret: with agents, a text only the agents know. It names their room, the SHA-256 of the secret and the group's address, for the send and receive tools where the Worker binds them. Without it no room is named, since a room's name is its only credential."
def quantumProcessingAgents_agentsRefused : String := "agents is a whole number from 1 to ⟦0⟧, the handles of the register at its third scale"
def quantumProcessingAgents_coordinateSays : String := "⟦0⟧ item(s) shared among ⟦1⟧ agent(s): every item has exactly one agent (textbook_shards_cover, textbook_shards_disjoint), the largest share is ⟦2⟧ and the smallest ⟦3⟧."
def quantumProcessingAgents_showsAgents : String := "Seven items shared among three agents at once: agent 1 holds b and e, every item has exactly one agent, and no room is named since no secret was given (textbook_shards_disjoint)."
def quantumProcessingAgents_showsRoom : String := "The same three agents with a secret: their room is named by the SHA-256 of the secret and the group's address, for the send and receive tools."
def quantumProcessingAgents_showsUsage : String := "An agent's own two calls, the second the first asked again: one is computed and debited, the other credited, since its address already answered it; nothing is kept (textbook_coins_coils_balanced)."

end Prose
