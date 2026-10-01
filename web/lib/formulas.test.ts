import { test, type TestContext } from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateCommunicationCost,
  calculateCoherence,
  calculateConsensusStrength,
  calculateConvergence,
  calculateCumulativeImprovement,
  calculateDataDurability,
  calculateDivergence,
  calculateEmergentCapability,
  calculateEscapeProbability,
  calculateKnowledgeGrowth,
  calculateLatency,
  calculateMultiAgentSpeedup,
  calculateOverallScore,
  calculatePhaseCapability,
  calculatePhaseCascade,
  calculateSpeedup,
  calculateSynergy,
  calculateThroughput,
  calculateTrustScore,
  calculateWaveGain,
  generateConvergenceTrajectory,
  generateSynergyNetwork,
  generateWaveProgression,
} from './formulas'

const near = (actual: number, expected: number, tolerance = 1e-12) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)),
    `${actual} is not within ${tolerance} of ${expected}`,
  )
}

const feedRandom = (t: TestContext, values: number[]) => {
  let index = 0
  t.mock.method(Math, 'random', () => {
    assert.ok(index < values.length, `Math.random called more than ${values.length} times`)
    return values[index++]
  })
  return () => index
}

const windowPairs = (systems: number) => {
  const pairs: Array<[number, number]> = []
  for (let source = 1; source <= systems; source++) {
    for (let target = source + 1; target <= systems; target++) {
      if (target - source <= 4) pairs.push([source, target])
    }
  }
  return pairs
}

const ratio = Math.exp(-0.15)
const seriesLimit = (8 * ratio) / (1 - ratio)
const closedFormCumulative = (wave: number) => seriesLimit * (1 - ratio ** wave)

test('calculateSpeedup follows Amdahl: three quarters optimisable over four lanes is 16/7', () => {
  const optimizable = 3 / 4
  const lanes = 4
  const serialShare = 1 / 4
  const parallelShare = 3 / 16
  assert.equal(serialShare + parallelShare, 7 / 16)
  assert.equal(calculateSpeedup(optimizable, lanes), 16 / 7)
})

test('calculateSpeedup: nothing optimisable is 1, fully optimisable is the lane count, one lane is 1, infinite lanes is 1/(1-f)', () => {
  assert.equal(calculateSpeedup(0, 64), 1)
  assert.equal(calculateSpeedup(1, 4), 4)
  assert.equal(calculateSpeedup(1, 8), 8)
  near(calculateSpeedup(0.3, 1), 1)
  assert.equal(calculateSpeedup(0.75, Infinity), 4)
  near(calculateSpeedup(0.5, 2), 4 / 3)
})

test('calculateSynergy multiplies base, base, alignment and timing', () => {
  assert.equal(calculateSynergy(2, 3, 0.5, 4), 12)
  assert.equal(calculateSynergy(-1, 2, 1, 1), -2)
  near(calculateSynergy(0.6, 0.8, 0.9, 0.95), 0.4104)
  assert.equal(calculateSynergy(0.6, 0.8, 0.9, 0.95), calculateSynergy(0.8, 0.6, 0.9, 0.95))
  const factors = [0.9, 0.7, 0.8, 0.6]
  for (let zeroed = 0; zeroed < factors.length; zeroed++) {
    const args = factors.map((value, position) => (position === zeroed ? 0 : value)) as [number, number, number, number]
    assert.equal(Math.abs(calculateSynergy(...args)), 0)
  }
})

test('calculateWaveGain defaults to G0 = 8 and lambda = 0.15', () => {
  assert.equal(calculateWaveGain(undefined, undefined, 0), 8)
  near(calculateWaveGain(undefined, undefined, Math.LN2 / 0.15), 4)
  near(calculateWaveGain(undefined, undefined, Math.log(8) / 0.15), 1)
  near(calculateWaveGain(8, undefined, Math.LN2 / 0.15), 4)
  near(calculateWaveGain(undefined, Math.LN2, 2), 2)
})

