import type { CollectionConfig } from 'payload'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    useAsTitle: 'courseId',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'courseId',
      type: 'text',
      required: true,
    },
    {
      name: 'courseName',
      type: 'text',
    },
    {
      name: 'progress',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 100,
    },
    {
      name: 'status',
      type: 'select',
      options: ['enrolled', 'in-progress', 'completed', 'dropped'],
      defaultValue: 'enrolled',
    },
    {
      name: 'modules',
      type: 'array',
      fields: [
        {
          name: 'moduleId',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'completed',
          type: 'checkbox',
        },
        {
          name: 'score',
          type: 'number',
        },
        {
          name: 'completedAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'enrolledAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'completedAt',
      type: 'date',
    },
  ],
}
