// GraphQL Handler for API Gateway
// Provides GraphQL query and mutation interface to MCP compositions

import type { CompositionRequest, CompositionEngine } from '../mcp-composition/composition-engine.js'

export interface GraphQLQuery {
  query: string
  variables?: Record<string, any>
  operationName?: string
}

export interface GraphQLResponse {
  data?: any
  errors?: Array<{ message: string; extensions?: any }>
}

export interface GraphQLType {
  name: string
  kind: 'SCALAR' | 'OBJECT' | 'INTERFACE' | 'UNION' | 'ENUM' | 'INPUT_OBJECT'
  fields?: Record<string, GraphQLField>
  enumValues?: string[]
  description?: string
}

export interface GraphQLField {
  name: string
  type: string
  description?: string
  args?: Record<string, GraphQLArg>
}

export interface GraphQLArg {
  name: string
  type: string
  description?: string
  defaultValue?: any
}

export class GraphQLHandler {
  private compositionEngine: CompositionEngine
  private schema: Map<string, GraphQLType> = new Map()
  private resolvers: Map<string, Function> = new Map()

  constructor(compositionEngine: CompositionEngine) {
    this.compositionEngine = compositionEngine
  }

  async initialize(): Promise<void> {
    // Build GraphQL schema from capabilities
    const capabilities = await this.compositionEngine.listCapabilities()

    // Create scalar types
    this.schema.set('String', { name: 'String', kind: 'SCALAR' })
    this.schema.set('Int', { name: 'Int', kind: 'SCALAR' })
    this.schema.set('Float', { name: 'Float', kind: 'SCALAR' })
    this.schema.set('Boolean', { name: 'Boolean', kind: 'SCALAR' })
    this.schema.set('JSON', { name: 'JSON', kind: 'SCALAR' })

    // Group capabilities by MCP
    const mcpGroups = new Map<string, any[]>()
    for (const cap of capabilities) {
      if (!mcpGroups.has(cap.mcp)) {
        mcpGroups.set(cap.mcp, [])
      }
      mcpGroups.get(cap.mcp)!.push(cap)
    }

    // Create Query root type with fields for each MCP
    const queryFields: Record<string, GraphQLField> = {}
    const mutationFields: Record<string, GraphQLField> = {}

    for (const [mcp, caps] of mcpGroups.entries()) {
      // Create type for MCP
      const mcpFields: Record<string, GraphQLField> = {}

      for (const cap of caps) {
        mcpFields[cap.tool] = {
          name: cap.tool,
          type: 'JSON',
          description: cap.description,
          args: {
            params: { name: 'params', type: 'JSON', description: 'Operation parameters' }
          }
        }

        // Register resolver
        this.resolvers.set(`${mcp}.${cap.tool}`, async (args: any) => {
          return this.resolveOperation(mcp, cap.tool, args)
        })
      }

      // Create MCP type
      this.schema.set(mcp, {
        name: mcp,
        kind: 'OBJECT',
        fields: mcpFields,
        description: `Operations for ${mcp} MCP`
      })

      // Add to query
      queryFields[mcp] = {
        name: mcp,
        type: mcp,
        description: `Access ${mcp} MCP operations`
      }
    }

    // Create Query type
    this.schema.set('Query', {
      name: 'Query',
      kind: 'OBJECT',
      fields: queryFields,
      description: 'Root query type'
    })

    // Create Mutation type (same operations but marked as mutations)
    for (const [mcp, caps] of mcpGroups.entries()) {
      const isWriteOperation = (tool: string) => {
        const t = tool.toLowerCase()
        return t.includes('create') || t.includes('update') || t.includes('delete') ||
               t.includes('write') || t.includes('save') || t.includes('modify')
      }

      for (const cap of caps) {
        if (isWriteOperation(cap.tool)) {
          if (!mutationFields[mcp]) {
            mutationFields[mcp] = {
              name: mcp,
              type: mcp,
              description: `Mutate via ${mcp} MCP`
            }
          }
        }
      }
    }

    this.schema.set('Mutation', {
      name: 'Mutation',
      kind: 'OBJECT',
      fields: mutationFields,
      description: 'Root mutation type'
    })

    console.log(`GraphQL Handler: generated schema with ${this.schema.size} types`)
  }

  // Handle GraphQL request
  async handleRequest(req: GraphQLQuery): Promise<GraphQLResponse> {
    try {
      // Parse query
      const { query, variables, operationName } = req

      // Execute query
      const result = await this.executeQuery(query, variables, operationName)

      return result
    } catch (error) {
      return {
        errors: [
          {
            message: (error as Error).message,
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
          }
        ]
      }
    }
  }

