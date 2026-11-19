import { program } from '../../../../../../../../index.ts'
const handle = '5a30fa13'
const aspect = { side: 'deploy' as const, name: 'app' }
export default program(handle)
export { handle, aspect }
