import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { createClient, type Client } from "@libsql/client";
import { readFile, readdir, mkdtemp, copyFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mutate_content } from "./content";
import { reorder_content } from "./ordering";
import { audit, transaction, sanitize_audit } from "./transactions";
import {
	definition,
	validate_record,
	safe_url,
	COLLECTIONS,
	type Collection,
	type RecordData,
} from "./registry";
import {
	create_session,
	resolve_session,
	session_expired,
	SESSION_IDLE_MS,
	SESSION_LIFETIME_MS,
	type AdminIdentity,
} from "../auth/sessions";
import { can_edit_article } from "../auth/permissions";
import { digest_token, encrypt_secret } from "../auth/crypto";
import { new_totp, verify_totp, consume_second_factor, replace_recovery_codes } from "../auth/totp";
import { reserve_attempt } from "../auth/rate-limit";
import { validate_file } from "../media/files";
import { media_references } from "../media/references";
import { seed_content } from "../../../../tests/fixtures";
import {
	create_login_challenge,
	consume_login_challenge,
	CHALLENGE_LIFETIME_MS,
} from "../auth/challenges";
import { existsSync } from "node:fs";

vi.mock("$app/env", () => ({ dev: true }));
const ADMIN: AdminIdentity = {
	id: "11111111-1111-4111-8111-111111111111",
	email: "admin@example.org",
	name: "Admin",
	role: "superadmin",
	must_change_password: false,
};
const EDITOR: AdminIdentity = {
	...ADMIN,
	id: "22222222-2222-4222-8222-222222222222",
	email: "editor@example.org",
	role: "editor",
};
const KEYS = { current: "v1", keys: { v1: "11".repeat(32) } };
let client: Client;
async function migrations(target: Client, after = "") {
	for (const file of (await readdir("drizzle"))
		.filter((name) => name.endsWith(".sql") && name > after)
		.sort())
		await target.executeMultiple(await readFile(join("drizzle", file), "utf8"));
}
async function seed_user(user: AdminIdentity) {
	await client.execute({
		sql: "INSERT INTO admin_user (id,email,name,role,password_hash,must_change_password,created_at,updated_at) VALUES (?,?,?,?,?,0,1,1)",
		args: [user.id, user.email, user.name, user.role, "test"],
	});
}
beforeEach(async () => {
	const directory = await mkdtemp(join(tmpdir(), "omec-cms-test-"));
	client = createClient({ url: "file:" + join(directory, "test.db") });
	await migrations(client);
	await seed_user(ADMIN);
	await seed_user(EDITOR);
});
afterEach(() => client.close());
function news(slug: string, owner_id: string | null = ADMIN.id): RecordData {
	return {
		slug,
		category: "Noticias",
		date_label: null,
		published_on: "2026-09-17",
		author: "Autor público",
		title: "Título",
		summary: "Resumen",
		link_label: "Leer",
		body_markdown: "# Noticia",
		sort_order: 0,
		owner_id,
		status: "published",
	};
}
describe("migrations and transactional content", () => {
	it("updates every content family and archives/restores every repeatable family", async () => {
		await seed_content(client);
		await client.execute("UPDATE national_olympiad SET is_current = 0");
		for (const name of Object.keys(COLLECTIONS) as Collection[]) {
			const def = definition(name);
			const row = (await client.execute('SELECT * FROM "' + name + '" LIMIT 1')).rows[0];
			const key = Object.fromEntries(def.keys.map((k) => [k, row[k]])) as RecordData;
			const data = Object.fromEntries(def.fields.map((f) => [f.name, row[f.name]])) as RecordData;
			if (name === "national_olympiad") data.is_current = 0;
			if (name === "contact_submission") data.status = "read";
			const saved = await mutate_content(client, ADMIN, {
				collection: name,
				action: "save",
				key,
				data,
				updated_at: Number(row.updated_at),
			});
			expect(saved.message).toBe("Cambios guardados.");
			if (!def.singleton && name !== "contact_submission") {
				const archived = await mutate_content(client, ADMIN, {
					collection: name,
					action: "archive",
					key,
					data,
					updated_at: saved.updated_at,
				});
				const restored = await mutate_content(client, ADMIN, {
					collection: name,
					action: "restore",
					key,
					data,
					updated_at: archived.updated_at,
				});
				expect(restored.updated_at).toBeGreaterThan(archived.updated_at);
			}
		}
		expect((await client.execute("PRAGMA foreign_key_check")).rows).toEqual([]);
	});
	it("migrates a populated pre-CMS database without changing existing news", async () => {
		const old = createClient({ url: "file::memory:" });
		try {
			await old.executeMultiple(await readFile("drizzle/0000_real_stellaris.sql", "utf8"));
			await old.execute(
				"INSERT INTO news_article (slug,category,published_on,author,title,summary,link_label,body_markdown,sort_order) VALUES ('existing','News','2026-01-01','A','Title','Summary','Read','Body',0)",
			);
			await old.execute(
				"INSERT INTO about_content (seo_title,seo_description,seo_image_alt,alert,labor_eyebrow,labor_title,labor_description,labor_image_alt,members_heading,team_eyebrow,team_title) VALUES ('a','a','a','a','a','a','a','a','a','a','a')",
			);
			await old.execute(
				"INSERT INTO about_value_card (number,title,sort_order) VALUES ('one','Value',0)",
			);
			await migrations(old, "0000_real_stellaris.sql");
			const row = (await old.execute("SELECT * FROM news_article")).rows[0];
			expect(row.status).toBe("published");
			expect(row.owner_id).toBeNull();
			expect(row.body_markdown).toBe("Body");
			expect((await old.execute("PRAGMA foreign_key_check")).rows).toEqual([]);
			expect(
				(await old.execute("SELECT updated_at FROM about_value_card")).rows[0].updated_at,
			).toBe(0);
		} finally {
			old.close();
		}
	});
	it.skipIf(!existsSync("omec-webpage.db"))(
		"can migrate a copy of the project's populated database",
		async () => {
			const directory = await mkdtemp(join(tmpdir(), "omec-migration-"));
			await copyFile("omec-webpage.db", join(directory, "copy.db"));
			const copy = createClient({ url: "file:" + join(directory, "copy.db") });
			try {
				const count = (await copy.execute("SELECT count(*) AS count FROM news_article")).rows[0]
					.count;
				await migrations(copy, "0000_real_stellaris.sql");
				expect(
					(
						await copy.execute(
							"SELECT count(*) AS count FROM news_article WHERE status = 'published'",
						)
					).rows[0].count,
				).toBe(count);
				expect((await copy.execute("PRAGMA foreign_key_check")).rows).toEqual([]);
			} finally {
				copy.close();
			}
		},
	);
	it("creates published slug redirects and rejects stale edits without an audit event", async () => {
		const data = news("first");
		const saved = await mutate_content(client, ADMIN, {
			collection: "news_article",
			action: "create",
			key: { slug: "first" },
			data,
			updated_at: null,
		});
		await mutate_content(client, ADMIN, {
			collection: "news_article",
			action: "save",
			key: { slug: "first" },
			data: { ...data, slug: "second" },
			updated_at: saved.updated_at,
		});
		expect((await client.execute("SELECT * FROM news_slug_redirect")).rows[0].article_slug).toBe(
			"second",
		);
		await expect(
			mutate_content(client, ADMIN, {
				collection: "news_article",
				action: "save",
				key: { slug: "second" },
				data: { ...data, slug: "second" },
				updated_at: saved.updated_at,
			}),
		).rejects.toMatchObject({ status: 409 });
		expect((await client.execute("SELECT count(*) AS count FROM audit_event")).rows[0].count).toBe(
			2,
		);
	});
	it("enforces ownership, suspension, final-superadmin protection and immutable audits", async () => {
		expect(can_edit_article(EDITOR, null)).toBe(false);
		expect(can_edit_article(EDITOR, EDITOR.id)).toBe(true);
		const data = news("owned");
		const saved = await mutate_content(client, ADMIN, {
			collection: "news_article",
			action: "create",
			key: { slug: "owned" },
			data,
			updated_at: null,
		});
		await expect(
			mutate_content(client, EDITOR, {
				collection: "news_article",
				action: "save",
				key: { slug: "owned" },
				data: { ...data, owner_id: EDITOR.id },
				updated_at: saved.updated_at,
			}),
		).rejects.toMatchObject({ status: 403 });
		await expect(
			client.execute({
				sql: "UPDATE admin_user SET role = 'admin' WHERE id = ?",
				args: [ADMIN.id],
			}),
		).rejects.toThrow();
		await expect(
			client.execute({ sql: "DELETE FROM admin_user WHERE id = ?", args: [ADMIN.id] }),
		).rejects.toThrow();
		await expect(client.execute("DELETE FROM audit_event")).rejects.toThrow();
		await client.execute({
			sql: "UPDATE admin_user SET suspended_at = 1 WHERE id = ?",
			args: [EDITOR.id],
		});
		await expect(
			mutate_content(client, EDITOR, {
				collection: "news_article",
				action: "create",
				key: { slug: "own" },
				data: news("own", EDITOR.id),
				updated_at: null,
			}),
		).rejects.toMatchObject({ status: 403 });
	});
	it("rolls content and audit back together", async () => {
		await expect(
			transaction(client, async (tx) => {
				await audit(tx, ADMIN.id, "test", "test", "1", null, null);
				throw new Error("rollback");
			}),
		).rejects.toThrow("rollback");
		expect((await client.execute("SELECT * FROM audit_event")).rows).toHaveLength(0);
	});
	it("archives, reuses ordering positions, restores at the end and reorders atomically", async () => {
		const data = news("one");
		const saved = await mutate_content(client, ADMIN, {
			collection: "news_article",
			action: "create",
			key: { slug: "one" },
			data,
			updated_at: null,
		});
		const archived = await mutate_content(client, ADMIN, {
			collection: "news_article",
			action: "archive",
			key: { slug: "one" },
			data,
			updated_at: saved.updated_at,
		});
		const second = await mutate_content(client, ADMIN, {
			collection: "news_article",
			action: "create",
			key: { slug: "two" },
			data: news("two"),
			updated_at: null,
		});
		const restored = await mutate_content(client, ADMIN, {
			collection: "news_article",
			action: "restore",
			key: { slug: "one" },
			data,
			updated_at: archived.updated_at,
		});
		expect(
			(await client.execute("SELECT sort_order FROM news_article WHERE slug = 'one'")).rows[0]
				.sort_order,
		).toBe(1);
		await reorder_content(client, ADMIN, "news_article", [
			{ key: { slug: "one" }, updated_at: restored.updated_at },
			{ key: { slug: "two" }, updated_at: second.updated_at },
		]);
		expect(
			(await client.execute("SELECT slug FROM news_article ORDER BY sort_order")).rows.map(
				(r) => r.slug,
			),
		).toEqual(["one", "two"]);
	});
});
describe("authentication state", () => {
	it("consumes a login challenge once and rejects it at the five-minute deadline", async () => {
		const token = await create_login_challenge(client, ADMIN.id, 100);
		expect(await consume_login_challenge(client, await digest_token(token), 101)).toBe(ADMIN.id);
		expect(await consume_login_challenge(client, await digest_token(token), 102)).toBeNull();
		const expired = await create_login_challenge(client, ADMIN.id, 100);
		expect(
			await consume_login_challenge(
				client,
				await digest_token(expired),
				100 + CHALLENGE_LIFETIME_MS,
			),
		).toBeNull();
	});
	it("stores session digests, rotates sessions and applies idle/absolute expiry and suspension", async () => {
		const token = await create_session(client, ADMIN.id);
		const session = await resolve_session(client, token);
		expect(session?.user.id).toBe(ADMIN.id);
		expect((await client.execute("SELECT digest FROM admin_session")).rows[0].digest).toBe(
			await digest_token(token),
		);
		const rotated = await create_session(client, ADMIN.id, session!.digest);
		expect(await resolve_session(client, token)).toBeNull();
		expect(await resolve_session(client, rotated)).not.toBeNull();
		expect(
			session_expired({ last_seen_at: 1, expires_at: SESSION_LIFETIME_MS }, SESSION_IDLE_MS + 1),
		).toBe(true);
		expect(session_expired({ last_seen_at: 100, expires_at: 101 }, 101)).toBe(true);
		await client.execute({
			sql: "UPDATE admin_session SET last_seen_at = 0 WHERE digest = ?",
			args: [await digest_token(rotated)],
		});
		expect(await resolve_session(client, rotated)).toBeNull();
		const editor_token = await create_session(client, EDITOR.id);
		await client.execute({
			sql: "UPDATE admin_user SET suspended_at = 1 WHERE id = ?",
			args: [EDITOR.id],
		});
		expect(await resolve_session(client, editor_token)).toBeNull();
	});
	it("limits attempts by email and IP atomically and resets the window", async () => {
		const attempts = [];
		for (let i = 0; i < 9; i++)
			attempts.push(
				await transaction(client, (tx) =>
					reserve_attempt(tx, " USER@example.org ", "127.0.0.1", "password", 100),
				),
			);
		expect(attempts).toEqual([true, true, true, true, true, true, true, true, false]);
		expect(
			await transaction(client, (tx) =>
				reserve_attempt(tx, "other@example.org", "127.0.0.1", "password", 100),
			),
		).toBe(false);
		expect(
			await transaction(client, (tx) =>
				reserve_attempt(tx, "user@example.org", "other", "password", 1_000_000),
			),
		).toBe(true);
	});
	it("accepts TOTP within one window and consumes each step and recovery code once", async () => {
		const totp = new_totp(ADMIN.email),
			now = Date.now();
		const code = totp.generate({ timestamp: now });
		expect(verify_totp(totp.secret.base32, code, now)).not.toBeNull();
		expect(verify_totp(totp.secret.base32, code, now + 90_000)).toBeNull();
		const encrypted = await encrypt_secret(totp.secret.base32, KEYS);
		expect(await consume_second_factor(client, ADMIN.id, encrypted, code, KEYS)).toBe(true);
		expect(await consume_second_factor(client, ADMIN.id, encrypted, code, KEYS)).toBe(false);
		const codes = await replace_recovery_codes(client, ADMIN.id);
		expect(new Set(codes).size).toBe(10);
		expect(await consume_second_factor(client, ADMIN.id, encrypted, codes[0], KEYS)).toBe(true);
		expect(await consume_second_factor(client, ADMIN.id, encrypted, codes[0], KEYS)).toBe(false);
	});
});
describe("validation and media", () => {
	it("validates every registered content family with strict fields and Spanish errors", () => {
		for (const name of Object.keys(COLLECTIONS) as Collection[]) {
			expect(definition(name).keys.length).toBeGreaterThan(0);
			expect(() => validate_record(name, { injected: "value" })).toThrow("Revisa los campos");
		}
		expect(() => validate_record("news_article", { ...news("valid"), status: "bad" })).toThrow();
		expect(() =>
			validate_record("news_article", { ...news("valid"), published_on: "2026-02-30" }),
		).toThrow();
		expect(safe_url("javascript:alert(1)")).toBe(false);
		expect(safe_url("//evil.example")).toBe(false);
		expect(safe_url("/noticias")).toBe(true);
	});
	it("sanitizes nested audit material and detects media references", async () => {
		expect(
			sanitize_audit({
				name: "A",
				password_hash: "secret",
				nested: { token: "secret", body_markdown: "body", title: "T" },
			}),
		).toEqual({ name: "A", nested: { title: "T" } });
		const id = "33333333-3333-4333-8333-333333333333";
		await client.execute({
			sql: "INSERT INTO media_asset (id,object_key,original_filename,mime_type,size,uploader_id,created_at,updated_at) VALUES (?,?,?,'image/png',24,?,1,1)",
			args: [id, id, "test.png", ADMIN.id],
		});
		await client.execute({
			sql: "INSERT INTO sponsor (id,name,image_alt,media_id) VALUES ('sponsor','Sponsor','Alt',?)",
			args: [id],
		});
		expect(await media_references(client, id)).toContain("Patrocinadores");
	});
	it("rejects spoofed extensions, active SVG, bad signatures and oversize media", () => {
		const svg = new TextEncoder().encode(
			'<svg width="10" height="20"><rect width="10" height="20"/></svg>',
		);
		expect(validate_file("test.svg", "image/svg+xml", svg)).toEqual({ width: 10, height: 20 });
		expect(() => validate_file("test.png", "image/png", svg)).toThrow();
		expect(() => validate_file("test.jpg", "image/svg+xml", svg)).toThrow();
		expect(() =>
			validate_file(
				"test.svg",
				"image/svg+xml",
				new TextEncoder().encode('<svg width="1" height="1"><script>alert(1)</script></svg>'),
			),
		).toThrow();
		expect(() =>
			validate_file("test.png", "image/png", new Uint8Array(10 * 1024 * 1024 + 1)),
		).toThrow();
	});
});
