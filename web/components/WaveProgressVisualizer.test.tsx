import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { Window } from 'happy-dom'
import WaveProgressVisualizer from './WaveProgressVisualizer'

const G0 = 8
const LAMBDA = 0.15
const WAVES = 30
const CHART_LEFT = 80
const CHART_WIDTH = 500
const BASELINE = 350
const GAIN_SPAN = 200
const CUMULATIVE_SPAN = 300
const TICK_MS = 50
const CYCLE = 360

type Strategy = 'Focused' | 'Opportunistic' | 'Exploratory' | 'Defensive' | 'Broad'

const BRIGHT: Record<string, string> = {
  Focused: 'rgba(124, 58, 237, 0.7)',
  Opportunistic: 'rgba(59, 130, 246, 0.7)',
  Exploratory: 'rgba(6, 182, 212, 0.7)',
  Defensive: 'rgba(236, 72, 153, 0.7)',
}
const FAINT: Record<string, string> = {
  Focused: 'rgba(124, 58, 237, 0.3)',
  Opportunistic: 'rgba(59, 130, 246, 0.3)',
  Exploratory: 'rgba(6, 182, 212, 0.3)',
  Defensive: 'rgba(236, 72, 153, 0.3)',
}
const FALLBACK = 'rgba(124, 58, 237, 0.5)'

const brightOf = (strategy: Strategy) => BRIGHT[strategy] ?? FALLBACK
const faintOf = (strategy: Strategy) => FAINT[strategy] ?? FALLBACK

const strategyFor = (cumulative: number): Strategy =>
  cumulative > 50 ? 'Broad' : cumulative > 30 ? 'Exploratory' : cumulative > 10 ? 'Opportunistic' : 'Focused'

interface Expected {
  wave: number
  gain: number
  cumulative: number
  momentum: number
  strategy: Strategy
}

const closedForm = (): Expected[] => {
  const q = Math.exp(-LAMBDA)
  return Array.from({ length: WAVES }, (_, i) => {
    const n = i + 1
    const gain = G0 * q ** n
    const cumulative = (G0 * q * (1 - q ** n)) / (1 - q)
    const momentum = n === 1 ? gain : q - 1
    return { wave: n, gain, cumulative, momentum, strategy: strategyFor(cumulative) }
  })
}

const flat = (): Expected[] =>
  Array.from({ length: WAVES }, (_, i) => {
    const n = i + 1
    return { wave: n, gain: G0, cumulative: G0 * n, momentum: n === 1 ? G0 : 0, strategy: strategyFor(G0 * n) }
  })

const near = (actual: number, expected: number, label: string) =>
  assert.ok(Math.abs(actual - expected) <= 1e-9 * Math.max(1, Math.abs(expected)), `${label}: got ${actual}, expected ${expected}`)

const attr = (el: Element, name: string) => Number(el.getAttribute(name))

type View = Awaited<ReturnType<typeof mount>>

const mount = async () => {
  const window = new Window({ url: 'http://localhost/' })
  Object.assign(globalThis, { window, document: window.document, IS_REACT_ACT_ENVIRONMENT: true })
  const container = window.document.createElement('div') as unknown as HTMLElement
  window.document.body.appendChild(container as never)
  const root = createRoot(container)
  await act(async () => {
    root.render(<WaveProgressVisualizer />)
  })
  const svg = () => container.querySelector('svg') as SVGSVGElement
  const groups = () => [...svg().querySelectorAll('g')]
  return {
    window,
    container,
    grid: () => groups().filter((g) => g.querySelector('line')),
    waves: () => groups().filter((g) => !g.querySelector('line')),
    click: async (el: Element) => {
      await act(async () => {
        el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }) as unknown as Event)
      })
    },
    stat: (label: string) => {
      const row = [...container.querySelectorAll('div.flex.justify-between')].find((r) => r.firstElementChild?.textContent === label)
      return row?.lastElementChild?.textContent
    },
    panel: () => [...container.querySelectorAll('h3')].find((h) => /^Wave \d+ Details$/.test(h.textContent ?? ''))?.parentElement ?? null,
    close: async () => {
      await act(async () => {
        root.unmount()
      })
      await window.happyDOM.close()
    },
  }
}

