import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { Window } from 'happy-dom'
import CombinatorialGraphVisualizer from './CombinatorialGraphVisualizer'

const SYSTEMS = 30
const WINDOW = 5
const THRESHOLD = 0.2
const SIZE = 600
const CENTER = SIZE / 2
const RADIUS = SIZE / 2.5
const TICK_MS = 50
const TURN = 360
const SEED = 1
const EPSILON = 1e-9

type NodeData = { id: number; label: string; strength: number }
type EdgeData = { source: number; target: number; strength: number }
type Network = { nodes: NodeData[]; edges: EdgeData[] }

const lcg = (seed: number) => {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

const expectedNetwork = (draw: () => number) => {
  const nodes: NodeData[] = []
  for (let k = 1; k <= SYSTEMS; k++) nodes.push({ id: k, label: 'S' + k, strength: 0.5 + 0.5 * draw() })
  const edges: EdgeData[] = []
  let pairs = 0
  let dropped = 0
  for (let a = 0; a < SYSTEMS; a++) {
    for (let b = a + 1; b < SYSTEMS && b - a < WINDOW; b++) {
      pairs++
      const align = 0.7 + 0.25 * draw()
      const time = 0.8 + 0.2 * draw()
      const synergy = nodes[a].strength * nodes[b].strength * align * time
      if (synergy > THRESHOLD) edges.push({ source: nodes[a].id, target: nodes[b].id, strength: synergy })
      else dropped++
    }
  }
  return { nodes, edges, pairs, dropped }
}

const EXPECTED = expectedNetwork(lcg(SEED))

const pointOn = (index: number, count: number) => {
  const turns = index / count
  return { x: CENTER + RADIUS * Math.cos(2 * Math.PI * turns), y: CENTER + RADIUS * Math.sin(2 * Math.PI * turns) }
}

const close = (actual: number, expected: number, what: string) =>
  assert.ok(Math.abs(actual - expected) < EPSILON, `${what}: ${actual} vs ${expected}`)

const num = (el: Element, name: string) => Number(el.getAttribute(name))

type Mounted = Awaited<ReturnType<typeof mount>>

const mount = async (random: () => number = lcg(SEED)) => {
  const window = new Window({ url: 'http://localhost/' })
  Object.assign(globalThis, { window, document: window.document, IS_REACT_ACT_ENVIRONMENT: true })
  await act(async () => {})
  mock.timers.enable({ apis: ['setInterval'] })
  const intervals = mock.method(globalThis, 'setInterval')
  const clears = mock.method(globalThis, 'clearInterval')
  const draws = mock.method(Math, 'random', random)
  const container = window.document.createElement('div') as unknown as HTMLElement
  window.document.body.appendChild(container as never)
  const root = createRoot(container)
  await act(async () => root.render(<CombinatorialGraphVisualizer />))
  const randomCalls = draws.mock.callCount()
  draws.mock.restore()
  const q = (selector: string) => Array.from(container.querySelectorAll(selector))
  const click = async (el: Element) => {
    await act(async () => {
      el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }) as unknown as Event)
    })
  }
  const hooks = () => {
    const key = Object.keys(container).find((name) => name.startsWith('__reactContainer$'))
    assert.ok(key)
    const component = (container as unknown as Record<string, any>)[key].stateNode.current.child
    assert.equal(component.type, CombinatorialGraphVisualizer)
    const list: any[] = []
    for (let hook = component.memoizedState; hook; hook = hook.next) list.push(hook)
    return list
  }
  let closed = false
  const unmount = async () => {
    if (closed) return
    closed = true
    await act(async () => root.unmount())
  }
  const cleanup = async () => {
    await unmount()
    clears.mock.restore()
    intervals.mock.restore()
    mock.timers.reset()
    await window.happyDOM.close()
  }
  return { window, container, root, intervals, clears, randomCalls, q, click, hooks, unmount, cleanup }
}

const withMounted = async (body: (m: Mounted) => Promise<void>, random?: () => number) => {
  const m = await mount(random)
  try {
    await body(m)
  } finally {
    await m.cleanup()
  }
}

