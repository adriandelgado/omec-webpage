import { form, query, getRequestEvent } from "$app/server";
import { dev } from "$app/env";
import { redirect, error } from "@sveltejs/kit";
import * as v from "valibot";
import { AUTH_PASSWORD_PEPPERS, AUTH_TOTP_ENCRYPTION_KEYS } from "$app/env/private";
import { client } from "#lib/server/db/index.js";
import { audit, select_one, transaction } from "#lib/server/cms/transactions.js";
import {
	digest_token,
	parse_keyring,
	hash_password,
	verify_password,
	encrypt_secret,
	decrypt_secret,
} from "#lib/server/auth/crypto.js";
import { create_session, set_session_cookie, SESSION_COOKIE } from "#lib/server/auth/sessions.js";
import { require_user } from "#lib/server/auth/authorization.js";
import { reserve_attempt } from "#lib/server/auth/rate-limit.js";
import {
	new_totp,
	verify_totp,
	consume_second_factor,
	replace_recovery_codes,
} from "#lib/server/auth/totp.js";
import { renderSVG } from "uqr";
import { create_login_challenge, consume_login_challenge } from "#lib/server/auth/challenges.js";

const PASSWORD = v.pipe(
	v.string(),
	v.minLength(12, "Usa al menos 12 caracteres."),
	v.maxLength(128),
);
const LOGIN_ERROR = {
	success: false,
	message: "No se pudo iniciar sesión. Revisa tus datos o inténtalo más tarde.",
};
const CHALLENGE_COOKIE = "omec_challenge";
const ENROLL_COOKIE = "omec_enrollment";
function cookie_options() {
	return {
		path: "/",
		httpOnly: true,
		secure: !dev,
		sameSite: "strict" as const,
		maxAge: 300,
	};
}
export const login = form(
	v.object({
		email: v.pipe(v.string(), v.trim(), v.toLowerCase(), v.email(), v.maxLength(254)),
		password: v.pipe(v.string(), v.maxLength(128)),
	}),
	async ({ email, password }) => {
		const event = getRequestEvent();
		const allowed = await transaction(client, (tx) =>
			reserve_attempt(tx, email, event.getClientAddress(), "password"),
		);
		if (!allowed) return LOGIN_ERROR;
		const user = await select_one(client, "SELECT * FROM admin_user WHERE email = ?", [email]);
		const peppers = parse_keyring(AUTH_PASSWORD_PEPPERS);
		// Unknown accounts perform the same PBKDF2 work as known accounts.
		const encoded = user
			? String(user.password_hash)
			: [
					"omec",
					"1",
					"pbkdf2-sha256",
					100_000,
					peppers.current,
					"00".repeat(16),
					"00".repeat(32),
				].join("$");
		const verified = await verify_password(password, encoded, peppers);
		if (!user || !verified.valid || user.suspended_at !== null) return LOGIN_ERROR;
		const result = await transaction(client, async (tx) => {
			const fresh = await select_one(
				tx,
				"SELECT * FROM admin_user WHERE id = ? AND password_hash = ? AND suspended_at IS NULL",
				[user.id, encoded],
			);
			if (!fresh) return null;
			if (verified.needs_rehash)
				await tx.execute({
					sql: "UPDATE admin_user SET password_hash = ? WHERE id = ?",
					args: [await hash_password(password, peppers), user.id],
				});
			if (fresh.totp_secret) {
				const token = await create_login_challenge(tx, String(user.id));
				return { challenge: token, token: null };
			}
			await audit(tx, String(user.id), "login", "admin_user", String(user.id), null, null);
			return {
				challenge: null,
				token: await create_session(tx, String(user.id), event.locals.session_digest),
			};
		});
		if (!result) return LOGIN_ERROR;
		if (result.challenge) {
			event.cookies.set(CHALLENGE_COOKIE, result.challenge, cookie_options());
			redirect(303, "/admin/verificar-2fa");
		}
		set_session_cookie(event, result.token!);
		redirect(303, user.must_change_password ? "/admin/cambiar-contrasena" : "/admin");
	},
);
export const verify_login = form(
	v.object({ code: v.pipe(v.string(), v.maxLength(64)) }),
	async ({ code }) => {
		const event = getRequestEvent();
		const digest = await digest_token(event.cookies.get(CHALLENGE_COOKIE) ?? "");
		const challenge = await select_one(
			client,
			"SELECT c.*, u.email FROM admin_login_challenge c JOIN admin_user u ON u.id = c.user_id WHERE c.digest = ?",
			[digest],
		);
		const allowed = await transaction(client, (tx) =>
			reserve_attempt(tx, String(challenge?.email ?? "unknown"), event.getClientAddress(), "totp"),
		);
		if (!allowed || !challenge) return LOGIN_ERROR;
		const result = await transaction(client, async (tx) => {
			const user = await select_one(
				tx,
				"SELECT u.* FROM admin_user u JOIN admin_login_challenge c ON c.user_id = u.id WHERE c.digest = ? AND c.expires_at > ? AND u.suspended_at IS NULL",
				[digest, Date.now()],
			);
			if (
				!user?.totp_secret ||
				!(await consume_second_factor(
					tx,
					String(user.id),
					String(user.totp_secret),
					code,
					parse_keyring(AUTH_TOTP_ENCRYPTION_KEYS),
				))
			)
				return null;
			if (!(await consume_login_challenge(tx, digest))) error(400, "La verificación expiró.");
			await audit(tx, String(user.id), "login_2fa", "admin_user", String(user.id), null, null);
			return {
				token: await create_session(tx, String(user.id), event.locals.session_digest),
				temporary: !!user.must_change_password,
			};
		});
		if (!result) return LOGIN_ERROR;
		event.cookies.delete(CHALLENGE_COOKIE, { path: "/" });
		set_session_cookie(event, result.token);
		redirect(303, result.temporary ? "/admin/cambiar-contrasena" : "/admin");
	},
);
export const logout = form(async () => {
	const event = getRequestEvent();
	if (event.locals.session_digest)
		await client.execute({
			sql: "DELETE FROM admin_session WHERE digest = ?",
			args: [event.locals.session_digest],
		});
	event.cookies.delete(SESSION_COOKIE, { path: "/" });
	redirect(303, "/admin/iniciar-sesion");
});
async function confirm_password(user_id: string, password: string) {
	const event = getRequestEvent();
	const user = await select_one(
		client,
		"SELECT * FROM admin_user WHERE id = ? AND suspended_at IS NULL",
		[user_id],
	);
	const allowed = await transaction(client, (tx) =>
		reserve_attempt(tx, String(user?.email ?? ""), event.getClientAddress(), "confirmation"),
	);
	if (
		!allowed ||
		!user ||
		!(
			await verify_password(
				password,
				String(user.password_hash),
				parse_keyring(AUTH_PASSWORD_PEPPERS),
			)
		).valid
	)
		error(400, "No se pudo confirmar la contraseña.");
	return user;
}
export const change_password = form(
	v.object({ current_password: PASSWORD, password: PASSWORD }),
	async ({ current_password, password }) => {
		const { user, digest, event } = await require_user({ allow_temporary: true });
		const confirmed = await confirm_password(user.id, current_password);
		const hash = await hash_password(password, parse_keyring(AUTH_PASSWORD_PEPPERS));
		const token = await transaction(client, async (tx) => {
			const changed = await tx.execute({
				sql: "UPDATE admin_user SET password_hash = ?, must_change_password = 0, updated_at = ? WHERE id = ? AND password_hash = ? AND suspended_at IS NULL RETURNING id",
				args: [hash, Date.now(), user.id, confirmed.password_hash],
			});
			if (!changed.rows.length) error(409, "La cuenta cambió. Inicia sesión de nuevo.");
			await tx.execute({ sql: "DELETE FROM admin_session WHERE user_id = ?", args: [user.id] });
			await tx.execute({
				sql: "DELETE FROM admin_login_challenge WHERE user_id = ?",
				args: [user.id],
			});
			await audit(tx, user.id, "password_changed", "admin_user", user.id, null, null);
			return create_session(tx, user.id, digest);
		});
		set_session_cookie(event, token);
		redirect(303, "/admin/seguridad");
	},
);
export const security_info = query(async () => {
	const { user, digest } = await require_user();
	const account = await select_one(client, "SELECT totp_secret FROM admin_user WHERE id = ?", [
		user.id,
	]);
	const sessions = await client.execute({
		sql: "SELECT digest, created_at, last_seen_at FROM admin_session WHERE user_id = ? AND expires_at > ? AND last_seen_at > ?",
		args: [user.id, Date.now(), Date.now() - 43_200_000],
	});
	return {
		totp: !!account?.totp_secret,
		sessions: sessions.rows.map((row) => ({
			created_at: Number(row.created_at),
			last_seen_at: Number(row.last_seen_at),
			current: row.digest === digest,
		})),
	};
});
export const revoke_sessions = form(async () => {
	const { user, digest } = await require_user();
	await transaction(client, async (tx) => {
		await tx.execute({
			sql: "DELETE FROM admin_session WHERE user_id = ? AND digest != ?",
			args: [user.id, digest],
		});
		await audit(tx, user.id, "sessions_revoked", "admin_user", user.id, null, null);
	});
	return { message: "Se cerraron las demás sesiones." };
});
export const begin_totp = form(v.object({ password: PASSWORD }), async ({ password }) => {
	const { user, event } = await require_user();
	const account = await confirm_password(user.id, password);
	if (account.totp_secret) error(400, "La verificación ya está activa.");
	const totp = new_totp(user.email);
	const sealed = await encrypt_secret(
		JSON.stringify({ user_id: user.id, secret: totp.secret.base32, expires: Date.now() + 300_000 }),
		parse_keyring(AUTH_TOTP_ENCRYPTION_KEYS),
	);
	event.cookies.set(ENROLL_COOKIE, sealed, cookie_options());
	return { qr: renderSVG(totp.toString()), secret: totp.secret.base32 };
});
export const finish_totp = form(
	v.object({ password: PASSWORD, code: v.pipe(v.string(), v.regex(/^\d{6}$/)) }),
	async ({ password, code }) => {
		const { user, event } = await require_user();
		const account = await confirm_password(user.id, password);
		const keyring = parse_keyring(AUTH_TOTP_ENCRYPTION_KEYS);
		const enrollment = JSON.parse(
			await decrypt_secret(event.cookies.get(ENROLL_COOKIE) ?? "", keyring),
		) as { user_id: string; secret: string; expires: number };
		if (enrollment.user_id !== user.id || enrollment.expires <= Date.now())
			error(400, "La configuración expiró.");
		const step = verify_totp(enrollment.secret, code);
		if (step === null) error(400, "Código inválido.");
		const result = await transaction(client, async (tx) => {
			const changed = await tx.execute({
				sql: "UPDATE admin_user SET totp_secret = ?, totp_last_step = ?, updated_at = ? WHERE id = ? AND password_hash = ? AND totp_secret IS NULL AND suspended_at IS NULL RETURNING id",
				args: [
					await encrypt_secret(enrollment.secret, keyring),
					step,
					Date.now(),
					user.id,
					account.password_hash,
				],
			});
			if (!changed.rows.length) error(409, "La cuenta cambió. Recarga la página.");
			await tx.execute({ sql: "DELETE FROM admin_session WHERE user_id = ?", args: [user.id] });
			const codes = await replace_recovery_codes(tx, user.id);
			await audit(tx, user.id, "totp_enabled", "admin_user", user.id, null, null);
			return { codes, token: await create_session(tx, user.id) };
		});
		event.cookies.delete(ENROLL_COOKIE, { path: "/" });
		set_session_cookie(event, result.token);
		return { codes: result.codes };
	},
);
export const manage_totp = form(
	v.object({
		password: PASSWORD,
		code: v.pipe(v.string(), v.maxLength(64)),
		action: v.picklist(["disable", "regenerate"]),
	}),
	async ({ password, code, action }) => {
		const { user, event } = await require_user();
		const account = await confirm_password(user.id, password);
		const result = await transaction(client, async (tx) => {
			const fresh = await select_one(
				tx,
				"SELECT * FROM admin_user WHERE id = ? AND password_hash = ? AND suspended_at IS NULL",
				[user.id, account.password_hash],
			);
			if (
				!fresh?.totp_secret ||
				!(await consume_second_factor(
					tx,
					user.id,
					String(fresh.totp_secret),
					code,
					parse_keyring(AUTH_TOTP_ENCRYPTION_KEYS),
				))
			)
				error(400, "Código inválido.");
			const codes = action === "regenerate" ? await replace_recovery_codes(tx, user.id) : [];
			if (action === "disable") {
				await tx.execute({
					sql: "UPDATE admin_user SET totp_secret = NULL, totp_last_step = NULL, updated_at = ? WHERE id = ?",
					args: [Date.now(), user.id],
				});
				await tx.execute({
					sql: "DELETE FROM admin_recovery_code WHERE user_id = ?",
					args: [user.id],
				});
			}
			await tx.execute({ sql: "DELETE FROM admin_session WHERE user_id = ?", args: [user.id] });
			await tx.execute({
				sql: "DELETE FROM admin_login_challenge WHERE user_id = ?",
				args: [user.id],
			});
			await audit(tx, user.id, "totp_" + action, "admin_user", user.id, null, null);
			return { codes, token: await create_session(tx, user.id) };
		});
		set_session_cookie(event, result.token);
		return { codes: result.codes, message: "Seguridad actualizada." };
	},
);
