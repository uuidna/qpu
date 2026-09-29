/**
 * Adapters Module
 * Backward-compatible bridges from old APIs to new core module
 */

export { clayProblemSolver } from './clay-adapter.js'
export { leadsTrackingSystem } from './leads-adapter.js'
export { citationsSystem } from './citations-adapter.js'

export default {
  clay: () => import('./clay-adapter.js').then(m => m.default),
  leads: () => import('./leads-adapter.js').then(m => m.default),
  citations: () => import('./citations-adapter.js').then(m => m.default)
}
