/**
 * LLM Connector - External LLM Integration
 * Supports OpenAI GPT, Anthropic Claude, with streaming and retry logic
 */

import { EventEmitter } from 'events'

export interface LLMConfig {
  provider: 'openai' | 'anthropic'
  apiKey: string
  model: string
  temperature?: number
  maxTokens?: number
  timeout?: number
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatCompletionOptions {
  stream?: boolean
  retryAttempts?: number
  retryDelayMs?: number
}

export interface ChatCompletionResponse {
  id: string
  model: string
  content: string
  stopReason: string
  tokenUsage: {
    prompt: number
    completion: number
    total: number
  }
}

export class LLMConnector extends EventEmitter {
  private config: LLMConfig
  private retryConfig = {
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000
  }

  constructor(config: LLMConfig) {
    super()
    this.config = {
      temperature: 0.7,
      maxTokens: 2048,
      timeout: 30000,
      ...config
    }
  }

  /**
   * Send chat completion request with retry logic
   */
  async chatCompletion(
    messages: ChatMessage[],
    opts: ChatCompletionOptions = {}
  ): Promise<ChatCompletionResponse> {
    const attempts = opts.retryAttempts ?? this.retryConfig.maxAttempts
    const retryDelay = opts.retryDelayMs ?? this.retryConfig.baseDelayMs

    let lastError: Error | null = null

    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        if (this.config.provider === 'openai') {
          return await this.openaiChatCompletion(messages, opts)
        } else if (this.config.provider === 'anthropic') {
          return await this.anthropicChatCompletion(messages, opts)
        }
        throw new Error(`Unknown provider: ${this.config.provider}`)
      } catch (e) {
        lastError = e as Error
        if (attempt < attempts - 1) {
          const delay = Math.min(
            retryDelay * Math.pow(2, attempt),
            this.retryConfig.maxDelayMs
          )
          await new Promise(r => setTimeout(r, delay))
        }
      }
    }

    throw lastError || new Error('Chat completion failed after max attempts')
  }

  /**
   * Stream chat completion from external LLM
   */
  async *streamChatCompletion(
    messages: ChatMessage[]
  ): AsyncGenerator<string, void, unknown> {
    if (this.config.provider === 'openai') {
      yield* this.streamOpenaiChatCompletion(messages)
    } else if (this.config.provider === 'anthropic') {
      yield* this.streamAnthropicChatCompletion(messages)
    } else {
      throw new Error(`Unknown provider: ${this.config.provider}`)
    }
  }

  /**
   * OpenAI GPT chat completion
   */
  private async openaiChatCompletion(
    messages: ChatMessage[],
    opts: ChatCompletionOptions
  ): Promise<ChatCompletionResponse> {
    const endpoint = 'https://api.openai.com/v1/chat/completions'
    const body = {
      model: this.config.model,
      messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      stream: opts.stream ?? false
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.config.timeout || 30000)
    })

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json() as any
    return {
      id: data.id,
      model: data.model,
      content: data.choices[0]?.message?.content || '',
      stopReason: data.choices[0]?.finish_reason || 'unknown',
      tokenUsage: {
        prompt: data.usage?.prompt_tokens || 0,
        completion: data.usage?.completion_tokens || 0,
        total: data.usage?.total_tokens || 0
      }
    }
  }

  /**
   * Stream OpenAI GPT chat completion
   */
  private async *streamOpenaiChatCompletion(
    messages: ChatMessage[]
  ): AsyncGenerator<string, void, unknown> {
    const endpoint = 'https://api.openai.com/v1/chat/completions'
    const body = {
      model: this.config.model,
      messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      stream: true
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.config.timeout || 30000)
    })

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`
      )
    }

    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim()
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break

            try {
              const parsed = JSON.parse(data) as any
              const content = parsed.choices?.[0]?.delta?.content || ''
              if (content) {
                yield content
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }

        buffer = lines[lines.length - 1]
      }
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * Anthropic Claude chat completion
   */
  private async anthropicChatCompletion(
    messages: ChatMessage[],
    opts: ChatCompletionOptions
  ): Promise<ChatCompletionResponse> {
    const endpoint = 'https://api.anthropic.com/v1/messages'
    const body = {
      model: this.config.model,
      max_tokens: this.config.maxTokens || 2048,
      messages,
      temperature: this.config.temperature
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.config.timeout || 30000)
    })

    if (!response.ok) {
      throw new Error(
        `Anthropic API error: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json() as any
    return {
      id: data.id,
      model: data.model,
      content: data.content?.[0]?.text || '',
      stopReason: data.stop_reason || 'unknown',
      tokenUsage: {
        prompt: data.usage?.input_tokens || 0,
        completion: data.usage?.output_tokens || 0,
        total: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
      }
    }
  }

  /**
   * Stream Anthropic Claude chat completion
   */
  private async *streamAnthropicChatCompletion(
    messages: ChatMessage[]
  ): AsyncGenerator<string, void, unknown> {
    const endpoint = 'https://api.anthropic.com/v1/messages'
    const body = {
      model: this.config.model,
      max_tokens: this.config.maxTokens || 2048,
      messages,
      temperature: this.config.temperature,
      stream: true
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.config.timeout || 30000)
    })

    if (!response.ok) {
      throw new Error(
        `Anthropic API error: ${response.status} ${response.statusText}`
      )
    }

    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim()
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            try {
              const parsed = JSON.parse(data) as any
              if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
                yield parsed.delta.text
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }

        buffer = lines[lines.length - 1]
      }
    } finally {
      reader.releaseLock()
    }
  }
}
