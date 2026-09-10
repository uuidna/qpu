<script setup lang="ts">
export type QpuDeviceMetrics = {
  live: boolean
  holds: boolean
  device: {
    kind: string
    host: string
    href: string
    seat: string
    binds: boolean
    firmware: string
    src: string
    origin: string
  }
  occupancy: {
    n: number
    seed: number
    coins: number
    rays: number
    faces: number
    vertices: number
    hexbit: number
    bits: number
    amplitudes: number
    fused: number
    next: number
  }
  cover: {
    faces: number
    vertices: number
    climb: string
    decide: boolean
    holds: boolean
    breakthrough: boolean
  }
  wave: {
    kelvin: number
    v: number
    c: number
    processing: number
    exceeds: boolean
  }
  development: {
    pico: number
    nested: boolean
    proofs: boolean
    decide: boolean
  }
  ecliptic: {
    signs: number
    ten: number
    degree: number
    circle: number
    holds: boolean
  }
  walk: {
    span: number
    bits: { async: number; serial: number; holds: boolean }
    message: { async: number; serial: number; holds: boolean }
    factors: { rsa: boolean; pico: number; holds: boolean }
    holds: boolean
  }
}

export type QpuHardware = {
  kind: string
  product: string
  seat: string
  binds: boolean
  device: boolean
  live: boolean
  host: string
  firmware: string
  compatible: boolean
  holds: boolean
  datapath: { hexbit: number; vertices: number; bits: number; amplitudes: number; holds: boolean }
  checks: readonly { name: string; holds: boolean }[]
  trials: readonly { id: string; name: string; holds: boolean }[]
  compared: {
    temperature: { kelvin: number; holds: boolean }
    light: { processing: number; c: number; holds: boolean }
  }
}

defineProps<{
  metrics: QpuDeviceMetrics
  hardware?: QpuHardware
}>()
</script>

