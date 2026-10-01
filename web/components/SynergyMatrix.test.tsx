import { test, type TestContext } from 'node:test'
import assert from 'node:assert/strict'
import { act } from 'react'
import { renderToString } from 'react-dom/server'
import { createRoot } from 'react-dom/client'
import { Window, type Element as DomElement } from 'happy-dom'
import SynergyMatrix from './SynergyMatrix'

const SIZE = 15
const CELL = 40
const LOW = 'rgba(124, 58, 237, 0.2)'
const MEDIUM = 'rgba(59, 130, 246, 0.4)'
const HIGH = 'rgba(6, 182, 212, 0.6)'
const VERY_HIGH = 'rgba(236, 72, 153, 0.8)'
const SELECTED_STROKE = 'rgba(6, 182, 212, 1)'
const IDLE_STROKE = 'rgba(124, 58, 237, 0.3)'
const SELECTED_FILTER = 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.8))'

type Cell = { x: number; y: number; value: number }

const golden = (k: number) => ((k + 1) * 0.6180339887498949) % 1
const zero = () => 0

const baseOf = (index: number) => 0.5 + (index / SIZE) * 0.5

const expectedCells = (draw: (k: number) => number): Cell[] => {
  const cells: Cell[] = []
  let k = 0
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      const alignment = 0.7 + draw(k++) * 0.25
      const timing = 0.8 + draw(k++) * 0.2
      cells.push({ x, y, value: baseOf(x) * baseOf(y) * alignment * timing })
    }
  }
  return cells
}

const summaryOf = (cells: Cell[]) => {
  const values = cells.map((c) => c.value)
  let max = -Infinity
  let min = Infinity
  let sum = 0
  for (const v of values) {
    if (v > max) max = v
    if (v < min) min = v
    sum += v
  }
  const sorted = [...values].sort((a, b) => a - b)
  return {
    values,
    max,
    min,
    mean: sum / values.length,
    median: sorted[Math.floor(values.length / 2)],
    high: values.filter((v) => v > max * 0.7).length,
  }
}

const colorOf = (value: number, max: number) => {
  const normalized = value / max
  if (normalized < 0.3) return LOW
  if (normalized < 0.6) return MEDIUM
  if (normalized < 0.8) return HIGH
  return VERY_HIGH
}

const binsOf = (values: number[], max: number) =>
  Array.from({ length: 10 }, (_, i) => values.filter((v) => v >= (i / 10) * max && (v < ((i + 1) / 10) * max || i === 9)).length)

const floorBinsOf = (values: number[], max: number) => {
  const bins = new Array<number>(10).fill(0)
  for (const v of values) bins[Math.min(9, Math.floor((v / max) * 10))]++
  return bins
}

const close = (actual: number, expected: number, message?: string) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `${message ?? ''} expected ${expected}, got ${actual}`)

const alphaOf = (color: string | null) => {
  const match = /^rgba\(124, 58, 237, ([0-9.]+)\)$/.exec(color ?? '')
  assert.ok(match, `unexpected histogram fill ${color}`)
  return Number(match[1])
}

const num = (el: DomElement, name: string) => Number(el.getAttribute(name))

const statOf = (root: DomElement, label: string) => {
  const spans = [...root.querySelectorAll('span')].filter((s) => s.textContent === label)
  assert.equal(spans.length, 1, `exactly one "${label}" row`)
  const value = spans[0].nextElementSibling
  assert.ok(value)
  return value.textContent
}

const svgsOf = (root: DomElement) => {
  const svgs = [...root.querySelectorAll('svg')]
  assert.equal(svgs.length, 2)
  return { matrix: svgs[0], histogram: svgs[1] }
}

const panelOf = (root: DomElement) => {
  const headings = [...root.querySelectorAll('h3')].filter((h) => (h.textContent ?? '').startsWith('Cell ['))
  assert.ok(headings.length <= 1)
  return headings.length === 0 ? null : headings[0].parentElement
}

