import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** DRIVER — the arithmetic the kernel driver counts in. DMA ring entries and 4K pages off a buffer, the payload a frame
 *  carries, packets a link passes per second, tx+rx queues per core, IRQ vectors, the bytes an MMIO window maps, and a
 *  ring's descriptor bytes. Each an exact integer at a hex address; develops the driver leads. */

const PROOF = 'driver counts: ring = bytes / desc; dmaPages = ceil(bytes / 4096); payload = max(0, mtu − hdr); pps = bw / pkt; queues = cores · 2; irq = bytes / 4; mmio = pages · 4096; descBytes = entries · desc'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const div = (a: number, b: number) => (b > 0 ? Math.floor(a / b) : 0)
const ceilDiv = (a: number, b: number) => (b > 0 ? Math.floor((a + b - 1) / b) : 0)
const f = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'driver', dst: 'cross', formula, value, proof: PROOF, ...extra }, holds, { name: `driver.${name}`, params })

export class DriverFormulas {
  /** DMA ring entries of `desc` bytes each in a `bytes`-byte buffer: bytes / desc. */
  static ring(bytes: number, desc: number): CrossFormula { return f('driver-ring', 'ring(bytes, desc) = bytes / desc', div(bytes, desc), nat(bytes, desc) && desc > 0, 'ring', [bytes, desc]) }
  /** 4K DMA pages needed for `bytes`: ceil(bytes / 4096). */
  static dmaPages(bytes: number): CrossFormula { return f('driver-dmaPages', 'dmaPages(bytes) = ceil(bytes / 4096)', ceilDiv(bytes, 4096), nat(bytes), 'dmaPages', [bytes]) }
  /** The payload a frame of `mtu` carries past a `hdr`-byte header: max(0, mtu − hdr). */
  static payload(mtu: number, hdr: number): CrossFormula { return f('driver-payload', 'payload(mtu, hdr) = max(0, mtu − hdr)', Math.max(0, mtu - hdr), nat(mtu, hdr), 'payload', [mtu, hdr]) }
  /** Packets per second a `bw`-byte/s link passes at `pkt` bytes each: bw / pkt. */
  static pps(bw: number, pkt: number): CrossFormula { return f('driver-pps', 'pps(bw, pkt) = bw / pkt', div(bw, pkt), nat(bw, pkt) && pkt > 0, 'pps', [bw, pkt]) }
  /** tx+rx queues for `cores`: cores · 2. */
  static queues(cores: number): CrossFormula { return f('driver-queues', 'queues(cores) = cores · 2', cores * 2, nat(cores), 'queues', [cores]) }
  /** 32-bit IRQ vectors in `bytes`: bytes / 4. */
  static irq(bytes: number): CrossFormula { return f('driver-irq', 'irq(bytes) = bytes / 4', div(bytes, 4), nat(bytes), 'irq', [bytes]) }
  /** The bytes an MMIO window of `pages` 4K pages maps: pages · 4096. */
  static mmio(pages: number): CrossFormula { return f('driver-mmio', 'mmio(pages) = pages · 4096', pages * 4096, nat(pages), 'mmio', [pages]) }
  /** The descriptor bytes a ring of `entries` × `desc` holds: entries · desc. */
  static descBytes(entries: number, desc: number): CrossFormula { return f('driver-descBytes', 'descBytes(entries, desc) = entries · desc', entries * desc, nat(entries, desc), 'descBytes', [entries, desc]) }
}

for (const name of ['descBytes', 'dmaPages', 'irq', 'mmio', 'payload', 'pps', 'queues', 'ring'] as const)
  qpuHexRegisterOf('driver', name, (DriverFormulas[name] as (...x: unknown[]) => unknown).bind(DriverFormulas))
