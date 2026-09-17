import type { SqlExecutor } from "../cms/transactions";
import { digest_token, random_token } from "./crypto";
export const CHALLENGE_LIFETIME_MS = 5 * 60 * 1000;
export async function create_login_challenge(tx: SqlExecutor, user_id: string, now = Date.now()) {
	const token = random_token();
	await tx.execute({
		sql: "INSERT INTO admin_login_challenge (digest, user_id, expires_at) VALUES (?, ?, ?)",
		args: [await digest_token(token), user_id, now + CHALLENGE_LIFETIME_MS],
	});
	return token;
}
export async function consume_login_challenge(tx: SqlExecutor, digest: string, now = Date.now()) {
	const result = await tx.execute({
		sql: "DELETE FROM admin_login_challenge WHERE digest = ? AND expires_at > ? RETURNING user_id",
		args: [digest, now],
	});
	return result.rows[0]?.user_id ?? null;
}