const withTimers = async <T,>(body: () => Promise<T>) => {
  mock.timers.enable({ apis: ['setInterval'] })
  try {
    return await body()
  } finally {
    mock.timers.reset()
  }
}

const checkChart = (view: View, expected: Expected[], selected: number | null) => {
  const maxGain = Math.max(...expected.map((e) => e.gain))
  const maxCumulative = Math.max(...expected.map((e) => e.cumulative))
  const groups = view.waves()
  assert.equal(groups.length, expected.length)
  expected.forEach((e, i) => {
    const g = groups[i]
    const x = CHART_LEFT + (i / (expected.length - 1)) * CHART_WIDTH
    const gainHeight = (e.gain / maxGain) * GAIN_SPAN
    const cumulativeHeight = (e.cumulative / maxCumulative) * CUMULATIVE_SPAN
    const isSelected = selected === e.wave
    assert.equal((g as unknown as HTMLElement).style.cursor, 'pointer')

    const [faint, bright, ...extraRects] = [...g.querySelectorAll('rect')]
    assert.equal(extraRects.length, 0)
    near(attr(faint, 'x'), x - 8, `wave ${e.wave} faint x`)
    near(attr(faint, 'y'), BASELINE - cumulativeHeight, `wave ${e.wave} faint y`)
    assert.equal(attr(faint, 'width'), 4)
    near(attr(faint, 'height'), cumulativeHeight, `wave ${e.wave} faint height`)
    assert.equal(faint.getAttribute('fill'), faintOf(e.strategy))
    assert.equal(faint.getAttribute('opacity'), '0.4')

    near(attr(bright, 'x'), x, `wave ${e.wave} bright x`)
    near(attr(bright, 'y'), BASELINE - gainHeight, `wave ${e.wave} bright y`)
    assert.equal(attr(bright, 'width'), 8)
    near(attr(bright, 'height'), gainHeight, `wave ${e.wave} bright height`)
    assert.equal(bright.getAttribute('fill'), brightOf(e.strategy))
    assert.equal(bright.getAttribute('opacity'), isSelected ? '1' : '0.6')
    assert.equal(bright.getAttribute('class') ?? '', isSelected ? 'pulse-glow' : '')
    const style = (bright as unknown as HTMLElement).style
    assert.equal(style.filter, isSelected ? `drop-shadow(0 0 10px ${brightOf(e.strategy)})` : 'none')
    assert.equal(style.transition, 'all 0.3s ease')

    const label = g.querySelector('text') as Element
    assert.equal(label.textContent, String(e.wave))
    near(attr(label, 'x'), x, `wave ${e.wave} label x`)
    assert.equal(attr(label, 'y'), BASELINE + 20)

    const circles = [...g.querySelectorAll('circle')]
    if (e.gain === maxGain) {
      assert.equal(circles.length, 2)
      for (const c of circles) {
        near(attr(c, 'cx'), x + 4, `wave ${e.wave} ring cx`)
        near(attr(c, 'cy'), BASELINE - GAIN_SPAN, `wave ${e.wave} ring cy`)
        assert.equal(attr(c, 'r'), 4)
        assert.equal(c.getAttribute('fill'), 'none')
        assert.equal(c.getAttribute('class'), 'pulse-ring')
      }
      assert.equal(circles[0].getAttribute('stroke'), 'rgba(124, 58, 237, 0.8)')
      assert.equal(circles[1].getAttribute('stroke'), 'rgba(59, 130, 246, 0.8)')
      assert.equal((circles[1] as unknown as HTMLElement).style.animationDelay, '0.3s')
    } else {
      assert.equal(circles.length, 0)
    }
  })
}