test('calculateWaveGain with explicit gain and decay halves once per ln2/lambda', () => {
  near(calculateWaveGain(100, Math.LN2, 1), 50)
  near(calculateWaveGain(100, Math.LN2, 3), 12.5)
  assert.equal(calculateWaveGain(5, 0, 1000), 5)
  near(calculateWaveGain(1, -Math.LN2, 4), 16)
  assert.equal(calculateWaveGain(0, 0.15, 3), 0)
})

test('calculateCumulativeImprovement sums waves plus matching bonuses', () => {
  assert.equal(calculateCumulativeImprovement([1, 2, 3.5]), 6.5)
  assert.equal(calculateCumulativeImprovement([1, 2, 3], [0.5, 0.25, 0.125]), 6.875)
  assert.equal(calculateCumulativeImprovement([5], [-2]), 3)
})

test('calculateCumulativeImprovement treats missing or NaN bonuses as 0 and ignores surplus bonuses', () => {
  assert.equal(calculateCumulativeImprovement([1, 2, 3], [10]), 16)
  assert.equal(calculateCumulativeImprovement([1, 1], [NaN, 2]), 4)
  assert.equal(calculateCumulativeImprovement([1, 1], [0, 0]), 2)
  assert.equal(calculateCumulativeImprovement([4], [1, 100]), 5)
  assert.equal(calculateCumulativeImprovement([], [7, 8]), 0)
  assert.equal(calculateCumulativeImprovement([]), 0)
})

test('calculateOverallScore weights learning and robustness 0.25, efficiency and collaboration 0.2, trust 0.1', () => {
  const zero = { learning: 0, robustness: 0, efficiency: 0, collaboration: 0, trustworthiness: 0 }
  assert.equal(calculateOverallScore({ ...zero, learning: 1 }), 0.25)
  assert.equal(calculateOverallScore({ ...zero, robustness: 1 }), 0.25)
  assert.equal(calculateOverallScore({ ...zero, efficiency: 1 }), 0.2)
  assert.equal(calculateOverallScore({ ...zero, collaboration: 1 }), 0.2)
  assert.equal(calculateOverallScore({ ...zero, trustworthiness: 1 }), 0.1)
  assert.equal(calculateOverallScore(zero), 0)
  near(calculateOverallScore({ learning: 80, robustness: 80, efficiency: 80, collaboration: 80, trustworthiness: 80 }), 80)
  near(calculateOverallScore({ learning: 100, robustness: 80, efficiency: 60, collaboration: 40, trustworthiness: 20 }), 25 + 20 + 12 + 8 + 2)
})

test('calculateDivergence is the spread between the largest and smallest metric', () => {
  assert.equal(calculateDivergence([3, 9, 1, 7]), 8)
  assert.equal(calculateDivergence([-5, 5]), 10)
  assert.equal(calculateDivergence([42]), 0)
  assert.equal(calculateDivergence([6, 6, 6]), 0)
  near(calculateDivergence([0.72, 0.91, 0.65]), 0.26)
})

test('calculateConvergence defaults to target 100 and rate 0.15', () => {
  assert.equal(calculateConvergence(undefined, undefined, 0), 0)
  near(calculateConvergence(undefined, undefined, Math.LN2 / 0.15), 50)
  near(calculateConvergence(undefined, undefined, Math.log(4) / 0.15), 75)
  assert.equal(calculateConvergence(undefined, undefined, Infinity), 100)
  near(calculateConvergence(100, undefined, Math.LN2 / 0.15), 50)
  near(calculateConvergence(undefined, Math.LN2, 1), 50)
})

test('calculateConvergence with explicit target and rate', () => {
  near(calculateConvergence(200, Math.LN2, 2), 150)
  near(calculateConvergence(64, Math.LN2, 3), 56)
  assert.equal(calculateConvergence(200, 0, 50), 0)
  assert.equal(calculateConvergence(200, 1, Infinity), 200)
})

test('calculatePhaseCapability sums the phase contributions', () => {
  assert.equal(calculatePhaseCapability([10, 20.5, -3]), 27.5)
  assert.equal(calculatePhaseCapability([7]), 7)
  assert.equal(calculatePhaseCapability([]), 0)
})

