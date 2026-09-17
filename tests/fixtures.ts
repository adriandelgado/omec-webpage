import type { Client } from "@libsql/client";
import { readdir, readFile } from "node:fs/promises";
import {
	COLLECTIONS,
	definition,
	type Collection,
	type RecordData,
} from "../src/lib/server/cms/registry";
import { hash_password } from "../src/lib/server/auth/crypto";

export const TEST_PASSWORD = "Prueba-segura-2026";
export const TEST_KEYS = JSON.stringify({ current: "v1", keys: { v1: "12".repeat(32) } });
export async function apply_migrations(client: Client) {
	for (const file of (await readdir("drizzle")).filter((name) => name.endsWith(".sql")).sort())
		await client.executeMultiple(await readFile("drizzle/" + file, "utf8"));
}
export function fixture_record(name: Collection): RecordData {
	const def = definition(name);
	const data: RecordData = {};
	for (const field of def.fields) {
		data[field.name] = !field.required
			? null
			: (field.options[0] ?? (field.numeric ? (field.name === "sort_order" ? 0 : 1) : "Ejemplo"));
		if (field.primary) data[field.name] = field.options[0] ?? (field.numeric ? 1 : "fixture");
		if (field.name === "edition_year") data[field.name] = 2026;
		if (field.name === "slug") data[field.name] = "fixture";
		if (field.name.endsWith("href") && !field.options.length)
			data[field.name] = "https://example.org";
		if (field.name.includes("email") && !field.name.endsWith("href"))
			data[field.name] = "prueba@example.org";
		if (field.name === "date_label") data[field.name] = "Por confirmar";
		if (["sponsor_id", "team_member_id", "card_number"].includes(field.name))
			data[field.name] = "fixture";
		if (field.name === "page_key")
			data[field.name] = name === "sponsor_placement" ? "home" : "about";
		if (field.name === "role") data[field.name] = "Director";
		if (field.name === "image_alt") data[field.name] = "Imagen de prueba";
	}
	return data;
}
export async function seed_content(client: Client) {
	for (const name of Object.keys(COLLECTIONS) as Collection[]) {
		const data = fixture_record(name);
		await client.execute({
			sql:
				'INSERT INTO "' +
				name +
				'" (' +
				Object.keys(data)
					.map((key) => '"' + key + '"')
					.join(",") +
				") VALUES (" +
				Object.keys(data)
					.map(() => "?")
					.join(",") +
				")",
			args: Object.values(data),
		});
	}
}
export async function seed_accounts(client: Client) {
	const hash = await hash_password(TEST_PASSWORD, JSON.parse(TEST_KEYS));
	for (const [index, role] of ["superadmin", "admin", "editor"].entries()) {
		const id = (index + 1).toString().repeat(8) + "-1111-4111-8111-111111111111";
		await client.execute({
			sql: "INSERT INTO admin_user (id,email,name,role,password_hash,must_change_password,created_at,updated_at) VALUES (?,?,?,?,?,0,1,1)",
			args: [id, role + "@example.org", role, role, hash],
		});
	}
}
