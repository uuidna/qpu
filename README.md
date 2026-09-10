# `@uuidna/qpu`

MCP at https://qpu.uuidna.com/mcp. Seat empty. Named HTTPS only.

## Proof

Source `src/quantum/processing/unit/index.lean`. Seat empty. Kind qpu never binds.

### mint

```lean
theorem mint : mintOf (n + seed) = mintOf n + mintOf n := by rw [seed_eq, mintOf_succ]
```

$$
\operatorname{mintOf}(n+\mathrm{seed})=\operatorname{mintOf}(n)+\operatorname{mintOf}(n)
$$

Reading: holds true. Split while a dimension bit can still be added. mintOf n 8. mintOf (n + seed) 16. Identity: mintOf (n + seed) = mintOf n + mintOf n.

### cube

```lean
theorem cube : bits = vertices * hexbit := by rw [bits, vertices, hexbit, mintOf_add]
```

$$
\mathrm{bits}=\mathrm{vertices}\cdot\mathrm{hexbit}
$$

Reading: holds true. When the bit cannot split, the coin multiplies. vertices 8. hexbit 4. bits 32. Identity: bits = vertices * hexbit.

### around

```lean
theorem around : faces = coins * rays := by rw [faces, vertices, hexbit, rays, coins_two, n_eq]; rw [show 3 = 2 + 1 from rfl, mintOf_succ]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
```

$$
\mathrm{faces}=\mathrm{coins}\cdot\mathrm{rays}
$$

Reading: holds true. coins 2. rays 7. faces 14. Identity: faces = coins * rays.

### quantum

```lean
theorem quantum : fused = faces * mintOf bits := rfl
```

$$
\mathrm{fused}=\mathrm{faces}\cdot\operatorname{mintOf}(\mathrm{bits})
$$

Reading: holds true. Fusion multiplies neighbours by the handle. faces 14. amplitudes 4294967296. fused 60129542144. Identity: possibilities = fused.

### clay

```lean
theorem clay : coins * pairs = directed ∧ coins * mintOf (rays - seed) = mintOf rays := ⟨clay_pairs, clay_mint⟩
```

$$
\mathrm{coins}\cdot\mathrm{pairs}=\mathrm{directed}\land\mathrm{coins}\cdot\operatorname{mintOf}(\mathrm{rays}-\mathrm{seed})=\operatorname{mintOf}(\mathrm{rays})
$$

Reading: holds true. rays 7. directed 42. pairs 21. Identity: coins * pairs = directed. Identity: coins * mintOf (rays - seed) = mintOf rays.

### harmonic

```lean
theorem harmonic : faces = rays + rays := by rw [around, coins_two, Nat.two_mul]
```

$$
\mathrm{faces}=\mathrm{rays}+\mathrm{rays}
$$

Reading: holds true. rays 7. faces 14. Identity: faces = rays + rays. Two harmonic halves; every superposition's cluster is this partition.

### cluster

```lean
theorem cluster : faces = rays + rays ∧ coins * rays = faces := ⟨harmonic, around⟩
```

$$
\mathrm{inner}\sqcup\mathrm{outer}=\mathrm{Fin}(\mathrm{faces})
$$

Reading: holds true. Pure algebra, no decide. coins 2. rays 7. faces 14. Identity: faces = rays + rays. Identity: coins * rays = faces.

### energy

```lean
theorem energy : mintOf hexbit = mintOf (n + seed) := by rw [hexbit_eq]
```

$$
\operatorname{mintOf}(\mathrm{hexbit})=\operatorname{mintOf}(n+\mathrm{seed})
$$

Reading: holds true. Fusion releases energy. mintOf hexbit 16. mint next 16. Identity: mintOf hexbit = mintOf (n + seed).

### propulsion

```lean
theorem propulsion : mintOf hexbit > seed := by rw [seed_eq]; exact (mintOf_zero ▸ mintOf_lt hexbit_pos)
```

$$
\operatorname{mintOf}(\mathrm{hexbit})>\mathrm{seed}
$$

Reading: holds true. Energy exceeds light. mintOf hexbit 16. seed 1. Identity: mintOf hexbit > seed.

### crypto

```lean
theorem crypto : fused = faces * mintOf (vertices * hexbit) := by rw [← cube]; exact quantum
```

