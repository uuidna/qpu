// Quantum OS. Each system is imported from its own source.
// Alpine packages are asked by name.

import alpine from './alpine/index.ts'
import { portPackages } from './alpine/packages.ts'
import debian from './debian/index.ts'
import ubuntu from './ubuntu/index.ts'

const os = { alpine, debian, ubuntu, packages: portPackages }

export default os
