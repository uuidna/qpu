// RAID Layer for Distributed Database Redundancy (WAVE 6)
// Implements RAID 0 (striping), RAID 1 (mirroring), RAID 5 (striping+parity), RAID 10 (mirrored pairs)

import type { RAIDLevel, DatabaseProvider, WriteOperation } from '../types.js'

export interface RAIDChunk {
  chunkId: string
  dataIndex: number
  data: Buffer
  provider: DatabaseProvider
  hash: string
  timestamp: number
}

export interface RAIDParity {
  parityIndex: number
  data: Buffer
  hash: string
  sourceChunks: string[]
  timestamp: number
}

export class RAIDLayer {
  private raidLevel: RAIDLevel = 1  // Default: RAID 1 (mirroring)
  private chunkSize: number = 1024 * 1024  // 1MB chunks
  private providers: DatabaseProvider[] = []
  private chunks: Map<string, RAIDChunk[]> = new Map()
  private parities: Map<string, RAIDParity[]> = new Map()

  constructor(level: RAIDLevel = 1, providers: DatabaseProvider[] = []) {
    this.raidLevel = level
    this.providers = providers
  }

  // RAID 0: Striping (performance) - data split across providers
  async stripeData(dataId: string, data: Buffer): Promise<RAIDChunk[]> {
    const chunks: RAIDChunk[] = []
    const numProviders = this.providers.length

    let offset = 0
    for (let i = 0; i < numProviders; i++) {
      const chunkData = data.slice(offset, offset + this.chunkSize)
      if (chunkData.length === 0) break

      const chunk: RAIDChunk = {
        chunkId: `${dataId}:stripe:${i}`,
        dataIndex: i,
        data: chunkData,
        provider: this.providers[i],
        hash: this.hashBuffer(chunkData),
        timestamp: Date.now()
      }

      chunks.push(chunk)
      offset += this.chunkSize
    }

    this.chunks.set(dataId, chunks)
    return chunks
  }

  // RAID 1: Mirroring (redundancy) - full copy on each provider
  async mirrorData(dataId: string, data: Buffer): Promise<RAIDChunk[]> {
    const chunks: RAIDChunk[] = []

    for (let i = 0; i < this.providers.length; i++) {
      const chunk: RAIDChunk = {
        chunkId: `${dataId}:mirror:${i}`,
        dataIndex: i,
        data: Buffer.from(data),  // Full copy
        provider: this.providers[i],
        hash: this.hashBuffer(data),
        timestamp: Date.now()
      }

      chunks.push(chunk)
    }

    this.chunks.set(dataId, chunks)
    return chunks
  }

  // RAID 5: Striping + Parity (balanced) - data + calculated parity
  async striped5Data(dataId: string, data: Buffer): Promise<{ chunks: RAIDChunk[]; parity: RAIDParity }> {
    const chunks: RAIDChunk[] = []
    const numDataProviders = this.providers.length - 1  // Last provider for parity
    const parityData = Buffer.alloc(this.chunkSize)

    let offset = 0
    for (let i = 0; i < numDataProviders; i++) {
      const chunkData = data.slice(offset, offset + this.chunkSize)
      if (chunkData.length === 0) break

      const chunk: RAIDChunk = {
        chunkId: `${dataId}:raid5:${i}`,
        dataIndex: i,
        data: chunkData,
        provider: this.providers[i],
        hash: this.hashBuffer(chunkData),
        timestamp: Date.now()
      }

      chunks.push(chunk)

      // XOR for parity calculation
      for (let j = 0; j < chunkData.length; j++) {
        parityData[j] ^= chunkData[j]
      }

      offset += this.chunkSize
    }

    const parity: RAIDParity = {
      parityIndex: numDataProviders,
      data: parityData,
      hash: this.hashBuffer(parityData),
      sourceChunks: chunks.map(c => c.chunkId),
      timestamp: Date.now()
    }

    this.chunks.set(dataId, chunks)
    this.parities.set(dataId, [parity])

    return { chunks, parity }
  }

  // RAID 10: Mirrored pairs striped (resilient) - mirror first, then stripe
  async striped10Data(dataId: string, data: Buffer): Promise<RAIDChunk[][]> {
    const pairCount = Math.ceil(this.providers.length / 2)
    const allChunks: RAIDChunk[][] = []

    let offset = 0
    for (let pairIdx = 0; pairIdx < pairCount; pairIdx++) {
      const pair: RAIDChunk[] = []
      const chunkData = data.slice(offset, offset + this.chunkSize)

      if (chunkData.length === 0) break

      // Create mirrored pair
      for (let mirrorIdx = 0; mirrorIdx < 2; mirrorIdx++) {
        const providerIdx = pairIdx * 2 + mirrorIdx
        if (providerIdx >= this.providers.length) break

        const chunk: RAIDChunk = {
          chunkId: `${dataId}:raid10:${pairIdx}:${mirrorIdx}`,
          dataIndex: pairIdx,
          data: Buffer.from(chunkData),
          provider: this.providers[providerIdx],
          hash: this.hashBuffer(chunkData),
          timestamp: Date.now()
        }

        pair.push(chunk)
      }

      allChunks.push(pair)
      offset += this.chunkSize
    }

    this.chunks.set(dataId, allChunks.flat())
    return allChunks
  }

  // Reconstruct data from RAID 0 (striping)
  async reconstructStripe(dataId: string, chunks: RAIDChunk[]): Promise<Buffer> {
    const sortedChunks = chunks.sort((a, b) => a.dataIndex - b.dataIndex)
    return Buffer.concat(sortedChunks.map(c => c.data))
  }

