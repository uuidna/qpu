/**
 * Training Platform - Online courses, certification exams, progress tracking
 */

export interface Course {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number // hours
  modules: CourseModule[]
  prerequisites?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CourseModule {
  id: string
  title: string
  description: string
  duration: number // minutes
  content: string
  videoUrl?: string
  resources?: Resource[]
  quiz?: Quiz
}

export interface Resource {
  id: string
  title: string
  type: 'pdf' | 'code' | 'link' | 'video'
  url: string
  description: string
}

export interface Quiz {
  id: string
  title: string
  questions: Question[]
  passingScore: number // percentage
  timeLimit?: number // minutes
}

export interface Question {
  id: string
  type: 'multiple-choice' | 'short-answer' | 'true-false'
  text: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
}

export interface UserEnrollment {
  userId: string
  courseId: string
  enrolledAt: Date
  completedAt?: Date
  progress: number // percentage
  currentModule: string
  moduleProgress: Map<string, ModuleProgress>
}

export interface ModuleProgress {
  completed: boolean
  completedAt?: Date
  quizScore?: number
  quizPassed: boolean
}

export interface Certification {
  id: string
  userId: string
  courseId: string
  title: string
  issuedAt: Date
  expiresAt: Date
  certificateUrl: string
}

export class TrainingPlatform {
  private courses: Map<string, Course> = new Map()
  private enrollments: Map<string, UserEnrollment[]> = new Map()
  private certifications: Map<string, Certification[]> = new Map()

  constructor() {
    this.initializeCourses()
  }

  private initializeCourses(): void {
    // QPU Basics Course
    this.createCourse({
      title: 'QPU Fundamentals',
      description: 'Learn the basics of quantum processing units and how to use them',
      level: 'beginner',
      duration: 4,
      modules: [
        {
          id: 'mod-1',
          title: 'What is a QPU?',
          description: 'Introduction to quantum processing units',
          duration: 30,
          content: 'Quantum processors use quantum mechanics...',
          videoUrl: 'https://qpu.uuidna.com/videos/qpu-basics'
        },
        {
          id: 'mod-2',
          title: 'Getting Started',
          description: 'Setting up your first QPU query',
          duration: 45,
          content: 'To get started, you need...'
        }
      ]
    })

    // API Integration Course
    this.createCourse({
      title: 'API Integration Guide',
      description: 'Learn how to integrate UUIDNA QPU into your applications',
      level: 'intermediate',
      duration: 6,
      modules: [],
      prerequisites: ['qpu-fundamentals']
    })

    // Advanced Topics Course
    this.createCourse({
      title: 'Advanced Quantum Algorithms',
      description: 'Deep dive into optimization and machine learning with QPU',
      level: 'advanced',
      duration: 12,
      modules: [],
      prerequisites: ['api-integration']
    })
  }

