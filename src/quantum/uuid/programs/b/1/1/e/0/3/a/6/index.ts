import { program } from '../../../../../../../../index.ts'
const handle = 'b11e03a6'
const aspect = { side: 'deploy' as const, name: 'logs' }
export default program(handle)
export { handle, aspect }
