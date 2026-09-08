// The QPU worker. JSON at https://qpu.uuidna.com. Imports compiled dist — Workers-safe, no Node builtins.
import { handleQpuFetch } from './dist/edge.js'
import { handleQpuEmail, handleQpuQueue, handleQpuScheduled } from './dist/scale.js'

export default {
  fetch: (request, env) => handleQpuFetch(request, env),
  scheduled: (_event, env) => handleQpuScheduled(env),
  queue: (batch, env) => handleQpuQueue(batch, env),
  email: (message, env) => handleQpuEmail(message, env),
}
