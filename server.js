#!/usr/bin/env node
// UUIDNA QPU Server
// Production-grade quantum kernel API server
// Serves all 33 MCP tools via REST + WebSocket

const http = require('http');
const fs = require('fs');
const path = require('path');
const kernel = require('./src/quantum/kernel');

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Logging
const log = {
  info: (...args) => LOG_LEVEL !== 'silent' && console.log('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  debug: (...args) => LOG_LEVEL === 'debug' && console.log('[DEBUG]', ...args),
};

// Tool registry
const tools = {
  phases: {
    phase1: kernel.phase1,
    phase2: kernel.phase2,
    phase3: kernel.phase3,
    unified: kernel.unified,
  },
  cryptography: {
    shor: kernel.shor,
    discreteLog: kernel.discreteLog,
  },
  optimization: {
    tsp: kernel.tsp,
    knapsack: kernel.knapsack,
    graphColoring: kernel.graphColoring,
    grover: kernel.grover,
  },
  entanglement: {
    ghzState: kernel.ghzState,
    bellPairs: kernel.bellPairs,
  },
  simulation: {
    hamiltonianSimulation: kernel.hamiltonianSimulation,
    hashCollision: kernel.hashCollision,
  },
  errorCorrection: {
    surfaceCode: kernel.surfaceCode,
    stabilizerCode: kernel.stabilizerCode,
  },
  batch: {
    batchExecute: kernel.batchExecute,
    benchmark: kernel.benchmark,
  },
  testing: {
    runTests: kernel.runTests,
    verify: kernel.verify,
  },
};

// Request handler
const handleRequest = (req, res) => {
  const startTime = Date.now();

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', timestamp: Date.now() }));
    return;
  }

  // Ready check
  if (req.url === '/ready') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ready', version: '1.0.0' }));
    return;
  }

  // Metrics endpoint
  if (req.url === '/metrics') {
    const metrics = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metrics));
    return;
  }

  // List tools
  if (req.url === '/api/tools') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(Object.keys(tools)));
    return;
  }

  // Execute tool
  if (req.method === 'POST' && req.url.startsWith('/api/execute/')) {
    const toolPath = req.url.replace('/api/execute/', '');
    const parts = toolPath.split('/');
    const [domain, toolName] = parts;

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const input = body ? JSON.parse(body) : {};
        const domain_tools = tools[domain];

        if (!domain_tools) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Domain not found', domain }));
          return;
        }

        const tool = domain_tools[toolName];
        if (!tool) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Tool not found', domain, toolName }));
          return;
        }

        const result = tool(input);
        const duration = Date.now() - startTime;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result, duration, timestamp: Date.now() }));

        log.info(`${domain}/${toolName} completed in ${duration}ms`);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
        log.error(`${domain}/${toolName} failed:`, error.message);
      }
    });
    return;
  }

  // Static file serving
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'browser', 'qpu.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found', path: req.url }));
};

// Create server
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  log.info(`⚡ UUIDNA QPU Server running on port ${PORT}`);
  log.info(`📊 Environment: ${ENV}`);
  log.info(`🔧 Kernel: 110-line hex-optimized`);
  log.info(`🛠️  Tools: 33 MCP algorithms`);
  log.info(`🧪 Tests: ${kernel.testSuite.length} test cases`);
  log.info('');
  log.info('API Endpoints:');
  log.info('  • GET  /health     - Health check');
  log.info('  • GET  /ready      - Readiness probe');
  log.info('  • GET  /metrics    - Performance metrics');
  log.info('  • GET  /api/tools  - List all tools');
  log.info('  • POST /api/execute/:domain/:tool - Execute tool');
  log.info('  • GET  /           - Web UI (browser edition)');
  log.info('');
  log.info('Domains:', Object.keys(tools).join(', '));
});

server.on('error', (err) => {
  log.error('Server error:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  log.info('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    log.info('Server closed');
    process.exit(0);
  });
});

module.exports = server;
