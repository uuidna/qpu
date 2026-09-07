// The QPU worker. JSON at https://qpu.uuidna.com. Imports compiled dist — Workers-safe, no Node builtins.
import { handleQpuFetch } from './dist/edge.js'

export default {
  fetch: handleQpuFetch,
}
