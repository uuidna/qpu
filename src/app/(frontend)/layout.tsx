import type { Metadata } from 'next'
import type React from 'react'
import '@/css/app.css'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SITE } from '@/collections/Docs'
import { InitTheme } from '@/providers/Theme/InitTheme'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: { default: SITE.name, template: `%s — ${SITE.name}` },
  openGraph: { siteName: SITE.name, type: 'website' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
      </head>
      <body className="min-h-screen font-sans">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
