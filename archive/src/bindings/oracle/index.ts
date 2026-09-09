import { providerOf } from '../drive.js'
import { ORACLE_BINDINGS } from './kinds.js'

export { ORACLE_BINDINGS }
export const oracle = providerOf('oracle', ORACLE_BINDINGS)