const assertHistogram = (root: DomElement, heights: number[]) => {
  const { histogram } = svgsOf(root)
  const groups = [...histogram.children]
  assert.equal(groups.length, 10)
  groups.forEach((g, i) => {
    const rect = g.querySelector('rect')
    const label = g.querySelector('text')
    assert.ok(rect && label)
    assert.equal(num(rect, 'x'), 20 + i * 27)
    assert.equal(num(rect, 'width'), 24)
    close(num(rect, 'height'), heights[i], `bin ${i} height`)
    close(num(rect, 'y'), 120 - heights[i], `bin ${i} y`)
    close(alphaOf(rect.getAttribute('fill')), 0.3 + 0.07 * i, `bin ${i} alpha`)
    assert.equal(rect.getAttribute('stroke'), 'rgba(124, 58, 237, 0.6)')
    assert.equal(label.textContent, String(i * 10))
    assert.equal(num(label, 'x'), 32 + i * 27)
    assert.equal(num(label, 'y'), 135)
  })
}

const errorsOf = (t: TestContext) => t.mock.method(console, 'error', () => {})

const assertNoErrors = (errors: ReturnType<typeof errorsOf>) =>
  assert.deepEqual(
    errors.mock.calls.map((c) => c.arguments.map(String).join(' ')),
    [],
  )

type Hook = { memoizedState: unknown; next: Hook | null }
type Fiber = { type: unknown; child: Fiber | null; sibling: Fiber | null; memoizedState: Hook | null; stateNode: { current: Fiber } }

const mount = async (t: TestContext, draw: (k: number) => number) => {
  const window = new Window({ url: 'http://localhost/' })
  Object.assign(globalThis, { window, document: window.document, IS_REACT_ACT_ENVIRONMENT: true })
  let k = 0
  const random = t.mock.method(Math, 'random', () => draw(k++))
  const intervals: { callback: () => void; delay: number | undefined; id: object }[] = []
  const cleared: unknown[] = []
  t.mock.method(globalThis, 'setInterval', (callback: () => void, delay?: number) => {
    const id = { interval: intervals.length }
    intervals.push({ callback, delay, id })
    return id
  })
  t.mock.method(globalThis, 'clearInterval', (id: unknown) => {
    cleared.push(id)
  })
  const container = window.document.createElement('div')
  window.document.body.appendChild(container)
  const root = createRoot(container as unknown as Element)
  await act(async () => {
    root.render(<SynergyMatrix />)
  })
  let mounted = true
  const unmount = async () => {
    if (!mounted) return
    mounted = false
    await act(async () => {
      root.unmount()
    })
    await window.happyDOM.close()
    Reflect.deleteProperty(globalThis, 'window')
    Reflect.deleteProperty(globalThis, 'document')
  }
  t.after(unmount)
  const click = (el: DomElement) =>
    act(async () => {
      el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
    })
  const hook = (index: number) => {
    const key = Object.keys(container).find((name) => name.startsWith('__reactContainer$'))
    assert.ok(key)
    const find = (fiber: Fiber | null): Fiber | null => {
      for (let node = fiber; node; node = node.sibling) {
        if (node.type === SynergyMatrix) return node
        const inner = find(node.child)
        if (inner) return inner
      }
      return null
    }
    const current = (container as unknown as Record<string, Fiber>)[key].stateNode.current
    let state = find(current)?.memoizedState ?? null
    for (let i = 0; i < index; i++) state = state?.next ?? null
    assert.ok(state)
    return state.memoizedState
  }
  const cellGroups = () => [...svgsOf(container).matrix.children]
  const rectAt = (x: number, y: number) => {
    const rect = cellGroups()[x * SIZE + y].querySelector('rect')
    assert.ok(rect)
    return rect
  }
  return { window, container, random, intervals, cleared, unmount, click, hook, cellGroups, rectAt }
}

const assertIdle = (rect: DomElement & { style: { filter: string } }) => {
  assert.equal(rect.getAttribute('stroke'), IDLE_STROKE)
  assert.equal(rect.getAttribute('stroke-width'), '1')
  assert.equal(rect.getAttribute('class'), '')
  assert.equal(rect.style.filter, 'none')
}

