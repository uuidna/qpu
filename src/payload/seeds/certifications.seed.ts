// Seed data for Certifications collection - extracted from enterprise.test.ts
export const certificationsSeed = [
  {
    framework: 'SOC 2',
    status: 'planning',
    auditor: 'auditor-1',
    completeness: 0,
    startDate: new Date('2024-01-20T10:00:00Z'),
    targetDate: new Date('2024-04-20'),
    requirements: [
      {
        id: 'soc2-001',
        title: 'Access Controls',
        status: 'pending',
        dueDate: new Date('2024-02-20'),
      },
      {
        id: 'soc2-002',
        title: 'Change Management',
        status: 'pending',
        dueDate: new Date('2024-02-25'),
      },
      {
        id: 'soc2-003',
        title: 'Monitoring',
        status: 'pending',
        dueDate: new Date('2024-03-01'),
      },
    ],
    findings: '',
    notes: 'Initial audit planning phase',
  },
  {
    framework: 'ISO 27001',
    status: 'in-progress',
    auditor: 'auditor-1',
    completeness: 65,
    startDate: new Date('2024-01-10T10:00:00Z'),
    targetDate: new Date('2024-03-10'),
    requirements: [
      {
        id: 'iso-001',
        title: 'Information Security Policy',
        status: 'completed',
        dueDate: new Date('2024-01-31'),
      },
      {
        id: 'iso-002',
        title: 'Organization of Information Security',
        status: 'in-progress',
        dueDate: new Date('2024-02-15'),
      },
      {
        id: 'iso-003',
        title: 'Asset Management',
        status: 'pending',
        dueDate: new Date('2024-02-28'),
      },
    ],
    findings: 'Found minor gaps in asset inventory process',
    notes: 'Expected completion by March 10',
  },
  {
    framework: 'HIPAA',
    status: 'completed',
    auditor: 'auditor-1',
    completeness: 100,
    startDate: new Date('2023-11-01T10:00:00Z'),
    targetDate: new Date('2024-01-15'),
    completedDate: new Date('2024-01-15T15:00:00Z'),
    validUntil: new Date('2025-01-15'),
    requirements: [
      {
        id: 'hipaa-001',
        title: 'Privacy Rule',
        status: 'completed',
        dueDate: new Date('2023-12-15'),
      },
      {
        id: 'hipaa-002',
        title: 'Security Rule',
        status: 'completed',
        dueDate: new Date('2024-01-01'),
      },
    ],
    findings: 'No findings. System is fully compliant.',
    notes: 'Certification granted for one year',
  },
]
