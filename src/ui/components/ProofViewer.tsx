/**
 * Lean 4 Proof Viewer Component
 * Display and verify quantum formula proofs
 */

import React, { useState } from 'react'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

interface ProofViewerProps {
  proof: string
  formula: string
  verified: boolean
  onVerify?: () => void
}

export function ProofViewer({ proof, formula, verified, onVerify }: ProofViewerProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(proof)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition"
      >
        <div className="text-left">
          <h4 className="font-semibold flex items-center gap-2">
            {verified && <Check className="w-4 h-4 text-green-500" />}
            Lean 4 Proof
          </h4>
          <p className="text-sm text-gray-400 mt-1">{formula}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Content */}
      {expanded && (
        <div className="border-t border-purple-500/10 p-4">
          {/* Proof Code */}
          <div className="bg-slate-900 rounded p-4 mb-4 overflow-x-auto">
            <pre className="text-sm font-mono text-green-300 whitespace-pre-wrap break-words">
              {proof}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>

            {onVerify && (
              <button
                onClick={onVerify}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition"
              >
                Verify Proof
              </button>
            )}
          </div>

          {/* Proof Stats */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div className="bg-slate-700/30 p-2 rounded">
              <div className="text-gray-400">Lines</div>
              <div className="font-semibold">{proof.split('\n').length}</div>
            </div>
            <div className="bg-slate-700/30 p-2 rounded">
              <div className="text-gray-400">Chars</div>
              <div className="font-semibold">{proof.length}</div>
            </div>
            <div className="bg-slate-700/30 p-2 rounded">
              <div className="text-gray-400">Status</div>
              <div className={`font-semibold ${verified ? 'text-green-400' : 'text-yellow-400'}`}>
                {verified ? 'Verified' : 'Pending'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
