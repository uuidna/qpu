import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

const add = async (db: MigrateUpArgs['db'], statement: ReturnType<typeof sql>) => {
  try {
    await db.run(statement)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!/duplicate column name/i.test(message)) throw error
  }
}

const up = async ({ db }: MigrateUpArgs): Promise<void> => {
  await add(db, sql`ALTER TABLE \`products\` ADD COLUMN \`price_in_e_u_r_enabled\` integer`)
  await add(db, sql`ALTER TABLE \`products\` ADD COLUMN \`price_in_e_u_r\` numeric`)
  await add(db, sql`ALTER TABLE \`products\` ADD COLUMN \`price_in_b_g_n_enabled\` integer`)
  await add(db, sql`ALTER TABLE \`products\` ADD COLUMN \`price_in_b_g_n\` numeric`)
  await add(db, sql`ALTER TABLE \`variants\` ADD COLUMN \`price_in_e_u_r_enabled\` integer`)
  await add(db, sql`ALTER TABLE \`variants\` ADD COLUMN \`price_in_e_u_r\` numeric`)
  await add(db, sql`ALTER TABLE \`variants\` ADD COLUMN \`price_in_b_g_n_enabled\` integer`)
  await add(db, sql`ALTER TABLE \`variants\` ADD COLUMN \`price_in_b_g_n\` numeric`)
  await add(db, sql`ALTER TABLE \`_products_v\` ADD COLUMN \`version_price_in_e_u_r_enabled\` integer`)
  await add(db, sql`ALTER TABLE \`_products_v\` ADD COLUMN \`version_price_in_e_u_r\` numeric`)
  await add(db, sql`ALTER TABLE \`_products_v\` ADD COLUMN \`version_price_in_b_g_n_enabled\` integer`)
  await add(db, sql`ALTER TABLE \`_products_v\` ADD COLUMN \`version_price_in_b_g_n\` numeric`)
  await add(db, sql`ALTER TABLE \`_variants_v\` ADD COLUMN \`version_price_in_e_u_r_enabled\` integer`)
  await add(db, sql`ALTER TABLE \`_variants_v\` ADD COLUMN \`version_price_in_e_u_r\` numeric`)
  await add(db, sql`ALTER TABLE \`_variants_v\` ADD COLUMN \`version_price_in_b_g_n_enabled\` integer`)
  await add(db, sql`ALTER TABLE \`_variants_v\` ADD COLUMN \`version_price_in_b_g_n\` numeric`)
}

const down = async (_args: MigrateDownArgs): Promise<void> => {}

export { up, down }