const nodeCircles = (m: Mounted) => m.q('circle.graph-node')
const textOf = (el: Element | undefined) => (el ? el.textContent : null)
const statValue = (m: Mounted, label: string) => {
  const row = m.q('div.flex.justify-between').find((div) => textOf(div.querySelector('span') ?? undefined) === label)
  assert.ok(row, `stat row ${label}`)
  return textOf(row.querySelectorAll('span')[1])
}
const selectedPanel = (m: Mounted) => m.container.querySelector('div.float-card')
const synergyRows = (m: Mounted) =>
  m.q('div.max-h-32 > div').map((row) => {
    const spans = row.querySelectorAll('span')
    return [textOf(spans[0]), textOf(spans[1])]
  })
const expectedRows = (edges: EdgeData[], id: number) =>
  edges
    .filter((edge) => edge.source === id || edge.target === id)
    .map((edge) => [edge.source === id ? '→ S' + edge.target : '← S' + edge.source, Math.round(edge.strength * 100) + '%'])

test('the seeded fixture reaches both sides of the synergy threshold and of the 0.5 stroke floor', () => {
  assert.equal(EXPECTED.pairs, 4 * (SYSTEMS - WINDOW + 1) + 3 + 2 + 1)
  assert.ok(EXPECTED.dropped > 0)
  assert.equal(EXPECTED.edges.length + EXPECTED.dropped, EXPECTED.pairs)
  assert.ok(EXPECTED.edges.some((edge) => edge.strength * 2 < 0.5))
  assert.ok(EXPECTED.edges.some((edge) => edge.strength * 2 > 0.5))
})

test('server render emits only the Loading placeholder: no network is generated and no interval is started', () => {
  const draws = mock.method(Math, 'random')
  const intervals = mock.method(globalThis, 'setInterval')
  try {
    assert.equal(renderToStaticMarkup(<CombinatorialGraphVisualizer />), '<div>Loading...</div>')
    assert.equal(renderToString(<CombinatorialGraphVisualizer />), '<div>Loading...</div>')
    assert.equal(draws.mock.callCount(), 0)
    assert.equal(intervals.mock.callCount(), 0)
  } finally {
    intervals.mock.restore()
    draws.mock.restore()
  }
})

test('mounting generates one network of 30 systems, drawing one strength per system and two factors per candidate pair', async () => {
  await withMounted(async (m) => {
    assert.equal(m.randomCalls, SYSTEMS + 2 * EXPECTED.pairs)
    assert.equal(m.container.textContent?.includes('Loading...'), false)
    const svg = m.container.querySelector('svg')
    assert.ok(svg)
    assert.equal(svg.getAttribute('width'), String(SIZE))
    assert.equal(svg.getAttribute('height'), String(SIZE))
    const gradient = svg.querySelector('linearGradient#gradient')
    assert.ok(gradient)
    assert.deepEqual(
      Array.from(gradient.querySelectorAll('stop')).map((stop) => [stop.getAttribute('offset'), stop.getAttribute('stop-color')]),
      [
        ['0%', 'rgba(124, 58, 237, 0.8)'],
        ['100%', 'rgba(59, 130, 246, 0.8)'],
      ],
    )
    assert.equal(textOf(m.container.querySelector('h2') ?? undefined)?.trim(), 'Combinatorial System Network')
  })
})

