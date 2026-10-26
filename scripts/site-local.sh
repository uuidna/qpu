#!/bin/sh
# The Payload app run locally against the MongoDB listening on this machine: a build-only secret, the local database; never the tenant's values.
export DATABASE_URI="${DATABASE_URI:-mongodb://127.0.0.1:27017/qpu-local}"
export PAYLOAD_SECRET="${PAYLOAD_SECRET:-local-build-not-a-secret}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}"
export QPU_ORIGIN="${QPU_ORIGIN:-https://qpu.uuidna.com}"
cd "$(dirname "$0")/../site" && exec pnpm "$@"