test('calculateKnowledgeGrowth defaults to K0 = 100 and alpha = 0.12', () => {
  assert.equal(calculateKnowledgeGrowth(undefined, undefined, 0), 0)
  near(calculateKnowledgeGrowth(undefined, undefined, Math.LN2 / 0.12), 50)
  assert.equal(calculateKnowledgeGrowth(undefined, undefined, Infinity), 100)
  near(calculateKnowledgeGrowth(100, undefined, Math.log(4) / 0.12), 75)
  near(calculateKnowledgeGrowth(undefined, Math.LN2, 1), 50)
})

test('calculateKnowledgeGrowth with explicit ceiling and rate', () => {
  near(calculateKnowledgeGrowth(40, Math.LN2, 3), 35)
  assert.equal(calculateKnowledgeGrowth(40, 0, 9), 0)
})

test('calculateConsensusStrength is the agreeing share times the confidence', () => {
  near(calculateConsensusStrength(3, 4, 0.8), 0.6)
  assert.equal(calculateConsensusStrength(0, 5, 0.9), 0)
  assert.equal(calculateConsensusStrength(5, 5, 0.9), 0.9)
  assert.equal(calculateConsensusStrength(1, 4, 1), 0.25)
})

test('calculateMultiAgentSpeedup is 1 + (agents - 1) x efficiency', () => {
  assert.equal(calculateMultiAgentSpeedup(1, 0.3), 1)
  assert.equal(calculateMultiAgentSpeedup(5, 0.5), 3)
  assert.equal(calculateMultiAgentSpeedup(8, 1), 8)
  assert.equal(calculateMultiAgentSpeedup(8, 0), 1)
})

test('calculateCommunicationCost grows with the square of the agents over bandwidth', () => {
  assert.equal(calculateCommunicationCost(2, 3, 3), 6)
  assert.equal(calculateCommunicationCost(1, 10, 4), 25)
  assert.equal(calculateCommunicationCost(5, 0, 2), 0)
  near(calculateCommunicationCost(1.5, 6, 5) / calculateCommunicationCost(1.5, 3, 5), 4)
})

test('calculateCoherence is the mean alignment score', () => {
  assert.equal(calculateCoherence([1, 0.5, 0]), 0.5)
  assert.equal(calculateCoherence([0.8]), 0.8)
  assert.equal(calculateCoherence([0.25, 0.75, 0.5, 1]), 0.625)
})

test('calculateTrustScore weights transparency and consistency 0.3, explainability and value alignment 0.2', () => {
  assert.equal(calculateTrustScore(1, 0, 0, 0), 0.3)
  assert.equal(calculateTrustScore(0, 1, 0, 0), 0.3)
  assert.equal(calculateTrustScore(0, 0, 1, 0), 0.2)
  assert.equal(calculateTrustScore(0, 0, 0, 1), 0.2)
  near(calculateTrustScore(1, 1, 1, 1), 1)
  near(calculateTrustScore(90, 80, 70, 60), 27 + 24 + 14 + 12)
})

test('calculateThroughput scales a node linearly and removes the coordination overhead share', () => {
  assert.equal(calculateThroughput(100, 4, 0.25), 300)
  assert.equal(calculateThroughput(120, 5, 0), 600)
  assert.equal(calculateThroughput(120, 5, 1), 0)
})

test('calculateLatency adds hopCost per level of a binary fan-out, with 0.5 as the default hop cost', () => {
  const levels = (nodes: number) => {
    let hops = 0
    while (2 ** hops < nodes) hops++
    return hops
  }
  for (const nodes of [1, 2, 3, 4, 5, 7, 8, 9, 16, 17, 100, 1000, 1024, 1025, 2.5]) {
    assert.equal(calculateLatency(10, nodes), 10 + levels(nodes) * 0.5, `nodes = ${nodes}`)
  }
  assert.equal(calculateLatency(10, 8), 11.5)
  assert.equal(calculateLatency(10, 1024), 15)
  assert.equal(calculateLatency(10, 1025), 15.5)
  assert.equal(calculateLatency(3, 8, 2), 9)
  assert.equal(calculateLatency(3, 9, 2), 11)
})

test('calculateLatency clamps fewer than one node to a single node with no hops', () => {
  for (const nodes of [1, 0.5, 0, -3]) {
    assert.equal(calculateLatency(7, nodes), 7, `nodes = ${nodes}`)
    assert.equal(calculateLatency(7, nodes, 4), 7, `nodes = ${nodes}`)
  }
})

