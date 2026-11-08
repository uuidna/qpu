// Filesystem adapters, chosen the way the Payload adapters are chosen: the first one its environment names, else the one that always answers.
// programs is the ZFS object set. documents is binding 0. io is the local node filesystem.

import hex from './hex/index.ts'
import node from './node/index.ts'
import zfs from './zfs/index.ts'

type Adapter<T> = { pkg: string; named: () => boolean; make: () => T }

export const ADAPTERS = {
  programs: [{ pkg: 'zfs', named: () => true, make: () => zfs }] as Adapter<typeof zfs>[],
  documents: [{ pkg: 'hex', named: () => true, make: () => hex }] as Adapter<typeof hex>[],
  io: [{ pkg: 'node', named: () => true, make: () => node }] as Adapter<typeof node>[],
}

export const chosen = <Part extends keyof typeof ADAPTERS>(part: Part) => {
  const hit = ADAPTERS[part].find((adapter) => adapter.named())
  if (!hit) throw new Error(`${part} has no filesystem adapter`)
  return hit.make()
}

export const place = (handle: string) => chosen('programs').object(handle)
export const birth = (id: string) => chosen('programs').birth(id)
export const documentPath = (id: string) => chosen('documents').path(id)
export const read = (file: string) => chosen('io').read(file)
export const write = (file: string, text: string) => chosen('io').write(file, text)
export const rename = (from: string, to: string) => chosen('io').rename(from, to)
export const list = (dir: string) => chosen('io').list(dir)
export const exists = (file: string) => chosen('io').exists(file)

export { fsPlugin as plugin } from '../plugin.ts'

const fs = { adapters: ADAPTERS, chosen, place, birth, documentPath, read, write, rename, list, exists }
export default fs
