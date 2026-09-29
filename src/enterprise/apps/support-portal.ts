/**
 * Support Portal - Ticket management, knowledge base, SLA tracking
 */

export interface SupportTicket {
  id: string
  subject: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'waiting-customer' | 'resolved' | 'closed'
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  assignedTo?: string
  requester: {
    id: string
    name: string
    email: string
  }
  responses: TicketResponse[]
}

export interface TicketResponse {
  id: string
  author: {
    id: string
    name: string
    role: 'customer' | 'support' | 'admin'
  }
  content: string
  createdAt: Date
  attachments?: string[]
}

export interface KnowledgeBaseArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  views: number
  helpful: number
  unhelpful: number
  createdAt: Date
  updatedAt: Date
  author: string
}

export interface SLAPolicy {
  priority: string
  responseTime: number // minutes
  resolutionTime: number // minutes
}

export class SupportPortal {
  private tickets: Map<string, SupportTicket> = new Map()
  private knowledgeBase: Map<string, KnowledgeBaseArticle> = new Map()
  private slaPolicies: Map<string, SLAPolicy> = new Map()

  constructor() {
    this.initializeSLAPolicies()
    this.initializeKnowledgeBase()
  }

  private initializeSLAPolicies(): void {
    this.slaPolicies.set('critical', {
      priority: 'critical',
      responseTime: 15, // 15 minutes
      resolutionTime: 240 // 4 hours
    })
    this.slaPolicies.set('high', {
      priority: 'high',
      responseTime: 60, // 1 hour
      resolutionTime: 1440 // 24 hours
    })
    this.slaPolicies.set('medium', {
      priority: 'medium',
      responseTime: 480, // 8 hours
      resolutionTime: 2880 // 48 hours
    })
    this.slaPolicies.set('low', {
      priority: 'low',
      responseTime: 1440, // 24 hours
      resolutionTime: 7200 // 5 days
    })
  }

  private initializeKnowledgeBase(): void {
    this.knowledgeBase.set('qpu-basics', {
      id: 'qpu-basics',
      title: 'What is a Quantum Processing Unit?',
      content: 'A QPU is a quantum computer that solves problems using quantum algorithms...',
      category: 'Getting Started',
      tags: ['qpu', 'basics', 'quantum'],
      views: 1250,
      helpful: 890,
      unhelpful: 45,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'UUIDNA Team'
    })
    this.knowledgeBase.set('api-auth', {
      id: 'api-auth',
      title: 'API Authentication Guide',
      content: 'Learn how to authenticate with the UUIDNA API...',
      category: 'API',
      tags: ['api', 'authentication', 'security'],
      views: 2100,
      helpful: 1850,
      unhelpful: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'UUIDNA Team'
    })
  }

  createTicket(data: {
    subject: string
    description: string
    priority: string
    requester: { id: string; name: string; email: string }
  }): SupportTicket {
    const ticket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      subject: data.subject,
      description: data.description,
      priority: data.priority as any,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      requester: data.requester,
      responses: []
    }

