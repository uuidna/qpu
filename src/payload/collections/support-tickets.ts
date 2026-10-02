import type { CollectionConfig } from 'payload'

export const SupportTickets: CollectionConfig = {
  slug: 'support-tickets',
  admin: {
    useAsTitle: 'subject',
  },
  fields: [
    {
      name: 'ticketNumber',
      type: 'text',
      unique: true,
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'priority',
      type: 'select',
      options: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['open', 'in-progress', 'waiting', 'resolved', 'closed'],
      defaultValue: 'open',
    },
    {
      name: 'requester',
      type: 'group',
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
        },
      ],
    },
    {
      name: 'assignee',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'responses',
      type: 'array',
      fields: [
        {
          name: 'author',
          type: 'group',
          fields: [
            { name: 'id', type: 'text' },
            { name: 'name', type: 'text' },
            { name: 'role', type: 'text' },
          ],
        },
        {
          name: 'content',
          type: 'textarea',
        },
        {
          name: 'createdAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'createdAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'resolvedAt',
      type: 'date',
    },
    {
      name: 'slaMet',
      type: 'checkbox',
    },
  ],
}