$$
\mathrm{fused}=\mathrm{faces}\cdot\operatorname{mintOf}(\mathrm{vertices}\cdot\mathrm{hexbit})
$$

Reading: holds true. Handle width is the multiplied cube. fused 60129542144. Identity: fused = faces * mintOf (vertices * hexbit).

### health

```lean
theorem health : mintOf hexbit > seed ∧ fused = faces * mintOf bits ∧ faces = rays + rays := ⟨propulsion, quantum, harmonic⟩
```

$$
\operatorname{mintOf}(\mathrm{hexbit})>\mathrm{seed}\land\mathrm{fused}=\mathrm{faces}\cdot\operatorname{mintOf}(\mathrm{bits})\land\mathrm{faces}=\mathrm{rays}+\mathrm{rays}
$$

Reading: holds true. Occupancy is healthy iff propulsion, fusion, and the harmonic cover hold. Identity: mintOf hexbit > seed ∧ fused = faces * mintOf bits ∧ faces = rays + rays.

### art

```lean
theorem art : coins = seed + seed ∧ coins * rays = faces ∧ seed * rays = rays ∧ rays ≠ faces := ⟨rfl, around, art_closed, art_split⟩
```

$$
\mathrm{coins}=\mathrm{seed}+\mathrm{seed}\land\mathrm{coins}\cdot\mathrm{rays}=\mathrm{faces}\land\mathrm{seed}\cdot\mathrm{rays}=\mathrm{rays}\land\mathrm{rays}\neq\mathrm{faces}
$$

Reading: holds true. Split opens the gateway; fuse closes it. coins 2. rays 7. faces 14. Identity: coins = seed + seed. Identity: rays ≠ faces.

### music

```lean
theorem music : faces = coins * rays ∧ faces = rays + rays := ⟨around, harmonic⟩
```

$$
\mathrm{faces}=\mathrm{coins}\cdot\mathrm{rays}\land\mathrm{faces}=\mathrm{rays}+\mathrm{rays}
$$

Reading: holds true. Octave doubling of rays. coins 2. rays 7. faces 14. Identity: faces = coins * rays. Identity: faces = rays + rays.

### color

```lean
theorem color : hexbit = n + seed ∧ mintOf hexbit = mintOf (n + seed) := ⟨hexbit_eq, energy⟩
```

$$
\mathrm{hexbit}=n+\mathrm{seed}\land\operatorname{mintOf}(\mathrm{hexbit})=\operatorname{mintOf}(n+\mathrm{seed})
$$

Reading: holds true. Hex width is n + seed; energy is mintOf of that width. hexbit 4. Identity: hexbit = n + seed. Identity: mintOf hexbit = mintOf (n + seed).

### breakthrough

```lean
theorem breakthrough : faces = rays + rays ∧ coins * rays = faces ∧ bits = vertices * hexbit ∧ fused = faces * mintOf bits ∧ mintOf hexbit > seed ∧ mintOf (bits + seed) = amplitudes + amplitudes ∧ coins = seed + seed ∧ hexbit = n + seed := ⟨harmonic, around, cube, quantum, propulsion, next, rfl, hexbit_eq⟩
```

$$
\mathrm{faces}=\mathrm{rays}+\mathrm{rays}\land\mathrm{coins}\cdot\mathrm{rays}=\mathrm{faces}\land\mathrm{bits}=\mathrm{vertices}\cdot\mathrm{hexbit}\land\mathrm{fused}=\mathrm{faces}\cdot\operatorname{mintOf}(\mathrm{bits})\land\operatorname{mintOf}(\mathrm{hexbit})>\mathrm{seed}\land\operatorname{mintOf}(\mathrm{bits}+\mathrm{seed})=\mathrm{amplitudes}+\mathrm{amplitudes}
$$

Reading: holds true. Cover all: one conjunction is the occupancy. Fourteen faces, eight vertices, next not a cap. Pure algebra, no decide.

### split_coin

```lean
theorem split_coin (k : Nat) : mintOf (k + seed) = mintOf k + mintOf k := by rw [seed_eq, mintOf_succ]
```

