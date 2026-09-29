/**
 * API Client Generator
 * Auto-generates client libraries for different languages
 * Supports: TypeScript, JavaScript, Python, Go, Rust
 */

import { listOperations, getOperation, countByDomain } from '../core/index.js'
import { getOperationSchema } from './schema-validator.js'

// ============================================================================
// GENERATOR TYPES
// ============================================================================

export type TargetLanguage = 'typescript' | 'javascript' | 'python' | 'go' | 'rust'

export interface ClientGeneratorConfig {
  baseUrl?: string
  language: TargetLanguage
  packageName?: string
  version?: string
  includeTypes?: boolean
  includeExamples?: boolean
}

export interface GeneratedClient {
  language: TargetLanguage
  code: string
  examples: string
  types?: string
}

// ============================================================================
// API CLIENT GENERATOR
// ============================================================================

export class ApiClientGenerator {
  /**
   * Generate client for target language
   */
  generate(config: ClientGeneratorConfig): GeneratedClient {
    switch (config.language) {
      case 'typescript':
        return this.generateTypeScript(config)
      case 'javascript':
        return this.generateJavaScript(config)
      case 'python':
        return this.generatePython(config)
      case 'go':
        return this.generateGo(config)
      case 'rust':
        return this.generateRust(config)
      default:
        throw new Error(`Unsupported language: ${config.language}`)
    }
  }

  /**
   * Generate TypeScript client
   */
  private generateTypeScript(config: ClientGeneratorConfig): GeneratedClient {
    const baseUrl = config.baseUrl || 'http://localhost:3000'
    const packageName = config.packageName || '@uuidna/qpu-client'

    const code = `
/**
 * UUIDNA QPU Client - TypeScript
 * Auto-generated API client
 * Base URL: ${baseUrl}
 */

export interface ExecutionResult {
  success: boolean
  data?: Record<string, unknown>
  error?: string
}

export interface CompositionRequest {
  operations: string[]
  inputs?: Record<string, unknown>
}

export class QPUClient {
  private baseUrl: string

  constructor(baseUrl: string = '${baseUrl}') {
    this.baseUrl = baseUrl
  }

  /**
   * Execute a single operation
   */
  async execute(
    operation: string,
    inputs?: Record<string, unknown>
  ): Promise<ExecutionResult> {
    const response = await fetch(\`\${this.baseUrl}/execute\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, inputs })
    })
    return response.json()
  }

  /**
   * Execute a composition of operations
   */
  async compose(request: CompositionRequest): Promise<ExecutionResult> {
    const response = await fetch(\`\${this.baseUrl}/compose\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })
    return response.json()
  }

  /**
   * List all available operations
   */
  async listOperations() {
    const response = await fetch(\`\${this.baseUrl}/operations\`)
    return response.json()
  }

  /**
   * Health check
   */
  async health() {
    const response = await fetch(\`\${this.baseUrl}/health\`)
    return response.json()
  }

  /**
   * Get system metrics
   */
  async getMetrics() {
    const response = await fetch(\`\${this.baseUrl}/metrics\`)
    return response.json()
  }

  /**
   * Get UUID for operation
   */
  async getUUID(operation: string) {
    const response = await fetch(\`\${this.baseUrl}/uuid\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation })
    })
    return response.json()
  }

  /**
   * Get execution history
   */
  async getHistory() {
    const response = await fetch(\`\${this.baseUrl}/history\`)
    return response.json()
  }
}

export default QPUClient
`

    const examples = `
/**
 * Example Usage
 */

import QPUClient from './qpu-client'

const client = new QPUClient()

// Execute single operation
async function example1() {
  const result = await client.execute('health-check')
  console.log('Health:', result)
}

// Execute composition
async function example2() {
  const result = await client.compose({
    operations: ['health-check', 'get-metrics'],
    inputs: {}
  })
  console.log('Composition:', result)
}

// Get metrics
async function example3() {
  const metrics = await client.getMetrics()
  console.log('Metrics:', metrics)
}
`

    return {
      language: 'typescript',
      code,
      examples,
      types: this.generateTypeScriptTypes()
    }
  }

