// TODO: made with vibecoding. please clean up

import * as v from "valibot";
import { form, getRequestEvent, query, requested } from "$app/server";
import { invalid } from "@sveltejs/kit";
import { and, desc, eq, isNull, ne } from "drizzle-orm";
import {
	get_roles_by_ids,
	is_unique_constraint_error,
	require_admin_context,
	sync_user_roles,
} from "$lib/server/admin";
import { invalidate_session } from "$lib/server/auth";
import { hash_password } from "$lib/server/auth/password";
import { db } from "$lib/server/db";
import { permission, role, role_permission, session, user, user_role } from "$lib/server/db/schema";

const user_base_schema = {
	full_name: v.pipe(v.string(), v.trim(), v.nonEmpty("Ingresa el nombre completo.")),
	email: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty("Ingresa el correo electrónico."),
		v.email("Ingresa un correo válido."),
	),
	role_ids: v.optional(v.array(v.string()), []),
};

const create_user_schema = v.object({
	...user_base_schema,
	temporary_password: v.pipe(
		v.string(),
		v.nonEmpty("Ingresa una contraseña temporal."),
		v.minLength(8, "La contraseña temporal debe tener al menos 8 caracteres."),
		v.maxLength(255, "La contraseña temporal es demasiado larga."),
	),
});

const update_user_schema = v.object({
	user_id: v.pipe(v.string(), v.nonEmpty("Usuario inválido.")),
	...user_base_schema,
});

const reset_password_schema = v.object({
	user_id: v.pipe(v.string(), v.nonEmpty("Usuario inválido.")),
	temporary_password: v.pipe(
		v.string(),
		v.nonEmpty("Ingresa una contraseña temporal."),
		v.minLength(8, "La contraseña temporal debe tener al menos 8 caracteres."),
		v.maxLength(255, "La contraseña temporal es demasiado larga."),
	),
});

const soft_delete_user_schema = v.object({
	user_id: v.pipe(v.string(), v.nonEmpty("Usuario inválido.")),
});

function parse_role_ids(role_ids: string[]) {
	const parsed_role_ids = [...new Set(role_ids.map((role_id) => Number.parseInt(role_id, 10)))];

	if (parsed_role_ids.some((role_id) => !Number.isInteger(role_id) || role_id < 1)) {
		return null;
	}

	return parsed_role_ids;
}

async function invalidate_user_sessions(user_id: string, revocation_reason: string) {
	const event = getRequestEvent();
	const session_rows = await db
		.select({ id: session.id })
		.from(session)
		.where(and(eq(session.user_id, user_id), isNull(session.revoked_at)));

	await Promise.all(session_rows.map((session_row) => invalidate_session(event, session_row.id)));

	if (session_rows.length === 0) {
		return;
	}

	const now = new Date();

	await db
		.update(session)
		.set({
			revoked_at: now,
			revocation_reason,
			updated_at: now,
		})
		.where(and(eq(session.user_id, user_id), isNull(session.revoked_at)));
}

export const get_admin_users = query(async () => {
	await require_admin_context();

	const [user_rows, role_rows, user_role_rows, permission_rows] = await Promise.all([
		db
			.select({
				id: user.id,
				full_name: user.full_name,
				email: user.email,
				created_at: user.created_at,
				updated_at: user.updated_at,
			})
			.from(user)
			.where(isNull(user.deleted_at))
			.orderBy(desc(user.created_at)),
		db
			.select({
				id: role.id,
				key: role.key,
				label: role.label,
				description: role.description,
			})
			.from(role)
			.orderBy(role.label),
		db
			.select({
				user_id: user_role.user_id,
				role_id: role.id,
				role_key: role.key,
				role_label: role.label,
			})
			.from(user_role)
			.innerJoin(role, eq(user_role.role_id, role.id)),
		db
			.select({
				user_id: user_role.user_id,
				permission_key: permission.key,
			})
			.from(user_role)
			.innerJoin(role_permission, eq(user_role.role_id, role_permission.role_id))
			.innerJoin(permission, eq(role_permission.permission_id, permission.id)),
	]);

	const roles_by_user_id = new Map<string, Array<{ id: number; key: string; label: string }>>();
	for (const user_role_row of user_role_rows) {
		const current_roles = roles_by_user_id.get(user_role_row.user_id) ?? [];
		current_roles.push({
			id: user_role_row.role_id,
			key: user_role_row.role_key,
			label: user_role_row.role_label,
		});
		roles_by_user_id.set(user_role_row.user_id, current_roles);
	}

	const permission_keys_by_user_id = new Map<string, string[]>();
	for (const permission_row of permission_rows) {
		const current_permissions = permission_keys_by_user_id.get(permission_row.user_id) ?? [];
		if (!current_permissions.includes(permission_row.permission_key)) {
			current_permissions.push(permission_row.permission_key);
		}
		permission_keys_by_user_id.set(permission_row.user_id, current_permissions);
	}

	return {
		roles: role_rows,
		users: user_rows.map((user_row) => {
			const assigned_roles = roles_by_user_id.get(user_row.id) ?? [];

			return {
				...user_row,
				role_ids: assigned_roles.map((assigned_role) => assigned_role.id),
				roles: assigned_roles,
				permission_keys: permission_keys_by_user_id.get(user_row.id) ?? [],
			};
		}),
	};
});