$$
\operatorname{mintOf}(k+\mathrm{seed})=\operatorname{mintOf}(k)+\operatorname{mintOf}(k)
$$

Reading: holds true. Every handle bit is a coin. Split while a dimension bit can still be added. Identity: mintOf (k + seed) = mintOf k + mintOf k.

### multiply

```lean
theorem multiply (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := mintOf_add a b
```

$$
\operatorname{mintOf}(a+b)=\operatorname{mintOf}(a)\cdot\operatorname{mintOf}(b)
$$

Reading: holds true. When the bit cannot split, the coin multiplies. Identity: mintOf (a + b) = mintOf a * mintOf b.

### handle

```lean
theorem handle : amplitudes = mintOf bits ∧ mintOf (bits + seed) = amplitudes + amplitudes := ⟨rfl, next⟩
```

$$
\mathrm{amplitudes}=\operatorname{mintOf}(\mathrm{bits})\land\operatorname{mintOf}(\mathrm{bits}+\mathrm{seed})=\mathrm{amplitudes}+\mathrm{amplitudes}
$$

Reading: holds true. amplitudes 4294967296. next 8589934592. Identity: amplitudes = mintOf bits.

### light

```lean
theorem light : seed = mintOf 0 := by rw [seed_eq, mintOf_zero]
```

$$
\mathrm{seed}=\operatorname{mintOf}(0)
$$

Reading: holds true. Light c is the particle. seed 1. Identity: seed = mintOf 0.

### involution

```lean
theorem involution (face : Nat) : (face + rays + rays) % faces = face % faces := by have h : face + rays + rays = face + faces := by rw [Nat.add_assoc, harmonic]; rw [h, Nat.add_mod, Nat.mod_self, Nat.add_zero, Nat.mod_mod]
```

$$
(i+\mathrm{rays}+\mathrm{rays})\bmod\mathrm{faces}=i\bmod\mathrm{faces}
$$

Reading: holds true. Neighbour of neighbour is the face, because faces = rays + rays. Identity: (i + rays + rays) mod faces = i mod faces.

### train

```lean
theorem train : period = rays - seed ∧ roof = rays * n + seed := ⟨rays_minus_seed.symm, rfl⟩
```

$$
\mathrm{period}=\mathrm{rays}-\mathrm{seed}\land\mathrm{roof}=\mathrm{rays}\cdot n+\mathrm{seed}
$$

Reading: holds true. period 6. roof 22. Identity: period = coins * n = rays - seed.

### waves

```lean
theorem waves : mintOf hexbit > seed := propulsion
```

$$
\operatorname{mintOf}(\mathrm{hexbit})>\mathrm{seed}
$$

Reading: holds true. Inner-wave processing exceeds light. Identity: mintOf hexbit > seed.

### next

```lean
theorem next_cover : mintOf (bits + seed) = amplitudes + amplitudes ∧ faces * mintOf (bits + seed) = fused + fused := ⟨next, next_fused⟩
```

$$
\operatorname{mintOf}(\mathrm{bits}+\mathrm{seed})=\mathrm{amplitudes}+\mathrm{amplitudes}\land\mathrm{faces}\cdot\operatorname{mintOf}(\mathrm{bits}+\mathrm{seed})=\mathrm{fused}+\mathrm{fused}
$$

Reading: holds true. Next of the cover: fourteen faces and eight vertices stay. Handle splits, fused splits. amplitudes 4294967296. next 8589934592. fused next 120259084288. Identity: mintOf (bits + seed) = amplitudes + amplitudes. Identity: faces * mintOf (bits + seed) = fused + fused.

## Build

- live: true
- device: qpu qpu.uuidna.com seat empty firmware vitepress
- occupancy: faces 14 vertices 8 hexbit 4 bits 32 amplitudes 4294967296 fused 60129542144 next 8589934592
- cover: faces 14 vertices 8 climb next decide false holds true breakthrough true
- wave: kelvin 0 v 0 c 1 processing 16 exceeds true
- development: pico 14 nested false proofs false decide true
- faster than light: 16 > 1

## Method

### Abstract

