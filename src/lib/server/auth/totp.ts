import { Secret, TOTP } from "otpauth";
import type { SqlExecutor } from "../cms/transactions";
import { decrypt_secret, digest_token, random_token, type Keyring } from "./crypto";

export function new_totp(email: string) {
	return new TOTP({
		issuer: "OMEC",
		label: email,
		algorithm: "SHA1",
		digits: 6,
		period: 30,
		secret: new Secret({ size: 20 }),
	});
}
export function verify_totp(secret: string, code: string, now = Date.now()): number | null {
	if (!/^\d{6}$/.test(code)) return null;
	const totp = new TOTP({
		secret: Secret.fromBase32(secret),
		algorithm: "SHA1",
		digits: 6,
		period: 30,
	});
	const delta = totp.validate({ token: code, timestamp: now, window: 1 });
	return delta === null ? null : Math.floor(now / 30_000) + delta;
}
export async function consume_second_factor(
	tx: SqlExecutor,
	user_id: string,
	encrypted: string,
	code: string,
	keyring: Keyring,
) {
	if (/^[0-9a-f]{32}$/.test(code)) {
		const used = await tx.execute({
			sql: "DELETE FROM admin_recovery_code WHERE user_id = ? AND digest = ? RETURNING digest",
			args: [user_id, await digest_token(code)],
		});
		return used.rows.length === 1;
	}
	const step = verify_totp(await decrypt_secret(encrypted, keyring), code);
	if (step === null) return false;
	const used = await tx.execute({
		sql: "UPDATE admin_user SET totp_last_step = ? WHERE id = ? AND (totp_last_step IS NULL OR totp_last_step < ?) RETURNING id",
		args: [step, user_id, step],
	});
	return used.rows.length === 1;
}
export async function replace_recovery_codes(tx: SqlExecutor, user_id: string) {
	await tx.execute({ sql: "DELETE FROM admin_recovery_code WHERE user_id = ?", args: [user_id] });
	const codes = Array.from({ length: 10 }, () => random_token().slice(0, 32));
	for (const code of codes)
		await tx.execute({
			sql: "INSERT INTO admin_recovery_code (digest, user_id) VALUES (?, ?)",
			args: [await digest_token(code), user_id],
		});
	return codes;
}
