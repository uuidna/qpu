// Google Standards RBAC (CanCanCan + rolify + Directory API + ML-DSA-65 provenance attestations).
import { checkAccess, getAccess, listRolesFromGroups, type Ability, type ScopedRole } from '../c/3/d/1/3/3/a/8/index.ts'
import { dsaRound } from '../4/3/a/3/9/a/e/6/index.ts'
import { canonicalText, seal, uuid } from '../2/7/1/a/7/6/4/9/index.ts'
import { hex, sha256, utf8 } from '../9/e/8/6/7/0/6/8/index.ts'
import { LICENSE } from '../a/f/3/d/e/a/5/f/index.ts'
import { SDK_VOCABULARY } from '../sdk/schema/index.ts'
import { trimTrailingSlashes } from '../sdk/path/index.ts'

export type { Ability, ScopedRole }

export const RBAC_SUBJECTS = [
  'cl-description',
  'gts-style',
  'aip-design',
  'test-size',
  'slo',
  'scorecard',
  'slsa',
  'owners',
  'penalties',
  'waivers',
  'releases',
] as const

export type RbacSubject = (typeof RBAC_SUBJECTS)[number]

export const WORKSPACE_GROUP_ROLES: readonly (ScopedRole & { group: string })[] = [
  { group: 'group:ts-readability', name: 'readability', resourceType: 'gts-style', resource: 'typescript' },
  { group: 'group:aip-reviewers', name: 'aip-reviewer', resourceType: 'aip-design' },
  { group: 'group:slsa-attestors', name: 'slsa-attestor', resourceType: 'slsa' },
  { group: 'group:scorecard-maintainers', name: 'scorecard-maintainer', resourceType: 'scorecard' },
  { group: 'group:slo-owners', name: 'slo-owner', resourceType: 'slo' },
  { group: 'group:workspace-admins', name: 'workspace-admin' },
]

export const RBAC_ABILITIES: readonly Ability[] = [
  { role: 'workspace-admin', can: ['manage'], subject: 'all' },
  { role: 'readability', can: ['read', 'approve', 'clear'], subject: 'gts-style' },
  { role: 'readability', can: ['read', 'clear'], subject: 'penalties', where: { rule: { equals: 'gts-style' } } },
  { role: 'owner', can: ['read', 'approve'], subject: 'owners' },
  { role: 'aip-reviewer', can: ['read', 'approve'], subject: 'aip-design' },
  { role: 'slsa-attestor', can: ['read', 'attest'], subject: 'slsa' },
  { role: 'scorecard-maintainer', can: ['read', 'attest'], subject: 'scorecard' },
  { role: 'slo-owner', can: ['read', 'acknowledge'], subject: 'slo' },
  { role: 'tenant-admin', can: ['read', 'clear'], subject: 'penalties', where: { tenant: { in: '$tenants' } } },
  { role: 'tenant-admin', can: ['read', 'waive'], subject: 'waivers', where: { rule: { equals: 'gts-style' }, status: { equals: 'draft' } } },
  { role: 'all', cannot: true, can: ['waive'], subject: 'waivers', where: { branch: { equals: 'main' }, rule: { equals: 'folded' } } },
  { role: 'all', cannot: true, can: ['waive'], subject: 'waivers', where: { branch: { equals: 'main' }, rule: { equals: 'proven' } } },
  { role: 'release-manager', can: ['read', 'release'], subject: 'releases' },
  { role: 'all', cannot: true, can: ['release'], subject: 'releases', where: { budgetSpent: { equals: true } } },
]

/** Filter any collection of records by CanCanCan abilities (`accessible_by`). */
export const accessibleBy = <T>(
  abilities: readonly Ability[],
  roles: readonly ScopedRole[],
  subject: string,
  action: string,
  docs: readonly T[],
  user: { id?: string | null; tenants?: readonly string[] } = {},
): T[] => docs.filter((doc) => checkAccess(abilities, roles, subject, action, doc, user))

/** Scoped OWNERS approval: returns a content-addressed approval entry linked to target path/collection and change. */
export const approveOwnerChange = (
  roles: readonly ScopedRole[],
  scopeId: string,
  changeId: string,
  user: { id?: string | null; tenants?: readonly string[] } = {},
) => {
  const approved = checkAccess(RBAC_ABILITIES, roles, 'owners', 'approve', { id: scopeId }, user)
  const payload = { kind: 'owners-approval', scopeId, changeId, approved }
  const canonical = canonicalText(payload)
  const address = uuid(canonical)
  return {
    phase: 'owners-approval' as const,
    approved,
    scopeId,
    changeId,
    address,
    sealed: approved && seal(address).valid,
    sha256: hex(sha256(utf8(canonical))),
  }
}