test('every system is a circle evenly spaced on a radius-240 ring around the centre, sized and shaded by its strength', async () => {
  await withMounted(async (m) => {
    const circles = nodeCircles(m)
    assert.equal(circles.length, SYSTEMS)
    const groups = m.q('svg > g')
    assert.equal(groups.length, SYSTEMS)
    EXPECTED.nodes.forEach((node, index) => {
      const at = pointOn(index, SYSTEMS)
      const circle = circles[index]
      close(num(circle, 'cx'), at.x, `cx ${node.label}`)
      close(num(circle, 'cy'), at.y, `cy ${node.label}`)
      close(num(circle, 'r'), 25 + 15 * node.strength, `r ${node.label}`)
      const fill = /^rgba\(124, 58, 237, (.+)\)$/.exec(circle.getAttribute('fill') ?? '')
      assert.ok(fill)
      close(Number(fill[1]), 0.3 + 0.4 * node.strength, `fill ${node.label}`)
      assert.equal(circle.getAttribute('stroke'), 'rgba(124, 58, 237, 0.6)')
      assert.equal(circle.getAttribute('stroke-width'), '2')
      assert.equal(circle.getAttribute('class'), 'graph-node ')
      const style = (circle as unknown as { style: CSSStyleDeclaration }).style
      assert.equal(style.cursor, 'pointer')
      const glow = /^drop-shadow\(0 0 (.+)px rgba\(124, 58, 237, 0\.6\)\)$/.exec(style.filter)
      assert.ok(glow, style.filter)
      close(Number(glow[1]), 10 + 10 * node.strength, `glow ${node.label}`)
      const [label, value] = Array.from(groups[index].querySelectorAll('text'))
      assert.equal(label.textContent, node.label)
      close(num(label, 'x'), at.x, `label x ${node.label}`)
      close(num(label, 'y'), at.y, `label y ${node.label}`)
      assert.equal(label.getAttribute('text-anchor'), 'middle')
      assert.equal(label.getAttribute('dy'), '.3em')
      assert.equal(label.getAttribute('pointer-events'), 'none')
      assert.equal(value.textContent, (Math.round(node.strength * 100) / 100).toFixed(2))
      close(num(value, 'y'), at.y + 20, `value y ${node.label}`)
      assert.equal(value.getAttribute('pointer-events'), 'none')
    })
    assert.equal(m.q('circle.pulse-ring').length, 0)
    assert.equal(selectedPanel(m), null)
  })
})

test('every synergy above 0.2 is a chord between its two systems, with a 0.5 stroke floor and strength-scaled opacity', async () => {
  await withMounted(async (m) => {
    const lines = m.q('svg > line')
    assert.equal(lines.length, EXPECTED.edges.length)
    let floored = 0
    EXPECTED.edges.forEach((edge, index) => {
      const line = lines[index]
      const from = pointOn(edge.source - 1, SYSTEMS)
      const to = pointOn(edge.target - 1, SYSTEMS)
      close(num(line, 'x1'), from.x, `x1 ${index}`)
      close(num(line, 'y1'), from.y, `y1 ${index}`)
      close(num(line, 'x2'), to.x, `x2 ${index}`)
      close(num(line, 'y2'), to.y, `y2 ${index}`)
      const width = 2 * edge.strength < 0.5 ? 0.5 : 2 * edge.strength
      if (width === 0.5) floored++
      close(num(line, 'stroke-width'), width, `stroke-width ${index}`)
      close(num(line, 'opacity'), 0.3 + 0.4 * edge.strength, `opacity ${index}`)
      assert.equal(line.getAttribute('stroke'), 'url(#gradient)')
      assert.equal(line.getAttribute('class'), 'connection-line')
    })
    assert.ok(floored > 0)
    assert.ok(floored < EXPECTED.edges.length)
  })
})

test('the stats panel counts systems, synergies, possible pairs n(n-1)/2 and coverage to one decimal', async () => {
  await withMounted(async (m) => {
    let possible = 0
    for (let a = 0; a < SYSTEMS; a++) for (let b = a + 1; b < SYSTEMS; b++) possible++
    assert.equal(statValue(m, 'Total Systems:'), String(SYSTEMS))
    assert.equal(statValue(m, 'Synergies Found:'), String(EXPECTED.edges.length))
    assert.equal(statValue(m, 'Possible Pairs:'), String(possible))
    assert.equal(statValue(m, 'Coverage:'), (Math.round((1000 * EXPECTED.edges.length) / possible) / 10).toFixed(1) + '%')
    const formula = m.container.querySelector('div.code-highlight')
    assert.ok(formula)
    assert.equal(textOf(formula.querySelector('div.font-mono') ?? undefined)?.trim(), 'Synergy(A,B) = Base(A) × Base(B) × Align × Time')
  })
})

