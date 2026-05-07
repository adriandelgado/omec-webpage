// TODO: made with vibecoding. please clean up

import * as v from "valibot";
import { form, query, requested } from "$app/server";
import { invalid } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";
import { require_admin_context } from "$lib/server/admin";
import { db } from "$lib/server/db";
import { permission } from "$lib/server/db/schema";

const update_permission_schema = v.object({
	permission_id: v.pipe(v.string(), v.nonEmpty("Permiso inválido.")),
	description: v.optional(v.pipe(v.string(), v.trim()), ""),
});

export const get_admin_permissions = query(async () => {
	await require_admin_context();

	return db
		.select({
			id: permission.id,
			key: permission.key,
			description: permission.description,
			created_at: permission.created_at,
			updated_at: permission.updated_at,
		})
		.from(permission)
		.orderBy(asc(permission.key));
});

export const update_admin_permission = form(update_permission_schema, async (data) => {
	await require_admin_context();

	const parsed_permission_id = Number.parseInt(data.permission_id, 10);
	if (!Number.isInteger(parsed_permission_id) || parsed_permission_id < 1) {
		invalid("Permiso inválido.");
	}

	const [permission_row] = await db
		.select({ id: permission.id })
		.from(permission)
		.where(eq(permission.id, parsed_permission_id))
		.limit(1);

	if (!permission_row) {
		invalid("Permiso no encontrado.");
	}

	await db
		.update(permission)
		.set({
			description: data.description || null,
			updated_at: new Date(),
		})
		.where(eq(permission.id, parsed_permission_id));

	await requested(get_admin_permissions, 1).refreshAll();

	return {
		success: true as const,
		message: "Permiso actualizado correctamente.",
	};
});
