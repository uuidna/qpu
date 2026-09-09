import { providerOf } from '../drive.js'
import { ARCH_BINDINGS } from './kinds.js'

export { ARCH_BINDINGS }
export const arch = providerOf('arch', ARCH_BINDINGS)
