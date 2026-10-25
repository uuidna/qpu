// Examples API: RESTful JSON API for examples, use cases, and learning paths
// Provides programmatic access to all quantum examples

import { COMPLETE_USECASES, COMPLETE_EXAMPLES, LEARNING_PATHS } from '../data/examples-complete.js'

interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
  version: string
}

interface SearchResult {
  id: string
  type: 'usecase' | 'example'
  title: string
  description: string
  domain?: string
  difficulty?: string
  industry?: string
  tags: string[]
  score: number
}

export class ExamplesAPI {
  version = '1.0.0'

  /**
   * List all use cases with optional filtering
   */
  listUsecases(filter?: {
    domain?: string
    difficulty?: string
    industry?: string
    tags?: string[]
  }): APIResponse<any[]> {
    let usecases = Object.entries(COMPLETE_USECASES).map(([id, uc]) => ({ id, ...uc }))

    if (filter?.domain) {
      usecases = usecases.filter(uc => uc.domain === filter.domain)
    }
    if (filter?.difficulty) {
      usecases = usecases.filter(uc => uc.difficulty === filter.difficulty)
    }
    if (filter?.industry) {
      usecases = usecases.filter(uc => uc.industry === filter.industry)
    }
    if (filter?.tags && filter.tags.length > 0) {
      usecases = usecases.filter(uc => filter.tags!.some(t => uc.tags.includes(t)))
    }

    return {
      success: true,
      data: usecases,
      timestamp: new Date().toISOString(),
      version: this.version
    }
  }

  /**
   * Get specific use case
   */
  getUsecase(id: string): APIResponse<any> {
    const uc = COMPLETE_USECASES[id as keyof typeof COMPLETE_USECASES]

    if (!uc) {
      return {
        success: false,
        error: `Use case not found: ${id}`,
        timestamp: new Date().toISOString(),
        version: this.version
      }
    }

    return {
      success: true,
      data: { id, ...uc },
      timestamp: new Date().toISOString(),
      version: this.version
    }
  }

  /**
   * List all examples
   */
  listExamples(): APIResponse<any[]> {
    const examples = Object.entries(COMPLETE_EXAMPLES).map(([id, ex]) => ({ id, ...ex }))

    return {
      success: true,
      data: examples,
      timestamp: new Date().toISOString(),
      version: this.version
    }
  }

  /**
   * Get specific example
   */
  getExample(id: string): APIResponse<any> {
    const ex = COMPLETE_EXAMPLES[id as keyof typeof COMPLETE_EXAMPLES]

    if (!ex) {
      return {
        success: false,
        error: `Example not found: ${id}`,
        timestamp: new Date().toISOString(),
        version: this.version
      }
    }

    return {
      success: true,
      data: { id, ...ex },
      timestamp: new Date().toISOString(),
      version: this.version
    }
  }

  /**
   * Get use cases for an example
   */
  getExampleUsecases(exampleId: string): APIResponse<any[]> {
    const ex = COMPLETE_EXAMPLES[exampleId as keyof typeof COMPLETE_EXAMPLES]

    if (!ex) {
      return {
        success: false,
        error: `Example not found: ${exampleId}`,
        timestamp: new Date().toISOString(),
        version: this.version
      }
    }

    const usecases = ex.relatedUsecases.map(id => ({
      id,
      ...COMPLETE_USECASES[id as keyof typeof COMPLETE_USECASES]
    }))

    return {
      success: true,
      data: usecases,
      timestamp: new Date().toISOString(),
      version: this.version
    }
  }

  /**
   * Get learning path
   */
  getLearningPath(pathId: string): APIResponse<any> {
    const path = LEARNING_PATHS[pathId as keyof typeof LEARNING_PATHS]

    if (!path) {
      return {
        success: false,
        error: `Learning path not found: ${pathId}`,
        timestamp: new Date().toISOString(),
        version: this.version
      }
    }

    return {
      success: true,
      data: { id: pathId, ...path },
      timestamp: new Date().toISOString(),
      version: this.version
    }
  }

  /**
   * List all learning paths
   */
  listLearningPaths(): APIResponse<any[]> {
    const paths = Object.entries(LEARNING_PATHS).map(([id, path]) => ({ id, ...path }))

    return {
      success: true,
      data: paths,
      timestamp: new Date().toISOString(),
      version: this.version
    }
  }

