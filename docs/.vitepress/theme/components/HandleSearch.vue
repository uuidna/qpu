<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vitepress'
const router = useRouter()
const handle = ref('')
const go = () => { const h = handle.value.trim().toLowerCase(); if (/^[0-9a-f]{8}$/.test(h)) router.go(`/h/${h}`); else if (/^[0-9a-f-]{36}$/.test(h)) router.go(`/u/${h}`); else router.go(`/${encodeURIComponent(h)}`) }
</script>
<template>
  <form @submit.prevent="go" style="display:flex;gap:6px;align-items:center;margin-left:12px">
    <input v-model="handle" placeholder="handle, uuid or statement" style="font-family:monospace;width:18ch;padding:2px 6px;border:1px solid var(--vp-c-divider);border-radius:6px;background:var(--vp-c-bg)" />
  </form>
</template>