const assertSelected = (rect: DomElement & { style: { filter: string } }) => {
  assert.equal(rect.getAttribute('stroke'), SELECTED_STROKE)
  assert.equal(rect.getAttribute('stroke-width'), '2')
  assert.equal(rect.getAttribute('class'), 'pulse-glow')
  assert.equal(rect.style.filter, SELECTED_FILTER)
}

const assertPanel = (root: DomElement, cell: Cell, max: number) => {
  const panel = panelOf(root)
  assert.ok(panel, 'selection panel is shown')
  assert.equal(panel.querySelector('h3')?.textContent, `Cell [${cell.x}, ${cell.y}]`)
  assert.equal(panel.querySelector('.text-2xl')?.textContent, cell.value.toFixed(3))
  assert.equal(panel.querySelector('.code-highlight .text-qpu-cyan')?.textContent, cell.value.toFixed(3))
  const bar = panel.querySelector('.h-full') as (DomElement & { style: { width: string } }) | null
  assert.ok(bar)
  assert.match(bar.style.width, /%$/)
  close(parseFloat(bar.style.width), (cell.value / max) * 100, 'strength bar width')
  assert.equal(statOf(panel, 'Base A:'), baseOf(cell.x).toFixed(2))
  assert.equal(statOf(panel, 'Base B:'), baseOf(cell.y).toFixed(2))
  assert.equal(statOf(panel, 'Alignment:'), '0.70-0.95')
  assert.equal(statOf(panel, 'Timing:'), '0.80-1.00')
}

test('server render happens before effects: empty 600px matrix, zero counts, no panel, flat histogram, fixed legend, no React warnings', (t) => {
  const errors = errorsOf(t)
  const html = renderToString(<SynergyMatrix />)
  assertNoErrors(errors)
  assert.match(html, new RegExp(`<svg width="${SIZE * CELL}" height="${SIZE * CELL}"></svg>`))
  const window = new Window({ url: 'http://localhost/' })
  t.after(() => window.happyDOM.close())
  const root = window.document.createElement('div')
  root.innerHTML = html
  const { matrix } = svgsOf(root)
  assert.equal(matrix.children.length, 0)
  assert.equal(statOf(root, 'Total Cells:'), '0')
  assert.equal(statOf(root, 'High Value Cells:'), '0')
  assert.equal(statOf(root, 'Median:'), '')
  assert.equal(panelOf(root), null)
  assertHistogram(root, new Array<number>(10).fill(0))
  const legend = [...root.querySelectorAll('.mt-6 .items-center')].map((row) => [
    (row.querySelector('.w-4') as (DomElement & { style: { backgroundColor: string } }) | null)?.style.backgroundColor,
    row.querySelector('span')?.textContent,
  ])
  assert.deepEqual(legend, [
    [LOW, 'Low (<0.3)'],
    [MEDIUM, 'Medium (0.3-0.6)'],
    [HIGH, 'High (0.6-0.8)'],
    [VERY_HIGH, 'Very High (>0.8)'],
  ])
})

test('mount generates the 15x15 matrix once: x-major order, value = Base(A) x Base(B) x Alignment x Timing from two Math.random draws per cell', async (t) => {
  const errors = errorsOf(t)
  const view = await mount(t, golden)
  const cells = expectedCells(golden)
  const { max } = summaryOf(cells)
  assert.equal(view.random.mock.callCount(), 2 * SIZE * SIZE)
  assert.deepEqual(structuredClone(view.hook(0)), cells)
  assert.equal(view.hook(1), null)
  const groups = view.cellGroups()
  assert.equal(groups.length, SIZE * SIZE)
  const buckets = new Map<string, number>()
  let labelled = 0
  groups.forEach((g, idx) => {
    const cell = cells[idx]
    assert.equal(cell.x, Math.floor(idx / SIZE))
    assert.equal(cell.y, idx % SIZE)
    assert.equal((g as DomElement & { style: { cursor: string } }).style.cursor, 'pointer')
    const rect = g.querySelector('rect') as DomElement & { style: { filter: string } }
    assert.equal(num(rect, 'x'), cell.x * CELL)
    assert.equal(num(rect, 'y'), cell.y * CELL)
    assert.equal(num(rect, 'width'), CELL - 1)
    assert.equal(num(rect, 'height'), CELL - 1)
    const fill = colorOf(cell.value, max)
    assert.equal(rect.getAttribute('fill'), fill, `cell ${cell.x},${cell.y} color`)
    buckets.set(fill, (buckets.get(fill) ?? 0) + 1)
    assertIdle(rect)
    const text = g.querySelector('text')
    if (cell.value > 0.35) {
      labelled++
      assert.ok(text, `cell ${cell.x},${cell.y} is labelled`)
      assert.equal(text.textContent, cell.value.toFixed(1))
      assert.equal(num(text, 'x'), cell.x * CELL + CELL / 2)
      assert.equal(num(text, 'y'), cell.y * CELL + CELL / 2)
      assert.equal(text.getAttribute('pointer-events'), 'none')
    } else {
      assert.equal(text, null, `cell ${cell.x},${cell.y} is unlabelled`)
    }
  })
  assert.deepEqual([...buckets.keys()].sort(), [HIGH, LOW, MEDIUM, VERY_HIGH].sort())
  assert.ok(labelled > 0 && labelled < SIZE * SIZE)
  assertNoErrors(errors)
})

