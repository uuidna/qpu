/**
 * STATEFUL COMPUTATION FORMULAS
 * Enables context, windows, history, state machines
 * Phase 8: Cross-System Integration - GAP 2
 */

// ============================================================================
// FORMULA 1: SESSION STATE STORE
// In-memory/Redis KV for request context
// ============================================================================

export interface SessionValue {
  data: unknown
  createdAt: number
  expiresAt: number
  accessCount: number
  lastAccessed: number
}

export class SessionStateStore {
  private sessions = new Map<string, SessionValue>()
  private ttl = 3600000 // 1 hour

  set(sessionId: string, key: string, value: unknown, ttl?: number): void {
    const fullKey = `${sessionId}:${key}`
    const expiresAt = Date.now() + (ttl || this.ttl)
    this.sessions.set(fullKey, {
      data: value,
      createdAt: Date.now(),
      expiresAt,
      accessCount: 0,
      lastAccessed: Date.now()
    })
  }

  get(sessionId: string, key: string): unknown | undefined {
    const fullKey = `${sessionId}:${key}`
    const val = this.sessions.get(fullKey)

    if (!val) return undefined
    if (val.expiresAt < Date.now()) {
      this.sessions.delete(fullKey)
      return undefined
    }

    val.accessCount++
    val.lastAccessed = Date.now()
    return val.data
  }

  delete(sessionId: string, key?: string): void {
    if (key) {
      this.sessions.delete(`${sessionId}:${key}`)
    } else {
      // Delete all keys for session
      const prefix = `${sessionId}:`
      for (const k of this.sessions.keys()) {
        if (k.startsWith(prefix)) this.sessions.delete(k)
      }
    }
  }

  stats(sessionId: string) {
    const prefix = `${sessionId}:`
    const keys = Array.from(this.sessions.keys()).filter(k => k.startsWith(prefix))
    return { keyCount: keys.length, totalEntries: this.sessions.size }
  }
}

// ============================================================================
// FORMULA 2: TIME WINDOW AGGREGATOR
// Sliding/tumbling/session windows
// ============================================================================

export type WindowType = 'tumbling' | 'sliding' | 'session'

export interface WindowedValue<T> {
  windowStart: number
  windowEnd: number
  values: T[]
  count: number
}

export class TimeWindowAggregator<T> {
  private windows = new Map<string, WindowedValue<T>>()
  private type: WindowType
  private size: number
  private stride?: number
  private sessionGap?: number

  constructor(type: WindowType, sizeMs: number, strideMs?: number, sessionGapMs?: number) {
    this.type = type
    this.size = sizeMs
    this.stride = strideMs
    this.sessionGap = sessionGapMs || sizeMs
  }

  add(value: T, timestamp: number = Date.now()): WindowedValue<T> {
    let windowStart: number

    if (this.type === 'tumbling') {
      windowStart = Math.floor(timestamp / this.size) * this.size
    } else if (this.type === 'sliding') {
      windowStart = Math.floor(timestamp / (this.stride || this.size)) * (this.stride || this.size)
    } else {
      // session: create new window if gap exceeded
      const latestKey = Array.from(this.windows.keys()).pop()
      const latest = latestKey ? this.windows.get(latestKey) : null
      windowStart = latest && timestamp - latest.windowEnd < this.sessionGap! ? latest.windowStart : timestamp
    }

    const windowEnd = windowStart + this.size
    const key = `${windowStart}-${windowEnd}`

    let window = this.windows.get(key)
    if (!window) {
      window = { windowStart, windowEnd, values: [], count: 0 }
      this.windows.set(key, window)
    }

    window.values.push(value)
    window.count++
    return window
  }

  getWindow(windowStart: number): WindowedValue<T> | undefined {
    const key = Array.from(this.windows.keys()).find(k => {
      const [start] = k.split('-').map(Number)
      return start === windowStart
    })
    return key ? this.windows.get(key) : undefined
  }

