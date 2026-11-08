// The shadcn registry, saved. Each component is one UUID program.
// The handle is the hex colour. The program and the three params build the UI. The tail verifies it.
// An I Ching rosetta (eight trigrams by eight) opens a component. Nothing is fetched and nothing is written.
import { channel, composition, compositionIndex, hexbit, rosetta, seal, style, uuid, uuidQubits } from '../../index.ts'
import { program } from '../index.ts'

export const SHADCN_MCP = {
  name: 'shadcn' as const,
  command: 'npx' as const,
  args: ['shadcn@latest', 'mcp'] as const,
  registry: 'https://ui.shadcn.com/r/index.json' as const,
  create: 'https://ui.shadcn.com/create' as const,
}

/** The registry:ui items of https://ui.shadcn.com/r/index.json, in the order the registry lists them. */
export const SHADCN_COMPONENTS = [
  'accordion', 'alert', 'alert-dialog', 'aspect-ratio', 'attachment', 'avatar', 'badge', 'breadcrumb', 'bubble', 'button',
  'button-group', 'calendar', 'card', 'carousel', 'chart', 'checkbox', 'code-block', 'collapsible', 'combobox', 'command',
  'context-menu', 'dialog', 'direction', 'drawer', 'dropdown-menu', 'empty', 'field', 'form', 'hover-card', 'input',
  'input-group', 'input-otp', 'item', 'kbd', 'label', 'marker', 'menubar', 'message', 'message-scroller', 'native-select',
  'navigation-menu', 'pagination', 'popover', 'progress', 'questionnaire', 'radio-group', 'resizable', 'scroll-area', 'select', 'separator',
  'sheet', 'sidebar', 'skeleton', 'slider', 'sonner', 'spinner', 'switch', 'table', 'tabs', 'textarea',
  'toast', 'toggle', 'toggle-group', 'tooltip', 'trace',
] as const

/** Fu Xi order. The low bit is the bottom line. */
const TRIGRAMS = ['kun', 'zhen', 'kan', 'dui', 'gen', 'li', 'xun', 'qian'] as const

const linesOf = (value: number) => [value & 1, (value >> 1) & 1, (value >> 2) & 1] as const

const movedTail = (address: string) => {
  const body = address.replace(/-/g, '')
  const at = 31
  const nibble = (parseInt(body[at]!, 16) + 1) % 16
  const flipped = `${body.slice(0, at)}${nibble.toString(16)}${body.slice(at + 1)}`
  return `${flipped.slice(0, 8)}-${flipped.slice(8, 12)}-${flipped.slice(12, 16)}-${flipped.slice(16, 20)}-${flipped.slice(20)}`
}

const paint = (address: string, content: string, name: string) => {
  const ch = channel(address)
  const color = `#${ch.handle}`
  const written = ch.params.map((n) => n.toString(16).padStart(4, '0')).join('')
  const lower = ch.program[0]! % 8
  const upper = ch.program[1]! % 8
  const cell = compositionIndex([8, 8], [upper, lower])
  const grid = rosetta([8, 8])
  const across = grid.to(cell)
  const sum = ch.program.reduce((n, digit) => n + digit, 0)
  const root = SHADCN_COMPONENTS[(ch.params[0]! + sum) % SHADCN_COMPONENTS.length]!
  const parts = ch.program.map((nibble, at) => {
    const param = ch.params[at % 3]!
    const trigram = nibble % 8
    return { at, nibble, param, name: SHADCN_COMPONENTS[(nibble + param) % SHADCN_COMPONENTS.length]!, trigram: TRIGRAMS[trigram]!, lines: linesOf(trigram) }
  })
  const caught = uuid(content) !== movedTail(address)
  const verified = color === `#${ch.handle}` && ch.handle.length === 8 && written === ch.tail && ch.params.length === 3 && ch.program.length === 10 && ch.validation.holds && uuid(content) === address && seal(address).valid && caught
  const css = `--qpu-hex: ${color}; color: var(--qpu-hex); border-left: 3px solid var(--qpu-hex)`
  const slots = parts.map((part) => `<span data-shadcn="${part.name}" data-trigram="${part.trigram}" data-nibble="${part.nibble}"></span>`).join('')
  const html = `<div data-create="${SHADCN_MCP.create}" data-component="${name}" data-built="${root}" data-handle="${ch.handle}" data-tail="${ch.tail}" data-verified="${verified}" style="${css}">${slots}</div>`
  return {
    color,
    handle: ch.handle,
    program: ch.program,
    params: [ch.params[0]!, ch.params[1]!, ch.params[2]!] as const,
    tail: ch.tail,
    written,
    built: root,
    parts,
    iching: {
      lower: TRIGRAMS[lower]!,
      upper: TRIGRAMS[upper]!,
      lines: [...linesOf(lower), ...linesOf(upper)] as const,
      cell: cell.toString(),
      to: across.toString(),
      back: grid.from(across).toString(),
      covers: grid.from(across) === cell,
    },
    css,
    html,
    verified,
  }
}

