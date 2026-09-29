/**
 * MCP UI Adapter - Fuses shadcn/ui with MCP system for standardized UI
 */

import { shadcnComponents } from './components.js'
import { designSystem } from './design-system.js'

export interface MCPUIRequest {
  tool: string
  action: 'render' | 'form' | 'dashboard' | 'report'
  params: Record<string, unknown>
  theme?: 'light' | 'dark' | 'system'
}

export interface MCPUIResponse {
  html: string
  scripts?: string[]
  styles?: Record<string, string>
  metadata: {
    tool: string
    action: string
    version: string
    timestamp: Date
  }
}

export interface DashboardConfig {
  title: string
  widgets: Widget[]
  layout: 'grid' | 'flex'
  cols?: number
}

export interface Widget {
  id: string
  title: string
  type: 'metric' | 'chart' | 'table' | 'card' | 'alert'
  content: unknown
  size?: 'sm' | 'md' | 'lg' | 'full'
}

export class MCPUIAdapter {
  constructor() {
    designSystem.setTheme('light')
  }

  renderDashboard(config: DashboardConfig): MCPUIResponse {
    const tokens = designSystem.getTokens()
    const widgets = config.widgets
      .map(widget => this.renderWidget(widget))
      .join('')

    const gridClass =
      config.layout === 'grid'
        ? `display:grid;grid-template-columns:repeat(${config.cols || 2}, 1fr);gap:${tokens.spacing.lg}`
        : `display:flex;flex-direction:column;gap:${tokens.spacing.lg}`

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <style>
    :root {
      ${Object.entries(designSystem.getCSSVariables())
        .map(([k, v]) => `${k}: ${v}`)
        .join(';')}
    }
    body {
      font-family: ${tokens.typography.fontFamily};
      background-color: ${tokens.colors.background};
      color: ${tokens.colors.foreground};
      margin: 0;
      padding: ${tokens.spacing.xl};
    }
    h1 { margin-top: 0; font-size: ${tokens.typography.fontSize['3xl']}; font-weight: ${tokens.typography.fontWeight.bold}; }
    .dashboard-grid { ${gridClass} }
    .widget { padding: ${tokens.spacing.lg}; }
  </style>
</head>
<body>
  <h1>${config.title}</h1>
  <div class="dashboard-grid">
    ${widgets}
  </div>
</body>
</html>
    `

    return {
      html,
      metadata: {
        tool: 'dashboard',
        action: 'render',
        version: '1.0.0',
        timestamp: new Date()
      }
    }
  }

  private renderWidget(widget: Widget): string {
    const tokens = designSystem.getTokens()
    const sizeClasses: Record<string, string> = {
      sm: `width:${tokens.spacing['2xl']}`,
      md: `width:50%`,
      lg: `width:100%`,
      full: `width:100%`
    }

    const sizeStyle = sizeClasses[widget.size || 'md']

    let content = ''
    switch (widget.type) {
      case 'metric':
        content = this.renderMetricWidget(widget.content as Record<string, unknown>)
        break
      case 'chart':
        content = `<p>Chart: ${JSON.stringify(widget.content)}</p>`
        break
      case 'table':
        content = this.renderTableWidget(widget.content as Record<string, unknown>)
        break
      case 'card':
        content = shadcnComponents.Card(widget.content as Record<string, unknown>)
        break
      case 'alert':
        content = shadcnComponents.Alert(widget.content as Record<string, unknown>)
        break
    }

    return `
<div class="widget" style="${sizeStyle}">
  <h3 style="margin-top:0;font-size:${tokens.typography.fontSize.lg};font-weight:${tokens.typography.fontWeight.semibold}">${widget.title}</h3>
  ${content}
</div>
    `
  }

  private renderMetricWidget(data: Record<string, unknown>): string {
    const tokens = designSystem.getTokens()
    return `
<div style="display:flex;justify-content:space-between;align-items:center">
  <div>
    <p style="margin:0;font-size:${tokens.typography.fontSize.sm};color:${tokens.colors.muted}">${data.label}</p>
    <p style="margin:${tokens.spacing.sm} 0 0 0;font-size:${tokens.typography.fontSize['2xl']};font-weight:${tokens.typography.fontWeight.bold};color:${data.trend === 'up' ? '#10b981' : '#ef4444'}">${data.value}</p>
  </div>
  <span style="font-size:${tokens.typography.fontSize.xl}">${data.trend === 'up' ? '↑' : '↓'}</span>
</div>
    `
  }

  private renderTableWidget(data: Record<string, unknown>): string {
    return shadcnComponents.Table(data as Record<string, unknown>)
  }

  renderForm(title: string, fields: unknown[], onSubmit?: string): MCPUIResponse {
    const tokens = designSystem.getTokens()

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      ${Object.entries(designSystem.getCSSVariables())
        .map(([k, v]) => `${k}: ${v}`)
        .join(';')}
    }
    body {
      font-family: ${tokens.typography.fontFamily};
      background-color: ${tokens.colors.background};
      color: ${tokens.colors.foreground};
      margin: 0;
      padding: ${tokens.spacing.xl};
    }
    .form-container {
      max-width: 600px;
      margin: 0 auto;
    }
    h1 { font-size: ${tokens.typography.fontSize['2xl']}; font-weight: ${tokens.typography.fontWeight.bold}; }
  </style>
</head>
<body>
  <div class="form-container">
    <h1>${title}</h1>
    ${shadcnComponents.Form({
      fields: fields as any[],
      onSubmit: () => {}
    })}
  </div>
</body>
</html>
    `

    return {
      html,
      metadata: {
        tool: 'form',
        action: 'render',
        version: '1.0.0',
        timestamp: new Date()
      }
    }
  }

