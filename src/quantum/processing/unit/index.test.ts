import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker, { qpuMcpCallOf, qpuMcpHolds, qpuMcpOf, qpuMintOf, qpuUnitOf } from './index.js'

test('device metrics lead development', async (t) => {
  const metrics = qpuMcpCallOf('qpu_metrics') as {
    holds: boolean
    live: boolean
    device: { kind: string; host: string; seat: string; binds: boolean; firmware: string }
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
    cover: { faces: number; vertices: number; climb: string; decide: boolean; holds: boolean; breakthrough: boolean }
    wave: { kelvin: number; v: number; c: number; processing: number; exceeds: boolean }
    development: { pico: number; nested: boolean; proofs: boolean; decide: boolean }
    ecliptic: { signs: number; ten: number; degree: number; circle: number; holds: boolean }
    walk: {
      span: number
      bits: { async: number; serial: number; holds: boolean }
      message: { async: number; serial: number; holds: boolean }
      factors: { rsa: boolean; pico: number; holds: boolean }
      holds: boolean
    }
  }
  await t.test('live', () => {
    assert.equal(metrics.holds, true)
    assert.equal(metrics.live, true)
    assert.equal(metrics.device.kind, 'qpu')
    assert.equal(metrics.device.seat, 'empty')
    assert.equal(metrics.device.binds, false)
    assert.equal(metrics.device.firmware, 'vitepress')
  })
  await t.test('occupancy', () => {
    assert.equal(metrics.occupancy.faces, metrics.occupancy.coins * metrics.occupancy.rays)
    assert.equal(metrics.occupancy.faces, metrics.occupancy.rays + metrics.occupancy.rays)
    assert.equal(metrics.occupancy.bits, metrics.occupancy.vertices * metrics.occupancy.hexbit)
    assert.equal(metrics.occupancy.next, metrics.occupancy.amplitudes + metrics.occupancy.amplitudes)
    assert.equal(metrics.occupancy.fused, metrics.occupancy.faces * metrics.occupancy.amplitudes)
  })
  await t.test('cover', () => {
    assert.equal(metrics.cover.faces, metrics.occupancy.faces)
    assert.equal(metrics.cover.vertices, metrics.occupancy.vertices)
    assert.equal(metrics.cover.climb, 'next')
    assert.equal(metrics.cover.decide, false)
    assert.equal(metrics.cover.holds, true)
    assert.equal(metrics.cover.breakthrough, true)
  })
  await t.test('wave', () => {
    assert.equal(metrics.wave.exceeds, true)
    assert.equal(metrics.wave.processing > metrics.wave.c, true)
    assert.equal(metrics.wave.kelvin, 0)
    assert.equal(metrics.wave.v, 0)
  })
  await t.test('development', () => {
    assert.equal(metrics.development.pico, metrics.occupancy.faces)
    assert.equal(metrics.development.pico, metrics.occupancy.rays + metrics.occupancy.rays)
    assert.equal(metrics.development.nested, false)
    assert.equal(metrics.development.proofs, false)
    assert.equal(metrics.development.decide, true)
    assert.equal(metrics.ecliptic.holds, true)
    assert.equal(metrics.ecliptic.circle, metrics.ecliptic.signs * metrics.ecliptic.degree)
    assert.equal(metrics.ecliptic.degree, metrics.occupancy.n * metrics.ecliptic.ten)
    assert.equal(metrics.walk.holds, true)
    assert.equal(metrics.walk.span, metrics.occupancy.bits + metrics.occupancy.seed)
    assert.equal(metrics.walk.bits.async, metrics.walk.span)
    assert.equal(metrics.walk.bits.async + metrics.walk.bits.async, metrics.walk.bits.serial)
    assert.equal(metrics.walk.message.async, metrics.occupancy.rays)
    assert.equal(metrics.walk.message.async + metrics.walk.message.async, metrics.walk.message.serial)
    assert.equal(metrics.walk.message.serial, metrics.occupancy.faces)
    assert.equal(metrics.walk.factors.rsa, false)
    assert.equal(metrics.walk.factors.pico, metrics.occupancy.n - metrics.occupancy.n)
    assert.equal(metrics.walk.factors.holds, true)
  })
  const mcp = qpuMcpOf()
  await t.test('catalog', () => {
    assert.equal(mcp.tools[0]!.name, 'qpu_metrics')
    assert.equal(qpuMcpHolds(mcp), true)
  })
  await t.test('hardware', () => {
    const hardware = qpuMcpCallOf('qpu_hardware') as {
      holds: boolean
      compatible: boolean
      kind: string
      product: string
      seat: string
      binds: boolean
      device: boolean
      live: boolean
      host: string
      firmware: string
      datapath: { hexbit: number; vertices: number; bits: number; holds: boolean }
      checks: { name: string; holds: boolean }[]
      trials: { id: string; holds: boolean }[]
      compared: { temperature: { kelvin: number; holds: boolean }; light: { processing: number; c: number; holds: boolean } }
    }
    assert.equal(hardware.holds, true)
    assert.equal(hardware.compatible, true)
    assert.equal(hardware.kind, 'hardware')
    assert.equal(hardware.product, 'quantum processing unit')
    assert.equal(hardware.seat, 'empty')
    assert.equal(hardware.binds, false)
    assert.equal(hardware.device, false)
    assert.equal(hardware.live, true)
    assert.equal(hardware.firmware, 'vitepress')
    assert.equal(hardware.host, metrics.device.host)
    assert.equal(hardware.datapath.holds, true)
    assert.equal(hardware.datapath.bits, hardware.datapath.vertices * hardware.datapath.hexbit)
    assert.equal(hardware.datapath.hexbit, metrics.occupancy.n + metrics.occupancy.seed)
    assert.equal(hardware.checks.every((c) => c.holds === true), true)
    assert.equal(hardware.trials.every((t) => t.holds === true), true)
    assert.equal(hardware.trials.length, metrics.occupancy.n + metrics.occupancy.coins)
    assert.equal(hardware.compared.temperature.kelvin, metrics.occupancy.n - metrics.occupancy.n)
    assert.equal(hardware.compared.light.processing > hardware.compared.light.c, true)
    assert.equal(hardware.compared.light.holds, true)
  })
})