  /**
   * Generate JavaScript client
   */
  private generateJavaScript(config: ClientGeneratorConfig): GeneratedClient {
    const baseUrl = config.baseUrl || 'http://localhost:3000'

    const code = `
/**
 * UUIDNA QPU Client - JavaScript
 * Auto-generated API client
 */

class QPUClient {
  constructor(baseUrl = '${baseUrl}') {
    this.baseUrl = baseUrl
  }

  async execute(operation, inputs = {}) {
    const response = await fetch(\`\${this.baseUrl}/execute\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, inputs })
    })
    return response.json()
  }

  async compose(operations, inputs = {}) {
    const response = await fetch(\`\${this.baseUrl}/compose\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operations, inputs })
    })
    return response.json()
  }

  async listOperations() {
    const response = await fetch(\`\${this.baseUrl}/operations\`)
    return response.json()
  }

  async health() {
    const response = await fetch(\`\${this.baseUrl}/health\`)
    return response.json()
  }

  async getMetrics() {
    const response = await fetch(\`\${this.baseUrl}/metrics\`)
    return response.json()
  }
}

module.exports = QPUClient
`

    const examples = `
const QPUClient = require('./qpu-client')

const client = new QPUClient()

// Example 1: Health check
client.execute('health-check').then(result => {
  console.log('Health:', result)
})

// Example 2: Composition
client.compose(['health-check', 'get-metrics']).then(result => {
  console.log('Composition:', result)
})
`

    return {
      language: 'javascript',
      code,
      examples
    }
  }

  /**
   * Generate Python client
   */
  private generatePython(config: ClientGeneratorConfig): GeneratedClient {
    const baseUrl = config.baseUrl || 'http://localhost:3000'

    const code = `
"""
UUIDNA QPU Client - Python
Auto-generated API client
"""

import requests
from typing import Dict, Any, List

class QPUClient:
    def __init__(self, base_url: str = '${baseUrl}'):
        self.base_url = base_url

    def execute(
        self,
        operation: str,
        inputs: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Execute a single operation"""
        if inputs is None:
            inputs = {}

        response = requests.post(
            f'{self.base_url}/execute',
            json={'operation': operation, 'inputs': inputs}
        )
        return response.json()

    def compose(
        self,
        operations: List[str],
        inputs: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Execute a composition of operations"""
        if inputs is None:
            inputs = {}

        response = requests.post(
            f'{self.base_url}/compose',
            json={'operations': operations, 'inputs': inputs}
        )
        return response.json()

    def list_operations(self) -> Dict[str, Any]:
        """List all available operations"""
        response = requests.get(f'{self.base_url}/operations')
        return response.json()

    def health(self) -> Dict[str, Any]:
        """Health check"""
        response = requests.get(f'{self.base_url}/health')
        return response.json()

    def get_metrics(self) -> Dict[str, Any]:
        """Get system metrics"""
        response = requests.get(f'{self.base_url}/metrics')
        return response.json()
`

    const examples = `
from qpu_client import QPUClient

client = QPUClient()

# Example 1: Health check
result = client.execute('health-check')
print('Health:', result)

# Example 2: Composition
result = client.compose(['health-check', 'get-metrics'])
print('Composition:', result)

# Example 3: List operations
ops = client.list_operations()
print('Operations:', ops)
`

    return {
      language: 'python',
      code,
      examples
    }
  }

  /**
   * Generate Go client
   */
  private generateGo(config: ClientGeneratorConfig): GeneratedClient {
    const baseUrl = config.baseUrl || 'http://localhost:3000'

    const code = `
package qpu

import (
    "bytes"
    "encoding/json"
    "io/ioutil"
    "net/http"
)

type QPUClient struct {
    BaseURL string
}

type ExecutionResult struct {
    Success bool                   \`json:"success"\`
    Data    map[string]interface{} \`json:"data,omitempty"\`
    Error   string                 \`json:"error,omitempty"\`
}

type ExecutionRequest struct {
    Operation string                 \`json:"operation"\`
    Inputs    map[string]interface{} \`json:"inputs,omitempty"\`
}

func NewQPUClient() *QPUClient {
    return &QPUClient{BaseURL: "${baseUrl}"}
}

func (c *QPUClient) Execute(operation string, inputs map[string]interface{}) (*ExecutionResult, error) {
    req := ExecutionRequest{
        Operation: operation,
        Inputs:    inputs,
    }

    data, err := json.Marshal(req)
    if err != nil {
        return nil, err
    }

    resp, err := http.Post(
        c.BaseURL+"/execute",
        "application/json",
        bytes.NewBuffer(data),
    )
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var result ExecutionResult
    body, _ := ioutil.ReadAll(resp.Body)
    json.Unmarshal(body, &result)
    return &result, nil
}

func (c *QPUClient) Health() (*ExecutionResult, error) {
    resp, err := http.Get(c.BaseURL + "/health")
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var result ExecutionResult
    body, _ := ioutil.ReadAll(resp.Body)
    json.Unmarshal(body, &result)
    return &result, nil
}
`

    const examples = `
package main

import (
    "fmt"
    "qpu"
)

func main() {
    client := qpu.NewQPUClient()

    // Health check
    result, _ := client.Health()
    fmt.Println("Health:", result)

    // Execute operation
    result, _ = client.Execute("health-check", nil)
    fmt.Println("Execution:", result)
}
`

    return {
      language: 'go',
      code,
      examples
    }
  }