    this.tickets.set(ticket.id, ticket)
    return ticket
  }

  updateTicket(
    ticketId: string,
    update: Partial<Omit<SupportTicket, 'id' | 'createdAt'>>
  ): SupportTicket | null {
    const ticket = this.tickets.get(ticketId)
    if (!ticket) return null

    Object.assign(ticket, { ...update, updatedAt: new Date() })
    return ticket
  }

  addResponse(ticketId: string, response: Omit<TicketResponse, 'id'>): SupportTicket | null {
    const ticket = this.tickets.get(ticketId)
    if (!ticket) return null

    ticket.responses.push({
      id: `response-${Date.now()}`,
      ...response
    })

    ticket.updatedAt = new Date()
    return ticket
  }

  getTicket(ticketId: string): SupportTicket | null {
    return this.tickets.get(ticketId) || null
  }

  searchTickets(filter: {
    status?: string
    priority?: string
    requester?: string
    assignedTo?: string
  }): SupportTicket[] {
    return Array.from(this.tickets.values()).filter(ticket => {
      if (filter.status && ticket.status !== filter.status) return false
      if (filter.priority && ticket.priority !== filter.priority) return false
      if (filter.requester && ticket.requester.email !== filter.requester) return false
      if (filter.assignedTo && ticket.assignedTo !== filter.assignedTo) return false
      return true
    })
  }

  checkSLACompliance(ticketId: string): { compliant: boolean; metrics: Record<string, unknown> } {
    const ticket = this.tickets.get(ticketId)
    if (!ticket) return { compliant: false, metrics: {} }

    const sla = this.slaPolicies.get(ticket.priority)
    if (!sla) return { compliant: false, metrics: {} }

    const now = new Date()
    const responseTime = ticket.responses.length > 0
      ? (ticket.responses[0].createdAt.getTime() - ticket.createdAt.getTime()) / 60000
      : (now.getTime() - ticket.createdAt.getTime()) / 60000

    const resolutionTime = ticket.resolvedAt
      ? (ticket.resolvedAt.getTime() - ticket.createdAt.getTime()) / 60000
      : (now.getTime() - ticket.createdAt.getTime()) / 60000

    return {
      compliant: responseTime <= sla.responseTime && (ticket.resolvedAt ? resolutionTime <= sla.resolutionTime : true),
      metrics: {
        responseTime: `${Math.round(responseTime)}/${sla.responseTime} minutes`,
        resolutionTime: `${Math.round(resolutionTime)}/${sla.resolutionTime} minutes`,
        slaStatus: responseTime <= sla.responseTime ? 'on-track' : 'breached'
      }
    }
  }

  searchKnowledgeBase(query: string): KnowledgeBaseArticle[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.knowledgeBase.values()).filter(
      article =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  getArticle(articleId: string): KnowledgeBaseArticle | null {
    const article = this.knowledgeBase.get(articleId)
    if (article) {
      article.views++
    }
    return article || null
  }

  markArticleHelpful(articleId: string, helpful: boolean): KnowledgeBaseArticle | null {
    const article = this.knowledgeBase.get(articleId)
    if (article) {
      if (helpful) {
        article.helpful++
      } else {
        article.unhelpful++
      }
    }
    return article || null
  }

  getPortalMetrics() {
    const allTickets = Array.from(this.tickets.values())
    const openTickets = allTickets.filter(t => t.status === 'open')
    const resolvedTickets = allTickets.filter(t => t.status === 'resolved')

    const avgResponseTime = this.calculateAverageResponseTime()
    const avgResolutionTime = this.calculateAverageResolutionTime()

    return {
      totalTickets: allTickets.length,
      openTickets: openTickets.length,
      resolvedTickets: resolvedTickets.length,
      avgResponseTime: Math.round(avgResponseTime),
      avgResolutionTime: Math.round(avgResolutionTime),
      slaComplianceRate: this.calculateSLACompliance(),
      knowledgeBaseArticles: this.knowledgeBase.size,
      topArticles: Array.from(this.knowledgeBase.values())
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
    }
  }

  private calculateAverageResponseTime(): number {
    const ticketsWithResponse = Array.from(this.tickets.values()).filter(t => t.responses.length > 0)
    if (ticketsWithResponse.length === 0) return 0

    const total = ticketsWithResponse.reduce((sum, t) => {
      const responseTime = (t.responses[0].createdAt.getTime() - t.createdAt.getTime()) / 60000
      return sum + responseTime
    }, 0)

    return total / ticketsWithResponse.length
  }

  private calculateAverageResolutionTime(): number {
    const resolvedTickets = Array.from(this.tickets.values()).filter(t => t.resolvedAt)
    if (resolvedTickets.length === 0) return 0

    const total = resolvedTickets.reduce((sum, t) => {
      const resolutionTime = ((t.resolvedAt?.getTime() || 0) - t.createdAt.getTime()) / 60000
      return sum + resolutionTime
    }, 0)

    return total / resolvedTickets.length
  }

  private calculateSLACompliance(): number {
    const allTickets = Array.from(this.tickets.values())
    if (allTickets.length === 0) return 100

    const compliant = allTickets.filter(t => {
      const result = this.checkSLACompliance(t.id)
      return result.compliant
    }).length

    return Math.round((compliant / allTickets.length) * 100)
  }
}

export const supportPortal = new SupportPortal()
