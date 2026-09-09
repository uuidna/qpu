import { OPS_CRUD, OPS_FETCH, OPS_GET, OPS_QUERY, OPS_RUN, OPS_SEND, spec } from '../types.js'

const p = 'ibm' as const
export const IBM_BINDINGS = Object.freeze([
  spec(p, 'cos', 'IBM_COS', 'cloud-object-storage', OPS_CRUD),
  spec(p, 'cloudant', 'IBM_CLOUDANT', 'cloudantnosqldb', OPS_CRUD),
  spec(p, 'db2', 'IBM_DB2', 'dashdb-for-transactions', OPS_QUERY),
  spec(p, 'postgresql', 'IBM_POSTGRES', 'databases-for-postgresql', OPS_QUERY),
  spec(p, 'redis', 'IBM_REDIS', 'databases-for-redis', OPS_CRUD),
  spec(p, 'mq', 'IBM_MQ', 'mq', OPS_SEND),
  spec(p, 'eventstreams', 'IBM_EVENTSTREAMS', 'messagehub', OPS_SEND),
  spec(p, 'functions', 'IBM_FUNCTIONS', 'functions', OPS_RUN),
  spec(p, 'codeengine', 'IBM_CODEENGINE', 'codeengine', OPS_FETCH),
  spec(p, 'iks', 'IBM_IKS', 'containers-kubernetes', OPS_GET),
  spec(p, 'vpc', 'IBM_VPC', 'is', OPS_GET),
  spec(p, 'keyprotect', 'IBM_KEYPROTECT', 'kms', OPS_GET),
  spec(p, 'secretsmanager', 'IBM_SECRETSMANAGER', 'secrets-manager', OPS_GET),
  spec(p, 'watsonx', 'IBM_WATSONX', 'watsonx-ai', OPS_RUN),
  spec(p, 'watsonnlu', 'IBM_WATSONNLU', 'natural-language-understanding', OPS_RUN),
  spec(p, 'cos_cdn', 'IBM_CDN', 'cis', OPS_FETCH),
  spec(p, 'schematics', 'IBM_SCHEMATICS', 'schematics', OPS_RUN),
  spec(p, 'logging', 'IBM_LOGGING', 'logdna', OPS_SEND),
  spec(p, 'monitoring', 'IBM_MONITORING', 'sysdig-monitor', OPS_SEND),
  spec(p, 'iam', 'IBM_IAM', 'iam-identity', OPS_GET),
])
