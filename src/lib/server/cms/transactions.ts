import type { Client, Transaction, InValue } from "@libsql/client";

export type SqlExecutor = Pick<Client, "execute"> | Transaction;
const FORBIDDEN_KEYS = /password|pepper|token|secret|recovery|digest|body|code|key/i;
export function sanitize_audit(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(sanitize_audit);
	if (value && typeof value === "object")
		return Object.fromEntries(
			Object.entries(value)
				.filter(([key]) => !FORBIDDEN_KEYS.test(key))
				.map(([key, item]) => [key, sanitize_audit(item)]),
		);
	return value;
}
export async function audit(
	tx: SqlExecutor,
	actor_id: string | null,
	action: string,
	entity_type: string,
	entity_id: string,
	before: unknown,
	after: unknown,
) {
	await tx.execute({
		sql: "INSERT INTO audit_event (actor_id, action, entity_type, entity_id, before_json, after_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
		args: [
			actor_id,
			action,
			entity_type,
			entity_id,
			JSON.stringify(sanitize_audit(before)),
			JSON.stringify(sanitize_audit(after)),
			Date.now(),
		],
	});
}
export async function transaction<T>(
	client: Client,
	work: (tx: Transaction) => Promise<T>,
): Promise<T> {
	const tx = await client.transaction("write");
	try {
		const result = await work(tx);
		await tx.commit();
		return result;
	} catch (error) {
		await tx.rollback();
		throw error;
	} finally {
		tx.close();
	}
}
export async function select_one(tx: SqlExecutor, sql: string, args: InValue[] = []) {
	return (await tx.execute({ sql, args })).rows[0];
}
