import { program } from '../../../../../../../../index.ts'
const handle = '4aa1113d'
const aspect = { side: 'deploy' as const, name: 'smoke' }
export default program(handle)
export { handle, aspect }