  // Reconstruct data from RAID 1 (mirroring) - just use first copy
  async reconstructMirror(dataId: string, chunks: RAIDChunk[]): Promise<Buffer> {
    if (chunks.length === 0) throw new Error(`No chunks for RAID 1: ${dataId}`)
    return Buffer.from(chunks[0].data)
  }

  // Reconstruct data from RAID 5 (with parity recovery)
  async reconstruct5(dataId: string, chunks: RAIDChunk[], parities: RAIDParity[]): Promise<Buffer> {
    const sortedChunks = chunks.sort((a, b) => a.dataIndex - b.dataIndex)

    // If all chunks present, just concatenate
    if (sortedChunks.length === chunks.length) {
      return Buffer.concat(sortedChunks.map(c => c.data))
    }

    // If one chunk missing, recover from parity
    if (sortedChunks.length === chunks.length - 1 && parities.length > 0) {
      const parity = parities[0]
      let missingIndex = 0

      // Find missing index
      for (let i = 0; i < chunks.length; i++) {
        if (!sortedChunks.find(c => c.dataIndex === i)) {
          missingIndex = i
          break
        }
      }

      // Recover using XOR
      const recovered = Buffer.from(parity.data)
      for (const chunk of sortedChunks) {
        for (let j = 0; j < recovered.length; j++) {
          recovered[j] ^= chunk.data[j]
        }
      }

      sortedChunks.splice(missingIndex, 0, {
        chunkId: `${dataId}:recovered:${missingIndex}`,
        dataIndex: missingIndex,
        data: recovered,
        provider: 'recovered' as any,
        hash: this.hashBuffer(recovered),
        timestamp: Date.now()
      })

      return Buffer.concat(sortedChunks.map(c => c.data))
    }

    throw new Error(`Cannot reconstruct RAID 5: too many missing chunks`)
  }

  // Reconstruct from RAID 10 (mirrored pairs)
  async reconstruct10(dataId: string, chunks: RAIDChunk[][]): Promise<Buffer> {
    const result: Buffer[] = []

    for (const pair of chunks) {
      if (pair.length > 0) {
        result.push(pair[0].data)
      } else {
        throw new Error(`Lost entire mirrored pair for RAID 10`)
      }
    }

    return Buffer.concat(result)
  }

  // Verify integrity of striped data
  async verifyIntegrity(dataId: string, chunks: RAIDChunk[], parity?: RAIDParity): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = []

    for (const chunk of chunks) {
      const hash = this.hashBuffer(chunk.data)
      if (hash !== chunk.hash) {
        errors.push(`Chunk ${chunk.chunkId} hash mismatch`)
      }
    }

    if (parity) {
      const hash = this.hashBuffer(parity.data)
      if (hash !== parity.hash) {
        errors.push(`Parity hash mismatch`)
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Distribute chunks across providers
  async distributeChunks(chunks: RAIDChunk[]): Promise<Map<DatabaseProvider, RAIDChunk[]>> {
    const distribution = new Map<DatabaseProvider, RAIDChunk[]>()

    for (const chunk of chunks) {
      if (!distribution.has(chunk.provider)) {
        distribution.set(chunk.provider, [])
      }
      distribution.get(chunk.provider)!.push(chunk)
    }

    return distribution
  }

  // Rebuild missing data using parity
  async rebuildMissingChunk(dataId: string, missingIndex: number, chunks: RAIDChunk[], parity: RAIDParity): Promise<RAIDChunk> {
    const recovered = Buffer.from(parity.data)

    for (const chunk of chunks) {
      if (chunk.dataIndex !== missingIndex) {
        for (let i = 0; i < recovered.length; i++) {
          recovered[i] ^= chunk.data[i]
        }
      }
    }

    return {
      chunkId: `${dataId}:rebuilt:${missingIndex}`,
      dataIndex: missingIndex,
      data: recovered,
      provider: parity.sourceChunks[missingIndex] as any,
      hash: this.hashBuffer(recovered),
      timestamp: Date.now()
    }
  }

  // Statistics and monitoring
  getRAIDStats(): {
    level: RAIDLevel
    totalChunks: number
    totalData: number
    parityData: number
    redundancyFactor: number
    recoveryCapability: string
  } {
    let totalChunks = 0
    let totalData = 0
    let parityData = 0

    for (const chunks of this.chunks.values()) {
      totalChunks += chunks.length
      totalData += chunks.reduce((sum, c) => sum + c.data.length, 0)
    }

    for (const parities of this.parities.values()) {
      parityData += parities.reduce((sum, p) => sum + p.data.length, 0)
    }

    let redundancyFactor = 1
    let recoveryCapability = 'No recovery'

    switch (this.raidLevel) {
      case 0:
        redundancyFactor = 1
        recoveryCapability = 'No recovery - single provider failure fatal'
        break
      case 1:
        redundancyFactor = 2
        recoveryCapability = 'Full recovery on any provider failure'
        break
      case 5:
        redundancyFactor = this.providers.length / (this.providers.length - 1)
        recoveryCapability = 'Recovery from single provider failure'
        break
      case 10:
        redundancyFactor = 2
        recoveryCapability = 'Recovery from any pair failure'
        break
    }

    return {
      level: this.raidLevel,
      totalChunks,
      totalData,
      parityData,
      redundancyFactor,
      recoveryCapability
    }
  }

  private hashBuffer(buffer: Buffer): string {
    // Simple hash for demo - use crypto.subtle in production
    let hash = 0
    for (let i = 0; i < buffer.length; i++) {
      hash = ((hash << 5) - hash) + buffer[i]
      hash = hash & hash
    }
    return hash.toString(36)
  }
}