/** SLSA / Scorecard attestation signed with ML-DSA-65 only when the caller holds the scoped role. */
export const signAttestation = (
  roles: readonly ScopedRole[],
  subject: 'slsa' | 'scorecard',
  repo: string,
  payload: Record<string, unknown>,
  user: { id?: string | null; tenants?: readonly string[] } = {},
) => {
  const authorised = checkAccess(RBAC_ABILITIES, roles, subject, 'attest', { id: repo, ...payload }, user)
  const canonical = canonicalText({ subject, repo, payload })
  const address = uuid(canonical)
  if (!authorised) {
    return {
      phase: 'rbac-attestation' as const,
      subject,
      repo,
      authorised: false as const,
      algorithm: 'ML-DSA-65' as const,
      verified: false as const,
      refusesChanged: false as const,
      address,
      sealed: false as const,
    }
  }
  const signed = dsaRound({ algorithm: 'ML-DSA-65' }, canonical)
  return {
    phase: 'rbac-attestation' as const,
    subject,
    repo,
    authorised: true as const,
    algorithm: signed.algorithm,
    publicKey: signed.publicKey,
    signature: signed.signature,
    verified: Boolean(signed.verified),
    refusesChanged: Boolean(signed.refusesChanged),
    address,
    sha256: hex(sha256(utf8(canonical))),
    sealed: seal(address).valid,
  }
}

export type PenaltyRecord = { id: string; tenant: string; rule: string; coins: number }

/** Price and filter rule penalties through `accessible_by`: ledger counts only clearable penalties. */
export const penaltyLedger = (
  roles: readonly ScopedRole[],
  penalties: readonly PenaltyRecord[],
  user: { id?: string | null; tenants?: readonly string[] } = {},
) => {
  const readable = accessibleBy(RBAC_ABILITIES, roles, 'penalties', 'read', penalties, user)
  const clearable = accessibleBy(RBAC_ABILITIES, roles, 'penalties', 'clear', penalties, user)
  const clearableCoins = clearable.reduce((s, p) => s + p.coins, 0)
  return {
    phase: 'penalty-ledger' as const,
    total: penalties.length,
    readable: readable.length,
    clearable: clearable.length,
    clearableCoins,
    items: clearable,
  }
}

/** Evaluate a single RBAC policy check with `getAccess` Where query and `checkAccess` boolean verdict. */
export const rbacCheck = (input: {
  roles?: readonly ScopedRole[]
  subject?: string
  action?: string
  doc?: Record<string, unknown>
  user?: { id?: string | null; tenants?: readonly string[] }
}) => {
  const roles = Array.isArray(input.roles) ? input.roles : []
  const subject = typeof input.subject === 'string' ? input.subject : 'gts-style'
  const action = typeof input.action === 'string' ? input.action : 'read'
  const doc = input.doc ?? {}
  const user = input.user ?? {}
  const where = getAccess(RBAC_ABILITIES, roles, subject, action, user)
  const allowed = checkAccess(RBAC_ABILITIES, roles, subject, action, doc, user)
  return { phase: 'rbac-check' as const, subject, action, where, allowed }
}

