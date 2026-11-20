// The storage adapters. The order is the port order.

import { PROSE } from '../../processing/prose-index.ts'
export type StorageAdapter = {
  pkg: string
  fn: string
  needs: readonly string[]
  provider: string
  binding: string | null
  free: string
  cloudflare: {
    port: string
    bindings: Record<string, unknown>
    steps: string[]
    mcp: { tool: string; write: boolean; says: string }[]
    plan: string
    missing: string[]
    docs: string[]
  }
}

export const STORAGE: readonly StorageAdapter[] = [
  {
    "pkg": "storage-vercel-blob",
    "fn": "vercelBlobStorage",
    "needs": [
      "BLOB_READ_WRITE_TOKEN"
    ],
    "provider": "vercel",
    "binding": null,
    "free": "1 GB",
    "cloudflare": {
      "port": "r2",
      "bindings": {
        "r2_buckets": [
          {
            "binding": "R2"
          }
        ]
      },
      "steps": [
        "the R2 bucket created",
        PROSE.quantumNetStorageIndex_s1,
        "r2Storage({ bucket: env.R2 })"
      ],
      "mcp": [
        {
          "tool": "r2_buckets_list",
          "write": false,
          "says": "whether the bucket exists"
        },
        {
          "tool": "r2_bucket_create",
          "write": true,
          "says": PROSE.quantumNetStorageIndex_s2
        }
      ],
      "plan": "free",
      "missing": [
        PROSE.quantumNetStorageIndex_s3
      ],
      "docs": [
        "https://developers.cloudflare.com/r2/data-migration/"
      ]
    }
  },
  {
    "pkg": "storage-r2",
    "fn": "r2Storage",
    "needs": [
      "R2 (a Cloudflare binding)"
    ],
    "provider": "cloudflare",
    "binding": "R2",
    "free": "10 GB, no egress fee",
    "cloudflare": {
      "port": "native",
      "bindings": {
        "r2_buckets": [
          {
            "binding": "R2"
          }
        ]
      },
      "steps": [
        "the R2 bucket created",
        "r2Storage({ bucket: env.R2 })"
      ],
      "mcp": [
        {
          "tool": "r2_buckets_list",
          "write": false,
          "says": "whether the bucket exists"
        },
        {
          "tool": "r2_bucket_create",
          "write": true,
          "says": PROSE.quantumNetStorageIndex_s2
        }
      ],
      "plan": "free",
      "missing": [],
      "docs": [
        "https://developers.cloudflare.com/r2/"
      ]
    }
  },
  {
    "pkg": "storage-s3",
    "fn": "s3Storage",
    "needs": [
      "S3_BUCKET",
      "S3_ACCESS_KEY_ID",
      "S3_SECRET_ACCESS_KEY",
      "S3_REGION"
    ],
    "provider": "aws",
    "binding": null,
    "free": "5 GB a year",
    "cloudflare": {
      "port": "r2",
      "bindings": {
        "r2_buckets": [
          {
            "binding": "R2"
          }
        ]
      },
      "steps": [
        "the R2 bucket created",
        PROSE.quantumNetStorageIndex_s4,
        "r2Storage({ bucket: env.R2 })"
      ],
      "mcp": [
        {
          "tool": "r2_buckets_list",
          "write": false,
          "says": "whether the bucket exists"
        },
        {
          "tool": "r2_bucket_create",
          "write": true,
          "says": PROSE.quantumNetStorageIndex_s2
        }
      ],
      "plan": "free",
      "missing": [
        PROSE.quantumNetStorageIndex_s5
      ],
      "docs": [
        "https://developers.cloudflare.com/r2/data-migration/super-slurper/",
        "https://developers.cloudflare.com/r2/data-migration/sippy/"
      ]
    }
  },
  {
    "pkg": "storage-gcs",
    "fn": "gcsStorage",
    "needs": [
      "GCS_BUCKET",
      "GCS_PROJECT_ID"
    ],
    "provider": "google-cloud",
    "binding": null,
    "free": "5 GB",
    "cloudflare": {
      "port": "r2",
      "bindings": {
        "r2_buckets": [
          {
            "binding": "R2"
          }
        ]
      },
      "steps": [
        "the R2 bucket created",
        PROSE.quantumNetStorageIndex_s6,
        "r2Storage({ bucket: env.R2 })"
      ],
      "mcp": [
        {
          "tool": "r2_buckets_list",
          "write": false,
          "says": "whether the bucket exists"
        },
        {
          "tool": "r2_bucket_create",
          "write": true,
          "says": PROSE.quantumNetStorageIndex_s2
        }
      ],
      "plan": "free",
      "missing": [
        PROSE.quantumNetStorageIndex_s5
      ],
      "docs": [
        "https://developers.cloudflare.com/r2/data-migration/sippy/"
      ]
    }
  },
  {
    "pkg": "storage-azure",
    "fn": "azureStorage",
    "needs": [
      "AZURE_STORAGE_CONNECTION_STRING",
      "AZURE_STORAGE_CONTAINER_NAME"
    ],
    "provider": "azure",
    "binding": null,
    "free": "5 GB a year",
    "cloudflare": {
      "port": "r2",
      "bindings": {
        "r2_buckets": [
          {
            "binding": "R2"
          }
        ]
      },
      "steps": [
        "the R2 bucket created",
        PROSE.quantumNetStorageIndex_s7,
        "r2Storage({ bucket: env.R2 })"
      ],
      "mcp": [
        {
          "tool": "r2_buckets_list",
          "write": false,
          "says": "whether the bucket exists"
        },
        {
          "tool": "r2_bucket_create",
          "write": true,
          "says": PROSE.quantumNetStorageIndex_s2
        }
      ],
      "plan": "free",
      "missing": [
        PROSE.quantumNetStorageIndex_s8
      ],
      "docs": [
        "https://developers.cloudflare.com/r2/data-migration/sippy/"
      ]
    }
  }
]
