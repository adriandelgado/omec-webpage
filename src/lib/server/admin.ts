// TODO: made with vibecoding. please clean up

import { getRequestEvent } from "$app/server";
import { redirect } from "@sveltejs/kit";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { delete_session_token_cookie, invalidate_session } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { permission, role, role_permission, user, user_role } from "$lib/server/db/schema";

export type AdminContext = {
	session: NonNullable<App.Locals["session"]>;
	user: {
		id: string;
		email: string;
		full_name: string;
		role_keys: string[];
		permission_keys: string[];
	};
};

export async function get_user_role_keys(user_id: string) {
	const role_rows = await db
		.select({ key: role.key })
		.from(user_role)
		.innerJoin(role, eq(user_role.role_id, role.id))
		.where(eq(user_role.user_id, user_id));

	return role_rows.map((role_row) => role_row.key);
}

export async function get_user_permission_keys(user_id: string) {
	const permission_rows = await db
		.select({ key: permission.key })
		.from(user_role)
		.innerJoin(role_permission, eq(user_role.role_id, role_permission.role_id))
		.innerJoin(permission, eq(role_permission.permission_id, permission.id))
		.where(eq(user_role.user_id, user_id));

	return [...new Set(permission_rows.map((permission_row) => permission_row.key))];
}

export async function require_admin_context(): Promise<AdminContext> {
	const event = getRequestEvent();

	if (!event.locals.user || !event.locals.session) {
		redirect(307, "/admin");
	}

	const [user_row] = await db
		.select({
			id: user.id,
			email: user.email,
			full_name: user.full_name,
		})
		.from(user)
		.where(and(eq(user.id, event.locals.user.id), isNull(user.deleted_at)))
		.limit(1);

	if (!user_row) {
		await invalidate_session(event, event.locals.session.id);
		delete_session_token_cookie(event);
		redirect(307, "/admin");
	}

	const role_keys = await get_user_role_keys(user_row.id);
	const permission_keys = await get_user_permission_keys(user_row.id);

	return {
		session: event.locals.session,
		user: {
			id: user_row.id,
			email: user_row.email,
			full_name: user_row.full_name,
			role_keys,
			permission_keys,
		},
	};
}

export async function sync_user_roles(user_id: string, role_ids: number[]) {
	const unique_role_ids = [...new Set(role_ids)];

	await db.delete(user_role).where(eq(user_role.user_id, user_id));

	if (unique_role_ids.length === 0) {
		return;
	}

	await db.insert(user_role).values(unique_role_ids.map((role_id) => ({ user_id, role_id })));
}

export async function sync_role_permissions(role_id: number, permission_ids: number[]) {
	const unique_permission_ids = [...new Set(permission_ids)];

	await db.delete(role_permission).where(eq(role_permission.role_id, role_id));

	if (unique_permission_ids.length === 0) {
		return;
	}

	await db
		.insert(role_permission)
		.values(unique_permission_ids.map((permission_id) => ({ role_id, permission_id })));
}

export async function get_roles_by_ids(role_ids: number[]) {
	if (role_ids.length === 0) {
		return [];
	}

	return db
		.select({ id: role.id })
		.from(role)
		.where(inArray(role.id, [...new Set(role_ids)]));
}

export async function get_permissions_by_ids(permission_ids: number[]) {
	if (permission_ids.length === 0) {
		return [];
	}

	return db
		.select({ id: permission.id })
		.from(permission)
		.where(inArray(permission.id, [...new Set(permission_ids)]));
}

export function is_unique_constraint_error(error_value: unknown, column_name: string) {
	return (
		error_value instanceof Error &&
		error_value.message.includes("UNIQUE constraint failed") &&
		error_value.message.includes(column_name)
	);
}
