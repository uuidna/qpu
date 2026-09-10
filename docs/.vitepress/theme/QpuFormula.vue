<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps<{ tex: string }>()
const html = computed(() =>
  katex.renderToString(props.tex, {
    displayMode: true,
    output: 'htmlAndMathml',
    throwOnError: false,
    trust: false,
  }),
)
</script>

<template>
  <div class="qpu-formula" v-html="html" />
</template>
