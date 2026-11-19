import { program } from '../../../../../../../../index.ts'
const handle = '0271e45f'
const aspect = { side: 'config' as const, name: 'mcp' }
export default program(handle)
export { handle, aspect }