const rowOf = (name: string, content: string) => {
  const address = uuid(content)
  const handle = address.slice(0, 8)
  const installed = program(handle)
  const ui = paint(address, content, name)
  const placed = installed.indexed === true && installed.depth === 7 && installed.path === `src/quantum/uuid/programs/${[...handle].join('/')}/index.ts`
  return {
    name,
    address,
    handle,
    color: ui.color,
    program: ui.program,
    params: ui.params,
    tail: ui.tail,
    path: installed.path,
    depth: installed.depth,
    built: ui.built,
    parts: ui.parts,
    iching: ui.iching,
    css: ui.css,
    html: ui.html,
    verified: ui.verified && placed && ui.iching.covers,
  }
}

const openAt = (index: bigint) => {
  const space = rosetta([SHADCN_COMPONENTS.length, 8, 8])
  const scale = space.scale
  const at = ((index % scale) + scale) % scale
  const digits = composition([SHADCN_COMPONENTS.length, 8, 8], at)
  const name = SHADCN_COMPONENTS[digits[0]!]!
  const upper = digits[1]!
  const lower = digits[2]!
  const content = `shadcn\n${name}\n${upper}\n${lower}`
  const across = space.to(at)
  const row = rowOf(name, content)
  const styled = style(row.address)
  const css = `${styled.css}; ${row.css}`
  const html = row.html.replace(`style="${row.css}"`, `style="${css}"`)
  return {
    ...row,
    css,
    html,
    index: at.toString(),
    upper: TRIGRAMS[upper]!,
    lower: TRIGRAMS[lower]!,
    to: across.toString(),
    back: space.from(across).toString(),
    covers: space.from(across) === at && row.iching.covers,
    verified: row.verified && space.from(across) === at && css.includes('--qpu-c:') && css.includes(`--qpu-hex: ${row.color}`),
  }
}

/** One address, the whole register. The program index is read in one teleport. The 16^10 space is not walked. At zero temperature the Landauer cost is zero. */
const capacityOf = (address: string) => {
  const counted = uuidQubits(4)
  const moved = hexbit(address, 4)
  const cold = counted.organised.zero
  const holds = moved.utilisation.holds && moved.utilisation.left === 0 && moved.utilisation.used === moved.effective && moved.zero.temperatureK === 0 && moved.zero.landauer === '0' && moved.speed.walked === false && moved.speed.reads === 10 && moved.speed.teleport === 1 && cold.left === 0 && cold.temperatureK === 0 && cold.landauer === '0' && cold.walked === false && counted.receipt.holds
  return {
    address,
    iso: counted.receipt.standards,
    clause: counted.receipt.isoClause,
    process: counted.receipt.process,
    hexbit: 4 as const,
    effective: moved.effective,
    used: moved.utilisation.used,
    left: moved.utilisation.left,
    temperatureK: moved.zero.temperatureK,
    landauer: moved.zero.landauer,
    joules: moved.zero.landauer,
    kWh: moved.zero.landauer,
    walked: moved.speed.walked,
    reads: moved.speed.reads,
    teleport: moved.speed.teleport,
    space: moved.speed.space,
    holds,
  }
}

/** Every saved shadcn component as the UUID program of its name. An index opens one cell of the I Ching rosetta. */
export const shadcnPrograms = (index?: string) => {
  const rows = SHADCN_COMPONENTS.map((name) => rowOf(name, `shadcn\n${name}`))
  const space = rosetta([SHADCN_COMPONENTS.length, 8, 8])
  const opened = index === undefined ? null : openAt(BigInt(index))
  const coin = opened?.address ?? uuid(`shadcn\n${SHADCN_COMPONENTS.join('\n')}`)
  const capacity = capacityOf(coin)
  const covered = space.from(space.to(0n)) === 0n && space.scale === BigInt(SHADCN_COMPONENTS.length) * 64n
  const holds = rows.length === SHADCN_COMPONENTS.length
    && rows.every((row) => row.verified && row.color === `#${row.handle}` && row.program.length === 10 && row.params.length === 3 && row.tail === row.params.map((n) => n.toString(16).padStart(4, '0')).join('') && row.css.includes(`--qpu-hex: ${row.color}`) && row.html.includes(`data-create="${SHADCN_MCP.create}"`) && row.html.includes(`data-component="${row.name}"`))
    && covered
    && capacity.holds
    && (opened === null || (opened.verified && opened.covers && opened.back === opened.index))
  return {
    phase: 'shadcn' as const,
    saved: true as const,
    written: false as const,
    fetched: false as const,
    mcp: SHADCN_MCP,
    create: SHADCN_MCP.create,
    components: rows.length,
    iching: { trigrams: 8 as const, hexagrams: 64 as const, radices: [SHADCN_COMPONENTS.length, 8, 8] as const, scale: space.scale.toString(), order: space.order, walked: false as const },
    capacity,
    rows,
    opened,
    holds,
    says: holds
      ? `${rows.length} shadcn components, each a UUID program. The handle is the hex colour. The program and the params build the UI. The tail verifies it. The register is full (${capacity.used} of ${capacity.effective}), the space is not walked, and at ${capacity.temperatureK} K the Landauer cost is ${capacity.landauer}.`
      : 'a shadcn program did not verify',
  }
}
