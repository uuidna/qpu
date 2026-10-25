// Build-time data: the receipt stream, as the pages read it (createContentLoader is for markdown; this stream is NDJSON).
import { existsSync, readFileSync } from 'node:fs'
export type ReceiptRow = { id: string; date: string; head: string; steps: string; prev: string | null }
export default {
  watch: ['./public/receipts.ndjson'],
  load(): ReceiptRow[] {
    const file = 'docs/public/receipts.ndjson'
    if (!existsSync(file)) return []
    return readFileSync(file, 'utf8').split('\n').filter(Boolean).flatMap((line) => { try { const r = JSON.parse(line) as { id: string; date: string; head: string; prev?: string | null; steps: { name: string; status: string }[] }; return [{ id: r.id, date: r.date, head: r.head, prev: r.prev ?? null, steps: r.steps.map((s) => `${s.name}:${s.status[0]}`).join(' ') }] } catch { return [] } })
  },
}
declare const data: ReceiptRow[]
export { data }
