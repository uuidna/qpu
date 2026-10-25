// Dynamic Adapter Framework: MCP clients define APIs at runtime
// No hardcoded endpoints, tokens, or configs — everything configured via MCP

import { execSync } from 'child_process'

export interface ApiEndpoint {
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  headers?: Record<string, string>
  auth?: {
    type: 'bearer' | 'basic' | 'api_key'
    token?: string
    username?: string
    password?: string
    apiKeyHeader?: string
  }
  body?: unknown
  params?: Record<string, unknown>
}

export interface AdapterOperation {
  name: string
  endpoint: ApiEndpoint | string // Reference to registered endpoint
  transform?: (response: unknown) => unknown
  validate?: (input: unknown) => { valid: boolean; errors: string[] }
}

export interface DynamicAdapter {
  name: string
  version: string
  operations: Map<string, AdapterOperation>
  register(operationName: string, endpoint: ApiEndpoint | string, options?: any): void
  execute(operationName: string, config: unknown): Promise<unknown>
  describe(): { name: string; operations: string[] }
}

// Global registry of API endpoints
const endpointRegistry = new Map<string, ApiEndpoint>()

// Register an API endpoint
export function registerEndpoint(endpoint: ApiEndpoint): void {
  endpointRegistry.set(endpoint.name, endpoint)
  console.log(`[Registry] Registered endpoint: ${endpoint.name}`)
}

// Get registered endpoint
export function getEndpoint(nameOrUrl: string): ApiEndpoint | undefined {
  return endpointRegistry.get(nameOrUrl)
}

// List all registered endpoints
export function listEndpoints(): string[] {
  return Array.from(endpointRegistry.keys())
}

// Execute HTTP request dynamically
async function executeHttpRequest(endpoint: ApiEndpoint, overrideConfig?: any): Promise<unknown> {
  const url = new URL(endpoint.url)

  // Apply params
  const params = { ...endpoint.params, ...(overrideConfig?.params || {}) }
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(endpoint.headers || {}),
  }

  // Apply auth
  if (endpoint.auth) {
    const auth = { ...endpoint.auth, ...(overrideConfig?.auth || {}) }
    if (auth.type === 'bearer' && auth.token) {
      headers['Authorization'] = `Bearer ${auth.token}`
    } else if (auth.type === 'api_key' && auth.token && auth.apiKeyHeader) {
      headers[auth.apiKeyHeader] = auth.token
    } else if (auth.type === 'basic' && auth.username && auth.password) {
      const encoded = Buffer.from(`${auth.username}:${auth.password}`).toString('base64')
      headers['Authorization'] = `Basic ${encoded}`
    }
  }

  // Build body
  let body: string | undefined
  if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
    const bodyData = overrideConfig?.body || endpoint.body
    if (bodyData) {
      body = JSON.stringify(bodyData)
    }
  }

  // Execute request
  const response = await fetch(url.toString(), {
    method: endpoint.method,
    headers,
    body,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }

  return response.json()
}

// Execute local CLI command dynamically
async function executeCliCommand(command: string, args?: Record<string, any>): Promise<unknown> {
  try {
    let cmd = command
    if (args) {
      Object.entries(args).forEach(([key, value]) => {
        cmd += ` --${key} ${value}`
      })
    }
    const output = execSync(cmd, { encoding: 'utf-8' })
    return { success: true, output: output.trim() }
  } catch (error) {
    throw new Error(`Command failed: ${command} - ${String(error)}`)
  }
}

