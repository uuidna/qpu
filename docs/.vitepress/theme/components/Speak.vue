<script setup lang="ts">
// From text to speech, token-free: the device's own voices read the text in the locale; which voices exist is the device's fact.
import { ref, onMounted } from 'vue'
const props = defineProps<{ text: string; locale?: string }>()
const voices = ref<string[]>([])
const speaking = ref(false)
const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
onMounted(() => { if (!supported) return; const load = () => { voices.value = window.speechSynthesis.getVoices().filter((v) => !props.locale || v.lang.toLowerCase().startsWith(props.locale.toLowerCase())).map((v) => v.name) }; load(); window.speechSynthesis.onvoiceschanged = load })
const speak = () => { if (!supported) return; const u = new SpeechSynthesisUtterance(props.text); if (props.locale) u.lang = props.locale; u.onend = () => { speaking.value = false }; speaking.value = true; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u) }
</script>
<template>
  <span v-if="supported" style="display:inline-flex;gap:6px;align-items:center">
    <button @click="speak" :disabled="speaking" :title="voices.length ? `voices for ${locale ?? 'the page'}: ${voices.join(', ')}` : `no voice on this device for ${locale ?? 'the page'}: a lead of the device, not of the text`" style="font-size:12px;padding:2px 8px;border:1px solid var(--vp-c-divider);border-radius:6px;background:var(--vp-c-bg)">{{ speaking ? '…' : '🔊' }} {{ locale ?? 'en' }}</button>
    <small v-if="!voices.length" style="color:var(--vp-c-text-2)">no voice for {{ locale ?? 'en' }} on this device</small>
  </span>
</template>