  renderReport(title: string, sections: Array<{ heading: string; content: string }>): MCPUIResponse {
    const tokens = designSystem.getTokens()

    const sectionsHtml = sections
      .map(
        section => `
<section style="margin-bottom:${tokens.spacing['2xl']};page-break-inside:avoid">
  <h2 style="border-bottom:2px solid ${tokens.colors.primary};padding-bottom:${tokens.spacing.md};margin-bottom:${tokens.spacing.lg}">${section.heading}</h2>
  <div>${section.content}</div>
</section>
      `
      )
      .join('')

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      ${Object.entries(designSystem.getCSSVariables())
        .map(([k, v]) => `${k}: ${v}`)
        .join(';')}
    }
    body {
      font-family: ${tokens.typography.fontFamily};
      background-color: ${tokens.colors.background};
      color: ${tokens.colors.foreground};
      margin: 0;
      padding: ${tokens.spacing['3xl']};
      line-height: ${tokens.typography.lineHeight.relaxed};
    }
    h1 { font-size: ${tokens.typography.fontSize['3xl']}; font-weight: ${tokens.typography.fontWeight.bold}; }
    h2 { font-size: ${tokens.typography.fontSize['2xl']}; font-weight: ${tokens.typography.fontWeight.semibold}; }
    .header {
      border-bottom: 2px solid ${tokens.colors.border};
      padding-bottom: ${tokens.spacing.xl};
      margin-bottom: ${tokens.spacing['2xl']};
    }
    .footer {
      border-top: 2px solid ${tokens.colors.border};
      padding-top: ${tokens.spacing.xl};
      margin-top: ${tokens.spacing['2xl']};
      font-size: ${tokens.typography.fontSize.sm};
      color: ${tokens.colors.muted};
    }
    table { width: 100%; border-collapse: collapse; margin: ${tokens.spacing.lg} 0; }
    th { background-color: ${tokens.colors.muted}; padding: ${tokens.spacing.md}; text-align: left; }
    td { padding: ${tokens.spacing.md}; border-bottom: 1px solid ${tokens.colors.border}; }
    @media print {
      body { padding: 20mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    <p style="margin:0;color:${tokens.colors.muted}">Generated: ${new Date().toISOString()}</p>
  </div>
  ${sectionsHtml}
  <div class="footer">
    <p style="margin:0">© 2026 UUIDNA QPU. All rights reserved.</p>
  </div>
</body>
</html>
    `

    return {
      html,
      metadata: {
        tool: 'report',
        action: 'render',
        version: '1.0.0',
        timestamp: new Date()
      }
    }
  }

  processRequest(request: MCPUIRequest): MCPUIResponse {
    if (request.theme) {
      designSystem.setTheme(request.theme)
    }

    switch (request.action) {
      case 'dashboard':
        return this.renderDashboard(request.params as unknown as DashboardConfig)
      case 'form':
        return this.renderForm(
          request.params.title as string,
          request.params.fields as unknown[]
        )
      case 'report':
        return this.renderReport(
          request.params.title as string,
          request.params.sections as Array<{ heading: string; content: string }>
        )
      default:
        return {
          html: '<p>Unknown action</p>',
          metadata: {
            tool: request.tool,
            action: request.action,
            version: '1.0.0',
            timestamp: new Date()
          }
        }
    }
  }
}

export const mcpUIAdapter = new MCPUIAdapter()
