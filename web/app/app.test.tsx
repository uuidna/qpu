import { test, type TestContext } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, matchesGlob } from 'node:path'
import { act } from 'react'
import { createRoot, hydrateRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { Window } from 'happy-dom'
import tailwindConfig from '../tailwind.config.js'
import Home from './page'
import RootLayout, { metadata } from './layout'

const TABS = [
  { id: 'combinatorial', label: '🌐 Combinatorial Graph', heading: 'Combinatorial System Network' },
  { id: 'formulas', label: '📐 Formula Animations', heading: 'Formula-Driven Animations' },
  { id: 'waves', label: '🌊 Wave Progress', heading: 'Wave-Based Continuous Improvement' },
  { id: 'metrics', label: '📊 Metrics Flow', heading: 'Metrics Flow Visualization' },
  { id: 'synergy', label: '⚡ Synergy Matrix', heading: 'Synergy Matrix Visualization' },
]
const TAB_BASE = ['px-4', 'py-3', 'whitespace-nowrap', 'transition-colors']
const TAB_ACTIVE = [...TAB_BASE, 'text-qpu-purple', 'border-b-2', 'border-qpu-purple']
const TAB_IDLE = [...TAB_BASE, 'text-qpu-cyan/60', 'hover:text-qpu-cyan']
const TITLE = 'UUIDNA QPU: Combinatorial Graph Explorer'
const SUBTITLE = 'Visualizing 50+ systems, 256+ synergies, and emergent patterns through animated formulas'
const FOOTER = ['All animations are computed from mathematical formulas in real-time', 'Based on UUIDNA QPU: Combinatorial Perspectives & Formula Applications']
const HTML_OPEN = '<html lang="en" class="scroll-smooth"><head></head><body class="bg-qpu-dark text-white overflow-x-hidden">'
const HTML_CLOSE = '</body></html>'

type Node = { children: ArrayLike<any>; querySelectorAll(selector: string): ArrayLike<any>; querySelector(selector: string): any; textContent: string | null }

const parse = (html: string) => {
  const window = new Window({ url: 'http://localhost/' })
  window.document.body.innerHTML = html
  return window
}

const classesOf = (el: { getAttribute(name: string): string | null }) => (el.getAttribute('class') ?? '').split(/\s+/).filter(Boolean)

const sections = (root: Node) => {
  const [grid, header, nav, content, footer, ...rest] = Array.from(root.children)
  assert.equal(rest.length, 0)
  return { grid, header, nav, content, footer }
}

const expectActive = (nav: Node, activeId: string) => {
  const buttons = Array.from(nav.querySelectorAll('button'))
  assert.deepEqual(
    buttons.map((button) => button.textContent),
    TABS.map((tab) => tab.label),
  )
  buttons.forEach((button, index) => {
    const expected = TABS[index].id === activeId ? TAB_ACTIVE : TAB_IDLE
    assert.deepEqual(classesOf(button), expected, `${TABS[index].id} while ${activeId} is active`)
  })
}

const expectShowing = (content: Node, heading: string) => {
  const headings = Array.from(content.querySelectorAll('h2')).map((h2) => h2.textContent)
  assert.deepEqual(headings, [heading])
  for (const other of TABS.filter((tab) => tab.heading !== heading)) assert.ok(!(content.textContent ?? '').includes(other.heading), `${other.heading} must not be mounted`)
}

const expectChrome = (root: Node) => {
  const { grid, header, nav, content, footer } = sections(root)
  assert.deepEqual(classesOf(grid), ['animated-grid'])
  assert.equal(grid.children.length, 0)
  assert.equal(header.querySelector('h1').textContent, TITLE)
  assert.equal(header.querySelector('p').textContent, SUBTITLE)
  assert.deepEqual(
    Array.from(footer.querySelectorAll('p')).map((p) => p.textContent),
    FOOTER,
  )
  for (const layer of [header, nav, content, footer]) {
    const classes = classesOf(layer)
    assert.ok(classes.includes('relative') && classes.includes('z-10'), classes.join(' '))
  }
  assert.ok(classesOf(nav).includes('sticky') && classesOf(nav).includes('top-0'))
  return { nav, content }
}

const mountDom = (t: TestContext) => {
  const window = new Window({ url: 'http://localhost/' })
  const scope = globalThis as Record<string, unknown>
  const saved = { window: scope.window, document: scope.document, IS_REACT_ACT_ENVIRONMENT: scope.IS_REACT_ACT_ENVIRONMENT }
  Object.assign(scope, { window, document: window.document, IS_REACT_ACT_ENVIRONMENT: true })
  const live = new Map<number, { fn: () => void; ms: number }>()
  let issued = 0
  t.mock.method(globalThis, 'setInterval', ((fn: () => void, ms: number) => {
    issued += 1
    live.set(issued, { fn, ms })
    return issued
  }) as unknown as typeof setInterval)
  t.mock.method(globalThis, 'clearInterval', ((id: number) => {
    live.delete(id)
  }) as unknown as typeof clearInterval)
  t.mock.method(Math, 'random', () => 0)
  const container = window.document.createElement('div')
  window.document.body.appendChild(container)
  const click = async (label: string) => {
    const button = Array.from(container.querySelectorAll('button')).find((candidate) => candidate.textContent === label)
    assert.ok(button, label)
    await act(async () => {
      button.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
    })
  }
  const page = () => container.children[0] as unknown as Node
  const close = async (root: Root) => {
    await act(async () => root.unmount())
    await window.happyDOM.close()
    Object.assign(scope, saved)
  }
  return { window, container, live, click, page, close }
}

test('metadata names the visualizer and describes it', () => {
  assert.deepEqual(
    { ...metadata },
    {
      title: 'UUIDNA QPU: Combinatorial Graph Visualizer',
      description: 'Interactive visualization of 50+ systems, formulas, and emergent patterns',
    },
  )
})

test('RootLayout wraps a single child in an English, smooth-scrolling document with a styled body', () => {
  const inner = '<main id="probe">child</main>'
  const html = renderToStaticMarkup(
    <RootLayout>
      <main id="probe">child</main>
    </RootLayout>,
  )
  assert.equal(html, `${HTML_OPEN}${inner}${HTML_CLOSE}`)
})

test('RootLayout keeps several children, text included, in their order', () => {
  const html = renderToStaticMarkup(
    <RootLayout>
      <header>a</header>
      {'plain'}
      <footer>b</footer>
    </RootLayout>,
  )
  assert.equal(html, `${HTML_OPEN}<header>a</header>plain<footer>b</footer>${HTML_CLOSE}`)
})

test('RootLayout renders an empty body when given no children', () => {
  assert.equal(renderToStaticMarkup(<RootLayout>{null}</RootLayout>), `${HTML_OPEN}${HTML_CLOSE}`)
  assert.equal(renderToStaticMarkup(<RootLayout>{undefined}</RootLayout>), `${HTML_OPEN}${HTML_CLOSE}`)
})

test('RootLayout around Home puts the whole page, untouched, inside the body', () => {
  const page = renderToStaticMarkup(<Home />)
  assert.equal(
    renderToStaticMarkup(
      <RootLayout>
        <Home />
      </RootLayout>,
    ),
    `${HTML_OPEN}${page}${HTML_CLOSE}`,
  )
})

test('Home server-renders header, five tabs with combinatorial active, the loading visualizer and the footer', (t) => {
  const errors = t.mock.method(console, 'error', () => {})
  const html = renderToStaticMarkup(<Home />)
  assert.equal(errors.mock.callCount(), 0)
  const window = parse(html)
  const roots = Array.from(window.document.body.children)
  assert.equal(roots.length, 1)
  assert.deepEqual(classesOf(roots[0]), ['relative', 'w-full', 'min-h-screen', 'bg-qpu-dark', 'text-white', 'overflow-hidden'])
  const { nav, content } = expectChrome(roots[0] as unknown as Node)
  expectActive(nav as Node, 'combinatorial')
  assert.equal(content.innerHTML, '<div>Loading...</div>')
  for (const tab of TABS) assert.ok(!content.textContent.includes(tab.heading))
  assert.equal(renderToString(<Home />).replace(/<!-- -->/g, ''), html)
})

test('every qpu colour the page and layout use is defined in the tailwind theme, and tailwind scans app/', () => {
  const colors = Object.keys(tailwindConfig.theme.extend.colors)
  const window = parse(renderToStaticMarkup(<Home />))
  const root = window.document.body.children[0]
  const content = root.children[3]
  const chrome = [root, ...Array.from(root.querySelectorAll('*')).filter((el) => !content.contains(el) || el === content)]
  const layoutHtml = renderToStaticMarkup(<RootLayout>{null}</RootLayout>)
  const tokens = [...chrome.flatMap((el) => classesOf(el)), ...[...layoutHtml.matchAll(/class="([^"]*)"/g)].flatMap((match) => match[1].split(' '))]
  const used = new Set(tokens.flatMap((token) => [...token.matchAll(/(qpu-[a-z]+)/g)].map((match) => match[1])))
  assert.deepEqual([...used].sort(), ['qpu-blue', 'qpu-cyan', 'qpu-dark', 'qpu-purple'])
  for (const name of used) assert.ok(colors.includes(name), name)
  const scanned = (file: string) => tailwindConfig.content.some((pattern: string) => matchesGlob(file, pattern))
  assert.ok(scanned('./app/page.tsx'))
  assert.ok(scanned('./app/layout.tsx'))
})

test('the animated grid the page renders is a fixed, click-through layer beneath the z-10 sections in the stylesheet layout imports', () => {
  const css = readFileSync(join(import.meta.dirname, 'globals.css'), 'utf8')
  const block = css.match(/\.animated-grid\s*\{([^}]*)\}/)
  assert.ok(block)
  const rules = Object.fromEntries(
    block[1]
      .split(';')
      .map((rule) => rule.split(':').map((part) => part.trim()))
      .filter((pair) => pair.length >= 2 && pair[0]),
  )
  assert.equal(rules.position, 'fixed')
  assert.equal(rules.inset, '0')
  assert.equal(rules['pointer-events'], 'none')
  assert.ok(Number(rules['z-index']) < 10)
})

test('Home mounts the combinatorial visualizer by default with exactly one running timer', async (t) => {
  const dom = mountDom(t)
  const root = createRoot(dom.container as unknown as Element)
  await act(async () => root.render(<Home />))
  const { nav, content } = expectChrome(dom.page())
  expectActive(nav, 'combinatorial')
  expectShowing(content, 'Combinatorial System Network')
  assert.equal(dom.live.size, 1)
  await dom.close(root)
  assert.equal(dom.live.size, 0)
})

test('every tab-to-tab click, including re-clicking the active tab, shows only the clicked visualizer', async (t) => {
  const dom = mountDom(t)
  const root = createRoot(dom.container as unknown as Element)
  await act(async () => root.render(<Home />))
  for (const from of TABS) {
    for (const to of TABS) {
      await dom.click(from.label)
      await dom.click(to.label)
      const { nav, content } = expectChrome(dom.page())
      expectActive(nav, to.id)
      expectShowing(content, to.heading)
      assert.equal(dom.live.size, 1, `${from.id} -> ${to.id} leaves one timer`)
    }
  }
  await dom.close(root)
  assert.equal(dom.live.size, 0)
})

test('the visualizer timers ticking never move the chosen tab', async (t) => {
  const dom = mountDom(t)
  const root = createRoot(dom.container as unknown as Element)
  await act(async () => root.render(<Home />))
  for (const tab of [...TABS].reverse()) {
    await dom.click(tab.label)
    const [timer] = [...dom.live.values()]
    await act(async () => {
      timer.fn()
      timer.fn()
      timer.fn()
    })
    const { nav, content } = expectChrome(dom.page())
    expectActive(nav, tab.id)
    expectShowing(content, tab.heading)
  }
  await dom.close(root)
})

test('Home hydrates its server markup without mismatches and then switches tabs', async (t) => {
  const dom = mountDom(t)
  const recoverable: unknown[] = []
  const errors = t.mock.method(console, 'error', () => {})
  dom.container.innerHTML = renderToString(<Home />)
  let root: Root | undefined
  await act(async () => {
    root = hydrateRoot(dom.container as unknown as Element, <Home />, { onRecoverableError: (error) => recoverable.push(error) })
  })
  assert.deepEqual(recoverable, [])
  assert.equal(errors.mock.callCount(), 0)
  expectShowing(expectChrome(dom.page()).content, 'Combinatorial System Network')
  await dom.click(TABS[2].label)
  const { nav, content } = expectChrome(dom.page())
  expectActive(nav, 'waves')
  expectShowing(content, 'Wave-Based Continuous Improvement')
  await dom.close(root as Root)
})
