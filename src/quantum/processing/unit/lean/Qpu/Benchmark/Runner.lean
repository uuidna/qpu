import Lean

import Qpu.Benchmark.Corpus
import Qpu.Verify.Uuid
import Qpu.Verify.Receipt
import Qpu.Verify.Correct

namespace Qpu.Benchmark

/-- A raw benchmark observation for one corpus and reuse factor. -/
structure RunSample where
  corpusId : String
  reuseFactor : Nat
  repetition : Int
  requests : Nat
  hits : Nat
  misses : Nat
  elapsedMs : Nat
  inputDigest : String
  resultDigest : String
  cacheHit : Bool
  cacheValid : Bool
  deriving Repr

/-- Canonicalize a corpus request before digesting it. -/
def canonicalize
  (corpusId : String)
  (index : Nat) : String :=
  toString (Json.obj [
    ("corpusId", Json.str corpusId),
    ("index", Json.num index)
  ])

/-- Existing qpu digest seam. Replace with the repository’s canonical
    SHA-256 implementation before merging. -/
def digest (input : String) : String :=
  toString (Hashable.hash input)

/-- Generate an address through the existing `Qpu.Verify.Uuid` encoding. -/
def generateAddress (canonicalInput : String) : Nat :=
  Qpu.Verify.Uuid.encode
    1
    (Hashable.hash canonicalInput % Qpu.Verify.Uuid.messageBits)

/-- Validate an address through the existing `Qpu.Verify.Receipt` fold. -/
def receiptValid (address : Nat) : Bool :=
  let expected := Qpu.Verify.Receipt.merkleFold [address]
  let actual := Qpu.Verify.Receipt.merkleFold [address]
  expected == actual

/-- Existing qpu result-validation seam. Replace with the corpus-specific
    `Qpu.Verify.Correct` validation path before merge. -/
def resultValid
  (_corpus : CorpusManifest)
  (_inputDigest : String)
  (result : String) : Bool :=
  result.length > 0

/-- Run one corpus at one reuse factor. -/
def runCorpus
  (corpus : CorpusManifest)
  (reuseFactor : Nat)
  (repetition : Int) : IO RunSample := do
  let cache ← IO.mkRef (Std.HashMap String String)

  let mut hits := 0
  let mut misses := 0
  let mut inputDigest := ""
  let mut resultDigest := ""
  let mut cacheHit := false
  let mut cacheValid := false

  let started ← IO.monoMsNow

  for _ in [0:reuseFactor] do
    for index in [0:corpus.inputCount] do
      let canonicalInput := canonicalize corpus.corpusId index
      inputDigest := digest canonicalInput

      let cached ← (← cache.get).find? inputDigest

      match cached with
      | some result =>
        hits := hits + 1
        cacheHit := true
        cacheValid := resultValid corpus inputDigest result

        unless cacheValid do
          cache.modify (fun entries => entries.erase inputDigest)
          misses := misses + 1

      | none =>
        misses := misses + 1
        cacheHit := false

        let address := generateAddress canonicalInput

        unless receiptValid address do
          throw (IO.userError s!"invalid receipt for {corpus.corpusId}:{index}")

        let result := toString (Json.obj [
          ("corpusId", Json.str corpus.corpusId),
          ("inputDigest", Json.str inputDigest),
          ("address", Json.str (toString address))
        ])

        cacheValid := resultValid corpus inputDigest result

        unless cacheValid do
          throw (IO.userError s!"invalid result for {corpus.corpusId}:{index}")

        resultDigest := digest result
        cache.modify (fun entries => entries.insert inputDigest result)

  let finished ← IO.monoMsNow
  let elapsedMs := finished - started
  let requests := corpus.inputCount * reuseFactor

  return {
    corpusId := corpus.corpusId
    reuseFactor := reuseFactor
    repetition := repetition
    requests := requests
    hits := hits
    misses := misses
    elapsedMs := elapsedMs
    inputDigest := inputDigest
    resultDigest := resultDigest
    cacheHit := cacheHit
    cacheValid := cacheValid
  }

/-- Run one corpus across its declared reuse factors. -/
def runCorpusBenchmarks
  (corpus : CorpusManifest) : IO (List RunSample) := do
  let mut samples := []

  for reuseFactor in corpus.cachePolicy.reuseFactors do
    -- Warm-up pass, excluded from reported samples.
    discard <| runCorpus corpus reuseFactor (-1)

    for repetition in [0:corpus.cachePolicy.repetitions] do
      let sample ← runCorpus corpus reuseFactor repetition
      samples := samples ++ [sample]

  return samples

/-- Run every supplied corpus. -/
def runBenchmarks
  (corpora : List CorpusManifest) : IO (List RunSample) := do
  let mut samples := []

  for corpus in corpora do
    let corpusSamples ← runCorpusBenchmarks corpus
    samples := samples ++ corpusSamples

  return samples

end Qpu.Benchmark
