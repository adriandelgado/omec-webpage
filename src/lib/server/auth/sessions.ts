import type { RequestEvent } from "@sveltejs/kit";
import { dev } from "$app/env";
import type { SqlExecutor } from "../cms/transactions";
import { digest_token, random_token } from "./crypto";

export const SESSION_IDLE_MS = 12 * 60 * 60 * 1000;
export const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
export const SESSION_COOKIE = "omec_admin";
export type Role = "superadmin" | "admin" | "editor";
export type AdminIdentity = {
	id: string;
	email: string;
	name: string;
	role: Role;
	must_change_password: boolean;
};
export function session_expired(
	session: { last_seen_at: number; expires_at: number },
	now = Date.now(),
) {
	return session.expires_at <= now || session.last_seen_at + SESSION_IDLE_MS <= now;
}
export async function resolve_session(
	tx: SqlExecutor,
	raw: string | undefined,
): Promise<{ user: AdminIdentity; digest: string } | null> {
	if (!raw || !/^[0-9a-f]{64}$/.test(raw)) return null;
	const digest = await digest_token(raw);
	const now = Date.now();
	const result = await tx.execute({
		sql: "UPDATE admin_session SET last_seen_at = ? WHERE digest = ? AND last_seen_at > ? AND expires_at > ? AND user_id IN (SELECT id FROM admin_user WHERE suspended_at IS NULL) RETURNING user_id",
		args: [now, digest, now - SESSION_IDLE_MS, now],
	});
	if (!result.rows.length) return null;
	const user = (
		await tx.execute({
			sql: "SELECT id, email, name, role, must_change_password FROM admin_user WHERE id = ? AND suspended_at IS NULL",
			args: [result.rows[0].user_id],
		})
	).rows[0];
	if (!user) return null;
	return {
		digest,
		user: {
			id: String(user.id),
			email: String(user.email),
			name: String(user.name),
			role: user.role as Role,
			must_change_password: !!user.must_change_password,
		},
	};
}
export async function create_session(tx: SqlExecutor, user_id: string, old_digest?: string | null) {
	if (old_digest)
		await tx.execute({ sql: "DELETE FROM admin_session WHERE digest = ?", args: [old_digest] });
	const token = random_token();
	const now = Date.now();
	await tx.execute({
		sql: "INSERT INTO admin_session (digest, user_id, created_at, last_seen_at, expires_at) VALUES (?, ?, ?, ?, ?)",
		args: [await digest_token(token), user_id, now, now, now + SESSION_LIFETIME_MS],
	});
	return token;
}
export function set_session_cookie(event: RequestEvent, token: string) {
	event.cookies.set(SESSION_COOKIE, token, {
		path: "/",
		httpOnly: true,
		secure: !dev,
		sameSite: "lax",
		maxAge: SESSION_LIFETIME_MS / 1000,
	});
}