/** Execute all 8 Google Standards RBAC self-checks (positive grants + negative controls) and seal receipt. */
export const rbacAudit = (origin = 'https://qpu.uuidna.com') => {
  const root = trimTrailingSlashes(origin)
  const tsRoles = listRolesFromGroups(WORKSPACE_GROUP_ROLES, [{ email: 'group:ts-readability' }])
  const readAllowed = tsRoles.phase === 'roles' && checkAccess(RBAC_ABILITIES, tsRoles.roles, 'gts-style', 'approve', { id: 'typescript' })
  const wrongScopeDenied = tsRoles.phase === 'roles' && !checkAccess(RBAC_ABILITIES, tsRoles.roles, 'gts-style', 'approve', { id: 'python' })

  const ownerRoles: ScopedRole[] = [{ name: 'owner', resourceType: 'owners', resource: 'src/quantum' }]
  const ownerOk = approveOwnerChange(ownerRoles, 'src/quantum', 'cl-1').approved
  const nonOwnerDenied = !approveOwnerChange(ownerRoles, 'site', 'cl-2').approved

  const aipRoles: ScopedRole[] = [{ name: 'aip-reviewer', resourceType: 'aip-design', resource: 'AIP-121' }]
  const aipList = accessibleBy(RBAC_ABILITIES, aipRoles, 'aip-design', 'approve', [{ id: 'AIP-121' }, { id: 'AIP-193' }])

  const waiverRoles: ScopedRole[] = [{ name: 'tenant-admin' }]
  const draftStyleWaived = checkAccess(RBAC_ABILITIES, waiverRoles, 'waivers', 'waive', { branch: 'feat', rule: 'gts-style', status: 'draft' })
  const mainFoldedBlocked = !checkAccess(RBAC_ABILITIES, [{ name: 'workspace-admin' }], 'waivers', 'waive', { branch: 'main', rule: 'folded', status: 'draft' })
  const mainProvenBlocked = !checkAccess(RBAC_ABILITIES, [{ name: 'workspace-admin' }], 'waivers', 'waive', { branch: 'main', rule: 'proven', status: 'draft' })

  const penalties: PenaltyRecord[] = [
    { id: 'p1', tenant: 'qpu', rule: 'gts-style', coins: 2 },
    { id: 'p2', tenant: 'qpu', rule: 'aip-design', coins: 5 },
    { id: 'p3', tenant: 'other', rule: 'gts-style', coins: 3 },
  ]
  const adminLedger = penaltyLedger([{ name: 'workspace-admin' }], penalties)
  const tenantLedger = penaltyLedger([{ name: 'tenant-admin' }], penalties, { tenants: ['qpu'] })
  const readLedger = penaltyLedger([{ name: 'readability' }], penalties)

  const slsaOk = signAttestation([{ name: 'slsa-attestor', resourceType: 'slsa', resource: 'uuidna/qpu' }], 'slsa', 'uuidna/qpu', { build: 'clean' })
  const slsaDenied = signAttestation([{ name: 'readability' }], 'slsa', 'uuidna/qpu', { build: 'clean' })

  const sloRoles: ScopedRole[] = [{ name: 'slo-owner', resourceType: 'slo', resource: 'mcp-e2e' }, { name: 'release-manager' }]
  const sloAck = checkAccess(RBAC_ABILITIES, sloRoles, 'slo', 'acknowledge', { id: 'mcp-e2e' })
  const releaseOk = checkAccess(RBAC_ABILITIES, sloRoles, 'releases', 'release', { budgetSpent: false })
  const releaseBlocked = !checkAccess(RBAC_ABILITIES, sloRoles, 'releases', 'release', { budgetSpent: true })

  const checks = [
    { id: 'rbac-standards-as-subjects', passed: RBAC_SUBJECTS.length === 11 && mainProvenBlocked },
    { id: 'rbac-readability-role', passed: readAllowed && wrongScopeDenied },
    { id: 'rbac-owners-scoped', passed: ownerOk && nonOwnerDenied },
    { id: 'rbac-aip-reviewer', passed: aipList.length === 1 && aipList[0]!.id === 'AIP-121' },
    { id: 'rbac-waiver-cannot', passed: draftStyleWaived && mainFoldedBlocked && mainProvenBlocked },
    { id: 'rbac-penalties-accessible-by', passed: adminLedger.clearableCoins === 10 && tenantLedger.clearableCoins === 7 && readLedger.clearableCoins === 5 },
    { id: 'rbac-slsa-attestor', passed: slsaOk.authorised && slsaOk.verified && slsaOk.refusesChanged && !slsaDenied.authorised },
    { id: 'rbac-slo-owner', passed: sloAck && releaseOk && releaseBlocked },
  ]

  const holds = checks.every((c) => c.passed)
  const summary = {
    phase: 'rbac-audit' as const,
    origin: root,
    holds,
    leadsServed: checks.filter((c) => c.passed).length,
    subjects: RBAC_SUBJECTS.length,
    abilities: RBAC_ABILITIES.length,
    checks,
  }
  const canonical = canonicalText(summary)
  const address = uuid(canonical)
  return {
    ...summary,
    address,
    handle: address.slice(0, 8),
    sha256: hex(sha256(utf8(canonical))),
    sealed: seal(address).valid,
    standard: SDK_VOCABULARY,
    licence: LICENSE.spdx,
  }
}