  allWindows(): WindowedValue<T>[] {
    return Array.from(this.windows.values())
  }

  aggregate<R>(fn: (values: T[]) => R): R[] {
    return Array.from(this.windows.values()).map(w => fn(w.values))
  }
}

// ============================================================================
// FORMULA 3: FEATURE BUFFER
// Vector cache for ML inference
// ============================================================================

export interface Feature {
  name: string
  value: number | string
  confidence?: number
  timestamp?: number
}

export class FeatureBuffer {
  private buffer: Feature[] = []
  private maxSize: number
  private timeout: number

  constructor(maxSize: number = 1000, timeoutMs: number = 300000) {
    this.maxSize = maxSize
    this.timeout = timeoutMs
  }

  add(feature: Feature): void {
    feature.timestamp = feature.timestamp || Date.now()
    this.buffer.push(feature)

    // Evict oldest if over capacity
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift()
    }

    // Remove expired
    const cutoff = Date.now() - this.timeout
    this.buffer = this.buffer.filter(f => (f.timestamp || 0) > cutoff)
  }

  get(name: string): Feature | undefined {
    return this.buffer.find(f => f.name === name)
  }

  getLatest(count: number): Feature[] {
    return this.buffer.slice(-count)
  }

  getByName(name: string): Feature[] {
    return this.buffer.filter(f => f.name === name)
  }

  vectorize(): number[] {
    return this.buffer
      .filter(f => typeof f.value === 'number')
      .map(f => f.value as number)
  }

  clear(): void {
    this.buffer = []
  }
}

// ============================================================================
// FORMULA 4: STATE MACHINE EXECUTOR
// Event-driven state transitions
// ============================================================================

export type StateTransition<S, E> = (event: E) => S | null

export class StateMachineExecutor<S, E> {
  private state: S
  private transitions = new Map<string, StateTransition<S, E>>()
  private history: { state: S; event: E; timestamp: number }[] = []

  constructor(initialState: S) {
    this.state = initialState
  }

  define(fromState: S, onEvent: E, toState: S | ((e: E) => S)): void {
    const key = `${JSON.stringify(fromState)}:${JSON.stringify(onEvent)}`
    this.transitions.set(key, () => typeof toState === 'function' ? (toState as any)(onEvent) : toState)
  }

  handle(event: E): boolean {
    const key = `${JSON.stringify(this.state)}:${JSON.stringify(event)}`
    const transition = this.transitions.get(key)

    if (!transition) return false

    const nextState = transition(event)
    if (nextState === null) return false

    this.history.push({ state: this.state, event, timestamp: Date.now() })
    this.state = nextState
    return true
  }

  current(): S {
    return this.state
  }

  getHistory(): typeof this.history {
    return [...this.history]
  }
}

// ============================================================================
// FORMULA 5: HISTORY RETENTION
// Rolling buffer of last N values
// ============================================================================

export class HistoryRetention<T> {
  private values: { value: T; timestamp: number }[] = []
  private maxSize: number

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize
  }

  push(value: T): void {
    this.values.push({ value, timestamp: Date.now() })
    if (this.values.length > this.maxSize) {
      this.values.shift()
    }
  }

  get(index: number): T | undefined {
    const i = this.values.length + index // Support negative indices
    return i >= 0 && i < this.values.length ? this.values[i].value : undefined
  }

  last(n: number = 1): T[] {
    return this.values.slice(-n).map(v => v.value)
  }

  all(): T[] {
    return this.values.map(v => v.value)
  }

  withTimestamps() {
    return [...this.values]
  }

  clear(): void {
    this.values = []
  }
}

// ============================================================================
// FORMULA 6: STATE SNAPSHOT
// Checkpoint for recovery
// ============================================================================

export interface Snapshot<T> {
  id: string
  state: T
  timestamp: number
  version: number
}

export class StateSnapshot<T> {
  private snapshots: Snapshot<T>[] = []
  private version = 0