  /**
   * Generate Rust client
   */
  private generateRust(config: ClientGeneratorConfig): GeneratedClient {
    const baseUrl = config.baseUrl || 'http://localhost:3000'

    const code = `
use serde::{Deserialize, Serialize};
use reqwest::Client;

#[derive(Serialize, Deserialize, Debug)]
pub struct ExecutionResult {
    pub success: bool,
    pub data: Option<serde_json::Value>,
    pub error: Option<String>,
}

#[derive(Serialize)]
pub struct ExecutionRequest {
    pub operation: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub inputs: Option<serde_json::Value>,
}

pub struct QPUClient {
    base_url: String,
    client: Client,
}

impl QPUClient {
    pub fn new() -> Self {
        QPUClient {
            base_url: "${baseUrl}".to_string(),
            client: Client::new(),
        }
    }

    pub async fn execute(
        &self,
        operation: &str,
        inputs: Option<serde_json::Value>,
    ) -> Result<ExecutionResult, Box<dyn std::error::Error>> {
        let req = ExecutionRequest {
            operation: operation.to_string(),
            inputs,
        };

        let response = self
            .client
            .post(&format!("{}/execute", self.base_url))
            .json(&req)
            .send()
            .await?;

        let result = response.json::<ExecutionResult>().await?;
        Ok(result)
    }

    pub async fn health(&self) -> Result<ExecutionResult, Box<dyn std::error::Error>> {
        let response = self
            .client
            .get(&format!("{}/health", self.base_url))
            .send()
            .await?;

        let result = response.json::<ExecutionResult>().await?;
        Ok(result)
    }
}
`

    const examples = `
#[tokio::main]
async fn main() {
    let client = qpu::QPUClient::new();

    // Health check
    match client.health().await {
        Ok(result) => println!("Health: {:?}", result),
        Err(e) => println!("Error: {}", e),
    }

    // Execute operation
    match client.execute("health-check", None).await {
        Ok(result) => println!("Result: {:?}", result),
        Err(e) => println!("Error: {}", e),
    }
}
`

    return {
      language: 'rust',
      code,
      examples
    }
  }

  /**
   * Generate TypeScript type definitions
   */
  private generateTypeScriptTypes(): string {
    const operations = listOperations()
    const lines: string[] = ['// Auto-generated operation types\n']

    for (const op of operations) {
      const schema = getOperationSchema(op)
      if (schema && schema.inputs) {
        const typeName = this.toTypeScriptType(op)
        lines.push(`export type ${typeName}Inputs = {`)

        for (const [key, fieldSchema] of Object.entries(schema.inputs)) {
          const required = fieldSchema.required ? '' : '?'
          lines.push(`  ${key}${required}: ${this.schemaToTypeName(fieldSchema)};`)
        }

        lines.push('}')
        lines.push('')
      }
    }

    return lines.join('\n')
  }

  private schemaToTypeName(schema: any): string {
    switch (schema.type) {
      case 'string':
        return 'string'
      case 'number':
        return 'number'
      case 'boolean':
        return 'boolean'
      default:
        return 'unknown'
    }
  }

  private toTypeScriptType(operation: string): string {
    return operation
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

export const clientGenerator = new ApiClientGenerator()

/**
 * Generate client (global)
 */
export function generateClient(config: ClientGeneratorConfig): GeneratedClient {
  return clientGenerator.generate(config)
}

export default {
  ApiClientGenerator,
  clientGenerator,
  generateClient
}
