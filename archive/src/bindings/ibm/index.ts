import { providerOf } from '../drive.js'
import { IBM_BINDINGS } from './kinds.js'

export { IBM_BINDINGS }
export const ibm = providerOf('ibm', IBM_BINDINGS)
