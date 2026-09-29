
// Batch request processor for throughput
export class BatchProcessor {
  private queue: any[] = []
  private batchSize = 10
  private timeout = 100

  async add(request: any) {
    this.queue.push(request)
    if (this.queue.length >= this.batchSize) {
      return this.process()
    }
  }

  async process() {
    const batch = this.queue.splice(0, this.batchSize)
    return Promise.all(batch.map(r => r.execute()))
  }

  getQueueSize() {
    return this.queue.length
  }

  getStats() {
    return {
      queued: this.queue.length,
      maxBatchSize: this.batchSize,
    }
  }
}

export const processor = new BatchProcessor()
