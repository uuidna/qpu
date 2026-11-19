import { program } from '../../../../../../../../index.ts'
const handle = '21378483'
const aspect = { side: 'config' as const, name: 'policies' }
export default program(handle)
export { handle, aspect }
