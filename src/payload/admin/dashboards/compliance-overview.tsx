/**
 * Compliance Overview Dashboard Widget
 * Tracks compliance issues and certifications
 */

import React from 'react'

export const ComplianceOverviewDashboard: React.FC = () => {
  const issues = {
    critical: 3,
    high: 2,
    medium: 5,
    low: 8,
    resolved: 2,
  }

  const certifications = {
    'SOC 2': { status: 'planning', progress: 0 },
    'ISO 27001': { status: 'in-progress', progress: 65 },
    'HIPAA': { status: 'completed', progress: 100 },
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      planning: '📋',
      'in-progress': '⚙️',
      completed: '✅',
      expired: '⏰',
    }
    return icons[status] || '❓'
  }

  const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div style={{
      width: '100%',
      height: '1rem',
      backgroundColor: '#e5e7eb',
      borderRadius: '0.25rem',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${value}%`,
        backgroundColor: value === 100 ? '#10b981' : '#3b82f6',
        transition: 'width 0.3s ease',
      }} />
    </div>
  )

  const IssueCount: React.FC<{ severity: string; count: number }> = ({ severity, count }) => {
    const colors: Record<string, string> = {
      critical: '#dc2626',
      high: '#ea580c',
      medium: '#f59e0b',
      low: '#10b981',
      resolved: '#0891b2',
    }
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 0',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <div style={{
          width: '1rem',
          height: '1rem',
          backgroundColor: colors[severity],
          borderRadius: '50%',
          marginRight: '0.75rem',
        }} />
        <span style={{ flex: 1, fontSize: '0.875rem', color: '#374151' }}>
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </span>
        <span style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: colors[severity],
        }}>
          {count}
        </span>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        📋 Compliance Overview
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
      }}>
        {/* Issues Summary */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
        }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 'bold' }}>
            Security Issues
          </h3>
          <IssueCount severity="critical" count={issues.critical} />
          <IssueCount severity="high" count={issues.high} />
          <IssueCount severity="medium" count={issues.medium} />
          <IssueCount severity="low" count={issues.low} />
          <IssueCount severity="resolved" count={issues.resolved} />
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#dbeafe',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            color: '#0369a1',
          }}>
            Total: {issues.critical + issues.high + issues.medium + issues.low} open,{' '}
            {issues.resolved} resolved
          </div>
        </div>

        {/* Certifications Status */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
        }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 'bold' }}>
            Certifications
          </h3>
          {Object.entries(certifications).map(([name, cert]) => (
            <div key={name} style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}>
                <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>
                  {getStatusIcon(cert.status)}
                </span>
                <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 'bold' }}>
                  {name}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  backgroundColor: '#e5e7eb',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                }}>
                  {cert.status}
                </span>
              </div>
              <ProgressBar value={cert.progress} />
              <div style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginTop: '0.25rem',
              }}>
                {cert.progress}% complete
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f3fafb',
        borderLeft: '4px solid #06b6d4',
        borderRadius: '0.25rem',
      }}>
        <div style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: 'bold' }}>
          💡 Compliance Status
        </div>
        <div style={{ fontSize: '0.875rem', color: '#0369a1', marginTop: '0.5rem' }}>
          1/3 frameworks completed, 1 in progress, 1 in planning.{' '}
          <strong>18 issues need resolution.</strong>
        </div>
      </div>
    </div>
  )
}
