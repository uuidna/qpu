// config/application.rb as `rails new` writes it. The autoload glob is what makes concerns concerns: `{*,*/concerns}` under app.
export const application = { loadDefaults: true, autoload: { root: 'app', glob: '{*,*/concerns}' }, autoloadLibIgnore: ['assets', 'tasks'] }
