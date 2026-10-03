import { CloudflareCombination, CloudflarePayload, CloudflareApp, cloudflarePayloadOf } from './payload-cloudflare.js'
export { CLOUDFLARE_RUNTIMES, CLOUDFLARE_DATABASES, CLOUDFLARE_STORAGE, CLOUDFLARE_EMAIL, CLOUDFLARE_PLUGINS, CloudflareCombination, CloudflarePayload, cloudflareKeyOf, cloudflareCombinationOf, CloudflareApp, cloudflarePayloadOf, cloudflareCombinations } from './payload-cloudflare.js'
/**
 * Payload Templates for 4-Mode Deployment
 * Browser / Standalone / Docker / Kubernetes
 * Each mode fully specified, formula-derived, zero-config
 */

export interface PayloadTemplate {
  mode: 'browser' | 'standalone' | 'docker' | 'kubernetes' | 'cloudflare'
  version: string
  spec: Record<string, unknown>
  hardware: HardwareTarget
  optimization: OptimizationConfig
  deployment: DeploymentConfig
}

export interface HardwareTarget {
  cpu: { cores: number; freq: number; cache: string }
  memory: { gb: number; type: string }
  network: { bw: string; latency: string }
  storage: { ssd: string; type: string }
  accelerators?: string[]
}

export interface OptimizationConfig {
  cpu: { ipc: number; frequency: number; powerGating: boolean }
  memory: { prefetch: boolean; compression: number; cacheSize: number }
  network: { routing: string; linkGating: boolean }
  power: { vrm: number; thermalTarget: number }
}

export interface DeploymentConfig {
  instances: number
  scaling: { min: number; max: number; target: number }
  monitoring: boolean
  selfHealing: boolean
  autonomousOptimization: boolean
}

/**
 * Deployment templates: four hardware modes (browser, standalone, docker, kubernetes) and the Cloudflare family (cloudflarePayload) for Next.js + Payload on Workers.
 * @wing cms
 * @kind class
 */
export class PayloadTemplates {
  /**
   * BROWSER MODE: In-app execution via WebAssembly
   * Minimal footprint, real-time UI updates, no backend required
   */
  static browserPayload(): PayloadTemplate {
    return {
      mode: 'browser',
      version: '1.0.0',
      spec: {
        runtime: 'wasm',
        bundle: {
          core: 'uuid-mcp-core.wasm',
          quantum: 'quantum-secure-signalling.wasm',
          formulas: 'cross-domain-formulas.wasm',
          hardware: 'hardware-optimization-manifesto.wasm'
        },
        modules: 65, // all MCP operations
        domains: 12, // all connected domains
        size: '4.2MB', // gzipped
        initTime: '120ms',
        memoryLimit: '256MB'
      },
      hardware: {
        cpu: { cores: 2, freq: 2400, cache: '8MB' },
        memory: { gb: 4, type: 'shared' },
        network: { bw: '10Mbps', latency: '50ms' },
        storage: { ssd: '1GB', type: 'indexeddb' }
      },
      optimization: {
        cpu: { ipc: 1.2, frequency: 1800, powerGating: false },
        memory: { prefetch: true, compression: 0.65, cacheSize: 128 },
        network: { routing: 'direct', linkGating: false },
        power: { vrm: 0.8, thermalTarget: 65 }
      },
      deployment: {
        instances: 1,
        scaling: { min: 1, max: 1, target: 1 },
        monitoring: true,
        selfHealing: true,
        autonomousOptimization: true
      }
    }
  }

  /**
   * STANDALONE MODE: Desktop/CLI application
   * Full performance, all optimizations enabled, system integration
   */
  static standalonePayload(): PayloadTemplate {
    return {
      mode: 'standalone',
      version: '1.0.0',
      spec: {
        runtime: 'node.js/v20+',
        binary: 'qpu-standalone',
        entrypoint: 'dist/standalone-server.js',
        modules: 65,
        domains: 12,
        size: '15.3MB', // uncompressed
        initTime: '45ms',
        memoryLimit: '2GB'
      },
      hardware: {
        cpu: { cores: 4, freq: 3600, cache: '16MB' },
        memory: { gb: 8, type: 'local' },
        network: { bw: '1Gbps', latency: '1ms' },
        storage: { ssd: '10GB', type: 'local-filesystem' }
      },
      optimization: {
        cpu: { ipc: 1.54, frequency: 3200, powerGating: true },
        memory: { prefetch: true, compression: 0.58, cacheSize: 512 },
        network: { routing: 'optimized', linkGating: true },
        power: { vrm: 0.68, thermalTarget: 75 }
      },
      deployment: {
        instances: 1,
        scaling: { min: 1, max: 4, target: 2 },
        monitoring: true,
        selfHealing: true,
        autonomousOptimization: true
      }
    }
  }

  /**
   * DOCKER MODE: Container deployment
   * Portable, reproducible, easy horizontal scaling
   */
  static dockerPayload(): PayloadTemplate {
    return {
      mode: 'docker',
      version: '1.0.0',
      spec: {
        image: 'uuidna/qpu:latest',
        dockerfile: `
FROM node:20-alpine
WORKDIR /app
COPY dist/ ./dist/
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "dist/docker-server.js"]
        `,
        modules: 65,
        domains: 12,
        size: '89MB', // image size
        initTime: '800ms',
        memoryLimit: '4GB'
      },
      hardware: {
        cpu: { cores: 2, freq: 2400, cache: '8MB' },
        memory: { gb: 4, type: 'container' },
        network: { bw: '100Mbps', latency: '5ms' },
        storage: { ssd: '20GB', type: 'volume' }
      },
      optimization: {
        cpu: { ipc: 1.52, frequency: 2200, powerGating: true },
        memory: { prefetch: true, compression: 0.61, cacheSize: 256 },
        network: { routing: 'container-aware', linkGating: true },
        power: { vrm: 0.65, thermalTarget: 70 }
      },
      deployment: {
        instances: 3,
        scaling: { min: 1, max: 10, target: 3 },
        monitoring: true,
        selfHealing: true,
        autonomousOptimization: true
      }
    }
  }

