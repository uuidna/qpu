/**
 * Infrastructure Generator - Creates Kubernetes, Helm, Terraform, CloudFormation configs
 */

export interface K8sDeploymentConfig {
  apiVersion: string
  kind: string
  metadata: { name: string; namespace: string }
  spec: {
    replicas: number
    selector: { matchLabels: Record<string, string> }
    template: {
      metadata: { labels: Record<string, string> }
      spec: {
        containers: K8sContainer[]
        resources?: K8sResources
      }
    }
  }
}

export interface K8sContainer {
  name: string
  image: string
  ports: Array<{ containerPort: number; name: string }>
  env: Array<{ name: string; value: string }>
  livenessProbe?: K8sProbe
  readinessProbe?: K8sProbe
}

export interface K8sProbe {
  httpGet: { path: string; port: number }
  initialDelaySeconds: number
  periodSeconds: number
}

export interface K8sResources {
  requests: { cpu: string; memory: string }
  limits: { cpu: string; memory: string }
}

export interface HelmValues {
  replicaCount: number
  image: { repository: string; tag: string; pullPolicy: string }
  service: { type: string; port: number }
  ingress: { enabled: boolean; hosts: string[] }
  resources: K8sResources
  autoscaling: { enabled: boolean; minReplicas: number; maxReplicas: number }
}

export interface TerraformConfig {
  terraform: { required_version: string }
  provider: Record<string, unknown>
  variable: Record<string, unknown>
  resource: Record<string, Record<string, unknown>>
  output: Record<string, unknown>
}

export class InfrastructureGenerator {
  generateK8sDeployment(name: string, image: string, replicas: number = 3): K8sDeploymentConfig {
    return {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: { name, namespace: 'quantum' },
      spec: {
        replicas,
        selector: { matchLabels: { app: name } },
        template: {
          metadata: { labels: { app: name } },
          spec: {
            containers: [
              {
                name,
                image,
                ports: [
                  { containerPort: 3000, name: 'http' },
                  { containerPort: 9090, name: 'metrics' }
                ],
                env: [
                  { name: 'NODE_ENV', value: 'production' },
                  { name: 'LOG_LEVEL', value: 'info' },
                  { name: 'ENABLE_METRICS', value: 'true' }
                ],
                livenessProbe: {
                  httpGet: { path: '/health', port: 3000 },
                  initialDelaySeconds: 30,
                  periodSeconds: 10
                },
                readinessProbe: {
                  httpGet: { path: '/ready', port: 3000 },
                  initialDelaySeconds: 5,
                  periodSeconds: 5
                }
              }
            ],
            resources: {
              requests: { cpu: '500m', memory: '512Mi' },
              limits: { cpu: '2000m', memory: '2Gi' }
            }
          }
        }
      }
    }
  }

  generateK8sService(name: string, port: number = 3000): string {
    return `
apiVersion: v1
kind: Service
metadata:
  name: ${name}
  namespace: quantum
spec:
  type: ClusterIP
  ports:
    - port: ${port}
      targetPort: http
      protocol: TCP
      name: http
    - port: 9090
      targetPort: metrics
      protocol: TCP
      name: metrics
  selector:
    app: ${name}
`
  }

  generateK8sIngress(name: string, hostname: string): string {
    return `
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${name}-ingress
  namespace: quantum
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - ${hostname}
      secretName: ${name}-tls
  rules:
    - host: ${hostname}
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ${name}
                port:
                  number: 3000
`
  }

  generateHelmChart(name: string): HelmValues {
    return {
      replicaCount: 3,
      image: {
        repository: `uuidna/${name}`,
        tag: '1.0.0',
        pullPolicy: 'IfNotPresent'
      },
      service: {
        type: 'ClusterIP',
        port: 80
      },
      ingress: {
        enabled: true,
        hosts: [`${name}.qpu.uuidna.com`]
      },
      resources: {
        requests: { cpu: '500m', memory: '512Mi' },
        limits: { cpu: '2000m', memory: '2Gi' }
      },
      autoscaling: {
        enabled: true,
        minReplicas: 2,
        maxReplicas: 10
      }
    }
  }

