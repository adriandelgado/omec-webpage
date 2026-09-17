import { query, command } from "$app/server";
import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { AUTH_PASSWORD_PEPPERS } from "$app/env/private";
import { client } from "#lib/server/db/index.js";
import { require_user } from "#lib/server/auth/authorization.js";
import { hash_password, parse_keyring, random_token } from "#lib/server/auth/crypto.js";
import { create_session, set_session_cookie } from "#lib/server/auth/sessions.js";
import { audit, select_one, transaction } from "#lib/server/cms/transactions.js";
import { assert_actor, CONFLICT_MESSAGE } from "#lib/server/cms/content.js";

const ROLE = v.picklist(["superadmin", "admin", "editor"]);
export const list_accounts = query(async () => {
	await require_user({ superadmin: true });
	const result = await client.execute(
		"SELECT id, email, name, role, suspended_at, must_change_password, updated_at FROM admin_user ORDER BY email",
	);
	return result.rows.map((r) => ({
		id: String(r.id),
		email: String(r.email),
		name: String(r.name),
		role: r.role as "superadmin" | "admin" | "editor",
		suspended: r.suspended_at !== null,
		temporary: !!r.must_change_password,
		updated_at: Number(r.updated_at),
	}));
});
export const create_account = command(
	v.object({
		email: v.pipe(v.string(), v.trim(), v.toLowerCase(), v.email(), v.maxLength(254)),
		name: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(150)),
		role: ROLE,
	}),
	async (data) => {
		const { user } = await require_user({ superadmin: true });
		const password = random_token();
		const password_hash = await hash_password(password, parse_keyring(AUTH_PASSWORD_PEPPERS));
		await transaction(client, async (tx) => {
			await assert_actor(tx, user);
			const id = crypto.randomUUID(),
				now = Date.now();
			await tx.execute({
				sql: "INSERT INTO admin_user (id, email, name, role, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
				args: [id, data.email, data.name, data.role, password_hash, now, now],
			});
			await audit(tx, user.id, "create", "admin_user", id, null, data);
		});
		return { password };
	},
);
export const update_account = command(
	v.object({
		id: v.pipe(v.string(), v.uuid()),
		updated_at: v.number(),
		action: v.picklist(["role", "suspend", "activate", "reset", "delete"]),
		role: ROLE,
	}),
	async (data) => {
		const { user, event } = await require_user({ superadmin: true });
		const password = data.action === "reset" ? random_token() : null;
		const hash = password
			? await hash_password(password, parse_keyring(AUTH_PASSWORD_PEPPERS))
			: null;
		const token = await transaction(client, async (tx) => {
			await assert_actor(tx, user);
			const before = await select_one(tx, "SELECT * FROM admin_user WHERE id = ?", [data.id]);
			if (!before || Number(before.updated_at) !== data.updated_at) error(409, CONFLICT_MESSAGE);
			if (
				before.role === "superadmin" &&
				before.suspended_at === null &&
				(["suspend", "delete"].includes(data.action) ||
					(data.action === "role" && data.role !== "superadmin"))
			) {
				const count = await select_one(
					tx,
					"SELECT count(*) AS count FROM admin_user WHERE role = 'superadmin' AND suspended_at IS NULL",
				);
				if (Number(count?.count) <= 1)
					error(400, "No puedes desactivar al último superadministrador.");
			}
			if (data.action === "delete") {
				const references = await select_one(
					tx,
					"SELECT (SELECT count(*) FROM news_article WHERE owner_id = ?) + (SELECT count(*) FROM media_asset WHERE uploader_id = ?) AS count",
					[data.id, data.id],
				);
				if (Number(references?.count))
					error(400, "La cuenta tiene contenido asociado. Suspéndela para conservar su historial.");
				await tx.execute({ sql: "DELETE FROM admin_user WHERE id = ?", args: [data.id] });
			} else {
				const field =
					data.action === "role"
						? "role"
						: data.action === "reset"
							? "password_hash"
							: "suspended_at";
				const value =
					data.action === "role"
						? data.role
						: data.action === "reset"
							? hash
							: data.action === "suspend"
								? Date.now()
								: null;
				await tx.execute({
					sql:
						"UPDATE admin_user SET " +
						field +
						" = ?, updated_at = ?" +
						(data.action === "reset" ? ", must_change_password = 1" : "") +
						" WHERE id = ?",
					args: [value, Math.max(Date.now(), data.updated_at + 1), data.id],
				});
			}
			await tx.execute({ sql: "DELETE FROM admin_session WHERE user_id = ?", args: [data.id] });
			await tx.execute({
				sql: "DELETE FROM admin_login_challenge WHERE user_id = ?",
				args: [data.id],
			});
			await audit(tx, user.id, data.action, "admin_user", data.id, before, {
				role: data.role,
				action: data.action,
			});
			return data.action === "role" && data.id === user.id ? create_session(tx, user.id) : null;
		});
		if (token) set_session_cookie(event, token);
		return { password, message: "Cuenta actualizada." };
	},
);
export const search_audit = query(
	v.object({
		search: v.pipe(v.string(), v.maxLength(200)),
		offset: v.pipe(v.number(), v.integer(), v.minValue(0)),
	}),
	async ({ search, offset }) => {
		await require_user({ superadmin: true });
		const result = await client.execute({
			sql: "SELECT * FROM audit_event WHERE entity_type LIKE ? OR entity_id LIKE ? OR action LIKE ? OR actor_id LIKE ? ORDER BY id DESC LIMIT 100 OFFSET ?",
			args: [
				"%" + search + "%",
				"%" + search + "%",
				"%" + search + "%",
				"%" + search + "%",
				offset,
			],
		});
		return result.rows.map((r) => ({
			id: Number(r.id),
			actor_id: String(r.actor_id ?? "Sistema"),
			action: String(r.action),
			entity_type: String(r.entity_type),
			entity_id: String(r.entity_id),
			before: String(r.before_json),
			after: String(r.after_json),
			created_at: Number(r.created_at),
		}));
	},
);
