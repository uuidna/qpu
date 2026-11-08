import { program } from '../../../../../../../../index.ts'
const handle = '32b84833'
const aspect = { side: 'config' as const, name: 'access' }
export default program(handle)
export { handle, aspect }
