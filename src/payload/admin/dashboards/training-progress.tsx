/**
 * Training Progress Dashboard Widget
 * Tracks course enrollments and learning progress
 */

import React from 'react'

interface CourseStats {
  name: string
  enrolled: number
  inProgress: number
  completed: number
  avgProgress: number
}

export const TrainingProgressDashboard: React.FC = () => {
  const courses: CourseStats[] = [
    {
      name: 'Introduction to QPU',
      enrolled: 5,
      inProgress: 2,
      completed: 1,
      avgProgress: 35,
    },
    {
      name: 'Advanced Quantum Computing',
      enrolled: 3,
      inProgress: 2,
      completed: 0,
      avgProgress: 45,
    },
    {
      name: 'Systems Architecture',
      enrolled: 2,
      inProgress: 1,
      completed: 1,
      avgProgress: 60,
    },
  ]

  const userProgress = [
    { name: 'John', enrolled: 3, completed: 1, avgScore: 85 },
    { name: 'Jane', enrolled: 2, completed: 0, avgScore: 78 },
    { name: 'Bob', enrolled: 1, completed: 1, avgScore: 92 },
  ]

  const stats = {
    totalEnrollments: 10,
    totalCompleted: 2,
    avgScore: 85,
    completionRate: 20,
  }

  const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div style={{
      width: '100%',
      height: '0.5rem',
      backgroundColor: '#e5e7eb',
      borderRadius: '0.25rem',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${value}%`,
        backgroundColor: value > 75 ? '#10b981' : value > 50 ? '#3b82f6' : '#f59e0b',
        transition: 'width 0.3s ease',
      }} />
    </div>
  )

  const StatCard: React.FC<{ label: string; value: string | number; unit?: string }> = ({
    label,
    value,
    unit = '',
  }) => (
    <div style={{
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937' }}>
        {value}{unit}
      </div>
    </div>
  )

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        🎓 Training Progress Dashboard
      </h2>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <StatCard label="Total Enrollments" value={stats.totalEnrollments} />
        <StatCard label="Completed" value={stats.totalCompleted} />
        <StatCard label="Completion Rate" value={stats.completionRate} unit="%" />
        <StatCard label="Average Score" value={stats.avgScore} unit="/100" />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem',
      }}>
        {/* Courses */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 'bold' }}>
            📚 Courses
          </h3>
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
          }}>
            {courses.map((course, idx) => (
              <div key={idx} style={{ marginBottom: idx < courses.length - 1 ? '1.5rem' : 0 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {course.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {course.avgProgress}%
                  </span>
                </div>
                <ProgressBar value={course.avgProgress} />
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                }}>
                  <span>Enrolled: {course.enrolled}</span>
                  <span>In Progress: {course.inProgress}</span>
                  <span>Completed: {course.completed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 'bold' }}>
            👥 User Progress
          </h3>
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
          }}>
            {userProgress.map((user, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: idx < userProgress.length - 1 ? '1.5rem' : 0,
                  paddingBottom: idx < userProgress.length - 1 ? '1.5rem' : 0,
                  borderBottom: idx < userProgress.length - 1 ? '1px solid #e5e7eb' : 'none',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {user.name}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'white',
                    backgroundColor: '#3b82f6',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                  }}>
                    {user.avgScore}/100
                  </span>
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                }}>
                  {user.completed} of {user.enrolled} courses completed
                </div>
                <ProgressBar value={(user.completed / user.enrolled) * 100} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#f0fdf4',
        borderLeft: '4px solid #10b981',
        borderRadius: '0.25rem',
      }}>
        <div style={{ fontSize: '0.875rem', color: '#166534', fontWeight: 'bold' }}>
          ✅ Training Insights
        </div>
        <div style={{ fontSize: '0.875rem', color: '#166534', marginTop: '0.5rem' }}>
          3 courses active with 10 enrollments. Average completion score: {stats.avgScore}%.
          Recommend advanced training for top performers.
        </div>
      </div>
    </div>
  )
}
