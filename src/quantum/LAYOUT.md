# Layout

The folders and the generators. The generators are [`generators/index.ts`](generators/index.ts). The folder plugins are [`plugin.ts`](plugin.ts). The detailed specification is [`README.md`](README.md). The circuit layer is [`CIRQ.md`](CIRQ.md).

Names are lowercase and may use `_` or `-`. A directory's public surface is its `index.ts`, and that surface uses named exports. A test file is `*_test.ts`. Run one with `node --experimental-strip-types --test <file>`.

`plugins` is twelve folder plugins, one per directory: `app`, `apps`, `config`, `db`, `engine`, `generators`, `os`, `password`, `payload`, `processing`, `uuid`.

`tsconfig.json` excludes `src/quantum`. The website `package.json` is `payload-website` and does not export `@uuidna/qpu`. `src/payload.config.ts` does not mount this simulator, so there is no `/api/qpu/*` route.

`payload { generate }` answers the generators. An install, and a call that names none of the other kinds, returns `installApp`.

| Kind | What it returns |
|---|---|
| `install: true` | The files `rails new` writes, the models, and the admin mount. |
| `{ model: { name, namespace?, forcePlural? } }` | One model. A plural name is singularized. `cards` in namespace `apps` is `app/models/apps/card.ts`, table `apps_cards`. |
| `{ controller: { name, actions? } }` | One controller. A route is `get "<file>/<action>"` unless routes are skipped or there are no actions. |
| `{ railsAdmin: { action, on? } }` | The other side of a paired action. `on` defaults to `member`. |
| `{ validate }` | Online validation of the given ids, or of the undeveloped instances. Nothing is verified until the open dataset names the row. |

`installApp` names these paths:

- `app/models/application_record.ts`
- `app/models/concerns/.keep`
- `app/models/concerns/online_validation.ts`
- `app/controllers/application_controller.ts`
- `app/controllers/concerns/.keep`
- `app/jobs/application_job.ts`
- `app/mailers/application_mailer.ts`
- `app/helpers/application_helper.ts`
- `config/application.ts`
- `config/routes.ts`
- `config/initializers/rails_admin.ts`
- `db/migrate/.keep`

The autoload root is `app` and the glob is `{*,*/concerns}`. The admin engine mounts at `/admin`. The models this tree generates are `uuid`, `page`, `os` (kept plural), `engine`, `password`, and, under `apps`, `calculator`, `card`, and `chess`.

A model is a Payload collection. A concern is included into a model. A RailsAdmin member action and its bulk collection action share one authorization key. The pairs are `delete` with `bulk_delete` (`destroy`), `verify` with `bulk_verify` (`verify`), and `develop` with `bulk_develop` (`develop`). The collection side carries `bulk_ids`. An action that is not one of those pairs is `found: false`.

`app/mailers/application_mailer.ts` names `ApplicationMailer`. The first-user mail is Payload's forgot-password mail. The collections, access, and email adapter in `src/payload.config.ts` are the website API.
