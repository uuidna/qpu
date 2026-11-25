// A page for every product of the catalog: the theorem, the receipt that is its id, and its variants, each worked example from each
// witness. The paths and the rows come from the catalog itself (src/quantum/processing/catalog.ts), so a theorem the kernel gains has its
// page at the next build and nothing here is written by hand. The page is served at the product's id, the same id its REST document has.
// The seed writes site/catalog/[product].paths.ts, which re-exports these routes: every file of the site outside .vitepress is the seed's.
import { defineRoutes } from 'vitepress'
import { catalogProduct } from '../../src/quantum/processing/catalog.ts'
import { EXAMPLES } from '../../src/quantum/processing/examples.ts'
import { THEOREMS } from '../../src/quantum/processing/theorems-index.ts'
import { LICENSE } from '../../src/quantum/processing/unit/license.ts'

const cell = (text: string) => text.replace(/\|/g, '\\|').replace(/\s+/g, ' ')
const table = (head: readonly string[], rows: readonly (readonly string[])[]) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`)]
export default defineRoutes({
  paths: () => THEOREMS.map((t) => {
    const p = catalogProduct(EXAMPLES, t.key)
    const facts = [['product', `\`${p.product.id}\``], ['theorem', `\`${t.key}\``], ['module', `\`${t.module}\``], ['examples', String(p.examples.length)], ['witnesses', String(p.witnesses.length)], ['variants', String(p.variants.length)], ['price', '0'], ['funding', LICENSE.donation], ['licence', LICENSE.spdx], ['document', `/api/products/${p.product.id}`]]
    const content = [
      '::: v-pre', '', ...table(['', ''], facts), '', '```lean', t.statement, '```', '',
      ...(p.examples.length ? ['## examples', '', ...table(['example', 'tool', 'address'], p.examples.map((e) => [`\`${e.example}\``, e.tool, `\`${e.address}\``])), '', '## variants', '', ...table(['example', 'witness', 'variant', 'address'], p.variants.map((v) => [`\`${String(v.data.example)}\``, String(v.data.witness), `\`${v.id}\``, `\`${String(v.data.address)}\``])), ''] : []),
      ':::', '',
    ].join('\n')
    return { params: { product: p.product.id, theorem: t.key, module: t.module, statement: t.statement, variants: String(p.variants.length) }, content }
  }),
  // the page's title is the theorem and its description the statement the kernel holds
  transformPageData: (pageData) => { const params = pageData.params as { theorem?: string; statement?: string } | undefined; return params?.theorem ? { title: params.theorem, description: params.statement } : undefined },
})
