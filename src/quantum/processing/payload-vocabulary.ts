// The vocabulary the Payload configurations are written in: the configuration kinds, the tenant roles and the operations a role is
// decided on. Pure and importable by anything, the textbook's theorems among them (their counts are read from here, never written by hand).
export const configKinds = ['payload', 'wrangler', 'tenant', 'pwa', 'mcp', 'versions', 'migration', 'fullstack', 'api', 'hooks', 'bindings', 'scopes', 'fields', 'validations', 'access', 'actions', 'packages', 'ecommerce', 'ui', 'adapters', 'gates', 'sets', 'realtime', 'branding', 'policies'] as const
export const TENANT_ROLES = ['tenant-admin', 'editor', 'viewer'] as const
export const OPERATIONS = ['read', 'create', 'update', 'delete'] as const
