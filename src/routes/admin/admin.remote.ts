import { eq } from "drizzle-orm";
import { error, invalid, redirect } from "@sveltejs/kit";
import { form, getRequestEvent, query } from "$app/server";
import { create_session, generate_session_token, set_session_token_cookie } from "$lib/server/auth";
import { db } from "$lib/server/db";
import {
	permission,
	role,
	role_permission,
	session as session_table,
	user,
	user_role,
} from "$lib/server/db/schema";
import { verify_password } from "$lib/server/auth/password";
import { login_form_schema } from "./login-form";

const DUMMY_PASSWORD_HASH =
	"pbkdf2-sha256$i=100000$s=bXxD9TgaIm3ngKDz1eNc5Q$h=cPyQBqHyAuMu3K0kCeI9wYxRJXhzEy34U4fdBRM4tco";

async function get_role_keys(user_id: string) {
	const role_rows = await db
		.select({ key: role.key })
		.from(user_role)
		.innerJoin(role, eq(user_role.role_id, role.id))
		.where(eq(user_role.user_id, user_id));

	return role_rows.map((role_row) => role_row.key);
}

async function get_permission_keys(user_id: string) {
	const permission_rows = await db
		.select({ key: permission.key })
		.from(user_role)
		.innerJoin(role_permission, eq(user_role.role_id, role_permission.role_id))
		.innerJoin(permission, eq(role_permission.permission_id, permission.id))
		.where(eq(user_role.user_id, user_id));

	return [...new Set(permission_rows.map((permission_row) => permission_row.key))];
}

export const redirect_if_authenticated = query(() => {
	const event = getRequestEvent();

	if (event.locals.user) {
		redirect(303, "/admin/test");
	}

	return null;
});

export const login_admin = form(login_form_schema, async (data) => {
	const event = getRequestEvent();
	const [user_row] = await db.select().from(user).where(eq(user.email, data.email)).limit(1);

	const password_is_valid = await verify_password(
		data._password,
		user_row?.password_hash ?? DUMMY_PASSWORD_HASH,
	);

	if (!user_row || !password_is_valid) {
		invalid("Credenciales inválidas.");
	}

	const role_keys = await get_role_keys(user_row.id);
	const permission_keys = await get_permission_keys(user_row.id);
	const token = generate_session_token();
	const kv_session = await create_session(
		token,
		{
			user: {
				id: user_row.id,
				email: user_row.email,
				full_name: user_row.full_name,
				last_password_changed_at: user_row.last_password_changed_at,
			},
			role_keys,
			permission_keys,
		},
		event,
	);

	if (!kv_session) {
		error(500, "No se pudo crear la sesión.");
	}

	const created_at = new Date(kv_session.created_at);
	const expires_at = new Date(kv_session.expires_at);

	await db.insert(session_table).values({
		id: kv_session.session_id,
		user_id: kv_session.user_id,
		expires_at,
		remember_me: kv_session.remember_me,
		user_agent: kv_session.user_agent,
		ip_address: event.request.headers.get("cf-connecting-ip"),
		device_label: null,
		last_seen_at: null,
		revoked_at: null,
		revocation_reason: null,
		created_at,
		updated_at: created_at,
	});

	set_session_token_cookie(event, token, expires_at);
	redirect(303, "/admin/test");
});