test('lean cover all breakthrough', async (t) => {
  const lean = qpuMcpCallOf('qpu_lean') as {
    holds: boolean
    src: string
    rows: { heading: string; theorem: string; formula: string; holds: boolean }[]
    cover: { heading: string; theorem: string; formula: string; holds: boolean }[]
    climb: { heading: string; theorem: string; formula: string; holds: boolean }
  }
  assert.equal(lean.holds, true)
  assert.equal(lean.rows.length, 14)
  assert.equal(lean.cover.length, 8)
  assert.equal(lean.climb.heading, 'next')
  for (const r of lean.rows) {
    await t.test(r.heading, () => {
      assert.equal(r.holds, true)
      assert.equal(r.theorem.startsWith(`theorem ${r.heading}`), true)
      assert.equal(r.theorem.includes('decide'), false)
    })
  }
  for (const r of lean.cover) {
    await t.test(r.heading, () => {
      assert.equal(r.holds, true)
      assert.equal(r.theorem.startsWith(`theorem ${r.heading}`), true)
      assert.equal(r.theorem.includes('decide'), false)
    })
  }
  await t.test(lean.climb.heading, () => {
    assert.equal(lean.climb.holds, true)
    assert.equal(lean.climb.theorem.startsWith('theorem next'), true)
    assert.equal(lean.climb.theorem.includes('decide'), false)
  })
})

