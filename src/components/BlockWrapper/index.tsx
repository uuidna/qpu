import type React from 'react'

/** Every block's frame: its anchor, heading and introduction, then what the block renders. */
export function BlockWrapper({ heading, intro, anchor, children }: { heading?: string | null; intro?: string | null; anchor?: string | null; children: React.ReactNode }) {
  return (
    <section id={anchor || undefined} className="scroll-mt-20 space-y-4">
      {heading || intro ? (
        <div className="space-y-1">
          {heading ? <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2> : null}
          {intro ? <p className="max-w-3xl text-sm text-muted-foreground">{intro}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}
