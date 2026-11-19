'use client'

import type { UIFieldClientProps } from 'payload'

import { useFormFields } from '@payloadcms/ui'
import React from 'react'

import { QuantumRunner } from './QuantumRunner'

/** The quantum group's run field in the admin: the stored outcome and receipt, and the program run again at /api/mcp. */
export const OutcomeField: React.FC<UIFieldClientProps> = ({ path }) => {
  const group = path.split('.').slice(0, -1).join('.')
  const [program, outcome, receipt] = useFormFields(([fields]) => [
    fields[`${group}.program`]?.value,
    fields[`${group}.outcome`]?.value,
    fields[`${group}.receipt`]?.value,
  ])
  if (!program) return <p>Give a program and save: the simulator computes its outcome.</p>
  // keyed by the program, so an edit to it resets what was run
  return <QuantumRunner key={JSON.stringify(program)} program={program} stored={{ outcome, receipt: receipt as null | string | undefined }} />
}
