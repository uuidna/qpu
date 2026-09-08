import { providerOf } from '../drive.js'
import { GOOGLE_BINDINGS } from './kinds.js'

export { GOOGLE_BINDINGS }
export const google = providerOf('google', GOOGLE_BINDINGS)
