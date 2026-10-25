<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'
import AuraBar from './components/AuraBar.vue'
import Channel from './components/Channel.vue'
import Verify from './components/Verify.vue'
import CatchAll from './components/CatchAll.vue'
import HandleSearch from './components/HandleSearch.vue'
import Mode from './components/Mode.vue'
const { Layout } = DefaultTheme
const route = useRoute()
const { frontmatter } = useData()
const uuid = computed(() => (route.path.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i) ?? [])[0] ?? (frontmatter.value.uuid as string | undefined))
</script>

<template>
  <Layout>
    <template #layout-top><AuraBar :uuid="uuid" /></template>
    <template #nav-bar-content-after><HandleSearch /><Mode /></template>
    <template #doc-footer-before><Channel v-if="uuid" :uuid="uuid" /></template>
    <template #aside-outline-after><Verify v-if="uuid" :uuid="uuid" compact /></template>
    <template #not-found><CatchAll /></template>
  </Layout>
</template>
