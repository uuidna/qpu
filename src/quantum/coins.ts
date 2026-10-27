// The coins paid, accounted by the payer: every gated call to the unit deposits coins at the wire and says so in its answer
// ("gate CLEAN … · deposit 2 · <receipt>", and _meta.audit with the gate). The unit's own register is per process and reports
// silence, which is not a finding that nobody paid; so this tree reads the deposit from every answer it receives and keeps
// the ledger, one line per call, content-addressed by the call and its gate. Pure parsing; the clients append.
type Deposit = { door: string; deposit: number; gate: string | null; receipt: string | null; clean: boolean | null; surface: string | null }
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g

/** The deposit a raw JSON-RPC answer of the unit states, or zero when it states none (a refusal, a non-gated door). */
export const depositOf = (door: string, body: unknown): Deposit => {
  const r = (body as { result?: { content?: { type: string; text?: string }[]; _meta?: { audit?: { clean?: boolean; surface?: string; gate?: string } } } } | undefined)?.result
  const line = r?.content?.map((c) => c.text ?? '').find((t) => /\bdeposit \d+\b/.test(t)) ?? ''
  const deposit = Number(/\bdeposit (\d+)\b/.exec(line)?.[1] ?? 0)
  const ids = line.match(UUID) ?? []
  return { door, deposit, gate: r?._meta?.audit?.gate ?? ids[0] ?? null, receipt: ids[1] ?? null, clean: r?._meta?.audit?.clean ?? null, surface: r?._meta?.audit?.surface ?? null }
}
/** A ledger summed: calls, coins, by door; and the account's own address over its lines. */
export const accountOf = (lines: readonly (Deposit & { date?: string })[]): { calls: number; coins: number; byDoor: Record<string, number>; gated: number; unclean: number } => ({
  calls: lines.length, coins: lines.reduce((n, l) => n + l.deposit, 0), byDoor: lines.reduce<Record<string, number>>((acc, l) => ({ ...acc, [l.door]: (acc[l.door] ?? 0) + l.deposit }), {}), gated: lines.filter((l) => l.deposit > 0).length, unclean: lines.filter((l) => l.clean === false).length,
})
