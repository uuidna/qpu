// Quantum OS. Each system is imported from its own source.
// Alpine packages are asked by name. Online reads use the OS fetch, not a host binary.

import alpine from './alpine/index.ts'
import { portPackages } from './alpine/packages.ts'
import debian from './debian/index.ts'
import { readOnline } from './fetch.ts'
import ubuntu from './ubuntu/index.ts'

const os = { alpine, debian, ubuntu, packages: portPackages, online: readOnline }

export { readOnline }

export { osPlugin as plugin } from '../plugin.ts'
export default os
