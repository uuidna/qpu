// MCP Server Discovery & Composition (WAVE 6)
// Dynamically find, connect to, and compose external MCP servers

import type { MCPRequest, MCPResponse } from './mcp-server.js'

export interface MCPServerInfo {
  id: string
  name: string
  url?: string
  protocol: 'stdio' | 'sse' | 'http' | 'websocket'
  capabilities: string[]
  tools: Array<{ name: string; description: string; schema?: any }>
  resources?: Array<{ uri: string; description: string }>
  ping: number  // latency in ms
  available: boolean
  lastChecked: number
  priority: number
}

export interface MCPRegistry {
  servers: Map<string, MCPServerInfo>
  tools: Map<string, { server: string; tool: string }>
  resources: Map<string, { server: string; resource: string }>
}

export class MCPDiscovery {
  private registry: MCPRegistry = {
    servers: new Map(),
    tools: new Map(),
    resources: new Map()
  }

  private discoveryMethods: Array<{
    name: string
    discover: () => Promise<MCPServerInfo[]>
  }> = [
    { name: 'local-stdio', discover: () => this.discoverLocalStdio() },
    { name: 'cloudflare-catalog', discover: () => this.discoverCloudflare() },
    { name: 'github-registry', discover: () => this.discoverGitHub() },
    { name: 'http-endpoints', discover: () => this.discoverHTTPEndpoints() },
    { name: 'environment', discover: () => this.discoverFromEnvironment() }
  ]

  private connections: Map<string, any> = new Map()

  async initialize(): Promise<void> {
    // Run all discovery methods in parallel
    const results = await Promise.allSettled(
      this.discoveryMethods.map(m => m.discover())
    )

    for (const result of results) {
      if (result.status === 'fulfilled') {
        for (const server of result.value) {
          await this.registerServer(server)
        }
      }
    }

    console.log(`MCP Discovery: found ${this.registry.servers.size} servers`)
  }

  // Route MCP requests to appropriate server
  async route(request: MCPRequest): Promise<MCPResponse> {
    const { method, params } = request

    // Check if tool is available locally
    if (method === 'tools/call') {
      const toolName = params.name
      const serverInfo = this.registry.tools.get(toolName)

      if (serverInfo) {
        return this.callRemote(serverInfo.server, toolName, params.arguments)
      }
    }

    // Check if resource is available remotely
    if (method === 'resources/read') {
      const uri = params.uri
      const resourceInfo = this.registry.resources.get(uri)

      if (resourceInfo) {
        return this.readRemoteResource(resourceInfo.server, uri)
      }
    }

    // List all available tools
    if (method === 'tools/list') {
      return this.listAllTools()
    }

    // List all available resources
    if (method === 'resources/list') {
      return this.listAllResources()
    }

    // List available servers
    if (method === 'servers/list') {
      return this.listServers()
    }

    // Health check
    if (method === 'servers/health') {
      return this.checkServerHealth(params.server)
    }

    return {
      success: false,
      error: `No handler for ${method}`,
      provider: 'mcp-discovery',
      latency: 0,
      timestamp: Date.now()
    }
  }

  // Discovery methods

  private async discoverLocalStdio(): Promise<MCPServerInfo[]> {
    // Discover local stdio-based MCP servers
    // Could scan environment, config files, or pre-configured list

    const servers: MCPServerInfo[] = []

    // Check for commonly used local MCP servers
    const commonServers = [
      { id: 'postgres-mcp', name: 'PostgreSQL MCP', executable: 'mcp-postgres' },
      { id: 'sqlite-mcp', name: 'SQLite MCP', executable: 'mcp-sqlite' },
      { id: 'git-mcp', name: 'Git MCP', executable: 'mcp-git' },
      { id: 'filesystem-mcp', name: 'Filesystem MCP', executable: 'mcp-fs' }
    ]

    for (const server of commonServers) {
      // In production, check if executable exists
      const available = await this.isExecutableAvailable(server.executable)

      if (available) {
        servers.push({
          id: server.id,
          name: server.name,
          protocol: 'stdio',
          capabilities: ['tools', 'resources'],
          tools: [],
          available: true,
          lastChecked: Date.now(),
          priority: 10,
          ping: 0
        })
      }
    }

    return servers
  }

