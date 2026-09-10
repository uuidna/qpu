<script setup lang="ts">
defineProps<{
  name: string
  seat: string
  live: boolean
}>()
</script>

<template>
  <p class="vp-doc">
    <strong>{{ name }}</strong>
    · {{ seat }}
    · {{ live ? 'live' : 'dead' }}
  </p>
</template>
