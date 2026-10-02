/**
 * Dynamic Formula Composition Page
 * Serves billions of unique knowledge pages from combinatorial routing
 *
 * Architecture:
 * - Route parameter: [hash] - 16-char SHA256 hash of formula combination
 * - No database queries - all metadata pre-computed
 * - Google Search Console optimized
 * - Static generation at build time
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { decodeFormulaHash, generateFormulaHash, getKnowledgeBaseStats } from '@/lib/formula-routing'

interface Props {
  params: { hash: string }
}

/**
 * Generate metadata for Google Search Console and social sharing
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { metadata } = decodeFormulaHash(params.hash)

    return {
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.keywords,
      canonical: metadata.canonical,
      openGraph: {
        title: metadata.title,
        description: metadata.description,
        url: metadata.url,
        type: 'article',
        images: [
          {
            url: metadata.ogImage,
            width: 1200,
            height: 630,
            alt: metadata.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title,
        description: metadata.description,
        images: [metadata.ogImage],
      },
    }
  } catch (e) {
    return {
      title: 'Formula Not Found',
      description: 'This formula combination was not found.',
    }
  }
}

/**
 * Main page component
 */
export default function FormulaPage({ params }: Props) {
  const { formulas, metadata, stats } = decodeFormulaHash(params.hash)

  if (!formulas || formulas.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Structured Data - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(metadata.schema),
        }}
      />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-400">
          <a href="/" className="text-blue-400 hover:text-blue-300">
            Home
          </a>
          {' > '}
          <a href="/clay" className="text-blue-400 hover:text-blue-300">
            Clay Solutions
          </a>
          {' > '}
          <a href="/clay/formulas" className="text-blue-400 hover:text-blue-300">
            Formulas
          </a>
          {' > '}
          <span>Combination {params.hash}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {formulas.map((f) => f.name).join(' + ')}
          </h1>
          <p className="text-xl text-gray-300 mb-4">{metadata.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.formulaCount}</div>
            <p className="text-sm text-gray-400">Formulas</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">{stats.domainCount}</div>
            <p className="text-sm text-gray-400">Domains</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{stats.problemsAddressed.length}</div>
            <p className="text-sm text-gray-400">Problems</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-400">{stats.estimatedPageRank}/10</div>
            <p className="text-sm text-gray-400">Rank Score</p>
          </div>
        </div>

        {/* Formula Cards */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Formula Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formulas.map((formula, idx) => (
              <div key={idx} className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-2">{formula.name}</h3>
                    <p className="text-sm text-purple-400 mb-3">{formula.domainName}</p>
                    <p className="text-xs text-gray-400 mb-3">Problem: {formula.problem}</p>
                  </div>
                  <span className="text-2xl">{getDomainIcon(formula.domain)}</span>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-2">
                  {formula.keywords.map((keyword, i) => (
                    <span key={i} className="text-xs bg-slate-700/50 text-gray-300 px-2 py-1 rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Problems Addressed */}
        {stats.problemsAddressed.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Problems Addressed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.problemsAddressed.map((problem) => (
                <div key={problem} className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                  <p className="text-blue-400 font-mono">{problem}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cross-Domain Value */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Cross-Domain Value</h2>
          <p className="text-gray-300 mb-4">
            This combination of {stats.formulaCount} formulas across {stats.domainCount} domains creates unique insights:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li>✓ Enables novel proof approaches</li>
            <li>✓ Bridges previously disconnected mathematical concepts</li>
            <li>✓ Provides alternative pathways to hard problems</li>
            <li>✓ Part of UUIDNA QPU's knowledge synthesis system</li>
          </ul>
        </div>

        {/* Related Combinations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Combinations</h2>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
            <p className="text-gray-400 mb-4">
              This is one of thousands of formula combinations in the UUIDNA QPU knowledge base.
            </p>
            <p className="text-sm text-gray-500">
              Explore other combinations across the 5 domains: Causal Inference, Explainability, Federated Learning, Program Synthesis, and Zero-Shot Transfer.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <a href="/clay/formulas" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors">
            ← Back to Formulas
          </a>
          <a href="/clay" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors">
            Clay Solutions →
          </a>
        </div>
      </div>

      {/* Footer with metadata */}
      <div className="border-t border-slate-800 py-8 px-6 text-center text-sm text-gray-500">
        <p>Formula Hash: {params.hash}</p>
        <p className="mt-2">Part of UUIDNA QPU - Billions of formula combinations serving mathematical knowledge</p>
      </div>
    </div>
  )
}

/**
 * Generate static parameters for all formula combinations
 * Runs at build time to create static pages
 */
export async function generateStaticParams() {
  // In production, generate ALL combinations
  // For demo, generate top N combinations
  const stats = getKnowledgeBaseStats()

  console.log(`📊 Generating static formula pages...`)
  console.log(`   Total unique pages: ${stats.totalUniquePages.toLocaleString()}`)
  console.log(`   Estimated build time: ${stats.estimatedBuildTimeMinutes} minutes`)
  console.log(`   Storage: ~${stats.estimatedStorageGB.toFixed(1)} GB`)

  // Return empty for now - in production would generate all hashes
  // This prevents the build from taking forever during development
  return [
    // Sample hashes for demonstration
    { hash: 'a1b2c3d4e5f6g7h8' },
    { hash: 'b2c3d4e5f6g7h8i9' },
    { hash: 'c3d4e5f6g7h8i9j0' },
  ]
}

/**
 * Get domain icon for visual representation
 */
function getDomainIcon(domain: string): string {
  const icons: Record<string, string> = {
    causal: '🔄',
    xai: '🔍',
    federated: '🤝',
    synthesis: '⚙️',
    transfer: '📚',
  }
  return icons[domain] || '📊'
}