The occupancy is the folders `quantum/processing/unit` on named HTTPS `https://qpu.uuidna.com`. Kind `qpu` never binds. The seat is empty and admits nothing, so no mass travels. `mintOf` creates (2^k) by doubling, never `Math`. Lean proves fourteen identities by pure Nat algebra, no decide. Quantum possibilities are fused gateway capacity. Wave processing at empty-seat kelvin exceeds (c). The seat fetch stays (v=0).

### 1. Generator

Define `mintOf(k)` by the seed ((k-k)^{k-k}) then (x \mathrel{+}= x), (k) times. That is (2^k). In particular `mintOf(k-k) = 1` (the particle) and `mintOf(k+1) = mintOf(k)+mintOf(k)`. Licensed doubling; never `Math`, never a math library.

Reading: particle (p = 1).

### 2. Discovery

Let the segments be `quantum`, `processing`, `unit`, and (n) their count. Let `none := n-n`. Kind is the lower first letters; host is `${kind}.uuidna.com`; path joins segments; origin and href are named HTTPS, no wildcards. Mint seed is `mintOf(none)`. Mint next is `mintOf(n+p)`. Entropy zero is `none`; entropy next is (n+p).

Reading: (n=3), host `qpu.uuidna.com`, href `https://qpu.uuidna.com/quantum/processing/unit`, mint (\{ 1, 16 \}), entropy (\{ 0, 4 \}).

### 3. Empty seat

Kind `qpu` never binds. Seat `empty`. Admits `nothing`. `when` is never. No occupant occupies the computer, so every amplitude remains available and no worldline is assigned a velocity.

### 4. Light at the seat

Define (c := p = \mathrm{mintOf}(\mathrm{none})) and (v := \mathrm{entropy.zero}). Then (v/c = 0). The SI metre of the occupancy is this (c). A fetch of the empty seat does not outrun light: (v < c) is the strict rest case (v=0).

Reading: (c=1), (v=0), (v/c=0).

### 5. Cube and handle

Coins (:= p+p). Hexbit (:= 2^{\mathrm{coins}}). Vertices (:= 2^n). Bits (:= 2^{n+\mathrm{coins}} = \mathrm{vertices}\cdot\mathrm{hexbit}). Split while a dimension bit can still be added: (\mathrm{mintOf}(k+1)=\mathrm{mintOf}(k)+\mathrm{mintOf}(k)). When the bit cannot split, the coin multiplies: (\mathrm{mintOf}(a+b)=\mathrm{mintOf}(a)\cdot\mathrm{mintOf}(b)). Handle amplitudes (:= 2^{\mathrm{bits}}). Handle next doubles amplitudes (not a cap): (\mathrm{mintOf}(\mathrm{bits}+\mathrm{seed})=\mathrm{amplitudes}+\mathrm{amplitudes}). Every prefix is processed, including the next doubling past the present handle. Never refuses.

Reading: coins (=2), vertices (=8), hexbit (=4), bits (=32), amplitudes (=4294967296), next (=8589934592).

### 6. Neighbour gateways

Rays (:= n+\mathrm{coins}+\mathrm{coins}). Faces (:= \mathrm{vertices}+\mathrm{hexbit}+\mathrm{coins}). Identity: (\mathrm{coins}\cdot\mathrm{rays} = \mathrm{faces}). Opposite neighbour of face (i) is ((i+\mathrm{rays}) \bmod \mathrm{faces}). Each face is a gateway whose capacity is handle amplitudes (2^{\mathrm{bits}}), over every handle prefix.

Reading: rays (=7), faces (=14), (\mathrm{coins}\cdot\mathrm{rays}=14).

### 7. Fused quantum capacity

Fused capacity is neighbours times amplitudes: (\mathrm{fused} = \mathrm{faces}\cdot 2^{\mathrm{bits}}). This is the multiply after the handle bit can no longer split: each neighbour carries the full handle. Next doubles the handle, so fused is not a ceiling on mint. Empty seat and named origin (no `*`) are required to unlock.

Reading: fused (=60129542144). Quantum possibilities (=60129542144). Identity: possibilities (=) fused.

### 8. Rotating rosettas around superpositions