const checkPanel = (view: View, expected: Expected[], wave: number) => {
  const maxGain = Math.max(...expected.map((e) => e.gain))
  const e = expected[wave - 1]
  const panel = view.panel()
  assert.ok(panel, `panel for wave ${wave}`)
  assert.equal(panel.querySelector('h3')?.textContent, `Wave ${wave} Details`)
  const body = panel.querySelector('.space-y-3') as Element
  const [strategy, gain, cumulative, momentum, formula] = [...body.children]
  assert.equal(strategy.children[1].textContent, e.strategy)

  assert.equal(gain.children[1].textContent, `${e.gain.toFixed(2)}%`)
  const gainBar = gain.querySelector('.h-full') as HTMLElement
  near(parseFloat(gainBar.style.width), (e.gain / maxGain) * 100, `wave ${wave} gain bar`)
  assert.ok(gainBar.style.width.endsWith('%'))

  assert.equal(cumulative.children[1].textContent, `${e.cumulative.toFixed(1)}%`)
  const cumulativeBar = cumulative.querySelector('.h-full') as HTMLElement
  near(parseFloat(cumulativeBar.style.width), e.cumulative, `wave ${wave} cumulative bar`)
  assert.ok(cumulativeBar.style.width.endsWith('%'))

  const trend = momentum.children[1]
  const rising = e.momentum > 0
  assert.equal(trend.textContent, `${rising ? '📈' : '📉'} ${e.momentum.toFixed(2)}`)
  assert.equal(trend.getAttribute('class'), `font-bold ${rising ? 'text-qpu-cyan' : 'text-qpu-pink'}`)

  const box = formula.querySelector('.font-mono') as Element
  assert.equal(box.children[0].textContent, `Gain(n) = ${G0} × e(-${LAMBDA}×${wave})`)
  assert.equal(box.querySelector('sup')?.textContent, `(-${LAMBDA}×${wave})`)
  assert.equal(box.children[1].textContent, `${e.gain.toFixed(2)}%`)
}

const hookStates = (container: Element) => {
  const key = Object.keys(container).find((k) => k.startsWith('__reactContainer$')) as string
  let fiber = (container as unknown as Record<string, any>)[key].stateNode.current
  while (fiber && fiber.type !== WaveProgressVisualizer) fiber = fiber.child
  const states: unknown[] = []
  for (let hook = fiber.memoizedState; hook; hook = hook.next) states.push(hook.memoizedState)
  return states
}

test('server render shows only the loading placeholder and computes no wave (effects do not run)', () => {
  const exp = mock.method(Math, 'exp')
  try {
    assert.equal(renderToStaticMarkup(<WaveProgressVisualizer />), '<div>Loading...</div>')
    assert.equal(renderToString(<WaveProgressVisualizer />), '<div>Loading...</div>')
    assert.equal(exp.mock.callCount(), 0)
  } finally {
    exp.mock.restore()
  }
})

