// Request/Response Transformation Middleware
// Handles content negotiation and data transformation

export interface TransformOptions {
  input_format: 'json' | 'xml' | 'form' | 'query'
  output_format: 'json' | 'xml' | 'csv' | 'yaml'
  compress?: boolean
  prettify?: boolean
}

export class RequestTransformer {
  // Parse request based on content type
  static parseRequest(
    body: string | Buffer,
    contentType: string
  ): any {
    const type = contentType.split(';')[0].trim().toLowerCase()

    switch (type) {
      case 'application/json':
        return JSON.parse(body.toString())

      case 'application/x-www-form-urlencoded':
        return RequestTransformer.parseFormData(body.toString())

      case 'application/xml':
      case 'text/xml':
        return RequestTransformer.parseXML(body.toString())

      case 'text/plain':
        return { data: body.toString() }

      default:
        return JSON.parse(body.toString())
    }
  }

  // Parse form data
  private static parseFormData(data: string): Record<string, any> {
    const result: Record<string, any> = {}
    const pairs = data.split('&')

    for (const pair of pairs) {
      const [key, value] = pair.split('=')
      result[decodeURIComponent(key)] = decodeURIComponent(value || '')
    }

    return result
  }

  // Parse XML (simplified)
  private static parseXML(xml: string): Record<string, any> {
    // Simplified XML parser - in production would use proper XML library
    const result: Record<string, any> = {}

    const tagRegex = /<(\w+)>([^<]*)<\/\1>/g
    let match

    while ((match = tagRegex.exec(xml)) !== null) {
      const [, tag, value] = match
      result[tag] = value
    }

    return result
  }
}

export class ResponseTransformer {
  // Transform response data to requested format
  static transformResponse(
    data: any,
    format: 'json' | 'xml' | 'csv' | 'yaml',
    options?: {
      prettify?: boolean
      compress?: boolean
    }
  ): string {
    let result: string

    switch (format) {
      case 'json':
        result = options?.prettify
          ? JSON.stringify(data, null, 2)
          : JSON.stringify(data)
        break

      case 'xml':
        result = ResponseTransformer.toXML(data)
        break

      case 'csv':
        result = ResponseTransformer.toCSV(data)
        break

      case 'yaml':
        result = ResponseTransformer.toYAML(data)
        break

      default:
        result = JSON.stringify(data)
    }

    if (options?.compress && result.length > 1024) {
      // In production would actually compress with gzip
      return result
    }

    return result
  }

  // Convert to XML
  private static toXML(data: any, root: string = 'root'): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${root}>`

    if (Array.isArray(data)) {
      for (const item of data) {
        xml += `<item>${ResponseTransformer.valueToXML(item)}</item>`
      }
    } else if (typeof data === 'object') {
      for (const [key, value] of Object.entries(data)) {
        xml += `<${key}>${ResponseTransformer.valueToXML(value)}</${key}>`
      }
    } else {
      xml += ResponseTransformer.valueToXML(data)
    }

    xml += `</${root}>`
    return xml
  }

  // Convert value to XML
  private static valueToXML(value: any): string {
    if (value === null || value === undefined) {
      return ''
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map(v => `<item>${ResponseTransformer.valueToXML(v)}</item>`).join('')
      } else {
        let xml = ''
        for (const [k, v] of Object.entries(value)) {
          xml += `<${k}>${ResponseTransformer.valueToXML(v)}</${k}>`
        }
        return xml
      }
    }

    return String(value).replace(/[<>&'"]/g, char => {
      const map: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;'
      }
      return map[char] || char
    })
  }

  // Convert to CSV
  private static toCSV(data: any): string {
    if (!Array.isArray(data)) {
      data = [data]
    }

    if (data.length === 0) {
      return ''
    }

    // Get headers from first object
    const first = data[0]
    if (typeof first !== 'object') {
      return data.map(d => String(d)).join('\n')
    }

    const headers = Object.keys(first)
    let csv = headers.map(h => `"${h}"`).join(',') + '\n'

    for (const row of data) {
      const values = headers.map(h => {
        const value = row[h]
        if (value === null || value === undefined) {
          return ''
        }
        const str = String(value)
        return `"${str.replace(/"/g, '""')}"`
      })
      csv += values.join(',') + '\n'
    }

    return csv
  }

  // Convert to YAML
  private static toYAML(data: any, indent: number = 0): string {
    const spaces = ' '.repeat(indent)
    let yaml = ''

    if (Array.isArray(data)) {
      for (const item of data) {
        yaml += `${spaces}- ${ResponseTransformer.toYAML(item, indent + 2).trim()}\n`
      }
    } else if (typeof data === 'object' && data !== null) {
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object' && value !== null) {
          yaml += `${spaces}${key}:\n${ResponseTransformer.toYAML(value, indent + 2)}`
        } else {
          yaml += `${spaces}${key}: ${JSON.stringify(value)}\n`
        }
      }
    } else {
      yaml += `${String(data)}\n`
    }

    return yaml
  }
}

