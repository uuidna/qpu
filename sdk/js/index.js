/** JavaScript/Node.js SDK - Uses QPU payload */

class QPU {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:3000'
    this.timeout = options.timeout || 30000
  }

  async shorFactor(n) {
    return this._call('qpu_shor', { n })
  }

  async groverSearch(target, searchSpace) {
    return this._call('qpu_grover_search', { target, search_space: searchSpace })
  }

  async discreteLog(base, target, prime) {
    return this._call('qpu_discrete_log', { base, target, prime })
  }

  async knapsack(items, capacity) {
    return this._call('qpu_knapsack', { items, capacity })
  }

  async hamiltonianSimulation(coupling, time) {
    return this._call('qpu_hamiltonian_sim', { coupling, time })
  }

  async graphColoring(vertices) {
    return this._call('qpu_graph_coloring', { vertices })
  }

  async tsp(cities) {
    return this._call('qpu_tsp', { cities })
  }

  async runPhase(phase) {
    return this._call(`qpu_${phase}`, {})
  }

  async benchmark() {
    return this._call('qpu_benchmark', {})
  }

  async phase1() {
    return this._call('qpu_phase1', {})
  }

  async phase2() {
    return this._call('qpu_phase2', {})
  }

  async phase3() {
    return this._call('qpu_phase3', {})
  }

  async unified() {
    return this._call('qpu_unified', {})
  }

  async _call(tool, params) {
    const url = `${this.baseUrl}/api/execute/${this._toolToPath(tool)}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      timeout: this.timeout,
    })

    if (!response.ok) {
      throw new Error(`QPU call failed: ${response.statusText}`)
    }

    return response.json()
  }

  _toolToPath(tool) {
    // Map tool names to API paths
    const toolMap = {
      qpu_shor: 'cryptography/shor',
      qpu_grover_search: 'search/grover',
      qpu_discrete_log: 'cryptography/discrete-log',
      qpu_knapsack: 'optimization/knapsack',
      qpu_hamiltonian_sim: 'simulation/hamiltonian',
      qpu_graph_coloring: 'optimization/graph-coloring',
      qpu_tsp: 'optimization/tsp',
      qpu_phase1: 'testing/phase1',
      qpu_phase2: 'testing/phase2',
      qpu_phase3: 'testing/phase3',
      qpu_unified: 'testing/unified',
      qpu_benchmark: 'testing/benchmark',
    }
    return toolMap[tool] || tool
  }
}

module.exports = QPU
