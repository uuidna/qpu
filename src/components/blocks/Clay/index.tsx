import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import { clayOf } from '@uuidna/qpu/core/showcase.js'
import { receipts } from '@/receipts'
import type { ClayBlock } from '@/payload-types'

type Row = { name: string; pass: boolean; value: string; receipt: string }
/** The problem's formula in the clay family, by the problem's key. */
const FORMULA: Record<string, string> = { p_vs_np: 'pVsNp', hodge_conjecture: 'hodge', riemann_hypothesis: 'riemann', yang_mills: 'yangMills', navier_stokes: 'navierStokes', bsd_conjecture: 'bsd' }

/** The Millennium Prize Problems with two verdicts each and nothing else: the σ-involution seal, VERIFIED when the
 *  committed clay receipt recomputed it at its address on the host (clay.pass: every related formula found in one
 *  pass, OEIS looked up, the record researched), and the Millennium claim itself, UNVERIFIED. */
export function Clay({ heading, intro, anchor }: ClayBlock) {
  const receipt = receipts.find((r) => r.name === 'clay-receipt')?.doc as { when?: string; host?: string; receipt?: string; record?: string; rows?: Row[] } | undefined
  const rowOf = (key: string) => receipt?.rows?.find((r) => r.name === `clay.${FORMULA[key] ?? ''}`)
  return (
    <BlockWrapper heading={heading} intro={`${intro ? `${intro} ` : ''}${receipt ? `Seals recomputed on ${receipt.host ?? 'the host'} on ${receipt.when}: ${receipt.rows?.filter((r) => r.pass).length ?? 0} of ${receipt.rows?.length ?? 0} VERIFIED; ${receipt.record ?? ''}; receipt ${receipt.receipt ?? ''}.` : 'No clay receipt committed yet: run node scripts/receipt.mjs clay.'}`} anchor={anchor}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clayOf().map((p) => {
          const row = rowOf(p.key)
          const seal = row ? row.value.replace(/^seal: (UN)?VERIFIED \(/, '').replace(/\); claim: UNVERIFIED.*$/, '') : ''
          const hex = /hex ([0-9a-f-]{36})/.exec(row?.value ?? '')?.[1]
          return (
            <Card key={p.key}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <Badge variant={p.status === 'CLAIMED' ? 'secondary' : 'default'}>{p.status === 'CLAIMED' ? 'claim: UNVERIFIED' : `solved${p.solver ? ` · ${p.solver}${p.year ? `, ${p.year}` : ''}` : ''}`}</Badge>
                </div>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {row ? <p><Badge variant={row.pass ? 'default' : 'outline'}>seal: {row.pass ? 'VERIFIED' : 'UNVERIFIED'}</Badge> <span className="text-muted-foreground">{seal}</span></p> : p.status === 'CLAIMED' ? <p className="text-muted-foreground">seal: not in the committed receipt</p> : null}
                {hex ? <p><Link href={`/${hex}`} className="font-mono text-primary hover:underline">{hex}</Link></p> : null}
                {p.claim ? <p className="text-muted-foreground">{p.claim}</p> : null}
                {p.source ? <a href={p.source} className="text-primary hover:underline">the claim (UNVERIFIED) →</a> : null}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </BlockWrapper>
  )
}
