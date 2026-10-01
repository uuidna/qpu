import { mock, test, type TestContext } from 'node:test'
import assert from 'node:assert/strict'
import { act, type ReactElement } from 'react'
import { createRoot, hydrateRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { Window } from 'happy-dom'
import MetricsFlow from './MetricsFlow'

type Metrics = {
  learning: number
  robustness: number
  efficiency: number
  collaboration: number
  trustworthiness: number
}

const opening: Metrics = { learning: 85, robustness: 92, efficiency: 78, collaboration: 88, trustworthiness: 91 }

const STEP_MS = 50
const CYCLE = 360
const BALANCE_LIMIT = 20
const FULL_SHARE = 25
const ARC_RADIUS = 40

const wave = (step: number): Metrics => {
  const swing = (base: number, amplitude: number, offset: number) => base + amplitude * Math.sin((step + offset) / 100)
  return {
    learning: swing(75, 15, 0),
    robustness: swing(85, 10, 60),
    efficiency: swing(70, 15, 120),
    collaboration: swing(80, 12, 180),
    trustworthiness: swing(88, 8, 240),
  }
}

const cardSpecs = [
  { key: 'learning', name: 'Learning', icon: '📚', gradient: ['from-qpu-purple', 'to-qpu-blue'], formula: 'velocity × discovery_rate' },
  { key: 'robustness', name: 'Robustness', icon: '🛡️', gradient: ['from-qpu-blue', 'to-qpu-cyan'], formula: '1 - (fault_rate)^nodes' },
  { key: 'efficiency', name: 'Efficiency', icon: '⚡', gradient: ['from-qpu-cyan', 'to-qpu-purple'], formula: 'throughput / resources' },
  { key: 'collaboration', name: 'Collaboration', icon: '🤝', gradient: ['from-qpu-purple', 'to-qpu-pink'], formula: 'consensus_strength × synergy' },
  { key: 'trustworthiness', name: 'Trust', icon: '🔐', gradient: ['from-qpu-pink', 'to-qpu-purple'], formula: '0.3T + 0.3C + 0.2E + 0.2A' },
] as const

const weightSpecs = [
  { key: 'learning', percent: 25, label: 'Learning (25%)', color: 'bg-qpu-purple', node: 'L' },
  { key: 'robustness', percent: 25, label: 'Robustness (25%)', color: 'bg-qpu-blue', node: 'R' },
  { key: 'efficiency', percent: 20, label: 'Efficiency (20%)', color: 'bg-qpu-cyan', node: 'E' },
  { key: 'collaboration', percent: 20, label: 'Collaboration (20%)', color: 'bg-qpu-pink', node: 'Co' },
  { key: 'trustworthiness', percent: 10, label: 'Trust (10%)', color: 'bg-qpu-purple', node: 'T' },
] as const

const overallOf = (m: Metrics) => weightSpecs.reduce((sum, spec) => sum + spec.percent * m[spec.key], 0) / 100

const spreadOf = (m: Metrics) => {
  const values = Object.values(m)
  return Math.max(...values) - Math.min(...values)
}

const trustOf = (m: Metrics) =>
  (30 * (0.9 * m.trustworthiness) + 30 * (0.85 * m.robustness) + 20 * (0.8 * m.learning) + 20 * (0.9 * m.collaboration)) / 100

const expectedView = (m: Metrics) => {
  const values = cardSpecs.map((spec) => m[spec.key])
  const overall = overallOf(m)
  const high = Math.max(...values)
  const low = Math.min(...values)
  const spread = high - low
  const unbalanced = spread > BALANCE_LIMIT
  const tone = unbalanced ? 'text-qpu-pink' : 'text-qpu-cyan'
  const trust = trustOf(m)
  const meanPercent = values.reduce((sum, value) => sum + value, 0) / values.length
  return {
    cards: cardSpecs.map((spec, index) => ({
      name: spec.name,
      icon: spec.icon,
      value: m[spec.key].toFixed(1),
      unit: '%',
      bar: m[spec.key],
      glow: m[spec.key],
      gradient: [...spec.gradient],
      glowGradient: [...spec.gradient],
      formula: [spec.formula],
      delay: index / 10,
    })),
    overall: {
      headline: `${overall.toFixed(1)}%`,
      components: weightSpecs.map((spec) => {
        const share = (spec.percent * m[spec.key]) / 100
        return { label: spec.label, value: share.toFixed(1), width: (100 * share) / FULL_SHARE, color: [spec.color] }
      }),
      arc: overall / 100,
      arcText: `${overall.toFixed(0)}%`,
    },
    divergence: {
      headline: `${spread.toFixed(1)}%`,
      tone,
      max: `${high.toFixed(1)}%`,
      min: `${low.toFixed(1)}%`,
      status: unbalanced ? '⚠️ Needs balancing' : '✅ Balanced',
      statusTone: tone,
      gradient: unbalanced ? ['from-qpu-pink', 'to-qpu-purple'] : ['from-qpu-cyan', 'to-qpu-blue'],
      width: spread,
    },
    trust: { headline: `${trust.toFixed(1)}%`, width: trust },
    coherence: { headline: `${meanPercent.toFixed(1)}%`, width: meanPercent },
    flow: weightSpecs.map((spec, index) => ({
      x: 100 * (index + 1),
      stroke: Math.max(1, spec.percent / 20),
      alpha: 0.3 + spec.percent / 100,
      label: spec.node,
      value: `${m[spec.key].toFixed(0)}%`,
    })),
    result: `${overall.toFixed(0)}%`,
  }
}

const tidy = (value: unknown): unknown => {
  if (typeof value === 'number') return Number(value.toFixed(6)) + 0
  if (Array.isArray(value)) return value.map(tidy)
  if (value !== null && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, tidy(inner)]))
  return value
}

