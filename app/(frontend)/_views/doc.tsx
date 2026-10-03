import Link from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import type { Doc } from '@/src/payload/payload-types'

const slugOf = (b: { doc?: unknown; url?: string | null }) =>
  b.doc && typeof b.doc === 'object' && 'slug' in b.doc ? String((b.doc as { slug: unknown }).slug) : (b.url ?? '').split('/').filter(Boolean).at(-1) ?? ''

export function DocView({ doc, docs }: { doc: Doc; docs: Doc[] }) {
  // nested-docs keeps the trail (index, then this page); every link is the page's own slug, no prefix
  const trail = (doc.breadcrumbs ?? []).filter((b) => b.label).slice(0, -1)
  return (
    <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
      <aside className="hidden lg:block">
        <nav className="sticky top-20 space-y-1 text-sm">
          {docs.map((d) => (
            <Link key={d.id} href={d.slug === 'index' ? '/index' : `/${d.slug}`} className={`block rounded-md px-2 py-1 ${d.slug === doc.slug ? 'bg-accent font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
              {d.title}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/">QPU</Link></BreadcrumbLink></BreadcrumbItem>
            {trail.map((b) => (
              <span key={b.id ?? b.url} className="contents">
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink asChild><Link href={`/${slugOf(b)}`}>{b.label}</Link></BreadcrumbLink></BreadcrumbItem>
              </span>
            ))}
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{doc.title}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <article className="prose prose-neutral max-w-none dark:prose-invert prose-table:text-sm prose-a:text-primary" dangerouslySetInnerHTML={{ __html: doc.html ?? '' }} />
      </div>
    </div>
  )
}
