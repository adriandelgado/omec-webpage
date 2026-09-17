import type { SqlExecutor } from "../cms/transactions";
import { digest_token } from "./crypto";
export const RATE_WINDOW_MS = 15 * 60 * 1000;
export const RATE_MAX_ATTEMPTS = 8;
// Reserve attempts before expensive verification; a write transaction serializes parallel failures.
export async function reserve_attempt(
	tx: SqlExecutor,
	email: string,
	ip: string,
	phase: string,
	now = Date.now(),
) {
	let allowed = true;
	for (const identifier of ["email:" + email.trim().toLowerCase(), "ip:" + ip]) {
		const key = await digest_token(phase + ":" + identifier);
		const result = await tx.execute({
			sql: "INSERT INTO auth_rate_limit (key, attempts, resets_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET attempts = CASE WHEN resets_at <= ? THEN 1 ELSE attempts + 1 END, resets_at = CASE WHEN resets_at <= ? THEN ? ELSE resets_at END RETURNING attempts",
			args: [key, now + RATE_WINDOW_MS, now, now, now + RATE_WINDOW_MS],
		});
		if (Number(result.rows[0].attempts) > RATE_MAX_ATTEMPTS) allowed = false;
	}
	return allowed;
}
