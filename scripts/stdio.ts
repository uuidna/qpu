// The QPU MCP over stdio: the server the Worker serves, built from the kernel, on the MCP SDK's own stdio door, so a
// harness that starts a command reaches the same tools as one given the URL.
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import { mcpServer } from '../src/quantum/net/mcp-http.ts'

serveStdio(() => mcpServer(process.env))
