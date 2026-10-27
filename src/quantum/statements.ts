// The statements quantumai.google and its linked PDF make, as the pages state them. Each text is a quotation or a faithful
// summary of one passage; the source for each is named beside it in leads.ts.
import { TABLES } from './tables-index.ts'

export const STATEMENTS = TABLES.STATEMENTS

export type StatementTopic = keyof typeof STATEMENTS

/** The five open-source tools the Software page names, as it describes them. Only Cirq is implemented in this repository. */
export const SOFTWARE: readonly { name: string; description: string; implemented: boolean }[] = TABLES.SOFTWARE as readonly { name: string; description: string; implemented: boolean }[]
