import type { Component } from 'vue'

type View = {
  default: Component
  slot?: string
  chrome?: Record<string, Record<string, unknown>>
  props?: Record<string, unknown>
}

export type ChromeItem = { name: string; component: Component; props: Record<string, unknown> }

export const views = import.meta.glob<View>('./**/*.vue', { eager: true })
const pages = import.meta.glob<View>('./views/**/*.vue', { eager: true })

export const fileOf = (path: string) => (path.split('/').pop() ?? '').replace(/\.vue$/i, '')
export const nameOf = (path: string) => fileOf(path).replace(/^Qpu/, '') || fileOf(path)

export const viewOf = (want: string, from: Record<string, View> = views) =>
  Object.entries(from).find(([path]) => nameOf(path) === want)?.[1]?.default

export const pascalOf = (seg: string) =>
  seg.split(/[-_]/).filter(Boolean).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('')

export const pageViewOf = (path: string) => {
  const seg = path.split('/').filter(Boolean)[0]
  if (!seg) return undefined
  return viewOf(pascalOf(seg), pages)
}

export const pagePropsOf = (path: string): Record<string, string> => {
  const n = path.split('/').filter(Boolean)[1]
  return n ? { n } : {}
}

const chromeSlotsOf = (mod: View): Record<string, Record<string, unknown>> => {
  const fromMod = mod.chrome ?? (mod.slot ? { [mod.slot]: mod.props ?? {} } : undefined)
  if (fromMod) return fromMod
  const comp = mod.default as { chrome?: Record<string, Record<string, unknown>> }
  return comp.chrome ?? {}
}

export const chromeOf = (): Record<string, ChromeItem[]> => {
  const map: Record<string, ChromeItem[]> = {}
  for (const [path, mod] of Object.entries(views)) {
    const name = nameOf(path)
    if (!name || name === 'Layout' || !mod?.default) continue
    for (const [slot, props] of Object.entries(chromeSlotsOf(mod))) {
      ;(map[slot] ??= []).push({ name, component: mod.default, props: props ?? {} })
    }
  }
  return map
}
