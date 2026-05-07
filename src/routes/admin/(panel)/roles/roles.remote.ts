// TODO: made with vibecoding. please clean up

import * as v from "valibot";
import { form, query, requested } from "$app/server";
import { invalid } from "@sveltejs/kit";
import { and, asc, eq, ne } from "drizzle-orm";
import {
	get_permissions_by_ids,
	is_unique_constraint_error,
	require_admin_context,
	sync_role_permissions,
} from "$lib/server/admin";
import { db } from "$lib/server/db";
import { permission, role, role_permission, user_role } from "$lib/server/db/schema";

const role_base_schema = {
	key: v.pipe(v.string(), v.trim(), v.nonEmpty("Ingresa la clave del rol.")),
	label: v.pipe(v.string(), v.trim(), v.nonEmpty("Ingresa el nombre del rol.")),
	description: v.optional(v.pipe(v.string(), v.trim()), ""),
	permission_ids: v.optional(v.array(v.string()), []),
};

const create_role_schema = v.object(role_base_schema);

const update_role_schema = v.object({
	role_id: v.pipe(v.string(), v.nonEmpty("Rol inválido.")),
	...role_base_schema,
});

const delete_role_schema = v.object({
	role_id: v.pipe(v.string(), v.nonEmpty("Rol inválido.")),
});

function parse_permission_ids(permission_ids: string[]) {
	const parsed_permission_ids = [
		...new Set(permission_ids.map((permission_id) => Number.parseInt(permission_id, 10))),
	];

	if (
		parsed_permission_ids.some(
			(permission_id) => !Number.isInteger(permission_id) || permission_id < 1,
		)
	) {
		return null;
	}

	return parsed_permission_ids;
}

export const get_admin_roles = query(async () => {
	await require_admin_context();

	const [role_rows, permission_rows, role_permission_rows, user_role_rows] = await Promise.all([
		db
			.select({
				id: role.id,
				key: role.key,
				label: role.label,
				description: role.description,
				created_at: role.created_at,
				updated_at: role.updated_at,
			})
			.from(role)
			.orderBy(asc(role.label)),
		db
			.select({
				id: permission.id,
				key: permission.key,
				description: permission.description,
			})
			.from(permission)
			.orderBy(asc(permission.key)),
		db
			.select({
				role_id: role_permission.role_id,
				permission_id: permission.id,
				permission_key: permission.key,
				permission_description: permission.description,
			})
			.from(role_permission)
			.innerJoin(permission, eq(role_permission.permission_id, permission.id)),
		db.select({ role_id: user_role.role_id }).from(user_role),
	]);

	const permissions_by_role_id = new Map<
		number,
		Array<{ id: number; key: string; description: string | null }>
	>();
	for (const role_permission_row of role_permission_rows) {
		const current_permissions = permissions_by_role_id.get(role_permission_row.role_id) ?? [];
		current_permissions.push({
			id: role_permission_row.permission_id,
			key: role_permission_row.permission_key,
			description: role_permission_row.permission_description,
		});
		permissions_by_role_id.set(role_permission_row.role_id, current_permissions);
	}

	const user_count_by_role_id = new Map<number, number>();
	for (const user_role_row of user_role_rows) {
		user_count_by_role_id.set(
			user_role_row.role_id,
			(user_count_by_role_id.get(user_role_row.role_id) ?? 0) + 1,
		);
	}

	return {
		permissions: permission_rows,
		roles: role_rows.map((role_row) => {
			const assigned_permissions = permissions_by_role_id.get(role_row.id) ?? [];

			return {
				...role_row,
				permission_ids: assigned_permissions.map((assigned_permission) => assigned_permission.id),
				permissions: assigned_permissions,
				permission_count: assigned_permissions.length,
				user_count: user_count_by_role_id.get(role_row.id) ?? 0,
			};
		}),
	};
});

