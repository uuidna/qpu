# Multi-stage Dockerfile for Quantum Computing Platform (WAVE 5)
# Optimized for cloud deployment with minimal image size

# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source
COPY src ./src
COPY mcp ./mcp
COPY tsconfig.json ./

# Build TypeScript
RUN npm install -g typescript && \
    tsc

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app

# Add non-root user for security
RUN addgroup -g 1001 -S quantum && \
    adduser -S quantumuser -u 1001

# Copy built app from builder
COPY --from=builder --chown=quantumuser:quantum /app/node_modules ./node_modules
COPY --from=builder --chown=quantumuser:quantum /app/dist ./dist
COPY --from=builder --chown=quantumuser:quantum /app/mcp ./mcp

# Copy config files
COPY --chown=quantumuser:quantum package.json ./
COPY --chown=quantumuser:quantum docs ./docs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Switch to non-root user
USER quantumuser

# Expose MCP server ports
EXPOSE 3001 3002 3003 3004 3005

# Environment
ENV NODE_ENV=production
ENV LOG_LEVEL=info

# Start MCPs
CMD ["npm", "run", "start:mcp:all"]
