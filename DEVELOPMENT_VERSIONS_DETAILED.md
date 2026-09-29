# Development Versions: v0.1.0 → v0.1.9 (Detailed)

**Complete history of QPU development versions with detailed release notes**  
**Date Range**: Initial development through v0.1.9  
**Final Status**: Foundation complete, ready for v1.0.0+

---

## v0.1.0: Initial Release

**Status**: First npm publish  
**What**: Foundation release, initial publishing setup

---

## v0.1.1: GitHub Release & Publishing Fix

**Status**: Release preparation  
**What**:
- Establish GitHub Release workflow
- Create Zenodo archive before npm publish
- Fix E404 handling
- Resolve trusted publisher issues on npmjs.com

---

## v0.1.2: Prior Art & Verification Foundation

**Status**: 14 commits of sealed work  
**Key Achievements**:
- ✅ Prior art attribution (Matthew Naylor, MIT 2016 from repository)
- ✅ Unit routing for referrers and names per request
- ✅ Vector seat filled and judged by WebGPU
- ✅ Reference verification (dispatch device refused returns zeros)
- ✅ Chunking under binding limit optimization
- ✅ Publishing asks forge about commit, waits for build run
- ✅ Version embedding strategy (separated from package.json)
- ✅ Gate refinement for archive validation

**Metrics**: 136/136 tests pass

---

## v0.1.3: Declarable Lattice

**Status**: Type system declaration  
**Key Achievements**:
- ✅ Lattice declared for consumer derivation
- ✅ qpu.d.ts curated public surface (13 exports)
- ✅ Geometry exports added: mintOf, qpuFacesOf, qpuCubeOf
- ✅ qpuQuantumOf shape widened to faces/cube/register
- ✅ Enables consumers to derive instead of copy

**Impact**: Payload site can now read lattice values (96 lengths/colors → derived from lattice)

**Metrics**: 136/136 tests pass

---

## v0.1.4: Proof as Tree Property

**Status**: Complete deployment integration  
**Key Achievements**:
- ✅ **Receipt is a property of this tree** (fundamental principle)
- ✅ test-receipt.json: rows asking no foreign host
- ✅ test-readings.json: rows asking foreign hosts (separate reporting)
- ✅ npm run outage: proves suite against 4 outage shapes
  - Refused
  - 503 (Service Unavailable)
  - Captive portal 200
  - Silent socket
- ✅ Deploy gate judges build (not foreign data)
- ✅ Swap decides entanglement (19 subjects × 18 domains)
- ✅ Citation resolution against Crossref (9 corrections, 2 citations fixed)
- ✅ RFC 9562 v8 identity for fields

**Metrics**: 172/172 tests, 6/6 mutations, 9/9 leads proven

---

## v0.1.5: Memoization & Sandbox Epoch

**Status**: Performance optimization with safety  
**Key Achievements**:
- ✅ Memoise pure doors (qpu_quantum, qpu_train, qpu_lean, qpu_improve, qpu_cite, qpu_compete)
- ✅ Do NOT memoise qpu_forge (forge must not be cached)
- ✅ **Sandbox epoch makes it safe** (content-addressing over cache invalidation)
- ✅ Epoch invalidates old keys, new ones miss correctly
- ✅ Argument allowlist protects `live` and `sequence` from caching
- ✅ Fixed qpu_prove regression (no longer hits its own cache)

**Performance Impact**:
```
Warm total: 842,163 → 176,185 (-79%)
  qpu_quantum:    99,106 → 5,896
  qpu_train:     149,810 → 5,896
  qpu_lean:       31,944 → 5,896
  qpu_improve:   487,465 → 5,896
  qpu_cite:       50,465 → 5,896
  qpu_compete:   133,647 → 5,896
  qpu_forge:      47,657 → 47,657 (NOT memoised)
  qpu_prove:      93,152 → 93,152 (now visible, was wrong when cached)
```

**Metrics**: 173/173 tests, 6/6 mutations, 9/9 leads, 5/5 percall checks

---

## v0.1.6: Gatherer Catalog Sweep

**Status**: Complete data source visibility  
**Key Achievements**:
- ✅ Fixed Zenodo unreachability (authentication issue, size=100 cap is 25)
- ✅ Swept all 4 catalogs (not just /mcp)
  - /mcp: 16/16 hold
  - /storage: 3/8 hold
  - /network: 8/8 hold
  - /server: 8/8 hold
- ✅ Separated transient refusals from gaps
- ✅ Fixed gate logic (malformed requests are our fault, not their refusal)
- ✅ Zenodo archive tracking now operational

**Discovery**: v0.1.4 archived, v0.1.5 not yet (latency, not failure)

**Metrics**: 174/174 tests, 6/6 mutations, 9/9 leads

---

## v0.1.7: Ratchets & Theorems

