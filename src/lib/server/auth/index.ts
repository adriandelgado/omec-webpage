import { dev } from "$app/environment";
import { encodeBase32, encodeHex } from "@std/encoding";
import type { RequestEvent } from "@sveltejs/kit";
import * as v from "valibot";

export const SESSION_COOKIE_NAME = "auth-session";
const DAY_IN_MS = 1000 * 60 * 60 * 24;
const SESSION_DURATION_MS = 7 * DAY_IN_MS;
const REMEMBER_ME_SESSION_DURATION_MS = 30 * DAY_IN_MS;

export type AuthUser = {
	id: string;
	email: string;
	full_name: string;
	role_keys: string[];
	permission_keys: string[];
};

export type AuthSession = {
	id: string;
	user_id: string;
	expires_at: Date;
	remember_me: boolean;
};

type Token = {
	session_id: string;
	secret: string;
};

const kv_session_record_schema = v.object({
	session_id: v.string(),
	user_id: v.string(),
	expires_at: v.number(),
	remember_me: v.boolean(),
	secret_hash: v.string(),
	created_at: v.number(),
	last_password_changed_at: v.number(),
	revoked_at: v.nullable(v.number()),
	user: v.object({
		email: v.string(),
		full_name: v.string(),
	}),
	role_keys: v.array(v.string()),
	permission_keys: v.array(v.string()),
	user_agent: v.nullable(v.string()),
});

type CreateSessionInput = {
	user: {
		id: string;
		email: string;
		full_name: string;
		last_password_changed_at: Date;
	};
	role_keys: string[];
	permission_keys: string[];
	remember_me?: boolean;
	expires_at?: Date;
};

type ValidateSessionResult = {
	session: AuthSession | null;
	user: AuthUser | null;
};

function constant_time_equal(a: Uint8Array, b: Uint8Array) {
	if (a.length !== b.length) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < a.length; i++) {
		c |= a[i] ^ b[i];
	}
	return c === 0;
}

function generate_secure_random_string() {
	const secret_bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32(secret_bytes);
}

function get_session_kv(event: RequestEvent) {
	const session_kv = event.platform?.env.SESSION_KV;

	if (!session_kv) {
		console.error("`env.SESSION_KV` was not found");
		return null;
	}

	return session_kv;
}

export function generate_session_token(): Token {
	const session_id = generate_secure_random_string();
	const secret = generate_secure_random_string();
	return { session_id, secret };
}

async function hash_secret(secret: string) {
	const secret_bytes = new TextEncoder().encode(secret);
	const secret_digest = await crypto.subtle.digest("SHA-256", secret_bytes);
	return encodeHex(new Uint8Array(secret_digest));
}

export async function create_session(
	token: Token,
	session_input: CreateSessionInput,
	event: RequestEvent,
) {
	const session_kv = get_session_kv(event);

	if (!session_kv) {
		return null;
	}

	const now = Date.now();
	const expires_at =
		session_input.expires_at ??
		new Date(
			now + (session_input.remember_me ? REMEMBER_ME_SESSION_DURATION_MS : SESSION_DURATION_MS),
		);
	if (expires_at.getTime() <= now) {
		throw new Error("Session expiration must be in the future");
	}
	const secret_hash = await hash_secret(token.secret);
	const session = {
		session_id: token.session_id,
		user_id: session_input.user.id,
		secret_hash,
		created_at: now,
		last_password_changed_at: session_input.user.last_password_changed_at.getTime(),
		remember_me: session_input.remember_me ?? false,
		revoked_at: null,
		user: {
			email: session_input.user.email,
			full_name: session_input.user.full_name,
		},
		role_keys: session_input.role_keys,
		permission_keys: session_input.permission_keys,
		user_agent: event.request.headers.get("user-agent"),
		expires_at: expires_at.getTime(),
	};

	const session_ttl_seconds = Math.max(1, Math.ceil((session.expires_at - now) / 1000));

	await session_kv.put(token.session_id, JSON.stringify(session), {
		expirationTtl: session_ttl_seconds,
	});

	return session;
}

export function parse_token(raw_token: string): Token | null {
	if (raw_token.length > 255) return null;
	const token_parts = raw_token.split(".");
	if (token_parts.length !== 2) return null;
	const [session_id, secret] = token_parts;
	if (!session_id || !secret) return null;
	return { session_id, secret };
}

export async function validate_session_token(
	event: RequestEvent,
	token: Token,
): Promise<ValidateSessionResult> {
	const session_kv = get_session_kv(event);
	const user_agent = event.request.headers.get("user-agent");

	if (!session_kv) {
		return {
			session: null,
			user: null,
		};
	}

	const raw_session_record = await session_kv.get(token.session_id, "json");

	if (!raw_session_record) {
		return {
			session: null,
			user: null,
		};
	}

	const session_record_result = v.safeParse(kv_session_record_schema, raw_session_record);

	if (!session_record_result.success) {
		console.error("Malformed session record in SESSION_KV", session_record_result.issues);
		await session_kv.delete(token.session_id);

		return {
			session: null,
			user: null,
		};
	}

	const session_record = session_record_result.output;

	if (session_record.session_id !== token.session_id) {
		console.error("SESSION_KV record key mismatch", {
			key: token.session_id,
			session_id: session_record.session_id,
		});
		await session_kv.delete(token.session_id);

		return {
			session: null,
			user: null,
		};
	}

	if (session_record.revoked_at !== null) {
		await session_kv.delete(token.session_id);

		return {
			session: null,
			user: null,
		};
	}

	if (session_record.created_at < session_record.last_password_changed_at) {
		await session_kv.delete(token.session_id);

		return {
			session: null,
			user: null,
		};
	}

	const encoded_token_secret = new TextEncoder().encode(await hash_secret(token.secret));
	const encoded_session_secret = new TextEncoder().encode(session_record.secret_hash);

	if (!constant_time_equal(encoded_token_secret, encoded_session_secret)) {
		return {
			session: null,
			user: null,
		};
	}

	const session_expired = Date.now() >= session_record.expires_at;

	if (session_expired) {
		await session_kv.delete(token.session_id);

		return {
			session: null,
			user: null,
		};
	}

	if (session_record.user_agent && user_agent && session_record.user_agent !== user_agent) {
		return {
			session: null,
			user: null,
		};
	}

	return {
		session: {
			id: session_record.session_id,
			user_id: session_record.user_id,
			expires_at: new Date(session_record.expires_at),
			remember_me: session_record.remember_me,
		},
		user: {
			id: session_record.user_id,
			email: session_record.user.email,
			full_name: session_record.user.full_name,
			role_keys: session_record.role_keys,
			permission_keys: session_record.permission_keys,
		},
	};
}

export async function invalidate_session(event: RequestEvent, session_id: string) {
	const session_kv = get_session_kv(event);

	if (!session_kv) {
		return;
	}

	await session_kv.delete(session_id);
}

export function delete_session_token_cookie(event: Pick<RequestEvent, "cookies">) {
	event.cookies.delete(SESSION_COOKIE_NAME, {
		path: "/",
	});
}

export function set_session_token_cookie(
	event: Pick<RequestEvent, "cookies">,
	token: Token,
	expires_at: Date,
) {
	event.cookies.set(SESSION_COOKIE_NAME, token.session_id + "." + token.secret, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: !dev,
		expires: expires_at,
	});
}
