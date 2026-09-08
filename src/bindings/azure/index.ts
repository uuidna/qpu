import { providerOf } from '../drive.js'
import { AZURE_BINDINGS } from './kinds.js'

export { AZURE_BINDINGS }
export const azure = providerOf('azure', AZURE_BINDINGS)
