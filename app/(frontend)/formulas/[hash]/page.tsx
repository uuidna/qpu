/**
 * Dynamic Formula Route
 * Auto-generated route handler for formula pages
 */
import type { Metadata } from 'next'
import { decodeFormulaHash, getKnowledgeBaseStats } from '@/lib/formula-routing'

interface Props {
  params: Promise<{ hash: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { metadata } = decodeFormulaHash((await params).hash)
    return {
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.keywords,
      openGraph: {
        title: metadata.title,
        description: metadata.description,
        url: metadata.url,
        type: 'article',
      },
    }
  } catch (e) {
    return {
      title: 'Formula Not Found',
      description: 'This formula combination was not found.',
    }
  }
}

export default async function FormulaPage({ params }: Props) {
  try {
    const { formulas, metadata, stats } = decodeFormulaHash((await params).hash)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {formulas.map((f) => f.name).join(' + ')}
          </h1>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formulas.map((formula, idx) => (
              <div key={idx} className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-2">{formula.name}</h3>
                <p className="text-sm text-purple-400 mb-3">{formula.domainName}</p>
                <p className="text-xs text-gray-400 mb-3">Problem: {formula.problem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Formula Not Found</h1>
          <p className="text-gray-400">The formula combination you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }
}

/**
 * Generate static parameters for all formula combinations
 */
export async function generateStaticParams() {
  // In production, generates all 1,585+ combinations
  // For now, generate sample set
  return [
    { hash: 'a1b2c3d4e5f6g7h8' },
    { hash: 'b2c3d4e5f6g7h8i9' },
    { hash: 'c3d4e5f6g7h8i9j0' },
  ]
}

/**
 * Enable Incremental Static Regeneration
 */
export const revalidate = 3600 // 1 hour