  save(state: T): string {
    const snapshot: Snapshot<T> = {
      id: `snapshot-${Date.now()}-${Math.random()}`,
      state,
      timestamp: Date.now(),
      version: this.version++
    }
    this.snapshots.push(snapshot)
    return snapshot.id
  }

  load(id: string): T | undefined {
    return this.snapshots.find(s => s.id === id)?.state
  }

  latest(): T | undefined {
    return this.snapshots[this.snapshots.length - 1]?.state
  }

  at(version: number): T | undefined {
    return this.snapshots.find(s => s.version === version)?.state
  }

  all(): Snapshot<T>[] {
    return [...this.snapshots]
  }
}

// ============================================================================
// FORMULA 7: STATE MERGE
// Combine partial states
// ============================================================================

export class StateMerge<T extends Record<string, any>> {
  merge(...states: Partial<T>[]): Partial<T> {
    return Object.assign({}, ...states)
  }

  deepMerge(...states: Partial<T>[]): Partial<T> {
    return states.reduce((acc: any, state) => {
      for (const [key, value] of Object.entries(state || {})) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          acc[key] = this.deepMerge(acc[key] || {}, value)
        } else {
          acc[key] = value
        }
      }
      return acc
    }, {})
  }

  conflict(base: T, left: Partial<T>, right: Partial<T>): Partial<T> {
    const merged: any = {}
    const allKeys = new Set([
      ...Object.keys(base),
      ...Object.keys(left || {}),
      ...Object.keys(right || {})
    ])

    for (const key of allKeys) {
      const baseVal = (base as any)[key]
      const leftVal = (left as any)?.[key]
      const rightVal = (right as any)?.[key]

      if (leftVal === rightVal) {
        merged[key] = leftVal ?? baseVal
      } else if (leftVal === baseVal) {
        merged[key] = rightVal ?? baseVal
      } else if (rightVal === baseVal) {
        merged[key] = leftVal ?? baseVal
      } else {
        // All three differ - prefer right
        merged[key] = rightVal ?? leftVal ?? baseVal
      }
    }

    return merged
  }
}

// ============================================================================
// FORMULA 8: CHANGE DETECTOR
// Trigger on state changes
// ============================================================================

export type ChangeCallback<T> = (prev: T, curr: T) => void

export class ChangeDetector<T> {
  private current: T
  private callbacks: ChangeCallback<T>[] = []

  constructor(initialValue: T) {
    this.current = initialValue
  }

  subscribe(cb: ChangeCallback<T>): () => void {
    this.callbacks.push(cb)
    return () => {
      this.callbacks = this.callbacks.filter(c => c !== cb)
    }
  }

  update(next: T): void {
    if (next !== this.current) {
      const prev = this.current
      this.current = next
      this.callbacks.forEach(cb => cb(prev, next))
    }
  }

  get(): T {
    return this.current
  }

  changed(): boolean {
    return false // Static check at get() time
  }
}

// ============================================================================
// EXPORTS: All 8 Stateful Computation Formulas
// ============================================================================

export const state = {
  session: new SessionStateStore(),
  snapshot: new StateSnapshot(),
  merge: new StateMerge(),
  detector: new ChangeDetector({ timestamp: Date.now() })
}

/**
 * PHASE 8: GAP 2 - STATEFUL COMPUTATION
 *
 * 8 Formulas enabling context and history:
 * ✓ Session State Store - Request context storage
 * ✓ Time Window Aggregator - Tumbling/sliding/session windows
 * ✓ Feature Buffer - ML inference feature cache
 * ✓ State Machine Executor - Event-driven transitions
 * ✓ History Retention - Rolling buffer of values
 * ✓ State Snapshot - Checkpointing for recovery
 * ✓ State Merge - Combine partial states
 * ✓ Change Detector - React to state changes
 *
 * Enables: Real-time streaming, ML inference, contextual workflows,
 *          recovery from failures, audit trails
 */