// Content negotiation
export class ContentNegotiation {
  // Parse accept header and determine best format
  static negotiate(acceptHeader: string, available: string[]): string | null {
    if (!acceptHeader) {
      return available[0] || 'application/json'
    }

    const preferences = acceptHeader
      .split(',')
      .map(type => {
        const [mime, q] = type.split(';')
        const quality = q?.includes('q=') ? parseFloat(q.split('=')[1]) : 1.0
        return { mime: mime.trim(), quality }
      })
      .sort((a, b) => b.quality - a.quality)

    for (const pref of preferences) {
      if (available.includes(pref.mime)) {
        return pref.mime
      }

      // Check for wildcard matches
      const parts = pref.mime.split('/')
      if (parts[1] === '*') {
        const typePrefix = parts[0]
        const match = available.find(a => a.startsWith(typePrefix))
        if (match) {
          return match
        }
      }
    }

    return available[0] || 'application/json'
  }

  // Get content type from format
  static getContentType(format: string): string {
    const map: Record<string, string> = {
      'json': 'application/json',
      'xml': 'application/xml',
      'csv': 'text/csv',
      'yaml': 'text/yaml',
      'html': 'text/html',
      'text': 'text/plain'
    }

    return map[format] || 'application/json'
  }

  // Get format from content type
  static getFormat(contentType: string): string {
    const type = contentType.split(';')[0].trim().toLowerCase()
    const map: Record<string, string> = {
      'application/json': 'json',
      'application/xml': 'xml',
      'text/xml': 'xml',
      'text/csv': 'csv',
      'text/yaml': 'yaml',
      'text/html': 'html',
      'text/plain': 'text'
    }

    return map[type] || 'json'
  }
}

// Data filtering and projection
export class DataProjection {
  // Project data based on field selection
  static project(data: any, fields?: string[]): any {
    if (!fields || fields.length === 0) {
      return data
    }

    if (Array.isArray(data)) {
      return data.map(item => DataProjection.projectObject(item, fields))
    }

    return DataProjection.projectObject(data, fields)
  }

  // Project single object
  private static projectObject(obj: any, fields: string[]): any {
    const result: Record<string, any> = {}

    for (const field of fields) {
      if (field.includes('.')) {
        // Nested field
        const parts = field.split('.')
        let value = obj
        for (const part of parts) {
          value = value?.[part]
        }
        result[field.replace(/\./g, '_')] = value
      } else {
        result[field] = obj[field]
      }
    }

    return result
  }

  // Filter data based on predicates
  static filter(data: any[], predicates: Record<string, any>): any[] {
    return data.filter(item => {
      for (const [key, value] of Object.entries(predicates)) {
        if (item[key] !== value) {
          return false
        }
      }
      return true
    })
  }
}