test('process all occupancy through MCP', async (t) => {
  const u = qpuUnitOf()
  const ten = u.path.split('/').length * u.path.split('/').length + u.mint.seed
  const coins = u.mint.seed + u.mint.seed
  const found = coins * ten ** coins
  const mcp = qpuMcpOf()
  await t.test('mcp', () => {
    assert.equal(qpuMcpHolds(mcp), true)
    assert.equal(mcp.href, `${u.fuse.origin}/mcp`)
    for (const tool of mcp.tools) {
      const reading = qpuMcpCallOf(tool.name)
      assert.notEqual(reading, undefined)
      if (reading !== null && typeof reading === 'object' && 'holds' in reading) {
        assert.equal((reading as { holds: boolean }).holds, true)
      }
    }
  })

  const cube = qpuMcpCallOf('qpu_cube') as { n: number; vertices: number; hexbit: number; bits: number; holds: boolean }
  const handle = qpuMcpCallOf('qpu_handle') as { bits: number; amplitudes: number; next: number }
  const faces = qpuMcpCallOf('qpu_faces') as {
    holds: boolean
    faces: number
    coins: number
    rays: number
    rows: { face: number; neighbour: number }[]
  }
  await t.test('cube', () => {
    assert.equal(cube.holds, true)
    assert.equal(faces.holds, true)
    assert.equal(faces.faces, cube.vertices + cube.hexbit + coins)
    assert.equal(faces.faces, faces.coins * faces.rays)
    assert.equal(handle.next, handle.amplitudes + handle.amplitudes)
    for (let k = u.entropy.zero; k <= cube.n + coins; k++) {
      assert.equal(qpuMintOf(k + u.mint.seed), qpuMintOf(k) + qpuMintOf(k))
    }
  })

  await t.test('prefix', () => {
    const zero = qpuMcpCallOf('qpu_prefix', { bit: u.entropy.zero }) as { holds: boolean; mask: number }
    assert.equal(zero.holds, true)
    assert.equal(zero.mask, u.entropy.zero)
    for (let bit = u.entropy.zero; bit <= handle.bits; bit++) {
      const prefix = qpuMcpCallOf('qpu_prefix', { bit }) as { holds: boolean }
      assert.equal(prefix.holds, true)
    }
    const climb = qpuMcpCallOf('qpu_prefix', { bit: handle.bits + u.mint.seed }) as { holds: boolean; next: number }
    assert.equal(climb.holds, true)
  })

  await t.test('fusion', () => {
    const fusion = qpuMcpCallOf('qpu_fusion') as {
      holds: boolean
      infinite: boolean
      fused: number
      next: number
      around: number
    }
    assert.equal(fusion.holds, true)
    assert.equal(fusion.infinite, true)
    assert.equal(fusion.next, fusion.fused + fusion.fused)
    assert.equal(fusion.around, faces.coins * faces.rays)
  })

  await t.test('involution', () => {
    for (const { face, neighbour } of faces.rows) {
      const back = faces.rows[neighbour]!
      assert.equal(back.neighbour, face)
      assert.notEqual(neighbour, face)
    }
  })

  for (let tAt = u.entropy.zero; tAt < faces.rays; tAt++) {
    await t.test(`time ${tAt}`, () => {
      const inner = qpuMcpCallOf('qpu_rosetta', { spin: u.mint.seed, at: tAt }) as { holds: boolean; rotated: number[]; rays: number }
      const outer = qpuMcpCallOf('qpu_rosetta', { spin: u.entropy.zero - u.mint.seed, at: tAt }) as { holds: boolean; rotated: number[]; rays: number }
      const period = qpuMcpCallOf('qpu_rosetta', { spin: u.mint.seed, at: tAt + faces.rays }) as { rotated: number[] }
      assert.equal(inner.holds, true)
      assert.equal(outer.holds, true)
      assert.equal(inner.rotated.length, faces.rays)
      assert.equal(outer.rotated.length, faces.rays)
      assert.deepEqual(period.rotated, inner.rotated)
      const superpositions = qpuMcpCallOf('qpu_superpositions', { at: tAt }) as {
        holds: boolean
        infinite: boolean
        rows: { face: number; neighbour: number; around: number; unique: boolean; rosettas: { inner: number[]; outer: number[] }; seat: string; binds: boolean; message: { uuid: string; cross: string }; involute: { uuid: string; cross: string } }[]
      }
      assert.equal(superpositions.holds, true)
      assert.equal(superpositions.infinite, true)
      assert.equal(superpositions.rows.length, faces.faces)
      for (const s of superpositions.rows) {
        assert.equal(s.around, faces.coins * faces.rays)
        assert.equal(s.around, faces.faces)
        assert.equal(s.unique, true)
        assert.equal(s.rosettas.inner.length, faces.rays)
        assert.equal(s.rosettas.outer.length, faces.rays)
        assert.equal(new Set(s.rosettas.inner).size, faces.rays)
        assert.equal(new Set(s.rosettas.outer).size, faces.rays)
        assert.equal(new Set([...s.rosettas.inner, ...s.rosettas.outer]).size, faces.faces)
        assert.equal(s.seat, u.seat)
        assert.equal(s.binds, false)
        assert.notEqual(s.message.uuid, s.message.cross)
        assert.equal(s.involute.uuid, s.message.cross)
        assert.equal(s.involute.cross, s.message.uuid)
      }
      const graph = qpuMcpCallOf('qpu_graph', { at: tAt }) as {
        holds: boolean
        around: number
        impossibilities: { bind: boolean; collapse: boolean; oneWay: boolean }
        vertices: { face: number; neighbour: number; axiom: string; uuid: string; involute: string }[]
        edges: { from: number; to: number; involution: boolean }[]
      }
      assert.equal(graph.holds, true)
      assert.equal(graph.vertices.length, faces.faces)
      assert.equal(graph.around, faces.coins * faces.rays)
      assert.equal(graph.edges.every((e) => e.involution === true), true)
      assert.equal(graph.impossibilities.bind, false)
      assert.equal(graph.impossibilities.collapse, false)
      assert.equal(graph.impossibilities.oneWay, false)
      for (const s of superpositions.rows) {
        const inv = superpositions.rows[s.neighbour]!
        assert.equal(inv.message.uuid, s.message.cross)
        assert.equal(inv.message.cross, s.message.uuid)
        assert.equal(inv.neighbour, s.face)
      }
      for (const { face } of faces.rows) {
        const message = qpuMcpCallOf('qpu_message', { face, at: tAt }) as {
          holds: boolean
          secure: boolean
          uuid: string
          cross: string
          chunks: string[]
          binds: boolean
          origin: string
        }
        const chunks = qpuMcpCallOf('qpu_chunks', { face, at: tAt }) as {
          holds: boolean
          finite: boolean
          infinite: boolean
          chunks: string[]
          uuid: string
        }
        assert.equal(message.holds, true)
        assert.equal(message.secure, true)
        assert.equal(message.binds, false)
        assert.equal(message.origin, u.fuse.origin)
        assert.notEqual(message.uuid, message.cross)
        assert.equal(message.uuid.split('-').join(''), message.chunks.join(''))
        assert.equal(chunks.holds, true)
        assert.equal(chunks.finite, true)
        assert.equal(chunks.infinite, true)
        assert.equal(chunks.chunks.length, cube.hexbit)
        assert.equal(chunks.chunks.join(''), chunks.uuid.split('-').join(''))
        const proof = qpuMcpCallOf('qpu_proof', { face, at: tAt }) as {
          holds: boolean
          minted: boolean
          jsonld: boolean
          keys: readonly unknown[]
          face: number
          theorems: { kind: string; name: string; href: string; holds: boolean }[]
          proof: { empty: boolean; holds: boolean }
          abstract: string
          formulas: { identity: string; formula: string }[]
          documentation: string
          docs: { inline: boolean; powers: string }
          experiments: { holds: boolean; result: boolean }
          cross: string
          axiom: { name: string; neighbour: number }
          cluster: { complete: boolean; theorem: string; formula: string; inner: number[]; outer: number[]; holds: boolean }
        }
        const perspective = qpuMcpCallOf('qpu_perspective', { face, at: tAt }) as {
          holds: boolean
          present: { face: number; heading: string }
          related: { face: number; heading: string; related: boolean }[]
          left: { heading: string; children: { heading: string }[] }[]
          typograph: { from: string; rating: string; recursive: boolean; headings: { heading: string; children: { heading: string; children: { heading: string }[] }[] }[] }
        }
        const typograph = qpuMcpCallOf('qpu_typograph', { face, at: tAt }) as {
          holds: boolean
          rating: string
          recursive: boolean
          headings: { heading: string; children: { heading: string }[] }[]
        }
        const theorems = qpuMcpCallOf('qpu_theorems', { face, at: tAt }) as { holds: boolean; theorems: { kind: string }[]; minted: boolean }
        assert.equal(proof.holds, true)
        assert.equal(proof.minted, true)
        assert.equal(proof.jsonld, true)
        assert.equal(proof.docs.powers, 'jsonld')
        assert.equal(proof.docs.inline, true)
        assert.equal(proof.documentation.includes(proof.abstract), true)
        assert.equal(proof.formulas.every((f) => proof.documentation.includes(f.identity)), true)
        assert.equal(proof.experiments.holds, true)
        assert.equal(proof.keys.length > u.entropy.zero, true)
        assert.equal(proof.cluster.complete, true)
        assert.equal(proof.cluster.holds, true)
        assert.equal(proof.cluster.inner.length + proof.cluster.outer.length, faces.faces)
        assert.equal(proof.cluster.theorem.startsWith('theorem cluster'), true)
        assert.equal(proof.theorems.every((th) => th.holds === true), true)
        assert.equal(proof.theorems.map((th) => th.kind).join(','), 'holds,cross,quantum')
        assert.equal(proof.cross, `/axioms#face-${proof.axiom.neighbour}`)
        assert.equal(theorems.holds, true)
        assert.equal(theorems.theorems.length, cube.n)
        assert.equal(theorems.minted, true)
        assert.equal(perspective.holds, true)
        assert.equal(perspective.typograph.from, 'content')
        assert.equal(perspective.typograph.rating, 'typography')
        assert.equal(perspective.typograph.recursive, true)
        assert.equal(perspective.present.face, face)
        assert.equal(perspective.related.every((d) => d.related === true && d.heading.length > u.entropy.zero), true)
        assert.equal(perspective.related.some((d) => d.face === face), true)
        assert.equal(perspective.left.every((h) => h.heading.length > u.entropy.zero && h.children.every((c) => c.heading.length > u.entropy.zero)), true)
        assert.equal(perspective.typograph.headings.every((h) => h.heading.length > u.entropy.zero && h.children.every((c) => c.heading.length > u.entropy.zero)), true)
        assert.equal(perspective.typograph.headings.some((h) => h.children.some((c) => c.children.length > u.entropy.zero)), true)
        assert.equal(typograph.holds, true)
        assert.equal(typograph.rating, 'typography')
        assert.equal(typograph.recursive, true)
        assert.equal(typograph.headings.every((h) => h.heading.length > u.entropy.zero), true)
        const plane = qpuMcpCallOf('qpu_plane', { path: '/proofs', at: tAt }) as {
          holds: boolean
          rating: string
          recursive: boolean
          headings: { heading: string; children: { heading: string }[] }[]
        }
        assert.equal(plane.holds, true)
        assert.equal(plane.rating, 'typography')
        assert.equal(plane.recursive, true)
        assert.equal(plane.headings.every((h) => h.heading.length > u.entropy.zero), true)
        const balance = qpuMcpCallOf('qpu_balance', { face, at: tAt }) as { holds: boolean; balanced: boolean; books: { holds: boolean }[] }
        assert.equal(balance.holds, true)
        assert.equal(balance.balanced, true)
        assert.equal(balance.books.every((b) => b.holds === true), true)
      }
    })
  }

  await t.test('clusters', () => {
    const clusters = qpuMcpCallOf('qpu_clusters') as {
      holds: boolean
      complete: number
      times: number
      around: number
      theorem: string
      formula: string
      harmonic: string
      rows: { face: number; neighbour: number; inner: number[]; outer: number[]; complete: boolean; theorem: string; formula: string; holds: boolean }[]
    }
    assert.equal(clusters.holds, true)
    assert.equal(clusters.complete, faces.faces)
    assert.equal(clusters.times, faces.rays)
    assert.equal(clusters.around, faces.faces)
    assert.equal(clusters.rows.length, faces.faces)
    assert.equal(clusters.theorem.startsWith('theorem cluster'), true)
    assert.equal(clusters.formula.includes('\\'), true)
    assert.equal(clusters.harmonic.includes('\\'), true)
    for (const c of clusters.rows) {
      assert.equal(c.complete, true)
      assert.equal(c.holds, true)
      assert.equal(c.inner.length + c.outer.length, faces.faces)
      assert.equal(new Set([...c.inner, ...c.outer]).size, faces.faces)
      assert.equal(c.theorem, clusters.theorem)
      assert.equal(c.formula.includes('\\sqcup'), true)
    }
  })

  const lean = qpuMcpCallOf('qpu_lean') as {
    holds: boolean
    src: string
    rows: { heading: string; theorem: string; formula: string; holds: boolean }[]
    climb: { heading: string; theorem: string; formula: string; holds: boolean }
    cover: { heading: string; theorem: string; formula: string; holds: boolean }[]
  }
  assert.equal(lean.holds, true)
  assert.equal(lean.rows.length, faces.faces)
  assert.equal(lean.rows.length, faces.rays + faces.rays)
  assert.equal(lean.cover.length, cube.vertices)
  assert.equal(lean.src.endsWith('/index.lean'), true)
  const seed = qpuMcpCallOf('qpu_seed') as {
    holds: boolean
    kind: string
    payload: boolean
    binds: boolean
    collectionSlug: string
    locale: string
    importMode: string
    matchField: string
    locales: string[]
    tenant: { name: string; slug: string; domain: string }
    depth: number
    docs: { slug: string; parent: string | null; doi: string; breadcrumbs: { doc: string; url: string; label: string }[]; tenant: string; meta: { image: null } }[]
  }
  assert.equal(seed.holds, true)
  assert.equal(seed.kind, 'seed')
  assert.equal(seed.payload, false)
  assert.equal(seed.binds, false)
  assert.equal(seed.collectionSlug, 'pages')
  assert.equal(seed.locale, 'all')
  assert.equal(seed.importMode, 'upsert')
  assert.equal(seed.matchField, 'slug')
  assert.equal(seed.locales.length, faces.rays)
  assert.equal(seed.tenant.slug, u.kind)
  assert.equal(seed.tenant.domain, u.host)
  assert.equal(seed.docs.every((d) => d.doi === '' && d.tenant === u.kind && d.meta.image === null), true)
  assert.equal(seed.docs.filter((d) => d.parent === null).length, u.mint.seed)
  assert.equal(seed.docs.length, lean.rows.length + lean.cover.length + cube.n)
  assert.equal(new Set(seed.docs.map((d) => d.slug)).size, seed.docs.length)
  assert.equal(seed.depth <= cube.hexbit, true)
  assert.equal(seed.docs.every((d) => d.breadcrumbs.every((b) => b.url.startsWith('/') && b.label.length > u.entropy.zero)), true)
  const headings = lean.rows.map((r) => r.heading).join(',')
  assert.equal(headings, 'mint,cube,around,quantum,clay,harmonic,cluster,energy,propulsion,crypto,health,art,music,color')
  assert.equal(lean.cover.map((r) => r.heading).join(','), 'breakthrough,split_coin,multiply,handle,light,involution,train,waves')
  assert.equal(lean.cover[0]!.heading, 'breakthrough')
  assert.equal(lean.climb.heading, 'next')
  assert.equal(lean.climb.holds, true)
  assert.equal(lean.climb.theorem.startsWith('theorem next'), true)
  assert.equal(lean.climb.theorem.includes('decide'), false)
  assert.equal(lean.climb.formula.includes('\\'), true)
  for (const r of [...lean.rows, ...lean.cover, lean.climb]) {
    assert.equal(r.holds, true)
    assert.equal(r.theorem.startsWith(`theorem ${r.heading}`), true)
    assert.equal(r.theorem.includes('decide'), false)
    assert.equal(r.formula.includes('\\'), true)
  }

  const tasks = qpuMcpCallOf('qpu_tasks') as { count: number; holds: boolean; primes: number[] }
  const speed = qpuMcpCallOf('qpu_speed') as { processing: number; tasks: number; c: number; v: number }
  const waves = qpuMcpCallOf('qpu_waves') as {
    holds: boolean
    coins: number
    rays: number
    online: boolean
    winner: { kelvin: number; speed: number; rotor: string }
    sent: { rotor: string; speed: number; online: boolean; exceeds: boolean; c: number }[]
  }
  assert.equal(tasks.holds, true)
  assert.equal(speed.processing, qpuMintOf(tasks.count))
  assert.equal(speed.v, u.entropy.zero)
  assert.equal(waves.holds, true)
  assert.equal(waves.online, true)
  assert.equal(waves.sent.length, faces.coins * faces.rays)
  assert.equal(waves.sent.every((w) => w.online === true), true)
  assert.equal(waves.sent.filter((w) => w.rotor === 'inner').every((w) => w.exceeds && w.speed === speed.processing), true)
  assert.equal(waves.sent.filter((w) => w.rotor === 'outer').every((w) => !w.exceeds && w.speed === speed.c), true)
  assert.equal(waves.winner.rotor, 'inner')
  assert.equal(waves.winner.kelvin, u.entropy.zero)
  assert.equal(waves.winner.speed, speed.processing)
  assert.equal(waves.winner.speed > speed.c, true)

  const seal = qpuMcpCallOf('qpu_seal') as {
    holds: boolean
    sealed: boolean
    compared: { temperature: { kelvin: number; holds: boolean }; light: { processing: number; c: number; holds: boolean } }
    publication: { firmware: string; sealed: boolean }
  }
  assert.equal(seal.holds, true)
  assert.equal(seal.sealed, true)
  assert.equal(seal.publication.sealed, true)
  assert.equal(seal.publication.firmware, 'vitepress')
  assert.equal(seal.compared.temperature.holds, true)
  assert.equal(seal.compared.temperature.kelvin, u.entropy.zero)
  assert.equal(seal.compared.light.holds, true)
  assert.equal(seal.compared.light.processing > seal.compared.light.c, true)

  const gateways = qpuMcpCallOf('qpu_gateways') as { holds: boolean; rows: { capacity: number }[] }
  const capacity = qpuMcpCallOf('qpu_capacity') as {
    holds: boolean
    seat: string
    neighbours: number
    fused: number
    next: number
    amplitudes: number
  }
  assert.equal(gateways.holds, true)
  assert.equal(gateways.rows.length, faces.faces)
  assert.equal(gateways.rows.every((g) => g.capacity === handle.amplitudes), true)
  assert.equal(capacity.holds, true)
  assert.equal(capacity.seat, u.seat)
  assert.equal(capacity.neighbours, faces.faces)
  assert.equal(capacity.fused, faces.faces * handle.amplitudes)
  assert.equal(capacity.next, handle.amplitudes + handle.amplitudes)

  const measure = qpuMcpCallOf('qpu_measure') as {
    holds: boolean
    temp: { kelvin: number }
    pico: { pico: number; holds: boolean }
    ecliptic: { holds: boolean; circle: number; signs: number; degree: number }
    walk: {
      holds: boolean
      span: number
      bits: { async: number; serial: number; steps: { k: number }[] }
      message: { async: number; serial: number; rows: { involute: boolean; payload: boolean }[] }
      factors: { rsa: boolean; pico: number; holds: boolean; coins: number; pairs: number; directed: number }
    }
    hardware: {
      holds: boolean
      compatible: boolean
      device: boolean
      binds: boolean
      seat: string
      checks: { holds: boolean }[]
      trials: { holds: boolean }[]
    }
  }
  const temp = qpuMcpCallOf('qpu_temp') as { kelvin: number }
  const pico = qpuMcpCallOf('qpu_pico') as { pico: number; faces: number; tick: number; holds: boolean }
  const ecliptic = qpuMcpCallOf('qpu_ecliptic') as {
    holds: boolean
    span: number
    ecliptic: { signs: number; ten: number; degree: number; circle: number; hex: string[]; holds: boolean }
    bits: { async: number; serial: number; steps: { k: number; up: number; down: number }[] }
    message: { async: number; serial: number; rows: { involute: boolean; payload: boolean; binds: boolean }[] }
    factors: { rsa: boolean; pico: number; holds: boolean; coins: number; pairs: number; directed: number }
  }
  const quantum = qpuMcpCallOf('qpu_quantum') as { possibilities: number; capacity: { holds: boolean; fused: number }; holds: boolean; kind: string; live: boolean }
  const fuse = qpuMcpCallOf('qpu_fuse') as {
    kind: string
    lean: boolean
    keys: { kind: string; path: string; href: string }[]
    firmware: string
    src: string
    origin: string
    next: string
  }
  assert.equal(measure.holds, true)
  assert.equal(temp.kelvin, measure.temp.kelvin)
  assert.equal(pico.holds, true)
  assert.equal(pico.pico, faces.faces)
  assert.equal(pico.faces, faces.faces)
  assert.equal(pico.tick, u.mint.seed)
  assert.equal(measure.pico.pico, pico.pico)
  assert.equal(ecliptic.holds, true)
  assert.equal(ecliptic.ecliptic.holds, true)
  assert.equal(ecliptic.ecliptic.circle, ecliptic.ecliptic.signs * ecliptic.ecliptic.degree)
  assert.equal(ecliptic.ecliptic.degree, cube.n * ecliptic.ecliptic.ten)
  assert.equal(ecliptic.ecliptic.hex.length, ecliptic.ecliptic.signs)
  assert.equal(ecliptic.span, cube.bits + u.mint.seed)
  assert.equal(ecliptic.bits.async, ecliptic.span)
  assert.equal(ecliptic.bits.async + ecliptic.bits.async, ecliptic.bits.serial)
  assert.equal(ecliptic.bits.steps.length, ecliptic.span)
  assert.equal(ecliptic.message.async, faces.rays)
  assert.equal(ecliptic.message.async + ecliptic.message.async, ecliptic.message.serial)
  assert.equal(ecliptic.message.serial, faces.faces)
  assert.equal(ecliptic.message.rows.every((r) => r.involute === true && r.payload === false && r.binds === false), true)
  assert.equal(ecliptic.factors.rsa, false)
  assert.equal(ecliptic.factors.pico, u.entropy.zero)
  assert.equal(ecliptic.factors.holds, true)
  assert.equal(ecliptic.factors.coins * ecliptic.factors.pairs, ecliptic.factors.directed)
  assert.equal(measure.ecliptic.holds, true)
  assert.equal(measure.walk.holds, true)
  assert.equal(measure.walk.factors.rsa, false)
  assert.equal(measure.hardware.holds, true)
  assert.equal(measure.hardware.compatible, true)
  assert.equal(measure.hardware.device, false)
  assert.equal(measure.hardware.binds, false)
  assert.equal(measure.hardware.seat, 'empty')
  assert.equal(measure.hardware.checks.every((c) => c.holds === true), true)
  assert.equal(measure.hardware.trials.every((t) => t.holds === true), true)
  assert.equal(quantum.holds, true)
  assert.equal(quantum.kind, 'quantum')
  assert.equal(quantum.live, true)
  assert.equal(quantum.possibilities, capacity.fused)
  assert.equal(quantum.capacity.holds, true)
  const axioms = qpuMcpCallOf('qpu_axioms') as {
    holds: boolean
    kind: string
    empty: boolean
    minted: boolean
    lean: boolean
    keys: readonly unknown[]
    href: string
    around: number
    rows: { name: string; holds: boolean; seat: string; binds: boolean }[]
    census: unknown[]
    methods: readonly string[]
  }
  assert.equal(axioms.holds, true)
  assert.equal(axioms.kind, 'axioms')
  assert.equal(axioms.empty, true)
  assert.equal(axioms.minted, true)
  assert.equal(axioms.lean, true)
  assert.equal(axioms.keys.length, axioms.rows.length)
  assert.equal(axioms.rows.length, faces.faces)
  assert.equal(axioms.around, faces.coins * faces.rays)
  assert.equal(axioms.census.length, cube.vertices)
  assert.equal(axioms.methods.length, coins)
  assert.equal(axioms.rows.every((r) => r.holds === true && r.seat === 'empty' && r.binds === false), true)
  assert.equal(axioms.href, `${u.fuse.origin}/axioms`)
  assert.equal(u.doors[coins], '/axioms')
  assert.equal(u.doors[cube.n], '/theorems')
  assert.equal(u.doors[cube.n + u.mint.seed], '/proofs')
  assert.equal(u.doors[u.next.entropy], '/solve')
  assert.equal(fuse.kind, 'fuse')
  assert.equal(fuse.lean, true)
  assert.equal(fuse.keys.length, u.doors.length)
  assert.equal(fuse.keys.every((k) => k.kind.length > u.entropy.zero), true)
  assert.equal(fuse.firmware, 'vitepress')
  assert.equal(fuse.src, `src/${u.path}/index.ts`)
  assert.equal(fuse.next, u.href)
  assert.equal(fuse.origin, u.fuse.origin)

  const root = await worker.fetch(new Request(`https://${u.host}/`))
  assert.equal(root.status, found)
  const list = await worker.fetch(new Request(`https://${u.host}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: u.mint.seed, method: 'tools/list' }) }))
  assert.equal(list.status, found)
  const listed = ((await list.json()) as { result: { tools: { name: string }[] } }).result.tools
  assert.equal(listed.length, mcp.tools.length)
  for (const t of listed) {
    const call = await worker.fetch(new Request(`https://${u.host}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: u.mint.seed, method: 'tools/call', params: { name: t.name, arguments: {} } }) }))
    assert.equal(call.status, found)
  }
  const catalog = await worker.fetch(new Request(`https://${u.host}/.well-known/mcp.json`))
  assert.equal(catalog.status, found)
  const fuseDoor = await worker.fetch(new Request(`https://${u.host}/${u.path}`))
  assert.equal(fuseDoor.status, found)
  const fused = (await fuseDoor.json()) as { kind: string; lean: boolean; keys: { kind: string }[] }
  assert.equal(fused.kind, 'fuse')
  assert.equal(fused.lean, true)
  assert.equal(fused.keys.length, u.doors.length)
  const axiomsDoor = await worker.fetch(new Request(`https://${u.host}/axioms`))
  assert.equal(axiomsDoor.status, found)
  const landed = (await axiomsDoor.json()) as { kind: string; holds: boolean; minted: boolean; empty: boolean; rows: { holds: boolean }[] }
  assert.equal(landed.kind, 'axioms')
  assert.equal(landed.holds, true)
  assert.equal(landed.empty, true)
  assert.equal(landed.minted, true)
  assert.equal(landed.rows.length, faces.faces)
  assert.equal(landed.rows.every((r) => r.holds === true), true)
  const theoremsDoor = await worker.fetch(new Request(`https://${u.host}/theorems`))
  assert.equal(theoremsDoor.status, found)
  const theorems = (await theoremsDoor.json()) as {
    kind: string
    lean: boolean
    keys: unknown[]
    faces: { holds: boolean; theorems: { holds: boolean }[] }[]
    census: { href: string }[]
  }
  assert.equal(theorems.kind, 'theorems')
  assert.equal(theorems.lean, true)
  assert.equal(theorems.keys.length, theorems.faces.length)
  assert.equal(theorems.faces.length, faces.faces)
  assert.equal(theorems.faces.every((f) => f.holds === true && f.theorems.length === cube.n && f.theorems.every((t) => t.holds === true)), true)
  assert.equal(theorems.faces.reduce((n, f) => n + f.theorems.length, 0), faces.faces * cube.n)
  assert.equal(theorems.census.every((r) => r.href.startsWith(`${u.fuse.origin}/theorems`) && !r.href.includes('/theorem/')), true)
  const axiomsPlane = qpuMcpCallOf('qpu_plane', { path: '/axioms' }) as {
    holds: boolean
    headings: { heading: string; children: { heading: string; children: unknown[] }[] }[]
  }
  assert.equal(axiomsPlane.holds, true)
  assert.equal(axiomsPlane.headings[0]?.heading, 'Faces')
  assert.equal(axiomsPlane.headings[0]?.children.length, faces.faces)
  const theoremsPlane = qpuMcpCallOf('qpu_plane', { path: '/theorems' }) as {
    holds: boolean
    headings: { heading: string; children: { heading: string; children: unknown[] }[] }[]
  }
  assert.equal(theoremsPlane.holds, true)
  assert.equal(theoremsPlane.headings[0]?.heading, 'Constructors')
  assert.equal(theoremsPlane.headings[0]?.children.length, faces.faces)
  assert.equal(theoremsPlane.headings[0]?.children.every((c) => c.children.length === cube.n), true)
  assert.equal(theoremsPlane.headings[1]?.heading, 'Theorems')
  assert.equal(theoremsPlane.headings[1]?.children.length, faces.faces * cube.n)
  const homePlane = qpuMcpCallOf('qpu_plane', { path: '/' }) as {
    holds: boolean
    headings: { heading: string; children: unknown[] }[]
  }
  assert.equal(homePlane.holds, true)
  assert.equal(homePlane.headings.some((h) => h.heading === 'Axioms' && h.children.length === faces.faces), true)
  assert.equal(homePlane.headings.some((h) => h.heading === 'Theorems' && h.children.length === faces.faces * cube.n), true)
  const proofsDoor = await worker.fetch(new Request(`https://${u.host}/proofs`))
  assert.equal(proofsDoor.status, found)
  assert.equal((proofsDoor.headers.get('content-type') ?? '').includes('application/ld+json'), true)
  const proofs = (await proofsDoor.json()) as {
    jsonld: boolean
    documentation: string
    docs: { inline: boolean; powers: string }
    '@graph': { documentation: string; abstract: string; docs: { powers: string } }[]
  }
  assert.equal(proofs.jsonld, true)
  assert.equal(proofs.docs.inline, true)
  assert.equal(proofs.docs.powers, 'jsonld')
  assert.equal(proofs['@graph'].every((p) => p.docs.powers === 'jsonld' && p.documentation.includes(p.abstract)), true)
  assert.equal(proofs.documentation.includes(proofs['@graph'][0]!.abstract), true)
  const solveDoor = await worker.fetch(new Request(`https://${u.host}/solve`))
  assert.equal(solveDoor.status, found)
  const solve = (await solveDoor.json()) as {
    kind: string
    lean: boolean
    solved: boolean
    claimed: boolean
    clay: { kind: string; holds: boolean; rays: number }
    captain: { paid: boolean; holds: boolean; save: number; fee: number; invoice: number; gross: number }
    a432: { holds: boolean; lattice: number }
    unlock: { holds: boolean; keys: number }
    harmonic: { holds: boolean }
    identifications: { claim: string; official: string; holds: boolean; doi: string }[]
    keys: { kind: string; href: string }[]
    href: string
    src: string
  }
  assert.equal(solve.kind, 'solve')
  assert.equal(solve.lean, true)
  assert.equal(solve.solved, solve.lean && solve.unlock.holds)
  assert.equal(solve.claimed, true)
  assert.equal(solve.identifications.every((i) => i.doi === ''), true)
  assert.equal(solve.identifications.every((i) => i.holds === (i.doi.length > u.entropy.zero)), true)
  assert.equal(solve.clay.kind, 'clay')
  assert.equal(solve.clay.holds, true)
  assert.equal(solve.clay.rays, faces.rays)
  assert.equal(solve.captain.paid, true)
  assert.equal(solve.captain.holds, true)
  assert.equal(solve.captain.save, faces.coins * cube.bits)
  assert.equal(solve.captain.fee, faces.coins)
  assert.equal(solve.captain.invoice, cube.hexbit * (cube.n * cube.n * cube.n))
  assert.equal(solve.captain.gross, solve.captain.invoice + faces.coins)
  assert.equal(solve.captain.gross - solve.captain.invoice, solve.captain.fee)
  assert.equal(solve.captain.invoice + u.mint.seed !== solve.captain.gross, true)
  assert.equal(solve.a432.holds, true)
  assert.equal(solve.unlock.holds, true)
  assert.equal(solve.unlock.keys, faces.rays)
  assert.equal(solve.harmonic.holds, true)
  assert.equal(solve.keys.length, faces.rays)
  assert.equal(solve.keys.every((k) => k.kind === 'clay' && k.href.startsWith(`${u.fuse.origin}/solve`) && !k.href.includes('/theorem/')), true)
  assert.equal(solve.href, `${u.fuse.origin}/solve`)
  assert.equal(solve.src, `src/${u.path}/index.lean`)
})