test('clicking a system selects it: pulse rings, highlighted stroke, strength bar and its incoming and outgoing synergies', async () => {
  await withMounted(async (m) => {
    const index = 9
    const node = EXPECTED.nodes[index]
    await m.click(nodeCircles(m)[index])
    const circle = nodeCircles(m)[index]
    assert.equal(circle.getAttribute('class'), 'graph-node active')
    assert.equal(circle.getAttribute('stroke'), 'rgba(59, 130, 246, 1)')
    assert.equal(circle.getAttribute('stroke-width'), '3')
    nodeCircles(m).forEach((other, k) => {
      if (k !== index) assert.equal(other.getAttribute('class'), 'graph-node ')
    })
    const rings = m.q('circle.pulse-ring')
    assert.equal(rings.length, 2)
    const at = pointOn(index, SYSTEMS)
    rings.forEach((ring) => {
      close(num(ring, 'cx'), at.x, 'ring cx')
      close(num(ring, 'cy'), at.y, 'ring cy')
      close(num(ring, 'r'), 25 + 15 * node.strength, 'ring r')
      assert.equal(ring.getAttribute('fill'), 'none')
      assert.equal(ring.getAttribute('stroke-width'), '2')
    })
    assert.equal(rings[0].getAttribute('stroke'), 'rgba(124, 58, 237, 0.5)')
    assert.equal(rings[1].getAttribute('stroke'), 'rgba(59, 130, 246, 0.5)')
    assert.equal((rings[0] as unknown as { style: CSSStyleDeclaration }).style.animationDelay, '')
    assert.equal((rings[1] as unknown as { style: CSSStyleDeclaration }).style.animationDelay, '0.3s')
    const panel = selectedPanel(m)
    assert.ok(panel)
    assert.equal(textOf(panel.querySelector('h3') ?? undefined), 'Selected: ' + node.label)
    const bar = panel.querySelector('div.metric-bar') as unknown as { style: CSSStyleDeclaration }
    assert.ok(bar)
    assert.equal(bar.style.width, `${node.strength * 100}%`)
    const rows = synergyRows(m)
    assert.deepEqual(rows, expectedRows(EXPECTED.edges, node.id))
    assert.ok(rows.some(([direction]) => direction?.startsWith('→')))
    assert.ok(rows.some(([direction]) => direction?.startsWith('←')))
  })
})

test('clicking the selected system again clears the selection, and clicking another moves it', async () => {
  await withMounted(async (m) => {
    const first = 0
    const second = SYSTEMS - 1
    await m.click(nodeCircles(m)[first])
    assert.equal(textOf(selectedPanel(m)?.querySelector('h3') ?? undefined), 'Selected: ' + EXPECTED.nodes[first].label)
    assert.deepEqual(synergyRows(m), expectedRows(EXPECTED.edges, EXPECTED.nodes[first].id))
    assert.ok(synergyRows(m).every(([direction]) => direction?.startsWith('→')))
    await m.click(nodeCircles(m)[first])
    assert.equal(selectedPanel(m), null)
    assert.equal(m.q('circle.pulse-ring').length, 0)
    assert.ok(nodeCircles(m).every((circle) => circle.getAttribute('class') === 'graph-node '))
    await m.click(nodeCircles(m)[first])
    await m.click(nodeCircles(m)[second])
    assert.equal(textOf(selectedPanel(m)?.querySelector('h3') ?? undefined), 'Selected: ' + EXPECTED.nodes[second].label)
    assert.equal(nodeCircles(m)[first].getAttribute('class'), 'graph-node ')
    assert.equal(nodeCircles(m)[second].getAttribute('class'), 'graph-node active')
    assert.equal(m.q('circle.pulse-ring').length, 2)
    assert.deepEqual(synergyRows(m), expectedRows(EXPECTED.edges, EXPECTED.nodes[second].id))
    assert.ok(synergyRows(m).every(([direction]) => direction?.startsWith('←')))
  })
})

