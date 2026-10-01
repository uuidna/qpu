// Seed data for Support Tickets collection - extracted from enterprise.test.ts
export const supportTicketsSeed = [
  {
    ticketNumber: 'TICKET-001',
    subject: 'API not responding',
    description: 'The API is timing out on all requests. This is blocking production.',
    priority: 'critical',
    status: 'open',
    requester: {
      id: 'user-1',
      name: 'John',
      email: 'john@example.com',
    },
    responses: [],
    createdAt: new Date('2024-01-20T09:00:00Z'),
    slaMet: true,
  },
  {
    ticketNumber: 'TICKET-002',
    subject: 'Issue',
    description: 'Desc',
    priority: 'high',
    status: 'in-progress',
    requester: {
      id: 'u1',
      name: 'John',
      email: 'j@e.com',
    },
    responses: [
      {
        author: {
          id: 'support-1',
          name: 'Support',
          role: 'support',
        },
        content: 'Working on this',
        createdAt: new Date('2024-01-20T09:30:00Z'),
      },
    ],
    createdAt: new Date('2024-01-20T09:00:00Z'),
    slaMet: true,
  },
  {
    ticketNumber: 'TICKET-003',
    subject: 'Test',
    description: 'Test',
    priority: 'critical',
    status: 'open',
    requester: {
      id: 'user-1',
      name: 'Test',
      email: 'test@test.com',
    },
    responses: [],
    createdAt: new Date('2024-01-20T08:00:00Z'),
    slaMet: false,
  },
]
