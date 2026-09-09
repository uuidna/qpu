---
layout: page
title: Author
---

<script setup>
import { VPTeamPage, VPTeamPageTitle, VPTeamMembers } from 'vitepress/theme'
import { data } from './.vitepress/hologram.data.ts'

const members = [
  {
    avatar: 'https://github.com/ceccec.png',
    name: 'Tsvetan Rouschev',
    title: 'Captain',
    org: 'uuidna',
    orgLink: 'https://uuidna.com',
    desc: 'Constructors on this worker. Captain coins https://revolut.me/ceccec. Algebra, proof, and claim stay with the uuidna kernel.',
    sponsor: data.donate,
    actionText: 'Captain coins',
    links: [
      { icon: 'github', link: 'https://github.com/ceccec' },
    ],
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Author</template>
    <template #lead>ORCID 0009-0000-7312-9778. Captain coins https://revolut.me/ceccec. Lean proofs live on uuidna DOI 10.5281/zenodo.22256708, not in this repository.</template>
  </VPTeamPageTitle>
  <VPTeamMembers size="medium" :members="members" />
</VPTeamPage>
