import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** ACCESS, FORMULATED, AND SECURITY SCREENED. Who may read or write a resource is not a function hidden in a collection
 *  but a formula of naturals at a hex address: a role lattice (0 anon, 1 user, 2 admin, 3 super-admin), publication
 *  status, ownership and tenant isolation, each a pure predicate the collections' access rules call and the receipt
 *  records. The screen crosses the security checks of a request at once — authentication, transport, token entropy,
 *  input cleanliness, rate — and names which fail: a request that does not pass every required check is a violation,
 *  recognised the moment its flags are read, the way split.secondlaw recognises an impossible energy claim. */

const ROLES = ['anon', 'user', 'admin', 'super'] as const
const CHECKS = ['authenticated', 'https', 'token-strong', 'input-clean', 'rate-ok'] as const
const TOKEN_BITS = 256 // the entropy a write token must carry (QPU_WRITE_TOKEN: openssl rand -hex 32)
const PROOF = 'the role lattice anon < user < admin < super; publishedOnly (drafts are the editors’); tenant isolation; the security screen of a request’s checks'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const f = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'access', dst: 'crypt', formula, value, proof: PROOF, ...extra }, holds, { name: `access.${name}`, params })

export class AccessFormulas {
  /** Read access: the public reads what is published (status ≥ 2), a signed-in user (role ≥ 1) reads every version
   *  including drafts. Value 1 when the reader may read, else 0. (publishedOnly, as a formula.) */
  static read(status: number, role: number): CrossFormula { return f('access-read', 'read(status, role) = [status ≥ 2 ∨ role ≥ 1]', status >= 2 || role >= 1 ? 1 : 0, nat(status, role), 'read', [status, role], { published: status >= 2, signedIn: role >= 1 }) }
  /** Write access: a role at or above admin (≥ 2) writes; below it, only the owner of the document writes. Value 1
   *  when the writer may write. owner and user are ids; 0 is no one. */
  static write(role: number, user: number, owner: number): CrossFormula { return f('access-write', 'write(role, user, owner) = [role ≥ 2 ∨ (user > 0 ∧ user = owner)]', role >= 2 || (user > 0 && user === owner) ? 1 : 0, nat(role, user, owner), 'write', [role, user, owner], { admin: role >= 2, owns: user > 0 && user === owner }) }
  /** The role lattice: a holder of role `have` meets a requirement `need` when have ≥ need (anon 0, user 1, admin 2,
   *  super 3). Value 1 when sufficient. */
  static role(have: number, need: number): CrossFormula { return f('access-role', 'role(have, need) = [have ≥ need] over anon < user < admin < super', have >= need ? 1 : 0, nat(have, need) && have < ROLES.length && need < ROLES.length, 'role', [have, need], { have: ROLES[have], need: ROLES[need] }) }
  /** Tenant isolation: a request for tenant `req` reaches a document of tenant `doc` only when they are the same, or
   *  the holder is a super-admin (role 3) crossing tenants. Value 1 when the document is reachable. */
  static tenant(req: number, doc: number, role: number): CrossFormula { return f('access-tenant', 'tenant(req, doc, role) = [req = doc ∨ role = 3]', req === doc || role === 3 ? 1 : 0, nat(req, doc, role), 'tenant', [req, doc, role], { isolated: req !== doc && role !== 3 }) }
  /** The security screen: `flags` is a bitmask of the request's checks (bit0 authenticated, bit1 https, bit2 token
   *  strong, bit3 input clean, bit4 rate ok). Value how many of the five pass; holds only when all five do — a request
   *  that fails any is a violation, and the reading names which. */
  static screen(flags: number): CrossFormula {
    const bits = CHECKS.map((_, i) => (flags >> i) & 1)
    const passed = bits.reduce((a, b) => a + b, 0)
    const failed = CHECKS.filter((_, i) => bits[i] === 0)
    return f('access-screen', 'screen(flags) = |checks passed|; holds ⟺ all five pass', passed, nat(flags) && passed === CHECKS.length, 'screen', [flags], { checks: CHECKS, failed, violation: failed.length > 0 })
  }
  /** The write token's entropy sufficiency: a token of `bits` bits is strong enough to guard writes when bits ≥ 256
   *  (QPU_WRITE_TOKEN is 32 random bytes). Value the margin over the floor; holds when ≥ 0. */
  static token(bits: number): CrossFormula { return f('access-token', 'token(bits) = bits − 256 (the write-token entropy floor)', bits - TOKEN_BITS, nat(bits) && bits >= TOKEN_BITS, 'token', [bits], { floor: TOKEN_BITS, strong: bits >= TOKEN_BITS }) }
}

for (const name of ['read', 'role', 'screen', 'tenant', 'token', 'write'] as const)
  qpuHexRegisterOf('access', name, (AccessFormulas[name] as (...x: unknown[]) => unknown).bind(AccessFormulas))
