<script setup lang="ts">
// The default layout with the background movie behind it: one fixed canvas under every page (the layout-top slot), and
// after each page what the movie plays and what it does not prove (the doc-after slot).
import DefaultTheme from 'vitepress/theme'
import BackgroundMovie from './BackgroundMovie.vue'
import MovieCaption from './MovieCaption.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-top>
      <ClientOnly><BackgroundMovie /></ClientOnly>
    </template>
    <template #doc-after>
      <ClientOnly><MovieCaption /></ClientOnly>
    </template>
  </Layout>
</template>
