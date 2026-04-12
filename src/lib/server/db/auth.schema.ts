import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
	id: text().primaryKey(),
	name: text().notNull(),
	email: text().notNull().unique(),
	email_verified: integer({ mode: "boolean" }).default(false).notNull(),
	image: text(),
	created_at: integer({ mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updated_at: integer({ mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = sqliteTable(
	"session",
	{
		id: text().primaryKey(),
		expires_at: integer({ mode: "timestamp_ms" }).notNull(),
		token: text().notNull().unique(),
		created_at: integer({ mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updated_at: integer({ mode: "timestamp_ms" })
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ip_address: text(),
		user_agent: text(),
		user_id: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_user_id_idx").on(table.user_id)],
);

export const account = sqliteTable(
	"account",
	{
		id: text().primaryKey(),
		account_id: text().notNull(),
		provider_id: text().notNull(),
		user_id: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		access_token: text(),
		refresh_token: text(),
		id_token: text(),
		access_token_expires_at: integer("access_token_expires_at", {
			mode: "timestamp_ms",
		}),
		refresh_token_expires_at: integer("refresh_token_expires_at", {
			mode: "timestamp_ms",
		}),
		scope: text(),
		password: text(),
		created_at: integer({ mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updated_at: integer({ mode: "timestamp_ms" })
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_user_id_idx").on(table.user_id)],
);

export const verification = sqliteTable(
	"verification",
	{
		id: text().primaryKey(),
		identifier: text().notNull(),
		value: text().notNull(),
		expires_at: integer({ mode: "timestamp_ms" }).notNull(),
		created_at: integer({ mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updated_at: integer({ mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const user_relations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
}));

export const session_relations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.user_id],
		references: [user.id],
	}),
}));

export const account_relations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.user_id],
		references: [user.id],
	}),
}));
