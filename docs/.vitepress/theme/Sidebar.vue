<script setup lang="ts">
defineOptions({ chrome: { 'sidebar-nav-before': {} } })
import { computed } from 'vue'
import { useData, useRoute, useRouter, withBase } from 'vitepress'

type ChromeGroup = { text: string; items: { text: string; link: string }[] }

const { theme } = useData()
const route = useRoute()
const router = useRouter()
const groups = computed(() => {
  const sidebar = theme.value.sidebar
  if (!sidebar || Array.isArray(sidebar)) return [] as ChromeGroup[]
  const path = route.path.replace(/\/$/, '') || '/'
  const map = sidebar as Record<string, ChromeGroup[]>
  return map[path] ?? map[route.path] ?? []
})

const hrefOf = (link: string) => link.startsWith('http') ? link : withBase(link)

const wants = (link: string) => {
  const path = link.split('#')[0] ?? link
  return route.path === path || route.path === `${path}/`
}

const go = (link: string) => {
  if (link.startsWith('http')) {
    window.location.assign(link)
    return
  }
  void router.go(withBase(link))
}
</script>

<template>
  <nav class="qpu-rail" aria-label="Hologram sidebar">
    <section v-for="g in groups" :key="g.text">
      <h3>{{ g.text }}</h3>
      <ul>
        <li v-for="it in g.items" :key="it.link">
          <a :href="hrefOf(it.link)" :class="{ wants: wants(it.link) }" @click.prevent="go(it.link)">{{ it.text }}</a>
        </li>
      </ul>
    </section>
  </nav>
</template>
