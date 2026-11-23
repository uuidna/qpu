import { PROSE } from '../processing/prose-index.ts'
// The one connector every MCP client mounts: the QPU's own MCP endpoint, and the website routes an LLM sends as function tools.

export const WEBSITE_ORIGIN = 'https://qpu.uuidna.com'
/** The MCP endpoint every connector names. */
export const WEBSITE_CLIENT = `${WEBSITE_ORIGIN}/api/mcp`
/** The one connector. Every name below fetches this plugin. */
export const QPU_CONNECTOR = { name: 'qpu' as const, plugin: 'qpuMcpPlugin' as const, api: WEBSITE_CLIENT, via: 'payload-api' as const }
/** Cursor, Claude, and every other connector. Each one is QPU_CONNECTOR. */
export const ADAPTED_CONNECTORS = ['cursor', 'claude', 'gemini', 'cirq-google', 'cloudflare', 'registry', 'oauth', 'drive', 'gmail', 'calendar'] as const

export const WEBSITE_ROUTES = [
  { name: 'find_pages', method: 'GET' as const, path: '/api/pages', collection: 'pages', description: PROSE.quantumNetConnector_p1 },
  { name: 'find_posts', method: 'GET' as const, path: '/api/posts', collection: 'posts', description: PROSE.quantumNetConnector_p2 },
  { name: 'find_case_studies', method: 'GET' as const, path: '/api/case-studies', collection: 'case-studies', description: PROSE.quantumNetConnector_p3 },
  { name: 'find_media', method: 'GET' as const, path: '/api/media', collection: 'media', description: 'Find media uploads.' },
] as const

/** Function tools an LLM sends. Each one is a website route. */
export const llmTools = () => WEBSITE_ROUTES.map((route) => ({
  name: route.name,
  description: `${route.method} ${route.path}. ${route.description}`,
  input_schema: { type: 'object' as const, properties: { where: { type: 'object' }, limit: { type: 'integer' } } },
}))
