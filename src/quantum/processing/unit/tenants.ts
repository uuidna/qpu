// The tenants: one Worker, one host per tenant, one docket each; a workers.dev host is the operator's, anything else local.
export const TENANTS: Readonly<Record<string, string>> = { 'qpu.uuidna.com': 'uuidna', 'qpu.psg.bg': 'psg' }
export const tenantOf = (hostname: string): string => TENANTS[hostname] ?? (hostname.endsWith('.workers.dev') ? 'ceci' : 'local')