  generateTerraformAWS(): TerraformConfig {
    return {
      terraform: {
        required_version: '>= 1.0'
      },
      provider: {
        aws: {
          region: 'us-east-1'
        }
      },
      variable: {
        cluster_name: {
          type: 'string',
          default: 'uuidna-qpu'
        },
        node_count: {
          type: 'number',
          default: 3
        },
        instance_type: {
          type: 'string',
          default: 't3.large'
        }
      },
      resource: {
        'aws_eks_cluster': {
          main: {
            name: '${var.cluster_name}',
            role_arn: '${aws_iam_role.eks_cluster_role.arn}',
            vpc_config: {
              subnet_ids: '${aws_subnet.private[*].id}'
            }
          }
        },
        'aws_eks_node_group': {
          main: {
            cluster_name: '${aws_eks_cluster.main.name}',
            node_group_name: 'main',
            node_role_arn: '${aws_iam_role.eks_nodes_role.arn}',
            subnet_ids: '${aws_subnet.private[*].id}',
            scaling_config: {
              desired_size: '${var.node_count}',
              max_size: 10,
              min_size: 1
            },
            instance_types: ['${var.instance_type}']
          }
        },
        'aws_rds_cluster': {
          main: {
            cluster_identifier: '${var.cluster_name}-db',
            engine: 'aurora-postgresql',
            database_name: 'qpu',
            master_username: 'admin',
            skip_final_snapshot: false,
            backup_retention_period: 30
          }
        }
      },
      output: {
        cluster_endpoint: {
          value: '${aws_eks_cluster.main.endpoint}'
        },
        cluster_security_group_id: {
          value: '${aws_eks_cluster.main.vpc_config[0].cluster_security_group_id}'
        }
      }
    }
  }

  generateTerraformGCP(): TerraformConfig {
    return {
      terraform: {
        required_version: '>= 1.0'
      },
      provider: {
        google: {
          project: '${var.gcp_project}',
          region: 'us-central1'
        }
      },
      variable: {
        gcp_project: {
          type: 'string'
        },
        cluster_name: {
          type: 'string',
          default: 'uuidna-qpu'
        }
      },
      resource: {
        'google_container_cluster': {
          main: {
            name: '${var.cluster_name}',
            location: 'us-central1',
            initial_node_count: 3,
            node_config: {
              machine_type: 'n1-standard-2',
              disk_size_gb: 100,
              oauth_scopes: [
                'https://www.googleapis.com/auth/cloud-platform'
              ]
            }
          }
        },
        'google_sql_database_instance': {
          main: {
            name: '${var.cluster_name}-db',
            database_version: 'POSTGRES_13',
            settings: {
              tier: 'db-custom-2-8192',
              backup_configuration: {
                enabled: true,
                point_in_time_recovery_enabled: true
              }
            }
          }
        }
      },
      output: {
        kubernetes_cluster_name: {
          value: '${google_container_cluster.main.name}'
        },
        kubernetes_cluster_host: {
          value: '${google_container_cluster.main.endpoint}'
        }
      }
    }
  }

  generateTerraformAzure(): TerraformConfig {
    return {
      terraform: {
        required_version: '>= 1.0'
      },
      provider: {
        azurerm: {
          features: {}
        }
      },
      variable: {
        resource_group_name: {
          type: 'string'
        },
        cluster_name: {
          type: 'string',
          default: 'uuidna-qpu'
        }
      },
      resource: {
        'azurerm_kubernetes_cluster': {
          main: {
            name: '${var.cluster_name}',
            location: '${azurerm_resource_group.main.location}',
            resource_group_name: '${var.resource_group_name}',
            dns_prefix: '${var.cluster_name}',
            default_node_pool: {
              name: 'default',
              node_count: 3,
              vm_size: 'Standard_D2_v2'
            }
          }
        },
        'azurerm_postgresql_server': {
          main: {
            name: '${var.cluster_name}-db',
            location: '${azurerm_resource_group.main.location}',
            resource_group_name: '${var.resource_group_name}',
            administrator_login: 'admin',
            sku_name: 'GP_Gen5_2',
            storage_mb: 51200,
            backup_retention_days: 30,
            geo_redundant_backup_enabled: true
          }
        }
      },
      output: {
        kube_config: {
          value: '${azurerm_kubernetes_cluster.main.kube_config_raw}'
        }
      }
    }
  }

  generateDockerCompose(): string {
    return `
version: '3.9'

services:
  api:
    image: uuidna/qpu-api:latest
    ports:
      - "3000:3000"
      - "9090:9090"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://admin:password@db:5432/qpu
      REDIS_URL: redis://cache:6379
    depends_on:
      - db
      - cache
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: qpu
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - cache_data:/data

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  db_data:
  cache_data:
  prometheus_data:
  grafana_data:
`
  }
}

export const infrastructureGenerator = new InfrastructureGenerator()
