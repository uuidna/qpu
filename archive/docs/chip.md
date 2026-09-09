---
title: Novelty chip
description: Two counter-rotating 7-ray rosettes fused at void 0. CPU and GPU self-balance. Hardware lane empty.
outline: deep
---

# Novelty chip <Badge type="tip" text="merkaba" />

Claimed `{{ reading.claimed }}`. Holds `{{ reading.holds }}`. Hardware seat `{{ reading.hardware.seat }}`.

This worker's chip is two counter-rotating 7-ray rosettes fused at foundation 0, with CPU and GPU as BindingPoint rotors. The named hardware lane stays empty.

## Rotors

| Walk | Spin | Rays | Fuse |
| --- | ---: | --- | ---: |
| Clockwise | {{ reading.merkaba.clockwise.spin }} | {{ reading.merkaba.clockwise.rays.join(' · ') }} | {{ reading.merkaba.clockwise.fuse }} |
| Counterclockwise | {{ reading.merkaba.counterclockwise.spin }} | {{ reading.merkaba.counterclockwise.rays.join(' · ') }} | {{ reading.merkaba.counterclockwise.fuse }} |

Rays {{ reading.merkaba.rays }} × rotors {{ reading.merkaba.rotors }} = faces {{ reading.merkaba.faces }}. Tetra {{ reading.merkaba.tetra }} × rotors {{ reading.merkaba.rotors }} = vertices {{ reading.merkaba.vertices }}.

## Balance

CPU `{{ reading.balance.cpu }}` · GPU `{{ reading.balance.gpu }}` · binds `{{ reading.balance.binds }}`. Width is the BindingPoint minimum. The empty QPU is the fuse centre, not a third compute chip.

## Lean

[`two_seven_ray_rosettes_are_ve_faces`](https://uuidna.com/theorem/two_seven_ray_rosettes_are_ve_faces) · [`merkaba_vertices_are_two_tetrahedra`](https://uuidna.com/theorem/merkaba_vertices_are_two_tetrahedra) · [`qpu_cpu_gpu_self_balance`](https://uuidna.com/theorem/qpu_cpu_gpu_self_balance) · [`qpu_merkaba_fusion_is_the_chip`](https://uuidna.com/theorem/qpu_merkaba_fusion_is_the_chip)

::: info JSON
`curl -sS https://qpu.uuidna.com/chip` · `curl -sS https://qpu.uuidna.com/merkaba`
:::