test('calculateDataDurability is 1 minus the chance every replica fails', () => {
  assert.equal(calculateDataDurability(0.5, 3), 0.875)
  near(calculateDataDurability(0.1, 2), 0.99)
  assert.equal(calculateDataDurability(0.3, 0), 0)
  assert.equal(calculateDataDurability(0, 3), 1)
  assert.equal(calculateDataDurability(1, 5), 0)
})

test('calculateEscapeProbability is 1 - e^(-budget/depth)', () => {
  assert.equal(calculateEscapeProbability(0, 5), 0)
  near(calculateEscapeProbability(5 * Math.LN2, 5), 0.5)
  near(calculateEscapeProbability(2 * Math.log(8), 2), 7 / 8)
  assert.equal(calculateEscapeProbability(Infinity, 3), 1)
})

test('calculateEmergentCapability adds system sums, synergy sums and discovery over time', () => {
  assert.equal(calculateEmergentCapability([1, 2, 3], [0.5, 0.5], 2, 10), 27)
  assert.equal(calculateEmergentCapability([], [], 1.5, 4), 6)
  assert.equal(calculateEmergentCapability([], [], 0, 100), 0)
  assert.equal(calculateEmergentCapability([10], [], 3, 0), 10)
})

test('calculatePhaseCascade compounds (1 + multiplier) per phase', () => {
  assert.equal(calculatePhaseCascade(1, 10), 1024)
  assert.equal(calculatePhaseCascade(0.5, 2), 2.25)
  assert.equal(calculatePhaseCascade(0.37, 0), 1)
  assert.equal(calculatePhaseCascade(0, 12), 1)
  assert.equal(calculatePhaseCascade(-1, 3), 0)
})

test('generateWaveProgression defaults to 20 waves following 8 e^(-0.15 n)', () => {
  const progression = generateWaveProgression()
  assert.equal(progression.length, 20)
  progression.forEach((entry, index) => {
    const wave = index + 1
    assert.equal(entry.wave, wave)
    near(entry.gain, 8 * ratio ** wave)
    near(entry.cumulative, closedFormCumulative(wave))
  })
  assert.deepEqual(generateWaveProgression(20), progression)
})

test('generateWaveProgression momentum divides by 1 on the first wave and by the previous gain afterwards', () => {
  const progression = generateWaveProgression(6)
  near(progression[0].momentum, 8 * ratio)
  assert.equal(progression[0].momentum, progression[0].gain)
  for (const entry of progression.slice(1)) near(entry.momentum, ratio - 1)
})

test('generateWaveProgression strategy follows the cumulative gain: Focused, then Opportunistic past 10, Exploratory past 30', () => {
  const progression = generateWaveProgression(20)
  const firstAbove = (threshold: number) => {
    let wave = 1
    while (closedFormCumulative(wave) <= threshold) wave++
    return wave
  }
  const opportunisticFrom = firstAbove(10)
  const exploratoryFrom = firstAbove(30)
  assert.equal(opportunisticFrom, 2)
  assert.equal(exploratoryFrom, 7)
  for (const entry of progression) {
    const expected: string = entry.wave >= exploratoryFrom ? 'Exploratory' : entry.wave >= opportunisticFrom ? 'Opportunistic' : 'Focused'
    assert.equal(entry.strategy, expected, `wave ${entry.wave}`)
  }
})

test('generateWaveProgression never reaches Broad with the real decay because the gains sum to under 50', () => {
  assert.ok(seriesLimit < 50)
  near(seriesLimit, 8 / (Math.exp(0.15) - 1))
  const long = generateWaveProgression(400)
  assert.equal(long.length, 400)
  assert.ok(long.every((entry) => entry.strategy !== 'Broad'))
  near(long[long.length - 1].cumulative, seriesLimit, 1e-9)
})

