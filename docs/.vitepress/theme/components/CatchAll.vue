<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { handle } from '../../../../src/quantum/mcp.ts'
import { uuidFromParts } from '../../../../src/quantum/blocks.ts'
import { translateOf, LOCALES } from '../../../../src/quantum/i18n.ts'
import Compile from './Compile.vue'
import Channel from './Channel.vue'
const route = useRoute()
const decision = computed(() => {
  const segments = route.path.split('/').filter(Boolean).map(decodeURIComponent)
  const notes: string[] = []
  let locale = 'en'
  if (segments[0] && LOCALES[segments[0]] && segments[0] !== 'en') { locale = segments.shift()!; if (!LOCALES[locale]!.filled) notes.push(`translate later: ${LOCALES[locale]!.name} has no vocabulary table yet, a lead`) }
  const [a, b, c] = segments
  if (a && /^[0-9a-f]{8}$/.test(a) && b && /^[0-9a-f]{10}$/.test(b)) return { kind: 'walk' as const, uuid: uuidFromParts(a, [...b].map((x) => parseInt(x, 16)), c && /^[0-9a-f]{12}$/.test(c) ? c : '000000000000'), notes, locale }
  const statement = segments.join(' ').replace(/[-_]+/g, ' ')
  const m = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'match', arguments: { statement } } }) as { result?: { structuredContent: { verdict: string; evidence: string[] }; _meta: { widget: string } } }
  return { kind: 'decided' as const, statement, verdict: m.result?.structuredContent.verdict ?? 'undecided', widget: m.result?._meta.widget ?? '', notes, locale }
})
const t = (text: string) => translateOf(text, 'en', decision.value.locale).text
const prev = typeof document !== 'undefined' && document.referrer ? document.referrer : undefined
</script>
<template>
  <div class="vp-doc" style="padding: 32px 24px 96px">
    <p v-if="decision.notes.length" style="color: var(--vp-c-text-2)">{{ decision.notes.join(' · ') }}</p>
    <template v-if="decision.kind === 'walk'">
      <h1>{{ t('the walk') }}</h1>
      <Channel :uuid="decision.uuid" />
      <Compile :uuid="decision.uuid" :prev="prev" />
    </template>
    <template v-else>
      <h1>{{ decision.statement }}</h1>
      <p>{{ t('Caught: this path is not a walk. Decided by the match tool') }}: <strong>{{ decision.verdict }}</strong></p>
      <div v-html="decision.widget" />
    </template>
  </div>
</template>
