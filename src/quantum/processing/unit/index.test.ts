import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker, { qpuMcpCallOf, qpuMcpHolds, qpuMcpOf, qpuMintOf, qpuUnitOf } from './index.js'

test('process all occupancy through MCP', async () => {
  const u = qpuUnitOf()
  const ten = u.path.split('/').length * u.path.split('/').length + u.mint.seed
  const coins = u.mint.seed + u.mint.seed
  const found = coins * ten ** coins
  const mcp = qpuMcpOf()
  assert.equal(qpuMcpHolds(mcp), true)
  assert.equal(mcp.href, `${u.fuse.origin}/mcp`)
  for (const t of mcp.tools) {
    const reading = qpuMcpCallOf(t.name)
    assert.notEqual(reading, undefined)
    if (reading !== null && typeof reading === 'object' && 'holds' in reading) {
      assert.equal((reading as { holds: boolean }).holds, true)
    }
  }

  const cube = qpuMcpCallOf('qpu_cube') as { n: number; vertices: number; hexbit: number; bits: number; holds: boolean }
  const handle = qpuMcpCallOf('qpu_handle') as { bits: number; amplitudes: number; next: number }
  const faces = qpuMcpCallOf('qpu_faces') as {
    holds: boolean
    faces: number
    coins: number
    rays: number
    rows: { face: number; neighbour: number }[]
  }
  assert.equal(cube.holds, true)
  assert.equal(faces.holds, true)
  assert.equal(faces.faces, cube.vertices + cube.hexbit + coins)
  assert.equal(faces.faces, faces.coins * faces.rays)
  assert.equal(handle.next, handle.amplitudes + handle.amplitudes)

  for (let k = u.entropy.zero; k <= cube.n + coins; k++) {
    assert.equal(qpuMintOf(k + u.mint.seed), qpuMintOf(k) + qpuMintOf(k))
  }

  const zero = qpuMcpCallOf('qpu_prefix', { bit: u.entropy.zero }) as { holds: boolean; mask: number }
  assert.equal(zero.holds, true)
  assert.equal(zero.mask, u.entropy.zero)
  for (let bit = u.entropy.zero; bit <= handle.bits; bit++) {
    const prefix = qpuMcpCallOf('qpu_prefix', { bit }) as { holds: boolean }
    assert.equal(prefix.holds, true)
  }
  const climb = qpuMcpCallOf('qpu_prefix', { bit: handle.bits + u.mint.seed }) as { holds: boolean; next: number }
  assert.equal(climb.holds, true)

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

  for (const { face, neighbour } of faces.rows) {
    const back = faces.rows[neighbour]!
    assert.equal(back.neighbour, face)
    assert.notEqual(neighbour, face)
  }

  for (let t = u.entropy.zero; t < faces.rays; t++) {
    const inner = qpuMcpCallOf('qpu_rosetta', { spin: u.mint.seed, at: t }) as { holds: boolean; rotated: number[]; rays: number }
    const outer = qpuMcpCallOf('qpu_rosetta', { spin: u.entropy.zero - u.mint.seed, at: t }) as { holds: boolean; rotated: number[]; rays: number }
    const period = qpuMcpCallOf('qpu_rosetta', { spin: u.mint.seed, at: t + faces.rays }) as { rotated: number[] }
    assert.equal(inner.holds, true)
    assert.equal(outer.holds, true)
    assert.equal(inner.rotated.length, faces.rays)
    assert.equal(outer.rotated.length, faces.rays)
    assert.deepEqual(period.rotated, inner.rotated)
    const superpositions = qpuMcpCallOf('qpu_superpositions', { at: t }) as {
      holds: boolean
      infinite: boolean
      rows: { around: number; unique: boolean; rosettas: { inner: number[]; outer: number[] }; seat: string; binds: boolean }[]
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
    }
    const graph = qpuMcpCallOf('qpu_graph', { at: t }) as {
      holds: boolean
      around: number
      vertices: { face: number; neighbour: number; axiom: string }[]
      edges: { from: number; to: number; involution: boolean }[]
    }
    assert.equal(graph.holds, true)
    assert.equal(graph.vertices.length, faces.faces)
    assert.equal(graph.around, faces.coins * faces.rays)
    assert.equal(graph.edges.every((e) => e.involution === true), true)
    for (const { face } of faces.rows) {
      const message = qpuMcpCallOf('qpu_message', { face, at: t }) as {
        holds: boolean
        secure: boolean
        uuid: string
        cross: string
        chunks: string[]
        binds: boolean
        origin: string
      }
      const chunks = qpuMcpCallOf('qpu_chunks', { face, at: t }) as {
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
      const proof = qpuMcpCallOf('qpu_proof', { face, at: t }) as {
        holds: boolean
        minted: boolean
        jsonld: boolean
        keys: readonly unknown[]
        face: number
        theorems: { kind: string; name: string; href: string; holds: boolean }[]
        proof: { empty: boolean; holds: boolean }
        abstract: string
        formulas: { identity: string }[]
        documentation: string
        docs: { inline: boolean; powers: string }
        experiments: { holds: boolean; result: boolean }
        cross: string
        axiom: { name: string; neighbour: number }
      }
      const perspective = qpuMcpCallOf('qpu_perspective', { face, at: t }) as {
        holds: boolean
        present: { face: number; heading: string }
        related: { face: number; heading: string; related: boolean }[]
        left: { heading: string; children: { heading: string }[] }[]
        typograph: { from: string; rating: string; recursive: boolean; headings: { heading: string; children: { heading: string; children: { heading: string }[] }[] }[] }
      }
      const typograph = qpuMcpCallOf('qpu_typograph', { face, at: t }) as {
        holds: boolean
        rating: string
        recursive: boolean
        headings: { heading: string; children: { heading: string }[] }[]
      }
      const theorems = qpuMcpCallOf('qpu_theorems', { face, at: t }) as { holds: boolean; theorems: { kind: string }[]; minted: boolean }
      assert.equal(proof.holds, true)
      assert.equal(proof.minted, true)
      assert.equal(proof.jsonld, true)
      assert.equal(proof.abstract.length > u.entropy.zero, true)
      assert.equal(proof.documentation.includes(proof.abstract), true)
      assert.equal(proof.formulas.every((f) => proof.documentation.includes(f.identity)), true)
      assert.equal(proof.docs.inline, true)
      assert.equal(proof.docs.powers, 'jsonld')
      assert.equal(proof.formulas.length, cube.n)
      assert.equal(proof.experiments.holds, true)
      assert.equal(proof.keys[0], proof.axiom.name)
      assert.equal(proof.face, face)
      assert.equal(proof.proof.empty, true)
      assert.equal(proof.theorems.length, cube.n)
      assert.equal(proof.theorems.every((t) => t.holds === true), true)
      assert.equal(proof.theorems.map((t) => t.kind).join(','), 'holds,cross,quantum')
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
      const plane = qpuMcpCallOf('qpu_plane', { path: '/proofs', at: t }) as {
        holds: boolean
        rating: string
        recursive: boolean
        headings: { heading: string; children: { heading: string }[] }[]
      }
      assert.equal(plane.holds, true)
      assert.equal(plane.rating, 'typography')
      assert.equal(plane.recursive, true)
      assert.equal(plane.headings.every((h) => h.heading.length > u.entropy.zero), true)
      const balance = qpuMcpCallOf('qpu_balance', { face, at: t }) as { holds: boolean; balanced: boolean; books: { holds: boolean }[] }
      assert.equal(balance.holds, true)
      assert.equal(balance.balanced, true)
      assert.equal(balance.books.every((b) => b.holds === true), true)
    }
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

  const measure = qpuMcpCallOf('qpu_measure') as { holds: boolean; temp: { kelvin: number } }
  const temp = qpuMcpCallOf('qpu_temp') as { kelvin: number }
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
    faces: unknown[]
    census: { href: string }[]
  }
  assert.equal(theorems.kind, 'theorems')
  assert.equal(theorems.lean, true)
  assert.equal(theorems.keys.length, theorems.faces.length)
  assert.equal(theorems.census.every((r) => r.href.startsWith(`${u.fuse.origin}/theorems`) && !r.href.includes('/theorem/')), true)
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
    listing: boolean
    quotes: boolean
    clay: { kind: string; gravity: boolean; listing: boolean; rays: number }
    keys: { kind: string; href: string }[]
    href: string
    src: string
  }
  assert.equal(solve.kind, 'solve')
  assert.equal(solve.lean, true)
  assert.equal(solve.listing, false)
  assert.equal(solve.quotes, false)
  assert.equal(solve.clay.kind, 'clay')
  assert.equal(solve.clay.gravity, true)
  assert.equal(solve.clay.listing, false)
  assert.equal(solve.clay.rays, faces.rays)
  assert.equal(solve.keys.length, faces.rays)
  assert.equal(solve.keys.every((k) => k.kind === 'clay' && k.href.startsWith(`${u.fuse.origin}/solve`) && !k.href.includes('/theorem/')), true)
  assert.equal(solve.href, `${u.fuse.origin}/solve`)
  assert.equal(solve.src, `src/${u.path}/index.lean`)
})