const textOf = (el: Element | null | undefined) => el?.textContent ?? ''
const widthOf = (el: Element | null | undefined) => parseFloat((el as HTMLElement).style.width)
const gradientOf = (el: Element) => [...el.classList].filter((name) => name.startsWith('from-') || name.startsWith('to-'))
const toneOf = (el: Element) => [...el.classList].filter((name) => name === 'text-qpu-pink' || name === 'text-qpu-cyan').join(' ')

const headingOf = (root: ParentNode, selector: string, title: string) => {
  const heading = [...root.querySelectorAll(selector)].find((el) => el.textContent === title)
  assert.ok(heading, `no ${selector} titled ${title}`)
  return heading
}

const panelOf = (root: ParentNode, title: string) => {
  const heading = headingOf(root, 'h4', title)
  return { card: heading.parentElement!.parentElement!, headline: heading.nextElementSibling! }
}

const readView = (root: ParentNode) => {
  const cards = [...root.querySelectorAll('.float-card')].map((card) => {
    const [bar, glow] = [...card.querySelector('.relative')!.children]
    const figure = card.querySelector('.text-right')!
    return {
      name: textOf(card.querySelector('h4')),
      icon: textOf(card.querySelector('span')),
      value: textOf(figure.firstElementChild),
      unit: textOf(figure.lastElementChild),
      bar: widthOf(bar),
      glow: widthOf(glow),
      gradient: gradientOf(bar),
      glowGradient: gradientOf(glow),
      formula: [...card.querySelector('.font-mono')!.children].map(textOf),
      delay: parseFloat((card as HTMLElement).style.animationDelay),
    }
  })

  const overall = panelOf(root, 'Overall Score')
  const arc = overall.card.querySelectorAll('circle')[1]
  const [dash, circumference] = arc.getAttribute('stroke-dasharray')!.split(' ').map(Number)
  const components = [...overall.card.querySelector('.space-y-2')!.children].map((row) => {
    const [label, value] = [...row.querySelectorAll('span')]
    const bar = row.querySelector('.w-full')!.firstElementChild!
    return { label: textOf(label), value: textOf(value), width: widthOf(bar), color: [...bar.classList].filter((name) => name.startsWith('bg-')) }
  })

  const divergence = panelOf(root, 'Metric Divergence')
  const [maxRow, minRow, statusRow] = [...divergence.card.querySelector('.space-y-2')!.children].map((row) => row.children[1])
  const spreadBar = divergence.card.lastElementChild!.firstElementChild!

  const trust = panelOf(root, 'Trust Score')
  const coherence = panelOf(root, 'System Coherence')

  const network = headingOf(root, 'h3', 'Metric Flow Network').nextElementSibling!
  const flow = [...network.querySelectorAll('g')].map((group) => {
    const [label, value] = [...group.querySelectorAll('text')]
    const fill = group.querySelector('circle')!.getAttribute('fill')!
    return {
      x: Number(group.querySelector('line')!.getAttribute('x1')),
      stroke: Number(group.querySelector('line')!.getAttribute('stroke-width')),
      alpha: Number(/,\s*([\d.]+)\)$/.exec(fill)![1]),
      label: textOf(label),
      value: textOf(value),
    }
  })

  return {
    cards,
    overall: {
      headline: textOf(overall.headline),
      components,
      arc: dash / circumference,
      arcText: textOf(overall.card.querySelector('text')),
    },
    divergence: {
      headline: textOf(divergence.headline),
      tone: toneOf(divergence.headline),
      max: textOf(maxRow),
      min: textOf(minRow),
      status: textOf(statusRow),
      statusTone: toneOf(statusRow),
      gradient: gradientOf(spreadBar),
      width: widthOf(spreadBar),
    },
    trust: { headline: textOf(trust.headline), width: widthOf(trust.card.lastElementChild!.firstElementChild) },
    coherence: { headline: textOf(coherence.headline), width: widthOf(coherence.card.lastElementChild!.firstElementChild) },
    flow,
    result: textOf(network.lastElementChild),
  }
}

