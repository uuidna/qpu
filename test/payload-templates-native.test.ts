/**
 * Payload Templates - Native UUIDNA OS Testing
 * Test all 4 deployment modes with default configurations
 * Verify each works natively on UUIDNA OS infrastructure
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { PayloadTemplates, type PayloadTemplate, type HardwareTarget } from '../src/deployment/payload-templates.js'

describe('Payload Templates - Native UUIDNA OS', () => {
  let templates: Record<string, PayloadTemplate>
  let mockHardware: HardwareTarget

  beforeEach(() => {
    templates = PayloadTemplates.allTemplates()

    // Mock UUIDNA OS native hardware profile
    mockHardware = {
      cpu: { cores: 8, freq: 3600, cache: '32MB' },
      memory: { gb: 16, type: 'system' },
      network: { bw: '10Gbps', latency: '1ms' },
      storage: { ssd: '256GB', type: 'nvme' }
    }
  })

  // ========================================================================
  // BROWSER PAYLOAD TESTS
  // ========================================================================

  describe('Browser Payload (WASM Mode)', () => {
    let browserPayload: PayloadTemplate

    beforeEach(() => {
      browserPayload = templates.browser
    })

    it('should generate valid browser payload with default config', () => {
      expect(browserPayload.mode).toBe('browser')
      expect(browserPayload.version).toBe('1.0.0')
      expect(browserPayload.spec).toBeDefined()
    })

    it('should have minimal resource requirements', () => {
      const hw = browserPayload.hardware
      expect(hw.cpu.cores).toBe(2)
      expect(hw.memory.gb).toBe(4)
      expect(hw.storage.ssd).toBe('1GB')
    })

    it('should use WASM runtime', () => {
      const spec = browserPayload.spec as Record<string, any>
      expect(spec.runtime).toBe('wasm')
      expect(spec.bundle).toBeDefined()
      expect(spec.bundle.core).toContain('.wasm')
    })

    it('should include all 65 MCP modules', () => {
      const spec = browserPayload.spec as Record<string, any>
      expect(spec.modules).toBe(65)
      expect(spec.domains).toBe(12)
    })

    it('should have fast initialization time', () => {
      const spec = browserPayload.spec as Record<string, any>
      const initMs = parseInt(spec.initTime as string)
      expect(initMs).toBeLessThan(500) // <500ms
    })

    it('should pass validation on UUIDNA hardware', () => {
      const validation = PayloadTemplates.validate(browserPayload, mockHardware)
      expect(validation.valid).toBe(true)
      expect(validation.issues).toHaveLength(0)
    })

    it('should use IndexedDB storage in browser', () => {
      const hw = browserPayload.hardware
      expect(hw.storage.type).toBe('indexeddb')
    })

    it('should have efficient compression settings', () => {
      const opt = browserPayload.optimization
      expect(opt.memory.compression).toBeGreaterThan(0.6)
      expect(opt.memory.compression).toBeLessThan(0.7)
    })

    it('should enable all optimizations by default', () => {
      const deploy = browserPayload.deployment
      expect(deploy.monitoring).toBe(true)
      expect(deploy.selfHealing).toBe(true)
      expect(deploy.autonomousOptimization).toBe(true)
    })

    it('should have single instance deployment', () => {
      const deploy = browserPayload.deployment
      expect(deploy.instances).toBe(1)
      expect(deploy.scaling.min).toBe(1)
      expect(deploy.scaling.max).toBe(1)
    })
  })

  // ========================================================================
  // STANDALONE PAYLOAD TESTS
  // ========================================================================

  describe('Standalone Payload (Desktop/CLI Mode)', () => {
    let standalonePayload: PayloadTemplate

    beforeEach(() => {
      standalonePayload = templates.standalone
    })

    it('should generate valid standalone payload', () => {
      expect(standalonePayload.mode).toBe('standalone')
      expect(standalonePayload.version).toBe('1.0.0')
    })

    it('should use Node.js runtime', () => {
      const spec = standalonePayload.spec as Record<string, any>
      expect(spec.runtime).toContain('node.js')
      expect(spec.binary).toBe('qpu-standalone')
    })

    it('should target medium hardware resources', () => {
      const hw = standalonePayload.hardware
      expect(hw.cpu.cores).toBe(4)
      expect(hw.memory.gb).toBe(8)
      expect(hw.storage.ssd).toBe('10GB')
    })

    it('should have reasonable initialization time', () => {
      const spec = standalonePayload.spec as Record<string, any>
      const initMs = parseInt(spec.initTime as string)
      expect(initMs).toBeLessThan(100) // <100ms
    })

    it('should pass validation on UUIDNA hardware', () => {
      const validation = PayloadTemplates.validate(standalonePayload, mockHardware)
      expect(validation.valid).toBe(true)
    })

    it('should use local filesystem storage', () => {
      const hw = standalonePayload.hardware
      expect(hw.storage.type).toBe('local-filesystem')
    })

    it('should enable power gating optimization', () => {
      const opt = standalonePayload.optimization
      expect(opt.cpu.powerGating).toBe(true)
      expect(opt.network.linkGating).toBe(true)
    })

    it('should support scaling with multiple instances', () => {
      const deploy = standalonePayload.deployment
      expect(deploy.instances).toBe(1)
      expect(deploy.scaling.max).toBeGreaterThan(deploy.instances)
      expect(deploy.scaling.min).toBeLessThanOrEqual(deploy.instances)
    })

    it('should have high IPC (instructions per cycle)', () => {
      const opt = standalonePayload.optimization
      expect(opt.cpu.ipc).toBeGreaterThan(1.5)
      expect(opt.cpu.ipc).toBeLessThan(2.0)
    })

    it('should define proper entrypoint', () => {
      const spec = standalonePayload.spec as Record<string, any>
      expect(spec.entrypoint).toContain('.js')
    })
  })

  // ========================================================================
  // DOCKER PAYLOAD TESTS
  // ========================================================================

  describe('Docker Payload (Container Mode)', () => {
    let dockerPayload: PayloadTemplate

    beforeEach(() => {
      dockerPayload = templates.docker
    })

    it('should generate valid docker payload', () => {
      expect(dockerPayload.mode).toBe('docker')
      expect(dockerPayload.version).toBe('1.0.0')
    })

    it('should define Docker image and Dockerfile', () => {
      const spec = dockerPayload.spec as Record<string, any>
      expect(spec.image).toContain('uuidna/qpu')
      expect(spec.dockerfile).toContain('FROM node:20-alpine')
      expect(spec.dockerfile).toContain('EXPOSE 8080')
    })

    it('should use Node.js Alpine base image', () => {
      const spec = dockerPayload.spec as Record<string, any>
      expect(spec.dockerfile).toContain('alpine')
    })

    it('should have appropriate container resource limits', () => {
      const hw = dockerPayload.hardware
      expect(hw.cpu.cores).toBe(2)
      expect(hw.memory.gb).toBe(4)
      expect(hw.memory.type).toBe('container')
    })

    it('should pass validation on UUIDNA hardware', () => {
      const validation = PayloadTemplates.validate(dockerPayload, mockHardware)
      expect(validation.valid).toBe(true)
    })

    it('should use volume storage', () => {
      const hw = dockerPayload.hardware
      expect(hw.storage.type).toBe('volume')
      expect(hw.storage.ssd).toBe('20GB')
    })

    it('should have faster initialization than K8s', () => {
      const dockerInit = parseInt((dockerPayload.spec as Record<string, any>).initTime as string)
      const k8sInit = parseInt((templates.kubernetes.spec as Record<string, any>).initTime as string)
      expect(dockerInit).toBeLessThan(k8sInit)
    })

    it('should enable horizontal scaling', () => {
      const deploy = dockerPayload.deployment
      expect(deploy.instances).toBe(3)
      expect(deploy.scaling.min).toBe(1)
      expect(deploy.scaling.max).toBe(10)
    })

    it('should enable all optimizations', () => {
      const deploy = dockerPayload.deployment
      expect(deploy.monitoring).toBe(true)
      expect(deploy.selfHealing).toBe(true)
      expect(deploy.autonomousOptimization).toBe(true)
    })

    it('should set production environment', () => {
      const spec = dockerPayload.spec as Record<string, any>
      expect(spec.dockerfile).toContain('NODE_ENV=production')
    })
  })

  // ========================================================================
  // KUBERNETES PAYLOAD TESTS
  // ========================================================================

  describe('Kubernetes Payload (Cloud-Native Mode)', () => {
    let k8sPayload: PayloadTemplate

    beforeEach(() => {
      k8sPayload = templates.kubernetes
    })

    it('should generate valid kubernetes payload', () => {
      expect(k8sPayload.mode).toBe('kubernetes')
      expect(k8sPayload.version).toBe('1.0.0')
    })

    it('should have valid K8s Deployment manifest', () => {
      const spec = k8sPayload.spec as Record<string, any>
      expect(spec.apiVersion).toBe('apps/v1')
      expect(spec.kind).toBe('Deployment')
      expect(spec.metadata).toBeDefined()
      expect(spec.spec).toBeDefined()
    })

    it('should define proper K8s metadata', () => {
      const spec = k8sPayload.spec as Record<string, any>
      expect(spec.metadata.name).toBe('qpu-deployment')
      expect(spec.metadata.namespace).toBe('production')
    })

    it('should have maximum scalability', () => {
      const hw = k8sPayload.hardware
      expect(hw.cpu.cores).toBe(8)
      expect(hw.memory.gb).toBe(32)
      expect(hw.network.bw).toContain('10Gbps')
    })

    it('should pass validation on UUIDNA hardware', () => {
      const validation = PayloadTemplates.validate(k8sPayload, mockHardware)
      expect(validation.valid).toBe(true)
    })

    it('should use persistent volume storage', () => {
      const hw = k8sPayload.hardware
      expect(hw.storage.type).toBe('persistent-volume')
      expect(hw.storage.ssd).toBe('100GB')
    })

    it('should define resource requests and limits', () => {
      const spec = k8sPayload.spec as Record<string, any>
      const containers = spec.spec.template.spec.containers
      expect(containers[0].resources).toBeDefined()
      expect(containers[0].resources.requests).toBeDefined()
      expect(containers[0].resources.limits).toBeDefined()
    })

    it('should define liveness and readiness probes', () => {
      const spec = k8sPayload.spec as Record<string, any>
      const container = spec.spec.template.spec.containers[0]
      expect(container.livenessProbe).toBeDefined()
      expect(container.readinessProbe).toBeDefined()
      expect(container.livenessProbe.httpGet.path).toBe('/health')
      expect(container.readinessProbe.httpGet.path).toBe('/ready')
    })

    it('should enable pod anti-affinity for distribution', () => {
      const spec = k8sPayload.spec as Record<string, any>
      const affinity = spec.spec.template.spec.affinity
      expect(affinity.podAntiAffinity).toBeDefined()
    })

    it('should scale to many replicas', () => {
      const deploy = k8sPayload.deployment
      expect(deploy.instances).toBe(5)
      expect(deploy.scaling.max).toBe(50)
      expect(deploy.scaling.min).toBe(3)
    })

    it('should have best IPC performance', () => {
      const opt = k8sPayload.optimization
      expect(opt.cpu.ipc).toBeGreaterThan(1.9)
      expect(opt.cpu.ipc).toBeLessThanOrEqual(2.0)
    })
  })

  // ========================================================================
  // HARDWARE AUTO-DETECTION TESTS
  // ========================================================================

  describe('Auto-Detection & Selection', () => {
    it('should select browser payload for weak hardware (<2 cores)', () => {
      const weakHw: HardwareTarget = {
        cpu: { cores: 1, freq: 1200, cache: '2MB' },
        memory: { gb: 2, type: 'shared' },
        network: { bw: '5Mbps', latency: '100ms' },
        storage: { ssd: '256MB', type: 'flash' }
      }

      const selected = PayloadTemplates.autoDetectPayload(weakHw)
      expect(selected.mode).toBe('browser')
    })

    it('should select standalone payload for medium hardware (2-8 cores)', () => {
      const mediumHw: HardwareTarget = {
        cpu: { cores: 4, freq: 2400, cache: '8MB' },
        memory: { gb: 8, type: 'local' },
        network: { bw: '100Mbps', latency: '5ms' },
        storage: { ssd: '50GB', type: 'local-filesystem' }
      }

      const selected = PayloadTemplates.autoDetectPayload(mediumHw)
      expect(selected.mode).toBe('standalone')
    })

    it('should select docker payload for good hardware (8-32 cores)', () => {
      const goodHw: HardwareTarget = {
        cpu: { cores: 16, freq: 3200, cache: '16MB' },
        memory: { gb: 16, type: 'system' },
        network: { bw: '1Gbps', latency: '2ms' },
        storage: { ssd: '100GB', type: 'volume' }
      }

      const selected = PayloadTemplates.autoDetectPayload(goodHw)
      expect(selected.mode).toBe('docker')
    })

    it('should select kubernetes payload for high-end hardware (>32 cores)', () => {
      const eliteHw: HardwareTarget = {
        cpu: { cores: 64, freq: 3600, cache: '64MB' },
        memory: { gb: 128, type: 'cluster' },
        network: { bw: '100Gbps', latency: '0.1ms' },
        storage: { ssd: '1TB', type: 'persistent-volume' }
      }

      const selected = PayloadTemplates.autoDetectPayload(eliteHw)
      expect(selected.mode).toBe('kubernetes')
    })
  })

  // ========================================================================
  // VALIDATION TESTS
  // ========================================================================

  describe('Payload Validation', () => {
    it('should validate browser payload against browser-appropriate hardware', () => {
      const browserHw: HardwareTarget = {
        cpu: { cores: 2, freq: 2000, cache: '4MB' },
        memory: { gb: 4, type: 'shared' },
        network: { bw: '10Mbps', latency: '50ms' },
        storage: { ssd: '1GB', type: 'indexeddb' }
      }

      const validation = PayloadTemplates.validate(templates.browser, browserHw)
      expect(validation.valid).toBe(true)
    })

    it('should reject browser payload if latency is too high', () => {
      const poorNetworkHw: HardwareTarget = {
        cpu: { cores: 2, freq: 2000, cache: '4MB' },
        memory: { gb: 4, type: 'shared' },
        network: { bw: '10Mbps', latency: '100ms' }, // Too high
        storage: { ssd: '1GB', type: 'indexeddb' }
      }

      const validation = PayloadTemplates.validate(templates.browser, poorNetworkHw)
      expect(validation.valid).toBe(false)
      expect(validation.issues.length).toBeGreaterThan(0)
    })

    it('should validate all templates against UUIDNA native hardware', () => {
      Object.values(templates).forEach(template => {
        const validation = PayloadTemplates.validate(template, mockHardware)
        expect(validation.valid).toBe(true)
      })
    })

    it('should reject if memory is insufficient', () => {
      const lowMemHw: HardwareTarget = {
        cpu: { cores: 4, freq: 2400, cache: '8MB' },
        memory: { gb: 1, type: 'local' }, // Too low
        network: { bw: '100Mbps', latency: '5ms' },
        storage: { ssd: '10GB', type: 'local-filesystem' }
      }

      const validation = PayloadTemplates.validate(templates.standalone, lowMemHw)
      expect(validation.valid).toBe(false)
    })
  })

  // ========================================================================
  // NATIVE UUIDNA OS INTEGRATION TESTS
  // ========================================================================

  describe('Native UUIDNA OS Integration', () => {
    it('should have all 65 MCP operations in every template', () => {
      Object.values(templates).forEach(template => {
        const spec = template.spec as Record<string, any>
        expect(spec.modules).toBe(65)
      })
    })

    it('should have all 12 domains in every template', () => {
      Object.values(templates).forEach(template => {
        const spec = template.spec as Record<string, any>
        expect(spec.domains).toBe(12)
      })
    })

    it('should enable monitoring on all templates', () => {
      Object.values(templates).forEach(template => {
        expect(template.deployment.monitoring).toBe(true)
      })
    })

    it('should enable self-healing on all templates', () => {
      Object.values(templates).forEach(template => {
        expect(template.deployment.selfHealing).toBe(true)
      })
    })

    it('should enable autonomous optimization on all templates', () => {
      Object.values(templates).forEach(template => {
        expect(template.deployment.autonomousOptimization).toBe(true)
      })
    })

    it('should support vector equilibrium optimization', () => {
      Object.values(templates).forEach(template => {
        const opt = template.optimization
        // All should enable prefetch and compression
        expect(opt.memory.prefetch).toBe(true)
        expect(opt.memory.compression).toBeGreaterThan(0.5)
      })
    })

    it('should scale appropriately for deployment model', () => {
      expect(templates.browser.deployment.scaling.max).toBe(1) // No scale
      expect(templates.standalone.deployment.scaling.max).toBeLessThan(
        templates.docker.deployment.scaling.max
      )
      expect(templates.docker.deployment.scaling.max).toBeLessThan(
        templates.kubernetes.deployment.scaling.max
      )
    })
  })

  // ========================================================================
  // COMPLETE TEMPLATE VERIFICATION
  // ========================================================================

  describe('Complete Template Verification', () => {
    it('should have all 4 templates available', () => {
      expect(Object.keys(templates)).toHaveLength(4)
      expect(templates.browser).toBeDefined()
      expect(templates.standalone).toBeDefined()
      expect(templates.docker).toBeDefined()
      expect(templates.kubernetes).toBeDefined()
    })

    it('should use consistent versioning across templates', () => {
      const versions = Object.values(templates).map(t => t.version)
      expect(new Set(versions).size).toBe(1) // All same version
      expect(versions[0]).toBe('1.0.0')
    })

    it('should have each template pass UUIDNA native hardware validation', () => {
      const results = Object.entries(templates).map(([mode, template]) => ({
        mode,
        valid: PayloadTemplates.validate(template, mockHardware).valid
      }))

      expect(results.every(r => r.valid)).toBe(true)
    })
  })
})
