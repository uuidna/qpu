import { OPS_CRUD, OPS_FETCH, OPS_GET, OPS_QUERY, OPS_RUN, OPS_SEND, spec } from '../types.js'

const p = 'oracle' as const
export const ORACLE_BINDINGS = Object.freeze([
  spec(p, 'objectstorage', 'OCI_OBJECT', 'object_storage', OPS_CRUD),
  spec(p, 'autonomous', 'OCI_AUTONOMOUS', 'database', OPS_QUERY),
  spec(p, 'nosql', 'OCI_NOSQL', 'nosql', OPS_CRUD),
  spec(p, 'streaming', 'OCI_STREAMING', 'streaming', OPS_SEND),
  spec(p, 'queue', 'OCI_QUEUE', 'queue', OPS_SEND),
  spec(p, 'functions', 'OCI_FUNCTIONS', 'functions', OPS_RUN),
  spec(p, 'oke', 'OCI_OKE', 'container_engine', OPS_GET),
  spec(p, 'compute', 'OCI_COMPUTE', 'core', OPS_GET),
  spec(p, 'vcn', 'OCI_VCN', 'core.vcn', OPS_GET),
  spec(p, 'vault', 'OCI_VAULT', 'vault', OPS_GET),
  spec(p, 'kms', 'OCI_KMS', 'kms', OPS_GET),
  spec(p, 'generativeai', 'OCI_GENAI', 'generative_ai', OPS_RUN),
  spec(p, 'dataflow', 'OCI_DATAFLOW', 'dataflow', OPS_RUN),
  spec(p, 'monitoring', 'OCI_MONITORING', 'monitoring', OPS_SEND),
  spec(p, 'logging', 'OCI_LOGGING', 'logging', OPS_SEND),
  spec(p, 'dns', 'OCI_DNS', 'dns', OPS_CRUD),
  spec(p, 'loadbalancer', 'OCI_LB', 'load_balancer', OPS_FETCH),
  spec(p, 'apigateway', 'OCI_APIGATEWAY', 'apigateway', OPS_FETCH),
  spec(p, 'identity', 'OCI_IDENTITY', 'identity', OPS_GET),
  spec(p, 'filestorage', 'OCI_FILE', 'file_storage', OPS_CRUD),
])
