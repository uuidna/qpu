import { GenericBlock, type GenericProps } from '../_generic'
import { docsOf } from '@/app/_data'
import { seoURLOf } from '@/collections/Docs'
import type { SliderBlock } from '@/payload-types'

/** A slider of items, each a title, a description and a link. The type is the doc article's: font-sans and the prose
 *  classes Doc already uses. Items the block stores stay. An empty slider presents each doc's SEO title, description
 *  and URL — the open-graph fields seoTitleOf, seoDescriptionOf and seoURLOf already fill. */
export async function Slider(props: SliderBlock) {
  const given = (props.items ?? []).flatMap((it) => (it ? [{ title: it.title ?? '', description: it.description ?? '', href: it.href ?? '' }] : []))
  let items = given
  if (items.length === 0) {
    try {
      items = (await docsOf()).map((d) => ({
        title: d.meta?.title || d.title,
        description: d.meta?.description || d.description || '',
        href: seoURLOf(d),
      }))
    } catch {
      items = []
    }
  }
  const { items: _stored, ...rest } = props
  return (
    <div className="space-y-6 font-sans">
      {await GenericBlock({ ...rest, items: null } as unknown as GenericProps)}
      {items.length ? (
        <div className="flex gap-4 overflow-x-auto">
          {items.map((it, i) => (
            <article key={it.href || i} className="prose prose-neutral max-w-3xl shrink-0 font-sans dark:prose-invert prose-a:text-primary">
              {it.title ? <h2>{it.title}</h2> : null}
              {it.description ? <p>{it.description}</p> : null}
              {it.href ? <p><a href={it.href}>{it.href}</a></p> : null}
            </article>
          ))}
        </div>
      ) : null}
    </div>
  )
}
