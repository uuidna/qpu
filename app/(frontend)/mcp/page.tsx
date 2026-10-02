/**
 * QPU MCP Unlimited Dashboard
 * Shows all discovered operations and unlimited compositions
 */

'use client'

import { useEffect, useState } from 'react'

interface Operation {
  name: string
  domain: string
  theorem: string
  face?: number
  door?: number
}

interface Composition {
  name: string
  ops: string[]
  formula: string
  capability: string
}

interface CapabilityNetwork {
  totalOperations: number
  totalCompositions: number
  estimatedUnlimitedPages: number
  domains: string[]
  highValuePaths: string[]
  compositionExamples: Composition[]
}

export default function MCPDashboard() {
  const [network, setNetwork] = useState<CapabilityNetwork | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mcp/registry')
      .then((r) => r.json())
      .then((data) => {
        setNetwork(data.network)
        setLoading(false)
      })
      .catch((e) => {
        console.error('Failed to load MCP registry:', e)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" />
          <p className="mt-4 text-gray-400">Loading QPU MCP Registry...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            QPU MCP Unlimited
          </h1>
          <p className="text-xl text-gray-400">
            Infinite operations through combinatorial composition
          </p>
        </div>

        {/* Stats Grid */}
        {network && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-400">{network.totalOperations}</div>
              <p className="text-sm text-gray-400 mt-2">Base Operations</p>
              <p className="text-xs text-gray-500 mt-1">Across 5 domains</p>
            </div>

            <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-purple-400">{network.totalCompositions}</div>
              <p className="text-sm text-gray-400 mt-2">2-Op Compositions</p>
              <p className="text-xs text-gray-500 mt-1">Deterministic routes</p>
            </div>

            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-400">∞</div>
              <p className="text-sm text-gray-400 mt-2">Unlimited Pages</p>
              <p className="text-xs text-gray-500 mt-1">Via formula composition</p>
            </div>

            <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-orange-400">O(1)</div>
              <p className="text-sm text-gray-400 mt-2">Lookup Time</p>
              <p className="text-xs text-gray-500 mt-1">Hex-addressed routes</p>
            </div>
          </div>
        )}

        {/* Domains */}
        {network && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Operation Domains</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {network.domains.map((domain) => (
                <div key={domain} className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                  <h3 className="font-bold text-cyan-400 capitalize">{domain}</h3>
                  <p className="text-xs text-gray-500 mt-2">Full operation coverage</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High Value Paths */}
        {network && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">High-Value Composition Paths</h2>
            <div className="space-y-3">
              {network.highValuePaths.map((path, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex items-start gap-4"
                >
                  <div className="text-cyan-400 font-bold flex-shrink-0 w-8">{idx + 1}</div>
                  <p className="text-gray-300">{path}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Composition Examples */}
        {network && network.compositionExamples.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Composition Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {network.compositionExamples.map((comp, idx) => (
                <div key={idx} className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                  <div className="font-mono text-sm text-green-400 mb-2">{comp.formula}</div>
                  <p className="text-sm text-gray-300">{comp.name}</p>
                  <p className="text-xs text-gray-500 mt-2">Capability: {comp.capability}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Capabilities Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">System Capabilities</h2>
          <div className="bg-slate-800/20 border border-slate-700 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-3">Quantum Operations</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ Qubit entanglement & superposition</li>
                  <li>✓ Quantum gates & circuits</li>
                  <li>✓ Bell & GHZ state preparation</li>
                  <li>✓ Deutsch & dense coding</li>
                  <li>✓ Teleportation & no-cloning</li>
                  <li>✓ 3-qubit exact-amplitude simulation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-400 mb-3">Cryptographic Operations</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ Shor's factorization (N=91)</li>
                  <li>✓ Modular exponentiation</li>
                  <li>✓ Inverse QFT</li>
                  <li>✓ RSA cryptosystem</li>
                  <li>✓ Secret splitting & RAID</li>
                  <li>✓ Quantum-safe verification</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-green-400 mb-3">Compute Operations</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ Resource allocation & billing</li>
                  <li>✓ Cube topology & face lattice</li>
                  <li>✓ Handle semantics & KV storage</li>
                  <li>✓ Amplitude tracking</li>
                  <li>✓ Capacity estimation</li>
                  <li>✓ Fused operation accounting</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-orange-400 mb-3">Registry & Governance</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ Tool discovery & catalogs</li>
                  <li>✓ Law verification & auditing</li>
                  <li>✓ Voting & due process</li>
                  <li>✓ Journal & ledger retrieval</li>
                  <li>✓ Port & endpoint discovery</li>
                  <li>✓ Growth & governance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">API Access</h2>
          <div className="bg-slate-800/20 border border-slate-700 rounded-lg p-6 font-mono text-sm text-gray-300">
            <div className="mb-4">
              <p className="text-cyan-400 mb-2">GET /api/mcp/registry</p>
              <p className="text-gray-500">List all operations and compositions</p>
            </div>
            <div className="mb-4">
              <p className="text-cyan-400 mb-2">POST /api/mcp/compose</p>
              <p className="text-gray-500">Execute operation composition</p>
            </div>
            <div>
              <p className="text-cyan-400 mb-2">GET /api/mcp/operations</p>
              <p className="text-gray-500">Get all available MCP tools</p>
            </div>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Architecture</h2>
          <div className="bg-slate-800/20 border border-slate-700 rounded-lg p-6">
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>
                  <strong>QPU Kernel:</strong> 14 quantum + 8 crypto + 8 compute + 8 registry + 3
                  governance operations
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                <span>
                  <strong>Compositional Layer:</strong> All operations composable with all others
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>
                  <strong>Formula Routing:</strong> Deterministic hex addressing for O(1) lookups
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span>
                  <strong>MCP Interface:</strong> All compositions exposed as unlimited MCP tools
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
