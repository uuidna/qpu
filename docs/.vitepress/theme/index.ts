// The theme: the default theme extended, every slot of its layout used, the surface's components registered globally, so a page
// is built from the referer's perspective (prev) and the program's (next) and the catch-all decides what the router did not.
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import Block from './components/Block.vue'
import Channel from './components/Channel.vue'
import Verify from './components/Verify.vue'
import Compile from './components/Compile.vue'
import AuraBar from './components/AuraBar.vue'
import CatchAll from './components/CatchAll.vue'
import HandleSearch from './components/HandleSearch.vue'
import Speak from './components/Speak.vue'
import Mode from './components/Mode.vue'
import Chat from './components/Chat.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // the web OS installs itself: the service worker keeps the shell and every page by content, and the MCP is asked first
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => { /* a browser that refuses is a browser; the pages still render */ }) })
    app.component('Block', Block)
    app.component('Channel', Channel)
    app.component('Verify', Verify)
    app.component('Compile', Compile)
    app.component('AuraBar', AuraBar)
    app.component('CatchAll', CatchAll)
    app.component('HandleSearch', HandleSearch)
    app.component('Speak', Speak)
    app.component('Mode', Mode)
    app.component('Chat', Chat)
  },
} satisfies Theme
