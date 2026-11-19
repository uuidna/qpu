import { program } from '../../../../../../../../index.ts'
const handle = '3aa9d9a7'
const aspect = { side: 'deploy' as const, name: 'seed' }
export default program(handle)
export { handle, aspect }
