/**
 * shadcn/ui Components - Standard component library for QPU applications
 */

import { designSystem, ComponentConfig, ComponentVariant, ComponentSize } from './design-system.js'

export interface ButtonProps extends Partial<ComponentConfig> {
  text: string
  onClick?: () => void
  icon?: string
  fullWidth?: boolean
  variant?: ComponentVariant
  size?: ComponentSize
  disabled?: boolean
}

export interface CardProps {
  title?: string
  description?: string
  content: string
  footer?: string
  className?: string
}

export interface TableProps {
  columns: Array<{ key: string; label: string; sortable?: boolean }>
  rows: Array<Record<string, unknown>>
  onSort?: (column: string) => void
  onRowClick?: (row: Record<string, unknown>) => void
}

export interface FormProps {
  fields: FormField[]
  onSubmit: (data: Record<string, unknown>) => void
  submitLabel?: string
  resetLabel?: string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select'
  required?: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  validation?: (value: unknown) => string | null
}

export interface AlertProps {
  variant: 'default' | 'destructive' | 'success' | 'warning'
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export interface BadgeProps {
  variant: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning'
  text: string
  size?: 'sm' | 'md' | 'lg'
}

export interface ProgressProps {
  value: number // 0-100
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  showLabel?: boolean
}

export interface ToastProps {
  title: string
  description?: string
  variant: 'default' | 'success' | 'destructive' | 'warning'
  action?: { label: string; onClick: () => void }
  duration?: number // ms
}

export class ShadcnComponents {
  // Button Component
  static Button(props: ButtonProps): string {
    const styles = designSystem.getComponentStyles(
      props.variant || 'default',
      props.size || 'md'
    )

    const buttonStyles = {
      ...styles,
      width: props.fullWidth ? '100%' : 'auto',
      opacity: props.disabled ? 0.5 : 1,
      cursor: props.disabled ? 'not-allowed' : 'pointer'
    }

    return `<button style="${Object.entries(buttonStyles)
      .map(([k, v]) => `${k}:${v}`)
      .join(';')}" ${props.disabled ? 'disabled' : ''}>${props.icon ? `<i>${props.icon}</i> ` : ''}${props.text}</button>`
  }

  // Card Component
  static Card(props: CardProps): string {
    const tokens = designSystem.getTokens()
    return `
<div style="background-color:${tokens.colors.background};border:1px solid ${tokens.colors.border};border-radius:${tokens.borderRadius.lg};padding:${tokens.spacing.lg};${props.className || ''}">
  ${props.title ? `<h3 style="margin:0 0 ${tokens.spacing.md} 0;font-weight:${tokens.typography.fontWeight.semibold}">${props.title}</h3>` : ''}
  ${props.description ? `<p style="margin:0 0 ${tokens.spacing.md} 0;color:${tokens.colors.muted}">${props.description}</p>` : ''}
  <div>${props.content}</div>
  ${props.footer ? `<div style="margin-top:${tokens.spacing.lg};padding-top:${tokens.spacing.lg};border-top:1px solid ${tokens.colors.border}">${props.footer}</div>` : ''}
</div>
    `
  }

  // Table Component
  static Table(props: TableProps): string {
    const tokens = designSystem.getTokens()
    const headerRow = props.columns
      .map(
        col =>
          `<th style="padding:${tokens.spacing.md};text-align:left;font-weight:${tokens.typography.fontWeight.semibold};border-bottom:1px solid ${tokens.colors.border}">${col.label}${col.sortable ? ' ▼' : ''}</th>`
      )
      .join('')

    const rows = props.rows
      .map(
        row =>
          `<tr style="border-bottom:1px solid ${tokens.colors.border}">
      ${props.columns.map(col => `<td style="padding:${tokens.spacing.md}">${row[col.key]}</td>`).join('')}
    </tr>`
      )
      .join('')

    return `
<table style="width:100%;border-collapse:collapse">
  <thead>
    <tr>${headerRow}</tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
    `
  }

  // Form Component
  static Form(props: FormProps): string {
    const tokens = designSystem.getTokens()
    const fields = props.fields
      .map(
        field => `
<div style="margin-bottom:${tokens.spacing.lg}">
  <label style="display:block;margin-bottom:${tokens.spacing.sm};font-weight:${tokens.typography.fontWeight.medium}">${field.label}${field.required ? ' *' : ''}</label>
  ${
    field.type === 'textarea'
      ? `<textarea name="${field.name}" placeholder="${field.placeholder || ''}" style="width:100%;padding:${tokens.spacing.md};border:1px solid ${tokens.colors.border};border-radius:${tokens.borderRadius.md}" ${field.required ? 'required' : ''}></textarea>`
      : field.type === 'select'
        ? `<select name="${field.name}" style="width:100%;padding:${tokens.spacing.md};border:1px solid ${tokens.colors.border};border-radius:${tokens.borderRadius.md}" ${field.required ? 'required' : ''}>
      <option value="">Select ${field.label}</option>
      ${field.options?.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('') || ''}
    </select>`
        : `<input type="${field.type}" name="${field.name}" placeholder="${field.placeholder || ''}" style="width:100%;padding:${tokens.spacing.md};border:1px solid ${tokens.colors.border};border-radius:${tokens.borderRadius.md}" ${field.required ? 'required' : ''} />`
  }
</div>
      `
      )
      .join('')

    return `
<form style="display:flex;flex-direction:column">
  ${fields}
  <div style="display:flex;gap:${tokens.spacing.md}">
    <button type="submit" style="flex:1;padding:${tokens.spacing.md};background-color:${tokens.colors.primary};color:#fff;border:none;border-radius:${tokens.borderRadius.md};cursor:pointer">${props.submitLabel || 'Submit'}</button>
    <button type="reset" style="flex:1;padding:${tokens.spacing.md};background-color:${tokens.colors.muted};color:${tokens.colors.foreground};border:none;border-radius:${tokens.borderRadius.md};cursor:pointer">${props.resetLabel || 'Reset'}</button>
  </div>
</form>
    `
  }

