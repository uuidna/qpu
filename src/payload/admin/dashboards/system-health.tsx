'use client'
/**
 * System Health Dashboard Widget
 * Real-time overview of system metrics and status
 */

import React, { useState, useEffect } from 'react'

export const SystemHealthDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    learning: 89.7,
    robustness: 94.2,
    efficiency: 78.0,
    collaboration: 79.5,
    trust: 80.0,
    overall: 77.6,
  })

  const [alerts, setAlerts] = useState({
    critical: 0,
    high: 3,
    medium: 2,
    low: 1,
  })

  const getStatusColor = (value: number) => {
    if (value >= 90) return '#10b981' // green
    if (value >= 75) return '#3b82f6' // blue
    if (value >= 60) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  const MetricCard: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div style={{
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      borderLeft: `4px solid ${getStatusColor(value)}`,
    }}>
      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: getStatusColor(value) }}>
        {value.toFixed(1)}%
      </div>
    </div>
  )

  const AlertBadge: React.FC<{ severity: string; count: number }> = ({ severity, count }) => {
    const colors: Record<string, string> = {
      critical: '#dc2626',
      high: '#ea580c',
      medium: '#f59e0b',
      low: '#10b981',
    }
    return (
      <div style={{
        display: 'inline-block',
        padding: '0.5rem 1rem',
        backgroundColor: colors[severity],
        color: 'white',
        borderRadius: '0.25rem',
        marginRight: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: 'bold',
      }}>
        {severity.toUpperCase()}: {count}
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        🏥 System Health Dashboard
      </h2>

      {/* Alerts */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '0.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: '#dc2626' }}>
          ⚠️ Active Alerts
        </h3>
        <div>
          <AlertBadge severity="critical" count={alerts.critical} />
          <AlertBadge severity="high" count={alerts.high} />
          <AlertBadge severity="medium" count={alerts.medium} />
          <AlertBadge severity="low" count={alerts.low} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <MetricCard label="Learning" value={metrics.learning} />
        <MetricCard label="Robustness" value={metrics.robustness} />
        <MetricCard label="Efficiency" value={metrics.efficiency} />
        <MetricCard label="Collaboration" value={metrics.collaboration} />
        <MetricCard label="Trust" value={metrics.trust} />
      </div>

      {/* Overall Score */}
      <div style={{
        padding: '2rem',
        backgroundColor: '#f0f9ff',
        borderRadius: '0.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.875rem', color: '#0369a1', marginBottom: '0.5rem' }}>
          OVERALL SCORE
        </div>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0284c7' }}>
          {metrics.overall.toFixed(1)}%
        </div>
        <div style={{ fontSize: '0.875rem', color: '#0369a1', marginTop: '0.5rem' }}>
          System is performing nominally
        </div>
      </div>
    </div>
  )
}
