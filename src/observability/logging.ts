// Structured JSON logging system (WAVE 8C)

import { StructuredLog, TraceContext } from './types.js'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export class StructuredLogger {
  private name: string
  private level: LogLevel = 'info'
  private logBuffer: StructuredLog[] = []
  private bufferSize: number = 5000
  private exportCallbacks: Array<(logs: StructuredLog[]) => Promise<void>> = []
  private contextStack: Map<string, TraceContext> = new Map()

  constructor(name: string, config?: { level?: LogLevel; bufferSize?: number }) {
    this.name = name
    if (config?.level) {
      this.level = config.level
    }
    if (config?.bufferSize) {
      this.bufferSize = config.bufferSize
    }
  }

  // Set the minimum log level
  setLevel(level: LogLevel): void {
    this.level = level
  }

  // Add an export callback
  addExportCallback(callback: (logs: StructuredLog[]) => Promise<void>): void {
    this.exportCallbacks.push(callback)
  }

  // Push context onto stack
  pushContext(context: TraceContext): void {
    this.contextStack.set(context.correlationId, context)
  }

  // Pop context from stack
  popContext(correlationId: string): TraceContext | undefined {
    const context = this.contextStack.get(correlationId)
    this.contextStack.delete(correlationId)
    return context
  }

  // Get current context
  getContext(correlationId: string): TraceContext | undefined {
    return this.contextStack.get(correlationId)
  }

  // Main logging method
  private log(
    level: LogLevel,
    message: string,
    context: TraceContext,
    fields?: Record<string, any>,
    error?: Error
  ): void {
    // Check if this level should be logged
    const levels: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 }
    if (levels[level] < levels[this.level]) {
      return
    }

    const log: StructuredLog = {
      timestamp: Date.now(),
      level,
      message,
      context,
      fields: {
        ...fields,
        logger: this.name,
      },
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            code: (error as any).code,
          }
        : undefined,
    }

    this.logBuffer.push(log)

    // Auto-flush if buffer exceeds size
    if (this.logBuffer.length >= this.bufferSize) {
      this.flush().catch(err => console.error('Failed to flush logs:', err))
    }

    // Also output to console for real-time visibility
    this.outputToConsole(log)
  }

  // Debug level
  debug(message: string, context: TraceContext, fields?: Record<string, any>): void {
    this.log('debug', message, context, fields)
  }

  // Info level
  info(message: string, context: TraceContext, fields?: Record<string, any>): void {
    this.log('info', message, context, fields)
  }

  // Warn level
  warn(message: string, context: TraceContext, fields?: Record<string, any>): void {
    this.log('warn', message, context, fields)
  }

  // Error level
  error(message: string, context: TraceContext, error?: Error, fields?: Record<string, any>): void {
    this.log('error', message, context, fields, error)
  }

  // Flush buffered logs
  async flush(): Promise<void> {
    if (this.logBuffer.length === 0) {
      return
    }

    const logs = [...this.logBuffer]
    this.logBuffer = []

    // Export to all callbacks
    const promises = this.exportCallbacks.map(callback =>
      callback(logs).catch(err => console.error('Failed to export logs:', err))
    )

    await Promise.all(promises)
  }

  // Get buffered logs
  getBufferedLogs(): StructuredLog[] {
    return [...this.logBuffer]
  }

  // Clear buffer
  clearBuffer(): void {
    this.logBuffer = []
  }

  // Get buffer statistics
  getStatistics(): {
    bufferedLogs: number
    bufferSize: number
    contextStackSize: number
  } {
    return {
      bufferedLogs: this.logBuffer.length,
      bufferSize: this.bufferSize,
      contextStackSize: this.contextStack.size,
    }
  }

  // Output to console with structured format
  private outputToConsole(log: StructuredLog): void {
    const output = {
      timestamp: new Date(log.timestamp).toISOString(),
      level: log.level.toUpperCase(),
      message: log.message,
      traceId: log.context.traceId,
      correlationId: log.context.correlationId,
      userId: log.context.userId,
      ...log.fields,
      ...(log.error && { error: log.error }),
    }

    const method = log.level === 'error' ? 'error' : log.level === 'warn' ? 'warn' : 'log'
    console[method as any](JSON.stringify(output))
  }
}

// Global logger registry
export const loggers = new Map<string, StructuredLogger>()

// Get or create a logger
export function getLogger(name: string, config?: { level?: LogLevel; bufferSize?: number }): StructuredLogger {
  if (!loggers.has(name)) {
    loggers.set(name, new StructuredLogger(name, config))
  }
  return loggers.get(name)!
}

// Flush all loggers
export async function flushAllLoggers(): Promise<void> {
  const promises = Array.from(loggers.values()).map(logger => logger.flush())
  await Promise.all(promises)
}

// Add export callback to all loggers
export function addGlobalExportCallback(callback: (logs: StructuredLog[]) => Promise<void>): void {
  for (const logger of loggers.values()) {
    logger.addExportCallback(callback)
  }
}

// Log aggregation helper - collects logs from all loggers
export function collectAllLogs(): StructuredLog[] {
  const allLogs: StructuredLog[] = []
  for (const logger of loggers.values()) {
    allLogs.push(...logger.getBufferedLogs())
  }
  return allLogs
}
