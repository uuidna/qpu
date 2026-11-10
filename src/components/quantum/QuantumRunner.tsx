'use client'

import React, { useState } from 'react'

import { Outcome, type CircuitOutcome } from './Outcome'
import { runViaMcp } from './runViaMcp'

type Props = {
  /** the program shown, and run when no edit replaces it */
  program: unknown
  /** the outcome and receipt stored with the document, computed by its beforeChange hook */
  stored?: { outcome?: unknown; receipt?: null | string }
  /** a textarea for the program instead of a fixed one */
  editable?: boolean
}

/** Runs a circuit program at /api/mcp and shows the outcome. When the document stored an outcome, the two are compared:
 *  the hook and the MCP tool call the same handler, so they agree. */
export const QuantumRunner: React.FC<Props> = ({ editable, program, stored }) => {
  const [text, setText] = useState(() => JSON.stringify(program ?? {}, null, 2))
  const [answer, setAnswer] = useState<{ error?: string; outcome?: Record<string, unknown> }>()
  const [running, setRunning] = useState(false)

  const run = async () => {
    setRunning(true)
    try {
      setAnswer(await runViaMcp(editable ? JSON.parse(text) : program))
    } catch (e) {
      setAnswer({ error: e instanceof Error ? e.message : String(e) })
    } finally {
      setRunning(false)
    }
  }
  const agrees = answer?.outcome && stored?.outcome ? JSON.stringify(answer.outcome) === JSON.stringify(stored.outcome) : undefined

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {editable ? (
        <textarea
          aria-label="Circuit program"
          onChange={(e) => setText(e.target.value)}
          rows={12}
          style={{ fontFamily: 'monospace', width: '100%' }}
          value={text}
        />
      ) : null}
      {stored?.outcome ? (
        <div>
          <Outcome outcome={stored.outcome as CircuitOutcome} />
          {stored.receipt ? <p style={{ fontFamily: 'monospace' }}>receipt {stored.receipt}</p> : null}
        </div>
      ) : null}
      <div>
        <button disabled={running} onClick={run} type="button">
          {running ? 'Running…' : 'Run on the simulator at /api/mcp'}
        </button>
      </div>
      {answer?.error ? <p role="alert">{answer.error}</p> : null}
      {answer?.outcome ? (
        <div>
          <Outcome outcome={answer.outcome as CircuitOutcome} />
          {agrees === undefined ? null : (
            <p>{agrees ? 'The MCP answer equals the stored outcome.' : 'The MCP answer differs from the stored outcome: save to recompute.'}</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
