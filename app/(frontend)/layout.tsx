import type { Metadata } from 'next'
import type React from 'react'
import Link from 'next/link'
import './globals.css'
import { SITE } from '@/src/payload/collections/docs'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: { default: SITE.name, template: `%s — ${SITE.name}` },
  description: 'An exact quantum processing unit served over MCP: integer amplitudes, Lean-checked theorems, hex-addressed formula families and quantum receipts.',
  openGraph: { siteName: SITE.name, type: 'website' },
}

const nav = [
  ['/#families', 'Formulas'],
  ['/discover', 'Discovery'],
  ['/data', 'Live data'],
  ['/index', 'Docs'],
  ['/search', 'Search'],
  ['/license', 'License'],
] as const

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
            <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
              uuidna<span className="text-primary">/qpu</span>
            </Link>
            <nav className="flex flex-1 items-center gap-1 overflow-x-auto text-sm">
              {nav.map(([href, label]) => (
                <Link key={href} href={href} className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  {label}
                </Link>
              ))}
            </nav>
            <a href="https://qpu.uuidna.com/mcp" className="hidden font-mono text-xs text-muted-foreground hover:text-foreground sm:block">
              /mcp
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="border-t">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground">
            <span>© Tsvetan Rouschev · CC BY-NC-ND 4.0 · commercial use by <Link href="/license" className="underline">license</Link></span>
            <span className="font-mono">qpu.uuidna.com · MCP · Lean 4 · Payload</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
