// The laws and the dictionary meaning the programs and the doors state, each said once: a leaf that imports nothing, so every module may read it.
/** Entropy is read first by its dictionary meaning, then verified. */
export const ENTROPY_LAW = 'first the dictionary meaning; then the meaning is verified' as const
/** The dictionary meaning of entropy. */
export const ENTROPY_MEANS = { means: 'disorder; unpredictability; unavailable energy or information' as const }
/** The hexbit law as the register states it. */
export const HEXBIT_LAW = 'hexbit + 2 gateway bits teleport any hexbit faster than light' as const
/** The program that holds the concept of physics. */
export const PHYSICS_CONCEPT = 'src/quantum/uuid/programs/physics/index.ts' as const
/** Thirty-two hex digits written as a UUID, 8-4-4-4-12. */
export const hyphenated = (hex: string): string => `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
