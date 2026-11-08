// Every Lean module is one UUID program. The filesystem places the handle.
// The next step rotates the program one place. The handle and the tail stay. Nothing is written.
import { birth, exists, read } from '../../../fs/index.ts'
import { next, uuid } from '../../index.ts'
import { program } from '../index.ts'

const ROOT = 'src/quantum/processing/unit/lean/Qpu.lean'

const sourceOf = (module: string) => module === 'Qpu' ? ROOT : `src/quantum/processing/unit/lean/${module.replaceAll('.', '/')}.lean`

const modulesOf = (text: string) => ['Qpu', ...[...text.matchAll(/^import (Qpu(?:\.[A-Za-z0-9]+)+)$/gm)].map((row) => row[1]!)]

/** All quantum UUID Lean programs, and the next step of each. */
export const leanPrograms = () => {
  const text = read(ROOT)
  if (text === null) throw new Error('the lean root names the programs')
  const rows = modulesOf(text).map((module) => {
    const source = sourceOf(module)
    const address = uuid(`lean\n${module}`)
    const handle = address.slice(0, 8)
    const installed = program(handle)
    const object = installed.object
    const born = birth(address)
    const stepped = next(address)
    const moved = birth(stepped.next)
    const placed = object.folders.join('') === handle && object.folders.length === 8 && installed.path === object.path && object.path === `${object.own}/index.ts` && installed.indexed === true && installed.depth === object.depth && object.fanout === 16 && object.span === '4294967296'
    const turned = stepped.kept === true && stepped.back === true && stepped.around === true && stepped.sealed === true && stepped.places === 10 && stepped.all === true && stepped.aspects.length === 4 && stepped.handle === handle && stepped.rotated === `${stepped.program.slice(1)}${stepped.program[0]}` && moved.path === born.path && moved.handle === born.handle && moved.dnode.bonus.tail.join() === born.dnode.bonus.tail.join() && born.checksum === address && born.path === object.path && born.birth.folders.join('') === address.replace(/-/g, '')
    return {
      module,
      source,
      present: exists(source),
      address,
      handle,
      path: object.path,
      depth: object.depth,
      program: stepped.program,
      rotated: stepped.rotated,
      next: stepped.next,
      places: stepped.places,
      kept: stepped.kept,
      back: stepped.back,
      around: stepped.around,
      sealed: stepped.sealed,
      aspects: stepped.aspects.length,
      witnessed: stepped.all === true,
      holds: placed && turned && exists(source),
    }
  })
  const names = new Set(rows.map((row) => row.module))
  const holds = text.includes('import Qpu.Shor') && rows.length > 1 && names.size === rows.length && rows.every((row) => row.holds)
  return {
    phase: 'programs' as const,
    via: 'lean' as const,
    quantum: true as const,
    atOnce: true as const,
    walked: false as const,
    fetched: false as const,
    written: false as const,
    executed: false as const,
    modules: rows.length,
    rows,
    holds,
    says: holds
      ? `${rows.length} lean programs. Each is the object of its handle. The next step rotates the program one place. The handle and the tail stay. Nothing is written.`
      : 'a lean program did not rotate',
  }
}