export const create_admin_role = form(create_role_schema, async (data, issue) => {
	await require_admin_context();

	const parsed_permission_ids = parse_permission_ids(data.permission_ids);
	if (!parsed_permission_ids) {
		invalid(issue.permission_ids("Selecciona permisos válidos."));
	}

	const existing_permissions = await get_permissions_by_ids(parsed_permission_ids);
	if (existing_permissions.length !== parsed_permission_ids.length) {
		invalid(issue.permission_ids("Selecciona permisos válidos."));
	}

	const [existing_role] = await db
		.select({ id: role.id })
		.from(role)
		.where(eq(role.key, data.key))
		.limit(1);

	if (existing_role) {
		invalid(issue.key("Ya existe un rol con esta clave."));
	}

	try {
		const now = new Date();
		const inserted_roles = await db
			.insert(role)
			.values({
				key: data.key,
				label: data.label,
				description: data.description || null,
				updated_at: now,
			})
			.returning({ id: role.id });

		await sync_role_permissions(inserted_roles[0].id, parsed_permission_ids);
		await requested(get_admin_roles, 1).refreshAll();

		return {
			success: true as const,
			message: "Rol creado correctamente.",
		};
	} catch (error_value) {
		if (is_unique_constraint_error(error_value, "role.key")) {
			invalid(issue.key("Ya existe un rol con esta clave."));
		}

		throw error_value;
	}
});

export const update_admin_role = form(update_role_schema, async (data, issue) => {
	await require_admin_context();

	const parsed_role_id = Number.parseInt(data.role_id, 10);
	if (!Number.isInteger(parsed_role_id) || parsed_role_id < 1) {
		invalid("Rol inválido.");
	}

	const parsed_permission_ids = parse_permission_ids(data.permission_ids);
	if (!parsed_permission_ids) {
		invalid(issue.permission_ids("Selecciona permisos válidos."));
	}

	const [role_row] = await db
		.select({ id: role.id })
		.from(role)
		.where(eq(role.id, parsed_role_id))
		.limit(1);
	if (!role_row) {
		invalid("Rol no encontrado.");
	}

	const existing_permissions = await get_permissions_by_ids(parsed_permission_ids);
	if (existing_permissions.length !== parsed_permission_ids.length) {
		invalid(issue.permission_ids("Selecciona permisos válidos."));
	}

	const [existing_role] = await db
		.select({ id: role.id })
		.from(role)
		.where(and(eq(role.key, data.key), ne(role.id, parsed_role_id)))
		.limit(1);

	if (existing_role) {
		invalid(issue.key("Ya existe un rol con esta clave."));
	}

	try {
		await db
			.update(role)
			.set({
				key: data.key,
				label: data.label,
				description: data.description || null,
				updated_at: new Date(),
			})
			.where(eq(role.id, parsed_role_id));

		await sync_role_permissions(parsed_role_id, parsed_permission_ids);
		await requested(get_admin_roles, 1).refreshAll();

		return {
			success: true as const,
			message: "Rol actualizado correctamente.",
		};
	} catch (error_value) {
		if (is_unique_constraint_error(error_value, "role.key")) {
			invalid(issue.key("Ya existe un rol con esta clave."));
		}

		throw error_value;
	}
});

export const delete_admin_role = form(delete_role_schema, async (data) => {
	await require_admin_context();

	const parsed_role_id = Number.parseInt(data.role_id, 10);
	if (!Number.isInteger(parsed_role_id) || parsed_role_id < 1) {
		invalid("Rol inválido.");
	}

	const [role_row] = await db
		.select({ id: role.id })
		.from(role)
		.where(eq(role.id, parsed_role_id))
		.limit(1);
	if (!role_row) {
		invalid("Rol no encontrado.");
	}

	await db.delete(role).where(eq(role.id, parsed_role_id));
	await requested(get_admin_roles, 1).refreshAll();

	return {
		success: true as const,
		message: "Rol eliminado correctamente.",
	};
});
