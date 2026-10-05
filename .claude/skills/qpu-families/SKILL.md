---
name: qpu-families
description: Call any of the 155 QPU formula families (1253 exact-integer formulas) through the MCP — each a hex-program UUID that recomputes to the same value, so a call is idempotent and verifiable. Use when computing or verifying with the QPU over MCP. Families: access, adhesive, alloy, antenna, antibody, api, asteroid, audio, audit, authorization, bandwidth, battery, beam, bio, bond, budget, buffer, buoyancy, cache, cal, canon, catalyst, causal, ceramic, chat, chem, claims, clay, codec, coil, collision, color, comet, compensation, compliance, composite, contract, corrosion, court, creditscore, cross, crypt, crypto, crystal, data, db, dividend, dns, driver, eclipse, econ, electrolyte, engine, enzyme, equity, evidence, federated, firmware, fluid, forensic, friction, galaxy, gate, gear, genome, geo, glyph, graph, hardware, hash, hd, heat, holo, image, invoice, job, kin, law, ledger, lever, licensing, loan, matrix, merkaba, metabolism, modular, moon, mutation, nebula, neuron, np, numen, optics, option, packet, patent, path, pathogen, payroll, pendulum, piston, planet, polymer, port, prime, projectile, protein, protocol, pulley, pump, qpu, Qpu.Coil, Qpu.Hybrid, Qpu.Lattice, Qpu.Mint, Qpu.Physics, Qpu.Shor, queue, radar, record, reliability, remediation, rotation, router, rule, satellite, scale, signal, socket, software, solar, solvent, sort, split, spring, star, stream, survey, synapse, synthesis, tax, telescope, tesla, text, tls, torsion, tree, tune, vaccine, vector, wave, wind, xai, yi, zeroshot. Each formula answers at `npm run mcp -- <family>.<formula> '[params]'`.
---

# QPU families over MCP

Every family is a set of exact-integer formulas. Each is addressed by an RFC 9562 v8 hex-program UUID — `{ family, program: [formula], params }` — and the same arguments recompute to the same value (the determinism law), so every call is idempotent and carries a receipt. Families cross to `cross`; `gate.crossed` confirms a formula when its value is reached across domains (an OEIS sequence, a live API, or the rosetta). This file is generated from the registry by `scripts/generate-skills.mjs`; it is never hand-written, so it is exactly what qpu.uuidna.com serves.

## Call a formula

```bash
npm run mcp -- <family>.<formula> '[params]'            # the live host, qpu.uuidna.com
npm run mcp -- --local <family>.<formula> '[params]'    # the same call in-process over dist
```

Params are a JSON array (`'[]'` for none). The call routes through `qpu_hex` to the address `qpuHexUuidOf({ family, program: [formula], params })` and returns the value, the sealed UUID, and a receipt. For example `npm run mcp -- access.read '[1, 2]'` answers at `7e6283be-1000-5000-a000-000001000002`.

Ask a family anything else through its door — `npm run mcp -- '{ "door": "gate.crossed", "i": 0 }'` names the next lead; `npm run mcp -- '{ "doors": true }'` lists every door beyond the sixteen sealed tools.

## The 155 families (1253 tools)

