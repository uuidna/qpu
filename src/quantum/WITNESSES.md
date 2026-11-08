# Witnesses

The fourteen faces around a UUID, and the merge of two such sets. The faces are [`witnesses.ts`](processing/witnesses.ts). The coins are `mintWitnessCoins` in [`billing.ts`](processing/toolboxes/billing.ts). The door is `verify`. The detailed specification is [`README.md`](README.md). The Clay register is [`CLAY.md`](CLAY.md).

A face is a UUID built from the same handle, program, and tail. Six squares rotate the program by one to six places. Eight triangles reflect exactly one of the eight handle nibbles by σ, where a nibble x becomes 15 − x. σ twice is the nibble again. A rotation is undone by rotating the rest of the way around the program. Each of the fourteen maps back to the canonical UUID, the address `uuidFromParts` rebuilds from those parts. `isCanonical` is true when the given UUID is that rebuild. A program that repeats under rotation makes two faces the same address, and `duplicates` counts them. A rotation-symmetric program puts the UUID itself among its faces.

`verify` with `witnesses` set to one UUID returns that check: 14 faces, 6 squares, 8 triangles, and whether every face maps back. Omit every argument and the call does not run. The phase is `unlimited`, at 432 Hz.

`verify` with `witnesses` set to `{ referrer, destination }` merges the two sets. A side whose seal does not hold is named in `invalid`, contributes no faces, and throws nothing. When both seals hold, `shared` is the addresses that appear in both sets, counted once. `distinct` is the number of different addresses across both. `of` is 28.

Each shared address is one coin, credited to `coins:author` at amount 0. The debit is `work:deduplicated`. The count is free work. Money moves when Stripe settles a coil. `mintWitnessCoins` books a coin only for a witness that passes. A string that is not a sealed UUID is contradicted and books nothing. A named content, predecessor, or successor that is absent is missing and books nothing. The journal balances: the sum of the amounts is 0 and the sum of the counts is 0.

A token is one coil and two reflecting coin UUIDs. Their merge shares exactly two witnesses, and one of those two is the coil UUID. The mint books two coins.

`verify` with `move` set to a positive integer k walks the superposition of 2k witnesses. The span is 2k. The neighbours are 2(k − 1) and 2(k + 1). The move pays one coin down and collects one coin up, so the net is 0. The clocks are 12 and 24. The calendars are 7, 12, and 16. A reach that equals one of those is the clock or calendar the move covers. At k = 7 the reaches are 12, 14, and 16. Their digital-root seeds are 3, 5, and 7. The centre seed 5 is fixed, and the neighbours sum to 10.
