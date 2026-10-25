// WAVE 8F: SDK Generation - Auto-generate TypeScript, Python, Go SDKs

export interface APIEndpoint {
  method: string
  path: string
  description: string
  parameters: Record<string, { type: string; required: boolean; description: string }>
  request_body?: { type: string; properties: Record<string, any> }
  response: { type: string; properties: Record<string, any> }
}

export interface OpenAPISpec {
  openapi: string
  info: { title: string; version: string; description: string }
  servers: Array<{ url: string; description: string }>
  paths: Record<string, any>
  components: { schemas: Record<string, any> }
}

export class SDKGenerator {
  private api_spec: APIEndpoint[] = []

  constructor(endpoints: APIEndpoint[] = []) {
    this.api_spec = endpoints
  }

  // Generate TypeScript SDK
  generateTypeScriptSDK(): string {
    const imports = `import axios, { AxiosInstance } from 'axios'`
    const interfaces = this.generateTypeScriptInterfaces()
    const clientClass = this.generateTypeScriptClientClass()

    return `${imports}\n\n${interfaces}\n\n${clientClass}`
  }

  private generateTypeScriptInterfaces(): string {
    let code = ''

    for (const endpoint of this.api_spec) {
      // Request interface
      if (endpoint.request_body) {
        const name = this.toPascalCase(endpoint.path.split('/').pop() || 'request')
        code += `export interface ${name}Request {\n`
        for (const [key, prop] of Object.entries(endpoint.request_body.properties || {})) {
          code += `  ${key}${prop.required ? '' : '?'}: ${this.getTSType(prop.type)}\n`
        }
        code += `}\n\n`
      }

      // Response interface
      const responseName = this.toPascalCase(endpoint.path.split('/').pop() || 'response') + 'Response'
      code += `export interface ${responseName} {\n`
      for (const [key, prop] of Object.entries(endpoint.response.properties || {})) {
        code += `  ${key}: ${this.getTSType(prop.type)}\n`
      }
      code += `}\n\n`
    }

    return code
  }

  private generateTypeScriptClientClass(): string {
    let code = `export class Client {
  private client: AxiosInstance

  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      headers: { 'Authorization': \`Bearer \${apiKey}\` }
    })
  }\n\n`

    for (const endpoint of this.api_spec) {
      const methodName = this.toCamelCase(endpoint.method.toLowerCase() + '_' + endpoint.path)
      const responseType = this.toPascalCase(endpoint.path.split('/').pop() || 'response') + 'Response'

      code += `  async ${methodName}(${endpoint.request_body ? `data: any` : `params?: any`}): Promise<${responseType}> {
    const response = await this.client.${endpoint.method.toLowerCase()}('${endpoint.path}'${endpoint.request_body ? `, data` : ``})
    return response.data
  }\n\n`
    }

    code += `}`

    return code
  }

  // Generate Python SDK
  generatePythonSDK(): string {
    const imports = `import requests\nfrom typing import Optional, Dict, Any`
    const classes = this.generatePythonClasses()

    return `${imports}\n\n${classes}`
  }

  private generatePythonClasses(): string {
    let code = `class Client:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.headers = {'Authorization': f'Bearer {api_key}'}\n\n`

    for (const endpoint of this.api_spec) {
      const methodName = self.toCamelCase(endpoint.method.toLowerCase() + '_' + endpoint.path)

      code += `    def ${methodName}(self${endpoint.request_body ? `, data: Dict[str, Any] = None` : `, params: Dict[str, Any] = None`}) -> Dict[str, Any]:
        response = requests.${endpoint.method.toLowerCase()}(
            f'{self.base_url}${endpoint.path}',
            headers=self.headers${endpoint.request_body ? `,\n            json=data` : `,\n            params=params`}
        )
        return response.json()\n\n`
    }

    return code
  }

  // Generate Go SDK
  generateGoSDK(): string {
    const imports = `package sdk

import (
    "net/http"
    "encoding/json"
    "fmt"
)`
    const structs = this.generateGoStructs()
    const client = this.generateGoClient()

    return `${imports}\n\n${structs}\n\n${client}`
  }

  private generateGoStructs(): string {
    let code = ''

    for (const endpoint of this.api_spec) {
      // Request struct
      if (endpoint.request_body) {
        const name = this.toPascalCase(endpoint.path.split('/').pop() || 'request') + 'Request'
        code += `type ${name} struct {\n`
        for (const [key, prop] of Object.entries(endpoint.request_body.properties || {})) {
          const goType = this.getGoType(prop.type)
          code += `    ${this.toPascalCase(key)} ${goType} \`json:"${key}"\`\n`
        }
        code += `}\n\n`
      }

      // Response struct
      const responseName = this.toPascalCase(endpoint.path.split('/').pop() || 'response') + 'Response'
      code += `type ${responseName} struct {\n`
      for (const [key, prop] of Object.entries(endpoint.response.properties || {})) {
        const goType = this.getGoType(prop.type)
        code += `    ${this.toPascalCase(key)} ${goType} \`json:"${key}"\`\n`
      }
      code += `}\n\n`
    }

    return code
  }

  private generateGoClient(): string {
    let code = `type Client struct {
    BaseURL string
    APIKey  string
    HTTP    *http.Client
}

func NewClient(baseURL, apiKey string) *Client {
    return &Client{
        BaseURL: baseURL,
        APIKey:  apiKey,
        HTTP:    &http.Client{},
    }
}\n\n`

    for (const endpoint of this.api_spec) {
      const methodName = this.toPascalCase(endpoint.method.toLowerCase() + '_' + endpoint.path)
      const responseType = this.toPascalCase(endpoint.path.split('/').pop() || 'response') + 'Response'

      code += `func (c *Client) ${methodName}(${endpoint.request_body ? `data interface{}` : `params map[string]string`}) (*${responseType}, error) {
    // Implementation here
    return nil, nil
}\n\n`
    }

    return code
  }

  // Generate OpenAPI specification
  generateOpenAPISpec(): OpenAPISpec {
    const paths: Record<string, any> = {}

    for (const endpoint of this.api_spec) {
      if (!paths[endpoint.path]) {
        paths[endpoint.path] = {}
      }

      paths[endpoint.path][endpoint.method.toLowerCase()] = {
        description: endpoint.description,
        parameters: Object.entries(endpoint.parameters).map(([name, param]) => ({
          name,
          in: 'query',
          required: param.required,
          schema: { type: param.type },
          description: param.description
        })),
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: endpoint.response
              }
            }
          }
        }
      }
    }

    return {
      openapi: '3.1.0',
      info: { title: 'Auto-Generated API', version: '1.0.0', description: 'Generated from MCP compositions' },
      servers: [{ url: 'http://localhost:3000', description: 'Development' }],
      paths,
      components: { schemas: {} }
    }
  }

  // Helper methods
  private getTSType(type: string): string {
    const map: Record<string, string> = {
      'string': 'string', 'number': 'number', 'integer': 'number',
      'boolean': 'boolean', 'array': 'any[]', 'object': 'any'
    }
    return map[type] || 'any'
  }

  private getGoType(type: string): string {
    const map: Record<string, string> = {
      'string': 'string', 'number': 'float64', 'integer': 'int64',
      'boolean': 'bool', 'array': '[]interface{}', 'object': 'map[string]interface{}'
    }
    return map[type] || 'interface{}'
  }

  private toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
  }

  private toPascalCase(str: string): string {
    return str.split(/[-_]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
  }
}

export const sdkGenerator = new SDKGenerator()
