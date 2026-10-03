import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { payloadOf } from '../_lib/qpu'
import type { Doc, Search } from '@/src/payload/payload-types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Search', description: 'Search the QPU documentation.', alternates: { canonical: '/search' } }

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? '').trim()
  const payload = await payloadOf()
  const found = q
    ? ((await payload.find({ collection: 'search', where: { title: { like: q } }, limit: 30, depth: 1, sort: '-priority' })).docs as Search[])
    : []
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
      <form className="flex max-w-xl gap-2" method="get">
        <Input name="q" defaultValue={q} placeholder="Search the documentation" />
        <Button type="submit">Search</Button>
      </form>
      {q ? <p className="text-sm text-muted-foreground">{found.length} result{found.length === 1 ? '' : 's'} for “{q}”</p> : null}
      <div className="grid gap-3">
        {found.map((s) => {
          const doc = typeof s.doc.value === 'object' ? (s.doc.value as Doc) : undefined
          return (
            <Link key={s.id} href={doc ? (doc.slug === 'index' ? '/' : `/${doc.slug}`) : '#'}>
              <Card className="transition-colors hover:border-primary/60">
                <CardHeader>
                  <CardTitle className="text-base">{s.title}</CardTitle>
                  <CardDescription>{doc?.meta?.description ?? doc?.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