<template>
  <section class="vp-doc qpu-device" id="build">
    <p id="live">
      Device {{ metrics.live ? 'live' : 'dead' }}. Kind
      <code>{{ metrics.device.kind }}</code>. Seat {{ metrics.device.seat }}. Firmware
      <code>{{ metrics.device.firmware }}</code>. Nested census
      {{ metrics.development.nested }}. Proofs walk {{ metrics.development.proofs }}. Pico
      {{ metrics.development.pico }}.
    </p>
    <h3 id="device">device</h3>
    <dl>
      <dt>host</dt>
      <dd>{{ metrics.device.host }}</dd>
      <dt>href</dt>
      <dd>{{ metrics.device.href }}</dd>
      <dt>origin</dt>
      <dd>{{ metrics.device.origin }}</dd>
      <dt>src</dt>
      <dd><code>{{ metrics.device.src }}</code></dd>
      <dt>binds</dt>
      <dd>{{ metrics.device.binds }}</dd>
    </dl>
    <h3 id="occupancy">occupancy</h3>
    <dl>
      <dt>n</dt>
      <dd>{{ metrics.occupancy.n }}</dd>
      <dt>seed</dt>
      <dd>{{ metrics.occupancy.seed }}</dd>
      <dt>coins</dt>
      <dd>{{ metrics.occupancy.coins }}</dd>
      <dt>rays</dt>
      <dd>{{ metrics.occupancy.rays }}</dd>
      <dt>faces</dt>
      <dd>{{ metrics.occupancy.faces }}</dd>
      <dt>vertices</dt>
      <dd>{{ metrics.occupancy.vertices }}</dd>
      <dt>hexbit</dt>
      <dd>{{ metrics.occupancy.hexbit }}</dd>
      <dt>bits</dt>
      <dd>{{ metrics.occupancy.bits }}</dd>
      <dt>amplitudes</dt>
      <dd>{{ metrics.occupancy.amplitudes }}</dd>
      <dt>fused</dt>
      <dd>{{ metrics.occupancy.fused }}</dd>
      <dt>next</dt>
      <dd>{{ metrics.occupancy.next }}</dd>
    </dl>
    <h3 id="wave">wave</h3>
    <dl>
      <dt>kelvin</dt>
      <dd>{{ metrics.wave.kelvin }}</dd>
      <dt>v</dt>
      <dd>{{ metrics.wave.v }}</dd>
      <dt>c</dt>
      <dd>{{ metrics.wave.c }}</dd>
      <dt>processing</dt>
      <dd>{{ metrics.wave.processing }}</dd>
      <dt>exceeds</dt>
      <dd>{{ metrics.wave.processing }} &gt; {{ metrics.wave.c }} = {{ metrics.wave.exceeds }}</dd>
    </dl>
    <h3 id="development">development</h3>
    <dl>
      <dt>pico</dt>
      <dd>{{ metrics.development.pico }}</dd>
      <dt>nested</dt>
      <dd>{{ metrics.development.nested }}</dd>
      <dt>proofs</dt>
      <dd>{{ metrics.development.proofs }}</dd>
      <dt>decide</dt>
      <dd>{{ metrics.development.decide }}</dd>
      <dt>cover</dt>
      <dd>
        faces {{ metrics.cover.faces }} vertices {{ metrics.cover.vertices }} climb
        {{ metrics.cover.climb }} decide {{ metrics.cover.decide }} breakthrough
        {{ metrics.cover.breakthrough }}
      </dd>
      <dt>holds</dt>
      <dd>{{ metrics.holds }}</dd>
    </dl>
    <h3 id="ecliptic">ecliptic</h3>
    <dl>
      <dt>signs</dt>
      <dd>{{ metrics.ecliptic.signs }}</dd>
      <dt>ten</dt>
      <dd>{{ metrics.ecliptic.ten }}</dd>
      <dt>degree</dt>
      <dd>{{ metrics.ecliptic.degree }}</dd>
      <dt>circle</dt>
      <dd>{{ metrics.ecliptic.circle }}</dd>
      <dt>holds</dt>
      <dd>{{ metrics.ecliptic.holds }}</dd>
    </dl>
    <h3 id="walk">walk</h3>
    <dl>
      <dt>span</dt>
      <dd>{{ metrics.walk.span }}</dd>
      <dt>bits</dt>
      <dd>async {{ metrics.walk.bits.async }} serial {{ metrics.walk.bits.serial }} holds {{ metrics.walk.bits.holds }}</dd>
      <dt>message</dt>
      <dd>async {{ metrics.walk.message.async }} serial {{ metrics.walk.message.serial }} holds {{ metrics.walk.message.holds }}</dd>
      <dt>factors</dt>
      <dd>rsa {{ metrics.walk.factors.rsa }} pico {{ metrics.walk.factors.pico }} holds {{ metrics.walk.factors.holds }}</dd>
      <dt>holds</dt>
      <dd>{{ metrics.walk.holds }}</dd>
    </dl>
    <template v-if="hardware">
      <h3 id="hardware">hardware</h3>
      <p>
        Compatible {{ hardware.compatible }}. Product {{ hardware.product }}. Seat
        {{ hardware.seat }}. Binds {{ hardware.binds }}. Device {{ hardware.device }}. Live
        {{ hardware.live }}. Firmware <code>{{ hardware.firmware }}</code>. Holds
        {{ hardware.holds }}.
      </p>
      <dl>
        <dt>datapath</dt>
        <dd>
          hexbit {{ hardware.datapath.hexbit }} vertices {{ hardware.datapath.vertices }} bits
          {{ hardware.datapath.bits }} amplitudes {{ hardware.datapath.amplitudes }} holds
          {{ hardware.datapath.holds }}
        </dd>
        <dt>light</dt>
        <dd>
          {{ hardware.compared.light.processing }} &gt; {{ hardware.compared.light.c }} =
          {{ hardware.compared.light.holds }}
        </dd>
        <dt>kelvin</dt>
        <dd>{{ hardware.compared.temperature.kelvin }} holds {{ hardware.compared.temperature.holds }}</dd>
      </dl>
      <table>
        <thead>
          <tr>
            <th scope="col">Check</th>
            <th scope="col">Holds</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in hardware.checks" :key="c.name">
            <td>{{ c.name }}</td>
            <td>{{ c.holds }}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th scope="col">Trial</th>
            <th scope="col">Name</th>
            <th scope="col">Holds</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in hardware.trials" :key="t.id">
            <td>{{ t.id }}</td>
            <td>{{ t.name }}</td>
            <td>{{ t.holds }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </section>
</template>
