/**
 * Dashboard UI Server
 * Express server hosting React dashboard + API
 * License: CC-BY-NC-ND-4.0
 */

import express, { Express } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import apiRoutes from './api/routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Create and configure Express app for dashboard
 */
export function createUIServer(): Express {
  const app = express()

  // Middleware
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ limit: '10mb', extended: true }))

  // CORS headers
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    next()
  })

  // Logging middleware
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`)
    })
    next()
  })

  // =========================================================================
  // API ROUTES
  // =========================================================================

  app.use('/api', apiRoutes)

  // =========================================================================
  // STATIC ASSETS
  // =========================================================================

  // Serve built React app (production)
  const publicDir = path.join(__dirname, '../../dist/ui/public')
  app.use(express.static(publicDir))

  // =========================================================================
  // SPA FALLBACK
  // =========================================================================

  // For SPA routing, fallback all non-API routes to index.html
  app.get('*', (req: express.Request, res: express.Response) => {
    const indexPath = path.join(publicDir, 'index.html')
    res.sendFile(indexPath, (err: any) => {
      if (err && res.headersSent === false) {
        res.status(404).json({
          error: 'Not Found',
          message: `${req.path} not found`,
          path: req.path
        })
      }
    })
  })

  // =========================================================================
  // ERROR HANDLING
  // =========================================================================

  app.use((err: Error & { status?: number }, req: express.Request, res: express.Response) => {
    console.error('Error:', err)

    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
      status: err.status || 500,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
  })

  return app
}

/**
 * Start the dashboard server
 */
export async function startUIServer(port: number = 8080): Promise<void> {
  const app = createUIServer()

  app.listen(port, () => {
    console.log(`\n╔════════════════════════════════════════════════════════════╗`)
    console.log(`║         UUIDNA QPU Dashboard Server Running                ║`)
    console.log(`╚════════════════════════════════════════════════════════════╝\n`)
    console.log(`📊 Dashboard:     http://localhost:${port}`)
    console.log(`📡 API Base:      http://localhost:${port}/api`)
    console.log(`🏥 Health Check:  http://localhost:${port}/api/health`)
    console.log(`📈 Metrics:       http://localhost:${port}/api/metrics`)
    console.log(`\n`)
  })
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = parseInt(process.env.PORT || '8080', 10)
  startUIServer(port).catch(console.error)
}
