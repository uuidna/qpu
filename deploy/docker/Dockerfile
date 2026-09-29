# UUIDNA QPU - Containerized Quantum Kernel
# Minimal, production-grade container
# Size: ~100MB (Node.js 18 Alpine base)

FROM node:18-alpine

LABEL maintainer="UUIDNA Foundation"
LABEL description="Quantum Processing Unit - Pure Math Computation"
LABEL version="1.0.0"

WORKDIR /app

# Copy only necessary files
COPY sdk/python/qpu.py /app/qpu.py
COPY src/quantum/kernel/ /app/kernel/
COPY browser/qpu.html /app/static/index.html
COPY package.json /app/package.json

# Install minimal dependencies
RUN npm install --production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1000 quantum && adduser -D -u 1000 -G quantum quantum
USER quantum

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Expose ports
EXPOSE 3000 8080

# Default command: Start server
CMD ["node", "server.js"]
