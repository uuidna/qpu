/**
 * Payload CMS Admin Dashboards
 * Consolidated view of all system metrics and statuses
 */

import React, { useState } from 'react'
import { SystemHealthDashboard } from './system-health'
import { ComplianceOverviewDashboard } from './compliance-overview'
import { SupportTicketsDashboard } from './support-tickets'
import { TrainingProgressDashboard } from './training-progress'

type DashboardType = 'health' | 'compliance' | 'support' | 'training'

export const AdminDashboard: React.FC = () => {
  const [activeDashboard, setActiveDashboard] = useState<DashboardType>('health')

  const dashboards: Record<DashboardType, { label: string; icon: string }> = {
    health: { label: 'System Health', icon: '🏥' },
    compliance: { label: 'Compliance', icon: '📋' },
    support: { label: 'Support', icon: '🎫' },
    training: { label: 'Training', icon: '🎓' },
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '1.5rem 2rem',
        borderBottom: '1px solid #374151',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            🚀 UUIDNA QPU Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
            Real-time system monitoring and management
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 2rem',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          gap: '0',
        }}>
          {(Object.entries(dashboards) as Array<[DashboardType, typeof dashboards['health']]>).map(
            ([key, { label, icon }]) => (
              <button
                key={key}
                onClick={() => setActiveDashboard(key)}
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: activeDashboard === key ? 'white' : 'transparent',
                  borderBottom: activeDashboard === key ? '2px solid #3b82f6' : '2px solid transparent',
                  color: activeDashboard === key ? '#1f2937' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: activeDashboard === key ? 'bold' : 'normal',
                  border: 'none',
                  transition: 'all 0.2s',
                }}
              >
                {icon} {label}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Dashboard Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: 'white',
        minHeight: 'calc(100vh - 200px)',
      }}>
        {activeDashboard === 'health' && <SystemHealthDashboard />}
        {activeDashboard === 'compliance' && <ComplianceOverviewDashboard />}
        {activeDashboard === 'support' && <SupportTicketsDashboard />}
        {activeDashboard === 'training' && <TrainingProgressDashboard />}
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#6b7280',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p>UUIDNA QPU v1.0.0 • Payload CMS • Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
