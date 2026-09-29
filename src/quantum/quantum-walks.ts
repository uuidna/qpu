// Quantum walks - Random walks accelerated by quantum mechanics
export interface Graph {
  vertices: number
  edges: Array<[number, number]>
  weights?: Map<string, number>
}

export interface WalkState {
  position: number
  amplitude: number
  phase: number
}

export class QuantumWalk {
  private graph: Graph
  private states: WalkState[] = []
  private stepCount = 0

  constructor(graph: Graph) {
    this.graph = graph
    this.initializeState(0)
  }

  private initializeState(startVertex: number): void {
    this.states = []
    for (let i = 0; i < this.graph.vertices; i++) {
      this.states.push({
        position: i,
        amplitude: i === startVertex ? 1 : 0,
        phase: 0,
      })
    }
  }

  step(): void {
    const newStates: WalkState[] = new Array(this.graph.vertices).fill(null)

    for (let i = 0; i < this.graph.vertices; i++) {
      newStates[i] = { position: i, amplitude: 0, phase: this.states[i].phase }
    }

    for (let i = 0; i < this.graph.vertices; i++) {
      const neighbors = this.graph.edges
        .filter(e => e[0] === i || e[1] === i)
        .map(e => (e[0] === i ? e[1] : e[0]))

      const degree = neighbors.length || 1
      const amplitude = this.states[i].amplitude / Math.sqrt(degree)

      for (const neighbor of neighbors) {
        newStates[neighbor].amplitude += amplitude
        newStates[neighbor].phase += Math.PI / degree
      }
    }

    this.states = newStates
    this.stepCount++
  }

  getAmplitudes(): number[] {
    return this.states.map(s => Math.abs(s.amplitude))
  }

  getProbabilities(): number[] {
    const amplitudes = this.getAmplitudes()
    const total = amplitudes.reduce((a, b) => a + b * b, 0)
    return amplitudes.map(a => (a * a) / total)
  }

  searchTarget(targetVertex: number, steps: number = 10): number {
    for (let i = 0; i < steps; i++) {
      this.step()
    }

    const probs = this.getProbabilities()
    return probs[targetVertex]
  }

  getStats() {
    const probs = this.getProbabilities()
    return {
      stepCount: this.stepCount,
      vertices: this.graph.vertices,
      edges: this.graph.edges.length,
      averageProbability: probs.reduce((a, b) => a + b, 0) / probs.length,
      maxProbability: Math.max(...probs),
      minProbability: Math.min(...probs),
      standardDeviation: this.calculateStdDev(probs),
    }
  }

  private calculateStdDev(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    return Math.sqrt(variance)
  }

  reset(): void {
    this.stepCount = 0
    this.initializeState(0)
  }
}

export const walk = new QuantumWalk({
  vertices: 16,
  edges: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [0, 5],
  ],
})
