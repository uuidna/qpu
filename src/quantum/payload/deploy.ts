/** The deploy stages, in the order the workflow runs them. Lean writes the site, Cloudflare receives the Worker that serves it beside /api/mcp. */
import { PROSE } from '../processing/prose-index.ts'
import { TENANTS } from '../processing/unit/tenants.ts'

export type DeployStage = { id: string; says: string; run: string; block?: boolean }

const hosts = Object.keys(TENANTS)
const smoke = `fail=0
for host in ${hosts.join(' ')}
do
  site=$(curl -sS -o /dev/null -w '%{http_code}' -A 'Mozilla/5.0' --max-time 30 "https://$host/")
  mcp=$(curl -sS -o /dev/null -w '%{http_code}' -A 'Mozilla/5.0' --max-time 30 "https://$host/api/mcp")
  echo "site $site mcp $mcp $host"
  if [ "$site" != "200" ] || [ "$mcp" != "200" ]; then fail=1; fi
done
exit "$fail"`

const logs = `from=$(( $(date +%s%3N) - 900000 ))
to=$(date +%s%3N)
status=$(curl -sS -o /tmp/qpu-obs.json -w '%{http_code}' -X POST \\
  "https://api.cloudflare.com/client/v4/accounts/\${CLOUDFLARE_ACCOUNT_ID}/workers/observability/telemetry/query" \\
  -H "Authorization: Bearer \${CLOUDFLARE_API_TOKEN}" \\
  -H "Content-Type: application/json" \\
  --data "{\\"queryId\\":\\"qpu-deploy\\",\\"timeframe\\":{\\"from\\":\${from},\\"to\\":\${to}},\\"view\\":\\"events\\",\\"limit\\":5,\\"parameters\\":{\\"datasets\\":[\\"cloudflare-workers\\"],\\"filters\\":[{\\"key\\":\\"\\$metadata.service\\",\\"operation\\":\\"eq\\",\\"type\\":\\"string\\",\\"value\\":\\"qpu\\"}]}}")
OBS_STATUS="$status" python3 -c 'import json,os,sys; status=os.environ["OBS_STATUS"]; body=json.load(open("/tmp/qpu-obs.json")); result=body.get("result") or {}; events=result.get("events"); events=events.get("events") if isinstance(events, dict) else events; print("observability", status, "events", len(events) if isinstance(events, list) else "none"); sys.exit(0 if status=="200" and body.get("success") is True and isinstance(events, list) else 1)'`

export const DEPLOY_STAGES: readonly DeployStage[] = [
  { id: 'worker', run: 'pnpm run deploy', says: PROSE.quantumPayloadDeploy_says1 },
  { id: 'smoke', run: smoke, says: PROSE.quantumPayloadDeploy_says2, block: true },
  { id: 'logs', run: logs, says: 'query Worker logs', block: true },
]

/** The command package.json `deploy` runs: Lean writes the site, then Wrangler deploys the Worker. */
export const deployCommand = () => 'lake run site && wrangler deploy'