test('Matrix Stats and Statistical Summary report count, max, mean, high-value count, median and min of the generated cells', async (t) => {
  const errors = errorsOf(t)
  const view = await mount(t, golden)
  const s = summaryOf(expectedCells(golden))
  assert.equal(statOf(view.container, 'Total Cells:'), String(SIZE * SIZE))
  assert.equal(statOf(view.container, 'Max Synergy:'), s.max.toFixed(2))
  assert.equal(statOf(view.container, 'Average:'), s.mean.toFixed(2))
  assert.equal(statOf(view.container, 'High Value Cells:'), String(s.high))
  assert.equal(statOf(view.container, 'Mean:'), s.mean.toFixed(3))
  assert.equal(statOf(view.container, 'Median:'), s.median.toFixed(3))
  assert.equal(statOf(view.container, 'Min:'), s.min.toFixed(3))
  assert.equal(statOf(view.container, 'Max:'), s.max.toFixed(3))
  assert.ok(s.high > 0 && s.high < SIZE * SIZE)
  assertNoErrors(errors)
})

test('histogram splits [0, max] into ten equal bins and accounts for every cell, the maximum included', async (t) => {
  const errors = errorsOf(t)
  const view = await mount(t, golden)
  const { values, max } = summaryOf(expectedCells(golden))
  const bins = binsOf(values, max)
  assert.deepEqual(bins, floorBinsOf(values, max))
  assert.equal(bins.reduce((a, b) => a + b, 0), SIZE * SIZE)
  assert.ok(bins[9] >= 1)
  assert.ok(bins.filter((count) => count > 0).length >= 5)
  assertHistogram(
    view.container,
    bins.map((count) => (count / (SIZE * SIZE)) * 120),
  )
  const heights = [...svgsOf(view.container).histogram.querySelectorAll('rect')].map((r) => num(r, 'height'))
  close(
    heights.reduce((a, b) => a + b, 0),
    120,
    'bars cover every cell',
  )
  assertNoErrors(errors)
})

test('clicking a cell highlights it and opens its panel with coordinates, strength, bar width and Base(A) from x, Base(B) from y', async (t) => {
  const errors = errorsOf(t)
  const view = await mount(t, golden)
  const cells = expectedCells(golden)
  const { max } = summaryOf(cells)
  assert.equal(panelOf(view.container), null)
  const target = cells[3 * SIZE + 11]
  assert.deepEqual([target.x, target.y], [3, 11])
  await view.click(view.rectAt(3, 11))
  assertSelected(view.rectAt(3, 11))
  assertPanel(view.container, target, max)
  assert.equal(statOf(panelOf(view.container)!, 'Base A:'), '0.60')
  assert.equal(statOf(panelOf(view.container)!, 'Base B:'), '0.87')
  assert.equal(view.hook(1), (view.hook(0) as Cell[])[3 * SIZE + 11])
  const highlighted = view.cellGroups().filter((g) => g.querySelector('rect')?.getAttribute('stroke-width') === '2')
  assert.equal(highlighted.length, 1)
  assertNoErrors(errors)
})

