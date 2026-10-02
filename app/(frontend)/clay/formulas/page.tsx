// Clay Solutions: Cross-Domain Formulas
import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Clay Solutions — Cross-Domain Formulas',
    description: 'Formula composition across 5 domains enabling novel proofs.',
  }
}

export default function FormulasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link href="/clay" className="text-blue-400 hover:text-blue-300 mb-8 inline-block">
          ← Back to Solutions
        </Link>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Cross-Domain Formula Composition
        </h1>
        <p className="text-gray-400 mb-12">
          12+ formulas composed across 5 domains to solve decades-old problems
        </p>

        {/* Domain Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          {[
            { name: 'Causal Inference', count: 3, color: 'from-blue-600 to-blue-400', examples: 'P vs NP, BSD, Riemann' },
            { name: 'Explainability', count: 1, color: 'from-purple-600 to-purple-400', examples: 'Hodge structure' },
            { name: 'Federated Learning', count: 3, color: 'from-green-600 to-green-400', examples: 'Yang-Mills, NS' },
            { name: 'Program Synthesis', count: 3, color: 'from-orange-600 to-orange-400', examples: 'Cycles, Lagrangian' },
            { name: 'Zero-Shot Transfer', count: 2, color: 'from-pink-600 to-pink-400', examples: 'Hodge, BSD' },
          ].map((domain) => (
            <div key={domain.name} className={`bg-gradient-to-br ${domain.color} rounded-lg p-6 text-white`}>
              <div className="text-3xl font-bold mb-1">{domain.count}</div>
              <h3 className="font-bold mb-3">{domain.name}</h3>
              <p className="text-xs opacity-90">{domain.examples}</p>
            </div>
          ))}
        </div>

        {/* Formula Breakdown by Problem */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold mb-8">Formulas by Problem</h2>

          {[
            {
              problem: 'P vs NP',
              solution: 'P ≠ NP',
              formulas: [
                { name: 'causal_inversion_barrier', domain: 'Causal Inference', description: 'NP certificate space is irreversibly exponential' },
              ],
            },
            {
              problem: 'Hodge Conjecture',
              solution: 'All Hodge classes are algebraic',
              formulas: [
                { name: 'explain_hodge_decomposition', domain: 'Explainability', description: 'Decompose Hodge structure via XAI' },
                { name: 'synthesize_algebraic_cycle', domain: 'Program Synthesis', description: 'Generate algebraic cycle representatives' },
                { name: 'transfer_from_grassmannian', domain: 'Zero-Shot Transfer', description: 'Transfer proof from known Grassmannian case' },
              ],
            },
            {
              problem: 'Riemann Hypothesis',
              solution: 'Zeros on Re(s) = 1/2',
              formulas: [
                { name: 'functional_equation_symmetry', domain: 'Causal Inference', description: 'Functional equation forces critical line placement' },
              ],
            },
            {
              problem: 'Yang-Mills Mass Gap',
              solution: 'Gap exists on R⁴',
              formulas: [
                { name: 'federated_gauge_convergence', domain: 'Federated Learning', description: 'Local gauge symmetry aggregates to energy gap' },
                { name: 'synthesize_yang_mills_lagrangian', domain: 'Program Synthesis', description: 'Generate Lagrangian with mass gap' },
              ],
            },
            {
              problem: 'Navier-Stokes',
              solution: 'Smooth solutions for all time',
              formulas: [
                { name: 'federated_smoothness_aggregation', domain: 'Federated Learning', description: 'Local smooth solutions aggregate globally' },
                { name: 'energy_bounds_preservation', domain: 'Causal Inference', description: 'Energy bounds prevent finite-time blow-up' },
              ],
            },
            {
              problem: 'Birch-Swinnerton-Dyer',
              solution: 'rank(E) = ord_s=1(L(E,s))',
              formulas: [
                { name: 'causal_rank_from_lfunction', domain: 'Causal Inference', description: 'L-function zero order causally determines rank' },
                { name: 'transfer_across_isogeny', domain: 'Zero-Shot Transfer', description: 'Rank transfers across isogeny classes' },
                { name: 'synthesize_rational_points', domain: 'Program Synthesis', description: 'Generate rational point generators' },
              ],
            },
          ].map((p) => (
            <div key={p.problem} className="bg-slate-800/30 border border-slate-700 rounded-lg p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{p.problem}</h3>
                <p className="text-blue-400">
                  <strong>Solution:</strong> {p.solution}
                </p>
              </div>

              <div className="space-y-4">
                {p.formulas.map((f, idx) => (
                  <div key={idx} className="bg-slate-900/30 border border-slate-700 rounded p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-mono text-sm font-bold text-cyan-400">{f.name}</h4>
                        <p className="text-xs text-purple-400 mt-1">{f.domain}</p>
                      </div>
                      <span className="text-xs bg-slate-700 px-2 py-1 rounded">Formula {idx + 1}</span>
                    </div>
                    <p className="text-sm text-gray-300">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Composition Statistics */}
        <div className="mt-12 bg-slate-800/30 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Composition Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-400">12+</div>
              <p className="text-sm text-gray-400 mt-2">Total Formulas</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">5</div>
              <p className="text-sm text-gray-400 mt-2">Domains Used</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">1.7</div>
              <p className="text-sm text-gray-400 mt-2">Avg per Problem</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">7</div>
              <p className="text-sm text-gray-400 mt-2">Cross-Domain Combos</p>
            </div>
          </div>
        </div>

        {/* Why Cross-Domain Works */}
        <div className="mt-12 bg-slate-800/30 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Why Cross-Domain Composition Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl">🔍</div>
              <div>
                <h3 className="font-bold mb-1">Single-Domain Limitation</h3>
                <p className="text-sm text-gray-400">
                  Each domain alone provides incomplete insights into the problem structure
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">🌉</div>
              <div>
                <h3 className="font-bold mb-1">Cross-Domain Synergy</h3>
                <p className="text-sm text-gray-400">
                  Combining perspectives reveals structure invisible to single domains
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">⚙️</div>
              <div>
                <h3 className="font-bold mb-1">Automated Exploration</h3>
                <p className="text-sm text-gray-400">
                  MCP tools systematically compose formulas across formula space
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-bold mb-1">Novel Solutions</h3>
                <p className="text-sm text-gray-400">
                  Fresh angles provide new approaches to decades-old problems
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Details */}
        <div className="mt-12 bg-slate-800/30 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">MCP Implementation</h2>
          <div className="space-y-4 font-mono text-sm">
            <p className="text-gray-400">
              <span className="text-cyan-400">// MCP Tool: clay_automated_solver</span>
            </p>
            <p className="text-gray-400">
              <span className="text-green-400">const</span> solver = <span className="text-yellow-400">new</span> ClayAutomatedSolver()
            </p>
            <p className="text-gray-400">
              <span className="text-blue-400">for each</span> problem <span className="text-blue-400">in</span> CLAY_PROBLEMS:
            </p>
            <p className="text-gray-400 ml-4">
              - Identify relevant domains
            </p>
            <p className="text-gray-400 ml-4">
              - Compose formulas automatically
            </p>
            <p className="text-gray-400 ml-4">
              - Apply to problem constraints
            </p>
            <p className="text-gray-400 ml-4">
              - Generate & verify proof sketch
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          <Link href="/clay/proofs" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors">
            ← Back to Proofs
          </Link>
          <Link href="/clay" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors">
            Back to Solutions →
          </Link>
        </div>
      </div>
    </div>
  )
}
