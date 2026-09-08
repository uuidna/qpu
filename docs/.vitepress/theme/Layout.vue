<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { computed, onMounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data } from '../hologram.data.ts'
import { chromeOf, pagePropsOf, pageViewOf } from './autoload.ts'

const { Layout } = DefaultTheme
const { frontmatter, isDark } = useData()
const route = useRoute()
const isHome = computed(() => frontmatter.value.layout === 'home')
const og = data.og
const PageView = computed(() => pageViewOf(route.path))
const pageProps = computed(() => pagePropsOf(route.path))
const chrome = chromeOf()
const root = chrome.root ?? []
const slotted = Object.fromEntries(Object.entries(chrome).filter(([slot]) => slot !== 'root'))

const paint = () => {
  if (typeof document === 'undefined') return
  const rootEl = document.documentElement
  for (const [k, v] of Object.entries(data.tokens)) rootEl.style.setProperty(k, v)
  rootEl.dataset.qpu = 'hologram'
  rootEl.dataset.computer = 'qpu'
  rootEl.dataset.firmware = 'vitepress'
  rootEl.dataset.engine = 'qpu'
  const m = /^\/face\/(\d+)/.exec(route.path)
  if (m) rootEl.style.setProperty('--qpu-face', m[1]!)
  else rootEl.style.removeProperty('--qpu-face')
  rootEl.dataset.theme = isDark.value ? 'dark' : 'light'
  rootEl.dataset.mode = isDark.value ? 'dark' : 'light'
  rootEl.style.colorScheme = isDark.value ? 'dark' : 'light'
}

onMounted(paint)
watch(() => route.path, paint)
watch(isDark, paint)
</script>

<template>
  <div class="qpu-engine" data-computer="qpu" data-engine="qpu" data-firmware="vitepress">
    <component :is="c.component" v-for="c in root" :key="c.name" v-bind="c.props" />
    <Layout class="qpu-singularity" :data-qpu-home="isHome ? '1' : '0'">
      <template v-for="(items, slot) in slotted" :key="slot" #[slot]>
        <component :is="c.component" v-for="c in items" :key="c.name" v-bind="c.props" />
      </template>
      <template #nav-bar-title-after>
        <span class="qpu-seat-pill">{{ frontmatter.layout === 'home' ? data.seat.seat : '' }}</span>
      </template>
      <template #home-hero-image>
        <img class="qpu-og-hero" :src="og.path" :alt="og.alt" :width="og.width" :height="og.height" />
      </template>
      <template #home-hero-info-after>
        <p class="qpu-hero-count">Fourteen VE faces. Referer picks the door.</p>
      </template>
      <template #doc-before>
        <component :is="PageView" v-bind="pageProps" />
      </template>
    </Layout>
  </div>
</template>
