import { providerOf } from '../drive.js'
import { HARDWARE_BINDINGS } from './kinds.js'

export { HARDWARE_BINDINGS }
/** Chip seat `qpu` never binds. CPU/GPU/RAM/CACHE/STORAGE and peripherals auto-recognize. */
export const hardware = providerOf('hardware', HARDWARE_BINDINGS, (kind) => kind === 'qpu')
