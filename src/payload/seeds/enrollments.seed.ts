// Seed data for Enrollments collection - extracted from enterprise.test.ts
export const enrollmentsSeed = [
  {
    user: 'user-1',
    courseId: 'course-1',
    courseName: 'Introduction to QPU',
    progress: 0,
    status: 'enrolled',
    modules: [],
    enrolledAt: new Date('2024-01-20T10:00:00Z'),
  },
  {
    user: 'user-1',
    courseId: 'course-2',
    courseName: 'Advanced Quantum Computing',
    progress: 45,
    status: 'in-progress',
    modules: [
      {
        moduleId: 'mod-1',
        name: 'Quantum Basics',
        completed: true,
        score: 85,
        completedAt: new Date('2024-01-19T15:00:00Z'),
      },
      {
        moduleId: 'mod-2',
        name: 'Circuit Design',
        completed: false,
        score: null,
      },
    ],
    enrolledAt: new Date('2024-01-15T10:00:00Z'),
  },
  {
    user: 'user-1',
    courseId: 'course-1',
    courseName: 'Introduction to QPU',
    progress: 100,
    status: 'completed',
    modules: [
      {
        moduleId: 'mod-1',
        name: 'Module 1',
        completed: true,
        score: 90,
        completedAt: new Date('2024-01-18T14:00:00Z'),
      },
    ],
    enrolledAt: new Date('2024-01-10T10:00:00Z'),
    completedAt: new Date('2024-01-20T12:00:00Z'),
  },
]
