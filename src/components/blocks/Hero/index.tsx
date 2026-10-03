import { Badge } from '@/components/ui/badge'
import { CMSLinks } from '@/components/CMSLink'
import { docOf } from '@/app/_data'
import type { HeroBlock } from '@/payload-types'

/** The opening: badge, the heading and its highlighted half, the text (else the documentation index's), the links. */
export async function Hero({ badge, heading, emphasis, text, links, anchor }: HeroBlock) {
  const lead = text || (await docOf('index'))?.meta?.description || ''
  return (
    <section id={anchor || undefined} className="space-y-6">
      {badge ? <Badge variant="secondary" className="font-mono">{badge}</Badge> : null}
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
        {heading} {emphasis ? <span className="text-primary">{emphasis}</span> : null}
      </h1>
      {lead ? <p className="max-w-2xl text-lg text-muted-foreground">{lead}</p> : null}
      <CMSLinks links={links} />
    </section>
  )
}
