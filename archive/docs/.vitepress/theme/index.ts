import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nameOf, viewOf, views } from './autoload.ts'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: viewOf('Layout') ?? DefaultTheme.Layout,
  enhanceApp({ app }) {
    for (const [path, mod] of Object.entries(views)) {
      const name = nameOf(path)
      if (!name || name === 'Layout' || !mod?.default) continue
      app.component(name, mod.default)
    }
    app.mixin({
      computed: {
        reading() {
          return (this as { $frontmatter?: { reading?: unknown } }).$frontmatter?.reading
        },
      },
    })
  },
} satisfies Theme
