import { CollectionConfig } from 'payload/types'

export const ComplianceIssues: CollectionConfig = {
  slug: 'compliance-issues',
  admin: {
    useAsTitle: 'description',
  },
  fields: [
    {
      name: 'severity',
      type: 'select',
      options: ['critical', 'high', 'medium', 'low', 'info'],
      required: true,
    },
    {
      name: 'type',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'file',
      type: 'text',
    },
    {
      name: 'line',
      type: 'number',
    },
    {
      name: 'resolved',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'resolvedAt',
      type: 'date',
    },
    {
      name: 'discoveredAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
}
