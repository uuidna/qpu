/** The deploy stages, in the order the workflow runs them. One Payload session writes every seed wave. Cloudflare receives the Worker. */
import { TENANTS } from '../processing/unit/tenants.ts'

export type DeployStage = { id: string; says: string; run: string; block?: boolean }

const adminUrls = Object.keys(TENANTS).flatMap((host) => [`https://${host}/admin`, `https://${host}/admin/login`])
const smoke = `fail=0
for url in \\
${adminUrls.map((url, index) => `  ${url}${index === adminUrls.length - 1 ? '' : ' \\'}`).join('\n')}
do
  code=$(curl -sS -o /dev/null -w '%{http_code}' -A 'Mozilla/5.0' --max-time 30 "$url")
  echo "$code $url"
  if [ "$code" != "200" ]; then fail=1; fi
done
exit "$fail"`

const logs = `from=$(( $(date +%s%3N) - 900000 ))
to=$(date +%s%3N)
status=$(curl -sS -o /tmp/qpu-obs.json -w '%{http_code}' -X POST \\
  "https://api.cloudflare.com/client/v4/accounts/\${CLOUDFLARE_ACCOUNT_ID}/workers/observability/telemetry/query" \\
  -H "Authorization: Bearer \${CLOUDFLARE_API_TOKEN}" \\
  -H "Content-Type: application/json" \\
  --data "{\\"queryId\\":\\"qpu-deploy\\",\\"timeframe\\":{\\"from\\":\${from},\\"to\\":\${to}},\\"view\\":\\"events\\",\\"limit\\":5,\\"parameters\\":{\\"datasets\\":[\\"cloudflare-workers\\"],\\"filters\\":[{\\"key\\":\\"\\$metadata.service\\",\\"operation\\":\\"eq\\",\\"type\\":\\"string\\",\\"value\\":\\"qpu\\"}]}}")
OBS_STATUS="$status" python3 -c 'import json,os,sys; status=os.environ["OBS_STATUS"]; body=json.load(open("/tmp/qpu-obs.json")); result=body.get("result") or {}; events=result.get("events"); print("observability", status, "events", len(events) if isinstance(events, list) else 0); sys.exit(0 if status=="200" and body.get("success") is True and isinstance(events, list) else 1)'`

export const DEPLOY_STAGES: readonly DeployStage[] = [
  { id: 'database', run: 'pnpm run deploy:database', says: 'Payload migrate, then the D1 optimize' },
  { id: 'seed', run: 'cross-env NODE_ENV=production pnpm run seed', says: 'Payload writes one wave, then the next, in one session' },
  { id: 'check', run: 'cross-env NODE_ENV=production pnpm run seed:check', says: 'Payload reads the pages back and deploy is allowed when they agree' },
  { id: 'app', run: 'pnpm run deploy:app', says: 'OpenNext builds the Payload app and deploys the Worker' },
  { id: 'smoke', run: smoke, says: 'smoke the admin on both hostnames', block: true },
  { id: 'logs', run: logs, says: 'query Worker logs', block: true },
]

/** The single-line stages, in order. package.json `deploy` is this command. The block stages stay in the workflow. */
export const deployCommand = () => DEPLOY_STAGES.filter((stage) => !stage.block).map((stage) => stage.run).join(' && ')
