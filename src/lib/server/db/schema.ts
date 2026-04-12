import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contact_submission = sqliteTable(
	"contact_submission",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		full_name: text().notNull(),
		email: text().notNull(),
		institution: text().notNull(),
		subject: text().notNull(),
		message: text().notNull(),
		created_at: integer({ mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [index("contact_submission_email_idx").on(table.email)],
);

export * from "./auth.schema";
