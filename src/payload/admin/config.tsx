/**
 * Payload CMS Admin Configuration
 * Customizes admin UI with dashboards and widgets
 */

import React from 'react'
import { RichTextAdapter } from '@payloadcms/richtext-slate'
import AdminDashboard from './dashboards'

/**
 * Admin configuration override
 * Provides custom dashboard and layout
 */
export const customAdminConfig = {
  // Custom dashboard component
  dashboard: {
    component: AdminDashboard,
  },

  // Admin UI customization
  css: `
    /* Dark theme customization */
    :root {
      --color-primary: #3b82f6;
      --color-success: #10b981;
      --color-warning: #f59e0b;
      --color-error: #dc2626;
      --color-text: #1f2937;
      --color-text-secondary: #6b7280;
      --color-background: #ffffff;
      --color-border: #e5e7eb;
    }

    /* Dashboard styling */
    .payload-admin {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    }

    /* Cards */
    .dashboard-card {
      border-radius: 0.5rem;
      border: 1px solid var(--color-border);
      padding: 1.5rem;
      background: white;
    }

    /* Metrics */
    .metric-card {
      text-align: center;
      padding: 1rem;
    }

    .metric-value {
      font-size: 1.875rem;
      font-weight: bold;
      margin: 0.5rem 0;
    }

    .metric-label {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    /* Status badges */
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .status-critical {
      background: #dc2626;
      color: white;
    }

    .status-high {
      background: #ea580c;
      color: white;
    }

    .status-medium {
      background: #f59e0b;
      color: white;
    }

    .status-low {
      background: #10b981;
      color: white;
    }

    .status-success {
      background: #dbeafe;
      color: #0369a1;
    }

    /* Progress bars */
    .progress-bar {
      width: 100%;
      height: 0.5rem;
      background: var(--color-border);
      border-radius: 0.25rem;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(to right, #3b82f6, #8b5cf6);
      transition: width 0.3s ease;
    }

    /* Tables */
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background: #f3f4f6;
      padding: 1rem;
      text-align: left;
      font-size: 0.875rem;
      font-weight: bold;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table tr:hover {
      background: #f9fafb;
    }

    /* Alerts */
    .alert {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .alert-critical {
      background: #fee2e2;
      border-left: 4px solid #dc2626;
      color: #991b1b;
    }

    .alert-info {
      background: #dbeafe;
      border-left: 4px solid #3b82f6;
      color: #0369a1;
    }

    .alert-success {
      background: #dcfce7;
      border-left: 4px solid #10b981;
      color: #166534;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr !important;
      }

      .metric-card {
        padding: 0.75rem;
      }
    }
  `,

  // Navigation customization
  nav: {
    groups: [
      {
        label: 'Content Management',
        items: [
          { path: '/users', label: '👥 Users' },
          { path: '/audit-logs', label: '📊 Audit Logs' },
          { path: '/metrics', label: '📈 Metrics' },
        ],
      },
      {
        label: 'Operations',
        items: [
          { path: '/compliance-issues', label: '🔒 Compliance Issues' },
          { path: '/support-tickets', label: '🎫 Support Tickets' },
          { path: '/certifications', label: '🏆 Certifications' },
        ],
      },
      {
        label: 'Learning',
        items: [
          { path: '/enrollments', label: '🎓 Enrollments' },
        ],
      },
    ],
  },

  // Widgets configuration
  widgets: {
    // System health widget
    systemHealth: {
      component: () => (
        <div style={{
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
        }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 'bold' }}>
            🏥 System Health
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#0369a1' }}>
            All systems operational. 77.6% overall score.
          </div>
        </div>
      ),
    },

    // Quick stats widget
    quickStats: {
      component: () => (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}>
          {[
            { label: 'Users', value: 5 },
            { label: 'Open Tickets', value: 2 },
            { label: 'Courses', value: 3 },
            { label: 'Issues', value: 12 },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stat.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      ),
    },

    // Recent activity widget
    recentActivity: {
      component: () => (
        <div style={{
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid #e5e7eb',
        }}>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 'bold' }}>
            📋 Recent Activity
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            {[
              'Ticket #001 created - Critical priority',
              'Compliance scan completed - 5 issues found',
              'User John enrolled in course-1',
              'ISO 27001 audit in progress - 65% complete',
              'API latency measured at 250ms',
            ].map((activity, idx) => (
              <li
                key={idx}
                style={{
                  padding: '0.5rem 0',
                  borderBottom: idx < 4 ? '1px solid #e5e7eb' : 'none',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}
              >
                {activity}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  },
}

export default customAdminConfig