  /**
   * KUBERNETES MODE: Cloud-native orchestration
   * Auto-scaling, resilience, multi-datacenter distribution
   */
  static kubernetesPayload(): PayloadTemplate {
    return {
      mode: 'kubernetes',
      version: '1.0.0',
      spec: {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name: 'qpu-deployment',
          namespace: 'production',
          labels: { app: 'qpu', version: '1.0.0' }
        },
        spec: {
          replicas: 5,
          selector: { matchLabels: { app: 'qpu' } },
          template: {
            metadata: { labels: { app: 'qpu', version: '1.0.0' } },
            spec: {
              containers: [
                {
                  name: 'qpu',
                  image: 'uuidna/qpu:1.0.0',
                  ports: [{ containerPort: 8080, name: 'http' }],
                  resources: {
                    requests: { cpu: '2', memory: '4Gi' },
                    limits: { cpu: '4', memory: '8Gi' }
                  },
                  livenessProbe: {
                    httpGet: { path: '/health', port: 8080 },
                    initialDelaySeconds: 30,
                    periodSeconds: 10
                  },
                  readinessProbe: {
                    httpGet: { path: '/ready', port: 8080 },
                    initialDelaySeconds: 10,
                    periodSeconds: 5
                  }
                }
              ],
              affinity: {
                podAntiAffinity: {
                  preferredDuringSchedulingIgnoredDuringExecution: [
                    {
                      weight: 100,
                      podAffinityTerm: {
                        labelSelector: { matchLabels: { app: 'qpu' } },
                        topologyKey: 'kubernetes.io/hostname'
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        modules: 65,
        domains: 12,
        initTime: '2500ms'
      },
      hardware: {
        cpu: { cores: 8, freq: 3600, cache: '32MB' },
        memory: { gb: 32, type: 'cluster' },
        network: { bw: '10Gbps', latency: '0.5ms' },
        storage: { ssd: '100GB', type: 'persistent-volume' }
      },
      optimization: {
        cpu: { ipc: 1.96, frequency: 3400, powerGating: true },
        memory: { prefetch: true, compression: 0.51, cacheSize: 2048 },
        network: { routing: 'k8s-sdn', linkGating: true },
        power: { vrm: 0.55, thermalTarget: 65 }
      },
      deployment: {
        instances: 5,
        scaling: { min: 3, max: 50, target: 10 },
        monitoring: true,
        selfHealing: true,
        autonomousOptimization: true
      }
    }
  }

  /**
   * Generate optimized payload for detected hardware
   */
  static autoDetectPayload(hwProfile: Partial<HardwareTarget>): PayloadTemplate {
    const cores = hwProfile.cpu?.cores || 4
    const memGb = hwProfile.memory?.gb || 8
    const isSSD = hwProfile.storage?.ssd === 'yes'

    // Formula: if cores < 2, use browser; if cores < 8, standalone; if cores < 32, docker; else k8s
    if (cores < 2) return this.browserPayload()
    if (cores < 8) return this.standalonePayload()
    if (cores < 32) return this.dockerPayload()
    return this.kubernetesPayload()
  }

  /**
   * Template validation against hardware constraints
   */
  static validate(payload: PayloadTemplate, hardware: HardwareTarget): { valid: boolean; issues: string[] } {
    const issues: string[] = []

    // CPU: template core requirement vs available cores
    const templateCores = ((payload.spec as Record<string, unknown>).modules as number) || 1
    if (hardware.cpu.cores < Math.ceil((templateCores as number) / 13)) {
      issues.push(`CPU cores (${hardware.cpu.cores}) insufficient for template requirements`)
    }

    // Memory: check allocation
    const memNeeded = payload.optimization.memory.cacheSize / 1024 + 0.5
    if (hardware.memory.gb < memNeeded) {
      issues.push(`Memory (${hardware.memory.gb}GB) insufficient, need ${memNeeded}GB`)
    }

    // Network: latency check
    const maxLatency = payload.mode === 'browser' ? 50 : payload.mode === 'standalone' ? 1 : 5
    const latencyMs = parseInt(hardware.network.latency)
    if (latencyMs > maxLatency) {
      issues.push(`Network latency (${latencyMs}ms) exceeds limit (${maxLatency}ms)`)
    }

    return {
      valid: issues.length === 0,
      issues
    }
  }

  /**
   * All templates indexed by mode
   */
  /** Next.js + Payload on Cloudflare Workers for one combination; enumerate them with cloudflareCombinations(). */
  static cloudflarePayload(c: CloudflareCombination, name?: string, app?: CloudflareApp): CloudflarePayload {
    return cloudflarePayloadOf(c, name, app)
  }

  static allTemplates(): Record<string, PayloadTemplate> {
    return {
      browser: this.browserPayload(),
      standalone: this.standalonePayload(),
      docker: this.dockerPayload(),
      kubernetes: this.kubernetesPayload()
    }
  }
}

// ============================================================================
// CLOUDFLARE: Next.js + Payload on Workers, every combination
// ============================================================================

/**
 * A PayloadTemplates instance.
 * @wing cms
 * @kind function
 */
export const payloadTemplates = new PayloadTemplates()
