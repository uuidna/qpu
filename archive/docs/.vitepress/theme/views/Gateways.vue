<script setup lang="ts">
import { useRouter, withBase } from 'vitepress'
import { data } from '../../hologram.data.ts'

const router = useRouter()
const rows = data.gateways
const hrefOf = (link: string) => withBase(link)
const go = (link: string) => void router.go(withBase(link))
</script>

<template>
  <section class="qpu-card" aria-label="Capacity gateways">
    <p>
      Unlock a handle bit with <code>qpuHandleMaskOf(bits)</code> for
      <code>0..{{ data.handleBits }}</code>.
      Full handle is <code>{{ data.handleMask }}</code>.
      Each neighbour spans <code>{{ data.handleSpan }}</code>.
    </p>
    <table>
      <caption>Fourteen neighbour capacity gateways</caption>
      <thead>
        <tr>
          <th scope="col">Face</th>
          <th scope="col">Neighbour</th>
          <th scope="col">Capacity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="g in rows" :key="g.face">
          <th scope="row">
            <a :href="hrefOf(`/face/${g.face}`)" @click.prevent="go(`/face/${g.face}`)">{{ g.face }}</a>
          </th>
          <td>
            <a :href="hrefOf(`/face/${g.neighbour}`)" @click.prevent="go(`/face/${g.neighbour}`)">{{ g.neighbour }}</a>
          </td>
          <td>{{ g.capacity }}</td>
        </tr>
      </tbody>
    </table>
    <p>
      Formula versus peer stays at
      <a :href="hrefOf('/metrics')" @click.prevent="go('/metrics')">Metrics</a>.
      Speed rungs stay at
      <a :href="hrefOf('/speed')" @click.prevent="go('/speed')">Speed</a>.
    </p>
  </section>
</template>
