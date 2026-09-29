# UUIDNA QPU - Containerized Quantum Kernel
# Minimal, production-grade container
# Size: ~100MB (Node.js 18 Alpine base)

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:22-alpine

LABEL maintainer="UUIDNA Foundation"
LABEL description="Quantum Processing Unit - Pure Math Computation"
LABEL version="1.0.0"

WORKDIR /app
ENV NODE_ENV=production PORT=3000

# Copy only necessary files
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/quantum/processing/unit/index.lean ./src/quantum/processing/unit/index.lean
COPY --from=build /app/qpu.d.ts /app/LICENSE /app/README.md /app/CITATION.cff /app/mcp.json /app/install.json ./

# Install minimal dependencies
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Create non-root user
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

# Expose ports
EXPOSE 3000 8080

# Default command: Start server
CMD ["node", "dist/quantum/processing/unit/boot.js"]
