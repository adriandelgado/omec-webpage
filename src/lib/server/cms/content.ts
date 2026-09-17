import type { Client, Transaction, InValue } from "@libsql/client";
import { error } from "@sveltejs/kit";
import { definition, validate_record, type Collection, type RecordData } from "./registry";
import { audit, select_one, transaction } from "./transactions";
import { can_edit_article } from "../auth/permissions";
import type { AdminIdentity } from "../auth/sessions";

export const CONFLICT_MESSAGE =
	"Otra persona modificó este registro. Recarga la página antes de guardar.";
export function record_key(name: Collection, key: RecordData) {
	const def = definition(name);
	if (Object.keys(key).length !== def.keys.length || def.keys.some((k) => !(k in key)))
		error(400, "Identificador inválido.");
	return {
		clause: def.keys.map((k) => '"' + k + '" = ?').join(" AND "),
		args: def.keys.map((k) => key[k]),
	};
}
export async function assert_actor(tx: Transaction, user: AdminIdentity, content = true) {
	const fresh = await select_one(
		tx,
		"SELECT * FROM admin_user WHERE id = ? AND suspended_at IS NULL AND must_change_password = 0",
		[user.id],
	);
	if (!fresh || fresh.role !== user.role || (content && fresh.role === "editor"))
		error(403, "No tienes permiso.");
}
async function check_relationships(tx: Transaction, name: Collection, data: RecordData) {
	const relations: Record<string, [string, string]> = {
		owner_id: ["admin_user", "id"],
		national_olympiad_id: ["national_olympiad", "id"],
		sponsor_id: ["sponsor", "id"],
		team_member_id: ["team_member", "id"],
		card_number: ["about_value_card", "number"],
	};
	for (const [field, value] of Object.entries(data)) {
		const relation = field.endsWith("media_id") ? ["media_asset", "id"] : relations[field];
		if (!relation || value === null) continue;
		const active = relation[0] === "admin_user" ? "suspended_at" : "archived_at";
		if (
			!(await select_one(
				tx,
				'SELECT 1 FROM "' +
					relation[0] +
					'" WHERE "' +
					relation[1] +
					'" = ? AND ' +
					active +
					" IS NULL",
				[value],
			))
		)
			error(400, "La relación seleccionada no está disponible: " + field);
		if (
			field.endsWith("media_id") &&
			!(await select_one(
				tx,
				"SELECT 1 FROM media_asset WHERE id = ? AND mime_type LIKE 'image/%'",
				[value],
			))
		)
			error(400, "Selecciona una imagen.");
	}
	if (data.content_id !== undefined && data.content_id !== 1) error(400, "Página inválida.");
	if (
		name === "team_member_placement" &&
		data.placement === "director" &&
		!(await select_one(
			tx,
			"SELECT 1 FROM team_member WHERE id = ? AND length(role) > 0 AND length(image_alt) > 0",
			[data.team_member_id],
		))
	)
		error(400, "Completa el cargo y el texto alternativo del director.");
}
export async function mutate_content(
	client: Client,
	user: AdminIdentity,
	input: {
		collection: Collection;
		key: RecordData;
		updated_at: number | null;
		data: RecordData;
		action: "save" | "create" | "archive" | "restore";
	},
) {
	return transaction(client, async (tx) => {
		const { collection: name, action } = input;
		const def = definition(name);
		await assert_actor(tx, user, name !== "news_article");
		if (def.singleton && action !== "save") error(400, "Esta página solo se puede actualizar.");
		if (name === "contact_submission" && action !== "save")
			error(400, "Cambia el estado del mensaje.");
		const key = record_key(name, input.key);
		const before = await select_one(
			tx,
			'SELECT * FROM "' + name + '" WHERE ' + key.clause,
			key.args,
		);
		if (action === "create" ? !!before : !before) error(409, CONFLICT_MESSAGE);
		if (before && Number(before.updated_at) !== input.updated_at) error(409, CONFLICT_MESSAGE);
		if (
			name === "news_article" &&
			user.role === "editor" &&
			before &&
			!can_edit_article(user, before.owner_id)
		)
			error(403, "Solo puedes editar tus propias noticias.");
		const data = { ...input.data };
		if (name === "news_article" && user.role === "editor") {
			if (data.owner_id !== user.id) error(403, "No puedes cambiar la propiedad de una noticia.");
		}
		const now = Math.max(Date.now(), Number(before?.updated_at ?? 0) + 1);
		let after: RecordData;
		if (action === "archive" || action === "restore") {
			if (action === "restore" ? before?.archived_at === null : before?.archived_at !== null)
				error(409, "El estado del registro cambió. Recarga la página.");
			if (name === "national_olympiad" && before?.is_current)
				error(400, "Selecciona otra edición actual antes de archivar.");
			after = {
				archived_at: action === "archive" ? now : null,
				archived_by: action === "archive" ? user.id : null,
				updated_at: now,
			};
			if (action === "restore")
				await check_relationships(tx, name, before as unknown as RecordData);
			if (action === "restore" && def.fields.some((f) => f.name === "sort_order")) {
				const scope = [
					"content_id",
					"national_olympiad_id",
					"card_number",
					"page_key",
					"placement",
				].filter((f) => def.fields.some((field) => field.name === f));
				const condition = scope.map((f) => '"' + f + '" = ?').join(" AND ");
				const args = scope.map((f) => before![f]);
				const occupied = await select_one(
					tx,
					'SELECT 1 FROM "' +
						name +
						'" WHERE archived_at IS NULL AND sort_order = ?' +
						(condition ? " AND " + condition : ""),
					[before!.sort_order, ...args],
				);
				if (occupied) {
					const maximum = await select_one(
						tx,
						'SELECT coalesce(max(sort_order), -1) + 1 AS next FROM "' +
							name +
							'" WHERE archived_at IS NULL' +
							(condition ? " AND " + condition : ""),
						args,
					);
					after.sort_order = Number(maximum?.next);
				}
			}
		} else {
			if (name === "national_olympiad" && before?.is_current === 1 && data.is_current === 0)
				error(400, "Selecciona otra edición como actual antes de cambiar esta.");
			if (
				name === "team_member" &&
				(!data.role || !data.image_alt) &&
				(await select_one(
					tx,
					"SELECT 1 FROM team_member_placement WHERE team_member_id = ? AND placement = 'director' AND archived_at IS NULL",
					[data.id],
				))
			)
				error(400, "Un director necesita cargo y texto alternativo.");
			try {
				validate_record(name, data);
			} catch (e) {
				error(400, (e as Error).message);
			}
			for (const field of def.keys)
				if (field !== "slug" && data[field] !== input.key[field])
					error(400, "No se puede cambiar el identificador.");
			if (def.singleton && data.id !== 1) error(400, "Página inválida.");
			if (name === "contact_submission" && before) {
				for (const field of def.fields)
					if (field.name !== "status" && data[field.name] !== before[field.name])
						error(400, "El contenido del mensaje no se puede modificar.");
			}
			await check_relationships(tx, name, data);
			after = { ...data, updated_at: now };
			if (name === "contact_submission")
				after.read_at =
					data.status === "unread" ? null : ((before?.read_at as number | null) ?? now);
			if (name === "national_olympiad" && data.is_current === 1) {
				if (before?.archived_at) error(400, "Restaura primero esta edición.");
				const others = await tx.execute({
					sql: "SELECT * FROM national_olympiad WHERE is_current = 1 AND id != ?",
					args: [data.id],
				});
				for (const other of others.rows) {
					await tx.execute({
						sql: "UPDATE national_olympiad SET is_current = 0, updated_at = ? WHERE id = ?",
						args: [now, other.id],
					});
					await audit(tx, user.id, "current_changed", name, String(other.id), other, {
						...other,
						is_current: 0,
						updated_at: now,
					});
				}
			}
			if (
				name === "news_article" &&
				(await select_one(tx, "SELECT 1 FROM news_slug_redirect WHERE old_slug = ?", [data.slug]))
			)
				error(400, "Ese enlace está reservado por una redirección.");
		}
		const fields = Object.keys(after);
		if (action === "create") {
			if (def.fields.some((field) => field.name === "sort_order")) {
				const scope = [
					"content_id",
					"national_olympiad_id",
					"card_number",
					"page_key",
					"placement",
				].filter((field) => def.fields.some((f) => f.name === field));
				const condition = scope.map((field) => '"' + field + '" = ?').join(" AND ");
				const args = scope.map((field) => after[field]);
				const occupied = await select_one(
					tx,
					'SELECT 1 FROM "' +
						name +
						'" WHERE archived_at IS NULL AND sort_order = ?' +
						(condition ? " AND " + condition : ""),
					[after.sort_order, ...args],
				);
				if (occupied) {
					const maximum = await select_one(
						tx,
						'SELECT coalesce(max(sort_order), -1) + 1 AS next FROM "' +
							name +
							'" WHERE archived_at IS NULL' +
							(condition ? " AND " + condition : ""),
						args,
					);
					after.sort_order = Number(maximum?.next);
				}
			}
			after.created_at = now;
			await tx.execute({
				sql:
					'INSERT INTO "' +
					name +
					'" (' +
					Object.keys(after)
						.map((k) => '"' + k + '"')
						.join(", ") +
					") VALUES (" +
					Object.keys(after)
						.map(() => "?")
						.join(", ") +
					")",
				args: Object.values(after) as InValue[],
			});
		} else {
			await tx.execute({
				sql:
					'UPDATE "' +
					name +
					'" SET ' +
					fields.map((f) => '"' + f + '" = ?').join(", ") +
					" WHERE " +
					key.clause,
				args: [...Object.values(after), ...key.args],
			});
		}
		if (
			name === "news_article" &&
			before &&
			data.slug &&
			data.slug !== before.slug &&
			before.status === "published"
		)
			await tx.execute({
				sql: "INSERT INTO news_slug_redirect (old_slug, article_slug) VALUES (?, ?)",
				args: [before.slug, data.slug],
			});
		await audit(tx, user.id, action, name, JSON.stringify(input.key), before ?? null, {
			...before,
			...after,
		});
		return { message: "Cambios guardados.", updated_at: now };
	});
}