  private async discoverCloudflare(): Promise<MCPServerInfo[]> {
    // Discover Cloudflare-hosted MCP servers

    const servers: MCPServerInfo[] = []

    const cloudflareServers = [
      {
        id: 'cf-d1-mcp',
        name: 'Cloudflare D1 MCP',
        url: 'https://mcp.cloudflare.com/d1',
        tools: ['d1:query', 'd1:write', 'd1:transaction']
      },
      {
        id: 'cf-kv-mcp',
        name: 'Cloudflare KV MCP',
        url: 'https://mcp.cloudflare.com/kv',
        tools: ['kv:get', 'kv:put', 'kv:delete', 'kv:list']
      },
      {
        id: 'cf-do-mcp',
        name: 'Cloudflare Durable Objects MCP',
        url: 'https://mcp.cloudflare.com/do',
        tools: ['do:fetch', 'do:list', 'do:create']
      },
      {
        id: 'cf-ai-mcp',
        name: 'Cloudflare AI MCP',
        url: 'https://mcp.cloudflare.com/ai',
        tools: ['ai:text-generation', 'ai:translation', 'ai:summarization']
      }
    ]

    for (const server of cloudflareServers) {
      const ping = await this.ping(server.url || '')
      if (ping > 0) {
        servers.push({
          id: server.id,
          name: server.name,
          url: server.url,
          protocol: 'http',
          capabilities: ['tools', 'resources'],
          tools: server.tools.map(name => ({
            name,
            description: `Cloudflare ${name}`,
            schema: {}
          })),
          available: true,
          lastChecked: Date.now(),
          priority: 20,
          ping
        })
      }
    }

    return servers
  }

  private async discoverGitHub(): Promise<MCPServerInfo[]> {
    // Discover MCP servers from GitHub

    const servers: MCPServerInfo[] = []

    try {
      // Fetch list of popular MCP servers from GitHub registry
      const response = await fetch('https://api.github.com/search/repositories?q=topic:mcp-server&sort=stars&per_page=10')
      const data = await response.json()

      for (const repo of data.items || []) {
        // Try to find HTTP endpoint or documentation
        const server: MCPServerInfo = {
          id: `github:${repo.name}`,
          name: repo.name,
          url: repo.homepage || undefined,
          protocol: 'http',
          capabilities: ['tools'],
          tools: [],
          available: false,
          lastChecked: Date.now(),
          priority: 15,
          ping: 0
        }

        // Try to ping
        if (server.url) {
          server.ping = await this.ping(server.url)
          server.available = server.ping > 0
        }

        if (server.available) {
          servers.push(server)
        }
      }
    } catch (error) {
      console.warn('GitHub MCP discovery failed:', error)
    }

    return servers
  }

  private async discoverHTTPEndpoints(): Promise<MCPServerInfo[]> {
    // Discover MCP servers from configured HTTP endpoints

    const servers: MCPServerInfo[] = []
    const endpoints = (process.env.MCP_SERVERS || '').split(',').filter(e => e.trim())

    for (const endpoint of endpoints) {
      const url = endpoint.trim()
      const ping = await this.ping(url)

      if (ping > 0) {
        // Fetch server info
        try {
          const response = await fetch(`${url}/info`)
          const info = await response.json()

          servers.push({
            id: `http:${url}`,
            name: info.name || url,
            url,
            protocol: 'http',
            capabilities: info.capabilities || ['tools'],
            tools: info.tools || [],
            available: true,
            lastChecked: Date.now(),
            priority: info.priority || 25,
            ping
          })
        } catch (error) {
          console.warn(`Failed to get info from ${url}:`, error)
        }
      }
    }

    return servers
  }

