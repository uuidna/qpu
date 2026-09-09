<script setup lang="ts">
defineProps<{
  name: string
  seat: string
}>()
</script>

<template>
  <p class="vp-doc">
    <strong>{{ name }}</strong>
    · {{ seat }}
  </p>
</template>