test('generateWaveProgression thresholds are strict: 10, 30 and 50 stay in the lower band, anything above moves up', (t) => {
  const exp = t.mock.method(Math, 'exp', () => 1.25)
  const progression = generateWaveProgression(7)
  assert.deepEqual(
    exp.mock.calls.map((call) => call.arguments[0]),
    [1, 2, 3, 4, 5, 6, 7].map((wave) => -0.15 * wave),
  )
  assert.deepEqual(
    progression.map((entry) => [entry.wave, entry.gain, entry.cumulative, entry.strategy]),
    [
      [1, 10, 10, 'Focused'],
      [2, 10, 20, 'Opportunistic'],
      [3, 10, 30, 'Opportunistic'],
      [4, 10, 40, 'Exploratory'],
      [5, 10, 50, 'Exploratory'],
      [6, 10, 60, 'Broad'],
      [7, 10, 70, 'Broad'],
    ],
  )
  assert.deepEqual(
    progression.map((entry) => entry.momentum),
    [10, 0, 0, 0, 0, 0, 0],
  )
})

test('generateWaveProgression with zero or one wave', () => {
  assert.deepEqual(generateWaveProgression(0), [])
  const [only, ...rest] = generateWaveProgression(1)
  assert.equal(rest.length, 0)
  assert.equal(only.wave, 1)
  near(only.gain, 8 * ratio)
  assert.equal(only.cumulative, only.gain)
  assert.equal(only.momentum, only.gain)
  assert.equal(only.strategy, 'Focused')
})

test('generateSynergyNetwork draws node strengths first, then alignment and timing per pair, and keeps synergies above 0.2', (t) => {
  const strengthDraws = [0.2, 0.6, 0, 0.8]
  const pairDraws: Array<[number, number, number, number]> = [
    [1, 2, 0, 0],
    [1, 3, 0, 0],
    [1, 4, 0.5, 0.5],
    [2, 3, 0.2, 0.1],
    [2, 4, 0.9, 0.9],
    [3, 4, 0, 0],
  ]
  const consumed = feedRandom(t, [...strengthDraws, ...pairDraws.flatMap(([, , a, b]) => [a, b])])
  const network = generateSynergyNetwork(4)
  assert.equal(consumed(), strengthDraws.length + pairDraws.length * 2)

  const strengths = [0.6, 0.8, 0.5, 0.9]
  assert.equal(network.nodes.length, 4)
  network.nodes.forEach((node, index) => {
    assert.equal(node.id, index + 1)
    assert.equal(node.label, `S${index + 1}`)
    near(node.strength, strengths[index])
  })

  const expected = pairDraws
    .map(([source, target, a, b]) => ({
      source,
      target,
      strength: strengths[source - 1] * strengths[target - 1] * (0.7 + 0.25 * a) * (0.8 + 0.2 * b),
    }))
    .filter((edge) => edge.strength > 0.2)
  assert.deepEqual(
    expected.map((edge) => [edge.source, edge.target]),
    [
      [1, 2],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 4],
    ],
  )
  assert.deepEqual(
    network.edges.map((edge) => [edge.source, edge.target]),
    expected.map((edge) => [edge.source, edge.target]),
  )
  network.edges.forEach((edge, index) => near(edge.strength, expected[index].strength))
  near(network.edges[0].strength, 0.2688)
  near(network.edges[1].strength, 0.40095)
})

test('generateSynergyNetwork leaves out a synergy of exactly 0.2', (t) => {
  const consumed = feedRandom(t, [0, 0, 1.2, 0])
  const network = generateSynergyNetwork(2)
  assert.equal(consumed(), 4)
  assert.equal(0.5 * 0.5 * (0.7 + 1.2 * 0.25) * (0.8 + 0 * 0.2), 0.2)
  assert.deepEqual(network.edges, [])
})

test('generateSynergyNetwork only pairs each system with the next four', (t) => {
  t.mock.method(Math, 'random', () => 0.5)
  const network = generateSynergyNetwork(10)
  const pairs = windowPairs(10)
  assert.equal(pairs.length, 9 + 8 + 7 + 6)
  assert.deepEqual(
    network.edges.map((edge) => [edge.source, edge.target]),
    pairs,
  )
  const synergy = 0.75 * 0.75 * 0.825 * 0.9
  assert.ok(synergy > 0.2)
  for (const edge of network.edges) near(edge.strength, synergy)
  for (const node of network.nodes) near(node.strength, 0.75)
})

