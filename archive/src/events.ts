// events — fourteen UI event kinds occupy the VE faces. Capture imprints; never preventDefault.
// Desk wiring. Numbers and addresses. Hardware QPU lane stays empty.
import { VE_FACES, qpuFacesOf, qpuSeatOf } from './hologram.js'

/** W3C UI event kinds named in qpu_live_and_ui_are_ve_faces. Length is VE faces. */
export const QPU_EVENT_KINDS = [
  'pointer',
  'keyboard',
  'wheel',
  'input',
  'focus',
  'composition',
  'clipboard',
  'drag',
  'touch',
  'scroll',
  'window',
  'history',
  'visibility',
  'device',
] as const

export type QpuEventKind = (typeof QPU_EVENT_KINDS)[number]

/** DOM types this firmware listens for. Capture, passive — the movie imprints, the page still handles. */
export const QPU_EVENT_LISTEN = [
  'pointerdown', 'pointerup', 'pointermove', 'click',
  'keydown', 'keyup',
  'wheel',
  'input', 'change',
  'focus', 'blur',
  'compositionstart', 'compositionend',
  'copy', 'cut', 'paste',
  'dragstart', 'drop',
  'touchstart', 'touchend',
  'scroll',
  'resize',
  'popstate', 'hashchange',
  'visibilitychange',
  'deviceorientation', 'devicemotion',
] as const

const KIND_OF: Record<string, QpuEventKind> = {
  pointerdown: 'pointer', pointerup: 'pointer', pointermove: 'pointer', click: 'pointer',
  keydown: 'keyboard', keyup: 'keyboard',
  wheel: 'wheel',
  input: 'input', change: 'input',
  focus: 'focus', blur: 'focus',
  compositionstart: 'composition', compositionend: 'composition',
  copy: 'clipboard', cut: 'clipboard', paste: 'clipboard',
  dragstart: 'drag', drop: 'drag',
  touchstart: 'touch', touchend: 'touch',
  scroll: 'scroll',
  resize: 'window',
  popstate: 'history', hashchange: 'history',
  visibilitychange: 'visibility',
  deviceorientation: 'device', devicemotion: 'device',
}

export const qpuEventsOf = () => {
  const faces = qpuFacesOf()
  return QPU_EVENT_KINDS.map((kind, i) => {
    const face = faces[i]!
    return { kind, face: face.face, opposite: face.opposite }
  })
}

export const qpuEventOf = (type: string) => {
  const kind = KIND_OF[type]
  if (!kind) return { ok: false as const, type, kind: undefined, face: undefined, opposite: undefined }
  const row = qpuEventsOf().find((e) => e.kind === kind)!
  return { ok: true as const, type, kind: row.kind, face: row.face, opposite: row.opposite }
}

export const qpuEventsHolds = (): boolean => {
  const rows = qpuEventsOf()
  const kinds = new Set(QPU_EVENT_KINDS)
  const mapped = new Set(Object.values(KIND_OF))
  return (
    QPU_EVENT_KINDS.length === VE_FACES &&
    kinds.size === VE_FACES &&
    rows.length === VE_FACES &&
    rows.every((e, i) => e.face === i) &&
    mapped.size === VE_FACES &&
    QPU_EVENT_LISTEN.every((t) => KIND_OF[t] != null) &&
    qpuSeatOf().seat === 'empty'
  )
}