test('mounting computes 30 waves of Gain(n) = 8·e^(-0.15n) and draws them to scale', async () => {
  await withTimers(async () => {
    const exp = mock.method(Math, 'exp')
    let view: View
    try {
      view = await mount()
    } finally {
      exp.mock.restore()
    }
    try {
      assert.deepEqual(
        exp.mock.calls.map((c) => c.arguments[0]),
        Array.from({ length: WAVES }, (_, i) => -LAMBDA * (i + 1)),
      )
      const expected = closedForm()
      const firstExploratory = Math.ceil(Math.log(1 - (30 * (1 - Math.exp(-LAMBDA))) / (G0 * Math.exp(-LAMBDA))) / -LAMBDA)
      const firstOpportunistic = Math.ceil(Math.log(1 - (10 * (1 - Math.exp(-LAMBDA))) / (G0 * Math.exp(-LAMBDA))) / -LAMBDA)
      assert.equal(firstOpportunistic, 2)
      assert.equal(firstExploratory, 7)
      assert.deepEqual(
        expected.map((e) => e.strategy),
        expected.map((e) => (e.wave >= firstExploratory ? 'Exploratory' : e.wave >= firstOpportunistic ? 'Opportunistic' : 'Focused')),
      )
      const limit = (G0 * Math.exp(-LAMBDA)) / (1 - Math.exp(-LAMBDA))
      assert.ok(expected.every((e) => e.cumulative < limit && limit < 50))

      const { container } = view
      assert.equal(container.querySelector('h2')?.textContent, 'Wave-Based Continuous Improvement')
      assert.equal(view.stat('Total Waves:'), String(WAVES))
      assert.equal(view.stat('Max Wave Gain:'), `${(G0 * Math.exp(-LAMBDA)).toFixed(2)}%`)
      assert.equal(view.stat('Total Cumulative:'), `${expected[WAVES - 1].cumulative.toFixed(1)}%`)
      assert.equal(view.stat('Convergence Point:'), '~80-85%')
      assert.equal(view.panel(), null)

      const grid = view.grid()
      assert.equal(grid.length, 10)
      grid.forEach((g, i) => {
        const y = (i / 9) * 300 + 50
        const line = g.querySelector('line') as Element
        assert.equal(attr(line, 'x1'), CHART_LEFT)
        assert.equal(attr(line, 'x2'), CHART_LEFT + CHART_WIDTH)
        near(attr(line, 'y1'), y, `grid ${i} y1`)
        near(attr(line, 'y2'), y, `grid ${i} y2`)
        assert.equal(line.getAttribute('stroke-dasharray'), '4,4')
        const text = g.querySelector('text') as Element
        near(attr(text, 'y'), y + 3, `grid ${i} label y`)
        assert.equal(text.textContent, `${90 - 10 * i}%`)
      })

      const axes = [...container.querySelectorAll('svg > line')]
      assert.deepEqual(
        axes.map((l) => ['x1', 'y1', 'x2', 'y2'].map((a) => attr(l, a))),
        [
          [CHART_LEFT, BASELINE, CHART_LEFT + CHART_WIDTH, BASELINE],
          [CHART_LEFT, BASELINE - CUMULATIVE_SPAN, CHART_LEFT, BASELINE],
        ],
      )

      checkChart(view, expected, null)
      assert.equal(container.querySelectorAll('circle').length, 2)
      assert.equal(view.waves()[0].querySelectorAll('circle').length, 2)
      assert.equal(attr(view.waves()[WAVES - 1].querySelectorAll('rect')[0], 'height'), CUMULATIVE_SPAN)

      const legend = [...container.querySelectorAll('.space-y-2 span')].map((s) => s.textContent?.split(' ')[0])
      assert.deepEqual(legend, Object.keys(BRIGHT))
      assert.deepEqual(
        [...container.querySelectorAll('h4')].map((h) => h.textContent),
        ['Exponential Decay', 'Cumulative Growth', 'Convergence'],
      )
    } finally {
      await view.close()
    }
  })
})

test('clicking a wave selects it, shows its details, switches to another wave, and a second click clears it', async () => {
  await withTimers(async () => {
    const view = await mount()
    try {
      const expected = closedForm()
      const brights = () => view.waves().map((g) => g.querySelectorAll('rect')[1])
      for (const e of expected) {
        await view.click(brights()[e.wave - 1])
        checkPanel(view, expected, e.wave)
        checkChart(view, expected, e.wave)
      }
      const last = expected[WAVES - 1].wave
      await view.click(view.waves()[last - 1])
      assert.equal(view.panel(), null)
      checkChart(view, expected, null)

      await view.click(view.waves()[0].querySelector('text') as Element)
      checkPanel(view, expected, 1)
      assert.equal(expected[0].momentum, expected[0].gain)
      assert.ok(expected[0].momentum > 0)
      await view.click(view.waves()[6].querySelectorAll('rect')[0])
      checkPanel(view, expected, 7)
      assert.ok(expected[6].momentum < 0)
      checkChart(view, expected, 7)
      await view.click(view.waves()[6])
      assert.equal(view.panel(), null)
    } finally {
      await view.close()
    }
  })
})

