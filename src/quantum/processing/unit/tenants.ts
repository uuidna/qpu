// The tenants: one Worker, one host per tenant, one docket each, from Lean's Config.tenants; a
// workers.dev host is the operator's, anything else local.
import { TENANTS } from '../config-index.ts'
export { TENANTS }
export const tenant = (hostname: string): string => TENANTS[hostname] ?? (hostname.endsWith('.workers.dev') ? 'ceci' : 'local')
