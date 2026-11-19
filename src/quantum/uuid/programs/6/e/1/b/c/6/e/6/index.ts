import { program } from '../../../../../../../../index.ts'
const handle = '6e1bc6e6'
const aspect = { side: 'deploy' as const, name: 'check' }
export default program(handle)
export { handle, aspect }
