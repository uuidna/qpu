/**
 * Support Tickets Dashboard Widget
 * Real-time view of support tickets and SLA status
 */

import React from 'react'

interface Ticket {
  id: string
  number: string
  subject: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'waiting' | 'resolved'
  requester: string
  slaStatus: 'met' | 'at-risk' | 'breached'
  hoursOpen: number
}

export const SupportTicketsDashboard: React.FC = () => {
  const tickets: Ticket[] = [
    {
      id: '1',
      number: 'TICKET-001',
      subject: 'API not responding',
      priority: 'critical',
      status: 'open',
      requester: 'John',
      slaStatus: 'at-risk',
      hoursOpen: 2,
    },
    {
      id: '2',
      number: 'TICKET-002',
      subject: 'Dashboard loading slowly',
      priority: 'high',
      status: 'in-progress',
      requester: 'Jane',
      slaStatus: 'met',
      hoursOpen: 4,
    },
    {
      id: '3',
      number: 'TICKET-003',
      subject: 'Feature request',
      priority: 'low',
      status: 'waiting',
      requester: 'Bob',
      slaStatus: 'met',
      hoursOpen: 8,
    },
  ]

  const stats = {
    open: 2,
    inProgress: 1,
    waiting: 0,
    avgResolutionTime: '4.2h',
    slaMet: 2,
    slaBreached: 0,
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: '#dc2626',
      high: '#ea580c',
      medium: '#f59e0b',
      low: '#10b981',
    }
    return colors[priority] || '#6b7280'
  }

  const getSLAColor = (status: string) => {
    const colors: Record<string, string> = {
      met: '#10b981',
      'at-risk': '#f59e0b',
      breached: '#dc2626',
    }
    return colors[status] || '#6b7280'
  }

  const StatCard: React.FC<{ label: string; value: string | number; color?: string }> = ({
    label,
    value,
    color = '#3b82f6',
  }) => (
    <div style={{
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      textAlign: 'center',
      borderTop: `4px solid ${color}`,
    }}>
      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color }}>
        {value}
      </div>
    </div>
  )

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        🎫 Support Tickets Dashboard
      </h2>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <StatCard label="Open Tickets" value={stats.open} color="#dc2626" />
        <StatCard label="In Progress" value={stats.inProgress} color="#f59e0b" />
        <StatCard label="Awaiting Response" value={stats.waiting} color="#3b82f6" />
        <StatCard label="Avg Resolution" value={stats.avgResolutionTime} color="#10b981" />
        <StatCard label="SLA Met" value={stats.slaMet} color="#10b981" />
        <StatCard label="SLA Breached" value={stats.slaBreached} color="#ef4444" />
      </div>

      {/* Tickets List */}
      <div style={{
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold' }}>
                Ticket
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold' }}>
                Subject
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold' }}>
                Priority
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold' }}>
                Status
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold' }}>
                SLA
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold' }}>
                Age
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
                  {ticket.number}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                  {ticket.subject}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: getPriorityColor(ticket.priority),
                    color: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#dbeafe',
                    color: '#0369a1',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}>
                    {ticket.status.replace('-', ' ').toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: getSLAColor(ticket.slaStatus),
                    color: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}>
                    {ticket.slaStatus.replace('-', ' ').toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  {ticket.hoursOpen}h
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: '#fef2f2',
        borderRadius: '0.25rem',
        fontSize: '0.875rem',
        color: '#dc2626',
      }}>
        ⚠️ {stats.open} tickets require immediate attention. {stats.slaMet} SLA targets being met.
      </div>
    </div>
  )
}
