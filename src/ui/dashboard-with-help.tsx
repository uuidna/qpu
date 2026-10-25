/**
 * QPU Dashboard Components with Integrated Help System
 *
 * @module dashboard-with-help
 * @description Standardized shadcn-based UI components for all QPU dashboards
 * with embedded documentation and in-app help.
 *
 * ## Features
 * - ✓ Inline JSDoc documentation for every component
 * - ✓ Context-sensitive help overlays
 * - ✓ Hoverable info icons with tooltips
 * - ✓ Keyboard shortcut help (? key)
 * - ✓ Searchable help index
 * - ✓ Integration with performance/security/cost/observability dashboards
 *
 * @example
 * ```tsx
 * import { MetricCard, HelpSystem } from '@/components/ui/dashboard-with-help'
 *
 * export default function Dashboard() {
 *   return (
 *     <HelpProvider>
 *       <MetricCard
 *         label="API Latency P50"
 *         value={45}
 *         unit="ms"
 *         help="Time below which 50% of requests complete"
 *       />
 *       <HelpDialog />
 *     </HelpProvider>
 *   )
 * }
 * ```
 */

import React, { createContext, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { HelpCircle, X, Search } from 'lucide-react'

/**
 * Help Context for managing help state across app
 */
const HelpContext = createContext({
  showHelp: false,
  setShowHelp: (show: boolean) => {},
  searchQuery: '',
  setSearchQuery: (query: string) => {}
})

/**
 * Help Provider - Wraps dashboard with help functionality
 *
 * @component
 * @example
 * ```tsx
 * <HelpProvider>
 *   <Dashboard />
 * </HelpProvider>
 * ```
 */
export const HelpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showHelp, setShowHelp] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && !showHelp) {
        setShowHelp(true)
      }
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showHelp])

  return (
    <HelpContext.Provider value={{ showHelp, setShowHelp, searchQuery, setSearchQuery }}>
      {children}
    </HelpContext.Provider>
  )
}

/**
 * Metric Card with integrated help
 *
 * Displays a single metric value with optional trend, status indicator, and help text.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Metric label (e.g., "API Latency P50")
 * @param {string|number} props.value - The metric value
 * @param {string} [props.unit] - Unit suffix (e.g., "ms", "%")
 * @param {number} [props.trend] - Trend percentage (positive or negative)
 * @param {React.ReactNode} [props.icon] - Optional icon component
 * @param {'healthy'|'warning'|'critical'} [props.status='healthy'] - Status color
 * @param {string} [props.help] - Inline help text
 * @param {Function} [props.onClick] - Click handler for drill-down
 *
 * @example
 * ```tsx
 * <MetricCard
 *   label="API Latency P50"
 *   value={45}
 *   unit="ms"
 *   trend={-5}
 *   help="Time below which 50% of requests complete. Lower is better."
 *   status="healthy"
 * />
 * ```
 *
 * ## Help Context
 * - **What is P50?** - The 50th percentile of latency. Half your requests are faster, half slower.
 * - **Why track it?** - Represents typical user experience
 * - **Healthy range** - <50ms for web, <10ms for APIs
 * - **Related metrics** - See P95, P99 for tail latency
 */
interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  trend?: number
  icon?: React.ReactNode
  status?: 'healthy' | 'warning' | 'critical'
  help?: string
  onClick?: () => void
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  trend,
  icon,
  status = 'healthy',
  help,
  onClick
}) => {
  const statusStyles = {
    healthy: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    critical: 'border-red-200 bg-red-50'
  }

  const trendColor = trend && trend > 0 ? 'text-green-600' : 'text-red-600'

  return (
    <TooltipProvider>
      <Card
        className={`cursor-pointer hover:shadow-lg transition-shadow ${statusStyles[status]}`}
        onClick={onClick}
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-sm font-medium'>{label}</CardTitle>
            {help && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className='w-4 h-4 text-blue-500 cursor-help' />
                </TooltipTrigger>
                <TooltipContent side='right' className='max-w-xs'>
                  <p>{help}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {icon && <div className='text-muted-foreground'>{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {value}
            {unit && <span className='text-lg ml-1'>{unit}</span>}
          </div>
          {trend && (
            <p className={`text-xs mt-2 ${trendColor}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last period
            </p>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

/**
 * Chart Component with Embedded Help
 *
 * Base chart component with help panel for chart interpretation.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Chart title
 * @param {string} [props.description] - Chart description
 * @param {string} [props.help] - How to read this chart
 * @param {React.ReactNode} props.children - Chart content (Recharts)
 *
 * @example
 * ```tsx
 * <ChartWithHelp
 *   title="API Latency Trend"
 *   description="Last 24 hours"
 *   help="Green = P50 (median), Orange = P95, Red = P99 (worst 1%)"
 * >
 *   <LineChart data={data}>
 *     {/* ... */}
 *   </LineChart>
 * </ChartWithHelp>
 * ```
 *
 * ## Understanding Latency Charts
 * - **P50 (Green)** - Median latency, represents typical user
 * - **P95 (Orange)** - 95% of users experience this or better
 * - **P99 (Red)** - Tail latency, 1% of users hit this
 *
 * ## When to Investigate
 * - P99 > 1000ms: Something is slow (indexing? memory?)
 * - Gap between P50 and P99 > 5x: Inconsistent performance
 * - Sudden spike: Resource contention or bad query
 */
interface ChartWithHelpProps {
  title: string
  description?: string
  help?: string
  children: React.ReactNode
}

export const ChartWithHelp: React.FC<ChartWithHelpProps> = ({
  title,
  description,
  help,
  children
}) => {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {help && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowHelp(!showHelp)}
            >
              <HelpCircle className='w-4 h-4' />
            </Button>
          )}
        </div>
        {showHelp && help && (
          <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm'>
            {help}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

/**
 * Help Dialog - Global help system
 *
 * Displays searchable help index for all components.
 * Open with '?' key, close with Escape.
 *
 * @component
 * @example
 * ```tsx
 * <HelpProvider>
 *   <Dashboard />
 *   <HelpDialog />
 * </HelpProvider>
 * ```
 *
 * ## Keyboard Shortcuts
 * - `?` - Open help
 * - `Escape` - Close help
 * - `/` - Focus search
 *
 * ## Help Topics Included
 * - Metrics explained (P50, P95, P99, error rate, etc.)
 * - Chart interpretation
 * - Status indicators
 * - Alert severity levels
 * - Cost optimization tips
 * - Security best practices
 */
export const HelpDialog: React.FC = () => {
  const { showHelp, setShowHelp, searchQuery, setSearchQuery } = React.useContext(HelpContext)

  const helpTopics = [
    {
      category: 'Metrics',
      items: [
        {
          title: 'P50 Latency',
          description: 'Median latency - 50% of requests are faster, 50% slower',
          keywords: ['p50', 'median', 'latency', 'performance']
        },
        {
          title: 'P95 Latency',
          description: '95th percentile - where 95% of requests complete',
          keywords: ['p95', 'percentile', 'latency']
        },
        {
          title: 'P99 Latency',
          description: 'Tail latency - represents worst-performing 1% of requests',
          keywords: ['p99', 'tail', 'latency', 'worst']
        },
        {
          title: 'Error Rate',
          description: 'Percentage of failed requests. Healthy: <0.1%',
          keywords: ['error', 'rate', 'failures', 'health']
        },
        {
          title: 'Cache Hit Rate',
          description: 'Percentage of requests served from cache. Target: >80%',
          keywords: ['cache', 'hit', 'rate', 'performance']
        }
      ]
    },
    {
      category: 'Status & Alerts',
      items: [
        {
          title: 'Healthy Status',
          description: 'All metrics within acceptable ranges. No action needed.',
          keywords: ['healthy', 'status', 'good']
        },
        {
          title: 'Degraded Status',
          description: 'Some metrics elevated but system functional. Monitor closely.',
          keywords: ['degraded', 'warning', 'caution']
        },
        {
          title: 'Unhealthy Status',
          description: 'Critical metrics breached. Immediate investigation required.',
          keywords: ['unhealthy', 'critical', 'alert', 'emergency']
        },
        {
          title: 'Alert Severity',
          description: 'Critical: action now | Warning: investigate soon | Info: FYI',
          keywords: ['alert', 'severity', 'critical', 'warning']
        }
      ]
    },
    {
      category: 'Cost Optimization',
      items: [
        {
          title: 'Cost by Provider',
          description: 'SQLite (25%) < D1 (25%) < MongoDB (25%) < PostgreSQL (25%)',
          keywords: ['cost', 'provider', 'pricing', 'optimization']
        },
        {
          title: 'Cost per Operation',
          description: 'Lower is better. Target: <0.01¢ per operation',
          keywords: ['cost', 'operation', 'efficiency']
        },
        {
          title: 'Saving Tips',
          description: '1. Increase cache hit rate 2. Use SQLite for non-critical 3. Optimize queries',
          keywords: ['save', 'cost', 'optimize', 'efficiency']
        }
      ]
    },
    {
      category: 'Security',
      items: [
        {
          title: 'Audit Trail',
          description: 'Immutable log of all database changes. Every operation recorded.',
          keywords: ['audit', 'trail', 'logging', 'security']
        },
        {
          title: 'Authorization',
          description: 'RBAC (6 roles) + ABAC (attribute-based). Field-level control.',
          keywords: ['authorization', 'access', 'control', 'security']
        },
        {
          title: 'Encryption',
          description: 'AES-256 at rest, TLS in transit. Field-level encryption available.',
          keywords: ['encryption', 'security', 'tls', 'aes']
        }
      ]
    }
  ]

  const filtered = helpTopics
    .map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.some(k => k.includes(searchQuery.toLowerCase()))
      )
    }))
    .filter(category => category.items.length > 0)

  if (!showHelp) return null

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <Card className='w-full max-w-2xl max-h-96 flex flex-col'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Help & Documentation</CardTitle>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setShowHelp(false)}
          >
            <X className='w-4 h-4' />
          </Button>
        </CardHeader>

        <div className='px-6 pb-4 flex gap-2'>
          <Search className='w-4 h-4 mt-1 text-gray-500' />
          <Input
            placeholder='Search help topics...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <CardContent className='flex-1 overflow-y-auto'>
          {filtered.length === 0 ? (
            <p className='text-gray-500'>No matching topics found</p>
          ) : (
            <div className='space-y-6'>
              {filtered.map(category => (
                <div key={category.category}>
                  <h3 className='font-semibold mb-3'>{category.category}</h3>
                  <div className='space-y-3'>
                    {category.items.map(item => (
                      <div key={item.title} className='border-l-2 border-blue-500 pl-4'>
                        <h4 className='font-medium'>{item.title}</h4>
                        <p className='text-sm text-gray-600'>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardHeader className='border-t'>
          <div className='text-xs text-gray-600 space-y-1'>
            <p>💡 <kbd className='bg-gray-100 px-2 py-1 rounded'>?</kbd> Open help</p>
            <p>💡 <kbd className='bg-gray-100 px-2 py-1 rounded'>Esc</kbd> Close help</p>
            <p>💡 Hover over <HelpCircle className='w-3 h-3 inline' /> icons for quick help</p>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}

/**
 * Status Indicator with Help
 *
 * Shows system health with status explanation.
 *
 * @component
 * @param {Object} props - Component props
 * @param {'healthy'|'degraded'|'unhealthy'} props.status - Current status
 * @param {number} props.uptime - Uptime in seconds
 * @param {string} [props.message] - Status message
 * @param {Array} [props.details] - Additional details
 *
 * @example
 * ```tsx
 * <StatusIndicator
 *   status="healthy"
 *   uptime={3600}
 *   message="All systems operational"
 *   details={[
 *     { label: 'Region', value: 'us-west-2' },
 *     { label: 'Version', value: '8.0.0' }
 *   ]}
 * />
 * ```
 *
 * ## Status Meanings
 * - **Healthy** - All metrics within SLO
 * - **Degraded** - Some metrics elevated, core services functional
 * - **Unhealthy** - Critical failures, may impact users
 */
interface StatusIndicatorProps {
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number
  message?: string
  details?: Array<{ label: string; value: string }>
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  uptime,
  message,
  details
}) => {
  const statusStyles = {
    healthy: { bg: 'bg-green-100', border: 'border-green-500', dot: 'bg-green-500', label: 'Healthy' },
    degraded: { bg: 'bg-yellow-100', border: 'border-yellow-500', dot: 'bg-yellow-500', label: 'Degraded' },
    unhealthy: { bg: 'bg-red-100', border: 'border-red-500', dot: 'bg-red-500', label: 'Unhealthy' }
  }

  const style = statusStyles[status]
  const hours = Math.floor(uptime / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)

  const statusHelp = {
    healthy: 'All metrics within acceptable ranges. System operating normally.',
    degraded: 'Some metrics elevated. Monitor for deterioration. May need scaling.',
    unhealthy: 'Critical metrics breached. Immediate investigation and action required.'
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>System Status</CardTitle>
        <Badge variant={status === 'healthy' ? 'default' : 'destructive'}>
          {style.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg border-2 ${style.bg} ${style.border}`}>
          <div className='flex items-center gap-3 mb-4'>
            <div className={`w-4 h-4 rounded-full animate-pulse ${style.dot}`} />
            <div>
              <p className='font-semibold'>{style.label}</p>
              <p className='text-sm text-gray-600'>{statusHelp[status]}</p>
            </div>
          </div>

          {message && <p className='text-sm text-gray-700 mb-3'>{message}</p>}

          <div className='text-sm'>
            <p>Uptime: {hours}h {minutes}m</p>
          </div>

          {details && (
            <div className='mt-4 space-y-2 border-t pt-4'>
              {details.map((detail, i) => (
                <div key={i} className='flex justify-between text-sm'>
                  <span className='text-gray-600'>{detail.label}</span>
                  <span className='font-medium'>{detail.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default {
  HelpProvider,
  HelpDialog,
  MetricCard,
  ChartWithHelp,
  StatusIndicator
}
