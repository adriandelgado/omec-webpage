import type { Client, Row } from "@libsql/client";
import { error } from "@sveltejs/kit";
import type { AdminIdentity } from "../auth/sessions";
import { can_edit_article } from "../auth/permissions";
import { assert_actor, record_key, CONFLICT_MESSAGE } from "./content";
import { audit, select_one, transaction } from "./transactions";
import { definition, type Collection, type RecordData } from "./registry";

export function ordering_scope(name: Collection) {
	const fields = definition(name).fields.map((f) => f.name);
	return ["content_id", "national_olympiad_id", "card_number", "page_key", "placement"].filter(
		(f) => fields.includes(f),
	);
}
export async function reorder_content(
	client: Client,
	user: AdminIdentity,
	name: Collection,
	items: { key: RecordData; updated_at: number }[],
) {
	return transaction(client, async (tx) => {
		await assert_actor(tx, user, name !== "news_article");
		if (
			items.length < 2 ||
			items.length > 500 ||
			!definition(name).fields.some((f) => f.name === "sort_order")
		)
			error(400, "Orden inválido.");
		const rows: { row: Row; key: ReturnType<typeof record_key> }[] = [];
		const seen = new Set<string>();
		for (const item of items) {
			const key = record_key(name, item.key);
			const serialized = JSON.stringify(key.args);
			if (seen.has(serialized)) error(400, "Registro repetido.");
			seen.add(serialized);
			const row = await select_one(
				tx,
				'SELECT * FROM "' + name + '" WHERE ' + key.clause,
				key.args,
			);
			if (!row || row.archived_at !== null || Number(row.updated_at) !== item.updated_at)
				error(409, CONFLICT_MESSAGE);
			if (name === "news_article" && !can_edit_article(user, row.owner_id))
				error(403, "Solo puedes ordenar tus propias noticias.");
			rows.push({ row, key });
		}
		for (const field of ordering_scope(name))
			if (rows.some(({ row }) => row[field] !== rows[0].row[field]))
				error(400, "Ordena registros de la misma sección.");
		const positions = rows.map(({ row }) => Number(row.sort_order)).sort((a, b) => a - b);
		const maximum = await select_one(
			tx,
			'SELECT coalesce(max(sort_order), 0) AS maximum FROM "' + name + '"',
		);
		for (const [index, { key }] of rows.entries())
			await tx.execute({
				sql: 'UPDATE "' + name + '" SET sort_order = ? WHERE ' + key.clause,
				args: [Number(maximum?.maximum) + index + 1, ...key.args],
			});
		for (const [index, { key, row }] of rows.entries()) {
			const now = Math.max(Date.now(), Number(row.updated_at) + 1);
			await tx.execute({
				sql: 'UPDATE "' + name + '" SET sort_order = ?, updated_at = ? WHERE ' + key.clause,
				args: [positions[index], now, ...key.args],
			});
			await audit(tx, user.id, "reorder", name, JSON.stringify(key.args), row, {
				...row,
				sort_order: positions[index],
				updated_at: now,
			});
		}
		return { message: "Orden actualizado." };
	});
}
