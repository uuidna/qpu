// config/routes.rb. rails_admin:install mounts the engine at /admin. A generated resource is `resources :<plural>`.
import { quantumModels } from '../generators/index.ts'

export const routes = () => {
  const models = quantumModels()
  return {
    mount: { engine: 'RailsAdmin::Engine' as const, at: '/admin', as: 'rails_admin' as const },
    resources: models.map((model) => ({ resources: model.pluralName, namespace: model.module ? model.path.split('/').slice(2, -1) : [], table: model.table })),
  }
}
