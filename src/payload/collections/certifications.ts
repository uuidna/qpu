import type { CollectionConfig } from 'payload/types'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  admin: {
    useAsTitle: 'framework',
  },
  fields: [
    {
      name: 'framework',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['planning', 'in-progress', 'review', 'completed', 'expired'],
      defaultValue: 'planning',
    },
    {
      name: 'auditor',
      type: 'text',
    },
    {
      name: 'completeness',
      type: 'number',
      min: 0,
      max: 100,
    },
    {
      name: 'startDate',
      type: 'date',
    },
    {
      name: 'targetDate',
      type: 'date',
    },
    {
      name: 'completedDate',
      type: 'date',
    },
    {
      name: 'validUntil',
      type: 'date',
    },
    {
      name: 'requirements',
      type: 'array',
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'status',
          type: 'select',
          options: ['pending', 'in-progress', 'completed'],
        },
        {
          name: 'dueDate',
          type: 'date',
        },
      ],
    },
    {
      name: 'findings',
      type: 'textarea',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
