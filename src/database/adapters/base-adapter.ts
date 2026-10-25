// Base adapter for all database providers (WAVE 6)
// Defines interface that all providers must implement

import type { QueryOptions, WriteOperation, Transaction, DatabaseResult, HealthStatus, DatabaseProvider } from '../types.js'

export abstract class DatabaseAdapter {
  abstract provider: DatabaseProvider
  protected connected = false

  abstract connect(config: any): Promise<void>
  abstract disconnect(): Promise<void>
  abstract query<T = any>(options: QueryOptions): Promise<DatabaseResult<T>>
  abstract write(operation: WriteOperation): Promise<DatabaseResult>
  abstract transaction(tx: Transaction): Promise<DatabaseResult>
  abstract health(): Promise<HealthStatus>

  // Data portability - export schema and data
  abstract exportSchema(): Promise<string>
  abstract importSchema(schema: string): Promise<void>
  abstract exportData(tables?: string[]): Promise<any[]>
  abstract importData(data: any[], mode?: 'replace' | 'merge'): Promise<number>

  // Migration support
  abstract migrate(targetProvider: DatabaseProvider, options?: any): Promise<{ migratedRows: number; duration: number }>
  abstract validateData(checksums?: Record<string, string>): Promise<{ valid: boolean; mismatches: string[] }>

  isConnected(): boolean {
    return this.connected
  }
}
