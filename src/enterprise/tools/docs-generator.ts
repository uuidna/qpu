/**
 * Documentation Generator - Creates admin guides, user guides, troubleshooting docs
 */

export interface DocTemplate {
  title: string
  sections: Section[]
  metadata: DocMetadata
}

export interface Section {
  title: string
  level: number
  content: string
  subsections?: Section[]
}

export interface DocMetadata {
  audience: 'admin' | 'user' | 'developer' | 'operator'
  status: 'draft' | 'review' | 'approved' | 'published'
  lastUpdated: Date
  version: string
  authors: string[]
}

export class DocumentationGenerator {
  generateAdminGuide(): DocTemplate {
    return {
      title: 'Administrator Guide',
      sections: [
        {
          title: 'Installation & Setup',
          level: 1,
          content: 'Step-by-step installation instructions for various deployment scenarios.',
          subsections: [
            {
              title: 'Prerequisites',
              level: 2,
              content: `
- Node.js >= 22
- TypeScript 7.0+
- Docker (optional)
- Kubernetes cluster (for K8s deployment)
              `
            },
            {
              title: 'Standalone Installation',
              level: 2,
              content: `
\`\`\`bash
npm install @uuidna/qpu
npm run build
npm run server
\`\`\`
              `
            },
            {
              title: 'Docker Installation',
              level: 2,
              content: `
\`\`\`bash
docker build -f deploy/docker/Dockerfile -t uuidna-qpu:latest .
docker-compose -f deploy/docker/docker-compose.yml up -d
\`\`\`
              `
            },
            {
              title: 'Kubernetes Installation',
              level: 2,
              content: `
\`\`\`bash
kubectl apply -f deploy/kubernetes/
kubectl rollout status deployment/qpu -n quantum
\`\`\`
              `
            }
          ]
        },
        {
          title: 'Configuration',
          level: 1,
          content: 'How to configure the QPU for your environment.',
          subsections: [
            {
              title: 'Environment Variables',
              level: 2,
              content: `
- NODE_ENV: production|development
- QPU_PORT: Server port (default: 3000)
- QPU_LOG_LEVEL: debug|info|warn|error
- DATABASE_URL: Connection string
- REDIS_URL: Cache backend
- AUTH_SECRET: JWT signing key
              `
            },
            {
              title: 'Performance Tuning',
              level: 2,
              content: 'Recommendations for production deployments with high load.'
            }
          ]
        },
        {
          title: 'Operations',
          level: 1,
          content: 'Daily operational procedures.',
          subsections: [
            {
              title: 'Monitoring',
              level: 2,
              content: 'How to monitor system health and performance.'
            },
            {
              title: 'Backup & Recovery',
              level: 2,
              content: 'Backup procedures and recovery runbooks.'
            },
            {
              title: 'Troubleshooting',
              level: 2,
              content: 'Common issues and their solutions.'
            }
          ]
        }
      ],
      metadata: {
        audience: 'admin',
        status: 'draft',
        lastUpdated: new Date(),
        version: '1.0.0',
        authors: ['UUIDNA Team']
      }
    }
  }

  generateUserGuide(): DocTemplate {
    return {
      title: 'User Guide',
      sections: [
        {
          title: 'Getting Started',
          level: 1,
          content: 'Quick start for new users.'
        },
        {
          title: 'Core Concepts',
          level: 1,
          content: 'Quantum domains, problem types, solving algorithms.'
        },
        {
          title: 'API Usage',
          level: 1,
          content: 'How to use the API to submit quantum problems.'
        },
        {
          title: 'SDK Examples',
          level: 1,
          content: 'Code examples in multiple languages.'
        },
        {
          title: 'Best Practices',
          level: 1,
          content: 'Recommended patterns and approaches.'
        }
      ],
      metadata: {
        audience: 'user',
        status: 'draft',
        lastUpdated: new Date(),
        version: '1.0.0',
        authors: ['UUIDNA Team']
      }
    }
  }

  generateDeveloperGuide(): DocTemplate {
    return {
      title: 'Developer Guide',
      sections: [
        {
          title: 'Architecture Overview',
          level: 1,
          content: 'High-level architecture and component relationships.'
        },
        {
          title: 'Setting Up Development Environment',
          level: 1,
          content: 'Prerequisites and development setup.'
        },
        {
          title: 'Contributing',
          level: 1,
          content: 'How to contribute code and documentation.'
        },
        {
          title: 'Testing',
          level: 1,
          content: 'Writing and running tests.'
        },
        {
          title: 'API Integration',
          level: 1,
          content: 'Integrating the QPU into your applications.'
        }
      ],
      metadata: {
        audience: 'developer',
        status: 'draft',
        lastUpdated: new Date(),
        version: '1.0.0',
        authors: ['UUIDNA Team']
      }
    }
  }

  generateTroubleshootingGuide(): DocTemplate {
    return {
      title: 'Troubleshooting Guide',
      sections: [
        {
          title: 'Common Issues',
          level: 1,
          content: 'Frequently encountered problems and solutions.',
          subsections: [
            {
              title: 'High Latency',
              level: 2,
              content: `
Issue: Quantum computations taking longer than expected
Causes:
- Cache misses due to insufficient memory
- Queue backlog from high concurrent requests
- Network latency to external AI APIs

Solutions:
1. Increase cache size (MAX_SPANS, MAX_HISTORY)
2. Scale horizontally (add more QPU instances)
3. Optimize hybrid splits for better classical/quantum balance
              `
            },
            {
              title: 'Memory Errors',
              level: 2,
              content: 'Out of memory errors and solutions.'
            },
            {
              title: 'Authentication Failures',
              level: 2,
              content: 'API key and token issues.'
            }
          ]
        },
        {
          title: 'Debug Mode',
          level: 1,
          content: 'How to enable debug logging and tracing.'
        },
        {
          title: 'Contacting Support',
          level: 1,
          content: 'How to get help from the support team.'
        }
      ],
      metadata: {
        audience: 'operator',
        status: 'draft',
        lastUpdated: new Date(),
        version: '1.0.0',
        authors: ['UUIDNA Team']
      }
    }
  }

  toMarkdown(doc: DocTemplate): string {
    const lines: string[] = []
    lines.push(`# ${doc.title}`)
    lines.push('')
    lines.push(`**Last Updated**: ${doc.metadata.lastUpdated.toISOString().split('T')[0]}`)
    lines.push(`**Version**: ${doc.metadata.version}`)
    lines.push(`**Status**: ${doc.metadata.status}`)
    lines.push('')

    const renderSection = (section: Section) => {
      lines.push(`${'#'.repeat(section.level)} ${section.title}`)
      lines.push('')
      lines.push(section.content)
      lines.push('')

      section.subsections?.forEach(sub => renderSection(sub))
    }

    doc.sections.forEach(section => renderSection(section))
    return lines.join('\n')
  }
}

export const docsGenerator = new DocumentationGenerator()
