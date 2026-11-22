import { program } from '../../../../../../../../index.ts'
const handle = 'd40237d6'
const aspect = { side: 'deploy' as const, name: 'worker' }
export default program(handle)
export { handle, aspect }
