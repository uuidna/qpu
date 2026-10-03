# Multi-stage production build: UUIDNA QPU
# Production-ready container: CC-BY-NC-ND-4.0 licensed quantum formula discovery
# Builds on arm64 (Raspberry Pi 4/5) and amd64:
#   docker buildx build --platform linux/arm64,linux/amd64 -t uuidna/qpu:latest .

# ============================================================================
# STAGE 1: Build
# ============================================================================

FROM node:26-alpine AS build

WORKDIR /qpu

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies; no lifecycle scripts: prepare would compile before src/ is copied, and the build step follows
RUN npm ci --ignore-scripts

# Copy source
COPY tsconfig.json ./
COPY src/ ./src/

# Compile: the version lock (git history, npm registry) gates every commit and CI run; the image only compiles
RUN npx tsc -p tsconfig.json && npm prune --omit=dev

# ============================================================================
# STAGE 2: Runtime
# ============================================================================

FROM node:26-alpine

WORKDIR /qpu

ENV NODE_ENV=production

# Install runtime dependencies and security updates
RUN apk add --no-cache curl ca-certificates dumb-init && \
    apk update && apk upgrade

# Copy built application from builder
COPY --from=build /qpu/package.json /qpu/package-lock.json ./
COPY --from=build /qpu/dist ./dist
COPY --from=build /qpu/node_modules ./node_modules

# Copy license, documentation, configuration
COPY LICENSE README.md CITATION.cff ./
COPY src/quantum/processing/unit/index.lean ./src/quantum/processing/unit/
COPY mcp.json install.json ./

# Create non-root user for security
RUN addgroup -g 1001 -S qpu && adduser -S qpu -u 1001
USER qpu

# Port configuration
EXPOSE 8080 8081 9090

# Health check: Verify quantum proof computation within timeout
HEALTHCHECK --interval=60s --timeout=30s --start-period=10s --retries=3 \
    CMD node dist/quantum/processing/unit/boot.js --health || exit 1

# Use dumb-init to properly handle signals
# Alpine installs dumb-init under /usr/bin
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Run quantum formula discovery system
CMD ["node", "dist/quantum/processing/unit/boot.js"]

# ============================================================================
# Image Metadata
# ============================================================================

LABEL org.opencontainers.image.title="UUIDNA QPU" \
      org.opencontainers.image.description="Quantum Formula Discovery System with Zero-Latency Computation" \
      org.opencontainers.image.version="0.2.1" \
      org.opencontainers.image.authors="Tsvetan Rouschev <ceccec@psg.bg>" \
      org.opencontainers.image.url="https://github.com/tsvetan/uuidna" \
      org.opencontainers.image.source="https://github.com/tsvetan/uuidna" \
      org.opencontainers.image.documentation="https://github.com/tsvetan/uuidna/wiki" \
      org.opencontainers.image.licenses="CC-BY-NC-ND-4.0" \
      org.opencontainers.image.vendor="UUIDNA" \
      org.opencontainers.image.base.name="docker.io/library/node:26-alpine"
