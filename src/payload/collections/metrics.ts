import type { CollectionConfig } from 'payload'

export const Metrics: CollectionConfig = {
  slug: 'metrics',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: ['system', 'performance', 'reliability', 'business'],
    },
    {
      name: 'value',
      type: 'number',
      required: true,
    },
    {
      name: 'unit',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: ['healthy', 'warning', 'critical'],
    },
    {
      name: 'timestamp',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'threshold',
      type: 'number',
    },
    {
      name: 'trend',
      type: 'select',
      options: ['up', 'down', 'stable'],
    },
    {
      name: 'source',
      type: 'text',
    },
  ],
}