export const create_admin_user = form(create_user_schema, async (data, issue) => {
	await require_admin_context();

	const parsed_role_ids = parse_role_ids(data.role_ids);
	if (!parsed_role_ids) {
		invalid(issue.role_ids("Selecciona roles válidos."));
	}

	const existing_roles = await get_roles_by_ids(parsed_role_ids);
	if (existing_roles.length !== parsed_role_ids.length) {
		invalid(issue.role_ids("Selecciona roles válidos."));
	}

	const [existing_user] = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.email, data.email))
		.limit(1);
	if (existing_user) {
		invalid(issue.email("Ya existe un usuario con este correo."));
	}

	try {
		const now = new Date();
		const user_id = crypto.randomUUID();
		const password_hash = await hash_password(data.temporary_password);

		await db.insert(user).values({
			id: user_id,
			full_name: data.full_name,
			email: data.email,
			password_hash,
			last_password_changed_at: now,
			updated_at: now,
		});

		await sync_user_roles(user_id, parsed_role_ids);
		await requested(get_admin_users, 1).refreshAll();

		return {
			success: true as const,
			message: "Usuario creado correctamente.",
		};
	} catch (error_value) {
		if (is_unique_constraint_error(error_value, "user.email")) {
			invalid(issue.email("Ya existe un usuario con este correo."));
		}

		throw error_value;
	}
});

export const update_admin_user = form(update_user_schema, async (data, issue) => {
	await require_admin_context();

	const parsed_role_ids = parse_role_ids(data.role_ids);
	if (!parsed_role_ids) {
		invalid(issue.role_ids("Selecciona roles válidos."));
	}

	const [user_row] = await db
		.select({ id: user.id })
		.from(user)
		.where(and(eq(user.id, data.user_id), isNull(user.deleted_at)))
		.limit(1);

	if (!user_row) {
		invalid("Usuario no encontrado.");
	}

	const existing_roles = await get_roles_by_ids(parsed_role_ids);
	if (existing_roles.length !== parsed_role_ids.length) {
		invalid(issue.role_ids("Selecciona roles válidos."));
	}

	const [existing_user] = await db
		.select({ id: user.id })
		.from(user)
		.where(and(eq(user.email, data.email), ne(user.id, data.user_id)))
		.limit(1);

	if (existing_user) {
		invalid(issue.email("Ya existe un usuario con este correo."));
	}

	try {
		await db
			.update(user)
			.set({
				full_name: data.full_name,
				email: data.email,
				updated_at: new Date(),
			})
			.where(eq(user.id, data.user_id));

		await sync_user_roles(data.user_id, parsed_role_ids);
		await invalidate_user_sessions(data.user_id, "admin_user_updated");
		await requested(get_admin_users, 1).refreshAll();

		return {
			success: true as const,
			message: "Usuario actualizado correctamente.",
		};
	} catch (error_value) {
		if (is_unique_constraint_error(error_value, "user.email")) {
			invalid(issue.email("Ya existe un usuario con este correo."));
		}

		throw error_value;
	}
});

export const reset_admin_user_password = form(reset_password_schema, async (data) => {
	await require_admin_context();

	const [user_row] = await db
		.select({ id: user.id })
		.from(user)
		.where(and(eq(user.id, data.user_id), isNull(user.deleted_at)))
		.limit(1);

	if (!user_row) {
		invalid("Usuario no encontrado.");
	}

	const now = new Date();
	const password_hash = await hash_password(data.temporary_password);

	await db
		.update(user)
		.set({
			password_hash,
			last_password_changed_at: now,
			updated_at: now,
		})
		.where(eq(user.id, data.user_id));

	await invalidate_user_sessions(data.user_id, "admin_password_reset");
	await requested(get_admin_users, 1).refreshAll();

	return {
		success: true as const,
		message: "Contraseña restablecida correctamente.",
	};
});

export const soft_delete_admin_user = form(soft_delete_user_schema, async (data) => {
	const admin_context = await require_admin_context();

	if (admin_context.user.id === data.user_id) {
		invalid("No puedes eliminar tu propia cuenta activa.");
	}

	const [user_row] = await db
		.select({ id: user.id })
		.from(user)
		.where(and(eq(user.id, data.user_id), isNull(user.deleted_at)))
		.limit(1);

	if (!user_row) {
		invalid("Usuario no encontrado.");
	}

	const now = new Date();

	await db
		.update(user)
		.set({
			deleted_at: now,
			updated_at: now,
		})
		.where(eq(user.id, data.user_id));

	await invalidate_user_sessions(data.user_id, "admin_user_soft_deleted");
	await requested(get_admin_users, 1).refreshAll();

	return {
		success: true as const,
		message: "Usuario eliminado correctamente.",
	};
});
