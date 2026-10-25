// QPU Dashboard: shadcn-based UI Component Library
// Standardized widgets for all dashboards (Performance, Security, Cost, etc.)

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, AreaChart, Area
} from 'recharts'
import {
  AlertCircle, TrendingUp, TrendingDown, Zap, Activity,
  Database, Lock, Clock, DollarSign, Users, Server
} from 'lucide-react'

// ============================================================================
// METRIC CARDS - Universal metric display
// ============================================================================

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  trend?: number  // +5 or -3
  icon?: React.ReactNode
  status?: 'healthy' | 'warning' | 'critical'
  onClick?: () => void
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  trend,
  icon,
  status = 'healthy',
  onClick
}) => {
  const statusColors = {
    healthy: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    critical: 'border-red-200 bg-red-50'
  }

  const trendColor = trend && trend > 0 ? 'text-green-600' : 'text-red-600'

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-shadow ${statusColors[status]}`}
      onClick={onClick}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{label}</CardTitle>
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
  )
}

// ============================================================================
// STATUS INDICATOR - Health status with details
// ============================================================================

interface StatusIndicatorProps {
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number  // seconds
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg border-2 ${style.bg} ${style.border}`}>
          <div className='flex items-center gap-3 mb-4'>
            <div className={`w-4 h-4 rounded-full animate-pulse ${style.dot}`} />
            <span className='font-semibold'>{style.label}</span>
          </div>

          {message && <p className='text-sm text-gray-600 mb-3'>{message}</p>}

          <div className='text-sm'>
            <p>Uptime: {hours}h {minutes}m</p>
          </div>

          {details && (
            <div className='mt-4 space-y-2'>
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

// ============================================================================
// ALERT CARD - Unified alerts across all dashboards
// ============================================================================

interface AlertCardProps {
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  timestamp: Date
  action?: { label: string; onClick: () => void }
}

export const AlertCard: React.FC<AlertCardProps> = ({
  severity,
  title,
  description,
  timestamp,
  action
}) => {
  const severityStyles = {
    critical: { bg: 'bg-red-50', border: 'border-red-300', icon: <AlertCircle className='text-red-600' /> },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-300', icon: <AlertCircle className='text-yellow-600' /> },
    info: { bg: 'bg-blue-50', border: 'border-blue-300', icon: <AlertCircle className='text-blue-600' /> }
  }

  const style = severityStyles[severity]
  const time = timestamp.toLocaleTimeString()

  return (
    <Alert className={`${style.bg} border-2 ${style.border}`}>
      <div className='flex items-start gap-3 w-full'>
        {style.icon}
        <div className='flex-1'>
          <h4 className='font-semibold'>{title}</h4>
          <AlertDescription className='mt-1'>{description}</AlertDescription>
          <div className='flex justify-between items-center mt-2'>
            <span className='text-xs text-gray-600'>{time}</span>
            {action && (
              <Button variant='outline' size='sm' onClick={action.onClick}>
                {action.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Alert>
  )
}

// ============================================================================
// LATENCY CHART - Performance metrics visualization
// ============================================================================

interface LatencyChartProps {
  data: Array<{ time: string; p50: number; p95: number; p99: number }>
  title?: string
}

export const LatencyChart: React.FC<LatencyChartProps> = ({ data, title = 'API Latency' }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Latency percentiles (P50/P95/P99)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='time' />
            <YAxis />
            <Tooltip formatter={(value) => `${value}ms`} />
            <Legend />
            <Line type='monotone' dataKey='p50' stroke='#10b981' strokeWidth={2} name='P50' />
            <Line type='monotone' dataKey='p95' stroke='#f59e0b' strokeWidth={2} name='P95' />
            <Line type='monotone' dataKey='p99' stroke='#ef4444' strokeWidth={2} name='P99' />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ERROR RATE GAUGE - Visual error tracking
// ============================================================================

interface ErrorGaugeProps {
  errorRate: number  // 0-100 percentage
  threshold: number  // warning threshold
}

export const ErrorGauge: React.FC<ErrorGaugeProps> = ({ errorRate, threshold }) => {
  const status = errorRate > threshold ? 'warning' : 'healthy'
  const color = errorRate > threshold ? '#f59e0b' : '#10b981'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col items-center'>
          <div className='text-4xl font-bold' style={{ color }}>
            {errorRate.toFixed(2)}%
          </div>
          <Progress value={errorRate} className='mt-4' />
          <p className='text-sm text-gray-600 mt-2'>
            {status === 'healthy' ? '✓ Within threshold' : '⚠ Exceeds threshold'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// COST BREAKDOWN - Financial visualization
// ============================================================================

interface CostBreakdownProps {
  data: Array<{ name: string; value: number }>
  total: number
  currency?: string
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  data,
  total,
  currency = '$'
}) => {
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444']

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
        <CardDescription>Total: {currency}{total.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie data={data} cx='50%' cy='50%' labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => currency + value.toFixed(2)} />
          </PieChart>
        </ResponsiveContainer>

        <div className='mt-6 space-y-2'>
          {data.map((item, i) => (
            <div key={i} className='flex justify-between'>
              <span className='flex items-center gap-2'>
                <div
                  className='w-3 h-3 rounded-full'
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                {item.name}
              </span>
              <span className='font-semibold'>{currency}{item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// THROUGHPUT CHART - Request/operation tracking
// ============================================================================

interface ThroughputChartProps {
  data: Array<{ time: string; requests: number }>
  title?: string
}

export const ThroughputChart: React.FC<ThroughputChartProps> = ({
  data,
  title = 'Throughput'
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Requests per second</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='time' />
            <YAxis />
            <Tooltip />
            <Area type='monotone' dataKey='requests' stroke='#3b82f6' fill='#93c5fd' />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CACHE HIT RATE - Cache performance indicator
// ============================================================================

interface CacheMetricsProps {
  hitRate: number  // 0-100 percentage
  hits: number
  misses: number
  evictions: number
}

export const CacheMetrics: React.FC<CacheMetricsProps> = ({
  hitRate,
  hits,
  misses,
  evictions
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cache Performance</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <div className='flex justify-between mb-2'>
            <span>Hit Rate</span>
            <span className='font-semibold'>{hitRate.toFixed(1)}%</span>
          </div>
          <Progress value={hitRate} />
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <div>
            <p className='text-sm text-gray-600'>Hits</p>
            <p className='text-2xl font-bold'>{hits.toLocaleString()}</p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>Misses</p>
            <p className='text-2xl font-bold'>{misses.toLocaleString()}</p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>Evictions</p>
            <p className='text-2xl font-bold'>{evictions.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DASHBOARD GRID - Master layout component
// ============================================================================

interface DashboardGridProps {
  title: string
  description?: string
  children: React.ReactNode
  refreshInterval?: number
  onRefresh?: () => void
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  title,
  description,
  children,
  refreshInterval,
  onRefresh
}) => {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='text-3xl font-bold'>{title}</h1>
          {description && <p className='text-gray-600 mt-1'>{description}</p>}
        </div>
        {onRefresh && (
          <Button onClick={onRefresh} variant='outline'>
            Refresh
          </Button>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {children}
      </div>
    </div>
  )
}

// ============================================================================
// EXPORT: All components ready to use
// ============================================================================

export default {
  MetricCard,
  StatusIndicator,
  AlertCard,
  LatencyChart,
  ErrorGauge,
  CostBreakdown,
  ThroughputChart,
  CacheMetrics,
  DashboardGrid
}
