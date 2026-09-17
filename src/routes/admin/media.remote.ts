import { form, query, command } from "$app/server";
import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { client } from "#lib/server/db/index.js";
import { require_user } from "#lib/server/auth/authorization.js";
import { transaction, audit, select_one } from "#lib/server/cms/transactions.js";
import { assert_actor, CONFLICT_MESSAGE } from "#lib/server/cms/content.js";
import { validate_file, media_url } from "#lib/server/media/files.js";
import { media_references } from "#lib/server/media/references.js";
import { media_bucket } from "#lib/server/media/bucket.js";

export const upload_media = form(
	v.object({
		file: v.pipe(v.file(), v.maxSize(25 * 1024 * 1024)),
		alt_text: v.pipe(v.string(), v.maxLength(500)),
	}),
	async ({ file, alt_text }) => {
		const { user } = await require_user();
		const bucket = media_bucket();
		if (!bucket) error(503, "La biblioteca de medios no está configurada.");
		const bytes = new Uint8Array(await file.arrayBuffer());
		let dimensions;
		try {
			dimensions = validate_file(file.name, file.type, bytes);
		} catch (cause) {
			error(400, (cause as Error).message);
		}
		const id = crypto.randomUUID(),
			object_key = crypto.randomUUID();
		const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-180);
		await bucket.put(object_key, bytes, { httpMetadata: { contentType: file.type } });
		try {
			await transaction(client, async (tx) => {
				await assert_actor(tx, user, false);
				const now = Date.now();
				await tx.execute({
					sql: "INSERT INTO media_asset (id, object_key, original_filename, mime_type, size, width, height, alt_text, uploader_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
					args: [
						id,
						object_key,
						filename,
						file.type,
						file.size,
						dimensions.width,
						dimensions.height,
						alt_text,
						user.id,
						now,
						now,
					],
				});
				await audit(tx, user.id, "upload", "media_asset", id, null, {
					original_filename: filename,
					mime_type: file.type,
					size: file.size,
					alt_text,
				});
			});
		} catch (cause) {
			await bucket.delete(object_key);
			throw cause;
		}
		return { message: "Archivo subido.", url: media_url(id, filename) };
	},
);
export const list_media = query(
	v.object({ archived: v.boolean(), search: v.pipe(v.string(), v.maxLength(200)) }),
	async ({ archived, search }) => {
		const { user } = await require_user();
		const rows = (
			await client.execute({
				sql:
					"SELECT * FROM media_asset WHERE archived_at IS " +
					(archived ? "NOT NULL" : "NULL") +
					" AND (original_filename LIKE ? OR alt_text LIKE ?) ORDER BY created_at DESC LIMIT 200",
				args: ["%" + search + "%", "%" + search + "%"],
			})
		).rows;
		return {
			user,
			assets: await Promise.all(
				rows.map(async (r) => ({
					id: String(r.id),
					filename: String(r.original_filename),
					mime_type: String(r.mime_type),
					size: Number(r.size),
					width: Number(r.width),
					height: Number(r.height),
					alt_text: String(r.alt_text),
					uploader_id: String(r.uploader_id),
					updated_at: Number(r.updated_at),
					url: media_url(String(r.id), String(r.original_filename)),
					references: await media_references(client, String(r.id)),
				})),
			),
		};
	},
);
export const change_media = command(
	v.object({
		id: v.pipe(v.string(), v.uuid()),
		updated_at: v.number(),
		action: v.picklist(["save", "archive", "restore", "purge"]),
		alt_text: v.pipe(v.string(), v.maxLength(500)),
	}),
	async ({ id, updated_at, action, alt_text }) => {
		const { user } = await require_user({ superadmin: action === "purge" });
		return transaction(client, async (tx) => {
			await assert_actor(tx, user, false);
			const before = await select_one(tx, "SELECT * FROM media_asset WHERE id = ?", [id]);
			if (!before || Number(before.updated_at) !== updated_at) error(409, CONFLICT_MESSAGE);
			const references = await media_references(tx, id);
			if (
				user.role === "editor" &&
				(action !== "archive" || before.uploader_id !== user.id || references.length)
			)
				error(403, "Solo puedes archivar tus propios archivos sin referencias.");
			if ((action === "archive" || action === "purge") && references.length)
				error(400, "El archivo se utiliza en: " + references.join(", "));
			if (action === "purge") {
				if (!before.archived_at) error(400, "Archiva primero el archivo.");
				if (!media_bucket()) error(503, "La biblioteca de medios no está configurada.");
				await media_bucket().delete(String(before.object_key));
				await tx.execute({ sql: "DELETE FROM media_asset WHERE id = ?", args: [id] });
			} else {
				await tx.execute({
					sql: "UPDATE media_asset SET alt_text = ?, archived_at = ?, archived_by = ?, updated_at = ? WHERE id = ?",
					args: [
						action === "save" ? alt_text : before.alt_text,
						action === "archive" ? Date.now() : action === "restore" ? null : before.archived_at,
						action === "archive" ? user.id : action === "restore" ? null : before.archived_by,
						Math.max(Date.now(), updated_at + 1),
						id,
					],
				});
			}
			await audit(
				tx,
				user.id,
				action,
				"media_asset",
				id,
				before,
				action === "purge" ? null : { alt_text, action },
			);
			return { message: "Medio actualizado." };
		});
	},
);