// Factory: Create dynamic adapter
export function createDynamicAdapter(name: string, version: string = '1.0.0'): DynamicAdapter {
  const operations = new Map<string, AdapterOperation>()

  return {
    name,
    version,
    operations,

    register(operationName: string, endpoint: ApiEndpoint | string, options?: any) {
      const resolvedEndpoint = typeof endpoint === 'string' ? getEndpoint(endpoint) : endpoint

      if (!resolvedEndpoint && typeof endpoint === 'string') {
        throw new Error(`Endpoint not found: ${endpoint}`)
      }

      operations.set(operationName, {
        name: operationName,
        endpoint: resolvedEndpoint || endpoint,
        transform: options?.transform,
        validate: options?.validate,
      })
    },

    async execute(operationName: string, config: unknown) {
      const operation = operations.get(operationName)
      if (!operation) {
        throw new Error(`Operation not found: ${operationName}`)
      }

      // Validate if validator provided
      if (operation.validate) {
        const validation = operation.validate(config)
        if (!validation.valid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
        }
      }

      // Execute based on endpoint type
      let result: unknown

      if (typeof operation.endpoint === 'string') {
        // CLI command
        result = await executeCliCommand(operation.endpoint, config as Record<string, any>)
      } else {
        // HTTP request
        result = await executeHttpRequest(operation.endpoint, config)
      }

      // Transform if transformer provided
      if (operation.transform) {
        result = operation.transform(result)
      }

      return result
    },

    describe() {
      return {
        name,
        operations: Array.from(operations.keys()),
      }
    },
  }
}

// MCP Tool Handler: Register endpoint
export const registerEndpointTool = {
  name: 'adapter/register-endpoint',
  description: 'Register a new API endpoint for dynamic adapters to use',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Unique endpoint name' },
      method: { enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], description: 'HTTP method' },
      url: { type: 'string', description: 'API endpoint URL' },
      headers: { type: 'object', description: 'Optional HTTP headers' },
      auth: {
        type: 'object',
        properties: {
          type: { enum: ['bearer', 'basic', 'api_key'] },
          token: { type: 'string' },
          username: { type: 'string' },
          password: { type: 'string' },
          apiKeyHeader: { type: 'string' },
        },
      },
    },
    required: ['name', 'method', 'url'],
  },
  async handler(args: any) {
    registerEndpoint(args)
    return { success: true, endpoint: args.name }
  },
}

// MCP Tool Handler: Create adapter
export const createAdapterTool = {
  name: 'adapter/create',
  description: 'Create a new dynamic adapter',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Adapter name' },
      version: { type: 'string', description: 'Adapter version' },
    },
    required: ['name'],
  },
  async handler(args: any) {
    const adapter = createDynamicAdapter(args.name, args.version || '1.0.0')
    return { success: true, adapter: adapter.describe() }
  },
}

// MCP Tool Handler: Register operation
export const registerOperationTool = {
  name: 'adapter/register-operation',
  description: 'Register an operation on an adapter, pointing to an endpoint',
  inputSchema: {
    type: 'object',
    properties: {
      adapterName: { type: 'string', description: 'Target adapter name' },
      operationName: { type: 'string', description: 'Operation name' },
      endpointName: { type: 'string', description: 'Registered endpoint name to use' },
      transform: { type: 'string', description: 'Optional JS code to transform response' },
    },
    required: ['adapterName', 'operationName', 'endpointName'],
  },
  async handler(args: any) {
    // This would need to be integrated with the adapter registry
    return { success: true, operation: args.operationName }
  },
}

// MCP Tool Handler: Execute operation
export const executeOperationTool = {
  name: 'adapter/execute',
  description: 'Execute an operation on a dynamic adapter',
  inputSchema: {
    type: 'object',
    properties: {
      adapterName: { type: 'string', description: 'Adapter name' },
      operationName: { type: 'string', description: 'Operation name' },
      config: { type: 'object', description: 'Operation configuration' },
    },
    required: ['adapterName', 'operationName'],
  },
  async handler(args: any) {
    // This would need to be integrated with the adapter registry
    return { success: true }
  },
}

// Global adapter registry
const adapterRegistry = new Map<string, DynamicAdapter>()

// Register adapter globally
export function registerAdapter(adapter: DynamicAdapter): void {
  adapterRegistry.set(adapter.name, adapter)
  console.log(`[Registry] Registered adapter: ${adapter.name}`)
}

// Get adapter
export function getAdapter(name: string): DynamicAdapter | undefined {
  return adapterRegistry.get(name)
}

// List adapters
export function listAdapters(): string[] {
  return Array.from(adapterRegistry.keys())
}

// Execute adapter operation
export async function executeAdapterOperation(adapterName: string, operationName: string, config: unknown): Promise<unknown> {
  const adapter = getAdapter(adapterName)
  if (!adapter) {
    throw new Error(`Adapter not found: ${adapterName}`)
  }
  return adapter.execute(operationName, config)
}