const assertView = (root: ParentNode, m: Metrics, message?: string) => assert.deepStrictEqual(tidy(readView(root)), tidy(expectedView(m)), message)

const parsed = async (html: string, inspect: (body: HTMLElement) => void) => {
  const window = new Window({ url: 'http://localhost/' })
  try {
    window.document.body.innerHTML = html
    inspect(window.document.body as unknown as HTMLElement)
  } finally {
    await window.happyDOM.close()
  }
}

const live = (t: TestContext) => {
  const window = new Window({ url: 'http://localhost/' })
  Object.assign(globalThis, { window, document: window.document, IS_REACT_ACT_ENVIRONMENT: true })
  mock.timers.enable({ apis: ['setInterval'] })
  const container = window.document.createElement('div') as unknown as HTMLElement
  window.document.body.appendChild(container as never)
  let root: Root | undefined
  const unmount = async () => {
    const mounted = root
    root = undefined
    if (mounted) await act(async () => mounted.unmount())
  }
  t.after(async () => {
    await unmount()
    mock.restoreAll()
    mock.timers.reset()
    await window.happyDOM.close()
    for (const key of ['window', 'document', 'IS_REACT_ACT_ENVIRONMENT']) Reflect.deleteProperty(globalThis, key)
  })
  return {
    container,
    render: async (element: ReactElement) => {
      await act(async () => {
        root = createRoot(container)
        root.render(element)
      })
    },
    hydrate: async (element: ReactElement, onRecoverableError: (error: unknown) => void) => {
      await act(async () => {
        root = hydrateRoot(container, element, { onRecoverableError })
      })
    },
    elapse: async (ms: number) => {
      await act(async () => mock.timers.tick(ms))
    },
    advance: async (steps: number) => {
      for (let step = 0; step < steps; step += 1) await act(async () => mock.timers.tick(STEP_MS))
    },
    unmount,
  }
}

