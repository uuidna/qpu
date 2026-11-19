import type { AdminViewServerProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import { DefaultTemplate } from '@payloadcms/ui/rsc'
import React from 'react'

import { QuantumRunner } from './QuantumRunner'

const line = (x: number) => ({ kind: 'line', x })
/** a Bell pair, the program the view opens with */
const bell = { operations: [{ gate: 'H', qubits: [line(0)] }, { gate: 'CNOT', qubits: [line(0), line(1)] }] }

/** /admin/quantum: run any circuit program on qpu's classical exact simulator, through /api/mcp, and see the products
 *  that are quantum programs with their stored outcomes. */
export const QuantumView: React.FC<AdminViewServerProps> = async ({ initPageResult, params, searchParams }) => {
  const { req } = initPageResult
  const products = await req.payload.find({
    collection: 'products',
    depth: 0,
    limit: 50,
    req,
    select: { quantum: true, slug: true, title: true },
    where: { 'quantum.receipt': { exists: true } },
  })
  const admin = req.payload.config.routes.admin
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1>Quantum circuits</h1>
        <p>
          A classical exact simulator of quantum circuits (ISO/IEC 4879 terms), served by qpu&apos;s circuit tool at /api/mcp. The
          program below runs there, as any MCP client would run it.
        </p>
        <QuantumRunner editable program={bell} />
        <h2 style={{ marginTop: 32 }}>Products that are quantum programs</h2>
        {products.docs.length ? (
          <ul>
            {products.docs.map((p) => (
              <li key={p.id}>
                <a href={`${admin}/collections/products/${p.id}`}>{p.title}</a> receipt <code>{p.quantum?.receipt}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p>No product carries a program yet.</p>
        )}
      </Gutter>
    </DefaultTemplate>
  )
}
