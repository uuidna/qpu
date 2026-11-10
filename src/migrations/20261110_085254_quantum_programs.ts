import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`orders_runs\` (
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
  await db.run(sql`CREATE INDEX \`orders_runs_order_idx\` ON \`orders_runs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`orders_runs_parent_id_idx\` ON \`orders_runs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_runs_product_idx\` ON \`orders_runs\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_runs_variant_idx\` ON \`orders_runs\` (\`variant_id\`);`)
  await db.run(sql`CREATE TABLE \`_orders_v_version_runs\` (
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
  await db.run(sql`CREATE INDEX \`_orders_v_version_runs_order_idx\` ON \`_orders_v_version_runs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_orders_v_version_runs_parent_id_idx\` ON \`_orders_v_version_runs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_orders_v_version_runs_product_idx\` ON \`_orders_v_version_runs\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`_orders_v_version_runs_variant_idx\` ON \`_orders_v_version_runs\` (\`variant_id\`);`)
  await db.run(sql`ALTER TABLE \`variants\` ADD \`quantum_program\` text;`)
  await db.run(sql`ALTER TABLE \`variants\` ADD \`quantum_outcome\` text;`)
  await db.run(sql`ALTER TABLE \`variants\` ADD \`quantum_receipt\` text;`)
  await db.run(sql`ALTER TABLE \`_variants_v\` ADD \`version_quantum_program\` text;`)
  await db.run(sql`ALTER TABLE \`_variants_v\` ADD \`version_quantum_outcome\` text;`)
  await db.run(sql`ALTER TABLE \`_variants_v\` ADD \`version_quantum_receipt\` text;`)
  await db.run(sql`ALTER TABLE \`products\` ADD \`quantum_program\` text;`)
  await db.run(sql`ALTER TABLE \`products\` ADD \`quantum_outcome\` text;`)
  await db.run(sql`ALTER TABLE \`products\` ADD \`quantum_receipt\` text;`)
  await db.run(sql`ALTER TABLE \`_products_v\` ADD \`version_quantum_program\` text;`)
  await db.run(sql`ALTER TABLE \`_products_v\` ADD \`version_quantum_outcome\` text;`)
  await db.run(sql`ALTER TABLE \`_products_v\` ADD \`version_quantum_receipt\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`orders_runs\`;`)
  await db.run(sql`DROP TABLE \`_orders_v_version_runs\`;`)
  await db.run(sql`ALTER TABLE \`variants\` DROP COLUMN \`quantum_program\`;`)
  await db.run(sql`ALTER TABLE \`variants\` DROP COLUMN \`quantum_outcome\`;`)
  await db.run(sql`ALTER TABLE \`variants\` DROP COLUMN \`quantum_receipt\`;`)
  await db.run(sql`ALTER TABLE \`_variants_v\` DROP COLUMN \`version_quantum_program\`;`)
  await db.run(sql`ALTER TABLE \`_variants_v\` DROP COLUMN \`version_quantum_outcome\`;`)
  await db.run(sql`ALTER TABLE \`_variants_v\` DROP COLUMN \`version_quantum_receipt\`;`)
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`quantum_program\`;`)
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`quantum_outcome\`;`)
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`quantum_receipt\`;`)
  await db.run(sql`ALTER TABLE \`_products_v\` DROP COLUMN \`version_quantum_program\`;`)
  await db.run(sql`ALTER TABLE \`_products_v\` DROP COLUMN \`version_quantum_outcome\`;`)
  await db.run(sql`ALTER TABLE \`_products_v\` DROP COLUMN \`version_quantum_receipt\`;`)
}
