import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import { productsOf } from '@/app/_data'
import { licenseManageOf } from '@/payload/plugins/public'
import type { ProductsBlock } from '@/payload-types'

/** The published products and their prices, or that they are priced on request. */
export async function Products({ heading, intro, anchor }: ProductsBlock) {
  const products = await productsOf()
  const license = licenseManageOf()
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="secondary">{p.priceInUSDEnabled && p.priceInUSD ? `$${(p.priceInUSD / 100).toFixed(2)}` : 'priced on request'}</Badge>
              <p className="font-mono text-xs text-muted-foreground">{license.spdx} · share {license.share} · {license.reviewed.formula}({license.reviewed.params.join(',')}) = {license.reviewed.value} · holds {String(license.reviewed.holds)} · {license.reviewed.note} · lead</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </BlockWrapper>
  )
}