  /**
   * Search across all content
   */
  search(query: string, limit = 10): APIResponse<SearchResult[]> {
    const searchResults: SearchResult[] = []
    const q = query.toLowerCase()

    // Search use cases
    Object.entries(COMPLETE_USECASES).forEach(([id, uc]) => {
      let score = 0

      if (uc.title.toLowerCase().includes(q)) score += 10
      if (uc.description.toLowerCase().includes(q)) score += 5
      if (uc.domain.includes(q)) score += 3
      if (uc.industry.toLowerCase().includes(q)) score += 3
      if (uc.tags.some(t => t.includes(q))) score += 2

      if (score > 0) {
        searchResults.push({
          id,
          type: 'usecase',
          title: uc.title,
          description: uc.description,
          domain: uc.domain,
          difficulty: uc.difficulty,
          industry: uc.industry,
          tags: uc.tags,
          score
        })
      }
    })

    // Search examples
    Object.entries(COMPLETE_EXAMPLES).forEach(([id, ex]) => {
      let score = 0

      if (ex.title.toLowerCase().includes(q)) score += 10
      if (ex.description.toLowerCase().includes(q)) score += 5
      if (ex.framework.includes(q)) score += 3
      if (ex.provider.includes(q)) score += 3
      if (ex.tags.some(t => t.includes(q))) score += 2

      if (score > 0) {
        searchResults.push({
          id,
          type: 'example',
          title: ex.title,
          description: ex.description,
          tags: ex.tags,
          difficulty: ex.difficulty,
          score
        })
      }
    })

    // Sort by score and limit
    searchResults.sort((a, b) => b.score - a.score)

    return {
      success: true,
      data: searchResults.slice(0, limit),
      timestamp: new Date().toISOString(),
      version: this.version
    }
  }

  /**
   * Get statistics
   */
  getStats(): APIResponse<any> {
    const usecasesByDomain = Object.values(COMPLETE_USECASES).reduce(
      (acc, uc) => {
        acc[uc.domain] = (acc[uc.domain] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const usecasesByDifficulty = Object.values(COMPLETE_USECASES).reduce(
      (acc, uc) => {
        acc[uc.difficulty] = (acc[uc.difficulty] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const usecasesByIndustry = Object.values(COMPLETE_USECASES).reduce(
      (acc, uc) => {
        acc[uc.industry] = (acc[uc.industry] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      success: true,
      data: {
        totalUsecases: Object.keys(COMPLETE_USECASES).length,
        totalExamples: Object.keys(COMPLETE_EXAMPLES).length,
        totalLearningPaths: Object.keys(LEARNING_PATHS).length,
        usecasesByDomain,
        usecasesByDifficulty,
        usecasesByIndustry,
        frameworks: ['qiskit', 'cirq', 'pennylane', 'pyquil'],
        providers: ['ibm-quantum', 'google-cirq', 'ionq', 'rigetti', 'aws-braket']
      },
      timestamp: new Date().toISOString(),
      version: this.version
    }
  }

  /**
   * Get recommendation based on user profile
   */
  getRecommendations(profile: {
    difficulty?: string
    domain?: string
    industry?: string
    interests?: string[]
  }): APIResponse<any[]> {
    let recommendations = Object.entries(COMPLETE_USECASES).map(([id, uc]) => ({
      id,
      ...uc,
      score: 0
    }))

    // Score based on profile
    recommendations.forEach(rec => {
      if (profile.difficulty && rec.difficulty === profile.difficulty) rec.score += 3
      if (profile.domain && rec.domain === profile.domain) rec.score += 5
      if (profile.industry && rec.industry === profile.industry) rec.score += 5
      if (profile.interests) {
        profile.interests.forEach(interest => {
          if (rec.tags.includes(interest)) rec.score += 2
        })
      }
    })

    // Filter and sort
    recommendations = recommendations
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    return {
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString(),
      version: this.version
    }
  }
}

// Export singleton
export const examplesAPI = new ExamplesAPI()

// Express middleware
export function setupExamplesAPI(app: any): void {
  app.get('/api/usecases', (req: any, res: any) => {
    const filter = {
      domain: req.query.domain,
      difficulty: req.query.difficulty,
      industry: req.query.industry,
      tags: req.query.tags ? req.query.tags.split(',') : undefined
    }
    res.json(examplesAPI.listUsecases(filter))
  })

  app.get('/api/usecases/:id', (req: any, res: any) => {
    res.json(examplesAPI.getUsecase(req.params.id))
  })

  app.get('/api/examples', (req: any, res: any) => {
    res.json(examplesAPI.listExamples())
  })

  app.get('/api/examples/:id', (req: any, res: any) => {
    res.json(examplesAPI.getExample(req.params.id))
  })

  app.get('/api/examples/:id/usecases', (req: any, res: any) => {
    res.json(examplesAPI.getExampleUsecases(req.params.id))
  })

  app.get('/api/learning-paths', (req: any, res: any) => {
    res.json(examplesAPI.listLearningPaths())
  })

  app.get('/api/learning-paths/:id', (req: any, res: any) => {
    res.json(examplesAPI.getLearningPath(req.params.id))
  })

  app.get('/api/search', (req: any, res: any) => {
    const { q, limit } = req.query
    if (!q) {
      res.status(400).json({ success: false, error: 'Missing query parameter: q' })
      return
    }
    res.json(examplesAPI.search(q, limit ? parseInt(limit) : 10))
  })

  app.get('/api/stats', (req: any, res: any) => {
    res.json(examplesAPI.getStats())
  })

  app.post('/api/recommendations', (req: any, res: any) => {
    const { difficulty, domain, industry, interests } = req.body
    res.json(examplesAPI.getRecommendations({ difficulty, domain, industry, interests }))
  })
}
