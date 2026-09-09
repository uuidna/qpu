import { loadHologramOf } from '../.vitepress/hologram.data.ts'

export default {
  paths() {
    return loadHologramOf().faces.map((f) => ({
      params: { n: String(f.face), opposite: String(f.opposite) },
    }))
  },
}