test('server render opens on 85/92/78/88/91 and every figure, bar, arc and node follows from those five metrics', async () => {
  await parsed(renderToStaticMarkup(<MetricsFlow />), (body) => {
    assert.equal(textOf(body.querySelector('h2')), 'Metrics Flow Visualization')
    assertView(body, opening)
  })
})

test('the opening figures match hand arithmetic: 14 spread, 77.47 trust, 86.8 coherence, 86.55 overall', async () => {
  await parsed(renderToStaticMarkup(<MetricsFlow />), (body) => {
    const view = readView(body)
    assert.equal(view.divergence.headline, '14.0%')
    assert.equal(view.divergence.max, '92.0%')
    assert.equal(view.divergence.min, '78.0%')
    assert.equal(view.divergence.status, '✅ Balanced')
    assert.equal(view.trust.headline, '77.5%')
    assert.ok(Math.abs(view.trust.width - 77.47) < 1e-9)
    assert.equal(view.coherence.headline, '86.8%')
    assert.ok(Math.abs(view.coherence.width - 86.8) < 1e-9)
    assert.ok(Math.abs(parseFloat(view.overall.headline) - 86.55) <= 0.05)
    assert.equal(view.overall.arcText, '87%')
    assert.equal(view.result, '87%')
    assert.deepEqual(
      view.overall.components.map((component) => component.value),
      ['21.3', '23.0', '15.6', '17.6', '9.1'],
    )
    assert.deepEqual(
      view.cards.map((card) => card.value),
      ['85.0', '92.0', '78.0', '88.0', '91.0'],
    )
  })
})

test('each metric card shows exactly one formula, its own, and no two cards share a formula', async () => {
  await parsed(renderToStaticMarkup(<MetricsFlow />), (body) => {
    const cards = readView(body).cards
    assert.equal(cards.length, cardSpecs.length)
    for (const [index, spec] of cardSpecs.entries()) {
      assert.equal(cards[index].name, spec.name)
      assert.deepEqual(cards[index].formula, [spec.formula])
    }
    assert.equal(new Set(cards.map((card) => card.formula[0])).size, cardSpecs.length)
  })
})

test('the captions of the combined panels state the weights the displayed numbers are computed with', async () => {
  await parsed(renderToStaticMarkup(<MetricsFlow />), (body) => {
    const caption = (title: string) => textOf(panelOf(body, title).card.querySelector('.code-highlight'))
    const overallTerms = caption('Overall Score')
      .split(' + ')
      .map((term) => /^([\d.]+)(\w+)$/.exec(term)!)
      .map(([, weight, symbol]) => ({ weight: Number(weight), symbol }))
    assert.deepEqual(
      overallTerms.map((term) => term.symbol),
      weightSpecs.map((spec) => spec.node),
    )
    const fromCaption = overallTerms.reduce((sum, term, index) => sum + term.weight * opening[weightSpecs[index].key], 0)
    assert.ok(Math.abs(fromCaption - 86.55) < 1e-9)
    assert.equal(readView(body).overall.headline, `${fromCaption.toFixed(1)}%`)
    for (const [index, spec] of weightSpecs.entries()) assert.equal(overallTerms[index].weight * 100, spec.percent)
    assert.equal(overallTerms.reduce((sum, term) => sum + term.weight * 100, 0), 100)
    assert.equal(caption('Metric Divergence'), 'Max(M) - Min(M)')
    const trustWeights = caption('Trust Score')
      .split(' + ')
      .map((term) => Number(/^([\d.]+)/.exec(term)![1]) * 10)
    assert.deepEqual(trustWeights, [3, 3, 2, 2])
    assert.equal(caption('System Coherence'), 'Σ(alignment) / count')
  })
})