  // Alert Component
  static Alert(props: AlertProps): string {
    const tokens = designSystem.getTokens()
    const variantColors: Record<string, { bg: string; border: string; text: string }> = {
      default: { bg: tokens.colors.muted, border: tokens.colors.border, text: tokens.colors.foreground },
      destructive: { bg: '#fee2e2', border: '#fecaca', text: '#991b1b' },
      success: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
      warning: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' }
    }

    const colors = variantColors[props.variant] || variantColors.default

    return `
<div style="background-color:${colors.bg};border:1px solid ${colors.border};border-radius:${tokens.borderRadius.md};padding:${tokens.spacing.lg};color:${colors.text}">
  <h4 style="margin:0 0 ${tokens.spacing.sm} 0">${props.title}</h4>
  ${props.description ? `<p style="margin:0 0 ${tokens.spacing.md} 0">${props.description}</p>` : ''}
  ${props.action ? `<button style="background:${colors.text};color:${colors.bg};border:none;border-radius:${tokens.borderRadius.md};padding:${tokens.spacing.sm} ${tokens.spacing.md};cursor:pointer">${props.action.label}</button>` : ''}
</div>
    `
  }

  // Badge Component
  static Badge(props: BadgeProps): string {
    const tokens = designSystem.getTokens()
    const variantColors: Record<string, { bg: string; text: string }> = {
      default: { bg: tokens.colors.muted, text: tokens.colors.foreground },
      primary: { bg: tokens.colors.primary, text: '#fff' },
      secondary: { bg: tokens.colors.secondary, text: '#fff' },
      destructive: { bg: tokens.colors.destructive, text: '#fff' },
      success: { bg: '#10b981', text: '#fff' },
      warning: { bg: '#f59e0b', text: '#fff' }
    }

    const colors = variantColors[props.variant] || variantColors.default
    const size = props.size || 'md'
    const sizeStyles = {
      sm: { padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`, fontSize: tokens.typography.fontSize.xs },
      md: { padding: `${tokens.spacing.sm} ${tokens.spacing.md}`, fontSize: tokens.typography.fontSize.sm },
      lg: { padding: `${tokens.spacing.md} ${tokens.spacing.lg}`, fontSize: tokens.typography.fontSize.base }
    }

    const style = sizeStyles[size as keyof typeof sizeStyles]

    return `<span style="display:inline-block;background-color:${colors.bg};color:${colors.text};padding:${style.padding};border-radius:${tokens.borderRadius.full};font-size:${style.fontSize};font-weight:${tokens.typography.fontWeight.semibold}">${props.text}</span>`
  }

  // Progress Component
  static Progress(props: ProgressProps): string {
    const tokens = designSystem.getTokens()
    const variantColors: Record<string, string> = {
      default: tokens.colors.primary,
      success: '#10b981',
      warning: '#f59e0b',
      destructive: tokens.colors.destructive
    }

    const color = variantColors[props.variant || 'default']
    const percent = Math.min(props.value, props.max || 100)

    return `
<div style="width:100%;background-color:${tokens.colors.muted};border-radius:${tokens.borderRadius.full};overflow:hidden;height:8px">
  <div style="width:${percent}%;height:100%;background-color:${color};transition:width 0.3s ease" />
</div>
${props.showLabel ? `<p style="margin-top:${tokens.spacing.sm};font-size:${tokens.typography.fontSize.sm};text-align:center">${percent}%</p>` : ''}
    `
  }

  // Toast Component
  static Toast(props: ToastProps): string {
    const tokens = designSystem.getTokens()
    const variantColors: Record<string, { bg: string; border: string; text: string }> = {
      default: { bg: tokens.colors.muted, border: tokens.colors.border, text: tokens.colors.foreground },
      success: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
      destructive: { bg: '#fee2e2', border: '#fecaca', text: '#991b1b' },
      warning: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' }
    }

    const colors = variantColors[props.variant]

    return `
<div style="background-color:${colors.bg};border:2px solid ${colors.border};border-radius:${tokens.borderRadius.md};padding:${tokens.spacing.lg};color:${colors.text};box-shadow:${tokens.shadows.lg}">
  <h4 style="margin:0 0 ${tokens.spacing.sm} 0">${props.title}</h4>
  ${props.description ? `<p style="margin:0 0 ${tokens.spacing.md} 0;font-size:${tokens.typography.fontSize.sm}">${props.description}</p>` : ''}
  ${props.action ? `<button style="background:${colors.text};color:${colors.bg};border:none;border-radius:${tokens.borderRadius.md};padding:${tokens.spacing.sm} ${tokens.spacing.md};cursor:pointer;font-weight:${tokens.typography.fontWeight.semibold}">${props.action.label}</button>` : ''}
</div>
    `
  }
}

export const shadcnComponents = ShadcnComponents
