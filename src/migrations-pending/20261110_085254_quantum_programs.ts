import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/** Incremental quantum run fields. No-ops when ecommerce base tables are absent (prod website D1). */
const hasProducts = async (db: MigrateUpArgs['db']): Promise<boolean> => {
  const result = await db.run(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'products' LIMIT 1`,
  )
  const rows = (result as { results?: unknown[] } | undefined)?.results
  return Array.isArray(rows) && rows.length > 0
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  if (!(await hasProducts(db))) return

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`orders_runs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	\`product_id\` integer,
  	\`variant_id\` integer,
  	\`program\` text,
  	\`outcome\` text,
  	\`receipt\` text,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`variant_id\`) REFERENCES \`variants\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`orders_runs_order_idx\` ON \`orders_runs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`orders_runs_parent_id_idx\` ON \`orders_runs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`orders_runs_product_idx\` ON \`orders_runs\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`orders_runs_variant_idx\` ON \`orders_runs\` (\`variant_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_orders_v_version_runs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`item\` text,
  	\`product_id\` integer,
  	\`variant_id\` integer,
  	\`program\` text,
  	\`outcome\` text,
  	\`receipt\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`variant_id\`) REFERENCES \`variants\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_orders_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_orders_v_version_runs_order_idx\` ON \`_orders_v_version_runs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_orders_v_version_runs_parent_id_idx\` ON \`_orders_v_version_runs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_orders_v_version_runs_product_idx\` ON \`_orders_v_version_runs\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_orders_v_version_runs_variant_idx\` ON \`_orders_v_version_runs\` (\`variant_id\`);`)

  const alters = [
    sql`ALTER TABLE \`variants\` ADD \`quantum_program\` text;`,
    sql`ALTER TABLE \`variants\` ADD \`quantum_outcome\` text;`,
    sql`ALTER TABLE \`variants\` ADD \`quantum_receipt\` text;`,
    sql`ALTER TABLE \`_variants_v\` ADD \`version_quantum_program\` text;`,
    sql`ALTER TABLE \`_variants_v\` ADD \`version_quantum_outcome\` text;`,
    sql`ALTER TABLE \`_variants_v\` ADD \`version_quantum_receipt\` text;`,
    sql`ALTER TABLE \`products\` ADD \`quantum_program\` text;`,
    sql`ALTER TABLE \`products\` ADD \`quantum_outcome\` text;`,
    sql`ALTER TABLE \`products\` ADD \`quantum_receipt\` text;`,
    sql`ALTER TABLE \`_products_v\` ADD \`version_quantum_program\` text;`,
    sql`ALTER TABLE \`_products_v\` ADD \`version_quantum_outcome\` text;`,
    sql`ALTER TABLE \`_products_v\` ADD \`version_quantum_receipt\` text;`,
  ]
  for (const statement of alters) {
    try {
      await db.run(statement)
    } catch {
      // column already present
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`orders_runs\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_orders_v_version_runs\`;`)
}
