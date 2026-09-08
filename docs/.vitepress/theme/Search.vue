<script setup lang="ts">
defineOptions({ chrome: { 'nav-bar-content-after': {} } })
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter, withBase } from 'vitepress'
import { data, searchOf, type HologramData } from '../hologram.data.ts'

const q = ref('')
const site = ref('')
const open = ref(false)
const hits = ref<HologramData['searchIndex']>([])
const sites = ref<{ host: string; hits: number }[]>([])
const indexed = ref(0)
const input = ref<HTMLInputElement | null>(null)
const router = useRouter()
const hrefOf = (link: string) => link.startsWith('http') ? link : withBase(link)

const run = () => {
  const found = searchOf(q.value, {
    site: site.value || undefined,
  })
  hits.value = found.hits
  sites.value = found.analyzed.sites
  indexed.value = found.analyzed.indexed
  open.value = q.value.trim().length > 0
}

const facets = computed(() => sites.value.slice(0, 8))
const empty = computed(() => open.value && hits.value.length === 0)

const go = (link: string) => {
  hits.value = []
  q.value = ''
  open.value = false
  if (link.startsWith('http')) {
    window.location.assign(link)
    return
  }
  void router.go(withBase(link))
}

const pinSite = (host: string) => {
  site.value = site.value === host ? '' : host
  run()
}

const onKey = (ev: KeyboardEvent) => {
  if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
    ev.preventDefault()
    input.value?.focus()
  }
  if (ev.key === 'Escape' && open.value) {
    open.value = false
    q.value = ''
    hits.value = []
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="qpu-search qpu-command">
    <label class="qpu-command-label" for="qpu-search-q">Search</label>
    <input
      id="qpu-search-q"
      ref="input"
      v-model="q"
      type="search"
      autocomplete="off"
      aria-describedby="qpu-search-hint"
      aria-controls="qpu-search-hits"
      :aria-expanded="open ? 'true' : 'false'"
      aria-autocomplete="list"
      placeholder="site · plane · key"
      @input="run"
    >
    <kbd class="qpu-command-kbd" aria-hidden="true">⌘K</kbd>
    <p id="qpu-search-hint" class="qpu-command-hint">Constructors only. Every query token must appear in a hit.</p>
    <div
      v-if="open"
      id="qpu-search-hits"
      class="qpu-search-hits qpu-popover"
      role="listbox"
      aria-label="Search hits"
    >
      <p class="qpu-search-meta">{{ indexed }} indexed · {{ hits.length }} hits · {{ sites.length }} sites</p>
      <p v-if="facets.length" class="qpu-search-sites">
        <button
          v-for="s in facets"
          :key="s.host"
          type="button"
          :class="{ wants: site === s.host }"
          :aria-pressed="site === s.host ? 'true' : 'false'"
          @click="pinSite(s.host)"
        >{{ s.host }} · {{ s.hits }}</button>
      </p>
      <p v-if="empty" class="qpu-empty-desc">No hits. Tokens must appear in a constructor.</p>
      <p v-for="h in hits" :key="h.kind + h.link + h.text">
        <a :href="hrefOf(h.link)" @click.prevent="go(h.link)">{{ h.kind }} · {{ h.site ?? data.host }} · {{ h.text.slice(0, 72) }}</a>
      </p>
    </div>
  </div>
</template>
