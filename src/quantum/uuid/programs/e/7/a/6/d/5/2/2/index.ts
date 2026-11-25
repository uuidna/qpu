// Quantum OS. Each system is imported from its own source.
// Alpine packages are asked by name.

import alpine from '../../../../../../../../7/e/f/9/8/4/6/8/index.ts'
import { portPackages } from '../../../../../../../../2/4/a/2/d/a/5/c/index.ts'
import debian from '../../../../../../../e/c/c/f/9/b/a/index.ts'
import ubuntu from '../../../../../../../../c/a/a/c/7/1/f/b/index.ts'

const os = { alpine, debian, ubuntu, packages: portPackages }

export default os
