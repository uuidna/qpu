import type { Metadata } from 'next'
import type React from 'react'
import '@/css/app.css'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SITE } from '@/collections/Docs'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { qpuCiteOf } from '@uuidna/qpu'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: { default: SITE.name, template: `%s — ${SITE.name}` },
  openGraph: { siteName: SITE.name, type: 'website' },
}

// the site's JSON-LD, read from the citation Payload serves at /cite: nothing restated by hand
const jsonLd = () => {
  const c = qpuCiteOf() as unknown as { author: { first: string; last: string; orcid: string }; href: string; doi: string; identifier: string }
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: c.href,
    license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    author: { '@type': 'Person', name: `${c.author.first} ${c.author.last}`, sameAs: c.author.orcid },
    identifier: c.identifier,
    potentialAction: { '@type': 'SearchAction', target: `${c.href}/search?q={q}`, 'query-input': 'required name=q' },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        {/* lattice sheet Payload serves at /qpu.css: --qpu-faces, --qpu-period, @keyframes qpu for border walk */}
        <link rel="stylesheet" href="/qpu.css" />
        {/* structured data for every page: the site, its author and licence, as the citation door states them */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      </head>
      <body className="min-h-screen font-sans">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
