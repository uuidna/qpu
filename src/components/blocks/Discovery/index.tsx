import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import { IdentitiesTable, RelationsTable, SealsTable } from '@/components/Relations'
import { discoveryOf } from '@/app/_data'
import type { DiscoveryBlock } from '@/payload-types'

/** The discovery receipt: its totals, the cross-family solutions and the sequences several families share. */
export function Discovery({ heading, intro, anchor, limit }: DiscoveryBlock) {
  const d = discoveryOf()
  const cells: [string, number][] = [['families', d.families.length], ['hex programs run', d.runs], ['cross-family solutions', d.relationsTotal], ['fed by live data', d.liveRelations], ['sequences identified', d.sequences ?? 0], ['APIs walked live', d.apisWalked ?? 0], ['seals', d.seals.length]]
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cells.map(([label, value]) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardDescription>{label}</CardDescription>
              <CardTitle className="font-mono text-3xl">{value.toLocaleString('en')}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      {d.identities.length ? <IdentitiesTable rows={d.identities} /> : null}
      {d.seals.length ? (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Seals</h3>
          <p className="max-w-3xl text-sm text-muted-foreground">The Clay seals are σ-involutions: σ∘σ = id with named fixed points, and inverse pairs a · a⁻¹ = 1. These are the programs that return their own input; an involution or inverse pair is the identity on every input tried, not proven for all.</p>
          <SealsTable rows={d.seals} />
        </div>
      ) : null}
      <RelationsTable rows={limit ? d.relations.slice(0, limit) : d.relations} />
      <p className="text-xs text-muted-foreground">Generated {d.when} from {d.sourcesAgree} of {d.sources} live sources; the same run is the MCP tool <code className="font-mono">qpu_discover</code>.</p>
    </BlockWrapper>
  )
}
