import React from 'react'

type Amplitude = { im: number; re: number }
export type CircuitOutcome = {
  amplitudes?: Amplitude[]
  bitstrings?: string[]
  histogram?: Record<string, number>
  key?: string
  qubits?: string[]
}

const round = (x: number) => Number(x.toFixed(6))

/** What the circuit tool answered: the exact state vector (each basis state with a nonzero amplitude and its
 *  probability), or, for a measured program, the histogram of the samples. */
export const Outcome: React.FC<{ outcome: CircuitOutcome }> = ({ outcome }) => {
  if (outcome.amplitudes) {
    const n = outcome.qubits?.length ?? Math.log2(outcome.amplitudes.length)
    const rows = outcome.amplitudes
      .map((a, i) => ({ a, bits: i.toString(2).padStart(n, '0'), p: a.re * a.re + a.im * a.im }))
      .filter((r) => r.p > 1e-12)
    return (
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace' }}>
        <caption style={{ textAlign: 'left' }}>State vector over {outcome.qubits?.join(', ')}</caption>
        <thead>
          <tr>
            <th style={{ paddingRight: 16, textAlign: 'left' }}>basis</th>
            <th style={{ paddingRight: 16, textAlign: 'left' }}>amplitude</th>
            <th style={{ textAlign: 'left' }}>probability</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.bits}>
              <td style={{ paddingRight: 16 }}>|{r.bits}⟩</td>
              <td style={{ paddingRight: 16 }}>
                {round(r.a.re)}
                {r.a.im ? ` ${r.a.im < 0 ? '−' : '+'} ${Math.abs(round(r.a.im))}i` : ''}
              </td>
              <td>{round(r.p)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  if (outcome.histogram) {
    const n = outcome.bitstrings?.[0]?.length ?? 1
    return (
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace' }}>
        <caption style={{ textAlign: 'left' }}>
          Measurement {outcome.key}: {outcome.bitstrings?.length} samples
        </caption>
        <tbody>
          {Object.entries(outcome.histogram).map(([value, count]) => (
            <tr key={value}>
              <td style={{ paddingRight: 16 }}>{Number(value).toString(2).padStart(n, '0')}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  return <pre>{JSON.stringify(outcome, null, 2)}</pre>
}
