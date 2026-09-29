/**
 * Plugin System - Extensible architecture for custom tools, integrations, and domains
 * Dynamic plugin loading, hot reload, plugin marketplace
 */

export interface Plugin {
  id: string
  name: string
  version: string
  author: string
  description: string
  capabilities: string[]
  config?: Record<string, unknown>
  status: 'installed' | 'enabled' | 'disabled' | 'error'
  metadata?: Record<string, unknown>
}

export interface PluginManifest {
  id: string
  name: string
  version: string
  author: string
  description: string
  entryPoint: string
  capabilities: string[]
  dependencies?: Record<string, string>
  config?: Record<string, unknown>
  permissions?: string[]
}

export interface PluginHook {
  name: string
  handler: (context: unknown) => Promise<unknown>
  priority: number
}

export interface PluginApi {
  register: (hook: string, handler: (context: unknown) => Promise<unknown>) => void
  unregister: (hook: string) => void
  invoke: (hook: string, context: unknown) => Promise<unknown>
  getConfig: () => Record<string, unknown>
  log: (level: string, message: string) => void
}

export class PluginSystem {
  private plugins: Map<string, Plugin> = new Map()
  private manifests: Map<string, PluginManifest> = new Map()
  private hooks: Map<string, PluginHook[]> = new Map()
  private hotReloadEnabled = true

  constructor() {
    this.initializeHooks()
  }

  private initializeHooks(): void {
    const coreHooks = [
      'on-request',
      'on-response',
      'on-error',
      'on-metric',
      'on-deploy',
      'on-audit',
      'on-compliance-check',
      'on-performance-analysis'
    ]

    coreHooks.forEach(hook => {
      this.hooks.set(hook, [])
    })
  }

  installPlugin(manifest: PluginManifest): Plugin {
    const plugin: Plugin = {
      id: manifest.id,
      name: manifest.name,
      version: manifest.version,
      author: manifest.author,
      description: manifest.description,
      capabilities: manifest.capabilities,
      config: manifest.config,
      status: 'installed'
    }

    this.plugins.set(plugin.id, plugin)
    this.manifests.set(manifest.id, manifest)

    return plugin
  }

  enablePlugin(pluginId: string): Plugin | null {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) return null

    plugin.status = 'enabled'
    return plugin
  }

  disablePlugin(pluginId: string): Plugin | null {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) return null

    plugin.status = 'disabled'
    return plugin
  }

  uninstallPlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) return false

    this.plugins.delete(pluginId)
    this.manifests.delete(pluginId)

    // Remove all hooks from this plugin
    for (const [, hooks] of this.hooks) {
      const filtered = hooks.filter(h => !h.handler.toString().includes(pluginId))
      this.hooks.set(hooks as any, filtered)
    }

    return true
  }

  registerHook(pluginId: string, hookName: string, handler: (context: unknown) => Promise<unknown>, priority: number = 0): void {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, [])
    }

    const hook: PluginHook = {
      name: hookName,
      handler,
      priority
    }

    const hooks = this.hooks.get(hookName)!
    hooks.push(hook)
    hooks.sort((a, b) => b.priority - a.priority) // Higher priority first
  }

  async invokeHook(hookName: string, context: unknown): Promise<unknown[]> {
    const hooks = this.hooks.get(hookName) || []
    const results: unknown[] = []

    for (const hook of hooks) {
      try {
        const result = await hook.handler(context)
        results.push(result)
      } catch (error) {
        console.error(`Hook ${hookName} failed:`, error)
      }
    }

    return results
  }

  createPluginAPI(pluginId: string): PluginApi {
    return {
      register: (hook: string, handler: (context: unknown) => Promise<unknown>) => {
        this.registerHook(pluginId, hook, handler)
      },
      unregister: (hook: string) => {
        const hooks = this.hooks.get(hook) || []
        this.hooks.set(hook, hooks.filter(h => !h.handler.toString().includes(pluginId)))
      },
      invoke: (hook: string, context: unknown) => this.invokeHook(hook, context),
      getConfig: () => {
        const manifest = this.manifests.get(pluginId)
        return manifest?.config || {}
      },
      log: (level: string, message: string) => {
        console.log(`[${pluginId}] [${level}] ${message}`)
      }
    }
  }

  getPlugins(status?: string): Plugin[] {
    const plugins = Array.from(this.plugins.values())
    return status ? plugins.filter(p => p.status === status) : plugins
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId)
  }

  configurePlugin(pluginId: string, config: Record<string, unknown>): Plugin | null {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) return null

    plugin.config = { ...plugin.config, ...config }
    return plugin
  }

  enableHotReload(enabled: boolean): void {
    this.hotReloadEnabled = enabled
  }

  reloadPlugin(pluginId: string): boolean {
    if (!this.hotReloadEnabled) return false

    const plugin = this.plugins.get(pluginId)
    if (!plugin) return false

    // Simulate hot reload
    plugin.status = 'enabled'
    return true
  }

  getPluginMarketplace(): Array<{ id: string; name: string; version: string; downloads: number; rating: number }> {
    // Mock marketplace
    return [
      {
        id: 'slack-integration',
        name: 'Slack Integration',
        version: '1.0.0',
        downloads: 1250,
        rating: 4.8
      },
      {
        id: 'github-sync',
        name: 'GitHub Sync',
        version: '1.2.0',
        downloads: 890,
        rating: 4.9
      },
      {
        id: 'datadog-monitoring',
        name: 'Datadog Monitoring',
        version: '1.1.0',
        downloads: 650,
        rating: 4.7
      },
      {
        id: 'jira-integration',
        name: 'Jira Integration',
        version: '1.0.5',
        downloads: 1100,
        rating: 4.6
      },
      {
        id: 'pagerduty-alerts',
        name: 'PagerDuty Alerts',
        version: '1.0.0',
        downloads: 520,
        rating: 4.9
      }
    ]
  }

  installFromMarketplace(pluginId: string): Plugin | null {
    const marketplace = this.getPluginMarketplace()
    const marketplacePlugin = marketplace.find(p => p.id === pluginId)

    if (!marketplacePlugin) return null

    const manifest: PluginManifest = {
      id: pluginId,
      name: marketplacePlugin.name,
      version: marketplacePlugin.version,
      author: 'Community',
      description: `Community plugin: ${marketplacePlugin.name}`,
      entryPoint: `/plugins/${pluginId}/index.js`,
      capabilities: ['integration']
    }

    return this.installPlugin(manifest)
  }

  getPluginDependencies(pluginId: string): Record<string, string> {
    const manifest = this.manifests.get(pluginId)
    return manifest?.dependencies || {}
  }

  validatePluginPermissions(pluginId: string, requestedPermission: string): boolean {
    const manifest = this.manifests.get(pluginId)
    if (!manifest || !manifest.permissions) return false

    return manifest.permissions.includes(requestedPermission) || manifest.permissions.includes('*')
  }

  getSystemMetrics(): {
    totalPlugins: number
    enabledPlugins: number
    disabledPlugins: number
    hooks: number
    totalHookHandlers: number
  } {
    const plugins = Array.from(this.plugins.values())
    const enabledCount = plugins.filter(p => p.status === 'enabled').length
    const disabledCount = plugins.filter(p => p.status === 'disabled').length
    const hookCount = this.hooks.size
    const handlerCount = Array.from(this.hooks.values()).reduce((sum, h) => sum + h.length, 0)

    return {
      totalPlugins: plugins.length,
      enabledPlugins: enabledCount,
      disabledPlugins: disabledCount,
      hooks: hookCount,
      totalHookHandlers: handlerCount
    }
  }
}

export const pluginSystem = new PluginSystem()
