// Filesystem adapters, chosen the way the Payload adapters are chosen: the first one its environment names, else the one that always answers.
// programs is the ZFS object set. documents is binding 0. io is the local node filesystem.

import hex from '../../../../../../../../a/0/2/2/a/9/7/7/index.ts'
import node from '../../../../../../../../8/0/e/5/a/1/4/1/index.ts'
import zfs from '../../../../../../../../e/3/3/2/3/2/9/c/index.ts'

type Adapter<T> = { pkg: string; named: () => boolean; make: () => T }

type Parts = { programs: typeof zfs; documents: typeof hex; io: typeof node }

export const ADAPTERS: { [Part in keyof Parts]: Adapter<Parts[Part]>[] } = {
  programs: [{ pkg: 'zfs', named: () => true, make: () => zfs }],
  documents: [{ pkg: 'hex', named: () => true, make: () => hex }],
  io: [{ pkg: 'node', named: () => true, make: () => node }],
}

export const chosen = <Part extends keyof Parts>(part: Part): Parts[Part] => {
  const adapters: Adapter<Parts[Part]>[] = ADAPTERS[part]
  const hit = adapters.find((adapter) => adapter.named())
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


const fs = { adapters: ADAPTERS, chosen, place, birth, documentPath, read, write, rename, list, exists }
export default fs
