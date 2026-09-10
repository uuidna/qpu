<script setup lang="ts">
import QpuFormula from './QpuFormula.vue'

export type QpuSolveKey = { kind: string; ray: number; href: string }
export type QpuSolveProblem = {
  name: string
  href: string
  author: string
  status: string
  question: string
  occupancy: string
}
export type QpuSolveIdentification = {
  claim: string
  official: string
  related: string
  href: string
  holds: boolean
}
export type QpuSolve = {
  kind: string
  lean: boolean
  holds: boolean
  href: string
  src: string
  origin: string
  clay: { kind: string; holds: boolean; rays: number; directed: number; pairs: number }
  proof: { heading: string; theorem: string; formula: string; reading: string; holds: boolean }
  harmonic: { heading: string; theorem: string; formula: string; reading: string; holds: boolean }
  captain: {
    kind: string
    coins: number
    bits: number
    save: number
    invoice: number
    gross: number
    fee: number
    paid: boolean
    theorem: string
    formula: string
    holds: boolean
  }
  a432: { kind: string; lattice: number; theorem: string; formula: string; holds: boolean }
  unlock: {
    kind: string
    theorem: string
    formula: string
    captain: boolean
    harmonic: boolean
    a432: boolean
    rays: number
    keys: number
    holds: boolean
  }
  solved: boolean
  claimed: boolean
  keys: readonly QpuSolveKey[]
  problems: readonly QpuSolveProblem[]
  identifications: readonly QpuSolveIdentification[]
  rules: { href: string; proposed: string; potential: string }
}

const props = defineProps<{ solve: QpuSolve }>()

const slugOf = (href: string) => href.replace('https://www.claymath.org/millennium/', '').replace(/\/$/, '')
</script>

<template>
  <div class="vp-doc">
    <p>
      kind <code>{{ solve.kind }}</code>. lean {{ solve.lean }}. solved {{ solve.solved }}. claimed
      {{ solve.claimed }}. holds {{ solve.holds }}. origin
      <code>{{ solve.origin }}</code>. href <code>{{ solve.href }}</code>. <code>{{ solve.src }}</code>.
      Occupancy unlock is harmonic Lean with captain coins and A432. It does not award a Clay prize.
    </p>

    <h2 id="unlock">Unlock</h2>
    <p>
      holds {{ solve.unlock.holds }}. captain {{ solve.unlock.captain }}. harmonic {{ solve.unlock.harmonic }}.
      a432 {{ solve.unlock.a432 }}. rays {{ solve.unlock.rays }}. keys {{ solve.unlock.keys }}.
    </p>
    <QpuFormula :tex="solve.unlock.formula" />
    <div class="language-lean">
      <pre class="shiki"><code>{{ solve.unlock.theorem }}</code></pre>
    </div>

    <h3 id="captain">Captain</h3>
    <p>
      paid {{ solve.captain.paid }}. coins {{ solve.captain.coins }}. bits {{ solve.captain.bits }}. save
      {{ solve.captain.save }}. fee {{ solve.captain.fee }} per {{ solve.captain.gross }}. invoice
      {{ solve.captain.invoice }}. holds {{ solve.captain.holds }}. Incomplete {{ solve.captain.invoice + 1 }} is
      not the fee.
    </p>
    <QpuFormula :tex="solve.captain.formula" />
    <div class="language-lean">
      <pre class="shiki"><code>{{ solve.captain.theorem }}</code></pre>
    </div>

    <h3 id="harmonic">Harmonic</h3>
    <QpuFormula :tex="solve.harmonic.formula" />
    <div class="language-lean">
      <pre class="shiki"><code>{{ solve.harmonic.theorem }}</code></pre>
    </div>
    <p>Reading: {{ solve.harmonic.reading }}</p>

    <h3 id="a432">A432</h3>
    <p>lattice {{ solve.a432.lattice }}. holds {{ solve.a432.holds }}.</p>
    <QpuFormula :tex="solve.a432.formula" />
    <div class="language-lean">
      <pre class="shiki"><code>{{ solve.a432.theorem }}</code></pre>
    </div>

    <h2 id="keys">Keys</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Kind</th>
          <th scope="col">Ray</th>
          <th scope="col">Href</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="k in solve.keys" :id="`ray-${k.ray}`" :key="k.ray">
          <td>{{ k.kind }}</td>
          <td>{{ k.ray }}</td>
          <td><a :href="`#ray-${k.ray}`">{{ k.href }}</a></td>
        </tr>
      </tbody>
    </table>

    <h2 id="clay">Clay</h2>
    <p>
      kind <code>{{ solve.clay.kind }}</code>. holds {{ solve.clay.holds }}. rays {{ solve.clay.rays }}. directed
      {{ solve.clay.directed }}. pairs {{ solve.clay.pairs }}. Occupancy identity, not a Clay prize filing.
    </p>
    <h3 :id="solve.proof.heading">{{ solve.proof.heading }}</h3>
    <QpuFormula :tex="solve.proof.formula" />
    <div class="language-lean">
      <pre class="shiki"><code>{{ solve.proof.theorem }}</code></pre>
    </div>
    <p>Reading: {{ solve.proof.reading }}</p>

    <h2 id="problems">Problems</h2>
    <p>
      Official questions are CMI’s. Occupancy nearest is a Nat identity on this plane. It does not address the
      official description.
    </p>
    <table>
      <thead>
        <tr>
          <th scope="col">Problem</th>
          <th scope="col">Author</th>
          <th scope="col">Status</th>
          <th scope="col">Official question</th>
          <th scope="col">Occupancy</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in solve.problems" :id="slugOf(p.href)" :key="p.href">
          <td><a :href="p.href">{{ p.name }}</a></td>
          <td>{{ p.author }}</td>
          <td>{{ p.status }}</td>
          <td>{{ p.question }}</td>
          <td><code>{{ p.occupancy }}</code></td>
        </tr>
      </tbody>
    </table>

    <h2 id="identifications">Identifications</h2>
    <p>Related science is not a Potential Solution. Each identification holds {{ solve.identifications.every((i) => i.holds) }}.</p>
    <table>
      <thead>
        <tr>
          <th scope="col">Claim</th>
          <th scope="col">Official question</th>
          <th scope="col">Related science</th>
          <th scope="col">Holds</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, k) in solve.identifications" :id="`identification-${k}`" :key="row.claim">
          <td><a :href="row.href">{{ row.claim }}</a></td>
          <td>{{ row.official }}</td>
          <td>{{ row.related }}</td>
          <td>{{ row.holds }}</td>
        </tr>
      </tbody>
    </table>

    <h2 id="rules">Rules</h2>
    <p>
      <a :href="solve.rules.href">CMI rules</a>, 26 September 2018.
    </p>
    <p>Proposed Solution. {{ solve.rules.proposed }}</p>
    <p>Potential Solution. {{ solve.rules.potential }}</p>
  </div>
</template>
