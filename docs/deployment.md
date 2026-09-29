# Deployment Guide

## Local Development

```bash
npm install
npm run build
npm test
npm run dev
```

## Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qpu-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: qpu
  template:
    metadata:
      labels:
        app: qpu
    spec:
      containers:
      - name: qpu
        image: qpu:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

## Configuration

- `QPU_INSTANCES`: Number of QPU replicas (default: 1)
- `CACHE_SIZE`: Cache size in MB (default: 256)
- `BATCH_SIZE`: Batch processor size (default: 10)
- `HEALING_ENABLED`: Enable self-healing (default: true)
- `TRACING_ENABLED`: Enable distributed tracing (default: true)

## Monitoring

- **Prometheus**: Metrics at `:3000/metrics`
- **Jaeger**: Distributed traces at `localhost:16686`
- **Health**: Status at `:3000/health`

