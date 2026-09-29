/**
 * Enterprise Connectors Module
 * Unified interface for CRM, ERP, data warehouse, and billing integrations
 */

// Base connector
export {
  BaseConnector,
  ConnectorRegistry,
  connectorRegistry,
  type ConnectorConfig,
  type ConnectorMetrics,
  type ConnectorEvent,
  type SyncResult,
  type ConnectionStatus,
  type AuthType
} from './base-connector.js'

// CRM connector
export {
  CRMConnector,
  SalesforceConnector,
  HubSpotConnector,
  createCRMConnector,
  type CRMContact,
  type CRMOpportunity,
  type CRMActivity,
  type CRMSyncConfig
} from './crm-connector.js'

// ERP connector
export {
  ERPConnector,
  SAPConnector,
  OracleConnector,
  createERPConnector,
  type ERPOrder,
  type ERPOrderItem,
  type ERPInventory,
  type ERPFinancial,
  type ERPSyncConfig
} from './erp-connector.js'

// Data warehouse connector
export {
  DataWarehouseConnector,
  BigQueryConnector,
  SnowflakeConnector,
  createDataWarehouseConnector,
  type CustomerUsageRecord,
  type OperationMetricsRecord,
  type DataWarehouseTable,
  type DWConfig
} from './data-warehouse-connector.js'

// Usage attribution
export {
  UsageAttribution,
  usageAttribution,
  type UsageEvent,
  type UsageMetrics,
  type CustomerUsageQuota,
  type BillingRecord
} from './usage-attribution.js'
