// config/initializers/rails_admin.rb from rails_admin:install, plus the verify and develop pairs.
// A member action is one instance. Its bulk collection action is the batch, authorized by the same key, and bulk_ids are the instances.
export { installApp, railsAdminAction, ADMIN_ACTIONS as actions } from '../../generators/index.ts'
