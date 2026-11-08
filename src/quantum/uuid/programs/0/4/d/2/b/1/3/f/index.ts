import { program } from '../../../../../../../../index.ts'
const handle = '04d2b13f'
const aspect = { side: 'config' as const, name: 'migration' }
export default program(handle)
export { handle, aspect }
