// Google Standards RBAC conformance tests covering all 8 RBAC leads (ISO/IEC/IEEE 29119-3).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  RBAC_ABILITIES,
  RBAC_SUBJECTS,
  WORKSPACE_GROUP_ROLES,
  accessibleBy,
  approveOwnerChange,
  penaltyLedger,
  rbacAudit,
  rbacCheck,
  signAttestation,
} from './index.ts'
import { listRolesFromGroups } from '../c/3/d/1/3/3/a/8/index.ts'
import { seal } from '../2/7/1/a/7/6/4/9/index.ts'
import { isSdkRequest, serveSdk } from '../sdk/index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: All 8 Google Standards RBAC leads enforce positive grants, negative cannot controls, ML-DSA-65 attestations, and accessibleBy scoping. */
test('All 8 Google Standards RBAC leads enforce positive grants, negative cannot controls, ML-DSA-65 attestations, and accessibleBy scoping', () => {
  const audit = rbacAudit('https://qpu.uuidna.com')
  assert.equal(audit.phase, 'rbac-audit')
  assert.equal(audit.holds, true)
  assert.equal(audit.leadsServed, 8)
  assert.equal(audit.subjects, RBAC_SUBJECTS.length)
  assert.equal(audit.abilities, RBAC_ABILITIES.length)
  assert.equal(audit.sealed, true)
  assert.equal(seal(audit.address).valid, true)
  assert.equal(audit.checks.every((c) => c.passed), true)

  const plan = listRolesFromGroups(WORKSPACE_GROUP_ROLES, undefined, 'user:alice')
  assert.equal(plan.phase, 'plan')
  const mapped = listRolesFromGroups(WORKSPACE_GROUP_ROLES, [{ email: 'group:aip-reviewers' }])
  assert.equal(mapped.phase, 'roles')
  assert.equal(accessibleBy(RBAC_ABILITIES, mapped.roles, 'aip-design', 'approve', [{ id: 'AIP-121' }]).length, 1)

  const owner = approveOwnerChange([{ name: 'owner', resourceType: 'owners', resource: 'src/quantum' }], 'src/quantum', 'cl-99')
  assert.equal(owner.approved && owner.sealed, true)
  assert.equal(approveOwnerChange([{ name: 'owner', resourceType: 'owners', resource: 'src/quantum' }], 'docs', 'cl-99').approved, false)

  const signed = signAttestation([{ name: 'slsa-attestor', resourceType: 'slsa', resource: 'uuidna/qpu' }], 'slsa', 'uuidna/qpu', { sha: 'abc' })
  assert.equal(signed.authorised && signed.verified && signed.refusesChanged, true)
  assert.equal(signAttestation([{ name: 'readability' }], 'slsa', 'uuidna/qpu', { sha: 'abc' }).authorised, false)

  const ledger = penaltyLedger([{ name: 'tenant-admin' }], [
    { id: '1', tenant: 'qpu', rule: 'gts-style', coins: 4 },
    { id: '2', tenant: 'other', rule: 'gts-style', coins: 9 },
  ], { tenants: ['qpu'] })
  assert.equal(ledger.clearableCoins, 4)

  const check = rbacCheck({ roles: [{ name: 'workspace-admin' }], subject: 'waivers', action: 'waive', doc: { branch: 'main', rule: 'proven', status: 'draft' } })
  assert.equal(check.allowed, false)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: Standard Payload global /api/globals/payload-ui?view=rbac serves rbacAudit and POST evaluates live RBAC checks. */
test('Standard Payload global /api/globals/payload-ui?view=rbac serves rbacAudit and POST evaluates live RBAC checks', async () => {
  const req = new Request('https://qpu.uuidna.com/api/globals/payload-ui?view=rbac')
  assert.equal(isSdkRequest(req), true)
  const res = await serveSdk(req)
  assert.equal(res.status, 200)
  const audit = await res.json() as ReturnType<typeof rbacAudit>
  assert.equal(audit.phase, 'rbac-audit')
  assert.equal(audit.holds, true)
  assert.equal(audit.leadsServed, 8)

  const post = await serveSdk(new Request('https://qpu.uuidna.com/api/globals/payload-ui', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      roles: [{ name: 'release-manager' }],
      subject: 'releases',
      action: 'read',
      doc: { budgetSpent: false },
    }),
  }))
  assert.equal(post.status, 200)
  const verdict = await post.json() as { phase: string; allowed: boolean }
  assert.equal(verdict.phase, 'rbac-check')
  assert.equal(verdict.allowed, true)

  const blocked = await serveSdk(new Request('https://qpu.uuidna.com/api/globals/payload-ui', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      roles: [{ name: 'release-manager' }],
      subject: 'releases',
      action: 'release',
      doc: { budgetSpent: true },
    }),
  }))
  assert.equal((await blocked.json() as { allowed: boolean }).allowed, false)
})
