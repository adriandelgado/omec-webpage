import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

const default_timestamp_ms = sql`(cast(unixepoch('subsecond') * 1000 as integer))`;

export const contact_submission = sqliteTable(
	"contact_submission",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		full_name: text().notNull(),
		email: text().notNull(),
		institution: text().notNull(),
		subject: text().notNull(),
		message: text().notNull(),
		created_at: integer({ mode: "timestamp_ms" }).default(default_timestamp_ms).notNull(),
	},
	(table) => [index("contact_submission_email_idx").on(table.email)],
);

export const user = sqliteTable("user", {
	id: text().primaryKey(),
	email: text().notNull().unique(),
	password_hash: text().notNull(),
	full_name: text().notNull(),
	email_verified_at: integer({ mode: "timestamp_ms" }),
	last_password_changed_at: integer({ mode: "timestamp_ms" })
		.default(default_timestamp_ms)
		.notNull(),
	created_at: integer({ mode: "timestamp_ms" }).default(default_timestamp_ms).notNull(),
	updated_at: integer({ mode: "timestamp_ms" }).default(default_timestamp_ms).notNull(),
});

export const session = sqliteTable(
	"session",
	{
		id: text().primaryKey(),
		user_id: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		expires_at: integer({ mode: "timestamp_ms" }).notNull(),
		remember_me: integer({ mode: "boolean" }).default(false).notNull(),
		user_agent: text(),
		ip_address: text(),
		device_label: text(),
		last_seen_at: integer({ mode: "timestamp_ms" }),
		revoked_at: integer({ mode: "timestamp_ms" }),
		revocation_reason: text(),
		created_at: integer({ mode: "timestamp_ms" }).default(default_timestamp_ms).notNull(),
		updated_at: integer({ mode: "timestamp_ms" }).default(default_timestamp_ms).notNull(),
	},
	(table) => [
		index("session_user_id_idx").on(table.user_id),
		index("session_expires_at_idx").on(table.expires_at),
		index("session_revoked_at_idx").on(table.revoked_at),
	],
);

export const role = sqliteTable("role", {
	id: integer().primaryKey({ autoIncrement: true }),
	key: text().notNull().unique(),
	label: text().notNull(),
	description: text(),
	created_at: integer({ mode: "timestamp_ms" }).default(default_timestamp_ms).notNull(),
	updated_at: integer({ mode: "timestamp_ms" }).default(default_timestamp_ms).notNull(),
});

export const permission = sqliteTable("permission", {
	id: integer().primaryKey({ autoIncrement: true }),
	key: text().notNull().unique(),
	description: text(),
	created_at: integer({ mode: "timestamp_ms" }).default(default_timestamp_ms).notNull(),
	updated_at: integer({ mode: "timestamp_ms" }).default(default_timestamp_ms).notNull(),
});

export const user_role = sqliteTable(
	"user_role",
	{
		user_id: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role_id: integer()
			.notNull()
			.references(() => role.id, { onDelete: "cascade" }),
		created_at: integer({ mode: "timestamp_ms" }).default(default_timestamp_ms).notNull(),
	},
	(table) => [primaryKey({ columns: [table.user_id, table.role_id] })],
);

export const role_permission = sqliteTable(
	"role_permission",
	{
		role_id: integer()
			.notNull()
			.references(() => role.id, { onDelete: "cascade" }),
		permission_id: integer()
			.notNull()
			.references(() => permission.id, { onDelete: "cascade" }),
		created_at: integer({ mode: "timestamp_ms" }).default(default_timestamp_ms).notNull(),
	},
	(table) => [primaryKey({ columns: [table.role_id, table.permission_id] })],
);
