import { program } from '../../../../../../../../index.ts'
const handle = '72b07375'
const aspect = { side: 'deploy' as const, name: 'database' }
export default program(handle)
export { handle, aspect }
