'use client'

import { useState } from 'react'
import CombinatorialGraphVisualizer from '@/components/CombinatorialGraphVisualizer'
import FormulaAnimationDashboard from '@/components/FormulaAnimationDashboard'
import WaveProgressVisualizer from '@/components/WaveProgressVisualizer'
import MetricsFlow from '@/components/MetricsFlow'
import SynergyMatrix from '@/components/SynergyMatrix'

export default function Home() {
  const [activeTab, setActiveTab] = useState('combinatorial')

  return (
    <div className="relative w-full min-h-screen bg-qpu-dark text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="animated-grid" />

      {/* Header */}
      <div className="relative z-10 border-b border-qpu-purple/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-qpu-purple via-qpu-blue to-qpu-cyan bg-clip-text text-transparent">
            UUIDNA QPU: Combinatorial Graph Explorer
          </h1>
          <p className="text-qpu-cyan/80 mt-2">
            Visualizing 50+ systems, 256+ synergies, and emergent patterns through animated formulas
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative z-10 border-b border-qpu-purple/20 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'combinatorial', label: '🌐 Combinatorial Graph' },
              { id: 'formulas', label: '📐 Formula Animations' },
              { id: 'waves', label: '🌊 Wave Progress' },
              { id: 'metrics', label: '📊 Metrics Flow' },
              { id: 'synergy', label: '⚡ Synergy Matrix' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-qpu-purple border-b-2 border-qpu-purple'
                    : 'text-qpu-cyan/60 hover:text-qpu-cyan'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 min-h-screen">
        {activeTab === 'combinatorial' && <CombinatorialGraphVisualizer />}
        {activeTab === 'formulas' && <FormulaAnimationDashboard />}
        {activeTab === 'waves' && <WaveProgressVisualizer />}
        {activeTab === 'metrics' && <MetricsFlow />}
        {activeTab === 'synergy' && <SynergyMatrix />}
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-qpu-purple/20 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-qpu-cyan/60 text-sm">
          <p>All animations are computed from mathematical formulas in real-time</p>
          <p className="mt-2">Based on UUIDNA QPU: Combinatorial Perspectives & Formula Applications</p>
        </div>
      </div>
    </div>
  )
}
