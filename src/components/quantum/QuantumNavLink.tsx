'use client'

import { useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

/** The admin nav's link to /admin/quantum. */
export const QuantumNavLink: React.FC = () => {
  const { config } = useConfig()
  return (
    <Link className="nav__link" href={`${config.routes.admin}/quantum`}>
      <span className="nav__link-label">Quantum circuits</span>
    </Link>
  )
}
