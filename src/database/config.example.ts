// Example Configuration for Distributed Database (WAVE 6)
// Copy and customize for your environment

import type { DatabaseConfig } from './types.js'

// Production configuration with all providers
export const productionConfig: DatabaseConfig = {
  primary: {
    provider: 'cloudflare-d1',
    connection: 'wrangler',  // Use Wrangler binding
    options: {
      timeout: 30000,
      retries: 3,
      batchSize: 1000
    }
  },
  secondary: [
    {
      provider: 'postgresql',
      connection: process.env.POSTGRES_URL || 'postgresql://user:pass@localhost:5432/qpu',
      priority: 1,
      regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
      options: {
        maxConnections: 20,
        timeout: 30000,
        retries: 2
      }
    },
    {
      provider: 'mongodb',
      connection: process.env.MONGODB_URI || 'mongodb+srv://user:pass@cluster.mongodb.net/qpu',
      priority: 2,
      regions: ['us-west-2', 'eu-central-1'],
      options: {
        maxConnections: 10,
        timeout: 30000
      }
    }
  ],
  cache: {
    provider: 'cloudflare-kv',
    connection: 'wrangler',
    options: {
      ttl: 3600,  // 1 hour cache
      maxSize: 25 * 1024 * 1024  // 25MB (KV limit)
    }
  },
  failover: {
    enabled: true,
    strategy: 'active-active',
    healthCheckInterval: 30000,  // 30 seconds
    replicationLag: 5000,  // 5 seconds acceptable lag
    maxRetries: 3,
    autoPromote: true
  },
  replication: {
    maxRetries: 3,
    batchSize: 100,
    processingInterval: 1000,  // 1 second between batches
    confirmationRequired: true,
    maxLag: 5000,
    conflictResolution: 'last-write-wins'
  }
}

// Staging configuration with PostgreSQL primary
export const stagingConfig: DatabaseConfig = {
  primary: {
    provider: 'postgresql',
    connection: process.env.STAGING_POSTGRES_URL || 'postgresql://user:pass@staging-db:5432/qpu',
    options: {
      maxConnections: 10,
      timeout: 30000
    }
  },
  secondary: [
    {
      provider: 'mongodb',
      connection: process.env.STAGING_MONGODB_URI || 'mongodb://staging-mongo:27017/qpu',
      priority: 1,
      options: {
        maxConnections: 5,
        timeout: 30000
      }
    }
  ],
  failover: {
    enabled: true,
    strategy: 'active-passive',
    healthCheckInterval: 30000,
    replicationLag: 5000,
    maxRetries: 2,
    autoPromote: false
  },
  replication: {
    maxRetries: 2,
    batchSize: 50,
    processingInterval: 2000,
    confirmationRequired: true,
    maxLag: 10000,
    conflictResolution: 'last-write-wins'
  }
}

// Development configuration with SQLite
export const developmentConfig: DatabaseConfig = {
  primary: {
    provider: 'sqlite',
    connection: './qpu.db',  // File path
    options: {
      timeout: 5000
    }
  },
  secondary: [],
  failover: {
    enabled: false,
    strategy: 'active-passive',
    healthCheckInterval: 60000,
    replicationLag: 10000,
    maxRetries: 1,
    autoPromote: false
  },
  replication: {
    maxRetries: 1,
    batchSize: 10,
    processingInterval: 5000,
    confirmationRequired: false,
    maxLag: 30000,
    conflictResolution: 'last-write-wins'
  }
}

// Test/CI configuration with in-memory SQLite
export const testConfig: DatabaseConfig = {
  primary: {
    provider: 'sqlite',
    connection: ':memory:',  // In-memory database
    options: {
      timeout: 1000
    }
  },
  secondary: [],
  failover: {
    enabled: false,
    strategy: 'active-passive',
    healthCheckInterval: 60000,
    replicationLag: 10000,
    maxRetries: 0,
    autoPromote: false
  },
  replication: {
    maxRetries: 0,
    batchSize: 1,
    processingInterval: 100,
    confirmationRequired: false,
    maxLag: 5000,
    conflictResolution: 'last-write-wins'
  }
}

// Get configuration based on environment
export function getConfig(): DatabaseConfig {
  const env = process.env.NODE_ENV || 'development'

  switch (env) {
    case 'production':
      return productionConfig
    case 'staging':
      return stagingConfig
    case 'test':
      return testConfig
    default:
      return developmentConfig
  }
}

// Export all for manual selection
export const configs = {
  production: productionConfig,
  staging: stagingConfig,
  development: developmentConfig,
  test: testConfig
}

export default getConfig()
