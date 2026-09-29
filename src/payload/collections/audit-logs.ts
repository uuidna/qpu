import type { CollectionConfig } from 'payload/types'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
  },
  fields: [
    {
      name: 'timestamp',
      type: 'date',
      required: true,
    },
    {
      name: 'action',
      type: 'select',
      options: ['deploy', 'access', 'modify', 'delete', 'export'],
      required: true,
    },
    {
      name: 'actor',
      type: 'text',
      required: true,
    },
    {
      name: 'resource',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['success', 'failure', 'pending'],
      required: true,
    },
    {
      name: 'details',
      type: 'textarea',
    },
    {
      name: 'ipAddress',
      type: 'text',
    },
  ],
}
