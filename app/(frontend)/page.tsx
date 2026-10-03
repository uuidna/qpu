import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Atom, Database, FileText, Sigma } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { countsOf, docOf, docsOf, familiesOf, receiptsOf } from './_lib/qpu'
import { clayOf, receiptFactsOf, wingOf } from '@/dist/core/showcase.js'
import { SITE } from '@/src/payload/collections/docs'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const index = await docOf('index')
  return {
    title: { absolute: index?.meta?.title ?? SITE.name },
    description: index?.meta?.description ?? undefined,
    alternates: { canonical: SITE.origin },
    openGraph: { title: index?.meta?.title ?? SITE.name, description: index?.meta?.description ?? undefined, url: SITE.origin },
  }
}

const fmt = (x: bigint | number) => {
  const big = BigInt(x)
  if (big < 10n ** 9n) return Number(big).toLocaleString('en')
  const digits = big.toString()
  return `${digits[0]}.${digits.slice(1, 3)}×10${String(digits.length - 1).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]!)}`
}

export default async function Home() {
  const families = familiesOf()
  const index = await docOf('index')
  const docs = (await docsOf()).filter((d) => d.slug !== 'index')
  // the wings are the pages the documentation index links to: the index defines them, not a list here
  const linked = new Set([...(index?.markdown ?? '').matchAll(/\]\(([\w-]+)\.md\)/g)].map((m) => m[1]))
  const wings = docs.filter((d) => linked.has(d.slug)).flatMap((d) => { const w = wingOf(d.slug, d.markdown ?? ''); return w ? [w] : [] })
  const receipts = receiptsOf()
  const clay = clayOf()
  const totals = families.reduce(
    (t, f) => {
      const c = countsOf(f.formulas.length)
      return { formulas: t.formulas + c.formulas, compositions: t.compositions + c.compositions, programs: t.programs + c.programs }
    },
    { formulas: 0, compositions: 0, programs: 0n },
  )

  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <Badge variant="secondary" className="font-mono">RFC 9562 v8 · hex programs · quantum receipts</Badge>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Every formula is an address. <span className="text-primary">Every composition is a program.</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{index?.meta?.description ?? index?.description}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="#families">Explore the formulas <ArrowRight /></Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/data">Live data checks</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/index">Documentation</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Atom, label: 'formula families', value: fmt(families.length) },
          { icon: Sigma, label: 'formulas', value: fmt(totals.formulas) },
          { icon: Database, label: 'two-step compositions', value: fmt(totals.compositions) },
          { icon: FileText, label: 'programs of up to ten steps', value: fmt(totals.programs) },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2"><Icon className="size-4" /> {label}</CardDescription>
              <CardTitle className="font-mono text-3xl">{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">What QPU does</h2>
          <p className="text-sm text-muted-foreground">Each wing as its own page reports it: capabilities, the predicates that check them, and how many hold right now.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wings.map((w) => (
            <Link key={w.slug} href={`/${w.slug}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/60">
                <CardHeader>
                  <CardTitle className="text-base">{w.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{w.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {w.stats.map((s) => (
                    <div key={s.label} className="contents">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="text-right font-mono">{s.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Evidence</h2>
          <p className="text-sm text-muted-foreground">Every committed receipt and the facts it records. Each one is a node of the final build receipt in the README.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {receipts.map((r) => (
            <Card key={r.file}>
              <CardHeader className="pb-2">
                <CardTitle className="font-mono text-sm">{r.file}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {receiptFactsOf(r.doc).slice(0, 8).map((f) => (
                  <div key={f.key} className="contents">
                    <span className="truncate text-muted-foreground">{f.key}</span>
                    <span className="truncate text-right font-mono" title={f.value}>{f.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Clay Millennium Prize Problems</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            The author claims solutions to the Millennium Prize Problems, composed by the unit's cross formulas across its
            families. Each claim links to the document that states it, with its argument and verification status.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clay.map((p) => (
            <Card key={p.key}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <Badge variant={p.status === 'CLAIMED' ? 'secondary' : 'default'}>{p.status === 'CLAIMED' ? `claimed solved · ${p.claimedBy}` : `solved${p.solver ? ` · ${p.solver}${p.year ? `, ${p.year}` : ''}` : ''}`}</Badge>
                </div>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {p.approach ? <p><span className="text-muted-foreground">approach</span> <span className="font-mono">{p.approach}</span></p> : null}
                {p.claim ? <p className="text-muted-foreground">{p.claim}</p> : null}
                {p.crossFormulas.length ? <ul className="list-inside list-disc text-muted-foreground">{p.crossFormulas.map((f) => <li key={f} className="font-mono">{f}</li>)}</ul> : null}
                {p.source ? <a href={p.source} className="text-primary hover:underline">the claim →</a> : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="families" className="scroll-mt-20 space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Formula families</h2>
          <span className="text-sm text-muted-foreground">every family at its own name</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {families.map((f) => {
            const c = countsOf(f.formulas.length)
            return (
              <Link key={f.name} href={`/${encodeURIComponent(f.name)}`} className="group">
                <Card className="h-full transition-colors group-hover:border-primary/60">
                  <CardHeader>
                    <CardTitle className="font-mono">{f.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{f.formulas.map((x) => x.name).join(' · ')}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Badge variant="outline">{c.formulas} formulas</Badge>
                    <Badge variant="outline">{c.compositions} compositions</Badge>
                    <Badge variant="secondary" className="font-mono">{fmt(c.programs)} programs</Badge>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Documentation</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((d) => (
            <Link key={d.id} href={`/${d.slug}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/60">
                <CardHeader>
                  <CardTitle className="text-base">{d.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{d.meta?.description ?? d.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