**Status**: Deterministic vocabulary and grounded refusals  
**Key Achievements**:
- ✅ **First ratchet: bare number replacement**
  - Scripts compute vocabulary by evaluating lattice functions
  - 76 literals found, 33 real, 0 left
  - Masking: comments, strings, templates, regexes
  - Tokenization instead of parse (TypeScript 7 has no JS compiler API)
- ✅ **Second ratchet: theorem grounding**
  - 39 refusals documented
  - 36 ungrounded → 23 grounded
  - Three groundings: absent input (false), bounds (quantity), sealed names
  - Prevents untheoremed denials

**Safeguards**:
- Ratchets only shrink (walls, dry-clean floor)
- Lattice-values.mjs generated from lattice
- Leads.mjs runs against live host

**Metrics**: 175/175 tests, 6/6 mutations, 28/28 scripts, 23 walls, 0 lattice, 23 refusals

---

## v0.1.8: Third-Party Queue Failures

**Status**: Publish workflow reliability  
**Key Achievements**:
- ✅ Separated self-owned checks from external dependencies
- ✅ Four pipeline checks (all live):
  1. npm serves version ✓
  2. npm provenance attestation ✓
  3. GitHub Release created ✓
  4. CITATION.cff agreement ✓
- ✅ Fifth check (external): Zenodo archive (reported, never gates)
- ✅ Fixed size parameter bug (was querying size=100, cap is 25 unauthenticated)

**Principle**: A third party's queue is not this pipeline's failure

**Result**: v0.1.6 shipped successfully (npm live, provenance attached, Release exists)

**Metrics**: 175/175 tests, 6/6 mutations, 28/28 scripts, 23 walls, 23 refusals

---

## v0.1.9: Partial Reachability

**Status**: Complete robustness  
**Key Achievements**:
- ✅ **Fifth shape added: partial reachability**
  - Some doors answer, some fail (reachability is not one fact)
  - Added to outage guard (refused, 503, captive portal, silent socket, partial)
- ✅ Fixed 4 reachability assertions:
  1. Records: now use `learn.holds` for all-or-nothing check
  2. Project/experiment loops: judge each door independently
  3. Face sub-tests: nine faces answered perfectly in partial read
  4. Unreached branch: relational not binary (not every seat taken, all accounted for)
- ✅ Deterministic shape definition (verdict based on URL, not scheduling)
- ✅ Refined timeout distinction (timeout = unreached, not broken)

**Guard Coverage**:
```
Test conditions: 175 tests each
- throw / status / body / hang / partial / reached
File: 59161f06924d2306
All 6 outage shapes deterministic and reproducible
```

**Metrics**: 175/175 tests, 6/6 mutations, 28/28 scripts, 23 walls, 23 refusals

---

## Development Summary

### Version Progression
```
v0.1.0 → v0.1.1 → v0.1.2 → v0.1.3 → v0.1.4 → v0.1.5 → v0.1.6 → v0.1.7 → v0.1.8 → v0.1.9
│        │         │        │        │        │        │        │        │        └─ Complete robustness
│        │         │        │        │        │        │        │        └─ Workflow reliability
│        │         │        │        │        │        │        └─ Ratchets & theorems
│        │         │        │        │        │        └─ Catalog sweep
│        │         │        │        │        └─ Memoization & epoch
│        │         │        │        └─ Proof as tree property
│        │         │        └─ Lattice declaration
│        │         └─ Prior art & verification
│        └─ GitHub release & publish
└─ Initial release
```

### Key Principles Evolved
1. **Proof as property** - Certificate of correctness belongs to the tree
2. **Lattice as derivable** - Types and quantities computed, not copied
3. **Epoch-based safety** - Content addressing over cache invalidation
4. **Reachability is relational** - Not all-or-nothing, some doors answer
5. **Third parties' faults aren't ours** - Separate external dependencies from gates
6. **Theorems ground refusals** - Every denial computed, not arbitrary
7. **Deterministic testing** - Verdicts based on logic, not scheduling

### Testing Evolution
```
v0.1.0: Baseline (136 tests)
v0.1.2-0.1.7: Growth to 175 tests
v0.1.8-0.1.9: Stability at 175 tests with expanded coverage

Consistent metrics (v0.1.7-0.1.9):
  Tests: 175/175 pass
  Mutations: 6/6 guard
  Scripts: 28/28 check
  Walls: 23 ratchet
  Refusals: 23 grounded
  Leads: 9/9 proven
```

### Gateway to v1.0.0
All v0.1.x work established:
- ✅ Publishing pipeline reliable
- ✅ Proof verified at every level
- ✅ Outage resilience proven
- ✅ Deterministic behavior guaranteed
- ✅ Type safety declarable
- ✅ Theorem-grounded refusals
- ✅ Partial failure handling
- ✅ Third-party independence

**Result**: Ready for v1.0.0 production release

---

Date: Development history through v0.1.9  
Status: Complete development phase, production foundation established  
Next: v1.0.0 (Production), then v1.0.0+ (Autonomous systems)
