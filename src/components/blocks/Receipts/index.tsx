import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import { receiptsOf } from '@/app/_data'
import { receiptFactsOf } from '@uuidna/qpu/core/showcase.js'
import type { ReceiptsBlock } from '@/payload-types'

/** Every committed receipt, found by name, and the scalar facts it records. */
export function Receipts({ heading, intro, anchor, facts }: ReceiptsBlock) {
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {receiptsOf().map((r) => (
          <Card key={r.file}>
            <CardHeader className="pb-2"><CardTitle className="font-mono text-sm">{r.file}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {receiptFactsOf(r.doc).slice(0, facts ?? 8).map((f) => (
                <div key={f.key} className="contents">
                  <span className="truncate text-muted-foreground">{f.key}</span>
                  <span className="truncate text-right font-mono" title={f.value}>{f.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </BlockWrapper>
  )
}
