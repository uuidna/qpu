// Apps. The calculator is imported from the neighbouring index.

import calculator from './calculator/index.ts'

export { calculator, div, mod, mul, add, natSub, pow, divide, calculate } from './calculator/index.ts'
export { recognise } from './chess/index.ts'
export { appsPlugin as plugin } from '../plugin.ts'
export default calculator
