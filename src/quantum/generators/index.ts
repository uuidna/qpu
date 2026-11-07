// The Rails generators, and RailsAdmin on top of them, as Payload answers them.
// `rails new` keeps app/models/concerns and app/controllers/concerns and writes ApplicationRecord (primary_abstract_class, no table).
// `rails generate model` singularizes a plural name, writes app/models/<file>.ts under ApplicationRecord, a migration, and a module file when the name is namespaced.
// A concern is not a generator target: the app generator only keeps the directory. Zeitwerk's glob `{*,*/concerns}` loads a model from app/models and a concern from the concerns directory one level under it.
// ActiveSupport::Concern: including a concern into a concern records a dependency; including it into a model includes those dependencies on the model, then extends the class methods and runs the included block there.
// RailsAdmin mounts at /admin. An action is root, collection (the model), or member (one instance). A bulkable collection action is the batch: it reads bulk_ids and runs the member action on each. The two keys differ so both can be registered; they share one authorization key (delete and bulk_delete share destroy; verify and bulk_verify share verify).

import { verifyIsoOnline } from '../processing/standards.ts'
import { PAYLOAD_SURFACE } from '../processing/payload-surface.ts'

const UNCOUNTABLE = ['equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'jeans', 'police']

/** Plural rules in the order ActiveSupport tries them: irregulars prepended last, then the frozen list from the bottom. */
const PLURALS: readonly [RegExp, string][] = [
  [/(z)ombies$/i, '$1ombies'], [/(z)ombie$/i, '$1ombies'],
  [/(m)oves$/i, '$1oves'], [/(m)ove$/i, '$1oves'],
  [/(s)exes$/i, '$1exes'], [/(s)ex$/i, '$1exes'],
  [/(c)hildren$/i, '$1hildren'], [/(c)hild$/i, '$1hildren'],
  [/(m)en$/i, '$1en'], [/(m)an$/i, '$1en'],
  [/(p)eople$/i, '$1eople'], [/(p)erson$/i, '$1eople'],
  [/(quiz)$/i, '$1zes'],
  [/^(oxen)$/i, '$1'], [/^(ox)$/i, '$1en'],
  [/^(m|l)ice$/i, '$1ice'], [/^(m|l)ouse$/i, '$1ice'],
  [/(matr|vert|ind)(?:ix|ex)$/i, '$1ices'],
  [/(x|ch|ss|sh)$/i, '$1es'],
  [/([^aeiouy]|qu)y$/i, '$1ies'],
  [/(hive)$/i, '$1s'],
  [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'],
  [/sis$/i, 'ses'],
  [/([ti])a$/i, '$1a'], [/([ti])um$/i, '$1a'],
  [/(buffal|tomat)o$/i, '$1oes'],
  [/(bu)s$/i, '$1ses'],
  [/(alias|status)$/i, '$1es'],
  [/(octop|vir)i$/i, '$1i'], [/(octop|vir)us$/i, '$1i'],
  [/^(ax|test)is$/i, '$1es'],
  [/s$/i, 's'],
  [/$/, 's'],
]

/** Singular rules in the order ActiveSupport tries them. */
const SINGULARS: readonly [RegExp, string][] = [
  [/(z)ombies$/i, '$1ombie'], [/(z)ombie$/i, '$1ombie'],
  [/(m)oves$/i, '$1ove'], [/(m)ove$/i, '$1ove'],
  [/(s)exes$/i, '$1ex'], [/(s)ex$/i, '$1ex'],
  [/(c)hildren$/i, '$1hild'], [/(c)hild$/i, '$1hild'],
  [/(m)en$/i, '$1an'], [/(m)an$/i, '$1an'],
  [/(p)eople$/i, '$1erson'], [/(p)erson$/i, '$1erson'],
  [/(database)s$/i, '$1'],
  [/(quiz)zes$/i, '$1'],
  [/(matr)ices$/i, '$1ix'],
  [/(vert|ind)ices$/i, '$1ex'],
  [/^(ox)en/i, '$1'],
  [/(alias|status)(es)?$/i, '$1'],
  [/(octop|vir)(us|i)$/i, '$1us'],
  [/^(a)x[ie]s$/i, '$1xis'],
  [/(cris|test)(is|es)$/i, '$1is'],
  [/(shoe)s$/i, '$1'],
  [/(o)es$/i, '$1'],
  [/(bus)(es)?$/i, '$1'],
  [/^(m|l)ice$/i, '$1ouse'],
  [/(x|ch|ss|sh)es$/i, '$1'],
  [/(m)ovies$/i, '$1ovie'],
  [/(s)eries$/i, '$1eries'],
  [/([^aeiouy]|qu)ies$/i, '$1y'],
  [/([lr])ves$/i, '$1f'],
  [/(tive)s$/i, '$1'],
  [/(hive)s$/i, '$1'],
  [/([^f])ves$/i, '$1fe'],
  [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1sis'],
  [/(^analy)(sis|ses)$/i, '$1sis'],
  [/([ti])a$/i, '$1um'],
  [/(n)ews$/i, '$1ews'],
  [/(ss)$/i, '$1'],
  [/s$/i, ''],
]

const uncountable = (word: string) => UNCOUNTABLE.some((w) => new RegExp(`(?:^|\\b)${w}$`, 'i').test(word))
const apply = (word: string, rules: readonly [RegExp, string][]) => {
  if (word.length === 0 || uncountable(word)) return word
  for (const [rule, replacement] of rules) if (rule.test(word)) return word.replace(rule, replacement)
  return word
}

/** ActiveSupport::Inflector.pluralize, the frozen English rules. */
const pluralize = (word: string) => apply(word, PLURALS)
/** ActiveSupport::Inflector.singularize, the frozen English rules. */
const singularize = (word: string) => apply(word, SINGULARS)
/** NamedBase#camelize: a path of underscored words becomes a class path. */
const camelize = (term: string) => term.split('/').map((part) => part.split('_').filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')).join('::')

const pluralModelName = (name: string) => name === pluralize(name) && singularize(name) !== pluralize(name)

type ModelAttribute = { name: string; type: string; index?: boolean; reference?: boolean }

/** `rails generate model`. A plural name is singularized unless forcePlural. A namespace writes the module file whose table_name_prefix is that path. */
export const generateModel = (input: { name: string; namespace?: string; forcePlural?: boolean; parent?: string; migration?: boolean; timestamps?: boolean; attributes?: readonly ModelAttribute[] }) => {
  const warnings: string[] = []
  let name = input.name
  if (!input.forcePlural && pluralModelName(name)) {
    const singular = singularize(name)
    warnings.push(`The model name '${name}' was recognized as a plural, using the singular '${singular}' instead. Override with forcePlural.`)
    name = singular
  }
  const classPath = (input.namespace ?? '').split('/').filter(Boolean)
  const pluralName = pluralize(name)
  const table = [...classPath, pluralName].join('_')
  const className = camelize([...classPath, name].join('/'))
  const parent = input.parent ?? 'ApplicationRecord'
  return {
    generator: 'active_record:model' as const,
    warnings,
    name,
    className,
    parent,
    abstract: false,
    table,
    pluralName,
    path: ['app/models', ...classPath, `${name}.ts`].join('/'),
    module: classPath.length === 0 ? null : { path: `app/models/${classPath.join('/')}.ts`, tableNamePrefix: `${classPath.join('_')}_` },
    migration: input.migration === false ? null : { generator: 'active_record:migration' as const, path: `db/migrate/create_${table}.ts`, table, timestamps: input.timestamps !== false, attributes: input.attributes ?? [] },
    collection: { slug: table },
    admin: true,
  }
}

/** `rails generate controller`. Routes are `get "<file>/<action>"` unless skipRoutes or there are no actions. */
const generateController = (name: string, actions: readonly string[] = [], options?: { skipRoutes?: boolean; parent?: string; namespace?: string }) => {
  const file = name.replace(/_?controller$/i, '')
  const classPath = (options?.namespace ?? '').split('/').filter(Boolean)
  return {
    generator: 'controller' as const,
    path: ['app/controllers', ...classPath, `${file}_controller.ts`].join('/'),
    className: `${camelize([...classPath, file].join('/'))}Controller`,
    parent: options?.parent ?? 'ApplicationController',
    actions: [...actions],
    routes: options?.skipRoutes || actions.length === 0 ? [] : actions.map((action) => `get "${[...classPath, file, action].join('/')}"`),
  }
}

type Concern = { name: string; dependencies: readonly string[]; classMethods: readonly string[]; instanceMethods: readonly string[]; macros: readonly string[] }
export type Host = { name: string; kind: 'model' | 'concern'; abstract: boolean; table: string | null; parent: string | null; dependencies: string[]; included: string[]; classMethods: string[]; instanceMethods: string[]; macros: string[] }

/** ActiveSupport::Concern#append_features. A concern records the dependency. A model receives the dependencies, the class methods, the instance methods, and the included macros. */
export const includeConcern = (host: Host, concern: Concern, all: Readonly<Record<string, Concern>>): Host => {
  if (host.kind === 'concern') {
    if (!host.dependencies.includes(concern.name)) host.dependencies.push(concern.name)
    return host
  }
  if (host.included.includes(concern.name)) return host
  for (const dep of concern.dependencies) { const other = all[dep]; if (other) includeConcern(host, other, all) }
  host.included.push(concern.name)
  for (const method of concern.classMethods) if (!host.classMethods.includes(method)) host.classMethods.push(method)
  for (const method of concern.instanceMethods) if (!host.instanceMethods.includes(method)) host.instanceMethods.push(method)
  for (const macro of concern.macros) if (!host.macros.includes(macro)) host.macros.push(macro)
  return host
}

/** The concern the app generator's kept directory holds. included runs on ApplicationRecord, so every concrete model validates online on every instance. verify is both the class method and the instance method. */
export const onlineValidation: Concern = {
  name: 'OnlineValidation',
  dependencies: [],
  classMethods: ['verify'],
  instanceMethods: ['verify'],
  macros: ['validates online every instance'],
}

const blankHost = (name: string, kind: 'model' | 'concern', extra: Partial<Host> = {}): Host => ({ name, kind, abstract: false, table: null, parent: null, dependencies: [], included: [], classMethods: [], instanceMethods: [], macros: [], ...extra })

/** `rails generate application_record`: primary_abstract_class, no table, the online-validation concern included. */
export const applicationRecord = (): Host => includeConcern(blankHost('ApplicationRecord', 'model', { abstract: true, parent: 'ActiveRecord::Base' }), onlineValidation, { OnlineValidation: onlineValidation })

/** Payload operation instances the four collection batch actions do not already cover. */
const undevelopedInstances = () => {
  const developed = new Set(['find', 'create', 'update', 'delete'])
  return (PAYLOAD_SURFACE.operations as readonly { name: string; scope: string; variant: string | null }[])
    .filter((op) => !(op.scope === 'collection' && op.variant == null && developed.has(op.name)))
    .map((op) => ({ id: op.variant ? `${op.scope}/${op.name}:${op.variant}` : `${op.scope}/${op.name}`, scope: op.scope, name: op.name, variant: op.variant }))
}

/** Payload validation verifies online every instance. Nothing is verified until the open dataset names the row. One instance is the next bulk id. */
export const validateOnline = (ids?: readonly string[]) => {
  const online = verifyIsoOnline()
  const rows = ids ?? undevelopedInstances().map((instance) => instance.id)
  const verified = online.phase === 'verified' && online.holds
  return {
    phase: 'validation' as const,
    macro: 'validates online every instance' as const,
    scope: ids ? 'given' as const : 'undeveloped' as const,
    every: rows.length,
    online,
    instances: rows.map((id) => ({ id, action: 'verify' as const, scope: 'member' as const, online, verified })),
  }
}

type AdminAction = { key: string; scope: 'root' | 'collection' | 'member'; bulkable: boolean; authorizationKey: string; http: readonly string[]; route: string }

/** The actions the install generator's initializer registers, plus verify and develop paired the way delete pairs with bulk_delete. */
export const ADMIN_ACTIONS: readonly AdminAction[] = [
  { key: 'dashboard', scope: 'root', bulkable: false, authorizationKey: 'dashboard', http: ['get'], route: '/admin' },
  { key: 'index', scope: 'collection', bulkable: false, authorizationKey: 'index', http: ['get', 'post'], route: '/admin/:model' },
  { key: 'new', scope: 'collection', bulkable: false, authorizationKey: 'new', http: ['get', 'post'], route: '/admin/:model/new' },
  { key: 'export', scope: 'collection', bulkable: true, authorizationKey: 'export', http: ['get', 'post'], route: '/admin/:model/export' },
  { key: 'bulk_delete', scope: 'collection', bulkable: true, authorizationKey: 'destroy', http: ['post', 'delete'], route: '/admin/:model/bulk_delete' },
  { key: 'show', scope: 'member', bulkable: false, authorizationKey: 'show', http: ['get'], route: '/admin/:model/:id' },
  { key: 'edit', scope: 'member', bulkable: false, authorizationKey: 'edit', http: ['get', 'put'], route: '/admin/:model/:id/edit' },
  { key: 'delete', scope: 'member', bulkable: false, authorizationKey: 'destroy', http: ['get', 'delete'], route: '/admin/:model/:id/delete' },
  { key: 'show_in_app', scope: 'member', bulkable: false, authorizationKey: 'show_in_app', http: ['get'], route: '/admin/:model/:id/show_in_app' },
  { key: 'verify', scope: 'member', bulkable: false, authorizationKey: 'verify', http: ['get', 'post'], route: '/admin/:model/:id/verify' },
  { key: 'bulk_verify', scope: 'collection', bulkable: true, authorizationKey: 'verify', http: ['post'], route: '/admin/:model/bulk_verify' },
  { key: 'develop', scope: 'member', bulkable: false, authorizationKey: 'develop', http: ['get', 'post'], route: '/admin/:model/:id/develop' },
  { key: 'bulk_develop', scope: 'collection', bulkable: true, authorizationKey: 'develop', http: ['post'], route: '/admin/:model/bulk_develop' },
]

const PAIRS = [
  { member: 'delete', collection: 'bulk_delete', authorizationKey: 'destroy' },
  { member: 'verify', collection: 'bulk_verify', authorizationKey: 'verify' },
  { member: 'develop', collection: 'bulk_develop', authorizationKey: 'develop' },
] as const

/** One action asked on the member or the collection. The other side is the answer. A collection side is the bulk action and carries bulk_ids. Both sides share the authorization key. */
export const railsAdminAction = (action: string, on: 'member' | 'collection') => {
  const pair = PAIRS.find((p) => p.member === action || p.collection === action || p.authorizationKey === action)
  if (!pair) return { phase: 'rails-admin' as const, found: false as const, action, on }
  const member = ADMIN_ACTIONS.find((a) => a.key === pair.member)!
  const collection = ADMIN_ACTIONS.find((a) => a.key === pair.collection)!
  const asked = on === 'member' ? member : collection
  const answers = on === 'member' ? collection : member
  return { phase: 'rails-admin' as const, found: true as const, from: on, to: on === 'member' ? 'collection' as const : 'member' as const, authorizationKey: pair.authorizationKey, member, collection, asked, answers, instances: 'bulk_ids' as const }
}

/** The models `rails new` then `rails generate model` would write for this tree. `os` is kept with forcePlural: the generator would otherwise singularize it to `o`. `cards` is singularized to `card`. */
export const quantumModels = () => [
  generateModel({ name: 'uuid' }),
  generateModel({ name: 'page' }),
  generateModel({ name: 'os', forcePlural: true }),
  generateModel({ name: 'engine' }),
  generateModel({ name: 'password' }),
  generateModel({ name: 'calculator', namespace: 'apps' }),
  generateModel({ name: 'cards', namespace: 'apps' }),
  generateModel({ name: 'chess', namespace: 'apps' }),
]

/** `rails new` plus `rails_admin:install`. Concerns stay a directory. The admin mounts at /admin and registers the actions. */
export const installApp = () => ({
  phase: 'install' as const,
  generators: ['app', 'active_record:application_record', 'rails_admin:install'] as const,
  autoload: { root: 'app', glob: '{*,*/concerns}' as const, models: 'app/models', concerns: 'app/models/concerns' },
  paths: [
    'app/models/application_record.ts',
    'app/models/concerns/.keep',
    'app/models/concerns/online_validation.ts',
    'app/controllers/application_controller.ts',
    'app/controllers/concerns/.keep',
    'app/jobs/application_job.ts',
    'app/mailers/application_mailer.ts',
    'app/helpers/application_helper.ts',
    'config/application.ts',
    'config/routes.ts',
    'config/initializers/rails_admin.ts',
    'db/migrate/.keep',
  ],
  mount: { engine: 'RailsAdmin::Engine' as const, at: '/admin', as: 'rails_admin' as const },
  record: applicationRecord(),
  actions: ADMIN_ACTIONS,
  models: quantumModels(),
})

type GenerateArgs = { model?: { name?: string; namespace?: string; forcePlural?: boolean }; controller?: { name?: string; actions?: readonly string[] }; railsAdmin?: { action?: string; on?: 'member' | 'collection' }; install?: boolean; validate?: { ids?: readonly string[] } | true }

/** The payload door. install is the new app. model and controller are the generators. railsAdmin is one action from member to collection or back. validate verifies online every instance. */
export const generate = (args: GenerateArgs) => {
  if (args.install) return installApp()
  if (args.model && typeof args.model.name === 'string') return { phase: 'generate' as const, ...generateModel({ name: args.model.name, namespace: args.model.namespace, forcePlural: args.model.forcePlural }) }
  if (args.controller && typeof args.controller.name === 'string') return { phase: 'generate' as const, ...generateController(args.controller.name, args.controller.actions ?? []) }
  if (args.railsAdmin && typeof args.railsAdmin.action === 'string') return railsAdminAction(args.railsAdmin.action, args.railsAdmin.on === 'collection' ? 'collection' : 'member')
  if (args.validate) return validateOnline(args.validate === true ? undefined : args.validate.ids)
  return installApp()
}

export { generatorsPlugin as plugin } from '../plugin.ts'