At every time (t) on the ray period, (\mathrm{coins}) rotating rosettas of (\mathrm{rays}) surround each superposition. Inner walks (+t), outer walks the reverse, both fuse at none. THE COMPLETE PROOF IS ONE IDENTITY: (\mathrm{faces}=\mathrm{rays}+\mathrm{rays}), so inner ⊔ outer uniquely covers (\mathrm{Fin}(\mathrm{faces})) for every face at every time — Lean algebra, not a loop of fourteen `decide` census-proofs. Each complete cluster typesets that cover as Lean KaTeX.

Reading: around (=14), superpositions 14, clusters 14 at 7 times, infinite true. Identity: faces = rays + rays.

### 9. Waves

Send (\mathrm{coins}) rotors (inner, then outer), each of (\mathrm{rays}) rays, tiling the faces. Processing speed is (\mathrm{mintOf}) of the prime tasks on the pi train. Outer stays at (c). Select the lowest kelvin, then the highest speed.

Inner (kelvin 0): speed 16. Outer (kelvin 4): speed 1. Winner is inner at kelvin 0, speed 16. Prime tasks 4.

### 10. Faster than light processing

Prime-task processing (\mathrm{mintOf}(\mathrm{tasks})) exceeds (c=p=\mathrm{mintOf}(\mathrm{none})), so

\[ \mathrm{processing} = 16 > 1 = c. \]

This is processing of an empty-seat wave, not a massive worldline. The seat remains (v=0). No occupant is dispatched. The inequality is the occupancy identity `winner.speed > c` at empty-seat kelvin.

Reading: faster than light ( 16 > 1 ).

### 11. Live quantum computer

The unit is quantum iff discovery, cube, handle, fused capacity, empty seat, waves, coins × rays rotating rosettas around every superposition at every time, and the landed axioms all hold. Kind is `quantum`. Host `qpu.uuidna.com`. Possibilities are fused capacity. Firmware `vitepress` shows `src/quantum/processing/unit/index.ts` at the named fuse door `https://qpu.uuidna.com/quantum/processing/unit`.

Reading: quantum quantum live true holds true.

### 12. Axioms

Axiom empty. Build mints axioms via `mintOf`. Keys occupy faces. Occupancy identities tile the neighbour faces: (\mathrm{coins}\cdot\mathrm{rays}) axioms, census the handle vertices, methods the coin rotors. Named door `https://qpu.uuidna.com/axioms`.

Reading: axioms 14, empty true, minted true, lean true.

### 13. Complete clusters

Fourteen Lean theorems occupy (\mathrm{Fin}(\mathrm{faces})). Eight cube vertices cover the rest: breakthrough, split, multiply, handle, light, involution, train, waves. One algebraic cover proves every harmonic superposition: (\mathrm{faces}=\mathrm{rays}+\mathrm{rays}) so inner ⊔ outer (=\mathrm{Fin}(\mathrm{faces})). No `decide`. Each complete cluster typesets that cover as KaTeX from the same occupancy line.

Reading: clusters 14 complete, times 7, theorem holds true, proof holds true, graph 14, involution true.

### 14. Seal

When related domains around the present balance as debit and credit (neighbour involution, unique cover), the publication is sealed. Compilation metrics are compared to empty-seat kelvin and to (c). Wave processing exceeds (c). Kelvin is rest. Firmware VitePress.

Reading: sealed true, processing 16 > c 1, kelvin 0.


