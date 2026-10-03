import Link from 'next/link'
import type React from 'react'
import { Button } from '@/components/ui/button'
import { hrefOf } from '@/fields/link'

type LinkValue = Parameters<typeof hrefOf>[0]
type Appearance = 'default' | 'outline' | 'ghost' | 'link' | 'text'

/** A link field rendered: a referenced page or doc at its slug, or the URL; as a button or as text. */
export function CMSLink({ link, appearance = 'text', className, children }: { link: LinkValue; appearance?: Appearance; className?: string; children?: React.ReactNode }) {
  const href = hrefOf(link)
  const label = children ?? link?.label
  const external = /^https?:\/\//.test(href)
  const inner = external ? <a href={href} className={className}>{label}</a> : <Link href={href} className={className}>{label}</Link>
  if (appearance === 'text') return inner
  return <Button asChild variant={appearance}>{inner}</Button>
}

/** A row of links as buttons: the first primary, the second outlined, the rest quiet. */
export function CMSLinks({ links }: { links?: { link: LinkValue; id?: string | null }[] | null }) {
  const look: Appearance[] = ['default', 'outline']
  return links?.length ? (
    <div className="flex flex-wrap gap-3">
      {links.map(({ link, id }, i) => <CMSLink key={id ?? i} link={link} appearance={look[i] ?? 'ghost'} />)}
    </div>
  ) : null
}
