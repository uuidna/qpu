
// Intelligent computation cache
export class ComputationCache {
  private cache = new Map<string, any>()
  private stats = { hits: 0, misses: 0 }

  get(key: string) {
    if (this.cache.has(key)) {
      this.stats.hits++
      return this.cache.get(key)
    }
    this.stats.misses++
    return null
  }

  set(key: string, value: any) {
    this.cache.set(key, value)
  }

  getHitRate() {
    const total = this.stats.hits + this.stats.misses
    return total > 0 ? (this.stats.hits / total * 100).toFixed(1) : 0
  }

  clear() {
    this.cache.clear()
    this.stats = { hits: 0, misses: 0 }
  }
}

export const cache = new ComputationCache()
