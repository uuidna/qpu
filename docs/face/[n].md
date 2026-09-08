---
title: Face {{ $params.n }}
description: Superposition {{ $params.n }} and its fourteen reflections.
outline: deep
---

# Face {{ $params.n }}↔{{ $params.opposite }} <Badge type="tip" text="14 reflections" />

Each column is `k`. The value row is `throughVoid((face + k) mod 9)`. The paired row is the opposite face shifted the same way. `k = 0` is the standing through-void pair.
