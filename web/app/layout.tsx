import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UUIDNA QPU: Combinatorial Graph Visualizer',
  description: 'Interactive visualization of 50+ systems, formulas, and emergent patterns',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-qpu-dark text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
