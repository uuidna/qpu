// Simple MCP server for testing examples
const http = require('http');
const { handle } = require('./dist/quantum/mcp.js');

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const message = JSON.parse(body);
      const response = handle(message);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32603, message: error.message }
      }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`[SERVER] MCP server listening on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SERVER] Shutting down...');
  server.close(() => process.exit(0));
});
