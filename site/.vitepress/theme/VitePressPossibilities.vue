<script setup lang="ts">
// Every possibility the installed VitePress offers and how this site uses each, as possibilities.data.ts computed them
// at build: one table for each kind, a row for each possibility, a mark where the site uses it and how it is configured
// or which of the site's files use it. The component only lays the rows out.
import { computed } from 'vue'
import { data } from './possibilities.data'

const kinds = computed(() => [...new Set(data.rows.map((row) => row.kind))].map((kind) => { const rows = data.rows.filter((row) => row.kind === kind); return { kind, rows, used: rows.filter((row) => row.used).length } }))
</script>

<template>
  <p><code>vitepress@{{ data.vitepress }}</code></p>
  <template v-for="k in kinds" :key="k.kind">
    <h2 :id="k.kind"><code>{{ k.kind }}</code> · {{ k.used }} / {{ k.rows.length }}</h2>
    <table>
      <tbody>
        <tr v-for="row in k.rows" :key="row.name">
          <td>{{ row.used ? '✓' : '·' }}</td>
          <td><code>{{ row.name }}</code></td>
          <td>{{ row.how }}</td>
        </tr>
      </tbody>
    </table>
  </template>
</template>