test('the arc is drawn on the circumference of r=40 and the flow edges all converge on the result node', async () => {
  await parsed(renderToStaticMarkup(<MetricsFlow />), (body) => {
    const overall = panelOf(body, 'Overall Score').card
    const [track, arc] = [...overall.querySelectorAll('circle')]
    for (const circle of [track, arc]) assert.equal(Number(circle.getAttribute('r')), ARC_RADIUS)
    const [dash, circumference] = arc.getAttribute('stroke-dasharray')!.split(' ').map(Number)
    assert.ok(Math.abs(circumference - 2 * Math.PI * ARC_RADIUS) < 0.2)
    assert.ok(Math.abs(dash - (overallOf(opening) / 100) * circumference) < 1e-9)
    assert.equal(arc.getAttribute('transform'), 'rotate(-90 50 50)')

    const network = headingOf(body, 'h3', 'Metric Flow Network').nextElementSibling!
    const result = network.querySelectorAll(':scope > circle')
    assert.equal(result.length, 1)
    const [cx, cy] = ['cx', 'cy'].map((name) => Number(result[0].getAttribute(name)))
    for (const [index, line] of [...network.querySelectorAll('line')].entries()) {
      assert.equal(Number(line.getAttribute('x1')), 100 * (index + 1))
      assert.equal(Number(line.getAttribute('x2')), cx)
      assert.ok(Number(line.getAttribute('y2')) < cy)
      assert.ok(Number(line.getAttribute('y1')) < Number(line.getAttribute('y2')))
    }
  })
})

test('flow edge strokes are five times the weight but the 10% trust edge is held at the 1px floor', async () => {
  await parsed(renderToStaticMarkup(<MetricsFlow />), (body) => {
    const flow = readView(body).flow
    assert.deepEqual(
      flow.map((node) => node.stroke),
      [1.25, 1.25, 1, 1, 1],
    )
    const trust = flow[flow.length - 1]
    assert.equal(trust.label, 'T')
    assert.ok((weightSpecs[weightSpecs.length - 1].percent / 100) * 5 < 1)
    assert.equal(trust.stroke, 1)
  })
})

test('the glow bar pulses and each card is staggered by a tenth of a second', async () => {
  await parsed(renderToStaticMarkup(<MetricsFlow />), (body) => {
    const cards = [...body.querySelectorAll('.float-card')]
    for (const [index, card] of cards.entries()) {
      const glow = card.querySelector('.relative')!.children[1]
      assert.match(glow.getAttribute('style')!, /pulse 2s ease-in-out infinite/)
      assert.ok(Math.abs(parseFloat((card as HTMLElement).style.animationDelay) - index / 10) < 1e-9)
    }
  })
})

test('the interval fires every 50ms: nothing moves at 49ms, the first wave step lands at 50ms', async (t) => {
  const session = live(t)
  const scheduled = mock.method(globalThis, 'setInterval')
  await session.render(<MetricsFlow />)
  assert.equal(scheduled.mock.callCount(), 1)
  assert.equal(scheduled.mock.calls[0].arguments[1], STEP_MS)
  assertView(session.container, opening)
  await session.elapse(STEP_MS - 1)
  assertView(session.container, opening)
  await session.elapse(1)
  assertView(session.container, wave(1))
  await session.elapse(STEP_MS)
  assertView(session.container, wave(2))
})

test('every step of the 360-step cycle renders the wave formulas for that step, then wraps to step 0 and repeats', async (t) => {
  const session = live(t)
  await session.render(<MetricsFlow />)
  for (let step = 1; step <= CYCLE; step += 1) {
    await session.advance(1)
    assertView(session.container, wave(step % CYCLE), `step ${step}`)
  }
  assert.notDeepEqual(tidy(expectedView(wave(0))), tidy(expectedView(opening)))
  await session.advance(1)
  assertView(session.container, wave(1), `step ${CYCLE + 1}`)
})