test('clicking the selected cell again clears the selection; clicking another cell moves it', async (t) => {
  const errors = errorsOf(t)
  const view = await mount(t, golden)
  const cells = expectedCells(golden)
  const { max } = summaryOf(cells)
  await view.click(view.rectAt(0, 0))
  assertPanel(view.container, cells[0], max)
  await view.click(view.rectAt(0, 0))
  assert.equal(panelOf(view.container), null)
  assertIdle(view.rectAt(0, 0))
  assert.equal(view.hook(1), null)
  await view.click(view.rectAt(14, 14))
  assertPanel(view.container, cells[SIZE * SIZE - 1], max)
  const label = view.cellGroups()[5 * SIZE + 2].querySelector('text') ?? view.rectAt(5, 2)
  await view.click(label)
  assertIdle(view.rectAt(14, 14))
  assertSelected(view.rectAt(5, 2))
  assertPanel(view.container, cells[5 * SIZE + 2], max)
  assert.equal(view.random.mock.callCount(), 2 * SIZE * SIZE)
  assertNoErrors(errors)
})

test('with Math.random at 0 every cell is 0.7 x 0.8 x Base(A) x Base(B); equal-valued mirror cells are still selected one at a time', async (t) => {
  const errors = errorsOf(t)
  const view = await mount(t, zero)
  const top = 0.7 * 0.8 * (29 / 30) ** 2
  const bottom = 0.7 * 0.8 * 0.25
  assert.equal(statOf(view.container, 'Max Synergy:'), top.toFixed(2))
  assert.equal(statOf(view.container, 'Max:'), top.toFixed(3))
  assert.equal(statOf(view.container, 'Min:'), bottom.toFixed(3))
  assert.equal(view.rectAt(0, 0).getAttribute('fill'), LOW)
  assert.equal(view.rectAt(14, 14).getAttribute('fill'), VERY_HIGH)
  const mirrored = view.hook(0) as Cell[]
  assert.equal(mirrored[0 * SIZE + 1].value, mirrored[1 * SIZE + 0].value)
  await view.click(view.rectAt(0, 1))
  assertSelected(view.rectAt(0, 1))
  assertIdle(view.rectAt(1, 0))
  assert.equal(panelOf(view.container)?.querySelector('h3')?.textContent, 'Cell [0, 1]')
  await view.click(view.rectAt(1, 0))
  assertSelected(view.rectAt(1, 0))
  assertIdle(view.rectAt(0, 1))
  assert.equal(panelOf(view.container)?.querySelector('h3')?.textContent, 'Cell [1, 0]')
  assertNoErrors(errors)
})

test('animation: one 50ms interval advances animationTime by one per tick modulo 360 without regenerating or deselecting, and is cleared on unmount', async (t) => {
  const errors = errorsOf(t)
  const view = await mount(t, golden)
  assert.equal(view.intervals.length, 1)
  const [interval] = view.intervals
  assert.equal(interval.delay, 50)
  assert.equal(view.hook(2), 0)
  await view.click(view.rectAt(7, 8))
  const before = view.container.innerHTML
  await act(async () => {
    interval.callback()
  })
  assert.equal(view.hook(2), 1)
  assert.equal(view.container.innerHTML, before)
  await act(async () => {
    for (let i = 0; i < 358; i++) interval.callback()
  })
  assert.equal(view.hook(2), 359)
  await act(async () => {
    interval.callback()
  })
  assert.equal(view.hook(2), 0)
  await act(async () => {
    interval.callback()
  })
  assert.equal(view.hook(2), 1)
  assertSelected(view.rectAt(7, 8))
  assert.equal(view.random.mock.callCount(), 2 * SIZE * SIZE)
  assert.equal(view.intervals.length, 1)
  assert.equal(view.cleared.includes(interval.id), false)
  await view.unmount()
  assert.deepEqual(
    view.cleared.filter((id) => id === interval.id),
    [interval.id],
  )
  assertNoErrors(errors)
})