  private async discoverFromEnvironment(): Promise<MCPServerInfo[]> {
    // Discover servers from environment variables

    const servers: MCPServerInfo[] = []

    // Look for MCP_SERVER_* environment variables
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith('MCP_SERVER_')) {
        const serverName = key.replace('MCP_SERVER_', '').toLowerCase()
        const serverUrl = value as string

        const ping = await this.ping(serverUrl)
        if (ping > 0) {
          servers.push({
            id: `env:${serverName}`,
            name: serverName,
            url: serverUrl,
            protocol: 'http',
            capabilities: ['tools', 'resources'],
            tools: [],
            available: true,
            lastChecked: Date.now(),
            priority: 30,  // Highest priority - explicitly configured
            ping
          })
        }
      }
    }

    return servers
  }

  // Registration and connection

  private async registerServer(info: MCPServerInfo): Promise<void> {
    this.registry.servers.set(info.id, info)

    // Index tools
    for (const tool of info.tools) {
      this.registry.tools.set(tool.name, {
        server: info.id,
        tool: tool.name
      })
    }

    // Index resources
    if (info.resources) {
      for (const resource of info.resources) {
        this.registry.resources.set(resource.uri, {
          server: info.id,
          resource: resource.uri
        })
      }
    }
  }

  private async callRemote(serverId: string, toolName: string, args: any): Promise<MCPResponse> {
    const server = this.registry.servers.get(serverId)
    if (!server) {
      return {
        success: false,
        error: `Server ${serverId} not found`,
        provider: 'mcp-discovery',
        latency: 0,
        timestamp: Date.now()
      }
    }

    const startTime = performance.now()

    try {
      // Get or create connection
      let connection = this.connections.get(serverId)
      if (!connection) {
        connection = await this.createConnection(server)
        this.connections.set(serverId, connection)
      }

      // Call remote tool
      const response = await connection.call(toolName, args)

      return {
        success: response.success,
        data: response.data,
        error: response.error,
        provider: serverId,
        latency: performance.now() - startTime,
        timestamp: Date.now()
      }
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: serverId,
        latency: performance.now() - startTime,
        timestamp: Date.now()
      }
    }
  }

  private async readRemoteResource(serverId: string, uri: string): Promise<MCPResponse> {
    const server = this.registry.servers.get(serverId)
    if (!server) {
      return {
        success: false,
        error: `Server ${serverId} not found`,
        provider: 'mcp-discovery',
        latency: 0,
        timestamp: Date.now()
      }
    }

    const startTime = performance.now()

    try {
      const connection = this.connections.get(serverId) || await this.createConnection(server)

      const response = await connection.readResource(uri)

      return {
        success: true,
        data: response,
        provider: serverId,
        latency: performance.now() - startTime,
        timestamp: Date.now()
      }
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: serverId,
        latency: performance.now() - startTime,
        timestamp: Date.now()
      }
    }
  }

  private async createConnection(server: MCPServerInfo): Promise<any> {
    // Create appropriate connection based on protocol

    switch (server.protocol) {
      case 'http':
        return {
          call: async (toolName: string, args: any) => {
            const response = await fetch(`${server.url}/tools/${toolName}`, {
              method: 'POST',
              body: JSON.stringify(args)
            })
            return response.json()
          },
          readResource: async (uri: string) => {
            const response = await fetch(`${server.url}/resources/${uri}`)
            return response.text()
          }
        }

      case 'stdio':
        // Would require spawning child process
        return null

      case 'websocket':
        // Would require WebSocket connection
        return null

      default:
        throw new Error(`Unsupported protocol: ${server.protocol}`)
    }
  }

  // Utilities

  private async ping(url: string): Promise<number> {
    const startTime = performance.now()
    try {
      await Promise.race([
        fetch(url, { method: 'HEAD' }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ])
      return Math.round(performance.now() - startTime)
    } catch {
      return -1
    }
  }

  private async isExecutableAvailable(executable: string): Promise<boolean> {
    try {
      // In browser environment, this would return false
      // In Node environment, could check PATH
      return false
    } catch {
      return false
    }
  }

  // Response methods

  private async listAllTools(): Promise<MCPResponse> {
    const tools = Array.from(this.registry.tools.entries()).map(([name, info]) => ({
      name,
      server: info.server,
      tool: info.tool
    }))

    return {
      success: true,
      data: {
        tools,
        total: tools.length
      },
      provider: 'mcp-discovery',
      latency: 0,
      timestamp: Date.now()
    }
  }

  private async listAllResources(): Promise<MCPResponse> {
    const resources = Array.from(this.registry.resources.entries()).map(([uri, info]) => ({
      uri,
      server: info.server,
      resource: info.resource
    }))

    return {
      success: true,
      data: {
        resources,
        total: resources.length
      },
      provider: 'mcp-discovery',
      latency: 0,
      timestamp: Date.now()
    }
  }

  private async listServers(): Promise<MCPResponse> {
    const servers = Array.from(this.registry.servers.values()).map(s => ({
      id: s.id,
      name: s.name,
      available: s.available,
      tools: s.tools.length,
      resources: s.resources?.length || 0,
      ping: s.ping,
      priority: s.priority
    }))

    return {
      success: true,
      data: {
        servers,
        total: servers.length
      },
      provider: 'mcp-discovery',
      latency: 0,
      timestamp: Date.now()
    }
  }

  private async checkServerHealth(serverId?: string): Promise<MCPResponse> {
    if (serverId) {
      const server = this.registry.servers.get(serverId)
      if (!server) {
        return {
          success: false,
          error: `Server ${serverId} not found`,
          provider: 'mcp-discovery',
          latency: 0,
          timestamp: Date.now()
        }
      }

      const ping = await this.ping(server.url || '')

      return {
        success: ping > 0,
        data: {
          server: serverId,
          available: ping > 0,
          ping,
          lastChecked: Date.now()
        },
        provider: 'mcp-discovery',
        latency: 0,
        timestamp: Date.now()
      }
    }

    // Check all servers
    const results: Record<string, any> = {}

    for (const [id, server] of this.registry.servers) {
      const ping = await this.ping(server.url || '')
      results[id] = {
        available: ping > 0,
        ping,
        lastChecked: Date.now()
      }
    }

    return {
      success: true,
      data: results,
      provider: 'mcp-discovery',
      latency: 0,
      timestamp: Date.now()
    }
  }

  // Getters

  getRegistry(): MCPRegistry {
    return this.registry
  }

  getServer(id: string): MCPServerInfo | undefined {
    return this.registry.servers.get(id)
  }

  getTool(name: string): { server: string; tool: string } | undefined {
    return this.registry.tools.get(name)
  }

  listAvailableServers(): MCPServerInfo[] {
    return Array.from(this.registry.servers.values())
      .filter(s => s.available)
      .sort((a, b) => b.priority - a.priority)
  }
}

export const mcpDiscovery = new MCPDiscovery()
