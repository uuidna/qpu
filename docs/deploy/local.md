# Local Development Deployment

Run the QPU MCP Server locally for development and testing.

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

The server runs at `http://localhost:3000` with MCP endpoint at `/mcp`.

## Testing the Server

### Health Check
```bash
curl http://localhost:3000/health
```

### List Tools
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

### Call a Tool
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "solve",
      "arguments": {
        "problem": "factorize rsa-260",
        "network": true
      }
    }
  }'
```

## Environment Variables

Set in `.env.local`:

```bash
# Server configuration
PORT=3000
HOST=localhost
LOG_LEVEL=debug

# MCP configuration
MCP_TIMEOUT=30000
MCP_NETWORK=true
```

## Running Tests

```bash
# Unit tests
npm test

# Integration tests (requires server running)
npm run test:integration

# E2E tests (all examples)
npm run test:e2e
```

## Development Workflow

```bash
# Watch mode (auto-rebuild on changes)
npm run dev

# Type checking (watch mode)
npm run typecheck -- --watch

# Linting
npm run lint

# Format code
npm run format
```

## Debugging

### Enable Debug Logging

```bash
LOG_LEVEL=debug npm start
```

### Chrome DevTools

Some IDEs allow debugging Node.js:

```bash
node --inspect-brk ./dist/quantum/mcp.js
```

Then open `chrome://inspect` in Chrome.

### VSCode Debugger

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "QPU Server",
      "program": "${workspaceFolder}/dist/quantum/mcp.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

Then press F5 to start debugging.