test('a flat gain curve reaches the Broad phase, falls back to the default colour, rings every wave and shows zero momentum as falling', async () => {
  await withTimers(async () => {
    const exp = mock.method(Math, 'exp', () => 1)
    let view: View
    try {
      view = await mount()
    } finally {
      exp.mock.restore()
    }
    try {
      assert.equal(exp.mock.callCount(), WAVES)
      const expected = flat()
      assert.deepEqual(
        expected.map((e) => e.strategy),
        [
          'Focused',
          'Opportunistic',
          'Opportunistic',
          'Exploratory',
          'Exploratory',
          'Exploratory',
          ...Array.from({ length: WAVES - 6 }, () => 'Broad'),
        ],
      )
      assert.equal(view.stat('Max Wave Gain:'), `${G0.toFixed(2)}%`)
      assert.equal(view.stat('Total Cumulative:'), `${(G0 * WAVES).toFixed(1)}%`)
      checkChart(view, expected, null)
      assert.equal(view.container.querySelectorAll('circle').length, 2 * WAVES)

      const broad = view.waves()[WAVES - 1].querySelectorAll('rect')
      assert.equal(broad[0].getAttribute('fill'), FALLBACK)
      assert.equal(broad[1].getAttribute('fill'), FALLBACK)

      await view.click(broad[1])
      checkPanel(view, expected, WAVES)
      checkChart(view, expected, WAVES)

      await view.click(view.waves()[0])
      checkPanel(view, expected, 1)
      await view.click(view.waves()[1])
      checkPanel(view, expected, 2)
      const trend = (view.panel() as Element).querySelectorAll('.space-y-3 > div')[3].children[1]
      assert.equal(trend.textContent, `📉 ${(0).toFixed(2)}`)
      assert.equal(trend.getAttribute('class'), 'font-bold text-qpu-pink')
    } finally {
      await view.close()
    }
  })
})

test('the animation clock ticks every 50 ms modulo 360 without touching the markup and stops on unmount', async () => {
  await withTimers(async () => {
    const setSpy = mock.method(globalThis, 'setInterval')
    const clearSpy = mock.method(globalThis, 'clearInterval')
    try {
      const view = await mount()
      const clocks = setSpy.mock.calls.filter((c) => c.arguments[1] === TICK_MS)
      assert.equal(clocks.length, 1)
      const id = clocks[0].result

      const states = () => hookStates(view.container)
      assert.equal((states()[0] as unknown[]).length, WAVES)
      assert.equal(states()[1], null)
      assert.equal(states()[2], 0)

      const markup = view.container.innerHTML
      await act(async () => mock.timers.tick(TICK_MS - 1))
      assert.equal(states()[2], 0)
      await act(async () => mock.timers.tick(1))
      assert.equal(states()[2], 1)
      await act(async () => mock.timers.tick(TICK_MS * (CYCLE - 2)))
      assert.equal(states()[2], CYCLE - 1)
      await act(async () => mock.timers.tick(TICK_MS))
      assert.equal(states()[2], 0)
      await act(async () => mock.timers.tick(TICK_MS * (CYCLE + 5)))
      assert.equal(states()[2], (CYCLE + 5) % CYCLE)
      assert.equal(view.container.innerHTML, markup)

      await view.click(view.waves()[3])
      assert.equal(states()[1], 4)
      await act(async () => mock.timers.tick(TICK_MS * 3))
      assert.equal(states()[2], 8)
      checkPanel(view, closedForm(), 4)

      assert.equal(clearSpy.mock.calls.filter((c) => c.arguments[0] === id).length, 0)
      await view.close()
      assert.equal(clearSpy.mock.calls.filter((c) => c.arguments[0] === id).length, 1)
    } finally {
      setSpy.mock.restore()
      clearSpy.mock.restore()
    }
  })
})