  createCourse(data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course {
    const course: Course = {
      id: `course-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.courses.set(course.id, course)
    return course
  }

  enrollUser(userId: string, courseId: string): UserEnrollment | null {
    const course = this.courses.get(courseId)
    if (!course) return null

    const enrollment: UserEnrollment = {
      userId,
      courseId,
      enrolledAt: new Date(),
      progress: 0,
      currentModule: course.modules[0]?.id || '',
      moduleProgress: new Map()
    }

    course.modules.forEach(module => {
      enrollment.moduleProgress.set(module.id, {
        completed: false,
        quizPassed: false
      })
    })

    if (!this.enrollments.has(userId)) {
      this.enrollments.set(userId, [])
    }
    this.enrollments.get(userId)!.push(enrollment)

    return enrollment
  }

  completeModule(userId: string, courseId: string, moduleId: string, quizScore?: number): UserEnrollment | null {
    const enrollments = this.enrollments.get(userId)
    if (!enrollments) return null

    const enrollment = enrollments.find(e => e.courseId === courseId)
    if (!enrollment) return null

    const course = this.courses.get(courseId)
    if (!course) return null

    const module = course.modules.find(m => m.id === moduleId)
    if (!module) return null

    const progress = enrollment.moduleProgress.get(moduleId)
    if (progress) {
      progress.completed = true
      progress.completedAt = new Date()

      if (module.quiz && quizScore !== undefined) {
        progress.quizScore = quizScore
        progress.quizPassed = quizScore >= (module.quiz.passingScore || 70)
      }
    }

    // Update overall progress
    const completedModules = Array.from(enrollment.moduleProgress.values()).filter(p => p.completed).length
    enrollment.progress = Math.round((completedModules / course.modules.length) * 100)

    // Check if course is completed
    if (enrollment.progress === 100) {
      enrollment.completedAt = new Date()
      this.issueCertification(userId, courseId)
    }

    return enrollment
  }

  private issueCertification(userId: string, courseId: string): Certification | null {
    const course = this.courses.get(courseId)
    if (!course) return null

    const certification: Certification = {
      id: `cert-${Date.now()}`,
      userId,
      courseId,
      title: `${course.title} Certification`,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      certificateUrl: `https://qpu.uuidna.com/certificates/${userId}/${courseId}`
    }

    if (!this.certifications.has(userId)) {
      this.certifications.set(userId, [])
    }
    this.certifications.get(userId)!.push(certification)

    return certification
  }

  getUserProgress(userId: string): {
    enrollments: UserEnrollment[]
    certifications: Certification[]
    metrics: Record<string, unknown>
  } {
    const enrollments = this.enrollments.get(userId) || []
    const certifications = this.certifications.get(userId) || []

    const completedCourses = enrollments.filter(e => e.completedAt).length
    const inProgressCourses = enrollments.filter(e => !e.completedAt).length
    const avgProgress = enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0

    return {
      enrollments,
      certifications,
      metrics: {
        totalEnrollments: enrollments.length,
        completedCourses,
        inProgressCourses,
        averageProgress: avgProgress,
        validCertifications: certifications.filter(c => c.expiresAt > new Date()).length
      }
    }
  }

  getCourseAnalytics(courseId: string) {
    const enrolledUsers = Array.from(this.enrollments.values())
      .flat()
      .filter(e => e.courseId === courseId)

    const avgProgress = enrolledUsers.length > 0
      ? Math.round(enrolledUsers.reduce((sum, e) => sum + e.progress, 0) / enrolledUsers.length)
      : 0

    const completionRate = enrolledUsers.length > 0
      ? Math.round((enrolledUsers.filter(e => e.completedAt).length / enrolledUsers.length) * 100)
      : 0

    return {
      totalEnrollments: enrolledUsers.length,
      completedEnrollments: enrolledUsers.filter(e => e.completedAt).length,
      averageProgress: avgProgress,
      completionRate,
      avgTimeToCompletion: this.calculateAvgCompletionTime(enrolledUsers),
      dropoutRate: 100 - completionRate
    }
  }

  private calculateAvgCompletionTime(enrollments: UserEnrollment[]): number {
    const completed = enrollments.filter(e => e.completedAt)
    if (completed.length === 0) return 0

    const totalTime = completed.reduce((sum, e) => {
      const time = (e.completedAt!.getTime() - e.enrolledAt.getTime()) / (1000 * 60 * 60) // hours
      return sum + time
    }, 0)

    return Math.round(totalTime / completed.length)
  }

  getRecommendedCourses(userId: string): Course[] {
    const userEnrollments = this.enrollments.get(userId) || []
    const completedCourses = new Set(userEnrollments.filter(e => e.completedAt).map(e => e.courseId))

    return Array.from(this.courses.values())
      .filter(course => {
        if (completedCourses.has(course.id)) return false
        if (course.prerequisites) {
          return course.prerequisites.every(prereq => completedCourses.has(prereq))
        }
        return true
      })
      .slice(0, 5)
  }
}

export const trainingPlatform = new TrainingPlatform()
