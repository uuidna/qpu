<script setup lang="ts">
import QpuFormula from './QpuFormula.vue'
import QpuLexical from './QpuLexical.vue'
import type { QpuLexicalNode, QpuLexicalState } from '../../../src/quantum/processing/unit/seed.ts'

defineProps<{ node?: QpuLexicalNode; state?: QpuLexicalState }>()

const textOf = (node: QpuLexicalNode): string =>
  node.text ?? node.children?.map(textOf).join('') ?? ''
</script>

<template>
  <QpuLexical v-if="state" :node="state.root" />
  <template v-else-if="node?.type === 'root'">
    <QpuLexical v-for="(c, i) in node.children ?? []" :key="i" :node="c" />
  </template>
  <component
    v-else-if="node?.type === 'heading'"
    :is="node.tag || 'h3'"
    :id="textOf(node)"
  >
    <QpuLexical v-for="(c, i) in node.children ?? []" :key="i" :node="c" />
  </component>
  <QpuFormula v-else-if="node?.type === 'code' && node.language === 'tex'" :tex="textOf(node)" />
  <div v-else-if="node?.type === 'code'" class="language-lean">
    <pre class="shiki"><code>{{ textOf(node) }}</code></pre>
  </div>
  <p v-else-if="node?.type === 'paragraph'">
    <QpuLexical v-for="(c, i) in node.children ?? []" :key="i" :node="c" />
  </p>
  <template v-else-if="node?.type === 'text'">{{ node.text }}</template>
</template>