test('generateSynergyNetwork defaults to 50 systems', (t) => {
  const consumed = feedRandom(t, Array.from({ length: 50 + 2 * windowPairs(50).length }, () => 0.5))
  const network = generateSynergyNetwork()
  assert.equal(windowPairs(50).length, 49 + 48 + 47 + 46)
  assert.equal(consumed(), 50 + 2 * 190)
  assert.equal(network.nodes.length, 50)
  assert.deepEqual(
    network.nodes.map((node) => [node.id, node.label]),
    Array.from({ length: 50 }, (_, index) => [index + 1, `S${index + 1}`]),
  )
  assert.equal(network.edges.length, 190)
})

test('generateSynergyNetwork with the lowest draws keeps no edge because 0.5 x 0.5 x 0.7 x 0.8 = 0.14', (t) => {
  t.mock.method(Math, 'random', () => 0)
  const network = generateSynergyNetwork()
  assert.equal(network.nodes.length, 50)
  for (const node of network.nodes) assert.equal(node.strength, 0.5)
  near(0.5 * 0.5 * 0.7 * 0.8, 0.14)
  assert.deepEqual(network.edges, [])
})

test('generateSynergyNetwork with zero or one system draws only node strengths', (t) => {
  const consumed = feedRandom(t, [0.4])
  assert.deepEqual(generateSynergyNetwork(0), { nodes: [], edges: [] })
  assert.equal(consumed(), 0)
  const single = generateSynergyNetwork(1)
  assert.equal(consumed(), 1)
  assert.equal(single.nodes.length, 1)
  assert.equal(single.nodes[0].id, 1)
  assert.equal(single.nodes[0].label, 'S1')
  near(single.nodes[0].strength, 0.7)
  assert.deepEqual(single.edges, [])
})

test('generateSynergyNetwork with real randomness stays inside the formula bounds', () => {
  for (let run = 0; run < 5; run++) {
    const { nodes, edges } = generateSynergyNetwork(30)
    assert.equal(nodes.length, 30)
    for (const node of nodes) assert.ok(node.strength >= 0.5 && node.strength < 1, `strength ${node.strength}`)
    const allowed = new Set(windowPairs(30).map(([source, target]) => `${source}-${target}`))
    const seen = new Set<string>()
    for (const edge of edges) {
      const key = `${edge.source}-${edge.target}`
      assert.ok(allowed.has(key), key)
      assert.ok(!seen.has(key), `duplicate ${key}`)
      seen.add(key)
      const product = nodes[edge.source - 1].strength * nodes[edge.target - 1].strength
      assert.ok(edge.strength > 0.2)
      assert.ok(edge.strength >= product * 0.7 * 0.8 - 1e-12)
      assert.ok(edge.strength <= product * 0.95 + 1e-12)
    }
  }
})

test('generateConvergenceTrajectory defaults to 100 iterations of 100 (1 - e^(-0.15 i)) against a flat 100', () => {
  const trajectory = generateConvergenceTrajectory()
  assert.equal(trajectory.length, 100)
  trajectory.forEach((point, index) => {
    assert.equal(point.iteration, index)
    assert.equal(point.theoretical, 100)
    near(point.convergence, 100 * (1 - ratio ** index))
  })
  assert.equal(trajectory[0].convergence, 0)
  for (let index = 1; index < trajectory.length; index++) {
    assert.ok(trajectory[index].convergence > trajectory[index - 1].convergence)
    assert.ok(trajectory[index].convergence < 100)
  }
  const halfway = Math.ceil(Math.LN2 / 0.15)
  assert.ok(trajectory[halfway - 1].convergence < 50)
  assert.ok(trajectory[halfway].convergence >= 50)
})

test('generateConvergenceTrajectory with a custom or zero length', () => {
  const short = generateConvergenceTrajectory(3)
  assert.deepEqual(
    short.map((point) => [point.iteration, point.theoretical]),
    [
      [0, 100],
      [1, 100],
      [2, 100],
    ],
  )
  near(short[1].convergence, 100 - 100 * ratio)
  near(short[2].convergence, 100 - 100 * ratio * ratio)
  assert.deepEqual(generateConvergenceTrajectory(0), [])
})
