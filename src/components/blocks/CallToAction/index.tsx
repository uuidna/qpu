import { CMSLinks } from '@/components/CMSLink'
import type { CallToActionBlock } from '@/payload-types'

/** A heading, a line and the links to act on, in a frame. */
export function CallToAction({ heading, intro, anchor, links }: CallToActionBlock) {
  return (
    <section id={anchor || undefined} className="flex flex-col gap-4 rounded-xl border bg-muted/40 p-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        {heading ? <h2 className="text-xl font-semibold">{heading}</h2> : null}
        {intro ? <p className="text-sm text-muted-foreground">{intro}</p> : null}
      </div>
      <CMSLinks links={links} />
    </section>
  )
}