| family | formulas |
|---|---|
| `access` | `read`/2, `role`/2, `screen`/1, `tenant`/3, `token`/1, `write`/3 |
| `adhesive` | `bondstrength`/2, `combos`/2, `coverage`/2, `cure`/2, `layers`/2, `peel`/2, `shear`/2, `viscosity`/2 |
| `alloy` | `combos`/2, `density`/2, `grains`/2, `hardness`/2, `meltpoint`/2, `parts`/2, `phases`/2, `ratio`/2 |
| `antenna` | `arrays`/2, `bands`/2, `beamwidth`/2, `elements`/2, `frequency`/2, `gain`/2, `pairs`/2, `wavelength`/2 |
| `antibody` | `affinity`/2, `chains`/2, `combos`/2, `epitopes`/2, `halflife`/2, `isotypes`/2, `neutralization`/2, `titer`/2 |
| `api` | `backoff`/2, `call`/3, `methods`/1, `offset`/2, `operations`/1, `pages`/2, `payload`/2, `remaining`/2, `statusClass`/1, `window`/2 |
| `asteroid` | `albedo`/2, `belt`/2, `combos`/2, `count`/2, `diameter`/2, `families`/2, `mass`/2, `rotation`/2 |
| `audio` | `bitdepth`/2, `bitrate`/2, `blocks`/2, `channels`/2, `duration`/2, `frames`/2, `samples`/2, `streambytes`/3 |
| `audit` | `gdprIsoNistFusion`/3, `healthcareComplianceFusion`/3, `paymentSecurityFusion`/3, `supplyChainRiskFormula`/4 |
| `authorization` | `accessreviewlag`/2, `grantratio`/2, `leastprivilege`/2, `permissionmatrix`/2, `policyeval`/2, `rolecount`/2, `scopebreadth`/2, `separationofduty`/2 |
| `bandwidth` | `bits`/2, `channels`/2, `combos`/2, `duplex`/2, `goodput`/2, `lanes`/2, `overhead`/2, `utilization`/2 |
| `battery` | `capacity`/2, `cells`/2, `chargepct`/2, `cyclelife`/2, `packs`/2, `runtime`/2, `seriescombos`/2, `voltage`/2 |
| `beam` | `combos`/2, `deflection`/2, `load`/2, `moment`/2, `safety`/2, `sections`/2, `span`/2, `supports`/2 |
| `bio` | `bmi`/2, `cells`/2, `colonies`/2, `dosage`/2, `doubling`/1, `generations`/2, `halflife`/2, `population`/3 |
| `bond` | `combos`/2, `coupon`/2, `duration`/2, `facevalue`/2, `maturity`/2, `payments`/2, `rating`/2, `yield`/2 |
| `budget` | `allocated`/2, `categories`/2, `combos`/2, `quarters`/2, `spent`/2, `surplus`/2, `utilization`/2, `variance`/2 |
| `buffer` | `combos`/2, `overflow`/2, `pages`/2, `refills`/2, `ring`/2, `size`/1, `slots`/2, `watermark`/2 |
| `buoyancy` | `combos`/2, `density`/2, `displaced`/2, `floats`/2, `force`/2, `margin`/2, `volume`/3, `weight`/2 |
| `cache` | `blocks`/2, `combos`/2, `hitpct`/2, `levels`/2, `lines`/2, `sets`/2, `tagbits`/2, `ways`/1 |
| `cal` | `coin`/1, `dayPer`/1, `designDays`/1, `faces`/0, `gatesPrecessed`/1, `gregorianDrift`/1, `julianDrift`/1, `leap`/1, `lunarDrift`/1, `metonicDrift`/1, `pairs`/2, `precession`/1, `sarosShift`/1, `sunSpeed`/1 |
| `canon` | `books`/1, `chapters`/1, `gospels`/0, `orderings`/1, `psalms`/0, `selections`/1, `suras`/0, `testaments`/0 |
| `catalyst` | `activation`/2, `combos`/2, `cycles`/2, `efficiency`/2, `loading`/2, `selectivity`/2, `sites`/2, `turnover`/2 |
| `causal` | `backdoorSets`/1, `chains`/1, `conditionings`/1, `confounded`/2, `counterfactuals`/1, `edges`/1, `forks`/1, `mediation`/1 |
| `ceramic` | `combos`/2, `density`/2, `grains`/2, `hardness`/2, `phases`/2, `porosity`/2, `shrink`/2, `sinter`/2 |
| `chat` | `chain`/1, `collisions`/1, `gossip`/1, `groups`/2, `lane`/2, `lanes`/1 |
| `chem` | `bonds`/2, `dilution`/2, `isotopes`/2, `mass`/2, `molarity`/2, `moles`/2, `valence`/2, `yield`/2 |
| `claims` | `deductible`/2, `frequency`/2, `incurred`/2, `lossratio`/2, `payout`/2, `reserve`/2, `settlement`/2, `severity`/2 |
| `clay` | `bsd`/1, `hodge`/1, `navierStokes`/2, `pVsNp`/1, `pass`/1, `riemann`/2, `yangMills`/0 |
| `codec` | `bitrate`/2, `blocksize`/1, `channels`/2, `combos`/2, `frames`/2, `latency`/2, `ratio`/2, `samples`/2 |
| `coil` | `coil`/1, `dims`/0, `dual`/1, `fold`/1, `genus`/0, `matrix`/2, `signal`/1, `spin`/1, `star`/1, `turn`/2 |
| `collision` | `bodies`/2, `deltav`/2, `energy`/2, `force`/2, `impulse`/2, `momentum`/2, `pairs`/2, `restitution`/2 |
| `color` | `channels`/2, `contrast`/2, `depth`/2, `gradient`/2, `hexdigits`/2, `levels`/1, `pairs`/2, `palette`/1 |
| `comet` | `aphelion`/2, `combos`/2, `nucleus`/2, `orbits`/2, `outgassing`/2, `perihelion`/2, `period`/2, `tail`/2 |
| `compensation` | `band`/2, `benefit`/2, `bonus`/2, `equity`/2, `raise`/2, `ratio`/2, `salary`/2, `total`/2 |
| `compliance` | `breach`/2, `coverage`/2, `deadline`/2, `penalty`/2, `remediation`/2, `reportable`/2, `retention`/2, `risk`/2 |
| `composite` | `combos`/2, `fiberpct`/2, `layers`/2, `modulus`/2, `orientations`/1, `plies`/2, `strength`/2, `weight`/2 |
| `contract` | `cure`/2, `deposit`/2, `expectation`/2, `liquidated`/2, `mitigation`/2, `penalty`/2, `reliance`/1, `restitution`/2 |
| `corrosion` | `coating`/2, `combos`/2, `lifetime`/2, `loss`/2, `pits`/2, `potential`/2, `rate`/2, `zones`/2 |
| `court` | `apportion`/3, `cap`/2, `costs`/2, `damages`/3, `fee`/2, `interest`/3, `settlement`/2, `standard`/2 |
| `creditscore` | `defaultprob`/2, `factorcombos`/2, `inquiries`/2, `paymenthistory`/2, `riskbands`/2, `score`/2, `tier`/2, `utilization`/2 |
| `cross` | `bb84ToCompress`/1, `compressQSecSignals`/2, `deploymentToObs`/2, `enterpriseMetricsViaObs`/2, `medSecureWithQSec`/2, `mlOnObsForPrediction`/2, `observabilityToML`/1, `observabilityToUI`/2, `quantumToEnterprise`/1, `testCoverageToQuality`/2 |
| `crypt` | `curveClassicalBits`/1, `curveQuantumBits`/1, `knownAnswers`/0, `nonceCollision`/1, `symmetricQuantumBits`/1, `tagForgery`/1 |
| `crypto` | `crypto_catalog`/2, `crypto_shor`/2, `crypto_cmodexp`/2, `crypto_iqft`/2, `crypto_shots`/2, `crypto_rsa`/2, `crypto_split`/2, `crypto_verify`/2 |
| `crystal` | `atoms`/2, `combos`/2, `defects`/2, `faces`/2, `lattice`/3, `planes`/2, `spacing`/2, `symmetry`/2 |
| `data` | `ai`/1, `deep`/1, `define`/1, `discover`/1, `errors`/1, `imagine`/1, `payload`/1, `perspectives`/1, `read`/1, `research`/1, `sources`/0, `unanswered`/1 |
| `db` | `adapters`/0, `binding`/1, `browser`/1, `combinations`/0, `experiments`/1, `migrations`/1, `ported`/1, `stable`/2 |
| `dividend` | `combos`/2, `exdates`/2, `frequency`/2, `growth`/2, `payout`/2, `pershare`/2, `total`/2, `yield`/2 |
| `dns` | `cachehit`/2, `combos`/2, `labels`/2, `nameservers`/2, `queries`/2, `records`/2, `ttl`/2, `zones`/2 |
| `driver` | `descBytes`/2, `dmaPages`/1, `irq`/1, `mmio`/1, `payload`/2, `pps`/2, `queues`/1, `ring`/2 |
| `eclipse` | `combos`/2, `contacts`/2, `duration`/2, `frequency`/2, `magnitude`/2, `path`/2, `saros`/2, `types`/2 |
| `econ` | `annuity`/3, `future`/3, `life`/1, `lost`/2, `present`/3, `worklife`/1 |
| `electrolyte` | `cells`/2, `combos`/2, `conductivity`/2, `ions`/2, `mobility`/2, `molarity`/2, `ph`/2, `voltage`/2 |
| `engine` | `compression`/2, `cylinders`/2, `displacement`/2, `firingorders`/1, `power`/2, `rpm`/2, `torque`/2, `valves`/2 |
| `enzyme` | `activesites`/2, `combos`/2, `inhibition`/2, `km`/2, `ph`/2, `substrates`/2, `turnover`/2, `vmax`/2 |
| `equity` | `classes`/2, `combos`/2, `dividendyield`/2, `eps`/2, `float`/2, `marketcap`/2, `pe`/2, `shares`/2 |
| `evidence` | `admissible`/2, `authentication`/2, `chain`/2, `corroboration`/1, `hearsay`/1, `relevance`/2, `sufficiency`/2, `weight`/2 |
| `federated` | `aggregated`/2, `cohorts`/1, `exchanges`/2, `params`/2, `quorum`/1, `shards`/2, `straggle`/2, `updates`/2 |
| `firmware` | `bootBlocks`/2, `checksumWords`/1, `otaDelta`/2, `pages`/2, `sectors`/2, `slots`/2, `version`/3, `words`/1 |
| `fluid` | `flow`/2, `head`/2, `litres`/2, `pipearea`/2, `pressuredrop`/2, `throughput`/2, `valves`/2, `volume`/3 |
| `forensic` | `bac`/1, `custody`/1, `error`/1, `likelihood`/2, `points`/1, `rarity`/2, `rmp`/1 |
| `friction` | `coefficient`/2, `combos`/2, `distance`/2, `force`/2, `heat`/2, `normal`/2, `surfaces`/2, `work`/2 |
| `galaxy` | `arms`/2, `blackholes`/2, `clusters`/2, `combos`/2, `diameter`/2, `redshift`/2, `stars`/2, `types`/2 |
| `gate` | `commit`/1, `crossed`/1, `family`/1, `leads`/0, `proof`/0, `push`/1, `rules`/0, `theorems`/0 |
| `gear` | `backlash`/2, `mesh`/2, `pairs`/2, `ratio`/2, `rpm`/2, `stages`/1, `teeth`/2, `torque`/2 |
| `genome` | `basepairs`/2, `chromosomes`/2, `codons`/2, `combos`/2, `gcpct`/2, `genes`/2, `mutations`/2, `reads`/2 |
| `geo` | `arcseconds`/2, `area`/2, `degrees`/2, `gridcells`/2, `quadkeys`/1, `tiles`/1, `waypoints`/2, `zoomcells`/1 |
| `glyph` | `arcana`/1, `element`/1, `planet`/1, `rune`/1, `systems`/0, `zodiac`/1 |
| `graph` | `cliques`/1, `components`/2, `degree`/2, `density`/2, `diameter`/2, `edges`/2, `paths`/2, `spanning`/2 |
| `hardware` | `addressable`/1, `busBytes`/1, `cacheLines`/1, `dies`/2, `lanes`/2, `pins`/2, `tdpPerCore`/2, `threads`/1 |
| `hash` | `bitsperkey`/2, `buckets`/1, `collisions`/2, `combos`/2, `digestbits`/2, `loadpct`/2, `probes`/2, `seeds`/2 |
| `hd` | `cells`/0, `center`/1, `channel`/2, `channels`/1, `chart`/1, `code`/1, `definition`/1, `design`/1, `gate`/1, `jdm`/2, `line`/1, `mean`/1, `sun`/1, `ut`/2 |
| `heat` | `coherence`/2, `cooling`/2, `erasure`/3, `landauer`/2, `quality`/3, `residue`/2, `signal`/1, `slow`/2, `split`/2, `temperature`/2, `ways`/2 |
| `holo` | `forgery`/1, `proofDepth`/1 |
| `image` | `aspect`/2, `blocks`/2, `bytesrgb`/3, `channels`/2, `mipmaps`/2, `palettebits`/1, `pixels`/2, `stride`/2 |
| `invoice` | `combos`/2, `discount`/2, `duedays`/2, `lineitems`/2, `overdue`/2, `subtotal`/2, `tax`/2, `total`/2 |
| `job` | `agents`/2, `discover`/1, `makespan`/2, `messages`/1, `optimal`/1, `rounds`/1, `slice`/2, `speedup`/2 |
| `kin` | `biorhythm`/3, `bits`/1, `combinations`/1, `crossed`/2, `cycle`/1, `digitalRoot`/1, `dootKin`/3, `dreamspellDrift`/1, `enneagram`/0, `kin`/2, `period`/1, `pillar`/2, `seal`/1, `tone`/1, `vortex`/1 |
| `law` | `deadline`/2, `fidelity`/2, `lawful`/1, `limitation`/1, `majority`/2, `notice`/2, `quorum`/2, `redirected`/2, `remedy`/2, `removable`/3, `reviewed`/1, `standing`/1, `supermajority`/3, `violation`/1 |
| `ledger` | `accounts`/2, `balance`/2, `combos`/2, `credits`/2, `debits`/2, `entries`/2, `periods`/2, `reconciled`/2 |
| `lever` | `advantage`/2, `arm`/2, `classes`/2, `combos`/2, `effort`/2, `load`/2, `moment`/2, `ratio`/2 |
| `licensing` | `compliance`/2, `entitlement`/2, `overage`/2, `renewal`/2, `seats`/2, `term`/2, `truecost`/2, `utilization`/2 |
| `loan` | `amortization`/2, `combos`/2, `interest`/2, `ltv`/2, `payment`/2, `points`/2, `principal`/2, `term`/2 |
| `matrix` | `adds`/2, `combos`/2, `determinant`/2, `elements`/2, `mults`/3, `rank`/2, `trace`/2, `transpose`/2 |
| `merkaba` | `coil`/1, `develop`/3, `flows`/1, `merkaba`/3, `mirror`/3, `rosetta`/1, `spin`/3, `star`/1, `steps`/3, `torus`/3, `trinity`/3 |
| `metabolism` | `atp`/2, `bmr`/2, `calories`/2, `combos`/2, `enzymes`/2, `glucose`/2, `oxygen`/2, `pathways`/2 |
| `modular` | `classes`/2, `combos`/2, `gcd`/2, `inverse`/2, `order`/2, `power`/1, `residue`/2, `ring`/2 |
| `moon` | `combos`/2, `craters`/2, `diameter`/2, `distance`/2, `libration`/2, `period`/2, `phase`/2, `tides`/2 |
| `mutation` | `combos`/2, `frequency`/2, `generations`/2, `hotspots`/2, `rate`/2, `silent`/2, `substitutions`/2, `types`/2 |
| `nebula` | `combos`/2, `density`/2, `ionization`/2, `lightyears`/2, `radius`/2, `stars`/2, `temperature`/2, `types`/2 |
| `neuron` | `axonlength`/2, `combos`/2, `dendrites`/2, `layers`/2, `refractory`/2, `spikes`/2, `synapses`/2, `threshold`/2 |
| `np` | `edgeBit`/2, `isSpace`/1, `isTime`/1, `reachGcd`/1, `sparseWidth`/1, `subsetSum`/2 |
| `numen` | `depth`/1, `master`/1, `mirror`/1, `nine`/1, `palindrome`/1, `reduce`/1, `root`/1 |
| `optics` | `aperturesteps`/1, `dpi`/2, `elements`/2, `fnumber`/2, `fov`/2, `magnify`/2, `megapixels`/2, `resolution`/2 |
| `option` | `breakeven`/2, `combos`/2, `contracts`/2, `expiry`/2, `greeks`/2, `intrinsic`/2, `premium`/2, `strike`/2 |
| `packet` | `checksum`/2, `flags`/1, `fragments`/2, `headerbits`/2, `mtu`/2, `pairs`/2, `payload`/2, `throughput`/2 |
| `patent` | `claims`/2, `damages`/2, `infringement`/2, `maintenance`/2, `novelty`/1, `priority`/1, `royalty`/2, `term`/2 |
| `path` | `allPaths`/0, `anomalyToResponse`/0, `dataFlowCompressML`/0, `executePath`/2, `obsToAction`/0, `performanceToMetrics`/0, `qualityToRisk`/0, `quantumSecurityChain`/0, `secureDataPathQSec`/0 |
| `pathogen` | `combos`/2, `generations`/2, `incubation`/2, `mortality`/2, `r0`/2, `reservoir`/2, `strains`/2, `transmission`/2 |
| `payroll` | `combos`/2, `deductions`/2, `employees`/2, `gross`/2, `net`/2, `overtime`/2, `periods`/2, `withholding`/2 |
| `pendulum` | `amplitude`/2, `bobmass`/2, `combos`/2, `energy`/2, `frequency`/2, `length`/2, `period`/2, `swings`/2 |
| `piston` | `bore`/2, `combos`/2, `compression`/2, `cycles`/2, `displacement`/2, `force`/2, `rings`/2, `stroke`/2 |
| `planet` | `axialtilt`/2, `combos`/2, `day`/2, `gravity`/2, `moons`/2, `orbit`/2, `radius`/2, `rings`/2 |
| `polymer` | `branches`/2, `chains`/2, `combos`/2, `crosslinks`/2, `degree`/2, `molweight`/2, `monomers`/2, `tg`/2 |
| `port` | `align`/2, `layout`/1, `long`/1, `magic`/1, `offset`/2, `pad`/2, `swap`/2, `word`/1 |
| `prime` | `combos`/2, `count`/2, `factors`/2, `gaps`/2, `product`/2, `sieve`/2, `totient`/2, `twins`/2 |
| `projectile` | `angle`/2, `arc`/2, `combos`/2, `height`/2, `impact`/2, `range`/2, `time`/2, `velocity`/2 |
| `protein` | `bonds`/2, `combos`/2, `contacts`/2, `domains`/2, `foldstates`/1, `helices`/2, `mass`/2, `residues`/2 |
| `protocol` | `combos`/2, `handshakes`/2, `headers`/2, `layers`/2, `messages`/2, `opcodes`/1, `states`/2, `versions`/2 |
| `pulley` | `advantage`/2, `combos`/2, `effort`/2, `load`/2, `ratio`/2, `segments`/2, `tension`/2, `wheels`/2 |
| `pump` | `combos`/2, `efficiency`/2, `flow`/2, `head`/2, `impellers`/2, `power`/2, `stages`/2, `throughput`/2 |
| `qpu` | `qpu_quantum`/0, `qpu_lean`/0, `qpu_cite`/0, `qpu_train`/0, `qpu_forge`/0, `qpu_improve`/0, `qpu_compete`/0, `qpu_prove`/0 |
| `Qpu.Coil` | `theory`/0, `practice`/0, `coil`/0 |
| `Qpu.Hybrid` | `kvCost`/0, `r2Cost`/0, `hybridCost`/0, `kvSpeed`/0, `r2Speed`/0, `hybridSpeed`/0 |
| `Qpu.Lattice` | `n`/0, `seed`/0, `coins`/0, `scanner`/0, `radar`/0, `rays`/0, `vertices`/0, `hexbit`/0, `bits`/0, `faces`/0, `amplitudes`/0, `fused`/0, `plane`/0 |
| `Qpu.Mint` | `mintOf`/1, `chooseOf`/2 |
| `Qpu.Physics` | `planck`/0, `boltzmann`/0, `transmon`/0, `photon`/0, `thermal`/1, `bcs`/0, `aluminium`/0, `niobium`/0, `gap`/1 |
| `Qpu.Shor` | `powMod`/3, `periodOf`/2, `gcdOf`/2, `half`/2 |
| `queue` | `arrivals`/2, `combos`/2, `depth`/2, `latency`/2, `service`/2, `slots`/1, `throughput`/2, `waittime`/2 |
| `radar` | `channels`/1, `dwell`/2, `pairs`/2, `pulses`/2, `range`/2, `resolution`/2, `sweeps`/2, `targets`/2 |
| `record` | `arxiv`/1, `collisions`/1, `funding`/1, `jobs`/1, `law`/1, `site`/1 |
| `reliability` | `availability`/2, `failurerate`/2, `mtbf`/2, `mttr`/2, `nines`/2, `redundancy`/2, `reliability`/2, `survival`/2 |
| `remediation` | `cleanup`/2, `contaminant`/2, `dilution`/2, `exposure`/2, `halflife`/2, `reduction`/2, `threshold`/2, `volume`/3 |
| `rotation` | `angular`/2, `combos`/2, `inertia`/2, `radians`/2, `revolutions`/2, `rpm`/2, `spokes`/2, `torque`/2 |
| `router` | `combos`/2, `hops`/2, `interfaces`/2, `latency`/2, `queues`/2, `routes`/2, `tables`/2, `ttl`/2 |
| `rule` | `cap`/0, `compositions`/1, `families`/0, `formulas`/0, `free`/1, `named`/0, `nibbles`/1, `over`/0, `slice`/0, `truncated`/1 |
| `satellite` | `altitude`/2, `bands`/2, `combos`/2, `constellation`/2, `coverage`/2, `inclination`/2, `period`/2, `velocity`/2 |
| `scale` | `flesch`/3, `hounsfield`/1, `pclr`/1, `polygraph`/1, `static99`/1, `stature`/1 |
| `signal` | `detection`/1, `hops`/3, `keyBits`/1, `keyspace`/1, `qber`/2, `siftedBits`/1 |
| `socket` | `backlog`/2, `buffers`/2, `combos`/2, `connections`/2, `handshake`/2, `ports`/1, `states`/2, `timeout`/2 |
| `software` | `coverage`/2, `cyclomatic`/2, `defects`/2, `flags`/1, `hours`/1, `kloc`/1, `semver`/3, `velocity`/2 |
| `solar` | `array`/2, `combos`/2, `daily`/2, `efficiency`/2, `irradiance`/2, `output`/2, `panels`/2, `strings`/2 |
| `solvent` | `combos`/2, `dilution`/2, `layers`/2, `molarity`/2, `ph`/2, `polarity`/2, `solubility`/2, `volume`/2 |
| `sort` | `combos`/2, `comparisons`/2, `depth`/2, `merges`/2, `partitions`/1, `passes`/2, `runs`/2, `swaps`/2 |
| `split` | `coprime`/2, `factor`/1, `free`/2, `join`/2, `kelvin`/2, `landauer`/1, `least`/1, `omega`/1, `piHex`/1, `prime`/1, `primes`/1, `quantum`/2, `secondlaw`/1, `totient`/1, `violation`/2 |
| `spring` | `coils`/2, `combos`/2, `constant`/2, `deflection`/2, `energy`/2, `force`/2, `parallelsum`/2, `series`/2 |
| `star` | `classes`/2, `combos`/2, `lifetime`/2, `luminosity`/2, `magnitude`/2, `mass`/2, `parsecs`/2, `radius`/2 |
| `stream` | `backpressure`/2, `buffers`/2, `chunks`/2, `combos`/2, `pipes`/2, `segments`/2, `throughput`/2, `windows`/2 |
| `survey` | `angles`/3, `arcseconds`/2, `area`/2, `bearings`/2, `combos`/2, `gridcells`/2, `stations`/2, `traverse`/2 |
| `synapse` | `cleft`/2, `combos`/2, `delay`/2, `plasticity`/2, `receptors`/2, `strength`/2, `transmitters`/2, `vesicles`/2 |
| `synthesis` | `candidates`/2, `effort`/2, `examples`/2, `length`/2, `paths`/1, `rewrites`/2, `tokens`/2, `vocabulary`/2 |
| `tax` | `bracket`/2, `brackets`/2, `combos`/2, `credits`/2, `deductions`/2, `effective`/2, `liability`/2, `taxable`/2 |
| `telescope` | `aperture`/2, `combos`/2, `fieldofview`/2, `focalratio`/2, `lightgrasp`/2, `magnification`/2, `mirrors`/2, `resolution`/2 |
| `tesla` | `earth`/1, `energy`/2, `field`/2, `period`/1, `quarter`/1, `resonance`/2, `schumann`/1, `slip`/2, `sync`/2, `turns`/2, `windings`/2 |
| `text` | `base64`/2, `bytes`/2, `chunks`/2, `entropybits`/2, `lines`/2, `pairs`/2, `tokens`/2, `words`/2 |
| `tls` | `certchain`/2, `combos`/2, `handshake`/2, `keybits`/1, `resumption`/2, `sessions`/2, `suites`/2, `ticketlife`/2 |
| `torsion` | `angle`/2, `combos`/2, `modulus`/2, `radius`/2, `sections`/2, `shear`/2, `torque`/2, `twist`/2 |
| `tree` | `children`/2, `depth`/2, `height`/2, `internal`/2, `leaves`/1, `nodes`/2, `paths`/2, `subsets`/1 |
| `tune` | `cents`/2, `fifth`/1, `fractal`/1, `fundamental`/0, `harmonic`/1, `octave`/1, `wavelength`/1 |
| `vaccine` | `antigens`/2, `batches`/2, `boosters`/2, `coldchain`/2, `combos`/2, `coverage`/2, `doses`/2, `efficacy`/2 |
| `vector` | `combos`/2, `components`/2, `crossprod`/3, `dims`/2, `dot`/2, `magnitude`/2, `norm`/2, `scale`/2 |
| `wave` | `agents`/1, `bill`/3, `combo`/3, `massive`/1, `remote`/1, `saved`/1, `sweep`/1, `wave`/2, `waves`/1 |
| `wind` | `blades`/2, `capacity`/2, `farm`/2, `pairs`/2, `power`/3, `rated`/2, `tipratio`/2, `turbines`/2 |
| `xai` | `anchors`/1, `attributions`/2, `baselines`/1, `coalitions`/1, `heads`/2, `interactions`/1, `limeSamples`/2, `saliency`/2 |
| `yi` | `change`/2, `complement`/1, `figures`/1, `inverse`/1, `lower`/1, `nuclear`/1, `upper`/1, `withYang`/1, `yang`/1 |
| `zeroshot` | `attributes`/2, `comparisons`/2, `embeddings`/2, `partitions`/2, `prompts`/2, `seenClasses`/2, `signatures`/1, `transferPairs`/2 |

Each `name`/`arity` above is one tool: a formula of that many parameters, callable as `npm run mcp -- <family>.<name> '[…]'`. Every value is an exact integer a Lean kernel can check — no estimate, no coverage percentage, no wall clock.
