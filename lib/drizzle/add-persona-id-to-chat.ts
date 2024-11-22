import { sql } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export async function up(db: PostgresJsDatabase) {
  await db.execute(
    sql`ALTER TABLE Chat ADD COLUMN personaId text`
  );
}

export async function down(db: PostgresJsDatabase) {
  await db.execute(
    sql`ALTER TABLE Chat DROP COLUMN personaId`
  );
}
