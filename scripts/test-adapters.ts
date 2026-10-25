// End-to-end combinatorial testing of all MCP adapters
import { runE2ETests, generateReport } from '../src/mcp/adapters-e2e.js'

const report = runE2ETests()
generateReport(report)