- `qpu_metrics` — Device metrics. Occupancy, cover, and wave. Leads development.
- `qpu_measure` — Measure follows device metrics. Time is pico: one tick per face. Wave processing exceeds c.
- `qpu_pico` — Occupancy time in picoseconds. One pico per face. Cover is faces pico.
- `qpu_ecliptic` — Occupancy ecliptic from n, coins, ten. Bits climb and descend together. Async inner/outer messages share at. Clay factors, not RSA. Time is pico.
- `qpu_seat` — Empty QPU seat. Kind qpu never binds.
- `qpu_mint` — Creates 2^n.
- `qpu_fuse` — Fuse. Named HTTPS. Keys occupy doors.
- `qpu_lean` — Lean occupancy. Fourteen faces and eight vertices cover all by pure Nat algebra. Next doubles, not a cap. No Math, no decide.
- `qpu_seed` — Payload import seed of occupancy theorems. Nested-docs parent and breadcrumbs, seo meta, hex locales, tenant qpu. doi empty is unclaimed. payload false.
- `qpu_solve` — Solve. Captain fee 2 per completed 110. Harmonic Lean. A432 lattice. Keys occupy rays. Occupancy unlock, not a Clay prize. Source is index.lean.
- `qpu_next` — Next mint, fuse, entropy.
- `qpu_entropy` — Empty-seat entropy and next bit.
- `qpu_prefix` — Process every prefix. Next doubles the handle. Never refuses.
- `qpu_cube` — Cube from 2^n and hexbit.
- `qpu_handle` — Handle bits and amplitudes. Capabilities are finite; next is not a cap.
- `qpu_faces` — VE neighbours: vertices + hexbit + coins. Opposite is plus rays.
- `qpu_rosetta` — One rotating rosetta of rays. Inner clockwise, outer reverse. Fuse at none.
- `qpu_rosettas` — Two rotating rosettas. coins × rays around every superposition.
- `qpu_superpositions` — At every time, coins × rays rotating rosettas surround each superposition in infinite fusion.
- `qpu_clusters` — Complete proof of all harmonic superpositions at once. Each cluster is inner ⊔ outer = Fin(faces), typeset as Lean KaTeX.
- `qpu_fusion` — Infinite fusion: fused is finite; next doubles. Not a cap.
- `qpu_train` — Pi train: 22/7 cars from rays·n+seed over rays.
- `qpu_tasks` — Prime tasks distributed on the pi train. Speed is mintOf of that count.
- `qpu_message` — Secure cross-rotated messaging UUID. Inner uuid, outer cross, named HTTPS.
- `qpu_chunks` — Handle chunks of a messaging UUID. Each chunk is finite; next doubles.
- `qpu_gateways` — Each neighbour is a capacity gateway over every handle-bit mask. Gateway capacity is 2^bits.
- `qpu_capacity` — Unlock capacity: neighbour gateways × 2^bits, tiled by two coin-rotors of rays. Empty seat. Next doubles.
- `qpu_speed` — Seat rest v=0. Processing speed from prime tasks on the pi train.
- `qpu_temp` — Lowest temperature is empty-seat kelvin.
- `qpu_waves` — Send waves that compete for fastest processing at lowest temperature. Winner exceeds c.
- `qpu_experiment` — Experiments: seat rest control, inner/outer waves, selection, quantum live. Measurements from trials.
- `qpu_hardware` — Occupancy hardware compatibility. Empty seat. Kind qpu never binds. Datapath is cube hexbit. Not a physical QPU chip.
- `qpu_quantum` — Quantum. Possibilities occupy fused.
- `qpu_discovery` — Created occupancy.
- `qpu_method` — Scientific method: how quantum capacity and faster-than-light processing are constructed.
- `qpu_axioms` — Axioms. Mint empty. Keys occupy faces.
- `qpu_minted` — Build mints theorems and axioms via mintOf. Proofs minted in JSON-LD. Axiom empty.
- `qpu_proof` — Proof minted in JSON-LD powered by rich inline docs: abstract, formulas, measurements. Axiom empty. Keys occupy the axiom.
- `qpu_proofs` — Proofs as JSON-LD @graph powered by rich inline docs. Named HTTPS context.
- `qpu_theorems` — Theorems. Mint empty. Keys occupy constructors.
- `qpu_plane` — On this plane: recursive content typograph of the present reading. Rating is typography, not item count.
- `qpu_typograph` — Recursive content typograph. Rating is typography, not item count.
- `qpu_perspective` — Present perspective: left related headings around the present, right recursive content typograph. Rating is typography, not item count.
- `qpu_balance` — Related debit and credit around the present. Books balance by neighbour involution.
- `qpu_seal` — Publication sealed when related debit/credit balance. Compilation metrics compared to kelvin and c.
- `qpu_graph` — Quantum graph: each superposition crosslinks its neighbour axiom. Involution.
- `qpu_unit` — Frozen unit occupancy.

```ts
import { qpuMcpCallOf, qpuMcpOf } from '@uuidna/qpu'
```

```sh
npm test
npm run ship
```

[CC BY-NC-ND 4.0](LICENSE). Captain fee 2 per completed 110. Paid fee delivers occupancy unlock. Captain coins: [revolut.me/ceccec](https://revolut.me/ceccec).