  // Execute GraphQL query
  private async executeQuery(query: string, variables?: Record<string, any>, operationName?: string): Promise<GraphQLResponse> {
    // Simple GraphQL query parser and executor
    const parsed = this.parseQuery(query)

    if (!parsed) {
      return {
        errors: [{ message: 'Invalid GraphQL query' }]
      }
    }

    try {
      const data = await this.executeSelection(parsed.selections, variables)
      return { data }
    } catch (error) {
      return {
        errors: [{ message: (error as Error).message }]
      }
    }
  }

  // Parse GraphQL query (simplified parser)
  private parseQuery(query: string): any {
    // Extract query selections (simplified)
    const queryMatch = query.match(/query\s*{([^}]+)}/s) || query.match(/{([^}]+)}/s)

    if (!queryMatch) {
      return null
    }

    const selections: Record<string, any> = {}
    const content = queryMatch[1]
    const fieldMatches = content.match(/(\w+)\s*{([^}]*)}/g) || []

    for (const fieldMatch of fieldMatches) {
      const [, name, subFields] = fieldMatch.match(/(\w+)\s*{([^}]*)}/)!
      selections[name] = {
        name,
        subFields: subFields.split('\n').map(f => f.trim()).filter(Boolean)
      }
    }

    return { selections }
  }

  // Execute selection set
  private async executeSelection(selections: Record<string, any>, variables?: any): Promise<any> {
    const result: Record<string, any> = {}

    for (const [fieldName, fieldInfo] of Object.entries(selections)) {
      if (typeof fieldInfo === 'object' && fieldInfo.name) {
        // Query field
        result[fieldName] = await this.resolveField(fieldInfo.name, variables)
      }
    }

    return result
  }

  // Resolve a field
  private async resolveField(fieldName: string, variables?: any): Promise<any> {
    // Get resolver
    const resolver = this.resolvers.get(fieldName)

    if (resolver) {
      return resolver(variables)
    }

    // Return empty object for non-leaf types
    return {}
  }

  // Resolve an operation
  private async resolveOperation(mcp: string, operation: string, args: any): Promise<any> {
    const compositionRequest: CompositionRequest = {
      steps: [
        {
          id: operation,
          mcp,
          operation,
          params: args.params || args
        }
      ]
    }

    const result = await this.compositionEngine.execute(compositionRequest)

    if (!result.success) {
      throw new Error(result.errors.join(', '))
    }

    // Extract data
    const [data] = result.steps.values()
    return data
  }

  // Get GraphQL schema as string
  getSchema(): string {
    let schema = ''

    // Add scalar types
    schema += 'scalar JSON\n\n'

    // Add object types
    for (const [name, type] of this.schema.entries()) {
      if (name === 'Query' || name === 'Mutation') {
        // Skip - will add at end
        continue
      }

      if (type.kind === 'OBJECT') {
        schema += `type ${name} {\n`
        if (type.fields) {
          for (const [fieldName, field] of Object.entries(type.fields)) {
            const argStr = field.args
              ? `(${Object.values(field.args)
                  .map((a: any) => `${a.name}: ${a.type}`)
                  .join(', ')})`
              : ''
            schema += `  ${fieldName}${argStr}: ${field.type}\n`
          }
        }
        schema += '}\n\n'
      }
    }

    // Add Query type
    const queryType = this.schema.get('Query')
    if (queryType?.fields) {
      schema += 'type Query {\n'
      for (const [fieldName, field] of Object.entries(queryType.fields)) {
        schema += `  ${fieldName}: ${field.type}\n`
      }
      schema += '}\n\n'
    }

    // Add Mutation type
    const mutationType = this.schema.get('Mutation')
    if (mutationType?.fields && Object.keys(mutationType.fields).length > 0) {
      schema += 'type Mutation {\n'
      for (const [fieldName, field] of Object.entries(mutationType.fields)) {
        schema += `  ${fieldName}: ${field.type}\n`
      }
      schema += '}\n'
    }

    return schema
  }

  // Get introspection query response
  getIntrospection(): any {
    const types = Array.from(this.schema.values()).map(type => ({
      name: type.name,
      kind: type.kind,
      description: type.description,
      fields: type.fields
        ? Object.entries(type.fields).map(([name, field]: [string, any]) => ({
            name: field.name,
            type: field.type,
            description: field.description
          }))
        : undefined
    }))

    return {
      __schema: {
        types,
        queryType: { name: 'Query' },
        mutationType: { name: 'Mutation' }
      }
    }
  }
}