test('divergence flips to Needs balancing on the first step whose spread exceeds 20 and back to Balanced when it drops again', async (t) => {
  const steps = Array.from({ length: CYCLE }, (_, step) => step)
  const first = steps.find((step) => step > 0 && spreadOf(wave(step)) > BALANCE_LIMIT)
  assert.ok(first !== undefined)
  assert.ok(spreadOf(opening) <= BALANCE_LIMIT)
  const back = steps.find((step) => step > first && spreadOf(wave(step)) <= BALANCE_LIMIT) ?? CYCLE
  assert.ok(spreadOf(wave(back % CYCLE)) <= BALANCE_LIMIT)

  const session = live(t)
  await session.render(<MetricsFlow />)
  const divergence = () => readView(session.container).divergence

  await session.advance(first - 1)
  assert.ok(spreadOf(wave(first - 1)) <= BALANCE_LIMIT)
  assert.equal(divergence().status, '✅ Balanced')
  assert.equal(divergence().tone, 'text-qpu-cyan')
  assert.equal(divergence().statusTone, 'text-qpu-cyan')
  assert.deepEqual(divergence().gradient, ['from-qpu-cyan', 'to-qpu-blue'])

  await session.advance(1)
  const spread = spreadOf(wave(first))
  assert.equal(divergence().status, '⚠️ Needs balancing')
  assert.equal(divergence().tone, 'text-qpu-pink')
  assert.equal(divergence().statusTone, 'text-qpu-pink')
  assert.deepEqual(divergence().gradient, ['from-qpu-pink', 'to-qpu-purple'])
  assert.equal(divergence().headline, `${spread.toFixed(1)}%`)
  assert.ok(spread <= 100)
  assert.ok(Math.abs(divergence().width - spread) < 1e-9)

  await session.advance(back - first - 1)
  assert.equal(divergence().status, '⚠️ Needs balancing')
  await session.advance(1)
  assert.equal(divergence().status, '✅ Balanced')
  assert.equal(divergence().tone, 'text-qpu-cyan')
  assert.deepEqual(divergence().gradient, ['from-qpu-cyan', 'to-qpu-blue'])
})

test('hydrating the server markup reuses its nodes with no recoverable error or console error, then animates', async (t) => {
  const session = live(t)
  session.container.innerHTML = renderToString(<MetricsFlow />)
  const firstCard = session.container.querySelector('.float-card')
  assert.ok(firstCard)
  const recoverable: unknown[] = []
  const errors = mock.method(console, 'error', () => {})
  await session.hydrate(<MetricsFlow />, (error) => recoverable.push(error))
  assert.deepEqual(recoverable, [])
  assert.deepEqual(
    errors.mock.calls.map((call) => call.arguments),
    [],
  )
  assert.equal(session.container.querySelector('.float-card'), firstCard)
  assertView(session.container, opening)
  await session.advance(1)
  assertView(session.container, wave(1))
  assert.equal(errors.mock.callCount(), 0)
})

test('unmount clears the interval it started and later ticks no longer fire it', async (t) => {
  const session = live(t)
  const timers = globalThis as unknown as {
    setInterval: (callback: () => void, ms: number) => unknown
    clearInterval: (id: unknown) => void
  }
  const fakeSetInterval = timers.setInterval
  let fired = 0
  const scheduled = mock.method(timers, 'setInterval', (callback: () => void, ms: number) =>
    fakeSetInterval(() => {
      fired += 1
      callback()
    }, ms),
  )
  const cleared = mock.method(timers, 'clearInterval')
  await session.render(<MetricsFlow />)
  await session.advance(3)
  assert.equal(fired, 3)
  assertView(session.container, wave(3))
  assert.equal(cleared.mock.callCount(), 0)
  await session.unmount()
  assert.equal(session.container.innerHTML, '')
  assert.equal(scheduled.mock.callCount(), 1)
  assert.equal(cleared.mock.callCount(), 1)
  assert.equal(cleared.mock.calls[0].arguments[0], scheduled.mock.calls[0].result)
  await session.advance(5)
  assert.equal(fired, 3)
})