test('the animation interval advances one step every 50ms, wraps at 360, leaves the markup untouched and is cleared on unmount', async () => {
  await withMounted(async (m) => {
    assert.equal(m.intervals.mock.callCount(), 1)
    assert.equal(m.intervals.mock.calls[0].arguments[1], TICK_MS)
    const progress = () => m.hooks()[2].memoizedState
    assert.equal(progress(), 0)
    const before = m.container.innerHTML
    await act(async () => mock.timers.tick(TICK_MS - 1))
    assert.equal(progress(), 0)
    await act(async () => mock.timers.tick(1))
    assert.equal(progress(), 1)
    for (let step = 2; step < TURN; step++) await act(async () => mock.timers.tick(TICK_MS))
    assert.equal(progress(), TURN - 1)
    await act(async () => mock.timers.tick(TICK_MS))
    assert.equal(progress(), 0)
    await act(async () => mock.timers.tick(TICK_MS * 7))
    assert.equal(progress(), 7)
    assert.equal(m.container.innerHTML, before)
    assert.equal(m.clears.mock.callCount(), 0)
    const id = m.intervals.mock.calls[0].result
    await m.unmount()
    assert.equal(m.clears.mock.callCount(), 1)
    assert.equal(m.clears.mock.calls[0].arguments[0], id)
    assert.equal(m.container.innerHTML, '')
    await act(async () => mock.timers.tick(TICK_MS * 3))
    assert.equal(m.container.innerHTML, '')
  })
})

test('edges naming a system that is not in the network draw nothing, and the selection panel falls back when strength is 0 or the system is gone', async () => {
  await withMounted(async (m) => {
    const custom: Network = {
      nodes: [
        { id: 1, label: 'A', strength: 0.8 },
        { id: 2, label: 'B', strength: 0 },
      ],
      edges: [
        { source: 1, target: 2, strength: 0.3 },
        { source: 1, target: 9, strength: 0.9 },
        { source: 7, target: 2, strength: 0.5 },
      ],
    }
    const setNetwork = m.hooks()[0].queue.dispatch
    await act(async () => setNetwork(custom))
    const lines = m.q('svg > line')
    assert.equal(lines.length, 1)
    close(num(lines[0], 'x1'), CENTER + RADIUS, 'x1')
    close(num(lines[0], 'y1'), CENTER, 'y1')
    close(num(lines[0], 'x2'), CENTER - RADIUS, 'x2')
    close(num(lines[0], 'y2'), CENTER, 'y2')
    close(num(lines[0], 'stroke-width'), 0.6, 'stroke-width')
    const circles = nodeCircles(m)
    assert.equal(circles.length, 2)
    close(num(circles[1], 'r'), 25, 'zero-strength radius')
    assert.equal(circles[1].getAttribute('fill'), 'rgba(124, 58, 237, 0.3)')
    assert.equal(statValue(m, 'Total Systems:'), '2')
    assert.equal(statValue(m, 'Synergies Found:'), '3')
    assert.equal(statValue(m, 'Possible Pairs:'), '1')
    assert.equal(statValue(m, 'Coverage:'), '300.0%')
    await m.click(circles[1])
    const bar = () => selectedPanel(m)?.querySelector('div.metric-bar') as unknown as { style: CSSStyleDeclaration }
    assert.equal(textOf(selectedPanel(m)?.querySelector('h3') ?? undefined), 'Selected: B')
    assert.equal(bar().style.width, '0%')
    assert.deepEqual(synergyRows(m), [
      ['← S1', '30%'],
      ['← S7', '50%'],
    ])
    await act(async () => setNetwork({ nodes: [custom.nodes[0]], edges: [] }))
    assert.equal(nodeCircles(m).length, 1)
    assert.equal(m.q('circle.pulse-ring').length, 0)
    assert.equal(textOf(selectedPanel(m)?.querySelector('h3') ?? undefined), 'Selected: ')
    assert.equal(bar().style.width, '0%')
    assert.deepEqual(synergyRows(m), [])
    assert.equal(statValue(m, 'Possible Pairs:'), '0')
  })
})
