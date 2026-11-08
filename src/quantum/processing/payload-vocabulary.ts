// The vocabulary the Payload configurations are written in: the configuration kinds, the tenant roles and the operations a role is
// decided on. Pure and importable by anything, the textbook's theorems among them (their counts are read from here, never written by hand).
export const configKinds = ['payload', 'wrangler', 'tenant', 'pwa', 'mcp', 'versions', 'migration', 'fullstack', 'api', 'hooks', 'bindings', 'scopes', 'fields', 'validations', 'access', 'actions', 'packages', 'ecommerce', 'ui', 'adapters', 'gates', 'sets', 'realtime', 'branding', 'policies'] as const
export const TENANT_ROLES = ['tenant-admin', 'editor', 'viewer'] as const
export const OPERATIONS = ['read', 'create', 'update', 'delete'] as const
/** A batch action is one operation applied to many documents: the REST where, or one JSON-RPC array of that operation. RBAC decides it as that operation. */
export const BATCH_ACTIONS = [
  { action: 'read', where: true, rest: 'GET /api/{collection}', mcp: 'tools/list, resources/list, resources/read, ping' },
  { action: 'create', where: false, rest: 'POST /api/{collection}', mcp: 'tools/call' },
  { action: 'update', where: true, rest: 'PATCH /api/{collection}?where', mcp: 'PUT, PATCH' },
  { action: 'delete', where: true, rest: 'DELETE /api/{collection}?where', mcp: 'DELETE' },
] as const
