/**
 * shadcn/ui Design System - Standard UI for all QPU enterprise applications
 */

export type Theme = 'light' | 'dark' | 'system'
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl'

export interface DesignTokens {
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    muted: string
    accent: string
    destructive: string
    border: string
  }
  typography: {
    fontFamily: string
    fontSize: Record<string, string>
    fontWeight: Record<string, number>
    lineHeight: Record<string, number>
  }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
}

export interface ComponentConfig {
  variant: ComponentVariant
  size: ComponentSize
  disabled?: boolean
  loading?: boolean
  className?: string
}

export const lightTheme: DesignTokens = {
  colors: {
    background: '#ffffff',
    foreground: '#09090b',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    muted: '#f4f4f5',
    accent: '#ec4899',
    destructive: '#ef4444',
    border: '#e4e4e7'
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }
}

export const darkTheme: DesignTokens = {
  colors: {
    background: '#09090b',
    foreground: '#fafafa',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    muted: '#27272a',
    accent: '#ec4899',
    destructive: '#ef4444',
    border: '#27272a'
  },
  typography: lightTheme.typography,
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
  }
}

export class DesignSystem {
  private currentTheme: Theme = 'light'
  private tokens: DesignTokens = lightTheme

  setTheme(theme: Theme): void {
    this.currentTheme = theme
    this.tokens = theme === 'dark' ? darkTheme : lightTheme
  }

  getTokens(): DesignTokens {
    return this.tokens
  }

  getTheme(): Theme {
    return this.currentTheme
  }

  getCSSVariables(): Record<string, string> {
    const vars: Record<string, string> = {}

    // Colors
    Object.entries(this.tokens.colors).forEach(([key, value]) => {
      vars[`--color-${key}`] = value
    })

    // Typography
    Object.entries(this.tokens.typography.fontSize).forEach(([key, value]) => {
      vars[`--font-size-${key}`] = value
    })

    // Spacing
    Object.entries(this.tokens.spacing).forEach(([key, value]) => {
      vars[`--spacing-${key}`] = value
    })

    // Border radius
    Object.entries(this.tokens.borderRadius).forEach(([key, value]) => {
      vars[`--radius-${key}`] = value
    })

    // Shadows
    Object.entries(this.tokens.shadows).forEach(([key, value]) => {
      vars[`--shadow-${key}`] = value
    })

    return vars
  }

  getComponentStyles(variant: ComponentVariant, size: ComponentSize): Record<string, string> {
    const baseStyles: Record<string, string> = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: this.tokens.typography.fontFamily,
      borderRadius: this.tokens.borderRadius.md,
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer',
      border: `1px solid ${this.tokens.colors.border}`
    }

    // Variant styles
    const variantStyles: Record<ComponentVariant, Record<string, string>> = {
      default: {
        backgroundColor: this.tokens.colors.muted,
        color: this.tokens.colors.foreground
      },
      primary: {
        backgroundColor: this.tokens.colors.primary,
        color: '#ffffff'
      },
      secondary: {
        backgroundColor: this.tokens.colors.secondary,
        color: '#ffffff'
      },
      destructive: {
        backgroundColor: this.tokens.colors.destructive,
        color: '#ffffff'
      },
      outline: {
        backgroundColor: 'transparent',
        color: this.tokens.colors.foreground,
        borderColor: this.tokens.colors.border
      },
      ghost: {
        backgroundColor: 'transparent',
        color: this.tokens.colors.foreground,
        border: 'none'
      }
    }

    // Size styles
    const sizeStyles: Record<ComponentSize, Record<string, string>> = {
      sm: {
        padding: `${this.tokens.spacing.sm} ${this.tokens.spacing.md}`,
        fontSize: this.tokens.typography.fontSize.sm,
        height: '32px'
      },
      md: {
        padding: `${this.tokens.spacing.md} ${this.tokens.spacing.lg}`,
        fontSize: this.tokens.typography.fontSize.base,
        height: '40px'
      },
      lg: {
        padding: `${this.tokens.spacing.lg} ${this.tokens.spacing.xl}`,
        fontSize: this.tokens.typography.fontSize.lg,
        height: '48px'
      },
      xl: {
        padding: `${this.tokens.spacing.xl} ${this.tokens.spacing['2xl']}`,
        fontSize: this.tokens.typography.fontSize.xl,
        height: '56px'
      }
    }

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size]
    }
  }
}

export const designSystem = new DesignSystem()
