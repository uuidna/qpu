import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { licenseManageOf } from '@uuidna/qpu/payload/plugins'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'License and billing' },
  description: 'Reads are free and non-commercial use is open under CC-BY-NC-ND-4.0; commercial use and storage writes are licensed. Every term is a verified formula.',
  alternates: { canonical: '/license' },
  robots: { index: true, follow: true },
}

/** The licence, served lean from the unit's own reading (law.reviewed / law.lawful + the citation and the usage bill) —
 *  no Payload block. Each term links to its hex-program UUID so the page is its own proof. */
export default function License() {
  const l = licenseManageOf()
  return (
    <div className="qpu-machine space-y-8">
      <section id="license" className="space-y-3">
        <h1 className="text-2xl font-semibold">License and billing</h1>
        <p className="text-sm">
          <span className="font-mono">{l.spdx}</span> · {l.file} · share {l.share} ·{' '}
          <Link href={l.deed} className="text-primary hover:underline">the deed</Link>
        </p>
        <p className="text-sm text-muted-foreground">
          Reads of this host are free and non-commercial use is open. Commercial use and writes to the document store are
          licensed — request one at <Link href={l.commercial} className="text-primary hover:underline">{l.commercial}</Link>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">What the law permits, as formulas</h2>
        <p className="text-sm">
          <Link href={`/${l.reviewed.hex}`} className="font-mono text-primary hover:underline">{l.reviewed.formula}({l.reviewed.params.join(',')}) = {l.reviewed.value}</Link>
          <span className="ml-2 text-muted-foreground">holds {String(l.reviewed.holds)} · {l.reviewed.note}</span>
        </p>
        <p className="text-sm">
          <Link href={`/${l.lawful.hex}`} className="font-mono text-primary hover:underline">{l.lawful.formula}({l.lawful.params.join(',')}) = {l.lawful.value}</Link>
          {l.lawful.holds === true ? <Badge className="ml-2">holds</Badge> : <Badge variant="outline" className="ml-2">lead</Badge>}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Citation and billing</h2>
        <p className="text-sm text-muted-foreground">
          citation holds {String(l.citation.holds)} · lead {String(l.citation.lead)} · ledger {l.bill.units} · charged {l.bill.charged} · billed {l.bill.billed} · margin is a lead
        </p>
        <p className="text-sm text-muted-foreground">
          royalty {l.royalty.name} · host {l.royalty.host} · holds {String(l.royalty.holds)}
        </p>
      </section>
    </div>
  )
}
