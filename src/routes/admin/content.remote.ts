import { query, command } from "$app/server";
import * as v from "valibot";
import { client } from "#lib/server/db/index.js";
import { require_user } from "#lib/server/auth/authorization.js";
import {
	COLLECTION_SCHEMA,
	COLLECTIONS,
	RECORD_SCHEMA,
	definition,
	type RecordData,
} from "#lib/server/cms/registry.js";
import { mutate_content } from "#lib/server/cms/content.js";
import { error } from "@sveltejs/kit";
import { reorder_content } from "#lib/server/cms/ordering.js";
export const reference_options = query(COLLECTION_SCHEMA, async (collection) => {
	const { user } = await require_user({ content: collection !== "news_article" });
	const options: Record<string, { value: string | number; label: string }[]> = {};
	if (collection === "news_article") {
		const rows = await client.execute({
			sql:
				"SELECT id, name, email FROM admin_user WHERE suspended_at IS NULL" +
				(user.role === "editor" ? " AND id = ?" : "") +
				" ORDER BY name",
			args: user.role === "editor" ? [user.id] : [],
		});
		options.owner_id = rows.rows.map((r) => ({
			value: String(r.id),
			label: String(r.name) + " · " + String(r.email),
		}));
	}
	const relations = {
		national_olympiad_id: ["national_olympiad", "id", "title"],
		sponsor_id: ["sponsor", "id", "name"],
		team_member_id: ["team_member", "id", "name"],
		card_number: ["about_value_card", "number", "title"],
	};
	for (const [field, [table, key, label]] of Object.entries(relations)) {
		if (!definition(collection).fields.some((f) => f.name === field)) continue;
		const rows = await client.execute(
			'SELECT "' +
				key +
				'" AS value, "' +
				label +
				'" AS label FROM "' +
				table +
				'" WHERE archived_at IS NULL',
		);
		options[field] = rows.rows.map((r) => ({
			value: typeof r.value === "number" ? r.value : String(r.value),
			label: String(r.label),
		}));
	}
	return options;
});

export const reorder = command(
	v.object({
		collection: COLLECTION_SCHEMA,
		items: v.pipe(
			v.array(
				v.object({
					key: RECORD_SCHEMA,
					updated_at: v.pipe(v.number(), v.integer(), v.minValue(0)),
				}),
			),
			v.minLength(2),
			v.maxLength(500),
		),
	}),
	async ({ collection, items }) => {
		const { user } = await require_user({ content: collection !== "news_article" });
		return reorder_content(client, user, collection, items);
	},
);

export const dashboard = query(async () => {
	const { user } = await require_user();
	const drafts = await client.execute({
		sql:
			"SELECT count(*) AS count FROM news_article WHERE status = 'draft' AND archived_at IS NULL" +
			(user.role === "editor" ? " AND owner_id = ?" : ""),
		args: user.role === "editor" ? [user.id] : [],
	});
	const unread =
		user.role === "editor"
			? null
			: await client.execute(
					"SELECT count(*) AS count FROM contact_submission WHERE status = 'unread'",
				);
	const activity =
		user.role === "superadmin"
			? (
					await client.execute(
						"SELECT action, entity_type, created_at FROM audit_event ORDER BY id DESC LIMIT 10",
					)
				).rows
			: [];
	return {
		user,
		drafts: Number(drafts.rows[0].count),
		unread: Number(unread?.rows[0].count ?? 0),
		activity: activity.map((r) => ({
			action: String(r.action),
			entity_type: String(r.entity_type),
			created_at: Number(r.created_at),
		})),
		collections: Object.entries(COLLECTIONS)
			.filter(([key]) => user.role !== "editor" || key === "news_article")
			.map(([key, label]) => ({ key, label })),
	};
});
export const list_content = query(
	v.object({
		collection: COLLECTION_SCHEMA,
		search: v.optional(v.pipe(v.string(), v.maxLength(200)), ""),
		archived: v.optional(v.boolean(), false),
		status: v.optional(v.picklist(["all", "unread", "read", "archived", "spam"]), "all"),
	}),
	async ({ collection, search, archived, status }) => {
		const { user } = await require_user({ content: collection !== "news_article" });
		const def = definition(collection);
		const conditions: string[] = [];
		const args: (string | number)[] = [];
		if (!def.singleton && collection !== "contact_submission")
			conditions.push("archived_at IS " + (archived ? "NOT NULL" : "NULL"));
		if (user.role === "editor") {
			conditions.push("owner_id = ?");
			args.push(user.id);
		}
		if (collection === "contact_submission" && status !== "all") {
			conditions.push("status = ?");
			args.push(status);
		}
		if (search) {
			conditions.push(
				"(" +
					def.fields
						.filter((f) => !f.numeric)
						.map((f) => '"' + f.name + '" LIKE ?')
						.join(" OR ") +
					")",
			);
			args.push(...def.fields.filter((f) => !f.numeric).map(() => "%" + search + "%"));
		}
		const result = await client.execute({
			sql:
				'SELECT * FROM "' +
				collection +
				'"' +
				(conditions.length ? " WHERE " + conditions.join(" AND ") : "") +
				(def.fields.some((f) => f.name === "sort_order")
					? " ORDER BY sort_order"
					: " ORDER BY updated_at DESC") +
				" LIMIT 500",
			args,
		});
		return { definition: def, user, rows: result.rows as unknown as RecordData[] };
	},
);
export const save_content = command(
	v.object({
		collection: COLLECTION_SCHEMA,
		key: RECORD_SCHEMA,
		updated_at: v.nullable(v.pipe(v.number(), v.integer(), v.minValue(0))),
		data: RECORD_SCHEMA,
		action: v.picklist(["save", "create", "archive", "restore"]),
	}),
	async (input) => {
		const { user } = await require_user({ content: input.collection !== "news_article" });
		try {
			return await mutate_content(client, user, input);
		} catch (cause) {
			if (cause && typeof cause === "object" && "status" in cause) throw cause;
			error(400, "No se pudo guardar. Revisa identificadores, relaciones y posiciones duplicadas.");
		}
	},
);
