// The repositories of the quantumlib GitHub organization, as its repository list states them. Each description is the
// repository's own one-line description; the language is the primary language the list shows. Cirq, qsim, Qualtran and the
// OpenFermion family are the ones this repository implements or names elsewhere.
import { TABLES } from './tables-index.ts'

type Repository = { name: string; description: string; language: string }

export const REPOSITORIES: readonly Repository[] = TABLES.REPOSITORIES as readonly Repository[]
