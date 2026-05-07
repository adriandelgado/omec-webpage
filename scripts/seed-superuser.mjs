import { createClient } from "@libsql/client";
import { argon2id } from "hash-wasm";
import { randomBytes, randomUUID } from "node:crypto";

const database_url = process.env.SEED_DATABASE_URL ?? "file:local.db";
const superuser_email = process.env.SUPERUSER_EMAIL ?? "superuser@example.com";
const superuser_password = process.env.SUPERUSER_PASSWORD ?? "superuser-password";
const superuser_full_name = process.env.SUPERUSER_FULL_NAME ?? "Local Superuser";

if (!database_url.startsWith("file:")) {
	throw new Error("This seed script is local-only. Use a file: URL in SEED_DATABASE_URL.");
}

const client = createClient({ url: database_url });
const now = Date.now();

async function hash_password(password) {
	return argon2id({
		password,
		salt: randomBytes(16),
		parallelism: 1,
		iterations: 2,
		memorySize: 19456,
		hashLength: 32,
		outputType: "encoded",
	});
}

async function get_existing_user_id(email) {
	const result = await client.execute({
		sql: 'select id from "user" where email = ? limit 1',
		args: [email],
	});

	return result.rows[0]?.id;
}

async function get_role_id(role_key) {
	const result = await client.execute({
		sql: "select id from role where key = ? limit 1",
		args: [role_key],
	});

	return result.rows[0]?.id;
}

async function get_permission_id(permission_key) {
	const result = await client.execute({
		sql: "select id from permission where key = ? limit 1",
		args: [permission_key],
	});

	return result.rows[0]?.id;
}

async function seed_superuser() {
	const user_id = (await get_existing_user_id(superuser_email)) ?? randomUUID();
	const password_hash = await hash_password(superuser_password);

	await client.batch([
		{
			sql: `
				insert into "user" (
					id,
					email,
					password_hash,
					full_name,
					email_verified_at,
					last_password_changed_at,
					created_at,
					updated_at
				)
				values (?, ?, ?, ?, ?, ?, ?, ?)
				on conflict(email) do update set
					password_hash = excluded.password_hash,
					full_name = excluded.full_name,
					email_verified_at = excluded.email_verified_at,
					last_password_changed_at = excluded.last_password_changed_at,
					updated_at = excluded.updated_at
			`,
			args: [user_id, superuser_email, password_hash, superuser_full_name, now, now, now, now],
		},
		{
			sql: `
				insert into role (key, label, description, created_at, updated_at)
				values (?, ?, ?, ?, ?)
				on conflict(key) do update set
					label = excluded.label,
					description = excluded.description,
					updated_at = excluded.updated_at
			`,
			args: ["superuser", "Superuser", "Local development superuser role.", now, now],
		},
		{
			sql: `
				insert into permission (key, description, created_at, updated_at)
				values (?, ?, ?, ?)
				on conflict(key) do update set
					description = excluded.description,
					updated_at = excluded.updated_at
			`,
			args: ["superuser:all", "Full local development access.", now, now],
		},
	]);

	const role_id = await get_role_id("superuser");
	const permission_id = await get_permission_id("superuser:all");

	if (!role_id || !permission_id) {
		throw new Error("Failed to resolve seeded role or permission IDs.");
	}

	await client.batch([
		{
			sql: "insert or ignore into user_role (user_id, role_id, created_at) values (?, ?, ?)",
			args: [user_id, role_id, now],
		},
		{
			sql: "insert or ignore into role_permission (role_id, permission_id, created_at) values (?, ?, ?)",
			args: [role_id, permission_id, now],
		},
	]);

	console.log("Seeded local superuser:");
	console.log(`  database: ${database_url}`);
	console.log(`  email: ${superuser_email}`);
	console.log(`  password: ${superuser_password}`);
}

await seed_superuser();
