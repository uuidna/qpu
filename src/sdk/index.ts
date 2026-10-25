// WAVE 8F: SDK Generation Module Exports

export {
  APIEndpoint,
  OpenAPISpec,
  SDKGenerator,
  sdkGenerator
} from './sdk-generator.js'

// SDK manager for generating and publishing SDKs
export class SDKManager {
  private generator: any

  constructor() {
    // Imported from ./sdk-generator.js above
  }

  // Generate all SDKs
  generateAllSDKs(endpoints: any[]) {
    const generator = new (this.generator as any)(endpoints)

    return {
      typescript: generator.generateTypeScriptSDK(),
      python: generator.generatePythonSDK(),
      go: generator.generateGoSDK(),
      openapi: generator.generateOpenAPISpec()
    }
  }

  // Publish to registries
  async publishToRegistries(sdks: any, registries: string[]) {
    const results = {}

    for (const registry of registries) {
      try {
        if (registry === 'npm') {
          // results.npm = await publishToNPM(sdks.typescript)
        } else if (registry === 'pypi') {
          // results.pypi = await publishToPyPI(sdks.python)
        } else if (registry === 'github') {
          // results.github = await publishToGitHub(sdks.go)
        }
      } catch (error) {
        // results[registry] = { error: error.message }
      }
    }

    return results
  }
}

export const sdkManager = new SDKManager()
