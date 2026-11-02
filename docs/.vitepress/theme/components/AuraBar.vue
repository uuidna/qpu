<script setup lang="ts">
import { computed } from 'vue'
import { accentOfUuid, KEY, hueOf } from '../../../../src/quantum/processing/unit/theme.ts'
const props = defineProps<{ uuid?: string }>()
const accent = computed(() => (props.uuid ? accentOfUuid(props.uuid) : `hsl(${hueOf(KEY)} 62% 44%)`))
</script>
<template>
  <div :style="{ height: '3px', background: accent }" :title="uuid ? `aura of ${uuid}` : `the key ${KEY}`" />
</template>
